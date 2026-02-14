"use client";

import Link from "next/link";
import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [skin, setSkin] = useState<string | null>(null);
  const [hair, setHair] = useState<string | null>(null);
  const [lips, setLips] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onPickFile(f: File | null) {
    setFile(f);
    setSkin(null);
    setHair(null);
    setLips(null);
    setError(null);

    if (!f) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
  }

  async function analyze() {
    if (!file) {
      setError("Please choose an image first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("http://127.0.0.1:8000/parse", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        throw new Error(`Backend error: ${res.status}`);
      }

      const data = await res.json();

      setSkin(`data:image/png;base64,${data.skin_mask_b64}`);
      setHair(`data:image/png;base64,${data.hair_mask_b64}`);
      setLips(`data:image/png;base64,${data.lip_mask_b64}`);
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Upload a selfie</h1>
          <p className="text-gray-600">
            Make sure there's good lighting (preferrably near a window)
          </p>
        </div>

        {/* Upload box */}
        <div className="border-2 border-dashed rounded p-6 text-center space-y-3">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm"
          />

          {previewUrl && (
            <div className="flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="preview"
                className="mt-2 max-h-64 rounded"
              />
            </div>
          )}

          <button
            onClick={analyze}
            disabled={!file || loading}
            className="px-4 py-2 rounded bg-black text-white hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>

          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>

        {/* Results */}
        {(skin || hair || lips) && (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Masks</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {skin && (
                <div className="border rounded p-3">
                  <p className="font-medium mb-2">Skin</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={skin} alt="skin mask" className="w-full rounded" />
                </div>
              )}
              {hair && (
                <div className="border rounded p-3">
                  <p className="font-medium mb-2">Hair</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={hair} alt="hair mask" className="w-full rounded" />
                </div>
              )}
              {lips && (
                <div className="border rounded p-3">
                  <p className="font-medium mb-2">Lips</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={lips} alt="lips mask" className="w-full rounded" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Nav */}
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