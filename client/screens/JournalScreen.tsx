import React, { useState } from "react";
import { View, StyleSheet, Pressable, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

interface JournalEntry {
  id: string;
  date: string;
  preview: string;
  mood: string;
  content: string;
}

const MOOD_ICONS: Record<string, string> = {
  grateful: "smile",
  hopeful: "sun",
  struggling: "cloud",
  reflective: "moon",
  strong: "zap",
};

export default function JournalScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: "1",
      date: "December 9, 2025",
      preview: "Today I attended my morning meeting and felt a sense of peace I haven't felt in a long time...",
      mood: "grateful",
      content: "Today I attended my morning meeting and felt a sense of peace I haven't felt in a long time. Speaking with my sponsor helped me realize how far I've come.",
    },
    {
      id: "2",
      date: "December 8, 2025",
      preview: "Had a challenging day at work but stayed focused on my recovery...",
      mood: "strong",
      content: "Had a challenging day at work but stayed focused on my recovery. Called my sponsor when I felt triggered and we talked through it together.",
    },
  ]);

  const renderEntry = ({ item }: { item: JournalEntry }) => (
    <Card
      style={styles.entryCard}
      onPress={() => navigation.navigate("JournalEntry", { entryId: item.id })}
    >
      <View style={styles.entryHeader}>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {item.date}
        </ThemedText>
        <View style={[styles.moodBadge, { backgroundColor: theme.accent + "30" }]}>
          <Feather
            name={MOOD_ICONS[item.mood] as any || "circle"}
            size={14}
            color={theme.primary}
          />
        </View>
      </View>
      <ThemedText type="body" numberOfLines={2} style={styles.entryPreview}>
        {item.preview}
      </ThemedText>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <FlatList
        style={styles.list}
        contentContainerStyle={{
          paddingTop: headerHeight + Spacing.xl,
          paddingBottom: insets.bottom + Spacing.xl,
          paddingHorizontal: Spacing.lg,
        }}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={renderEntry}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="edit-3" size={48} color={theme.textSecondary} />
            <ThemedText type="h4" style={styles.emptyTitle}>No Journal Entries</ThemedText>
            <ThemedText style={[styles.emptySubtext, { color: theme.textSecondary }]}>
              Start documenting your recovery journey
            </ThemedText>
          </View>
        }
      />
      <Pressable
        onPress={() => navigation.navigate("JournalEntry")}
        style={({ pressed }) => [
          styles.fab,
          { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 },
          { bottom: insets.bottom + Spacing.xl },
        ]}
      >
        <Feather name="plus" size={24} color="#FFFFFF" />
      </Pressable>
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
  entryCard: {
    marginBottom: Spacing.md,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  moodBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  entryPreview: {
    lineHeight: 22,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: Spacing["5xl"],
  },
  emptyTitle: {
    marginTop: Spacing.lg,
  },
  emptySubtext: {
    marginTop: Spacing.sm,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
});
