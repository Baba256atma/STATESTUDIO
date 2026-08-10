/**
 * NEX-MVP:1 — Nexora MVP Application Foundation.
 *
 * Canonical application composition root for the Nexora MVP Executive
 * Decision Environment. UI-consumable: no Node / NEX-CI runtime imports.
 *
 * Canonical flow:
 *   NOL → DRI → EX-DRI → REX → NEX-CI → NEX-MVP → React / Stage / UI
 *
 * Upstream NEX-CI:9 verification lives in nexoraMVPUpstreamIntegration.ts
 * so React clients can import this foundation without pulling Node fs.
 *
 * NEX-MVP:1 is composition metadata and contracts only — no React,
 * Three.js, rendering, persistence, network, or later NEX-MVP phases.
 */

// ─── Identity ───────────────────────────────────────────────────────────────

export const nexoraMVPApplicationFoundationIdentity =
  "NEX-MVP:1/NexoraMVPApplicationFoundation" as const;

export const nexoraMVPApplicationFoundationVersion = "1.1.0" as const;

export const nexoraMVPApplicationFoundationNamespace =
  "nexora.mvp.application.foundation" as const;

export const nexoraMVPApplicationFoundationPhase =
  "ApplicationFoundation" as const;

export const nexoraMVPApplicationFoundationArchitecturalRole =
  "MVPApplicationCompositionRoot" as const;

/** Declared NEX-CI:9 dependency identity (verified via nexoraMVPUpstreamIntegration). */
export const nexoraMVPApplicationFoundationUpstreamIdentity =
  "NEX-CI:9/ExecutiveCockpitIntegrationPublicIndex" as const;

export const nexoraMVPApplicationFoundationUpstreamImportPath =
  "@/app/lib/nex-ci/executiveCockpitIntegrationPublicIndex" as const;

export const nexoraMVPApplicationFoundationReadiness =
  "ReadyForExecutiveShell" as const;

export type NexoraMVPApplicationIdentity = {
  readonly id: typeof nexoraMVPApplicationFoundationIdentity;
  readonly version: typeof nexoraMVPApplicationFoundationVersion;
  readonly namespace: typeof nexoraMVPApplicationFoundationNamespace;
  readonly phase: typeof nexoraMVPApplicationFoundationPhase;
  readonly architecturalRole: typeof nexoraMVPApplicationFoundationArchitecturalRole;
};

const NEXORA_MVP_APPLICATION_IDENTITY: NexoraMVPApplicationIdentity =
  Object.freeze({
    id: nexoraMVPApplicationFoundationIdentity,
    version: nexoraMVPApplicationFoundationVersion,
    namespace: nexoraMVPApplicationFoundationNamespace,
    phase: nexoraMVPApplicationFoundationPhase,
    architecturalRole: nexoraMVPApplicationFoundationArchitecturalRole,
  });

export function getNexoraMVPApplicationIdentity(): NexoraMVPApplicationIdentity {
  return NEXORA_MVP_APPLICATION_IDENTITY;
}

// ─── Boundary ───────────────────────────────────────────────────────────────

export const NEXORA_MVP_APPLICATION_FOUNDATION_BOUNDARY = Object.freeze({
  nexMvpAuthority: "Nexora-MVP-Application-Composition" as const,
  architecturalRole: nexoraMVPApplicationFoundationArchitecturalRole,
  soleImmediateDependency: nexoraMVPApplicationFoundationUpstreamIdentity,
  upstreamImportPath: nexoraMVPApplicationFoundationUpstreamImportPath,
  consumesNexCiPublicIndexOnly: true as const,
  bypassesNexCiIntoRex: false as const,
  bypassesRexIntoExDri: false as const,
  bypassesExDriIntoDri: false as const,
  bypassesDriIntoNol: false as const,
  ownsRendering: false as const,
  ownsReactState: false as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  introducesReact: false as const,
  introducesThreeJs: false as const,
  introducesReactThreeFiber: false as const,
  introducesUiComponents: false as const,
  implementsLaterNexMvpPhases: false as const,
});

// ─── Surfaces ───────────────────────────────────────────────────────────────

