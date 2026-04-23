import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@serenity_path_service_work";

export type ServiceType =
  | "Chaired a meeting"
  | "Called a newcomer"
  | "Sponsored someone"
  | "Coffee/setup"
  | "General service"
  | "Other";

export const SERVICE_TYPES: ServiceType[] = [
  "Chaired a meeting",
  "Called a newcomer",
  "Sponsored someone",
  "Coffee/setup",
  "General service",
  "Other",
];

export interface ServiceEntry {
  id: string;
  type: ServiceType;
  notes: string;
  date: string;
  createdAt: string;
}

function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function getMonthString(dateStr: string): string {
  return dateStr.slice(0, 7);
}

function getCurrentMonthString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function useServiceWork() {
  const [entries, setEntries] = useState<ServiceEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: ServiceEntry[] = JSON.parse(raw);
        const sorted = [...parsed].sort((a, b) =>
          b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)
        );
        setEntries(sorted);
      } else {
        setEntries([]);
      }
    } catch {
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addEntry = useCallback(
    async (type: ServiceType, notes: string, date: string) => {
      const newEntry: ServiceEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        type,
        notes: notes.trim(),
        date,
        createdAt: new Date().toISOString(),
      };
      const updated = [newEntry, ...entries].sort(
        (a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)
      );
      setEntries(updated);
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
    },
    [entries]
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      const updated = entries.filter((e) => e.id !== id);
      setEntries(updated);
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
    },
    [entries]
  );

  const thisMonthCount = entries.filter(
    (e) => getMonthString(e.date) === getCurrentMonthString()
  ).length;

  const allTimeCount = entries.length;

  return {
    entries,
    isLoading,
    addEntry,
    deleteEntry,
    load,
    thisMonthCount,
    allTimeCount,
    getTodayString,
  };
}
