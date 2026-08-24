/**
 * MO:5 — Executive Journey & Progress Intelligence.
 * Interprets existing MO:1–MO:4 + runtime facts. Guides. Does not workflow.
 */

import { collectManagerObjectContext } from "./managerObjectContext.ts";
import type { ManagerObjectContext } from "./managerObjectContext.ts";
import type { ExecutiveObjectExplanation } from "./managerObjectExplainTypes.ts";
import type { ExecutiveObjectExploration } from "./managerObjectExplorationTypes.ts";
import type { ExecutiveGoalNavigation } from "./managerObjectGoalTypes.ts";
import {
  EXECUTIVE_JOURNEY_INTELLIGENCE_BOUNDARY,
  executiveJourneyIntelligenceIdentity,
  type ExecutiveJourneyBlocker,
  type ExecutiveJourneyIntelligence,
  type ExecutiveJourneyItem,
  type ExecutiveJourneyProgressSignal,
  type ExecutiveJourneySnapshot,
  type ExecutiveJourneyVisit,
  type GoalReevaluationAction,
  type JourneyBlockerKind,
  type JourneyDecisionState,
  type JourneyExecutionState,
  type JourneyHealth,
  type JourneyLearningState,
  type JourneyOutcomeState,
  type JourneyPhase,
  type JourneyState,
} from "./managerObjectJourneyTypes.ts";

export {
  EXECUTIVE_JOURNEY_INTELLIGENCE_BOUNDARY,
  executiveJourneyIntelligenceIdentity,
} from "./managerObjectJourneyTypes.ts";
export type { ExecutiveJourneyIntelligence } from "./managerObjectJourneyTypes.ts";

export function getExecutiveJourneyIntelligenceIdentity(): {
  readonly id: typeof executiveJourneyIntelligenceIdentity;
  readonly version: "1.0.0";
  readonly namespace: "nexora.manager-object.executive-journey-intelligence";
} {
  return Object.freeze({
    id: executiveJourneyIntelligenceIdentity,
    version: "1.0.0" as const,
    namespace: "nexora.manager-object.executive-journey-intelligence" as const,
  });
}

export type ExecutiveJourneyRuntimeFacts = {
  readonly committedDecisionIds?: readonly string[];
  readonly rejectedDecisionIds?: readonly string[];
  readonly comparedScenarioIds?: readonly string[];
  readonly executionStates?: Readonly<Record<string, JourneyExecutionState>>;
  readonly outcomeStates?: Readonly<Record<string, JourneyOutcomeState>>;
  readonly learningState?: JourneyLearningState;
  readonly pendingDecisionConfirmation?: boolean;
};

