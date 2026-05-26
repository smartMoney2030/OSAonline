import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { db } from "@workspace/db";
import { businessSubmissionsTable, insertBusinessSubmissionSchema, updateBusinessSubmissionSchema } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "../middleware/auth.js";
import { sendBusinessSubmissionNotification } from "../lib/email.js";

const router = Router();

const submitLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many listing requests from this IP — please wait a few minutes and try again." },
});

// Public: submit a business listing request
router.post("/businesses/submit", submitLimiter, async (req, res) => {
  const parsed = insertBusinessSubmissionSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    const [submission] = await db
      .insert(businessSubmissionsTable)
      .values(parsed.data)
      .returning();
    sendBusinessSubmissionNotification(parsed.data).catch((err: unknown) => req.log.error(err));
    res.status(201).json(submission);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to save submission" });
  }
});

// Admin: list all submissions
router.get("/admin/business-submissions", requireAuth, async (req, res) => {
  try {
    const submissions = await db
      .select()
      .from(businessSubmissionsTable)
      .orderBy(desc(businessSubmissionsTable.createdAt));
    res.json(submissions);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

// Admin: update submission status
router.put("/admin/business-submissions/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const parsed = updateBusinessSubmissionSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    const [submission] = await db
      .update(businessSubmissionsTable)
      .set(parsed.data)
      .where(eq(businessSubmissionsTable.id, id))
      .returning();
    if (!submission) { res.status(404).json({ error: "Not found" }); return; }
    res.json(submission);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to update submission" });
  }
});

export default router;
