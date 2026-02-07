import Link from "next/link";

export default function AnalyzePage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Analyzing…</h1>
        <p className="text-gray-600">
          Running face parsing + analysis from uploaded selfie...
        </p>

        <div className="rounded border p-6 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>

        <div className="flex justify-between">
          <Link href="/upload" className="underline text-gray-700">
            Back
          </Link>
          <Link
            href="/results"
            className="px-4 py-2 rounded bg-black text-white hover:opacity-90"
          >
            View results (mock)
          </Link>
        </div>
      </div>
    </main>
  );
}
