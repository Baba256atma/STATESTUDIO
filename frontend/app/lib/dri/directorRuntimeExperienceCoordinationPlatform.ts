/**
 * DRI-8:6 — Director Runtime Experience Coordination Platform.
 *
 * Coordinates semantic Experience state across approved Executive Experience
 * surfaces around Director Runtime state and interaction outcomes.
 *
 * Principle: surfaces stay aligned through DRI-8:6 semantic plans — never by
 * importing or mutating each other's UI implementations.
 *
 * DRI-8:5 = what Runtime intent a consumer interaction represents.
 * DRI-8:6 = which surfaces participate, in what role, for that change.
 */

import {
  DIRECTOR_RUNTIME_EXPERIENCE_SURFACES,
  directorRuntimeConsumerInteractionBridgeIdentity,
  isDirectorRuntimeConsumerInteractionBridgeStatus,
  isDirectorRuntimeExperienceSurface,
  type DirectorRuntimeConsumerInteractionBridgeResult,
  type DirectorRuntimeConsumerInteractionIntent,
  type DirectorRuntimeConsumerInteractionSubject,
  type DirectorRuntimeConsumerRuntimeIntentKind,
  type DirectorRuntimeExperienceSurface,
} from "@/app/lib/dri/directorRuntimeConsumerInteractionBridge";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeExperienceCoordinationPlatformIdentity =
  "DRI-8:6/DirectorRuntimeExperienceCoordinationPlatform" as const;
export const directorRuntimeExperienceCoordinationPlatformVersion =
  "8.6.0" as const;
export const directorRuntimeExperienceCoordinationPlatformNamespace =
  "nexora.dri.consumer-integration.experience-coordination-platform" as const;
export const directorRuntimeExperienceCoordinationPlatformUpstream =
  directorRuntimeConsumerInteractionBridgeIdentity;

export const directorRuntimeExperienceCoordinationPlatformCanonicalIdentity =
  Object.freeze({
    identity: directorRuntimeExperienceCoordinationPlatformIdentity,
    version: directorRuntimeExperienceCoordinationPlatformVersion,
    namespace: directorRuntimeExperienceCoordinationPlatformNamespace,
    upstream: directorRuntimeExperienceCoordinationPlatformUpstream,
  });

export { DIRECTOR_RUNTIME_EXPERIENCE_SURFACES };
export type { DirectorRuntimeExperienceSurface };

// ─── Statuses ───────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_STATUSES = Object.freeze([
  "coordinated",
  "partially-coordinated",
  "no-op",
  "blocked",
  "invalid",
] as const);
export type DirectorRuntimeExperienceCoordinationStatus =
  (typeof DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_STATUSES)[number];

// ─── Scopes ─────────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_SCOPES = Object.freeze([
  "surface",
  "subject",
  "workspace",
  "experience",
] as const);
export type DirectorRuntimeExperienceCoordinationScope =
  (typeof DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_SCOPES)[number];

// ─── Surface roles ──────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_ROLES = Object.freeze([
  "primary",
  "supporting",
  "background",
  "preserved",
  "inactive",
] as const);
export type DirectorRuntimeExperienceSurfaceRole =
  (typeof DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_ROLES)[number];

// ─── Trigger kinds ──────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_TRIGGER_KINDS =
  Object.freeze([
    "state-change",
    "selection-change",
    "focus-change",
    "activation",
    "navigation",
    "inspection",
    "dismissal",
    "attention-change",
    "guidance-change",
  ] as const);
export type DirectorRuntimeExperienceCoordinationTriggerKind =
  (typeof DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_TRIGGER_KINDS)[number];

// ─── Change kinds ───────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_CHANGE_KINDS =
  Object.freeze([
    "update",
    "preserve",
    "deactivate",
    "reactivate",
    "none",
  ] as const);
export type DirectorRuntimeExperienceCoordinationChangeKind =
  (typeof DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_CHANGE_KINDS)[number];

// ─── Priorities ─────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_PRIORITIES = Object.freeze([
  "critical",
  "high",
  "normal",
  "low",
] as const);
export type DirectorRuntimeExperienceCoordinationPriority =
  (typeof DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_PRIORITIES)[number];

// ─── Reasons ────────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_REASONS = Object.freeze([
  "shared-active-subject",
  "shared-focus-subject",
  "shared-attention-context",
  "shared-guidance-context",
  "source-surface-primary",
  "navigation-context-change",
  "temporal-context-change",
  "related-subject-context",
  "surface-not-relevant",
  "surface-preserved",
  "local-source-only",
  "selection-context-change",
  "focus-context-change",
  "activation-context-change",
  "inspection-context-change",
  "attention-context-change",
  "guidance-context-change",
  "state-context-change",
] as const);
export type DirectorRuntimeExperienceCoordinationReason =
  (typeof DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_REASONS)[number];

// ─── Diagnostics ────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_DIAGNOSTIC_KINDS =
  Object.freeze([
    "invalid-coordination-input",
    "unknown-trigger",
    "unknown-surface",
    "missing-source-surface",
    "missing-subject",
    "invalid-surface-role",
    "unsupported-coordination-scope",
    "required-surface-unavailable",
    "partial-coordination",
    "invalid-coordination-plan",
    "blocked-bridge-result",
    "invalid-bridge-result",
  ] as const);
export type DirectorRuntimeExperienceCoordinationDiagnosticKind =
  (typeof DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_DIAGNOSTIC_KINDS)[number];

export interface DirectorRuntimeExperienceCoordinationDiagnostic {
  readonly kind: DirectorRuntimeExperienceCoordinationDiagnosticKind;
  readonly path: string;
  readonly message: string;
}

// ─── Guarantees ─────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_GUARANTEES = Object.freeze([
  "semantic-only",
  "multi-surface",
  "framework-independent",
  "surface-decoupled",
  "context-preserving",
  "selection-focus-distinct",
  "minimal-fan-out",
  "preserve-unaffected-surfaces",
  "immutable",
  "deterministic",
  "non-mutating",
  "identity-preserving",
  "provenance-preserving",
  "no-business-inference",
  "no-rendering",
  "no-ui-side-effects",
  "no-runtime-interaction-reimplementation",
] as const);
export type DirectorRuntimeExperienceCoordinationGuarantee =
  (typeof DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_GUARANTEES)[number];

// ─── Provenance ─────────────────────────────────────────────────────────────

export interface DirectorRuntimeExperienceCoordinationProvenance {
  readonly sourceInteractionBridgeIdentity: string;
  readonly sourceExperienceProjectionIdentity: string;
  readonly coordinationPlatformIdentity: string;
  readonly sourceSurface: DirectorRuntimeExperienceSurface | "none";
  readonly triggerKind: DirectorRuntimeExperienceCoordinationTriggerKind | "none";
}

export const DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_PROVENANCE_FIELDS =
  Object.freeze([
    "sourceInteractionBridgeIdentity",
    "sourceExperienceProjectionIdentity",
    "coordinationPlatformIdentity",
    "sourceSurface",
    "triggerKind",
  ] as const);

// ─── Projection view (structural; arrives through DRI-8:5 chain) ────────────

/**
 * Minimal structural surface projection view used for coordination.
 * Compatible with DRI-8:4 projected surfaces without importing DRI-8:4.
 */
export interface DirectorRuntimeExperienceCoordinationProjectionView {
  readonly surface: DirectorRuntimeExperienceSurface;
  readonly status: string;
  readonly subject: DirectorRuntimeConsumerInteractionSubject | null;
  readonly selectedSubject?: DirectorRuntimeConsumerInteractionSubject | null;
  readonly focusedSubject?: DirectorRuntimeConsumerInteractionSubject | null;
  readonly guidanceAvailability?: string;
  readonly attentionState?: string;
  readonly temporalMode?: string;
  readonly contextAvailability?: string;
}

export interface DirectorRuntimeExperienceCoordinationExperienceState {
  readonly projections: ReadonlyArray<
    DirectorRuntimeExperienceCoordinationProjectionView
  >;
  readonly status: string;
}

export interface DirectorRuntimeExperienceCoordinationContext {
  readonly selectedSubject?: DirectorRuntimeConsumerInteractionSubject | null;
  readonly focusedSubject?: DirectorRuntimeConsumerInteractionSubject | null;
  readonly attentionSubject?: DirectorRuntimeConsumerInteractionSubject | null;
  readonly guidancePresent?: boolean;
  readonly triggerOverride?: DirectorRuntimeExperienceCoordinationTriggerKind;
  readonly sourceSurfaceOverride?: DirectorRuntimeExperienceSurface;
}

export interface DirectorRuntimeExperienceCoordinationInput {
  readonly experienceStateProjection: DirectorRuntimeExperienceCoordinationExperienceState;
  readonly interactionBridgeResult?:
    | DirectorRuntimeConsumerInteractionBridgeResult
    | null;
  readonly coordinationContext?:
    | DirectorRuntimeExperienceCoordinationContext
    | null;
}

