import { Stack } from 'expo-router'
import { useEffect } from 'react'
import * as SplashScreen from 'expo-splash-screen'

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  useEffect(() => {
    // Simulate loading resources
    const loadResources = async () => {
      try {
        // Add any async initialization here
        // e.g., load fonts, check auth status, etc.
      } catch (error) {
        console.error('Failed to load resources:', error)
      } finally {
        await SplashScreen.hideAsync()
      }
    }

    loadResources()
  }, [])

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  )
}
