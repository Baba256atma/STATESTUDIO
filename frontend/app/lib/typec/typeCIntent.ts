export type TypeCIntent =
  | { type: "add_object"; label: string }
  | { type: "model_system"; labels: string[]; reason: string }
  | { type: "create_scenario" }
  | { type: "select_scenario" }
  | { type: "ignore_scenario" }
  | { type: "ready_for_decision" }
  | { type: "check_decision_readiness" }
  | { type: "create_decision_draft" }
  | { type: "create_executive_summary" }
  | { type: "none" };

function toTitleLabel(label: string): string {
  return label
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

export function detectTypeCIntent(text: string): TypeCIntent {
  try {
    const normalized = text.toLowerCase().trim();
    const includesAny = (terms: string[]) => terms.some((term) => normalized.includes(term));

    if (normalized === "create scenario" || normalized === "build scenario") {
      return { type: "create_scenario" };
    }
    if (normalized === "select scenario" || normalized === "choose scenario") {
      return { type: "select_scenario" };
    }
    if (normalized === "ignore scenario" || normalized === "discard scenario") {
      return { type: "ignore_scenario" };
    }
    if (normalized === "ready for decision" || normalized === "mark ready") {
      return { type: "ready_for_decision" };
    }
    if (normalized === "check decision readiness") {
      return { type: "check_decision_readiness" };
    }
    if (
      normalized === "create decision draft" ||
      normalized === "draft decision" ||
      normalized === "recommend next" ||
      normalized === "what should we do"
    ) {
      return { type: "create_decision_draft" };
    }
    if (
      normalized === "executive summary" ||
      normalized === "summarize decision" ||
      normalized === "manager summary" ||
      normalized === "show recommendation"
    ) {
      return { type: "create_executive_summary" };
    }

    for (const prefix of ["add ", "create "]) {
      if (normalized.startsWith(prefix)) {
        const label = toTitleLabel(normalized.replace(prefix, "").trim());
        return label ? { type: "add_object", label } : { type: "none" };
      }
    }

    if (includesAny(["supply chain", "supplier", "inventory", "delivery", "delay"])) {
      return {
        type: "model_system",
        labels: ["Supplier", "Inventory", "Delivery"],
        reason: "supply_chain_pattern",
      };
    }

    if (includesAny(["sales", "customer", "demand"])) {
      return {
        type: "model_system",
        labels: ["Customer", "Demand", "Sales"],
        reason: "sales_pattern",
      };
    }

    if (!normalized.startsWith("we have ")) return { type: "none" };

    const label = toTitleLabel(normalized.replace("we have ", "").trim());
    return label ? { type: "add_object", label } : { type: "none" };
  } catch {
    return { type: "none" };
  }
}
