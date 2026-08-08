/**
 * DRI-6:4 — Director Runtime Focus Context Binding.
 *
 * Converts resolved attention from DRI-6:3 into a structured, immutable Focus
 * Context for downstream Director consumption. No path discovery, transition,
 * presentation, or re-resolution.
 */

import {
  DIRECTOR_RUNTIME_EMPTY_ATTENTION_RESOLUTION_OUTCOME,
  directorRuntimeAttentionPriorityResolutionIdentity,
  validateDirectorRuntimeAttentionResolutionOutcome,
  validateDirectorRuntimeResolvedAttentionAssignment,
  type DirectorRuntimeAttentionFocusLevel,
  type DirectorRuntimeAttentionResolutionOutcome,
  type DirectorRuntimeAttentionSubjectReference,
  type DirectorRuntimeResolvedAttentionAssignment,
} from "@/app/lib/dri/directorRuntimeAttentionPriorityResolution";

export type {
  DirectorRuntimeAttentionFocusLevel,
  DirectorRuntimeAttentionResolutionOutcome,
  DirectorRuntimeAttentionSignal,
  DirectorRuntimeAttentionSignalBatch,
  DirectorRuntimeAttentionSubjectReference,
  DirectorRuntimeResolvedAttentionAssignment,
} from "@/app/lib/dri/directorRuntimeAttentionPriorityResolution";

export {
  DIRECTOR_RUNTIME_EMPTY_ATTENTION_RESOLUTION_OUTCOME,
  DIRECTOR_RUNTIME_EMPTY_ATTENTION_SIGNAL_BATCH,
  createDirectorRuntimeAttentionSignal,
  createDirectorRuntimeAttentionSignalBatch,
  resolveDirectorRuntimeAttentionPriority,
  validateDirectorRuntimeAttentionResolutionOutcome,
  validateDirectorRuntimeAttentionSignalBatch,
} from "@/app/lib/dri/directorRuntimeAttentionPriorityResolution";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeFocusContextBindingIdentity =
  "DRI-6:4/DirectorRuntimeFocusContextBinding" as const;
export const directorRuntimeFocusContextBindingVersion = "6.4.0" as const;
export const directorRuntimeFocusContextBindingNamespace =
  "nexora.dri.attention-focus.context-binding" as const;
export const directorRuntimeFocusContextBindingUpstream =
  directorRuntimeAttentionPriorityResolutionIdentity;

export const directorRuntimeFocusContextBindingCanonicalIdentity = Object.freeze({
  identity: directorRuntimeFocusContextBindingIdentity,
  version: directorRuntimeFocusContextBindingVersion,
  namespace: directorRuntimeFocusContextBindingNamespace,
  upstream: directorRuntimeFocusContextBindingUpstream,
});

// ─── Focus roles (exact upstream foundation vocabulary, via binding policy) ─

/**
 * Canonical focus roles. Literals match DRI-6:1 foundation vocabulary;
 * DRI-6:4 must not import foundation/signal contracts directly.
 */
export const DIRECTOR_RUNTIME_FOCUS_CONTEXT_ROLES = Object.freeze([
  "focused",
  "supporting",
  "contextual",
  "peripheral",
  "none",
] as const);
export type DirectorRuntimeFocusRole =
  (typeof DIRECTOR_RUNTIME_FOCUS_CONTEXT_ROLES)[number];

export const DIRECTOR_RUNTIME_FOCUS_CONTEXT_ATTENTION_LEVELS = Object.freeze([
  "primary",
  "secondary",
  "context",
  "background",
  "suppressed",
] as const satisfies readonly DirectorRuntimeAttentionFocusLevel[]);

/** Canonical attention-level → focus-role mapping (inspectable, immutable). */
export const DIRECTOR_RUNTIME_ATTENTION_LEVEL_TO_FOCUS_ROLE = Object.freeze({
  primary: "focused",
  secondary: "supporting",
  context: "contextual",
  background: "peripheral",
  suppressed: "none",
} as const satisfies Record<
  DirectorRuntimeAttentionFocusLevel,
  DirectorRuntimeFocusRole
>);

export const DIRECTOR_RUNTIME_FOCUS_CONTEXT_ENTRY_ORDER =
  DIRECTOR_RUNTIME_FOCUS_CONTEXT_ATTENTION_LEVELS;

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface DirectorRuntimeFocusContextEntry {
  readonly subject: DirectorRuntimeAttentionSubjectReference;
  readonly attentionLevel: DirectorRuntimeAttentionFocusLevel;
  readonly focusRole: DirectorRuntimeFocusRole;
  readonly sourceAssignmentId: string;
  readonly contributingSignalIds: readonly string[];
}

export interface DirectorRuntimeFocusContext {
  readonly primarySubject: DirectorRuntimeAttentionSubjectReference | null;
  readonly entries: readonly DirectorRuntimeFocusContextEntry[];
  readonly suppressedEntries: readonly DirectorRuntimeFocusContextEntry[];
}

export interface DirectorRuntimeFocusContextBindingInput {
  readonly resolution: DirectorRuntimeAttentionResolutionOutcome;
}

export interface DirectorRuntimeFocusContextBindingMetadata {
  readonly boundSubjectCount: number;
  readonly focusedCount: number;
  readonly supportingCount: number;
  readonly contextualCount: number;
  readonly peripheralCount: number;
  readonly suppressedCount: number;
}

