import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import apiClient from '../api/apiClient';
import { navigationRef } from '../../navigation/navigationRef';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerPushToken(): Promise<void> {
  if (!Device.isDevice) {
    console.log('[Push] Emulador detectado, pulando registro de push token');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('[Push] Permissão de notificação negada');
    return;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#6C63FF',
    });
  }

  try {
    const tokenData = await Notifications.getDevicePushTokenAsync();
    const fcmToken = tokenData.data as string;
    const res = await apiClient.patch('/users/me/fcm-token', { fcmToken });
    console.log('[Push] Token FCM registrado');
  } catch (err: any) {
    console.error('[Push] Falha ao registrar token FCM:', err.response?.status, err.response?.data ?? err.message);
  }
}

// Trata o toque numa notificação push quando o app não estava em primeiro
// plano (o prompt em tempo real do socket só existe com o app aberto — ver
// ADR-0006 no backend). Só INTERVIEW_SESSION_STARTED navega hoje; outros
// tipos seguem sem ação especial até precisarem de uma.
export function registerNotificationTapHandler() {
  return Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data as Record<string, string> | undefined;
    if (!data) return;

    if (data.type === 'INTERVIEW_SESSION_STARTED' && data.jobCallId && data.candidateId) {
      if (navigationRef.isReady()) {
        navigationRef.navigate('InterviewSession', {
          jobCallId: data.jobCallId,
          candidateId: data.candidateId,
          mode: 'join',
        });
      }
    }
  });
}
