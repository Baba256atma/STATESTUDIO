type CoherenceDiagnosticKind =
  | "coherence_sync_instability"
  | "alignment_continuity_violation"
  | "operational_harmony_drift"
  | "fragmented_coherence_rendering"
  | "institutional_synchronization_degradation"
  | "strategic_alignment_instability";

const recent = new Map<string, number>();
const DEDUPE_MS = 8_000;

function emit(kind: CoherenceDiagnosticKind, message: string): void {
  const key = `${kind}:${message}`;
  const now = Date.now();
  const last = recent.get(key);
  if (last != null && now - last < DEDUPE_MS) return;
  recent.set(key, now);
  if (process.env.NODE_ENV === "production") return;
  console.warn(`[nexora:f9-2-coherence] ${kind}: ${message}`);
}

export function reportCoherenceSyncInstability(message: string): void {
  emit("coherence_sync_instability", message);
}

export function reportAlignmentContinuityViolation(message: string): void {
  emit("alignment_continuity_violation", message);
}

export function reportOperationalHarmonyDrift(message: string): void {
  emit("operational_harmony_drift", message);
}
