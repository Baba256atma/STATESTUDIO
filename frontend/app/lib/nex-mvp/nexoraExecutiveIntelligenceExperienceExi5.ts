/**
 * EXI:5 — Outcome & Learning Experience Integration.
 *
 * Presentation/read model over CORE-OUT:1, CORE-OUT:2, CORE-INT:3, and APP-4.
 * Does not evaluate Outcome, create Learning, establish causality, recommend,
 * persist memory, or mutate Decision/Execution/observation/assessment.
 */

import type { CausalAssessment } from "../executive-intelligence/nexoraGroundedCausalConstraintIntelligence.ts";
import { presentProvenAnswer } from "../executive-intelligence/nexoraGroundedCausalConstraintIntelligence.ts";
import type { ExecutiveOutcomeAssessment } from "../executive-intelligence/nexoraLiveOutcomeIntelligence.ts";
import { presentOutcomeAssessment } from "../executive-intelligence/nexoraLiveOutcomeIntelligence.ts";
import type {
  GroundedLearningCandidate,
  GroundedLearningIntelligence,
} from "../executive-intelligence/nexoraGroundedLearningIntelligence.ts";
import {
  presentGroundedLearning,
  retrieveHistoricalGroundedLearning,
} from "../executive-intelligence/nexoraGroundedLearningIntelligence.ts";
import type { EvidenceStrength } from "../executive-intelligence/problemRiskOpportunityIntelligence.ts";

export const nexoraExi5ExperienceIdentity =
  "EXI:5/OutcomeLearningExperience" as const;
export const nexoraExi5ExperienceVersion = "1.0.0" as const;
export const nexoraExi5ExperienceNamespace =
  "nexora.exi.outcome-learning-experience" as const;

export const NEXORA_EXI5_EXPERIENCE_BOUNDARY = Object.freeze({
  presentationOnly: true as const,
  createsOutcome: false as const,
  createsLearning: false as const,
  createsCausalFinding: false as const,
  createsRecommendation: false as const,
  mutatesDecision: false as const,
  mutatesExecution: false as const,
  mutatesObservation: false as const,
  mutatesOutcomeAssessment: false as const,
  mutatesLearning: false as const,
  writesMemory: false as const,
  promotesToApp4: false as const,
  usesLlm: false as const,
  redesignsStage: false as const,
  currentKpiEqualsOutcome: false as const,
  executionCompletionEqualsOutcome: false as const,
  outcomeSuccessEqualsCausalProof: false as const,
  singleSuccessEqualsGeneralRule: false as const,
  advisorTextIsEvidence: false as const,
  conversationTextIsEvidence: false as const,
  historicalMemoryIsCurrentTruth: false as const,
});

export type Exi5CausalStatus = "supported" | "unestablished";
export type Exi5ObservationStatus =
  | "pending-actual"
  | "reality-only"
  | "execution-complete-outcome-unknown"
  | "observed"
  | "stale"
  | "conflicting"
  | "partial"
  | "unknown";

export type Exi5PresentedLearning = Readonly<{
  readonly learningId: string;
  readonly statement: string;
  readonly status: GroundedLearningCandidate["status"];
  readonly scope: GroundedLearningCandidate["scope"];
  readonly evidenceStrength: EvidenceStrength;
  readonly freshness: GroundedLearningCandidate["freshness"];
  readonly historical: false;
}>;

export type Exi5HistoricalLearning = Readonly<{
  readonly memoryId: string;
  readonly statement: string;
  readonly historical: true;
  readonly currentTruth: false;
}>;

