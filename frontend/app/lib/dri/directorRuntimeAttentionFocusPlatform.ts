/**
 * DRI-6:7 — Director Runtime Attention & Focus Platform.
 *
 * Pure composition surface over DRI-6:1–6:6 via the DRI-6:6 re-export chain.
 * No new attention semantics, presentation, persistence, or side effects.
 */

import {
  DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_RESULT,
  DIRECTOR_RUNTIME_EMPTY_ATTENTION_RESOLUTION_OUTCOME,
  DIRECTOR_RUNTIME_EMPTY_ATTENTION_TRANSITION_STATE,
  DIRECTOR_RUNTIME_EMPTY_FOCUS_CONTEXT,
  areDirectorRuntimeAttentionSubjectsEqual,
  bindDirectorRuntimeFocusContext,
  directorRuntimeAttentionTransitionOrchestrationIdentity,
  orchestrateDirectorRuntimeAttentionPaths,
  orchestrateDirectorRuntimeAttentionTransition,
  resolveDirectorRuntimeAttentionPriority,
  validateDirectorRuntimeAttentionRelationship,
  validateDirectorRuntimeAttentionSignalBatch,
  validateDirectorRuntimeAttentionTransitionState,
  type DirectorRuntimeAttentionPathOrchestrationResult,
  type DirectorRuntimeAttentionRelationship,
  type DirectorRuntimeAttentionResolutionOutcome,
  type DirectorRuntimeAttentionSignalBatch,
  type DirectorRuntimeAttentionSubjectReference,
  type DirectorRuntimeAttentionTransitionPlan,
  type DirectorRuntimeAttentionTransitionState,
  type DirectorRuntimeFocusContext,
} from "@/app/lib/dri/directorRuntimeAttentionTransitionOrchestration";

export type {
  DirectorRuntimeAttentionFocusLevel,
  DirectorRuntimeAttentionPath,
  DirectorRuntimeAttentionPathOrchestrationResult,
  DirectorRuntimeAttentionRelationship,
  DirectorRuntimeAttentionResolutionOutcome,
  DirectorRuntimeAttentionSignal,
  DirectorRuntimeAttentionSignalBatch,
  DirectorRuntimeAttentionSubjectReference,
  DirectorRuntimeAttentionTransitionPlan,
  DirectorRuntimeAttentionTransitionState,
  DirectorRuntimeFocusContext,
  DirectorRuntimeFocusContextEntry,
  DirectorRuntimeFocusRole,
} from "@/app/lib/dri/directorRuntimeAttentionTransitionOrchestration";

export {
  DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_RESULT,
  DIRECTOR_RUNTIME_EMPTY_ATTENTION_RESOLUTION_OUTCOME,
  DIRECTOR_RUNTIME_EMPTY_ATTENTION_SIGNAL_BATCH,
  DIRECTOR_RUNTIME_EMPTY_ATTENTION_TRANSITION_STATE,
  DIRECTOR_RUNTIME_EMPTY_FOCUS_CONTEXT,
  DIRECTOR_RUNTIME_NO_CHANGE_ATTENTION_TRANSITION_PLAN,
  areDirectorRuntimeAttentionSubjectsEqual,
  bindDirectorRuntimeFocusContext,
  createDirectorRuntimeAttentionRelationship,
  createDirectorRuntimeAttentionSignal,
  createDirectorRuntimeAttentionSignalBatch,
  orchestrateDirectorRuntimeAttentionPaths,
  orchestrateDirectorRuntimeAttentionTransition,
  resolveDirectorRuntimeAttentionPriority,
  validateDirectorRuntimeAttentionSignalBatch,
  validateDirectorRuntimeAttentionTransitionState,
  validateDirectorRuntimeFocusContext,
} from "@/app/lib/dri/directorRuntimeAttentionTransitionOrchestration";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeAttentionFocusPlatformIdentity =
  "DRI-6:7/DirectorRuntimeAttentionFocusPlatform" as const;
export const directorRuntimeAttentionFocusPlatformVersion = "6.7.0" as const;
export const directorRuntimeAttentionFocusPlatformNamespace =
  "nexora.dri.attention-focus.platform" as const;
export const directorRuntimeAttentionFocusPlatformUpstream =
  directorRuntimeAttentionTransitionOrchestrationIdentity;

export const directorRuntimeAttentionFocusPlatformCanonicalIdentity =
  Object.freeze({
    identity: directorRuntimeAttentionFocusPlatformIdentity,
    version: directorRuntimeAttentionFocusPlatformVersion,
    namespace: directorRuntimeAttentionFocusPlatformNamespace,
    upstream: directorRuntimeAttentionFocusPlatformUpstream,
  });

// ─── Stages / statuses ──────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_STAGES = Object.freeze([
  "signal-validation",
  "priority-resolution",
  "focus-context-binding",
  "attention-path-orchestration",
  "attention-transition-orchestration",
  "complete",
] as const);
export type DirectorRuntimeAttentionFocusPlatformStage =
  (typeof DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_STAGES)[number];

export const DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_STAGE_STATUSES =
  Object.freeze([
    "pending",
    "completed",
    "failed",
    "not-applicable",
  ] as const);
export type DirectorRuntimeAttentionFocusPlatformStageStatus =
  (typeof DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_STAGE_STATUSES)[number];

export const DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_PIPELINE_ORDER =
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_STAGES;

/** No previous state ⇒ transitionPlan = null (stage not-applicable). */
export const DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_TRANSITION_ABSENCE_POLICY =
  "null-transition-plan-when-previous-state-absent" as const;

