"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Link2, Loader2, Save, Trash2, UploadCloud } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { adminService } from "@/services/admin.service";
import { productsService } from "@/services/products.service";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const id = String(params.id ?? "");

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
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [didHydrateForm, setDidHydrateForm] = useState(false);

  const { data: productRes, isLoading: isProductLoading } = useQuery({
    queryKey: ["admin-product", id],
    queryFn: () => productsService.getProductById(id),
    enabled: Boolean(id)
  });

  const { data: categoriesRes } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => adminService.getCategories()
  });

  const { data: brandsRes } = useQuery({
    queryKey: ["admin-brands"],
    queryFn: () => adminService.getBrands()
  });

  useEffect(() => {
    if (!productRes?.data || didHydrateForm) return;
    const product = productRes.data;
    setFormData({
      name: product.name ?? "",
      sku: product.sku ?? "",
      price: String(product.price ?? ""),
      compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : "",
      stock: String(product.stock ?? 0),
      status: product.status ?? "draft",
      shortDescription: product.shortDescription ?? "",
      description: product.description ?? "",
      category: typeof product.category === "object" ? product.category?.name ?? "" : product.category ?? "",
      brand: typeof product.brand === "object" ? product.brand?.name ?? "" : product.brand ?? "",
      datasheetUrl: product.datasheetUrl ?? "",
      tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
      images: Array.isArray(product.images) ? product.images : []
    });
    setDidHydrateForm(true);
  }, [didHydrateForm, productRes]);

  const categories = categoriesRes?.data ?? [];
  const brands = brandsRes?.data ?? [];

  const updateMutation = useMutation({
    mutationFn: (data: any) => adminService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-product", id] });
      toast.success("Product updated successfully!");
      router.push("/admin/products");
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || "Failed to update product")
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const res = await adminService.uploadImage(file);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, res.data.url]
      }));
      toast.success("Image uploaded!");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.sku || !formData.price || !formData.shortDescription || !formData.description || !formData.category || !formData.brand || formData.images.length === 0) {
      toast.error("Please fill all required fields and add at least one image");
      return;
    }

    updateMutation.mutate({
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

  if (isProductLoading) {
    return (
      <div className="page-shell py-16">
        <AdminShell title="Edit Product">
          <div className="flex min-h-[40vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
          </div>
        </AdminShell>
      </div>
    );
  }

  if (!productRes?.data) {
    return (
      <div className="page-shell py-16">
        <AdminShell title="Edit Product">
          <GlassCard className="p-8 text-center text-white/55">Product not found.</GlassCard>
        </AdminShell>
      </div>
    );
  }

  return (
    <div className="page-shell py-16">
      <AdminShell title="Edit Product">
        <div className="mb-6">
          <Link href="/admin/products" className="flex w-fit items-center gap-2 text-sm text-white/50 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to Products
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div className="space-y-8">
            <GlassCard className="p-6">
              <h2 className="mb-6 text-lg font-semibold text-white">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-wider text-white/60">Product Name *</label>
                  <Input value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-wider text-white/60">SKU *</label>
                    <Input value={formData.sku} onChange={(e) => setFormData((prev) => ({ ...prev, sku: e.target.value }))} />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-wider text-white/60">Brand *</label>
                    <Input list="brand-options" value={formData.brand} onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))} />
                    <datalist id="brand-options">
                      {brands.map((brand: any) => (
                        <option key={brand._id} value={brand.name} />
                      ))}
                    </datalist>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-wider text-white/60">Short Description *</label>
                  <Input value={formData.shortDescription} onChange={(e) => setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))} />
                </div>
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-wider text-white/60">Description *</label>
                  <textarea
                    className="h-32 w-full resize-y rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-violet-500/50"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-wider text-white/60">Category *</label>
                    <Input list="category-options" value={formData.category} onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))} />
                    <datalist id="category-options">
                      {categories.map((category: any) => (
                        <option key={category._id} value={category.name} />
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-wider text-white/60">Datasheet URL</label>
                    <Input value={formData.datasheetUrl} onChange={(e) => setFormData((prev) => ({ ...prev, datasheetUrl: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-wider text-white/60">Tags</label>
                  <Input value={formData.tags} onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))} />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h2 className="mb-6 text-lg font-semibold text-white">Product Images</h2>
              <div className="mb-4 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-violet-500/10 p-2 text-violet-300">
                    <Link2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Use online image links</p>
                    <p className="text-xs leading-6 text-white/55">You can edit existing product images, add new image URLs, or remove old ones here.</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-xs uppercase tracking-wider text-white/60">Image URL *</label>
                <div className="flex gap-2">
                  <Input placeholder="https://example.com/product-image.jpg" value={imageUrlInput} onChange={(e) => setImageUrlInput(e.target.value)} />
                  <Button type="button" onClick={handleAddImageUrl}>Add Image</Button>
                </div>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                {formData.images.map((img, index) => (
                  <div key={`${img}-${index}`} className="relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-black/40">
                    <img src={img} alt={`Product image ${index + 1}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          images: prev.images.filter((_, currentIndex) => currentIndex !== index)
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

              <div className="mt-4 border-t border-white/5 pt-4">
                <label className="mb-2 block text-xs uppercase tracking-wider text-white/60">Optional: Upload from device</label>
                <label className={`relative flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 bg-white/5 transition-all hover:border-violet-500/50 hover:bg-violet-500/5 ${isUploading ? "pointer-events-none opacity-50" : ""}`}>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  {isUploading ? <Loader2 className="h-6 w-6 animate-spin text-violet-400" /> : <UploadCloud className="mb-2 h-6 w-6 text-white/50" />}
                  <span className="text-xs text-white/50">{isUploading ? "Uploading..." : "Upload Image"}</span>
                </label>
              </div>
            </GlassCard>
          </div>

          <div className="space-y-8">
            <GlassCard className="p-6">
              <h2 className="mb-6 text-lg font-semibold text-white">Pricing & Inventory</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-wider text-white/60">Price (₹) *</label>
                  <Input type="number" value={formData.price} onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))} />
                </div>
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-wider text-white/60">Compare At Price (₹)</label>
                  <Input type="number" value={formData.compareAtPrice} onChange={(e) => setFormData((prev) => ({ ...prev, compareAtPrice: e.target.value }))} />
                </div>
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-wider text-white/60">Stock Level</label>
                  <Input type="number" value={formData.stock} onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))} />
                </div>
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-wider text-white/60">Status</label>
                  <select
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-violet-500/50"
                    value={formData.status}
                    onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </GlassCard>

            <Button type="submit" className="h-12 w-full shadow-lg shadow-violet-500/20" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </AdminShell>
    </div>
  );
}
