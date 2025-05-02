'use client';

export default function DashboardPage() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <h3 className="font-semibold">Total Transfers</h3>
          <div className="text-2xl font-bold">1,234</div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <h3 className="font-semibold">This Month</h3>
          <div className="text-2xl font-bold">321</div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <h3 className="font-semibold">Total Volume</h3>
          <div className="text-2xl font-bold">$5,678,901</div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <h3 className="font-semibold">Active Clients</h3>
          <div className="text-2xl font-bold">567</div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6">
              <h3 className="font-semibold">Recent Transfer #{i}</h3>
              <p className="text-sm text-muted-foreground">Recent transfer details here</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
