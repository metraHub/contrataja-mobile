import React from 'react';
import { StyleSheet, ScrollView, Alert, TouchableOpacity, View, Image, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../../../components/forms/FormInput';
import { useAuthStore } from '../store/authStore';
import { UserType } from '../../../types';
import { colors, spacing, radius, typography } from '../../../theme/colors';

const LOGO_WIDTH = Dimensions.get('window').width * 0.7;
const LOGO_HEIGHT = Math.round(LOGO_WIDTH / 3.6);

const isCompany = (type: UserType) => type === 'PJ_CONTRATANTE' || type === 'PJ_PRESTADOR';

const loginSchemaPF = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

const loginSchemaPJ = z.object({
  cnpj: z.string().min(1, 'CNPJ obrigatório'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

export default function LoginScreen({ navigation, route }: any) {
  const { userType } = route.params as { userType: UserType };
  const { login, isLoading } = useAuthStore();
  const company = isCompany(userType);

  const { control, handleSubmit } = useForm<any>({
    resolver: zodResolver(company ? loginSchemaPJ : loginSchemaPF),
    defaultValues: company ? { cnpj: '', password: '' } : { email: '', password: '' },
  });

  const onSubmit = async (data: any) => {
    try {
      await login(data);
    } catch (error: any) {
      const msg = error.response?.data?.message;
      Alert.alert('Erro', Array.isArray(msg) ? msg.join('\n') : msg || 'Credenciais inválidas');
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Entrar na sua conta</Text>
      </View>

      <View style={styles.form}>
        {company ? (
          <FormInput name="cnpj" control={control} label="CNPJ" placeholder="00.000.000/0000-00" keyboardType="numeric" />
        ) : (
          <FormInput name="email" control={control} label="Email" keyboardType="email-address" />
        )}
        <FormInput name="password" control={control} label="Senha" secureTextEntry />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          activeOpacity={0.8}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('EsqueceuSenha')}
        >
          <Text style={styles.linkText}>Esqueceu sua senha? <Text style={styles.linkBold}>Recuperar</Text></Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('Register', { userType })}
        >
          <Text style={styles.linkText}>Nao tem conta? <Text style={styles.linkBold}>Criar conta</Text></Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    padding: spacing.xxl,
    justifyContent: 'center',
  },
  header: {
    marginBottom: spacing.md,
  },
  logo: {
    width: LOGO_WIDTH,
    height: LOGO_HEIGHT,
    alignSelf: 'center',
    marginBottom: 4,
  },
  title: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    gap: spacing.xs,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.textOnAccent,
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  linkText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  linkBold: {
    color: colors.accent,
    fontWeight: '600',
  },
});
