import { kv } from "@lib/kv";
import type { NextRequest } from "next/server";
import type { DailyQueue } from "@lib/types";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const key = `queue:${yyyy}-${mm}-${dd}`;

  const data = (await kv.get<DailyQueue>(key)) ?? { date: `${yyyy}-${mm}-${dd}`, videos: [] };
  return Response.json(data);
}
