/**
 * MO:3 — Object-Guided Executive Exploration.
 * Discovers and ranks next paths from MO:1 context and MO:2 explanation.
 * Guides. Does not decide, commit, execute, or invent graph edges.
 */

import { collectManagerObjectContext } from "./managerObjectContext.ts";
import type { ManagerObjectContext } from "./managerObjectContext.ts";
import type { ExecutiveObjectExplanation } from "./managerObjectExplainTypes.ts";
import type { ManagerObjectIntent } from "./managerObjectInteractionFoundation.ts";
import {
  OBJECT_GUIDED_EXPLORATION_BOUNDARY,
  objectGuidedExplorationIdentity,
  type ExecutiveExplorationPath,
  type ExecutiveObjectExploration,
  type ExplorationState,
} from "./managerObjectExplorationTypes.ts";

export {
  OBJECT_GUIDED_EXPLORATION_BOUNDARY,
  objectGuidedExplorationIdentity,
} from "./managerObjectExplorationTypes.ts";
export type {
  ExecutiveExplorationPath,
  ExecutiveObjectExploration,
  ManagerObjectExplorationAnchor,
} from "./managerObjectExplorationTypes.ts";

export function getObjectGuidedExplorationIdentity(): {
  readonly id: typeof objectGuidedExplorationIdentity;
  readonly version: "1.0.0";
} {
  return Object.freeze({
    id: objectGuidedExplorationIdentity,
    version: "1.0.0" as const,
  });
}

export function composeExecutiveObjectExploration(input: {
  readonly context: ManagerObjectContext;
  readonly explanation: ExecutiveObjectExplanation;
  readonly intent: ManagerObjectIntent;
  readonly managerGoal?: string | null;
  readonly committedDecisionIds?: readonly string[];
}): ExecutiveObjectExploration {
  const context = input.context;
  const label = context.identity.value;
  const candidates = discoverPaths(input);
  const ranked = [...candidates.valid].sort(
    (left, right) =>
      right.priority - left.priority || left.label.localeCompare(right.label),
  );
  const availablePaths = Object.freeze(ranked);
  const recommendedPaths = Object.freeze(ranked.slice(0, 1));
  const alternativePaths = Object.freeze(ranked.slice(1, 3));
  const blockedPaths = Object.freeze(candidates.blocked);
  const unknowns = collectUnknowns(context, input.explanation);
  const explorationState = resolveState(
    recommendedPaths,
    unknowns,
    context.objectId,
  );
  const reasoningSummary = composeReasoning(
    label,
    recommendedPaths[0] ?? null,
    alternativePaths,
    explorationState,
  );
  const managerFacingText = composeGuidance(
    recommendedPaths[0] ?? null,
    alternativePaths,
    explorationState,
    reasoningSummary,
  );

  return Object.freeze({
    engineId: objectGuidedExplorationIdentity,
    subject: Object.freeze({
      id: context.objectId,
      label,
      kind: context.objectKind.value,
    }),
    intent: input.intent,
    explorationState,
    recommendedPaths,
    alternativePaths,
    availablePaths,
    blockedPaths,
    unknowns,
    reasoningSummary,
    managerFacingText,
    usesLlm: false,
    commitsDecision: false,
    startsExecution: false,
  });
}

export function resolveExplorationFollowUpTarget(
  utterance: string,
  anchor: { readonly targetObjectId: string | null } | null | undefined,
  previousActiveObjectId?: string | null,
): string | null {
  const normalized = utterance.toLowerCase().replace(/[?!.,]/g, " ").replace(/\s+/g, " ").trim();
  if (
    !/^(?:show me (?:that|the|this)(?: problem| scenario| decision| execution)?|show that(?: problem)?|open that|take me there)$/.test(
      normalized,
    )
  ) {
    return null;
  }
  if (anchor?.targetObjectId) return anchor.targetObjectId;
  if (previousActiveObjectId == null) return null;
  const previous = collectManagerObjectContext(previousActiveObjectId);
  if (/\bproblem\b/.test(normalized)) {
    return distinctId(previous.associatedProblem.value, previousActiveObjectId);
  }
  if (/\bscenario\b/.test(normalized)) {
    return distinctId(previous.scenarios.value?.[0] ?? null, previousActiveObjectId);
  }
  if (/\bdecision\b/.test(normalized)) {
    return distinctId(previous.decisions.value?.[0] ?? null, previousActiveObjectId);
  }
  if (/\bexecution\b/.test(normalized)) {
    return distinctId(previous.execution.value, previousActiveObjectId);
  }
  return anchor?.targetObjectId ?? null;
}

