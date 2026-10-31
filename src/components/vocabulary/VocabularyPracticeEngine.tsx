import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  CircleCheck,
  CircleX,
  Volume2,
  ArrowRight,
  RotateCcw,
  Award,
  BookOpen,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { VocabularyExercise } from '../../types/vocabulary';
import { useApp } from '../../context/AppContext';
import { SpeechService } from '../../services/speech';

interface VocabularyPracticeEngineProps {
  deckId: string;
  deckTitle: string;
  exercises: VocabularyExercise[];
  accentColor?: string;
}

export const VocabularyPracticeEngine: React.FC<VocabularyPracticeEngineProps> = ({
  deckId,
  deckTitle,
  exercises,
  accentColor = '#2563EB',
}) => {
  const { themeColors, isDark, recordVocabularyDeckScore } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (exercises.length === 0) {
    return (
      <View style={[styles.emptyCard, { backgroundColor: themeColors.surface }]}>
        <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>
          Aucun exercice disponible pour ce filtre.
        </Text>
      </View>
    );
  }

  const currentExercise = exercises[currentIndex] || exercises[0];

  const getTypeBadgeLabel = (type: VocabularyExercise['type']) => {
    switch (type) {
      case 'preposition-snap':
        return 'PRÉPOSITION EXACTE';
      case 'irregular-form':
        return 'VERBE IRRÉGULIER (V1•V2•V3)';
      case 'pair-discrimination':
        return 'DISTINCTION DE NUANCE';
      case 'context-match':
      default:
        return 'SENS EN CONTEXTE';
    }
  };

  const speakSentence = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore
    }
    const filledSentence = currentExercise.sentence.replace(
      '___',
      isChecked ? currentExercise.correctAnswer : 'blank'
    );
    SpeechService.speak(filledSentence, 'en');
  };

  const handleSelectOption = (option: string) => {
    if (isChecked) return;
    try {
      Haptics.selectionAsync();
    } catch {
      // ignore
    }
    setSelectedOption(option);
  };

  const handleCheck = () => {
    if (!selectedOption || isChecked) return;
    const correct = selectedOption === currentExercise.correctAnswer;
    setIsCorrect(correct);
    setIsChecked(true);
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

  const handleNext = () => {
    if (currentIndex + 1 < exercises.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsChecked(false);
      setIsCorrect(false);
    } else {
      recordVocabularyDeckScore(deckId, score, exercises.length);
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsChecked(false);
    setIsCorrect(false);
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    const ratio = Math.round((score / exercises.length) * 100);
    return (
      <View
        style={[
          styles.resultCard,
          {
            backgroundColor: themeColors.surface,
            borderColor: themeColors.cardBorder,
          },
        ]}
      >
        <View style={[styles.awardBadge, { backgroundColor: `${accentColor}18` }]}>
          <Award size={36} color={accentColor} />
        </View>
        <Text style={[styles.resultTitle, { color: themeColors.textPrimary }]}>
          Session Terminée !
        </Text>
        <Text style={[styles.resultSubtitle, { color: themeColors.textSecondary }]}>
          {deckTitle}
        </Text>
        <Text style={[styles.scoreBig, { color: accentColor }]}>
          {score} / {exercises.length} ({ratio}%)
        </Text>
        <Text style={[styles.resultFeedback, { color: themeColors.textSecondary }]}>
          {ratio >= 80
            ? 'Excellent ! Vous maîtrisez les nuances lexicales de Murphy & Azar.'
            : 'Continuez à pratiquer avec les cartes mémo pour consolider ces expressions.'}
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleRestart}
          style={[styles.restartBtn, { backgroundColor: accentColor }]}
        >
          <RotateCcw size={16} color="#FFFFFF" />
          <Text style={styles.restartBtnText}>Recommencer la série</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: themeColors.surface,
          borderColor: themeColors.cardBorder,
        },
      ]}
    >
      {/* Top Progress & Type Row */}
      <View style={styles.topRow}>
        <View style={[styles.typeBadge, { backgroundColor: `${accentColor}15` }]}>
          <Text style={[styles.typeBadgeText, { color: accentColor }]}>
            {getTypeBadgeLabel(currentExercise.type)}
          </Text>
        </View>
        <Text style={[styles.stepCounter, { color: themeColors.textMuted }]}>
          Question {currentIndex + 1} / {exercises.length}
        </Text>
      </View>

      {/*Prompts in FR and Dari */}
      <Text style={[styles.promptFr, { color: themeColors.textPrimary }]}>
        {currentExercise.promptFr}
      </Text>
      <Text style={[styles.promptDari, { color: themeColors.textMuted }]}>
        {currentExercise.promptDari}
      </Text>

      {/* Sentence Box with Blank + Audio */}
      <View
        style={[
          styles.sentenceBox,
          {
            backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
            borderColor: themeColors.cardBorder,
          },
        ]}
      >
        <View style={styles.sentenceRow}>
          <Text style={[styles.sentenceText, { color: themeColors.textPrimary }]}>
            {currentExercise.sentence.replace(
              '___',
              selectedOption ? `[ ${selectedOption} ]` : '______'
            )}
          </Text>
          <TouchableOpacity onPress={speakSentence} style={styles.audioIconBtn}>
            <Volume2 size={18} color={accentColor} />
          </TouchableOpacity>
        </View>

        {currentExercise.targetMeaningFr ? (
          <Text style={[styles.targetHint, { color: accentColor }]}>
            💡 Sens visé : {currentExercise.targetMeaningFr}
          </Text>
        ) : null}
      </View>

      {/* Options Grid */}
      <View style={styles.optionsList}>
        {currentExercise.options.map((option) => {
          const isSelected = selectedOption === option;
          const isAnswer = option === currentExercise.correctAnswer;

          let bg = isDark ? '#1E293B' : '#F8FAFC';
          let border = themeColors.cardBorder;
          let textColor = themeColors.textPrimary;

          if (isChecked) {
            if (isAnswer) {
              bg = '#DCFCE7';
              border = '#16A34A';
              textColor = '#14532D';
            } else if (isSelected && !isAnswer) {
              bg = '#FEE2E2';
              border = '#DC2626';
              textColor = '#7F1D1D';
            }
          } else if (isSelected) {
            bg = `${accentColor}18`;
            border = accentColor;
            textColor = accentColor;
          }

          return (
            <TouchableOpacity
              key={option}
              activeOpacity={0.8}
              disabled={isChecked}
              onPress={() => handleSelectOption(option)}
              style={[
                styles.optionBtn,
                { backgroundColor: bg, borderColor: border },
              ]}
            >
              <Text style={[styles.optionText, { color: textColor }]}>{option}</Text>
              {isChecked && isAnswer ? (
                <CircleCheck size={18} color="#16A34A" />
              ) : null}
              {isChecked && isSelected && !isAnswer ? (
                <CircleX size={18} color="#DC2626" />
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Explanation Box after Check */}
      {isChecked ? (
        <View
          style={[
            styles.feedbackBox,
            {
              backgroundColor: isCorrect
                ? isDark
                  ? '#064E3B'
                  : '#F0FDF4'
                : isDark
                  ? '#450A0A'
                  : '#FEF2F2',
              borderColor: isCorrect ? '#16A34A' : '#DC2626',
            },
          ]}
        >
          <View style={styles.feedbackHeader}>
            {isCorrect ? (
              <CircleCheck size={16} color="#16A34A" />
            ) : (
              <CircleX size={16} color="#DC2626" />
            )}
            <Text
              style={[
                styles.feedbackTitle,
                { color: isCorrect ? '#16A34A' : '#DC2626' },
              ]}
            >
              {isCorrect
                ? 'Exact ! Bonne réponse'
                : `Réponse attendue : "${currentExercise.correctAnswer}"`}
            </Text>
          </View>
          <Text style={[styles.explanationFr, { color: themeColors.textPrimary }]}>
            {currentExercise.explanationFr}
          </Text>
          <Text style={[styles.explanationDari, { color: themeColors.textSecondary }]}>
            {currentExercise.explanationDari}
          </Text>
          <View style={styles.sourceRefRow}>
            <BookOpen size={11} color={themeColors.textMuted} />
            <Text style={[styles.sourceRefText, { color: themeColors.textMuted }]}>
              Référence : {currentExercise.sourceRef}
            </Text>
          </View>
        </View>
      ) : null}

      {/* Check or Next Button */}
      {!isChecked ? (
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={!selectedOption}
          onPress={handleCheck}
          style={[
            styles.primaryBtn,
            {
              backgroundColor: selectedOption ? accentColor : themeColors.cardBorder,
            },
          ]}
        >
          <Text style={styles.primaryBtnText}>Vérifier la réponse</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleNext}
          style={[styles.primaryBtn, { backgroundColor: accentColor }]}
        >
          <Text style={styles.primaryBtnText}>
            {currentIndex + 1 < exercises.length
              ? 'Question suivante'
              : 'Voir mon score final'}
          </Text>
          <ArrowRight size={17} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginVertical: 8,
  },
  emptyCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  typeBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 8,
  },
  typeBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  stepCounter: {
    fontSize: 12,
    fontWeight: '700',
  },
  promptFr: {
    fontSize: 14.5,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 3,
  },
  promptDari: {
    fontSize: 13,
    textAlign: 'right',
    lineHeight: 19,
    marginBottom: 12,
  },
  sentenceBox: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 13,
    marginBottom: 14,
  },
  sentenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  sentenceText: {
    flex: 1,
    fontSize: 15.5,
    fontWeight: '800',
    lineHeight: 22,
  },
  audioIconBtn: {
    padding: 6,
  },
  targetHint: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
  },
  optionsList: {
    gap: 9,
    marginBottom: 14,
  },
  optionBtn: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 14.5,
    fontWeight: '700',
  },
  feedbackBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    gap: 5,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  feedbackTitle: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  explanationFr: {
    fontSize: 13,
    lineHeight: 18,
  },
  explanationDari: {
    fontSize: 12.5,
    textAlign: 'right',
    lineHeight: 18,
  },
  sourceRefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  sourceRefText: {
    fontSize: 11,
    fontWeight: '600',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
  },
  resultCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 22,
    alignItems: 'center',
    marginVertical: 10,
  },
  awardBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: 13.5,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  scoreBig: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 10,
  },
  resultFeedback: {
    fontSize: 13.5,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 18,
  },
  restartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  restartBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
