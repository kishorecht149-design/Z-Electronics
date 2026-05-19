"use client";

import Image from "next/image";
import type { Route } from "next";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
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
    <GlassCard className="group overflow-hidden p-0">
      <div className="relative">
        <div className="absolute left-4 top-4 z-10 rounded-full bg-pink px-3 py-1 text-xs font-semibold text-white">
          {percentOff(product.price, product.compareAtPrice)}% OFF
        </div>
        <button
          aria-label="Toggle wishlist"
          onClick={() => toggleWishlist(product.id)}
          className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-ink/70 p-2 text-white/75"
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? "fill-pink text-pink" : ""}`} />
        </button>
        <div className="relative aspect-[1.1] overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between text-xs text-white/45">
          <span>{product.brand}</span>
          <span>{product.sku}</span>
        </div>
        <div>
          <Link href={`/product/${product.slug}` as Route} className="line-clamp-2 text-lg font-semibold text-white">
            {product.name}
          </Link>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/60">{product.shortDescription}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-amber-300">
          <Star className="h-4 w-4 fill-amber-300" />
          <span>{product.rating}</span>
          <span className="text-white/45">({product.reviewCount})</span>
          <span className="ml-auto rounded-full border border-white/10 px-2 py-1 text-[11px] text-white/65">
            {product.stockState.replace(/-/g, " ")}
          </span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-semibold text-white">{formatCurrency(product.price)}</p>
            <p className="text-sm text-white/35 line-through">{formatCurrency(product.compareAtPrice)}</p>
          </div>
          <Button
            className="px-4 py-2"
            onClick={() => {
              addItem(product.id);
              toast.success(`${product.name} added to cart`);
            }}
          >
            <ShoppingCart className="mr-2 h-4 w-4" /> Add
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}
