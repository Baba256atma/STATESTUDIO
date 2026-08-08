/**
 * DRI-6:2 — Director Runtime Attention Signal Contracts.
 *
 * Canonical structure for representing, classifying, validating, normalizing,
 * and inspecting executive attention requests before priority resolution.
 * Signals are attention requests — not resolved focus.
 */

import {
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_LEVELS,
  DIRECTOR_RUNTIME_ATTENTION_PERSISTENCE_VALUES,
  DIRECTOR_RUNTIME_ATTENTION_REASON_KINDS,
  DIRECTOR_RUNTIME_ATTENTION_SCOPES,
  DIRECTOR_RUNTIME_ATTENTION_SIGNAL_SOURCES,
  createDirectorRuntimeAttentionSubjectReference,
  directorRuntimeAttentionFocusFoundationIdentity,
  isDirectorRuntimeAttentionFocusLevel,
  isDirectorRuntimeAttentionPersistence,
  isDirectorRuntimeAttentionReasonKind,
  isDirectorRuntimeAttentionScope,
  isDirectorRuntimeAttentionSignalSource,
  isDirectorRuntimeAttentionSubjectReference,
  validateDirectorRuntimeAttentionSubjectReference,
  type DirectorRuntimeAttentionFocusLevel,
  type DirectorRuntimeAttentionPersistence,
  type DirectorRuntimeAttentionReasonKind,
  type DirectorRuntimeAttentionScope,
  type DirectorRuntimeAttentionSignalSource,
  type DirectorRuntimeAttentionSubjectReference,
} from "@/app/lib/dri/directorRuntimeAttentionFocusFoundation";

export {
  DIRECTOR_RUNTIME_ATTENTION_FOCUS_LEVELS,
  DIRECTOR_RUNTIME_ATTENTION_PERSISTENCE_VALUES,
  DIRECTOR_RUNTIME_ATTENTION_REASON_KINDS,
  DIRECTOR_RUNTIME_ATTENTION_SCOPES,
  DIRECTOR_RUNTIME_ATTENTION_SIGNAL_SOURCES,
  createDirectorRuntimeAttentionSubjectReference,
  isDirectorRuntimeAttentionFocusLevel,
  isDirectorRuntimeAttentionPersistence,
  isDirectorRuntimeAttentionReasonKind,
  isDirectorRuntimeAttentionScope,
  isDirectorRuntimeAttentionSignalSource,
  isDirectorRuntimeAttentionSubjectReference,
  validateDirectorRuntimeAttentionSubjectReference,
};

export type {
  DirectorRuntimeAttentionFocusLevel,
  DirectorRuntimeAttentionPersistence,
  DirectorRuntimeAttentionReasonKind,
  DirectorRuntimeAttentionScope,
  DirectorRuntimeAttentionSignalSource,
  DirectorRuntimeAttentionSubjectReference,
} from "@/app/lib/dri/directorRuntimeAttentionFocusFoundation";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeAttentionSignalContractsIdentity =
  "DRI-6:2/DirectorRuntimeAttentionSignalContracts" as const;
export const directorRuntimeAttentionSignalContractsVersion = "6.2.0" as const;
export const directorRuntimeAttentionSignalContractsNamespace =
  "nexora.dri.attention-focus.signal-contracts" as const;
export const directorRuntimeAttentionSignalContractsUpstream =
  directorRuntimeAttentionFocusFoundationIdentity;

export const directorRuntimeAttentionSignalContractsCanonicalIdentity =
  Object.freeze({
    identity: directorRuntimeAttentionSignalContractsIdentity,
    version: directorRuntimeAttentionSignalContractsVersion,
    namespace: directorRuntimeAttentionSignalContractsNamespace,
    upstream: directorRuntimeAttentionSignalContractsUpstream,
  });

// ─── Signal categories ──────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ATTENTION_SIGNAL_CATEGORIES = Object.freeze([
  "interaction",
  "state",
  "goal",
  "performance",
  "problem",
  "scenario",
  "decision",
  "execution",
  "advisor",
  "system",
] as const);
export type DirectorRuntimeAttentionSignalCategory =
  (typeof DIRECTOR_RUNTIME_ATTENTION_SIGNAL_CATEGORIES)[number];

export const DIRECTOR_RUNTIME_ATTENTION_SIGNAL_SOURCE_CATEGORY_MAP =
  Object.freeze({
    "user-interaction": "interaction",
    "runtime-state": "state",
    goal: "goal",
    kpi: "performance",
    koi: "performance",
    problem: "problem",
    scenario: "scenario",
    decision: "decision",
    execution: "execution",
    advisor: "advisor",
    system: "system",
  } as const satisfies Record<
    DirectorRuntimeAttentionSignalSource,
    DirectorRuntimeAttentionSignalCategory
  >);

