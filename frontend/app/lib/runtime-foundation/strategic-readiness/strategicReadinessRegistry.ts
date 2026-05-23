import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type {
  FeatureReadinessEntry,
  FeatureReadinessId,
  FeatureReadinessRegistry,
  ReadinessDimension,
  ReadinessDomainModel,
  ReadinessSignal,
  ReadinessState,
  ReadinessValidationStatus,
  RuntimeHealthCheck,
  RuntimeHealthLevel,
  RuntimeHealthSummary,
  RuntimeReadinessInput,
  RuntimeReadinessRegistry,
} from "./strategicReadinessTypes.ts";

export const READINESS_DIMENSIONS: readonly ReadinessDimension[] = Object.freeze([
  "development_status",
  "test_status",
  "runtime_stability",
  "integration_status",
  "deployment_status",
  "ux_readiness",
  "executive_readiness",
  "operational_readiness",
]);

export const FEATURE_READINESS_IDS: readonly FeatureReadinessId[] = Object.freeze([
  "ingestion",
  "mapping",
  "fragility",
  "simulation",
  "decision_intelligence",
  "executive_panels",
  "scenario_workflows",
  "connectors",
  "chat_intelligence",
]);

const DIMENSION_LABELS: Record<ReadinessDimension, string> = {
  development_status: "Development status",
  test_status: "Test status",
  runtime_stability: "Runtime stability",
  integration_status: "Integration status",
  deployment_status: "Deployment status",
  ux_readiness: "UX readiness",
  executive_readiness: "Executive readiness",
  operational_readiness: "Operational readiness",
};

const FEATURE_LABELS: Record<FeatureReadinessId, string> = {
  ingestion: "Ingestion",
  mapping: "Mapping",
  fragility: "Fragility",
  simulation: "Simulation",
  decision_intelligence: "Decision intelligence",
  executive_panels: "Executive panels",
  scenario_workflows: "Scenario workflows",
  connectors: "Connectors",
  chat_intelligence: "Chat intelligence",
};

const HEALTH_RANK: Record<RuntimeHealthLevel, number> = {
  critical: 0,
  degraded: 1,
  warning: 2,
  healthy: 3,
};

export function clampReadinessConfidence(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Number(Math.min(1, Math.max(0, value)).toFixed(2));
}

export function deriveAggregateReadinessState(states: readonly ReadinessState[]): ReadinessState {
  if (states.includes("blocked")) return "blocked";
  if (states.includes("not_ready")) return "not_ready";
  if (states.includes("in_progress")) return "in_progress";
  return "ready";
}

export function deriveAggregateConfidence(items: readonly { confidence: number; state?: ReadinessState }[]): number {
  if (items.length === 0) return 0;
  const average = items.reduce((sum, item) => sum + clampReadinessConfidence(item.confidence), 0) / items.length;
  const blockedPenalty = items.some((item) => item.state === "blocked") ? 0.18 : 0;
  const notReadyPenalty = items.some((item) => item.state === "not_ready") ? 0.08 : 0;
  return clampReadinessConfidence(average - blockedPenalty - notReadyPenalty);
}

function defaultReadinessSignal(dimension: ReadinessDimension): ReadinessSignal {
  return {
    id: dimension,
    label: DIMENSION_LABELS[dimension],
    state: "not_ready",
    confidence: 0.35,
    validationStatus: "unvalidated",
    notes: Object.freeze(["Readiness evidence has not been supplied yet."]),
    blockers: Object.freeze([]),
  };
}

function normalizeValidationStatus(
  status: ReadinessValidationStatus | undefined,
  state: ReadinessState
): ReadinessValidationStatus {
  if (state === "blocked") return "blocked";
  return status ?? "unvalidated";
}

function normalizeSignal(dimension: ReadinessDimension, override?: Partial<ReadinessSignal>): ReadinessSignal {
  const base = defaultReadinessSignal(dimension);
  const state = override?.state ?? base.state;
  return {
    ...base,
    ...override,
    id: dimension,
    label: override?.label ?? base.label,
    state,
    confidence: clampReadinessConfidence(override?.confidence ?? base.confidence),
    validationStatus: normalizeValidationStatus(override?.validationStatus, state),
    notes: Object.freeze([...(override?.notes ?? base.notes)]),
    blockers: Object.freeze([...(override?.blockers ?? base.blockers)]),
  };
}

