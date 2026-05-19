import { AdminShell } from "@/components/admin/admin-shell";
import { GlassCard } from "@/components/ui/card";

export default function AdminCustomersPage() {
  return (
    <div className="page-shell py-16">
      <AdminShell title="User Management">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Active Customers", "4,281"],
            ["Wholesale Accounts", "112"],
            ["New This Month", "386"]
          ].map(([label, value]) => (
            <GlassCard key={label}>
              <p className="text-sm text-white/55">{label}</p>
              <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
            </GlassCard>
          ))}
        </div>
      </AdminShell>
    </div>
  );
}
