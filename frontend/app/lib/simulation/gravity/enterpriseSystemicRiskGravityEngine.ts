/**
 * D7:2:8 — Enterprise systemic risk gravity engine (immutable, non-mutating).
 */

import type {
  EnterpriseRiskGravitySnapshot,
  EnterpriseRiskGravityState,
  EvaluateSystemicRiskGravityInput,
  EvaluateSystemicRiskGravityResult,
  GravityPanelContract,
} from "./systemicRiskGravityTypes.ts";
import { buildRegionalGravityProfiles } from "./regionalGravityModel.ts";
import { clusterSystemicRiskGravityZones } from "./gravityZoneClustering.ts";
import {
  detectInstabilityAttractors,
  identifyConvergenceHotspots,
  identifyRecoverySuppressionZones,
} from "./instabilityAttractionModel.ts";
import {
  calculateGravityConvergenceScore,
  calculateSystemicCollapsePressure,
  classifyGravityRiskLabel,
} from "./systemicCollapsePressureAnalysis.ts";
import { mapCrossDomainGravitationalInfluence } from "./crossDomainGravitationalMapping.ts";
import { analyzeRiskConvergence } from "./riskConvergenceIntelligence.ts";
import {
  buildGravityContentFingerprint,
  detectUnstableGravityLoop,
  guardEvaluateSystemicRiskGravity,
} from "./gravityGuards.ts";
import { buildExecutiveGravitySemantics } from "./executiveGravitySemantics.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";
import { logGravityDev } from "./gravityDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function gravityBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

