/**
 * D7:2:3 — Enterprise dependency pressure intelligence engine (immutable, non-mutating).
 */

import type {
  EnterprisePressureSnapshot,
  EnterprisePressureState,
  EvaluateDependencyPressureInput,
  EvaluateDependencyPressureResult,
  PressurePanelContract,
} from "./dependencyPressureTypes.ts";
import {
  accumulateRegionalPressure,
  applySimulationEventPressureAdjustments,
  derivePressureSignalsFromDependencies,
} from "./pressureAccumulationModel.ts";
import { analyzePressurePropagation } from "./pressurePropagationAnalysis.ts";
import {
  detectFragilityHotspots,
  detectSaturationRegions,
} from "./saturationDetection.ts";
import {
  buildPressureContentFingerprint,
  guardEvaluateDependencyPressure,
} from "./pressureGuards.ts";
import {
  calculateCascadeRiskScore,
  calculateSystemicPressureScore,
  classifyPressureStability,
} from "./systemicPressureModel.ts";
import { buildExecutivePressureSemantics } from "./executivePressureSemantics.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";
import { logPressureDev } from "./pressureDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function pressureBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

export function buildPressurePanelContract(input: {
  snapshot: EnterprisePressureSnapshot;
}): PressurePanelContract {
  const regionLabel = (id: string) =>
    CANONICAL_REGION_LABELS[id as keyof typeof CANONICAL_REGION_LABELS] ?? id;

  const viewHint =
    input.snapshot.state.fragilityHotspots.length > 0
      ? "fragility_concentration"
      : input.snapshot.state.saturationRegions.length > 0
        ? "saturation_dashboard"
        : input.snapshot.state.propagationRecords.length > 4
          ? "dependency_stress_overlay"
          : input.snapshot.state.systemicPressureScore > 0.55
            ? "pressure_heatmap"
            : "pressure_timeline";

  return Object.freeze({
    pressureStateId: input.snapshot.pressureStateId,
    topologyId: input.snapshot.topologyId,
    systemicPressureScore: input.snapshot.state.systemicPressureScore,
    cascadeRiskScore: input.snapshot.state.cascadeRiskScore,
    pressureStabilityLabel: input.snapshot.state.pressureStabilityLabel,
    signals: Object.freeze(
      input.snapshot.state.activePressureSignals.slice(0, 24).map((signal) =>
        Object.freeze({
          signalId: signal.signalId,
          sourceLabel: regionLabel(signal.sourceRegionId),
          targetLabel: regionLabel(signal.targetRegionId),
          pressureType: signal.pressureType,
          intensity: signal.intensity,
        })
      )
    ),
    hotspots: Object.freeze(
      input.snapshot.state.fragilityHotspots.map((h) =>
        Object.freeze({
          regionId: h.regionId,
          label: regionLabel(h.regionId),
          severity: h.severity,
          reason: h.reason,
        })
      )
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate enterprise dependency pressure (read-only; never mutates topology or flow state).
 */
export function evaluateDependencyPressure(
  input: EvaluateDependencyPressureInput
): EvaluateDependencyPressureResult {
  const topology = input.topology;
  const tick = Math.floor(Number(input.tick ?? input.simulationState?.tick) || 0);
  const pressureStateId = String(
    input.pressureStateId ?? `pressure::${topology.topologyId}::${tick}`
  ).trim();

  logPressureDev("DependencyPressure", {
    pressureStateId,
    topologyId: topology.topologyId,
    tick,
    hasFlowState: Boolean(input.flowState),
  });

  let signals = derivePressureSignalsFromDependencies({
    topology,
    flowState: input.flowState,
    regionMetrics: input.regionMetrics,
  });
  signals = applySimulationEventPressureAdjustments(
    signals,
    input.regionMetrics,
    input.simulationEvents,
    input.simulationState
  );

  const regionIds = topology.operationalRegions.map((r) => r.regionId);
  const prePropagationAccumulations = accumulateRegionalPressure({
    signals,
    regionIds,
    regionMetrics: input.regionMetrics,
  });

  const preliminarySystemic = calculateSystemicPressureScore(prePropagationAccumulations);
  const preliminaryCascade = calculateCascadeRiskScore({
    accumulations: prePropagationAccumulations,
    propagationRecords: [],
    hotspots: [],
    saturationRegionCount: 0,
  });

  const flowFingerprint =
    input.flowState != null
      ? stableStringify({
          flowPressure: input.flowState.flowPressureScore,
          momentum: input.flowState.operationalMomentum,
          flowCount: input.flowState.activeFlows.length,
        })
      : undefined;

  const pendingFingerprint = buildPressureContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    flowFingerprint,
    tick,
    regionMetricKeys: Object.keys(input.regionMetrics ?? {}),
  });

  const guard = guardEvaluateDependencyPressure({
    topologyId: topology.topologyId,
    topologyRegionIds: regionIds,
    signals,
    priorPressureFingerprints: input.priorPressureFingerprints,
    pendingFingerprint,
    systemicPressureScore: preliminarySystemic,
    cascadeRiskScore: preliminaryCascade,
  });
  if (!guard.ok) return { ok: false, guard };

  const { propagationRecords, adjustedAccumulations } = analyzePressurePropagation({
    topology,
    signals,
    regionAccumulations: prePropagationAccumulations,
  });

  const saturationRegions = detectSaturationRegions({
    accumulations: adjustedAccumulations,
    regionMetrics: input.regionMetrics,
  });

  const fragilityHotspots = detectFragilityHotspots({
    regions: topology.operationalRegions,
    signals,
    accumulations: adjustedAccumulations,
    saturationRegions,
    regionMetrics: input.regionMetrics,
  });

  const systemicPressureScore = calculateSystemicPressureScore(adjustedAccumulations);
  const cascadeRiskScore = calculateCascadeRiskScore({
    accumulations: adjustedAccumulations,
    propagationRecords,
    hotspots: fragilityHotspots,
    saturationRegionCount: saturationRegions.length,
  });

  const pressureStabilityLabel = classifyPressureStability({
    systemicPressureScore,
    cascadeRiskScore,
    saturationRegionCount: saturationRegions.length,
  });

  const state: EnterprisePressureState = Object.freeze({
    activePressureSignals: Object.freeze(signals),
    saturationRegions: Object.freeze([...saturationRegions]),
    fragilityHotspots: Object.freeze(fragilityHotspots),
    regionAccumulations: Object.freeze(adjustedAccumulations),
    propagationRecords: Object.freeze(propagationRecords),
    systemicPressureScore,
    cascadeRiskScore,
    pressureStabilityLabel,
  });

  const semantics = buildExecutivePressureSemantics({ state, propagationRecords });
  const fingerprint = stableStringify({
    content: pendingFingerprint,
    pressureStateId,
    signalIds: signals.map((s) => s.signalId),
    hotspots: fragilityHotspots.map((h) => h.hotspotId),
    systemicPressureScore,
    cascadeRiskScore,
    pressureStabilityLabel,
  });

  const snapshot: EnterprisePressureSnapshot = Object.freeze({
    pressureStateId,
    topologyId: topology.topologyId,
    flowStateId: input.flowState ? `flow::${topology.topologyId}::${tick}` : undefined,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      saturationSummaries: Object.freeze([...semantics.saturationSummaries]),
      hotspotSummaries: Object.freeze([...semantics.hotspotSummaries]),
      propagationSummaries: Object.freeze([...semantics.propagationSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: pressureBuiltAt(tick),
  });

  const panelContract = buildPressurePanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezeEnterprisePressureSnapshot(
  snapshot: EnterprisePressureSnapshot
): EnterprisePressureSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activePressureSignals: Object.freeze(
        snapshot.state.activePressureSignals.map((s) => Object.freeze({ ...s }))
      ),
      saturationRegions: Object.freeze([...snapshot.state.saturationRegions]),
      fragilityHotspots: Object.freeze(
        snapshot.state.fragilityHotspots.map((h) => Object.freeze({ ...h }))
      ),
      regionAccumulations: Object.freeze(
        snapshot.state.regionAccumulations.map((a) => Object.freeze({ ...a }))
      ),
      propagationRecords: Object.freeze(
        snapshot.state.propagationRecords.map((r) => Object.freeze({ ...r }))
      ),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
