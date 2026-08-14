import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import HomeProvider from '../features/services-marketplace/screens/HomeProvider';
import Notifications from '../features/notifications/components/Notifications';
import Chat from '../features/chat/screens/Chat';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const stackScreenOptions = {
  headerStyle: { backgroundColor: colors.surface },
  headerTintColor: colors.text,
  headerShadowVisible: false,
  headerTitleStyle: { fontWeight: '600' as const, fontSize: 17 },
};
function ProviderTabs() {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 8);
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.accent, tabBarInactiveTintColor: colors.textMuted, tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, borderTopWidth: 1, elevation: 0, height: 52 + bottomPad, paddingBottom: bottomPad, paddingTop: 4 }, tabBarLabelStyle: { fontSize: 11, fontWeight: '600' as const } }}>
      <Tab.Screen name="HomeProvider" component={HomeProvider} options={{ tabBarLabel: 'Servicos', tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="wrench-outline" size={size} color={color} /> }} />
      <Tab.Screen name="NotificationsProvider" component={Notifications} options={{ tabBarLabel: 'Alertas', tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="bell-outline" size={size} color={color} /> }} />
    </Tab.Navigator>
  );
}
export default function ProviderStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="ProviderTabs" component={ProviderTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Chat" component={Chat} options={({ route }: any) => ({ title: route.params?.otherUserName ?? 'Chat' })} />
    </Stack.Navigator>
  );
}
