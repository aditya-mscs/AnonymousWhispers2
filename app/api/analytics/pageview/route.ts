import { type NextRequest, NextResponse } from "next/server"
import { logMetric } from "@/lib/monitoring/cloudwatch"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const path = body.path || "unknown"

    // Log to CloudWatch
    await logMetric("PageView", 1, "Count", [{ Name: "Path", Value: path }])

    return NextResponse.json({ success: true })
  } catch (error) {
    // Don't return an error - analytics should never break the app
    console.error("Error logging page view:", error)
    return NextResponse.json({ success: false })
  }
}

