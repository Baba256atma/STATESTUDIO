import type { SceneJson } from "./sceneTypes";

const SESSION_KEY = "statestudio.sessionId";

export async function chatToBackend(
  text: string
): Promise<{
  reply: string;
  scene_json: SceneJson | null;
  session_id: string;
  active_mode: string;
  source?: string;
}> {
  let sessionId: string | null = null;
  if (typeof window !== "undefined") {
    try {
      sessionId = window.localStorage.getItem(SESSION_KEY);
    } catch {
      sessionId = null;
    }
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (sessionId) headers["X-Session-Id"] = sessionId;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  let res: Response;
  try {
    res = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers,
      body: JSON.stringify({ text }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) throw new Error(`Backend error: ${res.status}`);
  const data = await res.json();

  if (typeof window !== "undefined" && data?.session_id) {
    try {
      window.localStorage.setItem(SESSION_KEY, data.session_id);
    } catch {
      // ignore
    }
  }

  return data;
}
