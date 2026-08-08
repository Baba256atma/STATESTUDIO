/**
 * DRI-5:2 — Director Runtime Presentation Intent.
 *
 * Canonical immutable semantic presentation-intent model. Represents what
 * Director Runtime intends the presentation layer to expose for a subject.
 *
 * Representation only — no state resolution, attention/density policy,
 * orchestration, or rendering.
 */

import {
  createDirectorRuntimePresentationSubject,
  DIRECTOR_RUNTIME_ATTENTION_LEVELS,
  DIRECTOR_RUNTIME_INFORMATION_DENSITIES,
  DIRECTOR_RUNTIME_INTERACTION_EXPOSURES,
  DIRECTOR_RUNTIME_PRESENTATION_PRIORITIES,
  DIRECTOR_RUNTIME_PRESENTATION_STATES,
  DIRECTOR_RUNTIME_PRESENTATION_VISIBILITIES,
  directorRuntimeAdaptivePresentationFoundationIdentity,
  isDirectorRuntimeAttentionLevel,
  isDirectorRuntimeInformationDensity,
  isDirectorRuntimeInteractionExposure,
  isDirectorRuntimePresentationPriority,
  isDirectorRuntimePresentationState,
  isDirectorRuntimePresentationVisibility,
  type DirectorRuntimeAttentionLevel,
  type DirectorRuntimeInformationDensity,
  type DirectorRuntimeInteractionExposure,
  type DirectorRuntimePresentationPriority,
  type DirectorRuntimePresentationState,
  type DirectorRuntimePresentationSubject,
  type DirectorRuntimePresentationVisibility,
} from "@/app/lib/dri/directorRuntimeAdaptivePresentationFoundation";

export {
  DIRECTOR_RUNTIME_ATTENTION_LEVELS,
  DIRECTOR_RUNTIME_INFORMATION_DENSITIES,
  DIRECTOR_RUNTIME_INTERACTION_EXPOSURES,
  DIRECTOR_RUNTIME_PRESENTATION_PRIORITIES,
  DIRECTOR_RUNTIME_PRESENTATION_STATES,
  DIRECTOR_RUNTIME_PRESENTATION_VISIBILITIES,
  isDirectorRuntimeAttentionLevel,
  isDirectorRuntimeInformationDensity,
  isDirectorRuntimeInteractionExposure,
  isDirectorRuntimePresentationPriority,
  isDirectorRuntimePresentationState,
  isDirectorRuntimePresentationVisibility,
};

export type {
  DirectorRuntimeAttentionLevel,
  DirectorRuntimeInformationDensity,
  DirectorRuntimeInteractionExposure,
  DirectorRuntimePresentationPriority,
  DirectorRuntimePresentationState,
  DirectorRuntimePresentationSubject,
  DirectorRuntimePresentationVisibility,
} from "@/app/lib/dri/directorRuntimeAdaptivePresentationFoundation";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimePresentationIntentIdentity =
  "DRI-5:2/DirectorRuntimePresentationIntent" as const;
export const directorRuntimePresentationIntentVersion = "5.2.0" as const;
export const directorRuntimePresentationIntentNamespace =
  "nexora.dri.adaptive-presentation.intent" as const;
export const directorRuntimePresentationIntentUpstream =
  directorRuntimeAdaptivePresentationFoundationIdentity;

export const directorRuntimePresentationIntentCanonicalIdentity = Object.freeze({
  identity: directorRuntimePresentationIntentIdentity,
  version: directorRuntimePresentationIntentVersion,
  namespace: directorRuntimePresentationIntentNamespace,
  upstream: directorRuntimePresentationIntentUpstream,
});

// ─── Intent source vocabulary ───────────────────────────────────────────────

export const DIRECTOR_RUNTIME_PRESENTATION_INTENT_SOURCES = Object.freeze([
  "runtime",
  "scene",
  "interaction",
  "director",
] as const);
export type DirectorRuntimePresentationIntentSource =
  (typeof DIRECTOR_RUNTIME_PRESENTATION_INTENT_SOURCES)[number];

