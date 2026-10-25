import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Level } from '../../types/phrase';
import { useApp } from '../../context/AppContext';

interface BadgeProps {
  level: Level;
  size?: 'sm' | 'md';
}

export const LevelBadge: React.FC<BadgeProps> = ({ level, size = 'sm' }) => {
  const { isDark } = useApp();

  const getColors = () => {
    switch (level) {
      case 'A1':
        return {
          bg: isDark ? '#064E3B' : '#DCFCE7',
          text: isDark ? '#34D399' : '#15803D',
          border: isDark ? '#059669' : '#86EFAC',
          label: 'A1 Débutant',
        };
      case 'A2':
        return {
          bg: isDark ? '#082F49' : '#E0F2FE',
          text: isDark ? '#38BDF8' : '#0369A1',
          border: isDark ? '#0284C7' : '#7DD3FC',
          label: 'A2 Élémentaire',
        };
      case 'B1':
        return {
          bg: isDark ? '#2E1065' : '#F3E8FF',
          text: isDark ? '#C084FC' : '#7E22CE',
          border: isDark ? '#7E22CE' : '#D8B4FE',
          label: 'B1 Intermédiaire',
        };
    }
  };

  const styleConfig = getColors();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: styleConfig.bg,
          borderColor: styleConfig.border,
          paddingVertical: size === 'sm' ? 2 : 4,
          paddingHorizontal: size === 'sm' ? 8 : 12,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: styleConfig.text,
            fontSize: size === 'sm' ? 11 : 13,
          },
        ]}
      >
        {styleConfig.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
