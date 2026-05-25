export const COLORS = {
  // App shell
  background: '#0F172A',
  card: '#1E293B',
  cardBorder: '#334155',
  cardHover: '#263348',

  // Text
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',

  // Brand accent
  accent: '#38BDF8',
  accentDim: '#0EA5E920',

  // Channel colours
  whatsapp: '#22C55E',
  whatsappBg: '#14532D',
  email: '#3B82F6',
  emailBg: '#1E3A8A',
  call: '#F59E0B',
  callBg: '#78350F',

  // Status colours
  statusNew: '#3B82F6',
  statusNewBg: '#1E3A8A',
  statusOpen: '#38BDF8',
  statusOpenBg: '#0C4A6E',
  statusQualified: '#22C55E',
  statusQualifiedBg: '#14532D',
  statusEscalated: '#EF4444',
  statusEscalatedBg: '#7F1D1D',
  statusProcessing: '#A78BFA',
  statusProcessingBg: '#3B0764',
  statusResolved: '#6B7280',
  statusResolvedBg: '#1F2937',

  // Urgency
  urgencyHigh: '#EF4444',
  urgencyMedium: '#F59E0B',
  urgencyLow: '#22C55E',

  // Semantic
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#38BDF8',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const FONT_SIZE = {
  xs: 11,
  sm: 12,
  base: 14,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 30,
} as const;

export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
} as const;
