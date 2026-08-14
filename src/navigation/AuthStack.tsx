import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../features/auth/screens/LoginScreen';
import RegisterScreen from '../features/auth/screens/RegisterScreen';
import UserTypeScreen from '../features/auth/screens/UserTypeScreen';
import VerifySMSScreen from '../features/auth/screens/VerifySMSScreen';
import TermosUsoScreen from '../features/legal/screens/TermosUsoScreen';
import PrivacidadeScreen from '../features/legal/screens/PrivacidadeScreen';
import EsqueceuSenhaScreen from '../features/auth/screens/EsqueceuSenhaScreen';
import RedefinirSenhaScreen from '../features/auth/screens/RedefinirSenhaScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserType" component={UserTypeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="VerifySMS" component={VerifySMSScreen} />
      <Stack.Screen name="EsqueceuSenha" component={EsqueceuSenhaScreen} />
      <Stack.Screen name="RedefinirSenha" component={RedefinirSenhaScreen} />
      <Stack.Screen name="TermosUso" component={TermosUsoScreen} />
      <Stack.Screen name="Privacidade" component={PrivacidadeScreen} />
    </Stack.Navigator>
  );
}
