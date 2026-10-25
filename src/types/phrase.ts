export type Level = 'A1' | 'A2' | 'B1';

export type CategoryId =
  | 'all'
  | 'greetings'
  | 'daily'
  | 'travel'
  | 'food'
  | 'shopping'
  | 'emergency'
  | 'work'
  | 'social'
  | 'admin';

export interface Phrase {
  id: string;
  level: Level;
  category: CategoryId;
  fr: string;               // French phrase
  en: string;               // English phrase
  dari: string;             // Dari Perso-Arabic script (دری)
  dariPhonetic: string;     // Phonetic transcription in Latin alphabet
  literalOrNote?: string;   // Contextual note, grammar rule or literal breakdown
  tags?: string[];
}

export interface CategoryInfo {
  id: CategoryId;
  labelFr: string;
  labelEn: string;
  labelDari: string;
  icon: string;
  color: string;
  description: string;
}

export interface UserStats {
  streakDays: number;
  lastStudyDate: string | null;
  masteredPhraseIds: string[];
  reviewPhraseIds: string[];
  quizHighScore: number;
  totalQuizzesTaken: number;
}
