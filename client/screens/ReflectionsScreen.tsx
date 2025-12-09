import React, { useState } from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, Colors, BorderRadius } from "@/constants/theme";

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
];

export default function ReflectionsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  const currentReflection = DAILY_REFLECTIONS[currentIndex];

  const toggleBookmark = (id: string) => {
    setBookmarked(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

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
        onPress={() => toggleBookmark(currentReflection.id)}
        style={({ pressed }) => [
          styles.bookmarkButton,
          { 
            backgroundColor: bookmarked.has(currentReflection.id) 
              ? Colors.light.secondary 
              : theme.backgroundDefault,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <Feather
          name="heart"
          size={20}
          color={bookmarked.has(currentReflection.id) ? "#FFFFFF" : Colors.light.primary}
        />
        <ThemedText
          style={[
            styles.bookmarkText,
            { color: bookmarked.has(currentReflection.id) ? "#FFFFFF" : Colors.light.primary },
          ]}
        >
          {bookmarked.has(currentReflection.id) ? "Saved" : "Save to Favorites"}
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
