import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  Modal,
  Alert,
  RefreshControl,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../../theme/colors';
import { useJobCallsStore } from '../store/jobCallsStore';

type FilterType = 'Todos' | 'REMOTO' | 'PRESENCIAL' | 'HIBRIDO';
const FILTERS: { label: string; value: FilterType }[] = [
  { label: 'Todos', value: 'Todos' },
  { label: 'Remoto', value: 'REMOTO' },
  { label: 'Presencial', value: 'PRESENCIAL' },
  { label: 'Híbrido', value: 'HIBRIDO' },
];

export default function VagasScreen({ navigation }: any) {
  const { openJobCalls, fetchOpenJobCalls, applyToJob, isLoading } = useJobCallsStore();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('Todos');
  const [selectedVaga, setSelectedVaga] = useState<any | null>(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchOpenJobCalls();
  }, []);

  const onRefresh = useCallback(() => {
    fetchOpenJobCalls();
  }, []);

  const filtered = openJobCalls.filter((v) => {
    const matchSearch =
      !search ||
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.company?.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      v.location?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === 'Todos' || v.jobWorkMode === activeFilter;
    return matchSearch && matchFilter;
  });

  const handleApply = async () => {
    if (!selectedVaga) return;
    setApplying(true);
    try {
      await applyToJob(selectedVaga.id);
      setSelectedVaga(null);
      Alert.alert(
        'Candidatura enviada!',
        'A empresa será notificada. Acompanhe o status em "Minhas candidaturas".',
        [
          { text: 'Ver candidaturas', onPress: () => navigation.navigate('MinhasCandidaturas') },
          { text: 'OK', style: 'cancel' },
        ],
      );
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Não foi possível se candidatar.';
      Alert.alert('Erro', msg);
    } finally {
      setApplying(false);
    }
  };

  const getWorkModeColor = (mode: string) => {
    switch (mode) {
      case 'REMOTO': return { bg: colors.infoSoft, text: colors.info };
      case 'PRESENCIAL': return { bg: colors.warningSoft, text: colors.warning };
      default: return { bg: colors.accentSoft, text: colors.accent };
    }
  };

  const workModeLabel: Record<string, string> = {
    REMOTO: 'Remoto',
    PRESENCIAL: 'Presencial',
    HIBRIDO: 'Híbrido',
  };

  return (
    <View style={s.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      <View style={s.header}>
        <View style={s.headerTop}>
          <View>
            <Text style={s.headerTitle}>Vagas</Text>
            <Text style={s.headerSubtitle}>{filtered.length} vagas encontradas</Text>
          </View>
          <TouchableOpacity
            style={s.candidaturasBtn}
            onPress={() => navigation.navigate('MinhasCandidaturas')}
          >
            <MaterialCommunityIcons name="clipboard-list-outline" size={20} color="rgba(255,255,255,0.9)" />
            <Text style={s.candidaturasBtnText}>Minhas{'\n'}candidaturas</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={s.searchContainer}>
        <View style={s.searchWrap}>
          <MaterialCommunityIcons name="magnify" size={20} color={colors.textMuted} />
          <TextInput
            style={s.searchInput}
            placeholder="Cargo, empresa ou cidade..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <MaterialCommunityIcons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.filtersScroll}
          contentContainerStyle={s.filtersContent}
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.value}
              style={[s.filterChip, activeFilter === f.value && s.filterChipActive]}
              onPress={() => setActiveFilter(f.value)}
            >
              <Text style={[s.filterText, activeFilter === f.value && s.filterTextActive]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={s.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
      >
        {filtered.length === 0 ? (
          <View style={s.emptyContainer}>
            <MaterialCommunityIcons name="briefcase-search" size={48} color={colors.textMuted} />
            <Text style={s.emptyText}>
              {isLoading ? 'Carregando vagas...' : 'Nenhuma vaga encontrada'}
            </Text>
            {!isLoading && <Text style={s.emptyHint}>Puxe para atualizar</Text>}
          </View>
        ) : (
          filtered.map((vaga) => {
            const modeColor = getWorkModeColor(vaga.jobWorkMode ?? '');
            return (
              <TouchableOpacity key={vaga.id} style={s.vagaCard} onPress={() => setSelectedVaga(vaga)}>
                <View style={s.vagaHeader}>
                  <View style={s.companyIcon}>
                    <MaterialCommunityIcons name="domain" size={22} color={colors.accent} />
                  </View>
                  <View style={s.vagaInfo}>
                    <Text style={s.vagaTitle}>{vaga.title}</Text>
                    <Text style={s.vagaCompany}>{vaga.company?.companyName ?? 'Empresa'}</Text>
                  </View>
                </View>

                <View style={s.vagaDetails}>
                  {vaga.location && (
                    <View style={s.detailRow}>
                      <MaterialCommunityIcons name="map-marker-outline" size={14} color={colors.textMuted} />
                      <Text style={s.detailText}>{vaga.location}</Text>
                    </View>
                  )}
                  {vaga.salary && (
                    <View style={s.detailRow}>
                      <MaterialCommunityIcons name="cash" size={14} color={colors.textMuted} />
                      <Text style={s.detailText}>
                        R$ {vaga.salary}{vaga.salaryMax ? ` - R$ ${vaga.salaryMax}` : ''}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={s.vagaTags}>
                  {vaga.jobWorkMode && (
                    <View style={[s.typeTag, { backgroundColor: modeColor.bg }]}>
                      <Text style={[s.typeTagText, { color: modeColor.text }]}>
                        {workModeLabel[vaga.jobWorkMode] ?? vaga.jobWorkMode}
                      </Text>
                    </View>
                  )}
                  {vaga.contractType && (
                    <View style={s.periodTag}>
                      <Text style={s.periodTagText}>{vaga.contractType}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Detail Modal */}
      <Modal visible={!!selectedVaga} animationType="slide" transparent>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Detalhes da Vaga</Text>
              <TouchableOpacity onPress={() => setSelectedVaga(null)}>
                <MaterialCommunityIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {selectedVaga && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={s.modalVagaTitle}>{selectedVaga.title}</Text>
                <Text style={s.modalCompany}>{selectedVaga.company?.companyName ?? 'Empresa'}</Text>

                {selectedVaga.location && (
                  <View style={s.modalInfoRow}>
                    <MaterialCommunityIcons name="map-marker" size={16} color={colors.accent} />
                    <Text style={s.modalInfoText}>{selectedVaga.location}</Text>
                  </View>
                )}
                {selectedVaga.salary && (
                  <View style={s.modalInfoRow}>
                    <MaterialCommunityIcons name="cash" size={16} color={colors.accent} />
                    <Text style={s.modalInfoText}>
                      R$ {selectedVaga.salary}{selectedVaga.salaryMax ? ` - R$ ${selectedVaga.salaryMax}` : ''}
                    </Text>
                  </View>
                )}
                {selectedVaga.jobWorkMode && (
                  <View style={s.modalInfoRow}>
                    <MaterialCommunityIcons name="briefcase-outline" size={16} color={colors.accent} />
                    <Text style={s.modalInfoText}>
                      {workModeLabel[selectedVaga.jobWorkMode]} · {selectedVaga.contractType ?? ''}
                    </Text>
                  </View>
                )}

                <Text style={s.modalSectionTitle}>Descrição</Text>
                <Text style={s.modalDescription}>{selectedVaga.description}</Text>

                {selectedVaga.benefits?.length > 0 && (
                  <>
                    <Text style={s.modalSectionTitle}>Benefícios</Text>
                    <View style={s.benefitsWrap}>
                      {selectedVaga.benefits.map((b: string, i: number) => (
                        <View key={i} style={s.benefitChip}>
                          <Text style={s.benefitText}>{b}</Text>
                        </View>
                      ))}
                    </View>
                  </>
                )}

                <TouchableOpacity
                  style={[s.applyBtn, applying && { opacity: 0.6 }]}
                  onPress={handleApply}
                  disabled={applying}
                >
                  <Text style={s.applyBtnText}>
                    {applying ? 'Enviando...' : 'Candidatar-se'}
                  </Text>
                </TouchableOpacity>

                <View style={{ height: 30 }} />
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 48,
    paddingBottom: 14,
    paddingHorizontal: spacing.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#FFF', letterSpacing: -0.3 },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  candidaturasBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  candidaturasBtnText: { fontSize: 11, color: 'rgba(255,255,255,0.9)', fontWeight: '600', lineHeight: 15 },
  searchContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 42,
    gap: spacing.sm,
  },
  searchInput: { flex: 1, ...typography.body, color: colors.text },
  filtersScroll: { marginTop: spacing.md },
  filtersContent: { gap: spacing.sm, paddingBottom: spacing.xs },
  filterChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  filterText: { fontSize: 13, fontWeight: '500', color: colors.textSecondary },
  filterTextActive: { color: '#FFF', fontWeight: '600' },
  list: { flex: 1, paddingHorizontal: spacing.md, paddingTop: spacing.md },
  emptyContainer: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { ...typography.body, color: colors.textMuted, marginTop: spacing.md },
  emptyHint: { ...typography.bodySmall, color: colors.textMuted, marginTop: 4 },
  vagaCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    elevation: 1,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  vagaHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  companyIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vagaInfo: { flex: 1, marginLeft: spacing.md },
  vagaTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  vagaCompany: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  vagaDetails: { marginTop: spacing.md, gap: 6 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailText: { fontSize: 13, color: colors.textMuted },
  vagaTags: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md, gap: spacing.sm },
  typeTag: { paddingHorizontal: spacing.sm + 2, paddingVertical: 3, borderRadius: radius.full },
  typeTagText: { fontSize: 11, fontWeight: '600' },
  periodTag: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radius.full,
    backgroundColor: colors.accentSoft,
  },
  periodTagText: { fontSize: 11, fontWeight: '600', color: colors.accent },
  modalOverlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: '85%',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: { ...typography.h3, color: colors.text },
  modalVagaTitle: { ...typography.h2, color: colors.text },
  modalCompany: { fontSize: 15, color: colors.textSecondary, marginTop: 4 },
  modalInfoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  modalInfoText: { fontSize: 14, color: colors.text },
  modalSectionTitle: {
    ...typography.label,
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  modalDescription: { ...typography.body, color: colors.textSecondary, lineHeight: 22 },
  benefitsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  benefitChip: {
    backgroundColor: colors.successSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  benefitText: { fontSize: 12, color: colors.success, fontWeight: '600' },
  applyBtn: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  applyBtnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
});
