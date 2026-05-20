import { db } from "@workspace/db";
import { eventsTable, businessesTable } from "@workspace/db/schema";
import { count } from "drizzle-orm";

export async function seedIfEmpty() {
  const [{ value: eventCount }] = await db.select({ value: count() }).from(eventsTable);
  if (Number(eventCount) === 0) {
    await db.insert(eventsTable).values([
      {
        title: "Full Circle",
        subtitle: "The Mercedez Martinez Pro Wrestling Last Run Tour",
        dateStr: "May 30, 2026",
        locationName: "Texas Pride BBQ",
        locationAddress: "Adkin, Texas — San Antonio",
        organizer: "Nava Collective, LLC",
        imageUrl: "https://img1.wsimg.com/isteam/ip/e4a3c6f0-da92-42a7-82a9-a8cc93706dd9/IMG_1836.JPG",
        ticketUrl: "https://www.eventbrite.com/e/full-circle-the-mercedez-martinez-pro-wrestling-last-run-tour-tickets-1980051213481?aff=oddtdtcreator",
        status: "on_sale",
        isActive: true,
        sortOrder: 0,
      },
    ]);
  }

  const [{ value: bizCount }] = await db.select({ value: count() }).from(businessesTable);
  if (Number(bizCount) === 0) {
    await db.insert(businessesTable).values([
      // San Antonio
      { city: "San Antonio", name: "Dogwood Home Health Care, LLC", badge: null, description: "Compassionate, family-first home health care with over a decade of experience. Serving the San Antonio community with dignity, respect, and professional care.", phone: null, websiteUrl: null, websiteLabel: null, youtubeUrl: null, isComingSoon: false, isActive: true, sortOrder: 0 },
      { city: "San Antonio", name: "Coming Soon", isComingSoon: true, description: "", isActive: true, sortOrder: 1 },
      { city: "San Antonio", name: "Coming Soon", isComingSoon: true, description: "", isActive: true, sortOrder: 2 },
      // Austin
      { city: "Austin", name: "Coming Soon", isComingSoon: true, description: "", isActive: true, sortOrder: 0 },
      { city: "Austin", name: "Coming Soon", isComingSoon: true, description: "", isActive: true, sortOrder: 1 },
      { city: "Austin", name: "Coming Soon", isComingSoon: true, description: "", isActive: true, sortOrder: 2 },
      // Houston
      { city: "Houston", name: "Coming Soon", isComingSoon: true, description: "", isActive: true, sortOrder: 0 },
      { city: "Houston", name: "Coming Soon", isComingSoon: true, description: "", isActive: true, sortOrder: 1 },
      { city: "Houston", name: "Coming Soon", isComingSoon: true, description: "", isActive: true, sortOrder: 2 },
      // DFW
      { city: "DFW", name: "Robles Jr. Law", badge: "Veteran Backed", description: "Personal injury law firm serving Fort Worth, Dallas, and San Antonio. Fighting for the rights of injury victims with experience, dedication, and a veteran's commitment to service.", phone: null, websiteUrl: null, websiteLabel: null, youtubeUrl: "https://www.youtube.com/embed/gEBVDvfh4SE", isComingSoon: false, isActive: true, sortOrder: 0 },
      { city: "DFW", name: "Coming Soon", isComingSoon: true, description: "", isActive: true, sortOrder: 1 },
      { city: "DFW", name: "Coming Soon", isComingSoon: true, description: "", isActive: true, sortOrder: 2 },
      // Rio Grande Valley
      { city: "Rio Grande Valley", name: "Oasis Tax & Financial Services", badge: null, description: "Professional tax preparation and financial services for individuals and businesses across the Rio Grande Valley.", phone: null, websiteUrl: null, websiteLabel: null, youtubeUrl: null, isComingSoon: false, isActive: true, sortOrder: 0 },
      { city: "Rio Grande Valley", name: "Coming Soon", isComingSoon: true, description: "", isActive: true, sortOrder: 1 },
      { city: "Rio Grande Valley", name: "Coming Soon", isComingSoon: true, description: "", isActive: true, sortOrder: 2 },
    ]);
  }
}