export interface DirectorRuntimeFocusContextBindingResult {
  readonly ok: boolean;
  readonly context: DirectorRuntimeFocusContext | null;
  readonly boundSubjectCount: number;
  readonly suppressedSubjectCount: number;
  readonly metadata: DirectorRuntimeFocusContextBindingMetadata;
  readonly issues: readonly DirectorRuntimeFocusContextBindingIssue[];
}

export const DIRECTOR_RUNTIME_EMPTY_FOCUS_CONTEXT = Object.freeze({
  primarySubject: null,
  entries: Object.freeze([]) as readonly DirectorRuntimeFocusContextEntry[],
  suppressedEntries: Object.freeze([]) as readonly DirectorRuntimeFocusContextEntry[],
}) satisfies DirectorRuntimeFocusContext;

export const DIRECTOR_RUNTIME_EMPTY_FOCUS_CONTEXT_BINDING_METADATA = Object.freeze({
  boundSubjectCount: 0,
  focusedCount: 0,
  supportingCount: 0,
  contextualCount: 0,
  peripheralCount: 0,
  suppressedCount: 0,
}) satisfies DirectorRuntimeFocusContextBindingMetadata;

export const DIRECTOR_RUNTIME_FOCUS_CONTEXT_BINDING_ISSUE_CODES = Object.freeze([
  "invalid-binding-input",
  "invalid-resolution-outcome",
  "invalid-focus-context-entry",
  "invalid-focus-context",
  "invalid-binding-result",
  "invalid-binding-policy",
  "inconsistent-role-level",
  "multiple-primary-subjects",
  "mismatched-primary-subject",
  "duplicate-subject",
  "invalid-subject",
  "invalid-signal-trace",
] as const);
export type DirectorRuntimeFocusContextBindingIssueCode =
  (typeof DIRECTOR_RUNTIME_FOCUS_CONTEXT_BINDING_ISSUE_CODES)[number];

