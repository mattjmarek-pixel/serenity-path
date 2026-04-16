import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Linking,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";

import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { getApiUrl } from "@/lib/query-client";

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

const DAY_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const MEETING_TYPE_LABELS: Record<string, string> = {
  O: "Open",
  C: "Closed",
  SP: "Speaker",
  D: "Discussion",
  BB: "Big Book",
  "12x12": "12 & 12",
  ONL: "Online",
  H: "Hybrid",
  S: "Step Study",
  TR: "Tradition Study",
};

interface NearbyMeeting {
  name: string;
  formatted_address?: string;
  day: number;
  time: string;
  types?: string[];
  distance?: number;
  url?: string;
  lat?: number;
  lng?: number;
}

interface DetectedLocation {
  lat: number;
  lng: number;
  city: string;
  region: string;
  postalCode: string;
}

function formatTime(time: string): string {
  if (!time) return "";
  const [hourStr, minuteStr] = time.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = minuteStr ? minuteStr.slice(0, 2) : "00";
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute} ${ampm}`;
}

function formatDistance(dist?: number): string {
  if (dist === undefined || dist === null) return "";
  return `${dist.toFixed(1)} mi`;
}

function getMeetingTypeLabel(types?: string[]): string {
  if (!types || types.length === 0) return "Meeting";
  return MEETING_TYPE_LABELS[types[0]] ?? types[0];
}

function openMapsNearby(lat: number, lng: number) {
  let url: string;
  if (Platform.OS === "ios") {
    url = `maps://maps.apple.com/?q=AA+meeting&ll=${lat},${lng}&sll=${lat},${lng}`;
  } else if (Platform.OS === "android") {
    url = `geo:${lat},${lng}?q=AA+meeting`;
  } else {
    url = `https://maps.google.com/?q=AA+meeting+near+me`;
  }
  Linking.canOpenURL(url)
    .then((supported) => {
      if (supported) return Linking.openURL(url);
      return Linking.openURL(`https://maps.google.com/?q=AA+meeting+near+me`);
    })
    .catch(() => Linking.openURL(`https://maps.google.com/?q=AA+meeting+near+me`));
}

function openMapsForAddress(address: string, lat?: number, lng?: number) {
  let url: string;
  if (Platform.OS === "ios") {
    url = lat && lng
      ? `maps://maps.apple.com/?q=${encodeURIComponent(address)}&ll=${lat},${lng}`
      : `maps://maps.apple.com/?q=${encodeURIComponent(address)}`;
  } else {
    url = lat && lng
      ? `geo:${lat},${lng}?q=${encodeURIComponent(address)}`
      : `https://maps.google.com/?q=${encodeURIComponent(address)}`;
  }
  Linking.canOpenURL(url)
    .then((supported) => {
      if (supported) return Linking.openURL(url);
      return Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(address)}`);
    })
    .catch(() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(address)}`));
}

interface MeetingCardProps {
  meeting: NearbyMeeting;
  onPress: () => void;
}

