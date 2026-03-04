import React from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Linking,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";

import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

const MEETING_RESOURCES = [
  {
    id: "aa-guide",
    title: "AA Meeting Guide",
    description: "Official AA app to find in-person meetings worldwide",
    url: "https://www.aa.org/find-aa",
    icon: "compass" as const,
  },
  {
    id: "intergroup",
    title: "Online Intergroup",
    description: "Directory of virtual AA meetings available 24/7",
    url: "https://aa-intergroup.org/meetings/",
    icon: "video" as const,
  },
  {
    id: "intherooms",
    title: "In The Rooms",
    description: "Online recovery community with live meetings",
    url: "https://www.intherooms.com",
    icon: "users" as const,
  },
];

const MEETING_TIPS = [
  {
    title: "Types of Meetings",
    content:
      "Open meetings welcome anyone interested in AA. Closed meetings are for those who have a desire to stop drinking. Speaker meetings feature a member sharing their story, while discussion meetings are more interactive.",
  },
  {
    title: "What to Expect",
    content:
      "Meetings typically last about an hour. You don't have to speak if you don't want to. Everything shared in the meeting stays in the meeting. Just showing up is all you need to do.",
  },
  {
    title: "Your First Meeting",
    content:
      "Arrive a few minutes early if possible. You can introduce yourself by your first name only. Many people find it helpful to listen at their first few meetings. Consider trying several different meetings to find the right fit.",
  },
  {
    title: "Common Formats",
    content:
      "Big Book studies read and discuss sections of the AA Big Book. Step studies work through the 12 Steps together. Some meetings focus on specific topics each week. All formats aim to support recovery.",
  },
];

