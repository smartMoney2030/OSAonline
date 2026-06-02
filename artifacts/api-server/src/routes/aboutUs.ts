import { Router } from "express";
import { db } from "@workspace/db";
import { siteSettingsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const KEY = "about_us";

const DEFAULT_CONTENT = {
  headline: "The Ecosystem Where",
  headlineItalic: "Businesses Scale.",
  intro1: "At Órale Network, we don't just help your business survive the market — we help you dominate it. Whether you're a startup launching your first product or an established enterprise ready to conquer new territory, we are your ultimate growth partner.",
  intro2: "\"Órale Network\" is more than just our name; it's our energy. It's an exclamation of action, approval, and momentum. We aren't your typical marketing agency — we are a full-throttle business ecosystem equipped with cutting-edge, in-house capabilities that most companies have to outsource at a premium.",
  mission: "If it helps your business succeed, we do it.",
  missionSub: "Ready to amplify your brand, stream your vision, and scale your profits?",
  services: [
    { num: "01", title: "In-House A.I. Techs", desc: "We don't just use technology; we build it. Our AI specialists integrate advanced automation, predictive analytics, and smart systems into your workflow to optimize operations and skyrocket your ROI." },
    { num: "02", title: "Streaming TV Station", desc: "Broadcast your brand to the masses. With our own streaming TV infrastructure, we produce and distribute high-impact visual media that puts your business on the screens of potential prospects." },
    { num: "03", title: "Streaming Radio Station", desc: "Own the airwaves. Our dedicated streaming audio platform gives your brand a voice — through targeted audio ads, custom podcasts, and engaging audio content." },
    { num: "04", title: "Elite Business Consulting", desc: "Strategy is nothing without execution. Our seasoned consultants deep-dive into your business model to streamline operations, maximize profitability, and map out a bulletproof roadmap to success." },
    { num: "05", title: "Powerful Referral Services", desc: "Connection is currency. We plug you into a robust, exclusive network of industry leaders, partners, and clients, opening doors that used to be locked." },
    { num: "06", title: "One Roof. Zero Middlemen.", desc: "By keeping our tech, media, and consulting entirely in-house, we offer unprecedented speed, seamless integration, and creative control that standard agencies simply can't match." },
  ],
};

router.get("/about-us", async (req, res) => {
  try {
    const [row] = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.key, KEY));
    if (!row) {
      res.json(DEFAULT_CONTENT);
      return;
    }
    res.json(JSON.parse(row.value));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch about us content" });
  }
});

router.put("/admin/about-us", requireAuth, async (req, res) => {
  try {
    const content = req.body;
    const value = JSON.stringify(content);
    const existing = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.key, KEY));
    if (existing.length > 0) {
      await db.update(siteSettingsTable).set({ value, updatedAt: new Date() }).where(eq(siteSettingsTable.key, KEY));
    } else {
      await db.insert(siteSettingsTable).values({ key: KEY, value });
    }
    res.json(content);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to update about us content" });
  }
});

export default router;
