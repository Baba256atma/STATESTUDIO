import { stableSignature } from "../intelligence/shared/dedupe";
import { getAdaptationRecoveryStore } from "./adaptationRecoveryStore";
import { getDecisionOutcomeStore } from "./decisionOutcomeStore";
import { getInstitutionalContinuityStore } from "./institutionalContinuityStore";
import { getInstitutionalDistillationStore } from "./institutionalDistillationStore";
import { getInstitutionalCorrelationStore } from "./institutionalCorrelationStore";
import { getInstitutionalMaturityStore } from "./institutionalMaturityStore";
import { getInstitutionalMemoryStore } from "./institutionalMemoryStore";
import { getInstitutionalRecallStore } from "./institutionalRecallStore";
import {
  beginInstitutionalGovernanceEvaluation,
  endInstitutionalGovernanceEvaluation,
  INSTITUTIONAL_GOVERNANCE_AMPLIFICATION_THRESHOLD,
  INSTITUTIONAL_GOVERNANCE_MAX_LAYER_DEPTH,
  integrityRank,
  shouldAllowIntegrityPromotion,
  shouldEvaluateInstitutionalGovernance,
  shouldRetainGovernanceSnapshot,
  statusSeverity,
} from "./institutionalGovernanceGuards";
import { getInstitutionalGovernanceStore } from "./institutionalGovernanceStore";
import type {
  CognitiveGovernanceStatus,
  CognitiveIntegritySignal,
  InstitutionalConsistencyObservation,
  InstitutionalLearningGovernanceAggregateSnapshot,
  InstitutionalLearningGovernanceInput,
  InstitutionalLearningGovernanceSnapshot,
  IntegrityLevel,
  OrganizationalLearningHealth,
  StrategicTrustValidation,
  TrustCategory,
} from "./institutionalGovernanceTypes";

const DEV_LOG_PREFIX = "[Nexora][CognitiveGovernance]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function buildSnapshotId(observations: string[]): string {
  return stableSignature(["governance-snapshot", ...observations.sort().slice(0, 4)]).slice(0, 56);
}

function createGovernanceSnapshot(params: {
  governanceStatus: CognitiveGovernanceStatus;
  integrityLevel: IntegrityLevel;
  summary: string;
  observations: string[];
  confidence: number;
  now: number;
}): InstitutionalLearningGovernanceSnapshot {
  const observations = Object.freeze(params.observations.slice(0, 6));
  return {
    governanceSnapshotId: buildSnapshotId([...observations]),
    governanceStatus: params.governanceStatus,
    integrityLevel: params.integrityLevel,
    summary: params.summary,
    observations,
    confidence: Number(Math.min(0.95, Math.max(0.45, params.confidence)).toFixed(2)),
    generatedAt: params.now,
    lastEvaluatedAt: params.now,
    occurrenceCount: 1,
  };
}

type LayerMetrics = {
  layerDepth: number;
  lowConfidenceCount: number;
  avgConfidence: number;
  hasContradiction: boolean;
  hasAmplification: boolean;
  hasResilienceGrowth: boolean;
  hasStableCorrelations: boolean;
  hasRegressingMaturity: boolean;
  hasImprovingMaturity: boolean;
  hasFoundationalWisdom: boolean;
  priorStatus: CognitiveGovernanceStatus | null;
  continuityPreserved: boolean;
};

