import React, { useMemo } from "react";
import { View, StyleSheet, Pressable, Alert, Linking } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { useThemeContext, ThemeMode } from "@/contexts/ThemeContext";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { getApiUrl } from "@/lib/query-client";

const MILESTONES = [
  { days: 1, label: "24h" },
  { days: 7, label: "1W" },
  { days: 30, label: "30D" },
  { days: 90, label: "90D" },
  { days: 180, label: "6M" },
  { days: 365, label: "1Y" },
];

interface SettingsItemProps {
  icon: string;
  label: string;
  onPress: () => void;
  showChevron?: boolean;
  danger?: boolean;
}

interface AppearanceOptionProps {
  mode: ThemeMode;
  label: string;
  currentMode: ThemeMode;
  onSelect: (mode: ThemeMode) => void;
}

function AppearanceOption({ mode, label, currentMode, onSelect }: AppearanceOptionProps) {
  const { theme } = useTheme();
  const isSelected = mode === currentMode;

  return (
    <Pressable
      onPress={() => onSelect(mode)}
      style={[
        styles.appearanceOption,
        {
          backgroundColor: isSelected ? theme.primary : theme.backgroundSecondary,
          borderColor: isSelected ? theme.primary : theme.border,
        },
      ]}
    >
      <ThemedText
        style={[
          styles.appearanceLabel,
          { color: isSelected ? "#FFFFFF" : theme.text },
        ]}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
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
        color={danger ? theme.emergency : theme.primary}
      />
      <ThemedText
        style={[
          styles.settingsLabel,
          danger && { color: theme.emergency },
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
  const { themeMode, setThemeMode } = useThemeContext();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { profile, loadProfile, getSobrietyDays } = useProfile();
  const { user, isGuest, logout, deleteAccount } = useAuth();

  useFocusEffect(
    React.useCallback(() => {
      loadProfile();
    }, [])
  );

  const sobrietyDays = getSobrietyDays();
  
  const milestoneStatus = useMemo(() => {
    return MILESTONES.map(m => ({
      ...m,
      achieved: sobrietyDays !== null && sobrietyDays >= m.days,
    }));
  }, [sobrietyDays]);

  const formattedSobrietyDate = useMemo(() => {
    if (!profile.sobrietyDate) return "Not set";
    return new Date(profile.sobrietyDate).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, [profile.sobrietyDate]);

  const handleEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out? Your local data will be preserved.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Log Out", style: "destructive", onPress: () => { logout(); } },
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
                { text: "Delete Forever", style: "destructive", onPress: () => { deleteAccount(); } },
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
        <View style={[styles.avatar, { backgroundColor: theme.accent + "30" }]}>
          <Feather name="user" size={40} color={theme.primary} />
        </View>
        <ThemedText type="h3" style={styles.userName}>{profile.name}</ThemedText>
        {profile.pronouns ? (
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {profile.pronouns}
          </ThemedText>
        ) : null}
        <Pressable 
          onPress={handleEditProfile}
          style={({ pressed }) => [styles.editButton, { opacity: pressed ? 0.6 : 1 }]}
        >
          <ThemedText style={{ color: theme.primary }}>Edit Profile</ThemedText>
        </Pressable>
      </View>

      <Card style={styles.sobrietyCard}>
        <View style={styles.sobrietyRow}>
          <View>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>Sobriety Date</ThemedText>
            <ThemedText type="h4">{formattedSobrietyDate}</ThemedText>
          </View>
          <Pressable 
            onPress={handleEditProfile}
            style={({ pressed }) => [styles.editDateButton, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Feather name="edit-2" size={16} color={theme.primary} />
          </Pressable>
        </View>
      </Card>

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>Milestone Progress</ThemedText>
        <View style={styles.milestonesRow}>
          {milestoneStatus.map((milestone) => (
            <View key={milestone.days} style={styles.milestoneItem}>
              <View
                style={[
                  styles.milestoneDot,
                  {
                    backgroundColor: milestone.achieved
                      ? theme.accent
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
                  { color: milestone.achieved ? theme.accent : theme.textSecondary },
                ]}
              >
                {milestone.label}
              </ThemedText>
            </View>
          ))}
        </View>
      </View>

      {profile.personalMantra ? (
        <Card style={styles.mantraCard}>
          <ThemedText type="small" style={{ color: theme.textSecondary, marginBottom: Spacing.xs }}>
            Your Mantra
          </ThemedText>
          <ThemedText style={styles.mantraText}>"{profile.personalMantra}"</ThemedText>
        </Card>
      ) : null}

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>My Recovery</ThemedText>
        <SettingsItem
          icon="edit-3"
          label="Journal"
          onPress={() => navigation.navigate("Journal")}
        />
        <SettingsItem
          icon="award"
          label="Sobriety Chips"
          onPress={() => navigation.navigate("SobrietyChips")}
        />
        <SettingsItem
          icon="heart"
          label="Saved Reflections"
          onPress={() => navigation.navigate("SavedReflections")}
        />
        <SettingsItem
          icon="sun"
          label="Gratitude"
          onPress={() => navigation.navigate("Gratitude")}
        />
        <SettingsItem
          icon="zap"
          label="Streaks"
          onPress={() => navigation.navigate("Streaks")}
        />
        <SettingsItem
          icon="headphones"
          label="Audio Resources"
          onPress={() => navigation.navigate("AudioResources")}
        />
        <SettingsItem
          icon="map-pin"
          label="Find Meetings"
          onPress={() => navigation.navigate("MeetingFinder")}
        />
        <SettingsItem
          icon="book-open"
          label="Promises & Prayers"
          onPress={() => navigation.navigate("Prayers")}
        />
        <SettingsItem
          icon="list"
          label="4th Step Inventory"
          onPress={() => navigation.navigate("FourthStep")}
        />
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>Appearance</ThemedText>
        <View style={styles.appearanceRow}>
          <AppearanceOption
            mode="light"
            label="Light"
            currentMode={themeMode}
            onSelect={setThemeMode}
          />
          <AppearanceOption
            mode="dark"
            label="Dark"
            currentMode={themeMode}
            onSelect={setThemeMode}
          />
          <AppearanceOption
            mode="system"
            label="System"
            currentMode={themeMode}
            onSelect={setThemeMode}
          />
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>Settings</ThemedText>
        <SettingsItem
          icon="bell"
          label="Notifications"
          onPress={() => navigation.navigate("NotificationSettings")}
        />
        <SettingsItem
          icon="lock"
          label="Privacy Policy"
          onPress={() => {
            const baseUrl = getApiUrl().replace('/api', '');
            Linking.openURL(`${baseUrl}/privacy`);
          }}
        />
        <SettingsItem
          icon="help-circle"
          label="Help & Support"
          onPress={() => {
            Linking.openURL('mailto:Mattjmarek@gmail.com?subject=Serenity%20Path%20-%20Help%20%26%20Support');
          }}
        />
        <SettingsItem
          icon="heart"
          label="Support Us"
          onPress={() => navigation.navigate("SupportUs")}
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

      <ThemedText type="small" style={[styles.disclaimer, { color: theme.textSecondary }]}>
        This app is not affiliated with Alcoholics Anonymous World Services, Inc. and does not replace professional medical advice.
      </ThemedText>

      {user ? (
        <View style={[styles.accountInfo, { borderColor: theme.border }]}>
          <Feather name={user.provider === "apple" ? "smartphone" : "mail"} size={14} color={theme.textSecondary} />
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            Signed in{user.provider !== "guest" ? ` with ${user.provider === "apple" ? "Apple" : "Google"}` : " as guest"}
          </ThemedText>
        </View>
      ) : null}
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
    marginBottom: Spacing.xs,
  },
  editButton: {
    paddingVertical: Spacing.sm,
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
  mantraCard: {
    marginBottom: Spacing.xl,
    alignItems: "center",
  },
  mantraText: {
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 22,
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
  disclaimer: {
    textAlign: "center",
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    lineHeight: 18,
  },
  appearanceRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  appearanceOption: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: "center",
  },
  appearanceLabel: {
    fontWeight: "600",
    fontSize: 14,
  },
  accountInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
});
