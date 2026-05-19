import { ArrowRight, BadgePercent, Cpu, ShieldCheck, Star, Zap } from "lucide-react";
import Link from "next/link";

import { HeroSection } from "@/components/home/hero-section";
import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { brands, categories, products, testimonials } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <div>
      <HeroSection />

      <section className="page-shell py-16">
        <SectionHeading
          eyebrow="Top Categories"
          title="Purpose-built for fast hardware sourcing"
          description="Catalog experiences designed for startup teams, engineering labs, workshop organizers, and serious makers."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <GlassCard key={category.id} className="group">
              <div className="flex items-center justify-between">
                <div className="rounded-3xl bg-violet-500/15 p-4 text-violet-200">
                  <Cpu className="h-6 w-6" />
                </div>
                <ArrowRight className="h-4 w-4 text-white/35 transition group-hover:translate-x-1 group-hover:text-white" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-white">{category.name}</h3>
              <p className="mt-3 text-sm leading-7 text-white/60">{category.description}</p>
              <p className="mt-6 text-sm text-violet-200">{category.productCount} live SKUs</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03] py-16">
        <div className="page-shell">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <SectionHeading
              eyebrow="Flash Deals"
              title="Limited-time offers on fast-moving components"
              description="Student-friendly pricing, curated bundles and promo stacking across workshops and startup prototyping."
            />
            <div className="rounded-full bg-pink px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white">
              11:42:18 left
            </div>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {products.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell py-16">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <SectionHeading
            eyebrow="Best Sellers"
            title="High-confidence parts teams reorder often"
            description="Popular boards, converter modules and sensors with strong ratings, verified inventory, and datasheet-first detail pages."
          />
          <Link href="/shop"><Button variant="secondary">Browse Catalog</Button></Link>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="page-shell py-16">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <GlassCard className="space-y-6">
            <SectionHeading
              eyebrow="Founder Story"
              title="Built by builders who know the sourcing pain"
              description="Z Electronics was imagined as a startup-grade hardware marketplace with cleaner trust signals, better merchandising, and serious post-purchase visibility."
            />
            <p className="text-sm leading-7 text-white/65">
              Powered by Young Minds, the platform blends modern commerce UX with practical electronics buying tools: stock visibility, comparison tables, bulk order workflows, and admin analytics that help operations scale.
            </p>
          </GlassCard>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              { label: "Verified sourcing", icon: ShieldCheck },
              { label: "Startup-grade pricing", icon: BadgePercent },
              { label: "Performance-first UX", icon: Zap },
              { label: "4.9 customer trust", icon: Star }
            ].map(({ label, icon: Icon }) => (
              <GlassCard key={label} className="flex items-center gap-4">
                <div className="rounded-3xl bg-violet-500/15 p-4 text-violet-200">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">{label}</p>
                  <p className="text-sm text-white/55">Operationally tuned for trustworthy electronics fulfillment.</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell py-16">
        <SectionHeading
          eyebrow="Featured Bundles"
          title="Curated starter kits for faster prototypes"
          description="Bundle-based merchandising improves AOV while making it easier for students and founders to buy complete working sets."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {[
            ["IoT Launch Kit", "ESP32, sensors, buck module, jumper set", "Save 14%"],
            ["Embedded Lab Pack", "Pico W, IMU, breadboard, debugging essentials", "Save 11%"],
            ["Power Builder Bundle", "Converter boards, regulators, test accessories", "Save 9%"]
          ].map(([title, copy, badge]) => (
            <GlassCard key={title}>
              <p className="text-xs uppercase tracking-[0.35em] text-violet-300">{badge}</p>
              <h3 className="mt-4 text-2xl font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/60">{copy}</p>
              <Link href="/checkout" className="mt-6 inline-flex text-sm font-medium text-violet-200">
                Build this bundle
              </Link>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="page-shell py-16">
        <SectionHeading
          eyebrow="Testimonials"
          title="Trusted by labs, founders and student innovators"
          description="A high-signal storefront matters when hardware timelines are tight."
          align="center"
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {testimonials.map((item) => (
            <GlassCard key={item.id}>
              <div className="mb-4 text-amber-300">★★★★★</div>
              <p className="text-sm leading-7 text-white/65">{item.quote}</p>
              <div className="mt-6">
                <p className="font-semibold text-white">{item.name}</p>
                <p className="text-sm text-white/45">{item.role}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="page-shell py-16">
        <GlassCard className="overflow-hidden">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-violet-300">Newsletter</p>
              <h2 className="mt-4 text-4xl font-semibold text-white">Product drops, coupon launches and kit bundles.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60">
                Join procurement notes, launch offers, restock alerts and engineering workshop updates curated for serious builders.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <input
                className="h-12 min-w-[260px] rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none"
                placeholder="Enter your email"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </GlassCard>
      </section>

      <section className="page-shell pb-24 pt-6">
        <div className="grid gap-4 rounded-[32px] border border-white/10 bg-white/[0.03] p-6 md:grid-cols-4">
          {brands.map((brand) => (
            <div key={brand.id} className="rounded-3xl border border-white/10 bg-black/10 p-5 text-center text-white/70">
              {brand.name}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
