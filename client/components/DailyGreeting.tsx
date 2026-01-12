import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, TextInput, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

const STORAGE_KEYS = {
  USER_NAME: "@serenity_path_user_name",
  LAST_GREETING_DATE: "@serenity_path_last_greeting",
};

function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getTodayDateString(): string {
  return new Date().toDateString();
}

interface DailyGreetingProps {
  onDismiss: () => void;
}

export function DailyGreeting({ onDismiss }: DailyGreetingProps) {
  const { theme, isDark } = useTheme();
  const [userName, setUserName] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    checkAndShowGreeting();
  }, []);

  const checkAndShowGreeting = async () => {
    try {
      const lastGreetingDate = await AsyncStorage.getItem(STORAGE_KEYS.LAST_GREETING_DATE);
      const today = getTodayDateString();

      if (lastGreetingDate === today) {
        onDismiss();
        return;
      }

      const storedName = await AsyncStorage.getItem(STORAGE_KEYS.USER_NAME);
      if (storedName) {
        setUserName(storedName);
        setShouldShow(true);
        await AsyncStorage.setItem(STORAGE_KEYS.LAST_GREETING_DATE, today);
      } else {
        setIsEditingName(true);
        setShouldShow(true);
      }
    } catch (error) {
      onDismiss();
    }
  };

  const saveName = async () => {
    if (nameInput.trim()) {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_NAME, nameInput.trim());
        await AsyncStorage.setItem(STORAGE_KEYS.LAST_GREETING_DATE, getTodayDateString());
        setUserName(nameInput.trim());
        setIsEditingName(false);
      } catch (error) {
      }
    }
  };

  const handleDismiss = () => {
    setShouldShow(false);
    onDismiss();
  };

  if (!shouldShow) {
    return null;
  }

  const greeting = getTimeBasedGreeting();

  return (
    <Modal visible={shouldShow} transparent animationType="fade">
      <BlurView intensity={80} tint={isDark ? "dark" : "light"} style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.backgroundDefault }]}>
          {isEditingName ? (
            <>
              <View style={[styles.iconCircle, { backgroundColor: theme.accent + "20" }]}>
                <Feather name="sun" size={40} color={theme.accent} />
              </View>
              <ThemedText type="h2" style={styles.welcomeTitle}>
                Welcome to Serenity Path
              </ThemedText>
              <ThemedText style={[styles.welcomeSubtitle, { color: theme.textSecondary }]}>
                What should we call you?
              </ThemedText>
              <TextInput
                style={[
                  styles.nameInput,
                  { backgroundColor: theme.backgroundSecondary, color: theme.text },
                ]}
                placeholder="Enter your name"
                placeholderTextColor={theme.textSecondary}
                value={nameInput}
                onChangeText={setNameInput}
                autoFocus
              />
              <Pressable
                onPress={saveName}
                disabled={!nameInput.trim()}
                style={({ pressed }) => [
                  styles.continueButton,
                  {
                    backgroundColor: nameInput.trim() ? theme.primary : theme.backgroundSecondary,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <ThemedText style={styles.continueButtonText}>Continue</ThemedText>
              </Pressable>
            </>
          ) : (
            <>
              <View style={[styles.iconCircle, { backgroundColor: theme.accent + "20" }]}>
                <Feather name="sun" size={40} color={theme.accent} />
              </View>
              <ThemedText type="h2" style={styles.greetingText}>
                {greeting}, {userName}
              </ThemedText>
              <ThemedText style={[styles.motivationText, { color: theme.textSecondary }]}>
                One day at a time. You've got this.
              </ThemedText>
              <Pressable
                onPress={handleDismiss}
                style={({ pressed }) => [
                  styles.continueButton,
                  { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <ThemedText style={styles.continueButtonText}>Begin Your Day</ThemedText>
              </Pressable>
            </>
          )}
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  container: {
    width: "100%",
    maxWidth: 340,
    borderRadius: BorderRadius["2xl"],
    padding: Spacing["3xl"],
    alignItems: "center",
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  welcomeTitle: {
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  welcomeSubtitle: {
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  nameInput: {
    width: "100%",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    fontSize: 16,
    marginBottom: Spacing.lg,
    textAlign: "center",
  },
  greetingText: {
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  motivationText: {
    textAlign: "center",
    marginBottom: Spacing["2xl"],
    lineHeight: 24,
  },
  continueButton: {
    width: "100%",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