// ─── Plan / outcomes ────────────────────────────────────────────────────────

export interface DirectorRuntimeExperienceSurfaceCoordinationOutcome {
  readonly surface: DirectorRuntimeExperienceSurface;
  readonly role: DirectorRuntimeExperienceSurfaceRole;
  readonly status: "ready" | "partial" | "unavailable" | "inactive" | "invalid";
  readonly subject: DirectorRuntimeConsumerInteractionSubject | null;
  readonly selectedSubject: DirectorRuntimeConsumerInteractionSubject | null;
  readonly focusedSubject: DirectorRuntimeConsumerInteractionSubject | null;
  readonly stateReference: string;
  readonly reason: DirectorRuntimeExperienceCoordinationReason;
  readonly changeKind: DirectorRuntimeExperienceCoordinationChangeKind;
}

export interface DirectorRuntimeExperienceCoordinationPlan {
  readonly trigger: DirectorRuntimeExperienceCoordinationTriggerKind;
  readonly scope: DirectorRuntimeExperienceCoordinationScope;
  readonly priority: DirectorRuntimeExperienceCoordinationPriority;
  readonly primarySurface: DirectorRuntimeExperienceSurface | null;
  readonly surfaceRoles: Readonly<
    Record<DirectorRuntimeExperienceSurface, DirectorRuntimeExperienceSurfaceRole>
  >;
  readonly affectedSurfaces: ReadonlyArray<DirectorRuntimeExperienceSurface>;
  readonly preservedSurfaces: ReadonlyArray<DirectorRuntimeExperienceSurface>;
  readonly supportingSurfaces: ReadonlyArray<DirectorRuntimeExperienceSurface>;
  readonly backgroundSurfaces: ReadonlyArray<DirectorRuntimeExperienceSurface>;
  readonly inactiveSurfaces: ReadonlyArray<DirectorRuntimeExperienceSurface>;
  readonly subject: DirectorRuntimeConsumerInteractionSubject | null;
  readonly selectedSubject: DirectorRuntimeConsumerInteractionSubject | null;
  readonly focusedSubject: DirectorRuntimeConsumerInteractionSubject | null;
  readonly reason: DirectorRuntimeExperienceCoordinationReason;
  readonly outcomes: ReadonlyArray<
    DirectorRuntimeExperienceSurfaceCoordinationOutcome
  >;
}

export interface DirectorRuntimeExperienceCoordinationResult {
  readonly status: DirectorRuntimeExperienceCoordinationStatus;
  readonly coordinationPlan: DirectorRuntimeExperienceCoordinationPlan | null;
  readonly surfaceOutcomes: ReadonlyArray<
    DirectorRuntimeExperienceSurfaceCoordinationOutcome
  >;
  readonly primarySurface: DirectorRuntimeExperienceSurface | null;
  readonly supportingSurfaces: ReadonlyArray<DirectorRuntimeExperienceSurface>;
  readonly backgroundSurfaces: ReadonlyArray<DirectorRuntimeExperienceSurface>;
  readonly affectedSurfaces: ReadonlyArray<DirectorRuntimeExperienceSurface>;
  readonly preservedSurfaces: ReadonlyArray<DirectorRuntimeExperienceSurface>;
  readonly diagnostics: ReadonlyArray<
    DirectorRuntimeExperienceCoordinationDiagnostic
  >;
  readonly provenance: DirectorRuntimeExperienceCoordinationProvenance;
}

// ─── Surface relationships ──────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_RELATIONSHIPS = Object.freeze([
  Object.freeze({
    id: "stage-subject-cluster",
    surfaces: Object.freeze([
      "stage",
      "advisor",
      "insight",
      "live-lens",
      "explorer",
    ] as const),
    relation: "shared-subject-context" as const,
  }),
  Object.freeze({
    id: "timeline-temporal-cluster",
    surfaces: Object.freeze([
      "timeline",
      "stage",
      "advisor",
      "insight",
    ] as const),
    relation: "shared-temporal-context" as const,
  }),
  Object.freeze({
    id: "live-lens-navigation-cluster",
    surfaces: Object.freeze([
      "live-lens",
      "stage",
      "advisor",
      "explorer",
    ] as const),
    relation: "shared-navigation-context" as const,
  }),
  Object.freeze({
    id: "guidance-cluster",
    surfaces: Object.freeze([
      "advisor",
      "stage",
      "insight",
    ] as const),
    relation: "shared-guidance-context" as const,
  }),
  Object.freeze({
    id: "attention-cluster",
    surfaces: Object.freeze([
      "stage",
      "advisor",
      "insight",
    ] as const),
    relation: "shared-attention-context" as const,
  }),
  Object.freeze({
    id: "focus-insight-cluster",
    surfaces: Object.freeze([
      "insight",
      "advisor",
      "stage",
    ] as const),
    relation: "shared-focus-context" as const,
  }),
] as const);

// ─── Coordination rules ─────────────────────────────────────────────────────

export interface DirectorRuntimeExperienceCoordinationRule {
  readonly id: string;
  readonly trigger: DirectorRuntimeExperienceCoordinationTriggerKind;
  readonly sourceSurface: DirectorRuntimeExperienceSurface | "*";
  readonly scope: DirectorRuntimeExperienceCoordinationScope;
  readonly primarySurface: DirectorRuntimeExperienceSurface | "source";
  readonly supportingSurfaces: ReadonlyArray<DirectorRuntimeExperienceSurface>;
  readonly backgroundSurfaces: ReadonlyArray<DirectorRuntimeExperienceSurface>;
  readonly preservedSurfaces: ReadonlyArray<DirectorRuntimeExperienceSurface>;
  readonly priority: DirectorRuntimeExperienceCoordinationPriority;
  readonly reason: DirectorRuntimeExperienceCoordinationReason;
  readonly statement: string;
}

