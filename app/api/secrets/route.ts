import { type NextRequest, NextResponse } from "next/server"
import { createNewSecret, getSecrets } from "@/lib/db/utils"
import { containsUnsafeContent } from "@/lib/utils"
import { rateLimiter } from "@/lib/rate-limit"

// Import mock DB functions
import * as mockDb from "@/lib/db/mock-db"

// Check if we should use mock data
const useMockDb = process.env.USE_MOCK_DATA === "true"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sort = (searchParams.get("sort") as "recent" | "darkness" | "trending") || "recent"
    const limit = Number.parseInt(searchParams.get("limit") || "20", 10)
    const cursor = searchParams.get("cursor")

    let lastEvaluatedKey = undefined
    if (cursor) {
      try {
        lastEvaluatedKey = JSON.parse(Buffer.from(cursor, "base64").toString())
      } catch (e) {
        console.error("Invalid cursor", e)
      }
    }

    // Use mock DB if enabled, otherwise use real DB (which could be local or production)
    const result = useMockDb
      ? await mockDb.getSecrets(sort, limit, lastEvaluatedKey)
      : await getSecrets(sort, limit, lastEvaluatedKey)

    const nextCursor = result.lastEvaluatedKey
      ? Buffer.from(JSON.stringify(result.lastEvaluatedKey)).toString("base64")
      : null

    return NextResponse.json({
      secrets: result.secrets || [], // Ensure we always return an array
      nextCursor,
    })
  } catch (error) {
    console.error("Error fetching secrets:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch secrets",
        secrets: [], // Return empty array on error
        nextCursor: null,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await rateLimiter(request, 5, 60 * 1000) // 5 requests per minute
    if (rateLimitResponse) return rateLimitResponse

    const body = await request.json()

    // Validate input
    if (!body.content || body.content.length < 10) {
      return NextResponse.json({ error: "Secret must be at least 10 characters long" }, { status: 400 })
    }

    if (typeof body.darkness !== "number" || body.darkness < 0 || body.darkness > 100) {
      return NextResponse.json({ error: "Darkness must be a number between 0 and 100" }, { status: 400 })
    }

    if (!body.username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 })
    }

    // Check for unsafe content
    if (containsUnsafeContent(body.content)) {
      return NextResponse.json({ error: "Content contains unsafe or prohibited elements" }, { status: 400 })
    }

    // Get the IP address
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1"

    // Create the secret using mock DB if enabled
    const secret = useMockDb
      ? await mockDb.createNewSecret(body.content, body.darkness, body.username, ip)
      : await createNewSecret(body.content, body.darkness, body.username, ip)

    return NextResponse.json(secret, { status: 201 })
  } catch (error) {
    console.error("Error creating secret:", error)
    return NextResponse.json({ error: "Failed to create secret" }, { status: 500 })
  }
}

