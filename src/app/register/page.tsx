'use client'
// Updated export system v2

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import SuccessMessage from '@/components/ui/SuccessMessage'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { DateRangePicker } from '@/components/ui/DateRangePicker'
import { ExportButton } from '@/components/ui/ExportButton'
import { PDFExportService, ExportOptions } from '@/lib/services/pdfExportService'
import { DateFilterService } from '@/lib/services/dateFilterService'
import { StockService } from '@/lib/services/stockService'
import { stockOutService } from '@/lib/services/stockOutService'
import { formatDateDMY } from '@/lib/utils/date'

export interface StockInTransaction {
    id: string;
    type: 'IN';
    date: string;
    reference: string;
    user: string;
    details: string;
    itemCount: number;
    // New fields
    broughtForward: number;
    supplierName: string;
    challanNo: string;
    presentReceipts: number;
}

export interface StockOutTransaction {
    id: string;
    type: 'OUT';
    date: string;
    reference: string;
    user: string;
    details: string;
    itemCount: number;
    // New fields
    divisionName: string;
    requisitionNo: string;
    lastDeliveryDate: string;
    quantitySupplied: number;
    balance: number;
    remarks: string;
}

// Dummy data covering ALL columns (old + new)
const DUMMY_STOCK_IN: StockInTransaction[] = [
    {
        id: 'IN-001',
        type: 'IN',
        date: new Date().toISOString(),
        reference: 'REF-IN-2026-001',
        user: 'John Doe',
        details: 'Initial supply of electronics',
        itemCount: 100,
        broughtForward: 50,
        supplierName: 'Acme Corp',
        challanNo: 'CH-2026-001',
        presentReceipts: 100,
    },
    {
        id: 'IN-002',
        type: 'IN',
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
        reference: 'REF-IN-2026-002',
        user: 'Jane Smith',
        details: 'Stationery items restock',
        itemCount: 75,
        broughtForward: 150,
        supplierName: 'Global Supplies',
        challanNo: 'CH-2026-002',
        presentReceipts: 75,
    },
    {
        id: 'IN-003',
        type: 'IN',
        date: new Date(Date.now() - 86400000 * 5).toISOString(),
        reference: 'REF-IN-2026-003',
        user: 'Admin User',
        details: 'Hardware components for servers',
        itemCount: 50,
        broughtForward: 225,
        supplierName: 'Tech Hardware Ltd',
        challanNo: 'CH-2026-003',
        presentReceipts: 50,
    }
];

const DUMMY_STOCK_OUT: StockOutTransaction[] = [
    {
        id: 'OUT-001',
        type: 'OUT',
        date: new Date().toISOString(),
        reference: 'REF-OUT-2026-001',
        user: 'Alice Johnson',
        details: 'Laptops for new hires',
        itemCount: 10,
        divisionName: 'IT Department',
        requisitionNo: 'REQ-101',
        lastDeliveryDate: new Date(Date.now() - 86400000 * 10).toISOString(),
        quantitySupplied: 10,
        balance: 265,
        remarks: 'New laptops for team',
    },
    {
        id: 'OUT-002',
        type: 'OUT',
        date: new Date(Date.now() - 86400000 * 1).toISOString(),
        reference: 'REF-OUT-2026-002',
        user: 'Bob Williams',
        details: 'Monthly office supplies',
        itemCount: 5,
        divisionName: 'HR Department',
        requisitionNo: 'REQ-102',
        lastDeliveryDate: new Date(Date.now() - 86400000 * 15).toISOString(),
        quantitySupplied: 5,
        balance: 260,
        remarks: 'Office supplies',
    },
    {
        id: 'OUT-003',
        type: 'OUT',
        date: new Date(Date.now() - 86400000 * 3).toISOString(),
        reference: 'REF-OUT-2026-003',
        user: 'Charlie Brown',
        details: 'Printer cartridges and paper',
        itemCount: 20,
        divisionName: 'Finance',
        requisitionNo: 'REQ-103',
        lastDeliveryDate: new Date(Date.now() - 86400000 * 20).toISOString(),
        quantitySupplied: 20,
        balance: 240,
        remarks: 'Printers and ink',
    }
];

