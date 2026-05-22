import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import {
  useBottomTabBarHeight,
  BottomTabNavigationProp,
} from "@react-navigation/bottom-tabs";
import {
  useNavigation,
  CompositeNavigationProp,
  useFocusEffect,
} from "@react-navigation/native";
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
import { getTodayReflection } from "@/constants/reflections";
import { MainTabParamList } from "@/navigation/MainTabNavigator";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { RecoveryErrorFallback } from "@/components/RecoveryErrorFallback";

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

const DAILY_QUOTES = [
  {
    text: "One day at a time. This moment is all you need to manage.",
    author: null,
  },
  {
    text: "Progress, not perfection. Every step forward counts.",
    author: null,
  },
  {
    text: "The secret of change is to focus all your energy on building the new, not fighting the old.",
    author: "Socrates",
  },
  {
    text: "Our greatest glory is not in never falling, but in rising every time we fall.",
    author: "Confucius",
  },
  {
    text: "The journey of a thousand miles begins with a single step.",
    author: "Lao Tzu",
  },
  {
    text: "You are not your past. You are who you choose to become.",
    author: null,
  },
  {
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
  },
  {
    text: "Courage is not the absence of fear, but taking action in spite of it.",
    author: null,
  },
  {
    text: "Recovery is a process, not an event. Be patient with yourself.",
    author: null,
  },
  {
    text: "Every morning you wake up sober is a victory. Celebrate it.",
    author: null,
  },
  {
    text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
    author: "Ralph Waldo Emerson",
  },
  {
    text: "You don't have to see the whole staircase, just take the first step.",
    author: "Martin Luther King Jr.",
  },
  {
    text: "Pain is a signal, not a punishment. It is asking you to grow.",
    author: null,
  },
  {
    text: "Healing is not linear. Some days you will go backwards — and that is part of the path.",
    author: null,
  },
  {
    text: "The bravest thing you ever did was keep going when you wanted to quit.",
    author: null,
  },
  {
    text: "You were not made to be perfect. You were made to be real.",
    author: null,
  },
  {
    text: "In recovery, we do not suffer alone. We find strength in each other.",
    author: null,
  },
  { text: "Fall seven times, stand up eight.", author: "Japanese Proverb" },
  { text: "The moment you accept yourself, you begin to heal.", author: null },
  { text: "Gratitude turns what we have into enough.", author: null },
  {
    text: "Strength does not come from what you can do. It comes from overcoming the things you once thought you could not.",
    author: null,
  },
  {
    text: "You cannot go back and change the beginning, but you can start where you are and change the ending.",
    author: "C.S. Lewis",
  },
  {
    text: "Peace is not the absence of struggle. It is the presence of acceptance.",
    author: null,
  },
  {
    text: "Every day is a new beginning. Take a deep breath and start again.",
    author: null,
  },
  { text: "The only way out is through. Keep moving.", author: null },
  {
    text: "Be gentle with yourself. You are a child of the universe, no less than the trees and the stars.",
    author: "Max Ehrmann",
  },
  {
    text: "Recovery is giving yourself the life you always deserved.",
    author: null,
  },
  {
    text: "It does not matter how slowly you go, so long as you do not stop.",
    author: "Confucius",
  },
  {
    text: "Your story is not over. The best chapters may still be ahead.",
    author: null,
  },
  {
    text: "Asking for help is not a weakness. It is the beginning of strength.",
    author: null,
  },
  {
    text: "The present moment is the only place where life happens. Stay here.",
    author: null,
  },
  {
    text: "You are worthy of recovery. Not because of what you have done, but because of who you are.",
    author: null,
  },
  {
    text: "Let go of what you cannot control. Hold on to what you can.",
    author: null,
  },
  {
    text: "Hope is the thing with feathers that perches in the soul and sings the tune without the words.",
    author: "Emily Dickinson",
  },
  {
    text: "Showing up for yourself, even imperfectly, is an act of courage.",
    author: null,
  },
  {
    text: "Service to others is the rent you pay for your room here on earth.",
    author: "Muhammad Ali",
  },
  { text: "When you cannot find the sunshine, be the sunshine.", author: null },
];

