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
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  CheckCircle2,
  BookOpen,
  Sparkles,
  Sun,
  Moon,
  Leaf,
  Info,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useApp } from '../../context/AppContext';
import { useResponsive } from '../../hooks/useResponsive';
import { PHRASES } from '../../data/phrases';
import { CATEGORIES } from '../../data/categories';
import { LevelBadge } from '../../components/common/Badge';
import { AudioButton } from '../../components/phrases/AudioButton';
import { ThemeMode } from '../../theme/colors';

export default function BookReaderScreen() {
  const {
    themeColors,
    themeMode,
    setThemeMode,
    fontSizeDelta,
    setFontSizeDelta,
    favorites,
    toggleFavorite,
    stats,
    markPhrase,
    settings,
  } = useApp();

  const { contentMaxWidth } = useResponsive();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredPhrases = selectedCategory === 'all'
    ? PHRASES
    : PHRASES.filter((p) => p.category === selectedCategory);

  const total = filteredPhrases.length;
  const currentPhrase = filteredPhrases[Math.min(currentIndex, Math.max(0, total - 1))];

  const isFav = currentPhrase ? favorites.includes(currentPhrase.id) : false;
  const isMastered = currentPhrase ? stats.masteredPhraseIds.includes(currentPhrase.id) : false;

  const currentCategoryInfo = currentPhrase
    ? CATEGORIES.find((c) => c.id === currentPhrase.category)
    : null;

  const handlePrev = () => {
    if (currentIndex > 0) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // Ignore
      }
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // Ignore
      }
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleToggleFav = async () => {
    if (!currentPhrase) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Ignore
    }
    await toggleFavorite(currentPhrase.id);
  };

  const handleToggleMastered = async () => {
    if (!currentPhrase) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Ignore
    }
    await markPhrase(currentPhrase.id, !isMastered);
  };

  const handleThemeSwitch = async (mode: ThemeMode) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Ignore
    }
    await setThemeMode(mode);
  };

  const handleFontDecrease = async () => {
    const next = Math.max(-2, fontSizeDelta - 2);
    await setFontSizeDelta(next);
  };

  const handleFontIncrease = async () => {
    const next = Math.min(6, fontSizeDelta + 2);
    await setFontSizeDelta(next);
  };

  if (!currentPhrase) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: themeColors.textPrimary }]}>
            Aucune phrase disponible dans cette catégorie.
          </Text>
          <TouchableOpacity
            onPress={() => setSelectedCategory('all')}
            style={[styles.resetBtn, { backgroundColor: themeColors.primary }]}
          >
            <Text style={{ color: '#FFF', fontWeight: '700' }}>Toutes les catégories</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const progressPct = total > 0 ? Math.round(((currentIndex + 1) / total) * 100) : 0;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      {/* TOP READER TOOLBAR */}
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
          onPress={() => router.back()}
          style={styles.iconBtn}
          accessibilityLabel="Retour"
        >
          <ArrowLeft size={22} color={themeColors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.pageIndicator}>
          <Text style={[styles.pageNumber, { color: themeColors.textPrimary }]}>
            Page {currentIndex + 1}
            <Text style={[styles.pageTotal, { color: themeColors.textMuted }]}> / {total}</Text>
          </Text>
          <Text style={[styles.progressPctText, { color: themeColors.primary }]}>
            {progressPct}% lu
          </Text>
        </View>

        {/* Quick Theme Switcher Pills */}
        <View style={[styles.themePillsGroup, { backgroundColor: themeColors.surfaceSubtle }]}>
          <TouchableOpacity
            onPress={() => handleThemeSwitch('book')}
            style={[styles.themeMiniPill, themeMode === 'book' && styles.themeMiniPillActive]}
            accessibilityLabel="Thème Livre Papier"
          >
            <BookOpen size={15} color={themeMode === 'book' ? '#8D4A19' : themeColors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleThemeSwitch('light')}
            style={[styles.themeMiniPill, themeMode === 'light' && styles.themeMiniPillActive]}
            accessibilityLabel="Thème Moderne Lumineux"
          >
            <Sun size={15} color={themeMode === 'light' ? '#4F46E5' : themeColors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleThemeSwitch('sage')}
            style={[styles.themeMiniPill, themeMode === 'sage' && styles.themeMiniPillActive]}
            accessibilityLabel="Thème Forêt Sérénité"
          >
            <Leaf size={15} color={themeMode === 'sage' ? '#1B6A45' : themeColors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleThemeSwitch('dark')}
            style={[styles.themeMiniPill, themeMode === 'dark' && styles.themeMiniPillActive]}
            accessibilityLabel="Thème Nuit Profonde"
          >
            <Moon size={15} color={themeMode === 'dark' ? '#6366F1' : themeColors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Font Size Adjusters */}
        <View style={[styles.fontGroup, { backgroundColor: themeColors.surfaceSubtle }]}>
          <TouchableOpacity
            onPress={handleFontDecrease}
            style={styles.fontBtn}
            accessibilityLabel="Diminuer la taille du texte"
          >
            <Text style={[styles.fontBtnText, { color: themeColors.textPrimary, fontSize: 13 }]}>A-</Text>
          </TouchableOpacity>
          <View style={[styles.fontDivider, { backgroundColor: themeColors.cardBorder }]} />
          <TouchableOpacity
            onPress={handleFontIncrease}
            style={styles.fontBtn}
            accessibilityLabel="Augmenter la taille du texte"
          >
            <Text style={[styles.fontBtnText, { color: themeColors.textPrimary, fontSize: 16, fontWeight: '800' }]}>A+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* READING PROGRESS STRIP */}
      <View style={[styles.progressTrack, { backgroundColor: themeColors.surfaceSubtle }]}>
        <View
          style={[
            styles.progressFill,
            { width: `${progressPct}%`, backgroundColor: themeColors.primary },
          ]}
        />
      </View>

      {/* MAIN BOOK PAGE CONTAINER */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollBody,
          { maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* BOOK PAGE SHEET */}
        <View
          style={[
            styles.bookPage,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.cardBorder,
              shadowColor: themeColors.textPrimary,
            },
          ]}
        >
          {/* Top Page Header (Category & Ribbon) */}
          <View style={styles.bookHeaderRow}>
            <View style={styles.chapterBadgeContainer}>
              <LevelBadge level={currentPhrase.level} />
              {currentCategoryInfo && (
                <View
                  style={[
                    styles.categoryPill,
                    { backgroundColor: themeColors.surfaceSubtle, borderColor: themeColors.cardBorder },
                  ]}
                >
                  <Text style={[styles.categoryPillText, { color: themeColors.textSecondary }]}>
                    {currentCategoryInfo.labelFr}
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={handleToggleFav}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={styles.favBtn}
            >
              <Bookmark
                size={24}
                color={isFav ? '#E11D48' : themeColors.textMuted}
                fill={isFav ? '#E11D48' : 'transparent'}
              />
            </TouchableOpacity>
          </View>

          {/* Book Watermark / Chapter line */}
          <View style={[styles.bookOrnamentLine, { backgroundColor: themeColors.cardBorder }]}>
            <View style={[styles.ornamentDiamond, { backgroundColor: themeColors.primary }]} />
          </View>

          {/* SECTION 1: FRANÇAIS */}
          <View style={styles.languageSection}>
            <View style={styles.sectionTitleRow}>
              <View style={[styles.langTag, { backgroundColor: themeColors.frLight }]}>
                <Text style={[styles.langTagText, { color: themeColors.frAccent }]}>FRANÇAIS</Text>
              </View>
              <AudioButton text={currentPhrase.fr} lang="fr" size={18} color={themeColors.frAccent} />
            </View>
            <Text
              style={[
                styles.literaryFrText,
                {
                  color: themeColors.textPrimary,
                  fontSize: 20 + fontSizeDelta,
                  lineHeight: 30 + fontSizeDelta,
                },
              ]}
            >
              « {currentPhrase.fr} »
            </Text>
          </View>

          {/* SECTION 2: ENGLISH */}
          <View style={styles.languageSection}>
            <View style={styles.sectionTitleRow}>
              <View style={[styles.langTag, { backgroundColor: themeColors.enLight }]}>
                <Text style={[styles.langTagText, { color: themeColors.enAccent }]}>ENGLISH</Text>
              </View>
              <AudioButton text={currentPhrase.en} lang="en" size={18} color={themeColors.enAccent} />
            </View>
            <Text
              style={[
                styles.literaryEnText,
                {
                  color: themeColors.textSecondary,
                  fontSize: 17 + fontSizeDelta,
                  lineHeight: 26 + fontSizeDelta,
                },
              ]}
            >
              “{currentPhrase.en}”
            </Text>
          </View>

          {/* SECTION 3: DARI (دری) */}
          <View
            style={[
              styles.dariPageBlock,
              {
                backgroundColor: themeColors.surfaceSubtle,
                borderColor: themeColors.dariAccent,
              },
            ]}
          >
            <View style={styles.dariTopBar}>
              <AudioButton text={currentPhrase.dari} lang="dari" size={18} color={themeColors.dariAccent} />
              <View style={[styles.langTag, { backgroundColor: themeColors.dariLight }]}>
                <Text style={[styles.langTagText, { color: themeColors.dariAccent }]}>دری • DARI</Text>
              </View>
            </View>

            {/* Dari Perso-Arabic Script */}
            <Text
              style={[
                styles.dariScript,
                {
                  color: themeColors.textPrimary,
                  fontSize: 24 + fontSizeDelta,
                  lineHeight: 40 + fontSizeDelta,
                },
              ]}
            >
              {currentPhrase.dari}
            </Text>

            {/* Dari Phonetic Pronunciation */}
            {settings.showPhonetics && currentPhrase.dariPhonetic && (
              <View style={styles.phoneticBox}>
                <Text style={[styles.phoneticLabel, { color: themeColors.textMuted }]}>
                  Prononciation phonétique :
                </Text>
                <Text
                  style={[
                    styles.phoneticValue,
                    {
                      color: themeColors.dariAccent,
                      fontSize: 15 + fontSizeDelta,
                    },
                  ]}
                >
                  {currentPhrase.dariPhonetic}
                </Text>
              </View>
            )}
          </View>

          {/* Contextual Linguistic Note */}
          {currentPhrase.literalOrNote && (
            <View
              style={[
                styles.noteBox,
                {
                  backgroundColor: themeColors.surfaceSubtle,
                  borderColor: themeColors.cardBorder,
                },
              ]}
            >
              <Info size={16} color={themeColors.primary} style={{ marginTop: 2, marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.noteHeading, { color: themeColors.primary }]}>
                  {"Note & Contexte d'usage"}
                </Text>
                <Text
                  style={[
                    styles.noteBody,
                    {
                      color: themeColors.textSecondary,
                      fontSize: 13 + fontSizeDelta,
                    },
                  ]}
                >
                  {currentPhrase.literalOrNote}
                </Text>
              </View>
            </View>
          )}

          {/* Retention / Mastery Action */}
          <TouchableOpacity
            onPress={handleToggleMastered}
            activeOpacity={0.8}
            style={[
              styles.masteryBtn,
              {
                backgroundColor: isMastered ? themeColors.accentLight : themeColors.surfaceSubtle,
                borderColor: isMastered ? themeColors.accent : themeColors.cardBorder,
              },
            ]}
          >
            <CheckCircle2
              size={20}
              color={isMastered ? themeColors.accent : themeColors.textMuted}
            />
            <Text
              style={[
                styles.masteryBtnText,
                { color: isMastered ? themeColors.accent : themeColors.textPrimary },
              ]}
            >
              {isMastered ? '✓ Phrase retenue & maîtrisée' : 'Marquer comme comprise & retenue'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* READING MOTIVATION CARD */}
        <View
          style={[
            styles.motivationCard,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.cardBorder,
            },
          ]}
        >
          <Sparkles size={20} color={themeColors.secondary} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.motivationTitle, { color: themeColors.textPrimary }]}>
              Session de lecture active
            </Text>
            <Text style={[styles.motivationText, { color: themeColors.textSecondary }]}>
              {stats.masteredPhraseIds.length} phrases maîtrisées sur {PHRASES.length} au total. Prenez le temps de prononcer chaque phrase à voix haute !
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM BOOK NAVIGATION BAR */}
      <View
        style={[
          styles.bottomNav,
          {
            backgroundColor: themeColors.surface,
            borderTopColor: themeColors.cardBorder,
          },
        ]}
      >
        <TouchableOpacity
          onPress={handlePrev}
          disabled={currentIndex === 0}
          style={[
            styles.navBtn,
            {
              backgroundColor: currentIndex === 0 ? themeColors.surfaceSubtle : themeColors.surface,
              borderColor: themeColors.cardBorder,
              opacity: currentIndex === 0 ? 0.4 : 1,
            },
          ]}
        >
          <ChevronLeft size={22} color={themeColors.textPrimary} />
          <Text style={[styles.navBtnText, { color: themeColors.textPrimary }]}>Précédente</Text>
        </TouchableOpacity>

        <View style={styles.navPagePill}>
          <Text style={[styles.navPillText, { color: themeColors.textSecondary }]}>
            {currentIndex + 1} / {total}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleNext}
          disabled={currentIndex === total - 1}
          style={[
            styles.navBtn,
            styles.navBtnPrimary,
            {
              backgroundColor: currentIndex === total - 1 ? themeColors.surfaceSubtle : themeColors.primary,
              borderColor: currentIndex === total - 1 ? themeColors.cardBorder : themeColors.primary,
              opacity: currentIndex === total - 1 ? 0.4 : 1,
            },
          ]}
        >
          <Text
            style={[
              styles.navBtnText,
              { color: currentIndex === total - 1 ? themeColors.textMuted : '#FFFFFF' },
            ]}
          >
            Suivante
          </Text>
          <ChevronRight
            size={22}
            color={currentIndex === total - 1 ? themeColors.textMuted : '#FFFFFF'}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 8,
  },
  iconBtn: {
    padding: 6,
    borderRadius: 8,
  },
  pageIndicator: {
    alignItems: 'center',
  },
  pageNumber: {
    fontSize: 14,
    fontWeight: '800',
  },
  pageTotal: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressPctText: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 1,
  },
  themePillsGroup: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 3,
    gap: 4,
  },
  themeMiniPill: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeMiniPillActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  fontGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  fontBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  fontBtnText: {
    fontWeight: '700',
  },
  fontDivider: {
    width: 1,
    height: 14,
    marginHorizontal: 2,
  },
  progressTrack: {
    height: 3,
    width: '100%',
  },
  progressFill: {
    height: '100%',
  },
  scrollBody: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  bookPage: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  bookHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  chapterBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  favBtn: {
    padding: 4,
  },
  bookOrnamentLine: {
    height: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  ornamentDiamond: {
    width: 8,
    height: 8,
    transform: [{ rotate: '45deg' }],
  },
  languageSection: {
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  langTag: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  langTagText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  literaryFrText: {
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  literaryEnText: {
    fontWeight: '500',
    fontStyle: 'italic',
  },
  dariPageBlock: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  dariTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dariScript: {
    fontWeight: '700',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  phoneticBox: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
  phoneticLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  phoneticValue: {
    fontWeight: '700',
    fontStyle: 'italic',
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
  },
  noteHeading: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  noteBody: {
    lineHeight: 18,
  },
  masteryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  masteryBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  motivationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginTop: 16,
  },
  motivationTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  motivationText: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  navBtnPrimary: {},
  navBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  navPagePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  navPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  resetBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
});

