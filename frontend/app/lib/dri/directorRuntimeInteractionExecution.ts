/**
 * DRI-4:6 — Director Runtime Interaction Execution.
 *
 * Consumes a DRI-4:5 reaction plan and produces a deterministic Interaction
 * Execution Result describing ordered directive outcomes.
 *
 * Intent ≠ Focus/Selection ≠ Reaction Plan ≠ Execution Result.
 * Semantic runtime execution only — no renderer bindings, UI mutation,
 * Advisor content generation, persistence, or network side effects.
 */

import {
  DIRECTOR_RUNTIME_REACTION_KINDS,
  DIRECTOR_RUNTIME_REACTION_SURFACES,
  createDirectorRuntimeReactionDirective,
  directorRuntimeInteractionReactionPlanningIdentity,
  findDirectorRuntimeReactionDirectiveConflicts,
  isDirectorRuntimeInteractionReactionPlan,
  isDirectorRuntimeReactionDirective,
  isDirectorRuntimeReactionKind,
  isDirectorRuntimeReactionSurface,
  type DirectorRuntimeInteractionReactionDirective,
  type DirectorRuntimeInteractionReactionPlan,
  type DirectorRuntimeReactionKind,
  type DirectorRuntimeReactionSurface,
} from "@/app/lib/dri/directorRuntimeInteractionReactionPlanning";

export type {
  DirectorInteractionTarget,
  DirectorRuntimeInteractionReactionDirective,
  DirectorRuntimeInteractionReactionPlan,
  DirectorRuntimeReactionKind,
  DirectorRuntimeReactionSurface,
} from "@/app/lib/dri/directorRuntimeInteractionReactionPlanning";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeInteractionExecutionIdentity =
  "DRI-4:6/DirectorRuntimeInteractionExecution" as const;
export const directorRuntimeInteractionExecutionVersion = "4.6.0" as const;
export const directorRuntimeInteractionExecutionNamespace =
  "nexora.dri.interaction.orchestration.execution" as const;
export const directorRuntimeInteractionExecutionUpstream =
  directorRuntimeInteractionReactionPlanningIdentity;

// ─── Vocabularies ───────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_INTERACTION_EXECUTION_STATUSES = Object.freeze([
  "completed",
  "partial",
  "skipped",
  "rejected",
] as const);
export type DirectorRuntimeInteractionExecutionStatus =
  (typeof DIRECTOR_RUNTIME_INTERACTION_EXECUTION_STATUSES)[number];

export const DIRECTOR_RUNTIME_DIRECTIVE_EXECUTION_STATUSES = Object.freeze([
  "executed",
  "skipped",
  "rejected",
  "unsupported",
] as const);
export type DirectorRuntimeDirectiveExecutionStatus =
  (typeof DIRECTOR_RUNTIME_DIRECTIVE_EXECUTION_STATUSES)[number];

export const DIRECTOR_RUNTIME_EXECUTION_REASONS = Object.freeze([
  "no-op",
  "unsupported-surface",
  "unsupported-reaction",
  "invalid-directive",
  "execution-conflict",
  "adapter-unavailable",
] as const);
export type DirectorRuntimeExecutionReason =
  (typeof DIRECTOR_RUNTIME_EXECUTION_REASONS)[number];

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface DirectorRuntimeInteractionExecutionRequest {
  readonly executionId: string;
  readonly reactionPlan: DirectorRuntimeInteractionReactionPlan;
}

export interface CreateDirectorRuntimeInteractionExecutionRequestInput {
  readonly executionId?: string;
  readonly reactionPlan: DirectorRuntimeInteractionReactionPlan;
}

export interface DirectorRuntimeInteractionDirectiveExecution {
  readonly directiveIndex: number;
  readonly status: DirectorRuntimeDirectiveExecutionStatus;
  readonly reason: DirectorRuntimeExecutionReason | null;
  readonly directive: DirectorRuntimeInteractionReactionDirective;
}

