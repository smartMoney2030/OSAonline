import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const propertiesTable = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull().default("TX"),
  zipCode: text("zip_code"),
  price: text("price").notNull(),
  bedrooms: integer("bedrooms"),
  bathrooms: text("bathrooms"),
  sqft: integer("sqft"),
  lotSize: text("lot_size"),
  propertyType: text("property_type").notNull().default("House"),
  yearBuilt: integer("year_built"),
  garage: text("garage"),
  description: text("description").notNull().default(""),
  images: text("images").notNull().default("[]"),
  contactName: text("contact_name"),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),
  status: text("status").notNull().default("active"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPropertySchema = createInsertSchema(propertiesTable).omit({ id: true, createdAt: true });
export const updatePropertySchema = insertPropertySchema.partial();
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof propertiesTable.$inferSelect;
