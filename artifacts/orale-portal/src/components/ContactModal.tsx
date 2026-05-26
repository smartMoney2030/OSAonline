import { useState } from "react";
import { X, Loader2, CheckCircle } from "lucide-react";

interface Props {
  onClose: () => void;
}

export default function ContactModal({ onClose }: Props) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function set(k: keyof typeof form, v: string) {
    setForm(f => ({ ...f, [k]: v }));
  }

  async function handleSubmit() {
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submission failed");
      setDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-card border border-white/10 rounded-sm shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="font-display text-white text-lg tracking-wide">Contact Us</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {done ? (
          <div className="px-6 py-12 flex flex-col items-center gap-4 text-center">
            <CheckCircle size={48} className="text-primary" />
            <p className="text-white font-bold text-lg font-display">Message Received!</p>
            <p className="text-muted-foreground text-sm">We'll be in touch soon. Thank you for reaching out to Órale Network.</p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-sm hover:bg-primary/90 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="px-6 py-6 space-y-4">
              <p className="text-muted-foreground text-sm">Leave your info and we'll get back to you.</p>

              {error && <p className="text-red-400 text-sm font-mono">{error}</p>}

              <div>
                <label className="block text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => set("name", e.target.value)}
                  placeholder="Your full name"
                  className="w-full bg-background border border-white/10 rounded-sm px-3 py-2 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => set("phone", e.target.value)}
                  placeholder="(210) 555-0000"
                  className="w-full bg-background border border-white/10 rounded-sm px-3 py-2 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => set("email", e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-background border border-white/10 rounded-sm px-3 py-2 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">Message</label>
                <textarea
                  value={form.message}
                  onChange={e => set("message", e.target.value)}
                  placeholder="How can we help you?"
                  rows={4}
                  className="w-full bg-background border border-white/10 rounded-sm px-3 py-2 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/10">
              <button
                onClick={onClose}
                className="px-5 py-2 border border-white/20 text-white rounded-sm text-sm hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-5 py-2 bg-primary text-primary-foreground rounded-sm text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                Send Message
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
