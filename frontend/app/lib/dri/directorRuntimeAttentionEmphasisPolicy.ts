/**
 * DRI-5:4 — Director Runtime Attention & Emphasis Policy.
 *
 * Deterministic semantic policy for attention level and emphasis level.
 * Consumes risk/action/exception signals — does not calculate them.
 * No density, priority, visibility, orchestration, or rendering.
 */

import {
  DIRECTOR_RUNTIME_ATTENTION_LEVELS,
  DIRECTOR_RUNTIME_INFORMATION_DENSITIES,
  DIRECTOR_RUNTIME_INTERACTION_EXPOSURES,
  DIRECTOR_RUNTIME_PRESENTATION_INTENT_SOURCES,
  DIRECTOR_RUNTIME_PRESENTATION_PRIORITIES,
  DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_REASONS,
  DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_SIGNALS,
  DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLVER_STATES,
  DIRECTOR_RUNTIME_PRESENTATION_STATES,
  DIRECTOR_RUNTIME_PRESENTATION_VISIBILITIES,
  areDirectorRuntimePresentationIntentsEqual,
  compareDirectorRuntimePresentationIntents,
  compareDirectorRuntimePresentationStates,
  createDirectorRuntimePresentationIntent,
  createDirectorRuntimePresentationIntentCollection,
  createDirectorRuntimePresentationIntentSnapshot,
  deriveDirectorRuntimePresentationIntentId,
  describeDirectorRuntimePresentationStateTransition,
  directorRuntimePresentationStateResolverIdentity,
  findDirectorRuntimePresentationIntentById,
  findDirectorRuntimePresentationIntentsBySubjectId,
  getDirectorRuntimePresentationStateRank,
  isDirectorRuntimeAttentionLevel,
  isDirectorRuntimeInformationDensity,
  isDirectorRuntimeInteractionExposure,
  isDirectorRuntimePresentationIntent,
  isDirectorRuntimePresentationIntentSource,
  isDirectorRuntimePresentationPriority,
  isDirectorRuntimePresentationState,
  isDirectorRuntimePresentationStateAtLeast,
  isDirectorRuntimePresentationVisibility,
  resolveDirectorRuntimePresentationState,
  resolveDirectorRuntimePresentationStates,
  validateDirectorRuntimePresentationIntent,
  validateDirectorRuntimePresentationStateResolutionInput,
  type DirectorRuntimeAttentionLevel,
  type DirectorRuntimePresentationStateResolution,
  type DirectorRuntimePresentationSubject,
} from "@/app/lib/dri/directorRuntimePresentationStateResolver";

export {
  DIRECTOR_RUNTIME_ATTENTION_LEVELS,
  DIRECTOR_RUNTIME_INFORMATION_DENSITIES,
  DIRECTOR_RUNTIME_INTERACTION_EXPOSURES,
  DIRECTOR_RUNTIME_PRESENTATION_INTENT_SOURCES,
  DIRECTOR_RUNTIME_PRESENTATION_PRIORITIES,
  DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_REASONS,
  DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_SIGNALS,
  DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLVER_STATES,
  DIRECTOR_RUNTIME_PRESENTATION_STATES,
  DIRECTOR_RUNTIME_PRESENTATION_VISIBILITIES,
  areDirectorRuntimePresentationIntentsEqual,
  compareDirectorRuntimePresentationIntents,
  compareDirectorRuntimePresentationStates,
  createDirectorRuntimePresentationIntent,
  createDirectorRuntimePresentationIntentCollection,
  createDirectorRuntimePresentationIntentSnapshot,
  deriveDirectorRuntimePresentationIntentId,
  describeDirectorRuntimePresentationStateTransition,
  findDirectorRuntimePresentationIntentById,
  findDirectorRuntimePresentationIntentsBySubjectId,
  getDirectorRuntimePresentationStateRank,
  isDirectorRuntimeAttentionLevel,
  isDirectorRuntimeInformationDensity,
  isDirectorRuntimeInteractionExposure,
  isDirectorRuntimePresentationIntent,
  isDirectorRuntimePresentationIntentSource,
  isDirectorRuntimePresentationPriority,
  isDirectorRuntimePresentationState,
  isDirectorRuntimePresentationStateAtLeast,
  isDirectorRuntimePresentationVisibility,
  resolveDirectorRuntimePresentationState,
  resolveDirectorRuntimePresentationStates,
  validateDirectorRuntimePresentationIntent,
  validateDirectorRuntimePresentationStateResolutionInput,
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
  DirectorRuntimePresentationStateResolution,
  DirectorRuntimePresentationSubject,
  DirectorRuntimePresentationVisibility,
} from "@/app/lib/dri/directorRuntimePresentationStateResolver";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeAttentionEmphasisPolicyIdentity =
  "DRI-5:4/DirectorRuntimeAttentionEmphasisPolicy" as const;
