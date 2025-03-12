import { type NextRequest, NextResponse } from "next/server"
import type { Secret } from "@/lib/types"

// Mock database for development (same as in the main route file)
const secrets: Secret[] = [
  {
    id: "1",
    content:
      "Sometimes I pretend to be busy at work just to avoid talking to my colleagues. I've perfected the art of looking focused while actually doing nothing.",
    darkness: 30,
    username: "silentShadow",
    likes: 42,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    comments: [
      {
        id: "c1",
        content: "I do this too! Thought I was the only one.",
        username: "mysteryMouse",
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      },
    ],
  },
  // More mock data would be here
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const secret = secrets.find((s) => s.id === id)

  if (!secret) {
    return NextResponse.json({ error: "Secret not found" }, { status: 404 })
  }

  return NextResponse.json(secret)
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const secret = secrets.find((s) => s.id === id)

    if (!secret) {
      return NextResponse.json({ error: "Secret not found" }, { status: 404 })
    }

    const body = await request.json()

    // Handle different actions
    if (body.action === "like") {
      secret.likes += 1
      return NextResponse.json({ success: true, likes: secret.likes })
    }

    if (body.action === "comment") {
      if (!body.content || body.content.trim().length === 0) {
        return NextResponse.json({ error: "Comment content is required" }, { status: 400 })
      }

      const newComment = {
        id: Math.random().toString(36).substring(2, 9),
        content: body.content,
        username: body.username || "anonymous",
        createdAt: new Date(),
      }

      secret.comments.push(newComment)
      return NextResponse.json({ success: true, comment: newComment })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error updating secret:", error)
    return NextResponse.json({ error: "Failed to update secret" }, { status: 500 })
  }
}

