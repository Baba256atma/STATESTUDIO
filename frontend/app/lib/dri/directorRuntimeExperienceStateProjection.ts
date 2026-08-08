/**
 * DRI-8:4 — Director Runtime Experience State Projection.
 *
 * Transforms DRI-8:3 surface-scoped semantic bindings into deterministic,
 * immutable, consumer-ready Experience State Projections.
 *
 * Principle: DRI-8:3 = WHERE context belongs.
 * DRI-8:4 = WHAT semantic state should be presented.
 * Executive UI = HOW that state is visually rendered.
 */

import {
  DIRECTOR_RUNTIME_EXPERIENCE_SURFACES,
  directorRuntimeExperienceSurfaceBindingIdentity,
  isDirectorRuntimeExperienceSurface,
  isDirectorRuntimeExperienceSurfaceBindingStatus,
  type DirectorRuntimeExperienceSurface,
  type DirectorRuntimeExperienceSurfaceAvailability,
  type DirectorRuntimeExperienceSurfaceBinding,
  type DirectorRuntimeExperienceSurfaceBindingResult,
  type DirectorRuntimeExperienceSurfaceRelevantContext,
  validateDirectorRuntimeExperienceSurfaceBinding,
} from "@/app/lib/dri/directorRuntimeExperienceSurfaceBinding";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeExperienceStateProjectionIdentity =
  "DRI-8:4/DirectorRuntimeExperienceStateProjection" as const;
export const directorRuntimeExperienceStateProjectionVersion = "8.4.0" as const;
export const directorRuntimeExperienceStateProjectionNamespace =
  "nexora.dri.consumer-integration.experience-state-projection" as const;
export const directorRuntimeExperienceStateProjectionUpstream =
  directorRuntimeExperienceSurfaceBindingIdentity;

export const directorRuntimeExperienceStateProjectionCanonicalIdentity =
  Object.freeze({
    identity: directorRuntimeExperienceStateProjectionIdentity,
    version: directorRuntimeExperienceStateProjectionVersion,
    namespace: directorRuntimeExperienceStateProjectionNamespace,
    upstream: directorRuntimeExperienceStateProjectionUpstream,
  });

// ─── Subject reference (derived from DRI-8:3 relevant context) ──────────────

export type DirectorRuntimeExperienceProjectedSubject = NonNullable<
  DirectorRuntimeExperienceSurfaceRelevantContext["activeSubject"]
>;

// ─── Projection status ──────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_STATUSES = Object.freeze([
  "projected",
  "partially-projected",
  "inactive",
  "unavailable",
  "invalid",
] as const);
export type DirectorRuntimeExperienceProjectionStatus =
  (typeof DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_STATUSES)[number];

// ─── Activity ───────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXPERIENCE_ACTIVITY_STATES = Object.freeze([
  "active",
  "supporting",
  "background",
  "inactive",
] as const);
export type DirectorRuntimeExperienceActivityState =
  (typeof DIRECTOR_RUNTIME_EXPERIENCE_ACTIVITY_STATES)[number];

// ─── Visibility (semantic intent — not CSS) ─────────────────────────────────

export const DIRECTOR_RUNTIME_EXPERIENCE_VISIBILITY_STATES = Object.freeze([
  "visible",
  "hidden",
  "collapsed",
] as const);
export type DirectorRuntimeExperienceVisibilityState =
  (typeof DIRECTOR_RUNTIME_EXPERIENCE_VISIBILITY_STATES)[number];

// ─── Dominance ──────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXPERIENCE_DOMINANCE_STATES = Object.freeze([
  "primary",
  "secondary",
  "background",
  "none",
] as const);
export type DirectorRuntimeExperienceDominanceState =
  (typeof DIRECTOR_RUNTIME_EXPERIENCE_DOMINANCE_STATES)[number];

// ─── Presentation (canonical NexoraObject states) ───────────────────────────

export const DIRECTOR_RUNTIME_EXPERIENCE_PRESENTATION_STATES = Object.freeze([
  "minimum",
  "report",
  "operation",
] as const);
export type DirectorRuntimeExperiencePresentationState =
  (typeof DIRECTOR_RUNTIME_EXPERIENCE_PRESENTATION_STATES)[number];

// ─── Emphasis ───────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXPERIENCE_EMPHASIS_STATES = Object.freeze([
  "none",
  "normal",
  "highlighted",
  "warning",
  "critical",
] as const);
export type DirectorRuntimeExperienceEmphasisState =
  (typeof DIRECTOR_RUNTIME_EXPERIENCE_EMPHASIS_STATES)[number];

// ─── Attention (surface-ready; does not recreate DRI-6) ─────────────────────

export const DIRECTOR_RUNTIME_EXPERIENCE_ATTENTION_STATES = Object.freeze([
  "none",
  "low",
  "normal",
  "elevated",
  "high",
  "critical",
] as const);
export type DirectorRuntimeExperienceAttentionState =
  (typeof DIRECTOR_RUNTIME_EXPERIENCE_ATTENTION_STATES)[number];

// ─── Interaction readiness ──────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXPERIENCE_INTERACTION_READINESS_STATES =
  Object.freeze(["enabled", "limited", "disabled"] as const);
export type DirectorRuntimeExperienceInteractionReadiness =
  (typeof DIRECTOR_RUNTIME_EXPERIENCE_INTERACTION_READINESS_STATES)[number];

// ─── Context availability (aligned with DRI-8:3) ────────────────────────────

export const DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_CONTEXT_AVAILABILITY =
  Object.freeze(["available", "partial", "unavailable"] as const);
export type DirectorRuntimeExperienceProjectionContextAvailability =
  (typeof DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_CONTEXT_AVAILABILITY)[number];

// ─── Field availability helpers ─────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXPERIENCE_FIELD_AVAILABILITY_STATES =
  Object.freeze(["available", "unavailable", "not-applicable"] as const);
export type DirectorRuntimeExperienceFieldAvailability =
  (typeof DIRECTOR_RUNTIME_EXPERIENCE_FIELD_AVAILABILITY_STATES)[number];

// ─── Projection reasons ─────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_REASONS = Object.freeze([
  "surface-bound",
  "surface-partially-bound",
  "surface-inactive",
  "surface-unavailable",
  "active-subject-present",
  "selection-present",
  "focus-present",
  "attention-elevated",
  "guidance-available",
  "partial-context",
  "temporal-context-available",
  "pack-context-available",
  "interaction-capability-available",
  "presentation-report",
  "presentation-operation",
  "presentation-minimum",
] as const);
export type DirectorRuntimeExperienceProjectionReason =
  (typeof DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_REASONS)[number];

// ─── Diagnostics ────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_DIAGNOSTIC_KINDS =
  Object.freeze([
    "invalid-binding",
    "unsupported-surface",
    "missing-projection-context",
    "partial-projection",
    "invalid-projection-state",
    "unsupported-presentation-state",
  ] as const);
