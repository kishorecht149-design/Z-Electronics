import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ContactPage() {
  return (
    <div className="page-shell py-16">
      <h1 className="text-5xl font-semibold text-white">Contact</h1>
      <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <GlassCard className="space-y-4">
          <p className="text-xl font-semibold text-white">Sales and support</p>
          <p className="text-sm leading-7 text-white/60">WhatsApp sales, bulk procurement inquiries, order support and startup sourcing assistance.</p>
          <p className="text-sm text-white/70">support@zelectronics.dev</p>
          <p className="text-sm text-white/70">+91 98765 43210</p>
        </GlassCard>
        <GlassCard className="space-y-4">
          <Input placeholder="Your name" />
          <Input placeholder="Email" />
          <Input placeholder="Subject" />
          <textarea className="min-h-40 rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white outline-none" placeholder="How can we help?" />
          <Button>Send Message</Button>
        </GlassCard>
      </div>
    </div>
  );
}
