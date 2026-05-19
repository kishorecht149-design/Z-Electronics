import { ArrowRight, BookOpen, GraduationCap, ShieldCheck, Star, Users, Video, Wrench, Zap, Component, Cpu } from "lucide-react";
import Link from "next/link";

import { HeroSection } from "@/components/home/hero-section";
import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { brands, products, testimonials } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <div>
      <HeroSection />

      {/* D. SOCIAL PROOF */}
      <section className="border-y border-white/5 bg-white/[0.02] py-10">
        <div className="page-shell">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-5 text-center">
            <div>
              <p className="text-3xl font-bold text-white">50k+</p>
              <p className="mt-1 text-xs text-white/50 uppercase tracking-wider">Makers Served</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">120k</p>
              <p className="mt-1 text-xs text-white/50 uppercase tracking-wider">Orders Delivered</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">4.9/5</p>
              <p className="mt-1 text-xs text-white/50 uppercase tracking-wider">Component Quality</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">200+</p>
              <p className="mt-1 text-xs text-white/50 uppercase tracking-wider">Colleges Using Us</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">10M+</p>
              <p className="mt-1 text-xs text-white/50 uppercase tracking-wider">Parts Shipped</p>
            </div>
          </div>
        </div>
      </section>

      {/* E. SHOP BY CATEGORY */}
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
          {[
            { name: "Arduino Ecosystem", icon: Cpu, count: "124 items" },
            { name: "Raspberry Pi", icon: Component, count: "58 items" },
            { name: "Sensors & Modules", icon: Zap, count: "342 items" },
            { name: "Robotics", icon: Wrench, count: "89 items" },
            { name: "IoT Devices", icon: Zap, count: "156 items" },
            { name: "Power Management", icon: Zap, count: "210 items" },
            { name: "Tools & Testing", icon: Wrench, count: "75 items" },
            { name: "Starter Kits", icon: BookOpen, count: "42 items" }
          ].map((cat) => (
            <Link key={cat.name} href="/categories">
              <GlassCard className="group flex items-center gap-4 transition-all hover:bg-white/10 hover:border-violet-500/30">
                <div className="rounded-xl bg-white/5 p-3 text-violet-300 group-hover:bg-violet-500/20 group-hover:text-violet-200 transition-colors">
                  <cat.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{cat.name}</h3>
                  <p className="text-xs text-white/50">{cat.count}</p>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </section>

      {/* F. TRENDING PRODUCTS */}
      <section className="border-t border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent py-24">
        <div className="page-shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="High Demand"
              title="Trending & New Arrivals"
              description="The components builders are buying right now. Stock updates daily."
            />
            <Link href="/shop"><Button variant="secondary">View All Products</Button></Link>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* G. PROJECT-BASED SHOPPING */}
      <section className="page-shell py-24">
        <SectionHeading
          eyebrow="Solutions"
          title="Project-Based Kits"
          description="Don't just buy components. Buy the complete solution for your next big build."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {[
            {
              title: "Autonomous Robotics Starter Kit",
              desc: "Everything you need to build your first obstacle-avoiding, line-following robot. Includes chassis, motors, Arduino Uno, sensors, and code library.",
              tags: ["Beginner Friendly", "Arduino"],
              image: "bg-gradient-to-br from-blue-900/40 to-blue-600/10"
            },
            {
              title: "Smart Home IoT Sensor Network",
              desc: "Build a complete environmental monitoring system with ESP32, temperature/humidity sensors, OLED displays, and MQTT cloud integration.",
              tags: ["Intermediate", "ESP32", "WiFi"],
              image: "bg-gradient-to-br from-violet-900/40 to-violet-600/10"
            },
            {
              title: "College Final Year Project Lab",
              desc: "The ultimate component assortment for engineering students. Avoid last-minute sourcing panics with our comprehensive lab kit.",
              tags: ["Academic", "Comprehensive"],
              image: "bg-gradient-to-br from-emerald-900/40 to-emerald-600/10"
            },
            {
              title: "Advanced Power Supply Builder",
              desc: "Design and assemble your own adjustable bench power supply. Includes transformers, regulators, digital displays, and safety enclosures.",
              tags: ["Advanced", "Power"],
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
                <Button className="bg-white text-black hover:bg-white/90">View Kit Details</Button>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* H. WHY TRUST Z ELECTRONICS */}
      <section className="border-y border-white/5 bg-black/40 py-24">
        <div className="page-shell">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeading
                eyebrow="The Z Electronics Standard"
                title="Built for Serious Engineering"
                description="We know the pain of fake chips, missing datasheets, and delayed shipments. We built the store we wanted to buy from."
              />
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                {[
                  { title: "Genuine Parts", desc: "Sourced directly from authorized distributors. No clones." },
                  { title: "Rigorous Testing", desc: "In-house quality checks before bulk shipments." },
                  { title: "Student Pricing", desc: "Special discounts for verified academic emails." },
                  { title: "Expert Support", desc: "Talk to real engineers when you get stuck." }
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
            <div className="relative h-full min-h-[400px] rounded-3xl border border-white/10 bg-gradient-to-br from-violet-900/20 to-black overflow-hidden flex items-center justify-center p-8">
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10"></div>
              <div className="text-center relative z-10 space-y-6">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-pink shadow-[0_0_50px_rgba(139,92,246,0.3)]">
                  <ShieldCheck className="h-10 w-10 text-white" />
                </div>
                <p className="text-xl font-medium text-white/80">"Quality components accelerate innovation."</p>
                <p className="text-sm text-white/50">— The Z Electronics Founding Team</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* I. COMMUNITY / LEARNING */}
      <section className="page-shell py-24">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <SectionHeading
            eyebrow="Knowledge Base"
            title="Learn & Build"
            description="Tutorials, datasheets, and guides to help you master your components."
          />
          <Button variant="secondary">Visit Learning Hub</Button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { type: "Video Tutorial", title: "Getting Started with ESP32 & WiFi", time: "15 min watch", icon: Video },
            { type: "Engineering Guide", title: "How to Choose the Right Voltage Regulator", time: "8 min read", icon: BookOpen },
            { type: "Project Walkthrough", title: "Building a Custom Mechanical Keyboard", time: "Detailed Guide", icon: Users }
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

      {/* J. TESTIMONIALS */}
      <section className="border-t border-white/5 bg-white/[0.02] py-24">
        <div className="page-shell">
          <SectionHeading
            eyebrow="Community Trust"
            title="What Engineers Are Saying"
            description="Real feedback from the people building the future with our parts."
            align="center"
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <GlassCard key={item.id} className="relative">
                <div className="absolute -left-2 -top-2 text-6xl text-white/5">"</div>
                <div className="mb-4 flex gap-1 text-amber-400">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
                <p className="relative z-10 text-sm leading-relaxed text-white/70">"{item.quote}"</p>
                <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-4">
                  <div className="h-10 w-10 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-200 font-bold">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{item.name}</p>
                    <p className="text-xs text-white/50">{item.role}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
