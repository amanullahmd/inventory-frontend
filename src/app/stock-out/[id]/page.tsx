'use client'

import { useState, useEffect, use } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, PackageMinus, Calendar, User, Warehouse, MapPin, FileText, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import SuccessMessage from '@/components/ui/SuccessMessage'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { stockOutService, StockOutResponse, StockOutType } from '@/lib/services/stockOutService'
import { formatDateDMY } from '@/lib/utils/date'

export default function StockOutDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const referenceNumber = decodeURIComponent(id)
    const { data: session } = useSession()
    const router = useRouter()

    const [details, setDetails] = useState<StockOutResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    useEffect(() => {
        const loadDetails = async () => {
            try {
                setLoading(true)
                const allStockOuts = await stockOutService.getAll()

                let filtered: StockOutResponse[]
                if (referenceNumber.startsWith('ID-')) {
                    const numId = parseInt(referenceNumber.split('-')[1])
                    const single = allStockOuts.find(s => s.id === numId)
                    filtered = single ? [single] : []
                } else {
                    filtered = allStockOuts.filter(s => s.referenceNumber === referenceNumber)
                }

                setDetails(filtered)
            } catch (err) {
                setError('Failed to load stock-out details')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        if (session) loadDetails()
    }, [session, referenceNumber])

    const handleDeleteItem = async (itemId: number) => {
        if (!window.confirm('Delete this item? Stock will be restored.')) return
        try {
            await stockOutService.delete(itemId)
            setSuccess('Item deleted and stock restored')
            const remaining = details.filter(d => d.id !== itemId)
            setDetails(remaining)
            if (remaining.length === 0) {
                setTimeout(() => router.push('/stock-out'), 1500)
            }
        } catch (err) {
            setError('Failed to delete item')
        }
    }

    const totalQuantity = details.reduce((sum, d) => sum + d.quantity, 0)
    const firstItem = details[0]

    const getTypeColor = (type: StockOutType) => {
        switch (type) {
            case StockOutType.DAMAGE: return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            case StockOutType.LOST: return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
            case StockOutType.BRANCH_TRANSFER: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
            case StockOutType.EMPLOYEE: return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
        }
    }

    if (!session) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">Please sign in to view this page.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-transparent">
            <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
                {/* Success/Error Messages */}
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

                {/* Back Button & Header */}
                <div className="animate-slide-down">
                    <button
                        onClick={() => router.push('/stock-out')}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                    >
                        <ArrowLeft size={16} /> Back to Stock Out
                    </button>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
                                <PackageMinus className="text-primary" />
                                {referenceNumber}
                            </h1>
                            <p className="mt-2 text-muted-foreground">Stock Out Transaction Details</p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="p-12"><LoadingSpinner size="medium" text="Loading details..." /></div>
                ) : details.length === 0 ? (
                    <div className="rounded-2xl border border-border bg-card p-12 text-center">
                        <p className="text-muted-foreground text-lg">No records found for this reference.</p>
                        <Button onClick={() => router.push('/stock-out')} className="mt-4">Go Back</Button>
                    </div>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
                            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                                <div className="flex items-center gap-3 mb-2">
                                    <PackageMinus size={18} className="text-primary" />
                                    <span className="text-sm font-medium text-muted-foreground">Total Items</span>
                                </div>
                                <p className="text-2xl font-bold text-foreground">{details.length}</p>
                            </div>
                            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                                <div className="flex items-center gap-3 mb-2">
                                    <FileText size={18} className="text-blue-500" />
                                    <span className="text-sm font-medium text-muted-foreground">Total Quantity</span>
                                </div>
                                <p className="text-2xl font-bold text-foreground">{totalQuantity}</p>
                            </div>
                            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                                <div className="flex items-center gap-3 mb-2">
                                    <Calendar size={18} className="text-amber-500" />
                                    <span className="text-sm font-medium text-muted-foreground">Date</span>
                                </div>
                                <p className="text-lg font-semibold text-foreground">
                                    {firstItem ? formatDateDMY(firstItem.stockOutDate) : '-'}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                                <div className="flex items-center gap-3 mb-2">
                                    <FileText size={18} className="text-green-500" />
                                    <span className="text-sm font-medium text-muted-foreground">Type</span>
                                </div>
                                {firstItem && (
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold capitalize ${getTypeColor(firstItem.stockOutType)}`}>
                                        {firstItem.stockOutType.toLowerCase().replace('_', ' ')}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Transaction Info */}
                        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm animate-slide-up" style={{ animationDelay: '50ms' }}>
                            <h2 className="text-lg font-semibold text-foreground mb-4">Transaction Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                                    <Warehouse size={16} className="text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">From Branch</p>
                                        <p className="text-sm font-medium text-foreground">{firstItem?.sourceWarehouseName || 'Main Inventory'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                                    <MapPin size={16} className="text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            {firstItem?.stockOutType === StockOutType.BRANCH_TRANSFER ? 'To Branch' :
                                             firstItem?.stockOutType === StockOutType.EMPLOYEE ? 'Employee' : 'Reason'}
                                        </p>
                                        <p className="text-sm font-medium text-foreground">
                                            {firstItem?.stockOutType === StockOutType.BRANCH_TRANSFER ? firstItem?.branchName :
                                             firstItem?.stockOutType === StockOutType.EMPLOYEE ? firstItem?.employeeName :
                                             firstItem?.note || '-'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                                    <Calendar size={16} className="text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Date & Time</p>
                                        <p className="text-sm font-medium text-foreground">{firstItem ? new Date(firstItem.stockOutDate).toLocaleString() : '-'}</p>
                                    </div>
                                </div>
                                {firstItem?.note && (
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                                        <FileText size={16} className="text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Notes</p>
                                            <p className="text-sm font-medium text-foreground">{firstItem.note}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden animate-slide-up" style={{ animationDelay: '100ms' }}>
                            <div className="bg-muted/30 px-6 py-4 border-b border-border">
                                <h2 className="text-lg font-semibold text-foreground">Items Issued</h2>
                                <p className="text-sm text-muted-foreground">{details.length} item(s) in this transaction</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-muted/50 border-b border-border">
                                            <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">#</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Item Name</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">SKU</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Quantity</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Date</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-muted-foreground text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {details.map((item, idx) => (
                                            <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                                                <td className="px-6 py-4 text-sm text-muted-foreground">{idx + 1}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-foreground">{item.itemName}</td>
                                                <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{item.itemSku}</td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                                        -{item.quantity}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-muted-foreground">{formatDateDMY(item.stockOutDate)}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleDeleteItem(item.id)}
                                                        className="inline-flex items-center gap-1 text-xs font-medium text-destructive border border-destructive/30 bg-destructive/10 px-3 py-1.5 rounded-lg hover:bg-destructive/20 transition-colors"
                                                    >
                                                        <Trash2 size={12} /> Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
