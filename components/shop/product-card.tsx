"use client";

import Image from "next/image";
import type { Route } from "next";
import Link from "next/link";
import { Heart, ShoppingCart, Star, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { formatCurrency, percentOff } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

export function ProductCard({ product }: { product: any }) {
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useCartStore((state) => state.toggleWishlist);
  const productId = product._id || product.id;
  const isWishlisted = useCartStore((state) => state.wishlist.includes(productId));

  const imageUrl = product.images?.[0] || "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop";
  const brandName = typeof product.brand === "object" ? product.brand?.name : product.brand;
  
  // Dynamic stock state handling based on real stock value
  const stockState = product.stock > 10 ? "in-stock" : product.stock > 0 ? "low-stock" : "out-of-stock";

  return (
    <GlassCard className="group flex flex-col overflow-hidden p-0 h-full transition-all hover:border-violet-500/30 hover:shadow-[0_8px_30px_rgba(139,92,246,0.1)]">
      {/* 1. Image & Badges */}
      <div className="relative border-b border-white/5 bg-white/[0.02]">
        <div className="absolute left-2 top-2 sm:left-3 sm:top-3 z-10 flex flex-col gap-2">
          {product.compareAtPrice > product.price && (
            <div className="rounded-full bg-pink px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[10px] font-bold tracking-wide text-white uppercase shadow-lg shadow-pink/20">
              Save {percentOff(product.price, product.compareAtPrice)}%
            </div>
          )}
        </div>
        <button
          aria-label="Toggle wishlist"
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(productId);
          }}
          className="absolute right-2 top-2 sm:right-3 sm:top-3 z-10 rounded-full bg-black/40 p-1.5 sm:p-2 text-white/75 backdrop-blur-md transition-colors hover:bg-black/60 hover:text-white"
        >
          <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isWishlisted ? "fill-pink text-pink" : ""}`} />
        </button>
        <Link href={`/product/${product.slug}` as Route} className="block relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover p-3 sm:p-6 transition-transform duration-500 group-hover:scale-110"
          />
        </Link>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <div className="flex-1">
          {/* Brand/SKU */}
          <div className="mb-1 sm:mb-2 flex items-center justify-between text-[9px] sm:text-[11px] font-medium uppercase tracking-wider text-white/40">
            <span>{brandName || "Generic"}</span>
            <span className="hidden sm:inline">{product.sku || "N/A"}</span>
          </div>

          {/* 2. Product Name */}
          <Link href={`/product/${product.slug}` as Route} className="line-clamp-2 text-xs sm:text-base font-semibold text-white transition-colors group-hover:text-violet-200 leading-tight">
            {product.name}
          </Link>

          {/* 3. Trust / Rating */}
          <div className="mt-2 flex flex-wrap items-center gap-1 sm:gap-2">
            <div className="flex items-center gap-0.5 text-amber-400">
              <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-current" />
              <span className="text-[10px] sm:text-xs font-medium text-white">{product.rating || "5.0"}</span>
            </div>
            <span className="text-[9px] sm:text-xs text-white/40">({product.reviewCount || 0})</span>
            <div className="ml-auto hidden sm:flex items-center gap-1 text-[10px] font-medium text-emerald-400">
              <ShieldCheck className="h-3 w-3" />
              <span>Verified</span>
            </div>
          </div>
        </div>

        <div className="mt-3 sm:mt-5 space-y-2 sm:space-y-4">
          <div className="flex items-end justify-between gap-1">
            {/* 4. Price */}
            <div>
              {product.compareAtPrice > product.price && (
                <p className="text-[9px] sm:text-[11px] text-white/40 line-through mb-0.5">{formatCurrency(product.compareAtPrice)}</p>
              )}
              <p className="text-sm sm:text-xl font-bold text-white leading-none">{formatCurrency(product.price)}</p>
            </div>
            {/* 5. Stock */}
            <div className="text-right">
              <span className={`inline-block rounded-full bg-white/5 border border-white/10 px-1.5 py-0.5 text-[8px] sm:text-[10px] font-medium text-white/70 ${stockState === "in-stock" ? "text-emerald-400 border-emerald-400/20 bg-emerald-400/10" : stockState === "low-stock" ? "text-amber-400 border-amber-400/20 bg-amber-400/10" : "text-pink border-pink/20 bg-pink/10"}`}>
                {stockState.replace(/-/g, " ")}
              </span>
            </div>
          </div>

          {/* 6. CTA */}
          <Button
            className="w-full h-8 sm:h-10 text-xs sm:text-sm shadow-lg transition-all hover:shadow-violet-500/25"
            disabled={product.stock <= 0}
            onClick={() => {
              if (product.stock > 0) {
                addItem(productId);
                toast.success(`${product.name} added to cart`);
              }
            }}
          >
            <ShoppingCart className="mr-1 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" /> {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}
