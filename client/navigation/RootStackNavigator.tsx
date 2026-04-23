import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "@/navigation/MainTabNavigator";
import WelcomeScreen from "@/screens/WelcomeScreen";
import SupportScreen from "@/screens/SupportScreen";
import JournalScreen from "@/screens/JournalScreen";
import JournalEntryScreen from "@/screens/JournalEntryScreen";
import MeetingFinderScreen from "@/screens/MeetingFinderScreen";
import BigBookScreen from "@/screens/BigBookScreen";
import BigBookChapterScreen from "@/screens/BigBookChapterScreen";
import EditProfileScreen from "@/screens/EditProfileScreen";
import SupportUsScreen from "@/screens/SupportUsScreen";
import SavedReflectionsScreen from "@/screens/SavedReflectionsScreen";
import SobrietyChipsScreen from "@/screens/SobrietyChipsScreen";
import PrayersScreen from "@/screens/PrayersScreen";
import GratitudeScreen from "@/screens/GratitudeScreen";
import PanicScreen from "@/screens/PanicScreen";
import CheckInScreen from "@/screens/CheckInScreen";
import MoodHistoryScreen from "@/screens/MoodHistoryScreen";
import StepWorkScreen from "@/screens/StepWorkScreen";
import StreaksScreen from "@/screens/StreaksScreen";
import NotificationSettingsScreen from "@/screens/NotificationSettingsScreen";
import AudioResourcesScreen from "@/screens/AudioResourcesScreen";
import WebViewScreen from "@/screens/WebViewScreen";
import FourthStepScreen from "@/screens/FourthStepScreen";
import ServiceWorkTrackerScreen from "@/screens/ServiceWorkTrackerScreen";
import { useAuth } from "@/hooks/useAuth";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type RootStackParamList = {
  Welcome: undefined;
  Main: undefined;
  Support: undefined;
  SupportUs: undefined;
  SavedReflections: undefined;
  Journal: undefined;
  JournalEntry: { entryId?: string } | undefined;
  MeetingFinder: undefined;
  BigBook: undefined;
  BigBookChapter: { chapterId: number };
  EditProfile: undefined;
  SobrietyChips: undefined;
  Prayers: undefined;
  Gratitude: undefined;
  Panic: undefined;
  CheckIn: undefined;
  MoodHistory: undefined;
  StepWork: { stepNumber: number };
  Streaks: undefined;
  NotificationSettings: undefined;
  AudioResources: undefined;
  WebViewScreen: { url: string; title: string };
  FourthStep: undefined;
  ServiceWorkTracker: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {!isAuthenticated ? (
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Main"
            component={MainTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Support"
            component={SupportScreen}
            options={{
              presentation: "modal",
              headerTitle: "Support Resources",
            }}
          />
          <Stack.Screen
            name="Journal"
            component={JournalScreen}
            options={{
              headerTitle: "Journal",
            }}
          />
          <Stack.Screen
            name="JournalEntry"
            component={JournalEntryScreen}
            options={{
              presentation: "modal",
              headerTitle: "New Entry",
            }}
          />
          <Stack.Screen
            name="MeetingFinder"
            component={MeetingFinderScreen}
            options={{
              headerTitle: "Find Meetings",
            }}
          />
          <Stack.Screen
            name="BigBook"
            component={BigBookScreen}
            options={{
              headerTitle: "Big Book",
            }}
          />
          <Stack.Screen
            name="BigBookChapter"
            component={BigBookChapterScreen}
            options={{
              headerTitle: "Chapter",
            }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{
              headerTitle: "Edit Profile",
            }}
          />
          <Stack.Screen
            name="SupportUs"
            component={SupportUsScreen}
            options={{
              headerTitle: "Support Us",
            }}
          />
          <Stack.Screen
            name="SavedReflections"
            component={SavedReflectionsScreen}
            options={{
              headerTitle: "Saved Reflections",
            }}
          />
          <Stack.Screen
            name="SobrietyChips"
            component={SobrietyChipsScreen}
            options={{
              headerTitle: "Sobriety Chips",
            }}
          />
          <Stack.Screen
            name="Prayers"
            component={PrayersScreen}
            options={{
              headerTitle: "Promises & Prayers",
            }}
          />
          <Stack.Screen
            name="Gratitude"
            component={GratitudeScreen}
            options={{
              headerTitle: "Gratitude",
            }}
          />
          <Stack.Screen
            name="Panic"
            component={PanicScreen}
            options={{
              headerTitle: "I'm Struggling",
            }}
          />
          <Stack.Screen
            name="CheckIn"
            component={CheckInScreen}
            options={{
              headerTitle: "Daily Check-In",
            }}
          />
          <Stack.Screen
            name="MoodHistory"
            component={MoodHistoryScreen}
            options={{
              headerTitle: "Mood History",
            }}
          />
          <Stack.Screen
            name="StepWork"
            component={StepWorkScreen}
            options={{
              headerTitle: "Step Work",
            }}
          />
          <Stack.Screen
            name="Streaks"
            component={StreaksScreen}
            options={{
              headerTitle: "Streaks",
            }}
          />
          <Stack.Screen
            name="NotificationSettings"
            component={NotificationSettingsScreen}
            options={{
              headerTitle: "Notifications",
            }}
          />
          <Stack.Screen
            name="AudioResources"
            component={AudioResourcesScreen}
            options={{
              headerTitle: "Audio Resources",
            }}
          />
          <Stack.Screen
            name="WebViewScreen"
            component={WebViewScreen}
            options={({ route }) => ({
              headerTitle: route.params.title,
            })}
          />
          <Stack.Screen
            name="FourthStep"
            component={FourthStepScreen}
            options={{
              headerTitle: "4th Step Inventory",
            }}
          />
          <Stack.Screen
            name="ServiceWorkTracker"
            component={ServiceWorkTrackerScreen}
            options={{
              headerTitle: "Service Work",
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
