/**
 * DRI-6:5 — Director Runtime Attention Path Orchestration.
 *
 * Consumes bound Focus Context from DRI-6:4 plus explicit semantic relationships
 * to produce immutable attention paths. No transitions, presentation, or
 * re-resolution / rebinding.
 */

import {
  areDirectorRuntimeAttentionSubjectsEqual,
  directorRuntimeFocusContextBindingIdentity,
  validateDirectorRuntimeFocusContext,
  type DirectorRuntimeAttentionSubjectReference,
  type DirectorRuntimeFocusContext,
  type DirectorRuntimeFocusRole,
} from "@/app/lib/dri/directorRuntimeFocusContextBinding";

export type {
  DirectorRuntimeAttentionFocusLevel,
  DirectorRuntimeAttentionResolutionOutcome,
  DirectorRuntimeAttentionSignal,
  DirectorRuntimeAttentionSignalBatch,
  DirectorRuntimeAttentionSubjectReference,
  DirectorRuntimeFocusContext,
  DirectorRuntimeFocusContextEntry,
  DirectorRuntimeFocusRole,
  DirectorRuntimeResolvedAttentionAssignment,
} from "@/app/lib/dri/directorRuntimeFocusContextBinding";

export {
  DIRECTOR_RUNTIME_EMPTY_ATTENTION_RESOLUTION_OUTCOME,
  DIRECTOR_RUNTIME_EMPTY_ATTENTION_SIGNAL_BATCH,
  DIRECTOR_RUNTIME_EMPTY_FOCUS_CONTEXT,
  areDirectorRuntimeAttentionSubjectsEqual,
  bindDirectorRuntimeFocusContext,
  createDirectorRuntimeAttentionSignal,
  createDirectorRuntimeAttentionSignalBatch,
  resolveDirectorRuntimeAttentionPriority,
  validateDirectorRuntimeAttentionResolutionOutcome,
  validateDirectorRuntimeAttentionSignalBatch,
  validateDirectorRuntimeFocusContext,
} from "@/app/lib/dri/directorRuntimeFocusContextBinding";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeAttentionPathOrchestrationIdentity =
  "DRI-6:5/DirectorRuntimeAttentionPathOrchestration" as const;
export const directorRuntimeAttentionPathOrchestrationVersion = "6.5.0" as const;
export const directorRuntimeAttentionPathOrchestrationNamespace =
  "nexora.dri.attention-focus.path-orchestration" as const;
export const directorRuntimeAttentionPathOrchestrationUpstream =
  directorRuntimeFocusContextBindingIdentity;

export const directorRuntimeAttentionPathOrchestrationCanonicalIdentity =
  Object.freeze({
    identity: directorRuntimeAttentionPathOrchestrationIdentity,
    version: directorRuntimeAttentionPathOrchestrationVersion,
    namespace: directorRuntimeAttentionPathOrchestrationNamespace,
    upstream: directorRuntimeAttentionPathOrchestrationUpstream,
  });

// ─── Relationship / path vocabularies (exact upstream foundation literals) ──

/**
 * Canonical relationship kinds. Literals match DRI-6:1 foundation vocabulary;
 * DRI-6:5 must not import foundation/signal/priority slices directly.
 */
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

/** Path kinds share the same machine-safe literals as relationship kinds. */
export const DIRECTOR_RUNTIME_ATTENTION_PATH_KINDS =
  DIRECTOR_RUNTIME_ATTENTION_RELATIONSHIP_KINDS;
export type DirectorRuntimeAttentionPathKind =
  DirectorRuntimeAttentionRelationshipKind;

export const DIRECTOR_RUNTIME_ATTENTION_PATH_DIRECTIONS = Object.freeze([
  "outbound",
  "inbound",
  "bidirectional",
] as const);
export type DirectorRuntimeAttentionPathDirection =
  (typeof DIRECTOR_RUNTIME_ATTENTION_PATH_DIRECTIONS)[number];

/** First match wins. */
export const DIRECTOR_RUNTIME_ATTENTION_PATH_CLASSIFICATION_PRECEDENCE =
  Object.freeze([
    "dependency",
    "supporting",
    "contextual",
    "upstream",
    "downstream",
    "direct",
  ] as const satisfies readonly DirectorRuntimeAttentionPathKind[]);

export const DIRECTOR_RUNTIME_ATTENTION_PATH_RELEVANCE_VALUES = Object.freeze([
  "primary",
  "supporting",
  "contextual",
  "peripheral",
] as const);
export type DirectorRuntimeAttentionPathRelevance =
  (typeof DIRECTOR_RUNTIME_ATTENTION_PATH_RELEVANCE_VALUES)[number];

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface DirectorRuntimeAttentionRelationship {
  readonly source: DirectorRuntimeAttentionSubjectReference;
  readonly target: DirectorRuntimeAttentionSubjectReference;
  readonly kind: DirectorRuntimeAttentionRelationshipKind;
}

export interface DirectorRuntimeAttentionPathSegment {
  readonly source: DirectorRuntimeAttentionSubjectReference;
  readonly target: DirectorRuntimeAttentionSubjectReference;
  readonly relationshipKind: DirectorRuntimeAttentionRelationshipKind;
}

export interface DirectorRuntimeAttentionPath {
  readonly pathId: string;
  readonly kind: DirectorRuntimeAttentionPathKind;
  readonly direction: DirectorRuntimeAttentionPathDirection;
  readonly relevance: DirectorRuntimeAttentionPathRelevance;
  readonly subjects: readonly DirectorRuntimeAttentionSubjectReference[];
  readonly relationshipRefs: readonly string[];
  readonly segments: readonly DirectorRuntimeAttentionPathSegment[];
}

export interface DirectorRuntimeAttentionPathOrchestrationInput {
  readonly focusContext: DirectorRuntimeFocusContext;
  readonly relationships: readonly DirectorRuntimeAttentionRelationship[];
}

export interface DirectorRuntimeAttentionPathOrchestrationCounts {
  readonly pathCount: number;
  readonly segmentCount: number;
  readonly upstreamPathCount: number;
  readonly downstreamPathCount: number;
  readonly supportingPathCount: number;
  readonly contextualPathCount: number;
  readonly dependencyPathCount: number;
  readonly directPathCount: number;
}

export const DIRECTOR_RUNTIME_ATTENTION_PATH_ORCHESTRATION_ISSUE_CODES =
  Object.freeze([
    "invalid-orchestration-input",
    "invalid-focus-context",
    "invalid-relationship",
    "invalid-path-kind",
    "invalid-path-direction",
    "invalid-path-segment",
    "invalid-attention-path",
    "invalid-orchestration-result",
    "invalid-path-policy",
    "repeated-subject-in-path",
    "segment-subject-mismatch",
  ] as const);
