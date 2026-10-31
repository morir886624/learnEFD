import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { BookOpen, Sparkles, CheckCircle2, Award } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { useResponsive } from '../../hooks/useResponsive';
import { PHRASES } from '../../data/phrases';
import { ALL_FRENCH_VOCABULARY_ITEMS } from '../../data/frenchVocabulary';
import { ALL_VOCABULARY_ITEMS } from '../../data/vocabulary';
import { PracticeMode, ContentSource } from '../../components/practice/types';
import { PracticeModeSwitcher } from '../../components/practice/PracticeModeSwitcher';
import { PracticeContentSwitcher } from '../../components/practice/PracticeContentSwitcher';
import { PhrasesExplorerView } from '../../components/practice/PhrasesExplorerView';
import { PhrasesFlashcardsView } from '../../components/practice/PhrasesFlashcardsView';
import { PhrasesQuizView } from '../../components/practice/PhrasesQuizView';
import { FrenchVocabSection } from '../../components/practice/FrenchVocabSection';
import { EnglishVocabSection } from '../../components/practice/EnglishVocabSection';

export default function PracticeHubScreen() {
  const { mode: initialMode, source: initialSource } = useLocalSearchParams<{
    mode?: string;
    source?: string;
  }>();

  const { themeColors, stats, vocabularyProgress } = useApp();
  const { contentMaxWidth } = useResponsive();

  // Active Mode (Explorer, Flashcards, Quiz)
  const [activeMode, setActiveMode] = useState<PracticeMode>(
    initialMode === 'flashcards' || initialMode === 'quiz' ? initialMode : 'explorer'
  );

  // Active Content Source (Phrases, Vocab FR, Vocab EN)
  const [activeSource, setActiveSource] = useState<ContentSource>(
    initialSource === 'vocab-fr' || initialSource === 'vocab-en' ? initialSource : 'phrases'
  );

  // Counts
  const totalPhrases = PHRASES.length;
  const masteredPhrases = stats.masteredPhraseIds?.length || 0;

  const totalVocabFr = ALL_FRENCH_VOCABULARY_ITEMS.length;
  const masteredVocabFr = ALL_FRENCH_VOCABULARY_ITEMS.filter((item) =>
    vocabularyProgress.masteredWordIds?.includes(item.id)
  ).length;

  const totalVocabEn = ALL_VOCABULARY_ITEMS.length;
  const masteredVocabEn = ALL_VOCABULARY_ITEMS.filter((item) =>
    vocabularyProgress.masteredWordIds?.includes(item.id)
  ).length;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
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
            <View style={[styles.iconCircle, { backgroundColor: themeColors.primaryLight }]}>
              <BookOpen size={24} color={themeColors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.screenTitle, { color: themeColors.textPrimary }]}>
                Studio Pratique & Vocabulaire
              </Text>
              <Text style={[styles.screenSub, { color: themeColors.textSecondary }]}>
                Phrases • Vocabulaire FR & EN • Flashcards 3D • Quiz
              </Text>
            </View>
          </View>

          {/* QUICK STATS STRIP */}
          <View
            style={[
              styles.statsStrip,
              {
                backgroundColor: themeColors.surface,
                borderColor: themeColors.cardBorder,
              },
            ]}
          >
            <View style={styles.statItem}>
              <View style={styles.statIconRow}>
                <CheckCircle2 size={13} color={themeColors.primary} />
                <Text style={[styles.statValue, { color: themeColors.textPrimary }]}>
                  {masteredPhrases}/{totalPhrases}
                </Text>
              </View>
              <Text style={[styles.statLabel, { color: themeColors.textMuted }]}>
                Phrases
              </Text>
            </View>

            <View style={[styles.statDivider, { backgroundColor: themeColors.cardBorder }]} />

            <View style={styles.statItem}>
              <View style={styles.statIconRow}>
                <Sparkles size={13} color={themeColors.frAccent} />
                <Text style={[styles.statValue, { color: themeColors.textPrimary }]}>
                  {masteredVocabFr}/{totalVocabFr}
                </Text>
              </View>
              <Text style={[styles.statLabel, { color: themeColors.textMuted }]}>
                Vocab FR
              </Text>
            </View>

            <View style={[styles.statDivider, { backgroundColor: themeColors.cardBorder }]} />

            <View style={styles.statItem}>
              <View style={styles.statIconRow}>
                <Award size={13} color={themeColors.enAccent} />
                <Text style={[styles.statValue, { color: themeColors.textPrimary }]}>
                  {masteredVocabEn}/{totalVocabEn}
                </Text>
              </View>
              <Text style={[styles.statLabel, { color: themeColors.textMuted }]}>
                Vocab EN
              </Text>
            </View>
          </View>

          {/* PRIMARY SWITCHER: 3 MASTER PARTS (EXPLORER, FLASHCARDS, QUIZ) */}
          <PracticeModeSwitcher
            activeMode={activeMode}
            onChangeMode={setActiveMode}
          />

          {/* SECONDARY SWITCHER: 3 CONTENT SOURCES (PHRASES, VOCAB FR, VOCAB EN) */}
          <PracticeContentSwitcher
            activeSource={activeSource}
            onChangeSource={setActiveSource}
            phrasesCount={totalPhrases}
            vocabFrCount={totalVocabFr}
            vocabEnCount={totalVocabEn}
          />
        </View>

        {/* ACTIVE CONTENT VIEW */}
        {activeSource === 'phrases' && (
          <>
            {activeMode === 'explorer' && <PhrasesExplorerView />}
            {activeMode === 'flashcards' && <PhrasesFlashcardsView />}
            {activeMode === 'quiz' && <PhrasesQuizView />}
          </>
        )}

        {activeSource === 'vocab-fr' && (
          <FrenchVocabSection mode={activeMode} />
        )}

        {activeSource === 'vocab-en' && (
          <EnglishVocabSection mode={activeMode} />
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
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: {
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  screenSub: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  statsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    height: 24,
  },
});