export const directorRuntimeAttentionEmphasisPolicyVersion = "5.4.0" as const;
export const directorRuntimeAttentionEmphasisPolicyNamespace =
  "nexora.dri.adaptive-presentation.attention-emphasis-policy" as const;
export const directorRuntimeAttentionEmphasisPolicyUpstream =
  directorRuntimePresentationStateResolverIdentity;

export const directorRuntimeAttentionEmphasisPolicyCanonicalIdentity = Object.freeze({
  identity: directorRuntimeAttentionEmphasisPolicyIdentity,
  version: directorRuntimeAttentionEmphasisPolicyVersion,
  namespace: directorRuntimeAttentionEmphasisPolicyNamespace,
  upstream: directorRuntimeAttentionEmphasisPolicyUpstream,
});

// ─── Emphasis levels ────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EMPHASIS_LEVELS = Object.freeze([
  "none",
  "subtle",
  "prominent",
  "dominant",
] as const);
export type DirectorRuntimeEmphasisLevel =
  (typeof DIRECTOR_RUNTIME_EMPHASIS_LEVELS)[number];

// ─── Attention signals ──────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ATTENTION_SIGNALS = Object.freeze([
  "baseline",
  "informational",
  "risk",
  "action-required",
  "exception",
  "explicit-director",
] as const);
export type DirectorRuntimeAttentionSignal =
  (typeof DIRECTOR_RUNTIME_ATTENTION_SIGNALS)[number];

// ─── Attention reason codes ─────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ATTENTION_REASONS = Object.freeze([
  "exception",
  "action-required",
  "risk",
  "explicit-director",
  "informational",
  "baseline",
] as const);
export type DirectorRuntimeAttentionReason =
  (typeof DIRECTOR_RUNTIME_ATTENTION_REASONS)[number];

// ─── Precedence ─────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ATTENTION_PRECEDENCE = Object.freeze([
  "exception",
  "action-required",
  "risk",
  "explicit-director",
  "informational",
  "baseline",
] as const);

// ─── Ranks ──────────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ATTENTION_RANK = Object.freeze({
  normal: 0,
  notice: 1,
  warning: 2,
  critical: 3,
} as const satisfies Record<DirectorRuntimeAttentionLevel, number>);

export type DirectorRuntimeAttentionRank =
  (typeof DIRECTOR_RUNTIME_ATTENTION_RANK)[DirectorRuntimeAttentionLevel];

export const DIRECTOR_RUNTIME_EMPHASIS_RANK = Object.freeze({
  none: 0,
  subtle: 1,
  prominent: 2,
  dominant: 3,
} as const satisfies Record<DirectorRuntimeEmphasisLevel, number>);

export type DirectorRuntimeEmphasisRank =
  (typeof DIRECTOR_RUNTIME_EMPHASIS_RANK)[DirectorRuntimeEmphasisLevel];

/** Canonical semantic attention → emphasis mapping. */
export const DIRECTOR_RUNTIME_ATTENTION_EMPHASIS_MAPPING = Object.freeze({
  normal: "none",
  notice: "subtle",
  warning: "prominent",
  critical: "dominant",
} as const satisfies Record<DirectorRuntimeAttentionLevel, DirectorRuntimeEmphasisLevel>);

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface DirectorRuntimeAttentionPolicyInput {
  readonly subject: DirectorRuntimePresentationSubject;
  readonly resolvedState: DirectorRuntimePresentationStateResolution;
  readonly signal: DirectorRuntimeAttentionSignal;
  readonly requestedAttention?: DirectorRuntimeAttentionLevel;
  readonly riskPresent: boolean;
  readonly actionRequired: boolean;
  readonly exceptionPresent: boolean;
  readonly reasonCode?: string;
}

export interface DirectorRuntimeAttentionResolution {
  readonly attention: DirectorRuntimeAttentionLevel;
  readonly resolvedBy: DirectorRuntimeAttentionSignal;
  readonly reasonCode: DirectorRuntimeAttentionReason;
  readonly subject: DirectorRuntimePresentationSubject;
  readonly inputReasonCode?: string;
}

