/**
 * DRI-4:3 — Director Runtime Interaction Intent Resolution.
 *
 * Converts an accepted DRI-4:2 interaction contract into a canonical
 * Director Runtime Interaction Intent.
 *
 * Interaction ≠ Intent ≠ Reaction.
 * Semantic meaning only — no focus/selection mutation, reaction planning,
 * scene mutation, or execution.
 */

import {
  directorRuntimeInteractionContractsIdentity,
  isAcceptedDirectorRuntimeInteractionContract,
  type AcceptedDirectorRuntimeInteractionContract,
  type DirectorInteractionScope,
  type DirectorInteractionSource,
  type DirectorInteractionTarget,
  type DirectorInteractionTargetKind,
  type DirectorRuntimeInteractionContractResult,
  type DirectorInteractionKind,
} from "@/app/lib/dri/directorRuntimeInteractionContracts";

export type {
  DirectorInteractionKind,
  DirectorInteractionScope,
  DirectorInteractionSource,
  DirectorInteractionTarget,
  DirectorInteractionTargetKind,
} from "@/app/lib/dri/directorRuntimeInteractionContracts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeInteractionIntentResolutionIdentity =
  "DRI-4:3/DirectorRuntimeInteractionIntentResolution" as const;
export const directorRuntimeInteractionIntentResolutionVersion = "4.3.0" as const;
export const directorRuntimeInteractionIntentResolutionNamespace =
  "nexora.dri.interaction.orchestration.intent-resolution" as const;
export const directorRuntimeInteractionIntentResolutionUpstream =
  directorRuntimeInteractionContractsIdentity;

// ─── Intent vocabulary ──────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_INTERACTION_INTENT_KINDS = Object.freeze([
  "select-target",
  "focus-target",
  "activate-target",
  "inspect-target",
  "open-target",
  "close-target",
  "navigate-back",
  "navigate-to",
  "expand-target",
  "collapse-target",
  "invoke-target",
  "preview-target",
  "clear-focus",
  "no-op",
] as const);
export type DirectorRuntimeInteractionIntentKind =
  (typeof DIRECTOR_RUNTIME_INTERACTION_INTENT_KINDS)[number];

export const DIRECTOR_RUNTIME_INTERACTION_INTENT_CATEGORIES = Object.freeze([
  "selection",
  "focus",
  "navigation",
  "inspection",
  "activation",
  "visibility",
  "invocation",
  "neutral",
] as const);
export type DirectorRuntimeInteractionIntentCategory =
  (typeof DIRECTOR_RUNTIME_INTERACTION_INTENT_CATEGORIES)[number];

export const DIRECTOR_RUNTIME_INTERACTION_INTENT_RESOLUTION_DISPOSITIONS = Object.freeze([
  "resolved",
  "unresolved",
] as const);
export type DirectorRuntimeInteractionIntentResolutionDisposition =
  (typeof DIRECTOR_RUNTIME_INTERACTION_INTENT_RESOLUTION_DISPOSITIONS)[number];

export const DIRECTOR_RUNTIME_INTERACTION_INTENT_UNRESOLVED_REASONS = Object.freeze([
  "unsupported-combination",
  "ambiguous-semantic-mapping",
  "missing-required-context",
] as const);
export type DirectorRuntimeInteractionIntentUnresolvedReason =
  (typeof DIRECTOR_RUNTIME_INTERACTION_INTENT_UNRESOLVED_REASONS)[number];

// ─── Intent contracts ───────────────────────────────────────────────────────

export interface DirectorRuntimeInteractionIntent {
  readonly intentId: string;
  readonly kind: DirectorRuntimeInteractionIntentKind;
  readonly category: DirectorRuntimeInteractionIntentCategory;
  readonly target: DirectorInteractionTarget;
  readonly source: DirectorInteractionSource;
  readonly scope: DirectorInteractionScope;
  readonly requestId: string;
  readonly interactionKind: DirectorInteractionKind;
  readonly contextRef?: string;
}

