import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { LiveKitRoom, VideoTrack } from '@livekit/react-native';
import { useTracks, useLocalParticipant, useConnectionState, useRoomContext } from '@livekit/components-react';
import { Track, ConnectionState } from 'livekit-client';
import { interviewSessionApi } from '../services/interviewSessionApi';
import { useAuthStore } from '../../auth/store/authStore';
import { UserType } from '../../../types';
import ResumePane from '../components/ResumePane';
import CallControls from '../components/CallControls';
import { colors } from '../../../theme/colors';

const LIVEKIT_URL = process.env.EXPO_PUBLIC_LIVEKIT_URL;

export default function InterviewSessionScreen({ route, navigation }: any) {
  const { jobCallId, candidateId, mode } = route.params;
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const action = mode === 'start' ? interviewSessionApi.start : interviewSessionApi.join;
    action(jobCallId, candidateId)
      .then((res) => setToken(res.token))
      .catch((err: any) => setError(err?.response?.data?.message || 'Não foi possível entrar na sessão de entrevista.'));
  }, [jobCallId, candidateId, mode]);

  if (error) {
    return (
      <View style={s.center}>
        <Text style={s.errorText}>{error}</Text>
      </View>
    );
  }

  if (!token) {
    return (
      <View style={s.center}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <LiveKitRoom
      serverUrl={LIVEKIT_URL}
      token={token}
      connect
      audio
      video
      onDisconnected={() => navigation.goBack()}
    >
      <CallRoom candidateId={candidateId} navigation={navigation} />
    </LiveKitRoom>
  );
}

function CallRoom({ candidateId, navigation }: { candidateId: string; navigation: any }) {
  const authUser = useAuthStore((st) => st.user);
  const isCompany = authUser?.type === UserType.PJ_CONTRATANTE;

  const video = <VideoArea candidateId={candidateId} navigation={navigation} />;

  if (!isCompany) {
    return video;
  }

  // Split em coluna (currículo em cima, vídeo embaixo) em vez de lado a
  // lado — num celular em retrato, dividir a largura deixaria o currículo
  // estreito demais pra ler.
  return (
    <View style={s.splitContainer}>
      <View style={s.resumeHalf}>
        <ResumePane candidateId={candidateId} />
      </View>
      <View style={s.videoHalf}>{video}</View>
    </View>
  );
}

function VideoArea({ candidateId, navigation }: { candidateId: string; navigation: any }) {
  const tracks = useTracks([Track.Source.Camera]);
  const { isMicrophoneEnabled, isCameraEnabled, localParticipant } = useLocalParticipant();
  const connectionState = useConnectionState();
  const room = useRoomContext();

  const localTrackRef = tracks.find((t) => t.participant.isLocal);
  const remoteTrackRef = tracks.find((t) => !t.participant.isLocal);

  const isReconnecting =
    connectionState === ConnectionState.Reconnecting || connectionState === ConnectionState.SignalReconnecting;

  const handleHangup = () => {
    room.disconnect();
    navigation.goBack();
  };

  return (
    <View style={s.videoArea}>
      {remoteTrackRef ? (
        <VideoTrack trackRef={remoteTrackRef} style={s.remoteVideo} />
      ) : (
        <View style={s.center}>
          <ActivityIndicator color="#FFF" />
          <Text style={s.waitingText}>Aguardando o outro lado entrar...</Text>
        </View>
      )}

      {localTrackRef && (
        <View style={s.pip}>
          <VideoTrack trackRef={localTrackRef} style={s.pipVideo} />
        </View>
      )}

      {isReconnecting && (
        <View style={s.reconnectingOverlay}>
          <ActivityIndicator color="#FFF" />
          <Text style={s.reconnectingText}>Reconectando...</Text>
        </View>
      )}

      <View style={s.controlsBar}>
        <CallControls
          isMicrophoneEnabled={isMicrophoneEnabled}
          isCameraEnabled={isCameraEnabled}
          onToggleMicrophone={() => void localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)}
          onToggleCamera={() => void localParticipant.setCameraEnabled(!isCameraEnabled)}
          onHangup={handleHangup}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  errorText: { color: '#FFF', padding: 24, textAlign: 'center' },
  waitingText: { color: '#FFF', marginTop: 12 },

  splitContainer: { flex: 1, backgroundColor: colors.background },
  resumeHalf: { flex: 1 },
  videoHalf: { flex: 1 },

  videoArea: { flex: 1, backgroundColor: '#000', position: 'relative' },
  remoteVideo: { flex: 1 },

  pip: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 96,
    height: 128,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  pipVideo: { flex: 1 },

  reconnectingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reconnectingText: { color: '#FFF', marginTop: 12, fontWeight: '600' },

  controlsBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
});
