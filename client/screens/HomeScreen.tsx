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
import { useGratitude } from "@/hooks/useGratitude";
import { useCheckIn, MOOD_OPTIONS } from "@/hooks/useCheckIn";
import { useStreaks } from "@/hooks/useStreaks";
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
  const { getTodayEntry: getTodayGratitude, loadEntries: loadGratitude } = useGratitude();
  const { getTodayCheckIn, loadCheckIns } = useCheckIn();
  const { checkInStreak, journalStreak, gratitudeStreak, loadStreaks, totalActiveStreaks, bestCurrentStreak } = useStreaks();

  const [timeElapsed, setTimeElapsed] = useState<TimeElapsed | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
      loadGratitude();
      loadCheckIns();
      loadStreaks();
    }, [loadProfile, loadGratitude, loadCheckIns, loadStreaks])
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

  const handleChipsPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("SobrietyChips");
  }, [navigation]);

  const handlePanicPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    navigation.navigate("Panic");
  }, [navigation]);

  const handlePrayersPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("Prayers");
  }, [navigation]);

  const handleGratitudePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("Gratitude");
  }, [navigation]);

  const handleCheckInPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("CheckIn");
  }, [navigation]);

  const handleMoodHistoryPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("MoodHistory");
  }, [navigation]);

  const handleStreaksPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("Streaks");
  }, [navigation]);

  const todayGratitude = getTodayGratitude();
  const todayCheckIn = getTodayCheckIn();
  const todayMoodOption = todayCheckIn ? MOOD_OPTIONS.find((o) => o.value === todayCheckIn.mood) : null;

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

      <Pressable
        onPress={handlePanicPress}
        style={({ pressed }) => [
          styles.panicButton,
          { backgroundColor: theme.emergency, opacity: pressed ? 0.9 : 1 },
        ]}
      >
        <Feather name="alert-circle" size={22} color="#FFFFFF" />
        <ThemedText style={styles.panicButtonText}>I'm Struggling</ThemedText>
        <Feather name="chevron-right" size={18} color="rgba(255,255,255,0.7)" />
      </Pressable>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText type="h4">Daily Check-In</ThemedText>
          {todayCheckIn ? (
            <Pressable onPress={handleMoodHistoryPress} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
              <ThemedText type="small" style={{ color: theme.primary }}>View History</ThemedText>
            </Pressable>
          ) : null}
        </View>
        <Card onPress={handleCheckInPress} elevation={1}>
          {todayCheckIn && todayMoodOption ? (
            <View style={styles.checkInContent}>
              <View style={[styles.checkInMoodDot, { backgroundColor: todayMoodOption.color }]}>
                <Feather name={todayMoodOption.icon} size={20} color="#FFFFFF" />
              </View>
              <View style={styles.checkInInfo}>
                <ThemedText type="h4">Feeling {todayMoodOption.label}</ThemedText>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  Tap to update your check-in
                </ThemedText>
              </View>
              <Feather name="chevron-right" size={18} color={theme.textSecondary} />
            </View>
          ) : (
            <View style={styles.checkInContent}>
              <View style={[styles.checkInMoodDot, { backgroundColor: theme.primary + "20" }]}>
                <Feather name="smile" size={20} color={theme.primary} />
              </View>
              <View style={styles.checkInInfo}>
                <ThemedText type="h4">Check In Today</ThemedText>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  How are you feeling right now?
                </ThemedText>
              </View>
              <Feather name="chevron-right" size={18} color={theme.textSecondary} />
            </View>
          )}
        </Card>
      </View>

      {achievedMilestones.length > 0 ? (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="h4">Milestones Achieved</ThemedText>
            <Pressable onPress={handleChipsPress} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
              <ThemedText type="small" style={{ color: theme.primary }}>View All Chips</ThemedText>
            </Pressable>
          </View>
          <Card onPress={handleChipsPress} elevation={1}>
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
          </Card>
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
        <ThemedText type="h4" style={styles.sectionTitle}>Gratitude</ThemedText>
        <Card onPress={handleGratitudePress} elevation={1}>
          {todayGratitude ? (
            <View style={styles.gratitudeContent}>
              <View style={styles.gratitudeHeader}>
                <Feather name="sun" size={20} color={theme.accent} />
                <ThemedText type="h4" style={{ flex: 1 }}>Today's Gratitude</ThemedText>
                <Feather name="check-circle" size={16} color={theme.success} />
              </View>
              {todayGratitude.items.filter((i) => i.length > 0).map((item, index) => (
                <View key={index} style={styles.gratitudeItemRow}>
                  <Feather name="heart" size={12} color={theme.accent} />
                  <ThemedText type="small" numberOfLines={1} style={{ flex: 1 }}>
                    {item}
                  </ThemedText>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.gratitudeContent}>
              <View style={styles.gratitudeHeader}>
                <Feather name="sun" size={20} color={theme.accent} />
                <ThemedText type="h4" style={{ flex: 1 }}>Write Your Gratitude</ThemedText>
              </View>
              <ThemedText type="small" style={{ color: theme.textSecondary, lineHeight: 20 }}>
                Take a moment to reflect on 3 things you're grateful for today.
              </ThemedText>
              <View style={styles.gratitudeFooter}>
                <ThemedText type="small" style={{ color: theme.accent }}>Get started</ThemedText>
                <Feather name="chevron-right" size={16} color={theme.accent} />
              </View>
            </View>
          )}
        </Card>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText type="h4">Streaks</ThemedText>
          <Pressable onPress={handleStreaksPress} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
            <ThemedText type="small" style={{ color: theme.primary }}>View All</ThemedText>
          </Pressable>
        </View>
        <Card onPress={handleStreaksPress} elevation={1}>
          <View style={styles.streaksContent}>
            <View style={styles.streaksRow}>
              <View style={styles.streakItem}>
                <Feather name="zap" size={16} color={checkInStreak.current > 0 ? theme.primary : theme.textSecondary} />
                <ThemedText type="h4" style={{ color: checkInStreak.current > 0 ? theme.primary : theme.textSecondary }}>
                  {checkInStreak.current}
                </ThemedText>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>Check-In</ThemedText>
              </View>
              <View style={[styles.streakItemDivider, { backgroundColor: theme.border }]} />
              <View style={styles.streakItem}>
                <Feather name="zap" size={16} color={journalStreak.current > 0 ? theme.success : theme.textSecondary} />
                <ThemedText type="h4" style={{ color: journalStreak.current > 0 ? theme.success : theme.textSecondary }}>
                  {journalStreak.current}
                </ThemedText>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>Journal</ThemedText>
              </View>
              <View style={[styles.streakItemDivider, { backgroundColor: theme.border }]} />
              <View style={styles.streakItem}>
                <Feather name="zap" size={16} color={gratitudeStreak.current > 0 ? theme.accent : theme.textSecondary} />
                <ThemedText type="h4" style={{ color: gratitudeStreak.current > 0 ? theme.accent : theme.textSecondary }}>
                  {gratitudeStreak.current}
                </ThemedText>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>Gratitude</ThemedText>
              </View>
            </View>
            {totalActiveStreaks > 0 ? (
              <View style={[styles.streaksBadge, { backgroundColor: theme.accent + "15" }]}>
                <Feather name="zap" size={14} color={theme.accent} />
                <ThemedText type="small" style={{ color: theme.accent, fontWeight: "600" }}>
                  {totalActiveStreaks} active streak{totalActiveStreaks !== 1 ? "s" : ""}
                </ThemedText>
              </View>
            ) : (
              <ThemedText type="small" style={{ color: theme.textSecondary, textAlign: "center" }}>
                Complete daily activities to build streaks
              </ThemedText>
            )}
          </View>
        </Card>
      </View>

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
        <View style={[styles.resourcesGrid, { marginTop: Spacing.md }]}>
          <Card onPress={handlePrayersPress} style={styles.resourceCard} elevation={1}>
            <View style={[styles.resourceIcon, { backgroundColor: theme.secondary + "20" }]}>
              <Feather name="book-open" size={24} color={theme.secondary} />
            </View>
            <ThemedText type="h4" style={styles.resourceTitle}>Prayers</ThemedText>
            <ThemedText type="small" style={[styles.resourceDesc, { color: theme.textSecondary }]}>
              Promises & daily prayers
            </ThemedText>
          </Card>
          <Card onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); navigation.navigate("Journal"); }} style={styles.resourceCard} elevation={1}>
            <View style={[styles.resourceIcon, { backgroundColor: theme.success + "20" }]}>
              <Feather name="edit-3" size={24} color={theme.success} />
            </View>
            <ThemedText type="h4" style={styles.resourceTitle}>Journal</ThemedText>
            <ThemedText type="small" style={[styles.resourceDesc, { color: theme.textSecondary }]}>
              Write your thoughts
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
  panicButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  panicButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
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
  checkInContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  checkInMoodDot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  checkInInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  gratitudeContent: {
    gap: Spacing.sm,
  },
  gratitudeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  gratitudeItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingLeft: Spacing.xs,
  },
  gratitudeFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  streaksContent: {
    gap: Spacing.md,
  },
  streaksRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  streakItem: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.xs,
  },
  streakItemDivider: {
    width: 1,
    height: 36,
  },
  streaksBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
  },
});
