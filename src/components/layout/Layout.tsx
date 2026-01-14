'use client'

import { SessionProvider } from 'next-auth/react'
import Sidebar from './Sidebar'
import type { Session } from 'next-auth'

interface LayoutProps {
  children: React.ReactNode
  session: Session | null
}

export default function Layout({ children, session }: LayoutProps) {
  return (
    <SessionProvider session={session}>
      {session ? (
        <div className="min-h-screen bg-background">
          <Sidebar />
          
          {/* Main Content */}
          <main className="transition-all duration-300 ease-in-out pt-14 lg:pt-0 lg:ml-64">
            <div className="min-h-screen">
              {children}
            </div>
          </main>
        </div>
      ) : (
        <>{children}</>
      )}
    </SessionProvider>
  )
}
