import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb";
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

// Load environment variables from .env.local file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, '../.env.local');

if (fs.existsSync(envPath)) {
  console.log(`Loading environment variables from ${envPath}`);
  dotenv.config({ path: envPath });
} else {
  console.log('No .env.local file found, using environment variables');
  dotenv.config();
}

// Log AWS configuration (without secrets)
console.log(`Using AWS Region: ${process.env.AWS_REGION || 'not set'}`);
console.log(`AWS_ACCESS_KEY_ID: ${process.env.AWS_ACCESS_KEY_ID ? 'is set' : 'not set'}`);
console.log(`AWS_SECRET_ACCESS_KEY: ${process.env.AWS_SECRET_ACCESS_KEY ? 'is set' : 'not set'}`);

// AWS config
function getAwsConfig() {
  return {
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  };
}

// Initialize the DynamoDB client
const client = new DynamoDBClient(getAwsConfig());

async function createTable() {
  try {
    console.log("Creating DynamoDB table...");
    
    const command = new CreateTableCommand({
      TableName: "DarkSecrets",
      AttributeDefinitions: [
        { AttributeName: "pk", AttributeType: "S" },
        { AttributeName: "sk", AttributeType: "S" },
        { AttributeName: "gsi1pk", AttributeType: "S" },
        { AttributeName: "gsi1sk", AttributeType: "S" },
        { AttributeName: "gsi2pk", AttributeType: "S" },
        { AttributeName: "gsi2sk", AttributeType: "S" },
        { AttributeName: "gsi3pk", AttributeType: "S" },
        { AttributeName: "gsi3sk", AttributeType: "S" },
      ],
      KeySchema: [
        { AttributeName: "pk", KeyType: "HASH" },
        { AttributeName: "sk", KeyType: "RANGE" },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: "gsi1",
          KeySchema: [
            { AttributeName: "gsi1pk", KeyType: "HASH" },
            { AttributeName: "gsi1sk", KeyType: "RANGE" },
          ],
          Projection: { ProjectionType: "ALL" },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
        {
          IndexName: "gsi2",
          KeySchema: [
            { AttributeName: "gsi2pk", KeyType: "HASH" },
            { AttributeName: "gsi2sk", KeyType: "RANGE" },
          ],
          Projection: { ProjectionType: "ALL" },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
        {
          IndexName: "gsi3",
          KeySchema: [
            { AttributeName: "gsi3pk", KeyType: "HASH" },
            { AttributeName: "gsi3sk", KeyType: "RANGE" },
          ],
          Projection: { ProjectionType: "ALL" },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    });
    
    const response = await client.send(command);
    console.log("Table created successfully:", response);
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log("Table already exists, skipping creation.");
    } else {
      console.error("Error creating table:", error);
    }
  }
}

// Run the function
createTable();

