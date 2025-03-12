export function getAwsConfig() {
  if (process.env.NODE_ENV === "development") {
    console.log("Using local DynamoDB configuration")
    return {
      region: "local",
      endpoint: "http://localhost:8000",
      credentials: {
        accessKeyId: "local",
        secretAccessKey: "local",
      },
    }
  }

  // Production configuration
  return {
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  }
}

