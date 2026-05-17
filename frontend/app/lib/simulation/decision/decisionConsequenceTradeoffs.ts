/**
 * D7:1:7 — Strategic tradeoff consequence analysis (benefits vs costs).
 */

import type {
  DecisionConsequenceTradeoff,
  DecisionConsequenceEffect,
} from "./strategicDecisionTypes.ts";
import type { ModeledDecisionImpact } from "./decisionEffectModel.ts";
import { logDecisionDev } from "./decisionDevLog.ts";

export function analyzeDecisionConsequenceTradeoffs(input: {
  modeled: ModeledDecisionImpact;
  effects: readonly DecisionConsequenceEffect[];
  metricsBefore: Readonly<Record<string, number>>;
  metricsAfter: Readonly<Record<string, number>>;
}): readonly DecisionConsequenceTradeoff[] {
  const tradeoffs: DecisionConsequenceTradeoff[] = [];
  const fragilityDelta = input.metricsAfter.fragility - input.metricsBefore.fragility;
  const loadDelta = input.metricsAfter.operationalLoad - input.metricsBefore.operationalLoad;
  const confidenceDelta = input.metricsAfter.confidence - input.metricsBefore.confidence;

  if (loadDelta > 0.03) {
    tradeoffs.push({
      dimension: "speed",
      improvedAspect: "Operational velocity and throughput headroom",
      worsenedAspect: "Near-term operational strain",
      summary: "Faster growth posture increases operational load pressure.",
    });
  } else if (loadDelta < -0.03) {
    tradeoffs.push({
      dimension: "efficiency",
      improvedAspect: "Short-term efficiency and load relief",
      worsenedAspect: "Expansion velocity",
      summary: "Efficiency gains may slow expansion velocity.",
    });
  }

  if (fragilityDelta > 0.05) {
    tradeoffs.push({
      dimension: "risk_exposure",
      improvedAspect: input.modeled.benefitThemes[0] ?? "Near-term tactical gains",
      worsenedAspect: "Systemic fragility exposure",
      summary: "The decision improves immediate outcomes but increases long-term fragility.",
    });
  } else if (fragilityDelta < -0.05) {
    tradeoffs.push({
      dimension: "stability",
      improvedAspect: "Operational stability and risk containment",
      worsenedAspect: "Aggressive growth potential",
      summary: "Stability improves while aggressive expansion potential is constrained.",
    });
  }

  if (confidenceDelta > 0.03) {
    tradeoffs.push({
      dimension: "resilience",
      improvedAspect: "Executive confidence under stress",
      worsenedAspect: "Resource intensity",
      summary: "Confidence strengthens though execution may require sustained investment.",
    });
  } else if (confidenceDelta < -0.03) {
    tradeoffs.push({
      dimension: "cost",
      improvedAspect: "Cost containment",
      worsenedAspect: "Decision confidence and recovery headroom",
      summary: "Cost-oriented moves can erode confidence and recovery capacity.",
    });
  }

  const stabilization = input.effects[0]?.stabilizationImpact ?? 0;
  if (stabilization > 0.05) {
    tradeoffs.push({
      dimension: "resilience",
      improvedAspect: "Recovery and stabilization progression",
      worsenedAspect: "Speed of expansion",
      summary: "Rapid recovery initiatives may introduce temporary instability before gains land.",
    });
  }

  for (const theme of input.modeled.costThemes) {
    if (!tradeoffs.some((t) => t.worsenedAspect.includes(theme.slice(0, 24)))) {
      tradeoffs.push({
        dimension: "risk_exposure",
        improvedAspect: input.modeled.benefitThemes[0] ?? "Targeted operational improvement",
        worsenedAspect: theme,
        summary: theme,
      });
      break;
    }
  }

  logDecisionDev("DecisionConsequence", {
    tradeoffCount: tradeoffs.length,
    fragilityDelta: Number(fragilityDelta.toFixed(4)),
    loadDelta: Number(loadDelta.toFixed(4)),
  });

  return tradeoffs.sort((a, b) => a.dimension.localeCompare(b.dimension));
}
