/**
 * DRI-4:4 — Director Runtime Focus & Selection Orchestration.
 *
 * Consumes a resolved DRI-4:3 interaction intent and computes the next
 * immutable Director focus/selection state transition.
 *
 * Intent ≠ Focus/Selection State ≠ Reaction.
 * State transitions only — no reaction planning, scene mutation, or execution.
 */

import {
  DIRECTOR_RUNTIME_INTERACTION_INTENT_KINDS,
  directorRuntimeInteractionIntentResolutionIdentity,
  isDirectorRuntimeInteractionIntentKind,
  isResolvedDirectorRuntimeInteractionIntent,
  type DirectorInteractionTarget,
  type DirectorRuntimeInteractionIntent,
  type DirectorRuntimeInteractionIntentKind,
  type DirectorRuntimeInteractionIntentResolutionResult,
  type ResolvedDirectorRuntimeInteractionIntent,
} from "@/app/lib/dri/directorRuntimeInteractionIntentResolution";

export type {
  DirectorInteractionTarget,
  DirectorRuntimeInteractionIntent,
  DirectorRuntimeInteractionIntentKind,
  DirectorRuntimeInteractionIntentResolutionResult,
  ResolvedDirectorRuntimeInteractionIntent,
  UnresolvedDirectorRuntimeInteractionIntent,
} from "@/app/lib/dri/directorRuntimeInteractionIntentResolution";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeFocusSelectionOrchestrationIdentity =
  "DRI-4:4/DirectorRuntimeFocusSelectionOrchestration" as const;
export const directorRuntimeFocusSelectionOrchestrationVersion = "4.4.0" as const;
export const directorRuntimeFocusSelectionOrchestrationNamespace =
  "nexora.dri.interaction.orchestration.focus-selection" as const;
export const directorRuntimeFocusSelectionOrchestrationUpstream =
  directorRuntimeInteractionIntentResolutionIdentity;

// ─── Transition vocabulary ──────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_FOCUS_SELECTION_TRANSITION_KINDS = Object.freeze([
  "select",
  "focus",
  "select-and-focus",
  "clear-selection",
  "clear-focus",
  "clear-all",
  "preserve",
] as const);
export type DirectorRuntimeFocusSelectionTransitionKind =
  (typeof DIRECTOR_RUNTIME_FOCUS_SELECTION_TRANSITION_KINDS)[number];

export const DIRECTOR_RUNTIME_FOCUS_SELECTION_AFFECTED_DIMENSIONS = Object.freeze([
  "selection",
  "focus",
  "both",
  "none",
] as const);
export type DirectorRuntimeFocusSelectionAffectedDimension =
  (typeof DIRECTOR_RUNTIME_FOCUS_SELECTION_AFFECTED_DIMENSIONS)[number];

// ─── State contracts ────────────────────────────────────────────────────────

export interface DirectorRuntimeFocusState {
  readonly focusedTarget: DirectorInteractionTarget | null;
}

export interface DirectorRuntimeSelectionState {
  readonly selectedTarget: DirectorInteractionTarget | null;
}

export interface DirectorRuntimeFocusSelectionState {
  readonly focus: DirectorRuntimeFocusState;
  readonly selection: DirectorRuntimeSelectionState;
  readonly sequence?: number;
  readonly intentId?: string;
  readonly requestId?: string;
}

export interface CreateDirectorRuntimeFocusSelectionStateInput {
  readonly focusedTarget?: DirectorInteractionTarget | null;
  readonly selectedTarget?: DirectorInteractionTarget | null;
  readonly sequence?: number;
  readonly intentId?: string;
  readonly requestId?: string;
}

export interface DirectorRuntimeFocusSelectionTransition {
  readonly previousState: DirectorRuntimeFocusSelectionState;
  readonly nextState: DirectorRuntimeFocusSelectionState;
  readonly transitionKind: DirectorRuntimeFocusSelectionTransitionKind;
  readonly changed: boolean;
  readonly intentId: string;
  readonly requestId: string;
  readonly intentKind: DirectorRuntimeInteractionIntentKind;
  readonly target: DirectorInteractionTarget;
}

