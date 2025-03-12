import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UserState {
  username: string | null
  theme: "dark" | "light" | "system"
}

const initialState: UserState = {
  username: null,
  theme: "dark",
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload
    },
    setTheme: (state, action: PayloadAction<"dark" | "light" | "system">) => {
      state.theme = action.payload
    },
  },
})

export const { setUsername, setTheme } = userSlice.actions

export default userSlice.reducer

