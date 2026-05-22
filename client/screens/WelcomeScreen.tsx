import React, { useState } from "react";
import { View, StyleSheet, Pressable, Platform } from "react-native";
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingApple, setLoadingApple] = useState(false);

  const isIOS = Platform.OS === "ios";

  const handleSignInWithApple = async () => {
    setErrorMessage(null);
    setLoadingApple(true);
    try {
      const success = await signInWithApple();
      if (!success) {
        setErrorMessage("Apple Sign-In is only available on iOS devices with a signed-in Apple ID.");
      }
    } catch {
      setErrorMessage("Apple Sign-In is not available right now. Please try continuing without an account.");
    } finally {
      setLoadingApple(false);
    }
  };

  const handleSignInWithGoogle = async () => {
    setErrorMessage(null);
    setLoadingGoogle(true);
    try {
      const success = await signInWithGoogle();
      if (!success) {
        setErrorMessage("Google Sign-In isn't fully set up yet. Please continue without an account for now — all features are available either way.");
      }
    } catch {
      setErrorMessage("Google Sign-In is not available right now. Please continue without an account.");
    } finally {
      setLoadingGoogle(false);
    }
  };

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
          <FeatureItem icon="sunrise" text="Daily reflections and gratitude practice" theme={theme} />
          <FeatureItem icon="award" text="Track sobriety milestones and streaks" theme={theme} />
          <FeatureItem icon="book-open" text="Step work companion and journal" theme={theme} />
          <FeatureItem icon="phone" text="Crisis support when you need it most" theme={theme} />
          <FeatureItem icon="users" text="Built for both AA and NA communities" theme={theme} />
        </View>

        <View style={styles.buttonsSection}>
          {isIOS ? (
            <Pressable
              onPress={handleSignInWithApple}
              disabled={loadingApple}
              style={({ pressed }) => [
                styles.authButton,
                styles.appleButton,
                { opacity: pressed || loadingApple ? 0.7 : 1 },
              ]}
            >
              <Feather name="smartphone" size={20} color="#FFFFFF" />
              <ThemedText style={styles.authButtonText}>
                {loadingApple ? "Signing in..." : "Sign in with Apple"}
              </ThemedText>
            </Pressable>
          ) : null}

          <Pressable
            onPress={handleSignInWithGoogle}
            disabled={loadingGoogle}
            style={({ pressed }) => [
              styles.authButton,
              { backgroundColor: theme.backgroundDefault, borderColor: theme.border, borderWidth: 1, opacity: pressed || loadingGoogle ? 0.7 : 1 },
            ]}
          >
            <Feather name="mail" size={20} color={theme.text} />
            <ThemedText style={[styles.authButtonText, { color: theme.text }]}>
              {loadingGoogle ? "Signing in..." : "Sign in with Google"}
            </ThemedText>
          </Pressable>

          {errorMessage ? (
            <View style={[styles.errorBox, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
              <Feather name="info" size={15} color={theme.textSecondary} />
              <ThemedText type="small" style={{ color: theme.textSecondary, flex: 1, lineHeight: 18 }}>
                {errorMessage}
              </ThemedText>
            </View>
          ) : null}

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            <ThemedText type="small" style={{ color: theme.textSecondary }}>or</ThemedText>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          </View>

          <Pressable
            onPress={continueAsGuest}
            style={({ pressed }) => [styles.guestButton, { opacity: pressed ? 0.6 : 1 }]}
          >
            <ThemedText style={[styles.guestText, { color: theme.primary }]}>
              Continue without an account
            </ThemedText>
          </Pressable>

          <ThemedText type="small" style={[styles.disclaimer, { color: theme.textSecondary }]}>
            Your data is stored locally on your device. Creating an account enables future cloud backup features.
          </ThemedText>

          <ThemedText style={[styles.aaDisclaimer, { color: theme.textSecondary }]}>
            Serenity Path is not affiliated with Alcoholics Anonymous World Services, Inc. This app is an independent tool to support your recovery journey.
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
  errorBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    width: "100%",
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
  aaDisclaimer: {
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xs,
  },
});