export interface DirectorRuntimeFocusContextBindingIssue {
  readonly code: DirectorRuntimeFocusContextBindingIssueCode;
  readonly path: string;
  readonly message: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function issue(
  code: DirectorRuntimeFocusContextBindingIssueCode,
  path: string,
  message: string,
): DirectorRuntimeFocusContextBindingIssue {
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

function isAttentionLevel(
  value: unknown,
): value is DirectorRuntimeAttentionFocusLevel {
  return (DIRECTOR_RUNTIME_FOCUS_CONTEXT_ATTENTION_LEVELS as readonly unknown[])
    .includes(value);
}

function isFocusRole(value: unknown): value is DirectorRuntimeFocusRole {
  return (DIRECTOR_RUNTIME_FOCUS_CONTEXT_ROLES as readonly unknown[]).includes(value);
}

export function areDirectorRuntimeAttentionSubjectsEqual(
  left: DirectorRuntimeAttentionSubjectReference,
  right: DirectorRuntimeAttentionSubjectReference,
): boolean {
  return left.subjectId === right.subjectId && left.subjectKind === right.subjectKind;
}

function subjectKey(subject: DirectorRuntimeAttentionSubjectReference): string {
  return `${subject.subjectKind}\u0000${subject.subjectId}`;
}

function freezeSubject(
  subject: DirectorRuntimeAttentionSubjectReference,
): DirectorRuntimeAttentionSubjectReference {
  return Object.freeze({
    subjectId: subject.subjectId,
    subjectKind: subject.subjectKind,
  });
}

function emptyBindingResult(
  issues: readonly DirectorRuntimeFocusContextBindingIssue[],
): DirectorRuntimeFocusContextBindingResult {
  return Object.freeze({
    ok: false,
    context: null,
    boundSubjectCount: 0,
    suppressedSubjectCount: 0,
    metadata: DIRECTOR_RUNTIME_EMPTY_FOCUS_CONTEXT_BINDING_METADATA,
    issues: Object.freeze([...issues]),
  });
}

function countByRole(
  entries: readonly DirectorRuntimeFocusContextEntry[],
  role: DirectorRuntimeFocusRole,
): number {
  return entries.filter((entry) => entry.focusRole === role).length;
}

function buildMetadata(
  entries: readonly DirectorRuntimeFocusContextEntry[],
  suppressedEntries: readonly DirectorRuntimeFocusContextEntry[],
): DirectorRuntimeFocusContextBindingMetadata {
  return Object.freeze({
    boundSubjectCount: entries.length + suppressedEntries.length,
    focusedCount: countByRole(entries, "focused"),
    supportingCount: countByRole(entries, "supporting"),
    contextualCount: countByRole(entries, "contextual"),
    peripheralCount: countByRole(entries, "peripheral"),
    suppressedCount: suppressedEntries.length,
  });
}

function levelOrderRank(level: DirectorRuntimeAttentionFocusLevel): number {
  return DIRECTOR_RUNTIME_FOCUS_CONTEXT_ENTRY_ORDER.indexOf(level);
}

// ─── Mapping / entry binding ────────────────────────────────────────────────

export function mapDirectorRuntimeAttentionLevelToFocusRole(
  level: DirectorRuntimeAttentionFocusLevel,
): DirectorRuntimeFocusRole {
  return DIRECTOR_RUNTIME_ATTENTION_LEVEL_TO_FOCUS_ROLE[level];
}

export function freezeDirectorRuntimeFocusContextEntry(
  entry: DirectorRuntimeFocusContextEntry,
): DirectorRuntimeFocusContextEntry {
  return Object.freeze({
    subject: freezeSubject(entry.subject),
    attentionLevel: entry.attentionLevel,
    focusRole: entry.focusRole,
    sourceAssignmentId: entry.sourceAssignmentId,
    contributingSignalIds: Object.freeze([...entry.contributingSignalIds]),
  });
}

export function bindDirectorRuntimeFocusContextEntry(
  assignment: DirectorRuntimeResolvedAttentionAssignment,
): DirectorRuntimeFocusContextEntry {
  return freezeDirectorRuntimeFocusContextEntry({
    subject: assignment.subject,
    attentionLevel: assignment.resolvedLevel,
    focusRole: mapDirectorRuntimeAttentionLevelToFocusRole(assignment.resolvedLevel),
    sourceAssignmentId: assignment.winningSignalId,
    contributingSignalIds: assignment.contributingSignalIds,
  });
}

export function freezeDirectorRuntimeFocusContext(
  context: DirectorRuntimeFocusContext,
): DirectorRuntimeFocusContext {
  return Object.freeze({
    primarySubject: context.primarySubject === null
      ? null
      : freezeSubject(context.primarySubject),
    entries: Object.freeze(
      context.entries.map((entry) => freezeDirectorRuntimeFocusContextEntry(entry)),
    ),
    suppressedEntries: Object.freeze(
      context.suppressedEntries.map((entry) =>
        freezeDirectorRuntimeFocusContextEntry(entry)),
    ),
  });
}

// ─── Validation ─────────────────────────────────────────────────────────────

export function validateDirectorRuntimeFocusContextEntry(
  value: unknown,
): DirectorRuntimeFocusContextBindingResult {
  if (!isPlainObject(value)) {
    return emptyBindingResult([
      issue("invalid-focus-context-entry", "entry", "entry must be a plain object"),
    ]);
  }
  const issues: DirectorRuntimeFocusContextBindingIssue[] = [];
  if (
    !isPlainObject(value.subject) ||
    !isNonEmptyString(value.subject.subjectId) ||
    !isNonEmptyString(value.subject.subjectKind)
  ) {
    issues.push(issue("invalid-subject", "entry.subject", "subject reference invalid"));
  }
  if (!isAttentionLevel(value.attentionLevel)) {
    issues.push(
      issue("invalid-focus-context-entry", "entry.attentionLevel", "attentionLevel invalid"),
    );
  }
  if (!isFocusRole(value.focusRole)) {
    issues.push(
      issue("invalid-focus-context-entry", "entry.focusRole", "focusRole invalid"),
    );
  }
  if (
    isAttentionLevel(value.attentionLevel) &&
    isFocusRole(value.focusRole) &&
    mapDirectorRuntimeAttentionLevelToFocusRole(value.attentionLevel) !== value.focusRole
  ) {
    issues.push(
      issue(
        "inconsistent-role-level",
        "entry",
        "attentionLevel and focusRole are inconsistent with binding policy",
      ),
    );
  }
  if (!isNonEmptyString(value.sourceAssignmentId)) {
    issues.push(
      issue(
        "invalid-focus-context-entry",
        "entry.sourceAssignmentId",
        "sourceAssignmentId invalid",
      ),
    );
  }
  if (
    !Array.isArray(value.contributingSignalIds) ||
    value.contributingSignalIds.length === 0 ||
    value.contributingSignalIds.some((id) => !isNonEmptyString(id))
  ) {
    issues.push(
      issue(
        "invalid-signal-trace",
        "entry.contributingSignalIds",
        "contributingSignalIds must be a non-empty string array",
      ),
    );
  }
  if (issues.length > 0) {
    return emptyBindingResult(issues);
  }
  return Object.freeze({
    ok: true,
    context: null,
    boundSubjectCount: 0,
    suppressedSubjectCount: 0,
    metadata: DIRECTOR_RUNTIME_EMPTY_FOCUS_CONTEXT_BINDING_METADATA,
    issues: Object.freeze([]),
  });
}

export function validateDirectorRuntimeFocusContext(
  value: unknown,
): DirectorRuntimeFocusContextBindingResult {
  if (!isPlainObject(value)) {
    return emptyBindingResult([
      issue("invalid-focus-context", "context", "context must be a plain object"),
    ]);
  }
  const issues: DirectorRuntimeFocusContextBindingIssue[] = [];

  if (value.primarySubject !== null) {
    if (
      !isPlainObject(value.primarySubject) ||
      !isNonEmptyString(value.primarySubject.subjectId) ||
      !isNonEmptyString(value.primarySubject.subjectKind)
    ) {
      issues.push(
        issue("invalid-subject", "context.primarySubject", "primarySubject invalid"),
      );
    }
  }

  if (!Array.isArray(value.entries)) {
    issues.push(issue("invalid-focus-context", "context.entries", "entries must be array"));
  }
  if (!Array.isArray(value.suppressedEntries)) {
    issues.push(
      issue(
        "invalid-focus-context",
        "context.suppressedEntries",
        "suppressedEntries must be array",
      ),
    );
  }
  if (issues.length > 0) {
    return emptyBindingResult(issues);
  }

  const entries = value.entries as unknown[];
  const suppressedEntries = value.suppressedEntries as unknown[];
  const seen = new Set<string>();

  const validateList = (list: unknown[], path: string, expectSuppressed: boolean) => {
    list.forEach((entry, index) => {
      const entryValidation = validateDirectorRuntimeFocusContextEntry(entry);
      for (const entryIssue of entryValidation.issues) {
        issues.push(issue(entryIssue.code, `${path}[${index}]`, entryIssue.message));
      }
      if (!isPlainObject(entry) || !isPlainObject(entry.subject)) return;
      const key = `${String(entry.subject.subjectKind)}\u0000${String(entry.subject.subjectId)}`;
      if (seen.has(key)) {
        issues.push(issue("duplicate-subject", `${path}[${index}]`, "duplicate subject"));
      } else {
        seen.add(key);
      }
      if (expectSuppressed) {
        if (entry.attentionLevel !== "suppressed" || entry.focusRole !== "none") {
          issues.push(
            issue(
              "inconsistent-role-level",
              `${path}[${index}]`,
              "suppressedEntries must use suppressed/none",
            ),
          );
        }
      } else if (entry.attentionLevel === "suppressed" || entry.focusRole === "none") {
        issues.push(
          issue(
            "invalid-focus-context",
            `${path}[${index}]`,
            "suppressed subjects must live in suppressedEntries",
          ),
        );
      }
    });
  };

  validateList(entries, "context.entries", false);
  validateList(suppressedEntries, "context.suppressedEntries", true);

  const focused = entries.filter(
    (entry) => isPlainObject(entry) && entry.focusRole === "focused",
  );
  const primaryLevel = entries.filter(
    (entry) => isPlainObject(entry) && entry.attentionLevel === "primary",
  );

  if (focused.length > 1 || primaryLevel.length > 1) {
    issues.push(
      issue(
        "multiple-primary-subjects",
        "context.entries",
        "context may contain at most one primary/focused entry",
      ),
    );
  }

  if (value.primarySubject === null) {
    if (focused.length > 0 || primaryLevel.length > 0) {
      issues.push(
        issue(
          "mismatched-primary-subject",
          "context.primarySubject",
          "primarySubject is null but a primary/focused entry exists",
        ),
      );
    }
  } else if (isPlainObject(value.primarySubject)) {
    const primarySubject = value.primarySubject;
    const match = entries.find(
      (entry) =>
        isPlainObject(entry) &&
        isPlainObject(entry.subject) &&
        entry.subject.subjectId === primarySubject.subjectId &&
        entry.subject.subjectKind === primarySubject.subjectKind &&
        entry.attentionLevel === "primary" &&
        entry.focusRole === "focused",
    );
    if (match === undefined) {
      issues.push(
        issue(
          "mismatched-primary-subject",
          "context.primarySubject",
          "primarySubject must match the sole primary/focused entry",
        ),
      );
    }
  }

  if (issues.length > 0) {
    return emptyBindingResult(issues);
  }

  const context = freezeDirectorRuntimeFocusContext({
    primarySubject: value.primarySubject as DirectorRuntimeAttentionSubjectReference | null,
    entries: entries as DirectorRuntimeFocusContextEntry[],
    suppressedEntries: suppressedEntries as DirectorRuntimeFocusContextEntry[],
  });
  const metadata = buildMetadata(context.entries, context.suppressedEntries);
  return Object.freeze({
    ok: true,
    context,
    boundSubjectCount: metadata.boundSubjectCount,
    suppressedSubjectCount: metadata.suppressedCount,
    metadata,
    issues: Object.freeze([]),
  });
}

export function validateDirectorRuntimeFocusContextBindingInput(
  value: unknown,
): DirectorRuntimeFocusContextBindingResult {
  if (!isPlainObject(value) || !("resolution" in value)) {
    return emptyBindingResult([
      issue("invalid-binding-input", "input", "binding input must include resolution"),
    ]);
  }
  const outcomeValidation = validateDirectorRuntimeAttentionResolutionOutcome(
    value.resolution,
  );
  if (!outcomeValidation.ok) {
    return emptyBindingResult([
      issue(
        "invalid-resolution-outcome",
        "input.resolution",
        "resolution outcome failed DRI-6:3 validation",
      ),
      ...outcomeValidation.issues.map((entry) =>
        issue("invalid-resolution-outcome", entry.path, entry.message)),
    ]);
  }
  return Object.freeze({
    ok: true,
    context: null,
    boundSubjectCount: 0,
    suppressedSubjectCount: 0,
    metadata: DIRECTOR_RUNTIME_EMPTY_FOCUS_CONTEXT_BINDING_METADATA,
    issues: Object.freeze([]),
  });
}

export function validateDirectorRuntimeFocusContextBindingResult(
  value: unknown,
): DirectorRuntimeFocusContextBindingResult {
  if (!isPlainObject(value)) {
    return emptyBindingResult([
      issue("invalid-binding-result", "result", "binding result must be a plain object"),
    ]);
  }
  if (typeof value.ok !== "boolean") {
    return emptyBindingResult([
      issue("invalid-binding-result", "result.ok", "ok must be boolean"),
    ]);
  }
  if (value.ok) {
    if (value.context === null) {
      return emptyBindingResult([
        issue("invalid-binding-result", "result.context", "ok result requires context"),
      ]);
    }
    return validateDirectorRuntimeFocusContext(value.context);
  }
  return Object.freeze({
    ok: true,
    context: null,
    boundSubjectCount: 0,
    suppressedSubjectCount: 0,
    metadata: DIRECTOR_RUNTIME_EMPTY_FOCUS_CONTEXT_BINDING_METADATA,
    issues: Object.freeze([]),
  });
}

export function validateDirectorRuntimeFocusContextBindingPolicy(
  value: unknown,
): DirectorRuntimeFocusContextBindingResult {
  if (!isPlainObject(value)) {
    return emptyBindingResult([
      issue("invalid-binding-policy", "policy", "policy must be a plain object"),
    ]);
  }
  if (!isPlainObject(value.attentionLevelToFocusRole)) {
    return emptyBindingResult([
      issue(
        "invalid-binding-policy",
        "policy.attentionLevelToFocusRole",
        "mapping required",
      ),
    ]);
  }
  for (const level of DIRECTOR_RUNTIME_FOCUS_CONTEXT_ATTENTION_LEVELS) {
    const role = value.attentionLevelToFocusRole[level];
    if (role !== DIRECTOR_RUNTIME_ATTENTION_LEVEL_TO_FOCUS_ROLE[level]) {
      return emptyBindingResult([
        issue(
          "invalid-binding-policy",
          `policy.attentionLevelToFocusRole.${level}`,
          "mapping does not match canonical policy",
        ),
      ]);
    }
  }
  return Object.freeze({
    ok: true,
    context: null,
    boundSubjectCount: 0,
    suppressedSubjectCount: 0,
    metadata: DIRECTOR_RUNTIME_EMPTY_FOCUS_CONTEXT_BINDING_METADATA,
    issues: Object.freeze([]),
  });
}

// ─── Binding ────────────────────────────────────────────────────────────────

function normalizeAssignments(
  assignments: readonly DirectorRuntimeResolvedAttentionAssignment[],
): {
  readonly assignments: readonly DirectorRuntimeResolvedAttentionAssignment[];
  readonly issues: readonly DirectorRuntimeFocusContextBindingIssue[];
} {
  const issues: DirectorRuntimeFocusContextBindingIssue[] = [];
  const bySubject = new Map<string, DirectorRuntimeResolvedAttentionAssignment>();
  const order: string[] = [];

  assignments.forEach((assignment, index) => {
    const assignmentValidation = validateDirectorRuntimeResolvedAttentionAssignment(
      assignment,
    );
    if (!assignmentValidation.ok) {
      issues.push(
        issue(
          "invalid-resolution-outcome",
          `resolution.assignments[${index}]`,
          "assignment failed DRI-6:3 validation",
        ),
      );
      return;
    }
    const key = subjectKey(assignment.subject);
    const existing = bySubject.get(key);
    if (existing === undefined) {
      bySubject.set(key, assignment);
      order.push(key);
      return;
    }
    if (existing.resolvedLevel !== assignment.resolvedLevel) {
      issues.push(
        issue(
          "duplicate-subject",
          `resolution.assignments[${index}]`,
          "duplicate subject with conflicting resolved levels",
        ),
      );
      return;
    }
    const mergedSignals = Object.freeze([
      ...new Set([
        ...existing.contributingSignalIds,
        ...assignment.contributingSignalIds,
      ]),
    ]);
    bySubject.set(key, Object.freeze({
      ...existing,
      contributingSignalIds: mergedSignals,
    }));
  });

  return {
    assignments: Object.freeze(order.map((key) => bySubject.get(key)!)),
    issues: Object.freeze(issues),
  };
}

export function bindDirectorRuntimeFocusContext(
  input: DirectorRuntimeFocusContextBindingInput | DirectorRuntimeAttentionResolutionOutcome,
): DirectorRuntimeFocusContextBindingResult {
  const bindingInput: DirectorRuntimeFocusContextBindingInput = isPlainObject(input) &&
      "resolution" in input
    ? { resolution: (input as DirectorRuntimeFocusContextBindingInput).resolution }
    : { resolution: input as DirectorRuntimeAttentionResolutionOutcome };

  const inputValidation = validateDirectorRuntimeFocusContextBindingInput(bindingInput);
  if (!inputValidation.ok) {
    return inputValidation;
  }

  const resolution = bindingInput.resolution;
  if (resolution.assignments.length === 0) {
    return Object.freeze({
      ok: true,
      context: DIRECTOR_RUNTIME_EMPTY_FOCUS_CONTEXT,
      boundSubjectCount: 0,
      suppressedSubjectCount: 0,
      metadata: DIRECTOR_RUNTIME_EMPTY_FOCUS_CONTEXT_BINDING_METADATA,
      issues: Object.freeze([]),
    });
  }

  const normalized = normalizeAssignments(resolution.assignments);
  if (normalized.issues.length > 0) {
    return emptyBindingResult(normalized.issues);
  }

  const primaryCount = normalized.assignments.filter(
    (assignment) => assignment.resolvedLevel === "primary",
  ).length;
  if (primaryCount > 1) {
    return emptyBindingResult([
      issue(
        "multiple-primary-subjects",
        "resolution.assignments",
        "resolution contains multiple primary assignments",
      ),
    ]);
  }

  if (resolution.primary !== null) {
    const primaryValidation = validateDirectorRuntimeResolvedAttentionAssignment(
      resolution.primary,
    );
    if (!primaryValidation.ok || resolution.primary.resolvedLevel !== "primary") {
      return emptyBindingResult([
        issue(
          "invalid-resolution-outcome",
          "resolution.primary",
          "primary assignment invalid",
        ),
      ]);
    }
    const match = normalized.assignments.find((assignment) =>
      areDirectorRuntimeAttentionSubjectsEqual(
        assignment.subject,
        resolution.primary!.subject,
      ) && assignment.resolvedLevel === "primary");
    if (match === undefined) {
      return emptyBindingResult([
        issue(
          "mismatched-primary-subject",
          "resolution.primary",
          "primary assignment does not match a primary subject in assignments",
        ),
      ]);
    }
  } else if (primaryCount === 1) {
    return emptyBindingResult([
      issue(
        "mismatched-primary-subject",
        "resolution.primary",
        "assignments contain primary but resolution.primary is null",
      ),
    ]);
  }

  const indexed = normalized.assignments.map((assignment, index) => ({
    assignment,
    index,
  }));
  indexed.sort((left, right) => {
    const levelDelta = levelOrderRank(left.assignment.resolvedLevel) -
      levelOrderRank(right.assignment.resolvedLevel);
    if (levelDelta !== 0) return levelDelta;
    return left.index - right.index;
  });

  const activeEntries: DirectorRuntimeFocusContextEntry[] = [];
  const suppressedEntries: DirectorRuntimeFocusContextEntry[] = [];

  for (const { assignment } of indexed) {
    const entry = bindDirectorRuntimeFocusContextEntry(assignment);
    if (entry.attentionLevel === "suppressed") {
      suppressedEntries.push(entry);
    } else {
      activeEntries.push(entry);
    }
  }

  const primarySubject = resolution.primary === null
    ? null
    : freezeSubject(resolution.primary.subject);

  const context = freezeDirectorRuntimeFocusContext({
    primarySubject,
    entries: activeEntries,
    suppressedEntries,
  });

  const contextValidation = validateDirectorRuntimeFocusContext(context);
  if (!contextValidation.ok) {
    return contextValidation;
  }

  const metadata = buildMetadata(context.entries, context.suppressedEntries);
  return Object.freeze({
    ok: true,
    context,
    boundSubjectCount: metadata.boundSubjectCount,
    suppressedSubjectCount: metadata.suppressedCount,
    metadata,
    issues: Object.freeze([]),
  });
}

// ─── Lookup / filtering ─────────────────────────────────────────────────────

export function findDirectorRuntimeFocusContextEntryBySubject(
  context: DirectorRuntimeFocusContext,
  subject: DirectorRuntimeAttentionSubjectReference,
): DirectorRuntimeFocusContextEntry | null {
  const fromEntries = context.entries.find((entry) =>
    areDirectorRuntimeAttentionSubjectsEqual(entry.subject, subject));
  if (fromEntries !== undefined) return fromEntries;
  const fromSuppressed = context.suppressedEntries.find((entry) =>
    areDirectorRuntimeAttentionSubjectsEqual(entry.subject, subject));
  return fromSuppressed ?? null;
}

export function getDirectorRuntimePrimaryFocusEntry(
  context: DirectorRuntimeFocusContext,
): DirectorRuntimeFocusContextEntry | null {
  if (context.primarySubject === null) return null;
  const entry = findDirectorRuntimeFocusContextEntryBySubject(
    context,
    context.primarySubject,
  );
  if (
    entry === null ||
    entry.attentionLevel !== "primary" ||
    entry.focusRole !== "focused"
  ) {
    return null;
  }
  return entry;
}

export function filterDirectorRuntimeFocusContextEntriesByRole(
  context: DirectorRuntimeFocusContext,
  role: DirectorRuntimeFocusRole,
): readonly DirectorRuntimeFocusContextEntry[] {
  if (role === "none") {
    return Object.freeze([...context.suppressedEntries]);
  }
  return Object.freeze(
    context.entries.filter((entry) => entry.focusRole === role),
  );
}

export function filterDirectorRuntimeFocusContextEntriesByLevel(
  context: DirectorRuntimeFocusContext,
  level: DirectorRuntimeAttentionFocusLevel,
): readonly DirectorRuntimeFocusContextEntry[] {
  if (level === "suppressed") {
    return Object.freeze([...context.suppressedEntries]);
  }
  return Object.freeze(
    context.entries.filter((entry) => entry.attentionLevel === level),
  );
}

export function areDirectorRuntimeFocusContextsEquivalent(
  left: DirectorRuntimeFocusContext,
  right: DirectorRuntimeFocusContext,
): boolean {
  const serializeEntry = (entry: DirectorRuntimeFocusContextEntry) =>
    Object.freeze({
      subjectId: entry.subject.subjectId,
      subjectKind: entry.subject.subjectKind,
      attentionLevel: entry.attentionLevel,
      focusRole: entry.focusRole,
      sourceAssignmentId: entry.sourceAssignmentId,
      contributingSignalIds: [...entry.contributingSignalIds],
    });
  const serialize = (context: DirectorRuntimeFocusContext) =>
    JSON.stringify({
      primarySubject: context.primarySubject === null
        ? null
        : {
          subjectId: context.primarySubject.subjectId,
          subjectKind: context.primarySubject.subjectKind,
        },
      entries: context.entries.map(serializeEntry),
      suppressedEntries: context.suppressedEntries.map(serializeEntry),
    });
  return serialize(left) === serialize(right);
}

// ─── Registry / capabilities ────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_FOCUS_CONTEXT_BINDING_CAPABILITIES = Object.freeze([
  "FocusContextBinding",
  "AttentionLevelRoleMapping",
  "PrimarySubjectBinding",
  "SecondarySubjectBinding",
  "ContextualSubjectBinding",
  "PeripheralSubjectBinding",
  "SuppressionBinding",
  "SignalTracePreservation",
  "ContextValidation",
  "SubjectLookup",
] as const);

