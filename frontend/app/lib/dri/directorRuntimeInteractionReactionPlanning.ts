/**
 * DRI-4:5 — Director Runtime Interaction Reaction Planning.
 *
 * Converts a completed DRI-4:4 focus/selection transition into a deterministic,
 * immutable, execution-neutral Director Reaction Plan.
 *
 * Intent ≠ Focus/Selection Transition ≠ Reaction Plan ≠ Execution.
 * Semantic reaction directives only — no scene mutation, DRI-3 calls,
 * UI/renderer bindings, animation mechanics, or Advisor content generation.
 */

import {
  DIRECTOR_RUNTIME_FOCUS_SELECTION_TRANSITION_KINDS,
  areDirectorRuntimeInteractionTargetsEqual,
  cloneDirectorRuntimeInteractionTarget,
  directorRuntimeFocusSelectionOrchestrationIdentity,
  isDirectorRuntimeFocusSelectionTransition,
  type DirectorInteractionTarget,
  type DirectorRuntimeFocusSelectionTransition,
  type DirectorRuntimeFocusSelectionTransitionKind,
  type DirectorRuntimeInteractionIntentKind,
} from "@/app/lib/dri/directorRuntimeFocusSelectionOrchestration";

export type {
  DirectorInteractionTarget,
  DirectorRuntimeFocusSelectionTransition,
  DirectorRuntimeFocusSelectionTransitionKind,
  DirectorRuntimeInteractionIntentKind,
} from "@/app/lib/dri/directorRuntimeFocusSelectionOrchestration";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeInteractionReactionPlanningIdentity =
  "DRI-4:5/DirectorRuntimeInteractionReactionPlanning" as const;
export const directorRuntimeInteractionReactionPlanningVersion = "4.5.0" as const;
export const directorRuntimeInteractionReactionPlanningNamespace =
  "nexora.dri.interaction.orchestration.reaction-planning" as const;
export const directorRuntimeInteractionReactionPlanningUpstream =
  directorRuntimeFocusSelectionOrchestrationIdentity;

// ─── Vocabularies ───────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_REACTION_SURFACES = Object.freeze([
  "scene",
  "advisor",
  "insight",
  "live-lens",
  "explorer",
  "timeline",
  "mode",
  "attention",
  "none",
] as const);
export type DirectorRuntimeReactionSurface =
  (typeof DIRECTOR_RUNTIME_REACTION_SURFACES)[number];

export const DIRECTOR_RUNTIME_REACTION_KINDS = Object.freeze([
  "emphasize-target",
  "deemphasize-non-targets",
  "reveal-related",
  "preserve",
  "refresh-context",
  "align-context",
  "clear-context",
  "open-context",
  "close-context",
  "highlight-path",
  "show-related-packs",
  "show-related-metrics",
  "no-op",
] as const);
export type DirectorRuntimeReactionKind =
  (typeof DIRECTOR_RUNTIME_REACTION_KINDS)[number];

export const DIRECTOR_RUNTIME_REACTION_PRIORITIES = Object.freeze([
  "critical",
  "primary",
  "secondary",
  "supporting",
] as const);
export type DirectorRuntimeReactionPriority =
  (typeof DIRECTOR_RUNTIME_REACTION_PRIORITIES)[number];

const REACTION_PRIORITY_RANK = Object.freeze({
  critical: 1,
  primary: 2,
  secondary: 3,
  supporting: 4,
} as const satisfies Record<DirectorRuntimeReactionPriority, number>);

const REACTION_SURFACE_ORDER = Object.freeze([
  "attention",
  "scene",
  "advisor",
  "insight",
  "live-lens",
  "explorer",
  "timeline",
  "mode",
  "none",
] as const satisfies readonly DirectorRuntimeReactionSurface[]);

