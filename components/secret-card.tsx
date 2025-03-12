"use client"

import { useState, useEffect, useCallback } from "react"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import type { Secret } from "@/lib/types"
import { cn } from "@/lib/utils"

interface SecretCardProps {
  secret: Secret
  onContentClick?: () => void
}

export function SecretCard({ secret, onContentClick }: SecretCardProps) {
  const [formattedDate, setFormattedDate] = useState<string>("")
  const [userRating, setUserRating] = useState(5)
  const { toast } = useToast()

  // Handle date formatting on the client side only
  useEffect(() => {
    setFormattedDate(formatDistanceToNow(new Date(secret.createdAt), { addSuffix: true }))
  }, [secret.createdAt])

  const getDarknessColor = (darkness: number) => {
    if (darkness < 30) return "bg-green-500/10 text-green-500"
    if (darkness < 70) return "bg-yellow-500/10 text-yellow-500"
    return "bg-red-500/10 text-red-500"
  }

  const handleRateDarkness = useCallback(() => {
    // In a real app, this would call an API to update the rating
    toast({
      title: "Rating submitted",
      description: `You rated this secret ${userRating}/10 on darkness`,
    })
  }, [userRating, toast])

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="font-medium text-base">@{secret.username}</div>
          <Badge variant="outline" className={cn("ml-2", getDarknessColor(secret.darkness))}>
            {secret.darkness}% Dark
          </Badge>
        </div>
        <div className="cursor-pointer" onClick={onContentClick}>
          <p className="text-lg mb-4">{secret.content}</p>
        </div>

        <div className="space-y-2 mt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs">Rate Darkness</span>
            <span className="text-xs font-medium">{userRating}/10</span>
          </div>
          <Slider
            min={1}
            max={10}
            step={1}
            value={[userRating]}
            onValueChange={(value) => setUserRating(value[0])}
            onValueCommit={handleRateDarkness}
          />
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex justify-between text-sm text-muted-foreground">
        <Button variant="ghost" size="sm" className="h-8 px-2 cursor-pointer" onClick={onContentClick}>
          <MessageSquare className="h-4 w-4 mr-1" />
          <span>{secret.comments.length} Comments</span>
        </Button>
        <div className="flex items-center">
          <time dateTime={new Date(secret.createdAt).toISOString()}>{formattedDate}</time>
        </div>
      </CardFooter>
    </Card>
  )
}

