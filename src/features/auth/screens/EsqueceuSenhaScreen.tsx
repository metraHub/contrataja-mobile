import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { authApi } from '../services/authApi';
import { colors, spacing, typography, radius } from '../../../theme/colors';

export default function EsqueceuSenhaScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError('Informe seu e-mail');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authApi.requestPasswordReset(email.trim().toLowerCase());
      setSent(true);
    } catch {
      setError('Erro ao processar. Tente novamente.');
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
          <MaterialCommunityIcons name="lock-reset" size={48} color={colors.accent} />
        </View>

        <Text style={s.title}>Esqueceu sua senha?</Text>
        <Text style={s.subtitle}>
          Informe o e-mail cadastrado e enviaremos as instruções para redefinir sua senha.
        </Text>

        {sent ? (
          <>
            <View style={s.successBox}>
              <MaterialCommunityIcons name="check-circle-outline" size={24} color={colors.success} />
              <Text style={s.successText}>
                Se o e-mail estiver cadastrado, você receberá as instruções em breve. Verifique também sua caixa de spam.
              </Text>
            </View>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('RedefinirSenha')}
              style={s.button}
              contentStyle={{ height: 50 }}
              buttonColor={colors.accent}
            >
              Inserir código recebido
            </Button>
          </>
        ) : (
          <>
            <TextInput
              mode="outlined"
              label="E-mail"
              value={email}
              onChangeText={(v) => { setEmail(v); setError(''); }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={s.input}
              outlineStyle={{ borderRadius: radius.md }}
              error={!!error}
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
              Enviar instruções
            </Button>
          </>
        )}

        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backLink}>
          <Text style={s.backLinkText}>Voltar para o login</Text>
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
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: colors.successSoft,
    padding: spacing.lg,
    borderRadius: radius.md,
    width: '100%',
    marginBottom: spacing.xl,
  },
  successText: { flex: 1, ...typography.body, color: colors.success, lineHeight: 22 },
  backLink: { marginTop: spacing.xl },
  backLinkText: { color: colors.accent, fontWeight: '600', fontSize: 14 },
});
