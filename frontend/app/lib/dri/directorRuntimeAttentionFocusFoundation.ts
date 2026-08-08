/**
 * DRI-6:1 — Director Runtime Attention & Focus Foundation.
 *
 * Establishes immutable vocabulary and plain-data contracts for executive
 * attention and focus. Describes where attention is directed — not how
 * information is presented, prioritized, rendered, or transitioned.
 */

import { directorRuntimeAdaptivePresentationPublicIndexIdentity } from
  "@/app/lib/dri/directorRuntimeAdaptivePresentationPublicIndex";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeAttentionFocusFoundationIdentity =
  "DRI-6:1/DirectorRuntimeAttentionFocusFoundation" as const;
export const directorRuntimeAttentionFocusFoundationVersion = "6.1.0" as const;
export const directorRuntimeAttentionFocusFoundationNamespace =
  "nexora.dri.attention-focus.foundation" as const;
export const directorRuntimeAttentionFocusFoundationUpstream =
  directorRuntimeAdaptivePresentationPublicIndexIdentity;

export const directorRuntimeAttentionFocusFoundationCanonicalIdentity =
  Object.freeze({
    identity: directorRuntimeAttentionFocusFoundationIdentity,
    version: directorRuntimeAttentionFocusFoundationVersion,
    namespace: directorRuntimeAttentionFocusFoundationNamespace,
    upstream: directorRuntimeAttentionFocusFoundationUpstream,
  });

// ─── Attention focus levels (executive attention — not DRI-5 presentation) ──

/**
 * Canonical executive attention levels.
 * Distinct from DRI-5 presentation attention (`normal`/`notice`/`warning`/`critical`).
 */
export const DIRECTOR_RUNTIME_ATTENTION_FOCUS_LEVELS = Object.freeze([
  "primary",
  "secondary",
  "context",
  "background",
  "suppressed",
] as const);
export type DirectorRuntimeAttentionFocusLevel =
  (typeof DIRECTOR_RUNTIME_ATTENTION_FOCUS_LEVELS)[number];

// ─── Focus roles (separate dimension from attention level) ──────────────────

export const DIRECTOR_RUNTIME_FOCUS_ROLES = Object.freeze([
  "focused",
  "supporting",
  "contextual",
  "peripheral",
  "none",
] as const);
export type DirectorRuntimeFocusRole =
  (typeof DIRECTOR_RUNTIME_FOCUS_ROLES)[number];

// ─── Subject kinds ──────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ATTENTION_SUBJECT_KINDS = Object.freeze([
  "goal",
  "object",
  "pack",
  "problem",
  "scenario",
  "decision",
  "execution",
  "kpi",
  "koi",
  "scene",
  "path",
] as const);
export type DirectorRuntimeAttentionSubjectKind =
  (typeof DIRECTOR_RUNTIME_ATTENTION_SUBJECT_KINDS)[number];

// ─── Signal sources ─────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ATTENTION_SIGNAL_SOURCES = Object.freeze([
  "user-interaction",
  "runtime-state",
  "goal",
  "kpi",
  "koi",
  "problem",
  "scenario",
  "decision",
  "execution",
  "advisor",
  "system",
] as const);
export type DirectorRuntimeAttentionSignalSource =
  (typeof DIRECTOR_RUNTIME_ATTENTION_SIGNAL_SOURCES)[number];

// ─── Reason kinds ───────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ATTENTION_REASON_KINDS = Object.freeze([
  "explicit-selection",
  "risk",
  "warning",
  "critical-state",
  "dependency",
  "goal-relevance",
  "context-relevance",
  "scenario-relevance",
  "decision-relevance",
  "execution-relevance",
  "advisor-relevance",
  "system-relevance",
] as const);
export type DirectorRuntimeAttentionReasonKind =
  (typeof DIRECTOR_RUNTIME_ATTENTION_REASON_KINDS)[number];

// ─── Scopes ─────────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ATTENTION_SCOPES = Object.freeze([
  "subject",
  "local-context",
  "scene",
  "workspace",
  "global",
] as const);
export type DirectorRuntimeAttentionScope =
  (typeof DIRECTOR_RUNTIME_ATTENTION_SCOPES)[number];

// ─── Persistence ────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ATTENTION_PERSISTENCE_VALUES = Object.freeze([
  "transient",
  "session",
  "persistent",
] as const);
export type DirectorRuntimeAttentionPersistence =
  (typeof DIRECTOR_RUNTIME_ATTENTION_PERSISTENCE_VALUES)[number];

