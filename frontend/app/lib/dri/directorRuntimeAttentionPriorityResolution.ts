/**
 * DRI-6:3 — Director Runtime Attention Priority Resolution.
 *
 * Deterministic, policy-driven resolution of competing attention signals into
 * semantic precedence, primary selection, secondary retention, and suppression.
 * No context binding, path orchestration, transition, or presentation.
 */

import {
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_LEVELS,
  DIRECTOR_RUNTIME_ATTENTION_PERSISTENCE_VALUES,
  DIRECTOR_RUNTIME_ATTENTION_REASON_KINDS,
  DIRECTOR_RUNTIME_ATTENTION_SIGNAL_INTENTS,
  DIRECTOR_RUNTIME_ATTENTION_SIGNAL_SOURCES,
  areDirectorRuntimeAttentionSubjectsEqual,
  createDirectorRuntimeAttentionSignalBatch,
  deduplicateDirectorRuntimeAttentionSignals,
  directorRuntimeAttentionSignalContractsIdentity,
  normalizeDirectorRuntimeAttentionSignal,
  validateDirectorRuntimeAttentionSignal,
  validateDirectorRuntimeAttentionSignalBatch,
  type DirectorRuntimeAttentionFocusLevel,
  type DirectorRuntimeAttentionPersistence,
  type DirectorRuntimeAttentionReasonKind,
  type DirectorRuntimeAttentionSignal,
  type DirectorRuntimeAttentionSignalBatch,
  type DirectorRuntimeAttentionSignalIntent,
  type DirectorRuntimeAttentionSignalSource,
  type DirectorRuntimeAttentionSubjectReference,
} from "@/app/lib/dri/directorRuntimeAttentionSignalContracts";

export type {
  DirectorRuntimeAttentionFocusLevel,
  DirectorRuntimeAttentionPersistence,
  DirectorRuntimeAttentionReasonKind,
  DirectorRuntimeAttentionSignal,
  DirectorRuntimeAttentionSignalBatch,
  DirectorRuntimeAttentionSignalCategory,
  DirectorRuntimeAttentionSignalIntent,
  DirectorRuntimeAttentionSignalSource,
  DirectorRuntimeAttentionSubjectReference,
} from "@/app/lib/dri/directorRuntimeAttentionSignalContracts";

export {
  DIRECTOR_RUNTIME_EMPTY_ATTENTION_SIGNAL_BATCH,
  createDirectorRuntimeAttentionSignal,
  createDirectorRuntimeAttentionSignalBatch,
  deduplicateDirectorRuntimeAttentionSignals,
  validateDirectorRuntimeAttentionSignal,
  validateDirectorRuntimeAttentionSignalBatch,
} from "@/app/lib/dri/directorRuntimeAttentionSignalContracts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeAttentionPriorityResolutionIdentity =
  "DRI-6:3/DirectorRuntimeAttentionPriorityResolution" as const;
export const directorRuntimeAttentionPriorityResolutionVersion = "6.3.0" as const;
export const directorRuntimeAttentionPriorityResolutionNamespace =
  "nexora.dri.attention-focus.priority-resolution" as const;
export const directorRuntimeAttentionPriorityResolutionUpstream =
  directorRuntimeAttentionSignalContractsIdentity;

export const directorRuntimeAttentionPriorityResolutionCanonicalIdentity =
  Object.freeze({
    identity: directorRuntimeAttentionPriorityResolutionIdentity,
    version: directorRuntimeAttentionPriorityResolutionVersion,
    namespace: directorRuntimeAttentionPriorityResolutionNamespace,
    upstream: directorRuntimeAttentionPriorityResolutionUpstream,
  });

// ─── Precedence registries (lower index = higher precedence) ────────────────

export const DIRECTOR_RUNTIME_ATTENTION_SOURCE_PRECEDENCE = Object.freeze([
  "user-interaction",
  "execution",
  "decision",
  "problem",
  "kpi",
  "koi",
  "goal",
  "scenario",
  "advisor",
  "runtime-state",
  "system",
] as const satisfies readonly DirectorRuntimeAttentionSignalSource[]);

export const DIRECTOR_RUNTIME_ATTENTION_REASON_PRECEDENCE = Object.freeze([
  "critical-state",
  "risk",
  "warning",
  "explicit-selection",
  "execution-relevance",
  "decision-relevance",
  "goal-relevance",
  "scenario-relevance",
  "advisor-relevance",
  "dependency",
  "context-relevance",
  "system-relevance",
] as const satisfies readonly DirectorRuntimeAttentionReasonKind[]);

export const DIRECTOR_RUNTIME_ATTENTION_REQUESTED_LEVEL_PRECEDENCE =
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_LEVELS;

export const DIRECTOR_RUNTIME_ATTENTION_INTENT_PRECEDENCE = Object.freeze([
  "request-focus",
  "request-support",
  "request-context",
  "request-awareness",
  "request-suppression",
] as const satisfies readonly DirectorRuntimeAttentionSignalIntent[]);

/** Late tiebreak only — must never outrank CriticalState / reason / source. */
export const DIRECTOR_RUNTIME_ATTENTION_PERSISTENCE_PRECEDENCE = Object.freeze([
  "persistent",
  "session",
  "transient",
] as const satisfies readonly DirectorRuntimeAttentionPersistence[]);

export const DIRECTOR_RUNTIME_ATTENTION_DECISION_DIMENSIONS = Object.freeze([
  "reason",
  "source",
  "requested-level",
  "intent",
  "persistence",
  "stable-order",
  "suppression-rule",
  "same-subject-aggregation",
] as const);
export type DirectorRuntimeAttentionDecisionDimension =
  (typeof DIRECTOR_RUNTIME_ATTENTION_DECISION_DIMENSIONS)[number];

