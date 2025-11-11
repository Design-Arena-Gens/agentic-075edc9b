import { Suspense } from "react";
import dayjs from "dayjs";

async function getVideos(): Promise<any> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/videos`, { cache: "no-store" });
    return await res.json();
  } catch {
    return { date: dayjs().format("YYYY-MM-DD"), videos: [] };
  }
}

async function runNow() {
  "use server";
  await fetch("/api/manual-run", { method: "POST" });
}

export default async function Page() {
  const data = await getVideos();
  const videos = Array.isArray(data?.videos) ? data.videos : [];

  return (
    <main>
      <section style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>Today: {data?.date || dayjs().format("YYYY-MM-DD")}</div>
          <div style={{ color: "#666" }}>Queued football edits (min 500k views)</div>
        </div>
        <form action={runNow}>
          <button type="submit" style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: 8 }}>Run now</button>
        </form>
      </section>

      <Suspense fallback={<div>Loading?</div>}>
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          {videos.map((v: any) => (
            <li key={v.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>{v.author?.name || v.author?.username || "Unknown"}</div>
              <a href={v.url} target="_blank" rel="noreferrer" style={{ display: "block", color: "#0366d6", marginBottom: 8 }}>View on TikTok ?</a>
              <div style={{ fontSize: 14, color: "#555" }}>{v.title || v.desc || ""}</div>
              <div style={{ marginTop: 8, fontSize: 12, color: "#777" }}>Views: {v.stats?.playCount?.toLocaleString?.() || v.playCount?.toLocaleString?.() || v.views}</div>
            </li>
          ))}
        </ul>
        {videos.length === 0 && <div>No videos queued yet.</div>}
      </Suspense>
    </main>
  );
}