export function buildGravityPanelContract(input: {
  snapshot: EnterpriseRiskGravitySnapshot;
}): GravityPanelContract {
  const regionLabel = (id: string) =>
    CANONICAL_REGION_LABELS[id as keyof typeof CANONICAL_REGION_LABELS] ?? id;

  const viewHint =
    input.snapshot.state.gravityRiskLabel === "critical"
      ? "collapse_dashboard"
      : input.snapshot.state.instabilityAttractors.length > 0
        ? "instability_attractor_overlay"
        : input.snapshot.state.gravityZones.length > 0
          ? "gravity_heatmap"
          : input.snapshot.state.convergenceRecords.length > 4
            ? "convergence_panel"
            : "gravity_timeline";

  return Object.freeze({
    gravityStateId: input.snapshot.gravityStateId,
    topologyId: input.snapshot.topologyId,
    systemicCollapsePressure: input.snapshot.state.systemicCollapsePressure,
    gravityConvergenceScore: input.snapshot.state.gravityConvergenceScore,
    gravityRiskLabel: input.snapshot.state.gravityRiskLabel,
    zones: Object.freeze(
      input.snapshot.state.gravityZones.map((zone) =>
        Object.freeze({
          zoneId: zone.zoneId,
          label: zone.affectedRegionIds.map(regionLabel).join(" · "),
          gravityLevel: zone.gravityLevel,
          regionCount: zone.affectedRegionIds.length,
        })
      )
    ),
    attractors: Object.freeze(
      input.snapshot.state.instabilityAttractors.map((a) =>
        Object.freeze({
          regionId: a.regionId,
          label: regionLabel(a.regionId),
          severity: a.severity,
          reason: a.reason,
        })
      )
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate enterprise systemic risk gravity (read-only; never mutates upstream state).
 */
export function evaluateSystemicRiskGravity(
  input: EvaluateSystemicRiskGravityInput
): EvaluateSystemicRiskGravityResult {
  const topology = input.topology;
  const equilibriumState = input.equilibriumState;
  const fragilityMap = input.fragilityMap;
  const tick = Math.floor(Number(input.tick ?? input.simulationState?.tick) || 0);
  const gravityStateId = String(
    input.gravityStateId ?? `gravity::${topology.topologyId}::${tick}`
  ).trim();

  const stressFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.03 +
      (input.simulationState?.cumulativeStressFactor ?? 0) * 0.1
  );

  logGravityDev("RiskGravity", {
    gravityStateId,
    topologyId: topology.topologyId,
    tick,
    equilibriumLabel: equilibriumState.equilibriumLabel,
  });

  const profiles = buildRegionalGravityProfiles({
    topology,
    equilibriumState,
    fragilityMap,
    pressureState: input.pressureState,
    momentumState: input.momentumState,
    recoveryState: input.recoveryState,
    flowState: input.flowState,
    regionMetrics: input.regionMetrics,
    stressFactor,
  });

  const gravityZones = clusterSystemicRiskGravityZones({ topology, profiles });
  const convergenceRecords = analyzeRiskConvergence({ topology, profiles });
  const crossDomainRecords = mapCrossDomainGravitationalInfluence({ topology, profiles });
  const instabilityAttractors = detectInstabilityAttractors({
    topology,
    profiles,
    gravityZones,
  });

  const systemicCollapsePressure = calculateSystemicCollapsePressure({
    profiles,
    gravityZones,
    fragilityMap,
    equilibriumState,
    momentumState: input.momentumState,
  });
  const gravityConvergenceScore = calculateGravityConvergenceScore({
    profiles,
    gravityZones,
    convergenceRecordCount: convergenceRecords.length,
  });
  const convergenceHotspots = identifyConvergenceHotspots(profiles);
  const recoverySuppressionZones = identifyRecoverySuppressionZones(profiles);
  const instabilityAttractorRegions = Object.freeze(
    instabilityAttractors.map((a) => a.regionId).sort()
  );

  const equilibriumFingerprint = stableStringify({
    label: equilibriumState.equilibriumLabel,
    score: equilibriumState.equilibriumScore,
  });
  const fragilityFingerprint = stableStringify({
    systemic: fragilityMap.systemicExposureScore,
    collapse: fragilityMap.collapseRiskLabel,
  });
  const pressureFingerprint = input.pressureState
    ? stableStringify({ stability: input.pressureState.pressureStabilityLabel })
    : undefined;
  const momentumFingerprint = input.momentumState
    ? stableStringify({ trend: input.momentumState.momentumTrendLabel })
    : undefined;

  const pendingFingerprint = buildGravityContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    equilibriumFingerprint,
    fragilityFingerprint,
    pressureFingerprint,
    momentumFingerprint,
    tick,
    regionMetricKeys: Object.keys(input.regionMetrics ?? {}),
  });

  const convergenceLoop = detectUnstableGravityLoop(convergenceRecords);
  if (convergenceLoop) {
    logGravityDev("GravityGuard", {
      code: "unstable_gravity_loop",
      cycle: convergenceLoop.join(" -> "),
    });
    return {
      ok: false,
      guard: {
        ok: false,
        code: "unstable_gravity_loop",
        message: `Unstable gravity convergence loop detected: ${convergenceLoop.join(" -> ")}`,
      },
    };
  }

  const guard = guardEvaluateSystemicRiskGravity({
    topologyId: topology.topologyId,
    topologyRegionIds: topology.operationalRegions.map((r) => r.regionId),
    zones: gravityZones,
    convergenceRecordCount: convergenceRecords.length,
    priorGravityFingerprints: input.priorGravityFingerprints,
    pendingFingerprint,
    systemicCollapsePressure,
    gravityConvergenceScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const gravityRiskLabel = classifyGravityRiskLabel({
    systemicCollapsePressure,
    gravityConvergenceScore,
    criticalZoneCount: gravityZones.filter((z) => z.gravityLevel === "critical").length,
    equilibriumLabel: equilibriumState.equilibriumLabel,
  });

  const state: EnterpriseRiskGravityState = Object.freeze({
    gravityZones,
    regionProfiles: Object.freeze(profiles),
    instabilityAttractors,
    crossDomainRecords,
    convergenceRecords,
    systemicCollapsePressure,
    gravityConvergenceScore,
    instabilityAttractorRegions,
    convergenceHotspots,
    recoverySuppressionZones,
    gravityRiskLabel,
  });

  const semantics = buildExecutiveGravitySemantics({ state });
  const fingerprint = stableStringify({
    content: pendingFingerprint,
    gravityStateId,
    zoneIds: gravityZones.map((z) => z.zoneId),
    systemicCollapsePressure,
    gravityRiskLabel,
  });

  const snapshot: EnterpriseRiskGravitySnapshot = Object.freeze({
    gravityStateId,
    topologyId: topology.topologyId,
    equilibriumStateId: `equilibrium::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      zoneSummaries: Object.freeze([...semantics.zoneSummaries]),
      attractorSummaries: Object.freeze([...semantics.attractorSummaries]),
      convergenceSummaries: Object.freeze([...semantics.convergenceSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: gravityBuiltAt(tick),
  });

  const panelContract = buildGravityPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function freezeEnterpriseRiskGravitySnapshot(
  snapshot: EnterpriseRiskGravitySnapshot
): EnterpriseRiskGravitySnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      gravityZones: Object.freeze(snapshot.state.gravityZones.map((z) => Object.freeze({ ...z }))),
      regionProfiles: Object.freeze(snapshot.state.regionProfiles.map((p) => Object.freeze({ ...p }))),
      instabilityAttractors: Object.freeze(
        snapshot.state.instabilityAttractors.map((a) => Object.freeze({ ...a }))
      ),
      crossDomainRecords: Object.freeze(
        snapshot.state.crossDomainRecords.map((r) => Object.freeze({ ...r }))
      ),
      convergenceRecords: Object.freeze(
        snapshot.state.convergenceRecords.map((r) => Object.freeze({ ...r }))
      ),
      instabilityAttractorRegions: Object.freeze([...snapshot.state.instabilityAttractorRegions]),
      convergenceHotspots: Object.freeze([...snapshot.state.convergenceHotspots]),
      recoverySuppressionZones: Object.freeze([...snapshot.state.recoverySuppressionZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
