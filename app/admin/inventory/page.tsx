"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, PackageSearch } from "lucide-react";

import { AdminShell } from "@/components/admin/admin-shell";
import { GlassCard } from "@/components/ui/card";
import { adminService } from "@/services/admin.service";

export default function AdminInventoryPage() {
  const { data: res, isLoading } = useQuery({
    queryKey: ["admin-inventory"],
    queryFn: () => adminService.getProducts()
  });

  const products = res?.data || [];

  return (
    <div className="page-shell py-16">
      <AdminShell title="Inventory Tracking">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <PackageSearch className="h-12 w-12 text-white/20 mb-4" />
            <p className="text-white/50">No products found in inventory</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {products.map((product: any) => (
              <GlassCard key={product._id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <p className="text-lg font-semibold text-white">{product.name}</p>
                  <p className="text-sm text-white/50">SKU: {product.sku || "—"}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-white">{product.stock} units</p>
                  <p className={`text-xs font-semibold ${product.stock > 10 ? "text-emerald-400" : product.stock > 0 ? "text-amber-400" : "text-red-400"}`}>
                    {product.stock > 10 ? "In Stock" : product.stock > 0 ? "Low Stock" : "Out of Stock"}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </AdminShell>
    </div>
  );
}
