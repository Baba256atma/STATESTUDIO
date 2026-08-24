/**
 * MVP-OUT:1-R3 — Decision-time Outcome Commitment.
 *
 * Records a measurable expected Outcome at a genuine commitment boundary.
 * Does not evaluate Outcome, invent targets, or backfill historical fixtures.
 */

import type { NexoraExecutiveEvidenceReference } from "../conversational-control/executiveRecommendation.ts";
import type {
  ExecutiveOutcomeExpectation,
  OutcomeNumericComparator,
  OutcomeDirectionExpected,
} from "../executive-intelligence/nexoraLiveOutcomeIntelligence.ts";
import {
  resolveDecisionExpectedOutcomeBinding,
  type DecisionExpectedOutcomeBinding,
} from "./nexoraDecisionExpectedOutcomeBinding.ts";

export const nexoraDecisionOutcomeCommitmentIdentity =
  "MVP-OUT:1-R3/DecisionOutcomeCommitment" as const;
export const nexoraDecisionOutcomeCommitmentVersion = "1.0.0" as const;

export const DECISION_OUTCOME_COMMITMENT_BOUNDARY = Object.freeze({
  role: "decision-outcome-commitment" as const,
  ownsDecision: false as const,
  ownsOutcomeEvaluation: false as const,
  ownsLearning: false as const,
  ownsCausality: false as const,
  inventsTargets: false as const,
  inventsTimestamps: false as const,
  backfillsHistoricalFixtures: false as const,
  reconstructsExpectationFromActual: false as const,
  usesAdvisorProse: false as const,
  usesLlm: false as const,
});

export type DecisionOutcomeCommitmentStatus =
  | "committed"
  | "incomplete"
  | "missing";

export type DecisionOutcomeCommitment = Readonly<{
  readonly commitmentId: string;
  readonly decisionId: string | null;
  readonly expectedOutcomeId: string | null;
  readonly bindingId: string | null;
  readonly subjectId: string | null;
  readonly metricId: string | null;
  readonly dimension: string | null;
  readonly unit: string | null;
  readonly target: number | null;
  readonly direction: OutcomeDirectionExpected | null;
  readonly evaluationRule: OutcomeNumericComparator | null;
  readonly committedAt: string | null;
  readonly sourceRefs: readonly string[];
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  readonly provenanceRefs: readonly string[];
  readonly status: DecisionOutcomeCommitmentStatus;
  readonly unsupportedReasons: readonly string[];
  readonly binding: DecisionExpectedOutcomeBinding | null;
}>;

const store = new Map<string, DecisionOutcomeCommitment>();

function freezeList<T>(values: readonly T[]): readonly T[] {
  return Object.freeze([...values]);
}

export function decisionOutcomeCommitmentId(input: {
  readonly decisionId: string | null;
  readonly expectedOutcomeId: string | null;
  readonly bindingId: string | null;
}): string {
  return `outcome-commit:${input.decisionId ?? "none"}:${input.expectedOutcomeId ?? "none"}:${input.bindingId ?? "none"}`;
}

export function isPostBoundaryObservation(
  observedAt: string | null | undefined,
  boundaryAt: string | null | undefined,
): boolean {
  return Boolean(observedAt && boundaryAt && observedAt > boundaryAt);
}

function incomplete(
  input: {
    readonly decisionId?: string | null;
    readonly subjectId?: string | null;
    readonly committedAt?: string | null;
    readonly binding?: DecisionExpectedOutcomeBinding | null;
  },
  reasons: readonly string[],
  status: DecisionOutcomeCommitmentStatus,
): DecisionOutcomeCommitment {
  const binding = input.binding ?? null;
  return Object.freeze({
    commitmentId: decisionOutcomeCommitmentId({
      decisionId: input.decisionId ?? null,
      expectedOutcomeId: binding?.expectedOutcomeId ?? null,
      bindingId: binding?.bindingId ?? null,
    }),
    decisionId: input.decisionId ?? null,
    expectedOutcomeId: binding?.expectedOutcomeId ?? null,
    bindingId: binding?.bindingId ?? null,
    subjectId: input.subjectId ?? null,
    metricId: binding?.metricId ?? null,
    dimension: binding?.dimension ?? null,
    unit: binding?.unit ?? null,
    target: binding?.target ?? null,
    direction: binding?.direction ?? null,
    evaluationRule: binding?.evaluationRule ?? null,
    committedAt: input.committedAt ?? null,
    sourceRefs: Object.freeze([]),
    evidenceRefs: Object.freeze([]),
    provenanceRefs: Object.freeze([]),
    status,
    unsupportedReasons: freezeList(reasons),
    binding,
  });
}

