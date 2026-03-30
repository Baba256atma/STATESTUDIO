import type { ChatIn, ChatResponseOut } from "./api/generated";
import { postChat } from "./api/client";

export type ChatResponse = ChatResponseOut;

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

  let data: ChatResponse;
  try {
    const requestPayload: ChatIn = { text, mode, user_id, allowed_objects };
    data = await postChat(requestPayload, {
      signal: controller.signal,
      headers,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!data || typeof data !== "object") {
    throw new Error("Invalid JSON from backend");
  }
  const sid = typeof data.session_id === "string" ? data.session_id : null;
  if (sid) writeSessionId(sid);
  return data;
}
