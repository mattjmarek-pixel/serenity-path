import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Linking,
  Platform,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";

import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface Meeting {
  id: string;
  name: string;
  time: string;
  day: string;
  address: string;
  type: string;
  distance?: string;
}

const SAMPLE_MEETINGS: Meeting[] = [
  {
    id: "1",
    name: "Serenity Group",
    time: "7:00 PM",
    day: "Monday",
    address: "123 Hope Street, Community Center",
    type: "Open Discussion",
  },
  {
    id: "2",
    name: "New Beginnings",
    time: "12:00 PM",
    day: "Daily",
    address: "456 Recovery Ave, Church Basement",
    type: "Speaker Meeting",
  },
  {
    id: "3",
    name: "Steps to Freedom",
    time: "6:30 PM",
    day: "Wednesday",
    address: "789 Unity Blvd, Hospital Conference Room",
    type: "Step Study",
  },
  {
    id: "4",
    name: "Early Birds",
    time: "6:00 AM",
    day: "Daily",
    address: "321 Sunrise Dr, Coffee Shop",
    type: "Open Discussion",
  },
  {
    id: "5",
    name: "Women in Recovery",
    time: "5:30 PM",
    day: "Thursday",
    address: "555 Courage Lane, Library Meeting Room",
    type: "Women Only",
  },
];

