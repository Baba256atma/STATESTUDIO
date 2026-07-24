/** WS-9:2 — Immutable value category and dimension registries. */
import { ValueWorkspaceFoundation } from "./valueWorkspaceFoundation.ts";

const register = (group: string, names: readonly string[]) => Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-9:2/${group}/${String(index + 1).padStart(2, "0")}`,
    key: `${group.toLowerCase()}-${String(index + 1).padStart(2, "0")}`,
    name,
    group,
    source: ValueWorkspaceFoundation.identity.id,
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);

export const ValueWorkspaceTaxonomyRegistry = Object.freeze({
  valueCategories: register("ValueCategory", [
    "Financial Value",
    "Strategic Value",
    "Operational Value",
    "Customer Value",
    "Employee Value",
    "Product Value",
    "Process Value",
    "Innovation Value",
    "Risk Reduction Value",
    "Sustainability Value",
    "Compliance Value",
    "Executive Value",
    "Organizational Value",
    "Portfolio Value",
    "Business Growth Value",
  ]),
  valueDimensions: register("ValueDimension", [
    "Revenue",
    "Profit",
    "Cost Saving",
    "Time Saving",
    "Productivity",
    "Efficiency",
    "Quality",
    "Customer Satisfaction",
    "Employee Satisfaction",
    "Risk Reduction",
    "Market Growth",
    "Competitive Advantage",
  ]),
  metadataOnly: true,
  immutable: true,
} as const);
