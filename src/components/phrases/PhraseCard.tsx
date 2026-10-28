import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Bookmark, Info } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Phrase } from '../../types/phrase';
import { useApp } from '../../context/AppContext';
import { LevelBadge } from '../common/Badge';
import { AudioButton } from './AudioButton';

interface PhraseCardProps {
  phrase: Phrase;
  onPress?: () => void;
  isCompact?: boolean;
}

export const PhraseCard: React.FC<PhraseCardProps> = ({ phrase, onPress, isCompact = false }) => {
  const { themeColors, favorites, toggleFavorite, settings, stats, fontSizeDelta } = useApp();
  const isFav = favorites.includes(phrase.id);
  const isMastered = stats.masteredPhraseIds.includes(phrase.id);

  const handleToggleFav = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Ignore
    }
    await toggleFavorite(phrase.id);
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: themeColors.surface,
          borderColor: isMastered ? themeColors.accent : themeColors.cardBorder,
        },
      ]}
    >
      {/* Top Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.badgeGroup}>
          <LevelBadge level={phrase.level} />
          {isMastered && (
            <View style={[styles.masteredPill, { backgroundColor: themeColors.accentLight }]}>
              <Text style={[styles.masteredText, { color: themeColors.accent }]}>✓ Maîtrisé</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={handleToggleFav}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.favBtn}
          accessibilityLabel={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Bookmark
            size={22}
            color={isFav ? '#E11D48' : themeColors.textMuted}
            fill={isFav ? '#E11D48' : 'transparent'}
          />
        </TouchableOpacity>
      </View>

      {/* Language 1: Français */}
      <View style={[styles.langBlock, { borderLeftColor: themeColors.frAccent }]}>
        <View style={styles.langHeader}>
          <View style={[styles.langTag, { backgroundColor: themeColors.frLight }]}>
            <Text style={[styles.langTagText, { color: themeColors.frAccent }]}>FRANÇAIS</Text>
          </View>
          <AudioButton text={phrase.fr} lang="fr" size={17} color={themeColors.frAccent} />
        </View>
        <Text style={[styles.mainText, { color: themeColors.textPrimary, fontSize: 16 + fontSizeDelta, lineHeight: 22 + fontSizeDelta }]}>
          {phrase.fr}
        </Text>
      </View>

      {/* Language 2: English */}
      <View style={[styles.langBlock, { borderLeftColor: themeColors.enAccent }]}>
        <View style={styles.langHeader}>
          <View style={[styles.langTag, { backgroundColor: themeColors.enLight }]}>
            <Text style={[styles.langTagText, { color: themeColors.enAccent }]}>ENGLISH</Text>
          </View>
          <AudioButton text={phrase.en} lang="en" size={17} color={themeColors.enAccent} />
        </View>
        <Text style={[styles.mainText, { color: themeColors.textPrimary, fontSize: 16 + fontSizeDelta, lineHeight: 22 + fontSizeDelta }]}>
          {phrase.en}
        </Text>
      </View>

      {/* Language 3: Dari (دری) */}
      <View
        style={[
          styles.dariBlock,
          {
            backgroundColor: themeColors.surfaceSubtle,
            borderColor: themeColors.dariAccent,
          },
        ]}
      >
        <View style={styles.dariTopBar}>
          <AudioButton text={phrase.dari} lang="dari" size={17} color={themeColors.dariAccent} />
          <View style={[styles.langTag, { backgroundColor: themeColors.dariLight }]}>
            <Text style={[styles.langTagText, { color: themeColors.dariAccent }]}>دری • DARI</Text>
          </View>
        </View>

        {/* Perso-Arabic text (RTL) */}
        <Text
          style={[
            styles.dariScript,
            { color: themeColors.textPrimary, fontSize: 21 + fontSizeDelta, lineHeight: 34 + fontSizeDelta },
          ]}
        >
          {phrase.dari}
        </Text>

        {/* Phonetic Pronunciation */}
        {settings.showPhonetics && phrase.dariPhonetic && (
          <View style={styles.phoneticContainer}>
            <Text style={[styles.phoneticLabel, { color: themeColors.textMuted }]}>
              Prononciation :
            </Text>
            <Text style={[styles.phoneticText, { color: themeColors.dariAccent, fontSize: 13 + fontSizeDelta }]}>
              {phrase.dariPhonetic}
            </Text>
          </View>
        )}
      </View>

      {/* Contextual Note / Grammar */}
      {!isCompact && phrase.literalOrNote && (
        <View style={[styles.noteRow, { backgroundColor: themeColors.surfaceSubtle }]}>
          <Info size={14} color={themeColors.textSecondary} style={{ marginRight: 6, marginTop: 2 }} />
          <Text style={[styles.noteText, { color: themeColors.textSecondary, fontSize: 12 + fontSizeDelta }]}>
            {phrase.literalOrNote}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  masteredPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  masteredText: {
    fontSize: 11,
    fontWeight: '700',
  },
  favBtn: {
    padding: 4,
  },
  langBlock: {
    borderLeftWidth: 3,
    paddingLeft: 10,
    marginBottom: 12,
  },
  langHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  langTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  langTagText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  mainText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
  },
  dariBlock: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  dariTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  dariScript: {
    fontSize: 21,
    lineHeight: 34,
    fontWeight: '600',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  phoneticContainer: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
  phoneticLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  phoneticText: {
    fontSize: 13,
    fontStyle: 'italic',
    fontWeight: '600',
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 8,
    borderRadius: 10,
    marginTop: 6,
  },
  noteText: {
    fontSize: 12,
    lineHeight: 17,
    flex: 1,
  },
});
