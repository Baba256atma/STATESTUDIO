/** WS-7:2 — Immutable Decision taxonomy registries. */
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

export const DecisionWorkspaceV7TaxonomyRegistry = Object.freeze({
  categories: register("Category", [
    "Strategic Decision",
    "Tactical Decision",
    "Operational Decision",
    "Financial Decision",
    "Investment Decision",
    "Customer Decision",
    "Product Decision",
    "Manufacturing Decision",
    "Supply Chain Decision",
    "Human Resources Decision",
    "Technology Decision",
    "Governance Decision",
    "Compliance Decision",
    "Risk Decision",
    "Executive Decision",
  ]),
  types: register("Type", [
    "Binary Decision",
    "Multiple Choice Decision",
    "Prioritization Decision",
    "Approval Decision",
    "Rejection Decision",
    "Escalation Decision",
    "Delegation Decision",
    "Resource Allocation Decision",
    "Investment Decision",
    "Emergency Decision",
  ]),
  statuses: register("Status", [
    "Draft",
    "Proposed",
    "UnderReview",
    "Compared",
    "Evaluated",
    "Approved",
    "Rejected",
    "Archived",
  ]),
  priorities: register("Priority", [
    "Low",
    "Medium",
    "High",
    "Critical",
    "Executive Critical",
  ]),
  confidenceLevels: register("Confidence", [
    "Unknown",
    "Low",
    "Moderate",
    "High",
    "Very High",
  ]),
  metadataOnly: true,
  immutable: true,
} as const);
