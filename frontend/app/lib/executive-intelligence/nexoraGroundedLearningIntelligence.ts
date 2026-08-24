/**
 * CORE-OUT:2 — Grounded Learning Intelligence.
 *
 * Interprets what Nexora is justified in learning from canonical Outcome
 * evidence. Does not evaluate expected-vs-actual, capture observations,
 * establish causality, recommend action, or persist durable memory.
 */

import type { NexoraExecutiveEvidenceReference } from "../conversational-control/executiveRecommendation.ts";
import {
  persistDurableExecutiveMemory,
  retrieveRelevantDurableExecutiveMemory,
} from "../executiveMemory/durableExecutiveMemory.ts";
import { getExecutiveMemoryById } from "../executiveMemory/executiveMemoryStorageEngine.ts";
import type { ExecutiveMemoryRecord } from "../executiveMemory/executiveMemoryRecord.ts";
import type { ExecutiveMemoryStorageResult, ExecutiveMemoryStoredRecord } from "../executiveMemory/executiveMemoryStorageTypes.ts";
import type {
  EvidenceStrength,
  SemanticConfidence,
} from "./problemRiskOpportunityIntelligence.ts";
import type { ExecutiveOutcomeAssessment } from "./nexoraLiveOutcomeIntelligence.ts";
import { nexoraLiveOutcomeIntelligenceIdentity } from "./nexoraLiveOutcomeIntelligence.ts";
import type { OutcomeObservationCaptureAssessment } from "./nexoraLiveOutcomeObservationCapture.ts";
import { nexoraLiveOutcomeObservationCaptureIdentity } from "./nexoraLiveOutcomeObservationCapture.ts";
import type {
  CausalAssessment,
  ConstraintAssessment,
} from "./nexoraGroundedCausalConstraintIntelligence.ts";
import { nexoraGroundedCausalConstraintIntelligenceIdentity } from "./nexoraGroundedCausalConstraintIntelligence.ts";
import { nexoraSharedEpistemicFoundationIdentity } from "./nexoraSharedEpistemicFoundation.ts";

export const nexoraGroundedLearningIntelligenceIdentity =
  "CORE-OUT:2/GroundedLearningIntelligence" as const;
export const nexoraGroundedLearningIntelligenceVersion = "1.0.0" as const;
export const nexoraGroundedLearningIntelligenceNamespace =
  "nexora.core.grounded-learning-intelligence" as const;

export const GROUNDED_LEARNING_BOUNDARY = Object.freeze({
  role: "grounded-learning-interpretation-and-promotion-eligibility" as const,
  outcomeObservationAuthority: "CORE-OUT:1A/LiveOutcomeObservationCapture" as const,
  outcomeEvaluationAuthority: "CORE-OUT:1/LiveOutcomeIntelligence" as const,
  epistemicAuthority: "CORE-INT:2/SharedEpistemicUncertaintyFoundation" as const,
  causalAuthority: "CORE-INT:3/GroundedCausalConstraintIntelligence" as const,
  durableMemoryAuthority: "APP-4/ExecutiveMemoryStorageEngine" as const,
  evaluatesOutcome: false as const,
  capturesObservation: false as const,
  infersCausality: false as const,
  recommendsAction: false as const,
  writesMemory: false as const,
  ownsDurableStore: false as const,
  mutatesDecision: false as const,
  mutatesExecution: false as const,
  mutatesOutcome: false as const,
  mutatesObservation: false as const,
  mutatesStage: false as const,
  usesLlm: false as const,
  startsExi5: false as const,
  wiresCc11: false as const,
  currentKpiEqualsLearning: false as const,
  executionCompletionEqualsLearning: false as const,
  outcomeEqualsLearning: false as const,
  successEqualsCausalProof: false as const,
  failureEqualsBadDecision: false as const,
  temporalSequenceEqualsCause: false as const,
  predictionAccuracyEqualsCausalCorrectness: false as const,
  singleCaseEqualsGeneralRule: false as const,
  isExiWriter: false as const,
});

export type GroundedLearningType =
  | "outcome-learning"
  | "assumption-learning"
  | "constraint-learning"
  | "causal-learning"
  | "process-learning"
  | "prediction-learning";

export type GroundedLearningStatus =
  | "candidate"
  | "supported"
  | "inconclusive"
  | "contradicted"
  | "conflicting";

export type GroundedLearningScope = "case-specific" | "generalized";
export type GroundedRepeatability =
  | "single-case"
  | "repeated-consistent"
  | "repeated-mixed"
  | "insufficient-history";
export type GroundedPromotionClass =
  | "case-specific"
  | "generalized"
  | "not-eligible";

export type CoreInt3CausalFinding = Readonly<{
  readonly findingId: string;
  readonly supported: boolean;
  readonly hypothesisOnly: boolean;
  readonly conflicting: boolean;
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  readonly provenanceRefs: readonly string[];
}>;

export type GroundedAssumptionLink = Readonly<{
  readonly assumptionId: string;
  readonly statement: string;
  readonly linkage: "explicit-target-binding" | "none";
  readonly observation: "supports" | "challenges" | "inconclusive";
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  readonly provenanceRefs: readonly string[];
}>;

export type GroundedPredictionLink = Readonly<{
  readonly predictionId: string;
  readonly expectedValue: number | null;
  readonly actualValue: number | null;
  readonly matched: boolean | null;
  readonly originalPredictionStatement: string;
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  readonly provenanceRefs: readonly string[];
}>;

