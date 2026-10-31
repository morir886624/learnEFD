import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight, CircleCheck, BookOpen, Layers } from 'lucide-react-native';
import { GrammarLesson } from '../../types/grammar';
import { FrenchGrammarLesson } from '../../types/frenchGrammar';
import { useApp } from '../../context/AppContext';

interface GrammarCardProps {
  lesson: GrammarLesson | FrenchGrammarLesson;
  isCompleted?: boolean;
  scoreInfo?: { score: number; total: number };
  onPress: () => void;
  language?: 'fr' | 'en';
}

export const GrammarCard: React.FC<GrammarCardProps> = ({
  lesson,
  isCompleted,
  scoreInfo,
  onPress,
  language = 'fr',
}) => {
  const { themeColors } = useApp();

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
        return themeColors.primary;
    }
  };

  const levelColor = getLevelColor(lesson.level);
  const isEn = language === 'en';
  const primaryTitle = isEn ? lesson.titleEn : lesson.titleFr;
  const secondaryTitle = isEn ? lesson.titleFr : lesson.titleEn;
  const summaryText =
    isEn && 'summaryEn' in lesson && lesson.summaryEn
      ? lesson.summaryEn
      : lesson.summaryFr;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: themeColors.surface,
          borderColor: isCompleted ? '#86EFAC' : themeColors.cardBorder,
        },
      ]}
    >
      <View style={styles.topRow}>
        {/* Unit and Level Badge */}
        <View style={styles.badgeGroup}>
          <View style={[styles.unitBadge, { backgroundColor: themeColors.primaryLight }]}>
            <Text style={[styles.unitText, { color: themeColors.primary }]}>
              UNITÉ {lesson.unitNumber}
            </Text>
          </View>
          <View style={[styles.levelBadge, { backgroundColor: `${levelColor}18` }]}>
            <Text style={[styles.levelText, { color: levelColor }]}>{lesson.level}</Text>
          </View>
        </View>

        {/* Status / Score */}
        {isCompleted ? (
          <View style={[styles.completedPill, { backgroundColor: '#DCFCE7' }]}>
            <CircleCheck size={13} color="#16A34A" />
            <Text style={styles.completedText}>
              {scoreInfo ? `${scoreInfo.score}/${scoreInfo.total}` : 'Maîtrisé'}
            </Text>
          </View>
        ) : (
          <View style={[styles.exerciseCountPill, { backgroundColor: themeColors.surfaceSubtle }]}>
            <Layers size={12} color={themeColors.textMuted} />
            <Text style={[styles.exerciseCountText, { color: themeColors.textMuted }]}>
              {lesson.exercises.length} exercices
            </Text>
          </View>
        )}
      </View>

      {/* Lesson Title */}
      <Text style={[styles.titleFr, { color: themeColors.textPrimary }]}>
        {primaryTitle}
      </Text>
      <Text style={[styles.titleEn, { color: themeColors.textSecondary }]}>
        {secondaryTitle}
      </Text>

      {/* Dari Title if available */}
      {lesson.titleDari ? (
        <Text style={[styles.titleDari, { color: themeColors.textMuted }]}>
          {lesson.titleDari}
        </Text>
      ) : null}

      {/* Brief Summary */}
      <Text
        numberOfLines={2}
        style={[styles.summary, { color: themeColors.textSecondary }]}
      >
        {summaryText}
      </Text>

      {/* Footer: Source book tag + Open arrow */}
      <View style={styles.footerRow}>
        <View style={styles.sourceTag}>
          <BookOpen size={12} color={themeColors.textMuted} />
          <Text style={[styles.sourceTagText, { color: themeColors.textMuted }]}>
            {lesson.sources.description}
          </Text>
        </View>
        <ChevronRight size={18} color={themeColors.primary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  unitBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  unitText: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.4,
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
  completedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  completedText: {
    color: '#16A34A',
    fontSize: 11,
    fontWeight: '800',
  },
  exerciseCountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  exerciseCountText: {
    fontSize: 11,
    fontWeight: '600',
  },
  titleFr: {
    fontSize: 15.5,
    fontWeight: '800',
    lineHeight: 21,
    marginBottom: 2,
  },
  titleEn: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  titleDari: {
    fontSize: 12.5,
    textAlign: 'right',
    marginBottom: 6,
  },
  summary: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
  },
  sourceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
  },
  sourceTagText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
