import React, { useState } from "react";
import { View, StyleSheet, ActivityIndicator, Pressable } from "react-native";
import { WebView } from "react-native-webview";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";

type WebViewRouteParams = {
  WebViewScreen: { url: string; title: string };
};

export default function WebViewScreen() {
  const route = useRoute<RouteProp<WebViewRouteParams, "WebViewScreen">>();
  const navigation = useNavigation();
  const { url } = route.params;
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <View
        style={[
          styles.container,
          styles.errorContainer,
          { backgroundColor: theme.backgroundRoot },
        ]}
      >
        <Feather name="wifi-off" size={48} color={theme.textSecondary} />
        <ThemedText
          type="h3"
          style={{ textAlign: "center", marginTop: Spacing.lg }}
        >
          Unable to load this page
        </ThemedText>
        <ThemedText
          type="small"
          style={{
            color: theme.textSecondary,
            textAlign: "center",
            marginTop: Spacing.sm,
          }}
        >
          Check your internet connection and try again.
        </ThemedText>
        <Pressable
          onPress={() => {
            setError(false);
            setLoading(true);
          }}
          style={[styles.retryButton, { backgroundColor: theme.primary }]}
        >
          <ThemedText style={{ color: "#FFFFFF", fontWeight: "600" }}>
            Try Again
          </ThemedText>
        </Pressable>
        <Pressable onPress={() => navigation.goBack()} style={styles.backLink}>
          <ThemedText style={{ color: theme.primary }}>Go Back</ThemedText>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      {loading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : null}
      <WebView
        key={error ? "retry" : "initial"}
        source={{ uri: url }}
        style={styles.webview}
        onLoadEnd={() => setLoading(false)}
        onError={() => setError(true)}
        startInLoadingState={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  retryButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    marginTop: Spacing.xl,
  },
  backLink: {
    marginTop: Spacing.md,
    padding: Spacing.sm,
  },
});
