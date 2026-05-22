import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useCommunity, CommunityPath } from "@/contexts/CommunityContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  getThemeColors,
  RECOVERY_PALETTE,
  Spacing,
  BorderRadius,
} from "@/constants/theme";

interface PanelProps {
  community: "AA" | "NA";
  title: string;
  subtitle: string;
  tagline: string;
  selected: boolean;
  onPress: () => void;
  isStacked: boolean;
}

function CommunityPanel({
  community,
  title,
  subtitle,
  tagline,
  selected,
  onPress,
  isStacked,
}: PanelProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const palette = getThemeColors(colorScheme ?? "light", community);
  const tint = palette.primary;
  const tintSoft = tint + (isDark ? "26" : "1A");

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.panel,
        isStacked ? styles.panelStacked : styles.panelSideBySide,
        {
          backgroundColor: tintSoft,
          borderColor: selected ? tint : "transparent",
          borderWidth: selected ? 3 : 0,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={[styles.panelInner, { paddingHorizontal: Spacing.xl }]}>
        <View style={[styles.panelIcon, { backgroundColor: tint }]}>
          <Feather name="heart" size={32} color="#FFFFFF" />
        </View>
        <ThemedText
          type="small"
          style={{ color: tint, fontWeight: "700", letterSpacing: 1.5 }}
        >
          {community}
        </ThemedText>
        <ThemedText
          type="h2"
          style={[styles.panelTitle, { color: palette.text }]}
        >
          {title}
        </ThemedText>
        <ThemedText
          type="small"
          style={{
            color: palette.textSecondary,
            textAlign: "center",
            marginTop: Spacing.xs,
          }}
        >
          {subtitle}
        </ThemedText>
        <ThemedText style={[styles.panelTagline, { color: palette.text }]}>
          "{tagline}"
        </ThemedText>
        <View style={[styles.panelCta, { backgroundColor: tint }]}>
          <ThemedText style={styles.panelCtaText}>
            {selected ? "Selected" : "Begin"}
          </ThemedText>
          {selected ? (
            <Feather name="check" size={16} color="#FFFFFF" />
          ) : (
            <Feather name="arrow-right" size={16} color="#FFFFFF" />
          )}
        </View>
      </View>
    </Pressable>
  );
}

export default function PathSelectionScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const palette = getThemeColors(colorScheme ?? "light", "AA");
  const { setPath } = useCommunity();
  const [selected, setSelected] = useState<CommunityPath | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isStacked = width < 760;

  const choose = (path: CommunityPath) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    setSelected(path);
  };

  const confirm = async () => {
    if (!selected || submitting) return;
    setSubmitting(true);
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => {},
      );
    }
    await setPath(selected);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: palette.backgroundRoot,
          paddingTop: insets.top + Spacing.xl,
          paddingBottom: insets.bottom + Spacing.lg,
        },
      ]}
    >
      <View style={styles.header}>
        <ThemedText
          type="h1"
          style={{ color: palette.text, textAlign: "center" }}
        >
          Choose Your Path
        </ThemedText>
        <ThemedText
          type="small"
          style={{
            color: palette.textSecondary,
            textAlign: "center",
            marginTop: Spacing.sm,
            paddingHorizontal: Spacing.xl,
          }}
        >
          Pick the fellowship that fits your recovery. You can change this
          anytime in Settings.
        </ThemedText>
      </View>

      <View
        style={[
          styles.panelsContainer,
          isStacked ? styles.panelsStacked : styles.panelsSideBySide,
        ]}
      >
        <CommunityPanel
          community="AA"
          title="Alcoholics Anonymous"
          subtitle="A fellowship for those recovering from alcohol"
          tagline="One day at a time"
          selected={selected === "AA"}
          onPress={() => choose("AA")}
          isStacked={isStacked}
        />

        <Pressable
          onPress={() => choose("Both")}
          style={({ pressed }) => [
            styles.bothButton,
            isStacked ? styles.bothButtonStacked : styles.bothButtonSide,
            {
              backgroundColor:
                selected === "Both" ? palette.text : palette.backgroundDefault,
              borderColor: selected === "Both" ? palette.text : palette.border,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Feather
            name="repeat"
            size={18}
            color={
              selected === "Both" ? palette.backgroundDefault : palette.text
            }
          />
          <ThemedText
            style={[
              styles.bothButtonText,
              {
                color:
                  selected === "Both"
                    ? palette.backgroundDefault
                    : palette.text,
              },
            ]}
          >
            Both
          </ThemedText>
        </Pressable>

        <CommunityPanel
          community="NA"
          title="Narcotics Anonymous"
          subtitle="A fellowship for those recovering from addiction"
          tagline="Just for today"
          selected={selected === "NA"}
          onPress={() => choose("NA")}
          isStacked={isStacked}
        />
      </View>

      <View style={[styles.footer, { paddingHorizontal: Spacing.xl }]}>
        <Pressable
          onPress={confirm}
          disabled={!selected || submitting}
          style={({ pressed }) => [
            styles.confirmButton,
            {
              backgroundColor: selected
                ? palette.text
                : palette.backgroundTertiary,
              opacity: !selected || submitting ? 0.6 : pressed ? 0.85 : 1,
            },
          ]}
        >
          <ThemedText
            style={[
              styles.confirmButtonText,
              {
                color: selected
                  ? palette.backgroundDefault
                  : palette.textSecondary,
              },
            ]}
          >
            {submitting
              ? "Setting up..."
              : selected
                ? `Continue with ${selected === "Both" ? "Both Fellowships" : selected}`
                : "Select a path to continue"}
          </ThemedText>
        </Pressable>
        <ThemedText
          type="small"
          style={{
            color: palette.textSecondary,
            textAlign: "center",
            marginTop: Spacing.md,
          }}
        >
          Choosing "Both" lets you switch between AA and NA views from any
          screen.
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  panelsContainer: {
    flex: 1,
    gap: Spacing.md,
  },
  panelsSideBySide: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  panelsStacked: {
    flexDirection: "column",
  },
  panel: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  panelSideBySide: {
    flex: 1,
    minHeight: 320,
  },
  panelStacked: {
    minHeight: 200,
  },
  panelInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xl,
    gap: Spacing.xs,
  },
  panelIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  panelTitle: {
    textAlign: "center",
    marginTop: Spacing.xs,
  },
  panelTagline: {
    textAlign: "center",
    fontStyle: "italic",
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  panelCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.lg,
  },
  panelCtaText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  bothButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
  },
  bothButtonSide: {
    alignSelf: "center",
  },
  bothButtonStacked: {
    alignSelf: "center",
    marginVertical: Spacing.xs,
  },
  bothButtonText: {
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 1,
  },
  footer: {
    paddingTop: Spacing.lg,
  },
  confirmButton: {
    width: "100%",
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.full,
    alignItems: "center",
  },
  confirmButtonText: {
    fontWeight: "700",
    fontSize: 16,
  },
});
