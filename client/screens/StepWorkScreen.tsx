import React, { useState, useCallback } from "react";
import { View, StyleSheet, Pressable, TextInput, ScrollView, Alert } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";

import { ThemedText } from "@/components/ThemedText";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useTheme } from "@/hooks/useTheme";
import { useStepWork } from "@/hooks/useStepWork";
import { Spacing, BorderRadius } from "@/constants/theme";

const STEP_QUESTIONS: { [step: number]: string[] } = {
  1: [
    "In what ways has alcohol made my life unmanageable?",
    "What situations have I been powerless over my drinking?",
    "How has my addiction affected my relationships?",
    "What consequences have I faced because of my drinking?",
    "When did I first realize I had lost control?",
  ],
  2: [
    "What does 'a Power greater than myself' mean to me?",
    "Have I ever witnessed recovery in others? What did that look like?",
    "What gives me hope that I can recover?",
    "In what ways has my thinking been 'insane' during active addiction?",
    "What would being 'restored to sanity' look like in my life?",
  ],
  3: [
    "What does 'turning my will over' mean to me?",
    "What am I afraid of letting go of?",
    "How has my self-will caused problems in my life?",
    "What does trust look like in my recovery?",
    "How can I practice surrender today?",
  ],
  4: [
    "What resentments am I holding onto and why?",
    "What fears do I carry and how have they affected my actions?",
    "In what ways have I been dishonest with myself or others?",
    "What relationships have I damaged and what was my part?",
    "What patterns of behavior do I keep repeating?",
    "What are my character assets and strengths?",
  ],
  5: [
    "What have I been most reluctant to share with another person?",
    "How does keeping secrets affect my recovery?",
    "Who is a safe person I can share my inventory with?",
    "What do I hope to gain from being completely honest?",
    "How do I feel about admitting the exact nature of my wrongs?",
  ],
  6: [
    "Which character defects am I most aware of?",
    "Am I truly ready to let go of all my defects, even the ones I enjoy?",
    "What defects have I been unwilling to give up and why?",
    "How have my defects served me in the past?",
    "What would my life look like without these defects?",
  ],
  7: [
    "What does humility mean to me?",
    "How is humility different from humiliation?",
    "Which shortcomings cause me the most trouble?",
    "Am I willing to ask for help in removing my shortcomings?",
    "How can I practice humility in my daily life?",
  ],
  8: [
    "Who have I harmed through my addiction?",
    "What kinds of harm have I caused (emotional, financial, physical)?",
    "Am I willing to make amends to all of them?",
    "Who am I most resistant to making amends to and why?",
    "How has harming others affected my own well-being?",
  ],
  9: [
    "Which amends can I make directly without causing further harm?",
    "Which amends might injure others if made?",
    "How do I prepare myself emotionally for making amends?",
    "What amends have I already made and how did it feel?",
    "How do I handle it when amends are not accepted?",
  ],
  10: [
    "What does my daily inventory practice look like?",
    "How quickly do I admit when I am wrong?",
    "What patterns do I notice recurring in my behavior?",
    "How do I handle conflict differently now compared to before recovery?",
    "What tools do I use to stay accountable each day?",
  ],
  11: [
    "What does my prayer and meditation practice look like?",
    "How do I seek to understand a Higher Power's will for me?",
    "What obstacles prevent me from maintaining a spiritual practice?",
    "How has prayer or meditation changed my perspective?",
    "What moments of conscious contact have I experienced?",
  ],
  12: [
    "What does my spiritual awakening look like?",
    "How do I carry the message to others who still suffer?",
    "In what ways do I practice these principles in all my affairs?",
    "How has service work strengthened my recovery?",
    "What does it mean to me to give back what was freely given?",
  ],
};

const STEP_TITLES: { [step: number]: string } = {
  1: "Honesty",
  2: "Hope",
  3: "Faith",
  4: "Courage",
  5: "Integrity",
  6: "Willingness",
  7: "Humility",
  8: "Brotherly Love",
  9: "Justice",
  10: "Perseverance",
  11: "Spiritual Awareness",
  12: "Service",
};