export type GroundedLearningCandidate = Readonly<{
  readonly identity: typeof nexoraGroundedLearningIntelligenceIdentity;
  readonly learningId: string;
  readonly version: number;
  readonly previousLearningId: string | null;
  readonly workspaceId: string;
  readonly subjectId: string | null;
  readonly learningType: GroundedLearningType;
  readonly statement: string;
  readonly status: GroundedLearningStatus;
  readonly scope: GroundedLearningScope;
  readonly confidence: SemanticConfidence;
  readonly evidenceStrength: EvidenceStrength;
  readonly createdAt: string;
  readonly decisionRefs: readonly string[];
  readonly executionRefs: readonly string[];
  readonly scenarioRefs: readonly string[];
  readonly issueRefs: readonly string[];
  readonly expectedOutcomeRefs: readonly string[];
  readonly outcomeAssessmentRefs: readonly string[];
  readonly observationRefs: readonly string[];
  readonly causalFindingRefs: readonly string[];
  readonly constraintFindingRefs: readonly string[];
  readonly assumptionRefs: readonly string[];
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  readonly provenanceRefs: readonly string[];
  readonly uncertainty: readonly string[];
  readonly repeatability: GroundedRepeatability;
  readonly contradictions: readonly string[];
  readonly freshness: "current" | "stale" | "unknown" | "historical";
  readonly promotionEligibility: "promotion-eligible" | "not-promotion-eligible";
  readonly establishesCausation: false;
  readonly recommendsAction: false;
  readonly isCurrentTruth: false;
}>;

export type LearningPromotionAssessment = Readonly<{
  readonly learningId: string;
  readonly eligible: boolean;
  readonly reasons: readonly string[];
  readonly evidenceStrength: EvidenceStrength;
  readonly provenanceComplete: boolean;
  readonly uncertaintyAcceptable: boolean;
  readonly conflictState: GroundedLearningStatus;
  readonly causalSupportRequired: boolean;
  readonly causalSupportPresent: boolean;
  readonly repeatability: GroundedRepeatability;
  readonly promotionClass: GroundedPromotionClass;
  readonly memoryAuthority: "APP-4";
}>;

export type ProjectGroundedLearningInput = Readonly<{
  readonly workspaceId: string;
  readonly subjectId: string | null;
  readonly createdAt: string;
  readonly assessment?: ExecutiveOutcomeAssessment | null;
  readonly capture?: OutcomeObservationCaptureAssessment | null;
  readonly causal?: CausalAssessment | null;
  readonly constraint?: ConstraintAssessment | null;
  readonly causalFinding?: CoreInt3CausalFinding | null;
  readonly assumption?: GroundedAssumptionLink | null;
  readonly prediction?: GroundedPredictionLink | null;
  readonly decisionId?: string | null;
  readonly executionId?: string | null;
  readonly scenarioId?: string | null;
  readonly issueId?: string | null;
  readonly realityId?: string | null;
  readonly comparableHistory?: readonly GroundedLearningCandidate[];
  readonly currentKpiOnly?: boolean;
  readonly observationWithoutAssessment?: boolean;
  readonly expectedOnly?: boolean;
  readonly executionCompleteOnly?: boolean;
  readonly presentationOnly?: boolean;
  readonly recommendationOnly?: boolean;
  readonly requestGeneralized?: boolean;
  readonly requestCausalClaim?: boolean;
  readonly explicitProcessRule?: boolean;
  readonly executionComplete?: boolean;
}>;

export type GroundedLearningIntelligence = Readonly<{
  readonly identity: typeof nexoraGroundedLearningIntelligenceIdentity;
  readonly workspaceId: string;
  readonly subjectId: string | null;
  readonly candidates: readonly GroundedLearningCandidate[];
  readonly promotions: readonly LearningPromotionAssessment[];
  readonly rejectionReasons: readonly string[];
  readonly history: readonly GroundedLearningCandidate[];
  readonly writesMemory: false;
  readonly mutatesDecision: false;
  readonly mutatesExecution: false;
  readonly mutatesOutcome: false;
  readonly mutatesObservation: false;
  readonly recommendsAction: false;
  readonly establishesCausation: false;
}>;

export type App4GroundedLearningPromotionResult = Readonly<{
  readonly promoted: boolean;
  readonly reason: string;
  readonly record: ExecutiveMemoryRecord | null;
  readonly stored: ExecutiveMemoryStoredRecord | null;
  readonly authority: "APP-4";
}>;

type StoredFamily = {
  latestId: string;
  versions: GroundedLearningCandidate[];
};

const byId = new Map<string, GroundedLearningCandidate>();
const byFamily = new Map<string, StoredFamily>();

function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    for (const child of Object.values(value as Record<string, unknown>)) {
      deepFreeze(child);
    }
    Object.freeze(value);
  }
  return value;
}

function unique(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values.filter(Boolean))]);
}

function copyEvidence(
  refs: readonly NexoraExecutiveEvidenceReference[],
): readonly NexoraExecutiveEvidenceReference[] {
  return Object.freeze(refs.map((ref) => Object.freeze({ ...ref })));
}

const CONFIDENCE_RANK: Record<SemanticConfidence, number> = {
  unknown: 0,
  low: 1,
  medium: 2,
  high: 3,
};

