import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const payingForwardApplicationsTable = pgTable("paying_forward_applications", {
  id: serial("id").primaryKey(),
  businessName: text("business_name").notNull(),
  ownerName: text("owner_name").notNull(),
  phone: text("phone").notNull(),
  hasWebsite: boolean("has_website").notNull(),
  websiteUrl: text("website_url").notNull().default(""),
  services: text("services").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  comments: text("comments").notNull().default(""),
  notificationSent: boolean("notification_sent").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPayingForwardApplicationSchema = createInsertSchema(payingForwardApplicationsTable)
  .omit({ id: true, createdAt: true, notificationSent: true });
export type PayingForwardApplication = typeof payingForwardApplicationsTable.$inferSelect;
