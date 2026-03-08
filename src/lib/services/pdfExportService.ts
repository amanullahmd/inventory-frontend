import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// import { solaimanFontBase64 } from "@/lib/fonts/solaiman";
import { DateFilterService } from "./dateFilterService";

export interface ExportOptions {
  filename: string;
  title: string;
  timestamp: Date;
  details?: Record<string, string>;
}

export interface StockTransaction {
  id: number;
  item: string;
  quantity: number;
  date: string;
  user: string;
  reason?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  unitCost?: number;
  currentStock: number;
  categoryId: string;
  categoryName: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
}

export class PDFExportService {
  private static readonly PAGE_WIDTH = 210;
  private static readonly PAGE_HEIGHT = 297;
  private static readonly MARGIN = 10;

  /**
   * Basic Bengali shaper to handle vowel reordering for jsPDF
   * This handles the most common case: ি (i-kar), ে (e-kar), ৈ (ai-kar) reordering
   */
  private static reshapeBengali(text: string): string {
    if (!text) return "";

    // Regex to find a consonant (or consonant + hasant + consonant) followed by a reorderable vowel
    // Consonants: \u0995-\u09B9
    // Hasant: \u09CD
    // Reorderable vowels: ি (\u09BF), ে (\u09C7), ৈ (\u09C8)

    let reshaped = text;

    // Simple vowel reordering: [consonant][vowel] -> [vowel][consonant]
    // Consonant range covers most common characters.
    // This is a naive shaper; full shaping requires a complex engine,
    // but this fixes the most glaring "broken" look in jsPDF.

    const reorderableVowels =
      /([\u0995-\u09B9][\u09CD]?[\u0995-\u09B9]?)([\u09BF\u09C7\u09C8])/g;
    reshaped = reshaped.replace(reorderableVowels, "$2$1");

    return reshaped;
  }

  private static async getBase64ImageFromUrl(
    imageUrl: string,
  ): Promise<string> {
    try {
      const res = await fetch(imageUrl);
      if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
      const blob = await res.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      console.warn(`Failed to fetch image ${imageUrl}`, e);
      return "";
    }
  }

  private static async loadFont(): Promise<string> {
    try {
      const fontResponse = await fetch("/solaimanlipi.ttf");
      if (!fontResponse.ok) {
        throw new Error(`Failed to fetch font: ${fontResponse.statusText}`);
      }
      const fontBuffer = await fontResponse.arrayBuffer();
      const fontBase64 = btoa(
        new Uint8Array(fontBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          "",
        ),
      );
      return fontBase64;
    } catch (e) {
      console.warn("Failed to load font", e);
      return "";
    }
  }

  private static async getCommonImages() {
    const logo = await this.getBase64ImageFromUrl("/bd_logo.png");
    const signature = await this.getBase64ImageFromUrl("/signature.png");
    const fontBase64 = await this.loadFont();

    return { logo, signature, fontBase64 };
  }

  private static addReusableHeader(
    doc: jsPDF,
    title: string,
    timestamp: Date,
    count: number,
    logoBase64: string,
    details?: Record<string, string>,
  ): number {
    const pageWidth = doc.internal.pageSize.getWidth();
    let currentY = this.MARGIN;

    if (logoBase64) {
      doc.addImage(logoBase64, "PNG", this.MARGIN, currentY, 20, 20);
    }
    const textStartX = logoBase64 ? this.MARGIN + 25 : this.MARGIN;

    const reshapedTitle = this.reshapeBengali(title);

    doc.setFontSize(16);
    doc.setFont("solaiman", "normal");
    if (!doc.getFontList()["solaiman"]) doc.setFont("helvetica", "bold");

    doc.text(reshapedTitle, textStartX, currentY + 6, {});

    doc.setFontSize(10);
    doc.setFont("solaiman", "normal");
    if (!doc.getFontList()["solaiman"]) doc.setFont("helvetica", "normal");
    const formattedDate = DateFilterService.formatDateForDisplay(timestamp);
    const formattedTime = timestamp.toLocaleTimeString();
    doc.text(
      `Generated: ${formattedDate} ${formattedTime}`,
      textStartX,
      currentY + 12,
      {},
    );
    doc.text(`Total Records: ${count}`, textStartX, currentY + 17, {});

    currentY += 22;

    if (details) {
      doc.setFontSize(10);
      const entries = Object.entries(details);
      entries.forEach(([key, value]) => {
        doc.setFont("solaiman", "normal");
        if (!doc.getFontList()["solaiman"]) doc.setFont("helvetica", "bold");
        doc.text(`${this.reshapeBengali(key)}:`, textStartX, currentY, {});

        const keyWidth = doc.getTextWidth(`${key}: `);
        doc.setFont("solaiman", "normal");
        if (!doc.getFontList()["solaiman"]) doc.setFont("helvetica", "normal");
        doc.text(
          this.reshapeBengali(value),
          textStartX + keyWidth,
          currentY,
          {},
        );

        currentY += 5;
      });
      currentY += 2;
    }

    doc.setDrawColor(200);
    doc.line(this.MARGIN, currentY, pageWidth - this.MARGIN, currentY);

    return currentY + 5;
  }

