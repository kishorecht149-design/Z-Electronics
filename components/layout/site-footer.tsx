import type { Route } from "next";
import Link from "next/link";
import { Instagram, Linkedin, MessageCircleMore, Twitter } from "lucide-react";

import { BrandLogo } from "@/components/branding/brand-logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1.3fr_1fr_1fr_1fr] md:px-6">
        <div className="space-y-4">
          <BrandLogo
            titleClassName="text-xl font-semibold text-white"
            subtitleClassName="text-sm text-white/55"
            imageClassName="h-14 w-14 rounded-2xl object-cover"
          />
          <p className="max-w-sm text-sm leading-7 text-white/60">
            A premium marketplace for builders, engineers, students, and startups sourcing trusted electronics components with startup-speed fulfillment.
          </p>
          <div className="flex gap-3 text-white/70">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3"><Twitter className="h-4 w-4" /></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3"><Instagram className="h-4 w-4" /></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3"><Linkedin className="h-4 w-4" /></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3"><MessageCircleMore className="h-4 w-4" /></div>
          </div>
        </div>

        <FooterCol
          title="Store"
          links={[
            ["/shop", "Shop All"],
            ["/categories", "Categories"],
            ["/wishlist", "Wishlist"],
            ["/tracking/TRKZE128475", "Track Order"]
          ]}
        />
        <FooterCol
          title="Company"
          links={[
            ["/about", "About"],
            ["/contact", "Contact"],
            ["/faq", "FAQ"],
            ["/privacy-policy", "Privacy Policy"]
          ]}
        />
        <FooterCol
          title="Support"
          links={[
            ["/terms-and-conditions", "Terms"],
            ["/dashboard", "Dashboard"],
            ["/admin", "Admin"],
            ["/checkout", "Checkout"]
          ]}
        />
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-white/45">
        2026 Z Electronics. Built for production-ready commerce architecture.
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links
}: {
  title: string;
  links: readonly [string, string][];
}) {
  return (
    <div>
      <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/40">{title}</h4>
      <div className="space-y-3">
        {links.map(([href, label]) => (
          <Link key={href} href={href as Route} className="block text-sm text-white/65 transition hover:text-violet-200">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
