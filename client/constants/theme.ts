import { Platform } from "react-native";

export type CommunityType = "AA" | "NA";

export const RECOVERY_PALETTE = {
  purple: "#7B3FF2",
  blue: "#3A9BD9",
  green: "#06D6A0",
  orange: "#FB8500",
  red: "#C62828",
} as const;

const COMMUNITY_ROLES: Record<CommunityType, {
  primary: keyof typeof RECOVERY_PALETTE;
  secondary: keyof typeof RECOVERY_PALETTE;
  accent: keyof typeof RECOVERY_PALETTE;
  highlight: keyof typeof RECOVERY_PALETTE;
}> = {
  AA: { primary: "purple", secondary: "blue", accent: "green", highlight: "orange" },
  NA: { primary: "green", secondary: "orange", accent: "purple", highlight: "blue" },
};

const BASE_LIGHT = {
  text: "#1A2A3A",
  textSecondary: "#5A6A7A",
  buttonText: "#FFFFFF",
  tabIconDefault: "#5A6A7A",
  backgroundRoot: "#F2F4F6",
  backgroundDefault: "#FFFFFF",
  backgroundSecondary: "#E8EEF4",
  backgroundTertiary: "#D4DEE8",
  border: "#D4DEE8",
  emergency: RECOVERY_PALETTE.red,
};

const BASE_DARK = {
  text: "#F2F4F6",
  textSecondary: "#A9B8C8",
  buttonText: "#FFFFFF",
  tabIconDefault: "#7A8A9A",
  backgroundRoot: "#0D1520",
  backgroundDefault: "#152030",
  backgroundSecondary: "#1E2D40",
  backgroundTertiary: "#2A3D52",
  border: "#2A3D52",
  emergency: RECOVERY_PALETTE.red,
};

export interface ThemeColors {
  text: string;
  textSecondary: string;
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
  secondary: string;
  accent: string;
  highlight: string;
  emergency: string;
  success: string;
  warning: string;
}

export function getThemeColors(
  scheme: "light" | "dark",
  community: CommunityType = "AA"
): ThemeColors {
  const base = scheme === "dark" ? BASE_DARK : BASE_LIGHT;
  const roles = COMMUNITY_ROLES[community];
  const primary = RECOVERY_PALETTE[roles.primary];
  const secondary = RECOVERY_PALETTE[roles.secondary];
  const accent = RECOVERY_PALETTE[roles.accent];
  const highlight = RECOVERY_PALETTE[roles.highlight];
  return {
    ...base,
    primary,
    secondary,
    accent,
    highlight,
    success: RECOVERY_PALETTE.green,
    warning: RECOVERY_PALETTE.orange,
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
