/**
 * D7:4:6 — Predictive systemic collapse prevention engine (immutable, non-mutating).
 */

import type {
  EvaluateCollapsePreventionInput,
  EvaluateCollapsePreventionResult,
  PredictiveCollapsePreventionSnapshot,
  PredictiveCollapsePreventionState,
  PreventionPanelContract,
} from "./collapsePreventionTypes.ts";
import {
  buildPreventionContentFingerprint,
  guardEvaluateCollapsePrevention,
  guardPreventionExecutiveSemantics,
  PREVENTION_UNCERTAINTY_DISCLAIMER,
} from "./preventionGuards.ts";
import {
  calculateCollapseInterruptionScore,
  calculateCriticalThresholdProximityScore,
  calculateResiliencePreservationScore,
  classifyPredictivePreventionLabel,
  deriveCollapsePreventionSignals,
  identifyCriticalCollapseZones,
  identifyStabilizationInterventionZones,
  resolvePreventionInflection,
} from "./criticalThresholdPreventionModel.ts";
import { analyzeStabilizationInterruption } from "./stabilizationInterruptionAnalysis.ts";
import { analyzeResiliencePreservation } from "./predictiveResiliencePreservationIntelligence.ts";
import { buildExecutiveCollapsePreventionSemantics } from "./executiveCollapsePreventionSemantics.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";
import { logPreventionDev } from "./preventionDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function preventionBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildPreventionPanelContract(input: {
  snapshot: PredictiveCollapsePreventionSnapshot;
}): PreventionPanelContract {
  const regionLabel = (id: string) =>
    CANONICAL_REGION_LABELS[id as keyof typeof CANONICAL_REGION_LABELS] ?? id;

  const viewHint =
    input.snapshot.state.stabilizationInterruptionRecords.length > 2
      ? "predictive_prevention_dashboard"
      : input.snapshot.state.criticalCollapseZones.length > 2
        ? "stabilization_opportunity_heatmap"
        : input.snapshot.state.resiliencePreservationRecords.length > 2
          ? "resilience_preservation_panel"
          : input.snapshot.state.predictivePreventionLabel === "intervenable"
            ? "executive_prevention_timeline"
            : "collapse_prevention_overlay";

  return Object.freeze({
    preventionStateId: input.snapshot.preventionStateId,
    topologyId: input.snapshot.topologyId,
    collapseInterruptionScore: input.snapshot.state.collapseInterruptionScore,
    predictivePreventionLabel: input.snapshot.state.predictivePreventionLabel,
    uncertaintyDisclaimer: input.snapshot.state.uncertaintyDisclaimer,
    signals: Object.freeze(
      input.snapshot.state.activePreventionSignals.slice(0, 16).map((signal) =>
        Object.freeze({
          signalId: signal.signalId,
          label: signal.affectedRegionIds.map(regionLabel).join(" · "),
          preventionState: signal.preventionState,
          preventionStrength: signal.preventionStrength,
        })
      )
    ),
    interruptionSummaries: Object.freeze(
      input.snapshot.state.stabilizationInterruptionRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate predictive systemic collapse prevention (read-only; does not promise guaranteed prevention).
 */
export function evaluateCollapsePrevention(
  input: EvaluateCollapsePreventionInput
): EvaluateCollapsePreventionResult {
  const topology = input.topology;
  const tick = Math.floor(Number(input.tick ?? input.preventionContext?.tick) || 0);
  const preventionStateId = String(
    input.preventionStateId ?? `collapse-prevention::${topology.topologyId}::${tick}`
  ).trim();

  const preventionLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.preventionContext?.preventionLeverageFactor ?? 0)
  );
  const thresholdStressFactor = clamp01Stress(
    input.preventionContext?.thresholdStressFactor ?? 0
  );

  const inflection = resolvePreventionInflection({
    trajectoryState: input.trajectoryState,
    divergenceState: input.divergenceState,
    inflectionState: input.inflectionState,
  });

  logPreventionDev("CollapsePrevention", {
    preventionStateId,
    topologyId: topology.topologyId,
    tick,
    cascadeLabel: input.cascadeState.predictiveCascadeLabel,
    recoveryLabel: input.recoveryOpportunityState.recoveryOpportunityLabel,
    inflectionLabel: inflection.strategicInflectionLabel,
  });

  const activePreventionSignals = deriveCollapsePreventionSignals({
    topology,
    cascadeState: input.cascadeState,
    recoveryOpportunityState: input.recoveryOpportunityState,
    trajectoryState: input.trajectoryState,
    divergenceState: input.divergenceState,
    resilienceState: input.resilienceState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    inflection,
    coordinationState: input.coordinationState,
    pressureState: input.pressureState,
    trustState: input.trustState,
    preventionLeverageFactor: preventionLeverageFactor - thresholdStressFactor * 0.5,
  });

  const collapseInterruptionScore = calculateCollapseInterruptionScore({
    signals: activePreventionSignals,
    cascadeState: input.cascadeState,
    recoveryOpportunityState: input.recoveryOpportunityState,
  });

  const criticalThresholdProximityScore = calculateCriticalThresholdProximityScore({
    signals: activePreventionSignals,
    cascadeState: input.cascadeState,
    inflection,
  });

  const resiliencePreservationScore = calculateResiliencePreservationScore({
    signals: activePreventionSignals,
    resilienceState: input.resilienceState,
    recoveryOpportunityState: input.recoveryOpportunityState,
  });

  const stabilizationInterruptionRecords = analyzeStabilizationInterruption({
    signals: activePreventionSignals,
    cascadeState: input.cascadeState,
    recoveryOpportunityState: input.recoveryOpportunityState,
    collapseInterruptionScore,
  });

  const resiliencePreservationRecords = analyzeResiliencePreservation({
    topology,
    signals: activePreventionSignals,
    cascadeState: input.cascadeState,
    recoveryOpportunityState: input.recoveryOpportunityState,
    divergenceState: input.divergenceState,
    resilienceState: input.resilienceState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    resiliencePreservationScore,
  });

  const cascadeFingerprint = stableStringify({
    label: input.cascadeState.predictiveCascadeLabel,
    amplification: input.cascadeState.cascadeAmplificationScore,
  });
  const recoveryFingerprint = stableStringify({
    label: input.recoveryOpportunityState.recoveryOpportunityLabel,
    stabilization: input.recoveryOpportunityState.stabilizationPotentialScore,
  });
  const inflectionFingerprint = stableStringify({
    label: inflection.strategicInflectionLabel,
    pressure: inflection.inflectionPressureScore,
  });

  const pendingFingerprint = buildPreventionContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    cascadeFingerprint,
    recoveryOpportunityFingerprint: recoveryFingerprint,
    inflectionFingerprint,
    tick,
  });

  const guard = guardEvaluateCollapsePrevention({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    signals: activePreventionSignals,
    priorPreventionFingerprints: input.priorPreventionFingerprints,
    pendingFingerprint,
    collapseInterruptionScore,
    resiliencePreservationScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const predictivePreventionLabel = classifyPredictivePreventionLabel({
    collapseInterruptionScore,
    criticalThresholdProximityScore,
    resiliencePreservationScore,
  });

  const state: PredictiveCollapsePreventionState = Object.freeze({
    activePreventionSignals: Object.freeze(activePreventionSignals),
    stabilizationInterruptionRecords,
    resiliencePreservationRecords,
    stabilizationInterventionZones: identifyStabilizationInterventionZones(
      activePreventionSignals
    ),
    criticalCollapseZones: identifyCriticalCollapseZones(
      activePreventionSignals,
      input.cascadeState
    ),
    collapseInterruptionScore,
    criticalThresholdProximityScore,
    resiliencePreservationScore,
    predictivePreventionLabel,
    uncertaintyDisclaimer: PREVENTION_UNCERTAINTY_DISCLAIMER,
  });

  const semantics = buildExecutiveCollapsePreventionSemantics({ state });
  const semanticsGuard = guardPreventionExecutiveSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    preventionStateId,
    predictivePreventionLabel,
    collapseInterruptionScore,
    resiliencePreservationScore,
  });

  const snapshot: PredictiveCollapsePreventionSnapshot = Object.freeze({
    preventionStateId,
    topologyId: topology.topologyId,
    recoveryOpportunityStateId: `predictive-recovery-opportunity::${topology.topologyId}::${tick}`,
    cascadeStateId: `predictive-cascade::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      signalSummaries: Object.freeze([...semantics.signalSummaries]),
      interruptionSummaries: Object.freeze([...semantics.interruptionSummaries]),
      preservationSummaries: Object.freeze([...semantics.preservationSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: preventionBuiltAt(tick),
  });

  const panelContract = buildPreventionPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezePredictiveCollapsePreventionSnapshot(
  snapshot: PredictiveCollapsePreventionSnapshot
): PredictiveCollapsePreventionSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activePreventionSignals: Object.freeze(
        snapshot.state.activePreventionSignals.map((s) => Object.freeze({ ...s }))
      ),
      stabilizationInterruptionRecords: Object.freeze(
        snapshot.state.stabilizationInterruptionRecords.map((r) => Object.freeze({ ...r }))
      ),
      resiliencePreservationRecords: Object.freeze(
        snapshot.state.resiliencePreservationRecords.map((r) => Object.freeze({ ...r }))
      ),
      stabilizationInterventionZones: Object.freeze([
        ...snapshot.state.stabilizationInterventionZones,
      ]),
      criticalCollapseZones: Object.freeze([...snapshot.state.criticalCollapseZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
