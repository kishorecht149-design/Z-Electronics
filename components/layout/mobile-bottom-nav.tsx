"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, House, PackageSearch, ShoppingBag, UserRound } from "lucide-react";

const items = [
  { href: "/", icon: House, label: "Home" },
  { href: "/shop", icon: ShoppingBag, label: "Shop" },
  { href: "/wishlist", icon: Heart, label: "Wishlist" },
  { href: "/tracking/TRKZE128475", icon: PackageSearch, label: "Track" },
  { href: "/dashboard", icon: UserRound, label: "Account" }
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 w-full border-t border-white/10 bg-ink/95 pb-[env(safe-area-inset-bottom)] pt-2 px-3 shadow-2xl backdrop-blur-2xl md:hidden">
      <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
        {items.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href as Route}
              className={`flex flex-col items-center gap-1 rounded-xl py-1 text-[10px] font-medium transition-all ${isActive ? "text-violet-400" : "text-white/60 hover:text-white/80"}`}
            >
              <Icon className={`h-4.5 w-4.5 transition-transform duration-300 ${isActive ? "scale-110 text-violet-400 filter drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]" : ""}`} />
              <span className={isActive ? "font-semibold" : ""}>{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
