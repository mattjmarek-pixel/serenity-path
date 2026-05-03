import React from "react";
import { View, StyleSheet } from "react-native";

import MainTabNavigator from "@/navigation/MainTabNavigator";
import { CommunityBanner } from "@/components/CommunityBanner";
import { useTheme } from "@/hooks/useTheme";

export default function MainShell() {
  const { theme } = useTheme();
  return (
    <View style={[styles.root, { backgroundColor: theme.backgroundRoot }]}>
      <CommunityBanner />
      <View style={styles.content}>
        <MainTabNavigator />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
