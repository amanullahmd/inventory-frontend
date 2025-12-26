import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { DateFilterService } from './dateFilterService'

/**
 * Interfaces for PDF export service
 */

export interface ExportOptions {
  filename: string
  title: string
  timestamp: Date
}

export interface StockTransaction {
  id: number
  item: string
  quantity: number
  date: string
  user: string
  reason?: string
}

export interface InventoryItem {
  id: string
  name: string
  sku: string
  unitCost: number
  currentStock: number
  categoryId: string
  categoryName: string
}

export interface Category {
  id: string
  name: string
  description: string
  color: string
  createdAt: string
}

/**
 * Service for generating PDF exports
 */
export class PDFExportService {
  private static readonly PAGE_WIDTH = 210 // A4 width in mm
  private static readonly PAGE_HEIGHT = 297 // A4 height in mm
  private static readonly MARGIN = 10
  private static readonly HEADER_HEIGHT = 30

  /**
   * Generates a Stock In PDF
   */
  static generateStockInPDF(transactions: StockTransaction[], options: ExportOptions): void {
    const doc = new jsPDF()
    let yPosition = this.MARGIN

    // Add header
    yPosition = this.addHeader(doc, options.title, options.timestamp, transactions.length)

    // Add table
    const tableData = transactions.map(tx => [
      tx.item,
      tx.quantity.toString(),
      tx.date,
      tx.user,
    ])

    autoTable(doc, {
      head: [['Item', 'Quantity', 'Date', 'User']],
      body: tableData,
      startY: yPosition,
      margin: this.MARGIN,
      didDrawPage: (data) => {
        this.addFooter(doc, data)
      },
    })

    // Download
    this.downloadPDF(doc, options.filename)
  }

  /**
   * Generates a Stock Out PDF
   */
  static generateStockOutPDF(transactions: StockTransaction[], options: ExportOptions): void {
    const doc = new jsPDF()
    let yPosition = this.MARGIN

    // Add header
    yPosition = this.addHeader(doc, options.title, options.timestamp, transactions.length)

    // Add table
    const tableData = transactions.map(tx => [
      tx.item,
      tx.quantity.toString(),
      tx.reason || 'N/A',
      tx.date,
      tx.user,
    ])

    autoTable(doc, {
      head: [['Item', 'Quantity', 'Reason', 'Date', 'User']],
      body: tableData,
      startY: yPosition,
      margin: this.MARGIN,
      didDrawPage: (data) => {
        this.addFooter(doc, data)
      },
    })

    // Download
    this.downloadPDF(doc, options.filename)
  }

  /**
   * Generates a Stock Movements History PDF
   */
  static generateStockMovementsPDF(movements: any[], options: ExportOptions): void {
    const doc = new jsPDF()
    let yPosition = this.MARGIN

    // Add header
    yPosition = this.addHeader(doc, options.title, options.timestamp, movements.length)

    // Add table
    const tableData = movements.map(m => [
      m.movementType,
      m.itemName,
      m.quantity.toString(),
      m.reason || '—',
      m.recipient || '—',
      m.userName,
      new Date(m.createdAt).toLocaleDateString(),
    ])

    autoTable(doc, {
      head: [['Type', 'Item', 'Qty', 'Reason', 'Recipient', 'User', 'Date']],
      body: tableData,
      startY: yPosition,
      margin: this.MARGIN,
      didDrawPage: (data) => {
        this.addFooter(doc, data)
      },
    })

    // Download
    this.downloadPDF(doc, options.filename)
  }

  /**
   * Generates a Reason Breakdown PDF
   */
  static generateReasonBreakdownPDF(reasons: any[], options: ExportOptions & { dateRange?: any }): void {
    const doc = new jsPDF()
    let yPosition = this.MARGIN

    // Add header
    yPosition = this.addHeader(doc, options.title, options.timestamp, reasons.length)

    // Add date range if provided
    if (options.dateRange) {
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      const startDate = new Date(options.dateRange.start).toLocaleDateString()
      const endDate = new Date(options.dateRange.end).toLocaleDateString()
      doc.text(`Period: ${startDate} to ${endDate}`, this.MARGIN, yPosition, {})
      yPosition += 8
    }

    // Add table
    const tableData = reasons.map(r => [
      r.reasonLabel,
      r.count.toString(),
      `${r.percentage.toFixed(1)}%`,
    ])

    autoTable(doc, {
      head: [['Reason', 'Count', 'Percentage']],
      body: tableData,
      startY: yPosition,
      margin: this.MARGIN,
      didDrawPage: (data) => {
        this.addFooter(doc, data)
      },
    })

    // Download
    this.downloadPDF(doc, options.filename)
  }

