import React from 'react';
import { Redirect } from 'expo-router';

export default function FlashcardsScreen() {
  return <Redirect href={{ pathname: '/phrases', params: { mode: 'flashcards' } }} />;
}
