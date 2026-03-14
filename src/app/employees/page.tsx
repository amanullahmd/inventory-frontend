'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import SuccessMessage from '@/components/ui/SuccessMessage'
import { EmployeeService, Employee, CreateEmployeeRequest, UpdateEmployeeRequest } from '@/lib/services/employeeService'
import { WarehouseService } from '@/lib/services/warehouseService'
import { PDFExportService } from '@/lib/services/pdfExportService'
import { usePermissions } from '@/hooks/usePermissions'
import { UserPlus, X } from 'lucide-react'
import { ExportButton } from '@/components/ui/ExportButton'

export default function EmployeesPage() {
  const { data: session, status } = useSession()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [branches, setBranches] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<CreateEmployeeRequest>({
    name: '', grade: '', position: '', branchId: undefined, mobileNumber: '', email: '', address: '', servicePeriod: '', nidNumber: '',
    dateOfBirth: '', gender: '', nationality: ''
  })
  const { userRole } = usePermissions()
  const [employeeCode, setEmployeeCode] = useState<string>('')

  const handleExportPDF = async () => {
    try {
      await PDFExportService.generateEmployeePDF(employees, {
        filename: `employees_${new Date().toISOString().split('T')[0]}.pdf`,
        title: 'Employee Profiles Report',
        timestamp: new Date(),
      })
    } catch (err) {
      console.error('Export failed:', err)
      setError('Failed to export PDF')
    }
  }

  const fetchAll = async () => {
    try {
      setError(null)
      const [es, bs] = await Promise.all([
        EmployeeService.getEmployees().catch(() => []),
        WarehouseService.getWarehouses().catch(() => []),
      ])
      setEmployees(es as any)
      setBranches(bs as any)
    } catch (err: any) {
      setError(err.message || 'Failed to load employees')
    } finally {
      // setLoading(false)
    }
  }

  useEffect(() => { if (status === 'authenticated') fetchAll() }, [status])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name) { setError('Name is required'); return }
    try {
      setError(null); setSuccess(null)
      if (editingId) {
        const updated = await EmployeeService.updateEmployee(editingId, { ...form, employeeCode } as UpdateEmployeeRequest)
        setEmployees(employees.map(emp => emp.employeeId === updated.employeeId ? updated : emp))
        setSuccess('Employee updated')
        setEditingId(null); setEmployeeCode(''); setForm({ name: '', grade: '', position: '', branchId: undefined, mobileNumber: '', email: '', address: '', servicePeriod: '', nidNumber: '', dateOfBirth: '', gender: '', nationality: '' })
      } else {
        const created = await EmployeeService.createEmployee(form)
        setEmployees([created, ...employees])
        setSuccess('Employee created')
        setShowForm(false)
        setForm({ name: '', grade: '', position: '', branchId: undefined, mobileNumber: '', email: '', address: '', servicePeriod: '', nidNumber: '', dateOfBirth: '', gender: '', nationality: '' })
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit')
    }
  }

  if (status === 'loading') return <div className="p-6"><LoadingSpinner size="medium" text="Loading..." /></div>
  if (!session) return <div className="p-10 text-center">Please sign in to view employees.</div>

  return (
    <div className="min-h-screen bg-transparent">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-slide-down">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">Employees</h1>
            <p className="mt-2 text-muted-foreground">Manage employee profiles</p>
          </div>
          <div className="flex items-center gap-3">
            <ExportButton
              onClick={handleExportPDF}
              label="Export PDF"
            />
            {userRole !== 'CENTRAL' && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-sm"
              >
                {showForm ? <X size={18} /> : <UserPlus size={18} />}
                <span className="font-medium">{showForm ? 'Close Form' : 'Create Employee'}</span>
              </button>
            )}
          </div>
        </div>

        {success && <SuccessMessage message={success} onDismiss={() => setSuccess(null)} autoHide />}
        {error && <ErrorMessage message={error} onRetry={fetchAll} />}

        {(showForm || editingId) && (
          <form onSubmit={submit} className="mb-6 rounded-2xl border border-border bg-card p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up">
            <div className="md:col-span-3 flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">{editingId ? 'Edit Employee' : 'New Employee'}</h2>
              <button type="button" onClick={() => { setEditingId(null); setShowForm(false); setForm({ name: '', grade: '', position: '', branchId: undefined, mobileNumber: '', email: '', address: '', servicePeriod: '', nidNumber: '', dateOfBirth: '', gender: '', nationality: '' }) }} className="p-1 hover:bg-accent rounded-md">
                <X size={20} />
              </button>
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium mb-2">Name</label>
              <input className="w-full rounded-lg border border-border px-3 py-2" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            {editingId && (
              <div className="md:col-span-3">
                <label className="block text-sm font-medium mb-2">Employee ID</label>
                <input className="w-full rounded-lg border border-border px-3 py-2" value={employeeCode} onChange={e => setEmployeeCode(e.target.value)} />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2">Grade</label>
              <input className="w-full rounded-lg border border-border px-3 py-2" value={form.grade || ''} onChange={e => setForm({ ...form, grade: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Position</label>
              <input className="w-full rounded-lg border border-border px-3 py-2" value={form.position || ''} onChange={e => setForm({ ...form, position: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Branch</label>
              <select className="w-full rounded-lg border border-border px-3 py-2" value={form.branchId || ''} onChange={e => setForm({ ...form, branchId: e.target.value ? parseInt(e.target.value) : undefined })}>
                <option value="">Select branch</option>
                {branches.map((b: any) => (<option key={b.warehouseId} value={b.warehouseId}>{b.name}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Mobile Number</label>
              <input className="w-full rounded-lg border border-border px-3 py-2" value={form.mobileNumber || ''} onChange={e => setForm({ ...form, mobileNumber: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input className="w-full rounded-lg border border-border px-3 py-2" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date of Birth</label>
              <input type="date" className="w-full rounded-lg border border-border px-3 py-2" value={form.dateOfBirth || ''} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Gender</label>
              <select className="w-full rounded-lg border border-border px-3 py-2" value={form.gender || ''} onChange={e => setForm({ ...form, gender: e.target.value })}>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Nationality</label>
              <input className="w-full rounded-lg border border-border px-3 py-2" value={form.nationality || ''} onChange={e => setForm({ ...form, nationality: e.target.value })} />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium mb-2">Address</label>
              <input className="w-full rounded-lg border border-border px-3 py-2" value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Service Period</label>
              <input className="w-full rounded-lg border border-border px-3 py-2" value={form.servicePeriod || ''} onChange={e => setForm({ ...form, servicePeriod: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">NID Number</label>
              <input className="w-full rounded-lg border border-border px-3 py-2" value={form.nidNumber || ''} onChange={e => setForm({ ...form, nidNumber: e.target.value })} />
            </div>
            <div className="md:col-span-3 flex gap-3 justify-end">
              {editingId ? (
                <>
                  <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-primary-foreground">Save</button>
                  <button type="button" onClick={async () => {
                    try {
                      await EmployeeService.deleteEmployee(editingId!)
                      setEmployees(employees.filter(emp => emp.employeeId !== editingId))
                      setSuccess('Employee deleted')
                      setEditingId(null); setEmployeeCode(''); setForm({ name: '', grade: '', position: '', branchId: undefined, mobileNumber: '', email: '', address: '', servicePeriod: '', nidNumber: '', dateOfBirth: '', gender: '', nationality: '' })
                    } catch (err: any) {
                      setError(err.message || 'Failed to delete')
                    }
                  }} className="rounded-lg border border-border px-4 py-2">Delete</button>
                  <button type="button" onClick={() => { setEditingId(null); setShowForm(false); setForm({ name: '', grade: '', position: '', branchId: undefined, mobileNumber: '', email: '', address: '', servicePeriod: '', nidNumber: '', dateOfBirth: '', gender: '', nationality: '' }) }} className="rounded-lg border border-border px-4 py-2">Cancel</button>
                </>
              ) : (
                <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-primary-foreground">Create Employee</button>
              )}
            </div>
          </form>
        )}

        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden animate-slide-up" style={{ animationDelay: '50ms' }}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Grade</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Position</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Branch</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Mobile</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">DOB</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Gender</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">NID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Created</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {employees.length === 0 ? (
                  <tr><td colSpan={11} className="px-6 py-8 text-center text-muted-foreground">No employees</td></tr>
                ) : employees.map(emp => (
                  <tr key={emp.employeeId} className="hover:bg-accent/40 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">
                      <button className="text-primary-foreground hover:underline" onClick={async () => {
                        try {
                          const detail = await EmployeeService.getEmployee(emp.employeeId)
                          setEditingId(detail.employeeId); setEmployeeCode(detail.employeeCode)
                          setShowForm(true)
                          setForm({
                            name: detail.name,
                            grade: detail.grade,
                            position: detail.position,
                            branchId: detail.branchId,
                            mobileNumber: detail.mobileNumber,
                            email: detail.email,
                            address: detail.address,
                            servicePeriod: detail.servicePeriod,
                            nidNumber: detail.nidNumber,
                            dateOfBirth: detail.dateOfBirth,
                            gender: detail.gender,
                            nationality: detail.nationality
                          })
                        } catch (err: any) {
                          setError(err.message || 'Failed to open employee')
                        }
                      }}>{emp.employeeCode}</button>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{emp.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{emp.grade || '-'}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{emp.position || '-'}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{emp.branchName || '-'}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{emp.mobileNumber || '-'}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{emp.email || '-'}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{emp.dateOfBirth || '-'}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{emp.gender || '-'}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{emp.nidNumber || '-'}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(emp.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
