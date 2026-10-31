import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Search,
  Volume2,
  Sparkles,
  BookOpen,
  X,
  Info,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useApp } from '../../context/AppContext';
import { FRENCH_VERB_TABLES } from '../../data/frenchGrammar';
import {
  FrenchVerbConjugationTable,
  FrenchVerbTenseKey,
} from '../../types/frenchGrammar';
import { SpeechService } from '../../services/speech';

const TENSE_TABS: { key: FrenchVerbTenseKey; labelFr: string; labelEn: string }[] = [
  { key: 'present', labelFr: 'Présent', labelEn: 'Present' },
  { key: 'passeCompose', labelFr: 'Passé Composé', labelEn: 'Compound Past' },
  { key: 'imparfait', labelFr: 'Imparfait', labelEn: 'Imperfect' },
  { key: 'futurSimple', labelFr: 'Futur Simple', labelEn: 'Future' },
  { key: 'conditionnel', labelFr: 'Conditionnel', labelEn: 'Conditional' },
  { key: 'subjonctif', labelFr: 'Subjonctif', labelEn: 'Subjunctive' },
  { key: 'imperatif', labelFr: 'Impératif', labelEn: 'Imperative' },
];

const GROUP_FILTERS: { id: string; label: string }[] = [
  { id: 'ALL', label: 'Tous (19)' },
  { id: '1er', label: '1er Groupe (-er)' },
  { id: '2e', label: '2e Groupe (-ir)' },
  { id: '3e', label: '3e Groupe (Irréguliers)' },
];

const PRONOUN_LABELS = [
  '1re pers. sing.',
  '2e pers. sing.',
  '3e pers. sing.',
  '1re pers. plur.',
  '2e pers. plur.',
  '3e pers. plur.',
];

