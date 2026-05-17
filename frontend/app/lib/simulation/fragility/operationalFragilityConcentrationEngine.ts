/**
 * D7:2:4 — Operational fragility concentration engine (immutable, non-mutating).
 */

import type {
  FragilityConcentrationSnapshot,
  FragilityPanelContract,
  MapOperationalFragilityInput,
  MapOperationalFragilityResult,
  OperationalFragilityMap,
} from "./fragilityConcentrationTypes.ts";
import {
  buildRegionalFragilityProfiles,
  identifyConcentrationHotspots,
  identifyCriticalRegions,
} from "./fragilityAccumulationModel.ts";
import { clusterFragilityConcentrationZones } from "./hotspotClusteringModel.ts";
import { mapCrossDomainVulnerabilityCorridors } from "./crossDomainVulnerabilityMapping.ts";
import {
  buildFragilityContentFingerprint,
  guardMapOperationalFragility,
} from "./fragilityGuards.ts";
import {
  calculateCascadePotentialScore,
  calculateConcentrationDensity,
  calculateSystemicExposureScore,
  classifyCollapseRiskLabel,
} from "./systemicExposureAnalysis.ts";
import { buildExecutiveFragilitySemantics } from "./executiveFragilitySemantics.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";
import { logFragilityDev } from "./fragilityDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function fragilityBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

