import { Phrase } from '../types/phrase';
import { a1Phrases } from './phrases/a1';
import { a2Phrases } from './phrases/a2';
import { b1Phrases } from './phrases/b1';

export const PHRASES: Phrase[] = [
  ...a1Phrases,
  ...a2Phrases,
  ...b1Phrases,
];
