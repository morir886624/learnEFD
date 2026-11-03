import {
  VocabularyCategory,
  VocabularyDeck,
  VocabularyExercise,
  VocabularyItem,
  VocabularyLevel,
} from '../../types/vocabulary';
import { VOCABULARY_DECKS } from './decks';
import { PHRASAL_VERBS_AND_IRREGULARS } from './phrasalVerbsAndIrregulars';
import { COLLOCATIONS_AND_IDIOMS } from './collocationsAndIdioms';
import { LEXICAL_NUANCES_ITEMS } from './lexicalNuances';
import { EN_A1_VOCABULARY } from './levels/a1';
import { EN_A2_VOCABULARY } from './levels/a2';
import { EN_B1_VOCABULARY } from './levels/b1';
import { EN_B2_VOCABULARY } from './levels/b2';
import { VOCABULARY_EXERCISES } from './exercises';

export { VOCABULARY_DECKS, VOCABULARY_EXERCISES };

const RAW_VOCABULARY_ITEMS: VocabularyItem[] = [
  ...PHRASAL_VERBS_AND_IRREGULARS,
  ...COLLOCATIONS_AND_IDIOMS,
  ...LEXICAL_NUANCES_ITEMS,
  ...EN_A1_VOCABULARY,
  ...EN_A2_VOCABULARY,
  ...EN_B1_VOCABULARY,
  ...EN_B2_VOCABULARY,
];

const seenEnKeys = new Set<string>();
export const ALL_VOCABULARY_ITEMS: VocabularyItem[] = RAW_VOCABULARY_ITEMS.filter(
  (item) => {
    const key = `${item.level}:${item.wordEn.trim().toLowerCase()}`;
    if (seenEnKeys.has(key)) return false;
    seenEnKeys.add(key);
    return true;
  }
);

export const getVocabularyDeckById = (
  category: VocabularyCategory
): VocabularyDeck | undefined => {
  return VOCABULARY_DECKS.find((deck) => deck.id === category);
};

export const getVocabularyByCategory = (
  category: VocabularyCategory | 'ALL'
): VocabularyItem[] => {
  if (category === 'ALL') return ALL_VOCABULARY_ITEMS;
  return ALL_VOCABULARY_ITEMS.filter((item) => item.category === category);
};

export const filterVocabularyItems = (
  category: VocabularyCategory | 'ALL',
  level: VocabularyLevel | 'ALL',
  searchQuery: string
): VocabularyItem[] => {
  const q = searchQuery.trim().toLowerCase();
  return ALL_VOCABULARY_ITEMS.filter((item) => {
    const matchesCategory = category === 'ALL' || item.category === category;
    const matchesLevel = level === 'ALL' || item.level === level;
    if (!matchesCategory || !matchesLevel) return false;
    if (!q) return true;
    return (
      item.wordEn.toLowerCase().includes(q) ||
      item.meaningFr.toLowerCase().includes(q) ||
      item.meaningEn.toLowerCase().includes(q) ||
      item.meaningDari.includes(q) ||
      item.exampleEn.toLowerCase().includes(q) ||
      item.sourceRef.toLowerCase().includes(q)
    );
  });
};

export const getExercisesForCategory = (
  category: VocabularyCategory | 'ALL'
): VocabularyExercise[] => {
  if (category === 'ALL') return VOCABULARY_EXERCISES;
  return VOCABULARY_EXERCISES.filter((ex) => ex.category === category);
};

