/**
 * DRI-5:3 — Director Runtime Presentation State Resolver.
 *
 * Deterministic semantic resolver for presentation state only:
 * minimum | report | operation.
 *
 * No attention/density/priority/visibility resolution, orchestration,
 * or rendering.
 */

import {
  DIRECTOR_RUNTIME_ATTENTION_LEVELS,
  DIRECTOR_RUNTIME_INFORMATION_DENSITIES,
  DIRECTOR_RUNTIME_INTERACTION_EXPOSURES,
  DIRECTOR_RUNTIME_PRESENTATION_INTENT_SOURCES,
  DIRECTOR_RUNTIME_PRESENTATION_PRIORITIES,
  DIRECTOR_RUNTIME_PRESENTATION_STATES,
  DIRECTOR_RUNTIME_PRESENTATION_VISIBILITIES,
  areDirectorRuntimePresentationIntentsEqual,
  compareDirectorRuntimePresentationIntents,
  createDirectorRuntimePresentationIntent,
  createDirectorRuntimePresentationIntentCollection,
  createDirectorRuntimePresentationIntentSnapshot,
  deriveDirectorRuntimePresentationIntentId,
  directorRuntimePresentationIntentIdentity,
  findDirectorRuntimePresentationIntentById,
  findDirectorRuntimePresentationIntentsBySubjectId,
  isDirectorRuntimeAttentionLevel,
  isDirectorRuntimeInformationDensity,
  isDirectorRuntimeInteractionExposure,
  isDirectorRuntimePresentationIntent,
  isDirectorRuntimePresentationIntentSource,
  isDirectorRuntimePresentationPriority,
  isDirectorRuntimePresentationState,
  isDirectorRuntimePresentationVisibility,
  validateDirectorRuntimePresentationIntent,
  type DirectorRuntimePresentationIntent,
  type DirectorRuntimePresentationState,
  type DirectorRuntimePresentationSubject,
} from "@/app/lib/dri/directorRuntimePresentationIntent";

export {
  DIRECTOR_RUNTIME_ATTENTION_LEVELS,
  DIRECTOR_RUNTIME_INFORMATION_DENSITIES,
  DIRECTOR_RUNTIME_INTERACTION_EXPOSURES,
  DIRECTOR_RUNTIME_PRESENTATION_INTENT_SOURCES,
  DIRECTOR_RUNTIME_PRESENTATION_PRIORITIES,
  DIRECTOR_RUNTIME_PRESENTATION_STATES,
  DIRECTOR_RUNTIME_PRESENTATION_VISIBILITIES,
  areDirectorRuntimePresentationIntentsEqual,
  compareDirectorRuntimePresentationIntents,
  createDirectorRuntimePresentationIntent,
  createDirectorRuntimePresentationIntentCollection,
  createDirectorRuntimePresentationIntentSnapshot,
  deriveDirectorRuntimePresentationIntentId,
  findDirectorRuntimePresentationIntentById,
  findDirectorRuntimePresentationIntentsBySubjectId,
  isDirectorRuntimeAttentionLevel,
  isDirectorRuntimeInformationDensity,
  isDirectorRuntimeInteractionExposure,
  isDirectorRuntimePresentationIntent,
  isDirectorRuntimePresentationIntentSource,
  isDirectorRuntimePresentationPriority,
  isDirectorRuntimePresentationState,
  isDirectorRuntimePresentationVisibility,
  validateDirectorRuntimePresentationIntent,
};

export type {
  DirectorRuntimeAttentionLevel,
  DirectorRuntimeInformationDensity,
  DirectorRuntimeInteractionExposure,
  DirectorRuntimePresentationIntent,
  DirectorRuntimePresentationIntentContextReference,
  DirectorRuntimePresentationIntentReason,
  DirectorRuntimePresentationIntentSource,
  DirectorRuntimePresentationPriority,
  DirectorRuntimePresentationState,
  DirectorRuntimePresentationSubject,
  DirectorRuntimePresentationVisibility,
} from "@/app/lib/dri/directorRuntimePresentationIntent";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimePresentationStateResolverIdentity =
  "DRI-5:3/DirectorRuntimePresentationStateResolver" as const;
