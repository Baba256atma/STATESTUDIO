/**
 * DRI-5:6 — Director Runtime Adaptive Presentation Orchestration.
 *
 * Composes already-resolved presentation dimensions into one canonical
 * Adaptive Presentation Plan. Composition only — no re-resolution,
 * content materialization, scene instructions, or rendering.
 */

import {
  DIRECTOR_RUNTIME_ATTENTION_LEVELS,
  DIRECTOR_RUNTIME_ATTENTION_REASONS,
  DIRECTOR_RUNTIME_ATTENTION_SIGNALS,
  DIRECTOR_RUNTIME_EMPHASIS_LEVELS,
  DIRECTOR_RUNTIME_INFORMATION_DENSITIES,
  DIRECTOR_RUNTIME_INFORMATION_DENSITY_REASONS,
  DIRECTOR_RUNTIME_INFORMATION_DENSITY_SIGNALS,
  DIRECTOR_RUNTIME_INTERACTION_EXPOSURES,
  DIRECTOR_RUNTIME_PRESENTATION_INTENT_SOURCES,
  DIRECTOR_RUNTIME_PRESENTATION_PRIORITIES,
  DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_REASONS,
  DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_SIGNALS,
  DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLVER_STATES,
  DIRECTOR_RUNTIME_PRESENTATION_STATES,
  DIRECTOR_RUNTIME_PRESENTATION_VISIBILITIES,
  areDirectorRuntimePresentationIntentsEqual,
  compareDirectorRuntimeAttentionLevels,
  compareDirectorRuntimeEmphasisLevels,
  compareDirectorRuntimeInformationDensities,
  compareDirectorRuntimePresentationIntents,
  compareDirectorRuntimePresentationStates,
  createDirectorRuntimePresentationIntent,
  createDirectorRuntimePresentationIntentCollection,
  createDirectorRuntimePresentationIntentSnapshot,
  deriveDirectorRuntimePresentationIntentId,
  describeDirectorRuntimeInformationDensityTransition,
  describeDirectorRuntimePresentationStateTransition,
  directorRuntimeInformationDensityPolicyIdentity,
  findDirectorRuntimePresentationIntentById,
  findDirectorRuntimePresentationIntentsBySubjectId,
  getDirectorRuntimeAttentionRank,
  getDirectorRuntimeEmphasisRank,
  getDirectorRuntimeInformationDensityRank,
  getDirectorRuntimePresentationStateRank,
  isDirectorRuntimeAttentionAtLeast,
  isDirectorRuntimeAttentionLevel,
  isDirectorRuntimeEmphasisLevel,
  isDirectorRuntimeInformationDensity,
  isDirectorRuntimeInformationDensityAtLeast,
  isDirectorRuntimeInteractionExposure,
  isDirectorRuntimePresentationIntent,
  isDirectorRuntimePresentationIntentSource,
  isDirectorRuntimePresentationPriority,
  isDirectorRuntimePresentationState,
  isDirectorRuntimePresentationStateAtLeast,
  isDirectorRuntimePresentationVisibility,
  resolveDirectorRuntimeAttention,
  resolveDirectorRuntimeAttentionEmphasisPolicies,
  resolveDirectorRuntimeAttentionEmphasisPolicy,
  resolveDirectorRuntimeEmphasis,
  resolveDirectorRuntimeInformationDensities,
  resolveDirectorRuntimeInformationDensity,
  resolveDirectorRuntimePresentationState,
  resolveDirectorRuntimePresentationStates,
  validateDirectorRuntimeAttentionPolicyInput,
  validateDirectorRuntimeInformationDensityPolicyInput,
  validateDirectorRuntimePresentationIntent,
  validateDirectorRuntimePresentationStateResolutionInput,
  type DirectorRuntimeAttentionEmphasisPolicyResult,
  type DirectorRuntimeAttentionLevel,
  type DirectorRuntimeEmphasisLevel,
  type DirectorRuntimeInformationDensity,
  type DirectorRuntimeInformationDensityResolution,
  type DirectorRuntimeInteractionExposure,
  type DirectorRuntimePresentationIntent,
  type DirectorRuntimePresentationIntentContextReference,
  type DirectorRuntimePresentationIntentReason,
  type DirectorRuntimePresentationIntentSource,
  type DirectorRuntimePresentationPriority,
  type DirectorRuntimePresentationState,
  type DirectorRuntimePresentationStateResolution,
  type DirectorRuntimePresentationSubject,
  type DirectorRuntimePresentationVisibility,
} from "@/app/lib/dri/directorRuntimeInformationDensityPolicy";

