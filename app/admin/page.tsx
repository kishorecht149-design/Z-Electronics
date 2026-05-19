import { AdminShell } from "@/components/admin/admin-shell";
import { GlassCard } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <div className="page-shell py-16">
      <AdminShell title="Analytics Overview">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["Revenue", "₹18.2L", "+14.8%"],
            ["Orders", "1,284", "+9.2%"],
            ["AOV", "₹1,416", "+4.7%"],
            ["Conversion", "5.8%", "+0.9%"]
          ].map(([label, value, delta]) => (
            <GlassCard key={label}>
              <p className="text-sm text-white/55">{label}</p>
              <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
              <p className="mt-2 text-sm text-emerald-300">{delta}</p>
            </GlassCard>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <GlassCard>
            <p className="text-xl font-semibold text-white">Revenue graph</p>
            <div className="mt-8 flex h-64 items-end gap-3">
              {[40, 48, 62, 58, 80, 92, 88, 104, 96, 118, 124, 140].map((value) => (
                <div key={value} className="flex-1 rounded-t-3xl bg-gradient-to-t from-violet-600 to-pink" style={{ height: `${value * 1.4}px` }} />
              ))}
            </div>
          </GlassCard>
          <GlassCard>
            <p className="text-xl font-semibold text-white">Sales Mix</p>
            <div className="mt-8 space-y-4">
              {[
                ["Microcontrollers", "34%"],
                ["Sensors", "26%"],
                ["Power", "18%"],
                ["Tools", "22%"]
              ].map(([label, value]) => (
                <div key={label}>
                  <div className="mb-2 flex justify-between text-sm text-white/65"><span>{label}</span><span>{value}</span></div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div className="h-2 rounded-full bg-gradient-to-r from-violet-600 to-pink" style={{ width: value }} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </AdminShell>
    </div>
  );
}
