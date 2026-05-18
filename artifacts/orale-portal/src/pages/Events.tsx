import React from "react";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, ExternalLink, Ticket } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

export default function Events() {
  return (
    <div className="bg-background min-h-screen text-foreground overflow-x-hidden">

      {/* HEADER */}
      <section className="relative pt-32 pb-16 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/10 via-background to-background pointer-events-none" />
        <div className="container relative z-10 mx-auto px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.p variants={fadeInUp} className="text-sm font-mono text-secondary tracking-widest uppercase mb-4">
              Community & Culture
            </motion.p>
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl font-display text-white mb-4">
              Upcoming Events
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground">
              Join us for upcoming events!
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* EVENTS LIST */}
      <section className="container mx-auto px-6 py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto space-y-12"
        >

          {/* Full Circle Event Card */}
          <motion.div
            variants={fadeInUp}
            className="bg-card border border-white/5 hover:border-secondary/40 transition-colors rounded-sm overflow-hidden"
          >
            {/* Event Poster */}
            <div className="w-full bg-black flex items-center justify-center border-b border-white/5">
              <img
                src="https://img1.wsimg.com/isteam/ip/e4a3c6f0-da92-42a7-82a9-a8cc93706dd9/IMG_1836.JPG"
                alt="The Full Circle Event — Simply Lost Promotions × Nava Collective Live Pro Wrestling"
                className="w-full max-h-[560px] object-contain object-center"
                loading="lazy"
              />
            </div>

            {/* Event Details */}
            <div className="p-8 md:p-10">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider rounded-full">
                  <Ticket size={12} /> Tickets on sale now!
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-display text-white mb-2">
                The Full Circle Event
              </h2>
              <p className="text-secondary font-bold uppercase tracking-wider text-sm mb-6">
                A must be at event!
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-start gap-3">
                  <CalendarDays size={18} className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-0.5">Date</p>
                    <p className="text-white font-bold">May 30, 2026</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-0.5">Location</p>
                    <p className="text-white font-bold">Texas Pride BBQ</p>
                    <p className="text-muted-foreground text-sm">Adkin, Texas — San Antonio</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-[18px] h-[18px] shrink-0 mt-0.5 flex items-center justify-center">
                    <span className="text-primary font-bold text-xs">BY</span>
                  </div>
                  <div>
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-0.5">Organizer</p>
                    <p className="text-white font-bold">Nava Collective, LLC</p>
                  </div>
                </div>
              </div>

              <a
                href="https://www.eventbrite.com/e/full-circle-the-mercedez-martinez-pro-wrestling-last-run-tour-tickets-1980051213481?aff=oddtdtcreator"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-bold font-display uppercase tracking-wider hover:bg-primary/90 transition-all active:scale-95 rounded-sm border border-primary-border shadow-[0_0_20px_rgba(200,20,40,0.3)]"
              >
                Get Tickets <ExternalLink size={16} />
              </a>
            </div>
          </motion.div>

        </motion.div>
      </section>
    </div>
  );
}