// ─── Relationship kinds ─────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ATTENTION_RELATIONSHIP_KINDS = Object.freeze([
  "direct",
  "dependency",
  "upstream",
  "downstream",
  "supporting",
  "contextual",
] as const);
export type DirectorRuntimeAttentionRelationshipKind =
  (typeof DIRECTOR_RUNTIME_ATTENTION_RELATIONSHIP_KINDS)[number];

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface DirectorRuntimeAttentionSubjectReference {
  readonly subjectId: string;
  readonly subjectKind: DirectorRuntimeAttentionSubjectKind;
}

export interface DirectorRuntimeAttentionSignal {
  readonly signalId: string;
  readonly subject: DirectorRuntimeAttentionSubjectReference;
  readonly source: DirectorRuntimeAttentionSignalSource;
  readonly reason: DirectorRuntimeAttentionReasonKind;
  readonly scope: DirectorRuntimeAttentionScope;
  readonly requestedLevel: DirectorRuntimeAttentionFocusLevel;
  readonly persistence: DirectorRuntimeAttentionPersistence;
}

export interface DirectorRuntimeFocusState {
  readonly subject: DirectorRuntimeAttentionSubjectReference;
  readonly attentionLevel: DirectorRuntimeAttentionFocusLevel;
  readonly focusRole: DirectorRuntimeFocusRole;
}

export interface DirectorRuntimeAttentionRelationship {
  readonly source: DirectorRuntimeAttentionSubjectReference;
  readonly target: DirectorRuntimeAttentionSubjectReference;
  readonly kind: DirectorRuntimeAttentionRelationshipKind;
}

export interface DirectorRuntimeAttentionContext {
  readonly focusStates: readonly DirectorRuntimeFocusState[];
  readonly signals: readonly DirectorRuntimeAttentionSignal[];
  readonly relationships: readonly DirectorRuntimeAttentionRelationship[];
}

export const DIRECTOR_RUNTIME_EMPTY_ATTENTION_CONTEXT = Object.freeze({
  focusStates: Object.freeze([]) as readonly DirectorRuntimeFocusState[],
  signals: Object.freeze([]) as readonly DirectorRuntimeAttentionSignal[],
  relationships: Object.freeze(
    [],
  ) as readonly DirectorRuntimeAttentionRelationship[],
}) satisfies DirectorRuntimeAttentionContext;

// ─── Validation ─────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ATTENTION_FOCUS_VALIDATION_ISSUE_CODES =
  Object.freeze([
    "invalid-attention-level",
    "invalid-focus-role",
    "invalid-subject-kind",
    "invalid-signal-source",
    "invalid-reason-kind",
    "invalid-scope",
    "invalid-persistence",
    "invalid-relationship-kind",
    "missing-subject-id",
    "invalid-subject-reference",
    "invalid-signal-id",
    "invalid-attention-signal",
    "invalid-focus-state",
    "invalid-attention-relationship",
    "invalid-attention-context",
    "invalid-context-entry",
  ] as const);
export type DirectorRuntimeAttentionFocusValidationIssueCode =
  (typeof DIRECTOR_RUNTIME_ATTENTION_FOCUS_VALIDATION_ISSUE_CODES)[number];

export interface DirectorRuntimeAttentionFocusValidationIssue {
  readonly code: DirectorRuntimeAttentionFocusValidationIssueCode;
  readonly path: string;
  readonly message: string;
}

export interface DirectorRuntimeAttentionFocusValidationResult {
  readonly valid: boolean;
  readonly issues: readonly DirectorRuntimeAttentionFocusValidationIssue[];
}

function issue(
  code: DirectorRuntimeAttentionFocusValidationIssueCode,
  path: string,
  message: string,
): DirectorRuntimeAttentionFocusValidationIssue {
  return Object.freeze({ code, path, message });
}

function freezeValidationResult(
  issues: readonly DirectorRuntimeAttentionFocusValidationIssue[],
): DirectorRuntimeAttentionFocusValidationResult {
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze([...issues]),
  });
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

export function isDirectorRuntimeAttentionFocusLevel(
  value: unknown,
): value is DirectorRuntimeAttentionFocusLevel {
  return (DIRECTOR_RUNTIME_ATTENTION_FOCUS_LEVELS as readonly unknown[]).includes(
    value,
  );
}

