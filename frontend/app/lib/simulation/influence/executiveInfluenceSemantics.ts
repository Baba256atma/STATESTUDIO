/**
 * D7:3:4 — Executive-readable stakeholder influence semantics.
 */

import type {
  ExecutiveInfluenceSemantics,
  StakeholderInfluenceState,
} from "./stakeholderInfluenceTypes.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";

function regionLabel(regionId: string): string {
  return CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ?? regionId;
}

export function buildExecutiveInfluenceSemantics(input: {
  state: StakeholderInfluenceState;
}): ExecutiveInfluenceSemantics {
  const financeStable = input.state.alignmentZones.includes("finance");
  const logisticsStable =
    input.state.alignmentZones.includes("logistics") ||
    input.state.influenceHotspots.includes("logistics");
  const manufacturingResistance = input.state.resistanceZones.includes("manufacturing");
  const topBottleneck = input.state.influenceBottlenecks[0];

  const headline =
    financeStable && logisticsStable && manufacturingResistance
      ? "Stakeholder alignment remains stable across finance and logistics, but operational resistance is increasing within manufacturing recovery coordination."
      : input.state.influenceStabilityLabel === "stable"
        ? "Stakeholder influence propagation supports operational confidence and enterprise stabilization."
        : topBottleneck
          ? topBottleneck.reason
          : input.state.influenceStabilityLabel === "resistant"
            ? "Stakeholder resistance is concentrating across operational regions, elevating friction and recovery delays."
            : "Stakeholder influence propagation remains uneven with mixed alignment and resistance signals.";

  const summaryParts: string[] = [];
  if (input.state.influenceStabilityLabel === "stable") {
    summaryParts.push(
      "Executive and stakeholder alignment reinforce coordination quality and sustainable momentum."
    );
  } else if (input.state.influenceStabilityLabel === "strained") {
    summaryParts.push(
      "Influence propagation is present but constrained by operational resistance in parts of the enterprise."
    );
  } else if (input.state.influenceStabilityLabel === "fragmented") {
    summaryParts.push(
      "Fragmented influence chains are weakening cross-domain support and trust stabilization."
    );
  } else {
    summaryParts.push(
      "Resistance concentration is amplifying decision friction and slowing recovery velocity."
    );
  }
  summaryParts.push(
    `Organizational alignment is ${(input.state.organizationalAlignmentLevel * 100).toFixed(0)}% with influence propagation at ${(input.state.influencePropagationScore * 100).toFixed(0)}%.`
  );

  const signalSummaries = input.state.activeInfluenceSignals.slice(0, 6).map((s) => {
    const regions = s.affectedRegionIds.map(regionLabel).join(", ");
    const actors = s.sourceActorIds.length;
    return `${actors} actor(s) show ${s.influenceState} influence across ${regions}.`;
  });

  const propagationSummaries = input.state.propagationRecords.slice(0, 4).map((r) => r.explanation);
  const bottleneckSummaries = input.state.influenceBottlenecks.map((b) => b.reason);

  const bullets: string[] = [];
  if (topBottleneck) bullets.push(topBottleneck.reason);
  if (input.state.resistanceZones.length > 0) {
    bullets.push(
      `Resistance zones: ${input.state.resistanceZones.map(regionLabel).join(", ")}.`
    );
  }

  return {
    headline,
    summary: summaryParts.join(" "),
    signalSummaries,
    propagationSummaries,
    bottleneckSummaries,
    bullets,
  };
}
