import NextAuth from "next-auth"
import { authConfig } from "./config"

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)

// Type extensions for NextAuth
declare module "next-auth" {
  interface Session {
    accessToken?: string
    roles?: string[]
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    roles?: string[]
  }
}