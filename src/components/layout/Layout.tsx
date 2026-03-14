'use client'

import { SessionProvider } from 'next-auth/react'
import Sidebar from './Sidebar'
import TopHeader from './TopHeader'
import type { Session } from 'next-auth'

interface LayoutProps {
  children: React.ReactNode
  session: Session | null
}

export default function Layout({ children, session }: LayoutProps) {
  return (
    <SessionProvider session={session}>
      {session ? (
        <div className="min-h-screen relative z-0">
          {/* Background Watermark */}
          <div
            className="fixed inset-0 z-[-1] pointer-events-none"
            style={{
              backgroundImage: 'url("/images/DPE_cover.webp")',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '50%',
              opacity: 0.07,
              left: '15%',
            }}
            aria-hidden="true"
          />
          <TopHeader />
          <Sidebar />

          {/* Main Content */}
          <main className="transition-all duration-300 ease-in-out pt-20 lg:pt-16 lg:ml-64 relative z-10">
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

