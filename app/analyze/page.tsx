"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function dataURLToBlob(dataURL: string) {
  const [meta, b64] = dataURL.split(",");
  const mime = meta.match(/data:(.*);base64/)?.[1] || "image/png";
  const bytes = atob(b64);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

export default function AnalyzePage() {
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      const uploadB64 = sessionStorage.getItem("upload_b64");
      if (!uploadB64) {
        router.push("/upload");
        return;
      }

      const blob = dataURLToBlob(uploadB64);
      const form = new FormData();
      form.append("file", blob, "selfie.png");

      const res = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        setErr(`Backend error: ${res.status}`);
        return;
      }

      const data = await res.json();
      sessionStorage.setItem("results", JSON.stringify(data));
      router.push("/results");
    };

    run();
  }, [router]);

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold">Analyzing…</h1>
      <p className="text-gray-600">Computing undertone/value/chroma and season…</p>
      {err && <p className="text-red-600 mt-4">{err}</p>}
    </main>
  );
}