"use client";

import { useEffect, useState } from "react";
import { Lock, ShieldAlert, KeyRound, Loader2, ArrowRight } from "lucide-react";

import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check session authorization on load
    const auth = sessionStorage.getItem("z_admin_authorized");
    if (auth === "true") {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulated quick check for premium experience
    setTimeout(() => {
      // Secure Admin Credentials
      if (userId === "admin" && password === "SecureAdminPass2026!") {
        sessionStorage.setItem("z_admin_authorized", "true");
        setIsAuthorized(true);
      } else {
        setError("Invalid Admin User ID or Password");
      }
      setIsLoading(false);
    }, 800);
  };

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
      </div>
    );
  }

  if (!isAuthorized) {
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
                <label className="text-xs text-white/60 mb-2 block uppercase tracking-wider">Admin User ID</label>
                <Input
                  type="text"
                  placeholder="Enter admin ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
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

              <Button type="submit" className="w-full h-11" disabled={isLoading}>
                {isLoading ? (
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
                <span className="font-mono text-white/50">admin</span> / <span className="font-mono text-white/50">SecureAdminPass2026!</span>
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
