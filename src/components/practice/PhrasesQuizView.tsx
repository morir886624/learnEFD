import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Award, CheckCircle2, RotateCcw, Volume2, XCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useApp } from '../../context/AppContext';
import { PHRASES } from '../../data/phrases';
import { Level, Phrase } from '../../types/phrase';
import { LevelBadge } from '../common/Badge';
import { SpeechService } from '../../services/speech';

interface Question {
  phrase: Phrase;
  promptLang: 'fr' | 'en' | 'dari';
  targetLang: 'fr' | 'en' | 'dari';
  promptText: string;
  options: {
    text: string;
    isCorrect: boolean;
    secondaryText?: string;
  }[];
}

const TOTAL_QUESTIONS_PER_ROUND = 8;

function generateQuizQuestions(lvl: Level | 'ALL', showPhonetics: boolean): Question[] {
  const pool = PHRASES.filter((p) => lvl === 'ALL' || p.level === lvl);
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  const roundPhrases = shuffled.slice(0, Math.min(TOTAL_QUESTIONS_PER_ROUND, shuffled.length));

  return roundPhrases.map((phrase) => {
    const modes: { prompt: 'fr' | 'en'; target: 'dari' | 'fr' | 'en' }[] = [
      { prompt: 'fr', target: 'dari' },
      { prompt: 'en', target: 'fr' },
      { prompt: 'fr', target: 'en' },
    ];
    const mode = modes[Math.floor(Math.random() * modes.length)];

    const correctText =
      mode.target === 'dari' ? phrase.dari : mode.target === 'en' ? phrase.en : phrase.fr;
    const promptText = mode.prompt === 'fr' ? phrase.fr : phrase.en;

    const otherPhrases = pool.filter((p) => p.id !== phrase.id);
    const shuffledOthers = [...otherPhrases].sort(() => 0.5 - Math.random()).slice(0, 3);

    const options = [
      {
        text: correctText,
        isCorrect: true,
        secondaryText: mode.target === 'dari' && showPhonetics ? phrase.dariPhonetic : undefined,
      },
      ...shuffledOthers.map((p) => ({
        text: mode.target === 'dari' ? p.dari : mode.target === 'en' ? p.en : p.fr,
        isCorrect: false,
        secondaryText: mode.target === 'dari' && showPhonetics ? p.dariPhonetic : undefined,
      })),
    ].sort(() => 0.5 - Math.random());

    return {
      phrase,
      promptLang: mode.prompt,
      targetLang: mode.target,
      promptText,
      options,
    };
  });
}