export default function RegisterPage() {
    const { data: session } = useSession()

    const [stockIn, setStockIn] = useState<StockInTransaction[]>([])
    const [stockOut, setStockOut] = useState<StockOutTransaction[]>([])
    const [filteredStockIn, setFilteredStockIn] = useState<StockInTransaction[]>([])
    const [filteredStockOut, setFilteredStockOut] = useState<StockOutTransaction[]>([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [exportLoading, setExportLoading] = useState(false)
    const [showExportPanel, setShowExportPanel] = useState(false)
    const [exportType, setExportType] = useState<'stock-in' | 'stock-out'>('stock-in')
    const [exportDateRange, setExportDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' })

    const [selectedDateRange, setSelectedDateRange] = useState<{ start: Date; end: Date } | null>(null)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [inData, outData] = await Promise.allSettled([
                StockService.getStockInTransactions(),
                stockOutService.getAll()
            ])

            const stockInArr: StockInTransaction[] = []
            const stockOutArr: StockOutTransaction[] = []

            if (inData.status === 'fulfilled') {
                inData.value.forEach((row: any) => {
                    stockInArr.push({
                        id: `in-${row.referenceNumber || Math.random()}`,
                        type: 'IN',
                        date: row.createdAt || new Date().toISOString(),
                        reference: row.referenceNumber || 'N/A',
                        user: row.createdBy || 'System',
                        details: row.supplierName ? `Supplier: ${row.supplierName}` : (row.sourceMode || 'Stock In'),
                        itemCount: row.count || 0,
                        // Dummy data for new columns (if API doesn't provide them)
                        broughtForward: Math.floor(Math.random() * 100),
                        supplierName: row.supplierName || 'Acme Corp (Gen)',
                        challanNo: `CH-${Math.floor(Math.random() * 1000)}`,
                        presentReceipts: Math.floor(Math.random() * 50)
                    })
                })
            }

            if (outData.status === 'fulfilled') {
                outData.value.forEach((row: any) => {
                    stockOutArr.push({
                        id: `out-${row.id || Math.random()}`,
                        type: 'OUT',
                        date: row.stockOutDate || row.createdAt || new Date().toISOString(),
                        reference: row.referenceNumber || `OUT-${row.id}`,
                        user: row.employeeName || 'System',
                        details: `${row.stockOutType}: ${row.itemName} (Qty: ${row.quantity}) ${row.note ? `- ${row.note}` : ''}`,
                        itemCount: 1,
                        // Dummy data for new columns (if API doesn't provide them)
                        divisionName: 'IT Department (Gen)',
                        requisitionNo: `REQ-${Math.floor(Math.random() * 1000)}`,
                        lastDeliveryDate: new Date(Date.now() - 86400000 * Math.floor(Math.random() * 10)).toISOString(),
                        quantitySupplied: row.quantity || Math.floor(Math.random() * 10),
                        balance: Math.floor(Math.random() * 200),
                        remarks: 'Generated remarks'
                    })
                })
            }

            // Always embed the robust DUMMY data so it's visible in the UI
            stockInArr.push(...DUMMY_STOCK_IN)
            stockOutArr.push(...DUMMY_STOCK_OUT)

            // Sort descending by date
            stockInArr.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            stockOutArr.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

            setStockIn(stockInArr)
            setStockOut(stockOutArr)
            setFilteredStockIn(stockInArr)
            setFilteredStockOut(stockOutArr)
            setError(null)
        } catch (err) {
            console.error('Failed to fetch register data:', err)
            setError('Failed to load register data')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        let filteredIn = [...stockIn]
        let filteredOut = [...stockOut]

        if (selectedDateRange) {
            filteredIn = filteredIn.filter(t => {
                const d = new Date(t.date)
                return d >= selectedDateRange.start && d <= selectedDateRange.end
            })
            filteredOut = filteredOut.filter(t => {
                const d = new Date(t.date)
                return d >= selectedDateRange.start && d <= selectedDateRange.end
            })
        }

        if (searchTerm.trim()) {
            const lower = searchTerm.toLowerCase()
            filteredIn = filteredIn.filter(t =>
                t.reference.toLowerCase().includes(lower) ||
                t.details.toLowerCase().includes(lower) ||
                t.user.toLowerCase().includes(lower) ||
                t.supplierName.toLowerCase().includes(lower) ||
                t.challanNo.toLowerCase().includes(lower)
            )
            filteredOut = filteredOut.filter(t =>
                t.reference.toLowerCase().includes(lower) ||
                t.details.toLowerCase().includes(lower) ||
                t.user.toLowerCase().includes(lower) ||
                t.divisionName.toLowerCase().includes(lower) ||
                t.requisitionNo.toLowerCase().includes(lower) ||
                t.remarks.toLowerCase().includes(lower)
            )
        }

        setFilteredStockIn(filteredIn)
        setFilteredStockOut(filteredOut)
    }, [stockIn, stockOut, selectedDateRange, searchTerm])

    const getExportFilteredData = () => {
        let startDate: Date | null = null
        let endDate: Date | null = null

        if (exportDateRange.start && exportDateRange.end) {
            startDate = new Date(exportDateRange.start)
            endDate = new Date(exportDateRange.end)
            endDate.setHours(23, 59, 59, 999)
        }

        if (exportType === 'stock-in') {
            let data = [...stockIn]
            if (startDate && endDate) {
                data = data.filter(t => {
                    const d = new Date(t.date)
                    return d >= startDate! && d <= endDate!
                })
            }
            return { type: 'stock-in' as const, count: data.length, stockInData: data }
        } else {
            let data = [...stockOut]
            if (startDate && endDate) {
                data = data.filter(t => {
                    const d = new Date(t.date)
                    return d >= startDate! && d <= endDate!
                })
            }
            return { type: 'stock-out' as const, count: data.length, stockOutData: data }
        }
    }

    const handleExport = async () => {
        const result = getExportFilteredData()

        if (result.count === 0) {
            setError(`No ${exportType === 'stock-in' ? 'Stock In' : 'Stock Out'} records found for the selected date range`)
            return
        }

        setExportLoading(true)
        try {
            const periodDetails = exportDateRange.start && exportDateRange.end
                ? { 'Period': `${new Date(exportDateRange.start).toLocaleDateString()} to ${new Date(exportDateRange.end).toLocaleDateString()}` }
                : undefined

            if (result.type === 'stock-in' && result.stockInData) {
                const filename = `stock-in-${DateFilterService.formatDateForFilename(new Date())}.pdf`
                const columns = ['Reference', 'Date', 'User', 'Details', 'Items/Qty', 'Brought Forward', 'Supplier', 'Challan No', 'Receipts']
                const data: string[][] = result.stockInData.map(t => [
                    t.reference, formatDateDMY(t.date), t.user, t.details,
                    t.itemCount.toString(), t.broughtForward.toString(),
                    t.supplierName, t.challanNo, t.presentReceipts.toString(),
                ])
                await PDFExportService.generateReusableTablePDF(columns, data, {
                    filename, title: 'Stock In Register', timestamp: new Date(), details: periodDetails
                })
                setSuccess(`Stock In export successful (${result.count} records)`)
            } else if (result.type === 'stock-out' && result.stockOutData) {
                const filename = `stock-out-${DateFilterService.formatDateForFilename(new Date())}.pdf`
                const columns = ['Reference', 'Date', 'User', 'Details', 'Items/Qty', 'Division', 'Requisition No', 'Last Delivery', 'Qty Supplied', 'Balance', 'Remarks']
                const data: string[][] = result.stockOutData.map(t => [
                    t.reference, formatDateDMY(t.date), t.user, t.details,
                    t.itemCount.toString(), t.divisionName, t.requisitionNo,
                    formatDateDMY(t.lastDeliveryDate), t.quantitySupplied.toString(),
                    t.balance.toString(), t.remarks,
                ])
                await PDFExportService.generateReusableTablePDF(columns, data, {
                    filename, title: 'Stock Out Register', timestamp: new Date(), details: periodDetails
                })
                setSuccess(`Stock Out export successful (${result.count} records)`)
            }
            setShowExportPanel(false)
        } catch (err) {
            setError(`Failed to generate ${exportType === 'stock-in' ? 'Stock In' : 'Stock Out'} PDF.`)
            console.error('Export error:', err)
        } finally {
            setExportLoading(false)
        }
    }

    if (!session) {
        return (
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="p-6 text-center">
                    <p className="text-muted-foreground">Please sign in to view the register.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-transparent">
            <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-slide-down">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">Register</h1>
                        <p className="text-muted-foreground mt-1">Stock In and Stock Out records</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <ExportButton
                            onClick={() => setShowExportPanel(!showExportPanel)}
                            disabled={false}
                            label={showExportPanel ? 'Close Export' : 'Export Register'}
                        />
                    </div>
                </div>

                {success && (
                    <div className="fixed right-4 top-4 z-50 w-[min(420px,calc(100vw-2rem))]">
                        <SuccessMessage message={success} onDismiss={() => setSuccess(null)} autoHide />
                    </div>
                )}
                {error && (
                    <div className="fixed right-4 top-4 z-50 w-[min(420px,calc(100vw-2rem))]">
                        <ErrorMessage message={error} onRetry={() => setError(null)} />
                    </div>
                )}

                {/* Export Panel */}
                {showExportPanel && (
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm animate-slide-up">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Export Register</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                            {/* Export Type Selection */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-foreground">Export Type</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setExportType('stock-in')}
                                        className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                                            exportType === 'stock-in'
                                                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                                : 'bg-background text-foreground border-border hover:bg-muted'
                                        }`}
                                    >
                                        Stock In
                                    </button>
                                    <button
                                        onClick={() => setExportType('stock-out')}
                                        className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                                            exportType === 'stock-out'
                                                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                                : 'bg-background text-foreground border-border hover:bg-muted'
                                        }`}
                                    >
                                        Stock Out
                                    </button>
                                </div>
                            </div>

                            {/* Date Range for Export */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-foreground">From Date</label>
                                <input
                                    type="date"
                                    value={exportDateRange.start}
                                    onChange={(e) => setExportDateRange({ ...exportDateRange, start: e.target.value })}
                                    suppressHydrationWarning
                                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none dark:[color-scheme:dark]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-foreground">To Date</label>
                                <input
                                    type="date"
                                    value={exportDateRange.end}
                                    onChange={(e) => setExportDateRange({ ...exportDateRange, end: e.target.value })}
                                    suppressHydrationWarning
                                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none dark:[color-scheme:dark]"
                                />
                            </div>
                        </div>

                        {/* Export Info & Button */}
                        <div className="mt-5 flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                {exportDateRange.start && exportDateRange.end
                                    ? `Exporting ${exportType === 'stock-in' ? 'Stock In' : 'Stock Out'} records from ${new Date(exportDateRange.start).toLocaleDateString()} to ${new Date(exportDateRange.end).toLocaleDateString()}`
                                    : `Exporting all ${exportType === 'stock-in' ? 'Stock In' : 'Stock Out'} records (no date filter)`
                                }
                            </p>
                            <button
                                onClick={handleExport}
                                disabled={exportLoading}
                                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {exportLoading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generating PDF...
                                    </>
                                ) : (
                                    <>Export to PDF</>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4 animate-slide-up">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                        <div className="w-full">
                            <DateRangePicker onDateRangeChange={(start, end) => setSelectedDateRange({ start, end })} label="Filter by Date" />
                        </div>
                        <div className="relative w-full">
                            <svg className="pointer-events-none absolute left-4 top-3 h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search by reference, user, details, supplier, division..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-10 rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm text-foreground shadow-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                            />
                        </div>
                    </div>
                </div>

                {/* Stock In Table */}
                <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden animate-slide-up" style={{ animationDelay: '100ms' }}>
                    <div className="p-4 bg-muted/30 border-b border-border">
                        <h2 className="text-lg font-semibold text-foreground">Stock In</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-border">
                            <thead className="bg-muted/50">
                                <tr>
                                    {/* Old Columns */}
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Reference</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Date</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">User</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Details</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Items/Qty</th>
                                    {/* New Columns */}
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Brought Forward</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Name of Supplier</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Cash memo/Challan no</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Present Receipts</th>
                                </tr>
                            </thead>
                            <tbody className="bg-card divide-y divide-border">
                                {loading ? (
                                    <tr>
                                        <td colSpan={9} className="px-6 py-8 text-center text-muted-foreground">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : filteredStockIn.length > 0 ? (
                                    filteredStockIn.map((t) => (
                                        <tr key={t.id} className="hover:bg-accent/40 transition-colors">
                                            {/* Old Columns */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                                                {t.reference}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                                {formatDateDMY(t.date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                                {t.user}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground max-w-[200px] truncate" title={t.details}>
                                                {t.details}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                                                {t.itemCount}
                                            </td>
                                            {/* New Columns */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                                {t.broughtForward}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                                {t.supplierName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                                {t.challanNo}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                                                {t.presentReceipts}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={9} className="px-6 py-8 text-center text-muted-foreground">
                                            No Stock In records found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Stock Out Table */}
                <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden animate-slide-up" style={{ animationDelay: '200ms' }}>
                    <div className="p-4 bg-muted/30 border-b border-border">
                        <h2 className="text-lg font-semibold text-foreground">Stock Out</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-border">
                            <thead className="bg-muted/50">
                                <tr>
                                    {/* Old Columns */}
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Reference</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Date</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">User</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Details</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Items/Qty</th>
                                    {/* New Columns */}
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Name of Division</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Requisition/Letter No</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Date of Last Delivery</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Quantity of Supply</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Balance</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="bg-card divide-y divide-border">
                                {loading ? (
                                    <tr>
                                        <td colSpan={11} className="px-6 py-8 text-center text-muted-foreground">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : filteredStockOut.length > 0 ? (
                                    filteredStockOut.map((t) => (
                                        <tr key={t.id} className="hover:bg-accent/40 transition-colors">
                                            {/* Old Columns */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                                                {t.reference}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                                {formatDateDMY(t.date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                                {t.user}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground max-w-[200px] truncate" title={t.details}>
                                                {t.details}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                                                {t.itemCount}
                                            </td>
                                            {/* New Columns */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                                {t.divisionName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                                {t.requisitionNo}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                                {formatDateDMY(t.lastDeliveryDate)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                                                {t.quantitySupplied}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                                {t.balance}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground max-w-[150px] truncate" title={t.remarks}>
                                                {t.remarks}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={11} className="px-6 py-8 text-center text-muted-foreground">
                                            No Stock Out records found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    )
}
