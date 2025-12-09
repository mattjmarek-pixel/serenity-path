import React, { useState } from "react";
import { View, StyleSheet, Pressable, Image, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, Colors, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

const MILESTONES = [
  { days: 1, label: "24h", achieved: true },
  { days: 7, label: "1W", achieved: true },
  { days: 30, label: "30D", achieved: true },
  { days: 90, label: "90D", achieved: false },
  { days: 180, label: "6M", achieved: false },
  { days: 365, label: "1Y", achieved: false },
];

interface SettingsItemProps {
  icon: string;
  label: string;
  onPress: () => void;
  showChevron?: boolean;
  danger?: boolean;
}

function SettingsItem({ icon, label, onPress, showChevron = true, danger = false }: SettingsItemProps) {
  const { theme } = useTheme();
  
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.settingsItem,
        { 
          backgroundColor: pressed ? theme.backgroundSecondary : theme.backgroundDefault,
          borderColor: theme.border,
        },
      ]}
    >
      <Feather
        name={icon as any}
        size={20}
        color={danger ? Colors.light.emergency : Colors.light.primary}
      />
      <ThemedText
        style={[
          styles.settingsLabel,
          danger && { color: Colors.light.emergency },
        ]}
      >
        {label}
      </ThemedText>
      {showChevron ? (
        <Feather name="chevron-right" size={20} color={theme.textSecondary} />
      ) : null}
    </Pressable>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [userName] = useState("Recovery Warrior");
  const [sobrietyDate] = useState("October 23, 2025");

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Log Out", style: "destructive", onPress: () => {} },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            Alert.alert(
              "Final Confirmation",
              "This will permanently delete all your sobriety data, journal entries, and account information.",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Delete Forever", style: "destructive", onPress: () => {} },
              ]
            );
          },
        },
      ]
    );
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: tabBarHeight + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      <View style={styles.profileHeader}>
        <View style={[styles.avatar, { backgroundColor: Colors.light.accent }]}>
          <Feather name="user" size={40} color={Colors.light.primary} />
        </View>
        <ThemedText type="h3" style={styles.userName}>{userName}</ThemedText>
        <Pressable style={({ pressed }) => [styles.editButton, { opacity: pressed ? 0.6 : 1 }]}>
          <ThemedText style={{ color: Colors.light.primary }}>Edit Profile</ThemedText>
        </Pressable>
      </View>

      <Card style={styles.sobrietyCard}>
        <View style={styles.sobrietyRow}>
          <View>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>Sobriety Date</ThemedText>
            <ThemedText type="h4">{sobrietyDate}</ThemedText>
          </View>
          <Pressable style={({ pressed }) => [styles.editDateButton, { opacity: pressed ? 0.7 : 1 }]}>
            <Feather name="edit-2" size={16} color={Colors.light.primary} />
          </Pressable>
        </View>
      </Card>

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>Milestone Progress</ThemedText>
        <View style={styles.milestonesRow}>
          {MILESTONES.map((milestone, index) => (
            <View key={milestone.days} style={styles.milestoneItem}>
              <View
                style={[
                  styles.milestoneDot,
                  {
                    backgroundColor: milestone.achieved
                      ? Colors.light.secondary
                      : theme.backgroundSecondary,
                  },
                ]}
              >
                {milestone.achieved ? (
                  <Feather name="check" size={12} color="#FFFFFF" />
                ) : null}
              </View>
              <ThemedText
                type="small"
                style={[
                  styles.milestoneLabel,
                  { color: milestone.achieved ? Colors.light.secondary : theme.textSecondary },
                ]}
              >
                {milestone.label}
              </ThemedText>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>My Recovery</ThemedText>
        <SettingsItem
          icon="edit-3"
          label="Journal"
          onPress={() => navigation.navigate("Journal")}
        />
        <SettingsItem
          icon="heart"
          label="Saved Reflections"
          onPress={() => {}}
        />
        <SettingsItem
          icon="calendar"
          label="Meeting History"
          onPress={() => {}}
        />
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>Settings</ThemedText>
        <SettingsItem
          icon="bell"
          label="Notifications"
          onPress={() => {}}
        />
        <SettingsItem
          icon="lock"
          label="Privacy"
          onPress={() => {}}
        />
        <SettingsItem
          icon="help-circle"
          label="Help & Support"
          onPress={() => {}}
        />
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>Account</ThemedText>
        <SettingsItem
          icon="log-out"
          label="Log Out"
          onPress={handleLogout}
          showChevron={false}
        />
        <SettingsItem
          icon="trash-2"
          label="Delete Account"
          onPress={handleDeleteAccount}
          showChevron={false}
          danger
        />
      </View>

      <ThemedText type="small" style={[styles.version, { color: theme.textSecondary }]}>
        Serenity Path v1.0.0
      </ThemedText>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  userName: {
    marginBottom: Spacing.sm,
  },
  editButton: {
    paddingVertical: Spacing.xs,
  },
  sobrietyCard: {
    marginBottom: Spacing.xl,
  },
  sobrietyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  editDateButton: {
    padding: Spacing.sm,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  milestonesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.sm,
  },
  milestoneItem: {
    alignItems: "center",
  },
  milestoneDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xs,
  },
  milestoneLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    gap: Spacing.md,
  },
  settingsLabel: {
    flex: 1,
    fontWeight: "500",
  },
  version: {
    textAlign: "center",
    marginTop: Spacing.lg,
  },
});