function computeLayerMetrics(
  memoryState: ReturnType<ReturnType<typeof getInstitutionalMemoryStore>["getState"]>,
  correlationState: ReturnType<ReturnType<typeof getInstitutionalCorrelationStore>["getState"]>,
  adaptationState: ReturnType<ReturnType<typeof getAdaptationRecoveryStore>["getState"]>,
  outcomeState: ReturnType<ReturnType<typeof getDecisionOutcomeStore>["getState"]>,
  distillationState: ReturnType<ReturnType<typeof getInstitutionalDistillationStore>["getState"]>,
  recallState: ReturnType<ReturnType<typeof getInstitutionalRecallStore>["getState"]>,
  maturityState: ReturnType<ReturnType<typeof getInstitutionalMaturityStore>["getState"]>,
  continuityState: ReturnType<ReturnType<typeof getInstitutionalContinuityStore>["getState"]>,
  priorStatus: CognitiveGovernanceStatus | null,
  continuityPreserved: boolean
): LayerMetrics {
  const layerDepth =
    memoryState.records.length +
    correlationState.correlations.length +
    adaptationState.adaptations.length +
    outcomeState.decisions.length +
    distillationState.insights.length +
    recallState.recalls.length +
    maturityState.snapshots.length +
    continuityState.artifacts.length;

  const severityConfidence = (severity: string): number => {
    if (severity === "critical") return 0.88;
    if (severity === "high") return 0.82;
    if (severity === "medium") return 0.74;
    return 0.68;
  };
  const strengthConfidence = (strength: string): number => {
    if (strength === "weak") return 0.58;
    if (strength === "moderate") return 0.72;
    if (strength === "strong") return 0.86;
    if (strength === "systemic") return 0.9;
    return 0.7;
  };

  const confidenceValues = [
    ...memoryState.records.map((r) => severityConfidence(r.severity)),
    ...correlationState.correlations.map((c) => strengthConfidence(c.strength)),
    ...adaptationState.adaptations.map((a) => a.confidence),
    ...outcomeState.decisions.map((d) => d.confidence),
    ...distillationState.insights.map((i) => i.confidence),
    ...recallState.recalls.map((r) => r.confidence),
    ...maturityState.snapshots.map((s) => s.confidence),
    ...continuityState.artifacts.map((a) => a.confidence),
  ];

  const lowConfidenceCount = confidenceValues.filter((c) => c < 0.65).length;
  const avgConfidence =
    confidenceValues.length > 0
      ? confidenceValues.reduce((sum, c) => sum + c, 0) / confidenceValues.length
      : 0.5;

  const correlationCategories = correlationState.correlations.map((c) => c.category);
  const adaptationTypes = adaptationState.adaptations.map((a) => a.adaptationType);
  const maturityTrends = maturityState.snapshots.map((s) => s.evolutionTrend);

  const hasContradiction =
    (correlationCategories.includes("systemic_instability") &&
      maturityState.snapshots.some((s) => s.maturityLevel === "reactive")) ||
    (correlationCategories.includes("escalation_chain") &&
      correlationCategories.includes("governance_pressure") &&
      !adaptationTypes.includes("governance_stabilization"));

  const duplicateMemoryRatio =
    memoryState.records.length > 0
      ? memoryState.records.filter((r) => r.recurrenceCount > 2).length /
        memoryState.records.length
      : 0;

  const hasAmplification =
    layerDepth > INSTITUTIONAL_GOVERNANCE_AMPLIFICATION_THRESHOLD ||
    duplicateMemoryRatio > 0.5 ||
    layerDepth > INSTITUTIONAL_GOVERNANCE_MAX_LAYER_DEPTH;

  const hasResilienceGrowth =
    correlationCategories.includes("resilience_growth") ||
    adaptationTypes.includes("resilience_growth");

  const hasStableCorrelations =
    correlationState.correlations.length >= 2 &&
    (!correlationCategories.includes("systemic_instability") ||
      adaptationTypes.includes("governance_stabilization"));

  const hasRegressingMaturity = maturityTrends.includes("regressing");
  const hasImprovingMaturity =
    maturityTrends.includes("improving") || maturityTrends.includes("accelerating");

  const hasFoundationalWisdom = continuityState.artifacts.some(
    (a) => a.continuityLevel === "foundational" || a.continuityLevel === "institutionalized"
  );

  return {
    layerDepth,
    lowConfidenceCount,
    avgConfidence,
    hasContradiction,
    hasAmplification,
    hasResilienceGrowth,
    hasStableCorrelations,
    hasRegressingMaturity,
    hasImprovingMaturity,
    hasFoundationalWisdom,
    priorStatus,
    continuityPreserved,
  };
}

function resolveGovernanceStatus(metrics: LayerMetrics): CognitiveGovernanceStatus {
  if (metrics.hasContradiction && metrics.lowConfidenceCount >= 3) return "unstable";
  if (metrics.hasAmplification && metrics.lowConfidenceCount >= 2) return "degraded";
  if (metrics.hasRegressingMaturity && !metrics.hasImprovingMaturity) return "degraded";
  if (metrics.lowConfidenceCount >= 4) return "degraded";
  if (metrics.hasContradiction || metrics.hasAmplification) return "monitored";
  if (
    metrics.priorStatus === "degraded" ||
    metrics.priorStatus === "unstable" ||
    metrics.priorStatus === "monitored"
  ) {
    if (metrics.hasImprovingMaturity && metrics.hasStableCorrelations) return "recovering";
    return "monitored";
  }
  if (metrics.hasResilienceGrowth && metrics.hasStableCorrelations && metrics.continuityPreserved) {
    return "stable";
  }
  return metrics.layerDepth >= 5 ? "stable" : "monitored";
}

