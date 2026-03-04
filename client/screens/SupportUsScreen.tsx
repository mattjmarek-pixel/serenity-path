import React, { useState } from "react";
import { View, StyleSheet, Pressable, Linking, ActivityIndicator, Alert, Platform, ScrollView, Share } from "react-native";
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
    Alert.alert(
      'Restore Purchases',
      'If you have an existing subscription, please contact support with your email address to restore your supporter status.',
      [{ text: 'OK' }]
    );
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:Mattjmarek@gmail.com?subject=Serenity%20Path%20Support');
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: Platform.OS === 'ios'
          ? 'Check out Serenity Path — a free recovery companion app with daily reflections, step work, and more.'
          : 'Check out Serenity Path — a free recovery companion app with daily reflections, step work, and more. https://serenitypath.app',
        url: 'https://serenitypath.app',
        title: 'Serenity Path',
      });
    } catch {
    }
  };

  const monthlyPrice = pricesData?.prices?.find(p => p.interval === 'month');
  const yearlyPrice = pricesData?.prices?.find(p => p.interval === 'year');

  const formatPrice = (unitAmount: number, interval: string) => {
    const amount = (unitAmount / 100).toFixed(2);
    return `$${amount} / ${interval}`;
  };

  const renderNativePaymentSection = () => (
    <View style={styles.buttonsSection}>
      <View style={[styles.nativeCard, { backgroundColor: theme.backgroundDefault, borderRadius: BorderRadius.lg }]}>
        <Feather name="heart" size={28} color={theme.success} style={styles.nativeCardIcon} />
        <ThemedText style={[styles.nativeCardTitle, { color: theme.text }]}>
          Always Free
        </ThemedText>
        <ThemedText style={[styles.nativeCardText, { color: theme.textSecondary }]}>
          Serenity Path is completely free and always will be. Every feature is available to everyone, with no paywalls or premium tiers.
        </ThemedText>
      </View>

      <View style={[styles.nativeCard, { backgroundColor: theme.backgroundDefault, borderRadius: BorderRadius.lg, marginTop: Spacing.md }]}>
        <Feather name="globe" size={28} color={theme.primary} style={styles.nativeCardIcon} />
        <ThemedText style={[styles.nativeCardTitle, { color: theme.text }]}>
          Want to Contribute?
        </ThemedText>
        <ThemedText style={[styles.nativeCardText, { color: theme.textSecondary }]}>
          Voluntary donations to help cover maintenance costs are available through the web version of the app. Your support is appreciated but never expected.
        </ThemedText>
        <Pressable
          style={[styles.primaryButton, { backgroundColor: theme.primary, marginTop: Spacing.lg }]}
          onPress={handleContactSupport}
        >
          <Feather name="mail" size={18} color="#FFFFFF" style={{ marginRight: Spacing.sm }} />
          <ThemedText style={styles.buttonText}>
            Contact Us
          </ThemedText>
        </Pressable>
      </View>

      <View style={[styles.nativeCard, { backgroundColor: theme.backgroundDefault, borderRadius: BorderRadius.lg, marginTop: Spacing.md }]}>
        <Feather name="share-2" size={28} color={theme.accent} style={styles.nativeCardIcon} />
        <ThemedText style={[styles.nativeCardTitle, { color: theme.text }]}>
          Spread the Word
        </ThemedText>
        <ThemedText style={[styles.nativeCardText, { color: theme.textSecondary }]}>
          The best way to support Serenity Path is to share it with someone who might benefit. Recovery is stronger together.
        </ThemedText>
        <Pressable
          style={[styles.shareButton, { backgroundColor: theme.backgroundSecondary, marginTop: Spacing.lg }]}
          onPress={handleShareApp}
        >
          <Feather name="share" size={18} color={theme.primary} style={{ marginRight: Spacing.sm }} />
          <ThemedText style={[styles.shareButtonText, { color: theme.primary }]}>
            Share the App
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

      {!isNativePlatform ? (
        <Pressable onPress={handleRestorePurchases} style={styles.restoreButton}>
          <ThemedText style={[styles.restoreText, { color: theme.primary }]}>
            Restore Purchases
          </ThemedText>
        </Pressable>
      ) : null}
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
  nativeCard: {
    width: "100%",
    padding: Spacing.xl,
    alignItems: "center",
  },
  nativeCardIcon: {
    marginBottom: Spacing.md,
  },
  nativeCardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  nativeCardText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
  },
  shareButton: {
    width: "100%",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    minHeight: 52,
  },
  shareButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },
  primaryButton: {
    width: "100%",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    marginBottom: Spacing.sm,
    minHeight: 52,
    justifyContent: "center",
    flexDirection: "row",
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
