import { FrenchGrammarLesson, FrenchGrammarModule } from '../../types/frenchGrammar';
import { FRENCH_GRAMMAR_MODULES } from './modules';
import { FOUNDATIONS_LESSONS } from './lessons/foundations';
import { ARCHITECTURE_AND_PAST_LESSONS } from './lessons/architectureAndPast';
import { FUTURE_AND_MOODS_LESSONS } from './lessons/futureAndMoods';
import { PRONOUNS_AND_DISCOURSE_LESSONS } from './lessons/pronounsAndDiscourse';
import { MODIFIERS_AND_SOLVER_LESSONS } from './lessons/modifiersAndSolver';
import { FRENCH_VERB_TABLES } from './verbTables';

export const FRENCH_GRAMMAR_LESSONS: FrenchGrammarLesson[] = [
  ...FOUNDATIONS_LESSONS,
  ...ARCHITECTURE_AND_PAST_LESSONS,
  ...FUTURE_AND_MOODS_LESSONS,
  ...PRONOUNS_AND_DISCOURSE_LESSONS,
  ...MODIFIERS_AND_SOLVER_LESSONS,
];

export { FRENCH_GRAMMAR_MODULES, FRENCH_VERB_TABLES };

export function getFrenchLessonById(lessonId: string): FrenchGrammarLesson | undefined {
  return FRENCH_GRAMMAR_LESSONS.find((l) => l.id === lessonId);
}

export function getFrenchLessonsByModule(moduleId: string): FrenchGrammarLesson[] {
  return FRENCH_GRAMMAR_LESSONS.filter((l) => l.moduleId === moduleId);
}

export function getFrenchModuleById(moduleId: string): FrenchGrammarModule | undefined {
  return FRENCH_GRAMMAR_MODULES.find((m) => m.id === moduleId);
}

