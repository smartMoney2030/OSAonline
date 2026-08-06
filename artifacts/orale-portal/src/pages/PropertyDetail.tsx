import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bed, Bath, Square, MapPin, Phone, Mail, ArrowLeft,
  Home, Calendar, Car, Maximize2, ChevronLeft, ChevronRight, Loader2,
} from "lucide-react";
import { Link, useParams } from "wouter";
import { getPublicPropertyById, type Property } from "@/lib/adminApi";
import { usePageMeta } from "@/hooks/usePageMeta";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const STATUS_STYLE: Record<string, string> = {
  active: "bg-green-600 text-white",
  pending: "bg-yellow-500 text-black",
  sold: "bg-red-600 text-white",
};

const STATUS_LABEL: Record<string, string> = {
  active: "For Sale",
  pending: "Pending",
  sold: "Sold",
};

function parseImages(raw: string): string[] {
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function SampleWatermark() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden select-none">
      <div
        className="absolute inset-0 flex flex-wrap content-center justify-center gap-x-6 gap-y-4 opacity-25"
        style={{ transform: "rotate(-30deg) scale(1.4)" }}
      >
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i} className="text-white font-black uppercase tracking-widest text-lg drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            Sample
          </span>
        ))}
      </div>
    </div>
  );
}

function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [idx, setIdx] = useState(0);
  if (images.length === 0) {
    return (
      <div className="w-full h-72 bg-zinc-800 flex items-center justify-center rounded-lg">
        <Home className="w-16 h-16 text-zinc-600" />
      </div>
    );
  }
  return (
    <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: "16/9" }}>
      <img src={images[idx]} alt={`${alt} photo ${idx + 1}`} className="w-full h-full object-cover" />
      <SampleWatermark />
      {images.length > 1 && (
        <>
          <button
            onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIdx((i) => (i + 1) % images.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === idx ? "bg-white" : "bg-white/40"}`}
              />
            ))}
          </div>
          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            {idx + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}

function PropertyStructuredData({ property, pageUrl, firstImage }: { property: Property; pageUrl: string; firstImage?: string }) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description ?? undefined,
    url: pageUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address,
      addressLocality: property.city,
      addressRegion: property.state,
      postalCode: property.zipCode ?? undefined,
    },
    price: property.price,
    image: firstImage ?? undefined,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function PropertyMeta({ property }: { property: Property }) {
  const pageUrl = window.location.href;
  const images = parseImages(property.images);
  const firstImage = images[0];

  const descParts = [
    `${property.price}`,
    property.bedrooms != null && `${property.bedrooms} bed`,
    property.bathrooms && `${property.bathrooms} bath`,
    property.sqft != null && `${property.sqft.toLocaleString()} sqft`,
    `${property.city}, ${property.state}`,
    property.propertyType,
  ].filter(Boolean);

  usePageMeta({
    title: property.title,
    description: `${descParts.join(" · ")}. ${property.description ? property.description.slice(0, 120) : "For sale by owner on Órale Network."}`,
    canonical: pageUrl,
    ogImage: firstImage,
  });

  return <PropertyStructuredData property={property} pageUrl={pageUrl} firstImage={firstImage} />;
}

export default function PropertyDetail() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id || isNaN(id)) { setNotFound(true); setLoading(false); return; }
    getPublicPropertyById(id)
      .then(setProperty)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-zinc-400" />
      </div>
    );
  }

  if (notFound || !property) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 text-center px-6">
        <p className="text-zinc-400 text-xl">Listing not found.</p>
        <Link href="/for-sale" className="text-primary hover:underline text-sm font-bold uppercase tracking-wider">
          ← Back to For Sale
        </Link>
      </div>
    );
  }

  const images = parseImages(property.images);

  return (
    <div className="min-h-screen bg-black text-white">
      <PropertyMeta property={property} />

      {/* Header */}
      <section className="pt-24 pb-10 px-6 bg-gradient-to-b from-zinc-900 to-black border-b border-white/10">
        <div className="container mx-auto max-w-4xl">
          <Link
            href="/for-sale"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-8 font-mono uppercase tracking-wider"
          >
            <ArrowLeft size={14} /> All Listings
          </Link>

          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-2">Órale Network — For Sale by Owner</p>
            <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-2">{property.title}</h1>
            <div className="flex items-center gap-2 text-zinc-400 text-sm">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>{property.address}, {property.city}, {property.state}{property.zipCode ? ` ${property.zipCode}` : ""}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Body */}
      <section className="container mx-auto max-w-4xl px-6 py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          className="space-y-8"
        >
          {/* Gallery */}
          <motion.div variants={fadeInUp}>
            <ImageGallery images={images} alt={property.title} />
          </motion.div>

          {/* Price + status */}
          <motion.div variants={fadeInUp} className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-3xl font-bold text-primary">{property.price}</p>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${STATUS_STYLE[property.status] ?? "bg-zinc-700 text-white"}`}>
                {STATUS_LABEL[property.status] ?? property.status}
              </span>
              <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-zinc-800 text-zinc-300">
                {property.propertyType}
              </span>
            </div>
          </motion.div>

          {/* Stats */}
          {(property.bedrooms != null || property.bathrooms || property.sqft != null || property.lotSize) && (
            <motion.div variants={fadeInUp} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {property.bedrooms != null && (
                <div className="bg-zinc-800 rounded-xl p-4 flex flex-col items-center gap-1">
                  <Bed className="w-5 h-5 text-primary" />
                  <span className="text-xl font-bold text-white">{property.bedrooms}</span>
                  <span className="text-xs text-zinc-400">Beds</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="bg-zinc-800 rounded-xl p-4 flex flex-col items-center gap-1">
                  <Bath className="w-5 h-5 text-primary" />
                  <span className="text-xl font-bold text-white">{property.bathrooms}</span>
                  <span className="text-xs text-zinc-400">Baths</span>
                </div>
              )}
              {property.sqft != null && (
                <div className="bg-zinc-800 rounded-xl p-4 flex flex-col items-center gap-1">
                  <Square className="w-5 h-5 text-primary" />
                  <span className="text-xl font-bold text-white">{property.sqft.toLocaleString()}</span>
                  <span className="text-xs text-zinc-400">Sq Ft</span>
                </div>
              )}
              {property.lotSize && (
                <div className="bg-zinc-800 rounded-xl p-4 flex flex-col items-center gap-1">
                  <Maximize2 className="w-5 h-5 text-primary" />
                  <span className="text-lg font-bold text-white">{property.lotSize}</span>
                  <span className="text-xs text-zinc-400">Lot Size</span>
                </div>
              )}
            </motion.div>
          )}

          {/* Extra details */}
          {(property.yearBuilt || property.garage) && (
            <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-3 text-sm">
              {property.yearBuilt && (
                <div className="flex items-center gap-2 text-zinc-300">
                  <Calendar className="w-4 h-4 text-zinc-500" />
                  <span>Built {property.yearBuilt}</span>
                </div>
              )}
              {property.garage && (
                <div className="flex items-center gap-2 text-zinc-300">
                  <Car className="w-4 h-4 text-zinc-500" />
                  <span>{property.garage} Garage</span>
                </div>
              )}
            </motion.div>
          )}

          {/* Description */}
          {property.description && (
            <motion.div variants={fadeInUp}>
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">Description</h2>
              <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">{property.description}</p>
            </motion.div>
          )}

          {/* Contact */}
          {(property.contactName || property.contactPhone || property.contactEmail) && (
            <motion.div variants={fadeInUp} className="bg-zinc-800 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Contact Owner</h2>
              {property.contactName && (
                <p className="text-white font-semibold mb-3">{property.contactName}</p>
              )}
              <div className="flex flex-wrap gap-3">
                {property.contactPhone && (
                  <a
                    href={`tel:${property.contactPhone}`}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {property.contactPhone}
                  </a>
                )}
                {property.contactEmail && (
                  <a
                    href={`mailto:${property.contactEmail}`}
                    className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    {property.contactEmail}
                  </a>
                )}
              </div>
            </motion.div>
          )}

          {/* Disclaimer */}
          <motion.div variants={fadeInUp} className="border-t border-zinc-800 pt-6">
            <p className="text-zinc-600 text-xs leading-relaxed">
              <span className="font-semibold text-zinc-500">Disclaimer:</span> This listing is independent and is not associated with Órale Network and/or their affiliates. Órale Network makes no representations or warranties regarding the accuracy, completeness, or reliability of this listing.
            </p>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