/**
 * Invalid previous state: current snapshot retained for diagnostics,
 * platform ok = false, transitionPlan = null.
 */
export const DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_INVALID_PREVIOUS_POLICY =
  "fail-transition-retain-current-snapshot" as const;

export const DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_FAIL_FAST_POLICY =
  "stop-on-first-invalid-stage" as const;

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface DirectorRuntimeAttentionFocusPlatformInput {
  readonly signals: DirectorRuntimeAttentionSignalBatch;
  readonly relationships: readonly DirectorRuntimeAttentionRelationship[];
  readonly previousState?: DirectorRuntimeAttentionTransitionState | null;
}

export interface DirectorRuntimeAttentionFocusPlatformIssue {
  readonly stage: DirectorRuntimeAttentionFocusPlatformStage;
  readonly code: string;
  readonly path: string;
  readonly message: string;
}

export interface DirectorRuntimeAttentionFocusPlatformStageTraceEntry {
  readonly stage: DirectorRuntimeAttentionFocusPlatformStage;
  readonly status: DirectorRuntimeAttentionFocusPlatformStageStatus;
}

export interface DirectorRuntimeAttentionFocusPlatformSnapshot {
  readonly resolution: DirectorRuntimeAttentionResolutionOutcome;
  readonly focusContext: DirectorRuntimeFocusContext;
  readonly pathResult: DirectorRuntimeAttentionPathOrchestrationResult;
  readonly transitionState: DirectorRuntimeAttentionTransitionState;
}

