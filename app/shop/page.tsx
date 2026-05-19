"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Filter, Search, SlidersHorizontal, Star, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import { productsService } from "@/services/products.service";

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: response, isLoading } = useQuery({
    queryKey: ["products", { q: searchQuery }],
    queryFn: () => productsService.getProducts({ q: searchQuery })
  });

  const products = response?.data || [];

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

            <FilterBlock 
              title="Categories" 
              values={["Microcontrollers", "Raspberry Pi", "Sensors", "Displays", "Power Management", "Motors & Actuators", "Wireless & IoT", "Passive Components"]} 
            />
            
            <FilterBlock 
              title="Brands" 
              values={["Arduino", "Raspberry Pi", "Adafruit", "SparkFun", "Espressif", "Texas Instruments"]} 
            />
            
            <FilterBlock 
              title="Stock Status" 
              values={["In Stock Only", "Include Out of Stock", "Available for Backorder"]} 
            />
            
            <div>
              <p className="mb-4 text-sm font-medium text-white">Price Range</p>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-xs">$</span>
                  <input type="number" placeholder="Min" className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-7 pr-3 text-sm text-white outline-none" />
                </div>
                <span className="text-white/40">-</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-xs">$</span>
                  <input type="number" placeholder="Max" className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-7 pr-3 text-sm text-white outline-none" />
                </div>
              </div>
            </div>

            <div>
               <p className="mb-3 text-sm font-medium text-white">Minimum Rating</p>
               <div className="space-y-2">
                 {[4, 3, 2, 1].map((rating) => (
                   <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                     <input type="radio" name="rating" className="h-4 w-4 accent-violet-500" />
                     <div className="flex gap-1">
                       {Array.from({length: 5}).map((_, i) => (
                         <Star key={i} className={`h-3 w-3 ${i < rating ? "fill-amber-400 text-amber-400" : "fill-white/10 text-white/10"}`} />
                       ))}
                     </div>
                     <span className="text-xs text-white/50 group-hover:text-white/80">& Up</span>
                   </label>
                 ))}
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search in these results..." 
                  className="w-full rounded-xl border border-white/10 bg-black/40 py-2 pl-9 pr-4 text-sm text-white placeholder:text-white/40 outline-none focus:border-violet-500/50 transition-colors"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/50 uppercase tracking-wider">Sort:</span>
                <select className="appearance-none rounded-xl border border-white/10 bg-black/40 py-2 pl-3 pr-8 text-sm text-white outline-none focus:border-violet-500/50">
                  <option>Best Match</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Top Rated</option>
                  <option>Newest Arrivals</option>
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
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {products.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          
          {products.length > 0 && (
            <div className="mt-12 flex justify-center">
               <Button variant="secondary" size="lg" className="w-full max-w-xs">Load More Components</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterBlock({ title, values }: { title: string; values: string[] }) {
  return (
    <div>
      <p className="mb-3 text-sm font-medium text-white">{title}</p>
      <div className="space-y-2.5">
        {values.map((value) => (
          <label key={value} className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-white/5 accent-violet-500" />
            <span className="text-sm text-white/65 group-hover:text-white transition-colors">{value}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
