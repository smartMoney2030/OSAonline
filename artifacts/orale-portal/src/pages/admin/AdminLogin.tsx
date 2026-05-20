import { useState } from "react";
import { useLocation } from "wouter";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, navigate] = useLocation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Login failed");
      localStorage.setItem("orale_admin_token", data.token);
      navigate("/admin/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <img src="/orale-logo.png" alt="Órale Network" className="h-16 object-contain mx-auto mb-6" />
          <h1 className="text-2xl font-display text-white">Admin Panel</h1>
          <p className="text-muted-foreground text-sm mt-1">Sign in to manage your site content</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-white/10 rounded-sm p-8 space-y-5">
          <div>
            <label className="block text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-white/10 rounded-sm px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              placeholder="Enter admin password"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 font-mono">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-primary-foreground font-bold font-display uppercase tracking-wider hover:bg-primary/90 transition-all active:scale-95 rounded-sm disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
