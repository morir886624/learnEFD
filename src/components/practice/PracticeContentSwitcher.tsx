import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useApp } from '../../context/AppContext';
import { ContentSource } from './types';

interface PracticeContentSwitcherProps {
  activeSource: ContentSource;
  onChangeSource: (src: ContentSource) => void;
  phrasesCount: number;
  vocabFrCount: number;
  vocabEnCount: number;
}

export const PracticeContentSwitcher: React.FC<PracticeContentSwitcherProps> = ({
  activeSource,
  onChangeSource,
  phrasesCount,
  vocabFrCount,
  vocabEnCount,
}) => {
  const { themeColors } = useApp();

  const handleSelect = (src: ContentSource) => {
    if (src === activeSource) return;
    try {
      Haptics.selectionAsync();
    } catch {
      // Ignore
    }
    onChangeSource(src);
  };

  const sources: { id: ContentSource; flag: string; title: string; count: number; accent: string }[] = [
    {
      id: 'phrases',
      flag: '💬',
      title: 'Phrases',
      count: phrasesCount,
      accent: themeColors.primary,
    },
    {
      id: 'vocab-fr',
      flag: '🇫🇷',
      title: 'Vocab FR',
      count: vocabFrCount,
      accent: themeColors.frAccent,
    },
    {
      id: 'vocab-en',
      flag: '🇬🇧',
      title: 'Vocab EN',
      count: vocabEnCount,
      accent: themeColors.enAccent,
    },
  ];

  return (
    <View style={styles.container}>
      {sources.map((item) => {
        const isSelected = activeSource === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.85}
            onPress={() => handleSelect(item.id)}
            style={[
              styles.pill,
              {
                backgroundColor: isSelected ? themeColors.surface : themeColors.surfaceSubtle,
                borderColor: isSelected ? item.accent : themeColors.cardBorder,
              },
              isSelected && styles.pillActive,
            ]}
          >
            <Text style={styles.flag}>{item.flag}</Text>
            <Text
              style={[
                styles.title,
                {
                  color: isSelected ? item.accent : themeColors.textSecondary,
                  fontWeight: isSelected ? '800' : '600',
                },
              ]}
            >
              {item.title}
            </Text>
            <View
              style={[
                styles.countBadge,
                {
                  backgroundColor: isSelected ? `${item.accent}15` : themeColors.surface,
                },
              ]}
            >
              <Text
                style={[
                  styles.countText,
                  {
                    color: isSelected ? item.accent : themeColors.textMuted,
                  },
                ]}
              >
                {item.count}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  pillActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  flag: {
    fontSize: 14,
  },
  title: {
    fontSize: 12,
  },
  countBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
  },
  countText: {
    fontSize: 10,
    fontWeight: '700',
  },
});

