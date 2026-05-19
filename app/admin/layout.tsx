"use client";

import { useEffect, useState } from "react";
import { Lock, ShieldAlert, KeyRound, Loader2 } from "lucide-react";

import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth-store";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, login } = useAuthStore();
  const [email, setEmail] = useState("admin@zelectronics.dev");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const normalizedEmail = email.trim().toLowerCase() === "admin" ? "admin@zelectronics.dev" : email.trim();
      const res = await authService.login({
        email: normalizedEmail,
        password
      });

      if (res.data.user.role !== "admin" && res.data.user.role !== "staff") {
        setError("This account does not have admin access.");
        return;
      }

      login(res.data.user, res.data.token);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Database authentication failed.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && (user?.role === "admin" || user?.role === "staff")) {
      setError("");
    }
  }, [isAuthenticated, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
      </div>
    );
  }

  if (!isAuthenticated || (user?.role !== "admin" && user?.role !== "staff")) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 relative overflow-hidden bg-ink py-16">
        <div className="absolute -right-20 top-10 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[100px]" />
        <div className="absolute left-0 bottom-40 h-[300px] w-[300px] rounded-full bg-pink/10 blur-[120px]" />

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-pink shadow-glow mb-4">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Admin Workspace</h1>
            <p className="mt-2 text-sm text-white/50">Restricted administrative access gate.</p>
          </div>

          <GlassCard className="p-8 border-white/10 bg-white/[0.02]">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="text-xs text-white/60 mb-2 block uppercase tracking-wider">Admin Email</label>
                <Input
                  type="email"
                  placeholder="admin@zelectronics.dev"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-xs text-white/60 mb-2 block uppercase tracking-wider">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-pink/10 border border-pink/20 p-3 text-xs text-pink">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" className="w-full h-11" disabled={submitting}>
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <KeyRound className="h-4 w-4 mr-2" />
                )}
                Access Workspace
              </Button>
            </form>

            <div className="mt-6 border-t border-white/5 pt-4 text-center">
              <p className="text-[11px] text-white/30">
                Workspace Credentials Hint: <br />
                <span className="font-mono text-white/50">admin@zelectronics.dev</span> / <span className="font-mono text-white/50">SecurePassword123!</span>
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
