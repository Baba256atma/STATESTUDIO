/**
 * DRI-8:2 — Director Runtime Consumer Context Binding.
 *
 * Binds approved Director Runtime semantic context into an immutable,
 * deterministic Consumer Context for later experience-surface projection.
 * Describes context only — never rendering, surface binding, or orchestration.
 *
 * Principle: Binding preserves semantic identity. Binding is not reasoning.
 */

import {
  DIRECTOR_RUNTIME_EXPERIENCE_SURFACES,
  createDirectorRuntimeConsumer,
  directorRuntimeConsumerIntegrationFoundationIdentity,
  directorRuntimeConsumerIntegrationFoundationNamespace,
  directorRuntimeConsumerIntegrationFoundationVersion,
  isDirectorRuntimeConsumerFamily,
  isDirectorRuntimeExperienceSurface,
  type DirectorRuntimeConsumer,
  type DirectorRuntimeConsumerFamily,
  type DirectorRuntimeExperienceSurface,
} from "@/app/lib/dri/directorRuntimeConsumerIntegrationFoundation";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeConsumerContextBindingIdentity =
  "DRI-8:2/DirectorRuntimeConsumerContextBinding" as const;
export const directorRuntimeConsumerContextBindingVersion = "8.2.0" as const;
export const directorRuntimeConsumerContextBindingNamespace =
  "nexora.dri.consumer-integration.context-binding" as const;
export const directorRuntimeConsumerContextBindingUpstream =
  directorRuntimeConsumerIntegrationFoundationIdentity;

export const directorRuntimeConsumerContextBindingCanonicalIdentity =
  Object.freeze({
    identity: directorRuntimeConsumerContextBindingIdentity,
    version: directorRuntimeConsumerContextBindingVersion,
    namespace: directorRuntimeConsumerContextBindingNamespace,
    upstream: directorRuntimeConsumerContextBindingUpstream,
  });

// ─── Presence (known / absent / not-applicable) ─────────────────────────────

export const DIRECTOR_RUNTIME_CONSUMER_CONTEXT_PRESENCE_STATES = Object.freeze([
  "known",
  "absent",
  "not-applicable",
] as const);
export type DirectorRuntimeConsumerContextPresenceState =
  (typeof DIRECTOR_RUNTIME_CONSUMER_CONTEXT_PRESENCE_STATES)[number];

export type DirectorRuntimeConsumerContextField<T> =
  | Readonly<{ readonly presence: "known"; readonly value: T }>
  | Readonly<{ readonly presence: "absent" }>
  | Readonly<{ readonly presence: "not-applicable" }>;

export function knownConsumerContextField<T>(
  value: T,
): DirectorRuntimeConsumerContextField<T> {
  return Object.freeze({ presence: "known" as const, value });
}

export function absentConsumerContextField<T = never>():
  DirectorRuntimeConsumerContextField<T> {
  return Object.freeze({ presence: "absent" as const });
}

export function notApplicableConsumerContextField<T = never>():
  DirectorRuntimeConsumerContextField<T> {
  return Object.freeze({ presence: "not-applicable" as const });
}

// ─── Scopes ─────────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_CONSUMER_CONTEXT_SCOPES = Object.freeze([
  "global",
  "workspace",
  "surface",
  "subject",
] as const);
export type DirectorRuntimeConsumerContextScope =
  (typeof DIRECTOR_RUNTIME_CONSUMER_CONTEXT_SCOPES)[number];

// ─── Subject kinds ──────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_CONSUMER_SUBJECT_KINDS = Object.freeze([
  "goal",
  "object",
  "pack",
  "problem",
  "scenario",
  "decision",
  "execution",
] as const);
export type DirectorRuntimeConsumerSubjectKind =
  (typeof DIRECTOR_RUNTIME_CONSUMER_SUBJECT_KINDS)[number];

export interface DirectorRuntimeConsumerSubject {
  readonly kind: DirectorRuntimeConsumerSubjectKind;
  readonly id: string;
  readonly label?: string;
}

// ─── Modes (semantic only) ──────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_CONSUMER_CONTEXT_MODES = Object.freeze([
  "goal",
  "problem",
  "scenario",
  "decision",
  "execution",
  "monitoring",
  "analysis",
  "war-room",
] as const);
export type DirectorRuntimeConsumerContextMode =
  (typeof DIRECTOR_RUNTIME_CONSUMER_CONTEXT_MODES)[number];

// ─── Pack categories ────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_CONSUMER_PACK_CATEGORIES = Object.freeze([
  "problem",
  "scenario",
  "decision",
  "execution",
] as const);
export type DirectorRuntimeConsumerPackCategory =
  (typeof DIRECTOR_RUNTIME_CONSUMER_PACK_CATEGORIES)[number];

export interface DirectorRuntimeConsumerPackReference {
  readonly packId: string;
  readonly packCategory?: DirectorRuntimeConsumerPackCategory;
  readonly label?: string;
}

// ─── Temporal context ───────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_CONSUMER_TEMPORAL_KINDS = Object.freeze([
  "current",
  "historical",
  "future",
] as const);
export type DirectorRuntimeConsumerTemporalKind =
  (typeof DIRECTOR_RUNTIME_CONSUMER_TEMPORAL_KINDS)[number];

export interface DirectorRuntimeConsumerTemporalContext {
  readonly temporalKind: DirectorRuntimeConsumerTemporalKind;
  readonly timelinePosition?: string | number;
  readonly timeRangeStart?: string | number;
  readonly timeRangeEnd?: string | number;
  readonly periodLens?: string;
}

// ─── Attention / guidance context (preserve only) ───────────────────────────

export interface DirectorRuntimeConsumerAttentionContext {
  readonly attentionTarget?: DirectorRuntimeConsumerSubject;
  readonly attentionPriority?: string;
  readonly attentionReason?: string;
}

export interface DirectorRuntimeConsumerGuidanceContext {
  readonly guidanceSubject?: DirectorRuntimeConsumerSubject;
  readonly guidanceIntent?: string;
  readonly guidanceReason?: string;
}

// ─── Availability / binding status ──────────────────────────────────────────

export const DIRECTOR_RUNTIME_CONSUMER_CONTEXT_AVAILABILITY_STATES =
  Object.freeze(["available", "partial", "unavailable"] as const);
export type DirectorRuntimeConsumerContextAvailability =
  (typeof DIRECTOR_RUNTIME_CONSUMER_CONTEXT_AVAILABILITY_STATES)[number];

export const DIRECTOR_RUNTIME_CONSUMER_CONTEXT_BINDING_STATUSES = Object.freeze([
  "bound",
  "partially-bound",
  "unbound",
  "invalid",
] as const);
export type DirectorRuntimeConsumerContextBindingStatus =
  (typeof DIRECTOR_RUNTIME_CONSUMER_CONTEXT_BINDING_STATUSES)[number];

// ─── Precedence ─────────────────────────────────────────────────────────────

/** Most-specific first. Subject overrides surface overrides workspace overrides global. */
export const DIRECTOR_RUNTIME_CONSUMER_CONTEXT_PRECEDENCE = Object.freeze([
  "subject",
  "surface",
  "workspace",
  "global",
] as const);
export type DirectorRuntimeConsumerContextPrecedenceLevel =
  (typeof DIRECTOR_RUNTIME_CONSUMER_CONTEXT_PRECEDENCE)[number];

// ─── Provenance ─────────────────────────────────────────────────────────────

export interface DirectorRuntimeConsumerContextProvenance {
  readonly sourceIdentity: string;
  readonly sourceNamespace: string;
  readonly sourceVersion: string;
  readonly bindingIdentity: string;
}

export const DIRECTOR_RUNTIME_CONSUMER_CONTEXT_PROVENANCE_FIELDS = Object.freeze([
  "sourceIdentity",
  "sourceNamespace",
  "sourceVersion",
  "bindingIdentity",
] as const);

