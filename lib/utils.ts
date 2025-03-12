import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate a random funny username
export function generateUsername(): string {
  const adjectives = [
    "Mysterious",
    "Sneaky",
    "Silent",
    "Shadowy",
    "Cryptic",
    "Hidden",
    "Secret",
    "Anonymous",
    "Masked",
    "Veiled",
    "Covert",
    "Stealthy",
    "Unseen",
    "Invisible",
    "Phantom",
    "Ghostly",
    "Enigmatic",
    "Puzzling",
    "Curious",
    "Bizarre",
  ]

  const nouns = [
    "Whisper",
    "Shadow",
    "Ghost",
    "Phantom",
    "Specter",
    "Ninja",
    "Agent",
    "Spy",
    "Raven",
    "Wolf",
    "Fox",
    "Owl",
    "Panther",
    "Tiger",
    "Eagle",
    "Hawk",
    "Falcon",
    "Dragon",
    "Phoenix",
    "Griffin",
  ]

  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)]
  const randomNumber = Math.floor(Math.random() * 1000)

  return `${randomAdjective}${randomNoun}${randomNumber}`
}

// Check if a string contains URLs or potential phishing attempts
export function containsUnsafeContent(text: string): boolean {
  // Check for URLs
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g
  if (urlRegex.test(text)) return true

  // Check for email addresses
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  if (emailRegex.test(text)) return true

  // Check for phone numbers
  const phoneRegex = /(\+\d{1,3}[\s-])?($$\d{3}$$|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}/g
  if (phoneRegex.test(text)) return true

  return false
}

