import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const eventsTable = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull().default(""),
  dateStr: text("date_str").notNull().default(""),
  locationName: text("location_name").notNull().default(""),
  locationAddress: text("location_address").notNull().default(""),
  organizer: text("organizer").notNull().default(""),
  imageUrl: text("image_url").notNull().default(""),
  ticketUrl: text("ticket_url").notNull().default(""),
  status: text("status").notNull().default("on_sale"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEventSchema = createInsertSchema(eventsTable).omit({ id: true, createdAt: true });
export const updateEventSchema = insertEventSchema.partial();
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof eventsTable.$inferSelect;
