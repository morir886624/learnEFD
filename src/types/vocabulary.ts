export type VocabularyLevel = 'A1' | 'A2' | 'B1' | 'B2';

export type VocabularyCategory =
  | 'phrasal-verbs'
  | 'irregular-verbs'
  | 'adj-prepositions'
  | 'verb-prepositions'
  | 'noun-idioms'
  | 'uncountable-nouns'
  | 'stative-mental'
  | 'participial-adjectives'
  | 'confusable-pairs'
  | 'connectors-academic';

export interface IrregularVerbForms {
  base: string;
  pastSimple: string;
  pastParticiple: string;
}

export interface VocabularyItem {
  id: string;
  category: VocabularyCategory;
  level: VocabularyLevel;
  wordEn: string;
  phoneticEn: string;
  partOfSpeech: string;
  verbForms?: IrregularVerbForms;
  prepositionHighlight?: string;
  meaningEn: string;
  meaningFr: string;
  meaningDari: string;
  dariPhonetic: string;
  exampleEn: string;
  exampleFr: string;
  exampleDari: string;
  usageTipFr?: string;
  usageTipDari?: string;
  commonMistake?: {
    wrong: string;
    right: string;
  };
  sourceRef: string;
}

export interface VocabularyDeck {
  id: VocabularyCategory;
  order: number;
  titleEn: string;
  titleFr: string;
  titleDari: string;
  badge: string;
  descriptionFr: string;
  descriptionDari: string;
  color: string;
  iconName: string;
}

export type VocabExerciseType =
  | 'preposition-snap'
  | 'irregular-form'
  | 'context-match'
  | 'pair-discrimination';

export interface VocabularyExercise {
  id: string;
  category: VocabularyCategory;
  type: VocabExerciseType;
  level: VocabularyLevel;
  promptFr: string;
  promptDari: string;
  sentence: string;
  targetMeaningFr?: string;
  options: string[];
  correctAnswer: string;
  explanationFr: string;
  explanationDari: string;
  sourceRef: string;
}

export interface VocabularyUserProgress {
  masteredWordIds: string[];
  reviewWordIds: string[];
  deckScores: Record<string, { score: number; total: number; date: string }>;
}
