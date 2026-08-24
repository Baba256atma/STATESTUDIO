/**
 * MO:4 — Goal-Directed Executive Navigation.
 * Reranks valid MO:3 paths toward the active goal. Guides. Does not decide.
 */

import { collectManagerObjectContext } from "./managerObjectContext.ts";
import type { ManagerObjectContext } from "./managerObjectContext.ts";
import type { ExecutiveExplorationPath } from "./managerObjectExplorationTypes.ts";
import type { ExecutiveObjectExploration } from "./managerObjectExplorationTypes.ts";
import {
  GOAL_DIRECTED_NAVIGATION_BOUNDARY,
  goalDirectedNavigationIdentity,
  type ExecutiveGoalContext,
  type ExecutiveGoalCurrentPosition,
  type ExecutiveGoalGap,
  type ExecutiveGoalNavigation,
  type ExecutiveGoalSuccessSignal,
  type GoalProgressState,
  type GoalRelevanceSignal,
  type RankedGoalPath,
} from "./managerObjectGoalTypes.ts";
import {
  makeGoalContext,
  overlapCount,
  tokenizeGoalText,
  unknownGoalGap,
} from "./managerObjectGoalContext.ts";

export {
  GOAL_DIRECTED_NAVIGATION_BOUNDARY,
  goalDirectedNavigationIdentity,
} from "./managerObjectGoalTypes.ts";
export type { ExecutiveGoalNavigation } from "./managerObjectGoalTypes.ts";

const INFERRED_FAMILIES: readonly (readonly string[])[] = Object.freeze([
  Object.freeze(["cash", "margin", "revenue", "pricing", "price", "profit", "cost"]),
  Object.freeze(["delivery", "reliability", "capacity", "fulfillment", "availability"]),
  Object.freeze(["risk", "threat", "exposure"]),
]);

export function getGoalDirectedNavigationIdentity(): {
  readonly id: typeof goalDirectedNavigationIdentity;
  readonly version: "1.0.0";
  readonly namespace: "nexora.manager-object.goal-directed-navigation";
} {
  return Object.freeze({
    id: goalDirectedNavigationIdentity,
    version: "1.0.0" as const,
    namespace: "nexora.manager-object.goal-directed-navigation" as const,
  });
}

export function composeExecutiveGoalNavigation(input: {
  readonly context: ManagerObjectContext;
  readonly exploration: ExecutiveObjectExploration;
  readonly activeGoal: ExecutiveGoalContext;
  readonly secondaryGoals?: readonly ExecutiveGoalContext[];
}): ExecutiveGoalNavigation {
  const goal = input.activeGoal;
  const secondary = input.secondaryGoals ?? [];
  const successSignals = collectSuccessSignals(input.context, goal, input.exploration);
  const goalWithSignals: ExecutiveGoalContext = Object.freeze({
    ...goal,
    successSignals,
    constraints: collectConstraints(input.context),
    currentGap: measureGap(successSignals, goal),
  });
  const position = resolveCurrentPosition(input.context, goalWithSignals);
  const goalGap = goalWithSignals.currentGap ?? unknownGoalGap();
  const ranked = rankPaths(
    input.exploration.availablePaths,
    goalWithSignals,
    secondary,
    input.context,
  );
  const aligned = ranked.filter((item) => item.goalScore > 0);
  const recommended = goal.source === "unknown" ? null : aligned[0] ?? null;
  const alternatives = Object.freeze(
    (recommended ? aligned.slice(1, 3) : aligned.slice(0, 2)),
  );
  const progress = deriveProgress(successSignals);
  const blockers = collectBlockers(input.context, input.exploration, recommended);
  const unknowns = collectUnknowns(goalWithSignals, goalGap, successSignals, input.exploration);
  const conflicts = collectConflicts(recommended, secondary, ranked);
  const reasoningSummary = composeReasoning(
    goalWithSignals,
    position,
    recommended,
    goalGap,
    conflicts,
  );
  const managerFacingText = composeGuidance({
    goal: goalWithSignals,
    position,
    recommended,
    alternatives,
    goalGap,
    progress,
    blockers,
    conflicts,
    unknowns,
  });

  return Object.freeze({
    engineId: goalDirectedNavigationIdentity,
    goal: goalWithSignals,
    secondaryGoals: Object.freeze(secondary),
    currentPosition: position,
    goalGap,
    recommendedDirection: recommended
      ? recommended.path.label
      : goal.source === "unknown"
        ? "Goal is not yet known"
        : "No strongly goal-aligned path from this object",
    recommendedPath: recommended,
    alternativePaths: alternatives,
    progressState: progress.state,
    progressSignals: progress.signals,
    blockers,
    unknowns,
    conflicts,
    reasoningSummary,
    managerFacingText,
    usesLlm: false,
    commitsDecision: false,
    startsExecution: false,
    writesStageCoordinates: false,
  });
}

