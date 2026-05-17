/**
 * D7:3:4 — Cross-domain stakeholder influence propagation intelligence.
 */

import type { HumanActorSimulationState } from "../actors/humanActorTypes.ts";
import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { OrganizationalRecoveryState } from "../recovery/recoveryCapacityTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type {
  InfluencePropagationRecord,
  StakeholderInfluenceSignal,
} from "./stakeholderInfluenceTypes.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";
import { logInfluenceDev } from "./influenceDevLog.ts";

function regionLabel(regionId: string): string {
  return CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ?? regionId;
}

function actorsCoveringRegions(
  actorState: HumanActorSimulationState,
  regionIds: string[]
): string[] {
  return actorState.activeActors
    .filter((a) => regionIds.some((r) => a.assignedRegionIds.includes(r)))
    .map((a) => a.actorId)
    .sort();
}

export function analyzeCrossDomainInfluencePropagation(input: {
  topology: OperationalUniverseTopology;
  actorState: HumanActorSimulationState;
  signals: readonly StakeholderInfluenceSignal[];
  influencePropagationScore: number;
  resistanceConcentrationScore: number;
  propagationDelayFactor?: number;
  momentumState?: EnterpriseMomentumState;
  recoveryState?: OrganizationalRecoveryState;
  equilibriumState?: EnterpriseEquilibriumState;
}): readonly InfluencePropagationRecord[] {
  const records: InfluencePropagationRecord[] = [];
  const seen = new Set<string>();
  const delay = Math.min(1, Math.max(0, input.propagationDelayFactor ?? 0));

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

    const participants = actorsCoveringRegions(input.actorState, [
      rel.sourceRegionId,
      rel.targetRegionId,
    ]);

    const supportiveBoost = [...sourceSignals, ...targetSignals]
      .filter((s) => s.influenceState === "supportive")
      .reduce((s, sig) => s + sig.intensity, 0);
    const resistantDrag = [...sourceSignals, ...targetSignals]
      .filter((s) => s.influenceState === "resistant" || s.influenceState === "strained")
      .reduce((s, sig) => s + sig.intensity, 0);
    const count = Math.max(1, sourceSignals.length + targetSignals.length);

    const propagationStrength = Math.min(
      1,
      Number(
        (
          input.influencePropagationScore * 0.4 +
          supportiveBoost / count * 0.35 -
          delay * 0.15
        ).toFixed(4)
      )
    );
    const resistanceScore = Math.min(
      1,
      Number(
        (
          input.resistanceConcentrationScore * 0.45 +
          resistantDrag / count * 0.35 +
          delay * 0.1
        ).toFixed(4)
      )
    );

    const explanation =
      propagationStrength >= 0.55 && resistanceScore < 0.5
        ? `Stakeholder alignment propagates effectively from ${regionLabel(rel.sourceRegionId)} to ${regionLabel(rel.targetRegionId)}, supporting operational stability.`
        : resistanceScore >= 0.55
          ? `Stakeholder resistance between ${regionLabel(rel.sourceRegionId)} and ${regionLabel(rel.targetRegionId)} is elevating coordination friction and recovery slowdown.`
          : `Influence propagation across ${regionLabel(rel.sourceRegionId)} → ${regionLabel(rel.targetRegionId)} remains uneven under current operational load.`;

    records.push(
      Object.freeze({
        recordId: `propagation::${rel.sourceRegionId}::${rel.targetRegionId}`,
        sourceRegionId: rel.sourceRegionId,
        targetRegionId: rel.targetRegionId,
        propagationStrength,
        resistanceScore,
        participatingActorIds: Object.freeze(participants),
        explanation,
      })
    );
  }

  if (input.momentumState && input.influencePropagationScore > 0.5) {
    records.push(
      Object.freeze({
        recordId: "propagation::momentum-stabilization",
        sourceRegionId: "finance",
        targetRegionId: "operations",
        propagationStrength: Number(input.influencePropagationScore.toFixed(4)),
        resistanceScore: Number(input.resistanceConcentrationScore.toFixed(4)),
        participatingActorIds: Object.freeze(
          input.actorState.activeActors
            .filter((a) => a.role === "executive" || a.role === "stakeholder")
            .map((a) => a.actorId)
            .slice(0, 6)
        ),
        explanation:
          "Cross-domain executive support is contributing to momentum stabilization and reduced dependency pressure.",
      })
    );
  }

  if (input.recoveryState && input.resistanceConcentrationScore > 0.5) {
    records.push(
      Object.freeze({
        recordId: "propagation::recovery-resistance",
        sourceRegionId: "logistics",
        targetRegionId: "manufacturing",
        propagationStrength: Number((1 - input.resistanceConcentrationScore).toFixed(4)),
        resistanceScore: Number(input.resistanceConcentrationScore.toFixed(4)),
        participatingActorIds: Object.freeze([]),
        explanation:
          "Stakeholder resistance is slowing recovery implementation across dependent operational regions.",
      })
    );
  }

  logInfluenceDev("InfluencePropagation", { recordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
