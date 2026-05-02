import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  token: string | null
  refreshToken: string | null
  isLoggedIn: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  isLoggedIn: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    loginSuccess: (state, action: PayloadAction<{ token: string; refreshToken: string }>) => {
      state.token = action.payload.token
      state.refreshToken = action.payload.refreshToken
      state.isLoggedIn = true
      state.isLoading = false
      state.error = null
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('refreshToken', action.payload.refreshToken)
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.token = null
      state.refreshToken = null
      state.isLoggedIn = false
      state.isLoading = false
      state.error = action.payload
    },
    logout: (state) => {
      state.token = null
      state.refreshToken = null
      state.isLoggedIn = false
      state.error = null
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
    },
  },
})

export const { setLoading, loginSuccess, loginFailure, logout } = authSlice.actions
export default authSlice.reducer
