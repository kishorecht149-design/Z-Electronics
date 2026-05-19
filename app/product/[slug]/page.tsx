import Image from "next/image";
import { notFound } from "next/navigation";
import { Download, Truck } from "lucide-react";

import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { products, reviews } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default async function ProductDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const productData = products.find((item) => item.slug === slug);

  if (!productData) {
    notFound();
  }

  const product = productData;
  const related = products.filter((item) => item.id !== product.id).slice(0, 3);

  return (
    <div className="page-shell py-16">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-[32px] border border-white/10 bg-white/5">
            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {product.images.map((image) => (
              <div key={image} className="relative aspect-[1.1] overflow-hidden rounded-[24px] border border-white/10 bg-white/5">
                <Image src={image} alt={product.name} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-violet-300">{product.brand}</p>
            <h1 className="mt-4 text-4xl font-semibold text-white">{product.name}</h1>
            <p className="mt-4 text-sm leading-7 text-white/60">{product.description}</p>
          </div>

          <div className="flex items-end gap-4">
            <p className="text-4xl font-semibold text-white">{formatCurrency(product.price)}</p>
            <p className="pb-1 text-lg text-white/35 line-through">{formatCurrency(product.compareAtPrice)}</p>
          </div>

          <GlassCard className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/45">Stock</p>
              <p className="mt-2 text-lg font-semibold text-white">{product.stock} units available</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/45">Delivery</p>
              <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-white"><Truck className="h-4 w-4 text-violet-200" /> Ships within 24 hours</p>
            </div>
          </GlassCard>

          <div className="flex flex-wrap gap-3">
            <Button>Add to Cart</Button>
            <Button variant="secondary">Buy Now</Button>
            <Button variant="ghost">Compare Product</Button>
          </div>

          <GlassCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-violet-300">Technical Specifications</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Engineering details</h2>
              </div>
              <Button variant="secondary"><Download className="mr-2 h-4 w-4" /> Datasheet</Button>
            </div>
            <div className="mt-6 divide-y divide-white/10">
              {product.specifications.map((spec) => (
                <div key={spec.label} className="flex justify-between py-4 text-sm">
                  <span className="text-white/50">{spec.label}</span>
                  <span className="font-medium text-white">{spec.value}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      <section className="mt-16 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <GlassCard>
          <p className="text-xs uppercase tracking-[0.35em] text-violet-300">Customer Reviews</p>
          <div className="mt-6 space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-white">{review.author}</p>
                  <p className="text-sm text-amber-300">{"★".repeat(review.rating)}</p>
                </div>
                <p className="mt-2 text-sm leading-7 text-white/60">{review.comment}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <div>
          <p className="mb-6 text-2xl font-semibold text-white">Related Products</p>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-16">
        <GlassCard>
          <div className="grid gap-6 lg:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-violet-300">AI Recommendations</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">Smart accessory suggestions</h3>
              <p className="mt-3 text-sm leading-7 text-white/60">
                Match this product with power, sensing and debugging accessories based on tags, demand trends and common project bundles.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="font-semibold text-white">Frequently paired with</p>
              <p className="mt-3 text-sm text-white/60">Buck converters, IMU modules, jumper wire kits, Type-C power adapters.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="font-semibold text-white">Recently viewed logic</p>
              <p className="mt-3 text-sm text-white/60">Keep last-viewed boards accessible for quick compare-and-buy decision flows.</p>
            </div>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