export interface DirectorRuntimeEmphasisResolution {
  readonly emphasis: DirectorRuntimeEmphasisLevel;
  readonly attention: DirectorRuntimeAttentionLevel;
  readonly reasonCode: "attention-emphasis-mapping";
}

export interface DirectorRuntimeAttentionEmphasisPolicyResult {
  readonly attention: DirectorRuntimeAttentionResolution;
  readonly emphasis: DirectorRuntimeEmphasisResolution;
}

// ─── Validation ─────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ATTENTION_POLICY_VALIDATION_ISSUE_CODES = Object.freeze([
  "missing-subject",
  "invalid-subject-id",
  "invalid-subject-kind",
  "invalid-subject-namespace",
  "invalid-resolved-state",
  "invalid-attention-signal",
  "invalid-requested-attention",
  "invalid-risk-present",
  "invalid-action-required",
  "invalid-exception-present",
  "invalid-reason-code",
] as const);
export type DirectorRuntimeAttentionPolicyValidationIssueCode =
  (typeof DIRECTOR_RUNTIME_ATTENTION_POLICY_VALIDATION_ISSUE_CODES)[number];

export interface DirectorRuntimeAttentionPolicyValidationIssue {
  readonly code: DirectorRuntimeAttentionPolicyValidationIssueCode;
  readonly path: string;
  readonly message: string;
}

export interface DirectorRuntimeAttentionPolicyValidationResult {
  readonly valid: boolean;
  readonly issues: readonly DirectorRuntimeAttentionPolicyValidationIssue[];
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

export function isDirectorRuntimeEmphasisLevel(
  value: unknown,
): value is DirectorRuntimeEmphasisLevel {
  return (DIRECTOR_RUNTIME_EMPHASIS_LEVELS as readonly unknown[]).includes(value);
}

export function isDirectorRuntimeAttentionSignal(
  value: unknown,
): value is DirectorRuntimeAttentionSignal {
  return (DIRECTOR_RUNTIME_ATTENTION_SIGNALS as readonly unknown[]).includes(value);
}

export function isDirectorRuntimeAttentionReason(
  value: unknown,
): value is DirectorRuntimeAttentionReason {
  return (DIRECTOR_RUNTIME_ATTENTION_REASONS as readonly unknown[]).includes(value);
}

function issue(
  code: DirectorRuntimeAttentionPolicyValidationIssueCode,
  path: string,
  message: string,
): DirectorRuntimeAttentionPolicyValidationIssue {
  return Object.freeze({ code, path, message });
}

function freezeSubject(
  subject: DirectorRuntimePresentationSubject,
): DirectorRuntimePresentationSubject {
  return Object.freeze({ ...subject });
}

function freezeValidationResult(
  issues: readonly DirectorRuntimeAttentionPolicyValidationIssue[],
): DirectorRuntimeAttentionPolicyValidationResult {
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze([...issues]),
  });
}

function isValidResolvedState(
  value: unknown,
): value is DirectorRuntimePresentationStateResolution {
  if (!isPlainObject(value)) return false;
  if (!(DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLVER_STATES as readonly unknown[])
    .includes(value.state)) {
    return false;
  }
  if (!(DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_SIGNALS as readonly unknown[])
    .includes(value.resolvedBy)) {
    return false;
  }
  if (!(DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_REASONS as readonly unknown[])
    .includes(value.reasonCode)) {
    return false;
  }
  if (!isPlainObject(value.subject)) return false;
  if (!isNonEmptyString(value.subject.subjectId)) return false;
  if (!isNonEmptyString(value.subject.subjectKind)) return false;
  if (
    value.subject.namespace !== undefined &&
    !isNonEmptyString(value.subject.namespace)
  ) {
    return false;
  }
  if (value.inputReasonCode !== undefined && !isNonEmptyString(value.inputReasonCode)) {
    return false;
  }
  return true;
}