export function verifyGoalDirectedNavigation(): { readonly ok: true } {
  const identity = getGoalDirectedNavigationIdentity();
  if (identity.id !== "MO:4/GoalDirectedExecutiveNavigation") {
    throw new Error("MO:4 identity mismatch");
  }
  if (GOAL_DIRECTED_NAVIGATION_BOUNDARY.duplicatesMo3) {
    throw new Error("MO:4 must consume MO:3, not duplicate it");
  }
  if (GOAL_DIRECTED_NAVIGATION_BOUNDARY.commitsDecisions) {
    throw new Error("MO:4 must not commit decisions");
  }
  if (GOAL_DIRECTED_NAVIGATION_BOUNDARY.startsExecution) {
    throw new Error("MO:4 must not start execution");
  }
  if (GOAL_DIRECTED_NAVIGATION_BOUNDARY.promotesInferredToConfirmed) {
    throw new Error("MO:4 must not promote inferred goals");
  }
  return Object.freeze({ ok: true as const });
}

function rankPaths(
  paths: readonly ExecutiveExplorationPath[],
  goal: ExecutiveGoalContext,
  secondary: readonly ExecutiveGoalContext[],
  current: ManagerObjectContext,
): RankedGoalPath[] {
  if (goal.source === "unknown") {
    return paths.map((path) =>
      rankedPath(path, 0, [], [], "No active goal is available to rank this path."),
    );
  }
  const goalTokens = tokenizeGoalText(`${goal.title} ${goal.successSignals.map((s) => s.label).join(" ")}`);
  return [...paths]
    .map((path) => scorePath(path, goal, goalTokens, secondary, current))
    .sort(
      (left, right) =>
        right.goalScore - left.goalScore ||
        right.path.priority - left.path.priority ||
        left.path.label.localeCompare(right.path.label),
    );
}

