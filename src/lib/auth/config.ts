import { NextAuthConfig, User } from "next-auth"
import Credentials from "next-auth/providers/credentials"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api'

// Helper function to refresh access token
async function refreshAccessToken(refreshToken: string) {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    })

    if (!res.ok) {
      throw new Error('Token refresh failed')
    }

    const data = await res.json()
    return data
  } catch (error) {
    console.error('Token refresh error:', error)
    throw error
  }
}

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          })

          const data = await res.json()

          if (res.ok && data.accessToken) {
            return {
              id: data.id?.toString() || '1',
              name: data.email,
              email: data.email,
              roles: data.roles || ['ROLE_USER'],
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              passwordChangeRequired: data.passwordChangeRequired || false,
            } as User & { accessToken: string; refreshToken: string; roles: string[]; passwordChangeRequired: boolean }
          }

          return null
        } catch (e) {
          console.error("Auth error:", e)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.accessToken = (user as any).accessToken
        token.refreshToken = (user as any).refreshToken
        token.roles = (user as any).roles
        token.id = user.id
        token.passwordChangeRequired = (user as any).passwordChangeRequired || false
        // Set token expiration time (15 minutes from now)
        token.accessTokenExpires = Date.now() + 15 * 60 * 1000
        return token
      }

      // Check if token needs refresh (refresh if expires in next 5 minutes)
      if (token.accessTokenExpires && Date.now() < (token.accessTokenExpires as number) - 5 * 60 * 1000) {
        // Token is still valid, return as is
        return token
      }

      // Token is expired or about to expire, refresh it
      if (token.refreshToken) {
        try {
          const refreshedData = await refreshAccessToken(token.refreshToken as string)
          return {
            ...token,
            accessToken: refreshedData.accessToken,
            refreshToken: refreshedData.refreshToken || token.refreshToken,
            accessTokenExpires: Date.now() + 15 * 60 * 1000,
          }
        } catch (error) {
          console.error('Failed to refresh token:', error)
          // Return token as is, let API client handle 401/403 errors
          return token
        }
      }

      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.refreshToken = token.refreshToken as string
      session.roles = token.roles as string[]
      session.passwordChangeRequired = token.passwordChangeRequired as boolean
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  events: {
    async signOut() {
      // Clear any cached tokens on sign out
      console.log('User signed out')
    },
  },
}