export interface DirectorRuntimeAttentionFocusPlatformResult {
  readonly ok: boolean;
  readonly resolution: DirectorRuntimeAttentionResolutionOutcome | null;
  readonly focusContext: DirectorRuntimeFocusContext | null;
  readonly pathResult: DirectorRuntimeAttentionPathOrchestrationResult | null;
  readonly currentState: DirectorRuntimeAttentionTransitionState | null;
  readonly transitionPlan: DirectorRuntimeAttentionTransitionPlan | null;
  readonly snapshot: DirectorRuntimeAttentionFocusPlatformSnapshot | null;
  readonly stageTrace: readonly DirectorRuntimeAttentionFocusPlatformStageTraceEntry[];
  readonly issues: readonly DirectorRuntimeAttentionFocusPlatformIssue[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function freezeIssue(
  issue: DirectorRuntimeAttentionFocusPlatformIssue,
): DirectorRuntimeAttentionFocusPlatformIssue {
  return Object.freeze({ ...issue });
}

function freezeTrace(
  entries: readonly DirectorRuntimeAttentionFocusPlatformStageTraceEntry[],
): readonly DirectorRuntimeAttentionFocusPlatformStageTraceEntry[] {
  return Object.freeze(entries.map((entry) => Object.freeze({ ...entry })));
}

function subjectKey(subject: DirectorRuntimeAttentionSubjectReference): string {
  return `${subject.subjectKind}\u0000${subject.subjectId}`;
}

function subjectsEqualOrBothNull(
  left: DirectorRuntimeAttentionSubjectReference | null,
  right: DirectorRuntimeAttentionSubjectReference | null,
): boolean {
  if (left === null && right === null) return true;
  if (left === null || right === null) return false;
  return areDirectorRuntimeAttentionSubjectsEqual(left, right);
}

function pendingTrace(): DirectorRuntimeAttentionFocusPlatformStageTraceEntry[] {
  return DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_STAGES.map((stage) =>
    Object.freeze({
      stage,
      status: "pending" as const,
    }));
}

function setTraceStatus(
  trace: DirectorRuntimeAttentionFocusPlatformStageTraceEntry[],
  stage: DirectorRuntimeAttentionFocusPlatformStage,
  status: DirectorRuntimeAttentionFocusPlatformStageStatus,
): void {
  const index = trace.findIndex((entry) => entry.stage === stage);
  if (index >= 0) {
    trace[index] = Object.freeze({ stage, status });
  }
}

function markRemainingNotRun(
  trace: DirectorRuntimeAttentionFocusPlatformStageTraceEntry[],
  afterStage: DirectorRuntimeAttentionFocusPlatformStage,
): void {
  const afterIndex = DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_STAGES.indexOf(
    afterStage,
  );
  for (let index = afterIndex + 1; index < trace.length; index += 1) {
    const stage = DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_STAGES[index]!;
    if (stage === "complete") {
      setTraceStatus(trace, stage, "failed");
    } else if (trace[index]?.status === "pending") {
      setTraceStatus(trace, stage, "pending");
    }
  }
}

function emptyFailure(
  stage: DirectorRuntimeAttentionFocusPlatformStage,
  code: string,
  path: string,
  message: string,
  extras: readonly DirectorRuntimeAttentionFocusPlatformIssue[] = [],
): DirectorRuntimeAttentionFocusPlatformResult {
  const trace = pendingTrace();
  setTraceStatus(trace, stage, "failed");
  markRemainingNotRun(trace, stage);
  return Object.freeze({
    ok: false,
    resolution: null,
    focusContext: null,
    pathResult: null,
    currentState: null,
    transitionPlan: null,
    snapshot: null,
    stageTrace: freezeTrace(trace),
    issues: Object.freeze([
      freezeIssue({ stage, code, path, message }),
      ...extras.map((entry) => freezeIssue(entry)),
    ]),
  });
}

function freezeSnapshot(
  snapshot: DirectorRuntimeAttentionFocusPlatformSnapshot,
): DirectorRuntimeAttentionFocusPlatformSnapshot {
  return Object.freeze({
    resolution: snapshot.resolution,
    focusContext: snapshot.focusContext,
    pathResult: snapshot.pathResult,
    transitionState: Object.freeze({
      focusContext: snapshot.transitionState.focusContext,
      pathResult: snapshot.transitionState.pathResult,
    }),
  });
}

function freezeResult(
  result: DirectorRuntimeAttentionFocusPlatformResult,
): DirectorRuntimeAttentionFocusPlatformResult {
  return Object.freeze({
    ok: result.ok,
    resolution: result.resolution,
    focusContext: result.focusContext,
    pathResult: result.pathResult,
    currentState: result.currentState === null
      ? null
      : Object.freeze({
        focusContext: result.currentState.focusContext,
        pathResult: result.currentState.pathResult,
      }),
    transitionPlan: result.transitionPlan,
    snapshot: result.snapshot === null ? null : freezeSnapshot(result.snapshot),
    stageTrace: freezeTrace(result.stageTrace),
    issues: Object.freeze(result.issues.map((entry) => freezeIssue(entry))),
  });
}

export const DIRECTOR_RUNTIME_EMPTY_ATTENTION_FOCUS_PLATFORM_RESULT =
  Object.freeze({
    ok: true,
    resolution: DIRECTOR_RUNTIME_EMPTY_ATTENTION_RESOLUTION_OUTCOME,
    focusContext: DIRECTOR_RUNTIME_EMPTY_FOCUS_CONTEXT,
    pathResult: DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_RESULT,
    currentState: DIRECTOR_RUNTIME_EMPTY_ATTENTION_TRANSITION_STATE,
    transitionPlan: null,
    snapshot: Object.freeze({
      resolution: DIRECTOR_RUNTIME_EMPTY_ATTENTION_RESOLUTION_OUTCOME,
      focusContext: DIRECTOR_RUNTIME_EMPTY_FOCUS_CONTEXT,
      pathResult: DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_RESULT,
      transitionState: DIRECTOR_RUNTIME_EMPTY_ATTENTION_TRANSITION_STATE,
    }) satisfies DirectorRuntimeAttentionFocusPlatformSnapshot,
    stageTrace: freezeTrace([
      Object.freeze({ stage: "signal-validation", status: "completed" }),
      Object.freeze({ stage: "priority-resolution", status: "completed" }),
      Object.freeze({ stage: "focus-context-binding", status: "completed" }),
      Object.freeze({
        stage: "attention-path-orchestration",
        status: "completed",
      }),
      Object.freeze({
        stage: "attention-transition-orchestration",
        status: "not-applicable",
      }),
      Object.freeze({ stage: "complete", status: "completed" }),
    ]),
    issues: Object.freeze([]) as readonly DirectorRuntimeAttentionFocusPlatformIssue[],
  }) satisfies DirectorRuntimeAttentionFocusPlatformResult;

// ─── Validation ─────────────────────────────────────────────────────────────

export function validateDirectorRuntimeAttentionFocusPlatformStage(
  value: unknown,
): { readonly ok: boolean; readonly issues: readonly DirectorRuntimeAttentionFocusPlatformIssue[] } {
  if (!(DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_STAGES as readonly unknown[])
    .includes(value)) {
    return Object.freeze({
      ok: false,
      issues: Object.freeze([
        freezeIssue({
          stage: "complete",
          code: "invalid-platform-stage",
          path: "stage",
          message: "platform stage must be canonical",
        }),
      ]),
    });
  }
  return Object.freeze({ ok: true, issues: Object.freeze([]) });
}

export function validateDirectorRuntimeAttentionFocusPlatformStageStatus(
  value: unknown,
): { readonly ok: boolean; readonly issues: readonly DirectorRuntimeAttentionFocusPlatformIssue[] } {
  if (!(DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_STAGE_STATUSES as readonly unknown[])
    .includes(value)) {
    return Object.freeze({
      ok: false,
      issues: Object.freeze([
        freezeIssue({
          stage: "complete",
          code: "invalid-stage-status",
          path: "status",
          message: "stage status must be canonical",
        }),
      ]),
    });
  }
  return Object.freeze({ ok: true, issues: Object.freeze([]) });
}

export function validateDirectorRuntimeAttentionFocusPlatformIssue(
  value: unknown,
): { readonly ok: boolean; readonly issues: readonly DirectorRuntimeAttentionFocusPlatformIssue[] } {
  if (!isPlainObject(value)) {
    return Object.freeze({
      ok: false,
      issues: Object.freeze([
        freezeIssue({
          stage: "complete",
          code: "invalid-platform-issue",
          path: "issue",
          message: "issue must be a plain object",
        }),
      ]),
    });
  }
  const stageValidation = validateDirectorRuntimeAttentionFocusPlatformStage(
    value.stage,
  );
  if (!stageValidation.ok) return stageValidation;
  if (typeof value.code !== "string" || value.code.trim().length === 0) {
    return Object.freeze({
      ok: false,
      issues: Object.freeze([
        freezeIssue({
          stage: "complete",
          code: "invalid-platform-issue",
          path: "issue.code",
          message: "issue code invalid",
        }),
      ]),
    });
  }
  return Object.freeze({ ok: true, issues: Object.freeze([]) });
}

export function validateDirectorRuntimeAttentionFocusPlatformInput(
  value: unknown,
): { readonly ok: boolean; readonly issues: readonly DirectorRuntimeAttentionFocusPlatformIssue[] } {
  if (!isPlainObject(value)) {
    return Object.freeze({
      ok: false,
      issues: Object.freeze([
        freezeIssue({
          stage: "signal-validation",
          code: "invalid-platform-input",
          path: "input",
          message: "platform input must be a plain object",
        }),
      ]),
    });
  }
  const batchValidation = validateDirectorRuntimeAttentionSignalBatch(value.signals);
  if (!batchValidation.valid) {
    return Object.freeze({
      ok: false,
      issues: Object.freeze([
        freezeIssue({
          stage: "signal-validation",
          code: "invalid-signal-batch",
          path: "input.signals",
          message: "signal batch failed DRI-6:2 validation",
        }),
      ]),
    });
  }
  if (!Array.isArray(value.relationships)) {
    return Object.freeze({
      ok: false,
      issues: Object.freeze([
        freezeIssue({
          stage: "attention-path-orchestration",
          code: "invalid-relationships",
          path: "input.relationships",
          message: "relationships must be an array",
        }),
      ]),
    });
  }
  return Object.freeze({ ok: true, issues: Object.freeze([]) });
}

export function validateDirectorRuntimeAttentionFocusPlatformSnapshot(
  value: unknown,
): { readonly ok: boolean; readonly issues: readonly DirectorRuntimeAttentionFocusPlatformIssue[] } {
  if (!isPlainObject(value)) {
    return Object.freeze({
      ok: false,
      issues: Object.freeze([
        freezeIssue({
          stage: "complete",
          code: "invalid-platform-snapshot",
          path: "snapshot",
          message: "snapshot must be a plain object",
        }),
      ]),
    });
  }
  const issues: DirectorRuntimeAttentionFocusPlatformIssue[] = [];
  const resolution = value.resolution as DirectorRuntimeAttentionResolutionOutcome;
  const focusContext = value.focusContext as DirectorRuntimeFocusContext;
  const pathResult = value.pathResult as DirectorRuntimeAttentionPathOrchestrationResult;
  const transitionState = value.transitionState as DirectorRuntimeAttentionTransitionState;

  if (!isPlainObject(resolution) || !isPlainObject(focusContext) ||
    !isPlainObject(pathResult) || !isPlainObject(transitionState)) {
    return Object.freeze({
      ok: false,
      issues: Object.freeze([
        freezeIssue({
          stage: "complete",
          code: "invalid-platform-snapshot",
          path: "snapshot",
          message: "snapshot fields incomplete",
        }),
      ]),
    });
  }

  const resolutionPrimary = resolution.primary?.subject ?? null;
  if (!subjectsEqualOrBothNull(resolutionPrimary, focusContext.primarySubject)) {
    issues.push(freezeIssue({
      stage: "complete",
      code: "primary-consistency-violation",
      path: "snapshot",
      message: "resolution primary must match focus context primary",
    }));
  }

  if (focusContext.primarySubject !== null) {
    if (!subjectsEqualOrBothNull(
      focusContext.primarySubject,
      pathResult.rootSubject,
    )) {
      issues.push(freezeIssue({
        stage: "complete",
        code: "path-root-consistency-violation",
        path: "snapshot",
        message: "focus primary must match path root when primary exists",
      }));
    }
  } else if (pathResult.rootSubject !== null) {
    issues.push(freezeIssue({
      stage: "complete",
      code: "path-root-consistency-violation",
      path: "snapshot",
      message: "empty focus context must not have a path root",
    }));
  }

  if (transitionState.focusContext !== focusContext &&
    JSON.stringify(transitionState.focusContext) !== JSON.stringify(focusContext)) {
    issues.push(freezeIssue({
      stage: "complete",
      code: "transition-state-consistency-violation",
      path: "snapshot.transitionState.focusContext",
      message: "transition state focus context must match platform focus context",
    }));
  }

  if (transitionState.pathResult !== pathResult &&
    JSON.stringify(transitionState.pathResult) !== JSON.stringify(pathResult)) {
    issues.push(freezeIssue({
      stage: "complete",
      code: "transition-state-consistency-violation",
      path: "snapshot.transitionState.pathResult",
      message: "transition state path result must match platform path result",
    }));
  }

  const suppressedKeys = new Set(
    focusContext.suppressedEntries.map((entry) => subjectKey(entry.subject)),
  );
  if (pathResult.ok) {
    for (const path of pathResult.paths) {
      const endpoint = path.subjects[path.subjects.length - 1];
      if (endpoint !== undefined && suppressedKeys.has(subjectKey(endpoint))) {
        issues.push(freezeIssue({
          stage: "complete",
          code: "suppression-consistency-violation",
          path: "snapshot.pathResult",
          message: "suppressed subject must not be an active path endpoint",
        }));
        break;
      }
    }
  }

  return Object.freeze({
    ok: issues.length === 0,
    issues: Object.freeze(issues),
  });
}

export function validateDirectorRuntimeAttentionFocusPlatformResult(
  value: unknown,
): { readonly ok: boolean; readonly issues: readonly DirectorRuntimeAttentionFocusPlatformIssue[] } {
  if (!isPlainObject(value)) {
    return Object.freeze({
      ok: false,
      issues: Object.freeze([
        freezeIssue({
          stage: "complete",
          code: "invalid-platform-result",
          path: "result",
          message: "result must be a plain object",
        }),
      ]),
    });
  }
  if (typeof value.ok !== "boolean") {
    return Object.freeze({
      ok: false,
      issues: Object.freeze([
        freezeIssue({
          stage: "complete",
          code: "invalid-platform-result",
          path: "result.ok",
          message: "ok must be boolean",
        }),
      ]),
    });
  }
  if (value.ok === true && value.snapshot === null) {
    return Object.freeze({
      ok: false,
      issues: Object.freeze([
        freezeIssue({
          stage: "complete",
          code: "invalid-platform-result",
          path: "result.snapshot",
          message: "successful result requires snapshot",
        }),
      ]),
    });
  }
  if (value.ok === true && value.snapshot !== null) {
    return validateDirectorRuntimeAttentionFocusPlatformSnapshot(value.snapshot);
  }
  return Object.freeze({ ok: true, issues: Object.freeze([]) });
}

export function validateDirectorRuntimeAttentionFocusPlatformRegistry(
  value: unknown,
): { readonly ok: boolean; readonly issues: readonly DirectorRuntimeAttentionFocusPlatformIssue[] } {
  if (!isPlainObject(value)) {
    return Object.freeze({
      ok: false,
      issues: Object.freeze([
        freezeIssue({
          stage: "complete",
          code: "invalid-platform-registry",
          path: "registry",
          message: "registry must be a plain object",
        }),
      ]),
    });
  }
  if (value.identity !== directorRuntimeAttentionFocusPlatformIdentity) {
    return Object.freeze({
      ok: false,
      issues: Object.freeze([
        freezeIssue({
          stage: "complete",
          code: "invalid-platform-registry",
          path: "registry.identity",
          message: "identity mismatch",
        }),
      ]),
    });
  }
  return Object.freeze({ ok: true, issues: Object.freeze([]) });
}

// ─── Platform execution ─────────────────────────────────────────────────────

export function runDirectorRuntimeAttentionFocusPlatform(
  input: DirectorRuntimeAttentionFocusPlatformInput,
): DirectorRuntimeAttentionFocusPlatformResult {
  const trace = pendingTrace();
  const issues: DirectorRuntimeAttentionFocusPlatformIssue[] = [];

  // Stage 1 — Signal validation
  const inputShape = validateDirectorRuntimeAttentionFocusPlatformInput(input);
  if (!inputShape.ok) {
    return emptyFailure(
      "signal-validation",
      inputShape.issues[0]?.code ?? "invalid-platform-input",
      inputShape.issues[0]?.path ?? "input",
      inputShape.issues[0]?.message ?? "invalid platform input",
      inputShape.issues.slice(1),
    );
  }
  const signalValidation = validateDirectorRuntimeAttentionSignalBatch(input.signals);
  if (!signalValidation.valid) {
    return emptyFailure(
      "signal-validation",
      "invalid-signal-batch",
      "input.signals",
      "signal batch failed DRI-6:2 validation",
    );
  }
  setTraceStatus(trace, "signal-validation", "completed");

  // Stage 2 — Priority resolution
  const resolutionResult = resolveDirectorRuntimeAttentionPriority(input.signals);
  if (!resolutionResult.ok || resolutionResult.outcome === null) {
    setTraceStatus(trace, "priority-resolution", "failed");
    markRemainingNotRun(trace, "priority-resolution");
    return freezeResult({
      ok: false,
      resolution: null,
      focusContext: null,
      pathResult: null,
      currentState: null,
      transitionPlan: null,
      snapshot: null,
      stageTrace: freezeTrace(trace),
      issues: Object.freeze([
        freezeIssue({
          stage: "priority-resolution",
          code: "priority-resolution-failed",
          path: "resolution",
          message: "DRI-6:3 priority resolution failed",
        }),
        ...resolutionResult.issues.map((entry) => freezeIssue({
          stage: "priority-resolution",
          code: entry.code,
          path: entry.path,
          message: entry.message,
        })),
      ]),
    });
  }
  setTraceStatus(trace, "priority-resolution", "completed");
  const resolution = resolutionResult.outcome;

  // Stage 3 — Focus context binding
  const bindingResult = bindDirectorRuntimeFocusContext({ resolution });
  if (!bindingResult.ok || bindingResult.context === null) {
    setTraceStatus(trace, "focus-context-binding", "failed");
    markRemainingNotRun(trace, "focus-context-binding");
    return freezeResult({
      ok: false,
      resolution,
      focusContext: null,
      pathResult: null,
      currentState: null,
      transitionPlan: null,
      snapshot: null,
      stageTrace: freezeTrace(trace),
      issues: Object.freeze([
        freezeIssue({
          stage: "focus-context-binding",
          code: "focus-binding-failed",
          path: "focusContext",
          message: "DRI-6:4 focus context binding failed",
        }),
        ...bindingResult.issues.map((entry) => freezeIssue({
          stage: "focus-context-binding",
          code: entry.code,
          path: entry.path,
          message: entry.message,
        })),
      ]),
    });
  }
  setTraceStatus(trace, "focus-context-binding", "completed");
  const focusContext = bindingResult.context;

  // Stage 4 — Path orchestration
  for (let index = 0; index < input.relationships.length; index += 1) {
    const relationshipValidation = validateDirectorRuntimeAttentionRelationship(
      input.relationships[index],
    );
    if (!relationshipValidation.ok) {
      setTraceStatus(trace, "attention-path-orchestration", "failed");
      markRemainingNotRun(trace, "attention-path-orchestration");
      return freezeResult({
        ok: false,
        resolution,
        focusContext,
        pathResult: null,
        currentState: null,
        transitionPlan: null,
        snapshot: null,
        stageTrace: freezeTrace(trace),
        issues: Object.freeze([
          freezeIssue({
            stage: "attention-path-orchestration",
            code: "invalid-relationship",
            path: `input.relationships[${index}]`,
            message: "relationship failed DRI-6:5 validation",
          }),
          ...relationshipValidation.issues.map((entry) => freezeIssue({
            stage: "attention-path-orchestration",
            code: entry.code,
            path: entry.path,
            message: entry.message,
          })),
        ]),
      });
    }
  }

  const pathResult = orchestrateDirectorRuntimeAttentionPaths({
    focusContext,
    relationships: input.relationships,
  });
  if (!pathResult.ok) {
    setTraceStatus(trace, "attention-path-orchestration", "failed");
    markRemainingNotRun(trace, "attention-path-orchestration");
    return freezeResult({
      ok: false,
      resolution,
      focusContext,
      pathResult: null,
      currentState: null,
      transitionPlan: null,
      snapshot: null,
      stageTrace: freezeTrace(trace),
      issues: Object.freeze([
        freezeIssue({
          stage: "attention-path-orchestration",
          code: "path-orchestration-failed",
          path: "pathResult",
          message: "DRI-6:5 path orchestration failed",
        }),
        ...pathResult.issues.map((entry) => freezeIssue({
          stage: "attention-path-orchestration",
          code: entry.code,
          path: entry.path,
          message: entry.message,
        })),
      ]),
    });
  }
  setTraceStatus(trace, "attention-path-orchestration", "completed");

  const currentState: DirectorRuntimeAttentionTransitionState = Object.freeze({
    focusContext,
    pathResult,
  });
  const snapshot = freezeSnapshot({
    resolution,
    focusContext,
    pathResult,
    transitionState: currentState,
  });

  const snapshotValidation = validateDirectorRuntimeAttentionFocusPlatformSnapshot(
    snapshot,
  );
  if (!snapshotValidation.ok) {
    setTraceStatus(trace, "complete", "failed");
    return freezeResult({
      ok: false,
      resolution,
      focusContext,
      pathResult,
      currentState,
      transitionPlan: null,
      snapshot: null,
      stageTrace: freezeTrace(trace),
      issues: snapshotValidation.issues,
    });
  }

  // Stage 5 — Transition orchestration
  const previousState = input.previousState ?? null;
  let transitionPlan: DirectorRuntimeAttentionTransitionPlan | null = null;

  if (previousState === null || previousState === undefined) {
    setTraceStatus(trace, "attention-transition-orchestration", "not-applicable");
  } else {
    const previousValidation = validateDirectorRuntimeAttentionTransitionState(
      previousState,
    );
    if (!previousValidation.ok) {
      setTraceStatus(trace, "attention-transition-orchestration", "failed");
      setTraceStatus(trace, "complete", "failed");
      issues.push(freezeIssue({
        stage: "attention-transition-orchestration",
        code: "invalid-previous-state",
        path: "input.previousState",
        message: "previous transition state failed DRI-6:6 validation",
      }));
      for (const entry of previousValidation.issues) {
        issues.push(freezeIssue({
          stage: "attention-transition-orchestration",
          code: entry.code,
          path: entry.path,
          message: entry.message,
        }));
      }
      return freezeResult({
        ok: false,
        resolution,
        focusContext,
        pathResult,
        currentState,
        transitionPlan: null,
        snapshot,
        stageTrace: freezeTrace(trace),
        issues: Object.freeze(issues),
      });
    }

    const transitionResult = orchestrateDirectorRuntimeAttentionTransition({
      previous: previousState,
      next: currentState,
    });
    if (!transitionResult.ok || transitionResult.plan === null) {
      setTraceStatus(trace, "attention-transition-orchestration", "failed");
      setTraceStatus(trace, "complete", "failed");
      return freezeResult({
        ok: false,
        resolution,
        focusContext,
        pathResult,
        currentState,
        transitionPlan: null,
        snapshot,
        stageTrace: freezeTrace(trace),
        issues: Object.freeze([
          freezeIssue({
            stage: "attention-transition-orchestration",
            code: "transition-orchestration-failed",
            path: "transitionPlan",
            message: "DRI-6:6 transition orchestration failed",
          }),
          ...transitionResult.issues.map((entry) => freezeIssue({
            stage: "attention-transition-orchestration",
            code: entry.code,
            path: entry.path,
            message: entry.message,
          })),
        ]),
      });
    }
    transitionPlan = transitionResult.plan;
    setTraceStatus(trace, "attention-transition-orchestration", "completed");
  }

  setTraceStatus(trace, "complete", "completed");
  return freezeResult({
    ok: true,
    resolution,
    focusContext,
    pathResult,
    currentState,
    transitionPlan,
    snapshot,
    stageTrace: freezeTrace(trace),
    issues: Object.freeze([]),
  });
}

export function areDirectorRuntimeAttentionFocusPlatformResultsEquivalent(
  left: DirectorRuntimeAttentionFocusPlatformResult,
  right: DirectorRuntimeAttentionFocusPlatformResult,
): boolean {
  return JSON.stringify({
    ok: left.ok,
    resolution: left.resolution,
    focusContext: left.focusContext,
    pathResult: left.pathResult === null ? null : {
      ok: left.pathResult.ok,
      rootSubject: left.pathResult.rootSubject,
      paths: left.pathResult.paths,
      segments: left.pathResult.segments,
      counts: left.pathResult.counts,
    },
    transitionPlan: left.transitionPlan,
    stageTrace: left.stageTrace,
    issues: left.issues,
  }) === JSON.stringify({
    ok: right.ok,
    resolution: right.resolution,
    focusContext: right.focusContext,
    pathResult: right.pathResult === null ? null : {
      ok: right.pathResult.ok,
      rootSubject: right.pathResult.rootSubject,
      paths: right.pathResult.paths,
      segments: right.pathResult.segments,
      counts: right.pathResult.counts,
    },
    transitionPlan: right.transitionPlan,
    stageTrace: right.stageTrace,
    issues: right.issues,
  });
}

// ─── Registry / capabilities ────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_CAPABILITIES =
  Object.freeze([
    "EndToEndAttentionComposition",
    "SignalBatchIntake",
    "PriorityResolutionComposition",
    "FocusContextComposition",
    "AttentionPathComposition",
    "TransitionComposition",
    "PlatformSnapshotCreation",
    "CrossStageValidation",
    "IssuePropagation",
    "DeterministicPipeline",
    "ConsumerStateProduction",
  ] as const);

export const DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_ABSENT_CAPABILITIES =
  Object.freeze([
    "NewPriorityPolicy",
    "NewFocusPolicy",
    "NewPathPolicy",
    "NewTransitionPolicy",
    "PresentationBehavior",
    "SceneMutation",
    "Persistence",
    "Networking",
  ] as const);

export const DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_CONSUMER_GUARANTEES =
  Object.freeze([
    "Deterministic",
    "Immutable",
    "PureComposition",
    "SinglePipelineOrder",
    "UpstreamSemanticAuthority",
    "RendererIndependent",
    "NoSceneMutation",
    "Traceable",
  ] as const);

export const DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_INVARIANTS = Object.freeze([
  Object.freeze({ id: "sole-composition", statement: "platform introduces no new attention semantics" }),
  Object.freeze({ id: "deterministic-pipeline", statement: "identical valid input produces identical output" }),
  Object.freeze({ id: "fixed-stage-order", statement: "stages always execute in canonical order" }),
  Object.freeze({ id: "fail-fast", statement: "invalid stage output prevents downstream composition" }),
  Object.freeze({ id: "primary-consistency", statement: "resolution primary, focus primary, and path root are consistent" }),
  Object.freeze({ id: "trace-preservation", statement: "signal/subject identity remains traceable across stages" }),
  Object.freeze({ id: "snapshot-integrity", statement: "platform snapshot contains mutually consistent outputs" }),
  Object.freeze({ id: "transition-integrity", statement: "transition compares supplied previous with canonical current" }),
  Object.freeze({ id: "input-immutability", statement: "platform input is never mutated" }),
  Object.freeze({ id: "output-immutability", statement: "platform result is immutable" }),
  Object.freeze({ id: "no-priority-duplication", statement: "no DRI-6:3 algorithm is recreated" }),
  Object.freeze({ id: "no-focus-rebinding-duplication", statement: "no DRI-6:4 mapping is recreated" }),
  Object.freeze({ id: "no-path-duplication", statement: "no DRI-6:5 traversal algorithm is recreated" }),
  Object.freeze({ id: "no-transition-duplication", statement: "no DRI-6:6 transition algorithm is recreated" }),
  Object.freeze({ id: "no-presentation-leakage", statement: "no renderer metadata exists" }),
  Object.freeze({ id: "no-scene-mutation", statement: "platform remains declarative" }),
  Object.freeze({ id: "no-persistence-network-effects", statement: "platform performs no external effects" }),
] as const);

export const directorRuntimeAttentionFocusPlatformApiNames = Object.freeze([
  "runDirectorRuntimeAttentionFocusPlatform",
  "validateDirectorRuntimeAttentionFocusPlatformStage",
  "validateDirectorRuntimeAttentionFocusPlatformStageStatus",
  "validateDirectorRuntimeAttentionFocusPlatformIssue",
  "validateDirectorRuntimeAttentionFocusPlatformInput",
  "validateDirectorRuntimeAttentionFocusPlatformSnapshot",
  "validateDirectorRuntimeAttentionFocusPlatformResult",
  "validateDirectorRuntimeAttentionFocusPlatformRegistry",
  "areDirectorRuntimeAttentionFocusPlatformResultsEquivalent",
  "verifyDirectorRuntimeAttentionFocusPlatform",
] as const);

export const directorRuntimeAttentionFocusPlatformPolicy = Object.freeze({
  pipelineOrder: DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_PIPELINE_ORDER,
  failFastPolicy: DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_FAIL_FAST_POLICY,
  transitionAbsencePolicy:
    DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_TRANSITION_ABSENCE_POLICY,
  invalidPreviousPolicy:
    DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_INVALID_PREVIOUS_POLICY,
  introducesNewSemantics: false as const,
  performsPriorityResolution: false as const,
  rebindsFocusContext: false as const,
  discoversPaths: false as const,
  redefinesTransitions: false as const,
  includesTiming: false as const,
  includesPresentation: false as const,
  mutatesScene: false as const,
  persistsState: false as const,
  usesNetworking: false as const,
  usesEventSystem: false as const,
});

export const directorRuntimeAttentionFocusPlatformRegistry = Object.freeze({
  identity: directorRuntimeAttentionFocusPlatformIdentity,
  version: directorRuntimeAttentionFocusPlatformVersion,
  namespace: directorRuntimeAttentionFocusPlatformNamespace,
  dependency: directorRuntimeAttentionFocusPlatformUpstream,
  stages: DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_STAGES,
  stageCount: DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_STAGES.length,
  stageStatuses: DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_STAGE_STATUSES,
  stageStatusCount: DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_STAGE_STATUSES.length,
  pipelineOrder: DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_PIPELINE_ORDER,
  policy: directorRuntimeAttentionFocusPlatformPolicy,
  capabilities: DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_CAPABILITIES,
  capabilityCount: DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_CAPABILITIES.length,
  absentCapabilities: DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_ABSENT_CAPABILITIES,
  consumerGuarantees: DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_CONSUMER_GUARANTEES,
  consumerGuaranteeCount:
    DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_CONSUMER_GUARANTEES.length,
  emptyResult: DIRECTOR_RUNTIME_EMPTY_ATTENTION_FOCUS_PLATFORM_RESULT,
  invariants: DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_INVARIANTS,
  invariantCount: DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_INVARIANTS.length,
  publicApis: directorRuntimeAttentionFocusPlatformApiNames,
  publicApiCount: directorRuntimeAttentionFocusPlatformApiNames.length,
});

export const directorRuntimeAttentionFocusPlatform = Object.freeze({
  phase: "DRI-6:7" as const,
  name: "DirectorRuntimeAttentionFocusPlatform" as const,
  identity: directorRuntimeAttentionFocusPlatformIdentity,
  namespace: directorRuntimeAttentionFocusPlatformNamespace,
  version: directorRuntimeAttentionFocusPlatformVersion,
  layer: "Director Runtime Integration" as const,
  domain: "AttentionFocusOrchestration" as const,
  role: "Platform" as const,
  stage: "Platform" as const,
  status: "PlatformReady" as const,
  upstreamDependency: directorRuntimeAttentionFocusPlatformUpstream,
  deterministic: true as const,
  rendererIndependent: true as const,
  philosophy: "composition-not-semantics" as const,
  policy: directorRuntimeAttentionFocusPlatformPolicy,
  capabilities: DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_CAPABILITIES,
  absentCapabilities: DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_ABSENT_CAPABILITIES,
  consumerGuarantees: DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_CONSUMER_GUARANTEES,
  emptyResult: DIRECTOR_RUNTIME_EMPTY_ATTENTION_FOCUS_PLATFORM_RESULT,
  invariants: DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_INVARIANTS,
  publicApiSurface: directorRuntimeAttentionFocusPlatformApiNames,
  registry: directorRuntimeAttentionFocusPlatformRegistry,
  transitionOrchestrationBoundary:
    "DRI-6:6-attention-transition-orchestration-only" as const,
  architecturalStatus:
    "Established · Composition · Deterministic · Immutable · PlatformReady" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface DirectorRuntimeAttentionFocusPlatformVerification {
  readonly ok: boolean;
  readonly identity: typeof directorRuntimeAttentionFocusPlatformIdentity;
  readonly version: typeof directorRuntimeAttentionFocusPlatformVersion;
  readonly namespace: typeof directorRuntimeAttentionFocusPlatformNamespace;
  readonly dependency: typeof directorRuntimeAttentionFocusPlatformUpstream;
  readonly stageCount: number;
  readonly stageStatusCount: number;
  readonly capabilityCount: number;
  readonly consumerGuaranteeCount: number;
  readonly invariantCount: number;
  readonly frozen: boolean;
}

export function verifyDirectorRuntimeAttentionFocusPlatform():
  DirectorRuntimeAttentionFocusPlatformVerification {
  const layer = directorRuntimeAttentionFocusPlatform;
  const registry = directorRuntimeAttentionFocusPlatformRegistry;
  const ok =
    layer.identity === "DRI-6:7/DirectorRuntimeAttentionFocusPlatform" &&
    layer.version === "6.7.0" &&
    layer.namespace === "nexora.dri.attention-focus.platform" &&
    layer.role === "Platform" &&
    layer.status === "PlatformReady" &&
    layer.upstreamDependency ===
      "DRI-6:6/DirectorRuntimeAttentionTransitionOrchestration" &&
    layer.upstreamDependency ===
      directorRuntimeAttentionTransitionOrchestrationIdentity &&
    registry.dependency === layer.upstreamDependency &&
    DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_STAGES.length === 6 &&
    DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_STAGE_STATUSES.length === 4 &&
    DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_PIPELINE_ORDER[0] ===
      "signal-validation" &&
    DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_PIPELINE_ORDER[5] === "complete" &&
    layer.policy.introducesNewSemantics === false &&
    layer.policy.performsPriorityResolution === false &&
    layer.policy.rebindsFocusContext === false &&
    layer.policy.discoversPaths === false &&
    layer.policy.redefinesTransitions === false &&
    !DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_CAPABILITIES.includes(
      "NewPriorityPolicy" as never,
    ) &&
    Object.isFrozen(layer) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(directorRuntimeAttentionFocusPlatformPolicy) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EMPTY_ATTENTION_FOCUS_PLATFORM_RESULT);

  return Object.freeze({
    ok,
    identity: directorRuntimeAttentionFocusPlatformIdentity,
    version: directorRuntimeAttentionFocusPlatformVersion,
    namespace: directorRuntimeAttentionFocusPlatformNamespace,
    dependency: directorRuntimeAttentionFocusPlatformUpstream,
    stageCount: DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_STAGES.length,
    stageStatusCount:
      DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_STAGE_STATUSES.length,
    capabilityCount: DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_CAPABILITIES.length,
    consumerGuaranteeCount:
      DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_CONSUMER_GUARANTEES.length,
    invariantCount: DIRECTOR_RUNTIME_ATTENTION_FOCUS_PLATFORM_INVARIANTS.length,
    frozen: Object.isFrozen(layer) && Object.isFrozen(registry),
  });
}
