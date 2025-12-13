import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, Image, Alert, Modal, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { useThemeContext, ThemeMode } from "@/contexts/ThemeContext";
import { Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

const USER_NAME_KEY = "@serenity_path_user_name";

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
  const { theme, isDark } = useTheme();
  const { themeMode, setThemeMode } = useThemeContext();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [userName, setUserName] = useState("Recovery Warrior");
  const [sobrietyDate] = useState("October 23, 2025");
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [editNameInput, setEditNameInput] = useState("");

  useEffect(() => {
    loadUserName();
  }, []);

  const loadUserName = async () => {
    try {
      const storedName = await AsyncStorage.getItem(USER_NAME_KEY);
      if (storedName) {
        setUserName(storedName);
      }
    } catch (error) {
      console.log("Error loading user name:", error);
    }
  };

  const handleEditProfile = () => {
    setEditNameInput(userName);
    setShowEditNameModal(true);
  };

  const handleSaveName = async () => {
    if (editNameInput.trim()) {
      try {
        await AsyncStorage.setItem(USER_NAME_KEY, editNameInput.trim());
        setUserName(editNameInput.trim());
        setShowEditNameModal(false);
      } catch (error) {
        console.log("Error saving user name:", error);
      }
    }
  };

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
        <View style={[styles.avatar, { backgroundColor: theme.accent + "30" }]}>
          <Feather name="user" size={40} color={theme.primary} />
        </View>
        <ThemedText type="h3" style={styles.userName}>{userName}</ThemedText>
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
            <ThemedText type="h4">{sobrietyDate}</ThemedText>
          </View>
          <Pressable style={({ pressed }) => [styles.editDateButton, { opacity: pressed ? 0.7 : 1 }]}>
            <Feather name="edit-2" size={16} color={theme.primary} />
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

      <Modal visible={showEditNameModal} transparent animationType="fade">
        <BlurView intensity={80} tint={isDark ? "dark" : "light"} style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: theme.backgroundDefault }]}>
            <ThemedText type="h3" style={styles.modalTitle}>Edit Your Name</ThemedText>
            <ThemedText style={[styles.modalSubtitle, { color: theme.textSecondary }]}>
              This name will be used in your daily greeting.
            </ThemedText>
            <TextInput
              style={[
                styles.nameInput,
                { backgroundColor: theme.backgroundSecondary, color: theme.text },
              ]}
              placeholder="Enter your name"
              placeholderTextColor={theme.textSecondary}
              value={editNameInput}
              onChangeText={setEditNameInput}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <Pressable
                onPress={() => setShowEditNameModal(false)}
                style={({ pressed }) => [
                  styles.modalButton,
                  { backgroundColor: theme.backgroundSecondary, opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <ThemedText style={{ fontWeight: "600" }}>Cancel</ThemedText>
              </Pressable>
              <Pressable
                onPress={handleSaveName}
                disabled={!editNameInput.trim()}
                style={({ pressed }) => [
                  styles.modalButton,
                  {
                    backgroundColor: editNameInput.trim() ? theme.primary : theme.backgroundSecondary,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <ThemedText style={[styles.saveButtonText, { color: editNameInput.trim() ? "#FFFFFF" : theme.textSecondary }]}>
                  Save
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </BlurView>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 340,
    borderRadius: BorderRadius["2xl"],
    padding: Spacing["2xl"],
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  modalSubtitle: {
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  nameInput: {
    width: "100%",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    fontSize: 16,
    marginBottom: Spacing.lg,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
  },
  saveButtonText: {
    fontWeight: "600",
  },
});
