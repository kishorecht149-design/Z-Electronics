import type { Route } from "next";
import Link from "next/link";
import { Heart, House, PackageSearch, ShoppingBag, UserRound } from "lucide-react";

const items = [
  { href: "/", icon: House, label: "Home" },
  { href: "/shop", icon: ShoppingBag, label: "Shop" },
  { href: "/wishlist", icon: Heart, label: "Wishlist" },
  { href: "/tracking/TRKZE128475", icon: PackageSearch, label: "Track" },
  { href: "/dashboard", icon: UserRound, label: "Account" }
] as const;

export function MobileBottomNav() {
  return (
    <div className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 rounded-3xl border border-white/10 bg-ink/80 px-2 py-2 shadow-card backdrop-blur-2xl md:hidden">
      <div className="grid grid-cols-5 gap-1">
        {items.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href as Route} className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] text-white/65">
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
