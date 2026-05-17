/**
 * D7:7:7 — Executive-readable enterprise strategic equilibrium semantics.
 */

import type {
  EnterpriseStrategicEquilibriumSemantics,
  EnterpriseStrategicEquilibriumIntelligenceState,
} from "./enterpriseStrategicEquilibriumTypes.ts";
import {
  EQUILIBRIUM_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_EQUILIBRIUM_DISCLAIMER,
} from "./enterpriseStrategicEquilibriumGuards.ts";

export function buildEnterpriseStrategicEquilibriumSemantics(input: {
  state: EnterpriseStrategicEquilibriumIntelligenceState;
}): EnterpriseStrategicEquilibriumSemantics {
  const pressureRecovery = input.state.dynamicBalanceRecords.find((r) =>
    r.recordId.includes("pressure-recovery")
  );
  const governanceDegradation = input.state.equilibriumInstabilityRecords.find((r) =>
    r.recordId.includes("governance-degradation")
  );
  const continuityInstability = input.state.equilibriumInstabilityRecords.find((r) =>
    r.recordId.includes("continuity-instability")
  );

  const headline =
    input.state.executiveEquilibriumLabel === "balanced" ||
    input.state.executiveEquilibriumLabel === "adaptive"
      ? "Enterprise operational equilibrium remains broadly stable across logistics and recovery coordination systems, although governance fragmentation and increasing predictive volatility are beginning to strain long-horizon strategic balance."
      : input.state.executiveEquilibriumLabel === "strained"
        ? continuityInstability
          ? continuityInstability.explanation
          : governanceDegradation
            ? governanceDegradation.explanation
            : "Enterprise strategic equilibrium may be strained as destabilization pressure accumulates across domains."
        : input.state.executiveEquilibriumLabel === "destabilizing"
          ? continuityInstability
            ? continuityInstability.explanation
            : "Equilibrium destabilization may threaten systemic coherence until balance pathways strengthen under executive control."
          : input.state.executiveEquilibriumLabel === "critical"
            ? governanceDegradation
              ? governanceDegradation.explanation
              : "Critical equilibrium conditions may threaten long-horizon strategic continuity under sustained imbalance."
            : pressureRecovery
              ? pressureRecovery.explanation
              : "Enterprise strategic equilibrium remains under active assessment across interconnected systems.";

  const summaryParts: string[] = [];
  if (input.state.executiveEquilibriumLabel === "balanced") {
    summaryParts.push(
      "Balanced equilibrium may indicate dynamic strategic harmony between pressure, adaptation, and recovery."
    );
  } else if (input.state.executiveEquilibriumLabel === "adaptive") {
    summaryParts.push(
      "Adaptive equilibrium may reflect effective rebalancing under changing operational conditions."
    );
  } else if (input.state.executiveEquilibriumLabel === "strained") {
    summaryParts.push(
      "Strained equilibrium may signal rising destabilization pressure with weakening coordination quality."
    );
  } else if (input.state.executiveEquilibriumLabel === "destabilizing") {
    summaryParts.push(
      "Destabilizing equilibrium may elevate continuity risk until systemic balance stabilizes."
    );
  } else {
    summaryParts.push(
      "Critical equilibrium conditions may threaten sustainable strategic continuity until balance recovers under executive control."
    );
  }
  summaryParts.push(
    `Indicative systemic balance is ${(input.state.systemicBalanceScore * 100).toFixed(0)}% with dynamic balance at ${(input.state.dynamicBalanceScore * 100).toFixed(0)}% and destabilization pressure at ${(input.state.destabilizationPressureScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(
    input.state.equilibriumAmbiguityDisclaimer || EQUILIBRIUM_AMBIGUITY_DISCLAIMER
  );
  summaryParts.push(
    input.state.nonAutonomousEquilibriumDisclaimer || NON_AUTONOMOUS_EQUILIBRIUM_DISCLAIMER
  );

  const equilibriumSummaries = input.state.activeEquilibriumSignals.map((s) => {
    const drivers = (s.dominantEquilibriumDrivers ?? []).join(", ") || "equilibrium_drivers";
    return `${s.equilibriumId}: ${s.equilibriumState} (${drivers}, strength ${(s.equilibriumStrength * 100).toFixed(0)}%).`;
  });

  const balanceSummaries = input.state.dynamicBalanceRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const instabilitySummaries = input.state.equilibriumInstabilityRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.stabilizedEquilibriumZones.length > 0) {
    bullets.push(
      `Stabilized equilibrium zones: ${input.state.stabilizedEquilibriumZones.join(", ")}.`
    );
  }
  if (input.state.destabilizedEquilibriumZones.length > 0) {
    bullets.push(
      `Destabilized equilibrium zones: ${input.state.destabilizedEquilibriumZones.join(", ")}.`
    );
  }
  bullets.push(
    "Nexora models pressure, adaptation, balance, and stability; strategic authority remains fully under executive control."
  );

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    equilibriumSummaries: Object.freeze(equilibriumSummaries),
    balanceSummaries: Object.freeze(balanceSummaries),
    instabilitySummaries: Object.freeze(instabilitySummaries),
    bullets: Object.freeze(bullets),
  });
}