export function composeExecutiveJourneyIntelligence(input: {
  readonly context: ManagerObjectContext;
  readonly explanation: ExecutiveObjectExplanation;
  readonly exploration: ExecutiveObjectExploration;
  readonly navigation: ExecutiveGoalNavigation;
  readonly visitedSubjectIds?: readonly string[];
  readonly previousSnapshots?: readonly ExecutiveJourneySnapshot[];
  readonly previousBlockerKind?: JourneyBlockerKind | null;
  readonly statusQueryRepeat?: boolean;
  readonly facts?: ExecutiveJourneyRuntimeFacts;
}): ExecutiveJourneyIntelligence {
  const facts = input.facts ?? {};
  const goal = input.navigation.goal;
  const context = input.context;
  const exploration = input.exploration;
  const visits = projectVisits(input.visitedSubjectIds ?? []);
  const problemIds = unique([
    ...(context.associatedProblem.value ? [context.associatedProblem.value] : []),
    ...idsOfKind(exploration, "INVESTIGATE"),
  ]);
  const riskIds = unique([
    ...(context.associatedRisk.value ? [context.associatedRisk.value] : []),
    ...idsOfKind(exploration, "RISK"),
  ]);
  const scenarioIds = unique([
    ...(context.scenarios.value ?? []),
    ...idsOfKind(exploration, "SCENARIO"),
  ]);
  const decisionIds = unique([
    ...(context.decisions.value ?? []),
    ...idsOfKind(exploration, "DECISION"),
    ...(context.objectKind.value === "decision" && context.objectId
      ? [context.objectId]
      : []),
  ]);
  const executionIds = unique([
    ...(context.execution.value ? [context.execution.value] : []),
    ...idsOfKind(exploration, "EXECUTION"),
    ...(context.objectKind.value === "execution" && context.objectId
      ? [context.objectId]
      : []),
  ]);
  const compared = new Set(facts.comparedScenarioIds ?? []);
  const committed = new Set(facts.committedDecisionIds ?? []);
  const rejected = new Set(facts.rejectedDecisionIds ?? []);
  const scenarioCompared =
    scenarioIds.filter((id) => compared.has(id)).length >= 2 ||
    ((facts.comparedScenarioIds?.length ?? 0) >= 2 && scenarioIds.length > 0);
  const decisionCommitted = decisionIds.some((id) => committed.has(id));
  const decisionRejected = decisionIds.some((id) => rejected.has(id));
  const executionState = resolveExecutionState(executionIds, facts, context);
  const outcomeState = resolveOutcomeState(facts, context);
  const learningState = facts.learningState ?? "NOT_AVAILABLE";
  const decisionState = resolveDecisionState({
    decisionIds,
    committed: decisionCommitted,
    rejected: decisionRejected,
    pendingConfirmation: facts.pendingDecisionConfirmation === true,
    recommended: input.navigation.recommendedPath?.path.kind === "DECISION",
    viewingDecision: context.objectKind.value === "decision",
  });
  const goalKnown = goal.source !== "unknown";
  const realityKnown =
    context.kpi.support === "KNOWN" ||
    input.navigation.goalGap.quantification === "measured" ||
    input.navigation.goal.successSignals.some((signal) => signal.value != null) ||
    context.currentState.support === "KNOWN";
  const issueIdentified = problemIds.length > 0;
  const evidenceUnknown =
    context.kpi.support === "UNKNOWN" && input.explanation.evidence.length === 0;
  const phase = resolvePhase({
    goalKnown,
    realityKnown,
    issueIdentified,
    scenariosAvailable: scenarioIds.length > 0,
    decisionCommitted,
    executionState,
    outcomeState,
    learningState,
  });
  const blocker = resolveBlocker({
    goalKnown,
    realityKnown,
    issueIdentified,
    evidenceUnknown,
    scenarioIds,
    decisionIds,
    decisionCommitted,
    executionState,
    outcomeState,
    navigation: input.navigation,
    context,
  });
  let journeyState = resolveJourneyState({
    goalKnown,
    realityKnown,
    issueIdentified,
    scenariosAvailable: scenarioIds.length > 0,
    decisionCommitted,
    executionState,
    outcomeState,
    learningState,
    progress: input.navigation.progressState,
  });
  if (
    input.statusQueryRepeat === true &&
    input.previousBlockerKind != null &&
    blocker?.kind === input.previousBlockerKind &&
    (blocker.kind === "DECISION_REQUIRED" ||
      blocker.kind === "EXECUTION_BLOCKED" ||
      blocker.kind === "OUTCOME_REQUIRED")
  ) {
    journeyState = "STALLED";
  }
  const health = resolveHealth(journeyState, blocker);
  const resolvedItems = collectResolved({
    goal,
    realityKnown,
    issueIdentified,
    scenarioCompared,
    decisionCommitted,
    executionState,
    outcomeState,
    problemIds,
    decisionIds,
    context,
  });
  const unresolvedItems = collectUnresolved({
    goalKnown,
    realityKnown,
    evidenceUnknown,
    scenarioIds,
    scenarioCompared,
    decisionIds,
    decisionCommitted,
    executionState,
    outcomeState,
    learningState,
    context,
  });
  const progressSignals = collectProgressSignals({
    goal,
    realityKnown,
    issueIdentified,
    scenarioIds,
    scenarioCompared,
    decisionState,
    executionState,
    outcomeState,
    learningState,
  });
  const projection = semanticProjection({
    goal,
    problemIds,
    scenarioIds,
    decisionIds,
    executionIds,
    visits,
  });
  const nextMilestone = composeMilestone(
    blocker,
    input.navigation,
    executionState,
    outcomeState,
  );
  const snapshot: ExecutiveJourneySnapshot = Object.freeze({
    goalTitle: goal.title,
    phase,
    journeyState,
    blockerKind: blocker?.kind ?? null,
    objectId: context.objectId,
  });
  const history = Object.freeze(
    [...(input.previousSnapshots ?? []), snapshot].slice(-12),
  );
  const blockerText = composeBlockerText(blocker);

  return Object.freeze({
    engineId: executiveJourneyIntelligenceIdentity,
    journeyId: `journey:${goal.goalId ?? slug(goal.title)}`,
    activeGoal: goal,
    secondaryGoals: Object.freeze(input.navigation.secondaryGoals),
    currentObjectId: context.objectId,
    currentPhase: phase,
    journeyState,
    health,
    visitedSubjects: visits,
    resolvedItems,
    unresolvedItems,
    blockedItems: Object.freeze(
      unresolvedItems.filter((entry) => entry.id === (blocker?.kind ?? "").toLowerCase()),
    ),
    activeProblems: Object.freeze(problemIds),
    activeRisks: Object.freeze(riskIds),
    availableScenarios: Object.freeze(scenarioIds),
    scenarioBranches: Object.freeze(scenarioIds),
    decisionState,
    executionState,
    outcomeState,
    learningState,
    progressSignals,
    unknowns: collectUnknowns(
      goalKnown,
      evidenceUnknown,
      outcomeState,
      learningState,
      exploration,
    ),
    history,
    semanticProjection: projection,
    blocker,
    nextMilestone,
    objectFit: composeObjectFit(context, phase, goal, decisionState),
    reevaluation: resolveReevaluation(
      outcomeState,
      input.navigation.progressState,
      learningState,
    ),
    closesGoal: false,
    reasoningSummary: `${phase} / ${journeyState}. ${blockerText} This is journey progress, not business-root-cause proof.`,
    accomplishedText: composeAccomplished(resolvedItems, goal),
    unresolvedText: composeRemaining(unresolvedItems),
    blockerText,
    managerFacingText: composeSummary({
      goal,
      phase,
      journeyState,
      resolvedItems,
      unresolvedItems,
      blocker,
      nextMilestone,
      navigation: input.navigation,
    }),
    usesLlm: false,
    commitsDecision: false,
    startsExecution: false,
    writesStageCoordinates: false,
  });
}

