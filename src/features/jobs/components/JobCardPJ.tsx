import React, { useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import { Menu, IconButton, Dialog, Button, Text } from 'react-native-paper';
import { JobCall } from '../../../types/index';
import { STATUS_META, VALID_TRANSITIONS } from '../types/jobCall';
import { DispatchStats } from '../services/jobCallsApi';
import StatusBadge from './StatusBadge';
import styles from '../screens/HomeCompany/styles';

const WORK_MODE_LABELS: Record<string, string> = {
  REMOTO: 'Remoto',
  PRESENCIAL: 'Presencial',
  HIBRIDO: 'Híbrido',
};

function formatSalaryRange(salary?: string, salaryMax?: string) {
  if (!salary) return null;
  return salaryMax ? `R$ ${salary} - R$ ${salaryMax}` : `R$ ${salary}`;
}

interface Props {
  item: JobCall;
  isLoading: boolean;
  onPress: () => void;
  onStatusChange: (jobCallId: string, status: string) => Promise<void>;
  onDelete: (jobCallId: string) => Promise<void>;
  dispatchStats?: DispatchStats;
}

export default function JobCardPJ({ item, isLoading, onPress, onStatusChange, onDelete, dispatchStats }: Props) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [hiredDialogVisible, setHiredDialogVisible] = useState(false);

  const accepted = item.matches?.filter((m) => m.status === 'ACCEPTED') ?? [];
  const transitions = VALID_TRANSITIONS[item.status] ?? [];
  const salaryRange = formatSalaryRange(item.salary, item.salaryMax);

  const handleSelectStatus = (status: string) => {
    setMenuVisible(false);
    if (status === 'HIRED') {
      setHiredDialogVisible(true);
      return;
    }
    onStatusChange(item.id, status);
  };

  const handleArchive = () => {
    setHiredDialogVisible(false);
    onStatusChange(item.id, 'HIRED');
  };

  const handleDelete = () => {
    setHiredDialogVisible(false);
    Alert.alert(
      'Deletar vaga',
      'Esta ação é irreversível. Deseja realmente deletar a vaga?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Deletar', style: 'destructive', onPress: () => onDelete(item.id) },
      ],
    );
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.jobCard, isLoading && { opacity: 0.5 }]}
        onPress={isLoading ? undefined : onPress}
        activeOpacity={0.8}
        disabled={isLoading}
      >
        <View style={styles.jobCardTopRow}>
          <StatusBadge status={item.status} />
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="dots-vertical"
                size={20}
                disabled={isLoading}
                onPress={() => setMenuVisible(true)}
              />
            }
          >
            {transitions.map((status) => (
              <Menu.Item
                key={status}
                title={STATUS_META[status]?.label ?? status}
                leadingIcon={STATUS_META[status]?.icon}
                onPress={() => handleSelectStatus(status)}
              />
            ))}
          </Menu>
        </View>

        <Text style={styles.jobCardTitle}>{item.title}</Text>

        {(item.jobWorkMode || salaryRange) && (
          <View style={styles.jobCardTagsRow}>
            {item.jobWorkMode && (
              <View style={styles.jobCardTag}>
                <Text style={styles.jobCardTagText}>
                  {WORK_MODE_LABELS[item.jobWorkMode] ?? item.jobWorkMode}
                </Text>
              </View>
            )}
            {salaryRange && (
              <View style={styles.jobCardTag}>
                <Text style={styles.jobCardTagText}>{salaryRange}</Text>
              </View>
            )}
          </View>
        )}

        <Text style={styles.jobCardDescription} numberOfLines={2}>
          {item.description}
        </Text>

        {accepted.length > 0 && (
          <Text style={styles.acceptedCount}>
            {accepted.length} candidato(s) aceitaram
          </Text>
        )}
        {dispatchStats && dispatchStats.totalNotified > 0 && (
          <View style={styles.dispatchRow}>
            <View style={styles.dispatchStat}>
              <Text style={styles.dispatchStatValue}>{dispatchStats.totalNotified}</Text>
              <Text style={styles.dispatchStatLabel}>Notificados</Text>
            </View>
            <View style={styles.dispatchStat}>
              <Text style={styles.dispatchStatValue}>{dispatchStats.totalViewed}</Text>
              <Text style={styles.dispatchStatLabel}>Viram</Text>
            </View>
            <View style={styles.dispatchStat}>
              <Text style={styles.dispatchStatValue}>{dispatchStats.totalInterested}</Text>
              <Text style={styles.dispatchStatLabel}>Interessados</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>

      <Dialog visible={hiredDialogVisible} onDismiss={() => setHiredDialogVisible(false)}>
        <Dialog.Title>Marcar como Contratado</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">
            O que deseja fazer com essa vaga?
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setHiredDialogVisible(false)}>Cancelar</Button>
          <Button onPress={handleArchive}>Arquivar</Button>
          <Button textColor="#f44336" onPress={handleDelete}>Deletar vaga</Button>
        </Dialog.Actions>
      </Dialog>
    </>
  );
}
