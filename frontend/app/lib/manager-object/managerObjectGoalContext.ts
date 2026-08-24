/**
 * MO:4 — canonical goal-context resolution.
 * Reuses CC:7 currentGoal, MO:1 associated/registered goals, and explicit manager statements.
 * Does not persist strategic goals and never promotes inferred → confirmed.
 */

import { collectManagerObjectContext } from "./managerObjectContext.ts";
import { getManagerObjectRegisteredSubjects } from "./managerObjectCatalog.ts";
import type { ExplanationEpistemicStatus } from "./managerObjectExplainTypes.ts";
import type {
  ExecutiveGoalContext,
  ExecutiveGoalGap,
  GoalPriorityRole,
  GoalSource,
} from "./managerObjectGoalTypes.ts";

const STOP = new Set([
  "the",
  "and",
  "for",
  "our",
  "my",
  "now",
  "that",
  "this",
  "with",
  "from",
  "into",
  "goal",
  "goals",
  "priority",
  "priorities",
  "improve",
  "protect",
  "protecting",
  "increase",
  "reduce",
  "actually",
]);

export function tokenizeGoalText(value: string | null | undefined): Set<string> {
  if (value == null) return new Set();
  return new Set(
    value
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 2 && !STOP.has(token)),
  );
}

export function overlapCount(left: Set<string>, right: Set<string>): number {
  let hits = 0;
  for (const token of left) {
    if (right.has(token)) hits += 1;
  }
  return hits;
}

export function parseExplicitGoalTitle(utterance: string): string | null {
  const normalized = utterance.toLowerCase().replace(/[?!.,]/g, " ").replace(/\s+/g, " ").trim();
  const patterns = [
    /^(?:my|our)\s+goal\s+is\s+(?:to\s+)?(.+)$/,
    /^(?:the\s+)?goal\s+is\s+(?:to\s+)?(.+)$/,
    /^(?:actually[, ]+)?(?:our\s+)?priority\s+is\s+(?:now\s+)?(.+)$/,
    /^(?:actually[, ]+)?(.+?)\s+is\s+now\s+the\s+priority$/,
  ];
  for (const pattern of patterns) {
    const match = normalized.match(pattern);
    const captured = match?.[1]?.trim();
    if (captured && captured.length > 2) {
      return titleCase(captured.replace(/^(?:to\s+)/, ""));
    }
  }
  return null;
}

