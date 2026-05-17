/**
 * D7:2:6 — Enterprise operational momentum engine (immutable, non-mutating).
 */

import type {
  EnterpriseMomentumSnapshot,
  EnterpriseMomentumState,
  EvaluateOperationalMomentumInput,
  EvaluateOperationalMomentumResult,
  MomentumPanelContract,
} from "./operationalMomentumTypes.ts";
import {
  buildRegionalMomentumProfiles,
  deriveMomentumSignalsFromProfiles,
} from "./regionalMomentumModel.ts";
import {
  calculateOrganizationalMomentumScore,
  calculateRecoveryMomentumScore,
  classifyMomentumTrendLabel,
  identifyAccelerationZones,
  identifyDegradationZones,
  identifyStagnationZones,
} from "./accelerationDegradationModel.ts";
import { calculateOrganizationalInertiaScore } from "./organizationalInertiaAnalysis.ts";
import { analyzeMomentumPropagation } from "./momentumPropagationIntelligence.ts";
import {
  buildMomentumContentFingerprint,
  detectUnstableMomentumLoop,
  guardEvaluateOperationalMomentum,
} from "./momentumGuards.ts";
import { buildExecutiveMomentumSemantics } from "./executiveMomentumSemantics.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";
import { logMomentumDev } from "./momentumDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function momentumBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

