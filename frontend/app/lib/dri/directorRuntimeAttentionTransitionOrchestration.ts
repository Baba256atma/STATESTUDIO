/**
 * DRI-6:6 — Director Runtime Attention Transition Orchestration.
 *
 * Compares previous and next semantic attention/focus/path states and produces
 * immutable transition plans. No animation, timing, presentation, or
 * recalculation of priority / focus / paths.
 */

import {
  DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_RESULT,
  DIRECTOR_RUNTIME_EMPTY_FOCUS_CONTEXT,
  areDirectorRuntimeAttentionPathsEquivalent,
  areDirectorRuntimeAttentionSubjectsEqual,
  directorRuntimeAttentionPathOrchestrationIdentity,
  validateDirectorRuntimeAttentionPathOrchestrationResult,
  validateDirectorRuntimeFocusContext,
  type DirectorRuntimeAttentionFocusLevel,
  type DirectorRuntimeAttentionPath,
  type DirectorRuntimeAttentionPathOrchestrationResult,
  type DirectorRuntimeAttentionSubjectReference,
  type DirectorRuntimeFocusContext,
  type DirectorRuntimeFocusRole,
} from "@/app/lib/dri/directorRuntimeAttentionPathOrchestration";

export type {
  DirectorRuntimeAttentionFocusLevel,
  DirectorRuntimeAttentionPath,
  DirectorRuntimeAttentionPathOrchestrationResult,
  DirectorRuntimeAttentionRelationship,
  DirectorRuntimeAttentionResolutionOutcome,
  DirectorRuntimeAttentionSignal,
  DirectorRuntimeAttentionSignalBatch,
  DirectorRuntimeAttentionSubjectReference,
  DirectorRuntimeFocusContext,
  DirectorRuntimeFocusContextEntry,
  DirectorRuntimeFocusRole,
  DirectorRuntimeResolvedAttentionAssignment,
} from "@/app/lib/dri/directorRuntimeAttentionPathOrchestration";

export {
  DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_RESULT,
  DIRECTOR_RUNTIME_EMPTY_ATTENTION_RESOLUTION_OUTCOME,
  DIRECTOR_RUNTIME_EMPTY_ATTENTION_SIGNAL_BATCH,
  DIRECTOR_RUNTIME_EMPTY_FOCUS_CONTEXT,
  areDirectorRuntimeAttentionPathsEquivalent,
  areDirectorRuntimeAttentionSubjectsEqual,
  bindDirectorRuntimeFocusContext,
  createDirectorRuntimeAttentionRelationship,
  createDirectorRuntimeAttentionSignal,
  createDirectorRuntimeAttentionSignalBatch,
  orchestrateDirectorRuntimeAttentionPaths,
  resolveDirectorRuntimeAttentionPriority,
  validateDirectorRuntimeAttentionPathOrchestrationResult,
  validateDirectorRuntimeAttentionRelationship,
  validateDirectorRuntimeAttentionResolutionOutcome,
  validateDirectorRuntimeAttentionSignalBatch,
  validateDirectorRuntimeFocusContext,
} from "@/app/lib/dri/directorRuntimeAttentionPathOrchestration";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeAttentionTransitionOrchestrationIdentity =
  "DRI-6:6/DirectorRuntimeAttentionTransitionOrchestration" as const;
export const directorRuntimeAttentionTransitionOrchestrationVersion =
  "6.6.0" as const;
export const directorRuntimeAttentionTransitionOrchestrationNamespace =
  "nexora.dri.attention-focus.transition-orchestration" as const;
export const directorRuntimeAttentionTransitionOrchestrationUpstream =
  directorRuntimeAttentionPathOrchestrationIdentity;

export const directorRuntimeAttentionTransitionOrchestrationCanonicalIdentity =
  Object.freeze({
    identity: directorRuntimeAttentionTransitionOrchestrationIdentity,
    version: directorRuntimeAttentionTransitionOrchestrationVersion,
    namespace: directorRuntimeAttentionTransitionOrchestrationNamespace,
    upstream: directorRuntimeAttentionTransitionOrchestrationUpstream,
  });

// ─── Vocabularies ───────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ATTENTION_TRANSITION_KINDS = Object.freeze([
  "no-change",
  "focus-shift",
  "focus-retain",
  "focus-release",
  "context-expansion",
  "context-reduction",
  "path-shift",
  "path-expansion",
  "path-reduction",
  "suppression-change",
] as const);
export type DirectorRuntimeAttentionTransitionKind =
  (typeof DIRECTOR_RUNTIME_ATTENTION_TRANSITION_KINDS)[number];

export const DIRECTOR_RUNTIME_ATTENTION_SUBJECT_TRANSITION_KINDS = Object.freeze([
  "enter",
  "retain",
  "promote",
  "demote",
  "suppress",
  "unsuppress",
  "exit",
] as const);
export type DirectorRuntimeAttentionSubjectTransitionKind =
  (typeof DIRECTOR_RUNTIME_ATTENTION_SUBJECT_TRANSITION_KINDS)[number];

export const DIRECTOR_RUNTIME_ATTENTION_PATH_TRANSITION_KINDS = Object.freeze([
  "activate",
  "retain",
  "replace",
  "retire",
] as const);
export type DirectorRuntimeAttentionPathTransitionKind =
  (typeof DIRECTOR_RUNTIME_ATTENTION_PATH_TRANSITION_KINDS)[number];

export const DIRECTOR_RUNTIME_ATTENTION_TRANSITION_PHASES = Object.freeze([
  "release",
  "handoff",
  "acquire",
  "stabilize",
] as const);
export type DirectorRuntimeAttentionTransitionPhase =
  (typeof DIRECTOR_RUNTIME_ATTENTION_TRANSITION_PHASES)[number];

/** Lower index = higher executive prominence. Suppressed handled separately. */
export const DIRECTOR_RUNTIME_ATTENTION_PROMINENCE_ORDER = Object.freeze([
  "primary",
  "secondary",
  "context",
  "background",
] as const satisfies readonly DirectorRuntimeAttentionFocusLevel[]);

/**
 * Subject transition order:
 * 1. previous primary
 * 2. next primary if distinct
 * 3. remaining previous-state subjects in previous stable order
 * 4. newly entered next-state subjects in next stable order
 */
export const DIRECTOR_RUNTIME_ATTENTION_SUBJECT_TRANSITION_ORDERING_POLICY =
  "previous-primary-then-next-primary-then-previous-stable-then-next-enter" as const;

/**
 * Path transition order:
 * retained/replaced in previous order, then retired in previous order,
 * then activated in next order.
 */
export const DIRECTOR_RUNTIME_ATTENTION_PATH_TRANSITION_ORDERING_POLICY =
  "retain-replace-previous-order-then-retire-then-activate-next-order" as const;

/** Path replace when same root + endpoint, different ordered structure. */
export const DIRECTOR_RUNTIME_ATTENTION_PATH_REPLACE_POLICY =
  "same-root-and-endpoint-different-structure" as const;

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface DirectorRuntimeAttentionTransitionState {
  readonly focusContext: DirectorRuntimeFocusContext;
  readonly pathResult: DirectorRuntimeAttentionPathOrchestrationResult;
}

export interface DirectorRuntimeAttentionTransitionInput {
  readonly previous: DirectorRuntimeAttentionTransitionState;
  readonly next: DirectorRuntimeAttentionTransitionState;
}

export interface DirectorRuntimeFocusTransition {
  readonly previousPrimary: DirectorRuntimeAttentionSubjectReference | null;
  readonly nextPrimary: DirectorRuntimeAttentionSubjectReference | null;
  readonly kind: DirectorRuntimeAttentionTransitionKind;
}

export interface DirectorRuntimeAttentionSubjectTransition {
  readonly subject: DirectorRuntimeAttentionSubjectReference;
  readonly previousLevel: DirectorRuntimeAttentionFocusLevel | null;
  readonly nextLevel: DirectorRuntimeAttentionFocusLevel | null;
  readonly previousRole: DirectorRuntimeFocusRole | null;
  readonly nextRole: DirectorRuntimeFocusRole | null;
  readonly kind: DirectorRuntimeAttentionSubjectTransitionKind;
}

