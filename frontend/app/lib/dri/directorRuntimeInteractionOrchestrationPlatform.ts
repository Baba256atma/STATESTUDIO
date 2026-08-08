/**
 * DRI-4:7 — Director Runtime Interaction Orchestration Platform.
 *
 * Assembles DRI-4:1 through DRI-4:6 into one canonical end-to-end interaction
 * orchestration pipeline. Composition only — no new interaction semantics.
 */

import {
  createDirectorRuntimeFocusSelectionState,
  createDirectorRuntimeInteractionContext,
  directorRuntimeInteractionExecutionIdentity,
  evaluateDirectorRuntimeInteractionContract,
  executeDirectorRuntimeInteraction,
  isAcceptedDirectorRuntimeInteractionContract,
  isDirectorRuntimeFocusSelectionState,
  isDirectorRuntimeInteractionExecutionResult,
  isRejectedDirectorRuntimeInteractionContract,
  isResolvedDirectorRuntimeInteractionIntent,
  isUnresolvedDirectorRuntimeInteractionIntent,
  orchestrateDirectorRuntimeFocusSelection,
  planDirectorRuntimeInteractionReaction,
  resolveDirectorRuntimeInteractionIntent,
  type AcceptedDirectorRuntimeInteractionContract,
  type CreateDirectorRuntimeInteractionContextInput,
  type CreateDirectorRuntimeInteractionRequestInput,
  type DirectorInteractionObservation,
  type DirectorRuntimeFocusSelectionState,
  type DirectorRuntimeFocusSelectionTransition,
  type DirectorRuntimeInteractionContractResult,
  type DirectorRuntimeInteractionExecutionResult,
  type DirectorRuntimeInteractionIntentResolutionResult,
  type DirectorRuntimeInteractionReactionPlan,
  type RejectedDirectorRuntimeInteractionContract,
  type ResolvedDirectorRuntimeInteractionIntent,
  type UnresolvedDirectorRuntimeInteractionIntent,
} from "@/app/lib/dri/directorRuntimeInteractionExecution";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeInteractionOrchestrationPlatformIdentity =
  "DRI-4:7/DirectorRuntimeInteractionOrchestrationPlatform" as const;
export const directorRuntimeInteractionOrchestrationPlatformVersion = "4.7.0" as const;
export const directorRuntimeInteractionOrchestrationPlatformNamespace =
  "nexora.dri.interaction.orchestration.platform" as const;
export const directorRuntimeInteractionOrchestrationPlatformUpstream =
  directorRuntimeInteractionExecutionIdentity;

// ─── Platform vocabularies ──────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_PHASES = Object.freeze([
  "foundation",
  "contract",
  "intent-resolution",
  "focus-selection",
  "reaction-planning",
  "execution",
] as const);
export type DirectorRuntimeInteractionOrchestrationPlatformPhase =
  (typeof DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_PHASES)[number];

export const DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_DISPOSITIONS = Object.freeze([
  "completed",
  "stopped",
  "rejected",
] as const);
export type DirectorRuntimeInteractionOrchestrationPlatformDisposition =
  (typeof DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_DISPOSITIONS)[number];

export const DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_TRACE_STATUSES = Object.freeze([
  "completed",
  "skipped",
  "stopped",
  "rejected",
] as const);
export type DirectorRuntimeInteractionOrchestrationTraceStatus =
  (typeof DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_TRACE_STATUSES)[number];

// ─── Contracts ──────────────────────────────────────────────────────────────

export type DirectorRuntimeInteractionOrchestrationInput = Readonly<{
  requestId: string;
  observation: CreateDirectorRuntimeInteractionRequestInput["observation"];
  context?: CreateDirectorRuntimeInteractionContextInput;
  currentState: DirectorRuntimeFocusSelectionState;
  contractVersion?: string;
}>;

export interface DirectorRuntimeInteractionOrchestrationPhaseTraceEntry {
  readonly phase: DirectorRuntimeInteractionOrchestrationPlatformPhase;
  readonly status: DirectorRuntimeInteractionOrchestrationTraceStatus;
  readonly inputRef: string | null;
  readonly outputRef: string | null;
  readonly reason: string | null;
}

