import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserStats } from '../types/phrase';
import { GrammarUserProgress } from '../types/grammar';
import { VocabularyUserProgress } from '../types/vocabulary';
import { ThemeMode } from '../theme/colors';

const KEYS = {
  FAVORITES: '@learnefd_favorites',
  STATS: '@learnefd_user_stats',
  SETTINGS: '@learnefd_settings',
  GRAMMAR_PROGRESS: '@learnefd_grammar_progress',
  VOCABULARY_PROGRESS: '@learnefd_vocabulary_progress',
};

const DEFAULT_GRAMMAR_PROGRESS: GrammarUserProgress = {
  completedLessonIds: [],
  lessonScores: {},
  masteredRuleIds: [],
};

const DEFAULT_VOCABULARY_PROGRESS: VocabularyUserProgress = {
  masteredWordIds: [],
  reviewWordIds: [],
  deckScores: {},
};

export interface AppSettings {
  showPhonetics: boolean;
  speechRate: number;
  darkMode: boolean;
  themeMode: ThemeMode;
  fontSizeDelta: number;
}

const DEFAULT_SETTINGS: AppSettings = {
  showPhonetics: true,
  speechRate: 0.9,
  darkMode: false,
  themeMode: 'book',
  fontSizeDelta: 0,
};

const DEFAULT_STATS: UserStats = {
  streakDays: 1,
  lastStudyDate: new Date().toISOString().split('T')[0],
  masteredPhraseIds: [],
  reviewPhraseIds: [],
  quizHighScore: 0,
  totalQuizzesTaken: 0,
};