export interface DirectorRuntimeAttentionPathTransition {
  readonly previousPathId: string | null;
  readonly nextPathId: string | null;
  readonly kind: DirectorRuntimeAttentionPathTransitionKind;
}

export interface DirectorRuntimeAttentionTransitionExplanation {
  readonly previousPrimary: DirectorRuntimeAttentionSubjectReference | null;
  readonly nextPrimary: DirectorRuntimeAttentionSubjectReference | null;
  readonly enteredSubjectIds: readonly string[];
  readonly retainedSubjectIds: readonly string[];
  readonly promotedSubjectIds: readonly string[];
  readonly demotedSubjectIds: readonly string[];
  readonly suppressedSubjectIds: readonly string[];
  readonly unsuppressedSubjectIds: readonly string[];
  readonly exitedSubjectIds: readonly string[];
  readonly activatedPathIds: readonly string[];
  readonly retainedPathIds: readonly string[];
  readonly retiredPathIds: readonly string[];
  readonly replacedPathIds: readonly string[];
}

export interface DirectorRuntimeAttentionTransitionPlan {
  readonly transitionKinds: readonly DirectorRuntimeAttentionTransitionKind[];
  readonly focusTransition: DirectorRuntimeFocusTransition;
  readonly subjectTransitions: readonly DirectorRuntimeAttentionSubjectTransition[];
  readonly pathTransitions: readonly DirectorRuntimeAttentionPathTransition[];
  readonly phases: readonly DirectorRuntimeAttentionTransitionPhase[];
  readonly explanation: DirectorRuntimeAttentionTransitionExplanation;
  readonly subjectTransitionCount: number;
  readonly pathTransitionCount: number;
}

export const DIRECTOR_RUNTIME_ATTENTION_TRANSITION_ORCHESTRATION_ISSUE_CODES =
  Object.freeze([
    "invalid-transition-kind",
    "invalid-subject-transition-kind",
    "invalid-path-transition-kind",
    "invalid-transition-phase",
    "invalid-transition-state",
    "invalid-transition-input",
    "invalid-focus-transition",
    "invalid-subject-transition",
    "invalid-path-transition",
    "invalid-transition-plan",
    "invalid-transition-policy",
    "contradictory-transition",
    "no-change-exclusivity-violation",
  ] as const);
export type DirectorRuntimeAttentionTransitionOrchestrationIssueCode =
  (typeof DIRECTOR_RUNTIME_ATTENTION_TRANSITION_ORCHESTRATION_ISSUE_CODES)[number];

export interface DirectorRuntimeAttentionTransitionOrchestrationIssue {
  readonly code: DirectorRuntimeAttentionTransitionOrchestrationIssueCode;
  readonly path: string;
  readonly message: string;
}

