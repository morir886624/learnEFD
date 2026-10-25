import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Award, CheckCircle2, RotateCcw, Volume2, XCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useApp } from '../../context/AppContext';
import { useResponsive } from '../../hooks/useResponsive';
import { PHRASES } from '../../data/phrases';
import { Level, Phrase } from '../../types/phrase';
import { LevelBadge } from '../../components/common/Badge';
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

export default function QuizScreen() {
  const { themeColors, recordQuizScore, settings } = useApp();
  const { contentMaxWidth } = useResponsive();

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

  const currentQ = questions[currentQuestionIndex];

  const handleSelectOption = (index: number) => {
    if (selectedOptionIndex !== null) return; // Already answered
    setSelectedOptionIndex(index);

    const isCorrect = currentQ.options[index].isCorrect;
    if (isCorrect) {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // Ignore
      }
      setScore((s) => s + 1);
    } else {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } catch {
        // Ignore
      }
    }
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
    } else {
      // Quiz finished
      const finalScore = score + (currentQ.options[selectedOptionIndex!]?.isCorrect ? 1 : 0);
      await recordQuizScore(finalScore);
      setIsQuizCompleted(true);
    }
  };

  const playPromptAudio = async () => {
    if (currentQ) {
      await SpeechService.speak(currentQ.promptText, currentQ.promptLang, settings.speechRate);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.container, { maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' }]}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: themeColors.textPrimary }]}>
            Quiz & Entraînement
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            {"Validez vos compétences jusqu'au niveau B1"}
          </Text>
        </View>

        {/* LEVEL CHIPS */}
        <View style={styles.filterRow}>
          {(['ALL', 'A1', 'A2', 'B1'] as const).map((lvl) => {
            const isSelected = selectedLevel === lvl;
            return (
              <TouchableOpacity
                key={lvl}
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
                    { color: isSelected ? '#FFFFFF' : themeColors.textSecondary },
                  ]}
                >
                  {lvl === 'ALL' ? 'Tous' : `Niveau ${lvl}`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* QUIZ COMPLETION SCREEN */}
        {isQuizCompleted ? (
          <View
            style={[
              styles.resultBox,
              { backgroundColor: themeColors.surface, borderColor: themeColors.cardBorder },
            ]}
          >
            <Award size={64} color="#F59E0B" />
            <Text style={[styles.resultTitle, { color: themeColors.textPrimary }]}>
              Résultat du Quiz
            </Text>
            <Text style={[styles.scoreBig, { color: themeColors.primary }]}>
              {score} / {questions.length}
            </Text>
            <Text style={[styles.resultMsg, { color: themeColors.textSecondary }]}>
              {score >= questions.length * 0.8
                ? '🌟 Excellent résultat ! Vos bases et expressions sont solides !'
                : '💪 Bon travail ! Révisez les flashcards pour consolider vos acquis.'}
            </Text>

            <TouchableOpacity
              onPress={() => startQuiz()}
              style={[styles.replayBtn, { backgroundColor: themeColors.primary }]}
            >
              <RotateCcw size={18} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.replayBtnText}>Faire un nouveau round</Text>
            </TouchableOpacity>
          </View>
        ) : currentQ ? (
          <View>
            {/* PROGRESS & LEVEL */}
            <View style={styles.qTopRow}>
              <LevelBadge level={currentQ.phrase.level} size="md" />
              <Text style={[styles.qCounter, { color: themeColors.textMuted }]}>
                Question {currentQuestionIndex + 1} / {questions.length}
              </Text>
            </View>

            {/* QUESTION CARD */}
            <View
              style={[
                styles.questionCard,
                { backgroundColor: themeColors.surface, borderColor: themeColors.cardBorder },
              ]}
            >
              <View style={styles.qPromptHeader}>
                <Text style={[styles.qTargetDesc, { color: themeColors.textMuted }]}>
                  {currentQ.targetLang === 'dari'
                    ? 'Quelle est la traduction en DARI (دری) ?'
                    : currentQ.targetLang === 'en'
                    ? "Quelle est la traduction en ANGLAIS ?"
                    : "Quelle est la traduction en FRANÇAIS ?"}
                </Text>
                <TouchableOpacity onPress={playPromptAudio} style={styles.qAudioBtn}>
                  <Volume2 size={20} color={themeColors.primary} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.qText, { color: themeColors.textPrimary }]}>
                {currentQ.promptText}
              </Text>
            </View>

            {/* CHOICES LIST */}
            <View style={styles.optionsList}>
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOptionIndex === idx;
                const showResults = selectedOptionIndex !== null;

                let optBg = themeColors.surface;
                let optBorder = themeColors.cardBorder;
                let textColor = themeColors.textPrimary;

                if (showResults) {
                  if (option.isCorrect) {
                    optBg = '#DCFCE7';
                    optBorder = '#16A34A';
                    textColor = '#14532D';
                  } else if (isSelected && !option.isCorrect) {
                    optBg = '#FEE2E2';
                    optBorder = '#DC2626';
                    textColor = '#7F1D1D';
                  }
                }

                return (
                  <TouchableOpacity
                    key={idx}
                    activeOpacity={0.8}
                    disabled={selectedOptionIndex !== null}
                    onPress={() => handleSelectOption(idx)}
                    style={[
                      styles.optionCard,
                      {
                        backgroundColor: optBg,
                        borderColor: optBorder,
                      },
                    ]}
                  >
                    <View style={styles.optContent}>
                      <Text
                        style={[
                          styles.optText,
                          {
                            color: textColor,
                            textAlign: currentQ.targetLang === 'dari' ? 'right' : 'left',
                            writingDirection: currentQ.targetLang === 'dari' ? 'rtl' : 'ltr',
                            fontSize: currentQ.targetLang === 'dari' ? 18 : 16,
                          },
                        ]}
                      >
                        {option.text}
                      </Text>

                      {option.secondaryText && (
                        <Text style={[styles.optPhonetic, { color: '#B45309' }]}>
                          {option.secondaryText}
                        </Text>
                      )}
                    </View>

                    {showResults && (
                      <View style={{ marginLeft: 8 }}>
                        {option.isCorrect ? (
                          <CheckCircle2 size={22} color="#16A34A" />
                        ) : isSelected ? (
                          <XCircle size={22} color="#DC2626" />
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
                onPress={handleNextQuestion}
                style={[styles.nextBtn, { backgroundColor: themeColors.primary }]}
              >
                <Text style={styles.nextBtnText}>
                  {currentQuestionIndex < questions.length - 1 ? 'Question suivante →' : 'Voir mon score 🏆'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 30,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  levelChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  levelChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  qTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  qCounter: {
    fontSize: 13,
    fontWeight: '700',
  },
  questionCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  qPromptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  qTargetDesc: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  qAudioBtn: {
    padding: 4,
  },
  qText: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  optionsList: {
    gap: 12,
    marginBottom: 18,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
  },
  optContent: {
    flex: 1,
  },
  optText: {
    fontWeight: '600',
    lineHeight: 22,
  },
  optPhonetic: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
  nextBtn: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  nextBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  resultBox: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 14,
  },
  scoreBig: {
    fontSize: 44,
    fontWeight: '900',
    marginVertical: 10,
  },
  resultMsg: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  replayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 18,
  },
  replayBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
