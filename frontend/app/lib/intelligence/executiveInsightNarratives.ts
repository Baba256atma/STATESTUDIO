import type {
  ExecutiveInsightCategory,
  ExecutiveInsightSeverity,
  ExecutiveInsightSourceType,
} from "./executiveInsightTypes.ts";

function cleanLabel(value: unknown, fallback: string): string {
  const label = String(value ?? "").replace(/[_-]+/g, " ").trim();
  return label.length > 0 ? label : fallback;
}

export function buildExecutiveInsightTitle(params: {
  category: ExecutiveInsightCategory;
  primaryLabel?: unknown;
  severity?: ExecutiveInsightSeverity;
}): string {
  const label = cleanLabel(params.primaryLabel, "System");
  if (params.category === "scenario") return `${label} Scenario Pressure`;
  if (params.category === "risk") return `${label} Risk Concentration`;
  if (params.category === "fragility") return `${label} Fragility Pressure`;
  if (params.category === "dependency") return `${label} Dependency Pressure`;
  if (params.category === "financial") return `${label} Financial Pressure`;
  if (params.category === "capacity") return `${label} Capacity Pressure`;
  if (params.category === "stability") return `${label} Stability Pressure`;
  return `${label} Operational Pressure`;
}

export function buildExecutiveInsightSummary(params: {
  category: ExecutiveInsightCategory;
  primaryLabel?: unknown;
  secondaryLabel?: unknown;
  sourceType?: ExecutiveInsightSourceType;
}): string {
  const primary = cleanLabel(params.primaryLabel, "The current system");
  const secondary = cleanLabel(params.secondaryLabel, "connected operations");

  if (params.category === "scenario") {
    return `${primary} is the strongest near-term scenario pressure for executive review.`;
  }
  if (params.category === "risk") {
    return `Risk exposure around ${primary} is strong enough to deserve executive attention.`;
  }
  if (params.category === "fragility") {
    return `${primary} stability is becoming a central operational pressure point.`;
  }
  if (params.category === "dependency") {
    return `${secondary} depends on ${primary}, making this relationship an executive pressure point.`;
  }
  if (params.category === "financial") {
    return `${primary} may affect financial flexibility or exposure.`;
  }
  if (params.category === "capacity") {
    return `${primary} may become a capacity constraint for ${secondary}.`;
  }
  if (params.category === "stability") {
    return `${primary} may reduce stability across connected operating paths.`;
  }
  return `${primary} is an operational focus area for the current decision window.`;
}

export function recommendExecutiveFocus(params: {
  category: ExecutiveInsightCategory;
  primaryLabel?: unknown;
}): string {
  const label = cleanLabel(params.primaryLabel, "the pressure point");
  if (params.category === "dependency") return `Reduce dependency concentration around ${label}.`;
  if (params.category === "fragility") return `Stabilize ${label} before scaling activity.`;
  if (params.category === "risk") return `Contain risk exposure around ${label}.`;
  if (params.category === "scenario") return `Review the scenario path around ${label}.`;
  if (params.category === "financial") return `Protect financial flexibility around ${label}.`;
  if (params.category === "capacity") return `Rebalance capacity around ${label}.`;
  if (params.category === "stability") return `Increase monitoring visibility around ${label}.`;
  return `Focus executive attention on ${label}.`;
}
