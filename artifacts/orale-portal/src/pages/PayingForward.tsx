import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ExternalLink, CheckCircle2, Clock } from "lucide-react";
import { useGetPayingForwardAds, useSubmitPayingForwardApplication } from "@workspace/api-client-react";
import { usePageMeta } from "@/hooks/usePageMeta";

const EMPTY = {
  businessName: "", ownerName: "", phone: "", hasWebsite: "" as "" | "yes" | "no", websiteUrl: "",
  services: "", address: "", city: "", state: "", zipCode: "", comments: "",
};
type Form = typeof EMPTY;

function formatPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}
function normalizeUrl(v: string): string | null {
  let s = v.trim();
  if (!s) return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(s) && !/^https?:\/\//i.test(s)) return null;
  if (!/^https?:\/\//i.test(s)) s = "https://" + s;
  try {
    const u = new URL(s);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    if (!u.hostname.includes(".")) return null;
    return u.toString();
  } catch { return null; }
}
function safeLink(v: string): string | null {
  try { const u = new URL(v); return u.protocol === "http:" || u.protocol === "https:" ? u.toString() : null; } catch { return null; }
}

const inputCls = "w-full bg-[#1a1a1a] border border-white/10 text-white placeholder-white/30 px-4 py-3 rounded-sm text-sm focus:outline-none focus:border-primary/60";
const lblCls = "block text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1.5";

export default function PayingForward() {
  usePageMeta({
    title: "Paying Forward",
    description: "Órale Network Paying Forward: apply for a chance to be featured and supported by the community.",
    ogImage: "/paying-forward-golden-ticket.jpeg",
  });
  const adsQ = useGetPayingForwardAds();
  const submit = useSubmitPayingForwardApplication();
  const [f, setF] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [serverError, setServerError] = useState("");
  const [result, setResult] = useState<null | { notificationSent: boolean }>(null);

  const ads = (adsQ.data ?? []).filter(a => a.isActive);

  function set<K extends keyof Form>(k: K, v: Form[K]) { setF(p => ({ ...p, [k]: v })); }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submit.isPending || result) return;
    const er: Partial<Record<keyof Form, string>> = {};
    (["businessName", "ownerName", "services", "address", "city", "state", "zipCode"] as const).forEach(k => {
      if (!f[k].trim()) er[k] = "This field is required.";
    });
    if (f.phone.replace(/\D/g, "").length < 10) er.phone = "Enter a phone number with at least 10 digits.";
    if (!f.hasWebsite) er.hasWebsite = "Please choose yes or no.";
    let site = "";
    if (f.hasWebsite === "yes") {
      const n = normalizeUrl(f.websiteUrl);
      if (!n) er.websiteUrl = "Enter a valid website address (http or https).";
      else site = n;
    }
    if (f.state.trim().length < 2) er.state = er.state ?? "Enter at least 2 characters.";
    if (!/^\d{5}(-\d{4})?$/.test(f.zipCode.trim())) er.zipCode = "Enter a valid ZIP code.";
    if (f.comments.length > 5000) er.comments = "Too long.";
    if (site.length > 2000) er.websiteUrl = "Website address is too long.";
    setErrors(er);
    setServerError("");
    if (Object.keys(er).length) return;
    try {
      const r = await submit.mutateAsync({
        data: {
          businessName: f.businessName.trim(), ownerName: f.ownerName.trim(), phone: f.phone,
          hasWebsite: f.hasWebsite === "yes", websiteUrl: site,
          services: f.services.trim(), address: f.address.trim(), city: f.city.trim(),
          state: f.state.trim(), zipCode: f.zipCode.trim(), comments: f.comments.trim(),
          companyFax: String(new FormData(e.currentTarget).get("companyFax") ?? ""),
        },
      });
      setResult({ notificationSent: r.notificationSent });
    } catch (err) {
      setServerError(err instanceof Error && err.message ? err.message : "Submission failed. Please try again.");
    }
  }

  const err = (k: keyof Form) => errors[k] ? (
    <p id={`err-${k}`} role="alert" className="text-red-400 text-xs mt-1">{errors[k]}</p>
  ) : null;
  const aria = (k: keyof Form) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `err-${k}` : undefined });

  return (
    <div className="bg-background min-h-screen text-foreground overflow-x-hidden">
      <section className="relative pt-24 pb-12 border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background pointer-events-none" />
        <div className="container relative mx-auto px-6 flex flex-col items-center text-center">
          <motion.img
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            src="/paying-forward-golden-ticket.jpeg"
            alt="Órale Network Paying Forward Golden Ticket"
            data-testid="img-golden-ticket"
            className="w-full max-w-3xl h-auto object-contain rounded-sm shadow-[0_0_60px_rgba(200,100,0,0.25)]"
          />
          <p className="text-sm font-mono text-secondary tracking-widest uppercase mt-10 mb-3">Órale Network</p>
          <h1 className="text-4xl md:text-5xl font-display text-white">Paying Forward</h1>
          <a href="#apply" className="mt-8 inline-flex px-8 py-4 bg-primary text-primary-foreground font-bold font-display uppercase tracking-wider rounded-sm hover:bg-primary/90">
            Apply Now
          </a>
        </div>
      </section>

      <section id="apply" className="container mx-auto px-6 py-16 max-w-3xl">
        {result ? (
          <div className="text-center space-y-4 py-10" data-testid="status-success" role="status">
            <CheckCircle2 size={48} className="mx-auto text-green-400" />
            <h2 className="text-2xl font-display text-white">Application received</h2>
            <p className="text-muted-foreground">We will be in contact with you within 24–36 hours</p>
            {!result.notificationSent && (
              <div data-testid="status-email-pending" className="mx-auto max-w-md flex gap-3 text-left bg-yellow-950/30 border border-yellow-800/40 p-4 rounded-sm text-sm text-yellow-200">
                <Clock size={18} className="shrink-0 mt-0.5" />
                <p>Your application was saved for our team to review. Email notification is pending. You do not need to submit again.</p>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="space-y-5" aria-busy={submit.isPending}>
            <h2 className="text-2xl font-display text-white mb-2">Apply</h2>
            <div>
              <label htmlFor="businessName" className={lblCls}>Name of your business</label>
              <input id="businessName" name="businessName" maxLength={200} required autoComplete="organization" value={f.businessName} onChange={e => set("businessName", e.target.value)} className={inputCls} {...aria("businessName")} />
              {err("businessName")}
            </div>
            <div>
              <label htmlFor="ownerName" className={lblCls}>Owner of Business</label>
              <input id="ownerName" name="ownerName" maxLength={200} required autoComplete="name" value={f.ownerName} onChange={e => set("ownerName", e.target.value)} className={inputCls} {...aria("ownerName")} />
              {err("ownerName")}
            </div>
            <div>
              <label htmlFor="phone" className={lblCls}>Direct contact number</label>
              <input id="phone" name="phone" type="tel" inputMode="tel" maxLength={30} required autoComplete="tel" placeholder="(210) 555-0100" value={f.phone} onChange={e => set("phone", formatPhone(e.target.value))} className={inputCls} {...aria("phone")} />
              {err("phone")}
            </div>
            <fieldset>
              <legend className={lblCls}>Do you have a website?</legend>
              <div className="flex gap-6">
                {(["yes", "no"] as const).map(v => (
                  <label key={v} className="flex items-center gap-2 text-sm text-white cursor-pointer">
                    <input type="radio" name="hasWebsite" value={v} checked={f.hasWebsite === v} onChange={() => set("hasWebsite", v)} data-testid={`radio-website-${v}`} />
                    {v === "yes" ? "Yes" : "No"}
                  </label>
                ))}
              </div>
              {err("hasWebsite")}
            </fieldset>
            {f.hasWebsite === "yes" && (
              <div>
                <label htmlFor="websiteUrl" className={lblCls}>Website address</label>
                <input id="websiteUrl" name="websiteUrl" type="text" inputMode="url" maxLength={2000} required placeholder="https://yourbusiness.com" value={f.websiteUrl} onChange={e => set("websiteUrl", e.target.value)} className={inputCls} {...aria("websiteUrl")} />
                {err("websiteUrl")}
              </div>
            )}
            {f.hasWebsite === "no" && <p className="text-secondary text-sm font-bold" data-testid="text-build-website">If not, we can build one for you!</p>}
            <div>
              <label htmlFor="services" className={lblCls}>Your services you offer</label>
              <textarea id="services" name="services" rows={4} maxLength={5000} required value={f.services} onChange={e => set("services", e.target.value)} className={inputCls + " resize-y"} {...aria("services")} />
              {err("services")}
            </div>
            <div>
              <label htmlFor="address" className={lblCls}>Address</label>
              <input id="address" name="address" maxLength={300} required autoComplete="street-address" value={f.address} onChange={e => set("address", e.target.value)} className={inputCls} {...aria("address")} />
              {err("address")}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label htmlFor="city" className={lblCls}>City</label>
                <input id="city" name="city" maxLength={100} required autoComplete="address-level2" value={f.city} onChange={e => set("city", e.target.value)} className={inputCls} {...aria("city")} />
                {err("city")}
              </div>
              <div>
                <label htmlFor="state" className={lblCls}>State</label>
                <input id="state" name="state" maxLength={50} required autoComplete="address-level1" value={f.state} onChange={e => set("state", e.target.value)} className={inputCls} {...aria("state")} />
                {err("state")}
              </div>
              <div>
                <label htmlFor="zipCode" className={lblCls}>Zip code</label>
                <input id="zipCode" name="zipCode" maxLength={10} required autoComplete="postal-code" value={f.zipCode} onChange={e => set("zipCode", e.target.value)} className={inputCls} {...aria("zipCode")} />
                {err("zipCode")}
              </div>
            </div>
            <div>
              <label htmlFor="comments" className={lblCls}>Additional Comment</label>
              <textarea id="comments" name="comments" rows={4} maxLength={5000} value={f.comments} onChange={e => set("comments", e.target.value)} className={inputCls + " resize-y"} {...aria("comments")} />
              {err("comments")}
            </div>
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="companyFax">Leave this field empty</label>
              <input id="companyFax" name="companyFax" tabIndex={-1} autoComplete="off" defaultValue="" />
            </div>
            {serverError && <p role="alert" data-testid="text-submit-error" className="text-sm text-red-400 bg-red-950/30 border border-red-800/40 px-4 py-3 rounded-sm">{serverError}</p>}
            <button type="submit" disabled={submit.isPending} data-testid="button-submit-application" className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground font-bold font-display uppercase tracking-wider text-sm hover:bg-primary/90 disabled:opacity-60 rounded-sm">
              {submit.isPending ? <><Loader2 size={16} className="animate-spin" /> Submitting…</> : "Submit for possible approval!"}
            </button>
          </form>
        )}
      </section>

      <section className="border-t border-white/5 py-16" aria-label="Paying Forward sponsors">
        <div className="container mx-auto px-6">
          {adsQ.isLoading ? (
            <div role="status" className="flex justify-center py-8"><Loader2 className="animate-spin text-muted-foreground" /><span className="sr-only">Loading ads</span></div>
          ) : adsQ.isError ? (
            <div role="alert" className="text-center text-muted-foreground">
              <p>Failed to load ads.</p>
              <button onClick={() => adsQ.refetch()} className="mt-3 px-4 py-2 border border-white/20 text-white text-sm rounded-sm">Retry</button>
            </div>
          ) : ads.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ads.map(ad => {
                const link = ad.linkUrl ? safeLink(ad.linkUrl) : null;
                const img = <img src={ad.imageUrl} alt={ad.title} loading="lazy" className="w-full h-auto object-contain bg-black" />;
                return (
                  <div key={ad.id} data-testid={`card-ad-${ad.id}`} className="bg-card border border-white/5 rounded-sm overflow-hidden">
                    {link ? (
                      <a href={link} target="_blank" rel="noopener noreferrer" aria-label={`${ad.title} (opens in new tab)`}>{img}</a>
                    ) : img}
                    <div className="p-4 flex items-center justify-between gap-2">
                      <p className="text-white font-display">{ad.title}</p>
                      {link && <ExternalLink size={14} className="text-primary shrink-0" aria-hidden="true" />}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
