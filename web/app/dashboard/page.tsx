export default function DashboardPage() {
  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-gray-600 mt-1">
        Charts + KPIs (next step).
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-4">Top Job Categories</div>
        <div className="rounded-lg border bg-white p-4">Top Hard Skills</div>
        <div className="rounded-lg border bg-white p-4">Top Tools</div>
      </div>
    </div>
  );
}
