export type TikTokVideo = {
  id: string;
  url: string;
  title?: string;
  desc?: string;
  author?: { id?: string; username?: string; name?: string };
  stats?: { playCount?: number; likeCount?: number; shareCount?: number; commentCount?: number };
  playCount?: number;
  views?: number;
};

export type DailyQueue = {
  date: string; // YYYY-MM-DD
  videos: TikTokVideo[];
  posted?: boolean;
  postResults?: Array<{ id: string; success: boolean; error?: string }>;
};