export type DirectorRuntimeExperienceProjectionDiagnosticKind =
  (typeof DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_DIAGNOSTIC_KINDS)[number];

export interface DirectorRuntimeExperienceProjectionDiagnostic {
  readonly kind: DirectorRuntimeExperienceProjectionDiagnosticKind;
  readonly path: string;
  readonly message: string;
}

// ─── Guarantees ─────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXPERIENCE_STATE_PROJECTION_GUARANTEES =
  Object.freeze([
    "semantic-only",
    "consumer-ready",
    "framework-independent",
    "surface-scoped",
    "immutable",
    "deterministic",
    "non-mutating",
    "identity-preserving",
    "provenance-preserving",
    "no-business-inference",
    "no-rendering",
    "no-interaction-translation",
    "no-cross-surface-orchestration",
  ] as const);
export type DirectorRuntimeExperienceStateProjectionGuarantee =
  (typeof DIRECTOR_RUNTIME_EXPERIENCE_STATE_PROJECTION_GUARANTEES)[number];

// ─── Provenance ─────────────────────────────────────────────────────────────

export interface DirectorRuntimeExperienceStateProjectionProvenance {
  readonly sourceBindingIdentity: string;
  readonly surfaceBindingIdentity: string;
  readonly stateProjectionIdentity: string;
  readonly surfaceIdentifier: DirectorRuntimeExperienceSurface | "aggregate";
}

export const DIRECTOR_RUNTIME_EXPERIENCE_STATE_PROJECTION_PROVENANCE_FIELDS =
  Object.freeze([
    "sourceBindingIdentity",
    "surfaceBindingIdentity",
    "stateProjectionIdentity",
    "surfaceIdentifier",
  ] as const);

// ─── Projection rule registry (inspectable, generic) ────────────────────────

export const DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_RULES = Object.freeze([
  Object.freeze({
    id: "bound-to-projected",
    statement: "bound surface binding projects to projected status",
  }),
  Object.freeze({
    id: "partial-to-partially-projected",
    statement:
      "partially-bound surface binding projects to partially-projected status",
  }),
  Object.freeze({
    id: "inactive-preserved",
    statement: "inactive surface binding projects to inactive status",
  }),
  Object.freeze({
    id: "unavailable-preserved",
    statement: "unavailable surface binding projects to unavailable status",
  }),
  Object.freeze({
    id: "stage-primary-when-active",
    statement: "active stage projection receives primary dominance",
  }),
  Object.freeze({
    id: "supporting-surfaces-secondary",
    statement:
      "advisor, insight, and live-lens receive supporting activity when projected",
  }),
  Object.freeze({
    id: "background-surfaces",
    statement:
      "timeline and explorer receive background activity when projected",
  }),
  Object.freeze({
    id: "attention-drives-emphasis",
    statement:
      "approved attention priority maps deterministically to emphasis and attention state",
  }),
  Object.freeze({
    id: "guidance-drives-operation",
    statement:
      "available guidance on guidance-capable surfaces selects operation presentation",
  }),
  Object.freeze({
    id: "subject-identity-preserved",
    statement: "projected subject identifiers equal upstream bound identifiers",
  }),
] as const);

export type DirectorRuntimeExperienceProjectionRule =
  (typeof DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_RULES)[number];

// ─── Surface projection capability descriptors ──────────────────────────────

export const DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_PROJECTION_CAPABILITIES =
  Object.freeze({
    stage: Object.freeze([
      "activity",
      "dominance",
      "visibility",
      "presentation-state",
      "focus-state",
      "selection-state",
      "attention-state",
      "emphasis",
      "interaction-readiness",
      "active-subject",
    ] as const),
    advisor: Object.freeze([
      "activity",
      "visibility",
      "dominance",
      "guidance-availability",
      "attention-relevance",
      "interaction-readiness",
      "active-subject",
      "context-completeness",
    ] as const),
    insight: Object.freeze([
      "activity",
      "visibility",
      "state-availability",
      "attention-relevance",
      "presentation-state",
    ] as const),
    "live-lens": Object.freeze([
      "activity",
      "visibility",
      "dominance",
      "focus-availability",
      "selection-availability",
      "relationship-availability",
      "presentation-state",
    ] as const),
    timeline: Object.freeze([
      "activity",
      "visibility",
      "temporal-availability",
      "temporal-mode",
      "pack-relevance",
      "interaction-readiness",
    ] as const),
    explorer: Object.freeze([
      "activity",
      "visibility",
      "subject-availability",
      "relationship-availability",
      "pack-availability",
      "interaction-readiness",
    ] as const),
  } as const);

// ─── Core contracts ─────────────────────────────────────────────────────────

export interface DirectorRuntimeExperienceStateProjection {
  readonly surface: DirectorRuntimeExperienceSurface;
  readonly status: DirectorRuntimeExperienceProjectionStatus;
  readonly activity: DirectorRuntimeExperienceActivityState;
  readonly visibility: DirectorRuntimeExperienceVisibilityState;
  readonly dominance: DirectorRuntimeExperienceDominanceState;
  readonly presentationState: DirectorRuntimeExperiencePresentationState;
  readonly emphasis: DirectorRuntimeExperienceEmphasisState;
  readonly attentionState: DirectorRuntimeExperienceAttentionState;
  readonly interactionReadiness: DirectorRuntimeExperienceInteractionReadiness;
  readonly contextAvailability: DirectorRuntimeExperienceProjectionContextAvailability;
  readonly subject: DirectorRuntimeExperienceProjectedSubject | null;
  readonly selectedSubject: DirectorRuntimeExperienceProjectedSubject | null;
  readonly focusedSubject: DirectorRuntimeExperienceProjectedSubject | null;
  readonly guidanceAvailability: DirectorRuntimeExperienceFieldAvailability;
  readonly focusAvailability: DirectorRuntimeExperienceFieldAvailability;
  readonly selectionAvailability: DirectorRuntimeExperienceFieldAvailability;
  readonly temporalMode:
    | NonNullable<
      DirectorRuntimeExperienceSurfaceRelevantContext["temporal"]
    >["temporalKind"]
    | "not-applicable";
  readonly reasons: ReadonlyArray<DirectorRuntimeExperienceProjectionReason>;
  readonly provenance: DirectorRuntimeExperienceStateProjectionProvenance;
}

export interface DirectorRuntimeExperienceStateProjectionInput {
  readonly surfaceBindings: DirectorRuntimeExperienceSurfaceBindingResult;
}

export interface DirectorRuntimeExperienceStateProjectionResult {
  readonly projections: ReadonlyArray<DirectorRuntimeExperienceStateProjection>;
  readonly status: DirectorRuntimeExperienceProjectionStatus;
  readonly activeProjections: ReadonlyArray<DirectorRuntimeExperienceSurface>;
  readonly inactiveProjections: ReadonlyArray<DirectorRuntimeExperienceSurface>;
  readonly diagnostics: ReadonlyArray<
    DirectorRuntimeExperienceProjectionDiagnostic
  >;
  readonly provenance: DirectorRuntimeExperienceStateProjectionProvenance;
}

