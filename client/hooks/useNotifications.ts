import { useState, useEffect, useCallback } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

const NOTIFICATION_PREFS_KEY = "@serenity_path_notifications";

if (Platform.OS !== "web") {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export interface NotificationPrefs {
  reflectionEnabled: boolean;
  reflectionHour: number;
  reflectionMinute: number;
  checkInEnabled: boolean;
  checkInHour: number;
  checkInMinute: number;
  gratitudeEnabled: boolean;
  gratitudeHour: number;
  gratitudeMinute: number;
}

const DEFAULT_PREFS: NotificationPrefs = {
  reflectionEnabled: false,
  reflectionHour: 8,
  reflectionMinute: 0,
  checkInEnabled: false,
  checkInHour: 20,
  checkInMinute: 0,
  gratitudeEnabled: false,
  gratitudeHour: 21,
  gratitudeMinute: 0,
};

const NOTIFICATION_IDS = {
  reflection: "daily-reflection",
  checkIn: "daily-checkin",
  gratitude: "daily-gratitude",
};

const NOTIFICATION_CONTENT = {
  reflection: {
    title: "Daily Reflection",
    body: "Take a moment to read today's reflection and start your day with intention.",
  },
  checkIn: {
    title: "Daily Check-In",
    body: "How are you feeling today? Take a moment to check in with yourself.",
  },
  gratitude: {
    title: "Gratitude Practice",
    body: "What are 3 things you're grateful for today? Take a moment to reflect.",
  },
};

async function scheduleNotification(
  identifier: string,
  title: string,
  body: string,
  hour: number,
  minute: number,
) {
  await Notifications.cancelScheduledNotificationAsync(identifier).catch(
    () => {},
  );

  await Notifications.scheduleNotificationAsync({
    identifier,
    content: {
      title,
      body,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

async function cancelNotification(identifier: string) {
  await Notifications.cancelScheduledNotificationAsync(identifier).catch(
    () => {},
  );
}

export function useNotifications() {
  const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULT_PREFS);
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);
  const [canAskAgain, setCanAskAgain] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPrefs();
    checkPermission();
  }, []);

  const checkPermission = useCallback(async () => {
    if (Platform.OS === "web") {
      setPermissionStatus("web");
      return;
    }
    const result = await Notifications.getPermissionsAsync();
    setPermissionStatus(result.status);
    setCanAskAgain(result.canAskAgain);
  }, []);

  const requestPermission = useCallback(async () => {
    if (Platform.OS === "web") return false;
    const result = await Notifications.requestPermissionsAsync();
    setPermissionStatus(result.status);
    setCanAskAgain(result.canAskAgain);
    return result.status === "granted";
  }, []);

  const loadPrefs = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(NOTIFICATION_PREFS_KEY);
      if (stored) {
        setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(stored) });
      }
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  }, []);

  const savePrefs = useCallback(
    async (updates: Partial<NotificationPrefs>) => {
      const newPrefs = { ...prefs, ...updates };
      setPrefs(newPrefs);
      await AsyncStorage.setItem(
        NOTIFICATION_PREFS_KEY,
        JSON.stringify(newPrefs),
      );

      if (newPrefs.reflectionEnabled) {
        await scheduleNotification(
          NOTIFICATION_IDS.reflection,
          NOTIFICATION_CONTENT.reflection.title,
          NOTIFICATION_CONTENT.reflection.body,
          newPrefs.reflectionHour,
          newPrefs.reflectionMinute,
        );
      } else {
        await cancelNotification(NOTIFICATION_IDS.reflection);
      }

      if (newPrefs.checkInEnabled) {
        await scheduleNotification(
          NOTIFICATION_IDS.checkIn,
          NOTIFICATION_CONTENT.checkIn.title,
          NOTIFICATION_CONTENT.checkIn.body,
          newPrefs.checkInHour,
          newPrefs.checkInMinute,
        );
      } else {
        await cancelNotification(NOTIFICATION_IDS.checkIn);
      }

      if (newPrefs.gratitudeEnabled) {
        await scheduleNotification(
          NOTIFICATION_IDS.gratitude,
          NOTIFICATION_CONTENT.gratitude.title,
          NOTIFICATION_CONTENT.gratitude.body,
          newPrefs.gratitudeHour,
          newPrefs.gratitudeMinute,
        );
      } else {
        await cancelNotification(NOTIFICATION_IDS.gratitude);
      }
    },
    [prefs],
  );

  const toggleReminder = useCallback(
    async (type: "reflection" | "checkIn" | "gratitude") => {
      const key = `${type}Enabled` as keyof NotificationPrefs;
      const currentValue = prefs[key];

      if (!currentValue) {
        const granted = await requestPermission();
        if (!granted) return false;
      }

      await savePrefs({ [key]: !currentValue });
      return true;
    },
    [prefs, requestPermission, savePrefs],
  );

  const updateTime = useCallback(
    async (
      type: "reflection" | "checkIn" | "gratitude",
      hour: number,
      minute: number,
    ) => {
      await savePrefs({
        [`${type}Hour`]: hour,
        [`${type}Minute`]: minute,
      } as Partial<NotificationPrefs>);
    },
    [savePrefs],
  );

  const formatTime = useCallback((hour: number, minute: number) => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const displayMinute = minute.toString().padStart(2, "0");
    return `${displayHour}:${displayMinute} ${period}`;
  }, []);

  return {
    prefs,
    permissionStatus,
    canAskAgain,
    isLoading,
    toggleReminder,
    updateTime,
    formatTime,
    requestPermission,
  };
}
