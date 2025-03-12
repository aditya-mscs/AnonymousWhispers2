export interface Secret {
  id: string
  content: string
  darkness: number
  username: string
  darknessRatings: number[] // Array of user ratings
  averageDarkness: number // Average darkness rating
  createdAt: Date
  comments: Comment[]
}

export interface Comment {
  id: string
  content: string
  username: string
  createdAt: Date
}

export interface SecretInput {
  content: string
  darkness: number
  username: string
}

