import React, { useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RotateCw, RotateCcw, Sparkles, Volume2, CheckCircle2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Phrase } from '../../types/phrase';
import { useApp } from '../../context/AppContext';
import { LevelBadge } from '../common/Badge';
import { SpeechService } from '../../services/speech';

interface FlipCardProps {
  phrase: Phrase;
  onMastered: () => void;
  onReview: () => void;
  promptLang?: 'fr' | 'en' | 'dari';
}

export const FlipCard: React.FC<FlipCardProps> = ({
  phrase,
  onMastered,
  onReview,
  promptLang: _promptLang = 'fr',
}) => {
  const { themeColors, settings, stats, fontSizeDelta } = useApp();
  const [isFlipped, setIsFlipped] = useState(false);
  const [animatedValue] = useState(() => new Animated.Value(0));

  const flipCard = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Ignore
    }

    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);

    Animated.spring(animatedValue, {
      toValue: nextFlipped ? 180 : 0,
      friction: 8,
      tension: 20,
      useNativeDriver: true,
    }).start();
  };

  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = animatedValue.interpolate({
    inputRange: [89, 90],
    outputRange: [1, 0],
  });

  const backOpacity = animatedValue.interpolate({
    inputRange: [89, 90],
    outputRange: [0, 1],
  });

  const playAudio = async (text: string, lang: 'fr' | 'en' | 'dari') => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Ignore
    }
    await SpeechService.speak(text, lang, settings.speechRate);
  };

  const isMastered = stats.masteredPhraseIds?.includes(phrase.id);
  const isReview = stats.reviewPhraseIds?.includes(phrase.id);

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        activeOpacity={0.96}
        onPress={flipCard}
        style={styles.touchArea}
        accessibilityRole="button"
        accessibilityLabel={
          isFlipped
            ? 'Carte flash côté réponses. Touchez pour retourner la carte.'
            : 'Carte flash côté question. Touchez pour révéler les réponses.'
        }
      >
        {/* FRONT SIDE */}
        <Animated.View
          pointerEvents={isFlipped ? 'none' : 'auto'}
          style={[
            styles.card,
            styles.cardFront,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.primary,
              transform: [{ perspective: 1000 }, { rotateY: frontInterpolate }],
              opacity: frontOpacity,
              zIndex: isFlipped ? 0 : 2,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={styles.headerLeftGroup}>
              <LevelBadge level={phrase.level} size="md" />
              {isMastered && (
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: '#DCFCE7', borderColor: '#86EFAC' },
                  ]}
                >
                  <CheckCircle2 size={12} color="#15803D" />
                  <Text style={[styles.statusBadgeText, { color: '#15803D' }]}>Maîtrisé</Text>
                </View>
              )}
              {isReview && !isMastered && (
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
                  ]}
                >
                  <RotateCcw size={12} color="#DC2626" />
                  <Text style={[styles.statusBadgeText, { color: '#DC2626' }]}>À réviser</Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={(e) => {
                e?.stopPropagation?.();
                playAudio(phrase.fr, 'fr');
              }}
              style={[styles.audioPill, { backgroundColor: themeColors.primaryLight }]}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Écouter la prononciation en français"
            >
              <Volume2 size={16} color={themeColors.primary} />
              <Text style={[styles.audioPillText, { color: themeColors.primary }]}>Écouter</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.centerContent}>
            <Text style={[styles.promptLabel, { color: themeColors.textMuted }]}>
              COMMENT DIT-ON EN ANGLAIS & DARI ?
            </Text>
            <Text
              style={[
                styles.frontTitle,
                {
                  color: themeColors.textPrimary,
                  fontSize: 22 + fontSizeDelta,
                  lineHeight: 32 + fontSizeDelta,
                },
              ]}
            >
              {phrase.fr}
            </Text>
          </View>

          <View style={styles.footerHint}>
            <RotateCw size={15} color={themeColors.textMuted} />
            <Text style={[styles.hintText, { color: themeColors.textMuted }]}>
              Touchez pour révéler les réponses
            </Text>
          </View>
        </Animated.View>

        {/* BACK SIDE */}
        <Animated.View
          pointerEvents={isFlipped ? 'auto' : 'none'}
          style={[
            styles.card,
            styles.cardBack,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.accent,
              transform: [{ perspective: 1000 }, { rotateY: backInterpolate }],
              opacity: backOpacity,
              zIndex: isFlipped ? 2 : 0,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={styles.headerLeftGroup}>
              <LevelBadge level={phrase.level} size="md" />
              {isMastered && (
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: '#DCFCE7', borderColor: '#86EFAC' },
                  ]}
                >
                  <CheckCircle2 size={12} color="#15803D" />
                  <Text style={[styles.statusBadgeText, { color: '#15803D' }]}>Maîtrisé</Text>
                </View>
              )}
              {isReview && !isMastered && (
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
                  ]}
                >
                  <RotateCcw size={12} color="#DC2626" />
                  <Text style={[styles.statusBadgeText, { color: '#DC2626' }]}>À réviser</Text>
                </View>
              )}
            </View>

            <View style={[styles.revealedBadge, { backgroundColor: themeColors.accentLight }]}>
              <Sparkles size={14} color={themeColors.accent} />
              <Text style={[styles.revealedText, { color: themeColors.accent }]}>Traductions</Text>
            </View>
          </View>

          <ScrollView
            style={styles.backScroll}
            contentContainerStyle={styles.backTranslations}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
          >
            {/* English */}
            <View style={[styles.backRow, { borderLeftColor: themeColors.enAccent }]}>
              <View style={styles.backLangTitleRow}>
                <Text style={[styles.langSub, { color: themeColors.enAccent }]}>ENGLISH</Text>
                <TouchableOpacity
                  onPress={(e) => {
                    e?.stopPropagation?.();
                    playAudio(phrase.en, 'en');
                  }}
                  style={styles.inlineAudioBtn}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel="Écouter en anglais"
                >
                  <Volume2 size={16} color={themeColors.enAccent} />
                </TouchableOpacity>
              </View>
              <Text
                style={[
                  styles.backEnglish,
                  {
                    color: themeColors.textPrimary,
                    fontSize: 16 + fontSizeDelta,
                    lineHeight: 22 + fontSizeDelta,
                  },
                ]}
              >
                {phrase.en}
              </Text>
            </View>

            {/* Dari */}
            <View
              style={[
                styles.backDariBox,
                {
                  backgroundColor: themeColors.surfaceSubtle,
                  borderColor: themeColors.dariAccent,
                },
              ]}
            >
              <View style={styles.backLangTitleRow}>
                <TouchableOpacity
                  onPress={(e) => {
                    e?.stopPropagation?.();
                    playAudio(phrase.dari, 'dari');
                  }}
                  style={styles.inlineAudioBtn}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel="Écouter en dari"
                >
                  <Volume2 size={16} color={themeColors.dariAccent} />
                </TouchableOpacity>
                <Text style={[styles.langSub, { color: themeColors.dariAccent }]}>دری • DARI</Text>
              </View>
              <Text
                style={[
                  styles.backDariScript,
                  {
                    color: themeColors.textPrimary,
                    fontSize: 20 + fontSizeDelta,
                    lineHeight: 32 + fontSizeDelta,
                  },
                ]}
              >
                {phrase.dari}
              </Text>
              {settings.showPhonetics && phrase.dariPhonetic && (
                <Text
                  style={[
                    styles.backDariPhonetic,
                    {
                      color: themeColors.dariAccent,
                      fontSize: 13 + fontSizeDelta,
                    },
                  ]}
                >
                  {phrase.dariPhonetic}
                </Text>
              )}
            </View>

            {/* Note */}
            {phrase.literalOrNote && (
              <View
                style={[
                  styles.noteBox,
                  {
                    backgroundColor: themeColors.primaryLight,
                    borderColor: themeColors.cardBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.backNote,
                    {
                      color: themeColors.textSecondary,
                      fontSize: 12 + fontSizeDelta,
                      lineHeight: 18 + fontSizeDelta,
                    },
                  ]}
                >
                  💡 {phrase.literalOrNote}
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.footerHint}>
            <RotateCw size={15} color={themeColors.textMuted} />
            <Text style={[styles.hintText, { color: themeColors.textMuted }]}>
              Touchez pour retourner la carte
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>

      {/* ACTION BUTTONS (À revoir / Maîtrisé) */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          onPress={onReview}
          activeOpacity={0.8}
          style={[
            styles.actionBtn,
            styles.actionBtnReview,
            isReview && styles.actionBtnActiveReview,
          ]}
        >
          <RotateCcw size={17} color="#DC2626" />
          <Text style={[styles.actionBtnText, { color: '#DC2626' }]}>À revoir</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onMastered}
          activeOpacity={0.8}
          style={[
            styles.actionBtn,
            styles.actionBtnMastered,
            isMastered && styles.actionBtnActiveMastered,
          ]}
        >
          <CheckCircle2 size={17} color="#16A34A" />
          <Text style={[styles.actionBtnText, { color: '#16A34A' }]}>Je connais !</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    marginVertical: 10,
  },
  touchArea: {
    width: '100%',
    height: 400,
  },
  card: {
    borderRadius: 24,
    borderWidth: 2,
    padding: 20,
    width: '100%',
    height: 400,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  cardFront: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backfaceVisibility: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  headerLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  audioPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
    flexShrink: 0,
  },
  audioPillText: {
    fontSize: 13,
    fontWeight: '700',
  },
  revealedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 16,
    gap: 5,
    flexShrink: 0,
  },
  revealedText: {
    fontSize: 12,
    fontWeight: '700',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  promptLabel: {
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 12,
    textAlign: 'center',
  },
  frontTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 32,
  },
  footerHint: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 4,
  },
  hintText: {
    fontSize: 12,
    fontWeight: '600',
  },
  backScroll: {
    flex: 1,
    marginVertical: 10,
  },
  backTranslations: {
    gap: 10,
    paddingVertical: 2,
  },
  backRow: {
    borderLeftWidth: 3.5,
    paddingLeft: 10,
  },
  backLangTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  inlineAudioBtn: {
    padding: 4,
  },
  langSub: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  backEnglish: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  backDariBox: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  backDariScript: {
    fontSize: 20,
    lineHeight: 32,
    fontWeight: '700',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  backDariPhonetic: {
    fontSize: 13,
    fontStyle: 'italic',
    fontWeight: '600',
    marginTop: 4,
  },
  noteBox: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  backNote: {
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 14,
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 13,
    borderRadius: 16,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  actionBtnReview: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  actionBtnActiveReview: {
    backgroundColor: '#FEE2E2',
    borderColor: '#F87171',
    borderWidth: 2,
  },
  actionBtnMastered: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  actionBtnActiveMastered: {
    backgroundColor: '#DCFCE7',
    borderColor: '#4ADE80',
    borderWidth: 2,
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '800',
  },
});