export function verifyExecutiveJourneyIntelligence(): { readonly ok: true } {
  if (getExecutiveJourneyIntelligenceIdentity().id !== "MO:5/ExecutiveJourneyProgressIntelligence") {
    throw new Error("MO:5 identity mismatch");
  }
  if (EXECUTIVE_JOURNEY_INTELLIGENCE_BOUNDARY.workflowEngine) {
    throw new Error("MO:5 must not be a workflow engine");
  }
  if (EXECUTIVE_JOURNEY_INTELLIGENCE_BOUNDARY.treatsVisitedAsResolved) {
    throw new Error("MO:5 must not treat visited as resolved");
  }
  if (EXECUTIVE_JOURNEY_INTELLIGENCE_BOUNDARY.commitsDecisions) {
    throw new Error("MO:5 must not commit decisions");
  }
  if (EXECUTIVE_JOURNEY_INTELLIGENCE_BOUNDARY.startsExecution) {
    throw new Error("MO:5 must not start execution");
  }
  if (EXECUTIVE_JOURNEY_INTELLIGENCE_BOUNDARY.closesGoals) {
    throw new Error("MO:5 must not close goals");
  }
  return Object.freeze({ ok: true as const });
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "unknown";
}

function idsOfKind(
  exploration: ExecutiveObjectExploration,
  kind: ExecutiveObjectExploration["availablePaths"][number]["kind"],
): string[] {
  return exploration.availablePaths
    .filter((path) => path.kind === kind && path.targetObjectId)
    .map((path) => path.targetObjectId as string);
}

function unique(ids: readonly string[]): string[] {
  return [...new Set(ids.filter(Boolean))];
}

function projectVisits(ids: readonly string[]): readonly ExecutiveJourneyVisit[] {
  return Object.freeze(
    ids.map((objectId) => {
      const context = collectManagerObjectContext(objectId);
      return Object.freeze({
        objectId,
        kind: context.objectKind.value,
        label: context.identity.value,
      });
    }),
  );
}

function resolvePhase(input: {
  readonly goalKnown: boolean;
  readonly realityKnown: boolean;
  readonly issueIdentified: boolean;
  readonly scenariosAvailable: boolean;
  readonly decisionCommitted: boolean;
  readonly executionState: JourneyExecutionState;
  readonly outcomeState: JourneyOutcomeState;
  readonly learningState: JourneyLearningState;
}): JourneyPhase {
  if (input.learningState === "AVAILABLE" || input.learningState === "CAPTURED") {
    return "LEARNING";
  }
  if (
    input.outcomeState === "OBSERVED" ||
    input.outcomeState === "IMPROVED" ||
    input.outcomeState === "UNCHANGED" ||
    input.outcomeState === "DEGRADED" ||
    input.executionState === "COMPLETED"
  ) {
    return "OUTCOME";
  }
  if (
    input.executionState === "ACTIVE" ||
    input.executionState === "BLOCKED" ||
    input.decisionCommitted
  ) {
    return "EXECUTION";
  }
  if (input.scenariosAvailable) return "SCENARIO";
  if (input.issueIdentified) return "ISSUE";
  if (input.realityKnown && input.goalKnown) return "REALITY";
  if (input.goalKnown) return "GOAL";
  return "CONTEXT";
}

