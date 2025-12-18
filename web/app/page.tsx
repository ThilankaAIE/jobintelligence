const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async function Home() {
  const res = await fetch(`${API_BASE}/health`, { cache: "no-store" });
  const data = await res.json();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">JobIntelligence UI</h1>
      <p className="mt-4">Backend health check:</p>
      <pre className="mt-2 bg-gray-100 p-4 rounded">
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}
