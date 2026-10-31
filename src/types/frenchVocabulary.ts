export type FrenchVocabularyLevel = 'A1' | 'A2' | 'B1' | 'B2';

export type FrenchVocabularyCategory =
  | 'feelings-mind'           // États d'être, d'esprit & sentiments (Ch. 5)
  | 'relationships-social'    // Forger & rompre des relations (Ch. 5)
  | 'home-daily'              // La maison, logement & vie quotidienne (Ch. 5)
  | 'travel-transports'       // Voyages, transports, gare & aéroport (Ch. 5)
  | 'work-science-health'     // Travail, métiers, médecine & santé (Ch. 5)
  | 'leisure-technology'      // Loisirs, arts, informatique & internet (Ch. 5)
  | 'food-gastronomy'         // Gastronomie, repas, courses & cuisine (Ch. 5)
  | 'transitions-discourse'   // Connecteurs logiques & écrit (Ch. 30)
  | 'verb-prepositions'       // Verbes avec prépositions À et DE (Ch. 31)
  | 'false-cognates'          // Faux amis & pièges de traduction (Ch. 32)
  | 'idioms-conversation';    // Expressions idiomatiques & conversation (Ch. 33-36)

export interface FrenchVocabularyItem {
  id: string;
  category: FrenchVocabularyCategory;
  level: FrenchVocabularyLevel;
  wordFr: string;
  phonetic?: string;
  partOfSpeech: string;       // 'nom m.', 'nom f.', 'verbe', 'locution', 'adjectif', 'adverbe'
  gender?: 'masculin' | 'féminin' | 'invariable' | 'verbe' | 'expression';
  article?: 'un' | 'une' | 'le' | 'la' | "l'" | 'les';
  meaningEn: string;
  meaningDari: string;
  dariPhonetic?: string;
  exampleFr: string;
  exampleEn: string;
  exampleDari: string;
  usageTipFr?: string;
  usageTipDari?: string;
  prepositionHighlight?: string; // e.g. "à" or "de"
  falseFriendWarning?: {
    englishLookalike: string;
    trueMeaningFr: string;
    trueMeaningEn: string;
  };
  sourceRef: string;          // e.g. "All-in-One Ch. 5 • p. 88"
}

export interface FrenchVocabularyDeck {
  id: FrenchVocabularyCategory;
  order: number;
  titleFr: string;
  titleEn: string;
  titleDari: string;
  badge: string;
  descriptionFr: string;
  descriptionDari: string;
  color: string;
  iconName: string;
}

export type FrenchVocabExerciseType =
  | 'multiple-choice'
  | 'preposition-snap'
  | 'false-friend-hunter'
  | 'context-match';

export interface FrenchVocabularyExercise {
  id: string;
  category: FrenchVocabularyCategory;
  type: FrenchVocabExerciseType;
  level: FrenchVocabularyLevel;
  promptFr: string;
  promptEn: string;
  promptDari: string;
  sentence?: string;
  targetMeaningFr?: string;
  options: string[];
  correctAnswer: string;
  explanationFr: string;
  explanationEn: string;
  explanationDari: string;
  sourceRef: string;
}

export interface FrenchVocabularyUserProgress {
  masteredWordIds: string[];
  reviewWordIds: string[];
  deckScores: Record<string, { score: number; total: number; date: string }>;
}

