import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Volume2, Sparkles, MessageSquare, ArrowLeftRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { ComparisonPair } from '../../types/grammar';
import { useApp } from '../../context/AppContext';
import { SpeechService } from '../../services/speech';

interface GrammarComparisonProps {
  comparison: ComparisonPair;
}

export const GrammarComparison: React.FC<GrammarComparisonProps> = ({ comparison }) => {
  const { themeColors, isDark } = useApp();
  const [activeTab, setActiveTab] = useState<'A' | 'B'>('A');

  const item = activeTab === 'A' ? comparison.itemA : comparison.itemB;

  const handleToggle = (tab: 'A' | 'B') => {
    try {
      Haptics.selectionAsync();
    } catch {
      // Ignore
    }
    setActiveTab(tab);
  };

  const playAudio = (text: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Ignore
    }
    SpeechService.speak(text, 'en');
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: themeColors.surface,
          borderColor: themeColors.cardBorder,
        },
      ]}
    >
      {/* Title */}
      <View style={styles.header}>
        <View style={[styles.badgePill, { backgroundColor: '#FEE2E2' }]}>
          <ArrowLeftRight size={14} color="#DC2626" />
          <Text style={styles.badgeText}>COMPARAISON DIRECTE (MURPHY)</Text>
        </View>
        <Text style={[styles.title, { color: themeColors.textPrimary }]}>
          {comparison.titleFr || comparison.titleEn}
        </Text>
      </View>

      {/* Segmented Switcher Buttons */}
      <View style={[styles.tabBar, { backgroundColor: themeColors.surfaceSubtle }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleToggle('A')}
          style={[
            styles.tabButton,
            activeTab === 'A' && [
              styles.tabButtonActive,
              {
                backgroundColor: themeColors.surface,
                shadowColor: '#000',
                shadowOpacity: isDark ? 0.2 : 0.08,
              },
            ],
          ]}
        >
          <Text
            numberOfLines={1}
            style={[
              styles.tabButtonText,
              {
                color: activeTab === 'A' ? themeColors.primary : themeColors.textSecondary,
                fontWeight: activeTab === 'A' ? '800' : '600',
              },
            ]}
          >
            {comparison.itemA.name}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleToggle('B')}
          style={[
            styles.tabButton,
            activeTab === 'B' && [
              styles.tabButtonActive,
              {
                backgroundColor: themeColors.surface,
                shadowColor: '#000',
                shadowOpacity: isDark ? 0.2 : 0.08,
              },
            ],
          ]}
        >
          <Text
            numberOfLines={1}
            style={[
              styles.tabButtonText,
              {
                color: activeTab === 'B' ? themeColors.primary : themeColors.textSecondary,
                fontWeight: activeTab === 'B' ? '800' : '600',
              },
            ]}
          >
            {comparison.itemB.name}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Active Structure Card */}
      <View
        style={[
          styles.contentCard,
          {
            backgroundColor: themeColors.surfaceSubtle,
            borderColor: isDark ? 'rgba(255,255,255,0.06)' : themeColors.cardBorder,
          },
        ]}
      >
        {/* Form Formula Box */}
        <View style={styles.formRow}>
          <Text style={[styles.formLabel, { color: themeColors.textMuted }]}>STRUCTURE :</Text>
          <View style={[styles.formPill, { backgroundColor: themeColors.primaryLight }]}>
            <Text style={[styles.formPillText, { color: themeColors.primary }]}>{item.form}</Text>
          </View>
        </View>

        {/* Concept description */}
        <Text style={[styles.conceptFr, { color: themeColors.textPrimary }]}>
          {item.conceptFr}
        </Text>
        {item.conceptDari ? (
          <Text style={[styles.conceptDari, { color: themeColors.textSecondary }]}>
            {item.conceptDari}
          </Text>
        ) : null}

        {/* Example sentence with Audio */}
        <View style={[styles.exampleBox, { backgroundColor: themeColors.surface }]}>
          <View style={styles.exampleTopRow}>
            <Text style={[styles.exampleTag, { color: themeColors.accent }]}>Exemple concret :</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => playAudio(item.exampleEn)}
              style={[styles.audioPill, { backgroundColor: themeColors.primary }]}
            >
              <Volume2 size={13} color="#FFFFFF" />
              <Text style={styles.audioPillText}>Écouter</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.exampleEn, { color: themeColors.textPrimary }]}>
            {`"${item.exampleEn}"`}
          </Text>
          <Text style={[styles.exampleFr, { color: themeColors.textSecondary }]}>
            {item.exampleFr}
          </Text>
          {item.exampleDari ? (
            <Text style={[styles.exampleDariText, { color: themeColors.textMuted }]}>
              {item.exampleDari}
            </Text>
          ) : null}
        </View>

        {/* Murphy Conversational Dialogue (if available) */}
        {item.dialogue && (
          <View style={[styles.dialogueBox, { borderColor: themeColors.cardBorder }]}>
            <View style={styles.dialogueHeader}>
              <MessageSquare size={14} color={themeColors.secondary} />
              <Text style={[styles.dialogueTitle, { color: themeColors.secondary }]}>
                Dialogue du quotidien :
              </Text>
            </View>
            <Text style={[styles.dialogueLine, { color: themeColors.textPrimary }]}>
              <Text style={{ fontWeight: '700' }}>A: </Text>
              {item.dialogue.speakerA}
            </Text>
            <Text style={[styles.dialogueLine, { color: themeColors.textPrimary }]}>
              <Text style={{ fontWeight: '700' }}>B: </Text>
              {item.dialogue.speakerB}
            </Text>
          </View>
        )}
      </View>

      {/* Key Contrast Takeaway */}
      <View
        style={[
          styles.takeawayBanner,
          {
            backgroundColor: isDark ? '#1E1B4B' : '#EEF2FF',
            borderColor: isDark ? '#3730A3' : '#C7D2FE',
          },
        ]}
      >
        <Sparkles size={16} color="#4F46E5" />
        <View style={{ flex: 1 }}>
          <Text style={styles.takeawayTitle}>La différence clé :</Text>
          <Text style={[styles.takeawayText, { color: isDark ? '#C7D2FE' : '#312E81' }]}>
            {comparison.keyContrastFr || comparison.keyContrastEn}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  header: {
    marginBottom: 12,
  },
  badgePill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#DC2626',
    letterSpacing: 0.4,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  tabButtonText: {
    fontSize: 12.5,
  },
  contentCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  formLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  formPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  formPillText: {
    fontSize: 12.5,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  conceptFr: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  conceptDari: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'right',
    marginBottom: 10,
  },
  exampleBox: {
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
  },
  exampleTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  exampleTag: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  audioPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  audioPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  exampleEn: {
    fontSize: 15,
    fontWeight: '700',
    fontStyle: 'italic',
    marginBottom: 3,
  },
  exampleFr: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 2,
  },
  exampleDariText: {
    fontSize: 12.5,
    lineHeight: 17,
    textAlign: 'right',
  },
  dialogueBox: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
  },
  dialogueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  dialogueTitle: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  dialogueLine: {
    fontSize: 13,
    lineHeight: 18,
    marginVertical: 1,
  },
  takeawayBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  takeawayTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4F46E5',
    marginBottom: 2,
  },
  takeawayText: {
    fontSize: 13,
    lineHeight: 18,
  },
});
