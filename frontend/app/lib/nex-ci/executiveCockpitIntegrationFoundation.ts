/**
 * NEX-CI:1 — Executive Cockpit Integration Foundation.
 *
 * Establishes the canonical integration boundary between the frozen
 * Runtime-Enabled Executive Experience (REX) architecture and the
 * Nexora Executive Cockpit UI.
 *
 * Canonical flow:
 *   NOL → DRI → EX-DRI → REX → NEX-CI → Executive Cockpit → Executive User
 *
 * Principle:
 *   The Executive Cockpit must NOT directly orchestrate internal
 *   REX / DRI / NOL implementation details. Cockpit consumers consume
 *   the approved NEX-CI surface.
 *
 * NEX-CI:1 is foundation only — vocabulary, contracts, bindings,
 * context/state/snapshot constructors, and validation. No React,
 * Three.js, rendering, persistence, network, or later NEX-CI phases.
 */

import {
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_PRESENTATION_STATES,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_SUBJECT_KINDS,
  runtimeEnabledExecutiveExperiencePublicIndexIdentity,
} from "@/app/lib/rex/runtimeEnabledExecutiveExperiencePublicIndex";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveCockpitIntegrationFoundationIdentity =
  "NEX-CI:1/ExecutiveCockpitIntegrationFoundation" as const;

export const executiveCockpitIntegrationFoundationVersion =
  "1.1.0" as const;

export const executiveCockpitIntegrationFoundationNamespace =
  "nexora.executive.cockpit.integration.foundation" as const;

export const executiveCockpitIntegrationFoundationLayer =
  "NEX-CI" as const;

export const executiveCockpitIntegrationFoundationPhase =
  "Foundation" as const;

export const executiveCockpitIntegrationFoundationStage =
  "Foundation" as const;

export const executiveCockpitIntegrationFoundationArchitecturalRole =
  "ExecutiveCockpitIntegrationFoundation" as const;

export const executiveCockpitIntegrationFoundationDependencyIdentity =
  runtimeEnabledExecutiveExperiencePublicIndexIdentity;

export const executiveCockpitIntegrationFoundationDependencyPath =
  "@/app/lib/rex/runtimeEnabledExecutiveExperiencePublicIndex" as const;

export const executiveCockpitIntegrationFoundationStability =
  "FoundationReady" as const;

export const executiveCockpitIntegrationFoundationDeterministic =
  true as const;

export const executiveCockpitIntegrationFoundationSideEffectPolicy =
  "side-effect-free" as const;

export const executiveCockpitIntegrationFoundationMutationPolicy =
  "immutable" as const;

/**
 * Approved upstream REX Public Index surfaces consumed by NEX-CI:1.
 * NEX-CI does not import private REX / EX-DRI / DRI / NOL modules.
 */
export const EXECUTIVE_COCKPIT_INTEGRATION_APPROVED_UPSTREAM_DEPENDENCIES =
  Object.freeze([
    Object.freeze({
      id: "rex-public-index-identity",
      order: 1,
      exportName: "runtimeEnabledExecutiveExperiencePublicIndexIdentity",
      purpose: "Sole immediate REX consumer-entry identity",
    }),
    Object.freeze({
      id: "rex-frozen-presentation-states",
      order: 2,
      exportName:
        "RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_PRESENTATION_STATES",
      purpose:
        "Canonical Minimum / Report / Operation presentation vocabulary",
    }),
    Object.freeze({
      id: "rex-frozen-subject-kinds",
      order: 3,
      exportName: "RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_SUBJECT_KINDS",
      purpose: "Canonical executive subject-kind vocabulary for reuse",
    }),
  ] as const);

export const executiveCockpitIntegrationFoundationCanonicalIdentity =
  Object.freeze({
    identity: executiveCockpitIntegrationFoundationIdentity,
    version: executiveCockpitIntegrationFoundationVersion,
    namespace: executiveCockpitIntegrationFoundationNamespace,
    layer: executiveCockpitIntegrationFoundationLayer,
    phase: executiveCockpitIntegrationFoundationPhase,
    stage: executiveCockpitIntegrationFoundationStage,
    architecturalRole:
      executiveCockpitIntegrationFoundationArchitecturalRole,
    dependencyIdentity:
      executiveCockpitIntegrationFoundationDependencyIdentity,
    dependencyPath:
      executiveCockpitIntegrationFoundationDependencyPath,
    stabilityStatus: executiveCockpitIntegrationFoundationStability,
    deterministicStatus:
      executiveCockpitIntegrationFoundationDeterministic,
    sideEffectPolicy:
      executiveCockpitIntegrationFoundationSideEffectPolicy,
    mutationPolicy:
      executiveCockpitIntegrationFoundationMutationPolicy,
  });

export const EXECUTIVE_COCKPIT_INTEGRATION_PRINCIPLE =
  "Runtime / REX → NEX-CI → Executive Cockpit → Executive User. The Cockpit consumes NEX-CI; it does not reach through NEX-CI into REX/DRI/NOL internals." as const;

export const EXECUTIVE_COCKPIT_INTEGRATION_BOUNDARY = Object.freeze({
  nexCiAuthority: "Executive-Cockpit-Integration" as const,
  rexAuthority: "Runtime-Enabled-Executive-Experience" as const,
  cockpitAuthority: "Executive-Cockpit-UI" as const,
  boundaryAuthority: "NEX-CI" as const,
  architecturalRole:
    "ExecutiveCockpitIntegrationFoundation" as const,
  soleImmediateDependency:
    "REX-1:9/RuntimeEnabledExecutiveExperiencePublicIndex" as const,
  consumesPublicIndexOnly: true as const,
  bypassesRexIntoExDri: false as const,
  bypassesExDriIntoDri: false as const,
  bypassesDriIntoNol: false as const,
  orchestratesRexInternals: false as const,
  orchestratesDriInternals: false as const,
  orchestratesNolInternals: false as const,
  ownsRendering: false as const,
  ownsPresentationResolution: false as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  introducesUiComponents: false as const,
  introducesThreeJs: false as const,
  introducesPersistenceOrNetwork: false as const,
  implementsLaterNexCiPhases: false as const,
});

export const EXECUTIVE_COCKPIT_INTEGRATION_RUNTIME_SOURCE = Object.freeze({
  originLayer: "REX" as const,
  destinationLayer: "NEX-CI" as const,
  relationship: "REX → NEX-CI" as const,
  authorityIdentity:
    runtimeEnabledExecutiveExperiencePublicIndexIdentity,
  authorityPath:
    "@/app/lib/rex/runtimeEnabledExecutiveExperiencePublicIndex" as const,
  nexCiIsRuntimeOwner: false as const,
  nexCiIsIntegrationConsumer: true as const,
  flow: "Runtime / REX → NEX-CI → Executive Cockpit → Executive User" as const,
});

export type ExecutiveCockpitIntegrationRuntimeSource =
  typeof EXECUTIVE_COCKPIT_INTEGRATION_RUNTIME_SOURCE;

// ─── Cockpit surfaces ───────────────────────────────────────────────────────

/**
 * Canonical Executive Cockpit integration surfaces.
 * These are cockpit coordination surfaces — not independent runtime engines.
 */
export const EXECUTIVE_COCKPIT_SURFACES = Object.freeze([
  "stage",
  "advisor",
  "insight",
  "timeline",
  "explorer",
  "live-lens",
  "workspace-dial",
  "context-bar",
  "navigation",
  "status",
] as const);

export type ExecutiveCockpitSurface =
  (typeof EXECUTIVE_COCKPIT_SURFACES)[number];

// ─── Integration roles ──────────────────────────────────────────────────────

export const EXECUTIVE_COCKPIT_INTEGRATION_ROLES = Object.freeze([
  "primary",
  "supporting",
  "contextual",
  "navigation",
  "control",
  "status",
] as const);

export type ExecutiveCockpitIntegrationRole =
  (typeof EXECUTIVE_COCKPIT_INTEGRATION_ROLES)[number];

/**
 * Deterministic default role ownership for each cockpit surface.
 */
