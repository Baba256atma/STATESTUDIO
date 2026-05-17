/**
 * D7:3:4 — Alignment and resistance propagation modeling.
 */

import type { HumanActorSimulationState } from "../actors/humanActorTypes.ts";
import type { ExecutiveCoordinationState } from "../coordination/coordinationDynamicsTypes.ts";
import type { OrganizationalDecisionFrictionState } from "../friction/decisionFrictionTypes.ts";
import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { OrganizationalRecoveryState } from "../recovery/recoveryCapacityTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type {
  StakeholderInfluenceSignal,
  StakeholderInfluenceStateLabel,
  StakeholderInfluenceState,
} from "./stakeholderInfluenceTypes.ts";
import { logInfluenceDev } from "./influenceDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function influenceStateFromScores(
  support: number,
  resistance: number
): StakeholderInfluenceStateLabel {
  if (support >= 0.62 && resistance < 0.35) return "supportive";
  if (resistance >= 0.65) return "resistant";
  if (support >= 0.48 && resistance < 0.55) return "neutral";
  return "strained";
}

export function deriveStakeholderInfluenceSignals(input: {
  topology: OperationalUniverseTopology;
  actorState: HumanActorSimulationState;
  coordinationState: ExecutiveCoordinationState;
  decisionFrictionState: OrganizationalDecisionFrictionState;
  propagationDelayFactor?: number;
}): StakeholderInfluenceSignal[] {
  const signals: StakeholderInfluenceSignal[] = [];
  const delay = clamp01(input.propagationDelayFactor ?? 0);
  const executives = input.actorState.activeActors.filter((a) => a.role === "executive");
  const stakeholders = input.actorState.activeActors.filter((a) => a.role === "stakeholder");
  const managers = input.actorState.activeActors.filter((a) => a.role === "manager");

  for (const region of input.topology.operationalRegions) {
    const regionActors = input.actorState.activeActors.filter((a) =>
      a.assignedRegionIds.includes(region.regionId)
    );
    const regionExecutives = regionActors.filter((a) => a.role === "executive");
    const regionStakeholders = regionActors.filter((a) => a.role === "stakeholder");
    const inFrictionZone = input.decisionFrictionState.frictionHotspots.includes(region.regionId);
    const inCoordinationAlignment = input.coordinationState.alignmentZones.includes(region.regionId);

    const avgInfluence =
      regionActors.length === 0
        ? 0.5
        : regionActors.reduce((s, a) => s + a.influenceLevel, 0) / regionActors.length;

    const supportBase = clamp01(
      avgInfluence * 0.4 +
        input.actorState.organizationalAlignmentScore * 0.25 +
        (inCoordinationAlignment ? 0.15 : 0) -
        delay * 0.1
    );
    const resistanceBase = clamp01(
      input.decisionFrictionState.strategicResistanceScore * 0.3 +
        input.coordinationState.coordinationFrictionScore * 0.25 +
        (inFrictionZone ? 0.2 : 0) +
        delay * 0.1
    );

    const drivers: string[] = [];
    if (regionExecutives.length > 0) drivers.push("executive_oversight");
    if (regionStakeholders.length > 0) drivers.push("stakeholder_alignment");
    if (inCoordinationAlignment) drivers.push("coordination_reinforcement");
    if (inFrictionZone) drivers.push("execution_resistance");
    if (input.decisionFrictionState.decisionFrictionLabel === "elevated") {
      drivers.push("decision_friction_drag");
    }

    const influenceState = influenceStateFromScores(supportBase, resistanceBase);
    const sourceActorIds = [...regionExecutives, ...regionStakeholders, ...managers]
      .map((a) => a.actorId)
      .sort()
      .slice(0, 8);

    if (sourceActorIds.length === 0 && influenceState === "neutral") continue;

    signals.push(
      Object.freeze({
        signalId: `influence::${region.regionId}`,
        sourceActorIds: Object.freeze(sourceActorIds.length > 0 ? sourceActorIds : executives.map((e) => e.actorId).slice(0, 2)),
        affectedRegionIds: Object.freeze([region.regionId]),
        influenceState,
        intensity: clamp01(Math.abs(supportBase - resistanceBase) + 0.25),
        propagationDrivers: Object.freeze([...new Set(drivers)].sort()),
        executiveLabel: `Stakeholder influence is ${influenceState} in ${region.label}`,
      })
    );
  }

  for (const stakeholder of stakeholders) {
    for (const exec of executives) {
      const shared = stakeholder.assignedRegionIds.filter((r) =>
        exec.assignedRegionIds.includes(r)
      );
      if (shared.length === 0 && stakeholder.assignedRegionIds.length === 0) continue;

      const support = clamp01(
        (stakeholder.influenceLevel + exec.influenceLevel) / 2 -
          input.coordinationState.coordinationFrictionScore * 0.2 -
          delay * 0.1
      );
      const resistance = clamp01(
        input.decisionFrictionState.organizationalDragLevel * 0.4 +
          input.actorState.coordinationPressure * 0.3
      );
      const state = influenceStateFromScores(support, resistance);

      signals.push(
        Object.freeze({
          signalId: `influence::${stakeholder.actorId}+${exec.actorId}`,
          sourceActorIds: Object.freeze([stakeholder.actorId, exec.actorId].sort()),
          affectedRegionIds: Object.freeze(
            [...new Set([...stakeholder.assignedRegionIds, ...exec.assignedRegionIds])].sort()
          ),
          influenceState: state,
          intensity: clamp01(support + resistance * 0.3),
          propagationDrivers: Object.freeze(["strategic_endorsement", "cross_domain_support"]),
          executiveLabel: `Executive-stakeholder influence propagation is ${state} across shared operational domains`,
        })
      );
    }
  }

  if (
    input.coordinationState.coordinationDynamicsLabel === "synchronized" &&
    input.decisionFrictionState.decisionFrictionLabel !== "fluid"
  ) {
    const gapResistance = clamp01(
      input.decisionFrictionState.organizationalDragLevel * 0.5 +
        input.coordinationState.coordinationFrictionScore * 0.3
    );
    signals.push(
      Object.freeze({
        signalId: "influence::alignment-execution-gap",
        sourceActorIds: Object.freeze(executives.map((e) => e.actorId).slice(0, 4)),
        affectedRegionIds: Object.freeze(
          [...input.decisionFrictionState.frictionHotspots].sort().slice(0, 4)
        ),
        influenceState: influenceStateFromScores(0.55, gapResistance),
        intensity: gapResistance,
        propagationDrivers: Object.freeze([
          "executive_alignment",
          "operational_resistance",
          "recovery_slowdown",
        ]),
        executiveLabel:
          "Strong executive alignment exists but operational resistance is slowing influence propagation",
      })
    );
  }

  logInfluenceDev("StakeholderInfluence", { signalCount: signals.length });
  return signals.sort((a, b) => a.signalId.localeCompare(b.signalId));
}

