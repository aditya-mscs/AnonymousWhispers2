import crypto from "crypto"
import { nanoid } from "nanoid"
import { Secrets, Comments, DarknessRatings } from "./models"
import type { Secret, Comment } from "@/lib/types"

// Hash IP address for anonymity while still allowing for rate limiting
export function hashIpAddress(ip: string): string {
  const salt = process.env.IP_HASH_SALT || "default-salt"
  return crypto
    .createHash("sha256")
    .update(ip + salt)
    .digest("hex")
}

// Convert database secret to API secret
export function mapDbSecretToApiSecret(dbSecret: any): Secret {
  return {
    id: dbSecret.id,
    content: dbSecret.content,
    darkness: dbSecret.darkness,
    username: dbSecret.username,
    darknessRatings: dbSecret.darknessRatings || [],
    averageDarkness: dbSecret.averageDarkness,
    createdAt: dbSecret.createdAt,
    comments: [], // Comments are fetched separately
  }
}

// Convert database comment to API comment
export function mapDbCommentToApiComment(dbComment: any): Comment {
  return {
    id: dbComment.id,
    content: dbComment.content,
    username: dbComment.username,
    createdAt: dbComment.createdAt,
  }
}

// Create a new secret
export async function createNewSecret(content: string, darkness: number, username: string, ipAddress: string) {
  const now = new Date().toISOString()
  const id = nanoid(10)
  const ipHash = hashIpAddress(ipAddress)

  const secret = await Secrets.create({
    id,
    content,
    darkness,
    username,
    ipHash,
    darknessRatings: [darkness],
    averageDarkness: darkness,
    createdAt: now,
    commentCount: 0,
  }).go()

  return mapDbSecretToApiSecret(secret.data)
}

// Get secrets with pagination
export async function getSecrets(sort: "recent" | "darkness" | "trending", limit = 20, lastEvaluatedKey?: any) {
  let query

  if (sort === "recent") {
    query = Secrets.query
      .byCreatedAt({
        entity: "secret",
      })
      .desc()
  } else if (sort === "darkness") {
    query = Secrets.query
      .byDarkness({
        entity: "secret",
      })
      .desc()
  } else {
    // For trending, we'll use the same as darkness for now
    // In a real app, you might have a more complex trending algorithm
    query = Secrets.query
      .byDarkness({
        entity: "secret",
      })
      .desc()
  }

  const result = await query.limit(limit).go({ cursor: lastEvaluatedKey })

  const secrets = result.data.map(mapDbSecretToApiSecret)

  // Get comments for each secret
  for (const secret of secrets) {
    const commentsResult = await Comments.query
      .bySecretId({
        secretId: secret.id,
      })
      .limit(5)
      .go()

    secret.comments = commentsResult.data.map(mapDbCommentToApiComment)
  }

  return {
    secrets,
    lastEvaluatedKey: result.cursor,
  }
}

// Get a single secret by ID
export async function getSecretById(id: string) {
  const secretResult = await Secrets.get({ id }).go()

  if (!secretResult.data) {
    return null
  }

  const secret = mapDbSecretToApiSecret(secretResult.data)

  // Get comments for the secret
  const commentsResult = await Comments.query
    .bySecretId({
      secretId: id,
    })
    .go()

  secret.comments = commentsResult.data.map(mapDbCommentToApiComment)

  return secret
}

// Add a comment to a secret
export async function addCommentToSecret(secretId: string, content: string, username: string, ipAddress: string) {
  const now = new Date().toISOString()
  const id = nanoid(10)
  const ipHash = hashIpAddress(ipAddress)

  // Create the comment
  const commentResult = await Comments.create({
    id,
    secretId,
    content,
    username,
    ipHash,
    createdAt: now,
  }).go()

  // Update the comment count on the secret
  await Secrets.update({
    id: secretId,
  })
    .add({
      commentCount: 1,
    })
    .go()

  return mapDbCommentToApiComment(commentResult.data)
}

// Rate a secret's darkness
export async function rateSecretDarkness(secretId: string, rating: number, ipAddress: string) {
  const now = new Date().toISOString()
  const id = nanoid(10)
  const ipHash = hashIpAddress(ipAddress)

  // Check if this IP has already rated this secret
  const existingRating = await DarknessRatings.query
    .bySecretIdAndIpHash({
      secretId,
      ipHash,
    })
    .go()

  if (existingRating.data.length > 0) {
    // Update existing rating
    await DarknessRatings.update({
      id: existingRating.data[0].id,
    })
      .set({
        rating,
      })
      .go()
  } else {
    // Create new rating
    await DarknessRatings.create({
      id,
      secretId,
      ipHash,
      rating,
      createdAt: now,
    }).go()
  }

  // Get all ratings for this secret
  const allRatings = await DarknessRatings.query
    .bySecretIdAndIpHash({
      secretId,
    })
    .go()

  const ratings = allRatings.data.map((r) => r.rating)
  const averageRating = ratings.reduce((sum, r) => sum + r, 0) / ratings.length

  // Update the secret with the new average rating
  await Secrets.update({
    id: secretId,
  })
    .set({
      darknessRatings: ratings,
      averageDarkness: Math.round(averageRating),
    })
    .go()

  return {
    rating,
    averageRating: Math.round(averageRating),
  }
}