export interface ResolvedDirectorRuntimeInteractionIntent {
  readonly disposition: "resolved";
  readonly intent: DirectorRuntimeInteractionIntent;
  readonly matchedRuleId: string;
  readonly specificity: number;
}

export interface UnresolvedDirectorRuntimeInteractionIntent {
  readonly disposition: "unresolved";
  readonly reason: DirectorRuntimeInteractionIntentUnresolvedReason;
  readonly requestId: string | null;
  readonly matchedRuleIds: readonly string[];
}

export type DirectorRuntimeInteractionIntentResolutionResult =
  | ResolvedDirectorRuntimeInteractionIntent
  | UnresolvedDirectorRuntimeInteractionIntent;

export interface DirectorRuntimeInteractionIntentResolutionContextCondition {
  readonly workspaceId?: string;
  readonly modeId?: string;
  readonly lensId?: string;
}

export interface DirectorRuntimeInteractionIntentResolutionRule {
  readonly ruleId: string;
  readonly interactionKind?: DirectorInteractionKind;
  readonly source?: DirectorInteractionSource;
  readonly targetKind?: DirectorInteractionTargetKind;
  readonly context?: DirectorRuntimeInteractionIntentResolutionContextCondition;
  readonly intentKind: DirectorRuntimeInteractionIntentKind;
  readonly category: DirectorRuntimeInteractionIntentCategory;
}

// ─── Category map ───────────────────────────────────────────────────────────

const INTENT_CATEGORY_BY_KIND = Object.freeze({
  "select-target": "selection",
  "focus-target": "focus",
  "activate-target": "activation",
  "inspect-target": "inspection",
  "open-target": "visibility",
  "close-target": "visibility",
  "navigate-back": "navigation",
  "navigate-to": "navigation",
  "expand-target": "visibility",
  "collapse-target": "visibility",
  "invoke-target": "invocation",
  "preview-target": "inspection",
  "clear-focus": "focus",
  "no-op": "neutral",
} as const satisfies Record<
  DirectorRuntimeInteractionIntentKind,
  DirectorRuntimeInteractionIntentCategory
>);

function rule(
  ruleId: string,
  intentKind: DirectorRuntimeInteractionIntentKind,
  match: {
    readonly interactionKind?: DirectorInteractionKind;
    readonly source?: DirectorInteractionSource;
    readonly targetKind?: DirectorInteractionTargetKind;
    readonly context?: DirectorRuntimeInteractionIntentResolutionContextCondition;
  } = {},
): DirectorRuntimeInteractionIntentResolutionRule {
  return Object.freeze({
    ruleId,
    ...(match.interactionKind === undefined ? {} : { interactionKind: match.interactionKind }),
    ...(match.source === undefined ? {} : { source: match.source }),
    ...(match.targetKind === undefined ? {} : { targetKind: match.targetKind }),
    ...(match.context === undefined ? {} : { context: Object.freeze({ ...match.context }) }),
    intentKind,
    category: INTENT_CATEGORY_BY_KIND[intentKind],
  });
}

/**
 * Canonical resolution rules in registry order.
 * Precedence: higher specificity wins
 * (kind + source + target + context > kind + target > kind + source > kind > fallback).
 * Equal-specificity conflicts with different intent kinds are unresolved.
 */
