"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Track page views
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")

    // Send to your analytics service
    // This is where you would integrate with services like Google Analytics,
    // Plausible, Fathom, etc.

    // For now, we'll just log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log(`Page view: ${url}`)
    }

    // You could also send to your own API endpoint
    fetch("/api/analytics/pageview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path: url }),
      // Don't wait for the response
      keepalive: true,
    }).catch(() => {
      // Ignore errors - analytics should never break the app
    })
  }, [pathname, searchParams])

  return null
}