export type DirectorRuntimeInteractionOrchestrationTrace =
  readonly DirectorRuntimeInteractionOrchestrationPhaseTraceEntry[];

export interface DirectorRuntimeInteractionOrchestrationResult {
  readonly platformRunId: string;
  readonly requestId: string;
  readonly disposition: DirectorRuntimeInteractionOrchestrationPlatformDisposition;
  readonly terminationPhase: DirectorRuntimeInteractionOrchestrationPlatformPhase | null;
  readonly reason: string | null;
  readonly observation: DirectorInteractionObservation | null;
  readonly context: ReturnType<typeof createDirectorRuntimeInteractionContext>;
  readonly initialState: DirectorRuntimeFocusSelectionState;
  readonly contract: DirectorRuntimeInteractionContractResult | null;
  readonly intent: DirectorRuntimeInteractionIntentResolutionResult | null;
  readonly transition: DirectorRuntimeFocusSelectionTransition | null;
  readonly reactionPlan: DirectorRuntimeInteractionReactionPlan | null;
  readonly execution: DirectorRuntimeInteractionExecutionResult | null;
  readonly finalState: DirectorRuntimeFocusSelectionState;
  readonly trace: DirectorRuntimeInteractionOrchestrationTrace;
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

function cloneFocusSelectionState(
  state: DirectorRuntimeFocusSelectionState,
): DirectorRuntimeFocusSelectionState {
  return createDirectorRuntimeFocusSelectionState({
    focusedTarget: state.focus.focusedTarget,
    selectedTarget: state.selection.selectedTarget,
    sequence: state.sequence,
    intentId: state.intentId,
    requestId: state.requestId,
  });
}

function traceEntry(input: {
  readonly phase: DirectorRuntimeInteractionOrchestrationPlatformPhase;
  readonly status: DirectorRuntimeInteractionOrchestrationTraceStatus;
  readonly inputRef?: string | null;
  readonly outputRef?: string | null;
  readonly reason?: string | null;
}): DirectorRuntimeInteractionOrchestrationPhaseTraceEntry {
  return Object.freeze({
    phase: input.phase,
    status: input.status,
    inputRef: input.inputRef ?? null,
    outputRef: input.outputRef ?? null,
    reason: input.reason ?? null,
  });
}

function buildTrace(
  entries: readonly DirectorRuntimeInteractionOrchestrationPhaseTraceEntry[],
): DirectorRuntimeInteractionOrchestrationTrace {
  const byPhase = new Map(entries.map((entry) => [entry.phase, entry]));
  return Object.freeze(
    DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_PHASES.map((phase) => {
      const existing = byPhase.get(phase);
      if (existing !== undefined) return existing;
      return traceEntry({ phase, status: "skipped" });
    }),
  );
}

function freezeResult(
  result: DirectorRuntimeInteractionOrchestrationResult,
): DirectorRuntimeInteractionOrchestrationResult {
  return Object.freeze({
    ...result,
    context: Object.freeze({ ...result.context }),
    initialState: cloneFocusSelectionState(result.initialState),
    // Preserve DRI-4:4 transition.nextState identity when present.
    finalState: result.finalState,
    trace: Object.freeze([...result.trace].map((entry) => Object.freeze({ ...entry }))),
  });
}

// ─── Input construction ─────────────────────────────────────────────────────

export function createDirectorRuntimeInteractionOrchestrationInput(
  input: DirectorRuntimeInteractionOrchestrationInput,
): DirectorRuntimeInteractionOrchestrationInput {
  if (!isPlainObject(input)) {
    throw new TypeError("platform input must be a plain object");
  }
  if (!isNonEmptyString(input.requestId)) {
    throw new TypeError("requestId must be a non-empty opaque identifier");
  }
  if (!isDirectorRuntimeFocusSelectionState(input.currentState)) {
    throw new TypeError("currentState must be a focus/selection state");
  }
  if (input.observation === undefined || input.observation === null) {
    throw new TypeError("observation is required");
  }
  const context = createDirectorRuntimeInteractionContext(input.context ?? {});
  const currentState = cloneFocusSelectionState(input.currentState);
  return Object.freeze({
    requestId: input.requestId,
    observation: Object.freeze(
      isPlainObject(input.observation)
        ? { ...input.observation }
        : input.observation,
    ) as DirectorRuntimeInteractionOrchestrationInput["observation"],
    context,
    currentState,
    ...(input.contractVersion === undefined
      ? {}
      : { contractVersion: input.contractVersion }),
  });
}

// ─── Continuation after intent (composition / early-stop testing) ───────────

export type ContinueDirectorRuntimeInteractionOrchestrationAfterIntentInput = Readonly<{
  requestId: string;
  observation: DirectorInteractionObservation | null;
  context: CreateDirectorRuntimeInteractionContextInput;
  currentState: DirectorRuntimeFocusSelectionState;
  contract: AcceptedDirectorRuntimeInteractionContract;
  intent: DirectorRuntimeInteractionIntentResolutionResult;
}>;

/**
 * Continues the pipeline from an already-evaluated accepted contract and intent
 * result. Used for deterministic composition and unresolved early-stop paths.
 */
export function continueDirectorRuntimeInteractionOrchestrationAfterIntent(
  input: ContinueDirectorRuntimeInteractionOrchestrationAfterIntentInput,
): DirectorRuntimeInteractionOrchestrationResult {
  const requestId = input.requestId;
  const platformRunId = `${requestId}:platform`;
  const context = createDirectorRuntimeInteractionContext(input.context ?? {});
  const initialState = cloneFocusSelectionState(input.currentState);
  const foundation = traceEntry({
    phase: "foundation",
    status: "completed",
    inputRef: requestId,
    outputRef: "observation+context+state",
  });
  const contractTrace = traceEntry({
    phase: "contract",
    status: "completed",
    inputRef: requestId,
    outputRef: "accepted",
  });

  if (isUnresolvedDirectorRuntimeInteractionIntent(input.intent)) {
    const unresolved = input.intent as UnresolvedDirectorRuntimeInteractionIntent;
    return freezeResult({
      platformRunId,
      requestId,
      disposition: "stopped",
      terminationPhase: "intent-resolution",
      reason: unresolved.reason,
      observation: input.observation,
      context,
      initialState,
      contract: input.contract,
      intent: unresolved,
      transition: null,
      reactionPlan: null,
      execution: null,
      finalState: initialState,
      trace: buildTrace([
        foundation,
        contractTrace,
        traceEntry({
          phase: "intent-resolution",
          status: "stopped",
          inputRef: "accepted",
          outputRef: "unresolved",
          reason: unresolved.reason,
        }),
      ]),
    });
  }

  if (!isResolvedDirectorRuntimeInteractionIntent(input.intent)) {
    return freezeResult({
      platformRunId,
      requestId,
      disposition: "stopped",
      terminationPhase: "intent-resolution",
      reason: "invalid-intent-resolution",
      observation: input.observation,
      context,
      initialState,
      contract: input.contract,
      intent: input.intent,
      transition: null,
      reactionPlan: null,
      execution: null,
      finalState: initialState,
      trace: buildTrace([
        foundation,
        contractTrace,
        traceEntry({
          phase: "intent-resolution",
          status: "stopped",
          inputRef: "accepted",
          outputRef: null,
          reason: "invalid-intent-resolution",
        }),
      ]),
    });
  }

  const resolved = input.intent as ResolvedDirectorRuntimeInteractionIntent;
  const transition = orchestrateDirectorRuntimeFocusSelection({
    currentState: initialState,
    resolvedIntent: resolved,
  });
  const reactionPlan = planDirectorRuntimeInteractionReaction(transition);
  const execution = executeDirectorRuntimeInteraction({ reactionPlan });

  return freezeResult({
    platformRunId,
    requestId,
    disposition: "completed",
    terminationPhase: null,
    reason: null,
    observation: input.observation,
    context,
    initialState,
    contract: input.contract,
    intent: resolved,
    transition,
    reactionPlan,
    execution,
    finalState: transition.nextState,
    trace: buildTrace([
      foundation,
      contractTrace,
      traceEntry({
        phase: "intent-resolution",
        status: "completed",
        inputRef: "accepted",
        outputRef: resolved.intent.intentId,
      }),
      traceEntry({
        phase: "focus-selection",
        status: "completed",
        inputRef: resolved.intent.intentId,
        outputRef: transition.transitionKind,
      }),
      traceEntry({
        phase: "reaction-planning",
        status: "completed",
        inputRef: transition.transitionKind,
        outputRef: reactionPlan.planId,
      }),
      traceEntry({
        phase: "execution",
        status: "completed",
        inputRef: reactionPlan.planId,
        outputRef: execution.executionId,
        reason: execution.status === "completed" ? null : execution.status,
      }),
    ]),
  });
}

/**
 * Continues from a prepared reaction plan through execution.
 * Preserves upstream stage outputs without re-deriving semantics.
 */
export function continueDirectorRuntimeInteractionOrchestrationAfterReactionPlan(
  input: Readonly<{
    requestId: string;
    observation: DirectorInteractionObservation | null;
    context: CreateDirectorRuntimeInteractionContextInput;
    currentState: DirectorRuntimeFocusSelectionState;
    contract: AcceptedDirectorRuntimeInteractionContract;
    intent: ResolvedDirectorRuntimeInteractionIntent;
    transition: DirectorRuntimeFocusSelectionTransition;
    reactionPlan: DirectorRuntimeInteractionReactionPlan;
  }>,
): DirectorRuntimeInteractionOrchestrationResult {
  const requestId = input.requestId;
  const platformRunId = `${requestId}:platform`;
  const context = createDirectorRuntimeInteractionContext(input.context ?? {});
  const initialState = cloneFocusSelectionState(input.currentState);
  const execution = executeDirectorRuntimeInteraction({
    reactionPlan: input.reactionPlan,
  });

  return freezeResult({
    platformRunId,
    requestId,
    disposition: "completed",
    terminationPhase: null,
    reason: null,
    observation: input.observation,
    context,
    initialState,
    contract: input.contract,
    intent: input.intent,
    transition: input.transition,
    reactionPlan: input.reactionPlan,
    execution,
    finalState: input.transition.nextState,
    trace: buildTrace([
      traceEntry({
        phase: "foundation",
        status: "completed",
        inputRef: requestId,
        outputRef: "observation+context+state",
      }),
      traceEntry({
        phase: "contract",
        status: "completed",
        inputRef: requestId,
        outputRef: "accepted",
      }),
      traceEntry({
        phase: "intent-resolution",
        status: "completed",
        inputRef: "accepted",
        outputRef: input.intent.intent.intentId,
      }),
      traceEntry({
        phase: "focus-selection",
        status: "completed",
        inputRef: input.intent.intent.intentId,
        outputRef: input.transition.transitionKind,
      }),
      traceEntry({
        phase: "reaction-planning",
        status: "completed",
        inputRef: input.transition.transitionKind,
        outputRef: input.reactionPlan.planId,
      }),
      traceEntry({
        phase: "execution",
        status: "completed",
        inputRef: input.reactionPlan.planId,
        outputRef: execution.executionId,
        reason: execution.status === "completed" ? null : execution.status,
      }),
    ]),
  });
}

// ─── Main platform API ──────────────────────────────────────────────────────

export function orchestrateDirectorRuntimeInteraction(
  input: DirectorRuntimeInteractionOrchestrationInput,
): DirectorRuntimeInteractionOrchestrationResult {
  const normalized = createDirectorRuntimeInteractionOrchestrationInput(input);
  const platformRunId = `${normalized.requestId}:platform`;
  const context = createDirectorRuntimeInteractionContext(normalized.context ?? {});
  const initialState = cloneFocusSelectionState(normalized.currentState);

  const foundation = traceEntry({
    phase: "foundation",
    status: "completed",
    inputRef: normalized.requestId,
    outputRef: "observation+context+state",
  });

  const contract = evaluateDirectorRuntimeInteractionContract({
    requestId: normalized.requestId,
    observation: normalized.observation,
    context: normalized.context,
    ...(normalized.contractVersion === undefined
      ? {}
      : { contractVersion: normalized.contractVersion }),
  });

  if (isRejectedDirectorRuntimeInteractionContract(contract)) {
    const rejected = contract as RejectedDirectorRuntimeInteractionContract;
    const observation = rejected.request?.observation ?? null;
    return freezeResult({
      platformRunId,
      requestId: normalized.requestId,
      disposition: "rejected",
      terminationPhase: "contract",
      reason: rejected.reason,
      observation,
      context,
      initialState,
      contract: rejected,
      intent: null,
      transition: null,
      reactionPlan: null,
      execution: null,
      finalState: initialState,
      trace: buildTrace([
        foundation,
        traceEntry({
          phase: "contract",
          status: "rejected",
          inputRef: normalized.requestId,
          outputRef: "rejected",
          reason: rejected.reason,
        }),
      ]),
    });
  }

  if (!isAcceptedDirectorRuntimeInteractionContract(contract)) {
    return freezeResult({
      platformRunId,
      requestId: normalized.requestId,
      disposition: "rejected",
      terminationPhase: "contract",
      reason: "invalid-contract-result",
      observation: null,
      context,
      initialState,
      contract: null,
      intent: null,
      transition: null,
      reactionPlan: null,
      execution: null,
      finalState: initialState,
      trace: buildTrace([
        foundation,
        traceEntry({
          phase: "contract",
          status: "rejected",
          inputRef: normalized.requestId,
          outputRef: null,
          reason: "invalid-contract-result",
        }),
      ]),
    });
  }

  const accepted = contract as AcceptedDirectorRuntimeInteractionContract;
  const intent = resolveDirectorRuntimeInteractionIntent(accepted);

  return continueDirectorRuntimeInteractionOrchestrationAfterIntent({
    requestId: normalized.requestId,
    observation: accepted.request.observation,
    context: accepted.request.context,
    currentState: initialState,
    contract: accepted,
    intent,
  });
}

// ─── Guards ─────────────────────────────────────────────────────────────────

export function isDirectorRuntimeInteractionOrchestrationResult(
  value: unknown,
): value is DirectorRuntimeInteractionOrchestrationResult {
  if (!isPlainObject(value)) return false;
  return isNonEmptyString(value.platformRunId) &&
    isNonEmptyString(value.requestId) &&
    (DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_DISPOSITIONS as readonly unknown[])
      .includes(value.disposition) &&
    Array.isArray(value.trace) &&
    value.trace.length === DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_PHASES.length &&
    isDirectorRuntimeFocusSelectionState(value.initialState) &&
    isDirectorRuntimeFocusSelectionState(value.finalState) &&
    (value.execution === null || isDirectorRuntimeInteractionExecutionResult(value.execution));
}

export function isCompletedDirectorRuntimeInteractionOrchestration(
  value: unknown,
): value is DirectorRuntimeInteractionOrchestrationResult & {
  readonly disposition: "completed";
} {
  return isDirectorRuntimeInteractionOrchestrationResult(value) &&
    value.disposition === "completed";
}

export function isRejectedDirectorRuntimeInteractionOrchestration(
  value: unknown,
): value is DirectorRuntimeInteractionOrchestrationResult & {
  readonly disposition: "rejected";
} {
  return isDirectorRuntimeInteractionOrchestrationResult(value) &&
    value.disposition === "rejected";
}

export function isStoppedDirectorRuntimeInteractionOrchestration(
  value: unknown,
): value is DirectorRuntimeInteractionOrchestrationResult & {
  readonly disposition: "stopped";
} {
  return isDirectorRuntimeInteractionOrchestrationResult(value) &&
    value.disposition === "stopped";
}

// ─── Registry ───────────────────────────────────────────────────────────────

export const directorRuntimeInteractionOrchestrationPlatformTypeNames = Object.freeze([
  "DirectorRuntimeInteractionOrchestrationInput",
  "DirectorRuntimeInteractionOrchestrationResult",
  "DirectorRuntimeInteractionOrchestrationPhaseTraceEntry",
  "DirectorRuntimeInteractionOrchestrationTrace",
] as const);

export const directorRuntimeInteractionOrchestrationPlatformApiNames = Object.freeze([
  "createDirectorRuntimeInteractionOrchestrationInput",
  "orchestrateDirectorRuntimeInteraction",
  "continueDirectorRuntimeInteractionOrchestrationAfterIntent",
  "continueDirectorRuntimeInteractionOrchestrationAfterReactionPlan",
  "isDirectorRuntimeInteractionOrchestrationResult",
  "isCompletedDirectorRuntimeInteractionOrchestration",
  "isRejectedDirectorRuntimeInteractionOrchestration",
  "isStoppedDirectorRuntimeInteractionOrchestration",
  "verifyDirectorRuntimeInteractionOrchestrationPlatform",
] as const);

export {
  createDirectorRuntimeFocusSelectionState,
  createEmptyDirectorRuntimeFocusSelectionState,
} from "@/app/lib/dri/directorRuntimeInteractionExecution";

export type {
  AcceptedDirectorRuntimeInteractionContract,
  ResolvedDirectorRuntimeInteractionIntent,
  DirectorRuntimeFocusSelectionState,
  DirectorRuntimeInteractionExecutionResult,
  DirectorRuntimeInteractionReactionPlan,
} from "@/app/lib/dri/directorRuntimeInteractionExecution";

export const directorRuntimeInteractionOrchestrationPlatformRegistry = Object.freeze({
  platformPhases: DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_PHASES,
  platformPhaseCount: DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_PHASES.length,
  platformDispositions: DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_DISPOSITIONS,
  platformDispositionCount:
    DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_DISPOSITIONS.length,
  traceStatuses: DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_TRACE_STATUSES,
  traceStatusCount: DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_TRACE_STATUSES.length,
  platformInputContracts: Object.freeze([
    "DirectorRuntimeInteractionOrchestrationInput",
  ] as const),
  platformInputContractCount: 1,
  platformResultContracts: Object.freeze([
    "DirectorRuntimeInteractionOrchestrationResult",
  ] as const),
  platformResultContractCount: 1,
  traceContracts: Object.freeze([
    "DirectorRuntimeInteractionOrchestrationPhaseTraceEntry",
    "DirectorRuntimeInteractionOrchestrationTrace",
  ] as const),
  traceContractCount: 2,
  publicTypes: directorRuntimeInteractionOrchestrationPlatformTypeNames,
  publicTypeCount: directorRuntimeInteractionOrchestrationPlatformTypeNames.length,
  publicApis: directorRuntimeInteractionOrchestrationPlatformApiNames,
  publicApiCount: directorRuntimeInteractionOrchestrationPlatformApiNames.length,
  immediateDependency: directorRuntimeInteractionOrchestrationPlatformUpstream,
  pipeline:
    "foundation→contract→intent-resolution→focus-selection→reaction-planning→execution" as const,
});

export const directorRuntimeInteractionOrchestrationPlatform = Object.freeze({
  phase: "DRI-4:7" as const,
  name: "DirectorRuntimeInteractionOrchestrationPlatform" as const,
  identity: directorRuntimeInteractionOrchestrationPlatformIdentity,
  namespace: directorRuntimeInteractionOrchestrationPlatformNamespace,
  version: directorRuntimeInteractionOrchestrationPlatformVersion,
  layer: "DirectorRuntimeInteractionOrchestration" as const,
  stage: "Platform" as const,
  status: "PlatformReady" as const,
  immediateDependency: directorRuntimeInteractionOrchestrationPlatformUpstream,
  philosophy: "platform-is-composition-of-existing-semantics" as const,
  phases: DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_PHASES,
  dispositions: DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_DISPOSITIONS,
  traceStatuses: DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_TRACE_STATUSES,
  publicApiSurface: directorRuntimeInteractionOrchestrationPlatformApiNames,
  registry: directorRuntimeInteractionOrchestrationPlatformRegistry,
});

export function verifyDirectorRuntimeInteractionOrchestrationPlatform(): boolean {
  const surface = directorRuntimeInteractionOrchestrationPlatform;
  const registry = directorRuntimeInteractionOrchestrationPlatformRegistry;
  const phaseSet = new Set(DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_PHASES);

  const emptyState = createDirectorRuntimeFocusSelectionState({
    focusedTarget: null,
    selectedTarget: null,
  });
  const acceptedPath = orchestrateDirectorRuntimeInteraction({
    requestId: "verify-platform-accepted",
    observation: {
      interactionId: "ix-verify",
      kind: "select",
      source: "object",
      target: { kind: "object", id: "factory-01" },
      sequence: 1,
      scope: "scene",
    },
    context: { sceneId: "executive-main", workspaceId: "workspace-1" },
    currentState: emptyState,
  });
  const rejectedPath = orchestrateDirectorRuntimeInteraction({
    requestId: "verify-platform-rejected",
    observation: {
      interactionId: "ix-bad",
      kind: "select",
      source: "object",
      target: { kind: "object", id: "" },
      sequence: 1,
      scope: "scene",
    },
    context: { sceneId: "executive-main" },
    currentState: emptyState,
  });
  const unresolvedPath = continueDirectorRuntimeInteractionOrchestrationAfterIntent({
    requestId: "verify-platform-unresolved",
    observation: acceptedPath.observation,
    context: acceptedPath.context,
    currentState: emptyState,
    contract: acceptedPath.contract as AcceptedDirectorRuntimeInteractionContract,
    intent: Object.freeze({
      disposition: "unresolved" as const,
      reason: "unsupported-combination" as const,
      requestId: "verify-platform-unresolved",
      matchedRuleIds: Object.freeze([] as const),
    }),
  });

  const acceptedTracePhases = acceptedPath.trace.map((entry) => entry.phase);
  const rejectedSkipped = rejectedPath.trace
    .filter((entry) => entry.phase !== "foundation" && entry.phase !== "contract")
    .every((entry) => entry.status === "skipped");
  const unresolvedSkipped = unresolvedPath.trace
    .filter((entry) =>
      entry.phase === "focus-selection" ||
      entry.phase === "reaction-planning" ||
      entry.phase === "execution")
    .every((entry) => entry.status === "skipped");

  return (
    surface.identity === "DRI-4:7/DirectorRuntimeInteractionOrchestrationPlatform" &&
    surface.version === "4.7.0" &&
    surface.namespace === "nexora.dri.interaction.orchestration.platform" &&
    surface.layer === "DirectorRuntimeInteractionOrchestration" &&
    surface.stage === "Platform" &&
    surface.immediateDependency === "DRI-4:6/DirectorRuntimeInteractionExecution" &&
    surface.immediateDependency === directorRuntimeInteractionExecutionIdentity &&
    registry.platformPhaseCount ===
      DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_PHASES.length &&
    registry.platformPhaseCount === 6 &&
    registry.platformDispositionCount ===
      DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_DISPOSITIONS.length &&
    registry.traceStatusCount ===
      DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_TRACE_STATUSES.length &&
    registry.platformInputContractCount === registry.platformInputContracts.length &&
    registry.platformResultContractCount === registry.platformResultContracts.length &&
    registry.traceContractCount === registry.traceContracts.length &&
    registry.publicApiCount ===
      directorRuntimeInteractionOrchestrationPlatformApiNames.length &&
    phaseSet.size === DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_PHASES.length &&
    DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_PHASES[0] === "foundation" &&
    DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_PHASES[1] === "contract" &&
    DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_PHASES[2] === "intent-resolution" &&
    DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_PHASES[3] === "focus-selection" &&
    DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_PHASES[4] === "reaction-planning" &&
    DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_PHASES[5] === "execution" &&
    acceptedPath.disposition === "completed" &&
    acceptedPath.contract?.disposition === "accepted" &&
    acceptedPath.intent?.disposition === "resolved" &&
    acceptedPath.transition !== null &&
    acceptedPath.reactionPlan !== null &&
    acceptedPath.execution !== null &&
    acceptedPath.transition !== null &&
    acceptedPath.finalState === acceptedPath.transition.nextState &&
    deepEqualPhases(acceptedTracePhases) &&
    rejectedPath.disposition === "rejected" &&
    rejectedPath.intent === null &&
    rejectedPath.transition === null &&
    rejectedPath.reactionPlan === null &&
    rejectedPath.execution === null &&
    rejectedSkipped &&
    unresolvedPath.disposition === "stopped" &&
    unresolvedPath.transition === null &&
    unresolvedPath.reactionPlan === null &&
    unresolvedPath.execution === null &&
    unresolvedSkipped &&
    Object.isFrozen(surface) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_PHASES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_DISPOSITIONS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_TRACE_STATUSES)
  );
}

function deepEqualPhases(
  phases: readonly DirectorRuntimeInteractionOrchestrationPlatformPhase[],
): boolean {
  return phases.length === DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_PHASES.length &&
    phases.every(
      (phase, index) =>
        phase === DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_PHASES[index],
    );
}
