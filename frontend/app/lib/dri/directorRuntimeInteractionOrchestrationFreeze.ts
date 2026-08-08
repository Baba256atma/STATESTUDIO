/**
 * DRI-4:8 — Director Runtime Interaction Orchestration Certification & Freeze.
 *
 * Validates, certifies, and freezes the approved DRI-4:7 Interaction
 * Orchestration Platform. No new interaction semantics.
 */

import {
  DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_DISPOSITIONS,
  DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_PHASES,
  DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_TRACE_STATUSES,
  continueDirectorRuntimeInteractionOrchestrationAfterIntent,
  continueDirectorRuntimeInteractionOrchestrationAfterReactionPlan,
  createDirectorRuntimeFocusSelectionState,
  createDirectorRuntimeInteractionOrchestrationInput,
  createEmptyDirectorRuntimeFocusSelectionState,
  directorRuntimeInteractionOrchestrationPlatform,
  directorRuntimeInteractionOrchestrationPlatformApiNames,
  directorRuntimeInteractionOrchestrationPlatformIdentity,
  directorRuntimeInteractionOrchestrationPlatformNamespace,
  directorRuntimeInteractionOrchestrationPlatformRegistry,
  directorRuntimeInteractionOrchestrationPlatformTypeNames,
  directorRuntimeInteractionOrchestrationPlatformUpstream,
  directorRuntimeInteractionOrchestrationPlatformVersion,
  isCompletedDirectorRuntimeInteractionOrchestration,
  isDirectorRuntimeInteractionOrchestrationResult,
  isRejectedDirectorRuntimeInteractionOrchestration,
  isStoppedDirectorRuntimeInteractionOrchestration,
  orchestrateDirectorRuntimeInteraction,
  verifyDirectorRuntimeInteractionOrchestrationPlatform,
  type AcceptedDirectorRuntimeInteractionContract,
  type DirectorRuntimeFocusSelectionState,
  type DirectorRuntimeInteractionOrchestrationInput,
  type DirectorRuntimeInteractionOrchestrationResult,
  type DirectorRuntimeInteractionReactionPlan,
  type ResolvedDirectorRuntimeInteractionIntent,
} from "@/app/lib/dri/directorRuntimeInteractionOrchestrationPlatform";

/** Approved upstream re-exports preserve exact value and function identity. */
export {
  DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_DISPOSITIONS,
  DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_PHASES,
  DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_TRACE_STATUSES,
  continueDirectorRuntimeInteractionOrchestrationAfterIntent,
  continueDirectorRuntimeInteractionOrchestrationAfterReactionPlan,
  createDirectorRuntimeFocusSelectionState,
  createDirectorRuntimeInteractionOrchestrationInput,
  createEmptyDirectorRuntimeFocusSelectionState,
  directorRuntimeInteractionOrchestrationPlatform,
  directorRuntimeInteractionOrchestrationPlatformApiNames,
  directorRuntimeInteractionOrchestrationPlatformIdentity,
  directorRuntimeInteractionOrchestrationPlatformNamespace,
  directorRuntimeInteractionOrchestrationPlatformRegistry,
  directorRuntimeInteractionOrchestrationPlatformTypeNames,
  directorRuntimeInteractionOrchestrationPlatformUpstream,
  directorRuntimeInteractionOrchestrationPlatformVersion,
  isCompletedDirectorRuntimeInteractionOrchestration,
  isDirectorRuntimeInteractionOrchestrationResult,
  isRejectedDirectorRuntimeInteractionOrchestration,
  isStoppedDirectorRuntimeInteractionOrchestration,
  orchestrateDirectorRuntimeInteraction,
  verifyDirectorRuntimeInteractionOrchestrationPlatform,
};
export type {
  AcceptedDirectorRuntimeInteractionContract,
  DirectorRuntimeFocusSelectionState,
  DirectorRuntimeInteractionExecutionResult,
  DirectorRuntimeInteractionOrchestrationInput,
  DirectorRuntimeInteractionOrchestrationResult,
  DirectorRuntimeInteractionReactionPlan,
  ResolvedDirectorRuntimeInteractionIntent,
} from "@/app/lib/dri/directorRuntimeInteractionOrchestrationPlatform";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeInteractionOrchestrationFreezeIdentity =
  "DRI-4:8/DirectorRuntimeInteractionOrchestrationFreeze" as const;
export const directorRuntimeInteractionOrchestrationFreezeVersion = "4.8.0" as const;
export const directorRuntimeInteractionOrchestrationFreezeNamespace =
  "nexora.dri.interaction.orchestration.freeze" as const;
export const directorRuntimeInteractionOrchestrationFreezeUpstream =
  directorRuntimeInteractionOrchestrationPlatformIdentity;

// ─── Lock / freeze vocabulary ───────────────────────────────────────────────

export const directorRuntimeInteractionOrchestrationLock =
  "DRI-4-DIRECTOR-RUNTIME-INTERACTION-ORCHESTRATION-LOCKED" as const;

export const directorRuntimeInteractionOrchestrationPlatformLock = Object.freeze({
  lockId: directorRuntimeInteractionOrchestrationLock,
  locked: true as const,
  phase: "DRI-4" as const,
  stage: "CertificationAndFreeze" as const,
});

export const DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_FREEZE_STATES = Object.freeze([
  "draft",
  "candidate",
  "frozen",
  "invalid",
] as const);
export type DirectorRuntimeInteractionOrchestrationFreezeState =
  (typeof DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_FREEZE_STATES)[number];

export const DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_FREEZE_STATUSES = Object.freeze([
  "Frozen",
  "Invalid",
] as const);
export type DirectorRuntimeInteractionOrchestrationFreezeStatus =
  (typeof DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_FREEZE_STATUSES)[number];

export const DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_FREEZE_READINESS_VALUES = Object.freeze([
  "ReadyForPublicIndex",
  "NotReadyForPublicIndex",
] as const);
export type DirectorRuntimeInteractionOrchestrationFreezeReadiness =
  (typeof DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_FREEZE_READINESS_VALUES)[number];

export const DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_RELEASE_STATUSES = Object.freeze([
  "unreleased",
  "release-candidate",
  "released",
  "withdrawn",
] as const);

export const DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_STABILITY_STATUSES = Object.freeze([
  "experimental",
  "stable",
  "deprecated",
  "retired",
] as const);

