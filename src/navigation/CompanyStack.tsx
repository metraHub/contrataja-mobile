import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import HomeCompany from '../features/jobs/screens/HomeCompany';
import FindTalent from '../features/profile/screens/FindTalent';
import CreateJobCall from '../features/jobs/screens/CreateJobCall';
import TalentProfile from '../features/profile/screens/TalentProfile';
import JobCallDetail from '../features/jobs/screens/JobCallDetail';
import Notifications from '../features/notifications/components/Notifications';
import PerfilCompany from '../features/profile/screens/PerfilCompany';
import Chat from '../features/chat/screens/Chat';
import JobCandidatesScreen from '../features/jobs/screens/JobCandidates';
import InterviewSessionScreen from '../features/interview-session/screens/InterviewSessionScreen';
import TermosUsoScreen from '../features/legal/screens/TermosUsoScreen';
import PrivacidadeScreen from '../features/legal/screens/PrivacidadeScreen';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const stackScreenOptions = {
  headerStyle: { backgroundColor: colors.surface },
  headerTintColor: colors.text,
  headerShadowVisible: false,
  headerTitleStyle: { fontWeight: '600' as const, fontSize: 17 },
};
function CompanyTabs() {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 8);
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.accent, tabBarInactiveTintColor: colors.textMuted, tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, borderTopWidth: 1, elevation: 0, height: 52 + bottomPad, paddingBottom: bottomPad, paddingTop: 4 }, tabBarLabelStyle: { fontSize: 11, fontWeight: '600' as const } }}>
      <Tab.Screen name="FindTalent" component={FindTalent} options={{ tabBarLabel: 'Encontrar Talento', tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account-search-outline" size={size} color={color} /> }} />
      <Tab.Screen name="HomeCompany" component={HomeCompany} options={{ tabBarLabel: 'Publicar Vaga', tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="briefcase-plus-outline" size={size} color={color} /> }} />
      <Tab.Screen name="NotificationsCompany" component={Notifications} options={{ tabBarLabel: 'Notificacoes', tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="bell-outline" size={size} color={color} /> }} />
      <Tab.Screen name="ProfileCompany" component={PerfilCompany} options={{ tabBarLabel: 'Perfil', tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="domain" size={size} color={color} /> }} />
    </Tab.Navigator>
  );
}
export default function CompanyStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="CompanyTabs" component={CompanyTabs} options={{ headerShown: false }} />
      <Stack.Screen name="CreateJobCall" component={CreateJobCall} options={{ title: 'Publicar nova vaga' }} />
      <Stack.Screen name="TalentProfile" component={TalentProfile} options={{ title: 'Perfil do profissional' }} />
      <Stack.Screen name="JobCallStatus" component={JobCallDetail} options={{ title: 'Status da vaga' }} />
      <Stack.Screen name="JobCandidates" component={JobCandidatesScreen} options={{ title: 'Candidatos' }} />
      <Stack.Screen name="InterviewSession" component={InterviewSessionScreen} options={{ title: 'Entrevista', headerShown: false }} />
      <Stack.Screen name="Chat" component={Chat} options={({ route }: any) => ({ title: route.params?.otherUserName ?? 'Chat' })} />
      <Stack.Screen name="TermosUso" component={TermosUsoScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Privacidade" component={PrivacidadeScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
