import { useState, useEffect, useCallback } from "react";
import { Pencil, Trash2, Plus, Loader2, Mail } from "lucide-react";
import {
  getAdminPayingForwardAds, createPayingForwardAd, updatePayingForwardAd, deletePayingForwardAd,
  getAdminPayingForwardApplications, notifyPayingForwardApplication,
  type PayingForwardAd, type PayingForwardAdInput, type PayingForwardApplication,
} from "@workspace/api-client-react";
import { ImageUpload } from "@/components/ImageUpload";

function opts(): RequestInit {
  return { headers: { Authorization: "Bearer " + localStorage.getItem("orale_admin_token") } };
}
function msg(e: unknown, fallback: string) {
  return e instanceof Error && e.message ? e.message : fallback;
}
const EMPTY: PayingForwardAdInput = { title: "", imageUrl: "", linkUrl: "", isActive: true, sortOrder: 0 };
const inputCls = "w-full bg-background border border-white/10 rounded-sm px-3 py-2 text-white text-sm focus:outline-none focus:border-primary";
const lbl = "block text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1";

export default function PayingForwardTab() {
  const [ads, setAds] = useState<PayingForwardAd[]>([]);
  const [apps, setApps] = useState<PayingForwardApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<PayingForwardAd | null>(null);
  const [form, setForm] = useState<PayingForwardAdInput | null>(null);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const [a, p] = await Promise.allSettled([getAdminPayingForwardAds(opts()), getAdminPayingForwardApplications(opts())]);
    if (a.status === "fulfilled") setAds(a.value); else setError(msg(a.reason, "Failed to load ads"));
    if (p.status === "fulfilled") setApps(p.value); else setError(e => e || msg(p.reason, "Failed to load applications"));
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  function openCreate() { setEditing(null); setForm({ ...EMPTY }); setFormError(""); }
  function openEdit(ad: PayingForwardAd) {
    const { id: _id, ...rest } = ad;
    setEditing(ad); setForm(rest); setFormError("");
  }
  async function save() {
    if (!form) return;
    if (!form.title.trim()) return setFormError("Title is required");
    if (!form.imageUrl) return setFormError("An image is required");
    let link = form.linkUrl.trim();
    if (link) {
      if (!/^https?:\/\//i.test(link)) link = "https://" + link;
      try { const u = new URL(link); if (!/^https?:$/.test(u.protocol)) throw new Error(); }
      catch { return setFormError("Destination URL must be a valid http or https address"); }
    }
    setSaving(true); setFormError("");
    try {
      const body = { ...form, title: form.title.trim(), linkUrl: link, sortOrder: Math.max(0, Number(form.sortOrder) || 0) };
      if (editing) await updatePayingForwardAd(editing.id, body, opts());
      else await createPayingForwardAd(body, opts());
      setForm(null);
      await load();
    } catch (e) { setFormError(msg(e, "Save failed")); }
    finally { setSaving(false); }
  }
  async function remove(ad: PayingForwardAd) {
    if (!confirm(`Delete the ad "${ad.title}"? This cannot be undone.`)) return;
    setDeleting(ad.id);
    try { await deletePayingForwardAd(ad.id, opts()); await load(); }
    catch (e) { setError(msg(e, "Delete failed")); }
    finally { setDeleting(null); }
  }
  async function resend(id: number) {
    setSending(id); setError("");
    try { await notifyPayingForwardApplication(id, opts()); await load(); }
    catch (e) { setError(msg(e, "Email could not be sent. Gmail may be unavailable (503); try again later.")); }
    finally { setSending(null); }
  }

  return (
    <div className="space-y-12">
      {error && <p role="alert" className="text-red-400 text-sm font-mono">{error}</p>}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display text-white">Paying Forward Ads</h2>
          <button onClick={openCreate} data-testid="button-add-pf-ad" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-sm hover:bg-primary/90">
            <Plus size={14} /> Add Ad
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-muted-foreground" /></div>
        ) : ads.length === 0 ? (
          <p className="text-muted-foreground text-sm py-8 text-center">No ads yet.</p>
        ) : (
          <div className="space-y-3">
            {ads.map(ad => (
              <div key={ad.id} className="bg-background border border-white/10 rounded-sm p-4 flex items-start gap-4" data-testid={`row-pf-ad-${ad.id}`}>
                <img src={ad.imageUrl} alt="" className="w-20 h-16 object-contain bg-black rounded-sm shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold truncate">{ad.title}</p>
                  {ad.linkUrl && <p className="text-muted-foreground text-xs truncate">{ad.linkUrl}</p>}
                  <div className="flex gap-2 mt-1 items-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${ad.isActive ? "bg-green-900/40 text-green-400" : "bg-white/10 text-muted-foreground"}`}>{ad.isActive ? "Active" : "Hidden"}</span>
                    <span className="text-xs text-muted-foreground font-mono">Order {ad.sortOrder}</span>
                  </div>
                </div>
                <button onClick={() => openEdit(ad)} aria-label={`Edit ${ad.title}`} className="p-2 text-muted-foreground hover:text-white"><Pencil size={14} /></button>
                <button onClick={() => remove(ad)} disabled={deleting === ad.id} aria-label={`Delete ${ad.title}`} className="p-2 text-muted-foreground hover:text-red-400 disabled:opacity-50">
                  {deleting === ad.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display text-white">Applications</h2>
          <span className="text-xs font-mono text-muted-foreground">{apps.length} total</span>
        </div>
        {!loading && apps.length === 0 && <p className="text-muted-foreground text-sm py-8 text-center">No applications yet.</p>}
        <div className="space-y-3">
          {apps.map(a => (
            <div key={a.id} className="bg-background border border-white/10 rounded-sm p-4" data-testid={`row-pf-app-${a.id}`}>
              <div className="flex flex-wrap items-center gap-2 justify-between">
                <p className="text-white font-bold">{a.businessName}</p>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${a.notificationSent ? "bg-green-900/40 text-green-400" : "bg-yellow-900/40 text-yellow-400"}`}>
                    {a.notificationSent ? "Email sent" : "Email pending"}
                  </span>
                  {!a.notificationSent && (
                    <button onClick={() => resend(a.id)} disabled={sending === a.id} data-testid={`button-send-email-${a.id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-sm disabled:opacity-50">
                      {sending === a.id ? <Loader2 size={12} className="animate-spin" /> : <Mail size={12} />} Send email
                    </button>
                  )}
                </div>
              </div>
              <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-1 mt-3 text-sm">
                {([
                  ["Owner", a.ownerName], ["Phone", a.phone],
                  ["Has website", a.hasWebsite ? "Yes" : "No"], ["Website", a.hasWebsite ? a.websiteUrl : "-"],
                  ["Address", a.address], ["City", a.city], ["State", a.state], ["ZIP", a.zipCode],
                  ["Submitted", new Date(a.createdAt).toLocaleString("en-US")],
                ] as const).map(([k, v]) => (
                  <div key={k} className="flex gap-2"><dt className="text-muted-foreground font-mono text-xs w-24 shrink-0 pt-0.5">{k}</dt><dd className="text-white break-words min-w-0">{v}</dd></div>
                ))}
                <div className="sm:col-span-2 flex gap-2"><dt className="text-muted-foreground font-mono text-xs w-24 shrink-0 pt-0.5">Services</dt><dd className="text-white whitespace-pre-wrap break-words min-w-0">{a.services}</dd></div>
                <div className="sm:col-span-2 flex gap-2"><dt className="text-muted-foreground font-mono text-xs w-24 shrink-0 pt-0.5">Comments</dt><dd className="text-white whitespace-pre-wrap break-words min-w-0">{a.comments || "-"}</dd></div>
              </dl>
            </div>
          ))}
        </div>
      </section>

      {form && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 px-4 py-8 overflow-y-auto" role="dialog" aria-modal="true" aria-label="Ad editor">
          <div className="w-full max-w-lg bg-card border border-white/10 rounded-sm">
            <div className="px-6 py-4 border-b border-white/10"><h2 className="font-display text-white text-lg">{editing ? "Edit Ad" : "New Ad"}</h2></div>
            <div className="px-6 py-6 space-y-4">
              {formError && <p role="alert" className="text-red-400 text-sm font-mono">{formError}</p>}
              <div><label htmlFor="pf-title" className={lbl}>Title</label>
                <input id="pf-title" maxLength={200} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={inputCls} /></div>
              <div><span className={lbl}>Image</span>
                <ImageUpload value={form.imageUrl || null} onChange={u => setForm({ ...form, imageUrl: u ?? "" })} /></div>
              <div><label htmlFor="pf-link" className={lbl}>Destination URL (optional)</label>
                <input id="pf-link" maxLength={2000} value={form.linkUrl} onChange={e => setForm({ ...form, linkUrl: e.target.value })} placeholder="https://" className={inputCls} /></div>
              <div><label htmlFor="pf-sort" className={lbl}>Sort order</label>
                <input id="pf-sort" type="number" min={0} value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: Number(e.target.value) })} className={inputCls} /></div>
              <label className="flex items-center gap-2 text-sm text-white">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} /> Active (visible on site)
              </label>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/10">
              <button onClick={() => setForm(null)} className="px-5 py-2 border border-white/20 text-white rounded-sm text-sm">Cancel</button>
              <button onClick={save} disabled={saving} className="px-5 py-2 bg-primary text-primary-foreground rounded-sm text-sm font-bold disabled:opacity-50 flex items-center gap-2">
                {saving && <Loader2 size={14} className="animate-spin" />} Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
