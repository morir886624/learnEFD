import React from 'react';
import { Redirect } from 'expo-router';

export default function QuizScreen() {
  return <Redirect href={{ pathname: '/phrases', params: { mode: 'quiz' } }} />;
}