export const DIRECTOR_RUNTIME_INTERACTION_INTENT_RESOLUTION_RULES = Object.freeze([
  // Specificity 4 — kind + source + target + context
  rule("select-object-goal-workspace-objects-lens", "select-target", {
    interactionKind: "select", source: "object", targetKind: "object",
    context: { workspaceId: "goal", lensId: "objects" },
  }),
  // Specificity 3 — kind + source + target
  rule("activate-timeline-timeline-entry", "navigate-to", {
    interactionKind: "activate", source: "timeline", targetKind: "timeline-entry",
  }),
  rule("activate-live-lens-lens", "navigate-to", {
    interactionKind: "activate", source: "live-lens", targetKind: "lens",
  }),
  rule("activate-timeline-pack", "open-target", {
    interactionKind: "activate", source: "timeline", targetKind: "pack",
  }),
  rule("activate-live-lens-pack", "open-target", {
    interactionKind: "activate", source: "live-lens", targetKind: "pack",
  }),
  rule("select-mode-selector-mode", "activate-target", {
    interactionKind: "select", source: "mode-selector", targetKind: "mode",
  }),
  rule("hover-system-none", "no-op", {
    interactionKind: "hover", source: "system", targetKind: "none",
  }),
  // Specificity 2 — kind + target
  rule("select-mode", "activate-target", {
    interactionKind: "select", targetKind: "mode",
  }),
  rule("select-lens", "activate-target", {
    interactionKind: "select", targetKind: "lens",
  }),
  rule("select-control", "invoke-target", {
    interactionKind: "select", targetKind: "control",
  }),
  rule("select-pack", "open-target", {
    interactionKind: "select", targetKind: "pack",
  }),
  rule("select-goal", "open-target", {
    interactionKind: "select", targetKind: "goal",
  }),
  rule("select-timeline-entry", "inspect-target", {
    interactionKind: "select", targetKind: "timeline-entry",
  }),
  rule("activate-pack", "open-target", {
    interactionKind: "activate", targetKind: "pack",
  }),
  rule("activate-timeline-entry", "navigate-to", {
    interactionKind: "activate", targetKind: "timeline-entry",
  }),
  rule("close-none", "clear-focus", {
    interactionKind: "close", targetKind: "none",
  }),
  // Specificity 2 — kind + source
  rule("activate-timeline", "navigate-to", {
    interactionKind: "activate", source: "timeline",
  }),
  rule("activate-live-lens", "navigate-to", {
    interactionKind: "activate", source: "live-lens",
  }),
  rule("inspect-advisor", "inspect-target", {
    interactionKind: "inspect", source: "advisor",
  }),
  rule("inspect-insight", "inspect-target", {
    interactionKind: "inspect", source: "insight",
  }),
  // Specificity 1 — kind defaults
  rule("kind-select", "select-target", { interactionKind: "select" }),
  rule("kind-focus", "focus-target", { interactionKind: "focus" }),
  rule("kind-activate", "activate-target", { interactionKind: "activate" }),
  rule("kind-inspect", "inspect-target", { interactionKind: "inspect" }),
  rule("kind-open", "open-target", { interactionKind: "open" }),
  rule("kind-close", "close-target", { interactionKind: "close" }),
  rule("kind-back", "navigate-back", { interactionKind: "back" }),
  rule("kind-navigate", "navigate-to", { interactionKind: "navigate" }),
  rule("kind-expand", "expand-target", { interactionKind: "expand" }),
  rule("kind-collapse", "collapse-target", { interactionKind: "collapse" }),
  rule("kind-invoke", "invoke-target", { interactionKind: "invoke" }),
  rule("kind-hover", "preview-target", { interactionKind: "hover" }),
] as const);

// ─── Helpers ────────────────────────────────────────────────────────────────

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

export function isDirectorRuntimeInteractionIntentKind(
  value: unknown,
): value is DirectorRuntimeInteractionIntentKind {
  return (DIRECTOR_RUNTIME_INTERACTION_INTENT_KINDS as readonly unknown[]).includes(value);
}

export function isDirectorRuntimeInteractionIntentCategory(
  value: unknown,
): value is DirectorRuntimeInteractionIntentCategory {
  return (DIRECTOR_RUNTIME_INTERACTION_INTENT_CATEGORIES as readonly unknown[]).includes(value);
}

function cloneTarget(target: DirectorInteractionTarget): DirectorInteractionTarget {
  return Object.freeze({
    kind: target.kind,
    id: target.id,
    ...(target.parentId === undefined ? {} : { parentId: target.parentId }),
    ...(target.scope === undefined ? {} : { scope: target.scope }),
  });
}

