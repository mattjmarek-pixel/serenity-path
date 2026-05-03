import React from "react";
import { View, StyleSheet, Pressable, Platform } from "react-native";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useCommunity } from "@/contexts/CommunityContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getThemeColors, BorderRadius, Spacing } from "@/constants/theme";

export function CommunityToggle() {
  const { path, activeView, setActiveView } = useCommunity();
  const colorScheme = useColorScheme();

  if (path !== "Both") return null;

  const aaColors = getThemeColors(colorScheme ?? "light", "AA");
  const naColors = getThemeColors(colorScheme ?? "light", "NA");

  const press = (next: "AA" | "NA") => {
    if (next === activeView) return;
    if (Platform.OS !== "web") {
      Haptics.selectionAsync().catch(() => {});
    }
    setActiveView(next);
  };

  return (
    <View style={[styles.container, { backgroundColor: aaColors.backgroundSecondary }]}>
      <Pressable
        onPress={() => press("AA")}
        style={[
          styles.pill,
          activeView === "AA" && { backgroundColor: aaColors.primary },
        ]}
      >
        <ThemedText
          style={[
            styles.pillText,
            { color: activeView === "AA" ? "#FFFFFF" : aaColors.textSecondary },
          ]}
        >
          AA
        </ThemedText>
      </Pressable>
      <Pressable
        onPress={() => press("NA")}
        style={[
          styles.pill,
          activeView === "NA" && { backgroundColor: naColors.primary },
        ]}
      >
        <ThemedText
          style={[
            styles.pillText,
            { color: activeView === "NA" ? "#FFFFFF" : naColors.textSecondary },
          ]}
        >
          NA
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: BorderRadius.full,
    padding: 3,
    marginRight: Spacing.sm,
  },
  pill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    minWidth: 36,
    alignItems: "center",
  },
  pillText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
