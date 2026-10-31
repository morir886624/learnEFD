import { GrammarLevel } from '../../../types/grammar';

export type GrammarLanguage = 'fr' | 'en';
export type FrenchSubTab = 'lessons' | 'verbs';

export interface LevelFilterOption {
  id: GrammarLevel | 'ALL';
  label: string;
  count: number;
  color?: string;
}

export const LEVEL_COLORS: Record<GrammarLevel, string> = {
  A1: '#16A34A',
  A2: '#0284C7',
  B1: '#7C3AED',
  B2: '#D97706',
};

export const LEVEL_LABELS: Record<GrammarLevel, string> = {
  A1: 'A1 Débutant',
  A2: 'A2 Élémentaire',
  B1: 'B1 Intermédiaire',
  B2: 'B2 Avancé',
};

/** Get the level range of a group of lessons, e.g. "A1–A2" or "B1" */
export function getLevelRange(lessons: { level: GrammarLevel }[]): string {
  if (lessons.length === 0) return '';
  const order: Record<GrammarLevel, number> = { A1: 0, A2: 1, B1: 2, B2: 3 };
  const sorted = [...lessons].sort((a, b) => order[a.level] - order[b.level]);
  const min = sorted[0].level;
  const max = sorted[sorted.length - 1].level;
  return min === max ? min : `${min}–${max}`;
}
