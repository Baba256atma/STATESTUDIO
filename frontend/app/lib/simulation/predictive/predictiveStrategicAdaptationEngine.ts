/**
 * D7:4:7 — Predictive strategic adaptation intelligence engine (immutable, non-mutating).
 */

import type {
  AdaptationPanelContract,
  EvaluateStrategicAdaptationInput,
  EvaluateStrategicAdaptationResult,
  PredictiveStrategicAdaptationSnapshot,
  PredictiveStrategicAdaptationState,
} from "./strategicAdaptationTypes.ts";
import {
  ADAPTATION_UNCERTAINTY_DISCLAIMER,
  buildAdaptationContentFingerprint,
  guardAdaptationExecutiveSemantics,
  guardEvaluateStrategicAdaptation,
} from "./adaptationGuards.ts";
import {
  calculateAdaptationFragilityScore,
  calculateAdaptiveResilienceScore,
  calculateStrategicFlexibilityScore,
  classifyPredictiveAdaptationLabel,
  deriveStrategicAdaptationSignals,
  identifyAdaptationFragilityZones,
  identifyStrategicFlexibilityZones,
  identifyTransformationBottleneckZones,
} from "./adaptiveTransformationModel.ts";
import { analyzeResilienceFlexibility } from "./resilienceFlexibilityAnalysis.ts";
import { analyzePredictiveAdaptationPathways } from "./predictiveAdaptationPathwayIntelligence.ts";
import { buildExecutiveStrategicAdaptationSemantics } from "./executiveStrategicAdaptationSemantics.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";
import { logAdaptationDev } from "./adaptationDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function adaptationBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildAdaptationPanelContract(input: {
  snapshot: PredictiveStrategicAdaptationSnapshot;
}): AdaptationPanelContract {
  const regionLabel = (id: string) =>
    CANONICAL_REGION_LABELS[id as keyof typeof CANONICAL_REGION_LABELS] ?? id;

  const viewHint =
    input.snapshot.state.predictiveAdaptationPathwayRecords.length > 2
      ? "adaptive_recovery_dashboard"
      : input.snapshot.state.resilienceFlexibilityRecords.length > 2
        ? "strategic_flexibility_heatmap"
        : input.snapshot.state.predictiveAdaptationLabel === "flexible"
          ? "resilience_transformation_panel"
          : input.snapshot.state.strategicFlexibilityZones.length > 0
            ? "executive_adaptation_timeline"
            : "adaptation_overlay";

  return Object.freeze({
    adaptationStateId: input.snapshot.adaptationStateId,
    topologyId: input.snapshot.topologyId,
    adaptiveResilienceScore: input.snapshot.state.adaptiveResilienceScore,
    predictiveAdaptationLabel: input.snapshot.state.predictiveAdaptationLabel,
    uncertaintyDisclaimer: input.snapshot.state.uncertaintyDisclaimer,
    signals: Object.freeze(
      input.snapshot.state.activeAdaptationSignals.slice(0, 16).map((signal) =>
        Object.freeze({
          signalId: signal.signalId,
          label: signal.affectedRegionIds.map(regionLabel).join(" · "),
          adaptationState: signal.adaptationState,
          adaptationStrength: signal.adaptationStrength,
        })
      )
    ),
    pathwaySummaries: Object.freeze(
      input.snapshot.state.predictiveAdaptationPathwayRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate predictive strategic adaptation (read-only; does not promise guaranteed adaptation outcomes).
 */
export function evaluateStrategicAdaptation(
  input: EvaluateStrategicAdaptationInput
): EvaluateStrategicAdaptationResult {
  const topology = input.topology;
  const tick = Math.floor(Number(input.tick ?? input.adaptationContext?.tick) || 0);
  const adaptationStateId = String(
    input.adaptationStateId ?? `strategic-adaptation::${topology.topologyId}::${tick}`
  ).trim();

  const adaptationLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.adaptationContext?.adaptationLeverageFactor ?? 0)
  );
  const rigidityStressFactor = clamp01Stress(input.adaptationContext?.rigidityStressFactor ?? 0);

  logAdaptationDev("Adaptation", {
    adaptationStateId,
    topologyId: topology.topologyId,
    tick,
    preventionLabel: input.preventionState.predictivePreventionLabel,
    recoveryLabel: input.recoveryOpportunityState.recoveryOpportunityLabel,
  });

  const activeAdaptationSignals = deriveStrategicAdaptationSignals({
    topology,
    preventionState: input.preventionState,
    recoveryOpportunityState: input.recoveryOpportunityState,
    trajectoryState: input.trajectoryState,
    divergenceState: input.divergenceState,
    resilienceState: input.resilienceState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    recoveryState: input.recoveryState,
    coordinationState: input.coordinationState,
    alignmentState: input.alignmentState,
    leadershipState: input.leadershipState,
    pressureState: input.pressureState,
    trustState: input.trustState,
    adaptationLeverageFactor,
    rigidityStressFactor,
  });

  const adaptiveResilienceScore = calculateAdaptiveResilienceScore({
    signals: activeAdaptationSignals,
    resilienceState: input.resilienceState,
    recoveryOpportunityState: input.recoveryOpportunityState,
  });

  const strategicFlexibilityScore = calculateStrategicFlexibilityScore({
    signals: activeAdaptationSignals,
    preventionState: input.preventionState,
    coordinationState: input.coordinationState,
  });

  const adaptationFragilityScore = calculateAdaptationFragilityScore({
    signals: activeAdaptationSignals,
    divergenceState: input.divergenceState,
  });

  const resilienceFlexibilityRecords = analyzeResilienceFlexibility({
    topology,
    signals: activeAdaptationSignals,
  });

  const predictiveAdaptationPathwayRecords = analyzePredictiveAdaptationPathways({
    topology,
    signals: activeAdaptationSignals,
    trajectoryState: input.trajectoryState,
    divergenceState: input.divergenceState,
    preventionState: input.preventionState,
    recoveryOpportunityState: input.recoveryOpportunityState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    adaptiveResilienceScore,
  });

  const preventionFingerprint = stableStringify({
    label: input.preventionState.predictivePreventionLabel,
    interruption: input.preventionState.collapseInterruptionScore,
  });
  const recoveryFingerprint = stableStringify({
    label: input.recoveryOpportunityState.recoveryOpportunityLabel,
    acceleration: input.recoveryOpportunityState.recoveryAccelerationScore,
  });
  const resilienceFingerprint = stableStringify({
    label: input.resilienceState.resilienceStabilityLabel,
    adaptation: input.resilienceState.humanSystemAdaptationLevel,
  });

  const pendingFingerprint = buildAdaptationContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    preventionFingerprint,
    recoveryOpportunityFingerprint: recoveryFingerprint,
    resilienceFingerprint,
    tick,
  });

  const guard = guardEvaluateStrategicAdaptation({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    signals: activeAdaptationSignals,
    priorAdaptationFingerprints: input.priorAdaptationFingerprints,
    pendingFingerprint,
    adaptiveResilienceScore,
    strategicFlexibilityScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const predictiveAdaptationLabel = classifyPredictiveAdaptationLabel({
    adaptiveResilienceScore,
    strategicFlexibilityScore,
    adaptationFragilityScore,
  });

  const state: PredictiveStrategicAdaptationState = Object.freeze({
    activeAdaptationSignals: Object.freeze(activeAdaptationSignals),
    resilienceFlexibilityRecords,
    predictiveAdaptationPathwayRecords,
    strategicFlexibilityZones: identifyStrategicFlexibilityZones(activeAdaptationSignals),
    adaptationFragilityZones: identifyAdaptationFragilityZones(
      activeAdaptationSignals,
      input.preventionState
    ),
    transformationBottleneckZones: identifyTransformationBottleneckZones({
      signals: activeAdaptationSignals,
      leadershipState: input.leadershipState,
      alignmentState: input.alignmentState,
    }),
    adaptiveResilienceScore,
    strategicFlexibilityScore,
    adaptationFragilityScore,
    predictiveAdaptationLabel,
    uncertaintyDisclaimer: ADAPTATION_UNCERTAINTY_DISCLAIMER,
  });

  const semantics = buildExecutiveStrategicAdaptationSemantics({ state });
  const semanticsGuard = guardAdaptationExecutiveSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    adaptationStateId,
    predictiveAdaptationLabel,
    adaptiveResilienceScore,
    strategicFlexibilityScore,
  });

  const snapshot: PredictiveStrategicAdaptationSnapshot = Object.freeze({
    adaptationStateId,
    topologyId: topology.topologyId,
    preventionStateId: `collapse-prevention::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      signalSummaries: Object.freeze([...semantics.signalSummaries]),
      flexibilitySummaries: Object.freeze([...semantics.flexibilitySummaries]),
      pathwaySummaries: Object.freeze([...semantics.pathwaySummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: adaptationBuiltAt(tick),
  });

  const panelContract = buildAdaptationPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezePredictiveStrategicAdaptationSnapshot(
  snapshot: PredictiveStrategicAdaptationSnapshot
): PredictiveStrategicAdaptationSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeAdaptationSignals: Object.freeze(
        snapshot.state.activeAdaptationSignals.map((s) => Object.freeze({ ...s }))
      ),
      resilienceFlexibilityRecords: Object.freeze(
        snapshot.state.resilienceFlexibilityRecords.map((r) => Object.freeze({ ...r }))
      ),
      predictiveAdaptationPathwayRecords: Object.freeze(
        snapshot.state.predictiveAdaptationPathwayRecords.map((r) => Object.freeze({ ...r }))
      ),
      strategicFlexibilityZones: Object.freeze([...snapshot.state.strategicFlexibilityZones]),
      adaptationFragilityZones: Object.freeze([...snapshot.state.adaptationFragilityZones]),
      transformationBottleneckZones: Object.freeze([
        ...snapshot.state.transformationBottleneckZones,
      ]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