// ─── Diagnostics ────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_CONSUMER_CONTEXT_DIAGNOSTIC_KINDS = Object.freeze([
  "missing-context",
  "invalid-subject-reference",
  "unsupported-scope",
  "inconsistent-active-selected-focused",
  "invalid-capability-reference",
  "invalid-consumer",
  "invalid-mode",
  "invalid-temporal-context",
  "invalid-pack-reference",
  "invalid-surface-reference",
  "kind-mismatch",
  "missing-binding-id",
] as const);
export type DirectorRuntimeConsumerContextDiagnosticKind =
  (typeof DIRECTOR_RUNTIME_CONSUMER_CONTEXT_DIAGNOSTIC_KINDS)[number];

export interface DirectorRuntimeConsumerContextDiagnostic {
  readonly kind: DirectorRuntimeConsumerContextDiagnosticKind;
  readonly path: string;
  readonly message: string;
}

// ─── Context capabilities ───────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_CONSUMER_CONTEXT_CAPABILITIES = Object.freeze([
  "consumer",
  "scope",
  "mode",
  "subject",
  "focus",
  "selection",
  "goal",
  "object",
  "pack",
  "temporal",
  "attention",
  "guidance",
  "availability",
  "provenance",
] as const);
export type DirectorRuntimeConsumerContextCapability =
  (typeof DIRECTOR_RUNTIME_CONSUMER_CONTEXT_CAPABILITIES)[number];

// ─── Guarantees ─────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_CONSUMER_CONTEXT_BINDING_GUARANTEES =
  Object.freeze([
    "framework-independent",
    "immutable-output",
    "deterministic",
    "non-mutating",
    "semantic-only",
    "no-business-inference",
    "no-rendering",
    "no-side-effects",
    "upstream-preserving",
  ] as const);
export type DirectorRuntimeConsumerContextBindingGuarantee =
  (typeof DIRECTOR_RUNTIME_CONSUMER_CONTEXT_BINDING_GUARANTEES)[number];

// ─── Core contracts ─────────────────────────────────────────────────────────

export interface DirectorRuntimeConsumerContext {
  readonly contextId: string;
  readonly consumer: DirectorRuntimeConsumer;
  readonly scope: DirectorRuntimeConsumerContextScope;
  readonly mode: DirectorRuntimeConsumerContextField<
    DirectorRuntimeConsumerContextMode
  >;
  readonly surface: DirectorRuntimeConsumerContextField<
    DirectorRuntimeExperienceSurface
  >;
  readonly activeSubject: DirectorRuntimeConsumerContextField<
    DirectorRuntimeConsumerSubject
  >;
  readonly selectedSubject: DirectorRuntimeConsumerContextField<
    DirectorRuntimeConsumerSubject
  >;
  readonly focusedSubject: DirectorRuntimeConsumerContextField<
    DirectorRuntimeConsumerSubject
  >;
  readonly activeGoal: DirectorRuntimeConsumerContextField<
    DirectorRuntimeConsumerSubject
  >;
  readonly activeObject: DirectorRuntimeConsumerContextField<
    DirectorRuntimeConsumerSubject
  >;
  readonly activePack: DirectorRuntimeConsumerContextField<
    DirectorRuntimeConsumerPackReference
  >;
  readonly temporal: DirectorRuntimeConsumerContextField<
    DirectorRuntimeConsumerTemporalContext
  >;
  readonly attention: DirectorRuntimeConsumerContextField<
    DirectorRuntimeConsumerAttentionContext
  >;
  readonly guidance: DirectorRuntimeConsumerContextField<
    DirectorRuntimeConsumerGuidanceContext
  >;
  readonly availability: DirectorRuntimeConsumerContextAvailability;
  readonly provenance: DirectorRuntimeConsumerContextProvenance;
  readonly effectivePrecedence: DirectorRuntimeConsumerContextPrecedenceLevel;
}

export interface DirectorRuntimeConsumerContextLayerInput {
  readonly mode?: DirectorRuntimeConsumerContextMode;
  readonly surface?: DirectorRuntimeExperienceSurface;
  readonly activeSubject?: DirectorRuntimeConsumerSubject;
  readonly selectedSubject?: DirectorRuntimeConsumerSubject;
  readonly focusedSubject?: DirectorRuntimeConsumerSubject;
  readonly activeGoal?: DirectorRuntimeConsumerSubject;
  readonly activeObject?: DirectorRuntimeConsumerSubject;
  readonly activePack?: DirectorRuntimeConsumerPackReference;
  readonly temporal?: DirectorRuntimeConsumerTemporalContext;
  readonly attention?: DirectorRuntimeConsumerAttentionContext;
  readonly guidance?: DirectorRuntimeConsumerGuidanceContext;
}

export interface DirectorRuntimeConsumerContextBindingInput {
  readonly bindingId: string;
  readonly consumer: DirectorRuntimeConsumer;
  readonly scope: DirectorRuntimeConsumerContextScope;
  readonly mode?: DirectorRuntimeConsumerContextMode;
  readonly surface?: DirectorRuntimeExperienceSurface;
  readonly activeSubject?: DirectorRuntimeConsumerSubject;
  readonly selectedSubject?: DirectorRuntimeConsumerSubject;
  readonly focusedSubject?: DirectorRuntimeConsumerSubject;
  readonly activeGoal?: DirectorRuntimeConsumerSubject;
  readonly activeObject?: DirectorRuntimeConsumerSubject;
  readonly activePack?: DirectorRuntimeConsumerPackReference;
  readonly temporal?: DirectorRuntimeConsumerTemporalContext;
  readonly attention?: DirectorRuntimeConsumerAttentionContext;
  readonly guidance?: DirectorRuntimeConsumerGuidanceContext;
  readonly provenance?: Readonly<{
    readonly sourceIdentity: string;
    readonly sourceNamespace: string;
    readonly sourceVersion: string;
  }>;
  /** Optional layered contexts for deterministic precedence resolution. */
  readonly globalContext?: DirectorRuntimeConsumerContextLayerInput;
  readonly workspaceContext?: DirectorRuntimeConsumerContextLayerInput;
  readonly surfaceContext?: DirectorRuntimeConsumerContextLayerInput;
  readonly subjectContext?: DirectorRuntimeConsumerContextLayerInput;
}

export interface DirectorRuntimeConsumerContextBindingResult {
  readonly context: DirectorRuntimeConsumerContext | null;
  readonly status: DirectorRuntimeConsumerContextBindingStatus;
  readonly diagnostics: ReadonlyArray<DirectorRuntimeConsumerContextDiagnostic>;
  readonly provenance: DirectorRuntimeConsumerContextProvenance;
}

export interface DirectorRuntimeConsumerContextResolutionInput {
  readonly bindingId: string;
  readonly consumer: DirectorRuntimeConsumer;
  readonly scope: DirectorRuntimeConsumerContextScope;
  readonly provenance?: Readonly<{
    readonly sourceIdentity: string;
    readonly sourceNamespace: string;
    readonly sourceVersion: string;
  }>;
  readonly globalContext?: DirectorRuntimeConsumerContextLayerInput;
  readonly workspaceContext?: DirectorRuntimeConsumerContextLayerInput;
  readonly surfaceContext?: DirectorRuntimeConsumerContextLayerInput;
  readonly subjectContext?: DirectorRuntimeConsumerContextLayerInput;
}

// ─── Membership helpers ─────────────────────────────────────────────────────

export function isDirectorRuntimeConsumerContextScope(
  value: unknown,
): value is DirectorRuntimeConsumerContextScope {
  return (DIRECTOR_RUNTIME_CONSUMER_CONTEXT_SCOPES as readonly unknown[])
    .includes(value);
}

export function isDirectorRuntimeConsumerSubjectKind(
  value: unknown,
): value is DirectorRuntimeConsumerSubjectKind {
  return (DIRECTOR_RUNTIME_CONSUMER_SUBJECT_KINDS as readonly unknown[])
    .includes(value);
}

