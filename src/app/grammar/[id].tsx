import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  BookOpen,
  Volume2,
  CircleCheck,
  CircleAlert,
  GraduationCap,
  Sparkles,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useApp } from '../../context/AppContext';
import { useResponsive } from '../../hooks/useResponsive';
import { getLessonById } from '../../data/grammar';
import { getFrenchLessonById } from '../../data/frenchGrammar';
import { GrammarTimeline } from '../../components/grammar/GrammarTimeline';
import { GrammarComparison } from '../../components/grammar/GrammarComparison';
import { AzarFormulaChart } from '../../components/grammar/AzarFormulaChart';
import { GrammarPracticeEngine } from '../../components/grammar/GrammarPracticeEngine';
import { FrenchLessonView } from '../../components/grammar/FrenchLessonView';
import { SpeechService } from '../../services/speech';

type ActiveTab = 'learn' | 'practice';
type LangDisplay = 'fr' | 'dari' | 'both';

export default function GrammarLessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { themeColors, isDark, grammarProgress, markGrammarLessonComplete } = useApp();
  const { contentMaxWidth } = useResponsive();

  const [activeTab, setActiveTab] = useState<ActiveTab>('learn');
  const [langDisplay, setLangDisplay] = useState<LangDisplay>('both');

  const frenchLesson = getFrenchLessonById(id || '');
  const lesson = getLessonById(id || '');

  if (frenchLesson) {
    return <FrenchLessonView lesson={frenchLesson} />;
  }

  if (!lesson) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
        <View style={styles.notFoundContainer}>
          <Text style={[styles.notFoundTitle, { color: themeColors.textPrimary }]}>
            Leçon introuvable
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backHomeBtn, { backgroundColor: themeColors.primary }]}
          >
            <Text style={styles.backHomeText}>Retour à la liste</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isCompleted = grammarProgress.completedLessonIds.includes(lesson.id);

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

  const playAudio = (text: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Ignore
    }
    SpeechService.speak(text, 'en');
  };

  const handleMarkComplete = async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Ignore
    }
    await markGrammarLessonComplete(lesson.id);
  };

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
              FR
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

      {/* SEGMENTED TAB SWITCHER (Learn vs Practice) */}
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
            activeTab === 'learn' && [
              styles.tabItemActive,
              { borderBottomColor: themeColors.primary },
            ],
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
            Leçon & Règles
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleTabSwitch('practice')}
          style={[
            styles.tabItem,
            activeTab === 'practice' && [
              styles.tabItemActive,
              { borderBottomColor: themeColors.primary },
            ],
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
            Pratique ({lesson.exercises.length})
          </Text>
          {isCompleted && (
            <View style={styles.completedTabDot}>
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
          /* TAB 1: LESSON CONTENT */
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
                    UNITÉ {lesson.unitNumber}
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

              {/* Dari Title */}
              {(langDisplay === 'dari' || langDisplay === 'both') && lesson.titleDari ? (
                <Text style={[styles.lessonTitleDari, { color: themeColors.textMuted }]}>
                  {lesson.titleDari}
                </Text>
              ) : null}

              {/* Summary */}
              {(langDisplay === 'fr' || langDisplay === 'both') && (
                <Text style={[styles.summaryFr, { color: themeColors.textSecondary }]}>
                  {lesson.summaryFr}
                </Text>
              )}
              {(langDisplay === 'dari' || langDisplay === 'both') && lesson.summaryDari ? (
                <Text style={[styles.summaryDari, { color: themeColors.textMuted }]}>
                  {lesson.summaryDari}
                </Text>
              ) : null}
            </View>

            {/* FORMULA CARD (if available) */}
            {lesson.formula && (
              <View
                style={[
                  styles.formulaCard,
                  {
                    backgroundColor: themeColors.surface,
                    borderColor: themeColors.cardBorder,
                  },
                ]}
              >
                <Text style={[styles.sectionTitle, { color: themeColors.primary }]}>
                  FORMULES & STRUCTURES CLEFS
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
                  <Text style={styles.formulaType}>Forme Interrogative (?)</Text>
                  <Text style={[styles.formulaText, { color: themeColors.textPrimary }]}>
                    {lesson.formula.question}
                  </Text>
                </View>

                {lesson.formula.notesFr && (langDisplay === 'fr' || langDisplay === 'both') && (
                  <Text style={[styles.formulaNote, { color: themeColors.textSecondary }]}>
                    {lesson.formula.notesFr}
                  </Text>
                )}
                {lesson.formula.notesDari && (langDisplay === 'dari' || langDisplay === 'both') && (
                  <Text style={[styles.formulaNoteDari, { color: themeColors.textMuted }]}>
                    {lesson.formula.notesDari}
                  </Text>
                )}
              </View>
            )}

            {/* TIMELINE VISUALIZER (if available) */}
            {lesson.timeline && (
              <GrammarTimeline
                descriptionEn={lesson.timeline.descriptionEn}
                descriptionFr={lesson.timeline.descriptionFr}
                descriptionDari={lesson.timeline.descriptionDari}
                points={lesson.timeline.points}
              />
            )}

            {/* RAYMOND MURPHY SIDE-BY-SIDE COMPARISON (if available) */}
            {lesson.comparison && (
              <GrammarComparison comparison={lesson.comparison} />
            )}

            {/* BETTY AZAR SYNTAX CHART (if available) */}
            {lesson.chart && (
              <AzarFormulaChart chart={lesson.chart} />
            )}

            {/* IN-DEPTH RULES & EXAMPLES */}
            <View
              style={[
                styles.rulesCard,
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
                        idx < lesson.rules.length - 1
                          ? isDark
                            ? 'rgba(255,255,255,0.06)'
                            : '#E2E8F0'
                          : 'transparent',
                    },
                  ]}
                >
                  <View style={styles.ruleHeaderRow}>
                    <View style={[styles.ruleNumberPill, { backgroundColor: themeColors.primaryLight }]}>
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
                    <Text style={[styles.ruleTextFr, { color: themeColors.textPrimary }]}>
                      {rule.ruleFr}
                    </Text>
                  )}

                  {(langDisplay === 'dari' || langDisplay === 'both') && rule.ruleDari ? (
                    <Text style={[styles.ruleTextDari, { color: themeColors.textSecondary }]}>
                      {rule.ruleDari}
                    </Text>
                  ) : null}

                  {/* Audio Example Box */}
                  <View style={[styles.ruleExampleBox, { backgroundColor: themeColors.surfaceSubtle }]}>
                    <View style={styles.ruleExampleTop}>
                      <Text style={[styles.exampleEnText, { color: themeColors.textPrimary }]}>
                        {`"${rule.exampleEn}"`}
                      </Text>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => playAudio(rule.exampleEn)}
                        style={[styles.audioPill, { backgroundColor: themeColors.primary }]}
                      >
                        <Volume2 size={13} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>

                    {(langDisplay === 'fr' || langDisplay === 'both') && (
                      <Text style={[styles.exampleFrText, { color: themeColors.textSecondary }]}>
                        {rule.exampleFr}
                      </Text>
                    )}

                    {(langDisplay === 'dari' || langDisplay === 'both') && rule.exampleDari ? (
                      <Text style={[styles.exampleDariText, { color: themeColors.textMuted }]}>
                        {rule.exampleDari}
                      </Text>
                    ) : null}
                  </View>
                </View>
              ))}
            </View>

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
                    {lesson.troublesomeNotes.titleFr || lesson.troublesomeNotes.titleEn}
                  </Text>
                </View>

                {lesson.troublesomeNotes.pairs.map((p, idx) => (
                  <View key={idx} style={styles.trapItem}>
                    <View style={styles.trapRowWrong}>
                      <Text style={styles.trapWrongCross}>✗</Text>
                      <Text style={styles.trapWrongText}>{p.wrong}</Text>
                    </View>
                    <View style={styles.trapRowRight}>
                      <Text style={styles.trapRightCheck}>✓</Text>
                      <Text style={styles.trapRightText}>{p.right}</Text>
                    </View>
                    <Text style={[styles.trapExplanation, { color: themeColors.textSecondary }]}>
                      {p.explanationFr}
                    </Text>
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
                Passer aux Exercices Interactifs ({lesson.exercises.length})
              </Text>
            </TouchableOpacity>

            {/* Mark as Complete Manual Button */}
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
          </View>
        ) : (
          /* TAB 2: INTERACTIVE PRACTICE DRILLS */
          <View style={styles.practiceSection}>
            <GrammarPracticeEngine
              lessonId={lesson.id}
              lessonTitle={lesson.titleFr}
              exercises={lesson.exercises}
              onComplete={() => {
                // Done callback
              }}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
  },
  backHomeBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  backHomeText: {
    color: '#FFFFFF',
    fontWeight: '700',
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
    position: 'relative',
  },
  tabItemActive: {},
  tabText: {
    fontSize: 13.5,
  },
  completedTabDot: {
    marginLeft: 2,
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
    fontSize: 15,
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
  summaryDari: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'right',
    marginTop: 4,
  },
  formulaCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 12.5,
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
    marginTop: 2,
  },
  rulesCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
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
    letterSpacing: 0.3,
  },
  ruleTextFr: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 3,
  },
  ruleTextDari: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'right',
    marginBottom: 6,
  },
  ruleExampleBox: {
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
  },
  ruleExampleTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  exampleEnText: {
    fontSize: 14.5,
    fontWeight: '700',
    fontStyle: 'italic',
    flex: 1,
    paddingRight: 8,
  },
  audioPill: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exampleFrText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 2,
  },
  exampleDariText: {
    fontSize: 12.5,
    textAlign: 'right',
  },
  trapsCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
  },
  trapsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  trapsTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#B45309',
  },
  trapItem: {
    marginBottom: 10,
  },
  trapRowWrong: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  trapWrongCross: {
    color: '#DC2626',
    fontWeight: '900',
    fontSize: 14,
  },
  trapWrongText: {
    color: '#DC2626',
    fontSize: 13,
    textDecorationLine: 'line-through',
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
    fontSize: 13,
    fontWeight: '700',
  },
  trapExplanation: {
    fontSize: 12,
    lineHeight: 16,
    fontStyle: 'italic',
  },
  practiceCtaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 6,
  },
  practiceCtaText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
  },
  markCompleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  markCompleteText: {
    fontSize: 13.5,
    fontWeight: '700',
  },
});
