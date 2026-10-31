import React from 'react';
import { Redirect, useLocalSearchParams } from 'expo-router';

export default function VocabularyScreen() {
  const params = useLocalSearchParams<{ lang?: string }>();
  const source = params.lang === 'en' ? 'vocab-en' : 'vocab-fr';
  return <Redirect href={{ pathname: '/phrases', params: { mode: 'explorer', source } }} />;
}