export function isDirectorRuntimeConsumerContextMode(
  value: unknown,
): value is DirectorRuntimeConsumerContextMode {
  return (DIRECTOR_RUNTIME_CONSUMER_CONTEXT_MODES as readonly unknown[])
    .includes(value);
}

export function isDirectorRuntimeConsumerPackCategory(
  value: unknown,
): value is DirectorRuntimeConsumerPackCategory {
  return (DIRECTOR_RUNTIME_CONSUMER_PACK_CATEGORIES as readonly unknown[])
    .includes(value);
}

export function isDirectorRuntimeConsumerTemporalKind(
  value: unknown,
): value is DirectorRuntimeConsumerTemporalKind {
  return (DIRECTOR_RUNTIME_CONSUMER_TEMPORAL_KINDS as readonly unknown[])
    .includes(value);
}

export function isDirectorRuntimeConsumerContextAvailability(
  value: unknown,
): value is DirectorRuntimeConsumerContextAvailability {
  return (
    DIRECTOR_RUNTIME_CONSUMER_CONTEXT_AVAILABILITY_STATES as readonly unknown[]
  ).includes(value);
}

export function isDirectorRuntimeConsumerContextBindingStatus(
  value: unknown,
): value is DirectorRuntimeConsumerContextBindingStatus {
  return (
    DIRECTOR_RUNTIME_CONSUMER_CONTEXT_BINDING_STATUSES as readonly unknown[]
  ).includes(value);
}

// ─── Internal helpers ───────────────────────────────────────────────────────

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function diagnostic(
  kind: DirectorRuntimeConsumerContextDiagnosticKind,
  path: string,
  message: string,
): DirectorRuntimeConsumerContextDiagnostic {
  return Object.freeze({ kind, path, message });
}

function freezeSubject(
  subject: DirectorRuntimeConsumerSubject,
): DirectorRuntimeConsumerSubject {
  const frozen: DirectorRuntimeConsumerSubject = {
    kind: subject.kind,
    id: subject.id,
  };
  if (subject.label !== undefined) {
    return Object.freeze({ ...frozen, label: subject.label });
  }
  return Object.freeze(frozen);
}

function subjectsEqual(
  left: DirectorRuntimeConsumerSubject,
  right: DirectorRuntimeConsumerSubject,
): boolean {
  return left.kind === right.kind && left.id === right.id;
}

function validateSubject(
  value: unknown,
  path: string,
  diagnostics: DirectorRuntimeConsumerContextDiagnostic[],
  expectedKind?: DirectorRuntimeConsumerSubjectKind,
): DirectorRuntimeConsumerSubject | null {
  if (!isPlainObject(value)) {
    diagnostics.push(
      diagnostic(
        "invalid-subject-reference",
        path,
        "subject must be a plain object with kind and id",
      ),
    );
    return null;
  }
  if (!isDirectorRuntimeConsumerSubjectKind(value.kind)) {
    diagnostics.push(
      diagnostic(
        "invalid-subject-reference",
        `${path}.kind`,
        "subject kind is not a known consumer subject kind",
      ),
    );
    return null;
  }
  if (!isNonEmptyString(value.id)) {
    diagnostics.push(
      diagnostic(
        "invalid-subject-reference",
        `${path}.id`,
        "subject id must be a non-empty string",
      ),
    );
    return null;
  }
  if (value.label !== undefined && typeof value.label !== "string") {
    diagnostics.push(
      diagnostic(
        "invalid-subject-reference",
        `${path}.label`,
        "subject label must be a string when provided",
      ),
    );
    return null;
  }
  if (expectedKind !== undefined && value.kind !== expectedKind) {
    diagnostics.push(
      diagnostic(
        "kind-mismatch",
        `${path}.kind`,
        `expected subject kind ${expectedKind}`,
      ),
    );
    return null;
  }
  const subject: DirectorRuntimeConsumerSubject = {
    kind: value.kind,
    id: value.id,
  };
  if (typeof value.label === "string") {
    return freezeSubject({ ...subject, label: value.label });
  }
  return freezeSubject(subject);
}

function validatePack(
  value: unknown,
  path: string,
  diagnostics: DirectorRuntimeConsumerContextDiagnostic[],
): DirectorRuntimeConsumerPackReference | null {
  if (!isPlainObject(value)) {
    diagnostics.push(
      diagnostic(
        "invalid-pack-reference",
        path,
        "pack must be a plain object with packId",
      ),
    );
    return null;
  }
  if (!isNonEmptyString(value.packId)) {
    diagnostics.push(
      diagnostic(
        "invalid-pack-reference",
        `${path}.packId`,
        "packId must be a non-empty string",
      ),
    );
    return null;
  }
  if (
    value.packCategory !== undefined &&
    !isDirectorRuntimeConsumerPackCategory(value.packCategory)
  ) {
    diagnostics.push(
      diagnostic(
        "invalid-pack-reference",
        `${path}.packCategory`,
        "packCategory is not a known pack category",
      ),
    );
    return null;
  }
  if (value.label !== undefined && typeof value.label !== "string") {
    diagnostics.push(
      diagnostic(
        "invalid-pack-reference",
        `${path}.label`,
        "pack label must be a string when provided",
      ),
    );
    return null;
  }
  const pack: DirectorRuntimeConsumerPackReference = {
    packId: value.packId,
  };
  const withCategory =
    value.packCategory !== undefined
      ? { ...pack, packCategory: value.packCategory }
      : pack;
  if (typeof value.label === "string") {
    return Object.freeze({ ...withCategory, label: value.label });
  }
  return Object.freeze(withCategory);
}

function validateTemporal(
  value: unknown,
  path: string,
  diagnostics: DirectorRuntimeConsumerContextDiagnostic[],
): DirectorRuntimeConsumerTemporalContext | null {
  if (!isPlainObject(value)) {
    diagnostics.push(
      diagnostic(
        "invalid-temporal-context",
        path,
        "temporal context must be a plain object",
      ),
    );
    return null;
  }
  if (!isDirectorRuntimeConsumerTemporalKind(value.temporalKind)) {
    diagnostics.push(
      diagnostic(
        "invalid-temporal-context",
        `${path}.temporalKind`,
        "temporalKind must be current, historical, or future",
      ),
    );
    return null;
  }
  const opaqueOk = (field: unknown): boolean =>
    field === undefined ||
    (typeof field === "string" && field.length > 0) ||
    (typeof field === "number" && Number.isFinite(field));
  if (!opaqueOk(value.timelinePosition)) {
    diagnostics.push(
      diagnostic(
        "invalid-temporal-context",
        `${path}.timelinePosition`,
        "timelinePosition must be a non-empty string or finite number",
      ),
    );
    return null;
  }
  if (!opaqueOk(value.timeRangeStart) || !opaqueOk(value.timeRangeEnd)) {
    diagnostics.push(
      diagnostic(
        "invalid-temporal-context",
        path,
        "time range bounds must be non-empty strings or finite numbers",
      ),
    );
    return null;
  }
  if (value.periodLens !== undefined && !isNonEmptyString(value.periodLens)) {
    diagnostics.push(
      diagnostic(
        "invalid-temporal-context",
        `${path}.periodLens`,
        "periodLens must be a non-empty string when provided",
      ),
    );
    return null;
  }
  const temporal: DirectorRuntimeConsumerTemporalContext = {
    temporalKind: value.temporalKind,
  };
  const withPosition =
    value.timelinePosition !== undefined
      ? { ...temporal, timelinePosition: value.timelinePosition as string | number }
      : temporal;
  const withStart =
    value.timeRangeStart !== undefined
      ? {
        ...withPosition,
        timeRangeStart: value.timeRangeStart as string | number,
      }
      : withPosition;
  const withEnd =
    value.timeRangeEnd !== undefined
      ? { ...withStart, timeRangeEnd: value.timeRangeEnd as string | number }
      : withStart;
  if (typeof value.periodLens === "string") {
    return Object.freeze({ ...withEnd, periodLens: value.periodLens });
  }
  return Object.freeze(withEnd);
}

