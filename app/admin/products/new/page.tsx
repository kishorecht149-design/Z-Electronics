"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, UploadCloud, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

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
    description: "",
    category: "",
    brand: "",
    images: [] as string[]
  });

  const [isUploading, setIsUploading] = useState(false);
  const [cloudinaryUrl, setCloudinaryUrl] = useState("");

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
    if (!formData.name || !formData.price || formData.images.length === 0) {
      toast.error("Please fill required fields and upload an image");
      return;
    }

    createMutation.mutate({
      ...formData,
      price: Number(formData.price),
      compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
      stock: Number(formData.stock || 0)
    });
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
                    <label className="text-xs text-white/60 mb-2 block uppercase tracking-wider">SKU</label>
                    <Input 
                      placeholder="e.g. RPI-5-8GB" 
                      value={formData.sku}
                      onChange={(e) => setFormData(prev => ({...prev, sku: e.target.value}))}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/60 mb-2 block uppercase tracking-wider">Brand</label>
                    <Input 
                      placeholder="e.g. Raspberry Pi Foundation" 
                      value={formData.brand}
                      onChange={(e) => setFormData(prev => ({...prev, brand: e.target.value}))}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-2 block uppercase tracking-wider">Description</label>
                  <textarea 
                    className="w-full rounded-xl border border-white/10 bg-black/40 py-3 px-4 text-sm text-white placeholder:text-white/30 outline-none focus:border-violet-500/50 transition-colors h-32 resize-y"
                    placeholder="Detailed product description..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                  />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Product Images</h2>
              <div className="grid grid-cols-4 gap-4 mb-4">
                {formData.images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/40">
                    <Image src={img} alt={`Upload ${i+1}`} fill className="object-cover" />
                  </div>
                ))}
                <label className={`relative aspect-square rounded-xl border-2 border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:border-violet-500/50 hover:bg-violet-500/5 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  {isUploading ? <Loader2 className="h-6 w-6 text-violet-400 animate-spin" /> : <UploadCloud className="h-6 w-6 text-white/50 mb-2" />}
                  <span className="text-xs text-white/50">{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                </label>
              </div>

              <div className="border-t border-white/5 pt-4 mt-4">
                <label className="text-xs text-white/60 mb-2 block uppercase tracking-wider">Or Paste Cloudinary / External Image URL</label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="https://res.cloudinary.com/..." 
                    value={cloudinaryUrl}
                    onChange={(e) => setCloudinaryUrl(e.target.value)}
                  />
                  <Button 
                    type="button" 
                    variant="secondary"
                    onClick={() => {
                      if (cloudinaryUrl.trim()) {
                        setFormData(prev => ({
                          ...prev,
                          images: [...prev.images, cloudinaryUrl.trim()]
                        }));
                        setCloudinaryUrl("");
                        toast.success("Image link added!");
                      } else {
                        toast.error("Please enter a valid image URL");
                      }
                    }}
                  >
                    Add URL
                  </Button>
                </div>
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