export function isDirectorRuntimeFocusRole(
  value: unknown,
): value is DirectorRuntimeFocusRole {
  return (DIRECTOR_RUNTIME_FOCUS_ROLES as readonly unknown[]).includes(value);
}

export function isDirectorRuntimeAttentionSubjectKind(
  value: unknown,
): value is DirectorRuntimeAttentionSubjectKind {
  return (DIRECTOR_RUNTIME_ATTENTION_SUBJECT_KINDS as readonly unknown[]).includes(
    value,
  );
}

export function isDirectorRuntimeAttentionSignalSource(
  value: unknown,
): value is DirectorRuntimeAttentionSignalSource {
  return (DIRECTOR_RUNTIME_ATTENTION_SIGNAL_SOURCES as readonly unknown[]).includes(
    value,
  );
}

export function isDirectorRuntimeAttentionReasonKind(
  value: unknown,
): value is DirectorRuntimeAttentionReasonKind {
  return (DIRECTOR_RUNTIME_ATTENTION_REASON_KINDS as readonly unknown[]).includes(
    value,
  );
}

export function isDirectorRuntimeAttentionScope(
  value: unknown,
): value is DirectorRuntimeAttentionScope {
  return (DIRECTOR_RUNTIME_ATTENTION_SCOPES as readonly unknown[]).includes(value);
}

export function isDirectorRuntimeAttentionPersistence(
  value: unknown,
): value is DirectorRuntimeAttentionPersistence {
  return (
    DIRECTOR_RUNTIME_ATTENTION_PERSISTENCE_VALUES as readonly unknown[]
  ).includes(value);
}

export function isDirectorRuntimeAttentionRelationshipKind(
  value: unknown,
): value is DirectorRuntimeAttentionRelationshipKind {
  return (
    DIRECTOR_RUNTIME_ATTENTION_RELATIONSHIP_KINDS as readonly unknown[]
  ).includes(value);
}

function collectSubjectReferenceIssues(
  value: unknown,
  path = "subject",
): DirectorRuntimeAttentionFocusValidationIssue[] {
  if (!isPlainObject(value)) {
    return [issue("invalid-subject-reference", path, "subject must be a plain object")];
  }
  const issues: DirectorRuntimeAttentionFocusValidationIssue[] = [];
  if (!isNonEmptyString(value.subjectId)) {
    issues.push(
      issue("missing-subject-id", `${path}.subjectId`, "subjectId must be a non-empty string"),
    );
  }
  if (!isDirectorRuntimeAttentionSubjectKind(value.subjectKind)) {
    issues.push(
      issue(
        "invalid-subject-kind",
        `${path}.subjectKind`,
        "subjectKind must be a canonical attention subject kind",
      ),
    );
  }
  return issues;
}

export function validateDirectorRuntimeAttentionSubjectReference(
  value: unknown,
): DirectorRuntimeAttentionFocusValidationResult {
  return freezeValidationResult(collectSubjectReferenceIssues(value));
}

export function isDirectorRuntimeAttentionSubjectReference(
  value: unknown,
): value is DirectorRuntimeAttentionSubjectReference {
  return validateDirectorRuntimeAttentionSubjectReference(value).valid;
}

function collectSignalIssues(
  value: unknown,
  path = "signal",
): DirectorRuntimeAttentionFocusValidationIssue[] {
  if (!isPlainObject(value)) {
    return [issue("invalid-attention-signal", path, "signal must be a plain object")];
  }
  const issues: DirectorRuntimeAttentionFocusValidationIssue[] = [];
  if (!isNonEmptyString(value.signalId)) {
    issues.push(
      issue("invalid-signal-id", `${path}.signalId`, "signalId must be a non-empty string"),
    );
  }
  issues.push(...collectSubjectReferenceIssues(value.subject, `${path}.subject`));
  if (!isDirectorRuntimeAttentionSignalSource(value.source)) {
    issues.push(
      issue("invalid-signal-source", `${path}.source`, "source must be canonical"),
    );
  }
  if (!isDirectorRuntimeAttentionReasonKind(value.reason)) {
    issues.push(
      issue("invalid-reason-kind", `${path}.reason`, "reason must be canonical"),
    );
  }
  if (!isDirectorRuntimeAttentionScope(value.scope)) {
    issues.push(issue("invalid-scope", `${path}.scope`, "scope must be canonical"));
  }
  if (!isDirectorRuntimeAttentionFocusLevel(value.requestedLevel)) {
    issues.push(
      issue(
        "invalid-attention-level",
        `${path}.requestedLevel`,
        "requestedLevel must be a canonical attention focus level",
      ),
    );
  }
  if (!isDirectorRuntimeAttentionPersistence(value.persistence)) {
    issues.push(
      issue(
        "invalid-persistence",
        `${path}.persistence`,
        "persistence must be canonical",
      ),
    );
  }
  return issues;
}

