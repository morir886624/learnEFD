export type GrammarLevel = 'A1' | 'A2' | 'B1' | 'B2';

export type GrammarCategory =
  | 'tenses'
  | 'modals'
  | 'conditionals'
  | 'passive'
  | 'clauses'
  | 'gerunds'
  | 'nouns-articles'
  | 'adjectives-adverbs'
  | 'prepositions'
  | 'troublesome';

export interface GrammarFormula {
  affirmative: string;
  negative: string;
  question: string;
  notes?: string;
  notesFr?: string;
  notesDari?: string;
}

export interface TimelinePoint {
  id: string;
  label: string;
  labelFr: string;
  labelDari: string;
  timePosition: 'past' | 'past-recent' | 'now' | 'future';
  type: 'point' | 'continuous' | 'state' | 'completed';
  exampleEn: string;
  exampleFr: string;
  exampleDari: string;
}

export interface ComparisonItem {
  name: string;
  form: string;
  conceptEn: string;
  conceptFr: string;
  conceptDari: string;
  exampleEn: string;
  exampleFr: string;
  exampleDari: string;
  dialogue?: {
    speakerA: string;
    speakerB: string;
    speakerAFr?: string;
    speakerBFr?: string;
  };
}

export interface ComparisonPair {
  titleEn: string;
  titleFr: string;
  titleDari: string;
  itemA: ComparisonItem;
  itemB: ComparisonItem;
  keyContrastEn: string;
  keyContrastFr: string;
  keyContrastDari: string;
}

export interface AzarChartRow {
  col1: string;
  col2: string;
  notes?: string;
  notesFr?: string;
}

export interface AzarChart {
  title: string;
  titleFr: string;
  titleDari?: string;
  headers: [string, string, string?];
  rows: AzarChartRow[];
}

export type ExerciseType =
  | 'multiple-choice'
  | 'sentence-scramble'
  | 'error-hunter'
  | 'discrimination';

export interface BaseExercise {
  id: string;
  type: ExerciseType;
  promptEn: string;
  promptFr: string;
  promptDari: string;
  sourceRef: string; // e.g. "Murphy Unit 3", "Azar Chart 2-3"
  explanationEn: string;
  explanationFr: string;
  explanationDari: string;
}

export interface MultipleChoiceExercise extends BaseExercise {
  type: 'multiple-choice';
  sentence: string; // with "___" or gap
  options: string[];
  correctAnswer: string;
}

export interface SentenceScrambleExercise extends BaseExercise {
  type: 'sentence-scramble';
  tokens: string[]; // scrambled words
  correctOrder: string[]; // correct tokens array
  translationFr: string;
  translationDari: string;
}

export interface ErrorHunterSegment {
  text: string;
  isError: boolean;
  correction?: string;
}

export interface ErrorHunterExercise extends BaseExercise {
  type: 'error-hunter';
  segments: ErrorHunterSegment[];
  correctionNoteEn: string;
  correctionNoteFr: string;
  correctionNoteDari: string;
}

export interface DiscriminationExercise extends BaseExercise {
  type: 'discrimination';
  targetMeaningEn: string;
  targetMeaningFr: string;
  targetMeaningDari: string;
  options: {
    sentence: string;
    isCorrect: boolean;
    explanationEn: string;
    explanationFr: string;
  }[];
}

export type GrammarExercise =
  | MultipleChoiceExercise
  | SentenceScrambleExercise
  | ErrorHunterExercise
  | DiscriminationExercise;

export interface GrammarRuleItem {
  id: string;
  ruleEn: string;
  ruleFr: string;
  ruleDari: string;
  exampleEn: string;
  exampleFr: string;
  exampleDari: string;
  isAlert?: boolean;
}

export interface GrammarLesson {
  id: string;
  moduleId: string;
  unitNumber: number;
  level: GrammarLevel;
  titleEn: string;
  titleFr: string;
  titleDari: string;
  summaryEn: string;
  summaryFr: string;
  summaryDari: string;
  sources: {
    murphyUnits?: number[];
    azarChapters?: number[];
    description: string;
  };
  formula?: GrammarFormula;
  timeline?: {
    descriptionEn: string;
    descriptionFr: string;
    descriptionDari: string;
    points: TimelinePoint[];
  };
  comparison?: ComparisonPair;
  chart?: AzarChart;
  rules: GrammarRuleItem[];
  troublesomeNotes?: {
    titleEn: string;
    titleFr: string;
    titleDari: string;
    pairs: {
      wrong: string;
      right: string;
      explanationEn: string;
      explanationFr: string;
    }[];
  };
  exercises: GrammarExercise[];
}

export interface GrammarModule {
  id: string;
  category: GrammarCategory;
  order: number;
  titleEn: string;
  titleFr: string;
  titleDari: string;
  badge: string;
  descriptionFr: string;
  descriptionDari: string;
  color: string;
  iconName: string;
  lessonIds: string[];
}

export interface GrammarUserProgress {
  completedLessonIds: string[];
  lessonScores: Record<string, { score: number; total: number; date: string }>;
  masteredRuleIds: string[];
}