export interface DirectorRuntimeInteractionExecutionResult {
  readonly executionId: string;
  readonly planId: string;
  readonly intentId: string;
  readonly requestId: string;
  readonly status: DirectorRuntimeInteractionExecutionStatus;
  readonly directives: readonly DirectorRuntimeInteractionDirectiveExecution[];
  readonly executedCount: number;
  readonly skippedCount: number;
  readonly rejectedCount: number;
  readonly unsupportedCount: number;
}

export interface DirectorRuntimeInteractionExecutionCapability {
  readonly surface: DirectorRuntimeReactionSurface;
  readonly kind: DirectorRuntimeReactionKind;
}

export interface DirectorRuntimeInteractionExecutionAdapterOutcome {
  readonly status: DirectorRuntimeDirectiveExecutionStatus;
  readonly reason: DirectorRuntimeExecutionReason | null;
}

export interface DirectorRuntimeInteractionExecutionAdapter {
  readonly supports: (
    directive: DirectorRuntimeInteractionReactionDirective,
  ) => boolean;
  readonly execute: (
    directive: DirectorRuntimeInteractionReactionDirective,
  ) => DirectorRuntimeInteractionExecutionAdapterOutcome;
}

// ─── Capability registry ────────────────────────────────────────────────────

function capability(
  surface: DirectorRuntimeReactionSurface,
  kind: DirectorRuntimeReactionKind,
): DirectorRuntimeInteractionExecutionCapability {
  return Object.freeze({ surface, kind });
}

/**
 * Static approved semantic execution capabilities.
 * Matching uses surface × reaction kind only.
 */
export const DIRECTOR_RUNTIME_INTERACTION_EXECUTION_CAPABILITIES = Object.freeze([
  capability("attention", "emphasize-target"),
  capability("attention", "highlight-path"),
  capability("attention", "preserve"),
  capability("attention", "clear-context"),
  capability("scene", "deemphasize-non-targets"),
  capability("scene", "reveal-related"),
  capability("scene", "clear-context"),
  capability("scene", "preserve"),
  capability("advisor", "refresh-context"),
  capability("advisor", "clear-context"),
  capability("advisor", "preserve"),
  capability("insight", "refresh-context"),
  capability("insight", "show-related-metrics"),
  capability("insight", "clear-context"),
  capability("insight", "preserve"),
  capability("live-lens", "align-context"),
  capability("live-lens", "clear-context"),
  capability("live-lens", "preserve"),
  capability("explorer", "refresh-context"),
  capability("explorer", "show-related-packs"),
  capability("explorer", "clear-context"),
  capability("explorer", "preserve"),
  capability("timeline", "align-context"),
  capability("timeline", "preserve"),
  capability("mode", "align-context"),
  capability("mode", "preserve"),
  capability("none", "no-op"),
  capability("none", "preserve"),
] as const);

function capabilityKey(
  surface: DirectorRuntimeReactionSurface,
  kind: DirectorRuntimeReactionKind,
): string {
  return `${surface}\u0000${kind}`;
}

const CAPABILITY_KEYS = Object.freeze(new Set(
  DIRECTOR_RUNTIME_INTERACTION_EXECUTION_CAPABILITIES.map(({ surface, kind }) =>
    capabilityKey(surface, kind)),
));