function resolveIntegrityLevel(
  metrics: LayerMetrics,
  governanceStatus: CognitiveGovernanceStatus
): IntegrityLevel {
  if (governanceStatus === "unstable") return "weak";
  if (governanceStatus === "degraded") return "moderate";
  if (
    governanceStatus === "stable" &&
    metrics.hasFoundationalWisdom &&
    metrics.avgConfidence >= 0.8 &&
    metrics.hasResilienceGrowth &&
    shouldAllowIntegrityPromotion("verified", metrics.layerDepth)
  ) {
    return "verified";
  }
  if (
    (governanceStatus === "stable" || governanceStatus === "recovering") &&
    metrics.hasResilienceGrowth &&
    metrics.hasStableCorrelations &&
    shouldAllowIntegrityPromotion("strong", metrics.layerDepth)
  ) {
    return "strong";
  }
  if (governanceStatus === "monitored") return "moderate";
  return "moderate";
}

function inferGovernanceSnapshots(
  metrics: LayerMetrics,
  governanceStatus: CognitiveGovernanceStatus,
  integrityLevel: IntegrityLevel,
  now: number
): InstitutionalLearningGovernanceSnapshot[] {
  const candidates: InstitutionalLearningGovernanceSnapshot[] = [];

  if (governanceStatus === "stable" && integrityLevel === "strong") {
    candidates.push(
      createGovernanceSnapshot({
        governanceStatus: "stable",
        integrityLevel: "strong",
        summary:
          "Institutional learning remains operationally consistent with stable resilience correlations and coherent strategic memory patterns.",
        observations: [
          "stable_memory_consistency",
          "verified_resilience_patterns",
          "coherent_operational_learning",
        ],
        confidence: 0.92,
        now,
      })
    );
  }

  if (metrics.lowConfidenceCount >= 3) {
    candidates.push(
      createGovernanceSnapshot({
        governanceStatus: governanceStatus === "stable" ? "monitored" : "degraded",
        integrityLevel: "moderate",
        summary:
          "Repeated low-confidence learning patterns detected — institutional trust integrity requires monitored validation.",
        observations: ["low_confidence_patterns", "degraded_trust_integrity", "validation_required"],
        confidence: 0.78,
        now,
      })
    );
  }

  if (metrics.hasResilienceGrowth && (metrics.hasStableCorrelations || metrics.continuityPreserved)) {
    candidates.push(
      createGovernanceSnapshot({
        governanceStatus: metrics.hasContradiction ? "monitored" : "stable",
        integrityLevel: integrityLevel === "verified" ? "verified" : "strong",
        summary:
          "Stable recurring resilience correlations indicate strong institutional reliability across organizational learning layers.",
        observations: ["resilience_correlation_stability", "strong_institutional_reliability"],
        confidence: 0.88,
        now,
      })
    );
  }

  if (metrics.hasContradiction) {
    candidates.push(
      createGovernanceSnapshot({
        governanceStatus: "monitored",
        integrityLevel: "moderate",
        summary:
          "Contradictory operational learning detected — governance inconsistency observation requires executive review.",
        observations: [
          "contradictory_learning",
          "governance_inconsistency",
          "operational_coherence_gap",
        ],
        confidence: 0.81,
        now,
      })
    );
  }

  if (metrics.hasAmplification) {
    candidates.push(
      createGovernanceSnapshot({
        governanceStatus: "degraded",
        integrityLevel: "weak",
        summary:
          "Excessive institutional layer depth or duplicate memory growth indicates memory amplification warning — bounded stores remain active.",
        observations: ["memory_amplification_warning", "layer_depth_elevated", "bounded_retention"],
        confidence: 0.84,
        now,
      })
    );
  }

  if (
    integrityLevel === "verified" &&
    metrics.hasFoundationalWisdom &&
    metrics.avgConfidence >= 0.8
  ) {
    candidates.push(
      createGovernanceSnapshot({
        governanceStatus: "stable",
        integrityLevel: "verified",
        summary:
          "Stable strategic learning consistency across distillation, continuity, and maturity layers — verified institutional cognitive integrity.",
        observations: [
          "verified_strategic_consistency",
          "foundational_wisdom_aligned",
          "coherent_organizational_memory",
        ],
        confidence: 0.9,
        now,
      })
    );
  }

  if (metrics.hasRegressingMaturity && !metrics.hasImprovingMaturity) {
    candidates.push(
      createGovernanceSnapshot({
        governanceStatus: "degraded",
        integrityLevel: "weak",
        summary:
          "Unstable oscillating organizational maturity conclusions indicate degraded cognition stability.",
        observations: ["maturity_regression", "cognition_stability_degraded", "learning_drift"],
        confidence: 0.8,
        now,
      })
    );
  }

  if (governanceStatus === "recovering" && metrics.hasImprovingMaturity) {
    candidates.push(
      createGovernanceSnapshot({
        governanceStatus: "recovering",
        integrityLevel: "moderate",
        summary:
          "Institutional learning integrity recovering — improving maturity trends and stable correlations observed.",
        observations: ["integrity_recovery", "improving_maturity_trend", "stabilizing_correlations"],
        confidence: 0.83,
        now,
      })
    );
  }

  if (candidates.length === 0 && metrics.layerDepth >= 5) {
    candidates.push(
      createGovernanceSnapshot({
        governanceStatus,
        integrityLevel,
        summary: "Institutional learning governance evaluation complete — baseline cognitive integrity established.",
        observations: ["baseline_governance_eval", "layer_depth_sufficient"],
        confidence: Number(metrics.avgConfidence.toFixed(2)),
        now,
      })
    );
  }

  return candidates.filter((c) => shouldRetainGovernanceSnapshot(c));
}