function collectInputIssues(
  value: unknown,
  path = "input",
): DirectorRuntimeAttentionPolicyValidationIssue[] {
  if (!isPlainObject(value)) {
    return [issue("missing-subject", path, "attention policy input must be a plain object")];
  }

  const issues: DirectorRuntimeAttentionPolicyValidationIssue[] = [];

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

  if (!isValidResolvedState(value.resolvedState)) {
    issues.push(issue(
      "invalid-resolved-state",
      `${path}.resolvedState`,
      "resolvedState must be a structurally valid presentation state resolution",
    ));
  }

  if (!isDirectorRuntimeAttentionSignal(value.signal)) {
    issues.push(issue(
      "invalid-attention-signal",
      `${path}.signal`,
      "signal must be a canonical attention signal",
    ));
  }

  if (
    value.requestedAttention !== undefined &&
    !isDirectorRuntimeAttentionLevel(value.requestedAttention)
  ) {
    issues.push(issue(
      "invalid-requested-attention",
      `${path}.requestedAttention`,
      "requestedAttention must be a canonical attention level when provided",
    ));
  }

  if (typeof value.riskPresent !== "boolean") {
    issues.push(issue(
      "invalid-risk-present",
      `${path}.riskPresent`,
      "riskPresent must be a boolean",
    ));
  }

  if (typeof value.actionRequired !== "boolean") {
    issues.push(issue(
      "invalid-action-required",
      `${path}.actionRequired`,
      "actionRequired must be a boolean",
    ));
  }

  if (typeof value.exceptionPresent !== "boolean") {
    issues.push(issue(
      "invalid-exception-present",
      `${path}.exceptionPresent`,
      "exceptionPresent must be a boolean",
    ));
  }

  if (value.reasonCode !== undefined && !isNonEmptyString(value.reasonCode)) {
    issues.push(issue(
      "invalid-reason-code",
      `${path}.reasonCode`,
      "reasonCode must be a non-empty string when provided",
    ));
  }

  return issues;
}

export function validateDirectorRuntimeAttentionPolicyInput(
  value: unknown,
): DirectorRuntimeAttentionPolicyValidationResult {
  return freezeValidationResult(collectInputIssues(value));
}

// ─── Attention / emphasis helpers ───────────────────────────────────────────

export function getDirectorRuntimeAttentionRank(
  attention: DirectorRuntimeAttentionLevel,
): DirectorRuntimeAttentionRank {
  if (!isDirectorRuntimeAttentionLevel(attention)) {
    throw new TypeError("attention must be a canonical attention level");
  }
  return DIRECTOR_RUNTIME_ATTENTION_RANK[attention];
}

export function compareDirectorRuntimeAttentionLevels(
  left: DirectorRuntimeAttentionLevel,
  right: DirectorRuntimeAttentionLevel,
): number {
  return getDirectorRuntimeAttentionRank(left) - getDirectorRuntimeAttentionRank(right);
}

export function isDirectorRuntimeAttentionAtLeast(
  attention: DirectorRuntimeAttentionLevel,
  minimum: DirectorRuntimeAttentionLevel,
): boolean {
  return compareDirectorRuntimeAttentionLevels(attention, minimum) >= 0;
}

export function getDirectorRuntimeEmphasisRank(
  emphasis: DirectorRuntimeEmphasisLevel,
): DirectorRuntimeEmphasisRank {
  if (!isDirectorRuntimeEmphasisLevel(emphasis)) {
    throw new TypeError("emphasis must be a canonical emphasis level");
  }
  return DIRECTOR_RUNTIME_EMPHASIS_RANK[emphasis];
}

export function compareDirectorRuntimeEmphasisLevels(
  left: DirectorRuntimeEmphasisLevel,
  right: DirectorRuntimeEmphasisLevel,
): number {
  return getDirectorRuntimeEmphasisRank(left) - getDirectorRuntimeEmphasisRank(right);
}

function maxAttention(
  left: DirectorRuntimeAttentionLevel,
  right: DirectorRuntimeAttentionLevel,
): DirectorRuntimeAttentionLevel {
  return compareDirectorRuntimeAttentionLevels(left, right) >= 0 ? left : right;
}

// ─── Resolution ─────────────────────────────────────────────────────────────

/**
 * Canonical precedence:
 * exception > action-required > risk > explicit-director > informational > baseline
 *
 * Stronger required floors cannot be downgraded by weaker requested attention.
 * Stronger valid requested attention is preserved above the floor.
 * Presentation state does not determine attention.
 */