function ruleSpecificity(value: DirectorRuntimeInteractionIntentResolutionRule): number {
  return (value.interactionKind === undefined ? 0 : 1) +
    (value.source === undefined ? 0 : 1) +
    (value.targetKind === undefined ? 0 : 1) +
    (value.context === undefined ? 0 : 1);
}

function contextMatches(
  condition: DirectorRuntimeInteractionIntentResolutionContextCondition | undefined,
  context: AcceptedDirectorRuntimeInteractionContract["request"]["context"],
): boolean {
  if (condition === undefined) return true;
  if (condition.workspaceId !== undefined && context.workspaceId !== condition.workspaceId) {
    return false;
  }
  if (condition.modeId !== undefined && context.modeId !== condition.modeId) return false;
  if (condition.lensId !== undefined && context.lensId !== condition.lensId) return false;
  return true;
}

function ruleMatches(
  value: DirectorRuntimeInteractionIntentResolutionRule,
  accepted: AcceptedDirectorRuntimeInteractionContract,
): boolean {
  const { observation, context } = accepted.request;
  if (value.interactionKind !== undefined && value.interactionKind !== observation.kind) {
    return false;
  }
  if (value.source !== undefined && value.source !== observation.source) return false;
  if (value.targetKind !== undefined && value.targetKind !== observation.target.kind) {
    return false;
  }
  return contextMatches(value.context, context);
}

function unresolved(input: {
  readonly reason: DirectorRuntimeInteractionIntentUnresolvedReason;
  readonly requestId: string | null;
  readonly matchedRuleIds?: readonly string[];
}): UnresolvedDirectorRuntimeInteractionIntent {
  return Object.freeze({
    disposition: "unresolved" as const,
    reason: input.reason,
    requestId: input.requestId,
    matchedRuleIds: Object.freeze([...(input.matchedRuleIds ?? [])]),
  });
}

function createIntent(input: {
  readonly accepted: AcceptedDirectorRuntimeInteractionContract;
  readonly intentKind: DirectorRuntimeInteractionIntentKind;
  readonly category: DirectorRuntimeInteractionIntentCategory;
}): DirectorRuntimeInteractionIntent {
  const { request } = input.accepted;
  const { observation } = request;
  const scope = observation.scope ?? observation.target.scope ?? "local";
  const intentId = `${request.requestId}:intent:${input.intentKind}:${observation.sequence}`;
  return Object.freeze({
    intentId,
    kind: input.intentKind,
    category: input.category,
    target: cloneTarget(observation.target),
    source: observation.source,
    scope,
    requestId: request.requestId,
    interactionKind: observation.kind,
    ...(observation.contextRef === undefined ? {} : { contextRef: observation.contextRef }),
  });
}

export function validateDirectorRuntimeInteractionIntent(
  value: unknown,
): value is DirectorRuntimeInteractionIntent {
  if (!isPlainObject(value)) return false;
  if (!isNonEmptyString(value.intentId)) return false;
  if (!isDirectorRuntimeInteractionIntentKind(value.kind)) return false;
  if (!isDirectorRuntimeInteractionIntentCategory(value.category)) return false;
  if (INTENT_CATEGORY_BY_KIND[value.kind] !== value.category) return false;
  if (!isPlainObject(value.target)) return false;
  const target = value.target as { kind?: unknown; id?: unknown };
  if (typeof target.kind !== "string") return false;
  if (target.kind === "none") {
    if (typeof target.id !== "string") return false;
  } else if (!isNonEmptyString(target.id)) {
    return false;
  }
  if (typeof value.source !== "string" || !isNonEmptyString(value.source)) return false;
  if (typeof value.scope !== "string" || !isNonEmptyString(value.scope)) return false;
  if (!isNonEmptyString(value.requestId)) return false;
  if (typeof value.interactionKind !== "string" || !isNonEmptyString(value.interactionKind)) {
    return false;
  }
  if (value.contextRef !== undefined && !isNonEmptyString(value.contextRef)) return false;
  return true;
}