function buildIntegritySignals(
  snapshots: readonly InstitutionalLearningGovernanceSnapshot[],
  metrics: LayerMetrics,
  now: number
): CognitiveIntegritySignal[] {
  const signals: CognitiveIntegritySignal[] = [];

  for (const s of snapshots.slice(0, 4)) {
    let category: TrustCategory = "operational_coherence";
    if (s.observations.some((o) => o.includes("memory"))) category = "memory_consistency";
    if (s.observations.some((o) => o.includes("resilience"))) category = "resilience_integrity";
    if (s.observations.some((o) => o.includes("governance"))) category = "governance_stability";
    if (s.observations.some((o) => o.includes("strategic"))) category = "strategic_reliability";
    if (s.observations.some((o) => o.includes("correlation"))) category = "correlation_validity";

    let signalType: CognitiveIntegritySignal["signalType"] = "validation";
    if (s.governanceStatus === "recovering") signalType = "recovery";
    if (s.integrityLevel === "verified") signalType = "verified";
    if (s.governanceStatus === "degraded" || s.governanceStatus === "unstable") {
      signalType = "warning";
    }

    signals.push({
      signalId: stableSignature(["integrity-signal", s.governanceSnapshotId]).slice(0, 48),
      category,
      integrityLevel: s.integrityLevel,
      signalType,
      summary: s.summary,
      confidence: s.confidence,
      generatedAt: now,
    });
  }

  if (metrics.hasAmplification) {
    signals.push({
      signalId: stableSignature(["integrity-warning-amplification", metrics.layerDepth]).slice(0, 48),
      category: "memory_consistency",
      integrityLevel: "weak",
      signalType: "warning",
      summary: "Memory amplification warning — institutional layer depth exceeds governance comfort threshold.",
      confidence: 0.85,
      generatedAt: now,
    });
  }

  return signals;
}

function buildTrustValidations(
  snapshots: readonly InstitutionalLearningGovernanceSnapshot[],
  now: number
): StrategicTrustValidation[] {
  return snapshots.slice(0, 6).map((s) => ({
    validationId: stableSignature(["trust-validation", s.governanceSnapshotId]).slice(0, 48),
    category:
      s.observations[0]?.includes("resilience")
        ? ("resilience_integrity" as TrustCategory)
        : ("strategic_reliability" as TrustCategory),
    trustLevel: s.integrityLevel,
    validationSummary: s.summary,
    linkedSnapshotIds: Object.freeze([s.governanceSnapshotId]),
    generatedAt: now,
  }));
}

