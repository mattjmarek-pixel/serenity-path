import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FOURTH_STEP_KEY = "@serenity_path_fourth_step";

export interface ResentmentEntry {
  id: string;
  whoOrWhat: string;
  cause: string;
  affectedInstincts: string[];
  createdAt: string;
}

export interface FearEntry {
  id: string;
  fear: string;
  effect: string;
  createdAt: string;
}

export interface HarmEntry {
  id: string;
  whomHarmed: string;
  whatDid: string;
  howHarmed: string;
  createdAt: string;
}

export interface FourthStepData {
  resentments: ResentmentEntry[];
  fears: FearEntry[];
  harms: HarmEntry[];
}

const DEFAULT_DATA: FourthStepData = {
  resentments: [],
  fears: [],
  harms: [],
};

export function useFourthStep() {
  const [data, setData] = useState<FourthStepData>(DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(FOURTH_STEP_KEY);
      if (stored) {
        setData(JSON.parse(stored));
      }
    } catch (_) {
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const persist = useCallback(async (updated: FourthStepData) => {
    try {
      await AsyncStorage.setItem(FOURTH_STEP_KEY, JSON.stringify(updated));
      setData(updated);
      return true;
    } catch (_) {
      return false;
    }
  }, []);

  const addResentment = useCallback(async (entry: Omit<ResentmentEntry, "id" | "createdAt">) => {
    const newEntry: ResentmentEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updated = { ...data, resentments: [newEntry, ...data.resentments] };
    return persist(updated);
  }, [data, persist]);

  const deleteResentment = useCallback(async (id: string) => {
    const updated = { ...data, resentments: data.resentments.filter(e => e.id !== id) };
    return persist(updated);
  }, [data, persist]);

  const addFear = useCallback(async (entry: Omit<FearEntry, "id" | "createdAt">) => {
    const newEntry: FearEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updated = { ...data, fears: [newEntry, ...data.fears] };
    return persist(updated);
  }, [data, persist]);

  const deleteFear = useCallback(async (id: string) => {
    const updated = { ...data, fears: data.fears.filter(e => e.id !== id) };
    return persist(updated);
  }, [data, persist]);

  const addHarm = useCallback(async (entry: Omit<HarmEntry, "id" | "createdAt">) => {
    const newEntry: HarmEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updated = { ...data, harms: [newEntry, ...data.harms] };
    return persist(updated);
  }, [data, persist]);

  const deleteHarm = useCallback(async (id: string) => {
    const updated = { ...data, harms: data.harms.filter(e => e.id !== id) };
    return persist(updated);
  }, [data, persist]);

  return {
    data,
    isLoading,
    load,
    addResentment,
    deleteResentment,
    addFear,
    deleteFear,
    addHarm,
    deleteHarm,
  };
}