export interface OrchestrateDirectorRuntimeFocusSelectionInput {
  readonly currentState: DirectorRuntimeFocusSelectionState;
  readonly resolvedIntent: ResolvedDirectorRuntimeInteractionIntent;
}

export interface DirectorRuntimeFocusSelectionTransitionRule {
  readonly ruleId: string;
  readonly intentKind: DirectorRuntimeInteractionIntentKind;
  readonly targetKind?: DirectorInteractionTarget["kind"];
  readonly transitionKind: DirectorRuntimeFocusSelectionTransitionKind;
  readonly affected: DirectorRuntimeFocusSelectionAffectedDimension;
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

export function cloneDirectorRuntimeInteractionTarget(
  target: DirectorInteractionTarget,
): DirectorInteractionTarget {
  return Object.freeze({
    kind: target.kind,
    id: target.id,
    ...(target.parentId === undefined ? {} : { parentId: target.parentId }),
    ...(target.scope === undefined ? {} : { scope: target.scope }),
  });
}

export function areDirectorRuntimeInteractionTargetsEqual(
  left: DirectorInteractionTarget | null | undefined,
  right: DirectorInteractionTarget | null | undefined,
): boolean {
  if (left == null && right == null) return true;
  if (left == null || right == null) return false;
  return left.kind === right.kind &&
    left.id === right.id &&
    (left.parentId ?? null) === (right.parentId ?? null) &&
    (left.scope ?? null) === (right.scope ?? null);
}

export function areDirectorRuntimeFocusSelectionStatesEqual(
  left: DirectorRuntimeFocusSelectionState,
  right: DirectorRuntimeFocusSelectionState,
): boolean {
  return areDirectorRuntimeInteractionTargetsEqual(
    left.focus.focusedTarget,
    right.focus.focusedTarget,
  ) && areDirectorRuntimeInteractionTargetsEqual(
    left.selection.selectedTarget,
    right.selection.selectedTarget,
  );
}

function normalizeOptionalTarget(
  value: DirectorInteractionTarget | null | undefined,
): DirectorInteractionTarget | null {
  if (value == null) return null;
  return cloneDirectorRuntimeInteractionTarget(value);
}

export function createDirectorRuntimeFocusSelectionState(
  input: CreateDirectorRuntimeFocusSelectionStateInput = {},
): DirectorRuntimeFocusSelectionState {
  return Object.freeze({
    focus: Object.freeze({
      focusedTarget: normalizeOptionalTarget(input.focusedTarget),
    }),
    selection: Object.freeze({
      selectedTarget: normalizeOptionalTarget(input.selectedTarget),
    }),
    ...(input.sequence === undefined ? {} : { sequence: input.sequence }),
    ...(input.intentId === undefined ? {} : { intentId: input.intentId }),
    ...(input.requestId === undefined ? {} : { requestId: input.requestId }),
  });
}

export const directorRuntimeEmptyFocusSelectionState =
  createDirectorRuntimeFocusSelectionState();

export function createEmptyDirectorRuntimeFocusSelectionState(): DirectorRuntimeFocusSelectionState {
  return createDirectorRuntimeFocusSelectionState();
}

function transitionRule(
  ruleId: string,
  intentKind: DirectorRuntimeInteractionIntentKind,
  transitionKind: DirectorRuntimeFocusSelectionTransitionKind,
  affected: DirectorRuntimeFocusSelectionAffectedDimension,
  targetKind?: DirectorInteractionTarget["kind"],
): DirectorRuntimeFocusSelectionTransitionRule {
  return Object.freeze({
    ruleId,
    intentKind,
    ...(targetKind === undefined ? {} : { targetKind }),
    transitionKind,
    affected,
  });
}

/**
 * Canonical intent → transition mapping.
 * More-specific targetKind rules precede generic intent-kind rules.
 * activate-target explicitly selects and focuses (combined transition).
 */
export const DIRECTOR_RUNTIME_FOCUS_SELECTION_TRANSITION_RULES = Object.freeze([
  transitionRule("select-none-clears-selection", "select-target", "clear-selection", "selection", "none"),
  transitionRule("select-target-selects", "select-target", "select", "selection"),
  transitionRule("focus-target-focuses", "focus-target", "focus", "focus"),
  transitionRule("activate-target-selects-and-focuses", "activate-target", "select-and-focus", "both"),
  transitionRule("clear-focus-clears-focus", "clear-focus", "clear-focus", "focus"),
  transitionRule("inspect-preserves", "inspect-target", "preserve", "none"),
  transitionRule("open-preserves", "open-target", "preserve", "none"),
  transitionRule("close-preserves", "close-target", "preserve", "none"),
  transitionRule("navigate-back-preserves", "navigate-back", "preserve", "none"),
  transitionRule("navigate-to-preserves", "navigate-to", "preserve", "none"),
  transitionRule("expand-preserves", "expand-target", "preserve", "none"),
  transitionRule("collapse-preserves", "collapse-target", "preserve", "none"),
  transitionRule("invoke-preserves", "invoke-target", "preserve", "none"),
  transitionRule("preview-preserves", "preview-target", "preserve", "none"),
  transitionRule("no-op-preserves", "no-op", "preserve", "none"),
] as const);

function ruleSpecificity(rule: DirectorRuntimeFocusSelectionTransitionRule): number {
  return rule.targetKind === undefined ? 1 : 2;
}

function matchTransitionRule(
  intent: DirectorRuntimeInteractionIntent,
): DirectorRuntimeFocusSelectionTransitionRule {
  const matches = DIRECTOR_RUNTIME_FOCUS_SELECTION_TRANSITION_RULES.filter((rule) => {
    if (rule.intentKind !== intent.kind) return false;
    if (rule.targetKind !== undefined && rule.targetKind !== intent.target.kind) return false;
    return true;
  });
  if (matches.length === 0) {
    throw new TypeError(`no focus/selection transition rule for intent kind ${intent.kind}`);
  }
  const maxSpecificity = matches.reduce(
    (highest, rule) => {
      const specificity = ruleSpecificity(rule);
      return specificity > highest ? specificity : highest;
    },
    -1,
  );
  const winners = matches.filter((rule) => ruleSpecificity(rule) === maxSpecificity);
  const kinds = new Set(winners.map((rule) => rule.transitionKind));
  if (kinds.size > 1) {
    throw new TypeError(`ambiguous focus/selection transition for intent kind ${intent.kind}`);
  }
  return winners[0]!;
}

function applyTransition(
  previous: DirectorRuntimeFocusSelectionState,
  intent: DirectorRuntimeInteractionIntent,
  transitionKind: DirectorRuntimeFocusSelectionTransitionKind,
): DirectorRuntimeFocusSelectionState {
  const target = cloneDirectorRuntimeInteractionTarget(intent.target);
  switch (transitionKind) {
    case "select":
      return createDirectorRuntimeFocusSelectionState({
        focusedTarget: previous.focus.focusedTarget,
        selectedTarget: target,
        intentId: intent.intentId,
        requestId: intent.requestId,
      });
    case "focus":
      return createDirectorRuntimeFocusSelectionState({
        focusedTarget: target,
        selectedTarget: previous.selection.selectedTarget,
        intentId: intent.intentId,
        requestId: intent.requestId,
      });
    case "select-and-focus":
      return createDirectorRuntimeFocusSelectionState({
        focusedTarget: target,
        selectedTarget: target,
        intentId: intent.intentId,
        requestId: intent.requestId,
      });
    case "clear-selection":
      return createDirectorRuntimeFocusSelectionState({
        focusedTarget: previous.focus.focusedTarget,
        selectedTarget: null,
        intentId: intent.intentId,
        requestId: intent.requestId,
      });
    case "clear-focus":
      return createDirectorRuntimeFocusSelectionState({
        focusedTarget: null,
        selectedTarget: previous.selection.selectedTarget,
        intentId: intent.intentId,
        requestId: intent.requestId,
      });
    case "clear-all":
      return createDirectorRuntimeFocusSelectionState({
        focusedTarget: null,
        selectedTarget: null,
        intentId: intent.intentId,
        requestId: intent.requestId,
      });
    case "preserve":
      return createDirectorRuntimeFocusSelectionState({
        focusedTarget: previous.focus.focusedTarget,
        selectedTarget: previous.selection.selectedTarget,
        sequence: previous.sequence,
        intentId: intent.intentId,
        requestId: intent.requestId,
      });
    default: {
      const _exhaustive: never = transitionKind;
      throw new TypeError(`unsupported transition kind: ${_exhaustive}`);
    }
  }
}

export function orchestrateDirectorRuntimeFocusSelection(
  input: OrchestrateDirectorRuntimeFocusSelectionInput,
): DirectorRuntimeFocusSelectionTransition {
  if (!isDirectorRuntimeFocusSelectionState(input.currentState)) {
    throw new TypeError("currentState must be a focus/selection state");
  }
  if (!isResolvedDirectorRuntimeInteractionIntent(input.resolvedIntent)) {
    throw new TypeError(
      "focus/selection orchestration requires a resolved DRI-4:3 interaction intent",
    );
  }

  const previousState = createDirectorRuntimeFocusSelectionState({
    focusedTarget: input.currentState.focus.focusedTarget,
    selectedTarget: input.currentState.selection.selectedTarget,
    sequence: input.currentState.sequence,
    intentId: input.currentState.intentId,
    requestId: input.currentState.requestId,
  });
  const intent = input.resolvedIntent.intent;
  const rule = matchTransitionRule(intent);
  const nextState = applyTransition(previousState, intent, rule.transitionKind);
  const changed = !areDirectorRuntimeFocusSelectionStatesEqual(previousState, nextState);

  return Object.freeze({
    previousState,
    nextState,
    transitionKind: rule.transitionKind,
    changed,
    intentId: intent.intentId,
    requestId: intent.requestId,
    intentKind: intent.kind,
    target: cloneDirectorRuntimeInteractionTarget(intent.target),
  });
}

export function didDirectorRuntimeFocusSelectionChange(
  transition: DirectorRuntimeFocusSelectionTransition,
): boolean {
  return transition.changed;
}

// ─── Guards ─────────────────────────────────────────────────────────────────

export function isDirectorRuntimeFocusSelectionState(
  value: unknown,
): value is DirectorRuntimeFocusSelectionState {
  if (!isPlainObject(value)) return false;
  if (!isPlainObject(value.focus) || !isPlainObject(value.selection)) return false;
  const focused = value.focus.focusedTarget;
  const selected = value.selection.selectedTarget;
  const validTarget = (target: unknown) => {
    if (target === null) return true;
    if (!isPlainObject(target)) return false;
    if (typeof target.kind !== "string") return false;
    if (target.kind === "none") return typeof target.id === "string";
    return isNonEmptyString(target.id);
  };
  if (!validTarget(focused) || !validTarget(selected)) return false;
  if (value.sequence !== undefined &&
      !(typeof value.sequence === "number" && Number.isInteger(value.sequence))) {
    return false;
  }
  if (value.intentId !== undefined && !isNonEmptyString(value.intentId)) return false;
  if (value.requestId !== undefined && !isNonEmptyString(value.requestId)) return false;
  return true;
}

export function isDirectorRuntimeFocusSelectionTransition(
  value: unknown,
): value is DirectorRuntimeFocusSelectionTransition {
  if (!isPlainObject(value)) return false;
  return isDirectorRuntimeFocusSelectionState(value.previousState) &&
    isDirectorRuntimeFocusSelectionState(value.nextState) &&
    (DIRECTOR_RUNTIME_FOCUS_SELECTION_TRANSITION_KINDS as readonly unknown[])
      .includes(value.transitionKind) &&
    typeof value.changed === "boolean" &&
    isNonEmptyString(value.intentId) &&
    isNonEmptyString(value.requestId) &&
    isDirectorRuntimeInteractionIntentKind(value.intentKind) &&
    isPlainObject(value.target);
}

export function assertResolvedDirectorRuntimeInteractionIntent(
  value: DirectorRuntimeInteractionIntentResolutionResult | ResolvedDirectorRuntimeInteractionIntent,
): ResolvedDirectorRuntimeInteractionIntent {
  if (!isResolvedDirectorRuntimeInteractionIntent(value)) {
    throw new TypeError(
      "focus/selection orchestration requires a resolved DRI-4:3 interaction intent",
    );
  }
  return value;
}

export function findDirectorRuntimeFocusSelectionTransitionRuleConflicts(
  rules: readonly DirectorRuntimeFocusSelectionTransitionRule[] =
    DIRECTOR_RUNTIME_FOCUS_SELECTION_TRANSITION_RULES,
): readonly string[] {
  const conflicts = rules.flatMap((left, index) =>
    rules.slice(index + 1).flatMap((right) => {
      if (left.intentKind !== right.intentKind) return [];
      if (left.targetKind !== right.targetKind) return [];
      if (left.transitionKind === right.transitionKind) return [];
      return [`${left.ruleId}|${right.ruleId}`];
    }));
  return Object.freeze(conflicts);
}

// ─── Registry ───────────────────────────────────────────────────────────────

export const directorRuntimeFocusSelectionOrchestrationTypeNames = Object.freeze([
  "DirectorRuntimeFocusState",
  "DirectorRuntimeSelectionState",
  "DirectorRuntimeFocusSelectionState",
  "DirectorRuntimeFocusSelectionTransition",
  "DirectorRuntimeFocusSelectionTransitionRule",
] as const);

export const directorRuntimeFocusSelectionOrchestrationApiNames = Object.freeze([
  "cloneDirectorRuntimeInteractionTarget",
  "areDirectorRuntimeInteractionTargetsEqual",
  "areDirectorRuntimeFocusSelectionStatesEqual",
  "createDirectorRuntimeFocusSelectionState",
  "createEmptyDirectorRuntimeFocusSelectionState",
  "orchestrateDirectorRuntimeFocusSelection",
  "didDirectorRuntimeFocusSelectionChange",
  "isDirectorRuntimeFocusSelectionState",
  "isDirectorRuntimeFocusSelectionTransition",
  "assertResolvedDirectorRuntimeInteractionIntent",
  "findDirectorRuntimeFocusSelectionTransitionRuleConflicts",
  "verifyDirectorRuntimeFocusSelectionOrchestration",
] as const);

export const directorRuntimeFocusSelectionOrchestrationRegistry = Object.freeze({
  transitionKinds: DIRECTOR_RUNTIME_FOCUS_SELECTION_TRANSITION_KINDS,
  transitionKindCount: DIRECTOR_RUNTIME_FOCUS_SELECTION_TRANSITION_KINDS.length,
  affectedDimensions: DIRECTOR_RUNTIME_FOCUS_SELECTION_AFFECTED_DIMENSIONS,
  affectedDimensionCount: DIRECTOR_RUNTIME_FOCUS_SELECTION_AFFECTED_DIMENSIONS.length,
  focusStateContracts: Object.freeze(["DirectorRuntimeFocusState"] as const),
  focusStateContractCount: 1,
  selectionStateContracts: Object.freeze(["DirectorRuntimeSelectionState"] as const),
  selectionStateContractCount: 1,
  combinedStateContracts: Object.freeze([
    "DirectorRuntimeFocusSelectionState",
    "DirectorRuntimeFocusSelectionTransition",
  ] as const),
  combinedStateContractCount: 2,
  transitionRules: DIRECTOR_RUNTIME_FOCUS_SELECTION_TRANSITION_RULES,
  transitionRuleCount: DIRECTOR_RUNTIME_FOCUS_SELECTION_TRANSITION_RULES.length,
  publicTypes: directorRuntimeFocusSelectionOrchestrationTypeNames,
  publicTypeCount: directorRuntimeFocusSelectionOrchestrationTypeNames.length,
  publicApis: directorRuntimeFocusSelectionOrchestrationApiNames,
  publicApiCount: directorRuntimeFocusSelectionOrchestrationApiNames.length,
  immediateDependency: directorRuntimeFocusSelectionOrchestrationUpstream,
});

export const directorRuntimeFocusSelectionOrchestration = Object.freeze({
  phase: "DRI-4:4" as const,
  name: "DirectorRuntimeFocusSelectionOrchestration" as const,
  identity: directorRuntimeFocusSelectionOrchestrationIdentity,
  namespace: directorRuntimeFocusSelectionOrchestrationNamespace,
  version: directorRuntimeFocusSelectionOrchestrationVersion,
  layer: "DirectorRuntimeInteractionOrchestration" as const,
  stage: "FocusSelectionOrchestration" as const,
  status: "FocusSelectionOrchestrationReady" as const,
  immediateDependency: directorRuntimeFocusSelectionOrchestrationUpstream,
  philosophy: "intent-is-not-focus-selection-is-not-reaction" as const,
  transitionKinds: DIRECTOR_RUNTIME_FOCUS_SELECTION_TRANSITION_KINDS,
  transitionRules: DIRECTOR_RUNTIME_FOCUS_SELECTION_TRANSITION_RULES,
  emptyState: directorRuntimeEmptyFocusSelectionState,
  publicApiSurface: directorRuntimeFocusSelectionOrchestrationApiNames,
  registry: directorRuntimeFocusSelectionOrchestrationRegistry,
});

export function verifyDirectorRuntimeFocusSelectionOrchestration(): boolean {
  const surface = directorRuntimeFocusSelectionOrchestration;
  const registry = directorRuntimeFocusSelectionOrchestrationRegistry;
  const coveredIntents = new Set(
    DIRECTOR_RUNTIME_FOCUS_SELECTION_TRANSITION_RULES.map((rule) => rule.intentKind),
  );
  const conflicts = findDirectorRuntimeFocusSelectionTransitionRuleConflicts();
  const empty = directorRuntimeEmptyFocusSelectionState;
  return (
    surface.identity === "DRI-4:4/DirectorRuntimeFocusSelectionOrchestration" &&
    surface.version === "4.4.0" &&
    surface.namespace === "nexora.dri.interaction.orchestration.focus-selection" &&
    surface.layer === "DirectorRuntimeInteractionOrchestration" &&
    surface.stage === "FocusSelectionOrchestration" &&
    surface.immediateDependency ===
      "DRI-4:3/DirectorRuntimeInteractionIntentResolution" &&
    surface.immediateDependency === directorRuntimeInteractionIntentResolutionIdentity &&
    registry.transitionKindCount === DIRECTOR_RUNTIME_FOCUS_SELECTION_TRANSITION_KINDS.length &&
    registry.transitionRuleCount === DIRECTOR_RUNTIME_FOCUS_SELECTION_TRANSITION_RULES.length &&
    registry.publicApiCount === directorRuntimeFocusSelectionOrchestrationApiNames.length &&
    DIRECTOR_RUNTIME_INTERACTION_INTENT_KINDS.every((kind) => coveredIntents.has(kind)) &&
    conflicts.length === 0 &&
    empty.focus.focusedTarget === null &&
    empty.selection.selectedTarget === null &&
    Object.isFrozen(empty) &&
    Object.isFrozen(empty.focus) &&
    Object.isFrozen(empty.selection) &&
    Object.isFrozen(surface) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(DIRECTOR_RUNTIME_FOCUS_SELECTION_TRANSITION_RULES) &&
    new Set(DIRECTOR_RUNTIME_FOCUS_SELECTION_TRANSITION_KINDS).size ===
      DIRECTOR_RUNTIME_FOCUS_SELECTION_TRANSITION_KINDS.length
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
  isDirectorRuntimeInteractionIntent,
} from "@/app/lib/dri/directorRuntimeInteractionIntentResolution";

export type {
  DirectorRuntimeInteractionContext,
  CreateDirectorRuntimeInteractionContextInput,
  DirectorRuntimeInteractionContractResult,
  AcceptedDirectorRuntimeInteractionContract,
  RejectedDirectorRuntimeInteractionContract,
  CreateDirectorRuntimeInteractionRequestInput,
  DirectorRuntimeInteractionRequest,
  DirectorInteractionObservation,
} from "@/app/lib/dri/directorRuntimeInteractionIntentResolution";
