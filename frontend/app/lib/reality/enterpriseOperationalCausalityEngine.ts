/**
 * D7:7:3 — Enterprise operational causality intelligence engine (immutable, evidence-grounded).
 */

import type {
  EvaluateOperationalCausalityInput,
  EvaluateOperationalCausalityResult,
  EnterpriseOperationalCausalitySnapshot,
  EnterpriseOperationalCausalityIntelligenceState,
  EnterpriseOperationalCausalityPanelContract,
} from "./enterpriseOperationalCausalityTypes.ts";
import {
  CAUSALITY_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_CAUSALITY_DISCLAIMER,
  buildCausalityContentFingerprint,
  guardEvaluateOperationalCausality,
  guardEnterpriseOperationalCausalitySemantics,
} from "./enterpriseOperationalCausalityGuards.ts";
import {
  analyzeRootCauses,
  calculateCausalityClarityScore,
  calculateRootCauseClarityScore,
  classifyExecutiveCausalityLabel,
  deriveEnterpriseOperationalCausalitySignals,
  identifyPropagationRiskZones,
  identifyRootCauseZones,
} from "./rootCauseModeling.ts";
import {
  analyzeCausalPropagation,
  calculateCausalPropagationScore,
} from "./causalPropagationAnalysis.ts";
import { analyzeEnterpriseOperationalConsequences } from "./enterpriseOperationalConsequenceIntelligence.ts";
import { buildEnterpriseOperationalCausalitySemantics } from "./enterpriseOperationalCausalitySemantics.ts";
import { logEnterpriseOperationalCausalityDev } from "./enterpriseOperationalCausalityDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function causalityBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildEnterpriseOperationalCausalityPanelContract(input: {
  snapshot: EnterpriseOperationalCausalitySnapshot;
}): EnterpriseOperationalCausalityPanelContract {
  const viewHint =
    input.snapshot.state.causalPropagationRecords.length > 3
      ? "propagation_heatmap"
      : input.snapshot.state.enterpriseConsequenceRecords.length > 4
        ? "operational_consequence_timeline"
        : input.snapshot.state.executiveCausalityLabel === "critical"
          ? "enterprise_causality_panel"
          : input.snapshot.state.rootCauseRecords.length > 4
            ? "root_cause_dashboard"
            : input.snapshot.state.activeCausalitySignals.length > 3
              ? "causality_overlay"
              : "causality_overlay";

  return Object.freeze({
    causalityStateId: input.snapshot.causalityStateId,
    topologyId: input.snapshot.topologyId,
    causalityClarityScore: input.snapshot.state.causalityClarityScore,
    executiveCausalityLabel: input.snapshot.state.executiveCausalityLabel,
    causalityAmbiguityDisclaimer: input.snapshot.state.causalityAmbiguityDisclaimer,
    nonAutonomousCausalityDisclaimer: input.snapshot.state.nonAutonomousCausalityDisclaimer,
    causalitySignals: Object.freeze(
      input.snapshot.state.activeCausalitySignals.map((s) =>
        Object.freeze({
          causalityId: s.causalityId,
          causalityState: s.causalityState,
          causalityStrength: s.causalityStrength,
        })
      )
    ),
    rootCauseSummaries: Object.freeze(
      input.snapshot.state.rootCauseRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate enterprise operational causality (read-only; never fabricates unsupported causal inference).
 */
export function evaluateOperationalCausality(
  input: EvaluateOperationalCausalityInput
): EvaluateOperationalCausalityResult {
  const topology = input.topology;
  const operational = input.operationalUniverseState;
  const tick = Math.floor(Number(input.tick ?? input.causalityContext?.tick) || 0);
  const causalityStateId = String(
    input.causalityStateId ?? `operational-causality::${topology.topologyId}::${tick}`
  ).trim();

  const causalityLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.causalityContext?.causalityLeverageFactor ?? 0)
  );
  const propagationStressFactor = clamp01Stress(
    input.causalityContext?.propagationStressFactor ?? 0
  );

  logEnterpriseOperationalCausalityDev("Causality", {
    causalityStateId,
    topologyId: topology.topologyId,
    tick,
    syncLabel: input.synchronizationState.executiveSynchronizationLabel,
    realityLabel: input.strategicRealityState.executiveRealityLabel,
  });

  const activeCausalitySignals = deriveEnterpriseOperationalCausalitySignals({
    synchronizationState: input.synchronizationState,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: operational,
    orchestrationState: input.orchestrationState,
    governanceState: input.governanceState,
    foresightState: input.foresightState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    cascadeState: input.cascadeState,
    causalityLeverageFactor,
    propagationStressFactor,
  });

  const rootCauseRecords = analyzeRootCauses({
    causalitySignals: activeCausalitySignals,
    synchronizationState: input.synchronizationState,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: operational,
    orchestrationState: input.orchestrationState,
    governanceState: input.governanceState,
    foresightState: input.foresightState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    cascadeState: input.cascadeState,
  });

  const causalityClarityScore = calculateCausalityClarityScore({
    causalitySignals: activeCausalitySignals,
    rootCauseRecords,
    synchronizationState: input.synchronizationState,
    strategicRealityState: input.strategicRealityState,
  });

  const rootCauseClarityScore = calculateRootCauseClarityScore({ rootCauseRecords });

  const causalPropagationRecords = analyzeCausalPropagation({
    causalitySignals: activeCausalitySignals,
    rootCauseRecords,
    synchronizationState: input.synchronizationState,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: operational,
    orchestrationState: input.orchestrationState,
    governanceState: input.governanceState,
    foresightState: input.foresightState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    cascadeState: input.cascadeState,
  });

  const causalPropagationScore = calculateCausalPropagationScore({
    causalitySignals: activeCausalitySignals,
    propagationRecords: causalPropagationRecords,
    cascadeState: input.cascadeState,
    synchronizationState: input.synchronizationState,
    strategicRealityState: input.strategicRealityState,
  });

  const enterpriseConsequenceRecords = analyzeEnterpriseOperationalConsequences({
    causalitySignals: activeCausalitySignals,
    rootCauseRecords,
    propagationRecords: causalPropagationRecords,
    trajectoryState: input.trajectoryState,
    momentumState: operational.momentumState,
    equilibriumState: operational.equilibriumState,
    divergenceState: input.divergenceState,
  });

  const syncFingerprint = stableStringify({
    label: input.synchronizationState.executiveSynchronizationLabel,
    coherence: input.synchronizationState.synchronizationCoherenceScore,
    drift: input.synchronizationState.operationalDriftScore,
  });
  const realityFingerprint = stableStringify({
    label: input.strategicRealityState.executiveRealityLabel,
    coherence: input.strategicRealityState.operationalRealityCoherenceScore,
    instability: input.strategicRealityState.realityInstabilityScore,
  });
  const orchestrationFingerprint = stableStringify({
    label: input.orchestrationState.executiveOrchestrationLabel,
    coherence: input.orchestrationState.orchestrationCoherenceScore,
  });
  const momentumFingerprint = stableStringify({
    momentum: operational.momentumState.organizationalMomentumScore,
    recovery: operational.momentumState.recoveryMomentumScore,
  });
  const equilibriumFingerprint = stableStringify({
    score: operational.equilibriumState.equilibriumScore,
  });
  const governanceFingerprint = stableStringify({
    label: input.governanceState.executiveGovernanceLabel,
    stability: input.governanceState.governanceStabilityScore,
  });
  const foresightFingerprint = stableStringify({
    label: input.foresightState.predictiveForesightLabel,
    preparedness: input.foresightState.strategicPreparednessScore,
  });
  const trajectoryFingerprint = stableStringify({
    stability: input.trajectoryState.futureStabilityScore,
    volatility: input.trajectoryState.trajectoryVolatilityScore,
  });
  const divergenceFingerprint = stableStringify({
    fragmentation: input.divergenceState.futureFragmentationScore,
  });

  const pendingFingerprint = buildCausalityContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    syncFingerprint,
    realityFingerprint,
    orchestrationFingerprint,
    momentumFingerprint,
    equilibriumFingerprint,
    governanceFingerprint,
    foresightFingerprint,
    trajectoryFingerprint,
    divergenceFingerprint,
    tick,
  });

  const guard = guardEvaluateOperationalCausality({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    causalitySignals: activeCausalitySignals,
    priorCausalityFingerprints: input.priorCausalityFingerprints,
    pendingFingerprint,
    causalityClarityScore,
    causalPropagationScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const executiveCausalityLabel = classifyExecutiveCausalityLabel({
    causalityClarityScore,
    rootCauseClarityScore,
    causalPropagationScore,
    causalitySignals: activeCausalitySignals,
  });

  const state: EnterpriseOperationalCausalityIntelligenceState = Object.freeze({
    activeCausalitySignals: Object.freeze(activeCausalitySignals),
    rootCauseRecords,
    causalPropagationRecords,
    enterpriseConsequenceRecords,
    rootCauseZones: identifyRootCauseZones(activeCausalitySignals),
    propagationRiskZones: identifyPropagationRiskZones(activeCausalitySignals),
    causalityClarityScore,
    rootCauseClarityScore,
    causalPropagationScore,
    executiveCausalityLabel,
    causalityAmbiguityDisclaimer: CAUSALITY_AMBIGUITY_DISCLAIMER,
    nonAutonomousCausalityDisclaimer: NON_AUTONOMOUS_CAUSALITY_DISCLAIMER,
  });

  const semantics = buildEnterpriseOperationalCausalitySemantics({ state });
  const semanticsGuard = guardEnterpriseOperationalCausalitySemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    causalityStateId,
    executiveCausalityLabel,
    causalityClarityScore,
    rootCauseClarityScore,
  });

  const snapshot: EnterpriseOperationalCausalitySnapshot = Object.freeze({
    causalityStateId,
    topologyId: topology.topologyId,
    synchronizationStateId:
      input.synchronizationStateId ??
      `enterprise-reality-sync::${topology.topologyId}::${tick}`,
    realityStateId:
      input.realityStateId ?? `strategic-reality::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      causalitySummaries: Object.freeze([...semantics.causalitySummaries]),
      rootCauseSummaries: Object.freeze([...semantics.rootCauseSummaries]),
      propagationSummaries: Object.freeze([...semantics.propagationSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: causalityBuiltAt(tick),
  });

  const panelContract = buildEnterpriseOperationalCausalityPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezeEnterpriseOperationalCausalitySnapshot(
  snapshot: EnterpriseOperationalCausalitySnapshot
): EnterpriseOperationalCausalitySnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeCausalitySignals: Object.freeze(
        snapshot.state.activeCausalitySignals.map((s) => Object.freeze({ ...s }))
      ),
      rootCauseRecords: Object.freeze(
        snapshot.state.rootCauseRecords.map((r) => Object.freeze({ ...r }))
      ),
      causalPropagationRecords: Object.freeze(
        snapshot.state.causalPropagationRecords.map((r) => Object.freeze({ ...r }))
      ),
      enterpriseConsequenceRecords: Object.freeze(
        snapshot.state.enterpriseConsequenceRecords.map((r) => Object.freeze({ ...r }))
      ),
      rootCauseZones: Object.freeze([...snapshot.state.rootCauseZones]),
      propagationRiskZones: Object.freeze([...snapshot.state.propagationRiskZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