export function isDirectorRuntimeInteractionExecutionCapabilitySupported(
  surface: DirectorRuntimeReactionSurface,
  kind: DirectorRuntimeReactionKind,
): boolean {
  return CAPABILITY_KEYS.has(capabilityKey(surface, kind));
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

function cloneDirective(
  directive: DirectorRuntimeInteractionReactionDirective,
): DirectorRuntimeInteractionReactionDirective {
  try {
    return createDirectorRuntimeReactionDirective({
      surface: directive.surface,
      kind: directive.kind,
      target: directive.target,
      relatedTargetIds: [...(directive.relatedTargetIds ?? [])],
      priority: directive.priority,
      reason: directive.reason,
    });
  } catch {
    return Object.freeze({
      surface: directive.surface,
      kind: directive.kind,
      target: directive.target === null || directive.target === undefined
        ? null
        : Object.freeze({ ...directive.target }),
      relatedTargetIds: Object.freeze([...(directive.relatedTargetIds ?? [])]),
      priority: directive.priority,
      reason: directive.reason,
    }) as DirectorRuntimeInteractionReactionDirective;
  }
}

function countStatus(
  directives: readonly DirectorRuntimeInteractionDirectiveExecution[],
  status: DirectorRuntimeDirectiveExecutionStatus,
): number {
  return directives.filter((entry) => entry.status === status).length;
}

export function deriveDirectorRuntimeInteractionExecutionStatus(
  directives: readonly DirectorRuntimeInteractionDirectiveExecution[],
): DirectorRuntimeInteractionExecutionStatus {
  const executedCount = countStatus(directives, "executed");
  const skippedCount = countStatus(directives, "skipped");
  const rejectedCount = countStatus(directives, "rejected");
  const unsupportedCount = countStatus(directives, "unsupported");

  if (directives.length === 0) return "rejected";
  if (rejectedCount > 0 && executedCount === 0 && unsupportedCount === 0) {
    return skippedCount > 0 ? "partial" : "rejected";
  }
  if (executedCount > 0 && unsupportedCount === 0 && rejectedCount === 0) {
    return "completed";
  }
  if (executedCount === 0 && unsupportedCount === 0 && rejectedCount === 0 &&
      skippedCount > 0) {
    return "skipped";
  }
  return "partial";
}

function record(
  directiveIndex: number,
  status: DirectorRuntimeDirectiveExecutionStatus,
  reason: DirectorRuntimeExecutionReason | null,
  directive: DirectorRuntimeInteractionReactionDirective,
): DirectorRuntimeInteractionDirectiveExecution {
  return Object.freeze({
    directiveIndex,
    status,
    reason,
    directive: cloneDirective(directive),
  });
}

/**
 * Narrow semantic execution adapter.
 * Accepts approved capabilities without renderer/UI/network side effects.
 */
export const directorRuntimeInteractionExecutionAdapter:
  DirectorRuntimeInteractionExecutionAdapter = Object.freeze({
    supports(directive: DirectorRuntimeInteractionReactionDirective): boolean {
      if (!isDirectorRuntimeReactionDirective(directive)) return false;
      return isDirectorRuntimeInteractionExecutionCapabilitySupported(
        directive.surface,
        directive.kind,
      );
    },
    execute(
      directive: DirectorRuntimeInteractionReactionDirective,
    ): DirectorRuntimeInteractionExecutionAdapterOutcome {
      if (!isDirectorRuntimeReactionDirective(directive)) {
        return Object.freeze({ status: "rejected", reason: "invalid-directive" });
      }
      if (directive.kind === "no-op") {
        return Object.freeze({ status: "skipped", reason: "no-op" });
      }
      if (!isDirectorRuntimeReactionSurface(directive.surface)) {
        return Object.freeze({ status: "unsupported", reason: "unsupported-surface" });
      }
      if (!isDirectorRuntimeReactionKind(directive.kind)) {
        return Object.freeze({ status: "unsupported", reason: "unsupported-reaction" });
      }
      if (!isDirectorRuntimeInteractionExecutionCapabilitySupported(
        directive.surface,
        directive.kind,
      )) {
        if (!(DIRECTOR_RUNTIME_REACTION_SURFACES as readonly string[])
          .includes(directive.surface)) {
          return Object.freeze({ status: "unsupported", reason: "unsupported-surface" });
        }
        return Object.freeze({ status: "unsupported", reason: "unsupported-reaction" });
      }
      return Object.freeze({ status: "executed", reason: null });
    },
  });

export function createDirectorRuntimeInteractionExecutionRequest(
  input: CreateDirectorRuntimeInteractionExecutionRequestInput,
): DirectorRuntimeInteractionExecutionRequest {
  if (!isDirectorRuntimeInteractionReactionPlan(input.reactionPlan)) {
    throw new TypeError("reactionPlan must be a DRI-4:5 interaction reaction plan");
  }
  const executionId = input.executionId ?? `${input.reactionPlan.planId}:execution`;
  if (!isNonEmptyString(executionId)) {
    throw new TypeError("executionId must be a non-empty opaque identifier");
  }
  return Object.freeze({
    executionId,
    reactionPlan: input.reactionPlan,
  });
}

export function executeDirectorRuntimeReactionDirective(
  directive: DirectorRuntimeInteractionReactionDirective,
  directiveIndex = 0,
): DirectorRuntimeInteractionDirectiveExecution {
  const outcome = directorRuntimeInteractionExecutionAdapter.execute(directive);
  return record(directiveIndex, outcome.status, outcome.reason, directive);
}

function rejectedResult(input: {
  readonly executionId: string;
  readonly planId: string;
  readonly intentId: string;
  readonly requestId: string;
  readonly directives: readonly DirectorRuntimeInteractionDirectiveExecution[];
}): DirectorRuntimeInteractionExecutionResult {
  const directives = Object.freeze([...input.directives]);
  return Object.freeze({
    executionId: input.executionId,
    planId: input.planId,
    intentId: input.intentId,
    requestId: input.requestId,
    status: "rejected" as const,
    directives,
    executedCount: countStatus(directives, "executed"),
    skippedCount: countStatus(directives, "skipped"),
    rejectedCount: countStatus(directives, "rejected"),
    unsupportedCount: countStatus(directives, "unsupported"),
  });
}

export function executeDirectorRuntimeInteraction(
  input: DirectorRuntimeInteractionExecutionRequest | CreateDirectorRuntimeInteractionExecutionRequestInput,
): DirectorRuntimeInteractionExecutionResult {
  const request = "executionId" in input && isNonEmptyString(input.executionId) &&
    isDirectorRuntimeInteractionReactionPlan(input.reactionPlan)
    ? Object.freeze({
      executionId: input.executionId,
      reactionPlan: input.reactionPlan,
    })
    : (() => {
      try {
        return createDirectorRuntimeInteractionExecutionRequest(input);
      } catch {
        return null;
      }
    })();

  if (request === null) {
    return rejectedResult({
      executionId: "invalid-execution",
      planId: "invalid-plan",
      intentId: "invalid-intent",
      requestId: "invalid-request",
      directives: [],
    });
  }

  const plan = request.reactionPlan;
  const conflicts = findDirectorRuntimeReactionDirectiveConflicts(plan.reactions);
  if (conflicts.length > 0) {
    return rejectedResult({
      executionId: request.executionId,
      planId: plan.planId,
      intentId: plan.intentId,
      requestId: plan.requestId,
      directives: plan.reactions.map((directive, directiveIndex) =>
        record(directiveIndex, "rejected", "execution-conflict", directive)),
    });
  }

  const directives = Object.freeze(plan.reactions.map((directive, directiveIndex) =>
    executeDirectorRuntimeReactionDirective(directive, directiveIndex)));

  const status = deriveDirectorRuntimeInteractionExecutionStatus(directives);
  return Object.freeze({
    executionId: request.executionId,
    planId: plan.planId,
    intentId: plan.intentId,
    requestId: plan.requestId,
    status,
    directives,
    executedCount: countStatus(directives, "executed"),
    skippedCount: countStatus(directives, "skipped"),
    rejectedCount: countStatus(directives, "rejected"),
    unsupportedCount: countStatus(directives, "unsupported"),
  });
}

export function isDirectorRuntimeInteractionExecutionResult(
  value: unknown,
): value is DirectorRuntimeInteractionExecutionResult {
  if (!isPlainObject(value)) return false;
  return isNonEmptyString(value.executionId) &&
    isNonEmptyString(value.planId) &&
    isNonEmptyString(value.intentId) &&
    isNonEmptyString(value.requestId) &&
    (DIRECTOR_RUNTIME_INTERACTION_EXECUTION_STATUSES as readonly unknown[])
      .includes(value.status) &&
    Array.isArray(value.directives) &&
    typeof value.executedCount === "number" &&
    typeof value.skippedCount === "number" &&
    typeof value.rejectedCount === "number" &&
    typeof value.unsupportedCount === "number";
}

export function isCompletedDirectorRuntimeInteractionExecution(
  value: unknown,
): value is DirectorRuntimeInteractionExecutionResult & { readonly status: "completed" } {
  return isDirectorRuntimeInteractionExecutionResult(value) && value.status === "completed";
}

export function hasDirectorRuntimeExecutionWork(
  result: DirectorRuntimeInteractionExecutionResult,
): boolean {
  return result.executedCount > 0;
}

// ─── Registry ───────────────────────────────────────────────────────────────

export const directorRuntimeInteractionExecutionTypeNames = Object.freeze([
  "DirectorRuntimeInteractionExecutionRequest",
  "DirectorRuntimeInteractionDirectiveExecution",
  "DirectorRuntimeInteractionExecutionResult",
  "DirectorRuntimeInteractionExecutionCapability",
] as const);

export const directorRuntimeInteractionExecutionApiNames = Object.freeze([
  "isDirectorRuntimeInteractionExecutionCapabilitySupported",
  "deriveDirectorRuntimeInteractionExecutionStatus",
  "createDirectorRuntimeInteractionExecutionRequest",
  "executeDirectorRuntimeReactionDirective",
  "executeDirectorRuntimeInteraction",
  "isDirectorRuntimeInteractionExecutionResult",
  "isCompletedDirectorRuntimeInteractionExecution",
  "hasDirectorRuntimeExecutionWork",
  "verifyDirectorRuntimeInteractionExecution",
] as const);

export const directorRuntimeInteractionExecutionRegistry = Object.freeze({
  executionStatuses: DIRECTOR_RUNTIME_INTERACTION_EXECUTION_STATUSES,
  executionStatusCount: DIRECTOR_RUNTIME_INTERACTION_EXECUTION_STATUSES.length,
  directiveStatuses: DIRECTOR_RUNTIME_DIRECTIVE_EXECUTION_STATUSES,
  directiveStatusCount: DIRECTOR_RUNTIME_DIRECTIVE_EXECUTION_STATUSES.length,
  executionReasons: DIRECTOR_RUNTIME_EXECUTION_REASONS,
  executionReasonCount: DIRECTOR_RUNTIME_EXECUTION_REASONS.length,
  supportedSurfaces: DIRECTOR_RUNTIME_REACTION_SURFACES,
  supportedSurfaceCount: DIRECTOR_RUNTIME_REACTION_SURFACES.length,
  executionCapabilities: DIRECTOR_RUNTIME_INTERACTION_EXECUTION_CAPABILITIES,
  executionCapabilityCount: DIRECTOR_RUNTIME_INTERACTION_EXECUTION_CAPABILITIES.length,
  publicTypes: directorRuntimeInteractionExecutionTypeNames,
  publicTypeCount: directorRuntimeInteractionExecutionTypeNames.length,
  publicApis: directorRuntimeInteractionExecutionApiNames,
  publicApiCount: directorRuntimeInteractionExecutionApiNames.length,
  immediateDependency: directorRuntimeInteractionExecutionUpstream,
  ordering: "canonical-reaction-plan-order" as const,
});

export const directorRuntimeInteractionExecution = Object.freeze({
  phase: "DRI-4:6" as const,
  name: "DirectorRuntimeInteractionExecution" as const,
  identity: directorRuntimeInteractionExecutionIdentity,
  namespace: directorRuntimeInteractionExecutionNamespace,
  version: directorRuntimeInteractionExecutionVersion,
  layer: "DirectorRuntimeInteractionOrchestration" as const,
  stage: "InteractionExecution" as const,
  status: "InteractionExecutionReady" as const,
  immediateDependency: directorRuntimeInteractionExecutionUpstream,
  philosophy: "execution-result-is-not-animation-completion" as const,
  executionStatuses: DIRECTOR_RUNTIME_INTERACTION_EXECUTION_STATUSES,
  directiveStatuses: DIRECTOR_RUNTIME_DIRECTIVE_EXECUTION_STATUSES,
  executionReasons: DIRECTOR_RUNTIME_EXECUTION_REASONS,
  capabilities: DIRECTOR_RUNTIME_INTERACTION_EXECUTION_CAPABILITIES,
  publicApiSurface: directorRuntimeInteractionExecutionApiNames,
  registry: directorRuntimeInteractionExecutionRegistry,
});

export function verifyDirectorRuntimeInteractionExecution(): boolean {
  const surface = directorRuntimeInteractionExecution;
  const registry = directorRuntimeInteractionExecutionRegistry;
  const capabilityKeys = DIRECTOR_RUNTIME_INTERACTION_EXECUTION_CAPABILITIES.map(
    ({ surface: reactionSurface, kind }) => capabilityKey(reactionSurface, kind),
  );
  return (
    surface.identity === "DRI-4:6/DirectorRuntimeInteractionExecution" &&
    surface.version === "4.6.0" &&
    surface.namespace === "nexora.dri.interaction.orchestration.execution" &&
    surface.layer === "DirectorRuntimeInteractionOrchestration" &&
    surface.stage === "InteractionExecution" &&
    surface.immediateDependency ===
      "DRI-4:5/DirectorRuntimeInteractionReactionPlanning" &&
    surface.immediateDependency === directorRuntimeInteractionReactionPlanningIdentity &&
    registry.executionStatusCount ===
      DIRECTOR_RUNTIME_INTERACTION_EXECUTION_STATUSES.length &&
    registry.directiveStatusCount ===
      DIRECTOR_RUNTIME_DIRECTIVE_EXECUTION_STATUSES.length &&
    registry.executionReasonCount === DIRECTOR_RUNTIME_EXECUTION_REASONS.length &&
    registry.executionCapabilityCount ===
      DIRECTOR_RUNTIME_INTERACTION_EXECUTION_CAPABILITIES.length &&
    registry.publicApiCount === directorRuntimeInteractionExecutionApiNames.length &&
    new Set(capabilityKeys).size === capabilityKeys.length &&
    new Set(DIRECTOR_RUNTIME_INTERACTION_EXECUTION_STATUSES).size ===
      DIRECTOR_RUNTIME_INTERACTION_EXECUTION_STATUSES.length &&
    CAPABILITY_KEYS.has(capabilityKey("none", "no-op")) &&
    CAPABILITY_KEYS.has(capabilityKey("attention", "emphasize-target")) &&
    CAPABILITY_KEYS.has(capabilityKey("scene", "reveal-related")) &&
    Object.isFrozen(surface) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(DIRECTOR_RUNTIME_INTERACTION_EXECUTION_CAPABILITIES) &&
    DIRECTOR_RUNTIME_REACTION_SURFACES.length === registry.supportedSurfaceCount &&
    DIRECTOR_RUNTIME_REACTION_KINDS.includes("no-op")
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
  planDirectorRuntimeInteractionReaction,
  isDirectorRuntimeInteractionReactionPlan,
} from "@/app/lib/dri/directorRuntimeInteractionReactionPlanning";

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
  DirectorRuntimeFocusSelectionTransition,
  CreateDirectorRuntimeFocusSelectionStateInput,
} from "@/app/lib/dri/directorRuntimeInteractionReactionPlanning";