export interface DirectorRuntimeAttentionTransitionOrchestrationResult {
  readonly ok: boolean;
  readonly plan: DirectorRuntimeAttentionTransitionPlan | null;
  readonly issues: readonly DirectorRuntimeAttentionTransitionOrchestrationIssue[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function issue(
  code: DirectorRuntimeAttentionTransitionOrchestrationIssueCode,
  path: string,
  message: string,
): DirectorRuntimeAttentionTransitionOrchestrationIssue {
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

function failure(
  issues: readonly DirectorRuntimeAttentionTransitionOrchestrationIssue[],
): DirectorRuntimeAttentionTransitionOrchestrationResult {
  return Object.freeze({
    ok: false,
    plan: null,
    issues: Object.freeze([...issues]),
  });
}

function isTransitionKind(
  value: unknown,
): value is DirectorRuntimeAttentionTransitionKind {
  return (DIRECTOR_RUNTIME_ATTENTION_TRANSITION_KINDS as readonly unknown[])
    .includes(value);
}

function isSubjectTransitionKind(
  value: unknown,
): value is DirectorRuntimeAttentionSubjectTransitionKind {
  return (DIRECTOR_RUNTIME_ATTENTION_SUBJECT_TRANSITION_KINDS as readonly unknown[])
    .includes(value);
}

function isPathTransitionKind(
  value: unknown,
): value is DirectorRuntimeAttentionPathTransitionKind {
  return (DIRECTOR_RUNTIME_ATTENTION_PATH_TRANSITION_KINDS as readonly unknown[])
    .includes(value);
}

function isPhase(
  value: unknown,
): value is DirectorRuntimeAttentionTransitionPhase {
  return (DIRECTOR_RUNTIME_ATTENTION_TRANSITION_PHASES as readonly unknown[])
    .includes(value);
}

function isAttentionLevel(
  value: unknown,
): value is DirectorRuntimeAttentionFocusLevel {
  return value === "primary" ||
    value === "secondary" ||
    value === "context" ||
    value === "background" ||
    value === "suppressed";
}

function isFocusRole(value: unknown): value is DirectorRuntimeFocusRole {
  return value === "focused" ||
    value === "supporting" ||
    value === "contextual" ||
    value === "peripheral" ||
    value === "none";
}

function prominenceRank(level: DirectorRuntimeAttentionFocusLevel): number {
  if (level === "suppressed") return Number.MAX_SAFE_INTEGER;
  const index = DIRECTOR_RUNTIME_ATTENTION_PROMINENCE_ORDER.indexOf(
    level as (typeof DIRECTOR_RUNTIME_ATTENTION_PROMINENCE_ORDER)[number],
  );
  return index === -1 ? Number.MAX_SAFE_INTEGER - 1 : index;
}

interface SubjectSnapshot {
  readonly subject: DirectorRuntimeAttentionSubjectReference;
  readonly level: DirectorRuntimeAttentionFocusLevel;
  readonly role: DirectorRuntimeFocusRole;
  readonly suppressed: boolean;
  readonly orderIndex: number;
}

function collectSubjectSnapshots(
  context: DirectorRuntimeFocusContext,
): Map<string, SubjectSnapshot> {
  const map = new Map<string, SubjectSnapshot>();
  let orderIndex = 0;
  for (const entry of context.entries) {
    map.set(subjectKey(entry.subject), Object.freeze({
      subject: freezeSubject(entry.subject),
      level: entry.attentionLevel,
      role: entry.focusRole,
      suppressed: false,
      orderIndex: orderIndex++,
    }));
  }
  for (const entry of context.suppressedEntries) {
    const key = subjectKey(entry.subject);
    if (map.has(key)) continue;
    map.set(key, Object.freeze({
      subject: freezeSubject(entry.subject),
      level: entry.attentionLevel,
      role: entry.focusRole,
      suppressed: true,
      orderIndex: orderIndex++,
    }));
  }
  return map;
}

function freezeFocusTransition(
  transition: DirectorRuntimeFocusTransition,
): DirectorRuntimeFocusTransition {
  return Object.freeze({
    previousPrimary: transition.previousPrimary === null
      ? null
      : freezeSubject(transition.previousPrimary),
    nextPrimary: transition.nextPrimary === null
      ? null
      : freezeSubject(transition.nextPrimary),
    kind: transition.kind,
  });
}

function freezeSubjectTransition(
  transition: DirectorRuntimeAttentionSubjectTransition,
): DirectorRuntimeAttentionSubjectTransition {
  return Object.freeze({
    subject: freezeSubject(transition.subject),
    previousLevel: transition.previousLevel,
    nextLevel: transition.nextLevel,
    previousRole: transition.previousRole,
    nextRole: transition.nextRole,
    kind: transition.kind,
  });
}

function freezePathTransition(
  transition: DirectorRuntimeAttentionPathTransition,
): DirectorRuntimeAttentionPathTransition {
  return Object.freeze({ ...transition });
}

function freezeExplanation(
  explanation: DirectorRuntimeAttentionTransitionExplanation,
): DirectorRuntimeAttentionTransitionExplanation {
  return Object.freeze({
    previousPrimary: explanation.previousPrimary === null
      ? null
      : freezeSubject(explanation.previousPrimary),
    nextPrimary: explanation.nextPrimary === null
      ? null
      : freezeSubject(explanation.nextPrimary),
    enteredSubjectIds: Object.freeze([...explanation.enteredSubjectIds]),
    retainedSubjectIds: Object.freeze([...explanation.retainedSubjectIds]),
    promotedSubjectIds: Object.freeze([...explanation.promotedSubjectIds]),
    demotedSubjectIds: Object.freeze([...explanation.demotedSubjectIds]),
    suppressedSubjectIds: Object.freeze([...explanation.suppressedSubjectIds]),
    unsuppressedSubjectIds: Object.freeze([...explanation.unsuppressedSubjectIds]),
    exitedSubjectIds: Object.freeze([...explanation.exitedSubjectIds]),
    activatedPathIds: Object.freeze([...explanation.activatedPathIds]),
    retainedPathIds: Object.freeze([...explanation.retainedPathIds]),
    retiredPathIds: Object.freeze([...explanation.retiredPathIds]),
    replacedPathIds: Object.freeze([...explanation.replacedPathIds]),
  });
}

function freezePlan(
  plan: DirectorRuntimeAttentionTransitionPlan,
): DirectorRuntimeAttentionTransitionPlan {
  return Object.freeze({
    transitionKinds: Object.freeze([...plan.transitionKinds]),
    focusTransition: freezeFocusTransition(plan.focusTransition),
    subjectTransitions: Object.freeze(
      plan.subjectTransitions.map((entry) => freezeSubjectTransition(entry)),
    ),
    pathTransitions: Object.freeze(
      plan.pathTransitions.map((entry) => freezePathTransition(entry)),
    ),
    phases: Object.freeze([...plan.phases]),
    explanation: freezeExplanation(plan.explanation),
    subjectTransitionCount: plan.subjectTransitions.length,
    pathTransitionCount: plan.pathTransitions.length,
  });
}

function idsForKind(
  transitions: readonly DirectorRuntimeAttentionSubjectTransition[],
  kind: DirectorRuntimeAttentionSubjectTransitionKind,
): readonly string[] {
  return Object.freeze(
    transitions
      .filter((entry) => entry.kind === kind)
      .map((entry) => entry.subject.subjectId),
  );
}

// ─── Canonical empty / no-change ────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EMPTY_ATTENTION_TRANSITION_STATE = Object.freeze({
  focusContext: DIRECTOR_RUNTIME_EMPTY_FOCUS_CONTEXT,
  pathResult: DIRECTOR_RUNTIME_EMPTY_ATTENTION_PATH_RESULT,
}) satisfies DirectorRuntimeAttentionTransitionState;

const EMPTY_EXPLANATION = Object.freeze({
  previousPrimary: null,
  nextPrimary: null,
  enteredSubjectIds: Object.freeze([]) as readonly string[],
  retainedSubjectIds: Object.freeze([]) as readonly string[],
  promotedSubjectIds: Object.freeze([]) as readonly string[],
  demotedSubjectIds: Object.freeze([]) as readonly string[],
  suppressedSubjectIds: Object.freeze([]) as readonly string[],
  unsuppressedSubjectIds: Object.freeze([]) as readonly string[],
  exitedSubjectIds: Object.freeze([]) as readonly string[],
  activatedPathIds: Object.freeze([]) as readonly string[],
  retainedPathIds: Object.freeze([]) as readonly string[],
  retiredPathIds: Object.freeze([]) as readonly string[],
  replacedPathIds: Object.freeze([]) as readonly string[],
}) satisfies DirectorRuntimeAttentionTransitionExplanation;

export const DIRECTOR_RUNTIME_NO_CHANGE_ATTENTION_TRANSITION_PLAN = Object.freeze({
  transitionKinds: Object.freeze(["no-change"] as const),
  focusTransition: Object.freeze({
    previousPrimary: null,
    nextPrimary: null,
    kind: "no-change",
  }) satisfies DirectorRuntimeFocusTransition,
  subjectTransitions: Object.freeze(
    [],
  ) as readonly DirectorRuntimeAttentionSubjectTransition[],
  pathTransitions: Object.freeze(
    [],
  ) as readonly DirectorRuntimeAttentionPathTransition[],
  phases: Object.freeze(["stabilize"] as const),
  explanation: EMPTY_EXPLANATION,
  subjectTransitionCount: 0,
  pathTransitionCount: 0,
}) satisfies DirectorRuntimeAttentionTransitionPlan;

// ─── Validation ─────────────────────────────────────────────────────────────

export function validateDirectorRuntimeAttentionTransitionKind(
  value: unknown,
): DirectorRuntimeAttentionTransitionOrchestrationResult {
  if (!isTransitionKind(value)) {
    return failure([
      issue("invalid-transition-kind", "kind", "transition kind must be canonical"),
    ]);
  }
  return Object.freeze({ ok: true, plan: null, issues: Object.freeze([]) });
}

export function validateDirectorRuntimeAttentionSubjectTransitionKind(
  value: unknown,
): DirectorRuntimeAttentionTransitionOrchestrationResult {
  if (!isSubjectTransitionKind(value)) {
    return failure([
      issue(
        "invalid-subject-transition-kind",
        "kind",
        "subject transition kind must be canonical",
      ),
    ]);
  }
  return Object.freeze({ ok: true, plan: null, issues: Object.freeze([]) });
}

export function validateDirectorRuntimeAttentionPathTransitionKind(
  value: unknown,
): DirectorRuntimeAttentionTransitionOrchestrationResult {
  if (!isPathTransitionKind(value)) {
    return failure([
      issue(
        "invalid-path-transition-kind",
        "kind",
        "path transition kind must be canonical",
      ),
    ]);
  }
  return Object.freeze({ ok: true, plan: null, issues: Object.freeze([]) });
}

export function validateDirectorRuntimeAttentionTransitionPhase(
  value: unknown,
): DirectorRuntimeAttentionTransitionOrchestrationResult {
  if (!isPhase(value)) {
    return failure([
      issue("invalid-transition-phase", "phase", "transition phase must be canonical"),
    ]);
  }
  return Object.freeze({ ok: true, plan: null, issues: Object.freeze([]) });
}

export function validateDirectorRuntimeAttentionTransitionState(
  value: unknown,
): DirectorRuntimeAttentionTransitionOrchestrationResult {
  if (!isPlainObject(value)) {
    return failure([
      issue("invalid-transition-state", "state", "transition state must be a plain object"),
    ]);
  }
  const contextValidation = validateDirectorRuntimeFocusContext(value.focusContext);
  if (!contextValidation.ok) {
    return failure([
      issue("invalid-transition-state", "state.focusContext", "focus context invalid"),
    ]);
  }
  const pathValidation = validateDirectorRuntimeAttentionPathOrchestrationResult(
    value.pathResult,
  );
  if (!pathValidation.ok) {
    return failure([
      issue("invalid-transition-state", "state.pathResult", "path result invalid"),
    ]);
  }
  return Object.freeze({ ok: true, plan: null, issues: Object.freeze([]) });
}

export function validateDirectorRuntimeAttentionTransitionInput(
  value: unknown,
): DirectorRuntimeAttentionTransitionOrchestrationResult {
  if (!isPlainObject(value)) {
    return failure([
      issue("invalid-transition-input", "input", "transition input must be a plain object"),
    ]);
  }
  const previousValidation = validateDirectorRuntimeAttentionTransitionState(
    value.previous,
  );
  if (!previousValidation.ok) {
    return failure([
      issue("invalid-transition-input", "input.previous", "previous state invalid"),
      ...previousValidation.issues,
    ]);
  }
  const nextValidation = validateDirectorRuntimeAttentionTransitionState(value.next);
  if (!nextValidation.ok) {
    return failure([
      issue("invalid-transition-input", "input.next", "next state invalid"),
      ...nextValidation.issues,
    ]);
  }
  return Object.freeze({ ok: true, plan: null, issues: Object.freeze([]) });
}

export function validateDirectorRuntimeFocusTransition(
  value: unknown,
): DirectorRuntimeAttentionTransitionOrchestrationResult {
  if (!isPlainObject(value)) {
    return failure([
      issue("invalid-focus-transition", "focusTransition", "must be a plain object"),
    ]);
  }
  if (!isTransitionKind(value.kind)) {
    return failure([
      issue("invalid-focus-transition", "focusTransition.kind", "kind invalid"),
    ]);
  }
  return Object.freeze({ ok: true, plan: null, issues: Object.freeze([]) });
}

export function validateDirectorRuntimeAttentionSubjectTransition(
  value: unknown,
): DirectorRuntimeAttentionTransitionOrchestrationResult {
  if (!isPlainObject(value)) {
    return failure([
      issue("invalid-subject-transition", "subjectTransition", "must be a plain object"),
    ]);
  }
  const issues: DirectorRuntimeAttentionTransitionOrchestrationIssue[] = [];
  if (
    !isPlainObject(value.subject) ||
    !isNonEmptyString(value.subject.subjectId) ||
    !isNonEmptyString(value.subject.subjectKind)
  ) {
    issues.push(
      issue("invalid-subject-transition", "subjectTransition.subject", "subject invalid"),
    );
  }
  if (!isSubjectTransitionKind(value.kind)) {
    issues.push(
      issue("invalid-subject-transition-kind", "subjectTransition.kind", "kind invalid"),
    );
  }
  if (value.previousLevel !== null && !isAttentionLevel(value.previousLevel)) {
    issues.push(
      issue("invalid-subject-transition", "subjectTransition.previousLevel", "invalid"),
    );
  }
  if (value.nextLevel !== null && !isAttentionLevel(value.nextLevel)) {
    issues.push(
      issue("invalid-subject-transition", "subjectTransition.nextLevel", "invalid"),
    );
  }
  if (value.previousRole !== null && !isFocusRole(value.previousRole)) {
    issues.push(
      issue("invalid-subject-transition", "subjectTransition.previousRole", "invalid"),
    );
  }
  if (value.nextRole !== null && !isFocusRole(value.nextRole)) {
    issues.push(
      issue("invalid-subject-transition", "subjectTransition.nextRole", "invalid"),
    );
  }
  if (
    isSubjectTransitionKind(value.kind) &&
    value.kind === "promote" &&
    (value.previousLevel === null || value.nextLevel === null)
  ) {
    issues.push(
      issue(
        "contradictory-transition",
        "subjectTransition",
        "promote requires previous and next levels",
      ),
    );
  }
  if (
    isSubjectTransitionKind(value.kind) &&
    value.kind === "suppress" &&
    value.previousLevel === "suppressed"
  ) {
    issues.push(
      issue(
        "contradictory-transition",
        "subjectTransition",
        "suppress cannot start from suppressed",
      ),
    );
  }
  if (
    isSubjectTransitionKind(value.kind) &&
    value.kind === "suppress" &&
    value.nextLevel !== null &&
    value.nextLevel !== "suppressed" &&
    value.nextRole !== "none"
  ) {
    issues.push(
      issue(
        "contradictory-transition",
        "subjectTransition",
        "suppress requires next suppressed/none",
      ),
    );
  }
  return issues.length === 0
    ? Object.freeze({ ok: true, plan: null, issues: Object.freeze([]) })
    : failure(issues);
}

export function validateDirectorRuntimeAttentionPathTransition(
  value: unknown,
): DirectorRuntimeAttentionTransitionOrchestrationResult {
  if (!isPlainObject(value)) {
    return failure([
      issue("invalid-path-transition", "pathTransition", "must be a plain object"),
    ]);
  }
  if (!isPathTransitionKind(value.kind)) {
    return failure([
      issue("invalid-path-transition-kind", "pathTransition.kind", "kind invalid"),
    ]);
  }
  if (value.kind === "activate" && value.previousPathId !== null) {
    return failure([
      issue(
        "contradictory-transition",
        "pathTransition",
        "activate requires previousPathId null",
      ),
    ]);
  }
  if (value.kind === "retire" && value.nextPathId !== null) {
    return failure([
      issue(
        "contradictory-transition",
        "pathTransition",
        "retire requires nextPathId null",
      ),
    ]);
  }
  return Object.freeze({ ok: true, plan: null, issues: Object.freeze([]) });
}

export function validateDirectorRuntimeAttentionTransitionPlan(
  value: unknown,
): DirectorRuntimeAttentionTransitionOrchestrationResult {
  if (!isPlainObject(value)) {
    return failure([
      issue("invalid-transition-plan", "plan", "plan must be a plain object"),
    ]);
  }
  const issues: DirectorRuntimeAttentionTransitionOrchestrationIssue[] = [];
  if (!Array.isArray(value.transitionKinds)) {
    issues.push(
      issue("invalid-transition-plan", "plan.transitionKinds", "must be array"),
    );
  } else {
    const kinds = value.transitionKinds as unknown[];
    if (kinds.includes("no-change") && kinds.length > 1) {
      issues.push(
        issue(
          "no-change-exclusivity-violation",
          "plan.transitionKinds",
          "no-change cannot coexist with other kinds",
        ),
      );
    }
    for (const kind of kinds) {
      if (!isTransitionKind(kind)) {
        issues.push(
          issue("invalid-transition-kind", "plan.transitionKinds", "invalid kind"),
        );
      }
    }
  }
  const focusValidation = validateDirectorRuntimeFocusTransition(value.focusTransition);
  issues.push(...focusValidation.issues);
  if (!Array.isArray(value.subjectTransitions)) {
    issues.push(
      issue("invalid-transition-plan", "plan.subjectTransitions", "must be array"),
    );
  } else {
    value.subjectTransitions.forEach((entry, index) => {
      const entryValidation = validateDirectorRuntimeAttentionSubjectTransition(entry);
      for (const entryIssue of entryValidation.issues) {
        issues.push(
          issue(entryIssue.code, `plan.subjectTransitions[${index}]`, entryIssue.message),
        );
      }
    });
  }
  if (!Array.isArray(value.pathTransitions)) {
    issues.push(
      issue("invalid-transition-plan", "plan.pathTransitions", "must be array"),
    );
  } else {
    value.pathTransitions.forEach((entry, index) => {
      const entryValidation = validateDirectorRuntimeAttentionPathTransition(entry);
      for (const entryIssue of entryValidation.issues) {
        issues.push(
          issue(entryIssue.code, `plan.pathTransitions[${index}]`, entryIssue.message),
        );
      }
    });
  }
  return issues.length === 0
    ? Object.freeze({ ok: true, plan: null, issues: Object.freeze([]) })
    : failure(issues);
}

export function validateDirectorRuntimeAttentionTransitionPolicy(
  value: unknown,
): DirectorRuntimeAttentionTransitionOrchestrationResult {
  if (!isPlainObject(value)) {
    return failure([
      issue("invalid-transition-policy", "policy", "policy must be a plain object"),
    ]);
  }
  if (value.noChangePolicy !== "exclusive-no-change-with-stabilize-phase") {
    return failure([
      issue("invalid-transition-policy", "policy.noChangePolicy", "policy mismatch"),
    ]);
  }
  return Object.freeze({ ok: true, plan: null, issues: Object.freeze([]) });
}

// ─── Resolvers ──────────────────────────────────────────────────────────────

export function resolveDirectorRuntimeFocusTransition(
  previous: DirectorRuntimeFocusContext,
  next: DirectorRuntimeFocusContext,
): DirectorRuntimeFocusTransition {
  const previousPrimary = previous.primarySubject;
  const nextPrimary = next.primarySubject;
  if (previousPrimary === null && nextPrimary === null) {
    return freezeFocusTransition({
      previousPrimary: null,
      nextPrimary: null,
      kind: "no-change",
    });
  }
  if (
    previousPrimary !== null &&
    nextPrimary !== null &&
    areDirectorRuntimeAttentionSubjectsEqual(previousPrimary, nextPrimary)
  ) {
    return freezeFocusTransition({
      previousPrimary,
      nextPrimary,
      kind: "focus-retain",
    });
  }
  if (previousPrimary !== null && nextPrimary === null) {
    return freezeFocusTransition({
      previousPrimary,
      nextPrimary: null,
      kind: "focus-release",
    });
  }
  return freezeFocusTransition({
    previousPrimary,
    nextPrimary,
    kind: "focus-shift",
  });
}

function classifySubjectTransition(
  previous: SubjectSnapshot | undefined,
  next: SubjectSnapshot | undefined,
): DirectorRuntimeAttentionSubjectTransition | null {
  if (previous === undefined && next === undefined) return null;

  if (previous === undefined && next !== undefined) {
    // Active entry = Enter. Appearing already-suppressed is Suppress, not active expansion.
    return freezeSubjectTransition({
      subject: next.subject,
      previousLevel: null,
      nextLevel: next.level,
      previousRole: null,
      nextRole: next.role,
      kind: next.suppressed ? "suppress" : "enter",
    });
  }

  if (previous !== undefined && next === undefined) {
    return freezeSubjectTransition({
      subject: previous.subject,
      previousLevel: previous.level,
      nextLevel: null,
      previousRole: previous.role,
      nextRole: null,
      kind: "exit",
    });
  }

  const prev = previous!;
  const nxt = next!;

  if (prev.suppressed && nxt.suppressed) {
    return freezeSubjectTransition({
      subject: prev.subject,
      previousLevel: prev.level,
      nextLevel: nxt.level,
      previousRole: prev.role,
      nextRole: nxt.role,
      kind: "retain",
    });
  }
  if (!prev.suppressed && nxt.suppressed) {
    return freezeSubjectTransition({
      subject: prev.subject,
      previousLevel: prev.level,
      nextLevel: nxt.level,
      previousRole: prev.role,
      nextRole: nxt.role,
      kind: "suppress",
    });
  }
  if (prev.suppressed && !nxt.suppressed) {
    return freezeSubjectTransition({
      subject: prev.subject,
      previousLevel: prev.level,
      nextLevel: nxt.level,
      previousRole: prev.role,
      nextRole: nxt.role,
      kind: "unsuppress",
    });
  }

  if (prev.level === nxt.level && prev.role === nxt.role) {
    return freezeSubjectTransition({
      subject: prev.subject,
      previousLevel: prev.level,
      nextLevel: nxt.level,
      previousRole: prev.role,
      nextRole: nxt.role,
      kind: "retain",
    });
  }

  const previousRank = prominenceRank(prev.level);
  const nextRank = prominenceRank(nxt.level);
  if (nextRank < previousRank) {
    return freezeSubjectTransition({
      subject: prev.subject,
      previousLevel: prev.level,
      nextLevel: nxt.level,
      previousRole: prev.role,
      nextRole: nxt.role,
      kind: "promote",
    });
  }
  if (nextRank > previousRank) {
    return freezeSubjectTransition({
      subject: prev.subject,
      previousLevel: prev.level,
      nextLevel: nxt.level,
      previousRole: prev.role,
      nextRole: nxt.role,
      kind: "demote",
    });
  }

  // Same prominence level but role changed — treat as retain of level with role update.
  return freezeSubjectTransition({
    subject: prev.subject,
    previousLevel: prev.level,
    nextLevel: nxt.level,
    previousRole: prev.role,
    nextRole: nxt.role,
    kind: "retain",
  });
}

function orderSubjectTransitions(
  transitions: readonly DirectorRuntimeAttentionSubjectTransition[],
  previous: DirectorRuntimeFocusContext,
  next: DirectorRuntimeFocusContext,
): readonly DirectorRuntimeAttentionSubjectTransition[] {
  const byKey = new Map(
    transitions.map((entry) => [subjectKey(entry.subject), entry] as const),
  );
  const ordered: DirectorRuntimeAttentionSubjectTransition[] = [];
  const used = new Set<string>();

  const pushKey = (key: string | null) => {
    if (key === null || used.has(key)) return;
    const entry = byKey.get(key);
    if (entry === undefined) return;
    ordered.push(entry);
    used.add(key);
  };

  if (previous.primarySubject !== null) {
    pushKey(subjectKey(previous.primarySubject));
  }
  if (
    next.primarySubject !== null &&
    (previous.primarySubject === null ||
      !areDirectorRuntimeAttentionSubjectsEqual(
        previous.primarySubject,
        next.primarySubject,
      ))
  ) {
    pushKey(subjectKey(next.primarySubject));
  }

  const previousSnapshots = collectSubjectSnapshots(previous);
  const previousOrdered = [...previousSnapshots.values()].sort(
    (left, right) => left.orderIndex - right.orderIndex,
  );
  for (const snapshot of previousOrdered) {
    pushKey(subjectKey(snapshot.subject));
  }

  const nextSnapshots = collectSubjectSnapshots(next);
  const nextOrdered = [...nextSnapshots.values()].sort(
    (left, right) => left.orderIndex - right.orderIndex,
  );
  for (const snapshot of nextOrdered) {
    pushKey(subjectKey(snapshot.subject));
  }

  for (const [key, entry] of byKey) {
    if (!used.has(key)) ordered.push(entry);
  }

  return Object.freeze(ordered);
}

export function resolveDirectorRuntimeAttentionSubjectTransitions(
  previous: DirectorRuntimeFocusContext,
  next: DirectorRuntimeFocusContext,
): readonly DirectorRuntimeAttentionSubjectTransition[] {
  const previousSnapshots = collectSubjectSnapshots(previous);
  const nextSnapshots = collectSubjectSnapshots(next);
  const keys = new Set([...previousSnapshots.keys(), ...nextSnapshots.keys()]);
  const transitions: DirectorRuntimeAttentionSubjectTransition[] = [];
  for (const key of keys) {
    const transition = classifySubjectTransition(
      previousSnapshots.get(key),
      nextSnapshots.get(key),
    );
    if (transition !== null) transitions.push(transition);
  }
  return orderSubjectTransitions(transitions, previous, next);
}

function pathEndpointKey(path: DirectorRuntimeAttentionPath): string {
  const first = path.subjects[0];
  const last = path.subjects[path.subjects.length - 1];
  if (first === undefined || last === undefined) return "";
  return `${subjectKey(first)}\u0002${subjectKey(last)}`;
}

export function resolveDirectorRuntimeAttentionPathTransitions(
  previous: DirectorRuntimeAttentionPathOrchestrationResult,
  next: DirectorRuntimeAttentionPathOrchestrationResult,
): readonly DirectorRuntimeAttentionPathTransition[] {
  const previousPaths = previous.ok ? previous.paths : [];
  const nextPaths = next.ok ? next.paths : [];
  const previousMatched = new Set<number>();
  const nextMatched = new Set<number>();
  const transitions: DirectorRuntimeAttentionPathTransition[] = [];

  // Retain by structural equivalence (previous order).
  previousPaths.forEach((previousPath, previousIndex) => {
    const nextIndex = nextPaths.findIndex((candidate, index) =>
      !nextMatched.has(index) &&
      areDirectorRuntimeAttentionPathsEquivalent(previousPath, candidate));
    if (nextIndex === -1) return;
    previousMatched.add(previousIndex);
    nextMatched.add(nextIndex);
    transitions.push(freezePathTransition({
      previousPathId: previousPath.pathId,
      nextPathId: nextPaths[nextIndex]!.pathId,
      kind: "retain",
    }));
  });

  // Replace: same root + endpoint, different structure.
  previousPaths.forEach((previousPath, previousIndex) => {
    if (previousMatched.has(previousIndex)) return;
    const endpoint = pathEndpointKey(previousPath);
    if (endpoint.length === 0) return;
    const nextIndex = nextPaths.findIndex((candidate, index) =>
      !nextMatched.has(index) && pathEndpointKey(candidate) === endpoint);
    if (nextIndex === -1) return;
    previousMatched.add(previousIndex);
    nextMatched.add(nextIndex);
    transitions.push(freezePathTransition({
      previousPathId: previousPath.pathId,
      nextPathId: nextPaths[nextIndex]!.pathId,
      kind: "replace",
    }));
  });

  // Retire unmatched previous (previous order).
  previousPaths.forEach((previousPath, previousIndex) => {
    if (previousMatched.has(previousIndex)) return;
    transitions.push(freezePathTransition({
      previousPathId: previousPath.pathId,
      nextPathId: null,
      kind: "retire",
    }));
  });

  // Activate unmatched next (next order).
  nextPaths.forEach((nextPath, nextIndex) => {
    if (nextMatched.has(nextIndex)) return;
    transitions.push(freezePathTransition({
      previousPathId: null,
      nextPathId: nextPath.pathId,
      kind: "activate",
    }));
  });

  return Object.freeze(transitions);
}

function deriveHighLevelKinds(
  focusTransition: DirectorRuntimeFocusTransition,
  subjectTransitions: readonly DirectorRuntimeAttentionSubjectTransition[],
  pathTransitions: readonly DirectorRuntimeAttentionPathTransition[],
): readonly DirectorRuntimeAttentionTransitionKind[] {
  const hasMeaningfulSubjectChange = subjectTransitions.some(
    (entry) => entry.kind !== "retain",
  );
  const hasMeaningfulPathChange = pathTransitions.some(
    (entry) => entry.kind !== "retain",
  );

  if (
    focusTransition.kind === "no-change" &&
    !hasMeaningfulSubjectChange &&
    !hasMeaningfulPathChange
  ) {
    return Object.freeze(["no-change"]);
  }

  const kinds: DirectorRuntimeAttentionTransitionKind[] = [];
  if (focusTransition.kind === "focus-shift") kinds.push("focus-shift");
  if (focusTransition.kind === "focus-retain") kinds.push("focus-retain");
  if (focusTransition.kind === "focus-release") kinds.push("focus-release");

  if (
    subjectTransitions.some((entry) =>
      entry.kind === "enter" || entry.kind === "unsuppress")
  ) {
    kinds.push("context-expansion");
  }
  if (
    subjectTransitions.some((entry) =>
      entry.kind === "exit" || entry.kind === "suppress")
  ) {
    kinds.push("context-reduction");
  }
  if (subjectTransitions.some((entry) =>
    entry.kind === "suppress" || entry.kind === "unsuppress")
  ) {
    kinds.push("suppression-change");
  }

  const activated = pathTransitions.some((entry) => entry.kind === "activate");
  const retired = pathTransitions.some((entry) => entry.kind === "retire");
  const replaced = pathTransitions.some((entry) => entry.kind === "replace");
  if (activated && !retired && !replaced) kinds.push("path-expansion");
  if (retired && !activated && !replaced) kinds.push("path-reduction");
  if (replaced || (activated && retired)) kinds.push("path-shift");

  if (kinds.length === 0) {
    return Object.freeze(["no-change"]);
  }
  return Object.freeze([...new Set(kinds)]);
}

function derivePhases(
  transitionKinds: readonly DirectorRuntimeAttentionTransitionKind[],
  focusTransition: DirectorRuntimeFocusTransition,
): readonly DirectorRuntimeAttentionTransitionPhase[] {
  if (transitionKinds.includes("no-change")) {
    return Object.freeze(["stabilize"]);
  }
  const phases: DirectorRuntimeAttentionTransitionPhase[] = [];
  if (
    focusTransition.kind === "focus-release" ||
    focusTransition.kind === "focus-shift"
  ) {
    phases.push("release");
  }
  if (focusTransition.kind === "focus-shift") {
    phases.push("handoff");
  }
  if (
    focusTransition.kind === "focus-shift" ||
    transitionKinds.includes("context-expansion") ||
    transitionKinds.includes("path-expansion") ||
    transitionKinds.includes("path-shift")
  ) {
    phases.push("acquire");
  }
  phases.push("stabilize");
  return Object.freeze([...new Set(phases)].sort((left, right) =>
    DIRECTOR_RUNTIME_ATTENTION_TRANSITION_PHASES.indexOf(left) -
    DIRECTOR_RUNTIME_ATTENTION_TRANSITION_PHASES.indexOf(right)));
}

function buildExplanation(
  focusTransition: DirectorRuntimeFocusTransition,
  subjectTransitions: readonly DirectorRuntimeAttentionSubjectTransition[],
  pathTransitions: readonly DirectorRuntimeAttentionPathTransition[],
): DirectorRuntimeAttentionTransitionExplanation {
  return freezeExplanation({
    previousPrimary: focusTransition.previousPrimary,
    nextPrimary: focusTransition.nextPrimary,
    enteredSubjectIds: idsForKind(subjectTransitions, "enter"),
    retainedSubjectIds: idsForKind(subjectTransitions, "retain"),
    promotedSubjectIds: idsForKind(subjectTransitions, "promote"),
    demotedSubjectIds: idsForKind(subjectTransitions, "demote"),
    suppressedSubjectIds: idsForKind(subjectTransitions, "suppress"),
    unsuppressedSubjectIds: idsForKind(subjectTransitions, "unsuppress"),
    exitedSubjectIds: idsForKind(subjectTransitions, "exit"),
    activatedPathIds: Object.freeze(
      pathTransitions
        .filter((entry) => entry.kind === "activate")
        .map((entry) => entry.nextPathId!)
        .filter((id): id is string => id !== null),
    ),
    retainedPathIds: Object.freeze(
      pathTransitions
        .filter((entry) => entry.kind === "retain")
        .map((entry) => entry.nextPathId ?? entry.previousPathId!)
        .filter((id): id is string => id !== null),
    ),
    retiredPathIds: Object.freeze(
      pathTransitions
        .filter((entry) => entry.kind === "retire")
        .map((entry) => entry.previousPathId!)
        .filter((id): id is string => id !== null),
    ),
    replacedPathIds: Object.freeze(
      pathTransitions
        .filter((entry) => entry.kind === "replace")
        .flatMap((entry) =>
          [entry.previousPathId, entry.nextPathId].filter(
            (id): id is string => id !== null,
          )),
    ),
  });
}

function statesStructurallyEqual(
  previous: DirectorRuntimeAttentionTransitionState,
  next: DirectorRuntimeAttentionTransitionState,
): boolean {
  const focusEqual =
    JSON.stringify({
      primary: previous.focusContext.primarySubject,
      entries: previous.focusContext.entries,
      suppressed: previous.focusContext.suppressedEntries,
    }) ===
    JSON.stringify({
      primary: next.focusContext.primarySubject,
      entries: next.focusContext.entries,
      suppressed: next.focusContext.suppressedEntries,
    });
  if (!focusEqual) return false;

  const previousPaths = previous.pathResult.ok ? previous.pathResult.paths : [];
  const nextPaths = next.pathResult.ok ? next.pathResult.paths : [];
  if (previousPaths.length !== nextPaths.length) return false;
  return previousPaths.every((path, index) =>
    areDirectorRuntimeAttentionPathsEquivalent(path, nextPaths[index]!));
}

export function orchestrateDirectorRuntimeAttentionTransition(
  input: DirectorRuntimeAttentionTransitionInput,
): DirectorRuntimeAttentionTransitionOrchestrationResult {
  const inputValidation = validateDirectorRuntimeAttentionTransitionInput(input);
  if (!inputValidation.ok) return inputValidation;

  if (statesStructurallyEqual(input.previous, input.next)) {
    const focusTransition = resolveDirectorRuntimeFocusTransition(
      input.previous.focusContext,
      input.next.focusContext,
    );
    const subjectTransitions = resolveDirectorRuntimeAttentionSubjectTransitions(
      input.previous.focusContext,
      input.next.focusContext,
    );
    const pathTransitions = resolveDirectorRuntimeAttentionPathTransitions(
      input.previous.pathResult,
      input.next.pathResult,
    );

    // Empty-to-empty uses canonical exported no-change plan.
    if (
      input.previous.focusContext.primarySubject === null &&
      input.next.focusContext.primarySubject === null &&
      input.previous.focusContext.entries.length === 0 &&
      input.next.focusContext.entries.length === 0 &&
      input.previous.focusContext.suppressedEntries.length === 0 &&
      input.next.focusContext.suppressedEntries.length === 0 &&
      (input.previous.pathResult.paths?.length ?? 0) === 0 &&
      (input.next.pathResult.paths?.length ?? 0) === 0
    ) {
      return Object.freeze({
        ok: true,
        plan: DIRECTOR_RUNTIME_NO_CHANGE_ATTENTION_TRANSITION_PLAN,
        issues: Object.freeze([]),
      });
    }

    const plan = freezePlan({
      transitionKinds: Object.freeze(["no-change"]),
      focusTransition: freezeFocusTransition({
        ...focusTransition,
        kind: "no-change",
      }),
      subjectTransitions,
      pathTransitions,
      phases: Object.freeze(["stabilize"]),
      explanation: buildExplanation(
        freezeFocusTransition({ ...focusTransition, kind: "no-change" }),
        subjectTransitions,
        pathTransitions,
      ),
      subjectTransitionCount: subjectTransitions.length,
      pathTransitionCount: pathTransitions.length,
    });
    return Object.freeze({ ok: true, plan, issues: Object.freeze([]) });
  }

  const focusTransition = resolveDirectorRuntimeFocusTransition(
    input.previous.focusContext,
    input.next.focusContext,
  );
  const subjectTransitions = resolveDirectorRuntimeAttentionSubjectTransitions(
    input.previous.focusContext,
    input.next.focusContext,
  );
  const pathTransitions = resolveDirectorRuntimeAttentionPathTransitions(
    input.previous.pathResult,
    input.next.pathResult,
  );
  const transitionKinds = deriveHighLevelKinds(
    focusTransition,
    subjectTransitions,
    pathTransitions,
  );
  const phases = derivePhases(transitionKinds, focusTransition);
  const plan = freezePlan({
    transitionKinds,
    focusTransition,
    subjectTransitions,
    pathTransitions,
    phases,
    explanation: buildExplanation(
      focusTransition,
      subjectTransitions,
      pathTransitions,
    ),
    subjectTransitionCount: subjectTransitions.length,
    pathTransitionCount: pathTransitions.length,
  });

  const planValidation = validateDirectorRuntimeAttentionTransitionPlan(plan);
  if (!planValidation.ok) {
    return planValidation;
  }

  return Object.freeze({ ok: true, plan, issues: Object.freeze([]) });
}

export function areDirectorRuntimeAttentionTransitionPlansEquivalent(
  left: DirectorRuntimeAttentionTransitionPlan,
  right: DirectorRuntimeAttentionTransitionPlan,
): boolean {
  return JSON.stringify({
    transitionKinds: left.transitionKinds,
    focusTransition: left.focusTransition,
    subjectTransitions: left.subjectTransitions,
    pathTransitions: left.pathTransitions,
    phases: left.phases,
    explanation: left.explanation,
  }) === JSON.stringify({
    transitionKinds: right.transitionKinds,
    focusTransition: right.focusTransition,
    subjectTransitions: right.subjectTransitions,
    pathTransitions: right.pathTransitions,
    phases: right.phases,
    explanation: right.explanation,
  });
}

// ─── Registry / capabilities ────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ATTENTION_TRANSITION_ORCHESTRATION_CAPABILITIES =
  Object.freeze([
    "FocusHandoffDetection",
    "SubjectTransitionDerivation",
    "PromotionDetection",
    "DemotionDetection",
    "SuppressionTransitionDetection",
    "ContextExpansionDetection",
    "ContextReductionDetection",
    "PathActivationDetection",
    "PathRetentionDetection",
    "PathRetirementDetection",
    "PathShiftDetection",
    "TransitionPhaseDerivation",
    "TransitionValidation",
  ] as const);

export const DIRECTOR_RUNTIME_ATTENTION_TRANSITION_ORCHESTRATION_ABSENT_CAPABILITIES =
  Object.freeze([
    "PriorityResolution",
    "FocusContextBinding",
    "PathDiscovery",
    "Rendering",
    "Animation",
    "SceneMutation",
  ] as const);

export const DIRECTOR_RUNTIME_ATTENTION_TRANSITION_ORCHESTRATION_INVARIANTS =
  Object.freeze([
    Object.freeze({ id: "determinism", statement: "identical previous/next states produce identical plans" }),
    Object.freeze({ id: "no-change-exclusivity", statement: "no-change cannot coexist with other high-level kinds" }),
    Object.freeze({ id: "focus-consistency", statement: "focus transition matches previous and next primaries" }),
    Object.freeze({ id: "subject-continuity", statement: "same subject is promoted/demoted/retained rather than exit+enter" }),
    Object.freeze({ id: "promotion-integrity", statement: "promotion means increased semantic prominence" }),
    Object.freeze({ id: "demotion-integrity", statement: "demotion means decreased semantic prominence" }),
    Object.freeze({ id: "suppression-integrity", statement: "suppress/unsuppress are distinct from exit/enter" }),
    Object.freeze({ id: "path-integrity", statement: "path transitions compare DRI-6:5 path semantics" }),
    Object.freeze({ id: "stable-ordering", statement: "subject and path transition ordering is deterministic" }),
    Object.freeze({ id: "input-immutability", statement: "previous/next state inputs are not mutated" }),
    Object.freeze({ id: "output-immutability", statement: "transition plans are immutable" }),
    Object.freeze({ id: "no-priority-recalculation", statement: "no signal precedence logic exists" }),
    Object.freeze({ id: "no-focus-rebinding", statement: "no attention-level to focus-role resolution occurs" }),
    Object.freeze({ id: "no-path-discovery", statement: "no relationship traversal occurs" }),
    Object.freeze({ id: "no-timing-behavior", statement: "no temporal animation metadata exists" }),
    Object.freeze({ id: "no-presentation-leakage", statement: "no renderer fields exist" }),
    Object.freeze({ id: "no-scene-mutation", statement: "transition planning remains declarative" }),
  ] as const);

export const directorRuntimeAttentionTransitionOrchestrationApiNames =
  Object.freeze([
    "resolveDirectorRuntimeFocusTransition",
    "resolveDirectorRuntimeAttentionSubjectTransitions",
    "resolveDirectorRuntimeAttentionPathTransitions",
    "orchestrateDirectorRuntimeAttentionTransition",
    "areDirectorRuntimeAttentionTransitionPlansEquivalent",
    "validateDirectorRuntimeAttentionTransitionKind",
    "validateDirectorRuntimeAttentionSubjectTransitionKind",
    "validateDirectorRuntimeAttentionPathTransitionKind",
    "validateDirectorRuntimeAttentionTransitionPhase",
    "validateDirectorRuntimeAttentionTransitionState",
    "validateDirectorRuntimeAttentionTransitionInput",
    "validateDirectorRuntimeFocusTransition",
    "validateDirectorRuntimeAttentionSubjectTransition",
    "validateDirectorRuntimeAttentionPathTransition",
    "validateDirectorRuntimeAttentionTransitionPlan",
    "validateDirectorRuntimeAttentionTransitionPolicy",
    "verifyDirectorRuntimeAttentionTransitionOrchestration",
  ] as const);

export const directorRuntimeAttentionTransitionOrchestrationPolicy =
  Object.freeze({
    transitionKinds: DIRECTOR_RUNTIME_ATTENTION_TRANSITION_KINDS,
    subjectTransitionKinds: DIRECTOR_RUNTIME_ATTENTION_SUBJECT_TRANSITION_KINDS,
    pathTransitionKinds: DIRECTOR_RUNTIME_ATTENTION_PATH_TRANSITION_KINDS,
    phases: DIRECTOR_RUNTIME_ATTENTION_TRANSITION_PHASES,
    prominenceOrder: DIRECTOR_RUNTIME_ATTENTION_PROMINENCE_ORDER,
    subjectOrderingPolicy:
      DIRECTOR_RUNTIME_ATTENTION_SUBJECT_TRANSITION_ORDERING_POLICY,
    pathOrderingPolicy: DIRECTOR_RUNTIME_ATTENTION_PATH_TRANSITION_ORDERING_POLICY,
    pathReplacePolicy: DIRECTOR_RUNTIME_ATTENTION_PATH_REPLACE_POLICY,
    noChangePolicy: "exclusive-no-change-with-stabilize-phase" as const,
    suppressionTransitionPolicy: "suppress-unsuppress-distinct-from-exit-enter" as const,
    performsPriorityResolution: false as const,
    rebindsFocusContext: false as const,
    discoversPaths: false as const,
    includesTiming: false as const,
  });

export const directorRuntimeAttentionTransitionOrchestrationRegistry =
  Object.freeze({
    identity: directorRuntimeAttentionTransitionOrchestrationIdentity,
    version: directorRuntimeAttentionTransitionOrchestrationVersion,
    namespace: directorRuntimeAttentionTransitionOrchestrationNamespace,
    dependency: directorRuntimeAttentionTransitionOrchestrationUpstream,
    transitionKinds: DIRECTOR_RUNTIME_ATTENTION_TRANSITION_KINDS,
    transitionKindCount: DIRECTOR_RUNTIME_ATTENTION_TRANSITION_KINDS.length,
    subjectTransitionKinds: DIRECTOR_RUNTIME_ATTENTION_SUBJECT_TRANSITION_KINDS,
    subjectTransitionKindCount:
      DIRECTOR_RUNTIME_ATTENTION_SUBJECT_TRANSITION_KINDS.length,
    pathTransitionKinds: DIRECTOR_RUNTIME_ATTENTION_PATH_TRANSITION_KINDS,
    pathTransitionKindCount: DIRECTOR_RUNTIME_ATTENTION_PATH_TRANSITION_KINDS.length,
    phases: DIRECTOR_RUNTIME_ATTENTION_TRANSITION_PHASES,
    phaseCount: DIRECTOR_RUNTIME_ATTENTION_TRANSITION_PHASES.length,
    policy: directorRuntimeAttentionTransitionOrchestrationPolicy,
    capabilities: DIRECTOR_RUNTIME_ATTENTION_TRANSITION_ORCHESTRATION_CAPABILITIES,
    capabilityCount:
      DIRECTOR_RUNTIME_ATTENTION_TRANSITION_ORCHESTRATION_CAPABILITIES.length,
    absentCapabilities:
      DIRECTOR_RUNTIME_ATTENTION_TRANSITION_ORCHESTRATION_ABSENT_CAPABILITIES,
    emptyState: DIRECTOR_RUNTIME_EMPTY_ATTENTION_TRANSITION_STATE,
    noChangePlan: DIRECTOR_RUNTIME_NO_CHANGE_ATTENTION_TRANSITION_PLAN,
    invariants: DIRECTOR_RUNTIME_ATTENTION_TRANSITION_ORCHESTRATION_INVARIANTS,
    invariantCount:
      DIRECTOR_RUNTIME_ATTENTION_TRANSITION_ORCHESTRATION_INVARIANTS.length,
    publicApis: directorRuntimeAttentionTransitionOrchestrationApiNames,
    publicApiCount: directorRuntimeAttentionTransitionOrchestrationApiNames.length,
  });

export const directorRuntimeAttentionTransitionOrchestration = Object.freeze({
  phase: "DRI-6:6" as const,
  name: "DirectorRuntimeAttentionTransitionOrchestration" as const,
  identity: directorRuntimeAttentionTransitionOrchestrationIdentity,
  namespace: directorRuntimeAttentionTransitionOrchestrationNamespace,
  version: directorRuntimeAttentionTransitionOrchestrationVersion,
  layer: "Director Runtime Integration" as const,
  domain: "AttentionFocusOrchestration" as const,
  role: "AttentionTransitionOrchestration" as const,
  stage: "AttentionTransitionOrchestration" as const,
  status: "AttentionTransitionOrchestrationReady" as const,
  upstreamDependency: directorRuntimeAttentionTransitionOrchestrationUpstream,
  deterministic: true as const,
  rendererIndependent: true as const,
  philosophy: "semantic-handoff-not-animation" as const,
  policy: directorRuntimeAttentionTransitionOrchestrationPolicy,
  capabilities: DIRECTOR_RUNTIME_ATTENTION_TRANSITION_ORCHESTRATION_CAPABILITIES,
  absentCapabilities:
    DIRECTOR_RUNTIME_ATTENTION_TRANSITION_ORCHESTRATION_ABSENT_CAPABILITIES,
  emptyState: DIRECTOR_RUNTIME_EMPTY_ATTENTION_TRANSITION_STATE,
  noChangePlan: DIRECTOR_RUNTIME_NO_CHANGE_ATTENTION_TRANSITION_PLAN,
  invariants: DIRECTOR_RUNTIME_ATTENTION_TRANSITION_ORCHESTRATION_INVARIANTS,
  publicApiSurface: directorRuntimeAttentionTransitionOrchestrationApiNames,
  registry: directorRuntimeAttentionTransitionOrchestrationRegistry,
  pathOrchestrationBoundary: "DRI-6:5-attention-path-orchestration-only" as const,
  architecturalStatus:
    "Established · Deterministic · Immutable · Declarative · AttentionTransitionOrchestrationReady" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface DirectorRuntimeAttentionTransitionOrchestrationVerification {
  readonly ok: boolean;
  readonly identity: typeof directorRuntimeAttentionTransitionOrchestrationIdentity;
  readonly version: typeof directorRuntimeAttentionTransitionOrchestrationVersion;
  readonly namespace: typeof directorRuntimeAttentionTransitionOrchestrationNamespace;
  readonly dependency: typeof directorRuntimeAttentionTransitionOrchestrationUpstream;
  readonly transitionKindCount: number;
  readonly subjectTransitionKindCount: number;
  readonly pathTransitionKindCount: number;
  readonly phaseCount: number;
  readonly capabilityCount: number;
  readonly invariantCount: number;
  readonly frozen: boolean;
}

export function verifyDirectorRuntimeAttentionTransitionOrchestration():
  DirectorRuntimeAttentionTransitionOrchestrationVerification {
  const layer = directorRuntimeAttentionTransitionOrchestration;
  const registry = directorRuntimeAttentionTransitionOrchestrationRegistry;
  const ok =
    layer.identity ===
      "DRI-6:6/DirectorRuntimeAttentionTransitionOrchestration" &&
    layer.version === "6.6.0" &&
    layer.namespace === "nexora.dri.attention-focus.transition-orchestration" &&
    layer.role === "AttentionTransitionOrchestration" &&
    layer.status === "AttentionTransitionOrchestrationReady" &&
    layer.upstreamDependency ===
      "DRI-6:5/DirectorRuntimeAttentionPathOrchestration" &&
    layer.upstreamDependency ===
      directorRuntimeAttentionPathOrchestrationIdentity &&
    registry.dependency === layer.upstreamDependency &&
    DIRECTOR_RUNTIME_ATTENTION_TRANSITION_KINDS.length === 10 &&
    DIRECTOR_RUNTIME_ATTENTION_SUBJECT_TRANSITION_KINDS.length === 7 &&
    DIRECTOR_RUNTIME_ATTENTION_PATH_TRANSITION_KINDS.length === 4 &&
    DIRECTOR_RUNTIME_ATTENTION_TRANSITION_PHASES.length === 4 &&
    layer.policy.noChangePolicy ===
      "exclusive-no-change-with-stabilize-phase" &&
    layer.policy.includesTiming === false &&
    layer.policy.discoversPaths === false &&
    !DIRECTOR_RUNTIME_ATTENTION_TRANSITION_ORCHESTRATION_CAPABILITIES.includes(
      "Animation" as never,
    ) &&
    Object.isFrozen(layer) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(directorRuntimeAttentionTransitionOrchestrationPolicy) &&
    Object.isFrozen(DIRECTOR_RUNTIME_NO_CHANGE_ATTENTION_TRANSITION_PLAN);

  return Object.freeze({
    ok,
    identity: directorRuntimeAttentionTransitionOrchestrationIdentity,
    version: directorRuntimeAttentionTransitionOrchestrationVersion,
    namespace: directorRuntimeAttentionTransitionOrchestrationNamespace,
    dependency: directorRuntimeAttentionTransitionOrchestrationUpstream,
    transitionKindCount: DIRECTOR_RUNTIME_ATTENTION_TRANSITION_KINDS.length,
    subjectTransitionKindCount:
      DIRECTOR_RUNTIME_ATTENTION_SUBJECT_TRANSITION_KINDS.length,
    pathTransitionKindCount: DIRECTOR_RUNTIME_ATTENTION_PATH_TRANSITION_KINDS.length,
    phaseCount: DIRECTOR_RUNTIME_ATTENTION_TRANSITION_PHASES.length,
    capabilityCount:
      DIRECTOR_RUNTIME_ATTENTION_TRANSITION_ORCHESTRATION_CAPABILITIES.length,
    invariantCount:
      DIRECTOR_RUNTIME_ATTENTION_TRANSITION_ORCHESTRATION_INVARIANTS.length,
    frozen: Object.isFrozen(layer) && Object.isFrozen(registry),
  });
}
