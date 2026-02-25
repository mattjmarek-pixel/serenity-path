import React, { useState, useCallback } from "react";
import { View, StyleSheet, Pressable, TextInput, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useTheme } from "@/hooks/useTheme";
import { useCheckIn, MOOD_OPTIONS } from "@/hooks/useCheckIn";
import { Spacing, BorderRadius } from "@/constants/theme";

export default function CheckInScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { saveCheckIn, getTodayCheckIn } = useCheckIn();

  const todayCheckIn = getTodayCheckIn();
  const [selectedMood, setSelectedMood] = useState<number | null>(todayCheckIn?.mood ?? null);
  const [note, setNote] = useState(todayCheckIn?.note ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const handleMoodSelect = useCallback((value: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedMood(value);
  }, []);

  const handleSave = useCallback(async () => {
    if (selectedMood === null) return;
    setIsSaving(true);
    const success = await saveCheckIn(selectedMood, note.trim());
    setIsSaving(false);
    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.goBack();
    } else {
      Alert.alert("Error", "Could not save your check-in. Please try again.");
    }
  }, [selectedMood, note, saveCheckIn, navigation]);

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: Spacing.xl,
        paddingBottom: insets.bottom + Spacing["3xl"],
        paddingHorizontal: Spacing.lg,
      }}
    >
      <View style={styles.header}>
        <ThemedText type="h2" style={styles.title}>
          How are you feeling today?
        </ThemedText>
        <ThemedText type="body" style={[styles.subtitle, { color: theme.textSecondary }]}>
          Take a moment to check in with yourself
        </ThemedText>
      </View>

      <View style={styles.moodGrid}>
        {MOOD_OPTIONS.map((option) => {
          const isSelected = selectedMood === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => handleMoodSelect(option.value)}
              style={[
                styles.moodOption,
                {
                  backgroundColor: isSelected ? option.color + "20" : theme.backgroundDefault,
                  borderColor: isSelected ? option.color : theme.border,
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
            >
              <View
                style={[
                  styles.moodIconCircle,
                  { backgroundColor: isSelected ? option.color : option.color + "30" },
                ]}
              >
                <Feather
                  name={option.icon}
                  size={28}
                  color={isSelected ? "#FFFFFF" : option.color}
                />
              </View>
              <ThemedText
                type="h4"
                style={[styles.moodLabel, { color: isSelected ? option.color : theme.text }]}
              >
                {option.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.noteSection}>
        <ThemedText type="h4" style={styles.noteLabel}>
          Add a note (optional)
        </ThemedText>
        <TextInput
          style={[
            styles.noteInput,
            {
              backgroundColor: theme.backgroundDefault,
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
          value={note}
          onChangeText={setNote}
          placeholder="What's on your mind?"
          placeholderTextColor={theme.textSecondary}
          multiline
          maxLength={500}
          textAlignVertical="top"
        />
      </View>

      <Pressable
        onPress={handleSave}
        disabled={selectedMood === null || isSaving}
        style={[
          styles.saveButton,
          {
            backgroundColor: selectedMood !== null ? theme.primary : theme.border,
            opacity: isSaving ? 0.6 : 1,
          },
        ]}
      >
        <ThemedText type="body" style={styles.saveButtonText}>
          {todayCheckIn ? "Update Check-In" : "Save Check-In"}
        </ThemedText>
      </Pressable>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing["3xl"],
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: "center",
  },
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: Spacing.md,
    marginBottom: Spacing["3xl"],
  },
  moodOption: {
    width: "28%",
    alignItems: "center",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  moodIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  moodLabel: {
    textAlign: "center",
    fontSize: 14,
  },
  noteSection: {
    marginBottom: Spacing["3xl"],
  },
  noteLabel: {
    marginBottom: Spacing.md,
  },
  noteInput: {
    minHeight: 100,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.lg,
    fontSize: 16,
  },
  saveButton: {
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
