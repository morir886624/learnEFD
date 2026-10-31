import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Volume2, Clock, CheckCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { TimelinePoint } from '../../types/grammar';
import { useApp } from '../../context/AppContext';
import { SpeechService } from '../../services/speech';

interface GrammarTimelineProps {
  descriptionEn: string;
  descriptionFr: string;
  descriptionDari: string;
  points: TimelinePoint[];
}

export const GrammarTimeline: React.FC<GrammarTimelineProps> = ({
  descriptionFr,
  descriptionDari,
  points,
}) => {
  const { themeColors, isDark } = useApp();
  const [selectedPointId, setSelectedPointId] = useState<string>(points[0]?.id || '');

  const activePoint = points.find((p) => p.id === selectedPointId) || points[0];

  const handleSelectPoint = (point: TimelinePoint) => {
    try {
      Haptics.selectionAsync();
    } catch {
      // Ignore
    }
    setSelectedPointId(point.id);
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
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={[styles.iconCircle, { backgroundColor: themeColors.primaryLight }]}>
          <Clock size={16} color={themeColors.primary} />
        </View>
        <Text style={[styles.headerTitle, { color: themeColors.primary }]}>
          LIGNE DU TEMPS VISUELLE
        </Text>
      </View>

      <Text style={[styles.description, { color: themeColors.textSecondary }]}>
        {descriptionFr}
      </Text>
      {descriptionDari ? (
        <Text style={[styles.descriptionDari, { color: themeColors.textMuted }]}>
          {descriptionDari}
        </Text>
      ) : null}

      {/* Visual Timeline Track */}
      <View style={styles.trackContainer}>
        {/* Horizontal bar */}
        <View style={[styles.trackLine, { backgroundColor: isDark ? '#334155' : '#CBD5E1' }]} />

        {/* Labels: Past, Now, Future */}
        <View style={styles.timelineAxisLabels}>
          <Text style={[styles.axisLabel, { color: themeColors.textMuted }]}>PASSÉ (Past)</Text>
          <View style={[styles.nowPill, { backgroundColor: themeColors.accentLight }]}>
            <Text style={[styles.nowLabel, { color: themeColors.accent }]}>MAINTENANT (Now)</Text>
          </View>
          <Text style={[styles.axisLabel, { color: themeColors.textMuted }]}>FUTUR (Future)</Text>
        </View>

        {/* Interactive Points on Timeline */}
        <View style={styles.pointsRow}>
          {points.map((pt, idx) => {
            const isSelected = pt.id === activePoint?.id;
            return (
              <TouchableOpacity
                key={pt.id}
                activeOpacity={0.8}
                onPress={() => handleSelectPoint(pt)}
                style={[
                  styles.pointButton,
                  isSelected && {
                    borderColor: themeColors.primary,
                    backgroundColor: themeColors.primaryLight,
                  },
                ]}
              >
                <View
                  style={[
                    styles.pointDot,
                    {
                      backgroundColor: isSelected ? themeColors.primary : themeColors.textMuted,
                      transform: [{ scale: isSelected ? 1.25 : 1 }],
                    },
                  ]}
                />
                <Text
                  numberOfLines={1}
                  style={[
                    styles.pointLabel,
                    {
                      color: isSelected ? themeColors.primary : themeColors.textSecondary,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {pt.labelFr || pt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Active Point Detail Box */}
      {activePoint && (
        <View
          style={[
            styles.detailBox,
            {
              backgroundColor: themeColors.surfaceSubtle,
              borderColor: isDark ? 'rgba(255,255,255,0.08)' : themeColors.cardBorder,
            },
          ]}
        >
          <View style={styles.detailHeader}>
            <View style={styles.detailBadge}>
              <CheckCircle size={14} color={themeColors.accent} />
              <Text style={[styles.detailBadgeText, { color: themeColors.accent }]}>
                {activePoint.labelFr}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => playAudio(activePoint.exampleEn)}
              style={[styles.audioButton, { backgroundColor: themeColors.primary }]}
            >
              <Volume2 size={15} color="#FFFFFF" />
              <Text style={styles.audioButtonText}>Écouter</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.exampleEn, { color: themeColors.textPrimary }]}>
            {`"${activePoint.exampleEn}"`}
          </Text>
          <Text style={[styles.exampleFr, { color: themeColors.textSecondary }]}>
            {activePoint.exampleFr}
          </Text>
          {activePoint.exampleDari ? (
            <Text style={[styles.exampleDari, { color: themeColors.textMuted }]}>
              {activePoint.exampleDari}
            </Text>
          ) : null}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  descriptionDari: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'right',
    marginBottom: 12,
  },
  trackContainer: {
    marginVertical: 14,
    paddingVertical: 8,
    position: 'relative',
  },
  trackLine: {
    position: 'absolute',
    left: 8,
    right: 8,
    top: 22,
    height: 3,
    borderRadius: 2,
  },
  timelineAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  axisLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  nowPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  nowLabel: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  pointsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  pointButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  pointDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 6,
  },
  pointLabel: {
    fontSize: 11.5,
    textAlign: 'center',
  },
  detailBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginTop: 10,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  detailBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  audioButtonText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700',
  },
  exampleEn: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
    fontStyle: 'italic',
  },
  exampleFr: {
    fontSize: 13.5,
    lineHeight: 18,
    marginBottom: 2,
  },
  exampleDari: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'right',
  },
});