export function calculateOrganizationalAlignmentLevel(input: {
  actorState: HumanActorSimulationState;
  coordinationState: ExecutiveCoordinationState;
  signals: readonly StakeholderInfluenceSignal[];
}): number {
  const supportiveRatio =
    input.signals.length === 0
      ? 0.5
      : input.signals.filter((s) => s.influenceState === "supportive" || s.influenceState === "neutral")
          .length / input.signals.length;

  const score = clamp01(
    input.actorState.organizationalAlignmentScore * 0.35 +
      input.coordinationState.executiveAlignmentScore * 0.35 +
      supportiveRatio * 0.3
  );

  logInfluenceDev("Alignment", { organizationalAlignmentLevel: score });
  return score;
}

export function calculateInfluencePropagationScore(input: {
  signals: readonly StakeholderInfluenceSignal[];
  coordinationState: ExecutiveCoordinationState;
  decisionFrictionState: OrganizationalDecisionFrictionState;
  propagationDelayFactor?: number;
}): number {
  const supportiveIntensity =
    input.signals.length === 0
      ? 0
      : input.signals
          .filter((s) => s.influenceState === "supportive")
          .reduce((s, sig) => s + sig.intensity, 0) / Math.max(1, input.signals.length);

  const score = clamp01(
    supportiveIntensity * 0.35 +
      input.coordinationState.organizationalSynchronizationScore * 0.3 +
      (1 - input.decisionFrictionState.organizationalDragLevel) * 0.2 -
      (input.propagationDelayFactor ?? 0) * 0.15
  );

  logInfluenceDev("InfluencePropagation", { influencePropagationScore: score });
  return score;
}

export function calculateResistanceConcentrationScore(input: {
  signals: readonly StakeholderInfluenceSignal[];
  decisionFrictionState: OrganizationalDecisionFrictionState;
  coordinationState: ExecutiveCoordinationState;
}): number {
  const resistantRatio =
    input.signals.length === 0
      ? 0
      : input.signals.filter((s) => s.influenceState === "resistant" || s.influenceState === "strained")
          .length / input.signals.length;

  const score = clamp01(
    resistantRatio * 0.4 +
      input.decisionFrictionState.strategicResistanceScore * 0.3 +
      input.coordinationState.coordinationFrictionScore * 0.3
  );

  logInfluenceDev("Resistance", { resistanceConcentrationScore: score });
  return score;
}

export function identifyInfluenceHotspots(
  signals: readonly StakeholderInfluenceSignal[]
): readonly string[] {
  const hotspots = new Set<string>();
  for (const signal of signals) {
    if (signal.influenceState === "supportive" && signal.intensity >= 0.5) {
      for (const r of signal.affectedRegionIds) hotspots.add(r);
    }
  }
  return Object.freeze([...hotspots].sort());
}

export function identifyInfluenceResistanceZones(
  signals: readonly StakeholderInfluenceSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.influenceState === "resistant" || signal.influenceState === "strained") {
      for (const r of signal.affectedRegionIds) zones.add(r);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyInfluenceAlignmentZones(
  signals: readonly StakeholderInfluenceSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.influenceState === "supportive" || signal.influenceState === "neutral") {
      for (const r of signal.affectedRegionIds) zones.add(r);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyInfluenceStabilityLabel(input: {
  organizationalAlignmentLevel: number;
  influencePropagationScore: number;
  resistanceConcentrationScore: number;
}): StakeholderInfluenceState["influenceStabilityLabel"] {
  if (
    input.organizationalAlignmentLevel >= 0.58 &&
    input.influencePropagationScore >= 0.55 &&
    input.resistanceConcentrationScore < 0.45
  ) {
    return "stable";
  }
  if (input.resistanceConcentrationScore >= 0.7) {
    return "resistant";
  }
  if (
    input.resistanceConcentrationScore >= 0.5 ||
    input.influencePropagationScore < 0.45
  ) {
    return "fragmented";
  }
  return "strained";
}
