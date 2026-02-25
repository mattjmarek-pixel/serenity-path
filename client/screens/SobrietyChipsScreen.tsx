import React, { useMemo } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { useProfile } from "@/hooks/useProfile";
import { Spacing, BorderRadius } from "@/constants/theme";

const SOBRIETY_CHIPS = [
  { days: 1, label: "24 Hours", description: "The most important day", color: "#C0C0C0", textColor: "#333333" },
  { days: 7, label: "1 Week", description: "One week of courage", color: "#C0C0C0", textColor: "#333333" },
  { days: 30, label: "30 Days", description: "A month of strength", color: "#DC3545", textColor: "#FFFFFF" },
  { days: 60, label: "60 Days", description: "Two months of growth", color: "#DAA520", textColor: "#333333" },
  { days: 90, label: "90 Days", description: "A quarter of dedication", color: "#228B22", textColor: "#FFFFFF" },
  { days: 180, label: "6 Months", description: "Half a year of freedom", color: "#1B3A6B", textColor: "#FFFFFF" },
  { days: 270, label: "9 Months", description: "Three quarters strong", color: "#6A0DAD", textColor: "#FFFFFF" },
  { days: 365, label: "1 Year", description: "A full year of recovery", color: "#CD7F32", textColor: "#FFFFFF" },
  { days: 547, label: "18 Months", description: "Steady and strong", color: "#CD7F32", textColor: "#FFFFFF" },
  { days: 730, label: "2 Years", description: "Two years of new life", color: "#CD7F32", textColor: "#FFFFFF" },
  { days: 1095, label: "3 Years", description: "Three years of wisdom", color: "#CD7F32", textColor: "#FFFFFF" },
  { days: 1825, label: "5 Years", description: "Half a decade of courage", color: "#CD7F32", textColor: "#FFFFFF" },
  { days: 3650, label: "10 Years", description: "A decade of strength", color: "#CD7F32", textColor: "#FFFFFF" },
  { days: 7300, label: "20 Years", description: "Two decades of grace", color: "#CD7F32", textColor: "#FFFFFF" },
  { days: 9125, label: "25 Years", description: "A quarter century of hope", color: "#CD7F32", textColor: "#FFFFFF" },
];

interface ChipProps {
  chip: typeof SOBRIETY_CHIPS[0];
  earned: boolean;
  isNext: boolean;
  progress: number;
  index: number;
}

