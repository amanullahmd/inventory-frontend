'use client'

import { useState, useEffect, use } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Package, Calendar, User, Warehouse, Truck, FileText, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import SuccessMessage from '@/components/ui/SuccessMessage'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { StockService } from '@/lib/services/stockService'
import { StockInDetail } from '@/lib/types'
import { formatDateDMY } from '@/lib/utils/date'

export default function StockInDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const referenceNumber = decodeURIComponent(id)
    const { data: session } = useSession()
    const router = useRouter()

    const [details, setDetails] = useState<StockInDetail[]>([])
    const [groupInfo, setGroupInfo] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    useEffect(() => {
        const loadDetails = async () => {
            try {
                setLoading(true)
                const [detailData, groups] = await Promise.all([
                    StockService.getStockInByReference(referenceNumber),
                    StockService.getStockInTransactions()
                ])
                setDetails(detailData)
                const group = (groups as any[]).find(g => g.referenceNumber === referenceNumber)
                setGroupInfo(group || null)
            } catch (err) {
                setError('Failed to load stock-in details')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        if (session) loadDetails()
    }, [session, referenceNumber])

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this stock-in? Stock will be reversed.')) return
        try {
            await StockService.deleteStockIn(referenceNumber)
            setSuccess('Stock-in deleted successfully')
            setTimeout(() => router.push('/stock-in'), 1500)
        } catch (err) {
            setError('Failed to delete stock-in')
        }
    }

    const totalQuantity = details.reduce((sum, d) => sum + d.quantity, 0)

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
                        onClick={() => router.push('/stock-in')}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                    >
                        <ArrowLeft size={16} /> Back to Stock In
                    </button>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
                                <Package className="text-primary" />
                                {referenceNumber}
                            </h1>
                            <p className="mt-2 text-muted-foreground">Stock In Transaction Details</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                onClick={() => router.push(`/stock-in`)}
                                className="rounded-xl h-10"
                            >
                                <Edit size={16} className="mr-2" /> Edit
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleDelete}
                                className="rounded-xl h-10 border-destructive/30 text-destructive hover:bg-destructive/10"
                            >
                                <Trash2 size={16} className="mr-2" /> Delete
                            </Button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="p-12"><LoadingSpinner size="medium" text="Loading details..." /></div>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
                            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                                <div className="flex items-center gap-3 mb-2">
                                    <Package size={18} className="text-primary" />
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
                                    {groupInfo?.createdAt ? formatDateDMY(groupInfo.createdAt) : details[0]?.createdAt ? formatDateDMY(details[0].createdAt) : '-'}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                                <div className="flex items-center gap-3 mb-2">
                                    <Truck size={18} className="text-green-500" />
                                    <span className="text-sm font-medium text-muted-foreground">Mode</span>
                                </div>
                                <p className="text-lg font-semibold text-foreground">{groupInfo?.sourceMode || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Transaction Info */}
                        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm animate-slide-up" style={{ animationDelay: '50ms' }}>
                            <h2 className="text-lg font-semibold text-foreground mb-4">Transaction Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                                    <User size={16} className="text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Created By</p>
                                        <p className="text-sm font-medium text-foreground">{groupInfo?.createdBy || 'System'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                                    <Warehouse size={16} className="text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Supplier</p>
                                        <p className="text-sm font-medium text-foreground">{groupInfo?.supplierName || 'No Supplier'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                                    <Calendar size={16} className="text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Created At</p>
                                        <p className="text-sm font-medium text-foreground">{groupInfo?.createdAt ? new Date(groupInfo.createdAt).toLocaleString() : '-'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                                    <Calendar size={16} className="text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Last Updated</p>
                                        <p className="text-sm font-medium text-foreground">{groupInfo?.updatedAt ? new Date(groupInfo.updatedAt).toLocaleString() : 'Not updated'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden animate-slide-up" style={{ animationDelay: '100ms' }}>
                            <div className="bg-muted/30 px-6 py-4 border-b border-border">
                                <h2 className="text-lg font-semibold text-foreground">Items Received</h2>
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
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {details.map((item, idx) => (
                                            <tr key={`${item.itemId}-${idx}`} className="hover:bg-muted/20 transition-colors">
                                                <td className="px-6 py-4 text-sm text-muted-foreground">{idx + 1}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-foreground">{item.name}</td>
                                                <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{item.sku}</td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                        +{item.quantity}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-muted-foreground">{formatDateDMY(item.createdAt)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {details.length === 0 && (
                                <div className="p-10 text-center text-muted-foreground">No items found for this transaction.</div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
