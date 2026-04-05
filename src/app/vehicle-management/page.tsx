'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function VehicleManagementRoot() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/vehicle-management/dashboard')
  }, [router])

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4 animate-pulse">
          <svg className="w-8 h-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
          </svg>
        </div>
        <p className="text-muted-foreground">Redirecting to Vehicle Dashboard...</p>
      </div>
    </div>
  )
}
