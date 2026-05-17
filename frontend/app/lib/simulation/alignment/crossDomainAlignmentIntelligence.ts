/**
 * D7:3:7 — Cross-domain organizational alignment intelligence.
 */

import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { OrganizationalRecoveryState } from "../recovery/recoveryCapacityTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type {
  CrossDomainAlignmentRecord,
  OrganizationalAlignmentSignal,
} from "./alignmentDriftTypes.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";
import { logAlignmentDev } from "./alignmentDevLog.ts";

function regionLabel(regionId: string): string {
  return CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ?? regionId;
}

export function analyzeCrossDomainAlignment(input: {
  topology: OperationalUniverseTopology;
  signals: readonly OrganizationalAlignmentSignal[];
  strategicCoherenceLevel: number;
  alignmentDriftScore: number;
  recoveryState?: OrganizationalRecoveryState;
  momentumState?: EnterpriseMomentumState;
  equilibriumState?: EnterpriseEquilibriumState;
}): readonly CrossDomainAlignmentRecord[] {
  const records: CrossDomainAlignmentRecord[] = [];
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
    const alignedCount = allSignals.filter(
      (s) => s.alignmentState === "aligned" || s.alignmentState === "recovering"
    ).length;
    const fragmentedCount = allSignals.filter(
      (s) => s.alignmentState === "fragmented" || s.alignmentState === "drifting"
    ).length;
    const count = Math.max(1, allSignals.length);

    const coherenceScore = Math.min(
      1,
      Number(
        (
          input.strategicCoherenceLevel * 0.45 +
          (alignedCount / count) * 0.35 -
          input.alignmentDriftScore * 0.2
        ).toFixed(4)
      )
    );
    const divergenceScore = Math.min(
      1,
      Number(((fragmentedCount / count) * 0.5 + input.alignmentDriftScore * 0.5).toFixed(4))
    );

    const explanation =
      coherenceScore >= 0.55
        ? `Cross-domain alignment between ${regionLabel(rel.sourceRegionId)} and ${regionLabel(rel.targetRegionId)} supports enterprise coherence.`
        : divergenceScore >= 0.55
          ? `Coherence drift across ${regionLabel(rel.sourceRegionId)} → ${regionLabel(rel.targetRegionId)} is elevating operational fragmentation.`
          : `Alignment across ${regionLabel(rel.sourceRegionId)} and ${regionLabel(rel.targetRegionId)} remains uneven.`;

    records.push(
      Object.freeze({
        recordId: `cross-alignment::${rel.sourceRegionId}::${rel.targetRegionId}`,
        sourceRegionId: rel.sourceRegionId,
        targetRegionId: rel.targetRegionId,
        coherenceScore: Math.max(0, coherenceScore),
        divergenceScore,
        explanation,
      })
    );
  }

  if (input.recoveryState && input.strategicCoherenceLevel > 0.5) {
    records.push(
      Object.freeze({
        recordId: "cross-alignment::recovery-coherence",
        sourceRegionId: "finance",
        targetRegionId: "logistics",
        coherenceScore: Number(
          (
            input.strategicCoherenceLevel * 0.6 +
            (input.recoveryState.stabilizationPotential ?? 0) * 0.4
          ).toFixed(4)
        ),
        divergenceScore: Number(input.alignmentDriftScore.toFixed(4)),
        explanation:
          "Recovery alignment is propagating strategic coherence across dependent operational regions.",
      })
    );
  }

  if (input.equilibriumState && input.alignmentDriftScore > 0.5) {
    records.push(
      Object.freeze({
        recordId: "cross-alignment::equilibrium-erosion",
        sourceRegionId: "operations",
        targetRegionId: "strategic_equilibrium",
        coherenceScore: Number((1 - input.alignmentDriftScore).toFixed(4)),
        divergenceScore: Number(input.alignmentDriftScore.toFixed(4)),
        explanation:
          "Alignment drift is coupling to systemic equilibrium erosion under fragmented priorities.",
      })
    );
  }

  logAlignmentDev("StrategicCoherence", { crossDomainRecordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
