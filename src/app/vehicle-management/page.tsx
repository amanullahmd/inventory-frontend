'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Car, Fuel, Wrench, Droplets, PenTool, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SuccessMessage } from '@/components/ui/SuccessMessage'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { formatDateDMY } from '@/lib/utils/date'
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalCloseButton, ModalBody } from '@/components/ui/modal'

interface VehicleRequisition {
    id: string
    carNo: string
    carModel: string
    vehicleType: string
    date: string
    type: 'Oil' | 'Service' | 'Diesel' | 'Engine Oil' | 'Other'
    details: string
    amount: number
    status: 'Pending' | 'Approved' | 'Completed' | 'Rejected'
}

const DEMO_REQUISITIONS: VehicleRequisition[] = [
    {
        id: 'VR-001',
        carNo: 'DHA-11-2034',
        carModel: 'Toyota Hiace',
        vehicleType: 'Microbus',
        date: '2024-03-01T10:00:00Z',
        type: 'Diesel',
        details: '50 Liters for Toyota Hiace',
        amount: 5500,
        status: 'Completed'
    },
    {
        id: 'VR-002',
        carNo: 'DHA-12-3456',
        carModel: 'Mitsubishi Pajero',
        vehicleType: 'SUV',
        date: '2024-03-03T14:30:00Z',
        type: 'Service',
        details: 'Brake pad replacement - Mitsubishi Pajero',
        amount: 12000,
        status: 'Approved'
    },
    {
        id: 'VR-003',
        carNo: 'DHA-13-5678',
        carModel: 'Nissan Patrol',
        vehicleType: 'SUV',
        date: '2024-03-05T09:15:00Z',
        type: 'Engine Oil',
        details: 'Scheduled maintenance - Nissan Patrol',
        amount: 4500,
        status: 'Pending'
    },
    {
        id: 'VR-004',
        carNo: 'DHA-14-9012',
        carModel: 'Honda Civic',
        vehicleType: 'Sedan',
        date: '2024-03-06T11:45:00Z',
        type: 'Other',
        details: 'Car wash and internal cleaning',
        amount: 800,
        status: 'Completed'
    }
]

export default function VehicleManagementPage() {
    const { data: session, status } = useSession()
    const [requisitions, setRequisitions] = useState<VehicleRequisition[]>(DEMO_REQUISITIONS)
    const [showForm, setShowForm] = useState(false)
    const [successMsg, setSuccessMsg] = useState<string | null>(null)
    const [selectedVehicle, setSelectedVehicle] = useState<VehicleRequisition | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

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

        setRequisitions([newRequisition, ...requisitions])
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

    const handleCarClick = (vehicle: VehicleRequisition) => {
        setSelectedVehicle(vehicle)
        setIsModalOpen(true)
    }

    return (
        <div className="min-h-screen bg-transparent">
            <div className="p-6 lg:p-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-slide-down">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
                            <Car className="text-primary" />
                            Vehicle Management
                        </h1>
                        <p className="mt-2 text-muted-foreground">Manage and track vehicle requisitions and maintenance</p>
                    </div>
                    <Button
                        onClick={() => setShowForm(!showForm)}
                        className="rounded-xl shadow-md hover:shadow-lg transition-all h-11 px-6"
                    >
                        {showForm ? <><X className="mr-2" size={18} /> Close Form</> : <><Plus className="mr-2" size={18} /> New Requisition</>}
                    </Button>
                </div>

                {successMsg && (
                    <div className="mb-6">
                        <SuccessMessage message={successMsg} onDismiss={() => setSuccessMsg(null)} autoHide />
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
                                    <th className="px-6 py-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Details</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {requisitions.map((req) => (
                                    <tr key={req.id} className="hover:bg-muted/20 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-primary-foreground cursor-pointer hover:underline" onClick={() => handleCarClick(req)}>
                                            {req.carModel}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">{formatDateDMY(req.date)}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center gap-2 text-foreground font-medium">
                                                {getTypeIcon(req.type)}
                                                {req.type}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground line-clamp-1">{req.details}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-foreground">৳{req.amount.toLocaleString()}</td>
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

            {/* Vehicle Cost Details Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ModalContent className="bg-white dark:bg-slate-900 shadow-xl border-slate-200 dark:border-slate-800">
                    <ModalHeader>
                        <ModalTitle>Vehicle Cost Report</ModalTitle>
                        <ModalCloseButton />
                    </ModalHeader>
                    <ModalBody>
                        {selectedVehicle && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-xl border border-border">
                                    <div>
                                        <span className="text-muted-foreground block text-xs uppercase tracking-wider">Car No</span>
                                        <span className="font-semibold text-foreground">{selectedVehicle.carNo}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block text-xs uppercase tracking-wider">Car Model</span>
                                        <span className="font-semibold text-foreground">{selectedVehicle.carModel}</span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-muted-foreground block text-xs uppercase tracking-wider">Vehicle Type</span>
                                        <span className="font-semibold text-foreground">{selectedVehicle.vehicleType}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-semibold text-foreground flex justify-between items-center pb-2 border-b">
                                        <span>Monthly Cost</span>
                                        <span className="text-xs text-muted-foreground font-normal">Current Year</span>
                                    </h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {['Jan', 'Feb', 'Mar', 'Apr'].map((month, idx) => (
                                            <div key={month} className="bg-background border border-border p-2 rounded-lg text-center shadow-sm">
                                                <div className="text-[10px] font-medium text-primary-foreground uppercase tracking-wider">{month}</div>
                                                <div className="font-bold text-sm text-foreground">৳{(5000 + idx * 1200).toLocaleString()}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-semibold text-foreground flex justify-between items-center pb-2 border-b">
                                        <span>Yearly Cost</span>
                                        <span className="text-xs text-muted-foreground font-normal">Historical</span>
                                    </h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                        {[2022, 2023, 2024, 2025, 2026].map((year, idx) => (
                                            <div key={year} className="bg-primary/5 border border-primary/20 p-3 rounded-lg text-center shadow-sm">
                                                <div className="text-xs font-semibold text-primary-foreground/70 mb-1">{year}</div>
                                                <div className="font-bold text-foreground">৳{(45000 + idx * 15000).toLocaleString()}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    )
}
