import React, { useRef, useEffect, useCallback } from 'react';
import { Modal, View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { IncomingInterviewCall } from '../hooks/useInterviewSessionCall';
import { colors, radius, spacing } from '../../../theme/colors';
import { navigationRef } from '../../../navigation/navigationRef';

interface Props {
  call: IncomingInterviewCall;
  onDismiss: () => void;
}

// Mesmo padrão visual do DispatchModal (chamada de vaga) — ver ADR-0006 no
// backend: o "toque" aqui é só esse prompt em primeiro plano, sem
// CallKit/ConnectionService nativo nesta rodada.
export default function IncomingInterviewCallModal({ call, onDismiss }: Props) {
  const slideAnim = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 80,
      friction: 12,
    }).start();
  }, []);

  const handleJoin = useCallback(() => {
    onDismiss();
    if (navigationRef.isReady()) {
      navigationRef.navigate('InterviewSession', {
        jobCallId: call.jobCallId,
        candidateId: call.candidateId,
        mode: 'join',
      });
    }
  }, [call.jobCallId, call.candidateId]);

  return (
    <Modal transparent animationType="fade" visible statusBarTranslucent>
      <View style={styles.overlay}>
        <Animated.View style={[styles.card, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.header}>
            <MaterialCommunityIcons name="phone-in-talk" size={22} color={colors.accent} />
            <Text style={styles.headerTitle}>Sua tele-entrevista está começando</Text>
          </View>

          <View style={styles.body}>
            {call.jobTitle ? (
              <Text style={styles.jobTitle} numberOfLines={2}>
                {call.jobTitle}
              </Text>
            ) : null}
            {call.companyName ? (
              <Text style={styles.companyName} numberOfLines={1}>
                {call.companyName}
              </Text>
            ) : null}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.btn, styles.btnDismiss]} onPress={onDismiss} activeOpacity={0.8}>
              <Text style={[styles.btnText, { color: colors.textSecondary }]}>Agora não</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.btn, styles.btnJoin]} onPress={handleJoin} activeOpacity={0.8}>
              <MaterialCommunityIcons name="video" size={18} color="#fff" />
              <Text style={[styles.btnText, { color: '#fff' }]}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingBottom: 32,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: colors.text, flexShrink: 1 },
  body: { paddingHorizontal: spacing.xl, marginBottom: spacing.xl },
  jobTitle: { fontSize: 17, fontWeight: '700', color: colors.text, lineHeight: 22 },
  companyName: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginTop: 2 },
  actions: { flexDirection: 'row', paddingHorizontal: spacing.xl, gap: spacing.md },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: radius.lg,
    gap: 6,
  },
  btnDismiss: { borderWidth: 1.5, borderColor: colors.border },
  btnJoin: { backgroundColor: colors.accent },
  btnText: { fontSize: 15, fontWeight: '700' },
});