// ─── Change dimensions ──────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_PRESENTATION_INTENT_CHANGE_DIMENSIONS = Object.freeze([
  "subject",
  "state",
  "attention",
  "density",
  "priority",
  "visibility",
  "interactionExposure",
  "source",
  "reason",
  "context",
] as const);
export type DirectorRuntimePresentationIntentChangeDimension =
  (typeof DIRECTOR_RUNTIME_PRESENTATION_INTENT_CHANGE_DIMENSIONS)[number];

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface DirectorRuntimePresentationIntentReason {
  readonly code: string;
  readonly source: DirectorRuntimePresentationIntentSource;
  readonly detail?: string;
}

export interface DirectorRuntimePresentationIntentContextReference {
  readonly contextId: string;
  readonly contextKind: string;
}

/** Canonical runtime Presentation Intent — plain immutable semantic data. */
export interface DirectorRuntimePresentationIntent {
  readonly intentId: string;
  readonly subject: DirectorRuntimePresentationSubject;
  readonly state: DirectorRuntimePresentationState;
  readonly attention: DirectorRuntimeAttentionLevel;
  readonly density: DirectorRuntimeInformationDensity;
  readonly priority: DirectorRuntimePresentationPriority;
  readonly visibility: DirectorRuntimePresentationVisibility;
  readonly interactionExposure: DirectorRuntimeInteractionExposure;
  readonly source: DirectorRuntimePresentationIntentSource;
  readonly reason?: DirectorRuntimePresentationIntentReason;
  readonly context?: DirectorRuntimePresentationIntentContextReference;
}

export interface CreateDirectorRuntimePresentationIntentInput {
  readonly intentId?: string;
  readonly subject: DirectorRuntimePresentationSubject;
  readonly state: DirectorRuntimePresentationState;
  readonly attention: DirectorRuntimeAttentionLevel;
  readonly density: DirectorRuntimeInformationDensity;
  readonly priority: DirectorRuntimePresentationPriority;
  readonly visibility: DirectorRuntimePresentationVisibility;
  readonly interactionExposure: DirectorRuntimeInteractionExposure;
  readonly source: DirectorRuntimePresentationIntentSource;
  readonly reason?: DirectorRuntimePresentationIntentReason;
  readonly context?: DirectorRuntimePresentationIntentContextReference;
}

export type DirectorRuntimePresentationIntentCollection =
  readonly DirectorRuntimePresentationIntent[];

export interface DirectorRuntimePresentationIntentSnapshot {
  readonly intents: DirectorRuntimePresentationIntentCollection;
}

// ─── Validation contracts ───────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_PRESENTATION_INTENT_VALIDATION_ISSUE_CODES = Object.freeze([
  "missing-intent-id",
  "invalid-intent-id",
  "missing-subject",
  "invalid-subject-id",
  "invalid-subject-kind",
  "invalid-subject-namespace",
  "invalid-state",
  "invalid-attention",
  "invalid-density",
  "invalid-priority",
  "invalid-visibility",
  "invalid-interaction-exposure",
  "invalid-source",
  "invalid-reason",
  "invalid-reason-code",
  "invalid-reason-source",
  "invalid-reason-detail",
  "invalid-context",
  "invalid-context-id",
  "invalid-context-kind",
  "duplicate-intent-id",
  "invalid-collection-entry",
] as const);
export type DirectorRuntimePresentationIntentValidationIssueCode =
  (typeof DIRECTOR_RUNTIME_PRESENTATION_INTENT_VALIDATION_ISSUE_CODES)[number];

export interface DirectorRuntimePresentationIntentValidationIssue {
  readonly code: DirectorRuntimePresentationIntentValidationIssueCode;
  readonly path: string;
  readonly message: string;
}

export interface DirectorRuntimePresentationIntentValidationResult {
  readonly valid: boolean;
  readonly issues: readonly DirectorRuntimePresentationIntentValidationIssue[];
}

