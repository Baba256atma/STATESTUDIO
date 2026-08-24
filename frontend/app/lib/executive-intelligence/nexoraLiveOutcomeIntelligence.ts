/**
 * CORE-OUT:1 — Live Outcome Intelligence Foundation.
 *
 * Distinguishes expected (PREDICTION) from actual (FACT) outcomes.
 * Evaluates expected-vs-actual only when evidence is compatible.
 * Does not create Learning, promote APP-4, infer causation, or write UI.
 */

import type { NexoraExecutiveEvidenceReference } from "../conversational-control/executiveRecommendation.ts";
import type { SemanticConfidence } from "./problemRiskOpportunityIntelligence.ts";
import type { SharedEpistemicEvidenceStatus } from "./nexoraSharedEpistemicFoundation.ts";

export const nexoraLiveOutcomeIntelligenceIdentity =
  "CORE-OUT:1/LiveOutcomeIntelligence" as const;
export const nexoraLiveOutcomeIntelligenceVersion = "1.0.0" as const;
export const nexoraLiveOutcomeIntelligenceNamespace =
  "nexora.core.live-outcome-intelligence" as const;

export const LIVE_OUTCOME_BOUNDARY = Object.freeze({
  role: "live-outcome-evaluation" as const,
  epistemicAuthority: "CORE-INT:2/SharedEpistemicUncertaintyFoundation" as const,
  causalAuthority: "CORE-INT:3/GroundedCausalConstraintIntelligence" as const,
  expectedAuthority: "existing-predictive-sources" as const,
  actualAuthority: "CORE-OUT:1A/LiveOutcomeObservationCapture" as const,
  reusesEi6Learning: false as const,
  wiresCc11: false as const,
  wiresStageProd5Writer: false as const,
  startsExi5: false as const,
  usesLlm: false as const,
  createsLearning: false as const,
  writesMemory: false as const,
  mutatesDecision: false as const,
  mutatesExecution: false as const,
  mutatesStage: false as const,
  infersCausality: false as const,
  predictionBecomesFact: false as const,
  currentKpiEqualsOutcome: false as const,
  progressEqualsOutcome: false as const,
  recommendationEqualsOutcome: false as const,
  decisionEqualsOutcome: false as const,
  changeEqualsOutcome: false as const,
  inventsNumericImpact: false as const,
  isExiWriter: false as const,
});

export type OutcomeClaimKind = "FACT" | "PREDICTION" | "UNKNOWN";
export type OutcomeEvidenceStatus = SharedEpistemicEvidenceStatus;
export type OutcomeAssessmentStatus =
  | "not-observed"
  | "observed"
  | "comparison-ready"
  | "comparison-incomplete"
  | "conflicting"
  | "stale";
export type OutcomeComparisonResult =
  | "met"
  | "partially-met"
  | "not-met"
  | "exceeded"
  | "mixed"
  | "unknown"
  | "insufficient-comparable-evidence";
export type OutcomeExpectedSource =
  | "scenario"
  | "decision"
  | "decision-memory"
  | "execution-target"
  | "ei5-preparation";
export type OutcomeActualSource =
  | "data-reality"
  | "kpi-observation"
  | "recorded-execution-result"
  | "canonical-outcome-writer";
export type OutcomeDirectionExpected = "improve" | "reduce" | "maintain";
export type OutcomeDirectionActual = "improved" | "worsened" | "unchanged";
export type OutcomeNumericComparator = "lt" | "lte" | "gt" | "gte" | "eq";

export type ExecutiveOutcomeExpectation = Readonly<{
  readonly expectationId: string;
  readonly statement: string;
  readonly claimKind: "PREDICTION";
  readonly dimension: string;
  readonly source: OutcomeExpectedSource;
  readonly numericTarget: number | null;
  readonly comparator: OutcomeNumericComparator | null;
  readonly unit: string | null;
  readonly expectedDirection: OutcomeDirectionExpected | null;
  readonly capturedAt: string | null;
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  readonly provenanceRefs: readonly string[];
}>;

