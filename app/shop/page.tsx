import { Filter, SlidersHorizontal } from "lucide-react";

import { ProductCard } from "@/components/shop/product-card";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { products } from "@/lib/mock-data";

export default function ShopPage() {
  return (
    <div className="page-shell py-16">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <Badge>Catalog Experience</Badge>
          <h1 className="mt-4 text-5xl font-semibold text-white">Shop Components</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60">
            Search, sort, filter and compare premium electronics products with a clean procurement flow.
          </p>
        </div>
        <div className="flex gap-3">
          <Input placeholder="Search products, brands, specs..." className="w-72" />
          <button className="rounded-2xl border border-white/10 bg-white/5 px-4 text-white/70">
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <GlassCard className="h-fit space-y-6">
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-violet-200" />
            <p className="font-semibold text-white">Filters</p>
          </div>
          <FilterBlock title="Category" values={["Microcontrollers", "Sensors", "Power Modules", "Tools & Kits"]} />
          <FilterBlock title="Brand" values={["Arduino", "Raspberry Pi", "Adafruit", "Texas Instruments"]} />
          <FilterBlock title="Availability" values={["In stock", "Low stock", "Preorder"]} />
          <div>
            <p className="mb-3 text-sm font-medium text-white">Price range</p>
            <div className="h-2 rounded-full bg-white/10">
              <div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-violet-600 to-pink" />
            </div>
            <div className="mt-3 flex justify-between text-xs text-white/45">
              <span>₹100</span>
              <span>₹5,000</span>
            </div>
          </div>
        </GlassCard>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-white/60">Showing 24 of 382 products</p>
            <div className="flex gap-3 text-sm text-white/70">
              <span className="rounded-full bg-violet-500/15 px-3 py-2 text-violet-200">Best Match</span>
              <span className="rounded-full border border-white/10 px-3 py-2">Newest</span>
              <span className="rounded-full border border-white/10 px-3 py-2">Price Low-High</span>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterBlock({ title, values }: { title: string; values: string[] }) {
  return (
    <div>
      <p className="mb-3 text-sm font-medium text-white">{title}</p>
      <div className="space-y-2">
        {values.map((value) => (
          <label key={value} className="flex items-center justify-between rounded-2xl border border-white/10 px-3 py-2 text-sm text-white/65">
            <span>{value}</span>
            <input type="checkbox" className="h-4 w-4 accent-violet-500" />
          </label>
        ))}
      </div>
    </div>
  );
}
