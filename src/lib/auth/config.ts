import { NextAuthConfig, User } from "next-auth"
import Credentials from "next-auth/providers/credentials"

// Demo users for development
const DEMO_USERS = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'Admin@123456',
    name: 'Admin User',
    roles: ['ROLE_ADMIN', 'ROLE_USER'],
  },
  {
    id: '2',
    email: 'user@example.com',
    password: 'User@123456',
    name: 'Demo User',
    roles: ['ROLE_USER'],
  },
]

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

        // Demo authentication - check against hardcoded demo users
        const user = DEMO_USERS.find(
          u => u.email === credentials.email && u.password === credentials.password
        )

        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            roles: user.roles,
            accessToken: `demo-token-${user.id}-${Date.now()}`,
            refreshToken: `demo-refresh-${user.id}`,
            passwordChangeRequired: false,
          } as User & { accessToken: string; refreshToken: string; roles: string[]; passwordChangeRequired: boolean }
        }

        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.accessToken = (user as any).accessToken
        token.refreshToken = (user as any).refreshToken
        token.roles = (user as any).roles
        token.id = user.id
        token.passwordChangeRequired = (user as any).passwordChangeRequired || false
        return token
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
}
