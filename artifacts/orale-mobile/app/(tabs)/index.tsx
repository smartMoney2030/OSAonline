import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Link } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useRef } from "react";
import {
  Animated,
  Image,
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
import { cityGroups } from "@/data/businesses";
import { events } from "@/data/events";

function StatBadge({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  const colors = useColors();
  return (
    <View style={[styles.statBadge, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {icon}
      <Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

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
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50 }).start();
  };
  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[{ transform: [{ scale }] }, style]}>{children}</Animated.View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const totalBusinesses = cityGroups.reduce((acc, g) => acc + g.businesses.length, 0);

  const openLink = async (url: string) => {
    await Haptics.selectionAsync();
    await WebBrowser.openBrowserAsync(url);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Header */}
      <View
        style={[
          styles.hero,
          { paddingTop: topPad + 24, borderBottomColor: colors.border },
        ]}
      >
        <View style={styles.heroGlow} pointerEvents="none" />
        <View style={styles.heroBadgeRow}>
          <View style={[styles.heroBadge, { borderColor: colors.border }]}>
            <Text style={[styles.heroBadgeText, { color: colors.secondary }]}>
              ÓRALE NETWORK
            </Text>
          </View>
        </View>
        <Text style={[styles.heroTitle, { color: colors.foreground }]}>
          The World-Wide{"\n"}Portal
        </Text>
        <Text style={[styles.heroSubtitle, { color: colors.mutedForeground }]}>
          Community advocacy · Business elevation · Multimedia streaming
        </Text>

        <View style={styles.heroActions}>
          <PressableCard
            onPress={() => openLink("https://www.roku.com/search#?q=orale")}
            style={[
              styles.heroPrimaryBtn,
              { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
          >
            <MaterialCommunityIcons name="television-play" size={18} color="#fff" />
            <Text style={styles.heroPrimaryBtnText}>WATCH ON ROKU</Text>
          </PressableCard>
          <PressableCard
            onPress={() => openLink("https://oraleonline.com")}
            style={[styles.heroSecondaryBtn, { borderColor: colors.border }]}
          >
            <Ionicons name="radio-outline" size={18} color={colors.foreground} />
            <Text style={[styles.heroSecondaryBtnText, { color: colors.foreground }]}>
              OSA RADIO
            </Text>
          </PressableCard>
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <StatBadge
          icon={<Ionicons name="business-outline" size={20} color={colors.primary} />}
          value={String(totalBusinesses)}
          label="Businesses"
        />
        <StatBadge
          icon={<Ionicons name="calendar-outline" size={20} color={colors.secondary} />}
          value={String(events.length)}
          label="Events"
        />
        <StatBadge
          icon={<Ionicons name="location-outline" size={20} color={colors.mutedForeground} />}
          value={String(cityGroups.length)}
          label="Cities"
        />
      </View>

      {/* Upcoming Event Highlight */}
      {events.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
              UPCOMING
            </Text>
            <Link href="/(tabs)/events" asChild>
              <Pressable>
                <Text style={[styles.sectionSeeAll, { color: colors.primary }]}>See all</Text>
              </Pressable>
            </Link>
          </View>
          <PressableCard
            onPress={() => openLink(events[0].ticketsUrl)}
            style={[styles.eventCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Image
              source={{ uri: events[0].posterUrl }}
              style={styles.eventPoster}
              resizeMode="cover"
            />
            <View style={styles.eventCardBody}>
              <View style={[styles.eventBadge, { backgroundColor: colors.secondary }]}>
                <Ionicons name="ticket-outline" size={11} color={colors.secondaryForeground} />
                <Text style={[styles.eventBadgeText, { color: colors.secondaryForeground }]}>
                  {events[0].badgeLabel.toUpperCase()}
                </Text>
              </View>
              <Text style={[styles.eventTitle, { color: colors.foreground }]}>
                {events[0].title}
              </Text>
              <View style={styles.eventMeta}>
                <Ionicons name="calendar-outline" size={13} color={colors.primary} />
                <Text style={[styles.eventMetaText, { color: colors.mutedForeground }]}>
                  {events[0].date}
                </Text>
              </View>
              <View style={styles.eventMeta}>
                <Ionicons name="location-outline" size={13} color={colors.primary} />
                <Text style={[styles.eventMetaText, { color: colors.mutedForeground }]}>
                  {events[0].venue} · {events[0].address}
                </Text>
              </View>
            </View>
          </PressableCard>
        </View>
      )}

      {/* Featured Businesses */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
            BUSINESS CORNER
          </Text>
          <Link href="/(tabs)/businesses" asChild>
            <Pressable>
              <Text style={[styles.sectionSeeAll, { color: colors.primary }]}>See all</Text>
            </Pressable>
          </Link>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          {cityGroups.slice(0, 1).flatMap((g) =>
            g.businesses.map((biz) => (
              <PressableCard
                key={biz.id}
                onPress={async () => {
                  await Haptics.selectionAsync();
                  if (biz.website) await WebBrowser.openBrowserAsync(biz.website);
                }}
                style={[
                  styles.bizCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                {biz.badge && (
                  <View style={[styles.bizBadge, { backgroundColor: colors.secondary }]}>
                    <Text style={[styles.bizBadgeText, { color: colors.secondaryForeground }]}>
                      {biz.badge.toUpperCase()}
                    </Text>
                  </View>
                )}
                <Text style={[styles.bizName, { color: colors.foreground }]} numberOfLines={2}>
                  {biz.name}
                </Text>
                <Text style={[styles.bizDesc, { color: colors.mutedForeground }]} numberOfLines={3}>
                  {biz.descriptionEn}
                </Text>
                {(biz.phone || biz.website) && (
                  <View style={styles.bizActions}>
                    {biz.phone && (
                      <View style={styles.bizAction}>
                        <Ionicons name="call-outline" size={12} color={colors.secondary} />
                        <Text style={[styles.bizActionText, { color: colors.secondary }]}>
                          {biz.phone}
                        </Text>
                      </View>
                    )}
                    {biz.website && (
                      <View style={styles.bizAction}>
                        <Ionicons name="open-outline" size={12} color={colors.primary} />
                        <Text style={[styles.bizActionText, { color: colors.primary }]}>
                          Website
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </PressableCard>
            ))
          )}
        </ScrollView>
      </View>

      {/* CTA */}
      <View style={styles.section}>
        <PressableCard
          onPress={() => openLink("mailto:info@oraleonline.com")}
          style={[styles.ctaCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <View style={[styles.ctaIconWrap, { backgroundColor: colors.primary + "22" }]}>
            <Ionicons name="add-circle-outline" size={28} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.ctaTitle, { color: colors.foreground }]}>
              List Your Business
            </Text>
            <Text style={[styles.ctaDesc, { color: colors.mutedForeground }]}>
              info@oraleonline.com
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
        </PressableCard>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    borderBottomWidth: 1,
    overflow: "hidden",
    position: "relative",
  },
  heroGlow: {
    position: "absolute",
    top: -60,
    left: -40,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(189,75,0,0.12)",
  },
  heroBadgeRow: { flexDirection: "row", marginBottom: 16 },
  heroBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 100,
  },
  heroBadgeText: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 2,
  },
  heroTitle: {
    fontSize: 40,
    fontFamily: "Inter_700Bold",
    letterSpacing: -1,
    lineHeight: 46,
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 21,
    marginBottom: 24,
  },
  heroActions: { flexDirection: "row", gap: 10 },
  heroPrimaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 4,
    borderWidth: 1,
  },
  heroPrimaryBtnText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    letterSpacing: 1,
  },
  heroSecondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 4,
    borderWidth: 1,
  },
  heroSecondaryBtnText: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 10,
  },
  statBadge: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  statValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    lineHeight: 24,
  },
  statLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1.5,
  },
  sectionSeeAll: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  eventCard: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden",
  },
  eventPoster: {
    width: "100%",
    height: 200,
  },
  eventCardBody: { padding: 16 },
  eventBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    marginBottom: 10,
  },
  eventBadgeText: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
  eventTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  eventMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  eventMetaText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  horizontalScroll: { paddingRight: 20, gap: 12 },
  bizCard: {
    width: 220,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  bizBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 2,
    marginBottom: 8,
  },
  bizBadgeText: {
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1,
  },
  bizName: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  bizDesc: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
    marginBottom: 10,
  },
  bizActions: { gap: 4 },
  bizAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  bizActionText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  ctaCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  ctaIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaTitle: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    marginBottom: 2,
  },
  ctaDesc: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
});
