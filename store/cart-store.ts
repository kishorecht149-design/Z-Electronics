"use client";

import { create } from "zustand";

interface CartLine {
  productId: string;
  quantity: number;
}

interface CartStore {
  items: CartLine[];
  wishlist: string[];
  recentlyViewed: string[];
  addItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleWishlist: (productId: string) => void;
  markViewed: (productId: string) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [
    { productId: "prod-1", quantity: 1 },
    { productId: "prod-3", quantity: 2 }
  ],
  wishlist: ["prod-2", "prod-4"],
  recentlyViewed: ["prod-1", "prod-2", "prod-3"],
  addItem: (productId) =>
    set((state) => {
      const existing = state.items.find((item) => item.productId === productId);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
          )
        };
      }
      return { items: [...state.items, { productId, quantity: 1 }] };
    }),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: state.items
        .map((item) => (item.productId === productId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0)
    })),
  toggleWishlist: (productId) =>
    set((state) => ({
      wishlist: state.wishlist.includes(productId)
        ? state.wishlist.filter((id) => id !== productId)
        : [...state.wishlist, productId]
    })),
  markViewed: (productId) =>
    set((state) => ({
      recentlyViewed: [productId, ...state.recentlyViewed.filter((id) => id !== productId)].slice(0, 6)
    }))
}));
