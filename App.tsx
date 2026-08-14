import { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { registerGlobals } from '@livekit/react-native'
import RootNavigation from './src/navigation'
import { colors } from './src/theme/colors'
import { registerNotificationTapHandler } from './src/services/notifications/pushService'

registerGlobals()

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.accent,
    onPrimary: colors.textOnAccent,
    primaryContainer: colors.accentSoft,
    secondary: colors.primaryLight,
    background: colors.background,
    surface: colors.surface,
    surfaceVariant: colors.surfaceVariant,
    outline: colors.border,
    error: colors.error,
  },
  roundness: 10,
}

export default function App() {
  useEffect(() => {
    const subscription = registerNotificationTapHandler()
    return () => subscription.remove()
  }, [])

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <RootNavigation />
        <StatusBar style="dark" />
      </PaperProvider>
    </SafeAreaProvider>
  )
}