export interface DirectorRuntimePresentationIntentComparison {
  readonly equal: boolean;
  readonly changedDimensions: readonly DirectorRuntimePresentationIntentChangeDimension[];
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

export function isDirectorRuntimePresentationIntentSource(
  value: unknown,
): value is DirectorRuntimePresentationIntentSource {
  return (DIRECTOR_RUNTIME_PRESENTATION_INTENT_SOURCES as readonly unknown[]).includes(value);
}

function issue(
  code: DirectorRuntimePresentationIntentValidationIssueCode,
  path: string,
  message: string,
): DirectorRuntimePresentationIntentValidationIssue {
  return Object.freeze({ code, path, message });
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

function subjectIdentityKey(subject: DirectorRuntimePresentationSubject): string {
  return `${subject.namespace ?? ""}\u0000${subject.subjectKind}\u0000${subject.subjectId}`;
}

function reasonIdentityKey(
  reason: DirectorRuntimePresentationIntentReason | undefined,
): string {
  if (reason === undefined) return "";
  return `${reason.code}\u0000${reason.source}\u0000${reason.detail ?? ""}`;
}

function contextIdentityKey(
  context: DirectorRuntimePresentationIntentContextReference | undefined,
): string {
  if (context === undefined) return "";
  return `${context.contextKind}\u0000${context.contextId}`;
}

/**
 * Deterministic intent identity derived from semantic fields.
 * No timestamps, randomness, or global counters.
 */
export function deriveDirectorRuntimePresentationIntentId(input: {
  readonly subject: DirectorRuntimePresentationSubject;
  readonly state: DirectorRuntimePresentationState;
  readonly attention: DirectorRuntimeAttentionLevel;
  readonly density: DirectorRuntimeInformationDensity;
  readonly priority: DirectorRuntimePresentationPriority;
  readonly visibility: DirectorRuntimePresentationVisibility;
  readonly interactionExposure: DirectorRuntimeInteractionExposure;
  readonly source: DirectorRuntimePresentationIntentSource;
  readonly reason?: DirectorRuntimePresentationIntentReason;
  readonly context?: DirectorRuntimePresentationIntentContextReference;
}): string {
  return [
    "dri-ap-intent",
    directorRuntimePresentationIntentVersion,
    subjectIdentityKey(input.subject),
    input.state,
    input.attention,
    input.density,
    input.priority,
    input.visibility,
    input.interactionExposure,
    input.source,
    reasonIdentityKey(input.reason),
    contextIdentityKey(input.context),
  ].join(":");
}

function subjectsEqual(
  left: DirectorRuntimePresentationSubject,
  right: DirectorRuntimePresentationSubject,
): boolean {
  return left.subjectId === right.subjectId &&
    left.subjectKind === right.subjectKind &&
    left.namespace === right.namespace;
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

function collectSubjectIssues(
  subject: unknown,
  path: string,
): DirectorRuntimePresentationIntentValidationIssue[] {
  if (!isPlainObject(subject)) {
    return [issue("missing-subject", path, "subject must be a plain object")];
  }
  const issues: DirectorRuntimePresentationIntentValidationIssue[] = [];
  if (!isNonEmptyString(subject.subjectId)) {
    issues.push(issue("invalid-subject-id", `${path}.subjectId`, "subjectId must be a non-empty string"));
  }
  if (!isNonEmptyString(subject.subjectKind)) {
    issues.push(issue(
      "invalid-subject-kind",
      `${path}.subjectKind`,
      "subjectKind must be a non-empty string",
    ));
  }
  if (subject.namespace !== undefined && !isNonEmptyString(subject.namespace)) {
    issues.push(issue(
      "invalid-subject-namespace",
      `${path}.namespace`,
      "namespace must be a non-empty string when provided",
    ));
  }
  return issues;
}

function collectReasonIssues(
  reason: unknown,
  path: string,
): DirectorRuntimePresentationIntentValidationIssue[] {
  if (reason === undefined) return [];
  if (!isPlainObject(reason)) {
    return [issue("invalid-reason", path, "reason must be a plain object when provided")];
  }
  const issues: DirectorRuntimePresentationIntentValidationIssue[] = [];
  if (!isNonEmptyString(reason.code)) {
    issues.push(issue("invalid-reason-code", `${path}.code`, "reason.code must be a non-empty string"));
  }
  if (!isDirectorRuntimePresentationIntentSource(reason.source)) {
    issues.push(issue(
      "invalid-reason-source",
      `${path}.source`,
      "reason.source must be a canonical intent source",
    ));
  }
  if (reason.detail !== undefined && !isNonEmptyString(reason.detail)) {
    issues.push(issue(
      "invalid-reason-detail",
      `${path}.detail`,
      "reason.detail must be a non-empty string when provided",
    ));
  }
  return issues;
}

function collectContextIssues(
  context: unknown,
  path: string,
): DirectorRuntimePresentationIntentValidationIssue[] {
  if (context === undefined) return [];
  if (!isPlainObject(context)) {
    return [issue("invalid-context", path, "context must be a plain object when provided")];
  }
  const issues: DirectorRuntimePresentationIntentValidationIssue[] = [];
  if (!isNonEmptyString(context.contextId)) {
    issues.push(issue(
      "invalid-context-id",
      `${path}.contextId`,
      "context.contextId must be a non-empty string",
    ));
  }
  if (!isNonEmptyString(context.contextKind)) {
    issues.push(issue(
      "invalid-context-kind",
      `${path}.contextKind`,
      "context.contextKind must be a non-empty string",
    ));
  }
  return issues;
}

function collectIntentIssues(
  value: unknown,
  path = "intent",
): DirectorRuntimePresentationIntentValidationIssue[] {
  if (!isPlainObject(value)) {
    return [issue("missing-subject", path, "intent must be a plain object")];
  }

  const issues: DirectorRuntimePresentationIntentValidationIssue[] = [];

  if (value.intentId === undefined || value.intentId === null || value.intentId === "") {
    issues.push(issue("missing-intent-id", `${path}.intentId`, "intentId is required"));
  } else if (!isNonEmptyString(value.intentId)) {
    issues.push(issue("invalid-intent-id", `${path}.intentId`, "intentId must be a non-empty string"));
  }

  issues.push(...collectSubjectIssues(value.subject, `${path}.subject`));

  if (!isDirectorRuntimePresentationState(value.state)) {
    issues.push(issue("invalid-state", `${path}.state`, "state must be a canonical presentation state"));
  }
  if (!isDirectorRuntimeAttentionLevel(value.attention)) {
    issues.push(issue(
      "invalid-attention",
      `${path}.attention`,
      "attention must be a canonical attention level",
    ));
  }
  if (!isDirectorRuntimeInformationDensity(value.density)) {
    issues.push(issue(
      "invalid-density",
      `${path}.density`,
      "density must be a canonical information density",
    ));
  }
  if (!isDirectorRuntimePresentationPriority(value.priority)) {
    issues.push(issue(
      "invalid-priority",
      `${path}.priority`,
      "priority must be a canonical presentation priority",
    ));
  }
  if (!isDirectorRuntimePresentationVisibility(value.visibility)) {
    issues.push(issue(
      "invalid-visibility",
      `${path}.visibility`,
      "visibility must be a canonical presentation visibility",
    ));
  }
  if (!isDirectorRuntimeInteractionExposure(value.interactionExposure)) {
    issues.push(issue(
      "invalid-interaction-exposure",
      `${path}.interactionExposure`,
      "interactionExposure must be a canonical interaction exposure",
    ));
  }
  if (!isDirectorRuntimePresentationIntentSource(value.source)) {
    issues.push(issue("invalid-source", `${path}.source`, "source must be a canonical intent source"));
  }

  issues.push(...collectReasonIssues(value.reason, `${path}.reason`));
  issues.push(...collectContextIssues(value.context, `${path}.context`));
  return issues;
}

function freezeValidationResult(
  issues: readonly DirectorRuntimePresentationIntentValidationIssue[],
): DirectorRuntimePresentationIntentValidationResult {
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze([...issues]),
  });
}

// ─── Validation ─────────────────────────────────────────────────────────────

export function validateDirectorRuntimePresentationIntent(
  value: unknown,
): DirectorRuntimePresentationIntentValidationResult {
  return freezeValidationResult(collectIntentIssues(value));
}

export function isDirectorRuntimePresentationIntent(
  value: unknown,
): value is DirectorRuntimePresentationIntent {
  return validateDirectorRuntimePresentationIntent(value).valid;
}

export function validateDirectorRuntimePresentationIntentCollection(
  value: unknown,
): DirectorRuntimePresentationIntentValidationResult {
  if (!Array.isArray(value)) {
    return freezeValidationResult([
      issue("invalid-collection-entry", "collection", "collection must be an array"),
    ]);
  }

  const issues: DirectorRuntimePresentationIntentValidationIssue[] = [];
  const seen = new Map<string, number>();

  for (let index = 0; index < value.length; index += 1) {
    const entryIssues = collectIntentIssues(value[index], `collection[${index}]`);
    issues.push(...entryIssues);
    const entry = value[index];
    if (isPlainObject(entry) && isNonEmptyString(entry.intentId)) {
      const previous = seen.get(entry.intentId);
      if (previous !== undefined) {
        issues.push(issue(
          "duplicate-intent-id",
          `collection[${index}].intentId`,
          `duplicate intentId "${entry.intentId}" also at collection[${previous}]`,
        ));
      } else {
        seen.set(entry.intentId, index);
      }
    }
  }

  return freezeValidationResult(issues);
}

// ─── Factory ────────────────────────────────────────────────────────────────

export function createDirectorRuntimePresentationIntent(
  input: CreateDirectorRuntimePresentationIntentInput,
): DirectorRuntimePresentationIntent {
  const intentId = input.intentId === undefined
    ? deriveDirectorRuntimePresentationIntentId(input)
    : input.intentId;

  const candidate = Object.freeze({
    intentId,
    subject: createDirectorRuntimePresentationSubject(input.subject),
    state: input.state,
    attention: input.attention,
    density: input.density,
    priority: input.priority,
    visibility: input.visibility,
    interactionExposure: input.interactionExposure,
    source: input.source,
    ...(input.reason === undefined ? {} : { reason: freezeReason(input.reason) }),
    ...(input.context === undefined ? {} : { context: freezeContext(input.context) }),
  });

  const validation = validateDirectorRuntimePresentationIntent(candidate);
  if (!validation.valid) {
    const first = validation.issues[0]!;
    throw new TypeError(`${first.code}: ${first.message}`);
  }

  return candidate;
}

// ─── Equality & comparison ──────────────────────────────────────────────────

/**
 * Semantic equality across all intent fields:
 * intentId, subject, state, attention, density, priority, visibility,
 * interactionExposure, source, reason, context.
 */
export function areDirectorRuntimePresentationIntentsEqual(
  left: DirectorRuntimePresentationIntent,
  right: DirectorRuntimePresentationIntent,
): boolean {
  return left.intentId === right.intentId &&
    subjectsEqual(left.subject, right.subject) &&
    left.state === right.state &&
    left.attention === right.attention &&
    left.density === right.density &&
    left.priority === right.priority &&
    left.visibility === right.visibility &&
    left.interactionExposure === right.interactionExposure &&
    left.source === right.source &&
    reasonsEqual(left.reason, right.reason) &&
    contextsEqual(left.context, right.context);
}

export function compareDirectorRuntimePresentationIntents(
  previous: DirectorRuntimePresentationIntent,
  next: DirectorRuntimePresentationIntent,
): DirectorRuntimePresentationIntentComparison {
  const changed: DirectorRuntimePresentationIntentChangeDimension[] = [];

  if (!subjectsEqual(previous.subject, next.subject)) changed.push("subject");
  if (previous.state !== next.state) changed.push("state");
  if (previous.attention !== next.attention) changed.push("attention");
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
    equal: areDirectorRuntimePresentationIntentsEqual(previous, next),
    changedDimensions: Object.freeze(changed),
  });
}