export const DIRECTOR_RUNTIME_ATTENTION_COMPARISON_ORDER = Object.freeze([
  "reason",
  "source",
  "requested-level",
  "intent",
  "persistence",
  "stable-order",
] as const);

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface DirectorRuntimeAttentionPriorityVector {
  readonly reasonRank: number;
  readonly sourceRank: number;
  readonly requestedLevelRank: number;
  readonly intentRank: number;
  readonly persistenceRank: number;
}

export interface DirectorRuntimeAttentionResolutionCandidate {
  readonly signal: DirectorRuntimeAttentionSignal;
  readonly inputIndex: number;
  readonly priority: DirectorRuntimeAttentionPriorityVector;
}

export interface DirectorRuntimeResolvedAttentionAssignment {
  readonly subject: DirectorRuntimeAttentionSubjectReference;
  readonly resolvedLevel: DirectorRuntimeAttentionFocusLevel;
  readonly winningSignalId: string;
  readonly contributingSignalIds: readonly string[];
}

export interface DirectorRuntimeAttentionResolutionExplanation {
  readonly winnerSignalId: string;
  readonly loserSignalId: string;
  readonly decisiveDimension: DirectorRuntimeAttentionDecisionDimension;
  readonly winnerValue: string;
  readonly loserValue: string;
}

export interface DirectorRuntimeAttentionResolutionOutcome {
  readonly primary: DirectorRuntimeResolvedAttentionAssignment | null;
  readonly assignments: readonly DirectorRuntimeResolvedAttentionAssignment[];
  readonly winningSignalIds: readonly string[];
  readonly retainedSignalIds: readonly string[];
  readonly suppressedSignalIds: readonly string[];
  readonly explanations: readonly DirectorRuntimeAttentionResolutionExplanation[];
}

export const DIRECTOR_RUNTIME_EMPTY_ATTENTION_RESOLUTION_OUTCOME = Object.freeze({
  primary: null,
  assignments: Object.freeze([]) as readonly DirectorRuntimeResolvedAttentionAssignment[],
  winningSignalIds: Object.freeze([]) as readonly string[],
  retainedSignalIds: Object.freeze([]) as readonly string[],
  suppressedSignalIds: Object.freeze([]) as readonly string[],
  explanations: Object.freeze([]) as readonly DirectorRuntimeAttentionResolutionExplanation[],
}) satisfies DirectorRuntimeAttentionResolutionOutcome;

export const DIRECTOR_RUNTIME_ATTENTION_PRIORITY_RESOLUTION_ISSUE_CODES =
  Object.freeze([
    "invalid-batch",
    "invalid-signal",
    "invalid-priority-vector",
    "invalid-resolution-candidate",
    "invalid-resolved-assignment",
    "invalid-resolution-explanation",
    "invalid-resolution-outcome",
    "multiple-primary-assignments",
  ] as const);
export type DirectorRuntimeAttentionPriorityResolutionIssueCode =
  (typeof DIRECTOR_RUNTIME_ATTENTION_PRIORITY_RESOLUTION_ISSUE_CODES)[number];

export interface DirectorRuntimeAttentionPriorityResolutionIssue {
  readonly code: DirectorRuntimeAttentionPriorityResolutionIssueCode;
  readonly path: string;
  readonly message: string;
}