export function resolveDirectorRuntimeAttention(
  input: DirectorRuntimeAttentionPolicyInput,
): DirectorRuntimeAttentionResolution {
  const validation = validateDirectorRuntimeAttentionPolicyInput(input);
  if (!validation.valid) {
    const first = validation.issues[0]!;
    throw new TypeError(`${first.code}: ${first.message}`);
  }

  const subject = freezeSubject(input.subject);
  const inputReasonCode = input.reasonCode;

  let floor: DirectorRuntimeAttentionLevel = "normal";
  let floorBy: DirectorRuntimeAttentionSignal = "baseline";
  let floorReason: DirectorRuntimeAttentionReason = "baseline";

  if (input.exceptionPresent) {
    floor = "critical";
    floorBy = "exception" satisfies DirectorRuntimeAttentionSignal;
    floorReason = "exception" satisfies DirectorRuntimeAttentionReason;
  } else if (input.actionRequired) {
    floor = "warning";
    floorBy = "action-required";
    floorReason = "action-required";
  } else if (input.riskPresent) {
    floor = "warning";
    floorBy = "risk";
    floorReason = "risk";
  } else if (input.signal === "informational") {
    floor = "notice";
    floorBy = "informational";
    floorReason = "informational";
  } else {
    floor = "normal";
    floorBy = "baseline";
    floorReason = "baseline";
  }

  let attention: DirectorRuntimeAttentionLevel = floor;
  let resolvedBy: DirectorRuntimeAttentionSignal = floorBy;
  let reasonCode: DirectorRuntimeAttentionReason = floorReason;

  if (input.requestedAttention !== undefined && !input.exceptionPresent) {
    const combined = maxAttention(floor, input.requestedAttention);
    attention = combined;
    if (
      combined === input.requestedAttention &&
      compareDirectorRuntimeAttentionLevels(input.requestedAttention, floor) > 0
    ) {
      resolvedBy = "explicit-director";
      reasonCode = "explicit-director";
    }
  } else if (
    input.requestedAttention !== undefined &&
    input.exceptionPresent &&
    input.requestedAttention === "critical"
  ) {
    attention = "critical";
    resolvedBy = "exception";
    reasonCode = "exception";
  }

  return Object.freeze({
    attention,
    resolvedBy,
    reasonCode,
    subject,
    ...(inputReasonCode === undefined ? {} : { inputReasonCode }),
  });
}

export function resolveDirectorRuntimeEmphasis(
  attention: DirectorRuntimeAttentionLevel | DirectorRuntimeAttentionResolution,
): DirectorRuntimeEmphasisResolution {
  const level = typeof attention === "string" ? attention : attention.attention;
  if (!isDirectorRuntimeAttentionLevel(level)) {
    throw new TypeError("attention must be a canonical attention level");
  }
  return Object.freeze({
    emphasis: DIRECTOR_RUNTIME_ATTENTION_EMPHASIS_MAPPING[level],
    attention: level,
    reasonCode: "attention-emphasis-mapping" as const,
  });
}

export function resolveDirectorRuntimeAttentionEmphasisPolicy(
  input: DirectorRuntimeAttentionPolicyInput,
): DirectorRuntimeAttentionEmphasisPolicyResult {
  const attention = resolveDirectorRuntimeAttention(input);
  const emphasis = resolveDirectorRuntimeEmphasis(attention);
  return Object.freeze({ attention, emphasis });
}

/** Subject-local batch evaluation. Preserves input order. No cross-subject ranking. */
export function resolveDirectorRuntimeAttentionEmphasisPolicies(
  inputs: readonly DirectorRuntimeAttentionPolicyInput[],
): readonly DirectorRuntimeAttentionEmphasisPolicyResult[] {
  return Object.freeze(
    inputs.map((entry) => resolveDirectorRuntimeAttentionEmphasisPolicy(entry)),
  );
}

