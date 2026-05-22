import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STEPWORK_KEY = "@serenity_path_stepwork";

export interface StepWorkData {
  stepNumber: number;
  answers: { [questionIndex: number]: string };
  lastUpdated: string;
}

export function useStepWork() {
  const [stepWorkData, setStepWorkData] = useState<StepWorkData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STEPWORK_KEY);
      if (stored) {
        setStepWorkData(JSON.parse(stored));
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const saveAnswer = useCallback(
    async (stepNumber: number, questionIndex: number, answer: string) => {
      try {
        const existing = stepWorkData.find((s) => s.stepNumber === stepNumber);
        let updated: StepWorkData[];
        if (existing) {
          updated = stepWorkData.map((s) =>
            s.stepNumber === stepNumber
              ? {
                  ...s,
                  answers: { ...s.answers, [questionIndex]: answer },
                  lastUpdated: new Date().toISOString(),
                }
              : s,
          );
        } else {
          const newEntry: StepWorkData = {
            stepNumber,
            answers: { [questionIndex]: answer },
            lastUpdated: new Date().toISOString(),
          };
          updated = [...stepWorkData, newEntry];
        }
        await AsyncStorage.setItem(STEPWORK_KEY, JSON.stringify(updated));
        setStepWorkData(updated);
        return true;
      } catch (error) {
        return false;
      }
    },
    [stepWorkData],
  );

  const getStepData = useCallback(
    (stepNumber: number): StepWorkData | undefined => {
      return stepWorkData.find((s) => s.stepNumber === stepNumber);
    },
    [stepWorkData],
  );

  const getStepProgress = useCallback(
    (
      stepNumber: number,
      totalQuestions: number,
    ): { answered: number; total: number } => {
      const data = stepWorkData.find((s) => s.stepNumber === stepNumber);
      if (!data) return { answered: 0, total: totalQuestions };
      const answered = Object.values(data.answers).filter(
        (a) => a.trim().length > 0,
      ).length;
      return { answered, total: totalQuestions };
    },
    [stepWorkData],
  );

  const isStepStarted = useCallback(
    (stepNumber: number): boolean => {
      const data = stepWorkData.find((s) => s.stepNumber === stepNumber);
      if (!data) return false;
      return Object.values(data.answers).some((a) => a.trim().length > 0);
    },
    [stepWorkData],
  );

  const isStepComplete = useCallback(
    (stepNumber: number, totalQuestions: number): boolean => {
      const data = stepWorkData.find((s) => s.stepNumber === stepNumber);
      if (!data) return false;
      const answered = Object.values(data.answers).filter(
        (a) => a.trim().length > 0,
      ).length;
      return answered >= totalQuestions;
    },
    [stepWorkData],
  );

  return {
    stepWorkData,
    isLoading,
    loadData,
    saveAnswer,
    getStepData,
    getStepProgress,
    isStepStarted,
    isStepComplete,
  };
}
