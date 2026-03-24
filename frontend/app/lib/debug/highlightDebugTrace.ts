export type HighlightTraceStage =
  | "router"
  | "execution"
  | "ui_state"
  | "homescreen_before_scene"
  | "homescreen_after_apply"
  | "scene_canvas"
  | "scene_object_state";

declare global {
  interface Window {
    __NEXORA_HIGHLIGHT_TRACE__?: boolean;
  }
}

function sanitizeValue(value: unknown, depth = 0): unknown {
  if (depth > 2) return "[MaxDepth]";
  if (Array.isArray(value)) {
    const sliced = value.slice(0, 8).map((item) => sanitizeValue(item, depth + 1));
    return value.length > 8 ? [...sliced, `...(+${value.length - 8} more)`] : sliced;
  }
  if (!value || typeof value !== "object") return value;
  const entries = Object.entries(value as Record<string, unknown>).slice(0, 20);
  const next: Record<string, unknown> = {};
  for (const [key, entryValue] of entries) {
    next[key] = sanitizeValue(entryValue, depth + 1);
  }
  return next;
}

export function shouldTraceHighlightFlow(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  if (typeof window === "undefined") return true;
  return window.__NEXORA_HIGHLIGHT_TRACE__ !== false;
}

export function traceHighlightFlow(
  stage: HighlightTraceStage,
  payload: Record<string, unknown>
): void {
  if (!shouldTraceHighlightFlow()) return;
  try {
    const safePayload = sanitizeValue(payload);
    console.groupCollapsed(`[Nexora][HighlightTrace][${stage}]`);
    console.log(safePayload);
    console.groupEnd();
  } catch (error) {
    console.warn("[Nexora][HighlightTrace] failed", stage, error);
  }
}
