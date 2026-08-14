import React, { useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Chip, IconButton, ActivityIndicator } from 'react-native-paper';
import { TextInput } from 'react-native-paper';
import { TalentResult } from '../../../../types';
import useFindTalent, { WorkModeFilter, ExperienceFilter } from './useFindTalent';
import { AREAS_ATUACAO } from '../../../jobs/types/areas';
import { colors } from '../../../../theme/colors';
import styles from './styles';

const WORK_MODE_OPTIONS: { label: string; value: WorkModeFilter }[] = [
  { label: 'Todos', value: '' },
  { label: 'Remoto', value: 'REMOTO' },
  { label: 'Presencial', value: 'PRESENCIAL' },
  { label: 'Híbrido', value: 'AMBOS' },
];

const EXPERIENCE_OPTIONS: { label: string; value: ExperienceFilter }[] = [
  { label: 'Qualquer', value: '' },
  { label: '0–1 ano', value: '0' },
  { label: '1–3 anos', value: '1' },
  { label: '3–5 anos', value: '3' },
  { label: '5+ anos', value: '5' },
];

function TalentCard({
  talent,
  totalExp,
  onPress,
}: {
  talent: TalentResult;
  totalExp: number;
  onPress: () => void;
}) {
  const initials = talent.fullName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const topSkills = talent.skills.slice(0, 3);
  const mainRole = talent.experiences?.[0]?.title ?? 'Profissional';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{talent.fullName}</Text>
          <Text style={styles.cardTitle}>{mainRole}</Text>
        </View>
      </View>

      <View style={styles.badgeRow}>
        {totalExp === 0 ? (
          <View style={[styles.badge, { backgroundColor: '#EFF6FF' }]}>
            <Text style={[styles.badgeText, { color: '#3B82F6' }]}>Jovem Talento</Text>
          </View>
        ) : (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {totalExp} {totalExp === 1 ? 'ano' : 'anos'} de exp.
            </Text>
          </View>
        )}
      </View>

      {topSkills.length > 0 && (
        <View style={styles.skillsRow}>
          {topSkills.map((skill) => (
            <View key={skill} style={styles.skillChip}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
          {talent.skills.length > 3 && (
            <View style={styles.skillChip}>
              <Text style={styles.skillText}>+{talent.skills.length - 3}</Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function FindTalent({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [panelOpen, setPanelOpen] = useState(false);

  const {
    professionals,
    isLoading,
    hasSearched,
    query,
    setQuery,
    workMode,
    setWorkMode,
    minExperience,
    setMinExperience,
    areaFilter,
    setAreaFilter,
    search,
    totalExperience,
  } = useFindTalent();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Encontrar Talento</Text>
          <IconButton
            icon={panelOpen ? 'close' : 'magnify'}
            size={22}
            onPress={() => setPanelOpen((open) => !open)}
          />
        </View>

        {panelOpen && (
          <View style={styles.searchRow}>
            <TextInput
              mode="outlined"
              placeholder="Ex: Desenvolvedor React, Soldador..."
              value={query}
              onChangeText={setQuery}
              style={styles.searchInput}
              outlineStyle={{ borderRadius: 10 }}
              onSubmitEditing={search}
              returnKeyType="search"
              right={
                query.length > 0 ? (
                  <TextInput.Icon icon="close" onPress={() => setQuery('')} />
                ) : undefined
              }
            />
            <IconButton
              icon="magnify"
              mode="contained"
              containerColor={colors.accent}
              iconColor="#fff"
              size={24}
              onPress={search}
              style={styles.searchBtn}
            />
          </View>
        )}
      </View>

      {/* FILTROS */}
      {panelOpen && (
        <View style={styles.filtersSection}>
          <Text style={styles.filterLabel}>Modo de trabalho</Text>
          <View style={styles.chipRow}>
            {WORK_MODE_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                selected={workMode === opt.value}
                onPress={() => setWorkMode(opt.value)}
                style={[styles.chip, workMode === opt.value && styles.chipActive]}
                textStyle={workMode === opt.value ? styles.chipTextActive : undefined}
                compact
              >
                {opt.label}
              </Chip>
            ))}
          </View>

          <Text style={styles.filterLabel}>Experiência mínima</Text>
          <View style={styles.chipRow}>
            {EXPERIENCE_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                selected={minExperience === opt.value}
                onPress={() => setMinExperience(opt.value)}
                style={[styles.chip, minExperience === opt.value && styles.chipActive]}
                textStyle={minExperience === opt.value ? styles.chipTextActive : undefined}
                compact
              >
                {opt.label}
              </Chip>
            ))}
          </View>

          <Text style={styles.filterLabel}>Area de Atuacao</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={[styles.chipRow, { flexWrap: 'nowrap' }]}>
              <Chip
                selected={areaFilter === ''}
                onPress={() => setAreaFilter('')}
                style={[styles.chip, areaFilter === '' && styles.chipActive]}
                textStyle={areaFilter === '' ? styles.chipTextActive : undefined}
                compact
              >
                Todas
              </Chip>
              {AREAS_ATUACAO.map((area) => (
                <Chip
                  key={area}
                  selected={areaFilter === area}
                  onPress={() => setAreaFilter(areaFilter === area ? '' : area)}
                  style={[styles.chip, areaFilter === area && styles.chipActive]}
                  textStyle={areaFilter === area ? styles.chipTextActive : undefined}
                  compact
                >
                  {area}
                </Chip>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* RESULTADO */}
      {isLoading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator color={colors.accent} />
          <Text style={[styles.emptyText, { marginTop: 12 }]}>Buscando profissionais...</Text>
        </View>
      ) : (
        <>
          {hasSearched && professionals.length > 0 && (
            <Text style={styles.resultCount}>
              {professionals.length} profissional(is) encontrado(s)
            </Text>
          )}
          <FlatList
            data={professionals}
            keyExtractor={(item) => item.userId}
            contentContainerStyle={
              professionals.length === 0 ? { flex: 1 } : styles.list
            }
            renderItem={({ item }) => (
              <TalentCard
                talent={item}
                totalExp={totalExperience(item)}
                onPress={() =>
                  navigation.navigate('TalentProfile', { userId: item.userId })
                }
              />
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text variant="titleMedium" style={styles.emptyText}>
                  {hasSearched
                    ? 'Nenhum profissional encontrado'
                    : 'Nenhum talento disponivel para suas vagas abertas'}
                </Text>
                {hasSearched && (
                  <Text variant="bodySmall" style={styles.emptyText}>
                    Tente termos diferentes ou remova filtros
                  </Text>
                )}
              </View>
            }
          />
        </>
      )}
    </View>
  );
}
