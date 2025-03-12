import { configureStore } from "@reduxjs/toolkit"
import secretsReducer from "./features/secrets/secretsSlice"
import userReducer from "./features/user/userSlice"

export const store = configureStore({
  reducer: {
    secrets: secretsReducer,
    user: userReducer,
  },
  // Add middleware for development tools
  devTools: process.env.NODE_ENV !== "production",
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