export const FrenchVerbConjugator: React.FC = () => {
  const { themeColors, isDark } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [selectedVerbId, setSelectedVerbId] = useState<string>(
    FRENCH_VERB_TABLES[0]?.id || 'verb-etre'
  );
  const [selectedTense, setSelectedTense] = useState<FrenchVerbTenseKey>('present');

  const filteredVerbs = useMemo(() => {
    return FRENCH_VERB_TABLES.filter((v) => {
      if (selectedGroup === '1er' && !v.group.startsWith('1er')) return false;
      if (selectedGroup === '2e' && !v.group.startsWith('2e')) return false;
      if (selectedGroup === '3e' && !v.group.startsWith('3e')) return false;

      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        return (
          v.infinitive.toLowerCase().includes(q) ||
          v.meaningEn.toLowerCase().includes(q) ||
          v.meaningDari.includes(q) ||
          v.pastParticiple.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [searchQuery, selectedGroup]);

  const activeVerb: FrenchVerbConjugationTable = useMemo(() => {
    return (
      filteredVerbs.find((v) => v.id === selectedVerbId) ||
      filteredVerbs[0] ||
      FRENCH_VERB_TABLES[0]
    );
  }, [filteredVerbs, selectedVerbId]);

  const speakFrench = (text: string) => {
    const cleanText = text.replace(/\([^)]*\)/g, '').trim();
    if (!cleanText || cleanText === '—') return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Ignore
    }
    SpeechService.speak(cleanText, 'fr');
  };

  const handleSelectVerb = (verbId: string) => {
    try {
      Haptics.selectionAsync();
    } catch {
      // Ignore
    }
    setSelectedVerbId(verbId);
  };

  const handleSelectTense = (tense: FrenchVerbTenseKey) => {
    try {
      Haptics.selectionAsync();
    } catch {
      // Ignore
    }
    setSelectedTense(tense);
  };

  const currentForms = activeVerb?.tenses[selectedTense] || [];
  const activeTenseInfo = TENSE_TABS.find((t) => t.key === selectedTense);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
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
          placeholder="Rechercher un verbe (être, aller, pouvoir, savoir...)"
          placeholderTextColor={themeColors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={[styles.searchInput, { color: themeColors.textPrimary }]}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <X size={16} color={themeColors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Group Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.groupFilterRow}
      >
        {GROUP_FILTERS.map((gf) => {
          const isSelected = selectedGroup === gf.id;
          return (
            <TouchableOpacity
              key={gf.id}
              activeOpacity={0.8}
              onPress={() => setSelectedGroup(gf.id)}
              style={[
                styles.groupChip,
                {
                  backgroundColor: isSelected
                    ? themeColors.primaryLight
                    : themeColors.surfaceSubtle,
                  borderColor: isSelected ? themeColors.primary : 'transparent',
                },
              ]}
            >
              <Text
                style={[
                  styles.groupChipText,
                  {
                    color: isSelected ? themeColors.primary : themeColors.textSecondary,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}
              >
                {gf.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Horizontal Verb Selector Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.verbListScroll}
      >
        {filteredVerbs.map((verb) => {
          const isSelected = verb.id === activeVerb?.id;
          return (
            <TouchableOpacity
              key={verb.id}
              activeOpacity={0.85}
              onPress={() => handleSelectVerb(verb.id)}
              style={[
                styles.verbPill,
                {
                  backgroundColor: isSelected ? themeColors.primary : themeColors.surface,
                  borderColor: isSelected ? themeColors.primary : themeColors.cardBorder,
                },
              ]}
            >
              <Text
                style={[
                  styles.verbPillTitle,
                  { color: isSelected ? '#FFFFFF' : themeColors.textPrimary },
                ]}
              >
                {verb.infinitive}
              </Text>
              <Text
                style={[
                  styles.verbPillSub,
                  {
                    color: isSelected
                      ? 'rgba(255,255,255,0.85)'
                      : themeColors.textSecondary,
                  },
                ]}
              >
                {verb.meaningEn}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Active Verb Master Card */}
      {activeVerb && (
        <View
          style={[
            styles.verbCard,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.cardBorder,
            },
          ]}
        >
          {/* Verb Header */}
          <View style={styles.verbHeader}>
            <View style={{ flex: 1 }}>
              <View style={styles.badgesRow}>
                <View style={[styles.groupBadge, { backgroundColor: themeColors.primaryLight }]}>
                  <Text style={[styles.groupBadgeText, { color: themeColors.primary }]}>
                    {activeVerb.group}
                  </Text>
                </View>
                <View
                  style={[
                    styles.auxBadge,
                    {
                      backgroundColor:
                        activeVerb.auxiliary === 'être' ? '#FCE7F3' : '#E0F2FE',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.auxBadgeText,
                      {
                        color: activeVerb.auxiliary === 'être' ? '#BE185D' : '#0284C7',
                      },
                    ]}
                  >
                    Auxiliaire : {activeVerb.auxiliary.toUpperCase()}
                  </Text>
                </View>
                <View style={[styles.ppBadge, { backgroundColor: themeColors.surfaceSubtle }]}>
                  <Text style={[styles.ppBadgeText, { color: themeColors.textSecondary }]}>
                    P.P. : {activeVerb.pastParticiple}
                  </Text>
                </View>
              </View>

              <View style={styles.verbTitleRow}>
                <Text style={[styles.verbInfinitive, { color: themeColors.textPrimary }]}>
                  {activeVerb.infinitive}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => speakFrench(activeVerb.infinitive)}
                  style={[styles.speakIconBtn, { backgroundColor: themeColors.primary }]}
                >
                  <Volume2 size={16} color="#FFFFFF" />
                  <Text style={styles.speakIconBtnText}>Prononcer</Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.verbMeanings, { color: themeColors.textSecondary }]}>
                🇬🇧 {activeVerb.meaningEn} • 🇦🇫 {activeVerb.meaningDari}
              </Text>
            </View>
          </View>

          {/* Pedagogical Note */}
          <View
            style={[
              styles.noteBanner,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC',
                borderColor: themeColors.cardBorder,
              },
            ]}
          >
            <Info size={15} color={themeColors.primary} />
            <Text style={[styles.noteBannerText, { color: themeColors.textSecondary }]}>
              {activeVerb.noteFr}
            </Text>
          </View>

          {/* 7 Tenses Selector Bar */}
          <Text style={[styles.tenseSectionLabel, { color: themeColors.textMuted }]}>
            CHOISISSEZ UN TEMPS OU UN MODE (7 TEMPS CLÉS) :
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tenseTabsRow}
          >
            {TENSE_TABS.map((tab) => {
              const isSelected = selectedTense === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  activeOpacity={0.8}
                  onPress={() => handleSelectTense(tab.key)}
                  style={[
                    styles.tenseTab,
                    {
                      backgroundColor: isSelected
                        ? themeColors.primary
                        : themeColors.surfaceSubtle,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tenseTabFr,
                      { color: isSelected ? '#FFFFFF' : themeColors.textPrimary },
                    ]}
                  >
                    {tab.labelFr}
                  </Text>
                  <Text
                    style={[
                      styles.tenseTabEn,
                      {
                        color: isSelected
                          ? 'rgba(255,255,255,0.8)'
                          : themeColors.textMuted,
                      },
                    ]}
                  >
                    {tab.labelEn}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Conjugation Rows Table */}
          <View
            style={[
              styles.tableBox,
              {
                borderColor: themeColors.cardBorder,
                backgroundColor: themeColors.surfaceSubtle,
              },
            ]}
          >
            <View
              style={[
                styles.tableHeaderBar,
                {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#EEF2FF',
                  borderBottomColor: themeColors.cardBorder,
                },
              ]}
            >
              <View style={styles.tableHeaderLeft}>
                <Sparkles size={14} color={themeColors.primary} />
                <Text style={[styles.tableHeaderTitle, { color: themeColors.primary }]}>
                  {activeVerb.infinitive.toUpperCase()} — {activeTenseInfo?.labelFr.toUpperCase()}
                </Text>
              </View>
              <Text style={[styles.tapAudioHint, { color: themeColors.textMuted }]}>
                Touchez une ligne pour écouter 🔊
              </Text>
            </View>

            {currentForms.map((form, idx) => {
              const isDash = form === '—';
              return (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={isDash ? 1 : 0.75}
                  disabled={isDash}
                  onPress={() => speakFrench(form)}
                  style={[
                    styles.conjRow,
                    {
                      backgroundColor:
                        idx % 2 === 0 ? themeColors.surface : 'transparent',
                      borderBottomColor:
                        idx < currentForms.length - 1
                          ? themeColors.cardBorder
                          : 'transparent',
                    },
                  ]}
                >
                  <Text style={[styles.personLabel, { color: themeColors.textMuted }]}>
                    {PRONOUN_LABELS[idx] || `Ligne ${idx + 1}`}
                  </Text>
                  <Text
                    style={[
                      styles.conjFormText,
                      {
                        color: isDash ? themeColors.textMuted : themeColors.textPrimary,
                      },
                    ]}
                  >
                    {form}
                  </Text>
                  {!isDash && (
                    <View
                      style={[
                        styles.rowAudioCircle,
                        { backgroundColor: themeColors.primaryLight },
                      ]}
                    >
                      <Volume2 size={14} color={themeColors.primary} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.sourceFooter}>
            <BookOpen size={13} color={themeColors.textMuted} />
            <Text style={[styles.sourceFooterText, { color: themeColors.textMuted }]}>
              Source : Annie Heminway — Complete French Grammar (Verb Tables) & Complete French All-in-One
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 12,
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
  groupFilterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  groupChip: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  groupChipText: {
    fontSize: 12,
  },
  verbListScroll: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  verbPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 100,
    alignItems: 'center',
  },
  verbPillTitle: {
    fontSize: 14.5,
    fontWeight: '800',
  },
  verbPillSub: {
    fontSize: 11,
    marginTop: 1,
  },
  verbCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  verbHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  groupBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  groupBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  auxBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  auxBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  ppBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ppBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  verbTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  verbInfinitive: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  speakIconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  speakIconBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  verbMeanings: {
    fontSize: 13.5,
    fontWeight: '600',
  },
  noteBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 14,
  },
  noteBannerText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
  },
  tenseSectionLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  tenseTabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  tenseTab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  tenseTabFr: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  tenseTabEn: {
    fontSize: 10.5,
    marginTop: 1,
  },
  tableBox: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  tableHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  tableHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tableHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  tapAudioHint: {
    fontSize: 11,
    fontWeight: '600',
  },
  conjRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderBottomWidth: 1,
  },
  personLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    width: 95,
  },
  conjFormText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
  },
  rowAudioCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sourceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  sourceFooterText: {
    flex: 1,
    fontSize: 11,
  },
});

