/**
 * D7:2:6 — Organizational inertia analysis (deterministic).
 */

import type { OrganizationalRecoveryState } from "../recovery/recoveryCapacityTypes.ts";
import type { RegionMomentumProfile } from "./operationalMomentumTypes.ts";
import { logMomentumDev } from "./momentumDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function calculateOrganizationalInertiaScore(input: {
  profiles: readonly RegionMomentumProfile[];
  recoveryState: OrganizationalRecoveryState;
}): number {
  if (input.profiles.length === 0) return 0.3;
  const avgInertia =
    input.profiles.reduce((s, p) => s + p.inertiaScore, 0) / input.profiles.length;
  const bottleneckDrag = clamp01(input.recoveryState.recoveryBottlenecks.length * 0.08);
  const fragileRecovery =
    input.recoveryState.resilienceLabel === "fragile"
      ? 0.15
      : input.recoveryState.resilienceLabel === "strained"
        ? 0.08
        : 0;

  const score = clamp01(avgInertia * 0.7 + bottleneckDrag + fragileRecovery);

  logMomentumDev("Momentum", { organizationalInertiaScore: score });
  return score;
}
