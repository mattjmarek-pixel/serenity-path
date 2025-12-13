import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#1A2A3A",
    textSecondary: "#5A6A7A",
    buttonText: "#FFFFFF",
    tabIconDefault: "#5A6A7A",
    tabIconSelected: "#1F4E79",
    link: "#1F4E79",
    backgroundRoot: "#F2F4F6",
    backgroundDefault: "#FFFFFF",
    backgroundSecondary: "#E8EEF4",
    backgroundTertiary: "#D4DEE8",
    primary: "#1F4E79",
    secondary: "#A9C7E8",
    accent: "#D4A017",
    emergency: "#C62828",
    success: "#2E7D4A",
    warning: "#D4A017",
    border: "#D4DEE8",
  },
  dark: {
    text: "#F2F4F6",
    textSecondary: "#A9B8C8",
    buttonText: "#FFFFFF",
    tabIconDefault: "#7A8A9A",
    tabIconSelected: "#A9C7E8",
    link: "#A9C7E8",
    backgroundRoot: "#0D1520",
    backgroundDefault: "#152030",
    backgroundSecondary: "#1E2D40",
    backgroundTertiary: "#2A3D52",
    primary: "#A9C7E8",
    secondary: "#1F4E79",
    accent: "#E8B82A",
    emergency: "#FF6B6B",
    success: "#4CAF6A",
    warning: "#E8B82A",
    border: "#2A3D52",
  },
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
