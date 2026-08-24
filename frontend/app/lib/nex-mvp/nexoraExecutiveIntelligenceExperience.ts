/**
 * EXI:1 — Executive Intelligence Experience Integration.
 *
 * Read-only presentation composer over existing MVP intelligence.
 * Does not own attention, recommendation, decision, execution, or memory.
 * Does not invent change history, Outcome, Learning, or CC:11 execution.
 *
 * Precedence:
 *   Canonical Runtime Truth
 *   > Validated Data Reality
 *   > Explicit Manager Context (Stage subject)
 *   > Existing Executive Intelligence / Advisor
 *   > Existing Recommendation (NBA > Decision Brief > Advisor)
 *   > Safe Unknown / Missing
 */

import type { DataRealityAwareAdvisorBindingResult } from "../data-reality/dataRealityAwareAdvisorExperienceBinding.ts";
import type { NexoraProfessionalAdvisorNarrative } from "./nexoraMVPProfessionalAdvisorPresentation.ts";
import {
  NEXORA_MVP_CONTEXT_LINK_FIXTURES,
  NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES,
} from "./nexoraMVPObjectInteractionFixtures.ts";
import {
  NEXORA_MVP_STAGE_OBJECT_FIXTURES,
  NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
} from "./nexoraMVPStageFixtures.ts";
import {
  applyCoreEpistemicToField,
  claimForExperienceRole,
  focusedSharedEpistemicClaim,
  presentExecutiveClaimKind,
  presentExecutiveConfidence,
  presentExecutiveEvidence,
  type NexoraSharedEpistemicProjection,
  type SharedEpistemicClaim,
} from "../executive-intelligence/nexoraSharedEpistemicFoundation.ts";
import type {
  CausalAssessment,
  ConstraintAssessment,
} from "../executive-intelligence/nexoraGroundedCausalConstraintIntelligence.ts";
import {
  presentBindingAnswer,
  presentContributorEvidence,
  presentProvenAnswer,
} from "../executive-intelligence/nexoraGroundedCausalConstraintIntelligence.ts";
import type { ExecutivePriorityAssessment } from "../executive-intelligence/nexoraExecutivePriorityIntelligence.ts";
import type { ExecutiveTradeoffAssessment } from "../executive-intelligence/nexoraExecutiveTradeoffIntelligence.ts";
import {
  presentTradeoffConfidence,
} from "../executive-intelligence/nexoraExecutiveTradeoffIntelligence.ts";
import type {
  ExecutiveOutcomeAssessment,
  ExecutiveOutcomeExpectation,
} from "../executive-intelligence/nexoraLiveOutcomeIntelligence.ts";
import type { GroundedLearningIntelligence } from "../executive-intelligence/nexoraGroundedLearningIntelligence.ts";
import type { NexoraDecisionRuntimeAdapter } from "../conversational-control/executiveDecisionRuntimeAdapter.ts";
import {
  integrateNexoraOutcomeLearningRuntime,
  type IntegrateNexoraOutcomeLearningRuntimeInput,
  type NexoraOutcomeLearningRuntimeSnapshot,
} from "./nexoraOutcomeLearningRuntimeIntegration.ts";
import type {
  NexoraMVPFlowDecisionRecord,
  NexoraMVPFlowExecutionRecord,
} from "./nexoraMVPExecutiveFlowFixtures.ts";
import type { OutcomeLinkBasis, OutcomeObservationInput } from "../executive-intelligence/nexoraLiveOutcomeObservationCapture.ts";
import {
  presentAttentionVersusPriority,
  presentPriorityAssessment,
  presentPriorityConfidence,
  presentPriorityEvidence,
  presentSecondPriority,
  presentWhyAOverB,
} from "../executive-intelligence/nexoraExecutivePriorityIntelligence.ts";
import {
  projectNexoraLiveCausalConstraintIntelligence,
  projectNexoraLiveExecutivePriorityIntelligence,
  projectNexoraLiveExecutiveTradeoffIntelligence,
  projectNexoraLiveSharedEpistemicFoundation,
} from "./nexoraLiveEpistemicProjection.ts";
import {
  composeNexoraExiCauseAssessment,
  composeNexoraExiComparisonFollowups,
  composeNexoraExiConfidenceFollowup,
  composeNexoraExiConstraintAssessment,
  composeNexoraExiEvidenceFollowup,
  composeNexoraExiTradeoffAssessment,
  nexoraExi2EnrichmentIdentity,
  nexoraExi3EnrichmentIdentity,
  type NexoraExiCauseAssessment,
  type NexoraExiConstraintAssessment,
  type NexoraExiTradeoffAssessment,
} from "./nexoraExecutiveIntelligenceExperienceGrounding.ts";
import {
  composeNexoraExi4Presentation,
  nexoraExi4PresentationIdentity,
  type NexoraExi4Presentation,
} from "./nexoraExecutiveIntelligenceExperienceExi4.ts";
import {
  nexoraExi5ExperienceIdentity,
  type ExecutiveOutcomeLearningExperience,
} from "./nexoraExecutiveIntelligenceExperienceExi5.ts";

