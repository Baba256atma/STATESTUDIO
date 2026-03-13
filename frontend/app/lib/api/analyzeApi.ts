import { fetchJson } from "./fetchJson";

const API_BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE) ||
  "http://127.0.0.1:8000";

export type AnalyzeFullResponse = {
  episode_id: string;
  signals: unknown;
  human_state: unknown;
  system_signals: Record<string, number>;
  system_state: unknown;
  visual: unknown;
  replay_warning?: string;
};

export async function analyzeFull(params: {
  episodeId: string | null;
  text: string;
}): Promise<AnalyzeFullResponse> {
  const payload = {
    episode_id: params.episodeId ?? null,
    text: params.text,
  };
  const data = (await fetchJson(`${API_BASE}/analyze/full`, {
    method: "POST",
    body: payload,
  })) as AnalyzeFullResponse;
  if (!data || typeof data !== "object") {
    throw new Error("Invalid analyze response");
  }
  if (!data.episode_id || typeof data.episode_id !== "string") {
    throw new Error("Invalid analyze response: missing episode_id");
  }
  return data;
}
