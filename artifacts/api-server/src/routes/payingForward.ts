import { Router } from "express";
import rateLimit from "express-rate-limit";
import { and, asc, desc, eq } from "drizzle-orm";
import { db, payingForwardAdsTable, payingForwardApplicationsTable } from "@workspace/db";
import { CreatePayingForwardAdBody, SubmitPayingForwardApplicationBody } from "@workspace/api-zod";
import { requireAuth } from "../middleware/auth.js";
import { sendPayingForwardEmail } from "../lib/payingForwardEmail.js";

const router = Router();
const applicationLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many applications. Please try again in an hour." },
});

function websiteUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const normalized = /^[a-z][a-z0-9+.-]*:/i.test(trimmed)
    ? trimmed
    : `https://${trimmed.replace(/^\/\//, "")}`;
  const parsed = new URL(normalized);
  if (!["https:", "http:"].includes(parsed.protocol) || !parsed.hostname.includes(".") ||
      parsed.username || parsed.password) throw new Error("Enter a valid http or https website.");
  return parsed.href;
}

const applicationSchema = SubmitPayingForwardApplicationBody.transform(data => ({
  ...data,
  businessName: data.businessName.trim(), ownerName: data.ownerName.trim(),
  phone: data.phone.trim(), services: data.services.trim(), address: data.address.trim(),
  city: data.city.trim(), state: data.state.trim(), zipCode: data.zipCode.trim(),
  websiteUrl: data.hasWebsite ? data.websiteUrl.trim() : "", comments: data.comments.trim(),
})).refine(data => [data.businessName, data.ownerName, data.services, data.address, data.city, data.state].every(Boolean),
  "Please complete all required fields.")
  .refine(data => data.phone.replace(/\D/g, "").length >= 10, "Enter a valid contact number.")
  .refine(data => /^\d{5}(-\d{4})?$/.test(data.zipCode), "Enter a valid ZIP code.")
  .refine(data => !data.hasWebsite || Boolean(data.websiteUrl), "Please enter your website.");

const adSchema = CreatePayingForwardAdBody.refine(data => data.title.trim().length > 0, "Enter an ad title.")
  .refine(data => Number.isInteger(data.sortOrder), "Display order must be a whole number.")
  .refine(data => /^\/api\/storage\/objects\/[a-zA-Z0-9/_-]+$/.test(data.imageUrl),
    "Upload an advertisement image first.");

router.get("/paying-forward/ads", async (req, res) => {
  try {
    res.json(await db.select().from(payingForwardAdsTable).where(eq(payingForwardAdsTable.isActive, true))
      .orderBy(asc(payingForwardAdsTable.sortOrder), asc(payingForwardAdsTable.id)));
  } catch (err) {
    req.log.error({ err }, "Cannot load Paying Forward advertisements");
    res.status(500).json({ error: "Unable to load advertisements." });
  }
});

router.post("/paying-forward/applications", applicationLimit, async (req, res) => {
  const parsed = applicationSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid application." });
    return;
  }
  if (parsed.data.companyFax) {
    res.status(400).json({ error: "Unable to submit this application." });
    return;
  }
  let normalizedWebsite: string;
  try { normalizedWebsite = websiteUrl(parsed.data.websiteUrl); }
  catch { res.status(400).json({ error: "Enter a valid http or https website." }); return; }
  try {
    const { companyFax: _honeypot, ...input } = parsed.data;
    const [application] = await db.insert(payingForwardApplicationsTable)
      .values({ ...input, websiteUrl: normalizedWebsite }).returning();
    let notificationSent = false;
    try {
      await sendPayingForwardEmail(application);
      notificationSent = true;
      await db.update(payingForwardApplicationsTable).set({ notificationSent: true })
        .where(eq(payingForwardApplicationsTable.id, application.id));
    } catch (err) {
      req.log.error({ err, applicationId: application.id }, "Application saved; email notification pending");
    }
    res.status(201).json({ id: application.id, notificationSent });
  } catch (err) {
    req.log.error({ err }, "Cannot save Paying Forward application");
    res.status(500).json({ error: "Unable to save your application. Please try again." });
  }
});

