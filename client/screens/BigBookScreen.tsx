import React, { useState } from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import {
  bigBookChapters,
  bigBookDisclaimer,
  BigBookChapter,
} from "@/data/bigBook";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function BigBookScreen() {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [expandedChapter, setExpandedChapter] = useState<number | null>(null);

  const toggleChapter = (chapterId: number) => {
    setExpandedChapter((prev) => (prev === chapterId ? null : chapterId));
  };

  const navigateToChapter = (chapter: BigBookChapter) => {
    navigation.navigate("BigBookChapter", { chapterId: chapter.id });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: insets.bottom + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      <View
        style={[
          styles.disclaimerCard,
          { backgroundColor: theme.backgroundSecondary },
        ]}
      >
        <Feather name="info" size={18} color={theme.textSecondary} />
        <ThemedText
          style={[styles.disclaimerText, { color: theme.textSecondary }]}
        >
          {bigBookDisclaimer}
        </ThemedText>
      </View>

      <ThemedText type="h3" style={styles.sectionTitle}>
        Chapters
      </ThemedText>

      {bigBookChapters.map((chapter) => (
        <View
          key={chapter.id}
          style={[
            styles.chapterCard,
            { backgroundColor: theme.backgroundDefault },
          ]}
        >
          <Pressable
            onPress={() => toggleChapter(chapter.id)}
            style={({ pressed }) => [
              styles.chapterHeader,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <View style={styles.chapterHeaderLeft}>
              <View
                style={[
                  styles.chapterNumber,
                  { backgroundColor: theme.primary },
                ]}
              >
                <ThemedText style={styles.chapterNumberText}>
                  {chapter.id}
                </ThemedText>
              </View>
              <View style={styles.chapterInfo}>
                <ThemedText
                  type="h4"
                  numberOfLines={2}
                  style={styles.chapterTitle}
                >
                  {chapter.title}
                </ThemedText>
              </View>
            </View>
            <Feather
              name={
                expandedChapter === chapter.id ? "chevron-up" : "chevron-down"
              }
              size={20}
              color={theme.textSecondary}
            />
          </Pressable>

          {expandedChapter === chapter.id ? (
            <View style={styles.chapterContent}>
              <ThemedText
                style={[styles.summaryText, { color: theme.textSecondary }]}
              >
                {chapter.summary}
              </ThemedText>

              <View
                style={[
                  styles.quoteSection,
                  { backgroundColor: theme.backgroundSecondary },
                ]}
              >
                <Feather
                  name="bookmark"
                  size={16}
                  color={theme.accent}
                  style={styles.quoteIcon}
                />
                <ThemedText
                  style={[styles.quoteLabel, { color: theme.accent }]}
                >
                  Key Quote
                </ThemedText>
                <ThemedText style={[styles.quoteText, { fontStyle: "italic" }]}>
                  "{chapter.keyQuotes[0]}"
                </ThemedText>
              </View>

              <Pressable
                onPress={() => navigateToChapter(chapter)}
                style={({ pressed }) => [
                  styles.readButton,
                  {
                    backgroundColor: theme.primary,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <ThemedText style={styles.readButtonText}>
                  View Summary
                </ThemedText>
                <Feather name="arrow-right" size={18} color="#FFFFFF" />
              </Pressable>
            </View>
          ) : null}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  disclaimerCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  sectionTitle: {
    marginBottom: Spacing.lg,
  },
  chapterCard: {
    borderRadius: BorderRadius["2xl"],
    marginBottom: Spacing.md,
    overflow: "hidden",
  },
  chapterHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
  },
  chapterHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  chapterNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  chapterNumberText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  chapterInfo: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  chapterTitle: {
    flex: 1,
  },
  chapterContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    paddingTop: 0,
  },
  summaryText: {
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  quoteSection: {
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.lg,
  },
  quoteIcon: {
    marginBottom: Spacing.xs,
  },
  quoteLabel: {
    fontWeight: "600",
    fontSize: 12,
    marginBottom: Spacing.xs,
  },
  quoteText: {
    lineHeight: 22,
  },
  readButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    gap: Spacing.sm,
  },
  readButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
