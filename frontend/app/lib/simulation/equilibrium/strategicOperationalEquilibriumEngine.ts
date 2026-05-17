/**
 * D7:2:7 — Strategic operational equilibrium engine (immutable, non-mutating).
 */

import type {
  EnterpriseEquilibriumSnapshot,
  EnterpriseEquilibriumState,
  EvaluateOperationalEquilibriumInput,
  EvaluateOperationalEquilibriumResult,
  EquilibriumPanelContract,
} from "./equilibriumTypes.ts";
import {
  buildRegionalEquilibriumProfiles,
  deriveEquilibriumSignalsFromProfiles,
} from "./regionalEquilibriumModel.ts";
import {
  calculateBalanceSustainabilityScore,
  calculateEquilibriumScore,
  calculateInstabilityDriftScore,
  classifyEquilibriumLabel,
  identifyImbalanceZones,
  identifyOverextendedRegions,
  identifyStabilityZones,
} from "./stabilityImbalanceModel.ts";
import { analyzeEquilibriumDrift } from "./equilibriumDriftAnalysis.ts";
import { mapCrossDomainEquilibrium } from "./crossDomainEquilibriumMapping.ts";
import {
  buildEquilibriumContentFingerprint,
  detectUnstableEquilibriumLoop,
  guardEvaluateOperationalEquilibrium,
} from "./equilibriumGuards.ts";
import { buildExecutiveEquilibriumSemantics } from "./executiveEquilibriumSemantics.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";
import { logEquilibriumDev } from "./equilibriumDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function equilibriumBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

