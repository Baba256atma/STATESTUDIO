/**
 * D7:3:6 — Executive burden distribution and leadership load modeling.
 */

import type { HumanActorSimulationState } from "../actors/humanActorTypes.ts";
import type { ExecutiveCoordinationState } from "../coordination/coordinationDynamicsTypes.ts";
import type { OrganizationalDecisionFrictionState } from "../friction/decisionFrictionTypes.ts";
import type { StakeholderInfluenceState } from "../influence/stakeholderInfluenceTypes.ts";
import type { OrganizationalTrustState } from "../trust/trustStabilityTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type {
  ExecutiveBurdenRecord,
  LeadershipDynamicsState,
  LeadershipLoadSignal,
  LeadershipLoadStateLabel,
} from "./leadershipLoadTypes.ts";
import { logLeadershipDev } from "./leadershipDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function loadStateFromScores(
  burden: number,
  balance: number
): LeadershipLoadStateLabel {
  if (burden < 0.4 && balance >= 0.55) return "balanced";
  if (burden >= 0.75) return "saturated";
  if (burden >= 0.58) return "strained";
  return "elevated";
}

export function deriveLeadershipLoadSignals(input: {
  topology: OperationalUniverseTopology;
  actorState: HumanActorSimulationState;
  coordinationState: ExecutiveCoordinationState;
  decisionFrictionState: OrganizationalDecisionFrictionState;
  influenceState: StakeholderInfluenceState;
  trustState: OrganizationalTrustState;
  strategicBurdenFactor?: number;
  oversightConcentrationFactor?: number;
}): LeadershipLoadSignal[] {
  const signals: LeadershipLoadSignal[] = [];
  const burdenFactor = clamp01(input.strategicBurdenFactor ?? 0);
  const concentrationFactor = clamp01(input.oversightConcentrationFactor ?? 0);
  const executives = input.actorState.activeActors.filter((a) => a.role === "executive");
  const managers = input.actorState.activeActors.filter((a) => a.role === "manager");

  for (const exec of executives) {
    const regions = [...exec.assignedRegionIds].sort();
    const sharedManagers = managers.filter((m) =>
      m.assignedRegionIds.some((r) => exec.assignedRegionIds.includes(r))
    );

    const burdenBase = clamp01(
      input.actorState.coordinationPressure * 0.25 +
        input.decisionFrictionState.organizationalDragLevel * 0.25 +
        input.coordinationState.coordinationFrictionScore * 0.2 +
        (1 - exec.coordinationContribution) * 0.15 +
        burdenFactor * 0.1 +
        (sharedManagers.length === 0 ? concentrationFactor * 0.15 : 0)
    );
    const balanceHint = clamp01(
      exec.influenceLevel * 0.4 +
        exec.coordinationContribution * 0.35 +
        (sharedManagers.length > 0 ? 0.15 : 0)
    );

    const drivers: string[] = ["executive_oversight"];
    if (sharedManagers.length === 0) drivers.push("single_executive_dependency");
    if (input.decisionFrictionState.decisionFrictionLabel !== "fluid") {
      drivers.push("decision_friction_burden");
    }
    if (input.trustState.trustDegradationScore > 0.5) drivers.push("trust_coordination_pressure");
    if (regions.some((r) => input.decisionFrictionState.frictionHotspots.includes(r))) {
      drivers.push("operational_fragility_oversight");
    }

    const leadershipLoadState = loadStateFromScores(burdenBase, balanceHint);

    signals.push(
      Object.freeze({
        signalId: `leadership::${exec.actorId}`,
        affectedActorIds: Object.freeze([exec.actorId]),
        affectedRegionIds: Object.freeze(regions.length > 0 ? regions : ["finance"]),
        leadershipLoadState,
        intensity: burdenBase,
        dominantLoadDrivers: Object.freeze([...new Set(drivers)].sort()),
        executiveLabel: `Executive leadership load is ${leadershipLoadState} across assigned operational domains`,
      })
    );
  }

  for (const region of input.topology.operationalRegions) {
    const regionExecs = executives.filter((e) => e.assignedRegionIds.includes(region.regionId));
    if (regionExecs.length === 0) continue;

    const avgBurden =
      regionExecs.reduce((s, e) => s + (1 - e.coordinationContribution), 0) / regionExecs.length;
    const regionBurden = clamp01(
      avgBurden * 0.5 +
        input.decisionFrictionState.executionLatencyScore * 0.3 +
        burdenFactor * 0.2
    );

    if (regionBurden < 0.45 && regionExecs.length > 1) continue;

    signals.push(
      Object.freeze({
        signalId: `leadership::region::${region.regionId}`,
        affectedActorIds: Object.freeze(regionExecs.map((e) => e.actorId).sort()),
        affectedRegionIds: Object.freeze([region.regionId]),
        leadershipLoadState: loadStateFromScores(regionBurden, 1 - regionBurden),
        intensity: regionBurden,
        dominantLoadDrivers: Object.freeze(
          regionExecs.length === 1
            ? ["centralized_strategic_burden", "operational_oversight_pressure"]
            : ["coordination_saturation", "strategic_workload_imbalance"]
        ),
        executiveLabel: `Leadership coordination load in ${region.label} is ${loadStateFromScores(regionBurden, 1 - regionBurden)}`,
      })
    );
  }

  if (
    executives.length === 1 &&
    input.decisionFrictionState.organizationalDragLevel > 0.5
  ) {
    const exec = executives[0]!;
    signals.push(
      Object.freeze({
        signalId: "leadership::centralized-dependency",
        affectedActorIds: Object.freeze([exec.actorId]),
        affectedRegionIds: Object.freeze(
          input.topology.operationalRegions.map((r) => r.regionId).sort().slice(0, 4)
        ),
        leadershipLoadState: "saturated",
        intensity: clamp01(
          input.decisionFrictionState.organizationalDragLevel * 0.6 + concentrationFactor * 0.3
        ),
        dominantLoadDrivers: Object.freeze([
          "single_executive_dependency",
          "decision_responsibility_overload",
          "coordination_saturation",
        ]),
        executiveLabel:
          "Centralized strategic burden is amplifying leadership saturation across operational recovery systems",
      })
    );
  }

  logLeadershipDev("LeadershipLoad", { signalCount: signals.length });
  return signals.sort((a, b) => a.signalId.localeCompare(b.signalId));
}