export {
  nexoraExi2EnrichmentIdentity,
  nexoraExi3EnrichmentIdentity,
  nexoraExi4PresentationIdentity,
  nexoraExi5ExperienceIdentity,
};
export {
  NEXORA_EXI2_ENRICHMENT_BOUNDARY,
  NEXORA_EXI3_ENRICHMENT_BOUNDARY,
  phraseNexoraExiRelation,
} from "./nexoraExecutiveIntelligenceExperienceGrounding.ts";
export {
  NEXORA_EXI4_PRESENTATION_BOUNDARY,
  composeNexoraExi4Presentation,
} from "./nexoraExecutiveIntelligenceExperienceExi4.ts";
export {
  NEXORA_EXI5_EXPERIENCE_BOUNDARY,
  composeNexoraExi5OutcomeLearningExperience,
} from "./nexoraExecutiveIntelligenceExperienceExi5.ts";
export type { ExecutiveOutcomeLearningExperience } from "./nexoraExecutiveIntelligenceExperienceExi5.ts";
export type {
  NexoraExiCauseAssessment,
  NexoraExiConstraintAssessment,
  NexoraExiContributor,
  NexoraExiOptionComparison,
  NexoraExiTradeoffAssessment,
  NexoraExiTradeoffOption,
} from "./nexoraExecutiveIntelligenceExperienceGrounding.ts";

export const nexoraExecutiveIntelligenceExperienceIdentity =
  "EXI:1/NexoraExecutiveIntelligenceExperience" as const;

export const nexoraExecutiveIntelligenceExperienceVersion = "3.0.0" as const;

export const nexoraExecutiveIntelligenceExperienceNamespace =
  "nexora.exi.executive-intelligence-experience" as const;

export const nexoraExecutiveIntelligenceExperiencePhase =
  "ExecutiveIntelligenceExperienceIntegration" as const;

export const NEXORA_EXI_EXPERIENCE_BOUNDARY = Object.freeze({
  ownsReasoning: false as const,
  inventsRecommendations: false as const,
  inventsAttention: false as const,
  inventsChangeHistory: false as const,
  inventsOutcome: false as const,
  inventsLearning: false as const,
  writesMemory: false as const,
  writesFocus: false as const,
  commitsDecisions: false as const,
  wiresCc11: false as const,
  usesLlm: false as const,
  inventsCausation: false as const,
  inventsConstraints: false as const,
  inventsTradeoffNumbers: false as const,
  inventsEconomics: false as const,
  presentationCompositionOnly: true as const,
});

export type NexoraExiWorkflowPosition =
  | "reality"
  | "attention"
  | "problem"
  | "scenario"
  | "decision"
  | "execution"
  | "outcome"
  | "learning";

export type NexoraExiEpistemicKind = "fact" | "relationship" | "assumption" | "prediction" | "unknown";

export type NexoraExiFieldAuthority =
  | "professional-advisor"
  | "next-best-action"
  | "decision-brief"
  | "data-reality"
  | "stage-subject"
  | "recorded-relationship"
  | "scenario-fixture"
  | "execution-presentation"
  | "missing";

export type NexoraExiComposedField = Readonly<{
  readonly statement: string | null;
  readonly authority: NexoraExiFieldAuthority;
  readonly epistemic: NexoraExiEpistemicKind;
  readonly confidence: "strong" | "limited" | "incomplete" | "stale" | "none";
}>;

export type NexoraExecutiveIntelligenceExperience = Readonly<{
  readonly identity: typeof nexoraExecutiveIntelligenceExperienceIdentity;
  readonly subjectId: string | null;
  readonly subjectLabel: string | null;
  readonly subjectKind: string | null;
  readonly isOverview: boolean;
  readonly isCollection: boolean;
  readonly situation: NexoraExiComposedField;
  readonly change: NexoraExiComposedField;
  readonly significance: NexoraExiComposedField;
  readonly attentionSubjectId: string | null;
  readonly attentionStatement: NexoraExiComposedField;
  readonly causes: NexoraExiComposedField;
  readonly constraints: NexoraExiComposedField;
  readonly options: NexoraExiComposedField;
  readonly tradeoffs: NexoraExiComposedField;
  readonly recommendation: NexoraExiComposedField;
  readonly nextAction: NexoraExiComposedField;
  readonly evidence: NexoraExiComposedField;
  readonly outcome: NexoraExiComposedField;
  readonly learning: NexoraExiComposedField;
  readonly workflowPosition: NexoraExiWorkflowPosition;
  readonly recommendationAuthority: NexoraProfessionalAdvisorNarrative["recommendationAuthority"];
  readonly enrichment: typeof nexoraExi2EnrichmentIdentity;
  readonly comparisonEnrichment: typeof nexoraExi3EnrichmentIdentity;
  readonly causeAssessment: NexoraExiCauseAssessment;
  readonly constraintAssessment: NexoraExiConstraintAssessment;
  readonly tradeoffAssessment: NexoraExiTradeoffAssessment;
  readonly epistemicFoundation: NexoraSharedEpistemicProjection;
  readonly coreCausalAssessment: CausalAssessment;
  readonly coreConstraintAssessment: ConstraintAssessment;
  readonly corePriorityAssessment: ExecutivePriorityAssessment;
  readonly coreTradeoffAssessment: ExecutiveTradeoffAssessment;
  readonly coreOutcomeAssessment: ExecutiveOutcomeAssessment;
  readonly coreLearningAssessment: GroundedLearningIntelligence;
  readonly outcomeLearning: ExecutiveOutcomeLearningExperience;
  readonly outcomeLearningRuntime: NexoraOutcomeLearningRuntimeSnapshot;
  readonly priority: NexoraExiComposedField;
  readonly presentation: NexoraExi4Presentation;
}>;

