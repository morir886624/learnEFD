import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  Volume2,
  CircleCheck,
  Bookmark,
  BookOpen,
  TriangleAlert,
  Sparkles,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { VocabularyItem } from '../../types/vocabulary';
import { useApp } from '../../context/AppContext';
import { SpeechService } from '../../services/speech';

interface VocabularyCardProps {
  item: VocabularyItem;
  accentColor?: string;
}

export const VocabularyCard: React.FC<VocabularyCardProps> = ({
  item,
  accentColor = '#2563EB',
}) => {
  const { themeColors, isDark, vocabularyProgress, markVocabularyWord } = useApp();

  const isMastered = vocabularyProgress.masteredWordIds.includes(item.id);
  const isReview = vocabularyProgress.reviewWordIds.includes(item.id);

  const speakEn = (text: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore
    }
    const cleanText = text.replace(/\([^)]*\)/g, '').replace(/•/g, ', ');
    SpeechService.speak(cleanText, 'en');
  };

  const handleToggleStatus = (status: 'mastered' | 'review') => {
    try {
      Haptics.selectionAsync();
    } catch {
      // ignore
    }
    if (status === 'mastered') {
      markVocabularyWord(item.id, isMastered ? 'none' : 'mastered');
    } else {
      markVocabularyWord(item.id, isReview ? 'none' : 'review');
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'A1':
        return '#16A34A';
      case 'A2':
        return '#0284C7';
      case 'B1':
        return '#7C3AED';
      case 'B2':
        return '#D97706';
      default:
        return accentColor;
    }
  };

  const levelColor = getLevelColor(item.level);

  return (
    <View
      style={[
        styles.card,
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
      {/* Top Meta Row */}
      <View style={styles.metaRow}>
        <View style={styles.badgesLeft}>
          <View style={[styles.levelBadge, { backgroundColor: `${levelColor}18` }]}>
            <Text style={[styles.levelText, { color: levelColor }]}>{item.level}</Text>
          </View>
          <View
            style={[
              styles.posBadge,
              { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' },
            ]}
          >
            <Text style={[styles.posText, { color: themeColors.textSecondary }]}>
              {item.partOfSpeech}
            </Text>
          </View>
          {item.prepositionHighlight ? (
            <View style={[styles.prepBadge, { backgroundColor: `${accentColor}18` }]}>
              <Text style={[styles.prepBadgeText, { color: accentColor }]}>
                + {item.prepositionHighlight.toUpperCase()}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.sourcePill}>
          <BookOpen size={11} color={themeColors.textMuted} />
          <Text style={[styles.sourceText, { color: themeColors.textMuted }]}>
            {item.sourceRef}
          </Text>
        </View>
      </View>

      {/* Headword + Audio Button */}
      <View style={styles.headwordRow}>
        <View style={styles.headwordTextCol}>
          <Text style={[styles.wordEn, { color: themeColors.textPrimary }]}>
            {item.wordEn}
          </Text>
          <Text style={[styles.phonetic, { color: themeColors.textMuted }]}>
            {item.phoneticEn}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => speakEn(item.wordEn)}
          style={[styles.audioBtn, { backgroundColor: `${accentColor}15` }]}
        >
          <Volume2 size={18} color={accentColor} />
        </TouchableOpacity>
      </View>

      {/* Irregular Verb 3-Forms Strip (V1 • V2 • V3) */}
      {item.verbForms ? (
        <View
          style={[
            styles.verbFormsRow,
            {
              backgroundColor: isDark ? '#1E1B4B' : '#F5F3FF',
              borderColor: isDark ? '#3730A3' : '#DDD6FE',
            },
          ]}
        >
          <TouchableOpacity
            style={styles.verbFormCell}
            onPress={() => speakEn(item.verbForms!.base)}
          >
            <Text style={styles.verbFormLabel}>V1 (BASE)</Text>
            <Text
              style={[
                styles.verbFormValue,
                { color: isDark ? '#E0E7FF' : '#4C1D95' },
              ]}
            >
              {item.verbForms.base}
            </Text>
          </TouchableOpacity>
          <View style={styles.verbFormDivider} />
          <TouchableOpacity
            style={styles.verbFormCell}
            onPress={() => speakEn(item.verbForms!.pastSimple)}
          >
            <Text style={styles.verbFormLabel}>V2 (PAST SIMPLE)</Text>
            <Text
              style={[
                styles.verbFormValue,
                { color: isDark ? '#C4B5FD' : '#6D28D9' },
              ]}
            >
              {item.verbForms.pastSimple}
            </Text>
          </TouchableOpacity>
          <View style={styles.verbFormDivider} />
          <TouchableOpacity
            style={styles.verbFormCell}
            onPress={() => speakEn(item.verbForms!.pastParticiple)}
          >
            <Text style={styles.verbFormLabel}>V3 (PARTICIPLE)</Text>
            <Text
              style={[
                styles.verbFormValue,
                { color: isDark ? '#A78BFA' : '#5B21B6' },
              ]}
            >
              {item.verbForms.pastParticiple}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Trilingual Meanings Block */}
      <View
        style={[
          styles.meaningBox,
          { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' },
        ]}
      >
        <View style={styles.langRow}>
          <Text style={[styles.langTag, { backgroundColor: '#DBEAFE', color: '#1D4ED8' }]}>
            FR
          </Text>
          <Text style={[styles.meaningFr, { color: themeColors.textPrimary }]}>
            {item.meaningFr}
          </Text>
        </View>

        <View style={styles.langRow}>
          <Text style={[styles.langTag, { backgroundColor: '#E0E7FF', color: '#4338CA' }]}>
            EN
          </Text>
          <Text style={[styles.meaningEn, { color: themeColors.textSecondary }]}>
            {item.meaningEn}
          </Text>
        </View>

        <View style={styles.dariRow}>
          <View style={styles.dariTextCol}>
            <Text style={[styles.meaningDari, { color: themeColors.textPrimary }]}>
              {item.meaningDari}
            </Text>
            {item.dariPhonetic ? (
              <Text style={[styles.dariPhonetic, { color: themeColors.textMuted }]}>
                /{item.dariPhonetic}/
              </Text>
            ) : null}
          </View>
          <Text style={[styles.langTag, { backgroundColor: '#FEF3C7', color: '#B45309' }]}>
            دری
          </Text>
        </View>
      </View>

      {/* Contextual Example from Murphy / Azar */}
      <View
        style={[
          styles.exampleBox,
          {
            backgroundColor: isDark ? '#111827' : '#FFFFFF',
            borderColor: themeColors.cardBorder,
          },
        ]}
      >
        <View style={styles.exampleHeader}>
          <Text style={[styles.exampleLabel, { color: accentColor }]}>
            EXEMPLE EN CONTEXTE
          </Text>
          <TouchableOpacity
            onPress={() => speakEn(item.exampleEn)}
            style={styles.exampleAudioBtn}
          >
            <Volume2 size={14} color={accentColor} />
            <Text style={[styles.exampleAudioText, { color: accentColor }]}>
              Écouter
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.exampleEn, { color: themeColors.textPrimary }]}>
          {`"${item.exampleEn}"`}
        </Text>
        <Text style={[styles.exampleFr, { color: themeColors.textSecondary }]}>
          → {item.exampleFr}
        </Text>
        <Text style={[styles.exampleDari, { color: themeColors.textMuted }]}>
          {item.exampleDari}
        </Text>
      </View>

      {/* Common Mistake Alert Box */}
      {item.commonMistake ? (
        <View
          style={[
            styles.mistakeBox,
            {
              backgroundColor: isDark ? '#2A1215' : '#FEF2F2',
              borderColor: isDark ? '#7F1D1D' : '#FECACA',
            },
          ]}
        >
          <View style={styles.mistakeHeader}>
            <TriangleAlert size={13} color="#DC2626" />
            <Text style={styles.mistakeTitle}>PIÈGE FRÉQUENT À ÉVITER</Text>
          </View>
          <Text style={styles.wrongText}>✗ {item.commonMistake.wrong}</Text>
          <Text style={styles.rightText}>✓ {item.commonMistake.right}</Text>
        </View>
      ) : null}

      {/* Usage Tip Box */}
      {item.usageTipFr ? (
        <View
          style={[
            styles.tipBox,
            {
              backgroundColor: isDark ? '#1E293B' : '#FFFBEB',
              borderColor: isDark ? '#334155' : '#FDE68A',
            },
          ]}
        >
          <Sparkles size={13} color="#D97706" />
          <Text style={[styles.tipText, { color: isDark ? '#FDE68A' : '#92400E' }]}>
            {item.usageTipFr}
          </Text>
        </View>
      ) : null}

      {/* Bottom Action Bar: Mastery & Review toggles */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleToggleStatus('mastered')}
          style={[
            styles.actionBtn,
            {
              backgroundColor: isMastered
                ? '#DCFCE7'
                : isDark
                  ? '#1E293B'
                  : '#F1F5F9',
              borderColor: isMastered ? '#16A34A' : 'transparent',
            },
          ]}
        >
          <CircleCheck
            size={15}
            color={isMastered ? '#16A34A' : themeColors.textMuted}
          />
          <Text
            style={[
              styles.actionBtnText,
              { color: isMastered ? '#15803D' : themeColors.textSecondary },
            ]}
          >
            {isMastered ? 'Maîtrisé ✓' : 'Marquer maîtrisé'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleToggleStatus('review')}
          style={[
            styles.actionBtn,
            {
              backgroundColor: isReview
                ? '#FEF9C3'
                : isDark
                  ? '#1E293B'
                  : '#F1F5F9',
              borderColor: isReview ? '#CA8A04' : 'transparent',
            },
          ]}
        >
          <Bookmark
            size={15}
            color={isReview ? '#CA8A04' : themeColors.textMuted}
          />
          <Text
            style={[
              styles.actionBtnText,
              { color: isReview ? '#A16207' : themeColors.textSecondary },
            ]}
          >
            {isReview ? 'À réviser ★' : 'À réviser'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  badgesLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  levelBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  levelText: {
    fontSize: 11,
    fontWeight: '800',
  },
  posBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  posText: {
    fontSize: 11,
    fontWeight: '600',
  },
  prepBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  prepBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  sourcePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sourceText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  headwordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headwordTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  wordEn: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  phonetic: {
    fontSize: 12.5,
    fontWeight: '500',
    marginTop: 2,
  },
  audioBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verbFormsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 6,
    marginBottom: 10,
  },
  verbFormCell: {
    flex: 1,
    alignItems: 'center',
  },
  verbFormDivider: {
    width: 1,
    height: 26,
    backgroundColor: 'rgba(139, 92, 246, 0.25)',
  },
  verbFormLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#7C3AED',
    marginBottom: 2,
  },
  verbFormValue: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  meaningBox: {
    borderRadius: 12,
    padding: 11,
    gap: 7,
    marginBottom: 10,
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  langTag: {
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 1,
  },
  meaningFr: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 19,
  },
  meaningEn: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 17,
  },
  dariRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    gap: 8,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  dariTextCol: {
    flex: 1,
    alignItems: 'flex-end',
  },
  meaningDari: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
    lineHeight: 20,
  },
  dariPhonetic: {
    fontSize: 11.5,
    fontStyle: 'italic',
    marginTop: 1,
  },
  exampleBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 11,
    marginBottom: 10,
  },
  exampleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  exampleLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  exampleAudioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  exampleAudioText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  exampleEn: {
    fontSize: 13.5,
    fontWeight: '700',
    lineHeight: 19,
    marginBottom: 4,
  },
  exampleFr: {
    fontSize: 12.5,
    lineHeight: 17,
    marginBottom: 4,
  },
  exampleDari: {
    fontSize: 12.5,
    textAlign: 'right',
    lineHeight: 18,
  },
  mistakeBox: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  mistakeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  mistakeTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#DC2626',
    letterSpacing: 0.4,
  },
  wrongText: {
    fontSize: 12.5,
    color: '#DC2626',
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  rightText: {
    fontSize: 12.5,
    color: '#16A34A',
    fontWeight: '700',
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    borderWidth: 1,
    borderRadius: 10,
    padding: 9,
    marginBottom: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