export const StorageService = {
  async getFavorites(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async toggleFavorite(phraseId: string): Promise<string[]> {
    try {
      const favs = await this.getFavorites();
      const exists = favs.includes(phraseId);
      const updated = exists ? favs.filter((id) => id !== phraseId) : [...favs, phraseId];
      await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  async getStats(): Promise<UserStats> {
    try {
      const data = await AsyncStorage.getItem(KEYS.STATS);
      if (!data) return DEFAULT_STATS;
      const stats: UserStats = JSON.parse(data);

      // Check daily streak
      const today = new Date().toISOString().split('T')[0];
      if (stats.lastStudyDate && stats.lastStudyDate !== today) {
        const last = new Date(stats.lastStudyDate);
        const curr = new Date(today);
        const diffDays = Math.round((curr.getTime() - last.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          stats.streakDays += 1;
        } else if (diffDays > 1) {
          stats.streakDays = 1;
        }
        stats.lastStudyDate = today;
        await AsyncStorage.setItem(KEYS.STATS, JSON.stringify(stats));
      }
      return stats;
    } catch {
      return DEFAULT_STATS;
    }
  },

  async markPhraseStatus(phraseId: string, mastered: boolean): Promise<UserStats> {
    const stats = await this.getStats();
    if (mastered) {
      stats.masteredPhraseIds = Array.from(new Set([...stats.masteredPhraseIds, phraseId]));
      stats.reviewPhraseIds = stats.reviewPhraseIds.filter((id) => id !== phraseId);
    } else {
      stats.reviewPhraseIds = Array.from(new Set([...stats.reviewPhraseIds, phraseId]));
      stats.masteredPhraseIds = stats.masteredPhraseIds.filter((id) => id !== phraseId);
    }
    await AsyncStorage.setItem(KEYS.STATS, JSON.stringify(stats));
    return stats;
  },

  async recordQuizScore(score: number): Promise<UserStats> {
    const stats = await this.getStats();
    stats.totalQuizzesTaken += 1;
    if (score > stats.quizHighScore) {
      stats.quizHighScore = score;
    }
    await AsyncStorage.setItem(KEYS.STATS, JSON.stringify(stats));
    return stats;
  },

  async getSettings(): Promise<AppSettings> {
    try {
      const data = await AsyncStorage.getItem(KEYS.SETTINGS);
      if (!data) return DEFAULT_SETTINGS;
      const parsed = JSON.parse(data);
      let themeMode: ThemeMode = parsed.themeMode;
      if (!themeMode) {
        themeMode = parsed.darkMode ? 'dark' : 'book';
      }
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        themeMode,
        darkMode: themeMode === 'dark',
        fontSizeDelta: typeof parsed.fontSizeDelta === 'number' ? parsed.fontSizeDelta : 0,
      };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  async updateSettings(partial: Partial<AppSettings>): Promise<AppSettings> {
    try {
      const current = await this.getSettings();
      const updated = { ...current, ...partial };
      await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated));
      return updated;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  async getGrammarProgress(): Promise<GrammarUserProgress> {
    try {
      const data = await AsyncStorage.getItem(KEYS.GRAMMAR_PROGRESS);
      return data ? JSON.parse(data) : DEFAULT_GRAMMAR_PROGRESS;
    } catch {
      return DEFAULT_GRAMMAR_PROGRESS;
    }
  },

  async markGrammarLessonComplete(lessonId: string): Promise<GrammarUserProgress> {
    try {
      const progress = await this.getGrammarProgress();
      if (!progress.completedLessonIds.includes(lessonId)) {
        progress.completedLessonIds = [...progress.completedLessonIds, lessonId];
        await AsyncStorage.setItem(KEYS.GRAMMAR_PROGRESS, JSON.stringify(progress));
      }
      return progress;
    } catch {
      return DEFAULT_GRAMMAR_PROGRESS;
    }
  },

  async recordGrammarScore(lessonId: string, score: number, total: number): Promise<GrammarUserProgress> {
    try {
      const progress = await this.getGrammarProgress();
      const today = new Date().toISOString().split('T')[0];
      const prev = progress.lessonScores[lessonId];
      // Keep best score or update
      if (!prev || score >= prev.score) {
        progress.lessonScores[lessonId] = { score, total, date: today };
      }
      if (!progress.completedLessonIds.includes(lessonId) && score >= Math.ceil(total * 0.7)) {
        progress.completedLessonIds = [...progress.completedLessonIds, lessonId];
      }
      await AsyncStorage.setItem(KEYS.GRAMMAR_PROGRESS, JSON.stringify(progress));
      return progress;
    } catch {
      return DEFAULT_GRAMMAR_PROGRESS;
    }
  },

  async getVocabularyProgress(): Promise<VocabularyUserProgress> {
    try {
      const data = await AsyncStorage.getItem(KEYS.VOCABULARY_PROGRESS);
      return data ? JSON.parse(data) : DEFAULT_VOCABULARY_PROGRESS;
    } catch {
      return DEFAULT_VOCABULARY_PROGRESS;
    }
  },

  async markVocabularyWordStatus(wordId: string, mastered: boolean): Promise<VocabularyUserProgress> {
    try {
      const progress = await this.getVocabularyProgress();
      if (mastered) {
        progress.masteredWordIds = Array.from(new Set([...progress.masteredWordIds, wordId]));
        progress.reviewWordIds = progress.reviewWordIds.filter((id) => id !== wordId);
      } else {
        progress.reviewWordIds = Array.from(new Set([...progress.reviewWordIds, wordId]));
        progress.masteredWordIds = progress.masteredWordIds.filter((id) => id !== wordId);
      }
      await AsyncStorage.setItem(KEYS.VOCABULARY_PROGRESS, JSON.stringify(progress));
      return progress;
    } catch {
      return DEFAULT_VOCABULARY_PROGRESS;
    }
  },

  async recordVocabularyDeckScore(
    deckId: string,
    score: number,
    total: number
  ): Promise<VocabularyUserProgress> {
    try {
      const progress = await this.getVocabularyProgress();
      const today = new Date().toISOString().split('T')[0];
      const prev = progress.deckScores[deckId];
      if (!prev || score >= prev.score) {
        progress.deckScores[deckId] = { score, total, date: today };
      }
      await AsyncStorage.setItem(KEYS.VOCABULARY_PROGRESS, JSON.stringify(progress));
      return progress;
    } catch {
      return DEFAULT_VOCABULARY_PROGRESS;
    }
  },
};