export const DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_RULES = Object.freeze([
  Object.freeze({
    id: "stage-selection-change",
    trigger: "selection-change" as const,
    sourceSurface: "stage" as const,
    scope: "subject" as const,
    primarySurface: "source" as const,
    supportingSurfaces: Object.freeze([
      "advisor",
      "insight",
      "live-lens",
      "explorer",
    ] as const),
    backgroundSurfaces: Object.freeze([] as const),
    preservedSurfaces: Object.freeze(["timeline"] as const),
    priority: "high" as const,
    reason: "selection-context-change" as const,
    statement:
      "stage selection elevates stage as primary and related subject surfaces as supporting",
  }),
  Object.freeze({
    id: "generic-selection-change",
    trigger: "selection-change" as const,
    sourceSurface: "*" as const,
    scope: "subject" as const,
    primarySurface: "source" as const,
    supportingSurfaces: Object.freeze([
      "stage",
      "advisor",
      "insight",
      "live-lens",
      "explorer",
    ] as const),
    backgroundSurfaces: Object.freeze([] as const),
    preservedSurfaces: Object.freeze(["timeline"] as const),
    priority: "high" as const,
    reason: "selection-context-change" as const,
    statement:
      "selection change makes source primary and subject-related surfaces supporting",
  }),
  Object.freeze({
    id: "focus-change",
    trigger: "focus-change" as const,
    sourceSurface: "*" as const,
    scope: "subject" as const,
    primarySurface: "insight" as const,
    supportingSurfaces: Object.freeze([
      "stage",
      "advisor",
    ] as const),
    backgroundSurfaces: Object.freeze([] as const),
    preservedSurfaces: Object.freeze([
      "live-lens",
      "timeline",
      "explorer",
    ] as const),
    priority: "high" as const,
    reason: "focus-context-change" as const,
    statement:
      "focus change coordinates insight/advisor without replacing selection identity",
  }),
  Object.freeze({
    id: "attention-change",
    trigger: "attention-change" as const,
    sourceSurface: "*" as const,
    scope: "subject" as const,
    primarySurface: "stage" as const,
    supportingSurfaces: Object.freeze([
      "advisor",
      "insight",
    ] as const),
    backgroundSurfaces: Object.freeze([] as const),
    preservedSurfaces: Object.freeze([
      "live-lens",
      "timeline",
      "explorer",
    ] as const),
    priority: "critical" as const,
    reason: "attention-context-change" as const,
    statement:
      "attention change coordinates stage/advisor/insight only",
  }),
  Object.freeze({
    id: "guidance-change",
    trigger: "guidance-change" as const,
    sourceSurface: "*" as const,
    scope: "workspace" as const,
    primarySurface: "advisor" as const,
    supportingSurfaces: Object.freeze([
      "stage",
      "insight",
    ] as const),
    backgroundSurfaces: Object.freeze([] as const),
    preservedSurfaces: Object.freeze([
      "live-lens",
      "timeline",
      "explorer",
    ] as const),
    priority: "high" as const,
    reason: "guidance-context-change" as const,
    statement:
      "guidance coordinates advisor as primary with stage/insight support",
  }),
  Object.freeze({
    id: "live-lens-navigation",
    trigger: "navigation" as const,
    sourceSurface: "live-lens" as const,
    scope: "subject" as const,
    primarySurface: "source" as const,
    supportingSurfaces: Object.freeze([
      "stage",
      "advisor",
      "explorer",
    ] as const),
    backgroundSurfaces: Object.freeze([] as const),
    preservedSurfaces: Object.freeze(["timeline", "insight"] as const),
    priority: "normal" as const,
    reason: "navigation-context-change" as const,
    statement:
      "live-lens navigation elevates live-lens and subject-related surfaces",
  }),
  Object.freeze({
    id: "timeline-navigation",
    trigger: "navigation" as const,
    sourceSurface: "timeline" as const,
    scope: "workspace" as const,
    primarySurface: "source" as const,
    supportingSurfaces: Object.freeze([
      "stage",
      "advisor",
      "insight",
    ] as const),
    backgroundSurfaces: Object.freeze([] as const),
    preservedSurfaces: Object.freeze(["live-lens", "explorer"] as const),
    priority: "normal" as const,
    reason: "temporal-context-change" as const,
    statement:
      "timeline navigation elevates timeline with historical subject support",
  }),
  Object.freeze({
    id: "generic-navigation",
    trigger: "navigation" as const,
    sourceSurface: "*" as const,
    scope: "subject" as const,
    primarySurface: "source" as const,
    supportingSurfaces: Object.freeze([
      "stage",
      "advisor",
      "insight",
      "live-lens",
      "explorer",
    ] as const),
    backgroundSurfaces: Object.freeze([] as const),
    preservedSurfaces: Object.freeze(["timeline"] as const),
    priority: "normal" as const,
    reason: "navigation-context-change" as const,
    statement: "navigation elevates source and related subject surfaces",
  }),
  Object.freeze({
    id: "explorer-selection",
    trigger: "selection-change" as const,
    sourceSurface: "explorer" as const,
    scope: "subject" as const,
    primarySurface: "source" as const,
    supportingSurfaces: Object.freeze([
      "stage",
      "advisor",
      "insight",
      "live-lens",
    ] as const),
    backgroundSurfaces: Object.freeze([] as const),
    preservedSurfaces: Object.freeze(["timeline"] as const),
    priority: "high" as const,
    reason: "related-subject-context" as const,
    statement:
      "explorer selection coordinates related subject surfaces",
  }),
  Object.freeze({
    id: "advisor-activation",
    trigger: "activation" as const,
    sourceSurface: "advisor" as const,
    scope: "workspace" as const,
    primarySurface: "source" as const,
    supportingSurfaces: Object.freeze([
      "stage",
      "insight",
      "live-lens",
    ] as const),
    backgroundSurfaces: Object.freeze(["explorer"] as const),
    preservedSurfaces: Object.freeze(["timeline"] as const),
    priority: "high" as const,
    reason: "activation-context-change" as const,
    statement:
      "advisor activation elevates advisor with supporting evidence surfaces",
  }),
  Object.freeze({
    id: "generic-activation",
    trigger: "activation" as const,
    sourceSurface: "*" as const,
    scope: "workspace" as const,
    primarySurface: "source" as const,
    supportingSurfaces: Object.freeze([
      "stage",
      "advisor",
      "insight",
      "live-lens",
    ] as const),
    backgroundSurfaces: Object.freeze(["explorer"] as const),
    preservedSurfaces: Object.freeze(["timeline"] as const),
    priority: "high" as const,
    reason: "activation-context-change" as const,
    statement: "activation elevates source with supporting context surfaces",
  }),
  Object.freeze({
    id: "inspection",
    trigger: "inspection" as const,
    sourceSurface: "*" as const,
    scope: "subject" as const,
    primarySurface: "source" as const,
    supportingSurfaces: Object.freeze([
      "stage",
      "advisor",
      "insight",
    ] as const),
    backgroundSurfaces: Object.freeze([] as const),
    preservedSurfaces: Object.freeze([
      "live-lens",
      "timeline",
      "explorer",
    ] as const),
    priority: "normal" as const,
    reason: "inspection-context-change" as const,
    statement: "inspection coordinates source and evidence surfaces",
  }),
  Object.freeze({
    id: "dismissal-local",
    trigger: "dismissal" as const,
    sourceSurface: "*" as const,
    scope: "surface" as const,
    primarySurface: "source" as const,
    supportingSurfaces: Object.freeze([] as const),
    backgroundSurfaces: Object.freeze([] as const),
    preservedSurfaces: Object.freeze([
      "stage",
      "advisor",
      "insight",
      "live-lens",
      "timeline",
      "explorer",
    ] as const),
    priority: "low" as const,
    reason: "local-source-only" as const,
    statement:
      "dismissal remains local to the source surface unless shared context requires otherwise",
  }),
  Object.freeze({
    id: "state-change",
    trigger: "state-change" as const,
    sourceSurface: "*" as const,
    scope: "experience" as const,
    primarySurface: "source" as const,
    supportingSurfaces: Object.freeze([
      "stage",
      "advisor",
      "insight",
      "live-lens",
    ] as const),
    backgroundSurfaces: Object.freeze(["explorer"] as const),
    preservedSurfaces: Object.freeze(["timeline"] as const),
    priority: "normal" as const,
    reason: "state-context-change" as const,
    statement:
      "generic state change coordinates related workspace surfaces",
  }),
] as const) satisfies ReadonlyArray<DirectorRuntimeExperienceCoordinationRule>;

// ─── Intent → trigger mapping ───────────────────────────────────────────────

const INTENT_TO_TRIGGER = Object.freeze({
  selection: "selection-change",
  focus: "focus-change",
  activation: "activation",
  navigation: "navigation",
  inspection: "inspection",
  dismissal: "dismissal",
  "lightweight-attention": "attention-change",
} as const satisfies Record<
  DirectorRuntimeConsumerRuntimeIntentKind,
  DirectorRuntimeExperienceCoordinationTriggerKind
>);

// ─── Membership helpers ─────────────────────────────────────────────────────

export function isDirectorRuntimeExperienceCoordinationStatus(
  value: unknown,
): value is DirectorRuntimeExperienceCoordinationStatus {
  return (
    DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_STATUSES as readonly unknown[]
  ).includes(value);
}

export function isDirectorRuntimeExperienceCoordinationScope(
  value: unknown,
): value is DirectorRuntimeExperienceCoordinationScope {
  return (
    DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_SCOPES as readonly unknown[]
  ).includes(value);
}

export function isDirectorRuntimeExperienceSurfaceRole(
  value: unknown,
): value is DirectorRuntimeExperienceSurfaceRole {
  return (
    DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_ROLES as readonly unknown[]
  ).includes(value);
}

export function isDirectorRuntimeExperienceCoordinationTriggerKind(
  value: unknown,
): value is DirectorRuntimeExperienceCoordinationTriggerKind {
  return (
    DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_TRIGGER_KINDS as readonly unknown[]
  ).includes(value);
}

export function isDirectorRuntimeExperienceCoordinationChangeKind(
  value: unknown,
): value is DirectorRuntimeExperienceCoordinationChangeKind {
  return (
    DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_CHANGE_KINDS as readonly unknown[]
  ).includes(value);
}

export function isDirectorRuntimeExperienceCoordinationPriority(
  value: unknown,
): value is DirectorRuntimeExperienceCoordinationPriority {
  return (
    DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_PRIORITIES as readonly unknown[]
  ).includes(value);
}

// ─── Public list / identity APIs ────────────────────────────────────────────

export function getDirectorRuntimeExperienceCoordinationPlatformIdentity():
  typeof directorRuntimeExperienceCoordinationPlatformCanonicalIdentity {
  return directorRuntimeExperienceCoordinationPlatformCanonicalIdentity;
}

export function listDirectorRuntimeExperienceCoordinationStatuses():
  ReadonlyArray<DirectorRuntimeExperienceCoordinationStatus> {
  return DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_STATUSES;
}

export function listDirectorRuntimeExperienceCoordinationScopes():
  ReadonlyArray<DirectorRuntimeExperienceCoordinationScope> {
  return DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_SCOPES;
}

export function listDirectorRuntimeExperienceSurfaceRoles():
  ReadonlyArray<DirectorRuntimeExperienceSurfaceRole> {
  return DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_ROLES;
}

export function listDirectorRuntimeExperienceCoordinationTriggerKinds():
  ReadonlyArray<DirectorRuntimeExperienceCoordinationTriggerKind> {
  return DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_TRIGGER_KINDS;
}

export function listDirectorRuntimeExperienceCoordinationChangeKinds():
  ReadonlyArray<DirectorRuntimeExperienceCoordinationChangeKind> {
  return DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_CHANGE_KINDS;
}

