import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import Notifications from '../features/notifications/components/Notifications';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const stackScreenOptions = {
  headerStyle: { backgroundColor: colors.surface },
  headerTintColor: colors.text,
  headerShadowVisible: false,
  headerTitleStyle: { fontWeight: '600' as const, fontSize: 17 },
};
function InstitutionTabs() {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 8);
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.accent, tabBarInactiveTintColor: colors.textMuted, tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, borderTopWidth: 1, elevation: 0, height: 52 + bottomPad, paddingBottom: bottomPad, paddingTop: 4 }, tabBarLabelStyle: { fontSize: 11, fontWeight: '600' as const } }}>
      <Tab.Screen name="HomeInstitution" component={Notifications} options={{ tabBarLabel: 'Cursos', tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="school-outline" size={size} color={color} /> }} />
      <Tab.Screen name="NotificationsInstitution" component={Notifications} options={{ tabBarLabel: 'Alertas', tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="bell-outline" size={size} color={color} /> }} />
    </Tab.Navigator>
  );
}
export default function InstitutionStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="InstitutionTabs" component={InstitutionTabs} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
