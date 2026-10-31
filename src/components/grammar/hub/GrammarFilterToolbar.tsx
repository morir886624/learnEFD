import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Search, X, ChevronsDown, ChevronsUp } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useApp } from '../../../context/AppContext';
import { GrammarLevel } from '../../../types/grammar';
import { LEVEL_COLORS, LEVEL_LABELS } from './types';

interface GrammarFilterToolbarProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  placeholder: string;
  selectedLevel: GrammarLevel | 'ALL';
  onSelectLevel: (lvl: GrammarLevel | 'ALL') => void;
  levelCounts: Record<GrammarLevel | 'ALL', number>;
  allExpanded: boolean;
  onToggleExpandAll: () => void;
  isSearchingOrFiltered: boolean;
  totalFilteredCount?: number;
  onResetFilters?: () => void;
}

export const GrammarFilterToolbar: React.FC<GrammarFilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  placeholder,
  selectedLevel,
  onSelectLevel,
  levelCounts,
  allExpanded,
  onToggleExpandAll,
  isSearchingOrFiltered,
  totalFilteredCount,
  onResetFilters,
}) => {
  const { themeColors } = useApp();

  const handleLevelSelect = (lvl: GrammarLevel | 'ALL') => {
    try {
      Haptics.selectionAsync();
    } catch {
      // Ignore
    }
    onSelectLevel(lvl);
  };

  const levelOptions: { id: GrammarLevel | 'ALL'; label: string; color?: string }[] = [
    { id: 'ALL', label: 'Tous Niveaux' },
    { id: 'A1', label: LEVEL_LABELS.A1, color: LEVEL_COLORS.A1 },
    { id: 'A2', label: LEVEL_LABELS.A2, color: LEVEL_COLORS.A2 },
    { id: 'B1', label: LEVEL_LABELS.B1, color: LEVEL_COLORS.B1 },
    { id: 'B2', label: LEVEL_LABELS.B2, color: LEVEL_COLORS.B2 },
  ];

  return (
    <View style={styles.container}>
      {/* SEARCH BAR */}
      <View
        style={[
          styles.searchBar,
          {
            backgroundColor: themeColors.surface,
            borderColor: themeColors.cardBorder,
          },
        ]}
      >
        <Search size={18} color={themeColors.textMuted} />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={themeColors.textMuted}
          value={searchQuery}
          onChangeText={onSearchChange}
          style={[styles.searchInput, { color: themeColors.textPrimary }]}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => onSearchChange('')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.clearBtn}
          >
            <X size={15} color={themeColors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* CONTROLS ROW: LEVEL TABS & EXPAND ALL BUTTON */}
      <View style={styles.controlsRow}>
        {/* LEVEL TABS SCROLLER */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.levelTabsTrack}
        >
          {levelOptions.map((opt) => {
            const isSelected = selectedLevel === opt.id;
            const count = levelCounts[opt.id] || 0;

            return (
              <TouchableOpacity
                key={opt.id}
                activeOpacity={0.8}
                onPress={() => handleLevelSelect(opt.id)}
                style={[
                  styles.levelTab,
                  {
                    backgroundColor: isSelected
                      ? themeColors.primary
                      : themeColors.surface,
                    borderColor: isSelected
                      ? themeColors.primary
                      : themeColors.cardBorder,
                  },
                ]}
              >
                {opt.color && (
                  <View
                    style={[
                      styles.colorDot,
                      {
                        backgroundColor: isSelected ? '#FFFFFF' : opt.color,
                      },
                    ]}
                  />
                )}
                <Text
                  style={[
                    styles.levelTabText,
                    {
                      color: isSelected ? '#FFFFFF' : themeColors.textSecondary,
                      fontWeight: isSelected ? '800' : '600',
                    },
                  ]}
                >
                  {opt.label}
                </Text>
                <Text
                  style={[
                    styles.levelCountBadge,
                    {
                      color: isSelected
                        ? 'rgba(255,255,255,0.85)'
                        : themeColors.textMuted,
                    },
                  ]}
                >
                  ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* EXPAND ALL / COLLAPSE ALL TOGGLE (VISIBLE WHEN BROWSING MODULES) */}
        {!isSearchingOrFiltered && (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={onToggleExpandAll}
            style={[
              styles.expandToggleBtn,
              {
                backgroundColor: themeColors.surfaceSubtle,
                borderColor: themeColors.cardBorder,
              },
            ]}
          >
            {allExpanded ? (
              <ChevronsUp size={15} color={themeColors.textSecondary} />
            ) : (
              <ChevronsDown size={15} color={themeColors.textSecondary} />
            )}
            <Text
              style={[
                styles.expandToggleText,
                { color: themeColors.textSecondary },
              ]}
            >
              {allExpanded ? 'Tout replier' : 'Tout déplier'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* FILTER ACTIVE HEADER INFO (IF SEARCHING OR FILTERING) */}
      {isSearchingOrFiltered && (
        <View style={styles.resultsHeader}>
          <Text
            style={[styles.resultsCountText, { color: themeColors.textPrimary }]}
          >
            {totalFilteredCount} {totalFilteredCount === 1 ? 'unité trouvée' : 'unités trouvées'}
            {selectedLevel !== 'ALL' && ` • Niveau ${selectedLevel}`}
            {searchQuery.trim().length > 0 && ` • « ${searchQuery} »`}
          </Text>
          {onResetFilters && (
            <TouchableOpacity onPress={onResetFilters}>
              <Text
                style={[
                  styles.resetFilterText,
                  { color: themeColors.primary },
                ]}
              >
                Réinitialiser
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  clearBtn: {
    padding: 2,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  levelTabsTrack: {
    flexDirection: 'row',
    gap: 6,
    paddingRight: 8,
  },
  levelTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  colorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  levelTabText: {
    fontSize: 12,
  },
  levelCountBadge: {
    fontSize: 11,
    fontWeight: '700',
  },
  expandToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  expandToggleText: {
    fontSize: 11,
    fontWeight: '700',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 2,
  },
  resultsCountText: {
    fontSize: 13,
    fontWeight: '800',
  },
  resetFilterText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
});