export type ComposeNexoraExecutiveIntelligenceExperienceInput = Readonly<{
  readonly narrative: NexoraProfessionalAdvisorNarrative;
  readonly presentationMode?: string | null;
  readonly liveOutcomeAvailable?: boolean;
  readonly liveLearningAvailable?: boolean;
  readonly cc11Live?: boolean;
  readonly validatedDataSource?: boolean;
  readonly advisorBinding?: DataRealityAwareAdvisorBindingResult | null;
  readonly collectionCategory?: string | null;
  readonly flowDecisions?: readonly NexoraMVPFlowDecisionRecord[];
  readonly flowExecutions?: readonly NexoraMVPFlowExecutionRecord[];
  readonly decisionRuntime?: NexoraDecisionRuntimeAdapter | null;
  readonly outcomeObservations?: readonly OutcomeObservationInput[];
  readonly outcomeExpected?: ExecutiveOutcomeExpectation | null;
  readonly outcomeLinkBasis?: OutcomeLinkBasis | null;
  readonly outcomeCommittedAt?: string | null;
  readonly outcomeExecutionStartedAt?: string | null;
  readonly outcomeExecutionCompletedAt?: string | null;
  readonly outcomeExpectedStartAt?: string | null;
  readonly outcomeExpectedEndAt?: string | null;
  readonly outcomeBaselineObservationId?: string | null;
  readonly authorizeApp4Promotion?: boolean;
  readonly currentKpi?: {
    readonly statement: string;
    readonly dimension: string | null;
    readonly numericValue: number | null;
  } | null;
}>;

function field(
  statement: string | null,
  authority: NexoraExiFieldAuthority,
  epistemic: NexoraExiEpistemicKind,
  confidence: NexoraExiComposedField["confidence"],
  claim?: SharedEpistemicClaim | null,
): NexoraExiComposedField {
  if (claim) {
    const core = applyCoreEpistemicToField({
      claim,
      statement,
      authority,
      requestedConfidence: confidence,
    });
    return Object.freeze({
      statement,
      authority,
      epistemic: core.epistemic,
      confidence: core.confidence,
    });
  }
  return Object.freeze({ statement, authority, epistemic, confidence });
}

function missing(statement: string): NexoraExiComposedField {
  return field(statement, "missing", "unknown", "none");
}

function labelFor(id: string): string {
  return (
    NEXORA_MVP_STAGE_OBJECT_FIXTURES.find((entry) => entry.id === id)?.label ??
    NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES.find((entry) => entry.id === id)?.label ??
    id
  );
}

function workflowPosition(
  narrative: NexoraProfessionalAdvisorNarrative,
  isCollection: boolean,
): NexoraExiWorkflowPosition {
  if (isCollection) return "attention";
  switch (narrative.grammarKind) {
    case "problem":
    case "opportunity":
    case "risk":
      return "problem";
    case "scenario":
      return "scenario";
    case "decision":
      return "decision";
    case "execution":
      return "execution";
    case "overview":
      return narrative.attentionSubjectId != null ? "attention" : "reality";
    default:
      return "reality";
  }
}

function relatedContextIds(subjectId: string | null): readonly string[] {
  if (subjectId == null) return [];
  const fromLinks = NEXORA_MVP_CONTEXT_LINK_FIXTURES.filter(
    (link) => link.objectId === subjectId || link.contextId === subjectId,
  ).map((link) => (link.objectId === subjectId ? link.contextId : link.objectId));
  const fromRels = NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES.filter(
    (rel) => rel.sourceId === subjectId || rel.targetId === subjectId,
  ).map((rel) => (rel.sourceId === subjectId ? rel.targetId : rel.sourceId));
  return Object.freeze([...new Set([...fromLinks, ...fromRels])]);
}

function composeChange(
  narrative: NexoraProfessionalAdvisorNarrative,
  observation?: SharedEpistemicClaim | null,
): NexoraExiComposedField {
  if (narrative.recentChange) {
    return field(narrative.recentChange, "professional-advisor", "fact", narrative.evidenceState, observation);
  }
  if (narrative.isOverview && narrative.attentionSubjectLabel) {
    return field(
      `${narrative.attentionSubjectLabel} currently needs attention. Nexora does not have a validated prior-state comparison in this session.`,
      "professional-advisor",
      "fact",
      "limited",
      observation,
    );
  }
  if (narrative.currentSubjectLabel && narrative.currentSubjectState) {
    return field(
      `${narrative.currentSubjectLabel} currently needs attention. Nexora does not have a validated prior-state comparison in this session.`,
      "stage-subject",
      "fact",
      "limited",
      observation,
    );
  }
  return missing(
    "No meaningful validated change is available in this session.",
  );
}

function composeOptions(
  narrative: NexoraProfessionalAdvisorNarrative,
  prediction?: SharedEpistemicClaim | null,
): NexoraExiComposedField {
  if (narrative.grammarKind === "scenario") {
    return field(
      `${narrative.currentSubjectLabel ?? "This scenario"} is a projected alternative, not observed reality.`,
      "scenario-fixture",
      "prediction",
      "limited",
      prediction,
    );
  }
  const subjectId = narrative.currentSubjectId;
  const scenarios = relatedContextIds(subjectId).filter((id) =>
    NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES.some(
      (entry) => entry.id === id && entry.kind === "scenario",
    ),
  );
  if (narrative.isOverview) {
    return missing("No evaluated scenario is in focus. Open Scenarios when you want to inspect alternatives.");
  }
  if (scenarios.length === 0) {
    return missing("No evaluated option is currently available for this issue.");
  }
  if (scenarios.length === 1) {
    return field(
      `${labelFor(scenarios[0]!)} is the available alternative. Nexora is not presenting a comparison because only one evaluated scenario exists.`,
      "scenario-fixture",
      "prediction",
      "limited",
      prediction,
    );
  }
  return field(
    `Available alternatives include ${scenarios.map(labelFor).join(" and ")}. These are evaluated possibilities, not observed facts.`,
    "scenario-fixture",
    "prediction",
    "limited",
    prediction,
  );
}

