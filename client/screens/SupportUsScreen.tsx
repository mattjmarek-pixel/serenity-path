import React, { useState } from "react";
import { View, StyleSheet, Pressable, Linking, ActivityIndicator, Alert, Platform, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { useQuery, useMutation } from "@tanstack/react-query";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { apiRequest, getApiUrl } from "@/lib/query-client";

const PERSONAL_MESSAGE = `Friends,

I began developing this app out of a simple need, one many of us share, to have easy access to the tools and resources that help us stay sober, grounded, and connected. In my own recovery, having quick access to readings, reflections, and guidance made a real difference, not only in maintaining sobriety but also in finding a sense of peace and purpose in daily life.

This app was created so that anyone, anywhere, can have recovery resources readily available, free from ads or distractions. My hope is that it serves as a quiet companion in moments of strength, struggle, and reflection.

If you find value in using the app and choose to support its continued maintenance and improvement, that support is appreciated and entirely voluntary. The app will always remain free to use, and there is no expectation or obligation to contribute.

More than anything, I am grateful for the opportunity to share something that has been meaningful in my own recovery.

With gratitude,
Matt M.`;

interface StripePrice {
  id: string;
  unitAmount: number;
  currency: string;
  interval: string;
  productId: string;
  productName: string;
}

const isNativePlatform = Platform.OS === 'ios' || Platform.OS === 'android';

export default function SupportUsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);

  const { data: pricesData, isLoading: pricesLoading } = useQuery<{ prices: StripePrice[] }>({
    queryKey: ['/api/stripe/prices'],
    enabled: !isNativePlatform,
  });

  const checkoutMutation = useMutation({
    mutationFn: async (priceId: string) => {
      const response = await apiRequest('POST', '/api/stripe/create-checkout-session', { priceId });
      return response.json();
    },
    onSuccess: async (data: { url: string }) => {
      if (data.url) {
        if (Platform.OS === 'web') {
          window.location.href = data.url;
        } else {
          await WebBrowser.openBrowserAsync(data.url);
        }
      }
      setLoadingPriceId(null);
    },
    onError: (error: Error) => {
      setLoadingPriceId(null);
      Alert.alert('Error', 'Failed to start checkout. Please try again.');
    },
  });

  const handleSupport = (priceId: string) => {
    setLoadingPriceId(priceId);
    checkoutMutation.mutate(priceId);
  };

  const handleRestorePurchases = () => {
    if (isNativePlatform) {
      Alert.alert(
        'Coming Soon',
        'In-app purchases will be available in a future update. Thank you for your interest in supporting the app!',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Restore Purchases',
        'If you have an existing subscription, please contact support with your email address to restore your supporter status.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:Mattjmarek@gmail.com?subject=Serenity%20Path%20Support');
  };

  const monthlyPrice = pricesData?.prices?.find(p => p.interval === 'month');
  const yearlyPrice = pricesData?.prices?.find(p => p.interval === 'year');

  const formatPrice = (unitAmount: number, interval: string) => {
    const amount = (unitAmount / 100).toFixed(2);
    return `$${amount} / ${interval}`;
  };

  const renderNativePaymentSection = () => (
    <View style={styles.buttonsSection}>
      <View style={[styles.comingSoonCard, { borderColor: theme.primary, backgroundColor: theme.backgroundDefault }]}>
        <Feather name="smartphone" size={32} color={theme.primary} style={styles.comingSoonIcon} />
        <ThemedText style={[styles.comingSoonTitle, { color: theme.text }]}>
          In-App Purchases Coming Soon
        </ThemedText>
        <ThemedText style={[styles.comingSoonText, { color: theme.textSecondary }]}>
          We're working on bringing native in-app purchases to this platform. In the meantime, you can support us through the web version of the app.
        </ThemedText>
        <Pressable
          style={[styles.primaryButton, { backgroundColor: theme.primary, marginTop: Spacing.lg }]}
          onPress={handleContactSupport}
        >
          <ThemedText style={styles.buttonText}>
            Contact for Support Options
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );

  const renderWebPaymentSection = () => (
    <View style={styles.buttonsSection}>
      {pricesLoading ? (
        <ActivityIndicator size="large" color={theme.primary} style={{ marginVertical: Spacing.xl }} />
      ) : (
        <>
          <Pressable
            style={[
              styles.primaryButton, 
              { backgroundColor: theme.primary },
              loadingPriceId === monthlyPrice?.id && styles.buttonDisabled
            ]}
            onPress={() => monthlyPrice && handleSupport(monthlyPrice.id)}
            disabled={!monthlyPrice || loadingPriceId !== null}
          >
            {loadingPriceId === monthlyPrice?.id ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <ThemedText style={styles.buttonText}>
                {monthlyPrice ? formatPrice(monthlyPrice.unitAmount, 'month') : '$1.99 / month'}
              </ThemedText>
            )}
          </Pressable>

          <ThemedText style={[styles.orText, { color: theme.textSecondary }]}>
            or
          </ThemedText>

          <Pressable
            style={[
              styles.primaryButton, 
              { backgroundColor: theme.primary },
              loadingPriceId === yearlyPrice?.id && styles.buttonDisabled
            ]}
            onPress={() => yearlyPrice && handleSupport(yearlyPrice.id)}
            disabled={!yearlyPrice || loadingPriceId !== null}
          >
            {loadingPriceId === yearlyPrice?.id ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <ThemedText style={styles.buttonText}>
                {yearlyPrice ? formatPrice(yearlyPrice.unitAmount, 'year') : '$19.99 / year'}
              </ThemedText>
            )}
          </Pressable>
        </>
      )}
    </View>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={[
        styles.scrollContent,
        {
          paddingTop: headerHeight + Spacing.lg,
          paddingBottom: insets.bottom + Spacing.xl,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Feather
        name="heart"
        size={48}
        color={theme.primary}
        style={styles.icon}
      />

      <ThemedText style={styles.title}>Support Us</ThemedText>

      <View style={[styles.messageCard, { backgroundColor: theme.backgroundDefault }]}>
        <ThemedText style={[styles.messageText, { color: theme.text }]}>
          {PERSONAL_MESSAGE}
        </ThemedText>
      </View>

      {isNativePlatform ? renderNativePaymentSection() : renderWebPaymentSection()}

      <View style={styles.linksContainer}>
        <Pressable onPress={() => {
          const baseUrl = getApiUrl().replace('/api', '');
          Linking.openURL(`${baseUrl}/terms`);
        }}>
          <ThemedText style={[styles.linkText, { color: theme.primary }]}>
            Terms of Service
          </ThemedText>
        </Pressable>
        <ThemedText style={[styles.linkSeparator, { color: theme.textSecondary }]}>
          {" | "}
        </ThemedText>
        <Pressable onPress={() => {
          const baseUrl = getApiUrl().replace('/api', '');
          Linking.openURL(`${baseUrl}/privacy`);
        }}>
          <ThemedText style={[styles.linkText, { color: theme.primary }]}>
            Privacy Policy
          </ThemedText>
        </Pressable>
      </View>

      <Pressable onPress={handleRestorePurchases} style={styles.restoreButton}>
        <ThemedText style={[styles.restoreText, { color: theme.primary }]}>
          Restore Purchases
        </ThemedText>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
  },
  icon: {
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: Spacing.lg,
    textAlign: "center",
  },
  messageCard: {
    width: "100%",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 24,
    fontStyle: "italic",
  },
  buttonsSection: {
    width: "100%",
    alignItems: "center",
  },
  comingSoonCard: {
    width: "100%",
    padding: Spacing.xl,
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "dashed",
  },
  comingSoonIcon: {
    marginBottom: Spacing.md,
  },
  comingSoonTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  comingSoonText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
  },
  primaryButton: {
    width: "100%",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    marginBottom: Spacing.sm,
    minHeight: 52,
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  orText: {
    fontSize: 14,
    marginVertical: Spacing.sm,
  },
  linksContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.xl,
  },
  linkText: {
    fontSize: 14,
  },
  linkSeparator: {
    fontSize: 14,
  },
  restoreButton: {
    marginTop: Spacing.lg,
    padding: Spacing.sm,
  },
  restoreText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
