import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    refreshToken?: string
    roles?: string[]
    passwordChangeRequired?: boolean
    user?: DefaultSession["user"] & {
      id?: string
    }
  }

  interface User {
    accessToken?: string
    refreshToken?: string
    roles?: string[]
    passwordChangeRequired?: boolean
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    roles?: string[]
    id?: string
    passwordChangeRequired?: boolean
  }
}
