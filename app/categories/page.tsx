import { categories } from "@/lib/mock-data";
import { GlassCard } from "@/components/ui/card";

export default function CategoriesPage() {
  return (
    <div className="page-shell py-16">
      <h1 className="text-5xl font-semibold text-white">Categories</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60">
        Browse structured electronics categories tuned for discovery, reordering and bundle purchasing.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => (
          <GlassCard key={category.id}>
            <p className="text-sm uppercase tracking-[0.3em] text-violet-300">{category.productCount} products</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">{category.name}</h2>
            <p className="mt-3 text-sm leading-7 text-white/60">{category.description}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