function recommendationAuthorityField(
  narrative: NexoraProfessionalAdvisorNarrative,
): NexoraExiFieldAuthority {
  switch (narrative.recommendationAuthority) {
    case "nba":
      return "next-best-action";
    case "decision-brief":
      return "decision-brief";
    case "data-reality":
      return "data-reality";
    case "advisor-intelligence":
      return "professional-advisor";
    default:
      return "missing";
  }
}

export function composeNexoraExecutiveIntelligenceExperience(
  input: ComposeNexoraExecutiveIntelligenceExperienceInput,
): NexoraExecutiveIntelligenceExperience {
  const isCollection = input.presentationMode === "collection";
  const narrative = input.narrative;
  const subjectId = isCollection ? null : narrative.currentSubjectId;
  const isOverview = isCollection || narrative.isOverview || subjectId == null;
  const epistemicFoundation = projectNexoraLiveSharedEpistemicFoundation({
    narrative,
    presentationMode: input.presentationMode,
    validatedDataSource: input.validatedDataSource,
    advisorBinding: input.advisorBinding,
  });
  const observationClaim = epistemicFoundation.observation;
  const interpretationClaim = epistemicFoundation.interpretation;
  const predictionClaim = epistemicFoundation.prediction;
  const confidence = narrative.evidenceState;
  const recommendationAuth = recommendationAuthorityField(narrative);

  const situation = field(
    isOverview && isCollection
      ? "This is a collection of related work. Nexora has not selected a member as the current subject."
      : narrative.situation,
    "professional-advisor",
    "fact",
    confidence,
    observationClaim,
  );

  const significance = field(
    narrative.whyItMatters,
    "professional-advisor",
    narrative.whyItMatters?.includes("related") ? "relationship" : "fact",
    confidence,
    interpretationClaim,
  );

  const attentionStatement = field(
    isOverview ? narrative.attentionReason : null,
    "professional-advisor",
    "fact",
    "limited",
  );

  const recommendation = narrative.recommendation
    ? field(
        [
          narrative.recommendation,
          narrative.recommendationRationale,
        ]
          .filter(Boolean)
          .join(" "),
        recommendationAuth,
        "assumption",
        confidence === "strong" ? "strong" : "limited",
      )
    : field(
        narrative.noRecommendationReason,
        "missing",
        "unknown",
        confidence,
      );

  const nextAction = field(
    narrative.primaryAction?.label ?? null,
    narrative.primaryAction?.source === "nba" ? "next-best-action" : "professional-advisor",
    "assumption",
    confidence,
  );

  const evidence = field(
    narrative.evidenceSummary,
    narrative.evidenceState === "none" ? "missing" : "professional-advisor",
    "fact",
    narrative.evidenceState,
    observationClaim ?? focusedSharedEpistemicClaim(epistemicFoundation),
  );

  const executionSafe = narrative.grammarKind === "execution"
    ? field(
        input.cc11Live === true
          ? narrative.situation
          : `${narrative.situation ?? "This Execution is recorded."} Nexora is not tracking live delivery intelligence.`,
        "execution-presentation",
        "fact",
        "limited",
      )
    : situation;

  const focusedNarrative = isOverview
    ? { ...narrative, isOverview: true, currentSubjectId: null, currentSubjectLabel: null }
    : narrative;
  const coreIntelligence = projectNexoraLiveCausalConstraintIntelligence({
    narrative: focusedNarrative,
    presentationMode: input.presentationMode,
  });
  const causeAssessment = composeNexoraExiCauseAssessment(focusedNarrative, {
    epistemic: interpretationClaim,
    core: coreIntelligence.causal,
  });
  const constraintAssessment = composeNexoraExiConstraintAssessment(focusedNarrative, {
    core: coreIntelligence.constraint,
  });
  const coreTradeoffAssessment = projectNexoraLiveExecutiveTradeoffIntelligence({
    narrative: isOverview ? focusedNarrative : narrative,
    presentationMode: input.presentationMode,
  });
  const tradeoffAssessment = composeNexoraExiTradeoffAssessment(
    isOverview ? focusedNarrative : narrative,
    { epistemic: predictionClaim, core: coreTradeoffAssessment },
  );
  const corePriorityAssessment = projectNexoraLiveExecutivePriorityIntelligence({
    narrative,
    presentationMode: input.presentationMode,
    collectionCategory: input.collectionCategory,
  });
  const currentKpi = input.currentKpi ?? null;
  const runtimeIntegration = integrateNexoraOutcomeLearningRuntime({
    workspaceId: "nexora-mvp",
    subjectId: isOverview ? null : narrative.currentSubjectId,
    subjectKind: isOverview ? null : narrative.currentSubjectKind,
    currentKpi,
    expected: input.outcomeExpected,
    collectLiveExpected: input.outcomeExpected === undefined,
    flowDecisions: input.flowDecisions,
    flowExecutions: input.flowExecutions,
    decisionRuntime: input.decisionRuntime ?? null,
    observations: input.outcomeObservations,
    linkBasis: input.outcomeLinkBasis,
    committedAt: input.outcomeCommittedAt,
    executionStartedAt: input.outcomeExecutionStartedAt,
    executionCompletedAt: input.outcomeExecutionCompletedAt,
    expectedStartAt: input.outcomeExpectedStartAt,
    expectedEndAt: input.outcomeExpectedEndAt,
    baselineObservationId: input.outcomeBaselineObservationId,
    recentChangePresent: narrative.recentChange != null,
    recommendationPresent: narrative.recommendation != null,
    causal: coreIntelligence.causal,
    constraint: coreIntelligence.constraint,
    authorizeApp4Promotion: input.authorizeApp4Promotion === true,
    advisorBinding: input.advisorBinding ?? null,
    validatedDataSource: input.validatedDataSource === true,
    executionSubject: narrative.grammarKind === "execution",
  } satisfies IntegrateNexoraOutcomeLearningRuntimeInput);
  const coreOutcomeAssessment = runtimeIntegration.assessment;
  const coreLearningAssessment = runtimeIntegration.learning;
  const outcomeLearning = runtimeIntegration.experience;
  const outcome = coreOutcomeAssessment.actualOutcome
    ? field(
        outcomeLearning.outcomeAssessment,
        "data-reality",
        "fact",
        "limited",
      )
    : missing(outcomeLearning.outcomeAssessment);
  const learning = missing(outcomeLearning.learningStatement);
  const priorityStatement = presentPriorityAssessment(corePriorityAssessment);
  const priority = corePriorityAssessment.topPriority
    ? field(priorityStatement, "recorded-relationship", "assumption", "limited")
    : missing(priorityStatement);

  const draft = Object.freeze({
    identity: nexoraExecutiveIntelligenceExperienceIdentity,
    enrichment: nexoraExi2EnrichmentIdentity,
    comparisonEnrichment: nexoraExi3EnrichmentIdentity,
    subjectId,
    subjectLabel: isOverview ? null : narrative.currentSubjectLabel,
    subjectKind: isOverview ? null : narrative.currentSubjectKind,
    isOverview,
    isCollection,
    situation: narrative.grammarKind === "execution" ? executionSafe : situation,
    change: composeChange(focusedNarrative, observationClaim),
    significance,
    attentionSubjectId: isOverview ? narrative.attentionSubjectId : null,
    attentionStatement,
    causes: causeAssessment.summary,
    constraints: constraintAssessment.summary,
    options: composeOptions(focusedNarrative, predictionClaim),
    tradeoffs: tradeoffAssessment.summary,
    recommendation,
    nextAction,
    evidence,
    outcome,
    learning,
    workflowPosition: workflowPosition(narrative, isCollection),
    recommendationAuthority: narrative.recommendationAuthority,
    causeAssessment,
    constraintAssessment,
    tradeoffAssessment,
    epistemicFoundation,
    coreCausalAssessment: coreIntelligence.causal,
    coreConstraintAssessment: coreIntelligence.constraint,
    corePriorityAssessment,
    coreTradeoffAssessment,
    coreOutcomeAssessment,
    coreLearningAssessment,
    outcomeLearning,
    outcomeLearningRuntime: runtimeIntegration.snapshot,
    priority,
  });
  return Object.freeze({
    ...draft,
    presentation: composeNexoraExi4Presentation(draft),
  });
}