  /**
   * Generates an Inventory Snapshot PDF
   */
  static generateInventoryPDF(
    items: InventoryItem[],
    categories: Category[],
    options: ExportOptions
  ): void {
    const doc = new jsPDF()
    let yPosition = this.MARGIN

    // Add header
    yPosition = this.addHeader(doc, options.title, options.timestamp, items.length)

    // Group items by category
    const itemsByCategory = this.groupItemsByCategory(items)

    // Add items by category
    for (const [categoryName, categoryItems] of Object.entries(itemsByCategory)) {
      // Add category heading
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text(`${categoryName}`, this.MARGIN, yPosition, {})
      yPosition += 8

      // Add table for this category
      const tableData = categoryItems.map(item => [
        item.name,
        item.sku,
        this.formatCurrency(item.unitCost),
        item.currentStock.toString(),
        this.formatCurrency(item.currentStock * item.unitCost),
      ])

      const startY = yPosition
      autoTable(doc, {
        head: [['Item', 'SKU', 'Unit Cost', 'Stock', 'Total Value']],
        body: tableData,
        startY: yPosition,
        margin: this.MARGIN,
        didDrawPage: (data) => {
          this.addFooter(doc, data)
        },
      })

      yPosition = (doc as any).lastAutoTable.finalY + 10
    }

    // Add summary statistics
    yPosition += 5
    this.addSummaryStatistics(doc, yPosition, items)

    // Download
    this.downloadPDF(doc, options.filename)
  }

  /**
   * Adds header to PDF
   */
  private static addHeader(doc: jsPDF, title: string, timestamp: Date, count: number): number {
    const pageWidth = doc.internal.pageSize.getWidth()

    // Title
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(title, this.MARGIN, this.MARGIN + 5, {})

    // Timestamp and count
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const formattedDate = DateFilterService.formatDateForDisplay(timestamp)
    const formattedTime = timestamp.toLocaleTimeString()
    doc.text(`Generated: ${formattedDate} ${formattedTime}`, this.MARGIN, this.MARGIN + 12, {})
    doc.text(`Total Records: ${count}`, this.MARGIN, this.MARGIN + 18, {})

    // Horizontal line
    doc.setDrawColor(200)
    doc.line(this.MARGIN, this.MARGIN + 22, pageWidth - this.MARGIN, this.MARGIN + 22)

    return this.MARGIN + 28
  }

  /**
   * Adds footer to PDF
   */
  private static addFooter(doc: jsPDF, data: any): void {
    const pageSize = doc.internal.pageSize
    const pageHeight = pageSize.getHeight()
    const pageWidth = pageSize.getWidth()
    const pageCount = (doc as any).internal.pages.length - 1

    // Get current page number
    const currentPage = data.pageNumber || 1

    // Add page number
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(128)
    doc.text(
      `Page ${currentPage}`,
      pageWidth / 2,
      pageHeight - 5,
      { align: 'center' }
    )
  }

  /**
   * Adds summary statistics to PDF
   */
  private static addSummaryStatistics(doc: jsPDF, yPosition: number, items: InventoryItem[]): void {
    const totalItems = items.length
    const totalValue = items.reduce((sum, item) => sum + item.currentStock * item.unitCost, 0)
    const lowStockCount = items.filter(item => item.currentStock < 10).length
    const outOfStockCount = items.filter(item => item.currentStock === 0).length

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Summary Statistics', this.MARGIN, yPosition, {})

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    yPosition += 8

    doc.text(`Total Items: ${totalItems}`, this.MARGIN, yPosition, {})
    yPosition += 6
    doc.text(`Total Inventory Value: ${this.formatCurrency(totalValue)}`, this.MARGIN, yPosition, {})
    yPosition += 6
    doc.text(`Low Stock Items (< 10): ${lowStockCount}`, this.MARGIN, yPosition, {})
    yPosition += 6
    doc.text(`Out of Stock Items: ${outOfStockCount}`, this.MARGIN, yPosition, {})
  }

  /**
   * Groups items by category
   */
  private static groupItemsByCategory(items: InventoryItem[]): Record<string, InventoryItem[]> {
    return items.reduce(
      (acc, item) => {
        if (!acc[item.categoryName]) {
          acc[item.categoryName] = []
        }
        acc[item.categoryName].push(item)
        return acc
      },
      {} as Record<string, InventoryItem[]>
    )
  }

  /**
   * Formats a number as currency
   */
  private static formatCurrency(value: number): string {
    return `$${value.toFixed(2)}`
  }

  /**
   * Downloads the PDF
   */
  private static downloadPDF(doc: jsPDF, filename: string): void {
    doc.save(filename)
  }
}
