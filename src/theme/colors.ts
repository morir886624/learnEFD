export type ThemeMode = 'book' | 'light' | 'dark' | 'sage';

export interface ThemeInfo {
  id: ThemeMode;
  name: string;
  description: string;
  badge: string;
  previewColor: string;
  previewBg: string;
}

export const THEMES_LIST: ThemeInfo[] = [
  {
    id: 'book',
    name: 'Livre Papier (Sépia)',
    description: 'Fond papier jauni façon roman, idéal pour dévorer les phrases sans fatigue',
    badge: '📖 Confort de lecture',
    previewColor: '#8D4A19',
    previewBg: '#F7F1DF',
  },
  {
    id: 'light',
    name: 'Moderne Épuré',
    description: 'Interface contemporaine lumineuse et dynamique',
    badge: '☀️ Moderne',
    previewColor: '#4F46E5',
    previewBg: '#F8FAFC',
  },
  {
    id: 'dark',
    name: 'Nuit Profonde',
    description: 'Mode sombre anti-reflets idéal pour lire le soir',
    badge: '🌙 Nuit',
    previewColor: '#6366F1',
    previewBg: '#0B0F17',
  },
  {
    id: 'sage',
    name: 'Forêt Sérénité',
    description: 'Teinte sauge douce et apaisante inspirée des liseuses',
    badge: '🍃 Sérénité',
    previewColor: '#1B6A45',
    previewBg: '#EDF4EE',
  },
];

export const colors = {
  book: {
    background: '#F7F1DF', // Warm book parchment / creamy yellow
    surface: '#FFFDF6',    // Ivory book page
    surfaceSubtle: '#EFE6CF',
    cardBorder: '#E0D4B5',
    primary: '#8D4A19',    // Deep leather warm amber
    primaryLight: '#FCEFD8',
    primaryDark: '#5F2E09',
    secondary: '#B45309',  // Gold ink
    secondaryLight: '#FEF3C7',
    accent: '#2D7A4D',     // Emerald bookstamp
    accentLight: '#DCFCE7',
    warning: '#D97706',
    warningLight: '#FEF3C7',
    danger: '#B91C1C',
    dangerLight: '#FEE2E2',
    textPrimary: '#2D2218', // Deep espresso ink - high contrast, no eye strain
    textSecondary: '#655342',
    textMuted: '#968471',
    textInverted: '#FFFDF6',
    dariAccent: '#B45309',
    dariLight: '#FCEFD8',
    frAccent: '#1E3A8A',   // Fountain pen royal blue
    frLight: '#EFF6FF',
    enAccent: '#6B21A8',   // Purple ink
    enLight: '#F5F3FF',
    tabBarBg: '#F2EAD2',
    tabBarBorder: '#DFD3B2',
  },
  light: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceSubtle: '#F1F5F9',
    cardBorder: '#E2E8F0',
    primary: '#4F46E5', // Indigo
    primaryLight: '#EEF2FF',
    primaryDark: '#3730A3',
    secondary: '#0EA5E9', // Sky blue
    secondaryLight: '#E0F2FE',
    accent: '#10B981', // Emerald
    accentLight: '#D1FAE5',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    danger: '#EF4444',
    dangerLight: '#FEE2E2',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    textInverted: '#FFFFFF',
    dariAccent: '#D97706', // Warm amber for Dari
    dariLight: '#FEF3C7',
    frAccent: '#2563EB',   // Royal blue for French
    frLight: '#EFF6FF',
    enAccent: '#7C3AED',   // Violet for English
    enLight: '#F5F3FF',
    tabBarBg: '#FFFFFF',
    tabBarBorder: '#E2E8F0',
  },
  dark: {
    background: '#0B0F17',
    surface: '#161F30',
    surfaceSubtle: '#1E293B',
    cardBorder: '#334155',
    primary: '#6366F1',
    primaryLight: '#312E81',
    primaryDark: '#4338CA',
    secondary: '#38BDF8',
    secondaryLight: '#075985',
    accent: '#34D399',
    accentLight: '#064E3B',
    warning: '#FBBF24',
    warningLight: '#78350F',
    danger: '#F87171',
    dangerLight: '#7F1D1D',
    textPrimary: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textMuted: '#64748B',
    textInverted: '#0F172A',
    dariAccent: '#F59E0B',
    dariLight: '#451A03',
    frAccent: '#60A5FA',
    frLight: '#1E3A8A',
    enAccent: '#A78BFA',
    enLight: '#4C1D95',
    tabBarBg: '#111827',
    tabBarBorder: '#1F2937',
  },
  sage: {
    background: '#EDF4EE', // Calm soft sage green
    surface: '#F7FAF7',    // Light botanical paper
    surfaceSubtle: '#DFEADE',
    cardBorder: '#C8DACB',
    primary: '#1B6A45',    // Forest deep green
    primaryLight: '#E0F2E9',
    primaryDark: '#10472E',
    secondary: '#0D9488',  // Teal
    secondaryLight: '#CCFBF1',
    accent: '#059669',
    accentLight: '#D1FAE5',
    warning: '#D97706',
    warningLight: '#FEF3C7',
    danger: '#DC2626',
    dangerLight: '#FEE2E2',
    textPrimary: '#14281D', // Deep forest ink
    textSecondary: '#355342',
    textMuted: '#5F7E6D',
    textInverted: '#FFFFFF',
    dariAccent: '#B45309',
    dariLight: '#FEF3C7',
    frAccent: '#1E40AF',
    frLight: '#EFF6FF',
    enAccent: '#6D28D9',
    enLight: '#F5F3FF',
    tabBarBg: '#E4EFE5',
    tabBarBorder: '#C7DBCB',
  },
};

export type ThemeColors = typeof colors.light;