function buildConsistencyObservations(
  metrics: LayerMetrics,
  now: number
): InstitutionalConsistencyObservation[] {
  const observations: InstitutionalConsistencyObservation[] = [];

  if (metrics.hasContradiction) {
    observations.push({
      observationId: stableSignature(["consistency-contradiction"]).slice(0, 48),
      category: "operational_coherence",
      observation: "Contradictory patterns across correlation and adaptation layers.",
      severity: "high",
      generatedAt: now,
    });
  }

  if (metrics.hasAmplification) {
    observations.push({
      observationId: stableSignature(["consistency-amplification"]).slice(0, 48),
      category: "memory_consistency",
      observation: "Institutional memory layer depth suggests amplification risk.",
      severity: "medium",
      generatedAt: now,
    });
  }

  if (metrics.lowConfidenceCount >= 3) {
    observations.push({
      observationId: stableSignature(["consistency-low-confidence"]).slice(0, 48),
      category: "strategic_reliability",
      observation: "Multiple low-confidence learning artifacts reduce strategic trust.",
      severity: "medium",
      generatedAt: now,
    });
  }

  if (metrics.hasResilienceGrowth && metrics.hasStableCorrelations) {
    observations.push({
      observationId: stableSignature(["consistency-resilience-stable"]).slice(0, 48),
      category: "resilience_integrity",
      observation: "Resilience correlations remain stable across evaluation cycles.",
      severity: "low",
      generatedAt: now,
    });
  }

  return observations;
}

function buildAggregateSnapshot(
  organizationId: string,
  storeState: ReturnType<ReturnType<typeof getInstitutionalGovernanceStore>["getState"]>,
  governanceStatus: CognitiveGovernanceStatus,
  integrityLevel: IntegrityLevel,
  now: number
): InstitutionalLearningGovernanceAggregateSnapshot {
  const summary =
    storeState.snapshots.length === 0
      ? "Institutional learning governance awaiting sufficient organizational depth."
      : `Governed institutional cognition: ${governanceStatus} status with ${integrityLevel} cognitive integrity.`;

  return {
    signature: storeState.signature,
    organizationId,
    generatedAt: now,
    governanceStatus,
    integrityLevel,
    governanceSummary: summary,
    snapshotCount: storeState.snapshots.length,
    trustValidationCount: storeState.trustValidations.length,
    dominantTrustCategories: Object.freeze(
      Array.from(new Set(storeState.integritySignals.map((s) => s.category))).slice(0, 4)
    ),
    recentGovernanceSnapshots: Object.freeze(storeState.snapshots.slice(0, 6)),
    integritySignals: Object.freeze(storeState.integritySignals.slice(0, 6)),
    trustValidations: Object.freeze(storeState.trustValidations.slice(0, 6)),
    learningHealth: storeState.learningHealth,
    consistencyObservations: Object.freeze(storeState.consistencyObservations.slice(0, 6)),
  };
}

export type InstitutionalLearningGovernanceResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: InstitutionalLearningGovernanceAggregateSnapshot | null;
  newSnapshots: number;
  storeSignature: string;
  statusTransition?: {
    from: CognitiveGovernanceStatus | null;
    to: CognitiveGovernanceStatus;
  };
};