export type ExecutiveOutcomeObservation = Readonly<{
  readonly observationId: string;
  readonly statement: string;
  readonly claimKind: "FACT";
  readonly dimension: string;
  readonly source: OutcomeActualSource;
  readonly numericValue: number | null;
  readonly unit: string | null;
  readonly observedDirection: OutcomeDirectionActual | null;
  readonly observedAt: string | null;
  readonly freshness: "current" | "stale" | "unknown";
  readonly validationStatus: "validated" | "unvalidated" | "partial" | "conflicting";
  readonly outcomeLinked: true;
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  readonly provenanceRefs: readonly string[];
}>;

export type ExecutiveOutcomeBaseline = Readonly<{
  readonly measured: string;
  readonly measuredAt: string | null;
  readonly source: string;
  readonly numericValue: number | null;
  readonly unit: string | null;
  readonly confidence: SemanticConfidence;
  readonly provenanceRefs: readonly string[];
}>;

export type ExecutiveOutcomeWindow = Readonly<{
  readonly decisionAt: string | null;
  readonly executionAt: string | null;
  readonly observedAt: string | null;
  readonly timingComplete: boolean;
}>;

export type ExecutiveOutcomeComparison = Readonly<{
  readonly result: OutcomeComparisonResult;
  readonly comparable: boolean;
  readonly numericDelta: number | null;
  readonly incompatibilityReason: string | null;
  readonly statement: string;
}>;

export type ExecutiveOutcomeCurrentReality = Readonly<{
  readonly statement: string;
  readonly dimension: string | null;
  readonly numericValue: number | null;
  readonly isOutcome: false;
}>;

export type ExecutiveOutcomeAssessment = Readonly<{
  readonly identity: typeof nexoraLiveOutcomeIntelligenceIdentity;
  readonly subjectId: string | null;
  readonly decisionId: string | null;
  readonly executionId: string | null;
  readonly baseline: ExecutiveOutcomeBaseline | null;
  readonly expectedOutcome: ExecutiveOutcomeExpectation | null;
  readonly actualOutcome: ExecutiveOutcomeObservation | null;
  readonly conflictingObservations: readonly ExecutiveOutcomeObservation[];
  readonly currentReality: ExecutiveOutcomeCurrentReality | null;
  readonly comparison: ExecutiveOutcomeComparison;
  readonly evidenceStatus: OutcomeEvidenceStatus;
  readonly confidence: SemanticConfidence;
  readonly provenanceRefs: readonly string[];
  readonly missingEvidence: readonly string[];
  readonly observationWindow: ExecutiveOutcomeWindow;
  readonly status: OutcomeAssessmentStatus;
  readonly establishesCausation: false;
  readonly createsLearning: false;
}>;

export type LiveOutcomeCaptureEvidence = Readonly<{
  readonly linkedActuals: readonly ExecutiveOutcomeObservation[];
  readonly baseline: ExecutiveOutcomeBaseline | null;
  readonly evaluatorWindow: ExecutiveOutcomeWindow;
  readonly currentReality?: ExecutiveOutcomeCurrentReality | null;
}>;

export type ProjectLiveOutcomeIntelligenceInput = Readonly<{
  readonly subjectId: string | null;
  readonly decisionId?: string | null;
  readonly executionId?: string | null;
  readonly expected?: ExecutiveOutcomeExpectation | null;
  readonly actuals?: readonly ExecutiveOutcomeObservation[];
  readonly capture?: LiveOutcomeCaptureEvidence | null;
  readonly baseline?: ExecutiveOutcomeBaseline | null;
  readonly window?: Partial<ExecutiveOutcomeWindow> | null;
  readonly currentReality?: Omit<ExecutiveOutcomeCurrentReality, "isOutcome"> | null;
  readonly executionProgressOnly?: boolean;
  readonly recommendationPresent?: boolean;
  readonly decisionCommitted?: boolean;
  readonly recentChangePresent?: boolean;
}>;

