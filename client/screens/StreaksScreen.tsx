import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { useStreaks, StreakData } from "@/hooks/useStreaks";
import { Spacing, BorderRadius } from "@/constants/theme";

interface StreakCardProps {
  title: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
  streak: StreakData;
}

function StreakCard({ title, icon, color, streak }: StreakCardProps) {
  const { theme } = useTheme();

  return (
    <Card elevation={1} style={styles.streakCard}>
      <View style={styles.streakCardHeader}>
        <View style={[styles.streakIconContainer, { backgroundColor: color + "20" }]}>
          <Feather name={icon} size={22} color={color} />
        </View>
        <View style={styles.streakCardInfo}>
          <ThemedText type="h4">{title}</ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {streak.current > 0 ? "Active streak" : "No active streak"}
          </ThemedText>
        </View>
      </View>

      <View style={styles.streakStatsRow}>
        <View style={styles.streakStat}>
          <View style={styles.streakCountRow}>
            <Feather
              name="zap"
              size={20}
              color={streak.current > 0 ? color : theme.textSecondary}
            />
            <ThemedText
              type="h2"
              style={{ color: streak.current > 0 ? color : theme.textSecondary }}
            >
              {streak.current}
            </ThemedText>
          </View>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            Current
          </ThemedText>
        </View>

        <View style={[styles.streakDivider, { backgroundColor: theme.border }]} />

        <View style={styles.streakStat}>
          <View style={styles.streakCountRow}>
            <Feather name="award" size={20} color={theme.accent} />
            <ThemedText type="h2" style={{ color: theme.accent }}>
              {streak.longest}
            </ThemedText>
          </View>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            Longest
          </ThemedText>
        </View>
      </View>

      {streak.current > 0 ? (
        <View style={[styles.activeBadge, { backgroundColor: color + "15" }]}>
          <Feather name="zap" size={14} color={color} />
          <ThemedText type="small" style={{ color, fontWeight: "600" }}>
            {streak.current} day{streak.current !== 1 ? "s" : ""} strong
          </ThemedText>
        </View>
      ) : null}
    </Card>
  );
}

export default function StreaksScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { checkInStreak, journalStreak, gratitudeStreak, loadStreaks, totalActiveStreaks, bestCurrentStreak } = useStreaks();

  useFocusEffect(
    React.useCallback(() => {
      loadStreaks();
    }, [loadStreaks])
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: insets.bottom + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      <Card elevation={1} style={styles.summaryCard}>
        <View style={[styles.summaryIcon, { backgroundColor: theme.accent + "20" }]}>
          <Feather name="zap" size={32} color={theme.accent} />
        </View>
        <ThemedText type="h2" style={{ color: theme.accent }}>
          {totalActiveStreaks}
        </ThemedText>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          Active Streak{totalActiveStreaks !== 1 ? "s" : ""}
        </ThemedText>
        {bestCurrentStreak > 0 ? (
          <View style={[styles.bestStreakBadge, { backgroundColor: theme.accent + "15" }]}>
            <Feather name="trending-up" size={14} color={theme.accent} />
            <ThemedText type="small" style={{ color: theme.accent, fontWeight: "600" }}>
              Best current: {bestCurrentStreak} day{bestCurrentStreak !== 1 ? "s" : ""}
            </ThemedText>
          </View>
        ) : null}
      </Card>

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>Your Streaks</ThemedText>

        <StreakCard
          title="Daily Check-In"
          icon="smile"
          color={theme.primary}
          streak={checkInStreak}
        />

        <StreakCard
          title="Journal"
          icon="edit-3"
          color={theme.success}
          streak={journalStreak}
        />

        <StreakCard
          title="Gratitude"
          icon="sun"
          color={theme.accent}
          streak={gratitudeStreak}
        />
      </View>

      <Card elevation={1} style={styles.tipCard}>
        <View style={styles.tipHeader}>
          <Feather name="info" size={18} color={theme.primary} />
          <ThemedText type="h4">Building Habits</ThemedText>
        </View>
        <ThemedText type="small" style={{ color: theme.textSecondary, lineHeight: 20 }}>
          Consistency is key in recovery. Check in daily, write in your journal, and practice gratitude to build healthy streaks that support your journey.
        </ThemedText>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summaryCard: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  summaryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  bestStreakBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  streakCard: {
    marginBottom: Spacing.md,
  },
  streakCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  streakIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  streakCardInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  streakStatsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  streakStat: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.xs,
  },
  streakCountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  streakDivider: {
    width: 1,
    height: 40,
  },
  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  tipCard: {
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
});
