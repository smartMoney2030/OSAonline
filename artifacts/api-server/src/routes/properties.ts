import { Router } from "express";
import { db } from "@workspace/db";
import { propertiesTable, insertPropertySchema, updatePropertySchema } from "@workspace/db/schema";
import { eq, asc, desc } from "drizzle-orm";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Public: get single active property by id
router.get("/properties/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  try {
    const [property] = await db
      .select()
      .from(propertiesTable)
      .where(eq(propertiesTable.id, id));
    if (!property || !property.isActive) {
      res.status(404).json({ error: "Property not found" });
      return;
    }
    res.json(property);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch property" });
  }
});

// Public: list active properties
router.get("/properties", async (req, res) => {
  try {
    const properties = await db
      .select()
      .from(propertiesTable)
      .where(eq(propertiesTable.isActive, true))
      .orderBy(asc(propertiesTable.sortOrder), desc(propertiesTable.createdAt));
    res.json(properties);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch properties" });
  }
});

// Admin: list all properties
router.get("/admin/properties", requireAuth, async (req, res) => {
  try {
    const properties = await db
      .select()
      .from(propertiesTable)
      .orderBy(asc(propertiesTable.sortOrder), desc(propertiesTable.createdAt));
    res.json(properties);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch properties" });
  }
});

// Admin: create property
router.post("/admin/properties", requireAuth, async (req, res) => {
  const parsed = insertPropertySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    const [property] = await db.insert(propertiesTable).values(parsed.data).returning();
    res.status(201).json(property);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to create property" });
  }
});

// Admin: update property
router.put("/admin/properties/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const parsed = updatePropertySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    const [property] = await db
      .update(propertiesTable)
      .set(parsed.data)
      .where(eq(propertiesTable.id, id))
      .returning();
    if (!property) {
      res.status(404).json({ error: "Property not found" });
      return;
    }
    res.json(property);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to update property" });
  }
});

// Admin: delete property
router.delete("/admin/properties/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  try {
    await db.delete(propertiesTable).where(eq(propertiesTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to delete property" });
  }
});

export default router;
