type ConsciousnessDiagnosticKind =
  | "cognition_sync_drift"
  | "orchestration_instability"
  | "fragmented_intelligence_rendering"
  | "meta_intelligence_continuity_violation"
  | "governance_sync_degradation"
  | "foresight_orchestration_instability";

const recent = new Map<string, number>();
const DEDUPE_MS = 8_000;

function emit(kind: ConsciousnessDiagnosticKind, message: string): void {
  const key = `${kind}:${message}`;
  const now = Date.now();
  const last = recent.get(key);
  if (last != null && now - last < DEDUPE_MS) return;
  recent.set(key, now);
  if (process.env.NODE_ENV === "production") return;
  console.warn(`[nexora:f10-5-consciousness] ${kind}: ${message}`);
}

export function reportCognitionSyncDrift(message: string): void {
  emit("cognition_sync_drift", message);
}

export function reportMetaIntelligenceContinuityViolation(message: string): void {
  emit("meta_intelligence_continuity_violation", message);
}

export function reportOrchestrationInstability(message: string): void {
  emit("orchestration_instability", message);
}