export type ExecutiveOutcomeLearningExperience = Readonly<{
  readonly identity: typeof nexoraExi5ExperienceIdentity;
  readonly subjectId: string | null;
  readonly decisionId: string | null;
  readonly executionId: string | null;
  readonly expectedOutcome: string;
  readonly actualOutcome: string;
  readonly outcomeAssessment: string;
  readonly observationStatus: Exi5ObservationStatus;
  readonly learningCandidates: readonly Exi5PresentedLearning[];
  readonly promotedLearning: readonly Exi5PresentedLearning[];
  readonly historicalLearning: readonly Exi5HistoricalLearning[];
  readonly learningStatement: string;
  readonly uncertainty: string;
  readonly causalStatus: Exi5CausalStatus;
  readonly causalStatement: string;
  readonly confidenceStatement: string;
  readonly didItWorkStatement: string;
  readonly whatHappenedStatement: string;
  readonly whyStatement: string;
  readonly historicalStatement: string;
  readonly evidenceRefs: readonly string[];
  readonly provenanceRefs: readonly string[];
  readonly authorityState: typeof NEXORA_EXI5_EXPERIENCE_BOUNDARY;
  readonly pendingReasons: readonly string[];
  readonly currentRealityWins: boolean;
}>;

export type ComposeNexoraExi5Input = Readonly<{
  readonly workspaceId: string;
  readonly subjectId: string | null;
  readonly assessment: ExecutiveOutcomeAssessment;
  readonly learning: GroundedLearningIntelligence;
  readonly causal: CausalAssessment;
  readonly currentRealityStatement?: string | null;
  readonly executionComplete?: boolean;
  readonly observationLinked?: boolean;
}>;

const CAUSAL_OVERCLAIM =
  /the decision caused|caused the improvement|caused capacity|always use this decision|this strategy works|the decision was (good|correct)/i;

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

function presentStrength(strength: EvidenceStrength): string {
  if (strength === "strong") return "strong";
  if (strength === "moderate") return "moderate";
  if (strength === "weak") return "weak";
  return "unknown";
}

function observationStatus(
  assessment: ExecutiveOutcomeAssessment,
  input: ComposeNexoraExi5Input,
): Exi5ObservationStatus {
  if (assessment.status === "stale") return "stale";
  if (assessment.status === "conflicting") return "conflicting";
  if (assessment.actualOutcome?.validationStatus === "partial") return "partial";
  if (assessment.actualOutcome && assessment.actualOutcome.outcomeLinked) {
    return "observed";
  }
  if (input.executionComplete === true && assessment.actualOutcome == null) {
    return "execution-complete-outcome-unknown";
  }
  if (
    assessment.currentReality &&
    assessment.actualOutcome == null &&
    input.observationLinked === false
  ) {
    return "reality-only";
  }
  if (assessment.expectedOutcome && assessment.actualOutcome == null) {
    return "pending-actual";
  }
  return "unknown";
}

function presentExpected(assessment: ExecutiveOutcomeAssessment): string {
  return (
    assessment.expectedOutcome?.statement ??
    "No measurable expected outcome was recorded for this Decision."
  );
}

function presentActual(
  assessment: ExecutiveOutcomeAssessment,
  status: Exi5ObservationStatus,
): string {
  if (status === "reality-only") {
    return "Current measurements are Reality, not a Decision Outcome.";
  }
  if (status === "execution-complete-outcome-unknown") {
    return "Execution is recorded as complete. The business outcome is still unknown.";
  }
  if (assessment.actualOutcome?.statement) {
    return assessment.actualOutcome.statement;
  }
  return "No validated actual outcome is available yet.";
}

function presentLearning(
  learning: GroundedLearningIntelligence,
  assessment: ExecutiveOutcomeAssessment,
  presented: readonly Exi5PresentedLearning[],
): string {
  const conflicting = presented.some((entry) => entry.status === "conflicting");
  if (conflicting) {
    return "Evidence is conflicting. No reliable learning has been promoted.";
  }
  const missingProvenance = learning.promotions.some((entry) =>
    entry.reasons.includes("missing-provenance"),
  );
  if (missingProvenance && presented.length > 0) {
    return "Learning is not authoritative while provenance is incomplete.";
  }
  if (assessment.actualOutcome && presented.length === 0) {
    return "An outcome was observed, but there is not enough evidence to promote a learning yet.";
  }
  const eligible = presented.find((entry) =>
    learning.candidates.some(
      (candidate) =>
        candidate.learningId === entry.learningId &&
        candidate.promotionEligibility === "promotion-eligible",
    ),
  );
  if (eligible) {
    const scopeNote =
      eligible.scope === "generalized"
        ? "This is generalized only because repeated consistent evidence and required support are present."
        : "This is case-specific, not a general rule.";
    return `${eligible.statement} ${scopeNote}`;
  }
  return presentGroundedLearning(learning);
}

