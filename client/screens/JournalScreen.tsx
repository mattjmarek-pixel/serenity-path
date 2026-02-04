import React from "react";
import { View, StyleSheet, Pressable, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { useJournal, JournalEntry } from "@/hooks/useJournal";
import { Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

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
  const { entries, loadEntries } = useJournal();

  useFocusEffect(
    React.useCallback(() => {
      loadEntries();
    }, [loadEntries])
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getPreview = (content: string) => {
    if (content.length <= 100) return content;
    return content.substring(0, 100) + "...";
  };

  const renderEntry = ({ item }: { item: JournalEntry }) => (
    <Card
      style={styles.entryCard}
      onPress={() => navigation.navigate("JournalEntry", { entryId: item.id })}
    >
      <View style={styles.entryHeader}>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {formatDate(item.createdAt)}
        </ThemedText>
        {item.mood ? (
          <View style={[styles.moodBadge, { backgroundColor: theme.accent + "30" }]}>
            <Feather
              name={MOOD_ICONS[item.mood] as any || "circle"}
              size={14}
              color={theme.primary}
            />
          </View>
        ) : null}
      </View>
      <ThemedText type="body" numberOfLines={2} style={styles.entryPreview}>
        {getPreview(item.content)}
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
