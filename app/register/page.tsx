"use client";

import { useMutation } from "@tanstack/react-query";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const registerMutation = useMutation({
    mutationFn: (data: any) => authService.register(data),
    onSuccess: async (res) => {
      login(res.data.user, res.data.token);
      toast.success("Account created successfully!");
      
      try {
        const userState = await userService.getState();
        if (userState.success) {
           useCartStore.getState().setStore({
             items: userState.data.cart.map((c: any) => ({
               productId: typeof c.productId === "object" ? c.productId._id : c.productId,
               quantity: c.quantity
             })),
             wishlist: userState.data.wishlist.map((w: any) => typeof w === "object" ? w._id : w)
           });
        }
      } catch (err) {
        console.error("Post-register cart sync failed", err);
      }
      
      router.push("/dashboard");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create account");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    registerMutation.mutate({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });
  };

  return (
    <div className="page-shell flex min-h-[80vh] flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">Create an Account</h2>
          <p className="mt-2 text-sm text-white/60">
            Join the premium marketplace for engineers and innovators.
          </p>
        </div>

        <GlassCard className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/60 mb-2 block uppercase tracking-wider">Full Name</label>
                <Input
                  type="text"
                  placeholder="Ada Lovelace"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                  required
                />
              </div>
              <div>
                <label className="text-xs text-white/60 mb-2 block uppercase tracking-wider">Email Address</label>
                <Input
                  type="email"
                  placeholder="engineer@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                  required
                />
              </div>
              <div>
                <label className="text-xs text-white/60 mb-2 block uppercase tracking-wider">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
                  required
                  minLength={8}
                />
              </div>
              <div>
                <label className="text-xs text-white/60 mb-2 block uppercase tracking-wider">Confirm Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({...prev, confirmPassword: e.target.value}))}
                  required
                  minLength={8}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11" 
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                 <>Create Account <ArrowRight className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </form>
        </GlassCard>

        <p className="text-center text-sm text-white/60">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-violet-400 hover:text-violet-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
