/**
 * D7:4:4 — Predictive cascading consequence intelligence engine (immutable, non-mutating).
 */

import type {
  CascadePanelContract,
  EvaluatePredictiveCascadesInput,
  EvaluatePredictiveCascadesResult,
  PredictiveCascadeSnapshot,
  PredictiveCascadeState,
} from "./cascadingConsequenceTypes.ts";
import {
  buildCascadeContentFingerprint,
  CASCADE_UNCERTAINTY_DISCLAIMER,
  guardCascadeExecutiveSemantics,
  guardEvaluatePredictiveCascades,
} from "./cascadeGuards.ts";
import {
  calculateCascadeAmplificationScore,
  calculateCascadePropagationScore,
  calculateCascadeStabilizationScore,
  classifyPredictiveCascadeLabel,
  derivePredictiveCascadeSignals,
  identifyAmplificationZones,
  identifyStabilizationZones,
  resolveInflectionSurface,
} from "./predictivePropagationModel.ts";
import { analyzeSecondaryTertiaryConsequences } from "./secondaryTertiaryConsequenceAnalysis.ts";
import { analyzeFutureAmplification } from "./futureAmplificationIntelligence.ts";
import { buildExecutiveCascadeSemantics } from "./executiveCascadeSemantics.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";
import { logCascadeDev } from "./cascadeDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function cascadeBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildCascadePanelContract(input: {
  snapshot: PredictiveCascadeSnapshot;
}): CascadePanelContract {
  const regionLabel = (id: string) =>
    CANONICAL_REGION_LABELS[id as keyof typeof CANONICAL_REGION_LABELS] ?? id;

  const viewHint =
    input.snapshot.state.secondaryTertiaryConsequenceRecords.length > 2
      ? "chain_reaction_dashboard"
      : input.snapshot.state.amplificationZones.length > 2
        ? "propagation_heatmap"
        : input.snapshot.state.stabilizationZones.length > 0
          ? "stabilization_ripple_panel"
          : input.snapshot.state.predictiveCascadeLabel === "critical"
            ? "executive_cascade_timeline"
            : "cascade_overlay";

  return Object.freeze({
    cascadeStateId: input.snapshot.cascadeStateId,
    topologyId: input.snapshot.topologyId,
    cascadePropagationScore: input.snapshot.state.cascadePropagationScore,
    predictiveCascadeLabel: input.snapshot.state.predictiveCascadeLabel,
    uncertaintyDisclaimer: input.snapshot.state.uncertaintyDisclaimer,
    signals: Object.freeze(
      input.snapshot.state.activeCascadeSignals.slice(0, 16).map((signal) =>
        Object.freeze({
          signalId: signal.signalId,
          label: `${signal.originatingRegionIds.map(regionLabel).join(" → ")} · ${signal.affectedRegionIds.map(regionLabel).join(", ")}`,
          cascadeState: signal.cascadeState,
          propagationIntensity: signal.propagationIntensity,
        })
      )
    ),
    consequenceSummaries: Object.freeze(
      input.snapshot.state.secondaryTertiaryConsequenceRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate predictive cascading consequences (read-only; not guaranteed future outcomes).
 */
export function evaluatePredictiveCascades(
  input: EvaluatePredictiveCascadesInput
): EvaluatePredictiveCascadesResult {
  const topology = input.topology;
  const tick = Math.floor(Number(input.tick ?? input.cascadeContext?.tick) || 0);
  const cascadeStateId = String(
    input.cascadeStateId ?? `predictive-cascade::${topology.topologyId}::${tick}`
  ).trim();

  const cascadeAmplificationFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.005 +
      (input.cascadeContext?.cascadeAmplificationFactor ?? 0)
  );
  const propagationStressFactor = clamp01Stress(
    input.cascadeContext?.propagationStressFactor ?? 0
  );

  const inflection = resolveInflectionSurface({
    trajectoryState: input.trajectoryState,
    divergenceState: input.divergenceState,
    inflectionState: input.inflectionState,
  });

  logCascadeDev("Cascade", {
    cascadeStateId,
    topologyId: topology.topologyId,
    tick,
    trajectoryLabel: input.trajectoryState.predictiveTrajectoryLabel,
    divergenceLabel: input.divergenceState.multiFutureDivergenceLabel,
    inflectionLabel: inflection.strategicInflectionLabel,
  });

  const activeCascadeSignals = derivePredictiveCascadeSignals({
    topology,
    trajectoryState: input.trajectoryState,
    divergenceState: input.divergenceState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    resilienceState: input.resilienceState,
    coordinationState: input.coordinationState,
    pressureState: input.pressureState,
    inflection,
    cascadeAmplificationFactor,
    propagationStressFactor,
  });

  const cascadePropagationScore = calculateCascadePropagationScore({
    signals: activeCascadeSignals,
    trajectoryState: input.trajectoryState,
  });

  const cascadeAmplificationScore = calculateCascadeAmplificationScore({
    signals: activeCascadeSignals,
    divergenceState: input.divergenceState,
  });

  const cascadeStabilizationScore = calculateCascadeStabilizationScore({
    signals: activeCascadeSignals,
    resilienceState: input.resilienceState,
  });

  const secondaryTertiaryConsequenceRecords = analyzeSecondaryTertiaryConsequences({
    signals: activeCascadeSignals,
    trustState: input.trustState,
    coordinationState: input.coordinationState,
    divergenceState: input.divergenceState,
  });

  const futureAmplificationRecords = analyzeFutureAmplification({
    topology,
    signals: activeCascadeSignals,
    trajectoryState: input.trajectoryState,
    divergenceState: input.divergenceState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    pressureState: input.pressureState,
    cascadeAmplificationScore,
  });

  const trajectoryFingerprint = stableStringify({
    label: input.trajectoryState.predictiveTrajectoryLabel,
    propagation: input.trajectoryState.trajectoryDivergenceScore,
  });
  const divergenceFingerprint = stableStringify({
    label: input.divergenceState.multiFutureDivergenceLabel,
    fragmentation: input.divergenceState.futureFragmentationScore,
  });
  const inflectionFingerprint = stableStringify({
    label: inflection.strategicInflectionLabel,
    pressure: inflection.inflectionPressureScore,
  });

  const pendingFingerprint = buildCascadeContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    trajectoryFingerprint,
    divergenceFingerprint,
    inflectionFingerprint,
    tick,
  });

  const guard = guardEvaluatePredictiveCascades({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    signals: activeCascadeSignals,
    priorCascadeFingerprints: input.priorCascadeFingerprints,
    pendingFingerprint,
    cascadeAmplificationScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const predictiveCascadeLabel = classifyPredictiveCascadeLabel({
    cascadePropagationScore,
    cascadeAmplificationScore,
    cascadeStabilizationScore,
  });

  const state: PredictiveCascadeState = Object.freeze({
    activeCascadeSignals: Object.freeze(activeCascadeSignals),
    secondaryTertiaryConsequenceRecords,
    futureAmplificationRecords,
    amplificationZones: identifyAmplificationZones(activeCascadeSignals),
    stabilizationZones: identifyStabilizationZones(activeCascadeSignals),
    cascadePropagationScore,
    cascadeAmplificationScore,
    cascadeStabilizationScore,
    predictiveCascadeLabel,
    uncertaintyDisclaimer: CASCADE_UNCERTAINTY_DISCLAIMER,
  });

  const semantics = buildExecutiveCascadeSemantics({ state });
  const semanticsGuard = guardCascadeExecutiveSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    cascadeStateId,
    predictiveCascadeLabel,
    cascadePropagationScore,
    cascadeAmplificationScore,
  });

  const snapshot: PredictiveCascadeSnapshot = Object.freeze({
    cascadeStateId,
    topologyId: topology.topologyId,
    trajectoryStateId: `predictive-trajectory::${topology.topologyId}::${tick}`,
    divergenceStateId: `multi-future-divergence::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      signalSummaries: Object.freeze([...semantics.signalSummaries]),
      consequenceSummaries: Object.freeze([...semantics.consequenceSummaries]),
      amplificationSummaries: Object.freeze([...semantics.amplificationSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: cascadeBuiltAt(tick),
  });

  const panelContract = buildCascadePanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezePredictiveCascadeSnapshot(
  snapshot: PredictiveCascadeSnapshot
): PredictiveCascadeSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeCascadeSignals: Object.freeze(
        snapshot.state.activeCascadeSignals.map((s) => Object.freeze({ ...s }))
      ),
      secondaryTertiaryConsequenceRecords: Object.freeze(
        snapshot.state.secondaryTertiaryConsequenceRecords.map((r) => Object.freeze({ ...r }))
      ),
      futureAmplificationRecords: Object.freeze(
        snapshot.state.futureAmplificationRecords.map((r) => Object.freeze({ ...r }))
      ),
      amplificationZones: Object.freeze([...snapshot.state.amplificationZones]),
      stabilizationZones: Object.freeze([...snapshot.state.stabilizationZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