function validateAttention(
  value: unknown,
  path: string,
  diagnostics: DirectorRuntimeConsumerContextDiagnostic[],
): DirectorRuntimeConsumerAttentionContext | null {
  if (!isPlainObject(value)) {
    diagnostics.push(
      diagnostic(
        "invalid-subject-reference",
        path,
        "attention context must be a plain object",
      ),
    );
    return null;
  }
  let attentionTarget: DirectorRuntimeConsumerSubject | undefined;
  if (value.attentionTarget !== undefined) {
    const target = validateSubject(
      value.attentionTarget,
      `${path}.attentionTarget`,
      diagnostics,
    );
    if (target === null) return null;
    attentionTarget = target;
  }
  if (
    value.attentionPriority !== undefined &&
    !isNonEmptyString(value.attentionPriority)
  ) {
    diagnostics.push(
      diagnostic(
        "invalid-subject-reference",
        `${path}.attentionPriority`,
        "attentionPriority must be a non-empty string when provided",
      ),
    );
    return null;
  }
  if (
    value.attentionReason !== undefined &&
    !isNonEmptyString(value.attentionReason)
  ) {
    diagnostics.push(
      diagnostic(
        "invalid-subject-reference",
        `${path}.attentionReason`,
        "attentionReason must be a non-empty string when provided",
      ),
    );
    return null;
  }
  const attention: DirectorRuntimeConsumerAttentionContext = {};
  const withTarget =
    attentionTarget !== undefined
      ? { ...attention, attentionTarget }
      : attention;
  const withPriority =
    typeof value.attentionPriority === "string"
      ? { ...withTarget, attentionPriority: value.attentionPriority }
      : withTarget;
  if (typeof value.attentionReason === "string") {
    return Object.freeze({
      ...withPriority,
      attentionReason: value.attentionReason,
    });
  }
  return Object.freeze(withPriority);
}

function validateGuidance(
  value: unknown,
  path: string,
  diagnostics: DirectorRuntimeConsumerContextDiagnostic[],
): DirectorRuntimeConsumerGuidanceContext | null {
  if (!isPlainObject(value)) {
    diagnostics.push(
      diagnostic(
        "invalid-subject-reference",
        path,
        "guidance context must be a plain object",
      ),
    );
    return null;
  }
  let guidanceSubject: DirectorRuntimeConsumerSubject | undefined;
  if (value.guidanceSubject !== undefined) {
    const subject = validateSubject(
      value.guidanceSubject,
      `${path}.guidanceSubject`,
      diagnostics,
    );
    if (subject === null) return null;
    guidanceSubject = subject;
  }
  if (
    value.guidanceIntent !== undefined &&
    !isNonEmptyString(value.guidanceIntent)
  ) {
    diagnostics.push(
      diagnostic(
        "invalid-subject-reference",
        `${path}.guidanceIntent`,
        "guidanceIntent must be a non-empty string when provided",
      ),
    );
    return null;
  }
  if (
    value.guidanceReason !== undefined &&
    !isNonEmptyString(value.guidanceReason)
  ) {
    diagnostics.push(
      diagnostic(
        "invalid-subject-reference",
        `${path}.guidanceReason`,
        "guidanceReason must be a non-empty string when provided",
      ),
    );
    return null;
  }
  const guidance: DirectorRuntimeConsumerGuidanceContext = {};
  const withSubject =
    guidanceSubject !== undefined
      ? { ...guidance, guidanceSubject }
      : guidance;
  const withIntent =
    typeof value.guidanceIntent === "string"
      ? { ...withSubject, guidanceIntent: value.guidanceIntent }
      : withSubject;
  if (typeof value.guidanceReason === "string") {
    return Object.freeze({
      ...withIntent,
      guidanceReason: value.guidanceReason,
    });
  }
  return Object.freeze(withIntent);
}

function fieldFromOptional<T>(
  value: T | undefined | null,
  notApplicable = false,
): DirectorRuntimeConsumerContextField<T> {
  if (notApplicable) return notApplicableConsumerContextField<T>();
  if (value === undefined || value === null) {
    return absentConsumerContextField<T>();
  }
  return knownConsumerContextField(value);
}

function isKnown<T>(
  field: DirectorRuntimeConsumerContextField<T>,
): field is Readonly<{ readonly presence: "known"; readonly value: T }> {
  return field.presence === "known";
}

function countKnown(
  fields: ReadonlyArray<DirectorRuntimeConsumerContextField<unknown>>,
): number {
  return fields.filter((field) => field.presence === "known").length;
}

function determineAvailability(
  fields: ReadonlyArray<DirectorRuntimeConsumerContextField<unknown>>,
): DirectorRuntimeConsumerContextAvailability {
  const known = countKnown(fields);
  if (known === 0) return "unavailable";
  if (known >= 3) return "available";
  return "partial";
}

function determineStatus(
  availability: DirectorRuntimeConsumerContextAvailability,
  hasStructuralInvalid: boolean,
  hasUsableContext: boolean,
): DirectorRuntimeConsumerContextBindingStatus {
  if (hasStructuralInvalid) return "invalid";
  if (!hasUsableContext || availability === "unavailable") return "unbound";
  if (availability === "partial") return "partially-bound";
  return "bound";
}

function defaultProvenance(
  bindingId: string,
  override?: DirectorRuntimeConsumerContextBindingInput["provenance"],
): DirectorRuntimeConsumerContextProvenance {
  return Object.freeze({
    sourceIdentity:
      override?.sourceIdentity ??
        directorRuntimeConsumerIntegrationFoundationIdentity,
    sourceNamespace:
      override?.sourceNamespace ??
        directorRuntimeConsumerIntegrationFoundationNamespace,
    sourceVersion:
      override?.sourceVersion ??
        directorRuntimeConsumerIntegrationFoundationVersion,
    bindingIdentity: bindingId.length > 0
      ? bindingId
      : directorRuntimeConsumerContextBindingIdentity,
  });
}

function scopeToPrecedence(
  scope: DirectorRuntimeConsumerContextScope,
): DirectorRuntimeConsumerContextPrecedenceLevel {
  if (scope === "subject") return "subject";
  if (scope === "surface") return "surface";
  if (scope === "workspace") return "workspace";
  return "global";
}

type ResolvableKey = keyof DirectorRuntimeConsumerContextLayerInput;

const RESOLVABLE_KEYS = Object.freeze([
  "mode",
  "surface",
  "activeSubject",
  "selectedSubject",
  "focusedSubject",
  "activeGoal",
  "activeObject",
  "activePack",
  "temporal",
  "attention",
  "guidance",
] as const satisfies readonly ResolvableKey[]);

function layerForPrecedence(
  level: DirectorRuntimeConsumerContextPrecedenceLevel,
  input: DirectorRuntimeConsumerContextBindingInput |
    DirectorRuntimeConsumerContextResolutionInput,
): DirectorRuntimeConsumerContextLayerInput | undefined {
  if (level === "subject") return input.subjectContext;
  if (level === "surface") return input.surfaceContext;
  if (level === "workspace") return input.workspaceContext;
  return input.globalContext;
}

/**
 * Resolve a field across layered contexts using subject → surface → workspace → global.
 * Explicit top-level input fields win over all layers.
 */
function resolveLayeredValue<K extends ResolvableKey>(
  key: K,
  explicit: DirectorRuntimeConsumerContextLayerInput[K] | undefined,
  input: DirectorRuntimeConsumerContextBindingInput |
    DirectorRuntimeConsumerContextResolutionInput,
): {
  readonly value: DirectorRuntimeConsumerContextLayerInput[K] | undefined;
  readonly precedence: DirectorRuntimeConsumerContextPrecedenceLevel;
} {
  if (explicit !== undefined) {
    return {
      value: explicit,
      precedence: scopeToPrecedence(
        "scope" in input && isDirectorRuntimeConsumerContextScope(input.scope)
          ? input.scope
          : "global",
      ),
    };
  }
  for (const level of DIRECTOR_RUNTIME_CONSUMER_CONTEXT_PRECEDENCE) {
    const layer = layerForPrecedence(level, input);
    if (layer !== undefined && layer[key] !== undefined) {
      return { value: layer[key], precedence: level };
    }
  }
  return { value: undefined, precedence: "global" };
}

