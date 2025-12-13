import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation, CompositeNavigationProp, useFocusEffect } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { useProfile } from "@/hooks/useProfile";
import { Spacing, BorderRadius } from "@/constants/theme";
import { MainTabParamList } from "@/navigation/MainTabNavigator";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type HomeNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, "HomeTab">,
  NativeStackNavigationProp<RootStackParamList>
>;

const MILESTONES = [
  { days: 1, label: "24 Hours" },
  { days: 7, label: "1 Week" },
  { days: 30, label: "30 Days" },
  { days: 90, label: "90 Days" },
  { days: 180, label: "6 Months" },
  { days: 365, label: "1 Year" },
  { days: 1825, label: "5 Years" },
  { days: 3650, label: "10 Years" },
];

interface TimeElapsed {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeElapsed(startDate: Date): TimeElapsed {
  const now = new Date();
  const diff = now.getTime() - startDate.getTime();
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds };
}

function getNextMilestone(days: number) {
  return MILESTONES.find(m => m.days > days);
}

function getAchievedMilestones(days: number) {
  return MILESTONES.filter(m => days >= m.days);
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<HomeNavigationProp>();
  const { profile, loadProfile, getSobrietyTime } = useProfile();

  const [timeElapsed, setTimeElapsed] = useState<TimeElapsed | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  const sobrietyDate = useMemo(() => {
    if (!profile.sobrietyDate) return null;
    return new Date(profile.sobrietyDate);
  }, [profile.sobrietyDate]);

  useEffect(() => {
    if (!sobrietyDate) {
      setTimeElapsed(null);
      return;
    }
    
    setTimeElapsed(calculateTimeElapsed(sobrietyDate));
    const interval = setInterval(() => {
      setTimeElapsed(calculateTimeElapsed(sobrietyDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [sobrietyDate]);

  const nextMilestone = timeElapsed ? getNextMilestone(timeElapsed.days) : null;
  const achievedMilestones = timeElapsed ? getAchievedMilestones(timeElapsed.days) : [];
  const daysToNextMilestone = nextMilestone && timeElapsed ? nextMilestone.days - timeElapsed.days : 0;

  const handleReflectionPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("ReflectionsTab");
  }, [navigation]);

  const handleBigBookPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("BigBook");
  }, [navigation]);

  const handleMeetingFinderPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("MeetingFinder");
  }, [navigation]);

  const handleSetSobrietyDate = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("EditProfile");
  }, [navigation]);

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
      {timeElapsed ? (
        <Card style={styles.heroCard} elevation={1}>
          <ThemedText type="small" style={[styles.heroLabel, { color: theme.textSecondary }]}>
            Clean & Sober
          </ThemedText>
          <View style={styles.counterRow}>
            <View style={styles.counterItem}>
              <ThemedText type="hero" style={[styles.counterNumber, { color: theme.primary }]}>
                {timeElapsed.days}
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>Days</ThemedText>
            </View>
            <View style={styles.counterDivider} />
            <View style={styles.counterItem}>
              <ThemedText type="h2" style={[styles.smallCounter, { color: theme.primary }]}>
                {String(timeElapsed.hours).padStart(2, "0")}
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>Hours</ThemedText>
            </View>
            <View style={styles.counterDivider} />
            <View style={styles.counterItem}>
              <ThemedText type="h2" style={[styles.smallCounter, { color: theme.primary }]}>
                {String(timeElapsed.minutes).padStart(2, "0")}
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>Mins</ThemedText>
            </View>
          </View>
          {nextMilestone ? (
            <View style={[styles.milestonePreview, { backgroundColor: theme.accent + "30" }]}>
              <Feather name="award" size={16} color={theme.primary} />
              <ThemedText type="small" style={{ color: theme.primary }}>
                {daysToNextMilestone} days until {nextMilestone.label}
              </ThemedText>
            </View>
          ) : null}
        </Card>
      ) : (
        <Card style={styles.heroCard} elevation={1} onPress={handleSetSobrietyDate}>
          <View style={[styles.setupIcon, { backgroundColor: theme.accent + "20" }]}>
            <Feather name="calendar" size={32} color={theme.primary} />
          </View>
          <ThemedText type="h3" style={styles.setupTitle}>Start Your Journey</ThemedText>
          <ThemedText style={[styles.setupSubtitle, { color: theme.textSecondary }]}>
            Set your sobriety date to track your progress and celebrate milestones
          </ThemedText>
          <View style={[styles.setupButton, { backgroundColor: theme.primary }]}>
            <ThemedText style={{ color: "#FFFFFF", fontWeight: "600" }}>Set Sobriety Date</ThemedText>
          </View>
        </Card>
      )}

      {achievedMilestones.length > 0 ? (
        <View style={styles.section}>
          <ThemedText type="h4" style={styles.sectionTitle}>Milestones Achieved</ThemedText>
          <View style={styles.milestonesGrid}>
            {achievedMilestones.map((milestone) => (
              <View
                key={milestone.days}
                style={[styles.milestoneBadge, { backgroundColor: theme.accent }]}
              >
                <Feather name="award" size={16} color="#FFFFFF" />
                <ThemedText style={styles.milestoneBadgeText}>{milestone.label}</ThemedText>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {profile.personalMantra ? (
        <View style={styles.section}>
          <ThemedText type="h4" style={styles.sectionTitle}>Your Mantra</ThemedText>
          <Card style={styles.affirmationCard} elevation={1}>
            <ThemedText type="body" style={styles.affirmationText}>
              "{profile.personalMantra}"
            </ThemedText>
          </Card>
        </View>
      ) : (
        <View style={styles.section}>
          <ThemedText type="h4" style={styles.sectionTitle}>Daily Affirmation</ThemedText>
          <Card style={styles.affirmationCard} elevation={1}>
            <ThemedText type="body" style={styles.affirmationText}>
              "Progress, not perfection."
            </ThemedText>
          </Card>
        </View>
      )}

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>Today's Reflection</ThemedText>
        <Card onPress={handleReflectionPress} style={styles.reflectionPreview}>
          <View style={styles.reflectionHeader}>
            <Feather name="book-open" size={20} color={theme.primary} />
            <ThemedText type="h4" style={styles.reflectionTitle}>Step By Step</ThemedText>
          </View>
          <ThemedText type="body" numberOfLines={2} style={styles.reflectionSnippet}>
            We learn to walk before we can run. In recovery, we take things one day at a time...
          </ThemedText>
          <View style={styles.reflectionFooter}>
            <ThemedText type="small" style={{ color: theme.primary }}>Read more</ThemedText>
            <Feather name="chevron-right" size={16} color={theme.primary} />
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>Quick Stats</ThemedText>
        <View style={styles.statsRow}>
          <Card style={styles.statCard} elevation={1}>
            <Feather name="users" size={24} color={theme.secondary} />
            <ThemedText type="h3" style={styles.statNumber}>12</ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>Meetings</ThemedText>
          </Card>
          <Card style={styles.statCard} elevation={1}>
            <Feather name="edit-3" size={24} color={theme.accent} />
            <ThemedText type="h3" style={styles.statNumber}>8</ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>Journal Entries</ThemedText>
          </Card>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>Resources</ThemedText>
        <View style={styles.resourcesGrid}>
          <Card onPress={handleBigBookPress} style={styles.resourceCard} elevation={1}>
            <View style={[styles.resourceIcon, { backgroundColor: theme.primary + "20" }]}>
              <Feather name="book" size={24} color={theme.primary} />
            </View>
            <ThemedText type="h4" style={styles.resourceTitle}>Big Book</ThemedText>
            <ThemedText type="small" style={[styles.resourceDesc, { color: theme.textSecondary }]}>
              Read chapter summaries
            </ThemedText>
          </Card>
          <Card onPress={handleMeetingFinderPress} style={styles.resourceCard} elevation={1}>
            <View style={[styles.resourceIcon, { backgroundColor: theme.accent + "20" }]}>
              <Feather name="map-pin" size={24} color={theme.accent} />
            </View>
            <ThemedText type="h4" style={styles.resourceTitle}>Meetings</ThemedText>
            <ThemedText type="small" style={[styles.resourceDesc, { color: theme.textSecondary }]}>
              Find nearby AA meetings
            </ThemedText>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroCard: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  heroLabel: {
    marginBottom: Spacing.md,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  counterItem: {
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },
  counterNumber: {
    marginBottom: Spacing.xs,
  },
  smallCounter: {
    marginBottom: Spacing.xs,
  },
  counterDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#E2E8F0",
  },
  milestonePreview: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
  },
  setupIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  setupTitle: {
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  setupSubtitle: {
    textAlign: "center",
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  setupButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  milestonesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  milestoneBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  milestoneBadgeText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12,
  },
  reflectionPreview: {
    gap: Spacing.sm,
  },
  reflectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  reflectionTitle: {
    flex: 1,
  },
  reflectionSnippet: {
    lineHeight: 22,
  },
  reflectionFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    marginVertical: Spacing.sm,
  },
  affirmationCard: {
    alignItems: "center",
    paddingVertical: Spacing["2xl"],
  },
  affirmationText: {
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 26,
  },
  resourcesGrid: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  resourceCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.lg,
  },
  resourceIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  resourceTitle: {
    marginBottom: Spacing.xs,
    textAlign: "center",
  },
  resourceDesc: {
    textAlign: "center",
  },
});