/**
 * Canonical MVP application surfaces.
 * Application composition surfaces — not independent runtime engines.
 */
export const NEXORA_MVP_SURFACES = Object.freeze([
  "shell",
  "context",
  "stage",
  "advisor",
  "insight",
  "timeline",
  "explorer",
  "status",
  "floating-panel",
] as const);

export type NexoraMVPSurface = (typeof NEXORA_MVP_SURFACES)[number];

export const NEXORA_MVP_SURFACE_ROLES = Object.freeze([
  "primary",
  "supporting",
  "navigation",
  "overlay",
  "system",
] as const);

export type NexoraMVPSurfaceRole = (typeof NEXORA_MVP_SURFACE_ROLES)[number];

/**
 * Stage is the dominant executive interaction surface.
 * Encoded as metadata — not CSS or rendering policy.
 */
export const NEXORA_MVP_SURFACE_ROLE_MAP = Object.freeze({
  stage: "primary",
  advisor: "supporting",
  insight: "supporting",
  timeline: "supporting",
  context: "navigation",
  explorer: "navigation",
  "floating-panel": "overlay",
  status: "system",
  shell: "system",
} as const satisfies Record<NexoraMVPSurface, NexoraMVPSurfaceRole>);

export const NEXORA_MVP_PRIMARY_SURFACE = "stage" as const satisfies NexoraMVPSurface;

export interface NexoraMVPSurfaceDescriptor {
  readonly id: NexoraMVPSurface;
  readonly role: NexoraMVPSurfaceRole;
  readonly order: number;
}

export const NEXORA_MVP_SURFACE_REGISTRY = Object.freeze(
  NEXORA_MVP_SURFACES.map((id, order) =>
    Object.freeze({
      id,
      role: NEXORA_MVP_SURFACE_ROLE_MAP[id],
      order,
    }),
  ),
);

export function getNexoraMVPSurfaceRegistry(): readonly NexoraMVPSurfaceDescriptor[] {
  return NEXORA_MVP_SURFACE_REGISTRY;
}

export function getNexoraMVPPrimarySurface(): typeof NEXORA_MVP_PRIMARY_SURFACE {
  return NEXORA_MVP_PRIMARY_SURFACE;
}

export function isNexoraMVPSurface(value: unknown): value is NexoraMVPSurface {
  return (NEXORA_MVP_SURFACES as readonly unknown[]).includes(value);
}

// ─── Presentation states (upstream semantics) ───────────────────────────────

/**
 * Application recognition of the frozen Minimum / Report / Operation model.
 * Semantics remain owned by REX / NEX-CI; MVP recognizes the same literals.
 */
export const NEXORA_MVP_PRESENTATION_STATES = Object.freeze([
  "minimum",
  "report",
  "operation",
] as const);

export type NexoraMVPPresentationState =
  (typeof NEXORA_MVP_PRESENTATION_STATES)[number];

export function getNexoraMVPPresentationStates(): readonly NexoraMVPPresentationState[] {
  return NEXORA_MVP_PRESENTATION_STATES;
}

export function isNexoraMVPPresentationState(
  value: unknown,
): value is NexoraMVPPresentationState {
  return (NEXORA_MVP_PRESENTATION_STATES as readonly unknown[]).includes(value);
}

// ─── Workspaces ─────────────────────────────────────────────────────────────

export const NEXORA_MVP_WORKSPACE_KINDS = Object.freeze([
  "overview",
  "problem",
  "scenario",
  "decision",
  "execution",
] as const);

export type NexoraMVPWorkspaceKind =
  (typeof NEXORA_MVP_WORKSPACE_KINDS)[number];

export const NEXORA_MVP_WORKSPACE_ROLES = Object.freeze([
  "entry",
  "investigate",
  "simulate",
  "commit",
  "execute",
] as const);

export type NexoraMVPWorkspaceRole =
  (typeof NEXORA_MVP_WORKSPACE_ROLES)[number];