function scorePath(
  path: ExecutiveExplorationPath,
  goal: ExecutiveGoalContext,
  goalTokens: Set<string>,
  secondary: readonly ExecutiveGoalContext[],
  current: ManagerObjectContext,
): RankedGoalPath {
  const target = path.targetObjectId
    ? collectManagerObjectContext(path.targetObjectId)
    : null;
  const haystack = tokenizeGoalText(pathCorpus(path, target));
  const directHits = overlapCount(goalTokens, haystack);
  const familyHits = inferredFamilyHits(goalTokens, haystack);
  const related = goal.relatedObjects.includes(path.targetObjectId ?? "");
  const signals: GoalRelevanceSignal[] = [];
  let score = 0;

  if (related) {
    score += 24;
    signals.push(signal("direct-goal-relationship", "Direct goal relationship", 24, "KNOWN"));
  }
  if (directHits > 0) {
    const contribution = Math.min(36, 12 * directHits);
    score += contribution;
    signals.push(
      signal("object-relationship", "Object / label overlap with the active goal", contribution, "KNOWN"),
    );
  }
  if (familyHits > 0 && directHits === 0) {
    const contribution = Math.min(18, 9 * familyHits);
    score += contribution;
    signals.push(
      signal("inferred-family", "Inferred goal-family relevance", contribution, "INFERRED"),
    );
  }
  if (path.kind === "INVESTIGATE" && (directHits > 0 || related)) {
    score += 18;
    signals.push(signal("problem-relevance", "Problem/risk relevance to the goal", 18, "KNOWN"));
  }
  if (
    path.kind === "INVESTIGATE" &&
    path.targetObjectId != null &&
    path.targetObjectId === current.associatedProblem.value
  ) {
    score += 22;
    signals.push(
      signal(
        "current-obstacle",
        "Recorded obstacle on the current object toward the goal",
        22,
        "KNOWN",
      ),
    );
  }
  if (path.kind === "RELATED_OBJECT" && (directHits > 0 || related)) {
    score += 14;
    signals.push(signal("related-object", "Related executive object on the goal path", 14, "KNOWN"));
  }
  if (path.kind === "SCENARIO" && (directHits > 0 || related || familyHits > 0)) {
    score += 10;
    signals.push(signal("scenario", "Scenario intelligence available on a goal-relevant path", 10, "PREDICTED"));
  }
  if (path.kind === "DECISION" && (directHits > 0 || related || familyHits > 0)) {
    score += 12;
    signals.push(signal("decision-requirement", "A decision is required to continue toward the goal", 12, "KNOWN"));
  }
  if (path.kind === "EXECUTION") {
    score += 8;
    signals.push(signal("execution-status", "Execution progress is the next recorded path", 8, "KNOWN"));
  }
  if (path.kind === "OUTCOME") {
    score += path.epistemicStatus === "UNKNOWN" ? 4 : 10;
    signals.push(
      signal(
        "outcome",
        path.epistemicStatus === "UNKNOWN"
          ? "Outcome comparison is not yet available"
          : "Outcome can be compared with the goal",
        path.epistemicStatus === "UNKNOWN" ? 4 : 10,
        path.epistemicStatus,
      ),
    );
  }
  if (path.kind === "EVIDENCE" && path.epistemicStatus === "UNKNOWN") {
    score += 6;
    signals.push(signal("evidence-quality", "Evidence quality is still unknown", 6, "UNKNOWN"));
  }
  if (path.kind === "GOAL") {
    score += 10;
    signals.push(signal("goal-object", "Canonical goal object / acted-on object", 10, "KNOWN"));
  }

  const conflictsWith = secondary
    .filter((other) => other.source !== "unknown")
    .filter((other) => {
      const otherTokens = tokenizeGoalText(other.title);
      const otherHits = overlapCount(otherTokens, haystack) + inferredFamilyHits(otherTokens, haystack);
      return otherHits > 0 && other.title.toLowerCase() !== goal.title.toLowerCase();
    })
    .map((other) => other.title);

  const why =
    signals.length > 0
      ? `${path.label} is a valid MO:3 path. ${signals.map((item) => item.label).join("; ")}.`
      : `${path.label} is a valid exploration path but is not strongly aligned with the active goal.`;

  return rankedPath(path, score, signals, conflictsWith, why);
}

function pathCorpus(
  path: ExecutiveExplorationPath,
  target: ManagerObjectContext | null,
): string {
  return [
    path.label,
    path.reason,
    path.relevance,
    target?.identity.value,
    target?.executiveMeaning.value,
    target?.kpi.value?.label,
    target?.currentState.value,
    target?.objectKind.value,
  ]
    .filter(Boolean)
    .join(" ");
}

function inferredFamilyHits(goalTokens: Set<string>, haystack: Set<string>): number {
  let hits = 0;
  for (const family of INFERRED_FAMILIES) {
    const goalInFamily = family.some((token) => goalTokens.has(token));
    const pathInFamily = family.some((token) => haystack.has(token));
    if (goalInFamily && pathInFamily) hits += 1;
  }
  return hits;
}

function rankedPath(
  path: ExecutiveExplorationPath,
  goalScore: number,
  relevanceSignals: readonly GoalRelevanceSignal[],
  conflictsWith: readonly string[],
  why: string,
): RankedGoalPath {
  return Object.freeze({
    path,
    goalScore,
    relevanceSignals: Object.freeze([...relevanceSignals]),
    conflictsWith: Object.freeze([...conflictsWith]),
    why,
  });
}

function signal(
  id: string,
  label: string,
  contribution: number,
  epistemicStatus: GoalRelevanceSignal["epistemicStatus"],
): GoalRelevanceSignal {
  return Object.freeze({ id, label, contribution, epistemicStatus });
}