const HALT_OPTIONS = [
  {
    key: "hungry" as const,
    label: "Hungry",
    icon: "coffee" as const,
    color: "#FB8500",
    tip: "Low blood sugar can make everything harder. Have a meal or snack — taking care of your body is part of your recovery.",
  },
  {
    key: "angry" as const,
    label: "Angry",
    icon: "zap" as const,
    color: "#C62828",
    tip: "Anger is a signal, not a command. Try a few slow deep breaths, call your sponsor, or write it out in your journal.",
  },
  {
    key: "lonely" as const,
    label: "Lonely",
    icon: "users" as const,
    color: "#3A9BD9",
    tip: "Isolation is the enemy of recovery. Reach out to your sponsor, go to a meeting, or call someone from your home group.",
  },
  {
    key: "tired" as const,
    label: "Tired",
    icon: "moon" as const,
    color: "#7B3FF2",
    tip: "Rest is not a luxury in recovery — it is essential. Give yourself permission to slow down and recharge today.",
  },
];

type HaltKey = "hungry" | "angry" | "lonely" | "tired";

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getDailyQuote() {
  const day = getDayOfYear();
  return DAILY_QUOTES[day % DAILY_QUOTES.length];
}

function DailyQuoteCard() {
  const { theme } = useTheme();
  const [quote, setQuote] = useState(() => getDailyQuote());

  useFocusEffect(
    useCallback(() => {
      setQuote(getDailyQuote());
    }, []),
  );

  return (
    <Card elevation={1} style={styles.quoteCard}>
      <View style={styles.quoteHeader}>
        <Feather name="sun" size={16} color={theme.accent} />
        <ThemedText
          type="small"
          style={[styles.quoteLabel, { color: theme.accent }]}
        >
          Thought for the Day
        </ThemedText>
      </View>
      <ThemedText style={[styles.quoteText, { color: theme.text }]}>
        "{quote.text}"
      </ThemedText>
      {quote.author ? (
        <ThemedText
          type="small"
          style={[styles.quoteAuthor, { color: theme.textSecondary }]}
        >
          — {quote.author}
        </ThemedText>
      ) : null}
    </Card>
  );
}

