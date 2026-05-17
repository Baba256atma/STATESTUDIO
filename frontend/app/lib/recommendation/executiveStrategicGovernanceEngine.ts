/**
 * D7:5:6 — Executive strategic governance engine (immutable, non-enforcing).
 */

import type {
  EvaluateStrategicGovernanceInput,
  EvaluateStrategicGovernanceResult,
  ExecutiveStrategicGovernanceSnapshot,
  ExecutiveStrategicGovernanceState,
  StrategicGovernancePanelContract,
} from "./strategicGovernanceTypes.ts";
import {
  GOVERNANCE_AMBIGUITY_DISCLAIMER,
  NON_ENFORCEMENT_DISCLAIMER,
  buildGovernanceContentFingerprint,
  guardEvaluateStrategicGovernance,
  guardGovernanceExecutiveSemantics,
} from "./strategicGovernanceGuards.ts";
import {
  analyzeGovernanceAlignment,
  calculateGovernanceStabilityScore,
  calculateOversightRequirementScore,
  calculateRecommendationSafetyScore,
  classifyExecutiveGovernanceLabel,
  deriveStrategicGovernanceSignals,
  identifyExecutiveOversightZones,
  identifyRestrictedRecommendationZones,
} from "./governanceAlignmentModel.ts";
import { analyzeRecommendationSafety } from "./recommendationSafetyAnalysis.ts";
import { analyzeExecutiveOversight } from "./executiveOversightIntelligence.ts";
import { buildExecutiveStrategicGovernanceSemantics } from "./executiveStrategicGovernanceSemantics.ts";
import { logStrategicGovernanceDev } from "./strategicGovernanceDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function governanceBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildStrategicGovernancePanelContract(input: {
  snapshot: ExecutiveStrategicGovernanceSnapshot;
}): StrategicGovernancePanelContract {
  const viewHint =
    input.snapshot.state.recommendationSafetyRecords.length > 3
      ? "recommendation_safety_heatmap"
      : input.snapshot.state.executiveOversightRecords.length > 3
        ? "executive_oversight_dashboard"
        : input.snapshot.state.executiveGovernanceLabel === "critical"
          ? "strategic_control_panel"
          : input.snapshot.state.executiveGovernanceLabel === "volatile"
            ? "governance_stability_timeline"
            : input.snapshot.state.activeGovernanceSignals.length > 3
              ? "governance_overlay"
              : "governance_overlay";

  return Object.freeze({
    governanceStateId: input.snapshot.governanceStateId,
    topologyId: input.snapshot.topologyId,
    governanceStabilityScore: input.snapshot.state.governanceStabilityScore,
    executiveGovernanceLabel: input.snapshot.state.executiveGovernanceLabel,
    governanceAmbiguityDisclaimer: input.snapshot.state.governanceAmbiguityDisclaimer,
    nonEnforcementDisclaimer: input.snapshot.state.nonEnforcementDisclaimer,
    governanceSignals: Object.freeze(
      input.snapshot.state.activeGovernanceSignals.map((g) =>
        Object.freeze({
          governanceId: g.governanceId,
          governanceState: g.governanceState,
          governanceStrength: g.governanceStrength,
        })
      )
    ),
    safetySummaries: Object.freeze(
      input.snapshot.state.recommendationSafetyRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate strategic governance (read-only; never autonomously enforces governance decisions).
 */
export function evaluateStrategicGovernance(
  input: EvaluateStrategicGovernanceInput
): EvaluateStrategicGovernanceResult {
  const topology = input.topology;
  const tick = Math.floor(Number(input.tick ?? input.governanceContext?.tick) || 0);
  const governanceStateId = String(
    input.governanceStateId ?? `strategic-governance::${topology.topologyId}::${tick}`
  ).trim();

  const governanceLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.governanceContext?.governanceLeverageFactor ?? 0)
  );
  const oversightStressFactor = clamp01Stress(
    input.governanceContext?.oversightStressFactor ?? 0
  );

  logStrategicGovernanceDev("Governance", {
    governanceStateId,
    topologyId: topology.topologyId,
    tick,
    memoryLabel: input.memoryState.executiveLearningLabel,
    recommendationLabel: input.recommendationState.strategicRecommendationLabel,
  });

  const activeGovernanceSignals = deriveStrategicGovernanceSignals({
    recommendationState: input.recommendationState,
    confidenceState: input.confidenceState,
    memoryState: input.memoryState,
    comparisonState: input.comparisonState,
    adaptationState: input.adaptationState,
    preventionState: input.preventionState,
    resilienceState: input.resilienceState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    governanceLeverageFactor,
    oversightStressFactor,
  });

  const governanceAlignmentRecords = analyzeGovernanceAlignment({
    governanceSignals: activeGovernanceSignals,
    recommendationState: input.recommendationState,
    confidenceState: input.confidenceState,
    memoryState: input.memoryState,
    comparisonState: input.comparisonState,
    adaptationState: input.adaptationState,
    preventionState: input.preventionState,
    resilienceState: input.resilienceState,
  });

  const governanceStabilityScore = calculateGovernanceStabilityScore({
    governanceSignals: activeGovernanceSignals,
    confidenceState: input.confidenceState,
    memoryState: input.memoryState,
  });

  const recommendationSafetyScore = calculateRecommendationSafetyScore({
    governanceSignals: activeGovernanceSignals,
    recommendationState: input.recommendationState,
    comparisonState: input.comparisonState,
  });

  const oversightRequirementScore = calculateOversightRequirementScore({
    governanceSignals: activeGovernanceSignals,
    divergenceState: input.divergenceState,
    confidenceState: input.confidenceState,
  });

  const recommendationSafetyRecords = analyzeRecommendationSafety({
    governanceSignals: activeGovernanceSignals,
    comparisonState: input.comparisonState,
    memoryState: input.memoryState,
    confidenceState: input.confidenceState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    cascadeState: input.cascadeState,
  });

  const executiveOversightRecords = analyzeExecutiveOversight({
    governanceSignals: activeGovernanceSignals,
    alignmentRecords: governanceAlignmentRecords,
    safetyRecords: recommendationSafetyRecords,
    trajectoryState: input.trajectoryState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    divergenceState: input.divergenceState,
  });

  const memoryFingerprint = stableStringify({
    label: input.memoryState.executiveLearningLabel,
    stability: input.memoryState.learningStabilityScore,
  });
  const comparisonFingerprint = stableStringify({
    label: input.comparisonState.executiveComparisonLabel,
    stability: input.comparisonState.comparisonStabilityScore,
  });
  const recommendationFingerprint = stableStringify({
    label: input.recommendationState.strategicRecommendationLabel,
    count: input.recommendationState.activeRecommendations.length,
  });
  const confidenceFingerprint = stableStringify({
    label: input.confidenceState.recommendationConfidenceLabel,
    overall: input.confidenceState.overallConfidenceScore,
  });

  const pendingFingerprint = buildGovernanceContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    memoryFingerprint,
    comparisonFingerprint,
    recommendationFingerprint,
    confidenceFingerprint,
    tick,
  });

  const guard = guardEvaluateStrategicGovernance({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    governanceSignals: activeGovernanceSignals,
    priorGovernanceFingerprints: input.priorGovernanceFingerprints,
    pendingFingerprint,
    governanceStabilityScore,
    oversightRequirementScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const executiveGovernanceLabel = classifyExecutiveGovernanceLabel({
    governanceStabilityScore,
    recommendationSafetyScore,
    oversightRequirementScore,
  });

  const state: ExecutiveStrategicGovernanceState = Object.freeze({
    activeGovernanceSignals: Object.freeze(activeGovernanceSignals),
    governanceAlignmentRecords,
    recommendationSafetyRecords,
    executiveOversightRecords,
    restrictedRecommendationZones: identifyRestrictedRecommendationZones(activeGovernanceSignals),
    executiveOversightZones: identifyExecutiveOversightZones(activeGovernanceSignals),
    governanceStabilityScore,
    recommendationSafetyScore,
    oversightRequirementScore,
    executiveGovernanceLabel,
    governanceAmbiguityDisclaimer: GOVERNANCE_AMBIGUITY_DISCLAIMER,
    nonEnforcementDisclaimer: NON_ENFORCEMENT_DISCLAIMER,
  });

  const semantics = buildExecutiveStrategicGovernanceSemantics({ state });
  const semanticsGuard = guardGovernanceExecutiveSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    governanceStateId,
    executiveGovernanceLabel,
    governanceStabilityScore,
    oversightRequirementScore,
  });

  const snapshot: ExecutiveStrategicGovernanceSnapshot = Object.freeze({
    governanceStateId,
    topologyId: topology.topologyId,
    memoryStateId: `recommendation-memory::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      governanceSummaries: Object.freeze([...semantics.governanceSummaries]),
      alignmentSummaries: Object.freeze([...semantics.alignmentSummaries]),
      safetySummaries: Object.freeze([...semantics.safetySummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: governanceBuiltAt(tick),
  });

  const panelContract = buildStrategicGovernancePanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezeExecutiveStrategicGovernanceSnapshot(
  snapshot: ExecutiveStrategicGovernanceSnapshot
): ExecutiveStrategicGovernanceSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeGovernanceSignals: Object.freeze(
        snapshot.state.activeGovernanceSignals.map((g) => Object.freeze({ ...g }))
      ),
      governanceAlignmentRecords: Object.freeze(
        snapshot.state.governanceAlignmentRecords.map((r) => Object.freeze({ ...r }))
      ),
      recommendationSafetyRecords: Object.freeze(
        snapshot.state.recommendationSafetyRecords.map((r) => Object.freeze({ ...r }))
      ),
      executiveOversightRecords: Object.freeze(
        snapshot.state.executiveOversightRecords.map((r) => Object.freeze({ ...r }))
      ),
      restrictedRecommendationZones: Object.freeze([
        ...snapshot.state.restrictedRecommendationZones,
      ]),
      executiveOversightZones: Object.freeze([...snapshot.state.executiveOversightZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
