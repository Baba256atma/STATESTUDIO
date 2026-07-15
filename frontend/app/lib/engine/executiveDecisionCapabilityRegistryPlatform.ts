import { ExecutiveDecisionCapabilityRegistry as FoundationCapabilityRegistry } from "./executiveDecisionPublicApi.ts";
import type { ExecutiveDecisionCapabilityRegistryEntry } from "./executiveDecisionRegistryTypes.ts";

const NAMESPACE = "Nexora.Engine.ExecutiveDecision.Registry.Capability";

const foundationId = (key: string) => {
  const match = FoundationCapabilityRegistry.find(({ id }) => id === `eng-7-capability-${key}`);
  return match?.id ?? `eng-7-capability-${key}`;
};

const capability = (
  key: string,
  canonicalName: string,
  description: string,
  foundationKey: string,
  permittedInputs: readonly string[],
  declaredOutputs: readonly string[],
  lifecycleStages: readonly string[],
  dependencyRequirements: readonly string[],
) => Object.freeze({
  id: `eng-7-registry-capability-${key}`,
  name: canonicalName,
  canonicalName,
  description,
  namespace: NAMESPACE,
  owner: "ENG-7",
  owningPhase: "ENG-7:2",
  foundationCapabilityId: foundationId(foundationKey),
  permittedInputs: Object.freeze([...permittedInputs]),
  declaredOutputs: Object.freeze([...declaredOutputs]),
  lifecycleStages: Object.freeze([...lifecycleStages]),
  dependencyRequirements: Object.freeze([...dependencyRequirements]),
  prohibitedResponsibilities: Object.freeze([
    "decision selection algorithms",
    "alternative ranking algorithms",
    "confidence calculation",
    "risk calculation",
    "tradeoff solvers",
    "reasoning execution",
    "planning execution",
    "orchestration",
    "runtime data processing",
  ] as const),
  status: "Registered",
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
} as const satisfies ExecutiveDecisionCapabilityRegistryEntry);

/**
 * Expanded capability registry based on ENG-7:1 public capability identifiers.
 * Describes capability contracts only — never performs capabilities.
 */
export const ExecutiveDecisionCapabilityRegistryPlatform = Object.freeze([
  capability(
    "final-decision-selection",
    "FinalDecisionSelection",
    "Capability contract for final executive decision selection architecture.",
    "final-decision-selection",
    Object.freeze(["validatedReasoningOutcome", "rankedAlternatives"]),
    Object.freeze(["eng-7-output-executive-decision"]),
    Object.freeze(["eng-7-lifecycle-evaluated", "eng-7-lifecycle-selected", "eng-7-lifecycle-approved"]),
    Object.freeze(["ENG-6", "ENG-7:1"]),
  ),
  capability(
    "alternative-ranking",
    "AlternativeRanking",
    "Capability contract for alternative-ranking architecture without ranking algorithms.",
    "alternative-ranking",
    Object.freeze(["decisionAlternatives", "decisionCriteriaMetadata"]),
    Object.freeze(["eng-7-output-ranked-alternative-set"]),
    Object.freeze(["eng-7-lifecycle-candidate", "eng-7-lifecycle-evaluated"]),
    Object.freeze(["ENG-6", "ENG-7:1"]),
  ),
  capability(
    "confidence-publication",
    "ConfidencePublication",
    "Capability contract for publishing decision confidence metadata without calculating confidence.",
    "confidence-publication",
    Object.freeze(["reasoningConfidenceMetadata"]),
    Object.freeze(["eng-7-output-decision-confidence"]),
    Object.freeze(["eng-7-lifecycle-evaluated", "eng-7-lifecycle-published"]),
    Object.freeze(["ENG-6", "ENG-7:1"]),
  ),
  capability(
    "risk-publication",
    "RiskPublication",
    "Capability contract for publishing decision risk metadata without assessing risk.",
    "risk-publication",
    Object.freeze(["reasoningRiskMetadata"]),
    Object.freeze(["eng-7-output-decision-risk-profile"]),
    Object.freeze(["eng-7-lifecycle-evaluated", "eng-7-lifecycle-published"]),
    Object.freeze(["ENG-6", "ENG-7:1"]),
  ),
  capability(
    "tradeoff-publication",
    "TradeoffPublication",
    "Capability contract for publishing decision tradeoff metadata without solving tradeoffs.",
    "tradeoff-publication",
    Object.freeze(["reasoningTradeoffMetadata"]),
    Object.freeze(["eng-7-output-decision-tradeoff-profile"]),
    Object.freeze(["eng-7-lifecycle-evaluated", "eng-7-lifecycle-published"]),
    Object.freeze(["ENG-6", "ENG-7:1"]),
  ),
  capability(
    "decision-trace-publication",
    "DecisionTracePublication",
    "Capability contract for publishing decision-trace metadata without generating traces.",
    "decision-trace-publication",
    Object.freeze(["decisionTraceReferences"]),
    Object.freeze(["eng-7-output-decision-trace"]),
    Object.freeze(["eng-7-lifecycle-selected", "eng-7-lifecycle-published"]),
    Object.freeze(["ENG-6", "ENG-7:1"]),
  ),
  capability(
    "recommendation-packaging",
    "RecommendationPackaging",
    "Capability contract for packaging executive recommendations without recommendation engines.",
    "recommendation-packaging",
    Object.freeze(["rankedAlternatives", "decisionRationaleMetadata"]),
    Object.freeze(["eng-7-output-executive-recommendation-package"]),
    Object.freeze(["eng-7-lifecycle-evaluated", "eng-7-lifecycle-published"]),
    Object.freeze(["ENG-6", "ENG-7:1", "Advisor"]),
  ),
  capability(
    "decision-metadata-publication",
    "DecisionMetadataPublication",
    "Capability contract for publishing decision metadata envelopes without mutating runtime state.",
    "decision-metadata-publication",
    Object.freeze(["decisionEnvelopeMetadata"]),
    Object.freeze(["eng-7-output-decision-publication-metadata"]),
    Object.freeze(["eng-7-lifecycle-approved", "eng-7-lifecycle-published"]),
    Object.freeze(["ENG-7:1"]),
  ),
] as const);