export const DIRECTOR_RUNTIME_FOCUS_CONTEXT_BINDING_ABSENT_CAPABILITIES =
  Object.freeze([
    "PriorityResolution",
    "ContextDiscovery",
    "PathOrchestration",
    "TransitionOrchestration",
    "PresentationBehavior",
  ] as const);

export const DIRECTOR_RUNTIME_FOCUS_CONTEXT_BINDING_INVARIANTS = Object.freeze([
  Object.freeze({ id: "determinism", statement: "identical resolution input yields identical focus context" }),
  Object.freeze({ id: "single-primary", statement: "context contains at most one focused primary subject" }),
  Object.freeze({ id: "primary-identity-consistency", statement: "primarySubject matches the sole primary/focused entry" }),
  Object.freeze({ id: "level-role-mapping", statement: "every attention level maps to the canonical focus role" }),
  Object.freeze({ id: "suppression-integrity", statement: "suppressed subjects remain represented and identifiable" }),
  Object.freeze({ id: "stable-order", statement: "entry ordering preserves upstream semantic order" }),
  Object.freeze({ id: "one-entry-per-subject", statement: "no duplicate canonical subject entries" }),
  Object.freeze({ id: "signal-trace-preservation", statement: "contributing signal IDs survive binding" }),
  Object.freeze({ id: "input-immutability", statement: "resolution input is never mutated" }),
  Object.freeze({ id: "output-immutability", statement: "returned context structures are immutable" }),
  Object.freeze({ id: "no-re-resolution", statement: "no priority comparison occurs during binding" }),
  Object.freeze({ id: "no-context-discovery", statement: "no new related subjects are invented" }),
  Object.freeze({ id: "no-graph-path-behavior", statement: "no graph traversal or path generation occurs" }),
  Object.freeze({ id: "no-transition-behavior", statement: "no previous/next focus semantics are introduced" }),
  Object.freeze({ id: "no-presentation-leakage", statement: "no renderer-specific fields exist" }),
] as const);

