import type { LoopType } from "../sceneTypes";

export type KpiKey = "inventory" | "delivery" | "risk";

export type KpiSuggestionAction = { action: "add_loop"; loopType: LoopType };

export type KpiSuggestion = {
  id: string;
  kpi: KpiKey;
  level: "info" | "warn";
  reason: string;
  suggestion: KpiSuggestionAction;
  createdAt: number;
};

export type KpiSuggestionInput = {
  kpi?: { inventory?: number; delivery?: number; risk?: number } | null;
  loopsCount?: number;
};

function buildSuggestion(
  kpi: KpiKey,
  level: "info" | "warn",
  reason: string,
  loopType: LoopType
): KpiSuggestion {
  const createdAt = Date.now();
  const suffix = Math.random().toString(36).slice(2, 8);
  return {
    id: `${kpi}-${createdAt}-${suffix}`,
    kpi,
    level,
    reason,
    suggestion: { action: "add_loop", loopType },
    createdAt,
  };
}

export function computeKpiSuggestions(input: KpiSuggestionInput): KpiSuggestion[] {
  const kpi = input.kpi;
  if (!kpi) return [];

  const suggestions: KpiSuggestion[] = [];

  if (typeof kpi.risk === "number" && kpi.risk >= 0.75) {
    suggestions.push(
      buildSuggestion("risk", "warn", "Risk is high and trending unsafe.", "stability_balance")
    );
  }

  if (typeof kpi.delivery === "number" && kpi.delivery <= 0.35) {
    suggestions.push(
      buildSuggestion("delivery", "warn", "Delivery performance is lagging.", "delivery_customer")
    );
  }

  if (typeof kpi.inventory === "number" && kpi.inventory >= 0.75) {
    suggestions.push(
      buildSuggestion("inventory", "info", "Inventory levels are elevated.", "cost_compression")
    );
  }

  return suggestions;
}
