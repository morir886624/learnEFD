import { CategoryId, Level, Phrase } from '../../types/phrase';
import { ALL_VOCABULARY_ITEMS } from '../vocabulary';
import { ALL_FRENCH_VOCABULARY_ITEMS } from '../frenchVocabulary';
import { VocabularyCategory } from '../../types/vocabulary';
import { FrenchVocabularyCategory } from '../../types/frenchVocabulary';

/**
 * Compact tuple for Phrase:
 * [0] category: Exclude<CategoryId, 'all'>
 * [1] fr: string
 * [2] en: string
 * [3] dari: string
 * [4] dariPhonetic: string
 * [5] literalOrNote?: string
 * [6] tags?: string[]
 */
export type PhraseTuple = [
  Exclude<CategoryId, 'all'>,
  string,
  string,
  string,
  string,
  string?,
  string[]?,
];

export function buildPhrases(
  level: Level,
  prefix: string,
  tuples: PhraseTuple[]
): Phrase[] {
  return tuples.map((t, idx) => {
    const [category, fr, en, dari, dariPhonetic, literalOrNote, tags] = t;
    return {
      id: `${prefix}-${idx + 1}`,
      level,
      category,
      fr,
      en,
      dari,
      dariPhonetic,
      ...(literalOrNote ? { literalOrNote } : {}),
      ...(tags ? { tags } : {}),
    };
  });
}

const FR_CAT_TO_PHRASE_CAT: Record<
  FrenchVocabularyCategory,
  Exclude<CategoryId, 'all'>
> = {
  'feelings-mind': 'social',
  'relationships-social': 'greetings',
  'home-daily': 'daily',
  'travel-transports': 'travel',
  'work-science-health': 'work',
  'leisure-technology': 'daily',
  'food-gastronomy': 'food',
  'transitions-discourse': 'social',
  'verb-prepositions': 'daily',
  'false-cognates': 'social',
  'idioms-conversation': 'social',
};

const EN_CAT_TO_PHRASE_CAT: Record<
  VocabularyCategory,
  Exclude<CategoryId, 'all'>
> = {
  'phrasal-verbs': 'daily',
  'irregular-verbs': 'daily',
  'adj-prepositions': 'social',
  'verb-prepositions': 'work',
  'noun-idioms': 'travel',
  'uncountable-nouns': 'shopping',
  'stative-mental': 'social',
  'participial-adjectives': 'social',
  'confusable-pairs': 'admin',
  'connectors-academic': 'work',
};

function cleanFrHeadword(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .replace(/\s*\+\s*inf\.?/g, '')
    .replace(/^(un|une|le|la|les|du|de la|des)\s+/i, '')
    .replace(/^(l'|l’|s'|s’|se\s+)/i, '')
    .trim();
}

function cleanEnHeadword(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .split(/[•/]|vs\.?/)[0]
    .trim();
}

/**
 * Ensures 100% of English and French vocabulary words of `level`
 * are covered by the phrases of the same level.
 */
export function ensureFullLevelWordCoverage(
  level: Level,
  basePhrases: Phrase[]
): Phrase[] {
  const result: Phrase[] = [...basePhrases];
  const seenSentencePairs = new Set<string>();

  let frCorpus = '';
  let enCorpus = '';

  for (const p of basePhrases) {
    const key = `${p.fr.trim().toLowerCase()}|${p.en.trim().toLowerCase()}`;
    seenSentencePairs.add(key);
    frCorpus += ' ' + p.fr.toLowerCase();
    enCorpus += ' ' + p.en.toLowerCase();
  }

  // 1. Check all French vocabulary items of this level
  const frItems = ALL_FRENCH_VOCABULARY_ITEMS.filter((i) => i.level === level);
  let frAddedIdx = 1;
  for (const item of frItems) {
    const targetFr = cleanFrHeadword(item.wordFr);
    const pairKey = `${item.exampleFr.trim().toLowerCase()}|${item.exampleEn.trim().toLowerCase()}`;
    if (seenSentencePairs.has(pairKey)) continue;

    const isCovered = targetFr.length >= 2 && frCorpus.includes(targetFr);
    if (!isCovered) {
      seenSentencePairs.add(pairKey);
      frCorpus += ' ' + item.exampleFr.toLowerCase() + ' ' + targetFr;
      enCorpus += ' ' + item.exampleEn.toLowerCase();

      result.push({
        id: `fr-cov-${level.toLowerCase()}-${frAddedIdx++}`,
        level,
        category: FR_CAT_TO_PHRASE_CAT[item.category] || 'daily',
        fr: item.exampleFr,
        en: item.exampleEn,
        dari: item.exampleDari,
        dariPhonetic: item.dariPhonetic
          ? `${item.wordFr} • ${item.dariPhonetic}`
          : item.wordFr,
        literalOrNote: `Terme clé (${level}) : « ${item.wordFr} » (${item.partOfSpeech}) = ${item.meaningEn} • ${item.meaningDari}${item.usageTipFr ? ` — ${item.usageTipFr}` : ''}`,
        tags: [item.wordFr, item.category, level],
      });
    }
  }

  // 2. Check all English vocabulary items of this level
  const enItems = ALL_VOCABULARY_ITEMS.filter((i) => i.level === level);
  let enAddedIdx = 1;
  for (const item of enItems) {
    const targetEn = cleanEnHeadword(item.wordEn);
    const pairKey = `${item.exampleFr.trim().toLowerCase()}|${item.exampleEn.trim().toLowerCase()}`;
    if (seenSentencePairs.has(pairKey)) continue;

    const isCovered = targetEn.length >= 2 && enCorpus.includes(targetEn);
    if (!isCovered) {
      seenSentencePairs.add(pairKey);
      frCorpus += ' ' + item.exampleFr.toLowerCase();
      enCorpus += ' ' + item.exampleEn.toLowerCase() + ' ' + targetEn;

      result.push({
        id: `en-cov-${level.toLowerCase()}-${enAddedIdx++}`,
        level,
        category: EN_CAT_TO_PHRASE_CAT[item.category] || 'daily',
        fr: item.exampleFr,
        en: item.exampleEn,
        dari: item.exampleDari,
        dariPhonetic: item.dariPhonetic
          ? `${item.wordEn} • ${item.dariPhonetic}`
          : item.wordEn,
        literalOrNote: `Mot clé (${level}) : « ${item.wordEn} » (${item.partOfSpeech}) = ${item.meaningFr} • ${item.meaningDari}${item.usageTipFr ? ` — ${item.usageTipFr}` : ''}`,
        tags: [item.wordEn, item.category, level],
      });
    }
  }

  return result;
}

