"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Secret } from "@/lib/types"
import { cn } from "@/lib/utils"

interface SecretCardProps {
  secret: Secret
  onClick?: () => void
}

export function SecretCard({ secret, onClick }: SecretCardProps) {
  const [formattedDate, setFormattedDate] = useState<string>("")

  // Handle date formatting on the client side only
  useEffect(() => {
    setFormattedDate(formatDistanceToNow(new Date(secret.createdAt), { addSuffix: true }))
  }, [secret.createdAt])

  const getDarknessColor = (darkness: number) => {
    if (darkness < 30) return "bg-green-500/10 text-green-500"
    if (darkness < 70) return "bg-yellow-500/10 text-yellow-500"
    return "bg-red-500/10 text-red-500"
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer w-full" onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="font-medium text-sm text-muted-foreground">@{secret.username}</div>
          <Badge variant="outline" className={cn("ml-2", getDarknessColor(secret.darkness))}>
            {secret.darkness}% Dark
          </Badge>
        </div>
        <p className="text-lg">{secret.content}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex justify-between text-sm text-muted-foreground">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="text-xs text-muted-foreground mr-2">Darkness:</span>
            <Badge variant="outline" className={cn(getDarknessColor(secret.darkness))}>
              {secret.darkness}%
            </Badge>
          </div>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>{secret.comments.length}</span>
          </Button>
        </div>
        <div className="flex items-center">
          <time dateTime={new Date(secret.createdAt).toISOString()}>{formattedDate}</time>
        </div>
      </CardFooter>
    </Card>
  )
}

