/**
 * D7:2:7 — Equilibrium drift analysis (deterministic).
 */

import type { RegionEquilibriumProfile, EquilibriumDriftRecord } from "./equilibriumTypes.ts";
import { logEquilibriumDev } from "./equilibriumDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeEquilibriumDrift(input: {
  profiles: readonly RegionEquilibriumProfile[];
  priorEquilibriumScore?: number;
}): readonly EquilibriumDriftRecord[] {
  const records: EquilibriumDriftRecord[] = [];
  const enterpriseDrift =
    input.priorEquilibriumScore != null
      ? input.priorEquilibriumScore -
        (input.profiles.reduce((s, p) => s + p.balanceScore, 0) /
          Math.max(1, input.profiles.length))
      : 0;

  for (const profile of input.profiles) {
    let driftDirection: EquilibriumDriftRecord["driftDirection"] = "neutral";
    if (profile.driftVelocity >= 0.48 || profile.balanceScore < 0.4) {
      driftDirection = "erosion";
    } else if (profile.balanceScore >= 0.58 && profile.driftVelocity < 0.3) {
      driftDirection = "stabilization";
    }

    const driftMagnitude = clamp01(profile.driftVelocity + Math.max(0, enterpriseDrift) * 0.15);
    if (driftMagnitude < 0.08 && driftDirection === "neutral") continue;

    records.push(
      Object.freeze({
        recordId: `drift::${profile.regionId}`,
        regionId: profile.regionId,
        driftDirection,
        driftMagnitude,
        explanation:
          driftDirection === "erosion"
            ? `Gradual instability drift is eroding equilibrium in ${profile.regionId}.`
            : driftDirection === "stabilization"
              ? `Equilibrium is stabilizing in ${profile.regionId} as recovery offsets pressure.`
              : `Equilibrium drift in ${profile.regionId} remains within neutral bounds.`,
      })
    );
  }

  logEquilibriumDev("EquilibriumDrift", { recordCount: records.length });

  return Object.freeze(records.sort((a, b) => a.regionId.localeCompare(b.regionId)));
}
