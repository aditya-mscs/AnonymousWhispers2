import { type NextRequest, NextResponse } from "next/server"
import { createNewSecret, getSecrets } from "@/lib/db/utils"
import { containsUnsafeContent } from "@/lib/utils"

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

    const result = await getSecrets(sort, limit, lastEvaluatedKey)

    const nextCursor = result.lastEvaluatedKey
      ? Buffer.from(JSON.stringify(result.lastEvaluatedKey)).toString("base64")
      : null

    return NextResponse.json({
      secrets: result.secrets,
      nextCursor,
    })
  } catch (error) {
    console.error("Error fetching secrets:", error)
    return NextResponse.json({ error: "Failed to fetch secrets" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
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

    // Create the secret
    const secret = await createNewSecret(body.content, body.darkness, body.username, ip)

    return NextResponse.json(secret, { status: 201 })
  } catch (error) {
    console.error("Error creating secret:", error)
    return NextResponse.json({ error: "Failed to create secret" }, { status: 500 })
  }
}

