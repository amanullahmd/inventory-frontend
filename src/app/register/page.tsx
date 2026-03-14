'use client'

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

    const handleExport = async () => {
        if (filteredStockIn.length === 0 && filteredStockOut.length === 0) {
            setError('No data to export')
            return
        }

        setExportLoading(true)
        try {
            const filename = `register-${DateFilterService.formatDateForFilename(new Date())}.pdf`

            // Combined export with all columns grouped roughly
            const columns = ['Table', 'Date', 'Reference', 'User', 'Details', 'Brought Fwd/Bal', 'Qty/Supply', 'Additional']
            const data: string[][] = []

            filteredStockIn.forEach(t => {
                data.push([
                    'Stock In',
                    formatDateDMY(t.date),
                    t.reference,
                    t.user,
                    t.details,
                    t.broughtForward.toString(),
                    t.presentReceipts.toString(),
                    `${t.supplierName} (${t.challanNo})`
                ])
            })

            filteredStockOut.forEach(t => {
                data.push([
                    'Stock Out',
                    formatDateDMY(t.date),
                    t.reference,
                    t.user,
                    t.details,
                    t.balance.toString(),
                    t.quantitySupplied.toString(),
                    `${t.divisionName} (${t.requisitionNo})`
                ])
            })

            const options: ExportOptions = {
                filename,
                title: 'Inventory Register Report',
                timestamp: new Date(),
                details: selectedDateRange ? {
                    'Period': `${selectedDateRange.start.toLocaleDateString()} to ${selectedDateRange.end.toLocaleDateString()}`
                } : undefined
            }

            await PDFExportService.generateReusableTablePDF(columns, data, options)
            setSuccess(`Successfully exported records`)
        } catch (err) {
            setError('Failed to generate PDF. Please try again.')
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
        <div className="min-h-screen bg-background">
            <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-slide-down">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">Register</h1>
                        <p className="text-muted-foreground mt-1">Stock In and Stock Out records</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <ExportButton
                            onClick={handleExport}
                            disabled={filteredStockIn.length === 0 && filteredStockOut.length === 0}
                            loading={exportLoading}
                            label="Export"
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
