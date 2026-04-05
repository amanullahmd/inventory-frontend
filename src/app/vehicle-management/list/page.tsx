'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Car, Fuel, Wrench, Droplets, PenTool, Plus, X, ExternalLink, FileDown, LayoutDashboard, List } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SuccessMessage } from '@/components/ui/SuccessMessage'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { formatDateDMY } from '@/lib/utils/date'
import { PDFExportService, ExportOptions } from '@/lib/services/pdfExportService'
import { DateFilterService } from '@/lib/services/dateFilterService'
import { useRouter } from 'next/navigation'
import { VehicleService } from '@/lib/services/vehicleService'
import type { VehicleRequisition } from '@/lib/types'

export default function VehicleListPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [requisitions, setRequisitions] = useState<VehicleRequisition[]>(() => VehicleService.getRequisitions())
    const [showForm, setShowForm] = useState(false)
    const [successMsg, setSuccessMsg] = useState<string | null>(null)

    const [showExportPanel, setShowExportPanel] = useState(false)
    const [selectedCarModel, setSelectedCarModel] = useState<string>('all')
    const [exportLoading, setExportLoading] = useState(false)
    const [exportDateRange, setExportDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' })

    const uniqueCarModels = VehicleService.getCarModels()

    const [formData, setFormData] = useState({
        carNo: '',
        carModel: '',
        vehicleType: '',
        type: 'Oil' as VehicleRequisition['type'],
        details: '',
        amount: ''
    })

    if (status === 'loading') {
        return <div className="p-8"><LoadingSpinner size="medium" text="Loading..." /></div>
    }

    if (!session) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">Please sign in to view this page.</p>
            </div>
        )
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const newRequisition: VehicleRequisition = {
            id: `VR-00${requisitions.length + 1}`,
            carNo: formData.carNo,
            carModel: formData.carModel,
            vehicleType: formData.vehicleType,
            date: new Date().toISOString(),
            type: formData.type,
            details: formData.details,
            amount: Number(formData.amount),
            status: 'Pending'
        }

        const added = VehicleService.addRequisition({
            carNo: formData.carNo,
            carModel: formData.carModel,
            vehicleType: formData.vehicleType,
            date: new Date().toISOString(),
            type: formData.type,
            details: formData.details,
            amount: Number(formData.amount),
            status: 'Pending'
        })

        setRequisitions([added, ...requisitions])
        setSuccessMsg('Requisition submitted successfully!')
        setShowForm(false)
        setFormData({ carNo: '', carModel: '', vehicleType: '', type: 'Oil', details: '', amount: '' })
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'Diesel': return <Fuel size={18} className="text-blue-500" />
            case 'Service': return <Wrench size={18} className="text-orange-500" />
            case 'Engine Oil':
            case 'Oil': return <Droplets size={18} className="text-amber-500" />
            default: return <PenTool size={18} className="text-purple-500" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            case 'Approved': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
            case 'Pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
            case 'Rejected': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    const handleExportVehicle = async () => {
        let exportData = selectedCarModel === 'all'
            ? [...requisitions]
            : requisitions.filter(r => r.carModel === selectedCarModel)

        if (exportDateRange.start && exportDateRange.end) {
            const startDate = new Date(exportDateRange.start)
            const endDate = new Date(exportDateRange.end)
            endDate.setHours(23, 59, 59, 999)
            exportData = exportData.filter(r => {
                const d = new Date(r.date)
                return d >= startDate && d <= endDate
            })
        }

        if (exportData.length === 0) {
            setSuccessMsg('No records found for the selected car model')
            return
        }

        setExportLoading(true)
        try {
            const modelLabel = selectedCarModel === 'all' ? 'All Vehicles' : selectedCarModel
            const filename = `vehicle-requisitions-${selectedCarModel === 'all' ? 'all' : selectedCarModel.replace(/\s+/g, '-').toLowerCase()}-${DateFilterService.formatDateForFilename(new Date())}.pdf`
            const columns = ['Car Model', 'Car No', 'Date', 'Type', 'Details', 'Amount (BDT)', 'Approved By', 'Status']
            const data: string[][] = exportData.map(r => [
                r.carModel, r.carNo, formatDateDMY(r.date), r.type,
                r.details, `৳${r.amount.toLocaleString()}`,
                r.approvedBy || '-', r.status,
            ])
            const options: ExportOptions = {
                filename,
                title: `Vehicle Requisitions - ${modelLabel}`,
                timestamp: new Date(),
                details: {
                    'Car Model': modelLabel,
                    'Total Records': exportData.length.toString(),
                    ...(exportDateRange.start && exportDateRange.end ? {
                        'Period': `${new Date(exportDateRange.start).toLocaleDateString()} to ${new Date(exportDateRange.end).toLocaleDateString()}`
                    } : {})
                }
            }
            await PDFExportService.generateReusableTablePDF(columns, data, options)
            setSuccessMsg(`Export successful: ${exportData.length} records for ${modelLabel}`)
            setShowExportPanel(false)
        } catch (err) {
            console.error('Export error:', err)
            setSuccessMsg('Failed to generate PDF export')
        } finally {
            setExportLoading(false)
        }
    }

    const handleCarClick = (vehicle: VehicleRequisition) => {
        router.push(`/vehicle-management/${encodeURIComponent(vehicle.carModel)}`)
    }

    return (
        <div className="min-h-screen bg-transparent">
            <div className="p-4 lg:p-6 max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="mb-6 animate-slide-down">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                                    <Car size={22} className="text-emerald-700 dark:text-emerald-400" />
                                </div>
                                Vehicle Management
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground ml-[52px]">Fleet cost analytics and management</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                onClick={() => { setShowExportPanel(!showExportPanel); if (showForm) setShowForm(false) }}
                                className="rounded-xl shadow-md hover:shadow-lg transition-all h-10 px-4"
                            >
                                {showExportPanel ? <><X className="mr-2" size={16} /> Close Export</> : <><FileDown className="mr-2" size={16} /> Export</>}
                            </Button>
                            <Button
                                onClick={() => { setShowForm(!showForm); if (showExportPanel) setShowExportPanel(false) }}
                                className="rounded-xl shadow-md hover:shadow-lg transition-all h-10 px-4"
                            >
                                {showForm ? <><X className="mr-2" size={16} /> Close Form</> : <><Plus className="mr-2" size={16} /> New Requisition</>}
                            </Button>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex items-center gap-1 border-b border-border">
                        <Link
                            href="/vehicle-management/dashboard"
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground border-b-2 border-transparent hover:border-border -mb-px transition-colors"
                        >
                            <LayoutDashboard size={16} />
                            Dashboard
                        </Link>
                        <Link
                            href="/vehicle-management/list"
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400 -mb-px"
                        >
                            <List size={16} />
                            Vehicle List
                        </Link>
                    </div>
                </div>

                {successMsg && (
                    <div className="mb-6">
                        <SuccessMessage message={successMsg} onDismiss={() => setSuccessMsg(null)} autoHide />
                    </div>
                )}

                {/* Export Panel */}
                {showExportPanel && (
                    <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-sm animate-slide-up">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Export Vehicle Requisitions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                            <div className="space-y-2">
                                <Label htmlFor="exportCarModel">Select Car Model</Label>
                                <select
                                    id="exportCarModel"
                                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                                    value={selectedCarModel}
                                    onChange={(e) => setSelectedCarModel(e.target.value)}
                                >
                                    <option value="all">All Vehicles</option>
                                    {uniqueCarModels.map(model => (
                                        <option key={model} value={model}>{model}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="exportFromDate">From Date</Label>
                                <input
                                    id="exportFromDate"
                                    type="date"
                                    value={exportDateRange.start}
                                    onChange={(e) => setExportDateRange({ ...exportDateRange, start: e.target.value })}
                                    suppressHydrationWarning
                                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground focus:ring-2 focus:ring-ring outline-none dark:[color-scheme:dark]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="exportToDate">To Date</Label>
                                <input
                                    id="exportToDate"
                                    type="date"
                                    value={exportDateRange.end}
                                    onChange={(e) => setExportDateRange({ ...exportDateRange, end: e.target.value })}
                                    suppressHydrationWarning
                                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground focus:ring-2 focus:ring-ring outline-none dark:[color-scheme:dark]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Button
                                    onClick={handleExportVehicle}
                                    disabled={exportLoading}
                                    className="w-full rounded-xl h-10"
                                >
                                    {exportLoading ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Generating PDF...
                                        </>
                                    ) : (
                                        <><FileDown className="mr-2" size={16} /> Export to PDF</>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Requisition Form */}
                {showForm && (
                    <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-sm animate-slide-up">
                        <h3 className="text-lg font-semibold text-foreground mb-6">Create Vehicle Requisition</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="carNo">Car No</Label>
                                    <Input
                                        id="carNo"
                                        placeholder="e.g. DHA-11-2034"
                                        value={formData.carNo}
                                        onChange={(e) => setFormData({ ...formData, carNo: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="carModel">Car Model</Label>
                                    <Input
                                        id="carModel"
                                        placeholder="e.g. Toyota Hiace"
                                        value={formData.carModel}
                                        onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="vehicleType">Vehicle Type</Label>
                                    <Input
                                        id="vehicleType"
                                        placeholder="e.g. Microbus, SUV"
                                        value={formData.vehicleType}
                                        onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Requisition Type</Label>
                                    <select
                                        id="type"
                                        className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-ring outline-none"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as VehicleRequisition['type'] })}
                                        required
                                    >
                                        <option value="Oil">Oil</option>
                                        <option value="Service">Service</option>
                                        <option value="Diesel">Diesel</option>
                                        <option value="Engine Oil">Engine Oil</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Estimated Amount (BDT)</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        placeholder="e.g. 5000"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-1">
                                    <Label htmlFor="details">Details / Remarks</Label>
                                    <Input
                                        id="details"
                                        placeholder="e.g. Fuel for vehicle HQ-101"
                                        value={formData.details}
                                        onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <Button variant="outline" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
                                <Button type="submit">Submit Requisition</Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Requisitions Table */}
                <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden animate-slide-up">
                    <div className="bg-muted/30 px-6 py-4 border-b border-border">
                        <h2 className="text-xl font-semibold text-foreground">Requisition History</h2>
                        <p className="text-sm text-muted-foreground">List of all vehicle related requests</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-muted/50 border-b border-border">
                                    <th className="px-6 py-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Car Model</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Car No</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Details</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Approved By</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {requisitions.map((req) => (
                                    <tr key={req.id} className="hover:bg-muted/20 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium">
                                            <button
                                                onClick={() => handleCarClick(req)}
                                                className="flex items-center gap-1.5 text-foreground hover:underline font-semibold group"
                                            >
                                                {req.carModel}
                                                <ExternalLink size={12} className="opacity-0 group-hover:opacity-70 transition-opacity" />
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">{req.carNo}</td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">{formatDateDMY(req.date)}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center gap-2 text-foreground font-medium">
                                                {getTypeIcon(req.type)}
                                                {req.type}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground line-clamp-1">{req.details}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-foreground">৳{req.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">
                                            {req.approvedBy ? (
                                                <span className="font-medium text-foreground">{req.approvedBy}</span>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(req.status)}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {requisitions.length === 0 && (
                        <div className="p-10 text-center text-muted-foreground">
                            No requisitions found.
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}
