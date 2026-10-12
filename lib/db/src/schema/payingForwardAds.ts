import { boolean, integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const payingForwardAdsTable = pgTable("paying_forward_ads", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageUrl: text("image_url").notNull(),
  linkUrl: text("link_url").notNull().default(""),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertPayingForwardAdSchema = createInsertSchema(payingForwardAdsTable).omit({ id: true });
export type PayingForwardAd = typeof payingForwardAdsTable.$inferSelect;