export function buildReadinessDomainModel(
  overrides: RuntimeReadinessInput["dimensions"] = {}
): ReadinessDomainModel {
  const dimensions = {} as Record<ReadinessDimension, ReadinessSignal>;
  for (const dimension of READINESS_DIMENSIONS) {
    dimensions[dimension] = normalizeSignal(dimension, overrides[dimension]);
  }
  const values = READINESS_DIMENSIONS.map((dimension) => dimensions[dimension]);
  return {
    dimensions: Object.freeze(dimensions),
    aggregateState: deriveAggregateReadinessState(values.map((value) => value.state)),
    confidence: deriveAggregateConfidence(values),
  };
}

function defaultFeatureEntry(featureId: FeatureReadinessId): FeatureReadinessEntry {
  return {
    featureId,
    label: FEATURE_LABELS[featureId],
    readinessState: "not_ready",
    confidence: 0.35,
    validationStatus: "unvalidated",
    notes: Object.freeze(["Feature readiness evidence has not been supplied yet."]),
    blockers: Object.freeze([]),
  };
}

function normalizeFeature(
  featureId: FeatureReadinessId,
  override?: Partial<FeatureReadinessEntry>
): FeatureReadinessEntry {
  const base = defaultFeatureEntry(featureId);
  const readinessState = override?.readinessState ?? base.readinessState;
  return {
    ...base,
    ...override,
    featureId,
    label: override?.label ?? base.label,
    readinessState,
    confidence: clampReadinessConfidence(override?.confidence ?? base.confidence),
    validationStatus: normalizeValidationStatus(override?.validationStatus, readinessState),
    notes: Object.freeze([...(override?.notes ?? base.notes)]),
    blockers: Object.freeze([...(override?.blockers ?? base.blockers)]),
  };
}

export function buildFeatureReadinessRegistry(
  overrides: RuntimeReadinessInput["features"] = {}
): FeatureReadinessRegistry {
  const features = {} as Record<FeatureReadinessId, FeatureReadinessEntry>;
  for (const featureId of FEATURE_READINESS_IDS) {
    features[featureId] = normalizeFeature(featureId, overrides[featureId]);
  }
  const values = FEATURE_READINESS_IDS.map((featureId) => features[featureId]);
  return {
    features: Object.freeze(features),
    aggregateState: deriveAggregateReadinessState(values.map((value) => value.readinessState)),
    confidence: deriveAggregateConfidence(values.map((value) => ({ confidence: value.confidence, state: value.readinessState }))),
  };
}

function deriveRuntimeHealthStatus(checks: readonly RuntimeHealthCheck[]): RuntimeHealthLevel {
  if (checks.length === 0) return "warning";
  return checks.reduce<RuntimeHealthLevel>((worst, check) =>
    HEALTH_RANK[check.health] < HEALTH_RANK[worst] ? check.health : worst, "healthy");
}

export function buildRuntimeHealthSummary(params: {
  checks?: readonly RuntimeHealthCheck[];
  generatedAt: number;
}): RuntimeHealthSummary {
  const checks = [...(params.checks ?? [])].sort((a, b) => a.id.localeCompare(b.id));
  const status = deriveRuntimeHealthStatus(checks);
  const warnings = checks
    .filter((check) => check.health === "warning" || check.health === "degraded")
    .map((check) => check.summary);
  const blockers = checks.filter((check) => check.health === "critical").map((check) => check.summary);
  const confidence = checks.length === 0
    ? 0.4
    : clampReadinessConfidence(
        checks.reduce((sum, check) => sum + HEALTH_RANK[check.health] / 3, 0) / checks.length
      );

  const signature = stableSignature([
    "d10-runtime-health-summary",
    status,
    checks.map((check) => [check.id, check.health, check.summary]),
  ]);

  return {
    status,
    confidence,
    checks: Object.freeze(checks),
    warnings: Object.freeze(warnings),
    blockers: Object.freeze(blockers),
    generatedAt: params.generatedAt,
    signature,
  };
}

export function buildRuntimeReadinessRegistry(input: RuntimeReadinessInput = {}): RuntimeReadinessRegistry {
  const organizationId = input.organizationId?.trim() || "nexora-default";
  const generatedAt = input.now ?? Date.now();
  const platform = buildReadinessDomainModel(input.dimensions);
  const features = buildFeatureReadinessRegistry(input.features);
  const runtimeHealth = buildRuntimeHealthSummary({
    checks: input.runtimeChecks,
    generatedAt,
  });
  const registryId = stableSignature(["d10-runtime-readiness-registry", organizationId]).slice(0, 56);
  const signature = stableSignature([
    "d10-runtime-readiness-registry",
    organizationId,
    platform.aggregateState,
    platform.confidence,
    runtimeHealth.signature,
    features.aggregateState,
    features.confidence,
  ]);

  return {
    registryId,
    organizationId,
    generatedAt,
    platform,
    runtimeHealth,
    features,
    signature,
  };
}
