import { kv as vercelKv } from "@vercel/kv";

// Minimal wrapper to guard optional KV configuration
export const kv = {
  async get<T>(key: string): Promise<T | null> {
    try {
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        // @vercel/kv handles env itself
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return (await vercelKv.get<T>(key)) as any;
      }
    } catch {}
    return inMemory.has(key) ? (inMemory.get(key) as T) : null;
  },
  async set<T>(key: string, value: T): Promise<void> {
    try {
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        await vercelKv.set(key, value as any);
        return;
      }
    } catch {}
    inMemory.set(key, value as any);
  },
};

const inMemory = new Map<string, unknown>();
