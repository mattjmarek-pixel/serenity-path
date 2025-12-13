import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PROFILE_KEY = "@serenity_path_profile";
const USER_NAME_KEY = "@serenity_path_user_name";

export interface UserProfile {
  name: string;
  pronouns: string;
  sobrietyDate: string | null;
  homeCity: string;
  preferredMeetingTypes: string[];
  defaultRadius: number;
  reminderEnabled: boolean;
  reminderTime: string;
  sponsorName: string;
  sponsorPhone: string;
  emergencyContact: string;
  emergencyPhone: string;
  personalMantra: string;
}

const DEFAULT_PROFILE: UserProfile = {
  name: "Recovery Warrior",
  pronouns: "",
  sobrietyDate: null,
  homeCity: "",
  preferredMeetingTypes: [],
  defaultRadius: 10,
  reminderEnabled: false,
  reminderTime: "08:00",
  sponsorName: "",
  sponsorPhone: "",
  emergencyContact: "",
  emergencyPhone: "",
  personalMantra: "",
};

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const storedProfile = await AsyncStorage.getItem(PROFILE_KEY);
      const legacyName = await AsyncStorage.getItem(USER_NAME_KEY);
      
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        setProfile({ ...DEFAULT_PROFILE, ...parsed });
      } else if (legacyName) {
        setProfile({ ...DEFAULT_PROFILE, name: legacyName });
      }
    } catch (error) {
      console.log("Error loading profile:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const saveProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (isLoading) {
      console.log("Cannot save profile while loading");
      return false;
    }
    try {
      const currentProfile = await AsyncStorage.getItem(PROFILE_KEY);
      const baseProfile = currentProfile ? { ...DEFAULT_PROFILE, ...JSON.parse(currentProfile) } : profile;
      const newProfile = { ...baseProfile, ...updates };
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile));
      await AsyncStorage.setItem(USER_NAME_KEY, newProfile.name);
      setProfile(newProfile);
      return true;
    } catch (error) {
      console.log("Error saving profile:", error);
      return false;
    }
  }, [isLoading, profile]);

  const getSobrietyDays = useCallback(() => {
    if (!profile.sobrietyDate) return null;
    const start = new Date(profile.sobrietyDate);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }, [profile.sobrietyDate]);

  const getSobrietyTime = useCallback(() => {
    if (!profile.sobrietyDate) return null;
    const start = new Date(profile.sobrietyDate);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds };
  }, [profile.sobrietyDate]);

  return {
    profile,
    isLoading,
    saveProfile,
    loadProfile,
    getSobrietyDays,
    getSobrietyTime,
  };
}