export const NEXORA_MVP_WORKSPACE_ROLE_MAP = Object.freeze({
  overview: "entry",
  problem: "investigate",
  scenario: "simulate",
  decision: "commit",
  execution: "execute",
} as const satisfies Record<NexoraMVPWorkspaceKind, NexoraMVPWorkspaceRole>);

export const NEXORA_MVP_WORKSPACE_LABELS = Object.freeze({
  overview: "Overview",
  problem: "Problem",
  scenario: "Scenario",
  decision: "Decision",
  execution: "Execution",
} as const satisfies Record<NexoraMVPWorkspaceKind, string>);

/**
 * Compatible with upstream ExecutiveWorkspaceReference shape.
 * Built locally so UI clients need not import NEX-CI runtime.
 */
export interface NexoraMVPWorkspaceReference {
  readonly id: string;
  readonly kind: NexoraMVPWorkspaceKind;
  readonly label: string;
}

export interface NexoraMVPWorkspaceDescriptor {
  readonly id: string;
  readonly kind: NexoraMVPWorkspaceKind;
  readonly label: string;
  readonly order: number;
  readonly role: NexoraMVPWorkspaceRole;
  readonly workspace: NexoraMVPWorkspaceReference;
}

function createNexoraMVPWorkspaceReference(
  kind: NexoraMVPWorkspaceKind,
): NexoraMVPWorkspaceReference {
  return Object.freeze({
    id: `workspace.${kind}`,
    kind,
    label: NEXORA_MVP_WORKSPACE_LABELS[kind],
  });
}

function buildWorkspaceDescriptor(
  kind: NexoraMVPWorkspaceKind,
  order: number,
): NexoraMVPWorkspaceDescriptor {
  const workspace = createNexoraMVPWorkspaceReference(kind);
  return Object.freeze({
    id: workspace.id,
    kind,
    label: workspace.label,
    order,
    role: NEXORA_MVP_WORKSPACE_ROLE_MAP[kind],
    workspace,
  });
}

/**
 * Deterministic dial-ready workspace registry.
 * Overview → Problem → Scenario → Decision → Execution.
 */
export const NEXORA_MVP_WORKSPACE_REGISTRY = Object.freeze(
  NEXORA_MVP_WORKSPACE_KINDS.map((kind, order) =>
    buildWorkspaceDescriptor(kind, order),
  ),
);

export const NEXORA_MVP_WORKSPACE_ORDER = Object.freeze(
  NEXORA_MVP_WORKSPACE_REGISTRY.map((entry) => entry.kind),
);

export function getNexoraMVPWorkspaceRegistry(): readonly NexoraMVPWorkspaceDescriptor[] {
  return NEXORA_MVP_WORKSPACE_REGISTRY;
}

export function getNexoraMVPWorkspaceOrder(): readonly NexoraMVPWorkspaceKind[] {
  return NEXORA_MVP_WORKSPACE_ORDER;
}

export function isNexoraMVPWorkspaceKind(
  value: unknown,
): value is NexoraMVPWorkspaceKind {
  return (NEXORA_MVP_WORKSPACE_KINDS as readonly unknown[]).includes(value);
}

// ─── Scene environment intents ──────────────────────────────────────────────

/**
 * Semantic Stage environment intents.
 * Visual colors/materials belong to a future Stage/theme layer.
 */
export const NEXORA_MVP_SCENE_ENVIRONMENT_INTENTS = Object.freeze([
  "neutral",
  "investigate",
  "simulate",
  "commit",
  "execute",
] as const);

export type NexoraMVPSceneEnvironmentIntent =
  (typeof NEXORA_MVP_SCENE_ENVIRONMENT_INTENTS)[number];

export const NEXORA_MVP_WORKSPACE_ENVIRONMENT_MAP = Object.freeze({
  overview: "neutral",
  problem: "investigate",
  scenario: "simulate",
  decision: "commit",
  execution: "execute",
} as const satisfies Record<
  NexoraMVPWorkspaceKind,
  NexoraMVPSceneEnvironmentIntent
>);