const REACTION_KIND_ORDER = Object.freeze([
  "emphasize-target",
  "deemphasize-non-targets",
  "reveal-related",
  "highlight-path",
  "refresh-context",
  "align-context",
  "open-context",
  "close-context",
  "clear-context",
  "show-related-packs",
  "show-related-metrics",
  "preserve",
  "no-op",
] as const satisfies readonly DirectorRuntimeReactionKind[]);

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface DirectorRuntimeInteractionReactionDirective {
  readonly surface: DirectorRuntimeReactionSurface;
  readonly kind: DirectorRuntimeReactionKind;
  readonly target: DirectorInteractionTarget | null;
  readonly relatedTargetIds: readonly string[];
  readonly priority: DirectorRuntimeReactionPriority;
  readonly reason: string;
}

export interface CreateDirectorRuntimeReactionDirectiveInput {
  readonly surface: DirectorRuntimeReactionSurface;
  readonly kind: DirectorRuntimeReactionKind;
  readonly target?: DirectorInteractionTarget | null;
  readonly relatedTargetIds?: readonly string[];
  readonly priority?: DirectorRuntimeReactionPriority;
  readonly reason?: string;
}

export interface DirectorRuntimeInteractionReactionPlan {
  readonly planId: string;
  readonly intentId: string;
  readonly requestId: string;
  readonly intentKind: DirectorRuntimeInteractionIntentKind;
  readonly transitionKind: DirectorRuntimeFocusSelectionTransitionKind;
  readonly changed: boolean;
  readonly reactions: readonly DirectorRuntimeInteractionReactionDirective[];
  readonly hasWork: boolean;
}

export interface CreateDirectorRuntimeInteractionReactionPlanInput {
  readonly planId: string;
  readonly intentId: string;
  readonly requestId: string;
  readonly intentKind: DirectorRuntimeInteractionIntentKind;
  readonly transitionKind: DirectorRuntimeFocusSelectionTransitionKind;
  readonly changed: boolean;
  readonly reactions?: readonly DirectorRuntimeInteractionReactionDirective[];
}

