import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.redirect(
    new URL("/portal/dashboard", process.env.AUTH_URL ?? "http://localhost:3000")
  )
}
