/**
 * D7:4:8 — Predictive executive foresight intelligence engine (immutable, non-mutating).
 */

import type {
  EvaluateExecutiveForesightInput,
  EvaluateExecutiveForesightResult,
  ForesightPanelContract,
  PredictiveExecutiveForesightSnapshot,
  PredictiveExecutiveForesightState,
} from "./executiveForesightTypes.ts";
import {
  FORESIGHT_UNCERTAINTY_DISCLAIMER,
  buildForesightContentFingerprint,
  guardEvaluateExecutiveForesight,
  guardForesightExecutiveSemantics,
} from "./foresightGuards.ts";
import {
  calculateFutureReadinessScore,
  calculateLongHorizonRiskScore,
  calculateStrategicPreparednessScore,
  classifyPredictiveForesightLabel,
  deriveExecutiveForesightSignals,
  identifyForesightOpportunityZones,
  identifyFutureReadinessZones,
  identifyLongHorizonRiskZones,
} from "./emergingPatternModel.ts";
import { analyzeLongHorizonForesight } from "./longHorizonForesightAnalysis.ts";
import { analyzeExecutivePreparationGaps } from "./predictiveExecutivePreparationIntelligence.ts";
import { buildExecutiveForesightSemantics } from "./executiveForesightSemantics.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";
import { logForesightDev } from "./foresightDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function foresightBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildForesightPanelContract(input: {
  snapshot: PredictiveExecutiveForesightSnapshot;
}): ForesightPanelContract {
  const regionLabel = (id: string) =>
    CANONICAL_REGION_LABELS[id as keyof typeof CANONICAL_REGION_LABELS] ?? id;

  const viewHint =
    input.snapshot.state.longHorizonForesightRecords.length > 2
      ? "long_horizon_risk_heatmap"
      : input.snapshot.state.executivePreparationGapRecords.length > 2
        ? "executive_preparedness_dashboard"
        : input.snapshot.state.predictiveForesightLabel === "stabilizing"
          ? "future_readiness_panel"
          : input.snapshot.state.longHorizonRiskZones.length > 0
            ? "strategic_foresight_timeline"
            : "foresight_overlay";

  return Object.freeze({
    foresightStateId: input.snapshot.foresightStateId,
    topologyId: input.snapshot.topologyId,
    strategicPreparednessScore: input.snapshot.state.strategicPreparednessScore,
    predictiveForesightLabel: input.snapshot.state.predictiveForesightLabel,
    uncertaintyDisclaimer: input.snapshot.state.uncertaintyDisclaimer,
    signals: Object.freeze(
      input.snapshot.state.activeForesightSignals.slice(0, 16).map((signal) =>
        Object.freeze({
          signalId: signal.signalId,
          label: signal.affectedRegionIds.map(regionLabel).join(" · "),
          foresightState: signal.foresightState,
          foresightStrength: signal.foresightStrength,
        })
      )
    ),
    longHorizonSummaries: Object.freeze(
      input.snapshot.state.longHorizonForesightRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate predictive executive foresight (read-only; does not promise guaranteed future outcomes).
 */
export function evaluateExecutiveForesight(
  input: EvaluateExecutiveForesightInput
): EvaluateExecutiveForesightResult {
  const topology = input.topology;
  const tick = Math.floor(Number(input.tick ?? input.foresightContext?.tick) || 0);
  const foresightStateId = String(
    input.foresightStateId ?? `executive-foresight::${topology.topologyId}::${tick}`
  ).trim();

  const foresightAmplificationFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.foresightContext?.foresightAmplificationFactor ?? 0)
  );
  const horizonStressFactor = clamp01Stress(input.foresightContext?.horizonStressFactor ?? 0);

  logForesightDev("Foresight", {
    foresightStateId,
    topologyId: topology.topologyId,
    tick,
    adaptationLabel: input.adaptationState.predictiveAdaptationLabel,
    preventionLabel: input.preventionState.predictivePreventionLabel,
  });

  const activeForesightSignals = deriveExecutiveForesightSignals({
    topology,
    adaptationState: input.adaptationState,
    preventionState: input.preventionState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    cascadeState: input.cascadeState,
    recoveryOpportunityState: input.recoveryOpportunityState,
    resilienceState: input.resilienceState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    foresightAmplificationFactor,
    horizonStressFactor,
  });

  const strategicPreparednessScore = calculateStrategicPreparednessScore({
    signals: activeForesightSignals,
    adaptationState: input.adaptationState,
    preventionState: input.preventionState,
  });

  const longHorizonRiskScore = calculateLongHorizonRiskScore({
    signals: activeForesightSignals,
    divergenceState: input.divergenceState,
    cascadeState: input.cascadeState,
  });

  const futureReadinessScore = calculateFutureReadinessScore({
    signals: activeForesightSignals,
    recoveryOpportunityState: input.recoveryOpportunityState,
    resilienceState: input.resilienceState,
  });

  const longHorizonForesightRecords = analyzeLongHorizonForesight({
    topology,
    signals: activeForesightSignals,
    trajectoryState: input.trajectoryState,
    divergenceState: input.divergenceState,
    cascadeState: input.cascadeState,
    preventionState: input.preventionState,
    adaptationState: input.adaptationState,
  });

  const executivePreparationGapRecords = analyzeExecutivePreparationGaps({
    topology,
    signals: activeForesightSignals,
    adaptationState: input.adaptationState,
    preventionState: input.preventionState,
    recoveryOpportunityState: input.recoveryOpportunityState,
    resilienceState: input.resilienceState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
  });

  const adaptationFingerprint = stableStringify({
    label: input.adaptationState.predictiveAdaptationLabel,
    adaptive: input.adaptationState.adaptiveResilienceScore,
  });
  const preventionFingerprint = stableStringify({
    label: input.preventionState.predictivePreventionLabel,
    interruption: input.preventionState.collapseInterruptionScore,
  });
  const divergenceFingerprint = stableStringify({
    fragmentation: input.divergenceState.futureFragmentationScore,
    label: input.divergenceState.multiFutureDivergenceLabel,
  });

  const pendingFingerprint = buildForesightContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    adaptationFingerprint,
    preventionFingerprint,
    divergenceFingerprint,
    tick,
  });

  const guard = guardEvaluateExecutiveForesight({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    signals: activeForesightSignals,
    priorForesightFingerprints: input.priorForesightFingerprints,
    pendingFingerprint,
    strategicPreparednessScore,
    futureReadinessScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const predictiveForesightLabel = classifyPredictiveForesightLabel({
    strategicPreparednessScore,
    longHorizonRiskScore,
    futureReadinessScore,
  });

  const state: PredictiveExecutiveForesightState = Object.freeze({
    activeForesightSignals: Object.freeze(activeForesightSignals),
    longHorizonForesightRecords,
    executivePreparationGapRecords,
    foresightOpportunityZones: identifyForesightOpportunityZones(activeForesightSignals),
    longHorizonRiskZones: identifyLongHorizonRiskZones(
      activeForesightSignals,
      input.preventionState
    ),
    futureReadinessZones: identifyFutureReadinessZones(
      activeForesightSignals,
      input.recoveryOpportunityState
    ),
    strategicPreparednessScore,
    longHorizonRiskScore,
    futureReadinessScore,
    predictiveForesightLabel,
    uncertaintyDisclaimer: FORESIGHT_UNCERTAINTY_DISCLAIMER,
  });

  const semantics = buildExecutiveForesightSemantics({ state });
  const semanticsGuard = guardForesightExecutiveSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    foresightStateId,
    predictiveForesightLabel,
    strategicPreparednessScore,
    longHorizonRiskScore,
  });

  const snapshot: PredictiveExecutiveForesightSnapshot = Object.freeze({
    foresightStateId,
    topologyId: topology.topologyId,
    adaptationStateId: `strategic-adaptation::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      signalSummaries: Object.freeze([...semantics.signalSummaries]),
      longHorizonSummaries: Object.freeze([...semantics.longHorizonSummaries]),
      preparationSummaries: Object.freeze([...semantics.preparationSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: foresightBuiltAt(tick),
  });

  const panelContract = buildForesightPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezePredictiveExecutiveForesightSnapshot(
  snapshot: PredictiveExecutiveForesightSnapshot
): PredictiveExecutiveForesightSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeForesightSignals: Object.freeze(
        snapshot.state.activeForesightSignals.map((s) => Object.freeze({ ...s }))
      ),
      longHorizonForesightRecords: Object.freeze(
        snapshot.state.longHorizonForesightRecords.map((r) => Object.freeze({ ...r }))
      ),
      executivePreparationGapRecords: Object.freeze(
        snapshot.state.executivePreparationGapRecords.map((g) => Object.freeze({ ...g }))
      ),
      foresightOpportunityZones: Object.freeze([...snapshot.state.foresightOpportunityZones]),
      longHorizonRiskZones: Object.freeze([...snapshot.state.longHorizonRiskZones]),
      futureReadinessZones: Object.freeze([...snapshot.state.futureReadinessZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
