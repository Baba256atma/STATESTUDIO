/** WS-6:2 — Canonical Problem categories, severities, and statuses. */
const definitions = Object.freeze({
  category: Object.freeze([
    "Strategic Problem",
    "Operational Problem",
    "Financial Problem",
    "Sales Problem",
    "Marketing Problem",
    "Customer Problem",
    "Product Problem",
    "Manufacturing Problem",
    "Supply Chain Problem",
    "Human Resources Problem",
    "Compliance Problem",
    "Technology Problem",
    "Data Problem",
    "Quality Problem",
    "Risk Problem",
  ]),
  severity: Object.freeze([
    "Informational",
    "Low",
    "Medium",
    "High",
    "Critical",
    "Executive Critical",
  ]),
  status: Object.freeze([
    "Draft",
    "Identified",
    "Defined",
    "Structured",
    "Validated",
    "Escalated",
    "Closed",
    "Archived",
  ]),
} as const);

const createRecords = (
  names: readonly string[],
  category: "ProblemCategory" | "ProblemSeverity" | "ProblemStatus",
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

export const ProblemWorkspaceTaxonomyRegistry = Object.freeze({
  categories: createRecords(definitions.category, "ProblemCategory"),
  severities: createRecords(definitions.severity, "ProblemSeverity"),
  statuses: createRecords(definitions.status, "ProblemStatus"),
  metadataOnly: true,
  immutable: true,
} as const);
