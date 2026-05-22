import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const JOURNAL_KEY = "@serenity_path_journal_entries";

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood: string;
  createdAt: string;
}

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadEntries = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(JOURNAL_KEY);
      if (stored) {
        setEntries(JSON.parse(stored));
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const saveEntry = useCallback(
    async (entry: Omit<JournalEntry, "id" | "createdAt">) => {
      try {
        const newEntry: JournalEntry = {
          ...entry,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        const updated = [newEntry, ...entries];
        await AsyncStorage.setItem(JOURNAL_KEY, JSON.stringify(updated));
        setEntries(updated);
        return true;
      } catch (error) {
        return false;
      }
    },
    [entries],
  );

  const updateEntry = useCallback(
    async (id: string, updates: Partial<JournalEntry>) => {
      try {
        const updated = entries.map((entry) =>
          entry.id === id ? { ...entry, ...updates } : entry,
        );
        await AsyncStorage.setItem(JOURNAL_KEY, JSON.stringify(updated));
        setEntries(updated);
        return true;
      } catch (error) {
        return false;
      }
    },
    [entries],
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      try {
        const updated = entries.filter((entry) => entry.id !== id);
        await AsyncStorage.setItem(JOURNAL_KEY, JSON.stringify(updated));
        setEntries(updated);
        return true;
      } catch (error) {
        return false;
      }
    },
    [entries],
  );

  const getEntry = useCallback(
    (id: string) => {
      return entries.find((entry) => entry.id === id);
    },
    [entries],
  );

  return {
    entries,
    isLoading,
    loadEntries,
    saveEntry,
    updateEntry,
    deleteEntry,
    getEntry,
  };
}
