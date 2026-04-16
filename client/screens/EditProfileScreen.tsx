import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  TextInput,
  Switch,
  Platform,
  Modal,
  Linking,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { useProfile, UserProfile } from "@/hooks/useProfile";
import { Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

const MEETING_TYPES = [
  { id: "open", label: "Open" },
  { id: "closed", label: "Closed" },
  { id: "speaker", label: "Speaker" },
  { id: "discussion", label: "Discussion" },
  { id: "bigbook", label: "Big Book" },
  { id: "step", label: "Step Study" },
];

const AA_HELPLINE = "18004574673";

function makeCall(number: string) {
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
}

interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "phone-pad" | "numeric";
  multiline?: boolean;
}

function FormInput({ label, value, onChangeText, placeholder, keyboardType = "default", multiline = false }: FormInputProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.inputGroup}>
      <ThemedText type="small" style={[styles.inputLabel, { color: theme.textSecondary }]}>
        {label}
      </ThemedText>
      <TextInput
        style={[
          styles.textInput,
          multiline && styles.multilineInput,
          {
            backgroundColor: theme.backgroundSecondary,
            color: theme.text,
            borderColor: theme.border,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
    </View>
  );
}

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

function Chip({ label, selected, onPress }: ChipProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? theme.primary : theme.backgroundSecondary,
          borderColor: selected ? theme.primary : theme.border,
        },
      ]}
    >
      <ThemedText
        style={[
          styles.chipText,
          { color: selected ? "#FFFFFF" : theme.text },
        ]}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

interface CompassionModalProps {
  visible: boolean;
  sponsorName: string;
  sponsorPhone: string;
  onDismiss: () => void;
  onFindMeeting: () => void;
  onReadPromises: () => void;
}

