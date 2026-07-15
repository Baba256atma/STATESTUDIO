import { ExecutiveDecisionCapabilityRegistry } from "./executiveDecisionCapabilityRegistry.ts";
import { ExecutiveDecisionDependencyMap } from "./executiveDecisionDependencyMap.ts";
import { ExecutiveDecisionOwnershipMap } from "./executiveDecisionOwnership.ts";
import type {
  ExecutiveDecisionBoundary as ExecutiveDecisionBoundaryDescriptor,
  ExecutiveDecisionDomain,
  ExecutiveDecisionFoundationMetadata as ExecutiveDecisionFoundationMetadataDescriptor,
  ExecutiveDecisionLifecycle,
  ExecutiveDecisionOutput,
} from "./executiveDecisionFoundationTypes.ts";

const domain = (
  key: string,
  name: string,
  description: string,
) => Object.freeze({
  id: `eng-7-domain-${key}`,
  name,
  description,
  status: "Defined",
  owner: "ENG-7",
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
} as const satisfies ExecutiveDecisionDomain);

const stage = (
  key: string,
  name: string,
  description: string,
  order: number,
) => Object.freeze({
  id: `eng-7-lifecycle-${key}`,
  name,
  description,
  order,
  status: "Defined",
  owner: "ENG-7",
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
} as const satisfies ExecutiveDecisionLifecycle);

const output = (
  key: string,
  name: string,
  description: string,
  fields: readonly string[],
) => Object.freeze({
  id: `eng-7-output-${key}`,
  name,
  description,
  fields: Object.freeze([...fields]),
  status: "Defined",
  owner: "ENG-7",
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
} as const satisfies ExecutiveDecisionOutput);

export const ExecutiveDecisionDomains = Object.freeze([
  domain("decision-selection", "Decision Selection", "Domain describing final executive decision selection architecture."),
  domain("alternative-evaluation", "Alternative Evaluation", "Domain describing alternative evaluation architecture without ranking algorithms."),
  domain("confidence-publication", "Confidence Publication", "Domain describing confidence publication contracts without confidence calculation."),
  domain("risk-disclosure", "Risk Disclosure", "Domain describing risk disclosure contracts without risk engines."),
  domain("tradeoff-disclosure", "Tradeoff Disclosure", "Domain describing tradeoff disclosure contracts without tradeoff solvers."),
  domain("decision-trace", "Decision Trace", "Domain describing decision-trace architecture without runtime tracing."),
  domain("recommendation-packaging", "Recommendation Packaging", "Domain describing recommendation packaging contracts without advisors."),
  domain("decision-metadata", "Decision Metadata", "Domain describing decision metadata envelope architecture."),
] as const);

export const ExecutiveDecisionLifecycleStages = Object.freeze([
  stage("input", "Decision Input", "Receives validated reasoning outcome references as metadata only.", 1),
  stage("alternative-inventory", "Alternative Inventory", "Inventories decision alternatives as architectural metadata.", 2),
  stage("ranking", "Alternative Ranking", "Describes ranking stage without performing ranking.", 3),
  stage("selection", "Final Selection", "Describes final decision selection stage without selecting at runtime.", 4),
  stage("confidence", "Confidence Attachment", "Describes attaching confidence metadata without calculating confidence.", 5),
  stage("risk", "Risk Attachment", "Describes attaching risk metadata without assessing risk.", 6),
  stage("tradeoff", "Tradeoff Attachment", "Describes attaching tradeoff metadata without analyzing tradeoffs.", 7),
  stage("trace", "Trace Assembly", "Describes decision-trace assembly without generating traces.", 8),
  stage("publication", "Decision Publication", "Describes publication of executive decision metadata envelopes.", 9),
] as const);

export const ExecutiveDecisionOutputs = Object.freeze([
  output(
    "executive-decision",
    "ExecutiveDecisionOutput",
    "Canonical output envelope for a published executive decision.",
    Object.freeze(["id", "selectedAlternative", "confidence", "risk", "tradeoffs", "trace", "metadata"]),
  ),
  output(
    "recommendation-package",
    "RecommendationPackageOutput",
    "Canonical output envelope for packaged executive recommendations.",
    Object.freeze(["id", "recommendations", "ranking", "rationale", "metadata"]),
  ),
] as const);

export const ExecutiveDecisionBoundary = Object.freeze({
  producesDecisionsOnly: true,
  performsReasoning: false,
  performsPlanning: false,
  performsOrchestration: false,
  performsExecution: false,
  performsVisualization: false,
  performsPersistence: false,
  performsAiInference: false,
  performsScoring: false,
} as const satisfies ExecutiveDecisionBoundaryDescriptor);

export const ExecutiveDecisionFoundationMetadata = Object.freeze({
  platformId: "ENG-7:1",
  name: "Executive Decision Engine Foundation",
  version: "1.0.0",
  namespace: "nexora.engine.executive.decision.foundation",
  description:
    "Canonical metadata-only architectural foundation for the Executive Decision Engine. Converts validated reasoning outcomes into deterministic executive decision architecture without performing reasoning, planning, execution, or AI inference.",
  phase: "ENG-7:1",
  owner: "ENG-7",
  nextPhase: "ENG-7:2",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const satisfies ExecutiveDecisionFoundationMetadataDescriptor);

/**
 * Immutable Executive Decision Foundation for ENG-7:1.
 */
export const ExecutiveDecisionFoundation = Object.freeze({
  id: "ENG-7:1",
  platformId: "ENG-7:1",
  name: "Executive Decision Engine Foundation",
  namespace: "nexora.engine.executive.decision.foundation",
  description: ExecutiveDecisionFoundationMetadata.description,
  version: "1.0.0",
  phase: "ENG-7:1",
  owner: "ENG-7",
  layer: "ExecutiveEngine",
  module: "ExecutiveDecisionFoundation",
  ownership: ExecutiveDecisionOwnershipMap,
  lifecycle: ExecutiveDecisionLifecycleStages,
  supportedCapabilities: ExecutiveDecisionCapabilityRegistry,
  domains: ExecutiveDecisionDomains,
  outputs: ExecutiveDecisionOutputs,
  architecturalBoundaries: ExecutiveDecisionBoundary,
  dependencies: ExecutiveDecisionDependencyMap,
  metadata: ExecutiveDecisionFoundationMetadata,
  status: Object.freeze({
    foundation: "Foundation",
    metadataOnly: "MetadataOnly",
    runtimeFree: "RuntimeFree",
    immutable: "Immutable",
    deterministic: "Deterministic",
    aiFree: "AiFree",
    readyForRegistry: "ReadyForRegistry",
  } as const),
  nextPhase: "ENG-7:2",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const);