  private static addSignatures(
    doc: jsPDF,
    startY: number,
    signatureBase64: string,
  ): void {
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = this.MARGIN;
    const signatureWidth = 40;
    const signatureHeight = 15;

    if (startY + signatureHeight + 15 > doc.internal.pageSize.getHeight()) {
      doc.addPage();
      startY = margin + 10;
    } else {
      startY += 20;
    }

    const authX = pageWidth - margin - signatureWidth;
    if (signatureBase64) {
      try {
        doc.addImage(
          signatureBase64,
          "PNG",
          authX,
          startY,
          signatureWidth,
          signatureHeight,
        );
      } catch (e) {
        console.warn("Failed to draw signature image", e);
      }
    }
    doc.setLineDashPattern([], 0);
    doc.setDrawColor(0);
    doc.line(
      authX,
      startY + signatureHeight,
      authX + signatureWidth,
      startY + signatureHeight,
    );
    doc.setFontSize(10);

    doc.setFont("solaiman", "normal");
    if (!doc.getFontList()["solaiman"]) doc.setFont("helvetica", "normal");

    doc.text(
      "Authorized By",
      authX + signatureWidth / 2,
      startY + signatureHeight + 5,
      { align: "center" },
    );

    // Removed Prepared By section as requested
  }

  private static addFooter(doc: jsPDF, data: { pageNumber: number }): void {
    const pageSize = doc.internal.pageSize;
    const pageHeight = pageSize.getHeight();
    const pageWidth = pageSize.getWidth();
    const currentPage = data.pageNumber || 1;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(128);
    doc.text(`Page ${currentPage}`, pageWidth / 2, pageHeight - 5, {
      align: "center",
    });
  }

  private static downloadPDF(doc: jsPDF, filename: string): void {
    doc.save(filename);
  }

  static async generateReusableTablePDF(
    columns: string[],
    data: any[][],
    options: ExportOptions,
  ): Promise<void> {
    const doc = new jsPDF();
    const { logo, signature, fontBase64 } = await this.getCommonImages();

    if (fontBase64) {
      const cleanBase64 = fontBase64.replace(/^data:font\/\w+;base64,/, "");
      doc.addFileToVFS("solaiman.ttf", cleanBase64);
      doc.addFont("solaiman.ttf", "solaiman", "normal");
      doc.setFont("solaiman", "normal");
    }

    const yPosition = this.addReusableHeader(
      doc,
      options.title,
      options.timestamp,
      data.length,
      logo,
      options.details,
    );

    autoTable(doc, {
      head: [columns.map((c) => this.reshapeBengali(c))],
      body: data.map((row) =>
        row.map((r) => this.reshapeBengali(String(r || ""))),
      ),
      startY: yPosition,
      margin: this.MARGIN,
      styles: {
        font: fontBase64 ? "solaiman" : "helvetica",
      },
      headStyles: {
        font: fontBase64 ? "solaiman" : "helvetica",
        fontStyle: fontBase64 ? "normal" : "bold",
      },
      didDrawPage: (pData) => this.addFooter(doc, pData),
    });

    const finalY = (doc as any).lastAutoTable.finalY || yPosition;
    this.addSignatures(doc, finalY, signature);
    this.downloadPDF(doc, options.filename);
  }

  static async generateStockInPDF(
    transactions: StockTransaction[],
    options: ExportOptions,
  ): Promise<void> {
    const columns = ["Item", "Quantity", "Date", "User"];
    const data = transactions.map((tx) => [
      tx.item,
      tx.quantity,
      tx.date,
      tx.user,
    ]);
    await this.generateReusableTablePDF(columns, data, options);
  }

  static async generateStockOutPDF(
    transactions: StockTransaction[],
    options: ExportOptions,
  ): Promise<void> {
    const columns = ["Item", "Quantity", "Reason", "Date", "User"];
    const data = transactions.map((tx) => [
      tx.item,
      tx.quantity,
      tx.reason || "N/A",
      tx.date,
      tx.user,
    ]);
    await this.generateReusableTablePDF(columns, data, options);
  }

