import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { Switch } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../../theme/colors';
import { useAuthStore } from '../../auth/store/authStore';
import { useUserStore } from '../store/userStore';
import { authApi } from '../../auth/services/authApi';
import { useEffect } from 'react';


export default function PerfilScreen({ navigation }: any) {
  const { logout, deleteAccount } = useAuthStore();
  const { profile, fetchProfile } = useUserStore();

  useEffect(() => {
    fetchProfile();
  }, []);
  const profilePF = profile?.profilePF;

  const displayName = profilePF?.fullName || profile?.email || 'Usuário ContrataJá';
  const displayRole = profilePF?.areaAtuacao || 'Profissional';
  const displayCity = profilePF?.city || 'São Paulo, SP';

  const [disponivel, setDisponivel] = useState(profile?.disponivel ?? false);

  useEffect(() => {
    setDisponivel(profile?.disponivel ?? false);
  }, [profile?.disponivel]);

  const handleToggleDisponivel = useCallback(async (value: boolean) => {
    setDisponivel(value);
    try {
      await authApi.setDisponivel(value);
    } catch {
      setDisponivel(!value);
      Alert.alert('Erro', 'Nao foi possivel atualizar disponibilidade');
    }
  }, []);

  const experiences = profilePF?.experiences?.length
    ? profilePF.experiences.map((e: any) => ({
        id: e.id,
        role: e.role,
        company: e.company,
        period: `${e.startDate || ''} - ${e.endDate || 'Presente'}`,
        description: e.description || '',
      }))
    : [];

  const educations = profilePF?.educations?.length
    ? profilePF.educations.map((e: any) => ({
        id: e.id,
        degree: e.degree,
        institution: e.institution,
        period: `${e.startYear || ''} - ${e.endYear || ''}`,
      }))
    : [];

  const skills: string[] = profilePF?.skills?.length ? profilePF.skills : [];

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja realmente sair da conta?', [
      { text: 'Cancelar' },
      { text: 'Sair', onPress: logout, style: 'destructive' },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Excluir conta',
      'Tem certeza? Todos os seus dados serão removidos permanentemente. Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir minha conta',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Confirmar exclusão',
              'Esta é sua última confirmação. Seus dados serão apagados agora.',
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Sim, excluir', style: 'destructive', onPress: deleteAccount },
              ],
            );
          },
        },
      ],
    );
  };

  return (
    <View style={s.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover + Profile Photo */}
        <View style={s.coverSection}>
          <View style={s.cover} />
          <View style={s.profilePhotoWrap}>
            <View style={s.profilePhoto}>
              <MaterialCommunityIcons name="account" size={48} color={colors.textMuted} />
            </View>
          </View>
        </View>

        {/* Name + Info */}
        <View style={s.nameSection}>
          <Text style={s.name}>{displayName}</Text>
          <Text style={s.role}>{displayRole}</Text>
          <View style={s.locationRow}>
            <MaterialCommunityIcons name="map-marker-outline" size={16} color={colors.textMuted} />
            <Text style={s.locationText}>{displayCity}</Text>
          </View>

          <View style={s.statsRow}>
            <View style={s.stat}>
              <Text style={s.statNumber}>{experiences.length}</Text>
              <Text style={s.statLabel}>Experiências</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.stat}>
              <Text style={s.statNumber}>{educations.length}</Text>
              <Text style={s.statLabel}>Formações</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.stat}>
              <Text style={s.statNumber}>{skills.length}</Text>
              <Text style={s.statLabel}>Habilidades</Text>
            </View>
          </View>
        </View>

        {/* Disponibilidade */}
        <View style={s.availabilityCard}>
          <View style={s.availabilityLeft}>
            <MaterialCommunityIcons
              name={disponivel ? 'briefcase-check' : 'briefcase-off-outline'}
              size={22}
              color={disponivel ? colors.success : colors.textMuted}
            />
            <View style={{ marginLeft: spacing.md }}>
              <Text style={s.availabilityTitle}>Disponivel para contratacao</Text>
              <Text style={s.availabilitySubtitle}>
                {disponivel ? 'Visivel para empresas' : 'Nao visivel para empresas'}
              </Text>
            </View>
          </View>
          <Switch
            value={disponivel}
            onValueChange={handleToggleDisponivel}
            color={colors.success}
          />
        </View>

        {/* Qualifications Summary */}
        {profilePF?.qualificationsSummary && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Resumo</Text>
            <Text style={s.sectionText}>{profilePF.qualificationsSummary}</Text>
          </View>
        )}

        {/* Currículo Section */}
        <View style={s.sectionHeader}>
          <MaterialCommunityIcons name="file-document-outline" size={20} color={colors.accent} />
          <Text style={s.sectionHeaderTitle}>Currículo</Text>
          <TouchableOpacity
            style={s.editResumeBtn}
            onPress={() => navigation.navigate('Resume')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="pencil-outline" size={15} color={colors.accent} />
            <Text style={s.editResumeBtnText}>Editar</Text>
          </TouchableOpacity>
        </View>

        {/* Experiências */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Experiência Profissional</Text>
          {experiences.length === 0 ? (
            <Text style={s.emptyText}>Nenhuma experiência cadastrada — adicione no Currículo.</Text>
          ) : (
            experiences.map((exp: any, index: number) => (
              <View
                key={exp.id}
                style={[s.itemCard, index < experiences.length - 1 && s.itemCardBorder]}
              >
                <View style={s.itemIconWrap}>
                  <MaterialCommunityIcons name="briefcase" size={18} color={colors.accent} />
                </View>
                <View style={s.itemContent}>
                  <Text style={s.itemTitle}>{exp.role}</Text>
                  <Text style={s.itemSubtitle}>{exp.company}</Text>
                  <Text style={s.itemPeriod}>{exp.period}</Text>
                  {exp.description ? (
                    <Text style={s.itemDescription}>{exp.description}</Text>
                  ) : null}
                </View>
              </View>
            ))
          )}
        </View>

        {/* Formação */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Formação Acadêmica</Text>
          {educations.length === 0 ? (
            <Text style={s.emptyText}>Nenhuma formação cadastrada — adicione no Currículo.</Text>
          ) : (
            educations.map((edu: any, index: number) => (
              <View
                key={edu.id}
                style={[s.itemCard, index < educations.length - 1 && s.itemCardBorder]}
              >
                <View style={s.itemIconWrap}>
                  <MaterialCommunityIcons name="school" size={18} color={colors.accent} />
                </View>
                <View style={s.itemContent}>
                  <Text style={s.itemTitle}>{edu.degree}</Text>
                  <Text style={s.itemSubtitle}>{edu.institution}</Text>
                  <Text style={s.itemPeriod}>{edu.period}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Habilidades */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Habilidades</Text>
          {skills.length === 0 ? (
            <Text style={s.emptyText}>Nenhuma habilidade cadastrada — adicione no Currículo.</Text>
          ) : (
            <View style={s.skillsWrap}>
              {skills.map((skill: string, i: number) => (
                <View key={i} style={s.skillChip}>
                  <Text style={s.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Conta Section */}
        <View style={s.sectionHeader}>
          <MaterialCommunityIcons name="cog-outline" size={20} color={colors.accent} />
          <Text style={s.sectionHeaderTitle}>Conta</Text>
        </View>

        <View style={s.menuSection}>
          <TouchableOpacity style={s.menuItem} onPress={() => navigation.navigate('ProfilePF')}>
            <MaterialCommunityIcons name="pencil-outline" size={22} color={colors.text} />
            <Text style={s.menuText}>Editar Perfil</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={s.menuItem}>
            <MaterialCommunityIcons name="shield-check-outline" size={22} color={colors.text} />
            <Text style={s.menuText}>Privacidade</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={s.menuItem}>
            <MaterialCommunityIcons name="bell-cog-outline" size={22} color={colors.text} />
            <Text style={s.menuText}>Notificações</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={s.menuItem} onPress={() => navigation.navigate('TermosUso')}>
            <MaterialCommunityIcons name="file-document-outline" size={22} color={colors.text} />
            <Text style={s.menuText}>Termos de Uso</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={s.menuItem} onPress={() => navigation.navigate('Privacidade')}>
            <MaterialCommunityIcons name="shield-account-outline" size={22} color={colors.text} />
            <Text style={s.menuText}>Política de Privacidade</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={s.menuItem}>
            <MaterialCommunityIcons name="help-circle-outline" size={22} color={colors.text} />
            <Text style={s.menuText}>Ajuda e Suporte</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={s.menuItem} onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={22} color={colors.error} />
            <Text style={[s.menuText, { color: colors.error }]}>Sair da Conta</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.error} />
          </TouchableOpacity>

          <TouchableOpacity style={[s.menuItem, s.menuItemLast]} onPress={handleDeleteAccount}>
            <MaterialCommunityIcons name="delete-outline" size={22} color={colors.error} />
            <Text style={[s.menuText, { color: colors.error }]}>Excluir Conta</Text>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.error} />
          </TouchableOpacity>
        </View>

        <Text style={s.version}>ContrataJá v1.0.0</Text>
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  // Cover + Photo
  coverSection: { position: 'relative', marginBottom: 50 },
  cover: {
    height: 140,
    backgroundColor: colors.primary,
  },
  profilePhotoWrap: {
    position: 'absolute',
    bottom: -44,
    left: spacing.xl,
  },
  profilePhoto: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.surface,
    borderWidth: 4,
    borderColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },

  // Name section
  nameSection: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginTop: -20,
    paddingTop: spacing.xxxl + 10,
    elevation: 1,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  name: { ...typography.h1, color: colors.text },
  role: { fontSize: 15, color: colors.textSecondary, marginTop: 2 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.xs },
  locationText: { fontSize: 13, color: colors.textMuted },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  stat: { alignItems: 'center', flex: 1 },
  statNumber: { fontSize: 20, fontWeight: '700', color: colors.accent },
  statLabel: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: colors.borderLight },

  // Section headers
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  sectionHeaderTitle: { ...typography.h3, color: colors.text, flex: 1 },
  editResumeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.accentSoft,
  },
  editResumeBtnText: { fontSize: 12, fontWeight: '600', color: colors.accent },

  // Content sections
  section: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.sm,
    elevation: 1,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  sectionText: { ...typography.body, color: colors.textSecondary, lineHeight: 22 },

  // Experience / Education items
  itemCard: {
    flexDirection: 'row',
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
  },
  itemCardBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  itemIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  itemContent: { flex: 1 },
  itemTitle: { fontSize: 14, fontWeight: '600', color: colors.text },
  itemSubtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  itemPeriod: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  itemDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: 19,
  },

  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },

  // Skills
  skillsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  skillChip: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
  },
  skillText: { fontSize: 12, color: colors.accent, fontWeight: '600' },

  // Menu
  menuSection: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    borderRadius: radius.lg,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  menuItemLast: { borderBottomWidth: 0 },
  menuText: { flex: 1, fontSize: 15, color: colors.text, marginLeft: spacing.md },

  version: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.xl,
  },

  availabilityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  availabilityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  availabilityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  availabilitySubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
});