export function isDirectorRuntimeInteractionIntent(
  value: unknown,
): value is DirectorRuntimeInteractionIntent {
  return validateDirectorRuntimeInteractionIntent(value);
}

export function isResolvedDirectorRuntimeInteractionIntent(
  value: unknown,
): value is ResolvedDirectorRuntimeInteractionIntent {
  if (!isPlainObject(value)) return false;
  return value.disposition === "resolved" &&
    isDirectorRuntimeInteractionIntent(value.intent) &&
    isNonEmptyString(value.matchedRuleId) &&
    typeof value.specificity === "number" && Number.isInteger(value.specificity);
}

export function isUnresolvedDirectorRuntimeInteractionIntent(
  value: unknown,
): value is UnresolvedDirectorRuntimeInteractionIntent {
  if (!isPlainObject(value)) return false;
  return value.disposition === "unresolved" &&
    (DIRECTOR_RUNTIME_INTERACTION_INTENT_UNRESOLVED_REASONS as readonly unknown[])
      .includes(value.reason) &&
    (value.requestId === null || isNonEmptyString(value.requestId)) &&
    Array.isArray(value.matchedRuleIds);
}

function assertAcceptedContract(
  input: DirectorRuntimeInteractionContractResult | AcceptedDirectorRuntimeInteractionContract,
): AcceptedDirectorRuntimeInteractionContract {
  if (!isAcceptedDirectorRuntimeInteractionContract(input)) {
    throw new TypeError(
      "intent resolution requires an accepted DRI-4:2 interaction contract",
    );
  }
  return input;
}

export function resolveDirectorRuntimeInteractionIntent(
  input: DirectorRuntimeInteractionContractResult | AcceptedDirectorRuntimeInteractionContract,
): DirectorRuntimeInteractionIntentResolutionResult {
  const accepted = assertAcceptedContract(input);
  const matches = DIRECTOR_RUNTIME_INTERACTION_INTENT_RESOLUTION_RULES
    .filter((candidate) => ruleMatches(candidate, accepted))
    .map((candidate) => Object.freeze({
      rule: candidate,
      specificity: ruleSpecificity(candidate),
    }));

  if (matches.length === 0) {
    return unresolved({
      reason: "unsupported-combination",
      requestId: accepted.request.requestId,
    });
  }

  const maxSpecificity = matches.reduce(
    (highest, match) => match.specificity > highest ? match.specificity : highest,
    -1,
  );
  const winners = matches.filter((match) => match.specificity === maxSpecificity);
  const intentKinds = new Set(winners.map((match) => match.rule.intentKind));
  if (intentKinds.size > 1) {
    return unresolved({
      reason: "ambiguous-semantic-mapping",
      requestId: accepted.request.requestId,
      matchedRuleIds: winners.map((match) => match.rule.ruleId),
    });
  }

  const winner = winners[0]!;
  // Context-required rules that specify context keys absent from request
  // are already excluded by matching. missing-required-context reserved for
  // explicit future required-context rules; not used by current registry.

  const intent = createIntent({
    accepted,
    intentKind: winner.rule.intentKind,
    category: winner.rule.category,
  });

  return Object.freeze({
    disposition: "resolved" as const,
    intent,
    matchedRuleId: winner.rule.ruleId,
    specificity: winner.specificity,
  });
}

/** Detect equal-specificity conflicting rule pairs for verification. */
export function findDirectorRuntimeInteractionIntentRuleConflicts(
  rules: readonly DirectorRuntimeInteractionIntentResolutionRule[] =
    DIRECTOR_RUNTIME_INTERACTION_INTENT_RESOLUTION_RULES,
): readonly string[] {
  const conflicts = rules.flatMap((left, index) =>
    rules.slice(index + 1).flatMap((right) => {
      if (ruleSpecificity(left) !== ruleSpecificity(right)) return [];
      if (left.intentKind === right.intentKind) return [];
      const sameKind = left.interactionKind === right.interactionKind;
      const sameSource = left.source === right.source;
      const sameTarget = left.targetKind === right.targetKind;
      const sameContext = JSON.stringify(left.context ?? null) ===
        JSON.stringify(right.context ?? null);
      return sameKind && sameSource && sameTarget && sameContext
        ? [`${left.ruleId}|${right.ruleId}`]
        : [];
    }));
  return Object.freeze(conflicts);
}