export const EXECUTIVE_COCKPIT_SURFACE_DEFAULT_ROLES = Object.freeze({
  stage: "primary",
  advisor: "supporting",
  insight: "supporting",
  timeline: "contextual",
  explorer: "contextual",
  "live-lens": "contextual",
  "workspace-dial": "control",
  "context-bar": "control",
  navigation: "navigation",
  status: "status",
} as const satisfies Record<
  ExecutiveCockpitSurface,
  ExecutiveCockpitIntegrationRole
>);

// ─── Integration status ─────────────────────────────────────────────────────

export const EXECUTIVE_COCKPIT_INTEGRATION_STATUSES = Object.freeze([
  "idle",
  "ready",
  "active",
  "transitioning",
  "unavailable",
] as const);

export type ExecutiveCockpitIntegrationStatus =
  (typeof EXECUTIVE_COCKPIT_INTEGRATION_STATUSES)[number];

// ─── Capabilities ───────────────────────────────────────────────────────────

/**
 * Conceptual capabilities exposed by the integration foundation.
 * Identifiers only — no orchestration behavior in NEX-CI:1.
 */
export const EXECUTIVE_COCKPIT_INTEGRATION_CAPABILITIES = Object.freeze([
  "surface-coordination",
  "runtime-state-consumption",
  "focus-propagation",
  "selection-propagation",
  "presentation-state-propagation",
  "attention-propagation",
  "workspace-coordination",
  "executive-subject-coordination",
  "interaction-readiness",
] as const);

export type ExecutiveCockpitIntegrationCapability =
  (typeof EXECUTIVE_COCKPIT_INTEGRATION_CAPABILITIES)[number];

// ─── Presentation compatibility (upstream REX frozen types) ─────────────────

/**
 * Canonical Nexora presentation model reused from frozen REX Public Index.
 * NEX-CI carries and coordinates presentation state only — it does not
 * introduce a competing presentation-state system or resolve presentation.
 *
 * minimum  — small visual presence / point / caption
 * report   — executive-readable information
 * operation — interactive executive action context
 */
export const EXECUTIVE_COCKPIT_PRESENTATION_STATES =
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_PRESENTATION_STATES;

export type ExecutiveCockpitPresentationState =
  (typeof EXECUTIVE_COCKPIT_PRESENTATION_STATES)[number];

// ─── Executive subject kinds ────────────────────────────────────────────────

/**
 * Cockpit-facing executive subject kinds.
 * Reuses frozen REX subject kinds, then adds reserved future kinds
 * (insight, guidance) for later coordination without domain behavior.
 * `object` is the canonical NexoraObject subject kind.
 */
export const EXECUTIVE_COCKPIT_SUBJECT_KINDS = Object.freeze([
  "goal",
  "object",
  "problem",
  "scenario",
  "decision",
  "execution",
  "kpi",
  "koi",
  "pack",
  "insight",
  "guidance",
] as const);

export type ExecutiveCockpitSubjectKind =
  (typeof EXECUTIVE_COCKPIT_SUBJECT_KINDS)[number];

export type RuntimeEnabledExecutiveExperienceFrozenSubjectKind =
  (typeof RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_SUBJECT_KINDS)[number];

export const EXECUTIVE_COCKPIT_SUBJECT_KIND_SEMANTICS = Object.freeze({
  object: "NexoraObject" as const,
  goal: "Goal" as const,
  problem: "Problem" as const,
  scenario: "Scenario" as const,
  decision: "Decision" as const,
  execution: "Execution" as const,
  pack: "Pack" as const,
  insight: "Insight (future cockpit subject; no domain behavior in NEX-CI:1)" as const,
  guidance:
    "Guidance (future cockpit subject; no domain behavior in NEX-CI:1)" as const,
  reusesRexFrozenSubjectKinds: true as const,
  competingSubjectModel: false as const,
  implementsDomainBehavior: false as const,
});

/**
 * Lightweight cockpit-facing reference for the executive subject currently
 * being presented or manipulated. No domain behavior.
 */
export interface ExecutiveCockpitSubjectReference {
  readonly id: string;
  readonly kind: ExecutiveCockpitSubjectKind;
}

// ─── Surface binding contract ───────────────────────────────────────────────

export interface ExecutiveCockpitSurfaceBinding {
  readonly surface: ExecutiveCockpitSurface;
  readonly role: ExecutiveCockpitIntegrationRole;
  readonly enabled: boolean;
  readonly capabilities: readonly ExecutiveCockpitIntegrationCapability[];
}

const STAGE_CAPABILITIES = Object.freeze([
  "surface-coordination",
  "runtime-state-consumption",
  "focus-propagation",
  "selection-propagation",
  "presentation-state-propagation",
  "attention-propagation",
  "workspace-coordination",
  "executive-subject-coordination",
  "interaction-readiness",
] as const satisfies readonly ExecutiveCockpitIntegrationCapability[]);

const SUPPORTING_SURFACE_CAPABILITIES = Object.freeze([
  "surface-coordination",
  "runtime-state-consumption",
  "focus-propagation",
  "selection-propagation",
  "presentation-state-propagation",
  "attention-propagation",
  "workspace-coordination",
  "executive-subject-coordination",
  "interaction-readiness",
] as const satisfies readonly ExecutiveCockpitIntegrationCapability[]);

const CONTEXTUAL_SURFACE_CAPABILITIES = Object.freeze([
  "surface-coordination",
  "runtime-state-consumption",
  "focus-propagation",
  "selection-propagation",
  "presentation-state-propagation",
  "attention-propagation",
  "workspace-coordination",
  "executive-subject-coordination",
  "interaction-readiness",
] as const satisfies readonly ExecutiveCockpitIntegrationCapability[]);

const CONTROL_SURFACE_CAPABILITIES = Object.freeze([
  "surface-coordination",
  "runtime-state-consumption",
  "workspace-coordination",
  "presentation-state-propagation",
  "interaction-readiness",
] as const satisfies readonly ExecutiveCockpitIntegrationCapability[]);

const NAVIGATION_SURFACE_CAPABILITIES = Object.freeze([
  "surface-coordination",
  "workspace-coordination",
  "interaction-readiness",
] as const satisfies readonly ExecutiveCockpitIntegrationCapability[]);

const STATUS_SURFACE_CAPABILITIES = Object.freeze([
  "surface-coordination",
  "runtime-state-consumption",
  "interaction-readiness",
] as const satisfies readonly ExecutiveCockpitIntegrationCapability[]);

function freezeBinding(
  surface: ExecutiveCockpitSurface,
  role: ExecutiveCockpitIntegrationRole,
  capabilities: readonly ExecutiveCockpitIntegrationCapability[],
): ExecutiveCockpitSurfaceBinding {
  return Object.freeze({
    surface,
    role,
    enabled: true as const,
    capabilities: Object.freeze([...capabilities]),
  });
}

/**
 * Canonical immutable bindings for every cockpit surface.
 * Exactly one binding per surface; deterministic order matches surfaces.
 */
export const EXECUTIVE_COCKPIT_SURFACE_BINDINGS = Object.freeze([
  freezeBinding("stage", "primary", STAGE_CAPABILITIES),
  freezeBinding("advisor", "supporting", SUPPORTING_SURFACE_CAPABILITIES),
  freezeBinding("insight", "supporting", SUPPORTING_SURFACE_CAPABILITIES),
  freezeBinding("timeline", "contextual", CONTEXTUAL_SURFACE_CAPABILITIES),
  freezeBinding("explorer", "contextual", CONTEXTUAL_SURFACE_CAPABILITIES),
  freezeBinding("live-lens", "contextual", CONTEXTUAL_SURFACE_CAPABILITIES),
  freezeBinding("workspace-dial", "control", CONTROL_SURFACE_CAPABILITIES),
  freezeBinding("context-bar", "control", CONTROL_SURFACE_CAPABILITIES),
  freezeBinding("navigation", "navigation", NAVIGATION_SURFACE_CAPABILITIES),
  freezeBinding("status", "status", STATUS_SURFACE_CAPABILITIES),
] as const);

// ─── Context / state / snapshot ─────────────────────────────────────────────

/**
 * Cockpit-level coordination context.
 * Framework-agnostic plain data — no React, DOM, or Three.js objects.
 */
