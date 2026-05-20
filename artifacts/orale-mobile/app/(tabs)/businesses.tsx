import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";
import React, { useState, useRef } from "react";
import {
  Animated,
  FlatList,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { cityGroups, CityGroup, Business } from "@/data/businesses";

function PressableCard({
  children,
  onPress,
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.98, useNativeDriver: true, speed: 60 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 60 }).start();
  };
  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[{ transform: [{ scale }] }, style]}>{children}</Animated.View>
    </Pressable>
  );
}

function BusinessCard({ biz }: { biz: Business }) {
  const colors = useColors();

  const handlePhone = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const url = `tel:${(biz.phone ?? "").replace(/\D/g, "")}`;
    Linking.openURL(url);
  };

  const handleWebsite = async () => {
    await Haptics.selectionAsync();
    if (biz.website) await WebBrowser.openBrowserAsync(biz.website);
  };

  return (
    <View style={[styles.bizCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {biz.badge && (
        <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
          <Text style={[styles.badgeText, { color: colors.secondaryForeground }]}>
            {biz.badge.toUpperCase()}
          </Text>
        </View>
      )}

      <Text style={[styles.bizName, { color: colors.foreground }]}>{biz.name}</Text>

      <Text style={[styles.bizDescEn, { color: colors.mutedForeground }]}>
        {biz.descriptionEn}
      </Text>
      {biz.descriptionEs && (
        <Text style={[styles.bizDescEs, { color: colors.mutedForeground }]}>
          {biz.descriptionEs}
        </Text>
      )}

      <View style={styles.actions}>
        {biz.phone && (
          <PressableCard
            onPress={handlePhone}
            style={[styles.actionBtn, { borderColor: colors.border }]}
          >
            <Ionicons name="call-outline" size={14} color={colors.secondary} />
            <Text style={[styles.actionBtnText, { color: colors.secondary }]}>{biz.phone}</Text>
          </PressableCard>
        )}
        {biz.website && (
          <PressableCard
            onPress={handleWebsite}
            style={[styles.actionBtn, { borderColor: colors.border }]}
          >
            <Ionicons name="globe-outline" size={14} color={colors.primary} />
            <Text style={[styles.actionBtnText, { color: colors.primary }]}>
              {biz.websiteLabel ?? "Visit Website"}
            </Text>
          </PressableCard>
        )}
      </View>
    </View>
  );
}

function CitySection({ group }: { group: CityGroup }) {
  const colors = useColors();
  return (
    <View style={styles.citySection}>
      <View style={[styles.citySeparator, { borderColor: colors.border }]}>
        <View style={[styles.cityLine, { backgroundColor: colors.border }]} />
        <Text style={[styles.cityName, { color: colors.foreground }]}>{group.city}</Text>
        <View style={[styles.cityLine, { backgroundColor: colors.border }]} />
      </View>
      {group.businesses.map((biz) => (
        <BusinessCard key={biz.id} biz={biz} />
      ))}
    </View>
  );
}

export default function BusinessesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const [selectedCity, setSelectedCity] = useState<string>("All");

  const cities = ["All", ...cityGroups.map((g) => g.city)];
  const filteredGroups =
    selectedCity === "All"
      ? cityGroups
      : cityGroups.filter((g) => g.city === selectedCity);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Fixed header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 16,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.headerLabel, { color: colors.mutedForeground }]}>
          ÓRALE BUSINESS CORNER
        </Text>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Business Corner</Text>

        {/* City filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}
          contentContainerStyle={styles.chipRow}
        >
          {cities.map((city) => {
            const active = selectedCity === city;
            return (
              <Pressable
                key={city}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedCity(city);
                }}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? colors.primary : colors.card,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: active ? "#fff" : colors.mutedForeground },
                  ]}
                >
                  {city}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Scrollable content */}
      <FlatList
        data={filteredGroups}
        keyExtractor={(item) => item.city}
        renderItem={({ item }) => <CitySection group={item} />}
        contentContainerStyle={{
          paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 100,
          paddingTop: 8,
        }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={() => (
          <View style={styles.disclaimer}>
            <Text style={[styles.disclaimerText, { color: colors.mutedForeground }]}>
              The businesses listed are independent entities and are not affiliates, partners, or
              subsidiaries of the Órale Network or OSA Media. Listings are provided for community
              visibility purposes only.
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 0,
    borderBottomWidth: 1,
  },
  headerLabel: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 2,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
    marginBottom: 14,
  },
  chipScroll: { marginHorizontal: -20 },
  chipRow: { paddingHorizontal: 20, gap: 8, paddingBottom: 12 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 100,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  citySection: { paddingHorizontal: 20, marginTop: 20 },
  citySeparator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
    borderColor: "transparent",
  },
  cityLine: { flex: 1, height: 1 },
  cityName: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  bizCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 2,
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1,
  },
  bizName: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  bizDescEn: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
    marginBottom: 4,
  },
  bizDescEs: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
    fontStyle: "italic",
    marginBottom: 12,
    opacity: 0.6,
  },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 100,
    borderWidth: 1,
  },
  actionBtnText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  disclaimer: {
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    lineHeight: 16,
    fontStyle: "italic",
    textAlign: "center",
    opacity: 0.5,
  },
});
