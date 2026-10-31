import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  Volume2,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Bookmark,
  BookOpen,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { VocabularyItem } from '../../types/vocabulary';
import { useApp } from '../../context/AppContext';
import { SpeechService } from '../../services/speech';

interface VocabularyFlashcardViewProps {
  items: VocabularyItem[];
  accentColor?: string;
}

export const VocabularyFlashcardView: React.FC<VocabularyFlashcardViewProps> = ({
  items,
  accentColor = '#2563EB',
}) => {
  const { themeColors, isDark, vocabularyProgress, markVocabularyWord } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (items.length === 0) {
    return (
      <View style={[styles.emptyBox, { backgroundColor: themeColors.surface }]}>
        <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>
          Aucun mot dans cette sélection.
        </Text>
      </View>
    );
  }

  const currentItem = items[currentIndex] || items[0];
  const isMastered = vocabularyProgress.masteredWordIds.includes(currentItem.id);
  const isReview = vocabularyProgress.reviewWordIds.includes(currentItem.id);

  const handleFlip = () => {
    try {
      Haptics.selectionAsync();
    } catch {
      // ignore
    }
    setIsFlipped((prev) => !prev);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const speakText = (text: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore
    }
    const clean = text.replace(/\([^)]*\)/g, '').replace(/•/g, ', ');
    SpeechService.speak(clean, 'en');
  };

  const handleQuickMark = (status: 'mastered' | 'review') => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // ignore
    }
    markVocabularyWord(currentItem.id, status === 'mastered');
    if (currentIndex < items.length - 1) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress Bar & Counter */}
      <View style={styles.progressHeader}>
        <Text style={[styles.counterText, { color: themeColors.textSecondary }]}>
          Carte {currentIndex + 1} sur {items.length}
        </Text>
        <View style={styles.statusBadges}>
          {isMastered ? (
            <View style={styles.masteredTag}>
              <Text style={styles.masteredTagText}>Maîtrisé ✓</Text>
            </View>
          ) : null}
          {isReview ? (
            <View style={styles.reviewTag}>
              <Text style={styles.reviewTagText}>À réviser ★</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View
        style={[
          styles.progressTrack,
          { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' },
        ]}
      >
        <View
          style={[
            styles.progressFill,
            {
              width: `${((currentIndex + 1) / items.length) * 100}%`,
              backgroundColor: accentColor,
            },
          ]}
        />
      </View>

      {/* Interactive Flip Card */}
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={handleFlip}
        style={[
          styles.flashcard,
          {
            backgroundColor: themeColors.surface,
            borderColor: isFlipped ? accentColor : themeColors.cardBorder,
          },
        ]}
      >
        {/* Top bar of card */}
        <View style={styles.cardTopRow}>
          <View style={[styles.sideBadge, { backgroundColor: `${accentColor}15` }]}>
            <Text style={[styles.sideBadgeText, { color: accentColor }]}>
              {isFlipped ? 'VERSO • SENS & EXEMPLE' : 'RECTO • TERME ANGLAIS'}
            </Text>
          </View>
          <View style={styles.sourceRow}>
            <BookOpen size={12} color={themeColors.textMuted} />
            <Text style={[styles.sourceText, { color: themeColors.textMuted }]}>
              {currentItem.sourceRef}
            </Text>
          </View>
        </View>

        {!isFlipped ? (
          /* FRONT SIDE */
          <View style={styles.frontBody}>
            <Text style={[styles.posLabel, { color: themeColors.textMuted }]}>
              {currentItem.partOfSpeech.toUpperCase()} • NIVEAU {currentItem.level}
            </Text>
            <Text style={[styles.frontWord, { color: themeColors.textPrimary }]}>
              {currentItem.wordEn}
            </Text>
            <Text style={[styles.frontPhonetic, { color: themeColors.textSecondary }]}>
              {currentItem.phoneticEn}
            </Text>

            {currentItem.verbForms ? (
              <View
                style={[
                  styles.verbFormsPill,
                  { backgroundColor: isDark ? '#1E1B4B' : '#EDE9FE' },
                ]}
              >
                <Text style={styles.verbFormsText}>
                  {currentItem.verbForms.base} • {currentItem.verbForms.pastSimple} •{' '}
                  {currentItem.verbForms.pastParticiple}
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              onPress={() => speakText(currentItem.wordEn)}
              style={[styles.speakButton, { backgroundColor: `${accentColor}18` }]}
            >
              <Volume2 size={18} color={accentColor} />
              <Text style={[styles.speakButtonText, { color: accentColor }]}>
                Écouter la prononciation
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* BACK SIDE */
          <View style={styles.backBody}>
            <Text style={[styles.backWordSmall, { color: accentColor }]}>
              {currentItem.wordEn}
            </Text>

            <Text style={[styles.backMeaningFr, { color: themeColors.textPrimary }]}>
              🇫🇷 {currentItem.meaningFr}
            </Text>

            <Text style={[styles.backMeaningDari, { color: themeColors.textPrimary }]}>
              🇦🇫 {currentItem.meaningDari}
            </Text>

            <View
              style={[
                styles.backExampleBox,
                { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' },
              ]}
            >
              <View style={styles.backExampleHeader}>
                <Text style={[styles.backExampleTitle, { color: themeColors.textMuted }]}>
                  EXEMPLE (MURPHY / AZAR)
                </Text>
                <TouchableOpacity onPress={() => speakText(currentItem.exampleEn)}>
                  <Volume2 size={15} color={accentColor} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.backExampleEn, { color: themeColors.textPrimary }]}>
                {`"${currentItem.exampleEn}"`}
              </Text>
              <Text style={[styles.backExampleFr, { color: themeColors.textSecondary }]}>
                {currentItem.exampleFr}
              </Text>
              <Text style={[styles.backExampleDari, { color: themeColors.textMuted }]}>
                {currentItem.exampleDari}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.flipHintRow}>
          <RotateCw size={13} color={themeColors.textMuted} />
          <Text style={[styles.flipHintText, { color: themeColors.textMuted }]}>
            Touchez la carte pour retourner (Recto / Verso)
          </Text>
        </View>
      </TouchableOpacity>

      {/* Navigation & Mastery Controls */}
      <View style={styles.controlsRow}>
        <TouchableOpacity
          disabled={currentIndex === 0}
          onPress={handlePrev}
          style={[
            styles.navArrowBtn,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.cardBorder,
              opacity: currentIndex === 0 ? 0.4 : 1,
            },
          ]}
        >
          <ChevronLeft size={20} color={themeColors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleQuickMark('review')}
          style={[styles.markBtn, { backgroundColor: '#FEF9C3', borderColor: '#FDE047' }]}
        >
          <Bookmark size={15} color="#A16207" />
          <Text style={[styles.markBtnText, { color: '#A16207' }]}>À revoir</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleQuickMark('mastered')}
          style={[styles.markBtn, { backgroundColor: '#DCFCE7', borderColor: '#86EFAC' }]}
        >
          <CircleCheck size={15} color="#15803D" />
          <Text style={[styles.markBtnText, { color: '#15803D' }]}>Maîtrisé</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={currentIndex === items.length - 1}
          onPress={handleNext}
          style={[
            styles.navArrowBtn,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.cardBorder,
              opacity: currentIndex === items.length - 1 ? 0.4 : 1,
            },
          ]}
        >
          <ChevronRight size={20} color={themeColors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  emptyBox: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  counterText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  statusBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  masteredTag: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  masteredTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803D',
  },
  reviewTag: {
    backgroundColor: '#FEF9C3',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  reviewTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#A16207',
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  flashcard: {
    minHeight: 290,
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 18,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sideBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 8,
  },
  sideBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sourceText: {
    fontSize: 11,
    fontWeight: '600',
  },
  frontBody: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  posLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  frontWord: {
    fontSize: 25,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  frontPhonetic: {
    fontSize: 14,
    marginBottom: 14,
  },
  verbFormsPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 14,
  },
  verbFormsText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#6D28D9',
  },
  speakButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  speakButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  backBody: {
    paddingVertical: 12,
    gap: 8,
  },
  backWordSmall: {
    fontSize: 14,
    fontWeight: '800',
  },
  backMeaningFr: {
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
  },
  backMeaningDari: {
    fontSize: 15.5,
    fontWeight: '700',
    textAlign: 'right',
    lineHeight: 22,
  },
  backExampleBox: {
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
  },
  backExampleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  backExampleTitle: {
    fontSize: 10,
    fontWeight: '800',
  },
  backExampleEn: {
    fontSize: 13.5,
    fontWeight: '700',
    marginBottom: 3,
  },
  backExampleFr: {
    fontSize: 12.5,
    marginBottom: 3,
  },
  backExampleDari: {
    fontSize: 12.5,
    textAlign: 'right',
  },
  flipHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingTop: 8,
  },
  flipHintText: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 14,
  },
  navArrowBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  markBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