function weakestConfidence(
  values: readonly SemanticConfidence[],
): SemanticConfidence {
  if (values.length === 0) return "unknown";
  return values.reduce((weakest, next) =>
    CONFIDENCE_RANK[next] < CONFIDENCE_RANK[weakest] ? next : weakest,
  );
}

function familyKey(input: {
  readonly workspaceId: string;
  readonly subjectId: string | null;
  readonly learningType: GroundedLearningType;
  readonly scope: GroundedLearningScope;
}): string {
  return `${input.workspaceId}:${input.subjectId ?? "none"}:${input.learningType}:${input.scope}`;
}

function fingerprint(parts: readonly string[]): string {
  return parts.filter(Boolean).join("|") || "none";
}

export function resetGroundedLearningForTests(): void {
  byId.clear();
  byFamily.clear();
}

export function groundedLearningHistory(
  family: string,
): readonly GroundedLearningCandidate[] {
  return Object.freeze([...(byFamily.get(family)?.versions ?? [])]);
}

function outcomeUnknown(assessment: ExecutiveOutcomeAssessment): boolean {
  return (
    assessment.status === "not-observed" ||
    assessment.status === "comparison-incomplete" ||
    assessment.comparison.result === "unknown" ||
    assessment.comparison.result === "insufficient-comparable-evidence" ||
    assessment.comparison.result === "mixed"
  );
}

function outcomeReady(assessment: ExecutiveOutcomeAssessment): boolean {
  return (
    assessment.identity === nexoraLiveOutcomeIntelligenceIdentity &&
    assessment.status === "comparison-ready" &&
    assessment.comparison.comparable &&
    assessment.actualOutcome != null &&
    assessment.expectedOutcome != null
  );
}

function forbiddenCausalLanguage(statement: string): boolean {
  return /caused|always|reliably|repeat this|strategy works|decision was (good|correct|bad)|do this again/i.test(
    statement,
  );
}

function outcomeStatement(
  assessment: ExecutiveOutcomeAssessment,
  status: GroundedLearningStatus,
): string {
  if (status === "inconclusive" || status === "conflicting") {
    return "Outcome remains inconclusive. Nexora will not treat this as organizational policy.";
  }
  const comparison = assessment.comparison.result;
  return `In this Decision context, the validated Outcome ${comparison} relative to the recorded expectation; causal attribution remains unestablished.`;
}

function assessPromotion(input: {
  readonly candidate: GroundedLearningCandidate;
  readonly assessment: ExecutiveOutcomeAssessment | null;
  readonly causalFinding: CoreInt3CausalFinding | null;
  readonly requestGeneralized: boolean;
}): LearningPromotionAssessment {
  const reasons: string[] = [];
  const causalRequired = input.candidate.learningType === "causal-learning";
  const causalPresent =
    causalRequired &&
    input.causalFinding?.supported === true &&
    input.causalFinding.hypothesisOnly === false &&
    input.causalFinding.conflicting === false &&
    input.causalFinding.provenanceRefs.length > 0 &&
    input.causalFinding.evidenceRefs.length > 0;
  const provenanceComplete = input.candidate.provenanceRefs.length > 0;
  if (!provenanceComplete) reasons.push("missing-provenance");
  if (input.candidate.learningType === "outcome-learning" && input.assessment == null) {
    reasons.push("missing-outcome-assessment");
  }
  if (input.candidate.status === "conflicting") reasons.push("conflicting-evidence");
  if (input.candidate.status === "inconclusive") reasons.push("inconclusive-learning");
  if (input.candidate.status === "contradicted") reasons.push("contradicted-learning");
  if (input.candidate.freshness === "stale" && input.candidate.scope === "generalized") {
    reasons.push("stale-generalization");
  }
  if (causalRequired && !causalPresent) reasons.push("causal-support-required-missing");
  if (input.candidate.scope === "generalized") {
    if (input.candidate.repeatability !== "repeated-consistent") {
      reasons.push("generalized-without-repeatability");
    }
    if (input.candidate.learningType === "outcome-learning" && !causalPresent) {
      reasons.push("generalized-outcome-without-causal-support");
    }
  }
  if (input.requestGeneralized && input.candidate.repeatability === "single-case") {
    reasons.push("single-case-cannot-generalize");
  }
  if (forbiddenCausalLanguage(input.candidate.statement) && !causalPresent) {
    reasons.push("unjustified-causal-or-policy-language");
  }
  if (!input.candidate.workspaceId) reasons.push("workspace-scope-missing");
  if (input.candidate.learningType === "outcome-learning") {
    const expectedRef = input.candidate.expectedOutcomeRefs[0];
    const observationRef = input.candidate.observationRefs[0];
    const subjectRef = input.candidate.subjectId;
    if (!expectedRef || !observationRef || !subjectRef) {
      reasons.push("missing-required-outcome-provenance");
    }
    if (input.assessment && !input.assessment.observationWindow.timingComplete) {
      reasons.push("timing-incomplete");
    }
  }
  if (input.candidate.learningType === "prediction-learning" && causalRequired) {
    reasons.push("prediction-cannot-be-causal");
  }
  const eligible = reasons.length === 0 && input.candidate.status === "supported";
  const promotionClass: GroundedPromotionClass = !eligible
    ? "not-eligible"
    : input.candidate.scope === "generalized"
      ? "generalized"
      : "case-specific";
  return deepFreeze({
    learningId: input.candidate.learningId,
    eligible,
    reasons: unique(reasons),
    evidenceStrength: input.candidate.evidenceStrength,
    provenanceComplete,
    uncertaintyAcceptable: input.candidate.uncertainty.length === 0 || eligible === false,
    conflictState: input.candidate.status,
    causalSupportRequired: causalRequired,
    causalSupportPresent: causalPresent,
    repeatability: input.candidate.repeatability,
    promotionClass,
    memoryAuthority: "APP-4",
  });
}

