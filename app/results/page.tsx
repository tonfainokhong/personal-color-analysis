"use client";

export default function ResultsPage() {
  const results = JSON.parse(sessionStorage.getItem("results") || "{}");
  const season = results?.season;
  const metrics = results?.metrics;

  return (
    <main className="min-h-screen p-8 space-y-6">
      <h1 className="text-2xl font-semibold">Your Season</h1>
      <div className="text-xl">{season ?? "No season yet"}</div>

      {metrics && (
        <div className="space-y-2">
          <div>Value score: {metrics.value_score?.toFixed?.(3) ?? metrics.value_score}</div>
          <div>Chroma score: {metrics.chroma_score?.toFixed?.(3) ?? metrics.chroma_score}</div>
          <div>Undertone score: {metrics.undertone_score?.toFixed?.(3) ?? metrics.undertone_score}</div>

          <pre className="p-4 border rounded bg-gray-50 overflow-auto">
{JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}