export function getNexoraMVPSceneEnvironmentIntent(
  workspace: NexoraMVPWorkspaceKind,
): NexoraMVPSceneEnvironmentIntent {
  if (!isNexoraMVPWorkspaceKind(workspace)) {
    throw new TypeError("workspace must be a canonical MVP workspace kind");
  }
  return NEXORA_MVP_WORKSPACE_ENVIRONMENT_MAP[workspace];
}

export function isNexoraMVPSceneEnvironmentIntent(
  value: unknown,
): value is NexoraMVPSceneEnvironmentIntent {
  return (
    NEXORA_MVP_SCENE_ENVIRONMENT_INTENTS as readonly unknown[]
  ).includes(value);
}

// ─── Executive subject reference (compatible with upstream kinds) ───────────

export const NEXORA_MVP_SUBJECT_KINDS = Object.freeze([
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

export type NexoraMVPSubjectKind = (typeof NEXORA_MVP_SUBJECT_KINDS)[number];

export interface NexoraMVPSubjectReference {
  readonly id: string;
  readonly kind: NexoraMVPSubjectKind;
}

// ─── Capability registry ────────────────────────────────────────────────────

export const NEXORA_MVP_CAPABILITIES = Object.freeze([
  "executive-shell",
  "stage",
  "workspace",
  "presentation-state",
  "selection",
  "focus",
  "advisor",
  "insight",
  "timeline",
  "explorer",
  "scene-environment",
] as const);

export type NexoraMVPCapability = (typeof NEXORA_MVP_CAPABILITIES)[number];

/**
 * Composition readiness only — does not claim visual phases are implemented.
 * available     — composition contract usable now
 * prepared      — vocabulary ready for a later MVP phase
 * not-yet-bound — known concept, not wired to application composition yet
 */
export const NEXORA_MVP_CAPABILITY_READINESS = Object.freeze([
  "available",
  "prepared",
  "not-yet-bound",
] as const);

export type NexoraMVPCapabilityReadiness =
  (typeof NEXORA_MVP_CAPABILITY_READINESS)[number];

export interface NexoraMVPCapabilityEntry {
  readonly id: NexoraMVPCapability;
  readonly readiness: NexoraMVPCapabilityReadiness;
  readonly order: number;
}

export const NEXORA_MVP_CAPABILITY_REGISTRY = Object.freeze([
  Object.freeze({
    id: "executive-shell",
    readiness: "prepared",
    order: 0,
  }),
  Object.freeze({
    id: "stage",
    readiness: "prepared",
    order: 1,
  }),
  Object.freeze({
    id: "workspace",
    readiness: "available",
    order: 2,
  }),
  Object.freeze({
    id: "presentation-state",
    readiness: "available",
    order: 3,
  }),
  Object.freeze({
    id: "selection",
    readiness: "available",
    order: 4,
  }),
  Object.freeze({
    id: "focus",
    readiness: "available",
    order: 5,
  }),
  Object.freeze({
    id: "advisor",
    readiness: "prepared",
    order: 6,
  }),
  Object.freeze({
    id: "insight",
    readiness: "prepared",
    order: 7,
  }),
  Object.freeze({
    id: "timeline",
    readiness: "prepared",
    order: 8,
  }),
  Object.freeze({
    id: "explorer",
    readiness: "prepared",
    order: 9,
  }),
  Object.freeze({
    id: "scene-environment",
    readiness: "available",
    order: 10,
  }),
] as const satisfies readonly NexoraMVPCapabilityEntry[]);

export function getNexoraMVPCapabilityRegistry(): readonly NexoraMVPCapabilityEntry[] {
  return NEXORA_MVP_CAPABILITY_REGISTRY;
}

// ─── Application snapshot ───────────────────────────────────────────────────

export interface NexoraMVPApplicationSnapshot {
  readonly identity: NexoraMVPApplicationIdentity;
  readonly workspace: NexoraMVPWorkspaceReference;
  readonly presentationState: NexoraMVPPresentationState;
  readonly activeSurface: NexoraMVPSurface;
  readonly selectedSubject: NexoraMVPSubjectReference | null;
  readonly focusedSubject: NexoraMVPSubjectReference | null;
  readonly environmentIntent: NexoraMVPSceneEnvironmentIntent;
}

export interface NexoraMVPApplication {
  readonly identity: NexoraMVPApplicationIdentity;
  readonly snapshot: NexoraMVPApplicationSnapshot;
  readonly surfaces: readonly NexoraMVPSurfaceDescriptor[];
  readonly workspaces: readonly NexoraMVPWorkspaceDescriptor[];
  readonly presentationStates: readonly NexoraMVPPresentationState[];
  readonly capabilities: readonly NexoraMVPCapabilityEntry[];
  readonly upstreamIdentity: typeof nexoraMVPApplicationFoundationUpstreamIdentity;
}

const INITIAL_WORKSPACE = NEXORA_MVP_WORKSPACE_REGISTRY[0]!;

function freezeSnapshot(
  snapshot: NexoraMVPApplicationSnapshot,
): NexoraMVPApplicationSnapshot {
  return Object.freeze({
    identity: snapshot.identity,
    workspace: snapshot.workspace,
    presentationState: snapshot.presentationState,
    activeSurface: snapshot.activeSurface,
    selectedSubject:
      snapshot.selectedSubject === null
        ? null
        : Object.freeze({ ...snapshot.selectedSubject }),
    focusedSubject:
      snapshot.focusedSubject === null
        ? null
        : Object.freeze({ ...snapshot.focusedSubject }),
    environmentIntent: snapshot.environmentIntent,
  });
}

/**
 * Pure application bootstrap. No WebGL, React mount, or browser globals.
 */
export function createNexoraMVPApplication(): NexoraMVPApplication {
  const snapshot = freezeSnapshot({
    identity: getNexoraMVPApplicationIdentity(),
    workspace: INITIAL_WORKSPACE.workspace,
    presentationState: "minimum",
    activeSurface: NEXORA_MVP_PRIMARY_SURFACE,
    selectedSubject: null,
    focusedSubject: null,
    environmentIntent: getNexoraMVPSceneEnvironmentIntent(
      INITIAL_WORKSPACE.kind,
    ),
  });

  return Object.freeze({
    identity: getNexoraMVPApplicationIdentity(),
    snapshot,
    surfaces: getNexoraMVPSurfaceRegistry(),
    workspaces: getNexoraMVPWorkspaceRegistry(),
    presentationStates: getNexoraMVPPresentationStates(),
    capabilities: getNexoraMVPCapabilityRegistry(),
    upstreamIdentity: nexoraMVPApplicationFoundationUpstreamIdentity,
  });
}

export function getInitialNexoraMVPApplicationSnapshot(): NexoraMVPApplicationSnapshot {
  return createNexoraMVPApplication().snapshot;
}

// ─── Foundation validation (UI-safe; upstream gate is separate module) ─────

export interface NexoraMVPApplicationFoundationValidation {
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly surfacesUnique: boolean;
  readonly exactlyOnePrimaryStage: boolean;
  readonly workspaceOrderValid: boolean;
  readonly presentationStatesValid: boolean;
  readonly environmentMappingComplete: boolean;
  readonly initialSnapshotValid: boolean;
  readonly capabilitiesUnique: boolean;
  readonly bootstrapDeterministic: boolean;
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

function isValidInitialSnapshot(
  snapshot: NexoraMVPApplicationSnapshot,
): boolean {
  return (
    snapshot.identity.id === nexoraMVPApplicationFoundationIdentity &&
    snapshot.workspace.kind === "overview" &&
    snapshot.workspace.id === "workspace.overview" &&
    snapshot.presentationState === "minimum" &&
    snapshot.activeSurface === "stage" &&
    snapshot.selectedSubject === null &&
    snapshot.focusedSubject === null &&
    snapshot.environmentIntent === "neutral"
  );
}

export function validateNexoraMVPApplicationFoundation(options?: {
  readonly forceFailure?: boolean;
}): NexoraMVPApplicationFoundationValidation {
  const identity = getNexoraMVPApplicationIdentity();
  const identityValid =
    identity.id === "NEX-MVP:1/NexoraMVPApplicationFoundation" &&
    identity.version === "1.1.0" &&
    identity.namespace === "nexora.mvp.application.foundation" &&
    identity.phase === "ApplicationFoundation" &&
    identity.architecturalRole === "MVPApplicationCompositionRoot";

  const surfacesUnique =
    unique([...NEXORA_MVP_SURFACES]) &&
    NEXORA_MVP_SURFACES.length === NEXORA_MVP_SURFACE_REGISTRY.length &&
    exactOrder(
      NEXORA_MVP_SURFACE_REGISTRY.map((entry) => entry.id),
      [...NEXORA_MVP_SURFACES],
    );

  const primarySurfaces = NEXORA_MVP_SURFACE_REGISTRY.filter(
    (entry) => entry.role === "primary",
  );
  const exactlyOnePrimaryStage =
    primarySurfaces.length === 1 &&
    primarySurfaces[0]?.id === "stage" &&
    NEXORA_MVP_SURFACE_ROLE_MAP.stage === "primary" &&
    NEXORA_MVP_PRIMARY_SURFACE === "stage";

  const workspaceOrderValid =
    exactOrder([...NEXORA_MVP_WORKSPACE_ORDER], [
      "overview",
      "problem",
      "scenario",
      "decision",
      "execution",
    ]) &&
    NEXORA_MVP_WORKSPACE_REGISTRY.every((entry, index) => {
      const kind = NEXORA_MVP_WORKSPACE_KINDS[index];
      return (
        entry.kind === kind &&
        entry.order === index &&
        entry.id === `workspace.${kind}` &&
        entry.workspace.kind === kind &&
        entry.role === NEXORA_MVP_WORKSPACE_ROLE_MAP[kind]
      );
    });

  const presentationStatesValid = exactOrder(
    [...NEXORA_MVP_PRESENTATION_STATES],
    ["minimum", "report", "operation"],
  );

  const environmentMappingComplete =
    exactOrder([...NEXORA_MVP_SCENE_ENVIRONMENT_INTENTS], [
      "neutral",
      "investigate",
      "simulate",
      "commit",
      "execute",
    ]) &&
    NEXORA_MVP_WORKSPACE_KINDS.every(
      (kind) =>
        getNexoraMVPSceneEnvironmentIntent(kind) ===
        NEXORA_MVP_WORKSPACE_ENVIRONMENT_MAP[kind],
    ) &&
    unique([...NEXORA_MVP_SCENE_ENVIRONMENT_INTENTS]);

  const appA = createNexoraMVPApplication();
  const appB = createNexoraMVPApplication();
  const initialSnapshotValid =
    isValidInitialSnapshot(appA.snapshot) &&
    isValidInitialSnapshot(appB.snapshot);

  const bootstrapDeterministic =
    JSON.stringify(appA.snapshot) === JSON.stringify(appB.snapshot) &&
    appA.identity.id === appB.identity.id &&
    appA.upstreamIdentity === appB.upstreamIdentity;

  const capabilitiesUnique =
    unique([...NEXORA_MVP_CAPABILITIES]) &&
    unique(NEXORA_MVP_CAPABILITY_REGISTRY.map((entry) => entry.id)) &&
    exactOrder(
      NEXORA_MVP_CAPABILITY_REGISTRY.map((entry) => entry.id),
      [...NEXORA_MVP_CAPABILITIES],
    ) &&
    NEXORA_MVP_CAPABILITY_REGISTRY.length === NEXORA_MVP_CAPABILITIES.length;

  const ok =
    options?.forceFailure !== true &&
    identityValid &&
    surfacesUnique &&
    exactlyOnePrimaryStage &&
    workspaceOrderValid &&
    presentationStatesValid &&
    environmentMappingComplete &&
    initialSnapshotValid &&
    capabilitiesUnique &&
    bootstrapDeterministic;

  return Object.freeze({
    ok,
    identityValid,
    surfacesUnique,
    exactlyOnePrimaryStage,
    workspaceOrderValid,
    presentationStatesValid,
    environmentMappingComplete,
    initialSnapshotValid,
    capabilitiesUnique,
    bootstrapDeterministic,
  });
}
