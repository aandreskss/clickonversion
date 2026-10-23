import { validateBookingToken } from "@/lib/meetings/service"
import type { TokenValidation } from "@/types/meetings"

export const dynamic = "force-dynamic"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params

  if (!token || token.length !== 48) {
    const result: TokenValidation = { valid: false, reason: "Invalid token format" }
    return Response.json(result, { status: 400 })
  }

  try {
    const result = await validateBookingToken(token)
    const status = result.valid ? 200 : 404
    return Response.json(result, { status })
  } catch (err) {
    console.error("[booking-rights] validate error:", err)
    return Response.json({ valid: false, reason: "Server error" }, { status: 500 })
  }
}
