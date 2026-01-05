'use client'

import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import Sidebar from './Sidebar'
import SessionSync from '@/components/auth/SessionSync'
import RedirectOnUnauthenticated from '@/components/auth/RedirectOnUnauthenticated'

interface LayoutProps {
  children: React.ReactNode
  session?: Session | null
}

export default function Layout({ children, session }: LayoutProps) {
  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-background text-foreground flex">
        <SessionSync />
        <RedirectOnUnauthenticated />
        <Sidebar />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </SessionProvider>
  )
}
