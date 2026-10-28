import React from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Home,
  BookOpen,
  Layers,
  Award,
  Bookmark,
  Settings as SettingsIcon,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useApp } from '../../context/AppContext';

type TabBarProps = Parameters<NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>>[0];

const TAB_CONFIG: Record<
  string,
  {
    label: string;
    Icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  }
> = {
  index: { label: 'Accueil', Icon: Home },
  'phrases/index': { label: 'Phrases', Icon: BookOpen },
  'flashcards/index': { label: 'Flashcards', Icon: Layers },
  'quiz/index': { label: 'Quiz', Icon: Award },
  'favorites/index': { label: 'Favoris', Icon: Bookmark },
  'settings/index': { label: 'Options', Icon: SettingsIcon },
};

export function CustomTabBar({ state, descriptors, emitter, navigateToTab, insets }: TabBarProps) {
  const { themeColors, favorites, isDark } = useApp();
  const safeInsets = useSafeAreaInsets();
  const bottomInset = Math.max(insets?.bottom ?? 0, safeInsets.bottom, 10);

  const currentRoute = state.routes[state.index];
  if (currentRoute?.name === 'reader/index') {
    return null;
  }

  const visibleRoutes = state.routes.filter((route) => {
    const options = descriptors[route.key]?.options as { href?: string | null; hidden?: boolean } | undefined;
    return route.name in TAB_CONFIG && options?.href !== null && !options?.hidden;
  });

  return (
    <View
      style={[
        styles.outerWrapper,
        {
          backgroundColor: themeColors.tabBarBg,
          borderTopColor: themeColors.tabBarBorder,
          paddingBottom: bottomInset,
        },
      ]}
    >
      <View style={styles.innerBar}>
        {visibleRoutes.map((route) => {
          const { options } = descriptors[route.key];
          const isFocused = state.routes[state.index]?.key === route.key;
          const config = TAB_CONFIG[route.name];
          if (!config) return null;

          const { Icon, label } = config;
          const isFavoritesTab = route.name === 'favorites/index';
          const badgeCount = isFavoritesTab ? favorites.length : 0;

          const onPress = () => {
            try {
              Haptics.selectionAsync();
            } catch {
              // Ignore on web or unsupported devices
            }

            const event = emitter.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigateToTab(route.key);
            }
          };

          const onLongPress = () => {
            emitter.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const activeColor = themeColors.primary;
          const inactiveColor = themeColors.textSecondary;

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel || label}
              onPress={onPress}
              onLongPress={onLongPress}
              style={({ pressed }) => [
                styles.tabItem,
                pressed && styles.tabItemPressed,
                Platform.select({
                  web: {
                    outlineStyle: 'none',
                    cursor: 'pointer',
                  } as any,
                }),
              ]}
            >
              {/* Top Active Accent Line */}
              <View
                style={[
                  styles.topIndicator,
                  {
                    backgroundColor: isFocused ? activeColor : 'transparent',
                  },
                ]}
              />

              {/* Icon Pill Container */}
              <View
                style={[
                  styles.iconPill,
                  isFocused && {
                    backgroundColor: themeColors.primaryLight,
                    borderColor: isDark ? 'rgba(99, 102, 241, 0.35)' : themeColors.cardBorder,
                    borderWidth: 1,
                  },
                ]}
              >
                <Icon
                  size={20}
                  color={isFocused ? activeColor : inactiveColor}
                  strokeWidth={isFocused ? 2.5 : 1.9}
                />

                {/* Favorites Count Badge */}
                {badgeCount > 0 && (
                  <View
                    style={[
                      styles.badge,
                      {
                        borderColor: themeColors.tabBarBg,
                      },
                    ]}
                  >
                    <Text style={styles.badgeText}>
                      {badgeCount > 99 ? '99+' : badgeCount}
                    </Text>
                  </View>
                )}
              </View>

              {/* Full Unclipped Label */}
              <Text
                numberOfLines={1}
                allowFontScaling={false}
                style={[
                  styles.tabLabel,
                  {
                    color: isFocused ? activeColor : inactiveColor,
                    fontWeight: isFocused ? '800' : '600',
                  },
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    width: '100%',
    borderTopWidth: 1,
    paddingTop: 2,
    paddingHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 12,
  },
  innerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    maxWidth: 760,
    width: '100%',
    alignSelf: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
    paddingBottom: 2,
    paddingHorizontal: 2,
    minHeight: 62,
    position: 'relative',
  },
  tabItemPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  topIndicator: {
    position: 'absolute',
    top: -2,
    width: 28,
    height: 3.5,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  iconPill: {
    width: 48,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: 2,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: '#E11D48',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
    lineHeight: 12,
    includeFontPadding: false,
  },
  tabLabel: {
    fontSize: 11.5,
    lineHeight: 16,
    marginTop: 4,
    textAlign: 'center',
    letterSpacing: -0.1,
    includeFontPadding: false,
  },
});
