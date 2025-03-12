import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Secret, Comment } from "@/lib/types"

interface SecretsState {
  secrets: Secret[]
  userSecrets: string[] // IDs of secrets created by the user
  loading: boolean
  error: string | null
}

const initialState: SecretsState = {
  secrets: [],
  userSecrets: [],
  loading: false,
  error: null,
}

const secretsSlice = createSlice({
  name: "secrets",
  initialState,
  reducers: {
    setSecrets: (state, action: PayloadAction<Secret[]>) => {
      state.secrets = action.payload
      state.loading = false
      state.error = null
    },
    addSecret: (state, action: PayloadAction<Secret>) => {
      state.secrets.unshift(action.payload)
      state.userSecrets.push(action.payload.id)
    },
    addCommentToSecret: (state, action: PayloadAction<{ secretId: string; comment: Comment }>) => {
      const { secretId, comment } = action.payload
      const secret = state.secrets.find((s) => s.id === secretId)
      if (secret) {
        secret.comments.push(comment)
      }
    },
    likeSecret: (state, action: PayloadAction<string>) => {
      const secretId = action.payload
      const secret = state.secrets.find((s) => s.id === secretId)
      if (secret) {
        secret.likes += 1
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.loading = false
    },
  },
})

export const { setSecrets, addSecret, addCommentToSecret, likeSecret, setLoading, setError } = secretsSlice.actions

export default secretsSlice.reducer

