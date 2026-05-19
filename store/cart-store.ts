"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { userService } from "@/services/user.service";

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
  setStore: (data: { items?: CartLine[]; wishlist?: string[] }) => void;
  clearStore: () => void;
}

const syncWithServer = async (state: Partial<CartStore>) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("z-auth-token") : null;
  if (!token) return;
  
  try {
    await userService.syncState({
      cart: state.items,
      wishlist: state.wishlist
    });
  } catch (error) {
    console.error("Failed to sync cart/wishlist", error);
  }
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      wishlist: [],
      recentlyViewed: [],
      addItem: (productId) => {
        set((state) => {
          const existing = state.items.find((item) => item.productId === productId);
          let newItems;
          if (existing) {
            newItems = state.items.map((item) =>
              item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
            );
          } else {
            newItems = [...state.items, { productId, quantity: 1 }];
          }
          syncWithServer({ items: newItems });
          return { items: newItems };
        });
      },
      updateQuantity: (productId, quantity) => {
        set((state) => {
          const newItems = state.items
            .map((item) => (item.productId === productId ? { ...item, quantity } : item))
            .filter((item) => item.quantity > 0);
          syncWithServer({ items: newItems });
          return { items: newItems };
        });
      },
      toggleWishlist: (productId) => {
        set((state) => {
          const newWishlist = state.wishlist.includes(productId)
            ? state.wishlist.filter((id) => id !== productId)
            : [...state.wishlist, productId];
          syncWithServer({ wishlist: newWishlist });
          return { wishlist: newWishlist };
        });
      },
      markViewed: (productId) => {
        set((state) => ({
          recentlyViewed: [productId, ...state.recentlyViewed.filter((id) => id !== productId)].slice(0, 6)
        }));
      },
      setStore: (data) => set((state) => ({ ...state, ...data })),
      clearStore: () => set({ items: [], wishlist: [] })
    }),
    {
      name: "z-electronics-cart",
      partialize: (state) => ({ items: state.items, wishlist: state.wishlist, recentlyViewed: state.recentlyViewed })
    }
  )
);
