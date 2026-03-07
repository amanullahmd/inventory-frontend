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

export interface MergedTransaction {
    id: string;
    type: 'IN' | 'OUT';
    date: string;
    reference: string;
    user: string;
    details: string;
    itemCount: number;
}

export default function RegisterPage() {
    const { data: session } = useSession()
    const [transactions, setTransactions] = useState<MergedTransaction[]>([])
    const [filteredTransactions, setFilteredTransactions] = useState<MergedTransaction[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [exportLoading, setExportLoading] = useState(false)

    const [selectedDateRange, setSelectedDateRange] = useState<{ start: Date; end: Date } | null>(null)
    const [filterType, setFilterType] = useState<'ALL' | 'IN' | 'OUT'>('ALL')
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            const [inData, outData] = await Promise.allSettled([
                StockService.getStockInTransactions(),
                stockOutService.getAll()
            ])

            const merged: MergedTransaction[] = []

            if (inData.status === 'fulfilled') {
                inData.value.forEach((row: any) => {
                    merged.push({
                        id: `in-${row.referenceNumber}`,
                        type: 'IN',
                        date: row.createdAt,
                        reference: row.referenceNumber,
                        user: row.createdBy || 'System',
                        details: row.supplierName ? `Supplier: ${row.supplierName}` : (row.sourceMode || 'Stock In'),
                        itemCount: row.count || 0
                    })
                })
            }

            if (outData.status === 'fulfilled') {
                outData.value.forEach((row: any) => {
                    merged.push({
                        id: `out-${row.id}`,
                        type: 'OUT',
                        date: row.stockOutDate || row.createdAt || new Date().toISOString(),
                        reference: row.referenceNumber || `OUT-${row.id}`,
                        user: row.employeeName || 'System',
                        details: `${row.stockOutType}: ${row.itemName} (Qty: ${row.quantity}) ${row.note ? `- ${row.note}` : ''}`,
                        itemCount: 1
                    })
                })
            }

            merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

            setTransactions(merged)
            setFilteredTransactions(merged)
            setError(null)
        } catch (err) {
            console.error('Failed to fetch register data:', err)
            setError('Failed to load register data')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        let filtered = [...transactions]

        if (filterType !== 'ALL') {
            filtered = filtered.filter(t => t.type === filterType)
        }

        if (selectedDateRange) {
            filtered = filtered.filter(t => {
                const d = new Date(t.date)
                return d >= selectedDateRange.start && d <= selectedDateRange.end
            })
        }

        if (searchTerm.trim()) {
            const lower = searchTerm.toLowerCase()
            filtered = filtered.filter(t =>
                t.reference.toLowerCase().includes(lower) ||
                t.details.toLowerCase().includes(lower) ||
                t.user.toLowerCase().includes(lower)
            )
        }

        setFilteredTransactions(filtered)
    }, [transactions, filterType, selectedDateRange, searchTerm])

    const handleExport = async () => {
        if (filteredTransactions.length === 0) {
            setError('No data to export')
            return
        }

        setExportLoading(true)
        try {
            const filename = `register-${DateFilterService.formatDateForFilename(new Date())}.pdf`

            const columns = ['Type', 'Reference', 'Date', 'User', 'Details', 'Items/Qty']
            const data = filteredTransactions.map(t => [
                t.type,
                t.reference,
                formatDateDMY(t.date),
                t.user,
                t.details,
                t.itemCount.toString()
            ])

            const options: ExportOptions = {
                filename,
                title: 'Inventory Register Report',
                timestamp: new Date(),
                details: selectedDateRange ? {
                    'Period': `${selectedDateRange.start.toLocaleDateString()} to ${selectedDateRange.end.toLocaleDateString()}`
                } : undefined
            }

            await PDFExportService.generateReusableTablePDF(columns, data, options)
            setSuccess(`Successfully exported ${filteredTransactions.length} records`)
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
                        <p className="text-muted-foreground mt-1">Combined view of Stock In and Stock Out records</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <ExportButton
                            onClick={handleExport}
                            disabled={filteredTransactions.length === 0}
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

                {/* Filters and Export */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4 animate-slide-up">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <DateRangePicker onDateRangeChange={(start, end) => setSelectedDateRange({ start, end })} label="Filter by Date" />
                        </div>

                        <div className="space-y-3">
                            <label className="block text-base font-semibold text-foreground">Transaction Type</label>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Select Type</label>
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value as any)}
                                    className="w-full h-10 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring transition-all"
                                >
                                    <option value="ALL">All Types</option>
                                    <option value="IN">Stock In</option>
                                    <option value="OUT">Stock Out</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="relative mt-4">
                        <svg className="pointer-events-none absolute left-4 top-3 h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search reference, details, or user..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm text-foreground shadow-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden animate-slide-up" style={{ animationDelay: '100ms' }}>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-border">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Type</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Reference</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Date</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">User</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Details</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Items/Qty</th>
                                </tr>
                            </thead>
                            <tbody className="bg-card divide-y divide-border">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : filteredTransactions.length > 0 ? (
                                    filteredTransactions.map((t) => (
                                        <tr key={t.id} className="hover:bg-accent/40 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${t.type === 'IN'
                                                    ? 'border-chart-2/30 bg-chart-2/10 text-chart-2'
                                                    : 'border-destructive/30 bg-destructive/10 text-destructive'
                                                    }`}>
                                                    {t.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                                                {t.reference}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                                {formatDateDMY(t.date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                                {t.user}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">
                                                {t.details}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                                                {t.itemCount}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                            No records found
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