export interface ExecutiveCockpitIntegrationContext {
  readonly workspaceId?: string;
  readonly modelId?: string;
  readonly activeSurface: ExecutiveCockpitSurface;
  readonly activeWorkspace?: string;
  readonly selectedSubjectId?: string;
  readonly focusedSubjectId?: string;
  readonly presentationState?: ExecutiveCockpitPresentationState;
  /** Opaque attention subject id carried for later propagation — not computed. */
  readonly attentionSubjectId?: string;
  readonly runtimeSource: ExecutiveCockpitIntegrationRuntimeSource;
  readonly foundationIdentity: typeof executiveCockpitIntegrationFoundationIdentity;
  readonly foundationVersion: typeof executiveCockpitIntegrationFoundationVersion;
}

/**
 * Immutable cockpit integration state.
 * Framework-agnostic — no React hooks, stores, browser, or Three.js state.
 */
export interface ExecutiveCockpitIntegrationState {
  readonly activeSurface: ExecutiveCockpitSurface;
  readonly activeWorkspace?: string;
  readonly selectedSubject?: ExecutiveCockpitSubjectReference;
  readonly focusedSubject?: ExecutiveCockpitSubjectReference;
  readonly presentationState?: ExecutiveCockpitPresentationState;
  /** Opaque attention context id — carried, never calculated here. */
  readonly attentionSubjectId?: string;
  readonly status: ExecutiveCockpitIntegrationStatus;
  readonly foundationIdentity: typeof executiveCockpitIntegrationFoundationIdentity;
  readonly foundationVersion: typeof executiveCockpitIntegrationFoundationVersion;
}

/**
 * Canonical snapshot for future Cockpit consumers.
 * Data only — no React elements, callbacks, Three.js, or DOM references.
 */
export interface ExecutiveCockpitIntegrationSnapshot {
  readonly context: ExecutiveCockpitIntegrationContext;
  readonly state: ExecutiveCockpitIntegrationState;
  readonly bindings: readonly ExecutiveCockpitSurfaceBinding[];
  readonly runtimeSource: ExecutiveCockpitIntegrationRuntimeSource;
  readonly foundationIdentity: typeof executiveCockpitIntegrationFoundationIdentity;
  readonly foundationVersion: typeof executiveCockpitIntegrationFoundationVersion;
}

export type ExecutiveCockpitIntegrationContextInput = {
  readonly workspaceId?: string;
  readonly modelId?: string;
  readonly activeSurface: ExecutiveCockpitSurface;
  readonly activeWorkspace?: string;
  readonly selectedSubjectId?: string;
  readonly focusedSubjectId?: string;
  readonly presentationState?: ExecutiveCockpitPresentationState;
  readonly attentionSubjectId?: string;
};

export type ExecutiveCockpitIntegrationStateInput = {
  readonly activeSurface: ExecutiveCockpitSurface;
  readonly activeWorkspace?: string;
  readonly selectedSubject?: ExecutiveCockpitSubjectReference;
  readonly focusedSubject?: ExecutiveCockpitSubjectReference;
  readonly presentationState?: ExecutiveCockpitPresentationState;
  readonly attentionSubjectId?: string;
  readonly status: ExecutiveCockpitIntegrationStatus;
};

export type ExecutiveCockpitIntegrationSnapshotInput = {
  readonly context: ExecutiveCockpitIntegrationContextInput | ExecutiveCockpitIntegrationContext;
  readonly state: ExecutiveCockpitIntegrationStateInput | ExecutiveCockpitIntegrationState;
  readonly bindings?: readonly ExecutiveCockpitSurfaceBinding[];
};

// ─── Guarantees / forbidden responsibilities ────────────────────────────────

export const EXECUTIVE_COCKPIT_INTEGRATION_FOUNDATION_GUARANTEES =
  Object.freeze([
    Object.freeze({
      id: "cockpit-surfaces-uniquely-defined",
      order: 1,
      statement: "Every canonical cockpit surface is uniquely defined.",
    }),
    Object.freeze({
      id: "one-binding-per-surface",
      order: 2,
      statement: "Every surface has exactly one canonical surface binding.",
    }),
    Object.freeze({
      id: "binding-roles-valid",
      order: 3,
      statement: "Every binding references a valid integration role.",
    }),
    Object.freeze({
      id: "binding-capabilities-canonical",
      order: 4,
      statement: "Every binding capability is canonical.",
    }),
    Object.freeze({
      id: "stage-is-primary-visual-surface",
      order: 5,
      statement:
        "Stage is recognized as the primary visual integration surface.",
    }),
    Object.freeze({
      id: "workspace-dial-is-control-surface",
      order: 6,
      statement: "Workspace Dial is recognized as a control surface.",
    }),
    Object.freeze({
      id: "advisor-insight-remain-separate",
      order: 7,
      statement: "Advisor and Insight remain separate surfaces.",
    }),
    Object.freeze({
      id: "presentation-state-reuses-rex",
      order: 8,
      statement:
        "Presentation state does not introduce a competing model to REX.",
    }),
    Object.freeze({
      id: "no-react-dependency",
      order: 9,
      statement: "Foundation contains no React dependency.",
    }),
    Object.freeze({
      id: "no-threejs-dependency",
      order: 10,
      statement: "Foundation contains no Three.js dependency.",
    }),
    Object.freeze({
      id: "no-rendering",
      order: 11,
      statement: "Foundation performs no rendering.",
    }),
    Object.freeze({
      id: "no-network-access",
      order: 12,
      statement: "Foundation performs no network access.",
    }),
    Object.freeze({
      id: "no-persistence",
      order: 13,
      statement: "Foundation performs no persistence.",
    }),
    Object.freeze({
      id: "no-direct-nol-dri-orchestration",
      order: 14,
      statement:
        "Foundation does not directly orchestrate NOL/DRI internals.",
    }),
    Object.freeze({
      id: "deterministic-side-effect-free",
      order: 15,
      statement: "Foundation remains deterministic and side-effect free.",
    }),
  ] as const);

export type ExecutiveCockpitIntegrationFoundationGuarantee =
  (typeof EXECUTIVE_COCKPIT_INTEGRATION_FOUNDATION_GUARANTEES)[number];

export const EXECUTIVE_COCKPIT_INTEGRATION_FORBIDDEN_RESPONSIBILITIES =
  Object.freeze([
    "React components",
    "React hooks",
    "React state",
    "Next.js components",
    "Three.js scenes",
    "React Three Fiber",
    "camera movement",
    "object centering",
    "object animation",
    "object connection rendering",
    "scene colors",
    "focus animations",
    "Minimum/Report/Operation rendering",
    "Workspace Dial geometry",
    "Workspace Dial rotation",
    "Workspace Dial gestures",
    "workspace switching animation",
    "scene transitions",
    "Advisor content generation",
    "Insight generation",
    "timeline replay",
    "explorer drawers",
    "Live Lens navigation",
    "persistence",
    "network access",
    "Gate behavior",
    "messaging",
    "new REX runtime behavior",
    "NOL/DRI direct orchestration",
    "NEX-CI:2 Cockpit Shell Runtime Binding",
    "NEX-CI:3 Executive Stage Integration",
    "NEX-CI:4 Workspace Dial & Experience Switching",
    "NEX-CI:5 Advisor & Insight Integration",
    "NEX-CI:6 Cockpit Interaction Orchestration",
    "NEX-CI:7 Timeline, Explorer & Live Lens Integration",
    "NEX-CI:8 Executive Cockpit Certification & Freeze",
    "NEX-CI:9 Executive Cockpit Public Index",
  ] as const);

// ─── Validation helpers ─────────────────────────────────────────────────────

export function isExecutiveCockpitSurface(
  value: unknown,
): value is ExecutiveCockpitSurface {
  return (EXECUTIVE_COCKPIT_SURFACES as readonly unknown[]).includes(value);
}

export function isExecutiveCockpitIntegrationRole(
  value: unknown,
): value is ExecutiveCockpitIntegrationRole {
  return (
    EXECUTIVE_COCKPIT_INTEGRATION_ROLES as readonly unknown[]
  ).includes(value);
}

export function isExecutiveCockpitIntegrationStatus(
  value: unknown,
): value is ExecutiveCockpitIntegrationStatus {
  return (
    EXECUTIVE_COCKPIT_INTEGRATION_STATUSES as readonly unknown[]
  ).includes(value);
}

