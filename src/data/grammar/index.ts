import { GRAMMAR_MODULES } from './modules';
import { TENSES_LESSONS } from './lessons/tenses';
import { MODALS_LESSONS } from './lessons/modals';
import { CONDITIONALS_LESSONS } from './lessons/conditionals';
import { PASSIVE_LESSONS } from './lessons/passive';
import { CLAUSES_LESSONS } from './lessons/clauses';
import { GERUNDS_LESSONS } from './lessons/gerunds';
import { NOUNS_ARTICLES_LESSONS } from './lessons/nounsArticles';
import { ADJECTIVES_ADVERBS_LESSONS } from './lessons/adjectivesAdverbs';
import { PREPOSITIONS_PHRASALS_LESSONS } from './lessons/prepositionsPhrasals';
import { TROUBLESOME_LESSONS } from './lessons/troublesome';
import { GrammarLesson, GrammarLevel, GrammarCategory } from '../../types/grammar';

export { GRAMMAR_MODULES };

export const ALL_GRAMMAR_LESSONS: GrammarLesson[] = [
  ...TENSES_LESSONS,
  ...MODALS_LESSONS,
  ...CONDITIONALS_LESSONS,
  ...PASSIVE_LESSONS,
  ...CLAUSES_LESSONS,
  ...GERUNDS_LESSONS,
  ...NOUNS_ARTICLES_LESSONS,
  ...ADJECTIVES_ADVERBS_LESSONS,
  ...PREPOSITIONS_PHRASALS_LESSONS,
  ...TROUBLESOME_LESSONS,
];

export function getLessonById(id: string): GrammarLesson | undefined {
  return ALL_GRAMMAR_LESSONS.find((l) => l.id === id);
}

export function getLessonsForModule(moduleId: string): GrammarLesson[] {
  return ALL_GRAMMAR_LESSONS.filter((l) => l.moduleId === moduleId);
}

export function filterLessons(query: {
  level?: GrammarLevel | 'ALL';
  category?: GrammarCategory | 'ALL';
  searchTerm?: string;
}): GrammarLesson[] {
  return ALL_GRAMMAR_LESSONS.filter((lesson) => {
    // Level filter
    if (query.level && query.level !== 'ALL' && lesson.level !== query.level) {
      return false;
    }

    // Category filter
    if (query.category && query.category !== 'ALL') {
      const parentModule = GRAMMAR_MODULES.find((m) => m.id === lesson.moduleId);
      if (parentModule && parentModule.category !== query.category) {
        return false;
      }
    }

    // Search term
    if (query.searchTerm && query.searchTerm.trim().length > 0) {
      const term = query.searchTerm.toLowerCase().trim();
      const inTitle =
        lesson.titleEn.toLowerCase().includes(term) ||
        lesson.titleFr.toLowerCase().includes(term) ||
        lesson.titleDari.toLowerCase().includes(term);
      const inSummary =
        lesson.summaryEn.toLowerCase().includes(term) ||
        lesson.summaryFr.toLowerCase().includes(term);
      const inRules = lesson.rules.some(
        (r) =>
          r.ruleEn.toLowerCase().includes(term) ||
          r.exampleEn.toLowerCase().includes(term) ||
          r.ruleFr.toLowerCase().includes(term)
      );
      if (!inTitle && !inSummary && !inRules) {
        return false;
      }
    }

    return true;
  });
}