export const directorRuntimeFocusContextBindingApiNames = Object.freeze([
  "mapDirectorRuntimeAttentionLevelToFocusRole",
  "bindDirectorRuntimeFocusContextEntry",
  "bindDirectorRuntimeFocusContext",
  "validateDirectorRuntimeFocusContextEntry",
  "validateDirectorRuntimeFocusContext",
  "validateDirectorRuntimeFocusContextBindingInput",
  "validateDirectorRuntimeFocusContextBindingResult",
  "validateDirectorRuntimeFocusContextBindingPolicy",
  "findDirectorRuntimeFocusContextEntryBySubject",
  "getDirectorRuntimePrimaryFocusEntry",
  "filterDirectorRuntimeFocusContextEntriesByRole",
  "filterDirectorRuntimeFocusContextEntriesByLevel",
  "areDirectorRuntimeFocusContextsEquivalent",
  "areDirectorRuntimeAttentionSubjectsEqual",
  "verifyDirectorRuntimeFocusContextBinding",
] as const);

export const directorRuntimeFocusContextBindingPolicy = Object.freeze({
  attentionLevelToFocusRole: DIRECTOR_RUNTIME_ATTENTION_LEVEL_TO_FOCUS_ROLE,
  primaryBindingRule: "resolution-primary-to-focused" as const,
  suppressionBindingRule: "suppressed-to-none-in-suppressedEntries" as const,
  entryOrderingRule: "level-then-upstream-stable-order" as const,
  duplicateSubjectHandling: "first-wins-merge-matching-signal-ids" as const,
  preservesResolvedLevels: true as const,
  discoversRelatedSubjects: false as const,
  performsPriorityResolution: false as const,
});

