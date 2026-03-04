import React from "react";
import { View, StyleSheet, Pressable, ScrollView, Linking } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

const AUDIO_RESOURCES = [
  {
    title: "The Big Book",
    url: "https://www.aa.org/the-big-book",
    colors: { bg: "#4A7AE8", accent: "#6FB1FC" },
    iconSide: "right" as const,
  },
  {
    title: "12 Steps and\n12 Traditions",
    url: "https://www.aa.org/twelve-steps-twelve-traditions",
    colors: { bg: "#5EBA7D", accent: "#81D99C" },
    iconSide: "left" as const,
  },
  {
    title: "Joe and Charlie\nBig Book Study",
    url: "https://www.joeandcharlie.net/",
    colors: { bg: "#E8B44A", accent: "#4A7AE8" },
    iconSide: "right" as const,
  },
  {
    title: "Living Sober",
    url: "https://www.aa.org/living-sober-book",
    colors: { bg: "#F28B50", accent: "#FFFFFF" },
    iconSide: "left" as const,
  },
];

function AudioCard({
  title,
  url,
  colors,
  iconSide,
}: (typeof AUDIO_RESOURCES)[0]) {
  const handlePress = () => {
    Linking.openURL(url);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.audioCard,
        { backgroundColor: colors.bg, opacity: pressed ? 0.9 : 1 },
      ]}
    >
      {iconSide === "left" ? (
        <View style={styles.cardContentLeftIcon}>
          <View style={[styles.iconCircle, { backgroundColor: colors.accent + "30" }]}>
            <Feather name="headphones" size={36} color={colors.accent} />
          </View>
          <View style={styles.cardTextRight}>
            <ThemedText style={styles.listenLabel}>Listen to</ThemedText>
            <ThemedText style={styles.cardTitle}>{title}</ThemedText>
          </View>
        </View>
      ) : (
        <View style={styles.cardContentRightIcon}>
          <View style={styles.cardTextLeft}>
            <ThemedText style={styles.listenLabel}>Listen to</ThemedText>
            <ThemedText style={styles.cardTitle}>{title}</ThemedText>
          </View>
          <View style={[styles.iconCircle, { backgroundColor: colors.accent + "30" }]}>
            <Feather name="headphones" size={36} color={colors.accent} />
          </View>
        </View>
      )}
    </Pressable>
  );
}

export default function AudioResourcesScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={[
        styles.scrollContent,
        {
          paddingTop: Spacing.lg,
          paddingBottom: insets.bottom + Spacing.xl,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.headerNote, { backgroundColor: theme.backgroundSecondary }]}>
        <Feather name="info" size={16} color={theme.textSecondary} />
        <ThemedText type="small" style={{ color: theme.textSecondary, flex: 1, lineHeight: 20 }}>
          These links open official AA and community audio resources in your browser. Audio content is hosted by the respective organizations.
        </ThemedText>
      </View>

      {AUDIO_RESOURCES.map((resource) => (
        <AudioCard key={resource.url} {...resource} />
      ))}

      <ThemedText
        type="small"
        style={[styles.disclaimer, { color: theme.textSecondary }]}
      >
        Audio resources are provided by Alcoholics Anonymous World Services and community contributors. This app is not affiliated with these organizations.
      </ThemedText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  headerNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  audioCard: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    minHeight: 120,
  },
  cardContentLeftIcon: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  cardContentRightIcon: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  cardTextLeft: {
    flex: 1,
  },
  cardTextRight: {
    flex: 1,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  listenLabel: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 28,
  },
  disclaimer: {
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
  },
});