export function listDirectorRuntimeExperienceCoordinationPriorities():
  ReadonlyArray<DirectorRuntimeExperienceCoordinationPriority> {
  return DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_PRIORITIES;
}

export function getDirectorRuntimeExperienceCoordinationRules():
  ReadonlyArray<DirectorRuntimeExperienceCoordinationRule> {
  return DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_RULES;
}

// ─── Internal helpers ───────────────────────────────────────────────────────

function diagnostic(
  kind: DirectorRuntimeExperienceCoordinationDiagnosticKind,
  path: string,
  message: string,
): DirectorRuntimeExperienceCoordinationDiagnostic {
  return Object.freeze({ kind, path, message });
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function outcomeStatusForProjection(
  status: string,
): DirectorRuntimeExperienceSurfaceCoordinationOutcome["status"] {
  if (status === "projected") return "ready";
  if (status === "partially-projected") return "partial";
  if (status === "unavailable") return "unavailable";
  if (status === "inactive") return "inactive";
  if (status === "invalid") return "invalid";
  return "unavailable";
}

function subjectKey(
  subject: DirectorRuntimeConsumerInteractionSubject | null | undefined,
): string | null {
  if (!subject || typeof subject !== "object") return null;
  const kind = "kind" in subject ? String(subject.kind) : "";
  const id = "id" in subject ? String(subject.id) : "";
  if (!kind || !id) return null;
  return `${kind}:${id}`;
}

function freezeSubject(
  subject: DirectorRuntimeConsumerInteractionSubject | null | undefined,
): DirectorRuntimeConsumerInteractionSubject | null {
  if (!subject) return null;
  return Object.freeze({ ...subject });
}

function findProjection(
  experienceState: DirectorRuntimeExperienceCoordinationExperienceState,
  surface: DirectorRuntimeExperienceSurface,
): DirectorRuntimeExperienceCoordinationProjectionView | undefined {
  return experienceState.projections.find((entry) => entry.surface === surface);
}

function canonicalSurfaces(
  surfaces: ReadonlyArray<DirectorRuntimeExperienceSurface>,
): ReadonlyArray<DirectorRuntimeExperienceSurface> {
  const set = new Set(surfaces);
  return DIRECTOR_RUNTIME_EXPERIENCE_SURFACES.filter((surface) =>
    set.has(surface)
  );
}

function buildProvenance(
  sourceSurface: DirectorRuntimeExperienceSurface | "none",
  triggerKind: DirectorRuntimeExperienceCoordinationTriggerKind | "none",
  experienceProjectionIdentity: string,
): DirectorRuntimeExperienceCoordinationProvenance {
  return Object.freeze({
    sourceInteractionBridgeIdentity:
      directorRuntimeConsumerInteractionBridgeIdentity,
    sourceExperienceProjectionIdentity: experienceProjectionIdentity,
    coordinationPlatformIdentity:
      directorRuntimeExperienceCoordinationPlatformIdentity,
    sourceSurface,
    triggerKind,
  });
}

function emptyResult(
  status: DirectorRuntimeExperienceCoordinationStatus,
  diagnostics: ReadonlyArray<DirectorRuntimeExperienceCoordinationDiagnostic>,
  provenance: DirectorRuntimeExperienceCoordinationProvenance,
): DirectorRuntimeExperienceCoordinationResult {
  return Object.freeze({
    status,
    coordinationPlan: null,
    surfaceOutcomes: Object.freeze([]),
    primarySurface: null,
    supportingSurfaces: Object.freeze([]),
    backgroundSurfaces: Object.freeze([]),
    affectedSurfaces: Object.freeze([]),
    preservedSurfaces: Object.freeze([]),
    diagnostics: Object.freeze([...diagnostics]),
    provenance,
  });
}

function resolveTriggerFromIntent(
  intentKind: DirectorRuntimeConsumerRuntimeIntentKind,
): DirectorRuntimeExperienceCoordinationTriggerKind {
  return INTENT_TO_TRIGGER[intentKind];
}

function matchRule(
  trigger: DirectorRuntimeExperienceCoordinationTriggerKind,
  sourceSurface: DirectorRuntimeExperienceSurface,
): DirectorRuntimeExperienceCoordinationRule {
  const specific = DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_RULES.find(
    (rule) =>
      rule.trigger === trigger && rule.sourceSurface === sourceSurface,
  );
  if (specific) return specific;

  const wildcard = DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_RULES.find(
    (rule) => rule.trigger === trigger && rule.sourceSurface === "*",
  );
  if (wildcard) return wildcard;

  return DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_RULES.find(
    (rule) => rule.trigger === "state-change",
  )!;
}

function resolvePrimarySurface(
  rule: DirectorRuntimeExperienceCoordinationRule,
  sourceSurface: DirectorRuntimeExperienceSurface,
): DirectorRuntimeExperienceSurface {
  if (rule.primarySurface === "source") return sourceSurface;
  return rule.primarySurface;
}

function roleReason(
  role: DirectorRuntimeExperienceSurfaceRole,
  rule: DirectorRuntimeExperienceCoordinationRule,
): DirectorRuntimeExperienceCoordinationReason {
  if (role === "primary") return "source-surface-primary";
  if (role === "supporting") {
    if (rule.trigger === "focus-change") return "shared-focus-subject";
    if (rule.trigger === "attention-change") return "shared-attention-context";
    if (rule.trigger === "guidance-change") return "shared-guidance-context";
    if (rule.trigger === "navigation") return "navigation-context-change";
    if (rule.trigger === "selection-change") return "shared-active-subject";
    return "related-subject-context";
  }
  if (role === "preserved") return "surface-preserved";
  if (role === "background") return "surface-not-relevant";
  return "surface-not-relevant";
}

function changeKindForRole(
  role: DirectorRuntimeExperienceSurfaceRole,
  trigger: DirectorRuntimeExperienceCoordinationTriggerKind,
): DirectorRuntimeExperienceCoordinationChangeKind {
  if (role === "preserved") return "preserve";
  if (role === "inactive") return "deactivate";
  if (role === "primary" || role === "supporting") return "update";
  if (role === "background") {
    return trigger === "dismissal" ? "none" : "update";
  }
  return "none";
}

function isStructurallyValidExperienceState(
  value: unknown,
): value is DirectorRuntimeExperienceCoordinationExperienceState {
  if (!isObject(value)) return false;
  if (typeof value.status !== "string") return false;
  if (!Array.isArray(value.projections)) return false;
  for (const entry of value.projections) {
    if (!isObject(entry)) return false;
    if (!isDirectorRuntimeExperienceSurface(entry.surface)) return false;
    if (typeof entry.status !== "string") return false;
  }
  return true;
}

function validateBridgeResult(
  result: DirectorRuntimeConsumerInteractionBridgeResult | null | undefined,
): DirectorRuntimeExperienceCoordinationDiagnostic[] {
  if (result == null) return [];
  if (!isObject(result)) {
    return [
      diagnostic(
        "invalid-bridge-result",
        "interactionBridgeResult",
        "interaction bridge result is structurally invalid",
      ),
    ];
  }
  if (!isDirectorRuntimeConsumerInteractionBridgeStatus(result.status)) {
    return [
      diagnostic(
        "invalid-bridge-result",
        "interactionBridgeResult.status",
        "interaction bridge status is unknown",
      ),
    ];
  }
  return [];
}

// ─── Validation ─────────────────────────────────────────────────────────────

export function validateDirectorRuntimeExperienceCoordination(
  input: DirectorRuntimeExperienceCoordinationInput,
): ReadonlyArray<DirectorRuntimeExperienceCoordinationDiagnostic> {
  const diagnostics: DirectorRuntimeExperienceCoordinationDiagnostic[] = [];

  if (!isObject(input)) {
    return [
      diagnostic(
        "invalid-coordination-input",
        "input",
        "coordination input must be an object",
      ),
    ];
  }

  if (!isStructurallyValidExperienceState(input.experienceStateProjection)) {
    diagnostics.push(
      diagnostic(
        "invalid-coordination-input",
        "experienceStateProjection",
        "experience state projection is structurally invalid",
      ),
    );
  } else if (input.experienceStateProjection.status === "invalid") {
    diagnostics.push(
      diagnostic(
        "invalid-coordination-input",
        "experienceStateProjection.status",
        "experience state projection status is invalid",
      ),
    );
  }

  diagnostics.push(...validateBridgeResult(input.interactionBridgeResult));

  const context = input.coordinationContext;
  if (context != null) {
    if (!isObject(context)) {
      diagnostics.push(
        diagnostic(
          "invalid-coordination-input",
          "coordinationContext",
          "coordination context must be an object when provided",
        ),
      );
    } else {
      if (
        context.triggerOverride != null &&
        !isDirectorRuntimeExperienceCoordinationTriggerKind(
          context.triggerOverride,
        )
      ) {
        diagnostics.push(
          diagnostic(
            "unknown-trigger",
            "coordinationContext.triggerOverride",
            "coordination trigger override is unknown",
          ),
        );
      }
      if (
        context.sourceSurfaceOverride != null &&
        !isDirectorRuntimeExperienceSurface(context.sourceSurfaceOverride)
      ) {
        diagnostics.push(
          diagnostic(
            "unknown-surface",
            "coordinationContext.sourceSurfaceOverride",
            "coordination source surface override is unknown",
          ),
        );
      }
    }
  }

  return Object.freeze(diagnostics);
}

// ─── Core coordination ──────────────────────────────────────────────────────

interface ResolvedCoordinationSeed {
  readonly trigger: DirectorRuntimeExperienceCoordinationTriggerKind;
  readonly sourceSurface: DirectorRuntimeExperienceSurface;
  readonly intent: DirectorRuntimeConsumerInteractionIntent | null;
  readonly selectedSubject: DirectorRuntimeConsumerInteractionSubject | null;
  readonly focusedSubject: DirectorRuntimeConsumerInteractionSubject | null;
  readonly subject: DirectorRuntimeConsumerInteractionSubject | null;
  readonly experienceProjectionIdentity: string;
}

function resolveSeed(
  input: DirectorRuntimeExperienceCoordinationInput,
):
  | { ok: true; seed: ResolvedCoordinationSeed }
  | {
    ok: false;
    status: DirectorRuntimeExperienceCoordinationStatus;
    diagnostics: ReadonlyArray<DirectorRuntimeExperienceCoordinationDiagnostic>;
    provenance: DirectorRuntimeExperienceCoordinationProvenance;
  } {
  const bridge = input.interactionBridgeResult ?? null;
  const context = input.coordinationContext ?? null;
  const experienceProjectionIdentity =
    bridge?.provenance.experienceStateProjectionIdentity ??
      "experience-state-projection";

  if (bridge != null) {
    if (bridge.status === "invalid") {
      return {
        ok: false,
        status: "invalid",
        diagnostics: [
          diagnostic(
            "invalid-bridge-result",
            "interactionBridgeResult.status",
            "bridge result is invalid; coordination cannot proceed",
          ),
        ],
        provenance: buildProvenance("none", "none", experienceProjectionIdentity),
      };
    }
    if (
      bridge.status === "blocked" ||
      bridge.status === "unsupported"
    ) {
      return {
        ok: false,
        status: "blocked",
        diagnostics: [
          diagnostic(
            "blocked-bridge-result",
            "interactionBridgeResult.status",
            `bridge result status ${bridge.status} blocks coordination`,
          ),
        ],
        provenance: buildProvenance(
          bridge.interaction?.surface ?? "none",
          "none",
          experienceProjectionIdentity,
        ),
      };
    }
  }

  let trigger: DirectorRuntimeExperienceCoordinationTriggerKind | null = null;
  let sourceSurface: DirectorRuntimeExperienceSurface | null = null;
  let intent: DirectorRuntimeConsumerInteractionIntent | null = null;

  if (
    bridge &&
    (bridge.status === "bridged" || bridge.status === "partially-bridged") &&
    bridge.runtimeIntent
  ) {
    intent = bridge.runtimeIntent;
    trigger = resolveTriggerFromIntent(intent.kind);
    sourceSurface = intent.surface;
  }

  if (context?.triggerOverride) {
    trigger = context.triggerOverride;
  }
  if (context?.sourceSurfaceOverride) {
    sourceSurface = context.sourceSurfaceOverride;
  }

  if (!trigger) {
    return {
      ok: false,
      status: "invalid",
      diagnostics: [
        diagnostic(
          "unknown-trigger",
          "trigger",
          "unable to resolve coordination trigger from bridge result or context",
        ),
      ],
      provenance: buildProvenance(
        sourceSurface ?? "none",
        "none",
        experienceProjectionIdentity,
      ),
    };
  }

  if (!sourceSurface) {
    return {
      ok: false,
      status: "invalid",
      diagnostics: [
        diagnostic(
          "missing-source-surface",
          "sourceSurface",
          "unable to resolve source surface for coordination",
        ),
      ],
      provenance: buildProvenance("none", trigger, experienceProjectionIdentity),
    };
  }

  const sourceProjection = findProjection(
    input.experienceStateProjection,
    sourceSurface,
  );
  const selectedSubject = freezeSubject(
    context?.selectedSubject ??
      intent?.subject ??
      sourceProjection?.selectedSubject ??
      sourceProjection?.subject ??
      null,
  );
  const focusedSubject = freezeSubject(
    context?.focusedSubject ??
      (trigger === "focus-change" ? intent?.subject : null) ??
      sourceProjection?.focusedSubject ??
      null,
  );
  const subject = freezeSubject(
    intent?.subject ??
      context?.attentionSubject ??
      selectedSubject ??
      focusedSubject ??
      sourceProjection?.subject ??
      null,
  );

  return {
    ok: true,
    seed: {
      trigger,
      sourceSurface,
      intent,
      selectedSubject,
      focusedSubject:
        trigger === "focus-change"
          ? focusedSubject ?? freezeSubject(intent?.subject)
          : focusedSubject,
      subject,
      experienceProjectionIdentity,
    },
  };
}

function buildSurfaceRoles(
  rule: DirectorRuntimeExperienceCoordinationRule,
  primarySurface: DirectorRuntimeExperienceSurface,
  sourceSurface: DirectorRuntimeExperienceSurface,
  experienceState: DirectorRuntimeExperienceCoordinationExperienceState,
): {
  roles: Record<
    DirectorRuntimeExperienceSurface,
    DirectorRuntimeExperienceSurfaceRole
  >;
  diagnostics: DirectorRuntimeExperienceCoordinationDiagnostic[];
  requiredPrimaryUnavailable: boolean;
  partial: boolean;
} {
  const roles = {} as Record<
    DirectorRuntimeExperienceSurface,
    DirectorRuntimeExperienceSurfaceRole
  >;
  const diagnostics: DirectorRuntimeExperienceCoordinationDiagnostic[] = [];
  let requiredPrimaryUnavailable = false;
  let partial = false;

  const supportingSet = new Set<DirectorRuntimeExperienceSurface>(
    rule.supportingSurfaces.filter((surface) => surface !== primarySurface),
  );
  const backgroundSet = new Set<DirectorRuntimeExperienceSurface>(
    rule.backgroundSurfaces.filter(
      (surface) => surface !== primarySurface && !supportingSet.has(surface),
    ),
  );
  const preservedSet = new Set<DirectorRuntimeExperienceSurface>(
    rule.preservedSurfaces.filter(
      (surface) =>
        surface !== primarySurface &&
        !supportingSet.has(surface) &&
        !backgroundSet.has(surface),
    ),
  );

  // Source is always at least considered; if not primary and not listed, preserve.
  if (
    sourceSurface !== primarySurface &&
    !supportingSet.has(sourceSurface) &&
    !backgroundSet.has(sourceSurface) &&
    !preservedSet.has(sourceSurface)
  ) {
    supportingSet.add(sourceSurface);
  }

  for (const surface of DIRECTOR_RUNTIME_EXPERIENCE_SURFACES) {
    const projection = findProjection(experienceState, surface);
    if (!projection) {
      roles[surface] = "inactive";
      partial = true;
      diagnostics.push(
        diagnostic(
          "partial-coordination",
          `experienceStateProjection.projections.${surface}`,
          `projection missing for surface ${surface}`,
        ),
      );
      continue;
    }

    if (projection.status === "invalid") {
      if (surface === primarySurface || surface === sourceSurface) {
        requiredPrimaryUnavailable = true;
      }
      roles[surface] = "inactive";
      partial = true;
      continue;
    }

    if (projection.status === "inactive") {
      roles[surface] = "inactive";
      continue;
    }

    if (projection.status === "unavailable") {
      if (surface === primarySurface) {
        requiredPrimaryUnavailable = true;
        diagnostics.push(
          diagnostic(
            "required-surface-unavailable",
            `experienceStateProjection.projections.${surface}`,
            `required primary surface ${surface} is unavailable`,
          ),
        );
      } else if (supportingSet.has(surface)) {
        partial = true;
        diagnostics.push(
          diagnostic(
            "partial-coordination",
            `experienceStateProjection.projections.${surface}`,
            `supporting surface ${surface} is unavailable`,
          ),
        );
      }
      roles[surface] = "inactive";
      continue;
    }

    if (surface === primarySurface) {
      roles[surface] = "primary";
    } else if (supportingSet.has(surface)) {
      roles[surface] = "supporting";
    } else if (backgroundSet.has(surface)) {
      roles[surface] = "background";
    } else if (preservedSet.has(surface)) {
      roles[surface] = "preserved";
    } else {
      roles[surface] = "preserved";
    }

    if (projection.status === "partially-projected") {
      if (
        roles[surface] === "primary" ||
        roles[surface] === "supporting"
      ) {
        partial = true;
      }
    }
  }

  return { roles, diagnostics, requiredPrimaryUnavailable, partial };
}

function buildOutcomes(
  roles: Record<
    DirectorRuntimeExperienceSurface,
    DirectorRuntimeExperienceSurfaceRole
  >,
  rule: DirectorRuntimeExperienceCoordinationRule,
  seed: ResolvedCoordinationSeed,
  experienceState: DirectorRuntimeExperienceCoordinationExperienceState,
): ReadonlyArray<DirectorRuntimeExperienceSurfaceCoordinationOutcome> {
  return Object.freeze(
    DIRECTOR_RUNTIME_EXPERIENCE_SURFACES.map((surface) => {
      const projection = findProjection(experienceState, surface);
      const role = roles[surface];
      const changeKind = changeKindForRole(role, seed.trigger);

      const selectedSubject =
        seed.trigger === "focus-change"
          ? freezeSubject(
            seed.selectedSubject ??
              projection?.selectedSubject ??
              projection?.subject ??
              null,
          )
          : freezeSubject(
            role === "preserved" || role === "inactive"
              ? projection?.selectedSubject ?? projection?.subject ?? null
              : seed.selectedSubject ??
                seed.subject ??
                projection?.selectedSubject ??
                projection?.subject ??
                null,
          );

      const focusedSubject =
        seed.trigger === "focus-change"
          ? freezeSubject(
            role === "preserved" || role === "inactive"
              ? projection?.focusedSubject ?? null
              : seed.focusedSubject ?? seed.subject ?? null,
          )
          : freezeSubject(projection?.focusedSubject ?? null);

      const subject =
        seed.trigger === "focus-change"
          ? freezeSubject(
            role === "primary" || role === "supporting"
              ? seed.focusedSubject ?? seed.subject
              : projection?.subject ?? selectedSubject,
          )
          : freezeSubject(
            role === "preserved" || role === "inactive"
              ? projection?.subject ?? selectedSubject
              : seed.subject ?? selectedSubject,
          );

      return Object.freeze({
        surface,
        role,
        status: projection
          ? outcomeStatusForProjection(projection.status)
          : "unavailable",
        subject,
        selectedSubject,
        focusedSubject,
        stateReference: projection
          ? `projection:${surface}:${projection.status}`
          : `projection:${surface}:missing`,
        reason: roleReason(role, rule),
        changeKind,
      });
    }),
  );
}

function surfacesWithRole(
  roles: Record<
    DirectorRuntimeExperienceSurface,
    DirectorRuntimeExperienceSurfaceRole
  >,
  role: DirectorRuntimeExperienceSurfaceRole,
): ReadonlyArray<DirectorRuntimeExperienceSurface> {
  return canonicalSurfaces(
    DIRECTOR_RUNTIME_EXPERIENCE_SURFACES.filter(
      (surface) => roles[surface] === role,
    ),
  );
}

function buildPlan(
  seed: ResolvedCoordinationSeed,
  rule: DirectorRuntimeExperienceCoordinationRule,
  roles: Record<
    DirectorRuntimeExperienceSurface,
    DirectorRuntimeExperienceSurfaceRole
  >,
  outcomes: ReadonlyArray<DirectorRuntimeExperienceSurfaceCoordinationOutcome>,
  primarySurface: DirectorRuntimeExperienceSurface,
): DirectorRuntimeExperienceCoordinationPlan {
  const primary = surfacesWithRole(roles, "primary")[0] ?? primarySurface;
  const supporting = surfacesWithRole(roles, "supporting");
  const background = surfacesWithRole(roles, "background");
  const preserved = surfacesWithRole(roles, "preserved");
  const inactive = surfacesWithRole(roles, "inactive");
  const affected = canonicalSurfaces([
    ...surfacesWithRole(roles, "primary"),
    ...supporting,
    ...background,
  ]);

  return Object.freeze({
    trigger: seed.trigger,
    scope: rule.scope,
    priority: rule.priority,
    primarySurface: primary,
    surfaceRoles: Object.freeze({ ...roles }),
    affectedSurfaces: Object.freeze([...affected]),
    preservedSurfaces: Object.freeze([...preserved]),
    supportingSurfaces: Object.freeze([...supporting]),
    backgroundSurfaces: Object.freeze([...background]),
    inactiveSurfaces: Object.freeze([...inactive]),
    subject: seed.subject,
    selectedSubject: seed.selectedSubject,
    focusedSubject: seed.focusedSubject,
    reason: rule.reason,
    outcomes,
  });
}

export function resolveDirectorRuntimeExperienceCoordination(
  input: DirectorRuntimeExperienceCoordinationInput,
): DirectorRuntimeExperienceCoordinationResult {
  return coordinateDirectorRuntimeExperience(input);
}

export function coordinateDirectorRuntimeExperience(
  input: DirectorRuntimeExperienceCoordinationInput,
): DirectorRuntimeExperienceCoordinationResult {
  const validationDiagnostics = validateDirectorRuntimeExperienceCoordination(
    input,
  );
  const hardInvalid = validationDiagnostics.some((entry) =>
    entry.kind === "invalid-coordination-input" ||
    entry.kind === "unknown-trigger" ||
    entry.kind === "unknown-surface" ||
    entry.kind === "invalid-bridge-result"
  );

  if (hardInvalid) {
    return emptyResult(
      "invalid",
      validationDiagnostics,
      buildProvenance("none", "none", "none"),
    );
  }

  const seedResult = resolveSeed(input);
  if (!seedResult.ok) {
    return emptyResult(
      seedResult.status,
      [...validationDiagnostics, ...seedResult.diagnostics],
      seedResult.provenance,
    );
  }

  const { seed } = seedResult;
  const rule = matchRule(seed.trigger, seed.sourceSurface);
  const primarySurface = resolvePrimarySurface(rule, seed.sourceSurface);

  const roleResolution = buildSurfaceRoles(
    rule,
    primarySurface,
    seed.sourceSurface,
    input.experienceStateProjection,
  );

  if (roleResolution.requiredPrimaryUnavailable) {
    return emptyResult(
      "blocked",
      [
        ...validationDiagnostics,
        ...roleResolution.diagnostics,
        diagnostic(
          "required-surface-unavailable",
          `primarySurface.${primarySurface}`,
          "required primary surface is unavailable for coordination",
        ),
      ],
      buildProvenance(
        seed.sourceSurface,
        seed.trigger,
        seed.experienceProjectionIdentity,
      ),
    );
  }

  // Dismissal / local-only → no-op when only source would update.
  if (seed.trigger === "dismissal" && rule.scope === "surface") {
    const localRoles = {} as Record<
      DirectorRuntimeExperienceSurface,
      DirectorRuntimeExperienceSurfaceRole
    >;
    for (const surface of DIRECTOR_RUNTIME_EXPERIENCE_SURFACES) {
      const projection = findProjection(
        input.experienceStateProjection,
        surface,
      );
      if (!projection || projection.status === "inactive") {
        localRoles[surface] = "inactive";
      } else if (surface === seed.sourceSurface) {
        localRoles[surface] = "primary";
      } else {
        localRoles[surface] = "preserved";
      }
    }
    const outcomes = buildOutcomes(
      localRoles,
      rule,
      seed,
      input.experienceStateProjection,
    );
    // Local dismissal: source updates; others preserve → no-op coordination.
    const plan = Object.freeze({
      trigger: seed.trigger,
      scope: "surface" as const,
      priority: rule.priority,
      primarySurface: seed.sourceSurface,
      surfaceRoles: Object.freeze({ ...localRoles }),
      affectedSurfaces: Object.freeze([seed.sourceSurface]),
      preservedSurfaces: Object.freeze(
        [...surfacesWithRole(localRoles, "preserved")],
      ),
      supportingSurfaces: Object.freeze([] as DirectorRuntimeExperienceSurface[]),
      backgroundSurfaces: Object.freeze(
        [] as DirectorRuntimeExperienceSurface[],
      ),
      inactiveSurfaces: Object.freeze([
        ...surfacesWithRole(localRoles, "inactive"),
      ]),
      subject: seed.subject,
      selectedSubject: seed.selectedSubject,
      focusedSubject: seed.focusedSubject,
      reason: "local-source-only" as const,
      outcomes,
    });

    return Object.freeze({
      status: "no-op",
      coordinationPlan: plan,
      surfaceOutcomes: outcomes,
      primarySurface: seed.sourceSurface,
      supportingSurfaces: Object.freeze(
        [] as DirectorRuntimeExperienceSurface[],
      ),
      backgroundSurfaces: Object.freeze(
        [] as DirectorRuntimeExperienceSurface[],
      ),
      affectedSurfaces: Object.freeze([seed.sourceSurface]),
      preservedSurfaces: plan.preservedSurfaces,
      diagnostics: Object.freeze([...validationDiagnostics]),
      provenance: buildProvenance(
        seed.sourceSurface,
        seed.trigger,
        seed.experienceProjectionIdentity,
      ),
    });
  }

  const outcomes = buildOutcomes(
    roleResolution.roles,
    rule,
    seed,
    input.experienceStateProjection,
  );
  const plan = buildPlan(
    seed,
    rule,
    roleResolution.roles,
    outcomes,
    primarySurface,
  );

  // Focus must not overwrite selection identity on outcomes.
  if (seed.trigger === "focus-change" && seed.selectedSubject && seed.focusedSubject) {
    const selectedKey = subjectKey(seed.selectedSubject);
    const focusedKey = subjectKey(seed.focusedSubject);
    if (selectedKey && focusedKey && selectedKey === focusedKey) {
      // Allowed only when they genuinely match; no forced equality otherwise.
    }
  }

  let status: DirectorRuntimeExperienceCoordinationStatus = "coordinated";
  const diagnostics = [...validationDiagnostics, ...roleResolution.diagnostics];

  if (roleResolution.partial) {
    status = "partially-coordinated";
    if (
      !diagnostics.some((entry) => entry.kind === "partial-coordination")
    ) {
      diagnostics.push(
        diagnostic(
          "partial-coordination",
          "coordination",
          "one or more relevant surfaces lack full projection context",
        ),
      );
    }
  }

  // No-op when nothing beyond preserve/inactive/none.
  const updating = outcomes.filter(
    (outcome) =>
      outcome.changeKind === "update" ||
      outcome.changeKind === "reactivate" ||
      outcome.changeKind === "deactivate",
  );
  if (updating.length === 0) {
    status = "no-op";
  }

  return Object.freeze({
    status,
    coordinationPlan: plan,
    surfaceOutcomes: outcomes,
    primarySurface: plan.primarySurface,
    supportingSurfaces: plan.supportingSurfaces,
    backgroundSurfaces: plan.backgroundSurfaces,
    affectedSurfaces: plan.affectedSurfaces,
    preservedSurfaces: plan.preservedSurfaces,
    diagnostics: Object.freeze(diagnostics),
    provenance: buildProvenance(
      seed.sourceSurface,
      seed.trigger,
      seed.experienceProjectionIdentity,
    ),
  });
}

// ─── Registry ───────────────────────────────────────────────────────────────

export const directorRuntimeExperienceCoordinationPlatformApiNames =
  Object.freeze([
    "getDirectorRuntimeExperienceCoordinationPlatformIdentity",
    "listDirectorRuntimeExperienceCoordinationStatuses",
    "listDirectorRuntimeExperienceCoordinationScopes",
    "listDirectorRuntimeExperienceSurfaceRoles",
    "listDirectorRuntimeExperienceCoordinationTriggerKinds",
    "listDirectorRuntimeExperienceCoordinationChangeKinds",
    "listDirectorRuntimeExperienceCoordinationPriorities",
    "getDirectorRuntimeExperienceCoordinationRules",
    "coordinateDirectorRuntimeExperience",
    "resolveDirectorRuntimeExperienceCoordination",
    "validateDirectorRuntimeExperienceCoordination",
    "verifyDirectorRuntimeExperienceCoordinationPlatform",
  ] as const);

export const DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_REGISTRY_SECTIONS =
  Object.freeze([
    "identity",
    "dependency",
    "coordination-statuses",
    "coordination-scopes",
    "surface-roles",
    "trigger-kinds",
    "change-kinds",
    "priorities",
    "coordination-reasons",
    "diagnostics",
    "surface-relationships",
    "coordination-rules",
    "guarantees",
  ] as const);

function countSurfaceRelationshipMembers(): number {
  return DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_RELATIONSHIPS.reduce(
    (total, relationship) => total + relationship.surfaces.length,
    0,
  );
}

export const directorRuntimeExperienceCoordinationPlatformRegistry =
  Object.freeze({
    identity: directorRuntimeExperienceCoordinationPlatformIdentity,
    version: directorRuntimeExperienceCoordinationPlatformVersion,
    namespace: directorRuntimeExperienceCoordinationPlatformNamespace,
    dependency: directorRuntimeExperienceCoordinationPlatformUpstream,
    coordinationStatuses: DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_STATUSES,
    coordinationStatusCount:
      DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_STATUSES.length,
    coordinationScopes: DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_SCOPES,
    coordinationScopeCount:
      DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_SCOPES.length,
    surfaceRoles: DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_ROLES,
    surfaceRoleCount: DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_ROLES.length,
    triggerKinds: DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_TRIGGER_KINDS,
    triggerKindCount:
      DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_TRIGGER_KINDS.length,
    changeKinds: DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_CHANGE_KINDS,
    changeKindCount:
      DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_CHANGE_KINDS.length,
    priorities: DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_PRIORITIES,
    priorityCount: DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_PRIORITIES.length,
    coordinationReasons: DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_REASONS,
    coordinationReasonCount:
      DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_REASONS.length,
    diagnosticKinds: DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_DIAGNOSTIC_KINDS,
    diagnosticKindCount:
      DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_DIAGNOSTIC_KINDS.length,
    surfaceRelationships: DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_RELATIONSHIPS,
    surfaceRelationshipCount:
      DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_RELATIONSHIPS.length,
    surfaceRelationshipMemberCount: countSurfaceRelationshipMembers(),
    coordinationRules: DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_RULES,
    coordinationRuleCount:
      DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_RULES.length,
    guarantees: DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_GUARANTEES,
    guaranteeCount: DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_GUARANTEES.length,
    provenanceFields:
      DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_PROVENANCE_FIELDS,
    provenanceFieldCount:
      DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_PROVENANCE_FIELDS.length,
    registrySections:
      DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_REGISTRY_SECTIONS,
    registrySectionCount:
      DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_REGISTRY_SECTIONS.length,
    publicApis: directorRuntimeExperienceCoordinationPlatformApiNames,
    publicApiCount:
      directorRuntimeExperienceCoordinationPlatformApiNames.length,
    surfaces: DIRECTOR_RUNTIME_EXPERIENCE_SURFACES,
    surfaceCount: DIRECTOR_RUNTIME_EXPERIENCE_SURFACES.length,
  });

export const directorRuntimeExperienceCoordinationPlatform = Object.freeze({
  phase: "DRI-8:6" as const,
  name: "DirectorRuntimeExperienceCoordinationPlatform" as const,
  identity: directorRuntimeExperienceCoordinationPlatformIdentity,
  namespace: directorRuntimeExperienceCoordinationPlatformNamespace,
  version: directorRuntimeExperienceCoordinationPlatformVersion,
  layer: "DirectorRuntimeConsumerIntegration" as const,
  role: "ExperienceCoordinationPlatform" as const,
  stage: "ExperienceCoordinationPlatform" as const,
  status: "ExperienceCoordinationPlatformReady" as const,
  upstreamDependency: directorRuntimeExperienceCoordinationPlatformUpstream,
  deterministic: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  mutatesRuntimeState: false as const,
  philosophy:
    "multi-surface-semantic-coordination-not-ui-coupling" as const,
  coordinationStatuses: DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_STATUSES,
  coordinationScopes: DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_SCOPES,
  surfaceRoles: DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_ROLES,
  triggerKinds: DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_TRIGGER_KINDS,
  changeKinds: DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_CHANGE_KINDS,
  priorities: DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_PRIORITIES,
  coordinationReasons: DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_REASONS,
  diagnosticKinds: DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_DIAGNOSTIC_KINDS,
  coordinationRules: DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_RULES,
  surfaceRelationships: DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_RELATIONSHIPS,
  guarantees: DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_GUARANTEES,
  publicApiSurface: directorRuntimeExperienceCoordinationPlatformApiNames,
  registry: directorRuntimeExperienceCoordinationPlatformRegistry,
  interactionBridgeBoundary:
    "DRI-8:5-consumer-interaction-bridge-only" as const,
  architecturalStatus:
    "Experience Coordination Platform Complete · Deterministic · Immutable · Framework-Independent · ReadyForAdapterCertification" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface DirectorRuntimeExperienceCoordinationPlatformVerification {
  readonly ok: boolean;
  readonly identity: typeof directorRuntimeExperienceCoordinationPlatformIdentity;
  readonly version: typeof directorRuntimeExperienceCoordinationPlatformVersion;
  readonly namespace:
    typeof directorRuntimeExperienceCoordinationPlatformNamespace;
  readonly dependency:
    typeof directorRuntimeExperienceCoordinationPlatformUpstream;
  readonly coordinationStatusCount: number;
  readonly coordinationScopeCount: number;
  readonly surfaceRoleCount: number;
  readonly triggerKindCount: number;
  readonly changeKindCount: number;
  readonly priorityCount: number;
  readonly coordinationReasonCount: number;
  readonly diagnosticKindCount: number;
  readonly coordinationRuleCount: number;
  readonly surfaceRelationshipCount: number;
  readonly guaranteeCount: number;
  readonly registrySectionCount: number;
  readonly publicApiCount: number;
  readonly frozen: boolean;
  readonly dri85BoundaryIntact: boolean;
  readonly frameworkIndependent: boolean;
  readonly mutatesRuntimeState: boolean;
  readonly canonicalSurfaceOrder: boolean;
  readonly rulesValid: boolean;
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

function rulesValid(): boolean {
  const triggers = new Set<string>(
    DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_TRIGGER_KINDS,
  );
  const scopes = new Set<string>(
    DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_SCOPES,
  );
  const surfaces = new Set<string>(DIRECTOR_RUNTIME_EXPERIENCE_SURFACES);
  const priorities = new Set<string>(
    DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_PRIORITIES,
  );
  const reasons = new Set<string>(
    DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_REASONS,
  );

  for (const rule of DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_RULES) {
    if (!Object.isFrozen(rule)) return false;
    if (!triggers.has(rule.trigger)) return false;
    if (rule.sourceSurface !== "*" && !surfaces.has(rule.sourceSurface)) {
      return false;
    }
    if (!scopes.has(rule.scope)) return false;
    if (
      rule.primarySurface !== "source" &&
      !surfaces.has(rule.primarySurface)
    ) {
      return false;
    }
    if (!priorities.has(rule.priority)) return false;
    if (!reasons.has(rule.reason)) return false;
    for (const surface of rule.supportingSurfaces) {
      if (!surfaces.has(surface)) return false;
    }
    for (const surface of rule.backgroundSurfaces) {
      if (!surfaces.has(surface)) return false;
    }
    for (const surface of rule.preservedSurfaces) {
      if (!surfaces.has(surface)) return false;
    }
  }
  return true;
}

export function verifyDirectorRuntimeExperienceCoordinationPlatform():
  DirectorRuntimeExperienceCoordinationPlatformVerification {
  const platform = directorRuntimeExperienceCoordinationPlatform;
  const registry = directorRuntimeExperienceCoordinationPlatformRegistry;

  const identityOk =
    platform.identity ===
      "DRI-8:6/DirectorRuntimeExperienceCoordinationPlatform" &&
    platform.version === "8.6.0" &&
    platform.namespace ===
      "nexora.dri.consumer-integration.experience-coordination-platform" &&
    platform.upstreamDependency ===
      "DRI-8:5/DirectorRuntimeConsumerInteractionBridge" &&
    platform.interactionBridgeBoundary ===
      "DRI-8:5-consumer-interaction-bridge-only" &&
    platform.layer === "DirectorRuntimeConsumerIntegration" &&
    platform.role === "ExperienceCoordinationPlatform";

  const vocabOk =
    exactOrder(DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_STATUSES, [
      "coordinated",
      "partially-coordinated",
      "no-op",
      "blocked",
      "invalid",
    ]) &&
    unique([...DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_STATUSES]) &&
    exactOrder(DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_SCOPES, [
      "surface",
      "subject",
      "workspace",
      "experience",
    ]) &&
    unique([...DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_SCOPES]) &&
    exactOrder(DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_ROLES, [
      "primary",
      "supporting",
      "background",
      "preserved",
      "inactive",
    ]) &&
    unique([...DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_ROLES]) &&
    exactOrder(DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_TRIGGER_KINDS, [
      "state-change",
      "selection-change",
      "focus-change",
      "activation",
      "navigation",
      "inspection",
      "dismissal",
      "attention-change",
      "guidance-change",
    ]) &&
    unique([...DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_TRIGGER_KINDS]) &&
    exactOrder(DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_CHANGE_KINDS, [
      "update",
      "preserve",
      "deactivate",
      "reactivate",
      "none",
    ]) &&
    unique([...DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_CHANGE_KINDS]) &&
    exactOrder(DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_PRIORITIES, [
      "critical",
      "high",
      "normal",
      "low",
    ]) &&
    unique([...DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_PRIORITIES]);

  const surfaceOrderOk = exactOrder(
    [...DIRECTOR_RUNTIME_EXPERIENCE_SURFACES],
    ["stage", "advisor", "insight", "live-lens", "timeline", "explorer"],
  );

  const countsOk =
    registry.coordinationStatusCount ===
      DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_STATUSES.length &&
    registry.coordinationScopeCount ===
      DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_SCOPES.length &&
    registry.surfaceRoleCount ===
      DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_ROLES.length &&
    registry.triggerKindCount ===
      DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_TRIGGER_KINDS.length &&
    registry.changeKindCount ===
      DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_CHANGE_KINDS.length &&
    registry.priorityCount ===
      DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_PRIORITIES.length &&
    registry.coordinationReasonCount ===
      DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_REASONS.length &&
    registry.diagnosticKindCount ===
      DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_DIAGNOSTIC_KINDS.length &&
    registry.coordinationRuleCount ===
      DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_RULES.length &&
    registry.surfaceRelationshipCount ===
      DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_RELATIONSHIPS.length &&
    registry.guaranteeCount ===
      DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_GUARANTEES.length &&
    registry.registrySectionCount ===
      DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_REGISTRY_SECTIONS.length &&
    registry.publicApiCount ===
      directorRuntimeExperienceCoordinationPlatformApiNames.length &&
    registry.surfaceRelationshipMemberCount ===
      countSurfaceRelationshipMembers();

  const frozen =
    Object.isFrozen(platform) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_STATUSES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_SCOPES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_ROLES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_TRIGGER_KINDS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_CHANGE_KINDS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_PRIORITIES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_REASONS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_DIAGNOSTIC_KINDS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_RULES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_RELATIONSHIPS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_GUARANTEES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_REGISTRY_SECTIONS);

  const dri85BoundaryIntact =
    platform.upstreamDependency ===
      directorRuntimeConsumerInteractionBridgeIdentity &&
    platform.upstreamDependency ===
      "DRI-8:5/DirectorRuntimeConsumerInteractionBridge" &&
    platform.interactionBridgeBoundary ===
      "DRI-8:5-consumer-interaction-bridge-only";

  const rulesOk = rulesValid();

  const ok =
    identityOk &&
    vocabOk &&
    surfaceOrderOk &&
    countsOk &&
    frozen &&
    dri85BoundaryIntact &&
    rulesOk &&
    platform.mutatesRuntimeState === false &&
    platform.frameworkIndependent === true &&
    exactOrder(
      [...DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_REGISTRY_SECTIONS],
      [
        "identity",
        "dependency",
        "coordination-statuses",
        "coordination-scopes",
        "surface-roles",
        "trigger-kinds",
        "change-kinds",
        "priorities",
        "coordination-reasons",
        "diagnostics",
        "surface-relationships",
        "coordination-rules",
        "guarantees",
      ],
    ) &&
    exactOrder(
      [...DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_GUARANTEES],
      [
        "semantic-only",
        "multi-surface",
        "framework-independent",
        "surface-decoupled",
        "context-preserving",
        "selection-focus-distinct",
        "minimal-fan-out",
        "preserve-unaffected-surfaces",
        "immutable",
        "deterministic",
        "non-mutating",
        "identity-preserving",
        "provenance-preserving",
        "no-business-inference",
        "no-rendering",
        "no-ui-side-effects",
        "no-runtime-interaction-reimplementation",
      ],
    );

  return Object.freeze({
    ok,
    identity: directorRuntimeExperienceCoordinationPlatformIdentity,
    version: directorRuntimeExperienceCoordinationPlatformVersion,
    namespace: directorRuntimeExperienceCoordinationPlatformNamespace,
    dependency: directorRuntimeExperienceCoordinationPlatformUpstream,
    coordinationStatusCount:
      DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_STATUSES.length,
    coordinationScopeCount:
      DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_SCOPES.length,
    surfaceRoleCount: DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_ROLES.length,
    triggerKindCount:
      DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_TRIGGER_KINDS.length,
    changeKindCount:
      DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_CHANGE_KINDS.length,
    priorityCount: DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_PRIORITIES.length,
    coordinationReasonCount:
      DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_REASONS.length,
    diagnosticKindCount:
      DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_DIAGNOSTIC_KINDS.length,
    coordinationRuleCount:
      DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_RULES.length,
    surfaceRelationshipCount:
      DIRECTOR_RUNTIME_EXPERIENCE_SURFACE_RELATIONSHIPS.length,
    guaranteeCount: DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_GUARANTEES.length,
    registrySectionCount:
      DIRECTOR_RUNTIME_EXPERIENCE_COORDINATION_REGISTRY_SECTIONS.length,
    publicApiCount:
      directorRuntimeExperienceCoordinationPlatformApiNames.length,
    frozen,
    dri85BoundaryIntact,
    frameworkIndependent: platform.frameworkIndependent,
    mutatesRuntimeState: platform.mutatesRuntimeState,
    canonicalSurfaceOrder: surfaceOrderOk,
    rulesValid: rulesOk,
  });
}
