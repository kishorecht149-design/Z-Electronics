"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Loader2, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { adminService } from "@/services/admin.service";

import type { Route } from "next";

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [brandName, setBrandName] = useState("");
  const [categoryName, setCategoryName] = useState("");

  const { data: response, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => adminService.getProducts()
  });
  const { data: categoriesRes } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => adminService.getCategories()
  });
  const { data: brandsRes } = useQuery({
    queryKey: ["admin-brands"],
    queryFn: () => adminService.getBrands()
  });

  const products = response?.data || [];
  const categories = categoriesRes?.data || [];
  const brands = brandsRes?.data || [];

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminService.updateProduct(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product status updated");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || "Failed to update product")
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product deleted");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || "Failed to delete product")
  });

  const createBrandMutation = useMutation({
    mutationFn: () => adminService.createBrand({ name: brandName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
      setBrandName("");
      toast.success("Brand created");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || "Failed to create brand")
  });

  const createCategoryMutation = useMutation({
    mutationFn: () => adminService.createCategory({ name: categoryName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      setCategoryName("");
      toast.success("Category created");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || "Failed to create category")
  });

  return (
    <div className="page-shell py-16">
      <AdminShell title="Product Management">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-white/60 text-sm">Manage your catalog, stock, and pricing.</p>
          <Link
            href={"/admin/products/new" as Route}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 via-violet-500 to-pink px-3 py-1.5 text-xs font-semibold text-white shadow-glow transition duration-300 hover:brightness-110"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </div>

        <div className="mb-6 grid gap-4 lg:grid-cols-2">
          <GlassCard className="p-5">
            <p className="text-sm font-semibold text-white">Create Brand</p>
            <p className="mt-1 text-xs text-white/45">Use this for new manufacturer records before mapping products.</p>
            <div className="mt-4 flex gap-3">
              <Input
                placeholder="e.g. Texas Instruments"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
              />
              <Button
                disabled={!brandName.trim() || createBrandMutation.isPending}
                onClick={() => createBrandMutation.mutate()}
              >
                {createBrandMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Add Brand
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {brands.slice(0, 10).map((brand: any) => (
                <span key={brand._id} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                  {brand.name}
                </span>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <p className="text-sm font-semibold text-white">Create Category</p>
            <p className="mt-1 text-xs text-white/45">Categories power the public shop filters and home catalog sections.</p>
            <div className="mt-4 flex gap-3">
              <Input
                placeholder="e.g. Development Boards"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
              <Button
                disabled={!categoryName.trim() || createCategoryMutation.isPending}
                onClick={() => createCategoryMutation.mutate()}
              >
                {createCategoryMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Add Category
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.slice(0, 10).map((category: any) => (
                <span key={category._id} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                  {category.name}
                </span>
              ))}
            </div>
          </GlassCard>
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
                    <th className="pb-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-white/50">No products found. Create your first product!</td>
                    </tr>
                  ) : (
                    products.map((product: any) => (
                      <tr key={product._id} className="border-b border-white/5 last:border-0 text-white/80 hover:bg-white/[0.02] transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                             <div className="h-10 w-10 rounded bg-white/5 border border-white/10 shrink-0 overflow-hidden">
                               {product.images?.[0] ? (
                                 <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                               ) : null}
                             </div>
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
                          <select
                            value={product.status}
                            onChange={(e) => updateStatusMutation.mutate({ id: product._id, status: e.target.value })}
                            className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white outline-none"
                          >
                            <option value="draft">draft</option>
                            <option value="published">published</option>
                            <option value="archived">archived</option>
                          </select>
                        </td>
                        <td className="py-4">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/admin/products/${product._id}` as Route}
                              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-transparent px-3 py-1.5 text-xs font-semibold text-white transition duration-300 hover:bg-white/10"
                            >
                              <Pencil className="mr-2 h-4 w-4" /> Edit
                            </Link>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateStatusMutation.mutate({
                                  id: product._id,
                                  status: product.status === "published" ? "draft" : "published"
                                })
                              }
                            >
                              {product.status === "published" ? "Unpublish" : "Publish"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-pink/20 text-pink hover:bg-pink/10"
                              onClick={() => deleteMutation.mutate(product._id)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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
