/**
 * D7:3:2 — Executive alignment and friction modeling.
 */

import type { HumanActorSimulationState } from "../actors/humanActorTypes.ts";
import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { OrganizationalRecoveryState } from "../recovery/recoveryCapacityTypes.ts";
import type {
  ExecutiveCoordinationSignal,
  ExecutiveCoordinationStateLabel,
} from "./coordinationDynamicsTypes.ts";
import { logCoordinationDev } from "./coordinationDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function coordinationStateFromScores(
  alignment: number,
  friction: number
): ExecutiveCoordinationStateLabel {
  if (alignment >= 0.6 && friction < 0.4) return "aligned";
  if (alignment >= 0.5 && friction < 0.55) return "recovering";
  if (friction >= 0.65) return "fragmented";
  return "strained";
}

export function deriveExecutiveCoordinationSignals(input: {
  actorState: HumanActorSimulationState;
  communicationDelayFactor?: number;
}): ExecutiveCoordinationSignal[] {
  const signals: ExecutiveCoordinationSignal[] = [];
  const executives = input.actorState.activeActors.filter((a) => a.role === "executive");
  const managers = input.actorState.activeActors.filter((a) => a.role === "manager");
  const coordinators = input.actorState.activeActors.filter((a) => a.role === "coordinator");
  const delay = clamp01(input.communicationDelayFactor ?? 0);

  const execManagerPairs: Array<{ ids: string[]; regions: string[] }> = [];
  for (const exec of executives) {
    for (const mgr of managers) {
      const shared = exec.assignedRegionIds.filter((r) => mgr.assignedRegionIds.includes(r));
      if (shared.length > 0 || exec.assignedRegionIds.length > 0) {
        execManagerPairs.push({
          ids: [exec.actorId, mgr.actorId],
          regions: [...new Set([...exec.assignedRegionIds, ...mgr.assignedRegionIds])].sort(),
        });
      }
    }
  }

  for (const pair of execManagerPairs) {
    const actors = input.actorState.activeActors.filter((a) => pair.ids.includes(a.actorId));
    const avgCoordination =
      actors.reduce((s, a) => s + a.coordinationContribution, 0) / Math.max(1, actors.length);
    const alignment = clamp01(avgCoordination - delay * 0.15);
    const friction = clamp01(input.actorState.coordinationPressure + delay * 0.2 - alignment * 0.3);
    const state = coordinationStateFromScores(alignment, friction);

    signals.push(
      Object.freeze({
        signalId: `coordination::${pair.ids.join("+")}`,
        participatingActorIds: Object.freeze([...pair.ids].sort()),
        coordinationState: state,
        intensity: clamp01(Math.abs(alignment - friction) + 0.2),
        affectedRegionIds: Object.freeze(pair.regions),
        executiveLabel: `Executive-management coordination is ${state} across ${pair.regions.join(", ")}`,
      })
    );
  }

  if (coordinators.length > 0) {
    const coord = coordinators[0]!;
    const alignment = clamp01(coord.coordinationContribution - delay * 0.1);
    signals.push(
      Object.freeze({
        signalId: `coordination::${coord.actorId}::cross-domain`,
        participatingActorIds: Object.freeze([coord.actorId]),
        coordinationState: coordinationStateFromScores(alignment, input.actorState.coordinationPressure),
        intensity: clamp01(coord.influenceLevel),
        affectedRegionIds: Object.freeze([...coord.assignedRegionIds].sort()),
        executiveLabel: "Cross-domain coordination lead synchronizes operational handoffs",
      })
    );
  }

  logCoordinationDev("Coordination", { signalCount: signals.length });
  return signals.sort((a, b) => a.signalId.localeCompare(b.signalId));
}

