/**
 * D7:3:6 — Coordination capacity intelligence.
 */

import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { OrganizationalRecoveryState } from "../recovery/recoveryCapacityTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { CoordinationCapacityRecord, LeadershipLoadSignal } from "./leadershipLoadTypes.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";
import { logLeadershipDev } from "./leadershipDevLog.ts";

function regionLabel(regionId: string): string {
  return CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ?? regionId;
}

export function analyzeCoordinationCapacity(input: {
  topology: OperationalUniverseTopology;
  signals: readonly LeadershipLoadSignal[];
  coordinationCapacityLevel: number;
  leadershipBurdenScore: number;
  recoveryState?: OrganizationalRecoveryState;
  momentumState?: EnterpriseMomentumState;
  equilibriumState?: EnterpriseEquilibriumState;
}): readonly CoordinationCapacityRecord[] {
  const records: CoordinationCapacityRecord[] = [];
  const seen = new Set<string>();

  for (const rel of input.topology.crossDomainRelationships) {
    const key = `${rel.sourceRegionId}|${rel.targetRegionId}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const sourceSignals = input.signals.filter((s) =>
      s.affectedRegionIds.includes(rel.sourceRegionId)
    );
    const targetSignals = input.signals.filter((s) =>
      s.affectedRegionIds.includes(rel.targetRegionId)
    );
    if (sourceSignals.length === 0 && targetSignals.length === 0) continue;

    const allSignals = [...sourceSignals, ...targetSignals];
    const strainedCount = allSignals.filter(
      (s) => s.leadershipLoadState === "strained" || s.leadershipLoadState === "saturated"
    ).length;
    const count = Math.max(1, allSignals.length);

    const capacityLevel = Math.min(
      1,
      Number(
        (
          input.coordinationCapacityLevel * 0.5 -
          (strainedCount / count) * 0.3 -
          input.leadershipBurdenScore * 0.2
        ).toFixed(4)
      )
    );
    const overloadRisk = Math.min(
      1,
      Number(((strainedCount / count) * 0.5 + input.leadershipBurdenScore * 0.5).toFixed(4))
    );

    const explanation =
      capacityLevel >= 0.55
        ? `Coordination capacity between ${regionLabel(rel.sourceRegionId)} and ${regionLabel(rel.targetRegionId)} supports operational resilience.`
        : overloadRisk >= 0.55
          ? `Leadership overload risk across ${regionLabel(rel.sourceRegionId)} → ${regionLabel(rel.targetRegionId)} is constraining coordination capacity.`
          : `Coordination capacity across ${regionLabel(rel.sourceRegionId)} and ${regionLabel(rel.targetRegionId)} remains uneven.`;

    records.push(
      Object.freeze({
        recordId: `capacity::${rel.sourceRegionId}::${rel.targetRegionId}`,
        sourceRegionId: rel.sourceRegionId,
        targetRegionId: rel.targetRegionId,
        capacityLevel: Math.max(0, capacityLevel),
        overloadRisk,
        explanation,
      })
    );
  }

  if (input.recoveryState && input.leadershipBurdenScore > 0.5) {
    records.push(
      Object.freeze({
        recordId: "capacity::recovery-velocity",
        sourceRegionId: "finance",
        targetRegionId: "logistics",
        capacityLevel: Number(
          (
            input.coordinationCapacityLevel * 0.6 +
            (input.recoveryState.stabilizationPotential ?? 0) * 0.4
          ).toFixed(4)
        ),
        overloadRisk: Number(input.leadershipBurdenScore.toFixed(4)),
        explanation:
          "Leadership capacity is coupling to recovery velocity and trust stabilization across dependent regions.",
      })
    );
  }

  if (input.momentumState?.momentumTrendLabel === "accelerating_failure") {
    records.push(
      Object.freeze({
        recordId: "capacity::momentum-equilibrium",
        sourceRegionId: "operations",
        targetRegionId: "strategic_momentum",
        capacityLevel: Number((1 - input.leadershipBurdenScore).toFixed(4)),
        overloadRisk: Number(input.leadershipBurdenScore.toFixed(4)),
        explanation:
          "Leadership saturation is influencing strategic momentum and systemic equilibrium pressure.",
      })
    );
  }

  logLeadershipDev("CoordinationCapacity", { recordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