router.get("/admin/paying-forward/ads", requireAuth, async (req, res) => {
  try {
    res.json(await db.select().from(payingForwardAdsTable)
      .orderBy(asc(payingForwardAdsTable.sortOrder), asc(payingForwardAdsTable.id)));
  } catch (err) {
    req.log.error({ err }, "Cannot load advertisements");
    res.status(500).json({ error: "Unable to load advertisements." });
  }
});

router.post("/admin/paying-forward/ads", requireAuth, async (req, res) => {
  const parsed = adSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.issues[0]?.message }); return; }
  let linkUrl: string;
  try { linkUrl = websiteUrl(parsed.data.linkUrl); }
  catch { res.status(400).json({ error: "Enter a valid ad destination website." }); return; }
  try {
    const [ad] = await db.insert(payingForwardAdsTable)
      .values({ ...parsed.data, title: parsed.data.title.trim(), linkUrl }).returning();
    res.status(201).json(ad);
  } catch (err) {
    req.log.error({ err }, "Cannot create advertisement");
    res.status(500).json({ error: "Unable to save advertisement." });
  }
});

router.put("/admin/paying-forward/ads/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const parsed = adSchema.safeParse(req.body);
  if (!Number.isSafeInteger(id) || id < 1 || !parsed.success) {
    res.status(400).json({ error: !parsed.success ? parsed.error.issues[0]?.message : "Invalid ad ID." }); return;
  }
  let linkUrl: string;
  try { linkUrl = websiteUrl(parsed.data.linkUrl); }
  catch { res.status(400).json({ error: "Enter a valid ad destination website." }); return; }
  try {
    const [ad] = await db.update(payingForwardAdsTable)
      .set({ ...parsed.data, title: parsed.data.title.trim(), linkUrl })
      .where(eq(payingForwardAdsTable.id, id)).returning();
    if (!ad) { res.status(404).json({ error: "Advertisement not found." }); return; }
    res.json(ad);
  } catch (err) {
    req.log.error({ err }, "Cannot update advertisement");
    res.status(500).json({ error: "Unable to update advertisement." });
  }
});

router.delete("/admin/paying-forward/ads/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) { res.status(400).json({ error: "Invalid ad ID." }); return; }
  try {
    const [deleted] = await db.delete(payingForwardAdsTable).where(eq(payingForwardAdsTable.id, id)).returning();
    if (!deleted) { res.status(404).json({ error: "Advertisement not found." }); return; }
    res.sendStatus(204);
  } catch (err) {
    req.log.error({ err }, "Cannot delete advertisement");
    res.status(500).json({ error: "Unable to delete advertisement." });
  }
});

router.get("/admin/paying-forward/applications", requireAuth, async (req, res) => {
  try {
    res.json(await db.select().from(payingForwardApplicationsTable).orderBy(desc(payingForwardApplicationsTable.createdAt)));
  } catch (err) {
    req.log.error({ err }, "Cannot load applications");
    res.status(500).json({ error: "Unable to load applications." });
  }
});

router.post("/admin/paying-forward/applications/:id/notify", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) { res.status(400).json({ error: "Invalid application ID." }); return; }
  // Lock the row until delivery completes so double clicks cannot send duplicate notifications.
  try {
    const result = await db.transaction(async tx => {
      const [application] = await tx.select().from(payingForwardApplicationsTable)
        .where(eq(payingForwardApplicationsTable.id, id)).for("update");
      if (!application) return "missing";
      if (application.notificationSent) return "sent";
      await sendPayingForwardEmail(application);
      await tx.update(payingForwardApplicationsTable).set({ notificationSent: true })
        .where(and(eq(payingForwardApplicationsTable.id, id), eq(payingForwardApplicationsTable.notificationSent, false)));
      return "sent";
    });
    if (result === "missing") { res.status(404).json({ error: "Application not found." }); return; }
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err, applicationId: id }, "Cannot send application notification");
    res.status(503).json({ error: "Email delivery is unavailable. Check the Gmail connection and try again." });
  }
});

export default router;
