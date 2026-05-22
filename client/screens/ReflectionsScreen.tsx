import React, { useState } from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { useBookmarks } from "@/hooks/useBookmarks";
import { Spacing, BorderRadius } from "@/constants/theme";
import { DAILY_REFLECTIONS, getTodayIndex } from "@/constants/reflections";

export default function ReflectionsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(getTodayIndex);
  const { bookmarked, toggleBookmark, isBookmarked } = useBookmarks();

  const currentReflection = DAILY_REFLECTIONS[currentIndex];

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < DAILY_REFLECTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleToggleBookmark = () => {
    toggleBookmark(`reflection_${currentReflection.id}`);
  };

  const isCurrentBookmarked = isBookmarked(
    `reflection_${currentReflection.id}`,
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: tabBarHeight + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      <View style={styles.dateNavigation}>
        <Pressable
          onPress={goToPrevious}
          style={({ pressed }) => [
            styles.navButton,
            { opacity: pressed ? 0.6 : currentIndex === 0 ? 0.3 : 1 },
          ]}
          disabled={currentIndex === 0}
        >
          <Feather name="chevron-left" size={24} color={theme.text} />
        </Pressable>
        <ThemedText type="h4">{currentReflection.date}</ThemedText>
        <Pressable
          onPress={goToNext}
          style={({ pressed }) => [
            styles.navButton,
            {
              opacity: pressed
                ? 0.6
                : currentIndex === DAILY_REFLECTIONS.length - 1
                  ? 0.3
                  : 1,
            },
          ]}
          disabled={currentIndex === DAILY_REFLECTIONS.length - 1}
        >
          <Feather name="chevron-right" size={24} color={theme.text} />
        </Pressable>
      </View>

      <Card style={styles.reflectionCard}>
        <ThemedText type="h3" style={styles.reflectionTitle}>
          {currentReflection.title}
        </ThemedText>
        <ThemedText type="body" style={styles.reflectionContent}>
          {currentReflection.content}
        </ThemedText>
        <ThemedText
          type="small"
          style={[styles.author, { color: theme.textSecondary }]}
        >
          - {currentReflection.author}
        </ThemedText>
      </Card>

      <Pressable
        onPress={handleToggleBookmark}
        style={({ pressed }) => [
          styles.bookmarkButton,
          {
            backgroundColor: isCurrentBookmarked
              ? theme.accent
              : theme.backgroundDefault,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <Feather
          name="heart"
          size={20}
          color={isCurrentBookmarked ? "#FFFFFF" : theme.primary}
        />
        <ThemedText
          style={[
            styles.bookmarkText,
            { color: isCurrentBookmarked ? "#FFFFFF" : theme.primary },
          ]}
        >
          {isCurrentBookmarked ? "Saved" : "Save to Favorites"}
        </ThemedText>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dateNavigation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.xl,
  },
  navButton: {
    padding: Spacing.sm,
  },
  reflectionCard: {
    marginBottom: Spacing.xl,
  },
  reflectionTitle: {
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  reflectionContent: {
    lineHeight: 28,
    marginBottom: Spacing.lg,
  },
  author: {
    textAlign: "right",
    fontStyle: "italic",
  },
  bookmarkButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  bookmarkText: {
    fontWeight: "600",
  },
});
