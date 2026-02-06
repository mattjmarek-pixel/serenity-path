import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "@/navigation/MainTabNavigator";
import SupportScreen from "@/screens/SupportScreen";
import JournalScreen from "@/screens/JournalScreen";
import JournalEntryScreen from "@/screens/JournalEntryScreen";
import MeetingFinderScreen from "@/screens/MeetingFinderScreen";
import BigBookScreen from "@/screens/BigBookScreen";
import BigBookChapterScreen from "@/screens/BigBookChapterScreen";
import EditProfileScreen from "@/screens/EditProfileScreen";
import SupportUsScreen from "@/screens/SupportUsScreen";
import SavedReflectionsScreen from "@/screens/SavedReflectionsScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type RootStackParamList = {
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
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
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
    </Stack.Navigator>
  );
}