export function buildEquilibriumPanelContract(input: {
  snapshot: EnterpriseEquilibriumSnapshot;
}): EquilibriumPanelContract {
  const regionLabel = (id: string) =>
    CANONICAL_REGION_LABELS[id as keyof typeof CANONICAL_REGION_LABELS] ?? id;

  const viewHint =
    input.snapshot.state.equilibriumLabel === "critical_imbalance"
      ? "imbalance_panel"
      : input.snapshot.state.imbalanceZones.length > 0
        ? "stability_heatmap"
        : input.snapshot.state.equilibriumLabel === "balanced"
          ? "equilibrium_dashboard"
          : input.snapshot.state.driftRecords.length > 3
            ? "equilibrium_timeline"
            : "balance_overlay";

  return Object.freeze({
    equilibriumStateId: input.snapshot.equilibriumStateId,
    topologyId: input.snapshot.topologyId,
    equilibriumScore: input.snapshot.state.equilibriumScore,
    balanceSustainabilityScore: input.snapshot.state.balanceSustainabilityScore,
    equilibriumLabel: input.snapshot.state.equilibriumLabel,
    signals: Object.freeze(
      input.snapshot.state.activeEquilibriumSignals.slice(0, 20).map((signal) =>
        Object.freeze({
          signalId: signal.signalId,
          label: signal.affectedRegionIds.map(regionLabel).join(" · "),
          equilibriumState: signal.equilibriumState,
          intensity: signal.intensity,
        })
      )
    ),
    imbalanceZones: Object.freeze(
      input.snapshot.state.imbalanceZones.map((id) => regionLabel(id))
    ),
    stabilityZones: Object.freeze(
      input.snapshot.state.stabilityZones.map((id) => regionLabel(id))
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate strategic operational equilibrium (read-only; never mutates upstream state).
 */
export function evaluateOperationalEquilibrium(
  input: EvaluateOperationalEquilibriumInput
): EvaluateOperationalEquilibriumResult {
  const topology = input.topology;
  const momentumState = input.momentumState;
  const recoveryState = input.recoveryState;
  const fragilityMap = input.fragilityMap;
  const tick = Math.floor(Number(input.tick ?? input.simulationState?.tick) || 0);
  const equilibriumStateId = String(
    input.equilibriumStateId ?? `equilibrium::${topology.topologyId}::${tick}`
  ).trim();

  const stressFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.03 +
      (input.simulationState?.cumulativeStressFactor ?? 0) * 0.1
  );
  const priorEquilibriumScore = input.simulationState?.priorEquilibriumScore;

  logEquilibriumDev("Equilibrium", {
    equilibriumStateId,
    topologyId: topology.topologyId,
    tick,
    momentumTrend: momentumState.momentumTrendLabel,
  });

  const profiles = buildRegionalEquilibriumProfiles({
    topology,
    momentumState,
    recoveryState,
    fragilityMap,
    pressureState: input.pressureState,
    flowState: input.flowState,
    regionMetrics: input.regionMetrics,
    priorEquilibriumScore,
    stressFactor,
  });

  const activeEquilibriumSignals = deriveEquilibriumSignalsFromProfiles(profiles);
  const driftRecords = analyzeEquilibriumDrift({ profiles, priorEquilibriumScore });
  const crossDomainRecords = mapCrossDomainEquilibrium({ topology, profiles });

  const equilibriumScore = calculateEquilibriumScore(profiles);
  const balanceSustainabilityScore = calculateBalanceSustainabilityScore({
    profiles,
    recoveryState,
    momentumState,
    flowMomentum: input.flowState?.operationalMomentum,
  });
  const instabilityDriftScore = calculateInstabilityDriftScore(profiles, fragilityMap);
  const stabilityZones = identifyStabilityZones(profiles);
  const imbalanceZones = identifyImbalanceZones(profiles);
  const overextendedRegions = identifyOverextendedRegions(profiles);

  const momentumFingerprint = stableStringify({
    trend: momentumState.momentumTrendLabel,
    score: momentumState.organizationalMomentumScore,
  });
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

  const pendingFingerprint = buildEquilibriumContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    momentumFingerprint,
    recoveryFingerprint,
    fragilityFingerprint,
    pressureFingerprint,
    tick,
    regionMetricKeys: Object.keys(input.regionMetrics ?? {}),
  });

  const crossDomainLoop = detectUnstableEquilibriumLoop(crossDomainRecords);
  if (crossDomainLoop) {
    logEquilibriumDev("EquilibriumGuard", {
      code: "unstable_equilibrium_loop",
      cycle: crossDomainLoop.join(" -> "),
    });
    return {
      ok: false,
      guard: {
        ok: false,
        code: "unstable_equilibrium_loop",
        message: `Unstable equilibrium propagation loop detected: ${crossDomainLoop.join(" -> ")}`,
      },
    };
  }

  const guard = guardEvaluateOperationalEquilibrium({
    topologyId: topology.topologyId,
    topologyRegionIds: topology.operationalRegions.map((r) => r.regionId),
    signals: activeEquilibriumSignals,
    driftRecordCount: driftRecords.length,
    priorEquilibriumFingerprints: input.priorEquilibriumFingerprints,
    pendingFingerprint,
    equilibriumScore,
    instabilityDriftScore,
    priorEquilibriumScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const equilibriumLabel = classifyEquilibriumLabel({
    equilibriumScore,
    instabilityDriftScore,
    imbalanceZoneCount: imbalanceZones.length,
    momentumTrend: momentumState.momentumTrendLabel,
    collapseRisk: fragilityMap.collapseRiskLabel,
  });

  const state: EnterpriseEquilibriumState = Object.freeze({
    activeEquilibriumSignals: Object.freeze(activeEquilibriumSignals),
    regionProfiles: Object.freeze(profiles),
    driftRecords,
    crossDomainRecords,
    equilibriumScore,
    balanceSustainabilityScore,
    instabilityDriftScore,
    stabilityZones,
    imbalanceZones,
    overextendedRegions,
    equilibriumLabel,
  });

  const semantics = buildExecutiveEquilibriumSemantics({ state });
  const fingerprint = stableStringify({
    content: pendingFingerprint,
    equilibriumStateId,
    signalIds: activeEquilibriumSignals.map((s) => s.signalId),
    equilibriumScore,
    equilibriumLabel,
  });

  const snapshot: EnterpriseEquilibriumSnapshot = Object.freeze({
    equilibriumStateId,
    topologyId: topology.topologyId,
    momentumStateId: `momentum::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      signalSummaries: Object.freeze([...semantics.signalSummaries]),
      driftSummaries: Object.freeze([...semantics.driftSummaries]),
      crossDomainSummaries: Object.freeze([...semantics.crossDomainSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: equilibriumBuiltAt(tick),
  });

  const panelContract = buildEquilibriumPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function freezeEnterpriseEquilibriumSnapshot(
  snapshot: EnterpriseEquilibriumSnapshot
): EnterpriseEquilibriumSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeEquilibriumSignals: Object.freeze(
        snapshot.state.activeEquilibriumSignals.map((s) => Object.freeze({ ...s }))
      ),
      regionProfiles: Object.freeze(snapshot.state.regionProfiles.map((p) => Object.freeze({ ...p }))),
      driftRecords: Object.freeze(snapshot.state.driftRecords.map((r) => Object.freeze({ ...r }))),
      crossDomainRecords: Object.freeze(
        snapshot.state.crossDomainRecords.map((r) => Object.freeze({ ...r }))
      ),
      stabilityZones: Object.freeze([...snapshot.state.stabilityZones]),
      imbalanceZones: Object.freeze([...snapshot.state.imbalanceZones]),
      overextendedRegions: Object.freeze([...snapshot.state.overextendedRegions]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
