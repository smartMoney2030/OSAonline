import { db } from "@workspace/db";
import { eventsTable, businessesTable, propertiesTable } from "@workspace/db/schema";
import { count } from "drizzle-orm";

const img = (...names: string[]) =>
  JSON.stringify(names.map((name) => `/samples/${name}.jpg`));

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

  const [{ value: propCount }] = await db.select({ value: count() }).from(propertiesTable);
  if (Number(propCount) === 0) {
    await db.insert(propertiesTable).values([
      {
        title: "Charming 3BR Family Home",
        address: "1420 Mission Ridge Dr", city: "San Antonio", state: "TX", zipCode: "78228",
        price: "$285,000", bedrooms: 3, bathrooms: "2", sqft: 1850, lotSize: "0.18 acres",
        propertyType: "House", yearBuilt: 2008, garage: "2-car",
        description: "Beautifully maintained single-story home in a quiet West Side neighborhood. Open floor plan with updated kitchen, granite countertops, and a spacious backyard perfect for family gatherings. Walking distance to schools and parks.",
        images: img("house"),
        contactName: "Maria Gonzalez", contactPhone: "(210) 555-0142", contactEmail: "maria.g@email.com",
        status: "active", isActive: true, sortOrder: 0,
      },
      {
        title: "10 Acres of Open Country Land",
        address: "FM 1604 & County Rd 381", city: "Adkins", state: "TX", zipCode: "78101",
        price: "$95,000", bedrooms: null, bathrooms: null, sqft: null, lotSize: "10 acres",
        propertyType: "Land", yearBuilt: null, garage: null,
        description: "Flat, cleared acreage with road frontage and electricity nearby. No restrictions — perfect for building your dream home, ranching, or recreational use. Beautiful Texas sunsets and wide open skies.",
        images: img("land"),
        contactName: "Robert Tijerina", contactPhone: "(210) 555-0188", contactEmail: "rtijerina@email.com",
        status: "active", isActive: true, sortOrder: 1,
      },
      {
        title: "2017 Mercedes-AMG GT S",
        address: "Near Loop 410", city: "San Antonio", state: "TX", zipCode: "78216",
        price: "$72,500", bedrooms: null, bathrooms: null, sqft: null, lotSize: null,
        propertyType: "Car", yearBuilt: 2017, garage: null,
        description: "Stunning AMG GT S in Solarbeam Yellow with 24,000 miles. 4.0L twin-turbo V8, carbon fiber trim, premium sound, and AMG performance package. Garage-kept, adult-owned, clean title. A true head-turner.",
        images: img("car"),
        contactName: "James Walker", contactPhone: "(210) 555-0199", contactEmail: "jwalker.tx@email.com",
        status: "active", isActive: true, sortOrder: 2,
      },
      {
        title: "Modern Downtown Condo",
        address: "215 Center St, Unit 4B", city: "Austin", state: "TX", zipCode: "78701",
        price: "$420,000", bedrooms: 2, bathrooms: "2", sqft: 1100, lotSize: null,
        propertyType: "Condo", yearBuilt: 2016, garage: "1 reserved space",
        description: "Sleek 2-bedroom condo in the heart of downtown. Floor-to-ceiling windows, stainless appliances, in-unit laundry. Building amenities include rooftop pool, gym, and 24/7 concierge. Steps from restaurants and nightlife.",
        images: img("condo"),
        contactName: "Ashley Chen", contactPhone: "(512) 555-0123", contactEmail: "ashley.chen@email.com",
        status: "pending", isActive: true, sortOrder: 3,
      },
      {
        title: "2021 Harley-Davidson Street Glide",
        address: "South Houston area", city: "Houston", state: "TX", zipCode: "77002",
        price: "$22,900", bedrooms: null, bathrooms: null, sqft: null, lotSize: null,
        propertyType: "Motorcycle", yearBuilt: 2021, garage: null,
        description: "Stunning Street Glide with only 8,400 miles. Vivid Black, Stage 2 upgrade, custom exhaust, and saddlebags. Always garage-kept and meticulously maintained. Title in hand.",
        images: img("motorcycle"),
        contactName: "Carlos Mendez", contactPhone: "(713) 555-0166", contactEmail: "cmendez.htx@email.com",
        status: "active", isActive: true, sortOrder: 4,
      },
      {
        title: "Spacious Townhome with Garage",
        address: "808 Oak Park Ln", city: "DFW", state: "TX", zipCode: "76104",
        price: "$245,000", bedrooms: 3, bathrooms: "2.5", sqft: 1650, lotSize: null,
        propertyType: "Townhouse", yearBuilt: 2014, garage: "2-car attached",
        description: "Move-in ready townhome in a gated community. Three bedrooms, two-and-a-half baths, with an open living area and private patio. Community pool and playground. Low-maintenance living near shopping and highways.",
        images: img("townhouse"),
        contactName: "Denise Robles", contactPhone: "(817) 555-0177", contactEmail: "denise.r@email.com",
        status: "active", isActive: true, sortOrder: 5,
      },
      {
        title: "2020 Class C Motorhome",
        address: "Off US-83", city: "Rio Grande Valley", state: "TX", zipCode: "78501",
        price: "$68,000", bedrooms: null, bathrooms: "1", sqft: null, lotSize: null,
        propertyType: "RV / Motorhome", yearBuilt: 2020, garage: null,
        description: "Family-ready Class C motorhome sleeps 6. Full kitchen, bathroom with shower, generator, solar prep, and backup camera. Only 18,000 miles. Perfect for weekend getaways or full-time travel.",
        images: img("rv"),
        contactName: "Frank Saldana", contactPhone: "(956) 555-0144", contactEmail: "fsaldana@email.com",
        status: "active", isActive: true, sortOrder: 6,
      },
      {
        title: "John Deere 5055E Tractor",
        address: "Rural FM 471", city: "San Antonio", state: "TX", zipCode: "78253",
        price: "$31,500", bedrooms: null, bathrooms: null, sqft: null, lotSize: null,
        propertyType: "Farm Equipment", yearBuilt: 2018, garage: null,
        description: "Reliable 55HP utility tractor with front loader. Only 420 hours, 4WD, recently serviced. Includes bucket attachment. Great for small ranch or property maintenance. Selling due to retirement.",
        images: img("tractor"),
        contactName: "Bill Hagen", contactPhone: "(210) 555-0155", contactEmail: "bhagen.ranch@email.com",
        status: "active", isActive: true, sortOrder: 7,
      },
      {
        title: "Cozy 2BR Starter Home",
        address: "512 Pecan St", city: "Austin", state: "TX", zipCode: "78702",
        price: "$315,000", bedrooms: 2, bathrooms: "1", sqft: 980, lotSize: "0.12 acres",
        propertyType: "House", yearBuilt: 1968, garage: "Carport",
        description: "Charming East Austin bungalow with original hardwood floors and tons of character. Updated electrical and plumbing. Big shade trees and a fenced yard. Incredible location — perfect first home or investment.",
        images: img("starter"),
        contactName: "Tomás Rivera", contactPhone: "(512) 555-0191", contactEmail: "trivera.atx@email.com",
        status: "sold", isActive: true, sortOrder: 8,
      },
      {
        title: "20ft Center Console Fishing Boat",
        address: "Near Clear Lake", city: "Houston", state: "TX", zipCode: "77058",
        price: "$34,000", bedrooms: null, bathrooms: null, sqft: null, lotSize: null,
        propertyType: "Boat", yearBuilt: 2017, garage: null,
        description: "2017 center console with 150HP Yamaha 4-stroke (low hours). Includes trailer, GPS/fish finder, livewell, and Bimini top. Saltwater ready and well cared for. Perfect for Gulf Coast fishing.",
        images: img("boat"),
        contactName: "Ricardo Flores", contactPhone: "(281) 555-0133", contactEmail: "rflores.boat@email.com",
        status: "active", isActive: true, sortOrder: 9,
      },
    ]);
  }
}
