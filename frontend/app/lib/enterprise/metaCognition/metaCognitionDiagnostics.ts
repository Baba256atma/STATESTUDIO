type MetaCognitionDiagnosticKind =
  | "meta_cognition_sync_instability"
  | "reasoning_continuity_violation"
  | "assumption_reflection_drift"
  | "fragmented_confidence_rendering"
  | "strategic_reflection_degradation";

const recent = new Map<string, number>();
const DEDUPE_MS = 8_000;

function emit(kind: MetaCognitionDiagnosticKind, message: string): void {
  const key = `${kind}:${message}`;
  const now = Date.now();
  const last = recent.get(key);
  if (last != null && now - last < DEDUPE_MS) return;
  recent.set(key, now);
  if (process.env.NODE_ENV === "production") return;
  console.warn(`[nexora:f10-1-meta-cognition] ${kind}: ${message}`);
}

export function reportMetaCognitionSyncInstability(message: string): void {
  emit("meta_cognition_sync_instability", message);
}

export function reportReasoningContinuityViolation(message: string): void {
  emit("reasoning_continuity_violation", message);
}
