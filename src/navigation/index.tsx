import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { ActivityIndicator, View } from 'react-native'
import { useAuthStore } from '../features/auth/store/authStore'
import { colors } from '../theme/colors'
import AuthStack from './AuthStack'
import PFStack from './PFStack'
import CompanyStack from './CompanyStack'
import ProviderStack from './ProviderStack'
import InstitutionStack from './InstitutionStack'
import { navigationRef } from './navigationRef'

export default function RootNavigation() {
  const { user, isAuthenticated, isLoading, loadStoredAuth } = useAuthStore()

  React.useEffect(() => {
    loadStoredAuth()
  }, [])

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    )
  }

  return (
    <NavigationContainer ref={navigationRef}>
      {!isAuthenticated ? (
        <AuthStack />
      ) : user?.type === 'PF' ? (
        <PFStack />
      ) : user?.type === 'PJ_CONTRATANTE' ? (
        <CompanyStack />
      ) : user?.type === 'PJ_PRESTADOR' ? (
        <ProviderStack />
      ) : (
        <InstitutionStack />
      )}
    </NavigationContainer>
  )
}
