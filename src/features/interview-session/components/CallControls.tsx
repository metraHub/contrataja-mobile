import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../../../theme/colors';

interface Props {
  isMicrophoneEnabled: boolean;
  isCameraEnabled: boolean;
  onToggleMicrophone: () => void;
  onToggleCamera: () => void;
  onHangup: () => void;
}

export default function CallControls({
  isMicrophoneEnabled,
  isCameraEnabled,
  onToggleMicrophone,
  onToggleCamera,
  onHangup,
}: Props) {
  return (
    <View style={s.row}>
      <TouchableOpacity
        style={[s.btn, !isMicrophoneEnabled && s.btnOff]}
        onPress={onToggleMicrophone}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons
          name={isMicrophoneEnabled ? 'microphone' : 'microphone-off'}
          size={22}
          color="#fff"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[s.btn, s.btnHangup]}
        onPress={onHangup}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="phone-hangup" size={26} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[s.btn, !isCameraEnabled && s.btnOff]}
        onPress={onToggleCamera}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name={isCameraEnabled ? 'video' : 'video-off'} size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xl,
    paddingVertical: spacing.lg,
  },
  btn: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnOff: {
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  btnHangup: {
    width: 60,
    height: 60,
    borderRadius: radius.full,
    backgroundColor: colors.error,
  },
});
