import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ChevronDown, ChevronUp, Table, Info } from 'lucide-react-native';
import { AzarChart } from '../../types/grammar';
import { useApp } from '../../context/AppContext';

interface AzarFormulaChartProps {
  chart: AzarChart;
}

export const AzarFormulaChart: React.FC<AzarFormulaChartProps> = ({ chart }) => {
  const { themeColors, isDark } = useApp();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

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
      {/* Header with toggle */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setIsExpanded(!isExpanded)}
        style={styles.header}
      >
        <View style={styles.titleGroup}>
          <View style={[styles.badge, { backgroundColor: '#E0E7FF' }]}>
            <Table size={14} color="#3730A3" />
            <Text style={styles.badgeText}>TABLEAU SYNTAXIQUE (AZAR)</Text>
          </View>
          <Text style={[styles.title, { color: themeColors.textPrimary }]}>
            {chart.titleFr || chart.title}
          </Text>
        </View>
        <View style={[styles.toggleIconCircle, { backgroundColor: themeColors.surfaceSubtle }]}>
          {isExpanded ? (
            <ChevronUp size={18} color={themeColors.textSecondary} />
          ) : (
            <ChevronDown size={18} color={themeColors.textSecondary} />
          )}
        </View>
      </TouchableOpacity>

      {/* Collapsible Chart Table */}
      {isExpanded && (
        <View style={styles.tableWrapper}>
          {/* Table Headers */}
          <View style={[styles.tableHeaderRow, { backgroundColor: themeColors.surfaceSubtle }]}>
            <Text style={[styles.colHeader, styles.col1, { color: themeColors.textPrimary }]}>
              {chart.headers[0]}
            </Text>
            <Text style={[styles.colHeader, styles.col2, { color: themeColors.textPrimary }]}>
              {chart.headers[1]}
            </Text>
            {chart.headers[2] ? (
              <Text style={[styles.colHeader, styles.col3, { color: themeColors.textPrimary }]}>
                {chart.headers[2]}
              </Text>
            ) : null}
          </View>

          {/* Table Rows */}
          {chart.rows.map((row, index) => (
            <View
              key={index}
              style={[
                styles.tableRow,
                {
                  borderBottomColor: isDark ? 'rgba(255,255,255,0.06)' : '#E2E8F0',
                  backgroundColor:
                    index % 2 === 0
                      ? isDark
                        ? 'rgba(255,255,255,0.02)'
                        : '#FAFAFA'
                      : 'transparent',
                },
              ]}
            >
              <View style={styles.col1}>
                <Text style={[styles.cellTextBold, { color: themeColors.primary }]}>
                  {row.col1}
                </Text>
              </View>

              <View style={styles.col2}>
                <Text style={[styles.cellTextCode, { color: themeColors.textPrimary }]}>
                  {row.col2}
                </Text>
                {row.notes && (
                  <Text style={[styles.cellNotes, { color: themeColors.textSecondary }]}>
                    {row.notes}
                  </Text>
                )}
                {row.notesFr && (
                  <View style={styles.noteFrRow}>
                    <Info size={11} color={themeColors.textMuted} />
                    <Text style={[styles.cellNotesFr, { color: themeColors.textMuted }]}>
                      {row.notesFr}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleGroup: {
    flex: 1,
    paddingRight: 10,
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#3730A3',
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
  },
  toggleIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableWrapper: {
    marginTop: 12,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  colHeader: {
    fontSize: 11.5,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
  },
  col1: {
    flex: 1,
    paddingRight: 8,
  },
  col2: {
    flex: 2,
  },
  col3: {
    flex: 1,
  },
  cellTextBold: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  cellTextCode: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  cellNotes: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 3,
    lineHeight: 16,
  },
  noteFrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  cellNotesFr: {
    fontSize: 11.5,
    lineHeight: 15,
  },
});

