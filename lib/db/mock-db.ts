import type { Secret, Comment } from "@/lib/types"
import { nanoid } from "nanoid"

// In-memory database
const secrets: Secret[] = [
  {
    id: "1",
    content:
      "Sometimes I pretend to be busy at work just to avoid talking to my colleagues. I've perfected the art of looking focused while actually doing nothing.",
    darkness: 30,
    username: "silentShadow",
    darknessRatings: [30],
    averageDarkness: 30,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    comments: [
      {
        id: "c1",
        content: "I do this too! Thought I was the only one.",
        username: "mysteryMouse",
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      },
    ],
  },
  {
    id: "2",
    content:
      "I've been lying to my family about my career for 3 years. They think I'm a successful lawyer, but I actually work at a call center. I'm too ashamed to tell them the truth.",
    darkness: 85,
    username: "hiddenTruth",
    darknessRatings: [85],
    averageDarkness: 85,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    comments: [
      {
        id: "c2",
        content: "That's a heavy burden to carry. Hope you find peace.",
        username: "gentleWhisper",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
      },
      {
        id: "c3",
        content: "Your worth isn't defined by your job title. Be kind to yourself.",
        username: "wiseSage",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
      },
    ],
  },
  {
    id: "3",
    content:
      "I secretly hate my best friend's partner and have been trying to break them up for months. I know it's wrong but I can't stop myself.",
    darkness: 75,
    username: "chaosCreator",
    darknessRatings: [75],
    averageDarkness: 75,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    comments: [],
  },
  {
    id: "4",
    content:
      "I've been stealing small amounts of money from my workplace for years. No one has noticed, and I've taken thousands of dollars over time.",
    darkness: 90,
    username: "shadowCollector",
    darknessRatings: [90],
    averageDarkness: 90,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    comments: [
      {
        id: "c4",
        content: "This could end really badly for you. Be careful.",
        username: "realistRaven",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
      },
    ],
  },
]

// Mock database functions
export async function getSecrets(sort: "recent" | "darkness" | "trending", limit = 20, lastEvaluatedKey?: any) {
  const sortedSecrets = [...secrets]

  if (sort === "recent") {
    sortedSecrets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } else if (sort === "darkness") {
    sortedSecrets.sort((a, b) => b.darkness - a.darkness)
  } else if (sort === "trending") {
    sortedSecrets.sort((a, b) => b.averageDarkness - a.averageDarkness)
  }

  // Simple pagination
  const startIndex = lastEvaluatedKey ? Number.parseInt(lastEvaluatedKey.index) : 0
  const endIndex = startIndex + limit
  const paginatedSecrets = sortedSecrets.slice(startIndex, endIndex)

  const nextKey = endIndex < sortedSecrets.length ? { index: endIndex.toString() } : undefined

  return {
    secrets: paginatedSecrets,
    lastEvaluatedKey: nextKey,
  }
}

export async function getSecretById(id: string) {
  const secret = secrets.find((s) => s.id === id)
  return secret || null
}

export async function createNewSecret(content: string, darkness: number, username: string, ipAddress: string) {
  const id = nanoid(10)
  const now = new Date().toISOString()

  const newSecret: Secret = {
    id,
    content,
    darkness,
    username,
    darknessRatings: [darkness],
    averageDarkness: darkness,
    createdAt: now,
    comments: [],
  }

  secrets.unshift(newSecret)
  return newSecret
}

export async function addCommentToSecret(secretId: string, content: string, username: string, ipAddress: string) {
  const secret = secrets.find((s) => s.id === secretId)
  if (!secret) {
    throw new Error("Secret not found")
  }

  const id = nanoid(10)
  const now = new Date().toISOString()

  const newComment: Comment = {
    id,
    content,
    username,
    createdAt: now,
  }

  secret.comments.push(newComment)
  return newComment
}

export async function rateSecretDarkness(secretId: string, rating: number, ipAddress: string) {
  const secret = secrets.find((s) => s.id === secretId)
  if (!secret) {
    throw new Error("Secret not found")
  }

  secret.darknessRatings.push(rating)

  // Calculate new average
  const average = secret.darknessRatings.reduce((sum, r) => sum + r, 0) / secret.darknessRatings.length
  secret.averageDarkness = Math.round(average)

  return {
    rating,
    averageRating: secret.averageDarkness,
  }
}

