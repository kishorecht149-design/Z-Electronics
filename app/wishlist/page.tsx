"use client";

import { useQuery } from "@tanstack/react-query";
import { Heart, Loader2, PackageSearch } from "lucide-react";
import Link from "next/link";

import { ProductCard } from "@/components/shop/product-card";
import { productsService } from "@/services/products.service";
import { useCartStore } from "@/store/cart-store";

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useCartStore();

  const { data, isLoading } = useQuery({
    queryKey: ["wishlist-products", wishlist.join(",")],
    queryFn: async () => {
      if (wishlist.length === 0) return [];
      const results = await Promise.all(
        wishlist.map((id) => productsService.getProductById(id).catch(() => null))
      );
      return results.filter(Boolean).map((r: any) => r?.data).filter(Boolean);
    },
    enabled: wishlist.length > 0
  });

  const items: any[] = data || [];

  return (
    <div className="page-shell py-16">
      <div className="mb-10">
        <h1 className="text-5xl font-semibold text-white">Wishlist</h1>
        <p className="mt-4 text-sm leading-7 text-white/60">
          {wishlist.length} saved product{wishlist.length !== 1 ? "s" : ""} — one click away from your cart.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Heart className="h-16 w-16 text-white/20 mb-6" />
          <p className="text-white/50 text-lg mb-4">Your wishlist is empty</p>
          <Link href="/shop" className="text-violet-400 hover:text-violet-300 text-sm transition-colors">
            Browse the shop →
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