export function applyNexoraExecutiveIntelligenceExperienceToAdvisor(
  narrative: NexoraProfessionalAdvisorNarrative,
  experience: NexoraExecutiveIntelligenceExperience,
): NexoraProfessionalAdvisorNarrative {
  const tradeoffLines =
    narrative.tradeoffs.length > 0
      ? narrative.tradeoffs
      : experience.tradeoffAssessment.options.map((option) => option.label);

  return Object.freeze({
    ...narrative,
    currentSubjectId: experience.subjectId,
    currentSubjectLabel: experience.subjectLabel,
    isOverview: experience.isOverview,
    whyItMatters: narrative.whyItMatters,
    recentChange:
      narrative.recentChange ??
      (experience.change.authority === "missing" ? narrative.recentChange : experience.change.statement),
    situation: experience.situation.statement ?? narrative.situation,
    tradeoffs: Object.freeze([...tradeoffLines]),
  });
}

export type NexoraExiConversationalAnswerKey =
  | "change"
  | "significance"
  | "causes"
  | "constraints"
  | "options"
  | "tradeoffs"
  | "recommendation"
  | "nextAction"
  | "outcome"
  | "learning"
  | "didItWork"
  | "whatHappened"
  | "whyOutcome"
  | "historicalLearning"
  | "whatExpected"
  | "outcomeConfidence"
  | "confidence"
  | "evidenceFollowup"
  | "compare"
  | "downside"
  | "sacrifice"
  | "preventing"
  | "gain"
  | "safer"
  | "cheaper"
  | "faster"
  | "assumptions"
  | "missingDimension"
  | "factOrAssumption"
  | "whatAssuming"
  | "whatPredicted"
  | "whatUnknown"
  | "proven"
  | "binding"
  | "priority"
  | "whyPriority"
  | "comparePriority"
  | "secondPriority"
  | "attentionVersusPriority"
  | "insufficientPriority"
  | "priorityConfidence"
  | "priorityEvidence"
  | "constraintComparison"
  | "tradeoffConfidence";

