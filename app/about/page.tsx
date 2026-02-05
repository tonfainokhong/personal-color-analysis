import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">About</h1>
        <p className="text-gray-700">
          This app analyzes a selfie to estimate undertone, value, and chroma, then turns that into
          practical style recommendations.
        </p>
        <Link href="/" className="underline text-gray-700">
          Back
        </Link>
      </div>
    </main>
  );
}
