import { Router } from "express";
import { db } from "@workspace/db";
import { businessesTable, insertBusinessSchema, updateBusinessSchema } from "@workspace/db/schema";
import { eq, asc } from "drizzle-orm";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Public: list active businesses
router.get("/businesses", async (req, res) => {
  try {
    const businesses = await db
      .select()
      .from(businessesTable)
      .where(eq(businessesTable.isActive, true))
      .orderBy(asc(businessesTable.city), asc(businessesTable.sortOrder), asc(businessesTable.createdAt));
    res.json(businesses);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch businesses" });
  }
});

// Admin: list all businesses
router.get("/admin/businesses", requireAuth, async (req, res) => {
  try {
    const businesses = await db
      .select()
      .from(businessesTable)
      .orderBy(asc(businessesTable.city), asc(businessesTable.sortOrder), asc(businessesTable.createdAt));
    res.json(businesses);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch businesses" });
  }
});

// Admin: create business
router.post("/admin/businesses", requireAuth, async (req, res) => {
  const parsed = insertBusinessSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    const [business] = await db.insert(businessesTable).values(parsed.data).returning();
    res.status(201).json(business);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to create business" });
  }
});

// Admin: update business
router.put("/admin/businesses/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const parsed = updateBusinessSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    const [business] = await db
      .update(businessesTable)
      .set(parsed.data)
      .where(eq(businessesTable.id, id))
      .returning();
    if (!business) { res.status(404).json({ error: "Not found" }); return; }
    res.json(business);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to update business" });
  }
});

// Admin: delete business
router.delete("/admin/businesses/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const [deleted] = await db
      .delete(businessesTable)
      .where(eq(businessesTable.id, id))
      .returning();
    if (!deleted) { res.status(404).json({ error: "Not found" }); return; }
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to delete business" });
  }
});

export default router;
