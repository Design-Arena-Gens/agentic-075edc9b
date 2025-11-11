import type { TikTokVideo } from "@lib/types";

// Placeholder implementation for TikTok Content Posting API integration.
// Expects a valid OAuth token set in env to enable posting.

function canPost(): boolean {
  return Boolean(process.env.TIKTOK_ACCESS_TOKEN);
}

export type PostResult = { id: string; success: boolean; error?: string };

export async function postToTikTok(videos: TikTokVideo[]): Promise<PostResult[]> {
  if (!canPost()) {
    // Posting disabled; return as skipped-success for pipeline continuity
    return videos.map((v) => ({ id: v.id, success: true }));
  }

  const token = process.env.TIKTOK_ACCESS_TOKEN as string;

  // NOTE: Real posting requires TikTok's Content Posting APIs with proper scopes and media upload.
  // This function is structured for drop-in replacement once credentials and endpoints are available.

  const results: PostResult[] = [];
  for (const video of videos) {
    try {
      // Example shape (placeholder):
      const res = await fetch("https://open.tiktokapis.com/v2/post/publish/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // In a real implementation, you'd upload media, then reference the uploaded asset ID here
          // This placeholder sends metadata only and will not succeed without proper app approval
          source_url: video.url,
          text: video.desc ?? video.title ?? "",
        }),
      });

      if (!res.ok) {
        const t = await res.text();
        results.push({ id: video.id, success: false, error: `HTTP ${res.status}: ${t}` });
      } else {
        results.push({ id: video.id, success: true });
      }
    } catch (e: any) {
      results.push({ id: video.id, success: false, error: e?.message || "unknown error" });
    }
  }
  return results;
}
