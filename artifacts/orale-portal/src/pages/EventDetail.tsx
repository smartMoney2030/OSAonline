import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, ExternalLink, Ticket, ArrowLeft, Loader2 } from "lucide-react";
import { Link, useParams } from "wouter";
import { getPublicEventById, type Event } from "@/lib/adminApi";
import { usePageMeta } from "@/hooks/usePageMeta";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

function EventStructuredData({ event, pageUrl }: { event: Event; pageUrl: string }) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.subtitle ?? undefined,
    url: pageUrl,
    organizer: event.organizer
      ? { "@type": "Organization", name: event.organizer }
      : undefined,
    location: event.locationName
      ? {
          "@type": "Place",
          name: event.locationName,
          address: event.locationAddress ?? undefined,
        }
      : undefined,
    image: event.imageUrl ?? undefined,
    offers: event.ticketUrl
      ? {
          "@type": "Offer",
          url: event.ticketUrl,
          availability:
            event.status === "sold_out"
              ? "https://schema.org/SoldOut"
              : "https://schema.org/InStock",
        }
      : undefined,
    eventStatus:
      event.status === "sold_out"
        ? "https://schema.org/EventSoldOut"
        : "https://schema.org/EventScheduled",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function EventMeta({ event }: { event: Event }) {
  const pageUrl = window.location.href;
  const description = [
    event.subtitle,
    event.dateStr && `Date: ${event.dateStr}`,
    event.locationName && `At ${event.locationName}`,
    event.organizer && `Presented by ${event.organizer}`,
  ]
    .filter(Boolean)
    .join(" · ");

  usePageMeta({
    title: event.title,
    description: description || `Join us for ${event.title} — an Órale Network community event.`,
    canonical: pageUrl,
    ogImage: event.imageUrl || undefined,
  });

  return <EventStructuredData event={event} pageUrl={pageUrl} />;
}

export default function EventDetail() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id || isNaN(id)) { setNotFound(true); setLoading(false); return; }
    getPublicEventById(id)
      .then(setEvent)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notFound || !event) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-center px-6">
        <p className="text-muted-foreground text-xl">Event not found.</p>
        <Link href="/events" className="text-primary hover:underline text-sm font-bold uppercase tracking-wider">
          ← Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen text-foreground overflow-x-hidden">
      <EventMeta event={event} />

      {/* Back link + hero header */}
      <section className="relative pt-32 pb-12 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/10 via-background to-background pointer-events-none" />
        <div className="container relative z-10 mx-auto px-6">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors mb-8 font-mono uppercase tracking-wider"
          >
            <ArrowLeft size={14} /> All Events
          </Link>

          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <p className="text-sm font-mono text-secondary tracking-widest uppercase mb-3">
              Community &amp; Culture
            </p>
            <h1 className="text-4xl md:text-5xl font-display text-white mb-3 leading-tight">
              {event.title}
            </h1>
            {event.subtitle && (
              <p className="text-secondary font-bold uppercase tracking-wider text-sm">
                {event.subtitle}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-6 py-16 max-w-4xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="space-y-10"
        >
          {/* Poster image */}
          {event.imageUrl && (
            <motion.div variants={fadeInUp} className="w-full bg-black border border-white/5 rounded-sm overflow-hidden">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full max-h-[640px] object-contain object-center mx-auto"
              />
            </motion.div>
          )}

          {/* Status badge */}
          <motion.div variants={fadeInUp} className="flex flex-wrap gap-3 items-center">
            {event.status === "on_sale" && (
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider rounded-full">
                <Ticket size={12} /> Tickets on Sale Now!
              </span>
            )}
            {event.status === "sold_out" && (
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-900/40 text-red-400 text-xs font-bold uppercase tracking-wider rounded-full">
                Sold Out
              </span>
            )}
          </motion.div>

          {/* Details grid */}
          <motion.div variants={fadeInUp} className="grid sm:grid-cols-2 gap-6 p-8 bg-card border border-white/5 rounded-sm">
            {event.dateStr && (
              <div className="flex items-start gap-3">
                <CalendarDays size={18} className="text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-0.5">Date</p>
                  <p className="text-white font-bold">{event.dateStr}</p>
                </div>
              </div>
            )}
            {event.locationName && (
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-0.5">Location</p>
                  <p className="text-white font-bold">{event.locationName}</p>
                  {event.locationAddress && (
                    <p className="text-muted-foreground text-sm">{event.locationAddress}</p>
                  )}
                </div>
              </div>
            )}
            {event.organizer && (
              <div className="flex items-start gap-3">
                <div className="w-[18px] h-[18px] shrink-0 mt-0.5 flex items-center justify-center">
                  <span className="text-primary font-bold text-xs">BY</span>
                </div>
                <div>
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-0.5">Organizer</p>
                  <p className="text-white font-bold">{event.organizer}</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* CTA */}
          {event.ticketUrl && (
            <motion.div variants={fadeInUp}>
              <a
                href={event.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-bold font-display uppercase tracking-wider hover:bg-primary/90 transition-all active:scale-95 rounded-sm border border-primary-border shadow-[0_0_20px_rgba(200,100,0,0.3)]"
              >
                Get Tickets <ExternalLink size={16} />
              </a>
            </motion.div>
          )}
        </motion.div>
      </section>
    </div>
  );
}
