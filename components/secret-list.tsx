"use client"

import { useState } from "react"
import { SecretCard } from "@/components/secret-card"
import { SecretDetail } from "@/components/secret-detail"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import type { Secret } from "@/lib/types"

interface SecretListProps {
  secrets: Secret[]
}

export function SecretList({ secrets }: SecretListProps) {
  const [selectedSecret, setSelectedSecret] = useState<Secret | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const handleSecretClick = (secret: Secret) => {
    setSelectedSecret(secret)
    setIsDetailOpen(true)
  }

  if (secrets.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">No secrets found. Be the first to share!</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {secrets.map((secret) => (
          <SecretCard key={secret.id} secret={secret} onContentClick={() => handleSecretClick(secret)} />
        ))}
      </div>

      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="sm:max-w-md md:max-w-lg">
          <SheetHeader>
            <SheetTitle>Secret Details</SheetTitle>
            <SheetDescription>View and interact with this anonymous secret</SheetDescription>
          </SheetHeader>
          {selectedSecret && <SecretDetail secret={selectedSecret} />}
        </SheetContent>
      </Sheet>
    </>
  )
}

