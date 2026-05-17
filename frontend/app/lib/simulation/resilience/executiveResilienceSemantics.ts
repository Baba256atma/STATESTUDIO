/**
 * D7:3:8 — Executive-readable human-system resilience semantics.
 */

import type {
  ExecutiveResilienceSemantics,
  HumanSystemResilienceState,
} from "./humanSystemResilienceTypes.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";

function regionLabel(regionId: string): string {
  return CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ?? regionId;
}

export function buildExecutiveResilienceSemantics(input: {
  state: HumanSystemResilienceState;
}): ExecutiveResilienceSemantics {
  const recoveryAdaptive = input.state.activeResilienceSignals.find(
    (s) => s.signalId === "resilience::executive-recovery-adaptation"
  );
  const logisticsFragility = input.state.activeResilienceSignals.find(
    (s) => s.signalId === "resilience::logistics-stabilization-fragility"
  );
  const topBottleneck = input.state.resilienceBottlenecks[0];

  const headline =
    recoveryAdaptive && logisticsFragility
      ? "Human-system resilience remains adaptive across executive recovery coordination, but resilience fragility is increasing within logistics stabilization systems under sustained dependency pressure."
      : input.state.resilienceStabilityLabel === "adaptive"
        ? "Enterprise human-system resilience is adaptive with synchronized operational recovery and coordination capacity."
        : topBottleneck
          ? topBottleneck.reason
          : input.state.resilienceStabilityLabel === "fragile"
            ? "Human-system resilience fragility is elevating collapse risk under coordinated operational and trust pressure."
            : input.state.resilienceStabilityLabel === "recovering"
              ? "Human-system adaptation is recovering as leadership and operational systems stabilize together."
              : "Human-system resilience remains strained with uneven adaptation across operational regions.";

  const summaryParts: string[] = [];
  if (input.state.resilienceStabilityLabel === "adaptive") {
    summaryParts.push(
      "Leadership coordination and operational recovery systems are adapting together under enterprise stress."
    );
  } else if (input.state.resilienceStabilityLabel === "stable") {
    summaryParts.push(
      "Human-system resilience is stable with contained degradation across key operational domains."
    );
  } else if (input.state.resilienceStabilityLabel === "recovering") {
    summaryParts.push(
      "Adaptive recovery synchronization is rebuilding resilience across human and operational systems."
    );
  } else if (input.state.resilienceStabilityLabel === "fragile") {
    summaryParts.push(
      "Trust degradation, coordination overload, and operational fragility are escalating resilience collapse risk."
    );
  } else {
    summaryParts.push(
      "Resilience fatigue and adaptation instability are present in parts of the enterprise structure."
    );
  }
  summaryParts.push(
    `Enterprise resilience is ${(input.state.enterpriseResilienceScore * 100).toFixed(0)}% with human-system adaptation at ${(input.state.humanSystemAdaptationLevel * 100).toFixed(0)}%.`
  );

  const signalSummaries = input.state.activeResilienceSignals.slice(0, 6).map((s) => {
    const regions = s.affectedRegionIds.map(regionLabel).join(", ");
    const drivers = (s.dominantResilienceDrivers ?? []).join(", ") || "operational_adaptation";
    return `${regions}: ${s.resilienceState} resilience (${drivers}).`;
  });

  const adaptationSummaries = input.state.adaptiveCoordinationRecords
    .slice(0, 4)
    .map((r) => r.explanation);
  const bottleneckSummaries = input.state.resilienceBottlenecks.map((b) => b.reason);
  const crossDomainSummaries = input.state.crossDomainResilienceRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (topBottleneck) bullets.push(topBottleneck.reason);
  if (input.state.resilienceFragilityZones.length > 0) {
    bullets.push(
      `Resilience fragility zones: ${input.state.resilienceFragilityZones.map(regionLabel).join(", ")}.`
    );
  }

  return {
    headline,
    summary: summaryParts.join(" "),
    signalSummaries,
    adaptationSummaries,
    bottleneckSummaries,
    crossDomainSummaries,
    bullets,
  };
}