export interface DirectorRuntimeAttentionPriorityResolutionResult {
  readonly ok: boolean;
  readonly outcome: DirectorRuntimeAttentionResolutionOutcome | null;
  readonly issues: readonly DirectorRuntimeAttentionPriorityResolutionIssue[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function issue(
  code: DirectorRuntimeAttentionPriorityResolutionIssueCode,
  path: string,
  message: string,
): DirectorRuntimeAttentionPriorityResolutionIssue {
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

function rankOf<T extends string>(
  value: T,
  precedence: readonly T[],
): number {
  const index = precedence.indexOf(value);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
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

function isSuppressionSignal(signal: DirectorRuntimeAttentionSignal): boolean {
  return signal.intent === "request-suppression" ||
    signal.requestedLevel === "suppressed";
}

// ─── Priority vector / comparison ───────────────────────────────────────────

export function deriveDirectorRuntimeAttentionPriorityVector(
  signal: DirectorRuntimeAttentionSignal,
): DirectorRuntimeAttentionPriorityVector {
  return Object.freeze({
    reasonRank: rankOf(signal.reason, DIRECTOR_RUNTIME_ATTENTION_REASON_PRECEDENCE),
    sourceRank: rankOf(signal.source, DIRECTOR_RUNTIME_ATTENTION_SOURCE_PRECEDENCE),
    requestedLevelRank: rankOf(
      signal.requestedLevel,
      DIRECTOR_RUNTIME_ATTENTION_REQUESTED_LEVEL_PRECEDENCE,
    ),
    intentRank: rankOf(signal.intent, DIRECTOR_RUNTIME_ATTENTION_INTENT_PRECEDENCE),
    persistenceRank: rankOf(
      signal.persistence,
      DIRECTOR_RUNTIME_ATTENTION_PERSISTENCE_PRECEDENCE,
    ),
  });
}

function comparePriorityVectors(
  left: DirectorRuntimeAttentionPriorityVector,
  right: DirectorRuntimeAttentionPriorityVector,
): { readonly delta: number; readonly dimension: DirectorRuntimeAttentionDecisionDimension | null } {
  if (left.reasonRank !== right.reasonRank) {
    return { delta: left.reasonRank - right.reasonRank, dimension: "reason" };
  }
  if (left.sourceRank !== right.sourceRank) {
    return { delta: left.sourceRank - right.sourceRank, dimension: "source" };
  }
  if (left.requestedLevelRank !== right.requestedLevelRank) {
    return {
      delta: left.requestedLevelRank - right.requestedLevelRank,
      dimension: "requested-level",
    };
  }
  if (left.intentRank !== right.intentRank) {
    return { delta: left.intentRank - right.intentRank, dimension: "intent" };
  }
  if (left.persistenceRank !== right.persistenceRank) {
    return {
      delta: left.persistenceRank - right.persistenceRank,
      dimension: "persistence",
    };
  }
  return { delta: 0, dimension: null };
}

/**
 * Returns negative when left wins, positive when right wins, zero when equal
 * before stable-order (caller applies input indexes for final tiebreak).
 */
export function compareDirectorRuntimeAttentionSignals(
  left: DirectorRuntimeAttentionSignal,
  right: DirectorRuntimeAttentionSignal,
  leftIndex = 0,
  rightIndex = 0,
): number {
  const leftVector = deriveDirectorRuntimeAttentionPriorityVector(left);
  const rightVector = deriveDirectorRuntimeAttentionPriorityVector(right);
  const compared = comparePriorityVectors(leftVector, rightVector);
  if (compared.delta !== 0) return compared.delta;
  return leftIndex - rightIndex;
}

function dimensionValue(
  signal: DirectorRuntimeAttentionSignal,
  dimension: DirectorRuntimeAttentionDecisionDimension,
): string {
  switch (dimension) {
    case "reason":
      return signal.reason;
    case "source":
      return signal.source;
    case "requested-level":
      return signal.requestedLevel;
    case "intent":
      return signal.intent;
    case "persistence":
      return signal.persistence;
    case "stable-order":
      return signal.signalId;
    case "suppression-rule":
      return isSuppressionSignal(signal) ? "suppression" : "active";
    case "same-subject-aggregation":
      return subjectKey(signal.subject);
    default:
      return signal.signalId;
  }
}

export function explainDirectorRuntimeAttentionSignalComparison(
  left: DirectorRuntimeAttentionSignal,
  right: DirectorRuntimeAttentionSignal,
  leftIndex = 0,
  rightIndex = 0,
): DirectorRuntimeAttentionResolutionExplanation {
  const leftVector = deriveDirectorRuntimeAttentionPriorityVector(left);
  const rightVector = deriveDirectorRuntimeAttentionPriorityVector(right);
  const compared = comparePriorityVectors(leftVector, rightVector);

  if (compared.dimension !== null) {
    const leftWins = compared.delta < 0;
    const winner = leftWins ? left : right;
    const loser = leftWins ? right : left;
    return Object.freeze({
      winnerSignalId: winner.signalId,
      loserSignalId: loser.signalId,
      decisiveDimension: compared.dimension,
      winnerValue: dimensionValue(winner, compared.dimension),
      loserValue: dimensionValue(loser, compared.dimension),
    });
  }

  const leftWins = leftIndex <= rightIndex;
  const winner = leftWins ? left : right;
  const loser = leftWins ? right : left;
  return Object.freeze({
    winnerSignalId: winner.signalId,
    loserSignalId: loser.signalId,
    decisiveDimension: "stable-order",
    winnerValue: String(leftWins ? leftIndex : rightIndex),
    loserValue: String(leftWins ? rightIndex : leftIndex),
  });
}

// ─── Validation ─────────────────────────────────────────────────────────────

export function validateDirectorRuntimeAttentionPriorityVector(
  value: unknown,
): DirectorRuntimeAttentionPriorityResolutionResult {
  if (!isPlainObject(value)) {
    return Object.freeze({
      ok: false,
      outcome: null,
      issues: Object.freeze([
        issue("invalid-priority-vector", "priority", "priority vector must be a plain object"),
      ]),
    });
  }
  const fields = [
    "reasonRank",
    "sourceRank",
    "requestedLevelRank",
    "intentRank",
    "persistenceRank",
  ] as const;
  for (const field of fields) {
    if (typeof value[field] !== "number" || !Number.isFinite(value[field])) {
      return Object.freeze({
        ok: false,
        outcome: null,
        issues: Object.freeze([
          issue("invalid-priority-vector", `priority.${field}`, `${field} must be a finite number`),
        ]),
      });
    }
  }
  return Object.freeze({ ok: true, outcome: null, issues: Object.freeze([]) });
}

export function validateDirectorRuntimeResolvedAttentionAssignment(
  value: unknown,
): DirectorRuntimeAttentionPriorityResolutionResult {
  if (!isPlainObject(value)) {
    return Object.freeze({
      ok: false,
      outcome: null,
      issues: Object.freeze([
        issue("invalid-resolved-assignment", "assignment", "assignment must be a plain object"),
      ]),
    });
  }
  const issues: DirectorRuntimeAttentionPriorityResolutionIssue[] = [];
  if (!isPlainObject(value.subject) ||
    !isNonEmptyString(value.subject.subjectId) ||
    typeof value.subject.subjectKind !== "string") {
    issues.push(issue("invalid-resolved-assignment", "assignment.subject", "subject is invalid"));
  }
  if (!(DIRECTOR_RUNTIME_ATTENTION_FOCUS_LEVELS as readonly unknown[])
    .includes(value.resolvedLevel)) {
    issues.push(
      issue("invalid-resolved-assignment", "assignment.resolvedLevel", "resolvedLevel invalid"),
    );
  }
  if (!isNonEmptyString(value.winningSignalId)) {
    issues.push(
      issue("invalid-resolved-assignment", "assignment.winningSignalId", "winningSignalId invalid"),
    );
  }
  if (!Array.isArray(value.contributingSignalIds) ||
    value.contributingSignalIds.some((id) => !isNonEmptyString(id))) {
    issues.push(
      issue(
        "invalid-resolved-assignment",
        "assignment.contributingSignalIds",
        "contributingSignalIds invalid",
      ),
    );
  }
  return Object.freeze({
    ok: issues.length === 0,
    outcome: null,
    issues: Object.freeze(issues),
  });
}

export function validateDirectorRuntimeAttentionResolutionExplanation(
  value: unknown,
): DirectorRuntimeAttentionPriorityResolutionResult {
  if (!isPlainObject(value)) {
    return Object.freeze({
      ok: false,
      outcome: null,
      issues: Object.freeze([
        issue("invalid-resolution-explanation", "explanation", "explanation must be plain object"),
      ]),
    });
  }
  const issues: DirectorRuntimeAttentionPriorityResolutionIssue[] = [];
  if (!isNonEmptyString(value.winnerSignalId)) {
    issues.push(issue("invalid-resolution-explanation", "explanation.winnerSignalId", "invalid"));
  }
  if (!isNonEmptyString(value.loserSignalId)) {
    issues.push(issue("invalid-resolution-explanation", "explanation.loserSignalId", "invalid"));
  }
  if (!(DIRECTOR_RUNTIME_ATTENTION_DECISION_DIMENSIONS as readonly unknown[])
    .includes(value.decisiveDimension)) {
    issues.push(
      issue("invalid-resolution-explanation", "explanation.decisiveDimension", "invalid"),
    );
  }
  return Object.freeze({
    ok: issues.length === 0,
    outcome: null,
    issues: Object.freeze(issues),
  });
}

export function validateDirectorRuntimeAttentionResolutionOutcome(
  value: unknown,
): DirectorRuntimeAttentionPriorityResolutionResult {
  if (!isPlainObject(value)) {
    return Object.freeze({
      ok: false,
      outcome: null,
      issues: Object.freeze([
        issue("invalid-resolution-outcome", "outcome", "outcome must be a plain object"),
      ]),
    });
  }
  const issues: DirectorRuntimeAttentionPriorityResolutionIssue[] = [];
  if (value.primary !== null) {
    const primaryValidation = validateDirectorRuntimeResolvedAttentionAssignment(value.primary);
    issues.push(...primaryValidation.issues);
    if (
      primaryValidation.ok &&
      isPlainObject(value.primary) &&
      value.primary.resolvedLevel !== "primary"
    ) {
      issues.push(
        issue(
          "invalid-resolution-outcome",
          "outcome.primary",
          "primary assignment must have resolvedLevel primary",
        ),
      );
    }
  }
  if (!Array.isArray(value.assignments)) {
    issues.push(issue("invalid-resolution-outcome", "outcome.assignments", "must be array"));
  } else {
    const primaryCount = value.assignments.filter(
      (entry) => isPlainObject(entry) && entry.resolvedLevel === "primary",
    ).length;
    if (primaryCount > 1) {
      issues.push(
        issue(
          "multiple-primary-assignments",
          "outcome.assignments",
          "outcome may contain at most one primary assignment",
        ),
      );
    }
    value.assignments.forEach((entry, index) => {
      const entryValidation = validateDirectorRuntimeResolvedAttentionAssignment(entry);
      for (const entryIssue of entryValidation.issues) {
        issues.push(
          issue(entryIssue.code, `outcome.assignments[${index}]`, entryIssue.message),
        );
      }
    });
  }
  for (const field of [
    "winningSignalIds",
    "retainedSignalIds",
    "suppressedSignalIds",
  ] as const) {
    if (!Array.isArray(value[field])) {
      issues.push(issue("invalid-resolution-outcome", `outcome.${field}`, "must be array"));
    }
  }
  if (!Array.isArray(value.explanations)) {
    issues.push(issue("invalid-resolution-outcome", "outcome.explanations", "must be array"));
  }
  return Object.freeze({
    ok: issues.length === 0,
    outcome: null,
    issues: Object.freeze(issues),
  });
}

// ─── Subject / batch resolution ─────────────────────────────────────────────

function freezeAssignment(
  assignment: DirectorRuntimeResolvedAttentionAssignment,
): DirectorRuntimeResolvedAttentionAssignment {
  return Object.freeze({
    subject: freezeSubject(assignment.subject),
    resolvedLevel: assignment.resolvedLevel,
    winningSignalId: assignment.winningSignalId,
    contributingSignalIds: Object.freeze([...assignment.contributingSignalIds]),
  });
}

function freezeOutcome(
  outcome: DirectorRuntimeAttentionResolutionOutcome,
): DirectorRuntimeAttentionResolutionOutcome {
  return Object.freeze({
    primary: outcome.primary === null ? null : freezeAssignment(outcome.primary),
    assignments: Object.freeze(outcome.assignments.map((entry) => freezeAssignment(entry))),
    winningSignalIds: Object.freeze([...outcome.winningSignalIds]),
    retainedSignalIds: Object.freeze([...outcome.retainedSignalIds]),
    suppressedSignalIds: Object.freeze([...outcome.suppressedSignalIds]),
    explanations: Object.freeze(
      outcome.explanations.map((entry) => Object.freeze({ ...entry })),
    ),
  });
}

function buildCandidates(
  signals: readonly DirectorRuntimeAttentionSignal[],
): readonly DirectorRuntimeAttentionResolutionCandidate[] {
  return Object.freeze(
    signals.map((signal, inputIndex) => Object.freeze({
      signal,
      inputIndex,
      priority: deriveDirectorRuntimeAttentionPriorityVector(signal),
    })),
  );
}

function pickWinner(
  candidates: readonly DirectorRuntimeAttentionResolutionCandidate[],
): {
  readonly winner: DirectorRuntimeAttentionResolutionCandidate;
  readonly explanations: readonly DirectorRuntimeAttentionResolutionExplanation[];
} {
  let winner = candidates[0]!;
  const explanations: DirectorRuntimeAttentionResolutionExplanation[] = [];
  for (let index = 1; index < candidates.length; index += 1) {
    const challenger = candidates[index]!;
    const explanation = explainDirectorRuntimeAttentionSignalComparison(
      winner.signal,
      challenger.signal,
      winner.inputIndex,
      challenger.inputIndex,
    );
    explanations.push(explanation);
    if (explanation.winnerSignalId === challenger.signal.signalId) {
      winner = challenger;
    }
  }
  return { winner, explanations: Object.freeze(explanations) };
}

function demoteLevel(
  level: DirectorRuntimeAttentionFocusLevel,
): DirectorRuntimeAttentionFocusLevel {
  if (level === "primary") return "secondary";
  if (level === "secondary") return "context";
  if (level === "context") return "background";
  return level;
}

export function resolveDirectorRuntimeAttentionForSubject(
  signals: readonly DirectorRuntimeAttentionSignal[],
): DirectorRuntimeAttentionPriorityResolutionResult {
  const issues: DirectorRuntimeAttentionPriorityResolutionIssue[] = [];
  signals.forEach((signal, index) => {
    const validation = validateDirectorRuntimeAttentionSignal(signal);
    if (!validation.valid) {
      issues.push(
        issue("invalid-signal", `signals[${index}]`, "signal failed DRI-6:2 validation"),
      );
    }
  });
  if (issues.length > 0) {
    return Object.freeze({ ok: false, outcome: null, issues: Object.freeze(issues) });
  }
  if (signals.length === 0) {
    return Object.freeze({
      ok: true,
      outcome: DIRECTOR_RUNTIME_EMPTY_ATTENTION_RESOLUTION_OUTCOME,
      issues: Object.freeze([]),
    });
  }

  const normalized = signals.map((signal) => normalizeDirectorRuntimeAttentionSignal(signal));
  const firstSubject = normalized[0]!.subject;
  if (!normalized.every((signal) =>
    areDirectorRuntimeAttentionSubjectsEqual(signal.subject, firstSubject))) {
    return Object.freeze({
      ok: false,
      outcome: null,
      issues: Object.freeze([
        issue(
          "invalid-signal",
          "signals",
          "subject-level resolution requires a single subject",
        ),
      ]),
    });
  }

  const candidates = buildCandidates(normalized);
  const { winner, explanations } = pickWinner(candidates);
  const suppressed = isSuppressionSignal(winner.signal);
  const assignment = freezeAssignment({
    subject: firstSubject,
    resolvedLevel: suppressed ? "suppressed" : winner.signal.requestedLevel,
    winningSignalId: winner.signal.signalId,
    contributingSignalIds: normalized.map((signal) => signal.signalId),
  });

  const outcome = freezeOutcome({
    primary: assignment.resolvedLevel === "primary" ? assignment : null,
    assignments: [assignment],
    winningSignalIds: [assignment.winningSignalId],
    retainedSignalIds: assignment.resolvedLevel === "primary" ||
        assignment.resolvedLevel === "suppressed"
      ? []
      : assignment.contributingSignalIds.filter(
        (id) => id !== assignment.winningSignalId,
      ),
    suppressedSignalIds: assignment.resolvedLevel === "suppressed"
      ? [...assignment.contributingSignalIds]
      : [],
    explanations,
  });

  return Object.freeze({ ok: true, outcome, issues: Object.freeze([]) });
}

export function resolveDirectorRuntimeAttentionPriority(
  batch: DirectorRuntimeAttentionSignalBatch,
): DirectorRuntimeAttentionPriorityResolutionResult {
  const batchValidation = validateDirectorRuntimeAttentionSignalBatch(batch);
  if (!batchValidation.valid) {
    return Object.freeze({
      ok: false,
      outcome: null,
      issues: Object.freeze([
        issue("invalid-batch", "batch", "batch failed DRI-6:2 validation"),
      ]),
    });
  }

  if (batch.signals.length === 0) {
    return Object.freeze({
      ok: true,
      outcome: DIRECTOR_RUNTIME_EMPTY_ATTENTION_RESOLUTION_OUTCOME,
      issues: Object.freeze([]),
    });
  }

  const normalizedBatch = createDirectorRuntimeAttentionSignalBatch({
    ...(batch.batchId === undefined ? {} : { batchId: batch.batchId }),
    ...(batch.correlationId === undefined ? {} : { correlationId: batch.correlationId }),
    signals: deduplicateDirectorRuntimeAttentionSignals(
      batch.signals.map((signal) => normalizeDirectorRuntimeAttentionSignal(signal)),
    ),
  });

  const candidates = buildCandidates(normalizedBatch.signals);
  const bySubject = new Map<string, DirectorRuntimeAttentionResolutionCandidate[]>();
  for (const candidate of candidates) {
    const key = subjectKey(candidate.signal.subject);
    const existing = bySubject.get(key);
    if (existing === undefined) bySubject.set(key, [candidate]);
    else existing.push(candidate);
  }

  const subjectAssignments: DirectorRuntimeResolvedAttentionAssignment[] = [];
  const explanations: DirectorRuntimeAttentionResolutionExplanation[] = [];

  for (const group of bySubject.values()) {
    const { winner, explanations: groupExplanations } = pickWinner(group);
    explanations.push(...groupExplanations);
    if (groupExplanations.length === 0 && group.length === 1) {
      // single-signal subject — no pairwise explanation required
    } else if (group.length > 1) {
      explanations.push(
        Object.freeze({
          winnerSignalId: winner.signal.signalId,
          loserSignalId: group.find((entry) =>
            entry.signal.signalId !== winner.signal.signalId)?.signal.signalId ??
            winner.signal.signalId,
          decisiveDimension: "same-subject-aggregation" as const,
          winnerValue: winner.signal.signalId,
          loserValue: "aggregated",
        }),
      );
    }

    const suppressed = isSuppressionSignal(winner.signal);
    subjectAssignments.push(freezeAssignment({
      subject: winner.signal.subject,
      resolvedLevel: suppressed ? "suppressed" : winner.signal.requestedLevel,
      winningSignalId: winner.signal.signalId,
      contributingSignalIds: group.map((entry) => entry.signal.signalId),
    }));
  }

  // Preserve first-seen subject order from input.
  const subjectOrder = new Map<string, number>();
  candidates.forEach((candidate) => {
    const key = subjectKey(candidate.signal.subject);
    if (!subjectOrder.has(key)) subjectOrder.set(key, candidate.inputIndex);
  });
  subjectAssignments.sort((left, right) =>
    (subjectOrder.get(subjectKey(left.subject)) ?? 0) -
    (subjectOrder.get(subjectKey(right.subject)) ?? 0));

  const primaryContenders = subjectAssignments.filter(
    (assignment) => assignment.resolvedLevel === "primary",
  );

  let primary: DirectorRuntimeResolvedAttentionAssignment | null = null;
  const finalized: DirectorRuntimeResolvedAttentionAssignment[] = [];

  if (primaryContenders.length === 0) {
    for (const assignment of subjectAssignments) finalized.push(assignment);
  } else {
    const contenderCandidates = primaryContenders.map((assignment) => {
      const winning = candidates.find(
        (candidate) => candidate.signal.signalId === assignment.winningSignalId,
      )!;
      return winning;
    });
    const { winner: primaryWinner, explanations: primaryExplanations } =
      pickWinner(contenderCandidates);
    explanations.push(...primaryExplanations);

    for (const assignment of subjectAssignments) {
      if (assignment.resolvedLevel !== "primary") {
        finalized.push(assignment);
        continue;
      }
      if (assignment.winningSignalId === primaryWinner.signal.signalId) {
        primary = assignment;
        finalized.push(assignment);
      } else {
        const demoted = freezeAssignment({
          ...assignment,
          resolvedLevel: demoteLevel(assignment.resolvedLevel),
        });
        finalized.push(demoted);
        explanations.push(Object.freeze({
          winnerSignalId: primaryWinner.signal.signalId,
          loserSignalId: assignment.winningSignalId,
          decisiveDimension: explainDirectorRuntimeAttentionSignalComparison(
            primaryWinner.signal,
            candidates.find((entry) =>
              entry.signal.signalId === assignment.winningSignalId)!.signal,
            primaryWinner.inputIndex,
            candidates.find((entry) =>
              entry.signal.signalId === assignment.winningSignalId)!.inputIndex,
          ).decisiveDimension,
          winnerValue: primaryWinner.signal.signalId,
          loserValue: assignment.winningSignalId,
        }));
      }
    }
  }

  const winningSignalIds = Object.freeze(
    finalized.map((assignment) => assignment.winningSignalId),
  );
  const suppressedSignalIds = Object.freeze(
    finalized
      .filter((assignment) => assignment.resolvedLevel === "suppressed")
      .flatMap((assignment) => [...assignment.contributingSignalIds]),
  );
  const retainedSignalIds = Object.freeze(
    finalized
      .filter((assignment) =>
        assignment.resolvedLevel !== "primary" &&
        assignment.resolvedLevel !== "suppressed")
      .flatMap((assignment) => [...assignment.contributingSignalIds]),
  );

  const outcome = freezeOutcome({
    primary,
    assignments: finalized,
    winningSignalIds,
    retainedSignalIds,
    suppressedSignalIds,
    explanations: Object.freeze(explanations.map((entry) => Object.freeze({ ...entry }))),
  });

  const outcomeValidation = validateDirectorRuntimeAttentionResolutionOutcome(outcome);
  if (!outcomeValidation.ok) {
    return Object.freeze({
      ok: false,
      outcome: null,
      issues: outcomeValidation.issues,
    });
  }

  return Object.freeze({ ok: true, outcome, issues: Object.freeze([]) });
}

// ─── Registry / capabilities ────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ATTENTION_PRIORITY_RESOLUTION_CAPABILITIES =
  Object.freeze([
    "PriorityVectorDerivation",
    "SignalComparison",
    "StableOrdering",
    "SubjectResolution",
    "BatchResolution",
    "PrimarySelection",
    "SecondaryRetention",
    "SuppressionResolution",
    "SameSubjectAggregation",
    "ResolutionExplanation",
  ] as const);

export const DIRECTOR_RUNTIME_ATTENTION_PRIORITY_RESOLUTION_ABSENT_CAPABILITIES =
  Object.freeze([
    "FocusContextBinding",
    "SceneBinding",
    "AttentionPathOrchestration",
    "TransitionOrchestration",
    "PresentationBehavior",
  ] as const);

export const DIRECTOR_RUNTIME_ATTENTION_PRIORITY_RESOLUTION_INVARIANTS =
  Object.freeze([
    Object.freeze({ id: "determinism", statement: "identical input produces identical resolution" }),
    Object.freeze({ id: "single-primary", statement: "outcome contains at most one primary assignment" }),
    Object.freeze({ id: "stable-ties", statement: "equal candidates retain first-seen input order" }),
    Object.freeze({ id: "upstream-immutability", statement: "resolution never mutates DRI-6:2 signals" }),
    Object.freeze({ id: "reason-precedence", statement: "higher-precedence reason wins when applicable" }),
    Object.freeze({ id: "source-precedence", statement: "source precedence resolves undecided reason ties" }),
    Object.freeze({ id: "level-precedence", statement: "requested level resolves earlier-dimension ties" }),
    Object.freeze({ id: "same-subject-aggregation", statement: "multiple signals may contribute to one assignment" }),
    Object.freeze({ id: "cross-subject-resolution", statement: "multiple primary requests yield one primary subject" }),
    Object.freeze({ id: "secondary-retention", statement: "non-winning subjects may remain below primary" }),
    Object.freeze({ id: "suppression-integrity", statement: "suppression is semantic and subject-specific" }),
    Object.freeze({ id: "explainability", statement: "non-trivial conflicts identify decisive dimension" }),
    Object.freeze({ id: "no-weighted-score", statement: "resolution uses lexicographic policy, not weighted scores" }),
    Object.freeze({ id: "no-presentation-leakage", statement: "resolution contracts contain no rendering metadata" }),
    Object.freeze({ id: "no-context-binding", statement: "no scene/workspace subject expansion occurs" }),
    Object.freeze({ id: "no-path-orchestration", statement: "no graph/path computation occurs" }),
    Object.freeze({ id: "no-transition-behavior", statement: "no focus history or transition orchestration occurs" }),
  ] as const);

export const directorRuntimeAttentionPriorityResolutionApiNames = Object.freeze([
  "deriveDirectorRuntimeAttentionPriorityVector",
  "compareDirectorRuntimeAttentionSignals",
  "explainDirectorRuntimeAttentionSignalComparison",
  "resolveDirectorRuntimeAttentionForSubject",
  "resolveDirectorRuntimeAttentionPriority",
  "validateDirectorRuntimeAttentionPriorityVector",
  "validateDirectorRuntimeResolvedAttentionAssignment",
  "validateDirectorRuntimeAttentionResolutionExplanation",
  "validateDirectorRuntimeAttentionResolutionOutcome",
  "verifyDirectorRuntimeAttentionPriorityResolution",
] as const);

export const directorRuntimeAttentionPriorityResolutionPolicy = Object.freeze({
  sourcePrecedence: DIRECTOR_RUNTIME_ATTENTION_SOURCE_PRECEDENCE,
  reasonPrecedence: DIRECTOR_RUNTIME_ATTENTION_REASON_PRECEDENCE,
  requestedLevelPrecedence: DIRECTOR_RUNTIME_ATTENTION_REQUESTED_LEVEL_PRECEDENCE,
  intentPrecedence: DIRECTOR_RUNTIME_ATTENTION_INTENT_PRECEDENCE,
  persistencePrecedence: DIRECTOR_RUNTIME_ATTENTION_PERSISTENCE_PRECEDENCE,
  decisionDimensions: DIRECTOR_RUNTIME_ATTENTION_DECISION_DIMENSIONS,
  comparisonOrder: DIRECTOR_RUNTIME_ATTENTION_COMPARISON_ORDER,
  comparisonModel: "lexicographic-not-weighted" as const,
  secondaryRetention: true as const,
  singlePrimary: true as const,
  suppressionSubjectSpecific: true as const,
});

export const directorRuntimeAttentionPriorityResolutionRegistry = Object.freeze({
  identity: directorRuntimeAttentionPriorityResolutionIdentity,
  version: directorRuntimeAttentionPriorityResolutionVersion,
  namespace: directorRuntimeAttentionPriorityResolutionNamespace,
  dependency: directorRuntimeAttentionPriorityResolutionUpstream,
  sourcePrecedence: DIRECTOR_RUNTIME_ATTENTION_SOURCE_PRECEDENCE,
  sourcePrecedenceCount: DIRECTOR_RUNTIME_ATTENTION_SOURCE_PRECEDENCE.length,
  reasonPrecedence: DIRECTOR_RUNTIME_ATTENTION_REASON_PRECEDENCE,
  reasonPrecedenceCount: DIRECTOR_RUNTIME_ATTENTION_REASON_PRECEDENCE.length,
  requestedLevelPrecedence: DIRECTOR_RUNTIME_ATTENTION_REQUESTED_LEVEL_PRECEDENCE,
  requestedLevelPrecedenceCount:
    DIRECTOR_RUNTIME_ATTENTION_REQUESTED_LEVEL_PRECEDENCE.length,
  intentPrecedence: DIRECTOR_RUNTIME_ATTENTION_INTENT_PRECEDENCE,
  intentPrecedenceCount: DIRECTOR_RUNTIME_ATTENTION_INTENT_PRECEDENCE.length,
  persistencePrecedence: DIRECTOR_RUNTIME_ATTENTION_PERSISTENCE_PRECEDENCE,
  decisionDimensions: DIRECTOR_RUNTIME_ATTENTION_DECISION_DIMENSIONS,
  decisionDimensionCount: DIRECTOR_RUNTIME_ATTENTION_DECISION_DIMENSIONS.length,
  policy: directorRuntimeAttentionPriorityResolutionPolicy,
  capabilities: DIRECTOR_RUNTIME_ATTENTION_PRIORITY_RESOLUTION_CAPABILITIES,
  capabilityCount: DIRECTOR_RUNTIME_ATTENTION_PRIORITY_RESOLUTION_CAPABILITIES.length,
  absentCapabilities: DIRECTOR_RUNTIME_ATTENTION_PRIORITY_RESOLUTION_ABSENT_CAPABILITIES,
  emptyOutcome: DIRECTOR_RUNTIME_EMPTY_ATTENTION_RESOLUTION_OUTCOME,
  invariants: DIRECTOR_RUNTIME_ATTENTION_PRIORITY_RESOLUTION_INVARIANTS,
  invariantCount: DIRECTOR_RUNTIME_ATTENTION_PRIORITY_RESOLUTION_INVARIANTS.length,
  publicApis: directorRuntimeAttentionPriorityResolutionApiNames,
  publicApiCount: directorRuntimeAttentionPriorityResolutionApiNames.length,
  foundationVocabulary: Object.freeze({
    signalSources: DIRECTOR_RUNTIME_ATTENTION_SIGNAL_SOURCES,
    reasonKinds: DIRECTOR_RUNTIME_ATTENTION_REASON_KINDS,
    attentionLevels: DIRECTOR_RUNTIME_ATTENTION_FOCUS_LEVELS,
    intents: DIRECTOR_RUNTIME_ATTENTION_SIGNAL_INTENTS,
    persistenceValues: DIRECTOR_RUNTIME_ATTENTION_PERSISTENCE_VALUES,
  }),
});

export const directorRuntimeAttentionPriorityResolution = Object.freeze({
  phase: "DRI-6:3" as const,
  name: "DirectorRuntimeAttentionPriorityResolution" as const,
  identity: directorRuntimeAttentionPriorityResolutionIdentity,
  namespace: directorRuntimeAttentionPriorityResolutionNamespace,
  version: directorRuntimeAttentionPriorityResolutionVersion,
  layer: "Director Runtime Integration" as const,
  domain: "AttentionFocusOrchestration" as const,
  role: "AttentionPriorityResolution" as const,
  stage: "AttentionPriorityResolution" as const,
  status: "PriorityResolutionReady" as const,
  upstreamDependency: directorRuntimeAttentionPriorityResolutionUpstream,
  deterministic: true as const,
  rendererIndependent: true as const,
  philosophy: "policy-not-presentation" as const,
  policy: directorRuntimeAttentionPriorityResolutionPolicy,
  capabilities: DIRECTOR_RUNTIME_ATTENTION_PRIORITY_RESOLUTION_CAPABILITIES,
  absentCapabilities: DIRECTOR_RUNTIME_ATTENTION_PRIORITY_RESOLUTION_ABSENT_CAPABILITIES,
  emptyOutcome: DIRECTOR_RUNTIME_EMPTY_ATTENTION_RESOLUTION_OUTCOME,
  invariants: DIRECTOR_RUNTIME_ATTENTION_PRIORITY_RESOLUTION_INVARIANTS,
  publicApiSurface: directorRuntimeAttentionPriorityResolutionApiNames,
  registry: directorRuntimeAttentionPriorityResolutionRegistry,
  signalContractsBoundary: "DRI-6:2-attention-signal-contracts-only" as const,
  architecturalStatus:
    "Established · Deterministic · Immutable · Explainable · PriorityResolutionReady" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface DirectorRuntimeAttentionPriorityResolutionVerification {
  readonly ok: boolean;
  readonly identity: typeof directorRuntimeAttentionPriorityResolutionIdentity;
  readonly version: typeof directorRuntimeAttentionPriorityResolutionVersion;
  readonly namespace: typeof directorRuntimeAttentionPriorityResolutionNamespace;
  readonly dependency: typeof directorRuntimeAttentionPriorityResolutionUpstream;
  readonly sourcePrecedenceCount: number;
  readonly reasonPrecedenceCount: number;
  readonly requestedLevelPrecedenceCount: number;
  readonly intentPrecedenceCount: number;
  readonly decisionDimensionCount: number;
  readonly capabilityCount: number;
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

export function verifyDirectorRuntimeAttentionPriorityResolution():
  DirectorRuntimeAttentionPriorityResolutionVerification {
  const layer = directorRuntimeAttentionPriorityResolution;
  const registry = directorRuntimeAttentionPriorityResolutionRegistry;

  const ok =
    layer.identity === "DRI-6:3/DirectorRuntimeAttentionPriorityResolution" &&
    layer.version === "6.3.0" &&
    layer.namespace === "nexora.dri.attention-focus.priority-resolution" &&
    layer.role === "AttentionPriorityResolution" &&
    layer.status === "PriorityResolutionReady" &&
    layer.upstreamDependency ===
      "DRI-6:2/DirectorRuntimeAttentionSignalContracts" &&
    layer.upstreamDependency === directorRuntimeAttentionSignalContractsIdentity &&
    registry.dependency === layer.upstreamDependency &&
    exactOrder(DIRECTOR_RUNTIME_ATTENTION_SOURCE_PRECEDENCE, [
      "user-interaction",
      "execution",
      "decision",
      "problem",
      "kpi",
      "koi",
      "goal",
      "scenario",
      "advisor",
      "runtime-state",
      "system",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_ATTENTION_REASON_PRECEDENCE, [
      "critical-state",
      "risk",
      "warning",
      "explicit-selection",
      "execution-relevance",
      "decision-relevance",
      "goal-relevance",
      "scenario-relevance",
      "advisor-relevance",
      "dependency",
      "context-relevance",
      "system-relevance",
    ]) &&
    exactOrder([...DIRECTOR_RUNTIME_ATTENTION_REQUESTED_LEVEL_PRECEDENCE], [
      "primary",
      "secondary",
      "context",
      "background",
      "suppressed",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_ATTENTION_INTENT_PRECEDENCE, [
      "request-focus",
      "request-support",
      "request-context",
      "request-awareness",
      "request-suppression",
    ]) &&
    unique([...DIRECTOR_RUNTIME_ATTENTION_SOURCE_PRECEDENCE]) &&
    unique([...DIRECTOR_RUNTIME_ATTENTION_REASON_PRECEDENCE]) &&
    DIRECTOR_RUNTIME_ATTENTION_SOURCE_PRECEDENCE.length ===
      DIRECTOR_RUNTIME_ATTENTION_SIGNAL_SOURCES.length &&
    DIRECTOR_RUNTIME_ATTENTION_REASON_PRECEDENCE.length ===
      DIRECTOR_RUNTIME_ATTENTION_REASON_KINDS.length &&
    !DIRECTOR_RUNTIME_ATTENTION_PRIORITY_RESOLUTION_CAPABILITIES.includes(
      "FocusContextBinding" as never,
    ) &&
    layer.policy.comparisonModel === "lexicographic-not-weighted" &&
    Object.isFrozen(layer) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(directorRuntimeAttentionPriorityResolutionPolicy) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EMPTY_ATTENTION_RESOLUTION_OUTCOME);

  return Object.freeze({
    ok,
    identity: directorRuntimeAttentionPriorityResolutionIdentity,
    version: directorRuntimeAttentionPriorityResolutionVersion,
    namespace: directorRuntimeAttentionPriorityResolutionNamespace,
    dependency: directorRuntimeAttentionPriorityResolutionUpstream,
    sourcePrecedenceCount: DIRECTOR_RUNTIME_ATTENTION_SOURCE_PRECEDENCE.length,
    reasonPrecedenceCount: DIRECTOR_RUNTIME_ATTENTION_REASON_PRECEDENCE.length,
    requestedLevelPrecedenceCount:
      DIRECTOR_RUNTIME_ATTENTION_REQUESTED_LEVEL_PRECEDENCE.length,
    intentPrecedenceCount: DIRECTOR_RUNTIME_ATTENTION_INTENT_PRECEDENCE.length,
    decisionDimensionCount: DIRECTOR_RUNTIME_ATTENTION_DECISION_DIMENSIONS.length,
    capabilityCount: DIRECTOR_RUNTIME_ATTENTION_PRIORITY_RESOLUTION_CAPABILITIES.length,
    invariantCount: DIRECTOR_RUNTIME_ATTENTION_PRIORITY_RESOLUTION_INVARIANTS.length,
    frozen: Object.isFrozen(layer) && Object.isFrozen(registry),
  });
}