export function validateDirectorRuntimeAttentionSignal(
  value: unknown,
): DirectorRuntimeAttentionFocusValidationResult {
  return freezeValidationResult(collectSignalIssues(value));
}

export function isDirectorRuntimeAttentionSignal(
  value: unknown,
): value is DirectorRuntimeAttentionSignal {
  return validateDirectorRuntimeAttentionSignal(value).valid;
}

function collectFocusStateIssues(
  value: unknown,
  path = "focusState",
): DirectorRuntimeAttentionFocusValidationIssue[] {
  if (!isPlainObject(value)) {
    return [issue("invalid-focus-state", path, "focus state must be a plain object")];
  }
  const issues: DirectorRuntimeAttentionFocusValidationIssue[] = [];
  issues.push(...collectSubjectReferenceIssues(value.subject, `${path}.subject`));
  if (!isDirectorRuntimeAttentionFocusLevel(value.attentionLevel)) {
    issues.push(
      issue(
        "invalid-attention-level",
        `${path}.attentionLevel`,
        "attentionLevel must be a canonical attention focus level",
      ),
    );
  }
  if (!isDirectorRuntimeFocusRole(value.focusRole)) {
    issues.push(
      issue("invalid-focus-role", `${path}.focusRole`, "focusRole must be canonical"),
    );
  }
  return issues;
}

export function validateDirectorRuntimeFocusState(
  value: unknown,
): DirectorRuntimeAttentionFocusValidationResult {
  return freezeValidationResult(collectFocusStateIssues(value));
}

export function isDirectorRuntimeFocusState(
  value: unknown,
): value is DirectorRuntimeFocusState {
  return validateDirectorRuntimeFocusState(value).valid;
}

function collectRelationshipIssues(
  value: unknown,
  path = "relationship",
): DirectorRuntimeAttentionFocusValidationIssue[] {
  if (!isPlainObject(value)) {
    return [
      issue(
        "invalid-attention-relationship",
        path,
        "relationship must be a plain object",
      ),
    ];
  }
  const issues: DirectorRuntimeAttentionFocusValidationIssue[] = [];
  issues.push(...collectSubjectReferenceIssues(value.source, `${path}.source`));
  issues.push(...collectSubjectReferenceIssues(value.target, `${path}.target`));
  if (!isDirectorRuntimeAttentionRelationshipKind(value.kind)) {
    issues.push(
      issue(
        "invalid-relationship-kind",
        `${path}.kind`,
        "relationship kind must be canonical",
      ),
    );
  }
  return issues;
}

export function validateDirectorRuntimeAttentionRelationship(
  value: unknown,
): DirectorRuntimeAttentionFocusValidationResult {
  return freezeValidationResult(collectRelationshipIssues(value));
}

export function isDirectorRuntimeAttentionRelationship(
  value: unknown,
): value is DirectorRuntimeAttentionRelationship {
  return validateDirectorRuntimeAttentionRelationship(value).valid;
}

function collectContextIssues(
  value: unknown,
  path = "context",
): DirectorRuntimeAttentionFocusValidationIssue[] {
  if (!isPlainObject(value)) {
    return [
      issue("invalid-attention-context", path, "attention context must be a plain object"),
    ];
  }
  const issues: DirectorRuntimeAttentionFocusValidationIssue[] = [];
  if (!Array.isArray(value.focusStates)) {
    issues.push(
      issue(
        "invalid-context-entry",
        `${path}.focusStates`,
        "focusStates must be an array",
      ),
    );
  } else {
    value.focusStates.forEach((entry, index) => {
      issues.push(
        ...collectFocusStateIssues(entry, `${path}.focusStates[${index}]`),
      );
    });
  }
  if (!Array.isArray(value.signals)) {
    issues.push(
      issue("invalid-context-entry", `${path}.signals`, "signals must be an array"),
    );
  } else {
    value.signals.forEach((entry, index) => {
      issues.push(...collectSignalIssues(entry, `${path}.signals[${index}]`));
    });
  }
  if (!Array.isArray(value.relationships)) {
    issues.push(
      issue(
        "invalid-context-entry",
        `${path}.relationships`,
        "relationships must be an array",
      ),
    );
  } else {
    value.relationships.forEach((entry, index) => {
      issues.push(
        ...collectRelationshipIssues(entry, `${path}.relationships[${index}]`),
      );
    });
  }
  return issues;
}

