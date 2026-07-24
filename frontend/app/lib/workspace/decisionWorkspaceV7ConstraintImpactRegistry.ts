/** WS-7:2 — Immutable constraint and impact registries. */
import { DecisionWorkspaceV7Foundation } from "./decisionWorkspaceV7Foundation.ts";

const register = (
  group: string,
  names: readonly string[],
) => Object.freeze(
  names.map((name, index) =>
    Object.freeze({
      id: `WS-7:2/${group}/${String(index + 1).padStart(2, "0")}`,
      key: `${group.toLowerCase()}-${String(index + 1).padStart(2, "0")}`,
      name,
      group,
      source: DecisionWorkspaceV7Foundation,
      order: index + 1,
      executable: false,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);

export const DecisionWorkspaceV7ConstraintImpactRegistry = Object.freeze({
  constraintTypes: register("Constraint", [
    "Budget",
    "Time",
    "Resource",
    "Legal",
    "Regulatory",
    "Technology",
    "Operational",
    "Market",
    "Organizational",
    "Capacity",
  ]),
  impactDomains: register("Impact", [
    "Revenue",
    "Profit",
    "Cost",
    "Cash Flow",
    "Customer",
    "Employee",
    "Operations",
    "Quality",
    "Delivery",
    "Risk",
    "Compliance",
    "Brand",
  ]),
  metadataOnly: true,
  immutable: true,
} as const);
