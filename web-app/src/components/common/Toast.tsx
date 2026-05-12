import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { removeNotification } from '@redux/slices/notificationSlice'

const Toast = () => {
  const dispatch = useAppDispatch()
  const notifications = useAppSelector((state) => state.notification.notifications)

  useEffect(() => {
    if (notifications.length === 0) return
    const latest = notifications[notifications.length - 1]
    const timer = setTimeout(() => {
      dispatch(removeNotification(latest.id))
    }, 4000)
    return () => clearTimeout(timer)
  }, [notifications, dispatch])

  if (notifications.length === 0) return null

  const typeStyles: Record<string, string> = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-600 text-white',
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-72 max-w-sm text-sm ${typeStyles[n.type] || typeStyles.info}`}
        >
          <span className="flex-1">{n.message}</span>
          <button
            onClick={() => dispatch(removeNotification(n.id))}
            className="text-white opacity-75 hover:opacity-100"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}

export default Toast
