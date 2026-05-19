"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Download, Truck, Star, ShieldCheck, Zap, PackagePlus, FileText, HelpCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { formatCurrency, percentOff } from "@/lib/utils";
import { productsService } from "@/services/products.service";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => productsService.getProductBySlug(slug)
  });

  const { data: relatedResponse } = useQuery({
    queryKey: ["products", { limit: 4 }],
    queryFn: () => productsService.getProducts({ limit: 4 })
  });

  if (isLoading) {
    return (
      <div className="page-shell py-32 flex justify-center items-center">
        <Loader2 className="h-10 w-10 text-violet-500 animate-spin" />
      </div>
    );
  }

  if (isError || !response?.data) {
    return (
      <div className="page-shell py-32 flex flex-col justify-center items-center text-white/50">
        <h2 className="text-2xl font-bold text-white mb-4">Product Not Found</h2>
        <p>The product you are looking for does not exist or has been removed.</p>
        <Link href="/shop" className="mt-8 text-violet-400 hover:text-violet-300 underline">Back to Shop</Link>
      </div>
    );
  }

  const product = response.data;
  const related = (relatedResponse?.data || []).filter((item: any) => item._id !== product._id).slice(0, 3);
  
  const imageUrls = product.images?.length ? product.images : ["https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop"];
  const brandName = typeof product.brand === "object" ? product.brand?.name : product.brand;
  const stockState = product.stock > 10 ? "In Stock" : product.stock > 0 ? "Low Stock" : "Out of Stock";

  return (
    <div className="page-shell py-8 md:py-16">
      {/* 1. Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-white/50 mb-8">
        <Link href="/" className="hover:text-white cursor-pointer transition-colors">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-white cursor-pointer transition-colors">Shop</Link>
        <span>/</span>
        <span className="text-white">{product.name}</span>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        {/* 1. Product Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.02]">
            <Image src={imageUrls[0]} alt={product.name} fill className="object-contain p-8" />
          </div>
          {imageUrls.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {imageUrls.map((image: string, idx: number) => (
                <div key={idx} className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] cursor-pointer hover:border-violet-500/50 transition-colors">
                  <Image src={image} alt={`${product.name} view ${idx + 1}`} fill className="object-contain p-2" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div>
            {/* Brand */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">{brandName || "Generic"}</p>
              <p className="text-xs text-white/40">SKU: {product.sku || "N/A"}</p>
            </div>
            
            {/* 2. Product Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">{product.name}</h1>
            
            {/* 3. Ratings */}
            <div className="mt-4 flex items-center gap-4">
              {typeof product.rating === "number" ? (
                <>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-semibold text-white">{product.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-white/50 underline cursor-pointer hover:text-white transition-colors">Read {product.reviewCount || 0} reviews</span>
                </>
              ) : (
                <span className="text-sm text-white/50">No reviews yet</span>
              )}
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
                <div className={`flex items-center justify-end gap-1.5 mb-1 ${product.stock > 0 ? "text-emerald-400" : "text-pink"}`}>
                  <Zap className="h-4 w-4" />
                  <span className="font-semibold text-sm">{stockState}</span>
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
              <Button size="lg" className="h-12 w-full text-base" disabled={product.stock <= 0}>Add to Cart</Button>
              <Button size="lg" variant="secondary" className="h-12 w-full text-base bg-white text-black hover:bg-white/90 border-0" disabled={product.stock <= 0}>Buy Now</Button>
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
              {product.datasheetUrl && (
                <a href={product.datasheetUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="h-8 border-white/10 text-white/80 hover:bg-white/10">
                    <Download className="mr-2 h-3.5 w-3.5" /> Datasheet (PDF)
                  </Button>
                </a>
              )}
            </div>
            {product.specifications?.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                {product.specifications.map((spec: any) => (
                  <div key={spec.label} className="flex flex-col border-b border-white/5 pb-3">
                    <span className="text-xs text-white/50 uppercase tracking-wider mb-1">{spec.label}</span>
                    <span className="font-medium text-white/90 text-sm">{spec.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/50 text-sm">No technical specifications available for this product.</p>
            )}
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
        </div>

        {/* SIDEBAR */}
        <div className="space-y-8">
           {/* New: Frequently bought together */}
           {related.length >= 2 && (
             <GlassCard className="p-5 border-violet-500/20 bg-violet-900/10">
                <div className="flex items-center gap-2 mb-4">
                   <PackagePlus className="h-4 w-4 text-violet-300" />
                   <h3 className="font-bold text-white text-sm">Frequently Bought Together</h3>
                </div>
                <div className="space-y-3">
                   {related.slice(0, 2).map((item: any) => (
                      <div key={item._id} className="flex items-center gap-3 bg-black/40 p-2 rounded-lg border border-white/5">
                         <div className="relative h-10 w-10 shrink-0 bg-white/5 rounded-md overflow-hidden">
                            <Image src={item.images?.[0] || "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800"} alt={item.name} fill className="object-contain p-1" />
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
           )}

           {/* 11 & 12. Compatible products & Related kits */}
           {related.length > 0 && (
             <div>
                <h3 className="font-bold text-white text-sm mb-4 border-b border-white/10 pb-2">Compatible Parts</h3>
                <div className="grid gap-4">
                  {related.map((item: any) => (
                    <ProductCard key={item._id} product={item} />
                  ))}
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
