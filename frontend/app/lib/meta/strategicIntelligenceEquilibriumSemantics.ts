/**
 * D7:8:7 — Executive-readable strategic intelligence equilibrium semantics.
 */

import type {
  StrategicIntelligenceEquilibriumSemantics,
  StrategicIntelligenceEquilibriumIntelligenceState,
} from "./strategicIntelligenceEquilibriumTypes.ts";
import {
  EQUILIBRIUM_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_EQUILIBRIUM_DISCLAIMER,
} from "./strategicIntelligenceEquilibriumGuards.ts";

export function buildStrategicIntelligenceEquilibriumSemantics(input: {
  state: StrategicIntelligenceEquilibriumIntelligenceState;
}): StrategicIntelligenceEquilibriumSemantics {
  const balancePreservation = input.state.longHorizonEquilibriumRecords.find((r) =>
    r.recordId.includes("balance-preservation")
  );
  const destabilizationRisk = input.state.strategicBalanceRecords.find((r) =>
    r.recordId.includes("destabilization-risk")
  );

  const headline =
    input.state.executiveEquilibriumLabel === "balanced" ||
    input.state.executiveEquilibriumLabel === "stabilizing"
      ? balancePreservation && input.state.equilibriumPressureScore >= 0.35
        ? "Enterprise strategic intelligence may remain in equilibrium as resilience coordination and evolution pathways continue balancing long-horizon operational coherence, although predictive volatility is introducing balance strain."
        : "Enterprise strategic intelligence may preserve systemic balance as governance coordination stabilizes long-horizon coherence under executive oversight."
      : input.state.executiveEquilibriumLabel === "strained" ||
          input.state.executiveEquilibriumLabel === "destabilizing"
        ? destabilizationRisk
          ? destabilizationRisk.explanation
          : "Strategic intelligence equilibrium may be strained as optimization pressure and transformation tension accumulate across domains."
        : input.state.executiveEquilibriumLabel === "critical"
          ? "Critical equilibrium conditions may elevate when destabilization risk compounds across governance, resilience, and evolution systems."
          : balancePreservation
            ? balancePreservation.explanation
            : "Strategic intelligence equilibrium remains under active assessment across enterprise cognition systems.";

  const summaryParts: string[] = [];
  if (input.state.executiveEquilibriumLabel === "balanced") {
    summaryParts.push(
      "Balanced equilibrium may indicate strategic intelligence preserves coherence across evolving enterprise realities."
    );
  } else if (input.state.executiveEquilibriumLabel === "stabilizing") {
    summaryParts.push(
      "Stabilizing equilibrium may reflect recovery coordination restoring balance after sustained pressure."
    );
  } else if (input.state.executiveEquilibriumLabel === "strained") {
    summaryParts.push(
      "Strained equilibrium may elevate when balance fatigue weakens long-horizon stabilization pathways."
    );
  } else {
    summaryParts.push(
      "Critical equilibrium conditions may threaten strategic balance until stabilization strengthens under executive control."
    );
  }
  summaryParts.push(
    `Indicative equilibrium coherence is ${(input.state.strategicEquilibriumCoherenceScore * 100).toFixed(0)}% with systemic balance at ${(input.state.systemicBalanceScore * 100).toFixed(0)}% and equilibrium pressure at ${(input.state.equilibriumPressureScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(
    input.state.equilibriumAmbiguityDisclaimer || EQUILIBRIUM_AMBIGUITY_DISCLAIMER
  );
  summaryParts.push(
    input.state.nonAutonomousEquilibriumDisclaimer || NON_AUTONOMOUS_EQUILIBRIUM_DISCLAIMER
  );

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    equilibriumSummaries: Object.freeze(
      input.state.activeEquilibriumSignals.map((s) => {
        const drivers = (s.dominantEquilibriumDrivers ?? []).join(", ") || "equilibrium_drivers";
        return `${s.equilibriumId}: ${s.equilibriumState} (${drivers}, strength ${(s.equilibriumStrength * 100).toFixed(0)}%).`;
      })
    ),
    longHorizonSummaries: Object.freeze(
      input.state.longHorizonEquilibriumRecords.slice(0, 4).map((r) => r.explanation)
    ),
    balanceSummaries: Object.freeze(
      input.state.strategicBalanceRecords.slice(0, 4).map((r) => r.explanation)
    ),
    bullets: Object.freeze([
      ...(input.state.balancedEquilibriumZones.length > 0
        ? [`Balanced equilibrium zones: ${input.state.balancedEquilibriumZones.join(", ")}.`]
        : []),
      ...(input.state.destabilizingEquilibriumZones.length > 0
        ? [
            `Destabilizing equilibrium zones: ${input.state.destabilizingEquilibriumZones.join(", ")}.`,
          ]
        : []),
      "Nexora models strategic balance and systemic equilibrium; strategic authority remains fully under executive control.",
    ]),
  });
}
