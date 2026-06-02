import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, ExternalLink, Loader2, X, CheckCircle2 } from "lucide-react";
import { getPublicBusinesses, submitBusinessListing, type Business } from "@/lib/adminApi";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
};

function toYouTubeEmbed(url: string): string {
  if (!url) return url;
  if (url.includes("/embed/")) return url;
  const watchMatch = url.match(/[?&]v=([^&#]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  const shortMatch = url.match(/youtu\.be\/([^?#]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  return url;
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const CITY_ORDER = ["San Antonio", "Austin", "Houston", "DFW", "Rio Grande Valley"];

// ---- Get Listed Modal ----

interface GetListedModalProps {
  onClose: () => void;
}

const EMPTY_FORM = {
  businessName: "",
  contactName: "",
  phone: "",
  email: "",
  city: "",
  websiteUrl: "",
  description: "",
};

function GetListedModal({ onClose }: GetListedModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

  function set(field: keyof typeof EMPTY_FORM) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await submitBusinessListing({
        businessName: form.businessName.trim(),
        contactName: form.contactName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        city: form.city,
        websiteUrl: form.websiteUrl.trim() || null,
        description: form.description.trim() || null,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full bg-[#1a1a1a] border border-white/10 text-white placeholder-white/30 px-4 py-3 rounded-sm text-sm focus:outline-none focus:border-primary/60 transition-colors";
  const labelClass = "block text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1.5";

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-lg bg-[#111] border border-white/10 rounded-sm shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/5">
          <div>
            <p className="text-xs font-mono text-secondary tracking-widest uppercase">Órale Business Corner</p>
            <h2 className="text-xl font-display text-white mt-0.5">Get Listed</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-white transition-colors p-1"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
          {success ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <CheckCircle2 size={48} className="text-green-400" />
              <h3 className="text-lg font-display text-white">Request Received!</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Thanks for your interest in the Órale Business Corner. We'll review your submission and be in touch soon.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-3 bg-primary text-primary-foreground font-bold font-display uppercase tracking-wider text-sm hover:bg-primary/90 transition-all rounded-sm"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Business Name *</label>
                  <input
                    type="text"
                    required
                    value={form.businessName}
                    onChange={set("businessName")}
                    placeholder="Your business name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={form.contactName}
                    onChange={set("contactName")}
                    placeholder="Your full name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>City *</label>
                  <select
                    required
                    value={form.city}
                    onChange={set("city")}
                    className={inputClass + " cursor-pointer"}
                  >
                    <option value="" disabled>Select city…</option>
                    {CITY_ORDER.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Phone *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder="(210) 555-0100"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={set("email")}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className={labelClass}>Website <span className="normal-case tracking-normal text-muted-foreground/50">(optional)</span></label>
                  <input
                    type="url"
                    value={form.websiteUrl}
                    onChange={set("websiteUrl")}
                    placeholder="https://yourbusiness.com"
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className={labelClass}>Brief Description <span className="normal-case tracking-normal text-muted-foreground/50">(optional)</span></label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={set("description")}
                    placeholder="Tell us a little about your business…"
                    className={inputClass + " resize-none"}
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-400 bg-red-950/30 border border-red-800/40 px-4 py-3 rounded-sm">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground font-bold font-display uppercase tracking-wider text-sm hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all rounded-sm border border-primary-border shadow-[0_0_20px_rgba(200,100,0,0.3)]"
              >
                {submitting ? (
                  <><Loader2 size={16} className="animate-spin" /> Submitting…</>
                ) : (
                  <>Submit Request</>
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ---- Business Cards ----

function BusinessCard({ b }: { b: Business }) {
  return (
    <motion.div
      variants={fadeInUp}
      className="bg-card border border-white/5 hover:border-primary/40 transition-colors rounded-sm overflow-hidden"
    >
      {b.imageUrl && (
        <div className="w-full aspect-video overflow-hidden bg-black">
          <img
            src={b.imageUrl}
            alt={b.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      <div className="p-8">
        {b.badge && (
          <div className="mb-4 inline-block px-3 py-1 bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider">
            {b.badge}
          </div>
        )}
        <h4 className="text-xl font-display text-white mb-4">{b.name}</h4>
        {b.description && (
          <p className="text-muted-foreground text-sm leading-relaxed mb-5">{b.description}</p>
        )}

        {b.youtubeUrl && (
          <div className="relative w-full mb-5" style={{ paddingTop: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full rounded-sm"
              src={toYouTubeEmbed(b.youtubeUrl)}
              title={`${b.name} video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        )}

        {b.commercialUrl && (
          <div className="relative w-full mb-5" style={{ paddingTop: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full rounded-sm"
              src={toYouTubeEmbed(b.commercialUrl)}
              title={`${b.name} commercial`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 mt-2">
          {b.phone && (
            <a
              href={`tel:${b.phone.replace(/\D/g, "")}`}
              className="inline-flex items-center gap-2 text-secondary font-bold text-sm hover:text-secondary/80 transition-colors"
            >
              <Phone size={14} /> {b.phone}
            </a>
          )}
          {b.websiteUrl && (
            <a
              href={b.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:text-primary/80 transition-colors uppercase tracking-wider"
            >
              {b.websiteLabel ?? "Visit Website"} <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ComingSoonCard() {
  return (
    <motion.div
      variants={fadeInUp}
      className="bg-card/40 border border-white/5 border-dashed p-8 rounded-sm flex items-center justify-center min-h-[140px]"
    >
      <p className="text-muted-foreground/50 italic text-sm text-center">New Business Coming Soon...</p>
    </motion.div>
  );
}

// ---- Page ----

export default function BusinessCorner() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    getPublicBusinesses()
      .then(setBusinesses)
      .catch(() => setError("Failed to load business listings."))
      .finally(() => setLoading(false));
  }, []);

  const cities = CITY_ORDER.map(city => ({
    name: city,
    items: businesses.filter(b => b.city === city),
  })).filter(c => c.items.length > 0);

  return (
    <div className="bg-background min-h-screen text-foreground overflow-x-hidden">

      {/* GET LISTED MODAL */}
      <AnimatePresence>
        {modalOpen && <GetListedModal onClose={() => setModalOpen(false)} />}
      </AnimatePresence>

      {/* HERO HEADER */}
      <section className="relative pt-32 pb-20 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/15 via-background to-background pointer-events-none" />
        <div className="container relative z-10 mx-auto px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.p variants={fadeInUp} className="text-sm font-mono text-secondary tracking-widest uppercase mb-4">
              Órale Business Corner
            </motion.p>
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-display text-white mb-8 leading-tight">
              Include Your Business in Our Órale Business Online Portal
            </motion.h1>
            <motion.button
              variants={fadeInUp}
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-bold font-display uppercase tracking-wider hover:bg-primary/90 transition-all active:scale-95 rounded-sm border border-primary-border shadow-[0_0_30px_rgba(200,100,0,0.4)]"
            >
              <Mail size={18} /> Get Listed
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* TAGLINE */}
      <section className="py-16 bg-card border-b border-white/5">
        <div className="container mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-display text-white mb-4">
              The Órale Business Corner,{" "}
              <span className="italic text-secondary">Making it Happen!</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your Vision. Our Strategy. Affordable Growth.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* CITY SECTIONS */}
      <div className="container mx-auto px-6 py-16 space-y-20">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={32} className="animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <p className="text-center text-muted-foreground py-24">{error}</p>
        ) : cities.length === 0 ? (
          <p className="text-center text-muted-foreground py-24">Business listings coming soon.</p>
        ) : cities.map(({ name, items }) => (
          <motion.section
            key={name}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-white/10" />
              <h3 className="text-2xl font-display text-white uppercase tracking-widest px-4">{name}</h3>
              <div className="h-px flex-1 bg-white/10" />
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map(b =>
                b.isComingSoon ? <ComingSoonCard key={b.id} /> : <BusinessCard key={b.id} b={b} />
              )}
            </div>
          </motion.section>
        ))}
      </div>

      {/* DISCLAIMER */}
      <section className="py-12 border-t border-white/5">
        <div className="container mx-auto px-6">
          <p className="text-xs text-muted-foreground/50 text-center max-w-3xl mx-auto italic">
            Disclaimer: The businesses listed in the Órale Business Corner are independent entities and are not affiliates, partners, or subsidiaries of the Órale Network or OSA Media. Listings are provided for community visibility purposes only.
          </p>
        </div>
      </section>
    </div>
  );
}
