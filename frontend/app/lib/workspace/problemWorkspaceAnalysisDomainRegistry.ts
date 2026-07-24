/** WS-6:2 — Preparation-only impact and root-cause domain vocabularies. */
const definitions = Object.freeze({
  impact: Object.freeze([
    "Revenue",
    "Profit",
    "Cost",
    "Cash Flow",
    "Customer Satisfaction",
    "Employee Performance",
    "Production",
    "Delivery",
    "Quality",
    "Risk",
    "Brand",
    "Compliance",
  ]),
  rootCause: Object.freeze([
    "Process",
    "People",
    "Technology",
    "Policy",
    "Governance",
    "Market",
    "Supplier",
    "Customer",
    "Financial",
    "Operations",
  ]),
} as const);

const createRecords = (
  names: readonly string[],
  category: "ImpactDomain" | "RootCauseDomain",
) => Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-6:2/${category}/${String(index + 1).padStart(2, "0")}`,
  key: `${category.toLowerCase()}-${String(index + 1).padStart(2, "0")}`,
  name,
  description: `Registers ${name} as a non-executable ${category}.`,
  registryCategory: category,
  source: "WS-6:2 Registry Vocabulary",
  sourcePhase: "WS-6:2",
  version: "1.0.0",
  ownership: "Problem Workspace",
  metadataOnly: true,
  immutable: true,
})));

export const ProblemWorkspaceAnalysisDomainRegistry = Object.freeze({
  impactDomains: createRecords(definitions.impact, "ImpactDomain"),
  rootCauseDomains: createRecords(definitions.rootCause, "RootCauseDomain"),
  analysisExecution: false,
  metadataOnly: true,
  immutable: true,
} as const);
