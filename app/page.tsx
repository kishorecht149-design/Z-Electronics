"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BookOpen, GraduationCap, ShieldCheck, Star, Users, Video, Wrench, Zap, Component, Cpu, Loader2 } from "lucide-react";
import Link from "next/link";

import { HeroSection } from "@/components/home/hero-section";
import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { catalogService } from "@/services/catalog.service";
import { useProducts } from "@/hooks/use-products";

export default function HomePage() {
  const { data: products, isLoading } = useProducts({ limit: 4 });
  const { data: categoriesRes } = useQuery({
    queryKey: ["home-categories"],
    queryFn: () => catalogService.getCategories()
  });
  const categories = (categoriesRes?.data ?? []).slice(0, 8);

  return (
    <div>
      <HeroSection />

      {/* E. SHOP BY ECOSYSTEM */}
      <section className="page-shell py-24">
        <div className="flex flex-col items-center text-center">
          <SectionHeading
            eyebrow="Component Library"
            title="Shop by Ecosystem"
            description="Premium parts for every stage of your build, from prototyping to production."
            align="center"
          />
        </div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.length ? categories.map((cat: any) => (
            <Link key={cat.name} href={`/shop?category=${cat._id}`}>
              <GlassCard className="group flex items-center gap-4 transition-all hover:bg-white/10 hover:border-violet-500/30">
                <div className="rounded-xl bg-white/5 p-3 text-violet-300 group-hover:bg-violet-500/20 group-hover:text-violet-200 transition-colors">
                  <Cpu className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{cat.name}</h3>
                  <p className="text-xs text-white/50">{cat.productCount ?? 0} live products</p>
                </div>
              </GlassCard>
            </Link>
          )) : (
            <GlassCard className="sm:col-span-2 lg:col-span-4">
              <p className="text-sm text-white/55">No live categories yet. Create categories from the admin workspace to populate this section.</p>
            </GlassCard>
          )}
        </div>
      </section>

      {/* F. TRENDING PRODUCTS */}
      <section className="border-t border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent py-24">
        <div className="page-shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="High Demand"
              title="Trending & New Arrivals"
              description="Genuine components, verified specifications, and real-time inventory tracking."
            />
            <Link href="/shop"><Button variant="secondary">View All Products</Button></Link>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
            </div>
          ) : !products || products.length === 0 ? (
            <div className="text-center py-16 text-white/40">
              No products found in the catalog.
            </div>
          ) : (
            <div className="mt-8 grid gap-3 sm:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
              {products.slice(0, 4).map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* G. PROJECT-BASED KITS */}
      <section className="page-shell py-24">
        <SectionHeading
          eyebrow="Solutions"
          title="Project-Based Kits"
          description="Ready-to-assemble electronics kits with complete schematics, source code, and verified components."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {[
            {
              title: "Autonomous Robotics Starter Kit",
              desc: "Everything you need to build an obstacle-avoiding or line-following robot. Includes chassis, motors, controller board, sensors, and full code library.",
              tags: ["Robotics", "Starter"],
              image: "bg-gradient-to-br from-blue-900/40 to-blue-600/10"
            },
            {
              title: "Smart Home IoT Sensor Network",
              desc: "Build an environmental monitoring network with ESP32, environmental sensors, OLED displays, and MQTT cloud reporting.",
              tags: ["IoT", "Intermediate"],
              image: "bg-gradient-to-br from-violet-900/40 to-violet-600/10"
            },
            {
              title: "Academic Hardware Labs Kit",
              desc: "Standard component assortments for engineering students and college labs. Avoid last-minute procurement panics.",
              tags: ["Academic", "Comprehensive"],
              image: "bg-gradient-to-br from-emerald-900/40 to-emerald-600/10"
            },
            {
              title: "Bench Power Supply Builder",
              desc: "Assemble your own adjustable laboratory power supply. Includes heavy-duty regulators, digital panels, and safety housing.",
              tags: ["Power", "Advanced"],
              image: "bg-gradient-to-br from-orange-900/40 to-orange-600/10"
            }
          ].map((kit) => (
            <GlassCard key={kit.title} className={`group relative overflow-hidden p-8 border-white/10 ${kit.image}`}>
              <div className="absolute right-0 top-0 h-[300px] w-[300px] rounded-full bg-white/5 blur-3xl mix-blend-overlay group-hover:bg-white/10 transition-colors" />
              <div className="relative z-10">
                <div className="flex gap-2 mb-4">
                  {kit.tags.map(tag => (
                    <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{kit.title}</h3>
                <p className="text-white/60 mb-8 max-w-md">{kit.desc}</p>
                <Link href="/shop">
                  <Button className="bg-white text-black hover:bg-white/90">View Kit Details</Button>
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* H. THE Z ELECTRONICS STANDARD */}
      <section className="border-t border-white/5 bg-black/40 py-24">
        <div className="page-shell">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeading
                eyebrow="The Z Electronics Standard"
                title="Built for Serious Engineering"
                description="We prioritize authentic parts, validated datasheets, and swift dispatch. We build the platform we wanted to source from ourselves."
              />
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                {[
                  { title: "Genuine Components", desc: "Sourced from fully verified distributors. No counterfeits." },
                  { title: "Quality Checked", desc: "Standard visual and electrical tests on incoming batches." },
                  { title: "Clear Documentation", desc: "Direct download links to official datasheets for all ICs." },
                  { title: "Fulfillment Speed", desc: "Rapid processing and tracking timelines automatically sent." }
                ].map((feature) => (
                  <div key={feature.title} className="flex gap-4">
                    <div className="mt-1 h-2 w-2 rounded-full bg-violet-500" />
                    <div>
                      <h4 className="font-semibold text-white">{feature.title}</h4>
                      <p className="mt-1 text-sm text-white/50">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-full min-h-[350px] rounded-3xl border border-white/10 bg-gradient-to-br from-violet-900/20 to-black overflow-hidden flex items-center justify-center p-8">
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10"></div>
              <div className="text-center relative z-10 space-y-6">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-pink shadow-[0_0_50px_rgba(139,92,246,0.3)]">
                  <ShieldCheck className="h-10 w-10 text-white" />
                </div>
                <p className="text-xl font-medium text-white/80">"Quality components accelerate innovation."</p>
                <p className="text-sm text-white/50">— The Z Electronics Team</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* I. KNOWLEDGE BASE */}
      <section className="page-shell py-24">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <SectionHeading
            eyebrow="Knowledge Base"
            title="Learn & Build"
            description="Tutorials, pinout guides, and schematics to support your embedded designs."
          />
          <Link href="/shop"><Button variant="secondary">Visit Learning Hub</Button></Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { type: "Video Tutorial", title: "Getting Started with ESP32 & WiFi Platforms", time: "15 min watch", icon: Video },
            { type: "Engineering Guide", title: "How to Select the Right Voltage Regulator", time: "8 min read", icon: BookOpen },
            { type: "Project Guide", title: "Designing Custom Mechanical Keyboards", time: "Step-by-step walk", icon: Users }
          ].map((resource) => (
            <GlassCard key={resource.title} className="group cursor-pointer hover:bg-white/10 transition-colors">
              <div className="mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-violet-300">
                <resource.icon className="h-4 w-4" />
                {resource.type}
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white group-hover:text-violet-200 transition-colors">{resource.title}</h3>
              <p className="text-sm text-white/50">{resource.time}</p>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  );
}
