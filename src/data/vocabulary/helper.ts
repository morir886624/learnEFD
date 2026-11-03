import {
  IrregularVerbForms,
  VocabularyCategory,
  VocabularyItem,
  VocabularyLevel,
} from '../../types/vocabulary';

export interface EnVocabExtra {
  verbForms?: IrregularVerbForms;
  prepositionHighlight?: string;
  usageTipFr?: string;
  usageTipDari?: string;
  commonMistake?: {
    wrong: string;
    right: string;
  };
  sourceRef?: string;
}

/**
 * Compact tuple format for English VocabularyItem:
 * [0] category: VocabularyCategory
 * [1] wordEn: string
 * [2] phoneticEn: string
 * [3] partOfSpeech: string
 * [4] meaningEn: string
 * [5] meaningFr: string
 * [6] meaningDari: string
 * [7] dariPhonetic: string
 * [8] exampleEn: string
 * [9] exampleFr: string
 * [10] exampleDari: string
 * [11] sourceRef?: string
 * [12] extra?: EnVocabExtra
 */
export type EnVocabTuple = [
  VocabularyCategory,
  string,
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
  EnVocabExtra?,
];

export function buildEnVocab(
  level: VocabularyLevel,
  prefix: string,
  tuples: EnVocabTuple[]
): VocabularyItem[] {
  const defaultSourceByLevel: Record<VocabularyLevel, string> = {
    A1: 'Oxford 3000 • CEFR A1',
    A2: 'Oxford 3000 • CEFR A2',
    B1: 'Oxford 3000 & Murphy • CEFR B1',
    B2: 'Oxford 5000 & Cambridge • CEFR B2',
  };

  return tuples.map((t, idx) => {
    const [
      category,
      wordEn,
      phoneticEn,
      partOfSpeech,
      meaningEn,
      meaningFr,
      meaningDari,
      dariPhonetic,
      exampleEn,
      exampleFr,
      exampleDari,
      sourceRef,
      extra,
    ] = t;

    return {
      id: `${prefix}-${idx + 1}`,
      category,
      level,
      wordEn,
      phoneticEn,
      partOfSpeech,
      meaningEn,
      meaningFr,
      meaningDari,
      dariPhonetic,
      exampleEn,
      exampleFr,
      exampleDari,
      sourceRef: sourceRef || extra?.sourceRef || defaultSourceByLevel[level],
      ...(extra?.verbForms ? { verbForms: extra.verbForms } : {}),
      ...(extra?.prepositionHighlight
        ? { prepositionHighlight: extra.prepositionHighlight }
        : {}),
      ...(extra?.usageTipFr ? { usageTipFr: extra.usageTipFr } : {}),
      ...(extra?.usageTipDari ? { usageTipDari: extra.usageTipDari } : {}),
      ...(extra?.commonMistake ? { commonMistake: extra.commonMistake } : {}),
    };
  });
}

