import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const businessesTable = pgTable("businesses", {
  id: serial("id").primaryKey(),
  city: text("city").notNull(),
  name: text("name").notNull(),
  badge: text("badge"),
  description: text("description").notNull().default(""),
  phone: text("phone"),
  websiteUrl: text("website_url"),
  websiteLabel: text("website_label"),
  youtubeUrl: text("youtube_url"),
  imageUrl: text("image_url"),
  commercialUrl: text("commercial_url"),
  isComingSoon: boolean("is_coming_soon").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBusinessSchema = createInsertSchema(businessesTable).omit({ id: true, createdAt: true });
export const updateBusinessSchema = insertBusinessSchema.partial();
export type InsertBusiness = z.infer<typeof insertBusinessSchema>;
export type Business = typeof businessesTable.$inferSelect;
