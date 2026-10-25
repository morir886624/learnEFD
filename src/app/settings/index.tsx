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
import {
  Moon,
  Volume2,
  BookOpen,
  Smartphone,
  ShieldCheck,
} from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { useResponsive } from '../../hooks/useResponsive';

export default function SettingsScreen() {
  const { themeColors, settings, updateSettings, isDark } = useApp();
  const { contentMaxWidth, isTablet } = useResponsive();

  const handleTogglePhonetics = (value: boolean) => {
    updateSettings({ showPhonetics: value });
  };

  const handleToggleDark = (value: boolean) => {
    updateSettings({ darkMode: value });
  };

  const handleSpeedSelect = (rate: number) => {
    updateSettings({ speechRate: rate });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.container, { maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' }]}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: themeColors.textPrimary }]}>
            Paramètres & Options
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            {"Personnalisez votre expérience d'apprentissage"}
          </Text>
        </View>

        {/* SECTION: AFFICHAGE */}
        <Text style={[styles.sectionHeader, { color: themeColors.textMuted }]}>AFFICHAGE</Text>

        <View
          style={[
            styles.card,
            { backgroundColor: themeColors.surface, borderColor: themeColors.cardBorder },
          ]}
        >
          {/* Dari phonetics */}
          <View style={styles.row}>
            <View style={styles.rowIconCircle}>
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

          {/* Dark Mode */}
          <View style={styles.row}>
            <View style={styles.rowIconCircle}>
              <Moon size={20} color={themeColors.primary} />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={[styles.rowTitle, { color: themeColors.textPrimary }]}>
                Mode Sombre (Dark Theme)
              </Text>
              <Text style={[styles.rowSubtitle, { color: themeColors.textSecondary }]}>
                Design reposant pour les yeux
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={handleToggleDark}
              trackColor={{ false: themeColors.cardBorder, true: themeColors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* SECTION: AUDIO */}
        <Text style={[styles.sectionHeader, { color: themeColors.textMuted }]}>
          AUDIO & PRONONCIATION
        </Text>

        <View
          style={[
            styles.card,
            { backgroundColor: themeColors.surface, borderColor: themeColors.cardBorder },
          ]}
        >
          <View style={styles.row}>
            <View style={styles.rowIconCircle}>
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

        {/* SECTION: COMPATIBILITÉ & APPAREILS */}
        <Text style={[styles.sectionHeader, { color: themeColors.textMuted }]}>
          APPAREIL & INSTALLATION
        </Text>

        <View
          style={[
            styles.card,
            { backgroundColor: themeColors.surface, borderColor: themeColors.cardBorder },
          ]}
        >
          <View style={styles.row}>
            <View style={styles.rowIconCircle}>
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
            <View style={styles.rowIconCircle}>
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
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 14,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
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
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
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