export function validateDirectorRuntimeAttentionContext(
  value: unknown,
): DirectorRuntimeAttentionFocusValidationResult {
  return freezeValidationResult(collectContextIssues(value));
}

export function isDirectorRuntimeAttentionContext(
  value: unknown,
): value is DirectorRuntimeAttentionContext {
  return validateDirectorRuntimeAttentionContext(value).valid;
}

// ─── Immutable construction helpers (no resolution) ─────────────────────────

export function createDirectorRuntimeAttentionSubjectReference(
  input: DirectorRuntimeAttentionSubjectReference,
): DirectorRuntimeAttentionSubjectReference {
  return Object.freeze({
    subjectId: input.subjectId,
    subjectKind: input.subjectKind,
  });
}

export function createDirectorRuntimeAttentionSignal(
  input: DirectorRuntimeAttentionSignal,
): DirectorRuntimeAttentionSignal {
  return Object.freeze({
    signalId: input.signalId,
    subject: createDirectorRuntimeAttentionSubjectReference(input.subject),
    source: input.source,
    reason: input.reason,
    scope: input.scope,
    requestedLevel: input.requestedLevel,
    persistence: input.persistence,
  });
}

export function createDirectorRuntimeFocusState(
  input: DirectorRuntimeFocusState,
): DirectorRuntimeFocusState {
  return Object.freeze({
    subject: createDirectorRuntimeAttentionSubjectReference(input.subject),
    attentionLevel: input.attentionLevel,
    focusRole: input.focusRole,
  });
}

export function createDirectorRuntimeAttentionRelationship(
  input: DirectorRuntimeAttentionRelationship,
): DirectorRuntimeAttentionRelationship {
  return Object.freeze({
    source: createDirectorRuntimeAttentionSubjectReference(input.source),
    target: createDirectorRuntimeAttentionSubjectReference(input.target),
    kind: input.kind,
  });
}

export function createDirectorRuntimeAttentionContext(
  input: DirectorRuntimeAttentionContext,
): DirectorRuntimeAttentionContext {
  return Object.freeze({
    focusStates: Object.freeze(
      input.focusStates.map((entry) => createDirectorRuntimeFocusState(entry)),
    ),
    signals: Object.freeze(
      input.signals.map((entry) => createDirectorRuntimeAttentionSignal(entry)),
    ),
    relationships: Object.freeze(
      input.relationships.map((entry) =>
        createDirectorRuntimeAttentionRelationship(entry)),
    ),
  });
}

// ─── Invariants ─────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ATTENTION_FOCUS_FOUNDATION_INVARIANTS =
  Object.freeze([
    Object.freeze({
      id: "vocabulary-uniqueness",
      statement: "every canonical registry contains unique values",
    }),
    Object.freeze({
      id: "attention-ordering",
      statement:
        "attention levels preserve primary → secondary → context → background → suppressed",
    }),
    Object.freeze({
      id: "attention-focus-separation",
      statement: "attention level and focus role remain separate concepts",
    }),
    Object.freeze({
      id: "valid-subject-identity",
      statement:
        "subject reference requires non-empty subject identity and valid subject kind",
    }),
    Object.freeze({
      id: "signal-integrity",
      statement:
        "valid signal references valid subject and canonical source/reason/scope/level/persistence",
    }),
    Object.freeze({
      id: "relationship-integrity",
      statement: "both source and target references must be valid",
    }),
    Object.freeze({
      id: "context-integrity",
      statement:
        "every focus state, signal, and relationship inside an attention context must validate",
    }),
    Object.freeze({
      id: "no-presentation-leakage",
      statement: "foundation contracts contain no presentation-specific fields",
    }),
    Object.freeze({
      id: "no-priority-behavior",
      statement: "foundation contains no priority-resolution algorithm",
    }),
    Object.freeze({
      id: "no-runtime-mutation",
      statement: "validation and registry access must not mutate caller-provided values",
    }),
    Object.freeze({
      id: "no-path-computation",
      statement: "DRI-6:1 performs no attention path computation",
    }),
    Object.freeze({
      id: "no-transition-behavior",
      statement: "DRI-6:1 performs no attention/focus transition behavior",
    }),
    Object.freeze({
      id: "sole-upstream-dri-5-9",
      statement: "DRI-6:1 depends only on DRI-5:9 Public Index",
    }),
  ] as const);

