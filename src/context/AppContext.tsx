import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppSettings, StorageService } from '../services/storage';
import { UserStats } from '../types/phrase';
import { GrammarUserProgress } from '../types/grammar';
import { VocabularyUserProgress } from '../types/vocabulary';
import { colors, ThemeColors, ThemeMode } from '../theme/colors';

interface AppContextValue {
  settings: AppSettings;
  stats: UserStats;
  favorites: string[];
  grammarProgress: GrammarUserProgress;
  vocabularyProgress: VocabularyUserProgress;
  themeColors: ThemeColors;
  themeMode: ThemeMode;
  fontSizeDelta: number;
  isDark: boolean;
  isLoading: boolean;
  toggleFavorite: (phraseId: string) => Promise<void>;
  markPhrase: (phraseId: string, mastered: boolean) => Promise<void>;
  recordQuizScore: (score: number) => Promise<void>;
  markGrammarLessonComplete: (lessonId: string) => Promise<void>;
  recordGrammarScore: (lessonId: string, score: number, total: number) => Promise<void>;
  markVocabularyWord: (wordId: string, mastered: boolean) => Promise<void>;
  recordVocabularyDeckScore: (deckId: string, score: number, total: number) => Promise<void>;
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
  const [grammarProgress, setGrammarProgress] = useState<GrammarUserProgress>({
    completedLessonIds: [],
    lessonScores: {},
    masteredRuleIds: [],
  });
  const [vocabularyProgress, setVocabularyProgress] = useState<VocabularyUserProgress>({
    masteredWordIds: [],
    reviewWordIds: [],
    deckScores: {},
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [loadedSettings, loadedStats, loadedFavorites, loadedGrammar, loadedVocab] =
          await Promise.all([
            StorageService.getSettings(),
            StorageService.getStats(),
            StorageService.getFavorites(),
            StorageService.getGrammarProgress(),
            StorageService.getVocabularyProgress(),
          ]);
        setSettings(loadedSettings);
        setStats(loadedStats);
        setFavorites(loadedFavorites);
        setGrammarProgress(loadedGrammar);
        setVocabularyProgress(loadedVocab);
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

  const markGrammarLessonComplete = async (lessonId: string) => {
    const updated = await StorageService.markGrammarLessonComplete(lessonId);
    setGrammarProgress(updated);
  };

  const recordGrammarScore = async (lessonId: string, score: number, total: number) => {
    const updated = await StorageService.recordGrammarScore(lessonId, score, total);
    setGrammarProgress(updated);
  };

  const markVocabularyWord = async (wordId: string, mastered: boolean) => {
    const updated = await StorageService.markVocabularyWordStatus(wordId, mastered);
    setVocabularyProgress(updated);
  };

  const recordVocabularyDeckScore = async (deckId: string, score: number, total: number) => {
    const updated = await StorageService.recordVocabularyDeckScore(deckId, score, total);
    setVocabularyProgress(updated);
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
        grammarProgress,
        markGrammarLessonComplete,
        recordGrammarScore,
        vocabularyProgress,
        markVocabularyWord,
        recordVocabularyDeckScore,
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
