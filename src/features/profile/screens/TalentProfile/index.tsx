import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { profilesApi } from '../../services/profilesApi';
import { TalentResult } from '../../../../types';
import { colors } from '../../../../theme/colors';
import styles from './styles';

export default function TalentProfile({ route }: any) {
  const { userId } = route.params as { userId: string };
  const [talent, setTalent] = useState<TalentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    profilesApi
      .getTalentByUserId(userId)
      .then(setTalent)
      .catch(() => setTalent(null))
      .finally(() => setIsLoading(false));
  }, [userId]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (!talent) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Text style={{ color: colors.textMuted }}>Perfil não encontrado</Text>
      </View>
    );
  }

  const initials = talent.fullName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const totalExp = talent.experiences?.reduce((s, e) => s + e.years, 0) ?? 0;
  const mainRole = talent.experiences?.[0]?.title ?? 'Profissional';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <View style={styles.heroCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{talent.fullName}</Text>
        <Text style={styles.mainRole}>{mainRole}</Text>

        <View style={styles.badgeRow}>
          {totalExp === 0 ? (
            <View style={[styles.badge, { backgroundColor: '#EFF6FF' }]}>
              <Text style={[styles.badgeText, { color: '#3B82F6' }]}>Jovem Talento</Text>
            </View>
          ) : (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{totalExp} {totalExp === 1 ? 'ano' : 'anos'} de exp.</Text>
            </View>
          )}
        </View>
      </View>

      {talent.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo profissional</Text>
          <Text style={styles.summaryText}>{talent.summary}</Text>
        </View>
      )}

      {talent.skills?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Habilidades</Text>
          <View style={styles.skillsRow}>
            {talent.skills.map((skill) => (
              <View key={skill} style={styles.skillChip}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experiências</Text>
        {talent.experiences?.length > 0 ? (
          talent.experiences.map((exp) => (
            <View key={exp.id} style={styles.experienceItem}>
              <Text style={styles.expTitle}>{exp.title}</Text>
              <Text style={styles.expCompany}>{exp.company}</Text>
              <Text style={styles.expYears}>{exp.years} {exp.years === 1 ? 'ano' : 'anos'}</Text>
              {exp.description && (
                <Text style={[styles.expCompany, { marginTop: 4 }]}>{exp.description}</Text>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhuma experiência informada</Text>
        )}
      </View>

      {talent.educations?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Formação acadêmica</Text>
          {talent.educations.map((edu) => (
            <View key={edu.id} style={styles.eduItem}>
              <Text style={styles.eduDegree}>{edu.degree} em {edu.field}</Text>
              <Text style={styles.eduInstitution}>{edu.institution}</Text>
              {(edu.startYear || edu.endYear) && (
                <Text style={styles.expYears}>
                  {edu.startYear ?? '?'} – {edu.endYear ?? 'Atual'}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