// ─── Collections & snapshot ─────────────────────────────────────────────────

/** Preserves caller order. Does not sort, merge, or resolve conflicts. */
export function createDirectorRuntimePresentationIntentCollection(
  intents: readonly CreateDirectorRuntimePresentationIntentInput[],
): DirectorRuntimePresentationIntentCollection {
  const collection = Object.freeze(
    intents.map((entry) => createDirectorRuntimePresentationIntent(entry)),
  );

  const validation = validateDirectorRuntimePresentationIntentCollection(collection);
  if (!validation.valid) {
    const first = validation.issues[0]!;
    throw new TypeError(`${first.code}: ${first.message}`);
  }

  return collection;
}

export function createDirectorRuntimePresentationIntentSnapshot(
  intents: readonly CreateDirectorRuntimePresentationIntentInput[],
): DirectorRuntimePresentationIntentSnapshot {
  return Object.freeze({
    intents: createDirectorRuntimePresentationIntentCollection(intents),
  });
}

export function findDirectorRuntimePresentationIntentById(
  collection: DirectorRuntimePresentationIntentCollection,
  intentId: string,
): DirectorRuntimePresentationIntent | undefined {
  return collection.find((intent) => intent.intentId === intentId);
}

export function findDirectorRuntimePresentationIntentsBySubjectId(
  collection: DirectorRuntimePresentationIntentCollection,
  subjectId: string,
): DirectorRuntimePresentationIntentCollection {
  return Object.freeze(
    collection.filter((intent) => intent.subject.subjectId === subjectId),
  );
}