function CompassionModal({
  visible,
  sponsorName,
  sponsorPhone,
  onDismiss,
  onFindMeeting,
  onReadPromises,
}: CompassionModalProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const handleCallSponsor = () => {
    const cleanPhone = sponsorPhone.replace(/\D/g, "");
    makeCall(cleanPhone.length > 0 ? cleanPhone : AA_HELPLINE);
  };

  const hasSponsor = sponsorPhone.trim().length > 0;
  const callLabel = hasSponsor
    ? `Call ${sponsorName.trim() || "My Sponsor"}`
    : "Call AA Helpline";

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <View
        style={[
          styles.modalOverlay,
          { backgroundColor: theme.backgroundDefault },
        ]}
      >
        <View
          style={[
            styles.modalContent,
            {
              paddingTop: insets.top + Spacing["3xl"],
              paddingBottom: insets.bottom + Spacing.xl,
            },
          ]}
        >
          <View style={[styles.modalIconCircle, { backgroundColor: theme.primary + "18" }]}>
            <Feather name="heart" size={32} color={theme.primary} />
          </View>

          <ThemedText type="h3" style={[styles.modalHeading, { color: theme.text }]}>
            You came back.
          </ThemedText>

          <ThemedText style={[styles.modalBody, { color: theme.textSecondary }]}>
            Coming back is the most courageous thing you can do. Relapse is part of many people's
            recovery journey — it does not erase the strength you've already shown. You are still here,
            and that matters.
          </ThemedText>

          <ThemedText style={[styles.modalBodySmall, { color: theme.textSecondary }]}>
            Whatever you need right now, this community and your tools are here for you.
          </ThemedText>

          <View style={styles.modalActions}>
            <Pressable
              onPress={handleCallSponsor}
              style={({ pressed }) => [
                styles.modalActionButton,
                { backgroundColor: theme.primary, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Feather name="phone" size={18} color="#FFFFFF" />
              <ThemedText style={styles.modalActionText}>{callLabel}</ThemedText>
            </Pressable>

            <Pressable
              onPress={onFindMeeting}
              style={({ pressed }) => [
                styles.modalActionButton,
                {
                  backgroundColor: theme.accent + "18",
                  borderWidth: 1,
                  borderColor: theme.accent,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Feather name="map-pin" size={18} color={theme.accent} />
              <ThemedText style={[styles.modalActionText, { color: theme.accent }]}>
                Find a Meeting
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={onReadPromises}
              style={({ pressed }) => [
                styles.modalActionButton,
                {
                  backgroundColor: theme.secondary + "18",
                  borderWidth: 1,
                  borderColor: theme.secondary,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Feather name="book-open" size={18} color={theme.secondary} />
              <ThemedText style={[styles.modalActionText, { color: theme.secondary }]}>
                Read the Promises
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={onDismiss}
              style={({ pressed }) => [styles.modalDismiss, { opacity: pressed ? 0.6 : 1 }]}
            >
              <ThemedText style={[styles.modalDismissText, { color: theme.textSecondary }]}>
                I'm okay, continue
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { profile, saveProfile, isLoading } = useProfile();

  const [formData, setFormData] = useState<UserProfile>({
    name: "",
    pronouns: "",
    sobrietyDate: null,
    homeCity: "",
    preferredMeetingTypes: [],
    defaultRadius: 10,
    reminderEnabled: false,
    reminderTime: "08:00",
    sponsorName: "",
    sponsorPhone: "",
    emergencyContact: "",
    emergencyPhone: "",
    personalMantra: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showCompassionModal, setShowCompassionModal] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setFormData(profile);
    }
  }, [profile, isLoading]);

  const updateField = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleMeetingType = (typeId: string) => {
    const current = formData.preferredMeetingTypes;
    if (current.includes(typeId)) {
      updateField("preferredMeetingTypes", current.filter(t => t !== typeId));
    } else {
      updateField("preferredMeetingTypes", [...current, typeId]);
    }
  };

  const isRelapse = (oldDate: string | null, newDate: string | null): boolean => {
    if (!oldDate || !newDate) return false;
    return new Date(newDate).getTime() > new Date(oldDate).getTime();
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return;

    const previousDate = profile.sobrietyDate;
    const newDate = formData.sobrietyDate;

    setIsSaving(true);
    const success = await saveProfile(formData);
    setIsSaving(false);

    if (success) {
      if (isRelapse(previousDate, newDate)) {
        setShowCompassionModal(true);
      } else {
        navigation.goBack();
      }
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      updateField("sobrietyDate", selectedDate.toISOString());
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selectedTime) {
      const hours = String(selectedTime.getHours()).padStart(2, "0");
      const minutes = String(selectedTime.getMinutes()).padStart(2, "0");
      updateField("reminderTime", `${hours}:${minutes}`);
    }
  };

  const formatSobrietyDate = () => {
    if (!formData.sobrietyDate) return "Tap to set";
    return new Date(formData.sobrietyDate).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatReminderTime = () => {
    const [hours, minutes] = formData.reminderTime.split(":");
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const handleModalDismiss = () => {
    setShowCompassionModal(false);
    navigation.goBack();
  };

  const handleModalFindMeeting = () => {
    setShowCompassionModal(false);
    navigation.navigate("MeetingFinder");
  };

  const handleModalReadPromises = () => {
    setShowCompassionModal(false);
    navigation.navigate("Prayers");
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.backgroundRoot }]}>
        <ThemedText>Loading...</ThemedText>
      </View>
    );
  }

  return (
    <>
      <KeyboardAwareScrollViewCompat
        style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
        contentContainerStyle={{
          paddingTop: headerHeight + Spacing.lg,
          paddingBottom: insets.bottom + Spacing.xl + 80,
          paddingHorizontal: Spacing.lg,
        }}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
      >
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="user" size={20} color={theme.primary} />
            <ThemedText type="h4">Identity</ThemedText>
          </View>
          <FormInput
            label="Preferred Name"
            value={formData.name}
            onChangeText={(text) => updateField("name", text)}
            placeholder="What should we call you?"
          />
          <FormInput
            label="Pronouns (optional)"
            value={formData.pronouns}
            onChangeText={(text) => updateField("pronouns", text)}
            placeholder="e.g., he/him, she/her, they/them"
          />
        </Card>

        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="calendar" size={20} color={theme.primary} />
            <ThemedText type="h4">Recovery Timeline</ThemedText>
          </View>
          <View style={styles.inputGroup}>
            <ThemedText type="small" style={[styles.inputLabel, { color: theme.textSecondary }]}>
              Sobriety Start Date
            </ThemedText>
            <Pressable
              onPress={() => setShowDatePicker(true)}
              style={[
                styles.dateButton,
                { backgroundColor: theme.backgroundSecondary, borderColor: theme.border },
              ]}
            >
              <ThemedText style={!formData.sobrietyDate ? { color: theme.textSecondary } : undefined}>
                {formatSobrietyDate()}
              </ThemedText>
              <Feather name="calendar" size={18} color={theme.primary} />
            </Pressable>
          </View>
          {showDatePicker ? (
            <DateTimePicker
              value={formData.sobrietyDate ? new Date(formData.sobrietyDate) : new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          ) : null}
        </Card>

        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="map-pin" size={20} color={theme.primary} />
            <ThemedText type="h4">Meeting Preferences</ThemedText>
          </View>
          <FormInput
            label="Home City or ZIP"
            value={formData.homeCity}
            onChangeText={(text) => updateField("homeCity", text)}
            placeholder="For finding nearby meetings"
          />
          <View style={styles.inputGroup}>
            <ThemedText type="small" style={[styles.inputLabel, { color: theme.textSecondary }]}>
              Preferred Meeting Types
            </ThemedText>
            <View style={styles.chipsContainer}>
              {MEETING_TYPES.map((type) => (
                <Chip
                  key={type.id}
                  label={type.label}
                  selected={formData.preferredMeetingTypes.includes(type.id)}
                  onPress={() => toggleMeetingType(type.id)}
                />
              ))}
            </View>
          </View>
          <View style={styles.inputGroup}>
            <ThemedText type="small" style={[styles.inputLabel, { color: theme.textSecondary }]}>
              Default Search Radius: {formData.defaultRadius} miles
            </ThemedText>
            <View style={styles.radiusRow}>
              {[5, 10, 25, 50].map((radius) => (
                <Pressable
                  key={radius}
                  onPress={() => updateField("defaultRadius", radius)}
                  style={[
                    styles.radiusOption,
                    {
                      backgroundColor: formData.defaultRadius === radius ? theme.primary : theme.backgroundSecondary,
                      borderColor: formData.defaultRadius === radius ? theme.primary : theme.border,
                    },
                  ]}
                >
                  <ThemedText
                    style={{
                      color: formData.defaultRadius === radius ? "#FFFFFF" : theme.text,
                      fontWeight: "600",
                    }}
                  >
                    {radius}mi
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
        </Card>

        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="bell" size={20} color={theme.primary} />
            <ThemedText type="h4">Daily Reminder</ThemedText>
          </View>
          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <ThemedText>Daily Reflection Reminder</ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Get a gentle nudge for your daily reflection
              </ThemedText>
            </View>
            <Switch
              value={formData.reminderEnabled}
              onValueChange={(value) => updateField("reminderEnabled", value)}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
          {formData.reminderEnabled ? (
            <View style={styles.inputGroup}>
              <ThemedText type="small" style={[styles.inputLabel, { color: theme.textSecondary }]}>
                Reminder Time
              </ThemedText>
              <Pressable
                onPress={() => setShowTimePicker(true)}
                style={[
                  styles.dateButton,
                  { backgroundColor: theme.backgroundSecondary, borderColor: theme.border },
                ]}
              >
                <ThemedText>{formatReminderTime()}</ThemedText>
                <Feather name="clock" size={18} color={theme.primary} />
              </Pressable>
            </View>
          ) : null}
          {showTimePicker ? (
            <DateTimePicker
              value={(() => {
                const [hours, minutes] = formData.reminderTime.split(":");
                const date = new Date();
                date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
                return date;
              })()}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleTimeChange}
            />
          ) : null}
        </Card>

        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="users" size={20} color={theme.primary} />
            <ThemedText type="h4">Support Network</ThemedText>
          </View>
          <FormInput
            label="Sponsor Name"
            value={formData.sponsorName}
            onChangeText={(text) => updateField("sponsorName", text)}
            placeholder="Your sponsor's name"
          />
          <FormInput
            label="Sponsor Phone"
            value={formData.sponsorPhone}
            onChangeText={(text) => updateField("sponsorPhone", text)}
            placeholder="Sponsor's phone number"
            keyboardType="phone-pad"
          />
          <View style={styles.divider} />
          <FormInput
            label="Emergency Contact Name"
            value={formData.emergencyContact}
            onChangeText={(text) => updateField("emergencyContact", text)}
            placeholder="Someone to call in a crisis"
          />
          <FormInput
            label="Emergency Contact Phone"
            value={formData.emergencyPhone}
            onChangeText={(text) => updateField("emergencyPhone", text)}
            placeholder="Their phone number"
            keyboardType="phone-pad"
          />
        </Card>

        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="heart" size={20} color={theme.primary} />
            <ThemedText type="h4">Personal Mantra</ThemedText>
          </View>
          <FormInput
            label="Your Recovery Mantra"
            value={formData.personalMantra}
            onChangeText={(text) => updateField("personalMantra", text)}
            placeholder="A phrase that keeps you grounded"
            multiline
          />
        </Card>

        <View style={[styles.saveButtonContainer, { paddingBottom: insets.bottom + Spacing.lg }]}>
          <Pressable
            onPress={handleSave}
            disabled={!formData.name.trim() || isSaving}
            style={({ pressed }) => [
              styles.saveButton,
              {
                backgroundColor: formData.name.trim() ? theme.primary : theme.backgroundSecondary,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <ThemedText
              style={[
                styles.saveButtonText,
                { color: formData.name.trim() ? "#FFFFFF" : theme.textSecondary },
              ]}
            >
              {isSaving ? "Saving..." : "Save Profile"}
            </ThemedText>
          </Pressable>
        </View>
      </KeyboardAwareScrollViewCompat>

      <CompassionModal
        visible={showCompassionModal}
        sponsorName={formData.sponsorName}
        sponsorPhone={formData.sponsorPhone}
        onDismiss={handleModalDismiss}
        onFindMeeting={handleModalFindMeeting}
        onReadPromises={handleModalReadPromises}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    marginBottom: Spacing.xs,
    fontWeight: "500",
  },
  textInput: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    fontSize: 16,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
  },
  radiusRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  radiusOption: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    alignItems: "center",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  switchLabel: {
    flex: 1,
    marginRight: Spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: Spacing.md,
  },
  saveButtonContainer: {
    marginTop: Spacing.lg,
  },
  saveButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  modalIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xl,
  },
  modalHeading: {
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  modalBody: {
    textAlign: "center",
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  modalBodySmall: {
    textAlign: "center",
    lineHeight: 22,
    fontSize: 14,
    marginBottom: Spacing["2xl"],
  },
  modalActions: {
    width: "100%",
    gap: Spacing.md,
  },
  modalActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  modalActionText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  modalDismiss: {
    alignItems: "center",
    paddingVertical: Spacing.lg,
    marginTop: Spacing.xs,
  },
  modalDismissText: {
    fontSize: 15,
  },
});