function mergeResolvedFields(
  input: DirectorRuntimeConsumerContextBindingInput,
): {
  readonly resolved: DirectorRuntimeConsumerContextLayerInput;
  readonly effectivePrecedence: DirectorRuntimeConsumerContextPrecedenceLevel;
} {
  const resolved: Partial<DirectorRuntimeConsumerContextLayerInput> = {};
  let winningIndex = DIRECTOR_RUNTIME_CONSUMER_CONTEXT_PRECEDENCE.length - 1;

  for (const key of RESOLVABLE_KEYS) {
    const { value, precedence } = resolveLayeredValue(key, input[key], input);
    if (value !== undefined) {
      // Key-specific assignment through a typed mutable bag; value matches key.
      Object.assign(resolved, { [key]: value });
      const index = DIRECTOR_RUNTIME_CONSUMER_CONTEXT_PRECEDENCE.indexOf(
        precedence,
      );
      if (index >= 0 && index < winningIndex) {
        winningIndex = index;
      }
    }
  }

  return {
    resolved: Object.freeze({ ...resolved }),
    effectivePrecedence:
      DIRECTOR_RUNTIME_CONSUMER_CONTEXT_PRECEDENCE[winningIndex] ?? "global",
  };
}

// ─── Public list / identity APIs ────────────────────────────────────────────

export function getDirectorRuntimeConsumerContextBindingIdentity():
  typeof directorRuntimeConsumerContextBindingCanonicalIdentity {
  return directorRuntimeConsumerContextBindingCanonicalIdentity;
}

export function listDirectorRuntimeConsumerContextScopes():
  ReadonlyArray<DirectorRuntimeConsumerContextScope> {
  return DIRECTOR_RUNTIME_CONSUMER_CONTEXT_SCOPES;
}

export function listDirectorRuntimeConsumerSubjectKinds():
  ReadonlyArray<DirectorRuntimeConsumerSubjectKind> {
  return DIRECTOR_RUNTIME_CONSUMER_SUBJECT_KINDS;
}

export function listDirectorRuntimeConsumerContextAvailabilityStates():
  ReadonlyArray<DirectorRuntimeConsumerContextAvailability> {
  return DIRECTOR_RUNTIME_CONSUMER_CONTEXT_AVAILABILITY_STATES;
}

export function listDirectorRuntimeConsumerContextBindingStatuses():
  ReadonlyArray<DirectorRuntimeConsumerContextBindingStatus> {
  return DIRECTOR_RUNTIME_CONSUMER_CONTEXT_BINDING_STATUSES;
}

// ─── Validation ─────────────────────────────────────────────────────────────

export function validateDirectorRuntimeConsumerContext(
  context: DirectorRuntimeConsumerContext,
): ReadonlyArray<DirectorRuntimeConsumerContextDiagnostic> {
  const diagnostics: DirectorRuntimeConsumerContextDiagnostic[] = [];

  if (!isNonEmptyString(context.contextId)) {
    diagnostics.push(
      diagnostic(
        "missing-context",
        "contextId",
        "contextId must be a non-empty string",
      ),
    );
  }
  if (!isDirectorRuntimeConsumerFamily(context.consumer.consumerFamily)) {
    diagnostics.push(
      diagnostic(
        "invalid-consumer",
        "consumer.consumerFamily",
        "consumer family is not approved",
      ),
    );
  }
  if (!isNonEmptyString(context.consumer.consumerId)) {
    diagnostics.push(
      diagnostic(
        "invalid-consumer",
        "consumer.consumerId",
        "consumerId must be a non-empty string",
      ),
    );
  }
  if (!isDirectorRuntimeConsumerContextScope(context.scope)) {
    diagnostics.push(
      diagnostic(
        "unsupported-scope",
        "scope",
        "scope is not a known consumer context scope",
      ),
    );
  }
  if (
    context.scope === "surface" &&
    context.surface.presence === "absent"
  ) {
    diagnostics.push(
      diagnostic(
        "missing-context",
        "surface",
        "surface scope expects a surface reference when available",
      ),
    );
  }
  if (
    isKnown(context.activeGoal) &&
    context.activeGoal.value.kind !== "goal"
  ) {
    diagnostics.push(
      diagnostic(
        "kind-mismatch",
        "activeGoal.kind",
        "activeGoal must have kind goal",
      ),
    );
  }
  if (
    isKnown(context.activeObject) &&
    context.activeObject.value.kind !== "object"
  ) {
    diagnostics.push(
      diagnostic(
        "kind-mismatch",
        "activeObject.kind",
        "activeObject must have kind object",
      ),
    );
  }
  if (
    isKnown(context.selectedSubject) &&
    isKnown(context.focusedSubject) &&
    subjectsEqual(context.selectedSubject.value, context.focusedSubject.value) &&
    isKnown(context.activeSubject) &&
    !subjectsEqual(context.activeSubject.value, context.selectedSubject.value) &&
    !subjectsEqual(context.activeSubject.value, context.focusedSubject.value)
  ) {
    // Valid: active may differ — no diagnostic. Distinctness is allowed.
  }
  if (!isDirectorRuntimeConsumerContextAvailability(context.availability)) {
    diagnostics.push(
      diagnostic(
        "invalid-capability-reference",
        "availability",
        "availability is not a known availability state",
      ),
    );
  }
  for (const field of DIRECTOR_RUNTIME_CONSUMER_CONTEXT_PROVENANCE_FIELDS) {
    if (!isNonEmptyString(context.provenance[field])) {
      diagnostics.push(
        diagnostic(
          "missing-context",
          `provenance.${field}`,
          `${field} must be a non-empty string`,
        ),
      );
    }
  }

  return Object.freeze([...diagnostics]);
}

// ─── Binding ────────────────────────────────────────────────────────────────

