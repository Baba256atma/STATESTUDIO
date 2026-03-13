const API_BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_BACKEND_URL) ||
  "http://127.0.0.1:8000";

export type HealthResponse = {
  ok: boolean;
  version?: string;
  time?: string;
};

export async function pingHealth(): Promise<HealthResponse> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) {
      return { ok: false };
    }
    const data = await res.json();
    return data as HealthResponse;
  } catch {
    return { ok: false };
  }
}
