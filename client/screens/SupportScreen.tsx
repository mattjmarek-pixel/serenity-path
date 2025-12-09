import React, { useState } from "react";
import { View, StyleSheet, Pressable, ScrollView, Linking, Platform, Alert, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, Colors, BorderRadius } from "@/constants/theme";

interface SponsorInfo {
  name: string;
  phone: string;
}

export default function SupportScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [sponsor, setSponsor] = useState<SponsorInfo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

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

  const saveSponsor = () => {
    if (editName.trim() && editPhone.trim()) {
      setSponsor({ name: editName.trim(), phone: editPhone.trim() });
      setIsEditing(false);
    }
  };

  const startEditing = () => {
    setEditName(sponsor?.name || "");
    setEditPhone(sponsor?.phone || "");
    setIsEditing(true);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: Spacing.xl,
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
          { backgroundColor: Colors.light.emergency, opacity: pressed ? 0.9 : 1 },
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
          { backgroundColor: Colors.light.primary, opacity: pressed ? 0.9 : 1 },
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

      {isEditing ? (
        <Card style={styles.sponsorCard}>
          <TextInput
            style={[styles.input, { backgroundColor: theme.backgroundSecondary, color: theme.text }]}
            placeholder="Sponsor name"
            placeholderTextColor={theme.textSecondary}
            value={editName}
            onChangeText={setEditName}
          />
          <TextInput
            style={[styles.input, { backgroundColor: theme.backgroundSecondary, color: theme.text }]}
            placeholder="Phone number"
            placeholderTextColor={theme.textSecondary}
            value={editPhone}
            onChangeText={setEditPhone}
            keyboardType="phone-pad"
          />
          <View style={styles.editButtonsRow}>
            <Pressable
              onPress={() => setIsEditing(false)}
              style={({ pressed }) => [
                styles.cancelButton,
                { backgroundColor: theme.backgroundSecondary, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <ThemedText style={{ color: theme.text }}>Cancel</ThemedText>
            </Pressable>
            <Pressable
              onPress={saveSponsor}
              style={({ pressed }) => [
                styles.saveButton,
                { backgroundColor: Colors.light.primary, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <ThemedText style={styles.saveButtonText}>Save</ThemedText>
            </Pressable>
          </View>
        </Card>
      ) : sponsor ? (
        <Card style={styles.sponsorCard}>
          <View style={styles.sponsorHeader}>
            <View style={[styles.sponsorAvatar, { backgroundColor: Colors.light.accent }]}>
              <Feather name="user" size={24} color={Colors.light.primary} />
            </View>
            <View style={styles.sponsorInfo}>
              <ThemedText type="h4">{sponsor.name}</ThemedText>
              <ThemedText style={{ color: theme.textSecondary }}>{sponsor.phone}</ThemedText>
            </View>
          </View>
          <View style={styles.sponsorActions}>
            <Pressable
              onPress={() => makeCall(sponsor.phone)}
              style={({ pressed }) => [
                styles.sponsorActionButton,
                { backgroundColor: Colors.light.primary, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Feather name="phone" size={18} color="#FFFFFF" />
              <ThemedText style={styles.sponsorActionText}>Call</ThemedText>
            </Pressable>
            <Pressable
              onPress={() => sendText(sponsor.phone)}
              style={({ pressed }) => [
                styles.sponsorActionButton,
                { backgroundColor: Colors.light.secondary, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Feather name="message-circle" size={18} color="#FFFFFF" />
              <ThemedText style={styles.sponsorActionText}>Text</ThemedText>
            </Pressable>
          </View>
          <Pressable
            onPress={startEditing}
            style={({ pressed }) => [styles.editLink, { opacity: pressed ? 0.6 : 1 }]}
          >
            <ThemedText style={{ color: Colors.light.primary }}>Edit sponsor info</ThemedText>
          </Pressable>
        </Card>
      ) : (
        <Pressable
          onPress={startEditing}
          style={({ pressed }) => [
            styles.addSponsorCard,
            { backgroundColor: theme.backgroundDefault, borderColor: theme.border, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Feather name="user-plus" size={32} color={Colors.light.primary} />
          <ThemedText type="h4" style={styles.addSponsorText}>Add Sponsor</ThemedText>
          <ThemedText style={[styles.addSponsorSubtext, { color: theme.textSecondary }]}>
            Add your sponsor's contact for quick access
          </ThemedText>
        </Pressable>
      )}

      <View style={styles.sectionHeader}>
        <ThemedText type="h4">Additional Resources</ThemedText>
      </View>

      <Card style={styles.resourceCard}>
        <View style={styles.resourceRow}>
          <Feather name="globe" size={20} color={Colors.light.primary} />
          <ThemedText style={styles.resourceText}>Find local AA meetings</ThemedText>
          <Feather name="chevron-right" size={20} color={theme.textSecondary} />
        </View>
      </Card>

      <Card style={styles.resourceCard}>
        <View style={styles.resourceRow}>
          <Feather name="book" size={20} color={Colors.light.primary} />
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
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
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
    fontSize: 18,
    fontWeight: "700",
  },
  hotlineSubtext: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
  },
  sectionHeader: {
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },
  sponsorCard: {
    marginBottom: Spacing.lg,
  },
  sponsorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  sponsorAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  sponsorInfo: {
    flex: 1,
  },
  sponsorActions: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  sponsorActionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    gap: Spacing.sm,
  },
  sponsorActionText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  editLink: {
    alignItems: "center",
  },
  addSponsorCard: {
    alignItems: "center",
    padding: Spacing["2xl"],
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderStyle: "dashed",
    marginBottom: Spacing.lg,
  },
  addSponsorText: {
    marginTop: Spacing.md,
  },
  addSponsorSubtext: {
    marginTop: Spacing.xs,
    textAlign: "center",
  },
  input: {
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
    fontSize: 16,
  },
  editButtonsRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  cancelButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  saveButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
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