export function bindDirectorRuntimeConsumerContext(
  input: DirectorRuntimeConsumerContextBindingInput,
): DirectorRuntimeConsumerContextBindingResult {
  const diagnostics: DirectorRuntimeConsumerContextDiagnostic[] = [];
  let structurallyInvalid = false;

  const bindingId = isNonEmptyString(input.bindingId) ? input.bindingId : "";
  if (bindingId.length === 0) {
    diagnostics.push(
      diagnostic(
        "missing-binding-id",
        "bindingId",
        "bindingId must be a non-empty string",
      ),
    );
    structurallyInvalid = true;
  }

  const provenance = defaultProvenance(bindingId, input.provenance);

  if (
    !isPlainObject(input.consumer) ||
    !isNonEmptyString(input.consumer.consumerId) ||
    !isDirectorRuntimeConsumerFamily(input.consumer.consumerFamily)
  ) {
    diagnostics.push(
      diagnostic(
        "invalid-consumer",
        "consumer",
        "consumer must include a non-empty consumerId and approved family",
      ),
    );
    structurallyInvalid = true;
  }

  if (!isDirectorRuntimeConsumerContextScope(input.scope)) {
    diagnostics.push(
      diagnostic(
        "unsupported-scope",
        "scope",
        "scope is not a known consumer context scope",
      ),
    );
    structurallyInvalid = true;
  }

  if (structurallyInvalid) {
    return Object.freeze({
      context: null,
      status: "invalid" as const,
      diagnostics: Object.freeze([...diagnostics]),
      provenance,
    });
  }

  const consumer = createDirectorRuntimeConsumer(input.consumer);
  const { resolved, effectivePrecedence } = mergeResolvedFields(input);

  const modeNotApplicable = resolved.mode === undefined &&
    input.scope === "global";
  let modeField = fieldFromOptional(resolved.mode, false);
  if (resolved.mode !== undefined) {
    if (!isDirectorRuntimeConsumerContextMode(resolved.mode)) {
      diagnostics.push(
        diagnostic("invalid-mode", "mode", "mode is not a known consumer mode"),
      );
      structurallyInvalid = true;
      modeField = absentConsumerContextField();
    } else {
      modeField = knownConsumerContextField(resolved.mode);
    }
  } else if (modeNotApplicable) {
    modeField = notApplicableConsumerContextField();
  }

  let surfaceField = absentConsumerContextField<DirectorRuntimeExperienceSurface>();
  if (resolved.surface !== undefined) {
    if (!isDirectorRuntimeExperienceSurface(resolved.surface)) {
      diagnostics.push(
        diagnostic(
          "invalid-surface-reference",
          "surface",
          "surface is not a known experience surface",
        ),
      );
      structurallyInvalid = true;
    } else {
      surfaceField = knownConsumerContextField(resolved.surface);
    }
  } else if (input.scope !== "surface") {
    surfaceField = notApplicableConsumerContextField();
  }

  const subjectPaths = Object.freeze([
    ["activeSubject", resolved.activeSubject, undefined],
    ["selectedSubject", resolved.selectedSubject, undefined],
    ["focusedSubject", resolved.focusedSubject, undefined],
    ["activeGoal", resolved.activeGoal, "goal"],
    ["activeObject", resolved.activeObject, "object"],
  ] as const);

  const subjectFields: {
    activeSubject: DirectorRuntimeConsumerContextField<
      DirectorRuntimeConsumerSubject
    >;
    selectedSubject: DirectorRuntimeConsumerContextField<
      DirectorRuntimeConsumerSubject
    >;
    focusedSubject: DirectorRuntimeConsumerContextField<
      DirectorRuntimeConsumerSubject
    >;
    activeGoal: DirectorRuntimeConsumerContextField<
      DirectorRuntimeConsumerSubject
    >;
    activeObject: DirectorRuntimeConsumerContextField<
      DirectorRuntimeConsumerSubject
    >;
  } = {
    activeSubject: absentConsumerContextField(),
    selectedSubject: absentConsumerContextField(),
    focusedSubject: absentConsumerContextField(),
    activeGoal: absentConsumerContextField(),
    activeObject: absentConsumerContextField(),
  };

  for (const [path, value, expectedKind] of subjectPaths) {
    if (value === undefined) continue;
    const before = diagnostics.length;
    const subject = validateSubject(
      value,
      path,
      diagnostics,
      expectedKind as DirectorRuntimeConsumerSubjectKind | undefined,
    );
    if (subject === null) {
      structurallyInvalid = true;
      continue;
    }
    if (diagnostics.length > before) {
      structurallyInvalid = true;
    }
    subjectFields[path] = knownConsumerContextField(subject);
  }

  let packField = absentConsumerContextField<
    DirectorRuntimeConsumerPackReference
  >();
  if (resolved.activePack !== undefined) {
    const pack = validatePack(resolved.activePack, "activePack", diagnostics);
    if (pack === null) {
      structurallyInvalid = true;
    } else {
      packField = knownConsumerContextField(pack);
    }
  }

  let temporalField = absentConsumerContextField<
    DirectorRuntimeConsumerTemporalContext
  >();
  if (resolved.temporal !== undefined) {
    const temporal = validateTemporal(
      resolved.temporal,
      "temporal",
      diagnostics,
    );
    if (temporal === null) {
      structurallyInvalid = true;
    } else {
      temporalField = knownConsumerContextField(temporal);
    }
  }

  let attentionField = absentConsumerContextField<
    DirectorRuntimeConsumerAttentionContext
  >();
  if (resolved.attention !== undefined) {
    const attention = validateAttention(
      resolved.attention,
      "attention",
      diagnostics,
    );
    if (attention === null) {
      structurallyInvalid = true;
    } else {
      attentionField = knownConsumerContextField(attention);
    }
  }

  let guidanceField = absentConsumerContextField<
    DirectorRuntimeConsumerGuidanceContext
  >();
  if (resolved.guidance !== undefined) {
    const guidance = validateGuidance(
      resolved.guidance,
      "guidance",
      diagnostics,
    );
    if (guidance === null) {
      structurallyInvalid = true;
    } else {
      guidanceField = knownConsumerContextField(guidance);
    }
  }

  // Selection and focus remain distinct — no forced equality.
  // Soft consistency note only when both known and equal labels conflict with empty ids (already covered).

  if (structurallyInvalid) {
    return Object.freeze({
      context: null,
      status: "invalid" as const,
      diagnostics: Object.freeze([...diagnostics]),
      provenance,
    });
  }

  const semanticFields = [
    modeField,
    surfaceField,
    subjectFields.activeSubject,
    subjectFields.selectedSubject,
    subjectFields.focusedSubject,
    subjectFields.activeGoal,
    subjectFields.activeObject,
    packField,
    temporalField,
    attentionField,
    guidanceField,
  ] as const;

  const availability = determineAvailability(semanticFields);
  const hasUsableContext = countKnown(semanticFields) > 0;
  const status = determineStatus(
    availability,
    false,
    hasUsableContext,
  );

  if (!hasUsableContext) {
    diagnostics.push(
      diagnostic(
        "missing-context",
        "context",
        "no usable semantic context fields were supplied",
      ),
    );
  }

  const context: DirectorRuntimeConsumerContext = Object.freeze({
    contextId: bindingId,
    consumer,
    scope: input.scope,
    mode: modeField,
    surface: surfaceField,
    activeSubject: subjectFields.activeSubject,
    selectedSubject: subjectFields.selectedSubject,
    focusedSubject: subjectFields.focusedSubject,
    activeGoal: subjectFields.activeGoal,
    activeObject: subjectFields.activeObject,
    activePack: packField,
    temporal: temporalField,
    attention: attentionField,
    guidance: guidanceField,
    availability,
    provenance,
    effectivePrecedence,
  });

  const validationDiagnostics = validateDirectorRuntimeConsumerContext(context);
  const allDiagnostics = Object.freeze([
    ...diagnostics,
    ...validationDiagnostics,
  ]);

  if (validationDiagnostics.some((entry) =>
    entry.kind === "kind-mismatch" ||
    entry.kind === "invalid-consumer" ||
    entry.kind === "unsupported-scope"
  )) {
    return Object.freeze({
      context: null,
      status: "invalid" as const,
      diagnostics: allDiagnostics,
      provenance,
    });
  }

  return Object.freeze({
    context,
    status,
    diagnostics: allDiagnostics,
    provenance,
  });
}

/**
 * Resolve among supplied layered contexts only.
 * Does not infer business meaning or invent missing domain data.
 */
export function resolveDirectorRuntimeConsumerContext(
  input: DirectorRuntimeConsumerContextResolutionInput,
): DirectorRuntimeConsumerContextBindingResult {
  return bindDirectorRuntimeConsumerContext({
    bindingId: input.bindingId,
    consumer: input.consumer,
    scope: input.scope,
    provenance: input.provenance,
    globalContext: input.globalContext,
    workspaceContext: input.workspaceContext,
    surfaceContext: input.surfaceContext,
    subjectContext: input.subjectContext,
  });
}

// ─── Registry ───────────────────────────────────────────────────────────────

