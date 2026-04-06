"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo / Title */}
        <div className="text-center space-y-2">
          <div className="text-4xl mb-4">⚔️</div>
          <h1 className="font-display text-sm text-foreground leading-relaxed">
            STATUS<br />LEVELING
          </h1>
          <p className="text-muted-foreground text-sm">
            Level up your life, one hour at a time.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-6">
          {sent ? (
            <div className="text-center space-y-3">
              <div className="text-3xl">📬</div>
              <p className="font-display text-xs text-foreground">CHECK YOUR EMAIL</p>
              <p className="text-sm text-muted-foreground">
                Magic link sent to <strong className="text-foreground">{email}</strong>.
                Click the link to enter your dashboard.
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-display text-muted-foreground">
                  EMAIL ADDRESS
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !email}
                className="w-full rounded-md bg-primary text-primary-foreground py-2.5 text-xs font-display disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                {loading ? "SENDING..." : "SEND MAGIC LINK"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          No password required. No bullshit.
        </p>
      </div>
    </div>
  );
}
