import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import {
  getAdminEvents, createEvent, updateEvent, deleteEvent,
  getAdminBusinesses, createBusiness, updateBusiness, deleteBusiness,
  getContactSubmissions, deleteContactSubmission,
  getBusinessSubmissions, updateBusinessSubmissionStatus,
  type Event, type Business, type EventPayload, type BusinessPayload, type ContactSubmission, type BusinessSubmission,
} from "@/lib/adminApi";
import { Pencil, Trash2, Plus, LogOut, X, Check, Loader2, Mail, ArrowUpCircle } from "lucide-react";

function useAuth() {
  const [, navigate] = useLocation();
  const token = localStorage.getItem("orale_admin_token");
  useEffect(() => {
    if (!token) navigate("/admin");
  }, [token, navigate]);
  function logout() {
    localStorage.removeItem("orale_admin_token");
    navigate("/admin");
  }
  return { logout };
}

const CITIES = ["San Antonio", "Austin", "Houston", "DFW", "Rio Grande Valley"];

const EMPTY_EVENT: EventPayload = {
  title: "", subtitle: "", dateStr: "", locationName: "",
  locationAddress: "", organizer: "", imageUrl: "", ticketUrl: "",
  status: "on_sale", isActive: true, sortOrder: 0,
};

const EMPTY_BUSINESS: BusinessPayload = {
  city: "San Antonio", name: "", badge: null, description: "",
  phone: null, websiteUrl: null, websiteLabel: null, youtubeUrl: null,
  isComingSoon: false, isActive: true, sortOrder: 0,
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, type = "text", placeholder }: {
  value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <input
      type={type}
      value={value ?? ""}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-background border border-white/10 rounded-sm px-3 py-2 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm"
    />
  );
}

function Textarea({ value, onChange, rows = 3 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <textarea
      value={value ?? ""}
      onChange={e => onChange(e.target.value)}
      rows={rows}
      className="w-full bg-background border border-white/10 rounded-sm px-3 py-2 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm resize-none"
    />
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div
        onClick={() => onChange(!checked)}
        className={`w-10 h-5 rounded-full transition-colors flex items-center ${checked ? "bg-primary" : "bg-white/20"}`}
      >
        <span className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </div>
      <span className="text-sm text-white">{label}</span>
    </label>
  );
}

