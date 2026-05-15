import type { ExecutiveInsight } from "../intelligence/executiveInsightTypes.ts";
import type { DecisionRecommendationCategory } from "./decisionRecommendationTypes.ts";

function titleCase(value: string): string {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function normalizeRecommendationFocus(value: unknown): string {
  const text = String(value ?? "").trim().replace(/\s+/g, " ");
  return text.length ? text : "current operational pressure";
}

export function buildDecisionRecommendationTitle(params: {
  category: DecisionRecommendationCategory;
  focus?: string;
}): string {
  const focus = normalizeRecommendationFocus(params.focus);
  switch (params.category) {
    case "stabilize":
      return `Stabilize ${titleCase(focus)}`;
    case "reduce_risk":
      return `Reduce Risk Around ${titleCase(focus)}`;
    case "monitor":
      return `Monitor ${titleCase(focus)}`;
    case "diversify":
      return `Diversify ${titleCase(focus)}`;
    case "optimize":
      return `Optimize ${titleCase(focus)}`;
    case "investigate":
      return `Investigate ${titleCase(focus)}`;
    case "protect":
      return `Protect ${titleCase(focus)}`;
    case "rebalance":
      return `Rebalance ${titleCase(focus)}`;
  }
}

export function buildDecisionRecommendationSummary(params: {
  category: DecisionRecommendationCategory;
  focus?: string;
}): string {
  const focus = normalizeRecommendationFocus(params.focus);
  switch (params.category) {
    case "stabilize":
      return `Stabilize ${focus} before operational pressure expands further.`;
    case "reduce_risk":
      return `Reduce exposure around ${focus} while propagation risk remains visible.`;
    case "monitor":
      return `Keep ${focus} under active review until stronger movement appears.`;
    case "diversify":
      return `Reduce concentration by diversifying ${focus}.`;
    case "optimize":
      return `Improve the operating path around ${focus} without changing core structure.`;
    case "investigate":
      return `Clarify the evidence around ${focus} before committing to a stronger move.`;
    case "protect":
      return `Protect ${focus} from escalation while decision confidence is still forming.`;
    case "rebalance":
      return `Rebalance capacity and ownership around ${focus}.`;
  }
}

export function buildDecisionRecommendationRationale(params: {
  category: DecisionRecommendationCategory;
  focus?: string;
  insight?: ExecutiveInsight | null;
  evidence?: string;
}): string {
  const focus = normalizeRecommendationFocus(params.focus);
  if (params.evidence) return params.evidence;
  if (params.insight?.summary) {
    return `${params.insight.summary} This makes ${focus} the clearest executive focus.`;
  }
  switch (params.category) {
    case "diversify":
      return `Concentration around ${focus} can amplify operational fragility if conditions worsen.`;
    case "monitor":
      return `${focus} does not require commitment yet, but should remain visible to the manager.`;
    case "rebalance":
      return `${focus} appears tied to capacity or dependency pressure that may improve with clearer allocation.`;
    case "protect":
      return `${focus} carries downside exposure that should be contained before larger moves are made.`;
    default:
      return `${focus} is the most relevant pressure point in the current deterministic analysis.`;
  }
}

export function groupLabelForDecisionRecommendation(category: DecisionRecommendationCategory): string {
  switch (category) {
    case "stabilize":
      return "Stabilization Recommendations";
    case "monitor":
      return "Monitoring Recommendations";
    case "reduce_risk":
    case "protect":
      return "Risk Reduction Recommendations";
    case "rebalance":
    case "optimize":
      return "Operational Focus Recommendations";
    case "diversify":
      return "Diversification Recommendations";
    case "investigate":
      return "Investigation Recommendations";
  }
}
