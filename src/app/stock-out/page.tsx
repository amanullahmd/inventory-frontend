'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import SuccessMessage from '@/components/ui/SuccessMessage'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { ItemService } from '@/lib/services/itemService'
import { stockOutService, StockOutResponse, StockOutType } from '@/lib/services/stockOutService'
import { WarehouseService } from '@/lib/services/warehouseService'
import { EmployeeService } from '@/lib/services/employeeService'
import { Item } from '@/lib/types'
import Link from 'next/link'

interface GroupedStockOut {
  referenceNumber: string
  count: number
  createdAt: string
  type: StockOutType
  sourceWarehouseName?: string
  branchName?: string
  employeeName?: string
  note?: string
}

export default function StockOutPage() {
  const { data: session, status } = useSession()
  const [items, setItems] = useState<Item[]>([])
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])

  // Form State
  const [stockOutType, setStockOutType] = useState<StockOutType>(StockOutType.USED)
  const [selectedSourceWarehouse, setSelectedSourceWarehouse] = useState('')
  const [selectedBranch, setSelectedBranch] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [notes, setNotes] = useState('')
  const [lines, setLines] = useState<Array<{ itemId: string; quantity: string }>>([{ itemId: '', quantity: '' }])

  // UI State
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [stockOuts, setStockOuts] = useState<StockOutResponse[]>([])
  const [groups, setGroups] = useState<GroupedStockOut[]>([])


  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true)
        const results = await Promise.allSettled([
          ItemService.getItems(),
          WarehouseService.getWarehouses(),
          EmployeeService.getEmployees(),
          stockOutService.getAll(),
        ])

        if (results[0].status === 'fulfilled') setItems(results[0].value as any)
        if (results[1].status === 'fulfilled') setWarehouses(((results[1].value as any[]) || []).filter(w => w.isActive))
        if (results[2].status === 'fulfilled') setEmployees(results[2].value as any[])
        if (results[3].status === 'fulfilled') {
          const data = results[3].value as StockOutResponse[];
          setStockOuts(data);
          groupStockOuts(data);
        }

        const failed = results.filter(r => r.status === 'rejected') as PromiseRejectedResult[]
        if (failed.length === results.length) {
          setError('Failed to load resources')
        } else {
          setError(null)
        }
      } finally {
        setLoading(false)
      }
    }
    if (status === 'authenticated') loadAll()
  }, [status])

  const groupStockOuts = useCallback((data: StockOutResponse[]) => {
    const grouped: Record<string, GroupedStockOut> = {};
    const singletons: GroupedStockOut[] = [];

    data.forEach(so => {
      if (so.referenceNumber) {
        if (!grouped[so.referenceNumber]) {
          grouped[so.referenceNumber] = {
            referenceNumber: so.referenceNumber,
            count: 0,
            createdAt: so.stockOutDate,
            type: so.stockOutType,
            sourceWarehouseName: so.sourceWarehouseName,
            branchName: so.branchName,
            employeeName: so.employeeName,
            note: so.note
          };
        }
        grouped[so.referenceNumber].count++;
      } else {
        // Legacy or single records without ref
        singletons.push({
          referenceNumber: `ID-${so.id}`,
          count: 1,
          createdAt: so.stockOutDate,
          type: so.stockOutType,
          sourceWarehouseName: so.sourceWarehouseName,
          branchName: so.branchName,
          employeeName: so.employeeName,
          note: so.note
        });
      }
    });

    const result = [...Object.values(grouped), ...singletons].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setGroups(result);
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!selectedSourceWarehouse) {
      setError('Please select source branch (From)'); return;
    }
    if (stockOutType === StockOutType.BRANCH_TRANSFER && !selectedBranch) {
      setError('Please select destination branch (To)'); return;
    }
    if (stockOutType === StockOutType.BRANCH_TRANSFER && selectedSourceWarehouse === selectedBranch) {
      setError('Source and Destination branches cannot be the same'); return;
    }
    if (stockOutType === StockOutType.EMPLOYEE && !selectedEmployee) {
      setError('Please select an employee'); return;
    }

    const payloadItems = lines
      .filter(l => l.itemId && l.quantity)
      .map(l => ({ itemId: parseInt(l.itemId), quantity: parseInt(l.quantity) }))

    if (payloadItems.length === 0) { setError('Add at least one item'); return }

    try {
      setLoading(true)
      const payload: any = {
        stockOutType,
        sourceWarehouseId: parseInt(selectedSourceWarehouse),
        note: notes,
        items: payloadItems
      }

      if (stockOutType === StockOutType.BRANCH_TRANSFER) {
        payload.branchId = parseInt(selectedBranch);
      }
      if (stockOutType === StockOutType.EMPLOYEE) {
        payload.employeeId = parseInt(selectedEmployee);
      }

      await stockOutService.createBatch(payload)
      setSuccess('Stock out recorded successfully')

      // Reset form
      setLines([{ itemId: '', quantity: '' }])
      setNotes('')
      // Keep source warehouse selected as it's likely reused
      setSelectedBranch('')
      setSelectedEmployee('')

      // Reload list
      const updatedData = await stockOutService.getAll();
      setStockOuts(updatedData);
      groupStockOuts(updatedData);

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to record stock out'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }, [selectedSourceWarehouse, stockOutType, selectedBranch, selectedEmployee, lines, notes, groupStockOuts])

  const handleDelete = useCallback(async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this record? Stock will be restored.')) return;
    try {
      setLoading(true);
      await stockOutService.delete(id);
      setSuccess('Record deleted and stock restored');

      // Refresh
      const updatedData = await stockOutService.getAll();
      setStockOuts(updatedData);
      groupStockOuts(updatedData);

    } catch (err) {
      setError('Failed to delete record');
    } finally {
      setLoading(false);
    }
  }, [groupStockOuts])

  const addLine = () => setLines(prev => [...prev, { itemId: '', quantity: '' }])
  const updateLine = useCallback((idx: number, field: 'itemId' | 'quantity', value: string) => {
    setLines(prev => prev.map((l, i) => i === idx ? { ...l, [field]: value } : l))
  }, [])
  const removeLine = useCallback((idx: number) => {
    setLines(prev => prev.filter((_, i) => i !== idx))
  }, [])

  const destinationWarehouses = useMemo(
    () => warehouses.filter(w => String(w.warehouseId || w.id) !== selectedSourceWarehouse),
    [warehouses, selectedSourceWarehouse]
  )

  if (!session) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-6 text-center">
          <p className="text-muted-foreground">Please sign in to manage stock.</p>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-transparent">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="animate-slide-down">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">Stock Out</h1>
          <p className="text-muted-foreground mt-2">Manage stock deductions and transfers</p>
        </div>

        {/* Messages */}
        {success && (
          <div className="fixed right-4 top-4 z-50 w-[min(420px,calc(100vw-2rem))]">
            <SuccessMessage
              message={success}
              onDismiss={() => setSuccess(null)}
              autoHide
            />
          </div>
        )}
        {error && (
          <div className="fixed right-4 top-4 z-50 w-[min(420px,calc(100vw-2rem))]">
            <ErrorMessage
              message={error}
              onRetry={() => setError(null)}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 animate-slide-up">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm card-hover">
              <form onSubmit={handleSubmit} className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Stock Out Type */}
                  <div>
                    <label className="block text-base font-semibold text-foreground mb-3">Type *</label>
                    <select
                      value={stockOutType}
                      onChange={e => setStockOutType(e.target.value as StockOutType)}
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
                    >
                      {Object.values(StockOutType).map(t => (
                        <option key={t} value={t}>{t.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </div>

                  {/* Source Branch (From) */}
                  <div>
                    <label className="block text-base font-semibold text-foreground mb-3">From Branch *</label>
                    <select
                      value={selectedSourceWarehouse}
                      onChange={(e) => setSelectedSourceWarehouse(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
                      required
                    >
                      <option value="">Select source...</option>
                      {warehouses.map(w => (<option key={w.warehouseId || w.id} value={w.warehouseId || w.id}>{w.name}</option>))}
                    </select>
                  </div>
                </div>

                {/* Conditional Fields (To) */}
                {stockOutType === StockOutType.BRANCH_TRANSFER && (
                  <div>
                    <label className="block text-base font-semibold text-foreground mb-3">To Branch *</label>
                    <select
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
                      required
                    >
                      <option value="">Select destination...</option>
                      {destinationWarehouses.map(w => (<option key={w.warehouseId || w.id} value={w.warehouseId || w.id}>{w.name}</option>))}
                    </select>
                  </div>
                )}

                {stockOutType === StockOutType.EMPLOYEE && (
                  <div>
                    <label className="block text-base font-semibold text-foreground mb-3">To Employee *</label>
                    <select
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
                      required
                    >
                      <option value="">Select an employee...</option>
                      {employees.map(e => (<option key={e.employeeId || e.id} value={e.employeeId || e.id}>{e.name} ({e.employeeCode})</option>))}
                    </select>
                  </div>
                )}

                {/* Lines */}
                <div className="space-y-3">
                  <label className="block text-base font-semibold text-foreground">Items *</label>
                  <div className="rounded-lg border border-border overflow-hidden">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-muted-foreground">Item</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-muted-foreground">Qty</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-card divide-y divide-border">
                        {lines.map((line, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-2">
                              <select value={line.itemId} onChange={e => updateLine(idx, 'itemId', e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2">
                                <option value="">Choose an item...</option>
                                {items.map(item => (<option key={item.id} value={item.id}>{item.name} (SKU: {item.sku}) - Avail: {item.currentStock}</option>))}
                              </select>
                            </td>
                            <td className="px-4 py-2">
                              <input type="number" min="1" value={line.quantity} onChange={e => updateLine(idx, 'quantity', e.target.value)} placeholder="Qty" className="w-full rounded-lg border border-border bg-background px-3 py-2" />
                            </td>
                            <td className="px-4 py-2">
                              <button type="button" onClick={() => removeLine(idx)} className="rounded-md border border-border px-3 py-2">Remove</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button type="button" onClick={addLine} className="rounded-md border border-border px-3 py-2">+ Add Item</button>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-base font-semibold text-foreground mb-3">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes..."
                    rows={4}
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full rounded-lg bg-primary px-4 py-3 text-base font-semibold text-primary-foreground shadow-md hover:shadow-lg hover:opacity-90 transition-all"
                >
                  ✅ Confirm stock out
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Stock Out List */}
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="px-6 py-5 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">Recent Transactions</h2>
                <p className="text-sm text-muted-foreground mt-1">Stock out history</p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-base font-semibold text-muted-foreground">Reference</th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-muted-foreground">From</th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-muted-foreground">To / Reason</th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-muted-foreground">Type</th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-muted-foreground">Items</th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {groups.length === 0 ? (
                  <tr><td className="px-6 py-8 text-center text-muted-foreground" colSpan={6}>No stock out transactions</td></tr>
                ) : groups.map((row) => (
                  <tr key={row.referenceNumber} className="hover:bg-accent/40 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-foreground">
                      <Link href={`/stock-out/${encodeURIComponent(row.referenceNumber)}`} className="text-foreground font-bold hover:underline hover:text-primary transition-colors">{row.referenceNumber}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {row.sourceWarehouseName || 'Main Inventory'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {row.type === StockOutType.BRANCH_TRANSFER ? `Branch: ${row.branchName}` :
                        row.type === StockOutType.EMPLOYEE ? `Employee: ${row.employeeName}` :
                          row.note || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${row.type === StockOutType.DAMAGE ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/30' :
                        row.type === StockOutType.LOST ? 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/30' :
                          row.type === StockOutType.BRANCH_TRANSFER ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/30' :
                            'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/30 dark:text-gray-300 dark:border-gray-700/30'
                        }`}>
                        {row.type.toLowerCase().replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-muted-foreground">
                      <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs">{row.count}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{new Date(row.createdAt).toLocaleString()}</td>
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
