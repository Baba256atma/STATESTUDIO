const API_BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE) ||
  "http://127.0.0.1:8000";

export type ChatEvent = {
  timestamp: string;
  user_text: string;
  reply: string;
  actions: any[];
};

async function safeFetch(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
}

export async function getRecentEvents(userId: string, limit = 20): Promise<ChatEvent[]> {
  const data = await safeFetch(`${API_BASE}/events/recent?user_id=${encodeURIComponent(userId)}&limit=${limit}`);
  return Array.isArray(data.events) ? data.events : [];
}