function unique(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values.filter(Boolean))]);
}

function numericMet(
  actual: number,
  target: number,
  comparator: OutcomeNumericComparator,
): boolean {
  if (comparator === "lt") return actual < target;
  if (comparator === "lte") return actual <= target;
  if (comparator === "gt") return actual > target;
  if (comparator === "gte") return actual >= target;
  return actual === target;
}

function numericPartial(
  actual: number,
  target: number,
  comparator: OutcomeNumericComparator,
): boolean {
  if (comparator === "lt" || comparator === "lte") {
    return actual > target && actual <= target * 1.05;
  }
  if (comparator === "gt" || comparator === "gte") {
    return actual < target && actual >= target * 0.95;
  }
  return Math.abs(actual - target) <= Math.abs(target) * 0.05;
}

function qualitativeResult(
  expected: OutcomeDirectionExpected,
  actual: OutcomeDirectionActual,
): OutcomeComparisonResult {
  if (expected === "maintain") {
    return actual === "unchanged" ? "met" : "not-met";
  }
  if (expected === "improve") {
    if (actual === "improved") return "met";
    if (actual === "unchanged") return "partially-met";
    return "not-met";
  }
  if (actual === "worsened") return "met";
  if (actual === "unchanged") return "partially-met";
  return "not-met";
}

function compareOutcomes(input: {
  readonly expected: ExecutiveOutcomeExpectation | null;
  readonly actual: ExecutiveOutcomeObservation | null;
  readonly conflicting: readonly ExecutiveOutcomeObservation[];
  readonly baseline: ExecutiveOutcomeBaseline | null;
  readonly stale: boolean;
}): ExecutiveOutcomeComparison {
  if (input.conflicting.length > 1) {
    return Object.freeze({
      result: "unknown",
      comparable: false,
      numericDelta: null,
      incompatibilityReason: "conflicting-observations",
      statement:
        "Observations conflict. Nexora will not declare the expected result met or not met.",
    });
  }
  if (input.expected == null && input.actual == null) {
    return Object.freeze({
      result: "unknown",
      comparable: false,
      numericDelta: null,
      incompatibilityReason: "missing-expected-and-actual",
      statement: "No validated Outcome evidence available.",
    });
  }
  if (input.expected != null && input.actual == null) {
    return Object.freeze({
      result: "unknown",
      comparable: false,
      numericDelta: null,
      incompatibilityReason: "actual-unavailable",
      statement: `${input.expected.statement} No validated actual outcome is available yet.`,
    });
  }
  if (input.actual != null && input.expected == null) {
    return Object.freeze({
      result: "unknown",
      comparable: false,
      numericDelta: null,
      incompatibilityReason: "expected-unavailable",
      statement:
        "Observed evidence exists, but Nexora does not have a validated expected outcome to compare.",
    });
  }
  const expected = input.expected!;
  const actual = input.actual!;
  if (expected.dimension !== actual.dimension) {
    return Object.freeze({
      result: "insufficient-comparable-evidence",
      comparable: false,
      numericDelta: null,
      incompatibilityReason: "dimension-mismatch",
      statement:
        "Expected and actual refer to different measures, so they are not directly comparable.",
    });
  }
  if (input.stale) {
    return Object.freeze({
      result: "unknown",
      comparable: false,
      numericDelta: null,
      incompatibilityReason: "stale-actual",
      statement:
        "Actual evidence is stale. Nexora will not treat it as a confident expected-result evaluation.",
    });
  }
  if (input.baseline == null) {
    return Object.freeze({
      result: "unknown",
      comparable: false,
      numericDelta: null,
      incompatibilityReason: "baseline-missing",
      statement:
        "Observed evidence exists, but the result cannot yet be evaluated against a validated baseline.",
    });
  }
  const numericReady =
    expected.numericTarget != null &&
    actual.numericValue != null &&
    expected.comparator != null &&
    (expected.unit ?? null) === (actual.unit ?? null);
  if (numericReady) {
    const delta = actual.numericValue! - expected.numericTarget!;
    const met = numericMet(
      actual.numericValue!,
      expected.numericTarget!,
      expected.comparator!,
    );
    const exceeded =
      met &&
      (expected.comparator === "lt" || expected.comparator === "lte"
        ? actual.numericValue! < expected.numericTarget! * 0.9
        : expected.comparator === "gt" || expected.comparator === "gte"
          ? actual.numericValue! > expected.numericTarget! * 1.1
          : false);
    const partial = !met && numericPartial(
      actual.numericValue!,
      expected.numericTarget!,
      expected.comparator!,
    );
    const result: OutcomeComparisonResult = exceeded
      ? "exceeded"
      : met
        ? "met"
        : partial
          ? "partially-met"
          : "not-met";
    return Object.freeze({
      result,
      comparable: true,
      numericDelta: delta,
      incompatibilityReason: null,
      statement:
        result === "met"
          ? "Expected result met."
          : result === "exceeded"
            ? "Expected result exceeded."
            : result === "partially-met"
              ? "Expected result partially observed."
              : "Expected result not observed.",
    });
  }
  if (expected.expectedDirection != null && actual.observedDirection != null) {
    const result = qualitativeResult(
      expected.expectedDirection,
      actual.observedDirection,
    );
    return Object.freeze({
      result,
      comparable: true,
      numericDelta: null,
      incompatibilityReason: null,
      statement:
        result === "met"
          ? "Expected result met."
          : result === "partially-met"
            ? "Expected result partially observed."
            : "Expected result not observed.",
    });
  }
  return Object.freeze({
    result: "insufficient-comparable-evidence",
    comparable: false,
    numericDelta: null,
    incompatibilityReason: "incompatible-evidence-shape",
    statement:
      "Expected and actual evidence are not in a form Nexora can compare without inventing a measure.",
  });
}

