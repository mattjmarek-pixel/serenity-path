import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface PrayerData {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  text: string;
}

const PRAYERS: PrayerData[] = [
  {
    id: "serenity",
    title: "The Serenity Prayer",
    subtitle: "Reinhold Niebuhr",
    icon: "sun",
    text: "God, grant me the serenity\nto accept the things I cannot change,\nthe courage to change the things I can,\nand the wisdom to know the difference.\n\nLiving one day at a time,\nenjoying one moment at a time;\naccepting hardship as a pathway to peace;\ntaking, as Jesus did,\nthis sinful world as it is,\nnot as I would have it;\ntrusting that You will make all things right\nif I surrender to Your will;\nso that I may be reasonably happy in this life\nand supremely happy with You forever in the next.\n\nAmen.",
  },
  {
    id: "promises",
    title: "The AA Promises",
    subtitle: "Big Book, Pages 83-84",
    icon: "star",
    text: "If we are painstaking about this phase of our development, we will be amazed before we are half way through.\n\nWe are going to know a new freedom and a new happiness.\n\nWe will not regret the past nor wish to shut the door on it.\n\nWe will comprehend the word serenity and we will know peace.\n\nNo matter how far down the scale we have gone, we will see how our experience can benefit others.\n\nThat feeling of uselessness and self-pity will disappear.\n\nWe will lose interest in selfish things and gain interest in our fellows.\n\nSelf-seeking will slip away.\n\nOur whole attitude and outlook upon life will change.\n\nFear of people and of economic insecurity will leave us.\n\nWe will intuitively know how to handle situations which used to baffle us.\n\nWe will suddenly realize that God is doing for us what we could not do for ourselves.\n\nAre these extravagant promises? We think not. They are being fulfilled among us \u2014 sometimes quickly, sometimes slowly. They will always materialize if we work for them.",
  },
  {
    id: "third-step",
    title: "The Third Step Prayer",
    subtitle: "Big Book, Page 63",
    icon: "heart",
    text: "God, I offer myself to Thee \u2014\nto build with me and to do with me as Thou wilt.\nRelieve me of the bondage of self,\nthat I may better do Thy will.\nTake away my difficulties,\nthat victory over them may bear witness\nto those I would help of Thy Power,\nThy Love, and Thy Way of life.\nMay I do Thy will always!\n\nAmen.",
  },
  {
    id: "seventh-step",
    title: "The Seventh Step Prayer",
    subtitle: "Big Book, Page 76",
    icon: "shield",
    text: "My Creator,\nI am now willing that you should have all of me,\ngood and bad.\nI pray that you now remove from me\nevery single defect of character\nwhich stands in the way of my usefulness\nto you and my fellows.\nGrant me strength, as I go out from here,\nto do your bidding.\n\nAmen.",
  },
  {
    id: "st-francis",
    title: "The St. Francis Prayer",
    subtitle: "Prayer of St. Francis of Assisi",
    icon: "feather",
    text: "Lord, make me a channel of thy peace,\nthat where there is hatred, I may bring love;\nthat where there is wrong, I may bring the spirit of forgiveness;\nthat where there is discord, I may bring harmony;\nthat where there is error, I may bring truth;\nthat where there is doubt, I may bring faith;\nthat where there is despair, I may bring hope;\nthat where there are shadows, I may bring light;\nthat where there is sadness, I may bring joy.\n\nLord, grant that I may seek rather to comfort than to be comforted;\nto understand, than to be understood;\nto love, than to be loved.\nFor it is by self-forgetting that one finds.\nIt is by forgiving that one is forgiven.\nIt is by dying that one awakens to Eternal Life.\n\nAmen.",
  },
];

function ExpandablePrayerCard({ prayer }: { prayer: PrayerData }) {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const rotation = useSharedValue(0);

  const toggleExpanded = () => {
    setExpanded(!expanded);
    rotation.value = withTiming(expanded ? 0 : 1, { duration: 300 });
  };

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value * 180}deg` }],
  }));

  return (
    <Card style={styles.prayerCard} elevation={1}>
      <Pressable onPress={toggleExpanded} style={styles.prayerHeader}>
        <View
          style={[styles.prayerIcon, { backgroundColor: theme.primary + "15" }]}
        >
          <Feather name={prayer.icon as any} size={22} color={theme.primary} />
        </View>
        <View style={styles.prayerTitleContainer}>
          <ThemedText type="h4" style={styles.prayerTitle}>
            {prayer.title}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {prayer.subtitle}
          </ThemedText>
        </View>
        <Animated.View style={chevronStyle}>
          <Feather name="chevron-down" size={22} color={theme.textSecondary} />
        </Animated.View>
      </Pressable>
      {expanded ? (
        <View style={[styles.prayerBody, { borderTopColor: theme.border }]}>
          <ThemedText style={styles.prayerText}>{prayer.text}</ThemedText>
        </View>
      ) : null}
    </Card>
  );
}

export default function PrayersScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();

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
      <View style={styles.introSection}>
        <View
          style={[styles.introIcon, { backgroundColor: theme.accent + "20" }]}
        >
          <Feather name="book-open" size={28} color={theme.accent} />
        </View>
        <ThemedText type="h3" style={styles.introTitle}>
          Daily Promises & Prayers
        </ThemedText>
        <ThemedText style={[styles.introText, { color: theme.textSecondary }]}>
          These prayers and promises are cornerstones of the recovery journey.
          Tap any card to read.
        </ThemedText>
      </View>

      {PRAYERS.map((prayer) => (
        <ExpandablePrayerCard key={prayer.id} prayer={prayer} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  introSection: {
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  introIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  introTitle: {
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  introText: {
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: Spacing.lg,
  },
  prayerCard: {
    marginBottom: Spacing.md,
    padding: 0,
    overflow: "hidden",
  },
  prayerHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  prayerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  prayerTitleContainer: {
    flex: 1,
  },
  prayerTitle: {
    marginBottom: 2,
  },
  prayerBody: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
  prayerText: {
    lineHeight: 26,
    fontStyle: "italic",
  },
});
