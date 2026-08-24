/**
 * NEX-EXP:10 — learning interpretation, assumption review, next-cycle routing.
 * Consumes EXP:9 handoff. Reuses EI:6, CORE-OUT:2, APP-4. Does not invent rules.
 */

import {
  EXECUTION_OUTCOME_LEARNING_BOUNDARY,
  assessCausalRelationship,
} from "@/app/lib/executive-intelligence/executionOutcomeLearningIntelligence.ts";
import { GROUNDED_LEARNING_BOUNDARY } from "@/app/lib/executive-intelligence/nexoraGroundedLearningIntelligence.ts";
import {
  DURABLE_EXECUTIVE_MEMORY_BOUNDARY,
  persistDurableExecutiveMemory,
  supersedeDurableExecutiveMemory,
} from "@/app/lib/executiveMemory/durableExecutiveMemory.ts";
import type { NexoraEntranceSession } from "./nexoraEntranceTypes.ts";
import type { NexoraLearningReassessmentHandoff } from "./nexoraOutcomeMonitoringTypes.ts";
import type {
  AssumptionReviewStatus,
  CausalLearningStatus,
  CycleStatus,
  DecisionOutcomeSupport,
  DecisionReassessment,
  ExecutiveAssumptionReview,
  ExecutiveCycleCompletion,
  ExecutiveLearningContext,
  ExecutiveLearningStatement,
  GoalReassessment,
  NextCycleRoute,
} from "./nexoraLearningReassessmentTypes.ts";

export function isLearningReassessmentUtterance(normalized: string): boolean {
  return (
    /what did we learn/.test(normalized) ||
    /which assumptions were (?:correct|wrong)/.test(normalized) ||
    /what did we not learn/.test(normalized) ||
    /did this prove the decision was right/.test(normalized) ||
    /did this prove .* caused/.test(normalized) ||
    /what should we reassess/.test(normalized) ||
    /is the goal still valid/.test(normalized) ||
    /should we change the goal/.test(normalized) ||
    /should we revisit the (?:problem|decision)/.test(normalized) ||
    /should we explore new scenarios/.test(normalized) ||
    /should we change execution/.test(normalized) ||
    /where should the next cycle start/.test(normalized) ||
    /what will nexora remember/.test(normalized) ||
    /why will you remember/.test(normalized) ||
    /are we done/.test(normalized) ||
    /what was wrong/.test(normalized) ||
    /what should we change/.test(normalized) ||
    /what should we do differently next time/.test(normalized) ||
    /should we try again/.test(normalized) ||
    /what would you do next/.test(normalized) ||
    /should we reassess/.test(normalized) ||
    /that learning is wrong|supersede that learning/.test(normalized)
  );
}

export function learningAuthorities() {
  const causal = assessCausalRelationship({
    temporalSequenceObserved: false,
    consistentWithExpectedDirection: null,
  });
  return Object.freeze({
    ei6: EXECUTION_OUTCOME_LEARNING_BOUNDARY.learningAuthority,
    coreOut2: GROUNDED_LEARNING_BOUNDARY.role,
    app4: DURABLE_EXECUTIVE_MEMORY_BOUNDARY.persistenceAuthority,
    causalStatus: causal.causalStatus,
    outcomeEqualsLearning: GROUNDED_LEARNING_BOUNDARY.outcomeEqualsLearning,
    singleCaseEqualsGeneralRule:
      GROUNDED_LEARNING_BOUNDARY.singleCaseEqualsGeneralRule,
    writesChatAsLearning:
      DURABLE_EXECUTIVE_MEMORY_BOUNDARY.storesConversationTranscript,
  });
}

