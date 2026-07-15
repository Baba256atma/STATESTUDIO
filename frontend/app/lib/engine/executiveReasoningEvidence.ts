const category = (id: string, name: string, description: string) => Object.freeze({
  id,
  name,
  description,
  status: "Defined",
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
} as const);

export const ExecutiveEvidenceCategories = Object.freeze([
  category(
    "eng-6-evidence-business",
    "Business Evidence",
    "Evidence category for business-domain evidence metadata without business calculations.",
  ),
  category(
    "eng-6-evidence-financial",
    "Financial Evidence",
    "Evidence category for financial evidence metadata without financial computation.",
  ),
  category(
    "eng-6-evidence-operational",
    "Operational Evidence",
    "Evidence category for operational evidence metadata without OPS runtime access.",
  ),
  category(
    "eng-6-evidence-strategic",
    "Strategic Evidence",
    "Evidence category for strategic evidence metadata without strategy engines.",
  ),
  category(
    "eng-6-evidence-project",
    "Project Evidence",
    "Evidence category for project evidence metadata without project execution.",
  ),
  category(
    "eng-6-evidence-resource",
    "Resource Evidence",
    "Evidence category for resource evidence metadata without resource allocation.",
  ),
  category(
    "eng-6-evidence-scheduling",
    "Scheduling Evidence",
    "Evidence category for scheduling evidence metadata without scheduling runtime.",
  ),
  category(
    "eng-6-evidence-dependency",
    "Dependency Evidence",
    "Evidence category for dependency evidence metadata without dependency resolution.",
  ),
  category(
    "eng-6-evidence-historical",
    "Historical Evidence",
    "Evidence category for historical evidence metadata without historical data retrieval.",
  ),
  category(
    "eng-6-evidence-external",
    "External Evidence",
    "Evidence category for external evidence metadata without external API calls.",
  ),
] as const);

const hypothesis = (id: string, name: string, description: string) => Object.freeze({
  id,
  name,
  description,
  status: "Defined",
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
} as const);

/** Internal hypothesis vocabulary consumed by the foundation aggregate; not a separate public export. */
export const ExecutiveHypothesisTypes = Object.freeze([
  hypothesis(
    "eng-6-hypothesis-primary",
    "Primary",
    "Hypothesis type describing a primary interpretive candidate as metadata only.",
  ),
  hypothesis(
    "eng-6-hypothesis-alternative",
    "Alternative",
    "Hypothesis type describing an alternative interpretive candidate as metadata only.",
  ),
  hypothesis(
    "eng-6-hypothesis-supporting",
    "Supporting",
    "Hypothesis type describing supporting interpretive metadata without proof engines.",
  ),
  hypothesis(
    "eng-6-hypothesis-conflicting",
    "Conflicting",
    "Hypothesis type describing conflicting interpretive metadata without conflict resolution.",
  ),
  hypothesis(
    "eng-6-hypothesis-exploratory",
    "Exploratory",
    "Hypothesis type describing exploratory interpretive metadata without exploration runtime.",
  ),
] as const);
