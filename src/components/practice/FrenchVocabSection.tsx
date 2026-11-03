import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useApp } from '../../context/AppContext';
import {
  FRENCH_VOCABULARY_DECKS,
  filterFrenchVocabularyItems,
  getFrenchExercisesForCategory,
} from '../../data/frenchVocabulary';
import {
  FrenchVocabularyCategory,
  FrenchVocabularyLevel,
} from '../../types/frenchVocabulary';
import { FrenchVocabularyCard } from '../vocabulary/FrenchVocabularyCard';
import { FrenchVocabularyFlashcardView } from '../vocabulary/FrenchVocabularyFlashcardView';
import { FrenchVocabularyPracticeEngine } from '../vocabulary/FrenchVocabularyPracticeEngine';
import { SearchBar } from '../common/SearchBar';
import { PracticeMode } from './types';

interface FrenchVocabSectionProps {
  mode: PracticeMode;
}

const PAGE_SIZE = 25;

export const FrenchVocabSection: React.FC<FrenchVocabSectionProps> = ({ mode }) => {
  const { themeColors } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<FrenchVocabularyCategory | 'ALL'>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<FrenchVocabularyLevel | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  const activeDeck = useMemo(
    () => FRENCH_VOCABULARY_DECKS.find((d) => d.id === selectedCategory),
    [selectedCategory]
  );

  const filteredItems = useMemo(() => {
    return filterFrenchVocabularyItems(
      selectedCategory,
      selectedLevel,
      searchQuery
    );
  }, [selectedCategory, selectedLevel, searchQuery]);

  const levelCounts = useMemo(() => {
    const allInCat = filterFrenchVocabularyItems(selectedCategory, 'ALL', searchQuery);
    const counts: Record<string, number> = { ALL: allInCat.length, A1: 0, A2: 0, B1: 0, B2: 0 };
    for (const item of allInCat) {
      counts[item.level] = (counts[item.level] || 0) + 1;
    }
    return counts;
  }, [selectedCategory, searchQuery]);

  const visibleItems = useMemo(
    () => filteredItems.slice(0, visibleCount),
    [filteredItems, visibleCount]
  );

  const exercises = useMemo(() => {
    return getFrenchExercisesForCategory(selectedCategory);
  }, [selectedCategory]);

  return (
    <View style={styles.container}>
      {/* DECK SELECTOR CHIPS */}
      <View style={styles.deckScrollerRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsTrack}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setSelectedCategory('ALL');
              setVisibleCount(PAGE_SIZE);
            }}
            style={[
              styles.deckChip,
              {
                backgroundColor: selectedCategory === 'ALL' ? themeColors.frAccent : themeColors.surface,
                borderColor: selectedCategory === 'ALL' ? themeColors.frAccent : themeColors.cardBorder,
              },
            ]}
          >
            <Text
              style={[
                styles.deckChipText,
                { color: selectedCategory === 'ALL' ? '#FFFFFF' : themeColors.textPrimary },
              ]}
            >
              Tous les Thèmes
            </Text>
          </TouchableOpacity>

          {FRENCH_VOCABULARY_DECKS.map((deck) => {
            const isSelected = selectedCategory === deck.id;
            return (
              <TouchableOpacity
                key={deck.id}
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedCategory(deck.id);
                  setVisibleCount(PAGE_SIZE);
                }}
                style={[
                  styles.deckChip,
                  {
                    backgroundColor: isSelected ? deck.color : themeColors.surface,
                    borderColor: isSelected ? deck.color : themeColors.cardBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.deckChipText,
                    { color: isSelected ? '#FFFFFF' : themeColors.textPrimary },
                  ]}
                >
                  {deck.titleFr}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* RENDER BY MODE */}
      {mode === 'explorer' && (
        <View>
          <SearchBar
            value={searchQuery}
            onChangeText={(txt) => {
              setSearchQuery(txt);
              setVisibleCount(PAGE_SIZE);
            }}
            placeholder="Rechercher un mot français, anglais ou دری..."
          />

          <View style={styles.levelRow}>
            {(['ALL', 'A1', 'A2', 'B1', 'B2'] as const).map((lvl) => {
              const isSelected = selectedLevel === lvl;
              return (
                <TouchableOpacity
                  key={lvl}
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedLevel(lvl);
                    setVisibleCount(PAGE_SIZE);
                  }}
                  style={[
                    styles.levelChip,
                    {
                      backgroundColor: isSelected ? themeColors.frAccent : themeColors.surface,
                      borderColor: isSelected ? themeColors.frAccent : themeColors.cardBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.levelChipText,
                      { color: isSelected ? '#FFFFFF' : themeColors.textSecondary, fontWeight: isSelected ? '800' : '600' },
                    ]}
                  >
                    {lvl === 'ALL' ? `Tous (${levelCounts.ALL})` : `${lvl} (${levelCounts[lvl] || 0})`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.resultsInfoRow}>
            <Text style={[styles.resultsCount, { color: themeColors.textMuted }]}>
              {filteredItems.length} {filteredItems.length === 1 ? 'mot trouvé' : 'mots trouvés'}
              {filteredItems.length > visibleItems.length ? ` • Affichage de ${visibleItems.length}` : ''}
            </Text>
          </View>

          {visibleItems.map((item) => (
            <FrenchVocabularyCard key={item.id} item={item} />
          ))}

          {visibleCount < filteredItems.length && (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
              style={[
                styles.loadMoreBtn,
                {
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.frAccent,
                },
              ]}
            >
              <Text style={[styles.loadMoreText, { color: themeColors.frAccent }]}>
                Afficher plus ({Math.min(PAGE_SIZE, filteredItems.length - visibleCount)} suivants sur {filteredItems.length - visibleCount} restants)
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {mode === 'flashcards' && (
        <FrenchVocabularyFlashcardView
          items={filteredItems}
          accentColor={activeDeck?.color || themeColors.frAccent}
        />
      )}

      {mode === 'quiz' && (
        <FrenchVocabularyPracticeEngine
          deckId={selectedCategory === 'ALL' ? 'daily-life' : selectedCategory}
          deckTitle={activeDeck?.titleFr || 'Vocabulaire Français Général'}
          exercises={exercises}
          accentColor={activeDeck?.color || themeColors.frAccent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  deckScrollerRow: {
    marginBottom: 10,
  },
  chipsTrack: {
    flexDirection: 'row',
    gap: 6,
  },
  deckChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
  },
  deckIcon: {
    fontSize: 14,
  },
  deckChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  levelRow: {
    flexDirection: 'row',
    gap: 6,
    marginVertical: 8,
  },
  levelChip: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  levelChipText: {
    fontSize: 11.5,
  },
  resultsInfoRow: {
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  resultsCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  loadMoreBtn: {
    marginTop: 6,
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadMoreText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
