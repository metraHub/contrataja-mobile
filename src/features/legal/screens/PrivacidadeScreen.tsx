import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../../../theme/colors';

export default function PrivacidadeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View style={s.container}>
      <View style={[s.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Política de Privacidade</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.updated}>Última atualização: Abril de 2026</Text>

        <Text style={s.intro}>
          Esta política descreve como o ContrataJá coleta, usa e protege seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
        </Text>

        <Text style={s.sectionTitle}>1. Dados que Coletamos</Text>
        <Text style={s.body}>
          Coletamos os seguintes dados para o funcionamento da plataforma:{'\n\n'}
          <Text style={s.bold}>Dados de identificação:</Text> nome completo, CPF ou CNPJ, data de nascimento, gênero.{'\n\n'}
          <Text style={s.bold}>Dados de contato:</Text> e-mail, número de telefone, endereço.{'\n\n'}
          <Text style={s.bold}>Dados profissionais:</Text> histórico de experiências, formação acadêmica, habilidades, currículo.{'\n\n'}
          <Text style={s.bold}>Dados de uso:</Text> ações realizadas na plataforma, dispositivo e sistema operacional.
        </Text>

        <Text style={s.sectionTitle}>2. Como Usamos seus Dados</Text>
        <Text style={s.body}>
          Seus dados são utilizados para:{'\n'}
          • Criar e gerenciar sua conta{'\n'}
          • Conectar candidatos e empresas (matching){'\n'}
          • Enviar notificações relevantes{'\n'}
          • Melhorar a experiência da plataforma{'\n'}
          • Cumprir obrigações legais
        </Text>

        <Text style={s.sectionTitle}>3. Compartilhamento de Dados</Text>
        <Text style={s.body}>
          Não vendemos seus dados. Compartilhamos apenas:{'\n'}
          • Com empresas quando você se candidata a uma vaga{'\n'}
          • Com prestadores de serviço técnico (hospedagem, autenticação){'\n'}
          • Quando exigido por lei ou ordem judicial
        </Text>

        <Text style={s.sectionTitle}>4. Seus Direitos (LGPD)</Text>
        <Text style={s.body}>
          Conforme a LGPD, você tem direito a:{'\n'}
          • <Text style={s.bold}>Acesso:</Text> consultar quais dados temos sobre você{'\n'}
          • <Text style={s.bold}>Correção:</Text> atualizar dados incompletos ou incorretos{'\n'}
          • <Text style={s.bold}>Exclusão:</Text> solicitar a remoção dos seus dados{'\n'}
          • <Text style={s.bold}>Portabilidade:</Text> exportar seus dados em formato legível{'\n'}
          • <Text style={s.bold}>Revogação:</Text> retirar consentimento a qualquer momento
        </Text>

        <Text style={s.sectionTitle}>5. Segurança dos Dados</Text>
        <Text style={s.body}>
          Utilizamos medidas técnicas de segurança incluindo criptografia de senhas (bcrypt), comunicação via HTTPS, e controle de acesso por autenticação JWT. Dados sensíveis como CPF e CNPJ são armazenados de forma protegida.
        </Text>

        <Text style={s.sectionTitle}>6. Retenção de Dados</Text>
        <Text style={s.body}>
          Mantemos seus dados enquanto sua conta estiver ativa. Após a exclusão da conta, os dados são anonimizados ou removidos em até 30 dias, salvo obrigação legal de retenção.
        </Text>

        <Text style={s.sectionTitle}>7. Cookies e Rastreamento</Text>
        <Text style={s.body}>
          O aplicativo utiliza armazenamento local apenas para manter sua sessão ativa. Não utilizamos cookies de rastreamento para fins publicitários.
        </Text>

        <Text style={s.sectionTitle}>8. Contato e DPO</Text>
        <Text style={s.body}>
          Para exercer seus direitos ou tirar dúvidas sobre privacidade:{'\n'}
          privacidade@contrataja.com.br{'\n\n'}
          Você também pode registrar reclamações na ANPD (Autoridade Nacional de Proteção de Dados): www.gov.br/anpd
        </Text>

        <View style={{ height: insets.bottom + 24 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { ...typography.h3, color: colors.text },
  content: { padding: spacing.xl },
  updated: { fontSize: 12, color: colors.textMuted, marginBottom: spacing.lg },
  intro: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: 22,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  body: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  bold: { fontWeight: '700', color: colors.text },
});
