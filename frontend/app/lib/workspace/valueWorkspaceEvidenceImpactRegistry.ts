/** WS-9:2 — Immutable measurement, evidence, and impact registries. */
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

export const ValueWorkspaceEvidenceImpactRegistry = Object.freeze({
  measurementTypes: register("MeasurementType", [
    "Percentage", "Currency", "Hours", "Days", "Units",
    "Score", "Ratio", "Index", "Rating", "Trend",
  ]),
  evidenceTypes: register("EvidenceType", [
    "KPI",
    "Financial Statement",
    "Executive Report",
    "Operational Report",
    "Project Report",
    "Customer Feedback",
    "Survey",
    "Audit",
    "Observation",
    "Trend Analysis",
  ]),
  impactDomains: register("ImpactDomain", [
    "Financial", "Operational", "Strategic", "Customer", "Employee",
    "Market", "Quality", "Risk", "Compliance", "Sustainability",
  ]),
  metadataOnly: true,
  immutable: true,
} as const);
