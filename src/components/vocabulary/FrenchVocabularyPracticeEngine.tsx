import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  CircleCheck,
  CircleX,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Award,
  Volume2,
  BookOpen,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { FrenchVocabularyExercise } from '../../types/frenchVocabulary';
import { useApp } from '../../context/AppContext';
import { SpeechService } from '../../services/speech';

interface FrenchVocabularyPracticeEngineProps {
  deckId: string;
  deckTitle: string;
  exercises: FrenchVocabularyExercise[];
  accentColor?: string;
  onComplete?: () => void;
}

export const FrenchVocabularyPracticeEngine: React.FC<
  FrenchVocabularyPracticeEngineProps
> = ({
  deckId,
  deckTitle,
  exercises,
  accentColor = '#059669',
  onComplete,
}) => {
  const { themeColors, recordVocabularyDeckScore } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCurrentCorrect, setIsCurrentCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (exercises.length === 0) {
    return (
      <View style={[styles.emptyBox, { backgroundColor: themeColors.surface }]}>
        <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>
          Aucun exercice disponible pour ce deck.
        </Text>
      </View>
    );
  }

  const currentExercise = exercises[currentIndex];
  const progressPercent = Math.round((currentIndex / exercises.length) * 100);

  const speakFrench = (text: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore
    }
    const clean = text.replace(/___/g, '').trim();
    SpeechService.speak(clean, 'fr');
  };

  const handleSelectOption = (opt: string) => {
    if (isAnswerChecked) return;
    try {
      Haptics.selectionAsync();
    } catch {
      // ignore
    }
    setSelectedOption(opt);
  };

  const handleCheckAnswer = () => {
    if (!currentExercise || isAnswerChecked || !selectedOption) return;

    const correct = selectedOption === currentExercise.correctAnswer;
    setIsCurrentCorrect(correct);
    setIsAnswerChecked(true);

    if (correct) {
      setScore((prev) => prev + 1);
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // ignore
      }
    } else {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } catch {
        // ignore
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < exercises.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
      setIsCurrentCorrect(false);
    } else {
      setIsFinished(true);
      recordVocabularyDeckScore(deckId, score, exercises.length);
      if (onComplete) onComplete();
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setIsCurrentCorrect(false);
    setScore(0);
    setIsFinished(false);
  };

  // FINISHED STATE
  if (isFinished) {
    const percentage = Math.round((score / exercises.length) * 100);
    const isMastered = percentage >= 80;

    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: themeColors.surface,
            borderColor: themeColors.cardBorder,
          },
        ]}
      >
        <View style={styles.finishedContainer}>
          <View
            style={[
              styles.finishedIconCircle,
              { backgroundColor: isMastered ? '#DCFCE7' : '#FEF3C7' },
            ]}
          >
            {isMastered ? (
              <Award size={46} color="#16A34A" />
            ) : (
              <Sparkles size={46} color="#D97706" />
            )}
          </View>

          <Text style={[styles.finishedTitle, { color: themeColors.textPrimary }]}>
            {isMastered ? 'Deck Maîtrisé !' : 'Bonne pratique !'}
          </Text>

          <Text style={[styles.finishedSubtitle, { color: themeColors.textSecondary }]}>
            {deckTitle}
          </Text>

          <View
            style={[
              styles.scorePill,
              {
                backgroundColor: themeColors.surfaceSubtle,
                borderColor: themeColors.cardBorder,
              },
            ]}
          >
            <Text style={[styles.scoreNumber, { color: accentColor }]}>
              {score} / {exercises.length}
            </Text>
            <Text style={[styles.scorePercent, { color: themeColors.textSecondary }]}>
              ({percentage}%)
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleRestart}
            style={[styles.actionButton, { backgroundColor: accentColor }]}
          >
            <RotateCcw size={18} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Recommencer le quiz</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: themeColors.surface,
          borderColor: themeColors.cardBorder,
        },
      ]}
    >
      {/* Exercise Header */}
      <View style={styles.exerciseHeader}>
        <View style={styles.exerciseProgressInfo}>
          <Text style={[styles.questionCounter, { color: themeColors.textMuted }]}>
            Question {currentIndex + 1} sur {exercises.length}
          </Text>
          <View style={[styles.sourcePill, { backgroundColor: themeColors.surfaceSubtle }]}>
            <BookOpen size={11} color={accentColor} />
            <Text style={[styles.sourceText, { color: accentColor }]}>
              {currentExercise.sourceRef}
            </Text>
          </View>
        </View>

        <View style={[styles.progressBarTrack, { backgroundColor: themeColors.surfaceSubtle }]}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${Math.max(10, progressPercent)}%`,
                backgroundColor: accentColor,
              },
            ]}
          />
        </View>
      </View>

      {/* Prompts: FR, EN, DARI */}
      <View style={styles.promptArea}>
        <Text style={[styles.promptFr, { color: themeColors.textPrimary }]}>
          {currentExercise.promptFr}
        </Text>
        <Text style={[styles.promptEn, { color: themeColors.textSecondary }]}>
          🇬🇧 {currentExercise.promptEn}
        </Text>
        <Text style={[styles.promptDari, { color: themeColors.textMuted }]}>
          {currentExercise.promptDari}
        </Text>
      </View>

      {/* Sentence / Context Box */}
      {currentExercise.sentence && (
        <View
          style={[
            styles.sentenceBox,
            { backgroundColor: themeColors.surfaceSubtle },
          ]}
        >
          <View style={styles.sentenceTopRow}>
            <Text
              style={[
                styles.sentenceText,
                { color: themeColors.textPrimary, flex: 1 },
              ]}
            >
              {currentExercise.sentence}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => speakFrench(currentExercise.sentence || '')}
              style={[styles.audioPill, { backgroundColor: accentColor }]}
            >
              <Volume2 size={13} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Options List */}
      <View style={styles.optionsList}>
        {currentExercise.options.map((opt, i) => {
          const isSelected = selectedOption === opt;
          let btnStyle = {};
          let textStyle = {};

          if (isAnswerChecked) {
            if (opt === currentExercise.correctAnswer) {
              btnStyle = { backgroundColor: '#DCFCE7', borderColor: '#16A34A' };
              textStyle = { color: '#16A34A', fontWeight: '800' as const };
            } else if (isSelected) {
              btnStyle = { backgroundColor: '#FEE2E2', borderColor: '#EF4444' };
              textStyle = { color: '#EF4444' };
            }
          } else if (isSelected) {
            btnStyle = {
              backgroundColor: `${accentColor}18`,
              borderColor: accentColor,
            };
            textStyle = { color: accentColor, fontWeight: '700' as const };
          }

          return (
            <TouchableOpacity
              key={i}
              activeOpacity={0.8}
              disabled={isAnswerChecked}
              onPress={() => handleSelectOption(opt)}
              style={[
                styles.optionButton,
                {
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.cardBorder,
                },
                btnStyle,
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  { color: themeColors.textPrimary },
                  textStyle,
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Feedback Panel */}
      {isAnswerChecked && (
        <View
          style={[
            styles.feedbackPanel,
            {
              backgroundColor: isCurrentCorrect ? '#F0FDF4' : '#FEF2F2',
              borderColor: isCurrentCorrect ? '#86EFAC' : '#FCA5A5',
            },
          ]}
        >
          <View style={styles.feedbackHeader}>
            {isCurrentCorrect ? (
              <>
                <CircleCheck size={18} color="#16A34A" />
                <Text style={styles.feedbackCorrectTitle}>Exact ! Excellente réponse</Text>
              </>
            ) : (
              <>
                <CircleX size={18} color="#DC2626" />
                <Text style={styles.feedbackIncorrectTitle}>Attention au piège...</Text>
              </>
            )}
          </View>

          <Text style={styles.feedbackExplanation}>{currentExercise.explanationFr}</Text>
          <Text style={[styles.feedbackExplanation, { marginTop: 4, color: '#475569' }]}>
            🇬🇧 {currentExercise.explanationEn}
          </Text>
          <Text style={styles.feedbackExplanationDari}>{currentExercise.explanationDari}</Text>
        </View>
      )}

      {/* Action Button: Check / Next */}
      <View style={styles.footerAction}>
        {!isAnswerChecked ? (
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={!selectedOption}
            onPress={handleCheckAnswer}
            style={[
              styles.actionButton,
              {
                backgroundColor: selectedOption ? accentColor : themeColors.cardBorder,
              },
            ]}
          >
            <Text style={styles.actionButtonText}>Vérifier la réponse</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleNextQuestion}
            style={[
              styles.actionButton,
              {
                backgroundColor: isCurrentCorrect ? '#16A34A' : accentColor,
              },
            ]}
          >
            <Text style={styles.actionButtonText}>
              {currentIndex + 1 < exercises.length
                ? 'Question suivante'
                : 'Terminer l’entraînement'}
            </Text>
            <ArrowRight size={18} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 16,
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  exerciseHeader: {
    marginBottom: 12,
  },
  exerciseProgressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  questionCounter: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  sourcePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  sourceText: {
    fontSize: 11,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  promptArea: {
    marginBottom: 12,
    gap: 3,
  },
  promptFr: {
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 21,
  },
  promptEn: {
    fontSize: 13,
    fontWeight: '600',
  },
  promptDari: {
    fontSize: 13,
    textAlign: 'right',
  },
  sentenceBox: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  sentenceTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  sentenceText: {
    fontSize: 15.5,
    fontWeight: '700',
    lineHeight: 22,
  },
  audioPill: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsList: {
    gap: 8,
    marginBottom: 12,
  },
  optionButton: {
    borderRadius: 12,
    borderWidth: 1.5,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  optionText: {
    fontSize: 14.5,
    fontWeight: '600',
  },
  feedbackPanel: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  feedbackCorrectTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#16A34A',
  },
  feedbackIncorrectTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#DC2626',
  },
  feedbackExplanation: {
    fontSize: 13,
    lineHeight: 18,
    color: '#1E293B',
  },
  feedbackExplanationDari: {
    fontSize: 12.5,
    textAlign: 'right',
    marginTop: 4,
    color: '#334155',
  },
  footerAction: {
    marginTop: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
  },
  finishedContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  finishedIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  finishedTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 4,
  },
  finishedSubtitle: {
    fontSize: 14,
    marginBottom: 14,
    textAlign: 'center',
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 18,
  },
  scoreNumber: {
    fontSize: 20,
    fontWeight: '900',
  },
  scorePercent: {
    fontSize: 14,
    fontWeight: '700',
  },
  emptyBox: {
    padding: 24,
    borderRadius: 14,
    alignItems: 'center',
    marginVertical: 12,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
