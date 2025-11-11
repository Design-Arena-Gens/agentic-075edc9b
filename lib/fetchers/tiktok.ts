import { z } from "zod";
import type { TikTokVideo } from "@lib/types";

const RapidSearchResponse = z.object({
  data: z.object({
    videos: z.array(z.any()).optional(),
    result: z.array(z.any()).optional(),
  }).optional(),
  aweme_list: z.array(z.any()).optional(),
});

function normalizeFromRapid(item: any): TikTokVideo | null {
  // Supports multiple RapidAPI providers' shapes
  try {
    const id = item.id || item.aweme_id || item.video_id || item.aweme?.aweme_id;
    const stats = item.stats || item.statistics || item.aweme?.statistics || {};
    const author = item.author || item.author_info || item.author?.nickname || item.nickname || {};
    const desc = item.title || item.desc || item.title_desc || item.aweme?.desc;
    const url = item.play || item.content_url || item.share_url || item.aweme?.share_url;

    const playCount = Number(stats.play_count || stats.playCount || stats.play || stats.views || stats.playCountTotal || 0);

    if (!id || !url) return null;

    return {
      id: String(id),
      url: String(url),
      title: item.title,
      desc,
      author: typeof author === "string" ? { name: author } : {
        id: author.id || author.uid || author.sec_uid,
        username: author.unique_id || author.username,
        name: author.nickname || author.name,
      },
      stats: {
        playCount,
        likeCount: Number(stats.digg_count || stats.likeCount || stats.likes || 0),
        shareCount: Number(stats.share_count || stats.shares || 0),
        commentCount: Number(stats.comment_count || stats.comments || 0),
      },
      playCount,
      views: playCount,
    };
  } catch {
    return null;
  }
}

async function rapidSearchFootballEdits(): Promise<TikTokVideo[]> {
  const key = process.env.RAPIDAPI_KEY;
  if (!key) return [];

  const url = "https://tiktok-scraper7.p.rapidapi.com/search";
  const params = new URLSearchParams({
    keyword: "football edits",
    region: "US",
    count: "50",
    type: "video",
  });

  const res = await fetch(`${url}?${params.toString()}`, {
    headers: {
      "x-rapidapi-key": key,
      "x-rapidapi-host": "tiktok-scraper7.p.rapidapi.com",
    },
    // Avoid Next caching
    cache: "no-store",
  });
  if (!res.ok) return [];
  const json = await res.json();
  const parsed = RapidSearchResponse.safeParse(json);
  if (!parsed.success) return [];

  const items = (json?.data?.videos || json?.data?.result || json?.aweme_list || []) as any[];
  const normalized = items.map(normalizeFromRapid).filter(Boolean) as TikTokVideo[];
  return normalized;
}

export async function fetchTopFootballEdits(minViews: number, limit: number): Promise<TikTokVideo[]> {
  const lists: TikTokVideo[][] = [];

  try {
    lists.push(await rapidSearchFootballEdits());
  } catch {}

  const merged = lists.flat();
  const unique = new Map<string, TikTokVideo>();
  for (const v of merged) {
    if (!unique.has(v.id)) unique.set(v.id, v);
  }

  const filtered = Array.from(unique.values())
    .filter(v => {
      const views = v.stats?.playCount ?? v.playCount ?? v.views ?? 0;
      return views >= minViews;
    })
    .sort((a, b) => (b.stats?.playCount ?? 0) - (a.stats?.playCount ?? 0))
    .slice(0, limit);

  return filtered;
}
