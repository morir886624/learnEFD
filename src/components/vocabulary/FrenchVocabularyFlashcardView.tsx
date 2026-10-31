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
  TriangleAlert,
  Sparkles,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { FrenchVocabularyItem } from '../../types/frenchVocabulary';
import { useApp } from '../../context/AppContext';
import { SpeechService } from '../../services/speech';

interface FrenchVocabularyFlashcardViewProps {
  items: FrenchVocabularyItem[];
  accentColor?: string;
}

export const FrenchVocabularyFlashcardView: React.FC<FrenchVocabularyFlashcardViewProps> = ({
  items,
  accentColor = '#059669',
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

  const handleToggleStatus = (status: 'mastered' | 'review') => {
    try {
      Haptics.selectionAsync();
    } catch {
      // ignore
    }
    if (status === 'mastered') {
      markVocabularyWord(currentItem.id, true);
    } else {
      markVocabularyWord(currentItem.id, false);
    }
  };

  const speakFrench = (text: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore
    }
    const clean = text.replace(/\([^)]*\)/g, '').replace(/•/g, ', ');
    SpeechService.speak(clean, 'fr');
  };

  const progressPercent = Math.round(((currentIndex + 1) / items.length) * 100);

  return (
    <View style={styles.container}>
      {/* Top Counter Bar */}
      <View style={styles.counterRow}>
        <Text style={[styles.counterText, { color: themeColors.textSecondary }]}>
          Carte {currentIndex + 1} sur {items.length}
        </Text>
        <Text style={[styles.percentText, { color: accentColor }]}>{progressPercent}%</Text>
      </View>

      {/* Progress Track */}
      <View style={[styles.progressBarTrack, { backgroundColor: themeColors.surfaceSubtle }]}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${progressPercent}%`, backgroundColor: accentColor },
          ]}
        />
      </View>

      {/* Flashcard Body */}
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={handleFlip}
        style={[
          styles.cardBody,
          {
            backgroundColor: themeColors.surface,
            borderColor: isMastered
              ? '#86EFAC'
              : isReview
                ? '#FDE047'
                : themeColors.cardBorder,
          },
        ]}
      >
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.badgesGroup}>
            <View
              style={[
                styles.levelBadge,
                { backgroundColor: `${accentColor}18` },
              ]}
            >
              <Text style={[styles.levelText, { color: accentColor }]}>
                {currentItem.level}
              </Text>
            </View>
            <View
              style={[
                styles.posBadge,
                { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' },
              ]}
            >
              <Text style={[styles.posText, { color: themeColors.textSecondary }]}>
                {currentItem.partOfSpeech}
              </Text>
            </View>
            {currentItem.gender && (
              <View
                style={[
                  styles.genderBadge,
                  {
                    backgroundColor:
                      currentItem.gender === 'féminin' ? '#FCE7F3' : '#E0F2FE',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.genderText,
                    {
                      color:
                        currentItem.gender === 'féminin' ? '#BE185D' : '#0284C7',
                    },
                  ]}
                >
                  {currentItem.gender.toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.flipHintPill}>
            <RotateCw size={13} color={themeColors.textMuted} />
            <Text style={[styles.flipHintText, { color: themeColors.textMuted }]}>
              {isFlipped ? 'Voir le mot' : 'Voir la traduction'}
            </Text>
          </View>
        </View>

        {/* Card Front: French Word + Audio */}
        {!isFlipped ? (
          <View style={styles.frontContent}>
            <Text style={[styles.mainWordFr, { color: themeColors.textPrimary }]}>
              {currentItem.wordFr}
            </Text>
            {currentItem.phonetic && (
              <Text style={[styles.phoneticFront, { color: themeColors.textMuted }]}>
                [{currentItem.phonetic}]
              </Text>
            )}

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={(e) => {
                e.stopPropagation();
                speakFrench(currentItem.wordFr);
              }}
              style={[styles.listenBtn, { backgroundColor: accentColor }]}
            >
              <Volume2 size={18} color="#FFFFFF" />
              <Text style={styles.listenBtnText}>Prononciation française</Text>
            </TouchableOpacity>

            <Text style={[styles.tapToRevealText, { color: themeColors.textMuted }]}>
              Touchez la carte pour révéler le sens en anglais et en dari ↷
            </Text>
          </View>
        ) : (
          /* Card Back: Meanings, Dari, Example, Tip */
          <View style={styles.backContent}>
            <View style={styles.backMeanings}>
              <Text style={[styles.backMeaningEn, { color: themeColors.textPrimary }]}>
                🇬🇧 {currentItem.meaningEn}
              </Text>
              <Text style={[styles.backMeaningDari, { color: themeColors.textPrimary }]}>
                {currentItem.meaningDari}
              </Text>
              {currentItem.dariPhonetic && (
                <Text style={[styles.backDariPhonetic, { color: themeColors.textMuted }]}>
                  ({currentItem.dariPhonetic})
                </Text>
              )}
            </View>

            {/* Example Box with Audio */}
            <View
              style={[
                styles.backExampleBox,
                {
                  backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                  borderColor: themeColors.cardBorder,
                },
              ]}
            >
              <View style={styles.backExampleTop}>
                <Text style={[styles.backExampleLabel, { color: accentColor }]}>
                  Exemple :
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={(e) => {
                    e.stopPropagation();
                    speakFrench(currentItem.exampleFr);
                  }}
                  style={styles.backExampleAudio}
                >
                  <Volume2 size={13} color={accentColor} />
                  <Text style={[styles.backExampleAudioText, { color: accentColor }]}>
                    Écouter
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.backExampleFr, { color: themeColors.textPrimary }]}>
                {`"${currentItem.exampleFr}"`}
              </Text>
              <Text style={[styles.backExampleEn, { color: themeColors.textSecondary }]}>
                🇬🇧 {currentItem.exampleEn}
              </Text>
            </View>

            {currentItem.falseFriendWarning && (
              <View style={styles.backFalseFriend}>
                <TriangleAlert size={13} color="#DC2626" />
                <Text style={styles.backFalseFriendText}>
                  Faux ami : &quot;{currentItem.falseFriendWarning.englishLookalike}&quot; = {currentItem.falseFriendWarning.trueMeaningEn}
                </Text>
              </View>
            )}

            {currentItem.usageTipFr && (
              <View style={styles.backTip}>
                <Sparkles size={12} color={accentColor} />
                <Text style={[styles.backTipText, { color: themeColors.textSecondary }]}>
                  {currentItem.usageTipFr}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Card Footer Tag */}
        <View style={styles.cardFooter}>
          <BookOpen size={11} color={themeColors.textMuted} />
          <Text style={[styles.sourceText, { color: themeColors.textMuted }]}>
            {currentItem.sourceRef}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Action Buttons: Mark Mastered / Review */}
      <View style={styles.markActionsRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleToggleStatus('review')}
          style={[
            styles.markBtn,
            {
              backgroundColor: isReview ? '#FEF08A' : themeColors.surface,
              borderColor: isReview ? '#EAB308' : themeColors.cardBorder,
            },
          ]}
        >
          <Bookmark
            size={16}
            color={isReview ? '#A16207' : themeColors.textSecondary}
            fill={isReview ? '#A16207' : 'transparent'}
          />
          <Text
            style={[
              styles.markBtnText,
              { color: isReview ? '#A16207' : themeColors.textSecondary },
            ]}
          >
            {isReview ? 'À réviser (marqué)' : 'Marquer pour révision'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleToggleStatus('mastered')}
          style={[
            styles.markBtn,
            {
              backgroundColor: isMastered ? '#DCFCE7' : themeColors.surface,
              borderColor: isMastered ? '#16A34A' : themeColors.cardBorder,
            },
          ]}
        >
          <CircleCheck
            size={16}
            color={isMastered ? '#16A34A' : themeColors.textSecondary}
            fill={isMastered ? '#16A34A' : 'transparent'}
          />
          <Text
            style={[
              styles.markBtnText,
              { color: isMastered ? '#16A34A' : themeColors.textSecondary },
            ]}
          >
            {isMastered ? 'Maîtrisé (appris)' : 'Marquer comme appris'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Navigation Buttons: Prev / Next */}
      <View style={styles.navRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={currentIndex === 0}
          onPress={handlePrev}
          style={[
            styles.navBtn,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.cardBorder,
              opacity: currentIndex === 0 ? 0.35 : 1,
            },
          ]}
        >
          <ChevronLeft size={20} color={themeColors.textPrimary} />
          <Text style={[styles.navBtnText, { color: themeColors.textPrimary }]}>Précédent</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          disabled={currentIndex === items.length - 1}
          onPress={handleNext}
          style={[
            styles.navBtn,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.cardBorder,
              opacity: currentIndex === items.length - 1 ? 0.35 : 1,
            },
          ]}
        >
          <Text style={[styles.navBtnText, { color: themeColors.textPrimary }]}>Suivant</Text>
          <ChevronRight size={20} color={themeColors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  counterText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  percentText: {
    fontSize: 13,
    fontWeight: '800',
  },
  progressBarTrack: {
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  cardBody: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 20,
    minHeight: 290,
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgesGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  levelText: {
    fontSize: 11,
    fontWeight: '800',
  },
  posBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  posText: {
    fontSize: 11,
    fontWeight: '600',
  },
  genderBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  genderText: {
    fontSize: 10,
    fontWeight: '800',
  },
  flipHintPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  flipHintText: {
    fontSize: 11,
    fontWeight: '600',
  },
  frontContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 10,
  },
  mainWordFr: {
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  phoneticFront: {
    fontSize: 14,
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  listenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  listenBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  tapToRevealText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  backContent: {
    paddingVertical: 8,
    gap: 10,
  },
  backMeanings: {
    gap: 4,
    marginBottom: 4,
  },
  backMeaningEn: {
    fontSize: 18,
    fontWeight: '800',
  },
  backMeaningDari: {
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'right',
  },
  backDariPhonetic: {
    fontSize: 12,
    textAlign: 'right',
    fontStyle: 'italic',
  },
  backExampleBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
  },
  backExampleTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  backExampleLabel: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  backExampleAudio: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backExampleAudioText: {
    fontSize: 11,
    fontWeight: '700',
  },
  backExampleFr: {
    fontSize: 13.5,
    fontWeight: '700',
    fontStyle: 'italic',
    lineHeight: 18,
    marginBottom: 2,
  },
  backExampleEn: {
    fontSize: 12.5,
    lineHeight: 17,
  },
  backFalseFriend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
  },
  backFalseFriendText: {
    fontSize: 11.5,
    color: '#991B1B',
    flex: 1,
  },
  backTip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backTipText: {
    fontSize: 12,
    fontStyle: 'italic',
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
  },
  sourceText: {
    fontSize: 10.5,
  },
  markActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  markBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  markBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  navBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  navBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  emptyBox: {
    padding: 30,
    borderRadius: 14,
    alignItems: 'center',
    marginVertical: 16,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
