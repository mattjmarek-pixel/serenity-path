import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { useBookmarks } from "@/hooks/useBookmarks";
import { Spacing } from "@/constants/theme";

const DAILY_REFLECTIONS = [
  {
    id: "1",
    date: "December 9",
    title: "Step By Step",
    content: "We learn to walk before we can run. In recovery, we take things one day at a time, trusting that each small step leads us toward a healthier, more fulfilling life. Today, focus on the next right thing. The journey of a thousand miles begins with a single step.",
    author: "Anonymous",
  },
  {
    id: "2",
    date: "December 10",
    title: "Gratitude in Action",
    content: "Gratitude is not just a feeling, but a practice. When we actively seek out things to be thankful for, we shift our perspective from what we lack to what we have. Today, let gratitude guide your actions and words.",
    author: "Anonymous",
  },
  {
    id: "3",
    date: "December 11",
    title: "The Power of Connection",
    content: "We cannot recover alone. Connection with others who understand our struggles provides strength, hope, and accountability. Reach out to someone today - a sponsor, a fellow member, or a friend in recovery.",
    author: "Anonymous",
  },
  {
    id: "4",
    date: "December 12",
    title: "Accepting Imperfection",
    content: "Progress, not perfection, is our goal. Recovery is not about becoming perfect; it's about becoming honest, humble, and willing to grow. Embrace your imperfections as opportunities for learning.",
    author: "Anonymous",
  },
  {
    id: "5",
    date: "December 13",
    title: "Living in the Present",
    content: "Yesterday is history, tomorrow is a mystery, but today is a gift - that's why we call it the present. Stay focused on what you can do right now, in this moment, to support your recovery.",
    author: "Anonymous",
  },
  {
    id: "6",
    date: "December 14",
    title: "The Courage to Change",
    content: "Change requires courage. It asks us to let go of familiar patterns, even when they no longer serve us. Today, find the courage to make one small positive change in your life.",
    author: "Anonymous",
  },
  {
    id: "7",
    date: "December 15",
    title: "Serenity Through Surrender",
    content: "When we stop fighting against what we cannot control and surrender to a power greater than ourselves, we find peace. Surrender is not weakness - it is wisdom.",
    author: "Anonymous",
  },
];

export default function SavedReflectionsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { bookmarked, toggleBookmark, isBookmarked } = useBookmarks();

  const savedReflections = DAILY_REFLECTIONS.filter(
    (r) => isBookmarked(`reflection_${r.id}`)
  );

  const renderReflection = ({ item }: { item: typeof DAILY_REFLECTIONS[0] }) => (
    <Card style={styles.reflectionCard}>
      <View style={styles.cardHeader}>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {item.date}
        </ThemedText>
        <Feather name="heart" size={16} color={theme.accent} />
      </View>
      <ThemedText type="h4" style={styles.reflectionTitle}>
        {item.title}
      </ThemedText>
      <ThemedText type="body" style={styles.reflectionContent} numberOfLines={3}>
        {item.content}
      </ThemedText>
      <ThemedText type="small" style={[styles.author, { color: theme.textSecondary }]}>
        - {item.author}
      </ThemedText>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <FlatList
        style={styles.list}
        contentContainerStyle={{
          paddingTop: Spacing.xl,
          paddingBottom: insets.bottom + Spacing.xl,
          paddingHorizontal: Spacing.lg,
        }}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        data={savedReflections}
        keyExtractor={(item) => item.id}
        renderItem={renderReflection}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="heart" size={48} color={theme.textSecondary} />
            <ThemedText type="h4" style={styles.emptyTitle}>No Saved Reflections</ThemedText>
            <ThemedText style={[styles.emptySubtext, { color: theme.textSecondary }]}>
              Save reflections you love by tapping the heart button on the Reflections page
            </ThemedText>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  reflectionCard: {
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  reflectionTitle: {
    marginBottom: Spacing.sm,
  },
  reflectionContent: {
    lineHeight: 24,
    marginBottom: Spacing.sm,
  },
  author: {
    textAlign: "right",
    fontStyle: "italic",
  },
  emptyState: {
    alignItems: "center",
    paddingTop: Spacing["5xl"],
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    marginTop: Spacing.lg,
  },
  emptySubtext: {
    marginTop: Spacing.sm,
    textAlign: "center",
    lineHeight: 22,
  },
});
