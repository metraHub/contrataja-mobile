import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  View,
  TextInput as RNTextInput,
  Linking,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FormInput from '../../../components/forms/FormInput';
import { firebaseAuth } from '../services/firebaseAuth';
import { UserType } from '../../../types';
import { colors, spacing, radius, typography } from '../../../theme/colors';

// ==================== MASKS ====================

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatDateInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function parseDate(dateStr: string): Date | null {
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  const [day, month, year] = parts.map(Number);
  if (!day || !month || !year || day > 31 || month > 12 || year < 1900) return null;
  return new Date(year, month - 1, day);
}

function isAtLeast16(dateStr: string): boolean {
  const date = parseDate(dateStr);
  if (!date) return false;
  const today = new Date();
  const age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    return age - 1 >= 16;
  }
  return age >= 16;
}

// ==================== SCHEMA ====================

const registerSchema = z
  .object({
    fullName: z.string().min(3, 'Mínimo 3 caracteres'),
    email: z.string().email('Email inválido'),
    gender: z.enum(['MASCULINO', 'FEMININO'] as const, { message: 'Selecione o sexo' }),
    phone: z
      .string()
      .min(15, 'Número incompleto')
      .regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'Formato: (99) 99999-9999'),
    birthDate: z
      .string()
      .min(10, 'Data incompleta')
      .refine((v) => parseDate(v) !== null, 'Data inválida')
      .refine((v) => isAtLeast16(v), 'Você deve ter pelo menos 16 anos'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    confirmPassword: z.string().min(6, 'Mínimo 6 caracteres'),
    cnpj: z.string().optional(),
    razaoSocial: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Senhas não conferem',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

const typeLabels: Record<string, string> = {
  PF: 'Pessoa Física',
  PJ_CONTRATANTE: 'Empresa',
  PJ_PRESTADOR: 'Prestador de Serviço',
  INSTITUICAO: 'Instituição de Ensino',
};

export default function RegisterScreen({ route, navigation }: any) {
  const { userType } = route.params as { userType: UserType };

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      gender: undefined,
      phone: '',
      birthDate: '',
      password: '',
      confirmPassword: '',
      cnpj: '',
      razaoSocial: '',
    },
  });

  const canSubmit = acceptTerms && acceptPrivacy && !submitting;

  const onSubmit = async (data: RegisterForm) => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const phoneDigits = data.phone.replace(/\D/g, '');
      await firebaseAuth.sendVerificationCode(phoneDigits);

      navigation.navigate('VerifySMS', {
        phone: data.phone,
        userId: '',
        formData: {
          email: data.email,
          password: data.password,
          type: userType,
          fullName: data.fullName,
          gender: data.gender,
          phone: phoneDigits,
          birthDate: parseDate(data.birthDate)?.toISOString(),
          cnpj: data.cnpj || undefined,
          razaoSocial: data.razaoSocial || undefined,
        },
      });
    } catch (error: any) {
      const msg = error?.message || 'Não foi possível enviar o SMS. Verifique o número e tente novamente.';
      Alert.alert('Erro', msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView
      style={s.screen}
      contentContainerStyle={s.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={s.header}>
        <Text style={s.brand}>ContrataJá</Text>
        <Text style={s.title}>Criar conta</Text>
        <View style={s.badge}>
          <Text style={s.badgeText}>{typeLabels[userType]}</Text>
        </View>
      </View>

      <View style={s.form}>
        {/* Campos exclusivos para empresas e prestadores */}
        {(userType === 'PJ_CONTRATANTE' || userType === 'PJ_PRESTADOR') && (
          <>
            <FormInput name="razaoSocial" control={control} label="Razão Social" placeholder="Nome oficial da empresa" />
            <FormInput name="cnpj" control={control} label="CNPJ" placeholder="00.000.000/0000-00" keyboardType="numeric" />
          </>
        )}

        {/* 1. Nome */}
        <FormInput name="fullName" control={control} label={userType === 'PJ_CONTRATANTE' || userType === 'PJ_PRESTADOR' ? 'Nome do responsável' : 'Nome e Sobrenome'} />

        {/* 2. Email */}
        <FormInput name="email" control={control} label="Email" keyboardType="email-address" />

        {/* 3. Sexo */}
        <Controller
          name="gender"
          control={control}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <View style={s.fieldGroup}>
              <Text style={s.fieldLabel}>Sexo</Text>
              <View style={s.radioRow}>
                <TouchableOpacity
                  style={[s.radioBtn, value === 'MASCULINO' && s.radioBtnActive]}
                  onPress={() => onChange('MASCULINO')}
                  activeOpacity={0.7}
                >
                  <View style={[s.radioCircle, value === 'MASCULINO' && s.radioCircleActive]}>
                    {value === 'MASCULINO' && <View style={s.radioDot} />}
                  </View>
                  <Text style={[s.radioText, value === 'MASCULINO' && s.radioTextActive]}>
                    Masculino
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[s.radioBtn, value === 'FEMININO' && s.radioBtnActive]}
                  onPress={() => onChange('FEMININO')}
                  activeOpacity={0.7}
                >
                  <View style={[s.radioCircle, value === 'FEMININO' && s.radioCircleActive]}>
                    {value === 'FEMININO' && <View style={s.radioDot} />}
                  </View>
                  <Text style={[s.radioText, value === 'FEMININO' && s.radioTextActive]}>
                    Feminino
                  </Text>
                </TouchableOpacity>
              </View>
              {error && <Text style={s.errorText}>{error.message}</Text>}
            </View>
          )}
        />

        {/* 4. Celular */}
        <Controller
          name="phone"
          control={control}
          render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
            <View style={s.fieldGroup}>
              <Text style={s.fieldLabel}>Número de celular</Text>
              <View style={[s.customInput, error && s.customInputError]}>
                <MaterialCommunityIcons name="cellphone" size={20} color={colors.textMuted} />
                <Text style={s.phonePrefix}>+55</Text>
                <View style={s.phoneDivider} />
                <RNTextInput
                  style={s.maskedInput}
                  value={value}
                  onChangeText={(text) => onChange(formatPhone(text))}
                  onBlur={onBlur}
                  placeholder="(99) 99999-9999"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="phone-pad"
                  maxLength={15}
                />
              </View>
              {error && <Text style={s.errorText}>{error.message}</Text>}
            </View>
          )}
        />

        {/* 5. Data de Nascimento */}
        <Controller
          name="birthDate"
          control={control}
          render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
            <View style={s.fieldGroup}>
              <Text style={s.fieldLabel}>Data de nascimento</Text>
              <View style={[s.customInput, error && s.customInputError]}>
                <MaterialCommunityIcons name="calendar" size={20} color={colors.textMuted} />
                <RNTextInput
                  style={s.maskedInput}
                  value={value}
                  onChangeText={(text) => onChange(formatDateInput(text))}
                  onBlur={onBlur}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>
              {error && <Text style={s.errorText}>{error.message}</Text>}
            </View>
          )}
        />

        {/* 6. Senha */}
        <FormInput name="password" control={control} label="Senha" secureTextEntry />

        {/* 7. Confirmar Senha */}
        <FormInput
          name="confirmPassword"
          control={control}
          label="Confirmar senha"
          secureTextEntry
        />

        {/* Checkboxes */}
        <View style={s.checkboxSection}>
          <TouchableOpacity
            style={s.checkboxRow}
            onPress={() => setAcceptTerms(!acceptTerms)}
            activeOpacity={0.7}
          >
            <View style={[s.checkbox, acceptTerms && s.checkboxChecked]}>
              {acceptTerms && <MaterialCommunityIcons name="check" size={14} color="#FFF" />}
            </View>
            <Text style={s.checkboxText}>
              Li e aceito os{' '}
              <Text
                style={s.link}
                onPress={() => navigation.navigate('TermosUso')}
              >
                Termos de Uso
              </Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.checkboxRow}
            onPress={() => setAcceptPrivacy(!acceptPrivacy)}
            activeOpacity={0.7}
          >
            <View style={[s.checkbox, acceptPrivacy && s.checkboxChecked]}>
              {acceptPrivacy && <MaterialCommunityIcons name="check" size={14} color="#FFF" />}
            </View>
            <Text style={s.checkboxText}>
              Li e aceito a{' '}
              <Text
                style={s.link}
                onPress={() => navigation.navigate('Privacidade')}
              >
                Política de Privacidade
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[s.button, !canSubmit && s.buttonDisabled]}
          activeOpacity={0.8}
          onPress={handleSubmit(onSubmit)}
          disabled={!canSubmit}
        >
          <Text style={s.buttonText}>
            {submitting ? 'Criando conta...' : 'Criar Conta'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { flexGrow: 1, padding: spacing.xxl, paddingTop: 48 },

  header: { alignItems: 'center', marginBottom: spacing.xxl },
  brand: { ...typography.h1, color: colors.primary, marginBottom: spacing.sm },
  title: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.md },
  badge: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  badgeText: { ...typography.label, color: colors.accent },

  form: { gap: spacing.xs },

  fieldGroup: { marginVertical: 4 },
  fieldLabel: { ...typography.label, color: colors.text, marginBottom: spacing.sm },

  // Radio
  radioRow: { flexDirection: 'row', gap: spacing.md },
  radioBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  radioBtnActive: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleActive: { borderColor: colors.accent },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accent },
  radioText: { fontSize: 15, color: colors.textSecondary },
  radioTextActive: { color: colors.text, fontWeight: '600' },

  // Custom inputs
  customInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    height: 52,
    gap: spacing.sm,
  },
  customInputError: { borderColor: colors.error },
  maskedInput: { flex: 1, fontSize: 15, color: colors.text },
  phonePrefix: { fontSize: 15, color: colors.textSecondary, fontWeight: '600' },
  phoneDivider: { width: 1, height: 24, backgroundColor: colors.border },

  errorText: { color: colors.error, fontSize: 12, marginTop: 4, paddingLeft: 4 },

  // Checkboxes
  checkboxSection: { marginTop: spacing.lg, gap: spacing.md },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: { backgroundColor: colors.accent, borderColor: colors.accent },
  checkboxText: { flex: 1, fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  link: { color: colors.accent, fontWeight: '600', textDecorationLine: 'underline' },

  // Button
  button: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xxxl,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: colors.textOnAccent, fontSize: 16, fontWeight: '600' },
});
