import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
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
import { events, Event } from "@/data/events";

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
  const handlePressIn = () =>
    Animated.spring(scale, { toValue: 0.98, useNativeDriver: true, speed: 60 }).start();
  const handlePressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 60 }).start();
  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[{ transform: [{ scale }] }, style]}>{children}</Animated.View>
    </Pressable>
  );
}

function EventCard({ event }: { event: Event }) {
  const colors = useColors();

  const handleTickets = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await WebBrowser.openBrowserAsync(event.ticketsUrl);
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Poster */}
      <Image
        source={{ uri: event.posterUrl }}
        style={styles.poster}
        resizeMode="contain"
      />

      <View style={styles.cardBody}>
        {/* Badge */}
        <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
          <Ionicons name="ticket-outline" size={11} color={colors.secondaryForeground} />
          <Text style={[styles.badgeText, { color: colors.secondaryForeground }]}>
            {event.badgeLabel.toUpperCase()}
          </Text>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.foreground }]}>{event.title}</Text>
        <Text style={[styles.subtitle, { color: colors.secondary }]}>{event.subtitle}</Text>

        {/* Details grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>DATE</Text>
              <Text style={[styles.detailValue, { color: colors.foreground }]}>{event.date}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>LOCATION</Text>
              <Text style={[styles.detailValue, { color: colors.foreground }]}>
                {event.venue}
              </Text>
              <Text style={[styles.detailSub, { color: colors.mutedForeground }]}>
                {event.address}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.byTag}>
              <Text style={[styles.byTagText, { color: colors.primary }]}>BY</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>ORGANIZER</Text>
              <Text style={[styles.detailValue, { color: colors.foreground }]}>
                {event.organizer}
              </Text>
            </View>
          </View>
        </View>

        {/* CTA */}
        <PressableCard
          onPress={handleTickets}
          style={[styles.ticketBtn, { backgroundColor: colors.primary }]}
        >
          <Ionicons name="ticket-outline" size={18} color="#fff" />
          <Text style={styles.ticketBtnText}>GET TICKETS</Text>
          <Ionicons name="open-outline" size={16} color="rgba(255,255,255,0.7)" />
        </PressableCard>
      </View>
    </View>
  );
}

export default function EventsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: topPad + 24, borderBottomColor: colors.border },
        ]}
      >
        <View style={styles.headerGlow} pointerEvents="none" />
        <Text style={[styles.headerLabel, { color: colors.secondary }]}>
          COMMUNITY &amp; CULTURE
        </Text>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Upcoming Events</Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
          Join us for upcoming events!
        </Text>
      </View>

      {/* Events */}
      <View style={styles.eventsList}>
        {events.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No upcoming events
            </Text>
          </View>
        ) : (
          events.map((event) => <EventCard key={event.id} event={event} />)
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    borderBottomWidth: 1,
    position: "relative",
    overflow: "hidden",
  },
  headerGlow: {
    position: "absolute",
    top: -60,
    right: -40,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(231,176,8,0.08)",
  },
  headerLabel: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 2,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 38,
    fontFamily: "Inter_700Bold",
    letterSpacing: -1,
    marginBottom: 8,
  },
  headerSub: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  eventsList: { padding: 20, gap: 20 },
  card: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden",
  },
  poster: {
    width: "100%",
    height: 280,
    backgroundColor: "#000",
  },
  cardBody: { padding: 20 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 20,
  },
  detailsGrid: { gap: 14, marginBottom: 24 },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  detailLabel: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },
  detailSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 1,
  },
  byTag: {
    width: 16,
    height: 16,
    marginTop: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  byTagText: {
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
  ticketBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 4,
  },
  ticketBtnText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    letterSpacing: 1.5,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
});
