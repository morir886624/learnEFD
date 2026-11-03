import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RotateCcw, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useApp } from '../../context/AppContext';
import { PHRASES } from '../../data/phrases';
import { Level } from '../../types/phrase';
import { FlipCard } from '../phrases/FlipCard';

export const PhrasesFlashcardsView: React.FC = () => {
  const { themeColors, markPhrase } = useApp();

  const [selectedLevel, setSelectedLevel] = useState<Level | 'ALL'>('ALL');
  const [currentIndex, setCurrentIndex] = useState(0);

  const deck = useMemo(() => {
    return PHRASES.filter((p) => selectedLevel === 'ALL' || p.level === selectedLevel);
  }, [selectedLevel]);

  const currentPhrase = deck[currentIndex];

  const handleNext = () => {
    if (currentIndex < deck.length) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleMastered = async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Ignore
    }
    if (currentPhrase) {
      await markPhrase(currentPhrase.id, true);
    }
    handleNext();
  };

  const handleReview = async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch {
      // Ignore
    }
    if (currentPhrase) {
      await markPhrase(currentPhrase.id, false);
    }
    handleNext();
  };

  const restartDeck = () => {
    setCurrentIndex(0);
  };

  const isCompleted = deck.length > 0 && currentIndex >= deck.length;

  return (
    <View style={styles.container}>
      {/* LEVEL CHIPS */}
      <View style={styles.filterRow}>
        {(['ALL', 'A1', 'A2', 'B1', 'B2'] as const).map((lvl) => {
          const isSelected = selectedLevel === lvl;
          return (
            <TouchableOpacity
              key={lvl}
              activeOpacity={0.8}
              onPress={() => {
                setSelectedLevel(lvl);
                setCurrentIndex(0);
              }}
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
      </View>

      {/* PROGRESS TRACKER */}
      {deck.length > 0 && (
        <View style={styles.progressContainer}>
          <Text style={[styles.progressText, { color: themeColors.textSecondary }]}>
            Carte <Text style={{ fontWeight: '800', color: themeColors.textPrimary }}>{Math.min(currentIndex + 1, deck.length)}</Text> sur {deck.length}
          </Text>
          <View style={[styles.progressTrack, { backgroundColor: themeColors.surfaceSubtle }]}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(Math.min(currentIndex + 1, deck.length) / deck.length) * 100}%`,
                  backgroundColor: themeColors.primary,
                },
              ]}
            />
          </View>
        </View>
      )}

      {/* FLASHCARD OR FINISHED SCREEN */}
      {deck.length === 0 ? (
        <View style={[styles.completedCard, { backgroundColor: themeColors.surface, borderColor: themeColors.cardBorder }]}>
          <Text style={[styles.completedTitle, { color: themeColors.textPrimary }]}>
            Aucune phrase
          </Text>
          <Text style={[styles.completedSub, { color: themeColors.textSecondary }]}>
            Aucune phrase trouvée pour ce niveau de sélection.
          </Text>
        </View>
      ) : isCompleted ? (
        <View style={[styles.completedCard, { backgroundColor: themeColors.surface, borderColor: themeColors.cardBorder }]}>
          <CheckCircle size={48} color="#16A34A" />
          <Text style={[styles.completedTitle, { color: themeColors.textPrimary }]}>
            Félicitations !
          </Text>
          <Text style={[styles.completedSub, { color: themeColors.textSecondary }]}>
            Vous avez révisé toutes les cartes de cette sélection.
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={restartDeck}
            style={[styles.restartBtn, { backgroundColor: themeColors.primary }]}
          >
            <RotateCcw size={16} color="#FFFFFF" />
            <Text style={styles.restartBtnText}>Recommencer la pile</Text>
          </TouchableOpacity>
        </View>
      ) : (
        currentPhrase && (
          <View style={styles.cardWrapper}>
            <FlipCard
              key={currentPhrase.id}
              phrase={currentPhrase}
              onMastered={handleMastered}
              onReview={handleReview}
            />

            {/* PREV / NEXT NAVIGATION CONTROLS */}
            <View style={styles.navControls}>
              <TouchableOpacity
                disabled={currentIndex === 0}
                onPress={handlePrev}
                activeOpacity={0.75}
                style={[
                  styles.navBtn,
                  {
                    backgroundColor: themeColors.surface,
                    borderColor: themeColors.cardBorder,
                    opacity: currentIndex === 0 ? 0.35 : 1,
                  },
                ]}
              >
                <ChevronLeft size={18} color={themeColors.textPrimary} />
                <Text style={[styles.navBtnText, { color: themeColors.textPrimary }]}>Précédente</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleNext}
                activeOpacity={0.75}
                style={[
                  styles.navBtn,
                  {
                    backgroundColor: themeColors.surface,
                    borderColor: themeColors.cardBorder,
                  },
                ]}
              >
                <Text style={[styles.navBtnText, { color: themeColors.textPrimary }]}>
                  {currentIndex >= deck.length - 1 ? 'Terminer' : 'Suivante'}
                </Text>
                <ChevronRight size={18} color={themeColors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
    width: '100%',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    maxWidth: 440,
    alignSelf: 'center',
    width: '100%',
  },
  levelChip: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  levelChipText: {
    fontSize: 12.5,
  },
  progressContainer: {
    marginBottom: 12,
    maxWidth: 440,
    alignSelf: 'center',
    width: '100%',
  },
  progressText: {
    fontSize: 12.5,
    marginBottom: 6,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  cardWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  navControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 440,
    marginTop: 8,
    gap: 12,
  },
  navBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  navBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  completedCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    maxWidth: 440,
    alignSelf: 'center',
    width: '100%',
  },
  completedTitle: {
    fontSize: 21,
    fontWeight: '900',
    marginTop: 14,
    marginBottom: 6,
  },
  completedSub: {
    fontSize: 13.5,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  restartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 14,
  },
  restartBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
