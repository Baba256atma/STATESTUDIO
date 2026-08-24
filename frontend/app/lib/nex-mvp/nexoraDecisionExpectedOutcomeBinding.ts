/**
 * MVP-OUT:1-R2 — Decision → measurable Expected Outcome binding.
 *
 * Connects an existing canonical expectation to a Decision.
 * Does not invent targets, metrics, units, or evaluation rules.
 */

import type { NexoraExecutiveEvidenceReference } from "../conversational-control/executiveRecommendation.ts";
import type {
  ExecutiveOutcomeExpectation,
  OutcomeNumericComparator,
  OutcomeDirectionExpected,
} from "../executive-intelligence/nexoraLiveOutcomeIntelligence.ts";

export const nexoraDecisionExpectedOutcomeBindingIdentity =
  "MVP-OUT:1-R2/DecisionExpectedOutcomeBinding" as const;
export const nexoraDecisionExpectedOutcomeBindingVersion = "1.0.0" as const;

export const DECISION_EXPECTED_OUTCOME_BINDING_BOUNDARY = Object.freeze({
  role: "expected-outcome-binding" as const,
  ownsOutcomeSemantics: false as const,
  inventsTargets: false as const,
  inventsMetrics: false as const,
  usesAdvisorProse: false as const,
  usesStageLabels: false as const,
  usesScenarioSummaryAlone: false as const,
  usesCurrentKpiTargetAsDecisionExpectation: false as const,
  usesLlm: false as const,
});

export type DecisionExpectedOutcomeBindingStatus =
  | "bound"
  | "incomplete"
  | "missing";

export type DecisionExpectedOutcomeBinding = Readonly<{
  readonly bindingId: string;
  readonly decisionId: string | null;
  readonly expectedOutcomeId: string | null;
  readonly subjectId: string | null;
  readonly metricId: string | null;
  readonly dimension: string | null;
  readonly unit: string | null;
  readonly target: number | null;
  readonly direction: OutcomeDirectionExpected | null;
  readonly evaluationRule: OutcomeNumericComparator | null;
  readonly sourceRef: string | null;
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  readonly provenanceRefs: readonly string[];
  readonly effectiveAt: string | null;
  readonly status: DecisionExpectedOutcomeBindingStatus;
  readonly unsupportedReasons: readonly string[];
  readonly expectation: ExecutiveOutcomeExpectation | null;
}>;

function freezeList<T>(values: readonly T[]): readonly T[] {
  return Object.freeze([...values]);
}

function isMeasurable(expected: ExecutiveOutcomeExpectation): boolean {
  return (
    typeof expected.dimension === "string" &&
    expected.dimension.length > 0 &&
    (expected.numericTarget != null ||
      expected.expectedDirection != null ||
      expected.comparator != null) &&
    expected.unit != null &&
    expected.unit.length > 0
  );
}

export function resolveDecisionExpectedOutcomeBinding(input: {
  readonly decisionId?: string | null;
  readonly subjectId?: string | null;
  readonly explicitExpected?: ExecutiveOutcomeExpectation | null;
  readonly advisorProse?: string | null;
  readonly currentKpiTarget?: string | null;
}): DecisionExpectedOutcomeBinding {
  const reasons: string[] = [];
  if (input.advisorProse != null && input.advisorProse.trim().length > 0) {
    reasons.push("advisor-prose-is-not-expected-outcome");
  }
  if (input.currentKpiTarget != null) {
    reasons.push("current-kpi-target-is-not-decision-expectation");
  }

  const expected = input.explicitExpected ?? null;
  if (expected == null) {
    return Object.freeze({
      bindingId: `bind:${input.decisionId ?? "none"}:missing`,
      decisionId: input.decisionId ?? null,
      expectedOutcomeId: null,
      subjectId: input.subjectId ?? null,
      metricId: null,
      dimension: null,
      unit: null,
      target: null,
      direction: null,
      evaluationRule: null,
      sourceRef: null,
      evidenceRefs: Object.freeze([]),
      provenanceRefs: Object.freeze([]),
      effectiveAt: null,
      status: "missing",
      unsupportedReasons: freezeList([
        ...reasons,
        "no-canonical-measurable-expectation",
      ]),
      expectation: null,
    });
  }

  const measurable = isMeasurable(expected);
  const status: DecisionExpectedOutcomeBindingStatus = measurable
    ? "bound"
    : "incomplete";
  if (!measurable) reasons.push("expectation-missing-metric-unit-or-rule");

  return Object.freeze({
    bindingId: `bind:${input.decisionId ?? "none"}:${expected.expectationId}`,
    decisionId: input.decisionId ?? null,
    expectedOutcomeId: expected.expectationId,
    subjectId: input.subjectId ?? null,
    metricId: expected.dimension,
    dimension: expected.dimension,
    unit: expected.unit,
    target: expected.numericTarget,
    direction: expected.expectedDirection,
    evaluationRule: expected.comparator,
    sourceRef: expected.source,
    evidenceRefs: freezeList(expected.evidenceRefs),
    provenanceRefs: freezeList(expected.provenanceRefs),
    effectiveAt: expected.capturedAt,
    status,
    unsupportedReasons: freezeList(reasons),
    expectation: measurable ? expected : null,
  });
}
