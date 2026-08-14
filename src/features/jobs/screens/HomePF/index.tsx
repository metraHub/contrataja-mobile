import React from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { Text } from 'react-native-paper';
import JobCallCard from '../../../../components/cards/JobCallCard';
import Loading from '../../../../components/common/Loading';
import useHomePF from './useHomePF';
import styles from './styles';

export default function HomePF({ navigation }: any) {
  const { candidateMatches, isLoading, handleAccept, handleReject, handleRefresh } =
    useHomePF();

  if (isLoading && candidateMatches.length === 0) {
    return <Loading message="Buscando vagas..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleLarge" style={styles.headerTitle}>
          Vagas para voce
        </Text>
        <Text variant="bodyMedium" style={styles.headerSubtitle}>
          {candidateMatches.length} vaga(s) disponivel(is)
        </Text>
      </View>

      <FlatList
        data={candidateMatches}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          candidateMatches.length === 0 ? { flex: 1 } : styles.list
        }
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
        renderItem={({ item }) => (
          <JobCallCard
            match={item}
            onAccept={() => handleAccept(item.jobCallId)}
            onReject={() => handleReject(item.jobCallId)}
            onPress={() =>
              navigation.navigate('JobCallDetail', {
                jobCallId: item.jobCallId,
                matchId: item.id,
              })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="titleMedium" style={styles.emptyText}>
              Nenhuma vaga disponivel no momento
            </Text>
            <Text variant="bodySmall" style={styles.emptyText}>
              Puxe para baixo para atualizar
            </Text>
          </View>
        }
      />
    </View>
  );
}
