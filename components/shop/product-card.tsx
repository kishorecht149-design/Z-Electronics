"use client";

import Image from "next/image";
import type { Route } from "next";
import Link from "next/link";
import { Heart, ShoppingCart, Star, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import type { Product } from "@/models/domain";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { formatCurrency, percentOff } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useCartStore((state) => state.toggleWishlist);
  const isWishlisted = useCartStore((state) => state.wishlist.includes(product.id));

  return (
    <GlassCard className="group flex flex-col overflow-hidden p-0 h-full transition-all hover:border-violet-500/30 hover:shadow-[0_8px_30px_rgba(139,92,246,0.1)]">
      {/* 1. Image & Badges */}
      <div className="relative border-b border-white/5 bg-white/[0.02]">
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
          {product.compareAtPrice > product.price && (
            <div className="rounded-full bg-pink px-2.5 py-1 text-[10px] font-bold tracking-wide text-white uppercase shadow-lg shadow-pink/20">
              Save {percentOff(product.price, product.compareAtPrice)}%
            </div>
          )}
        </div>
        <button
          aria-label="Toggle wishlist"
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className="absolute right-3 top-3 z-10 rounded-full bg-black/40 p-2 text-white/75 backdrop-blur-md transition-colors hover:bg-black/60 hover:text-white"
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? "fill-pink text-pink" : ""}`} />
        </button>
        <Link href={`/product/${product.slug}` as Route} className="block relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover p-6 transition-transform duration-500 group-hover:scale-110"
          />
        </Link>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1">
          {/* Brand/SKU */}
          <div className="mb-2 flex items-center justify-between text-[11px] font-medium uppercase tracking-wider text-white/40">
            <span>{product.brand}</span>
            <span>{product.sku}</span>
          </div>

          {/* 2. Product Name */}
          <Link href={`/product/${product.slug}` as Route} className="line-clamp-2 text-base font-semibold text-white transition-colors group-hover:text-violet-200 leading-tight">
            {product.name}
          </Link>

          {/* 3. Trust / Rating */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="text-xs font-medium text-white">{product.rating}</span>
            </div>
            <span className="text-xs text-white/40">({product.reviewCount} reviews)</span>
            <div className="ml-auto flex items-center gap-1 text-[10px] font-medium text-emerald-400">
              <ShieldCheck className="h-3 w-3" />
              <span>Verified</span>
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div className="flex items-end justify-between">
            {/* 4. Price */}
            <div>
              {product.compareAtPrice > product.price && (
                <p className="text-[11px] text-white/40 line-through mb-0.5">{formatCurrency(product.compareAtPrice)}</p>
              )}
              <p className="text-xl font-bold text-white leading-none">{formatCurrency(product.price)}</p>
            </div>
            {/* 5. Stock */}
            <div className="text-right">
              <span className="inline-block rounded-full bg-white/5 border border-white/10 px-2 py-1 text-[10px] font-medium text-white/70">
                {product.stockState.replace(/-/g, " ")}
              </span>
            </div>
          </div>

          {/* 6. CTA */}
          <Button
            className="w-full shadow-lg transition-all hover:shadow-violet-500/25"
            onClick={() => {
              addItem(product.id);
              toast.success(`${product.name} added to cart`);
            }}
          >
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}
