"use client"

import { useState, useRef, useEffect } from "react"
import { useDispatch } from "react-redux"
import { useMutation } from "@tanstack/react-query"
import { Mic, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { addSecret } from "@/lib/redux/features/secrets/secretsSlice"
import { createSecret } from "@/lib/api/secrets"
import { generateUsername } from "@/lib/utils"
import { cn } from "@/lib/utils"

export function SecretInput() {
  const [secret, setSecret] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [darkness, setDarkness] = useState(50) // Default value, will be rated by users later
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const dispatch = useDispatch()
  const { toast } = useToast()

  // Get or generate username from localStorage
  const [username, setUsername] = useState<string>("")

  useEffect(() => {
    // Only access localStorage on the client
    const storedUsername = localStorage.getItem("username")
    if (storedUsername) {
      setUsername(storedUsername)
    } else {
      const newUsername = generateUsername()
      localStorage.setItem("username", newUsername)
      setUsername(newUsername)
    }
  }, [])

  const secretMutation = useMutation({
    mutationFn: createSecret,
    onSuccess: (data) => {
      dispatch(addSecret(data))
      setSecret("")
      setDarkness(50)
      toast({
        title: "Secret shared!",
        description: "Your secret has been shared anonymously.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to share your secret. Please try again.",
        variant: "destructive",
      })
    },
  })

  const startRecording = async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices) {
      toast({
        title: "Error",
        description: "Voice recording is not supported in your browser.",
        variant: "destructive",
      })
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const audioChunks: BlobPart[] = []

      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data)
      })

      mediaRecorder.addEventListener("stop", async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" })

        // Here we would use a speech-to-text service
        // For now, we'll simulate it with a timeout
        toast({
          title: "Processing audio...",
          description: "Converting your voice to text.",
        })

        setTimeout(() => {
          // Simulating speech-to-text result
          const currentText = secret.trim() ? secret + " " : ""
          setSecret(currentText + "This is what I said in the recording.")

          // Stop all tracks to release microphone
          stream.getTracks().forEach((track) => track.stop())
          setIsRecording(false)
        }, 1500)
      })

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to use voice recording.",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
    }
  }

  const handleSubmit = () => {
    // Validate secret length
    if (secret.length < 10) {
      toast({
        title: "Secret too short",
        description: "Your secret must be at least 10 characters long.",
        variant: "destructive",
      })
      return
    }

    // Check for URLs or potential phishing attempts
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g
    if (urlRegex.test(secret)) {
      toast({
        title: "URLs not allowed",
        description: "For security reasons, URLs are not allowed in secrets.",
        variant: "destructive",
      })
      return
    }

    // Submit the secret
    secretMutation.mutate({
      content: secret,
      darkness: darkness,
      username: username || "anonymous", // Provide a fallback
    })
  }

  return (
    <Card className="shadow-lg">
      <CardContent className="pt-6">
        <Textarea
          placeholder="Share your secret... (min 10 characters)"
          className="min-h-32 text-base resize-none"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            className={cn(isRecording && "bg-red-500 text-white hover:bg-red-600")}
          >
            {isRecording ? <X className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
        </div>
        <Button onClick={handleSubmit} disabled={secret.length < 10 || secretMutation.isPending}>
          {secretMutation.isPending ? "Sharing..." : "Share Secret"}
          <Send className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

