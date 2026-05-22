import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Linking,
  Platform,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  cancelAnimation,
  runOnJS,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { useProfile } from "@/hooks/useProfile";
import { Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type BreathPhase = "inhale" | "hold" | "exhale" | "rest";

const BREATH_PHASES: { phase: BreathPhase; duration: number; label: string }[] =
  [
    { phase: "inhale", duration: 4000, label: "Breathe In" },
    { phase: "hold", duration: 4000, label: "Hold" },
    { phase: "exhale", duration: 6000, label: "Breathe Out" },
    { phase: "rest", duration: 2000, label: "Rest" },
  ];

const GROUNDING_EXERCISES = [
  {
    title: "5-4-3-2-1 Senses",
    icon: "eye" as const,
    steps: [
      "5 things you can SEE",
      "4 things you can TOUCH",
      "3 things you can HEAR",
      "2 things you can SMELL",
      "1 thing you can TASTE",
    ],
  },
  {
    title: "Body Scan",
    icon: "activity" as const,
    steps: [
      "Close your eyes",
      "Notice your feet on the ground",
      "Feel the weight of your body",
      "Relax your shoulders",
      "Unclench your jaw",
    ],
  },
  {
    title: "Safe Place Visualization",
    icon: "sun" as const,
    steps: [
      "Think of a place where you feel safe",
      "Picture every detail of that place",
      "Imagine the sounds you hear there",
      "Feel the temperature on your skin",
      "Stay here as long as you need",
    ],
  },
];

export default function PanicScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { profile, loadProfile } = useProfile();

  const [breathingActive, setBreathingActive] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null);

  const breathScale = useSharedValue(0.6);
  const breathOpacity = useSharedValue(0.4);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile]),
  );

  const hasSponsor = profile.sponsorName && profile.sponsorPhone;

  const makeCall = (number: string) => {
    const phoneUrl = `tel:${number}`;
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(phoneUrl);
        } else {
          Alert.alert(
            "Unable to make call",
            "Phone calling is not supported on this device.",
          );
        }
      })
      .catch(() => {
        Alert.alert("Error", "Could not initiate phone call.");
      });
  };

  const advancePhase = useCallback(
    (index: number) => {
      if (!breathingActive) return;
      setCurrentPhaseIndex(index);
    },
    [breathingActive],
  );

  useEffect(() => {
    if (!breathingActive) {
      cancelAnimation(breathScale);
      cancelAnimation(breathOpacity);
      breathScale.value = withTiming(0.6, { duration: 300 });
      breathOpacity.value = withTiming(0.4, { duration: 300 });
      return;
    }

    let phaseIndex = 0;
    setCurrentPhaseIndex(0);

    const runBreathCycle = () => {
      if (!breathingActive) return;

      const phase = BREATH_PHASES[phaseIndex];
      setCurrentPhaseIndex(phaseIndex);

      if (phase.phase === "inhale") {
        breathScale.value = withTiming(1, {
          duration: phase.duration,
          easing: Easing.inOut(Easing.ease),
        });
        breathOpacity.value = withTiming(0.8, {
          duration: phase.duration,
          easing: Easing.inOut(Easing.ease),
        });
      } else if (phase.phase === "exhale") {
        breathScale.value = withTiming(0.6, {
          duration: phase.duration,
          easing: Easing.inOut(Easing.ease),
        });
        breathOpacity.value = withTiming(0.4, {
          duration: phase.duration,
          easing: Easing.inOut(Easing.ease),
        });
      }

      phaseIndex = (phaseIndex + 1) % BREATH_PHASES.length;
    };

    runBreathCycle();
    const totalCycleDuration = BREATH_PHASES.reduce(
      (sum, p) => sum + p.duration,
      0,
    );
    let elapsed = 0;
    let currentPhase = 0;

    const interval = setInterval(() => {
      elapsed += BREATH_PHASES[currentPhase].duration;
      currentPhase = (currentPhase + 1) % BREATH_PHASES.length;

      const phase = BREATH_PHASES[currentPhase];
      setCurrentPhaseIndex(currentPhase);

      if (phase.phase === "inhale") {
        breathScale.value = withTiming(1, {
          duration: phase.duration,
          easing: Easing.inOut(Easing.ease),
        });
        breathOpacity.value = withTiming(0.8, {
          duration: phase.duration,
          easing: Easing.inOut(Easing.ease),
        });
      } else if (phase.phase === "exhale") {
        breathScale.value = withTiming(0.6, {
          duration: phase.duration,
          easing: Easing.inOut(Easing.ease),
        });
        breathOpacity.value = withTiming(0.4, {
          duration: phase.duration,
          easing: Easing.inOut(Easing.ease),
        });
      }
    }, BREATH_PHASES[currentPhase]?.duration || 4000);

    return () => clearInterval(interval);
  }, [breathingActive]);

  const breathCircleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathScale.value }],
    opacity: breathOpacity.value,
  }));

  const toggleBreathing = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setBreathingActive((prev) => !prev);
  };

  const toggleExercise = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedExercise(expandedExercise === index ? null : index);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.lg,
        paddingBottom: insets.bottom + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
    >
      <ThemedText
        type="body"
        style={[styles.subtitle, { color: theme.textSecondary }]}
      >
        You are not alone. Take a breath. Help is here.
      </ThemedText>

      <View style={styles.quickCallsSection}>
        {hasSponsor ? (
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              makeCall(profile.sponsorPhone);
            }}
            style={({ pressed }) => [
              styles.callButton,
              { backgroundColor: theme.primary, opacity: pressed ? 0.9 : 1 },
            ]}
          >
            <Feather name="user" size={24} color="#FFFFFF" />
            <View style={styles.callButtonText}>
              <ThemedText style={styles.callLabel}>Call Sponsor</ThemedText>
              <ThemedText style={styles.callName}>
                {profile.sponsorName}
              </ThemedText>
            </View>
            <Feather name="phone" size={20} color="#FFFFFF" />
          </Pressable>
        ) : null}

        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            makeCall("988");
          }}
          style={({ pressed }) => [
            styles.callButton,
            { backgroundColor: theme.emergency, opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Feather name="phone" size={24} color="#FFFFFF" />
          <View style={styles.callButtonText}>
            <ThemedText style={styles.callLabel}>
              988 Crisis Lifeline
            </ThemedText>
            <ThemedText style={styles.callSubtext}>Available 24/7</ThemedText>
          </View>
          <Feather name="chevron-right" size={20} color="#FFFFFF" />
        </Pressable>

        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            makeCall("18004574673");
          }}
          style={({ pressed }) => [
            styles.callButton,
            { backgroundColor: theme.accent, opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Feather name="phone-call" size={24} color="#FFFFFF" />
          <View style={styles.callButtonText}>
            <ThemedText style={styles.callLabel}>AA Helpline</ThemedText>
            <ThemedText style={styles.callSubtext}>1-800-457-4673</ThemedText>
          </View>
          <Feather name="chevron-right" size={20} color="#FFFFFF" />
        </Pressable>
      </View>

      <View style={styles.sectionHeader}>
        <ThemedText type="h4">Guided Breathing</ThemedText>
      </View>

      <Card style={styles.breathingCard} elevation={1}>
        <View style={styles.breathingContainer}>
          <View style={styles.breathCircleWrapper}>
            <Animated.View
              style={[
                styles.breathCircle,
                { backgroundColor: theme.primary },
                breathCircleStyle,
              ]}
            />
            <View style={styles.breathLabelOverlay}>
              <ThemedText
                type="h3"
                style={{ color: "#FFFFFF", textAlign: "center" }}
              >
                {breathingActive
                  ? BREATH_PHASES[currentPhaseIndex].label
                  : "Start"}
              </ThemedText>
            </View>
          </View>
          <Pressable
            onPress={toggleBreathing}
            style={({ pressed }) => [
              styles.breathToggle,
              {
                backgroundColor: breathingActive
                  ? theme.emergency + "20"
                  : theme.primary + "20",
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Feather
              name={breathingActive ? "pause" : "play"}
              size={18}
              color={breathingActive ? theme.emergency : theme.primary}
            />
            <ThemedText
              style={{
                color: breathingActive ? theme.emergency : theme.primary,
                fontWeight: "600",
              }}
            >
              {breathingActive ? "Stop" : "Begin Breathing Exercise"}
            </ThemedText>
          </Pressable>
        </View>
      </Card>

      <View style={styles.sectionHeader}>
        <ThemedText type="h4">Grounding Exercises</ThemedText>
      </View>

      {GROUNDING_EXERCISES.map((exercise, index) => (
        <Card
          key={index}
          style={styles.exerciseCard}
          elevation={1}
          onPress={() => toggleExercise(index)}
        >
          <View style={styles.exerciseHeader}>
            <View
              style={[
                styles.exerciseIcon,
                { backgroundColor: theme.primary + "20" },
              ]}
            >
              <Feather name={exercise.icon} size={20} color={theme.primary} />
            </View>
            <ThemedText type="h4" style={styles.exerciseTitle}>
              {exercise.title}
            </ThemedText>
            <Feather
              name={expandedExercise === index ? "chevron-up" : "chevron-down"}
              size={20}
              color={theme.textSecondary}
            />
          </View>
          {expandedExercise === index ? (
            <View style={styles.exerciseSteps}>
              {exercise.steps.map((step, stepIndex) => (
                <View key={stepIndex} style={styles.exerciseStep}>
                  <View
                    style={[
                      styles.stepNumber,
                      { backgroundColor: theme.primary },
                    ]}
                  >
                    <ThemedText style={styles.stepNumberText}>
                      {stepIndex + 1}
                    </ThemedText>
                  </View>
                  <ThemedText type="body" style={styles.stepText}>
                    {step}
                  </ThemedText>
                </View>
              ))}
            </View>
          ) : null}
        </Card>
      ))}

      <View style={styles.sectionHeader}>
        <ThemedText type="h4">More Support</ThemedText>
      </View>

      <Card
        style={styles.resourceCard}
        elevation={1}
        onPress={() => navigation.navigate("MeetingFinder")}
      >
        <View style={styles.resourceRow}>
          <Feather name="map-pin" size={20} color={theme.primary} />
          <ThemedText style={styles.resourceText}>
            Find a nearby meeting
          </ThemedText>
          <Feather name="chevron-right" size={20} color={theme.textSecondary} />
        </View>
      </Card>

      <Card
        style={styles.resourceCard}
        elevation={1}
        onPress={() => navigation.navigate("Support")}
      >
        <View style={styles.resourceRow}>
          <Feather name="heart" size={20} color={theme.emergency} />
          <ThemedText style={styles.resourceText}>
            All support resources
          </ThemedText>
          <Feather name="chevron-right" size={20} color={theme.textSecondary} />
        </View>
      </Card>

      <View
        style={[styles.reminder, { backgroundColor: theme.primary + "10" }]}
      >
        <Feather name="info" size={16} color={theme.primary} />
        <ThemedText type="small" style={{ color: theme.primary, flex: 1 }}>
          This too shall pass. Every moment of strength builds a lifetime of
          recovery.
        </ThemedText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  quickCallsSection: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  callButtonText: {
    flex: 1,
  },
  callLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  callName: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 13,
  },
  callSubtext: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 13,
  },
  sectionHeader: {
    marginBottom: Spacing.md,
  },
  breathingCard: {
    marginBottom: Spacing.xl,
  },
  breathingContainer: {
    alignItems: "center",
  },
  breathCircleWrapper: {
    width: 180,
    height: 180,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xl,
  },
  breathCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    position: "absolute",
  },
  breathLabelOverlay: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  breathToggle: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
  },
  exerciseCard: {
    marginBottom: Spacing.sm,
  },
  exerciseHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  exerciseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  exerciseTitle: {
    flex: 1,
  },
  exerciseSteps: {
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  exerciseStep: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  stepText: {
    flex: 1,
  },
  resourceCard: {
    marginBottom: Spacing.sm,
  },
  resourceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  resourceText: {
    flex: 1,
  },
  reminder: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.lg,
  },
});
