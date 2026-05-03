import React from "react";
import { View, StyleSheet, Pressable, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useCommunity } from "@/contexts/CommunityContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getThemeColors, BorderRadius, Spacing } from "@/constants/theme";

export function CommunityBanner() {
  const { path, activeView, setActiveView } = useCommunity();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  if (path !== "Both") return null;

  const aaColors = getThemeColors(colorScheme ?? "light", "AA");
  const naColors = getThemeColors(colorScheme ?? "light", "NA");
  const activeColors = activeView === "AA" ? aaColors : naColors;

  const press = (next: "AA" | "NA") => {
    if (next === activeView) return;
    if (Platform.OS !== "web") {
      Haptics.selectionAsync().catch(() => {});
    }
    setActiveView(next);
  };

  return (
    <View
      style={[
        styles.wrapper,
        {
          paddingTop: insets.top + 4,
          backgroundColor: activeColors.backgroundDefault,
          borderBottomColor: activeColors.border,
        },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.label}>
          <Feather name="repeat" size={12} color={activeColors.textSecondary} />
          <ThemedText
            style={[styles.labelText, { color: activeColors.textSecondary }]}
          >
            Viewing
          </ThemedText>
        </View>

        <View
          style={[
            styles.toggle,
            { backgroundColor: activeColors.backgroundSecondary },
          ]}
        >
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
                {
                  color:
                    activeView === "AA"
                      ? "#FFFFFF"
                      : activeColors.textSecondary,
                },
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
                {
                  color:
                    activeView === "NA"
                      ? "#FFFFFF"
                      : activeColors.textSecondary,
                },
              ]}
            >
              NA
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  labelText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  toggle: {
    flexDirection: "row",
    borderRadius: BorderRadius.full,
    padding: 3,
  },
  pill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    minWidth: 40,
    alignItems: "center",
  },
  pillText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
