import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppSettings, StorageService } from '../services/storage';
import { UserStats } from '../types/phrase';
import { colors, ThemeColors, ThemeMode } from '../theme/colors';

interface AppContextValue {
  settings: AppSettings;
  stats: UserStats;
  favorites: string[];
  themeColors: ThemeColors;
  themeMode: ThemeMode;
  fontSizeDelta: number;
  isDark: boolean;
  isLoading: boolean;
  toggleFavorite: (phraseId: string) => Promise<void>;
  markPhrase: (phraseId: string, mastered: boolean) => Promise<void>;
  recordQuizScore: (score: number) => Promise<void>;
  updateSettings: (partial: Partial<AppSettings>) => Promise<void>;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  setFontSizeDelta: (delta: number) => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>({
    showPhonetics: true,
    speechRate: 0.9,
    darkMode: false,
    themeMode: 'book',
    fontSizeDelta: 0,
  });
  const [stats, setStats] = useState<UserStats>({
    streakDays: 1,
    lastStudyDate: null,
    masteredPhraseIds: [],
    reviewPhraseIds: [],
    quizHighScore: 0,
    totalQuizzesTaken: 0,
  });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [loadedSettings, loadedStats, loadedFavorites] = await Promise.all([
          StorageService.getSettings(),
          StorageService.getStats(),
          StorageService.getFavorites(),
        ]);
        setSettings(loadedSettings);
        setStats(loadedStats);
        setFavorites(loadedFavorites);
      } catch (e) {
        console.error('Error loading data:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  const toggleFavorite = async (phraseId: string) => {
    const updated = await StorageService.toggleFavorite(phraseId);
    setFavorites(updated);
  };

  const markPhrase = async (phraseId: string, mastered: boolean) => {
    const updatedStats = await StorageService.markPhraseStatus(phraseId, mastered);
    setStats(updatedStats);
  };

  const recordQuizScore = async (score: number) => {
    const updatedStats = await StorageService.recordQuizScore(score);
    setStats(updatedStats);
  };

  const updateSettings = async (partial: Partial<AppSettings>) => {
    const updated = await StorageService.updateSettings(partial);
    setSettings(updated);
  };

  const setThemeMode = async (mode: ThemeMode) => {
    await updateSettings({ themeMode: mode, darkMode: mode === 'dark' });
  };

  const setFontSizeDelta = async (delta: number) => {
    await updateSettings({ fontSizeDelta: delta });
  };

  const themeMode: ThemeMode = settings.themeMode || (settings.darkMode ? 'dark' : 'book');
  const themeColors: ThemeColors = colors[themeMode] || colors.book;
  const isDark = themeMode === 'dark';
  const fontSizeDelta = settings.fontSizeDelta ?? 0;

  return (
    <AppContext.Provider
      value={{
        settings,
        stats,
        favorites,
        themeColors,
        themeMode,
        fontSizeDelta,
        isDark,
        isLoading,
        toggleFavorite,
        markPhrase,
        recordQuizScore,
        updateSettings,
        setThemeMode,
        setFontSizeDelta,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
