import { Link } from "wouter";

export default function Privacy() {
  return (
    <div className="bg-background min-h-screen text-foreground pt-24 pb-20">
      <div className="container mx-auto px-6 max-w-3xl">

        <div className="mb-10">
          <p className="text-xs font-mono text-secondary uppercase tracking-widest mb-3">OSA Media &amp; Órale Network</p>
          <h1 className="text-4xl md:text-5xl font-display text-white mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm font-mono">Effective Date: May 20, 2026 &nbsp;·&nbsp; Powered by OSA Media</p>
        </div>

        <div className="space-y-10 text-muted-foreground leading-relaxed">

          <section>
            <p>
              OSA Media and Órale Network ("we," "our," or "us") respect your privacy and are committed to
              protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard
              your information when you visit our website or use our services.
            </p>
          </section>

          <section>
            <h2 className="text-white font-display text-xl mb-4">Information We Collect</h2>
            <p className="mb-4">We may collect personal information that you voluntarily provide to us, including but not limited to:</p>
            <ul className="space-y-2 pl-4">
              <li className="flex gap-3"><span className="text-primary mt-1.5 shrink-0">▸</span><span><strong className="text-white/80">Contact Data:</strong> Name, email address, and phone number.</span></li>
              <li className="flex gap-3"><span className="text-primary mt-1.5 shrink-0">▸</span><span><strong className="text-white/80">Usage Data:</strong> IP address, browser type, pages visited, and time spent on our site.</span></li>
              <li className="flex gap-3"><span className="text-primary mt-1.5 shrink-0">▸</span><span><strong className="text-white/80">Cookies:</strong> We use cookies to enhance your browsing experience and analyze site traffic.</span></li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-display text-xl mb-4">How We Use Your Information</h2>
            <p className="mb-4">We use the collected data for various purposes, such as to:</p>
            <ul className="space-y-2 pl-4">
              <li className="flex gap-3"><span className="text-primary mt-1.5 shrink-0">▸</span><span>Provide, operate, and maintain our services.</span></li>
              <li className="flex gap-3"><span className="text-primary mt-1.5 shrink-0">▸</span><span>Improve, personalize, and expand our website.</span></li>
              <li className="flex gap-3"><span className="text-primary mt-1.5 shrink-0">▸</span><span>Communicate with you, either directly or through one of our partners, for customer service or promotional updates.</span></li>
              <li className="flex gap-3"><span className="text-primary mt-1.5 shrink-0">▸</span><span>Comply with legal obligations and prevent fraudulent activity.</span></li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-display text-xl mb-4">Data Sharing and Disclosure</h2>
            <p>
              We do not sell your personal data. We may share your information only with trusted third-party
              service providers who assist us in operating our website and conducting our business, provided
              those parties agree to keep this information confidential.
            </p>
          </section>

          <section>
            <h2 className="text-white font-display text-xl mb-4">Your Rights</h2>
            <p>
              Depending on your location, you may have the right to access, correct, or delete the personal
              data we hold about you. To exercise these rights, please contact us at the email provided below.
            </p>
          </section>

          <section className="border-t border-white/10 pt-10">
            <h2 className="text-white font-display text-xl mb-4">Contact Us</h2>
            <p className="mb-4">If you have any questions about this Privacy Policy, please contact us:</p>
            <ul className="space-y-2 pl-4">
              <li className="flex gap-3"><span className="text-primary mt-1.5 shrink-0">▸</span><span>Email: <a href="mailto:oralenetwork@gmail.com" className="text-primary hover:text-primary/80 transition-colors">oralenetwork@gmail.com</a></span></li>
              <li className="flex gap-3"><span className="text-primary mt-1.5 shrink-0">▸</span><span>Website: <a href="https://oraleonline.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">oraleonline.com</a></span></li>
            </ul>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex gap-6 text-sm font-mono text-muted-foreground">
          <Link href="/" className="hover:text-white transition-colors">← Home</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
}
