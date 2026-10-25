import { useWindowDimensions } from 'react-native';

export interface ResponsiveInfo {
  width: number;
  height: number;
  isTablet: boolean;
  isLandscape: boolean;
  isPhone: boolean;
  columns: number;
  contentMaxWidth: number;
  cardSpacing: number;
}

export function useResponsive(): ResponsiveInfo {
  const { width, height } = useWindowDimensions();

  const isTablet = width >= 768;
  const isLandscape = width > height;
  const isPhone = !isTablet;

  // Grid columns based on device form factor
  let columns = 1;
  if (isTablet) {
    columns = isLandscape ? 3 : 2;
  }

  const contentMaxWidth = isTablet ? 1100 : 540;
  const cardSpacing = isTablet ? 20 : 14;

  return {
    width,
    height,
    isTablet,
    isLandscape,
    isPhone,
    columns,
    contentMaxWidth,
    cardSpacing,
  };
}
