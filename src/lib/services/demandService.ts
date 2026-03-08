import { apiClient } from "@/lib/api/client";
import { NotificationService } from "./notificationService";

export type DemandStatus =
  | "PENDING_DIVISION_ADMIN"
  | "PENDING_CENTRAL_MANAGER"
  | "APPROVED"
  | "REJECTED"
  | "RECEIVED";

export interface Demand {
  demandId: number;
  demandCode: string;
  employeeId?: number;
  employeeCode?: string;
  demanderName?: string;
  position?: string;
  grade?: string;
  status?: DemandStatus;
  note?: string;
  rejectionReason?: string;
  approvedAt?: string;
  approvedBy?: string;
  itemId: number;
  itemName: string;
  sku: string;
  unit?: string;
  warehouseId?: number;
  warehouseName?: string;
  requestedByName?: string;
  requestedByRole?: string;
  createdAt: string;
  updatedAt?: string;
  items?: Array<{
    demandItemId: number;
    itemId: number;
    sku: string;
    name: string;
    units: number;
  }>;
}

export interface CreateDemandRequest {
  employeeId?: number;
  itemId?: number;
  unit?: string;
  status?: DemandStatus;
  note?: string;
  items?: Array<{ itemId: number; units: number }>;
  requestedByName?: string;
  requestedByRole?: string;
}

export interface UpdateDemandRequest {
  demandCode?: string;
  employeeId?: number;
  itemId?: number;
  unit?: string;
  status?: DemandStatus;
  note?: string;
  rejectionReason?: string;
  approvedAt?: string;
  approvedBy?: string;
  items?: Array<{ itemId: number; units: number }>;
}

const STORAGE_KEY = "dpe_local_demands";

export class DemandService {
  private static getLocalDemands(): Demand[] {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private static saveLocalDemands(demands: Demand[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demands));
  }

  static async getDemands(): Promise<Demand[]> {
    const local = this.getLocalDemands().map((d) => {
      const status =
        (d.status as string) === "DRAFT" ? "PENDING_DIVISION_ADMIN" : d.status;
      return { ...d, status } as Demand;
    });

    // We can also include logic to merge with API data if needed,
    // but the user asked for "localstorage database".
    try {
      const res = await apiClient
        .get<Demand[]>("/demands")
        .catch(() => ({ data: [] }));
      const apiDemands = Array.isArray(res.data) ? res.data : [];

      // Merge: Local demands take precedence if IDs clash,
      // but usually local will have unique IDs (timestamps or random)
      const merged = [...local];
      apiDemands.forEach((apiD) => {
        if (!merged.find((l) => l.demandId === apiD.demandId)) {
          merged.push(apiD);
        }
      });
      return merged.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } catch {
      return local;
    }
  }

  static async createDemand(payload: CreateDemandRequest): Promise<Demand> {
    const local = this.getLocalDemands();
    const newDemand: Demand = {
      ...payload,
      demandId: Date.now(),
      demandCode: `DM-L-${Date.now().toString().slice(-4)}`,
      status: payload.status || "PENDING_DIVISION_ADMIN",
      itemName: "Local Item", // Fallback
      sku: "LOCAL",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Demand;

    // Notification Logic
    if (payload.requestedByRole === "DIVISION_USER") {
      NotificationService.addNotification({
        title: "New Demand Request",
        message: `A new demand has been created by ${payload.requestedByName || "a division user"}.`,
        type: "demand",
        link: "/demand",
        targetRoles: ["DIVISION_ADMIN", "ADMIN", "CENTRAL"],
      });
    } else if (payload.requestedByRole === "DIVISION_ADMIN") {
      newDemand.status = "PENDING_CENTRAL_MANAGER";
      NotificationService.addNotification({
        title: "Demand Approval Required",
        message: `Division Admin ${payload.requestedByName || "a division admin"} created a demand for central approval.`,
        type: "demand",
        link: "/demand",
        targetRoles: ["CENTRAL", "ADMIN"],
      });
    } else if (
      payload.requestedByRole === "CENTRAL" ||
      payload.requestedByRole === "ADMIN"
    ) {
      newDemand.status = "PENDING_CENTRAL_MANAGER";
      NotificationService.addNotification({
        title: "New Central Demand",
        message: `Admin ${payload.requestedByName || "a central user"} created a demand.`,
        type: "demand",
        link: "/demand",
        targetRoles: ["CENTRAL", "ADMIN"],
      });
    }

    const updated = [newDemand, ...local];
    this.saveLocalDemands(updated);
    return newDemand;
  }

  static async getDemand(id: number): Promise<Demand> {
    const local = this.getLocalDemands();
    const found = local.find((d) => d.demandId === id);
    if (found) return found;

    const res = await apiClient.get<Demand>(`/demands/${id}`);
    return res.data;
  }

  static async updateDemand(
    id: number,
    payload: UpdateDemandRequest,
  ): Promise<Demand> {
    const local = this.getLocalDemands();
    const index = local.findIndex((d) => d.demandId === id);

    if (index !== -1) {
      // Logic for status change notifications
      const oldStatus = local[index].status;
      const newStatus = payload.status;

      const updatedDemand: Demand = {
        ...local[index],
        ...payload,
        updatedAt: new Date().toISOString(),
      } as any; // Bypass strict item type checking for local session

      if (oldStatus !== newStatus && newStatus === "PENDING_CENTRAL_MANAGER") {
        NotificationService.addNotification({
          title: "Demand Approved by Division",
          message: `Demand ${updatedDemand.demandCode} is now pending central approval.`,
          type: "demand",
          link: "/demand",
          targetRoles: ["CENTRAL", "ADMIN"],
        });
      }

      if (
        oldStatus !== newStatus &&
        (newStatus === "APPROVED" || newStatus === "REJECTED")
      ) {
        NotificationService.addNotification({
          title: `Demand ${newStatus === "APPROVED" ? "Approved" : "Rejected"}`,
          message: `Your demand ${updatedDemand.demandCode} has been ${newStatus.toLowerCase()}.`,
          type: "demand",
          link: "/demand",
          targetRoles: ["DIVISION_USER", "DIVISION_ADMIN"], // Notify creators
        });
      }

      local[index] = updatedDemand;
      this.saveLocalDemands(local);
      return updatedDemand;
    }

    const res = await apiClient.put<Demand>(`/demands/${id}`, payload);
    return res.data;
  }

  static async deleteDemand(id: number): Promise<void> {
    const local = this.getLocalDemands();
    const updated = local.filter((d) => d.demandId !== id);
    this.saveLocalDemands(updated);

    try {
      await apiClient.delete<void>(`/demands/${id}`).catch(() => {});
    } catch {}
  }
}