function resolveJourneyState(input: {
  readonly goalKnown: boolean;
  readonly realityKnown: boolean;
  readonly issueIdentified: boolean;
  readonly scenariosAvailable: boolean;
  readonly decisionCommitted: boolean;
  readonly executionState: JourneyExecutionState;
  readonly outcomeState: JourneyOutcomeState;
  readonly learningState: JourneyLearningState;
  readonly progress: ExecutiveGoalNavigation["progressState"];
}): JourneyState {
  if (
    input.progress === "ACHIEVED" &&
    (input.outcomeState === "IMPROVED" || input.outcomeState === "OBSERVED")
  ) {
    return "GOAL_ACHIEVED";
  }
  if (input.learningState === "AVAILABLE" || input.learningState === "CAPTURED") {
    return "LEARNING";
  }
  if (
    input.executionState === "COMPLETED" &&
    (input.outcomeState === "UNKNOWN" || input.outcomeState === "NOT_OBSERVED")
  ) {
    return "AWAITING_OUTCOME";
  }
  if (input.executionState === "ACTIVE" || input.executionState === "BLOCKED") {
    return "EXECUTING";
  }
  if (input.decisionCommitted) return "EXECUTING";
  if (input.scenariosAvailable) return "AWAITING_DECISION";
  if (input.issueIdentified || (input.goalKnown && input.realityKnown)) {
    return "INVESTIGATING";
  }
  if (input.goalKnown) return "DISCOVERING";
  return "UNKNOWN";
}

function resolveHealth(
  state: JourneyState,
  blocker: ExecutiveJourneyBlocker | null,
): JourneyHealth {
  if (state === "UNKNOWN") return "UNKNOWN";
  if (
    state === "STALLED" ||
    blocker?.kind === "DECISION_REQUIRED" ||
    blocker?.kind === "EXECUTION_BLOCKED"
  ) {
    return "BLOCKED";
  }
  if (blocker?.kind === "OUTCOME_REQUIRED" || blocker?.kind === "INSUFFICIENT_EVIDENCE") {
    return "AT_RISK";
  }
  return "HEALTHY";
}

function resolveDecisionState(input: {
  readonly decisionIds: readonly string[];
  readonly committed: boolean;
  readonly rejected: boolean;
  readonly pendingConfirmation: boolean;
  readonly recommended: boolean;
  readonly viewingDecision: boolean;
}): JourneyDecisionState {
  if (input.rejected) return "rejected";
  if (input.committed) return "committed";
  if (input.pendingConfirmation) return "awaiting-confirmation";
  if (input.recommended) return "recommended";
  if (input.viewingDecision || input.decisionIds.length > 0) return "proposed";
  return "none";
}

function resolveExecutionState(
  executionIds: readonly string[],
  facts: ExecutiveJourneyRuntimeFacts,
  context: ManagerObjectContext,
): JourneyExecutionState {
  for (const id of executionIds) {
    const stated = facts.executionStates?.[id];
    if (stated) return stated;
  }
  if (context.objectKind.value === "execution") {
    const state = (context.currentState.value ?? "").toLowerCase();
    if (state.includes("block")) return "BLOCKED";
    if (state.includes("complete") || state.includes("done")) return "COMPLETED";
    if (state.includes("active") || state.includes("progress")) return "ACTIVE";
  }
  if (executionIds.length > 0) return "NOT_STARTED";
  return "UNKNOWN";
}

function resolveOutcomeState(
  facts: ExecutiveJourneyRuntimeFacts,
  context: ManagerObjectContext,
): JourneyOutcomeState {
  if (context.outcomes.support === "KNOWN") return "OBSERVED";
  const stated = facts.outcomeStates?.[context.objectId ?? ""] ??
    facts.outcomeStates?.[context.execution.value ?? ""];
  return stated ?? "NOT_OBSERVED";
}

