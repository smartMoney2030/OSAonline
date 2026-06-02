import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getAboutUs, type AboutUsContent } from "@/lib/adminApi";
import ContactModal from "@/components/ContactModal";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function AboutUs() {
  const [content, setContent] = useState<AboutUsContent | null>(null);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    getAboutUs().then(setContent).catch(() => {});
  }, []);

  if (!content) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen text-foreground overflow-x-hidden pt-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6 py-16">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="max-w-5xl mx-auto"
        >
          <motion.h2 variants={fadeInUp} className="text-sm font-mono text-secondary tracking-widest uppercase mb-4">About Us</motion.h2>
          <motion.h3 variants={fadeInUp} className="text-4xl md:text-5xl font-display text-white mb-8 leading-tight">
            {content.headline}<br/><span className="italic text-secondary">{content.headlineItalic}</span>
          </motion.h3>
          <motion.p variants={fadeInUp} className="text-lg text-muted-foreground mb-6 max-w-3xl leading-relaxed">
            {content.intro1}
          </motion.p>
          <motion.p variants={fadeInUp} className="text-lg text-muted-foreground mb-16 max-w-3xl leading-relaxed">
            {content.intro2}
          </motion.p>

          <motion.h4 variants={fadeInUp} className="text-sm font-mono text-secondary tracking-widest uppercase mb-10">What Makes Us Unstoppable</motion.h4>

          <div className="grid md:grid-cols-2 gap-px bg-white/10 p-px mb-16">
            {content.services.map((item) => (
              <motion.div key={item.num} variants={fadeInUp} className="bg-background p-10 hover:bg-card transition-colors group">
                <div className="text-secondary font-mono text-sm mb-5">{item.num}</div>
                <h5 className="text-xl font-display text-white mb-3 group-hover:text-secondary transition-colors">{item.title}</h5>
                <p className="text-muted-foreground group-hover:text-white/80 transition-colors leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeInUp} className="bg-card border border-white/5 p-10 md:p-14 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-72 h-72 bg-primary/15 blur-[120px] pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start md:items-center justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-mono text-secondary tracking-widest uppercase mb-4">Our Mission</p>
                <p className="text-2xl md:text-3xl font-display text-white leading-snug">{content.mission}</p>
                <p className="text-muted-foreground mt-4 leading-relaxed">{content.missionSub}</p>
              </div>
              <button
                onClick={() => setContactOpen(true)}
                className="shrink-0 px-8 py-4 bg-primary text-primary-foreground font-bold font-display uppercase tracking-wider hover:bg-primary/90 transition-all active:scale-95 rounded-sm border border-primary-border shadow-[0_0_30px_rgba(200,20,40,0.3)] flex items-center gap-3"
              >
                Órale. Let's Work. <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
    </div>
  );
}