function Modal({ title, onClose, onSave, saving, children }: {
  title: string; onClose: () => void; onSave: () => void; saving: boolean; children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 px-4 py-8 overflow-y-auto">
      <div className="w-full max-w-2xl bg-card border border-white/10 rounded-sm shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="font-display text-white text-lg">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-white transition-colors"><X size={18} /></button>
        </div>
        <div className="px-6 py-6 space-y-4">{children}</div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/10">
          <button onClick={onClose} className="px-5 py-2 border border-white/20 text-white rounded-sm text-sm hover:bg-white/5 transition-colors">Cancel</button>
          <button onClick={onSave} disabled={saving} className="px-5 py-2 bg-primary text-primary-foreground rounded-sm text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- Events Tab ----
function EventsTab() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Event | null>(null);
  const [form, setForm] = useState<EventPayload>(EMPTY_EVENT);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try { setEvents(await getAdminEvents()); } catch { setError("Failed to load events"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() { setEditTarget(null); setForm(EMPTY_EVENT); setModalOpen(true); }
  function openEdit(e: Event) {
    setEditTarget(e);
    const { id: _id, createdAt: _c, ...rest } = e;
    setForm(rest);
    setModalOpen(true);
  }
  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      if (editTarget) await updateEvent(editTarget.id, form);
      else await createEvent(form);
      setModalOpen(false);
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally { setSaving(false); }
  }
  async function handleDelete(id: number) {
    if (!confirm("Delete this event?")) return;
    try { await deleteEvent(id); await load(); }
    catch { setError("Delete failed"); }
  }

  function set<K extends keyof EventPayload>(k: K, v: EventPayload[K]) {
    setForm(f => ({ ...f, [k]: v }));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display text-white">Events</h2>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-sm hover:bg-primary/90 transition-colors">
          <Plus size={14} /> Add Event
        </button>
      </div>
      {error && <p className="text-red-400 text-sm mb-4 font-mono">{error}</p>}
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-muted-foreground" /></div>
      ) : events.length === 0 ? (
        <p className="text-muted-foreground text-sm py-12 text-center">No events yet. Add your first one.</p>
      ) : (
        <div className="space-y-3">
          {events.map(ev => (
            <div key={ev.id} className="bg-background border border-white/10 rounded-sm p-4 flex items-start gap-4">
              {ev.imageUrl && <img src={ev.imageUrl} alt="" className="w-16 h-16 object-cover rounded-sm shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold truncate">{ev.title}</p>
                <p className="text-muted-foreground text-xs truncate">{ev.dateStr} — {ev.locationName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${ev.isActive ? "bg-green-900/40 text-green-400" : "bg-white/10 text-muted-foreground"}`}>
                    {ev.isActive ? "Active" : "Hidden"}
                  </span>
                  <span className="text-xs text-muted-foreground">{ev.status}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => openEdit(ev)} className="p-2 text-muted-foreground hover:text-white transition-colors"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(ev.id)} className="p-2 text-muted-foreground hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <Modal title={editTarget ? "Edit Event" : "New Event"} onClose={() => setModalOpen(false)} onSave={handleSave} saving={saving}>
          {error && <p className="text-red-400 text-sm font-mono">{error}</p>}
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Title"><Input value={form.title} onChange={v => set("title", v)} /></Field>
            <Field label="Date"><Input value={form.dateStr} onChange={v => set("dateStr", v)} placeholder="May 30, 2026" /></Field>
          </div>
          <Field label="Subtitle"><Input value={form.subtitle} onChange={v => set("subtitle", v)} /></Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Venue Name"><Input value={form.locationName} onChange={v => set("locationName", v)} /></Field>
            <Field label="Location / Address"><Input value={form.locationAddress} onChange={v => set("locationAddress", v)} /></Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Organizer"><Input value={form.organizer} onChange={v => set("organizer", v)} /></Field>
            <Field label="Status"><Input value={form.status} onChange={v => set("status", v)} placeholder="on_sale" /></Field>
          </div>
          <Field label="Ticket URL"><Input value={form.ticketUrl} onChange={v => set("ticketUrl", v)} placeholder="https://eventbrite.com/..." /></Field>
          <Field label="Event Poster Image URL"><Input value={form.imageUrl} onChange={v => set("imageUrl", v)} placeholder="https://..." /></Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Sort Order"><Input type="number" value={String(form.sortOrder)} onChange={v => set("sortOrder", Number(v))} /></Field>
          </div>
          <Toggle checked={form.isActive} onChange={v => set("isActive", v)} label="Visible on site" />
        </Modal>
      )}
    </div>
  );
}

// ---- Businesses Tab ----
function BusinessesTab() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Business | null>(null);
  const [form, setForm] = useState<BusinessPayload>(EMPTY_BUSINESS);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try { setBusinesses(await getAdminBusinesses()); } catch { setError("Failed to load businesses"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() { setEditTarget(null); setForm(EMPTY_BUSINESS); setModalOpen(true); }
  function openEdit(b: Business) {
    setEditTarget(b);
    const { id: _id, createdAt: _c, ...rest } = b;
    setForm(rest);
    setModalOpen(true);
  }
  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      if (editTarget) await updateBusiness(editTarget.id, form);
      else await createBusiness(form);
      setModalOpen(false);
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally { setSaving(false); }
  }
  async function handleDelete(id: number) {
    if (!confirm("Delete this business?")) return;
    try { await deleteBusiness(id); await load(); }
    catch { setError("Delete failed"); }
  }

  function set<K extends keyof BusinessPayload>(k: K, v: BusinessPayload[K]) {
    setForm(f => ({ ...f, [k]: v }));
  }

  const grouped = CITIES.map(city => ({
    city,
    items: businesses.filter(b => b.city === city),
  }));
  const otherCities = businesses.filter(b => !CITIES.includes(b.city));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display text-white">Business Listings</h2>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-sm hover:bg-primary/90 transition-colors">
          <Plus size={14} /> Add Business
        </button>
      </div>
      {error && <p className="text-red-400 text-sm mb-4 font-mono">{error}</p>}
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="space-y-8">
          {[...grouped, ...(otherCities.length ? [{ city: "Other", items: otherCities }] : [])].map(({ city, items }) => (
            <div key={city}>
              <h3 className="text-xs font-mono text-secondary uppercase tracking-widest mb-3">{city}</h3>
              {items.length === 0 ? (
                <p className="text-muted-foreground text-xs">No listings yet.</p>
              ) : (
                <div className="space-y-2">
                  {items.map(b => (
                    <div key={b.id} className="bg-background border border-white/10 rounded-sm p-4 flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-white font-bold truncate">{b.isComingSoon ? "Coming Soon" : b.name}</p>
                          {b.badge && <span className="text-xs px-2 py-0.5 bg-secondary/20 text-secondary rounded-full">{b.badge}</span>}
                          {b.isComingSoon && <span className="text-xs px-2 py-0.5 bg-white/10 text-muted-foreground rounded-full">Placeholder</span>}
                        </div>
                        <p className="text-muted-foreground text-xs mt-0.5 line-clamp-1">{b.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${b.isActive ? "bg-green-900/40 text-green-400" : "bg-white/10 text-muted-foreground"}`}>
                            {b.isActive ? "Active" : "Hidden"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => openEdit(b)} className="p-2 text-muted-foreground hover:text-white transition-colors"><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(b.id)} className="p-2 text-muted-foreground hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <Modal title={editTarget ? "Edit Business" : "New Business"} onClose={() => setModalOpen(false)} onSave={handleSave} saving={saving}>
          {error && <p className="text-red-400 text-sm font-mono">{error}</p>}
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="City">
              <select
                value={form.city}
                onChange={e => set("city", e.target.value)}
                className="w-full bg-background border border-white/10 rounded-sm px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors text-sm"
              >
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Business Name"><Input value={form.name} onChange={v => set("name", v)} /></Field>
          </div>
          <Field label="Badge (optional)"><Input value={form.badge ?? ""} onChange={v => set("badge", v || null)} placeholder="e.g. Veteran Backed" /></Field>
          <Field label="Description"><Textarea value={form.description} onChange={v => set("description", v)} rows={4} /></Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Phone (optional)"><Input value={form.phone ?? ""} onChange={v => set("phone", v || null)} placeholder="(210) 555-0000" /></Field>
            <Field label="Website Label"><Input value={form.websiteLabel ?? ""} onChange={v => set("websiteLabel", v || null)} placeholder="Visit Website" /></Field>
          </div>
          <Field label="Website URL"><Input value={form.websiteUrl ?? ""} onChange={v => set("websiteUrl", v || null)} placeholder="https://..." /></Field>
          <Field label="YouTube Embed URL (optional)"><Input value={form.youtubeUrl ?? ""} onChange={v => set("youtubeUrl", v || null)} placeholder="https://www.youtube.com/embed/..." /></Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Sort Order"><Input type="number" value={String(form.sortOrder)} onChange={v => set("sortOrder", Number(v))} /></Field>
          </div>
          <div className="flex flex-col gap-3">
            <Toggle checked={form.isComingSoon} onChange={v => set("isComingSoon", v)} label="Mark as Coming Soon placeholder" />
            <Toggle checked={form.isActive} onChange={v => set("isActive", v)} label="Visible on site" />
          </div>
        </Modal>
      )}
    </div>
  );
}

// ---- Business Submissions Tab ----
function SubmissionsTab({ onPromoted }: { onPromoted?: () => void }) {
  const [submissions, setSubmissions] = useState<BusinessSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [promoteTarget, setPromoteTarget] = useState<BusinessSubmission | null>(null);
  const [promoteForm, setPromoteForm] = useState<BusinessPayload>(EMPTY_BUSINESS);
  const [promoting, setPromoting] = useState(false);
  const [promoteError, setPromoteError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try { setSubmissions(await getBusinessSubmissions()); } catch { setError("Failed to load submissions"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleStatusChange(id: number, status: "approved" | "rejected") {
    try {
      await updateBusinessSubmissionStatus(id, status);
      await load();
    } catch { setError("Update failed"); }
  }

  function openPromote(sub: BusinessSubmission) {
    setPromoteTarget(sub);
    setPromoteForm({
      city: sub.city,
      name: sub.businessName,
      badge: null,
      description: sub.description ?? "",
      phone: sub.phone ?? null,
      websiteUrl: sub.websiteUrl ?? null,
      websiteLabel: sub.websiteUrl ? "Visit Website" : null,
      youtubeUrl: null,
      isComingSoon: false,
      isActive: true,
      sortOrder: 0,
    });
    setPromoteError("");
  }

  async function handlePromoteSave() {
    if (!promoteTarget) return;
    setPromoting(true);
    setPromoteError("");
    try {
      await createBusiness(promoteForm);
      await updateBusinessSubmissionStatus(promoteTarget.id, "approved");
      setPromoteTarget(null);
      await load();
      onPromoted?.();
    } catch (err: unknown) {
      setPromoteError(err instanceof Error ? err.message : "Save failed");
    } finally { setPromoting(false); }
  }

  function setField<K extends keyof BusinessPayload>(k: K, v: BusinessPayload[K]) {
    setPromoteForm(f => ({ ...f, [k]: v }));
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "numeric", minute: "2-digit",
    });
  }

  const statusBadge = (status: string) => {
    if (status === "approved") return <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/40 text-green-400">Approved</span>;
    if (status === "rejected") return <span className="text-xs px-2 py-0.5 rounded-full bg-red-900/40 text-red-400">Rejected</span>;
    return <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-900/40 text-yellow-400">Pending</span>;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display text-white">Business Listing Requests</h2>
        <span className="text-xs font-mono text-muted-foreground">{submissions.length} total</span>
      </div>
      {error && <p className="text-red-400 text-sm mb-4 font-mono">{error}</p>}
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-muted-foreground" /></div>
      ) : submissions.length === 0 ? (
        <div className="py-16 text-center">
          <ArrowUpCircle size={32} className="text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-muted-foreground text-sm">No listing requests yet.</p>
          <p className="text-muted-foreground text-xs mt-1">When a business fills out the "Get Listed" form, it'll appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map(s => (
            <div key={s.id} className="bg-background border border-white/10 rounded-sm p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white font-bold">{s.businessName}</p>
                    <span className="text-xs text-muted-foreground font-mono">{s.city}</span>
                    {statusBadge(s.status)}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                    <span className="text-muted-foreground text-sm">{s.contactName}</span>
                    <a href={`tel:${s.phone}`} className="text-muted-foreground text-sm hover:text-white transition-colors">{s.phone}</a>
                    <a href={`mailto:${s.email}`} className="text-muted-foreground text-sm hover:text-white transition-colors">{s.email}</a>
                    {s.websiteUrl && <a href={s.websiteUrl} target="_blank" rel="noreferrer" className="text-muted-foreground text-sm hover:text-white transition-colors truncate max-w-xs">{s.websiteUrl}</a>}
                  </div>
                  {s.description && <p className="text-muted-foreground text-xs mt-2 line-clamp-2">{s.description}</p>}
                  <p className="text-muted-foreground text-xs mt-1 font-mono">{formatDate(s.createdAt)}</p>
                </div>
                <div className="flex flex-col gap-2 shrink-0 items-end">
                  {s.status === "pending" && (
                    <>
                      <button
                        onClick={() => openPromote(s)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-sm hover:bg-primary/90 transition-colors whitespace-nowrap"
                      >
                        <ArrowUpCircle size={12} /> Approve & Create Listing
                      </button>
                      <button
                        onClick={() => handleStatusChange(s.id, "rejected")}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-red-500/40 text-red-400 text-xs rounded-sm hover:bg-red-500/10 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {s.status === "approved" && (
                    <button
                      onClick={() => handleStatusChange(s.id, "rejected")}
                      className="text-xs text-muted-foreground hover:text-red-400 transition-colors"
                    >
                      Revoke
                    </button>
                  )}
                  {s.status === "rejected" && (
                    <button
                      onClick={() => openPromote(s)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-sm hover:bg-primary/90 transition-colors whitespace-nowrap"
                    >
                      <ArrowUpCircle size={12} /> Approve & Create Listing
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {promoteTarget && (
        <Modal
          title={`Create Listing — ${promoteTarget.businessName}`}
          onClose={() => setPromoteTarget(null)}
          onSave={handlePromoteSave}
          saving={promoting}
        >
          {promoteError && <p className="text-red-400 text-sm font-mono">{promoteError}</p>}
          <p className="text-xs text-muted-foreground font-mono -mt-1">Review and adjust the details below, then save to publish the listing and mark this request as approved.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="City">
              <select
                value={promoteForm.city}
                onChange={e => setField("city", e.target.value)}
                className="w-full bg-background border border-white/10 rounded-sm px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors text-sm"
              >
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Business Name"><Input value={promoteForm.name} onChange={v => setField("name", v)} /></Field>
          </div>
          <Field label="Badge (optional)"><Input value={promoteForm.badge ?? ""} onChange={v => setField("badge", v || null)} placeholder="e.g. Veteran Backed" /></Field>
          <Field label="Description"><Textarea value={promoteForm.description} onChange={v => setField("description", v)} rows={4} /></Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Phone (optional)"><Input value={promoteForm.phone ?? ""} onChange={v => setField("phone", v || null)} placeholder="(210) 555-0000" /></Field>
            <Field label="Website Label"><Input value={promoteForm.websiteLabel ?? ""} onChange={v => setField("websiteLabel", v || null)} placeholder="Visit Website" /></Field>
          </div>
          <Field label="Website URL"><Input value={promoteForm.websiteUrl ?? ""} onChange={v => setField("websiteUrl", v || null)} placeholder="https://..." /></Field>
          <Field label="YouTube Embed URL (optional)"><Input value={promoteForm.youtubeUrl ?? ""} onChange={v => setField("youtubeUrl", v || null)} placeholder="https://www.youtube.com/embed/..." /></Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Sort Order"><Input type="number" value={String(promoteForm.sortOrder)} onChange={v => setField("sortOrder", Number(v))} /></Field>
          </div>
          <Toggle checked={promoteForm.isActive} onChange={v => setField("isActive", v)} label="Visible on site" />
        </Modal>
      )}
    </div>
  );
}

// ---- Contact Submissions Tab ----
function ContactTab() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try { setSubmissions(await getContactSubmissions()); } catch { setError("Failed to load submissions"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(id: number) {
    if (!confirm("Delete this submission?")) return;
    try { await deleteContactSubmission(id); await load(); }
    catch { setError("Delete failed"); }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "numeric", minute: "2-digit",
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display text-white">Contact Submissions</h2>
        <span className="text-xs font-mono text-muted-foreground">{submissions.length} total</span>
      </div>
      {error && <p className="text-red-400 text-sm mb-4 font-mono">{error}</p>}
      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-muted-foreground" /></div>
      ) : submissions.length === 0 ? (
        <div className="py-16 text-center">
          <Mail size={32} className="text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-muted-foreground text-sm">No contact submissions yet.</p>
          <p className="text-muted-foreground text-xs mt-1">When someone fills out the Contact Us form on the site, they'll appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map(s => (
            <div key={s.id} className="bg-background border border-white/10 rounded-sm p-4 flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-primary text-sm font-bold">{s.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold">{s.name}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                  <a href={`tel:${s.phone}`} className="text-muted-foreground text-sm hover:text-white transition-colors">{s.phone}</a>
                  <a href={`mailto:${s.email}`} className="text-muted-foreground text-sm hover:text-white transition-colors">{s.email}</a>
                </div>
                {s.message && (
                  <p className="text-muted-foreground text-sm mt-2 italic border-l-2 border-primary/30 pl-3">{s.message}</p>
                )}
                <p className="text-muted-foreground text-xs mt-1 font-mono">{formatDate(s.createdAt)}</p>
              </div>
              <button
                onClick={() => handleDelete(s.id)}
                className="p-2 text-muted-foreground hover:text-red-400 transition-colors shrink-0"
                title="Delete submission"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- Dashboard Shell ----
export default function AdminDashboard() {
  const { logout } = useAuth();
  const [tab, setTab] = useState<"events" | "businesses" | "submissions" | "contacts">("events");
  const [businessesKey, setBusinessesKey] = useState(0);

  const tabs = [
    { key: "events" as const, label: "Events" },
    { key: "businesses" as const, label: "Business Listings" },
    { key: "submissions" as const, label: "Listing Requests" },
    { key: "contacts" as const, label: "Contact Submissions" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-white/10 bg-card sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <img src="/orale-logo.png" alt="Órale Network" className="h-7 object-contain" />
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest hidden sm:block">Admin Panel</span>
          </div>
          <button onClick={logout} className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-white transition-colors font-mono uppercase tracking-widest">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </header>

      <div className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 flex gap-6 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${tab === t.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-white"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {tab === "events" && <EventsTab />}
        {tab === "businesses" && <BusinessesTab key={businessesKey} />}
        {tab === "submissions" && (
          <SubmissionsTab
            onPromoted={() => {
              setBusinessesKey(k => k + 1);
            }}
          />
        )}
        {tab === "contacts" && <ContactTab />}
      </main>
    </div>
  );
}
