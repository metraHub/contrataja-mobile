import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import OTPInput from '../components/OTPInput';
import { authApi } from '../services/authApi';
import { firebaseAuth } from '../services/firebaseAuth';
import { colors, spacing, radius, typography } from '../../../theme/colors';

const RESEND_COOLDOWN = 60;

export default function VerifySMSScreen({ route, navigation }: any) {
  const { phone, formData } = route.params as {
    phone: string;
    userId: string;
    formData?: {
      email: string;
      password: string;
      type: string;
      fullName: string;
      gender: string;
      phone: string;
      birthDate?: string;
    };
  };
  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [timer, setTimer] = useState(RESEND_COOLDOWN);
  const [resending, setResending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Fade in animation for success modal
  useEffect(() => {
    if (showSuccess) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showSuccess]);

  const handleVerify = useCallback(async () => {
    if (code.length !== 6) return;
    setVerifying(true);
    try {
      await firebaseAuth.confirmCode(code);
      if (formData) {
        await authApi.registerWithSMS(formData);
      }
      setShowSuccess(true);
    } catch (error: any) {
      Alert.alert(
        'Código inválido',
        error?.message || 'O código informado não é válido. Tente novamente.',
      );
      setCode('');
    } finally {
      setVerifying(false);
    }
  }, [code, formData]);

  const handleGoToLogin = () => {
    setShowSuccess(false);
    navigation.reset({
      index: 0,
      routes: [
        { name: 'UserType' },
        { name: 'Login', params: { userType: 'PF' } },
      ],
    });
  };

  const handleResend = async () => {
    if (timer > 0 || resending) return;
    setResending(true);
    try {
      await firebaseAuth.sendVerificationCode(formData?.phone || '');
      setTimer(RESEND_COOLDOWN);
      Alert.alert('SMS reenviado', 'Um novo código foi enviado para seu celular.');
    } catch {
      Alert.alert('Erro', 'Não foi possível reenviar o SMS. Tente novamente.');
    } finally {
      setResending(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={s.content}>
        {/* Icon */}
        <View style={s.iconWrap}>
          <MaterialCommunityIcons name="message-text-lock-outline" size={56} color={colors.primary} />
        </View>

        {/* Title */}
        <Text style={s.title}>Verificar seu número</Text>
        <Text style={s.subtitle}>
          Enviamos um código de 6 dígitos para
        </Text>
        <Text style={s.phone}>{phone}</Text>

        {/* OTP Input */}
        <View style={s.otpSection}>
          <OTPInput value={code} onChange={setCode} length={6} />
        </View>

        {/* Resend */}
        <View style={s.resendSection}>
          <Text style={s.resendLabel}>Não recebeu o código?</Text>
          {timer > 0 ? (
            <Text style={s.timerText}>
              Reenviar em {formatTimer(timer)}
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend} disabled={resending}>
              <Text style={s.resendLink}>
                {resending ? 'Reenviando...' : 'Reenviar código'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[s.verifyBtn, code.length !== 6 && s.verifyBtnDisabled]}
          onPress={handleVerify}
          disabled={code.length !== 6 || verifying}
          activeOpacity={0.8}
        >
          <Text style={s.verifyBtnText}>
            {verifying ? 'Verificando...' : 'Verificar'}
          </Text>
        </TouchableOpacity>

        {/* Back */}
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={18} color={colors.textMuted} />
          <Text style={s.backBtnText}>Voltar ao cadastro</Text>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <Modal visible={showSuccess} transparent animationType="none">
        <Animated.View style={[s.modalOverlay, { opacity: fadeAnim }]}>
          <View style={s.modalCard}>
            <View style={s.successIconWrap}>
              <MaterialCommunityIcons name="check-circle" size={80} color="#38a169" />
            </View>

            <Text style={s.successTitle}>Conta criada com sucesso!</Text>
            <Text style={s.successMessage}>Você já pode fazer login</Text>

            <TouchableOpacity
              style={s.loginBtn}
              onPress={handleGoToLogin}
              activeOpacity={0.8}
            >
              <Text style={s.loginBtnText}>Fazer Login</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },

  iconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },

  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  phone: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.xs,
  },

  otpSection: {
    marginTop: spacing.xxxl,
    marginBottom: spacing.xxl,
  },

  resendSection: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  resendLabel: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  timerText: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '500',
  },
  resendLink: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: '600',
  },

  verifyBtn: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.xxxl + 20,
    alignItems: 'center',
    width: '100%',
  },
  verifyBtnDisabled: {
    opacity: 0.5,
  },
  verifyBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },

  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xl,
    paddingVertical: spacing.sm,
  },
  backBtnText: {
    ...typography.body,
    color: colors.textMuted,
  },

  // Success Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xxxl,
    alignItems: 'center',
    width: '100%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  successIconWrap: {
    marginBottom: spacing.xl,
  },
  successTitle: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  successMessage: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  loginBtn: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.xxxl + 20,
    alignItems: 'center',
    width: '100%',
  },
  loginBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
