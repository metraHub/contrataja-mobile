import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '../../../theme/colors';

export default function TermosUsoScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View style={s.container}>
      <View style={[s.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Termos de Uso</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.updated}>Última atualização: Abril de 2026</Text>

        <Text style={s.intro}>
          Ao usar o ContrataJá, você concorda com os termos descritos abaixo. Leia com atenção antes de utilizar a plataforma.
        </Text>

        <Text style={s.sectionTitle}>1. Sobre a Plataforma</Text>
        <Text style={s.body}>
          O ContrataJá é uma plataforma de conexão entre profissionais (Pessoa Física) e empresas (Pessoa Jurídica), facilitando o processo de recrutamento e seleção. A plataforma não é parte do contrato de trabalho entre as partes.
        </Text>

        <Text style={s.sectionTitle}>2. Cadastro e Conta</Text>
        <Text style={s.body}>
          Você é responsável pela veracidade das informações fornecidas no cadastro. O uso de informações falsas pode resultar na suspensão ou exclusão da conta. Cada usuário pode ter apenas uma conta ativa.
        </Text>

        <Text style={s.sectionTitle}>3. Uso Aceitável</Text>
        <Text style={s.body}>
          É proibido utilizar a plataforma para:{'\n'}
          • Divulgar informações falsas ou enganosas{'\n'}
          • Assediar, ameaçar ou discriminar outros usuários{'\n'}
          • Publicar conteúdo ilegal ou ofensivo{'\n'}
          • Tentar acessar contas de outros usuários{'\n'}
          • Realizar atividades que prejudiquem o funcionamento do sistema
        </Text>

        <Text style={s.sectionTitle}>4. Responsabilidades</Text>
        <Text style={s.body}>
          O ContrataJá atua como intermediário e não se responsabiliza pelo resultado de processos seletivos, qualidade dos serviços prestados por profissionais, ou veracidade das informações publicadas por empresas e candidatos.
        </Text>

        <Text style={s.sectionTitle}>5. Propriedade Intelectual</Text>
        <Text style={s.body}>
          Todo o conteúdo da plataforma (marca, design, código, textos) é de propriedade exclusiva do ContrataJá. É proibida a reprodução sem autorização expressa.
        </Text>

        <Text style={s.sectionTitle}>6. Encerramento de Conta</Text>
        <Text style={s.body}>
          Você pode solicitar a exclusão da sua conta a qualquer momento nas configurações do perfil. O ContrataJá pode suspender ou encerrar contas que violem estes termos.
        </Text>

        <Text style={s.sectionTitle}>7. Alterações nos Termos</Text>
        <Text style={s.body}>
          Podemos atualizar estes termos periodicamente. Você será notificado sobre mudanças significativas. O uso continuado da plataforma após as alterações implica aceitação dos novos termos.
        </Text>

        <Text style={s.sectionTitle}>8. Contato</Text>
        <Text style={s.body}>
          Em caso de dúvidas sobre estes termos, entre em contato:{'\n'}
          contato@contrataja.com.br
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
});
