/**
 * D7:3:7 — Executive-readable organizational alignment semantics.
 */

import type {
  ExecutiveAlignmentSemantics,
  OrganizationalAlignmentDriftState,
} from "./alignmentDriftTypes.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";

function regionLabel(regionId: string): string {
  return CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ?? regionId;
}

export function buildExecutiveAlignmentSemantics(input: {
  state: OrganizationalAlignmentDriftState;
}): ExecutiveAlignmentSemantics {
  const recoveryCoherence = input.state.activeAlignmentSignals.find(
    (s) => s.signalId === "alignment::executive-recovery-coherence"
  );
  const logisticsDrift = input.state.activeAlignmentSignals.find(
    (s) => s.signalId === "alignment::logistics-priority-drift"
  );
  const topBottleneck = input.state.alignmentFragmentationBottlenecks[0];

  const headline =
    recoveryCoherence && logisticsDrift
      ? "Strategic alignment remains stable across executive recovery systems, but operational drift is increasing within logistics coordination priorities."
      : input.state.alignmentDriftLabel === "coherent"
        ? "Enterprise strategic alignment remains coherent with stable cross-domain operational synchronization."
        : topBottleneck
          ? topBottleneck.reason
          : input.state.alignmentDriftLabel === "fragmented"
            ? "Organizational fragmentation is elevating coordination divergence and equilibrium instability."
            : input.state.alignmentDriftLabel === "recovering"
              ? "Strategic coherence is recovering as alignment drift stabilizes across key operational regions."
              : "Organizational alignment drift is developing under uneven strategic and operational priorities.";

  const summaryParts: string[] = [];
  if (input.state.alignmentDriftLabel === "coherent") {
    summaryParts.push(
      "Strategic coherence supports recovery momentum, trust stability, and sustainable equilibrium."
    );
  } else if (input.state.alignmentDriftLabel === "recovering") {
    summaryParts.push(
      "Alignment drift is moderating as executive recovery coordination reinforces enterprise coherence."
    );
  } else if (input.state.alignmentDriftLabel === "drifting") {
    summaryParts.push(
      "Gradual alignment erosion is increasing decision friction and coordination divergence."
    );
  } else {
    summaryParts.push(
      "Fragmented priorities are amplifying operational inconsistency and recovery misalignment."
    );
  }
  summaryParts.push(
    `Enterprise alignment is ${(input.state.enterpriseAlignmentScore * 100).toFixed(0)}% with strategic coherence at ${(input.state.strategicCoherenceLevel * 100).toFixed(0)}%.`
  );

  const signalSummaries = input.state.activeAlignmentSignals.slice(0, 6).map((s) => {
    const regions = s.affectedRegionIds.map(regionLabel).join(", ");
    const drivers = (s.dominantAlignmentDrivers ?? []).join(", ") || "operational_sync";
    return `${regions}: ${s.alignmentState} alignment (${drivers}).`;
  });

  const driftSummaries = input.state.driftAccumulationRecords.slice(0, 4).map((r) => r.explanation);
  const bottleneckSummaries = input.state.alignmentFragmentationBottlenecks.map((b) => b.reason);
  const crossDomainSummaries = input.state.crossDomainAlignmentRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (topBottleneck) bullets.push(topBottleneck.reason);
  if (input.state.alignmentDriftZones.length > 0) {
    bullets.push(
      `Alignment drift zones: ${input.state.alignmentDriftZones.map(regionLabel).join(", ")}.`
    );
  }

  return {
    headline,
    summary: summaryParts.join(" "),
    signalSummaries,
    driftSummaries,
    bottleneckSummaries,
    crossDomainSummaries,
    bullets,
  };
}
