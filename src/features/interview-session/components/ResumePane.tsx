import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { profilesApi } from '../../profile/services/profilesApi';
import { TalentResult } from '../../../types';
import { colors, spacing, radius } from '../../../theme/colors';

interface Props {
  candidateId: string;
}

// Painel compacto do currículo do candidato, pro lado da empresa durante a
// chamada — reaproveita o mesmo endpoint/dado da tela TalentProfile
// (features/profile/screens/TalentProfile), só num layout condensado pra
// caber ao lado do vídeo em vez de tela cheia.
export default function ResumePane({ candidateId }: Props) {
  const [talent, setTalent] = useState<TalentResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profilesApi
      .getTalentByUserId(candidateId)
      .then(setTalent)
      .catch(() => setTalent(null))
      .finally(() => setLoading(false));
  }, [candidateId]);

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (!talent) {
    return (
      <View style={s.center}>
        <Text style={s.emptyText}>Currículo não encontrado</Text>
      </View>
    );
  }

  const mainRole = talent.experiences?.[0]?.title ?? 'Profissional';

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.name}>{talent.fullName}</Text>
      <Text style={s.mainRole}>{mainRole}</Text>

      {talent.summary ? <Text style={s.summary}>{talent.summary}</Text> : null}

      {talent.skills?.length > 0 && (
        <View style={s.skillsRow}>
          {talent.skills.map((skill) => (
            <View key={skill} style={s.skillChip}>
              <Text style={s.skillText}>{skill}</Text>
            </View>
          ))}
        </View>
      )}

      {talent.experiences?.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Experiências</Text>
          {talent.experiences.map((exp) => (
            <View key={exp.id} style={s.item}>
              <Text style={s.itemTitle}>{exp.title}</Text>
              <Text style={s.itemSubtitle}>
                {exp.company} · {exp.years} {exp.years === 1 ? 'ano' : 'anos'}
              </Text>
            </View>
          ))}
        </View>
      )}

      {talent.educations?.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Formação</Text>
          {talent.educations.map((edu) => (
            <View key={edu.id} style={s.item}>
              <Text style={s.itemTitle}>
                {edu.degree} em {edu.field}
              </Text>
              <Text style={s.itemSubtitle}>{edu.institution}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  emptyText: { color: colors.textMuted },
  name: { fontSize: 17, fontWeight: '700', color: colors.text },
  mainRole: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  summary: { fontSize: 13, color: colors.textSecondary, marginTop: spacing.md, lineHeight: 18 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: spacing.md },
  skillChip: {
    backgroundColor: colors.accentSoft,
    borderRadius: radius.md,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  skillText: { fontSize: 11, fontWeight: '600', color: colors.accent },
  section: { marginTop: spacing.lg },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', marginBottom: 6 },
  item: { marginBottom: spacing.sm },
  itemTitle: { fontSize: 13, fontWeight: '600', color: colors.text },
  itemSubtitle: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },
});