function remember(candidate: GroundedLearningCandidate): GroundedLearningCandidate {
  const family = familyKey(candidate);
  const existing = byId.get(candidate.learningId);
  if (existing) return existing;
  const prior = byFamily.get(family);
  const versioned: GroundedLearningCandidate = prior
    ? deepFreeze({
        ...candidate,
        version: prior.versions.length + 1,
        previousLearningId: prior.latestId,
      })
    : candidate;
  byId.set(versioned.learningId, versioned);
  const versions = [...(prior?.versions ?? []), versioned];
  byFamily.set(family, { latestId: versioned.learningId, versions });
  return versioned;
}

function repeatabilityFrom(
  family: string,
  status: GroundedLearningStatus,
  history: readonly GroundedLearningCandidate[],
): GroundedRepeatability {
  const stored = [...(byFamily.get(family)?.versions ?? []), ...history];
  const prior = stored.filter((entry) => entry.status !== "inconclusive");
  const statuses = unique([status, ...prior.map((entry) => entry.status)]);
  const total = prior.length + 1;
  if (status === "inconclusive" && prior.length === 0) return "insufficient-history";
  if (total >= 2 && statuses.length === 1 && status === "supported") {
    return "repeated-consistent";
  }
  if (statuses.length > 1) return "repeated-mixed";
  return "single-case";
}

function strengthFor(input: {
  readonly status: GroundedLearningStatus;
  readonly repeatability: GroundedRepeatability;
  readonly partial: boolean;
  readonly stale: boolean;
  readonly provenance: boolean;
}): EvidenceStrength {
  if (!input.provenance) return "unknown";
  if (input.status === "conflicting" || input.status === "inconclusive") return "unknown";
  if (input.stale || input.partial) return "weak";
  if (input.repeatability === "repeated-consistent") return "strong";
  if (input.status === "supported") return "moderate";
  return "weak";
}

function buildCandidate(input: {
  readonly workspaceId: string;
  readonly subjectId: string | null;
  readonly createdAt: string;
  readonly learningType: GroundedLearningType;
  readonly statement: string;
  readonly status: GroundedLearningStatus;
  readonly scope: GroundedLearningScope;
  readonly assessment: ExecutiveOutcomeAssessment | null;
  readonly capture: OutcomeObservationCaptureAssessment | null;
  readonly causalFinding: CoreInt3CausalFinding | null;
  readonly constraint: ConstraintAssessment | null;
  readonly assumption: GroundedAssumptionLink | null;
  readonly prediction: GroundedPredictionLink | null;
  readonly decisionId: string | null;
  readonly executionId: string | null;
  readonly scenarioId: string | null;
  readonly issueId: string | null;
  readonly realityId: string | null;
  readonly comparableHistory: readonly GroundedLearningCandidate[];
  readonly extraEvidence: readonly NexoraExecutiveEvidenceReference[];
  readonly extraProvenance: readonly string[];
  readonly extraUncertainty: readonly string[];
  readonly contradictions: readonly string[];
  readonly freshness: GroundedLearningCandidate["freshness"];
  readonly confidenceParts: readonly SemanticConfidence[];
  readonly fingerprintParts: readonly string[];
}): GroundedLearningCandidate {
  const family = familyKey(input);
  const learningId = `learn:${family}:${fingerprint(input.fingerprintParts)}`;
  const existing = byId.get(learningId);
  if (existing) return existing;
  const repeatability = repeatabilityFrom(input.learningType === "outcome-learning" ? family : family, input.status, input.comparableHistory);
  const scope: GroundedLearningScope =
    input.scope === "generalized" && repeatability === "repeated-consistent"
      ? "generalized"
      : "case-specific";
  const partial =
    input.assessment?.actualOutcome?.validationStatus === "partial" ||
    input.capture?.observations.some((obs) => obs.validationState === "partial") === true;
  const stale = input.freshness === "stale";
  const provenance = unique([
    ...input.extraProvenance,
    ...(input.assessment?.provenanceRefs ?? []),
    ...(input.assessment?.actualOutcome?.provenanceRefs ?? []),
    ...(input.assessment?.expectedOutcome?.provenanceRefs ?? []),
    ...(input.causalFinding?.provenanceRefs ?? []),
    ...(input.assumption?.provenanceRefs ?? []),
    ...(input.prediction?.provenanceRefs ?? []),
    ...(input.constraint?.bindingConstraint?.provenanceRefs ?? []),
  ]);
  const evidence = copyEvidence([
    ...input.extraEvidence,
    ...(input.assessment?.actualOutcome?.evidenceRefs ?? []),
    ...(input.assessment?.expectedOutcome?.evidenceRefs ?? []),
    ...(input.causalFinding?.evidenceRefs ?? []),
    ...(input.assumption?.evidenceRefs ?? []),
    ...(input.prediction?.evidenceRefs ?? []),
    ...(input.constraint?.bindingConstraint?.evidenceRefs ?? []),
  ]);
  const evidenceStrength = strengthFor({
    status: input.status,
    repeatability,
    partial,
    stale,
    provenance: provenance.length > 0,
  });
  const confidence = weakestConfidence([
    ...input.confidenceParts,
    input.assessment?.confidence ?? "unknown",
    partial ? "low" : "medium",
    stale ? "unknown" : "medium",
    input.status === "conflicting" || input.status === "inconclusive" ? "unknown" : "medium",
    repeatability === "single-case" ? "medium" : "medium",
  ]);
  const draft: GroundedLearningCandidate = deepFreeze({
    identity: nexoraGroundedLearningIntelligenceIdentity,
    learningId,
    version: 1,
    previousLearningId: null,
    workspaceId: input.workspaceId,
    subjectId: input.subjectId,
    learningType: input.learningType,
    statement: input.statement,
    status: input.status,
    scope,
    confidence,
    evidenceStrength,
    createdAt: input.createdAt,
    decisionRefs: unique([input.decisionId ?? input.assessment?.decisionId ?? ""]),
    executionRefs: unique([input.executionId ?? input.assessment?.executionId ?? ""]),
    scenarioRefs: unique([input.scenarioId ?? ""]),
    issueRefs: unique([input.issueId ?? ""]),
    expectedOutcomeRefs: unique([input.assessment?.expectedOutcome?.expectationId ?? ""]),
    outcomeAssessmentRefs: unique(
      input.assessment
        ? [`${input.assessment.identity}:${input.assessment.subjectId}:${input.assessment.status}`]
        : [],
    ),
    observationRefs: unique([
      input.assessment?.actualOutcome?.observationId ?? "",
      ...(input.capture?.observations.map((obs) => obs.observationId) ?? []),
    ]),
    causalFindingRefs: unique([input.causalFinding?.findingId ?? ""]),
    constraintFindingRefs: unique([
      input.constraint?.bindingConstraint?.constraintId ?? "",
      ...(input.constraint?.constraints.map((entry) => entry.constraintId) ?? []),
    ]),
    assumptionRefs: unique([input.assumption?.assumptionId ?? ""]),
    evidenceRefs: evidence,
    provenanceRefs: provenance,
    uncertainty: unique(input.extraUncertainty),
    repeatability,
    contradictions: unique(input.contradictions),
    freshness: input.freshness,
    promotionEligibility: "not-promotion-eligible",
    establishesCausation: false,
    recommendsAction: false,
    isCurrentTruth: false,
  });
  return remember(draft);
}