  static async generateStockMovementsPDF(
    movements: {
      movementType: string;
      itemName: string;
      quantity: number;
      reason?: string;
      recipient?: string;
      userName: string;
      createdAt: string | Date;
    }[],
    options: ExportOptions,
  ): Promise<void> {
    const columns = [
      "Type",
      "Item",
      "Qty",
      "Reason",
      "Recipient",
      "User",
      "Date",
    ];
    const data = movements.map((m) => [
      m.movementType,
      m.itemName,
      m.quantity,
      m.reason || "—",
      m.recipient || "—",
      m.userName,
      new Date(m.createdAt).toLocaleDateString(),
    ]);
    await this.generateReusableTablePDF(columns, data, options);
  }

  static async generateReasonBreakdownPDF(
    reasons: { reasonLabel: string; count: number; percentage: number }[],
    options: ExportOptions & {
      dateRange?: { start: string | Date; end: string | Date };
    },
  ): Promise<void> {
    if (options.dateRange) {
      if (!options.details) options.details = {};
      const startDate = new Date(options.dateRange.start).toLocaleDateString();
      const endDate = new Date(options.dateRange.end).toLocaleDateString();
      options.details["Period"] = `${startDate} to ${endDate}`;
    }
    const columns = ["Reason", "Count", "Percentage"];
    const data = reasons.map((r) => [
      r.reasonLabel,
      r.count,
      `${r.percentage.toFixed(1)}%`,
    ]);
    await this.generateReusableTablePDF(columns, data, options);
  }

  static async generateInventoryPDF(
    items: InventoryItem[],
    categories: Category[],
    options: ExportOptions,
  ): Promise<void> {
    const doc = new jsPDF();
    const { logo, signature, fontBase64 } = await this.getCommonImages();

    if (fontBase64) {
      const cleanBase64 = fontBase64.replace(/^data:font\/\w+;base64,/, "");
      doc.addFileToVFS("solaiman.ttf", cleanBase64);
      doc.addFont("solaiman.ttf", "solaiman", "normal");
      doc.setFont("solaiman", "normal");
    }

    let yPosition = this.addReusableHeader(
      doc,
      options.title,
      options.timestamp,
      items.length,
      logo,
      options.details,
    );

    const itemsByCategory = items.reduce(
      (acc, item) => {
        if (!acc[item.categoryName]) {
          acc[item.categoryName] = [];
        }
        acc[item.categoryName].push(item);
        return acc;
      },
      {} as Record<string, InventoryItem[]>,
    );

    for (const [categoryName, categoryItems] of Object.entries(
      itemsByCategory,
    )) {
      doc.setFontSize(12);
      doc.setFont("solaiman", "normal");
      if (!doc.getFontList()["solaiman"]) doc.setFont("helvetica", "bold");
      doc.text(
        `${this.reshapeBengali(categoryName)}`,
        this.MARGIN,
        yPosition,
        {},
      );
      yPosition += 8;

      const tableData = categoryItems.map((item) => [
        item.name,
        item.sku,
        `$${(item.unitCost ?? 0).toFixed(2)}`,
        item.currentStock.toString(),
        `$${(item.currentStock * (item.unitCost ?? 0)).toFixed(2)}`,
      ]);

      autoTable(doc, {
        head: [
          ["Item", "SKU", "Unit Cost", "Stock", "Total Value"].map((h) =>
            this.reshapeBengali(h),
          ),
        ],
        body: tableData.map((row) =>
          row.map((cell) => this.reshapeBengali(String(cell))),
        ),
        startY: yPosition,
        margin: this.MARGIN,
        styles: {
          font: fontBase64 ? "solaiman" : "helvetica",
        },
        headStyles: {
          font: fontBase64 ? "solaiman" : "helvetica",
          fontStyle: fontBase64 ? "normal" : "bold",
        },
        didDrawPage: (pData) => this.addFooter(doc, pData),
      });
      yPosition = (doc as any).lastAutoTable.finalY + 10;
    }

    const totalItems = items.length;
    const totalValue = items.reduce(
      (sum, item) => sum + item.currentStock * (item.unitCost ?? 0),
      0,
    );
    const lowStockCount = items.filter((item) => item.currentStock < 10).length;
    const outOfStockCount = items.filter(
      (item) => item.currentStock === 0,
    ).length;

    yPosition += 5;
    doc.setFontSize(12);
    doc.setFont("solaiman", "normal");
    if (!doc.getFontList()["solaiman"]) doc.setFont("helvetica", "bold");
    doc.text("Summary Statistics", this.MARGIN, yPosition, {});
    doc.setFontSize(10);
    doc.setFont("solaiman", "normal");
    if (!doc.getFontList()["solaiman"]) doc.setFont("helvetica", "normal");
    yPosition += 8;
    doc.text(`Total Items: ${totalItems}`, this.MARGIN, yPosition, {});
    yPosition += 6;
    doc.text(
      `Total Inventory Value: $${totalValue.toFixed(2)}`,
      this.MARGIN,
      yPosition,
      {},
    );
    yPosition += 6;
    doc.text(
      `Low Stock Items (< 10): ${lowStockCount}`,
      this.MARGIN,
      yPosition,
      {},
    );
    yPosition += 6;
    doc.text(
      `Out of Stock Items: ${outOfStockCount}`,
      this.MARGIN,
      yPosition,
      {},
    );

    const finalY = yPosition + 10;
    this.addSignatures(doc, finalY, signature);
    this.downloadPDF(doc, options.filename);
  }