export const directorRuntimePresentationStateResolverVersion = "5.3.0" as const;
export const directorRuntimePresentationStateResolverNamespace =
  "nexora.dri.adaptive-presentation.state-resolver" as const;
export const directorRuntimePresentationStateResolverUpstream =
  directorRuntimePresentationIntentIdentity;

export const directorRuntimePresentationStateResolverCanonicalIdentity = Object.freeze({
  identity: directorRuntimePresentationStateResolverIdentity,
  version: directorRuntimePresentationStateResolverVersion,
  namespace: directorRuntimePresentationStateResolverNamespace,
  upstream: directorRuntimePresentationStateResolverUpstream,
});

// ─── Output states (Foundation vocabulary via DRI-5:2) ──────────────────────

export const DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLVER_STATES = Object.freeze([
  "minimum",
  "report",
  "operation",
] as const);

// ─── Resolution signals ─────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_SIGNALS = Object.freeze([
  "presence",
  "report-required",
  "operation-required",
  "preferred-state",
] as const);
export type DirectorRuntimePresentationStateResolutionSignal =
  (typeof DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_SIGNALS)[number];

// ─── Resolution reason codes ────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_REASONS = Object.freeze([
  "operation-required",
  "report-required",
  "preferred-state",
  "default-minimum",
] as const);
export type DirectorRuntimePresentationStateResolutionReason =
  (typeof DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_REASONS)[number];

// ─── Precedence ─────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_PRECEDENCE = Object.freeze([
  "operation-required",
  "report-required",
  "preferred-state",
  "presence",
] as const);

// ─── State rank (semantic capability only) ──────────────────────────────────

export const DIRECTOR_RUNTIME_PRESENTATION_STATE_RANK = Object.freeze({
  minimum: 0,
  report: 1,
  operation: 2,
} as const satisfies Record<DirectorRuntimePresentationState, number>);

export type DirectorRuntimePresentationStateRank =
  (typeof DIRECTOR_RUNTIME_PRESENTATION_STATE_RANK)[DirectorRuntimePresentationState];

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface DirectorRuntimePresentationStateResolutionInput {
  readonly subject: DirectorRuntimePresentationSubject;
  readonly currentIntent?: DirectorRuntimePresentationIntent;
  readonly requiresExecutiveReport: boolean;
  readonly requiresOperation: boolean;
  readonly preferredState?: DirectorRuntimePresentationState;
  readonly reasonCode?: string;
}

export interface DirectorRuntimePresentationStateResolution {
  readonly state: DirectorRuntimePresentationState;
  readonly resolvedBy: DirectorRuntimePresentationStateResolutionSignal;
  readonly reasonCode: DirectorRuntimePresentationStateResolutionReason;
  readonly subject: DirectorRuntimePresentationSubject;
  readonly inputReasonCode?: string;
}

export interface DirectorRuntimePresentationStateTransition {
  readonly from: DirectorRuntimePresentationState;
  readonly to: DirectorRuntimePresentationState;
  readonly changed: boolean;
}

// ─── Validation ─────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_VALIDATION_ISSUE_CODES =
  Object.freeze([
    "missing-subject",
    "invalid-subject-id",
    "invalid-subject-kind",
    "invalid-subject-namespace",
    "invalid-requires-executive-report",
    "invalid-requires-operation",
    "invalid-preferred-state",
    "invalid-reason-code",
    "invalid-current-intent",
  ] as const);
export type DirectorRuntimePresentationStateResolutionValidationIssueCode =
  (typeof DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_VALIDATION_ISSUE_CODES)[number];

export interface DirectorRuntimePresentationStateResolutionValidationIssue {
  readonly code: DirectorRuntimePresentationStateResolutionValidationIssueCode;
  readonly path: string;
  readonly message: string;
}

