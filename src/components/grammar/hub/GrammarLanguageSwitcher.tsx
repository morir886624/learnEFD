import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useApp } from '../../../context/AppContext';
import { GrammarLanguage } from './types';

interface GrammarLanguageSwitcherProps {
  activeLanguage: GrammarLanguage;
  onSelectLanguage: (lang: GrammarLanguage) => void;
  frenchCount: number;
  frenchTotal: number;
  englishCount: number;
  englishTotal: number;
}

export const GrammarLanguageSwitcher: React.FC<GrammarLanguageSwitcherProps> = ({
  activeLanguage,
  onSelectLanguage,
  frenchCount,
  frenchTotal,
  englishCount,
  englishTotal,
}) => {
  const { themeColors } = useApp();

  const frenchPercent = frenchTotal > 0 ? Math.round((frenchCount / frenchTotal) * 100) : 0;
  const englishPercent = englishTotal > 0 ? Math.round((englishCount / englishTotal) * 100) : 0;

  const handleSelect = (lang: GrammarLanguage) => {
    if (lang === activeLanguage) return;
    try {
      Haptics.selectionAsync();
    } catch {
      // Ignore
    }
    onSelectLanguage(lang);
  };

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
      {/* FRENCH TAB */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => handleSelect('fr')}
        style={[
          styles.tab,
          activeLanguage === 'fr' && [
            styles.tabActive,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.frAccent,
            },
          ],
        ]}
      >
        <Text style={styles.flagEmoji}>🇫🇷</Text>
        <View style={styles.tabContent}>
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.tabTitle,
                {
                  color:
                    activeLanguage === 'fr'
                      ? themeColors.frAccent
                      : themeColors.textPrimary,
                },
              ]}
            >
              Français
            </Text>
            {frenchPercent > 0 && (
              <View
                style={[
                  styles.percentBadge,
                  { backgroundColor: `${themeColors.frAccent}18` },
                ]}
              >
                <Text
                  style={[styles.percentBadgeText, { color: themeColors.frAccent }]}
                >
                  {frenchPercent}%
                </Text>
              </View>
            )}
          </View>
          <Text style={[styles.tabSub, { color: themeColors.textMuted }]}>
            {frenchTotal} unités • Heminway
          </Text>
        </View>
      </TouchableOpacity>

      {/* ENGLISH TAB */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => handleSelect('en')}
        style={[
          styles.tab,
          activeLanguage === 'en' && [
            styles.tabActive,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.enAccent,
            },
          ],
        ]}
      >
        <Text style={styles.flagEmoji}>🇬🇧</Text>
        <View style={styles.tabContent}>
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.tabTitle,
                {
                  color:
                    activeLanguage === 'en'
                      ? themeColors.enAccent
                      : themeColors.textPrimary,
                },
              ]}
            >
              English
            </Text>
            {englishPercent > 0 && (
              <View
                style={[
                  styles.percentBadge,
                  { backgroundColor: `${themeColors.enAccent}18` },
                ]}
              >
                <Text
                  style={[styles.percentBadgeText, { color: themeColors.enAccent }]}
                >
                  {englishPercent}%
                </Text>
              </View>
            )}
          </View>
          <Text style={[styles.tabSub, { color: themeColors.textMuted }]}>
            {englishTotal} unités • Murphy & Azar
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    padding: 4,
    gap: 6,
    marginBottom: 14,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
    gap: 10,
  },
  tabActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  flagEmoji: {
    fontSize: 24,
  },
  tabContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabTitle: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  percentBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 8,
  },
  percentBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  tabSub: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
});

