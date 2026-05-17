/**
 * D7:3:5 — Cross-domain organizational trust stability intelligence.
 */

import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { OrganizationalRecoveryState } from "../recovery/recoveryCapacityTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { CrossDomainTrustRecord, OrganizationalTrustSignal } from "./trustStabilityTypes.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";
import { logTrustDev } from "./trustDevLog.ts";

function regionLabel(regionId: string): string {
  return CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ?? regionId;
}

export function analyzeCrossDomainTrustStability(input: {
  topology: OperationalUniverseTopology;
  signals: readonly OrganizationalTrustSignal[];
  organizationalTrustScore: number;
  trustDegradationScore: number;
  recoveryState?: OrganizationalRecoveryState;
  momentumState?: EnterpriseMomentumState;
  equilibriumState?: EnterpriseEquilibriumState;
}): readonly CrossDomainTrustRecord[] {
  const records: CrossDomainTrustRecord[] = [];
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
    const stableCount = allSignals.filter(
      (s) => s.trustState === "stable" || s.trustState === "recovering"
    ).length;
    const fragileCount = allSignals.filter(
      (s) => s.trustState === "degrading" || s.trustState === "critical"
    ).length;
    const count = Math.max(1, allSignals.length);

    const trustStabilityScore = Math.min(
      1,
      Number(
        (
          input.organizationalTrustScore * 0.35 +
          (stableCount / count) * 0.4 -
          input.trustDegradationScore * 0.25
        ).toFixed(4)
      )
    );
    const fragilityScore = Math.min(
      1,
      Number(((fragileCount / count) * 0.5 + input.trustDegradationScore * 0.5).toFixed(4))
    );

    const explanation =
      trustStabilityScore >= 0.55
        ? `Cross-domain trust stability between ${regionLabel(rel.sourceRegionId)} and ${regionLabel(rel.targetRegionId)} supports operational resilience.`
        : fragilityScore >= 0.55
          ? `Trust fragility across ${regionLabel(rel.sourceRegionId)} → ${regionLabel(rel.targetRegionId)} is elevating coordination risk.`
          : `Trust stability across ${regionLabel(rel.sourceRegionId)} and ${regionLabel(rel.targetRegionId)} remains mixed.`;

    records.push(
      Object.freeze({
        recordId: `cross-trust::${rel.sourceRegionId}::${rel.targetRegionId}`,
        sourceRegionId: rel.sourceRegionId,
        targetRegionId: rel.targetRegionId,
        trustStabilityScore: Math.max(0, trustStabilityScore),
        fragilityScore,
        explanation,
      })
    );
  }

  if (input.recoveryState && input.organizationalTrustScore > 0.5) {
    records.push(
      Object.freeze({
        recordId: "cross-trust::recovery-propagation",
        sourceRegionId: "finance",
        targetRegionId: "logistics",
        trustStabilityScore: Number(
          (
            input.organizationalTrustScore * 0.6 +
            (input.recoveryState.stabilizationPotential ?? 0) * 0.4
          ).toFixed(4)
        ),
        fragilityScore: Number(input.trustDegradationScore.toFixed(4)),
        explanation:
          "Strong recovery leadership is propagating trust stabilization across dependent operational regions.",
      })
    );
  }

  if (input.momentumState?.momentumTrendLabel === "accelerating_failure") {
    records.push(
      Object.freeze({
        recordId: "cross-trust::momentum-erosion",
        sourceRegionId: "operations",
        targetRegionId: "strategic_momentum",
        trustStabilityScore: Number((1 - input.trustDegradationScore).toFixed(4)),
        fragilityScore: Number(input.trustDegradationScore.toFixed(4)),
        explanation:
          "Trust degradation is coupling to momentum instability and systemic equilibrium pressure.",
      })
    );
  }

  logTrustDev("TrustStability", { crossDomainRecordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