export type DirectorRuntimeAttentionFocusFoundationInvariant =
  (typeof DIRECTOR_RUNTIME_ATTENTION_FOCUS_FOUNDATION_INVARIANTS)[number];

// ─── Registry ───────────────────────────────────────────────────────────────

export const directorRuntimeAttentionFocusFoundationApiNames = Object.freeze([
  "isDirectorRuntimeAttentionFocusLevel",
  "isDirectorRuntimeFocusRole",
  "isDirectorRuntimeAttentionSubjectKind",
  "isDirectorRuntimeAttentionSignalSource",
  "isDirectorRuntimeAttentionReasonKind",
  "isDirectorRuntimeAttentionScope",
  "isDirectorRuntimeAttentionPersistence",
  "isDirectorRuntimeAttentionRelationshipKind",
  "isDirectorRuntimeAttentionSubjectReference",
  "isDirectorRuntimeAttentionSignal",
  "isDirectorRuntimeFocusState",
  "isDirectorRuntimeAttentionRelationship",
  "isDirectorRuntimeAttentionContext",
  "validateDirectorRuntimeAttentionSubjectReference",
  "validateDirectorRuntimeAttentionSignal",
  "validateDirectorRuntimeFocusState",
  "validateDirectorRuntimeAttentionRelationship",
  "validateDirectorRuntimeAttentionContext",
  "createDirectorRuntimeAttentionSubjectReference",
  "createDirectorRuntimeAttentionSignal",
  "createDirectorRuntimeFocusState",
  "createDirectorRuntimeAttentionRelationship",
  "createDirectorRuntimeAttentionContext",
  "verifyDirectorRuntimeAttentionFocusFoundation",
] as const);

export const directorRuntimeAttentionFocusFoundationRegistry = Object.freeze({
  identity: directorRuntimeAttentionFocusFoundationIdentity,
  version: directorRuntimeAttentionFocusFoundationVersion,
  namespace: directorRuntimeAttentionFocusFoundationNamespace,
  dependency: directorRuntimeAttentionFocusFoundationUpstream,
  attentionLevels: DIRECTOR_RUNTIME_ATTENTION_FOCUS_LEVELS,
  attentionLevelCount: DIRECTOR_RUNTIME_ATTENTION_FOCUS_LEVELS.length,
  focusRoles: DIRECTOR_RUNTIME_FOCUS_ROLES,
  focusRoleCount: DIRECTOR_RUNTIME_FOCUS_ROLES.length,
  subjectKinds: DIRECTOR_RUNTIME_ATTENTION_SUBJECT_KINDS,
  subjectKindCount: DIRECTOR_RUNTIME_ATTENTION_SUBJECT_KINDS.length,
  signalSources: DIRECTOR_RUNTIME_ATTENTION_SIGNAL_SOURCES,
  signalSourceCount: DIRECTOR_RUNTIME_ATTENTION_SIGNAL_SOURCES.length,
  reasonKinds: DIRECTOR_RUNTIME_ATTENTION_REASON_KINDS,
  reasonKindCount: DIRECTOR_RUNTIME_ATTENTION_REASON_KINDS.length,
  scopes: DIRECTOR_RUNTIME_ATTENTION_SCOPES,
  scopeCount: DIRECTOR_RUNTIME_ATTENTION_SCOPES.length,
  persistenceValues: DIRECTOR_RUNTIME_ATTENTION_PERSISTENCE_VALUES,
  persistenceCount: DIRECTOR_RUNTIME_ATTENTION_PERSISTENCE_VALUES.length,
  relationshipKinds: DIRECTOR_RUNTIME_ATTENTION_RELATIONSHIP_KINDS,
  relationshipKindCount: DIRECTOR_RUNTIME_ATTENTION_RELATIONSHIP_KINDS.length,
  emptyAttentionContext: DIRECTOR_RUNTIME_EMPTY_ATTENTION_CONTEXT,
  invariants: DIRECTOR_RUNTIME_ATTENTION_FOCUS_FOUNDATION_INVARIANTS,
  invariantCount: DIRECTOR_RUNTIME_ATTENTION_FOCUS_FOUNDATION_INVARIANTS.length,
  publicApis: directorRuntimeAttentionFocusFoundationApiNames,
  publicApiCount: directorRuntimeAttentionFocusFoundationApiNames.length,
});

