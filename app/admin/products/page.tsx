import { AdminShell } from "@/components/admin/admin-shell";
import { GlassCard } from "@/components/ui/card";
import { products } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function AdminProductsPage() {
  return (
    <div className="page-shell py-16">
      <AdminShell title="Product Management">
        <GlassCard>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-white/45">
                <tr>
                  <th className="pb-4">Product</th>
                  <th className="pb-4">Category</th>
                  <th className="pb-4">Price</th>
                  <th className="pb-4">Stock</th>
                  <th className="pb-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-white/10 text-white/70">
                    <td className="py-4">{product.name}</td>
                    <td className="py-4">{product.category}</td>
                    <td className="py-4">{formatCurrency(product.price)}</td>
                    <td className="py-4">{product.stock}</td>
                    <td className="py-4">{product.stockState}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </AdminShell>
    </div>
  );
}
