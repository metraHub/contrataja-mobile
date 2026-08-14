import React, { useState } from 'react';
import { View, FlatList, RefreshControl, StatusBar, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, FAB, Chip } from 'react-native-paper';
import Loading from '../../../../components/common/Loading';
import JobCardPJ from '../../components/JobCardPJ';
import useHomeCompany from './useHomeCompany';
import styles from './styles';
import { STATUS_META } from '../../types/jobCall';

const FILTER_OPTIONS = [
  { key: 'ALL', label: 'Todas' },
  { key: 'OPEN', label: 'Ativa' },
  { key: 'IN_PROGRESS', label: 'Em Andamento' },
  { key: 'HIRED', label: 'Contratado' },
  { key: 'CLOSED', label: 'Encerrada' },
];

export default function HomeCompany({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { companyJobCalls, isLoading, loadingIds, handleRefresh, updateStatus, deleteJobCall, dispatchStatsMap } =
    useHomeCompany();
  const [activeFilter, setActiveFilter] = useState('ALL');

  const filtered =
    activeFilter === 'ALL'
      ? companyJobCalls
      : companyJobCalls.filter((j) => j.status === activeFilter);

  const subtitleLabel =
    activeFilter === 'ALL'
      ? `${companyJobCalls.length} vaga(s) publicada(s)`
      : `${filtered.length} vaga(s) ${STATUS_META[activeFilter]?.label.toLowerCase() ?? ''}`;

  if (isLoading && companyJobCalls.length === 0) {
    return <Loading message="Carregando vagas..." />;
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Minhas Vagas</Text>
            <Text style={styles.headerSubtitle}>{subtitleLabel}</Text>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 8 }}
          contentContainerStyle={{ gap: 8, paddingBottom: 4 }}
        >
          {FILTER_OPTIONS.map((opt) => {
            const isActive = activeFilter === opt.key;
            const color =
              opt.key === 'ALL' ? '#0F172A' : (STATUS_META[opt.key]?.color ?? '#0F172A');
            return (
              <Chip
                key={opt.key}
                selected={isActive}
                onPress={() => setActiveFilter(opt.key)}
                style={{
                  backgroundColor: isActive ? color + '20' : undefined,
                }}
                textStyle={{ color: isActive ? color : undefined, fontSize: 12 }}
              >
                {opt.label}
              </Chip>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={filtered.length === 0 ? { flex: 1 } : styles.list}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />}
        renderItem={({ item }) => (
          <JobCardPJ
            item={item}
            isLoading={loadingIds.has(item.id)}
            onPress={() => navigation.navigate('JobCandidates', { jobCallId: item.id })}
            onStatusChange={updateStatus}
            onDelete={deleteJobCall}
            dispatchStats={dispatchStatsMap[item.id]}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="titleMedium" style={styles.emptyText}>
              Nenhuma vaga encontrada
            </Text>
            <Text variant="bodySmall" style={styles.emptyText}>
              {activeFilter === 'ALL'
                ? 'Toque no + para criar sua primeira vaga'
                : 'Nenhuma vaga com este status'}
            </Text>
          </View>
        }
      />

      <FAB
        icon="plus"
        style={{ position: 'absolute', right: 16, bottom: 16 }}
        onPress={() => navigation.navigate('CreateJobCall')}
      />
    </View>
  );
}
