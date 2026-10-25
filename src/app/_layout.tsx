import React from 'react';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Home, BookOpen, Layers, Award, Bookmark, Settings as SettingsIcon } from 'lucide-react-native';
import { AppProvider, useApp } from '../context/AppContext';

function TabLayout() {
  const { themeColors, isDark } = useApp();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: themeColors.primary,
          tabBarInactiveTintColor: themeColors.textMuted,
          tabBarStyle: {
            backgroundColor: themeColors.tabBarBg,
            borderTopColor: themeColors.tabBarBorder,
            height: 62,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Accueil',
            tabBarIcon: ({ color, size }) => <Home size={size || 22} color={color} />,
          }}
        />
        <Tabs.Screen
          name="phrases/index"
          options={{
            title: 'Phrases',
            tabBarIcon: ({ color, size }) => <BookOpen size={size || 22} color={color} />,
          }}
        />
        <Tabs.Screen
          name="flashcards/index"
          options={{
            title: 'Flashcards',
            tabBarIcon: ({ color, size }) => <Layers size={size || 22} color={color} />,
          }}
        />
        <Tabs.Screen
          name="quiz/index"
          options={{
            title: 'Quiz',
            tabBarIcon: ({ color, size }) => <Award size={size || 22} color={color} />,
          }}
        />
        <Tabs.Screen
          name="favorites/index"
          options={{
            title: 'Favoris',
            tabBarIcon: ({ color, size }) => <Bookmark size={size || 22} color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings/index"
          options={{
            title: 'Options',
            tabBarIcon: ({ color, size }) => <SettingsIcon size={size || 22} color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <TabLayout />
      </AppProvider>
    </SafeAreaProvider>
  );
}