function MeetingCard({ meeting, onPress }: MeetingCardProps) {
  const { theme } = useTheme();
  const dayLabel = DAY_FULL[meeting.day] ?? "";
  const timeLabel = formatTime(meeting.time);
  const distLabel = formatDistance(meeting.distance);
  const typeLabel = getMeetingTypeLabel(meeting.types);

  return (
    <Card style={styles.meetingCard}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.meetingPressable, { opacity: pressed ? 0.7 : 1 }]}
      >
        <View style={styles.meetingMain}>
          <View style={styles.meetingHeader}>
            <ThemedText type="h4" style={styles.meetingName} numberOfLines={2}>
              {meeting.name}
            </ThemedText>
            {distLabel ? (
              <ThemedText style={[styles.meetingDistance, { color: theme.primary }]}>
                {distLabel}
              </ThemedText>
            ) : null}
          </View>
          <View style={styles.meetingMeta}>
            <View style={[styles.metaBadge, { backgroundColor: theme.primary + "15" }]}>
              <Feather name="clock" size={11} color={theme.primary} />
              <ThemedText style={[styles.metaBadgeText, { color: theme.primary }]}>
                {dayLabel} {timeLabel}
              </ThemedText>
            </View>
            <View style={[styles.metaBadge, { backgroundColor: theme.accent + "15" }]}>
              <ThemedText style={[styles.metaBadgeText, { color: theme.accent }]}>
                {typeLabel}
              </ThemedText>
            </View>
          </View>
          {meeting.formatted_address ? (
            <ThemedText
              style={[styles.meetingAddress, { color: theme.textSecondary }]}
              numberOfLines={1}
            >
              {meeting.formatted_address}
            </ThemedText>
          ) : null}
        </View>
        <Feather
          name={meeting.formatted_address ? "map-pin" : "external-link"}
          size={18}
          color={theme.textSecondary}
        />
      </Pressable>
    </Card>
  );
}

interface MeetingFetchResult {
  meetings: NearbyMeeting[];
  failed: boolean;
}

async function tryFetchMeetings(lat: number, lng: number): Promise<MeetingFetchResult> {
  const url = new URL("/api/meetings", getApiUrl());
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lng", String(lng));
  url.searchParams.set("distance", "25");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeout);
    if (!response.ok) return { meetings: [], failed: true };
    const data = await response.json();
    const list: NearbyMeeting[] = Array.isArray(data?.meetings) ? data.meetings : [];
    return { meetings: list.slice(0, 30), failed: false };
  } catch {
    clearTimeout(timeout);
    return { meetings: [], failed: true };
  }
}

