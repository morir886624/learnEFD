import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Play, RotateCcw, Table, BookOpen, Sparkles, ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useApp } from '../../../context/AppContext';
import { GrammarLanguage, FrenchSubTab } from './types';
import { GrammarLesson } from '../../../types/grammar';
import { FrenchGrammarLesson } from '../../../types/frenchGrammar';

interface GrammarCourseOverviewProps {
  language: GrammarLanguage;
  frenchSubTab: FrenchSubTab;
  onChangeFrenchSubTab: (tab: FrenchSubTab) => void;
  completedCount: number;
  totalCount: number;
  nextLesson?: GrammarLesson | FrenchGrammarLesson;
  onOpenLesson: (id: string) => void;
}

export const GrammarCourseOverview: React.FC<GrammarCourseOverviewProps> = ({
  language,
  frenchSubTab,
  onChangeFrenchSubTab,
  completedCount,
  totalCount,
  nextLesson,
  onOpenLesson,
}) => {
  const { themeColors } = useApp();

  const isFr = language === 'fr';
  const accentColor = isFr ? themeColors.frAccent : themeColors.enAccent;
  const percent = totalCount > 0 ? Math.min(100, Math.round((completedCount / totalCount) * 100)) : 0;
  const isFinished = totalCount > 0 && completedCount >= totalCount;

  const handleSubTab = (tab: FrenchSubTab) => {
    if (tab === frenchSubTab) return;
    try {
      Haptics.selectionAsync();
    } catch {
      // Ignore
    }
    onChangeFrenchSubTab(tab);
  };

  const getLessonTitle = (lesson: GrammarLesson | FrenchGrammarLesson) => {
    return isFr ? lesson.titleFr : lesson.titleEn;
  };

  return (
    <View style={styles.wrapper}>
      {/* CARD */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: themeColors.surface,
            borderColor: themeColors.cardBorder,
          },
        ]}
      >
        {/* TOP ROW: COURSE INFO & PERCENT */}
        <View style={styles.topRow}>
          <View style={{ flex: 1 }}>
            <View
              style={[
                styles.badgePill,
                { backgroundColor: `${accentColor}15` },
              ]}
            >
              <Text style={[styles.badgeText, { color: accentColor }]}>
                {isFr ? '🇫🇷 GRAMMAIRE FRANÇAISE • A1–B2' : '🇬🇧 GRAMMAIRE ANGLAISE • A1–B2'}
              </Text>
            </View>
            <Text style={[styles.courseTitle, { color: themeColors.textPrimary }]}>
              {isFr
                ? 'Annie Heminway • All-in-One'
                : 'Raymond Murphy & Betty Azar'}
            </Text>
            <Text style={[styles.courseSub, { color: themeColors.textMuted }]}>
              {isFr
                ? '33 Unités pédagogiques • Français, Anglais & دری'
                : '33 Unités essentielles • English, Français & دری'}
            </Text>
          </View>
          <View style={styles.percentBlock}>
            <Text style={[styles.percentNumber, { color: accentColor }]}>
              {percent}%
            </Text>
            <Text style={[styles.percentLabel, { color: themeColors.textMuted }]}>
              Maîtrisé
            </Text>
          </View>
        </View>

        {/* PROGRESS BAR */}
        <View
          style={[
            styles.progressTrack,
            { backgroundColor: themeColors.surfaceSubtle },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.max(4, percent)}%`,
                backgroundColor: accentColor,
              },
            ]}
          />
        </View>

        {/* STATS & QUICK CTA ROW */}
        <View style={styles.statsRow}>
          <Text style={[styles.statsText, { color: themeColors.textSecondary }]}>
            <Text style={{ fontWeight: '800', color: themeColors.textPrimary }}>
              {completedCount}
            </Text>{' '}
            sur {totalCount} unités complétées
          </Text>

          {isFinished && (
            <View style={[styles.doneBadge, { backgroundColor: '#DCFCE7' }]}>
              <Text style={styles.doneBadgeText}>✓ Cours complet</Text>
            </View>
          )}
        </View>

        {/* QUICK RESUME / START BUTTON */}
        {nextLesson && (
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => onOpenLesson(nextLesson.id)}
            style={[styles.resumeButton, { backgroundColor: accentColor }]}
          >
            <View style={styles.resumeIconCircle}>
              {isFinished ? (
                <RotateCcw size={15} color="#FFFFFF" />
              ) : (
                <Play size={15} color="#FFFFFF" fill="#FFFFFF" />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.resumeLabel}>
                {isFinished
                  ? 'Réviser le cours'
                  : completedCount === 0
                  ? 'Commencer le cours'
                  : 'Reprendre la leçon en cours'}
              </Text>
              <Text numberOfLines={1} style={styles.resumeLessonTitle}>
                Unité {nextLesson.unitNumber} • {getLessonTitle(nextLesson)}
              </Text>
            </View>
            <ChevronRight size={18} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      {/* FRENCH SUB-NAV: LEÇONS VS CONJUGUEUR */}
      {isFr ? (
        <View
          style={[
            styles.subTabNav,
            {
              backgroundColor: themeColors.surfaceSubtle,
              borderColor: themeColors.cardBorder,
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => handleSubTab('lessons')}
            style={[
              styles.subTabBtn,
              frenchSubTab === 'lessons' && [
                styles.subTabBtnActive,
                { backgroundColor: themeColors.surface },
              ],
            ]}
          >
            <BookOpen
              size={15}
              color={
                frenchSubTab === 'lessons'
                  ? themeColors.frAccent
                  : themeColors.textSecondary
              }
            />
            <Text
              style={[
                styles.subTabBtnText,
                {
                  color:
                    frenchSubTab === 'lessons'
                      ? themeColors.frAccent
                      : themeColors.textSecondary,
                  fontWeight: frenchSubTab === 'lessons' ? '800' : '600',
                },
              ]}
            >
              Programme des 33 Unités
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => handleSubTab('verbs')}
            style={[
              styles.subTabBtn,
              frenchSubTab === 'verbs' && [
                styles.subTabBtnActive,
                { backgroundColor: themeColors.surface },
              ],
            ]}
          >
            <Table
              size={15}
              color={
                frenchSubTab === 'verbs'
                  ? themeColors.frAccent
                  : themeColors.textSecondary
              }
            />
            <Text
              style={[
                styles.subTabBtnText,
                {
                  color:
                    frenchSubTab === 'verbs'
                      ? themeColors.frAccent
                      : themeColors.textSecondary,
                  fontWeight: frenchSubTab === 'verbs' ? '800' : '600',
                },
              ]}
            >
              Conjugueur (19 verbes)
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* ENGLISH COMPANION BANNER: VOCABULARY & PHRASAL VERBS */
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() =>
            router.push({
              pathname: '/phrases',
              params: { mode: 'explorer', source: 'vocab-en' },
            } as any)
          }
          style={[
            styles.companionBanner,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.cardBorder,
            },
          ]}
        >
          <View
            style={[
              styles.companionIconCircle,
              { backgroundColor: `${themeColors.enAccent}15` },
            ]}
          >
            <Sparkles size={20} color={themeColors.enAccent} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.companionTagRow}>
              <Text
                style={[styles.companionTag, { color: themeColors.enAccent }]}
              >
                COMPAGNON OFFICIEL • MURPHY & AZAR
              </Text>
            </View>
            <Text
              style={[
                styles.companionTitle,
                { color: themeColors.textPrimary },
              ]}
            >
              Lexique, Phrasal Verbs & Quiz
            </Text>
            <Text
              style={[styles.companionSub, { color: themeColors.textMuted }]}
            >
              180+ mots trilingues, flashcards 3D & exercices associés →
            </Text>
          </View>
          <ChevronRight size={18} color={themeColors.enAccent} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  badgePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  courseTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    lineHeight: 22,
  },
  courseSub: {
    fontSize: 12,
    marginTop: 2,
  },
  percentBlock: {
    alignItems: 'center',
    paddingLeft: 6,
  },
  percentNumber: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  percentLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressTrack: {
    height: 7,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 12.5,
  },
  doneBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 8,
  },
  doneBadgeText: {
    color: '#16A34A',
    fontSize: 11,
    fontWeight: '800',
  },
  resumeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 14,
  },
  resumeIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resumeLabel: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700',
    opacity: 0.9,
  },
  resumeLessonTitle: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
    marginTop: 1,
  },
  subTabNav: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 3,
    gap: 4,
  },
  subTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 9,
  },
  subTabBtnActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  subTabBtnText: {
    fontSize: 12.5,
  },
  companionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  companionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  companionTagRow: {
    marginBottom: 2,
  },
  companionTag: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  companionTitle: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  companionSub: {
    fontSize: 11.5,
    marginTop: 1,
  },
});

