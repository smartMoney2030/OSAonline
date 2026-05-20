import { Link } from "wouter";

export default function Terms() {
  return (
    <div className="bg-background min-h-screen text-foreground pt-24 pb-20">
      <div className="container mx-auto px-6 max-w-3xl">

        <div className="mb-10">
          <p className="text-xs font-mono text-secondary uppercase tracking-widest mb-3">OSA Media &amp; Órale Network</p>
          <h1 className="text-4xl md:text-5xl font-display text-white mb-4">Terms of Service</h1>
          <p className="text-muted-foreground text-sm font-mono">Effective Date: May 20, 2026 &nbsp;·&nbsp; Powered by OSA Media</p>
        </div>

        <div className="space-y-10 text-muted-foreground leading-relaxed">

          <section>
            <p>
              Welcome to OSA Media and Órale Network. By accessing or using our website and services,
              you agree to comply with and be bound by the following Terms of Service. If you do not agree,
              please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-white font-display text-xl mb-4">Intellectual Property</h2>
            <p className="mb-4">
              All content, features, and functionality on this site—including text, graphics, logos, and
              audio/video clips—are the exclusive property of OSA Media and Órale Network and are
              protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-white/60 text-sm font-mono">
              Copyright © 2026 OSA Media, Órale Network — All Rights Reserved.
            </p>
          </section>

          <section>
            <h2 className="text-white font-display text-xl mb-4">User Conduct</h2>
            <p className="mb-4">By using our services, you agree not to:</p>
            <ul className="space-y-2 pl-4">
              <li className="flex gap-3"><span className="text-primary mt-1.5 shrink-0">▸</span><span>Use the site for any unlawful purpose.</span></li>
              <li className="flex gap-3"><span className="text-primary mt-1.5 shrink-0">▸</span><span>Attempt to disrupt, damage, or impair the website's functionality.</span></li>
              <li className="flex gap-3"><span className="text-primary mt-1.5 shrink-0">▸</span><span>Reproduce, duplicate, or exploit any portion of our content without express written permission.</span></li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-display text-xl mb-4">Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, OSA Media and Órale Network shall not be liable for
              any indirect, incidental, or consequential damages arising out of your use or inability to use our
              services.
            </p>
          </section>

          <section>
            <h2 className="text-white font-display text-xl mb-4">Changes to These Terms</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. We will notify users of any
              changes by updating the "Effective Date" at the top of this document. Your continued use of the
              site after changes are posted constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="border-t border-white/10 pt-10">
            <h2 className="text-white font-display text-xl mb-4">Contact Us</h2>
            <p className="mb-4">If you have any questions about the Privacy Policy or Terms of Service, please contact us:</p>
            <ul className="space-y-2 pl-4">
              <li className="flex gap-3"><span className="text-primary mt-1.5 shrink-0">▸</span><span>Email: <a href="mailto:oralenetwork@gmail.com" className="text-primary hover:text-primary/80 transition-colors">oralenetwork@gmail.com</a></span></li>
              <li className="flex gap-3"><span className="text-primary mt-1.5 shrink-0">▸</span><span>Website: <a href="https://oraleonline.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">oraleonline.com</a></span></li>
            </ul>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex gap-6 text-sm font-mono text-muted-foreground">
          <Link href="/" className="hover:text-white transition-colors">← Home</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}
