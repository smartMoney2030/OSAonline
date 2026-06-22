import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bed, Bath, Square, MapPin, Phone, Mail, X, ChevronLeft, ChevronRight, Home, Calendar, Car, Maximize2 } from "lucide-react";
import { getPublicProperties, type Property } from "@/lib/adminApi";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

function parseImages(raw: string): string[] {
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

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

function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [idx, setIdx] = useState(0);
  if (images.length === 0) {
    return (
      <div className="w-full h-64 bg-zinc-800 flex items-center justify-center rounded-lg">
        <Home className="w-16 h-16 text-zinc-600" />
      </div>
    );
  }
  return (
    <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: "16/9" }}>
      <img src={images[idx]} alt={`${alt} photo ${idx + 1}`} className="w-full h-full object-cover" />
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

function PropertyDetailModal({ property, onClose }: { property: Property; onClose: () => void }) {
  const images = parseImages(property.images);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-zinc-900/95 backdrop-blur-sm border-b border-white/10 flex items-center justify-between px-6 py-4 z-10">
            <div>
              <h2 className="text-xl font-bold text-white">{property.title}</h2>
              <p className="text-sm text-zinc-400">{property.address}, {property.city}, {property.state} {property.zipCode}</p>
            </div>
            <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors p-1">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Gallery */}
            <ImageGallery images={images} alt={property.title} />

            {/* Price + Status */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <p className="text-3xl font-bold text-primary">{property.price}</p>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${STATUS_STYLE[property.status] ?? "bg-zinc-700 text-white"}`}>
                  {STATUS_LABEL[property.status] ?? property.status}
                </span>
                <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-zinc-800 text-zinc-300">
                  {property.propertyType}
                </span>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-3 text-sm">
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
              <div className="flex items-center gap-2 text-zinc-300">
                <MapPin className="w-4 h-4 text-zinc-500" />
                <span>{property.city}, {property.state}</span>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div>
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">Description</h3>
                <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>
            )}

            {/* Contact */}
            {(property.contactName || property.contactPhone || property.contactEmail) && (
              <div className="bg-zinc-800 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Contact Owner</h3>
                {property.contactName && (
                  <p className="text-white font-semibold mb-2">{property.contactName}</p>
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
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function PropertyCard({ property, onClick }: { property: Property; onClick: () => void }) {
  const images = parseImages(property.images);

  return (
    <motion.div
      variants={fadeInUp}
      className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 group"
      onClick={onClick}
    >
      {/* Photo */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
        {images.length > 0 ? (
          <img
            src={images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
            <Home className="w-12 h-12 text-zinc-600" />
          </div>
        )}
        {/* Status badge */}
        <div className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${STATUS_STYLE[property.status] ?? "bg-zinc-700 text-white"}`}>
          {STATUS_LABEL[property.status] ?? property.status}
        </div>
        {/* Photo count */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
            📷 {images.length}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-2xl font-bold text-primary mb-1">{property.price}</p>
        <p className="text-white font-semibold text-sm mb-1 truncate">{property.title}</p>
        <div className="flex items-center gap-1 text-zinc-400 text-xs mb-3">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{property.address}, {property.city}, {property.state}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-zinc-300 border-t border-white/10 pt-3">
          {property.bedrooms != null && (
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4 text-zinc-500" />
              <span>{property.bedrooms} bd</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4 text-zinc-500" />
              <span>{property.bathrooms} ba</span>
            </div>
          )}
          {property.sqft != null && (
            <div className="flex items-center gap-1">
              <Square className="w-4 h-4 text-zinc-500" />
              <span>{property.sqft.toLocaleString()} sqft</span>
            </div>
          )}
          <span className="ml-auto text-xs text-zinc-500">{property.propertyType}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function ForSale() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Property | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "pending" | "sold">("all");

  useEffect(() => {
    getPublicProperties()
      .then(setProperties)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? properties : properties.filter((p) => p.status === filter);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative pt-24 pb-16 px-6 bg-gradient-to-b from-zinc-900 to-black border-b border-white/10">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-3">Órale Network</p>
            <h1 className="text-5xl md:text-6xl font-black uppercase leading-none mb-4">
              FOR SALE<br />
              <span className="text-primary">BY OWNER</span>
            </h1>
            <p className="text-zinc-400 text-lg max-w-xl">
              From homes and land to cars and beyond — our community selling directly to each other, no middleman.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter bar */}
      <section className="border-b border-white/10 bg-zinc-950">
        <div className="container mx-auto max-w-6xl px-6 py-4 flex items-center gap-2 flex-wrap">
          {(["all", "active", "pending", "sold"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-colors ${
                filter === f ? "bg-primary text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {f === "all" ? "All Listings" : STATUS_LABEL[f]}
            </button>
          ))}
          <span className="ml-auto text-xs text-zinc-500">
            {filtered.length} {filtered.length === 1 ? "listing" : "listings"}
          </span>
        </div>
      </section>

      {/* Listings grid */}
      <section className="container mx-auto max-w-6xl px-6 py-12">
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="text-center py-24">
            <Home className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400 text-lg">No listings available right now.</p>
            <p className="text-zinc-600 text-sm mt-2">Check back soon for new properties.</p>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((p) => (
              <PropertyCard key={p.id} property={p} onClick={() => setSelected(p)} />
            ))}
          </motion.div>
        )}
      </section>

      {/* Detail Modal */}
      {selected && (
        <PropertyDetailModal property={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
