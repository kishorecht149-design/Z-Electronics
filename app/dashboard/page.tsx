import { UserDashboardOverview } from "@/components/dashboard/user-dashboard-overview";

export default function DashboardPage() {
  return (
    <div className="page-shell py-16">
      <h1 className="text-5xl font-semibold text-white">User Dashboard</h1>
      <p className="mt-4 text-sm leading-7 text-white/60">
        Order history, saved addresses, notifications, invoice management and tracking timelines in one secure workspace.
      </p>
      <div className="mt-10">
        <UserDashboardOverview />
      </div>
    </div>
  );
}
