import React, { useState, useMemo, useCallback } from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { useCheckIn, MOOD_OPTIONS, CheckIn } from "@/hooks/useCheckIn";
import { Spacing, BorderRadius } from "@/constants/theme";

const RANGE_OPTIONS = [
  { label: "7 Days", value: 7 },
  { label: "30 Days", value: 30 },
  { label: "90 Days", value: 90 },
];

function getMoodColor(mood: number): string {
  const option = MOOD_OPTIONS.find((o) => o.value === mood);
  return option?.color ?? "#999";
}

function getMoodLabel(mood: number): string {
  const option = MOOD_OPTIONS.find((o) => o.value === mood);
  return option?.label ?? "";
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function MoodHistoryScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { getCheckInsForRange, getAverageMood, checkIns } = useCheckIn();
  const [selectedRange, setSelectedRange] = useState(7);

  const rangeData = useMemo(
    () => getCheckInsForRange(selectedRange),
    [getCheckInsForRange, selectedRange],
  );
  const averageMood = useMemo(
    () => getAverageMood(selectedRange),
    [getAverageMood, selectedRange],
  );

  const maxBarHeight = 120;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: Spacing.xl,
        paddingBottom: insets.bottom + Spacing["3xl"],
        paddingHorizontal: Spacing.lg,
      }}
    >
      <View style={styles.rangeSelector}>
        {RANGE_OPTIONS.map((option) => (
          <Pressable
            key={option.value}
            onPress={() => setSelectedRange(option.value)}
            style={[
              styles.rangeButton,
              {
                backgroundColor:
                  selectedRange === option.value
                    ? theme.primary
                    : theme.backgroundDefault,
                borderColor:
                  selectedRange === option.value ? theme.primary : theme.border,
              },
            ]}
          >
            <ThemedText
              type="small"
              style={{
                color: selectedRange === option.value ? "#FFFFFF" : theme.text,
                fontWeight: selectedRange === option.value ? "600" : "400",
              }}
            >
              {option.label}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <Card style={styles.summaryCard} elevation={1}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Check-ins
            </ThemedText>
            <ThemedText type="h2" style={{ color: theme.primary }}>
              {rangeData.length}
            </ThemedText>
          </View>
          <View
            style={[styles.summaryDivider, { backgroundColor: theme.border }]}
          />
          <View style={styles.summaryItem}>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Avg Mood
            </ThemedText>
            <ThemedText
              type="h2"
              style={{
                color: averageMood
                  ? getMoodColor(Math.round(averageMood))
                  : theme.textSecondary,
              }}
            >
              {averageMood ? averageMood.toFixed(1) : "--"}
            </ThemedText>
          </View>
          <View
            style={[styles.summaryDivider, { backgroundColor: theme.border }]}
          />
          <View style={styles.summaryItem}>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Trend
            </ThemedText>
            {rangeData.length >= 2 ? (
              <Feather
                name={
                  rangeData[rangeData.length - 1].mood >= rangeData[0].mood
                    ? "trending-up"
                    : "trending-down"
                }
                size={28}
                color={
                  rangeData[rangeData.length - 1].mood >= rangeData[0].mood
                    ? theme.success
                    : theme.emergency
                }
              />
            ) : (
              <ThemedText type="h2" style={{ color: theme.textSecondary }}>
                --
              </ThemedText>
            )}
          </View>
        </View>
      </Card>

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>
          Mood Chart
        </ThemedText>
        <Card elevation={1} style={styles.chartCard}>
          {rangeData.length === 0 ? (
            <View style={styles.emptyChart}>
              <Feather
                name="bar-chart-2"
                size={48}
                color={theme.textSecondary}
              />
              <ThemedText
                type="body"
                style={[styles.emptyText, { color: theme.textSecondary }]}
              >
                No check-ins yet for this period
              </ThemedText>
            </View>
          ) : (
            <>
              <View style={styles.chartYAxis}>
                {[5, 4, 3, 2, 1].map((val) => (
                  <ThemedText
                    key={val}
                    type="small"
                    style={[styles.yLabel, { color: theme.textSecondary }]}
                  >
                    {getMoodLabel(val).substring(0, 3)}
                  </ThemedText>
                ))}
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.chartScroll}
              >
                <View style={styles.barsContainer}>
                  {rangeData.map((checkIn) => {
                    const barHeight = (checkIn.mood / 5) * maxBarHeight;
                    return (
                      <View key={checkIn.id} style={styles.barColumn}>
                        <View
                          style={[styles.barWrapper, { height: maxBarHeight }]}
                        >
                          <View
                            style={[
                              styles.bar,
                              {
                                height: barHeight,
                                backgroundColor: getMoodColor(checkIn.mood),
                                borderRadius: BorderRadius.xs,
                              },
                            ]}
                          />
                        </View>
                        <ThemedText
                          type="small"
                          style={[
                            styles.barLabel,
                            { color: theme.textSecondary },
                          ]}
                        >
                          {formatDate(checkIn.date)}
                        </ThemedText>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            </>
          )}
        </Card>
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>
          Recent Check-ins
        </ThemedText>
        {rangeData.length === 0 ? (
          <Card elevation={1}>
            <ThemedText
              type="body"
              style={[styles.emptyText, { color: theme.textSecondary }]}
            >
              No check-ins recorded yet
            </ThemedText>
          </Card>
        ) : (
          [...rangeData].reverse().map((checkIn) => (
            <Card key={checkIn.id} elevation={1} style={styles.entryCard}>
              <View style={styles.entryRow}>
                <View
                  style={[
                    styles.entryMoodDot,
                    { backgroundColor: getMoodColor(checkIn.mood) },
                  ]}
                >
                  <Feather
                    name={
                      MOOD_OPTIONS.find((o) => o.value === checkIn.mood)
                        ?.icon ?? "circle"
                    }
                    size={16}
                    color="#FFFFFF"
                  />
                </View>
                <View style={styles.entryContent}>
                  <ThemedText type="body" style={{ fontWeight: "600" }}>
                    {getMoodLabel(checkIn.mood)}
                  </ThemedText>
                  <ThemedText
                    type="small"
                    style={{ color: theme.textSecondary }}
                  >
                    {formatDate(checkIn.date)}
                  </ThemedText>
                </View>
              </View>
              {checkIn.note ? (
                <ThemedText
                  type="small"
                  style={[styles.entryNote, { color: theme.textSecondary }]}
                >
                  {checkIn.note}
                </ThemedText>
              ) : null}
            </Card>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rangeSelector: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  rangeButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    borderWidth: 1,
  },
  summaryCard: {
    marginBottom: Spacing.xl,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  summaryItem: {
    alignItems: "center",
    gap: Spacing.xs,
  },
  summaryDivider: {
    width: 1,
    height: 40,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  chartCard: {
    flexDirection: "row",
    overflow: "hidden",
  },
  chartYAxis: {
    justifyContent: "space-between",
    paddingRight: Spacing.sm,
    height: 140,
  },
  yLabel: {
    fontSize: 10,
    textAlign: "right",
    width: 30,
  },
  chartScroll: {
    flex: 1,
  },
  barsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: Spacing.sm,
    paddingBottom: Spacing.lg,
    minWidth: "100%",
  },
  barColumn: {
    alignItems: "center",
    minWidth: 32,
  },
  barWrapper: {
    justifyContent: "flex-end",
  },
  bar: {
    width: 24,
  },
  barLabel: {
    fontSize: 9,
    marginTop: Spacing.xs,
  },
  emptyChart: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["4xl"],
    flex: 1,
    gap: Spacing.md,
  },
  emptyText: {
    textAlign: "center",
  },
  entryCard: {
    marginBottom: Spacing.sm,
  },
  entryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  entryMoodDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  entryContent: {
    flex: 1,
  },
  entryNote: {
    marginTop: Spacing.sm,
    marginLeft: 48,
    lineHeight: 20,
  },
});