export function projectLiveOutcomeIntelligence(
  input: ProjectLiveOutcomeIntelligenceInput,
): ExecutiveOutcomeAssessment {
  const capture = input.capture ?? null;
  const actuals = Object.freeze(
    capture != null
      ? capture.linkedActuals.filter(
          (entry) =>
            entry.claimKind === "FACT" &&
            entry.validationStatus !== "unvalidated" &&
            entry.provenanceRefs.length > 0 &&
            entry.evidenceRefs.length > 0,
        )
      : (input.actuals ?? []).filter(
          (entry) =>
            entry.claimKind === "FACT" &&
            entry.outcomeLinked === true &&
            entry.validationStatus !== "unvalidated" &&
            entry.provenanceRefs.length > 0 &&
            entry.evidenceRefs.length > 0,
        ),
  );
  const resolvedBaseline = capture != null ? capture.baseline ?? input.baseline ?? null : input.baseline ?? null;
  const resolvedWindow = capture != null ? capture.evaluatorWindow : input.window;
  const resolvedReality =
    input.currentReality ??
    (capture?.currentReality
      ? {
          statement: capture.currentReality.statement,
          dimension: capture.currentReality.dimension,
          numericValue: capture.currentReality.numericValue,
        }
      : null);
  const conflicting = Object.freeze(
    actuals.filter((entry, index, list) =>
      list.some(
        (other, otherIndex) =>
          otherIndex !== index &&
          other.dimension === entry.dimension &&
          other.numericValue !== entry.numericValue,
      ),
    ),
  );
  const actual =
    conflicting.length > 1 ? null : (actuals[0] ?? null);
  const expected =
    input.expected?.claimKind === "PREDICTION" ? input.expected : null;
  const stale = actual?.freshness === "stale";
  const comparison = compareOutcomes({
    expected,
    actual,
    conflicting,
    baseline: resolvedBaseline,
    stale: stale === true,
  });
  const missing: string[] = [];
  if (expected == null) missing.push("expected-outcome");
  if (actual == null) missing.push("actual-outcome");
  if (
    (expected?.expectedDirection != null || expected?.numericTarget != null) &&
    resolvedBaseline == null &&
    actual != null
  ) {
    missing.push("baseline");
  }
  if (
    !(resolvedWindow?.decisionAt && resolvedWindow.executionAt && resolvedWindow.observedAt)
  ) {
    missing.push("observation-window");
  }
  const window: ExecutiveOutcomeWindow = Object.freeze({
    decisionAt: resolvedWindow?.decisionAt ?? null,
    executionAt: resolvedWindow?.executionAt ?? null,
    observedAt: resolvedWindow?.observedAt ?? actual?.observedAt ?? null,
    timingComplete: Boolean(
      resolvedWindow?.decisionAt &&
        resolvedWindow?.executionAt &&
        (resolvedWindow?.observedAt ?? actual?.observedAt),
    ),
  });
  let status: OutcomeAssessmentStatus = "not-observed";
  if (conflicting.length > 1) status = "conflicting";
  else if (stale) status = "stale";
  else if (actual != null && comparison.comparable) status = "comparison-ready";
  else if (actual != null) status = "comparison-incomplete";
  else if (actual != null) status = "observed";
  const evidenceStatus: OutcomeEvidenceStatus =
    conflicting.length > 1
      ? "conflicting"
      : stale
        ? "stale"
        : actual != null
          ? "present"
          : "missing";
  const partial = actuals.some((entry) => entry.validationStatus === "partial");
  const confidence: SemanticConfidence =
    status === "comparison-ready" && !partial ? "medium" : "low";
  return Object.freeze({
    identity: nexoraLiveOutcomeIntelligenceIdentity,
    subjectId: input.subjectId,
    decisionId: input.decisionId ?? null,
    executionId: input.executionId ?? null,
    baseline: resolvedBaseline,
    expectedOutcome: expected,
    actualOutcome: actual,
    conflictingObservations: conflicting,
    currentReality: resolvedReality
      ? Object.freeze({ ...resolvedReality, isOutcome: false as const })
      : null,
    comparison,
    evidenceStatus,
    confidence,
    provenanceRefs: unique([
      ...(expected?.provenanceRefs ?? []),
      ...(actual?.provenanceRefs ?? []),
      ...(resolvedBaseline?.provenanceRefs ?? []),
    ]),
    missingEvidence: Object.freeze(missing),
    observationWindow: window,
    status,
    establishesCausation: false,
    createsLearning: false,
  });
}