function presentDidItWork(
  assessment: ExecutiveOutcomeAssessment,
  causalStatus: Exi5CausalStatus,
  status: Exi5ObservationStatus,
): string {
  if (status === "execution-complete-outcome-unknown") {
    return "Execution is recorded as complete. The business outcome is still unknown.";
  }
  if (assessment.actualOutcome == null) {
    return "No validated actual outcome is available yet.";
  }
  const comparison = assessment.comparison.result;
  if (
    assessment.comparison.comparable &&
    (comparison === "met" || comparison === "exceeded" || comparison === "partially-met")
  ) {
    const met =
      comparison === "exceeded"
        ? "The expected Outcome was exceeded."
        : comparison === "partially-met"
          ? "The expected Outcome was partially met."
          : "The expected Outcome was met.";
    if (causalStatus === "supported") {
      return `${met} A recorded causal finding supports an explanation in this context.`;
    }
    return `${met} Causal attribution has not been established.`;
  }
  if (assessment.comparison.comparable && comparison === "not-met") {
    return "The expected Outcome was not met. That does not by itself mean the Decision was wrong.";
  }
  return `${presentOutcomeAssessment(assessment)} Causal attribution has not been established.`;
}

function presentWhy(
  causal: CausalAssessment,
  causalStatus: Exi5CausalStatus,
  assessment: ExecutiveOutcomeAssessment,
): string {
  if (causalStatus === "supported") {
    return presentProvenAnswer(causal);
  }
  if (assessment.actualOutcome) {
    return `${presentProvenAnswer(causal)} The outcome is observed, but causal attribution has not been established.`;
  }
  return presentProvenAnswer(causal);
}

function presentConfidence(
  learning: GroundedLearningIntelligence,
  assessment: ExecutiveOutcomeAssessment,
): string {
  if (assessment.status === "stale") {
    return "Evidence is stale. Confidence remains unknown.";
  }
  if (assessment.actualOutcome?.validationStatus === "partial") {
    return "Evidence is partial. Confidence remains weak.";
  }
  const strength = learning.candidates[0]?.evidenceStrength ?? "unknown";
  const label = presentStrength(strength);
  if (label === "unknown") {
    return "Confidence is unknown on the current evidence.";
  }
  return `Evidence strength is ${label}.`;
}

function presentHistorical(
  historical: readonly Exi5HistoricalLearning[],
  currentReality: string | null,
): { statement: string; currentRealityWins: boolean } {
  if (historical.length === 0) {
    return {
      statement: "No relevant historical Learning is currently recorded.",
      currentRealityWins: false,
    };
  }
  const first = historical[0]!;
  const conflicts =
    Boolean(currentReality) &&
    first.statement.length > 0 &&
    currentReality != null &&
    !currentReality.includes(first.statement) &&
    /improv|worsen|increase|decrease|met|exceeded|not met/i.test(first.statement);
  if (conflicts) {
    return {
      statement: `Historical Learning is available as past context: ${first.statement} Current Reality remains the live business truth.`,
      currentRealityWins: true,
    };
  }
  return {
    statement: `Historical Learning is available as past context, not current Reality: ${first.statement}`,
    currentRealityWins: false,
  };
}

function presentCandidate(candidate: GroundedLearningCandidate): Exi5PresentedLearning {
  const statement =
    candidate.scope === "generalized"
      ? candidate.statement
      : candidate.statement.includes("this Decision context") ||
          candidate.statement.includes("case-specific")
        ? candidate.statement
        : `${candidate.statement} This remains case-specific.`;
  return Object.freeze({
    learningId: candidate.learningId,
    statement,
    status: candidate.status,
    scope: candidate.scope,
    evidenceStrength: candidate.evidenceStrength,
    freshness: candidate.freshness,
    historical: false as const,
  });
}