function claimForAnswerKey(
  experience: NexoraExecutiveIntelligenceExperience,
  key: NexoraExiConversationalAnswerKey | null,
): SharedEpistemicClaim {
  const pack = experience.epistemicFoundation;
  if (
    key === "causes" ||
    key === "significance" ||
    key === "preventing" ||
    key === "whatAssuming" ||
    key === "proven" ||
    key === "binding"
  ) {
    return claimForExperienceRole(pack, "interpretation");
  }
  if (key === "options" || key === "tradeoffs" || key === "whatPredicted") {
    return claimForExperienceRole(pack, "prediction");
  }
  if (key === "whatUnknown") return claimForExperienceRole(pack, "unknown");
  if (key === "change") return claimForExperienceRole(pack, "observation");
  return focusedSharedEpistemicClaim(pack);
}

export function projectNexoraExiConversationalAnswers(
  experience: NexoraExecutiveIntelligenceExperience,
): Readonly<Record<NexoraExiConversationalAnswerKey, string>> {
  const fallback = "Nexora does not have enough validated evidence to answer that yet.";
  const tradeoffs = experience.tradeoffs.statement ?? fallback;
  const constraints = experience.constraints.statement ?? fallback;
  const comparison = composeNexoraExiComparisonFollowups(
    experience.tradeoffAssessment,
    experience.coreTradeoffAssessment,
  );
  const focused = focusedSharedEpistemicClaim(experience.epistemicFoundation);
  const interpretation = claimForExperienceRole(experience.epistemicFoundation, "interpretation");
  const prediction = claimForExperienceRole(experience.epistemicFoundation, "prediction");
  const unknown = claimForExperienceRole(experience.epistemicFoundation, "unknown");
  return Object.freeze({
    change: experience.change.statement ?? fallback,
    significance: experience.significance.statement ?? fallback,
    causes: experience.causes.statement ?? fallback,
    constraints,
    options: experience.options.statement ?? fallback,
    tradeoffs,
    recommendation: experience.recommendation.statement ?? fallback,
    nextAction: experience.nextAction.statement
      ? `Next: ${experience.nextAction.statement}.`
      : fallback,
    outcome: experience.outcomeLearning.outcomeAssessment,
    learning: experience.outcomeLearning.learningStatement,
    didItWork: experience.outcomeLearning.didItWorkStatement,
    whatHappened: experience.outcomeLearning.whatHappenedStatement,
    whyOutcome: experience.outcomeLearning.whyStatement,
    historicalLearning: experience.outcomeLearning.historicalStatement,
    whatExpected: experience.outcomeLearning.expectedOutcome,
    outcomeConfidence: experience.outcomeLearning.confidenceStatement,
    confidence:
      experience.coreCausalAssessment.contributors.length > 0
        ? "Evidence limited. These are possible contributors from recorded relationships, not proven causes."
        : presentExecutiveConfidence(focused),
    evidenceFollowup:
      experience.coreCausalAssessment.contributors.length > 0 ||
      experience.coreCausalAssessment.relatedFactors.length > 0
        ? presentContributorEvidence(experience.coreCausalAssessment)
        : presentExecutiveEvidence(focused),
    compare: tradeoffs,
    downside: comparison.sacrifice,
    sacrifice: comparison.sacrifice,
    preventing: constraints,
    gain: comparison.gain,
    safer: comparison.safer,
    cheaper: comparison.cheaper,
    faster: comparison.faster,
    assumptions:
      experience.coreTradeoffAssessment.options.length > 0
        ? comparison.assumptions
        : interpretation.managerStatement,
    missingDimension: comparison.missingDimension,
    factOrAssumption: `${presentExecutiveClaimKind(focused.claim.type)} ${focused.managerStatement}`,
    whatAssuming: interpretation.managerStatement,
    whatPredicted: prediction.managerStatement,
    whatUnknown: unknown.managerStatement,
    proven: presentProvenAnswer(experience.coreCausalAssessment),
    binding: presentBindingAnswer(experience.coreConstraintAssessment),
    priority: experience.priority.statement ?? presentPriorityAssessment(experience.corePriorityAssessment),
    whyPriority:
      experience.corePriorityAssessment.rationale[0] ??
      presentPriorityAssessment(experience.corePriorityAssessment),
    comparePriority: presentPriorityComparison(experience.corePriorityAssessment),
    secondPriority: presentSecondPriority(experience.corePriorityAssessment),
    attentionVersusPriority: presentAttentionVersusPriority(experience.corePriorityAssessment),
    insufficientPriority:
      "If evidence is insufficient to distinguish candidates, Nexora does not force a ranking. That is a valid priority result.",
    priorityConfidence: presentPriorityConfidence(experience.corePriorityAssessment),
    priorityEvidence: presentPriorityEvidence(experience.corePriorityAssessment),
    constraintComparison: comparison.constraintComparison,
    tradeoffConfidence: presentTradeoffConfidence(experience.coreTradeoffAssessment),
  });
}

