/**
 * D7:3:1 — Coordination influence modeling (deterministic).
 */

import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { OrganizationalRecoveryState } from "../recovery/recoveryCapacityTypes.ts";
import type {
  HumanActorSimulationState,
  StrategicHumanActor,
} from "./humanActorTypes.ts";
import { logActorDev } from "./actorDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function calculateCoordinationPressure(input: {
  actors: readonly StrategicHumanActor[];
  momentumState?: EnterpriseMomentumState;
  equilibriumState?: EnterpriseEquilibriumState;
  coordinationLoadFactor?: number;
}): number {
  const actorDensity = clamp01(input.actors.length / 12);
  const managerOverload = clamp01(
    input.actors.filter((a) => a.role === "manager").length * 0.08 +
      input.actors.filter((a) => a.operationalParticipation > 0.7).length * 0.05
  );
  const momentumStrain =
    input.momentumState?.momentumTrendLabel === "accelerating_failure"
      ? 0.2
      : input.momentumState?.momentumTrendLabel === "stagnating"
        ? 0.1
        : 0;
  const imbalanceFactor = clamp01((input.equilibriumState?.imbalanceZones.length ?? 0) * 0.08);
  const load = clamp01(input.coordinationLoadFactor ?? 0);

  const pressure = clamp01(
    actorDensity * 0.25 + managerOverload + momentumStrain + imbalanceFactor + load * 0.3
  );

  logActorDev("Coordination", { coordinationPressure: pressure });
  return pressure;
}

export function calculateOrganizationalAlignmentScore(input: {
  actors: readonly StrategicHumanActor[];
  recoveryState?: OrganizationalRecoveryState;
  equilibriumState?: EnterpriseEquilibriumState;
}): number {
  if (input.actors.length === 0) return 0.45;
  const avgCoordination =
    input.actors.reduce((s, a) => s + a.coordinationContribution, 0) / input.actors.length;
  const executiveBoost = clamp01(
    input.actors.filter((a) => a.role === "executive").reduce((s, a) => s + a.influenceLevel, 0) *
      0.15
  );
  const recoveryFactor = clamp01((input.recoveryState?.resilienceScore ?? 0.5) * 0.25);
  const equilibriumFactor = clamp01((input.equilibriumState?.equilibriumScore ?? 0.5) * 0.2);

  const score = clamp01(avgCoordination * 0.45 + executiveBoost + recoveryFactor + equilibriumFactor);

  logActorDev("OrganizationalAlignment", { organizationalAlignmentScore: score });
  return score;
}

export function calculateActorParticipationIntensity(
  actors: readonly StrategicHumanActor[]
): number {
  if (actors.length === 0) return 0;
  return clamp01(
    actors.reduce((s, a) => s + a.operationalParticipation, 0) / actors.length
  );
}

export function classifyCoordinationQuality(input: {
  coordinationPressure: number;
  organizationalAlignmentScore: number;
}): HumanActorSimulationState["coordinationQualityLabel"] {
  if (input.organizationalAlignmentScore >= 0.58 && input.coordinationPressure < 0.45) {
    return "aligned";
  }
  if (input.coordinationPressure > 0.65 || input.organizationalAlignmentScore < 0.38) {
    return "fragmented";
  }
  return "strained";
}
