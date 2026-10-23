import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      platformRole: "admin" | "staff" | "client"
      adminRole: "owner" | "admin" | "manager" | "specialist" | null
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    platformRole: "admin" | "staff" | "client"
    adminRole: "owner" | "admin" | "manager" | "specialist" | null
  }
}
