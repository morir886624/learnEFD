import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ArrowLeft,
  BookOpen,
  Volume2,
  CircleCheck,
  CircleAlert,
  CircleX,
  GraduationCap,
  Sparkles,
  Clock,
  ArrowLeftRight,
  Table,
  RotateCcw,
  ArrowRight,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useApp } from '../../context/AppContext';
import { useResponsive } from '../../hooks/useResponsive';
import {
  FrenchGrammarLesson,
  FrenchMultipleChoiceExercise,
  FrenchSentenceScrambleExercise,
  FrenchErrorHunterExercise,
  FrenchDiscriminationExercise,
} from '../../types/frenchGrammar';
import { FRENCH_GRAMMAR_LESSONS } from '../../data/frenchGrammar';
import { SpeechService } from '../../services/speech';

type ActiveTab = 'learn' | 'practice';
type LangDisplay = 'fr' | 'dari' | 'both';

interface FrenchLessonViewProps {
  lesson: FrenchGrammarLesson;
}

export const FrenchLessonView: React.FC<FrenchLessonViewProps> = ({ lesson }) => {
  const {
    themeColors,
    isDark,
    grammarProgress,
    markGrammarLessonComplete,
    recordGrammarScore,
  } = useApp();
  const { contentMaxWidth } = useResponsive();

  const [activeTab, setActiveTab] = useState<ActiveTab>('learn');
  const [langDisplay, setLangDisplay] = useState<LangDisplay>('both');

  // Interactive Lesson Widget States
  const [selectedTimelineId, setSelectedTimelineId] = useState<string>(
    lesson.timeline?.points[0]?.id || ''
  );
  const [comparisonTab, setComparisonTab] = useState<'A' | 'B'>('A');
  const [isChartExpanded, setIsChartExpanded] = useState<boolean>(true);

  // Interactive Practice Engine States
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [scrambleAnswer, setScrambleAnswer] = useState<string[]>([]);
  const [selectedSegmentIdx, setSelectedSegmentIdx] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCurrentCorrect, setIsCurrentCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const isCompleted = grammarProgress.completedLessonIds.includes(lesson.id);
  const currentLessonIdx = FRENCH_GRAMMAR_LESSONS.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentLessonIdx > 0 ? FRENCH_GRAMMAR_LESSONS[currentLessonIdx - 1] : null;
  const nextLesson =
    currentLessonIdx >= 0 && currentLessonIdx < FRENCH_GRAMMAR_LESSONS.length - 1
      ? FRENCH_GRAMMAR_LESSONS[currentLessonIdx + 1]
      : null;

  const speakFrench = (text: string) => {
    const clean = text.replace(/\([^)]*\)/g, '').replace(/___/g, '').trim();
    if (!clean) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Ignore
    }
    SpeechService.speak(clean, 'fr');
  };

  const handleTabSwitch = (tab: ActiveTab) => {
    try {
      Haptics.selectionAsync();
    } catch {
      // Ignore
    }
    setActiveTab(tab);
  };

  const handleLangToggle = (mode: LangDisplay) => {
    try {
      Haptics.selectionAsync();
    } catch {
      // Ignore
    }
    setLangDisplay(mode);
  };

  const handleMarkComplete = async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Ignore
    }
    await markGrammarLessonComplete(lesson.id);
  };

  const exercises = lesson.exercises;
  const currentExercise = exercises[currentIndex];
  const progressPercent =
    exercises.length > 0 ? Math.round((currentIndex / exercises.length) * 100) : 0;

  const hasSelection =
    !currentExercise
      ? false
      : currentExercise.type === 'multiple-choice' || currentExercise.type === 'discrimination'
        ? selectedOption !== null
        : currentExercise.type === 'sentence-scramble'
          ? scrambleAnswer.length > 0
          : selectedSegmentIdx !== null;

  const handleSelectMC = (option: string) => {
    if (isAnswerChecked) return;
    try {
      Haptics.selectionAsync();
    } catch {
      // Ignore
    }
    setSelectedOption(option);
  };

  const handleTapScrambleToken = (token: string) => {
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

  const handleSelectSegment = (idx: number) => {
    if (isAnswerChecked) return;
    try {
      Haptics.selectionAsync();
    } catch {
      // Ignore
    }
    setSelectedSegmentIdx(idx);
  };

  const handleCheckAnswer = () => {
    if (!currentExercise || isAnswerChecked) return;

    let correct = false;

    if (currentExercise.type === 'multiple-choice') {
      const mc = currentExercise as FrenchMultipleChoiceExercise;
      correct = selectedOption === mc.correctAnswer;
    } else if (currentExercise.type === 'sentence-scramble') {
      const sc = currentExercise as FrenchSentenceScrambleExercise;
      correct =
        scrambleAnswer.join(' ').toLowerCase() === sc.correctOrder.join(' ').toLowerCase();
    } else if (currentExercise.type === 'error-hunter') {
      const eh = currentExercise as FrenchErrorHunterExercise;
      if (selectedSegmentIdx !== null && eh.segments[selectedSegmentIdx]) {
        correct = eh.segments[selectedSegmentIdx].isError;
      }
    } else if (currentExercise.type === 'discrimination') {
      const dc = currentExercise as FrenchDiscriminationExercise;
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

  const handleNextQuestion = () => {
    if (currentIndex + 1 < exercises.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setScrambleAnswer([]);
      setSelectedSegmentIdx(null);
      setIsAnswerChecked(false);
      setIsCurrentCorrect(false);
    } else {
      setIsFinished(true);
      recordGrammarScore(lesson.id, score, exercises.length);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScrambleAnswer([]);
    setSelectedSegmentIdx(null);
    setIsAnswerChecked(false);
    setIsCurrentCorrect(false);
    setScore(0);
    setIsFinished(false);
  };

  const activeTimelinePoint =
    lesson.timeline?.points.find((p) => p.id === selectedTimelineId) ||
    lesson.timeline?.points[0];

  const activeComparisonItem =
    comparisonTab === 'A' ? lesson.comparison?.itemA : lesson.comparison?.itemB;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      {/* TOP NAV BAR */}
      <View
        style={[
          styles.topBar,
          {
            backgroundColor: themeColors.surface,
            borderBottomColor: themeColors.cardBorder,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.backBtn}
        >
          <ArrowLeft size={22} color={themeColors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.topBarCenter}>
          <Text numberOfLines={1} style={[styles.topBarTitle, { color: themeColors.textPrimary }]}>
            Unité {lesson.unitNumber} • {lesson.titleFr}
          </Text>
        </View>

        {/* Language Display Toggle Pill */}
        <View style={[styles.langToggleGroup, { backgroundColor: themeColors.surfaceSubtle }]}>
          <TouchableOpacity
            onPress={() => handleLangToggle('fr')}
            style={[
              styles.langPill,
              langDisplay === 'fr' && { backgroundColor: themeColors.surface },
            ]}
          >
            <Text
              style={[
                styles.langPillText,
                { color: langDisplay === 'fr' ? themeColors.primary : themeColors.textMuted },
              ]}
            >
              FR/EN
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleLangToggle('dari')}
            style={[
              styles.langPill,
              langDisplay === 'dari' && { backgroundColor: themeColors.surface },
            ]}
          >
            <Text
              style={[
                styles.langPillText,
                { color: langDisplay === 'dari' ? themeColors.primary : themeColors.textMuted },
              ]}
            >
              دری
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleLangToggle('both')}
            style={[
              styles.langPill,
              langDisplay === 'both' && { backgroundColor: themeColors.surface },
            ]}
          >
            <Text
              style={[
                styles.langPillText,
                { color: langDisplay === 'both' ? themeColors.primary : themeColors.textMuted },
              ]}
            >
              Tous
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SEGMENTED TAB SWITCHER */}
      <View
        style={[
          styles.tabsRow,
          {
            backgroundColor: themeColors.surface,
            borderBottomColor: themeColors.cardBorder,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleTabSwitch('learn')}
          style={[
            styles.tabItem,
            activeTab === 'learn' && { borderBottomColor: themeColors.primary },
          ]}
        >
          <BookOpen
            size={18}
            color={activeTab === 'learn' ? themeColors.primary : themeColors.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'learn' ? themeColors.primary : themeColors.textSecondary,
                fontWeight: activeTab === 'learn' ? '800' : '600',
              },
            ]}
          >
            Leçon & Tableaux
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleTabSwitch('practice')}
          style={[
            styles.tabItem,
            activeTab === 'practice' && { borderBottomColor: themeColors.primary },
          ]}
        >
          <GraduationCap
            size={18}
            color={activeTab === 'practice' ? themeColors.primary : themeColors.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'practice' ? themeColors.primary : themeColors.textSecondary,
                fontWeight: activeTab === 'practice' ? '800' : '600',
              },
            ]}
          >
            Pratique ({exercises.length})
          </Text>
          {isCompleted && (
            <View style={{ marginLeft: 2 }}>
              <CircleCheck size={14} color="#16A34A" />
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* BODY CONTENT */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'learn' ? (
          <View style={styles.learnSection}>
            {/* HERO HEADER */}
            <View
              style={[
                styles.heroCard,
                {
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.cardBorder,
                },
              ]}
            >
              <View style={styles.heroBadgeRow}>
                <View style={[styles.unitBadge, { backgroundColor: themeColors.primaryLight }]}>
                  <Text style={[styles.unitBadgeText, { color: themeColors.primary }]}>
                    🇫🇷 UNITÉ {lesson.unitNumber}
                  </Text>
                </View>
                <View style={[styles.levelBadge, { backgroundColor: '#E0F2FE' }]}>
                  <Text style={styles.levelBadgeText}>{lesson.level}</Text>
                </View>
                <View style={[styles.sourcePill, { backgroundColor: themeColors.surfaceSubtle }]}>
                  <Sparkles size={11} color={themeColors.secondary} />
                  <Text style={[styles.sourcePillText, { color: themeColors.textSecondary }]}>
                    {lesson.sources.description}
                  </Text>
                </View>
              </View>

              <Text style={[styles.lessonTitleFr, { color: themeColors.textPrimary }]}>
                {lesson.titleFr}
              </Text>
              <Text style={[styles.lessonTitleEn, { color: themeColors.textSecondary }]}>
                {lesson.titleEn}
              </Text>

              {(langDisplay === 'dari' || langDisplay === 'both') && lesson.titleDari ? (
                <Text style={[styles.lessonTitleDari, { color: themeColors.textMuted }]}>
                  {lesson.titleDari}
                </Text>
              ) : null}

              {(langDisplay === 'fr' || langDisplay === 'both') && (
                <>
                  <Text style={[styles.summaryFr, { color: themeColors.textPrimary }]}>
                    {lesson.summaryFr}
                  </Text>
                  <Text style={[styles.summaryEn, { color: themeColors.textSecondary }]}>
                    🇬🇧 {lesson.summaryEn}
                  </Text>
                </>
              )}

              {(langDisplay === 'dari' || langDisplay === 'both') && lesson.summaryDari ? (
                <Text style={[styles.summaryDari, { color: themeColors.textMuted }]}>
                  {lesson.summaryDari}
                </Text>
              ) : null}
            </View>

            {/* FORMULA CARD */}
            {lesson.formula && (
              <View
                style={[
                  styles.sectionCard,
                  {
                    backgroundColor: themeColors.surface,
                    borderColor: themeColors.cardBorder,
                  },
                ]}
              >
                <Text style={[styles.sectionTitle, { color: themeColors.primary }]}>
                  FORMULES & STRUCTURES SYNTAXIQUES
                </Text>

                <View style={[styles.formulaRow, { backgroundColor: themeColors.surfaceSubtle }]}>
                  <Text style={styles.formulaType}>Forme Affirmative (+)</Text>
                  <Text style={[styles.formulaText, { color: themeColors.textPrimary }]}>
                    {lesson.formula.affirmative}
                  </Text>
                </View>

                <View style={[styles.formulaRow, { backgroundColor: themeColors.surfaceSubtle }]}>
                  <Text style={styles.formulaType}>Forme Négative (-)</Text>
                  <Text style={[styles.formulaText, { color: themeColors.textPrimary }]}>
                    {lesson.formula.negative}
                  </Text>
                </View>

                <View style={[styles.formulaRow, { backgroundColor: themeColors.surfaceSubtle }]}>
                  <Text style={styles.formulaType}>Forme Interrogative / Particularité (?)</Text>
                  <Text style={[styles.formulaText, { color: themeColors.textPrimary }]}>
                    {lesson.formula.question}
                  </Text>
                </View>

                {lesson.formula.notesFr && (langDisplay === 'fr' || langDisplay === 'both') && (
                  <Text style={[styles.formulaNote, { color: themeColors.textSecondary }]}>
                    💡 {lesson.formula.notesFr}
                  </Text>
                )}
                {lesson.formula.notesEn && (langDisplay === 'fr' || langDisplay === 'both') && (
                  <Text style={[styles.formulaNote, { color: themeColors.textMuted }]}>
                    🇬🇧 {lesson.formula.notesEn}
                  </Text>
                )}
                {lesson.formula.notesDari && (langDisplay === 'dari' || langDisplay === 'both') && (
                  <Text style={[styles.formulaNoteDari, { color: themeColors.textMuted }]}>
                    {lesson.formula.notesDari}
                  </Text>
                )}
              </View>
            )}

            {/* VISUAL TIMELINE */}
            {lesson.timeline && activeTimelinePoint && (
              <View
                style={[
                  styles.sectionCard,
                  {
                    backgroundColor: themeColors.surface,
                    borderColor: themeColors.cardBorder,
                  },
                ]}
              >
                <View style={styles.widgetHeaderRow}>
                  <View style={[styles.iconCircle, { backgroundColor: themeColors.primaryLight }]}>
                    <Clock size={16} color={themeColors.primary} />
                  </View>
                  <Text style={[styles.sectionTitle, { color: themeColors.primary, marginBottom: 0 }]}>
                    LIGNE DU TEMPS INTERACTIVE
                  </Text>
                </View>

                <Text style={[styles.widgetDesc, { color: themeColors.textSecondary }]}>
                  {lesson.timeline.descriptionFr}
                </Text>
                {(langDisplay === 'dari' || langDisplay === 'both') && (
                  <Text style={[styles.widgetDescDari, { color: themeColors.textMuted }]}>
                    {lesson.timeline.descriptionDari}
                  </Text>
                )}

                <View style={styles.timelinePointsRow}>
                  {lesson.timeline.points.map((pt) => {
                    const isSelected = pt.id === activeTimelinePoint.id;
                    return (
                      <TouchableOpacity
                        key={pt.id}
                        activeOpacity={0.8}
                        onPress={() => setSelectedTimelineId(pt.id)}
                        style={[
                          styles.timelinePointBtn,
                          {
                            borderColor: isSelected
                              ? themeColors.primary
                              : themeColors.cardBorder,
                            backgroundColor: isSelected
                              ? themeColors.primaryLight
                              : themeColors.surfaceSubtle,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.timelinePointLabel,
                            {
                              color: isSelected
                                ? themeColors.primary
                                : themeColors.textSecondary,
                              fontWeight: isSelected ? '800' : '600',
                            },
                          ]}
                        >
                          {pt.labelFr}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View
                  style={[
                    styles.timelineDetailBox,
                    {
                      backgroundColor: themeColors.surfaceSubtle,
                      borderColor: themeColors.cardBorder,
                    },
                  ]}
                >
                  <View style={styles.exampleTopRow}>
                    <Text style={[styles.exampleTag, { color: themeColors.primary }]}>
                      {activeTimelinePoint.labelFr} ({activeTimelinePoint.labelEn})
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.75}
                      onPress={() => speakFrench(activeTimelinePoint.exampleFr)}
                      style={[styles.audioPill, { backgroundColor: themeColors.primary }]}
                    >
                      <Volume2 size={13} color="#FFFFFF" />
                      <Text style={styles.audioPillText}>Écouter FR</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={[styles.exampleFrMain, { color: themeColors.textPrimary }]}>
                    {`"${activeTimelinePoint.exampleFr}"`}
                  </Text>
                  <Text style={[styles.exampleEnSub, { color: themeColors.textSecondary }]}>
                    🇬🇧 {activeTimelinePoint.exampleEn}
                  </Text>
                  {(langDisplay === 'dari' || langDisplay === 'both') && (
                    <Text style={[styles.exampleDariSub, { color: themeColors.textMuted }]}>
                      {activeTimelinePoint.exampleDari}
                    </Text>
                  )}
                </View>
              </View>
            )}

            {/* SIDE-BY-SIDE COMPARISON */}
            {lesson.comparison && activeComparisonItem && (
              <View
                style={[
                  styles.sectionCard,
                  {
                    backgroundColor: themeColors.surface,
                    borderColor: themeColors.cardBorder,
                  },
                ]}
              >
                <View style={styles.widgetHeaderRow}>
                  <View style={[styles.badgePillRed, { backgroundColor: '#FEE2E2' }]}>
                    <ArrowLeftRight size={14} color="#DC2626" />
                    <Text style={styles.badgePillRedText}>COMPARAISON DIRECTE (HEMINWAY)</Text>
                  </View>
                </View>

                <Text style={[styles.compTitle, { color: themeColors.textPrimary }]}>
                  {lesson.comparison.titleFr}
                </Text>

                <View style={[styles.compTabBar, { backgroundColor: themeColors.surfaceSubtle }]}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setComparisonTab('A')}
                    style={[
                      styles.compTabBtn,
                      comparisonTab === 'A' && {
                        backgroundColor: themeColors.surface,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.compTabText,
                        {
                          color:
                            comparisonTab === 'A'
                              ? themeColors.primary
                              : themeColors.textSecondary,
                          fontWeight: comparisonTab === 'A' ? '800' : '600',
                        },
                      ]}
                    >
                      {lesson.comparison.itemA.name}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setComparisonTab('B')}
                    style={[
                      styles.compTabBtn,
                      comparisonTab === 'B' && {
                        backgroundColor: themeColors.surface,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.compTabText,
                        {
                          color:
                            comparisonTab === 'B'
                              ? themeColors.primary
                              : themeColors.textSecondary,
                          fontWeight: comparisonTab === 'B' ? '800' : '600',
                        },
                      ]}
                    >
                      {lesson.comparison.itemB.name}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={[
                    styles.compBody,
                    {
                      backgroundColor: themeColors.surfaceSubtle,
                      borderColor: themeColors.cardBorder,
                    },
                  ]}
                >
                  <View style={styles.formRowInline}>
                    <Text style={[styles.formLabel, { color: themeColors.textMuted }]}>
                      FORME :
                    </Text>
                    <View style={[styles.formPill, { backgroundColor: themeColors.primaryLight }]}>
                      <Text style={[styles.formPillText, { color: themeColors.primary }]}>
                        {activeComparisonItem.form}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.conceptFr, { color: themeColors.textPrimary }]}>
                    {activeComparisonItem.conceptFr}
                  </Text>
                  <Text style={[styles.conceptEn, { color: themeColors.textSecondary }]}>
                    🇬🇧 {activeComparisonItem.conceptEn}
                  </Text>
                  {(langDisplay === 'dari' || langDisplay === 'both') && (
                    <Text style={[styles.conceptDari, { color: themeColors.textMuted }]}>
                      {activeComparisonItem.conceptDari}
                    </Text>
                  )}

                  <View style={[styles.compExampleBox, { backgroundColor: themeColors.surface }]}>
                    <View style={styles.exampleTopRow}>
                      <Text style={[styles.exampleTag, { color: themeColors.accent }]}>
                        Exemple français :
                      </Text>
                      <TouchableOpacity
                        activeOpacity={0.75}
                        onPress={() => speakFrench(activeComparisonItem.exampleFr)}
                        style={[styles.audioPill, { backgroundColor: themeColors.primary }]}
                      >
                        <Volume2 size={13} color="#FFFFFF" />
                        <Text style={styles.audioPillText}>Écouter FR</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={[styles.exampleFrMain, { color: themeColors.textPrimary }]}>
                      {`"${activeComparisonItem.exampleFr}"`}
                    </Text>
                    <Text style={[styles.exampleEnSub, { color: themeColors.textSecondary }]}>
                      🇬🇧 {activeComparisonItem.exampleEn}
                    </Text>
                    {(langDisplay === 'dari' || langDisplay === 'both') && (
                      <Text style={[styles.exampleDariSub, { color: themeColors.textMuted }]}>
                        {activeComparisonItem.exampleDari}
                      </Text>
                    )}
                  </View>
                </View>

                <View
                  style={[
                    styles.takeawayBanner,
                    {
                      backgroundColor: isDark ? '#1E1B4B' : '#EEF2FF',
                      borderColor: isDark ? '#3730A3' : '#C7D2FE',
                    },
                  ]}
                >
                  <Sparkles size={16} color="#4F46E5" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.takeawayTitle}>La règle d’or :</Text>
                    <Text
                      style={[
                        styles.takeawayText,
                        { color: isDark ? '#C7D2FE' : '#312E81' },
                      ]}
                    >
                      {lesson.comparison.keyContrastFr}
                    </Text>
                    {(langDisplay === 'dari' || langDisplay === 'both') && (
                      <Text style={[styles.exampleDariSub, { color: isDark ? '#C7D2FE' : '#312E81', marginTop: 4 }]}>
                        {lesson.comparison.keyContrastDari}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            )}

            {/* CONJUGATION & SYNTAX CHART */}
            {lesson.chart && (
              <View
                style={[
                  styles.sectionCard,
                  {
                    backgroundColor: themeColors.surface,
                    borderColor: themeColors.cardBorder,
                  },
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setIsChartExpanded(!isChartExpanded)}
                  style={styles.chartHeader}
                >
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <View style={[styles.chartBadge, { backgroundColor: '#E0E7FF' }]}>
                      <Table size={14} color="#3730A3" />
                      <Text style={styles.chartBadgeText}>
                        TABLEAU INTERACTIF (TOUCHEZ POUR ÉCOUTER 🔊)
                      </Text>
                    </View>
                    <Text style={[styles.compTitle, { color: themeColors.textPrimary }]}>
                      {lesson.chart.titleFr}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.toggleCircle,
                      { backgroundColor: themeColors.surfaceSubtle },
                    ]}
                  >
                    {isChartExpanded ? (
                      <ChevronUp size={18} color={themeColors.textSecondary} />
                    ) : (
                      <ChevronDown size={18} color={themeColors.textSecondary} />
                    )}
                  </View>
                </TouchableOpacity>

                {isChartExpanded && (
                  <View
                    style={[
                      styles.chartTable,
                      { borderColor: themeColors.cardBorder },
                    ]}
                  >
                    <View
                      style={[
                        styles.chartHeaderRow,
                        { backgroundColor: themeColors.surfaceSubtle },
                      ]}
                    >
                      <Text
                        style={[
                          styles.chartColHeader,
                          { flex: 1.1, color: themeColors.textPrimary },
                        ]}
                      >
                        {lesson.chart.headers[0]}
                      </Text>
                      <Text
                        style={[
                          styles.chartColHeader,
                          { flex: 1.6, color: themeColors.textPrimary },
                        ]}
                      >
                        {lesson.chart.headers[1]}
                      </Text>
                      {lesson.chart.headers[2] && (
                        <Text
                          style={[
                            styles.chartColHeader,
                            { flex: 1.3, color: themeColors.textPrimary },
                          ]}
                        >
                          {lesson.chart.headers[2]}
                        </Text>
                      )}
                    </View>

                    {lesson.chart.rows.map((row, idx) => (
                      <TouchableOpacity
                        key={idx}
                        activeOpacity={0.75}
                        onPress={() => speakFrench(row.col2)}
                        style={[
                          styles.chartRow,
                          {
                            borderBottomColor: themeColors.cardBorder,
                            backgroundColor:
                              idx % 2 === 0
                                ? isDark
                                  ? 'rgba(255,255,255,0.02)'
                                  : '#FAFAFA'
                                : 'transparent',
                          },
                        ]}
                      >
                        <View style={{ flex: 1.1, paddingRight: 6 }}>
                          <Text style={[styles.chartCol1, { color: themeColors.primary }]}>
                            {row.col1}
                          </Text>
                        </View>
                        <View style={{ flex: 1.6, paddingRight: 6 }}>
                          <View style={styles.col2AudioRow}>
                            <Text style={[styles.chartCol2, { color: themeColors.textPrimary }]}>
                              {row.col2}
                            </Text>
                            <Volume2 size={13} color={themeColors.primary} />
                          </View>
                          {row.notesFr && (
                            <Text style={[styles.chartRowNote, { color: themeColors.textMuted }]}>
                              {row.notesFr}
                            </Text>
                          )}
                        </View>
                        {row.col3 && (
                          <View style={{ flex: 1.3 }}>
                            <Text
                              style={[styles.chartCol3, { color: themeColors.textSecondary }]}
                            >
                              {row.col3}
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* VOCABULARY BOX (from All-in-One) */}
            {lesson.vocabulary && lesson.vocabulary.length > 0 && (
              <View
                style={[
                  styles.sectionCard,
                  {
                    backgroundColor: themeColors.surface,
                    borderColor: themeColors.cardBorder,
                  },
                ]}
              >
                <Text style={[styles.sectionTitle, { color: themeColors.primary }]}>
                  VOCABULAIRE & EXPRESSIONS CLÉS (CLIQUER POUR ÉCOUTER 🔊)
                </Text>
                <View style={styles.vocabGrid}>
                  {lesson.vocabulary.map((v, idx) => (
                    <TouchableOpacity
                      key={idx}
                      activeOpacity={0.8}
                      onPress={() => speakFrench(v.fr)}
                      style={[
                        styles.vocabChip,
                        {
                          backgroundColor: themeColors.surfaceSubtle,
                          borderColor: themeColors.cardBorder,
                        },
                      ]}
                    >
                      <View style={styles.vocabTopRow}>
                        <Text style={[styles.vocabFr, { color: themeColors.textPrimary }]}>
                          {v.fr}
                        </Text>
                        <Volume2 size={13} color={themeColors.primary} />
                      </View>
                      {v.phonetic && (
                        <Text style={[styles.vocabPhonetic, { color: themeColors.primary }]}>
                          [{v.phonetic}]
                        </Text>
                      )}
                      <Text style={[styles.vocabEn, { color: themeColors.textSecondary }]}>
                        🇬🇧 {v.en}
                      </Text>
                      {(langDisplay === 'dari' || langDisplay === 'both') && (
                        <Text style={[styles.vocabDari, { color: themeColors.textMuted }]}>
                          {v.dari}
                        </Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* IN-DEPTH RULES & EXAMPLES */}
            {lesson.rules && lesson.rules.length > 0 && (
              <View
                style={[
                  styles.sectionCard,
                  {
                    backgroundColor: themeColors.surface,
                    borderColor: themeColors.cardBorder,
                  },
                ]}
              >
                <Text style={[styles.sectionTitle, { color: themeColors.primary }]}>
                  RÈGLES PÉDAGOGIQUES DÉTAILLÉES
                </Text>

                {lesson.rules.map((rule, idx) => (
                  <View
                    key={rule.id || idx}
                    style={[
                      styles.ruleBlock,
                      {
                        borderBottomColor:
                          idx < (lesson.rules?.length || 0) - 1
                            ? themeColors.cardBorder
                            : 'transparent',
                      },
                    ]}
                  >
                    <View style={styles.ruleHeaderRow}>
                      <View
                        style={[
                          styles.ruleNumberPill,
                          { backgroundColor: themeColors.primaryLight },
                        ]}
                      >
                        <Text style={[styles.ruleNumberText, { color: themeColors.primary }]}>
                          {idx + 1}
                        </Text>
                      </View>
                      {rule.isAlert && (
                        <View style={[styles.alertPill, { backgroundColor: '#FEE2E2' }]}>
                          <CircleAlert size={12} color="#DC2626" />
                          <Text style={styles.alertPillText}>RÈGLE CRUCIALE</Text>
                        </View>
                      )}
                    </View>

                    {(langDisplay === 'fr' || langDisplay === 'both') && (
                      <>
                        <Text style={[styles.ruleTextFr, { color: themeColors.textPrimary }]}>
                          {rule.ruleFr}
                        </Text>
                        <Text style={[styles.ruleTextEn, { color: themeColors.textSecondary }]}>
                          🇬🇧 {rule.ruleEn}
                        </Text>
                      </>
                    )}

                    {(langDisplay === 'dari' || langDisplay === 'both') && rule.ruleDari ? (
                      <Text style={[styles.ruleTextDari, { color: themeColors.textSecondary }]}>
                        {rule.ruleDari}
                      </Text>
                    ) : null}

                    <View
                      style={[
                        styles.ruleExampleBox,
                        { backgroundColor: themeColors.surfaceSubtle },
                      ]}
                    >
                      <View style={styles.exampleTopRow}>
                        <Text style={[styles.exampleFrMain, { color: themeColors.textPrimary, flex: 1 }]}>
                          {`"${rule.exampleFr}"`}
                        </Text>
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => speakFrench(rule.exampleFr)}
                          style={[styles.audioPill, { backgroundColor: themeColors.primary }]}
                        >
                          <Volume2 size={13} color="#FFFFFF" />
                          <Text style={styles.audioPillText}>FR</Text>
                        </TouchableOpacity>
                      </View>

                      <Text style={[styles.exampleEnSub, { color: themeColors.textSecondary }]}>
                        🇬🇧 {rule.exampleEn}
                      </Text>

                      {(langDisplay === 'dari' || langDisplay === 'both') && rule.exampleDari ? (
                        <Text style={[styles.exampleDariSub, { color: themeColors.textMuted }]}>
                          {rule.exampleDari}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* TROUBLESOME NOTES / COMMON TRAPS */}
            {lesson.troublesomeNotes && (
              <View
                style={[
                  styles.trapsCard,
                  {
                    backgroundColor: isDark ? '#1C1917' : '#FFFBEB',
                    borderColor: '#FDE68A',
                  },
                ]}
              >
                <View style={styles.trapsHeader}>
                  <CircleAlert size={18} color="#D97706" />
                  <Text style={styles.trapsTitle}>
                    {lesson.troublesomeNotes.titleFr}
                  </Text>
                </View>

                {lesson.troublesomeNotes.pairs.map((p, idx) => (
                  <View key={idx} style={styles.trapItem}>
                    <View style={styles.trapRowWrong}>
                      <Text style={styles.trapWrongCross}>✗</Text>
                      <Text style={styles.trapWrongText}>{p.wrong}</Text>
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.75}
                      onPress={() => speakFrench(p.right)}
                      style={styles.trapRowRight}
                    >
                      <Text style={styles.trapRightCheck}>✓</Text>
                      <Text style={[styles.trapRightText, { flex: 1 }]}>{p.right}</Text>
                      <Volume2 size={14} color="#16A34A" />
                    </TouchableOpacity>
                    <Text style={[styles.trapExplanation, { color: themeColors.textSecondary }]}>
                      {p.explanationFr}
                    </Text>
                    {(langDisplay === 'dari' || langDisplay === 'both') && p.explanationDari && (
                      <Text style={[styles.exampleDariSub, { color: themeColors.textMuted, marginTop: 2 }]}>
                        {p.explanationDari}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* CTA: GO TO PRACTICE */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => handleTabSwitch('practice')}
              style={[styles.practiceCtaButton, { backgroundColor: themeColors.primary }]}
            >
              <GraduationCap size={20} color="#FFFFFF" />
              <Text style={styles.practiceCtaText}>
                Passer aux Exercices Interactifs ({exercises.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleMarkComplete}
              style={[
                styles.markCompleteButton,
                {
                  borderColor: isCompleted ? '#86EFAC' : themeColors.cardBorder,
                  backgroundColor: isCompleted ? '#DCFCE7' : themeColors.surface,
                },
              ]}
            >
              <CircleCheck size={18} color={isCompleted ? '#16A34A' : themeColors.textMuted} />
              <Text
                style={[
                  styles.markCompleteText,
                  { color: isCompleted ? '#16A34A' : themeColors.textSecondary },
                ]}
              >
                {isCompleted ? 'Leçon validée dans votre profil' : 'Marquer comme comprise'}
              </Text>
            </TouchableOpacity>

            {/* Previous / Next French Unit Navigation + Vocabulary Link */}
            <View style={styles.unitNavRow}>
              <TouchableOpacity
                disabled={!prevLesson}
                onPress={() => prevLesson && router.replace(`/grammar/${prevLesson.id}`)}
                style={[
                  styles.unitNavBtn,
                  {
                    backgroundColor: themeColors.surface,
                    borderColor: themeColors.cardBorder,
                    opacity: prevLesson ? 1 : 0.4,
                  },
                ]}
              >
                <ArrowLeft size={16} color={themeColors.textPrimary} />
                <Text
                  numberOfLines={1}
                  style={[styles.unitNavText, { color: themeColors.textPrimary }]}
                >
                  {prevLesson ? `Unité ${prevLesson.unitNumber}` : 'Début'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/vocabulary' as any)}
                style={[
                  styles.unitNavBtn,
                  { backgroundColor: '#ECFDF5', borderColor: '#6EE7B7' },
                ]}
              >
                <Sparkles size={15} color="#059669" />
                <Text style={[styles.unitNavText, { color: '#059669' }]}>
                  Vocabulaire
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={!nextLesson}
                onPress={() => nextLesson && router.replace(`/grammar/${nextLesson.id}`)}
                style={[
                  styles.unitNavBtn,
                  {
                    backgroundColor: themeColors.surface,
                    borderColor: themeColors.cardBorder,
                    opacity: nextLesson ? 1 : 0.4,
                  },
                ]}
              >
                <Text
                  numberOfLines={1}
                  style={[styles.unitNavText, { color: themeColors.textPrimary }]}
                >
                  {nextLesson ? `Unité ${nextLesson.unitNumber}` : 'Fin'}
                </Text>
                <ArrowRight size={16} color={themeColors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* TAB 2: INTERACTIVE FRENCH PRACTICE ENGINE */
          <View style={styles.practiceSection}>
            {isFinished ? (
              <View
                style={[
                  styles.sectionCard,
                  {
                    backgroundColor: themeColors.surface,
                    borderColor: themeColors.cardBorder,
                    alignItems: 'center',
                    paddingVertical: 28,
                  },
                ]}
              >
                <View
                  style={[
                    styles.finishedIconCircle,
                    {
                      backgroundColor:
                        Math.round((score / exercises.length) * 100) >= 80
                          ? '#DCFCE7'
                          : '#FEF3C7',
                    },
                  ]}
                >
                  {Math.round((score / exercises.length) * 100) >= 80 ? (
                    <Award size={48} color="#16A34A" />
                  ) : (
                    <Sparkles size={48} color="#D97706" />
                  )}
                </View>

                <Text style={[styles.finishedTitle, { color: themeColors.textPrimary }]}>
                  {Math.round((score / exercises.length) * 100) >= 80
                    ? 'Unité Française Maîtrisée !'
                    : 'Bon entraînement !'}
                </Text>

                <Text style={[styles.finishedSubtitle, { color: themeColors.textSecondary }]}>
                  {lesson.titleFr}
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
                  <Text style={[styles.scoreNumber, { color: themeColors.primary }]}>
                    {score} / {exercises.length}
                  </Text>
                  <Text style={[styles.scorePercent, { color: themeColors.textSecondary }]}>
                    ({Math.round((score / exercises.length) * 100)}%)
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleRestartQuiz}
                  style={[styles.practiceCtaButton, { backgroundColor: themeColors.primary, width: '100%' }]}
                >
                  <RotateCcw size={18} color="#FFFFFF" />
                  <Text style={styles.practiceCtaText}>Recommencer l’entraînement</Text>
                </TouchableOpacity>
              </View>
            ) : currentExercise ? (
              <View
                style={[
                  styles.sectionCard,
                  {
                    backgroundColor: themeColors.surface,
                    borderColor: themeColors.cardBorder,
                  },
                ]}
              >
                {/* Header */}
                <View style={styles.exerciseHeader}>
                  <View style={styles.exerciseProgressInfo}>
                    <Text style={[styles.questionCounter, { color: themeColors.textMuted }]}>
                      Exercice {currentIndex + 1} sur {exercises.length}
                    </Text>
                    <View
                      style={[
                        styles.sourcePill,
                        { backgroundColor: themeColors.surfaceSubtle },
                      ]}
                    >
                      <Text style={[styles.sourcePillText, { color: themeColors.primary }]}>
                        {currentExercise.sourceRef}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.progressBarTrack,
                      { backgroundColor: themeColors.surfaceSubtle },
                    ]}
                  >
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

                {/* Prompt */}
                <View style={styles.promptArea}>
                  <Text style={[styles.promptFr, { color: themeColors.textPrimary }]}>
                    {currentExercise.promptFr}
                  </Text>
                  <Text style={[styles.promptEn, { color: themeColors.textSecondary }]}>
                    🇬🇧 {currentExercise.promptEn}
                  </Text>
                  {(langDisplay === 'dari' || langDisplay === 'both') && (
                    <Text style={[styles.promptDari, { color: themeColors.textMuted }]}>
                      {currentExercise.promptDari}
                    </Text>
                  )}
                </View>

                {/* 1. MULTIPLE CHOICE */}
                {currentExercise.type === 'multiple-choice' && (
                  <View style={styles.drillBody}>
                    <View
                      style={[
                        styles.sentenceBox,
                        { backgroundColor: themeColors.surfaceSubtle },
                      ]}
                    >
                      <View style={styles.exampleTopRow}>
                        <Text
                          style={[
                            styles.sentenceText,
                            { color: themeColors.textPrimary, flex: 1 },
                          ]}
                        >
                          {(currentExercise as FrenchMultipleChoiceExercise).sentence}
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            speakFrench(
                              (currentExercise as FrenchMultipleChoiceExercise).sentence.replace(
                                '___',
                                (currentExercise as FrenchMultipleChoiceExercise).correctAnswer
                              )
                            )
                          }
                          style={[styles.audioPill, { backgroundColor: themeColors.primary }]}
                        >
                          <Volume2 size={14} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                      {(currentExercise as FrenchMultipleChoiceExercise).translationEn && (
                        <Text style={[styles.exampleEnSub, { color: themeColors.textSecondary, marginTop: 4 }]}>
                          🇬🇧 {(currentExercise as FrenchMultipleChoiceExercise).translationEn}
                        </Text>
                      )}
                      {(langDisplay === 'dari' || langDisplay === 'both') &&
                        (currentExercise as FrenchMultipleChoiceExercise).translationDari && (
                          <Text style={[styles.exampleDariSub, { color: themeColors.textMuted }]}>
                            {(currentExercise as FrenchMultipleChoiceExercise).translationDari}
                          </Text>
                        )}
                    </View>

                    <View style={styles.optionsList}>
                      {(currentExercise as FrenchMultipleChoiceExercise).options.map((opt, i) => {
                        const isSelected = selectedOption === opt;
                        let btnStyle = {};
                        let textStyle = {};

                        if (isAnswerChecked) {
                          if (
                            opt ===
                            (currentExercise as FrenchMultipleChoiceExercise).correctAnswer
                          ) {
                            btnStyle = {
                              backgroundColor: '#DCFCE7',
                              borderColor: '#16A34A',
                            };
                            textStyle = { color: '#16A34A', fontWeight: '800' as const };
                          } else if (isSelected) {
                            btnStyle = {
                              backgroundColor: '#FEE2E2',
                              borderColor: '#EF4444',
                            };
                            textStyle = { color: '#EF4444' };
                          }
                        } else if (isSelected) {
                          btnStyle = {
                            backgroundColor: themeColors.primaryLight,
                            borderColor: themeColors.primary,
                          };
                          textStyle = {
                            color: themeColors.primary,
                            fontWeight: '700' as const,
                          };
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
                    <View
                      style={[
                        styles.sentenceBox,
                        { backgroundColor: themeColors.surfaceSubtle },
                      ]}
                    >
                      <Text style={[styles.exampleEnSub, { color: themeColors.textPrimary, fontWeight: '700' }]}>
                        🇬🇧 {(currentExercise as FrenchSentenceScrambleExercise).translationEn}
                      </Text>
                      {(langDisplay === 'dari' || langDisplay === 'both') && (
                        <Text style={[styles.exampleDariSub, { color: themeColors.textSecondary }]}>
                          {(currentExercise as FrenchSentenceScrambleExercise).translationDari}
                        </Text>
                      )}
                    </View>

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
                          Touchez les mots français ci-dessous dans l’ordre...
                        </Text>
                      ) : (
                        <View style={styles.tokenFlow}>
                          {scrambleAnswer.map((tok, idx) => (
                            <TouchableOpacity
                              key={idx}
                              activeOpacity={0.7}
                              disabled={isAnswerChecked}
                              onPress={() => handleRemoveScrambleToken(idx)}
                              style={[
                                styles.tokenActivePill,
                                { backgroundColor: themeColors.primary },
                              ]}
                            >
                              <Text style={styles.tokenActiveText}>{tok}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>

                    <View style={styles.wordBank}>
                      {(currentExercise as FrenchSentenceScrambleExercise).tokens.map(
                        (token, idx) => {
                          const countInAnswer = scrambleAnswer.filter(
                            (t) => t === token
                          ).length;
                          const totalInTokens = (
                            currentExercise as FrenchSentenceScrambleExercise
                          ).tokens.filter((t) => t === token).length;
                          const isUsed = countInAnswer >= totalInTokens;

                          return (
                            <TouchableOpacity
                              key={idx}
                              activeOpacity={0.75}
                              disabled={isUsed || isAnswerChecked}
                              onPress={() => handleTapScrambleToken(token)}
                              style={[
                                styles.tokenBankPill,
                                {
                                  backgroundColor: themeColors.surface,
                                  borderColor: themeColors.cardBorder,
                                  opacity: isUsed ? 0.35 : 1,
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.tokenBankText,
                                  { color: themeColors.textPrimary },
                                ]}
                              >
                                {token}
                              </Text>
                            </TouchableOpacity>
                          );
                        }
                      )}
                    </View>
                  </View>
                )}

                {/* 3. ERROR HUNTER */}
                {currentExercise.type === 'error-hunter' && (
                  <View style={styles.drillBody}>
                    <Text style={[styles.errorHunterNote, { color: themeColors.textMuted }]}>
                      Touchez le segment qui contient une erreur grammaticale :
                    </Text>

                    <View style={styles.segmentsRow}>
                      {(currentExercise as FrenchErrorHunterExercise).segments.map(
                        (seg, idx) => {
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
                                  isSelected && {
                                    color: themeColors.primary,
                                    fontWeight: '700',
                                  },
                                  isAnswerChecked &&
                                    seg.isError && {
                                      color: '#16A34A',
                                      fontWeight: '800',
                                    },
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
                        }
                      )}
                    </View>
                  </View>
                )}

                {/* 4. DISCRIMINATION */}
                {currentExercise.type === 'discrimination' && (
                  <View style={styles.drillBody}>
                    <View
                      style={[
                        styles.sentenceBox,
                        { backgroundColor: themeColors.surfaceSubtle },
                      ]}
                    >
                      <Text style={[styles.exampleTag, { color: themeColors.primary }]}>
                        Sens recherché :
                      </Text>
                      <Text style={[styles.exampleFrMain, { color: themeColors.textPrimary }]}>
                        {`"${(currentExercise as FrenchDiscriminationExercise).targetMeaningFr}"`}
                      </Text>
                      <Text style={[styles.exampleEnSub, { color: themeColors.textSecondary }]}>
                        🇬🇧 {(currentExercise as FrenchDiscriminationExercise).targetMeaningEn}
                      </Text>
                      {(langDisplay === 'dari' || langDisplay === 'both') && (
                        <Text style={[styles.exampleDariSub, { color: themeColors.textMuted }]}>
                          {(currentExercise as FrenchDiscriminationExercise).targetMeaningDari}
                        </Text>
                      )}
                    </View>

                    <View style={styles.optionsList}>
                      {(currentExercise as FrenchDiscriminationExercise).options.map(
                        (opt, i) => {
                          const isSelected = selectedOption === opt.sentence;
                          let btnStyle = {};
                          let textStyle = {};

                          if (isAnswerChecked) {
                            if (opt.isCorrect) {
                              btnStyle = {
                                backgroundColor: '#DCFCE7',
                                borderColor: '#16A34A',
                              };
                              textStyle = { color: '#16A34A', fontWeight: '800' as const };
                            } else if (isSelected) {
                              btnStyle = {
                                backgroundColor: '#FEE2E2',
                                borderColor: '#EF4444',
                              };
                              textStyle = { color: '#EF4444' };
                            }
                          } else if (isSelected) {
                            btnStyle = {
                              backgroundColor: themeColors.primaryLight,
                              borderColor: themeColors.primary,
                            };
                            textStyle = {
                              color: themeColors.primary,
                              fontWeight: '700' as const,
                            };
                          }

                          return (
                            <TouchableOpacity
                              key={i}
                              activeOpacity={0.8}
                              disabled={isAnswerChecked}
                              onPress={() => handleSelectMC(opt.sentence)}
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
                        }
                      )}
                    </View>
                  </View>
                )}

                {/* FEEDBACK PANEL */}
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
                          <Text style={styles.feedbackCorrectTitle}>
                            Exact ! Très bonne réponse
                          </Text>
                        </>
                      ) : (
                        <>
                          <CircleX size={20} color="#DC2626" />
                          <Text style={styles.feedbackIncorrectTitle}>
                            Attention à la règle...
                          </Text>
                        </>
                      )}
                    </View>
                    <Text style={styles.feedbackExplanation}>
                      {currentExercise.explanationFr}
                    </Text>
                    <Text style={[styles.feedbackExplanation, { marginTop: 4, color: '#475569' }]}>
                      🇬🇧 {currentExercise.explanationEn}
                    </Text>
                    {(langDisplay === 'dari' || langDisplay === 'both') &&
                      currentExercise.explanationDari && (
                        <Text style={styles.feedbackExplanationDari}>
                          {currentExercise.explanationDari}
                        </Text>
                      )}
                  </View>
                )}

                {/* ACTION BUTTON */}
                <View style={{ marginTop: 6 }}>
                  {!isAnswerChecked ? (
                    <TouchableOpacity
                      activeOpacity={0.85}
                      disabled={!hasSelection}
                      onPress={handleCheckAnswer}
                      style={[
                        styles.practiceCtaButton,
                        {
                          backgroundColor: hasSelection
                            ? themeColors.primary
                            : themeColors.cardBorder,
                        },
                      ]}
                    >
                      <Text style={styles.practiceCtaText}>Vérifier la réponse</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={handleNextQuestion}
                      style={[
                        styles.practiceCtaButton,
                        {
                          backgroundColor: isCurrentCorrect
                            ? '#16A34A'
                            : themeColors.primary,
                        },
                      ]}
                    >
                      <Text style={styles.practiceCtaText}>
                        {currentIndex + 1 < exercises.length
                          ? 'Question suivante'
                          : 'Terminer l’entraînement'}
                      </Text>
                      <ArrowRight size={18} color="#FFFFFF" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ) : null}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  backBtn: {
    paddingRight: 10,
  },
  topBarCenter: {
    flex: 1,
  },
  topBarTitle: {
    fontSize: 14.5,
    fontWeight: '800',
  },
  langToggleGroup: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 2,
  },
  langPill: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  langPillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderBottomWidth: 2.5,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 13.5,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },
  learnSection: {
    gap: 12,
  },
  practiceSection: {},
  heroCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  unitBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  unitBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  levelBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  levelBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284C7',
  },
  sourcePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  sourcePillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  lessonTitleFr: {
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 26,
    marginBottom: 2,
  },
  lessonTitleEn: {
    fontSize: 14.5,
    fontWeight: '600',
    marginBottom: 4,
  },
  lessonTitleDari: {
    fontSize: 14,
    textAlign: 'right',
    marginBottom: 8,
  },
  summaryFr: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  summaryEn: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  summaryDari: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'right',
    marginTop: 4,
  },
  sectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  formulaRow: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  formulaType: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#64748B',
    marginBottom: 2,
  },
  formulaText: {
    fontSize: 13.5,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  formulaNote: {
    fontSize: 12.5,
    lineHeight: 17,
    marginTop: 6,
    fontStyle: 'italic',
  },
  formulaNoteDari: {
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'right',
    marginTop: 4,
  },
  widgetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  widgetDesc: {
    fontSize: 13.5,
    lineHeight: 19,
    marginBottom: 6,
  },
  widgetDescDari: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'right',
    marginBottom: 10,
  },
  timelinePointsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 10,
  },
  timelinePointBtn: {
    flex: 1,
    minWidth: 95,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  timelinePointLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  timelineDetailBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginTop: 4,
  },
  exampleTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  exampleTag: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  audioPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  audioPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  exampleFrMain: {
    fontSize: 15,
    fontWeight: '700',
    fontStyle: 'italic',
    marginBottom: 3,
  },
  exampleEnSub: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 2,
  },
  exampleDariSub: {
    fontSize: 12.5,
    lineHeight: 18,
    textAlign: 'right',
  },
  badgePillRed: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgePillRedText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#DC2626',
  },
  compTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    lineHeight: 21,
    marginBottom: 10,
  },
  compTabBar: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 4,
    marginBottom: 12,
  },
  compTabBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  compTabText: {
    fontSize: 12.5,
  },
  compBody: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },
  formRowInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  formLabel: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  formPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  formPillText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  conceptFr: {
    fontSize: 13.5,
    lineHeight: 19,
    marginBottom: 3,
  },
  conceptEn: {
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 4,
  },
  conceptDari: {
    fontSize: 12.5,
    lineHeight: 18,
    textAlign: 'right',
    marginBottom: 8,
  },
  compExampleBox: {
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
  },
  takeawayBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  takeawayTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4F46E5',
    marginBottom: 2,
  },
  takeawayText: {
    fontSize: 13,
    lineHeight: 18,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 4,
  },
  chartBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#3730A3',
  },
  toggleCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartTable: {
    marginTop: 8,
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  chartHeaderRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  chartColHeader: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  chartRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  chartCol1: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  col2AudioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chartCol2: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  chartRowNote: {
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 2,
  },
  chartCol3: {
    fontSize: 12,
    lineHeight: 16,
  },
  vocabGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  vocabChip: {
    minWidth: '47%',
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
  },
  vocabTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  vocabFr: {
    fontSize: 14,
    fontWeight: '800',
  },
  vocabPhonetic: {
    fontSize: 11,
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  vocabEn: {
    fontSize: 12,
    marginBottom: 2,
  },
  vocabDari: {
    fontSize: 12,
    textAlign: 'right',
  },
  ruleBlock: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  ruleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  ruleNumberPill: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ruleNumberText: {
    fontSize: 12,
    fontWeight: '800',
  },
  alertPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  alertPillText: {
    color: '#DC2626',
    fontSize: 10,
    fontWeight: '800',
  },
  ruleTextFr: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 3,
  },
  ruleTextEn: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  ruleTextDari: {
    fontSize: 13.5,
    lineHeight: 19,
    textAlign: 'right',
    marginBottom: 8,
  },
  ruleExampleBox: {
    borderRadius: 10,
    padding: 12,
    marginTop: 4,
  },
  trapsCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  trapsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  trapsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#D97706',
    flex: 1,
  },
  trapItem: {
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(217, 119, 6, 0.15)',
  },
  trapRowWrong: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  trapWrongCross: {
    color: '#DC2626',
    fontWeight: '900',
    fontSize: 14,
  },
  trapWrongText: {
    color: '#DC2626',
    fontSize: 13.5,
    textDecorationLine: 'line-through',
    fontWeight: '600',
  },
  trapRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  trapRightCheck: {
    color: '#16A34A',
    fontWeight: '900',
    fontSize: 14,
  },
  trapRightText: {
    color: '#16A34A',
    fontSize: 14,
    fontWeight: '800',
  },
  trapExplanation: {
    fontSize: 12.5,
    lineHeight: 17,
    fontStyle: 'italic',
  },
  practiceCtaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 4,
  },
  practiceCtaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  markCompleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  markCompleteText: {
    fontSize: 13.5,
    fontWeight: '700',
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
  promptEn: {
    fontSize: 13,
    marginTop: 2,
  },
  promptDari: {
    fontSize: 13,
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
    fontWeight: '700',
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
  errorHunterNote: {
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
  feedbackPanel: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  feedbackCorrectTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#16A34A',
  },
  feedbackIncorrectTitle: {
    fontSize: 14,
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
    lineHeight: 18,
    color: '#334155',
    textAlign: 'right',
    marginTop: 4,
  },
  finishedIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 18,
  },
  scoreNumber: {
    fontSize: 22,
    fontWeight: '900',
  },
  scorePercent: {
    fontSize: 15,
    fontWeight: '700',
  },
  unitNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 6,
  },
  unitNavBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  unitNavText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
});
