/**
 * DTH:12 — Learning & Reassessment Theatre composer.
 * Interprets existing Outcome projection. Does not write Learning or APP-4.
 */

import type { NexoraDecisionTheatreFoundation } from "./nexoraDecisionTheatreContract.ts";
import type { NexoraDecisionTheatreAuthoritativeOutcomeObservation } from "./nexoraDecisionTheatreOutcomeObservationComposer.ts";
import {
  nexoraDecisionTheatreLearningReassessmentIdentity,
  nexoraDecisionTheatreLearningReassessmentVersion,
  type NexoraDecisionTheatreLearningEffect,
  type NexoraDecisionTheatreLearningObservationState,
  type NexoraDecisionTheatreLearningReassessment,
  type NexoraDecisionTheatreLearningReassessmentAction,
  type NexoraDecisionTheatreLearningActionAvailability,
  type NexoraDecisionTheatreLearningReference,
  type NexoraDecisionTheatreReassessmentState,
} from "./nexoraDecisionTheatreLearningReassessment.ts";

export const nexoraDecisionTheatreLearningReassessmentComposerIdentity =
  "DTH:12/LearningReassessmentComposer" as const;

export type NexoraDecisionTheatreAuthoritativeAssumption = Readonly<{
  assumptionId: string;
  decisionId: string;
  statement: string;
}>;

function freezeTree<T>(value: T): T {
  if (value == null || typeof value !== "object") return value;
  if (Array.isArray(value)) {
    for (const item of value) freezeTree(item);
    return Object.freeze(value) as T;
  }
  for (const nested of Object.values(value as Record<string, unknown>)) {
    freezeTree(nested);
  }
  return Object.freeze(value);
}

function action(
  name: NexoraDecisionTheatreLearningReassessmentAction,
  available: boolean,
  reason: string,
): NexoraDecisionTheatreLearningActionAvailability {
  return Object.freeze({ action: name, available, reason });
}

function reference(input: {
  readonly kind: NexoraDecisionTheatreLearningReference["kind"];
  readonly id: string | null;
  readonly statement: string;
  readonly effect: NexoraDecisionTheatreLearningEffect;
}): NexoraDecisionTheatreLearningReference {
  return Object.freeze({
    kind: input.kind,
    id: input.id,
    statement: input.statement,
    effect: input.effect,
    rewritten: false as const,
    judgedTrueFalse: false as const,
  });
}

