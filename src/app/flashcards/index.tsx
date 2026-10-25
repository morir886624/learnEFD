import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RotateCcw, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useApp } from '../../context/AppContext';
import { useResponsive } from '../../hooks/useResponsive';
import { PHRASES } from '../../data/phrases';
import { Level } from '../../types/phrase';
import { FlipCard } from '../../components/phrases/FlipCard';

export default function FlashcardsScreen() {
  const { themeColors, markPhrase } = useApp();
  const { contentMaxWidth } = useResponsive();

  const [selectedLevel, setSelectedLevel] = useState<Level | 'ALL'>('ALL');
  const [currentIndex, setCurrentIndex] = useState(0);

  const deck = useMemo(() => {
    return PHRASES.filter((p) => selectedLevel === 'ALL' || p.level === selectedLevel);
  }, [selectedLevel]);

  const currentPhrase = deck[currentIndex] || deck[0];

  const handleNext = () => {
    if (currentIndex < deck.length - 1) {
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

  const isCompleted = currentIndex >= deck.length;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.container, { maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' }]}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: themeColors.textPrimary }]}>
            Flashcards & Répétition Espacée
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            Testez votre mémoire active avant de retourner la carte
          </Text>
        </View>

        {/* LEVEL CHIPS */}
        <View style={styles.filterRow}>
          {(['ALL', 'A1', 'A2', 'B1'] as const).map((lvl) => {
            const isSelected = selectedLevel === lvl;
            return (
              <TouchableOpacity
                key={lvl}
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
                    { color: isSelected ? '#FFFFFF' : themeColors.textSecondary },
                  ]}
                >
                  {lvl === 'ALL' ? 'Tous' : `Niveau ${lvl}`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* PROGRESS INDICATOR */}
        <View style={styles.statusRow}>
          <Text style={[styles.counterText, { color: themeColors.textMuted }]}>
            Carte {Math.min(currentIndex + 1, deck.length)} sur {deck.length}
          </Text>
          <View style={styles.navRow}>
            <TouchableOpacity
              onPress={handlePrev}
              disabled={currentIndex === 0}
              style={[
                styles.navBtn,
                { opacity: currentIndex === 0 ? 0.3 : 1, borderColor: themeColors.cardBorder },
              ]}
            >
              <ChevronLeft size={20} color={themeColors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleNext}
              disabled={currentIndex >= deck.length - 1}
              style={[
                styles.navBtn,
                { opacity: currentIndex >= deck.length - 1 ? 0.3 : 1, borderColor: themeColors.cardBorder },
              ]}
            >
              <ChevronRight size={20} color={themeColors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* CARD OR FINISH SCREEN */}
        {isCompleted ? (
          <View
            style={[
              styles.finishBox,
              { backgroundColor: themeColors.surface, borderColor: themeColors.cardBorder },
            ]}
          >
            <CheckCircle size={56} color="#16A34A" />
            <Text style={[styles.finishTitle, { color: themeColors.textPrimary }]}>
              Session terminée ! Bravo !
            </Text>
            <Text style={[styles.finishSubtitle, { color: themeColors.textSecondary }]}>
              Vous avez passé en revue toutes les phrases de ce niveau.
            </Text>
            <TouchableOpacity
              onPress={restartDeck}
              style={[styles.restartBtn, { backgroundColor: themeColors.primary }]}
            >
              <RotateCcw size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.restartBtnText}>Recommencer la session</Text>
            </TouchableOpacity>
          </View>
        ) : (
          currentPhrase && (
            <FlipCard
              key={`${currentPhrase.id}-${currentIndex}`}
              phrase={currentPhrase}
              onMastered={handleMastered}
              onReview={handleReview}
            />
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 12,
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
    marginBottom: 14,
  },
  levelChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  levelChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  counterText: {
    fontSize: 14,
    fontWeight: '700',
  },
  navRow: {
    flexDirection: 'row',
    gap: 8,
  },
  navBtn: {
    padding: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  finishBox: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  finishTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 16,
    textAlign: 'center',
  },
  finishSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 20,
  },
  restartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  restartBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