export default function MeetingFinderScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [permission, requestPermission] = Location.useForegroundPermissions();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [meetings, setMeetings] = useState<Meeting[]>(SAMPLE_MEETINGS);

  useEffect(() => {
    if (permission?.granted) {
      fetchLocation();
    }
  }, [permission?.granted]);

  const fetchLocation = async () => {
    setIsLoading(true);
    try {
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(currentLocation);
      const meetingsWithDistance = SAMPLE_MEETINGS.map((meeting, index) => ({
        ...meeting,
        distance: `${(0.5 + index * 0.8).toFixed(1)} mi`,
      }));
      setMeetings(meetingsWithDistance);
    } catch (error) {
      console.log("Error fetching location:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openMeetingGuide = () => {
    Linking.openURL("https://www.aa.org/find-aa");
  };

  const openOnlineIntergroup = () => {
    Linking.openURL("https://aa-intergroup.org/meetings/");
  };

  const filteredMeetings = meetings.filter(
    (meeting) =>
      meeting.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.day.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderLocationRequest = () => (
    <Card style={styles.locationCard}>
      <Feather name="map-pin" size={40} color={theme.primary} />
      <ThemedText type="h4" style={styles.locationTitle}>
        Find Nearby Meetings
      </ThemedText>
      <ThemedText style={[styles.locationText, { color: theme.textSecondary }]}>
        Enable location to find AA meetings near you
      </ThemedText>
      <Pressable
        onPress={requestPermission}
        style={({ pressed }) => [
          styles.enableButton,
          { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 },
        ]}
      >
        <ThemedText style={styles.enableButtonText}>Enable Location</ThemedText>
      </Pressable>
    </Card>
  );

  const renderDeniedPermission = () => (
    <Card style={styles.locationCard}>
      <Feather name="map-pin" size={40} color={theme.textSecondary} />
      <ThemedText type="h4" style={styles.locationTitle}>
        Location Access Needed
      </ThemedText>
      <ThemedText style={[styles.locationText, { color: theme.textSecondary }]}>
        To find meetings near you, please enable location access in your device settings.
      </ThemedText>
      {Platform.OS !== "web" && (
        <Pressable
          onPress={async () => {
            try {
              await Linking.openSettings();
            } catch (error) {
              console.log("Cannot open settings");
            }
          }}
          style={({ pressed }) => [
            styles.enableButton,
            { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <ThemedText style={styles.enableButtonText}>Open Settings</ThemedText>
        </Pressable>
      )}
    </Card>
  );

  const renderMeetingCard = (meeting: Meeting) => (
    <Card key={meeting.id} style={styles.meetingCard}>
      <View style={styles.meetingHeader}>
        <View style={styles.meetingInfo}>
          <ThemedText type="h4">{meeting.name}</ThemedText>
          <View style={styles.meetingMeta}>
            <View style={[styles.typeBadge, { backgroundColor: theme.primary + "20" }]}>
              <ThemedText style={[styles.typeText, { color: theme.primary }]}>
                {meeting.type}
              </ThemedText>
            </View>
            {meeting.distance ? (
              <ThemedText style={[styles.distance, { color: theme.accent }]}>
                {meeting.distance}
              </ThemedText>
            ) : null}
          </View>
        </View>
      </View>
      <View style={styles.meetingDetails}>
        <View style={styles.detailRow}>
          <Feather name="clock" size={16} color={theme.textSecondary} />
          <ThemedText style={{ color: theme.textSecondary }}>
            {meeting.day} at {meeting.time}
          </ThemedText>
        </View>
        <View style={styles.detailRow}>
          <Feather name="map-pin" size={16} color={theme.textSecondary} />
          <ThemedText style={{ color: theme.textSecondary }}>{meeting.address}</ThemedText>
        </View>
      </View>
    </Card>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: Spacing.xl,
        paddingBottom: insets.bottom + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
    >
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.backgroundSecondary }]}>
          <Feather name="search" size={20} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search by name, type, or day..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery("")}>
              <Feather name="x" size={20} color={theme.textSecondary} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <View style={styles.quickLinks}>
        <Pressable
          onPress={openMeetingGuide}
          style={({ pressed }) => [
            styles.quickLinkButton,
            { backgroundColor: theme.secondary, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Feather name="globe" size={18} color="#FFFFFF" />
          <ThemedText style={styles.quickLinkText}>AA Meeting Guide</ThemedText>
        </Pressable>
        <Pressable
          onPress={openOnlineIntergroup}
          style={({ pressed }) => [
            styles.quickLinkButton,
            { backgroundColor: theme.accent, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Feather name="video" size={18} color="#FFFFFF" />
          <ThemedText style={styles.quickLinkText}>Online Meetings</ThemedText>
        </Pressable>
      </View>

      {!permission ? (
        <ActivityIndicator size="large" color={theme.primary} />
      ) : !permission.granted ? (
        permission.status === "denied" && !permission.canAskAgain ? (
          renderDeniedPermission()
        ) : (
          renderLocationRequest()
        )
      ) : isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <ThemedText style={[styles.loadingText, { color: theme.textSecondary }]}>
            Finding meetings near you...
          </ThemedText>
        </View>
      ) : (
        <View style={styles.meetingsSection}>
          <View style={styles.sectionHeader}>
            <ThemedText type="h4">
              {location ? "Meetings Near You" : "Available Meetings"}
            </ThemedText>
            <ThemedText style={{ color: theme.textSecondary }}>
              {filteredMeetings.length} found
            </ThemedText>
          </View>
          {filteredMeetings.map(renderMeetingCard)}
        </View>
      )}

      <Card style={styles.disclaimerCard}>
        <Feather name="info" size={20} color={theme.textSecondary} />
        <ThemedText style={[styles.disclaimerText, { color: theme.textSecondary }]}>
          Meeting information shown is for demonstration purposes. For accurate, up-to-date
          meeting information, please visit aa.org or use the AA Meeting Guide app.
        </ThemedText>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    marginBottom: Spacing.lg,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: Spacing.xs,
  },
  quickLinks: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  quickLinkButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    gap: Spacing.sm,
  },
  quickLinkText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  locationCard: {
    alignItems: "center",
    padding: Spacing["2xl"],
  },
  locationTitle: {
    marginTop: Spacing.md,
    textAlign: "center",
  },
  locationText: {
    textAlign: "center",
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  enableButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  enableButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  loadingContainer: {
    alignItems: "center",
    padding: Spacing["3xl"],
  },
  loadingText: {
    marginTop: Spacing.md,
  },
  meetingsSection: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  meetingCard: {
    marginBottom: Spacing.md,
  },
  meetingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  meetingInfo: {
    flex: 1,
  },
  meetingMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  typeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  distance: {
    fontWeight: "600",
    fontSize: 14,
  },
  meetingDetails: {
    gap: Spacing.sm,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  disclaimerCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
  },
});
