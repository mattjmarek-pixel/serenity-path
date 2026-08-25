import { useThemeContext } from "@/contexts/ThemeContext";

export function useColorScheme(): "light" | "dark" {
  const { colorScheme } = useThemeContext();
  return colorScheme;
}