export interface DirectorRuntimePresentationStateResolutionValidationResult {
  readonly valid: boolean;
  readonly issues: readonly DirectorRuntimePresentationStateResolutionValidationIssue[];
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

export function isDirectorRuntimePresentationStateResolutionSignal(
  value: unknown,
): value is DirectorRuntimePresentationStateResolutionSignal {
  return (DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_SIGNALS as readonly unknown[])
    .includes(value);
}

export function isDirectorRuntimePresentationStateResolutionReason(
  value: unknown,
): value is DirectorRuntimePresentationStateResolutionReason {
  return (DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_REASONS as readonly unknown[])
    .includes(value);
}

function isPresentationState(value: unknown): value is DirectorRuntimePresentationState {
  return (DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLVER_STATES as readonly unknown[])
    .includes(value);
}

function issue(
  code: DirectorRuntimePresentationStateResolutionValidationIssueCode,
  path: string,
  message: string,
): DirectorRuntimePresentationStateResolutionValidationIssue {
  return Object.freeze({ code, path, message });
}

function freezeSubject(
  subject: DirectorRuntimePresentationSubject,
): DirectorRuntimePresentationSubject {
  return Object.freeze({ ...subject });
}

function freezeValidationResult(
  issues: readonly DirectorRuntimePresentationStateResolutionValidationIssue[],
): DirectorRuntimePresentationStateResolutionValidationResult {
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze([...issues]),
  });
}

function collectInputIssues(
  value: unknown,
  path = "input",
): DirectorRuntimePresentationStateResolutionValidationIssue[] {
  if (!isPlainObject(value)) {
    return [issue("missing-subject", path, "resolution input must be a plain object")];
  }

  const issues: DirectorRuntimePresentationStateResolutionValidationIssue[] = [];

  if (!isPlainObject(value.subject)) {
    issues.push(issue("missing-subject", `${path}.subject`, "subject must be a plain object"));
  } else {
    if (!isNonEmptyString(value.subject.subjectId)) {
      issues.push(issue(
        "invalid-subject-id",
        `${path}.subject.subjectId`,
        "subjectId must be a non-empty string",
      ));
    }
    if (!isNonEmptyString(value.subject.subjectKind)) {
      issues.push(issue(
        "invalid-subject-kind",
        `${path}.subject.subjectKind`,
        "subjectKind must be a non-empty string",
      ));
    }
    if (
      value.subject.namespace !== undefined &&
      !isNonEmptyString(value.subject.namespace)
    ) {
      issues.push(issue(
        "invalid-subject-namespace",
        `${path}.subject.namespace`,
        "namespace must be a non-empty string when provided",
      ));
    }
  }

  if (typeof value.requiresExecutiveReport !== "boolean") {
    issues.push(issue(
      "invalid-requires-executive-report",
      `${path}.requiresExecutiveReport`,
      "requiresExecutiveReport must be a boolean",
    ));
  }

  if (typeof value.requiresOperation !== "boolean") {
    issues.push(issue(
      "invalid-requires-operation",
      `${path}.requiresOperation`,
      "requiresOperation must be a boolean",
    ));
  }

  if (value.preferredState !== undefined && !isPresentationState(value.preferredState)) {
    issues.push(issue(
      "invalid-preferred-state",
      `${path}.preferredState`,
      "preferredState must be a canonical presentation state when provided",
    ));
  }

  if (value.reasonCode !== undefined && !isNonEmptyString(value.reasonCode)) {
    issues.push(issue(
      "invalid-reason-code",
      `${path}.reasonCode`,
      "reasonCode must be a non-empty string when provided",
    ));
  }

  if (
    value.currentIntent !== undefined &&
    !isDirectorRuntimePresentationIntent(value.currentIntent)
  ) {
    issues.push(issue(
      "invalid-current-intent",
      `${path}.currentIntent`,
      "currentIntent must be a structurally valid presentation intent when provided",
    ));
  }

  return issues;
}

export function validateDirectorRuntimePresentationStateResolutionInput(
  value: unknown,
): DirectorRuntimePresentationStateResolutionValidationResult {
  return freezeValidationResult(collectInputIssues(value));
}

// ─── Resolver ───────────────────────────────────────────────────────────────

/**
 * Canonical precedence:
 * 1. operation-required
 * 2. report-required
 * 3. preferred-state
 * 4. presence / default-minimum
 *
 * currentIntent.state is never sticky and never consulted for requirements.
 */