function resolveBlocker(input: {
  readonly goalKnown: boolean;
  readonly realityKnown: boolean;
  readonly issueIdentified: boolean;
  readonly evidenceUnknown: boolean;
  readonly scenarioIds: readonly string[];
  readonly decisionIds: readonly string[];
  readonly decisionCommitted: boolean;
  readonly executionState: JourneyExecutionState;
  readonly outcomeState: JourneyOutcomeState;
  readonly navigation: ExecutiveGoalNavigation;
  readonly context: ManagerObjectContext;
}): ExecutiveJourneyBlocker | null {
  const pathLabel = input.navigation.recommendedPath?.path.label ?? null;
  const block = (
    kind: JourneyBlockerKind,
    reason: string,
    subjectId: string | null,
    evidence: readonly string[],
  ): ExecutiveJourneyBlocker =>
    Object.freeze({
      kind,
      subjectId,
      reason,
      evidence: Object.freeze([...evidence]),
      epistemicStatus: "KNOWN" as const,
      severity:
        kind === "MISSING_GOAL" || kind === "DECISION_REQUIRED"
          ? ("high" as const)
          : ("medium" as const),
      recommendedResolutionPath: pathLabel,
      isBusinessCause: false as const,
    });
  if (!input.goalKnown) {
    return block(
      "MISSING_GOAL",
      "Nexora does not yet know the manager goal, so the executive journey cannot be directed.",
      null,
      ["MO:4 goal source unknown"],
    );
  }
  if (input.executionState === "BLOCKED") {
    return block(
      "EXECUTION_BLOCKED",
      "Canonical execution state is blocked. Viewing execution is not the same as starting or completing it.",
      input.context.execution.value ?? input.context.objectId,
      ["Execution Runtime"],
    );
  }
  if (
    input.executionState === "COMPLETED" &&
    (input.outcomeState === "NOT_OBSERVED" || input.outcomeState === "UNKNOWN")
  ) {
    return block(
      "OUTCOME_REQUIRED",
      "Execution is complete, but no outcome observation is recorded.",
      input.context.objectId,
      ["outcome authority missing"],
    );
  }
  if (input.decisionCommitted) return null;
  if (input.decisionIds.length > 0 || input.scenarioIds.length > 0) {
    return block(
      "DECISION_REQUIRED",
      "The issue and available options are understood enough to proceed, but no decision is committed. This is a journey process blocker, not a confirmed business cause.",
      input.decisionIds[0] ?? null,
      ["Decision Runtime: not committed"],
    );
  }
  if (input.issueIdentified && input.scenarioIds.length === 0) {
    if (input.evidenceUnknown) {
      return block(
        "INSUFFICIENT_EVIDENCE",
        "An issue is identified, but authoritative evidence is still insufficient.",
        input.context.associatedProblem.value,
        ["MO:2 evidence UNKNOWN"],
      );
    }
    return block(
      "SCENARIO_REQUIRED",
      "The issue is identified. Scenario intelligence is the next meaningful journey work if available.",
      input.context.associatedProblem.value,
      ["MO:3 scenario paths absent"],
    );
  }
  if (!input.issueIdentified && !input.realityKnown) {
    return block(
      "INSUFFICIENT_REALITY",
      "The goal is known, but current reality is not yet established with measured evidence.",
      input.context.objectId,
      ["KPI UNKNOWN"],
    );
  }
  if (!input.issueIdentified) {
    return block(
      "UNRESOLVED_ISSUE",
      "Current reality is known, but the governing issue is not yet identified.",
      input.context.objectId,
      ["no associated problem"],
    );
  }
  return null;
}

function collectResolved(input: {
  readonly goal: ExecutiveGoalNavigation["goal"];
  readonly realityKnown: boolean;
  readonly issueIdentified: boolean;
  readonly scenarioCompared: boolean;
  readonly decisionCommitted: boolean;
  readonly executionState: JourneyExecutionState;
  readonly outcomeState: JourneyOutcomeState;
  readonly problemIds: readonly string[];
  readonly decisionIds: readonly string[];
  readonly context: ManagerObjectContext;
}): readonly ExecutiveJourneyItem[] {
  const items: ExecutiveJourneyItem[] = [];
  if (input.goal.source !== "unknown") {
    items.push(
      item(
        "goal",
        `Goal ${input.goal.managerConfirmed ? "confirmed" : "understood"}: ${input.goal.title}`,
        "RESOLVED",
        input.goal.epistemicStatus,
        input.goal.goalId,
      ),
    );
  }
  if (input.realityKnown) {
    items.push(item("reality", "Current reality established", "RESOLVED", "KNOWN", input.context.objectId));
  }
  if (input.issueIdentified) {
    const label = input.problemIds[0]
      ? collectManagerObjectContext(input.problemIds[0]).identity.value
      : "Issue";
    items.push(
      item("issue", `Issue identified: ${label}`, "RESOLVED", "KNOWN", input.problemIds[0] ?? null),
    );
  }
  if (input.scenarioCompared) {
    items.push(item("scenarios", "Scenario comparison completed", "RESOLVED", "PREDICTED", null));
  }
  if (input.decisionCommitted) {
    items.push(item("decision", "Decision committed", "RESOLVED", "KNOWN", input.decisionIds[0] ?? null));
  }
  if (input.executionState === "COMPLETED") {
    items.push(item("execution", "Execution completed", "RESOLVED", "KNOWN", input.context.execution.value));
  }
  if (
    input.outcomeState === "OBSERVED" ||
    input.outcomeState === "IMPROVED" ||
    input.outcomeState === "UNCHANGED" ||
    input.outcomeState === "DEGRADED"
  ) {
    items.push(item("outcome", "Outcome observed", "RESOLVED", "KNOWN", input.context.objectId));
  }
  return Object.freeze(items);
}