export function verifyObjectGuidedExploration(): { readonly ok: true } {
  if (getObjectGuidedExplorationIdentity().id !== "MO:3/ObjectGuidedExecutiveExploration") {
    throw new Error("MO:3 identity mismatch");
  }
  if (OBJECT_GUIDED_EXPLORATION_BOUNDARY.commitsDecisions) {
    throw new Error("MO:3 must not commit decisions");
  }
  if (OBJECT_GUIDED_EXPLORATION_BOUNDARY.startsExecution) {
    throw new Error("MO:3 must not start execution");
  }
  if (OBJECT_GUIDED_EXPLORATION_BOUNDARY.writesStageCoordinates) {
    throw new Error("MO:3 must not write Stage coordinates");
  }
  if (OBJECT_GUIDED_EXPLORATION_BOUNDARY.perObjectExplorationBranches) {
    throw new Error("MO:3 must remain object-type independent");
  }
  return Object.freeze({ ok: true as const });
}

function discoverPaths(input: {
  readonly context: ManagerObjectContext;
  readonly explanation: ExecutiveObjectExplanation;
  readonly managerGoal?: string | null;
  readonly committedDecisionIds?: readonly string[];
}): {
  readonly valid: ExecutiveExplorationPath[];
  readonly blocked: ExecutiveExplorationPath[];
} {
  const context = input.context;
  const goal = input.managerGoal ?? null;
  const committed = new Set(input.committedDecisionIds ?? []);
  const valid: ExecutiveExplorationPath[] = [];
  const blocked: ExecutiveExplorationPath[] = [];
  const seen = new Set<string>();
  const add = (path: ExecutiveExplorationPath | null, list: ExecutiveExplorationPath[] = valid) => {
    if (path == null || seen.has(path.pathId)) return;
    seen.add(path.pathId);
    list.push(path);
  };

  const problemId = distinctId(context.associatedProblem.value, context.objectId);
  if (problemId) {
    const problemLabel = labelFor(problemId);
    add(
      path({
        pathId: `investigate:${problemId}`,
        kind: "INVESTIGATE",
        label: `Investigate ${problemLabel}`,
        targetObjectId: problemId,
        question: "Why is this happening?",
        action: "INVESTIGATE",
        reason: `${problemLabel} is the recorded problem most directly connected to ${context.identity.value ?? "this object"}.`,
        relevance: "direct associated problem",
        priority: 100 + goalBoost(problemLabel, goal) + severityBoost(context),
        evidence: "MO:1 associated problem",
        epistemicStatus: context.associatedProblem.support === "KNOWN" ? "KNOWN" : "INFERRED",
      }),
    );
  }

  for (const edge of context.relationships) {
    if (edge.otherId == null || edge.otherId === context.objectId) continue;
    if (edge.otherId === problemId) continue;
    const otherKind = collectManagerObjectContext(edge.otherId).objectKind.value;
    if (otherKind === "problem") continue;
    if (otherKind === "risk") {
      add(
        path({
          pathId: `risk:${edge.otherId}`,
          kind: "RISK",
          label: `Review ${edge.otherLabel}`,
          targetObjectId: edge.otherId,
          question: "Show related risks.",
          action: null,
          reason: `${edge.otherLabel} is a recorded risk related to the current object. This relationship does not establish a confirmed cause.`,
          relevance: "related risk",
          priority: 60 + goalBoost(edge.otherLabel, goal),
          evidence: edge.relationshipId,
          epistemicStatus: edge.support === "KNOWN" ? "KNOWN" : "INFERRED",
        }),
      );
      continue;
    }
    if (otherKind === "scenario" || otherKind === "decision" || otherKind === "execution") {
      continue;
    }
    add(
      path({
        pathId: `related:${edge.otherId}`,
        kind: "RELATED_OBJECT",
        label: `Review ${edge.otherLabel}`,
        targetObjectId: edge.otherId,
        question: null,
        action: "VIEW_RELATIONSHIPS",
        reason: `${edge.otherLabel} is directly related to the current ${context.identity.value ?? "object"} issue. This recorded relationship does not establish a confirmed cause.`,
        relevance: `direct relationship (${humanize(edge.relationKind)})`,
        priority:
          55 +
          goalBoost(edge.otherLabel, goal) +
          (edge.support === "KNOWN" ? 8 : 0),
        evidence: edge.relationshipId,
        epistemicStatus: edge.support === "KNOWN" ? "KNOWN" : "INFERRED",
      }),
    );
  }

  const goalId = distinctId(context.associatedGoal.value, context.objectId);
  if (goalId) {
    const goalLabel = labelFor(goalId);
    add(
      path({
        pathId: `goal:${goalId}`,
        kind: "GOAL",
        label: `Review ${goalLabel}`,
        targetObjectId: goalId,
        question: null,
        action: null,
        reason: `${goalLabel} is the associated executive goal for this object.`,
        relevance: "associated goal",
        priority: 70 + goalBoost(goalLabel, goal),
        evidence: "MO:1 associated goal",
        epistemicStatus: "KNOWN",
      }),
    );
  } else if (context.objectKind.value === "goal") {
    const associated = context.relationships.find((edge) => edge.relationKind === "acts-on");
    if (associated?.otherId) {
      add(
        path({
          pathId: `goal-object:${associated.otherId}`,
          kind: "GOAL",
          label: `Review ${associated.otherLabel}`,
          targetObjectId: associated.otherId,
          question: null,
          action: null,
          reason: `${associated.otherLabel} is the executive object this goal acts on.`,
          relevance: "goal acts-on object",
          priority: 95 + goalBoost(associated.otherLabel, goal),
          evidence: associated.relationshipId,
          epistemicStatus: "KNOWN",
        }),
      );
    }
  }

  if (context.kpi.support === "UNKNOWN" || input.explanation.evidence.length === 0) {
    add(
      path({
        pathId: `evidence:${context.objectId ?? "none"}`,
        kind: "EVIDENCE",
        label: "Investigate evidence",
        targetObjectId: context.objectId,
        question: "What evidence do we have?",
        action: "INVESTIGATE",
        reason:
          "There is not enough authoritative evidence yet. Investigating the underlying evidence is the strongest next step.",
        relevance: "missing evidence",
        priority: 80,
        evidence: null,
        epistemicStatus: "UNKNOWN",
      }),
    );
  }

  const riskId = distinctId(context.associatedRisk.value, context.objectId);
  if (riskId) {
    const riskLabel = labelFor(riskId);
    add(
      path({
        pathId: `risk:${riskId}`,
        kind: "RISK",
        label: `Review ${riskLabel}`,
        targetObjectId: riskId,
        question: "Show related risks.",
        action: null,
        reason: `${riskLabel} is a recorded risk associated with the current object.`,
        relevance: "associated risk",
        priority: 60 + goalBoost(riskLabel, goal),
        evidence: "MO:1 associated risk",
        epistemicStatus: context.associatedRisk.support === "KNOWN" ? "KNOWN" : "INFERRED",
      }),
    );
  }

  const scenarioIds = uniqueIds(context.scenarios.value);
  const siblingScenarios = discoverSiblingScenarios(context, scenarioIds);
  for (const scenarioId of scenarioIds) {
    if (scenarioId === context.objectId) continue;
    const scenarioLabel = labelFor(scenarioId);
    add(
      path({
        pathId: `scenario:${scenarioId}`,
        kind: "SCENARIO",
        label: `Explore ${scenarioLabel}`,
        targetObjectId: scenarioId,
        question: "What options do we have?",
        action: "COMPARE_SCENARIOS",
        reason: `Scenario intelligence is available for this issue.`,
        relevance: "available scenario",
        priority: 50 + goalBoost(scenarioLabel, goal),
        evidence: "MO:1 linked scenario",
        epistemicStatus: "PREDICTED",
      }),
    );
  }

  const comparePool = uniqueIds([...scenarioIds, ...siblingScenarios]).filter(
    (id) => id !== context.objectId,
  );
  if (context.objectKind.value === "scenario") {
    comparePool.unshift(context.objectId ?? "");
  }
  const compareIds = uniqueIds(comparePool).filter(Boolean);
  if (compareIds.length >= 2) {
    add(
      path({
        pathId: `compare:${compareIds.slice(0, 2).join("+")}`,
        kind: "COMPARE",
        label: "Compare available scenarios",
        targetObjectId: compareIds.find((id) => id !== context.objectId) ?? compareIds[0] ?? null,
        question: "Compare them.",
        action: "COMPARE_SCENARIOS",
        reason: "More than one evaluated scenario is available to compare.",
        relevance: "multiple scenarios",
        priority: 48,
        evidence: "linked scenario set",
        epistemicStatus: "PREDICTED",
      }),
    );
  } else if (context.objectKind.value === "scenario" || scenarioIds.length === 1) {
    add(
      path(
        {
          pathId: "compare:blocked",
          kind: "COMPARE",
          label: "Compare available scenarios",
          targetObjectId: null,
          question: "Compare them.",
          action: "COMPARE_SCENARIOS",
          reason: "Only one evaluated scenario is currently available, so a comparison path is not supported.",
          relevance: "insufficient scenario set",
          priority: 0,
          evidence: null,
          epistemicStatus: "UNKNOWN",
        },
        blocked,
      ),
    );
  }

  if (
    problemId ||
    context.objectKind.value === "problem" ||
    context.objectKind.value === "risk" ||
    context.objectKind.value === "scenario"
  ) {
    add(
      path({
        pathId: `recommend:${context.objectId ?? "none"}`,
        kind: "RECOMMENDATION",
        label: "Ask for a recommendation",
        targetObjectId: context.objectId,
        question: "What do you recommend?",
        action: "RECOMMEND",
        reason:
          "Existing recommendation intelligence can be asked. Explanation will not invent a decision.",
        relevance: "recommendation handoff",
        priority: 35,
        evidence: "CC:8 handoff",
        epistemicStatus: "INFERRED",
      }),
    );
  }

  const decisionIds = uniqueIds(context.decisions.value);
  if (context.objectKind.value === "decision" && context.objectId) {
    decisionIds.push(context.objectId);
  }
  for (const decisionId of uniqueIds(decisionIds)) {
    const decisionLabel = labelFor(decisionId);
    const alreadyCommitted = committed.has(decisionId);
    add(
      path({
        pathId: `decision:${decisionId}`,
        kind: "DECISION",
        label: alreadyCommitted
          ? `Review ${decisionLabel}`
          : `Explore ${decisionLabel}`,
        targetObjectId: decisionId,
        question: alreadyCommitted
          ? "What evidence supports it?"
          : "What decision is required?",
        action: "DECIDE",
        reason: alreadyCommitted
          ? `${decisionLabel} is already committed. Review it; do not present a duplicate commitment.`
          : `${decisionLabel} is an available decision path. Exploring it is not the same as committing it.`,
        relevance: alreadyCommitted ? "committed decision" : "available decision",
        priority: alreadyCommitted ? 28 : 40,
        evidence: "Decision Runtime / MO:1 link",
        epistemicStatus: "KNOWN",
      }),
    );
    if (alreadyCommitted) {
      add(
        path(
          {
            pathId: `decision-commit-blocked:${decisionId}`,
            kind: "DECISION",
            label: "Approve",
            targetObjectId: decisionId,
            question: null,
            action: "DECIDE",
            reason: "A duplicate commitment path is blocked because Decision Runtime already records this decision as committed.",
            relevance: "commitment blocked",
            priority: 0,
            evidence: "Decision Runtime",
            epistemicStatus: "KNOWN",
          },
          blocked,
        ),
        blocked,
      );
    }
  }

  const executionId =
    distinctId(context.execution.value, context.objectId) ??
    (context.objectKind.value === "execution" ? context.objectId : null);
  if (executionId) {
    const executionLabel = labelFor(executionId);
    add(
      path({
        pathId: `execution:${executionId}`,
        kind: "EXECUTION",
        label: `View ${executionLabel}`,
        targetObjectId: executionId,
        question: "What happens after the decision?",
        action: "VIEW_EXECUTION",
        reason: `${executionLabel} is the associated execution. Viewing it is not the same as starting execution.`,
        relevance: "associated execution",
        priority: 32,
        evidence: "MO:1 linked execution",
        epistemicStatus: "KNOWN",
      }),
    );
  }

  if (
    context.objectKind.value === "execution" ||
    context.objectKind.value === "decision" ||
    executionId
  ) {
    const outcomeKnown = context.outcomes.support === "KNOWN";
    add(
      path({
        pathId: `outcome:${context.objectId ?? "none"}`,
        kind: "OUTCOME",
        label: outcomeKnown ? "Check recorded outcome" : "Monitor outcome",
        targetObjectId: context.objectId,
        question: "What outcome should we monitor?",
        action: "CHECK_OUTCOME",
        reason: outcomeKnown
          ? "A recorded outcome is available to inspect."
          : "No measured outcome has been recorded yet. Outcome remains UNKNOWN.",
        relevance: outcomeKnown ? "recorded outcome" : "missing outcome",
        priority: outcomeKnown ? 30 : 22,
        evidence: outcomeKnown ? "outcome intelligence" : null,
        epistemicStatus: outcomeKnown ? "KNOWN" : "UNKNOWN",
      }),
    );
  }

  if (context.objectKind.value === "execution") {
    for (const edge of context.relationships) {
      if (edge.otherId == null) continue;
      const related = collectManagerObjectContext(edge.otherId);
      for (const decisionId of uniqueIds(related.decisions.value)) {
        add(
          path({
            pathId: `execution-decision:${decisionId}`,
            kind: "DECISION",
            label: `Review ${labelFor(decisionId)}`,
            targetObjectId: decisionId,
            question: "Why was this recommended?",
            action: "DECIDE",
            reason: "The related decision is available from this execution context.",
            relevance: "execution to decision",
            priority: 45,
            evidence: "related object decision link",
            epistemicStatus: "KNOWN",
          }),
        );
      }
    }
  }

  for (const question of input.explanation.recommendedNextQuestions.slice(0, 2)) {
    add(
      path({
        pathId: `question:${slug(question)}`,
        kind: "QUESTION",
        label: question,
        targetObjectId: context.objectId,
        question,
        action: null,
        reason: "This follow-up is available from the current explanation.",
        relevance: "MO:2 suggested question",
        priority: 18,
        evidence: "MO:2",
        epistemicStatus: "INFERRED",
      }),
    );
  }

  return { valid, blocked };
}

