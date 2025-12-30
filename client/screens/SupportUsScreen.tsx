import React from "react";
import { View, StyleSheet, Pressable, Linking } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

export default function SupportUsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();

  const handleMonthlySupport = () => {
    Linking.openURL("https://www.buymeacoffee.com");
  };

  const handleYearlySupport = () => {
    Linking.openURL("https://www.buymeacoffee.com");
  };

  const handleRestorePurchases = () => {
    // Placeholder for restore purchases functionality
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundRoot,
          paddingTop: headerHeight + Spacing.xl,
          paddingBottom: insets.bottom + Spacing.xl,
        },
      ]}
    >
      <View style={styles.content}>
        <Feather
          name="heart"
          size={48}
          color={theme.primary}
          style={styles.icon}
        />

        <ThemedText style={styles.title}>Support Us</ThemedText>

        <ThemedText style={[styles.description, { color: theme.textSecondary }]}>
          Support the effort required to maintain the app with a recurring
          contribution. Cancel anytime. A supporter badge will appear on your
          profile every month that you are a supporter.
        </ThemedText>

        <Pressable
          style={[styles.primaryButton, { backgroundColor: theme.primary }]}
          onPress={handleMonthlySupport}
        >
          <ThemedText style={styles.buttonText}>$1.99 / month</ThemedText>
        </Pressable>

        <ThemedText style={[styles.orText, { color: theme.textSecondary }]}>
          or
        </ThemedText>

        <Pressable
          style={[styles.primaryButton, { backgroundColor: theme.primary }]}
          onPress={handleYearlySupport}
        >
          <ThemedText style={styles.buttonText}>$19.99 / year</ThemedText>
        </Pressable>

        <View style={styles.linksContainer}>
          <Pressable onPress={() => Linking.openURL("https://example.com/terms")}>
            <ThemedText style={[styles.linkText, { color: theme.primary }]}>
              Terms of Service
            </ThemedText>
          </Pressable>
          <ThemedText style={[styles.linkSeparator, { color: theme.textSecondary }]}>
            {" | "}
          </ThemedText>
          <Pressable onPress={() => Linking.openURL("https://example.com/privacy")}>
            <ThemedText style={[styles.linkText, { color: theme.primary }]}>
              Privacy Policy
            </ThemedText>
          </Pressable>
        </View>

        <Pressable onPress={handleRestorePurchases} style={styles.restoreButton}>
          <ThemedText style={[styles.restoreText, { color: theme.primary }]}>
            Restore Purchases
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  primaryButton: {
    width: "100%",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  orText: {
    fontSize: 14,
    marginVertical: Spacing.sm,
  },
  linksContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.xl,
  },
  linkText: {
    fontSize: 14,
  },
  linkSeparator: {
    fontSize: 14,
  },
  restoreButton: {
    marginTop: Spacing.lg,
    padding: Spacing.sm,
  },
  restoreText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
