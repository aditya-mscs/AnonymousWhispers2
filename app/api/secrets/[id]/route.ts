import { type NextRequest, NextResponse } from "next/server"
import { getSecretById, addCommentToSecret, rateSecretDarkness } from "@/lib/db/utils"
import { containsUnsafeContent } from "@/lib/utils"

// Import mock DB functions
import * as mockDb from "@/lib/db/mock-db"

// Check if we should use mock data
const useMockDb = process.env.USE_MOCK_DATA === "true"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Use mock DB if enabled
    const secret = useMockDb ? await mockDb.getSecretById(id) : await getSecretById(id)

    if (!secret) {
      return NextResponse.json({ error: "Secret not found" }, { status: 404 })
    }

    return NextResponse.json(secret)
  } catch (error) {
    console.error("Error fetching secret:", error)
    return NextResponse.json({ error: "Failed to fetch secret" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Use mock DB if enabled
    const secret = useMockDb ? await mockDb.getSecretById(id) : await getSecretById(id)

    if (!secret) {
      return NextResponse.json({ error: "Secret not found" }, { status: 404 })
    }

    const body = await request.json()

    // Get the IP address
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1"

    // Handle different actions
    if (body.action === "rate") {
      if (typeof body.rating !== "number" || body.rating < 1 || body.rating > 10) {
        return NextResponse.json({ error: "Rating must be a number between 1 and 10" }, { status: 400 })
      }

      // Use mock DB if enabled
      const result = useMockDb
        ? await mockDb.rateSecretDarkness(id, body.rating, ip)
        : await rateSecretDarkness(id, body.rating, ip)

      return NextResponse.json(result)
    }

    if (body.action === "comment") {
      if (!body.content || body.content.trim().length === 0) {
        return NextResponse.json({ error: "Comment content is required" }, { status: 400 })
      }

      // Check for unsafe content
      if (containsUnsafeContent(body.content)) {
        return NextResponse.json({ error: "Content contains unsafe or prohibited elements" }, { status: 400 })
      }

      // Use mock DB if enabled
      const comment = useMockDb
        ? await mockDb.addCommentToSecret(id, body.content, body.username || "anonymous", ip)
        : await addCommentToSecret(id, body.content, body.username || "anonymous", ip)

      return NextResponse.json(comment)
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error updating secret:", error)
    return NextResponse.json({ error: "Failed to update secret" }, { status: 500 })
  }
}

