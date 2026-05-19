"use client";

import { useQuery } from "@tanstack/react-query";
import { productsService } from "@/services/products.service";

export function useProducts(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const res = await productsService.getProducts(params);
      return res.data || [];
    },
    staleTime: 1000 * 60 * 10
  });
}
