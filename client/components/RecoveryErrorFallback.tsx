import React from "react";
import { View, StyleSheet, Pressable, Linking, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import type { ErrorFallbackProps } from "@/components/ErrorFallback";

export function RecoveryErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const { theme } = useTheme();

  React.useEffect(() => {
    if (__DEV__ && error) {
      console.error("[RecoveryErrorFallback]", error);
    }
  }, [error]);

  const callCrisisLine = () => {
    Linking.openURL(Platform.OS === "web" ? "tel:988" : "tel://988").catch(() => {});
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      accessibilityRole="alert"
    >
      <View style={[styles.iconWrap, { backgroundColor: theme.primary + "15" }]}>
        <Feather name="heart" size={36} color={theme.primary} />
      </View>

      <ThemedText style={[styles.title, { color: theme.text }]}>
        Something went wrong.
      </ThemedText>
      <ThemedText style={[styles.body, { color: theme.textSecondary }]}>
        If you need immediate help, call 988 or your sponsor.
      </ThemedText>

      <Pressable
        onPress={callCrisisLine}
        style={({ pressed }) => [
          styles.crisisButton,
          { backgroundColor: theme.emergency, opacity: pressed ? 0.8 : 1 },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Call 988 crisis line"
      >
        <Feather name="phone" size={18} color="#FFFFFF" />
        <ThemedText style={styles.crisisText}>Call 988</ThemedText>
      </Pressable>

      <Pressable
        onPress={resetError}
        style={({ pressed }) => [
          styles.tryAgain,
          {
            borderColor: theme.border,
            backgroundColor: theme.backgroundDefault,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Try again"
      >
        <ThemedText style={[styles.tryAgainText, { color: theme.text }]}>
          Try again
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  body: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  crisisButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    minWidth: 200,
  },
  crisisText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  tryAgain: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    minWidth: 200,
    alignItems: "center",
    marginTop: Spacing.xs,
  },
  tryAgainText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
