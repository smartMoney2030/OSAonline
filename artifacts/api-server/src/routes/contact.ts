import { Router } from "express";
import { db } from "@workspace/db";
import { contactSubmissionsTable, insertContactSubmissionSchema } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "../middleware/auth.js";
import { sendContactNotification } from "../lib/email.js";

const router = Router();

router.post("/contact", async (req, res) => {
  const parsed = insertContactSubmissionSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    const [submission] = await db.insert(contactSubmissionsTable).values(parsed.data).returning();
    sendContactNotification({ name: parsed.data.name, email: parsed.data.email, message: parsed.data.message ?? "" }).catch((err: unknown) => req.log.error(err));
    res.status(201).json({ success: true, id: submission.id });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to save submission" });
  }
});

router.get("/admin/contact-submissions", requireAuth, async (req, res) => {
  try {
    const submissions = await db
      .select()
      .from(contactSubmissionsTable)
      .orderBy(desc(contactSubmissionsTable.createdAt));
    res.json(submissions);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

router.delete("/admin/contact-submissions/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const [deleted] = await db
      .delete(contactSubmissionsTable)
      .where(eq(contactSubmissionsTable.id, id))
      .returning();
    if (!deleted) { res.status(404).json({ error: "Not found" }); return; }
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to delete submission" });
  }
});

export default router;