// ─── Invariants ─────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ATTENTION_EMPHASIS_POLICY_INVARIANTS = Object.freeze([
  Object.freeze({
    id: "four-attention-levels",
    statement: "exactly four canonical attention levels exist",
  }),
  Object.freeze({
    id: "reuse-foundation-attention-vocabulary",
    statement: "DRI-5:1 attention vocabulary is reused",
  }),
  Object.freeze({
    id: "four-emphasis-levels",
    statement: "exactly four emphasis levels exist",
  }),
  Object.freeze({
    id: "exception-requires-critical",
    statement: "exception requires critical attention",
  }),
  Object.freeze({
    id: "action-requires-at-least-warning",
    statement: "action requirement requires at least warning",
  }),
  Object.freeze({
    id: "risk-requires-at-least-warning",
    statement: "risk requires at least warning",
  }),
  Object.freeze({
    id: "explicit-stronger-preserved",
    statement: "explicit stronger attention is preserved",
  }),
  Object.freeze({
    id: "weaker-explicit-cannot-downgrade",
    statement: "weaker explicit attention cannot downgrade stronger required attention",
  }),
  Object.freeze({
    id: "informational-to-notice",
    statement: "informational baseline resolves to notice",
  }),
  Object.freeze({
    id: "ordinary-baseline-to-normal",
    statement: "ordinary baseline resolves to normal",
  }),
  Object.freeze({
    id: "normal-maps-to-none",
    statement: "normal maps to none emphasis",
  }),
  Object.freeze({
    id: "notice-maps-to-subtle",
    statement: "notice maps to subtle emphasis",
  }),
  Object.freeze({
    id: "warning-maps-to-prominent",
    statement: "warning maps to prominent emphasis",
  }),
  Object.freeze({
    id: "critical-maps-to-dominant",
    statement: "critical maps to dominant emphasis",
  }),
  Object.freeze({
    id: "state-does-not-determine-attention",
    statement: "state does not automatically determine attention",
  }),
  Object.freeze({
    id: "attention-does-not-determine-state",
    statement: "attention does not determine state",
  }),
  Object.freeze({
    id: "density-not-resolved",
    statement: "density is not resolved",
  }),
  Object.freeze({
    id: "priority-not-resolved",
    statement: "priority is not resolved",
  }),
  Object.freeze({
    id: "visibility-not-resolved",
    statement: "visibility is not resolved",
  }),
  Object.freeze({
    id: "risk-consumed-not-calculated",
    statement: "risk is consumed, not calculated",
  }),
  Object.freeze({
    id: "no-kpi-koi-calculation",
    statement: "no KPI/KOI calculation occurs",
  }),
  Object.freeze({
    id: "no-renderer-behavior",
    statement: "no renderer behavior occurs",
  }),
  Object.freeze({
    id: "no-visual-style-encoded",
    statement: "no visual style is encoded",
  }),
  Object.freeze({
    id: "batch-subject-local",
    statement: "batch evaluation is subject-local",
  }),
  Object.freeze({
    id: "input-not-mutated",
    statement: "input is not mutated",
  }),
  Object.freeze({
    id: "output-immutable",
    statement: "output is immutable",
  }),
  Object.freeze({
    id: "deterministic",
    statement: "behavior is deterministic",
  }),
  Object.freeze({
    id: "side-effect-free",
    statement: "behavior is side-effect free",
  }),
  Object.freeze({
    id: "sole-immediate-dependency",
    statement: "exactly one immediate dependency exists",
  }),
  Object.freeze({
    id: "dependency-is-dri-5-3",
    statement: "sole immediate dependency is DRI-5:3",
  }),
] as const);

// ─── Registry ───────────────────────────────────────────────────────────────

export const directorRuntimeAttentionEmphasisPolicyApiNames = Object.freeze([
  "isDirectorRuntimeEmphasisLevel",
  "isDirectorRuntimeAttentionSignal",
  "isDirectorRuntimeAttentionReason",
  "validateDirectorRuntimeAttentionPolicyInput",
  "getDirectorRuntimeAttentionRank",
  "compareDirectorRuntimeAttentionLevels",
  "isDirectorRuntimeAttentionAtLeast",
  "getDirectorRuntimeEmphasisRank",
  "compareDirectorRuntimeEmphasisLevels",
  "resolveDirectorRuntimeAttention",
  "resolveDirectorRuntimeEmphasis",
  "resolveDirectorRuntimeAttentionEmphasisPolicy",
  "resolveDirectorRuntimeAttentionEmphasisPolicies",
  "verifyDirectorRuntimeAttentionEmphasisPolicy",
] as const);

