import { FRENCH_VOCABULARY_DECKS } from './decks';
import { DAILY_AND_LIVING_VOCABULARY } from './items/dailyAndLiving';
import { TRAVEL_WORK_TECH_VOCABULARY } from './items/travelWorkTech';
import { ADVANCED_AND_IDIOMS_VOCABULARY } from './items/advancedAndIdioms';
import { FRENCH_VOCABULARY_EXERCISES } from './exercises';
import {
  FrenchVocabularyCategory,
  FrenchVocabularyItem,
  FrenchVocabularyLevel,
} from '../../types/frenchVocabulary';

export const ALL_FRENCH_VOCABULARY_ITEMS: FrenchVocabularyItem[] = [
  ...DAILY_AND_LIVING_VOCABULARY,
  ...TRAVEL_WORK_TECH_VOCABULARY,
  ...ADVANCED_AND_IDIOMS_VOCABULARY,
];

export {
  FRENCH_VOCABULARY_DECKS,
  FRENCH_VOCABULARY_EXERCISES,
};

export const getFrenchVocabularyByCategory = (
  category: FrenchVocabularyCategory | 'ALL'
): FrenchVocabularyItem[] => {
  if (category === 'ALL') return ALL_FRENCH_VOCABULARY_ITEMS;
  return ALL_FRENCH_VOCABULARY_ITEMS.filter((item) => item.category === category);
};

export const getFrenchExercisesForCategory = (
  category: FrenchVocabularyCategory | 'ALL'
) => {
  if (category === 'ALL') return FRENCH_VOCABULARY_EXERCISES;
  return FRENCH_VOCABULARY_EXERCISES.filter((ex) => ex.category === category);
};

export const filterFrenchVocabularyItems = (
  category: FrenchVocabularyCategory | 'ALL',
  level: FrenchVocabularyLevel | 'ALL',
  searchTerm: string
): FrenchVocabularyItem[] => {
  return ALL_FRENCH_VOCABULARY_ITEMS.filter((item) => {
    if (category !== 'ALL' && item.category !== category) return false;
    if (level !== 'ALL' && item.level !== level) return false;
    if (searchTerm.trim().length > 0) {
      const q = searchTerm.toLowerCase().trim();
      const matchFr = item.wordFr.toLowerCase().includes(q);
      const matchEn = item.meaningEn.toLowerCase().includes(q);
      const matchDari = item.meaningDari.includes(q);
      const matchEx = item.exampleFr.toLowerCase().includes(q);
      return matchFr || matchEn || matchDari || matchEx;
    }
    return true;
  });
};

