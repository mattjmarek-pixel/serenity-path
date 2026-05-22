import React, { useState, useCallback } from "react";
import { View, StyleSheet, TextInput, Alert, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { useGratitude, GratitudeEntry } from "@/hooks/useGratitude";
import { Spacing, BorderRadius } from "@/constants/theme";

export default function GratitudeScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { entries, loadEntries, saveEntry, getTodayEntry } = useGratitude();

  const [item1, setItem1] = useState("");
  const [item2, setItem2] = useState("");
  const [item3, setItem3] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const todayEntry = getTodayEntry();

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [loadEntries]),
  );

  useFocusEffect(
    useCallback(() => {
      if (todayEntry) {
        setItem1(todayEntry.items[0] || "");
        setItem2(todayEntry.items[1] || "");
        setItem3(todayEntry.items[2] || "");
      }
    }, [todayEntry]),
  );

  const handleSave = async () => {
    const items = [item1.trim(), item2.trim(), item3.trim()];
    const filledItems = items.filter((i) => i.length > 0);

    if (filledItems.length === 0) {
      Alert.alert(
        "Hold On",
        "Please write at least one thing you're grateful for.",
      );
      return;
    }

    setIsSaving(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const success = await saveEntry(items);
    setIsSaving(false);

    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Saved", "Your gratitude has been recorded for today.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert("Error", "Failed to save. Please try again.");
    }
  };

  const pastEntries = entries.filter(
    (e) => e.date !== new Date().toISOString().split("T")[0],
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T12:00:00");
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const renderPastEntry = ({ item }: { item: GratitudeEntry }) => (
    <Card style={styles.pastEntryCard} elevation={1}>
      <ThemedText
        type="small"
        style={{ color: theme.textSecondary, marginBottom: Spacing.sm }}
      >
        {formatDate(item.date)}
      </ThemedText>
      {item.items
        .filter((i) => i.length > 0)
        .map((gratitudeItem, index) => (
          <View key={index} style={styles.pastItemRow}>
            <Feather name="heart" size={12} color={theme.accent} />
            <ThemedText style={styles.pastItemText}>{gratitudeItem}</ThemedText>
          </View>
        ))}
    </Card>
  );

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: insets.bottom + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      <View style={styles.headerSection}>
        <View
          style={[styles.iconCircle, { backgroundColor: theme.accent + "20" }]}
        >
          <Feather name="sun" size={32} color={theme.accent} />
        </View>
        <ThemedText type="h3" style={styles.title}>
          {todayEntry ? "Today's Gratitude" : "What Are You Grateful For?"}
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
          {todayEntry
            ? "You can update your gratitude list anytime today."
            : "Take a moment to reflect on 3 things you're grateful for today."}
        </ThemedText>
      </View>

      <View style={styles.inputsSection}>
        {[
          {
            value: item1,
            setter: setItem1,
            placeholder: "I'm grateful for...",
            num: "1",
          },
          {
            value: item2,
            setter: setItem2,
            placeholder: "I'm also grateful for...",
            num: "2",
          },
          {
            value: item3,
            setter: setItem3,
            placeholder: "And I appreciate...",
            num: "3",
          },
        ].map(({ value, setter, placeholder, num }) => (
          <View key={num} style={styles.inputRow}>
            <View
              style={[
                styles.inputNumber,
                { backgroundColor: theme.accent + "20" },
              ]}
            >
              <ThemedText
                type="small"
                style={{ color: theme.accent, fontWeight: "600" }}
              >
                {num}
              </ThemedText>
            </View>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.backgroundDefault,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder={placeholder}
              placeholderTextColor={theme.textSecondary}
              value={value}
              onChangeText={setter}
              multiline
              maxLength={200}
            />
          </View>
        ))}
      </View>

      <View
        style={[
          styles.saveButton,
          {
            backgroundColor: isSaving ? theme.textSecondary : theme.accent,
            opacity: isSaving ? 0.6 : 1,
          },
        ]}
      >
        <ThemedText
          style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 16 }}
          onPress={isSaving ? undefined : handleSave}
        >
          {isSaving
            ? "Saving..."
            : todayEntry
              ? "Update Gratitude"
              : "Save Gratitude"}
        </ThemedText>
      </View>

      {pastEntries.length > 0 ? (
        <View style={styles.pastSection}>
          <ThemedText type="h4" style={styles.pastTitle}>
            Past Gratitude
          </ThemedText>
          {pastEntries.slice(0, 30).map((entry) => (
            <View key={entry.id}>{renderPastEntry({ item: entry })}</View>
          ))}
        </View>
      ) : null}
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: "center",
    lineHeight: 22,
  },
  inputsSection: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  inputNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.md,
  },
  input: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: 16,
    lineHeight: 22,
  },
  saveButton: {
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  pastSection: {
    marginTop: Spacing.md,
  },
  pastTitle: {
    marginBottom: Spacing.md,
  },
  pastEntryCard: {
    marginBottom: Spacing.md,
  },
  pastItemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  pastItemText: {
    flex: 1,
    lineHeight: 22,
  },
});