export const directorRuntimeAttentionEmphasisPolicyRegistry = Object.freeze({
  identity: directorRuntimeAttentionEmphasisPolicyIdentity,
  version: directorRuntimeAttentionEmphasisPolicyVersion,
  namespace: directorRuntimeAttentionEmphasisPolicyNamespace,
  dependency: directorRuntimeAttentionEmphasisPolicyUpstream,
  attentionLevels: DIRECTOR_RUNTIME_ATTENTION_LEVELS,
  attentionLevelCount: DIRECTOR_RUNTIME_ATTENTION_LEVELS.length,
  attentionSignals: DIRECTOR_RUNTIME_ATTENTION_SIGNALS,
  attentionSignalCount: DIRECTOR_RUNTIME_ATTENTION_SIGNALS.length,
  attentionReasons: DIRECTOR_RUNTIME_ATTENTION_REASONS,
  attentionReasonCount: DIRECTOR_RUNTIME_ATTENTION_REASONS.length,
  attentionRank: DIRECTOR_RUNTIME_ATTENTION_RANK,
  emphasisLevels: DIRECTOR_RUNTIME_EMPHASIS_LEVELS,
  emphasisLevelCount: DIRECTOR_RUNTIME_EMPHASIS_LEVELS.length,
  emphasisRank: DIRECTOR_RUNTIME_EMPHASIS_RANK,
  attentionEmphasisMapping: DIRECTOR_RUNTIME_ATTENTION_EMPHASIS_MAPPING,
  precedence: DIRECTOR_RUNTIME_ATTENTION_PRECEDENCE,
  precedenceRuleCount: DIRECTOR_RUNTIME_ATTENTION_PRECEDENCE.length,
  invariants: DIRECTOR_RUNTIME_ATTENTION_EMPHASIS_POLICY_INVARIANTS,
  invariantCount: DIRECTOR_RUNTIME_ATTENTION_EMPHASIS_POLICY_INVARIANTS.length,
  publicApis: directorRuntimeAttentionEmphasisPolicyApiNames,
  publicApiCount: directorRuntimeAttentionEmphasisPolicyApiNames.length,
});

