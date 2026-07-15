import type {
  ExecutiveDecisionLifecycleRegistryEntry,
  ExecutiveDecisionOutputRegistryEntry,
} from "./executiveDecisionRegistryTypes.ts";

const OUTPUT_NAMESPACE = "Nexora.Engine.ExecutiveDecision.Registry.Output";
const LIFECYCLE_NAMESPACE = "Nexora.Engine.ExecutiveDecision.Registry.Lifecycle";

const output = (
  key: string,
  name: string,
  description: string,
  fields: readonly string[],
) => Object.freeze({
  id: `eng-7-output-${key}`,
  outputKey: name,
  name,
  description,
  namespace: OUTPUT_NAMESPACE,
  fields: Object.freeze([...fields]),
  owner: "ENG-7",
  status: "Registered",
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
} as const satisfies ExecutiveDecisionOutputRegistryEntry);

const state = (
  key: string,
  name: string,
  description: string,
  allowedPredecessors: readonly string[],
  allowedSuccessors: readonly string[],
  terminal: boolean,
) => Object.freeze({
  id: `eng-7-lifecycle-${key}`,
  stateId: `eng-7-lifecycle-${key}`,
  name,
  description,
  namespace: LIFECYCLE_NAMESPACE,
  allowedPredecessors: Object.freeze([...allowedPredecessors]),
  allowedSuccessors: Object.freeze([...allowedSuccessors]),
  terminal,
  owner: "ENG-7",
  status: "Registered",
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
} as const satisfies ExecutiveDecisionLifecycleRegistryEntry);

/**
 * Canonical decision output registry — classification metadata only.
 */
export const ExecutiveDecisionOutputRegistry = Object.freeze([
  output(
    "executive-decision",
    "ExecutiveDecision",
    "Published executive decision envelope.",
    Object.freeze(["id", "decisionType", "domain", "selectedAlternative", "status", "metadata"]),
  ),
  output(
    "ranked-alternative-set",
    "RankedAlternativeSet",
    "Published ranked alternative-set envelope without ranking algorithms.",
    Object.freeze(["id", "alternatives", "rankingMetadata", "status"]),
  ),
  output(
    "decision-confidence",
    "DecisionConfidence",
    "Published decision confidence metadata without confidence calculation.",
    Object.freeze(["id", "confidenceLevel", "sourceReferences", "status"]),
  ),
  output(
    "decision-risk-profile",
    "DecisionRiskProfile",
    "Published decision risk-profile metadata without risk assessment.",
    Object.freeze(["id", "riskCategories", "severityMetadata", "status"]),
  ),
  output(
    "decision-tradeoff-profile",
    "DecisionTradeoffProfile",
    "Published decision tradeoff-profile metadata without tradeoff solvers.",
    Object.freeze(["id", "tradeoffs", "criteria", "status"]),
  ),
  output(
    "decision-trace",
    "DecisionTrace",
    "Published decision-trace metadata without runtime tracing.",
    Object.freeze(["id", "traceSteps", "references", "status"]),
  ),
  output(
    "executive-recommendation-package",
    "ExecutiveRecommendationPackage",
    "Published recommendation-package envelope without Advisor behavior.",
    Object.freeze(["id", "recommendations", "rationale", "status"]),
  ),
  output(
    "decision-publication-metadata",
    "DecisionPublicationMetadata",
    "Published decision publication metadata envelope.",
    Object.freeze(["id", "publicationStatus", "namespace", "version", "status"]),
  ),
] as const);

/**
 * Canonical decision lifecycle registry — state graph metadata only.
 * Does not implement transitions.
 */
export const ExecutiveDecisionLifecycleRegistry = Object.freeze([
  state(
    "registered",
    "Registered",
    "Decision artifact is registered in the decision architecture.",
    Object.freeze([] as const),
    Object.freeze(["eng-7-lifecycle-candidate"]),
    false,
  ),
  state(
    "candidate",
    "Candidate",
    "Decision alternative is a candidate for evaluation.",
    Object.freeze(["eng-7-lifecycle-registered"]),
    Object.freeze(["eng-7-lifecycle-evaluated"]),
    false,
  ),
  state(
    "evaluated",
    "Evaluated",
    "Decision alternative has been evaluated as metadata.",
    Object.freeze(["eng-7-lifecycle-candidate"]),
    Object.freeze(["eng-7-lifecycle-selected"]),
    false,
  ),
  state(
    "selected",
    "Selected",
    "Decision alternative has been selected as metadata.",
    Object.freeze(["eng-7-lifecycle-evaluated"]),
    Object.freeze(["eng-7-lifecycle-approved"]),
    false,
  ),
  state(
    "approved",
    "Approved",
    "Decision has been approved for publication as metadata.",
    Object.freeze(["eng-7-lifecycle-selected"]),
    Object.freeze(["eng-7-lifecycle-published"]),
    false,
  ),
  state(
    "published",
    "Published",
    "Decision has been published as immutable metadata.",
    Object.freeze(["eng-7-lifecycle-approved"]),
    Object.freeze(["eng-7-lifecycle-superseded", "eng-7-lifecycle-archived"]),
    false,
  ),
  state(
    "superseded",
    "Superseded",
    "Decision has been superseded by a later published decision.",
    Object.freeze(["eng-7-lifecycle-published"]),
    Object.freeze(["eng-7-lifecycle-archived"]),
    false,
  ),
  state(
    "archived",
    "Archived",
    "Decision is archived as terminal historical metadata.",
    Object.freeze(["eng-7-lifecycle-published", "eng-7-lifecycle-superseded"]),
    Object.freeze([] as const),
    true,
  ),
] as const);
