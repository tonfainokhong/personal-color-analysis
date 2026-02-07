import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-xl w-full space-y-6">
        <h1 className="text-3xl font-bold">Personal Color Analysis</h1>
        <p className="text-gray-600">
          Upload a selfie, get your undertone/value/chroma, and receive practical style recommendations.
        </p>

        <div className="flex gap-3">
          <Link
            href="/upload"
            className="px-4 py-2 rounded bg-black text-white hover:opacity-90"
          >
            Start
          </Link>
          <Link
            href="/about"
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50"
          >
            About
          </Link>
        </div>
      </div>
    </main>
  );
}