export function isExecutiveCockpitIntegrationCapability(
  value: unknown,
): value is ExecutiveCockpitIntegrationCapability {
  return (
    EXECUTIVE_COCKPIT_INTEGRATION_CAPABILITIES as readonly unknown[]
  ).includes(value);
}

export function isExecutiveCockpitPresentationState(
  value: unknown,
): value is ExecutiveCockpitPresentationState {
  return (
    EXECUTIVE_COCKPIT_PRESENTATION_STATES as readonly unknown[]
  ).includes(value);
}

export function isExecutiveCockpitSubjectKind(
  value: unknown,
): value is ExecutiveCockpitSubjectKind {
  return (
    EXECUTIVE_COCKPIT_SUBJECT_KINDS as readonly unknown[]
  ).includes(value);
}

function requireOpaqueId(value: string, field: string): void {
  if (typeof value !== "string" || value.length === 0) {
    throw new TypeError(`${field} must be a non-empty opaque identifier`);
  }
}

function createSubjectReference(
  input: ExecutiveCockpitSubjectReference,
  field: string,
): ExecutiveCockpitSubjectReference {
  requireOpaqueId(input.id, `${field}.id`);
  if (!isExecutiveCockpitSubjectKind(input.kind)) {
    throw new TypeError(
      `${field}.kind must be a known executive cockpit subject kind`,
    );
  }
  return Object.freeze({
    id: input.id,
    kind: input.kind,
  });
}

// ─── Foundation APIs ────────────────────────────────────────────────────────

export function getExecutiveCockpitIntegrationFoundationIdentity():
  typeof executiveCockpitIntegrationFoundationCanonicalIdentity {
  return executiveCockpitIntegrationFoundationCanonicalIdentity;
}

export function getExecutiveCockpitSurfaces(): ReadonlyArray<
  ExecutiveCockpitSurface
> {
  return EXECUTIVE_COCKPIT_SURFACES;
}

export function getExecutiveCockpitIntegrationRoles(): ReadonlyArray<
  ExecutiveCockpitIntegrationRole
> {
  return EXECUTIVE_COCKPIT_INTEGRATION_ROLES;
}

export function getExecutiveCockpitIntegrationStatuses(): ReadonlyArray<
  ExecutiveCockpitIntegrationStatus
> {
  return EXECUTIVE_COCKPIT_INTEGRATION_STATUSES;
}

export function getExecutiveCockpitIntegrationCapabilities(): ReadonlyArray<
  ExecutiveCockpitIntegrationCapability
> {
  return EXECUTIVE_COCKPIT_INTEGRATION_CAPABILITIES;
}

export function getExecutiveCockpitSubjectKinds(): ReadonlyArray<
  ExecutiveCockpitSubjectKind
> {
  return EXECUTIVE_COCKPIT_SUBJECT_KINDS;
}

export function getExecutiveCockpitPresentationStates(): ReadonlyArray<
  ExecutiveCockpitPresentationState
> {
  return EXECUTIVE_COCKPIT_PRESENTATION_STATES;
}

export function getExecutiveCockpitSurfaceBindings(): ReadonlyArray<
  ExecutiveCockpitSurfaceBinding
> {
  return EXECUTIVE_COCKPIT_SURFACE_BINDINGS;
}

export function getExecutiveCockpitSurfaceBinding(
  surface: ExecutiveCockpitSurface,
): ExecutiveCockpitSurfaceBinding {
  if (!isExecutiveCockpitSurface(surface)) {
    throw new TypeError(
      "surface must be a known executive cockpit surface",
    );
  }
  const binding = EXECUTIVE_COCKPIT_SURFACE_BINDINGS.find(
    (entry) => entry.surface === surface,
  );
  if (binding === undefined) {
    throw new TypeError(
      `no canonical binding exists for surface: ${String(surface)}`,
    );
  }
  return binding;
}

export function getExecutiveCockpitSurfaceDefaultRole(
  surface: ExecutiveCockpitSurface,
): ExecutiveCockpitIntegrationRole {
  if (!isExecutiveCockpitSurface(surface)) {
    throw new TypeError(
      "surface must be a known executive cockpit surface",
    );
  }
  return EXECUTIVE_COCKPIT_SURFACE_DEFAULT_ROLES[surface];
}

export function createExecutiveCockpitIntegrationContext(
  input: ExecutiveCockpitIntegrationContextInput,
): ExecutiveCockpitIntegrationContext {
  if (!isExecutiveCockpitSurface(input.activeSurface)) {
    throw new TypeError(
      "activeSurface must be a known executive cockpit surface",
    );
  }
  if (
    input.presentationState !== undefined &&
    !isExecutiveCockpitPresentationState(input.presentationState)
  ) {
    throw new TypeError(
      "presentationState must be a known executive presentation state",
    );
  }
  if (input.workspaceId !== undefined) {
    requireOpaqueId(input.workspaceId, "workspaceId");
  }
  if (input.modelId !== undefined) {
    requireOpaqueId(input.modelId, "modelId");
  }
  if (input.selectedSubjectId !== undefined) {
    requireOpaqueId(input.selectedSubjectId, "selectedSubjectId");
  }
  if (input.focusedSubjectId !== undefined) {
    requireOpaqueId(input.focusedSubjectId, "focusedSubjectId");
  }
  if (input.attentionSubjectId !== undefined) {
    requireOpaqueId(input.attentionSubjectId, "attentionSubjectId");
  }

  return Object.freeze({
    activeSurface: input.activeSurface,
    runtimeSource: EXECUTIVE_COCKPIT_INTEGRATION_RUNTIME_SOURCE,
    foundationIdentity: executiveCockpitIntegrationFoundationIdentity,
    foundationVersion: executiveCockpitIntegrationFoundationVersion,
    ...(input.workspaceId !== undefined
      ? { workspaceId: input.workspaceId }
      : {}),
    ...(input.modelId !== undefined ? { modelId: input.modelId } : {}),
    ...(input.activeWorkspace !== undefined
      ? { activeWorkspace: input.activeWorkspace }
      : {}),
    ...(input.selectedSubjectId !== undefined
      ? { selectedSubjectId: input.selectedSubjectId }
      : {}),
    ...(input.focusedSubjectId !== undefined
      ? { focusedSubjectId: input.focusedSubjectId }
      : {}),
    ...(input.presentationState !== undefined
      ? { presentationState: input.presentationState }
      : {}),
    ...(input.attentionSubjectId !== undefined
      ? { attentionSubjectId: input.attentionSubjectId }
      : {}),
  });
}

export function createExecutiveCockpitIntegrationState(
  input: ExecutiveCockpitIntegrationStateInput,
): ExecutiveCockpitIntegrationState {
  if (!isExecutiveCockpitSurface(input.activeSurface)) {
    throw new TypeError(
      "activeSurface must be a known executive cockpit surface",
    );
  }
  if (!isExecutiveCockpitIntegrationStatus(input.status)) {
    throw new TypeError(
      "status must be a known executive cockpit integration status",
    );
  }
  if (
    input.presentationState !== undefined &&
    !isExecutiveCockpitPresentationState(input.presentationState)
  ) {
    throw new TypeError(
      "presentationState must be a known executive presentation state",
    );
  }
  if (input.attentionSubjectId !== undefined) {
    requireOpaqueId(input.attentionSubjectId, "attentionSubjectId");
  }

  return Object.freeze({
    activeSurface: input.activeSurface,
    status: input.status,
    foundationIdentity: executiveCockpitIntegrationFoundationIdentity,
    foundationVersion: executiveCockpitIntegrationFoundationVersion,
    ...(input.activeWorkspace !== undefined
      ? { activeWorkspace: input.activeWorkspace }
      : {}),
    ...(input.selectedSubject !== undefined
      ? {
          selectedSubject: createSubjectReference(
            input.selectedSubject,
            "selectedSubject",
          ),
        }
      : {}),
    ...(input.focusedSubject !== undefined
      ? {
          focusedSubject: createSubjectReference(
            input.focusedSubject,
            "focusedSubject",
          ),
        }
      : {}),
    ...(input.presentationState !== undefined
      ? { presentationState: input.presentationState }
      : {}),
    ...(input.attentionSubjectId !== undefined
      ? { attentionSubjectId: input.attentionSubjectId }
      : {}),
  });
}