export type DirectorRuntimeAttentionPathOrchestrationIssueCode =
  (typeof DIRECTOR_RUNTIME_ATTENTION_PATH_ORCHESTRATION_ISSUE_CODES)[number];

export interface DirectorRuntimeAttentionPathOrchestrationIssue {
  readonly code: DirectorRuntimeAttentionPathOrchestrationIssueCode;
  readonly path: string;
  readonly message: string;
}

export interface DirectorRuntimeAttentionPathOrchestrationResult {
  readonly ok: boolean;
  readonly rootSubject: DirectorRuntimeAttentionSubjectReference | null;
  readonly paths: readonly DirectorRuntimeAttentionPath[];
  readonly segments: readonly DirectorRuntimeAttentionPathSegment[];
  readonly counts: DirectorRuntimeAttentionPathOrchestrationCounts;
  readonly issues: readonly DirectorRuntimeAttentionPathOrchestrationIssue[];
}

export const DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_COUNTS = Object.freeze({
  pathCount: 0,
  segmentCount: 0,
  upstreamPathCount: 0,
  downstreamPathCount: 0,
  supportingPathCount: 0,
  contextualPathCount: 0,
  dependencyPathCount: 0,
  directPathCount: 0,
}) satisfies DirectorRuntimeAttentionPathOrchestrationCounts;

export const DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_RESULT = Object.freeze({
  ok: true,
  rootSubject: null,
  paths: Object.freeze([]) as readonly DirectorRuntimeAttentionPath[],
  segments: Object.freeze([]) as readonly DirectorRuntimeAttentionPathSegment[],
  counts: DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_COUNTS,
  issues: Object.freeze([]) as readonly DirectorRuntimeAttentionPathOrchestrationIssue[],
}) satisfies DirectorRuntimeAttentionPathOrchestrationResult;

// ─── Helpers ────────────────────────────────────────────────────────────────

