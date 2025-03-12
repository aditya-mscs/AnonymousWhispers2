import { nanoid } from "nanoid"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, BatchWriteCommand } from "@aws-sdk/lib-dynamodb"
import { getAwsConfig } from "../lib/aws-client"
import { hashIpAddress } from "../lib/db/utils"

// Initialize the DynamoDB client
const client = new DynamoDBClient(getAwsConfig())
const docClient = DynamoDBDocumentClient.from(client)

// Sample data for seeding
const sampleSecrets = [
  {
    content:
      "Sometimes I pretend to be busy at work just to avoid talking to my colleagues. I've perfected the art of looking focused while actually doing nothing.",
    darkness: 30,
    username: "silentShadow",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    content:
      "I've been lying to my family about my career for 3 years. They think I'm a successful lawyer, but I actually work at a call center. I'm too ashamed to tell them the truth.",
    darkness: 85,
    username: "hiddenTruth",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    content:
      "I secretly hate my best friend's partner and have been trying to break them up for months. I know it's wrong but I can't stop myself.",
    darkness: 75,
    username: "chaosCreator",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
  {
    content:
      "I've been stealing small amounts of money from my workplace for years. No one has noticed, and I've taken thousands of dollars over time.",
    darkness: 90,
    username: "shadowCollector",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
  },
]

const sampleComments = [
  {
    secretIndex: 0,
    content: "I do this too! Thought I was the only one.",
    username: "mysteryMouse",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  },
  {
    secretIndex: 1,
    content: "That's a heavy burden to carry. Hope you find peace.",
    username: "gentleWhisper",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
  },
  {
    secretIndex: 1,
    content: "Your worth isn't defined by your job title. Be kind to yourself.",
    username: "wiseSage",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
  },
  {
    secretIndex: 3,
    content: "This could end really badly for you. Be careful.",
    username: "realistRaven",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
]

async function seedDatabase() {
  try {
    console.log("Starting database seeding...")

    // Generate secret IDs
    const secretIds = sampleSecrets.map(() => nanoid(10))

    // Create items for batch write
    const items = []

    // Add secrets
    for (let i = 0; i < sampleSecrets.length; i++) {
      const secret = sampleSecrets[i]
      const id = secretIds[i]
      const ipHash = hashIpAddress("127.0.0.1") // Dummy IP for seeding

      items.push({
        PutRequest: {
          Item: {
            pk: `secret#${id}`,
            sk: "metadata",
            gsi1pk: `ip#${ipHash}`,
            gsi1sk: secret.createdAt,
            gsi2pk: "secret",
            gsi2sk: secret.createdAt,
            gsi3pk: "secret",
            gsi3sk: secret.darkness.toString().padStart(3, "0"),
            id,
            entity: "secret",
            content: secret.content,
            darkness: secret.darkness,
            username: secret.username,
            ipHash,
            darknessRatings: [secret.darkness],
            averageDarkness: secret.darkness,
            createdAt: secret.createdAt,
            commentCount: 0,
          },
        },
      })
    }

    // Add comments
    for (const comment of sampleComments) {
      const id = nanoid(10)
      const secretId = secretIds[comment.secretIndex]
      const ipHash = hashIpAddress("127.0.0.1") // Dummy IP for seeding

      items.push({
        PutRequest: {
          Item: {
            pk: `comment#${id}`,
            sk: "metadata",
            gsi1pk: `secret#${secretId}`,
            gsi1sk: comment.createdAt,
            gsi2pk: `ip#${ipHash}`,
            gsi2sk: comment.createdAt,
            id,
            entity: "comment",
            secretId,
            content: comment.content,
            username: comment.username,
            ipHash,
            createdAt: comment.createdAt,
          },
        },
      })

      // Update comment count for the secret - FIX THE TYPE ERROR HERE
      const secretIndex = items.findIndex((item) => item.PutRequest?.Item?.pk === `secret#${secretId}`)

      // Add a check to ensure the object exists before incrementing
      if (secretIndex !== -1 && items[secretIndex]?.PutRequest?.Item) {
        // Make sure commentCount exists and is a number
        if (typeof items[secretIndex].PutRequest.Item.commentCount === "number") {
          items[secretIndex].PutRequest.Item.commentCount += 1
        }
      }
    }

    // Split items into chunks of 25 (DynamoDB batch write limit)
    const chunks = []
    for (let i = 0; i < items.length; i += 25) {
      chunks.push(items.slice(i, i + 25))
    }

    // Write items in batches
    for (const chunk of chunks) {
      const command = new BatchWriteCommand({
        RequestItems: {
          DarkSecrets: chunk,
        },
      })

      await docClient.send(command)
    }

    console.log(
      `Successfully seeded database with ${sampleSecrets.length} secrets and ${sampleComments.length} comments.`,
    )
  } catch (error) {
    console.error("Error seeding database:", error)
  }
}

// Run the seeding function
seedDatabase()

