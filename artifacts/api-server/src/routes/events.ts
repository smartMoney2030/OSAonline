import { Router } from "express";
import { db } from "@workspace/db";
import { eventsTable, insertEventSchema, updateEventSchema } from "@workspace/db/schema";
import { eq, asc } from "drizzle-orm";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Public: get single active event by id
router.get("/events/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  try {
    const [event] = await db
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.id, id));
    if (!event || !event.isActive) {
      res.status(404).json({ error: "Event not found" });
      return;
    }
    res.json(event);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch event" });
  }
});

// Public: list active events
router.get("/events", async (req, res) => {
  try {
    const events = await db
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.isActive, true))
      .orderBy(asc(eventsTable.sortOrder), asc(eventsTable.createdAt));
    res.json(events);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Admin: list all events
router.get("/admin/events", requireAuth, async (req, res) => {
  try {
    const events = await db
      .select()
      .from(eventsTable)
      .orderBy(asc(eventsTable.sortOrder), asc(eventsTable.createdAt));
    res.json(events);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Admin: create event
router.post("/admin/events", requireAuth, async (req, res) => {
  const parsed = insertEventSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    const [event] = await db.insert(eventsTable).values(parsed.data).returning();
    res.status(201).json(event);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to create event" });
  }
});

// Admin: update event
router.put("/admin/events/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const parsed = updateEventSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    const [event] = await db
      .update(eventsTable)
      .set(parsed.data)
      .where(eq(eventsTable.id, id))
      .returning();
    if (!event) { res.status(404).json({ error: "Not found" }); return; }
    res.json(event);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to update event" });
  }
});

// Admin: delete event
router.delete("/admin/events/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const [deleted] = await db
      .delete(eventsTable)
      .where(eq(eventsTable.id, id))
      .returning();
    if (!deleted) { res.status(404).json({ error: "Not found" }); return; }
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

export default router;