export function resolveDirectorRuntimeAttentionSignalCategory(
  source: DirectorRuntimeAttentionSignalSource,
): DirectorRuntimeAttentionSignalCategory {
  return DIRECTOR_RUNTIME_ATTENTION_SIGNAL_SOURCE_CATEGORY_MAP[source];
}

// ─── Signal intents ─────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ATTENTION_SIGNAL_INTENTS = Object.freeze([
  "request-focus",
  "request-support",
  "request-context",
  "request-awareness",
  "request-suppression",
] as const);
export type DirectorRuntimeAttentionSignalIntent =
  (typeof DIRECTOR_RUNTIME_ATTENTION_SIGNAL_INTENTS)[number];

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface DirectorRuntimeAttentionSignalIdentity {
  readonly signalId: string;
}

export interface DirectorRuntimeAttentionSignalOriginReference {
  readonly source: DirectorRuntimeAttentionSignalSource;
  readonly originId?: string;
}

/**
 * Canonical DRI-6:2 attention signal contract.
 * Extends foundation vocabulary with intent and optional origin/correlation metadata.
 * Distinct from any future resolved focus state.
 */
export interface DirectorRuntimeAttentionSignal {
  readonly signalId: string;
  readonly subject: DirectorRuntimeAttentionSubjectReference;
  readonly source: DirectorRuntimeAttentionSignalSource;
  readonly reason: DirectorRuntimeAttentionReasonKind;
  readonly scope: DirectorRuntimeAttentionScope;
  readonly requestedLevel: DirectorRuntimeAttentionFocusLevel;
  readonly persistence: DirectorRuntimeAttentionPersistence;
  readonly intent: DirectorRuntimeAttentionSignalIntent;
  readonly origin?: DirectorRuntimeAttentionSignalOriginReference;
  readonly correlationId?: string;
  readonly groupId?: string;
}

export type DirectorRuntimeAttentionSignalCollection =
  readonly DirectorRuntimeAttentionSignal[];

export interface DirectorRuntimeAttentionSignalGroup {
  readonly groupId: string;
  readonly signals: DirectorRuntimeAttentionSignalCollection;
}

export interface DirectorRuntimeAttentionSignalBatch {
  readonly batchId?: string;
  readonly correlationId?: string;
  readonly signals: DirectorRuntimeAttentionSignalCollection;
}

export const DIRECTOR_RUNTIME_EMPTY_ATTENTION_SIGNAL_BATCH = Object.freeze({
  signals: Object.freeze([]) as DirectorRuntimeAttentionSignalCollection,
}) satisfies DirectorRuntimeAttentionSignalBatch;

// ─── Validation ─────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ATTENTION_SIGNAL_CONTRACT_ISSUE_CODES =
  Object.freeze([
    "invalid-signal-identity",
    "invalid-signal-category",
    "invalid-signal-intent",
    "invalid-signal-origin",
    "invalid-subject-reference",
    "invalid-signal-source",
    "invalid-reason-kind",
    "invalid-scope",
    "invalid-requested-level",
    "invalid-persistence",
    "invalid-attention-signal",
    "invalid-signal-group",
    "invalid-signal-batch",
    "invalid-group-id",
    "invalid-batch-entry",
    "invalid-correlation-id",
  ] as const);
export type DirectorRuntimeAttentionSignalContractIssueCode =
  (typeof DIRECTOR_RUNTIME_ATTENTION_SIGNAL_CONTRACT_ISSUE_CODES)[number];

export interface DirectorRuntimeAttentionSignalContractIssue {
  readonly code: DirectorRuntimeAttentionSignalContractIssueCode;
  readonly path: string;
  readonly message: string;
}

export interface DirectorRuntimeAttentionSignalContractValidationResult {
  readonly valid: boolean;
  readonly issues: readonly DirectorRuntimeAttentionSignalContractIssue[];
}

function issue(
  code: DirectorRuntimeAttentionSignalContractIssueCode,
  path: string,
  message: string,
): DirectorRuntimeAttentionSignalContractIssue {
  return Object.freeze({ code, path, message });
}

