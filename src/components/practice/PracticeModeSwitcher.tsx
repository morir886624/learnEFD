import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BookOpen, Layers, Award } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useApp } from '../../context/AppContext';
import { PracticeMode } from './types';

interface PracticeModeSwitcherProps {
  activeMode: PracticeMode;
  onChangeMode: (mode: PracticeMode) => void;
}

export const PracticeModeSwitcher: React.FC<PracticeModeSwitcherProps> = ({
  activeMode,
  onChangeMode,
}) => {
  const { themeColors } = useApp();

  const handleSelect = (mode: PracticeMode) => {
    if (mode === activeMode) return;
    try {
      Haptics.selectionAsync();
    } catch {
      // Ignore
    }
    onChangeMode(mode);
  };

  const tabs: { id: PracticeMode; label: string; icon: React.ReactNode }[] = [
    {
      id: 'explorer',
      label: 'Explorer',
      icon: (
        <BookOpen
          size={16}
          color={activeMode === 'explorer' ? '#FFFFFF' : themeColors.textSecondary}
        />
      ),
    },
    {
      id: 'flashcards',
      label: 'Flashcards 3D',
      icon: (
        <Layers
          size={16}
          color={activeMode === 'flashcards' ? '#FFFFFF' : themeColors.textSecondary}
        />
      ),
    },
    {
      id: 'quiz',
      label: 'Quiz & Tests',
      icon: (
        <Award
          size={16}
          color={activeMode === 'quiz' ? '#FFFFFF' : themeColors.textSecondary}
        />
      ),
    },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: themeColors.surfaceSubtle,
          borderColor: themeColors.cardBorder,
        },
      ]}
    >
      {tabs.map((tab) => {
        const isActive = activeMode === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            activeOpacity={0.85}
            onPress={() => handleSelect(tab.id)}
            style={[
              styles.tab,
              isActive && [
                styles.tabActive,
                { backgroundColor: themeColors.primary },
              ],
            ]}
          >
            {tab.icon}
            <Text
              style={[
                styles.tabLabel,
                {
                  color: isActive ? '#FFFFFF' : themeColors.textSecondary,
                  fontWeight: isActive ? '800' : '600',
                },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 3,
    gap: 4,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 6,
    borderRadius: 11,
  },
  tabActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  tabLabel: {
    fontSize: 12.5,
    letterSpacing: -0.2,
  },
});

