export function getAwsConfig() {
  // Check if we're using mock data
  if (process.env.USE_MOCK_DATA === "true") {
    console.log("Using mock AWS configuration")
    return {
      region: "local",
      endpoint: "http://localhost:8000",
      credentials: {
        accessKeyId: "local",
        secretAccessKey: "local",
      },
    }
  }

  return {
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  }
}

