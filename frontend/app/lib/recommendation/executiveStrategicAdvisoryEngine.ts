/**
 * D7:5:8 — Executive strategic advisory engine (immutable, non-decisional).
 */

import type {
  EvaluateExecutiveAdvisoryInput,
  EvaluateExecutiveAdvisoryResult,
  ExecutiveStrategicAdvisorySnapshot,
  ExecutiveStrategicAdvisoryState,
  StrategicAdvisoryPanelContract,
} from "./executiveStrategicAdvisoryTypes.ts";
import {
  ADVISORY_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_AUTHORITY_DISCLAIMER,
  buildAdvisoryContentFingerprint,
  guardEvaluateExecutiveAdvisory,
  guardAdvisoryExecutiveSemantics,
} from "./advisoryGuards.ts";
import {
  analyzeExecutiveGuidanceSynthesis,
  calculateActionabilityScore,
  calculateAdvisoryClarityScore,
  calculateStrategicCoherenceScore,
  classifyExecutiveAdvisoryLabel,
  deriveExecutiveStrategicAdvisories,
  identifyExecutivePriorityZones,
  identifyStrategicAdvisoryZones,
} from "./executiveGuidanceSynthesisModel.ts";
import { analyzeStrategicContextGeneration } from "./strategicContextGenerationAnalysis.ts";
import { analyzeExecutiveAdvisoryIntelligence } from "./executiveAdvisoryIntelligence.ts";
import { buildExecutiveStrategicAdvisorySemantics } from "./executiveStrategicAdvisorySemantics.ts";
import { logExecutiveStrategicAdvisoryDev } from "./advisoryDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function advisoryBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildStrategicAdvisoryPanelContract(input: {
  snapshot: ExecutiveStrategicAdvisorySnapshot;
}): StrategicAdvisoryPanelContract {
  const viewHint =
    input.snapshot.state.strategicContextRecords.length > 3
      ? "future_readiness_panel"
      : input.snapshot.state.executiveGuidanceSynthesisRecords.length > 3
        ? "executive_guidance_dashboard"
        : input.snapshot.state.executiveAdvisoryLabel === "critical"
          ? "strategic_priority_heatmap"
          : input.snapshot.state.executiveAdvisoryLabel === "preventive"
            ? "advisory_timeline"
            : input.snapshot.state.activeAdvisories.length > 3
              ? "advisory_overlay"
              : "advisory_overlay";

  return Object.freeze({
    advisoryStateId: input.snapshot.advisoryStateId,
    topologyId: input.snapshot.topologyId,
    advisoryClarityScore: input.snapshot.state.advisoryClarityScore,
    executiveAdvisoryLabel: input.snapshot.state.executiveAdvisoryLabel,
    advisoryAmbiguityDisclaimer: input.snapshot.state.advisoryAmbiguityDisclaimer,
    nonAutonomousAuthorityDisclaimer: input.snapshot.state.nonAutonomousAuthorityDisclaimer,
    advisories: Object.freeze(
      input.snapshot.state.activeAdvisories.map((a) =>
        Object.freeze({
          advisoryId: a.advisoryId,
          advisoryState: a.advisoryState,
          advisoryStrength: a.advisoryStrength,
        })
      )
    ),
    guidanceSummaries: Object.freeze(
      input.snapshot.state.executiveGuidanceSynthesisRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate executive strategic advisory (read-only; never autonomously makes executive decisions).
 */
export function evaluateExecutiveAdvisory(
  input: EvaluateExecutiveAdvisoryInput
): EvaluateExecutiveAdvisoryResult {
  const topology = input.topology;
  const tick = Math.floor(Number(input.tick ?? input.advisoryContext?.tick) || 0);
  const advisoryStateId = String(
    input.advisoryStateId ?? `executive-advisory::${topology.topologyId}::${tick}`
  ).trim();

  const advisoryLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.advisoryContext?.advisoryLeverageFactor ?? 0)
  );
  const priorityStressFactor = clamp01Stress(input.advisoryContext?.priorityStressFactor ?? 0);

  logExecutiveStrategicAdvisoryDev("Advisory", {
    advisoryStateId,
    topologyId: topology.topologyId,
    tick,
    explainabilityLabel: input.explainabilityState.executiveExplainabilityLabel,
    governanceLabel: input.governanceState.executiveGovernanceLabel,
  });

  const activeAdvisories = deriveExecutiveStrategicAdvisories({
    recommendationState: input.recommendationState,
    confidenceState: input.confidenceState,
    explainabilityState: input.explainabilityState,
    governanceState: input.governanceState,
    memoryState: input.memoryState,
    comparisonState: input.comparisonState,
    cascadeState: input.cascadeState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    advisoryLeverageFactor,
    priorityStressFactor,
  });

  const executiveGuidanceSynthesisRecords = analyzeExecutiveGuidanceSynthesis({
    advisories: activeAdvisories,
    recommendationState: input.recommendationState,
    explainabilityState: input.explainabilityState,
    governanceState: input.governanceState,
    comparisonState: input.comparisonState,
    adaptationState: input.adaptationState,
    recoveryOpportunityState: input.recoveryOpportunityState,
    preventionState: input.preventionState,
    cascadeState: input.cascadeState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
  });

  const advisoryClarityScore = calculateAdvisoryClarityScore({
    advisories: activeAdvisories,
    explainabilityState: input.explainabilityState,
    confidenceState: input.confidenceState,
  });

  const strategicCoherenceScore = calculateStrategicCoherenceScore({
    advisories: activeAdvisories,
    comparisonState: input.comparisonState,
    governanceState: input.governanceState,
  });

  const actionabilityScore = calculateActionabilityScore({
    advisories: activeAdvisories,
    recommendationState: input.recommendationState,
    memoryState: input.memoryState,
  });

  const strategicContextRecords = analyzeStrategicContextGeneration({
    advisories: activeAdvisories,
    governanceState: input.governanceState,
    comparisonState: input.comparisonState,
    confidenceState: input.confidenceState,
    recoveryOpportunityState: input.recoveryOpportunityState,
  });

  const executiveAdvisoryDomainRecords = analyzeExecutiveAdvisoryIntelligence({
    advisories: activeAdvisories,
    synthesisRecords: executiveGuidanceSynthesisRecords,
    contextRecords: strategicContextRecords,
    trajectoryState: input.trajectoryState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    divergenceState: input.divergenceState,
  });

  const explainabilityFingerprint = stableStringify({
    label: input.explainabilityState.executiveExplainabilityLabel,
    clarity: input.explainabilityState.explanationClarityScore,
  });
  const governanceFingerprint = stableStringify({
    label: input.governanceState.executiveGovernanceLabel,
    stability: input.governanceState.governanceStabilityScore,
  });
  const memoryFingerprint = stableStringify({
    label: input.memoryState.executiveLearningLabel,
    clarity: input.memoryState.learningStabilityScore,
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

  const pendingFingerprint = buildAdvisoryContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    explainabilityFingerprint,
    governanceFingerprint,
    memoryFingerprint,
    comparisonFingerprint,
    recommendationFingerprint,
    confidenceFingerprint,
    tick,
  });

  const guard = guardEvaluateExecutiveAdvisory({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    advisories: activeAdvisories,
    priorAdvisoryFingerprints: input.priorAdvisoryFingerprints,
    pendingFingerprint,
    advisoryClarityScore,
    actionabilityScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const executiveAdvisoryLabel = classifyExecutiveAdvisoryLabel({
    advisories: activeAdvisories,
    advisoryClarityScore,
    actionabilityScore,
  });

  const state: ExecutiveStrategicAdvisoryState = Object.freeze({
    activeAdvisories: Object.freeze(activeAdvisories),
    executiveGuidanceSynthesisRecords,
    strategicContextRecords,
    executiveAdvisoryDomainRecords,
    executivePriorityZones: identifyExecutivePriorityZones(activeAdvisories),
    strategicAdvisoryZones: identifyStrategicAdvisoryZones(activeAdvisories),
    advisoryClarityScore,
    strategicCoherenceScore,
    actionabilityScore,
    executiveAdvisoryLabel,
    advisoryAmbiguityDisclaimer: ADVISORY_AMBIGUITY_DISCLAIMER,
    nonAutonomousAuthorityDisclaimer: NON_AUTONOMOUS_AUTHORITY_DISCLAIMER,
  });

  const semantics = buildExecutiveStrategicAdvisorySemantics({ state });
  const semanticsGuard = guardAdvisoryExecutiveSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    advisoryStateId,
    executiveAdvisoryLabel,
    advisoryClarityScore,
    strategicCoherenceScore,
  });

  const snapshot: ExecutiveStrategicAdvisorySnapshot = Object.freeze({
    advisoryStateId,
    topologyId: topology.topologyId,
    explainabilityStateId: `decision-explainability::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      advisorySummaries: Object.freeze([...semantics.advisorySummaries]),
      guidanceSummaries: Object.freeze([...semantics.guidanceSummaries]),
      contextSummaries: Object.freeze([...semantics.contextSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: advisoryBuiltAt(tick),
  });

  const panelContract = buildStrategicAdvisoryPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezeExecutiveStrategicAdvisorySnapshot(
  snapshot: ExecutiveStrategicAdvisorySnapshot
): ExecutiveStrategicAdvisorySnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeAdvisories: Object.freeze(
        snapshot.state.activeAdvisories.map((a) => Object.freeze({ ...a }))
      ),
      executiveGuidanceSynthesisRecords: Object.freeze(
        snapshot.state.executiveGuidanceSynthesisRecords.map((r) => Object.freeze({ ...r }))
      ),
      strategicContextRecords: Object.freeze(
        snapshot.state.strategicContextRecords.map((r) => Object.freeze({ ...r }))
      ),
      executiveAdvisoryDomainRecords: Object.freeze(
        snapshot.state.executiveAdvisoryDomainRecords.map((r) => Object.freeze({ ...r }))
      ),
      executivePriorityZones: Object.freeze([...snapshot.state.executivePriorityZones]),
      strategicAdvisoryZones: Object.freeze([...snapshot.state.strategicAdvisoryZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
