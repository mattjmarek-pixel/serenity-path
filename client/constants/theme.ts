import { Platform } from "react-native";

export type CommunityType = "AA" | "NA";

export const RECOVERY_PALETTE = {
  purple: "#8B6AAE",
  purpleDark: "#A07CC8",
  purpleHover: "#7D5490",
  purpleCtaDark: "#6B4A90",
  green: "#4A9E7C",
  orange: "#E89A3C",
  orangeDark: "#B86E1A",
} as const;

const COMMUNITY_ROLES: Record<
  CommunityType,
  {
    primaryLight: string;
    primaryDark: string;
    secondaryLight: string;
    secondaryDark: string;
    accentLight: string;
    accentDark: string;
    highlightLight: string;
    highlightDark: string;
  }
> = {
  AA: {
    primaryLight: RECOVERY_PALETTE.purple,
    primaryDark: RECOVERY_PALETTE.purpleDark,
    secondaryLight: RECOVERY_PALETTE.green,
    secondaryDark: RECOVERY_PALETTE.green,
    accentLight: RECOVERY_PALETTE.green,
    accentDark: RECOVERY_PALETTE.green,
    highlightLight: RECOVERY_PALETTE.orange,
    highlightDark: RECOVERY_PALETTE.orangeDark,
  },
  NA: {
    primaryLight: RECOVERY_PALETTE.green,
    primaryDark: RECOVERY_PALETTE.green,
    secondaryLight: RECOVERY_PALETTE.purple,
    secondaryDark: RECOVERY_PALETTE.purpleDark,
    accentLight: RECOVERY_PALETTE.purple,
    accentDark: RECOVERY_PALETTE.purpleDark,
    highlightLight: RECOVERY_PALETTE.orange,
    highlightDark: RECOVERY_PALETTE.orangeDark,
  },
};

const BASE_LIGHT = {
  text: "#2A1A40",
  textSecondary: "#7D5C9A",
  textMuted: "#B4A8C4",
  buttonText: "#F3EEF8",
  tabIconDefault: "#B4A8C4",
  backgroundRoot: "#F5F3F8",
  backgroundDefault: "#FFFFFF",
  backgroundSecondary: "#F0EAF8",
  backgroundTertiary: "#E6F4EE",
  border: "#E8E0F0",
  emergency: RECOVERY_PALETTE.orange,
  emergencyText: "#5A3010",
  primaryHover: RECOVERY_PALETTE.purpleHover,
  primaryText: "#F3EEF8",
  navBackground: "#FFFFFF",
  navBorder: "#E8E0F0",
  navIconActive: RECOVERY_PALETTE.purple,
  navIconInactive: "#B4A8C4",
  thoughtTag: RECOVERY_PALETTE.purple,
  thoughtQuote: "#3D1F5A",
  secondaryBackground: "#E6F4EE",
  secondaryText: "#185E42",
};

const BASE_DARK = {
  text: "#E8D4F5",
  textSecondary: "#A07CC8",
  textMuted: "#5A4870",
  buttonText: "#E8D8FF",
  tabIconDefault: "#5A4870",
  backgroundRoot: "#1E1428",
  backgroundDefault: "#2C1E40",
  backgroundSecondary: "#2C1E40",
  backgroundTertiary: "#0F2820",
  border: "#3D2A54",
  emergency: RECOVERY_PALETTE.orangeDark,
  emergencyText: "#FDF0DC",
  primaryHover: RECOVERY_PALETTE.purpleCtaDark,
  primaryText: "#E8D8FF",
  navBackground: "#2C1E40",
  navBorder: "#3D2A54",
  navIconActive: RECOVERY_PALETTE.purpleDark,
  navIconInactive: "#5A4870",
  thoughtTag: RECOVERY_PALETTE.purpleDark,
  thoughtQuote: "#E8D4F5",
  secondaryBackground: "#0F2820",
  secondaryText: "#E8D4F5",
};

export interface ThemeColors {
  text: string;
  textSecondary: string;
  textMuted: string;
  buttonText: string;
  tabIconDefault: string;
  tabIconSelected: string;
  link: string;
  backgroundRoot: string;
  backgroundDefault: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  border: string;
  primary: string;
  primaryHover: string;
  primaryText: string;
  secondary: string;
  secondaryBackground: string;
  secondaryText: string;
  accent: string;
  highlight: string;
  emergency: string;
  emergencyText: string;
  success: string;
  warning: string;
  navBackground: string;
  navBorder: string;
  navIconActive: string;
  navIconInactive: string;
  thoughtTag: string;
  thoughtQuote: string;
}

export function getThemeColors(
  scheme: "light" | "dark",
  community: CommunityType = "AA",
): ThemeColors {
  const isDark = scheme === "dark";
  const base = isDark ? BASE_DARK : BASE_LIGHT;
  const roles = COMMUNITY_ROLES[community];
  const primary = isDark ? roles.primaryDark : roles.primaryLight;
  const secondary = isDark ? roles.secondaryDark : roles.secondaryLight;
  const accent = isDark ? roles.accentDark : roles.accentLight;
  const highlight = isDark ? roles.highlightDark : roles.highlightLight;
  return {
    ...base,
    primary,
    secondary,
    accent,
    highlight,
    success: RECOVERY_PALETTE.green,
    warning: isDark ? RECOVERY_PALETTE.orangeDark : RECOVERY_PALETTE.orange,
    tabIconSelected: primary,
    link: primary,
  };
}

export const Colors = {
  light: getThemeColors("light", "AA"),
  dark: getThemeColors("dark", "AA"),
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 48,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 30,
  "2xl": 40,
  "3xl": 50,
  full: 9999,
};

export const Typography = {
  hero: {
    fontSize: 56,
    fontFamily: "CrimsonPro_700Bold",
  },
  h1: {
    fontSize: 32,
    fontFamily: "CrimsonPro_700Bold",
  },
  h2: {
    fontSize: 28,
    fontFamily: "CrimsonPro_700Bold",
  },
  h3: {
    fontSize: 24,
    fontFamily: "CrimsonPro_600SemiBold",
  },
  h4: {
    fontSize: 20,
    fontFamily: "CrimsonPro_600SemiBold",
  },
  body: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  small: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  link: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
  button: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
};

export const Fonts = {
  inter: {
    regular: "Inter_400Regular",
    medium: "Inter_500Medium",
    semiBold: "Inter_600SemiBold",
    bold: "Inter_700Bold",
  },
  crimsonPro: {
    regular: "CrimsonPro_400Regular",
    medium: "CrimsonPro_500Medium",
    semiBold: "CrimsonPro_600SemiBold",
    bold: "CrimsonPro_700Bold",
  },
};
