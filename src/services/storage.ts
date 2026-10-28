import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserStats } from '../types/phrase';
import { ThemeMode } from '../theme/colors';

const KEYS = {
  FAVORITES: '@learnefd_favorites',
  STATS: '@learnefd_user_stats',
  SETTINGS: '@learnefd_settings',
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
};