export function buildMomentumPanelContract(input: {
  snapshot: EnterpriseMomentumSnapshot;
}): MomentumPanelContract {
  const regionLabel = (id: string) =>
    CANONICAL_REGION_LABELS[id as keyof typeof CANONICAL_REGION_LABELS] ?? id;

  const viewHint =
    input.snapshot.state.degradationZones.length > 0
      ? "acceleration_heatmap"
      : input.snapshot.state.momentumTrendLabel === "recovering"
        ? "stabilization_trend_map"
        : input.snapshot.state.propagationRecords.length > 4
          ? "momentum_timeline"
          : input.snapshot.state.organizationalMomentumScore > 0.55
            ? "velocity_dashboard"
            : "momentum_overlay";

  return Object.freeze({
    momentumStateId: input.snapshot.momentumStateId,
    topologyId: input.snapshot.topologyId,
    organizationalMomentumScore: input.snapshot.state.organizationalMomentumScore,
    recoveryMomentumScore: input.snapshot.state.recoveryMomentumScore,
    momentumTrendLabel: input.snapshot.state.momentumTrendLabel,
    signals: Object.freeze(
      input.snapshot.state.activeMomentumSignals.slice(0, 20).map((signal) =>
        Object.freeze({
          signalId: signal.signalId,
          label: signal.affectedRegionIds.map(regionLabel).join(" · "),
          momentumDirection: signal.momentumDirection,
          intensity: signal.intensity,
        })
      )
    ),
    accelerationZones: Object.freeze(
      input.snapshot.state.accelerationZones.map((id) => regionLabel(id))
    ),
    degradationZones: Object.freeze(
      input.snapshot.state.degradationZones.map((id) => regionLabel(id))
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate enterprise operational momentum (read-only; never mutates upstream state).
 */
export function evaluateOperationalMomentum(
  input: EvaluateOperationalMomentumInput
): EvaluateOperationalMomentumResult {
  const topology = input.topology;
  const recoveryState = input.recoveryState;
  const fragilityMap = input.fragilityMap;
  const tick = Math.floor(Number(input.tick ?? input.simulationState?.tick) || 0);
  const momentumStateId = String(
    input.momentumStateId ?? `momentum::${topology.topologyId}::${tick}`
  ).trim();

  const stressFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.03 +
      (input.simulationState?.cumulativeStressFactor ?? 0) * 0.12 +
      (input.simulationState?.activeEventCount ?? 0) * 0.02
  );

  logMomentumDev("Momentum", {
    momentumStateId,
    topologyId: topology.topologyId,
    tick,
    resilienceLabel: recoveryState.resilienceLabel,
  });

  const profiles = buildRegionalMomentumProfiles({
    topology,
    recoveryState,
    fragilityMap,
    pressureState: input.pressureState,
    flowState: input.flowState,
    regionMetrics: input.regionMetrics,
    stressFactor,
    priorTickMomentumScore: input.simulationState?.priorTickMomentumScore,
  });

  const activeMomentumSignals = deriveMomentumSignalsFromProfiles(profiles);
  const propagationRecords = analyzeMomentumPropagation({
    topology,
    profiles,
    fragilityMap,
  });

  const recoveryMomentumScore = calculateRecoveryMomentumScore(profiles);
  const organizationalMomentumScore = calculateOrganizationalMomentumScore({
    profiles,
    recoveryMomentumScore,
    priorTickMomentumScore: input.simulationState?.priorTickMomentumScore,
  });
  const organizationalInertiaScore = calculateOrganizationalInertiaScore({
    profiles,
    recoveryState,
  });
  const accelerationZones = identifyAccelerationZones(profiles);
  const degradationZones = identifyDegradationZones(profiles);
  const stagnationZones = identifyStagnationZones(profiles);

  const recoveryFingerprint = stableStringify({
    resilience: recoveryState.resilienceScore,
    label: recoveryState.resilienceLabel,
  });
  const fragilityFingerprint = stableStringify({
    systemic: fragilityMap.systemicExposureScore,
    collapse: fragilityMap.collapseRiskLabel,
  });
  const pressureFingerprint = input.pressureState
    ? stableStringify({ stability: input.pressureState.pressureStabilityLabel })
    : undefined;
  const flowFingerprint = input.flowState
    ? stableStringify({ momentum: input.flowState.operationalMomentum })
    : undefined;

  const pendingFingerprint = buildMomentumContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    recoveryFingerprint,
    fragilityFingerprint,
    pressureFingerprint,
    flowFingerprint,
    tick,
    regionMetricKeys: Object.keys(input.regionMetrics ?? {}),
  });

  const propagationLoop = detectUnstableMomentumLoop(propagationRecords);
  if (propagationLoop) {
    logMomentumDev("MomentumGuard", {
      code: "unstable_momentum_loop",
      cycle: propagationLoop.join(" -> "),
    });
    return {
      ok: false,
      guard: {
        ok: false,
        code: "unstable_momentum_loop",
        message: `Unstable momentum propagation loop detected: ${propagationLoop.join(" -> ")}`,
      },
    };
  }

  const guard = guardEvaluateOperationalMomentum({
    topologyId: topology.topologyId,
    topologyRegionIds: topology.operationalRegions.map((r) => r.regionId),
    signals: activeMomentumSignals,
    propagationRecordCount: propagationRecords.length,
    priorMomentumFingerprints: input.priorMomentumFingerprints,
    pendingFingerprint,
    organizationalMomentumScore,
    degradationZoneCount: degradationZones.length,
  });
  if (!guard.ok) return { ok: false, guard };

  const momentumTrendLabel = classifyMomentumTrendLabel({
    organizationalMomentumScore,
    degradationZoneCount: degradationZones.length,
    accelerationZoneCount: accelerationZones.length,
    recoveryMomentumScore,
    collapseRisk: fragilityMap.collapseRiskLabel,
  });

  const state: EnterpriseMomentumState = Object.freeze({
    activeMomentumSignals: Object.freeze(activeMomentumSignals),
    regionProfiles: Object.freeze(profiles),
    propagationRecords,
    organizationalMomentumScore,
    recoveryMomentumScore,
    organizationalInertiaScore,
    accelerationZones,
    degradationZones,
    stagnationZones,
    momentumTrendLabel,
  });

  const semantics = buildExecutiveMomentumSemantics({ state });
  const fingerprint = stableStringify({
    content: pendingFingerprint,
    momentumStateId,
    signalIds: activeMomentumSignals.map((s) => s.signalId),
    organizationalMomentumScore,
    momentumTrendLabel,
  });

  const snapshot: EnterpriseMomentumSnapshot = Object.freeze({
    momentumStateId,
    topologyId: topology.topologyId,
    recoveryStateId: `recovery::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      signalSummaries: Object.freeze([...semantics.signalSummaries]),
      propagationSummaries: Object.freeze([...semantics.propagationSummaries]),
      zoneSummaries: Object.freeze([...semantics.zoneSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: momentumBuiltAt(tick),
  });

  const panelContract = buildMomentumPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function freezeEnterpriseMomentumSnapshot(
  snapshot: EnterpriseMomentumSnapshot
): EnterpriseMomentumSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeMomentumSignals: Object.freeze(
        snapshot.state.activeMomentumSignals.map((s) => Object.freeze({ ...s }))
      ),
      regionProfiles: Object.freeze(snapshot.state.regionProfiles.map((p) => Object.freeze({ ...p }))),
      propagationRecords: Object.freeze(
        snapshot.state.propagationRecords.map((r) => Object.freeze({ ...r }))
      ),
      accelerationZones: Object.freeze([...snapshot.state.accelerationZones]),
      degradationZones: Object.freeze([...snapshot.state.degradationZones]),
      stagnationZones: Object.freeze([...snapshot.state.stagnationZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