export function reviewAssumptions(
  entrance: NexoraEntranceSession,
  handoff: NexoraLearningReassessmentHandoff | null,
): readonly ExecutiveAssumptionReview[] {
  const chosen =
    entrance.scenarioDiscovery?.scenarios.find(
      (entry) =>
        entry.id === entrance.decisionExperience?.handoff?.chosenScenario,
    ) ?? null;
  const assumptions = chosen?.assumptions ?? [];
  const observed = handoff?.observedOutcomes ?? [];
  const impact = handoff?.goalImpact?.state ?? "UNKNOWN";
  if (!assumptions.length) {
    return Object.freeze([
      Object.freeze({
        statement: "No material Scenario assumption was recorded to test.",
        status: "NOT_TESTED" as const,
        tested: false,
        evidence: Object.freeze([] as const),
      }),
    ]);
  }
  return Object.freeze(
    assumptions.map((assumption) => {
      const text = assumption.statement.toLowerCase();
      const related = observed.filter((entry) => {
        const hay =
          `${entry.measure ?? ""} ${entry.observedValue ?? ""} ${entry.state ?? ""}`.toLowerCase();
        return text
          .split(/\s+/)
          .some((token) => token.length > 4 && hay.includes(token));
      });
      const untestedTopic = /demand|supplier|lead time|3 days/.test(text);
      if ((untestedTopic && related.length === 0) || observed.length === 0) {
        return Object.freeze({
          statement: assumption.statement,
          status: "NOT_TESTED" as const,
          tested: false,
          evidence: Object.freeze([] as const),
        });
      }
      if (related.length === 0) {
        return Object.freeze({
          statement: assumption.statement,
          status: "NOT_TESTED" as const,
          tested: false,
          evidence: Object.freeze([
            "Assumption was present but not tested by observed Outcome evidence.",
          ]),
        });
      }
      let status: AssumptionReviewStatus = "UNKNOWN";
      if (impact === "IMPROVING" || impact === "ACHIEVED") status = "SUPPORTED";
      else if (impact === "WORSENING") status = "NOT_SUPPORTED";
      else if (impact === "MIXED" || impact === "UNCHANGED") status = "PARTIAL";
      return Object.freeze({
        statement: assumption.statement,
        status,
        tested: true,
        evidence: Object.freeze(related.map((entry) => entry.observationId)),
      });
    }),
  );
}

export function buildLearningStatements(input: {
  readonly entrance: NexoraEntranceSession;
  readonly handoff: NexoraLearningReassessmentHandoff | null;
  readonly reviews: readonly ExecutiveAssumptionReview[];
}): readonly ExecutiveLearningStatement[] {
  const observed = input.handoff?.observedOutcomes ?? [];
  if (!observed.length) return Object.freeze([]);
  const impact = input.handoff?.goalImpact?.state ?? "UNKNOWN";
  if (impact === "UNKNOWN") return Object.freeze([]);
  const expected =
    input.handoff?.expectedOutcomes[0] ?? "PREDICTED directional movement";
  const after = observed.at(-1)?.observedValue ?? "observed evidence";
  const context = input.entrance.goalDiscovery?.object?.id ?? "this-cycle";
  const held = input.reviews.filter((entry) => entry.status === "SUPPORTED");
  const failed = input.reviews.filter((entry) => entry.status === "NOT_SUPPORTED");
  const statements: ExecutiveLearningStatement[] = [
    Object.freeze({
      statement:
        impact === "MIXED"
          ? `Observed signals moved in more than one direction after the committed Decision. Expected remained ${expected}. This is mixed evidence, not a simple worked/failed lesson.`
          : impact === "WORSENING"
            ? `Observed outcome ${after} did not support the expected direction (${expected}) in this cycle.`
            : `Observed outcome ${after} moved with the expected direction (${expected}) in this specific cycle, but causal attribution remains unconfirmed.`,
      source: "CORE-OUT:2",
      evidence: Object.freeze(observed.map((entry) => entry.observationId)),
      scope: "THIS_CASE_ONLY",
      epistemicStatus: "INFERRED",
      causalStatus: "UNKNOWN" as CausalLearningStatus,
      appliesToContext: context,
      generalizationAllowed: false,
      managerConfirmed: false,
    }),
  ];
  if (held[0]) {
    statements.push(
      Object.freeze({
        statement: `Assumption held in this context: ${held[0].statement}`,
        source: "EI:6",
        evidence: held[0].evidence,
        scope: "THIS_CASE_ONLY",
        epistemicStatus: "INFERRED",
        causalStatus: "UNKNOWN",
        appliesToContext: context,
        generalizationAllowed: false,
        managerConfirmed: false,
      }),
    );
  }
  if (failed[0]) {
    statements.push(
      Object.freeze({
        statement: `Assumption was not supported by the observed outcome: ${failed[0].statement}`,
        source: "EI:6",
        evidence: failed[0].evidence,
        scope: "THIS_CASE_ONLY",
        epistemicStatus: "INFERRED",
        causalStatus: "UNKNOWN",
        appliesToContext: context,
        generalizationAllowed: false,
        managerConfirmed: false,
      }),
    );
  }
  return Object.freeze(statements);
}

export function evaluateDecisionSupport(
  impact: string | null | undefined,
): DecisionOutcomeSupport {
  if (impact === "ACHIEVED" || impact === "IMPROVING") return "SUPPORTED_BY_OUTCOME";
  if (impact === "MIXED" || impact === "UNCHANGED") return "PARTIALLY_SUPPORTED";
  if (impact === "WORSENING") return "NOT_SUPPORTED";
  if (!impact || impact === "UNKNOWN") return "INCONCLUSIVE";
  return "UNKNOWN";
}

