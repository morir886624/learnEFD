import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { BookOpen } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { PHRASES } from '../../data/phrases';
import { CATEGORIES } from '../../data/categories';
import { CategoryId, Level, Phrase } from '../../types/phrase';
import { SearchBar } from '../common/SearchBar';
import { PhraseCard } from '../phrases/PhraseCard';

export const PhrasesExplorerView: React.FC = () => {
  const { themeColors } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<Level | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');

  const filteredPhrases = useMemo(() => {
    return PHRASES.filter((item) => {
      if (selectedLevel !== 'ALL' && item.level !== selectedLevel) {
        return false;
      }
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
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
    <View style={styles.container}>
      {/* TOOLBAR: SEARCH & READER SHORTCUT */}
      <View style={styles.searchRow}>
        <View style={{ flex: 1 }}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Chercher : métro, travail, سلام..."
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/reader')}
          style={[
            styles.readerBtn,
            {
              backgroundColor: themeColors.primaryLight,
              borderColor: themeColors.primary,
            },
          ]}
        >
          <BookOpen size={15} color={themeColors.primary} />
          <Text style={[styles.readerBtnText, { color: themeColors.primary }]}>
            Livre
          </Text>
        </TouchableOpacity>
      </View>

      {/* LEVEL FILTERS */}
      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsTrack}>
          {(['ALL', 'A1', 'A2', 'B1'] as const).map((lvl) => {
            const isSelected = selectedLevel === lvl;
            return (
              <TouchableOpacity
                key={lvl}
                activeOpacity={0.8}
                onPress={() => setSelectedLevel(lvl)}
                style={[
                  styles.levelChip,
                  {
                    backgroundColor: isSelected ? themeColors.primary : themeColors.surface,
                    borderColor: isSelected ? themeColors.primary : themeColors.cardBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.levelChipText,
                    {
                      color: isSelected ? '#FFFFFF' : themeColors.textSecondary,
                      fontWeight: isSelected ? '800' : '600',
                    },
                  ]}
                >
                  {lvl === 'ALL' ? 'Tous Niveaux' : lvl}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* CATEGORY CHIPS */}
      <View style={styles.categoryRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsTrack}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.8}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: isSelected ? `${themeColors.primary}18` : themeColors.surfaceSubtle,
                    borderColor: isSelected ? themeColors.primary : 'transparent',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    {
                      color: isSelected ? themeColors.primary : themeColors.textSecondary,
                      fontWeight: isSelected ? '700' : '500',
                    },
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
      <View style={styles.resultsInfoRow}>
        <Text style={[styles.resultsCount, { color: themeColors.textMuted }]}>
          {filteredPhrases.length} {filteredPhrases.length === 1 ? 'phrase trouvée' : 'phrases trouvées'}
        </Text>
      </View>

      {/* PHRASE CARDS LIST */}
      {filteredPhrases.map((phrase: Phrase) => (
        <PhraseCard key={phrase.id} phrase={phrase} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  readerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    height: 44,
  },
  readerBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  filterRow: {
    marginBottom: 8,
  },
  categoryRow: {
    marginBottom: 10,
  },
  chipsTrack: {
    flexDirection: 'row',
    gap: 6,
  },
  levelChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  levelChipText: {
    fontSize: 11.5,
  },
  categoryChip: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  categoryChipText: {
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
});
