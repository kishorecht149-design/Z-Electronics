import Image from "next/image";
import { notFound } from "next/navigation";
import { Download, Truck, Star, ShieldCheck, Zap, PackagePlus, FileText, HelpCircle } from "lucide-react";

import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { products, reviews } from "@/lib/mock-data";
import { formatCurrency, percentOff } from "@/lib/utils";

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
    <div className="page-shell py-8 md:py-16">
      {/* 1. Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-white/50 mb-8">
        <span className="hover:text-white cursor-pointer transition-colors">Home</span>
        <span>/</span>
        <span className="hover:text-white cursor-pointer transition-colors">Shop</span>
        <span>/</span>
        <span className="text-white">{product.name}</span>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        {/* 1. Product Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.02]">
            <Image src={product.images[0]} alt={product.name} fill className="object-contain p-8" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, idx) => (
              <div key={idx} className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] cursor-pointer hover:border-violet-500/50 transition-colors">
                <Image src={image} alt={`${product.name} view ${idx + 1}`} fill className="object-contain p-2" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div>
            {/* Brand */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">{product.brand}</p>
              <p className="text-xs text-white/40">SKU: {product.sku}</p>
            </div>
            
            {/* 2. Product Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">{product.name}</h1>
            
            {/* 3. Ratings */}
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-semibold text-white">{product.rating}</span>
              </div>
              <span className="text-sm text-white/50 underline cursor-pointer hover:text-white transition-colors">Read {product.reviewCount} reviews</span>
              <div className="flex items-center gap-1 text-xs font-medium text-emerald-400 border-l border-white/10 pl-4">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Verified Authentic</span>
              </div>
            </div>
            
            <p className="mt-6 text-sm leading-relaxed text-white/70">{product.description}</p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/5 p-6 space-y-6">
            <div className="flex items-end justify-between">
              <div>
                {/* 4. Pricing */}
                {product.compareAtPrice > product.price && (
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm text-white/40 line-through">{formatCurrency(product.compareAtPrice)}</p>
                    <span className="rounded bg-pink/20 px-1.5 py-0.5 text-[10px] font-bold text-pink uppercase">
                      Save {percentOff(product.price, product.compareAtPrice)}%
                    </span>
                  </div>
                )}
                <p className="text-4xl font-bold text-white">{formatCurrency(product.price)}</p>
              </div>
              
              {/* 5. Stock */}
              <div className="text-right">
                <div className="flex items-center justify-end gap-1.5 text-emerald-400 mb-1">
                  <Zap className="h-4 w-4" />
                  <span className="font-semibold text-sm">In Stock</span>
                </div>
                <p className="text-xs text-white/50">{product.stock} units ready to ship</p>
              </div>
            </div>

            {/* 6. Delivery Info */}
            <div className="flex items-start gap-3 rounded-xl bg-black/40 p-3 border border-white/5">
              <Truck className="h-5 w-5 text-violet-300 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Fast Dispatch</p>
                <p className="text-xs text-white/60">Order within 4 hrs 12 mins for same-day shipping.</p>
              </div>
            </div>

            {/* 7 & 8. Add to cart & Buy now */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button size="lg" className="h-12 w-full text-base">Add to Cart</Button>
              <Button size="lg" variant="secondary" className="h-12 w-full text-base bg-white text-black hover:bg-white/90 border-0">Buy Now</Button>
            </div>
            
            <div className="flex justify-center pt-2">
               <button className="text-xs text-white/50 hover:text-white underline transition-colors">Compare similar products</button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-12">
          {/* 9 & 10. Technical Specs & Datasheets */}
          <section>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                 <FileText className="h-5 w-5 text-violet-400" />
                 Technical Specifications
              </h2>
              <Button variant="outline" size="sm" className="h-8 border-white/10 text-white/80 hover:bg-white/10">
                <Download className="mr-2 h-3.5 w-3.5" /> Datasheet (PDF)
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
              {product.specifications.map((spec) => (
                <div key={spec.label} className="flex flex-col border-b border-white/5 pb-3">
                  <span className="text-xs text-white/50 uppercase tracking-wider mb-1">{spec.label}</span>
                  <span className="font-medium text-white/90 text-sm">{spec.value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* New: Used in these projects */}
          <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-900/20 to-transparent p-8">
            <h3 className="text-lg font-bold text-white mb-2">Used in these projects</h3>
            <p className="text-sm text-white/60 mb-6">See how other engineers are implementing this component.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl bg-black/40 p-4 border border-white/5 flex gap-4 cursor-pointer hover:border-violet-500/30 transition-colors">
                 <div className="h-16 w-16 rounded-lg bg-violet-600/20 shrink-0"></div>
                 <div>
                    <p className="font-semibold text-white text-sm">Automated Greenhouse</p>
                    <p className="text-xs text-white/50 mt-1">By Maker Lab • 12 parts</p>
                 </div>
              </div>
              <div className="rounded-xl bg-black/40 p-4 border border-white/5 flex gap-4 cursor-pointer hover:border-violet-500/30 transition-colors">
                 <div className="h-16 w-16 rounded-lg bg-pink/20 shrink-0"></div>
                 <div>
                    <p className="font-semibold text-white text-sm">Smart Desk Clock</p>
                    <p className="text-xs text-white/50 mt-1">By J. Doe • 5 parts</p>
                 </div>
              </div>
            </div>
          </section>

          {/* 13. FAQs */}
          <section>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
              <HelpCircle className="h-5 w-5 text-violet-400" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
               {[
                 { q: "Is this compatible with 3.3V logic?", a: "Yes, this component has built-in level shifting and works seamlessly with both 3.3V and 5V logic systems." },
                 { q: "Does it come with header pins soldered?", a: "No, header pins are included in the package but are not pre-soldered to allow for custom mounting options." }
               ].map((faq, i) => (
                 <div key={i} className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                    <p className="font-semibold text-white text-sm">{faq.q}</p>
                    <p className="mt-2 text-sm text-white/60">{faq.a}</p>
                 </div>
               ))}
            </div>
          </section>

          {/* 14. Reviews */}
          <section>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                 <Star className="h-5 w-5 text-amber-400" />
                 Community Reviews
              </h2>
              <Button variant="outline" size="sm">Write Review</Button>
            </div>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                       <div className="h-8 w-8 rounded-full bg-violet-600/30 flex items-center justify-center text-xs font-bold text-violet-200">
                          {review.author.charAt(0)}
                       </div>
                       <div>
                          <p className="font-medium text-white text-sm">{review.author}</p>
                          <p className="text-xs text-white/40">Verified Buyer</p>
                       </div>
                    </div>
                    <div className="flex gap-0.5 text-amber-400">
                       {Array.from({length: 5}).map((_, i) => (
                          <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "fill-current" : "fill-white/10 text-white/10"}`} />
                       ))}
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-white/70">{review.comment}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-8">
           {/* New: Frequently bought together */}
           <GlassCard className="p-5 border-violet-500/20 bg-violet-900/10">
              <div className="flex items-center gap-2 mb-4">
                 <PackagePlus className="h-4 w-4 text-violet-300" />
                 <h3 className="font-bold text-white text-sm">Frequently Bought Together</h3>
              </div>
              <div className="space-y-3">
                 {related.slice(0, 2).map((item) => (
                    <div key={item.id} className="flex items-center gap-3 bg-black/40 p-2 rounded-lg border border-white/5">
                       <div className="relative h-10 w-10 shrink-0 bg-white/5 rounded-md overflow-hidden">
                          <Image src={item.images[0]} alt={item.name} fill className="object-contain p-1" />
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white truncate">{item.name}</p>
                          <p className="text-xs text-white/60">{formatCurrency(item.price)}</p>
                       </div>
                       <input type="checkbox" defaultChecked className="accent-violet-500 h-4 w-4" />
                    </div>
                 ))}
                 <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-white/60">Bundle Price:</span>
                    <span className="font-bold text-white">{formatCurrency(product.price + related[0].price + related[1].price)}</span>
                 </div>
                 <Button size="sm" className="w-full">Add Bundle to Cart</Button>
              </div>
           </GlassCard>

           {/* 11 & 12. Compatible products & Related kits */}
           <div>
              <h3 className="font-bold text-white text-sm mb-4 border-b border-white/10 pb-2">Compatible Parts</h3>
              <div className="grid gap-4">
                {related.map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
