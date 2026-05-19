"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Tag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { adminService } from "@/services/admin.service";
import { getApiErrorMessage } from "@/services/api-client";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

export default function AdminMarketingPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: "",
    title: "",
    discountType: "percentage",
    value: "",
    minimumOrderValue: "",
    expiry: ""
  });

  const { data: res, isLoading } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: () => adminService.getCoupons()
  });

  const coupons: any[] = res?.data || [];

  const createMutation = useMutation({
    mutationFn: () => adminService.createCoupon({
      ...form,
      value: Number(form.value || 0),
      minimumOrderValue: Number(form.minimumOrderValue || 0),
      expiry: form.expiry ? new Date(form.expiry) : undefined
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast.success("Coupon created!");
      setShowForm(false);
      setForm({ code: "", title: "", discountType: "percentage", value: "", minimumOrderValue: "", expiry: "" });
    },
    onError: (error: any) => toast.error(getApiErrorMessage(error, "Failed to create coupon"))
  });

  return (
    <div className="page-shell py-16">
      <AdminShell title="Coupons & Offers">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-white/60 text-sm">{coupons.length} active promotion{coupons.length !== 1 ? "s" : ""}</p>
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" /> New Coupon
          </Button>
        </div>

        {/* Create Form */}
        {showForm && (
          <GlassCard className="p-6 mb-6 border-violet-500/30">
            <h3 className="text-base font-semibold text-white mb-4">Create Coupon</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs text-white/50 mb-1.5 block uppercase tracking-wider">Code *</label>
                <Input placeholder="MAKER15" value={form.code} onChange={(e) => setForm(p => ({...p, code: e.target.value.toUpperCase()}))} />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block uppercase tracking-wider">Title *</label>
                <Input placeholder="15% off Maker Kits" value={form.title} onChange={(e) => setForm(p => ({...p, title: e.target.value}))} />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block uppercase tracking-wider">Discount Type</label>
                <select
                  className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-sm text-white outline-none focus:border-violet-500/50"
                  value={form.discountType}
                  onChange={(e) => setForm(p => ({...p, discountType: e.target.value}))}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                  <option value="free_shipping">Free Shipping</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block uppercase tracking-wider">
                  Value {form.discountType === "percentage" ? "(%)" : form.discountType === "fixed" ? "(₹)" : ""}
                </label>
                <Input
                  type="number"
                  placeholder={form.discountType === "free_shipping" ? "0" : "15"}
                  value={form.value}
                  onChange={(e) => setForm(p => ({...p, value: e.target.value}))}
                  disabled={form.discountType === "free_shipping"}
                />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block uppercase tracking-wider">Min Order Value (₹)</label>
                <Input type="number" placeholder="500" value={form.minimumOrderValue} onChange={(e) => setForm(p => ({...p, minimumOrderValue: e.target.value}))} />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block uppercase tracking-wider">Expiry Date</label>
                <Input type="date" value={form.expiry} onChange={(e) => setForm(p => ({...p, expiry: e.target.value}))} />
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <Button
                onClick={() => createMutation.mutate()}
                disabled={
                  createMutation.isPending ||
                  !form.code ||
                  !form.title ||
                  (form.discountType !== "free_shipping" && !form.value)
                }
              >
                {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Create Coupon
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </GlassCard>
        )}

        {/* Coupon Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <Tag className="h-12 w-12 text-white/20 mb-4" />
            <p className="text-white/50">No coupons yet. Create your first promotion.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {coupons.map((coupon) => (
              <GlassCard key={coupon._id} className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-mono text-sm font-bold uppercase tracking-widest text-violet-300">{coupon.code}</p>
                    <p className="text-base font-semibold text-white mt-1">{coupon.title}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium border ${coupon.isActive ? "text-emerald-300 bg-emerald-500/10 border-emerald-400/20" : "text-white/40 bg-white/5 border-white/10"}`}>
                    {coupon.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-white/50">
                  <div>
                    <span className="text-white/30">Discount: </span>
                    <span className="text-white font-medium">
                      {coupon.discountType === "percentage" ? `${coupon.value}%` :
                       coupon.discountType === "fixed" ? formatCurrency(coupon.value) : "Free Shipping"}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/30">Min Order: </span>
                    <span className="text-white font-medium">{formatCurrency(coupon.minimumOrderValue)}</span>
                  </div>
                  <div>
                    <span className="text-white/30">Used: </span>
                    <span className="text-white font-medium">
                      {coupon.usageCount}{coupon.usageLimit ? `/${coupon.usageLimit}` : ""} times
                    </span>
                  </div>
                  {coupon.expiry && (
                    <div>
                      <span className="text-white/30">Expires: </span>
                      <span className="text-white font-medium">{format(new Date(coupon.expiry), "dd MMM yyyy")}</span>
                    </div>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </AdminShell>
    </div>
  );
}
