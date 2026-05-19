import { GlassCard } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="page-shell py-16">
      <h1 className="text-5xl font-semibold text-white">About Z Electronics</h1>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <p className="text-lg leading-8 text-white/70">
            Z Electronics is a premium electronics marketplace focused on discoverability, trust and operational clarity for component buyers.
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-lg leading-8 text-white/70">
            Built with state-of-the-art engineering, the platform blends startup-grade UI, procurement-friendly product data and a scalable admin backbone.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
