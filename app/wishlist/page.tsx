"use client";

import { ProductCard } from "@/components/shop/product-card";
import { products } from "@/lib/mock-data";
import { useCartStore } from "@/store/cart-store";

export default function WishlistPage() {
  const wishlist = useCartStore((state) => state.wishlist);
  const items = products.filter((product) => wishlist.includes(product.id));

  return (
    <div className="page-shell py-16">
      <h1 className="text-5xl font-semibold text-white">Wishlist</h1>
      <p className="mt-4 text-sm leading-7 text-white/60">Saved products, comparison-ready and one click away from the cart.</p>
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
