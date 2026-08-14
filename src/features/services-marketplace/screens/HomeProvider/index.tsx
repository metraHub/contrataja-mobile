import React from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { Text } from 'react-native-paper';
import ServiceCallCard from '../../../../components/cards/ServiceCallCard';
import Loading from '../../../../components/common/Loading';
import useHomeProvider from './useHomeProvider';
import styles from './styles';

export default function HomeProvider({ navigation }: any) {
  const { providerCalls, isLoading, handleAccept, handleReject, handleRefresh } =
    useHomeProvider();

  if (isLoading && providerCalls.length === 0) {
    return <Loading message="Carregando servicos..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleLarge" style={styles.headerTitle}>
          Servicos recebidos
        </Text>
        <Text variant="bodyMedium" style={styles.headerSubtitle}>
          {providerCalls.length} servico(s)
        </Text>
      </View>

      <FlatList
        data={providerCalls}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          providerCalls.length === 0 ? { flex: 1 } : styles.list
        }
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
        renderItem={({ item }) => (
          <ServiceCallCard
            serviceCall={item}
            isProvider
            onAccept={() => handleAccept(item.id)}
            onReject={() => handleReject(item.id)}
            onPress={() =>
              navigation.navigate('Chat', {
                roomId: [item.requesterId, item.providerId].sort().join(':'),
                otherUserId: item.requesterId,
                otherUserName: 'Cliente',
              })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="titleMedium" style={styles.emptyText}>
              Nenhum servico recebido
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