export function createExecutiveCockpitIntegrationSnapshot(
  input: ExecutiveCockpitIntegrationSnapshotInput,
): ExecutiveCockpitIntegrationSnapshot {
  const context = createExecutiveCockpitIntegrationContext(input.context);
  const state = createExecutiveCockpitIntegrationState(input.state);

  const bindings =
    input.bindings === undefined
      ? EXECUTIVE_COCKPIT_SURFACE_BINDINGS
      : Object.freeze(
          input.bindings.map((binding) => {
            if (!isExecutiveCockpitSurface(binding.surface)) {
              throw new TypeError(
                "binding.surface must be a known executive cockpit surface",
              );
            }
            if (!isExecutiveCockpitIntegrationRole(binding.role)) {
              throw new TypeError(
                "binding.role must be a known executive cockpit integration role",
              );
            }
            if (typeof binding.enabled !== "boolean") {
              throw new TypeError("binding.enabled must be a boolean");
            }
            if (!Array.isArray(binding.capabilities)) {
              throw new TypeError("binding.capabilities must be an array");
            }
            for (const capability of binding.capabilities) {
              if (!isExecutiveCockpitIntegrationCapability(capability)) {
                throw new TypeError(
                  "binding.capabilities must contain only canonical capabilities",
                );
              }
            }
            return Object.freeze({
              surface: binding.surface,
              role: binding.role,
              enabled: binding.enabled,
              capabilities: Object.freeze([...binding.capabilities]),
            });
          }),
        );

  return Object.freeze({
    context,
    state,
    bindings,
    runtimeSource: EXECUTIVE_COCKPIT_INTEGRATION_RUNTIME_SOURCE,
    foundationIdentity: executiveCockpitIntegrationFoundationIdentity,
    foundationVersion: executiveCockpitIntegrationFoundationVersion,
  });
}

// ─── Public catalogs ────────────────────────────────────────────────────────

export const EXECUTIVE_COCKPIT_INTEGRATION_FOUNDATION_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "ExecutiveCockpitSurface",
    "ExecutiveCockpitIntegrationRole",
    "ExecutiveCockpitIntegrationStatus",
    "ExecutiveCockpitIntegrationCapability",
    "ExecutiveCockpitPresentationState",
    "ExecutiveCockpitSubjectKind",
    "ExecutiveCockpitSubjectReference",
    "ExecutiveCockpitSurfaceBinding",
    "ExecutiveCockpitIntegrationContext",
    "ExecutiveCockpitIntegrationState",
    "ExecutiveCockpitIntegrationSnapshot",
    "ExecutiveCockpitIntegrationRuntimeSource",
    "ExecutiveCockpitIntegrationFoundationGuarantee",
    "ExecutiveCockpitIntegrationFoundationVerification",
  ] as const);

export const executiveCockpitIntegrationFoundationApiNames = Object.freeze([
  "getExecutiveCockpitIntegrationFoundationIdentity",
  "getExecutiveCockpitSurfaces",
  "isExecutiveCockpitSurface",
  "getExecutiveCockpitIntegrationRoles",
  "isExecutiveCockpitIntegrationRole",
  "getExecutiveCockpitIntegrationStatuses",
  "isExecutiveCockpitIntegrationStatus",
  "getExecutiveCockpitIntegrationCapabilities",
  "isExecutiveCockpitIntegrationCapability",
  "getExecutiveCockpitSubjectKinds",
  "isExecutiveCockpitSubjectKind",
  "getExecutiveCockpitPresentationStates",
  "isExecutiveCockpitPresentationState",
  "getExecutiveCockpitSurfaceBindings",
  "getExecutiveCockpitSurfaceBinding",
  "getExecutiveCockpitSurfaceDefaultRole",
  "createExecutiveCockpitIntegrationContext",
  "createExecutiveCockpitIntegrationState",
  "createExecutiveCockpitIntegrationSnapshot",
  "verifyExecutiveCockpitIntegrationFoundation",
] as const);

export const EXECUTIVE_COCKPIT_INTEGRATION_FOUNDATION_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "Dependency",
    "Surfaces",
    "Roles",
    "Statuses",
    "Capabilities",
    "Subjects",
    "PresentationCompatibility",
    "Bindings",
    "Context",
    "State",
    "Snapshot",
    "Guarantees",
  ] as const);

// ─── Foundation registry ────────────────────────────────────────────────────

export const executiveCockpitIntegrationFoundationRegistry = Object.freeze({
  identity: executiveCockpitIntegrationFoundationIdentity,
  version: executiveCockpitIntegrationFoundationVersion,
  namespace: executiveCockpitIntegrationFoundationNamespace,
  layer: executiveCockpitIntegrationFoundationLayer,
  phase: executiveCockpitIntegrationFoundationPhase,
  stage: executiveCockpitIntegrationFoundationStage,
  dependencyIdentity:
    executiveCockpitIntegrationFoundationDependencyIdentity,
  dependencyPath: executiveCockpitIntegrationFoundationDependencyPath,
  sections: EXECUTIVE_COCKPIT_INTEGRATION_FOUNDATION_REGISTRY_SECTIONS,
  sectionCount:
    EXECUTIVE_COCKPIT_INTEGRATION_FOUNDATION_REGISTRY_SECTIONS.length,
  Identity: Object.freeze({
    identity: executiveCockpitIntegrationFoundationIdentity,
    version: executiveCockpitIntegrationFoundationVersion,
    namespace: executiveCockpitIntegrationFoundationNamespace,
    layer: executiveCockpitIntegrationFoundationLayer,
    phase: executiveCockpitIntegrationFoundationPhase,
    stage: executiveCockpitIntegrationFoundationStage,
    architecturalRole:
      executiveCockpitIntegrationFoundationArchitecturalRole,
  }),
  Dependency: Object.freeze({
    soleImmediateDependency:
      executiveCockpitIntegrationFoundationDependencyIdentity,
    dependencyPath: executiveCockpitIntegrationFoundationDependencyPath,
    approvedUpstreamDependencies:
      EXECUTIVE_COCKPIT_INTEGRATION_APPROVED_UPSTREAM_DEPENDENCIES,
    runtimeSource: EXECUTIVE_COCKPIT_INTEGRATION_RUNTIME_SOURCE,
    consumesPublicIndexOnly: true as const,
  }),
  Surfaces: Object.freeze({
    surfaces: EXECUTIVE_COCKPIT_SURFACES,
    surfaceCount: EXECUTIVE_COCKPIT_SURFACES.length,
  }),
  Roles: Object.freeze({
    roles: EXECUTIVE_COCKPIT_INTEGRATION_ROLES,
    roleCount: EXECUTIVE_COCKPIT_INTEGRATION_ROLES.length,
    defaultRoles: EXECUTIVE_COCKPIT_SURFACE_DEFAULT_ROLES,
  }),
  Statuses: Object.freeze({
    statuses: EXECUTIVE_COCKPIT_INTEGRATION_STATUSES,
    statusCount: EXECUTIVE_COCKPIT_INTEGRATION_STATUSES.length,
  }),
  Capabilities: Object.freeze({
    capabilities: EXECUTIVE_COCKPIT_INTEGRATION_CAPABILITIES,
    capabilityCount: EXECUTIVE_COCKPIT_INTEGRATION_CAPABILITIES.length,
  }),
  Subjects: Object.freeze({
    subjectKinds: EXECUTIVE_COCKPIT_SUBJECT_KINDS,
    subjectKindCount: EXECUTIVE_COCKPIT_SUBJECT_KINDS.length,
    semantics: EXECUTIVE_COCKPIT_SUBJECT_KIND_SEMANTICS,
    rexFrozenSubjectKinds:
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_SUBJECT_KINDS,
  }),
  PresentationCompatibility: Object.freeze({
    presentationStates: EXECUTIVE_COCKPIT_PRESENTATION_STATES,
    presentationStateCount: EXECUTIVE_COCKPIT_PRESENTATION_STATES.length,
    reusedFrom:
      "REX-1:9/RuntimeEnabledExecutiveExperiencePublicIndex" as const,
    reusedExport:
      "RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_PRESENTATION_STATES" as const,
    competingPresentationModel: false as const,
  }),
  Bindings: Object.freeze({
    bindings: EXECUTIVE_COCKPIT_SURFACE_BINDINGS,
    bindingCount: EXECUTIVE_COCKPIT_SURFACE_BINDINGS.length,
    oneBindingPerSurface: true as const,
  }),
  Context: Object.freeze({
    contractName: "ExecutiveCockpitIntegrationContext" as const,
    frameworkNeutral: true as const,
    serializable: true as const,
    allowsCallbacks: false as const,
    allowsReactNodes: false as const,
    allowsThreeJsObjects: false as const,
    allowsDomReferences: false as const,
  }),
  State: Object.freeze({
    contractName: "ExecutiveCockpitIntegrationState" as const,
    frameworkNeutral: true as const,
    introducesReactHooks: false as const,
    introducesZustandOrRedux: false as const,
    introducesBrowserState: false as const,
    introducesThreeJsState: false as const,
  }),
  Snapshot: Object.freeze({
    contractName: "ExecutiveCockpitIntegrationSnapshot" as const,
    dataOnly: true as const,
    allowsReactElements: false as const,
    allowsCallbacks: false as const,
    allowsThreeJsObjects: false as const,
    allowsDomReferences: false as const,
  }),
  Guarantees: Object.freeze({
    guarantees: EXECUTIVE_COCKPIT_INTEGRATION_FOUNDATION_GUARANTEES,
    guaranteeCount:
      EXECUTIVE_COCKPIT_INTEGRATION_FOUNDATION_GUARANTEES.length,
    forbiddenResponsibilities:
      EXECUTIVE_COCKPIT_INTEGRATION_FORBIDDEN_RESPONSIBILITIES,
    forbiddenResponsibilityCount:
      EXECUTIVE_COCKPIT_INTEGRATION_FORBIDDEN_RESPONSIBILITIES.length,
  }),
  surfaceCount: EXECUTIVE_COCKPIT_SURFACES.length,
  roleCount: EXECUTIVE_COCKPIT_INTEGRATION_ROLES.length,
  statusCount: EXECUTIVE_COCKPIT_INTEGRATION_STATUSES.length,
  capabilityCount: EXECUTIVE_COCKPIT_INTEGRATION_CAPABILITIES.length,
  subjectKindCount: EXECUTIVE_COCKPIT_SUBJECT_KINDS.length,
  presentationStateCount: EXECUTIVE_COCKPIT_PRESENTATION_STATES.length,
  bindingCount: EXECUTIVE_COCKPIT_SURFACE_BINDINGS.length,
  guaranteeCount: EXECUTIVE_COCKPIT_INTEGRATION_FOUNDATION_GUARANTEES.length,
  publicTypeCount:
    EXECUTIVE_COCKPIT_INTEGRATION_FOUNDATION_PUBLIC_TYPE_NAMES.length,
  publicApiCount: executiveCockpitIntegrationFoundationApiNames.length,
});