function resolveCurrentPosition(
  context: ManagerObjectContext,
  goal: ExecutiveGoalContext,
): ExecutiveGoalCurrentPosition {
  if (context.objectId == null) {
    return Object.freeze({
      objectId: null,
      label: null,
      kind: null,
      relationToGoal: "unknown",
      summary: "No active executive object is in focus yet.",
      epistemicStatus: "UNKNOWN",
    });
  }
  const label = context.identity.value;
  const isGoalItself =
    context.objectKind.value === "goal" ||
    (goal.goalId != null && context.objectId === goal.goalId);
  const tokens = tokenizeGoalText(`${label} ${context.executiveMeaning.value ?? ""}`);
  const goalTokens = tokenizeGoalText(goal.title);
  const overlap = overlapCount(goalTokens, tokens) + inferredFamilyHits(goalTokens, tokens);
  const onPath =
    goal.relatedObjects.includes(context.objectId) ||
    context.associatedGoal.value === goal.goalId ||
    overlap > 0;
  const relation = isGoalItself
    ? "goal-itself"
    : goal.source === "unknown"
      ? "unknown"
      : onPath
        ? "on-path"
        : "unrelated";
  const summary = isGoalItself
    ? `${label} is the active goal object.`
    : relation === "on-path"
      ? `${label} is part of the current path toward ${goal.title}. It is not the goal itself.`
      : relation === "unrelated"
        ? `${label} is the current object, and it is not yet shown to sit on the active goal path.`
        : `${label} is the current object. Goal relation is unknown.`;
  return Object.freeze({
    objectId: context.objectId,
    label,
    kind: context.objectKind.value,
    relationToGoal: relation,
    summary,
    epistemicStatus: relation === "unrelated" ? "INFERRED" : context.identity.support === "KNOWN" ? "KNOWN" : "INFERRED",
  });
}

function collectSuccessSignals(
  context: ManagerObjectContext,
  goal: ExecutiveGoalContext,
  exploration: ExecutiveObjectExploration,
): readonly ExecutiveGoalSuccessSignal[] {
  if (goal.source === "unknown") return Object.freeze([]);
  const goalTokens = tokenizeGoalText(goal.title);
  const candidates = new Map<string, ManagerObjectContext>();
  if (context.objectId) candidates.set(context.objectId, context);
  for (const edge of context.relationships) {
    if (edge.otherId) candidates.set(edge.otherId, collectManagerObjectContext(edge.otherId));
  }
  for (const path of exploration.availablePaths) {
    if (path.targetObjectId && !candidates.has(path.targetObjectId)) {
      candidates.set(path.targetObjectId, collectManagerObjectContext(path.targetObjectId));
    }
  }
  const signals: ExecutiveGoalSuccessSignal[] = [];
  for (const [objectId, candidate] of candidates) {
    const kpi = candidate.kpi.value;
    if (kpi == null) continue;
    const tokens = tokenizeGoalText(`${candidate.identity.value} ${kpi.label}`);
    if (overlapCount(goalTokens, tokens) === 0 && inferredFamilyHits(goalTokens, tokens) === 0) {
      continue;
    }
    signals.push(
      Object.freeze({
        id: `${objectId}:${kpi.label}`,
        label: kpi.label,
        value: kpi.value,
        target: kpi.target ?? null,
        objectId,
        epistemicStatus: candidate.kpi.support === "KNOWN" ? "KNOWN" : "INFERRED",
      }),
    );
  }
  return Object.freeze(signals);
}

function collectConstraints(context: ManagerObjectContext): readonly string[] {
  const labels: string[] = [];
  if (context.associatedProblem.value) {
    labels.push(collectManagerObjectContext(context.associatedProblem.value).identity.value ?? context.associatedProblem.value);
  }
  return Object.freeze(labels.filter(Boolean));
}

function measureGap(
  signals: readonly ExecutiveGoalSuccessSignal[],
  goal: ExecutiveGoalContext,
): ExecutiveGoalGap {
  if (goal.source === "unknown") {
    return Object.freeze({
      quantification: "unknown",
      desiredState: null,
      currentState: null,
      summary: "Nexora does not yet know what outcome the manager wants.",
      epistemicStatus: "UNKNOWN",
    });
  }
  const measured = signals.find((signal) => parseNumber(signal.value) != null && parseNumber(signal.target) != null);
  if (measured == null) {
    const unknown = unknownGoalGap();
    if (signals.length === 0) {
      return Object.freeze({
        ...unknown,
        summary:
          "The goal is understood, but its measurable success criteria are not yet defined.",
      });
    }
    return unknown;
  }
  return Object.freeze({
    quantification: "measured",
    desiredState: measured.target,
    currentState: measured.value,
    summary: `${measured.label} is ${measured.value} against a target of ${measured.target}.`,
    epistemicStatus: "KNOWN",
  });
}

