import React, { useEffect } from 'react';
import { View, FlatList, RefreshControl, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Card, Button } from 'react-native-paper';
import Loading from '../../../../components/common/Loading';
import { useNotificationStore } from '../../store/notificationStore';
import styles from './styles';

export default function Notifications() {
  const insets = useSafeAreaInsets();
  const { notifications, loading, unreadCount, fetch, markAsRead, markAllAsRead } =
    useNotificationStore();

  useEffect(() => {
    fetch();
  }, []);

  if (loading && notifications.length === 0) {
    return <Loading message="Carregando notificacoes..." />;
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Notificações</Text>
            <Text style={styles.headerSubtitle}>Suas atividades recentes</Text>
          </View>
          {unreadCount > 0 && (
            <Button compact onPress={markAllAsRead}>
              Marcar todas como lidas
            </Button>
          )}
        </View>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          notifications.length === 0 ? { flex: 1 } : styles.list
        }
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetch} />
        }
        renderItem={({ item }) => (
          <Card
            style={[styles.card, !item.read && styles.unreadCard]}
            onPress={() => !item.read && markAsRead(item.id)}
          >
            <Card.Content>
              <Text variant="titleSmall" style={styles.title}>
                {item.title}
              </Text>
              <Text style={styles.message}>{item.message}</Text>
              <Text style={styles.time}>{formatDate(item.createdAt)}</Text>
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="titleMedium" style={styles.emptyText}>
              Sem notificacoes
            </Text>
          </View>
        }
      />
    </View>
  );
}