// ─── Invariants ─────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_PRESENTATION_INTENT_INVARIANTS = Object.freeze([
  Object.freeze({
    id: "sole-immediate-dependency",
    statement: "exactly one immediate dependency exists",
  }),
  Object.freeze({
    id: "dependency-is-dri-5-1",
    statement: "dependency is DRI-5:1",
  }),
  Object.freeze({
    id: "vocabulary-reuses-dri-5-1",
    statement: "intent vocabulary reuses DRI-5:1",
  }),
  Object.freeze({
    id: "deterministic-identity",
    statement: "every intent has deterministic identity",
  }),
  Object.freeze({
    id: "explicit-subject",
    statement: "every intent has a subject",
  }),
  Object.freeze({
    id: "explicit-state",
    statement: "state is explicit",
  }),
  Object.freeze({
    id: "explicit-attention",
    statement: "attention is explicit",
  }),
  Object.freeze({
    id: "explicit-density",
    statement: "density is explicit",
  }),
  Object.freeze({
    id: "explicit-priority",
    statement: "priority is explicit",
  }),
  Object.freeze({
    id: "explicit-visibility",
    statement: "visibility is explicit",
  }),
  Object.freeze({
    id: "explicit-interaction-exposure",
    statement: "interaction exposure is explicit",
  }),
  Object.freeze({
    id: "no-state-resolution",
    statement: "intent creation performs no state resolution",
  }),
  Object.freeze({
    id: "no-attention-resolution",
    statement: "intent creation performs no attention resolution",
  }),
  Object.freeze({
    id: "no-density-resolution",
    statement: "intent creation performs no density resolution",
  }),
  Object.freeze({
    id: "unusual-combinations-representable",
    statement: "unusual but valid semantic combinations remain representable",
  }),
  Object.freeze({
    id: "caller-input-not-mutated",
    statement: "caller input is not mutated",
  }),
  Object.freeze({
    id: "canonical-output-immutable",
    statement: "canonical output is immutable",
  }),
  Object.freeze({
    id: "validation-structural-only",
    statement: "validation is structural only",
  }),
  Object.freeze({
    id: "equality-semantic-deterministic",
    statement: "equality is semantic and deterministic",
  }),
  Object.freeze({
    id: "collections-deterministic",
    statement: "collections preserve deterministic behavior",
  }),
  Object.freeze({
    id: "duplicate-ids-detectable",
    statement: "duplicate IDs are detectable",
  }),
  Object.freeze({
    id: "no-rendering",
    statement: "no rendering occurs",
  }),
  Object.freeze({
    id: "no-orchestration",
    statement: "no orchestration occurs",
  }),
  Object.freeze({
    id: "no-ui-event-behavior",
    statement: "no UI event behavior exists",
  }),
  Object.freeze({
    id: "no-nondeterministic-identity",
    statement: "no timestamps/randomness/global counters are used",
  }),
  Object.freeze({
    id: "renderer-independence",
    statement: "renderer independence is preserved",
  }),
] as const);

