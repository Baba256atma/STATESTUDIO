import { fetchJson } from "./fetchJson";

const API_BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE) ||
  "http://127.0.0.1:8000";

export type ReplayFrame = {
  t: number;
  input_text?: string | null;
  system_signals: Record<string, number>;
  system_state?: Record<string, unknown> | null;
  visual: Record<string, unknown>;
  meta?: { note?: string | null; tags?: string[] };
};

export type ReplayEpisode = {
  episode_id: string;
  created_at: string;
  updated_at: string;
  title?: string | null;
  frames: ReplayFrame[];
  duration: number;
  version: string;
};

type EpisodeSummary = {
  episode_id: string;
  title?: string | null;
  created_at: string;
  updated_at: string;
  duration: number;
  frame_count: number;
};
type DemoSeedResponse = {
  episode_id: string;
  title: string;
  frame_count: number;
};

function assertObject(value: unknown, name: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Invalid ${name}: expected object`);
  }
  return value as Record<string, unknown>;
}

function assertString(value: unknown, name: string) {
  if (typeof value !== "string") {
    throw new Error(`Invalid ${name}: expected string`);
  }
  return value;
}

function assertNumber(value: unknown, name: string) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`Invalid ${name}: expected number`);
  }
  return value;
}

function validateEpisodeSummary(value: unknown): EpisodeSummary {
  const obj = assertObject(value, "episode summary");
  return {
    episode_id: assertString(obj.episode_id, "episode_id"),
    title: typeof obj.title === "string" ? obj.title : obj.title == null ? null : undefined,
    created_at: assertString(obj.created_at, "created_at"),
    updated_at: assertString(obj.updated_at, "updated_at"),
    duration: assertNumber(obj.duration, "duration"),
    frame_count: assertNumber(obj.frame_count, "frame_count"),
  };
}

function validateReplayFrame(value: unknown): ReplayFrame {
  const obj = assertObject(value, "replay frame");
  const systemSignals = obj.system_signals;
  if (!systemSignals || typeof systemSignals !== "object" || Array.isArray(systemSignals)) {
    throw new Error("Invalid system_signals: expected object");
  }
  return {
    t: assertNumber(obj.t, "t"),
    input_text:
      typeof obj.input_text === "string"
        ? obj.input_text
        : obj.input_text == null
        ? null
        : undefined,
    system_signals: systemSignals as Record<string, number>,
    system_state:
      typeof obj.system_state === "object" && obj.system_state !== null
        ? (obj.system_state as Record<string, unknown>)
        : undefined,
    visual:
      typeof obj.visual === "object" && obj.visual !== null
        ? (obj.visual as Record<string, unknown>)
        : {},
    meta:
      typeof obj.meta === "object" && obj.meta !== null
        ? (obj.meta as { note?: string | null; tags?: string[] })
        : undefined,
  };
}

function validateEpisode(value: unknown): ReplayEpisode {
  const obj = assertObject(value, "replay episode");
  const frames = Array.isArray(obj.frames) ? obj.frames.map(validateReplayFrame) : [];
  return {
    episode_id: assertString(obj.episode_id, "episode_id"),
    created_at: assertString(obj.created_at, "created_at"),
    updated_at: assertString(obj.updated_at, "updated_at"),
    title: typeof obj.title === "string" ? obj.title : obj.title == null ? null : undefined,
    duration: assertNumber(obj.duration, "duration"),
    frames,
    version: assertString(obj.version, "version"),
  };
}

export async function listEpisodes(): Promise<EpisodeSummary[]> {
  const data = await fetchJson(`${API_BASE}/replay/episodes`);
  if (!Array.isArray(data)) {
    throw new Error("Invalid episode list: expected array");
  }
  return data.map(validateEpisodeSummary);
}

export async function getEpisode(episodeId: string): Promise<ReplayEpisode> {
  const data = await fetchJson(`${API_BASE}/replay/episodes/${episodeId}`);
  return validateEpisode(data);
}

function validateDemoSeedResponse(value: unknown): DemoSeedResponse {
  const obj = assertObject(value, "demo seed response");
  return {
    episode_id: assertString(obj.episode_id, "episode_id"),
    title: assertString(obj.title, "title"),
    frame_count: assertNumber(obj.frame_count, "frame_count"),
  };
}

export async function seedDemo(
  demoId: "growth" | "fixes" | "escalation"
): Promise<DemoSeedResponse> {
  const data = await fetchJson(`${API_BASE}/replay/demo/seed`, {
    method: "POST",
    body: { demo_id: demoId },
  });
  return validateDemoSeedResponse(data);
}