export function projectGroundedLearningIntelligence(
  input: ProjectGroundedLearningInput,
): GroundedLearningIntelligence {
  const rejectionReasons: string[] = [];
  const produced: GroundedLearningCandidate[] = [];
  const assessment = input.assessment ?? null;
  const capture = input.capture ?? null;
  const workspaceId = input.workspaceId;
  const subjectId = input.subjectId;

  if (input.presentationOnly) rejectionReasons.push("presentation-only-source");
  if (input.recommendationOnly) rejectionReasons.push("recommendation-only-source");
  if (input.currentKpiOnly) rejectionReasons.push("current-kpi-is-not-learning");
  if (input.observationWithoutAssessment) {
    rejectionReasons.push("observation-without-outcome-evaluation");
  }
  if (input.expectedOnly) rejectionReasons.push("expected-outcome-only");
  if (input.executionCompleteOnly) rejectionReasons.push("execution-completion-is-not-learning");

  const blocked = rejectionReasons.length > 0;

  if (!blocked && assessment && outcomeReady(assessment)) {
    const status: GroundedLearningStatus =
      assessment.status === "conflicting" || assessment.comparison.result === "mixed"
        ? "conflicting"
        : "supported";
    const requestedScope: GroundedLearningScope = input.requestGeneralized
      ? "generalized"
      : "case-specific";
    produced.push(
      buildCandidate({
        workspaceId,
        subjectId,
        createdAt: input.createdAt,
        learningType: "outcome-learning",
        statement: outcomeStatement(assessment, status),
        status,
        scope: requestedScope,
        assessment,
        capture,
        causalFinding: null,
        constraint: null,
        assumption: null,
        prediction: null,
        decisionId: input.decisionId ?? null,
        executionId: input.executionId ?? null,
        scenarioId: input.scenarioId ?? null,
        issueId: input.issueId ?? null,
        realityId: input.realityId ?? null,
        comparableHistory: input.comparableHistory ?? [],
        extraEvidence: [],
        extraProvenance: [
          nexoraLiveOutcomeIntelligenceIdentity,
          ...(capture ? [nexoraLiveOutcomeObservationCaptureIdentity] : []),
          nexoraSharedEpistemicFoundationIdentity,
        ],
        extraUncertainty: assessment.missingEvidence,
        contradictions: assessment.conflictingObservations.map((obs) => obs.observationId),
        freshness: assessment.actualOutcome?.freshness === "stale" ? "stale" : "current",
        confidenceParts: [assessment.confidence],
        fingerprintParts: [
          assessment.status,
          assessment.comparison.result,
          assessment.expectedOutcome?.expectationId ?? "",
          assessment.actualOutcome?.observationId ?? "",
          ...(assessment.conflictingObservations.map((obs) => obs.observationId)),
        ],
      }),
    );
  } else if (
    !blocked &&
    assessment &&
    assessment.expectedOutcome != null &&
    (assessment.status === "conflicting" ||
      assessment.status === "stale" ||
      assessment.conflictingObservations.length > 0 ||
      (outcomeUnknown(assessment) && assessment.actualOutcome != null))
  ) {
    produced.push(
      buildCandidate({
        workspaceId,
        subjectId,
        createdAt: input.createdAt,
        learningType: "outcome-learning",
        statement: outcomeStatement(assessment, "inconclusive"),
        status: assessment.status === "conflicting" ? "conflicting" : "inconclusive",
        scope: "case-specific",
        assessment,
        capture,
        causalFinding: null,
        constraint: null,
        assumption: null,
        prediction: null,
        decisionId: input.decisionId ?? null,
        executionId: input.executionId ?? null,
        scenarioId: input.scenarioId ?? null,
        issueId: input.issueId ?? null,
        realityId: input.realityId ?? null,
        comparableHistory: input.comparableHistory ?? [],
        extraEvidence: [],
        extraProvenance: [nexoraLiveOutcomeIntelligenceIdentity],
        extraUncertainty: unique([
          ...assessment.missingEvidence,
          assessment.comparison.incompatibilityReason ?? "",
        ]),
        contradictions: assessment.conflictingObservations.map((obs) => obs.observationId),
        freshness:
          assessment.status === "stale" || assessment.actualOutcome?.freshness === "stale"
            ? "stale"
            : "unknown",
        confidenceParts: ["unknown"],
        fingerprintParts: [
          assessment.status,
          assessment.comparison.result,
          assessment.expectedOutcome.expectationId,
          "inconclusive",
        ],
      }),
    );
  }

  if (!blocked && input.causalFinding) {
    const finding = input.causalFinding;
    const causalStatus: GroundedLearningStatus = finding.conflicting
      ? "conflicting"
      : finding.hypothesisOnly || !finding.supported
        ? "inconclusive"
        : assessment && outcomeReady(assessment)
          ? "supported"
          : "inconclusive";
    produced.push(
      buildCandidate({
        workspaceId,
        subjectId,
        createdAt: input.createdAt,
        learningType: "causal-learning",
        statement:
          causalStatus === "supported"
            ? "CORE-INT:3 supports a causal finding in this Outcome context; Learning remains bounded to that finding."
            : "Causal Learning is not justified. CORE-INT:3 does not establish a supported causal finding.",
        status: causalStatus,
        scope: "case-specific",
        assessment,
        capture,
        causalFinding: finding,
        constraint: null,
        assumption: null,
        prediction: null,
        decisionId: input.decisionId ?? null,
        executionId: input.executionId ?? null,
        scenarioId: input.scenarioId ?? null,
        issueId: input.issueId ?? null,
        realityId: input.realityId ?? null,
        comparableHistory: input.comparableHistory ?? [],
        extraEvidence: finding.evidenceRefs,
        extraProvenance: [
          nexoraGroundedCausalConstraintIntelligenceIdentity,
          ...finding.provenanceRefs,
        ],
        extraUncertainty: causalStatus === "supported" ? [] : ["causal-support-absent"],
        contradictions: finding.conflicting ? [finding.findingId] : [],
        freshness: "current",
        confidenceParts: [input.causal?.causalConfidence ?? "unknown"],
        fingerprintParts: [
          "causal",
          finding.findingId,
          String(finding.supported),
          String(finding.hypothesisOnly),
          String(finding.conflicting),
        ],
      }),
    );
  } else if (!blocked && input.requestCausalClaim && !input.causalFinding) {
    rejectionReasons.push("causal-claim-without-core-int3-support");
  }

  if (!blocked && input.constraint?.bindingConstraint) {
    const constraint = input.constraint.bindingConstraint;
    const supported =
      input.constraint.identity === nexoraGroundedCausalConstraintIntelligenceIdentity &&
      input.constraint.evidenceStatus === "present" &&
      constraint.provenanceRefs.length > 0;
    produced.push(
      buildCandidate({
        workspaceId,
        subjectId,
        createdAt: input.createdAt,
        learningType: "constraint-learning",
        statement: supported
          ? "The identified constraint remained relevant to this Outcome context."
          : "Constraint Learning is not justified without CORE-INT:3 constraint evidence.",
        status: supported ? "supported" : "inconclusive",
        scope: "case-specific",
        assessment,
        capture,
        causalFinding: null,
        constraint: input.constraint,
        assumption: null,
        prediction: null,
        decisionId: input.decisionId ?? null,
        executionId: input.executionId ?? null,
        scenarioId: input.scenarioId ?? null,
        issueId: input.issueId ?? null,
        realityId: input.realityId ?? null,
        comparableHistory: input.comparableHistory ?? [],
        extraEvidence: constraint.evidenceRefs,
        extraProvenance: [
          nexoraGroundedCausalConstraintIntelligenceIdentity,
          ...constraint.provenanceRefs,
        ],
        extraUncertainty: supported ? [] : ["constraint-evidence-incomplete"],
        contradictions: [],
        freshness: "current",
        confidenceParts: [input.constraint.confidence],
        fingerprintParts: ["constraint", constraint.constraintId],
      }),
    );
  }

  if (!blocked && input.assumption) {
    const assumption = input.assumption;
    const linked = assumption.linkage === "explicit-target-binding";
    const status: GroundedLearningStatus = !linked
      ? "inconclusive"
      : assumption.observation === "supports"
        ? "supported"
        : assumption.observation === "challenges"
          ? "contradicted"
          : "inconclusive";
    produced.push(
      buildCandidate({
        workspaceId,
        subjectId,
        createdAt: input.createdAt,
        learningType: "assumption-learning",
        statement: !linked
          ? "Assumption Learning requires deterministic linkage between assumption, expected observation, and actual evidence."
          : assumption.observation === "supports"
            ? `Assumption ${assumption.assumptionId} is supported by linked Outcome evidence.`
            : assumption.observation === "challenges"
              ? `Assumption ${assumption.assumptionId} is challenged by linked Outcome evidence.`
              : `Assumption ${assumption.assumptionId} remains inconclusive.`,
        status,
        scope: "case-specific",
        assessment,
        capture,
        causalFinding: null,
        constraint: null,
        assumption,
        prediction: null,
        decisionId: input.decisionId ?? null,
        executionId: input.executionId ?? null,
        scenarioId: input.scenarioId ?? null,
        issueId: input.issueId ?? null,
        realityId: input.realityId ?? null,
        comparableHistory: input.comparableHistory ?? [],
        extraEvidence: assumption.evidenceRefs,
        extraProvenance: assumption.provenanceRefs,
        extraUncertainty: linked ? [] : ["assumption-linkage-missing"],
        contradictions: status === "contradicted" ? [assumption.assumptionId] : [],
        freshness: "current",
        confidenceParts: [linked ? "medium" : "unknown"],
        fingerprintParts: [
          "assumption",
          assumption.assumptionId,
          assumption.linkage,
          assumption.observation,
        ],
      }),
    );
  }

  if (!blocked && input.prediction) {
    const prediction = input.prediction;
    const status: GroundedLearningStatus =
      prediction.matched == null ? "inconclusive" : "supported";
    produced.push(
      buildCandidate({
        workspaceId,
        subjectId,
        createdAt: input.createdAt,
        learningType: "prediction-learning",
        statement:
          prediction.matched === true
            ? "The recorded prediction was close to the Actual within the defined evaluation rule. This does not establish causal correctness."
            : prediction.matched === false
              ? "The recorded prediction missed the Actual. The original prediction remains unchanged."
              : "Prediction Learning remains inconclusive.",
        status,
        scope: "case-specific",
        assessment,
        capture,
        causalFinding: null,
        constraint: null,
        assumption: null,
        prediction,
        decisionId: input.decisionId ?? null,
        executionId: input.executionId ?? null,
        scenarioId: input.scenarioId ?? null,
        issueId: input.issueId ?? null,
        realityId: input.realityId ?? null,
        comparableHistory: input.comparableHistory ?? [],
        extraEvidence: prediction.evidenceRefs,
        extraProvenance: prediction.provenanceRefs,
        extraUncertainty: prediction.matched == null ? ["prediction-uncompared"] : [],
        contradictions: [],
        freshness: "current",
        confidenceParts: [prediction.matched == null ? "unknown" : "medium"],
        fingerprintParts: [
          "prediction",
          prediction.predictionId,
          String(prediction.expectedValue),
          String(prediction.actualValue),
          String(prediction.matched),
        ],
      }),
    );
  }

  if (
    !blocked &&
    input.explicitProcessRule === true &&
    input.executionComplete === true &&
    assessment &&
    outcomeReady(assessment)
  ) {
    produced.push(
      buildCandidate({
        workspaceId,
        subjectId,
        createdAt: input.createdAt,
        learningType: "process-learning",
        statement:
          "Execution completion is recorded alongside a validated Outcome. This is process context, not business-outcome proof.",
        status: "supported",
        scope: "case-specific",
        assessment,
        capture,
        causalFinding: null,
        constraint: null,
        assumption: null,
        prediction: null,
        decisionId: input.decisionId ?? null,
        executionId: input.executionId ?? null,
        scenarioId: input.scenarioId ?? null,
        issueId: input.issueId ?? null,
        realityId: input.realityId ?? null,
        comparableHistory: input.comparableHistory ?? [],
        extraEvidence: [],
        extraProvenance: [nexoraLiveOutcomeIntelligenceIdentity, "process-rule:explicit"],
        extraUncertainty: [],
        contradictions: [],
        freshness: "current",
        confidenceParts: ["low"],
        fingerprintParts: ["process", input.executionId ?? "", assessment.actualOutcome?.observationId ?? ""],
      }),
    );
  }

  const promotions = produced.map((candidate) => {
    const promotion = assessPromotion({
      candidate,
      assessment,
      causalFinding: input.causalFinding ?? null,
      requestGeneralized: input.requestGeneralized === true,
    });
    const eligibleLabel: GroundedLearningCandidate["promotionEligibility"] =
      promotion.eligible ? "promotion-eligible" : "not-promotion-eligible";
    if (candidate.promotionEligibility !== eligibleLabel) {
      const updated: GroundedLearningCandidate = deepFreeze({
        ...candidate,
        promotionEligibility: eligibleLabel,
        scope:
          promotion.promotionClass === "generalized"
            ? "generalized"
            : candidate.scope,
      });
      byId.set(updated.learningId, updated);
      const family = familyKey(updated);
      const stored = byFamily.get(family);
      if (stored) {
        stored.versions = stored.versions.map((entry) =>
          entry.learningId === updated.learningId ? updated : entry,
        );
      }
      return { candidate: updated, promotion };
    }
    return { candidate, promotion };
  });

  const candidates = Object.freeze(promotions.map((entry) => entry.candidate));
  const familyIds = unique(candidates.map((candidate) => familyKey(candidate)));
  const history = Object.freeze(
    familyIds.flatMap((family) => [...(byFamily.get(family)?.versions ?? [])]),
  );

  return deepFreeze({
    identity: nexoraGroundedLearningIntelligenceIdentity,
    workspaceId,
    subjectId,
    candidates,
    promotions: Object.freeze(promotions.map((entry) => entry.promotion)),
    rejectionReasons: unique(rejectionReasons),
    history,
    writesMemory: false,
    mutatesDecision: false,
    mutatesExecution: false,
    mutatesOutcome: false,
    mutatesObservation: false,
    recommendsAction: false,
    establishesCausation: false,
  });
}