// ─── Certification vocabulary ───────────────────────────────────────────────

export const DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_CERTIFICATION_DOMAINS = Object.freeze([
  "identity",
  "dependency",
  "contracts",
  "pipeline",
  "determinism",
  "immutability",
  "trace",
  "termination",
  "execution",
  "compatibility",
  "architecture",
  "registry",
] as const);
export type DirectorRuntimeInteractionOrchestrationCertificationDomain =
  (typeof DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_CERTIFICATION_DOMAINS)[number];

export const DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_CERTIFICATION_STATUSES = Object.freeze([
  "certified",
  "rejected",
] as const);
export type DirectorRuntimeInteractionOrchestrationCertificationStatus =
  (typeof DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_CERTIFICATION_STATUSES)[number];

export const DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_COMPATIBILITY_STATUSES = Object.freeze([
  "compatible",
  "incompatible",
] as const);
export type DirectorRuntimeInteractionOrchestrationCompatibilityStatus =
  (typeof DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_COMPATIBILITY_STATUSES)[number];

export interface DirectorRuntimeInteractionOrchestrationCertificationCheck {
  readonly checkId: string;
  readonly domain: DirectorRuntimeInteractionOrchestrationCertificationDomain;
  readonly passed: boolean;
  readonly code: string;
}

export interface DirectorRuntimeInteractionOrchestrationCertificationReport {
  readonly certificationIdentity: typeof directorRuntimeInteractionOrchestrationFreezeIdentity;
  readonly platformIdentity: typeof directorRuntimeInteractionOrchestrationPlatformIdentity;
  readonly status: DirectorRuntimeInteractionOrchestrationCertificationStatus;
  readonly checks: readonly DirectorRuntimeInteractionOrchestrationCertificationCheck[];
  readonly passedCount: number;
  readonly failedCount: number;
  readonly certified: boolean;
  readonly compatibility: DirectorRuntimeInteractionOrchestrationCompatibilityStatus;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function check(
  checkId: string,
  domain: DirectorRuntimeInteractionOrchestrationCertificationDomain,
  passed: boolean,
  code: string,
): DirectorRuntimeInteractionOrchestrationCertificationCheck {
  return Object.freeze({ checkId, domain, passed, code });
}

function exactOrder(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

function stableJson(value: unknown): string {
  return JSON.stringify(value);
}

function targetId(target: { readonly id?: string } | null | undefined): string | null {
  if (target === null || target === undefined) return null;
  return typeof target.id === "string" ? target.id : null;
}

function fixtureState(input: {
  readonly focusedId?: string | null;
  readonly selectedId?: string | null;
}): DirectorRuntimeFocusSelectionState {
  return createDirectorRuntimeFocusSelectionState({
    focusedTarget: input.focusedId
      ? Object.freeze({ kind: "object" as const, id: input.focusedId })
      : null,
    selectedTarget: input.selectedId
      ? Object.freeze({ kind: "object" as const, id: input.selectedId })
      : null,
  });
}

function successInput(): DirectorRuntimeInteractionOrchestrationInput {
  return Object.freeze({
    requestId: "cert-interaction-17",
    observation: Object.freeze({
      interactionId: "ix-cert-17",
      kind: "select" as const,
      source: "object" as const,
      target: Object.freeze({ kind: "object" as const, id: "factory-01" }),
      sequence: 17,
      scope: "scene" as const,
    }),
    context: Object.freeze({
      sceneId: "executive-main",
      workspaceId: "workspace-1",
    }),
    currentState: fixtureState({ focusedId: "warehouse-01", selectedId: null }),
  });
}

function rejectedInput(): DirectorRuntimeInteractionOrchestrationInput {
  return Object.freeze({
    requestId: "cert-interaction-rejected",
    observation: Object.freeze({
      interactionId: "ix-cert-bad",
      kind: "select" as const,
      source: "object" as const,
      target: Object.freeze({ kind: "object" as const, id: "" }),
      sequence: 1,
      scope: "scene" as const,
    }),
    context: Object.freeze({ sceneId: "executive-main" }),
    currentState: fixtureState({}),
  });
}

function noopInput(): DirectorRuntimeInteractionOrchestrationInput {
  return Object.freeze({
    requestId: "cert-interaction-noop",
    observation: Object.freeze({
      interactionId: "ix-cert-noop",
      kind: "hover" as const,
      source: "system" as const,
      target: Object.freeze({ kind: "none" as const, id: "" }),
      sequence: 3,
      scope: "scene" as const,
    }),
    context: Object.freeze({ sceneId: "executive-main" }),
    currentState: createEmptyDirectorRuntimeFocusSelectionState(),
  });
}

function preserveInput(): DirectorRuntimeInteractionOrchestrationInput {
  return Object.freeze({
    requestId: "cert-interaction-preserve",
    observation: Object.freeze({
      interactionId: "ix-cert-preserve",
      kind: "focus" as const,
      source: "object" as const,
      target: Object.freeze({ kind: "object" as const, id: "factory-01" }),
      sequence: 5,
      scope: "scene" as const,
    }),
    context: Object.freeze({ sceneId: "executive-main" }),
    currentState: fixtureState({ focusedId: "factory-01", selectedId: "warehouse-01" }),
  });
}

function traceConsistent(result: DirectorRuntimeInteractionOrchestrationResult): boolean {
  const byPhase = Object.freeze(
    Object.fromEntries(result.trace.map((entry) => [entry.phase, entry])),
  ) as Readonly<Record<string, (typeof result.trace)[number]>>;

  if (byPhase.contract?.status === "rejected") {
    if (result.intent !== null) return false;
    if (result.transition !== null) return false;
    if (result.reactionPlan !== null) return false;
    if (result.execution !== null) return false;
  }
  if (byPhase["intent-resolution"]?.status === "stopped") {
    if (result.transition !== null) return false;
    if (result.reactionPlan !== null) return false;
    if (result.execution !== null) return false;
  }
  if (byPhase["focus-selection"]?.status === "skipped" && result.transition !== null) {
    return false;
  }
  if (byPhase["reaction-planning"]?.status === "skipped" && result.reactionPlan !== null) {
    return false;
  }
  if (byPhase.execution?.status === "skipped" && result.execution !== null) {
    return false;
  }
  if (byPhase.execution?.status === "completed" && result.execution === null) {
    return false;
  }
  return exactOrder(
    result.trace.map((entry) => entry.phase),
    DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_PHASES,
  );
}

function unsupportedProbePlan(
  base: NonNullable<DirectorRuntimeInteractionOrchestrationResult["reactionPlan"]>,
): DirectorRuntimeInteractionReactionPlan {
  return Object.freeze({
    planId: `${base.planId}:cert-unsupported`,
    intentId: base.intentId,
    requestId: base.requestId,
    intentKind: base.intentKind,
    transitionKind: base.transitionKind,
    changed: base.changed,
    hasWork: true,
    reactions: Object.freeze([
      ...base.reactions,
      Object.freeze({
        surface: "scene" as const,
        kind: "show-related-metrics" as const,
        target: Object.freeze({ kind: "object" as const, id: "factory-01" }),
        relatedTargetIds: Object.freeze([] as const),
        priority: "primary" as const,
        reason: "certification-unsupported-probe",
      }),
    ]),
  });
}

function conflictProbePlan(
  base: NonNullable<DirectorRuntimeInteractionOrchestrationResult["reactionPlan"]>,
): DirectorRuntimeInteractionReactionPlan {
  return Object.freeze({
    planId: `${base.planId}:cert-conflict`,
    intentId: base.intentId,
    requestId: base.requestId,
    intentKind: base.intentKind,
    transitionKind: base.transitionKind,
    changed: true,
    hasWork: true,
    reactions: Object.freeze([
      Object.freeze({
        surface: "scene" as const,
        kind: "emphasize-target" as const,
        target: Object.freeze({ kind: "object" as const, id: "factory-01" }),
        relatedTargetIds: Object.freeze([] as const),
        priority: "primary" as const,
        reason: "certification-conflict-a",
      }),
      Object.freeze({
        surface: "scene" as const,
        kind: "clear-context" as const,
        target: Object.freeze({ kind: "object" as const, id: "factory-01" }),
        relatedTargetIds: Object.freeze([] as const),
        priority: "primary" as const,
        reason: "certification-conflict-b",
      }),
    ]),
  });
}

// ─── Certification API ──────────────────────────────────────────────────────

export function certifyDirectorRuntimeInteractionOrchestrationPlatform():
DirectorRuntimeInteractionOrchestrationCertificationReport {
  const platform = directorRuntimeInteractionOrchestrationPlatform;
  const registry = directorRuntimeInteractionOrchestrationPlatformRegistry;
  const phases = DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_PHASES;

  const successA = orchestrateDirectorRuntimeInteraction(successInput());
  const successB = orchestrateDirectorRuntimeInteraction(successInput());
  const rejected = orchestrateDirectorRuntimeInteraction(rejectedInput());
  const noop = orchestrateDirectorRuntimeInteraction(noopInput());
  const preserve = orchestrateDirectorRuntimeInteraction(preserveInput());

  const observation = {
    interactionId: "ix-cert-mut",
    kind: "select" as const,
    source: "object" as const,
    target: { kind: "object" as const, id: "factory-01" },
    sequence: 9,
    scope: "scene" as const,
  };
  const context = { sceneId: "executive-main", workspaceId: "workspace-1" };
  const currentState = fixtureState({ focusedId: "warehouse-01", selectedId: null });
  const observationSnap = stableJson(observation);
  const contextSnap = stableJson(context);
  const stateSnap = stableJson(currentState);
  orchestrateDirectorRuntimeInteraction({
    requestId: "cert-interaction-mut",
    observation,
    context,
    currentState,
  });

  const unresolved = continueDirectorRuntimeInteractionOrchestrationAfterIntent({
    requestId: "cert-interaction-unresolved",
    observation: successA.observation,
    context: successA.context,
    currentState: successA.initialState,
    contract: successA.contract as AcceptedDirectorRuntimeInteractionContract,
    intent: Object.freeze({
      disposition: "unresolved" as const,
      reason: "unsupported-combination" as const,
      requestId: "cert-interaction-unresolved",
      matchedRuleIds: Object.freeze([] as const),
    }),
  });

  const focusSelectDistinct = successA.disposition === "completed" &&
    successA.transition !== null &&
    targetId(successA.finalState.focus.focusedTarget) === "warehouse-01" &&
    targetId(successA.finalState.selection.selectedTarget) === "factory-01";

  const partial = successA.reactionPlan !== null && successA.transition !== null &&
    successA.intent?.disposition === "resolved"
    ? continueDirectorRuntimeInteractionOrchestrationAfterReactionPlan({
      requestId: successA.requestId,
      observation: successA.observation,
      context: successA.context,
      currentState: successA.initialState,
      contract: successA.contract as AcceptedDirectorRuntimeInteractionContract,
      intent: successA.intent as ResolvedDirectorRuntimeInteractionIntent,
      transition: successA.transition,
      reactionPlan: unsupportedProbePlan(successA.reactionPlan),
    })
    : null;

  const rejectedExecution = successA.reactionPlan !== null && successA.transition !== null &&
    successA.intent?.disposition === "resolved"
    ? continueDirectorRuntimeInteractionOrchestrationAfterReactionPlan({
      requestId: successA.requestId,
      observation: successA.observation,
      context: successA.context,
      currentState: successA.initialState,
      contract: successA.contract as AcceptedDirectorRuntimeInteractionContract,
      intent: successA.intent as ResolvedDirectorRuntimeInteractionIntent,
      transition: successA.transition,
      reactionPlan: conflictProbePlan(successA.reactionPlan),
    })
    : null;

  const checks = Object.freeze([
    check(
      "platform-identity",
      "identity",
      platform.identity === "DRI-4:7/DirectorRuntimeInteractionOrchestrationPlatform" &&
        platform.name === "DirectorRuntimeInteractionOrchestrationPlatform" &&
        platform.phase === "DRI-4:7" &&
        platform.layer === "DirectorRuntimeInteractionOrchestration" &&
        platform.stage === "Platform",
      "platform-identity-match",
    ),
    check(
      "platform-version",
      "identity",
      platform.version === "4.7.0" &&
        platform.version === directorRuntimeInteractionOrchestrationPlatformVersion,
      "platform-version-match",
    ),
    check(
      "platform-namespace",
      "identity",
      platform.namespace === "nexora.dri.interaction.orchestration.platform" &&
        platform.namespace === directorRuntimeInteractionOrchestrationPlatformNamespace,
      "platform-namespace-match",
    ),
    check(
      "platform-dependency",
      "dependency",
      platform.immediateDependency === "DRI-4:6/DirectorRuntimeInteractionExecution" &&
        platform.immediateDependency ===
          directorRuntimeInteractionOrchestrationPlatformUpstream,
      "platform-dependency-linear",
    ),
    check(
      "freeze-dependency",
      "dependency",
      directorRuntimeInteractionOrchestrationFreezeUpstream ===
        directorRuntimeInteractionOrchestrationPlatformIdentity,
      "freeze-depends-on-platform",
    ),
    check(
      "conceptual-chain",
      "dependency",
      exactOrder(directorRuntimeInteractionOrchestrationFrozenIdentityChain.slice(0, 8), [
        "DRI-4:1/DirectorRuntimeInteractionOrchestrationFoundation",
        "DRI-4:2/DirectorRuntimeInteractionContracts",
        "DRI-4:3/DirectorRuntimeInteractionIntentResolution",
        "DRI-4:4/DirectorRuntimeFocusSelectionOrchestration",
        "DRI-4:5/DirectorRuntimeInteractionReactionPlanning",
        "DRI-4:6/DirectorRuntimeInteractionExecution",
        "DRI-4:7/DirectorRuntimeInteractionOrchestrationPlatform",
        "DRI-4:8/DirectorRuntimeInteractionOrchestrationFreeze",
      ]) &&
        directorRuntimeInteractionOrchestrationFrozenUpstreamAnchor ===
          "DRI-3:9/DirectorRuntimeSceneOrchestrationPublicIndex",
      "conceptual-chain-linear",
    ),
    check(
      "runtime-phase-count",
      "pipeline",
      phases.length === 6 && registry.platformPhaseCount === phases.length,
      "runtime-phase-count-six",
    ),
    check(
      "runtime-phase-order",
      "pipeline",
      exactOrder([...phases], [
        "foundation",
        "contract",
        "intent-resolution",
        "focus-selection",
        "reaction-planning",
        "execution",
      ]),
      "runtime-phase-order-canonical",
    ),
    check(
      "runtime-phase-unique",
      "pipeline",
      unique([...phases]),
      "runtime-phases-unique",
    ),
    check(
      "end-to-end-success",
      "pipeline",
      successA.disposition === "completed" &&
        successA.contract?.disposition === "accepted" &&
        successA.intent?.disposition === "resolved" &&
        successA.transition !== null &&
        successA.reactionPlan !== null &&
        successA.execution !== null &&
        isCompletedDirectorRuntimeInteractionOrchestration(successA),
      "end-to-end-completed",
    ),
    check(
      "contract-rejection-termination",
      "termination",
      rejected.disposition === "rejected" &&
        rejected.terminationPhase === "contract" &&
        rejected.intent === null &&
        rejected.transition === null &&
        rejected.reactionPlan === null &&
        rejected.execution === null &&
        isRejectedDirectorRuntimeInteractionOrchestration(rejected),
      "contract-rejection-stops",
    ),
    check(
      "unresolved-intent-termination",
      "termination",
      unresolved.disposition === "stopped" &&
        unresolved.terminationPhase === "intent-resolution" &&
        unresolved.transition === null &&
        unresolved.reactionPlan === null &&
        unresolved.execution === null &&
        isStoppedDirectorRuntimeInteractionOrchestration(unresolved),
      "unresolved-intent-stops",
    ),
    check(
      "noop-path",
      "contracts",
      noop.disposition === "completed" &&
        noop.contract?.disposition === "accepted" &&
        noop.intent?.disposition === "resolved" &&
        (noop.intent.disposition === "resolved"
          ? noop.intent.intent.kind === "no-op"
          : false),
      "noop-not-rejection",
    ),
    check(
      "preserve-transition",
      "pipeline",
      preserve.disposition === "completed" &&
        preserve.transition !== null &&
        preserve.transition.changed === false &&
        targetId(preserve.finalState.focus.focusedTarget) === "factory-01" &&
        targetId(preserve.finalState.selection.selectedTarget) === "warehouse-01" &&
        targetId(preserve.initialState.focus.focusedTarget) ===
          targetId(preserve.finalState.focus.focusedTarget) &&
        targetId(preserve.initialState.selection.selectedTarget) ===
          targetId(preserve.finalState.selection.selectedTarget),
      "unchanged-focus-idempotent",
    ),
    check(
      "focus-selection-separation",
      "contracts",
      focusSelectDistinct,
      "focus-not-equal-selection",
    ),
    check(
      "determinism-result",
      "determinism",
      stableJson(successA) === stableJson(successB),
      "result-replay-equivalent",
    ),
    check(
      "determinism-trace",
      "determinism",
      stableJson(successA.trace) === stableJson(successB.trace),
      "trace-replay-equivalent",
    ),
    check(
      "immutability-observation",
      "immutability",
      stableJson(observation) === observationSnap,
      "observation-not-mutated",
    ),
    check(
      "immutability-context",
      "immutability",
      stableJson(context) === contextSnap,
      "context-not-mutated",
    ),
    check(
      "immutability-state",
      "immutability",
      stableJson(currentState) === stateSnap,
      "current-state-not-mutated",
    ),
    check(
      "immutability-vocabularies",
      "immutability",
      Object.isFrozen(phases) &&
        Object.isFrozen(DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_DISPOSITIONS) &&
        Object.isFrozen(DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_TRACE_STATUSES) &&
        Object.isFrozen(platform) &&
        Object.isFrozen(registry),
      "public-structures-frozen",
    ),
    check(
      "reaction-semantic",
      "execution",
      successA.reactionPlan !== null &&
        successA.reactionPlan.reactions.every((directive) =>
          typeof directive.surface === "string" &&
          typeof directive.kind === "string" &&
          typeof directive.priority === "string") &&
        successA.reactionPlan.hasWork === true,
      "reaction-plan-semantic",
    ),
    check(
      "reaction-order-deterministic",
      "determinism",
      successA.reactionPlan !== null &&
        successB.reactionPlan !== null &&
        stableJson(successA.reactionPlan.reactions) ===
          stableJson(successB.reactionPlan.reactions),
      "reaction-order-stable",
    ),
    check(
      "execution-order-deterministic",
      "determinism",
      successA.execution !== null &&
        successB.execution !== null &&
        stableJson(successA.execution.directives) ===
          stableJson(successB.execution.directives),
      "execution-order-stable",
    ),
    check(
      "partial-execution-visible",
      "execution",
      partial !== null &&
        partial.disposition === "completed" &&
        partial.execution !== null &&
        partial.execution.unsupportedCount > 0 &&
        (partial.execution.status === "partial" ||
          partial.execution.directives.some((entry) => entry.status === "unsupported")),
      "partial-execution-preserved",
    ),
    check(
      "rejected-execution-visible",
      "execution",
      rejectedExecution !== null &&
        rejectedExecution.disposition === "completed" &&
        rejectedExecution.execution?.status === "rejected" &&
        (rejectedExecution.execution.rejectedCount ?? 0) > 0,
      "rejected-execution-preserved",
    ),
    check(
      "execution-count-derivation",
      "execution",
      successA.execution !== null &&
        successA.execution.executedCount +
          successA.execution.skippedCount +
          successA.execution.rejectedCount +
          successA.execution.unsupportedCount ===
          successA.execution.directives.length,
      "execution-counts-derived",
    ),
    check(
      "trace-success-order",
      "trace",
      exactOrder(
        successA.trace.map((entry) => entry.phase),
        [...phases],
      ) &&
        successA.trace.every((entry) => entry.status === "completed"),
      "trace-success-canonical",
    ),
    check(
      "trace-rejection",
      "trace",
      rejected.trace[0]?.status === "completed" &&
        rejected.trace[1]?.status === "rejected" &&
        rejected.trace.slice(2).every((entry) => entry.status === "skipped"),
      "trace-rejection-skipped",
    ),
    check(
      "trace-unresolved",
      "trace",
      unresolved.trace[0]?.status === "completed" &&
        unresolved.trace[1]?.status === "completed" &&
        unresolved.trace[2]?.status === "stopped" &&
        unresolved.trace.slice(3).every((entry) => entry.status === "skipped"),
      "trace-unresolved-skipped",
    ),
    check(
      "trace-immutable",
      "trace",
      Object.isFrozen(successA.trace) && Object.isFrozen(successA.trace[0]),
      "trace-frozen",
    ),
    check(
      "trace-result-consistency",
      "trace",
      traceConsistent(successA) &&
        traceConsistent(rejected) &&
        traceConsistent(unresolved) &&
        traceConsistent(noop) &&
        traceConsistent(preserve),
      "trace-result-consistent",
    ),
    check(
      "final-state-authority",
      "pipeline",
      successA.transition !== null &&
        successA.finalState === successA.transition.nextState &&
        preserve.transition !== null &&
        preserve.finalState === preserve.transition.nextState,
      "final-state-is-transition-next",
    ),
    check(
      "identity-propagation",
      "identity",
      successA.intent?.disposition === "resolved" &&
        successA.reactionPlan !== null &&
        successA.execution !== null &&
        successA.intent.intent.requestId === successA.requestId &&
        successA.reactionPlan.requestId === successA.requestId &&
        successA.reactionPlan.intentId === successA.intent.intent.intentId &&
        successA.execution.requestId === successA.requestId &&
        successA.execution.intentId === successA.intent.intent.intentId &&
        successA.execution.planId === successA.reactionPlan.planId &&
        successA.platformRunId === `${successA.requestId}:platform`,
      "provenance-chain-intact",
    ),
    check(
      "platform-verify",
      "registry",
      verifyDirectorRuntimeInteractionOrchestrationPlatform() === true,
      "platform-verify-true",
    ),
    check(
      "registry-counts",
      "registry",
      registry.platformPhaseCount === phases.length &&
        registry.platformDispositionCount ===
          DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_DISPOSITIONS.length &&
        registry.traceStatusCount ===
          DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_TRACE_STATUSES.length &&
        registry.publicApiCount ===
          directorRuntimeInteractionOrchestrationPlatformApiNames.length &&
        registry.publicTypeCount ===
          directorRuntimeInteractionOrchestrationPlatformTypeNames.length,
      "registry-counts-derived",
    ),
    check(
      "architecture-purity-platform",
      "architecture",
      platform.philosophy === "platform-is-composition-of-existing-semantics" &&
        isDirectorRuntimeInteractionOrchestrationResult(successA),
      "platform-composition-only",
    ),
    check(
      "compatibility-ready",
      "compatibility",
      directorRuntimeInteractionOrchestrationFreezeCompatibility.status === "compatible" &&
        directorRuntimeInteractionOrchestrationFreezeCompatibility.upstreamIdentity ===
          directorRuntimeInteractionOrchestrationPlatformIdentity,
      "compatibility-compatible",
    ),
  ] as const);

  const passedCount = checks.filter((entry) => entry.passed).length;
  const failedCount = checks.length - passedCount;
  const certified = failedCount === 0;
  const status: DirectorRuntimeInteractionOrchestrationCertificationStatus = certified
    ? "certified"
    : "rejected";
  const compatibility: DirectorRuntimeInteractionOrchestrationCompatibilityStatus = certified
    ? "compatible"
    : "incompatible";

  return Object.freeze({
    certificationIdentity: directorRuntimeInteractionOrchestrationFreezeIdentity,
    platformIdentity: directorRuntimeInteractionOrchestrationPlatformIdentity,
    status,
    checks,
    passedCount,
    failedCount,
    certified,
    compatibility,
  });
}

// ─── Frozen lineage / surfaces ──────────────────────────────────────────────

export const directorRuntimeInteractionOrchestrationFrozenUpstreamAnchor =
  "DRI-3:9/DirectorRuntimeSceneOrchestrationPublicIndex" as const;

export const directorRuntimeInteractionOrchestrationFrozenIdentityChain = Object.freeze([
  "DRI-4:1/DirectorRuntimeInteractionOrchestrationFoundation",
  "DRI-4:2/DirectorRuntimeInteractionContracts",
  "DRI-4:3/DirectorRuntimeInteractionIntentResolution",
  "DRI-4:4/DirectorRuntimeFocusSelectionOrchestration",
  "DRI-4:5/DirectorRuntimeInteractionReactionPlanning",
  "DRI-4:6/DirectorRuntimeInteractionExecution",
  "DRI-4:7/DirectorRuntimeInteractionOrchestrationPlatform",
  "DRI-4:8/DirectorRuntimeInteractionOrchestrationFreeze",
] as const);

export interface DirectorRuntimeInteractionOrchestrationFrozenPublicExport {
  readonly exportName: string;
  readonly exportKind: "value" | "type" | "api" | "predicate" | "registry" | "metadata";
}

export const directorRuntimeInteractionOrchestrationFrozenPublicApiSurface = Object.freeze([
  ["directorRuntimeInteractionOrchestrationPlatformIdentity", "metadata"],
  ["directorRuntimeInteractionOrchestrationPlatformNamespace", "metadata"],
  ["directorRuntimeInteractionOrchestrationPlatformVersion", "metadata"],
  ["directorRuntimeInteractionOrchestrationPlatformUpstream", "metadata"],
  ["DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_PHASES", "value"],
  ["DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_DISPOSITIONS", "value"],
  ["DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_TRACE_STATUSES", "value"],
  ["DirectorRuntimeInteractionOrchestrationInput", "type"],
  ["DirectorRuntimeInteractionOrchestrationResult", "type"],
  ["DirectorRuntimeFocusSelectionState", "type"],
  ["DirectorRuntimeInteractionReactionPlan", "type"],
  ["DirectorRuntimeInteractionExecutionResult", "type"],
  ["directorRuntimeInteractionOrchestrationPlatformApiNames", "value"],
  ["directorRuntimeInteractionOrchestrationPlatformTypeNames", "value"],
  ["directorRuntimeInteractionOrchestrationPlatformRegistry", "registry"],
  ["directorRuntimeInteractionOrchestrationPlatform", "value"],
  ["createDirectorRuntimeInteractionOrchestrationInput", "api"],
  ["orchestrateDirectorRuntimeInteraction", "api"],
  ["createDirectorRuntimeFocusSelectionState", "api"],
  ["createEmptyDirectorRuntimeFocusSelectionState", "api"],
  ["isDirectorRuntimeInteractionOrchestrationResult", "predicate"],
  ["isCompletedDirectorRuntimeInteractionOrchestration", "predicate"],
  ["isRejectedDirectorRuntimeInteractionOrchestration", "predicate"],
  ["isStoppedDirectorRuntimeInteractionOrchestration", "predicate"],
  ["verifyDirectorRuntimeInteractionOrchestrationPlatform", "api"],
  ["certifyDirectorRuntimeInteractionOrchestrationPlatform", "api"],
  ["verifyDirectorRuntimeInteractionOrchestrationFreeze", "api"],
  ["directorRuntimeInteractionOrchestrationLock", "metadata"],
  ["directorRuntimeInteractionOrchestrationPlatformLock", "metadata"],
  ["directorRuntimeInteractionOrchestrationFreezeCompatibility", "metadata"],
  ["directorRuntimeInteractionOrchestrationFreezeRegistry", "registry"],
].map(([exportName, exportKind]) => Object.freeze({ exportName, exportKind })) as
  readonly DirectorRuntimeInteractionOrchestrationFrozenPublicExport[]);

export const directorRuntimeInteractionOrchestrationFrozenPublicApiCount =
  directorRuntimeInteractionOrchestrationFrozenPublicApiSurface.length;

export const directorRuntimeInteractionOrchestrationFrozenPublicTypeNames = Object.freeze(
  directorRuntimeInteractionOrchestrationFrozenPublicApiSurface
    .filter(({ exportKind }) => exportKind === "type")
    .map(({ exportName }) => exportName),
);

export const directorRuntimeInteractionOrchestrationFrozenFunctionalApiNames = Object.freeze(
  directorRuntimeInteractionOrchestrationFrozenPublicApiSurface
    .filter(({ exportKind }) => exportKind === "api" || exportKind === "predicate")
    .map(({ exportName }) => exportName),
);

export const directorRuntimeInteractionOrchestrationFrozenExports = Object.freeze([
  ...directorRuntimeInteractionOrchestrationFrozenPublicApiSurface.map(
    ({ exportName }) => exportName,
  ),
] as const);

export const directorRuntimeInteractionOrchestrationFreezeGuarantees = Object.freeze([
  "platform-surface-frozen",
  "certification-authority-preserved",
  "pipeline-semantics-preserved",
  "focus-selection-separation-preserved",
  "reaction-planning-preserved",
  "execution-truth-preserved",
  "trace-consistency-preserved",
  "determinism-preserved",
  "immutability-preserved",
  "lineage-preserved",
  "identity-preserved",
  "renderer-independent",
  "business-policy-independent",
  "no-scene-mutation",
  "ready-for-public-index",
] as const);

export const directorRuntimeInteractionOrchestrationFreezeCompatibility = Object.freeze({
  phase: "DRI-4" as const,
  driVersion: "4.8.0" as const,
  platformVersion: directorRuntimeInteractionOrchestrationPlatformVersion,
  freezeVersion: directorRuntimeInteractionOrchestrationFreezeVersion,
  upstreamIdentity: directorRuntimeInteractionOrchestrationPlatformIdentity,
  upstreamCompatibility: "compatible" as const,
  consumerCompatibility: "compatible" as const,
  status: "compatible" as const,
  capability: "DirectorRuntimeInteractionOrchestration" as const,
  renderingSupported: false as const,
  readyForPublicIndex: true as const,
});

export const directorRuntimeInteractionOrchestrationFreezeConsumerRules = Object.freeze([
  "consume DRI-4 through DRI-4:9 Public Index",
  "do not directly import DRI-4:1 through DRI-4:7 implementation modules",
  "do not import Freeze as a normal application service",
  "do not mutate exported registries or certification reports",
  "do not reinterpret certification or freeze status",
  "do not invent new interaction semantics through DRI-4",
  "do not infer renderer instructions from frozen APIs",
  "do not use DRI-4 for KPI or business calculation",
  "preserve caller identities and collection order",
  "use supported verification APIs",
] as const);

export const directorRuntimeInteractionOrchestrationFreezeReleaseInformation = Object.freeze({
  releaseStatus: "released" as const,
  stability: "stable" as const,
  freezeStatus: "Frozen" as const,
  certificationStatus: "Certified" as const,
  readiness: "ReadyForPublicIndex" as const,
  consumerEntry: "pending DRI-4:9" as const,
  breakingChangesAllowedWithinDri4: false as const,
  rendering: "unsupported" as const,
  role: "FrozenUpstreamForPublicIndex" as const,
  publicIndex: false as const,
  soleConsumerEntryPoint: false as const,
  finalConsumerEntry: false as const,
  readyForConsumer: false as const,
});

export interface DirectorRuntimeInteractionOrchestrationFreezeManifest {
  readonly freezeId: typeof directorRuntimeInteractionOrchestrationFreezeIdentity;
  readonly platformId: typeof directorRuntimeInteractionOrchestrationPlatformIdentity;
  readonly version: typeof directorRuntimeInteractionOrchestrationFreezeVersion;
  readonly namespace: typeof directorRuntimeInteractionOrchestrationFreezeNamespace;
  readonly layer: "DirectorRuntimeInteractionOrchestration";
  readonly phase: "DRI-4";
  readonly stage: "CertificationAndFreeze";
  readonly status: DirectorRuntimeInteractionOrchestrationFreezeStatus;
  readonly certificationStatus: "Certified" | "Rejected";
  readonly readiness: DirectorRuntimeInteractionOrchestrationFreezeReadiness;
  readonly lock: typeof directorRuntimeInteractionOrchestrationLock;
  readonly frozen: true;
  readonly releaseStatus: (typeof DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_RELEASE_STATUSES)[number];
  readonly stabilityStatus:
    (typeof DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_STABILITY_STATUSES)[number];
  readonly publicApiSurface: readonly string[];
  readonly guarantees: typeof directorRuntimeInteractionOrchestrationFreezeGuarantees;
}

export const directorRuntimeInteractionOrchestrationFreezeManifest = Object.freeze({
  freezeId: directorRuntimeInteractionOrchestrationFreezeIdentity,
  platformId: directorRuntimeInteractionOrchestrationPlatformIdentity,
  version: directorRuntimeInteractionOrchestrationFreezeVersion,
  namespace: directorRuntimeInteractionOrchestrationFreezeNamespace,
  layer: "DirectorRuntimeInteractionOrchestration" as const,
  phase: "DRI-4" as const,
  stage: "CertificationAndFreeze" as const,
  status: "Frozen" as const,
  certificationStatus: "Certified" as const,
  readiness: "ReadyForPublicIndex" as const,
  lock: directorRuntimeInteractionOrchestrationLock,
  frozen: true as const,
  releaseStatus: "released" as const,
  stabilityStatus: "stable" as const,
  publicApiSurface: Object.freeze(
    directorRuntimeInteractionOrchestrationFrozenPublicApiSurface.map(
      ({ exportName }) => exportName,
    ),
  ),
  guarantees: directorRuntimeInteractionOrchestrationFreezeGuarantees,
}) satisfies DirectorRuntimeInteractionOrchestrationFreezeManifest;

export const directorRuntimeInteractionOrchestrationPublicIndexReadiness = Object.freeze({
  nextStageId: "DRI-4:9/DirectorRuntimeInteractionOrchestrationPublicIndex" as const,
  readyForPublicIndex: true as const,
  role: "FrozenUpstreamForPublicIndex" as const,
  publicIndex: false as const,
  soleConsumerEntryPoint: false as const,
  readyForConsumer: false as const,
});

export const directorRuntimeInteractionOrchestrationFreezeRegistry = Object.freeze({
  certificationDomains: DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_CERTIFICATION_DOMAINS,
  certificationDomainCount:
    DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_CERTIFICATION_DOMAINS.length,
  certificationStatuses: DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_CERTIFICATION_STATUSES,
  certificationStatusCount:
    DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_CERTIFICATION_STATUSES.length,
  compatibilityStatuses: DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_COMPATIBILITY_STATUSES,
  compatibilityStatusCount:
    DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_COMPATIBILITY_STATUSES.length,
  freezeStates: DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_FREEZE_STATES,
  freezeStateCount: DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_FREEZE_STATES.length,
  freezeStatuses: DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_FREEZE_STATUSES,
  freezeStatusCount: DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_FREEZE_STATUSES.length,
  identityChain: directorRuntimeInteractionOrchestrationFrozenIdentityChain,
  identityChainCount: directorRuntimeInteractionOrchestrationFrozenIdentityChain.length,
  publicApiSurface: directorRuntimeInteractionOrchestrationFrozenPublicApiSurface,
  publicApiCount: directorRuntimeInteractionOrchestrationFrozenPublicApiCount,
  frozenExports: directorRuntimeInteractionOrchestrationFrozenExports,
  frozenExportCount: directorRuntimeInteractionOrchestrationFrozenExports.length,
  functionalApiNames: directorRuntimeInteractionOrchestrationFrozenFunctionalApiNames,
  functionalApiCount: directorRuntimeInteractionOrchestrationFrozenFunctionalApiNames.length,
  publicTypeNames: directorRuntimeInteractionOrchestrationFrozenPublicTypeNames,
  publicTypeCount: directorRuntimeInteractionOrchestrationFrozenPublicTypeNames.length,
  platformPhases: DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_PHASES,
  platformPhaseCount: DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_PHASES.length,
  guarantees: directorRuntimeInteractionOrchestrationFreezeGuarantees,
  guaranteeCount: directorRuntimeInteractionOrchestrationFreezeGuarantees.length,
  consumerRules: directorRuntimeInteractionOrchestrationFreezeConsumerRules,
  consumerRuleCount: directorRuntimeInteractionOrchestrationFreezeConsumerRules.length,
  lock: directorRuntimeInteractionOrchestrationLock,
  freezeStatus: "Frozen" as const,
  immediateDependency: directorRuntimeInteractionOrchestrationFreezeUpstream,
});

export function verifyDirectorRuntimeInteractionOrchestrationFreeze(
  artifact: typeof directorRuntimeInteractionOrchestrationFreeze =
    directorRuntimeInteractionOrchestrationFreeze,
): boolean {
  const certification = certifyDirectorRuntimeInteractionOrchestrationPlatform();
  const manifest = artifact.manifest;
  const registry = artifact.registry;

  return (
    artifact.identity === "DRI-4:8/DirectorRuntimeInteractionOrchestrationFreeze" &&
    artifact.version === "4.8.0" &&
    artifact.namespace === "nexora.dri.interaction.orchestration.freeze" &&
    artifact.immediateDependency ===
      "DRI-4:7/DirectorRuntimeInteractionOrchestrationPlatform" &&
    artifact.upstream === directorRuntimeInteractionOrchestrationPlatformIdentity &&
    artifact.stage === "CertificationAndFreeze" &&
    artifact.status === "Frozen" &&
    artifact.certificationStatus === "Certified" &&
    artifact.state === "frozen" &&
    artifact.readiness === "ReadyForPublicIndex" &&
    artifact.frozen === true &&
    artifact.lock.lockId === directorRuntimeInteractionOrchestrationLock &&
    artifact.lock.locked === true &&
    manifest.lock === directorRuntimeInteractionOrchestrationLock &&
    manifest.status === "Frozen" &&
    manifest.certificationStatus === "Certified" &&
    manifest.readiness === "ReadyForPublicIndex" &&
    manifest.platformId === directorRuntimeInteractionOrchestrationPlatformIdentity &&
    certification.status === "certified" &&
    certification.certified === true &&
    certification.failedCount === 0 &&
    certification.passedCount === certification.checks.length &&
    certification.compatibility === "compatible" &&
    artifact.compatibility.status === "compatible" &&
    registry.certificationDomainCount ===
      DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_CERTIFICATION_DOMAINS.length &&
    registry.publicApiCount ===
      directorRuntimeInteractionOrchestrationFrozenPublicApiSurface.length &&
    registry.frozenExportCount ===
      directorRuntimeInteractionOrchestrationFrozenExports.length &&
    registry.platformPhaseCount === 6 &&
    registry.immediateDependency ===
      directorRuntimeInteractionOrchestrationPlatformIdentity &&
    unique(registry.publicApiSurface.map(({ exportName }) => exportName)) &&
    exactOrder(
      [...artifact.identityChain],
      [...directorRuntimeInteractionOrchestrationFrozenIdentityChain],
    ) &&
    artifact.releaseInformation.soleConsumerEntryPoint === false &&
    artifact.releaseInformation.publicIndex === false &&
    artifact.releaseInformation.readyForConsumer === false &&
    artifact.publicIndexReadiness.nextStageId ===
      "DRI-4:9/DirectorRuntimeInteractionOrchestrationPublicIndex" &&
    artifact.platform === directorRuntimeInteractionOrchestrationPlatform &&
    orchestrateDirectorRuntimeInteraction ===
      artifact.frozenApis.orchestrateDirectorRuntimeInteraction &&
    verifyDirectorRuntimeInteractionOrchestrationPlatform ===
      artifact.frozenApis.verifyDirectorRuntimeInteractionOrchestrationPlatform &&
    Object.isFrozen(artifact) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(directorRuntimeInteractionOrchestrationFrozenPublicApiSurface)
  );
}

export const directorRuntimeInteractionOrchestrationFreeze = Object.freeze({
  phase: "DRI-4:8" as const,
  name: "DirectorRuntimeInteractionOrchestrationFreeze" as const,
  identity: directorRuntimeInteractionOrchestrationFreezeIdentity,
  namespace: directorRuntimeInteractionOrchestrationFreezeNamespace,
  version: directorRuntimeInteractionOrchestrationFreezeVersion,
  layer: "DirectorRuntimeInteractionOrchestration" as const,
  capability: "DirectorRuntimeInteractionOrchestration" as const,
  stage: "CertificationAndFreeze" as const,
  immediateDependency: directorRuntimeInteractionOrchestrationFreezeUpstream,
  upstream: directorRuntimeInteractionOrchestrationPlatformIdentity,
  state: "frozen" as const,
  status: "Frozen" as const,
  certificationStatus: "Certified" as const,
  stability: "stable" as const,
  readiness: "ReadyForPublicIndex" as const,
  lock: directorRuntimeInteractionOrchestrationPlatformLock,
  lockId: directorRuntimeInteractionOrchestrationLock,
  frozen: true as const,
  platform: directorRuntimeInteractionOrchestrationPlatform,
  manifest: directorRuntimeInteractionOrchestrationFreezeManifest,
  identityChain: directorRuntimeInteractionOrchestrationFrozenIdentityChain,
  guarantees: directorRuntimeInteractionOrchestrationFreezeGuarantees,
  publicApiSurface: directorRuntimeInteractionOrchestrationFrozenPublicApiSurface,
  frozenExports: directorRuntimeInteractionOrchestrationFrozenExports,
  compatibility: directorRuntimeInteractionOrchestrationFreezeCompatibility,
  consumerRules: directorRuntimeInteractionOrchestrationFreezeConsumerRules,
  releaseInformation: directorRuntimeInteractionOrchestrationFreezeReleaseInformation,
  publicIndexReadiness: directorRuntimeInteractionOrchestrationPublicIndexReadiness,
  platformPhases: DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_PHASES,
  certificationDomains: DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_CERTIFICATION_DOMAINS,
  certificationStatuses: DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_CERTIFICATION_STATUSES,
  compatibilityStatuses: DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_COMPATIBILITY_STATUSES,
  frozenApis: Object.freeze({
    createDirectorRuntimeInteractionOrchestrationInput,
    orchestrateDirectorRuntimeInteraction,
    createDirectorRuntimeFocusSelectionState,
    createEmptyDirectorRuntimeFocusSelectionState,
    isDirectorRuntimeInteractionOrchestrationResult,
    isCompletedDirectorRuntimeInteractionOrchestration,
    isRejectedDirectorRuntimeInteractionOrchestration,
    isStoppedDirectorRuntimeInteractionOrchestration,
    verifyDirectorRuntimeInteractionOrchestrationPlatform,
    certifyDirectorRuntimeInteractionOrchestrationPlatform,
  }),
  registry: directorRuntimeInteractionOrchestrationFreezeRegistry,
});

/** Canonical freeze verification against the published Freeze artifact. */
export const directorRuntimeInteractionOrchestrationFreezeVerification =
  verifyDirectorRuntimeInteractionOrchestrationFreeze();