// ─── Registry ───────────────────────────────────────────────────────────────

export const directorRuntimeInteractionIntentResolutionApiNames = Object.freeze([
  "isDirectorRuntimeInteractionIntentKind",
  "isDirectorRuntimeInteractionIntentCategory",
  "validateDirectorRuntimeInteractionIntent",
  "isDirectorRuntimeInteractionIntent",
  "isResolvedDirectorRuntimeInteractionIntent",
  "isUnresolvedDirectorRuntimeInteractionIntent",
  "resolveDirectorRuntimeInteractionIntent",
  "findDirectorRuntimeInteractionIntentRuleConflicts",
  "verifyDirectorRuntimeInteractionIntentResolution",
] as const);

export const directorRuntimeInteractionIntentResolutionTypeNames = Object.freeze([
  "DirectorRuntimeInteractionIntent",
  "ResolvedDirectorRuntimeInteractionIntent",
  "UnresolvedDirectorRuntimeInteractionIntent",
  "DirectorRuntimeInteractionIntentResolutionResult",
  "DirectorRuntimeInteractionIntentResolutionRule",
] as const);

export const directorRuntimeInteractionIntentResolutionRegistry = Object.freeze({
  intentKinds: DIRECTOR_RUNTIME_INTERACTION_INTENT_KINDS,
  intentKindCount: DIRECTOR_RUNTIME_INTERACTION_INTENT_KINDS.length,
  intentCategories: DIRECTOR_RUNTIME_INTERACTION_INTENT_CATEGORIES,
  intentCategoryCount: DIRECTOR_RUNTIME_INTERACTION_INTENT_CATEGORIES.length,
  resolutionDispositions: DIRECTOR_RUNTIME_INTERACTION_INTENT_RESOLUTION_DISPOSITIONS,
  resolutionDispositionCount:
    DIRECTOR_RUNTIME_INTERACTION_INTENT_RESOLUTION_DISPOSITIONS.length,
  unresolvedReasons: DIRECTOR_RUNTIME_INTERACTION_INTENT_UNRESOLVED_REASONS,
  unresolvedReasonCount: DIRECTOR_RUNTIME_INTERACTION_INTENT_UNRESOLVED_REASONS.length,
  resolutionRules: DIRECTOR_RUNTIME_INTERACTION_INTENT_RESOLUTION_RULES,
  resolutionRuleCount: DIRECTOR_RUNTIME_INTERACTION_INTENT_RESOLUTION_RULES.length,
  publicTypes: directorRuntimeInteractionIntentResolutionTypeNames,
  publicTypeCount: directorRuntimeInteractionIntentResolutionTypeNames.length,
  publicApis: directorRuntimeInteractionIntentResolutionApiNames,
  publicApiCount: directorRuntimeInteractionIntentResolutionApiNames.length,
  immediateDependency: directorRuntimeInteractionIntentResolutionUpstream,
  precedence:
    "specificity-desc:kind+source+target+context>kind+target|kind+source>kind>fallback" as const,
});

export const directorRuntimeInteractionIntentResolution = Object.freeze({
  phase: "DRI-4:3" as const,
  name: "DirectorRuntimeInteractionIntentResolution" as const,
  identity: directorRuntimeInteractionIntentResolutionIdentity,
  namespace: directorRuntimeInteractionIntentResolutionNamespace,
  version: directorRuntimeInteractionIntentResolutionVersion,
  layer: "DirectorRuntimeInteractionOrchestration" as const,
  stage: "IntentResolution" as const,
  status: "IntentResolutionReady" as const,
  immediateDependency: directorRuntimeInteractionIntentResolutionUpstream,
  philosophy: "interaction-is-not-intent-is-not-reaction" as const,
  intentKinds: DIRECTOR_RUNTIME_INTERACTION_INTENT_KINDS,
  intentCategories: DIRECTOR_RUNTIME_INTERACTION_INTENT_CATEGORIES,
  resolutionRules: DIRECTOR_RUNTIME_INTERACTION_INTENT_RESOLUTION_RULES,
  publicApiSurface: directorRuntimeInteractionIntentResolutionApiNames,
  registry: directorRuntimeInteractionIntentResolutionRegistry,
});

