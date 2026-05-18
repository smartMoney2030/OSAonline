import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, ExternalLink } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

interface BusinessCardProps {
  name: string;
  description: React.ReactNode;
  link?: string;
  linkLabel?: string;
  phone?: string;
  youtubeEmbed?: string;
  badge?: string;
}

function BusinessCard({ name, description, link, linkLabel, phone, youtubeEmbed, badge }: BusinessCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className="bg-card border border-white/5 hover:border-primary/40 transition-colors p-8 rounded-sm"
    >
      {badge && (
        <div className="mb-4 inline-block px-3 py-1 bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider">
          {badge}
        </div>
      )}
      <h4 className="text-xl font-display text-white mb-4">{name}</h4>
      <div className="text-muted-foreground text-sm leading-relaxed mb-5">{description}</div>

      {youtubeEmbed && (
        <div className="relative w-full mb-5" style={{ paddingTop: "56.25%" }}>
          <iframe
            className="absolute inset-0 w-full h-full rounded-sm"
            src={youtubeEmbed}
            title={`${name} video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 mt-2">
        {phone && (
          <a
            href={`tel:${phone.replace(/\D/g, "")}`}
            className="inline-flex items-center gap-2 text-secondary font-bold text-sm hover:text-secondary/80 transition-colors"
          >
            <Phone size={14} /> {phone}
          </a>
        )}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:text-primary/80 transition-colors uppercase tracking-wider"
          >
            {linkLabel ?? "Visit Website"} <ExternalLink size={14} />
          </a>
        )}
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

const cities: { name: string; businesses: (BusinessCardProps | "coming-soon")[] }[] = [
  {
    name: "San Antonio",
    businesses: [
      {
        name: "Dogwood Home Health Care, LLC",
        badge: "Over A Decade of Care",
        description: (
          <>
            <p className="mb-2">
              Compassionate, bilingual home health care services you can trust. Serving families with dignity and respect.
            </p>
            <p className="text-white/50 italic">
              Atención médica domiciliaria compasiva y bilingüe que usted puede confiar. Sirviendo a familias con dignidad y respeto.
            </p>
          </>
        ),
        link: "https://www.dogwoodhomehealth.com",
        linkLabel: "dogwoodhomehealth.com"
      },
      {
        name: "Robles Jr. Law",
        badge: "Veteran Backed",
        description: (
          <>
            <p className="mb-2">
              Personal Injury Law Firm serving Fort Worth, Dallas, San Antonio and beyond. Fighting for the people who need it most.
            </p>
            <p className="text-white/50 italic">
              Firma de abogados de lesiones personales sirviendo Fort Worth, Dallas, San Antonio y más. Luchando por quienes más lo necesitan.
            </p>
          </>
        ),
        phone: "(726) 241-2523",
        youtubeEmbed: "https://www.youtube.com/embed/oMUy54r4o8o"
      },
      {
        name: "Oasis Tax & Financial Services",
        description: (
          <>
            <p className="mb-2">
              Professional tax preparation and financial services for individuals and small businesses. Ask for Carol Lopez.
            </p>
          </>
        ),
        phone: "(210) 683-7241"
      },
      "coming-soon"
    ]
  },
  {
    name: "Austin",
    businesses: [
      {
        name: "Robles Jr. Law",
        badge: "Veteran Backed",
        description: (
          <>
            <p className="mb-2">
              Personal Injury Law Firm serving Fort Worth, Dallas, San Antonio and beyond. Fighting for the people who need it most.
            </p>
            <p className="text-white/50 italic">
              Firma de abogados de lesiones personales sirviendo Fort Worth, Dallas, San Antonio y más. Luchando por quienes más lo necesitan.
            </p>
          </>
        ),
        phone: "(726) 241-2523",
        youtubeEmbed: "https://www.youtube.com/embed/oMUy54r4o8o"
      },
      "coming-soon",
      "coming-soon"
    ]
  },
  {
    name: "Houston",
    businesses: [
      {
        name: "Robles Jr. Law",
        badge: "Veteran Backed",
        description: (
          <>
            <p className="mb-2">
              Personal Injury Law Firm serving Fort Worth, Dallas, San Antonio and beyond. Fighting for the people who need it most.
            </p>
            <p className="text-white/50 italic">
              Firma de abogados de lesiones personales sirviendo Fort Worth, Dallas, San Antonio y más. Luchando por quienes más lo necesitan.
            </p>
          </>
        ),
        phone: "(726) 241-2523",
        youtubeEmbed: "https://www.youtube.com/embed/oMUy54r4o8o"
      },
      "coming-soon",
      "coming-soon"
    ]
  },
  {
    name: "DFW",
    businesses: [
      {
        name: "Robles Jr. Law",
        badge: "Veteran Backed",
        description: (
          <>
            <p className="mb-2">
              Personal Injury Law Firm serving Fort Worth, Dallas, San Antonio and beyond. Fighting for the people who need it most.
            </p>
            <p className="text-white/50 italic">
              Firma de abogados de lesiones personales sirviendo Fort Worth, Dallas, San Antonio y más. Luchando por quienes más lo necesitan.
            </p>
          </>
        ),
        phone: "(726) 241-2523",
        youtubeEmbed: "https://www.youtube.com/embed/oMUy54r4o8o"
      },
      "coming-soon",
      "coming-soon"
    ]
  },
  {
    name: "Rio Grande Valley",
    businesses: [
      {
        name: "Dogwood Home Health Care, LLC",
        badge: "Over A Decade of Care",
        description: (
          <>
            <p className="mb-2">
              Compassionate, bilingual home health care services you can trust. Serving families with dignity and respect.
            </p>
            <p className="text-white/50 italic">
              Atención médica domiciliaria compasiva y bilingüe que usted puede confiar. Sirviendo a familias con dignidad y respeto.
            </p>
          </>
        ),
        link: "https://www.dogwoodhomehealth.com",
        linkLabel: "dogwoodhomehealth.com"
      },
      {
        name: "Robles Jr. Law",
        badge: "Veteran Backed",
        description: (
          <>
            <p className="mb-2">
              Personal Injury Law Firm serving Fort Worth, Dallas, San Antonio and beyond. Fighting for the people who need it most.
            </p>
            <p className="text-white/50 italic">
              Firma de abogados de lesiones personales sirviendo Fort Worth, Dallas, San Antonio y más. Luchando por quienes más lo necesitan.
            </p>
          </>
        ),
        phone: "(726) 241-2523",
        youtubeEmbed: "https://www.youtube.com/embed/oMUy54r4o8o"
      },
      "coming-soon"
    ]
  }
];

export default function BusinessCorner() {
  return (
    <div className="bg-background min-h-screen text-foreground overflow-x-hidden">

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
            <motion.a
              variants={fadeInUp}
              href="mailto:info@oraleonline.com"
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-bold font-display uppercase tracking-wider hover:bg-primary/90 transition-all active:scale-95 rounded-sm border border-primary-border shadow-[0_0_30px_rgba(200,20,40,0.4)]"
            >
              <Mail size={18} /> Contact Us to Get Listed
            </motion.a>
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
        {cities.map((city) => (
          <motion.section
            key={city.name}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-white/10" />
              <h3 className="text-2xl font-display text-white uppercase tracking-widest px-4">{city.name}</h3>
              <div className="h-px flex-1 bg-white/10" />
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {city.businesses.map((biz, i) =>
                biz === "coming-soon" ? (
                  <ComingSoonCard key={i} />
                ) : (
                  <BusinessCard key={i} {...biz} />
                )
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
