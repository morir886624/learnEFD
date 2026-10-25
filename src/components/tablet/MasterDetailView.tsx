import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Phrase } from '../../types/phrase';
import { useApp } from '../../context/AppContext';
import { PhraseCard } from '../phrases/PhraseCard';
import { LevelBadge } from '../common/Badge';

interface MasterDetailViewProps {
  phrases: Phrase[];
  selectedPhrase: Phrase | null;
  onSelectPhrase: (phrase: Phrase) => void;
}

export const MasterDetailView: React.FC<MasterDetailViewProps> = ({
  phrases,
  selectedPhrase,
  onSelectPhrase,
}) => {
  const { themeColors, favorites } = useApp();

  return (
    <View style={styles.container}>
      {/* LEFT COLUMN: List */}
      <View
        style={[
          styles.leftColumn,
          {
            backgroundColor: themeColors.surface,
            borderColor: themeColors.cardBorder,
          },
        ]}
      >
        <Text style={[styles.columnHeader, { color: themeColors.textMuted }]}>
          PHRASES DISPONIBLES ({phrases.length})
        </Text>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
          {phrases.map((item) => {
            const isSelected = selectedPhrase?.id === item.id;
            const isFav = favorites.includes(item.id);

            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => onSelectPhrase(item)}
                activeOpacity={0.7}
                style={[
                  styles.listItem,
                  {
                    backgroundColor: isSelected
                      ? themeColors.primaryLight
                      : themeColors.surfaceSubtle,
                    borderColor: isSelected ? themeColors.primary : themeColors.cardBorder,
                  },
                ]}
              >
                <View style={styles.listTopRow}>
                  <LevelBadge level={item.level} size="sm" />
                  {isFav && <Text style={{ fontSize: 13 }}>❤️</Text>}
                </View>
                <Text
                  numberOfLines={2}
                  style={[
                    styles.itemFr,
                    {
                      color: isSelected ? themeColors.primaryDark : themeColors.textPrimary,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {item.fr}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[styles.itemDari, { color: themeColors.textSecondary }]}
                >
                  {item.dari}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* RIGHT COLUMN: Detail View */}
      <View style={styles.rightColumn}>
        {selectedPhrase ? (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 8 }}>
            <Text style={[styles.columnHeader, { color: themeColors.textMuted }]}>
              FICHE DÉTAILLÉE DE RÉVISION
            </Text>
            <PhraseCard phrase={selectedPhrase} />
          </ScrollView>
        ) : (
          <View style={styles.emptyDetail}>
            <Text style={[styles.emptyText, { color: themeColors.textMuted }]}>
              {"Sélectionnez une phrase dans la colonne de gauche pour l'étudier en détail."}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    gap: 16,
  },
  leftColumn: {
    width: 340,
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
  },
  rightColumn: {
    flex: 1,
  },
  columnHeader: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  listContent: {
    gap: 8,
    paddingBottom: 20,
  },
  listItem: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  listTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemFr: {
    fontSize: 14,
    lineHeight: 19,
    marginBottom: 4,
  },
  itemDari: {
    fontSize: 14,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  emptyDetail: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});
