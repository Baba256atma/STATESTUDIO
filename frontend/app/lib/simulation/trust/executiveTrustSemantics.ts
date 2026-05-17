/**
 * D7:3:5 — Executive-readable organizational trust semantics.
 */

import type {
  ExecutiveTrustSemantics,
  OrganizationalTrustState,
} from "./trustStabilityTypes.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";

function regionLabel(regionId: string): string {
  return CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ?? regionId;
}

export function buildExecutiveTrustSemantics(input: {
  state: OrganizationalTrustState;
}): ExecutiveTrustSemantics {
  const recoveryCoordination = input.state.activeTrustSignals.find(
    (s) => s.signalId === "trust::executive-recovery-coordination"
  );
  const logisticsDegradation = input.state.activeTrustSignals.find(
    (s) => s.signalId === "trust::logistics-dependency-degradation"
  );
  const topBottleneck = input.state.trustBottlenecks[0];

  const headline =
    recoveryCoordination && logisticsDegradation
      ? "Trust stability remains strong across executive recovery coordination, but operational trust degradation is increasing within logistics dependency systems."
      : input.state.trustStabilityLabel === "stable"
        ? "Organizational trust stability supports coordination confidence and operational resilience."
        : topBottleneck
          ? topBottleneck.reason
          : input.state.trustStabilityLabel === "critical"
            ? "Critical trust fragility is elevating coordination collapse risk across operational regions."
            : input.state.trustStabilityLabel === "recovering"
              ? "Trust recovery momentum is rebuilding coordination confidence in parts of the enterprise."
              : "Organizational trust stability remains strained with uneven cross-domain confidence.";

  const summaryParts: string[] = [];
  if (input.state.trustStabilityLabel === "stable") {
    summaryParts.push(
      "Coordination trust and stakeholder alignment reinforce sustainable operational resilience."
    );
  } else if (input.state.trustStabilityLabel === "recovering") {
    summaryParts.push(
      "Recovery leadership is stabilizing trust and improving coordination confidence."
    );
  } else if (input.state.trustStabilityLabel === "degrading") {
    summaryParts.push(
      "Trust erosion is amplifying decision friction and slowing recovery propagation."
    );
  } else if (input.state.trustStabilityLabel === "critical") {
    summaryParts.push(
      "Critical trust instability threatens alignment, momentum, and systemic equilibrium."
    );
  } else {
    summaryParts.push(
      "Trust stability is mixed; some regions retain confidence while others show fragility."
    );
  }
  summaryParts.push(
    `Organizational trust score is ${(input.state.organizationalTrustScore * 100).toFixed(0)}% with degradation at ${(input.state.trustDegradationScore * 100).toFixed(0)}%.`
  );

  const signalSummaries = input.state.activeTrustSignals.slice(0, 6).map((s) => {
    const regions = s.affectedRegionIds.map(regionLabel).join(", ");
    const drivers = (s.dominantTrustDrivers ?? []).join(", ") || "operational_load";
    return `${regions}: ${s.trustState} trust (${drivers}).`;
  });

  const coordinationTrustSummaries = input.state.coordinationTrustRecords
    .slice(0, 4)
    .map((r) => r.explanation);
  const bottleneckSummaries = input.state.trustBottlenecks.map((b) => b.reason);
  const crossDomainSummaries = input.state.crossDomainTrustRecords.slice(0, 4).map((r) => r.explanation);

  const bullets: string[] = [];
  if (topBottleneck) bullets.push(topBottleneck.reason);
  if (input.state.trustFragilityZones.length > 0) {
    bullets.push(
      `Trust fragility zones: ${input.state.trustFragilityZones.map(regionLabel).join(", ")}.`
    );
  }

  return {
    headline,
    summary: summaryParts.join(" "),
    signalSummaries,
    coordinationTrustSummaries,
    bottleneckSummaries,
    crossDomainSummaries,
    bullets,
  };
}