export function buildExecutiveBurdenRecords(input: {
  actorState: HumanActorSimulationState;
  signals: readonly LeadershipLoadSignal[];
}): ExecutiveBurdenRecord[] {
  const records: ExecutiveBurdenRecord[] = [];
  const executives = input.actorState.activeActors.filter((a) => a.role === "executive");

  for (const exec of executives) {
    const execSignals = input.signals.filter((s) => s.affectedActorIds.includes(exec.actorId));
    const avgIntensity =
      execSignals.length === 0
        ? clamp01(1 - exec.coordinationContribution)
        : execSignals.reduce((s, sig) => s + sig.intensity, 0) / execSignals.length;

    const decisionResponsibilityLoad = clamp01(
      avgIntensity * 0.5 +
        exec.influenceLevel * 0.25 +
        input.actorState.coordinationPressure * 0.25
    );

    records.push(
      Object.freeze({
        recordId: `burden::${exec.actorId}`,
        actorId: exec.actorId,
        regionIds: Object.freeze([...exec.assignedRegionIds].sort()),
        burdenScore: avgIntensity,
        decisionResponsibilityLoad,
        explanation:
          avgIntensity >= 0.6
            ? `Decision responsibility load is elevated for executive oversight in ${exec.assignedRegionIds.join(", ") || "enterprise scope"}.`
            : `Executive burden remains within operational capacity across assigned regions.`,
      })
    );
  }

  logLeadershipDev("ExecutiveCapacity", { recordCount: records.length });
  return records.sort((a, b) => a.recordId.localeCompare(b.recordId));
}

export function calculateExecutiveLoadBalanceScore(input: {
  actorState: HumanActorSimulationState;
  signals: readonly LeadershipLoadSignal[];
}): number {
  const executives = input.actorState.activeActors.filter((a) => a.role === "executive");
  if (executives.length === 0) return 0.5;

  const burdens = executives.map((e) => {
    const sig = input.signals.find((s) => s.affectedActorIds.includes(e.actorId));
    return sig?.intensity ?? clamp01(1 - e.coordinationContribution);
  });
  const mean = burdens.reduce((s, b) => s + b, 0) / burdens.length;
  const variance =
    burdens.reduce((s, b) => s + (b - mean) ** 2, 0) / Math.max(1, burdens.length);
  const balance = clamp01(1 - Math.sqrt(variance) - mean * 0.3);

  logLeadershipDev("ExecutiveCapacity", { executiveLoadBalanceScore: balance });
  return balance;
}

export function calculateLeadershipBurdenScore(input: {
  signals: readonly LeadershipLoadSignal[];
  coordinationState: ExecutiveCoordinationState;
  decisionFrictionState: OrganizationalDecisionFrictionState;
}): number {
  const saturatedRatio =
    input.signals.length === 0
      ? 0
      : input.signals.filter(
          (s) => s.leadershipLoadState === "saturated" || s.leadershipLoadState === "strained"
        ).length / input.signals.length;

  const score = clamp01(
    saturatedRatio * 0.4 +
      input.coordinationState.coordinationFrictionScore * 0.3 +
      input.decisionFrictionState.organizationalDragLevel * 0.3
  );

  logLeadershipDev("LeadershipLoad", { leadershipBurdenScore: score });
  return score;
}

export function calculateCoordinationCapacityLevel(input: {
  coordinationState: ExecutiveCoordinationState;
  trustState: OrganizationalTrustState;
  influenceState: StakeholderInfluenceState;
  executiveLoadBalanceScore: number;
}): number {
  const score = clamp01(
    input.coordinationState.organizationalSynchronizationScore * 0.35 +
      input.trustState.organizationalTrustScore * 0.25 +
      input.influenceState.influencePropagationScore * 0.25 +
      input.executiveLoadBalanceScore * 0.15
  );

  logLeadershipDev("CoordinationCapacity", { coordinationCapacityLevel: score });
  return score;
}

export function identifyLeadershipSaturationZones(
  signals: readonly LeadershipLoadSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.leadershipLoadState === "saturated" || signal.leadershipLoadState === "strained") {
      for (const r of signal.affectedRegionIds) zones.add(r);
    }
  }
  if (zones.size > 0) {
    logLeadershipDev("LeadershipSaturation", { regions: [...zones].sort() });
  }
  return Object.freeze([...zones].sort());
}

export function classifyLeadershipDynamicsLabel(input: {
  executiveLoadBalanceScore: number;
  leadershipBurdenScore: number;
  coordinationCapacityLevel: number;
}): LeadershipDynamicsState["leadershipDynamicsLabel"] {
  if (
    input.leadershipBurdenScore < 0.45 &&
    input.executiveLoadBalanceScore >= 0.5 &&
    input.coordinationCapacityLevel >= 0.55
  ) {
    return "balanced";
  }
  if (input.leadershipBurdenScore >= 0.72 || input.coordinationCapacityLevel < 0.35) {
    return "saturated";
  }
  if (input.leadershipBurdenScore >= 0.55) {
    return "strained";
  }
  return "elevated";
}