function collectUnresolved(input: {
  readonly goalKnown: boolean;
  readonly realityKnown: boolean;
  readonly evidenceUnknown: boolean;
  readonly scenarioIds: readonly string[];
  readonly scenarioCompared: boolean;
  readonly decisionIds: readonly string[];
  readonly decisionCommitted: boolean;
  readonly executionState: JourneyExecutionState;
  readonly outcomeState: JourneyOutcomeState;
  readonly learningState: JourneyLearningState;
  readonly context: ManagerObjectContext;
}): readonly ExecutiveJourneyItem[] {
  const items: ExecutiveJourneyItem[] = [];
  if (!input.goalKnown) {
    items.push(item("goal", "Goal is not yet known", "UNRESOLVED", "UNKNOWN", null));
  }
  if (input.goalKnown && !input.realityKnown) {
    items.push(
      item("reality", "Measured reality is not yet established", "UNRESOLVED", "UNKNOWN", input.context.objectId),
    );
  }
  if (input.evidenceUnknown) {
    items.push(
      item("evidence", "Authoritative evidence remains UNKNOWN", "UNKNOWN", "UNKNOWN", input.context.objectId),
    );
  }
  if (input.scenarioIds.length > 0 && !input.scenarioCompared) {
    items.push(
      item(
        "scenarios",
        "Scenarios are available but comparison is not resolved",
        "UNRESOLVED",
        "PREDICTED",
        input.scenarioIds[0] ?? null,
      ),
    );
  }
  if (!input.decisionCommitted && (input.decisionIds.length > 0 || input.scenarioIds.length > 0)) {
    items.push(
      item("decision", "Decision has not been committed", "UNRESOLVED", "KNOWN", input.decisionIds[0] ?? null),
    );
  }
  if (
    input.decisionCommitted &&
    (input.executionState === "NOT_STARTED" || input.executionState === "UNKNOWN")
  ) {
    items.push(
      item("execution", "Execution has not started", "UNRESOLVED", "KNOWN", input.context.execution.value),
    );
  }
  if (input.outcomeState === "NOT_OBSERVED" || input.outcomeState === "UNKNOWN") {
    items.push(item("outcome", "No outcome is available yet", "UNKNOWN", "UNKNOWN", null));
  }
  if (input.learningState === "NOT_AVAILABLE" || input.learningState === "UNKNOWN") {
    items.push(item("learning", "Learning is not available", "UNKNOWN", "UNKNOWN", null));
  }
  return Object.freeze(items);
}

function item(
  id: string,
  label: string,
  status: ExecutiveJourneyItem["status"],
  epistemicStatus: ExecutiveJourneyItem["epistemicStatus"],
  subjectId: string | null,
): ExecutiveJourneyItem {
  return Object.freeze({ id, label, status, epistemicStatus, subjectId });
}

function collectProgressSignals(input: {
  readonly goal: ExecutiveGoalNavigation["goal"];
  readonly realityKnown: boolean;
  readonly issueIdentified: boolean;
  readonly scenarioIds: readonly string[];
  readonly scenarioCompared: boolean;
  readonly decisionState: JourneyDecisionState;
  readonly executionState: JourneyExecutionState;
  readonly outcomeState: JourneyOutcomeState;
  readonly learningState: JourneyLearningState;
}): readonly ExecutiveJourneyProgressSignal[] {
  return Object.freeze([
    progress("goal", "Goal", input.goal.source === "unknown" ? "UNKNOWN" : "KNOWN"),
    progress("reality", "Reality", input.realityKnown ? "KNOWN" : "UNKNOWN"),
    progress("issue", "Issue", input.issueIdentified ? "IDENTIFIED" : "UNKNOWN"),
    progress(
      "scenario",
      "Scenario",
      input.scenarioCompared ? "COMPARED" : input.scenarioIds.length > 0 ? "AVAILABLE" : "NONE",
    ),
    progress(
      "decision",
      "Decision",
      input.decisionState === "committed"
        ? "COMMITTED"
        : input.decisionState === "none"
          ? "NONE"
          : "PENDING",
    ),
    progress("execution", "Execution", input.executionState.replace("_", " ")),
    progress("outcome", "Outcome", input.outcomeState),
    progress(
      "learning",
      "Learning",
      input.learningState === "NOT_AVAILABLE" ? "NOT AVAILABLE" : input.learningState,
    ),
  ]);
}

function progress(
  id: string,
  label: string,
  value: string,
): ExecutiveJourneyProgressSignal {
  const unknown =
    value === "UNKNOWN" || value === "NOT_OBSERVED" || value === "NOT AVAILABLE";
  return Object.freeze({
    id,
    label,
    value,
    epistemicStatus: unknown ? "UNKNOWN" : "KNOWN",
  });
}

