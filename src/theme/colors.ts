export const colors = {
  // Base institucional - Azul escuro
  primary: '#0F172A',
  primaryDark: '#020617',
  primaryLight: '#1E293B',
  primarySoft: '#E2E8F0',

  // Destaque - Graphite
  accent: '#334155',
  accentDark: '#1E293B',
  accentLight: '#64748B',
  accentSoft: '#F1F5F9',

  // Superfícies
  background: '#EDF1F7',
  surface: '#FFFFFF',
  surfaceVariant: '#F1F5F9',

  // Textos
  text: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textOnPrimary: '#FFFFFF',
  textOnAccent: '#FFFFFF',

  // Bordas
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  divider: '#E2E8F0',

  // Status
  success: '#10B981',
  successSoft: '#ECFDF5',
  error: '#EF4444',
  errorSoft: '#FEF2F2',
  warning: '#F59E0B',
  warningSoft: '#FFFBEB',
  info: '#3B82F6',
  infoSoft: '#EFF6FF',

  // Sombras
  cardShadow: '#0F172A',
  overlay: 'rgba(15, 23, 42, 0.6)',

  // Feed / Social
  linkedin: {
    headerBg: '#0F172A',
    like: '#334155',
    comment: '#64748B',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: '600' as const },
  // Matches the native stack header's titleStyle (see CompanyStack), for screens
  // that render their own header instead of using the native one.
  screenTitle: { fontSize: 17, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  bodySmall: { fontSize: 13, fontWeight: '400' as const },
  caption: { fontSize: 11, fontWeight: '500' as const, letterSpacing: 0.3 },
  label: { fontSize: 13, fontWeight: '600' as const, letterSpacing: 0.2 },
};
