import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

interface AppLogoProps {
  size?: number;
  style?: ViewStyle;
}

/**
 * Official LearnEFD Emblem Logo Component (Transparent Background)
 * Represents the 3 core pillars of LearnEFD at first glance:
 * 1. Trilingual speech bubbles: English (E), Français (F), and Dari (D • د)
 * 2. Open 3D Book & Flashcards with LTR + RTL reading lines
 * 3. Center Audio Pronunciation Soundwave
 */
export function AppLogo({ size = 54, style }: AppLogoProps) {
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
        },
        style,
      ]}
    >
      <Svg width={size} height={size} viewBox="0 0 1024 1024">
        <Defs>
          <LinearGradient id="frBubble" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#3B82F6" />
            <Stop offset="55%" stopColor="#2563EB" />
            <Stop offset="100%" stopColor="#1D4ED8" />
          </LinearGradient>

          <LinearGradient id="enBubble" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#8B5CF6" />
            <Stop offset="50%" stopColor="#6366F1" />
            <Stop offset="100%" stopColor="#4338CA" />
          </LinearGradient>

          <LinearGradient id="dariBubble" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FBBF24" />
            <Stop offset="50%" stopColor="#F59E0B" />
            <Stop offset="100%" stopColor="#B45309" />
          </LinearGradient>

          <LinearGradient id="bookCover" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#F59E0B" />
            <Stop offset="50%" stopColor="#D97706" />
            <Stop offset="100%" stopColor="#78350F" />
          </LinearGradient>

          <LinearGradient id="pageWarm" x1="0%" y1="0%" x2="100%" y2="25%">
            <Stop offset="0%" stopColor="#FFFBEB" />
            <Stop offset="70%" stopColor="#FEF3C7" />
            <Stop offset="100%" stopColor="#FDE68A" />
          </LinearGradient>

          <LinearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FBBF24" />
            <Stop offset="50%" stopColor="#D97706" />
            <Stop offset="100%" stopColor="#92400E" />
          </LinearGradient>
        </Defs>

        <G transform="translate(512, 520) scale(1.14) translate(-512, -460)">
          {/* 1. TOP-CENTER SPEECH BUBBLE: ENGLISH (E) */}
          <Path
            d="M 392 128 H 632 A 46 46 0 0 1 678 174 V 334 A 46 46 0 0 1 632 380 H 542 L 512 424 L 482 380 H 392 A 46 46 0 0 1 346 334 V 174 A 46 46 0 0 1 392 128 Z"
            fill="url(#enBubble)"
            stroke="#312E81"
            strokeWidth="10"
          />
          <SvgText
            x="512"
            y="314"
            textAnchor="middle"
            fontWeight="900"
            fontSize="175"
            fill="#FFFFFF"
          >
            E
          </SvgText>

          {/* 2. LEFT SPEECH BUBBLE: FRANÇAIS (F) */}
          <Path
            d="M 164 290 H 384 A 44 44 0 0 1 428 334 V 488 A 44 44 0 0 1 384 532 H 348 L 368 584 L 298 532 H 164 A 44 44 0 0 1 120 488 V 334 A 44 44 0 0 1 164 290 Z"
            fill="url(#frBubble)"
            stroke="#1E3A8A"
            strokeWidth="10"
          />
          {/* French Tricolor Accent Pill */}
          <Circle cx="234" cy="332" r="12" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="3" />
          <Circle cx="268" cy="332" r="12" fill="#FFFFFF" />
          <Circle cx="302" cy="332" r="12" fill="#EF4444" />
          <SvgText
            x="274"
            y="486"
            textAnchor="middle"
            fontWeight="900"
            fontSize="165"
            fill="#FFFFFF"
          >
            F
          </SvgText>

          {/* 3. RIGHT SPEECH BUBBLE: DARI (D • د) */}
          <Path
            d="M 640 290 H 860 A 44 44 0 0 1 904 334 V 488 A 44 44 0 0 1 860 532 H 726 L 656 584 L 676 532 H 640 A 44 44 0 0 1 596 488 V 334 A 44 44 0 0 1 640 290 Z"
            fill="url(#dariBubble)"
            stroke="#92400E"
            strokeWidth="10"
          />
          <SvgText
            x="686"
            y="474"
            textAnchor="middle"
            fontWeight="900"
            fontSize="145"
            fill="#FFFFFF"
          >
            D
          </SvgText>
          <Line
            x1="754"
            y1="348"
            x2="754"
            y2="484"
            stroke="#FEF08A"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <SvgText
            x="824"
            y="470"
            textAnchor="middle"
            fontWeight="900"
            fontSize="140"
            fill="#FFFFFF"
          >
            د
          </SvgText>

          {/* 4. OPEN 3D BOOK & PAGES AT BASE */}
          <Path
            d="M 156 645 Q 330 595 512 668 Q 694 595 868 645 L 892 785 Q 700 732 512 808 Q 324 732 132 785 Z"
            fill="url(#bookCover)"
            stroke="#78350F"
            strokeWidth="8"
          />
          <Path
            d="M 184 588 Q 348 536 512 618 L 512 758 Q 338 678 168 728 Z"
            fill="url(#pageWarm)"
            stroke="#D97706"
            strokeWidth="6"
          />
          <Path
            d="M 840 588 Q 676 536 512 618 L 512 758 Q 686 678 856 728 Z"
            fill="url(#pageWarm)"
            stroke="#D97706"
            strokeWidth="6"
          />
          {/* Reading Lines */}
          <Path
            d="M 235 632 Q 345 608 452 646"
            stroke="#2563EB"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d="M 228 672 Q 338 648 445 686"
            stroke="#6366F1"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d="M 789 632 Q 679 608 572 646"
            stroke="#D97706"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d="M 796 672 Q 686 648 579 686"
            stroke="#B45309"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
          />
          <Line
            x1="512"
            y1="614"
            x2="512"
            y2="778"
            stroke="#92400E"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* 5. CENTER AUDIO PRONUNCIATION WAVE */}
          <Circle
            cx="512"
            cy="548"
            r="72"
            fill="#0F172A"
            stroke="url(#goldRim)"
            strokeWidth="8"
          />
          <Rect x="468" y="532" width="12" height="32" rx="6" fill="#60A5FA" />
          <Rect x="488" y="512" width="12" height="72" rx="6" fill="#A78BFA" />
          <Rect x="506" y="498" width="12" height="100" rx="6" fill="#FBBF24" />
          <Rect x="524" y="512" width="12" height="72" rx="6" fill="#A78BFA" />
          <Rect x="544" y="532" width="12" height="32" rx="6" fill="#34D399" />
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
