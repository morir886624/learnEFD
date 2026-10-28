import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  Palette,
  Check,
  Type,
  BookOpen,
  Volume2,
  Smartphone,
  ShieldCheck,
  Sparkles,
  ChevronRight,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useApp } from '../../context/AppContext';
import { useResponsive } from '../../hooks/useResponsive';
import { THEMES_LIST, ThemeMode } from '../../theme/colors';

export default function SettingsScreen() {
  const {
    themeColors,
    themeMode,
    setThemeMode,
    fontSizeDelta,
    setFontSizeDelta,
    settings,
    updateSettings,
  } = useApp();

  const { contentMaxWidth, isTablet } = useResponsive();

  const handleSelectTheme = async (mode: ThemeMode) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Ignore
    }
    await setThemeMode(mode);
  };

  const handleSelectFontSize = async (delta: number) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Ignore
    }
    await setFontSizeDelta(delta);
  };

  const handleTogglePhonetics = (value: boolean) => {
    updateSettings({ showPhonetics: value });
  };

  const handleSpeedSelect = (rate: number) => {
    updateSettings({ speechRate: rate });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: themeColors.textPrimary }]}>
            {"Paramètres & Modèles d'Interface"}
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            {"Personnalisez l'ambiance visuelle et le confort de lecture"}
          </Text>
        </View>

        {/* PROMINENT BOOK READER SHORTCUT */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/reader')}
          style={[
            styles.bookBanner,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.primary,
            },
          ]}
        >
          <View style={[styles.bookBannerIcon, { backgroundColor: themeColors.primaryLight }]}>
            <BookOpen size={24} color={themeColors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={[styles.bookBannerTitle, { color: themeColors.textPrimary }]}>
                Mode Lecture Livre
              </Text>
              <View style={[styles.tagNew, { backgroundColor: themeColors.primaryLight }]}>
                <Text style={[styles.tagNewText, { color: themeColors.primary }]}>IMMERSION</Text>
              </View>
            </View>
            <Text style={[styles.bookBannerSubtitle, { color: themeColors.textSecondary }]}>
              Affichage page par page avec confort livre papier
            </Text>
          </View>
          <ChevronRight size={22} color={themeColors.primary} />
        </TouchableOpacity>

        {/* SECTION 1: INTERFACE MODELS & READING THEMES */}
        <View style={styles.sectionTitleRow}>
          <Palette size={16} color={themeColors.primary} />
          <Text style={[styles.sectionHeader, { color: themeColors.textMuted }]}>
            {"MODÈLES D'INTERFACE & AMBIANCES DE LECTURE"}
          </Text>
        </View>

        <View style={styles.themesList}>
          {THEMES_LIST.map((th) => {
            const isSelected = themeMode === th.id;
            return (
              <TouchableOpacity
                key={th.id}
                activeOpacity={0.8}
                onPress={() => handleSelectTheme(th.id)}
                style={[
                  styles.themeCard,
                  {
                    backgroundColor: themeColors.surface,
                    borderColor: isSelected ? themeColors.primary : themeColors.cardBorder,
                    borderWidth: isSelected ? 2 : 1,
                  },
                ]}
              >
                {/* Theme Color Preview Swatch */}
                <View style={[styles.swatchPreview, { backgroundColor: th.previewBg, borderColor: th.previewColor }]}>
                  <View style={[styles.swatchBar, { backgroundColor: th.previewColor }]} />
                  <View style={[styles.swatchDot, { backgroundColor: th.previewColor }]} />
                </View>

                {/* Theme Info */}
                <View style={styles.themeInfoCol}>
                  <View style={styles.themeBadgeRow}>
                    <Text style={[styles.themeBadgeText, { color: themeColors.primary }]}>
                      {th.badge}
                    </Text>
                    {isSelected && (
                      <View style={[styles.selectedPill, { backgroundColor: themeColors.primaryLight }]}>
                        <Check size={12} color={themeColors.primary} />
                        <Text style={[styles.selectedPillText, { color: themeColors.primary }]}>
                          Actif
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text style={[styles.themeName, { color: themeColors.textPrimary }]}>
                    {th.name}
                  </Text>
                  <Text style={[styles.themeDesc, { color: themeColors.textSecondary }]}>
                    {th.description}
                  </Text>
                </View>

                {/* Radio selection circle */}
                <View
                  style={[
                    styles.radioCircle,
                    {
                      borderColor: isSelected ? themeColors.primary : themeColors.cardBorder,
                      backgroundColor: isSelected ? themeColors.primary : 'transparent',
                    },
                  ]}
                >
                  {isSelected && <Check size={14} color="#FFFFFF" />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* SECTION 2: FONT SIZE & READING COMFORT */}
        <View style={styles.sectionTitleRow}>
          <Type size={16} color={themeColors.primary} />
          <Text style={[styles.sectionHeader, { color: themeColors.textMuted }]}>
            CONFORT DE LECTURE & TAILLE DE POLICE
          </Text>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: themeColors.surface, borderColor: themeColors.cardBorder },
          ]}
        >
          <Text style={[styles.rowTitle, { color: themeColors.textPrimary }]}>
            Taille des caractères pour la lecture
          </Text>
          <Text style={[styles.rowSubtitle, { color: themeColors.textSecondary, marginBottom: 12 }]}>
            Ajustez la taille du texte pour les phrases françaises, anglaises et dari
          </Text>

          {/* Size Pills */}
          <View style={styles.fontSizeRow}>
            {[
              { label: 'Petite', delta: -2 },
              { label: 'Normale', delta: 0 },
              { label: 'Grande (A+)', delta: 2 },
              { label: 'Très grande (A++)', delta: 4 },
            ].map((sizeOpt) => {
              const isSelected = fontSizeDelta === sizeOpt.delta;
              return (
                <TouchableOpacity
                  key={sizeOpt.label}
                  activeOpacity={0.8}
                  onPress={() => handleSelectFontSize(sizeOpt.delta)}
                  style={[
                    styles.fontPill,
                    {
                      backgroundColor: isSelected ? themeColors.primary : themeColors.surfaceSubtle,
                      borderColor: isSelected ? themeColors.primary : themeColors.cardBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.fontPillText,
                      { color: isSelected ? '#FFFFFF' : themeColors.textPrimary },
                    ]}
                  >
                    {sizeOpt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Live Preview Box */}
          <View
            style={[
              styles.livePreviewBox,
              {
                backgroundColor: themeColors.surfaceSubtle,
                borderColor: themeColors.cardBorder,
              },
            ]}
          >
            <View style={styles.previewHeader}>
              <Sparkles size={14} color={themeColors.primary} />
              <Text style={[styles.previewLabel, { color: themeColors.primary }]}>
                Aperçu instantané avec le thème sélectionné
              </Text>
            </View>

            <Text
              style={[
                styles.previewFr,
                {
                  color: themeColors.textPrimary,
                  fontSize: 16 + fontSizeDelta,
                  lineHeight: 24 + fontSizeDelta,
                },
              ]}
            >
              {"« Lire ouvre les portes d'un monde infini. »"}
            </Text>

            <Text
              style={[
                styles.previewEn,
                {
                  color: themeColors.textSecondary,
                  fontSize: 14 + fontSizeDelta,
                  lineHeight: 20 + fontSizeDelta,
                },
              ]}
            >
              “Reading opens the doors of an infinite world.”
            </Text>

            <Text
              style={[
                styles.previewDari,
                {
                  color: themeColors.textPrimary,
                  fontSize: 20 + fontSizeDelta,
                  lineHeight: 32 + fontSizeDelta,
                },
              ]}
            >
              خوانش درهای یک جهان نامحدود را می‌گشاید.
            </Text>
          </View>
        </View>

        {/* SECTION 3: OPTIONS PHONÉTIQUE & AUDIO */}
        <View style={styles.sectionTitleRow}>
          <Volume2 size={16} color={themeColors.primary} />
          <Text style={[styles.sectionHeader, { color: themeColors.textMuted }]}>
            OPTIONS AUDIO & PHONÉTIQUE
          </Text>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: themeColors.surface, borderColor: themeColors.cardBorder },
          ]}
        >
          {/* Dari phonetics */}
          <View style={styles.row}>
            <View style={[styles.rowIconCircle, { backgroundColor: themeColors.primaryLight }]}>
              <BookOpen size={20} color={themeColors.primary} />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={[styles.rowTitle, { color: themeColors.textPrimary }]}>
                Phonétique Dari (Lettres latines)
              </Text>
              <Text style={[styles.rowSubtitle, { color: themeColors.textSecondary }]}>
                Affiche la transcription pour faciliter la prononciation du Dari
              </Text>
            </View>
            <Switch
              value={settings.showPhonetics}
              onValueChange={handleTogglePhonetics}
              trackColor={{ false: themeColors.cardBorder, true: themeColors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: themeColors.cardBorder }]} />

          {/* Audio speed */}
          <View style={styles.row}>
            <View style={[styles.rowIconCircle, { backgroundColor: themeColors.primaryLight }]}>
              <Volume2 size={20} color={themeColors.primary} />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={[styles.rowTitle, { color: themeColors.textPrimary }]}>
                Vitesse de la voix
              </Text>
              <Text style={[styles.rowSubtitle, { color: themeColors.textSecondary }]}>
                Ajustez le débit de la synthèse vocale française et anglaise
              </Text>
            </View>
          </View>

          <View style={styles.speedRow}>
            {[
              { label: 'Lente (0.75x)', val: 0.75 },
              { label: 'Normale (0.9x)', val: 0.9 },
              { label: 'Rapide (1.1x)', val: 1.1 },
            ].map((spd) => {
              const isSelected = Math.abs(settings.speechRate - spd.val) < 0.05;
              return (
                <TouchableOpacity
                  key={spd.label}
                  activeOpacity={0.8}
                  onPress={() => handleSpeedSelect(spd.val)}
                  style={[
                    styles.speedPill,
                    {
                      backgroundColor: isSelected ? themeColors.primary : themeColors.surfaceSubtle,
                      borderColor: isSelected ? themeColors.primary : themeColors.cardBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.speedPillText,
                      { color: isSelected ? '#FFF' : themeColors.textPrimary },
                    ]}
                  >
                    {spd.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* SECTION 4: APPAREIL & CECRL */}
        <View style={styles.sectionTitleRow}>
          <Smartphone size={16} color="#10B981" />
          <Text style={[styles.sectionHeader, { color: themeColors.textMuted }]}>
            APPAREIL & NIVEAUX
          </Text>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: themeColors.surface, borderColor: themeColors.cardBorder },
          ]}
        >
          <View style={styles.row}>
            <View style={[styles.rowIconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
              <Smartphone size={20} color="#10B981" />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={[styles.rowTitle, { color: themeColors.textPrimary }]}>
                Format détecté : {isTablet ? 'Tablette / iPad' : 'Smartphone'}
              </Text>
              <Text style={[styles.rowSubtitle, { color: themeColors.textSecondary }]}>
                {isTablet
                  ? 'Mode Maître-Détail activé avec double colonne.'
                  : 'Mode Mobile compact activé avec cartes fluides.'}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: themeColors.cardBorder }]} />

          <View style={styles.row}>
            <View style={[styles.rowIconCircle, { backgroundColor: 'rgba(59, 130, 246, 0.12)' }]}>
              <ShieldCheck size={20} color="#3B82F6" />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={[styles.rowTitle, { color: themeColors.textPrimary }]}>
                Niveaux CECRL Couverts
              </Text>
              <Text style={[styles.rowSubtitle, { color: themeColors.textSecondary }]}>
                A1 (Débutant) • A2 (Élémentaire) • B1 (Intermédiaire autonome)
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 30,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  bookBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    marginBottom: 20,
    gap: 12,
  },
  bookBannerIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookBannerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  bookBannerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  tagNew: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagNewText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
    marginTop: 14,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  themesList: {
    gap: 10,
    marginBottom: 14,
  },
  themeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    gap: 12,
  },
  swatchPreview: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    padding: 6,
    justifyContent: 'space-between',
  },
  swatchBar: {
    height: 6,
    borderRadius: 3,
    width: '70%',
  },
  swatchDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    alignSelf: 'flex-end',
  },
  themeInfoCol: {
    flex: 1,
  },
  themeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  themeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  selectedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  selectedPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  themeName: {
    fontSize: 15,
    fontWeight: '800',
  },
  themeDesc: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  fontSizeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  fontPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  livePreviewBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  previewLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  previewFr: {
    fontWeight: '700',
  },
  previewEn: {
    fontStyle: 'italic',
  },
  previewDari: {
    fontWeight: '600',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTextCol: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  rowSubtitle: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginVertical: 14,
  },
  speedRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  speedPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
