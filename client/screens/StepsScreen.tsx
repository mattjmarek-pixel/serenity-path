import React, { useState } from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, Colors, BorderRadius } from "@/constants/theme";

const TWELVE_STEPS = [
  { id: "1", number: 1, title: "Honesty", content: "We admitted we were powerless over alcohol—that our lives had become unmanageable." },
  { id: "2", number: 2, title: "Hope", content: "Came to believe that a Power greater than ourselves could restore us to sanity." },
  { id: "3", number: 3, title: "Faith", content: "Made a decision to turn our will and our lives over to the care of God as we understood Him." },
  { id: "4", number: 4, title: "Courage", content: "Made a searching and fearless moral inventory of ourselves." },
  { id: "5", number: 5, title: "Integrity", content: "Admitted to God, to ourselves, and to another human being the exact nature of our wrongs." },
  { id: "6", number: 6, title: "Willingness", content: "Were entirely ready to have God remove all these defects of character." },
  { id: "7", number: 7, title: "Humility", content: "Humbly asked Him to remove our shortcomings." },
  { id: "8", number: 8, title: "Brotherly Love", content: "Made a list of all persons we had harmed, and became willing to make amends to them all." },
  { id: "9", number: 9, title: "Justice", content: "Made direct amends to such people wherever possible, except when to do so would injure them or others." },
  { id: "10", number: 10, title: "Perseverance", content: "Continued to take personal inventory and when we were wrong promptly admitted it." },
  { id: "11", number: 11, title: "Spiritual Awareness", content: "Sought through prayer and meditation to improve our conscious contact with God as we understood Him, praying only for knowledge of His will for us and the power to carry that out." },
  { id: "12", number: 12, title: "Service", content: "Having had a spiritual awakening as the result of these Steps, we tried to carry this message to alcoholics, and to practice these principles in all our affairs." },
];

const TWELVE_TRADITIONS = [
  { id: "t1", number: 1, title: "Unity", content: "Our common welfare should come first; personal recovery depends upon A.A. unity." },
  { id: "t2", number: 2, title: "Leadership", content: "For our group purpose there is but one ultimate authority—a loving God as He may express Himself in our group conscience. Our leaders are but trusted servants; they do not govern." },
  { id: "t3", number: 3, title: "Membership", content: "The only requirement for A.A. membership is a desire to stop drinking." },
  { id: "t4", number: 4, title: "Autonomy", content: "Each group should be autonomous except in matters affecting other groups or A.A. as a whole." },
  { id: "t5", number: 5, title: "Purpose", content: "Each group has but one primary purpose—to carry its message to the alcoholic who still suffers." },
  { id: "t6", number: 6, title: "Non-Endorsement", content: "An A.A. group ought never endorse, finance, or lend the A.A. name to any related facility or outside enterprise, lest problems of money, property, and prestige divert us from our primary purpose." },
  { id: "t7", number: 7, title: "Self-Supporting", content: "Every A.A. group ought to be fully self-supporting, declining outside contributions." },
  { id: "t8", number: 8, title: "Non-Professional", content: "Alcoholics Anonymous should remain forever non-professional, but our service centers may employ special workers." },
  { id: "t9", number: 9, title: "Organization", content: "A.A., as such, ought never be organized; but we may create service boards or committees directly responsible to those they serve." },
  { id: "t10", number: 10, title: "No Opinion", content: "Alcoholics Anonymous has no opinion on outside issues; hence the A.A. name ought never be drawn into public controversy." },
  { id: "t11", number: 11, title: "Attraction", content: "Our public relations policy is based on attraction rather than promotion; we need always maintain personal anonymity at the level of press, radio, and films." },
  { id: "t12", number: 12, title: "Anonymity", content: "Anonymity is the spiritual foundation of all our Traditions, ever reminding us to place principles before personalities." },
];

type Tab = "steps" | "traditions";

export default function StepsScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>("steps");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [reflectedItems, setReflectedItems] = useState<Set<string>>(new Set());

  const data = activeTab === "steps" ? TWELVE_STEPS : TWELVE_TRADITIONS;

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleReflected = (id: string) => {
    setReflectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: Spacing.xl,
        paddingBottom: tabBarHeight + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      <View style={[styles.segmentedControl, { backgroundColor: theme.backgroundSecondary }]}>
        <Pressable
          onPress={() => setActiveTab("steps")}
          style={[
            styles.segment,
            activeTab === "steps" && [styles.activeSegment, { backgroundColor: theme.backgroundDefault }],
          ]}
        >
          <ThemedText
            style={[
              styles.segmentText,
              { color: activeTab === "steps" ? Colors.light.primary : theme.textSecondary },
            ]}
          >
            12 Steps
          </ThemedText>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab("traditions")}
          style={[
            styles.segment,
            activeTab === "traditions" && [styles.activeSegment, { backgroundColor: theme.backgroundDefault }],
          ]}
        >
          <ThemedText
            style={[
              styles.segmentText,
              { color: activeTab === "traditions" ? Colors.light.primary : theme.textSecondary },
            ]}
          >
            12 Traditions
          </ThemedText>
        </Pressable>
      </View>

      {data.map((item) => (
        <View key={item.id} style={[styles.itemCard, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
          <Pressable
            onPress={() => toggleExpand(item.id)}
            style={({ pressed }) => [styles.itemHeader, { opacity: pressed ? 0.7 : 1 }]}
          >
            <View style={styles.itemHeaderLeft}>
              <View style={[styles.numberBadge, { backgroundColor: Colors.light.primary }]}>
                <ThemedText style={styles.numberText}>{item.number}</ThemedText>
              </View>
              <ThemedText type="h4" style={styles.itemTitle}>{item.title}</ThemedText>
            </View>
            <Feather
              name={expandedItems.has(item.id) ? "chevron-up" : "chevron-down"}
              size={20}
              color={theme.textSecondary}
            />
          </Pressable>
          {expandedItems.has(item.id) ? (
            <View style={styles.itemContent}>
              <ThemedText type="body" style={styles.itemContentText}>
                {item.content}
              </ThemedText>
              <Pressable
                onPress={() => toggleReflected(item.id)}
                style={({ pressed }) => [
                  styles.reflectedButton,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Feather
                  name={reflectedItems.has(item.id) ? "check-square" : "square"}
                  size={20}
                  color={reflectedItems.has(item.id) ? Colors.light.secondary : theme.textSecondary}
                />
                <ThemedText
                  style={[
                    styles.reflectedText,
                    { color: reflectedItems.has(item.id) ? Colors.light.secondary : theme.textSecondary },
                  ]}
                >
                  Reflected upon
                </ThemedText>
              </Pressable>
            </View>
          ) : null}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  segmentedControl: {
    flexDirection: "row",
    borderRadius: BorderRadius.sm,
    padding: 4,
    marginBottom: Spacing.xl,
  },
  segment: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: "center",
    borderRadius: BorderRadius.xs,
  },
  activeSegment: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  segmentText: {
    fontWeight: "600",
  },
  itemCard: {
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    overflow: "hidden",
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
  },
  itemHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  numberText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  itemTitle: {
    flex: 1,
  },
  itemContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    paddingTop: 0,
  },
  itemContentText: {
    lineHeight: 26,
    marginBottom: Spacing.md,
  },
  reflectedButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  reflectedText: {
    fontSize: 14,
  },
});
