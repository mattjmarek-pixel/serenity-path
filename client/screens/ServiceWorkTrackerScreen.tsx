import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Alert,
  FlatList,
  Modal,
  TextInput,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import {
  useServiceWork,
  ServiceEntry,
  ServiceType,
  SERVICE_TYPES,
} from "@/hooks/useServiceWork";

const SERVICE_ICONS: Record<ServiceType, string> = {
  "Chaired a meeting": "mic",
  "Called a newcomer": "phone",
  "Sponsored someone": "users",
  "Coffee/setup": "coffee",
  "General service": "heart",
  Other: "star",
};

function formatDateDisplay(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function dateFromString(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function dateToString(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

interface EntryCardProps {
  entry: ServiceEntry;
  onDelete: (id: string) => void;
}

function EntryCard({ entry, onDelete }: EntryCardProps) {
  const { theme } = useTheme();
  const icon = SERVICE_ICONS[entry.type] ?? "star";

  const handleLongPress = () => {
    Alert.alert("Delete Entry", "Remove this service entry?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => onDelete(entry.id),
      },
    ]);
  };

  return (
    <Card style={styles.entryCard}>
      <Pressable
        onLongPress={handleLongPress}
        delayLongPress={400}
        style={({ pressed }) => [styles.entryPressable, { opacity: pressed ? 0.7 : 1 }]}
      >
        <View style={[styles.entryIcon, { backgroundColor: theme.primary + "15" }]}>
          <Feather name={icon as any} size={20} color={theme.primary} />
        </View>
        <View style={styles.entryBody}>
          <ThemedText style={styles.entryType}>{entry.type}</ThemedText>
          {entry.notes ? (
            <ThemedText
              style={[styles.entryNotes, { color: theme.textSecondary }]}
              numberOfLines={2}
            >
              {entry.notes}
            </ThemedText>
          ) : null}
          <ThemedText style={[styles.entryDate, { color: theme.textSecondary }]}>
            {formatDateDisplay(entry.date)}
          </ThemedText>
        </View>
        <Pressable
          onPress={handleLongPress}
          hitSlop={12}
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
        >
          <Feather name="trash-2" size={16} color={theme.textSecondary} />
        </Pressable>
      </Pressable>
    </Card>
  );
}

interface AddEntryModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (type: ServiceType, notes: string, date: string) => void;
  todayString: string;
}

