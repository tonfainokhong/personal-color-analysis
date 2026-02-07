import Link from "next/link";

export default function ResultsPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Your Results</h1>
          <p className="text-gray-600">
            [Sample Results]
          </p>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded border p-4">
            <p className="text-sm text-gray-500">Temperature</p>
            <p className="text-lg font-medium">Warm</p>
          </div>
          <div className="rounded border p-4">
            <p className="text-sm text-gray-500">Saturation</p>
            <p className="text-lg font-medium">High</p>
          </div>
          <div className="rounded border p-4">
            <p className="text-sm text-gray-500">Brightness</p>
            <p className="text-lg font-medium">Medium</p>
          </div>
        </section>

        <section className="rounded border p-6 space-y-4">
          <h2 className="text-lg font-semibold">Recommendations</h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Best clothing colors: gray, beige, brown</li>
            <li>Denim wash: dark blue, black</li>
            <li>Makeup palette: rosy neutrals</li>
            <li>Hair color: espresso brown, brown black</li>
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
