import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { hotel } from "../../data/hotel";
import { api, ApiError, setSession, type StaffUser } from "../../lib/api";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await api<{ token: string; user: StaffUser }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setSession(data.token, data.user);
      navigate(data.user.role === "admin" ? "/admin/dashboard" : "/admin/bookings");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Sign-in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-8">
        <p className="text-xs uppercase tracking-[0.22em] text-gold">{hotel.shortName}</p>
        <h1 className="mt-2 font-serif text-3xl text-navy">Staff sign in</h1>
        <label className="mt-6 block text-sm font-medium">Email
          <input className="input mt-1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="mt-4 block text-sm font-medium">Password
          <input className="input mt-1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <p className="mt-3 text-sm text-rose-700">{error}</p>}
        <button type="submit" className="btn-navy mt-6 w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