function issue(
  code: DirectorRuntimeAttentionPathOrchestrationIssueCode,
  path: string,
  message: string,
): DirectorRuntimeAttentionPathOrchestrationIssue {
  return Object.freeze({ code, path, message });
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function freezeSubject(
  subject: DirectorRuntimeAttentionSubjectReference,
): DirectorRuntimeAttentionSubjectReference {
  return Object.freeze({
    subjectId: subject.subjectId,
    subjectKind: subject.subjectKind,
  });
}

function subjectKey(subject: DirectorRuntimeAttentionSubjectReference): string {
  return `${subject.subjectKind}\u0000${subject.subjectId}`;
}

function parseSubjectKey(key: string): DirectorRuntimeAttentionSubjectReference {
  const separator = key.indexOf("\u0000");
  return freezeSubject({
    subjectKind: key.slice(0, separator) as DirectorRuntimeAttentionSubjectReference["subjectKind"],
    subjectId: key.slice(separator + 1),
  });
}

export function relationshipRefForDirectorRuntimeAttentionRelationship(
  relationship: DirectorRuntimeAttentionRelationship,
): string {
  return [
    "rel",
    subjectKey(relationship.source),
    subjectKey(relationship.target),
    relationship.kind,
  ].join("\u0001");
}

function isRelationshipKind(
  value: unknown,
): value is DirectorRuntimeAttentionRelationshipKind {
  return (DIRECTOR_RUNTIME_ATTENTION_RELATIONSHIP_KINDS as readonly unknown[])
    .includes(value);
}

function isPathKind(value: unknown): value is DirectorRuntimeAttentionPathKind {
  return (DIRECTOR_RUNTIME_ATTENTION_PATH_KINDS as readonly unknown[]).includes(value);
}

function isPathDirection(
  value: unknown,
): value is DirectorRuntimeAttentionPathDirection {
  return (DIRECTOR_RUNTIME_ATTENTION_PATH_DIRECTIONS as readonly unknown[])
    .includes(value);
}

function isPathRelevance(
  value: unknown,
): value is DirectorRuntimeAttentionPathRelevance {
  return (DIRECTOR_RUNTIME_ATTENTION_PATH_RELEVANCE_VALUES as readonly unknown[])
    .includes(value);
}

function failureResult(
  issues: readonly DirectorRuntimeAttentionPathOrchestrationIssue[],
): DirectorRuntimeAttentionPathOrchestrationResult {
  return Object.freeze({
    ok: false,
    rootSubject: null,
    paths: Object.freeze([]),
    segments: Object.freeze([]),
    counts: DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_COUNTS,
    issues: Object.freeze([...issues]),
  });
}

function freezeSegment(
  segment: DirectorRuntimeAttentionPathSegment,
): DirectorRuntimeAttentionPathSegment {
  return Object.freeze({
    source: freezeSubject(segment.source),
    target: freezeSubject(segment.target),
    relationshipKind: segment.relationshipKind,
  });
}

function freezePath(path: DirectorRuntimeAttentionPath): DirectorRuntimeAttentionPath {
  return Object.freeze({
    pathId: path.pathId,
    kind: path.kind,
    direction: path.direction,
    relevance: path.relevance,
    subjects: Object.freeze(path.subjects.map((entry) => freezeSubject(entry))),
    relationshipRefs: Object.freeze([...path.relationshipRefs]),
    segments: Object.freeze(path.segments.map((entry) => freezeSegment(entry))),
  });
}

function countPathsByKind(
  paths: readonly DirectorRuntimeAttentionPath[],
): DirectorRuntimeAttentionPathOrchestrationCounts {
  const count = (kind: DirectorRuntimeAttentionPathKind) =>
    paths.filter((entry) => entry.kind === kind).length;
  return Object.freeze({
    pathCount: paths.length,
    segmentCount: 0,
    upstreamPathCount: count("upstream"),
    downstreamPathCount: count("downstream"),
    supportingPathCount: count("supporting"),
    contextualPathCount: count("contextual"),
    dependencyPathCount: count("dependency"),
    directPathCount: count("direct"),
  });
}

function buildCounts(
  paths: readonly DirectorRuntimeAttentionPath[],
  segments: readonly DirectorRuntimeAttentionPathSegment[],
): DirectorRuntimeAttentionPathOrchestrationCounts {
  return Object.freeze({
    ...countPathsByKind(paths),
    pathCount: paths.length,
    segmentCount: segments.length,
  });
}

// ─── Relationship helpers ───────────────────────────────────────────────────

export function createDirectorRuntimeAttentionRelationship(
  input: DirectorRuntimeAttentionRelationship,
): DirectorRuntimeAttentionRelationship {
  return Object.freeze({
    source: freezeSubject(input.source),
    target: freezeSubject(input.target),
    kind: input.kind,
  });
}

export function validateDirectorRuntimeAttentionRelationship(
  value: unknown,
): DirectorRuntimeAttentionPathOrchestrationResult {
  if (!isPlainObject(value)) {
    return failureResult([
      issue("invalid-relationship", "relationship", "relationship must be a plain object"),
    ]);
  }
  const issues: DirectorRuntimeAttentionPathOrchestrationIssue[] = [];
  if (
    !isPlainObject(value.source) ||
    !isNonEmptyString(value.source.subjectId) ||
    !isNonEmptyString(value.source.subjectKind)
  ) {
    issues.push(issue("invalid-relationship", "relationship.source", "source invalid"));
  }
  if (
    !isPlainObject(value.target) ||
    !isNonEmptyString(value.target.subjectId) ||
    !isNonEmptyString(value.target.subjectKind)
  ) {
    issues.push(issue("invalid-relationship", "relationship.target", "target invalid"));
  }
  if (!isRelationshipKind(value.kind)) {
    issues.push(issue("invalid-relationship", "relationship.kind", "kind invalid"));
  }
  if (
    issues.length === 0 &&
    isPlainObject(value.source) &&
    isPlainObject(value.target) &&
    value.source.subjectId === value.target.subjectId &&
    value.source.subjectKind === value.target.subjectKind
  ) {
    issues.push(
      issue(
        "invalid-relationship",
        "relationship",
        "relationship source and target must differ",
      ),
    );
  }
  return issues.length === 0
    ? Object.freeze({
      ok: true,
      rootSubject: null,
      paths: Object.freeze([]),
      segments: Object.freeze([]),
      counts: DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_COUNTS,
      issues: Object.freeze([]),
    })
    : failureResult(issues);
}

// ─── Validation ─────────────────────────────────────────────────────────────

export function validateDirectorRuntimeAttentionPathKind(
  value: unknown,
): DirectorRuntimeAttentionPathOrchestrationResult {
  if (!isPathKind(value)) {
    return failureResult([
      issue("invalid-path-kind", "kind", "path kind must be canonical"),
    ]);
  }
  return Object.freeze({
    ok: true,
    rootSubject: null,
    paths: Object.freeze([]),
    segments: Object.freeze([]),
    counts: DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_COUNTS,
    issues: Object.freeze([]),
  });
}

export function validateDirectorRuntimeAttentionPathDirection(
  value: unknown,
): DirectorRuntimeAttentionPathOrchestrationResult {
  if (!isPathDirection(value)) {
    return failureResult([
      issue("invalid-path-direction", "direction", "path direction must be canonical"),
    ]);
  }
  return Object.freeze({
    ok: true,
    rootSubject: null,
    paths: Object.freeze([]),
    segments: Object.freeze([]),
    counts: DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_COUNTS,
    issues: Object.freeze([]),
  });
}

export function validateDirectorRuntimeAttentionPathSegment(
  value: unknown,
): DirectorRuntimeAttentionPathOrchestrationResult {
  if (!isPlainObject(value)) {
    return failureResult([
      issue("invalid-path-segment", "segment", "segment must be a plain object"),
    ]);
  }
  const issues: DirectorRuntimeAttentionPathOrchestrationIssue[] = [];
  if (
    !isPlainObject(value.source) ||
    !isNonEmptyString(value.source.subjectId) ||
    !isNonEmptyString(value.source.subjectKind)
  ) {
    issues.push(issue("invalid-path-segment", "segment.source", "source invalid"));
  }
  if (
    !isPlainObject(value.target) ||
    !isNonEmptyString(value.target.subjectId) ||
    !isNonEmptyString(value.target.subjectKind)
  ) {
    issues.push(issue("invalid-path-segment", "segment.target", "target invalid"));
  }
  if (!isRelationshipKind(value.relationshipKind)) {
    issues.push(
      issue("invalid-path-segment", "segment.relationshipKind", "relationshipKind invalid"),
    );
  }
  return issues.length === 0
    ? Object.freeze({
      ok: true,
      rootSubject: null,
      paths: Object.freeze([]),
      segments: Object.freeze([]),
      counts: DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_COUNTS,
      issues: Object.freeze([]),
    })
    : failureResult(issues);
}

export function validateDirectorRuntimeAttentionPath(
  value: unknown,
): DirectorRuntimeAttentionPathOrchestrationResult {
  if (!isPlainObject(value)) {
    return failureResult([
      issue("invalid-attention-path", "path", "path must be a plain object"),
    ]);
  }
  const issues: DirectorRuntimeAttentionPathOrchestrationIssue[] = [];
  if (!isNonEmptyString(value.pathId)) {
    issues.push(issue("invalid-attention-path", "path.pathId", "pathId invalid"));
  }
  if (!isPathKind(value.kind)) {
    issues.push(issue("invalid-path-kind", "path.kind", "kind invalid"));
  }
  if (!isPathDirection(value.direction)) {
    issues.push(issue("invalid-path-direction", "path.direction", "direction invalid"));
  }
  if (!isPathRelevance(value.relevance)) {
    issues.push(issue("invalid-attention-path", "path.relevance", "relevance invalid"));
  }
  if (!Array.isArray(value.subjects) || value.subjects.length < 2) {
    issues.push(
      issue("invalid-attention-path", "path.subjects", "path requires at least two subjects"),
    );
  } else {
    const seen = new Set<string>();
    value.subjects.forEach((subject, index) => {
      if (
        !isPlainObject(subject) ||
        !isNonEmptyString(subject.subjectId) ||
        !isNonEmptyString(subject.subjectKind)
      ) {
        issues.push(
          issue("invalid-attention-path", `path.subjects[${index}]`, "subject invalid"),
        );
        return;
      }
      const key = `${subject.subjectKind}\u0000${subject.subjectId}`;
      if (seen.has(key)) {
        issues.push(
          issue(
            "repeated-subject-in-path",
            `path.subjects[${index}]`,
            "simple paths must not repeat subjects",
          ),
        );
      }
      seen.add(key);
    });
  }
  if (!Array.isArray(value.relationshipRefs) || value.relationshipRefs.length < 1) {
    issues.push(
      issue(
        "invalid-attention-path",
        "path.relationshipRefs",
        "path requires at least one relationship ref",
      ),
    );
  }
  if (!Array.isArray(value.segments) || value.segments.length < 1) {
    issues.push(
      issue("invalid-path-segment", "path.segments", "path requires at least one segment"),
    );
  } else if (Array.isArray(value.subjects) && value.subjects.length >= 2) {
    const subjects = value.subjects;
    if (value.segments.length !== subjects.length - 1) {
      issues.push(
        issue(
          "segment-subject-mismatch",
          "path.segments",
          "segment count must equal subjects.length - 1",
        ),
      );
    }
    value.segments.forEach((segment, index) => {
      const segmentValidation = validateDirectorRuntimeAttentionPathSegment(segment);
      for (const segmentIssue of segmentValidation.issues) {
        issues.push(
          issue(segmentIssue.code, `path.segments[${index}]`, segmentIssue.message),
        );
      }
      const leftSubject = subjects[index];
      const rightSubject = subjects[index + 1];
      if (
        segmentValidation.ok &&
        isPlainObject(segment) &&
        isPlainObject(leftSubject) &&
        isPlainObject(rightSubject)
      ) {
        const expectedSource =
          leftSubject as unknown as DirectorRuntimeAttentionSubjectReference;
        const expectedTarget =
          rightSubject as unknown as DirectorRuntimeAttentionSubjectReference;
        // For inbound paths, segment orientation follows relationship source→target,
        // while subjects are ordered root-first along traversal. Validate adjacency only
        // against either orientation matching the adjacent pair.
        const forward =
          areDirectorRuntimeAttentionSubjectsEqual(
            segment.source as DirectorRuntimeAttentionSubjectReference,
            expectedSource,
          ) &&
          areDirectorRuntimeAttentionSubjectsEqual(
            segment.target as DirectorRuntimeAttentionSubjectReference,
            expectedTarget,
          );
        const reverse =
          areDirectorRuntimeAttentionSubjectsEqual(
            segment.source as DirectorRuntimeAttentionSubjectReference,
            expectedTarget,
          ) &&
          areDirectorRuntimeAttentionSubjectsEqual(
            segment.target as DirectorRuntimeAttentionSubjectReference,
            expectedSource,
          );
        if (!forward && !reverse) {
          issues.push(
            issue(
              "segment-subject-mismatch",
              `path.segments[${index}]`,
              "segment endpoints must match adjacent path subjects",
            ),
          );
        }
      }
    });
  }
  return issues.length === 0
    ? Object.freeze({
      ok: true,
      rootSubject: null,
      paths: Object.freeze([]),
      segments: Object.freeze([]),
      counts: DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_COUNTS,
      issues: Object.freeze([]),
    })
    : failureResult(issues);
}

export function validateDirectorRuntimeAttentionPathOrchestrationInput(
  value: unknown,
): DirectorRuntimeAttentionPathOrchestrationResult {
  if (!isPlainObject(value)) {
    return failureResult([
      issue("invalid-orchestration-input", "input", "input must be a plain object"),
    ]);
  }
  const contextValidation = validateDirectorRuntimeFocusContext(value.focusContext);
  if (!contextValidation.ok) {
    return failureResult([
      issue("invalid-focus-context", "input.focusContext", "focus context invalid"),
      ...contextValidation.issues.map((entry) =>
        issue("invalid-focus-context", entry.path, entry.message)),
    ]);
  }
  if (!Array.isArray(value.relationships)) {
    return failureResult([
      issue(
        "invalid-orchestration-input",
        "input.relationships",
        "relationships must be an array",
      ),
    ]);
  }
  const issues: DirectorRuntimeAttentionPathOrchestrationIssue[] = [];
  value.relationships.forEach((relationship, index) => {
    const validation = validateDirectorRuntimeAttentionRelationship(relationship);
    for (const relationshipIssue of validation.issues) {
      issues.push(
        issue(
          relationshipIssue.code,
          `input.relationships[${index}]`,
          relationshipIssue.message,
        ),
      );
    }
  });
  return issues.length === 0
    ? Object.freeze({
      ok: true,
      rootSubject: null,
      paths: Object.freeze([]),
      segments: Object.freeze([]),
      counts: DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_COUNTS,
      issues: Object.freeze([]),
    })
    : failureResult(issues);
}

export function validateDirectorRuntimeAttentionPathOrchestrationResult(
  value: unknown,
): DirectorRuntimeAttentionPathOrchestrationResult {
  if (!isPlainObject(value)) {
    return failureResult([
      issue("invalid-orchestration-result", "result", "result must be a plain object"),
    ]);
  }
  const issues: DirectorRuntimeAttentionPathOrchestrationIssue[] = [];
  if (typeof value.ok !== "boolean") {
    issues.push(issue("invalid-orchestration-result", "result.ok", "ok must be boolean"));
  }
  if (!Array.isArray(value.paths)) {
    issues.push(issue("invalid-orchestration-result", "result.paths", "paths must be array"));
  } else {
    value.paths.forEach((path, index) => {
      const pathValidation = validateDirectorRuntimeAttentionPath(path);
      for (const pathIssue of pathValidation.issues) {
        issues.push(issue(pathIssue.code, `result.paths[${index}]`, pathIssue.message));
      }
    });
  }
  if (!Array.isArray(value.segments)) {
    issues.push(
      issue("invalid-orchestration-result", "result.segments", "segments must be array"),
    );
  }
  return issues.length === 0
    ? Object.freeze({
      ok: true,
      rootSubject: null,
      paths: Object.freeze([]),
      segments: Object.freeze([]),
      counts: DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_COUNTS,
      issues: Object.freeze([]),
    })
    : failureResult(issues);
}

export function validateDirectorRuntimeAttentionPathPolicy(
  value: unknown,
): DirectorRuntimeAttentionPathOrchestrationResult {
  if (!isPlainObject(value)) {
    return failureResult([
      issue("invalid-path-policy", "policy", "policy must be a plain object"),
    ]);
  }
  if (value.suppressionTraversalPolicy !== "exclude-suppressed-from-active-paths") {
    return failureResult([
      issue(
        "invalid-path-policy",
        "policy.suppressionTraversalPolicy",
        "suppression policy mismatch",
      ),
    ]);
  }
  if (value.simplePathPolicy !== "no-repeated-subjects") {
    return failureResult([
      issue("invalid-path-policy", "policy.simplePathPolicy", "simple-path policy mismatch"),
    ]);
  }
  return Object.freeze({
    ok: true,
    rootSubject: null,
    paths: Object.freeze([]),
    segments: Object.freeze([]),
    counts: DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_COUNTS,
    issues: Object.freeze([]),
  });
}

// ─── Graph / traversal ──────────────────────────────────────────────────────

interface InternalEdge {
  readonly fromKey: string;
  readonly toKey: string;
  readonly kind: DirectorRuntimeAttentionRelationshipKind;
  readonly relationshipRef: string;
  readonly relationship: DirectorRuntimeAttentionRelationship;
  readonly inputIndex: number;
}

function roleMap(
  context: DirectorRuntimeFocusContext,
): Map<string, DirectorRuntimeFocusRole> {
  const map = new Map<string, DirectorRuntimeFocusRole>();
  for (const entry of context.entries) {
    map.set(subjectKey(entry.subject), entry.focusRole);
  }
  for (const entry of context.suppressedEntries) {
    map.set(subjectKey(entry.subject), entry.focusRole);
  }
  return map;
}

function suppressedKeys(context: DirectorRuntimeFocusContext): Set<string> {
  return new Set(
    context.suppressedEntries.map((entry) => subjectKey(entry.subject)),
  );
}

function buildEdges(
  relationships: readonly DirectorRuntimeAttentionRelationship[],
  suppressed: ReadonlySet<string>,
): readonly InternalEdge[] {
  const edges: InternalEdge[] = [];
  relationships.forEach((relationship, inputIndex) => {
    const fromKey = subjectKey(relationship.source);
    const toKey = subjectKey(relationship.target);
    if (suppressed.has(fromKey) || suppressed.has(toKey)) {
      return;
    }
    edges.push(Object.freeze({
      fromKey,
      toKey,
      kind: relationship.kind,
      relationshipRef: relationshipRefForDirectorRuntimeAttentionRelationship(relationship),
      relationship,
      inputIndex,
    }));
  });
  return Object.freeze(edges);
}

function adjacency(
  edges: readonly InternalEdge[],
  mode: "outbound" | "inbound",
): Map<string, readonly InternalEdge[]> {
  const map = new Map<string, InternalEdge[]>();
  for (const edge of edges) {
    const key = mode === "outbound" ? edge.fromKey : edge.toKey;
    const existing = map.get(key);
    if (existing === undefined) map.set(key, [edge]);
    else existing.push(edge);
  }
  for (const [key, list] of map) {
    list.sort((left, right) => left.inputIndex - right.inputIndex);
    map.set(key, list);
  }
  return map;
}

function endpointRole(
  roles: ReadonlyMap<string, DirectorRuntimeFocusRole>,
  endpointKey: string,
): DirectorRuntimeFocusRole | null {
  return roles.get(endpointKey) ?? null;
}

function classifyPath(
  relationshipKinds: readonly DirectorRuntimeAttentionRelationshipKind[],
  direction: "outbound" | "inbound",
  endpointFocusRole: DirectorRuntimeFocusRole | null,
  subjectCount: number,
): DirectorRuntimeAttentionPathKind {
  const candidates: DirectorRuntimeAttentionPathKind[] = [];
  if (relationshipKinds.includes("dependency")) {
    candidates.push("dependency");
  }
  if (endpointFocusRole === "supporting") candidates.push("supporting");
  if (endpointFocusRole === "contextual") candidates.push("contextual");
  if (direction === "inbound") candidates.push("upstream");
  if (direction === "outbound" && subjectCount > 2) candidates.push("downstream");
  if (direction === "outbound" && subjectCount === 2) candidates.push("direct");
  if (direction === "outbound") candidates.push("downstream");
  candidates.push("direct");

  for (const kind of DIRECTOR_RUNTIME_ATTENTION_PATH_CLASSIFICATION_PRECEDENCE) {
    if (candidates.includes(kind)) return kind;
  }
  return "direct";
}

function pathRelevance(
  roles: ReadonlyMap<string, DirectorRuntimeFocusRole>,
  subjects: readonly DirectorRuntimeAttentionSubjectReference[],
): DirectorRuntimeAttentionPathRelevance {
  const endpoint = subjects[subjects.length - 1]!;
  const role = roles.get(subjectKey(endpoint));
  if (role === "focused") return "primary";
  if (role === "supporting") return "supporting";
  if (role === "contextual") return "contextual";
  if (role === "peripheral") return "peripheral";
  return "peripheral";
}

function isExcludedEndpoint(
  roles: ReadonlyMap<string, DirectorRuntimeFocusRole>,
  endpointKey: string,
  rootKey: string,
): boolean {
  if (endpointKey === rootKey) return true;
  const role = roles.get(endpointKey);
  if (role === "peripheral" || role === "none") return true;
  return false;
}

function shouldCollectEndpoint(
  roles: ReadonlyMap<string, DirectorRuntimeFocusRole>,
  endpointKey: string,
  rootKey: string,
): boolean {
  if (isExcludedEndpoint(roles, endpointKey, rootKey)) return false;
  const role = roles.get(endpointKey);
  // Active focus endpoints always collect; structural nodes (absent from focus) collect too.
  if (role === undefined) return true;
  return role === "focused" || role === "supporting" || role === "contextual";
}

interface PartialPath {
  readonly subjectKeys: readonly string[];
  readonly edges: readonly InternalEdge[];
  readonly direction: "outbound" | "inbound";
}

function collectDirectedPaths(
  rootKey: string,
  adj: Map<string, readonly InternalEdge[]>,
  direction: "outbound" | "inbound",
  roles: ReadonlyMap<string, DirectorRuntimeFocusRole>,
  maxDepth: number,
): readonly PartialPath[] {
  const collected: PartialPath[] = [];

  const walk = (
    currentKey: string,
    subjectKeys: string[],
    edges: InternalEdge[],
  ) => {
    if (edges.length >= maxDepth) return;
    const neighbors = adj.get(currentKey) ?? [];
    for (const edge of neighbors) {
      const nextKey = direction === "outbound" ? edge.toKey : edge.fromKey;
      if (subjectKeys.includes(nextKey)) continue;
      const nextSubjects = [...subjectKeys, nextKey];
      const nextEdges = [...edges, edge];
      if (shouldCollectEndpoint(roles, nextKey, rootKey)) {
        collected.push(Object.freeze({
          subjectKeys: Object.freeze(nextSubjects),
          edges: Object.freeze(nextEdges),
          direction,
        }));
      }
      walk(nextKey, nextSubjects, nextEdges);
    }
  };

  walk(rootKey, [rootKey], []);
  return Object.freeze(collected);
}

function materializePath(
  partial: PartialPath,
  roles: ReadonlyMap<string, DirectorRuntimeFocusRole>,
): DirectorRuntimeAttentionPath {
  const subjects = partial.subjectKeys.map((key) => parseSubjectKey(key));
  const relationshipKinds = partial.edges.map((edge) => edge.kind);
  const kind = classifyPath(
    relationshipKinds,
    partial.direction,
    endpointRole(roles, partial.subjectKeys[partial.subjectKeys.length - 1]!),
    subjects.length,
  );
  const segments = partial.edges.map((edge) => freezeSegment({
    source: edge.relationship.source,
    target: edge.relationship.target,
    relationshipKind: edge.kind,
  }));
  const relationshipRefs = partial.edges.map((edge) => edge.relationshipRef);
  const pathId = [
    "path",
    kind,
    partial.direction,
    ...partial.subjectKeys.map((key) => key.replace("\u0000", ":")),
  ].join("|");

  return freezePath({
    pathId,
    kind,
    direction: partial.direction,
    relevance: pathRelevance(roles, subjects),
    subjects,
    relationshipRefs,
    segments,
  });
}

export function areDirectorRuntimeAttentionPathsEquivalent(
  left: DirectorRuntimeAttentionPath,
  right: DirectorRuntimeAttentionPath,
): boolean {
  return JSON.stringify({
    kind: left.kind,
    direction: left.direction,
    subjects: left.subjects.map((entry) => subjectKey(entry)),
    relationshipRefs: left.relationshipRefs,
  }) === JSON.stringify({
    kind: right.kind,
    direction: right.direction,
    subjects: right.subjects.map((entry) => subjectKey(entry)),
    relationshipRefs: right.relationshipRefs,
  });
}

export function deduplicateDirectorRuntimeAttentionPaths(
  paths: readonly DirectorRuntimeAttentionPath[],
): readonly DirectorRuntimeAttentionPath[] {
  const seen = new Set<string>();
  const result: DirectorRuntimeAttentionPath[] = [];
  for (const path of paths) {
    const key = JSON.stringify({
      kind: path.kind,
      direction: path.direction,
      subjects: path.subjects.map((entry) => subjectKey(entry)),
      relationshipRefs: path.relationshipRefs,
    });
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(path);
  }
  return Object.freeze(result);
}

function deduplicateSegments(
  paths: readonly DirectorRuntimeAttentionPath[],
): readonly DirectorRuntimeAttentionPathSegment[] {
  const seen = new Set<string>();
  const segments: DirectorRuntimeAttentionPathSegment[] = [];
  for (const path of paths) {
    for (const segment of path.segments) {
      const key = [
        subjectKey(segment.source),
        subjectKey(segment.target),
        segment.relationshipKind,
      ].join("\u0001");
      if (seen.has(key)) continue;
      seen.add(key);
      segments.push(segment);
    }
  }
  return Object.freeze(segments);
}

function finalizeResult(
  rootSubject: DirectorRuntimeAttentionSubjectReference | null,
  paths: readonly DirectorRuntimeAttentionPath[],
): DirectorRuntimeAttentionPathOrchestrationResult {
  const uniquePaths = deduplicateDirectorRuntimeAttentionPaths(paths);
  const segments = deduplicateSegments(uniquePaths);
  return Object.freeze({
    ok: true,
    rootSubject: rootSubject === null ? null : freezeSubject(rootSubject),
    paths: uniquePaths,
    segments,
    counts: buildCounts(uniquePaths, segments),
    issues: Object.freeze([]),
  });
}

function prepareGraph(input: DirectorRuntimeAttentionPathOrchestrationInput): {
  readonly ok: true;
  readonly rootKey: string;
  readonly rootSubject: DirectorRuntimeAttentionSubjectReference;
  readonly roles: Map<string, DirectorRuntimeFocusRole>;
  readonly outbound: Map<string, readonly InternalEdge[]>;
  readonly inbound: Map<string, readonly InternalEdge[]>;
  readonly maxDepth: number;
} | {
  readonly ok: false;
  readonly result: DirectorRuntimeAttentionPathOrchestrationResult;
} {
  const validation = validateDirectorRuntimeAttentionPathOrchestrationInput(input);
  if (!validation.ok) {
    return { ok: false, result: validation };
  }
  const rootSubject = input.focusContext.primarySubject;
  if (rootSubject === null) {
    return {
      ok: false,
      result: DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_RESULT,
    };
  }
  const relationships = input.relationships.map((entry) =>
    createDirectorRuntimeAttentionRelationship(entry));
  const roles = roleMap(input.focusContext);
  const suppressed = suppressedKeys(input.focusContext);
  const edges = buildEdges(relationships, suppressed);
  const uniqueSubjects = new Set<string>();
  for (const edge of edges) {
    uniqueSubjects.add(edge.fromKey);
    uniqueSubjects.add(edge.toKey);
  }
  uniqueSubjects.add(subjectKey(rootSubject));
  return {
    ok: true,
    rootKey: subjectKey(rootSubject),
    rootSubject: freezeSubject(rootSubject),
    roles,
    outbound: adjacency(edges, "outbound"),
    inbound: adjacency(edges, "inbound"),
    maxDepth: Math.max(1, uniqueSubjects.size),
  };
}

function collectAllPaths(
  prepared: Extract<ReturnType<typeof prepareGraph>, { ok: true }>,
): readonly DirectorRuntimeAttentionPath[] {
  const outboundPartials = collectDirectedPaths(
    prepared.rootKey,
    prepared.outbound,
    "outbound",
    prepared.roles,
    prepared.maxDepth,
  );
  const inboundPartials = collectDirectedPaths(
    prepared.rootKey,
    prepared.inbound,
    "inbound",
    prepared.roles,
    prepared.maxDepth,
  );
  return Object.freeze([
    ...outboundPartials.map((partial) => materializePath(partial, prepared.roles)),
    ...inboundPartials.map((partial) => materializePath(partial, prepared.roles)),
  ]);
}

// ─── Public resolution APIs ─────────────────────────────────────────────────

export function resolveDirectorRuntimeDirectAttentionPaths(
  input: DirectorRuntimeAttentionPathOrchestrationInput,
): DirectorRuntimeAttentionPathOrchestrationResult {
  const prepared = prepareGraph(input);
  if (!prepared.ok) return prepared.result;
  const paths = collectAllPaths(prepared).filter(
    (path) => path.subjects.length === 2 && path.direction === "outbound",
  );
  return finalizeResult(prepared.rootSubject, paths);
}

export function resolveDirectorRuntimeUpstreamAttentionPaths(
  input: DirectorRuntimeAttentionPathOrchestrationInput,
): DirectorRuntimeAttentionPathOrchestrationResult {
  const prepared = prepareGraph(input);
  if (!prepared.ok) return prepared.result;
  const paths = collectAllPaths(prepared).filter(
    (path) => path.direction === "inbound",
  );
  return finalizeResult(prepared.rootSubject, paths);
}

export function resolveDirectorRuntimeDownstreamAttentionPaths(
  input: DirectorRuntimeAttentionPathOrchestrationInput,
): DirectorRuntimeAttentionPathOrchestrationResult {
  const prepared = prepareGraph(input);
  if (!prepared.ok) return prepared.result;
  const paths = collectAllPaths(prepared).filter(
    (path) => path.direction === "outbound",
  );
  return finalizeResult(prepared.rootSubject, paths);
}

export function orchestrateDirectorRuntimeAttentionPaths(
  input: DirectorRuntimeAttentionPathOrchestrationInput,
): DirectorRuntimeAttentionPathOrchestrationResult {
  const prepared = prepareGraph(input);
  if (!prepared.ok) return prepared.result;
  if (
    input.relationships.length === 0 ||
    (prepared.outbound.size === 0 && prepared.inbound.size === 0)
  ) {
    return finalizeResult(prepared.rootSubject, []);
  }
  return finalizeResult(prepared.rootSubject, collectAllPaths(prepared));
}

// ─── Lookup helpers ─────────────────────────────────────────────────────────

export function isSubjectInDirectorRuntimeAttentionPath(
  path: DirectorRuntimeAttentionPath,
  subject: DirectorRuntimeAttentionSubjectReference,
): boolean {
  return path.subjects.some((entry) =>
    areDirectorRuntimeAttentionSubjectsEqual(entry, subject));
}

export function findDirectorRuntimeAttentionPathsByKind(
  result: DirectorRuntimeAttentionPathOrchestrationResult,
  kind: DirectorRuntimeAttentionPathKind,
): readonly DirectorRuntimeAttentionPath[] {
  return Object.freeze(result.paths.filter((path) => path.kind === kind));
}

export function findDirectorRuntimeAttentionPathsContainingSubject(
  result: DirectorRuntimeAttentionPathOrchestrationResult,
  subject: DirectorRuntimeAttentionSubjectReference,
): readonly DirectorRuntimeAttentionPath[] {
  return Object.freeze(
    result.paths.filter((path) =>
      isSubjectInDirectorRuntimeAttentionPath(path, subject)),
  );
}

export function findDirectorRuntimeAttentionPathsFromRoot(
  result: DirectorRuntimeAttentionPathOrchestrationResult,
): readonly DirectorRuntimeAttentionPath[] {
  if (result.rootSubject === null) return Object.freeze([]);
  const root = result.rootSubject;
  return Object.freeze(
    result.paths.filter((path) =>
      path.subjects.length > 0 &&
      areDirectorRuntimeAttentionSubjectsEqual(path.subjects[0]!, root)),
  );
}

// ─── Registry / capabilities ────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ATTENTION_PATH_ORCHESTRATION_CAPABILITIES =
  Object.freeze([
    "DirectPathResolution",
    "UpstreamPathResolution",
    "DownstreamPathResolution",
    "DependencyPathResolution",
    "SupportingPathResolution",
    "ContextualPathResolution",
    "CycleSafeTraversal",
    "SimplePathGeneration",
    "PathClassification",
    "PathDeduplication",
    "PathValidation",
  ] as const);

export const DIRECTOR_RUNTIME_ATTENTION_PATH_ORCHESTRATION_ABSENT_CAPABILITIES =
  Object.freeze([
    "PriorityResolution",
    "FocusContextBinding",
    "TransitionOrchestration",
    "PresentationBehavior",
    "SceneMutation",
  ] as const);

export const DIRECTOR_RUNTIME_ATTENTION_PATH_ORCHESTRATION_INVARIANTS =
  Object.freeze([
    Object.freeze({ id: "determinism", statement: "identical valid input produces identical paths" }),
    Object.freeze({ id: "root-consistency", statement: "paths resolve relative to the declared root subject" }),
    Object.freeze({ id: "focus-preservation", statement: "path orchestration never changes focus roles or levels" }),
    Object.freeze({ id: "explicit-relationship-only", statement: "no path segment exists without a supplied relationship" }),
    Object.freeze({ id: "cycle-safety", statement: "cyclic relationship input terminates deterministically" }),
    Object.freeze({ id: "simple-paths", statement: "no canonical path repeats a subject" }),
    Object.freeze({ id: "stable-ordering", statement: "equivalent traversal preserves first-seen order" }),
    Object.freeze({ id: "suppression-policy", statement: "suppressed subjects are not active path endpoints" }),
    Object.freeze({ id: "path-deduplication", statement: "equivalent paths appear once" }),
    Object.freeze({ id: "segment-integrity", statement: "adjacent subjects correspond to valid segments" }),
    Object.freeze({ id: "input-immutability", statement: "focus context and relationships are not mutated" }),
    Object.freeze({ id: "output-immutability", statement: "canonical path results are immutable" }),
    Object.freeze({ id: "no-priority-behavior", statement: "no attention re-resolution occurs" }),
    Object.freeze({ id: "no-context-rebinding", statement: "no focus-role or level changes occur" }),
    Object.freeze({ id: "no-transition-behavior", statement: "no path history or handoff logic exists" }),
    Object.freeze({ id: "no-presentation-leakage", statement: "no renderer-specific path fields exist" }),
  ] as const);

export const directorRuntimeAttentionPathOrchestrationApiNames = Object.freeze([
  "createDirectorRuntimeAttentionRelationship",
  "validateDirectorRuntimeAttentionRelationship",
  "validateDirectorRuntimeAttentionPathKind",
  "validateDirectorRuntimeAttentionPathDirection",
  "validateDirectorRuntimeAttentionPathSegment",
  "validateDirectorRuntimeAttentionPath",
  "validateDirectorRuntimeAttentionPathOrchestrationInput",
  "validateDirectorRuntimeAttentionPathOrchestrationResult",
  "validateDirectorRuntimeAttentionPathPolicy",
  "resolveDirectorRuntimeDirectAttentionPaths",
  "resolveDirectorRuntimeUpstreamAttentionPaths",
  "resolveDirectorRuntimeDownstreamAttentionPaths",
  "orchestrateDirectorRuntimeAttentionPaths",
  "deduplicateDirectorRuntimeAttentionPaths",
  "areDirectorRuntimeAttentionPathsEquivalent",
  "isSubjectInDirectorRuntimeAttentionPath",
  "findDirectorRuntimeAttentionPathsByKind",
  "findDirectorRuntimeAttentionPathsContainingSubject",
  "findDirectorRuntimeAttentionPathsFromRoot",
  "relationshipRefForDirectorRuntimeAttentionRelationship",
  "verifyDirectorRuntimeAttentionPathOrchestration",
] as const);

export const directorRuntimeAttentionPathOrchestrationPolicy = Object.freeze({
  pathKinds: DIRECTOR_RUNTIME_ATTENTION_PATH_KINDS,
  directions: DIRECTOR_RUNTIME_ATTENTION_PATH_DIRECTIONS,
  classificationPrecedence:
    DIRECTOR_RUNTIME_ATTENTION_PATH_CLASSIFICATION_PRECEDENCE,
  suppressionTraversalPolicy: "exclude-suppressed-from-active-paths" as const,
  cyclePolicy: "visited-subject-simple-path" as const,
  simplePathPolicy: "no-repeated-subjects" as const,
  orderingPolicy: "input-relationship-order-then-discovery-order" as const,
  maxDepthPolicy: "bounded-by-unique-subjects" as const,
  weightedGraph: false as const,
  shortestPathOptimization: false as const,
  inventsRelationships: false as const,
  performsPriorityResolution: false as const,
  rebindsFocusContext: false as const,
});

export const directorRuntimeAttentionPathOrchestrationRegistry = Object.freeze({
  identity: directorRuntimeAttentionPathOrchestrationIdentity,
  version: directorRuntimeAttentionPathOrchestrationVersion,
  namespace: directorRuntimeAttentionPathOrchestrationNamespace,
  dependency: directorRuntimeAttentionPathOrchestrationUpstream,
  pathKinds: DIRECTOR_RUNTIME_ATTENTION_PATH_KINDS,
  pathKindCount: DIRECTOR_RUNTIME_ATTENTION_PATH_KINDS.length,
  directions: DIRECTOR_RUNTIME_ATTENTION_PATH_DIRECTIONS,
  directionCount: DIRECTOR_RUNTIME_ATTENTION_PATH_DIRECTIONS.length,
  classificationPrecedence:
    DIRECTOR_RUNTIME_ATTENTION_PATH_CLASSIFICATION_PRECEDENCE,
  classificationPrecedenceCount:
    DIRECTOR_RUNTIME_ATTENTION_PATH_CLASSIFICATION_PRECEDENCE.length,
  relevanceValues: DIRECTOR_RUNTIME_ATTENTION_PATH_RELEVANCE_VALUES,
  policy: directorRuntimeAttentionPathOrchestrationPolicy,
  capabilities: DIRECTOR_RUNTIME_ATTENTION_PATH_ORCHESTRATION_CAPABILITIES,
  capabilityCount: DIRECTOR_RUNTIME_ATTENTION_PATH_ORCHESTRATION_CAPABILITIES.length,
  absentCapabilities:
    DIRECTOR_RUNTIME_ATTENTION_PATH_ORCHESTRATION_ABSENT_CAPABILITIES,
  emptyResult: DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_RESULT,
  invariants: DIRECTOR_RUNTIME_ATTENTION_PATH_ORCHESTRATION_INVARIANTS,
  invariantCount: DIRECTOR_RUNTIME_ATTENTION_PATH_ORCHESTRATION_INVARIANTS.length,
  publicApis: directorRuntimeAttentionPathOrchestrationApiNames,
  publicApiCount: directorRuntimeAttentionPathOrchestrationApiNames.length,
});

export const directorRuntimeAttentionPathOrchestration = Object.freeze({
  phase: "DRI-6:5" as const,
  name: "DirectorRuntimeAttentionPathOrchestration" as const,
  identity: directorRuntimeAttentionPathOrchestrationIdentity,
  namespace: directorRuntimeAttentionPathOrchestrationNamespace,
  version: directorRuntimeAttentionPathOrchestrationVersion,
  layer: "Director Runtime Integration" as const,
  domain: "AttentionFocusOrchestration" as const,
  role: "AttentionPathOrchestration" as const,
  stage: "AttentionPathOrchestration" as const,
  status: "AttentionPathOrchestrationReady" as const,
  upstreamDependency: directorRuntimeAttentionPathOrchestrationUpstream,
  deterministic: true as const,
  rendererIndependent: true as const,
  philosophy: "semantic-paths-not-geometry" as const,
  policy: directorRuntimeAttentionPathOrchestrationPolicy,
  capabilities: DIRECTOR_RUNTIME_ATTENTION_PATH_ORCHESTRATION_CAPABILITIES,
  absentCapabilities:
    DIRECTOR_RUNTIME_ATTENTION_PATH_ORCHESTRATION_ABSENT_CAPABILITIES,
  emptyResult: DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_RESULT,
  invariants: DIRECTOR_RUNTIME_ATTENTION_PATH_ORCHESTRATION_INVARIANTS,
  publicApiSurface: directorRuntimeAttentionPathOrchestrationApiNames,
  registry: directorRuntimeAttentionPathOrchestrationRegistry,
  focusContextBoundary: "DRI-6:4-focus-context-binding-only" as const,
  architecturalStatus:
    "Established · Deterministic · Cycle-Safe · Immutable · AttentionPathOrchestrationReady" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface DirectorRuntimeAttentionPathOrchestrationVerification {
  readonly ok: boolean;
  readonly identity: typeof directorRuntimeAttentionPathOrchestrationIdentity;
  readonly version: typeof directorRuntimeAttentionPathOrchestrationVersion;
  readonly namespace: typeof directorRuntimeAttentionPathOrchestrationNamespace;
  readonly dependency: typeof directorRuntimeAttentionPathOrchestrationUpstream;
  readonly pathKindCount: number;
  readonly directionCount: number;
  readonly classificationPrecedenceCount: number;
  readonly capabilityCount: number;
  readonly invariantCount: number;
  readonly frozen: boolean;
}

export function verifyDirectorRuntimeAttentionPathOrchestration():
  DirectorRuntimeAttentionPathOrchestrationVerification {
  const layer = directorRuntimeAttentionPathOrchestration;
  const registry = directorRuntimeAttentionPathOrchestrationRegistry;
  const ok =
    layer.identity === "DRI-6:5/DirectorRuntimeAttentionPathOrchestration" &&
    layer.version === "6.5.0" &&
    layer.namespace === "nexora.dri.attention-focus.path-orchestration" &&
    layer.role === "AttentionPathOrchestration" &&
    layer.status === "AttentionPathOrchestrationReady" &&
    layer.upstreamDependency ===
      "DRI-6:4/DirectorRuntimeFocusContextBinding" &&
    layer.upstreamDependency === directorRuntimeFocusContextBindingIdentity &&
    registry.dependency === layer.upstreamDependency &&
    DIRECTOR_RUNTIME_ATTENTION_PATH_KINDS.length === 6 &&
    DIRECTOR_RUNTIME_ATTENTION_PATH_DIRECTIONS.length === 3 &&
    DIRECTOR_RUNTIME_ATTENTION_PATH_CLASSIFICATION_PRECEDENCE[0] === "dependency" &&
    DIRECTOR_RUNTIME_ATTENTION_PATH_CLASSIFICATION_PRECEDENCE[5] === "direct" &&
    layer.policy.suppressionTraversalPolicy ===
      "exclude-suppressed-from-active-paths" &&
    layer.policy.simplePathPolicy === "no-repeated-subjects" &&
    layer.policy.weightedGraph === false &&
    layer.policy.inventsRelationships === false &&
    !DIRECTOR_RUNTIME_ATTENTION_PATH_ORCHESTRATION_CAPABILITIES.includes(
      "TransitionOrchestration" as never,
    ) &&
    Object.isFrozen(layer) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(directorRuntimeAttentionPathOrchestrationPolicy) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_RESULT);

  return Object.freeze({
    ok,
    identity: directorRuntimeAttentionPathOrchestrationIdentity,
    version: directorRuntimeAttentionPathOrchestrationVersion,
    namespace: directorRuntimeAttentionPathOrchestrationNamespace,
    dependency: directorRuntimeAttentionPathOrchestrationUpstream,
    pathKindCount: DIRECTOR_RUNTIME_ATTENTION_PATH_KINDS.length,
    directionCount: DIRECTOR_RUNTIME_ATTENTION_PATH_DIRECTIONS.length,
    classificationPrecedenceCount:
      DIRECTOR_RUNTIME_ATTENTION_PATH_CLASSIFICATION_PRECEDENCE.length,
    capabilityCount:
      DIRECTOR_RUNTIME_ATTENTION_PATH_ORCHESTRATION_CAPABILITIES.length,
    invariantCount:
      DIRECTOR_RUNTIME_ATTENTION_PATH_ORCHESTRATION_INVARIANTS.length,
    frozen: Object.isFrozen(layer) && Object.isFrozen(registry),
  });
}