export interface DirectorRuntimeInteractionReactionPlanningRule {
  readonly ruleId: string;
  readonly transitionKind: DirectorRuntimeFocusSelectionTransitionKind;
  readonly requiresChange: boolean;
  readonly specificity: number;
  readonly directives: readonly CreateDirectorRuntimeReactionDirectiveInput[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

export function isDirectorRuntimeReactionSurface(
  value: unknown,
): value is DirectorRuntimeReactionSurface {
  return (DIRECTOR_RUNTIME_REACTION_SURFACES as readonly unknown[]).includes(value);
}

export function isDirectorRuntimeReactionKind(
  value: unknown,
): value is DirectorRuntimeReactionKind {
  return (DIRECTOR_RUNTIME_REACTION_KINDS as readonly unknown[]).includes(value);
}

export function isDirectorRuntimeReactionPriority(
  value: unknown,
): value is DirectorRuntimeReactionPriority {
  return (DIRECTOR_RUNTIME_REACTION_PRIORITIES as readonly unknown[]).includes(value);
}

function directiveKey(directive: DirectorRuntimeInteractionReactionDirective): string {
  const targetKey = directive.target == null
    ? "null"
    : `${directive.target.kind}\u0000${directive.target.id}\u0000${directive.target.parentId ?? ""}\u0000${directive.target.scope ?? ""}`;
  return [
    directive.surface,
    directive.kind,
    targetKey,
    directive.relatedTargetIds.join("\u0001"),
    directive.priority,
  ].join("\u0000");
}

function surfaceRank(surface: DirectorRuntimeReactionSurface): number {
  const index = REACTION_SURFACE_ORDER.indexOf(surface);
  return index < 0 ? Number.MAX_SAFE_INTEGER : index;
}

function kindRank(kind: DirectorRuntimeReactionKind): number {
  const index = REACTION_KIND_ORDER.indexOf(kind);
  return index < 0 ? Number.MAX_SAFE_INTEGER : index;
}

function compareDirectives(
  left: DirectorRuntimeInteractionReactionDirective,
  right: DirectorRuntimeInteractionReactionDirective,
): number {
  return (REACTION_PRIORITY_RANK[left.priority] - REACTION_PRIORITY_RANK[right.priority]) ||
    (surfaceRank(left.surface) - surfaceRank(right.surface)) ||
    (kindRank(left.kind) - kindRank(right.kind)) ||
    ((left.target?.id ?? "").localeCompare(right.target?.id ?? ""));
}

export function createDirectorRuntimeReactionDirective(
  input: CreateDirectorRuntimeReactionDirectiveInput,
): DirectorRuntimeInteractionReactionDirective {
  if (!isDirectorRuntimeReactionSurface(input.surface)) {
    throw new TypeError("surface must be a known Director reaction surface");
  }
  if (!isDirectorRuntimeReactionKind(input.kind)) {
    throw new TypeError("kind must be a known Director reaction kind");
  }
  const priority = input.priority ?? "secondary";
  if (!isDirectorRuntimeReactionPriority(priority)) {
    throw new TypeError("priority must be a known Director reaction priority");
  }
  const target = input.target === undefined || input.target === null
    ? null
    : cloneDirectorRuntimeInteractionTarget(input.target);
  const relatedTargetIds = Object.freeze(
    (input.relatedTargetIds ?? []).map((id) => {
      if (!isNonEmptyString(id)) {
        throw new TypeError("relatedTargetIds must contain non-empty opaque identifiers");
      }
      return id;
    }),
  );
  return Object.freeze({
    surface: input.surface,
    kind: input.kind,
    target,
    relatedTargetIds,
    priority,
    reason: input.reason ?? `${input.surface}:${input.kind}`,
  });
}

function dedupeDirectives(
  directives: readonly DirectorRuntimeInteractionReactionDirective[],
): readonly DirectorRuntimeInteractionReactionDirective[] {
  const seen = new Set<string>();
  const unique: DirectorRuntimeInteractionReactionDirective[] = [];
  for (const directive of directives) {
    const key = directiveKey(directive);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(directive);
  }
  return Object.freeze(unique);
}

function orderDirectives(
  directives: readonly DirectorRuntimeInteractionReactionDirective[],
): readonly DirectorRuntimeInteractionReactionDirective[] {
  return Object.freeze(
    [...directives].sort((left, right) => compareDirectives(left, right)),
  );
}

/** Incompatible pairs at equal priority on the same surface+target. */
const INCOMPATIBLE_REACTION_PAIRS = Object.freeze([
  Object.freeze(["emphasize-target", "clear-context"] as const),
  Object.freeze(["emphasize-target", "deemphasize-non-targets"] as const),
  Object.freeze(["open-context", "close-context"] as const),
  Object.freeze(["refresh-context", "clear-context"] as const),
] as const);

export function findDirectorRuntimeReactionDirectiveConflicts(
  directives: readonly DirectorRuntimeInteractionReactionDirective[],
): readonly string[] {
  const conflicts: string[] = [];
  for (const [index, left] of directives.entries()) {
    for (const right of directives.slice(index + 1)) {
      if (left.surface !== right.surface) continue;
      if (left.priority !== right.priority) continue;
      if (!areDirectorRuntimeInteractionTargetsEqual(left.target, right.target)) continue;
      const pair = [left.kind, right.kind].sort().join("|");
      const incompatible = INCOMPATIBLE_REACTION_PAIRS.some((candidate) => {
        const key = [...candidate].sort().join("|");
        return key === pair;
      });
      if (incompatible) {
        conflicts.push(`${left.surface}:${left.kind}|${right.kind}`);
      }
    }
  }
  return Object.freeze(conflicts);
}

export function createDirectorRuntimeInteractionReactionPlan(
  input: CreateDirectorRuntimeInteractionReactionPlanInput,
): DirectorRuntimeInteractionReactionPlan {
  if (!isNonEmptyString(input.planId)) {
    throw new TypeError("planId must be a non-empty opaque identifier");
  }
  if (!isNonEmptyString(input.intentId)) {
    throw new TypeError("intentId must be a non-empty opaque identifier");
  }
  if (!isNonEmptyString(input.requestId)) {
    throw new TypeError("requestId must be a non-empty opaque identifier");
  }
  if (!(DIRECTOR_RUNTIME_FOCUS_SELECTION_TRANSITION_KINDS as readonly string[])
    .includes(input.transitionKind)) {
    throw new TypeError("transitionKind must be a known focus/selection transition kind");
  }
  const reactions = orderDirectives(
    dedupeDirectives((input.reactions ?? []).map(createDirectorRuntimeReactionDirective)),
  );
  const conflicts = findDirectorRuntimeReactionDirectiveConflicts(reactions);
  if (conflicts.length > 0) {
    throw new TypeError(`incompatible reaction directives: ${conflicts.join(",")}`);
  }
  const hasWork = reactions.some((reaction) => reaction.kind !== "no-op" &&
    reaction.kind !== "preserve");
  return Object.freeze({
    planId: input.planId,
    intentId: input.intentId,
    requestId: input.requestId,
    intentKind: input.intentKind,
    transitionKind: input.transitionKind,
    changed: input.changed,
    reactions,
    hasWork,
  });
}

function directive(
  surface: DirectorRuntimeReactionSurface,
  kind: DirectorRuntimeReactionKind,
  priority: DirectorRuntimeReactionPriority,
  reason: string,
): CreateDirectorRuntimeReactionDirectiveInput {
  return Object.freeze({ surface, kind, priority, reason });
}

function planningRule(
  ruleId: string,
  transitionKind: DirectorRuntimeFocusSelectionTransitionKind,
  requiresChange: boolean,
  specificity: number,
  directives: readonly CreateDirectorRuntimeReactionDirectiveInput[],
): DirectorRuntimeInteractionReactionPlanningRule {
  return Object.freeze({
    ruleId,
    transitionKind,
    requiresChange,
    specificity,
    directives: Object.freeze([...directives]),
  });
}

/**
 * Canonical transition → reaction mapping.
 * Precedence: higher specificity wins; requiresChange rules beat preserve/no-op
 * when transition.changed matches.
 *
 * Canonical order within a plan:
 * attention → scene → advisor/insight/live-lens → explorer/timeline/mode
 * at priority critical → primary → secondary → supporting.
 */
export const DIRECTOR_RUNTIME_INTERACTION_REACTION_PLANNING_RULES = Object.freeze([
  planningRule("select-and-focus-changed", "select-and-focus", true, 3, [
    directive("attention", "emphasize-target", "critical", "combined-focus-attention"),
    directive("scene", "deemphasize-non-targets", "primary", "combined-scene-context"),
    directive("scene", "reveal-related", "primary", "combined-reveal-related"),
    directive("attention", "highlight-path", "primary", "combined-path-attention"),
    directive("advisor", "refresh-context", "secondary", "combined-advisor-refresh"),
    directive("insight", "refresh-context", "secondary", "combined-insight-refresh"),
    directive("insight", "show-related-metrics", "supporting", "combined-insight-metrics"),
    directive("live-lens", "align-context", "secondary", "combined-live-lens-align"),
    directive("explorer", "refresh-context", "supporting", "combined-explorer-refresh"),
    directive("explorer", "show-related-packs", "supporting", "combined-explorer-packs"),
  ]),
  planningRule("focus-changed", "focus", true, 2, [
    directive("attention", "emphasize-target", "critical", "focus-attention"),
    directive("scene", "deemphasize-non-targets", "primary", "focus-scene-context"),
    directive("scene", "reveal-related", "primary", "focus-reveal-related"),
    directive("attention", "highlight-path", "primary", "focus-path-attention"),
    directive("advisor", "refresh-context", "secondary", "focus-advisor-refresh"),
    directive("insight", "refresh-context", "secondary", "focus-insight-refresh"),
    directive("live-lens", "align-context", "secondary", "focus-live-lens-align"),
    directive("explorer", "refresh-context", "supporting", "focus-explorer-refresh"),
  ]),
  planningRule("select-changed", "select", true, 2, [
    directive("advisor", "refresh-context", "secondary", "selection-advisor-refresh"),
    directive("insight", "show-related-metrics", "secondary", "selection-insight-metrics"),
    directive("explorer", "refresh-context", "supporting", "selection-explorer-refresh"),
    directive("explorer", "show-related-packs", "supporting", "selection-explorer-packs"),
    directive("attention", "preserve", "supporting", "selection-preserve-focus-attention"),
  ]),
  planningRule("clear-focus-changed", "clear-focus", true, 2, [
    directive("attention", "clear-context", "critical", "clear-focus-attention"),
    directive("scene", "clear-context", "primary", "clear-focus-scene"),
    directive("advisor", "clear-context", "secondary", "clear-focus-advisor"),
    directive("insight", "preserve", "supporting", "clear-focus-insight-preserve"),
    directive("live-lens", "align-context", "secondary", "clear-focus-live-lens"),
  ]),
  planningRule("clear-selection-changed", "clear-selection", true, 2, [
    directive("explorer", "clear-context", "secondary", "clear-selection-explorer"),
    directive("advisor", "refresh-context", "supporting", "clear-selection-advisor"),
    directive("attention", "preserve", "supporting", "clear-selection-preserve-focus"),
  ]),
  planningRule("clear-all-changed", "clear-all", true, 2, [
    directive("attention", "clear-context", "critical", "clear-all-attention"),
    directive("scene", "clear-context", "primary", "clear-all-scene"),
    directive("advisor", "clear-context", "secondary", "clear-all-advisor"),
    directive("insight", "clear-context", "secondary", "clear-all-insight"),
    directive("live-lens", "clear-context", "secondary", "clear-all-live-lens"),
    directive("explorer", "clear-context", "supporting", "clear-all-explorer"),
  ]),
  planningRule("preserve-unchanged", "preserve", false, 1, [
    directive("none", "no-op", "supporting", "preserve-no-op"),
  ]),
  planningRule("select-unchanged", "select", false, 1, [
    directive("none", "no-op", "supporting", "select-idempotent-no-op"),
  ]),
  planningRule("focus-unchanged", "focus", false, 1, [
    directive("none", "no-op", "supporting", "focus-idempotent-no-op"),
  ]),
  planningRule("select-and-focus-unchanged", "select-and-focus", false, 1, [
    directive("none", "no-op", "supporting", "select-and-focus-idempotent-no-op"),
  ]),
  planningRule("clear-focus-unchanged", "clear-focus", false, 1, [
    directive("none", "no-op", "supporting", "clear-focus-idempotent-no-op"),
  ]),
  planningRule("clear-selection-unchanged", "clear-selection", false, 1, [
    directive("none", "no-op", "supporting", "clear-selection-idempotent-no-op"),
  ]),
  planningRule("clear-all-unchanged", "clear-all", false, 1, [
    directive("none", "no-op", "supporting", "clear-all-idempotent-no-op"),
  ]),
] as const);

function matchPlanningRule(
  transition: DirectorRuntimeFocusSelectionTransition,
): DirectorRuntimeInteractionReactionPlanningRule {
  const matches = DIRECTOR_RUNTIME_INTERACTION_REACTION_PLANNING_RULES.filter((rule) =>
    rule.transitionKind === transition.transitionKind &&
    rule.requiresChange === transition.changed);
  if (matches.length === 0) {
    return planningRule("fallback-no-op", transition.transitionKind, transition.changed, 0, [
      directive("none", "no-op", "supporting", "fallback-no-op"),
    ]);
  }
  const maxSpecificity = matches.reduce(
    (highest, rule) => rule.specificity > highest ? rule.specificity : highest,
    -1,
  );
  const winners = matches.filter((rule) => rule.specificity === maxSpecificity);
  if (winners.length > 1) {
    const ids = winners.map((rule) => rule.ruleId).join("|");
    throw new TypeError(`ambiguous reaction planning rules: ${ids}`);
  }
  return winners[0]!;
}

export function planDirectorRuntimeInteractionReaction(
  transition: DirectorRuntimeFocusSelectionTransition,
): DirectorRuntimeInteractionReactionPlan {
  if (!isDirectorRuntimeFocusSelectionTransition(transition)) {
    throw new TypeError("reaction planning requires a DRI-4:4 focus/selection transition");
  }

  const rule = matchPlanningRule(transition);
  const target = cloneDirectorRuntimeInteractionTarget(transition.target);
  const reactions = rule.directives.map((template) =>
    createDirectorRuntimeReactionDirective({
      ...template,
      target: template.kind === "no-op" ? null : target,
      relatedTargetIds: [],
    }));

  return createDirectorRuntimeInteractionReactionPlan({
    planId: `${transition.intentId}:reaction-plan`,
    intentId: transition.intentId,
    requestId: transition.requestId,
    intentKind: transition.intentKind,
    transitionKind: transition.transitionKind,
    changed: transition.changed,
    reactions,
  });
}

export function hasDirectorRuntimeReactionWork(
  plan: DirectorRuntimeInteractionReactionPlan,
): boolean {
  return plan.hasWork;
}

export function isDirectorRuntimeReactionDirective(
  value: unknown,
): value is DirectorRuntimeInteractionReactionDirective {
  if (!isPlainObject(value)) return false;
  return isDirectorRuntimeReactionSurface(value.surface) &&
    isDirectorRuntimeReactionKind(value.kind) &&
    isDirectorRuntimeReactionPriority(value.priority) &&
    Array.isArray(value.relatedTargetIds) &&
    isNonEmptyString(value.reason) &&
    (value.target === null || isPlainObject(value.target));
}

export function isDirectorRuntimeInteractionReactionPlan(
  value: unknown,
): value is DirectorRuntimeInteractionReactionPlan {
  if (!isPlainObject(value)) return false;
  return isNonEmptyString(value.planId) &&
    isNonEmptyString(value.intentId) &&
    isNonEmptyString(value.requestId) &&
    typeof value.changed === "boolean" &&
    typeof value.hasWork === "boolean" &&
    Array.isArray(value.reactions) &&
    value.reactions.every((reaction) => isDirectorRuntimeReactionDirective(reaction)) &&
    (DIRECTOR_RUNTIME_FOCUS_SELECTION_TRANSITION_KINDS as readonly unknown[])
      .includes(value.transitionKind);
}

export function findDirectorRuntimeInteractionReactionPlanningRuleConflicts(
  rules: readonly DirectorRuntimeInteractionReactionPlanningRule[] =
    DIRECTOR_RUNTIME_INTERACTION_REACTION_PLANNING_RULES,
): readonly string[] {
  const conflicts = rules.flatMap((left, index) =>
    rules.slice(index + 1).flatMap((right) => {
      if (left.transitionKind !== right.transitionKind) return [];
      if (left.requiresChange !== right.requiresChange) return [];
      if (left.specificity !== right.specificity) return [];
      return [`${left.ruleId}|${right.ruleId}`];
    }));
  return Object.freeze(conflicts);
}

// ─── Registry ───────────────────────────────────────────────────────────────

export const directorRuntimeInteractionReactionPlanningTypeNames = Object.freeze([
  "DirectorRuntimeInteractionReactionDirective",
  "DirectorRuntimeInteractionReactionPlan",
  "DirectorRuntimeInteractionReactionPlanningRule",
] as const);

export const directorRuntimeInteractionReactionPlanningApiNames = Object.freeze([
  "isDirectorRuntimeReactionSurface",
  "isDirectorRuntimeReactionKind",
  "isDirectorRuntimeReactionPriority",
  "createDirectorRuntimeReactionDirective",
  "createDirectorRuntimeInteractionReactionPlan",
  "findDirectorRuntimeReactionDirectiveConflicts",
  "planDirectorRuntimeInteractionReaction",
  "hasDirectorRuntimeReactionWork",
  "isDirectorRuntimeReactionDirective",
  "isDirectorRuntimeInteractionReactionPlan",
  "findDirectorRuntimeInteractionReactionPlanningRuleConflicts",
  "verifyDirectorRuntimeInteractionReactionPlanning",
] as const);

export const directorRuntimeInteractionReactionPlanningRegistry = Object.freeze({
  reactionSurfaces: DIRECTOR_RUNTIME_REACTION_SURFACES,
  reactionSurfaceCount: DIRECTOR_RUNTIME_REACTION_SURFACES.length,
  reactionKinds: DIRECTOR_RUNTIME_REACTION_KINDS,
  reactionKindCount: DIRECTOR_RUNTIME_REACTION_KINDS.length,
  priorities: DIRECTOR_RUNTIME_REACTION_PRIORITIES,
  priorityCount: DIRECTOR_RUNTIME_REACTION_PRIORITIES.length,
  planningRules: DIRECTOR_RUNTIME_INTERACTION_REACTION_PLANNING_RULES,
  planningRuleCount: DIRECTOR_RUNTIME_INTERACTION_REACTION_PLANNING_RULES.length,
  directiveContracts: Object.freeze([
    "DirectorRuntimeInteractionReactionDirective",
  ] as const),
  directiveContractCount: 1,
  planContracts: Object.freeze([
    "DirectorRuntimeInteractionReactionPlan",
  ] as const),
  planContractCount: 1,
  publicTypes: directorRuntimeInteractionReactionPlanningTypeNames,
  publicTypeCount: directorRuntimeInteractionReactionPlanningTypeNames.length,
  publicApis: directorRuntimeInteractionReactionPlanningApiNames,
  publicApiCount: directorRuntimeInteractionReactionPlanningApiNames.length,
  immediateDependency: directorRuntimeInteractionReactionPlanningUpstream,
  ordering:
    "priority-asc:critical>primary>secondary>supporting;surface:attention>scene>contextual>supporting" as const,
});

export const directorRuntimeInteractionReactionPlanning = Object.freeze({
  phase: "DRI-4:5" as const,
  name: "DirectorRuntimeInteractionReactionPlanning" as const,
  identity: directorRuntimeInteractionReactionPlanningIdentity,
  namespace: directorRuntimeInteractionReactionPlanningNamespace,
  version: directorRuntimeInteractionReactionPlanningVersion,
  layer: "DirectorRuntimeInteractionOrchestration" as const,
  stage: "ReactionPlanning" as const,
  status: "ReactionPlanningReady" as const,
  immediateDependency: directorRuntimeInteractionReactionPlanningUpstream,
  philosophy: "reaction-plan-is-not-execution" as const,
  reactionSurfaces: DIRECTOR_RUNTIME_REACTION_SURFACES,
  reactionKinds: DIRECTOR_RUNTIME_REACTION_KINDS,
  priorities: DIRECTOR_RUNTIME_REACTION_PRIORITIES,
  planningRules: DIRECTOR_RUNTIME_INTERACTION_REACTION_PLANNING_RULES,
  publicApiSurface: directorRuntimeInteractionReactionPlanningApiNames,
  registry: directorRuntimeInteractionReactionPlanningRegistry,
});

export function verifyDirectorRuntimeInteractionReactionPlanning(): boolean {
  const surface = directorRuntimeInteractionReactionPlanning;
  const registry = directorRuntimeInteractionReactionPlanningRegistry;
  const covered = new Set(
    DIRECTOR_RUNTIME_INTERACTION_REACTION_PLANNING_RULES.map((rule) =>
      `${rule.transitionKind}:${rule.requiresChange ? "changed" : "unchanged"}`),
  );
  const conflicts = findDirectorRuntimeInteractionReactionPlanningRuleConflicts();
  const transitionCoverage = DIRECTOR_RUNTIME_FOCUS_SELECTION_TRANSITION_KINDS.every((kind) =>
    covered.has(`${kind}:changed`) || covered.has(`${kind}:unchanged`) ||
    kind === "preserve");
  return (
    surface.identity === "DRI-4:5/DirectorRuntimeInteractionReactionPlanning" &&
    surface.version === "4.5.0" &&
    surface.namespace === "nexora.dri.interaction.orchestration.reaction-planning" &&
    surface.layer === "DirectorRuntimeInteractionOrchestration" &&
    surface.stage === "ReactionPlanning" &&
    surface.immediateDependency ===
      "DRI-4:4/DirectorRuntimeFocusSelectionOrchestration" &&
    surface.immediateDependency === directorRuntimeFocusSelectionOrchestrationIdentity &&
    registry.reactionSurfaceCount === DIRECTOR_RUNTIME_REACTION_SURFACES.length &&
    registry.reactionKindCount === DIRECTOR_RUNTIME_REACTION_KINDS.length &&
    registry.priorityCount === DIRECTOR_RUNTIME_REACTION_PRIORITIES.length &&
    registry.planningRuleCount ===
      DIRECTOR_RUNTIME_INTERACTION_REACTION_PLANNING_RULES.length &&
    registry.publicApiCount === directorRuntimeInteractionReactionPlanningApiNames.length &&
    conflicts.length === 0 &&
    transitionCoverage &&
    covered.has("preserve:unchanged") &&
    Object.isFrozen(surface) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(DIRECTOR_RUNTIME_INTERACTION_REACTION_PLANNING_RULES) &&
    new Set(DIRECTOR_RUNTIME_REACTION_SURFACES).size ===
      DIRECTOR_RUNTIME_REACTION_SURFACES.length &&
    new Set(DIRECTOR_RUNTIME_REACTION_KINDS).size === DIRECTOR_RUNTIME_REACTION_KINDS.length
  );
}


// ─── Pipeline surface (re-exported for linear DRI-4 chain composition) ───────

export {
  evaluateDirectorRuntimeInteractionContract,
  createDirectorRuntimeInteractionContext,
  createDirectorRuntimeInteractionRequest,
  isAcceptedDirectorRuntimeInteractionContract,
  isRejectedDirectorRuntimeInteractionContract,
  resolveDirectorRuntimeInteractionIntent,
  isResolvedDirectorRuntimeInteractionIntent,
  isUnresolvedDirectorRuntimeInteractionIntent,
  createDirectorRuntimeFocusSelectionState,
  createEmptyDirectorRuntimeFocusSelectionState,
  orchestrateDirectorRuntimeFocusSelection,
  isDirectorRuntimeFocusSelectionState,
  isDirectorRuntimeFocusSelectionTransition,
} from "@/app/lib/dri/directorRuntimeFocusSelectionOrchestration";

export type {
  DirectorRuntimeInteractionContext,
  CreateDirectorRuntimeInteractionContextInput,
  DirectorRuntimeInteractionContractResult,
  AcceptedDirectorRuntimeInteractionContract,
  RejectedDirectorRuntimeInteractionContract,
  CreateDirectorRuntimeInteractionRequestInput,
  DirectorRuntimeInteractionRequest,
  DirectorInteractionObservation,
  DirectorRuntimeInteractionIntent,
  DirectorRuntimeInteractionIntentResolutionResult,
  ResolvedDirectorRuntimeInteractionIntent,
  UnresolvedDirectorRuntimeInteractionIntent,
  DirectorRuntimeFocusSelectionState,
  CreateDirectorRuntimeFocusSelectionStateInput,
} from "@/app/lib/dri/directorRuntimeFocusSelectionOrchestration";