export function composeNexoraExi5OutcomeLearningExperience(
  input: ComposeNexoraExi5Input,
): ExecutiveOutcomeLearningExperience {
  const assessment = input.assessment;
  const learning = input.learning;
  const status = observationStatus(assessment, input);
  const causalLearning = learning.candidates.find(
    (candidate) =>
      candidate.learningType === "causal-learning" &&
      candidate.status === "supported" &&
      candidate.promotionEligibility === "promotion-eligible",
  );
  const causalStatus: Exi5CausalStatus = causalLearning
    ? "supported"
    : "unestablished";
  const presented = Object.freeze(learning.candidates.map(presentCandidate));
  const promoted = Object.freeze(
    learning.candidates
      .filter((candidate) => candidate.promotionEligibility === "promotion-eligible")
      .filter(
        (candidate) =>
          candidate.scope !== "generalized" ||
          candidate.repeatability === "repeated-consistent",
      )
      .map(presentCandidate),
  );
  const retrieved = retrieveHistoricalGroundedLearning({
    workspaceId: input.workspaceId,
    currentSubjectId: input.subjectId ?? "overview",
  });
  const historical = Object.freeze(
    retrieved.memories.map((memory) =>
      Object.freeze({
        memoryId: memory.memoryId,
        statement: memory.summary,
        historical: true as const,
        currentTruth: false as const,
      }),
    ),
  );
  const pending = unique([
    ...(assessment.actualOutcome ? [] : ["pending-actual"]),
    ...(assessment.missingEvidence ?? []),
    ...learning.rejectionReasons,
    ...(causalStatus === "unestablished" ? ["causal-attribution-unestablished"] : []),
  ]);
  const historicalView = presentHistorical(
    historical,
    input.currentRealityStatement ?? assessment.currentReality?.statement ?? null,
  );
  const expected = presentExpected(assessment);
  const actual = presentActual(assessment, status);
  const outcome = presentOutcomeAssessment(assessment);
  const learningStatement = presentLearning(learning, assessment, presented);
  const causalStatement =
    causalStatus === "supported"
      ? causalLearning?.statement ??
        "A recorded causal finding supports an explanation in this context."
      : assessment.actualOutcome
        ? "The outcome is observed, but causal attribution has not been established."
        : "Causal attribution has not been established.";
  const didItWork = presentDidItWork(assessment, causalStatus, status);
  const why = presentWhy(input.causal, causalStatus, assessment);
  const guard = (statement: string): string =>
    causalStatus === "supported" || !CAUSAL_OVERCLAIM.test(statement)
      ? statement
      : "The expected Outcome was assessed from recorded evidence. Causal attribution has not been established.";
  return deepFreeze({
    identity: nexoraExi5ExperienceIdentity,
    subjectId: input.subjectId,
    decisionId: assessment.decisionId,
    executionId: assessment.executionId,
    expectedOutcome: expected,
    actualOutcome: actual,
    outcomeAssessment: guard(outcome),
    observationStatus: status,
    learningCandidates: presented,
    promotedLearning: promoted,
    historicalLearning: historical,
    learningStatement: guard(learningStatement),
    uncertainty: presentConfidence(learning, assessment),
    causalStatus,
    causalStatement: guard(causalStatement),
    confidenceStatement: presentConfidence(learning, assessment),
    didItWorkStatement: guard(didItWork),
    whatHappenedStatement:
      status === "reality-only"
        ? actual
        : assessment.actualOutcome
          ? actual
          : "No validated actual outcome is available yet.",
    whyStatement: guard(why),
    historicalStatement: historicalView.statement,
    evidenceRefs: unique([
      ...(assessment.actualOutcome?.evidenceRefs.map((ref) => ref.sourceId) ?? []),
      ...(assessment.expectedOutcome?.evidenceRefs.map((ref) => ref.sourceId) ?? []),
    ]),
    provenanceRefs: unique([
      ...(assessment.provenanceRefs ?? []),
      ...(assessment.actualOutcome?.provenanceRefs ?? []),
      ...learning.candidates.flatMap((candidate) => [...candidate.provenanceRefs]),
    ]),
    authorityState: NEXORA_EXI5_EXPERIENCE_BOUNDARY,
    pendingReasons: pending,
    currentRealityWins: historicalView.currentRealityWins,
  });
}