function presentPriorityComparison(assessment: ExecutivePriorityAssessment): string {
  const left =
    assessment.topPriority?.subjectLabel ??
    assessment.candidates.find((entry) => entry.eligibleKind === "risk")?.subjectLabel ??
    assessment.candidates[0]?.subjectLabel;
  const right =
    assessment.candidates.find(
      (entry) =>
        entry.subjectLabel !== left &&
        (entry.eligibleKind === "problem" || entry.subjectLabel === "Capacity"),
    )?.subjectLabel ?? assessment.candidates.find((entry) => entry.subjectLabel !== left)?.subjectLabel;
  if (left == null || right == null) {
    return presentPriorityAssessment(assessment);
  }
  return presentWhyAOverB(assessment, left, right);
}

function factAnswerForPreviousKey(
  answers: Readonly<Partial<Record<NexoraExiConversationalAnswerKey, string>>>,
  previous: NexoraExiConversationalAnswerKey | null,
): string | null {
  if (previous === "change") return answers.change ?? null;
  if (previous === "causes" || previous === "significance") return answers.whatAssuming ?? answers.factOrAssumption ?? null;
  if (previous === "options" || previous === "tradeoffs") return answers.whatPredicted ?? null;
  return answers.factOrAssumption ?? null;
}

export function answerNexoraExiUtterance(
  answers: Readonly<Partial<Record<NexoraExiConversationalAnswerKey, string>>> | null | undefined,
  utterance: string,
  previousUtterance?: string | null,
): string | null {
  const key = classifyNexoraExiUtterance(utterance);
  const previous = previousUtterance
    ? classifyNexoraExiUtterance(previousUtterance)
    : null;
  if (key == null || answers == null) return null;
  if (key === "factOrAssumption") {
    const focused = factAnswerForPreviousKey(answers, previous);
    if (focused && previous === "change") {
      return `Current data confirms that. ${focused}`;
    }
    if (focused) return answers.factOrAssumption ?? focused;
  }
  if (key === "proven") {
    return answers.proven ?? answers.factOrAssumption ?? null;
  }
  if (key === "binding") {
    return answers.binding ?? answers.constraints ?? null;
  }
  if (key === "evidenceFollowup" && (previous === "causes" || previous === "proven")) {
    return answers.evidenceFollowup ?? answers.causes ?? null;
  }
  if (
    (key === "confidence" || key === "evidenceFollowup") &&
    (previous === "outcome" ||
      previous === "learning" ||
      previous === "didItWork" ||
      previous === "whatHappened" ||
      previous === "whyOutcome")
  ) {
    return key === "confidence"
      ? (answers.outcomeConfidence ?? answers.confidence ?? null)
      : (answers.outcome ?? answers.evidenceFollowup ?? null);
  }
  if (
    (key === "confidence" || key === "evidenceFollowup") &&
    (previous === "priority" ||
      previous === "whyPriority" ||
      previous === "comparePriority" ||
      previous === "secondPriority")
  ) {
    return key === "confidence"
      ? (answers.priorityConfidence ??
        "Evidence is not strong enough to rank one issue over the others. This is not the same as causal confidence.")
      : (answers.priorityEvidence ?? answers.priority ?? answers.evidenceFollowup ?? null);
  }
  if (
    (key === "confidence" || key === "evidenceFollowup") &&
    (previous === "compare" ||
      previous === "tradeoffs" ||
      previous === "gain" ||
      previous === "sacrifice" ||
      previous === "safer" ||
      previous === "cheaper" ||
      previous === "faster" ||
      previous === "assumptions" ||
      previous === "constraintComparison")
  ) {
    return key === "confidence"
      ? (answers.tradeoffConfidence ?? answers.confidence ?? null)
      : (answers.compare ?? answers.evidenceFollowup ?? null);
  }
  if (key === "whyPriority" && previous === "priority") {
    return answers.whyPriority ?? answers.priority ?? null;
  }
  if (key === "whyPriority" && previous === "recommendation") {
    return answers.recommendation ?? null;
  }
  if (key === "whyPriority") {
    return null;
  }
  if (key === "significance") {
    if (
      previous === "priority" ||
      previous === "whyPriority" ||
      previous === "attentionVersusPriority" ||
      previous === "comparePriority" ||
      previous === "secondPriority"
    ) {
      return answers.significance ?? null;
    }
    return null;
  }
  const text =
    answers[key] ??
    (key === "confidence"
      ? previous === "priority"
        ? answers.priority
        : answers.causes
      : undefined) ??
    (key === "evidenceFollowup" ? answers.causes : undefined) ??
    (key === "compare" || key === "downside" || key === "sacrifice"
      ? answers.tradeoffs
      : undefined) ??
    (key === "preventing" ? answers.constraints : undefined) ??
    (key === "gain" ||
    key === "safer" ||
    key === "cheaper" ||
    key === "faster" ||
    key === "assumptions" ||
    key === "missingDimension"
      ? answers.tradeoffs
      : undefined) ??
    null;
  return text && text.trim().length > 0 ? text : null;
}

