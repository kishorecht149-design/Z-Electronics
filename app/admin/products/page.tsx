"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus, Loader2 } from "lucide-react";
import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { adminService } from "@/services/admin.service";

import type { Route } from "next";

export default function AdminProductsPage() {
  const { data: response, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => adminService.getProducts()
  });

  const products = response?.data || [];

  return (
    <div className="page-shell py-16">
      <AdminShell title="Product Management">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-white/60 text-sm">Manage your catalog, stock, and pricing.</p>
          <Link href={"/admin/products/new" as Route}>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add Product</Button>
          </Link>
        </div>

        <GlassCard>
          {isLoading ? (
            <div className="py-20 flex justify-center items-center">
               <Loader2 className="h-8 w-8 text-violet-500 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-white/45 border-b border-white/10">
                  <tr>
                    <th className="pb-4 font-medium">Product</th>
                    <th className="pb-4 font-medium">Category</th>
                    <th className="pb-4 font-medium">Price</th>
                    <th className="pb-4 font-medium">Stock</th>
                    <th className="pb-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-white/50">No products found. Create your first product!</td>
                    </tr>
                  ) : (
                    products.map((product: any) => (
                      <tr key={product._id} className="border-b border-white/5 last:border-0 text-white/80 hover:bg-white/[0.02] transition-colors cursor-pointer">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                             <div className="h-10 w-10 rounded bg-white/5 border border-white/10 shrink-0"></div>
                             <div>
                               <p className="font-medium text-white">{product.name}</p>
                               <p className="text-xs text-white/40">{product.sku}</p>
                             </div>
                          </div>
                        </td>
                        <td className="py-4">{product.category?.name || "Uncategorized"}</td>
                        <td className="py-4">{formatCurrency(product.price)}</td>
                        <td className="py-4">
                           <span className={`px-2 py-1 rounded text-xs font-medium ${product.stock > 10 ? "bg-emerald-500/10 text-emerald-400" : product.stock > 0 ? "bg-amber-500/10 text-amber-400" : "bg-pink/10 text-pink"}`}>
                              {product.stock} in stock
                           </span>
                        </td>
                        <td className="py-4">
                           <span className="capitalize">{product.status}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      </AdminShell>
    </div>
  );
}