export const directorRuntimeConsumerContextBindingApiNames = Object.freeze([
  "getDirectorRuntimeConsumerContextBindingIdentity",
  "listDirectorRuntimeConsumerContextScopes",
  "listDirectorRuntimeConsumerSubjectKinds",
  "isDirectorRuntimeConsumerSubjectKind",
  "listDirectorRuntimeConsumerContextAvailabilityStates",
  "listDirectorRuntimeConsumerContextBindingStatuses",
  "isDirectorRuntimeConsumerContextScope",
  "isDirectorRuntimeConsumerContextMode",
  "isDirectorRuntimeConsumerContextAvailability",
  "isDirectorRuntimeConsumerContextBindingStatus",
  "knownConsumerContextField",
  "absentConsumerContextField",
  "notApplicableConsumerContextField",
  "bindDirectorRuntimeConsumerContext",
  "resolveDirectorRuntimeConsumerContext",
  "validateDirectorRuntimeConsumerContext",
  "verifyDirectorRuntimeConsumerContextBinding",
] as const);

export const DIRECTOR_RUNTIME_CONSUMER_CONTEXT_BINDING_REGISTRY_SECTIONS =
  Object.freeze([
    "identity",
    "dependency",
    "scopes",
    "subject-kinds",
    "availability-states",
    "binding-statuses",
    "context-capabilities",
    "precedence",
    "diagnostics",
    "provenance",
    "guarantees",
  ] as const);

export const directorRuntimeConsumerContextBindingRegistry = Object.freeze({
  identity: directorRuntimeConsumerContextBindingIdentity,
  version: directorRuntimeConsumerContextBindingVersion,
  namespace: directorRuntimeConsumerContextBindingNamespace,
  dependency: directorRuntimeConsumerContextBindingUpstream,
  scopes: DIRECTOR_RUNTIME_CONSUMER_CONTEXT_SCOPES,
  scopeCount: DIRECTOR_RUNTIME_CONSUMER_CONTEXT_SCOPES.length,
  subjectKinds: DIRECTOR_RUNTIME_CONSUMER_SUBJECT_KINDS,
  subjectKindCount: DIRECTOR_RUNTIME_CONSUMER_SUBJECT_KINDS.length,
  modes: DIRECTOR_RUNTIME_CONSUMER_CONTEXT_MODES,
  modeCount: DIRECTOR_RUNTIME_CONSUMER_CONTEXT_MODES.length,
  packCategories: DIRECTOR_RUNTIME_CONSUMER_PACK_CATEGORIES,
  packCategoryCount: DIRECTOR_RUNTIME_CONSUMER_PACK_CATEGORIES.length,
  temporalKinds: DIRECTOR_RUNTIME_CONSUMER_TEMPORAL_KINDS,
  temporalKindCount: DIRECTOR_RUNTIME_CONSUMER_TEMPORAL_KINDS.length,
  presenceStates: DIRECTOR_RUNTIME_CONSUMER_CONTEXT_PRESENCE_STATES,
  presenceStateCount: DIRECTOR_RUNTIME_CONSUMER_CONTEXT_PRESENCE_STATES.length,
  availabilityStates: DIRECTOR_RUNTIME_CONSUMER_CONTEXT_AVAILABILITY_STATES,
  availabilityStateCount:
    DIRECTOR_RUNTIME_CONSUMER_CONTEXT_AVAILABILITY_STATES.length,
  bindingStatuses: DIRECTOR_RUNTIME_CONSUMER_CONTEXT_BINDING_STATUSES,
  bindingStatusCount: DIRECTOR_RUNTIME_CONSUMER_CONTEXT_BINDING_STATUSES.length,
  contextCapabilities: DIRECTOR_RUNTIME_CONSUMER_CONTEXT_CAPABILITIES,
  contextCapabilityCount: DIRECTOR_RUNTIME_CONSUMER_CONTEXT_CAPABILITIES.length,
  precedence: DIRECTOR_RUNTIME_CONSUMER_CONTEXT_PRECEDENCE,
  precedenceRuleCount: DIRECTOR_RUNTIME_CONSUMER_CONTEXT_PRECEDENCE.length,
  diagnosticKinds: DIRECTOR_RUNTIME_CONSUMER_CONTEXT_DIAGNOSTIC_KINDS,
  diagnosticKindCount: DIRECTOR_RUNTIME_CONSUMER_CONTEXT_DIAGNOSTIC_KINDS.length,
  provenanceFields: DIRECTOR_RUNTIME_CONSUMER_CONTEXT_PROVENANCE_FIELDS,
  provenanceFieldCount:
    DIRECTOR_RUNTIME_CONSUMER_CONTEXT_PROVENANCE_FIELDS.length,
  guarantees: DIRECTOR_RUNTIME_CONSUMER_CONTEXT_BINDING_GUARANTEES,
  guaranteeCount: DIRECTOR_RUNTIME_CONSUMER_CONTEXT_BINDING_GUARANTEES.length,
  registrySections:
    DIRECTOR_RUNTIME_CONSUMER_CONTEXT_BINDING_REGISTRY_SECTIONS,
  registrySectionCount:
    DIRECTOR_RUNTIME_CONSUMER_CONTEXT_BINDING_REGISTRY_SECTIONS.length,
  publicApis: directorRuntimeConsumerContextBindingApiNames,
  publicApiCount: directorRuntimeConsumerContextBindingApiNames.length,
  experienceSurfaces: DIRECTOR_RUNTIME_EXPERIENCE_SURFACES,
});

