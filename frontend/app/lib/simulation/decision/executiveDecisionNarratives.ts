/**
 * D7:1:7 — Executive-readable decision consequence narratives.
 */

import type {
  DecisionConsequenceTradeoff,
  ExecutiveDecisionConsequenceNarrative,
  StrategicDecisionInput,
  StrategicDecisionType,
} from "./strategicDecisionTypes.ts";
import type { ModeledDecisionImpact } from "./decisionEffectModel.ts";

const TYPE_HEADLINES: Record<StrategicDecisionType, string> = {
  resource_reallocation:
    "Resource reallocation reshapes operational balance across targeted capabilities.",
  risk_mitigation: "Risk mitigation reduces exposure while absorbing moderate execution load.",
  cost_reduction:
    "Reducing operational spending improves short-term efficiency but increases long-term fragility exposure.",
  expansion: "Expansion accelerates growth but elevates operational strain and stabilization risk.",
  stabilization: "Stabilization strengthens resilience at the cost of near-term expansion velocity.",
  operational_pause: "An operational pause relieves pressure but defers throughput and revenue.",
  capacity_increase:
    "Increasing production capacity raises throughput while stressing logistics and stabilization timelines.",
};

export function buildExecutiveDecisionNarrative(input: {
  decision: StrategicDecisionInput;
  modeled: ModeledDecisionImpact;
  tradeoffs: readonly DecisionConsequenceTradeoff[];
  metricsBefore: Readonly<Record<string, number>>;
  metricsAfter: Readonly<Record<string, number>>;
}): ExecutiveDecisionConsequenceNarrative {
  const fragilityDelta = input.metricsAfter.fragility - input.metricsBefore.fragility;
  const loadDelta = input.metricsAfter.operationalLoad - input.metricsBefore.operationalLoad;

  const headline = TYPE_HEADLINES[input.decision.type];
  const summaryParts: string[] = [headline];

  if (fragilityDelta > 0.06) {
    summaryParts.push("Fragility exposure rises materially after this intervention.");
  } else if (fragilityDelta < -0.06) {
    summaryParts.push("Fragility exposure improves under this intervention.");
  }
  if (loadDelta > 0.06) {
    summaryParts.push("Operational load increases as the organization absorbs change.");
  } else if (loadDelta < -0.06) {
    summaryParts.push("Operational load eases in the near term.");
  }
  if (input.decision.expectedOutcome) {
    summaryParts.push(`Expected outcome: ${input.decision.expectedOutcome}`);
  }

  const bullets: string[] = [];
  for (const tradeoff of input.tradeoffs.slice(0, 4)) {
    bullets.push(tradeoff.summary);
  }
  if (input.decision.targetObjectIds.length > 0) {
    bullets.push(
      `Primary operational scope: ${input.decision.targetObjectIds.slice(0, 4).join(", ")}.`
    );
  }

  return {
    headline,
    summary: summaryParts.join(" "),
    benefits: [...input.modeled.benefitThemes],
    costs: [...input.modeled.costThemes],
    bullets,
  };
}