function AddEntryModal({ visible, onClose, onSave, todayString }: AddEntryModalProps) {
  const { theme } = useTheme();
  const [selectedType, setSelectedType] = useState<ServiceType>("Chaired a meeting");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState<Date>(dateFromString(todayString));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const reset = () => {
    setSelectedType("Chaired a meeting");
    setNotes("");
    setDate(dateFromString(todayString));
    setShowDatePicker(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSave = () => {
    onSave(selectedType, notes, dateToString(date));
    reset();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={[styles.modalContainer, { backgroundColor: theme.backgroundDefault }]}>
        <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
          <Pressable
            onPress={handleClose}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <ThemedText style={{ color: theme.textSecondary }}>Cancel</ThemedText>
          </Pressable>
          <ThemedText type="h4">Log Service</ThemedText>
          <Pressable
            onPress={handleSave}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <ThemedText style={{ color: theme.primary, fontWeight: "700" }}>Save</ThemedText>
          </Pressable>
        </View>

        <View style={styles.modalBody}>
          <ThemedText style={[styles.fieldLabel, { color: theme.textSecondary }]}>
            Type of Service
          </ThemedText>
          <View style={styles.typeGrid}>
            {SERVICE_TYPES.map((t) => {
              const isSelected = t === selectedType;
              const icon = SERVICE_ICONS[t] ?? "star";
              return (
                <Pressable
                  key={t}
                  onPress={() => setSelectedType(t)}
                  style={[
                    styles.typeChip,
                    {
                      backgroundColor: isSelected ? theme.primary : theme.backgroundSecondary,
                      borderColor: isSelected ? theme.primary : theme.border,
                    },
                  ]}
                >
                  <Feather
                    name={icon as any}
                    size={14}
                    color={isSelected ? "#FFFFFF" : theme.text}
                  />
                  <ThemedText
                    style={[styles.typeChipText, { color: isSelected ? "#FFFFFF" : theme.text }]}
                    numberOfLines={2}
                  >
                    {t}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>

          <ThemedText style={[styles.fieldLabel, { color: theme.textSecondary }]}>
            Notes (optional)
          </ThemedText>
          <TextInput
            style={[
              styles.notesInput,
              {
                backgroundColor: theme.backgroundSecondary,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            placeholder="Add a note about this service..."
            placeholderTextColor={theme.textSecondary}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            maxLength={400}
          />

          <ThemedText style={[styles.fieldLabel, { color: theme.textSecondary }]}>
            Date
          </ThemedText>
          {Platform.OS === "ios" ? (
            <DateTimePicker
              value={date}
              mode="date"
              display="inline"
              maximumDate={new Date()}
              onChange={(_, d) => {
                if (d) setDate(d);
              }}
              style={{ alignSelf: "flex-start" }}
            />
          ) : (
            <>
              <Pressable
                onPress={() => setShowDatePicker(true)}
                style={[
                  styles.dateButton,
                  { backgroundColor: theme.backgroundSecondary, borderColor: theme.border },
                ]}
              >
                <Feather name="calendar" size={16} color={theme.primary} />
                <ThemedText style={{ color: theme.text }}>{formatDateDisplay(dateToString(date))}</ThemedText>
              </Pressable>
              {showDatePicker ? (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  maximumDate={new Date()}
                  onChange={(_, d) => {
                    setShowDatePicker(false);
                    if (d) setDate(d);
                  }}
                />
              ) : null}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

export default function ServiceWorkTrackerScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { entries, isLoading, addEntry, deleteEntry, load, thisMonthCount, allTimeCount, getTodayString } =
    useServiceWork();
  const [showModal, setShowModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteEntry(id);
    },
    [deleteEntry]
  );

  const renderItem = ({ item }: { item: ServiceEntry }) => (
    <EntryCard entry={item} onDelete={handleDelete} />
  );

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <Card style={styles.emptyCard}>
        <Feather name="heart" size={40} color={theme.primary + "60"} />
        <ThemedText type="h4" style={styles.emptyTitle}>
          No service logged yet
        </ThemedText>
        <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>
          Step 12 is about carrying the message. Log your first act of service to start your
          record.
        </ThemedText>
      </Card>
    );
  };

  const renderHeader = () => (
    <View>
      <View style={styles.summaryRow}>
        <Card style={[styles.summaryCard, { flex: 1 }]}>
          <ThemedText style={[styles.summaryNumber, { color: theme.primary }]}>
            {thisMonthCount}
          </ThemedText>
          <ThemedText style={[styles.summaryLabel, { color: theme.textSecondary }]}>
            This Month
          </ThemedText>
        </Card>
        <Card style={[styles.summaryCard, { flex: 1 }]}>
          <ThemedText style={[styles.summaryNumber, { color: theme.accent }]}>
            {allTimeCount}
          </ThemedText>
          <ThemedText style={[styles.summaryLabel, { color: theme.textSecondary }]}>
            All Time
          </ThemedText>
        </Card>
      </View>

      {entries.length > 0 ? (
        <ThemedText style={[styles.listHeading, { color: theme.textSecondary }]}>
          Service Log
        </ThemedText>
      ) : null}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={{
          paddingTop: headerHeight + Spacing.lg,
          paddingBottom: tabBarHeight + Spacing["2xl"],
          paddingHorizontal: Spacing.lg,
          flexGrow: 1,
        }}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
      />

      <Pressable
        onPress={() => setShowModal(true)}
        style={({ pressed }) => [
          styles.fab,
          {
            backgroundColor: theme.primary,
            bottom: tabBarHeight + Spacing.lg,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <Feather name="plus" size={22} color="#FFFFFF" />
        <ThemedText style={styles.fabText}>Log Service</ThemedText>
      </Pressable>

      <AddEntryModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSave={addEntry}
        todayString={getTodayString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summaryRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  summaryCard: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
  summaryNumber: {
    fontSize: 36,
    fontWeight: "700",
    lineHeight: 40,
  },
  summaryLabel: {
    fontSize: 13,
    marginTop: Spacing.xs,
  },
  listHeading: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: Spacing.md,
  },
  entryCard: {
    marginBottom: Spacing.sm,
  },
  entryPressable: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  entryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  entryBody: {
    flex: 1,
  },
  entryType: {
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 2,
  },
  entryNotes: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 2,
  },
  entryDate: {
    fontSize: 12,
  },
  emptyCard: {
    alignItems: "center",
    paddingVertical: Spacing["3xl"],
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  emptyTitle: {
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: Spacing.lg,
  },
  fab: {
    position: "absolute",
    right: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.full,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  fabText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    paddingTop: Spacing["2xl"],
  },
  modalBody: {
    padding: Spacing.lg,
    flex: 1,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
  },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  typeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    maxWidth: "48%",
  },
  typeChipText: {
    fontSize: 13,
    fontWeight: "500",
    flexShrink: 1,
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: "top",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
});