export function projectNexoraDecisionTheatreLearningReassessment(input: {
  readonly theatre: NexoraDecisionTheatreFoundation;
  readonly authoritativeOutcomeObservations?: readonly NexoraDecisionTheatreAuthoritativeOutcomeObservation[] | null;
  readonly authoritativeAssumptions?: readonly NexoraDecisionTheatreAuthoritativeAssumption[] | null;
}): NexoraDecisionTheatreLearningReassessment | null {
  const outcome = input.theatre.outcomeObservation;
  if (outcome == null) return null;
  const hasObservation = outcome.observedLabel != null;
  const partialOrUncertain =
    outcome.state === "OUTCOME_PARTIAL" || outcome.state === "OUTCOME_UNCERTAIN";
  const pending = outcome.state === "OUTCOME_PENDING" || !hasObservation;
  const state: NexoraDecisionTheatreLearningObservationState = pending
    ? "LEARNING_CANDIDATE"
    : partialOrUncertain
      ? "LEARNING_UNCERTAIN"
      : "LEARNING_SUPPORTED";
  const evidenceQuality = pending
    ? "insufficient"
    : partialOrUncertain
      ? "uncertain"
      : "supported";
  const relatedAssumptions = (input.authoritativeAssumptions ?? []).filter(
    (item) => item.decisionId === outcome.decisionId,
  );
  const affectedAssumptions = Object.freeze(
    relatedAssumptions.map((item) =>
      reference({
        kind: "assumption",
        id: item.assumptionId,
        statement: item.statement,
        effect: outcome.belowTarget === true ? "weakened" : outcome.belowTarget === false ? "strengthened" : "unresolved",
      }),
    ),
  );
  const weakenedHypotheses = Object.freeze(
    outcome.belowTarget === true
      ? [
          reference({
            kind: "target-expectation",
            id: null,
            statement:
              "The expectation that this intervention alone would fully reach the stated target",
            effect: "weakened",
          }),
        ]
      : [],
  );
  const relatedObservations = (input.authoritativeOutcomeObservations ?? []).filter(
    (item) => item.executionId === outcome.executionId,
  );
  const costWorsened = relatedObservations.some(
    (item) =>
      /cost/i.test(item.measure) &&
      item.baselineNumeric != null &&
      item.observedNumeric != null &&
      item.observedNumeric > item.baselineNumeric,
  );
  const deliveryImproved = relatedObservations.some(
    (item) =>
      /delivery/i.test(item.measure) &&
      item.baselineNumeric != null &&
      item.observedNumeric != null &&
      item.observedNumeric > item.baselineNumeric,
  );
  const contradictory = deliveryImproved && costWorsened;
  const reassessmentState: NexoraDecisionTheatreReassessmentState = pending
    ? "NO_REASSESSMENT"
    : outcome.belowTarget === true
      ? "REASSESSMENT_AVAILABLE"
      : "NO_REASSESSMENT";
  const managerConsent = /let'?s reconsider(?: the alternatives)?/i.test(
    input.theatre.managerQuestionRef ?? "",
  );
  const learned = pending
    ? "There isn't enough evidence yet to establish a reliable learning."
    : contradictory
      ? "Delivery improved, but the broader trade-off remains unresolved because a cost observation also worsened. That is not a single success or failure verdict."
      : outcome.belowTarget === true
        ? `${outcome.advisorReadable.result} ${outcome.advisorReadable.delta} ${outcome.advisorReadable.goal} That weakens the expectation that this intervention alone would fully close the gap. The evidence still does not establish that the intervention alone caused the improvement.`
        : `${outcome.advisorReadable.result} An observation is available. That is not the same as a confirmed Learning.`;
  const changed = pending
    ? "Understanding has not changed because a reliable Learning is not established."
    : outcome.belowTarget === true
      ? "The expectation that this intervention alone would reach the target is weaker. Causality remains unresolved."
      : "No supported change in understanding is established beyond the observation itself.";
  const assumptionCopy =
    affectedAssumptions.length === 0
      ? "No original assumption record is established to update."
      : affectedAssumptions[0].effect === "weakened"
        ? "The original assumption is weaker in light of the Outcome. It is not rewritten as false."
        : affectedAssumptions[0].effect === "strengthened"
          ? "The original assumption is stronger in light of the Outcome. It is not rewritten as true."
          : "The original assumption remains unresolved.";
  const decisionTitle = outcome.decisionTitle;
  const learningReassessmentId = `dth12-learning:${input.theatre.sceneScript.scriptId}:${outcome.executionId}:${state}`;
  return freezeTree({
    identity: nexoraDecisionTheatreLearningReassessmentIdentity,
    version: nexoraDecisionTheatreLearningReassessmentVersion,
    learningReassessmentId,
    open: true as const,
    state,
    reassessmentState,
    sceneIntentKind: input.theatre.sceneIntent.intentKind,
    sceneScriptId: input.theatre.sceneScript.scriptId,
    outcomeId: outcome.outcomeId,
    executionId: outcome.executionId,
    decisionId: outcome.decisionId,
    decisionTitle,
    outcomeState: outcome.state,
    outcomeDurability: "session" as const,
    outcomeAuthority: "CORE-OUT:1A session capture",
    learningAuthority: "CORE-OUT:2 interpretation rules (presentation only)" as const,
    durable: false as const,
    evidenceQuality,
    causalSupport: false as const,
    belowTarget: outcome.belowTarget,
    targetLabel: outcome.targetLabel,
    observedLabel: outcome.observedLabel,
    baselineLabel: outcome.baselineLabel,
    deltaLabel: outcome.deltaLabel,
    affectedAssumptions,
    weakenedHypotheses,
    strengthenedHypotheses: Object.freeze([]),
    unresolvedQuestions: Object.freeze(
      [
        "causality",
        outcome.financialKnown ? null : "financial impact",
        "whether the Decision was wrong",
      ].filter((item): item is string => item != null),
    ),
    contradictory,
    managerConsent,
    decisionJourneyReentered: false as const,
    comparisonMemberIds: outcome.comparisonMemberIds,
    unknowns: Object.freeze(
      [
        pending ? "reliable learning" : null,
        "causality",
        outcome.financialKnown ? null : "financial impact",
        relatedAssumptions.length === 0 ? "original assumption record" : null,
      ].filter((item): item is string => item != null),
    ),
    suggestedQuestions: Object.freeze([
      "What did we learn?",
      "What should we reconsider?",
      "Was our decision wrong?",
    ]),
    actions: Object.freeze([
      action("VIEW_LEARNING", !pending, pending ? "Reliable Learning is not established." : "Learning is a Theatre interpretation of the Outcome."),
      action("VIEW_RELATED_OUTCOME", true, "The Outcome remains visible as observation, not as Learning."),
      action("VIEW_AUTHORIZING_DECISION", true, "The authorizing Decision comes from the existing Decision authority."),
      action(
        "SHOW_COMPARISON_HISTORY",
        outcome.comparisonMemberIds.length >= 2,
        "Compared options remain available as history.",
      ),
      action("INSPECT_RELATED_OBJECT", true, "Inspection reuses existing object investigation."),
    ]),
    advisorReadable: Object.freeze({
      scene: pending
        ? `An Outcome is pending for the ${decisionTitle} execution, so Learning is not established.`
        : `The Theatre is now showing what the ${decisionTitle} result changes in our understanding, without replacing the Outcome.`,
      learned,
      changed,
      reconsider:
        reassessmentState === "REASSESSMENT_AVAILABLE"
          ? "The expectation that this intervention alone could reach the target deserves another look. That is not a new Decision."
          : "No supported reassessment is established yet.",
      decisionJudgment:
        "The observed result does not by itself establish that the Decision was wrong. Later evidence does not rewrite what was known when the Decision was made.",
      hindsight:
        "What we know now from the Outcome is separate from what was known at Decision time.",
      evidence: pending
        ? "No reliable Learning evidence is established yet."
        : outcome.advisorReadable.evidence,
      assumption: assumptionCopy,
      uncertain: [
        "Causality remains unresolved.",
        outcome.financialKnown ? null : "Financial impact is not established.",
      ]
        .filter((item): item is string => item != null)
        .join(" "),
      recommend:
        reassessmentState === "REASSESSMENT_AVAILABLE"
          ? "I would reassess whether this intervention alone is enough to reach the stated delivery target. That remains a recommendation."
          : "No additional action is recommended from Learning.",
      mustNotInfer: Object.freeze([
        "Outcome is not Learning.",
        "Learning is not confirmed truth.",
        "Improvement is not proven causation.",
        "Below target is not a wrong Decision.",
        "Reassessment is not a new Decision.",
        "Weakened is not false.",
        "Session evidence is not durable Learning.",
      ]),
    }),
    limitations: Object.freeze([
      "DTH:12 does not write Learning, APP-4 memory, Goal, Scenario, Decision, or Execution.",
      "CORE-OUT:1A and CC:11 remain session-scoped. Learning cannot outrank that evidence.",
    ]),
    derivationMetadata: Object.freeze({
      composer: "DTH:12/LearningReassessmentComposer" as const,
      inventedLearning: false as const,
      inventedAssumption: false as const,
      inventedCausality: false as const,
      outcomeBecameLearning: false as const,
      learningBecameDurable: false as const,
      learningBecameConfirmed: false as const,
      weakenedBecameFalse: false as const,
      strengthenedBecameTrue: false as const,
      mutatedGoal: false as const,
      mutatedDecision: false as const,
      mutatedScenario: false as const,
      mutatedExecution: false as const,
      mutatedOutcome: false as const,
      persistedApp4: false as const,
      clickMutatedLearning: false as const,
      automaticComparisonReopened: false as const,
      timestampUsed: false as const,
      randomUsed: false as const,
    }),
  });
}
