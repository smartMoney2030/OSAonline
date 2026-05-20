import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const businessSubmissionsTable = pgTable("business_submissions", {
  id: serial("id").primaryKey(),
  businessName: text("business_name").notNull(),
  city: text("city").notNull(),
  contactName: text("contact_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  websiteUrl: text("website_url"),
  description: text("description"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBusinessSubmissionSchema = createInsertSchema(businessSubmissionsTable).omit({ id: true, createdAt: true, status: true });
export const updateBusinessSubmissionSchema = z.object({ status: z.enum(["pending", "approved", "rejected"]) });
export type InsertBusinessSubmission = z.infer<typeof insertBusinessSubmissionSchema>;
export type BusinessSubmission = typeof businessSubmissionsTable.$inferSelect;
