import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StepsScreen from "@/screens/StepsScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type StepsStackParamList = {
  Steps: undefined;
};

const Stack = createNativeStackNavigator<StepsStackParamList>();

export default function StepsStackNavigator() {
  const screenOptions = useScreenOptions({ transparent: false });

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Steps"
        component={StepsScreen}
        options={{
          headerTitle: "Steps & Traditions",
        }}
      />
    </Stack.Navigator>
  );
}
