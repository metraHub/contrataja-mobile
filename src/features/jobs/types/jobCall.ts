export { JobCallStatus, type JobCall } from '../../../types/index';

export const STATUS_META: Record<
  string,
  { label: string; color: string; icon: string }
> = {
  OPEN:        { label: 'Ativa',        color: '#4caf50', icon: 'briefcase-check-outline' },
  IN_PROGRESS: { label: 'Em Andamento', color: '#ff9800', icon: 'clock-outline' },
  HIRED:       { label: 'Contratado',   color: '#2196f3', icon: 'trophy-outline' },
  CLOSED:      { label: 'Encerrada',    color: '#9e9e9e', icon: 'archive-outline' },
  CANCELLED:   { label: 'Cancelada',    color: '#f44336', icon: 'close-circle-outline' },
};

export const VALID_TRANSITIONS: Record<string, string[]> = {
  OPEN:        ['IN_PROGRESS', 'HIRED', 'CLOSED', 'CANCELLED'],
  IN_PROGRESS: ['OPEN', 'HIRED'],
  HIRED:       ['OPEN'],
  CLOSED:      ['OPEN'],
  CANCELLED:   ['OPEN'],
};
