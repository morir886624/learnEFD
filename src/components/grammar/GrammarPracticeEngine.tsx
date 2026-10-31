import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CircleCheck,
  CircleX,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Award,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import {
  GrammarExercise,
  MultipleChoiceExercise,
  SentenceScrambleExercise,
  ErrorHunterExercise,
  DiscriminationExercise,
} from '../../types/grammar';
import { useApp } from '../../context/AppContext';

interface GrammarPracticeEngineProps {
  lessonId: string;
  lessonTitle: string;
  exercises: GrammarExercise[];
  onComplete?: () => void;
}

export const GrammarPracticeEngine: React.FC<GrammarPracticeEngineProps> = ({
  lessonId,
  lessonTitle,
  exercises,
  onComplete,
}) => {
  const { themeColors, recordGrammarScore } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [scrambleAnswer, setScrambleAnswer] = useState<string[]>([]);
  const [selectedSegmentIdx, setSelectedSegmentIdx] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCurrentCorrect, setIsCurrentCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentExercise = exercises[currentIndex];
  const progressPercent = Math.round(((currentIndex) / exercises.length) * 100);

  // Check Multiple Choice
  const handleSelectMC = (option: string) => {
    if (isAnswerChecked) return;
    try {
      Haptics.selectionAsync();
    } catch {
      // Ignore
    }
    setSelectedOption(option);
  };

  // Check Scramble Token tap
  const handleTapScrambleToken = (token: string, tokenIndex: number) => {
    if (isAnswerChecked) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Ignore
    }
    setScrambleAnswer((prev) => [...prev, token]);
  };

  const handleRemoveScrambleToken = (indexToRemove: number) => {
    if (isAnswerChecked) return;
    try {
      Haptics.selectionAsync();
    } catch {
      // Ignore
    }
    setScrambleAnswer((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Check Error Hunter Segment
  const handleSelectSegment = (idx: number) => {
    if (isAnswerChecked) return;
    try {
      Haptics.selectionAsync();
    } catch {
      // Ignore
    }
    setSelectedSegmentIdx(idx);
  };

  // Check Discrimination Option
  const handleSelectDiscrimination = (sentence: string) => {
    if (isAnswerChecked) return;
    try {
      Haptics.selectionAsync();
    } catch {
      // Ignore
    }
    setSelectedOption(sentence);
  };

  // Validate the answer
  const handleCheckAnswer = () => {
    if (!currentExercise || isAnswerChecked) return;

    let correct = false;

    if (currentExercise.type === 'multiple-choice') {
      const mc = currentExercise as MultipleChoiceExercise;
      correct = selectedOption === mc.correctAnswer;
    } else if (currentExercise.type === 'sentence-scramble') {
      const sc = currentExercise as SentenceScrambleExercise;
      correct = scrambleAnswer.join(' ').toLowerCase() === sc.correctOrder.join(' ').toLowerCase();
    } else if (currentExercise.type === 'error-hunter') {
      const eh = currentExercise as ErrorHunterExercise;
      if (selectedSegmentIdx !== null && eh.segments[selectedSegmentIdx]) {
        correct = eh.segments[selectedSegmentIdx].isError;
      }
    } else if (currentExercise.type === 'discrimination') {
      const dc = currentExercise as DiscriminationExercise;
      const matched = dc.options.find((o) => o.sentence === selectedOption);
      correct = !!matched?.isCorrect;
    }

    setIsCurrentCorrect(correct);
    setIsAnswerChecked(true);

    if (correct) {
      setScore((prev) => prev + 1);
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // Ignore
      }
    } else {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } catch {
        // Ignore
      }
    }
  };

  // Move to Next Question or Finish
  const handleNextQuestion = () => {
    if (currentIndex + 1 < exercises.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setScrambleAnswer([]);
      setSelectedSegmentIdx(null);
      setIsAnswerChecked(false);
      setIsCurrentCorrect(false);
    } else {
      // Complete!
      const finalScore = score + (isCurrentCorrect ? 0 : 0); // already updated
      setIsFinished(true);
      recordGrammarScore(lessonId, finalScore, exercises.length);
      if (onComplete) onComplete();
    }
  };

  // Restart Quiz
  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScrambleAnswer([]);
    setSelectedSegmentIdx(null);
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
              <Award size={48} color="#16A34A" />
            ) : (
              <Sparkles size={48} color="#D97706" />
            )}
          </View>

          <Text style={[styles.finishedTitle, { color: themeColors.textPrimary }]}>
            {isMastered ? 'Leçon Maîtrisée !' : 'Bon entraînement !'}
          </Text>

          <Text style={[styles.finishedSubtitle, { color: themeColors.textSecondary }]}>
            {lessonTitle}
          </Text>

          {/* Score Badge */}
          <View
            style={[
              styles.scorePill,
              {
                backgroundColor: themeColors.surfaceSubtle,
                borderColor: themeColors.cardBorder,
              },
            ]}
          >
            <Text style={[styles.scoreNumber, { color: themeColors.primary }]}>
              {score} / {exercises.length}
            </Text>
            <Text style={[styles.scorePercent, { color: themeColors.textSecondary }]}>
              ({percentage}%)
            </Text>
          </View>

          <Text style={[styles.finishedAdvice, { color: themeColors.textSecondary }]}>
            {isMastered
              ? 'Félicitations ! Vous avez assimilé les nuances de cette règle selon Murphy et Azar.'
              : 'Continuez à vous exercer pour ancrer ces automatismes grammaticaux dans vos réflexes.'}
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleRestart}
            style={[styles.actionButton, { backgroundColor: themeColors.primary }]}
          >
            <RotateCcw size={18} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Recommencer l’entraînement</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!currentExercise) return null;

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
      {/* Header: Progress & Source Reference */}
      <View style={styles.exerciseHeader}>
        <View style={styles.exerciseProgressInfo}>
          <Text style={[styles.questionCounter, { color: themeColors.textMuted }]}>
            Exercice {currentIndex + 1} sur {exercises.length}
          </Text>
          <View style={[styles.sourcePill, { backgroundColor: themeColors.surfaceSubtle }]}>
            <Text style={[styles.sourceText, { color: themeColors.primary }]}>
              {currentExercise.sourceRef}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={[styles.progressBarTrack, { backgroundColor: themeColors.surfaceSubtle }]}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${Math.max(10, progressPercent)}%`,
                backgroundColor: themeColors.primary,
              },
            ]}
          />
        </View>
      </View>

      {/* Prompt / Instruction */}
      <View style={styles.promptArea}>
        <Text style={[styles.promptFr, { color: themeColors.textPrimary }]}>
          {currentExercise.promptFr}
        </Text>
        {currentExercise.promptDari ? (
          <Text style={[styles.promptDari, { color: themeColors.textSecondary }]}>
            {currentExercise.promptDari}
          </Text>
        ) : null}
      </View>

      {/* 1. MULTIPLE CHOICE */}
      {currentExercise.type === 'multiple-choice' && (
        <View style={styles.drillBody}>
          <View style={[styles.sentenceBox, { backgroundColor: themeColors.surfaceSubtle }]}>
            <Text style={[styles.sentenceText, { color: themeColors.textPrimary }]}>
              {(currentExercise as MultipleChoiceExercise).sentence}
            </Text>
          </View>

          <View style={styles.optionsList}>
            {(currentExercise as MultipleChoiceExercise).options.map((opt, i) => {
              const isSelected = selectedOption === opt;
              let btnStyle = {};
              let textStyle = {};

              if (isAnswerChecked) {
                if (opt === (currentExercise as MultipleChoiceExercise).correctAnswer) {
                  btnStyle = { backgroundColor: '#DCFCE7', borderColor: '#16A34A' };
                  textStyle = { color: '#16A34A', fontWeight: '800' };
                } else if (isSelected) {
                  btnStyle = { backgroundColor: '#FEE2E2', borderColor: '#EF4444' };
                  textStyle = { color: '#EF4444' };
                }
              } else if (isSelected) {
                btnStyle = {
                  backgroundColor: themeColors.primaryLight,
                  borderColor: themeColors.primary,
                };
                textStyle = { color: themeColors.primary, fontWeight: '700' };
              }

              return (
                <TouchableOpacity
                  key={i}
                  activeOpacity={0.8}
                  disabled={isAnswerChecked}
                  onPress={() => handleSelectMC(opt)}
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
        </View>
      )}

      {/* 2. SENTENCE SCRAMBLE */}
      {currentExercise.type === 'sentence-scramble' && (
        <View style={styles.drillBody}>
          {/* Target Translation */}
          <Text style={[styles.scrambleTranslation, { color: themeColors.textSecondary }]}>
            {`"${(currentExercise as SentenceScrambleExercise).translationFr}"`}
          </Text>

          {/* Constructed Answer Area */}
          <View
            style={[
              styles.scrambleDropArea,
              {
                backgroundColor: themeColors.surfaceSubtle,
                borderColor: isAnswerChecked
                  ? isCurrentCorrect
                    ? '#16A34A'
                    : '#EF4444'
                  : themeColors.cardBorder,
              },
            ]}
          >
            {scrambleAnswer.length === 0 ? (
              <Text style={[styles.placeholderText, { color: themeColors.textMuted }]}>
                Touchez les mots ci-dessous pour assembler la phrase...
              </Text>
            ) : (
              <View style={styles.tokenFlow}>
                {scrambleAnswer.map((tok, idx) => (
                  <TouchableOpacity
                    key={idx}
                    activeOpacity={0.7}
                    disabled={isAnswerChecked}
                    onPress={() => handleRemoveScrambleToken(idx)}
                    style={[styles.tokenActivePill, { backgroundColor: themeColors.primary }]}
                  >
                    <Text style={styles.tokenActiveText}>{tok}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Available Word Bank */}
          <View style={styles.wordBank}>
            {(currentExercise as SentenceScrambleExercise).tokens.map((token, idx) => {
              // Count how many times this token appears in answer vs tokens
              const countInAnswer = scrambleAnswer.filter((t) => t === token).length;
              const totalInTokens = (currentExercise as SentenceScrambleExercise).tokens.filter(
                (t) => t === token
              ).length;
              const isUsed = countInAnswer >= totalInTokens;

              return (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.75}
                  disabled={isUsed || isAnswerChecked}
                  onPress={() => handleTapScrambleToken(token, idx)}
                  style={[
                    styles.tokenBankPill,
                    {
                      backgroundColor: themeColors.surface,
                      borderColor: themeColors.cardBorder,
                      opacity: isUsed ? 0.35 : 1,
                    },
                  ]}
                >
                  <Text style={[styles.tokenBankText, { color: themeColors.textPrimary }]}>
                    {token}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* 3. ERROR HUNTER */}
      {currentExercise.type === 'error-hunter' && (
        <View style={styles.drillBody}>
          <Text style={[styles.errorHunterPromptNote, { color: themeColors.textMuted }]}>
            Touchez la partie soulignée qui contient une faute :
          </Text>

          <View style={styles.segmentsRow}>
            {(currentExercise as ErrorHunterExercise).segments.map((seg, idx) => {
              const isSelected = selectedSegmentIdx === idx;
              let segBg = themeColors.surfaceSubtle;
              let segBorder = themeColors.cardBorder;

              if (isAnswerChecked) {
                if (seg.isError) {
                  segBg = '#DCFCE7';
                  segBorder = '#16A34A';
                } else if (isSelected) {
                  segBg = '#FEE2E2';
                  segBorder = '#EF4444';
                }
              } else if (isSelected) {
                segBg = themeColors.primaryLight;
                segBorder = themeColors.primary;
              }

              return (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.8}
                  disabled={isAnswerChecked}
                  onPress={() => handleSelectSegment(idx)}
                  style={[
                    styles.segmentButton,
                    {
                      backgroundColor: segBg,
                      borderColor: segBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      { color: themeColors.textPrimary },
                      isSelected && { color: themeColors.primary, fontWeight: '700' },
                      isAnswerChecked && seg.isError && { color: '#16A34A', fontWeight: '800' },
                    ]}
                  >
                    {seg.text}
                  </Text>
                  {isAnswerChecked && seg.isError && seg.correction && (
                    <Text style={styles.correctionLabel}>
                      → {seg.correction}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* 4. DISCRIMINATION */}
      {currentExercise.type === 'discrimination' && (
        <View style={styles.drillBody}>
          <View style={[styles.targetMeaningCard, { backgroundColor: themeColors.surfaceSubtle }]}>
            <Text style={[styles.targetMeaningHeader, { color: themeColors.primary }]}>
              Sens recherché :
            </Text>
            <Text style={[styles.targetMeaningText, { color: themeColors.textPrimary }]}>
              {`"${(currentExercise as DiscriminationExercise).targetMeaningFr}"`}
            </Text>
            {(currentExercise as DiscriminationExercise).targetMeaningDari ? (
              <Text style={[styles.targetMeaningDari, { color: themeColors.textSecondary }]}>
                {(currentExercise as DiscriminationExercise).targetMeaningDari}
              </Text>
            ) : null}
          </View>

          <View style={styles.optionsList}>
            {(currentExercise as DiscriminationExercise).options.map((opt, i) => {
              const isSelected = selectedOption === opt.sentence;
              let btnStyle = {};
              let textStyle = {};

              if (isAnswerChecked) {
                if (opt.isCorrect) {
                  btnStyle = { backgroundColor: '#DCFCE7', borderColor: '#16A34A' };
                  textStyle = { color: '#16A34A', fontWeight: '800' };
                } else if (isSelected) {
                  btnStyle = { backgroundColor: '#FEE2E2', borderColor: '#EF4444' };
                  textStyle = { color: '#EF4444' };
                }
              } else if (isSelected) {
                btnStyle = {
                  backgroundColor: themeColors.primaryLight,
                  borderColor: themeColors.primary,
                };
                textStyle = { color: themeColors.primary, fontWeight: '700' };
              }

              return (
                <TouchableOpacity
                  key={i}
                  activeOpacity={0.8}
                  disabled={isAnswerChecked}
                  onPress={() => handleSelectDiscrimination(opt.sentence)}
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
                    {`"${opt.sentence}"`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* FEEDBACK EXPLANATION PANEL (after checking) */}
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
                <CircleCheck size={20} color="#16A34A" />
                <Text style={styles.feedbackCorrectTitle}>Exact ! Excellente réponse</Text>
              </>
            ) : (
              <>
                <CircleX size={20} color="#DC2626" />
                <Text style={styles.feedbackIncorrectTitle}>Pas tout à fait...</Text>
              </>
            )}
          </View>

          <Text style={styles.feedbackExplanation}>
            {currentExercise.explanationFr || currentExercise.explanationEn}
          </Text>

          {currentExercise.explanationDari ? (
            <Text style={styles.feedbackExplanationDari}>
              {currentExercise.explanationDari}
            </Text>
          ) : null}
        </View>
      )}

      {/* ACTION BUTTON: VERIFIER or SUIVANT */}
      <View style={styles.footerAction}>
        {!isAnswerChecked ? (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleCheckAnswer}
            style={[styles.checkButton, { backgroundColor: themeColors.primary }]}
          >
            <Text style={styles.checkButtonText}>Vérifier la réponse</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleNextQuestion}
            style={[styles.checkButton, { backgroundColor: isCurrentCorrect ? '#16A34A' : themeColors.primary }]}
          >
            <Text style={styles.checkButtonText}>
              {currentIndex + 1 < exercises.length ? 'Question suivante' : 'Terminer l’entraînement'}
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
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginVertical: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
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
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  sourceText: {
    fontSize: 11,
    fontWeight: '800',
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
    marginBottom: 14,
  },
  promptFr: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
  },
  promptDari: {
    fontSize: 13.5,
    lineHeight: 19,
    textAlign: 'right',
    marginTop: 2,
  },
  drillBody: {
    marginBottom: 14,
  },
  sentenceBox: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  sentenceText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 23,
  },
  optionsList: {
    gap: 8,
  },
  optionButton: {
    borderRadius: 12,
    borderWidth: 1.5,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  optionText: {
    fontSize: 14.5,
    fontWeight: '500',
  },
  scrambleTranslation: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  scrambleDropArea: {
    minHeight: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    padding: 10,
    justifyContent: 'center',
    marginBottom: 14,
  },
  placeholderText: {
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  tokenFlow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tokenActivePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tokenActiveText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },
  wordBank: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  tokenBankPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  tokenBankText: {
    fontSize: 14,
    fontWeight: '600',
  },
  errorHunterPromptNote: {
    fontSize: 12.5,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  segmentsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  segmentButton: {
    borderRadius: 8,
    borderWidth: 1.5,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  segmentText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  correctionLabel: {
    fontSize: 11,
    color: '#16A34A',
    fontWeight: '800',
    marginTop: 2,
  },
  targetMeaningCard: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  targetMeaningHeader: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  targetMeaningText: {
    fontSize: 14.5,
    fontWeight: '700',
    lineHeight: 20,
  },
  targetMeaningDari: {
    fontSize: 13,
    textAlign: 'right',
    marginTop: 2,
  },
  feedbackPanel: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 14,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  feedbackCorrectTitle: {
    color: '#16A34A',
    fontSize: 13.5,
    fontWeight: '800',
  },
  feedbackIncorrectTitle: {
    color: '#DC2626',
    fontSize: 13.5,
    fontWeight: '800',
  },
  feedbackExplanation: {
    color: '#1E293B',
    fontSize: 13,
    lineHeight: 18,
  },
  feedbackExplanationDari: {
    color: '#475569',
    fontSize: 12.5,
    lineHeight: 17,
    textAlign: 'right',
    marginTop: 4,
  },
  footerAction: {
    marginTop: 4,
  },
  checkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
  },
  checkButtonText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
  },
  finishedContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  finishedIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  finishedTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
    textAlign: 'center',
  },
  finishedSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 14,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 14,
  },
  scoreNumber: {
    fontSize: 22,
    fontWeight: '900',
  },
  scorePercent: {
    fontSize: 14,
    fontWeight: '700',
  },
  finishedAdvice: {
    fontSize: 13.5,
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
