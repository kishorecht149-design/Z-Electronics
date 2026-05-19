"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, Package, ShoppingCart, Tag, Users } from "lucide-react";
import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { GlassCard } from "@/components/ui/card";
import { adminService } from "@/services/admin.service";
import { formatCurrency } from "@/lib/utils";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-amber-500",
  Confirmed: "bg-blue-500",
  Packed: "bg-indigo-500",
  Shipped: "bg-violet-500",
  "Out for Delivery": "bg-orange-500",
  Delivered: "bg-emerald-500",
  Cancelled: "bg-red-500",
  Refunded: "bg-pink-500"
};

export default function AdminPage() {
  const { data: res, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => adminService.getDashboard(),
    refetchInterval: 60000 // refresh every 60s
  });

  const data = res?.data;

  const statCards = [
    {
      label: "Total Users",
      value: data?.totals?.users?.toLocaleString() ?? "—",
      sub: "Registered accounts",
      icon: Users,
      color: "from-violet-600 to-violet-800"
    },
    {
      label: "Products",
      value: data?.totals?.products?.toLocaleString() ?? "—",
      sub: "Active catalog",
      icon: Package,
      color: "from-blue-600 to-blue-800"
    },
    {
      label: "Orders",
      value: data?.totals?.orders?.toLocaleString() ?? "—",
      sub: "All time",
      icon: ShoppingCart,
      color: "from-pink-600 to-pink-800"
    },
    {
      label: "Coupons",
      value: data?.totals?.coupons?.toLocaleString() ?? "—",
      sub: "Active promotions",
      icon: Tag,
      color: "from-emerald-600 to-emerald-800"
    }
  ];

  if (isLoading) {
    return (
      <div className="page-shell py-16 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
      </div>
    );
  }

  // Build revenue chart
  const revenueChart: number[] = data?.revenueChart ?? Array(12).fill(0);
  const maxRev = Math.max(...revenueChart, 1);

  // Category mix total for percentages
  const catTotal = data?.categoryMix?.reduce((s: number, c: any) => s + c.value, 0) || 1;

  return (
    <div className="page-shell py-16">
      <AdminShell title="Analytics Overview">
        {/* Stat Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          {statCards.map(({ label, value, sub, icon: Icon, color }) => (
            <GlassCard key={label} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/50">{label}</p>
                  <p className="mt-2 text-3xl font-bold text-white">{value}</p>
                  <p className="mt-1 text-xs text-white/40">{sub}</p>
                </div>
                <div className={`rounded-2xl bg-gradient-to-br ${color} p-3`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Revenue KPIs */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <GlassCard className="p-5">
            <p className="text-xs text-white/50 uppercase tracking-widest mb-2">This Month Revenue</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(data?.thisMonthRevenue ?? 0)}</p>
            <p className="mt-1 text-sm text-emerald-400">{data?.revenueGrowth ?? "—"} vs last month</p>
          </GlassCard>
          <GlassCard className="p-5">
            <p className="text-xs text-white/50 uppercase tracking-widest mb-2">Avg Order Value</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(data?.aov ?? 0)}</p>
            <p className="mt-1 text-sm text-white/40">Per paid order</p>
          </GlassCard>
          <GlassCard className="p-5">
            <p className="text-xs text-white/50 uppercase tracking-widest mb-2">Order Status</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(data?.orderStatusMix ?? []).slice(0, 4).map((s: any) => (
                <div key={s.label} className="flex items-center gap-1.5">
                  <div className={`h-2 w-2 rounded-full ${STATUS_COLORS[s.label] || "bg-white/30"}`} />
                  <span className="text-xs text-white/70">{s.label}: <span className="font-medium text-white">{s.count}</span></span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          {/* Revenue Bar Chart */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-violet-300">Monthly Revenue</p>
                <p className="mt-1 text-xl font-semibold text-white">Year-to-Date Performance</p>
              </div>
            </div>
            <div className="flex h-52 items-end gap-2">
              {revenueChart.map((val, i) => {
                const pct = maxRev > 0 ? (val / maxRev) * 100 : 0;
                const isCurrentMonth = i === new Date().getMonth();
                return (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-700 ${isCurrentMonth ? "bg-gradient-to-t from-violet-600 to-pink" : "bg-white/10 hover:bg-white/20"}`}
                      style={{ height: `${Math.max(pct, 2)}%` }}
                      title={`${MONTH_LABELS[i]}: ${formatCurrency(val)}`}
                    />
                    <span className={`text-[9px] ${isCurrentMonth ? "text-violet-300" : "text-white/30"}`}>
                      {MONTH_LABELS[i]}
                    </span>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Category Mix */}
          <GlassCard className="p-6">
            <p className="text-xs uppercase tracking-widest text-violet-300 mb-1">Sales Mix</p>
            <p className="text-xl font-semibold text-white mb-6">Top Categories</p>
            {(data?.categoryMix ?? []).length === 0 ? (
              <p className="text-sm text-white/40 py-8 text-center">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {(data?.categoryMix ?? []).map((cat: any, i: number) => {
                  const pct = Math.round((cat.value / catTotal) * 100);
                  const gradients = [
                    "from-violet-600 to-pink",
                    "from-blue-600 to-violet-600",
                    "from-emerald-600 to-blue-600",
                    "from-amber-500 to-emerald-600",
                    "from-pink to-amber-500",
                    "from-indigo-600 to-pink"
                  ];
                  return (
                    <div key={cat.label}>
                      <div className="mb-1.5 flex justify-between text-xs text-white/60">
                        <span className="truncate">{cat.label}</span>
                        <span className="ml-2 flex-shrink-0 font-medium text-white">{pct}% · {formatCurrency(cat.value)}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10">
                        <div
                          className={`h-1.5 rounded-full bg-gradient-to-r ${gradients[i % gradients.length]} transition-all duration-700`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCard>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Manage Products", href: "/admin/products", desc: "Add, edit, archive inventory" },
            { label: "Manage Orders", href: "/admin/orders", desc: "Update status, track fulfillment" },
            { label: "Manage Coupons", href: "/admin/marketing", desc: "Create and configure promos" }
          ].map(({ label, href, desc }) => (
            <Link key={label} href={href as any}>
              <GlassCard className="p-5 hover:border-violet-500/40 transition-all cursor-pointer group">
                <p className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">{label}</p>
                <p className="mt-1 text-xs text-white/40">{desc}</p>
              </GlassCard>
            </Link>
          ))}
        </div>
      </AdminShell>
    </div>
  );
}
