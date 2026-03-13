
export type ChatResponse = {
  ok: boolean;
  user_id?: string | null;
  reply: string;
  actions?: unknown;
  scene_json?: unknown;
  source?: string | null;
  analysis_summary?: string | null;
  error?: unknown;
  debug?: unknown;
};

export type KPIState = { inventory?: number; delivery?: number; risk?: number };
export type LoopEdge = {
  id: string;
  from: string;
  to: string;
  weight: number;
  label?: string;
  polarity?: "negative" | "positive" | string;
};

const DEFAULT_TIMEOUT_MS = 12_000;

const SESSION_KEY = "statestudio.sessionId";
const API_BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_BACKEND_URL) ||
  "http://127.0.0.1:8000";

function readSessionId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

function writeSessionId(sessionId: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SESSION_KEY, sessionId);
  } catch {
    // ignore
  }
}

export async function chatToBackend(payload: {
  text: string;
  mode?: string | null;
  user_id?: string | null;
  allowed_objects?: string[];
}): Promise<ChatResponse> {
  const { text, mode, user_id, allowed_objects } = payload;

  const sessionId = readSessionId();

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (sessionId) headers["X-Session-Id"] = sessionId;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers,
      body: JSON.stringify({ text, mode, user_id, allowed_objects }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const msg =
      (data as any)?.detail?.error?.message ||
      (data as any)?.error?.message ||
      `Chat request failed (HTTP ${res.status})`;
    throw new Error(String(msg));
  }
  if (!data || typeof data !== "object") {
    throw new Error("Invalid JSON from backend");
  }
  const sid = typeof (data as any)?.session_id === "string" ? (data as any).session_id : null;
  if (sid) writeSessionId(sid);
  return data as ChatResponse;
}

export async function fetchObjectProfile(
  id: string
): Promise<{
  id: string;
  label: string;
  summary: string;
  tags: string[];
  one_liner?: string;
  synonyms?: string[];
  domain_hints?: Record<string, string[]>;
}> {
  try {
    const res = await fetch(`${API_BASE}/objects/${encodeURIComponent(id)}`);
    if (!res.ok) {
      return { id, label: id, summary: "", tags: [] };
    }
    const data = (await res.json()) as any;
    const obj = data?.object ?? data;
    return {
      id: obj?.id ?? id,
      label: obj?.label ?? id,
      summary: obj?.summary ?? "",
      tags: Array.isArray(obj?.tags) ? obj.tags : [],
      one_liner: typeof obj?.one_liner === "string" ? obj.one_liner : undefined,
      synonyms: Array.isArray(obj?.synonyms) ? obj.synonyms : undefined,
      domain_hints: typeof obj?.domain_hints === "object" && obj?.domain_hints ? obj.domain_hints : undefined,
    };
  } catch {
    return { id, label: id, summary: "", tags: [] };
  }
}