// ─── Registry ───────────────────────────────────────────────────────────────

export const directorRuntimePresentationIntentApiNames = Object.freeze([
  "isDirectorRuntimePresentationIntentSource",
  "deriveDirectorRuntimePresentationIntentId",
  "validateDirectorRuntimePresentationIntent",
  "isDirectorRuntimePresentationIntent",
  "validateDirectorRuntimePresentationIntentCollection",
  "createDirectorRuntimePresentationIntent",
  "areDirectorRuntimePresentationIntentsEqual",
  "compareDirectorRuntimePresentationIntents",
  "createDirectorRuntimePresentationIntentCollection",
  "createDirectorRuntimePresentationIntentSnapshot",
  "findDirectorRuntimePresentationIntentById",
  "findDirectorRuntimePresentationIntentsBySubjectId",
  "verifyDirectorRuntimePresentationIntent",
] as const);

export const directorRuntimePresentationIntentCapabilities = Object.freeze([
  "intent-representation",
  "structural-validation",
  "semantic-equality",
  "change-detection",
  "deterministic-identity",
  "immutable-collections",
  "duplicate-detection",
] as const);

export const directorRuntimePresentationIntentRegistry = Object.freeze({
  identity: directorRuntimePresentationIntentIdentity,
  version: directorRuntimePresentationIntentVersion,
  namespace: directorRuntimePresentationIntentNamespace,
  dependency: directorRuntimePresentationIntentUpstream,
  intentSources: DIRECTOR_RUNTIME_PRESENTATION_INTENT_SOURCES,
  intentSourceCount: DIRECTOR_RUNTIME_PRESENTATION_INTENT_SOURCES.length,
  changeDimensions: DIRECTOR_RUNTIME_PRESENTATION_INTENT_CHANGE_DIMENSIONS,
  changeDimensionCount: DIRECTOR_RUNTIME_PRESENTATION_INTENT_CHANGE_DIMENSIONS.length,
  capabilities: directorRuntimePresentationIntentCapabilities,
  capabilityCount: directorRuntimePresentationIntentCapabilities.length,
  invariants: DIRECTOR_RUNTIME_PRESENTATION_INTENT_INVARIANTS,
  invariantCount: DIRECTOR_RUNTIME_PRESENTATION_INTENT_INVARIANTS.length,
  publicApis: directorRuntimePresentationIntentApiNames,
  publicApiCount: directorRuntimePresentationIntentApiNames.length,
});

