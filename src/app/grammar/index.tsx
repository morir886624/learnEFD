import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { GraduationCap, SearchX } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useApp } from '../../context/AppContext';
import { useResponsive } from '../../hooks/useResponsive';
import { GRAMMAR_MODULES, ALL_GRAMMAR_LESSONS } from '../../data/grammar';
import {
  FRENCH_GRAMMAR_MODULES,
  FRENCH_GRAMMAR_LESSONS,
} from '../../data/frenchGrammar';
import { FrenchVerbConjugator } from '../../components/grammar/FrenchVerbConjugator';
import { GrammarCard } from '../../components/grammar/GrammarCard';
import { GrammarLevel } from '../../types/grammar';
import { GrammarLanguage, FrenchSubTab } from '../../components/grammar/hub/types';
import { GrammarLanguageSwitcher } from '../../components/grammar/hub/GrammarLanguageSwitcher';
import { GrammarCourseOverview } from '../../components/grammar/hub/GrammarCourseOverview';
import { GrammarFilterToolbar } from '../../components/grammar/hub/GrammarFilterToolbar';
import { GrammarModuleAccordion } from '../../components/grammar/hub/GrammarModuleAccordion';

export default function GrammarIndexScreen() {
  const { themeColors, grammarProgress } = useApp();
  const { contentMaxWidth } = useResponsive();

  // Primary active language: French or English
  const [activeLanguage, setActiveLanguage] = useState<GrammarLanguage>('fr');

  // French sub-tab: Lessons curriculum or Verb conjugator studio
  const [frenchSubTab, setFrenchSubTab] = useState<FrenchSubTab>('lessons');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<GrammarLevel | 'ALL'>('ALL');

  // Expanded modules state: Set of module IDs
  const [expandedModuleIds, setExpandedModuleIds] = useState<Set<string>>(
    () => new Set(['fr-mod-nouns-articles', 'mod-tenses-present-past'])
  );

  // Switch language handler
  const handleSelectLanguage = (lang: GrammarLanguage) => {
    setActiveLanguage(lang);
    setSearchQuery('');
    setSelectedLevel('ALL');
  };

  // Next uncompleted lessons for quick resume
  const nextFrenchLesson = useMemo(() => {
    return (
      FRENCH_GRAMMAR_LESSONS.find(
        (l) => !grammarProgress.completedLessonIds.includes(l.id)
      ) || FRENCH_GRAMMAR_LESSONS[0]
    );
  }, [grammarProgress.completedLessonIds]);

  const nextEnglishLesson = useMemo(() => {
    return (
      ALL_GRAMMAR_LESSONS.find(
        (l) => !grammarProgress.completedLessonIds.includes(l.id)
      ) || ALL_GRAMMAR_LESSONS[0]
    );
  }, [grammarProgress.completedLessonIds]);

  // Counts
  const frenchTotal = FRENCH_GRAMMAR_LESSONS.length;
  const frenchCompleted = useMemo(() => {
    return FRENCH_GRAMMAR_LESSONS.filter((l) =>
      grammarProgress.completedLessonIds.includes(l.id)
    ).length;
  }, [grammarProgress.completedLessonIds]);

  const englishTotal = ALL_GRAMMAR_LESSONS.length;
  const englishCompleted = useMemo(() => {
    return ALL_GRAMMAR_LESSONS.filter((l) =>
      grammarProgress.completedLessonIds.includes(l.id)
    ).length;
  }, [grammarProgress.completedLessonIds]);

  // Level counts for active language
  const levelCounts = useMemo(() => {
    const lessons =
      activeLanguage === 'fr' ? FRENCH_GRAMMAR_LESSONS : ALL_GRAMMAR_LESSONS;
    const counts: Record<GrammarLevel | 'ALL', number> = {
      ALL: lessons.length,
      A1: 0,
      A2: 0,
      B1: 0,
      B2: 0,
    };
    lessons.forEach((l) => {
      counts[l.level] = (counts[l.level] || 0) + 1;
    });
    return counts;
  }, [activeLanguage]);

  // Filtered lessons when search or level filter is active
  const isSearchingOrFiltered =
    searchQuery.trim().length > 0 || selectedLevel !== 'ALL';

  const filteredFrenchLessons = useMemo(() => {
    if (!isSearchingOrFiltered) return [];
    return FRENCH_GRAMMAR_LESSONS.filter((lesson) => {
      if (selectedLevel !== 'ALL' && lesson.level !== selectedLevel) {
        return false;
      }
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const inFr = lesson.titleFr.toLowerCase().includes(q);
        const inEn = lesson.titleEn.toLowerCase().includes(q);
        const inDari = lesson.titleDari?.includes(q) ?? false;
        const inSummary =
          lesson.summaryFr.toLowerCase().includes(q) ||
          lesson.summaryEn?.toLowerCase().includes(q);
        return inFr || inEn || inDari || inSummary;
      }
      return true;
    });
  }, [isSearchingOrFiltered, selectedLevel, searchQuery]);

  const filteredEnglishLessons = useMemo(() => {
    if (!isSearchingOrFiltered) return [];
    return ALL_GRAMMAR_LESSONS.filter((lesson) => {
      if (selectedLevel !== 'ALL' && lesson.level !== selectedLevel) {
        return false;
      }
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const inEn = lesson.titleEn.toLowerCase().includes(q);
        const inFr = lesson.titleFr.toLowerCase().includes(q);
        const inDari = lesson.titleDari?.includes(q) ?? false;
        const inSummary =
          lesson.summaryEn.toLowerCase().includes(q) ||
          lesson.summaryFr.toLowerCase().includes(q);
        const inRules = lesson.rules?.some(
          (r) =>
            r.ruleEn.toLowerCase().includes(q) ||
            r.ruleFr.toLowerCase().includes(q)
        );
        return inEn || inFr || inDari || inSummary || inRules;
      }
      return true;
    });
  }, [isSearchingOrFiltered, selectedLevel, searchQuery]);

  const activeFilteredLessons =
    activeLanguage === 'fr' ? filteredFrenchLessons : filteredEnglishLessons;

  // Active modules
  const currentModules =
    activeLanguage === 'fr' ? FRENCH_GRAMMAR_MODULES : GRAMMAR_MODULES;

  // Accordion toggle handlers
  const handleToggleModule = (moduleId: string) => {
    setExpandedModuleIds((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  const allCurrentModuleIds = useMemo(
    () => currentModules.map((m) => m.id),
    [currentModules]
  );

  const areAllExpanded = useMemo(() => {
    return allCurrentModuleIds.every((id) => expandedModuleIds.has(id));
  }, [allCurrentModuleIds, expandedModuleIds]);

  const handleToggleExpandAll = () => {
    try {
      Haptics.selectionAsync();
    } catch {
      // Ignore
    }
    if (areAllExpanded) {
      setExpandedModuleIds(new Set());
    } else {
      setExpandedModuleIds(new Set(allCurrentModuleIds));
    }
  };

  const handleOpenLesson = (lessonId: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Ignore
    }
    router.push(`/grammar/${lessonId}`);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedLevel('ALL');
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: themeColors.background }]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: themeColors.primaryLight },
              ]}
            >
              <GraduationCap size={24} color={themeColors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={[styles.screenTitle, { color: themeColors.textPrimary }]}
              >
                Espace Grammaire
              </Text>
              <Text
                style={[styles.subtitle, { color: themeColors.textSecondary }]}
              >
                Cursus bilingue complet • Français (Heminway) & Anglais (Murphy & Azar)
              </Text>
            </View>
          </View>

          {/* TWO-WAY LANGUAGE SWITCHER (FRANÇAIS VS ENGLISH) */}
          <GrammarLanguageSwitcher
            activeLanguage={activeLanguage}
            onSelectLanguage={handleSelectLanguage}
            frenchCount={frenchCompleted}
            frenchTotal={frenchTotal}
            englishCount={englishCompleted}
            englishTotal={englishTotal}
          />

          {/* COURSE OVERVIEW & PROGRESS CARD */}
          <GrammarCourseOverview
            language={activeLanguage}
            frenchSubTab={frenchSubTab}
            onChangeFrenchSubTab={setFrenchSubTab}
            completedCount={
              activeLanguage === 'fr' ? frenchCompleted : englishCompleted
            }
            totalCount={
              activeLanguage === 'fr' ? frenchTotal : englishTotal
            }
            nextLesson={
              activeLanguage === 'fr' ? nextFrenchLesson : nextEnglishLesson
            }
            onOpenLesson={handleOpenLesson}
          />
        </View>

        {/* FRENCH VERB CONJUGATOR STUDIO */}
        {activeLanguage === 'fr' && frenchSubTab === 'verbs' ? (
          <FrenchVerbConjugator />
        ) : (
          /* CURRICULUM LESSONS (FRENCH OR ENGLISH) */
          <>
            {/* FILTER & SEARCH TOOLBAR */}
            <GrammarFilterToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              placeholder={
                activeLanguage === 'fr'
                  ? 'Rechercher : subjonctif, passé composé, pronoms…'
                  : 'Search : present perfect, modals, conditionals, if…'
              }
              selectedLevel={selectedLevel}
              onSelectLevel={setSelectedLevel}
              levelCounts={levelCounts}
              allExpanded={areAllExpanded}
              onToggleExpandAll={handleToggleExpandAll}
              isSearchingOrFiltered={isSearchingOrFiltered}
              totalFilteredCount={activeFilteredLessons.length}
              onResetFilters={handleResetFilters}
            />

            {/* RESULTS VIEW (FLAT LIST WHEN FILTERING/SEARCHING) */}
            {isSearchingOrFiltered ? (
              <View style={styles.resultsContainer}>
                {activeFilteredLessons.length === 0 ? (
                  <View
                    style={[
                      styles.emptyBox,
                      {
                        backgroundColor: themeColors.surface,
                        borderColor: themeColors.cardBorder,
                      },
                    ]}
                  >
                    <SearchX size={36} color={themeColors.textMuted} />
                    <Text
                      style={[
                        styles.emptyTitle,
                        { color: themeColors.textPrimary },
                      ]}
                    >
                      Aucune unité ne correspond à vos critères
                    </Text>
                    <Text
                      style={[
                        styles.emptySub,
                        { color: themeColors.textMuted },
                      ]}
                    >
                      Essayez avec un autre mot-clé ou réinitialisez le filtre de niveau.
                    </Text>
                    <TouchableOpacity
                      onPress={handleResetFilters}
                      style={[
                        styles.resetBtn,
                        { backgroundColor: themeColors.primary },
                      ]}
                    >
                      <Text style={styles.resetBtnText}>
                        Réinitialiser les filtres
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  activeFilteredLessons.map((lesson) => {
                    const isCompleted =
                      grammarProgress.completedLessonIds.includes(lesson.id);
                    const scoreInfo = grammarProgress.lessonScores[lesson.id];

                    return (
                      <GrammarCard
                        key={lesson.id}
                        lesson={lesson}
                        language={activeLanguage}
                        isCompleted={isCompleted}
                        scoreInfo={scoreInfo}
                        onPress={() => handleOpenLesson(lesson.id)}
                      />
                    );
                  })
                )}
              </View>
            ) : (
              /* MODULES ACCORDION VIEW (NORMAL STRUCTURED CURRICULUM) */
              <View style={styles.modulesContainer}>
                <View style={styles.sectionHeader}>
                  <Text
                    style={[
                      styles.sectionHeading,
                      { color: themeColors.textPrimary },
                    ]}
                  >
                    {activeLanguage === 'fr'
                      ? 'Les 11 Modules de Grammaire Française'
                      : 'Les 12 Modules de Grammaire Anglaise'}
                  </Text>
                  <Text
                    style={[
                      styles.sectionCountBadge,
                      { color: themeColors.textMuted },
                    ]}
                  >
                    {currentModules.length} modules • {activeLanguage === 'fr' ? frenchTotal : englishTotal} unités
                  </Text>
                </View>

                {currentModules.map((module) => {
                  const moduleLessons =
                    activeLanguage === 'fr'
                      ? FRENCH_GRAMMAR_LESSONS.filter(
                          (l) => l.moduleId === module.id
                        )
                      : ALL_GRAMMAR_LESSONS.filter(
                          (l) => l.moduleId === module.id
                        );

                  const isExpanded = expandedModuleIds.has(module.id);

                  return (
                    <GrammarModuleAccordion
                      key={module.id}
                      module={module}
                      lessons={moduleLessons}
                      language={activeLanguage}
                      isExpanded={isExpanded}
                      onToggle={() => handleToggleModule(module.id)}
                      onOpenLesson={handleOpenLesson}
                    />
                  );
                })}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  resultsContainer: {
    marginTop: 6,
  },
  modulesContainer: {
    marginTop: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
  },
  sectionCountBadge: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 4,
  },
  emptySub: {
    fontSize: 12.5,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
  },
  resetBtn: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
  },
  resetBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
