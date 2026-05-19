"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-16 md:px-6 md:pb-28 md:pt-24">
      <div className="absolute inset-0 bg-hero-grid bg-[size:80px_80px] opacity-20" />
      <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-violet-600/25 blur-[120px]" />
      <div className="absolute left-0 top-40 h-80 w-80 rounded-full bg-pink/15 blur-[140px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <Badge className="gap-2"><Sparkles className="h-3 w-3" /> Launch-ready electronics commerce</Badge>
          <div className="space-y-6">
            <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.04em] text-white md:text-7xl">
              Everything Electronics. <span className="bg-gradient-to-r from-violet-300 to-pink bg-clip-text text-transparent">One Smart Store.</span>
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-white/65">
              Affordable genuine electronics components for engineers, makers, and innovators. Designed like a premium startup storefront with procurement-grade depth.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/shop"><Button>Explore Catalog <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
            <Link href="/admin"><Button variant="secondary">View Admin Dashboard</Button></Link>
          </div>

          <div className="grid max-w-xl grid-cols-3 gap-4 pt-4">
            {[
              ["10K+", "Components listed"],
              ["24hr", "Dispatch on stocked SKUs"],
              ["99.2%", "Order accuracy"]
            ].map(([value, label]) => (
              <div key={label}>
                <p className="text-3xl font-semibold text-white">{value}</p>
                <p className="text-sm text-white/55">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <GlassCard className="relative overflow-hidden p-0">
            <div className="absolute -left-10 top-10 h-24 w-24 rounded-full bg-violet-500/25 blur-3xl" />
            <div className="absolute right-0 top-0 h-full w-px bg-white/10" />
            <div className="grid gap-5 p-6">
              <motion.div className="rounded-[26px] border border-white/10 bg-gradient-to-br from-violet-500/15 to-transparent p-6" animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 6 }}>
                <p className="text-xs uppercase tracking-[0.35em] text-violet-200">Realtime Demand Pulse</p>
                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <p className="text-4xl font-semibold text-white">1,284</p>
                    <p className="text-sm text-emerald-300">+18% weekly demand</p>
                  </div>
                  <div className="flex h-24 items-end gap-2">
                    {[40, 55, 35, 72, 68, 94, 88].map((height, index) => (
                      <div
                        key={height}
                        className="w-5 rounded-t-full bg-gradient-to-t from-violet-600 to-pink"
                        style={{ height }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              <div className="grid gap-4 md:grid-cols-2">
                <GlassCard className="p-5">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/45">Flash Deals</p>
                  <p className="mt-3 text-2xl font-semibold text-white">42 active</p>
                  <p className="mt-2 text-sm text-white/60">AI-ranked bundles on student and lab kits.</p>
                </GlassCard>
                <GlassCard className="p-5">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/45">Fulfillment</p>
                  <p className="mt-3 text-2xl font-semibold text-white">Same-day</p>
                  <p className="mt-2 text-sm text-white/60">For in-stock boards, sensors and converter modules.</p>
                </GlassCard>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
