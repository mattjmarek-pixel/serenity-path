import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CHECKIN_KEY = "@serenity_path_checkins";

export interface CheckIn {
  id: string;
  date: string;
  mood: number;
  note: string;
  createdAt: string;
}

export const MOOD_OPTIONS = [
  { value: 1, label: "Crisis", icon: "alert-circle" as const, color: "#C62828" },
  { value: 2, label: "Tough", icon: "cloud-rain" as const, color: "#E65100" },
  { value: 3, label: "Okay", icon: "cloud" as const, color: "#F9A825" },
  { value: 4, label: "Good", icon: "sun" as const, color: "#2E7D4A" },
  { value: 5, label: "Great", icon: "star" as const, color: "#1F4E79" },
];

function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function useCheckIn() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCheckIns = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(CHECKIN_KEY);
      if (stored) {
        setCheckIns(JSON.parse(stored));
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCheckIns();
  }, [loadCheckIns]);

  const getTodayCheckIn = useCallback((): CheckIn | undefined => {
    const today = getTodayString();
    return checkIns.find((c) => c.date === today);
  }, [checkIns]);

  const saveCheckIn = useCallback(
    async (mood: number, note: string = "") => {
      try {
        const today = getTodayString();
        const existing = checkIns.findIndex((c) => c.date === today);
        let updated: CheckIn[];

        if (existing >= 0) {
          updated = checkIns.map((c, i) =>
            i === existing ? { ...c, mood, note, createdAt: new Date().toISOString() } : c
          );
        } else {
          const newCheckIn: CheckIn = {
            id: Date.now().toString(),
            date: today,
            mood,
            note,
            createdAt: new Date().toISOString(),
          };
          updated = [newCheckIn, ...checkIns];
        }

        await AsyncStorage.setItem(CHECKIN_KEY, JSON.stringify(updated));
        setCheckIns(updated);
        return true;
      } catch (error) {
        return false;
      }
    },
    [checkIns]
  );

  const getCheckInsForRange = useCallback(
    (days: number): CheckIn[] => {
      const now = new Date();
      const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      return checkIns
        .filter((c) => new Date(c.date) >= cutoff)
        .sort((a, b) => a.date.localeCompare(b.date));
    },
    [checkIns]
  );

  const getAverageMood = useCallback(
    (days: number): number | null => {
      const rangeCheckIns = getCheckInsForRange(days);
      if (rangeCheckIns.length === 0) return null;
      const sum = rangeCheckIns.reduce((acc, c) => acc + c.mood, 0);
      return sum / rangeCheckIns.length;
    },
    [getCheckInsForRange]
  );

  return {
    checkIns,
    isLoading,
    loadCheckIns,
    getTodayCheckIn,
    saveCheckIn,
    getCheckInsForRange,
    getAverageMood,
  };
}