export default function StepWorkScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { getStepData, saveAnswer, getStepProgress } = useStepWork();

  const stepNumber: number = route.params?.stepNumber ?? 1;
  const questions = STEP_QUESTIONS[stepNumber] || [];
  const stepData = getStepData(stepNumber);
  const progress = getStepProgress(stepNumber, questions.length);

  const [answers, setAnswers] = useState<{ [key: number]: string }>(() => {
    if (stepData?.answers) {
      const initial: { [key: number]: string } = {};
      Object.entries(stepData.answers).forEach(([key, val]) => {
        initial[Number(key)] = val;
      });
      return initial;
    }
    return {};
  });

  const [savingIndex, setSavingIndex] = useState<number | null>(null);

  const handleSave = useCallback(async (questionIndex: number) => {
    const answer = answers[questionIndex] || "";
    setSavingIndex(questionIndex);
    await saveAnswer(stepNumber, questionIndex, answer);
    setSavingIndex(null);
  }, [answers, stepNumber, saveAnswer]);

  const handleChangeText = useCallback((index: number, text: string) => {
    setAnswers(prev => ({ ...prev, [index]: text }));
  }, []);

  const progressPercent = questions.length > 0 ? (progress.answered / progress.total) * 100 : 0;

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: insets.bottom + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      <View style={styles.headerSection}>
        <View style={[styles.stepBadge, { backgroundColor: theme.primary }]}>
          <ThemedText style={styles.stepBadgeText}>{stepNumber}</ThemedText>
        </View>
        <ThemedText type="h2" style={styles.stepTitle}>
          {"Step " + stepNumber + ": " + STEP_TITLES[stepNumber]}
        </ThemedText>
      </View>

      <View style={[styles.progressCard, { backgroundColor: theme.backgroundDefault }]}>
        <View style={styles.progressHeader}>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {"Progress: " + progress.answered + " of " + progress.total + " questions"}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.primary, fontWeight: "600" }}>
            {Math.round(progressPercent) + "%"}
          </ThemedText>
        </View>
        <View style={[styles.progressBarBg, { backgroundColor: theme.backgroundSecondary }]}>
          <View
            style={[
              styles.progressBarFill,
              { backgroundColor: theme.primary, width: `${progressPercent}%` as any },
            ]}
          />
        </View>
      </View>

      {questions.map((question, index) => {
        const currentAnswer = answers[index] || "";
        const isSaved = stepData?.answers?.[index] !== undefined && stepData.answers[index] === currentAnswer && currentAnswer.trim().length > 0;
        const hasUnsavedChanges = currentAnswer !== (stepData?.answers?.[index] || "") && currentAnswer.trim().length > 0;

        return (
          <View key={index} style={[styles.questionCard, { backgroundColor: theme.backgroundDefault }]}>
            <View style={styles.questionHeader}>
              <View style={[styles.questionNumber, { backgroundColor: theme.backgroundSecondary }]}>
                <ThemedText style={[styles.questionNumberText, { color: theme.primary }]}>
                  {index + 1}
                </ThemedText>
              </View>
              {isSaved ? (
                <Feather name="check-circle" size={18} color={theme.success} />
              ) : null}
            </View>
            <ThemedText type="body" style={[styles.questionText, { color: theme.text }]}>
              {question}
            </ThemedText>
            <TextInput
              style={[
                styles.answerInput,
                {
                  backgroundColor: theme.backgroundSecondary,
                  color: theme.text,
                  borderColor: hasUnsavedChanges ? theme.warning : theme.border,
                },
              ]}
              placeholder="Write your reflection here..."
              placeholderTextColor={theme.textSecondary}
              multiline
              textAlignVertical="top"
              value={currentAnswer}
              onChangeText={(text) => handleChangeText(index, text)}
              onBlur={() => {
                if (currentAnswer.trim().length > 0 || stepData?.answers?.[index]) {
                  handleSave(index);
                }
              }}
            />
            {hasUnsavedChanges ? (
              <Pressable
                onPress={() => handleSave(index)}
                style={({ pressed }) => [
                  styles.saveButton,
                  { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 },
                ]}
              >
                {savingIndex === index ? (
                  <ThemedText style={styles.saveButtonText}>Saving...</ThemedText>
                ) : (
                  <ThemedText style={styles.saveButtonText}>Save</ThemedText>
                )}
              </Pressable>
            ) : null}
          </View>
        );
      })}
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  stepBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  stepBadgeText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 24,
  },
  stepTitle: {
    textAlign: "center",
  },
  progressCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 8,
    borderRadius: 4,
  },
  questionCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  questionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  questionNumberText: {
    fontWeight: "700",
    fontSize: 14,
  },
  questionText: {
    lineHeight: 24,
    marginBottom: Spacing.md,
    fontStyle: "italic",
  },
  answerInput: {
    minHeight: 100,
    borderRadius: BorderRadius.xs,
    padding: Spacing.md,
    fontSize: 16,
    lineHeight: 24,
    borderWidth: 1,
  },
  saveButton: {
    marginTop: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xs,
    alignSelf: "flex-end",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});
