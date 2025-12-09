import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ReflectionsScreen from "@/screens/ReflectionsScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type ReflectionsStackParamList = {
  Reflections: undefined;
};

const Stack = createNativeStackNavigator<ReflectionsStackParamList>();

export default function ReflectionsStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Reflections"
        component={ReflectionsScreen}
        options={{
          headerTitle: "Daily Reflections",
        }}
      />
    </Stack.Navigator>
  );
}
