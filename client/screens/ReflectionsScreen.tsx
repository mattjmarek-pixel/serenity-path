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

export default function ReflectionsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
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

  const isCurrentBookmarked = isBookmarked(`reflection_${currentReflection.id}`);

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
            { opacity: pressed ? 0.6 : currentIndex === DAILY_REFLECTIONS.length - 1 ? 0.3 : 1 },
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
        <ThemedText type="small" style={[styles.author, { color: theme.textSecondary }]}>
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
