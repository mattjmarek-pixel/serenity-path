import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GRATITUDE_KEY = "@serenity_path_gratitude";

export interface GratitudeEntry {
  id: string;
  date: string;
  items: string[];
  createdAt: string;
}

export function useGratitude() {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadEntries = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(GRATITUDE_KEY);
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

  const saveEntry = useCallback(async (items: string[]) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const newEntry: GratitudeEntry = {
        id: Date.now().toString(),
        date: today,
        items,
        createdAt: new Date().toISOString(),
      };
      const filtered = entries.filter((e) => e.date !== today);
      const updated = [newEntry, ...filtered];
      await AsyncStorage.setItem(GRATITUDE_KEY, JSON.stringify(updated));
      setEntries(updated);
      return true;
    } catch (error) {
      return false;
    }
  }, [entries]);

  const getTodayEntry = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    return entries.find((e) => e.date === today) || null;
  }, [entries]);

  const deleteEntry = useCallback(async (id: string) => {
    try {
      const updated = entries.filter((e) => e.id !== id);
      await AsyncStorage.setItem(GRATITUDE_KEY, JSON.stringify(updated));
      setEntries(updated);
      return true;
    } catch (error) {
      return false;
    }
  }, [entries]);

  return {
    entries,
    isLoading,
    loadEntries,
    saveEntry,
    getTodayEntry,
    deleteEntry,
  };
}