export function routeNextCycle(input: {
  readonly impact: string | null | undefined;
  readonly signals: readonly string[];
  readonly utterance: string;
}): {
  readonly route: NextCycleRoute;
  readonly goal: GoalReassessment;
  readonly decision: DecisionReassessment;
} {
  const normalized = input.utterance.toLowerCase();
  if (/change the goal|redefine the goal|goal no longer/.test(normalized)) {
    return { route: "GOAL", goal: "CHANGE_GOAL", decision: "NO_DECISION_REQUIRED" };
  }
  if (/refine the goal/.test(normalized)) {
    return { route: "GOAL", goal: "REFINE_GOAL", decision: "CONTINUE_CURRENT_DECISION" };
  }
  if (input.impact === "ACHIEVED" || input.signals.includes("GOAL_ACHIEVED")) {
    return { route: "CLOSE", goal: "GOAL_ACHIEVED", decision: "NO_DECISION_REQUIRED" };
  }
  if (input.impact === "WORSENING" || input.signals.includes("GOAL_WORSENING")) {
    return { route: "ISSUE", goal: "CONTINUE_GOAL", decision: "REVISIT_DECISION" };
  }
  if (input.impact === "MIXED" || input.signals.includes("OUTCOME_BELOW_EXPECTATION")) {
    return { route: "SCENARIO", goal: "CONTINUE_GOAL", decision: "REVISIT_DECISION" };
  }
  if (input.impact === "IMPROVING") {
    return { route: "REALITY", goal: "CONTINUE_GOAL", decision: "ADJUST_EXECUTION" };
  }
  if (/revisit the decision|new decision/.test(normalized)) {
    return { route: "DECISION", goal: "CONTINUE_GOAL", decision: "REVISIT_DECISION" };
  }
  if (/change execution|adjust execution/.test(normalized)) {
    return { route: "EXECUTION", goal: "CONTINUE_GOAL", decision: "ADJUST_EXECUTION" };
  }
  return { route: "MONITOR", goal: "UNKNOWN", decision: "UNKNOWN" };
}

export function buildLearningContext(input: {
  readonly entrance: NexoraEntranceSession;
  readonly handoff: NexoraLearningReassessmentHandoff | null;
  readonly memoryStatus: ExecutiveLearningContext["memoryStatus"];
}): ExecutiveLearningContext {
  const reviews = reviewAssumptions(input.entrance, input.handoff);
  const statements = buildLearningStatements({
    entrance: input.entrance,
    handoff: input.handoff,
    reviews,
  });
  const observed = input.handoff?.observedOutcomes ?? [];
  return Object.freeze({
    learningId: "learning-exp10",
    goalId: input.entrance.goalDiscovery?.object?.id ?? null,
    decisionId: input.entrance.decisionExperience?.canonicalRecord?.decisionId ?? null,
    executionId: input.entrance.executionPlanning?.canonicalExecutionId ?? null,
    observations: Object.freeze(observed.map((entry) => entry.observationId)),
    supportedLearnings: statements,
    rejectedHypotheses: Object.freeze([
      "This cycle does not prove a general rule.",
      "This cycle does not confirm that execution caused the Outcome.",
    ]),
    assumptionReviews: reviews,
    causalStatus: "UNKNOWN",
    generalizability: "THIS_CASE_ONLY",
    confidence: statements.length ? "LOW" : "UNKNOWN",
    unknowns: Object.freeze([
      ...(input.handoff?.unknowns ?? []),
      "Causal attribution remains UNKNOWN.",
      "Future applicability remains UNKNOWN.",
    ]),
    evidence: Object.freeze(input.handoff?.evidence ?? []),
    provenance: Object.freeze([
      ...(input.handoff?.provenance ?? []),
      EXECUTION_OUTCOME_LEARNING_BOUNDARY.learningAuthority,
      GROUNDED_LEARNING_BOUNDARY.role,
    ]),
    memoryStatus: input.memoryStatus,
  });
}