function titleCase(value: string): string {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function unknownGoal(): ExecutiveGoalContext {
  return Object.freeze({
    goalId: null,
    title: "Unknown goal",
    description: null,
    source: "unknown",
    status: "unknown",
    epistemicStatus: "UNKNOWN",
    relatedObjects: Object.freeze([]),
    successSignals: Object.freeze([]),
    constraints: Object.freeze([]),
    currentGap: null,
    managerConfirmed: false,
    persisted: false,
    role: "UNKNOWN_PRIORITY",
  });
}

function matchRegisteredGoal(title: string): {
  readonly objectId: string;
  readonly canonicalName: string;
} | null {
  const tokens = tokenizeGoalText(title);
  let best: { objectId: string; canonicalName: string; hits: number } | null = null;
  for (const record of getManagerObjectRegisteredSubjects()) {
    const haystack = tokenizeGoalText(
      `${record.canonicalName} ${record.aliases.join(" ")}`,
    );
    const hits = overlapCount(tokens, haystack);
    if (hits === 0) continue;
    if (best == null || hits > best.hits) {
      best = { objectId: record.objectId, canonicalName: record.canonicalName, hits };
    }
  }
  if (best == null || best.hits < 2) return null;
  return { objectId: best.objectId, canonicalName: best.canonicalName };
}

function relatedForGoal(goalId: string | null): readonly string[] {
  if (goalId == null) return Object.freeze([]);
  const context = collectManagerObjectContext(goalId);
  const related = context.relationships
    .map((edge) => edge.otherId)
    .filter((id): id is string => id != null);
  return Object.freeze(related);
}

export function makeGoalContext(input: {
  readonly title: string;
  readonly goalId?: string | null;
  readonly source: GoalSource;
  readonly managerConfirmed: boolean;
  readonly persisted?: boolean;
  readonly role?: GoalPriorityRole;
  readonly description?: string | null;
  readonly epistemicStatus?: ExplanationEpistemicStatus;
}): ExecutiveGoalContext {
  const matched = input.goalId
    ? { objectId: input.goalId, canonicalName: input.title }
    : matchRegisteredGoal(input.title);
  const goalId = matched?.objectId ?? input.goalId ?? null;
  const title = matched && input.source !== "explicit" ? matched.canonicalName : input.title;
  const epistemic: ExplanationEpistemicStatus =
    input.epistemicStatus ??
    (input.source === "unknown"
      ? "UNKNOWN"
      : input.source === "inferred"
        ? "INFERRED"
        : "KNOWN");
  return Object.freeze({
    goalId,
    title,
    description: input.description ?? null,
    source: input.source,
    status: input.source === "unknown" ? "unknown" : "understood",
    epistemicStatus: epistemic,
    relatedObjects: relatedForGoal(goalId),
    successSignals: Object.freeze([]),
    constraints: Object.freeze([]),
    currentGap: null,
    managerConfirmed: input.managerConfirmed,
    persisted: input.persisted === true,
    role: input.role ?? (input.source === "unknown" ? "UNKNOWN_PRIORITY" : "ACTIVE"),
  });
}

export function unknownGoalGap(): ExecutiveGoalGap {
  return Object.freeze({
    quantification: "unknown",
    desiredState: null,
    currentState: null,
    summary:
      "The goal is known, but Nexora does not yet have enough measured data to quantify the gap.",
    epistemicStatus: "UNKNOWN",
  });
}

export function resolveExecutiveGoalContext(input: {
  readonly utterance: string;
  readonly previousActive?: ExecutiveGoalContext | null;
  readonly previousSecondary?: readonly ExecutiveGoalContext[];
  readonly executiveCurrentGoal?: {
    readonly subjectId: string | null;
    readonly canonicalName: string | null;
  } | null;
  readonly associatedGoalId?: string | null;
}): {
  readonly active: ExecutiveGoalContext;
  readonly secondary: readonly ExecutiveGoalContext[];
  readonly changed: boolean;
} {
  const stated = parseExplicitGoalTitle(input.utterance);
  const previous = input.previousActive ?? null;
  const previousSecondary = input.previousSecondary ?? [];

  if (stated) {
    const next = makeGoalContext({
      title: stated,
      source: matchRegisteredGoal(stated) ? "resolved" : "explicit",
      managerConfirmed: true,
      persisted: false,
      role: "ACTIVE",
    });
    const demoted =
      previous &&
      previous.source !== "unknown" &&
      previous.title.toLowerCase() !== next.title.toLowerCase()
        ? [
            {
              ...previous,
              role: "SECONDARY" as const,
              managerConfirmed: previous.managerConfirmed,
            },
            ...previousSecondary.filter(
              (goal) => goal.title.toLowerCase() !== next.title.toLowerCase(),
            ),
          ]
        : previousSecondary.filter(
            (goal) => goal.title.toLowerCase() !== next.title.toLowerCase(),
          );
    return Object.freeze({
      active: next,
      secondary: Object.freeze(dedupeGoals(demoted)),
      changed: previous?.title.toLowerCase() !== next.title.toLowerCase(),
    });
  }

  if (previous && previous.source !== "unknown") {
    return Object.freeze({
      active: previous,
      secondary: Object.freeze(previousSecondary),
      changed: false,
    });
  }

  const executive = input.executiveCurrentGoal;
  if (executive?.canonicalName) {
    return Object.freeze({
      active: makeGoalContext({
        title: executive.canonicalName,
        goalId: executive.subjectId,
        source: "resolved",
        managerConfirmed: false,
        persisted: executive.subjectId != null,
        role: "ACTIVE",
      }),
      secondary: Object.freeze(previousSecondary),
      changed: false,
    });
  }

  if (input.associatedGoalId) {
    const associated = collectManagerObjectContext(input.associatedGoalId);
    const title = associated.identity.value;
    if (title) {
      return Object.freeze({
        active: makeGoalContext({
          title,
          goalId: input.associatedGoalId,
          source: "resolved",
          managerConfirmed: false,
          persisted: true,
          role: "ACTIVE",
          epistemicStatus: associated.associatedGoal.support === "KNOWN" ? "KNOWN" : "INFERRED",
        }),
        secondary: Object.freeze(previousSecondary),
        changed: false,
      });
    }
  }

  return Object.freeze({
    active: unknownGoal(),
    secondary: Object.freeze(previousSecondary),
    changed: false,
  });
}

function dedupeGoals(
  goals: readonly ExecutiveGoalContext[],
): readonly ExecutiveGoalContext[] {
  const seen = new Set<string>();
  const next: ExecutiveGoalContext[] = [];
  for (const goal of goals) {
    const key = goal.goalId ?? goal.title.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    next.push(goal);
  }
  return Object.freeze(next);
}
