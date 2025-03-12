"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchSecretById } from "@/lib/api/secrets"
import { SecretDetail } from "@/components/secret-detail"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface SecretDetailPageProps {
  id: string
}

export function SecretDetailPage({ id }: SecretDetailPageProps) {
  const {
    data: secret,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["secret", id],
    queryFn: () => fetchSecretById(id),
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-pulse">Loading secret...</div>
      </div>
    )
  }

  if (error || !secret) {
    return notFound()
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>

      <Card className="w-full">
        <CardContent className="p-6">
          <SecretDetail secret={secret} />
        </CardContent>
      </Card>
    </div>
  )
}

