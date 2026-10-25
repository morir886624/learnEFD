import React, { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bookmark } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { useResponsive } from '../../hooks/useResponsive';
import { PHRASES } from '../../data/phrases';
import { SearchBar } from '../../components/common/SearchBar';
import { PhraseCard } from '../../components/phrases/PhraseCard';

export default function FavoritesScreen() {
  const { themeColors, favorites } = useApp();
  const { contentMaxWidth } = useResponsive();
  const [searchQuery, setSearchQuery] = useState('');

  const favoritePhrases = useMemo(() => {
    return PHRASES.filter((p) => favorites.includes(p.id)).filter((item) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        item.fr.toLowerCase().includes(q) ||
        item.en.toLowerCase().includes(q) ||
        item.dari.toLowerCase().includes(q) ||
        item.dariPhonetic.toLowerCase().includes(q)
      );
    });
  }, [favorites, searchQuery]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <View style={[styles.container, { maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' }]}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: themeColors.textPrimary }]}>
            Phrases Favorites
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            {favorites.length} phrase(s) enregistrée(s) pour révision prioritaire
          </Text>
        </View>

        {favorites.length > 0 && (
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Filtrer vos favoris..."
          />
        )}

        <FlatList
          data={favoritePhrases}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PhraseCard phrase={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Bookmark size={48} color={themeColors.textMuted} />
              <Text style={[styles.emptyTitle, { color: themeColors.textPrimary }]}>
                Aucun favori pour le moment
              </Text>
              <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>
                {"Touchez l'icône marque-page sur n'importe quelle phrase pour la retrouver ici et la réviser."}
              </Text>
            </View>
          }
        />
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
    marginBottom: 8,
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
  listContent: {
    paddingBottom: 24,
  },
  emptyBox: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
