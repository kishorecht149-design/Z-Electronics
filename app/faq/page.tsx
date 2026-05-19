import { GlassCard } from "@/components/ui/card";

const faqs = [
  ["Are the components genuine?", "Products are sourced from verified distributors and catalog quality is curated around traceability."],
  ["Can I place bulk orders?", "Yes. Bulk inquiry flows, couponing and admin-side quote management are part of the architecture."],
  ["Which payment methods are supported?", "Razorpay, Stripe and UPI are integrated in the platform design."],
  ["Do you provide datasheets?", "Each technical product detail page supports datasheet links and specification tables."]
];

export default function FAQPage() {
  return (
    <div className="page-shell py-16">
      <h1 className="text-5xl font-semibold text-white">FAQ</h1>
      <div className="mt-10 space-y-4">
        {faqs.map(([question, answer]) => (
          <GlassCard key={question}>
            <p className="text-lg font-semibold text-white">{question}</p>
            <p className="mt-3 text-sm leading-7 text-white/60">{answer}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
