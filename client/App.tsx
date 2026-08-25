import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import {
  CrimsonPro_400Regular,
  CrimsonPro_500Medium,
  CrimsonPro_600SemiBold,
  CrimsonPro_700Bold,
} from "@expo-google-fonts/crimson-pro";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";

import RootStackNavigator from "@/navigation/RootStackNavigator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CommunityProvider } from "@/contexts/CommunityContext";
import { DailyGreeting } from "@/components/DailyGreeting";

export default function App() {
  const [showGreeting, setShowGreeting] = useState(true);

  useEffect(() => {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

    const iosApiKey = Constants.expoConfig?.extra?.revenueCatIosApiKey;
    const androidApiKey =
      Constants.expoConfig?.extra?.revenueCatAndroidApiKey;

    if (Platform.OS === "ios" && iosApiKey) {
      Purchases.configure({ apiKey: iosApiKey });
    } else if (Platform.OS === "android" && androidApiKey) {
      Purchases.configure({ apiKey: androidApiKey });
    }
  }, []);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    CrimsonPro_400Regular,
    CrimsonPro_500Medium,
    CrimsonPro_600SemiBold,
    CrimsonPro_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#8B6AAE" />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <CommunityProvider>
            <AuthProvider>
              <SafeAreaProvider>
                <GestureHandlerRootView style={styles.root}>
                  <KeyboardProvider>
                    <NavigationContainer>
                      <RootStackNavigator />
                    </NavigationContainer>
                    {showGreeting ? (
                      <DailyGreeting onDismiss={() => setShowGreeting(false)} />
                    ) : null}
                    <StatusBar style="auto" />
                  </KeyboardProvider>
                </GestureHandlerRootView>
              </SafeAreaProvider>
            </AuthProvider>
          </CommunityProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
});