export default function MeetingFinderScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const [permission, requestPermission] = Location.useForegroundPermissions();

  const openUrl = (url: string) => {
    Linking.openURL(url);
  };

  const renderResourceCard = (resource: (typeof MEETING_RESOURCES)[number]) => (
    <Card key={resource.id} style={styles.resourceCard}>
      <Pressable
        onPress={() => openUrl(resource.url)}
        style={({ pressed }) => [
          styles.resourcePressable,
          { opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <View
          style={[
            styles.resourceIconContainer,
            { backgroundColor: theme.primary + "15" },
          ]}
        >
          <Feather name={resource.icon} size={24} color={theme.primary} />
        </View>
        <View style={styles.resourceTextContainer}>
          <ThemedText type="h4">{resource.title}</ThemedText>
          <ThemedText
            style={[styles.resourceDescription, { color: theme.textSecondary }]}
          >
            {resource.description}
          </ThemedText>
        </View>
        <Feather name="external-link" size={18} color={theme.textSecondary} />
      </Pressable>
    </Card>
  );

  const renderLocationSection = () => {
    if (!permission) return null;

    if (!permission.granted) {
      if (permission.status === "denied" && !permission.canAskAgain) {
        return (
          <Card style={styles.locationCard}>
            <Feather name="map-pin" size={32} color={theme.primary} />
            <ThemedText type="h4" style={styles.locationTitle}>
              Find Nearby Meetings
            </ThemedText>
            <ThemedText
              style={[styles.locationText, { color: theme.textSecondary }]}
            >
              For nearby meetings, use the AA Meeting Guide app. Enable location
              in your device settings for the best experience.
            </ThemedText>
            <View style={styles.locationButtons}>
              <Pressable
                onPress={() => openUrl("https://www.aa.org/find-aa")}
                style={({ pressed }) => [
                  styles.locationButton,
                  { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Feather name="compass" size={16} color="#FFFFFF" />
                <ThemedText style={styles.locationButtonText}>
                  AA Meeting Guide
                </ThemedText>
              </Pressable>
              {Platform.OS !== "web" ? (
                <Pressable
                  onPress={async () => {
                    try {
                      await Linking.openSettings();
                    } catch (error) {}
                  }}
                  style={({ pressed }) => [
                    styles.locationButton,
                    {
                      backgroundColor: theme.backgroundTertiary,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Feather name="settings" size={16} color={theme.text} />
                  <ThemedText style={[styles.locationButtonText, { color: theme.text }]}>
                    Open Settings
                  </ThemedText>
                </Pressable>
              ) : null}
            </View>
          </Card>
        );
      }

      return (
        <Card style={styles.locationCard}>
          <Feather name="map-pin" size={32} color={theme.primary} />
          <ThemedText type="h4" style={styles.locationTitle}>
            Find Nearby Meetings
          </ThemedText>
          <ThemedText
            style={[styles.locationText, { color: theme.textSecondary }]}
          >
            Enable location to get directed to nearby meetings through the AA
            Meeting Guide
          </ThemedText>
          <Pressable
            onPress={requestPermission}
            style={({ pressed }) => [
              styles.locationButton,
              { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Feather name="map-pin" size={16} color="#FFFFFF" />
            <ThemedText style={styles.locationButtonText}>
              Enable Location
            </ThemedText>
          </Pressable>
        </Card>
      );
    }

    return (
      <Card style={styles.locationCard}>
        <Feather name="map-pin" size={32} color={theme.success} />
        <ThemedText type="h4" style={styles.locationTitle}>
          Find Nearby Meetings
        </ThemedText>
        <ThemedText
          style={[styles.locationText, { color: theme.textSecondary }]}
        >
          For nearby in-person meetings, use the AA Meeting Guide app. It has
          the most comprehensive and up-to-date listing of meetings.
        </ThemedText>
        <Pressable
          onPress={() => openUrl("https://www.aa.org/find-aa")}
          style={({ pressed }) => [
            styles.locationButton,
            { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Feather name="compass" size={16} color="#FFFFFF" />
          <ThemedText style={styles.locationButtonText}>
            Open AA Meeting Guide
          </ThemedText>
        </Pressable>
      </Card>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.md,
        paddingBottom: insets.bottom + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      {renderLocationSection()}

      <ThemedText type="h3" style={styles.sectionTitle}>
        Meeting Resources
      </ThemedText>
      <ThemedText
        style={[styles.sectionSubtitle, { color: theme.textSecondary }]}
      >
        Find in-person and online meetings through these trusted resources
      </ThemedText>
      {MEETING_RESOURCES.map(renderResourceCard)}

      <ThemedText type="h3" style={[styles.sectionTitle, { marginTop: Spacing["2xl"] }]}>
        Meeting Tips
      </ThemedText>
      <ThemedText
        style={[styles.sectionSubtitle, { color: theme.textSecondary }]}
      >
        Helpful information for finding the right meeting
      </ThemedText>
      {MEETING_TIPS.map((tip, index) => (
        <Card key={index} style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <View
              style={[
                styles.tipNumber,
                { backgroundColor: theme.primary + "15" },
              ]}
            >
              <ThemedText
                style={[styles.tipNumberText, { color: theme.primary }]}
              >
                {index + 1}
              </ThemedText>
            </View>
            <ThemedText type="h4" style={styles.tipTitle}>
              {tip.title}
            </ThemedText>
          </View>
          <ThemedText
            style={[styles.tipContent, { color: theme.textSecondary }]}
          >
            {tip.content}
          </ThemedText>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    marginBottom: Spacing.lg,
    fontSize: 14,
    lineHeight: 20,
  },
  locationCard: {
    alignItems: "center",
    padding: Spacing["2xl"],
    marginBottom: Spacing.md,
  },
  locationTitle: {
    marginTop: Spacing.md,
    textAlign: "center",
  },
  locationText: {
    textAlign: "center",
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  locationButtons: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    gap: Spacing.sm,
  },
  locationButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  resourceCard: {
    marginBottom: Spacing.md,
    padding: 0,
  },
  resourcePressable: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  resourceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  resourceTextContainer: {
    flex: 1,
  },
  resourceDescription: {
    fontSize: 14,
    marginTop: Spacing.xs,
    lineHeight: 20,
  },
  tipCard: {
    marginBottom: Spacing.md,
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  tipNumber: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  tipNumberText: {
    fontWeight: "700",
    fontSize: 14,
  },
  tipTitle: {
    flex: 1,
  },
  tipContent: {
    lineHeight: 22,
    paddingLeft: 44,
  },
});
