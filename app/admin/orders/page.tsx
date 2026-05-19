"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Loader2, PackageSearch, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

import { AdminShell } from "@/components/admin/admin-shell";
import { GlassCard } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { adminService } from "@/services/admin.service";
import { formatCurrency } from "@/lib/utils";

const ORDER_STATUSES = ["Pending", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];

const STATUS_COLORS: Record<string, string> = {
  Pending: "text-amber-300 bg-amber-500/10 border-amber-400/20",
  Confirmed: "text-blue-300 bg-blue-500/10 border-blue-400/20",
  Packed: "text-indigo-300 bg-indigo-500/10 border-indigo-400/20",
  Shipped: "text-violet-300 bg-violet-500/10 border-violet-400/20",
  "Out for Delivery": "text-orange-300 bg-orange-500/10 border-orange-400/20",
  Delivered: "text-emerald-300 bg-emerald-500/10 border-emerald-400/20",
  Cancelled: "text-red-300 bg-red-500/10 border-red-400/20",
  Refunded: "text-pink-300 bg-pink-500/10 border-pink-400/20"
};

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { data: res, isLoading } = useQuery({
    queryKey: ["admin-orders", statusFilter],
    queryFn: () => adminService.getOrders(statusFilter ? { status: statusFilter } : undefined)
  });

  const orders: any[] = res?.data || [];

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order status updated");
    },
    onError: () => toast.error("Failed to update status")
  });

  const filtered = orders.filter((o) =>
    !search ||
    o.number?.toLowerCase().includes(search.toLowerCase()) ||
    o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-shell py-16">
      <AdminShell title="Order Management">
        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
            <Input
              className="pl-9"
              placeholder="Search orders, customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white outline-none focus:border-violet-500/50 transition-colors"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <PackageSearch className="h-12 w-12 text-white/20 mb-4" />
            <p className="text-white/50">No orders found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => (
              <GlassCard key={order._id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm font-semibold text-white">{order.number}</p>
                      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[order.status] || "text-white/50 bg-white/5 border-white/10"}`}>
                        {order.status}
                      </span>
                      {order.paymentStatus === "paid" && (
                        <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-300">Paid</span>
                      )}
                    </div>
                    <p className="text-xs text-white/50">
                      {order.user?.name || "Guest"} · {order.user?.email || "—"}
                    </p>
                    <p className="text-xs text-white/40">
                      {order.items?.length ?? 0} item{order.items?.length !== 1 ? "s" : ""} ·{" "}
                      {order.createdAt ? format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a") : "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-white/50">Total</p>
                      <p className="text-lg font-semibold text-white">{formatCurrency(order.total)}</p>
                    </div>
                    {/* Status Update Dropdown */}
                    <div className="relative">
                      <select
                        className="appearance-none rounded-xl border border-white/10 bg-black/40 pl-3 pr-8 py-2 text-xs text-white outline-none focus:border-violet-500/50 transition-colors cursor-pointer"
                        value={order.status}
                        onChange={(e) => statusMutation.mutate({ id: order._id, status: e.target.value })}
                        disabled={statusMutation.isPending}
                      >
                        {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-white/40 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </AdminShell>
    </div>
  );
}