export {
  DIRECTOR_RUNTIME_ATTENTION_LEVELS,
  DIRECTOR_RUNTIME_ATTENTION_REASONS,
  DIRECTOR_RUNTIME_ATTENTION_SIGNALS,
  DIRECTOR_RUNTIME_EMPHASIS_LEVELS,
  DIRECTOR_RUNTIME_INFORMATION_DENSITIES,
  DIRECTOR_RUNTIME_INFORMATION_DENSITY_REASONS,
  DIRECTOR_RUNTIME_INFORMATION_DENSITY_SIGNALS,
  DIRECTOR_RUNTIME_INTERACTION_EXPOSURES,
  DIRECTOR_RUNTIME_PRESENTATION_INTENT_SOURCES,
  DIRECTOR_RUNTIME_PRESENTATION_PRIORITIES,
  DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_REASONS,
  DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLUTION_SIGNALS,
  DIRECTOR_RUNTIME_PRESENTATION_STATE_RESOLVER_STATES,
  DIRECTOR_RUNTIME_PRESENTATION_STATES,
  DIRECTOR_RUNTIME_PRESENTATION_VISIBILITIES,
  areDirectorRuntimePresentationIntentsEqual,
  compareDirectorRuntimeAttentionLevels,
  compareDirectorRuntimeEmphasisLevels,
  compareDirectorRuntimeInformationDensities,
  compareDirectorRuntimePresentationIntents,
  compareDirectorRuntimePresentationStates,
  createDirectorRuntimePresentationIntent,
  createDirectorRuntimePresentationIntentCollection,
  createDirectorRuntimePresentationIntentSnapshot,
  deriveDirectorRuntimePresentationIntentId,
  describeDirectorRuntimeInformationDensityTransition,
  describeDirectorRuntimePresentationStateTransition,
  findDirectorRuntimePresentationIntentById,
  findDirectorRuntimePresentationIntentsBySubjectId,
  getDirectorRuntimeAttentionRank,
  getDirectorRuntimeEmphasisRank,
  getDirectorRuntimeInformationDensityRank,
  getDirectorRuntimePresentationStateRank,
  isDirectorRuntimeAttentionAtLeast,
  isDirectorRuntimeAttentionLevel,
  isDirectorRuntimeEmphasisLevel,
  isDirectorRuntimeInformationDensity,
  isDirectorRuntimeInformationDensityAtLeast,
  isDirectorRuntimeInteractionExposure,
  isDirectorRuntimePresentationIntent,
  isDirectorRuntimePresentationIntentSource,
  isDirectorRuntimePresentationPriority,
  isDirectorRuntimePresentationState,
  isDirectorRuntimePresentationStateAtLeast,
  isDirectorRuntimePresentationVisibility,
  resolveDirectorRuntimeAttention,
  resolveDirectorRuntimeAttentionEmphasisPolicies,
  resolveDirectorRuntimeAttentionEmphasisPolicy,
  resolveDirectorRuntimeEmphasis,
  resolveDirectorRuntimeInformationDensities,
  resolveDirectorRuntimeInformationDensity,
  resolveDirectorRuntimePresentationState,
  resolveDirectorRuntimePresentationStates,
  validateDirectorRuntimeAttentionPolicyInput,
  validateDirectorRuntimeInformationDensityPolicyInput,
  validateDirectorRuntimePresentationIntent,
  validateDirectorRuntimePresentationStateResolutionInput,
};

export type {
  DirectorRuntimeAttentionEmphasisPolicyResult,
  DirectorRuntimeAttentionLevel,
  DirectorRuntimeEmphasisLevel,
  DirectorRuntimeInformationDensity,
  DirectorRuntimeInformationDensityResolution,
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
} from "@/app/lib/dri/directorRuntimeInformationDensityPolicy";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeAdaptivePresentationOrchestrationIdentity =
  "DRI-5:6/DirectorRuntimeAdaptivePresentationOrchestration" as const;
export const directorRuntimeAdaptivePresentationOrchestrationVersion =
  "5.6.0" as const;
export const directorRuntimeAdaptivePresentationOrchestrationNamespace =
  "nexora.dri.adaptive-presentation.orchestration" as const;
export const directorRuntimeAdaptivePresentationOrchestrationUpstream =
  directorRuntimeInformationDensityPolicyIdentity;

export const directorRuntimeAdaptivePresentationOrchestrationCanonicalIdentity =
  Object.freeze({
    identity: directorRuntimeAdaptivePresentationOrchestrationIdentity,
    version: directorRuntimeAdaptivePresentationOrchestrationVersion,
    namespace: directorRuntimeAdaptivePresentationOrchestrationNamespace,
    upstream: directorRuntimeAdaptivePresentationOrchestrationUpstream,
  });

// ─── Orchestration modes ────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_ORCHESTRATION_MODES = Object.freeze([
  "single",
  "batch",
] as const);
export type DirectorRuntimeAdaptivePresentationOrchestrationMode =
  (typeof DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_ORCHESTRATION_MODES)[number];

// ─── Plan change dimensions ─────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLAN_CHANGE_DIMENSIONS =
  Object.freeze([
    "subject",
    "state",
    "attention",
    "emphasis",
    "density",
    "priority",
    "visibility",
    "interactionExposure",
    "source",
    "reason",
    "context",
  ] as const);
