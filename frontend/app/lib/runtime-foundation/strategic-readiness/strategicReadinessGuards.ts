import type {
  ExecutiveReadinessSnapshot,
  FeatureReadinessEntry,
  ReadinessSignal,
  RuntimeHealthSummary,
  RuntimeReadinessRegistry,
  StrategicReadinessEvaluation,
} from "./strategicReadinessTypes.ts";

function validConfidence(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= 1;
}

export function validateReadinessSignal(signal: ReadinessSignal | null | undefined): signal is ReadinessSignal {
  if (!signal) return false;
  if (!signal.id.trim() || !signal.label.trim()) return false;
  return validConfidence(signal.confidence);
}

export function validateFeatureReadinessEntry(
  entry: FeatureReadinessEntry | null | undefined
): entry is FeatureReadinessEntry {
  if (!entry) return false;
  if (!entry.featureId.trim() || !entry.label.trim()) return false;
  return validConfidence(entry.confidence);
}

export function validateRuntimeHealthSummary(
  summary: RuntimeHealthSummary | null | undefined
): summary is RuntimeHealthSummary {
  if (!summary) return false;
  if (!summary.signature.trim()) return false;
  if (!Number.isFinite(summary.generatedAt)) return false;
  return validConfidence(summary.confidence);
}

export function validateRuntimeReadinessRegistry(
  registry: RuntimeReadinessRegistry | null | undefined
): registry is RuntimeReadinessRegistry {
  if (!registry) return false;
  if (!registry.registryId.trim() || !registry.organizationId.trim() || !registry.signature.trim()) return false;
  if (!validateRuntimeHealthSummary(registry.runtimeHealth)) return false;
  if (!validConfidence(registry.platform.confidence) || !validConfidence(registry.features.confidence)) return false;
  return Number.isFinite(registry.generatedAt);
}

export function validateStrategicReadinessEvaluation(
  evaluation: StrategicReadinessEvaluation | null | undefined
): evaluation is StrategicReadinessEvaluation {
  if (!evaluation) return false;
  if (evaluation.decisionAuthority !== "evaluation_only") return false;
  return validConfidence(evaluation.confidence);
}

export function validateExecutiveReadinessSnapshot(
  snapshot: ExecutiveReadinessSnapshot | null | undefined
): snapshot is ExecutiveReadinessSnapshot {
  if (!snapshot) return false;
  if (!snapshot.snapshotId.trim() || !snapshot.organizationId.trim() || !snapshot.signature.trim()) return false;
  if (!snapshot.answer.trim()) return false;
  if (!Number.isFinite(snapshot.generatedAt)) return false;
  return Object.values(snapshot.evaluations).every(validateStrategicReadinessEvaluation);
}
