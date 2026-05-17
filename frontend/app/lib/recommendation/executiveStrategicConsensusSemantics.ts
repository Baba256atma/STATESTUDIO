/**
 * D7:5:9 — Executive-readable strategic consensus semantics.
 */

import type {
  ExecutiveStrategicConsensusSemantics,
  ExecutiveStrategicConsensusState,
} from "./executiveConsensusTypes.ts";
import {
  CONSENSUS_AMBIGUITY_DISCLAIMER,
  NON_MANIPULATION_DISCLAIMER,
} from "./consensusGuards.ts";

export function buildExecutiveStrategicConsensusSemantics(input: {
  state: ExecutiveStrategicConsensusState;
}): ExecutiveStrategicConsensusSemantics {
  const competingPriorities = input.state.consensusFragmentationRecords.find((r) =>
    r.recordId.includes("competing-recovery")
  );
  const alignmentStable = input.state.executiveAlignmentRecords.find((r) =>
    r.recordId.includes("strategic-alignment")
  );
  const topFragmentation = input.state.consensusFragmentationRecords[0];

  const headline =
    input.state.executiveConsensusLabel === "aligned" ||
    input.state.executiveConsensusLabel === "emerging"
      ? "Executive strategic alignment remains stable around dependency-reduction priorities, although restructuring-sequencing disagreements continue to introduce moderate recovery volatility."
      : competingPriorities
        ? competingPriorities.explanation
        : alignmentStable
          ? alignmentStable.explanation
          : topFragmentation
            ? topFragmentation.explanation
            : input.state.executiveConsensusLabel === "critical"
              ? "Critical consensus fragmentation may require executive reconciliation before operational coordination can stabilize."
              : "Executive strategic consensus remains under active assessment across operational pathways.";

  const summaryParts: string[] = [];
  if (input.state.executiveConsensusLabel === "aligned") {
    summaryParts.push(
      "Aligned consensus suggests executive agreement may strengthen recovery coordination and fragility reduction."
    );
  } else if (input.state.executiveConsensusLabel === "emerging") {
    summaryParts.push(
      "Emerging consensus may indicate forming alignment although fragmentation risks remain present."
    );
  } else if (input.state.executiveConsensusLabel === "fragmented") {
    summaryParts.push(
      "Fragmented consensus may reflect competing strategic priorities across restructuring and stabilization pathways."
    );
  } else if (input.state.executiveConsensusLabel === "volatile") {
    summaryParts.push(
      "Volatile consensus may shift as pathway divergence and future fragmentation evolve."
    );
  } else {
    summaryParts.push(
      "Critical consensus conditions may elevate operational volatility until executive alignment improves."
    );
  }
  summaryParts.push(
    `Indicative strategic alignment is ${(input.state.strategicAlignmentScore * 100).toFixed(0)}% with executive coherence at ${(input.state.executiveCoherenceScore * 100).toFixed(0)}% and fragmentation escalation at ${(input.state.fragmentationEscalationScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(input.state.consensusAmbiguityDisclaimer || CONSENSUS_AMBIGUITY_DISCLAIMER);
  summaryParts.push(input.state.nonManipulationDisclaimer || NON_MANIPULATION_DISCLAIMER);

  const consensusSummaries = input.state.activeConsensusSignals.map((c) => {
    const drivers = (c.dominantConsensusDrivers ?? []).join(", ") || "consensus_drivers";
    return `${c.consensusId}: ${c.consensusState} (${drivers}, strength ${(c.consensusStrength * 100).toFixed(0)}%).`;
  });

  const alignmentSummaries = input.state.executiveAlignmentRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const fragmentationSummaries = input.state.consensusFragmentationRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.consensusStabilityZones.length > 0) {
    bullets.push(`Consensus stability zones: ${input.state.consensusStabilityZones.join(", ")}.`);
  }
  if (input.state.fragmentationZones.length > 0) {
    bullets.push(`Fragmentation zones: ${input.state.fragmentationZones.join(", ")}.`);
  }
  bullets.push(
    "Nexora assesses strategic consensus for executive support; alignment decisions remain fully under executive authority."
  );

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    consensusSummaries: Object.freeze(consensusSummaries),
    alignmentSummaries: Object.freeze(alignmentSummaries),
    fragmentationSummaries: Object.freeze(fragmentationSummaries),
    bullets: Object.freeze(bullets),
  });
}