export function verifyDirectorRuntimeInteractionIntentResolution(): boolean {
  const surface = directorRuntimeInteractionIntentResolution;
  const registry = directorRuntimeInteractionIntentResolutionRegistry;
  const ruleIds = DIRECTOR_RUNTIME_INTERACTION_INTENT_RESOLUTION_RULES.map(({ ruleId }) => ruleId);
  const conflicts = findDirectorRuntimeInteractionIntentRuleConflicts();
  return (
    surface.identity === "DRI-4:3/DirectorRuntimeInteractionIntentResolution" &&
    surface.version === "4.3.0" &&
    surface.namespace === "nexora.dri.interaction.orchestration.intent-resolution" &&
    surface.layer === "DirectorRuntimeInteractionOrchestration" &&
    surface.stage === "IntentResolution" &&
    surface.immediateDependency === "DRI-4:2/DirectorRuntimeInteractionContracts" &&
    surface.immediateDependency === directorRuntimeInteractionContractsIdentity &&
    registry.intentKindCount === DIRECTOR_RUNTIME_INTERACTION_INTENT_KINDS.length &&
    registry.intentCategoryCount === DIRECTOR_RUNTIME_INTERACTION_INTENT_CATEGORIES.length &&
    registry.resolutionDispositionCount ===
      DIRECTOR_RUNTIME_INTERACTION_INTENT_RESOLUTION_DISPOSITIONS.length &&
    registry.resolutionRuleCount ===
      DIRECTOR_RUNTIME_INTERACTION_INTENT_RESOLUTION_RULES.length &&
    registry.publicApiCount === directorRuntimeInteractionIntentResolutionApiNames.length &&
    new Set(DIRECTOR_RUNTIME_INTERACTION_INTENT_KINDS).size ===
      DIRECTOR_RUNTIME_INTERACTION_INTENT_KINDS.length &&
    new Set(DIRECTOR_RUNTIME_INTERACTION_INTENT_CATEGORIES).size ===
      DIRECTOR_RUNTIME_INTERACTION_INTENT_CATEGORIES.length &&
    new Set(ruleIds).size === ruleIds.length &&
    conflicts.length === 0 &&
    DIRECTOR_RUNTIME_INTERACTION_INTENT_RESOLUTION_RULES.every((value) =>
      INTENT_CATEGORY_BY_KIND[value.intentKind] === value.category) &&
    Object.isFrozen(surface) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(DIRECTOR_RUNTIME_INTERACTION_INTENT_RESOLUTION_RULES)
  );
}


// ─── Pipeline surface (re-exported for linear DRI-4 chain composition) ───────

export {
  evaluateDirectorRuntimeInteractionContract,
  createDirectorRuntimeInteractionContext,
  createDirectorRuntimeInteractionRequest,
  isAcceptedDirectorRuntimeInteractionContract,
  isRejectedDirectorRuntimeInteractionContract,
  DIRECTOR_RUNTIME_INTERACTION_CONTRACT_VERSION,
} from "@/app/lib/dri/directorRuntimeInteractionContracts";

export type {
  DirectorRuntimeInteractionContext,
  CreateDirectorRuntimeInteractionContextInput,
  DirectorRuntimeInteractionContractResult,
  AcceptedDirectorRuntimeInteractionContract,
  RejectedDirectorRuntimeInteractionContract,
  CreateDirectorRuntimeInteractionRequestInput,
  DirectorRuntimeInteractionRequest,
  DirectorInteractionObservation,
} from "@/app/lib/dri/directorRuntimeInteractionContracts";