export const executiveCockpitIntegrationFoundation = Object.freeze({
  phase: "Foundation" as const,
  name: "ExecutiveCockpitIntegrationFoundation" as const,
  identity: executiveCockpitIntegrationFoundationIdentity,
  version: executiveCockpitIntegrationFoundationVersion,
  namespace: executiveCockpitIntegrationFoundationNamespace,
  layer: executiveCockpitIntegrationFoundationLayer,
  stage: executiveCockpitIntegrationFoundationStage,
  architecturalRole:
    executiveCockpitIntegrationFoundationArchitecturalRole,
  role: "Foundation" as const,
  status: executiveCockpitIntegrationFoundationStability,
  upstreamDependency:
    executiveCockpitIntegrationFoundationDependencyIdentity,
  dependencyPath: executiveCockpitIntegrationFoundationDependencyPath,
  deterministic: executiveCockpitIntegrationFoundationDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  browserIndependent: true as const,
  foundation: true as const,
  principle: EXECUTIVE_COCKPIT_INTEGRATION_PRINCIPLE,
  boundary: EXECUTIVE_COCKPIT_INTEGRATION_BOUNDARY,
  runtimeSource: EXECUTIVE_COCKPIT_INTEGRATION_RUNTIME_SOURCE,
  surfaces: EXECUTIVE_COCKPIT_SURFACES,
  roles: EXECUTIVE_COCKPIT_INTEGRATION_ROLES,
  statuses: EXECUTIVE_COCKPIT_INTEGRATION_STATUSES,
  capabilities: EXECUTIVE_COCKPIT_INTEGRATION_CAPABILITIES,
  subjectKinds: EXECUTIVE_COCKPIT_SUBJECT_KINDS,
  presentationStates: EXECUTIVE_COCKPIT_PRESENTATION_STATES,
  bindings: EXECUTIVE_COCKPIT_SURFACE_BINDINGS,
  guarantees: EXECUTIVE_COCKPIT_INTEGRATION_FOUNDATION_GUARANTEES,
  forbiddenResponsibilities:
    EXECUTIVE_COCKPIT_INTEGRATION_FORBIDDEN_RESPONSIBILITIES,
  publicApiSurface: executiveCockpitIntegrationFoundationApiNames,
  publicTypes: EXECUTIVE_COCKPIT_INTEGRATION_FOUNDATION_PUBLIC_TYPE_NAMES,
  registry: executiveCockpitIntegrationFoundationRegistry,
  rexBoundary: "REX-1:9-public-index-only" as const,
  architecturalStatus:
    "Foundation Complete · Deterministic · Immutable · Framework-Independent · ReadyForCockpitShellBinding" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface ExecutiveCockpitIntegrationFoundationVerification {
  readonly ok: boolean;
  readonly identity: typeof executiveCockpitIntegrationFoundationIdentity;
  readonly version: typeof executiveCockpitIntegrationFoundationVersion;
  readonly namespace: typeof executiveCockpitIntegrationFoundationNamespace;
  readonly layer: typeof executiveCockpitIntegrationFoundationLayer;
  readonly phase: typeof executiveCockpitIntegrationFoundationPhase;
  readonly stage: typeof executiveCockpitIntegrationFoundationStage;
  readonly architecturalRole: typeof executiveCockpitIntegrationFoundationArchitecturalRole;
  readonly dependencyIdentity: typeof executiveCockpitIntegrationFoundationDependencyIdentity;
  readonly surfaceCount: number;
  readonly roleCount: number;
  readonly statusCount: number;
  readonly capabilityCount: number;
  readonly subjectKindCount: number;
  readonly presentationStateCount: number;
  readonly bindingCount: number;
  readonly guaranteeCount: number;
  readonly registrySectionCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly invariantCount: number;
  readonly frozen: boolean;
  readonly rexBoundaryIntact: boolean;
  readonly frameworkIndependent: boolean;
  readonly presentationStatesValid: boolean;
  readonly bindingsComplete: boolean;
  readonly stageIsPrimary: boolean;
  readonly workspaceDialIsControl: boolean;
  readonly advisorInsightSeparate: boolean;
  readonly guaranteesPresent: boolean;
  readonly runtimeSourceValid: boolean;
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

export function verifyExecutiveCockpitIntegrationFoundation():
  ExecutiveCockpitIntegrationFoundationVerification {
  const foundation = executiveCockpitIntegrationFoundation;
  const registry = executiveCockpitIntegrationFoundationRegistry;

  const identityOk =
    foundation.identity ===
      "NEX-CI:1/ExecutiveCockpitIntegrationFoundation" &&
    foundation.version === "1.1.0" &&
    foundation.namespace ===
      "nexora.executive.cockpit.integration.foundation" &&
    foundation.layer === "NEX-CI" &&
    foundation.phase === "Foundation" &&
    foundation.stage === "Foundation" &&
    foundation.architecturalRole ===
      "ExecutiveCockpitIntegrationFoundation" &&
    foundation.role === "Foundation" &&
    foundation.status === "FoundationReady" &&
    foundation.upstreamDependency ===
      "REX-1:9/RuntimeEnabledExecutiveExperiencePublicIndex" &&
    foundation.upstreamDependency ===
      runtimeEnabledExecutiveExperiencePublicIndexIdentity &&
    registry.dependencyIdentity === foundation.upstreamDependency &&
    foundation.rexBoundary === "REX-1:9-public-index-only";

  const dependencyOk =
    foundation.dependencyPath ===
      "@/app/lib/rex/runtimeEnabledExecutiveExperiencePublicIndex" &&
    EXECUTIVE_COCKPIT_INTEGRATION_BOUNDARY.consumesPublicIndexOnly ===
      true &&
    EXECUTIVE_COCKPIT_INTEGRATION_BOUNDARY.soleImmediateDependency ===
      "REX-1:9/RuntimeEnabledExecutiveExperiencePublicIndex" &&
    EXECUTIVE_COCKPIT_INTEGRATION_BOUNDARY.bypassesRexIntoExDri === false &&
    EXECUTIVE_COCKPIT_INTEGRATION_BOUNDARY.bypassesExDriIntoDri === false &&
    EXECUTIVE_COCKPIT_INTEGRATION_BOUNDARY.bypassesDriIntoNol === false &&
    EXECUTIVE_COCKPIT_INTEGRATION_BOUNDARY.orchestratesRexInternals ===
      false &&
    EXECUTIVE_COCKPIT_INTEGRATION_BOUNDARY.orchestratesDriInternals ===
      false &&
    EXECUTIVE_COCKPIT_INTEGRATION_BOUNDARY.orchestratesNolInternals ===
      false &&
    EXECUTIVE_COCKPIT_INTEGRATION_BOUNDARY.implementsLaterNexCiPhases ===
      false &&
    EXECUTIVE_COCKPIT_INTEGRATION_APPROVED_UPSTREAM_DEPENDENCIES.length ===
      3;

  const orderingOk =
    exactOrder(EXECUTIVE_COCKPIT_SURFACES, [
      "stage",
      "advisor",
      "insight",
      "timeline",
      "explorer",
      "live-lens",
      "workspace-dial",
      "context-bar",
      "navigation",
      "status",
    ]) &&
    exactOrder(EXECUTIVE_COCKPIT_INTEGRATION_ROLES, [
      "primary",
      "supporting",
      "contextual",
      "navigation",
      "control",
      "status",
    ]) &&
    exactOrder(EXECUTIVE_COCKPIT_INTEGRATION_STATUSES, [
      "idle",
      "ready",
      "active",
      "transitioning",
      "unavailable",
    ]) &&
    exactOrder(EXECUTIVE_COCKPIT_INTEGRATION_CAPABILITIES, [
      "surface-coordination",
      "runtime-state-consumption",
      "focus-propagation",
      "selection-propagation",
      "presentation-state-propagation",
      "attention-propagation",
      "workspace-coordination",
      "executive-subject-coordination",
      "interaction-readiness",
    ]) &&
    exactOrder(EXECUTIVE_COCKPIT_SUBJECT_KINDS, [
      "goal",
      "object",
      "problem",
      "scenario",
      "decision",
      "execution",
      "kpi",
      "koi",
      "pack",
      "insight",
      "guidance",
    ]) &&
    exactOrder(EXECUTIVE_COCKPIT_PRESENTATION_STATES, [
      "minimum",
      "report",
      "operation",
    ]) &&
    exactOrder(
      EXECUTIVE_COCKPIT_SURFACE_BINDINGS.map((binding) => binding.surface),
      [...EXECUTIVE_COCKPIT_SURFACES],
    ) &&
    exactOrder(
      [
        ...EXECUTIVE_COCKPIT_INTEGRATION_FOUNDATION_REGISTRY_SECTIONS,
      ],
      [
        "Identity",
        "Dependency",
        "Surfaces",
        "Roles",
        "Statuses",
        "Capabilities",
        "Subjects",
        "PresentationCompatibility",
        "Bindings",
        "Context",
        "State",
        "Snapshot",
        "Guarantees",
      ],
    );

  const uniquenessOk =
    unique([...EXECUTIVE_COCKPIT_SURFACES]) &&
    unique([...EXECUTIVE_COCKPIT_INTEGRATION_ROLES]) &&
    unique([...EXECUTIVE_COCKPIT_INTEGRATION_STATUSES]) &&
    unique([...EXECUTIVE_COCKPIT_INTEGRATION_CAPABILITIES]) &&
    unique([...EXECUTIVE_COCKPIT_SUBJECT_KINDS]) &&
    unique([...EXECUTIVE_COCKPIT_PRESENTATION_STATES]) &&
    unique(
      EXECUTIVE_COCKPIT_SURFACE_BINDINGS.map((binding) => binding.surface),
    ) &&
    unique(
      EXECUTIVE_COCKPIT_INTEGRATION_FOUNDATION_GUARANTEES.map(
        (entry) => entry.id,
      ),
    ) &&
    unique([
      ...EXECUTIVE_COCKPIT_INTEGRATION_FOUNDATION_REGISTRY_SECTIONS,
    ]);

  const presentationStatesValid =
    exactOrder(EXECUTIVE_COCKPIT_PRESENTATION_STATES, [
      "minimum",
      "report",
      "operation",
    ]) &&
    EXECUTIVE_COCKPIT_PRESENTATION_STATES ===
      RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_PRESENTATION_STATES &&
    registry.PresentationCompatibility.competingPresentationModel === false;

  const rexSubjectReuseOk =
    exactOrder(
      EXECUTIVE_COCKPIT_SUBJECT_KINDS.slice(
        0,
        RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_SUBJECT_KINDS.length,
      ),
      [...RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_SUBJECT_KINDS],
    ) &&
    EXECUTIVE_COCKPIT_SUBJECT_KIND_SEMANTICS.reusesRexFrozenSubjectKinds ===
      true &&
    EXECUTIVE_COCKPIT_SUBJECT_KIND_SEMANTICS.competingSubjectModel ===
      false &&
    EXECUTIVE_COCKPIT_SUBJECT_KIND_SEMANTICS.implementsDomainBehavior ===
      false;

  const bindingsComplete =
    EXECUTIVE_COCKPIT_SURFACE_BINDINGS.length ===
      EXECUTIVE_COCKPIT_SURFACES.length &&
    EXECUTIVE_COCKPIT_SURFACE_BINDINGS.every((binding, index) => {
      const surface = EXECUTIVE_COCKPIT_SURFACES[index];
      return (
        binding.surface === surface &&
        binding.role === EXECUTIVE_COCKPIT_SURFACE_DEFAULT_ROLES[surface] &&
        binding.enabled === true &&
        isExecutiveCockpitIntegrationRole(binding.role) &&
        binding.capabilities.length > 0 &&
        binding.capabilities.every((capability) =>
          isExecutiveCockpitIntegrationCapability(capability),
        ) &&
        unique([...binding.capabilities]) &&
        Object.isFrozen(binding) &&
        Object.isFrozen(binding.capabilities)
      );
    });

  const stageIsPrimary =
    getExecutiveCockpitSurfaceBinding("stage").role === "primary" &&
    EXECUTIVE_COCKPIT_SURFACE_DEFAULT_ROLES.stage === "primary";

  const workspaceDialIsControl =
    getExecutiveCockpitSurfaceBinding("workspace-dial").role === "control" &&
    EXECUTIVE_COCKPIT_SURFACE_DEFAULT_ROLES["workspace-dial"] === "control";

  const advisorInsightSeparate =
    EXECUTIVE_COCKPIT_SURFACES.includes("advisor") &&
    EXECUTIVE_COCKPIT_SURFACES.includes("insight") &&
    getExecutiveCockpitSurfaceBinding("advisor").surface === "advisor" &&
    getExecutiveCockpitSurfaceBinding("insight").surface === "insight" &&
    getExecutiveCockpitSurfaceBinding("advisor").role === "supporting" &&
    getExecutiveCockpitSurfaceBinding("insight").role === "supporting";

  const guaranteesPresent =
    EXECUTIVE_COCKPIT_INTEGRATION_FOUNDATION_GUARANTEES.length === 15 &&
    exactOrder(
      EXECUTIVE_COCKPIT_INTEGRATION_FOUNDATION_GUARANTEES.map(
        (entry) => entry.id,
      ),
      [
        "cockpit-surfaces-uniquely-defined",
        "one-binding-per-surface",
        "binding-roles-valid",
        "binding-capabilities-canonical",
        "stage-is-primary-visual-surface",
        "workspace-dial-is-control-surface",
        "advisor-insight-remain-separate",
        "presentation-state-reuses-rex",
        "no-react-dependency",
        "no-threejs-dependency",
        "no-rendering",
        "no-network-access",
        "no-persistence",
        "no-direct-nol-dri-orchestration",
        "deterministic-side-effect-free",
      ],
    ) &&
    EXECUTIVE_COCKPIT_INTEGRATION_FOUNDATION_GUARANTEES.every(
      (entry, index) => entry.order === index + 1,
    );

  const runtimeSourceValid =
    EXECUTIVE_COCKPIT_INTEGRATION_RUNTIME_SOURCE.relationship ===
      "REX → NEX-CI" &&
    EXECUTIVE_COCKPIT_INTEGRATION_RUNTIME_SOURCE.authorityIdentity ===
      runtimeEnabledExecutiveExperiencePublicIndexIdentity &&
    EXECUTIVE_COCKPIT_INTEGRATION_RUNTIME_SOURCE.nexCiIsRuntimeOwner ===
      false &&
    EXECUTIVE_COCKPIT_INTEGRATION_RUNTIME_SOURCE.nexCiIsIntegrationConsumer ===
      true;

  const registryIntegrityOk =
    registry.surfaceCount === EXECUTIVE_COCKPIT_SURFACES.length &&
    registry.roleCount === EXECUTIVE_COCKPIT_INTEGRATION_ROLES.length &&
    registry.statusCount === EXECUTIVE_COCKPIT_INTEGRATION_STATUSES.length &&
    registry.capabilityCount ===
      EXECUTIVE_COCKPIT_INTEGRATION_CAPABILITIES.length &&
    registry.subjectKindCount === EXECUTIVE_COCKPIT_SUBJECT_KINDS.length &&
    registry.presentationStateCount ===
      EXECUTIVE_COCKPIT_PRESENTATION_STATES.length &&
    registry.bindingCount === EXECUTIVE_COCKPIT_SURFACE_BINDINGS.length &&
    registry.guaranteeCount ===
      EXECUTIVE_COCKPIT_INTEGRATION_FOUNDATION_GUARANTEES.length &&
    registry.sectionCount ===
      EXECUTIVE_COCKPIT_INTEGRATION_FOUNDATION_REGISTRY_SECTIONS.length &&
    registry.publicTypeCount ===
      EXECUTIVE_COCKPIT_INTEGRATION_FOUNDATION_PUBLIC_TYPE_NAMES.length &&
    registry.publicApiCount ===
      executiveCockpitIntegrationFoundationApiNames.length;

  const immutabilityOk =
    Object.isFrozen(foundation) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(
      executiveCockpitIntegrationFoundationCanonicalIdentity,
    ) &&
    Object.isFrozen(EXECUTIVE_COCKPIT_SURFACES) &&
    Object.isFrozen(EXECUTIVE_COCKPIT_INTEGRATION_ROLES) &&
    Object.isFrozen(EXECUTIVE_COCKPIT_INTEGRATION_STATUSES) &&
    Object.isFrozen(EXECUTIVE_COCKPIT_INTEGRATION_CAPABILITIES) &&
    Object.isFrozen(EXECUTIVE_COCKPIT_SUBJECT_KINDS) &&
    Object.isFrozen(EXECUTIVE_COCKPIT_PRESENTATION_STATES) &&
    Object.isFrozen(EXECUTIVE_COCKPIT_SURFACE_BINDINGS) &&
    Object.isFrozen(EXECUTIVE_COCKPIT_SURFACE_DEFAULT_ROLES) &&
    Object.isFrozen(EXECUTIVE_COCKPIT_INTEGRATION_RUNTIME_SOURCE) &&
    Object.isFrozen(EXECUTIVE_COCKPIT_INTEGRATION_FOUNDATION_GUARANTEES) &&
    Object.isFrozen(EXECUTIVE_COCKPIT_INTEGRATION_BOUNDARY) &&
    Object.isFrozen(
      EXECUTIVE_COCKPIT_INTEGRATION_FOUNDATION_REGISTRY_SECTIONS,
    ) &&
    Object.isFrozen(EXECUTIVE_COCKPIT_SUBJECT_KIND_SEMANTICS) &&
    Object.isFrozen(
      EXECUTIVE_COCKPIT_INTEGRATION_APPROVED_UPSTREAM_DEPENDENCIES,
    );

  const rexBoundaryIntact =
    foundation.upstreamDependency ===
      "REX-1:9/RuntimeEnabledExecutiveExperiencePublicIndex" &&
    foundation.boundary.soleImmediateDependency ===
      "REX-1:9/RuntimeEnabledExecutiveExperiencePublicIndex" &&
    foundation.boundary.consumesPublicIndexOnly === true &&
    foundation.boundary.orchestratesRexInternals === false &&
    foundation.boundary.ownsRendering === false &&
    foundation.boundary.ownsPresentationResolution === false;

  const frameworkIndependent =
    foundation.frameworkIndependent === true &&
    foundation.rendererIndependent === true &&
    foundation.browserIndependent === true &&
    foundation.boundary.frameworkIndependent === true &&
    foundation.boundary.introducesUiComponents === false &&
    foundation.boundary.introducesThreeJs === false;

  const invariantCount = 15;

  const ok =
    identityOk &&
    dependencyOk &&
    orderingOk &&
    uniquenessOk &&
    presentationStatesValid &&
    rexSubjectReuseOk &&
    bindingsComplete &&
    stageIsPrimary &&
    workspaceDialIsControl &&
    advisorInsightSeparate &&
    guaranteesPresent &&
    runtimeSourceValid &&
    registryIntegrityOk &&
    immutabilityOk &&
    rexBoundaryIntact &&
    frameworkIndependent &&
    foundation.principle === EXECUTIVE_COCKPIT_INTEGRATION_PRINCIPLE;

  return Object.freeze({
    ok,
    identity: executiveCockpitIntegrationFoundationIdentity,
    version: executiveCockpitIntegrationFoundationVersion,
    namespace: executiveCockpitIntegrationFoundationNamespace,
    layer: executiveCockpitIntegrationFoundationLayer,
    phase: executiveCockpitIntegrationFoundationPhase,
    stage: executiveCockpitIntegrationFoundationStage,
    architecturalRole:
      executiveCockpitIntegrationFoundationArchitecturalRole,
    dependencyIdentity:
      executiveCockpitIntegrationFoundationDependencyIdentity,
    surfaceCount: EXECUTIVE_COCKPIT_SURFACES.length,
    roleCount: EXECUTIVE_COCKPIT_INTEGRATION_ROLES.length,
    statusCount: EXECUTIVE_COCKPIT_INTEGRATION_STATUSES.length,
    capabilityCount: EXECUTIVE_COCKPIT_INTEGRATION_CAPABILITIES.length,
    subjectKindCount: EXECUTIVE_COCKPIT_SUBJECT_KINDS.length,
    presentationStateCount: EXECUTIVE_COCKPIT_PRESENTATION_STATES.length,
    bindingCount: EXECUTIVE_COCKPIT_SURFACE_BINDINGS.length,
    guaranteeCount:
      EXECUTIVE_COCKPIT_INTEGRATION_FOUNDATION_GUARANTEES.length,
    registrySectionCount:
      EXECUTIVE_COCKPIT_INTEGRATION_FOUNDATION_REGISTRY_SECTIONS.length,
    publicTypeCount:
      EXECUTIVE_COCKPIT_INTEGRATION_FOUNDATION_PUBLIC_TYPE_NAMES.length,
    publicApiCount: executiveCockpitIntegrationFoundationApiNames.length,
    invariantCount,
    frozen: immutabilityOk,
    rexBoundaryIntact,
    frameworkIndependent,
    presentationStatesValid,
    bindingsComplete,
    stageIsPrimary,
    workspaceDialIsControl,
    advisorInsightSeparate,
    guaranteesPresent,
    runtimeSourceValid,
  });
}