// ─── Membership helpers ─────────────────────────────────────────────────────

export function isDirectorRuntimeExperienceProjectionStatus(
  value: unknown,
): value is DirectorRuntimeExperienceProjectionStatus {
  return (
    DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_STATUSES as readonly unknown[]
  ).includes(value);
}

export function isDirectorRuntimeExperienceActivityState(
  value: unknown,
): value is DirectorRuntimeExperienceActivityState {
  return (
    DIRECTOR_RUNTIME_EXPERIENCE_ACTIVITY_STATES as readonly unknown[]
  ).includes(value);
}

export function isDirectorRuntimeExperienceVisibilityState(
  value: unknown,
): value is DirectorRuntimeExperienceVisibilityState {
  return (
    DIRECTOR_RUNTIME_EXPERIENCE_VISIBILITY_STATES as readonly unknown[]
  ).includes(value);
}

export function isDirectorRuntimeExperienceDominanceState(
  value: unknown,
): value is DirectorRuntimeExperienceDominanceState {
  return (
    DIRECTOR_RUNTIME_EXPERIENCE_DOMINANCE_STATES as readonly unknown[]
  ).includes(value);
}

export function isDirectorRuntimeExperiencePresentationState(
  value: unknown,
): value is DirectorRuntimeExperiencePresentationState {
  return (
    DIRECTOR_RUNTIME_EXPERIENCE_PRESENTATION_STATES as readonly unknown[]
  ).includes(value);
}

export function isDirectorRuntimeExperienceEmphasisState(
  value: unknown,
): value is DirectorRuntimeExperienceEmphasisState {
  return (
    DIRECTOR_RUNTIME_EXPERIENCE_EMPHASIS_STATES as readonly unknown[]
  ).includes(value);
}

export function isDirectorRuntimeExperienceInteractionReadiness(
  value: unknown,
): value is DirectorRuntimeExperienceInteractionReadiness {
  return (
    DIRECTOR_RUNTIME_EXPERIENCE_INTERACTION_READINESS_STATES as readonly unknown[]
  ).includes(value);
}

// ─── Public list / identity APIs ────────────────────────────────────────────

export function getDirectorRuntimeExperienceStateProjectionIdentity():
  typeof directorRuntimeExperienceStateProjectionCanonicalIdentity {
  return directorRuntimeExperienceStateProjectionCanonicalIdentity;
}

export function listDirectorRuntimeExperienceProjectionStatuses():
  ReadonlyArray<DirectorRuntimeExperienceProjectionStatus> {
  return DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_STATUSES;
}

export function listDirectorRuntimeExperienceActivityStates():
  ReadonlyArray<DirectorRuntimeExperienceActivityState> {
  return DIRECTOR_RUNTIME_EXPERIENCE_ACTIVITY_STATES;
}

export function listDirectorRuntimeExperienceVisibilityStates():
  ReadonlyArray<DirectorRuntimeExperienceVisibilityState> {
  return DIRECTOR_RUNTIME_EXPERIENCE_VISIBILITY_STATES;
}

export function listDirectorRuntimeExperienceDominanceStates():
  ReadonlyArray<DirectorRuntimeExperienceDominanceState> {
  return DIRECTOR_RUNTIME_EXPERIENCE_DOMINANCE_STATES;
}

export function listDirectorRuntimeExperiencePresentationStates():
  ReadonlyArray<DirectorRuntimeExperiencePresentationState> {
  return DIRECTOR_RUNTIME_EXPERIENCE_PRESENTATION_STATES;
}

export function listDirectorRuntimeExperienceEmphasisStates():
  ReadonlyArray<DirectorRuntimeExperienceEmphasisState> {
  return DIRECTOR_RUNTIME_EXPERIENCE_EMPHASIS_STATES;
}

export function listDirectorRuntimeExperienceInteractionReadinessStates():
  ReadonlyArray<DirectorRuntimeExperienceInteractionReadiness> {
  return DIRECTOR_RUNTIME_EXPERIENCE_INTERACTION_READINESS_STATES;
}

// ─── Internal helpers ───────────────────────────────────────────────────────

