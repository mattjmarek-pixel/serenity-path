import React from "react";
import { View, StyleSheet, Pressable, Platform, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { Spacing, BorderRadius } from "@/constants/theme";

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { signInWithApple, signInWithGoogle, continueAsGuest } = useAuth();

  const isIOS = Platform.OS === "ios";

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <View style={[styles.content, { paddingTop: insets.top + Spacing["3xl"], paddingBottom: insets.bottom + Spacing.xl }]}>
        <View style={styles.headerSection}>
          <View style={[styles.logoContainer, { backgroundColor: theme.primary + "15" }]}>
            <Feather name="heart" size={48} color={theme.primary} />
          </View>
          <ThemedText style={[styles.appName, { color: theme.text }]}>Serenity Path</ThemedText>
          <ThemedText style={[styles.tagline, { color: theme.textSecondary }]}>
            Your daily companion in recovery
          </ThemedText>
        </View>

        <View style={styles.featuresSection}>
          <FeatureItem
            icon="sunrise"
            text="Daily reflections and gratitude practice"
            theme={theme}
          />
          <FeatureItem
            icon="award"
            text="Track sobriety milestones and streaks"
            theme={theme}
          />
          <FeatureItem
            icon="book-open"
            text="Step work companion and journal"
            theme={theme}
          />
          <FeatureItem
            icon="phone"
            text="Crisis support when you need it most"
            theme={theme}
          />
        </View>

        <View style={styles.buttonsSection}>
          {isIOS ? (
            <Pressable
              onPress={signInWithApple}
              style={({ pressed }) => [
                styles.authButton,
                styles.appleButton,
                { opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Feather name="smartphone" size={20} color="#FFFFFF" />
              <ThemedText style={styles.authButtonText}>Sign in with Apple</ThemedText>
            </Pressable>
          ) : null}

          <Pressable
            onPress={signInWithGoogle}
            style={({ pressed }) => [
              styles.authButton,
              { backgroundColor: theme.backgroundDefault, borderColor: theme.border, borderWidth: 1, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Feather name="mail" size={20} color={theme.text} />
            <ThemedText style={[styles.authButtonText, { color: theme.text }]}>
              Sign in with Google
            </ThemedText>
          </Pressable>

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            <ThemedText type="small" style={{ color: theme.textSecondary }}>or</ThemedText>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          </View>

          <Pressable
            onPress={continueAsGuest}
            style={({ pressed }) => [
              styles.guestButton,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <ThemedText style={[styles.guestText, { color: theme.primary }]}>
              Continue without an account
            </ThemedText>
          </Pressable>

          <ThemedText type="small" style={[styles.disclaimer, { color: theme.textSecondary }]}>
            Your data is stored locally on your device. Creating an account enables future cloud backup features.
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

function FeatureItem({ icon, text, theme }: { icon: string; text: string; theme: any }) {
  return (
    <View style={styles.featureItem}>
      <View style={[styles.featureIcon, { backgroundColor: theme.primary + "15" }]}>
        <Feather name={icon as any} size={18} color={theme.primary} />
      </View>
      <ThemedText type="small" style={{ flex: 1, color: theme.textSecondary, lineHeight: 20 }}>
        {text}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: "space-between",
  },
  headerSection: {
    alignItems: "center",
    marginTop: Spacing["2xl"],
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  appName: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: Spacing.sm,
  },
  tagline: {
    fontSize: 16,
    textAlign: "center",
  },
  featuresSection: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonsSection: {
    gap: Spacing.md,
    alignItems: "center",
  },
  authButton: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  appleButton: {
    backgroundColor: "#000000",
  },
  authButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    width: "100%",
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  guestButton: {
    paddingVertical: Spacing.md,
  },
  guestText: {
    fontSize: 16,
    fontWeight: "600",
  },
  disclaimer: {
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: Spacing.lg,
  },
});