function SobrietyChip({ chip, earned, isNext, progress, index }: ChipProps) {
  const { theme } = useTheme();

  const shimmer = useSharedValue(0);

  React.useEffect(() => {
    if (isNext) {
      shimmer.value = withDelay(
        index * 100,
        withRepeat(
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          -1,
          true
        )
      );
    }
  }, [isNext]);

  const nextGlowStyle = useAnimatedStyle(() => {
    if (!isNext) return { opacity: 0 };
    return {
      opacity: 0.15 + shimmer.value * 0.15,
    };
  });

  const chipBgColor = earned ? chip.color : theme.backgroundTertiary;
  const chipTextColor = earned ? chip.textColor : theme.textSecondary;

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).springify()}>
      <View
        style={[
          styles.chipContainer,
          {
            backgroundColor: theme.backgroundDefault,
            borderColor: earned ? chip.color : isNext ? theme.primary + "60" : theme.border,
            borderWidth: isNext ? 2 : 1,
          },
        ]}
      >
        {isNext ? (
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              { backgroundColor: theme.primary, borderRadius: BorderRadius.md },
              nextGlowStyle,
            ]}
          />
        ) : null}

        <View style={styles.chipRow}>
          <View style={[styles.chipCircle, { backgroundColor: chipBgColor }]}>
            {earned ? (
              <Feather name="award" size={24} color={chipTextColor} />
            ) : (
              <Feather name="circle" size={24} color={theme.textSecondary + "40"} />
            )}
          </View>

          <View style={styles.chipInfo}>
            <ThemedText
              type="h4"
              style={[
                styles.chipLabel,
                { color: earned ? theme.text : theme.textSecondary },
              ]}
            >
              {chip.label}
            </ThemedText>
            <ThemedText
              type="small"
              style={{ color: earned ? theme.textSecondary : theme.textSecondary + "80" }}
            >
              {chip.description}
            </ThemedText>
          </View>

          <View style={styles.chipStatus}>
            {earned ? (
              <View style={[styles.earnedBadge, { backgroundColor: chip.color + "20" }]}>
                <Feather name="check-circle" size={16} color={chip.color} />
                <ThemedText
                  type="small"
                  style={{ color: chip.color, fontWeight: "600", fontSize: 12 }}
                >
                  Earned
                </ThemedText>
              </View>
            ) : isNext ? (
              <View style={styles.progressContainer}>
                <ThemedText
                  type="small"
                  style={{ color: theme.primary, fontWeight: "600", fontSize: 12 }}
                >
                  {Math.round(progress * 100)}%
                </ThemedText>
                <View style={[styles.progressBar, { backgroundColor: theme.backgroundTertiary }]}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: theme.primary,
                        width: `${Math.min(progress * 100, 100)}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            ) : (
              <Feather name="lock" size={16} color={theme.textSecondary + "40"} />
            )}
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

export default function SobrietyChipsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { getSobrietyDays } = useProfile();

  const sobrietyDays = getSobrietyDays() ?? 0;

  const { earnedChips, nextChip, totalEarned } = useMemo(() => {
    const earned = SOBRIETY_CHIPS.filter((c) => sobrietyDays >= c.days);
    const next = SOBRIETY_CHIPS.find((c) => sobrietyDays < c.days) || null;
    return { earnedChips: earned, nextChip: next, totalEarned: earned.length };
  }, [sobrietyDays]);

  const getProgress = (chip: typeof SOBRIETY_CHIPS[0]) => {
    if (sobrietyDays >= chip.days) return 1;
    const prevChip = SOBRIETY_CHIPS[SOBRIETY_CHIPS.indexOf(chip) - 1];
    const prevDays = prevChip ? prevChip.days : 0;
    const range = chip.days - prevDays;
    const elapsed = sobrietyDays - prevDays;
    return Math.max(0, elapsed / range);
  };

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
      <Card style={styles.summaryCard} elevation={1}>
        <View style={[styles.summaryIcon, { backgroundColor: theme.accent + "20" }]}>
          <Feather name="award" size={32} color={theme.accent} />
        </View>
        <ThemedText type="h2" style={styles.summaryCount}>
          {totalEarned}
        </ThemedText>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {totalEarned === 1 ? "Chip Earned" : "Chips Earned"}
        </ThemedText>
        {nextChip ? (
          <View style={[styles.nextChipInfo, { backgroundColor: theme.primary + "15" }]}>
            <Feather name="target" size={14} color={theme.primary} />
            <ThemedText type="small" style={{ color: theme.primary }}>
              {nextChip.days - sobrietyDays} days until {nextChip.label} chip
            </ThemedText>
          </View>
        ) : (
          <View style={[styles.nextChipInfo, { backgroundColor: theme.accent + "15" }]}>
            <Feather name="star" size={14} color={theme.accent} />
            <ThemedText type="small" style={{ color: theme.accent }}>
              All milestones achieved
            </ThemedText>
          </View>
        )}
      </Card>

      <ThemedText type="h4" style={styles.sectionTitle}>
        Recovery Milestones
      </ThemedText>

      {SOBRIETY_CHIPS.map((chip, index) => (
        <SobrietyChip
          key={chip.days}
          chip={chip}
          earned={sobrietyDays >= chip.days}
          isNext={nextChip?.days === chip.days}
          progress={getProgress(chip)}
          index={index}
        />
      ))}
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
  summaryCount: {
    marginBottom: Spacing.xs,
  },
  nextChipInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  chipContainer: {
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    padding: Spacing.lg,
    overflow: "hidden",
  },
  chipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  chipCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  chipInfo: {
    flex: 1,
    gap: 2,
  },
  chipLabel: {},
  chipStatus: {
    alignItems: "flex-end",
  },
  earnedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  progressContainer: {
    alignItems: "flex-end",
    gap: 4,
    minWidth: 60,
  },
  progressBar: {
    width: 60,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
});