export function resolveDirectorRuntimePresentationState(
  input: DirectorRuntimePresentationStateResolutionInput,
): DirectorRuntimePresentationStateResolution {
  const validation = validateDirectorRuntimePresentationStateResolutionInput(input);
  if (!validation.valid) {
    const first = validation.issues[0]!;
    throw new TypeError(`${first.code}: ${first.message}`);
  }

  const subject = freezeSubject(input.subject);
  const inputReasonCode = input.reasonCode;

  if (input.requiresOperation) {
    return Object.freeze({
      state: "operation" as const,
      resolvedBy: "operation-required" as const,
      reasonCode: "operation-required" as const,
      subject,
      ...(inputReasonCode === undefined ? {} : { inputReasonCode }),
    });
  }

  if (input.requiresExecutiveReport) {
    return Object.freeze({
      state: "report" as const,
      resolvedBy: "report-required" as const,
      reasonCode: "report-required" as const,
      subject,
      ...(inputReasonCode === undefined ? {} : { inputReasonCode }),
    });
  }

  if (input.preferredState !== undefined) {
    return Object.freeze({
      state: input.preferredState,
      resolvedBy: "preferred-state" as const,
      reasonCode: "preferred-state" as const,
      subject,
      ...(inputReasonCode === undefined ? {} : { inputReasonCode }),
    });
  }

  return Object.freeze({
    state: "minimum" as const,
    resolvedBy: "presence" as const,
    reasonCode: "default-minimum" as const,
    subject,
    ...(inputReasonCode === undefined ? {} : { inputReasonCode }),
  });
}

/** Subject-local batch resolution. Preserves input order. No cross-subject effects. */
export function resolveDirectorRuntimePresentationStates(
  inputs: readonly DirectorRuntimePresentationStateResolutionInput[],
): readonly DirectorRuntimePresentationStateResolution[] {
  return Object.freeze(inputs.map((entry) => resolveDirectorRuntimePresentationState(entry)));
}

// ─── Transition & rank helpers ──────────────────────────────────────────────

export function describeDirectorRuntimePresentationStateTransition(
  from: DirectorRuntimePresentationState,
  to: DirectorRuntimePresentationState,
): DirectorRuntimePresentationStateTransition {
  if (!isPresentationState(from) || !isPresentationState(to)) {
    throw new TypeError("from and to must be canonical presentation states");
  }
  return Object.freeze({
    from,
    to,
    changed: from !== to,
  });
}

export function getDirectorRuntimePresentationStateRank(
  state: DirectorRuntimePresentationState,
): DirectorRuntimePresentationStateRank {
  if (!isPresentationState(state)) {
    throw new TypeError("state must be a canonical presentation state");
  }
  return DIRECTOR_RUNTIME_PRESENTATION_STATE_RANK[state];
}

/** Negative if a < b, zero if equal, positive if a > b (semantic capability rank). */
export function compareDirectorRuntimePresentationStates(
  left: DirectorRuntimePresentationState,
  right: DirectorRuntimePresentationState,
): number {
  return getDirectorRuntimePresentationStateRank(left) -
    getDirectorRuntimePresentationStateRank(right);
}

export function isDirectorRuntimePresentationStateAtLeast(
  state: DirectorRuntimePresentationState,
  minimum: DirectorRuntimePresentationState,
): boolean {
  return compareDirectorRuntimePresentationStates(state, minimum) >= 0;
}