export function buildCycle(input: {
  readonly entrance: NexoraEntranceSession;
  readonly handoff: NexoraLearningReassessmentHandoff | null;
  readonly context: ExecutiveLearningContext;
  readonly utterance: string;
}): ExecutiveCycleCompletion {
  const routed = routeNextCycle({
    impact: input.handoff?.goalImpact?.state,
    signals: input.handoff?.reassessmentSignals ?? [],
    utterance: input.utterance,
  });
  const cycleStatus: CycleStatus = !input.context.supportedLearnings.length
    ? input.handoff?.observedOutcomes.length
      ? "COMPLETE_WITH_OPEN_QUESTIONS"
      : "UNKNOWN"
    : routed.route === "CLOSE"
      ? "COMPLETE"
      : "REASSESSMENT_REQUIRED";
  const nextQuestion =
    routed.route === "SCENARIO"
      ? "The Goal remains valid, but the current Scenario underperformed. Shall we reopen Scenario exploration?"
      : routed.route === "ISSUE"
        ? "Goal conditions worsened. Shall we revisit the Problem before another Decision?"
        : routed.route === "REALITY"
          ? "Do you want to continue toward the same Goal by updating Reality and reassessing remaining options, or redefine the Goal?"
          : routed.route === "CLOSE"
            ? "The recorded Goal success criteria currently appear met. Shall we close this cycle or continue monitoring?"
            : "Where should the next executive cycle restart?";
  return Object.freeze({
    cycleId: "cycle-exp10",
    goalId: input.context.goalId,
    decisionId: input.context.decisionId,
    executionId: input.context.executionId,
    outcomeSummary: `Goal impact ${input.handoff?.goalImpact?.state ?? "UNKNOWN"}. Expected remained PREDICTED until observed.`,
    learningSummary:
      input.context.supportedLearnings[0]?.statement ??
      "Nexora does not yet have enough evidence to form a reliable Learning from this cycle.",
    resolvedItems: Object.freeze(
      input.context.assumptionReviews
        .filter((entry) => entry.tested)
        .map((entry) => entry.statement),
    ),
    unresolvedItems: Object.freeze(
      input.context.assumptionReviews
        .filter((entry) => !entry.tested)
        .map((entry) => entry.statement)
        .concat(input.context.unknowns.slice(0, 2)),
    ),
    reassessmentRoute: routed.route,
    nextExecutiveQuestion: nextQuestion,
    memoryWriteStatus: input.context.memoryStatus,
    cycleStatus,
    goalReassessment: routed.goal,
    decisionReassessment: routed.decision,
    decisionOutcomeSupport: evaluateDecisionSupport(
      input.handoff?.goalImpact?.state,
    ),
    lastCommittedDecision: null,
    lastMutatedExecution: null,
  });
}

export function maybePersistLearning(input: {
  readonly context: ExecutiveLearningContext;
  readonly previousMemoryId: string | null;
  readonly supersede: boolean;
}): {
  readonly memoryId: string | null;
  readonly memoryStatus: ExecutiveLearningContext["memoryStatus"];
} {
  const eligible =
    input.context.supportedLearnings.length > 0 &&
    input.context.evidence.length > 0 &&
    input.context.provenance.length > 0 &&
    input.context.observations.length > 0;
  if (!eligible) {
    return { memoryId: null, memoryStatus: "INELIGIBLE" };
  }
  if (input.previousMemoryId && !input.supersede) {
    return { memoryId: input.previousMemoryId, memoryStatus: "WRITTEN" };
  }
  const timestamp = new Date().toISOString();
  const id = `learning-exp10-${input.context.observations.length}`;
  const write = {
    id,
    workspaceId: input.context.goalId ?? "nexora-entrance",
    kind: "learning" as const,
    title: "Cycle Learning",
    summary: input.context.supportedLearnings[0]!.statement,
    narrative: `${input.context.supportedLearnings.map((entry) => entry.statement).join(" ")} Causal status ${input.context.causalStatus}. Scope ${input.context.generalizability}. Not a global rule.`,
    status: "supported",
    source: "EI:6/OutcomeEvaluation",
    owner: "nexora-exp10",
    confidence: 0.4,
    createdAt: timestamp,
    updatedAt: timestamp,
    subjectReferences: Object.freeze([
      {
        type: "decision" as const,
        targetId: input.context.decisionId ?? "decision-unknown",
        label: "Committed Decision",
      },
      {
        type: "execution" as const,
        targetId: input.context.executionId ?? "execution-unknown",
        label: "Canonical Execution",
      },
      {
        type: "outcome" as const,
        targetId: input.context.observations[0] ?? "outcome-unknown",
        label: "Observed Outcome",
      },
    ]),
    provenance: input.context.provenance,
    lesson: {
      lessonId: id,
      summary: input.context.supportedLearnings[0]!.statement,
      context: input.context.goalId ?? "this-cycle",
    },
  };
  if (input.supersede && input.previousMemoryId) {
    const result = supersedeDurableExecutiveMemory({
      obsoleteId: input.previousMemoryId,
      replacement: write,
      timestamp,
    });
    return {
      memoryId: result.success ? id : input.previousMemoryId,
      memoryStatus: result.success ? "SUPERSEDED" : "WRITTEN",
    };
  }
  const persisted = persistDurableExecutiveMemory(write);
  return {
    memoryId: persisted.success ? id : null,
    memoryStatus: persisted.success ? "WRITTEN" : "INELIGIBLE",
  };
}
