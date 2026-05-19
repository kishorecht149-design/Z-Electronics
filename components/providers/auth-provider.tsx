"use client";

import { useEffect } from "react";

import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading, logout } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("z-auth-token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await authService.getMe();
        if (res.success) {
          useAuthStore.setState({ token }); // Ensure token is in state
          setUser(res.data);
          
          // Sync server cart state
          try {
            const userState = await userService.getState();
            if (userState.success) {
               useCartStore.getState().setStore({
                 items: userState.data.cart.map((c: any) => ({
                   productId: typeof c.productId === "object" ? c.productId._id : c.productId,
                   quantity: c.quantity
                 })),
                 wishlist: userState.data.wishlist.map((w: any) => typeof w === "object" ? w._id : w)
               });
            }
          } catch (syncErr) {
            console.error("Cart sync failed", syncErr);
          }
        } else {
          logout();
        }
      } catch (error) {
        console.error("Auth init failed", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [setUser, setLoading, logout]);

  return <>{children}</>;
}
