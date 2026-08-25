import React, { useState, useCallback } from "react";
import { View, StyleSheet, Pressable, TextInput, Alert } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useTheme } from "@/hooks/useTheme";
import {
  useFourthStep,
  ResentmentEntry,
  FearEntry,
  HarmEntry,
} from "@/hooks/useFourthStep";
import { Spacing, BorderRadius } from "@/constants/theme";

type SectionTab = "resentments" | "fears" | "harms";

const INSTINCT_OPTIONS = [
  { key: "Self-Esteem", label: "Self-Esteem" },
  { key: "Security", label: "Security" },
  { key: "Personal Relations", label: "Personal Relations" },
  { key: "Ambitions", label: "Ambitions" },
  { key: "Sex/Romantic", label: "Sex/Romantic" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function FourthStepScreen() {
  const { theme } = useTheme();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const {
    data,
    addResentment,
    deleteResentment,
    addFear,
    deleteFear,
    addHarm,
    deleteHarm,
  } = useFourthStep();

  const [activeTab, setActiveTab] = useState<SectionTab>("resentments");
  const [showForm, setShowForm] = useState(false);

  // Resentment form state
  const [rWhoOrWhat, setRWhoOrWhat] = useState("");
  const [rCause, setRCause] = useState("");
  const [rInstincts, setRInstincts] = useState<string[]>([]);

  // Fear form state
  const [fFear, setFFear] = useState("");
  const [fEffect, setFEffect] = useState("");

  // Harm form state
  const [hWhom, setHWhom] = useState("");
  const [hWhat, setHWhat] = useState("");
  const [hHow, setHHow] = useState("");

  const resetForms = useCallback(() => {
    setRWhoOrWhat("");
    setRCause("");
    setRInstincts([]);
    setFFear("");
    setFEffect("");
    setHWhom("");
    setHWhat("");
    setHHow("");
    setShowForm(false);
  }, []);

  const handleTabChange = useCallback(
    (tab: SectionTab) => {
      setActiveTab(tab);
      setShowForm(false);
      resetForms();
    },
    [resetForms],
  );

  const toggleInstinct = useCallback((key: string) => {
    setRInstincts((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }, []);

  const showSaveError = useCallback(() => {
    Alert.alert(
      "Could not save",
      "There was a problem saving your entry. Please try again.",
    );
  }, []);

  const handleSaveResentment = useCallback(async () => {
    if (!rWhoOrWhat.trim()) return;
    const ok = await addResentment({
      whoOrWhat: rWhoOrWhat.trim(),
      cause: rCause.trim(),
      affectedInstincts: rInstincts,
    });
    if (ok) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      resetForms();
    } else {
      showSaveError();
    }
  }, [
    rWhoOrWhat,
    rCause,
    rInstincts,
    addResentment,
    resetForms,
    showSaveError,
  ]);

  const handleSaveFear = useCallback(async () => {
    if (!fFear.trim()) return;
    const ok = await addFear({ fear: fFear.trim(), effect: fEffect.trim() });
    if (ok) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      resetForms();
    } else {
      showSaveError();
    }
  }, [fFear, fEffect, addFear, resetForms, showSaveError]);

  const handleSaveHarm = useCallback(async () => {
    if (!hWhom.trim()) return;
    const ok = await addHarm({
      whomHarmed: hWhom.trim(),
      whatDid: hWhat.trim(),
      howHarmed: hHow.trim(),
    });
    if (ok) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      resetForms();
    } else {
      showSaveError();
    }
  }, [hWhom, hWhat, hHow, addHarm, resetForms, showSaveError]);

  const confirmDelete = useCallback((label: string, onDelete: () => void) => {
    Alert.alert(
      "Delete Entry",
      `Remove this ${label} entry? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: onDelete },
      ],
    );
  }, []);

  const inputStyle = [
    styles.input,
    {
      backgroundColor: theme.backgroundSecondary,
      color: theme.text,
      borderColor: theme.border,
    },
  ];

  const labelStyle = [styles.fieldLabel, { color: theme.textSecondary }];

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: insets.bottom + Spacing["3xl"],
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      {/* Intro note */}
      <View
        style={[
          styles.introCard,
          {
            backgroundColor: theme.primary + "14",
            borderColor: theme.primary + "30",
          },
        ]}
      >
        <Feather name="lock" size={16} color={theme.primary} />
        <ThemedText
          type="small"
          style={[styles.introText, { color: theme.text }]}
        >
          This inventory is private and for your eyes only. Take it slowly —
          there is no rush. You are doing courageous work.
        </ThemedText>
      </View>

      {/* Section tabs */}
      <View
        style={[styles.tabBar, { backgroundColor: theme.backgroundSecondary }]}
      >
        {(
          [
            {
              key: "resentments",
              label: "Resentments",
              count: data.resentments.length,
            },
            { key: "fears", label: "Fears", count: data.fears.length },
            { key: "harms", label: "Harms Done", count: data.harms.length },
          ] as { key: SectionTab; label: string; count: number }[]
        ).map((tab) => (
          <Pressable
            key={tab.key}
            onPress={() => handleTabChange(tab.key)}
            style={[
              styles.tab,
              activeTab === tab.key && [
                styles.activeTab,
                { backgroundColor: theme.backgroundDefault },
              ],
            ]}
          >
            <ThemedText
              type="small"
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === tab.key ? theme.primary : theme.textSecondary,
                },
              ]}
            >
              {tab.label}
            </ThemedText>
            {tab.count > 0 ? (
              <View
                style={[styles.tabBadge, { backgroundColor: theme.primary }]}
              >
                <ThemedText style={styles.tabBadgeText}>{tab.count}</ThemedText>
              </View>
            ) : null}
          </Pressable>
        ))}
      </View>

      {/* ───── RESENTMENTS ───── */}
      {activeTab === "resentments" ? (
        <>
          <ThemedText
            type="small"
            style={[styles.sectionHint, { color: theme.textSecondary }]}
          >
            List people, institutions, or principles that you resent and the
            cause of that resentment.
          </ThemedText>

          {data.resentments.map((entry: ResentmentEntry) => (
            <Card key={entry.id} elevation={1} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <ThemedText type="h4" style={styles.entryTitle}>
                  {entry.whoOrWhat}
                </ThemedText>
                <Pressable
                  onPress={() =>
                    confirmDelete("resentment", () =>
                      deleteResentment(entry.id),
                    )
                  }
                  hitSlop={8}
                  style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
                >
                  <Feather
                    name="trash-2"
                    size={16}
                    color={theme.textSecondary}
                  />
                </Pressable>
              </View>
              {entry.cause ? (
                <ThemedText
                  type="small"
                  style={[styles.entryField, { color: theme.textSecondary }]}
                >
                  Cause: {entry.cause}
                </ThemedText>
              ) : null}
              {entry.affectedInstincts.length > 0 ? (
                <View style={styles.instinctTags}>
                  {entry.affectedInstincts.map((inst) => (
                    <View
                      key={inst}
                      style={[
                        styles.instinctTag,
                        { backgroundColor: theme.primary + "18" },
                      ]}
                    >
                      <ThemedText
                        style={[
                          styles.instinctTagText,
                          { color: theme.primary },
                        ]}
                      >
                        {inst}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              ) : null}
              <ThemedText
                type="small"
                style={[styles.entryDate, { color: theme.textSecondary }]}
              >
                {formatDate(entry.createdAt)}
              </ThemedText>
            </Card>
          ))}

          {showForm ? (
            <Card elevation={2} style={styles.formCard}>
              <ThemedText type="h4" style={styles.formTitle}>
                Add Resentment
              </ThemedText>

              <ThemedText style={labelStyle}>
                Who or what do you resent?
              </ThemedText>
              <TextInput
                style={inputStyle}
                placeholder="Person, institution, or principle"
                placeholderTextColor={theme.textSecondary}
                value={rWhoOrWhat}
                onChangeText={setRWhoOrWhat}
                returnKeyType="next"
              />

              <ThemedText style={labelStyle}>
                What did they do? What is the cause?
              </ThemedText>
              <TextInput
                style={[inputStyle, styles.multilineInput]}
                placeholder="Describe what happened..."
                placeholderTextColor={theme.textSecondary}
                multiline
                textAlignVertical="top"
                value={rCause}
                onChangeText={setRCause}
              />

              <ThemedText style={labelStyle}>
                Which instincts were affected?
              </ThemedText>
              <View style={styles.instinctGrid}>
                {INSTINCT_OPTIONS.map((opt) => {
                  const selected = rInstincts.includes(opt.key);
                  return (
                    <Pressable
                      key={opt.key}
                      onPress={() => toggleInstinct(opt.key)}
                      style={[
                        styles.instinctToggle,
                        {
                          backgroundColor: selected
                            ? theme.primary
                            : theme.backgroundSecondary,
                          borderColor: selected ? theme.primary : theme.border,
                        },
                      ]}
                    >
                      <ThemedText
                        type="small"
                        style={{
                          color: selected ? "#FFFFFF" : theme.text,
                          fontWeight: "600",
                        }}
                      >
                        {opt.label}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.formActions}>
                <Pressable
                  onPress={resetForms}
                  style={({ pressed }) => [
                    styles.cancelButton,
                    { borderColor: theme.border, opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <ThemedText style={{ color: theme.textSecondary }}>
                    Cancel
                  </ThemedText>
                </Pressable>
                <Pressable
                  onPress={handleSaveResentment}
                  style={({ pressed }) => [
                    styles.saveButton,
                    {
                      backgroundColor: rWhoOrWhat.trim()
                        ? theme.primary
                        : theme.border,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <ThemedText style={{ color: "#FFFFFF", fontWeight: "600" }}>
                    Save
                  </ThemedText>
                </Pressable>
              </View>
            </Card>
          ) : (
            <Pressable
              onPress={() => setShowForm(true)}
              style={({ pressed }) => [
                styles.addButton,
                { borderColor: theme.primary, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Feather name="plus" size={18} color={theme.primary} />
              <ThemedText
                style={[styles.addButtonText, { color: theme.primary }]}
              >
                Add Resentment
              </ThemedText>
            </Pressable>
          )}
        </>
      ) : null}

      {/* ───── FEARS ───── */}
      {activeTab === "fears" ? (
        <>
          <ThemedText
            type="small"
            style={[styles.sectionHint, { color: theme.textSecondary }]}
          >
            List what you are afraid of and how that fear has affected your
            life.
          </ThemedText>

          {data.fears.map((entry: FearEntry) => (
            <Card key={entry.id} elevation={1} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <ThemedText type="h4" style={styles.entryTitle}>
                  {entry.fear}
                </ThemedText>
                <Pressable
                  onPress={() =>
                    confirmDelete("fear", () => deleteFear(entry.id))
                  }
                  hitSlop={8}
                  style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
                >
                  <Feather
                    name="trash-2"
                    size={16}
                    color={theme.textSecondary}
                  />
                </Pressable>
              </View>
              {entry.effect ? (
                <ThemedText
                  type="small"
                  style={[styles.entryField, { color: theme.textSecondary }]}
                >
                  Effect: {entry.effect}
                </ThemedText>
              ) : null}
              <ThemedText
                type="small"
                style={[styles.entryDate, { color: theme.textSecondary }]}
              >
                {formatDate(entry.createdAt)}
              </ThemedText>
            </Card>
          ))}

          {showForm ? (
            <Card elevation={2} style={styles.formCard}>
              <ThemedText type="h4" style={styles.formTitle}>
                Add Fear
              </ThemedText>

              <ThemedText style={labelStyle}>What do you fear?</ThemedText>
              <TextInput
                style={inputStyle}
                placeholder="I am afraid of..."
                placeholderTextColor={theme.textSecondary}
                value={fFear}
                onChangeText={setFFear}
              />

              <ThemedText style={labelStyle}>
                How has this fear affected your life?
              </ThemedText>
              <TextInput
                style={[inputStyle, styles.multilineInput]}
                placeholder="It has caused me to..."
                placeholderTextColor={theme.textSecondary}
                multiline
                textAlignVertical="top"
                value={fEffect}
                onChangeText={setFEffect}
              />

              <View style={styles.formActions}>
                <Pressable
                  onPress={resetForms}
                  style={({ pressed }) => [
                    styles.cancelButton,
                    { borderColor: theme.border, opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <ThemedText style={{ color: theme.textSecondary }}>
                    Cancel
                  </ThemedText>
                </Pressable>
                <Pressable
                  onPress={handleSaveFear}
                  style={({ pressed }) => [
                    styles.saveButton,
                    {
                      backgroundColor: fFear.trim()
                        ? theme.primary
                        : theme.border,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <ThemedText style={{ color: "#FFFFFF", fontWeight: "600" }}>
                    Save
                  </ThemedText>
                </Pressable>
              </View>
            </Card>
          ) : (
            <Pressable
              onPress={() => setShowForm(true)}
              style={({ pressed }) => [
                styles.addButton,
                { borderColor: theme.primary, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Feather name="plus" size={18} color={theme.primary} />
              <ThemedText
                style={[styles.addButtonText, { color: theme.primary }]}
              >
                Add Fear
              </ThemedText>
            </Pressable>
          )}
        </>
      ) : null}

      {/* ───── HARMS DONE ───── */}
      {activeTab === "harms" ? (
        <>
          <ThemedText
            type="small"
            style={[styles.sectionHint, { color: theme.textSecondary }]}
          >
            List people you have harmed through your actions, what you did, and
            how they were affected.
          </ThemedText>

          {data.harms.map((entry: HarmEntry) => (
            <Card key={entry.id} elevation={1} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <ThemedText type="h4" style={styles.entryTitle}>
                  {entry.whomHarmed}
                </ThemedText>
                <Pressable
                  onPress={() =>
                    confirmDelete("harm", () => deleteHarm(entry.id))
                  }
                  hitSlop={8}
                  style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
                >
                  <Feather
                    name="trash-2"
                    size={16}
                    color={theme.textSecondary}
                  />
                </Pressable>
              </View>
              {entry.whatDid ? (
                <ThemedText
                  type="small"
                  style={[styles.entryField, { color: theme.textSecondary }]}
                >
                  What I did: {entry.whatDid}
                </ThemedText>
              ) : null}
              {entry.howHarmed ? (
                <ThemedText
                  type="small"
                  style={[styles.entryField, { color: theme.textSecondary }]}
                >
                  How harmed: {entry.howHarmed}
                </ThemedText>
              ) : null}
              <ThemedText
                type="small"
                style={[styles.entryDate, { color: theme.textSecondary }]}
              >
                {formatDate(entry.createdAt)}
              </ThemedText>
            </Card>
          ))}

          {showForm ? (
            <Card elevation={2} style={styles.formCard}>
              <ThemedText type="h4" style={styles.formTitle}>
                Add Harm Done
              </ThemedText>

              <ThemedText style={labelStyle}>Who did you harm?</ThemedText>
              <TextInput
                style={inputStyle}
                placeholder="Name or relationship..."
                placeholderTextColor={theme.textSecondary}
                value={hWhom}
                onChangeText={setHWhom}
              />

              <ThemedText style={labelStyle}>What did you do?</ThemedText>
              <TextInput
                style={[inputStyle, styles.multilineInput]}
                placeholder="Describe your actions..."
                placeholderTextColor={theme.textSecondary}
                multiline
                textAlignVertical="top"
                value={hWhat}
                onChangeText={setHWhat}
              />

              <ThemedText style={labelStyle}>How were they harmed?</ThemedText>
              <TextInput
                style={[inputStyle, styles.multilineInput]}
                placeholder="Emotionally, financially, physically..."
                placeholderTextColor={theme.textSecondary}
                multiline
                textAlignVertical="top"
                value={hHow}
                onChangeText={setHHow}
              />

              <View style={styles.formActions}>
                <Pressable
                  onPress={resetForms}
                  style={({ pressed }) => [
                    styles.cancelButton,
                    { borderColor: theme.border, opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <ThemedText style={{ color: theme.textSecondary }}>
                    Cancel
                  </ThemedText>
                </Pressable>
                <Pressable
                  onPress={handleSaveHarm}
                  style={({ pressed }) => [
                    styles.saveButton,
                    {
                      backgroundColor: hWhom.trim()
                        ? theme.primary
                        : theme.border,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <ThemedText style={{ color: "#FFFFFF", fontWeight: "600" }}>
                    Save
                  </ThemedText>
                </Pressable>
              </View>
            </Card>
          ) : (
            <Pressable
              onPress={() => setShowForm(true)}
              style={({ pressed }) => [
                styles.addButton,
                { borderColor: theme.primary, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Feather name="plus" size={18} color={theme.primary} />
              <ThemedText
                style={[styles.addButtonText, { color: theme.primary }]}
              >
                Add Harm Done
              </ThemedText>
            </Pressable>
          )}
        </>
      ) : null}
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  introCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.xl,
  },
  introText: {
    flex: 1,
    lineHeight: 20,
  },
  tabBar: {
    flexDirection: "row",
    borderRadius: BorderRadius.sm,
    padding: 4,
    marginBottom: Spacing.lg,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xs,
    gap: 4,
  },
  activeTab: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontWeight: "600",
    fontSize: 12,
  },
  tabBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  tabBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  sectionHint: {
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  entryCard: {
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  entryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.xs,
  },
  entryTitle: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  entryField: {
    lineHeight: 18,
  },
  entryDate: {
    marginTop: Spacing.xs,
    fontSize: 11,
  },
  instinctTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  instinctTag: {
    paddingVertical: 3,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  instinctTagText: {
    fontSize: 11,
    fontWeight: "600",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderStyle: "dashed",
    marginTop: Spacing.sm,
  },
  addButtonText: {
    fontWeight: "600",
    fontSize: 15,
  },
  formCard: {
    marginTop: Spacing.sm,
    gap: Spacing.md,
  },
  formTitle: {
    marginBottom: Spacing.xs,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.xs,
    padding: Spacing.md,
    fontSize: 15,
    marginBottom: Spacing.sm,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  instinctGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  instinctToggle: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  formActions: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    alignItems: "center",
  },
  saveButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
  },
});
