import React, { useCallback } from "react";
import { View, StyleSheet, Pressable, ScrollView, Linking, Platform, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { useProfile } from "@/hooks/useProfile";
import { Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

export default function SupportScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { profile, loadProfile } = useProfile();

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  const hasSponsor = profile.sponsorName && profile.sponsorPhone;
  const hasEmergencyContact = profile.emergencyContact && profile.emergencyPhone;

  const makeCall = (number: string) => {
    const phoneUrl = `tel:${number}`;
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(phoneUrl);
        } else {
          Alert.alert("Unable to make call", "Phone calling is not supported on this device.");
        }
      })
      .catch(() => {
        Alert.alert("Error", "Could not initiate phone call.");
      });
  };

  const sendText = (number: string) => {
    const smsUrl = Platform.OS === "ios" ? `sms:${number}` : `sms:${number}`;
    Linking.canOpenURL(smsUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(smsUrl);
        } else {
          Alert.alert("Unable to send message", "SMS is not supported on this device.");
        }
      })
      .catch(() => {
        Alert.alert("Error", "Could not open messaging app.");
      });
  };

  const handleEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.lg,
        paddingBottom: insets.bottom + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
    >
      <ThemedText type="body" style={[styles.subtitle, { color: theme.textSecondary }]}>
        You are not alone. Help is available 24/7.
      </ThemedText>

      <Pressable
        onPress={() => makeCall("988")}
        style={({ pressed }) => [
          styles.emergencyCard,
          { backgroundColor: theme.emergency, opacity: pressed ? 0.9 : 1 },
        ]}
      >
        <View style={styles.emergencyIcon}>
          <Feather name="phone" size={28} color="#FFFFFF" />
        </View>
        <View style={styles.emergencyContent}>
          <ThemedText style={styles.emergencyTitle}>Crisis Helpline</ThemedText>
          <ThemedText style={styles.emergencyNumber}>988</ThemedText>
          <ThemedText style={styles.emergencySubtext}>Tap to call - Available 24/7</ThemedText>
        </View>
      </Pressable>

      <Pressable
        onPress={() => makeCall("18004574673")}
        style={({ pressed }) => [
          styles.hotlineCard,
          { backgroundColor: theme.primary, opacity: pressed ? 0.9 : 1 },
        ]}
      >
        <View style={styles.emergencyIcon}>
          <Feather name="phone-call" size={24} color="#FFFFFF" />
        </View>
        <View style={styles.emergencyContent}>
          <ThemedText style={styles.hotlineTitle}>National AA Helpline</ThemedText>
          <ThemedText style={styles.hotlineNumber}>1-800-457-4673</ThemedText>
          <ThemedText style={styles.hotlineSubtext}>Tap to call</ThemedText>
        </View>
      </Pressable>

      <View style={styles.sectionHeader}>
        <ThemedText type="h4">My Sponsor</ThemedText>
      </View>

      {hasSponsor ? (
        <Card style={styles.sponsorCard}>
          <View style={styles.sponsorHeader}>
            <View style={[styles.sponsorAvatar, { backgroundColor: theme.accent + "30" }]}>
              <Feather name="user" size={24} color={theme.primary} />
            </View>
            <View style={styles.sponsorInfo}>
              <ThemedText type="h4">{profile.sponsorName}</ThemedText>
              <ThemedText style={{ color: theme.textSecondary }}>{profile.sponsorPhone}</ThemedText>
            </View>
          </View>
          <View style={styles.sponsorActions}>
            <Pressable
              onPress={() => makeCall(profile.sponsorPhone)}
              style={({ pressed }) => [
                styles.sponsorActionButton,
                { backgroundColor: theme.secondary, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Feather name="phone" size={18} color="#FFFFFF" />
              <ThemedText style={styles.sponsorActionText}>Call</ThemedText>
            </Pressable>
            <Pressable
              onPress={() => sendText(profile.sponsorPhone)}
              style={({ pressed }) => [
                styles.sponsorActionButton,
                { backgroundColor: theme.accent, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Feather name="message-circle" size={18} color="#FFFFFF" />
              <ThemedText style={styles.sponsorActionText}>Text</ThemedText>
            </Pressable>
          </View>
          <Pressable
            onPress={handleEditProfile}
            style={({ pressed }) => [styles.editLink, { opacity: pressed ? 0.6 : 1 }]}
          >
            <ThemedText style={{ color: theme.primary }}>Edit sponsor info</ThemedText>
          </Pressable>
        </Card>
      ) : (
        <Pressable
          onPress={handleEditProfile}
          style={({ pressed }) => [
            styles.addSponsorCard,
            { backgroundColor: theme.backgroundDefault, borderColor: theme.border, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Feather name="user-plus" size={32} color={theme.primary} />
          <ThemedText type="h4" style={styles.addSponsorText}>Add Sponsor</ThemedText>
          <ThemedText style={[styles.addSponsorSubtext, { color: theme.textSecondary }]}>
            Add your sponsor's contact in your profile
          </ThemedText>
        </Pressable>
      )}

      {hasEmergencyContact ? (
        <>
          <View style={styles.sectionHeader}>
            <ThemedText type="h4">Emergency Contact</ThemedText>
          </View>
          <Card style={styles.sponsorCard}>
            <View style={styles.sponsorHeader}>
              <View style={[styles.sponsorAvatar, { backgroundColor: theme.emergency + "30" }]}>
                <Feather name="heart" size={24} color={theme.emergency} />
              </View>
              <View style={styles.sponsorInfo}>
                <ThemedText type="h4">{profile.emergencyContact}</ThemedText>
                <ThemedText style={{ color: theme.textSecondary }}>{profile.emergencyPhone}</ThemedText>
              </View>
            </View>
            <View style={styles.sponsorActions}>
              <Pressable
                onPress={() => makeCall(profile.emergencyPhone)}
                style={({ pressed }) => [
                  styles.sponsorActionButton,
                  { backgroundColor: theme.emergency, opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Feather name="phone" size={18} color="#FFFFFF" />
                <ThemedText style={styles.sponsorActionText}>Call</ThemedText>
              </Pressable>
              <Pressable
                onPress={() => sendText(profile.emergencyPhone)}
                style={({ pressed }) => [
                  styles.sponsorActionButton,
                  { backgroundColor: theme.accent, opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Feather name="message-circle" size={18} color="#FFFFFF" />
                <ThemedText style={styles.sponsorActionText}>Text</ThemedText>
              </Pressable>
            </View>
          </Card>
        </>
      ) : null}

      <View style={styles.sectionHeader}>
        <ThemedText type="h4">Additional Resources</ThemedText>
      </View>

      <Card 
        style={styles.resourceCard}
        onPress={() => navigation.navigate("MeetingFinder")}
      >
        <View style={styles.resourceRow}>
          <Feather name="map-pin" size={20} color={theme.primary} />
          <ThemedText style={styles.resourceText}>Find local AA meetings</ThemedText>
          <Feather name="chevron-right" size={20} color={theme.textSecondary} />
        </View>
      </Card>

      <Card 
        style={styles.resourceCard}
        onPress={() => navigation.navigate("BigBook")}
      >
        <View style={styles.resourceRow}>
          <Feather name="book" size={20} color={theme.primary} />
          <ThemedText style={styles.resourceText}>AA Literature & Big Book</ThemedText>
          <Feather name="chevron-right" size={20} color={theme.textSecondary} />
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  emergencyCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  emergencyIcon: {
    marginRight: Spacing.lg,
  },
  emergencyContent: {
    flex: 1,
  },
  emergencyTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  emergencyNumber: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
    marginVertical: Spacing.xs,
  },
  emergencySubtext: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
  },
  hotlineCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
  },
  hotlineTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  hotlineNumber: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginVertical: Spacing.xs,
  },
  hotlineSubtext: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 11,
  },
  sectionHeader: {
    marginBottom: Spacing.md,
  },
  sponsorCard: {
    marginBottom: Spacing.xl,
  },
  sponsorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  sponsorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  sponsorInfo: {
    flex: 1,
  },
  sponsorActions: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sponsorActionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  sponsorActionText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  editLink: {
    alignItems: "center",
    paddingVertical: Spacing.xs,
  },
  addSponsorCard: {
    alignItems: "center",
    paddingVertical: Spacing["2xl"],
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderStyle: "dashed",
    marginBottom: Spacing.xl,
  },
  addSponsorText: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  addSponsorSubtext: {
    textAlign: "center",
  },
  resourceCard: {
    marginBottom: Spacing.sm,
  },
  resourceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  resourceText: {
    flex: 1,
  },
});