function deriveProgress(
  signals: readonly ExecutiveGoalSuccessSignal[],
): { readonly state: GoalProgressState; readonly signals: readonly string[] } {
  if (signals.length === 0) {
    return {
      state: "UNKNOWN",
      signals: Object.freeze([
        "The goal is understood, but its measurable success criteria are not yet defined.",
      ]),
    };
  }
  const measured = signals.filter((signal) => parseNumber(signal.value) != null && parseNumber(signal.target) != null);
  if (measured.length === 0) {
    return {
      state: "UNKNOWN",
      signals: Object.freeze(signals.map((signal) => `${signal.label}: ${signal.value ?? "UNKNOWN"}`)),
    };
  }
  const comparisons = measured.map((signal) => {
    const current = parseNumber(signal.value) ?? 0;
    const target = parseNumber(signal.target) ?? 0;
    return { signal, current, target, delta: current - target };
  });
  const allMet = comparisons.every((item) => item.current >= item.target);
  const anyFar = comparisons.some((item) => item.target !== 0 && item.current / item.target < 0.9);
  const state: GoalProgressState = allMet ? "ACHIEVED" : anyFar ? "OFF_TRACK" : "AT_RISK";
  return {
    state,
    signals: Object.freeze(
      comparisons.map(
        (item) => `${item.signal.label}: ${item.signal.value} vs ${item.signal.target} (${state})`,
      ),
    ),
  };
}

function collectBlockers(
  context: ManagerObjectContext,
  exploration: ExecutiveObjectExploration,
  recommended: RankedGoalPath | null,
): readonly string[] {
  const blockers: string[] = [];
  if (recommended?.path.kind === "DECISION") {
    blockers.push(
      `Progress toward the goal now depends on ${recommended.path.label}. Navigating to that decision is not the same as committing it.`,
    );
  }
  if (recommended?.path.kind === "EXECUTION") {
    blockers.push(
      "The recorded next path is execution progress. Viewing execution is not the same as starting execution.",
    );
  }
  if (context.associatedProblem.value && recommended?.path.kind === "INVESTIGATE") {
    const label = collectManagerObjectContext(context.associatedProblem.value).identity.value;
    if (label) blockers.push(`${label} is the recorded obstacle most directly connected to the current object.`);
  }
  if (exploration.blockedPaths.some((path) => /Approve/i.test(path.label))) {
    blockers.push("A duplicate decision commitment path is blocked.");
  }
  return Object.freeze(blockers);
}

function collectUnknowns(
  goal: ExecutiveGoalContext,
  gap: ExecutiveGoalGap,
  signals: readonly ExecutiveGoalSuccessSignal[],
  exploration: ExecutiveObjectExploration,
): readonly string[] {
  const unknowns: string[] = [];
  if (goal.source === "unknown") {
    unknowns.push("Nexora does not yet know what outcome the manager wants.");
  }
  if (goal.source !== "unknown" && signals.length === 0) {
    unknowns.push("Measurable success criteria are not yet defined.");
  }
  if (gap.quantification === "unknown" && goal.source !== "unknown") {
    unknowns.push(gap.summary);
  }
  for (const path of exploration.availablePaths) {
    if (path.kind === "OUTCOME" && path.epistemicStatus === "UNKNOWN") {
      unknowns.push("No recorded outcome is available to compare with the goal.");
    }
  }
  return Object.freeze(unknowns);
}

function collectConflicts(
  recommended: RankedGoalPath | null,
  secondary: readonly ExecutiveGoalContext[],
  ranked: readonly RankedGoalPath[],
): readonly string[] {
  if (recommended == null || secondary.length === 0) return Object.freeze([]);
  const lines: string[] = [];
  for (const other of secondary) {
    const otherBest = ranked.find((item) => {
      const tokens = tokenizeGoalText(other.title);
      const target = item.path.targetObjectId
        ? collectManagerObjectContext(item.path.targetObjectId)
        : null;
      const haystack = tokenizeGoalText(pathCorpus(item.path, target));
      return overlapCount(tokens, haystack) + inferredFamilyHits(tokens, haystack) > 0;
    });
    const recommendedHelpsOther = recommended.conflictsWith.includes(other.title);
    if (otherBest && otherBest.path.pathId !== recommended.path.pathId && !recommendedHelpsOther) {
      lines.push(
        `This path supports ${recommended.path.label} toward the active goal but may conflict with ${other.title}. Trade-off intelligence remains the authority for resolving that tension.`,
      );
    } else if (recommendedHelpsOther) {
      lines.push(
        `This path has inferred relevance to both the active goal and ${other.title}. MO:4 does not resolve that trade-off.`,
      );
    }
  }
  return Object.freeze(lines);
}