function freezeValidationResult(
  issues: readonly DirectorRuntimeAttentionSignalContractIssue[],
): DirectorRuntimeAttentionSignalContractValidationResult {
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

export function isDirectorRuntimeAttentionSignalCategory(
  value: unknown,
): value is DirectorRuntimeAttentionSignalCategory {
  return (DIRECTOR_RUNTIME_ATTENTION_SIGNAL_CATEGORIES as readonly unknown[])
    .includes(value);
}

export function isDirectorRuntimeAttentionSignalIntent(
  value: unknown,
): value is DirectorRuntimeAttentionSignalIntent {
  return (DIRECTOR_RUNTIME_ATTENTION_SIGNAL_INTENTS as readonly unknown[])
    .includes(value);
}

export function validateDirectorRuntimeAttentionSignalIdentity(
  value: unknown,
): DirectorRuntimeAttentionSignalContractValidationResult {
  if (!isPlainObject(value)) {
    return freezeValidationResult([
      issue("invalid-signal-identity", "identity", "identity must be a plain object"),
    ]);
  }
  if (!isNonEmptyString(value.signalId)) {
    return freezeValidationResult([
      issue(
        "invalid-signal-identity",
        "identity.signalId",
        "signalId must be a non-empty string",
      ),
    ]);
  }
  return freezeValidationResult([]);
}

export function isDirectorRuntimeAttentionSignalIdentity(
  value: unknown,
): value is DirectorRuntimeAttentionSignalIdentity {
  return validateDirectorRuntimeAttentionSignalIdentity(value).valid;
}

function collectOriginIssues(
  value: unknown,
  path: string,
): DirectorRuntimeAttentionSignalContractIssue[] {
  if (value === undefined) return [];
  if (!isPlainObject(value)) {
    return [issue("invalid-signal-origin", path, "origin must be a plain object")];
  }
  const issues: DirectorRuntimeAttentionSignalContractIssue[] = [];
  if (!isDirectorRuntimeAttentionSignalSource(value.source)) {
    issues.push(
      issue("invalid-signal-source", `${path}.source`, "origin.source must be canonical"),
    );
  }
  if (value.originId !== undefined && !isNonEmptyString(value.originId)) {
    issues.push(
      issue(
        "invalid-signal-origin",
        `${path}.originId`,
        "originId must be a non-empty string when provided",
      ),
    );
  }
  return issues;
}

export function validateDirectorRuntimeAttentionSignalOriginReference(
  value: unknown,
): DirectorRuntimeAttentionSignalContractValidationResult {
  if (value === undefined) {
    return freezeValidationResult([
      issue("invalid-signal-origin", "origin", "origin reference is required"),
    ]);
  }
  return freezeValidationResult(collectOriginIssues(value, "origin"));
}

export function isDirectorRuntimeAttentionSignalOriginReference(
  value: unknown,
): value is DirectorRuntimeAttentionSignalOriginReference {
  return validateDirectorRuntimeAttentionSignalOriginReference(value).valid;
}

function collectSignalIssues(
  value: unknown,
  path = "signal",
): DirectorRuntimeAttentionSignalContractIssue[] {
  if (!isPlainObject(value)) {
    return [
      issue("invalid-attention-signal", path, "signal must be a plain object"),
    ];
  }
  const issues: DirectorRuntimeAttentionSignalContractIssue[] = [];

  if (!isNonEmptyString(value.signalId)) {
    issues.push(
      issue(
        "invalid-signal-identity",
        `${path}.signalId`,
        "signalId must be a non-empty string",
      ),
    );
  }

  const subjectValidation = validateDirectorRuntimeAttentionSubjectReference(
    value.subject,
  );
  if (!subjectValidation.valid) {
    for (const subjectIssue of subjectValidation.issues) {
      const suffix = subjectIssue.path.startsWith("subject")
        ? subjectIssue.path.slice("subject".length)
        : `.${subjectIssue.path}`;
      issues.push(
        issue(
          "invalid-subject-reference",
          `${path}.subject${suffix}`,
          subjectIssue.message,
        ),
      );
    }
  }

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
        "invalid-requested-level",
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
  if (!isDirectorRuntimeAttentionSignalIntent(value.intent)) {
    issues.push(
      issue("invalid-signal-intent", `${path}.intent`, "intent must be canonical"),
    );
  }
  issues.push(...collectOriginIssues(value.origin, `${path}.origin`));
  if (value.correlationId !== undefined && !isNonEmptyString(value.correlationId)) {
    issues.push(
      issue(
        "invalid-correlation-id",
        `${path}.correlationId`,
        "correlationId must be a non-empty string when provided",
      ),
    );
  }
  if (value.groupId !== undefined && !isNonEmptyString(value.groupId)) {
    issues.push(
      issue(
        "invalid-group-id",
        `${path}.groupId`,
        "groupId must be a non-empty string when provided",
      ),
    );
  }
  return issues;
}

export function validateDirectorRuntimeAttentionSignal(
  value: unknown,
): DirectorRuntimeAttentionSignalContractValidationResult {
  return freezeValidationResult(collectSignalIssues(value));
}

export function isDirectorRuntimeAttentionSignal(
  value: unknown,
): value is DirectorRuntimeAttentionSignal {
  return validateDirectorRuntimeAttentionSignal(value).valid;
}

export function validateDirectorRuntimeAttentionSignalCategory(
  value: unknown,
): DirectorRuntimeAttentionSignalContractValidationResult {
  if (!isDirectorRuntimeAttentionSignalCategory(value)) {
    return freezeValidationResult([
      issue("invalid-signal-category", "category", "category must be canonical"),
    ]);
  }
  return freezeValidationResult([]);
}

export function validateDirectorRuntimeAttentionSignalIntent(
  value: unknown,
): DirectorRuntimeAttentionSignalContractValidationResult {
  if (!isDirectorRuntimeAttentionSignalIntent(value)) {
    return freezeValidationResult([
      issue("invalid-signal-intent", "intent", "intent must be canonical"),
    ]);
  }
  return freezeValidationResult([]);
}

function collectGroupIssues(
  value: unknown,
  path = "group",
): DirectorRuntimeAttentionSignalContractIssue[] {
  if (!isPlainObject(value)) {
    return [issue("invalid-signal-group", path, "signal group must be a plain object")];
  }
  const issues: DirectorRuntimeAttentionSignalContractIssue[] = [];
  if (!isNonEmptyString(value.groupId)) {
    issues.push(
      issue("invalid-group-id", `${path}.groupId`, "groupId must be a non-empty string"),
    );
  }
  if (!Array.isArray(value.signals)) {
    issues.push(
      issue("invalid-batch-entry", `${path}.signals`, "signals must be an array"),
    );
  } else {
    value.signals.forEach((entry, index) => {
      issues.push(...collectSignalIssues(entry, `${path}.signals[${index}]`));
    });
  }
  return issues;
}

export function validateDirectorRuntimeAttentionSignalGroup(
  value: unknown,
): DirectorRuntimeAttentionSignalContractValidationResult {
  return freezeValidationResult(collectGroupIssues(value));
}

export function isDirectorRuntimeAttentionSignalGroup(
  value: unknown,
): value is DirectorRuntimeAttentionSignalGroup {
  return validateDirectorRuntimeAttentionSignalGroup(value).valid;
}

function collectBatchIssues(
  value: unknown,
  path = "batch",
): DirectorRuntimeAttentionSignalContractIssue[] {
  if (!isPlainObject(value)) {
    return [issue("invalid-signal-batch", path, "signal batch must be a plain object")];
  }
  const issues: DirectorRuntimeAttentionSignalContractIssue[] = [];
  if (value.batchId !== undefined && !isNonEmptyString(value.batchId)) {
    issues.push(
      issue(
        "invalid-signal-identity",
        `${path}.batchId`,
        "batchId must be a non-empty string when provided",
      ),
    );
  }
  if (value.correlationId !== undefined && !isNonEmptyString(value.correlationId)) {
    issues.push(
      issue(
        "invalid-correlation-id",
        `${path}.correlationId`,
        "correlationId must be a non-empty string when provided",
      ),
    );
  }
  if (!Array.isArray(value.signals)) {
    issues.push(
      issue("invalid-batch-entry", `${path}.signals`, "signals must be an array"),
    );
  } else {
    value.signals.forEach((entry, index) => {
      issues.push(...collectSignalIssues(entry, `${path}.signals[${index}]`));
    });
  }
  return issues;
}

export function validateDirectorRuntimeAttentionSignalBatch(
  value: unknown,
): DirectorRuntimeAttentionSignalContractValidationResult {
  return freezeValidationResult(collectBatchIssues(value));
}

export function isDirectorRuntimeAttentionSignalBatch(
  value: unknown,
): value is DirectorRuntimeAttentionSignalBatch {
  return validateDirectorRuntimeAttentionSignalBatch(value).valid;
}

// ─── Normalization ──────────────────────────────────────────────────────────

function trimOptional(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}

export function normalizeDirectorRuntimeAttentionSignal(
  signal: DirectorRuntimeAttentionSignal,
): DirectorRuntimeAttentionSignal {
  const origin = signal.origin === undefined
    ? undefined
    : Object.freeze({
      source: signal.origin.source,
      ...(trimOptional(signal.origin.originId) === undefined
        ? {}
        : { originId: trimOptional(signal.origin.originId) }),
    });
  const correlationId = trimOptional(signal.correlationId);
  const groupId = trimOptional(signal.groupId);

  return Object.freeze({
    signalId: signal.signalId.trim(),
    subject: createDirectorRuntimeAttentionSubjectReference(signal.subject),
    source: signal.source,
    reason: signal.reason,
    scope: signal.scope,
    requestedLevel: signal.requestedLevel,
    persistence: signal.persistence,
    intent: signal.intent,
    ...(origin === undefined ? {} : { origin }),
    ...(correlationId === undefined ? {} : { correlationId }),
    ...(groupId === undefined ? {} : { groupId }),
  });
}

export function createDirectorRuntimeAttentionSignal(
  input: DirectorRuntimeAttentionSignal,
): DirectorRuntimeAttentionSignal {
  return normalizeDirectorRuntimeAttentionSignal(input);
}

export function createDirectorRuntimeAttentionSignalGroup(
  input: DirectorRuntimeAttentionSignalGroup,
): DirectorRuntimeAttentionSignalGroup {
  return Object.freeze({
    groupId: input.groupId.trim(),
    signals: Object.freeze(
      input.signals.map((entry) => normalizeDirectorRuntimeAttentionSignal(entry)),
    ),
  });
}

export function createDirectorRuntimeAttentionSignalBatch(
  input: DirectorRuntimeAttentionSignalBatch,
): DirectorRuntimeAttentionSignalBatch {
  const batchId = trimOptional(input.batchId);
  const correlationId = trimOptional(input.correlationId);
  return Object.freeze({
    ...(batchId === undefined ? {} : { batchId }),
    ...(correlationId === undefined ? {} : { correlationId }),
    signals: Object.freeze(
      input.signals.map((entry) => normalizeDirectorRuntimeAttentionSignal(entry)),
    ),
  });
}

// ─── Inspection / matching ──────────────────────────────────────────────────

export function getDirectorRuntimeAttentionSignalCategory(
  signal: DirectorRuntimeAttentionSignal,
): DirectorRuntimeAttentionSignalCategory {
  return resolveDirectorRuntimeAttentionSignalCategory(signal.source);
}

export function isUserInteractionAttentionSignal(
  signal: DirectorRuntimeAttentionSignal,
): boolean {
  return signal.source === "user-interaction";
}

export function isPerformanceAttentionSignal(
  signal: DirectorRuntimeAttentionSignal,
): boolean {
  return getDirectorRuntimeAttentionSignalCategory(signal) === "performance";
}

export function isAdvisorAttentionSignal(
  signal: DirectorRuntimeAttentionSignal,
): boolean {
  return signal.source === "advisor";
}

export function isExecutionAttentionSignal(
  signal: DirectorRuntimeAttentionSignal,
): boolean {
  return signal.source === "execution";
}

export function isSuppressionAttentionSignal(
  signal: DirectorRuntimeAttentionSignal,
): boolean {
  return signal.intent === "request-suppression" ||
    signal.requestedLevel === "suppressed";
}

export function matchesDirectorRuntimeAttentionSignalSource(
  signal: DirectorRuntimeAttentionSignal,
  source: DirectorRuntimeAttentionSignalSource,
): boolean {
  return signal.source === source;
}

export function matchesDirectorRuntimeAttentionSignalCategory(
  signal: DirectorRuntimeAttentionSignal,
  category: DirectorRuntimeAttentionSignalCategory,
): boolean {
  return getDirectorRuntimeAttentionSignalCategory(signal) === category;
}

export function matchesDirectorRuntimeAttentionSignalIntent(
  signal: DirectorRuntimeAttentionSignal,
  intent: DirectorRuntimeAttentionSignalIntent,
): boolean {
  return signal.intent === intent;
}

export function matchesDirectorRuntimeAttentionSignalSubject(
  signal: DirectorRuntimeAttentionSignal,
  subject: DirectorRuntimeAttentionSubjectReference,
): boolean {
  return areDirectorRuntimeAttentionSubjectsEqual(signal.subject, subject);
}

export function areDirectorRuntimeAttentionSubjectsEqual(
  left: DirectorRuntimeAttentionSubjectReference,
  right: DirectorRuntimeAttentionSubjectReference,
): boolean {
  return left.subjectId === right.subjectId &&
    left.subjectKind === right.subjectKind;
}

function originKey(
  origin: DirectorRuntimeAttentionSignalOriginReference | undefined,
): string {
  if (origin === undefined) return "";
  return `${origin.source}\u0000${origin.originId ?? ""}`;
}

export function areDirectorRuntimeAttentionSignalsEquivalent(
  left: DirectorRuntimeAttentionSignal,
  right: DirectorRuntimeAttentionSignal,
): boolean {
  return left.signalId === right.signalId &&
    areDirectorRuntimeAttentionSubjectsEqual(left.subject, right.subject) &&
    left.source === right.source &&
    left.reason === right.reason &&
    left.scope === right.scope &&
    left.requestedLevel === right.requestedLevel &&
    left.persistence === right.persistence &&
    left.intent === right.intent &&
    originKey(left.origin) === originKey(right.origin) &&
    (left.correlationId ?? "") === (right.correlationId ?? "") &&
    (left.groupId ?? "") === (right.groupId ?? "");
}

export function deduplicateDirectorRuntimeAttentionSignals(
  signals: DirectorRuntimeAttentionSignalCollection,
): DirectorRuntimeAttentionSignalCollection {
  const result: DirectorRuntimeAttentionSignal[] = [];
  for (const signal of signals) {
    const alreadySeen = result.some((entry) =>
      areDirectorRuntimeAttentionSignalsEquivalent(entry, signal));
    if (!alreadySeen) result.push(signal);
  }
  return Object.freeze([...result]);
}

// ─── Capabilities / registry ────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_ATTENTION_SIGNAL_CONTRACT_CAPABILITIES =
  Object.freeze([
    "SignalDefinition",
    "SignalCategorization",
    "SignalGrouping",
    "SignalBatching",
    "SignalValidation",
    "SignalNormalization",
    "SignalInspection",
    "SignalEquivalence",
    "SignalDeduplication",
  ] as const);

export const DIRECTOR_RUNTIME_ATTENTION_SIGNAL_CONTRACT_ABSENT_CAPABILITIES =
  Object.freeze([
    "PriorityResolution",
    "FocusBinding",
    "PathOrchestration",
    "TransitionOrchestration",
  ] as const);

export const DIRECTOR_RUNTIME_ATTENTION_SIGNAL_CONTRACT_INVARIANTS =
  Object.freeze([
    Object.freeze({
      id: "canonical-source-mapping",
      statement: "every foundation signal source maps to exactly one signal category",
    }),
    Object.freeze({
      id: "exhaustive-mapping",
      statement: "no canonical source is unmapped",
    }),
    Object.freeze({
      id: "signal-identity-integrity",
      statement: "every valid signal has a non-empty canonical identity",
    }),
    Object.freeze({
      id: "subject-integrity",
      statement: "every signal contains a valid foundation subject reference",
    }),
    Object.freeze({
      id: "semantic-integrity",
      statement:
        "every signal contains valid source, reason, scope, requested level, persistence, and intent",
    }),
    Object.freeze({
      id: "no-priority-fields",
      statement: "signals contain no priority, score, weight, ranking, or winner information",
    }),
    Object.freeze({
      id: "group-integrity",
      statement: "every signal within a valid group independently validates",
    }),
    Object.freeze({
      id: "batch-integrity",
      statement: "every signal within a valid batch independently validates",
    }),
    Object.freeze({
      id: "deduplication-stability",
      statement: "exact duplicates are removed while first-seen order is preserved",
    }),
    Object.freeze({
      id: "no-conflict-resolution",
      statement: "different valid signals concerning the same subject remain distinct",
    }),
    Object.freeze({
      id: "input-immutability",
      statement:
        "validation, normalization, inspection, grouping, batching, and deduplication do not mutate caller data",
    }),
    Object.freeze({
      id: "no-presentation-leakage",
      statement: "signal contracts contain no presentation-specific properties",
    }),
  ] as const);

export const directorRuntimeAttentionSignalContractsApiNames = Object.freeze([
  "resolveDirectorRuntimeAttentionSignalCategory",
  "getDirectorRuntimeAttentionSignalCategory",
  "validateDirectorRuntimeAttentionSignalIdentity",
  "validateDirectorRuntimeAttentionSignalCategory",
  "validateDirectorRuntimeAttentionSignalIntent",
  "validateDirectorRuntimeAttentionSignalOriginReference",
  "validateDirectorRuntimeAttentionSignal",
  "validateDirectorRuntimeAttentionSignalGroup",
  "validateDirectorRuntimeAttentionSignalBatch",
  "normalizeDirectorRuntimeAttentionSignal",
  "createDirectorRuntimeAttentionSignal",
  "createDirectorRuntimeAttentionSignalGroup",
  "createDirectorRuntimeAttentionSignalBatch",
  "isUserInteractionAttentionSignal",
  "isPerformanceAttentionSignal",
  "isAdvisorAttentionSignal",
  "isExecutionAttentionSignal",
  "isSuppressionAttentionSignal",
  "matchesDirectorRuntimeAttentionSignalSource",
  "matchesDirectorRuntimeAttentionSignalCategory",
  "matchesDirectorRuntimeAttentionSignalIntent",
  "matchesDirectorRuntimeAttentionSignalSubject",
  "areDirectorRuntimeAttentionSubjectsEqual",
  "areDirectorRuntimeAttentionSignalsEquivalent",
  "deduplicateDirectorRuntimeAttentionSignals",
  "verifyDirectorRuntimeAttentionSignalContracts",
] as const);

export const directorRuntimeAttentionSignalContractsRegistry = Object.freeze({
  identity: directorRuntimeAttentionSignalContractsIdentity,
  version: directorRuntimeAttentionSignalContractsVersion,
  namespace: directorRuntimeAttentionSignalContractsNamespace,
  dependency: directorRuntimeAttentionSignalContractsUpstream,
  signalCategories: DIRECTOR_RUNTIME_ATTENTION_SIGNAL_CATEGORIES,
  signalCategoryCount: DIRECTOR_RUNTIME_ATTENTION_SIGNAL_CATEGORIES.length,
  signalIntents: DIRECTOR_RUNTIME_ATTENTION_SIGNAL_INTENTS,
  signalIntentCount: DIRECTOR_RUNTIME_ATTENTION_SIGNAL_INTENTS.length,
  sourceCategoryMap: DIRECTOR_RUNTIME_ATTENTION_SIGNAL_SOURCE_CATEGORY_MAP,
  sourceCategoryMapCount: DIRECTOR_RUNTIME_ATTENTION_SIGNAL_SOURCES.length,
  capabilities: DIRECTOR_RUNTIME_ATTENTION_SIGNAL_CONTRACT_CAPABILITIES,
  capabilityCount: DIRECTOR_RUNTIME_ATTENTION_SIGNAL_CONTRACT_CAPABILITIES.length,
  absentCapabilities: DIRECTOR_RUNTIME_ATTENTION_SIGNAL_CONTRACT_ABSENT_CAPABILITIES,
  emptySignalBatch: DIRECTOR_RUNTIME_EMPTY_ATTENTION_SIGNAL_BATCH,
  invariants: DIRECTOR_RUNTIME_ATTENTION_SIGNAL_CONTRACT_INVARIANTS,
  invariantCount: DIRECTOR_RUNTIME_ATTENTION_SIGNAL_CONTRACT_INVARIANTS.length,
  publicApis: directorRuntimeAttentionSignalContractsApiNames,
  publicApiCount: directorRuntimeAttentionSignalContractsApiNames.length,
  foundationVocabulary: Object.freeze({
    signalSources: DIRECTOR_RUNTIME_ATTENTION_SIGNAL_SOURCES,
    attentionLevels: DIRECTOR_RUNTIME_ATTENTION_FOCUS_LEVELS,
    reasonKinds: DIRECTOR_RUNTIME_ATTENTION_REASON_KINDS,
    scopes: DIRECTOR_RUNTIME_ATTENTION_SCOPES,
    persistenceValues: DIRECTOR_RUNTIME_ATTENTION_PERSISTENCE_VALUES,
  }),
});

export const directorRuntimeAttentionSignalContracts = Object.freeze({
  phase: "DRI-6:2" as const,
  name: "DirectorRuntimeAttentionSignalContracts" as const,
  identity: directorRuntimeAttentionSignalContractsIdentity,
  namespace: directorRuntimeAttentionSignalContractsNamespace,
  version: directorRuntimeAttentionSignalContractsVersion,
  layer: "Director Runtime Integration" as const,
  domain: "AttentionFocusOrchestration" as const,
  role: "AttentionSignalContracts" as const,
  stage: "AttentionSignalContracts" as const,
  status: "SignalContractsReady" as const,
  upstreamDependency: directorRuntimeAttentionSignalContractsUpstream,
  deterministic: true as const,
  rendererIndependent: true as const,
  philosophy: "request-not-resolution" as const,
  signalCategories: DIRECTOR_RUNTIME_ATTENTION_SIGNAL_CATEGORIES,
  signalIntents: DIRECTOR_RUNTIME_ATTENTION_SIGNAL_INTENTS,
  capabilities: DIRECTOR_RUNTIME_ATTENTION_SIGNAL_CONTRACT_CAPABILITIES,
  absentCapabilities: DIRECTOR_RUNTIME_ATTENTION_SIGNAL_CONTRACT_ABSENT_CAPABILITIES,
  emptySignalBatch: DIRECTOR_RUNTIME_EMPTY_ATTENTION_SIGNAL_BATCH,
  invariants: DIRECTOR_RUNTIME_ATTENTION_SIGNAL_CONTRACT_INVARIANTS,
  publicApiSurface: directorRuntimeAttentionSignalContractsApiNames,
  registry: directorRuntimeAttentionSignalContractsRegistry,
  foundationBoundary: "DRI-6:1-attention-focus-foundation-only" as const,
  architecturalStatus:
    "Established · Deterministic · Immutable · RendererIndependent · SignalContractsReady" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface DirectorRuntimeAttentionSignalContractsVerification {
  readonly ok: boolean;
  readonly identity: typeof directorRuntimeAttentionSignalContractsIdentity;
  readonly version: typeof directorRuntimeAttentionSignalContractsVersion;
  readonly namespace: typeof directorRuntimeAttentionSignalContractsNamespace;
  readonly dependency: typeof directorRuntimeAttentionSignalContractsUpstream;
  readonly signalCategoryCount: number;
  readonly signalIntentCount: number;
  readonly sourceCategoryMapCount: number;
  readonly capabilityCount: number;
  readonly invariantCount: number;
  readonly foundationCompatible: boolean;
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

export function verifyDirectorRuntimeAttentionSignalContracts():
  DirectorRuntimeAttentionSignalContractsVerification {
  const layer = directorRuntimeAttentionSignalContracts;
  const registry = directorRuntimeAttentionSignalContractsRegistry;

  const mappedSources = DIRECTOR_RUNTIME_ATTENTION_SIGNAL_SOURCES.map((source) =>
    DIRECTOR_RUNTIME_ATTENTION_SIGNAL_SOURCE_CATEGORY_MAP[source]);
  const foundationCompatible =
    DIRECTOR_RUNTIME_ATTENTION_SIGNAL_SOURCES.every((source) =>
      isDirectorRuntimeAttentionSignalSource(source)) &&
    DIRECTOR_RUNTIME_ATTENTION_FOCUS_LEVELS.every((level) =>
      isDirectorRuntimeAttentionFocusLevel(level)) &&
    DIRECTOR_RUNTIME_ATTENTION_REASON_KINDS.every((reason) =>
      isDirectorRuntimeAttentionReasonKind(reason)) &&
    DIRECTOR_RUNTIME_ATTENTION_SCOPES.every((scope) =>
      isDirectorRuntimeAttentionScope(scope)) &&
    DIRECTOR_RUNTIME_ATTENTION_PERSISTENCE_VALUES.every((value) =>
      isDirectorRuntimeAttentionPersistence(value)) &&
    mappedSources.length === DIRECTOR_RUNTIME_ATTENTION_SIGNAL_SOURCES.length &&
    mappedSources.every((category) =>
      isDirectorRuntimeAttentionSignalCategory(category));

  const ok =
    layer.identity === "DRI-6:2/DirectorRuntimeAttentionSignalContracts" &&
    layer.version === "6.2.0" &&
    layer.namespace === "nexora.dri.attention-focus.signal-contracts" &&
    layer.role === "AttentionSignalContracts" &&
    layer.status === "SignalContractsReady" &&
    layer.upstreamDependency ===
      "DRI-6:1/DirectorRuntimeAttentionFocusFoundation" &&
    layer.upstreamDependency === directorRuntimeAttentionFocusFoundationIdentity &&
    registry.dependency === layer.upstreamDependency &&
    exactOrder(DIRECTOR_RUNTIME_ATTENTION_SIGNAL_CATEGORIES, [
      "interaction",
      "state",
      "goal",
      "performance",
      "problem",
      "scenario",
      "decision",
      "execution",
      "advisor",
      "system",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_ATTENTION_SIGNAL_INTENTS, [
      "request-focus",
      "request-support",
      "request-context",
      "request-awareness",
      "request-suppression",
    ]) &&
    unique([...DIRECTOR_RUNTIME_ATTENTION_SIGNAL_CATEGORIES]) &&
    unique([...DIRECTOR_RUNTIME_ATTENTION_SIGNAL_INTENTS]) &&
    unique([...DIRECTOR_RUNTIME_ATTENTION_SIGNAL_CONTRACT_CAPABILITIES]) &&
    !DIRECTOR_RUNTIME_ATTENTION_SIGNAL_CONTRACT_CAPABILITIES.includes(
      "PriorityResolution" as never,
    ) &&
    foundationCompatible &&
    validateDirectorRuntimeAttentionSignalBatch(
      DIRECTOR_RUNTIME_EMPTY_ATTENTION_SIGNAL_BATCH,
    ).valid &&
    Object.isFrozen(layer) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(DIRECTOR_RUNTIME_ATTENTION_SIGNAL_CATEGORIES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_ATTENTION_SIGNAL_INTENTS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_ATTENTION_SIGNAL_SOURCE_CATEGORY_MAP) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EMPTY_ATTENTION_SIGNAL_BATCH);

  return Object.freeze({
    ok,
    identity: directorRuntimeAttentionSignalContractsIdentity,
    version: directorRuntimeAttentionSignalContractsVersion,
    namespace: directorRuntimeAttentionSignalContractsNamespace,
    dependency: directorRuntimeAttentionSignalContractsUpstream,
    signalCategoryCount: DIRECTOR_RUNTIME_ATTENTION_SIGNAL_CATEGORIES.length,
    signalIntentCount: DIRECTOR_RUNTIME_ATTENTION_SIGNAL_INTENTS.length,
    sourceCategoryMapCount: DIRECTOR_RUNTIME_ATTENTION_SIGNAL_SOURCES.length,
    capabilityCount: DIRECTOR_RUNTIME_ATTENTION_SIGNAL_CONTRACT_CAPABILITIES.length,
    invariantCount: DIRECTOR_RUNTIME_ATTENTION_SIGNAL_CONTRACT_INVARIANTS.length,
    foundationCompatible,
    frozen: Object.isFrozen(layer) && Object.isFrozen(registry),
  });
}
