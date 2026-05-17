/**
 * D7:3:8 — Cross-domain human-system resilience intelligence.
 */

import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { OrganizationalRecoveryState } from "../recovery/recoveryCapacityTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type {
  CrossDomainResilienceRecord,
  HumanSystemResilienceSignal,
} from "./humanSystemResilienceTypes.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";
import { logHumanSystemResilienceDev } from "./humanSystemResilienceDevLog.ts";

function regionLabel(regionId: string): string {
  return CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ?? regionId;
}

export function analyzeCrossDomainResilience(input: {
  topology: OperationalUniverseTopology;
  signals: readonly HumanSystemResilienceSignal[];
  enterpriseResilienceScore: number;
  resilienceDegradationScore: number;
  recoveryState?: OrganizationalRecoveryState;
  momentumState?: EnterpriseMomentumState;
  equilibriumState?: EnterpriseEquilibriumState;
}): readonly CrossDomainResilienceRecord[] {
  const records: CrossDomainResilienceRecord[] = [];
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
    const resilientCount = allSignals.filter(
      (s) =>
        s.resilienceState === "adaptive" ||
        s.resilienceState === "stable" ||
        s.resilienceState === "recovering"
    ).length;
    const fragileCount = allSignals.filter(
      (s) => s.resilienceState === "fragile" || s.resilienceState === "strained"
    ).length;
    const count = Math.max(1, allSignals.length);

    const resilienceScore = Math.min(
      1,
      Number(
        (
          input.enterpriseResilienceScore * 0.45 +
          (resilientCount / count) * 0.35 -
          input.resilienceDegradationScore * 0.2
        ).toFixed(4)
      )
    );
    const fragilityScore = Math.min(
      1,
      Number(((fragileCount / count) * 0.5 + input.resilienceDegradationScore * 0.5).toFixed(4))
    );

    const explanation =
      resilienceScore >= 0.55
        ? `Cross-domain human-system resilience between ${regionLabel(rel.sourceRegionId)} and ${regionLabel(rel.targetRegionId)} supports enterprise survivability.`
        : fragilityScore >= 0.55
          ? `Resilience fragility across ${regionLabel(rel.sourceRegionId)} → ${regionLabel(rel.targetRegionId)} elevates collapse risk under pressure.`
          : `Human-system resilience across ${regionLabel(rel.sourceRegionId)} and ${regionLabel(rel.targetRegionId)} remains mixed.`;

    records.push(
      Object.freeze({
        recordId: `cross-resilience::${rel.sourceRegionId}::${rel.targetRegionId}`,
        sourceRegionId: rel.sourceRegionId,
        targetRegionId: rel.targetRegionId,
        resilienceScore: Math.max(0, resilienceScore),
        fragilityScore,
        explanation,
      })
    );
  }

  if (input.recoveryState && input.enterpriseResilienceScore > 0.5) {
    records.push(
      Object.freeze({
        recordId: "cross-resilience::recovery-amplification",
        sourceRegionId: "finance",
        targetRegionId: "logistics",
        resilienceScore: Number(
          (
            input.enterpriseResilienceScore * 0.55 +
            (input.recoveryState.stabilizationPotential ?? 0) * 0.45
          ).toFixed(4)
        ),
        fragilityScore: Number(input.resilienceDegradationScore.toFixed(4)),
        explanation:
          "Cross-domain recovery synchronization is amplifying human-system resilience adaptation.",
      })
    );
  }

  if (input.equilibriumState && input.resilienceDegradationScore > 0.55) {
    records.push(
      Object.freeze({
        recordId: "cross-resilience::equilibrium-survivability",
        sourceRegionId: "operations",
        targetRegionId: "strategic_equilibrium",
        resilienceScore: Number((1 - input.resilienceDegradationScore).toFixed(4)),
        fragilityScore: Number(input.resilienceDegradationScore.toFixed(4)),
        explanation:
          "Resilience degradation is coupling to systemic equilibrium pressure and enterprise survivability risk.",
      })
    );
  }

  logHumanSystemResilienceDev("HumanSystem", { crossDomainRecordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