function HALTCard() {
  const { theme } = useTheme();
  const [selected, setSelected] = useState<HaltKey | null>(null);

  const selectedOption = HALT_OPTIONS.find((o) => o.key === selected);

  const handlePress = (key: HaltKey) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected((prev) => (prev === key ? null : key));
  };

  return (
    <Card elevation={1} style={styles.haltCard}>
      <ThemedText type="h4" style={styles.haltTitle}>
        How are you right now?
      </ThemedText>
      <ThemedText
        type="small"
        style={[styles.haltSubtitle, { color: theme.textSecondary }]}
      >
        Check in with yourself — are you HALT?
      </ThemedText>
      <View style={styles.haltButtons}>
        {HALT_OPTIONS.map((option) => {
          const isSelected = selected === option.key;
          return (
            <Pressable
              key={option.key}
              onPress={() => handlePress(option.key)}
              style={[
                styles.haltButton,
                {
                  backgroundColor: isSelected
                    ? option.color
                    : option.color + "18",
                  borderColor: isSelected ? option.color : "transparent",
                  borderWidth: 1,
                },
              ]}
            >
              <Feather
                name={option.icon}
                size={18}
                color={isSelected ? "#FFFFFF" : option.color}
              />
              <ThemedText
                style={[
                  styles.haltButtonLabel,
                  { color: isSelected ? "#FFFFFF" : option.color },
                ]}
              >
                {option.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
      {selectedOption ? (
        <View
          style={[
            styles.haltTip,
            { backgroundColor: selectedOption.color + "12" },
          ]}
        >
          <Feather name="heart" size={14} color={selectedOption.color} />
          <ThemedText
            type="small"
            style={[styles.haltTipText, { color: theme.text }]}
          >
            {selectedOption.tip}
          </ThemedText>
        </View>
      ) : null}
    </Card>
  );
}

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
  return MILESTONES.find((m) => m.days > days);
}

function HomeScreenInner() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<HomeNavigationProp>();
  const { profile, loadProfile } = useProfile();
  const { getTodayEntry: getTodayGratitude, loadEntries: loadGratitude } =
    useGratitude();
  const { getTodayCheckIn, loadCheckIns } = useCheckIn();
  const { checkInStreak, journalStreak, gratitudeStreak, loadStreaks } =
    useStreaks();

  const [timeElapsed, setTimeElapsed] = useState<TimeElapsed | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
      loadGratitude();
      loadCheckIns();
      loadStreaks();
    }, [loadProfile, loadGratitude, loadCheckIns, loadStreaks]),
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
  const daysToNextMilestone =
    nextMilestone && timeElapsed ? nextMilestone.days - timeElapsed.days : 0;

  const todayGratitude = getTodayGratitude();
  const todayCheckIn = getTodayCheckIn();
  const todayMoodOption = todayCheckIn
    ? MOOD_OPTIONS.find((o) => o.value === todayCheckIn.mood)
    : null;

  const nav = useCallback(
    (screen: keyof RootStackParamList, heavy?: boolean) => {
      Haptics.impactAsync(
        heavy
          ? Haptics.ImpactFeedbackStyle.Heavy
          : Haptics.ImpactFeedbackStyle.Light,
      );
      navigation.navigate(screen as any);
    },
    [navigation],
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: tabBarHeight + Spacing["3xl"],
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      {/* Daily Quote */}
      <View style={styles.section}>
        <DailyQuoteCard />
      </View>

      {/* Sobriety Counter */}
      {timeElapsed ? (
        <Card
          style={styles.heroCard}
          elevation={1}
          onPress={() => nav("SobrietyChips")}
        >
          <ThemedText
            type="small"
            style={[styles.heroLabel, { color: theme.textSecondary }]}
          >
            Clean & Sober
          </ThemedText>
          <View style={styles.counterRow}>
            <View style={styles.counterItem}>
              <ThemedText
                type="hero"
                style={[styles.counterNumber, { color: theme.primary }]}
              >
                {timeElapsed.days}
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Days
              </ThemedText>
            </View>
            <View
              style={[styles.counterDivider, { backgroundColor: theme.border }]}
            />
            <View style={styles.counterItem}>
              <ThemedText
                type="h2"
                style={[styles.smallCounter, { color: theme.primary }]}
              >
                {String(timeElapsed.hours).padStart(2, "0")}
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Hours
              </ThemedText>
            </View>
            <View
              style={[styles.counterDivider, { backgroundColor: theme.border }]}
            />
            <View style={styles.counterItem}>
              <ThemedText
                type="h2"
                style={[styles.smallCounter, { color: theme.primary }]}
              >
                {String(timeElapsed.minutes).padStart(2, "0")}
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Mins
              </ThemedText>
            </View>
          </View>
          {nextMilestone ? (
            <View
              style={[
                styles.milestonePreview,
                { backgroundColor: theme.accent + "20" },
              ]}
            >
              <Feather name="award" size={14} color={theme.accent} />
              <ThemedText type="small" style={{ color: theme.accent }}>
                {daysToNextMilestone} days until {nextMilestone.label}
              </ThemedText>
            </View>
          ) : null}
        </Card>
      ) : (
        <Card
          style={styles.heroCard}
          elevation={1}
          onPress={() => nav("EditProfile")}
        >
          <View
            style={[styles.setupIcon, { backgroundColor: theme.accent + "20" }]}
          >
            <Feather name="calendar" size={32} color={theme.primary} />
          </View>
          <ThemedText type="h3" style={styles.setupTitle}>
            Start Your Journey
          </ThemedText>
          <ThemedText
            style={[styles.setupSubtitle, { color: theme.textSecondary }]}
          >
            Set your sobriety date to track your progress and celebrate
            milestones
          </ThemedText>
          <View
            style={[styles.setupButton, { backgroundColor: theme.primary }]}
          >
            <ThemedText style={{ color: "#FFFFFF", fontWeight: "600" }}>
              Set Sobriety Date
            </ThemedText>
          </View>
        </Card>
      )}

      <Pressable
        onPress={() => nav("Panic", true)}
        style={({ pressed }) => [
          styles.panicButton,
          { backgroundColor: theme.emergency, opacity: pressed ? 0.9 : 1 },
        ]}
      >
        <Feather name="alert-circle" size={20} color="#FFFFFF" />
        <ThemedText style={styles.panicButtonText}>I'm Struggling</ThemedText>
        <Feather name="chevron-right" size={16} color="rgba(255,255,255,0.6)" />
      </Pressable>

      {/* Today section */}
      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>
          Today
        </ThemedText>
        <View style={styles.todayRow}>
          <Card
            style={styles.todayCard}
            elevation={1}
            onPress={() => nav("CheckIn")}
          >
            {todayCheckIn && todayMoodOption ? (
              <>
                <View
                  style={[
                    styles.todayIconDot,
                    { backgroundColor: todayMoodOption.color },
                  ]}
                >
                  <Feather
                    name={todayMoodOption.icon}
                    size={18}
                    color="#FFFFFF"
                  />
                </View>
                <ThemedText
                  type="small"
                  style={{ fontWeight: "600" }}
                  numberOfLines={1}
                >
                  {todayMoodOption.label}
                </ThemedText>
                <Feather name="check-circle" size={12} color={theme.success} />
              </>
            ) : (
              <>
                <View
                  style={[
                    styles.todayIconDot,
                    { backgroundColor: theme.primary + "20" },
                  ]}
                >
                  <Feather name="smile" size={18} color={theme.primary} />
                </View>
                <ThemedText
                  type="small"
                  style={{ fontWeight: "600", color: theme.primary }}
                >
                  Check In
                </ThemedText>
              </>
            )}
            {checkInStreak.current > 0 ? (
              <View
                style={[
                  styles.streakBadge,
                  { backgroundColor: theme.primary + "15" },
                ]}
              >
                <Feather name="zap" size={10} color={theme.primary} />
                <ThemedText
                  style={[styles.streakBadgeText, { color: theme.primary }]}
                >
                  {checkInStreak.current}
                </ThemedText>
              </View>
            ) : null}
          </Card>

          <Card
            style={styles.todayCard}
            elevation={1}
            onPress={() => nav("Gratitude")}
          >
            {todayGratitude ? (
              <>
                <View
                  style={[
                    styles.todayIconDot,
                    { backgroundColor: theme.accent },
                  ]}
                >
                  <Feather name="sun" size={18} color="#FFFFFF" />
                </View>
                <ThemedText
                  type="small"
                  style={{ fontWeight: "600" }}
                  numberOfLines={1}
                >
                  Grateful
                </ThemedText>
                <Feather name="check-circle" size={12} color={theme.success} />
              </>
            ) : (
              <>
                <View
                  style={[
                    styles.todayIconDot,
                    { backgroundColor: theme.accent + "20" },
                  ]}
                >
                  <Feather name="sun" size={18} color={theme.accent} />
                </View>
                <ThemedText
                  type="small"
                  style={{ fontWeight: "600", color: theme.accent }}
                >
                  Gratitude
                </ThemedText>
              </>
            )}
            {gratitudeStreak.current > 0 ? (
              <View
                style={[
                  styles.streakBadge,
                  { backgroundColor: theme.accent + "15" },
                ]}
              >
                <Feather name="zap" size={10} color={theme.accent} />
                <ThemedText
                  style={[styles.streakBadgeText, { color: theme.accent }]}
                >
                  {gratitudeStreak.current}
                </ThemedText>
              </View>
            ) : null}
          </Card>

          <Card
            style={styles.todayCard}
            elevation={1}
            onPress={() => nav("Journal")}
          >
            <View
              style={[
                styles.todayIconDot,
                { backgroundColor: theme.success + "20" },
              ]}
            >
              <Feather name="edit-3" size={18} color={theme.success} />
            </View>
            <ThemedText
              type="small"
              style={{ fontWeight: "600", color: theme.success }}
            >
              Journal
            </ThemedText>
            {journalStreak.current > 0 ? (
              <View
                style={[
                  styles.streakBadge,
                  { backgroundColor: theme.success + "15" },
                ]}
              >
                <Feather name="zap" size={10} color={theme.success} />
                <ThemedText
                  style={[styles.streakBadgeText, { color: theme.success }]}
                >
                  {journalStreak.current}
                </ThemedText>
              </View>
            ) : null}
          </Card>
        </View>
      </View>

      {/* HALT Check-in */}
      <View style={styles.section}>
        <HALTCard />
      </View>

      {/* Personal Mantra / Affirmation */}
      <View style={styles.section}>
        <Card style={styles.affirmationCard} elevation={1}>
          <ThemedText type="body" style={styles.affirmationText}>
            "
            {profile.personalMantra
              ? profile.personalMantra
              : "Progress, not perfection."}
            "
          </ThemedText>
        </Card>
      </View>

      {/* Today's Reflection */}
      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>
          Today's Reflection
        </ThemedText>
        <Card onPress={() => nav("ReflectionsTab" as any)}>
          <View style={styles.reflectionHeader}>
            <Feather name="book-open" size={18} color={theme.primary} />
            <ThemedText type="h4" style={{ flex: 1 }}>
              {getTodayReflection().title}
            </ThemedText>
            <Feather
              name="chevron-right"
              size={16}
              color={theme.textSecondary}
            />
          </View>
          <ThemedText
            type="small"
            numberOfLines={2}
            style={[styles.reflectionSnippet, { color: theme.textSecondary }]}
          >
            {getTodayReflection().content}
          </ThemedText>
        </Card>
      </View>

      {/* Quick Access */}
      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>
          Quick Access
        </ThemedText>
        <View style={styles.quickAccessRow}>
          <Pressable
            onPress={() => nav("Prayers")}
            style={({ pressed }) => [
              styles.quickAccessItem,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <View
              style={[
                styles.quickAccessIcon,
                { backgroundColor: theme.secondary + "20" },
              ]}
            >
              <Feather name="book-open" size={22} color={theme.secondary} />
            </View>
            <ThemedText type="small" style={styles.quickAccessLabel}>
              Prayers
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={() => nav("BigBook")}
            style={({ pressed }) => [
              styles.quickAccessItem,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <View
              style={[
                styles.quickAccessIcon,
                { backgroundColor: theme.primary + "20" },
              ]}
            >
              <Feather name="book" size={22} color={theme.primary} />
            </View>
            <ThemedText type="small" style={styles.quickAccessLabel}>
              Big Book
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={() => nav("MeetingFinder")}
            style={({ pressed }) => [
              styles.quickAccessItem,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <View
              style={[
                styles.quickAccessIcon,
                { backgroundColor: theme.accent + "20" },
              ]}
            >
              <Feather name="map-pin" size={22} color={theme.accent} />
            </View>
            <ThemedText type="small" style={styles.quickAccessLabel}>
              Meetings
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={() => nav("AudioResources")}
            style={({ pressed }) => [
              styles.quickAccessItem,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <View
              style={[
                styles.quickAccessIcon,
                { backgroundColor: theme.secondary + "20" },
              ]}
            >
              <Feather name="headphones" size={22} color={theme.secondary} />
            </View>
            <ThemedText type="small" style={styles.quickAccessLabel}>
              Audio
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: Spacing["2xl"],
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },

  // Daily Quote
  quoteCard: {
    gap: Spacing.sm,
  },
  quoteHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  quoteLabel: {
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontSize: 11,
  },
  quoteText: {
    fontStyle: "italic",
    lineHeight: 24,
    fontSize: 15,
  },
  quoteAuthor: {
    marginTop: Spacing.xs,
  },

  // HALT Card
  haltCard: {
    gap: Spacing.md,
  },
  haltTitle: {
    marginBottom: 0,
  },
  haltSubtitle: {
    marginTop: -Spacing.xs,
    lineHeight: 18,
  },
  haltButtons: {
    flexDirection: "row",
    gap: Spacing.sm,
    flexWrap: "wrap",
  },
  haltButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  haltButtonLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  haltTip: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  haltTipText: {
    flex: 1,
    lineHeight: 20,
  },

  // Sobriety counter
  heroCard: {
    alignItems: "center",
    marginBottom: Spacing.lg,
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
    height: 36,
  },
  milestonePreview: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
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
  panicButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing["2xl"],
    gap: Spacing.sm,
  },
  panicButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },
  todayRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  todayCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.sm,
    gap: Spacing.xs,
  },
  todayIconDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xs,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: 2,
    marginTop: Spacing.xs,
  },
  streakBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  affirmationCard: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
  affirmationText: {
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 26,
  },
  reflectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  reflectionSnippet: {
    lineHeight: 20,
  },
  quickAccessRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickAccessItem: {
    alignItems: "center",
    gap: Spacing.sm,
    flex: 1,
  },
  quickAccessIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  quickAccessLabel: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default function HomeScreen() {
  return (
    <ErrorBoundary FallbackComponent={RecoveryErrorFallback}>
      <HomeScreenInner />
    </ErrorBoundary>
  );
}
