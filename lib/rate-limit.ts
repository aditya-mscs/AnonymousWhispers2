import { type NextRequest, NextResponse } from "next/server"
import { hashIpAddress } from "./db/utils"

// Simple in-memory store for rate limiting
// In production, use Redis or another distributed cache
const rateLimit = new Map<string, { count: number; timestamp: number }>()

export async function rateLimiter(
  request: NextRequest,
  limit = 10,
  windowMs: number = 60 * 1000, // 1 minute
) {
  // Get IP address
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1"

  // Hash the IP for privacy
  const hashedIp = hashIpAddress(ip)

  // Get current timestamp
  const now = Date.now()

  // Get existing rate limit data
  const rateData = rateLimit.get(hashedIp)

  // If no existing data or window has expired, create new entry
  if (!rateData || now - rateData.timestamp > windowMs) {
    rateLimit.set(hashedIp, { count: 1, timestamp: now })
    return null
  }

  // If within window but under limit, increment count
  if (rateData.count < limit) {
    rateLimit.set(hashedIp, {
      count: rateData.count + 1,
      timestamp: rateData.timestamp,
    })
    return null
  }

  // If over limit, return error response
  return NextResponse.json({ error: "Too many requests, please try again later" }, { status: 429 })
}