export function evaluateInstitutionalLearningGovernance(
  input: InstitutionalLearningGovernanceInput
): InstitutionalLearningGovernanceResult {
  const organizationId = input.organizationId.trim() || "nexora-default";
  const now = input.now ?? Date.now();

  if (!beginInstitutionalGovernanceEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursive_governance_guard",
      snapshot: null,
      newSnapshots: 0,
      storeSignature: "",
    };
  }

  try {
    const memoryState = getInstitutionalMemoryStore(organizationId).getState();
    const correlationState = getInstitutionalCorrelationStore(organizationId).getState();
    const adaptationState = getAdaptationRecoveryStore(organizationId).getState();
    const outcomeState = getDecisionOutcomeStore(organizationId).getState();
    const distillationState = getInstitutionalDistillationStore(organizationId).getState();
    const recallState = getInstitutionalRecallStore(organizationId).getState();
    const maturityState = getInstitutionalMaturityStore(organizationId).getState();
    const continuityState = getInstitutionalContinuityStore(organizationId).getState();

    const layerDepth =
      memoryState.records.length +
      correlationState.correlations.length +
      adaptationState.adaptations.length +
      outcomeState.decisions.length +
      distillationState.insights.length +
      recallState.recalls.length +
      maturityState.snapshots.length +
      continuityState.artifacts.length;

    if (layerDepth < 5) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_institutional_depth",
        snapshot: null,
        newSnapshots: 0,
        storeSignature: "",
      };
    }

    const store = getInstitutionalGovernanceStore(organizationId);
    const prior = store.getState();

    const evaluationSignature = stableSignature([
      "d9-2-9-governance-eval",
      organizationId,
      memoryState.signature,
      correlationState.signature,
      adaptationState.signature,
      outcomeState.signature,
      distillationState.signature,
      recallState.signature,
      maturityState.signature,
      continuityState.signature,
      input.cognitionSnapshot?.signature ?? "no-cognition",
    ]);

    if (
      !shouldEvaluateInstitutionalGovernance(
        organizationId,
        evaluationSignature,
        prior.lastEvaluationSignature,
        now
      )
    ) {
      const status = prior.lastGovernanceStatus ?? "monitored";
      const integrity =
        prior.snapshots[0]?.integrityLevel ??
        ("moderate" as IntegrityLevel);
      return {
        evaluated: false,
        skipped: true,
        reason: "paced_or_unchanged",
        snapshot:
          prior.snapshots.length > 0
            ? buildAggregateSnapshot(organizationId, prior, status, integrity, now)
            : null,
        newSnapshots: 0,
        storeSignature: prior.signature,
      };
    }

    const metrics = computeLayerMetrics(
      memoryState,
      correlationState,
      adaptationState,
      outcomeState,
      distillationState,
      recallState,
      maturityState,
      continuityState,
      prior.lastGovernanceStatus,
      input.continuityPreserved ?? true
    );

    const governanceStatus = resolveGovernanceStatus(metrics);
    const integrityLevel = resolveIntegrityLevel(metrics, governanceStatus);
    const priorCount = prior.snapshots.length;

    const candidates = inferGovernanceSnapshots(metrics, governanceStatus, integrityLevel, now);

    if (candidates.length > 0) {
      store.upsertSnapshots(candidates, now);
    }

    const signals = buildIntegritySignals(store.getState().snapshots, metrics, now);
    if (signals.length > 0) {
      store.upsertIntegritySignals(signals, now);
    }

    const validations = buildTrustValidations(store.getState().snapshots, now);
    if (validations.length > 0) {
      store.upsertTrustValidations(validations, now);
    }

    const observations = buildConsistencyObservations(metrics, now);
    if (observations.length > 0) {
      store.upsertConsistencyObservations(observations, now);
    }

    const health: OrganizationalLearningHealth = {
      healthId: stableSignature(["learning-health", organizationId, governanceStatus]).slice(0, 48),
      governanceStatus,
      integrityLevel,
      healthSummary: `Organizational learning health: ${governanceStatus} / ${integrityLevel} across ${metrics.layerDepth} institutional layers.`,
      layerDepth: metrics.layerDepth,
      generatedAt: now,
    };
    store.setLearningHealth(health);

    store.setLastEvaluationSignature(evaluationSignature);
    store.setLastGovernanceStatus(governanceStatus);

    const finalState = store.getState();
    const newSnapshots = Math.max(0, finalState.snapshots.length - priorCount);

    const statusTransition =
      prior.lastGovernanceStatus && prior.lastGovernanceStatus !== governanceStatus
        ? { from: prior.lastGovernanceStatus, to: governanceStatus }
        : undefined;

    if (statusTransition && statusSeverity(governanceStatus) < statusSeverity(statusTransition.from)) {
      devLog(
        `governance degradation — ${statusTransition.from} → ${statusTransition.to}: ${finalState.snapshots[0]?.summary.slice(0, 72) ?? ""}`
      );
    }

    if (governanceStatus === "recovering" && newSnapshots > 0) {
      devLog(`integrity recovery — ${health.healthSummary.slice(0, 72)}`);
    }

    const verified = finalState.snapshots.find((s) => s.integrityLevel === "verified");
    if (verified && newSnapshots > 0) {
      devLog(`verified consistency — ${verified.summary.slice(0, 72)}`);
    }

    if (governanceStatus === "unstable" && newSnapshots > 0) {
      devLog(`unstable cognition — layer depth ${metrics.layerDepth}, contradictions detected`);
    }

    const snapshot = buildAggregateSnapshot(
      organizationId,
      finalState,
      governanceStatus,
      integrityLevel,
      now
    );

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newSnapshots,
      storeSignature: finalState.signature,
      statusTransition,
    };
  } finally {
    endInstitutionalGovernanceEvaluation();
  }
}
