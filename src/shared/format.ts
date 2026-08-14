const WORK_MODE_LABEL: Record<string, string> = {
  REMOTO: 'Remoto',
  PRESENCIAL: 'Presencial',
  HIBRIDO: 'Híbrido',
};

export function formatSalary(salary?: string | null, salaryMax?: string | null): string {
  if (salary && salaryMax) return `R$ ${salary} - R$ ${salaryMax}`;
  if (salary) return `R$ ${salary}`;
  return 'A combinar';
}

export function formatWorkLocation(location?: string | null, jobWorkMode?: string | null): string | null {
  if (location) return location;
  if (jobWorkMode && WORK_MODE_LABEL[jobWorkMode]) return WORK_MODE_LABEL[jobWorkMode];
  return null;
}

// Renders a UTC instant (e.g. InterviewSchedule.scheduledAt) in the device's
// own local timezone — Date already carries the instant correctly, this only
// formats it for display.
export function formatScheduledAt(iso: string): string {
  const d = new Date(iso);
  const date = d.toLocaleDateString('pt-BR');
  const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${date} às ${time}`;
}
