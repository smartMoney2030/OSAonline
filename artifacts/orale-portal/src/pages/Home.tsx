import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Radio, MonitorPlay } from "lucide-react";
import { Link } from "wouter";
import heroBg from "@/assets/images/hero.png";
import mediaBg from "@/assets/images/media-bg.png";
import roblesLaw from "@/assets/images/robles-law.png";
import dogwoodHealth from "@/assets/images/dogwood-health.png";
import ContactModal from "@/components/ContactModal";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

export default function Home() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="bg-background min-h-screen text-foreground overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[100dvh] flex items-center pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background z-10" />
          <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-10" />
          <img src={heroBg} alt="Cinematic Studio" className="w-full h-full object-cover object-center opacity-60" />
        </div>
        
        <div className="container relative z-20 mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-4xl"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <img
                src="/orale-logo.png"
                alt="Órale Network"
                className="w-72 md:w-96 object-contain"
              />
            </motion.div>
            
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-muted-foreground font-sans max-w-2xl mb-12 leading-relaxed">
              Where elite strategy meets global reach. Empower your brand through premier, cost-effective business consulting and cutting-edge in-house multimedia streaming TV and Radio designed to champion your community and scale your business to a whole new profitable level!
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-6">
              <a
                href="https://www.youtube.com/@Oralenetwork"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-primary text-primary-foreground font-bold font-display uppercase tracking-wider hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-3 rounded-sm border border-primary-border shadow-[0_0_30px_rgba(200,20,40,0.4)]"
              >
                World-Wide Custom YouTube Channel <Play size={18} fill="currentColor" />
              </a>
              <button
                onClick={() => setContactOpen(true)}
                className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold font-display uppercase tracking-wider hover:bg-white/5 transition-all active:scale-95 rounded-sm"
              >
                Elevate Your Brand
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. MEDIA PRESENCE */}
      <section className="py-24 relative border-t border-white/5">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <img src={mediaBg} alt="Media Abstract" className="w-full h-full object-cover mix-blend-screen" />
        </div>
        
        <div className="container relative z-10 mx-auto px-6">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="flex flex-col md:flex-row gap-16 items-start"
          >
            <div className="w-full md:w-1/3">
              <motion.h2 variants={fadeInUp} className="text-sm font-mono text-secondary tracking-widest uppercase mb-4">Our Reach</motion.h2>
              <motion.h3 variants={fadeInUp} className="text-4xl md:text-5xl font-display text-white mb-6">Omnipresent<br/>Influence.</motion.h3>
              <motion.p variants={fadeInUp} className="text-muted-foreground text-lg mb-8">
                From the local airwaves of San Antonio to global Roku streaming platforms. We amplify voices that demand to be heard.
              </motion.p>
            </div>
            
            <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "ROKU TV", desc: "Global streaming access bringing San Antonio soul to the world.", icon: <MonitorPlay size={32} className="text-primary" />, href: null },
                { title: "Órale TV Shows", desc: "Original programming, authentic stories, zero compromises.", icon: <Play size={32} className="text-secondary" />, href: null },
                { title: "OSA Radio Station", desc: "The heartbeat of the streets. Raw, unfiltered, always on.", icon: <Radio size={32} className="text-white" />, href: "https://osaradio.com/" }
              ].map((item, i) => (
                <motion.div key={i} variants={fadeInUp}
                  className={`p-8 bg-card border border-white/5 hover:border-primary/50 transition-colors group${item.href ? " cursor-pointer" : ""}`}
                  onClick={item.href ? () => window.open(item.href!, "_blank", "noopener,noreferrer") : undefined}
                >
                  <div className="mb-6">{item.icon}</div>
                  <h4 className="text-2xl font-display text-white mb-3 group-hover:text-secondary transition-colors">{item.title}</h4>
                  <p className="text-muted-foreground">{item.desc}</p>
                  {item.href && <p className="text-primary text-xs font-mono uppercase tracking-widest mt-4">Listen Live →</p>}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. VIP PLATINUM SPONSORS */}
      <section className="py-24 bg-card relative">
        <div className="container mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-sm font-mono text-secondary tracking-widest uppercase mb-4">Platinum Partners</h2>
            <h3 className="text-4xl md:text-5xl font-display text-white">The Titans Behind<br/>The Vision</h3>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Sponsor 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="group relative overflow-hidden bg-background border border-white/5 rounded-sm"
            >
              <div className="aspect-[4/3] w-full relative">
                <img src={roblesLaw} alt="Robles Jr. Law" className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <div className="mb-4 inline-block px-3 py-1 bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider">Veteran Backed</div>
                  <h4 className="text-3xl font-display text-white mb-2">Robles Jr. Law</h4>
                  <p className="text-white/70 font-sans mb-4">Personal Injury Law Firm serving Fort Worth, Dallas, and San Antonio.</p>
                  <Link href="/business-corner" className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary/80 transition-colors uppercase text-sm tracking-wider">
                    Learn More <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Sponsor 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
              className="group relative overflow-hidden bg-background border border-white/5 rounded-sm"
            >
              <div className="aspect-[4/3] w-full relative">
                <img src={dogwoodHealth} alt="Dogwood Home Health Care" className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <div className="mb-4 inline-block px-3 py-1 bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider">Over A Decade of Care</div>
                  <h4 className="text-3xl font-display text-white mb-2">Dogwood Home Health</h4>
                  <p className="text-white/70 font-sans mb-4">Compassionate, family-first home health provider you can trust.</p>
                  <Link href="/business-corner" className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary/80 transition-colors uppercase text-sm tracking-wider">
                    Learn More <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. SERVICES */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="max-w-2xl">
              <h2 className="text-sm font-mono text-secondary tracking-widest uppercase mb-4">Consulting & Marketing</h2>
              <h3 className="text-4xl md:text-5xl font-display text-white">Elite Strategy.<br/>Street Credibility.</h3>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <p className="text-muted-foreground text-lg max-w-md">We don't just stream culture. We build the businesses behind it. Full-stack marketing and consulting that delivers results, not just promises.</p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-white/10 p-px">
            {[
              { title: "Brand Strategy", desc: "Defining your core narrative and market positioning." },
              { title: "Digital Campaigns", desc: "Data-driven advertising that cuts through the noise." },
              { title: "Media Production", desc: "High-end commercial video and audio production." }
            ].map((srv, i) => (
              <div key={i} className="bg-background p-10 hover:bg-card transition-colors group">
                <div className="text-secondary font-mono text-sm mb-6">0{i + 1}</div>
                <h4 className="text-2xl font-display text-white mb-4">{srv.title}</h4>
                <p className="text-muted-foreground group-hover:text-white/80 transition-colors">{srv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. AI EXPANSION TEASER */}
      <section className="py-32 relative bg-black flex items-center justify-center border-y border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-black to-black" />
        <div className="container relative z-10 mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="max-w-3xl mx-auto">
            <motion.div variants={fadeInUp} className="inline-block border border-primary/50 text-primary px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-8">
              Coming Soon
            </motion.div>
            <motion.h3 variants={fadeInUp} className="text-5xl md:text-6xl font-display text-white mb-6">
              The Next Evolution:<br/><span className="italic text-secondary">AI-Driven Media</span>
            </motion.h3>
            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground mb-10">
              We are building the tools to automate content distribution, personalize streaming experiences, and provide intelligent marketing analytics to our partners.
            </motion.p>
            <motion.button variants={fadeInUp} onClick={() => setContactOpen(true)} className="text-white border-b border-white/30 pb-1 hover:border-white transition-colors uppercase tracking-widest text-sm font-bold">
              Join the Waitlist
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* 6. COMMUNITY & ADVOCACY */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="bg-card border border-white/5 p-8 md:p-16 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-primary/20 blur-[100px] pointer-events-none" />
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="relative z-10 max-w-2xl">
              <motion.h2 variants={fadeInUp} className="text-sm font-mono text-secondary tracking-widest uppercase mb-4">Our Mission</motion.h2>
              <motion.h3 variants={fadeInUp} className="text-4xl font-display text-white mb-6">More Than Media. A Movement.</motion.h3>
              <motion.p variants={fadeInUp} className="text-lg text-muted-foreground mb-8">
                Órale is built on a foundation of community advocacy. We use our platforms to uplift local voices, support minority-owned businesses, and drive cultural initiatives forward across San Antonio and Texas.
              </motion.p>
              <motion.button variants={fadeInUp} onClick={() => setContactOpen(true)} className="px-6 py-3 bg-white text-black font-bold font-display uppercase tracking-wider hover:bg-gray-200 transition-colors">
                Get Involved
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER / CONTACT */}
      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
      <footer className="bg-black pt-24 pb-12 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 mb-16 border-b border-white/10 pb-16">
            <div>
              <img src="/orale-logo.png" alt="Órale Network" className="w-48 object-contain mb-6" />
              <div className="flex gap-4">
                {/* Instagram */}
                <a href="https://www.instagram.com/orale_network?igsh=bmpyeXI1MjZ5OGth" target="_blank" rel="noopener noreferrer"
                  className="w-12 h-12 border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors text-white group"
                  aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                {/* YouTube */}
                <a href="https://www.youtube.com/@Oralenetwork" target="_blank" rel="noopener noreferrer"
                  className="w-12 h-12 border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors text-white group"
                  aria-label="YouTube">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                {/* Facebook */}
                <a href="https://www.facebook.com/share/1JPAGaKLob/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer"
                  className="w-12 h-12 border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors text-white group"
                  aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-white font-bold mb-6 font-display uppercase tracking-wider">Connect</h4>
                <ul className="space-y-4 text-muted-foreground">
                  <li>
                    <button onClick={() => setContactOpen(true)} className="hover:text-white transition-colors">Contact Us</button>
                  </li>
                  <li><button onClick={() => setContactOpen(true)} className="hover:text-white transition-colors">Consulting</button></li>
                  <li><button onClick={() => setContactOpen(true)} className="hover:text-white transition-colors">Sponsorships</button></li>
                  <li><Link href="/business-corner" className="hover:text-white transition-colors">Business Corner</Link></li>
                  <li><Link href="/events" className="hover:text-white transition-colors">Events</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-6 font-display uppercase tracking-wider">Location</h4>
                <address className="not-italic text-muted-foreground space-y-2">
                  San Antonio, TX<br/>
                  Heart of Texas Culture
                </address>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground font-mono">
            <p>&copy; {new Date().getFullYear()} OSA Media. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