export type DirectorRuntimeAdaptivePresentationPlanChangeDimension =
  (typeof DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLAN_CHANGE_DIMENSIONS)[number];

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface DirectorRuntimeAdaptivePresentationPlan {
  readonly planId: string;
  readonly subject: DirectorRuntimePresentationSubject;
  readonly intentId: string;
  readonly state: DirectorRuntimePresentationState;
  readonly attention: DirectorRuntimeAttentionLevel;
  readonly emphasis: DirectorRuntimeEmphasisLevel;
  readonly density: DirectorRuntimeInformationDensity;
  readonly priority: DirectorRuntimePresentationPriority;
  readonly visibility: DirectorRuntimePresentationVisibility;
  readonly interactionExposure: DirectorRuntimeInteractionExposure;
  readonly source: DirectorRuntimePresentationIntentSource;
  readonly reason?: DirectorRuntimePresentationIntentReason;
  readonly context?: DirectorRuntimePresentationIntentContextReference;
}

export interface DirectorRuntimeAdaptivePresentationOrchestrationInput {
  readonly intent: DirectorRuntimePresentationIntent;
  readonly stateResolution: DirectorRuntimePresentationStateResolution;
  readonly attentionEmphasis: DirectorRuntimeAttentionEmphasisPolicyResult;
  readonly densityResolution: DirectorRuntimeInformationDensityResolution;
}

export type DirectorRuntimeAdaptivePresentationPlanCollection =
  readonly DirectorRuntimeAdaptivePresentationPlan[];

export interface DirectorRuntimeAdaptivePresentationPlanSnapshot {
  readonly plans: DirectorRuntimeAdaptivePresentationPlanCollection;
}

export interface DirectorRuntimeAdaptivePresentationTransition {
  readonly changed: boolean;
  readonly changedDimensions: readonly DirectorRuntimeAdaptivePresentationPlanChangeDimension[];
}

// ─── Validation / compatibility ─────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_ORCHESTRATION_ISSUE_CODES =
  Object.freeze([
    "invalid-intent",
    "invalid-state-resolution",
    "invalid-attention-policy",
    "invalid-density-resolution",
    "subject-mismatch",
    "missing-plan-id",
    "invalid-plan-id",
    "duplicate-plan-id",
    "invalid-collection-entry",
  ] as const);
export type DirectorRuntimeAdaptivePresentationOrchestrationIssueCode =
  (typeof DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_ORCHESTRATION_ISSUE_CODES)[number];

export interface DirectorRuntimeAdaptivePresentationOrchestrationIssue {
  readonly code: DirectorRuntimeAdaptivePresentationOrchestrationIssueCode;
  readonly path: string;
  readonly message: string;
}

export interface DirectorRuntimeAdaptivePresentationOrchestrationValidationResult {
  readonly valid: boolean;
  readonly issues: readonly DirectorRuntimeAdaptivePresentationOrchestrationIssue[];
}

export interface DirectorRuntimeAdaptivePresentationCompatibilityResult {
  readonly compatible: boolean;
  readonly issues: readonly DirectorRuntimeAdaptivePresentationOrchestrationIssue[];
}

