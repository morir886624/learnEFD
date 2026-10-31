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
import { router, useLocalSearchParams } from 'expo-router';
import {
  BookOpen,
  Search,
  Sparkles,
  Layers,
  GraduationCap,
  CircleCheck,
  Bookmark,
  X,
  ArrowLeft,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import {
  VOCABULARY_DECKS,
  ALL_VOCABULARY_ITEMS,
  filterVocabularyItems,
  getExercisesForCategory,
} from '../../data/vocabulary';
import {
  FRENCH_VOCABULARY_DECKS,
  ALL_FRENCH_VOCABULARY_ITEMS,
  filterFrenchVocabularyItems,
  getFrenchExercisesForCategory,
} from '../../data/frenchVocabulary';
import { VocabularyCategory, VocabularyLevel } from '../../types/vocabulary';
import {
  FrenchVocabularyCategory,
  FrenchVocabularyLevel,
} from '../../types/frenchVocabulary';
import { VocabularyCard } from '../../components/vocabulary/VocabularyCard';
import { VocabularyFlashcardView } from '../../components/vocabulary/VocabularyFlashcardView';
import { VocabularyPracticeEngine } from '../../components/vocabulary/VocabularyPracticeEngine';
import { FrenchVocabularyCard } from '../../components/vocabulary/FrenchVocabularyCard';
import { FrenchVocabularyFlashcardView } from '../../components/vocabulary/FrenchVocabularyFlashcardView';
import { FrenchVocabularyPracticeEngine } from '../../components/vocabulary/FrenchVocabularyPracticeEngine';
import { useApp } from '../../context/AppContext';

type HubMode = 'explorer' | 'flashcards' | 'practice';
type ProgramLang = 'french' | 'english';

const LEVEL_TABS: { id: VocabularyLevel | 'ALL'; label: string }[] = [
  { id: 'ALL', label: 'Tous Niveaux' },
  { id: 'A1', label: 'A1' },
  { id: 'A2', label: 'A2' },
  { id: 'B1', label: 'B1' },
  { id: 'B2', label: 'B2' },
];

export default function VocabularyHubScreen() {
  const { lang, category: initialCategory } = useLocalSearchParams<{
    lang?: string;
    category?: string;
  }>();
  const { themeColors, isDark, vocabularyProgress } = useApp();

  const [selectedProgram, setSelectedProgram] = useState<ProgramLang>(
    lang === 'en' ? 'english' : 'french'
  );
  const [mode, setMode] = useState<HubMode>('explorer');
  const [selectedFrenchCategory, setSelectedFrenchCategory] = useState<
    FrenchVocabularyCategory | 'ALL'
  >('ALL');
  const [selectedEnglishCategory, setSelectedEnglishCategory] = useState<
    VocabularyCategory | 'ALL'
  >((initialCategory as VocabularyCategory) || 'ALL');
  const [selectedLevel, setSelectedLevel] = useState<VocabularyLevel | 'ALL'>('ALL');
  const [onlyReview, setOnlyReview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeFrenchDeck = useMemo(
    () => FRENCH_VOCABULARY_DECKS.find((d) => d.id === selectedFrenchCategory),
    [selectedFrenchCategory]
  );

  const activeEnglishDeck = useMemo(
    () => VOCABULARY_DECKS.find((d) => d.id === selectedEnglishCategory),
    [selectedEnglishCategory]
  );

  const accentColor =
    selectedProgram === 'french'
      ? activeFrenchDeck?.color || '#059669'
      : activeEnglishDeck?.color || '#2563EB';

  // Filtered items for French
  const filteredFrenchItems = useMemo(() => {
    const base = filterFrenchVocabularyItems(
      selectedFrenchCategory,
      selectedLevel as FrenchVocabularyLevel | 'ALL',
      searchQuery
    );
    if (!onlyReview) return base;
    return base.filter((item) =>
      vocabularyProgress.reviewWordIds.includes(item.id)
    );
  }, [
    selectedFrenchCategory,
    selectedLevel,
    searchQuery,
    onlyReview,
    vocabularyProgress.reviewWordIds,
  ]);

  // Filtered items for English
  const filteredEnglishItems = useMemo(() => {
    const base = filterVocabularyItems(
      selectedEnglishCategory,
      selectedLevel,
      searchQuery
    );
    if (!onlyReview) return base;
    return base.filter((item) =>
      vocabularyProgress.reviewWordIds.includes(item.id)
    );
  }, [
    selectedEnglishCategory,
    selectedLevel,
    searchQuery,
    onlyReview,
    vocabularyProgress.reviewWordIds,
  ]);

  const activeFrenchExercises = useMemo(
    () => getFrenchExercisesForCategory(selectedFrenchCategory),
    [selectedFrenchCategory]
  );

  const activeEnglishExercises = useMemo(
    () => getExercisesForCategory(selectedEnglishCategory),
    [selectedEnglishCategory]
  );

  // Statistics
  const totalFrenchMastered = ALL_FRENCH_VOCABULARY_ITEMS.filter((item) =>
    vocabularyProgress.masteredWordIds.includes(item.id)
  ).length;
  const totalFrenchReview = ALL_FRENCH_VOCABULARY_ITEMS.filter((item) =>
    vocabularyProgress.reviewWordIds.includes(item.id)
  ).length;
  const frenchMasteryPercent = Math.round(
    (totalFrenchMastered / Math.max(1, ALL_FRENCH_VOCABULARY_ITEMS.length)) * 100
  );

  const totalEnglishMastered = ALL_VOCABULARY_ITEMS.filter((item) =>
    vocabularyProgress.masteredWordIds.includes(item.id)
  ).length;
  const totalEnglishReview = ALL_VOCABULARY_ITEMS.filter((item) =>
    vocabularyProgress.reviewWordIds.includes(item.id)
  ).length;
  const englishMasteryPercent = Math.round(
    (totalEnglishMastered / Math.max(1, ALL_VOCABULARY_ITEMS.length)) * 100
  );

  const handleProgramSwitch = (prog: ProgramLang) => {
    try {
      Haptics.selectionAsync();
    } catch {
      // ignore
    }
    setSelectedProgram(prog);
    setSelectedLevel('ALL');
    setOnlyReview(false);
    setSearchQuery('');
  };

  const handleModeSwitch = (m: HubMode) => {
    try {
      Haptics.selectionAsync();
    } catch {
      // ignore
    }
    setMode(m);
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: themeColors.background }]}
      edges={['top']}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Nav Row: Back button + Grammar Shortcut */}
        <View style={styles.topNavRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[
              styles.backBtn,
              {
                backgroundColor: themeColors.surface,
                borderColor: themeColors.cardBorder,
              },
            ]}
          >
            <ArrowLeft size={18} color={themeColors.textPrimary} />
          </TouchableOpacity>

          <View
            style={[
              styles.switcherPill,
              {
                backgroundColor: themeColors.surface,
                borderColor: themeColors.cardBorder,
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => router.push('/grammar' as any)}
              style={styles.switchTab}
            >
              <BookOpen size={14} color={themeColors.textSecondary} />
              <Text style={[styles.switchTabText, { color: themeColors.textSecondary }]}>
                Grammaire (33)
              </Text>
            </TouchableOpacity>

            <View style={[styles.switchTabActive, { backgroundColor: accentColor }]}>
              <Sparkles size={14} color="#FFFFFF" />
              <Text style={styles.switchTabTextActive}>
                Vocabulaire (
                {selectedProgram === 'french'
                  ? ALL_FRENCH_VOCABULARY_ITEMS.length
                  : ALL_VOCABULARY_ITEMS.length}
                )
              </Text>
            </View>
          </View>
        </View>

        {/* 2-Way Program Selector Bar: French vs English */}
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
            onPress={() => handleProgramSwitch('french')}
            style={[
              styles.programBtn,
              selectedProgram === 'french' && {
                backgroundColor: '#059669',
              },
            ]}
          >
            <Text
              style={[
                styles.programBtnTitle,
                {
                  color: selectedProgram === 'french' ? '#FFFFFF' : themeColors.textPrimary,
                },
              ]}
            >
              🇫🇷 Vocabulaire Français
            </Text>
            <Text
              style={[
                styles.programBtnSub,
                {
                  color:
                    selectedProgram === 'french'
                      ? 'rgba(255,255,255,0.85)'
                      : themeColors.textMuted,
                },
              ]}
            >
              Heminway • 11 Decks (A1–B2)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => handleProgramSwitch('english')}
            style={[
              styles.programBtn,
              selectedProgram === 'english' && {
                backgroundColor: '#2563EB',
              },
            ]}
          >
            <Text
              style={[
                styles.programBtnTitle,
                {
                  color: selectedProgram === 'english' ? '#FFFFFF' : themeColors.textPrimary,
                },
              ]}
            >
              🇬🇧 Vocabulaire Anglais
            </Text>
            <Text
              style={[
                styles.programBtnSub,
                {
                  color:
                    selectedProgram === 'english'
                      ? 'rgba(255,255,255,0.85)'
                      : themeColors.textMuted,
                },
              ]}
            >
              Murphy & Azar • 10 Decks (A1–B2)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Hero Banner */}
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor:
                selectedProgram === 'french'
                  ? isDark
                    ? '#064E3B'
                    : '#059669'
                  : isDark
                    ? '#1E3A8A'
                    : '#2563EB',
            },
          ]}
        >
          <View style={styles.heroBadgeRow}>
            <View style={styles.heroPill}>
              <Sparkles size={12} color="#A7F3D0" />
              <Text style={styles.heroPillText}>
                {selectedProgram === 'french'
                  ? 'ANNIE HEMINWAY • ALL-IN-ONE & GRAMMAR'
                  : 'MURPHY & AZAR LEXICON • 10 DECKS'}
              </Text>
            </View>
            <Text style={styles.heroLevelTag}>A1 → B2</Text>
          </View>

          <Text style={styles.heroTitle}>
            {selectedProgram === 'french'
              ? 'Vocabulaire Français, Faux Amis & Expressions'
              : 'Vocabulaire Anglais, Phrasal Verbs & Collocations'}
          </Text>
          <Text style={styles.heroDari}>
            {selectedProgram === 'french'
              ? 'واژگان، اصطلاحات عامیانه، افعال با حروف اضافه و کلمات فریبنده از کتاب‌های آنی همین‌وی'
              : 'واژگان، افعال عبارتی، افعال بی‌قاعده و حروف اضافه از کتاب‌های مورفی و بتی آذر'}
          </Text>
          <Text style={styles.heroSubtitle}>
            {selectedProgram === 'french'
              ? 'Maîtrisez les thèmes essentiels (maison, voyages, travail, santé, gastronomie), les faux amis anglais et les expressions idiomatiques en 3 langues (FR • EN • دری).'
              : 'Maîtrisez les verbes à particule, les 3 formes des verbes irréguliers, les prépositions fixes et les paires de mots pièges en 3 langues (EN • FR • دری).'}
          </Text>

          {/* Progress Stats Strip */}
          <View style={styles.statsStrip}>
            <View style={styles.statBox}>
              <View style={styles.statValueRow}>
                <CircleCheck size={15} color="#A7F3D0" />
                <Text style={styles.statNumber}>
                  {selectedProgram === 'french'
                    ? `${totalFrenchMastered}/${ALL_FRENCH_VOCABULARY_ITEMS.length}`
                    : `${totalEnglishMastered}/${ALL_VOCABULARY_ITEMS.length}`}
                </Text>
              </View>
              <Text style={styles.statLabel}>
                Mots maîtrisés (
                {selectedProgram === 'french'
                  ? frenchMasteryPercent
                  : englishMasteryPercent}
                %)
              </Text>
            </View>

            <View style={styles.statDivider} />

            <TouchableOpacity
              onPress={() => {
                setMode('explorer');
                setOnlyReview((prev) => !prev);
              }}
              style={styles.statBox}
            >
              <View style={styles.statValueRow}>
                <Bookmark size={15} color="#FDE047" />
                <Text style={styles.statNumber}>
                  {selectedProgram === 'french' ? totalFrenchReview : totalEnglishReview}
                </Text>
              </View>
              <Text style={styles.statLabel}>
                {onlyReview ? 'Filtre actif ★' : 'À réviser'}
              </Text>
            </TouchableOpacity>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <View style={styles.statValueRow}>
                <Layers size={15} color="#A7F3D0" />
                <Text style={styles.statNumber}>
                  {selectedProgram === 'french'
                    ? FRENCH_VOCABULARY_DECKS.length
                    : VOCABULARY_DECKS.length}
                </Text>
              </View>
              <Text style={styles.statLabel}>Decks thématiques</Text>
            </View>
          </View>
        </View>

        {/* 3 Interactive Mode Tabs: Explorer | Flashcards | Practice */}
        <View
          style={[
            styles.modeBar,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.cardBorder,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => handleModeSwitch('explorer')}
            style={[
              styles.modeBtn,
              mode === 'explorer' && { backgroundColor: accentColor },
            ]}
          >
            <BookOpen
              size={15}
              color={mode === 'explorer' ? '#FFFFFF' : themeColors.textSecondary}
            />
            <Text
              style={[
                styles.modeBtnText,
                {
                  color: mode === 'explorer' ? '#FFFFFF' : themeColors.textSecondary,
                },
              ]}
            >
              Explorateur
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleModeSwitch('flashcards')}
            style={[
              styles.modeBtn,
              mode === 'flashcards' && { backgroundColor: accentColor },
            ]}
          >
            <Layers
              size={15}
              color={mode === 'flashcards' ? '#FFFFFF' : themeColors.textSecondary}
            />
            <Text
              style={[
                styles.modeBtnText,
                {
                  color: mode === 'flashcards' ? '#FFFFFF' : themeColors.textSecondary,
                },
              ]}
            >
              Flashcards 3D
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleModeSwitch('practice')}
            style={[
              styles.modeBtn,
              mode === 'practice' && { backgroundColor: accentColor },
            ]}
          >
            <GraduationCap
              size={15}
              color={mode === 'practice' ? '#FFFFFF' : themeColors.textSecondary}
            />
            <Text
              style={[
                styles.modeBtnText,
                {
                  color: mode === 'practice' ? '#FFFFFF' : themeColors.textSecondary,
                },
              ]}
            >
              Quiz (
              {selectedProgram === 'french'
                ? activeFrenchExercises.length
                : activeEnglishExercises.length}
              )
            </Text>
          </TouchableOpacity>
        </View>

        {/* Horizontal Deck Selector Carousel */}
        <Text style={[styles.sectionHeader, { color: themeColors.textPrimary }]}>
          {selectedProgram === 'french'
            ? '11 Collections Lexicales (Heminway All-in-One)'
            : '10 Collections Lexicales (Murphy & Azar)'}
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.deckCarousel}
        >
          {selectedProgram === 'french' ? (
            <>
              <TouchableOpacity
                onPress={() => setSelectedFrenchCategory('ALL')}
                style={[
                  styles.deckChip,
                  {
                    backgroundColor:
                      selectedFrenchCategory === 'ALL'
                        ? accentColor
                        : themeColors.surface,
                    borderColor:
                      selectedFrenchCategory === 'ALL'
                        ? accentColor
                        : themeColors.cardBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.deckChipTitle,
                    {
                      color:
                        selectedFrenchCategory === 'ALL'
                          ? '#FFFFFF'
                          : themeColors.textPrimary,
                    },
                  ]}
                >
                  Tous les Decks
                </Text>
                <Text
                  style={[
                    styles.deckChipCount,
                    {
                      color:
                        selectedFrenchCategory === 'ALL'
                          ? 'rgba(255,255,255,0.85)'
                          : themeColors.textMuted,
                    },
                  ]}
                >
                  {ALL_FRENCH_VOCABULARY_ITEMS.length} mots
                </Text>
              </TouchableOpacity>

              {FRENCH_VOCABULARY_DECKS.map((d) => {
                const isSelected = selectedFrenchCategory === d.id;
                return (
                  <TouchableOpacity
                    key={d.id}
                    onPress={() => setSelectedFrenchCategory(d.id)}
                    style={[
                      styles.deckChip,
                      {
                        backgroundColor: isSelected ? d.color : themeColors.surface,
                        borderColor: isSelected ? d.color : themeColors.cardBorder,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.deckChipTitle,
                        {
                          color: isSelected ? '#FFFFFF' : themeColors.textPrimary,
                        },
                      ]}
                    >
                      {d.titleFr}
                    </Text>
                    <Text
                      style={[
                        styles.deckChipCount,
                        {
                          color: isSelected
                            ? 'rgba(255,255,255,0.85)'
                            : themeColors.textMuted,
                        },
                      ]}
                    >
                      {d.badge}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={() => setSelectedEnglishCategory('ALL')}
                style={[
                  styles.deckChip,
                  {
                    backgroundColor:
                      selectedEnglishCategory === 'ALL'
                        ? accentColor
                        : themeColors.surface,
                    borderColor:
                      selectedEnglishCategory === 'ALL'
                        ? accentColor
                        : themeColors.cardBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.deckChipTitle,
                    {
                      color:
                        selectedEnglishCategory === 'ALL'
                          ? '#FFFFFF'
                          : themeColors.textPrimary,
                    },
                  ]}
                >
                  Tous les Decks
                </Text>
                <Text
                  style={[
                    styles.deckChipCount,
                    {
                      color:
                        selectedEnglishCategory === 'ALL'
                          ? 'rgba(255,255,255,0.85)'
                          : themeColors.textMuted,
                    },
                  ]}
                >
                  {ALL_VOCABULARY_ITEMS.length} mots
                </Text>
              </TouchableOpacity>

              {VOCABULARY_DECKS.map((d) => {
                const isSelected = selectedEnglishCategory === d.id;
                return (
                  <TouchableOpacity
                    key={d.id}
                    onPress={() => setSelectedEnglishCategory(d.id)}
                    style={[
                      styles.deckChip,
                      {
                        backgroundColor: isSelected ? d.color : themeColors.surface,
                        borderColor: isSelected ? d.color : themeColors.cardBorder,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.deckChipTitle,
                        {
                          color: isSelected ? '#FFFFFF' : themeColors.textPrimary,
                        },
                      ]}
                    >
                      {d.titleFr}
                    </Text>
                    <Text
                      style={[
                        styles.deckChipCount,
                        {
                          color: isSelected
                            ? 'rgba(255,255,255,0.85)'
                            : themeColors.textMuted,
                        },
                      ]}
                    >
                      {d.badge}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </>
          )}
        </ScrollView>

        {/* Search & Level Filters (for Explorer & Flashcards) */}
        {mode !== 'practice' ? (
          <View style={styles.filterSection}>
            <View
              style={[
                styles.searchBar,
                {
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.cardBorder,
                },
              ]}
            >
              <Search size={16} color={themeColors.textMuted} />
              <TextInput
                placeholder={
                  selectedProgram === 'french'
                    ? "Rechercher en français, anglais ou دری ('coup de foudre', 'loyer')..."
                    : "Rechercher en anglais, français ou دری ('give up', 'look forward')..."
                }
                placeholderTextColor={themeColors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={[styles.searchInput, { color: themeColors.textPrimary }]}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X size={16} color={themeColors.textMuted} />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.levelRow}
            >
              {LEVEL_TABS.map((tab) => {
                const isSelected = selectedLevel === tab.id;
                return (
                  <TouchableOpacity
                    key={tab.id}
                    onPress={() => setSelectedLevel(tab.id)}
                    style={[
                      styles.levelPill,
                      {
                        backgroundColor: isSelected ? accentColor : themeColors.surface,
                        borderColor: isSelected ? accentColor : themeColors.cardBorder,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.levelPillText,
                        {
                          color: isSelected ? '#FFFFFF' : themeColors.textSecondary,
                        },
                      ]}
                    >
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity
                onPress={() => setOnlyReview((prev) => !prev)}
                style={[
                  styles.levelPill,
                  {
                    backgroundColor: onlyReview ? '#FEF9C3' : themeColors.surface,
                    borderColor: onlyReview ? '#CA8A04' : themeColors.cardBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.levelPillText,
                    { color: onlyReview ? '#A16207' : themeColors.textSecondary },
                  ]}
                >
                  ★ À réviser (
                  {selectedProgram === 'french' ? totalFrenchReview : totalEnglishReview})
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        ) : null}

        {/* Main Content Area by Mode & Program */}
        {selectedProgram === 'french' ? (
          mode === 'explorer' ? (
            <View style={styles.listSection}>
              <Text style={[styles.resultsCount, { color: themeColors.textMuted }]}>
                {filteredFrenchItems.length} entrée
                {filteredFrenchItems.length > 1 ? 's' : ''} affichée
                {filteredFrenchItems.length > 1 ? 's' : ''}
              </Text>
              {filteredFrenchItems.map((item) => {
                const deckColor =
                  FRENCH_VOCABULARY_DECKS.find((d) => d.id === item.category)?.color ||
                  accentColor;
                return (
                  <FrenchVocabularyCard
                    key={item.id}
                    item={item}
                    accentColor={deckColor}
                  />
                );
              })}
            </View>
          ) : mode === 'flashcards' ? (
            <FrenchVocabularyFlashcardView
              key={`fr-fc-${selectedFrenchCategory}-${selectedLevel}-${onlyReview}`}
              items={filteredFrenchItems}
              accentColor={accentColor}
            />
          ) : (
            <FrenchVocabularyPracticeEngine
              key={`fr-quiz-${selectedFrenchCategory}`}
              deckId={selectedFrenchCategory}
              deckTitle={
                activeFrenchDeck
                  ? activeFrenchDeck.titleFr
                  : 'Quiz Général — Tous les Decks Français (Heminway)'
              }
              exercises={activeFrenchExercises}
              accentColor={accentColor}
            />
          )
        ) : mode === 'explorer' ? (
          <View style={styles.listSection}>
            <Text style={[styles.resultsCount, { color: themeColors.textMuted }]}>
              {filteredEnglishItems.length} entrée
              {filteredEnglishItems.length > 1 ? 's' : ''} affichée
              {filteredEnglishItems.length > 1 ? 's' : ''}
            </Text>
            {filteredEnglishItems.map((item) => {
              const deckColor =
                VOCABULARY_DECKS.find((d) => d.id === item.category)?.color ||
                accentColor;
              return (
                <VocabularyCard
                  key={item.id}
                  item={item}
                  accentColor={deckColor}
                />
              );
            })}
          </View>
        ) : mode === 'flashcards' ? (
          <VocabularyFlashcardView
            key={`en-fc-${selectedEnglishCategory}-${selectedLevel}-${onlyReview}`}
            items={filteredEnglishItems}
            accentColor={accentColor}
          />
        ) : (
          <VocabularyPracticeEngine
            key={`en-quiz-${selectedEnglishCategory}`}
            deckId={selectedEnglishCategory}
            deckTitle={
              activeEnglishDeck
                ? activeEnglishDeck.titleFr
                : 'Quiz Général — Tous les Decks (Murphy & Azar)'
            }
            exercises={activeEnglishExercises}
            accentColor={accentColor}
          />
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
    paddingTop: 10,
    paddingBottom: 40,
  },
  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 8,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switcherPill: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 3,
    gap: 4,
  },
  switchTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  switchTabText: {
    fontSize: 12,
    fontWeight: '700',
  },
  switchTabActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  switchTabTextActive: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
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
  programBtnTitle: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  programBtnSub: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },
  heroCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  heroPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroLevelTag: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    fontWeight: '700',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 25,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  heroDari: {
    color: '#FEF08A',
    fontSize: 13,
    textAlign: 'right',
    lineHeight: 18,
    marginBottom: 6,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12.5,
    lineHeight: 17,
    marginBottom: 12,
  },
  statsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 10,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  modeBar: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 4,
    gap: 4,
    marginBottom: 12,
  },
  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 10,
  },
  modeBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
  },
  deckCarousel: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 8,
  },
  deckChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 90,
  },
  deckChipTitle: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 2,
  },
  deckChipCount: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  filterSection: {
    marginVertical: 6,
    gap: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    padding: 0,
  },
  levelRow: {
    flexDirection: 'row',
    gap: 6,
  },
  levelPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  levelPillText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  listSection: {
    marginTop: 4,
  },
  resultsCount: {
    fontSize: 12,
    marginBottom: 4,
  },
});
