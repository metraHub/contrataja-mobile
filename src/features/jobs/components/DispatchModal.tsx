import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useJobCallsStore } from '../store/jobCallsStore';
import { useAuthStore } from '../../auth/store/authStore';
import { DispatchData } from '../hooks/useDispatchNotification';
import { colors, radius, spacing } from '../../../theme/colors';
import { formatSalary, formatWorkLocation, buildRoomId } from '../../../shared';
import { navigationRef } from '../../../navigation/navigationRef';

const { width } = Dimensions.get('window');

interface Props {
  dispatch: DispatchData;
  onDismiss: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function DispatchModal({ dispatch, onDismiss }: Props) {
  const { acceptJobCall, rejectJobCall } = useJobCallsStore();
  const authUser = useAuthStore((s) => s.user);
  // Lazy-inicializado a partir do expiresAt real, não 0 — o efeito de
  // countdown roda no mesmo commit inicial que este, usando o timeLeft do
  // MESMO render (0, se inicializado ali em cima), então "timeLeft <= 0"
  // disparava onDismiss() imediatamente em todo mount, antes do primeiro
  // setTimeLeft(totalSeconds) sequer ter efeito.
  const [timeLeft, setTimeLeft] = useState(() =>
    Math.max(0, Math.floor((new Date(dispatch.expiresAt).getTime() - Date.now()) / 1000)),
  );
  const [responding, setResponding] = useState(false);
  const timerProgress = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(400)).current;

  // Calcular tempo restante a partir do expiresAt
  useEffect(() => {
    const totalSeconds = Math.max(
      0,
      Math.floor((new Date(dispatch.expiresAt).getTime() - Date.now()) / 1000),
    );
    setTimeLeft(totalSeconds);

    // Animação da barra de progresso
    Animated.timing(timerProgress, {
      toValue: 0,
      duration: totalSeconds * 1000,
      useNativeDriver: false,
    }).start();

    // Slide up ao abrir
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 80,
      friction: 12,
    }).start();
  }, [dispatch.expiresAt]);

  // Countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      onDismiss();
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  const handleAccept = useCallback(async () => {
    setResponding(true);
    try {
      const result = await acceptJobCall(dispatch.jobCallId);
      onDismiss();

      // Direciona pro chat com a empresa assim que a chamada é aceita —
      // o candidato não precisa ir caçar a conversa depois.
      const companyUserId = result?.jobCall?.company?.userId;
      const companyName = result?.jobCall?.company?.companyName;
      if (authUser?.id && companyUserId && navigationRef.isReady()) {
        const roomId = buildRoomId(authUser.id, companyUserId);
        navigationRef.navigate('Chat', {
          roomId,
          otherUserId: companyUserId,
          otherUserName: companyName ?? 'Empresa',
          jobCallId: dispatch.jobCallId,
        });
      }
    } finally {
      setResponding(false);
    }
  }, [dispatch.jobCallId, authUser?.id]);

  const handleReject = useCallback(async () => {
    setResponding(true);
    try {
      await rejectJobCall(dispatch.jobCallId);
    } finally {
      setResponding(false);
      onDismiss();
    }
  }, [dispatch.jobCallId]);

  const scoreColor =
    dispatch.score >= 80 ? colors.success : dispatch.score >= 60 ? colors.warning : colors.accent;

  const timerColor = timeLeft > 300 ? colors.success : timeLeft > 60 ? colors.warning : colors.error;

  const salaryText = formatSalary(dispatch.salary, dispatch.salaryMax);
  const locationText = formatWorkLocation(dispatch.location, dispatch.jobWorkMode);

  return (
    <Modal transparent animationType="fade" visible statusBarTranslucent>
      <View style={styles.overlay}>
        <Animated.View style={[styles.card, { transform: [{ translateY: slideAnim }] }]}>

          {/* Barra de tempo (depleta da esquerda para direita) */}
          <View style={styles.timerBarBg}>
            <Animated.View
              style={[
                styles.timerBarFill,
                {
                  width: timerProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                  backgroundColor: timerColor,
                },
              ]}
            />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <MaterialCommunityIcons name="lightning-bolt" size={20} color={colors.accent} />
              <Text style={styles.headerTitle}>Nova Oportunidade!</Text>
            </View>
            <Text style={[styles.countdown, { color: timerColor }]}>
              {formatTime(timeLeft)}
            </Text>
          </View>

          {/* Score + Vaga */}
          <View style={styles.jobRow}>
            <View style={[styles.scoreBadge, { borderColor: scoreColor }]}>
              <Text style={[styles.scoreValue, { color: scoreColor }]}>
                {Math.round(dispatch.score)}
              </Text>
              <Text style={[styles.scorePercent, { color: scoreColor }]}>%</Text>
            </View>
            <View style={styles.jobInfo}>
              <Text style={styles.jobTitle} numberOfLines={2}>
                {dispatch.title}
              </Text>
              {dispatch.companyName ? (
                <Text style={styles.companyName} numberOfLines={1}>
                  {dispatch.companyName}
                </Text>
              ) : null}
              <Text style={styles.matchLabel}>Compatibilidade com seu perfil</Text>
            </View>
          </View>

          {/* Salário e localização */}
          <View style={styles.offerDetails}>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="cash-multiple" size={14} color={colors.textMuted} />
              <Text style={styles.detailText}>{salaryText}</Text>
            </View>
            {locationText ? (
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="map-marker-outline" size={14} color={colors.textMuted} />
                <Text style={styles.detailText}>{locationText}</Text>
              </View>
            ) : null}
          </View>

          {/* Motivo da IA */}
          {dispatch.aiReason ? (
            <View style={styles.reasonBox}>
              <MaterialCommunityIcons name="robot-outline" size={14} color={colors.textMuted} />
              <Text style={styles.reasonText}>{dispatch.aiReason}</Text>
            </View>
          ) : null}

          {/* Aviso de expiração */}
          <Text style={styles.expireHint}>
            Esta oportunidade expira em {formatTime(timeLeft)} — responda rápido!
          </Text>

          {/* Botões */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, styles.btnReject]}
              onPress={handleReject}
              disabled={responding}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="close" size={18} color={colors.error} />
              <Text style={[styles.btnText, { color: colors.error }]}>Recusar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.btnAccept]}
              onPress={handleAccept}
              disabled={responding}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="check" size={18} color="#fff" />
              <Text style={[styles.btnText, { color: '#fff' }]}>
                {responding ? 'Aguarde...' : 'Aceitar vaga'}
              </Text>
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
  timerBarBg: {
    height: 4,
    backgroundColor: colors.border,
    width: '100%',
  },
  timerBarFill: {
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  countdown: {
    fontSize: 18,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  jobRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  scoreBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexShrink: 0,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: '900',
  },
  scorePercent: {
    fontSize: 12,
    fontWeight: '700',
    alignSelf: 'flex-end',
    marginBottom: 4,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 22,
  },
  matchLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 3,
  },
  companyName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 2,
  },
  offerDetails: {
    paddingHorizontal: spacing.xl,
    gap: 6,
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  reasonBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.md,
    backgroundColor: colors.surfaceVariant,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  reasonText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  expireHint: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: radius.lg,
    gap: 6,
  },
  btnReject: {
    borderWidth: 1.5,
    borderColor: colors.error,
    backgroundColor: colors.errorSoft,
  },
  btnAccept: {
    backgroundColor: colors.success,
  },
  btnText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