function semanticProjection(input: {
  readonly goal: ExecutiveGoalNavigation["goal"];
  readonly problemIds: readonly string[];
  readonly scenarioIds: readonly string[];
  readonly decisionIds: readonly string[];
  readonly executionIds: readonly string[];
  readonly visits: readonly ExecutiveJourneyVisit[];
}): readonly string[] {
  const labels: string[] = [];
  if (input.goal.source !== "unknown") labels.push(input.goal.title);
  const relatedKinds = new Set(["goal", "problem", "risk", "scenario", "decision", "execution"]);
  for (const visit of input.visits) {
    const related =
      (visit.kind != null && relatedKinds.has(visit.kind)) ||
      input.problemIds.includes(visit.objectId) ||
      input.scenarioIds.includes(visit.objectId) ||
      input.decisionIds.includes(visit.objectId) ||
      input.executionIds.includes(visit.objectId) ||
      input.goal.relatedObjects.includes(visit.objectId);
    if (!related) continue;
    const label = visit.label ?? visit.objectId;
    if (!labels.includes(label)) labels.push(label);
  }
  for (const id of [
    ...input.problemIds,
    ...input.scenarioIds.slice(0, 1),
    ...input.decisionIds.slice(0, 1),
    ...input.executionIds.slice(0, 1),
  ]) {
    const label = collectManagerObjectContext(id).identity.value;
    if (label && !labels.includes(label)) labels.push(label);
  }
  return Object.freeze(labels);
}

function composeObjectFit(
  context: ManagerObjectContext,
  phase: JourneyPhase,
  goal: ExecutiveGoalNavigation["goal"],
  decisionState: JourneyDecisionState,
): string {
  const label = context.identity.value ?? "This object";
  const kind = context.objectKind.value;
  const goalTitle = goal.source === "unknown" ? "an unknown goal" : goal.title;
  if (kind === "scenario") {
    return `${label} is part of the evaluation phase. It can support the active goal (${goalTitle}) and feed a pending decision. Viewing it is not the same as completing scenario comparison.`;
  }
  if (kind === "decision") {
    return `${label} is in the decision phase. Current decision state: ${decisionState}. Viewing a decision is not committing it.`;
  }
  if (kind === "execution") {
    return `${label} belongs to the execution phase of the active goal journey. Viewing execution is not starting execution.`;
  }
  if (kind === "problem" || kind === "risk") {
    return `${label} belongs to the issue phase of the journey toward ${goalTitle}.`;
  }
  if (kind === "goal") {
    return `${label} is the goal object for this journey.`;
  }
  return `${label} is the current object in the ${phase.toLowerCase()} phase of the executive journey.`;
}

function composeMilestone(
  blocker: ExecutiveJourneyBlocker | null,
  navigation: ExecutiveGoalNavigation,
  executionState: JourneyExecutionState,
  outcomeState: JourneyOutcomeState,
): string {
  if (blocker?.kind === "MISSING_GOAL") return "Confirm the manager goal.";
  if (blocker?.kind === "DECISION_REQUIRED") {
    return navigation.recommendedPath
      ? `Resolve the pending decision (${navigation.recommendedPath.path.label}).`
      : "Commit or reject the available decision.";
  }
  if (blocker?.kind === "EXECUTION_BLOCKED") {
    return "Review the blocked execution path. MO:5 does not start execution.";
  }
  if (blocker?.kind === "OUTCOME_REQUIRED") {
    return "Observe outcome against the active goal.";
  }
  if (executionState === "ACTIVE") return "Review execution progress.";
  if (outcomeState === "OBSERVED" || outcomeState === "IMPROVED") {
    return "Compare the observed outcome with the active goal. Do not auto-close the goal.";
  }
  if (navigation.recommendedPath) {
    return `Next meaningful path: ${navigation.recommendedPath.path.label}.`;
  }
  return "Continue object-guided exploration until a stronger journey milestone is supported.";
}

function resolveReevaluation(
  outcome: JourneyOutcomeState,
  progress: ExecutiveGoalNavigation["progressState"],
  learning: JourneyLearningState,
): GoalReevaluationAction {
  if (outcome === "NOT_OBSERVED" || outcome === "UNKNOWN") return "UNKNOWN";
  if (progress === "ACHIEVED" && (outcome === "IMPROVED" || outcome === "OBSERVED")) {
    return "CLOSE_GOAL";
  }
  if (outcome === "DEGRADED") return "REVISIT_DECISION";
  if (outcome === "UNCHANGED") return "REASSESS";
  if (learning === "AVAILABLE" || learning === "CAPTURED") return "REASSESS";
  return "CONTINUE";
}

