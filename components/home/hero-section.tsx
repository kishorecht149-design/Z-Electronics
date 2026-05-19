"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Clock, GraduationCap, ShieldCheck, Sparkles, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-16 md:px-6 md:pb-28 md:pt-24">
      <div className="absolute inset-0 bg-hero-grid bg-[size:80px_80px] opacity-20" />
      <div className="absolute -right-20 top-10 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="absolute left-0 top-40 h-[400px] w-[400px] rounded-full bg-pink/15 blur-[140px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <Badge className="gap-2 bg-violet-500/10 text-violet-300 border-violet-500/20">
            <GraduationCap className="h-3 w-3" /> Special Student & Academic Pricing Available
          </Badge>
          <div className="space-y-6">
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white md:text-6xl lg:text-7xl">
              Build your next big idea. <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-violet-400 to-pink bg-clip-text text-transparent">With parts you can trust.</span>
            </h1>
            <p className="max-w-xl text-lg leading-8 text-white/70">
              The premium electronics ecosystem for students, makers, and startups. Genuine components, fast shipping, and project-ready kits designed to accelerate your innovation.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/shop">
              <Button size="lg" className="h-12 px-8 text-base">
                Shop Components <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/categories">
              <Button variant="secondary" size="lg" className="h-12 px-8 text-base">
                Browse Kits
              </Button>
            </Link>
          </div>

          <div className="grid max-w-lg grid-cols-3 gap-6 pt-6 border-t border-white/10">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-white">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <span className="font-semibold">100% Genuine</span>
              </div>
              <p className="text-xs text-white/50">Verified sourcing</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-white">
                <Zap className="h-5 w-5 text-amber-400" />
                <span className="font-semibold">Fast Delivery</span>
              </div>
              <p className="text-xs text-white/50">Same-day dispatch</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-white">
                <BadgeCheck className="h-5 w-5 text-blue-400" />
                <span className="font-semibold">Expert Support</span>
              </div>
              <p className="text-xs text-white/50">By engineers</p>
            </div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}>
          <div className="relative">
            {/* Abstract PCB / Component Graphic */}
            <div className="relative z-10 grid gap-4">
              <GlassCard className="relative overflow-hidden p-6 border-white/20 bg-white/[0.02] shadow-2xl backdrop-blur-3xl">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-pink/20 blur-2xl" />
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-white text-lg">Raspberry Pi 5</h3>
                    <p className="text-sm text-white/60">8GB RAM Model</p>
                  </div>
                  <div className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-300 border border-emerald-500/30">
                    In Stock
                  </div>
                </div>
                
                {/* Visual Placeholder for Product */}
                <div className="relative h-48 w-full rounded-2xl bg-gradient-to-br from-black/60 to-black/20 border border-white/5 flex items-center justify-center overflow-hidden group">
                  <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
                  <motion.div 
                    animate={{ rotate: [0, 5, 0, -5, 0] }} 
                    transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                    className="relative w-32 h-32 rounded-lg bg-gradient-to-tr from-violet-600/40 to-pink/40 border border-white/20 shadow-[0_0_30px_rgba(139,92,246,0.3)] flex items-center justify-center"
                  >
                     <CpuIcon className="w-16 h-16 text-white/80" />
                  </motion.div>
                </div>
                
                <div className="mt-6 flex items-center justify-between">
                  <div>
                     <p className="text-sm text-white/50 line-through">₹7,999</p>
                     <p className="text-2xl font-bold text-white">₹7,499</p>
                  </div>
                  <Button size="sm" className="bg-white text-black hover:bg-white/90">Add to Cart</Button>
                </div>
              </GlassCard>

              {/* Trending popup */}
              <motion.div 
                animate={{ y: [0, -8, 0] }} 
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="absolute -right-6 bottom-12 z-20"
              >
                <div className="rounded-2xl border border-white/10 bg-ink/90 p-4 shadow-xl backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/20 text-orange-400">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white/60">Trending Now</p>
                      <p className="text-sm font-semibold text-white">Selling fast today</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Background decoration lines */}
            <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] -z-10 text-white/5" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="200" cy="200" r="150" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="200" cy="200" r="100" stroke="currentColor" strokeWidth="1" />
              <path d="M200 50 L200 350 M50 200 L350 200" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CpuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="16" x="4" y="4" rx="2" />
      <rect width="6" height="6" x="9" y="9" rx="1" />
      <path d="M15 2v2" />
      <path d="M15 20v2" />
      <path d="M2 15h2" />
      <path d="M2 9h2" />
      <path d="M20 15h2" />
      <path d="M20 9h2" />
      <path d="M9 2v2" />
      <path d="M9 20v2" />
    </svg>
  )
}
