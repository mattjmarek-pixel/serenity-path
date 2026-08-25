import { getThemeColors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useCommunity } from "@/contexts/CommunityContext";

export function useTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { activeCommunity } = useCommunity();
  const theme = getThemeColors(colorScheme ?? "light", activeCommunity);

  return {
    theme,
    isDark,
    activeCommunity,
  };
}
