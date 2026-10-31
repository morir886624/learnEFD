import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  GraduationCap,
  Search,
  X,
  BookOpen,
  Award,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Table,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useApp } from '../../context/AppContext';
import { useResponsive } from '../../hooks/useResponsive';
import {
  GRAMMAR_MODULES,
  ALL_GRAMMAR_LESSONS,
  filterLessons,
} from '../../data/grammar';
import { ALL_VOCABULARY_ITEMS, VOCABULARY_DECKS } from '../../data/vocabulary';
import {
  FRENCH_GRAMMAR_MODULES,
  FRENCH_GRAMMAR_LESSONS,
} from '../../data/frenchGrammar';
import { GrammarCard } from '../../components/grammar/GrammarCard';
import { FrenchVerbConjugator } from '../../components/grammar/FrenchVerbConjugator';
import { GrammarCategory, GrammarLevel } from '../../types/grammar';
import { FrenchGrammarCategory } from '../../types/frenchGrammar';

type GrammarProgram = 'french' | 'verbs' | 'english';

const LEVEL_TABS: { id: GrammarLevel | 'ALL'; label: string }[] = [
  { id: 'ALL', label: 'Tous Niveaux' },
  { id: 'A1', label: 'A1 Débutant' },
  { id: 'A2', label: 'A2 Élémentaire' },
  { id: 'B1', label: 'B1 Intermédiaire' },
  { id: 'B2', label: 'B2 Avancé' },
];

const FRENCH_CATEGORY_CHIPS: { id: FrenchGrammarCategory | 'ALL'; label: string }[] = [
  { id: 'ALL', label: 'Tous Thèmes (33)' },
  { id: 'nouns-articles', label: 'Noms & Articles' },
  { id: 'present-tense', label: 'Présent Régulier' },
  { id: 'irregular-modals', label: 'Irréguliers & Modaux' },
  { id: 'sentence-architecture', label: 'Négation & Questions' },
  { id: 'past-tenses', label: 'Passé Composé & Imparfait' },
  { id: 'future-conditional', label: 'Futur & Conditionnel' },
  { id: 'subjunctive-moods', label: 'Subjonctif & Impératif' },
  { id: 'pronouns', label: 'Pronoms (Y, En, COD/COI)' },
  { id: 'syntax-discourse', label: 'Relatifs & Discours' },
  { id: 'adjectives-numbers', label: 'Adjectifs & Nombres' },
  { id: 'prepositions-solver', label: 'Prépositions & Pièges' },
];

const ENGLISH_CATEGORY_CHIPS: { id: GrammarCategory | 'ALL'; label: string }[] = [
  { id: 'ALL', label: 'Tous Thèmes' },
  { id: 'tenses', label: 'Temps & Conjugaison' },
  { id: 'modals', label: 'Modaux & Certitude' },
  { id: 'conditionals', label: 'Conditionnels & If' },
  { id: 'passive', label: 'Voix Passive' },
  { id: 'clauses', label: 'Relatives & Conjonctions' },
  { id: 'gerunds', label: 'Gérondif & Infinitif' },
  { id: 'nouns-articles', label: 'Noms & Articles' },
  { id: 'adjectives-adverbs', label: 'Comparatifs' },
  { id: 'prepositions', label: 'Prépositions' },
  { id: 'troublesome', label: 'Verbes Pièges' },
];

