import React, { useMemo, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { useResponsive } from '../../hooks/useResponsive';
import { PHRASES } from '../../data/phrases';
import { CATEGORIES } from '../../data/categories';
import { CategoryId, Level, Phrase } from '../../types/phrase';
import { SearchBar } from '../../components/common/SearchBar';
import { PhraseCard } from '../../components/phrases/PhraseCard';
import { MasterDetailView } from '../../components/tablet/MasterDetailView';

export default function PhrasesScreen() {
  const { themeColors } = useApp();
  const { isTablet, contentMaxWidth } = useResponsive();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<Level | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [selectedPhrase, setSelectedPhrase] = useState<Phrase | null>(PHRASES[0]);

  const filteredPhrases = useMemo(() => {
    return PHRASES.filter((item) => {
      // Level filter
      if (selectedLevel !== 'ALL' && item.level !== selectedLevel) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const matchFr = item.fr.toLowerCase().includes(q);
        const matchEn = item.en.toLowerCase().includes(q);
        const matchDari = item.dari.toLowerCase().includes(q);
        const matchPhonetic = item.dariPhonetic.toLowerCase().includes(q);
        return matchFr || matchEn || matchDari || matchPhonetic;
      }
      return true;
    });
  }, [searchQuery, selectedLevel, selectedCategory]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <View
        style={[
          styles.container,
          { maxWidth: isTablet ? '96%' : contentMaxWidth, alignSelf: 'center', width: '100%' },
        ]}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: themeColors.textPrimary }]}>
            Guide des Phrases Trilingues
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            Français • English • دری (Dari)
          </Text>
        </View>

        {/* SEARCH BAR */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Chercher : métro, travail, سلام..."
        />

        {/* LEVEL FILTERS */}
        <View style={styles.filterRow}>
          {(['ALL', 'A1', 'A2', 'B1'] as const).map((lvl) => {
            const isSelected = selectedLevel === lvl;
            return (
              <TouchableOpacity
                key={lvl}
                onPress={() => setSelectedLevel(lvl)}
                activeOpacity={0.7}
                style={[
                  styles.levelChip,
                  {
                    backgroundColor: isSelected
                      ? themeColors.primary
                      : themeColors.surface,
                    borderColor: isSelected ? themeColors.primary : themeColors.cardBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.levelChipText,
                    { color: isSelected ? '#FFFFFF' : themeColors.textSecondary },
                  ]}
                >
                  {lvl === 'ALL' ? 'Tous les niveaux' : `Niveau ${lvl}`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* CATEGORY CHIPS */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            <TouchableOpacity
              onPress={() => setSelectedCategory('all')}
              style={[
                styles.catPill,
                {
                  backgroundColor: selectedCategory === 'all' ? themeColors.primary : themeColors.surface,
                  borderColor: selectedCategory === 'all' ? themeColors.primary : themeColors.cardBorder,
                },
              ]}
            >
              <Text
                style={[
                  styles.catPillText,
                  { color: selectedCategory === 'all' ? '#FFF' : themeColors.textPrimary },
                ]}
              >
                ✨ Tous les thèmes
              </Text>
            </TouchableOpacity>

            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.id)}
                  style={[
                    styles.catPill,
                    {
                      backgroundColor: isSelected ? cat.color : themeColors.surface,
                      borderColor: isSelected ? cat.color : themeColors.cardBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.catPillText,
                      { color: isSelected ? '#FFFFFF' : themeColors.textPrimary },
                    ]}
                  >
                    {cat.labelFr}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* RESULTS COUNT */}
        <View style={styles.countRow}>
          <Text style={[styles.countText, { color: themeColors.textMuted }]}>
            {filteredPhrases.length} phrase(s) trouvée(s)
          </Text>
        </View>

        {/* LIST / MASTER-DETAIL RENDER */}
        {isTablet ? (
          <MasterDetailView
            phrases={filteredPhrases}
            selectedPhrase={selectedPhrase}
            onSelectPhrase={setSelectedPhrase}
          />
        ) : (
          <FlatList
            data={filteredPhrases}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <PhraseCard phrase={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>
                  Aucune phrase ne correspond à vos filtres.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 6,
  },
  levelChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  levelChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  categoriesContainer: {
    marginVertical: 4,
  },
  categoryScroll: {
    gap: 8,
    paddingVertical: 4,
  },
  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  catPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  countRow: {
    marginVertical: 6,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyBox: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
  },
});
