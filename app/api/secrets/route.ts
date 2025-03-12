import { type NextRequest, NextResponse } from "next/server"
import type { Secret } from "@/lib/types"

// Mock database for development
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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const sort = searchParams.get("sort") || "recent"

  const sortedSecrets = [...secrets]

  if (sort === "recent") {
    sortedSecrets.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  } else if (sort === "darkness") {
    sortedSecrets.sort((a, b) => b.darkness - a.darkness)
  } else if (sort === "trending") {
    sortedSecrets.sort((a, b) => b.likes + b.comments.length * 2 - (a.likes + a.comments.length * 2))
  }

  return NextResponse.json(sortedSecrets)
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

    // Create new secret
    const newSecret: Secret = {
      id: Math.random().toString(36).substring(2, 9),
      content: body.content,
      darkness: body.darkness,
      username: body.username,
      likes: 0,
      createdAt: new Date(),
      comments: [],
    }

    // In a real app, save to database
    secrets.unshift(newSecret)

    return NextResponse.json(newSecret, { status: 201 })
  } catch (error) {
    console.error("Error creating secret:", error)
    return NextResponse.json({ error: "Failed to create secret" }, { status: 500 })
  }
}

