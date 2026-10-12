import { Router } from "express";
import { db } from "@workspace/db";
import { eventsTable, propertiesTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

router.get("/sitemap.xml", async (req, res) => {
  try {
    const host =
      (req.headers["x-forwarded-host"] as string) ||
      req.headers.host ||
      "oralenetwork.com";
    const protocol =
      (req.headers["x-forwarded-proto"] as string)?.split(",")[0] || req.protocol || "https";
    const base = `${protocol}://${host}`;

    const [events, properties] = await Promise.all([
      db.select({ id: eventsTable.id }).from(eventsTable).where(eq(eventsTable.isActive, true)),
      db.select({ id: propertiesTable.id }).from(propertiesTable).where(eq(propertiesTable.isActive, true)),
    ]);

    const staticUrls = [
      { loc: `${base}/`, priority: "1.0", changefreq: "weekly" },
      { loc: `${base}/about-us`, priority: "0.8", changefreq: "monthly" },
      { loc: `${base}/events`, priority: "0.9", changefreq: "weekly" },
      { loc: `${base}/for-sale`, priority: "0.9", changefreq: "daily" },
      { loc: `${base}/business-corner`, priority: "0.8", changefreq: "weekly" },
      { loc: `${base}/paying-forward`, priority: "0.8", changefreq: "weekly" },
    ];

    const eventUrls = events.map((e) => ({
      loc: `${base}/events/${e.id}`,
      priority: "0.7",
      changefreq: "weekly",
    }));

    const propertyUrls = properties.map((p) => ({
      loc: `${base}/for-sale/${p.id}`,
      priority: "0.7",
      changefreq: "daily",
    }));

    const allUrls = [...staticUrls, ...eventUrls, ...propertyUrls];

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...allUrls.map(
        (u) =>
          `  <url>\n    <loc>${escapeXml(u.loc)}</loc>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
      ),
      "</urlset>",
    ].join("\n");

    res.set("Content-Type", "application/xml");
    res.set("Cache-Control", "public, max-age=3600");
    res.send(xml);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to generate sitemap" });
  }
});

export default router;
