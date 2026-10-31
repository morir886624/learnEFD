export type FrenchGrammarLevel = 'A1' | 'A2' | 'B1' | 'B2';

export type FrenchGrammarCategory =
  | 'nouns-articles'
  | 'present-tense'
  | 'irregular-modals'
  | 'sentence-architecture'
  | 'past-tenses'
  | 'future-conditional'
  | 'subjunctive-moods'
  | 'pronouns'
  | 'syntax-discourse'
  | 'adjectives-numbers'
  | 'prepositions-solver';

export interface FrenchGrammarFormula {
  affirmative: string;
  negative: string;
  question: string;
  notesFr?: string;
  notesEn?: string;
  notesDari?: string;
}

export interface FrenchTimelinePoint {
  id: string;
  labelFr: string;
  labelEn: string;
  labelDari: string;
  timePosition: 'past-distant' | 'past' | 'past-recent' | 'now' | 'future';
  type: 'point' | 'continuous' | 'state' | 'completed';
  exampleFr: string;
  exampleEn: string;
  exampleDari: string;
}

export interface FrenchComparisonItem {
  name: string;
  form: string;
  conceptFr: string;
  conceptEn: string;
  conceptDari: string;
  exampleFr: string;
  exampleEn: string;
  exampleDari: string;
}

export interface FrenchComparisonPair {
  titleFr: string;
  titleEn: string;
  titleDari: string;
  itemA: FrenchComparisonItem;
  itemB: FrenchComparisonItem;
  keyContrastFr: string;
  keyContrastEn: string;
  keyContrastDari: string;
}

export interface FrenchGrammarChartRow {
  col1: string;       // Subject / Category in French
  col2: string;       // Conjugation / French Example (spoken when tapped)
  col3?: string;      // English & Dari translation or note
  notesFr?: string;
  notesDari?: string;
}

export interface FrenchGrammarChart {
  titleFr: string;
  titleEn: string;
  titleDari?: string;
  headers: [string, string, string?];
  rows: FrenchGrammarChartRow[];
}

export interface FrenchVocabularyItem {
  fr: string;
  en: string;
  dari: string;
  phonetic?: string;
}

export type FrenchExerciseType =
  | 'multiple-choice'
  | 'sentence-scramble'
  | 'error-hunter'
  | 'discrimination';

export interface BaseFrenchExercise {
  id: string;
  type: FrenchExerciseType;
  promptFr: string;
  promptEn: string;
  promptDari: string;
  sourceRef: string; // e.g. "Complete Grammar Unit 7 • All-in-One Ch. 15"
  explanationFr: string;
  explanationEn: string;
  explanationDari: string;
}

export interface FrenchMultipleChoiceExercise extends BaseFrenchExercise {
  type: 'multiple-choice';
  sentence: string; // French sentence with "___"
  translationEn?: string;
  translationDari?: string;
  options: string[];
  correctAnswer: string;
}

export interface FrenchSentenceScrambleExercise extends BaseFrenchExercise {
  type: 'sentence-scramble';
  tokens: string[];       // Scrambled French words
  correctOrder: string[]; // Correct French tokens in order
  translationEn: string;
  translationDari: string;
}

export interface FrenchErrorHunterSegment {
  text: string;
  isError: boolean;
  correction?: string;
}

export interface FrenchErrorHunterExercise extends BaseFrenchExercise {
  type: 'error-hunter';
  segments: FrenchErrorHunterSegment[];
  correctionNoteFr: string;
  correctionNoteEn: string;
  correctionNoteDari: string;
}

export interface FrenchDiscriminationExercise extends BaseFrenchExercise {
  type: 'discrimination';
  targetMeaningFr: string;
  targetMeaningEn: string;
  targetMeaningDari: string;
  options: {
    sentence: string;
    isCorrect: boolean;
    explanationFr: string;
    explanationEn: string;
  }[];
}

export type FrenchGrammarExercise =
  | FrenchMultipleChoiceExercise
  | FrenchSentenceScrambleExercise
  | FrenchErrorHunterExercise
  | FrenchDiscriminationExercise;

export interface FrenchGrammarRuleItem {
  id: string;
  ruleFr: string;
  ruleEn: string;
  ruleDari: string;
  exampleFr: string;
  exampleEn: string;
  exampleDari: string;
  isAlert?: boolean;
}

export interface FrenchGrammarLesson {
  id: string;
  moduleId: string;
  unitNumber: number;
  level: FrenchGrammarLevel;
  titleFr: string;
  titleEn: string;
  titleDari: string;
  summaryFr: string;
  summaryEn: string;
  summaryDari: string;
  sources: {
    grammarUnits?: number[];
    allInOneChapters?: number[];
    description: string;
  };
  formula?: FrenchGrammarFormula;
  timeline?: {
    descriptionFr: string;
    descriptionEn: string;
    descriptionDari: string;
    points: FrenchTimelinePoint[];
  };
  comparison?: FrenchComparisonPair;
  chart?: FrenchGrammarChart;
  vocabulary?: FrenchVocabularyItem[];
  rules?: FrenchGrammarRuleItem[];
  troublesomeNotes?: {
    titleFr: string;
    titleEn: string;
    titleDari: string;
    pairs: {
      wrong: string;
      right: string;
      explanationFr: string;
      explanationEn: string;
      explanationDari?: string;
    }[];
  };
  exercises: FrenchGrammarExercise[];
}

export interface FrenchGrammarModule {
  id: string;
  category: FrenchGrammarCategory;
  order: number;
  titleFr: string;
  titleEn: string;
  titleDari: string;
  badge: string;
  descriptionFr: string;
  descriptionEn: string;
  descriptionDari: string;
  color: string;
  iconName: string;
  lessonIds: string[];
}

export type FrenchVerbTenseKey =
  | 'present'
  | 'passeCompose'
  | 'imparfait'
  | 'futurSimple'
  | 'conditionnel'
  | 'subjonctif'
  | 'imperatif';

export interface FrenchVerbConjugationTable {
  id: string;
  infinitive: string;
  meaningEn: string;
  meaningDari: string;
  group: '1er groupe (-er)' | '1er groupe (orthographe)' | '2e groupe (-ir)' | '3e groupe (irrégulier)';
  auxiliary: 'avoir' | 'être';
  pastParticiple: string;
  noteFr: string;
  tenses: Record<FrenchVerbTenseKey, string[]>;
}

