/**
 * D7:2:5 — Organizational recovery capacity engine (immutable, non-mutating).
 */

import type {
  EvaluateRecoveryCapacityInput,
  EvaluateRecoveryCapacityResult,
  OrganizationalRecoverySnapshot,
  OrganizationalRecoveryState,
  RecoveryPanelContract,
} from "./recoveryCapacityTypes.ts";
import { buildRegionalRecoveryProfiles } from "./regionalRecoveryCapacityModel.ts";
import { clusterRecoveryCapacityZones } from "./recoveryZoneClustering.ts";
import { detectRecoveryBottlenecks } from "./recoveryBottleneckAnalysis.ts";
import { analyzeRecoveryPropagation } from "./recoveryPropagationIntelligence.ts";
import {
  buildRecoveryContentFingerprint,
  detectRecursiveRecoveryPropagation,
  guardEvaluateRecoveryCapacity,
} from "./recoveryGuards.ts";
import {
  calculateRecoveryThroughputScore,
  calculateResilienceScore,
  calculateStabilizationPotential,
  classifyResilienceLabel,
} from "./resilienceModeling.ts";
import { buildExecutiveRecoverySemantics } from "./executiveRecoverySemantics.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";
import { logRecoveryDev } from "./recoveryDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function recoveryBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

export function buildRecoveryPanelContract(input: {
  snapshot: OrganizationalRecoverySnapshot;
}): RecoveryPanelContract {
  const regionLabel = (id: string) =>
    CANONICAL_REGION_LABELS[id as keyof typeof CANONICAL_REGION_LABELS] ?? id;

  const viewHint =
    input.snapshot.state.recoveryBottlenecks.length > 0
      ? "stabilization_overlay"
      : input.snapshot.state.recoveryZones.length > 0
        ? "resilience_panel"
        : input.snapshot.state.resilienceScore > 0.55
          ? "resilience_dashboard"
          : input.snapshot.state.propagationRecords.length > 4
            ? "recovery_timeline"
            : "recovery_heatmap";

  return Object.freeze({
    recoveryStateId: input.snapshot.recoveryStateId,
    topologyId: input.snapshot.topologyId,
    resilienceScore: input.snapshot.state.resilienceScore,
    stabilizationPotential: input.snapshot.state.stabilizationPotential,
    resilienceLabel: input.snapshot.state.resilienceLabel,
    zones: Object.freeze(
      input.snapshot.state.recoveryZones.map((zone) =>
        Object.freeze({
          zoneId: zone.zoneId,
          label: zone.affectedRegionIds.map(regionLabel).join(" · "),
          recoveryCapacity: zone.recoveryCapacity,
          regionCount: zone.affectedRegionIds.length,
        })
      )
    ),
    bottlenecks: Object.freeze(
      input.snapshot.state.recoveryBottlenecks.map((b) =>
        Object.freeze({
          regionId: b.regionId,
          label: regionLabel(b.regionId),
          severity: b.severity,
          reason: b.reason,
        })
      )
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate organizational recovery capacity (read-only; never mutates upstream state).
 */
export function evaluateRecoveryCapacity(
  input: EvaluateRecoveryCapacityInput
): EvaluateRecoveryCapacityResult {
  const topology = input.topology;
  const fragilityMap = input.fragilityMap;
  const tick = Math.floor(Number(input.tick ?? input.simulationState?.tick) || 0);
  const recoveryStateId = String(
    input.recoveryStateId ?? `recovery::${topology.topologyId}::${tick}`
  ).trim();

  const stressFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.03 +
      (input.simulationState?.cumulativeStressFactor ?? 0) * 0.12 +
      (input.simulationState?.activeEventCount ?? 0) * 0.02
  );

  logRecoveryDev("Recovery", {
    recoveryStateId,
    topologyId: topology.topologyId,
    tick,
    collapseRisk: fragilityMap.collapseRiskLabel,
  });

  const profiles = buildRegionalRecoveryProfiles({
    topology,
    fragilityMap,
    pressureState: input.pressureState,
    flowState: input.flowState,
    regionMetrics: input.regionMetrics,
    stressFactor,
  });

  const recoveryZones = clusterRecoveryCapacityZones({ topology, profiles });
  const recoveryBottlenecks = detectRecoveryBottlenecks({
    topology,
    profiles,
    regionMetrics: input.regionMetrics,
  });
  const propagationRecords = analyzeRecoveryPropagation({
    topology,
    profiles,
    fragilityMap,
  });

  const resilienceScore = calculateResilienceScore({
    profiles,
    fragilityMap,
    zones: recoveryZones,
  });
  const stabilizationPotential = calculateStabilizationPotential({ profiles, fragilityMap });
  const recoveryThroughputScore = calculateRecoveryThroughputScore(profiles);
  const recoveryBottleneckRegions = Object.freeze(
    recoveryBottlenecks.map((b) => b.regionId).sort()
  );
  const resilienceLabel = classifyResilienceLabel({
    resilienceScore,
    fragilityMap,
    bottleneckCount: recoveryBottlenecks.length,
  });

  const fragilityFingerprint = stableStringify({
    systemic: fragilityMap.systemicExposureScore,
    cascade: fragilityMap.cascadePotentialScore,
    collapse: fragilityMap.collapseRiskLabel,
  });
  const pressureFingerprint = input.pressureState
    ? stableStringify({
        systemic: input.pressureState.systemicPressureScore,
        stability: input.pressureState.pressureStabilityLabel,
      })
    : undefined;
  const flowFingerprint = input.flowState
    ? stableStringify({ momentum: input.flowState.operationalMomentum })
    : undefined;

  const pendingFingerprint = buildRecoveryContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    fragilityFingerprint,
    pressureFingerprint,
    flowFingerprint,
    tick,
    regionMetricKeys: Object.keys(input.regionMetrics ?? {}),
  });

  const propagationCycle = detectRecursiveRecoveryPropagation(propagationRecords);
  if (propagationCycle) {
    logRecoveryDev("RecoveryGuard", {
      code: "recursive_recovery_propagation",
      cycle: propagationCycle.join(" -> "),
    });
    return {
      ok: false,
      guard: {
        ok: false,
        code: "recursive_recovery_propagation",
        message: `Recursive recovery propagation detected: ${propagationCycle.join(" -> ")}`,
      },
    };
  }

  const guard = guardEvaluateRecoveryCapacity({
    topologyId: topology.topologyId,
    topologyRegionIds: topology.operationalRegions.map((r) => r.regionId),
    zones: recoveryZones,
    propagationRecordCount: propagationRecords.length,
    priorRecoveryFingerprints: input.priorRecoveryFingerprints,
    pendingFingerprint,
    resilienceScore,
    stabilizationPotential,
  });
  if (!guard.ok) return { ok: false, guard };

  const state: OrganizationalRecoveryState = Object.freeze({
    recoveryZones,
    regionProfiles: Object.freeze(profiles),
    recoveryBottlenecks,
    propagationRecords,
    resilienceScore,
    stabilizationPotential,
    recoveryThroughputScore,
    recoveryBottleneckRegions,
    resilienceLabel,
  });

  const semantics = buildExecutiveRecoverySemantics({ state });
  const fingerprint = stableStringify({
    content: pendingFingerprint,
    recoveryStateId,
    zoneIds: recoveryZones.map((z) => z.zoneId),
    bottleneckIds: recoveryBottlenecks.map((b) => b.bottleneckId),
    resilienceScore,
    stabilizationPotential,
    resilienceLabel,
  });

  const snapshot: OrganizationalRecoverySnapshot = Object.freeze({
    recoveryStateId,
    topologyId: topology.topologyId,
    fragilityMapId: `fragility::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      zoneSummaries: Object.freeze([...semantics.zoneSummaries]),
      bottleneckSummaries: Object.freeze([...semantics.bottleneckSummaries]),
      propagationSummaries: Object.freeze([...semantics.propagationSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: recoveryBuiltAt(tick),
  });

  const panelContract = buildRecoveryPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function freezeOrganizationalRecoverySnapshot(
  snapshot: OrganizationalRecoverySnapshot
): OrganizationalRecoverySnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      recoveryZones: Object.freeze(snapshot.state.recoveryZones.map((z) => Object.freeze({ ...z }))),
      regionProfiles: Object.freeze(snapshot.state.regionProfiles.map((p) => Object.freeze({ ...p }))),
      recoveryBottlenecks: Object.freeze(
        snapshot.state.recoveryBottlenecks.map((b) => Object.freeze({ ...b }))
      ),
      propagationRecords: Object.freeze(
        snapshot.state.propagationRecords.map((r) => Object.freeze({ ...r }))
      ),
      recoveryBottleneckRegions: Object.freeze([...snapshot.state.recoveryBottleneckRegions]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
