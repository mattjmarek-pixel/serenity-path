import { useState, useEffect, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CHECKIN_KEY = "@serenity_path_checkins";
const JOURNAL_KEY = "@serenity_path_journal_entries";
const GRATITUDE_KEY = "@serenity_path_gratitude";

interface DateRecord {
  date: string;
}

export interface StreakData {
  current: number;
  longest: number;
  lastDate: string | null;
}

function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function calculateStreak(dates: string[]): StreakData {
  if (dates.length === 0) {
    return { current: 0, longest: 0, lastDate: null };
  }

  const uniqueDates = [...new Set(dates)].sort((a, b) => b.localeCompare(a));

  let longest = 1;
  let currentStreak = 0;
  let tempStreak = 1;

  const today = getTodayString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;

  if (uniqueDates[0] === today || uniqueDates[0] === yesterdayStr) {
    currentStreak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const curr = new Date(uniqueDates[i - 1]);
      const prev = new Date(uniqueDates[i]);
      const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  tempStreak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const curr = new Date(uniqueDates[i - 1]);
    const prev = new Date(uniqueDates[i]);
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      tempStreak++;
    } else {
      if (tempStreak > longest) longest = tempStreak;
      tempStreak = 1;
    }
  }
  if (tempStreak > longest) longest = tempStreak;

  return {
    current: currentStreak,
    longest,
    lastDate: uniqueDates[0] || null,
  };
}

export function useStreaks() {
  const [checkInStreak, setCheckInStreak] = useState<StreakData>({ current: 0, longest: 0, lastDate: null });
  const [journalStreak, setJournalStreak] = useState<StreakData>({ current: 0, longest: 0, lastDate: null });
  const [gratitudeStreak, setGratitudeStreak] = useState<StreakData>({ current: 0, longest: 0, lastDate: null });
  const [isLoading, setIsLoading] = useState(true);

  const loadStreaks = useCallback(async () => {
    try {
      const [checkInData, journalData, gratitudeData] = await Promise.all([
        AsyncStorage.getItem(CHECKIN_KEY),
        AsyncStorage.getItem(JOURNAL_KEY),
        AsyncStorage.getItem(GRATITUDE_KEY),
      ]);

      if (checkInData) {
        const entries: DateRecord[] = JSON.parse(checkInData);
        setCheckInStreak(calculateStreak(entries.map((e) => e.date)));
      } else {
        setCheckInStreak({ current: 0, longest: 0, lastDate: null });
      }

      if (journalData) {
        const entries: DateRecord[] = JSON.parse(journalData);
        setJournalStreak(calculateStreak(entries.map((e) => e.date)));
      } else {
        setJournalStreak({ current: 0, longest: 0, lastDate: null });
      }

      if (gratitudeData) {
        const entries: DateRecord[] = JSON.parse(gratitudeData);
        setGratitudeStreak(calculateStreak(entries.map((e) => e.date)));
      } else {
        setGratitudeStreak({ current: 0, longest: 0, lastDate: null });
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStreaks();
  }, [loadStreaks]);

  const totalActiveStreaks = useMemo(() => {
    let count = 0;
    if (checkInStreak.current > 0) count++;
    if (journalStreak.current > 0) count++;
    if (gratitudeStreak.current > 0) count++;
    return count;
  }, [checkInStreak, journalStreak, gratitudeStreak]);

  const bestCurrentStreak = useMemo(() => {
    return Math.max(checkInStreak.current, journalStreak.current, gratitudeStreak.current);
  }, [checkInStreak, journalStreak, gratitudeStreak]);

  return {
    checkInStreak,
    journalStreak,
    gratitudeStreak,
    isLoading,
    loadStreaks,
    totalActiveStreaks,
    bestCurrentStreak,
  };
}
