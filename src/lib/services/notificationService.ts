export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "demand" | "info" | "warning";
  link: string;
  isRead: boolean;
  targetRoles?: string[]; // New: Filter by role
  createdAt: string;
}

const STORAGE_KEY = "dpe_notifications";

export class NotificationService {
  static getNotifications(role?: string): Notification[] {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    const notifications: Notification[] = stored ? JSON.parse(stored) : [];

    if (role) {
      return notifications.filter(
        (n) => !n.targetRoles || n.targetRoles.includes(role),
      );
    }
    return notifications;
  }

  static addNotification(
    notification: Omit<Notification, "id" | "isRead" | "createdAt">,
  ): Notification {
    const notifications = this.getNotifications();
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substring(2, 9),
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [newNotification, ...notifications].slice(0, 50); // Keep last 50
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Dispatch custom event for real-time updates in components
    window.dispatchEvent(new Event("dpe-notifications-updated"));

    return newNotification;
  }

  static markAsRead(id: string): void {
    const notifications = this.getNotifications();
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n,
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("dpe-notifications-updated"));
  }

  static markAllAsRead(): void {
    const notifications = this.getNotifications();
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("dpe-notifications-updated"));
  }

  static getUnreadCount(role?: string): number {
    return this.getNotifications(role).filter((n) => !n.isRead).length;
  }

  static clearNotifications(): void {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("dpe-notifications-updated"));
  }
}
