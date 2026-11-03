import { Phrase } from '../types/phrase';
import { a1Phrases } from './phrases/a1';
import { a2Phrases } from './phrases/a2';
import { b1Phrases } from './phrases/b1';
import { LEVEL_A1_PHRASES } from './phrases/levels/a1';
import { LEVEL_A2_PHRASES } from './phrases/levels/a2';
import { LEVEL_B1_PHRASES } from './phrases/levels/b1';
import { LEVEL_B2_PHRASES } from './phrases/levels/b2';
import { ensureFullLevelWordCoverage } from './phrases/helper';

const FULL_A1_PHRASES: Phrase[] = ensureFullLevelWordCoverage('A1', [
  ...a1Phrases,
  ...LEVEL_A1_PHRASES,
]);

const FULL_A2_PHRASES: Phrase[] = ensureFullLevelWordCoverage('A2', [
  ...a2Phrases,
  ...LEVEL_A2_PHRASES,
]);

const FULL_B1_PHRASES: Phrase[] = ensureFullLevelWordCoverage('B1', [
  ...b1Phrases,
  ...LEVEL_B1_PHRASES,
]);

const FULL_B2_PHRASES: Phrase[] = ensureFullLevelWordCoverage('B2', [
  ...LEVEL_B2_PHRASES,
]);

export const PHRASES: Phrase[] = [
  ...FULL_A1_PHRASES,
  ...FULL_A2_PHRASES,
  ...FULL_B1_PHRASES,
  ...FULL_B2_PHRASES,
];
