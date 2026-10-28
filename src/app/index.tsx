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
  Flame,
  Layers,
  Award,
  BookOpen,
  Bookmark,
  TrendingUp,
  Sparkles,
  ArrowRight,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { useResponsive } from '../hooks/useResponsive';
import { PHRASES } from '../data/phrases';
import { PhraseCard } from '../components/phrases/PhraseCard';
import { AppLogo } from '../components/common/AppLogo';

export default function HomeScreen() {
  const { themeColors, stats, favorites } = useApp();
  const { isTablet, contentMaxWidth } = useResponsive();

  // Consistent phrase of the day initialized once on mount
  const [phraseOfTheDay] = useState(() => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
    );
    return PHRASES[dayOfYear % PHRASES.length];
  });

  const totalCount = PHRASES.length;
  const a1Count = PHRASES.filter((p) => p.level === 'A1').length;
  const a2Count = PHRASES.filter((p) => p.level === 'A2').length;
  const b1Count = PHRASES.filter((p) => p.level === 'B1').length;
  const masteredCount = stats.masteredPhraseIds.length;
  const progressPercent = Math.min(100, Math.round((masteredCount / totalCount) * 100));

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' }]}
        showsVerticalScrollIndicator={false}
      >
        {/* TOP BRAND HEADER */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <AppLogo size={52} />
            <View>
              <Text style={[styles.appBrand, { color: themeColors.primary }]}>LearnEFD</Text>
              <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
                Français • English • دری (Dari)
              </Text>
            </View>
          </View>

          {/* Daily Streak Badge */}
          <View style={[styles.streakPill, { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }]}>
            <Flame size={20} color="#D97706" />
            <Text style={styles.streakText}>{stats.streakDays} j de suite</Text>
          </View>
        </View>

        {/* PROGRESS OVERVIEW CARD */}
        <View
          style={[
            styles.progressCard,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.cardBorder,
            },
          ]}
        >
          <View style={styles.progressHeader}>
            <View style={styles.progressTitleGroup}>
              <TrendingUp size={20} color={themeColors.primary} />
              <Text style={[styles.progressTitle, { color: themeColors.textPrimary }]}>
                Votre Progression globale
              </Text>
            </View>
            <Text style={[styles.percentLabel, { color: themeColors.primary }]}>
              {progressPercent}%
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={[styles.progressBarTrack, { backgroundColor: themeColors.surfaceSubtle }]}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.max(5, progressPercent)}%`, backgroundColor: themeColors.primary },
              ]}
            />
          </View>

          {/* Level Badges & Counters */}
          <View style={styles.levelRow}>
            <View style={[styles.levelStatBox, { backgroundColor: themeColors.surfaceSubtle }]}>
              <Text style={[styles.levelStatNum, { color: '#16A34A' }]}>{a1Count}</Text>
              <Text style={[styles.levelStatName, { color: themeColors.textSecondary }]}>A1 Débutant</Text>
            </View>
            <View style={[styles.levelStatBox, { backgroundColor: themeColors.surfaceSubtle }]}>
              <Text style={[styles.levelStatNum, { color: '#0284C7' }]}>{a2Count}</Text>
              <Text style={[styles.levelStatName, { color: themeColors.textSecondary }]}>A2 Élémentaire</Text>
            </View>
            <View style={[styles.levelStatBox, { backgroundColor: themeColors.surfaceSubtle }]}>
              <Text style={[styles.levelStatNum, { color: '#7E22CE' }]}>{b1Count}</Text>
              <Text style={[styles.levelStatName, { color: themeColors.textSecondary }]}>B1 Intermédiaire</Text>
            </View>
            <View style={[styles.levelStatBox, { backgroundColor: themeColors.surfaceSubtle }]}>
              <Text style={[styles.levelStatNum, { color: themeColors.accent }]}>{masteredCount}</Text>
              <Text style={[styles.levelStatName, { color: themeColors.textSecondary }]}>Maîtrisées</Text>
            </View>
          </View>
        </View>

        {/* HERO BOOK READER CARD */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => router.push('/reader')}
          style={[
            styles.bookHeroCard,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.primary,
            },
          ]}
        >
          <View style={styles.bookHeroTopRow}>
            <View style={[styles.bookBadgePill, { backgroundColor: themeColors.primaryLight }]}>
              <BookOpen size={16} color={themeColors.primary} />
              <Text style={[styles.bookBadgeText, { color: themeColors.primary }]}>
                MODE LECTURE LIVRE
              </Text>
            </View>
            <View style={[styles.streakTag, { backgroundColor: themeColors.surfaceSubtle }]}>
              <Sparkles size={13} color={themeColors.secondary} />
              <Text style={[styles.streakTagText, { color: themeColors.textSecondary }]}>
                Confort & Immersion
              </Text>
            </View>
          </View>

          <Text style={[styles.bookHeroTitle, { color: themeColors.textPrimary }]}>
            Lire les phrases comme dans un vrai livre
          </Text>
          <Text style={[styles.bookHeroDesc, { color: themeColors.textSecondary }]}>
            Tournez les pages une à une sur papier doux ou sépia, écoutez la prononciation audio et retenez le vocabulaire à votre rythme.
          </Text>

          <View style={styles.bookHeroBottomRow}>
            <View style={[styles.bookActionPill, { backgroundColor: themeColors.primary }]}>
              <Text style={styles.bookActionText}>Ouvrir le livre</Text>
              <ArrowRight size={16} color="#FFFFFF" />
            </View>
            <Text style={[styles.bookCountNote, { color: themeColors.textMuted }]}>
              {PHRASES.length} phrases disponibles
            </Text>
          </View>
        </TouchableOpacity>

        {/* QUICK NAVIGATION TILES */}
        <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
          {"Activités d'apprentissage"}
        </Text>

        <View style={[styles.grid, isTablet && styles.gridTablet]}>
          {/* Flashcards */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/flashcards')}
            style={[
              styles.tile,
              { backgroundColor: themeColors.surface, borderColor: themeColors.cardBorder },
            ]}
          >
            <View style={[styles.tileIconCircle, { backgroundColor: themeColors.primaryLight }]}>
              <Layers size={24} color={themeColors.primary} />
            </View>
            <Text style={[styles.tileTitle, { color: themeColors.textPrimary }]}>Flashcards 3D</Text>
            <Text style={[styles.tileDesc, { color: themeColors.textSecondary }]}>
              Répétition espacée & cartes interactives
            </Text>
          </TouchableOpacity>

          {/* Quiz */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/quiz')}
            style={[
              styles.tile,
              { backgroundColor: themeColors.surface, borderColor: themeColors.cardBorder },
            ]}
          >
            <View style={[styles.tileIconCircle, { backgroundColor: '#DCFCE7' }]}>
              <Award size={24} color="#16A34A" />
            </View>
            <Text style={[styles.tileTitle, { color: themeColors.textPrimary }]}>Quiz & Entraînement</Text>
            <Text style={[styles.tileDesc, { color: themeColors.textSecondary }]}>
              QCM trilingues A1, A2 et B1
            </Text>
          </TouchableOpacity>

          {/* Phrases / Explorer */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/phrases')}
            style={[
              styles.tile,
              { backgroundColor: themeColors.surface, borderColor: themeColors.cardBorder },
            ]}
          >
            <View style={[styles.tileIconCircle, { backgroundColor: '#E0F2FE' }]}>
              <BookOpen size={24} color="#0284C7" />
            </View>
            <Text style={[styles.tileTitle, { color: themeColors.textPrimary }]}>Guide des Phrases</Text>
            <Text style={[styles.tileDesc, { color: themeColors.textSecondary }]}>
              9 thèmes pratiques & audio natif
            </Text>
          </TouchableOpacity>

          {/* Favoris */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/favorites')}
            style={[
              styles.tile,
              { backgroundColor: themeColors.surface, borderColor: themeColors.cardBorder },
            ]}
          >
            <View style={[styles.tileIconCircle, { backgroundColor: '#FEE2E2' }]}>
              <Bookmark size={24} color="#E11D48" />
            </View>
            <Text style={[styles.tileTitle, { color: themeColors.textPrimary }]}>Mes Favoris</Text>
            <Text style={[styles.tileDesc, { color: themeColors.textSecondary }]}>
              {favorites.length} phrases enregistrées
            </Text>
          </TouchableOpacity>
        </View>

        {/* PHRASE DU JOUR */}
        <View style={styles.podHeader}>
          <Sparkles size={18} color="#D97706" />
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary, marginBottom: 0 }]}>
            Phrase du Jour (A1-B1)
          </Text>
        </View>

        <PhraseCard phrase={phraseOfTheDay} />

        <View style={{ height: 30 }} />
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
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appBrand: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  progressCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  percentLabel: {
    fontSize: 16,
    fontWeight: '800',
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  levelStatBox: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 12,
    alignItems: 'center',
  },
  levelStatNum: {
    fontSize: 18,
    fontWeight: '800',
  },
  levelStatName: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  gridTablet: {
    flexDirection: 'row',
  },
  tile: {
    flex: 1,
    minWidth: '47%',
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  tileIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  tileTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  tileDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  podHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  bookHeroCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  bookHeroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  bookBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bookBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  streakTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  streakTagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  bookHeroTitle: {
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 22,
    marginBottom: 6,
  },
  bookHeroDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  bookHeroBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookActionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  bookActionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  bookCountNote: {
    fontSize: 11,
    fontWeight: '600',
  },
});
