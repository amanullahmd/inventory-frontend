'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { apiClient } from '@/lib/api/client'
import { formatDateDMY } from '@/lib/utils/date'

interface AuditLog {
  id: number
  userId?: number
  entityType: string
  entityId?: number
  action: string
  details?: string
  createdAt: string
}

export default function AuditLogPage() {
  const { data: session, status } = useSession()
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [userId, setUserId] = useState<string>('')
  const [entityType, setEntityType] = useState<string>('')

  const fetchLogs = async () => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams()
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)
      if (userId) params.append('userId', userId)
      if (entityType) params.append('entityType', entityType)

      const res = await apiClient.get<AuditLog[]>(`/reports/audit-log${params.toString() ? `?${params.toString()}` : ''}`)
      setLogs(Array.isArray(res.data) ? res.data : [])
    } catch (err: any) {
      setError(err.message || 'Failed to load audit logs')
      setLogs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') fetchLogs()
  }, [status])

  if (status === 'loading') {
    return (
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-6">
          <LoadingSpinner size="medium" text="Loading..." />
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-10 text-center">
          <p className="text-foreground font-medium">Please sign in to view audit log.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Audit Log</h1>
            <p className="mt-2 text-base text-muted-foreground">System activity for compliance and debugging</p>
          </div>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onRetry={fetchLogs} />
          </div>
        )}

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">User ID</label>
              <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="Optional" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Entity Type</label>
              <input type="text" value={entityType} onChange={(e) => setEntityType(e.target.value)} placeholder="Optional" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="mt-4">
            <button onClick={fetchLogs} className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Apply Filters</button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">User</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Entity</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Action</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Details</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No audit entries</td>
                  </tr>
                ) : (
                  logs.map(log => (
                    <tr key={log.id} className="hover:bg-accent/40 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{formatDateDMY(log.createdAt)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{log.userId ?? '—'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{log.entityType}{log.entityId ? ` #${log.entityId}` : ''}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{log.action}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{log.details || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
