import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { authApi } from '../services/authApi';
import { colors, spacing, typography, radius } from '../../../theme/colors';

export default function RedefinirSenhaScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const [token, setToken] = useState((route.params?.token as string) ?? '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!token.trim()) {
      setError('Informe o código recebido por e-mail');
      return;
    }
    if (newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authApi.resetPassword(token.trim(), newPassword);
      setDone(true);
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Código inválido ou expirado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[s.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={s.content}>
        <View style={s.iconWrap}>
          <MaterialCommunityIcons name="lock-check-outline" size={48} color={colors.accent} />
        </View>

        <Text style={s.title}>Nova senha</Text>
        <Text style={s.subtitle}>
          Insira o código recebido por e-mail e escolha uma nova senha.
        </Text>

        {done ? (
          <View style={s.successBox}>
            <MaterialCommunityIcons name="check-circle-outline" size={24} color={colors.success} />
            <Text style={s.successText}>Senha redefinida com sucesso!</Text>
          </View>
        ) : (
          <>
            <TextInput
              mode="outlined"
              label="Código recebido por e-mail"
              value={token}
              onChangeText={(v) => { setToken(v); setError(''); }}
              autoCapitalize="characters"
              style={s.input}
              outlineStyle={{ borderRadius: radius.md }}
            />

            <TextInput
              mode="outlined"
              label="Nova senha"
              value={newPassword}
              onChangeText={(v) => { setNewPassword(v); setError(''); }}
              secureTextEntry={!showPassword}
              style={s.input}
              outlineStyle={{ borderRadius: radius.md }}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />

            <TextInput
              mode="outlined"
              label="Confirmar nova senha"
              value={confirmPassword}
              onChangeText={(v) => { setConfirmPassword(v); setError(''); }}
              secureTextEntry={!showPassword}
              style={s.input}
              outlineStyle={{ borderRadius: radius.md }}
            />

            {!!error && <Text style={s.errorText}>{error}</Text>}

            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              style={s.button}
              contentStyle={{ height: 50 }}
              buttonColor={colors.accent}
            >
              Redefinir senha
            </Button>
          </>
        )}

        <TouchableOpacity
          onPress={() => done ? navigation.navigate('UserType') : navigation.goBack()}
          style={s.backLink}
        >
          <Text style={s.backLinkText}>
            {done ? 'Ir para o login' : 'Voltar para o login'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  content: {
    flex: 1,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: { ...typography.h2, color: colors.text, textAlign: 'center', marginBottom: spacing.sm },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xxxl,
  },
  input: { width: '100%', backgroundColor: colors.surface, marginBottom: spacing.sm },
  errorText: { color: colors.error, fontSize: 12, alignSelf: 'flex-start', marginBottom: spacing.sm },
  button: { width: '100%', borderRadius: radius.md, marginTop: spacing.sm },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.successSoft,
    padding: spacing.lg,
    borderRadius: radius.md,
    width: '100%',
    marginBottom: spacing.xl,
  },
  successText: { flex: 1, ...typography.body, color: colors.success },
  backLink: { marginTop: spacing.xl },
  backLinkText: { color: colors.accent, fontWeight: '600', fontSize: 14 },
});
