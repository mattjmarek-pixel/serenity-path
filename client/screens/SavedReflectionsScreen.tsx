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
import { DAILY_REFLECTIONS, DailyReflection } from "@/constants/reflections";

export default function SavedReflectionsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { bookmarked, toggleBookmark, isBookmarked } = useBookmarks();

  const savedReflections = DAILY_REFLECTIONS.filter((r) =>
    isBookmarked(`reflection_${r.id}`),
  );

  const renderReflection = ({ item }: { item: DailyReflection }) => (
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
      <ThemedText
        type="body"
        style={styles.reflectionContent}
        numberOfLines={3}
      >
        {item.content}
      </ThemedText>
      <ThemedText
        type="small"
        style={[styles.author, { color: theme.textSecondary }]}
      >
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
            <ThemedText type="h4" style={styles.emptyTitle}>
              No Saved Reflections
            </ThemedText>
            <ThemedText
              style={[styles.emptySubtext, { color: theme.textSecondary }]}
            >
              Save reflections you love by tapping the heart button on the
              Reflections page
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