// ─── Invariants ─────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLVER_INVARIANTS = Object.freeze([
  Object.freeze({
    id: "three-output-states",
    statement: "exactly three output states exist",
  }),
  Object.freeze({
    id: "foundation-vocabulary-output",
    statement: "output state always belongs to Foundation vocabulary",
  }),
  Object.freeze({
    id: "operation-highest-precedence",
    statement: "operation requirement has highest precedence",
  }),
  Object.freeze({
    id: "report-over-preferred",
    statement: "report requirement has precedence over preferred state",
  }),
  Object.freeze({
    id: "preferred-over-default",
    statement: "preferred state has precedence over default",
  }),
  Object.freeze({
    id: "default-minimum",
    statement: "default state is minimum",
  }),
  Object.freeze({
    id: "deterministic-output",
    statement: "resolver output is deterministic",
  }),
  Object.freeze({
    id: "input-not-mutated",
    statement: "input is not mutated",
  }),
  Object.freeze({
    id: "result-immutable",
    statement: "result is immutable",
  }),
  Object.freeze({
    id: "subject-local",
    statement: "state resolution is subject-local",
  }),
  Object.freeze({
    id: "current-state-not-sticky",
    statement: "current state is not automatically sticky",
  }),
  Object.freeze({
    id: "no-hysteresis",
    statement: "no hysteresis exists",
  }),
  Object.freeze({
    id: "attention-independent",
    statement: "attention does not resolve state",
  }),
  Object.freeze({
    id: "density-independent",
    statement: "density does not resolve state",
  }),
  Object.freeze({
    id: "priority-independent",
    statement: "priority does not resolve state",
  }),
  Object.freeze({
    id: "visibility-independent",
    statement: "visibility does not resolve state",
  }),
  Object.freeze({
    id: "no-rendering",
    statement: "rendering does not occur",
  }),
  Object.freeze({
    id: "no-animation",
    statement: "animation does not occur",
  }),
  Object.freeze({
    id: "no-orchestration",
    statement: "orchestration does not occur",
  }),
  Object.freeze({
    id: "side-effect-free",
    statement: "resolver is side-effect free",
  }),
  Object.freeze({
    id: "sole-immediate-dependency",
    statement: "exactly one immediate dependency exists",
  }),
  Object.freeze({
    id: "dependency-is-dri-5-2",
    statement: "sole dependency is DRI-5:2",
  }),
  Object.freeze({
    id: "invalid-inputs-detectable",
    statement: "invalid inputs are structurally detectable",
  }),
  Object.freeze({
    id: "batch-preserves-order",
    statement: "batch resolution preserves order",
  }),
  Object.freeze({
    id: "rank-semantic-capability-only",
    statement: "state rank represents semantic capability only",
  }),
] as const);

// ─── Registry ───────────────────────────────────────────────────────────────

export const directorRuntimePresentationStateResolverApiNames = Object.freeze([
  "isDirectorRuntimePresentationStateResolutionSignal",
  "isDirectorRuntimePresentationStateResolutionReason",
  "validateDirectorRuntimePresentationStateResolutionInput",
  "resolveDirectorRuntimePresentationState",
  "resolveDirectorRuntimePresentationStates",
  "describeDirectorRuntimePresentationStateTransition",
  "getDirectorRuntimePresentationStateRank",
  "compareDirectorRuntimePresentationStates",
  "isDirectorRuntimePresentationStateAtLeast",
  "verifyDirectorRuntimePresentationStateResolver",
] as const);

export const directorRuntimePresentationStateResolverRegistry = Object.freeze({
  identity: directorRuntimePresentationStateResolverIdentity,
  version: directorRuntimePresentationStateResolverVersion,
  namespace: directorRuntimePresentationStateResolverNamespace,
  dependency: directorRuntimePresentationStateResolverUpstream,
  states: DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLVER_STATES,
  stateCount: DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLVER_STATES.length,
  signals: DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_SIGNALS,
  signalCount: DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_SIGNALS.length,
  reasonCodes: DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_REASONS,
  reasonCodeCount: DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_REASONS.length,
  precedence: DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_PRECEDENCE,
  precedenceRuleCount: DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_PRECEDENCE.length,
  stateRank: DIRECTOR_RUNTIME_PRESENTATION_STATE_RANK,
  defaultState: "minimum" as const,
  highestPrecedenceRequirement: "operation-required" as const,
  invariants: DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLVER_INVARIANTS,
  invariantCount: DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLVER_INVARIANTS.length,
  publicApis: directorRuntimePresentationStateResolverApiNames,
  publicApiCount: directorRuntimePresentationStateResolverApiNames.length,
});