export const directorRuntimeAttentionEmphasisPolicy = Object.freeze({
  phase: "DRI-5:4" as const,
  name: "DirectorRuntimeAttentionEmphasisPolicy" as const,
  identity: directorRuntimeAttentionEmphasisPolicyIdentity,
  namespace: directorRuntimeAttentionEmphasisPolicyNamespace,
  version: directorRuntimeAttentionEmphasisPolicyVersion,
  layer: "DirectorRuntimeAdaptivePresentation" as const,
  stage: "AttentionEmphasisPolicy" as const,
  status: "AttentionEmphasisPolicyReady" as const,
  upstreamDependency: directorRuntimeAttentionEmphasisPolicyUpstream,
  deterministic: true as const,
  immutable: true as const,
  rendererIndependent: true as const,
  semantic: true as const,
  philosophy: "attention-meaning-not-appearance" as const,
  attentionLevels: DIRECTOR_RUNTIME_ATTENTION_LEVELS,
  attentionSignals: DIRECTOR_RUNTIME_ATTENTION_SIGNALS,
  attentionReasons: DIRECTOR_RUNTIME_ATTENTION_REASONS,
  emphasisLevels: DIRECTOR_RUNTIME_EMPHASIS_LEVELS,
  precedence: DIRECTOR_RUNTIME_ATTENTION_PRECEDENCE,
  attentionRank: DIRECTOR_RUNTIME_ATTENTION_RANK,
  emphasisRank: DIRECTOR_RUNTIME_EMPHASIS_RANK,
  attentionEmphasisMapping: DIRECTOR_RUNTIME_ATTENTION_EMPHASIS_MAPPING,
  invariants: DIRECTOR_RUNTIME_ATTENTION_EMPHASIS_POLICY_INVARIANTS,
  publicApiSurface: directorRuntimeAttentionEmphasisPolicyApiNames,
  registry: directorRuntimeAttentionEmphasisPolicyRegistry,
  stateResolverBoundary: "DRI-5:3-state-resolver-only" as const,
  architecturalStatus:
    "Established · Deterministic · Immutable · Semantic · RendererIndependent · ReadyForDensityPolicy" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface DirectorRuntimeAttentionEmphasisPolicyVerification {
  readonly ok: boolean;
  readonly identity: typeof directorRuntimeAttentionEmphasisPolicyIdentity;
  readonly version: typeof directorRuntimeAttentionEmphasisPolicyVersion;
  readonly namespace: typeof directorRuntimeAttentionEmphasisPolicyNamespace;
  readonly dependency: typeof directorRuntimeAttentionEmphasisPolicyUpstream;
  readonly attentionLevelCount: number;
  readonly attentionSignalCount: number;
  readonly attentionReasonCount: number;
  readonly emphasisLevelCount: number;
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

export function verifyDirectorRuntimeAttentionEmphasisPolicy():
  DirectorRuntimeAttentionEmphasisPolicyVerification {
  const layer = directorRuntimeAttentionEmphasisPolicy;
  const registry = directorRuntimeAttentionEmphasisPolicyRegistry;

  const ok =
    layer.identity === "DRI-5:4/DirectorRuntimeAttentionEmphasisPolicy" &&
    layer.version === "5.4.0" &&
    layer.namespace ===
      "nexora.dri.adaptive-presentation.attention-emphasis-policy" &&
    layer.upstreamDependency ===
      "DRI-5:3/DirectorRuntimePresentationStateResolver" &&
    layer.upstreamDependency ===
      directorRuntimePresentationStateResolverIdentity &&
    registry.dependency === layer.upstreamDependency &&
    exactOrder(
      DIRECTOR_RUNTIME_ATTENTION_LEVELS,
      ["normal", "notice", "warning", "critical"],
    ) &&
    exactOrder(
      DIRECTOR_RUNTIME_EMPHASIS_LEVELS,
      ["none", "subtle", "prominent", "dominant"],
    ) &&
    exactOrder(
      DIRECTOR_RUNTIME_ATTENTION_SIGNALS,
      [
        "baseline",
        "informational",
        "risk",
        "action-required",
        "exception",
        "explicit-director",
      ],
    ) &&
    exactOrder(
      DIRECTOR_RUNTIME_ATTENTION_REASONS,
      [
        "exception",
        "action-required",
        "risk",
        "explicit-director",
        "informational",
        "baseline",
      ],
    ) &&
    exactOrder(
      DIRECTOR_RUNTIME_ATTENTION_PRECEDENCE,
      [
        "exception",
        "action-required",
        "risk",
        "explicit-director",
        "informational",
        "baseline",
      ],
    ) &&
    DIRECTOR_RUNTIME_ATTENTION_EMPHASIS_MAPPING.normal === "none" &&
    DIRECTOR_RUNTIME_ATTENTION_EMPHASIS_MAPPING.notice === "subtle" &&
    DIRECTOR_RUNTIME_ATTENTION_EMPHASIS_MAPPING.warning === "prominent" &&
    DIRECTOR_RUNTIME_ATTENTION_EMPHASIS_MAPPING.critical === "dominant" &&
    DIRECTOR_RUNTIME_ATTENTION_RANK.normal === 0 &&
    DIRECTOR_RUNTIME_ATTENTION_RANK.notice === 1 &&
    DIRECTOR_RUNTIME_ATTENTION_RANK.warning === 2 &&
    DIRECTOR_RUNTIME_ATTENTION_RANK.critical === 3 &&
    DIRECTOR_RUNTIME_EMPHASIS_RANK.none === 0 &&
    DIRECTOR_RUNTIME_EMPHASIS_RANK.subtle === 1 &&
    DIRECTOR_RUNTIME_EMPHASIS_RANK.prominent === 2 &&
    DIRECTOR_RUNTIME_EMPHASIS_RANK.dominant === 3 &&
    registry.attentionLevelCount === 4 &&
    registry.attentionSignalCount === 6 &&
    registry.attentionReasonCount === 6 &&
    registry.emphasisLevelCount === 4 &&
    registry.precedenceRuleCount === 6 &&
    registry.invariantCount === 30 &&
    Object.isFrozen(layer) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(DIRECTOR_RUNTIME_ATTENTION_LEVELS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EMPHASIS_LEVELS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_ATTENTION_SIGNALS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_ATTENTION_REASONS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_ATTENTION_PRECEDENCE) &&
    Object.isFrozen(DIRECTOR_RUNTIME_ATTENTION_RANK) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EMPHASIS_RANK) &&
    Object.isFrozen(DIRECTOR_RUNTIME_ATTENTION_EMPHASIS_MAPPING) &&
    Object.isFrozen(DIRECTOR_RUNTIME_ATTENTION_EMPHASIS_POLICY_INVARIANTS);

  return Object.freeze({
    ok,
    identity: directorRuntimeAttentionEmphasisPolicyIdentity,
    version: directorRuntimeAttentionEmphasisPolicyVersion,
    namespace: directorRuntimeAttentionEmphasisPolicyNamespace,
    dependency: directorRuntimeAttentionEmphasisPolicyUpstream,
    attentionLevelCount: DIRECTOR_RUNTIME_ATTENTION_LEVELS.length,
    attentionSignalCount: DIRECTOR_RUNTIME_ATTENTION_SIGNALS.length,
    attentionReasonCount: DIRECTOR_RUNTIME_ATTENTION_REASONS.length,
    emphasisLevelCount: DIRECTOR_RUNTIME_EMPHASIS_LEVELS.length,
    precedenceRuleCount: DIRECTOR_RUNTIME_ATTENTION_PRECEDENCE.length,
    invariantCount: DIRECTOR_RUNTIME_ATTENTION_EMPHASIS_POLICY_INVARIANTS.length,
    frozen: Object.isFrozen(layer) && Object.isFrozen(registry),
  });
}
