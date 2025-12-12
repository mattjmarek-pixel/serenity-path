import React, { useState } from "react";
import { View, StyleSheet, Pressable, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
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

  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleSave = () => {
    navigation.goBack();
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()} style={styles.headerButton}>
          <ThemedText style={{ color: theme.primary }}>Cancel</ThemedText>
        </Pressable>
      ),
      headerRight: () => (
        <Pressable onPress={handleSave} style={styles.headerButton}>
          <ThemedText style={{ color: theme.primary, fontWeight: "600" }}>Save</ThemedText>
        </Pressable>
      ),
    });
  }, [navigation, content, selectedMood, theme.primary]);

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