export default function GrammarIndexScreen() {
  const { themeColors, grammarProgress } = useApp();
  const { contentMaxWidth } = useResponsive();

  const [activeProgram, setActiveProgram] = useState<GrammarProgram>('french');
  const [selectedLevel, setSelectedLevel] = useState<GrammarLevel | 'ALL'>('ALL');
  const [selectedFrenchCategory, setSelectedFrenchCategory] = useState<
    FrenchGrammarCategory | 'ALL'
  >('ALL');
  const [selectedEnglishCategory, setSelectedEnglishCategory] = useState<
    GrammarCategory | 'ALL'
  >('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(
    'fr-mod-nouns-articles'
  );

  // Filter French Lessons
  const filteredFrenchLessons = useMemo(() => {
    return FRENCH_GRAMMAR_LESSONS.filter((lesson) => {
      if (selectedLevel !== 'ALL' && lesson.level !== selectedLevel) {
        return false;
      }
      if (selectedFrenchCategory !== 'ALL') {
        const mod = FRENCH_GRAMMAR_MODULES.find((m) => m.id === lesson.moduleId);
        if (!mod || mod.category !== selectedFrenchCategory) {
          return false;
        }
      }
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        return (
          lesson.titleFr.toLowerCase().includes(q) ||
          lesson.titleEn.toLowerCase().includes(q) ||
          lesson.titleDari.includes(q) ||
          lesson.summaryFr.toLowerCase().includes(q) ||
          lesson.summaryEn.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedLevel, selectedFrenchCategory, searchQuery]);

  // Filter English Lessons
  const filteredEnglishLessons = useMemo(() => {
    return filterLessons({
      level: selectedLevel,
      category: selectedEnglishCategory,
      searchTerm: searchQuery,
    });
  }, [selectedLevel, selectedEnglishCategory, searchQuery]);

  // French Completion Stats
  const totalFrenchLessons = FRENCH_GRAMMAR_LESSONS.length;
  const completedFrenchCount = FRENCH_GRAMMAR_LESSONS.filter((l) =>
    grammarProgress.completedLessonIds.includes(l.id)
  ).length;
  const frenchPercent = Math.min(
    100,
    Math.round((completedFrenchCount / totalFrenchLessons) * 100)
  );

  // English Completion Stats
  const totalEnglishLessons = ALL_GRAMMAR_LESSONS.length;
  const completedEnglishCount = ALL_GRAMMAR_LESSONS.filter((l) =>
    grammarProgress.completedLessonIds.includes(l.id)
  ).length;
  const englishPercent = Math.min(
    100,
    Math.round((completedEnglishCount / totalEnglishLessons) * 100)
  );

  const handleSwitchProgram = (prog: GrammarProgram) => {
    try {
      Haptics.selectionAsync();
    } catch {
      // Ignore
    }
    setActiveProgram(prog);
    setSearchQuery('');
    setSelectedLevel('ALL');
  };

  const handleSelectLevel = (lvl: GrammarLevel | 'ALL') => {
    try {
      Haptics.selectionAsync();
    } catch {
      // Ignore
    }
    setSelectedLevel(lvl);
  };

  const toggleExpandModule = (modId: string) => {
    try {
      Haptics.selectionAsync();
    } catch {
      // Ignore
    }
    setExpandedModuleId(expandedModuleId === modId ? null : modId);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* TOP HEADER */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={[styles.iconCircle, { backgroundColor: themeColors.primaryLight }]}>
              <GraduationCap size={24} color={themeColors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.screenTitle, { color: themeColors.textPrimary }]}>
                {activeProgram === 'french'
                  ? 'Grammaire Française Complète'
                  : activeProgram === 'verbs'
                    ? 'Tableaux des Verbes Français'
                    : 'Grammaire Anglaise Complète'}
              </Text>
              <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
                {activeProgram === 'french'
                  ? 'Annie Heminway • All-in-One & Complete French Grammar (FR • EN • دری)'
                  : activeProgram === 'verbs'
                    ? '19 Verbes Clés • 7 Temps & Modes • Prononciation Audio Native'
                    : 'Raymond Murphy • Betty Azar (English • Français • دری)'}
              </Text>
            </View>
          </View>

          {/* 3-WAY PROGRAM SELECTOR BAR */}
          <View
            style={[
              styles.programSwitcher,
              {
                backgroundColor: themeColors.surface,
                borderColor: themeColors.cardBorder,
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => handleSwitchProgram('french')}
              style={[
                styles.programBtn,
                activeProgram === 'french' && {
                  backgroundColor: themeColors.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.programBtnTitle,
                  {
                    color:
                      activeProgram === 'french' ? '#FFFFFF' : themeColors.textPrimary,
                  },
                ]}
              >
                🇫🇷 Grammaire FR
              </Text>
              <Text
                style={[
                  styles.programBtnSub,
                  {
                    color:
                      activeProgram === 'french'
                        ? 'rgba(255,255,255,0.85)'
                        : themeColors.textMuted,
                  },
                ]}
              >
                33 Unités • Heminway
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => handleSwitchProgram('verbs')}
              style={[
                styles.programBtn,
                activeProgram === 'verbs' && {
                  backgroundColor: themeColors.primary,
                },
              ]}
            >
              <View style={styles.programBtnRow}>
                <Table
                  size={13}
                  color={activeProgram === 'verbs' ? '#FFFFFF' : themeColors.primary}
                />
                <Text
                  style={[
                    styles.programBtnTitle,
                    {
                      color:
                        activeProgram === 'verbs' ? '#FFFFFF' : themeColors.textPrimary,
                    },
                  ]}
                >
                  Conjugueur
                </Text>
              </View>
              <Text
                style={[
                  styles.programBtnSub,
                  {
                    color:
                      activeProgram === 'verbs'
                        ? 'rgba(255,255,255,0.85)'
                        : themeColors.textMuted,
                  },
                ]}
              >
                19 Verbes • 7 Temps
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => handleSwitchProgram('english')}
              style={[
                styles.programBtn,
                activeProgram === 'english' && {
                  backgroundColor: themeColors.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.programBtnTitle,
                  {
                    color:
                      activeProgram === 'english' ? '#FFFFFF' : themeColors.textPrimary,
                  },
                ]}
              >
                🇬🇧 Grammaire EN
              </Text>
              <Text
                style={[
                  styles.programBtnSub,
                  {
                    color:
                      activeProgram === 'english'
                        ? 'rgba(255,255,255,0.85)'
                        : themeColors.textMuted,
                  },
                ]}
              >
                {totalEnglishLessons} Unités • Murphy
              </Text>
            </TouchableOpacity>
          </View>

          {/* VOCABULARY & PHRASAL VERBS HUB BANNER (MURPHY & AZAR) */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => router.push('/vocabulary' as any)}
            style={[
              styles.vocabBanner,
              {
                backgroundColor: '#059669',
              },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.vocabBannerTag}>
                🇬🇧 NOUVEAU • MURPHY & AZAR LEXICON ({VOCABULARY_DECKS.length} DECKS)
              </Text>
              <Text style={styles.vocabBannerTitle}>
                Vocabulaire, Phrasal Verbs & Verbes Irréguliers ({ALL_VOCABULARY_ITEMS.length} mots)
              </Text>
              <Text style={styles.vocabBannerSub}>
                Explorateur trilingue, Flashcards 3D & Quiz prépositions / collocations →
              </Text>
            </View>
            <Sparkles size={22} color="#A7F3D0" />
          </TouchableOpacity>

          {/* PROGRESS CARD (for French or English) */}
          {activeProgram !== 'verbs' && (
            <View
              style={[
                styles.progressCard,
                {
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.cardBorder,
                },
              ]}
            >
              <View style={styles.progressTopRow}>
                <View style={styles.progressInfo}>
                  <Award size={18} color={themeColors.primary} />
                  <Text
                    style={[
                      styles.progressCardTitle,
                      { color: themeColors.textPrimary },
                    ]}
                  >
                    {activeProgram === 'french'
                      ? 'Progression Grammaire Française'
                      : 'Progression Grammaire Anglaise'}
                  </Text>
                </View>
                <Text style={[styles.progressPercent, { color: themeColors.primary }]}>
                  {activeProgram === 'french' ? frenchPercent : englishPercent}%
                </Text>
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
                      width: `${Math.max(
                        5,
                        activeProgram === 'french' ? frenchPercent : englishPercent
                      )}%`,
                      backgroundColor: themeColors.primary,
                    },
                  ]}
                />
              </View>

              <View style={styles.progressBottomRow}>
                <Text
                  style={[
                    styles.progressCountText,
                    { color: themeColors.textSecondary },
                  ]}
                >
                  <Text style={{ fontWeight: '800', color: themeColors.textPrimary }}>
                    {activeProgram === 'french'
                      ? completedFrenchCount
                      : completedEnglishCount}
                  </Text>{' '}
                  sur{' '}
                  {activeProgram === 'french'
                    ? totalFrenchLessons
                    : totalEnglishLessons}{' '}
                  unités maîtrisées
                </Text>
                <View
                  style={[
                    styles.sourceBadge,
                    { backgroundColor: themeColors.surfaceSubtle },
                  ]}
                >
                  <Sparkles size={12} color={themeColors.secondary} />
                  <Text
                    style={[
                      styles.sourceBadgeText,
                      { color: themeColors.textSecondary },
                    ]}
                  >
                    {activeProgram === 'french'
                      ? '2 Livres Combinés (A1–B2)'
                      : 'Murphy & Azar (A1–B2)'}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* MODE 2: VERB CONJUGATOR STUDIO */}
        {activeProgram === 'verbs' ? (
          <FrenchVerbConjugator />
        ) : (
          /* MODE 1 (FRENCH GRAMMAR) OR MODE 3 (ENGLISH GRAMMAR) */
          <>
            {/* SEARCH BAR */}
            <View
              style={[
                styles.searchBar,
                {
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.cardBorder,
                },
              ]}
            >
              <Search size={18} color={themeColors.textMuted} />
              <TextInput
                placeholder={
                  activeProgram === 'french'
                    ? "Rechercher : 'subjonctif', 'passé composé', 'y et en', 'dont'..."
                    : "Rechercher : 'present perfect', 'since', 'modals', 'if'..."
                }
                placeholderTextColor={themeColors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={[styles.searchInput, { color: themeColors.textPrimary }]}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <X size={16} color={themeColors.textMuted} />
                </TouchableOpacity>
              )}
            </View>

            {/* LEVEL TABS */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.levelTabsContainer}
            >
              {LEVEL_TABS.map((tab) => {
                const isSelected = selectedLevel === tab.id;
                return (
                  <TouchableOpacity
                    key={tab.id}
                    activeOpacity={0.8}
                    onPress={() => handleSelectLevel(tab.id)}
                    style={[
                      styles.levelTab,
                      {
                        backgroundColor: isSelected
                          ? themeColors.primary
                          : themeColors.surface,
                        borderColor: isSelected
                          ? themeColors.primary
                          : themeColors.cardBorder,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.levelTabText,
                        {
                          color: isSelected ? '#FFFFFF' : themeColors.textSecondary,
                          fontWeight: isSelected ? '800' : '600',
                        },
                      ]}
                    >
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* CATEGORY CHIPS */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryChipsContainer}
            >
              {activeProgram === 'french'
                ? FRENCH_CATEGORY_CHIPS.map((cat) => {
                    const isSelected = selectedFrenchCategory === cat.id;
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        activeOpacity={0.8}
                        onPress={() => setSelectedFrenchCategory(cat.id)}
                        style={[
                          styles.categoryChip,
                          {
                            backgroundColor: isSelected
                              ? themeColors.primaryLight
                              : themeColors.surfaceSubtle,
                            borderColor: isSelected
                              ? themeColors.primary
                              : 'transparent',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.categoryChipText,
                            {
                              color: isSelected
                                ? themeColors.primary
                                : themeColors.textSecondary,
                              fontWeight: isSelected ? '700' : '500',
                            },
                          ]}
                        >
                          {cat.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })
                : ENGLISH_CATEGORY_CHIPS.map((cat) => {
                    const isSelected = selectedEnglishCategory === cat.id;
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        activeOpacity={0.8}
                        onPress={() => setSelectedEnglishCategory(cat.id)}
                        style={[
                          styles.categoryChip,
                          {
                            backgroundColor: isSelected
                              ? themeColors.primaryLight
                              : themeColors.surfaceSubtle,
                            borderColor: isSelected
                              ? themeColors.primary
                              : 'transparent',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.categoryChipText,
                            {
                              color: isSelected
                                ? themeColors.primary
                                : themeColors.textSecondary,
                              fontWeight: isSelected ? '700' : '500',
                            },
                          ]}
                        >
                          {cat.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
            </ScrollView>

            {/* FRENCH GRAMMAR CONTENT */}
            {activeProgram === 'french' ? (
              searchQuery.trim().length > 0 ||
              selectedLevel !== 'ALL' ||
              selectedFrenchCategory !== 'ALL' ? (
                <View style={styles.resultsSection}>
                  <Text style={[styles.sectionHeading, { color: themeColors.textPrimary }]}>
                    Résultats ({filteredFrenchLessons.length} unités trouvées)
                  </Text>
                  {filteredFrenchLessons.length === 0 ? (
                    <View style={[styles.emptyBox, { backgroundColor: themeColors.surface }]}>
                      <BookOpen size={36} color={themeColors.textMuted} />
                      <Text style={[styles.emptyText, { color: themeColors.textPrimary }]}>
                        Aucune unité ne correspond à votre recherche.
                      </Text>
                    </View>
                  ) : (
                    filteredFrenchLessons.map((lesson) => {
                      const isCompleted = grammarProgress.completedLessonIds.includes(
                        lesson.id
                      );
                      const scoreInfo = grammarProgress.lessonScores[lesson.id];
                      return (
                        <GrammarCard
                          key={lesson.id}
                          lesson={lesson}
                          isCompleted={isCompleted}
                          scoreInfo={scoreInfo}
                          onPress={() => router.push(`/grammar/${lesson.id}`)}
                        />
                      );
                    })
                  )}
                </View>
              ) : (
                <View style={styles.modulesSection}>
                  <Text style={[styles.sectionHeading, { color: themeColors.textPrimary }]}>
                    Les 11 Modules de la Grammaire Française Complète
                  </Text>

                  {FRENCH_GRAMMAR_MODULES.map((module) => {
                    const moduleLessons = FRENCH_GRAMMAR_LESSONS.filter(
                      (l) => l.moduleId === module.id
                    );
                    const completedInModule = moduleLessons.filter((l) =>
                      grammarProgress.completedLessonIds.includes(l.id)
                    ).length;
                    const isModuleExpanded = expandedModuleId === module.id;

                    return (
                      <View
                        key={module.id}
                        style={[
                          styles.moduleCard,
                          {
                            backgroundColor: themeColors.surface,
                            borderColor: themeColors.cardBorder,
                          },
                        ]}
                      >
                        <TouchableOpacity
                          activeOpacity={0.85}
                          onPress={() => toggleExpandModule(module.id)}
                          style={styles.moduleHeader}
                        >
                          <View style={styles.moduleLeft}>
                            <View style={styles.moduleBadgeRow}>
                              <View
                                style={[
                                  styles.moduleIndexPill,
                                  { backgroundColor: `${module.color}18` },
                                ]}
                              >
                                <Text
                                  style={[styles.moduleIndexText, { color: module.color }]}
                                >
                                  MODULE {module.order} • {module.badge}
                                </Text>
                              </View>
                            </View>
                            <Text
                              style={[
                                styles.moduleTitleFr,
                                { color: themeColors.textPrimary },
                              ]}
                            >
                              {module.titleFr}
                            </Text>
                            <Text
                              style={[
                                styles.moduleTitleEn,
                                { color: themeColors.textSecondary },
                              ]}
                            >
                              🇬🇧 {module.titleEn} • 🇦🇫 {module.titleDari}
                            </Text>
                            <Text
                              style={[
                                styles.moduleDescFr,
                                { color: themeColors.textMuted },
                              ]}
                            >
                              {module.descriptionFr}
                            </Text>
                          </View>

                          <View style={styles.moduleRight}>
                            <View
                              style={[
                                styles.moduleProgressPill,
                                {
                                  backgroundColor:
                                    completedInModule === moduleLessons.length &&
                                    completedInModule > 0
                                      ? '#DCFCE7'
                                      : themeColors.surfaceSubtle,
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.moduleProgressText,
                                  {
                                    color:
                                      completedInModule === moduleLessons.length &&
                                      completedInModule > 0
                                        ? '#16A34A'
                                        : themeColors.textSecondary,
                                  },
                                ]}
                              >
                                {completedInModule}/{moduleLessons.length}
                              </Text>
                            </View>
                            <View style={styles.chevronCircle}>
                              {isModuleExpanded ? (
                                <ChevronUp size={20} color={themeColors.textSecondary} />
                              ) : (
                                <ChevronDown size={20} color={themeColors.textSecondary} />
                              )}
                            </View>
                          </View>
                        </TouchableOpacity>

                        {isModuleExpanded && (
                          <View style={styles.moduleLessonsContainer}>
                            {moduleLessons.map((lesson) => {
                              const isCompleted =
                                grammarProgress.completedLessonIds.includes(lesson.id);
                              const scoreInfo = grammarProgress.lessonScores[lesson.id];
                              return (
                                <GrammarCard
                                  key={lesson.id}
                                  lesson={lesson}
                                  isCompleted={isCompleted}
                                  scoreInfo={scoreInfo}
                                  onPress={() => router.push(`/grammar/${lesson.id}`)}
                                />
                              );
                            })}
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              )
            ) : /* ENGLISH GRAMMAR CONTENT */
            searchQuery.trim().length > 0 ||
              selectedLevel !== 'ALL' ||
              selectedEnglishCategory !== 'ALL' ? (
              <View style={styles.resultsSection}>
                <Text style={[styles.sectionHeading, { color: themeColors.textPrimary }]}>
                  Résultats ({filteredEnglishLessons.length} leçons trouvées)
                </Text>
                {filteredEnglishLessons.length === 0 ? (
                  <View style={[styles.emptyBox, { backgroundColor: themeColors.surface }]}>
                    <BookOpen size={36} color={themeColors.textMuted} />
                    <Text style={[styles.emptyText, { color: themeColors.textPrimary }]}>
                      Aucune leçon ne correspond à votre recherche.
                    </Text>
                  </View>
                ) : (
                  filteredEnglishLessons.map((lesson) => {
                    const isCompleted = grammarProgress.completedLessonIds.includes(
                      lesson.id
                    );
                    const scoreInfo = grammarProgress.lessonScores[lesson.id];
                    return (
                      <GrammarCard
                        key={lesson.id}
                        lesson={lesson}
                        isCompleted={isCompleted}
                        scoreInfo={scoreInfo}
                        onPress={() => router.push(`/grammar/${lesson.id}`)}
                      />
                    );
                  })
                )}
              </View>
            ) : (
              <View style={styles.modulesSection}>
                <Text style={[styles.sectionHeading, { color: themeColors.textPrimary }]}>
                  Les 12 Modules de Grammaire Anglaise (Murphy & Azar)
                </Text>

                {GRAMMAR_MODULES.map((module) => {
                  const moduleLessons = ALL_GRAMMAR_LESSONS.filter(
                    (l) => l.moduleId === module.id
                  );
                  const completedInModule = moduleLessons.filter((l) =>
                    grammarProgress.completedLessonIds.includes(l.id)
                  ).length;
                  const isModuleExpanded = expandedModuleId === module.id;

                  return (
                    <View
                      key={module.id}
                      style={[
                        styles.moduleCard,
                        {
                          backgroundColor: themeColors.surface,
                          borderColor: themeColors.cardBorder,
                        },
                      ]}
                    >
                      <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => toggleExpandModule(module.id)}
                        style={styles.moduleHeader}
                      >
                        <View style={styles.moduleLeft}>
                          <View
                            style={[
                              styles.moduleIndexPill,
                              { backgroundColor: `${module.color}18` },
                            ]}
                          >
                            <Text style={[styles.moduleIndexText, { color: module.color }]}>
                              MODULE {module.order}
                            </Text>
                          </View>
                          <Text
                            style={[
                              styles.moduleTitleFr,
                              { color: themeColors.textPrimary },
                            ]}
                          >
                            {module.titleFr}
                          </Text>
                          <Text
                            style={[
                              styles.moduleTitleEn,
                              { color: themeColors.textSecondary },
                            ]}
                          >
                            {module.titleEn}
                          </Text>
                          <Text
                            style={[
                              styles.moduleDescFr,
                              { color: themeColors.textMuted },
                            ]}
                          >
                            {module.descriptionFr}
                          </Text>
                        </View>

                        <View style={styles.moduleRight}>
                          <View
                            style={[
                              styles.moduleProgressPill,
                              {
                                backgroundColor:
                                  completedInModule === moduleLessons.length &&
                                  completedInModule > 0
                                    ? '#DCFCE7'
                                    : themeColors.surfaceSubtle,
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.moduleProgressText,
                                {
                                  color:
                                    completedInModule === moduleLessons.length &&
                                    completedInModule > 0
                                      ? '#16A34A'
                                      : themeColors.textSecondary,
                                },
                              ]}
                            >
                              {completedInModule}/{moduleLessons.length}
                            </Text>
                          </View>
                          <View style={styles.chevronCircle}>
                            {isModuleExpanded ? (
                              <ChevronUp size={20} color={themeColors.textSecondary} />
                            ) : (
                              <ChevronDown size={20} color={themeColors.textSecondary} />
                            )}
                          </View>
                        </View>
                      </TouchableOpacity>

                      {isModuleExpanded && (
                        <View style={styles.moduleLessonsContainer}>
                          {moduleLessons.map((lesson) => {
                            const isCompleted =
                              grammarProgress.completedLessonIds.includes(lesson.id);
                            const scoreInfo = grammarProgress.lessonScores[lesson.id];
                            return (
                              <GrammarCard
                                key={lesson.id}
                                lesson={lesson}
                                isCompleted={isCompleted}
                                scoreInfo={scoreInfo}
                                onPress={() => router.push(`/grammar/${lesson.id}`)}
                              />
                            );
                          })}
                        </View>
                      )}
                    </View>
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
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: {
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12.5,
    lineHeight: 17,
    marginTop: 2,
  },
  programSwitcher: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 4,
    gap: 4,
    marginBottom: 12,
  },
  programBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  programBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  programBtnTitle: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  programBtnSub: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },
  progressCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  progressTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressCardTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: '900',
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressCountText: {
    fontSize: 12.5,
  },
  sourceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  sourceBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  levelTabsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  levelTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  levelTabText: {
    fontSize: 12,
  },
  categoryChipsContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 11.5,
  },
  resultsSection: {
    marginTop: 4,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  emptyBox: {
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 12,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  modulesSection: {
    marginTop: 4,
  },
  moduleCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
  },
  moduleLeft: {
    flex: 1,
    paddingRight: 10,
  },
  moduleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  moduleIndexPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  moduleIndexText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  moduleTitleFr: {
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
    marginBottom: 2,
  },
  moduleTitleEn: {
    fontSize: 12.5,
    fontWeight: '600',
    marginBottom: 4,
  },
  moduleDescFr: {
    fontSize: 12,
    lineHeight: 16,
  },
  moduleRight: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 4,
  },
  moduleProgressPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 8,
  },
  moduleProgressText: {
    fontSize: 11,
    fontWeight: '800',
  },
  chevronCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleLessonsContainer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  vocabBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  vocabBannerTag: {
    color: '#A7F3D0',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  vocabBannerTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  vocabBannerSub: {
    color: '#ECFDF5',
    fontSize: 11.5,
    fontWeight: '600',
  },
});
