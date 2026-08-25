import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Switch,
  Platform,
  Linking,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { useNotifications } from "@/hooks/useNotifications";
import { Spacing, BorderRadius } from "@/constants/theme";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 15, 30, 45];

interface ReminderCardProps {
  icon: string;
  title: string;
  description: string;
  enabled: boolean;
  hour: number;
  minute: number;
  onToggle: () => void;
  onTimeChange: (hour: number, minute: number) => void;
  formatTime: (hour: number, minute: number) => string;
}

function ReminderCard({
  icon,
  title,
  description,
  enabled,
  hour,
  minute,
  onToggle,
  onTimeChange,
  formatTime,
}: ReminderCardProps) {
  const { theme } = useTheme();
  const [showTimePicker, setShowTimePicker] = useState(false);

  return (
    <Card style={styles.reminderCard}>
      <View style={styles.reminderHeader}>
        <View
          style={[
            styles.reminderIcon,
            { backgroundColor: theme.primary + "15" },
          ]}
        >
          <Feather name={icon as any} size={20} color={theme.primary} />
        </View>
        <View style={styles.reminderInfo}>
          <ThemedText type="body" style={{ fontWeight: "600" }}>
            {title}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {description}
          </ThemedText>
        </View>
        <Switch
          value={enabled}
          onValueChange={onToggle}
          trackColor={{ false: theme.border, true: theme.primary + "60" }}
          thumbColor={enabled ? theme.primary : theme.textSecondary}
        />
      </View>
      {enabled ? (
        <Pressable
          onPress={() => setShowTimePicker(true)}
          style={[
            styles.timeButton,
            { backgroundColor: theme.backgroundSecondary },
          ]}
        >
          <Feather name="clock" size={16} color={theme.primary} />
          <ThemedText style={{ color: theme.primary, fontWeight: "500" }}>
            {formatTime(hour, minute)}
          </ThemedText>
          <Feather name="chevron-right" size={16} color={theme.textSecondary} />
        </Pressable>
      ) : null}

      <Modal
        visible={showTimePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTimePicker(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowTimePicker(false)}
        >
          <Pressable
            style={[
              styles.modalContent,
              { backgroundColor: theme.backgroundDefault },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <ThemedText
              type="h4"
              style={{ marginBottom: Spacing.lg, textAlign: "center" }}
            >
              Set Reminder Time
            </ThemedText>
            <View style={styles.timePickerRow}>
              <View style={styles.timeColumn}>
                <ThemedText
                  type="small"
                  style={{
                    color: theme.textSecondary,
                    marginBottom: Spacing.sm,
                  }}
                >
                  Hour
                </ThemedText>
                <View style={styles.timeOptions}>
                  {HOURS.map((h) => {
                    const period = h >= 12 ? "PM" : "AM";
                    const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
                    return (
                      <Pressable
                        key={h}
                        onPress={() => onTimeChange(h, minute)}
                        style={[
                          styles.timeOption,
                          {
                            backgroundColor:
                              h === hour
                                ? theme.primary
                                : theme.backgroundSecondary,
                          },
                        ]}
                      >
                        <ThemedText
                          type="small"
                          style={{
                            color: h === hour ? "#FFFFFF" : theme.text,
                            fontWeight: h === hour ? "600" : "400",
                          }}
                        >
                          {displayH} {period}
                        </ThemedText>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
              <View style={styles.timeColumn}>
                <ThemedText
                  type="small"
                  style={{
                    color: theme.textSecondary,
                    marginBottom: Spacing.sm,
                  }}
                >
                  Minute
                </ThemedText>
                <View style={styles.timeOptions}>
                  {MINUTES.map((m) => (
                    <Pressable
                      key={m}
                      onPress={() => onTimeChange(hour, m)}
                      style={[
                        styles.timeOption,
                        {
                          backgroundColor:
                            m === minute
                              ? theme.primary
                              : theme.backgroundSecondary,
                        },
                      ]}
                    >
                      <ThemedText
                        type="small"
                        style={{
                          color: m === minute ? "#FFFFFF" : theme.text,
                          fontWeight: m === minute ? "600" : "400",
                        }}
                      >
                        :{m.toString().padStart(2, "0")}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
            <Pressable
              onPress={() => setShowTimePicker(false)}
              style={[styles.doneButton, { backgroundColor: theme.primary }]}
            >
              <ThemedText style={{ color: "#FFFFFF", fontWeight: "600" }}>
                Done
              </ThemedText>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </Card>
  );
}

export default function NotificationSettingsScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const {
    prefs,
    permissionStatus,
    canAskAgain,
    toggleReminder,
    updateTime,
    formatTime,
    requestPermission,
  } = useNotifications();

  const isWeb = Platform.OS === "web";
  const isDeniedPermanently = permissionStatus === "denied" && !canAskAgain;

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <View
        style={[
          styles.content,
          {
            paddingTop: Spacing.xl,
            paddingBottom: insets.bottom + Spacing.xl,
            paddingHorizontal: Spacing.lg,
          },
        ]}
      >
        {isWeb ? (
          <Card style={styles.webNotice}>
            <Feather name="smartphone" size={32} color={theme.primary} />
            <ThemedText
              type="h4"
              style={{ marginTop: Spacing.md, textAlign: "center" }}
            >
              Notifications on Mobile
            </ThemedText>
            <ThemedText
              style={{
                color: theme.textSecondary,
                textAlign: "center",
                lineHeight: 22,
                marginTop: Spacing.sm,
              }}
            >
              Push notifications are available when using Serenity Path on your
              mobile device. Open the app in Expo Go to configure daily
              reminders.
            </ThemedText>
          </Card>
        ) : isDeniedPermanently ? (
          <Card style={styles.permissionCard}>
            <Feather name="bell-off" size={32} color={theme.textSecondary} />
            <ThemedText
              type="h4"
              style={{ marginTop: Spacing.md, textAlign: "center" }}
            >
              Notifications Disabled
            </ThemedText>
            <ThemedText
              style={{
                color: theme.textSecondary,
                textAlign: "center",
                lineHeight: 22,
                marginTop: Spacing.sm,
              }}
            >
              To receive daily reminders, please enable notifications in your
              device settings.
            </ThemedText>
            {Platform.OS !== "web" ? (
              <Pressable
                onPress={async () => {
                  try {
                    await Linking.openSettings();
                  } catch (e) {}
                }}
                style={[
                  styles.settingsButton,
                  { backgroundColor: theme.primary },
                ]}
              >
                <ThemedText style={{ color: "#FFFFFF", fontWeight: "600" }}>
                  Open Settings
                </ThemedText>
              </Pressable>
            ) : null}
          </Card>
        ) : permissionStatus === "denied" && canAskAgain ? (
          <Card style={styles.permissionCard}>
            <Feather name="bell" size={32} color={theme.primary} />
            <ThemedText
              type="h4"
              style={{ marginTop: Spacing.md, textAlign: "center" }}
            >
              Enable Notifications
            </ThemedText>
            <ThemedText
              style={{
                color: theme.textSecondary,
                textAlign: "center",
                lineHeight: 22,
                marginTop: Spacing.sm,
              }}
            >
              Allow notifications to receive daily reminders for reflections,
              check-ins, and gratitude practice.
            </ThemedText>
            <Pressable
              onPress={requestPermission}
              style={[
                styles.settingsButton,
                { backgroundColor: theme.primary },
              ]}
            >
              <ThemedText style={{ color: "#FFFFFF", fontWeight: "600" }}>
                Enable Notifications
              </ThemedText>
            </Pressable>
          </Card>
        ) : (
          <>
            <ThemedText
              type="small"
              style={[styles.sectionLabel, { color: theme.textSecondary }]}
            >
              Set daily reminders to support your recovery practice
            </ThemedText>

            <ReminderCard
              icon="book-open"
              title="Daily Reflection"
              description="Morning reminder to read today's reflection"
              enabled={prefs.reflectionEnabled}
              hour={prefs.reflectionHour}
              minute={prefs.reflectionMinute}
              onToggle={() => toggleReminder("reflection")}
              onTimeChange={(h, m) => updateTime("reflection", h, m)}
              formatTime={formatTime}
            />

            <ReminderCard
              icon="smile"
              title="Daily Check-In"
              description="Reminder to check in with how you're feeling"
              enabled={prefs.checkInEnabled}
              hour={prefs.checkInHour}
              minute={prefs.checkInMinute}
              onToggle={() => toggleReminder("checkIn")}
              onTimeChange={(h, m) => updateTime("checkIn", h, m)}
              formatTime={formatTime}
            />

            <ReminderCard
              icon="sun"
              title="Gratitude Practice"
              description="Evening reminder for your gratitude practice"
              enabled={prefs.gratitudeEnabled}
              hour={prefs.gratitudeHour}
              minute={prefs.gratitudeMinute}
              onToggle={() => toggleReminder("gratitude")}
              onTimeChange={(h, m) => updateTime("gratitude", h, m)}
              formatTime={formatTime}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  sectionLabel: {
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  reminderCard: {
    marginBottom: Spacing.md,
  },
  reminderHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  reminderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  reminderInfo: {
    flex: 1,
    gap: 2,
  },
  timeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  webNotice: {
    alignItems: "center",
    padding: Spacing["2xl"],
  },
  permissionCard: {
    alignItems: "center",
    padding: Spacing["2xl"],
  },
  settingsButton: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  modalContent: {
    width: "100%",
    maxWidth: 360,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
  },
  timePickerRow: {
    flexDirection: "row",
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  timeColumn: {
    flex: 1,
  },
  timeOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
  },
  timeOption: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.xs,
    minWidth: 52,
    alignItems: "center",
  },
  doneButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
});