export const directorRuntimePresentationStateResolver = Object.freeze({
  phase: "DRI-5:3" as const,
  name: "DirectorRuntimePresentationStateResolver" as const,
  identity: directorRuntimePresentationStateResolverIdentity,
  namespace: directorRuntimePresentationStateResolverNamespace,
  version: directorRuntimePresentationStateResolverVersion,
  layer: "DirectorRuntimeAdaptivePresentation" as const,
  stage: "PresentationStateResolver" as const,
  status: "StateResolverReady" as const,
  upstreamDependency: directorRuntimePresentationStateResolverUpstream,
  deterministic: true as const,
  immutable: true as const,
  rendererIndependent: true as const,
  semantic: true as const,
  philosophy: "state-resolution-not-appearance" as const,
  states: DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLVER_STATES,
  signals: DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_SIGNALS,
  reasonCodes: DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_REASONS,
  precedence: DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_PRECEDENCE,
  stateRank: DIRECTOR_RUNTIME_PRESENTATION_STATE_RANK,
  invariants: DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLVER_INVARIANTS,
  publicApiSurface: directorRuntimePresentationStateResolverApiNames,
  registry: directorRuntimePresentationStateResolverRegistry,
  intentBoundary: "DRI-5:2-presentation-intent-only" as const,
  architecturalStatus:
    "Established · Deterministic · Immutable · Semantic · RendererIndependent · ReadyForAttentionPolicy" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface DirectorRuntimePresentationStateResolverVerification {
  readonly ok: boolean;
  readonly identity: typeof directorRuntimePresentationStateResolverIdentity;
  readonly version: typeof directorRuntimePresentationStateResolverVersion;
  readonly namespace: typeof directorRuntimePresentationStateResolverNamespace;
  readonly dependency: typeof directorRuntimePresentationStateResolverUpstream;
  readonly presentationStateCount: number;
  readonly resolutionSignalCount: number;
  readonly resolutionReasonCount: number;
  readonly precedenceRuleCount: number;
  readonly invariantCount: number;
  readonly frozen: boolean;
}

function exactOrder<T extends string>(
  actual: readonly T[],
  expected: readonly T[],
): boolean {
  return actual.length === expected.length &&
    actual.every((value, index) => value === expected[index]);
}

export function verifyDirectorRuntimePresentationStateResolver():
  DirectorRuntimePresentationStateResolverVerification {
  const layer = directorRuntimePresentationStateResolver;
  const registry = directorRuntimePresentationStateResolverRegistry;

  const ok =
    layer.identity === "DRI-5:3/DirectorRuntimePresentationStateResolver" &&
    layer.version === "5.3.0" &&
    layer.namespace === "nexora.dri.adaptive-presentation.state-resolver" &&
    layer.upstreamDependency === "DRI-5:2/DirectorRuntimePresentationIntent" &&
    layer.upstreamDependency === directorRuntimePresentationIntentIdentity &&
    registry.dependency === layer.upstreamDependency &&
    exactOrder(
      DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLVER_STATES,
      ["minimum", "report", "operation"],
    ) &&
    exactOrder(
      DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_SIGNALS,
      ["presence", "report-required", "operation-required", "preferred-state"],
    ) &&
    exactOrder(
      DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_REASONS,
      ["operation-required", "report-required", "preferred-state", "default-minimum"],
    ) &&
    exactOrder(
      DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_PRECEDENCE,
      ["operation-required", "report-required", "preferred-state", "presence"],
    ) &&
    DIRECTOR_RUNTIME_PRESENTATION_STATE_RANK.minimum === 0 &&
    DIRECTOR_RUNTIME_PRESENTATION_STATE_RANK.report === 1 &&
    DIRECTOR_RUNTIME_PRESENTATION_STATE_RANK.operation === 2 &&
    registry.stateCount === 3 &&
    registry.signalCount === 4 &&
    registry.reasonCodeCount === 4 &&
    registry.precedenceRuleCount === 4 &&
    registry.invariantCount === 25 &&
    registry.defaultState === "minimum" &&
    registry.highestPrecedenceRequirement === "operation-required" &&
    Object.isFrozen(layer) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLVER_STATES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_SIGNALS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_REASONS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_PRECEDENCE) &&
    Object.isFrozen(DIRECTOR_RUNTIME_PRESENTATION_STATE_RANK) &&
    Object.isFrozen(DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLVER_INVARIANTS);

  return Object.freeze({
    ok,
    identity: directorRuntimePresentationStateResolverIdentity,
    version: directorRuntimePresentationStateResolverVersion,
    namespace: directorRuntimePresentationStateResolverNamespace,
    dependency: directorRuntimePresentationStateResolverUpstream,
    presentationStateCount: DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLVER_STATES.length,
    resolutionSignalCount: DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_SIGNALS.length,
    resolutionReasonCount: DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_REASONS.length,
    precedenceRuleCount: DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_PRECEDENCE.length,
    invariantCount: DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLVER_INVARIANTS.length,
    frozen: Object.isFrozen(layer) && Object.isFrozen(registry),
  });
}