export const directorRuntimeFocusContextBindingRegistry = Object.freeze({
  identity: directorRuntimeFocusContextBindingIdentity,
  version: directorRuntimeFocusContextBindingVersion,
  namespace: directorRuntimeFocusContextBindingNamespace,
  dependency: directorRuntimeFocusContextBindingUpstream,
  attentionLevelToFocusRole: DIRECTOR_RUNTIME_ATTENTION_LEVEL_TO_FOCUS_ROLE,
  levelToRoleMappingCount: DIRECTOR_RUNTIME_FOCUS_CONTEXT_ATTENTION_LEVELS.length,
  focusRoles: DIRECTOR_RUNTIME_FOCUS_CONTEXT_ROLES,
  entryOrder: DIRECTOR_RUNTIME_FOCUS_CONTEXT_ENTRY_ORDER,
  policy: directorRuntimeFocusContextBindingPolicy,
  capabilities: DIRECTOR_RUNTIME_FOCUS_CONTEXT_BINDING_CAPABILITIES,
  capabilityCount: DIRECTOR_RUNTIME_FOCUS_CONTEXT_BINDING_CAPABILITIES.length,
  absentCapabilities: DIRECTOR_RUNTIME_FOCUS_CONTEXT_BINDING_ABSENT_CAPABILITIES,
  emptyContext: DIRECTOR_RUNTIME_EMPTY_FOCUS_CONTEXT,
  emptyResolution: DIRECTOR_RUNTIME_EMPTY_ATTENTION_RESOLUTION_OUTCOME,
  invariants: DIRECTOR_RUNTIME_FOCUS_CONTEXT_BINDING_INVARIANTS,
  invariantCount: DIRECTOR_RUNTIME_FOCUS_CONTEXT_BINDING_INVARIANTS.length,
  publicApis: directorRuntimeFocusContextBindingApiNames,
  publicApiCount: directorRuntimeFocusContextBindingApiNames.length,
});