export function calculateExecutiveAlignmentScore(input: {
  actorState: HumanActorSimulationState;
  signals: readonly ExecutiveCoordinationSignal[];
}): number {
  const executives = input.actorState.activeActors.filter((a) => a.role === "executive");
  const execAlignment =
    executives.length === 0
      ? input.actorState.organizationalAlignmentScore
      : executives.reduce((s, a) => s + a.coordinationContribution, 0) / executives.length;
  const signalAlignment =
    input.signals.length === 0
      ? 0.5
      : input.signals.filter((s) => s.coordinationState === "aligned" || s.coordinationState === "recovering")
          .length / input.signals.length;

  const score = clamp01(execAlignment * 0.55 + signalAlignment * 0.3 + input.actorState.organizationalAlignmentScore * 0.15);
  logCoordinationDev("ExecutiveAlignment", { executiveAlignmentScore: score });
  return score;
}

export function calculateCoordinationFrictionScore(input: {
  actorState: HumanActorSimulationState;
  signals: readonly ExecutiveCoordinationSignal[];
  communicationDelayFactor?: number;
}): number {
  const fragmentedRatio =
    input.signals.length === 0
      ? 0
      : input.signals.filter((s) => s.coordinationState === "fragmented").length / input.signals.length;

  const friction = clamp01(
    input.actorState.coordinationPressure * 0.45 +
      fragmentedRatio * 0.35 +
      (input.communicationDelayFactor ?? 0) * 0.2
  );

  logCoordinationDev("CoordinationFriction", { coordinationFrictionScore: friction });
  return friction;
}

export function calculateOrganizationalSynchronizationScore(input: {
  executiveAlignmentScore: number;
  coordinationFrictionScore: number;
  recoveryState?: OrganizationalRecoveryState;
  momentumState?: EnterpriseMomentumState;
  equilibriumState?: EnterpriseEquilibriumState;
}): number {
  const recoveryFactor = clamp01((input.recoveryState?.stabilizationPotential ?? 0.5) * 0.25);
  const momentumFactor = clamp01((input.momentumState?.organizationalMomentumScore ?? 0.5) * 0.2);
  const equilibriumFactor = clamp01((input.equilibriumState?.equilibriumScore ?? 0.5) * 0.15);

  return clamp01(
    input.executiveAlignmentScore * 0.4 +
      (1 - input.coordinationFrictionScore) * 0.35 +
      recoveryFactor +
      momentumFactor +
      equilibriumFactor
  );
}

export function identifyAlignmentZones(
  signals: readonly ExecutiveCoordinationSignal[]
): readonly string[] {
  const regions = new Set<string>();
  for (const signal of signals) {
    if (signal.coordinationState === "aligned" || signal.coordinationState === "recovering") {
      for (const r of signal.affectedRegionIds) regions.add(r);
    }
  }
  return Object.freeze([...regions].sort());
}

export function identifyFrictionZones(
  signals: readonly ExecutiveCoordinationSignal[]
): readonly string[] {
  const regions = new Set<string>();
  for (const signal of signals) {
    if (signal.coordinationState === "fragmented" || signal.coordinationState === "strained") {
      for (const r of signal.affectedRegionIds) regions.add(r);
    }
  }
  return Object.freeze([...regions].sort());
}

export function classifyCoordinationDynamicsLabel(input: {
  organizationalSynchronizationScore: number;
  coordinationFrictionScore: number;
  actorCoordinationLabel: HumanActorSimulationState["coordinationQualityLabel"];
  recoveryState?: OrganizationalRecoveryState;
  signals?: readonly ExecutiveCoordinationSignal[];
}): import("./coordinationDynamicsTypes.ts").ExecutiveCoordinationState["coordinationDynamicsLabel"] {
  if (
    input.organizationalSynchronizationScore >= 0.58 &&
    input.coordinationFrictionScore < 0.45
  ) {
    return "synchronized";
  }
  const hasRecoveringSignals =
    input.signals?.some((s) => s.coordinationState === "recovering") ?? false;
  const recoveryStabilizing = (input.recoveryState?.stabilizationPotential ?? 0) >= 0.45;
  if (
    input.organizationalSynchronizationScore >= 0.48 &&
    input.coordinationFrictionScore < 0.65 &&
    input.actorCoordinationLabel !== "fragmented" &&
    (hasRecoveringSignals || recoveryStabilizing)
  ) {
    return "recovering";
  }
  if (input.coordinationFrictionScore > 0.65 || input.actorCoordinationLabel === "fragmented") {
    return "fragmented";
  }
  return "strained";
}
