import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, TextInput, Switch, Platform } from "react-native";
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

  const handleSave = async () => {
    if (!formData.name.trim()) return;
    
    setIsSaving(true);
    const success = await saveProfile(formData);
    setIsSaving(false);
    
    if (success) {
      navigation.goBack();
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

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.backgroundRoot }]}>
        <ThemedText>Loading...</ThemedText>
      </View>
    );
  }

  return (
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
});