export interface DirectorRuntimeAdaptivePresentationOrchestrationResult {
  readonly ok: boolean;
  readonly plan?: DirectorRuntimeAdaptivePresentationPlan;
  readonly issues: readonly DirectorRuntimeAdaptivePresentationOrchestrationIssue[];
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

function issue(
  code: DirectorRuntimeAdaptivePresentationOrchestrationIssueCode,
  path: string,
  message: string,
): DirectorRuntimeAdaptivePresentationOrchestrationIssue {
  return Object.freeze({ code, path, message });
}

function freezeIssues(
  issues: readonly DirectorRuntimeAdaptivePresentationOrchestrationIssue[],
): readonly DirectorRuntimeAdaptivePresentationOrchestrationIssue[] {
  return Object.freeze([...issues]);
}

function freezeValidation(
  issues: readonly DirectorRuntimeAdaptivePresentationOrchestrationIssue[],
): DirectorRuntimeAdaptivePresentationOrchestrationValidationResult {
  return Object.freeze({
    valid: issues.length === 0,
    issues: freezeIssues(issues),
  });
}

function freezeCompatibility(
  issues: readonly DirectorRuntimeAdaptivePresentationOrchestrationIssue[],
): DirectorRuntimeAdaptivePresentationCompatibilityResult {
  return Object.freeze({
    compatible: issues.length === 0,
    issues: freezeIssues(issues),
  });
}

function freezeSubject(
  subject: DirectorRuntimePresentationSubject,
): DirectorRuntimePresentationSubject {
  return Object.freeze({ ...subject });
}

function freezeReason(
  reason: DirectorRuntimePresentationIntentReason,
): DirectorRuntimePresentationIntentReason {
  return Object.freeze({
    code: reason.code,
    source: reason.source,
    ...(reason.detail === undefined ? {} : { detail: reason.detail }),
  });
}

function freezeContext(
  context: DirectorRuntimePresentationIntentContextReference,
): DirectorRuntimePresentationIntentContextReference {
  return Object.freeze({
    contextId: context.contextId,
    contextKind: context.contextKind,
  });
}

function subjectsEqual(
  left: DirectorRuntimePresentationSubject,
  right: DirectorRuntimePresentationSubject,
): boolean {
  return left.subjectId === right.subjectId &&
    left.subjectKind === right.subjectKind &&
    left.namespace === right.namespace;
}

function subjectKey(subject: DirectorRuntimePresentationSubject): string {
  return `${subject.namespace ?? ""}\u0000${subject.subjectKind}\u0000${subject.subjectId}`;
}

function reasonsEqual(
  left: DirectorRuntimePresentationIntentReason | undefined,
  right: DirectorRuntimePresentationIntentReason | undefined,
): boolean {
  if (left === undefined && right === undefined) return true;
  if (left === undefined || right === undefined) return false;
  return left.code === right.code &&
    left.source === right.source &&
    left.detail === right.detail;
}

function contextsEqual(
  left: DirectorRuntimePresentationIntentContextReference | undefined,
  right: DirectorRuntimePresentationIntentContextReference | undefined,
): boolean {
  if (left === undefined && right === undefined) return true;
  if (left === undefined || right === undefined) return false;
  return left.contextId === right.contextId && left.contextKind === right.contextKind;
}

function isValidStateResolution(
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
  return true;
}

function isValidAttentionPolicy(
  value: unknown,
): value is DirectorRuntimeAttentionEmphasisPolicyResult {
  if (!isPlainObject(value)) return false;
  if (!isPlainObject(value.attention) || !isPlainObject(value.emphasis)) return false;
  const { attention, emphasis } = value;
  if (!(DIRECTOR_RUNTIME_ATTENTION_LEVELS as readonly unknown[]).includes(attention.attention)) {
    return false;
  }
  if (!(DIRECTOR_RUNTIME_ATTENTION_SIGNALS as readonly unknown[]).includes(attention.resolvedBy)) {
    return false;
  }
  if (!(DIRECTOR_RUNTIME_ATTENTION_REASONS as readonly unknown[]).includes(attention.reasonCode)) {
    return false;
  }
  if (!isPlainObject(attention.subject)) return false;
  if (!isNonEmptyString(attention.subject.subjectId)) return false;
  if (!isNonEmptyString(attention.subject.subjectKind)) return false;
  if (!(DIRECTOR_RUNTIME_EMPHASIS_LEVELS as readonly unknown[]).includes(emphasis.emphasis)) {
    return false;
  }
  if (!(DIRECTOR_RUNTIME_ATTENTION_LEVELS as readonly unknown[]).includes(emphasis.attention)) {
    return false;
  }
  if (emphasis.reasonCode !== "attention-emphasis-mapping") return false;
  return true;
}

function isValidDensityResolution(
  value: unknown,
): value is DirectorRuntimeInformationDensityResolution {
  if (!isPlainObject(value)) return false;
  if (!(DIRECTOR_RUNTIME_INFORMATION_DENSITIES as readonly unknown[]).includes(value.density)) {
    return false;
  }
  if (!(DIRECTOR_RUNTIME_INFORMATION_DENSITY_SIGNALS as readonly unknown[])
    .includes(value.resolvedBy)) {
    return false;
  }
  if (!(DIRECTOR_RUNTIME_INFORMATION_DENSITY_REASONS as readonly unknown[])
    .includes(value.reasonCode)) {
    return false;
  }
  if (!isPlainObject(value.subject)) return false;
  if (!isNonEmptyString(value.subject.subjectId)) return false;
  if (!isNonEmptyString(value.subject.subjectKind)) return false;
  return true;
}

function collectInputIssues(
  value: unknown,
  path = "input",
): DirectorRuntimeAdaptivePresentationOrchestrationIssue[] {
  if (!isPlainObject(value)) {
    return [issue("invalid-intent", path, "orchestration input must be a plain object")];
  }

  const issues: DirectorRuntimeAdaptivePresentationOrchestrationIssue[] = [];

  if (!isDirectorRuntimePresentationIntent(value.intent)) {
    issues.push(issue(
      "invalid-intent",
      `${path}.intent`,
      "intent must be a structurally valid presentation intent",
    ));
  }

  if (!isValidStateResolution(value.stateResolution)) {
    issues.push(issue(
      "invalid-state-resolution",
      `${path}.stateResolution`,
      "stateResolution must be a structurally valid state resolution",
    ));
  }

  if (!isValidAttentionPolicy(value.attentionEmphasis)) {
    issues.push(issue(
      "invalid-attention-policy",
      `${path}.attentionEmphasis`,
      "attentionEmphasis must be a structurally valid attention/emphasis policy result",
    ));
  }

  if (!isValidDensityResolution(value.densityResolution)) {
    issues.push(issue(
      "invalid-density-resolution",
      `${path}.densityResolution`,
      "densityResolution must be a structurally valid density resolution",
    ));
  }

  if (
    isDirectorRuntimePresentationIntent(value.intent) &&
    isValidStateResolution(value.stateResolution) &&
    !subjectsEqual(value.intent.subject, value.stateResolution.subject)
  ) {
    issues.push(issue(
      "subject-mismatch",
      `${path}.stateResolution.subject`,
      "stateResolution subject must match intent subject",
    ));
  }

  if (
    isDirectorRuntimePresentationIntent(value.intent) &&
    isValidAttentionPolicy(value.attentionEmphasis) &&
    !subjectsEqual(value.intent.subject, value.attentionEmphasis.attention.subject)
  ) {
    issues.push(issue(
      "subject-mismatch",
      `${path}.attentionEmphasis.attention.subject`,
      "attention policy subject must match intent subject",
    ));
  }

  if (
    isDirectorRuntimePresentationIntent(value.intent) &&
    isValidDensityResolution(value.densityResolution) &&
    !subjectsEqual(value.intent.subject, value.densityResolution.subject)
  ) {
    issues.push(issue(
      "subject-mismatch",
      `${path}.densityResolution.subject`,
      "density resolution subject must match intent subject",
    ));
  }

  return issues;
}

export function validateDirectorRuntimeAdaptivePresentationOrchestrationInput(
  value: unknown,
): DirectorRuntimeAdaptivePresentationOrchestrationValidationResult {
  return freezeValidation(collectInputIssues(value));
}

export function assessDirectorRuntimeAdaptivePresentationCompatibility(
  input: DirectorRuntimeAdaptivePresentationOrchestrationInput,
): DirectorRuntimeAdaptivePresentationCompatibilityResult {
  return freezeCompatibility(collectInputIssues(input));
}

// ─── Plan identity ──────────────────────────────────────────────────────────

/**
 * Deterministic plan identity from semantic composition fields.
 * No timestamps, randomness, or global counters.
 */
export function deriveDirectorRuntimeAdaptivePresentationPlanId(input: {
  readonly intentId: string;
  readonly subject: DirectorRuntimePresentationSubject;
  readonly state: DirectorRuntimePresentationState;
  readonly attention: DirectorRuntimeAttentionLevel;
  readonly emphasis: DirectorRuntimeEmphasisLevel;
  readonly density: DirectorRuntimeInformationDensity;
  readonly priority: DirectorRuntimePresentationPriority;
  readonly visibility: DirectorRuntimePresentationVisibility;
  readonly interactionExposure: DirectorRuntimeInteractionExposure;
}): string {
  return [
    "dri-ap-plan",
    directorRuntimeAdaptivePresentationOrchestrationVersion,
    input.intentId,
    subjectKey(input.subject),
    input.state,
    input.attention,
    input.emphasis,
    input.density,
    input.priority,
    input.visibility,
    input.interactionExposure,
  ].join(":");
}

// ─── Orchestration ──────────────────────────────────────────────────────────

/**
 * Compose upstream resolved dimensions into one Adaptive Presentation Plan.
 * Does not re-resolve state, attention, emphasis, or density.
 */
export function orchestrateDirectorRuntimeAdaptivePresentation(
  input: DirectorRuntimeAdaptivePresentationOrchestrationInput,
): DirectorRuntimeAdaptivePresentationOrchestrationResult {
  const issues = collectInputIssues(input);
  if (issues.length > 0) {
    return Object.freeze({
      ok: false as const,
      issues: freezeIssues(issues),
    });
  }

  const { intent, stateResolution, attentionEmphasis, densityResolution } = input;
  const subject = freezeSubject(intent.subject);
  const state = stateResolution.state;
  const attention = attentionEmphasis.attention.attention;
  const emphasis = attentionEmphasis.emphasis.emphasis;
  const density = densityResolution.density;

  const planId = deriveDirectorRuntimeAdaptivePresentationPlanId({
    intentId: intent.intentId,
    subject,
    state,
    attention,
    emphasis,
    density,
    priority: intent.priority,
    visibility: intent.visibility,
    interactionExposure: intent.interactionExposure,
  });

  const plan = Object.freeze({
    planId,
    subject,
    intentId: intent.intentId,
    state,
    attention,
    emphasis,
    density,
    priority: intent.priority,
    visibility: intent.visibility,
    interactionExposure: intent.interactionExposure,
    source: intent.source,
    ...(intent.reason === undefined ? {} : { reason: freezeReason(intent.reason) }),
    ...(intent.context === undefined ? {} : { context: freezeContext(intent.context) }),
  }) satisfies DirectorRuntimeAdaptivePresentationPlan;

  return Object.freeze({
    ok: true as const,
    plan,
    issues: freezeIssues([]),
  });
}

/** Subject-local batch orchestration. Preserves input order. No cross-subject ranking. */
export function orchestrateDirectorRuntimeAdaptivePresentations(
  inputs: readonly DirectorRuntimeAdaptivePresentationOrchestrationInput[],
): readonly DirectorRuntimeAdaptivePresentationOrchestrationResult[] {
  return Object.freeze(
    inputs.map((entry) => orchestrateDirectorRuntimeAdaptivePresentation(entry)),
  );
}

export function createDirectorRuntimeAdaptivePresentationPlanSnapshot(
  plans: readonly DirectorRuntimeAdaptivePresentationPlan[],
): DirectorRuntimeAdaptivePresentationPlanSnapshot {
  const collection = Object.freeze(plans.map((plan) => Object.freeze({
    ...plan,
    subject: freezeSubject(plan.subject),
    ...(plan.reason === undefined ? {} : { reason: freezeReason(plan.reason) }),
    ...(plan.context === undefined ? {} : { context: freezeContext(plan.context) }),
  })));

  const issues = validateDirectorRuntimeAdaptivePresentationPlanCollection(collection);
  if (!issues.valid) {
    const first = issues.issues[0]!;
    throw new TypeError(`${first.code}: ${first.message}`);
  }

  return Object.freeze({ plans: collection });
}

export function validateDirectorRuntimeAdaptivePresentationPlanCollection(
  value: unknown,
): DirectorRuntimeAdaptivePresentationOrchestrationValidationResult {
  if (!Array.isArray(value)) {
    return freezeValidation([
      issue("invalid-collection-entry", "collection", "plan collection must be an array"),
    ]);
  }

  const issues: DirectorRuntimeAdaptivePresentationOrchestrationIssue[] = [];
  const seen = new Map<string, number>();

  for (let index = 0; index < value.length; index += 1) {
    const entry = value[index];
    if (!isPlainObject(entry)) {
      issues.push(issue(
        "invalid-collection-entry",
        `collection[${index}]`,
        "plan entry must be a plain object",
      ));
      continue;
    }
    if (entry.planId === undefined || entry.planId === null || entry.planId === "") {
      issues.push(issue(
        "missing-plan-id",
        `collection[${index}].planId`,
        "planId is required",
      ));
    } else if (!isNonEmptyString(entry.planId)) {
      issues.push(issue(
        "invalid-plan-id",
        `collection[${index}].planId`,
        "planId must be a non-empty string",
      ));
    } else {
      const previous = seen.get(entry.planId);
      if (previous !== undefined) {
        issues.push(issue(
          "duplicate-plan-id",
          `collection[${index}].planId`,
          `duplicate planId "${entry.planId}" also at collection[${previous}]`,
        ));
      } else {
        seen.set(entry.planId, index);
      }
    }
  }

  return freezeValidation(issues);
}

// ─── Equality / comparison / lookup ─────────────────────────────────────────

export function areDirectorRuntimeAdaptivePresentationPlansEqual(
  left: DirectorRuntimeAdaptivePresentationPlan,
  right: DirectorRuntimeAdaptivePresentationPlan,
): boolean {
  return left.planId === right.planId &&
    left.intentId === right.intentId &&
    subjectsEqual(left.subject, right.subject) &&
    left.state === right.state &&
    left.attention === right.attention &&
    left.emphasis === right.emphasis &&
    left.density === right.density &&
    left.priority === right.priority &&
    left.visibility === right.visibility &&
    left.interactionExposure === right.interactionExposure &&
    left.source === right.source &&
    reasonsEqual(left.reason, right.reason) &&
    contextsEqual(left.context, right.context);
}

export function compareDirectorRuntimeAdaptivePresentationPlans(
  previous: DirectorRuntimeAdaptivePresentationPlan,
  next: DirectorRuntimeAdaptivePresentationPlan,
): DirectorRuntimeAdaptivePresentationTransition {
  const changed: DirectorRuntimeAdaptivePresentationPlanChangeDimension[] = [];
  if (!subjectsEqual(previous.subject, next.subject)) changed.push("subject");
  if (previous.state !== next.state) changed.push("state");
  if (previous.attention !== next.attention) changed.push("attention");
  if (previous.emphasis !== next.emphasis) changed.push("emphasis");
  if (previous.density !== next.density) changed.push("density");
  if (previous.priority !== next.priority) changed.push("priority");
  if (previous.visibility !== next.visibility) changed.push("visibility");
  if (previous.interactionExposure !== next.interactionExposure) {
    changed.push("interactionExposure");
  }
  if (previous.source !== next.source) changed.push("source");
  if (!reasonsEqual(previous.reason, next.reason)) changed.push("reason");
  if (!contextsEqual(previous.context, next.context)) changed.push("context");

  return Object.freeze({
    changed: changed.length > 0 || previous.planId !== next.planId ||
      previous.intentId !== next.intentId,
    changedDimensions: Object.freeze(changed),
  });
}

export function findDirectorRuntimeAdaptivePresentationPlanById(
  plans: DirectorRuntimeAdaptivePresentationPlanCollection,
  planId: string,
): DirectorRuntimeAdaptivePresentationPlan | undefined {
  return plans.find((plan) => plan.planId === planId);
}

export function findDirectorRuntimeAdaptivePresentationPlansBySubjectId(
  plans: DirectorRuntimeAdaptivePresentationPlanCollection,
  subjectId: string,
): DirectorRuntimeAdaptivePresentationPlanCollection {
  return Object.freeze(plans.filter((plan) => plan.subject.subjectId === subjectId));
}

// ─── Invariants ─────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_ORCHESTRATION_INVARIANTS =
  Object.freeze([
    Object.freeze({
      id: "sole-immediate-dependency",
      statement: "exactly one immediate dependency exists",
    }),
    Object.freeze({
      id: "dependency-is-dri-5-5",
      statement: "sole dependency is DRI-5:5",
    }),
    Object.freeze({
      id: "composes-resolved-dimensions",
      statement: "orchestration composes previously resolved dimensions",
    }),
    Object.freeze({
      id: "state-not-re-resolved",
      statement: "state is not re-resolved",
    }),
    Object.freeze({
      id: "attention-not-re-resolved",
      statement: "attention is not re-resolved",
    }),
    Object.freeze({
      id: "emphasis-not-re-resolved",
      statement: "emphasis is not re-resolved",
    }),
    Object.freeze({
      id: "density-not-re-resolved",
      statement: "density is not re-resolved",
    }),
    Object.freeze({
      id: "priority-preserved",
      statement: "priority is preserved",
    }),
    Object.freeze({
      id: "visibility-preserved",
      statement: "visibility is preserved",
    }),
    Object.freeze({
      id: "interaction-exposure-preserved",
      statement: "interaction exposure is preserved",
    }),
    Object.freeze({
      id: "intent-provenance-preserved",
      statement: "intent provenance is preserved",
    }),
    Object.freeze({
      id: "unusual-combinations-representable",
      statement: "unusual valid combinations remain representable",
    }),
    Object.freeze({
      id: "subject-compatibility-validated",
      statement: "subject compatibility is structurally validated",
    }),
    Object.freeze({
      id: "deterministic-plan-identity",
      statement: "plan identity is deterministic",
    }),
    Object.freeze({
      id: "no-timestamps",
      statement: "no timestamps are used",
    }),
    Object.freeze({
      id: "no-random-ids",
      statement: "no random IDs are used",
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
      id: "batch-order-preserved",
      statement: "batch ordering is preserved",
    }),
    Object.freeze({
      id: "batch-subject-local",
      statement: "batch subjects are orchestrated independently",
    }),
    Object.freeze({
      id: "duplicate-plan-ids-detectable",
      statement: "duplicate plan IDs are detectable",
    }),
    Object.freeze({
      id: "semantic-equality-deterministic",
      statement: "semantic equality is deterministic",
    }),
    Object.freeze({
      id: "plan-comparison-semantic-only",
      statement: "plan comparison is semantic only",
    }),
    Object.freeze({
      id: "no-renderer-instructions",
      statement: "no renderer instructions exist",
    }),
    Object.freeze({
      id: "no-scene-instructions",
      statement: "no scene instructions exist",
    }),
    Object.freeze({
      id: "no-content-materialization",
      statement: "no content materialization occurs",
    }),
    Object.freeze({
      id: "no-kpi-calculation",
      statement: "no KPI calculation occurs",
    }),
    Object.freeze({
      id: "no-koi-calculation",
      statement: "no KOI calculation occurs",
    }),
    Object.freeze({
      id: "no-risk-calculation",
      statement: "no risk calculation occurs",
    }),
    Object.freeze({
      id: "no-ui-framework-dependency",
      statement: "no UI framework dependency exists",
    }),
    Object.freeze({
      id: "side-effect-free",
      statement: "orchestration is side-effect free",
    }),
    Object.freeze({
      id: "no-platform-behavior",
      statement: "DRI-5:7 platform behavior is not implemented",
    }),
  ] as const);

// ─── Registry ───────────────────────────────────────────────────────────────

export const directorRuntimeAdaptivePresentationOrchestrationCapabilities =
  Object.freeze([
    "semantic-composition",
    "structural-compatibility-validation",
    "deterministic-plan-identity",
    "batch-orchestration",
    "plan-equality",
    "plan-comparison",
    "duplicate-plan-detection",
  ] as const);

export const directorRuntimeAdaptivePresentationOrchestrationApiNames = Object.freeze([
  "validateDirectorRuntimeAdaptivePresentationOrchestrationInput",
  "assessDirectorRuntimeAdaptivePresentationCompatibility",
  "deriveDirectorRuntimeAdaptivePresentationPlanId",
  "orchestrateDirectorRuntimeAdaptivePresentation",
  "orchestrateDirectorRuntimeAdaptivePresentations",
  "createDirectorRuntimeAdaptivePresentationPlanSnapshot",
  "validateDirectorRuntimeAdaptivePresentationPlanCollection",
  "areDirectorRuntimeAdaptivePresentationPlansEqual",
  "compareDirectorRuntimeAdaptivePresentationPlans",
  "findDirectorRuntimeAdaptivePresentationPlanById",
  "findDirectorRuntimeAdaptivePresentationPlansBySubjectId",
  "verifyDirectorRuntimeAdaptivePresentationOrchestration",
] as const);

export const directorRuntimeAdaptivePresentationOrchestrationRegistry = Object.freeze({
  identity: directorRuntimeAdaptivePresentationOrchestrationIdentity,
  version: directorRuntimeAdaptivePresentationOrchestrationVersion,
  namespace: directorRuntimeAdaptivePresentationOrchestrationNamespace,
  dependency: directorRuntimeAdaptivePresentationOrchestrationUpstream,
  orchestrationModes: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_ORCHESTRATION_MODES,
  orchestrationModeCount:
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_ORCHESTRATION_MODES.length,
  planChangeDimensions: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLAN_CHANGE_DIMENSIONS,
  planChangeDimensionCount:
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLAN_CHANGE_DIMENSIONS.length,
  validationIssueCodes: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_ORCHESTRATION_ISSUE_CODES,
  validationIssueCount:
    DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_ORCHESTRATION_ISSUE_CODES.length,
  capabilities: directorRuntimeAdaptivePresentationOrchestrationCapabilities,
  capabilityCount: directorRuntimeAdaptivePresentationOrchestrationCapabilities.length,
  invariants: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_ORCHESTRATION_INVARIANTS,
  invariantCount: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_ORCHESTRATION_INVARIANTS.length,
  publicApis: directorRuntimeAdaptivePresentationOrchestrationApiNames,
  publicApiCount: directorRuntimeAdaptivePresentationOrchestrationApiNames.length,
});

export const directorRuntimeAdaptivePresentationOrchestration = Object.freeze({
  phase: "DRI-5:6" as const,
  name: "DirectorRuntimeAdaptivePresentationOrchestration" as const,
  identity: directorRuntimeAdaptivePresentationOrchestrationIdentity,
  namespace: directorRuntimeAdaptivePresentationOrchestrationNamespace,
  version: directorRuntimeAdaptivePresentationOrchestrationVersion,
  layer: "DirectorRuntimeAdaptivePresentation" as const,
  stage: "AdaptivePresentationOrchestration" as const,
  status: "OrchestrationReady" as const,
  upstreamDependency: directorRuntimeAdaptivePresentationOrchestrationUpstream,
  deterministic: true as const,
  immutable: true as const,
  rendererIndependent: true as const,
  semantic: true as const,
  philosophy: "composition-not-re-resolution" as const,
  orchestrationModes: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_ORCHESTRATION_MODES,
  planChangeDimensions: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLAN_CHANGE_DIMENSIONS,
  invariants: DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_ORCHESTRATION_INVARIANTS,
  publicApiSurface: directorRuntimeAdaptivePresentationOrchestrationApiNames,
  registry: directorRuntimeAdaptivePresentationOrchestrationRegistry,
  densityPolicyBoundary: "DRI-5:5-information-density-policy-only" as const,
  architecturalStatus:
    "Established · Deterministic · Immutable · Semantic · RendererIndependent · ReadyForAdaptivePresentationPlatform" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface DirectorRuntimeAdaptivePresentationOrchestrationVerification {
  readonly ok: boolean;
  readonly identity: typeof directorRuntimeAdaptivePresentationOrchestrationIdentity;
  readonly version: typeof directorRuntimeAdaptivePresentationOrchestrationVersion;
  readonly namespace: typeof directorRuntimeAdaptivePresentationOrchestrationNamespace;
  readonly dependency: typeof directorRuntimeAdaptivePresentationOrchestrationUpstream;
  readonly orchestrationModeCount: number;
  readonly planChangeDimensionCount: number;
  readonly validationIssueCount: number;
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

export function verifyDirectorRuntimeAdaptivePresentationOrchestration():
  DirectorRuntimeAdaptivePresentationOrchestrationVerification {
  const layer = directorRuntimeAdaptivePresentationOrchestration;
  const registry = directorRuntimeAdaptivePresentationOrchestrationRegistry;

  const ok =
    layer.identity ===
      "DRI-5:6/DirectorRuntimeAdaptivePresentationOrchestration" &&
    layer.version === "5.6.0" &&
    layer.namespace === "nexora.dri.adaptive-presentation.orchestration" &&
    layer.upstreamDependency ===
      "DRI-5:5/DirectorRuntimeInformationDensityPolicy" &&
    layer.upstreamDependency ===
      directorRuntimeInformationDensityPolicyIdentity &&
    registry.dependency === layer.upstreamDependency &&
    exactOrder(
      DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_ORCHESTRATION_MODES,
      ["single", "batch"],
    ) &&
    exactOrder(
      DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLAN_CHANGE_DIMENSIONS,
      [
        "subject", "state", "attention", "emphasis", "density", "priority",
        "visibility", "interactionExposure", "source", "reason", "context",
      ],
    ) &&
    registry.orchestrationModeCount === 2 &&
    registry.planChangeDimensionCount === 11 &&
    registry.validationIssueCount === 9 &&
    registry.invariantCount === 32 &&
    Object.isFrozen(layer) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_ORCHESTRATION_MODES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLAN_CHANGE_DIMENSIONS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_ORCHESTRATION_ISSUE_CODES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_ORCHESTRATION_INVARIANTS);

  return Object.freeze({
    ok,
    identity: directorRuntimeAdaptivePresentationOrchestrationIdentity,
    version: directorRuntimeAdaptivePresentationOrchestrationVersion,
    namespace: directorRuntimeAdaptivePresentationOrchestrationNamespace,
    dependency: directorRuntimeAdaptivePresentationOrchestrationUpstream,
    orchestrationModeCount:
      DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_ORCHESTRATION_MODES.length,
    planChangeDimensionCount:
      DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_PLAN_CHANGE_DIMENSIONS.length,
    validationIssueCount:
      DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_ORCHESTRATION_ISSUE_CODES.length,
    invariantCount:
      DIRECTOR_RUNTIME_ADAPTIVE_PRESENTATION_ORCHESTRATION_INVARIANTS.length,
    frozen: Object.isFrozen(layer) && Object.isFrozen(registry),
  });
}
