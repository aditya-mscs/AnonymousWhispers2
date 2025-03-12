import type { Secret, SecretInput, Comment } from "@/lib/types"

// Mock data for development
const MOCK_SECRETS: Secret[] = [
  {
    id: "1",
    content:
      "Sometimes I pretend to be busy at work just to avoid talking to my colleagues. I've perfected the art of looking focused while actually doing nothing.",
    darkness: 30,
    username: "silentShadow",
    darknessRatings: [7, 8, 6, 5, 9], // Example ratings
    averageDarkness: 7, // Example average
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
    darknessRatings: [9, 8, 9, 10, 9], // Example ratings
    averageDarkness: 9, // Example average
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
    darknessRatings: [6, 7, 8, 7, 6], // Example ratings
    averageDarkness: 7, // Example average
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    comments: [],
  },
  {
    id: "4",
    content:
      "I've been stealing small amounts of money from my workplace for years. No one has noticed, and I've taken thousands of dollars over time.",
    darkness: 90,
    username: "shadowCollector",
    darknessRatings: [10, 9, 10, 10, 9], // Example ratings
    averageDarkness: 10, // Example average
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

// In a real app, these would be API calls to your backend
export async function fetchSecrets({
  sort = "recent",
}: { sort: "recent" | "darkness" | "trending" }): Promise<Secret[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Sort based on criteria
  const sortedSecrets = [...MOCK_SECRETS]

  if (sort === "recent") {
    sortedSecrets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } else if (sort === "darkness") {
    sortedSecrets.sort((a, b) => b.darkness - a.darkness)
  } else if (sort === "trending") {
    sortedSecrets.sort((a, b) => b.averageDarkness - a.averageDarkness)
  }

  return sortedSecrets
}

export async function fetchSecretById(id: string): Promise<Secret | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const secret = MOCK_SECRETS.find((s) => s.id === id)
  return secret || null
}

export async function createSecret(input: SecretInput): Promise<Secret> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real app, this would be a POST request to your API
  const newSecret: Secret = {
    id: Math.random().toString(36).substring(2, 9),
    content: input.content,
    darkness: input.darkness,
    username: input.username,
    darknessRatings: [5],
    averageDarkness: 5,
    createdAt: new Date().toISOString(),
    comments: [],
  }

  // In development, we're just returning the new secret
  // In production, this would be saved to your database
  return newSecret
}

export async function addComment(secretId: string, content: string): Promise<Comment> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Get username from localStorage (in a real app, this would be handled server-side)
  let username = "anonymousUser"
  if (typeof window !== "undefined") {
    username = localStorage.getItem("username") || username
  }

  // Create new comment
  const newComment: Comment = {
    id: Math.random().toString(36).substring(2, 9),
    content,
    username,
    createdAt: new Date().toISOString(),
  }

  // In production, this would update your database
  return newComment
}

