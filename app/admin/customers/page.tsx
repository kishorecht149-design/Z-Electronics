"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { AdminShell } from "@/components/admin/admin-shell";
import { GlassCard } from "@/components/ui/card";
import { adminService } from "@/services/admin.service";

export default function AdminCustomersPage() {
  const { data: res, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => adminService.getUsers()
  });

  const stats = res?.data?.stats;
  const users = res?.data?.users ?? [];

  return (
    <div className="page-shell py-16">
      <AdminShell title="User Management">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Active Customers", stats?.activeCustomers?.toLocaleString() ?? "0"],
            ["Wholesale Accounts", stats?.wholesaleAccounts?.toLocaleString() ?? "0"],
            ["New This Month", stats?.newThisMonth?.toLocaleString() ?? "0"]
          ].map(([label, value]) => (
            <GlassCard key={label}>
              <p className="text-sm text-white/55">{label}</p>
              <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
            </GlassCard>
          ))}
        </div>

        <GlassCard className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-white/10 text-white/45">
                  <tr>
                    <th className="pb-4 font-medium">Name</th>
                    <th className="pb-4 font-medium">Email</th>
                    <th className="pb-4 font-medium">Role</th>
                    <th className="pb-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: any) => (
                    <tr key={user._id} className="border-b border-white/5 text-white/75">
                      <td className="py-4">{user.name}</td>
                      <td className="py-4">{user.email}</td>
                      <td className="py-4 capitalize">{user.role}</td>
                      <td className="py-4">{user.isActive ? "Active" : "Disabled"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      </AdminShell>
    </div>
  );
}