function discoverSiblingScenarios(
  context: ManagerObjectContext,
  known: readonly string[],
): readonly string[] {
  const found: string[] = [];
  for (const edge of context.relationships) {
    if (edge.otherId == null) continue;
    const related = collectManagerObjectContext(edge.otherId);
    if (related.objectKind.value === "scenario" && related.objectId) {
      found.push(related.objectId);
    }
    for (const scenarioId of related.scenarios.value ?? []) {
      found.push(scenarioId);
    }
  }
  return uniqueIds(found).filter((id) => !known.includes(id));
}

function path(
  value: Omit<
    ExecutiveExplorationPath,
    "requiresManagerChoice" | "commitsDecision" | "startsExecution"
  >,
  _list?: ExecutiveExplorationPath[],
): ExecutiveExplorationPath {
  void _list;
  return Object.freeze({
    ...value,
    requiresManagerChoice: true,
    commitsDecision: false,
    startsExecution: false,
  });
}

function collectUnknowns(
  context: ManagerObjectContext,
  explanation: ExecutiveObjectExplanation,
): readonly string[] {
  const items: string[] = [];
  if (context.kpi.support === "UNKNOWN") {
    items.push("Measured KPI evidence is currently unknown.");
  }
  if (context.outcomes.support === "UNKNOWN") {
    items.push("No measured outcome has been recorded yet.");
  }
  if (context.relationships.length === 0 && context.objectId) {
    items.push("Related objects are not currently evidenced beyond identity.");
  }
  if (explanation.epistemicStatus === "UNKNOWN") {
    items.push("The current explanation still contains unresolved uncertainty.");
  }
  return Object.freeze(items);
}