export function resolveDecisionOutcomeCommitment(input: {
  readonly decisionId?: string | null;
  readonly subjectId?: string | null;
  readonly decisionCommitted?: boolean;
  readonly committedAt?: string | null;
  readonly explicitExpected?: ExecutiveOutcomeExpectation | null;
  readonly inheritedScenarioExpected?: ExecutiveOutcomeExpectation | null;
  readonly advisorProse?: string | null;
  readonly currentKpi?: { readonly statement?: string; readonly numericValue?: number | null } | null;
  readonly laterActual?: ExecutiveOutcomeExpectation | null;
}): DecisionOutcomeCommitment {
  const reasons: string[] = [];
  if (input.advisorProse != null && input.advisorProse.trim().length > 0) {
    reasons.push("advisor-prose-is-not-expected-outcome");
  }
  if (input.currentKpi != null) {
    reasons.push("current-kpi-is-not-expected-outcome");
  }
  if (input.laterActual != null) {
    reasons.push("later-actual-cannot-create-expectation");
  }

  const inherited = input.inheritedScenarioExpected ?? null;
  const inheritedMeasurable =
    inherited != null &&
    inherited.unit != null &&
    inherited.unit.length > 0 &&
    (inherited.numericTarget != null ||
      inherited.expectedDirection != null ||
      inherited.comparator != null) &&
    (inherited.source === "scenario" || inherited.source === "decision");
  if (inherited != null && !inheritedMeasurable) {
    reasons.push("scenario-prose-is-not-measurable-expectation");
  }

  const explicit = input.explicitExpected ?? (inheritedMeasurable ? inherited : null);
  const binding = resolveDecisionExpectedOutcomeBinding({
    decisionId: input.decisionId ?? null,
    subjectId: input.subjectId ?? null,
    explicitExpected: explicit,
  });

  if (!input.decisionId) reasons.push("missing-decision");
  if (input.decisionCommitted !== true) reasons.push("decision-not-committed");
  if (input.committedAt == null || input.committedAt.length === 0) {
    reasons.push("timing-incomplete");
  }
  if (binding.status !== "bound") {
    reasons.push("no-canonical-measurable-expectation");
  }
  if (binding.status === "bound" && binding.provenanceRefs.length === 0) {
    reasons.push("missing-provenance");
  }

  const ready =
    input.decisionId != null &&
    input.decisionCommitted === true &&
    input.committedAt != null &&
    input.committedAt.length > 0 &&
    binding.status === "bound" &&
    binding.expectation != null &&
    binding.provenanceRefs.length > 0;

  if (!ready) {
    return incomplete(
      {
        decisionId: input.decisionId ?? null,
        subjectId: input.subjectId ?? null,
        committedAt: input.committedAt ?? null,
        binding,
      },
      reasons,
      binding.status === "missing" && input.decisionCommitted !== true
        ? "missing"
        : "incomplete",
    );
  }

  const commitmentId = decisionOutcomeCommitmentId({
    decisionId: input.decisionId ?? null,
    expectedOutcomeId: binding.expectedOutcomeId,
    bindingId: binding.bindingId,
  });
  const existing = store.get(commitmentId);
  if (existing) return existing;

  const recorded: DecisionOutcomeCommitment = Object.freeze({
    commitmentId,
    decisionId: input.decisionId ?? null,
    expectedOutcomeId: binding.expectedOutcomeId,
    bindingId: binding.bindingId,
    subjectId: input.subjectId ?? null,
    metricId: binding.metricId,
    dimension: binding.dimension,
    unit: binding.unit,
    target: binding.target,
    direction: binding.direction,
    evaluationRule: binding.evaluationRule,
    committedAt: input.committedAt ?? null,
    sourceRefs: freezeList([
      `decision:${input.decisionId}`,
      `expected:${binding.expectedOutcomeId}`,
    ]),
    evidenceRefs: freezeList(binding.evidenceRefs),
    provenanceRefs: freezeList(binding.provenanceRefs),
    status: "committed",
    unsupportedReasons: freezeList(reasons),
    binding,
  });
  store.set(commitmentId, recorded);
  return recorded;
}

export function listDecisionOutcomeCommitments(): readonly DecisionOutcomeCommitment[] {
  return Object.freeze([...store.values()]);
}

export function resetDecisionOutcomeCommitmentForTests(): void {
  store.clear();
}
