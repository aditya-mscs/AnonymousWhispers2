import type { Secret, SecretInput } from "@/lib/types"

// Fetch secrets with pagination
export async function fetchSecrets({
  sort = "recent",
  limit = 20,
  cursor = null,
}: {
  sort: "recent" | "darkness" | "trending"
  limit?: number
  cursor?: string | null
}): Promise<{ secrets: Secret[]; nextCursor: string | null }> {
  const params = new URLSearchParams()
  params.append("sort", sort)
  params.append("limit", limit.toString())
  if (cursor) {
    params.append("cursor", cursor)
  }

  const response = await fetch(`/api/secrets?${params.toString()}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch secrets: ${response.statusText}`)
  }

  return await response.json()
}

// Fetch a single secret by ID
export async function fetchSecretById(id: string): Promise<Secret | null> {
  const response = await fetch(`/api/secrets/${id}`)

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch secret: ${response.statusText}`)
  }

  return await response.json()
}

// Create a new secret
export async function createSecret(input: SecretInput): Promise<Secret> {
  const response = await fetch("/api/secrets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to create secret")
  }

  return await response.json()
}

// Add a comment to a secret
export async function addComment(secretId: string, content: string): Promise<Comment> {
  // Get username from localStorage
  const username = localStorage.getItem("username") || "anonymous"

  const response = await fetch(`/api/secrets/${secretId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "comment",
      content,
      username,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to add comment")
  }

  return await response.json()
}

// Rate a secret's darkness
export async function rateSecretDarkness(
  secretId: string,
  rating: number,
): Promise<{ rating: number; averageRating: number }> {
  const response = await fetch(`/api/secrets/${secretId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "rate",
      rating,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to rate secret")
  }

  return await response.json()
}