function collectUnknowns(
  goalKnown: boolean,
  evidenceUnknown: boolean,
  outcome: JourneyOutcomeState,
  learning: JourneyLearningState,
  exploration: ExecutiveObjectExploration,
): readonly string[] {
  const unknowns: string[] = [];
  if (!goalKnown) unknowns.push("Manager goal is unknown.");
  if (evidenceUnknown) unknowns.push("Evidence quality is UNKNOWN.");
  if (outcome === "NOT_OBSERVED" || outcome === "UNKNOWN") {
    unknowns.push("Outcome is not observed.");
  }
  if (learning === "NOT_AVAILABLE") unknowns.push("Learning is not available.");
  if (
    exploration.availablePaths.some(
      (path) => path.kind === "OUTCOME" && path.epistemicStatus === "UNKNOWN",
    )
  ) {
    unknowns.push("MO:3 outcome path remains UNKNOWN.");
  }
  return Object.freeze(unknowns);
}

function composeAccomplished(
  resolved: readonly ExecutiveJourneyItem[],
  goal: ExecutiveGoalNavigation["goal"],
): string {
  if (resolved.length === 0) {
    return goal.source === "unknown"
      ? "Nothing in the executive journey is resolved yet because the goal is unknown."
      : "No authoritative accomplishments are recorded yet. Visiting objects is not the same as resolving them.";
  }
  return `What we have done so far: ${resolved.map((entry) => entry.label).join("; ")}.`;
}

function composeRemaining(unresolved: readonly ExecutiveJourneyItem[]): string {
  const open = unresolved.filter(
    (entry) => entry.status === "UNRESOLVED" || entry.status === "UNKNOWN",
  );
  if (open.length === 0) return "No unresolved journey items are currently identified.";
  return `What remains unresolved: ${open.map((entry, index) => `${index + 1}. ${entry.label}`).join(" ")}`;
}

function composeBlockerText(blocker: ExecutiveJourneyBlocker | null): string {
  if (blocker == null) return "No journey blocker is currently identified.";
  return `Current blocker: ${blocker.kind}. ${blocker.reason} This does not mean the blocker caused the business problem.`;
}

function composeSummary(input: {
  readonly goal: ExecutiveGoalNavigation["goal"];
  readonly phase: JourneyPhase;
  readonly journeyState: JourneyState;
  readonly resolvedItems: readonly ExecutiveJourneyItem[];
  readonly unresolvedItems: readonly ExecutiveJourneyItem[];
  readonly blocker: ExecutiveJourneyBlocker | null;
  readonly nextMilestone: string;
  readonly navigation: ExecutiveGoalNavigation;
}): string {
  const goalLine =
    input.goal.source === "unknown" ? "Goal: unknown." : `Goal: ${input.goal.title}.`;
  const where = `Where we are: ${describePhase(input.phase, input.journeyState)}`;
  const resolved =
    input.resolvedItems.length > 0
      ? `What is resolved: ${input.resolvedItems.map((entry) => entry.label).join("; ")}.`
      : "What is resolved: none yet.";
  const blocker = input.blocker
    ? `Current blocker: ${input.blocker.kind.toLowerCase().replace(/_/g, " ")}.`
    : "Current blocker: none.";
  const next = `Recommended next: ${input.navigation.recommendedPath?.path.label ?? input.nextMilestone}`;
  return [
    goalLine,
    where,
    resolved,
    composeRemaining(input.unresolvedItems),
    blocker,
    `Next milestone: ${input.nextMilestone}`,
    next,
  ].join(" ");
}

function describePhase(phase: JourneyPhase, state: JourneyState): string {
  if (state === "AWAITING_DECISION") {
    return "The issue is understood and scenarios are available. The journey is currently at the decision-preparation stage.";
  }
  if (state === "EXECUTING") return "A decision is committed and the journey is in execution.";
  if (state === "AWAITING_OUTCOME") {
    return "Execution is complete and the journey is waiting for an observed outcome.";
  }
  if (state === "STALLED") return "Executive progress appears stalled on the same journey blocker.";
  if (phase === "GOAL") return "The goal is known and the journey is beginning.";
  if (phase === "REALITY") return "Current reality is established relative to the goal.";
  if (phase === "ISSUE") return "The governing issue is identified and still under investigation.";
  if (phase === "SCENARIO") return "Scenario evaluation is the current executive work.";
  if (phase === "LEARNING") return "Authoritative learning is available for re-evaluation.";
  if (phase === "CONTEXT") {
    return "The manager/company context is in focus, but the goal is not yet established.";
  }
  return `Current executive phase: ${phase}.`;
}
