import { CloudWatchClient, PutMetricDataCommand } from "@aws-sdk/client-cloudwatch"
import { getAwsConfig } from "@/lib/aws-client"

const cloudWatchClient = new CloudWatchClient(getAwsConfig())

export async function logMetric(
  metricName: string,
  value = 1,
  unit = "Count",
  dimensions: { Name: string; Value: string }[] = [],
) {
  try {
    const command = new PutMetricDataCommand({
      Namespace: "DarkSecrets",
      MetricData: [
        {
          MetricName: metricName,
          Value: value,
          Unit: unit,
          Dimensions: dimensions,
          Timestamp: new Date(),
        },
      ],
    })

    await cloudWatchClient.send(command)
  } catch (error) {
    console.error("Error logging metric to CloudWatch:", error)
  }
}

export async function logSecretCreated() {
  await logMetric("SecretCreated")
}

export async function logCommentAdded() {
  await logMetric("CommentAdded")
}

export async function logRatingSubmitted() {
  await logMetric("RatingSubmitted")
}

export async function logApiError(endpoint: string, errorMessage: string) {
  await logMetric("ApiError", 1, "Count", [
    { Name: "Endpoint", Value: endpoint },
    { Name: "ErrorMessage", Value: errorMessage.substring(0, 255) },
  ])
}

