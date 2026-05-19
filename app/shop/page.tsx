"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Filter, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import { catalogService } from "@/services/catalog.service";
import { productsService } from "@/services/products.service";

export default function ShopPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") ?? "");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState("-createdAt");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);

  const { data: categoriesRes } = useQuery({
    queryKey: ["shop-categories"],
    queryFn: () => catalogService.getCategories()
  });

  const { data: brandsRes } = useQuery({
    queryKey: ["shop-brands"],
    queryFn: () => catalogService.getBrands()
  });

  const { data: response, isLoading } = useQuery({
    queryKey: ["products", { q: searchQuery, category: selectedCategory, brand: selectedBrand, sort, inStockOnly, minPrice, maxPrice, page }],
    queryFn: () =>
      productsService.getProducts({
        q: searchQuery || undefined,
        category: selectedCategory || undefined,
        brand: selectedBrand || undefined,
        sort,
        page,
        limit: 12,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        ...(inStockOnly ? { stock: "true" } : {})
      })
  });

  const products = response?.data || [];
  const meta = response?.meta;
  const categories = categoriesRes?.data || [];
  const brands = brandsRes?.data || [];

  return (
    <div className="page-shell py-8">
      {/* Breadcrumbs & Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-white/50 mb-6">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-white">Shop Components</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Shop Components</h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/60">
              Procurement-grade catalog featuring authentic parts, real-time stock visibility, and bulk purchasing capabilities.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* LEFT SIDEBAR */}
        <aside className="hidden lg:block space-y-6">
          <div className="sticky top-24 space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <Filter className="h-4 w-4 text-violet-300" />
              <h2 className="font-semibold text-white">Filters</h2>
            </div>

            <DynamicFilterBlock
              title="Categories"
              values={categories.map((category: any) => ({
                id: category._id,
                label: category.name
              }))}
              selected={selectedCategory}
              onSelect={(value) => {
                setPage(1);
                setSelectedCategory(value);
              }}
            />
            
            <DynamicFilterBlock
              title="Brands"
              values={brands.map((brand: any) => ({
                id: brand._id,
                label: brand.name
              }))}
              selected={selectedBrand}
              onSelect={(value) => {
                setPage(1);
                setSelectedBrand(value);
              }}
            />
            
            <div>
              <p className="mb-3 text-sm font-medium text-white">Stock Status</p>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => {
                    setPage(1);
                    setInStockOnly(e.target.checked);
                  }}
                  className="h-4 w-4 rounded border-white/20 bg-white/5 accent-violet-500"
                />
                <span className="text-sm text-white/65 group-hover:text-white transition-colors">In Stock Only</span>
              </label>
            </div>
            
            <div>
              <p className="mb-4 text-sm font-medium text-white">Price Range</p>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-xs">₹</span>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => {
                      setPage(1);
                      setMinPrice(e.target.value);
                    }}
                    placeholder="Min"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-7 pr-3 text-sm text-white outline-none"
                  />
                </div>
                <span className="text-white/40">-</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-xs">₹</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => {
                      setPage(1);
                      setMaxPrice(e.target.value);
                    }}
                    placeholder="Max"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-7 pr-3 text-sm text-white outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <div className="space-y-6">
          {/* TOP BAR */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <button className="lg:hidden flex items-center gap-2 text-sm text-white/70 hover:text-white">
                <Filter className="h-4 w-4" /> Filters
              </button>
              <p className="text-sm font-medium text-white">
                <span className="text-violet-300">{isLoading ? "-" : products.length}</span> Results
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => {
                    setPage(1);
                    setSearchQuery(e.target.value);
                  }}
                  placeholder="Search in these results..." 
                  className="w-full rounded-xl border border-white/10 bg-black/40 py-2 pl-9 pr-4 text-sm text-white placeholder:text-white/40 outline-none focus:border-violet-500/50 transition-colors"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/50 uppercase tracking-wider">Sort:</span>
                <select
                  className="appearance-none rounded-xl border border-white/10 bg-black/40 py-2 pl-3 pr-8 text-sm text-white outline-none focus:border-violet-500/50"
                  value={sort}
                  onChange={(e) => {
                    setPage(1);
                    setSort(e.target.value);
                  }}
                >
                  <option value="-createdAt">Newest Arrivals</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* PRODUCT GRID */}
          {isLoading ? (
             <div className="flex justify-center items-center py-32">
                <Loader2 className="h-10 w-10 text-violet-500 animate-spin" />
             </div>
          ) : products.length === 0 ? (
             <div className="flex flex-col justify-center items-center py-32 text-white/50">
                <Search className="h-12 w-12 mb-4 opacity-20" />
                <p>No products found matching your criteria.</p>
             </div>
          ) : (
            <div className="grid gap-3 sm:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {products.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          
          {products.length > 0 && (
            <div className="mt-12 flex flex-col items-center gap-4">
               <p className="text-sm text-white/45">
                 Page {meta?.page ?? page} of {meta?.totalPages ?? 1}
               </p>
               <div className="flex gap-3">
                 <Button
                   variant="secondary"
                   disabled={(meta?.page ?? page) <= 1}
                   onClick={() => setPage((current) => Math.max(1, current - 1))}
                 >
                   Previous
                 </Button>
                 <Button
                   disabled={(meta?.page ?? page) >= (meta?.totalPages ?? 1)}
                   onClick={() => setPage((current) => current + 1)}
                 >
                   Next Page
                 </Button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DynamicFilterBlock({
  title,
  values,
  selected,
  onSelect
}: {
  title: string;
  values: Array<{ id: string; label: string }>;
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-3 text-sm font-medium text-white">{title}</p>
      <div className="space-y-2.5">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="radio"
            checked={selected === ""}
            onChange={() => onSelect("")}
            className="h-4 w-4 rounded border-white/20 bg-white/5 accent-violet-500"
          />
          <span className="text-sm text-white/65 group-hover:text-white transition-colors">All</span>
        </label>
        {values.map((value) => (
          <label key={value.id} className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              checked={selected === value.id}
              onChange={() => onSelect(value.id)}
              className="h-4 w-4 rounded border-white/20 bg-white/5 accent-violet-500"
            />
            <span className="text-sm text-white/65 group-hover:text-white transition-colors">{value.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