export const directorRuntimeFocusContextBinding = Object.freeze({
  phase: "DRI-6:4" as const,
  name: "DirectorRuntimeFocusContextBinding" as const,
  identity: directorRuntimeFocusContextBindingIdentity,
  namespace: directorRuntimeFocusContextBindingNamespace,
  version: directorRuntimeFocusContextBindingVersion,
  layer: "Director Runtime Integration" as const,
  domain: "AttentionFocusOrchestration" as const,
  role: "FocusContextBinding" as const,
  stage: "FocusContextBinding" as const,
  status: "FocusContextBindingReady" as const,
  upstreamDependency: directorRuntimeFocusContextBindingUpstream,
  deterministic: true as const,
  rendererIndependent: true as const,
  philosophy: "binding-not-discovery" as const,
  policy: directorRuntimeFocusContextBindingPolicy,
  capabilities: DIRECTOR_RUNTIME_FOCUS_CONTEXT_BINDING_CAPABILITIES,
  absentCapabilities: DIRECTOR_RUNTIME_FOCUS_CONTEXT_BINDING_ABSENT_CAPABILITIES,
  emptyContext: DIRECTOR_RUNTIME_EMPTY_FOCUS_CONTEXT,
  invariants: DIRECTOR_RUNTIME_FOCUS_CONTEXT_BINDING_INVARIANTS,
  publicApiSurface: directorRuntimeFocusContextBindingApiNames,
  registry: directorRuntimeFocusContextBindingRegistry,
  priorityResolutionBoundary: "DRI-6:3-attention-priority-resolution-only" as const,
  architecturalStatus:
    "Established · Deterministic · Immutable · Traceable · FocusContextBindingReady" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface DirectorRuntimeFocusContextBindingVerification {
  readonly ok: boolean;
  readonly identity: typeof directorRuntimeFocusContextBindingIdentity;
  readonly version: typeof directorRuntimeFocusContextBindingVersion;
  readonly namespace: typeof directorRuntimeFocusContextBindingNamespace;
  readonly dependency: typeof directorRuntimeFocusContextBindingUpstream;
  readonly levelToRoleMappingCount: number;
  readonly capabilityCount: number;
  readonly invariantCount: number;
  readonly frozen: boolean;
}

export function verifyDirectorRuntimeFocusContextBinding():
  DirectorRuntimeFocusContextBindingVerification {
  const layer = directorRuntimeFocusContextBinding;
  const registry = directorRuntimeFocusContextBindingRegistry;
  const mapping = DIRECTOR_RUNTIME_ATTENTION_LEVEL_TO_FOCUS_ROLE;

  const ok =
    layer.identity === "DRI-6:4/DirectorRuntimeFocusContextBinding" &&
    layer.version === "6.4.0" &&
    layer.namespace === "nexora.dri.attention-focus.context-binding" &&
    layer.role === "FocusContextBinding" &&
    layer.status === "FocusContextBindingReady" &&
    layer.upstreamDependency ===
      "DRI-6:3/DirectorRuntimeAttentionPriorityResolution" &&
    layer.upstreamDependency === directorRuntimeAttentionPriorityResolutionIdentity &&
    registry.dependency === layer.upstreamDependency &&
    mapping.primary === "focused" &&
    mapping.secondary === "supporting" &&
    mapping.context === "contextual" &&
    mapping.background === "peripheral" &&
    mapping.suppressed === "none" &&
    DIRECTOR_RUNTIME_FOCUS_CONTEXT_ATTENTION_LEVELS.length === 5 &&
    DIRECTOR_RUNTIME_FOCUS_CONTEXT_ROLES.length === 5 &&
    !DIRECTOR_RUNTIME_FOCUS_CONTEXT_BINDING_CAPABILITIES.includes(
      "PathOrchestration" as never,
    ) &&
    !DIRECTOR_RUNTIME_FOCUS_CONTEXT_BINDING_CAPABILITIES.includes(
      "PriorityResolution" as never,
    ) &&
    layer.policy.discoversRelatedSubjects === false &&
    layer.policy.performsPriorityResolution === false &&
    Object.isFrozen(layer) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(directorRuntimeFocusContextBindingPolicy) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EMPTY_FOCUS_CONTEXT) &&
    Object.isFrozen(DIRECTOR_RUNTIME_ATTENTION_LEVEL_TO_FOCUS_ROLE);

  return Object.freeze({
    ok,
    identity: directorRuntimeFocusContextBindingIdentity,
    version: directorRuntimeFocusContextBindingVersion,
    namespace: directorRuntimeFocusContextBindingNamespace,
    dependency: directorRuntimeFocusContextBindingUpstream,
    levelToRoleMappingCount: DIRECTOR_RUNTIME_FOCUS_CONTEXT_ATTENTION_LEVELS.length,
    capabilityCount: DIRECTOR_RUNTIME_FOCUS_CONTEXT_BINDING_CAPABILITIES.length,
    invariantCount: DIRECTOR_RUNTIME_FOCUS_CONTEXT_BINDING_INVARIANTS.length,
    frozen: Object.isFrozen(layer) && Object.isFrozen(registry),
  });
}