function diagnostic(
  kind: DirectorRuntimeExperienceProjectionDiagnosticKind,
  path: string,
  message: string,
): DirectorRuntimeExperienceProjectionDiagnostic {
  return Object.freeze({ kind, path, message });
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function freezeSubject(
  subject: DirectorRuntimeExperienceProjectedSubject,
): DirectorRuntimeExperienceProjectedSubject {
  if (subject.label !== undefined) {
    return Object.freeze({
      kind: subject.kind,
      id: subject.id,
      label: subject.label,
    });
  }
  return Object.freeze({ kind: subject.kind, id: subject.id });
}

function mapBindingStatusToProjectionStatus(
  status: DirectorRuntimeExperienceSurfaceBinding["status"],
): DirectorRuntimeExperienceProjectionStatus {
  if (status === "bound") return "projected";
  if (status === "partially-bound") return "partially-projected";
  if (status === "inactive") return "inactive";
  if (status === "unavailable") return "unavailable";
  return "invalid";
}

function mapAttentionPriority(
  priority: string | undefined,
): {
  readonly attentionState: DirectorRuntimeExperienceAttentionState;
  readonly emphasis: DirectorRuntimeExperienceEmphasisState;
  readonly elevated: boolean;
} {
  if (priority === undefined || priority.length === 0) {
    return {
      attentionState: "none",
      emphasis: "none",
      elevated: false,
    };
  }
  const normalized = priority.trim().toLowerCase();
  if (normalized === "critical") {
    return { attentionState: "critical", emphasis: "critical", elevated: true };
  }
  if (
    normalized === "high" ||
    normalized === "primary" ||
    normalized === "immediate"
  ) {
    return { attentionState: "high", emphasis: "warning", elevated: true };
  }
  if (normalized === "elevated" || normalized === "important") {
    return {
      attentionState: "elevated",
      emphasis: "highlighted",
      elevated: true,
    };
  }
  if (normalized === "normal" || normalized === "secondary") {
    return { attentionState: "normal", emphasis: "normal", elevated: false };
  }
  if (normalized === "low" || normalized === "background") {
    return { attentionState: "low", emphasis: "none", elevated: false };
  }
  // Preserve unknown approved upstream tokens as elevated informational emphasis.
  return { attentionState: "elevated", emphasis: "highlighted", elevated: true };
}

function resolveActivity(
  surface: DirectorRuntimeExperienceSurface,
  projectionStatus: DirectorRuntimeExperienceProjectionStatus,
): DirectorRuntimeExperienceActivityState {
  if (
    projectionStatus === "inactive" ||
    projectionStatus === "unavailable" ||
    projectionStatus === "invalid"
  ) {
    return "inactive";
  }
  if (surface === "stage") return "active";
  if (
    surface === "advisor" ||
    surface === "insight" ||
    surface === "live-lens"
  ) {
    return "supporting";
  }
  return "background";
}

function resolveDominance(
  surface: DirectorRuntimeExperienceSurface,
  projectionStatus: DirectorRuntimeExperienceProjectionStatus,
): DirectorRuntimeExperienceDominanceState {
  if (
    projectionStatus === "inactive" ||
    projectionStatus === "unavailable" ||
    projectionStatus === "invalid"
  ) {
    return "none";
  }
  if (surface === "stage") return "primary";
  if (
    surface === "advisor" ||
    surface === "insight" ||
    surface === "live-lens"
  ) {
    return "secondary";
  }
  return "background";
}

function resolveVisibility(
  projectionStatus: DirectorRuntimeExperienceProjectionStatus,
): DirectorRuntimeExperienceVisibilityState {
  if (
    projectionStatus === "projected" ||
    projectionStatus === "partially-projected"
  ) {
    return "visible";
  }
  if (projectionStatus === "inactive") return "collapsed";
  return "hidden";
}

function resolvePresentationState(
  surface: DirectorRuntimeExperienceSurface,
  binding: DirectorRuntimeExperienceSurfaceBinding,
  projectionStatus: DirectorRuntimeExperienceProjectionStatus,
): {
  readonly presentationState: DirectorRuntimeExperiencePresentationState;
  readonly reason: DirectorRuntimeExperienceProjectionReason;
} {
  if (
    projectionStatus === "inactive" ||
    projectionStatus === "unavailable" ||
    projectionStatus === "invalid"
  ) {
    return { presentationState: "minimum", reason: "presentation-minimum" };
  }

  const ctx = binding.relevantContext;
  const hasGuidance = ctx.guidance !== undefined;
  const hasAttention = ctx.attention !== undefined;
  const hasSubject =
    ctx.activeSubject !== undefined ||
    ctx.activeObject !== undefined ||
    ctx.activeGoal !== undefined;
  const hasFocus = ctx.focusedSubject !== undefined;
  const hasPack = ctx.activePack !== undefined;
  const hasTemporal = ctx.temporal !== undefined;
  const supportsGuidance = binding.capabilities.includes("guidance");
  const supportsInteraction = binding.capabilities.includes("interaction");

  if (
    hasGuidance &&
    (supportsGuidance || supportsInteraction) &&
    (surface === "advisor" || surface === "stage")
  ) {
    return { presentationState: "operation", reason: "presentation-operation" };
  }

  if (
    hasSubject ||
    hasFocus ||
    hasAttention ||
    hasPack ||
    (surface === "timeline" && hasTemporal) ||
    surface === "insight"
  ) {
    return { presentationState: "report", reason: "presentation-report" };
  }

  return { presentationState: "minimum", reason: "presentation-minimum" };
}

function resolveInteractionReadiness(
  binding: DirectorRuntimeExperienceSurfaceBinding,
  projectionStatus: DirectorRuntimeExperienceProjectionStatus,
): {
  readonly readiness: DirectorRuntimeExperienceInteractionReadiness;
  readonly interactionCapable: boolean;
} {
  const interactionCapable = binding.capabilities.includes("interaction");
  if (
    projectionStatus === "inactive" ||
    projectionStatus === "unavailable" ||
    projectionStatus === "invalid"
  ) {
    return { readiness: "disabled", interactionCapable };
  }
  if (!interactionCapable) {
    return { readiness: "disabled", interactionCapable };
  }
  if (projectionStatus === "partially-projected") {
    return { readiness: "limited", interactionCapable };
  }
  return { readiness: "enabled", interactionCapable };
}

function fieldAvailability(
  present: boolean,
  applicable: boolean,
): DirectorRuntimeExperienceFieldAvailability {
  if (!applicable) return "not-applicable";
  return present ? "available" : "unavailable";
}

function mapContextAvailability(
  availability: DirectorRuntimeExperienceSurfaceAvailability,
): DirectorRuntimeExperienceProjectionContextAvailability {
  return availability;
}

function buildReasons(
  binding: DirectorRuntimeExperienceSurfaceBinding,
  projectionStatus: DirectorRuntimeExperienceProjectionStatus,
  attentionElevated: boolean,
  presentationReason: DirectorRuntimeExperienceProjectionReason,
  interactionCapable: boolean,
): ReadonlyArray<DirectorRuntimeExperienceProjectionReason> {
  const reasons: DirectorRuntimeExperienceProjectionReason[] = [];

  if (binding.status === "bound") reasons.push("surface-bound");
  if (binding.status === "partially-bound") {
    reasons.push("surface-partially-bound");
    reasons.push("partial-context");
  }
  if (binding.status === "inactive") reasons.push("surface-inactive");
  if (binding.status === "unavailable") reasons.push("surface-unavailable");

  if (binding.relevantContext.activeSubject !== undefined) {
    reasons.push("active-subject-present");
  }
  if (binding.relevantContext.selectedSubject !== undefined) {
    reasons.push("selection-present");
  }
  if (binding.relevantContext.focusedSubject !== undefined) {
    reasons.push("focus-present");
  }
  if (attentionElevated) reasons.push("attention-elevated");
  if (binding.relevantContext.guidance !== undefined) {
    reasons.push("guidance-available");
  }
  if (binding.relevantContext.temporal !== undefined) {
    reasons.push("temporal-context-available");
  }
  if (binding.relevantContext.activePack !== undefined) {
    reasons.push("pack-context-available");
  }
  if (
    interactionCapable &&
    (projectionStatus === "projected" ||
      projectionStatus === "partially-projected")
  ) {
    reasons.push("interaction-capability-available");
  }
  reasons.push(presentationReason);

  return Object.freeze([...new Set(reasons)]);
}

function buildProvenance(
  binding: DirectorRuntimeExperienceSurfaceBinding | null,
  surface: DirectorRuntimeExperienceSurface | "aggregate",
  aggregateSourceIdentity?: string,
): DirectorRuntimeExperienceStateProjectionProvenance {
  return Object.freeze({
    sourceBindingIdentity:
      aggregateSourceIdentity ??
        binding?.provenance.sourceContextIdentity ??
        "unknown",
    surfaceBindingIdentity:
      binding?.provenance.surfaceBindingIdentity ??
        directorRuntimeExperienceSurfaceBindingIdentity,
    stateProjectionIdentity: directorRuntimeExperienceStateProjectionIdentity,
    surfaceIdentifier: surface,
  });
}

function projectSingleBinding(
  binding: DirectorRuntimeExperienceSurfaceBinding,
): DirectorRuntimeExperienceStateProjection {
  const projectionStatus = mapBindingStatusToProjectionStatus(binding.status);
  const ctx = binding.relevantContext;
  const attentionMap = mapAttentionPriority(ctx.attention?.attentionPriority);
  const activity = resolveActivity(binding.surface, projectionStatus);
  const dominance = resolveDominance(binding.surface, projectionStatus);
  const visibility = resolveVisibility(projectionStatus);
  const presentation = resolvePresentationState(
    binding.surface,
    binding,
    projectionStatus,
  );
  const interaction = resolveInteractionReadiness(binding, projectionStatus);

  const guidanceApplicable =
    binding.capabilities.includes("guidance") || binding.surface === "advisor";
  const focusApplicable =
    binding.surface === "stage" ||
    binding.surface === "live-lens" ||
    binding.surface === "insight";
  const selectionApplicable =
    binding.surface === "stage" || binding.surface === "live-lens";

  const emphasis =
    projectionStatus === "projected" ||
      projectionStatus === "partially-projected"
      ? attentionMap.emphasis === "none" && ctx.guidance !== undefined
        ? "highlighted"
        : attentionMap.emphasis
      : "none";

  const attentionState =
    projectionStatus === "projected" ||
      projectionStatus === "partially-projected"
      ? attentionMap.attentionState
      : "none";

  const reasons = buildReasons(
    binding,
    projectionStatus,
    attentionMap.elevated,
    presentation.reason,
    interaction.interactionCapable,
  );

  return Object.freeze({
    surface: binding.surface,
    status: projectionStatus,
    activity,
    visibility,
    dominance,
    presentationState: presentation.presentationState,
    emphasis,
    attentionState,
    interactionReadiness: interaction.readiness,
    contextAvailability: mapContextAvailability(binding.availability),
    subject:
      ctx.activeSubject !== undefined
        ? freezeSubject(ctx.activeSubject)
        : ctx.activeObject !== undefined
        ? freezeSubject(ctx.activeObject)
        : null,
    selectedSubject:
      ctx.selectedSubject !== undefined
        ? freezeSubject(ctx.selectedSubject)
        : null,
    focusedSubject:
      ctx.focusedSubject !== undefined
        ? freezeSubject(ctx.focusedSubject)
        : null,
    guidanceAvailability: fieldAvailability(
      ctx.guidance !== undefined,
      guidanceApplicable,
    ),
    focusAvailability: fieldAvailability(
      ctx.focusedSubject !== undefined,
      focusApplicable,
    ),
    selectionAvailability: fieldAvailability(
      ctx.selectedSubject !== undefined,
      selectionApplicable,
    ),
    temporalMode:
      ctx.temporal !== undefined
        ? ctx.temporal.temporalKind
        : "not-applicable",
    reasons,
    provenance: buildProvenance(binding, binding.surface),
  });
}

function isStructurallyValidBindingResult(
  value: unknown,
): value is DirectorRuntimeExperienceSurfaceBindingResult {
  if (!isPlainObject(value)) return false;
  if (!Array.isArray(value.bindings)) return false;
  if (!isDirectorRuntimeExperienceSurfaceBindingStatus(value.status)) {
    return false;
  }
  if (!isPlainObject(value.provenance)) return false;
  return true;
}

function aggregateProjectionStatus(
  projections: ReadonlyArray<DirectorRuntimeExperienceStateProjection>,
  invalid: boolean,
): DirectorRuntimeExperienceProjectionStatus {
  if (invalid) return "invalid";
  if (projections.some((entry) => entry.status === "projected")) {
    return "projected";
  }
  if (projections.some((entry) => entry.status === "partially-projected")) {
    return "partially-projected";
  }
  if (projections.every((entry) => entry.status === "unavailable")) {
    return "unavailable";
  }
  return "inactive";
}

// ─── Validation ─────────────────────────────────────────────────────────────

export function validateDirectorRuntimeExperienceStateProjection(
  projection: DirectorRuntimeExperienceStateProjection,
): ReadonlyArray<DirectorRuntimeExperienceProjectionDiagnostic> {
  const diagnostics: DirectorRuntimeExperienceProjectionDiagnostic[] = [];

  if (!isDirectorRuntimeExperienceSurface(projection.surface)) {
    diagnostics.push(
      diagnostic(
        "unsupported-surface",
        "surface",
        "surface is not a known experience surface",
      ),
    );
  }
  if (!isDirectorRuntimeExperienceProjectionStatus(projection.status)) {
    diagnostics.push(
      diagnostic(
        "invalid-projection-state",
        "status",
        "status is not a known projection status",
      ),
    );
  }
  if (!isDirectorRuntimeExperiencePresentationState(projection.presentationState)) {
    diagnostics.push(
      diagnostic(
        "unsupported-presentation-state",
        "presentationState",
        "presentation state is not canonical",
      ),
    );
  }
  if (
    (projection.status === "projected" ||
      projection.status === "partially-projected") &&
    projection.activity === "inactive"
  ) {
    diagnostics.push(
      diagnostic(
        "invalid-projection-state",
        "activity",
        "active projection cannot have inactive activity",
      ),
    );
  }
  if (
    projection.status === "partially-projected" &&
    projection.contextAvailability === "unavailable"
  ) {
    diagnostics.push(
      diagnostic(
        "partial-projection",
        "contextAvailability",
        "partial projection reports unavailable context",
      ),
    );
  }
  if (
    projection.status === "projected" &&
    projection.subject === null &&
    projection.surface === "stage" &&
    projection.attentionState === "none" &&
    projection.guidanceAvailability !== "available"
  ) {
    diagnostics.push(
      diagnostic(
        "missing-projection-context",
        "subject",
        "projected stage lacks subject and attention context",
      ),
    );
  }

  return Object.freeze([...diagnostics]);
}

// ─── Projection APIs ────────────────────────────────────────────────────────

/**
 * Project a single surface binding independently.
 * Does not inspect other surfaces.
 */
export function resolveDirectorRuntimeExperienceStateProjection(
  surfaceBinding: DirectorRuntimeExperienceSurfaceBinding,
): DirectorRuntimeExperienceStateProjection {
  return projectSingleBinding(surfaceBinding);
}

/**
 * Resolve one surface from an aggregate DRI-8:3 result using the same rules.
 */
export function resolveDirectorRuntimeExperienceStateProjectionFromResult(
  surfaceBindings: DirectorRuntimeExperienceSurfaceBindingResult,
  surface: DirectorRuntimeExperienceSurface,
): DirectorRuntimeExperienceStateProjection | null {
  if (!isDirectorRuntimeExperienceSurface(surface)) return null;
  if (
    !isStructurallyValidBindingResult(surfaceBindings) ||
    surfaceBindings.status === "invalid"
  ) {
    return null;
  }
  const binding = surfaceBindings.bindings.find(
    (entry) => entry.surface === surface,
  );
  if (binding === undefined) return null;
  return projectSingleBinding(binding);
}

export function projectDirectorRuntimeExperienceState(
  surfaceBindings: DirectorRuntimeExperienceSurfaceBindingResult,
): DirectorRuntimeExperienceStateProjectionResult {
  const diagnostics: DirectorRuntimeExperienceProjectionDiagnostic[] = [];

  if (
    !isStructurallyValidBindingResult(surfaceBindings) ||
    surfaceBindings.status === "invalid"
  ) {
    diagnostics.push(
      diagnostic(
        "invalid-binding",
        "surfaceBindings",
        "surface binding result is invalid",
      ),
    );
    return Object.freeze({
      projections: Object.freeze([]),
      status: "invalid" as const,
      activeProjections: Object.freeze([]),
      inactiveProjections: Object.freeze([
        ...DIRECTOR_RUNTIME_EXPERIENCE_SURFACES,
      ]),
      diagnostics: Object.freeze([...diagnostics]),
      provenance: Object.freeze({
        sourceBindingIdentity: "invalid",
        surfaceBindingIdentity:
          directorRuntimeExperienceSurfaceBindingIdentity,
        stateProjectionIdentity:
          directorRuntimeExperienceStateProjectionIdentity,
        surfaceIdentifier: "aggregate" as const,
      }),
    });
  }

  // Canonical surface order — never object-iteration order.
  const orderedBindings: DirectorRuntimeExperienceSurfaceBinding[] = [];
  for (const surface of DIRECTOR_RUNTIME_EXPERIENCE_SURFACES) {
    const binding = surfaceBindings.bindings.find(
      (entry) => entry.surface === surface,
    );
    if (binding === undefined) {
      diagnostics.push(
        diagnostic(
          "missing-projection-context",
          `bindings.${surface}`,
          `missing binding for surface ${surface}`,
        ),
      );
      continue;
    }
    if (!isDirectorRuntimeExperienceSurface(binding.surface)) {
      diagnostics.push(
        diagnostic(
          "unsupported-surface",
          `bindings.${surface}`,
          "binding surface identifier is unsupported",
        ),
      );
      continue;
    }
    const bindingDiagnostics = validateDirectorRuntimeExperienceSurfaceBinding(
      binding,
    );
    for (const entry of bindingDiagnostics) {
      if (
        entry.kind === "unknown-surface" ||
        entry.kind === "invalid-surface-binding"
      ) {
        diagnostics.push(
          diagnostic("invalid-binding", entry.path, entry.message),
        );
      }
    }
    orderedBindings.push(binding);
  }

  const projections = Object.freeze(
    orderedBindings.map((binding) => projectSingleBinding(binding)),
  );

  for (const projection of projections) {
    const projectionDiagnostics =
      validateDirectorRuntimeExperienceStateProjection(projection);
    for (const entry of projectionDiagnostics) {
      diagnostics.push(entry);
    }
    if (projection.status === "partially-projected") {
      diagnostics.push(
        diagnostic(
          "partial-projection",
          `${projection.surface}.status`,
          `${projection.surface} is partially projected`,
        ),
      );
    }
  }

  const activeProjections = Object.freeze(
    projections
      .filter((entry) =>
        entry.status === "projected" || entry.status === "partially-projected")
      .map((entry) => entry.surface),
  );
  const inactiveProjections = Object.freeze(
    projections
      .filter((entry) =>
        entry.status === "inactive" ||
        entry.status === "unavailable" ||
        entry.status === "invalid")
      .map((entry) => entry.surface),
  );

  return Object.freeze({
    projections,
    status: aggregateProjectionStatus(projections, false),
    activeProjections,
    inactiveProjections,
    diagnostics: Object.freeze([...diagnostics]),
    provenance: Object.freeze({
      sourceBindingIdentity:
        surfaceBindings.provenance.sourceContextIdentity,
      surfaceBindingIdentity:
        surfaceBindings.provenance.surfaceBindingIdentity,
      stateProjectionIdentity:
        directorRuntimeExperienceStateProjectionIdentity,
      surfaceIdentifier: "aggregate" as const,
    }),
  });
}

export function projectDirectorRuntimeExperienceStateFromInput(
  input: DirectorRuntimeExperienceStateProjectionInput,
): DirectorRuntimeExperienceStateProjectionResult {
  return projectDirectorRuntimeExperienceState(input.surfaceBindings);
}

// ─── Registry ───────────────────────────────────────────────────────────────

export const directorRuntimeExperienceStateProjectionApiNames = Object.freeze([
  "getDirectorRuntimeExperienceStateProjectionIdentity",
  "listDirectorRuntimeExperienceProjectionStatuses",
  "listDirectorRuntimeExperienceActivityStates",
  "listDirectorRuntimeExperienceVisibilityStates",
  "listDirectorRuntimeExperienceDominanceStates",
  "listDirectorRuntimeExperiencePresentationStates",
  "listDirectorRuntimeExperienceEmphasisStates",
  "listDirectorRuntimeExperienceInteractionReadinessStates",
  "isDirectorRuntimeExperienceProjectionStatus",
  "isDirectorRuntimeExperienceActivityState",
  "isDirectorRuntimeExperienceVisibilityState",
  "isDirectorRuntimeExperienceDominanceState",
  "isDirectorRuntimeExperiencePresentationState",
  "isDirectorRuntimeExperienceEmphasisState",
  "isDirectorRuntimeExperienceInteractionReadiness",
  "projectDirectorRuntimeExperienceState",
  "projectDirectorRuntimeExperienceStateFromInput",
  "resolveDirectorRuntimeExperienceStateProjection",
  "resolveDirectorRuntimeExperienceStateProjectionFromResult",
  "validateDirectorRuntimeExperienceStateProjection",
  "verifyDirectorRuntimeExperienceStateProjection",
] as const);

export const DIRECTOR_RUNTIME_EXPERIENCE_STATE_PROJECTION_REGISTRY_SECTIONS =
  Object.freeze([
    "identity",
    "dependency",
    "projection-statuses",
    "activity-states",
    "visibility-states",
    "dominance-states",
    "presentation-states",
    "emphasis-states",
    "interaction-readiness",
    "projection-reasons",
    "diagnostics",
    "surface-projection-capabilities",
    "guarantees",
  ] as const);

function countSurfaceProjectionCapabilities(): number {
  return DIRECTOR_RUNTIME_EXPERIENCE_SURFACES.reduce(
    (total, surface) =>
      total +
      DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_PROJECTION_CAPABILITIES[surface]
        .length,
    0,
  );
}

export const directorRuntimeExperienceStateProjectionRegistry = Object.freeze({
  identity: directorRuntimeExperienceStateProjectionIdentity,
  version: directorRuntimeExperienceStateProjectionVersion,
  namespace: directorRuntimeExperienceStateProjectionNamespace,
  dependency: directorRuntimeExperienceStateProjectionUpstream,
  projectionStatuses: DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_STATUSES,
  projectionStatusCount: DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_STATUSES.length,
  activityStates: DIRECTOR_RUNTIME_EXPERIENCE_ACTIVITY_STATES,
  activityStateCount: DIRECTOR_RUNTIME_EXPERIENCE_ACTIVITY_STATES.length,
  visibilityStates: DIRECTOR_RUNTIME_EXPERIENCE_VISIBILITY_STATES,
  visibilityStateCount: DIRECTOR_RUNTIME_EXPERIENCE_VISIBILITY_STATES.length,
  dominanceStates: DIRECTOR_RUNTIME_EXPERIENCE_DOMINANCE_STATES,
  dominanceStateCount: DIRECTOR_RUNTIME_EXPERIENCE_DOMINANCE_STATES.length,
  presentationStates: DIRECTOR_RUNTIME_EXPERIENCE_PRESENTATION_STATES,
  presentationStateCount:
    DIRECTOR_RUNTIME_EXPERIENCE_PRESENTATION_STATES.length,
  emphasisStates: DIRECTOR_RUNTIME_EXPERIENCE_EMPHASIS_STATES,
  emphasisStateCount: DIRECTOR_RUNTIME_EXPERIENCE_EMPHASIS_STATES.length,
  attentionStates: DIRECTOR_RUNTIME_EXPERIENCE_ATTENTION_STATES,
  attentionStateCount: DIRECTOR_RUNTIME_EXPERIENCE_ATTENTION_STATES.length,
  interactionReadinessStates:
    DIRECTOR_RUNTIME_EXPERIENCE_INTERACTION_READINESS_STATES,
  interactionReadinessStateCount:
    DIRECTOR_RUNTIME_EXPERIENCE_INTERACTION_READINESS_STATES.length,
  projectionReasons: DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_REASONS,
  projectionReasonCount: DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_REASONS.length,
  diagnosticKinds: DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_DIAGNOSTIC_KINDS,
  diagnosticKindCount:
    DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_DIAGNOSTIC_KINDS.length,
  projectionRules: DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_RULES,
  projectionRuleCount: DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_RULES.length,
  surfaceProjectionCapabilities:
    DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_PROJECTION_CAPABILITIES,
  surfaceProjectionCapabilityCount: countSurfaceProjectionCapabilities(),
  provenanceFields:
    DIRECTOR_RUNTIME_EXPERIENCE_STATE_PROJECTION_PROVENANCE_FIELDS,
  provenanceFieldCount:
    DIRECTOR_RUNTIME_EXPERIENCE_STATE_PROJECTION_PROVENANCE_FIELDS.length,
  guarantees: DIRECTOR_RUNTIME_EXPERIENCE_STATE_PROJECTION_GUARANTEES,
  guaranteeCount: DIRECTOR_RUNTIME_EXPERIENCE_STATE_PROJECTION_GUARANTEES.length,
  registrySections:
    DIRECTOR_RUNTIME_EXPERIENCE_STATE_PROJECTION_REGISTRY_SECTIONS,
  registrySectionCount:
    DIRECTOR_RUNTIME_EXPERIENCE_STATE_PROJECTION_REGISTRY_SECTIONS.length,
  publicApis: directorRuntimeExperienceStateProjectionApiNames,
  publicApiCount: directorRuntimeExperienceStateProjectionApiNames.length,
  surfaces: DIRECTOR_RUNTIME_EXPERIENCE_SURFACES,
  surfaceCount: DIRECTOR_RUNTIME_EXPERIENCE_SURFACES.length,
});

export const directorRuntimeExperienceStateProjection = Object.freeze({
  phase: "DRI-8:4" as const,
  name: "DirectorRuntimeExperienceStateProjection" as const,
  identity: directorRuntimeExperienceStateProjectionIdentity,
  namespace: directorRuntimeExperienceStateProjectionNamespace,
  version: directorRuntimeExperienceStateProjectionVersion,
  layer: "DirectorRuntimeConsumerIntegration" as const,
  role: "ExperienceStateProjection" as const,
  stage: "ExperienceStateProjection" as const,
  status: "ExperienceStateProjectionReady" as const,
  upstreamDependency: directorRuntimeExperienceStateProjectionUpstream,
  deterministic: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  philosophy: "what-semantic-state-should-be-presented" as const,
  projectionStatuses: DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_STATUSES,
  activityStates: DIRECTOR_RUNTIME_EXPERIENCE_ACTIVITY_STATES,
  visibilityStates: DIRECTOR_RUNTIME_EXPERIENCE_VISIBILITY_STATES,
  dominanceStates: DIRECTOR_RUNTIME_EXPERIENCE_DOMINANCE_STATES,
  presentationStates: DIRECTOR_RUNTIME_EXPERIENCE_PRESENTATION_STATES,
  emphasisStates: DIRECTOR_RUNTIME_EXPERIENCE_EMPHASIS_STATES,
  interactionReadinessStates:
    DIRECTOR_RUNTIME_EXPERIENCE_INTERACTION_READINESS_STATES,
  projectionReasons: DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_REASONS,
  diagnosticKinds: DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_DIAGNOSTIC_KINDS,
  projectionRules: DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_RULES,
  guarantees: DIRECTOR_RUNTIME_EXPERIENCE_STATE_PROJECTION_GUARANTEES,
  publicApiSurface: directorRuntimeExperienceStateProjectionApiNames,
  registry: directorRuntimeExperienceStateProjectionRegistry,
  surfaceBindingBoundary: "DRI-8:3-surface-binding-only" as const,
  architecturalStatus:
    "Experience State Projection Complete · Deterministic · Immutable · Framework-Independent · ReadyForConsumerInteractionBridge" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface DirectorRuntimeExperienceStateProjectionVerification {
  readonly ok: boolean;
  readonly identity: typeof directorRuntimeExperienceStateProjectionIdentity;
  readonly version: typeof directorRuntimeExperienceStateProjectionVersion;
  readonly namespace: typeof directorRuntimeExperienceStateProjectionNamespace;
  readonly dependency: typeof directorRuntimeExperienceStateProjectionUpstream;
  readonly projectionStatusCount: number;
  readonly activityStateCount: number;
  readonly visibilityStateCount: number;
  readonly dominanceStateCount: number;
  readonly presentationStateCount: number;
  readonly emphasisStateCount: number;
  readonly interactionReadinessStateCount: number;
  readonly projectionReasonCount: number;
  readonly diagnosticKindCount: number;
  readonly surfaceProjectionCapabilityCount: number;
  readonly registrySectionCount: number;
  readonly publicApiCount: number;
  readonly frozen: boolean;
  readonly dri83BoundaryIntact: boolean;
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

export function verifyDirectorRuntimeExperienceStateProjection():
  DirectorRuntimeExperienceStateProjectionVerification {
  const projection = directorRuntimeExperienceStateProjection;
  const registry = directorRuntimeExperienceStateProjectionRegistry;

  const identityOk =
    projection.identity ===
      "DRI-8:4/DirectorRuntimeExperienceStateProjection" &&
    projection.version === "8.4.0" &&
    projection.namespace ===
      "nexora.dri.consumer-integration.experience-state-projection" &&
    projection.layer === "DirectorRuntimeConsumerIntegration" &&
    projection.role === "ExperienceStateProjection" &&
    projection.upstreamDependency ===
      "DRI-8:3/DirectorRuntimeExperienceSurfaceBinding" &&
    projection.upstreamDependency ===
      directorRuntimeExperienceSurfaceBindingIdentity &&
    registry.dependency === projection.upstreamDependency &&
    projection.surfaceBindingBoundary === "DRI-8:3-surface-binding-only";

  const vocabularyOk =
    exactOrder(DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_STATUSES, [
      "projected",
      "partially-projected",
      "inactive",
      "unavailable",
      "invalid",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_EXPERIENCE_ACTIVITY_STATES, [
      "active",
      "supporting",
      "background",
      "inactive",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_EXPERIENCE_VISIBILITY_STATES, [
      "visible",
      "hidden",
      "collapsed",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_EXPERIENCE_DOMINANCE_STATES, [
      "primary",
      "secondary",
      "background",
      "none",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_EXPERIENCE_PRESENTATION_STATES, [
      "minimum",
      "report",
      "operation",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_EXPERIENCE_EMPHASIS_STATES, [
      "none",
      "normal",
      "highlighted",
      "warning",
      "critical",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_EXPERIENCE_INTERACTION_READINESS_STATES, [
      "enabled",
      "limited",
      "disabled",
    ]) &&
    unique([...DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_STATUSES]) &&
    unique([...DIRECTOR_RUNTIME_EXPERIENCE_ACTIVITY_STATES]) &&
    unique([...DIRECTOR_RUNTIME_EXPERIENCE_VISIBILITY_STATES]) &&
    unique([...DIRECTOR_RUNTIME_EXPERIENCE_DOMINANCE_STATES]) &&
    unique([...DIRECTOR_RUNTIME_EXPERIENCE_PRESENTATION_STATES]) &&
    unique([...DIRECTOR_RUNTIME_EXPERIENCE_EMPHASIS_STATES]) &&
    unique([...DIRECTOR_RUNTIME_EXPERIENCE_INTERACTION_READINESS_STATES]) &&
    unique([...DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_REASONS]) &&
    unique([...DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_DIAGNOSTIC_KINDS]) &&
    unique([...DIRECTOR_RUNTIME_EXPERIENCE_STATE_PROJECTION_GUARANTEES]);

  const registryOk =
    registry.projectionStatusCount ===
      DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_STATUSES.length &&
    registry.activityStateCount ===
      DIRECTOR_RUNTIME_EXPERIENCE_ACTIVITY_STATES.length &&
    registry.visibilityStateCount ===
      DIRECTOR_RUNTIME_EXPERIENCE_VISIBILITY_STATES.length &&
    registry.dominanceStateCount ===
      DIRECTOR_RUNTIME_EXPERIENCE_DOMINANCE_STATES.length &&
    registry.presentationStateCount ===
      DIRECTOR_RUNTIME_EXPERIENCE_PRESENTATION_STATES.length &&
    registry.emphasisStateCount ===
      DIRECTOR_RUNTIME_EXPERIENCE_EMPHASIS_STATES.length &&
    registry.interactionReadinessStateCount ===
      DIRECTOR_RUNTIME_EXPERIENCE_INTERACTION_READINESS_STATES.length &&
    registry.projectionReasonCount ===
      DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_REASONS.length &&
    registry.diagnosticKindCount ===
      DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_DIAGNOSTIC_KINDS.length &&
    registry.surfaceProjectionCapabilityCount ===
      countSurfaceProjectionCapabilities() &&
    registry.registrySectionCount ===
      DIRECTOR_RUNTIME_EXPERIENCE_STATE_PROJECTION_REGISTRY_SECTIONS.length &&
    registry.publicApiCount ===
      directorRuntimeExperienceStateProjectionApiNames.length;

  const frozen =
    Object.isFrozen(projection) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(directorRuntimeExperienceStateProjectionCanonicalIdentity) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_STATUSES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXPERIENCE_ACTIVITY_STATES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXPERIENCE_VISIBILITY_STATES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXPERIENCE_DOMINANCE_STATES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXPERIENCE_PRESENTATION_STATES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXPERIENCE_EMPHASIS_STATES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXPERIENCE_INTERACTION_READINESS_STATES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_REASONS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_DIAGNOSTIC_KINDS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_RULES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXPERIENCE_STATE_PROJECTION_GUARANTEES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_PROJECTION_CAPABILITIES);

  const dri83BoundaryIntact =
    projection.upstreamDependency ===
      "DRI-8:3/DirectorRuntimeExperienceSurfaceBinding" &&
    projection.surfaceBindingBoundary === "DRI-8:3-surface-binding-only";

  const frameworkIndependent =
    projection.frameworkIndependent === true &&
    projection.rendererIndependent === true;

  const ok =
    identityOk &&
    vocabularyOk &&
    registryOk &&
    frozen &&
    dri83BoundaryIntact &&
    frameworkIndependent;

  return Object.freeze({
    ok,
    identity: directorRuntimeExperienceStateProjectionIdentity,
    version: directorRuntimeExperienceStateProjectionVersion,
    namespace: directorRuntimeExperienceStateProjectionNamespace,
    dependency: directorRuntimeExperienceStateProjectionUpstream,
    projectionStatusCount:
      DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_STATUSES.length,
    activityStateCount: DIRECTOR_RUNTIME_EXPERIENCE_ACTIVITY_STATES.length,
    visibilityStateCount: DIRECTOR_RUNTIME_EXPERIENCE_VISIBILITY_STATES.length,
    dominanceStateCount: DIRECTOR_RUNTIME_EXPERIENCE_DOMINANCE_STATES.length,
    presentationStateCount:
      DIRECTOR_RUNTIME_EXPERIENCE_PRESENTATION_STATES.length,
    emphasisStateCount: DIRECTOR_RUNTIME_EXPERIENCE_EMPHASIS_STATES.length,
    interactionReadinessStateCount:
      DIRECTOR_RUNTIME_EXPERIENCE_INTERACTION_READINESS_STATES.length,
    projectionReasonCount: DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_REASONS.length,
    diagnosticKindCount:
      DIRECTOR_RUNTIME_EXPERIENCE_PROJECTION_DIAGNOSTIC_KINDS.length,
    surfaceProjectionCapabilityCount: countSurfaceProjectionCapabilities(),
    registrySectionCount:
      DIRECTOR_RUNTIME_EXPERIENCE_STATE_PROJECTION_REGISTRY_SECTIONS.length,
    publicApiCount: directorRuntimeExperienceStateProjectionApiNames.length,
    frozen,
    dri83BoundaryIntact,
    frameworkIndependent,
  });
}
