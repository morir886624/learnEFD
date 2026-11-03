import {
  FrenchVocabularyCategory,
  FrenchVocabularyItem,
  FrenchVocabularyLevel,
} from '../../types/frenchVocabulary';

export interface FrVocabExtra {
  gender?: 'masculin' | 'féminin' | 'invariable' | 'verbe' | 'expression';
  article?: 'un' | 'une' | 'le' | 'la' | "l'" | 'les';
  usageTipFr?: string;
  usageTipDari?: string;
  prepositionHighlight?: string;
  falseFriendWarning?: {
    englishLookalike: string;
    trueMeaningFr: string;
    trueMeaningEn: string;
  };
  sourceRef?: string;
}

/**
 * Compact tuple format for FrenchVocabularyItem:
 * [0] category: FrenchVocabularyCategory
 * [1] wordFr: string
 * [2] phonetic: string
 * [3] partOfSpeech: string ('nom m.', 'nom f.', 'verbe', 'adjectif', 'adverbe', 'locution')
 * [4] meaningEn: string
 * [5] meaningDari: string
 * [6] dariPhonetic: string
 * [7] exampleFr: string
 * [8] exampleEn: string
 * [9] exampleDari: string
 * [10] sourceRef?: string
 * [11] extra?: FrVocabExtra
 */
export type FrVocabTuple = [
  FrenchVocabularyCategory,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string?,
  FrVocabExtra?,
];

function inferGender(
  pos: string,
  explicit?: FrVocabExtra['gender']
): FrVocabExtra['gender'] {
  if (explicit) return explicit;
  const p = pos.toLowerCase();
  if (p.includes('nom m')) return 'masculin';
  if (p.includes('nom f')) return 'féminin';
  if (p.includes('verbe')) return 'verbe';
  if (p.includes('locution') || p.includes('expr')) return 'expression';
  return 'invariable';
}

export function buildFrVocab(
  level: FrenchVocabularyLevel,
  prefix: string,
  tuples: FrVocabTuple[]
): FrenchVocabularyItem[] {
  const defaultSourceByLevel: Record<FrenchVocabularyLevel, string> = {
    A1: 'Référentiel CECRL & Édito • A1',
    A2: 'Heminway All-in-One & CECRL • A2',
    B1: 'Heminway All-in-One & Édito • B1',
    B2: 'Alliance Française & Grévisse • B2',
  };

  return tuples.map((t, idx) => {
    const [
      category,
      wordFr,
      phonetic,
      partOfSpeech,
      meaningEn,
      meaningDari,
      dariPhonetic,
      exampleFr,
      exampleEn,
      exampleDari,
      sourceRef,
      extra,
    ] = t;

    return {
      id: `${prefix}-${idx + 1}`,
      category,
      level,
      wordFr,
      phonetic,
      partOfSpeech,
      gender: inferGender(partOfSpeech, extra?.gender),
      meaningEn,
      meaningDari,
      dariPhonetic,
      exampleFr,
      exampleEn,
      exampleDari,
      sourceRef: sourceRef || extra?.sourceRef || defaultSourceByLevel[level],
      ...(extra?.article ? { article: extra.article } : {}),
      ...(extra?.usageTipFr ? { usageTipFr: extra.usageTipFr } : {}),
      ...(extra?.usageTipDari ? { usageTipDari: extra.usageTipDari } : {}),
      ...(extra?.prepositionHighlight
        ? { prepositionHighlight: extra.prepositionHighlight }
        : {}),
      ...(extra?.falseFriendWarning
        ? { falseFriendWarning: extra.falseFriendWarning }
        : {}),
    };
  });
}

