import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import userSlice from './slices/userSlice'
import cartSlice from './slices/cartSlice'
import tenantSlice from './slices/tenantSlice'
import notificationSlice from './slices/notificationSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    cart: cartSlice,
    tenant: tenantSlice,
    notification: notificationSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