export function classifyNexoraExiUtterance(
  utterance: string,
): NexoraExiConversationalAnswerKey | null {
  const text = utterance.toLowerCase().replace(/[?!.,]/g, " ").replace(/\s+/g, " ").trim();
  if (
    /^is that proven$|^is this proven$|^is that a proven cause$|^is this proven causation$/.test(
      text,
    )
  ) {
    return "proven";
  }
  if (
    /^is that a fact$|^is this a fact$|^are you assuming that$|^is that a fact or an assumption$|^is this a fact or an assumption$/.test(
      text,
    )
  ) {
    return "factOrAssumption";
  }
  if (/^what are you assuming$|^what are we assuming$/.test(text)) return "whatAssuming";
  if (/^is this a prediction$|^what is predicted$|^what are you predicting$/.test(text)) {
    return "whatPredicted";
  }
  if (
    /^what don'?t we know$|^what do we not know$|^what remains unknown$|^what is unknown$/.test(
      text,
    )
  ) {
    return "whatUnknown";
  }
  if (
    /^what if the evidence is insufficient$/.test(text)
  ) {
    return "insufficientPriority";
  }
  if (
    /^what matters most(?: right now)?$|^what should i deal with first$|^which (?:problem|issue) is the priority$|^what is the priority$/.test(
      text,
    )
  ) {
    return "priority";
  }
  if (
    /^what is (?:the )?second priority$|^what is next priority$/.test(text)
  ) {
    return "secondPriority";
  }
  if (
    /^why (?:is )?.{0,40}(?:more important than|instead of|over) .{0,40}$|^why this instead of the other problem$|^why (?:risk|this) instead of capacity$/.test(
      text,
    )
  ) {
    return "comparePriority";
  }
  if (/^is that attention or priority$|^is attention the same as priority$/.test(text)) {
    return "attentionVersusPriority";
  }
  if (
    /^what(?: has|s)? changed$|^what is different$|^has \w+(?: \w+)? changed$|^is it getting worse$|^compare (?:it|this) with before$/.test(
      text,
    )
  ) {
    return "change";
  }
  if (/^why$/.test(text)) return "whyPriority";
  if (/^why does (?:this|it) matter$|^why is (?:this|it) important$/.test(text)) return "significance";
  if (
    /^why is this happening$|^why is \w+(?: \w+)? (?:happening|under pressure|occurring)$|^what is causing this$|^what may be causing this$|^what may be contributing to this$|^what is contributing to this$|^what is driving this$/.test(
      text,
    )
  ) {
    return "causes";
  }
  if (
    /^which (?:constraint|one) is binding$|^which constraint is binding$|^is (?:that|this) (?:constraint )?binding$/.test(
      text,
    )
  ) {
    return "binding";
  }
  if (
    /^what is blocking (?:us|success|this)$|^what(?:'s| is) blocking (?:us|this)$|^what is the constraint$|^what is preventing success$|^what is limiting \w+$|^what is constraining (?:us|this|progress)$/.test(
      text,
    )
  ) {
    return "constraints";
  }
  if (/^what are my options$|^what options do i have$/.test(text)) return "options";
  if (/^what are the trade[- ]?offs(?: of .+)?$/.test(text)) return "tradeoffs";
  if (/^compare the options$/.test(text)) return "compare";
  if (
    /^which option addresses the constraint$|^which one addresses the constraint$|^which option addresses the constraint better$/.test(
      text,
    )
  ) {
    return "constraintComparison";
  }
  if (/^what is the downside$/.test(text)) return "downside";
  if (
    /^what are we sacrificing$|^what do we gain and lose$|^what do i lose$|^what do i sacrifice$|^what do we sacrifice$/.test(
      text,
    )
  ) {
    return "sacrifice";
  }
  if (
    /^what do i gain(?: with each option)?$|^what do we gain$|^what do we gain with the first one$|^what do i gain with each option$/.test(
      text,
    )
  ) {
    return "gain";
  }
  if (/^which one is safer$|^which one has more risk$/.test(text)) return "safer";
  if (/^which is cheaper$|^which one is cheaper$|^which option is constrained by budget$/.test(text)) {
    return "cheaper";
  }
  if (/^which is faster$|^which one is faster$/.test(text)) return "faster";
  if (
    /^what assumptions (?:does this option depend on|are we making|matter)$|^what assumptions are we making$|^what assumptions matter$/.test(
      text,
    )
  ) {
    return "assumptions";
  }
  if (/^what is still uncertain$/.test(text)) return "confidence";
  if (/^how sure are you$|^how confident are you$/.test(text)) return "confidence";
  if (/^how sure are we$|^how confident are we$/.test(text)) return "outcomeConfidence";
  if (
    /^what did we expect$|^what was expected$|^what was the expected outcome$/.test(
      text,
    )
  ) {
    return "whatExpected";
  }
  if (
    /^why do you say that$|^why do you think that$|^what evidence supports (?:that|it)$/.test(
      text,
    )
  ) {
    return "evidenceFollowup";
  }
  if (
    /^what do you recommend$|^what should we do$|^which option do you recommend$|^which option does nexora recommend$/.test(
      text,
    )
  ) {
    return "recommendation";
  }
  if (/^what should i do next$/.test(text)) return "nextAction";
  if (
    /^did (?:the decision|it|this) work$|^did we meet the (?:expected )?outcome$/.test(
      text,
    )
  ) {
    return "didItWork";
  }
  if (/^what happened$|^what actually happened$/.test(text)) return "whatHappened";
  if (
    /^why did (?:this|it) happen$|^why did the outcome happen$|^do we know why this happened$/.test(
      text,
    )
  ) {
    return "whyOutcome";
  }
  if (
    /^do we have similar historical learning$|^what (?:relevant )?historical learning exists$|^what historical learning do we have$|^what have we learned before$/.test(
      text,
    )
  ) {
    return "historicalLearning";
  }
  if (/^what was the outcome$|^what was the result$/.test(text)) return "outcome";
  if (/^what did we learn$|^what have we learned$/.test(text)) return "learning";
  return null;
}
