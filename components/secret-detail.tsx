"use client"

import { useState, useCallback } from "react"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare, Share2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import type { Secret } from "@/lib/types"
import { addComment } from "@/lib/api/secrets"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Slider } from "@/components/ui/slider"

interface SecretDetailProps {
  secret: Secret
}

export function SecretDetail({ secret }: SecretDetailProps) {
  const [comment, setComment] = useState("")
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [userRating, setUserRating] = useState(5)

  const getDarknessColor = (darkness: number) => {
    if (darkness < 30) return "bg-green-500/10 text-green-500"
    if (darkness < 70) return "bg-yellow-500/10 text-yellow-500"
    return "bg-red-500/10 text-red-500"
  }

  const commentMutation = useMutation({
    mutationFn: (newComment: string) => addComment(secret.id, newComment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["secrets"] })
      setComment("")
      toast({
        title: "Comment added",
        description: "Your comment has been added to the secret.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add your comment. Please try again.",
        variant: "destructive",
      })
    },
  })

  const handleAddComment = () => {
    if (comment.trim().length === 0) return
    commentMutation.mutate(comment)
  }

  const handleShare = async () => {
    const secretUrl = `${window.location.origin}/secret/${secret.id}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Anonymous Dark Secret",
          text: "Check out this anonymous secret",
          url: secretUrl,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(secretUrl)
      toast({
        title: "Link copied",
        description: "Secret link copied to clipboard",
      })
    }
  }

  const handleRateDarkness = useCallback(() => {
    // In a real app, this would call an API to update the rating
    toast({
      title: "Rating submitted",
      description: `You rated this secret ${userRating}/10 on darkness`,
    })
  }, [userRating, toast])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium">Secret from @{secret.username}</h3>
          <p className="text-sm text-muted-foreground">{formatDistanceToNow(secret.createdAt, { addSuffix: true })}</p>
        </div>
        <Badge variant="outline" className={cn(getDarknessColor(secret.darkness))}>
          {secret.darkness}% Dark
        </Badge>
      </div>

      <div className="py-4">
        <p className="whitespace-pre-line">{secret.content}</p>
      </div>

      <div className="flex justify-between">
        <div className="flex space-x-2">
          <div className="space-y-1 w-full max-w-[200px]">
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
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>{secret.comments.length}</span>
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-1" />
            <span>Share</span>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/secret/${secret.id}`}>
              <ExternalLink className="h-4 w-4 mr-1" />
              <span>View</span>
            </Link>
          </Button>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-4">
        <h4 className="font-medium">Comments</h4>

        <div className="space-y-4">
          {secret.comments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
          ) : (
            secret.comments.slice(0, 5).map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{comment.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <span className="font-medium text-sm">@{comment.username}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-2">
          <Textarea
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="resize-none"
          />
          <Button
            size="sm"
            onClick={handleAddComment}
            disabled={comment.trim().length === 0 || commentMutation.isPending}
          >
            {commentMutation.isPending ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </div>
    </div>
  )
}