function composeReasoning(
  goal: ExecutiveGoalContext,
  position: ExecutiveGoalCurrentPosition,
  recommended: RankedGoalPath | null,
  gap: ExecutiveGoalGap,
  conflicts: readonly string[],
): string {
  if (goal.source === "unknown") {
    return "Goal direction cannot be ranked until the manager goal is known.";
  }
  const parts = [
    `Active goal (${goal.source}): ${goal.title}.`,
    position.summary,
    gap.summary,
  ];
  if (recommended) {
    parts.push(`Recommended valid path: ${recommended.path.label}. ${recommended.why}`);
  } else {
    parts.push("No valid MO:3 path is strongly aligned with the active goal from this object.");
  }
  if (conflicts[0]) parts.push(conflicts[0]);
  return parts.join(" ");
}

function composeGuidance(input: {
  readonly goal: ExecutiveGoalContext;
  readonly position: ExecutiveGoalCurrentPosition;
  readonly recommended: RankedGoalPath | null;
  readonly alternatives: readonly RankedGoalPath[];
  readonly goalGap: ExecutiveGoalGap;
  readonly progress: { readonly state: GoalProgressState; readonly signals: readonly string[] };
  readonly blockers: readonly string[];
  readonly conflicts: readonly string[];
  readonly unknowns: readonly string[];
}): string {
  if (input.goal.source === "unknown") {
    return "Nexora does not yet know what outcome you want. Object-guided exploration is still available, but there is no goal direction to rank.";
  }
  const lines = [
    `Goal: ${input.goal.title}${input.goal.managerConfirmed ? "" : " (not yet confirmed by the manager)"}.`,
    `Current position: ${input.position.summary}`,
  ];
  if (input.goalGap.quantification === "measured") {
    lines.push(`Gap: ${input.goalGap.summary}`);
  }
  if (input.recommended) {
    lines.push(`Recommended direction: ${input.recommended.path.label}.`);
    lines.push(`Why: ${input.recommended.why}`);
    if (input.recommended.path.kind === "DECISION") {
      lines.push("A decision is now required to continue toward the goal. Nexora is not committing that decision.");
    }
    if (input.recommended.path.kind === "EXECUTION") {
      lines.push("The decision is on an execution path. Viewing execution progress is not starting execution.");
    }
    if (input.recommended.path.kind === "OUTCOME" && input.recommended.path.epistemicStatus === "UNKNOWN") {
      lines.push("No recorded outcome is available yet, so progress versus the goal remains UNKNOWN.");
    }
  } else {
    lines.push(
      "No strongly goal-aligned path is available from this object. Nexora will not invent a relationship because it sounds useful.",
    );
  }
  if (input.alternatives[0]) {
    lines.push(`Also available: ${input.alternatives.map((item) => item.path.label).join("; ")}.`);
  }
  if (input.conflicts[0]) lines.push(input.conflicts[0]);
  if (input.progress.state !== "UNKNOWN") {
    lines.push(`Progress: ${input.progress.state}.`);
  }
  if (input.goal.successSignals.length === 0) {
    lines.push("The goal is understood, but its measurable success criteria are not yet defined.");
  }
  return lines.join(" ");
}

function parseNumber(value: string | null | undefined): number | null {
  if (value == null) return null;
  const match = value.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  if (!match) return null;
  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
}

export function emptyGoalNavigation(exploration: ExecutiveObjectExploration): ExecutiveGoalNavigation {
  return composeExecutiveGoalNavigation({
    context: collectManagerObjectContext(exploration.subject.id),
    exploration,
    activeGoal: makeGoalContext({
      title: "Unknown goal",
      source: "unknown",
      managerConfirmed: false,
    }),
  });
}
