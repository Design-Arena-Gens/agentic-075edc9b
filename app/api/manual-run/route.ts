import { kv } from "@lib/kv";
import { fetchTopFootballEdits } from "@lib/fetchers/tiktok";
import { postToTikTok } from "@lib/posters/tiktok";
import type { NextRequest } from "next/server";
import type { DailyQueue } from "@lib/types";

export const dynamic = "force-dynamic";

export async function POST(_req: NextRequest) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const date = `${yyyy}-${mm}-${dd}`;
  const key = `queue:${date}`;

  const videos = await fetchTopFootballEdits(500_000, 6);
  const postResults = await postToTikTok(videos);

  const queue: DailyQueue = { date, videos, posted: true, postResults };
  await kv.set(key, queue);

  return Response.json({ ok: true, date, count: videos.length });
}
