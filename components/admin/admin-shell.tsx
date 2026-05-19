import type { Route } from "next";
import Link from "next/link";
import {
  Boxes,
  ChartColumn,
  LayoutDashboard,
  Percent,
  ShoppingCart,
  Users
} from "lucide-react";

import { GlassCard } from "@/components/ui/card";

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Boxes },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/inventory", label: "Inventory", icon: ChartColumn },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/marketing", label: "Coupons & Offers", icon: Percent }
] as const satisfies ReadonlyArray<{ href: Route; label: string; icon: typeof LayoutDashboard }>;

export function AdminShell({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <GlassCard className="h-fit p-4">
        <div className="mb-6 border-b border-white/10 pb-5">
          <p className="text-lg font-semibold text-white">Z Admin</p>
          <p className="text-sm text-white/50">Secure operations workspace</p>
        </div>
        <nav className="space-y-2">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </GlassCard>

      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-violet-300">Admin Dashboard</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
