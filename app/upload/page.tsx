import Link from "next/link";

export default function UploadPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Upload a selfie</h1>
        <p className="text-gray-600">
          Week 1: this is a UI placeholder. Week 2: you’ll implement real upload + preprocessing.
        </p>

        <div className="border-2 border-dashed rounded p-8 text-center text-gray-500">
          Upload box placeholder
        </div>

        <div className="flex justify-between">
          <Link href="/" className="underline text-gray-700">
            Back
          </Link>
          <Link
            href="/analyze"
            className="px-4 py-2 rounded bg-black text-white hover:opacity-90"
          >
            Continue
          </Link>
        </div>
      </div>
    </main>
  );
}
