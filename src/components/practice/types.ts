export type PracticeMode = 'explorer' | 'flashcards' | 'quiz';

export type ContentSource = 'phrases' | 'vocab-fr' | 'vocab-en';

export interface PracticeStats {
  masteredPhrases: number;
  totalPhrases: number;
  masteredVocabFr: number;
  totalVocabFr: number;
  masteredVocabEn: number;
  totalVocabEn: number;
}

