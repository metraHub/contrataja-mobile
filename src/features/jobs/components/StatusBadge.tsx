import React from 'react';
import { Chip } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { STATUS_META } from '../types/jobCall';

interface Props {
  status: string;
}

export default function StatusBadge({ status }: Props) {
  const meta = STATUS_META[status] ?? { label: status, color: '#9e9e9e', icon: 'help-circle-outline' };

  return (
    <Chip
      style={{ alignSelf: 'flex-start', backgroundColor: meta.color + '20' }}
      textStyle={{ color: meta.color, fontSize: 12 }}
      icon={() => (
        <MaterialCommunityIcons name={meta.icon as any} size={14} color={meta.color} />
      )}
    >
      {meta.label}
    </Chip>
  );
}
