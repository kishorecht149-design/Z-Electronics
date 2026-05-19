"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, UploadCloud, Save, ArrowLeft, Link2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { adminService } from "@/services/admin.service";

export default function NewProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    compareAtPrice: "",
    stock: "",
    status: "draft",
    shortDescription: "",
    description: "",
    category: "",
    brand: "",
    datasheetUrl: "",
    tags: "",
    images: [] as string[]
  });

  const [isUploading, setIsUploading] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");

  const { data: categoriesRes } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => adminService.getCategories()
  });

  const { data: brandsRes } = useQuery({
    queryKey: ["admin-brands"],
    queryFn: () => adminService.getBrands()
  });

  const categories = categoriesRes?.data ?? [];
  const brands = brandsRes?.data ?? [];

  const createMutation = useMutation({
    mutationFn: (data: any) => adminService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product created successfully!");
      router.push("/admin/products");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create product");
    }
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const res = await adminService.uploadImage(file);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, res.data.url]
      }));
      toast.success("Image uploaded!");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.shortDescription || !formData.description || !formData.category || !formData.brand || formData.images.length === 0) {
      toast.error("Please fill all required fields and add at least one image link");
      return;
    }

    createMutation.mutate({
      ...formData,
      price: Number(formData.price),
      compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
      stock: Number(formData.stock || 0),
      datasheetUrl: formData.datasheetUrl || undefined,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    });
  };

  const handleAddImageUrl = () => {
    const normalizedUrl = imageUrlInput.trim();

    if (!normalizedUrl) {
      toast.error("Please enter an image URL");
      return;
    }

    try {
      const parsed = new URL(normalizedUrl);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        toast.error("Use a valid http or https image URL");
        return;
      }

      if (formData.images.includes(normalizedUrl)) {
        toast.error("This image URL is already added");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, normalizedUrl]
      }));
      setImageUrlInput("");
      toast.success("Image link added");
    } catch {
      toast.error("Please enter a valid image URL");
    }
  };

  return (
    <div className="page-shell py-16">
      <AdminShell title="Create Product">
        <div className="mb-6">
          <Link href="/admin/products" className="text-white/50 hover:text-white flex items-center gap-2 text-sm transition-colors w-fit">
            <ArrowLeft className="h-4 w-4" /> Back to Products
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_300px] gap-8">
          <div className="space-y-8">
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/60 mb-2 block uppercase tracking-wider">Product Name *</label>
                  <Input 
                    placeholder="e.g. Raspberry Pi 5" 
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/60 mb-2 block uppercase tracking-wider">SKU *</label>
                    <Input 
                      placeholder="e.g. RPI-5-8GB" 
                      value={formData.sku}
                      onChange={(e) => setFormData(prev => ({...prev, sku: e.target.value}))}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/60 mb-2 block uppercase tracking-wider">Brand *</label>
                    <Input
                      list="brand-options"
                      placeholder="e.g. Raspberry Pi"
                      value={formData.brand}
                      onChange={(e) => setFormData(prev => ({...prev, brand: e.target.value}))}
                    />
                    <datalist id="brand-options">
                      {brands.map((brand: any) => (
                        <option key={brand._id} value={brand.name} />
                      ))}
                    </datalist>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-2 block uppercase tracking-wider">Short Description *</label>
                  <Input
                    placeholder="One-line summary for product cards and search"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData(prev => ({...prev, shortDescription: e.target.value}))}
                  />
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-2 block uppercase tracking-wider">Description *</label>
                  <textarea 
                    className="w-full rounded-xl border border-white/10 bg-black/40 py-3 px-4 text-sm text-white placeholder:text-white/30 outline-none focus:border-violet-500/50 transition-colors h-32 resize-y"
                    placeholder="Detailed product description..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/60 mb-2 block uppercase tracking-wider">Category *</label>
                    <Input
                      list="category-options"
                      placeholder="e.g. Microcontrollers"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({...prev, category: e.target.value}))}
                    />
                    <datalist id="category-options">
                      {categories.map((category: any) => (
                        <option key={category._id} value={category.name} />
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <label className="text-xs text-white/60 mb-2 block uppercase tracking-wider">Datasheet URL</label>
                    <Input
                      placeholder="https://..."
                      value={formData.datasheetUrl}
                      onChange={(e) => setFormData(prev => ({...prev, datasheetUrl: e.target.value}))}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-2 block uppercase tracking-wider">Tags</label>
                  <Input
                    placeholder="iot, wireless, esp32"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({...prev, tags: e.target.value}))}
                  />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Product Images</h2>
              <div className="mb-4 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-violet-500/10 p-2 text-violet-300">
                    <Link2 className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white">Recommended: use online image links</p>
                    <p className="text-xs leading-6 text-white/55">
                      Paste any direct image URL from a CDN, product page, Unsplash, Cloudinary, or your own hosted image.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="text-xs text-white/60 mb-2 block uppercase tracking-wider">Image URL *</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://example.com/product-image.jpg"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                  />
                  <Button type="button" onClick={handleAddImageUrl}>
                    Add Image
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 md:grid-cols-4">
                {formData.images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/40">
                    <img src={img} alt={`Upload ${i + 1}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          images: prev.images.filter((_, index) => index !== i)
                        }))
                      }
                      className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white/80 transition hover:text-pink"
                      aria-label="Remove image"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/5 pt-4 mt-4">
                <label className="text-xs text-white/60 mb-2 block uppercase tracking-wider">Optional: Upload from device</label>
                <label className={`relative min-h-28 rounded-xl border-2 border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:border-violet-500/50 hover:bg-violet-500/5 transition-all ${isUploading ? "opacity-50 pointer-events-none" : ""}`}>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  {isUploading ? <Loader2 className="h-6 w-6 text-violet-400 animate-spin" /> : <UploadCloud className="h-6 w-6 text-white/50 mb-2" />}
                  <span className="text-xs text-white/50">{isUploading ? "Uploading..." : "Upload Image"}</span>
                  <span className="mt-1 text-[11px] text-white/35">Requires Cloudinary env vars on Render</span>
                </label>
              </div>
            </GlassCard>
          </div>

          <div className="space-y-8">
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Pricing & Inventory</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/60 mb-2 block uppercase tracking-wider">Price (₹) *</label>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({...prev, price: e.target.value}))}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-2 block uppercase tracking-wider">Compare At Price (₹)</label>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData(prev => ({...prev, compareAtPrice: e.target.value}))}
                  />
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-2 block uppercase tracking-wider">Stock Level</label>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({...prev, stock: e.target.value}))}
                  />
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-2 block uppercase tracking-wider">Status</label>
                  <select 
                    className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 px-4 text-sm text-white outline-none focus:border-violet-500/50 transition-colors"
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({...prev, status: e.target.value}))}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </GlassCard>

            <Button 
              type="submit" 
              className="w-full h-12 shadow-lg shadow-violet-500/20"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {createMutation.isPending ? "Creating..." : "Save Product"}
            </Button>
          </div>
        </form>
      </AdminShell>
    </div>
  );
}
