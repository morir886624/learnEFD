import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Volume2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { SpeechLanguage, SpeechService } from '../../services/speech';
import { useApp } from '../../context/AppContext';

interface AudioButtonProps {
  text: string;
  lang: SpeechLanguage;
  size?: number;
  color?: string;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  text,
  lang,
  size = 20,
  color,
}) => {
  const { themeColors, settings } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePress = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Haptics fallback on web or unsupported devices
    }

    setIsPlaying(true);
    await SpeechService.speak(text, lang, settings.speechRate);
    setTimeout(() => {
      setIsPlaying(false);
    }, 1200);
  };

  const activeColor = color || (isPlaying ? themeColors.accent : themeColors.primary);

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`Écouter la prononciation en ${lang}`}
      onPress={handlePress}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          backgroundColor: isPlaying ? themeColors.primaryLight : themeColors.surfaceSubtle,
          borderColor: isPlaying ? themeColors.primary : themeColors.cardBorder,
        },
      ]}
    >
      <Volume2 size={size} color={activeColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 7,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