  static async generateCategoryPDF(
    categories: any[],
    options: ExportOptions,
  ): Promise<void> {
    const columns = ["Name", "ID", "Description", "Items", "Created"];
    const data = categories.map((cat) => [
      cat.name,
      cat.code || "—",
      cat.description || "—",
      cat.itemCount || 0,
      new Date(cat.createdAt).toLocaleDateString(),
    ]);
    await this.generateReusableTablePDF(columns, data, options);
  }

  static async generateMostUsedPDF(
    items: any[],
    options: ExportOptions,
  ): Promise<void> {
    const columns = ["Rank", "Item Name", "SKU", "Category", "Total Used"];
    const data = items.map((item, index) => [
      index + 1,
      item.name,
      item.sku,
      item.categoryName || "—",
      item.totalUsed,
    ]);
    await this.generateReusableTablePDF(columns, data, options);
  }

  static async generateEmployeePDF(
    employees: any[],
    options: ExportOptions,
  ): Promise<void> {
    const columns = [
      "ID",
      "Name",
      "Grade",
      "Position",
      "Branch",
      "Mobile",
      "Email",
    ];
    const data = employees.map((emp) => [
      emp.employeeCode,
      emp.name,
      emp.grade || "—",
      emp.position || "—",
      emp.branchName || "—",
      emp.mobileNumber || "—",
      emp.email || "—",
    ]);
    await this.generateReusableTablePDF(columns, data, options);
  }

  static async generateDemandPDF(
    demand: any,
    options: ExportOptions,
  ): Promise<void> {
    const doc = new jsPDF();
    const { logo, signature, fontBase64 } = await this.getCommonImages();

    if (fontBase64) {
      const cleanBase64 = fontBase64.replace(/^data:font\/\w+;base64,/, "");
      doc.addFileToVFS("solaiman.ttf", cleanBase64);
      doc.addFont("solaiman.ttf", "solaiman", "normal");
      doc.setFont("solaiman", "normal");
    }

    const details = {
      "Demand Code": demand.demandCode || `DM-${demand.demandId}`,
      Status: (demand.status || "PENDING").replace(/_/g, " "),
      "Requested By": demand.requestedByName || "N/A",
      Role: (demand.requestedByRole || "N/A").replace(/_/g, " "),
      "Created At": new Date(demand.createdAt).toLocaleString(),
      ...(demand.note ? { Note: demand.note } : {}),
    };

    const yPosition = this.addReusableHeader(
      doc,
      options.title,
      options.timestamp,
      demand.items?.length || 1,
      logo,
      details,
    );

    const columns = ["Item Name", "SKU", "Units"];
    let tableData: any[][] = [];

    if (demand.items && demand.items.length > 0) {
      tableData = demand.items.map((it: any) => [
        it.name || it.itemName || "N/A",
        it.sku || "N/A",
        it.units.toString(),
      ]);
    } else {
      tableData = [
        [
          demand.itemName || "N/A",
          demand.sku || "N/A",
          demand.unit || demand.units || "1",
        ],
      ];
    }

    autoTable(doc, {
      head: [columns.map((c) => this.reshapeBengali(c))],
      body: tableData.map((row) =>
        row.map((r) => this.reshapeBengali(String(r || ""))),
      ),
      startY: yPosition,
      margin: this.MARGIN,
      styles: {
        font: fontBase64 ? "solaiman" : "helvetica",
      },
      headStyles: {
        font: fontBase64 ? "solaiman" : "helvetica",
        fontStyle: fontBase64 ? "normal" : "bold",
      },
      didDrawPage: (pData) => this.addFooter(doc, pData),
    });

    const finalY = (doc as any).lastAutoTable.finalY || yPosition;
    this.addSignatures(doc, finalY, signature);
    this.downloadPDF(doc, options.filename);
  }
}