function resolveState(
  recommended: readonly ExecutiveExplorationPath[],
  unknowns: readonly string[],
  objectId: string | null,
): ExplorationState {
  if (objectId == null) return "unknown";
  if (recommended.length === 0) return unknowns.length > 0 ? "unknown" : "blocked";
  if (recommended[0]?.epistemicStatus === "UNKNOWN") return "limited";
  return "ready";
}

function composeReasoning(
  label: string | null,
  recommended: ExecutiveExplorationPath | null,
  alternatives: readonly ExecutiveExplorationPath[],
  state: ExplorationState,
): string {
  if (state === "unknown" && recommended == null) {
    return "There is not enough connected information yet to determine a useful next path.";
  }
  if (recommended == null) {
    return "Nexora does not yet have enough evidence to recommend a decision path. Investigating the underlying evidence is the strongest next step.";
  }
  const also =
    alternatives.length > 0
      ? ` Also useful: ${alternatives.map((item) => item.label).join("; ")}.`
      : "";
  return `${recommended.label} is recommended from ${label ?? "the current object"} because ${uncapitalize(recommended.reason)}${also}`;
}

function composeGuidance(
  recommended: ExecutiveExplorationPath | null,
  alternatives: readonly ExecutiveExplorationPath[],
  state: ExplorationState,
  reasoningSummary: string,
): string {
  if (recommended == null) {
    return reasoningSummary;
  }
  const lines = [
    `Recommended next: ${recommended.label}`,
    recommended.reason,
  ];
  if (alternatives.length > 0) {
    lines.push(
      `Also useful: ${alternatives.map((item) => item.label).join("; ")}.`,
    );
  }
  if (state === "limited") {
    lines.push("This path is limited by missing evidence.");
  }
  void reasoningSummary;
  return lines.join(" ");
}

