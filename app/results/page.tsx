import Link from "next/link";

export default function ResultsPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Your Results</h1>
          <p className="text-gray-600">
            Week 1: mock results. Week 3+: real metrics + recommendations.
          </p>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded border p-4">
            <p className="text-sm text-gray-500">Undertone</p>
            <p className="text-lg font-medium">Neutral (mock)</p>
          </div>
          <div className="rounded border p-4">
            <p className="text-sm text-gray-500">Value</p>
            <p className="text-lg font-medium">Medium (mock)</p>
          </div>
          <div className="rounded border p-4">
            <p className="text-sm text-gray-500">Chroma</p>
            <p className="text-lg font-medium">High (mock)</p>
          </div>
        </section>

        <section className="rounded border p-6 space-y-4">
          <h2 className="text-lg font-semibold">Recommendations (mock)</h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Best clothing colors: emerald, navy, crisp white</li>
            <li>Denim wash: dark indigo</li>
            <li>Makeup palette: rosy neutrals</li>
            <li>Hair color: espresso brown</li>
          </ul>
        </section>

        <div className="flex justify-between">
          <Link href="/" className="underline text-gray-700">
            Home
          </Link>
          <Link href="/upload" className="px-4 py-2 rounded border hover:bg-gray-50">
            Try another photo
          </Link>
        </div>
      </div>
    </main>
  );
}
