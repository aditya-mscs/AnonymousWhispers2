import { Entity } from "electrodb"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"

// Initialize the DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
  ...(process.env.NODE_ENV === "development" && {
    endpoint: "http://localhost:8000",
    sslEnabled: false,
  }),
})

const docClient = DynamoDBDocumentClient.from(client)

// Define the Secrets entity
export const Secrets = new Entity(
  {
    model: {
      entity: "secret",
      version: "1",
      service: "dark-secrets",
    },
    attributes: {
      id: {
        type: "string",
        required: true,
        readOnly: true,
      },
      content: {
        type: "string",
        required: true,
      },
      darkness: {
        type: "number",
        required: true,
      },
      username: {
        type: "string",
        required: true,
      },
      ipHash: {
        type: "string",
        required: true,
      },
      darknessRatings: {
        type: "list",
        items: {
          type: "number",
        },
        default: [],
      },
      averageDarkness: {
        type: "number",
        required: true,
      },
      createdAt: {
        type: "string",
        required: true,
        readOnly: true,
      },
      commentCount: {
        type: "number",
        default: 0,
      },
    },
    indexes: {
      primary: {
        pk: {
          field: "pk",
          composite: ["id"],
        },
        sk: {
          field: "sk",
          composite: [],
        },
      },
      byIpHash: {
        index: "gsi1",
        pk: {
          field: "gsi1pk",
          composite: ["ipHash"],
        },
        sk: {
          field: "gsi1sk",
          composite: ["createdAt"],
        },
      },
      byCreatedAt: {
        index: "gsi2",
        pk: {
          field: "gsi2pk",
          composite: ["entity"],
        },
        sk: {
          field: "gsi2sk",
          composite: ["createdAt"],
        },
      },
      byDarkness: {
        index: "gsi3",
        pk: {
          field: "gsi3pk",
          composite: ["entity"],
        },
        sk: {
          field: "gsi3sk",
          composite: ["averageDarkness"],
        },
      },
    },
  },
  {
    client: docClient,
    table: "DarkSecrets",
  },
)

// Define the Comments entity
export const Comments = new Entity(
  {
    model: {
      entity: "comment",
      version: "1",
      service: "dark-secrets",
    },
    attributes: {
      id: {
        type: "string",
        required: true,
        readOnly: true,
      },
      secretId: {
        type: "string",
        required: true,
      },
      content: {
        type: "string",
        required: true,
      },
      username: {
        type: "string",
        required: true,
      },
      ipHash: {
        type: "string",
        required: true,
      },
      createdAt: {
        type: "string",
        required: true,
        readOnly: true,
      },
    },
    indexes: {
      primary: {
        pk: {
          field: "pk",
          composite: ["id"],
        },
        sk: {
          field: "sk",
          composite: [],
        },
      },
      bySecretId: {
        index: "gsi1",
        pk: {
          field: "gsi1pk",
          composite: ["secretId"],
        },
        sk: {
          field: "gsi1sk",
          composite: ["createdAt"],
        },
      },
      byIpHash: {
        index: "gsi2",
        pk: {
          field: "gsi2pk",
          composite: ["ipHash"],
        },
        sk: {
          field: "gsi2sk",
          composite: ["createdAt"],
        },
      },
    },
  },
  {
    client: docClient,
    table: "DarkSecrets",
  },
)

// Define the DarknessRatings entity
export const DarknessRatings = new Entity(
  {
    model: {
      entity: "darkness_rating",
      version: "1",
      service: "dark-secrets",
    },
    attributes: {
      id: {
        type: "string",
        required: true,
        readOnly: true,
      },
      secretId: {
        type: "string",
        required: true,
      },
      ipHash: {
        type: "string",
        required: true,
      },
      rating: {
        type: "number",
        required: true,
      },
      createdAt: {
        type: "string",
        required: true,
        readOnly: true,
      },
    },
    indexes: {
      primary: {
        pk: {
          field: "pk",
          composite: ["id"],
        },
        sk: {
          field: "sk",
          composite: [],
        },
      },
      bySecretIdAndIpHash: {
        index: "gsi1",
        pk: {
          field: "gsi1pk",
          composite: ["secretId"],
        },
        sk: {
          field: "gsi1sk",
          composite: ["ipHash"],
        },
      },
    },
  },
  {
    client: docClient,
    table: "DarkSecrets",
  },
)

// Create a service that combines these entities
export const DarkSecretsService = {
  Secrets,
  Comments,
  DarknessRatings,
}

