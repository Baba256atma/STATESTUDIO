/** WS-6:2 — Canonical evidence, constraint, and assumption vocabularies. */
const definitions = Object.freeze({
  evidence: Object.freeze([
    "KPI",
    "Metric",
    "Financial Report",
    "Operational Report",
    "Customer Feedback",
    "Audit",
    "Incident",
    "Observation",
    "Trend",
    "Forecast",
    "External Source",
    "Executive Note",
  ]),
  constraint: Object.freeze([
    "Budget",
    "Time",
    "Resource",
    "Technology",
    "Regulation",
    "Legal",
    "Market",
    "Capacity",
    "Process",
    "Organization",
  ]),
  assumption: Object.freeze([
    "Business Assumption",
    "Market Assumption",
    "Financial Assumption",
    "Operational Assumption",
    "Customer Assumption",
    "Technology Assumption",
  ]),
} as const);

const createRecords = (
  names: readonly string[],
  category: "EvidenceType" | "ConstraintType" | "AssumptionType",
) => Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-6:2/${category}/${String(index + 1).padStart(2, "0")}`,
  key: `${category.toLowerCase()}-${String(index + 1).padStart(2, "0")}`,
  name,
  description: `Registers ${name} as canonical ${category} metadata.`,
  registryCategory: category,
  source: "WS-6:2 Registry Vocabulary",
  sourcePhase: "WS-6:2",
  version: "1.0.0",
  ownership: "Problem Workspace",
  metadataOnly: true,
  immutable: true,
})));

export const ProblemWorkspaceEvidenceRegistry = Object.freeze({
  evidenceTypes: createRecords(definitions.evidence, "EvidenceType"),
  constraintTypes: createRecords(definitions.constraint, "ConstraintType"),
  assumptionTypes: createRecords(definitions.assumption, "AssumptionType"),
  metadataOnly: true,
  immutable: true,
} as const);