export const directorRuntimeConsumerContextBinding = Object.freeze({
  phase: "DRI-8:2" as const,
  name: "DirectorRuntimeConsumerContextBinding" as const,
  identity: directorRuntimeConsumerContextBindingIdentity,
  namespace: directorRuntimeConsumerContextBindingNamespace,
  version: directorRuntimeConsumerContextBindingVersion,
  layer: "DirectorRuntimeConsumerIntegration" as const,
  role: "ConsumerContextBinding" as const,
  stage: "ContextBinding" as const,
  status: "ContextBindingReady" as const,
  upstreamDependency: directorRuntimeConsumerContextBindingUpstream,
  deterministic: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  philosophy: "binding-preserves-semantic-identity-not-reasoning" as const,
  scopes: DIRECTOR_RUNTIME_CONSUMER_CONTEXT_SCOPES,
  subjectKinds: DIRECTOR_RUNTIME_CONSUMER_SUBJECT_KINDS,
  availabilityStates: DIRECTOR_RUNTIME_CONSUMER_CONTEXT_AVAILABILITY_STATES,
  bindingStatuses: DIRECTOR_RUNTIME_CONSUMER_CONTEXT_BINDING_STATUSES,
  contextCapabilities: DIRECTOR_RUNTIME_CONSUMER_CONTEXT_CAPABILITIES,
  precedence: DIRECTOR_RUNTIME_CONSUMER_CONTEXT_PRECEDENCE,
  diagnosticKinds: DIRECTOR_RUNTIME_CONSUMER_CONTEXT_DIAGNOSTIC_KINDS,
  guarantees: DIRECTOR_RUNTIME_CONSUMER_CONTEXT_BINDING_GUARANTEES,
  publicApiSurface: directorRuntimeConsumerContextBindingApiNames,
  registry: directorRuntimeConsumerContextBindingRegistry,
  foundationBoundary: "DRI-8:1-foundation-only" as const,
  architecturalStatus:
    "Context Binding Complete · Deterministic · Immutable · Framework-Independent · ReadyForExperienceSurfaceBinding" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface DirectorRuntimeConsumerContextBindingVerification {
  readonly ok: boolean;
  readonly identity: typeof directorRuntimeConsumerContextBindingIdentity;
  readonly version: typeof directorRuntimeConsumerContextBindingVersion;
  readonly namespace: typeof directorRuntimeConsumerContextBindingNamespace;
  readonly dependency: typeof directorRuntimeConsumerContextBindingUpstream;
  readonly scopeCount: number;
  readonly subjectKindCount: number;
  readonly availabilityStateCount: number;
  readonly bindingStatusCount: number;
  readonly contextCapabilityCount: number;
  readonly diagnosticKindCount: number;
  readonly provenanceFieldCount: number;
  readonly precedenceRuleCount: number;
  readonly guaranteeCount: number;
  readonly registrySectionCount: number;
  readonly publicApiCount: number;
  readonly frozen: boolean;
  readonly dri81BoundaryIntact: boolean;
  readonly frameworkIndependent: boolean;
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

export function verifyDirectorRuntimeConsumerContextBinding():
  DirectorRuntimeConsumerContextBindingVerification {
  const binding = directorRuntimeConsumerContextBinding;
  const registry = directorRuntimeConsumerContextBindingRegistry;

  const identityOk =
    binding.identity === "DRI-8:2/DirectorRuntimeConsumerContextBinding" &&
    binding.version === "8.2.0" &&
    binding.namespace === "nexora.dri.consumer-integration.context-binding" &&
    binding.layer === "DirectorRuntimeConsumerIntegration" &&
    binding.role === "ConsumerContextBinding" &&
    binding.upstreamDependency ===
      "DRI-8:1/DirectorRuntimeConsumerIntegrationFoundation" &&
    binding.upstreamDependency ===
      directorRuntimeConsumerIntegrationFoundationIdentity &&
    registry.dependency === binding.upstreamDependency &&
    binding.foundationBoundary === "DRI-8:1-foundation-only";

  const vocabularyOk =
    exactOrder(DIRECTOR_RUNTIME_CONSUMER_CONTEXT_SCOPES, [
      "global",
      "workspace",
      "surface",
      "subject",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_CONSUMER_SUBJECT_KINDS, [
      "goal",
      "object",
      "pack",
      "problem",
      "scenario",
      "decision",
      "execution",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_CONSUMER_CONTEXT_AVAILABILITY_STATES, [
      "available",
      "partial",
      "unavailable",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_CONSUMER_CONTEXT_BINDING_STATUSES, [
      "bound",
      "partially-bound",
      "unbound",
      "invalid",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_CONSUMER_CONTEXT_PRECEDENCE, [
      "subject",
      "surface",
      "workspace",
      "global",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_CONSUMER_CONTEXT_BINDING_GUARANTEES, [
      "framework-independent",
      "immutable-output",
      "deterministic",
      "non-mutating",
      "semantic-only",
      "no-business-inference",
      "no-rendering",
      "no-side-effects",
      "upstream-preserving",
    ]) &&
    unique([...DIRECTOR_RUNTIME_CONSUMER_CONTEXT_SCOPES]) &&
    unique([...DIRECTOR_RUNTIME_CONSUMER_SUBJECT_KINDS]) &&
    unique([...DIRECTOR_RUNTIME_CONSUMER_CONTEXT_AVAILABILITY_STATES]) &&
    unique([...DIRECTOR_RUNTIME_CONSUMER_CONTEXT_BINDING_STATUSES]) &&
    unique([...DIRECTOR_RUNTIME_CONSUMER_CONTEXT_CAPABILITIES]) &&
    unique([...DIRECTOR_RUNTIME_CONSUMER_CONTEXT_DIAGNOSTIC_KINDS]) &&
    unique([...DIRECTOR_RUNTIME_CONSUMER_CONTEXT_BINDING_GUARANTEES]);

  const registryOk =
    registry.scopeCount === DIRECTOR_RUNTIME_CONSUMER_CONTEXT_SCOPES.length &&
    registry.subjectKindCount ===
      DIRECTOR_RUNTIME_CONSUMER_SUBJECT_KINDS.length &&
    registry.availabilityStateCount ===
      DIRECTOR_RUNTIME_CONSUMER_CONTEXT_AVAILABILITY_STATES.length &&
    registry.bindingStatusCount ===
      DIRECTOR_RUNTIME_CONSUMER_CONTEXT_BINDING_STATUSES.length &&
    registry.contextCapabilityCount ===
      DIRECTOR_RUNTIME_CONSUMER_CONTEXT_CAPABILITIES.length &&
    registry.diagnosticKindCount ===
      DIRECTOR_RUNTIME_CONSUMER_CONTEXT_DIAGNOSTIC_KINDS.length &&
    registry.provenanceFieldCount ===
      DIRECTOR_RUNTIME_CONSUMER_CONTEXT_PROVENANCE_FIELDS.length &&
    registry.precedenceRuleCount ===
      DIRECTOR_RUNTIME_CONSUMER_CONTEXT_PRECEDENCE.length &&
    registry.guaranteeCount ===
      DIRECTOR_RUNTIME_CONSUMER_CONTEXT_BINDING_GUARANTEES.length &&
    registry.registrySectionCount ===
      DIRECTOR_RUNTIME_CONSUMER_CONTEXT_BINDING_REGISTRY_SECTIONS.length &&
    registry.publicApiCount ===
      directorRuntimeConsumerContextBindingApiNames.length;

  const frozen =
    Object.isFrozen(binding) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(directorRuntimeConsumerContextBindingCanonicalIdentity) &&
    Object.isFrozen(DIRECTOR_RUNTIME_CONSUMER_CONTEXT_SCOPES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_CONSUMER_SUBJECT_KINDS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_CONSUMER_CONTEXT_AVAILABILITY_STATES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_CONSUMER_CONTEXT_BINDING_STATUSES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_CONSUMER_CONTEXT_CAPABILITIES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_CONSUMER_CONTEXT_PRECEDENCE) &&
    Object.isFrozen(DIRECTOR_RUNTIME_CONSUMER_CONTEXT_DIAGNOSTIC_KINDS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_CONSUMER_CONTEXT_BINDING_GUARANTEES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_CONSUMER_CONTEXT_PROVENANCE_FIELDS);

  const dri81BoundaryIntact =
    binding.upstreamDependency ===
      "DRI-8:1/DirectorRuntimeConsumerIntegrationFoundation" &&
    binding.foundationBoundary === "DRI-8:1-foundation-only";

  const frameworkIndependent =
    binding.frameworkIndependent === true &&
    binding.rendererIndependent === true;

  const ok =
    identityOk &&
    vocabularyOk &&
    registryOk &&
    frozen &&
    dri81BoundaryIntact &&
    frameworkIndependent;

  return Object.freeze({
    ok,
    identity: directorRuntimeConsumerContextBindingIdentity,
    version: directorRuntimeConsumerContextBindingVersion,
    namespace: directorRuntimeConsumerContextBindingNamespace,
    dependency: directorRuntimeConsumerContextBindingUpstream,
    scopeCount: DIRECTOR_RUNTIME_CONSUMER_CONTEXT_SCOPES.length,
    subjectKindCount: DIRECTOR_RUNTIME_CONSUMER_SUBJECT_KINDS.length,
    availabilityStateCount:
      DIRECTOR_RUNTIME_CONSUMER_CONTEXT_AVAILABILITY_STATES.length,
    bindingStatusCount:
      DIRECTOR_RUNTIME_CONSUMER_CONTEXT_BINDING_STATUSES.length,
    contextCapabilityCount:
      DIRECTOR_RUNTIME_CONSUMER_CONTEXT_CAPABILITIES.length,
    diagnosticKindCount:
      DIRECTOR_RUNTIME_CONSUMER_CONTEXT_DIAGNOSTIC_KINDS.length,
    provenanceFieldCount:
      DIRECTOR_RUNTIME_CONSUMER_CONTEXT_PROVENANCE_FIELDS.length,
    precedenceRuleCount: DIRECTOR_RUNTIME_CONSUMER_CONTEXT_PRECEDENCE.length,
    guaranteeCount: DIRECTOR_RUNTIME_CONSUMER_CONTEXT_BINDING_GUARANTEES.length,
    registrySectionCount:
      DIRECTOR_RUNTIME_CONSUMER_CONTEXT_BINDING_REGISTRY_SECTIONS.length,
    publicApiCount: directorRuntimeConsumerContextBindingApiNames.length,
    frozen,
    dri81BoundaryIntact,
    frameworkIndependent,
  });
}

// Re-export foundation consumer types used at the DRI-8:2 boundary.
export type { DirectorRuntimeConsumer, DirectorRuntimeConsumerFamily };