export default function MeetingFinderScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [permission, requestPermission] = Location.useForegroundPermissions();

  const [meetings, setMeetings] = useState<NearbyMeeting[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState<DetectedLocation | null>(null);

  const fetchNearbyMeetings = useCallback(async () => {
    setIsSearching(true);
    setHasSearched(true);
    setApiError(false);
    setMeetings([]);

    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude: lat, longitude: lng } = loc.coords;

      let city = "";
      let region = "";
      let postalCode = "";
      try {
        const geocode = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
        if (geocode.length > 0) {
          city = geocode[0].city ?? geocode[0].district ?? "";
          region = geocode[0].region ?? "";
          postalCode = geocode[0].postalCode ?? "";
        }
      } catch {}

      setDetectedLocation({ lat, lng, city, region, postalCode });

      const result = await tryFetchMeetings(lat, lng);
      if (result.failed) {
        setApiError(true);
      } else {
        setMeetings(result.meetings);
      }
    } catch {
      setApiError(true);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleRequestAndSearch = useCallback(async () => {
    const result = await requestPermission();
    if (result?.granted) {
      fetchNearbyMeetings();
    }
  }, [requestPermission, fetchNearbyMeetings]);

  const handleMeetingPress = (meeting: NearbyMeeting) => {
    if (meeting.url) {
      navigation.navigate("WebViewScreen", { url: meeting.url, title: meeting.name });
    } else if (meeting.formatted_address) {
      openMapsForAddress(meeting.formatted_address, meeting.lat, meeting.lng);
    } else if (detectedLocation) {
      openMapsNearby(detectedLocation.lat, detectedLocation.lng);
    }
  };

  const handleOpenMeetingFinder = () => {
    let url = "https://www.aa.org/find-aa/";
    if (detectedLocation?.postalCode) {
      url = `https://www.aa.org/find-aa/?address=${encodeURIComponent(
        detectedLocation.postalCode + " USA"
      )}`;
    } else if (detectedLocation?.city && detectedLocation?.region) {
      url = `https://www.aa.org/find-aa/?address=${encodeURIComponent(
        detectedLocation.city + " " + detectedLocation.region
      )}`;
    }
    navigation.navigate("WebViewScreen", { url, title: "Find AA Meetings" });
  };

  const openUrl = (url: string) => {
    Linking.openURL(url);
  };

  const locationLabel = detectedLocation
    ? [detectedLocation.city, detectedLocation.region].filter(Boolean).join(", ") ||
      detectedLocation.postalCode ||
      "Your Location"
    : "Your Location";

  const renderNearbySection = () => {
    if (Platform.OS === "web") {
      return (
        <Card style={styles.locationCard}>
          <Feather name="map-pin" size={32} color={theme.primary} />
          <ThemedText type="h4" style={styles.locationTitle}>
            Find Nearby Meetings
          </ThemedText>
          <ThemedText style={[styles.locationText, { color: theme.textSecondary }]}>
            GPS-based meeting search is available in the Expo Go app. Use the AA Meeting Finder
            below or scan the QR code to use your device.
          </ThemedText>
          <Pressable
            onPress={() =>
              navigation.navigate("WebViewScreen", {
                url: "https://www.aa.org/find-aa/",
                title: "Find AA Meetings",
              })
            }
            style={({ pressed }) => [
              styles.locationButton,
              { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Feather name="compass" size={16} color="#FFFFFF" />
            <ThemedText style={styles.locationButtonText}>Open Meeting Finder</ThemedText>
          </Pressable>
        </Card>
      );
    }

    if (!permission) {
      return null;
    }

    if (!permission.granted) {
      if (permission.status === "denied" && !permission.canAskAgain) {
        return (
          <Card style={styles.locationCard}>
            <Feather name="map-pin" size={32} color={theme.primary} />
            <ThemedText type="h4" style={styles.locationTitle}>
              Find Nearby Meetings
            </ThemedText>
            <ThemedText style={[styles.locationText, { color: theme.textSecondary }]}>
              Location access is turned off. Enable it in your device settings to search for
              meetings near you, or use the Meeting Finder below.
            </ThemedText>
            <View style={styles.locationButtons}>
              <Pressable
                onPress={async () => {
                  try {
                    await Linking.openSettings();
                  } catch {}
                }}
                style={({ pressed }) => [
                  styles.locationButton,
                  { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Feather name="settings" size={16} color="#FFFFFF" />
                <ThemedText style={styles.locationButtonText}>Open Settings</ThemedText>
              </Pressable>
              <Pressable
                onPress={() =>
                  navigation.navigate("WebViewScreen", {
                    url: "https://www.aa.org/find-aa/",
                    title: "Find AA Meetings",
                  })
                }
                style={({ pressed }) => [
                  styles.locationButton,
                  {
                    backgroundColor: theme.backgroundSecondary,
                    borderWidth: 1,
                    borderColor: theme.border,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Feather name="compass" size={16} color={theme.text} />
                <ThemedText style={[styles.locationButtonText, { color: theme.text }]}>
                  Meeting Finder
                </ThemedText>
              </Pressable>
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
          <ThemedText style={[styles.locationText, { color: theme.textSecondary }]}>
            Share your location to search for AA meetings happening near you right now.
          </ThemedText>
          <Pressable
            onPress={handleRequestAndSearch}
            style={({ pressed }) => [
              styles.locationButton,
              { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Feather name="map-pin" size={16} color="#FFFFFF" />
            <ThemedText style={styles.locationButtonText}>Find Meetings Near Me</ThemedText>
          </Pressable>
        </Card>
      );
    }

    if (!hasSearched) {
      return (
        <Card style={styles.locationCard}>
          <Feather name="map-pin" size={32} color={theme.success} />
          <ThemedText type="h4" style={styles.locationTitle}>
            Find Nearby Meetings
          </ThemedText>
          <ThemedText style={[styles.locationText, { color: theme.textSecondary }]}>
            Search for AA meetings near your current location.
          </ThemedText>
          <Pressable
            onPress={fetchNearbyMeetings}
            style={({ pressed }) => [
              styles.locationButton,
              { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Feather name="search" size={16} color="#FFFFFF" />
            <ThemedText style={styles.locationButtonText}>Find Meetings Near Me</ThemedText>
          </Pressable>
        </Card>
      );
    }

    if (isSearching) {
      return (
        <Card style={[styles.locationCard, { paddingVertical: Spacing["3xl"] }]}>
          <ActivityIndicator size="large" color={theme.primary} />
          <ThemedText
            style={[
              styles.locationText,
              { color: theme.textSecondary, marginTop: Spacing.lg, marginBottom: 0 },
            ]}
          >
            Searching for meetings near you...
          </ThemedText>
        </Card>
      );
    }

    if (apiError) {
      return (
        <Card style={styles.locationCard}>
          <Feather name="wifi-off" size={32} color={theme.textSecondary} />
          <ThemedText type="h4" style={styles.locationTitle}>
            Connection Problem
          </ThemedText>
          <ThemedText style={[styles.locationText, { color: theme.textSecondary }]}>
            Could not reach the meeting directory right now. Use the Meeting Finder below to
            search for meetings, or try again.
          </ThemedText>
          <View style={styles.locationButtons}>
            <Pressable
              onPress={fetchNearbyMeetings}
              style={({ pressed }) => [
                styles.locationButton,
                { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Feather name="refresh-cw" size={16} color="#FFFFFF" />
              <ThemedText style={styles.locationButtonText}>Try Again</ThemedText>
            </Pressable>
            <Pressable
              onPress={handleOpenMeetingFinder}
              style={({ pressed }) => [
                styles.locationButton,
                {
                  backgroundColor: theme.backgroundSecondary,
                  borderWidth: 1,
                  borderColor: theme.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Feather name="compass" size={16} color={theme.text} />
              <ThemedText style={[styles.locationButtonText, { color: theme.text }]}>
                Meeting Finder
              </ThemedText>
            </Pressable>
          </View>
        </Card>
      );
    }

    if (hasSearched && meetings.length === 0) {
      return (
        <View>
          <Card style={styles.locationCard}>
            <Feather name="compass" size={32} color={theme.primary} />
            <ThemedText type="h4" style={styles.locationTitle}>
              {locationLabel}
            </ThemedText>
            <ThemedText style={[styles.locationText, { color: theme.textSecondary }]}>
              No meetings found nearby in our directory. Open the AA Meeting Finder to search
              directly, or try Maps.
            </ThemedText>
            <View style={styles.locationButtons}>
              <Pressable
                onPress={handleOpenMeetingFinder}
                style={({ pressed }) => [
                  styles.locationButton,
                  { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Feather name="compass" size={16} color="#FFFFFF" />
                <ThemedText style={styles.locationButtonText}>Open Meeting Finder</ThemedText>
              </Pressable>
              {detectedLocation ? (
                <Pressable
                  onPress={() => openMapsNearby(detectedLocation.lat, detectedLocation.lng)}
                  style={({ pressed }) => [
                    styles.locationButton,
                    {
                      backgroundColor: theme.backgroundSecondary,
                      borderWidth: 1,
                      borderColor: theme.border,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Feather name="map" size={16} color={theme.text} />
                  <ThemedText style={[styles.locationButtonText, { color: theme.text }]}>
                    Open in Maps
                  </ThemedText>
                </Pressable>
              ) : null}
            </View>
            <Pressable
              onPress={fetchNearbyMeetings}
              style={({ pressed }) => [styles.retryLink, { opacity: pressed ? 0.6 : 1 }]}
            >
              <ThemedText style={[styles.retryLinkText, { color: theme.textSecondary }]}>
                Try again
              </ThemedText>
            </Pressable>
          </Card>
        </View>
      );
    }

    if (meetings.length > 0) {
      return (
        <View style={styles.meetingResultsSection}>
          <View style={styles.meetingResultsHeader}>
            <View>
              <ThemedText type="h4">{meetings.length} Meetings Near You</ThemedText>
              {locationLabel ? (
                <ThemedText style={[styles.locationSubLabel, { color: theme.textSecondary }]}>
                  {locationLabel}
                </ThemedText>
              ) : null}
            </View>
            <View style={styles.meetingResultsActions}>
              {detectedLocation ? (
                <Pressable
                  onPress={handleOpenMeetingFinder}
                  style={({ pressed }) => [
                    styles.mapButton,
                    { backgroundColor: theme.backgroundSecondary, opacity: pressed ? 0.8 : 1 },
                  ]}
                >
                  <Feather name="compass" size={15} color={theme.primary} />
                </Pressable>
              ) : null}
              <Pressable
                onPress={fetchNearbyMeetings}
                style={({ pressed }) => [styles.refreshButton, { opacity: pressed ? 0.6 : 1 }]}
              >
                <Feather name="refresh-cw" size={16} color={theme.primary} />
              </Pressable>
            </View>
          </View>
          {meetings.map((meeting, index) => (
            <MeetingCard
              key={`${meeting.name}-${meeting.day}-${meeting.time}-${index}`}
              meeting={meeting}
              onPress={() => handleMeetingPress(meeting)}
            />
          ))}
        </View>
      );
    }

    return null;
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
        <View style={[styles.resourceIconContainer, { backgroundColor: theme.primary + "15" }]}>
          <Feather name={resource.icon} size={24} color={theme.primary} />
        </View>
        <View style={styles.resourceTextContainer}>
          <ThemedText type="h4">{resource.title}</ThemedText>
          <ThemedText style={[styles.resourceDescription, { color: theme.textSecondary }]}>
            {resource.description}
          </ThemedText>
        </View>
        <Feather name="external-link" size={18} color={theme.textSecondary} />
      </Pressable>
    </Card>
  );

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
      {renderNearbySection()}

      <ThemedText type="h3" style={styles.sectionTitle}>
        Meeting Resources
      </ThemedText>
      <ThemedText style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
        Find in-person and online meetings through these trusted resources
      </ThemedText>
      {MEETING_RESOURCES.map(renderResourceCard)}

      <ThemedText type="h3" style={[styles.sectionTitle, { marginTop: Spacing["2xl"] }]}>
        Meeting Tips
      </ThemedText>
      <ThemedText style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
        Helpful information for finding the right meeting
      </ThemedText>
      {MEETING_TIPS.map((tip, index) => (
        <Card key={index} style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <View style={[styles.tipNumber, { backgroundColor: theme.primary + "15" }]}>
              <ThemedText style={[styles.tipNumberText, { color: theme.primary }]}>
                {index + 1}
              </ThemedText>
            </View>
            <ThemedText type="h4" style={styles.tipTitle}>
              {tip.title}
            </ThemedText>
          </View>
          <ThemedText style={[styles.tipContent, { color: theme.textSecondary }]}>
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
    flexWrap: "wrap",
    gap: Spacing.md,
    justifyContent: "center",
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
  retryLink: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  retryLinkText: {
    fontSize: 14,
  },
  locationSubLabel: {
    fontSize: 13,
    marginTop: 2,
  },
  meetingResultsSection: {
    marginBottom: Spacing.md,
  },
  meetingResultsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
    marginTop: Spacing.xs,
  },
  meetingResultsActions: {
    flexDirection: "row",
    gap: Spacing.sm,
    alignItems: "center",
  },
  refreshButton: {
    padding: Spacing.sm,
  },
  mapButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.xs,
  },
  meetingCard: {
    marginBottom: Spacing.sm,
    padding: 0,
  },
  meetingPressable: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  meetingMain: {
    flex: 1,
  },
  meetingHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  meetingName: {
    flex: 1,
    fontSize: 16,
  },
  meetingDistance: {
    fontWeight: "700",
    fontSize: 13,
    minWidth: 40,
    textAlign: "right",
  },
  meetingMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
  },
  metaBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  meetingAddress: {
    fontSize: 13,
    marginTop: 2,
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
