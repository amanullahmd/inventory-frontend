'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function ChangePassword() {
  const router = useRouter()
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('All fields are required')
      setLoading(false)
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match')
      setLoading(false)
      return
    }

    if (formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    if (!/[A-Z]/.test(formData.newPassword) || !/[a-z]/.test(formData.newPassword) || !/\d/.test(formData.newPassword)) {
      setError('Password must contain uppercase, lowercase, and numbers')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to change password')
      }

      setSuccess(true)
      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      })

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div>
            <h2 className="text-center text-4xl font-semibold tracking-tight text-foreground">Change password</h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">Set a new password for your account</p>
          </div>

          {success ? (
            <div className="mt-6 rounded-lg border border-chart-2/30 bg-chart-2/10 p-4">
              <p className="text-sm font-medium text-chart-2">Password changed successfully. Redirecting…</p>
            </div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {error ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
                  <p className="text-sm font-medium text-destructive">{error}</p>
                </div>
              ) : null}

              <div className="space-y-4">
              <div>
                <label htmlFor="oldPassword" className="block text-base font-medium text-foreground mb-1">
                  Current Password
                </label>
                <input
                  id="oldPassword"
                  name="oldPassword"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter your current password"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-base font-medium text-foreground mb-1">
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter new password (min 8 chars)"
                  value={formData.newPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
                <p className="mt-1 text-sm text-muted-foreground">
                  Must contain uppercase, lowercase, and numbers
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-base font-medium text-foreground mb-1">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Changing Password...' : 'Change Password'}
            </button>

            <div className="text-center">
              <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
                Skip for now
              </Link>
            </div>
          </form>
          )}
        </div>
      </div>
    </div>
  )
}
