import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, TextInput, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useJournal } from "@/hooks/useJournal";
import { Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

const MOODS = [
  { id: "grateful", label: "Grateful", icon: "smile" },
  { id: "hopeful", label: "Hopeful", icon: "sun" },
  { id: "struggling", label: "Struggling", icon: "cloud" },
  { id: "reflective", label: "Reflective", icon: "moon" },
  { id: "strong", label: "Strong", icon: "zap" },
];

export default function JournalEntryScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "JournalEntry">>();
  const { saveEntry, updateEntry, getEntry, deleteEntry } = useJournal();

  const entryId = route.params?.entryId;
  const isEditing = Boolean(entryId);

  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (entryId) {
      const existingEntry = getEntry(entryId);
      if (existingEntry) {
        setContent(existingEntry.content);
        setSelectedMood(existingEntry.mood || null);
      }
    }
  }, [entryId, getEntry]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleSave = async () => {
    if (!content.trim()) {
      Alert.alert("Empty Entry", "Please write something before saving.");
      return;
    }

    setIsSaving(true);
    
    const entryData = {
      date: today,
      content: content.trim(),
      mood: selectedMood || "",
    };

    let success: boolean;
    if (isEditing && entryId) {
      success = await updateEntry(entryId, entryData);
    } else {
      success = await saveEntry(entryData);
    }

    setIsSaving(false);

    if (success) {
      navigation.goBack();
    } else {
      Alert.alert("Error", "Failed to save entry. Please try again.");
    }
  };

  const handleDelete = () => {
    if (!entryId) return;
    
    Alert.alert(
      "Delete Entry",
      "Are you sure you want to delete this journal entry?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await deleteEntry(entryId);
            if (success) {
              navigation.goBack();
            }
          },
        },
      ]
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()} style={styles.headerButton}>
          <ThemedText style={{ color: theme.primary }}>Cancel</ThemedText>
        </Pressable>
      ),
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          {isEditing ? (
            <Pressable onPress={handleDelete} style={styles.headerButton}>
              <Feather name="trash-2" size={20} color={theme.emergency} />
            </Pressable>
          ) : null}
          <Pressable 
            onPress={handleSave} 
            style={styles.headerButton}
            disabled={isSaving}
          >
            <ThemedText style={{ color: theme.primary, fontWeight: "600", opacity: isSaving ? 0.5 : 1 }}>
              {isSaving ? "Saving..." : "Save"}
            </ThemedText>
          </Pressable>
        </View>
      ),
    });
  }, [navigation, content, selectedMood, theme.primary, theme.emergency, isSaving, isEditing]);

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: Spacing.xl,
        paddingBottom: insets.bottom + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
    >
      <ThemedText type="small" style={[styles.date, { color: theme.textSecondary }]}>
        {today}
      </ThemedText>

      <View style={styles.moodSection}>
        <ThemedText type="h4" style={styles.sectionTitle}>How are you feeling?</ThemedText>
        <View style={styles.moodGrid}>
          {MOODS.map((mood) => (
            <Pressable
              key={mood.id}
              onPress={() => setSelectedMood(mood.id)}
              style={({ pressed }) => [
                styles.moodButton,
                {
                  backgroundColor: selectedMood === mood.id 
                    ? theme.primary 
                    : theme.backgroundDefault,
                  borderColor: selectedMood === mood.id 
                    ? theme.primary 
                    : theme.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Feather
                name={mood.icon as any}
                size={20}
                color={selectedMood === mood.id ? "#FFFFFF" : theme.primary}
              />
              <ThemedText
                style={[
                  styles.moodLabel,
                  { color: selectedMood === mood.id ? "#FFFFFF" : theme.text },
                ]}
              >
                {mood.label}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.entrySection}>
        <ThemedText type="h4" style={styles.sectionTitle}>Write your thoughts</ThemedText>
        <TextInput
          style={[
            styles.textArea,
            {
              backgroundColor: theme.backgroundDefault,
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
          placeholder="What's on your mind today? How is your recovery going?"
          placeholderTextColor={theme.textSecondary}
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />
      </View>

      <View style={styles.promptsSection}>
        <ThemedText type="small" style={[styles.promptsTitle, { color: theme.textSecondary }]}>
          Prompts to consider:
        </ThemedText>
        <ThemedText type="small" style={[styles.prompt, { color: theme.textSecondary }]}>
          - What am I grateful for today?
        </ThemedText>
        <ThemedText type="small" style={[styles.prompt, { color: theme.textSecondary }]}>
          - Did I reach out to someone in my support network?
        </ThemedText>
        <ThemedText type="small" style={[styles.prompt, { color: theme.textSecondary }]}>
          - What step am I working on and how is it going?
        </ThemedText>
      </View>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  date: {
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  moodSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  moodButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  entrySection: {
    marginBottom: Spacing.xl,
  },
  textArea: {
    minHeight: 200,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  promptsSection: {
    padding: Spacing.lg,
    backgroundColor: "rgba(168, 218, 220, 0.2)",
    borderRadius: BorderRadius.md,
  },
  promptsTitle: {
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  prompt: {
    marginBottom: Spacing.xs,
    lineHeight: 20,
  },
});
