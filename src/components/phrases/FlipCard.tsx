import React, { useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RotateCw, Sparkles, Volume2 } from 'lucide-react-native';
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
  const { themeColors, settings } = useApp();
  const [isFlipped, setIsFlipped] = useState(false);
  const [animatedValue] = useState(() => new Animated.Value(0));

  const flipCard = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Ignore
    }

    if (isFlipped) {
      Animated.spring(animatedValue, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
      setIsFlipped(false);
    } else {
      Animated.spring(animatedValue, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
      setIsFlipped(true);
    }
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

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity activeOpacity={0.95} onPress={flipCard} style={styles.touchArea}>
        {/* FRONT SIDE */}
        <Animated.View
          style={[
            styles.card,
            styles.cardFront,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.primary,
              transform: [{ rotateY: frontInterpolate }],
              opacity: frontOpacity,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <LevelBadge level={phrase.level} size="md" />
            <TouchableOpacity
              onPress={() => playAudio(phrase.fr, 'fr')}
              style={[styles.audioPill, { backgroundColor: themeColors.primaryLight }]}
            >
              <Volume2 size={18} color={themeColors.primary} />
              <Text style={[styles.audioPillText, { color: themeColors.primary }]}>Écouter</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.centerContent}>
            <Text style={[styles.promptLabel, { color: themeColors.textMuted }]}>
              COMMENT DIT-ON EN ANGLAIS & DARI ?
            </Text>
            <Text style={[styles.frontTitle, { color: themeColors.textPrimary }]}>
              {phrase.fr}
            </Text>
          </View>

          <View style={styles.footerHint}>
            <RotateCw size={16} color={themeColors.textMuted} />
            <Text style={[styles.hintText, { color: themeColors.textMuted }]}>
              Touchez pour révéler les réponses
            </Text>
          </View>
        </Animated.View>

        {/* BACK SIDE */}
        <Animated.View
          style={[
            styles.card,
            styles.cardBack,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.accent,
              transform: [{ rotateY: backInterpolate }],
              opacity: backOpacity,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <LevelBadge level={phrase.level} size="md" />
            <View style={[styles.revealedBadge, { backgroundColor: themeColors.accentLight }]}>
              <Sparkles size={14} color={themeColors.accent} />
              <Text style={[styles.revealedText, { color: themeColors.accent }]}>Traductions</Text>
            </View>
          </View>

          <View style={styles.backTranslations}>
            {/* English */}
            <View style={[styles.backRow, { borderLeftColor: themeColors.enAccent }]}>
              <View style={styles.backLangTitleRow}>
                <Text style={[styles.langSub, { color: themeColors.enAccent }]}>ENGLISH</Text>
                <TouchableOpacity onPress={() => playAudio(phrase.en, 'en')}>
                  <Volume2 size={16} color={themeColors.enAccent} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.backEnglish, { color: themeColors.textPrimary }]}>
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
                <TouchableOpacity onPress={() => playAudio(phrase.dari, 'dari')}>
                  <Volume2 size={16} color={themeColors.dariAccent} />
                </TouchableOpacity>
                <Text style={[styles.langSub, { color: themeColors.dariAccent }]}>دری • DARI</Text>
              </View>
              <Text
                style={[
                  styles.backDariScript,
                  { color: themeColors.textPrimary },
                ]}
              >
                {phrase.dari}
              </Text>
              {settings.showPhonetics && (
                <Text style={[styles.backDariPhonetic, { color: themeColors.dariAccent }]}>
                  {phrase.dariPhonetic}
                </Text>
              )}
            </View>

            {/* Note */}
            {phrase.literalOrNote && (
              <Text style={[styles.backNote, { color: themeColors.textSecondary }]}>
                💡 {phrase.literalOrNote}
              </Text>
            )}
          </View>
        </Animated.View>
      </TouchableOpacity>

      {/* ACTION BUTTONS (À revoir / Maîtrisé) */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          onPress={onReview}
          activeOpacity={0.8}
          style={[styles.actionBtn, { backgroundColor: '#FEE2E2', borderColor: '#F87171' }]}
        >
          <Text style={[styles.actionBtnText, { color: '#DC2626' }]}>À revoir</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onMastered}
          activeOpacity={0.8}
          style={[styles.actionBtn, { backgroundColor: '#DCFCE7', borderColor: '#4ADE80' }]}
        >
          <Text style={[styles.actionBtnText, { color: '#16A34A' }]}>Je connais !</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginVertical: 12,
  },
  touchArea: {
    width: '100%',
    minHeight: 360,
  },
  card: {
    borderRadius: 24,
    borderWidth: 2,
    padding: 20,
    width: '100%',
    minHeight: 360,
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
  },
  audioPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  audioPillText: {
    fontSize: 13,
    fontWeight: '700',
  },
  revealedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
    gap: 4,
  },
  revealedText: {
    fontSize: 12,
    fontWeight: '700',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  promptLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 12,
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
    gap: 8,
  },
  hintText: {
    fontSize: 12,
    fontWeight: '600',
  },
  backTranslations: {
    marginVertical: 10,
    gap: 10,
  },
  backRow: {
    borderLeftWidth: 3,
    paddingLeft: 8,
  },
  backLangTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  langSub: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  backEnglish: {
    fontSize: 16,
    fontWeight: '600',
  },
  backDariBox: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  backDariScript: {
    fontSize: 19,
    lineHeight: 30,
    fontWeight: '700',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  backDariPhonetic: {
    fontSize: 12,
    fontStyle: 'italic',
    fontWeight: '600',
    marginTop: 4,
  },
  backNote: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
    gap: 14,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
