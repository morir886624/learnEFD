import * as Speech from 'expo-speech';

export type SpeechLanguage = 'fr' | 'en' | 'dari';

export const SpeechService = {
  async speak(text: string, lang: SpeechLanguage, rate = 0.9): Promise<void> {
    try {
      await Speech.stop();

      let languageCode = 'fr-FR';
      let pitch = 1.0;

      if (lang === 'en') {
        languageCode = 'en-US';
      } else if (lang === 'dari') {
        languageCode = 'fa-IR'; // Persian/Dari TTS code supported on mobile OS
      }

      Speech.speak(text, {
        language: languageCode,
        rate: Math.max(0.6, Math.min(1.2, rate)),
        pitch,
      });
    } catch (e) {
      console.warn('Speech error or unsupported language on device:', e);
    }
  },

  async stop(): Promise<void> {
    try {
      await Speech.stop();
    } catch {
      // Ignore
    }
  },

  async isSpeaking(): Promise<boolean> {
    try {
      return await Speech.isSpeakingAsync();
    } catch {
      return false;
    }
  },
};
