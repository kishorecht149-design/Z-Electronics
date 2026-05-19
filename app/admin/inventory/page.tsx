import { AdminShell } from "@/components/admin/admin-shell";
import { GlassCard } from "@/components/ui/card";
import { products } from "@/lib/mock-data";

export default function AdminInventoryPage() {
  return (
    <div className="page-shell py-16">
      <AdminShell title="Inventory Tracking">
        <div className="grid gap-4">
          {products.map((product) => (
            <GlassCard key={product.id} className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-white">{product.name}</p>
                <p className="text-sm text-white/50">SKU {product.sku}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-white">{product.stock} units</p>
                <p className="text-sm text-white/50">{product.stockState}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </AdminShell>
    </div>
  );
}
