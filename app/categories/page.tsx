"use client";

import { useQuery } from "@tanstack/react-query";

import { GlassCard } from "@/components/ui/card";
import { catalogService } from "@/services/catalog.service";

export default function CategoriesPage() {
  const { data: res, isLoading } = useQuery({
    queryKey: ["catalog-categories"],
    queryFn: () => catalogService.getCategories()
  });

  const categories = res?.data ?? [];

  return (
    <div className="page-shell py-16">
      <h1 className="text-5xl font-semibold text-white">Categories</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60">
        Browse structured electronics categories tuned for discovery, reordering and bundle purchasing.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => <GlassCard key={index} className="h-44 animate-pulse"><span /></GlassCard>)
          : categories.map((category: any) => (
          <GlassCard key={category._id}>
            <p className="text-sm uppercase tracking-[0.3em] text-violet-300">{category.productCount ?? 0} products</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">{category.name}</h2>
            <p className="mt-3 text-sm leading-7 text-white/60">{category.description}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
