import React, { useLayoutEffect } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { bigBookChapters } from "@/data/bigBook";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type BigBookChapterRouteProp = RouteProp<RootStackParamList, "BigBookChapter">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function BigBookChapterScreen() {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const route = useRoute<BigBookChapterRouteProp>();
  const navigation = useNavigation<NavigationProp>();

  const chapterId = route.params?.chapterId;
  const chapter = chapterId
    ? bigBookChapters.find((c) => c.id === chapterId)
    : null;

  useLayoutEffect(() => {
    if (!chapter) {
      navigation.goBack();
    }
  }, [chapter, navigation]);

  if (!chapter) {
    return null;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: insets.bottom + Spacing["3xl"],
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      <View style={styles.headerSection}>
        <View style={[styles.chapterBadge, { backgroundColor: theme.primary }]}>
          <ThemedText style={styles.chapterBadgeText}>
            Chapter {chapter.id}
          </ThemedText>
        </View>
        <ThemedText type="h2" style={styles.chapterTitle}>
          {chapter.title}
        </ThemedText>
      </View>

      <View
        style={[
          styles.summaryCard,
          { backgroundColor: theme.backgroundSecondary },
        ]}
      >
        <Feather name="file-text" size={18} color={theme.accent} />
        <View style={styles.summaryContent}>
          <ThemedText style={[styles.summaryLabel, { color: theme.accent }]}>
            Chapter Summary
          </ThemedText>
          <ThemedText
            style={[styles.summaryText, { color: theme.textSecondary }]}
          >
            {chapter.summary}
          </ThemedText>
        </View>
      </View>

      <ThemedText type="h3" style={styles.sectionTitle}>
        Overview
      </ThemedText>

      {chapter.content.map((paragraph, index) => (
        <View key={index} style={styles.paragraphContainer}>
          <ThemedText style={styles.paragraphText}>{paragraph}</ThemedText>
        </View>
      ))}

      <View style={[styles.quotesSection, { borderColor: theme.border }]}>
        <ThemedText type="h3" style={styles.sectionTitle}>
          Key Quotes
        </ThemedText>
        {chapter.keyQuotes.map((quote, index) => (
          <View
            key={index}
            style={[
              styles.quoteCard,
              { backgroundColor: theme.backgroundDefault },
            ]}
          >
            <Feather
              name="bookmark"
              size={16}
              color={theme.accent}
              style={styles.quoteIcon}
            />
            <ThemedText style={[styles.quoteText, { fontStyle: "italic" }]}>
              "{quote}"
            </ThemedText>
          </View>
        ))}
      </View>

      <View
        style={[
          styles.reminderCard,
          { backgroundColor: theme.backgroundSecondary },
        ]}
      >
        <Feather name="heart" size={20} color={theme.primary} />
        <ThemedText
          style={[styles.reminderText, { color: theme.textSecondary }]}
        >
          Take time to reflect on how this chapter applies to your own journey.
          Consider discussing your thoughts with a sponsor or trusted friend in
          recovery.
        </ThemedText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    marginBottom: Spacing.xl,
  },
  chapterBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
    marginBottom: Spacing.md,
  },
  chapterBadgeText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12,
  },
  chapterTitle: {
    lineHeight: 36,
  },
  summaryCard: {
    flexDirection: "row",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing["2xl"],
    gap: Spacing.md,
    alignItems: "flex-start",
  },
  summaryContent: {
    flex: 1,
  },
  summaryLabel: {
    fontWeight: "600",
    fontSize: 12,
    marginBottom: Spacing.xs,
  },
  summaryText: {
    lineHeight: 22,
  },
  sectionTitle: {
    marginBottom: Spacing.lg,
  },
  paragraphContainer: {
    marginBottom: Spacing.lg,
  },
  paragraphText: {
    lineHeight: 26,
    fontSize: 16,
  },
  quotesSection: {
    marginTop: Spacing.xl,
    paddingTop: Spacing.xl,
    borderTopWidth: 1,
  },
  quoteCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius["2xl"],
    marginBottom: Spacing.md,
  },
  quoteIcon: {
    marginBottom: Spacing.sm,
  },
  quoteText: {
    lineHeight: 24,
    fontSize: 15,
  },
  reminderCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  reminderText: {
    flex: 1,
    lineHeight: 22,
    fontSize: 14,
  },
});
