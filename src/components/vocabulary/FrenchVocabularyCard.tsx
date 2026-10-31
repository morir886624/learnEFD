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
import { FrenchVocabularyItem } from '../../types/frenchVocabulary';
import { useApp } from '../../context/AppContext';
import { SpeechService } from '../../services/speech';

interface FrenchVocabularyCardProps {
  item: FrenchVocabularyItem;
  accentColor?: string;
}

export const FrenchVocabularyCard: React.FC<FrenchVocabularyCardProps> = ({
  item,
  accentColor = '#059669',
}) => {
  const { themeColors, isDark, vocabularyProgress, markVocabularyWord } = useApp();

  const isMastered = vocabularyProgress.masteredWordIds.includes(item.id);
  const isReview = vocabularyProgress.reviewWordIds.includes(item.id);

  const speakFrench = (text: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore
    }
    const cleanText = text.replace(/\([^)]*\)/g, '').replace(/•/g, ', ');
    SpeechService.speak(cleanText, 'fr');
  };

  const handleToggleStatus = (status: 'mastered' | 'review') => {
    try {
      Haptics.selectionAsync();
    } catch {
      // ignore
    }
    if (status === 'mastered') {
      markVocabularyWord(item.id, true);
    } else {
      markVocabularyWord(item.id, false);
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
          {item.gender && (
            <View
              style={[
                styles.genderBadge,
                {
                  backgroundColor:
                    item.gender === 'féminin'
                      ? '#FCE7F3'
                      : item.gender === 'masculin'
                        ? '#E0F2FE'
                        : '#FEF3C7',
                },
              ]}
            >
              <Text
                style={[
                  styles.genderText,
                  {
                    color:
                      item.gender === 'féminin'
                        ? '#BE185D'
                        : item.gender === 'masculin'
                          ? '#0284C7'
                          : '#B45309',
                  },
                ]}
              >
                {item.gender.toUpperCase()}
              </Text>
            </View>
          )}
          {item.prepositionHighlight && (
            <View
              style={[
                styles.prepBadge,
                { backgroundColor: `${accentColor}18`, borderColor: accentColor },
              ]}
            >
              <Text style={[styles.prepText, { color: accentColor }]}>
                +{item.prepositionHighlight.toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        {/* Mastered / Review Toggle Buttons */}
        <View style={styles.statusButtons}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleToggleStatus('review')}
            style={[
              styles.iconBtn,
              {
                backgroundColor: isReview
                  ? '#FEF08A'
                  : isDark
                    ? '#1E293B'
                    : '#F8FAFC',
              },
            ]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Bookmark
              size={15}
              color={isReview ? '#CA8A04' : themeColors.textMuted}
              fill={isReview ? '#CA8A04' : 'transparent'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleToggleStatus('mastered')}
            style={[
              styles.iconBtn,
              {
                backgroundColor: isMastered
                  ? '#BBF7D0'
                  : isDark
                    ? '#1E293B'
                    : '#F8FAFC',
              },
            ]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <CircleCheck
              size={15}
              color={isMastered ? '#16A34A' : themeColors.textMuted}
              fill={isMastered ? '#16A34A' : 'transparent'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Word Row with Audio */}
      <View style={styles.wordRow}>
        <View style={styles.wordInfo}>
          <Text style={[styles.wordFr, { color: themeColors.textPrimary }]}>
            {item.wordFr}
          </Text>
          {item.phonetic && (
            <Text style={[styles.phonetic, { color: themeColors.textMuted }]}>
              [{item.phonetic}]
            </Text>
          )}
        </View>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => speakFrench(item.wordFr)}
          style={[styles.audioBtn, { backgroundColor: accentColor }]}
        >
          <Volume2 size={16} color="#FFFFFF" />
          <Text style={styles.audioBtnText}>FR</Text>
        </TouchableOpacity>
      </View>

      {/* Meanings: English + Dari */}
      <View style={styles.meaningsBox}>
        <Text style={[styles.meaningEn, { color: themeColors.textPrimary }]}>
          🇬🇧 {item.meaningEn}
        </Text>
        <View style={styles.dariRow}>
          <Text style={[styles.meaningDari, { color: themeColors.textPrimary }]}>
            {item.meaningDari}
          </Text>
          {item.dariPhonetic && (
            <Text style={[styles.dariPhoneticText, { color: themeColors.textMuted }]}>
              ({item.dariPhonetic})
            </Text>
          )}
        </View>
      </View>

      {/* Example Box with Native Audio */}
      <View
        style={[
          styles.exampleBox,
          {
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
            borderColor: themeColors.cardBorder,
          },
        ]}
      >
        <View style={styles.exampleHeader}>
          <Text style={[styles.exampleLabel, { color: accentColor }]}>Exemple concret :</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => speakFrench(item.exampleFr)}
            style={styles.exampleAudioPill}
          >
            <Volume2 size={13} color={accentColor} />
            <Text style={[styles.exampleAudioText, { color: accentColor }]}>Écouter</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.exampleFr, { color: themeColors.textPrimary }]}>
          {`"${item.exampleFr}"`}
        </Text>
        <Text style={[styles.exampleEn, { color: themeColors.textSecondary }]}>
          🇬🇧 {item.exampleEn}
        </Text>
        <Text style={[styles.exampleDari, { color: themeColors.textMuted }]}>
          {item.exampleDari}
        </Text>
      </View>

      {/* False Friend Alert Banner (if applicable) */}
      {item.falseFriendWarning && (
        <View
          style={[
            styles.falseFriendBanner,
            {
              backgroundColor: isDark ? '#271B19' : '#FEF2F2',
              borderColor: '#FCA5A5',
            },
          ]}
        >
          <TriangleAlert size={14} color="#DC2626" />
          <View style={{ flex: 1 }}>
            <Text style={styles.falseFriendTitle}>
              FAUX AMI : Ne pas confondre avec &quot;{item.falseFriendWarning.englishLookalike}&quot; !
            </Text>
            <Text style={styles.falseFriendText}>
              En français, cela signifie : {item.falseFriendWarning.trueMeaningFr} (
              {item.falseFriendWarning.trueMeaningEn}).
            </Text>
          </View>
        </View>
      )}

      {/* Usage Tip (if applicable) */}
      {item.usageTipFr && (
        <View style={styles.tipRow}>
          <Sparkles size={12} color={accentColor} />
          <Text style={[styles.tipText, { color: themeColors.textSecondary }]}>
            {item.usageTipFr}
          </Text>
        </View>
      )}

      {/* Source Reference Tag */}
      <View style={styles.footerRow}>
        <BookOpen size={11} color={themeColors.textMuted} />
        <Text style={[styles.sourceRefText, { color: themeColors.textMuted }]}>
          {item.sourceRef}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgesLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    flex: 1,
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
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  posText: {
    fontSize: 11,
    fontWeight: '600',
  },
  genderBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  genderText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  prepBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    borderWidth: 1,
  },
  prepText: {
    fontSize: 10,
    fontWeight: '800',
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  iconBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  wordInfo: {
    flex: 1,
    paddingRight: 8,
  },
  wordFr: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  phonetic: {
    fontSize: 12,
    fontFamily: 'monospace',
    marginTop: 1,
  },
  audioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  audioBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
  meaningsBox: {
    marginBottom: 10,
    gap: 4,
  },
  meaningEn: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 19,
  },
  dariRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
  meaningDari: {
    fontSize: 14.5,
    fontWeight: '700',
    textAlign: 'right',
  },
  dariPhoneticText: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  exampleBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    marginBottom: 8,
  },
  exampleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  exampleLabel: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  exampleAudioPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  exampleAudioText: {
    fontSize: 11,
    fontWeight: '700',
  },
  exampleFr: {
    fontSize: 13.5,
    fontWeight: '700',
    fontStyle: 'italic',
    lineHeight: 18,
    marginBottom: 2,
  },
  exampleEn: {
    fontSize: 12.5,
    lineHeight: 17,
    marginBottom: 2,
  },
  exampleDari: {
    fontSize: 12.5,
    textAlign: 'right',
    lineHeight: 17,
  },
  falseFriendBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    borderRadius: 10,
    borderWidth: 1,
    padding: 8,
    marginBottom: 8,
  },
  falseFriendTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#DC2626',
    marginBottom: 1,
  },
  falseFriendText: {
    fontSize: 11.5,
    color: '#991B1B',
    lineHeight: 16,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 12,
    fontStyle: 'italic',
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  sourceRefText: {
    fontSize: 10.5,
  },
});