export const directorRuntimeAttentionFocusFoundation = Object.freeze({
  phase: "DRI-6:1" as const,
  name: "DirectorRuntimeAttentionFocusFoundation" as const,
  identity: directorRuntimeAttentionFocusFoundationIdentity,
  namespace: directorRuntimeAttentionFocusFoundationNamespace,
  version: directorRuntimeAttentionFocusFoundationVersion,
  layer: "Director Runtime Integration" as const,
  domain: "AttentionFocusOrchestration" as const,
  role: "Foundation" as const,
  stage: "Foundation" as const,
  status: "FoundationReady" as const,
  upstreamDependency: directorRuntimeAttentionFocusFoundationUpstream,
  deterministic: true as const,
  foundation: true as const,
  rendererIndependent: true as const,
  philosophy: "attention-not-presentation" as const,
  attentionLevels: DIRECTOR_RUNTIME_ATTENTION_FOCUS_LEVELS,
  focusRoles: DIRECTOR_RUNTIME_FOCUS_ROLES,
  subjectKinds: DIRECTOR_RUNTIME_ATTENTION_SUBJECT_KINDS,
  signalSources: DIRECTOR_RUNTIME_ATTENTION_SIGNAL_SOURCES,
  reasonKinds: DIRECTOR_RUNTIME_ATTENTION_REASON_KINDS,
  scopes: DIRECTOR_RUNTIME_ATTENTION_SCOPES,
  persistenceValues: DIRECTOR_RUNTIME_ATTENTION_PERSISTENCE_VALUES,
  relationshipKinds: DIRECTOR_RUNTIME_ATTENTION_RELATIONSHIP_KINDS,
  emptyAttentionContext: DIRECTOR_RUNTIME_EMPTY_ATTENTION_CONTEXT,
  invariants: DIRECTOR_RUNTIME_ATTENTION_FOCUS_FOUNDATION_INVARIANTS,
  publicApiSurface: directorRuntimeAttentionFocusFoundationApiNames,
  registry: directorRuntimeAttentionFocusFoundationRegistry,
  adaptivePresentationBoundary: "DRI-5:9-public-index-only" as const,
  architecturalStatus:
    "Established · Deterministic · Immutable · RendererIndependent · FoundationReady" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface DirectorRuntimeAttentionFocusFoundationVerification {
  readonly ok: boolean;
  readonly identity: typeof directorRuntimeAttentionFocusFoundationIdentity;
  readonly version: typeof directorRuntimeAttentionFocusFoundationVersion;
  readonly namespace: typeof directorRuntimeAttentionFocusFoundationNamespace;
  readonly dependency: typeof directorRuntimeAttentionFocusFoundationUpstream;
  readonly attentionLevelCount: number;
  readonly focusRoleCount: number;
  readonly subjectKindCount: number;
  readonly signalSourceCount: number;
  readonly reasonKindCount: number;
  readonly scopeCount: number;
  readonly persistenceCount: number;
  readonly relationshipKindCount: number;
  readonly invariantCount: number;
  readonly frozen: boolean;
}

function exactOrder<T extends string>(
  actual: readonly T[],
  expected: readonly T[],
): boolean {
  return (
    actual.length === expected.length &&
    actual.every((value, index) => value === expected[index])
  );
}

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

export function verifyDirectorRuntimeAttentionFocusFoundation():
  DirectorRuntimeAttentionFocusFoundationVerification {
  const foundation = directorRuntimeAttentionFocusFoundation;
  const registry = directorRuntimeAttentionFocusFoundationRegistry;

  const ok =
    foundation.identity ===
      "DRI-6:1/DirectorRuntimeAttentionFocusFoundation" &&
    foundation.version === "6.1.0" &&
    foundation.namespace === "nexora.dri.attention-focus.foundation" &&
    foundation.layer === "Director Runtime Integration" &&
    foundation.domain === "AttentionFocusOrchestration" &&
    foundation.role === "Foundation" &&
    foundation.status === "FoundationReady" &&
    foundation.upstreamDependency ===
      "DRI-5:9/DirectorRuntimeAdaptivePresentationPublicIndex" &&
    foundation.upstreamDependency ===
      directorRuntimeAdaptivePresentationPublicIndexIdentity &&
    registry.dependency === foundation.upstreamDependency &&
    exactOrder(DIRECTOR_RUNTIME_ATTENTION_FOCUS_LEVELS, [
      "primary",
      "secondary",
      "context",
      "background",
      "suppressed",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_FOCUS_ROLES, [
      "focused",
      "supporting",
      "contextual",
      "peripheral",
      "none",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_ATTENTION_SUBJECT_KINDS, [
      "goal",
      "object",
      "pack",
      "problem",
      "scenario",
      "decision",
      "execution",
      "kpi",
      "koi",
      "scene",
      "path",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_ATTENTION_SIGNAL_SOURCES, [
      "user-interaction",
      "runtime-state",
      "goal",
      "kpi",
      "koi",
      "problem",
      "scenario",
      "decision",
      "execution",
      "advisor",
      "system",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_ATTENTION_REASON_KINDS, [
      "explicit-selection",
      "risk",
      "warning",
      "critical-state",
      "dependency",
      "goal-relevance",
      "context-relevance",
      "scenario-relevance",
      "decision-relevance",
      "execution-relevance",
      "advisor-relevance",
      "system-relevance",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_ATTENTION_SCOPES, [
      "subject",
      "local-context",
      "scene",
      "workspace",
      "global",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_ATTENTION_PERSISTENCE_VALUES, [
      "transient",
      "session",
      "persistent",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_ATTENTION_RELATIONSHIP_KINDS, [
      "direct",
      "dependency",
      "upstream",
      "downstream",
      "supporting",
      "contextual",
    ]) &&
    unique([...DIRECTOR_RUNTIME_ATTENTION_FOCUS_LEVELS]) &&
    unique([...DIRECTOR_RUNTIME_FOCUS_ROLES]) &&
    unique([...DIRECTOR_RUNTIME_ATTENTION_SUBJECT_KINDS]) &&
    unique([...DIRECTOR_RUNTIME_ATTENTION_SIGNAL_SOURCES]) &&
    unique([...DIRECTOR_RUNTIME_ATTENTION_REASON_KINDS]) &&
    unique([...DIRECTOR_RUNTIME_ATTENTION_SCOPES]) &&
    unique([...DIRECTOR_RUNTIME_ATTENTION_PERSISTENCE_VALUES]) &&
    unique([...DIRECTOR_RUNTIME_ATTENTION_RELATIONSHIP_KINDS]) &&
    validateDirectorRuntimeAttentionContext(
      DIRECTOR_RUNTIME_EMPTY_ATTENTION_CONTEXT,
    ).valid &&
    Object.isFrozen(foundation) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(DIRECTOR_RUNTIME_ATTENTION_FOCUS_LEVELS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_FOCUS_ROLES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EMPTY_ATTENTION_CONTEXT) &&
    Object.isFrozen(DIRECTOR_RUNTIME_ATTENTION_FOCUS_FOUNDATION_INVARIANTS);

  return Object.freeze({
    ok,
    identity: directorRuntimeAttentionFocusFoundationIdentity,
    version: directorRuntimeAttentionFocusFoundationVersion,
    namespace: directorRuntimeAttentionFocusFoundationNamespace,
    dependency: directorRuntimeAttentionFocusFoundationUpstream,
    attentionLevelCount: DIRECTOR_RUNTIME_ATTENTION_FOCUS_LEVELS.length,
    focusRoleCount: DIRECTOR_RUNTIME_FOCUS_ROLES.length,
    subjectKindCount: DIRECTOR_RUNTIME_ATTENTION_SUBJECT_KINDS.length,
    signalSourceCount: DIRECTOR_RUNTIME_ATTENTION_SIGNAL_SOURCES.length,
    reasonKindCount: DIRECTOR_RUNTIME_ATTENTION_REASON_KINDS.length,
    scopeCount: DIRECTOR_RUNTIME_ATTENTION_SCOPES.length,
    persistenceCount: DIRECTOR_RUNTIME_ATTENTION_PERSISTENCE_VALUES.length,
    relationshipKindCount: DIRECTOR_RUNTIME_ATTENTION_RELATIONSHIP_KINDS.length,
    invariantCount: DIRECTOR_RUNTIME_ATTENTION_FOCUS_FOUNDATION_INVARIANTS.length,
    frozen: Object.isFrozen(foundation) && Object.isFrozen(registry),
  });
}
