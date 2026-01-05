'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'

export default function RedirectOnUnauthenticated() {
  const { status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'unauthenticated') {
      if (!pathname?.startsWith('/auth')) {
        router.replace('/auth/signin')
      }
    }
  }, [status, pathname, router])

  return null
}
