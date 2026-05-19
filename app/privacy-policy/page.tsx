import { GlassCard } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="page-shell py-16">
      <h1 className="text-5xl font-semibold text-white">Privacy Policy</h1>
      <GlassCard className="mt-10 space-y-4 text-sm leading-7 text-white/65">
        <p>We collect only the operational data required for authentication, checkout, fulfillment, support and analytics.</p>
        <p>JWT-based sessions, hashed passwords and role-scoped access are used across the architecture.</p>
        <p>Payment provider secrets stay server-side and customer-facing applications consume only public keys where required.</p>
      </GlassCard>
    </div>
  );
}