function goalBoost(label: string, goal: string | null): number {
  if (goal == null || goal.trim().length === 0) return 0;
  const goalTokens = tokenize(goal);
  const labelTokens = tokenize(label);
  let hits = 0;
  for (const token of labelTokens) {
    if (goalTokens.has(token)) hits += 1;
  }
  if (hits === 0) return 0;
  return Math.min(40, 12 * hits);
}

function severityBoost(context: ManagerObjectContext): number {
  const state = (context.currentState.value ?? "").toLowerCase();
  if (state.includes("risk") || state.includes("critical")) return 12;
  if (state.includes("watch")) return 6;
  return 0;
}

function tokenize(value: string): Set<string> {
  return new Set(
    value
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 2 && token !== "the" && token !== "and"),
  );
}

function labelFor(objectId: string): string {
  return collectManagerObjectContext(objectId).identity.value ?? objectId;
}

function distinctId(value: string | null, objectId: string | null): string | null {
  if (value == null || value === objectId) return null;
  return value;
}

function uniqueIds(values: readonly string[] | null | undefined): string[] {
  return [...new Set((values ?? []).filter(Boolean))];
}

function humanize(value: string): string {
  return value.replace(/-/g, " ");
}

function uncapitalize(value: string): string {
  return value.length === 0 ? value : `${value[0]!.toLowerCase()}${value.slice(1)}`;
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
