'use client'

import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import Navbar from './Navbar'
import SessionSync from '@/components/auth/SessionSync'

interface LayoutProps {
  children: React.ReactNode
  session?: Session | null
}

export default function Layout({ children, session }: LayoutProps) {
  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-background text-foreground">
        <SessionSync />
        <Navbar />
        <main className="w-full px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </SessionProvider>
  )
}