export function buildFragilityPanelContract(input: {
  snapshot: FragilityConcentrationSnapshot;
}): FragilityPanelContract {
  const regionLabel = (id: string) =>
    CANONICAL_REGION_LABELS[id as keyof typeof CANONICAL_REGION_LABELS] ?? id;

  const viewHint =
    input.snapshot.map.fragilityZones.length > 0
      ? "concentration_clusters"
      : input.snapshot.map.vulnerabilityCorridors.length > 2
        ? "systemic_exposure_overlay"
        : input.snapshot.map.criticalRegions.length > 0
          ? "vulnerability_dashboard"
          : input.snapshot.map.systemicExposureScore > 0.5
            ? "fragility_heatmap"
            : "fragility_timeline";

  return Object.freeze({
    fragilityMapId: input.snapshot.fragilityMapId,
    topologyId: input.snapshot.topologyId,
    systemicExposureScore: input.snapshot.map.systemicExposureScore,
    cascadePotentialScore: input.snapshot.map.cascadePotentialScore,
    collapseRiskLabel: input.snapshot.map.collapseRiskLabel,
    zones: Object.freeze(
      input.snapshot.map.fragilityZones.map((zone) =>
        Object.freeze({
          zoneId: zone.zoneId,
          label: zone.affectedRegionIds.map(regionLabel).join(" · "),
          concentrationLevel: zone.concentrationLevel,
          regionCount: zone.affectedRegionIds.length,
        })
      )
    ),
    criticalRegions: Object.freeze(
      input.snapshot.map.criticalRegions.map((id) =>
        Object.freeze({
          regionId: id,
          label: regionLabel(id),
          fragilityScore:
            input.snapshot.map.regionProfiles.find((p) => p.regionId === id)?.fragilityScore ?? 0,
        })
      )
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Map operational fragility concentration (read-only; never mutates topology, flow, or pressure).
 */
export function mapOperationalFragility(
  input: MapOperationalFragilityInput
): MapOperationalFragilityResult {
  const topology = input.topology;
  const tick = Math.floor(Number(input.tick ?? input.simulationState?.tick) || 0);
  const fragilityMapId = String(
    input.fragilityMapId ?? `fragility::${topology.topologyId}::${tick}`
  ).trim();

  const stressFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.03 +
      (input.simulationState?.cumulativeStressFactor ?? 0) * 0.15 +
      (input.simulationState?.activeEventCount ?? 0) * 0.02
  );

  logFragilityDev("FragilityMap", {
    fragilityMapId,
    topologyId: topology.topologyId,
    tick,
    hasPressure: Boolean(input.pressureState),
    hasFlow: Boolean(input.flowState),
  });

  const profiles = buildRegionalFragilityProfiles({
    topology,
    pressureState: input.pressureState,
    flowState: input.flowState,
    regionMetrics: input.regionMetrics,
    stressFactor,
  });

  const zones = clusterFragilityConcentrationZones({ topology, profiles });
  const vulnerabilityCorridors = mapCrossDomainVulnerabilityCorridors({ topology, profiles });
  const concentrationDensity = calculateConcentrationDensity({ profiles, zones });
  const systemicExposureScore = calculateSystemicExposureScore({
    profiles,
    zones,
    concentrationDensity,
  });
  const cascadePotentialScore = calculateCascadePotentialScore({
    profiles,
    zones,
    systemicExposureScore,
  });
  const criticalRegions = identifyCriticalRegions(profiles);
  const concentrationHotspots = identifyConcentrationHotspots(profiles);

  logFragilityDev("FragilityHotspot", {
    hotspotCount: concentrationHotspots.length,
    criticalCount: criticalRegions.length,
  });

  const pressureFingerprint = input.pressureState
    ? stableStringify({
        systemic: input.pressureState.systemicPressureScore,
        cascade: input.pressureState.cascadeRiskScore,
        hotspots: input.pressureState.fragilityHotspots.length,
      })
    : undefined;

  const flowFingerprint = input.flowState
    ? stableStringify({
        momentum: input.flowState.operationalMomentum,
        pressure: input.flowState.flowPressureScore,
      })
    : undefined;

  const pendingFingerprint = buildFragilityContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    pressureFingerprint,
    flowFingerprint,
    tick,
    regionMetricKeys: Object.keys(input.regionMetrics ?? {}),
  });

  const guard = guardMapOperationalFragility({
    topologyId: topology.topologyId,
    topologyRegionIds: topology.operationalRegions.map((r) => r.regionId),
    zones,
    hotspotCount: concentrationHotspots.length,
    priorFragilityFingerprints: input.priorFragilityFingerprints,
    pendingFingerprint,
    systemicExposureScore,
    cascadePotentialScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const collapseRiskLabel = classifyCollapseRiskLabel({
    systemicExposureScore,
    cascadePotentialScore,
    criticalRegionCount: criticalRegions.length,
  });

  const map: OperationalFragilityMap = Object.freeze({
    fragilityZones: zones,
    regionProfiles: Object.freeze(profiles),
    vulnerabilityCorridors,
    systemicExposureScore,
    cascadePotentialScore,
    criticalRegions,
    concentrationHotspots,
    concentrationDensity,
    collapseRiskLabel,
  });

  const semantics = buildExecutiveFragilitySemantics({ map });
  const fingerprint = stableStringify({
    content: pendingFingerprint,
    fragilityMapId,
    zoneIds: zones.map((z) => z.zoneId),
    criticalRegions,
    systemicExposureScore,
    cascadePotentialScore,
    collapseRiskLabel,
  });

  const snapshot: FragilityConcentrationSnapshot = Object.freeze({
    fragilityMapId,
    topologyId: topology.topologyId,
    pressureStateId: input.pressureState ? `pressure::${topology.topologyId}::${tick}` : undefined,
    flowStateId: input.flowState ? `flow::${topology.topologyId}::${tick}` : undefined,
    tick,
    map,
    semantics: Object.freeze({
      ...semantics,
      zoneSummaries: Object.freeze([...semantics.zoneSummaries]),
      corridorSummaries: Object.freeze([...semantics.corridorSummaries]),
      criticalRegionSummaries: Object.freeze([...semantics.criticalRegionSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: fragilityBuiltAt(tick),
  });

  const panelContract = buildFragilityPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function freezeFragilityConcentrationSnapshot(
  snapshot: FragilityConcentrationSnapshot
): FragilityConcentrationSnapshot {
  return Object.freeze({
    ...snapshot,
    map: Object.freeze({
      ...snapshot.map,
      fragilityZones: Object.freeze(snapshot.map.fragilityZones.map((z) => Object.freeze({ ...z }))),
      regionProfiles: Object.freeze(snapshot.map.regionProfiles.map((p) => Object.freeze({ ...p }))),
      vulnerabilityCorridors: Object.freeze(
        snapshot.map.vulnerabilityCorridors.map((c) => Object.freeze({ ...c }))
      ),
      criticalRegions: Object.freeze([...snapshot.map.criticalRegions]),
      concentrationHotspots: Object.freeze([...snapshot.map.concentrationHotspots]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
