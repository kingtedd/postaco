import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
}

interface NotificationState {
  notifications: Notification[]
}

const initialState: NotificationState = {
  notifications: [],
}

let notificationId = 0

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<Omit<Notification, 'id'>>
    ) => {
      const id = `${notificationId++}`
      state.notifications.push({ ...action.payload, id })
      setTimeout(() => {
        notificationSlice.caseReducers.removeNotification(state, { payload: id, type: 'notification/removeNotification', meta: undefined, error: null })
      }, 3000)
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notif => notif.id !== action.payload
      )
    },
  },
})

export const { addNotification, removeNotification } = notificationSlice.actions
export default notificationSlice.reducer