export function presentGroundedLearning(
  intelligence: GroundedLearningIntelligence,
): string {
  const eligible = intelligence.candidates.find(
    (candidate) => candidate.promotionEligibility === "promotion-eligible",
  );
  if (eligible) return eligible.statement;
  const bounded = intelligence.candidates[0];
  if (bounded) return bounded.statement;
  if (intelligence.rejectionReasons.includes("current-kpi-is-not-learning")) {
    return "Current measurements are Reality, not Learning.";
  }
  return "No promoted Learning is available yet. Nexora will not invent one.";
}

export function promoteGroundedLearningToApp4(input: {
  readonly candidate: GroundedLearningCandidate;
  readonly promotion: LearningPromotionAssessment;
  readonly owner: string;
}): App4GroundedLearningPromotionResult {
  if (!input.promotion.eligible) {
    return deepFreeze({
      promoted: false,
      reason: input.promotion.reasons.join(",") || "learning-ineligible",
      record: null,
      stored: null,
      authority: "APP-4",
    });
  }
  if (getExecutiveMemoryById(input.candidate.learningId)) {
    return deepFreeze({
      promoted: false,
      reason: "duplicate-durable-record",
      record: null,
      stored: null,
      authority: "APP-4",
    });
  }
  const memoryInput = {
    id: input.candidate.learningId,
    workspaceId: input.candidate.workspaceId,
    kind: "learning" as const,
    title: `Learning ${input.candidate.learningType}`,
    summary: input.candidate.statement,
    narrative: `${input.candidate.learningType} ${input.candidate.scope} ${input.candidate.status}. Causal attribution remains unestablished by CORE-OUT:2.`,
    status: input.candidate.status,
    source: nexoraGroundedLearningIntelligenceIdentity,
    owner: input.owner,
    confidence:
      input.candidate.confidence === "high"
        ? 0.8
        : input.candidate.confidence === "medium"
          ? 0.55
          : input.candidate.confidence === "low"
            ? 0.3
            : null,
    createdAt: input.candidate.createdAt,
    updatedAt: input.candidate.createdAt,
    subjectReferences: [
      ...(input.candidate.decisionRefs.map((targetId) => ({
        type: "decision" as const,
        targetId,
        label: "Canonical Decision",
      }))),
      ...(input.candidate.executionRefs.map((targetId) => ({
        type: "execution" as const,
        targetId,
        label: "Canonical Execution",
      }))),
      ...(input.candidate.scenarioRefs.map((targetId) => ({
        type: "scenario" as const,
        targetId,
        label: "Scenario",
      }))),
      ...(input.candidate.issueRefs.map((targetId) => ({
        type: "problem" as const,
        targetId,
        label: "Issue",
      }))),
      ...(input.candidate.observationRefs.map((targetId) => ({
        type: "evidence" as const,
        targetId,
        label: "Observed Reality",
      }))),
      ...(input.candidate.outcomeAssessmentRefs.map((targetId) => ({
        type: "outcome" as const,
        targetId,
        label: "Outcome Assessment",
      }))),
    ].filter((ref) => ref.targetId),
    provenance: input.candidate.provenanceRefs,
    lesson: {
      lessonId: input.candidate.learningId,
      summary: input.candidate.statement,
      context: `${input.candidate.learningType}:${input.candidate.scope}`,
    },
  };
  const persisted: ExecutiveMemoryStorageResult<ExecutiveMemoryStoredRecord> =
    persistDurableExecutiveMemory(memoryInput);
  return deepFreeze({
    promoted: persisted.success,
    reason: persisted.reason,
    record: persisted.success && persisted.data ? persisted.data.record : null,
    stored: persisted.success ? persisted.data : null,
    authority: "APP-4",
  });
}

export function retrieveHistoricalGroundedLearning(input: {
  readonly workspaceId: string;
  readonly currentSubjectId: string;
  readonly relatedSubjectIds?: readonly string[];
  readonly limit?: number;
}) {
  const memories = retrieveRelevantDurableExecutiveMemory(input).filter(
    (stored) =>
      stored.record.category === "learning" &&
      stored.record.workspaceId === input.workspaceId,
  );
  return deepFreeze({
    workspaceId: input.workspaceId,
    subjectId: input.currentSubjectId,
    historicalContextOnly: true as const,
    currentTruthAuthority: false as const,
    currentOutcomeAuthority: false as const,
    currentCausalAuthority: false as const,
    currentRecommendationAuthority: false as const,
    memories: memories.map((stored) => ({
      memoryId: stored.record.id,
      summary: stored.record.header.summary,
      validationStatus: stored.record.metadata.customMetadata.status ?? "unknown",
      confidence: stored.record.confidence?.level ?? "unknown",
      provenance: (stored.record.metadata.customMetadata.provenance ?? "")
        .split("|")
        .filter(Boolean),
      updatedAt: stored.record.updatedAt,
      source: stored.record.header.sourceModule,
    })),
  });
}
