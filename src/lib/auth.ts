import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { users, pfPlatformUsers } from "@/lib/db/schema"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        })

        if (!user?.password) return null

        const valid = await bcrypt.compare(credentials.password as string, user.password)
        if (!valid) return null

        const platformUser = await db.query.pfPlatformUsers.findFirst({
          where: eq(pfPlatformUsers.id, user.id),
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          platformRole: platformUser?.platformRole ?? "client",
          adminRole: platformUser?.adminRole ?? null,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.platformRole = (user as any).platformRole
        token.adminRole = (user as any).adminRole
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        ;(session.user as any).platformRole = token.platformRole
        ;(session.user as any).adminRole = token.adminRole
      }
      return session
    },
  },
  pages: {
    signIn: "/portal/login",
    error: "/portal/login",
  },
})