export const directorRuntimePresentationIntent = Object.freeze({
  phase: "DRI-5:2" as const,
  name: "DirectorRuntimePresentationIntent" as const,
  identity: directorRuntimePresentationIntentIdentity,
  namespace: directorRuntimePresentationIntentNamespace,
  version: directorRuntimePresentationIntentVersion,
  layer: "DirectorRuntimeAdaptivePresentation" as const,
  stage: "PresentationIntent" as const,
  status: "IntentReady" as const,
  upstreamDependency: directorRuntimePresentationIntentUpstream,
  deterministic: true as const,
  immutable: true as const,
  rendererIndependent: true as const,
  semantic: true as const,
  philosophy: "representation-not-decision" as const,
  intentSources: DIRECTOR_RUNTIME_PRESENTATION_INTENT_SOURCES,
  changeDimensions: DIRECTOR_RUNTIME_PRESENTATION_INTENT_CHANGE_DIMENSIONS,
  invariants: DIRECTOR_RUNTIME_PRESENTATION_INTENT_INVARIANTS,
  publicApiSurface: directorRuntimePresentationIntentApiNames,
  registry: directorRuntimePresentationIntentRegistry,
  foundationBoundary: "DRI-5:1-foundation-only" as const,
  architecturalStatus:
    "Established · Deterministic · Immutable · Semantic · RendererIndependent · ReadyForStateResolution" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface DirectorRuntimePresentationIntentVerification {
  readonly ok: boolean;
  readonly identity: typeof directorRuntimePresentationIntentIdentity;
  readonly version: typeof directorRuntimePresentationIntentVersion;
  readonly namespace: typeof directorRuntimePresentationIntentNamespace;
  readonly dependency: typeof directorRuntimePresentationIntentUpstream;
  readonly intentSourceCount: number;
  readonly changeDimensionCount: number;
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

export function verifyDirectorRuntimePresentationIntent():
  DirectorRuntimePresentationIntentVerification {
  const layer = directorRuntimePresentationIntent;
  const registry = directorRuntimePresentationIntentRegistry;
  const expectedSources = ["runtime", "scene", "interaction", "director"] as const;
  const expectedDimensions = [
    "subject", "state", "attention", "density", "priority", "visibility",
    "interactionExposure", "source", "reason", "context",
  ] as const;

  const ok =
    layer.identity === "DRI-5:2/DirectorRuntimePresentationIntent" &&
    layer.version === "5.2.0" &&
    layer.namespace === "nexora.dri.adaptive-presentation.intent" &&
    layer.upstreamDependency ===
      "DRI-5:1/DirectorRuntimeAdaptivePresentationFoundation" &&
    layer.upstreamDependency ===
      directorRuntimeAdaptivePresentationFoundationIdentity &&
    registry.dependency === layer.upstreamDependency &&
    exactOrder(DIRECTOR_RUNTIME_PRESENTATION_INTENT_SOURCES, expectedSources) &&
    exactOrder(DIRECTOR_RUNTIME_PRESENTATION_INTENT_CHANGE_DIMENSIONS, expectedDimensions) &&
    registry.intentSourceCount === 4 &&
    registry.changeDimensionCount === 10 &&
    registry.invariantCount === 26 &&
    new Set(DIRECTOR_RUNTIME_PRESENTATION_INTENT_SOURCES).size === 4 &&
    new Set(DIRECTOR_RUNTIME_PRESENTATION_INTENT_CHANGE_DIMENSIONS).size === 10 &&
    Object.isFrozen(layer) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(DIRECTOR_RUNTIME_PRESENTATION_INTENT_SOURCES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_PRESENTATION_INTENT_CHANGE_DIMENSIONS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_PRESENTATION_INTENT_INVARIANTS);

  return Object.freeze({
    ok,
    identity: directorRuntimePresentationIntentIdentity,
    version: directorRuntimePresentationIntentVersion,
    namespace: directorRuntimePresentationIntentNamespace,
    dependency: directorRuntimePresentationIntentUpstream,
    intentSourceCount: DIRECTOR_RUNTIME_PRESENTATION_INTENT_SOURCES.length,
    changeDimensionCount: DIRECTOR_RUNTIME_PRESENTATION_INTENT_CHANGE_DIMENSIONS.length,
    invariantCount: DIRECTOR_RUNTIME_PRESENTATION_INTENT_INVARIANTS.length,
    frozen: Object.isFrozen(layer) && Object.isFrozen(registry),
  });
}