export const PhrasesQuizView: React.FC = () => {
  const { themeColors, recordQuizScore, settings } = useApp();

  const [selectedLevel, setSelectedLevel] = useState<Level | 'ALL'>('B1');
  const [questions, setQuestions] = useState<Question[]>(() =>
    generateQuizQuestions('B1', settings.showPhonetics)
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const startQuiz = (lvl: Level | 'ALL' = selectedLevel) => {
    setQuestions(generateQuizQuestions(lvl, settings.showPhonetics));
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setScore(0);
    setIsQuizCompleted(false);
  };

  const handleSelectLevel = (lvl: Level | 'ALL') => {
    setSelectedLevel(lvl);
    startQuiz(lvl);
  };

  const currentQuestion = questions[currentQuestionIndex];

  const handleSelectOption = async (optionIdx: number) => {
    if (selectedOptionIndex !== null || !currentQuestion) return;

    setSelectedOptionIndex(optionIdx);
    const isCorrect = currentQuestion.options[optionIdx].isCorrect;

    try {
      if (isCorrect) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setScore((prev) => prev + 1);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch {
      // Ignore
    }
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
    } else {
      setIsQuizCompleted(true);
      await recordQuizScore(score);
    }
  };

  const speakPrompt = (text: string, lang: 'fr' | 'en' | 'dari') => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Ignore
    }
    SpeechService.speak(text, lang);
  };

  return (
    <View style={styles.container}>
      {/* LEVEL SELECTOR */}
      <View style={styles.levelRow}>
        {(['ALL', 'A1', 'A2', 'B1'] as const).map((lvl) => {
          const isSelected = selectedLevel === lvl;
          return (
            <TouchableOpacity
              key={lvl}
              activeOpacity={0.8}
              onPress={() => handleSelectLevel(lvl)}
              style={[
                styles.levelChip,
                {
                  backgroundColor: isSelected ? themeColors.primary : themeColors.surface,
                  borderColor: isSelected ? themeColors.primary : themeColors.cardBorder,
                },
              ]}
            >
              <Text
                style={[
                  styles.levelChipText,
                  {
                    color: isSelected ? '#FFFFFF' : themeColors.textSecondary,
                    fontWeight: isSelected ? '800' : '600',
                  },
                ]}
              >
                {lvl === 'ALL' ? 'Tous Niveaux' : lvl}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* QUIZ INTERFACE */}
      {isQuizCompleted ? (
        <View
          style={[
            styles.completedCard,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.cardBorder,
            },
          ]}
        >
          <Award size={48} color={themeColors.primary} />
          <Text style={[styles.completedTitle, { color: themeColors.textPrimary }]}>
            Partie Terminée !
          </Text>
          <Text style={[styles.scoreText, { color: themeColors.primary }]}>
            {score} / {questions.length}
          </Text>
          <Text style={[styles.completedSubtitle, { color: themeColors.textSecondary }]}>
            {score === questions.length
              ? 'Score parfait ! Votre maîtrise est impressionnante.'
              : score >= questions.length / 2
              ? 'Bon travail ! Continuez votre pratique quotidienne.'
              : 'N’hésitez pas à réviser le mode Flashcards pour vous améliorer.'}
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => startQuiz(selectedLevel)}
            style={[styles.retryBtn, { backgroundColor: themeColors.primary }]}
          >
            <RotateCcw size={18} color="#FFFFFF" />
            <Text style={styles.retryBtnText}>Rejouer un round</Text>
          </TouchableOpacity>
        </View>
      ) : (
        currentQuestion && (
          <View style={styles.quizBox}>
            {/* PROGRESS BAR */}
            <View style={styles.progressContainer}>
              <View style={styles.progressInfo}>
                <Text style={[styles.qCounter, { color: themeColors.textSecondary }]}>
                  Question {currentQuestionIndex + 1} / {questions.length}
                </Text>
                <Text style={[styles.currentScore, { color: themeColors.primary }]}>
                  Score: {score}
                </Text>
              </View>
              <View
                style={[
                  styles.track,
                  { backgroundColor: themeColors.surfaceSubtle },
                ]}
              >
                <View
                  style={[
                    styles.fill,
                    {
                      width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                      backgroundColor: themeColors.primary,
                    },
                  ]}
                />
              </View>
            </View>

            {/* PROMPT CARD */}
            <View
              style={[
                styles.promptCard,
                {
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.cardBorder,
                },
              ]}
            >
              <View style={styles.promptMeta}>
                <LevelBadge level={currentQuestion.phrase.level} />
                <Text style={[styles.langPromptLabel, { color: themeColors.textMuted }]}>
                  Traduire en{' '}
                  {currentQuestion.targetLang === 'dari'
                    ? 'دری (Dari)'
                    : currentQuestion.targetLang === 'en'
                    ? 'English'
                    : 'Français'}
                </Text>
              </View>

              <View style={styles.promptTextRow}>
                <Text
                  style={[
                    styles.promptText,
                    { color: themeColors.textPrimary },
                    currentQuestion.promptLang === 'dari' && styles.dariPromptText,
                  ]}
                >
                  {currentQuestion.promptText}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    speakPrompt(
                      currentQuestion.promptText,
                      currentQuestion.promptLang
                    )
                  }
                  style={[
                    styles.audioBtn,
                    { backgroundColor: themeColors.primaryLight },
                  ]}
                >
                  <Volume2 size={20} color={themeColors.primary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* OPTIONS */}
            <View style={styles.optionsList}>
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedOptionIndex === idx;
                const showResult = selectedOptionIndex !== null;
                const isCorrect = opt.isCorrect;

                let optBg = themeColors.surface;
                let optBorder = themeColors.cardBorder;
                let optTextColor = themeColors.textPrimary;

                if (showResult) {
                  if (isCorrect) {
                    optBg = '#DCFCE7';
                    optBorder = '#16A34A';
                    optTextColor = '#15803D';
                  } else if (isSelected) {
                    optBg = '#FEE2E2';
                    optBorder = '#EF4444';
                    optTextColor = '#B91C1C';
                  }
                }

                return (
                  <TouchableOpacity
                    key={idx}
                    disabled={showResult}
                    activeOpacity={0.8}
                    onPress={() => handleSelectOption(idx)}
                    style={[
                      styles.optionCard,
                      {
                        backgroundColor: optBg,
                        borderColor: optBorder,
                      },
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.optionText,
                          { color: optTextColor },
                          currentQuestion.targetLang === 'dari' && styles.dariOptionText,
                        ]}
                      >
                        {opt.text}
                      </Text>
                      {opt.secondaryText && (
                        <Text style={[styles.optPhonetic, { color: themeColors.textMuted }]}>
                          {opt.secondaryText}
                        </Text>
                      )}
                    </View>

                    {showResult && (
                      <View style={styles.resultIcon}>
                        {isCorrect ? (
                          <CheckCircle2 size={20} color="#16A34A" />
                        ) : isSelected ? (
                          <XCircle size={20} color="#EF4444" />
                        ) : null}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* NEXT BUTTON */}
            {selectedOptionIndex !== null && (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleNextQuestion}
                style={[styles.nextBtn, { backgroundColor: themeColors.primary }]}
              >
                <Text style={styles.nextBtnText}>
                  {currentQuestionIndex < questions.length - 1
                    ? 'Question Suivante →'
                    : 'Voir les résultats 🏆'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  levelRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  levelChip: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  levelChipText: {
    fontSize: 12,
  },
  quizBox: {
    width: '100%',
  },
  progressContainer: {
    marginBottom: 14,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  qCounter: {
    fontSize: 12,
    fontWeight: '700',
  },
  currentScore: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  track: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  promptCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  promptMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  langPromptLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  promptTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  promptText: {
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 24,
  },
  dariPromptText: {
    textAlign: 'right',
    fontSize: 18,
  },
  audioBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsList: {
    gap: 10,
    marginBottom: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
  },
  optionText: {
    fontSize: 14.5,
    fontWeight: '700',
    lineHeight: 20,
  },
  dariOptionText: {
    textAlign: 'right',
    fontSize: 16,
  },
  optPhonetic: {
    fontSize: 11.5,
    marginTop: 2,
  },
  resultIcon: {
    marginLeft: 8,
  },
  nextBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
  },
  completedCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  completedTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginTop: 12,
    marginBottom: 4,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: '900',
    marginVertical: 8,
  },
  completedSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
    maxWidth: 280,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 14,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});