export function presentOutcomeAssessment(
  assessment: ExecutiveOutcomeAssessment,
): string {
  if (
    assessment.expectedOutcome != null &&
    assessment.actualOutcome == null
  ) {
    return `${assessment.expectedOutcome.statement} No validated actual outcome is available yet.`;
  }
  if (
    assessment.actualOutcome != null &&
    assessment.comparison.result === "unknown"
  ) {
    return assessment.comparison.statement;
  }
  if (assessment.comparison.comparable) {
    return assessment.comparison.statement;
  }
  if (assessment.currentReality) {
    return "Current business measurements are Reality, not a Decision Outcome. No validated Outcome evidence is available yet.";
  }
  return "No live Outcome is available yet. Nexora will not invent one.";
}

export function presentOutcomeConfidence(
  assessment: ExecutiveOutcomeAssessment,
): string {
  if (assessment.status === "stale") {
    return "Evidence is stale. Nexora will not treat this as a confident outcome evaluation.";
  }
  if (assessment.status === "conflicting") {
    return "Evidence is conflicting. Nexora will not declare success or failure.";
  }
  if (assessment.actualOutcome == null) {
    return "Evidence limited. The actual outcome is not yet known.";
  }
  if (assessment.status === "comparison-incomplete") {
    return "Evidence limited. Observed evidence exists, but comparison is incomplete.";
  }
  return "Evidence limited. Outcome evaluation stays within the available evidence.";
}
