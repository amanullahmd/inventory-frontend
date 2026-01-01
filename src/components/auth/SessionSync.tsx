'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { apiClient } from '@/lib/api/client'

export default function SessionSync() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated' && (session as any)?.accessToken) {
      apiClient.setAuthToken((session as any).accessToken)
    } else if (status === 'unauthenticated') {
      apiClient.clearAuthToken()
    }
  }, [session, status])

  return null
}
