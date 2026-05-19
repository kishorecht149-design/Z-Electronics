"use client";

import type { Route } from "next";
import Link from "next/link";
import { Menu, MoonStar, Search, ShoppingCart, SunMedium, User } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cart-store";

const links = [
  { href: "/categories", label: "Categories" },
  { href: "/shop", label: "Kits" },
  { href: "/shop", label: "Projects" },
  { href: "/shop", label: "Brands" },
  { href: "/contact", label: "Support" }
] as const satisfies ReadonlyArray<{ href: Route; label: string }>;

export function SiteHeader() {
  const { theme, setTheme } = useTheme();
  const count = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));

  return (
    <>
      <div className="bg-violet-600 px-4 py-2 text-center text-xs font-medium text-white sm:px-6 lg:px-8">
        <p>Flash Sale: Get 15% off student starter kits with code <span className="font-bold">MAKER15</span></p>
      </div>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/75 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 md:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-pink shadow-glow text-lg font-bold text-white">
              Z
            </div>
            <div>
              <p className="text-base font-semibold text-white">Z Electronics</p>
              <p className="text-xs text-white/50">Powered by Young Minds</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {links.map((link) => (
              <Link key={link.label} href={link.href} className="text-sm font-medium text-white/70 transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden flex-1 items-center justify-end gap-3 md:flex">
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <Input className="pl-11 border-white/10 bg-white/5 placeholder:text-white/40" placeholder="Search ICs, boards, sensors..." />
            </div>
            <button
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
            </button>
            <Link
              href="/dashboard"
              className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <User className="h-4 w-4" />
            </Link>
            <Link
              href="/cart"
              className="relative rounded-2xl border border-white/10 bg-white/5 p-3 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-pink px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            </Link>
          </div>

          <button className="ml-auto rounded-2xl border border-white/10 bg-white/5 p-3 text-white/70 lg:hidden">
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </header>
    </>
  );
}
