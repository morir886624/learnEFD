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
import {
  VOCABULARY_DECKS,
  ALL_VOCABULARY_ITEMS,
  filterVocabularyItems,
  getExercisesForCategory,
  getVocabularyByCategory,
} from '../../data/vocabulary';
import { VocabularyCategory, VocabularyLevel } from '../../types/vocabulary';
import { VocabularyCard } from '../../components/vocabulary/VocabularyCard';
import { VocabularyFlashcardView } from '../../components/vocabulary/VocabularyFlashcardView';
import { VocabularyPracticeEngine } from '../../components/vocabulary/VocabularyPracticeEngine';
import { useApp } from '../../context/AppContext';

type HubMode = 'explorer' | 'flashcards' | 'practice';

export default function VocabularyHubScreen() {
  const { category: initialCategory } = useLocalSearchParams<{
    category?: VocabularyCategory;
  }>();
  const { themeColors, isDark, vocabularyProgress } = useApp();

  const [mode, setMode] = useState<HubMode>('explorer');
  const [selectedCategory, setSelectedCategory] = useState<VocabularyCategory | 'ALL'>(
    initialCategory || 'ALL'
  );
  const [selectedLevel, setSelectedLevel] = useState<VocabularyLevel | 'ALL'>('ALL');
  const [onlyReview, setOnlyReview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeDeck = useMemo(
    () => VOCABULARY_DECKS.find((d) => d.id === selectedCategory),
    [selectedCategory]
  );

  const accentColor = activeDeck?.color || '#059669';

  const filteredItems = useMemo(() => {
    const base = filterVocabularyItems(selectedCategory, selectedLevel, searchQuery);
    if (!onlyReview) return base;
    return base.filter((item) =>
      vocabularyProgress.reviewWordIds.includes(item.id)
    );
  }, [selectedCategory, selectedLevel, searchQuery, onlyReview, vocabularyProgress.reviewWordIds]);

  const activeExercises = useMemo(
    () => getExercisesForCategory(selectedCategory),
    [selectedCategory]
  );

  const totalMastered = vocabularyProgress.masteredWordIds.length;
  const totalReview = vocabularyProgress.reviewWordIds.length;
  const masteryPercentage = Math.round(
    (totalMastered / ALL_VOCABULARY_ITEMS.length) * 100
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: themeColors.background }]}
      edges={['top']}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Switcher: Back + Grammar / Vocabulary Toggle */}
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
                Grammaire (36)
              </Text>
            </TouchableOpacity>

            <View style={[styles.switchTabActive, { backgroundColor: '#059669' }]}>
              <Sparkles size={14} color="#FFFFFF" />
              <Text style={styles.switchTabTextActive}>
                Vocabulaire ({ALL_VOCABULARY_ITEMS.length})
              </Text>
            </View>
          </View>
        </View>

        {/* Hero Banner */}
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: isDark ? '#064E3B' : '#059669',
            },
          ]}
        >
          <View style={styles.heroBadgeRow}>
            <View style={styles.heroPill}>
              <Sparkles size={12} color="#A7F3D0" />
              <Text style={styles.heroPillText}>
                MURPHY & AZAR LEXICON • 10 DECKS
              </Text>
            </View>
            <Text style={styles.heroLevelTag}>A1 → B2</Text>
          </View>

          <Text style={styles.heroTitle}>
            Vocabulaire, Phrasal Verbs & Collocations
          </Text>
          <Text style={styles.heroDari}>
            واژگان، افعال عبارتی، افعال بی‌قاعده و حروف اضافه از کتاب‌های مورفی و بتی آذر
          </Text>
          <Text style={styles.heroSubtitle}>
            Maîtrisez les verbes à particule, les 3 formes des verbes irréguliers, les
            prépositions fixes et les paires de mots pièges en 3 langues (EN • FR • دری).
          </Text>

          {/* Progress Stats Strip */}
          <View style={styles.statsStrip}>
            <View style={styles.statBox}>
              <View style={styles.statValueRow}>
                <CircleCheck size={15} color="#A7F3D0" />
                <Text style={styles.statNumber}>
                  {totalMastered}/{ALL_VOCABULARY_ITEMS.length}
                </Text>
              </View>
              <Text style={styles.statLabel}>Mots maîtrisés ({masteryPercentage}%)</Text>
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
                <Text style={styles.statNumber}>{totalReview}</Text>
              </View>
              <Text style={styles.statLabel}>
                {onlyReview ? 'Filtre actif ★' : 'À réviser'}
              </Text>
            </TouchableOpacity>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <View style={styles.statValueRow}>
                <Layers size={15} color="#A7F3D0" />
                <Text style={styles.statNumber}>{VOCABULARY_DECKS.length}</Text>
              </View>
              <Text style={styles.statLabel}>Decks thématiques</Text>
            </View>
          </View>
        </View>

        {/* 3 Interactive Mode Tabs */}
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
            onPress={() => setMode('explorer')}
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
            onPress={() => setMode('flashcards')}
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
            onPress={() => setMode('practice')}
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
              Quiz ({activeExercises.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Horizontal Deck Selector */}
        <Text style={[styles.sectionHeader, { color: themeColors.textPrimary }]}>
          10 Collections Lexicales (Murphy & Azar)
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.deckCarousel}
        >
          <TouchableOpacity
            onPress={() => setSelectedCategory('ALL')}
            style={[
              styles.deckChip,
              {
                backgroundColor:
                  selectedCategory === 'ALL' ? '#059669' : themeColors.surface,
                borderColor:
                  selectedCategory === 'ALL' ? '#059669' : themeColors.cardBorder,
              },
            ]}
          >
            <Text
              style={[
                styles.deckChipOrder,
                {
                  color:
                    selectedCategory === 'ALL'
                      ? '#A7F3D0'
                      : themeColors.textMuted,
                },
              ]}
            >
              TOUS LES DECKS
            </Text>
            <Text
              style={[
                styles.deckChipTitle,
                {
                  color:
                    selectedCategory === 'ALL'
                      ? '#FFFFFF'
                      : themeColors.textPrimary,
                },
              ]}
            >
              Intégrale ({ALL_VOCABULARY_ITEMS.length} entrées)
            </Text>
            <Text
              style={[
                styles.deckChipBadge,
                {
                  color:
                    selectedCategory === 'ALL'
                      ? '#ECFDF5'
                      : themeColors.textSecondary,
                },
              ]}
            >
              Murphy & Azar A1–B2
            </Text>
          </TouchableOpacity>

          {VOCABULARY_DECKS.map((deck) => {
            const isSelected = selectedCategory === deck.id;
            const deckItems = getVocabularyByCategory(deck.id);
            const deckScore = vocabularyProgress.deckScores[deck.id];

            return (
              <TouchableOpacity
                key={deck.id}
                onPress={() => setSelectedCategory(deck.id)}
                style={[
                  styles.deckChip,
                  {
                    backgroundColor: isSelected ? deck.color : themeColors.surface,
                    borderColor: isSelected ? deck.color : themeColors.cardBorder,
                  },
                ]}
              >
                <View style={styles.deckChipTopRow}>
                  <Text
                    style={[
                      styles.deckChipOrder,
                      { color: isSelected ? '#FFFFFFCC' : deck.color },
                    ]}
                  >
                    DECK {deck.order} • {deckItems.length} MOTS
                  </Text>
                  {deckScore ? (
                    <Text
                      style={[
                        styles.deckScoreBadge,
                        { color: isSelected ? '#FFFFFF' : '#16A34A' },
                      ]}
                    >
                      ✓ {deckScore.score}/{deckScore.total}
                    </Text>
                  ) : null}
                </View>

                <Text
                  numberOfLines={1}
                  style={[
                    styles.deckChipTitle,
                    { color: isSelected ? '#FFFFFF' : themeColors.textPrimary },
                  ]}
                >
                  {deck.titleFr}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.deckChipBadge,
                    { color: isSelected ? '#FFFFFFDD' : themeColors.textMuted },
                  ]}
                >
                  {deck.badge}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Active Deck Summary Box */}
        {activeDeck ? (
          <View
            style={[
              styles.activeDeckBanner,
              {
                backgroundColor: `${activeDeck.color}12`,
                borderColor: `${activeDeck.color}40`,
              },
            ]}
          >
            <View style={styles.activeDeckHeader}>
              <Text style={[styles.activeDeckTitle, { color: activeDeck.color }]}>
                {activeDeck.titleFr}
              </Text>
              <Text style={[styles.activeDeckBadge, { color: activeDeck.color }]}>
                {activeDeck.badge}
              </Text>
            </View>
            <Text
              style={[
                styles.activeDeckDesc,
                { color: themeColors.textSecondary },
              ]}
            >
              {activeDeck.descriptionFr}
            </Text>
            <Text
              style={[
                styles.activeDeckDari,
                { color: themeColors.textMuted },
              ]}
            >
              {activeDeck.descriptionDari}
            </Text>
          </View>
        ) : null}

        {/* Search & Level Filter Bar (visible in Explorer & Flashcards) */}
        {mode !== 'practice' ? (
          <View style={styles.filtersContainer}>
            <View
              style={[
                styles.searchBox,
                {
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.cardBorder,
                },
              ]}
            >
              <Search size={17} color={themeColors.textMuted} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Rechercher un verbe, phrasal verb, préposition, sens..."
                placeholderTextColor={themeColors.textMuted}
                style={[styles.searchInput, { color: themeColors.textPrimary }]}
              />
              {searchQuery.length > 0 ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X size={16} color={themeColors.textMuted} />
                </TouchableOpacity>
              ) : null}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.levelFilterRow}
            >
              {(['ALL', 'A1', 'A2', 'B1', 'B2'] as const).map((lvl) => {
                const active = selectedLevel === lvl;
                return (
                  <TouchableOpacity
                    key={lvl}
                    onPress={() => setSelectedLevel(lvl)}
                    style={[
                      styles.levelPill,
                      {
                        backgroundColor: active ? accentColor : themeColors.surface,
                        borderColor: active ? accentColor : themeColors.cardBorder,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.levelPillText,
                        {
                          color: active ? '#FFFFFF' : themeColors.textSecondary,
                        },
                      ]}
                    >
                      {lvl === 'ALL' ? 'Tous niveaux' : `Niveau ${lvl}`}
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
                  ★ À réviser ({totalReview})
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        ) : null}

        {/* Main Content Area by Mode */}
        {mode === 'explorer' ? (
          <View style={styles.listSection}>
            <Text style={[styles.resultsCount, { color: themeColors.textMuted }]}>
              {filteredItems.length} entrée{filteredItems.length > 1 ? 's' : ''}{' '}
              affichée{filteredItems.length > 1 ? 's' : ''}
            </Text>
            {filteredItems.map((item) => {
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
            items={filteredItems}
            accentColor={accentColor}
          />
        ) : (
          <VocabularyPracticeEngine
            deckId={selectedCategory}
            deckTitle={
              activeDeck
                ? activeDeck.titleFr
                : 'Quiz Général — Tous les Decks (Murphy & Azar)'
            }
            exercises={activeExercises}
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
    gap: 10,
    marginBottom: 12,
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
    flex: 1,
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 3,
  },
  switchTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 7,
    borderRadius: 9,
  },
  switchTabActive: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 7,
    borderRadius: 9,
  },
  switchTabText: {
    fontSize: 12,
    fontWeight: '700',
  },
  switchTabTextActive: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
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
    backgroundColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  heroPillText: {
    color: '#ECFDF5',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroLevelTag: {
    color: '#A7F3D0',
    fontSize: 11.5,
    fontWeight: '800',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 25,
    marginBottom: 4,
  },
  heroDari: {
    color: '#D1FAE5',
    fontSize: 13.5,
    fontWeight: '700',
    textAlign: 'right',
    marginBottom: 6,
  },
  heroSubtitle: {
    color: '#ECFDF5',
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 14,
  },
  statsStrip: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 2,
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '900',
  },
  statLabel: {
    color: '#D1FAE5',
    fontSize: 10.5,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  modeBar: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 4,
    marginBottom: 16,
  },
  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
  },
  modeBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 8,
  },
  deckCarousel: {
    gap: 10,
    paddingBottom: 12,
  },
  deckChip: {
    width: 205,
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 12,
    justifyContent: 'space-between',
  },
  deckChipTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  deckChipOrder: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  deckScoreBadge: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  deckChipTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    marginBottom: 3,
  },
  deckChipBadge: {
    fontSize: 11,
    fontWeight: '600',
  },
  activeDeckBanner: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  activeDeckHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  activeDeckTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  activeDeckBadge: {
    fontSize: 11,
    fontWeight: '700',
  },
  activeDeckDesc: {
    fontSize: 12.5,
    lineHeight: 17,
    marginBottom: 3,
  },
  activeDeckDari: {
    fontSize: 12.5,
    textAlign: 'right',
  },
  filtersContainer: {
    marginBottom: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 8,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    padding: 0,
  },
  levelFilterRow: {
    gap: 8,
    paddingBottom: 4,
  },
  levelPill: {
    paddingHorizontal: 12,
    paddingVertical: 6.5,
    borderRadius: 20,
    borderWidth: 1,
  },
  levelPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  listSection: {
    marginTop: 4,
  },
  resultsCount: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
});
