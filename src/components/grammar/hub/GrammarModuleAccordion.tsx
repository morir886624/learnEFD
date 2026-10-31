import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ChevronDown, ChevronUp, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useApp } from '../../../context/AppContext';
import { GrammarLesson, GrammarModule } from '../../../types/grammar';
import { FrenchGrammarLesson, FrenchGrammarModule } from '../../../types/frenchGrammar';
import { GrammarCard } from '../GrammarCard';
import { GrammarLanguage, getLevelRange } from './types';

interface GrammarModuleAccordionProps {
  module: GrammarModule | FrenchGrammarModule;
  lessons: (GrammarLesson | FrenchGrammarLesson)[];
  language: GrammarLanguage;
  isExpanded: boolean;
  onToggle: () => void;
  onOpenLesson: (id: string) => void;
}

export const GrammarModuleAccordion: React.FC<GrammarModuleAccordionProps> = ({
  module,
  lessons,
  language,
  isExpanded,
  onToggle,
  onOpenLesson,
}) => {
  const { themeColors, grammarProgress } = useApp();

  const completedCount = lessons.filter((l) =>
    grammarProgress.completedLessonIds.includes(l.id)
  ).length;
  const isAllCompleted = lessons.length > 0 && completedCount === lessons.length;
  const levelRange = getLevelRange(lessons);
  const isEn = language === 'en';

  const primaryTitle = isEn && 'titleEn' in module ? module.titleEn : module.titleFr;
  const secondaryTitle = isEn ? module.titleFr : module.titleEn;

  const handleToggle = () => {
    try {
      Haptics.selectionAsync();
    } catch {
      // Ignore
    }
    onToggle();
  };

  return (
    <View
      style={[
        styles.moduleCard,
        {
          backgroundColor: themeColors.surface,
          borderColor: isAllCompleted ? '#86EFAC' : themeColors.cardBorder,
        },
      ]}
    >
      {/* MODULE HEADER */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleToggle}
        style={styles.moduleHeader}
      >
        <View style={styles.moduleLeft}>
          <View style={styles.badgeRow}>
            {/* MODULE ORDER PILL */}
            <View
              style={[
                styles.moduleIndexPill,
                { backgroundColor: `${module.color}15` },
              ]}
            >
              <Text style={[styles.moduleIndexText, { color: module.color }]}>
                MODULE {module.order} • {module.badge}
              </Text>
            </View>

            {/* LEVEL RANGE PILL */}
            {levelRange ? (
              <View
                style={[
                  styles.levelRangePill,
                  { backgroundColor: themeColors.surfaceSubtle },
                ]}
              >
                <Text
                  style={[
                    styles.levelRangeText,
                    { color: themeColors.textSecondary },
                  ]}
                >
                  {levelRange}
                </Text>
              </View>
            ) : null}
          </View>

          {/* TITLES */}
          <Text
            style={[styles.moduleTitlePrimary, { color: themeColors.textPrimary }]}
          >
            {primaryTitle}
          </Text>
          <Text
            style={[styles.moduleTitleSecondary, { color: themeColors.textSecondary }]}
          >
            {secondaryTitle} {module.titleDari ? `• ${module.titleDari}` : ''}
          </Text>

          {/* DESCRIPTION */}
          {module.descriptionFr ? (
            <Text
              style={[styles.moduleDescription, { color: themeColors.textMuted }]}
              numberOfLines={isExpanded ? undefined : 2}
            >
              {module.descriptionFr}
            </Text>
          ) : null}
        </View>

        {/* MODULE RIGHT: PROGRESS BADGE & CHEVRON */}
        <View style={styles.moduleRight}>
          <View
            style={[
              styles.progressBadge,
              {
                backgroundColor: isAllCompleted
                  ? '#DCFCE7'
                  : themeColors.surfaceSubtle,
              },
            ]}
          >
            {isAllCompleted && <Check size={11} color="#16A34A" strokeWidth={3} />}
            <Text
              style={[
                styles.progressBadgeText,
                {
                  color: isAllCompleted
                    ? '#16A34A'
                    : themeColors.textSecondary,
                },
              ]}
            >
              {completedCount}/{lessons.length}
            </Text>
          </View>

          <View style={styles.chevronBox}>
            {isExpanded ? (
              <ChevronUp size={20} color={themeColors.textSecondary} />
            ) : (
              <ChevronDown size={20} color={themeColors.textSecondary} />
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* EXPANDED LESSON LIST */}
      {isExpanded && (
        <View
          style={[
            styles.lessonsContainer,
            { borderTopColor: themeColors.surfaceSubtle },
          ]}
        >
          {lessons.map((lesson) => {
            const isLessonCompleted = grammarProgress.completedLessonIds.includes(
              lesson.id
            );
            const scoreInfo = grammarProgress.lessonScores[lesson.id];

            return (
              <GrammarCard
                key={lesson.id}
                lesson={lesson}
                language={language}
                isCompleted={isLessonCompleted}
                scoreInfo={scoreInfo}
                onPress={() => onOpenLesson(lesson.id)}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  moduleCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    gap: 8,
  },
  moduleLeft: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  moduleIndexPill: {
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  moduleIndexText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  levelRangePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  levelRangeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  moduleTitlePrimary: {
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
    marginBottom: 2,
  },
  moduleTitleSecondary: {
    fontSize: 12.5,
    fontWeight: '600',
    marginBottom: 4,
  },
  moduleDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  moduleRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingLeft: 4,
  },
  progressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  progressBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  chevronBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonsContainer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
  },
});

