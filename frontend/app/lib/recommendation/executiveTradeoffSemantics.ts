/**
 * D7:5:3 — Executive-readable tradeoff semantics.
 */

import type {
  ExecutiveTradeoffSemantics,
  ExecutiveTradeoffState,
} from "./tradeoffAnalysisTypes.ts";
import {
  NON_SELECTION_DISCLAIMER,
  TRADEOFF_UNCERTAINTY_DISCLAIMER,
} from "./tradeoffGuards.ts";
import { CANONICAL_REGION_LABELS } from "../simulation/topology/operationalUniverseClassification.ts";

function regionLabel(regionId: string): string {
  return CANONICAL_REGION_LABELS[regionId as keyof typeof CANONICAL_REGION_LABELS] ?? regionId;
}

export function buildExecutiveTradeoffSemantics(input: {
  state: ExecutiveTradeoffState;
}): ExecutiveTradeoffSemantics {
  const logisticsRecovery = input.state.activeTradeoffs.find((t) =>
    t.tradeoffId.includes("logistics-recovery")
  );
  const dependencyFlex = input.state.activeTradeoffs.find((t) =>
    t.tradeoffId.includes("dependency-flexibility")
  );
  const recoveryCoord = input.state.activeTradeoffs.find((t) =>
    t.tradeoffId.includes("recovery-coordination")
  );
  const restructuring = input.state.activeTradeoffs.find((t) =>
    t.tradeoffId.includes("restructuring")
  );
  const topCostBenefit = input.state.strategicCostBenefitRecords[0];
  const topObjective = input.state.competingObjectiveRecords[0];

  const headline =
    logisticsRecovery
      ? "Accelerating logistics recovery coordination may significantly reduce future dependency fragility, although short-term leadership load and operational rigidity are likely to increase."
      : dependencyFlex
        ? "Reducing dependency concentration may lower systemic fragility, although operational flexibility and adaptability may be temporarily sacrificed."
        : recoveryCoord
          ? "Accelerating recovery coordination may improve stabilization although leadership load and coordination overhead may increase."
          : restructuring
            ? "Aggressive restructuring may improve long-term resilience although short-term instability risk may rise across manufacturing operations."
            : topCostBenefit
              ? topCostBenefit.explanation
              : topObjective
                ? topObjective.explanation
                : input.state.executiveTradeoffLabel === "favorable"
                  ? "Strategic tradeoffs may favor stabilization benefits relative to operational costs under current conditions."
                  : input.state.executiveTradeoffLabel === "strained"
                    ? "Strained tradeoffs suggest executives may sacrifice flexibility or capacity when pursuing stabilization."
                    : "Executive tradeoff analysis remains under active assessment across competing strategic objectives.";

  const summaryParts: string[] = [];
  if (input.state.executiveTradeoffLabel === "critical") {
    summaryParts.push(
      "Critical tradeoffs highlight high operational costs that may accompany urgent stabilization actions."
    );
  } else if (input.state.executiveTradeoffLabel === "volatile") {
    summaryParts.push(
      "Volatile tradeoffs reflect competing consequences that may shift as operational and predictive conditions evolve."
    );
  } else if (input.state.executiveTradeoffLabel === "favorable") {
    summaryParts.push(
      "Favorable tradeoff balance may indicate benefits outweigh operational costs for some strategic options, without mandating any single path."
    );
  } else if (input.state.executiveTradeoffLabel === "balanced") {
    summaryParts.push(
      "Balanced tradeoffs suggest competing benefits and costs may be comparable across key strategic options."
    );
  } else {
    summaryParts.push(
      "Strained tradeoffs suggest operational sacrifices may be required to achieve stabilization or recovery gains."
    );
  }
  summaryParts.push(
    `Indicative strategic balance is ${(input.state.strategicBalanceScore * 100).toFixed(0)}% with operational cost at ${(input.state.operationalCostScore * 100).toFixed(0)}% and benefit asymmetry at ${(input.state.benefitAsymmetryScore * 100).toFixed(0)}%.`
  );
  summaryParts.push(input.state.uncertaintyDisclaimer || TRADEOFF_UNCERTAINTY_DISCLAIMER);
  summaryParts.push(input.state.nonSelectionDisclaimer || NON_SELECTION_DISCLAIMER);

  const tradeoffSummaries = input.state.activeTradeoffs.slice(0, 6).map((t) => {
    const regions = t.affectedRegionIds.map(regionLabel).join(", ");
    const drivers = (t.dominantTradeoffDrivers ?? []).join(", ") || "competing_objectives";
    return `${regions}: ${t.tradeoffState} tradeoff (${drivers}, strength ${(t.tradeoffStrength * 100).toFixed(0)}%).`;
  });

  const costBenefitSummaries = input.state.strategicCostBenefitRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const competingObjectiveSummaries = input.state.competingObjectiveRecords
    .slice(0, 4)
    .map((r) => r.explanation);

  const bullets: string[] = [];
  if (input.state.benefitZones.length > 0) {
    bullets.push(`Benefit zones: ${input.state.benefitZones.map(regionLabel).join(", ")}.`);
  }
  if (input.state.operationalCostZones.length > 0) {
    bullets.push(
      `Operational cost zones: ${input.state.operationalCostZones.map(regionLabel).join(", ")}.`
    );
  }
  if (input.state.competingObjectiveRecords.length > 0) {
    bullets.push(
      `${input.state.competingObjectiveRecords.length} competing objective tension(s) may influence executive choice.`
    );
  }
  bullets.push("Strategy selection remains under executive control.");

  return Object.freeze({
    headline,
    summary: summaryParts.join(" "),
    tradeoffSummaries: Object.freeze(tradeoffSummaries),
    costBenefitSummaries: Object.freeze(costBenefitSummaries),
    competingObjectiveSummaries: Object.freeze(competingObjectiveSummaries),
    bullets: Object.freeze(bullets),
  });
}
