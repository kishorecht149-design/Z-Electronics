import { GlassCard } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="page-shell py-16">
      <h1 className="text-5xl font-semibold text-white">Terms & Conditions</h1>
      <GlassCard className="mt-10 space-y-4 text-sm leading-7 text-white/65">
        <p>Orders are subject to stock confirmation, fraud checks and fulfillment coverage by the selected delivery partner.</p>
        <p>Datasheets and technical recommendations assist selection but do not replace product validation in your specific circuit or manufacturing context.</p>
        <p>Coupons, launch offers and bundle pricing may vary by category, order value and campaign schedule.</p>
      </GlassCard>
    </div>
  );
}
