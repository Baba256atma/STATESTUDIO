/**
 * NEX-CI:2 — Cockpit Shell Runtime Binding.
 *
 * Binds the Executive Cockpit shell to canonical NEX-CI runtime state.
 *
 * Canonical flow:
 *   REX → NEX-CI:1 Foundation → NEX-CI:2 Shell Runtime Binding → Executive Cockpit Shell
 *
 * Answers:
 *   Given the current executive runtime state, what context should each
 *   Cockpit shell surface receive?
 *
 * Does NOT answer how surfaces visually render or animate that context.
 *
 * Sole immediate NEX-CI dependency: NEX-CI:1 Foundation.
 * Framework-independent pure TypeScript — no React, Three.js, rendering,
 * Stage mechanics, Workspace Dial mechanics, or later NEX-CI phases.
 */

import {
  EXECUTIVE_COCKPIT_SURFACES,
  EXECUTIVE_COCKPIT_SURFACE_BINDINGS,
  createExecutiveCockpitIntegrationSnapshot,
  executiveCockpitIntegrationFoundationIdentity,
  getExecutiveCockpitSurfaceBinding,
  isExecutiveCockpitIntegrationCapability,
  isExecutiveCockpitIntegrationRole,
  isExecutiveCockpitIntegrationStatus,
  isExecutiveCockpitPresentationState,
  isExecutiveCockpitSubjectKind,
  isExecutiveCockpitSurface,
  type ExecutiveCockpitIntegrationCapability,
  type ExecutiveCockpitIntegrationRole,
  type ExecutiveCockpitIntegrationSnapshot,
  type ExecutiveCockpitIntegrationStatus,
  type ExecutiveCockpitPresentationState,
  type ExecutiveCockpitSubjectReference,
  type ExecutiveCockpitSurface,
  type ExecutiveCockpitSurfaceBinding,
  verifyExecutiveCockpitIntegrationFoundation,
} from "@/app/lib/nex-ci/executiveCockpitIntegrationFoundation";

// ─── Identity ───────────────────────────────────────────────────────────────

export const cockpitShellRuntimeBindingIdentity =
  "NEX-CI:2/CockpitShellRuntimeBinding" as const;

export const cockpitShellRuntimeBindingVersion = "1.2.0" as const;

export const cockpitShellRuntimeBindingNamespace =
  "nexora.executive.cockpit.integration.shell-runtime-binding" as const;

export const cockpitShellRuntimeBindingLayer = "NEX-CI" as const;

export const cockpitShellRuntimeBindingPhase =
  "ShellRuntimeBinding" as const;

export const cockpitShellRuntimeBindingStage =
  "ShellRuntimeBinding" as const;

export const cockpitShellRuntimeBindingArchitecturalRole =
  "CockpitShellRuntimeBinding" as const;

export const cockpitShellRuntimeBindingDependencyIdentity =
  executiveCockpitIntegrationFoundationIdentity;

export const cockpitShellRuntimeBindingDependencyPath =
  "@/app/lib/nex-ci/executiveCockpitIntegrationFoundation" as const;

export const cockpitShellRuntimeBindingStability =
  "ShellRuntimeBindingReady" as const;

export const cockpitShellRuntimeBindingDeterministic = true as const;

export const cockpitShellRuntimeBindingSideEffectPolicy =
  "side-effect-free" as const;

export const cockpitShellRuntimeBindingMutationPolicy =
  "immutable" as const;

export const cockpitShellRuntimeBindingCanonicalIdentity = Object.freeze({
  identity: cockpitShellRuntimeBindingIdentity,
  version: cockpitShellRuntimeBindingVersion,
  namespace: cockpitShellRuntimeBindingNamespace,
  layer: cockpitShellRuntimeBindingLayer,
  phase: cockpitShellRuntimeBindingPhase,
  stage: cockpitShellRuntimeBindingStage,
  architecturalRole: cockpitShellRuntimeBindingArchitecturalRole,
  dependencyIdentity: cockpitShellRuntimeBindingDependencyIdentity,
  dependencyPath: cockpitShellRuntimeBindingDependencyPath,
  stabilityStatus: cockpitShellRuntimeBindingStability,
  deterministicStatus: cockpitShellRuntimeBindingDeterministic,
  sideEffectPolicy: cockpitShellRuntimeBindingSideEffectPolicy,
  mutationPolicy: cockpitShellRuntimeBindingMutationPolicy,
});

export const COCKPIT_SHELL_RUNTIME_BINDING_PRINCIPLE =
  "REX → NEX-CI:1 Foundation → NEX-CI:2 Shell Runtime Binding → Executive Cockpit Shell. Runtime state is bound without determining UI rendering." as const;

export const COCKPIT_SHELL_RUNTIME_BINDING_BOUNDARY = Object.freeze({
  nexCiAuthority: "Executive-Cockpit-Integration" as const,
  shellAuthority: "Executive-Cockpit-Shell" as const,
  boundaryAuthority: "NEX-CI:2" as const,
  architecturalRole: "CockpitShellRuntimeBinding" as const,
  soleImmediateDependency:
    "NEX-CI:1/ExecutiveCockpitIntegrationFoundation" as const,
  consumesNexCi1Only: true as const,
  bypassesNexCi1IntoRex: false as const,
  bypassesIntoExDri: false as const,
  bypassesIntoDri: false as const,
  bypassesIntoNol: false as const,
  ownsRendering: false as const,
  ownsStageMechanics: false as const,
  ownsWorkspaceDialMechanics: false as const,
  ownsAdvisorIntelligence: false as const,
  ownsInsightGeneration: false as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  introducesReact: false as const,
  introducesThreeJs: false as const,
  introducesPersistenceOrNetwork: false as const,
  implementsNexCi3: false as const,
});

// ─── Propagation vocabulary ─────────────────────────────────────────────────

/**
 * Canonical dimensions of runtime context that may propagate to shell surfaces.
 * Eligibility is derived from NEX-CI:1 surface capabilities — single source of truth.
 */
export const COCKPIT_RUNTIME_PROPAGATION_KINDS = Object.freeze([
  "workspace",
  "selection",
  "focus",
  "attention",
  "presentation",
  "status",
] as const);

export type CockpitRuntimePropagationKind =
  (typeof COCKPIT_RUNTIME_PROPAGATION_KINDS)[number];

/**
 * Maps each propagation kind to the NEX-CI:1 capability that authorizes it.
 * Propagation matrix is derived from surface bindings — not a second truth source.
 */
export const COCKPIT_RUNTIME_PROPAGATION_CAPABILITY_MAP = Object.freeze({
  workspace: "workspace-coordination",
  selection: "selection-propagation",
  focus: "focus-propagation",
  attention: "attention-propagation",
  presentation: "presentation-state-propagation",
  status: "runtime-state-consumption",
} as const satisfies Record<
  CockpitRuntimePropagationKind,
  ExecutiveCockpitIntegrationCapability
>);

// ─── Surface / shell runtime contracts ──────────────────────────────────────

/**
 * Per-surface shell runtime state.
 * Exactly one entry exists for every canonical Cockpit surface.
 */
export interface CockpitShellSurfaceRuntimeState {
  readonly surface: ExecutiveCockpitSurface;
  readonly role: ExecutiveCockpitIntegrationRole;
  readonly enabled: boolean;
  readonly active: boolean;
  readonly available: boolean;
  readonly receivesSelection: boolean;
  readonly receivesFocus: boolean;
  readonly receivesAttention: boolean;
  readonly receivesWorkspace: boolean;
  readonly receivesPresentationState: boolean;
  readonly receivesStatus: boolean;
  readonly propagationKinds: readonly CockpitRuntimePropagationKind[];
  readonly capabilities: readonly ExecutiveCockpitIntegrationCapability[];
}

/**
 * Canonical immutable shell binding state derived from an integration snapshot.
 */
export interface CockpitShellRuntimeBindingState {
  readonly activeSurface: ExecutiveCockpitSurface;
  readonly activeWorkspace?: string;
  readonly selectedSubject?: ExecutiveCockpitSubjectReference;
  readonly focusedSubject?: ExecutiveCockpitSubjectReference;
  readonly attentionSubjectId?: string;
  readonly presentationState?: ExecutiveCockpitPresentationState;
  readonly integrationStatus: ExecutiveCockpitIntegrationStatus;
  readonly surfaceStates: readonly CockpitShellSurfaceRuntimeState[];
  readonly bindingIdentity: typeof cockpitShellRuntimeBindingIdentity;
  readonly bindingVersion: typeof cockpitShellRuntimeBindingVersion;
}

/**
 * Capability-aware projection of global runtime context for one surface.
 * Unsupported context is omitted — never leaked.
 */
export interface CockpitSurfaceRuntimeContext {
  readonly surface: ExecutiveCockpitSurface;
  readonly role: ExecutiveCockpitIntegrationRole;
  readonly enabled: boolean;
  readonly active: boolean;
  readonly available: boolean;
  readonly workspaceId?: string;
  readonly modelId?: string;
  readonly activeWorkspace?: string;
  readonly selectedSubject?: ExecutiveCockpitSubjectReference;
  readonly focusedSubject?: ExecutiveCockpitSubjectReference;
  readonly attentionSubjectId?: string;
  readonly presentationState?: ExecutiveCockpitPresentationState;
  readonly integrationStatus?: ExecutiveCockpitIntegrationStatus;
}

/**
 * Runtime-ready Cockpit shell snapshot for later UI adapters.
 * Data only — no JSX, DOM, Three.js, or React callbacks.
 */
export interface CockpitShellRuntimeSnapshot {
  readonly integration: ExecutiveCockpitIntegrationSnapshot;
  readonly binding: CockpitShellRuntimeBindingState;
  readonly surfaces: readonly CockpitShellSurfaceRuntimeState[];
  readonly contexts: readonly CockpitSurfaceRuntimeContext[];
  readonly bindingIdentity: typeof cockpitShellRuntimeBindingIdentity;
  readonly bindingVersion: typeof cockpitShellRuntimeBindingVersion;
}

// ─── Guarantees / forbidden responsibilities ────────────────────────────────

export const COCKPIT_SHELL_RUNTIME_BINDING_GUARANTEES = Object.freeze([
  Object.freeze({
    id: "nex-ci-1-sole-immediate-dependency",
    order: 1,
    statement: "NEX-CI:2 depends immediately on NEX-CI:1 only.",
  }),
  Object.freeze({
    id: "one-runtime-state-per-surface",
    order: 2,
    statement:
      "Every canonical Cockpit surface receives exactly one shell runtime state.",
  }),
  Object.freeze({
    id: "surface-ordering-matches-nex-ci-1",
    order: 3,
    statement: "Surface ordering matches canonical NEX-CI ordering.",
  }),
  Object.freeze({
    id: "propagation-kinds-unique",
    order: 4,
    statement: "Every propagation kind is unique.",
  }),
  Object.freeze({
    id: "propagation-matrix-canonical",
    order: 5,
    statement: "Every propagation matrix entry references canonical values.",
  }),
  Object.freeze({
    id: "propagation-respects-capabilities",
    order: 6,
    statement: "Propagation respects NEX-CI:1 capabilities.",
  }),
  Object.freeze({
    id: "stage-remains-primary",
    order: 7,
    statement: "Stage remains the primary visual surface.",
  }),
  Object.freeze({
    id: "workspace-dial-remains-control",
    order: 8,
    statement: "Workspace Dial remains a control surface.",
  }),
  Object.freeze({
    id: "advisor-insight-remain-distinct",
    order: 9,
    statement: "Advisor and Insight remain distinct.",
  }),
  Object.freeze({
    id: "no-global-mutation",
    order: 10,
    statement: "Global state is never mutated.",
  }),
  Object.freeze({
    id: "input-snapshots-immutable",
    order: 11,
    statement: "Input integration snapshots are never mutated.",
  }),
  Object.freeze({
    id: "deterministic-binding-resolution",
    order: 12,
    statement: "Binding resolution is deterministic.",
  }),
  Object.freeze({
    id: "deterministic-context-projection",
    order: 13,
    statement: "Surface context projection is deterministic.",
  }),
  Object.freeze({
    id: "no-unsupported-context-leak",
    order: 14,
    statement: "Unsupported context is not leaked to a surface.",
  }),
  Object.freeze({
    id: "no-rendering-behavior",
    order: 15,
    statement: "No rendering behavior exists.",
  }),
  Object.freeze({
    id: "no-react-dependency",
    order: 16,
    statement: "No React dependency exists.",
  }),
  Object.freeze({
    id: "no-threejs-dependency",
    order: 17,
    statement: "No Three.js dependency exists.",
  }),
  Object.freeze({
    id: "no-network-access",
    order: 18,
    statement: "No network access exists.",
  }),
  Object.freeze({
    id: "no-persistence",
    order: 19,
    statement: "No persistence exists.",
  }),
  Object.freeze({
    id: "no-direct-nol-dri-exdri",
    order: 20,
    statement: "No direct NOL/DRI/EX-DRI dependency exists.",
  }),
] as const);

export type CockpitShellRuntimeBindingGuarantee =
  (typeof COCKPIT_SHELL_RUNTIME_BINDING_GUARANTEES)[number];

export const COCKPIT_SHELL_RUNTIME_BINDING_FORBIDDEN_RESPONSIBILITIES =
  Object.freeze([
    "React components",
    "React hooks",
    "React state",
    "Next.js routing",
    "Three.js scenes",
    "React Three Fiber",
    "camera movement",
    "object centering",
    "object animation",
    "connection rendering",
    "scene colors",
    "focus animations",
    "selection animations",
    "Workspace Dial geometry",
    "Workspace Dial rotation",
    "Workspace Dial gestures",
    "workspace switching",
    "scene recoloring",
    "Advisor intelligence",
    "Insight generation",
    "AI calls",
    "timeline replay",
    "explorer interaction",
    "Live Lens navigation",
    "persistence",
    "network access",
    "Gate integration",
    "external messaging",
    "new REX runtime behavior",
    "NEX-CI:3 Executive Stage Integration",
    "NEX-CI:4 Workspace Dial & Experience Switching",
    "NEX-CI:5 Advisor & Insight Integration",
  ] as const);

// ─── Guards / getters ───────────────────────────────────────────────────────

export function isCockpitRuntimePropagationKind(
  value: unknown,
): value is CockpitRuntimePropagationKind {
  return (
    COCKPIT_RUNTIME_PROPAGATION_KINDS as readonly unknown[]
  ).includes(value);
}

export function getCockpitShellRuntimeBindingIdentity():
  typeof cockpitShellRuntimeBindingCanonicalIdentity {
  return cockpitShellRuntimeBindingCanonicalIdentity;
}

export function getCockpitRuntimePropagationKinds(): ReadonlyArray<
  CockpitRuntimePropagationKind
> {
  return COCKPIT_RUNTIME_PROPAGATION_KINDS;
}

function surfaceHasCapability(
  binding: ExecutiveCockpitSurfaceBinding,
  capability: ExecutiveCockpitIntegrationCapability,
): boolean {
  return binding.capabilities.includes(capability);
}

export function doesCockpitSurfaceReceivePropagation(
  surface: ExecutiveCockpitSurface,
  propagationKind: CockpitRuntimePropagationKind,
): boolean {
  if (!isExecutiveCockpitSurface(surface)) {
    throw new TypeError(
      "surface must be a known executive cockpit surface",
    );
  }
  if (!isCockpitRuntimePropagationKind(propagationKind)) {
    throw new TypeError(
      "propagationKind must be a known cockpit runtime propagation kind",
    );
  }
  const binding = getExecutiveCockpitSurfaceBinding(surface);
  const capability =
    COCKPIT_RUNTIME_PROPAGATION_CAPABILITY_MAP[propagationKind];
  return surfaceHasCapability(binding, capability);
}

export function getCockpitSurfacePropagationKinds(
  surface: ExecutiveCockpitSurface,
): ReadonlyArray<CockpitRuntimePropagationKind> {
  if (!isExecutiveCockpitSurface(surface)) {
    throw new TypeError(
      "surface must be a known executive cockpit surface",
    );
  }
  return Object.freeze(
    COCKPIT_RUNTIME_PROPAGATION_KINDS.filter((kind) =>
      doesCockpitSurfaceReceivePropagation(surface, kind),
    ),
  );
}

/**
 * Canonical propagation matrix: Surface × PropagationKind → supported.
 * Derived from NEX-CI:1 capabilities; ordering matches canonical surfaces.
 */
export const COCKPIT_RUNTIME_PROPAGATION_MATRIX = Object.freeze(
  EXECUTIVE_COCKPIT_SURFACES.map((surface) =>
    Object.freeze({
      surface,
      kinds: getCockpitSurfacePropagationKinds(surface),
      workspace: doesCockpitSurfaceReceivePropagation(surface, "workspace"),
      selection: doesCockpitSurfaceReceivePropagation(surface, "selection"),
      focus: doesCockpitSurfaceReceivePropagation(surface, "focus"),
      attention: doesCockpitSurfaceReceivePropagation(surface, "attention"),
      presentation: doesCockpitSurfaceReceivePropagation(
        surface,
        "presentation",
      ),
      status: doesCockpitSurfaceReceivePropagation(surface, "status"),
    }),
  ),
);

// ─── Activation semantics ───────────────────────────────────────────────────

/**
 * enabled  = architecture/configuration permits the surface (binding.enabled)
 * available = runtime context allows participation (enabled && status ≠ unavailable)
 * active   = surface is the current interaction target (surface === activeSurface)
 */
function resolveSurfaceAvailability(
  enabled: boolean,
  integrationStatus: ExecutiveCockpitIntegrationStatus,
): boolean {
  return enabled && integrationStatus !== "unavailable";
}

function resolveSurfaceActive(
  surface: ExecutiveCockpitSurface,
  activeSurface: ExecutiveCockpitSurface,
  enabled: boolean,
): boolean {
  return enabled && surface === activeSurface;
}

// ─── Resolvers ──────────────────────────────────────────────────────────────

function freezeSubjectReference(
  subject: ExecutiveCockpitSubjectReference | undefined,
): ExecutiveCockpitSubjectReference | undefined {
  if (subject === undefined) {
    return undefined;
  }
  if (typeof subject.id !== "string" || subject.id.length === 0) {
    throw new TypeError("subject.id must be a non-empty opaque identifier");
  }
  if (!isExecutiveCockpitSubjectKind(subject.kind)) {
    throw new TypeError("subject.kind must be a known cockpit subject kind");
  }
  return Object.freeze({
    id: subject.id,
    kind: subject.kind,
  });
}

export function resolveCockpitSurfaceRuntimeState(
  snapshot: ExecutiveCockpitIntegrationSnapshot,
  surface: ExecutiveCockpitSurface,
): CockpitShellSurfaceRuntimeState {
  if (!isExecutiveCockpitSurface(surface)) {
    throw new TypeError(
      "surface must be a known executive cockpit surface",
    );
  }
  if (!isExecutiveCockpitSurface(snapshot.state.activeSurface)) {
    throw new TypeError(
      "snapshot.state.activeSurface must be a known executive cockpit surface",
    );
  }
  if (!isExecutiveCockpitIntegrationStatus(snapshot.state.status)) {
    throw new TypeError(
      "snapshot.state.status must be a known executive cockpit integration status",
    );
  }

  const binding = getExecutiveCockpitSurfaceBinding(surface);
  const enabled = binding.enabled === true;
  const available = resolveSurfaceAvailability(
    enabled,
    snapshot.state.status,
  );
  const active = resolveSurfaceActive(
    surface,
    snapshot.state.activeSurface,
    enabled,
  );
  const propagationKinds = getCockpitSurfacePropagationKinds(surface);

  return Object.freeze({
    surface,
    role: binding.role,
    enabled,
    active,
    available,
    receivesSelection: propagationKinds.includes("selection"),
    receivesFocus: propagationKinds.includes("focus"),
    receivesAttention: propagationKinds.includes("attention"),
    receivesWorkspace: propagationKinds.includes("workspace"),
    receivesPresentationState: propagationKinds.includes("presentation"),
    receivesStatus: propagationKinds.includes("status"),
    propagationKinds,
    capabilities: Object.freeze([...binding.capabilities]),
  });
}

export function resolveCockpitSurfaceRuntimeContext(
  snapshot: ExecutiveCockpitIntegrationSnapshot,
  surface: ExecutiveCockpitSurface,
): CockpitSurfaceRuntimeContext {
  const surfaceState = resolveCockpitSurfaceRuntimeState(snapshot, surface);
  const { context, state } = snapshot;

  const projected: {
    -readonly [K in keyof CockpitSurfaceRuntimeContext]?: CockpitSurfaceRuntimeContext[K];
  } = {
    surface: surfaceState.surface,
    role: surfaceState.role,
    enabled: surfaceState.enabled,
    active: surfaceState.active,
    available: surfaceState.available,
  };

  if (surfaceState.receivesWorkspace) {
    if (context.workspaceId !== undefined) {
      projected.workspaceId = context.workspaceId;
    }
    if (context.modelId !== undefined) {
      projected.modelId = context.modelId;
    }
    const activeWorkspace =
      state.activeWorkspace ?? context.activeWorkspace;
    if (activeWorkspace !== undefined) {
      projected.activeWorkspace = activeWorkspace;
    }
  }

  if (surfaceState.receivesSelection && state.selectedSubject !== undefined) {
    projected.selectedSubject = freezeSubjectReference(state.selectedSubject);
  }

  if (surfaceState.receivesFocus && state.focusedSubject !== undefined) {
    projected.focusedSubject = freezeSubjectReference(state.focusedSubject);
  }

  if (
    surfaceState.receivesAttention &&
    state.attentionSubjectId !== undefined
  ) {
    projected.attentionSubjectId = state.attentionSubjectId;
  }

  if (surfaceState.receivesPresentationState) {
    const presentationState =
      state.presentationState ?? context.presentationState;
    if (
      presentationState !== undefined &&
      isExecutiveCockpitPresentationState(presentationState)
    ) {
      projected.presentationState = presentationState;
    }
  }

  if (surfaceState.receivesStatus) {
    projected.integrationStatus = state.status;
  }

  return Object.freeze(projected as CockpitSurfaceRuntimeContext);
}

export function resolveCockpitShellRuntimeBinding(
  snapshot: ExecutiveCockpitIntegrationSnapshot,
): CockpitShellRuntimeSnapshot {
  // Re-validate via NEX-CI:1 constructors — never mutate the caller input.
  const integration = createExecutiveCockpitIntegrationSnapshot({
    context: {
      workspaceId: snapshot.context.workspaceId,
      modelId: snapshot.context.modelId,
      activeSurface: snapshot.context.activeSurface,
      activeWorkspace: snapshot.context.activeWorkspace,
      selectedSubjectId: snapshot.context.selectedSubjectId,
      focusedSubjectId: snapshot.context.focusedSubjectId,
      presentationState: snapshot.context.presentationState,
      attentionSubjectId: snapshot.context.attentionSubjectId,
    },
    state: {
      activeSurface: snapshot.state.activeSurface,
      activeWorkspace: snapshot.state.activeWorkspace,
      selectedSubject: snapshot.state.selectedSubject,
      focusedSubject: snapshot.state.focusedSubject,
      presentationState: snapshot.state.presentationState,
      attentionSubjectId: snapshot.state.attentionSubjectId,
      status: snapshot.state.status,
    },
    bindings: snapshot.bindings,
  });

  const surfaceStates = Object.freeze(
    EXECUTIVE_COCKPIT_SURFACES.map((surface) =>
      resolveCockpitSurfaceRuntimeState(integration, surface),
    ),
  );

  const contexts = Object.freeze(
    EXECUTIVE_COCKPIT_SURFACES.map((surface) =>
      resolveCockpitSurfaceRuntimeContext(integration, surface),
    ),
  );

  const binding: CockpitShellRuntimeBindingState = Object.freeze({
    activeSurface: integration.state.activeSurface,
    integrationStatus: integration.state.status,
    surfaceStates,
    bindingIdentity: cockpitShellRuntimeBindingIdentity,
    bindingVersion: cockpitShellRuntimeBindingVersion,
    ...(integration.state.activeWorkspace !== undefined
      ? { activeWorkspace: integration.state.activeWorkspace }
      : integration.context.activeWorkspace !== undefined
        ? { activeWorkspace: integration.context.activeWorkspace }
        : {}),
    ...(integration.state.selectedSubject !== undefined
      ? {
          selectedSubject: freezeSubjectReference(
            integration.state.selectedSubject,
          ),
        }
      : {}),
    ...(integration.state.focusedSubject !== undefined
      ? {
          focusedSubject: freezeSubjectReference(
            integration.state.focusedSubject,
          ),
        }
      : {}),
    ...(integration.state.attentionSubjectId !== undefined
      ? { attentionSubjectId: integration.state.attentionSubjectId }
      : {}),
    ...(integration.state.presentationState !== undefined
      ? { presentationState: integration.state.presentationState }
      : integration.context.presentationState !== undefined
        ? { presentationState: integration.context.presentationState }
        : {}),
  });

  return Object.freeze({
    integration,
    binding,
    surfaces: surfaceStates,
    contexts,
    bindingIdentity: cockpitShellRuntimeBindingIdentity,
    bindingVersion: cockpitShellRuntimeBindingVersion,
  });
}

// ─── Validation ─────────────────────────────────────────────────────────────

export interface CockpitShellRuntimeBindingValidation {
  readonly ok: boolean;
  readonly identity: typeof cockpitShellRuntimeBindingIdentity;
  readonly version: typeof cockpitShellRuntimeBindingVersion;
  readonly namespace: typeof cockpitShellRuntimeBindingNamespace;
  readonly phase: typeof cockpitShellRuntimeBindingPhase;
  readonly architecturalRole: typeof cockpitShellRuntimeBindingArchitecturalRole;
  readonly dependencyIdentity: typeof cockpitShellRuntimeBindingDependencyIdentity;
  readonly surfaceCount: number;
  readonly propagationKindCount: number;
  readonly matrixCoverage: number;
  readonly guaranteeCount: number;
  readonly invariantCount: number;
  readonly foundationOk: boolean;
  readonly frozen: boolean;
  readonly stageIsPrimary: boolean;
  readonly workspaceDialIsControl: boolean;
  readonly advisorInsightDistinct: boolean;
  readonly propagationCompatible: boolean;
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

function validateSurfaceRuntimeState(
  state: CockpitShellSurfaceRuntimeState,
): boolean {
  return (
    isExecutiveCockpitSurface(state.surface) &&
    isExecutiveCockpitIntegrationRole(state.role) &&
    typeof state.enabled === "boolean" &&
    typeof state.active === "boolean" &&
    typeof state.available === "boolean" &&
    typeof state.receivesSelection === "boolean" &&
    typeof state.receivesFocus === "boolean" &&
    typeof state.receivesAttention === "boolean" &&
    typeof state.receivesWorkspace === "boolean" &&
    typeof state.receivesPresentationState === "boolean" &&
    typeof state.receivesStatus === "boolean" &&
    Array.isArray(state.propagationKinds) &&
    state.propagationKinds.every((kind) =>
      isCockpitRuntimePropagationKind(kind),
    ) &&
    Array.isArray(state.capabilities) &&
    state.capabilities.every((capability) =>
      isExecutiveCockpitIntegrationCapability(capability),
    ) &&
    Object.isFrozen(state)
  );
}

function validateSurfaceRuntimeContext(
  context: CockpitSurfaceRuntimeContext,
  surfaceState: CockpitShellSurfaceRuntimeState,
): boolean {
  if (!Object.isFrozen(context)) {
    return false;
  }
  if (context.surface !== surfaceState.surface) {
    return false;
  }
  if (
    context.selectedSubject !== undefined &&
    !surfaceState.receivesSelection
  ) {
    return false;
  }
  if (context.focusedSubject !== undefined && !surfaceState.receivesFocus) {
    return false;
  }
  if (
    context.attentionSubjectId !== undefined &&
    !surfaceState.receivesAttention
  ) {
    return false;
  }
  if (
    (context.activeWorkspace !== undefined ||
      context.workspaceId !== undefined ||
      context.modelId !== undefined) &&
    !surfaceState.receivesWorkspace
  ) {
    return false;
  }
  if (
    context.presentationState !== undefined &&
    !surfaceState.receivesPresentationState
  ) {
    return false;
  }
  if (
    context.integrationStatus !== undefined &&
    !surfaceState.receivesStatus
  ) {
    return false;
  }
  return true;
}

export function validateCockpitShellRuntimeBinding(
  snapshot?: CockpitShellRuntimeSnapshot,
): CockpitShellRuntimeBindingValidation {
  const foundation = verifyExecutiveCockpitIntegrationFoundation();

  const identityOk =
    cockpitShellRuntimeBindingIdentity ===
      "NEX-CI:2/CockpitShellRuntimeBinding" &&
    cockpitShellRuntimeBindingVersion === "1.2.0" &&
    cockpitShellRuntimeBindingNamespace ===
      "nexora.executive.cockpit.integration.shell-runtime-binding" &&
    cockpitShellRuntimeBindingPhase === "ShellRuntimeBinding" &&
    cockpitShellRuntimeBindingArchitecturalRole ===
      "CockpitShellRuntimeBinding" &&
    cockpitShellRuntimeBindingDependencyIdentity ===
      "NEX-CI:1/ExecutiveCockpitIntegrationFoundation" &&
    cockpitShellRuntimeBindingDependencyIdentity ===
      executiveCockpitIntegrationFoundationIdentity &&
    COCKPIT_SHELL_RUNTIME_BINDING_BOUNDARY.soleImmediateDependency ===
      "NEX-CI:1/ExecutiveCockpitIntegrationFoundation" &&
    COCKPIT_SHELL_RUNTIME_BINDING_BOUNDARY.consumesNexCi1Only === true;

  const propagationOk =
    exactOrder(COCKPIT_RUNTIME_PROPAGATION_KINDS, [
      "workspace",
      "selection",
      "focus",
      "attention",
      "presentation",
      "status",
    ]) &&
    unique([...COCKPIT_RUNTIME_PROPAGATION_KINDS]) &&
    COCKPIT_RUNTIME_PROPAGATION_KINDS.every((kind) =>
      isExecutiveCockpitIntegrationCapability(
        COCKPIT_RUNTIME_PROPAGATION_CAPABILITY_MAP[kind],
      ),
    );

  const matrixOk =
    COCKPIT_RUNTIME_PROPAGATION_MATRIX.length ===
      EXECUTIVE_COCKPIT_SURFACES.length &&
    COCKPIT_RUNTIME_PROPAGATION_MATRIX.every((entry, index) => {
      const surface = EXECUTIVE_COCKPIT_SURFACES[index];
      if (entry.surface !== surface) {
        return false;
      }
      const expected = getCockpitSurfacePropagationKinds(surface);
      return (
        exactOrder([...entry.kinds], [...expected]) &&
        entry.workspace ===
          doesCockpitSurfaceReceivePropagation(surface, "workspace") &&
        entry.selection ===
          doesCockpitSurfaceReceivePropagation(surface, "selection") &&
        entry.focus ===
          doesCockpitSurfaceReceivePropagation(surface, "focus") &&
        entry.attention ===
          doesCockpitSurfaceReceivePropagation(surface, "attention") &&
        entry.presentation ===
          doesCockpitSurfaceReceivePropagation(surface, "presentation") &&
        entry.status ===
          doesCockpitSurfaceReceivePropagation(surface, "status") &&
        Object.isFrozen(entry) &&
        Object.isFrozen(entry.kinds)
      );
    });

  const capabilityCompatibilityOk = EXECUTIVE_COCKPIT_SURFACES.every(
    (surface) => {
      const binding = getExecutiveCockpitSurfaceBinding(surface);
      return COCKPIT_RUNTIME_PROPAGATION_KINDS.every((kind) => {
        const capability = COCKPIT_RUNTIME_PROPAGATION_CAPABILITY_MAP[kind];
        const receives = doesCockpitSurfaceReceivePropagation(surface, kind);
        return receives === surfaceHasCapability(binding, capability);
      });
    },
  );

  const stageIsPrimary =
    getExecutiveCockpitSurfaceBinding("stage").role === "primary";
  const workspaceDialIsControl =
    getExecutiveCockpitSurfaceBinding("workspace-dial").role === "control";
  const advisorInsightDistinct =
    getExecutiveCockpitSurfaceBinding("advisor").surface === "advisor" &&
    getExecutiveCockpitSurfaceBinding("insight").surface === "insight" &&
    getExecutiveCockpitSurfaceBinding("advisor").role === "supporting" &&
    getExecutiveCockpitSurfaceBinding("insight").role === "supporting";

  let snapshotOk = true;
  if (snapshot !== undefined) {
    snapshotOk =
      snapshot.bindingIdentity === cockpitShellRuntimeBindingIdentity &&
      snapshot.bindingVersion === cockpitShellRuntimeBindingVersion &&
      Object.isFrozen(snapshot) &&
      Object.isFrozen(snapshot.binding) &&
      Object.isFrozen(snapshot.surfaces) &&
      Object.isFrozen(snapshot.contexts) &&
      snapshot.surfaces.length === EXECUTIVE_COCKPIT_SURFACES.length &&
      snapshot.contexts.length === EXECUTIVE_COCKPIT_SURFACES.length &&
      exactOrder(
        snapshot.surfaces.map((entry) => entry.surface),
        [...EXECUTIVE_COCKPIT_SURFACES],
      ) &&
      exactOrder(
        snapshot.contexts.map((entry) => entry.surface),
        [...EXECUTIVE_COCKPIT_SURFACES],
      ) &&
      snapshot.surfaces.every((state, index) => {
        const context = snapshot.contexts[index];
        return (
          validateSurfaceRuntimeState(state) &&
          validateSurfaceRuntimeContext(context, state)
        );
      }) &&
      snapshot.surfaces.filter((state) => state.active).length === 1 &&
      unique(snapshot.surfaces.map((state) => state.surface));
  }

  const guaranteesOk =
    COCKPIT_SHELL_RUNTIME_BINDING_GUARANTEES.length === 20 &&
    exactOrder(
      COCKPIT_SHELL_RUNTIME_BINDING_GUARANTEES.map((entry) => entry.id),
      [
        "nex-ci-1-sole-immediate-dependency",
        "one-runtime-state-per-surface",
        "surface-ordering-matches-nex-ci-1",
        "propagation-kinds-unique",
        "propagation-matrix-canonical",
        "propagation-respects-capabilities",
        "stage-remains-primary",
        "workspace-dial-remains-control",
        "advisor-insight-remain-distinct",
        "no-global-mutation",
        "input-snapshots-immutable",
        "deterministic-binding-resolution",
        "deterministic-context-projection",
        "no-unsupported-context-leak",
        "no-rendering-behavior",
        "no-react-dependency",
        "no-threejs-dependency",
        "no-network-access",
        "no-persistence",
        "no-direct-nol-dri-exdri",
      ],
    ) &&
    COCKPIT_SHELL_RUNTIME_BINDING_GUARANTEES.every(
      (entry, index) => entry.order === index + 1,
    );

  const immutabilityOk =
    Object.isFrozen(cockpitShellRuntimeBindingCanonicalIdentity) &&
    Object.isFrozen(COCKPIT_RUNTIME_PROPAGATION_KINDS) &&
    Object.isFrozen(COCKPIT_RUNTIME_PROPAGATION_CAPABILITY_MAP) &&
    Object.isFrozen(COCKPIT_RUNTIME_PROPAGATION_MATRIX) &&
    Object.isFrozen(COCKPIT_SHELL_RUNTIME_BINDING_GUARANTEES) &&
    Object.isFrozen(COCKPIT_SHELL_RUNTIME_BINDING_BOUNDARY) &&
    Object.isFrozen(cockpitShellRuntimeBinding) &&
    Object.isFrozen(EXECUTIVE_COCKPIT_SURFACE_BINDINGS);

  const frameworkIndependent =
    COCKPIT_SHELL_RUNTIME_BINDING_BOUNDARY.frameworkIndependent === true &&
    COCKPIT_SHELL_RUNTIME_BINDING_BOUNDARY.introducesReact === false &&
    COCKPIT_SHELL_RUNTIME_BINDING_BOUNDARY.introducesThreeJs === false &&
    COCKPIT_SHELL_RUNTIME_BINDING_BOUNDARY.ownsRendering === false &&
    COCKPIT_SHELL_RUNTIME_BINDING_BOUNDARY.bypassesIntoNol === false &&
    COCKPIT_SHELL_RUNTIME_BINDING_BOUNDARY.bypassesIntoDri === false &&
    COCKPIT_SHELL_RUNTIME_BINDING_BOUNDARY.bypassesIntoExDri === false &&
    COCKPIT_SHELL_RUNTIME_BINDING_BOUNDARY.implementsNexCi3 === false;

  const ok =
    identityOk &&
    propagationOk &&
    matrixOk &&
    capabilityCompatibilityOk &&
    stageIsPrimary &&
    workspaceDialIsControl &&
    advisorInsightDistinct &&
    snapshotOk &&
    guaranteesOk &&
    immutabilityOk &&
    frameworkIndependent &&
    foundation.ok === true;

  return Object.freeze({
    ok,
    identity: cockpitShellRuntimeBindingIdentity,
    version: cockpitShellRuntimeBindingVersion,
    namespace: cockpitShellRuntimeBindingNamespace,
    phase: cockpitShellRuntimeBindingPhase,
    architecturalRole: cockpitShellRuntimeBindingArchitecturalRole,
    dependencyIdentity: cockpitShellRuntimeBindingDependencyIdentity,
    surfaceCount: EXECUTIVE_COCKPIT_SURFACES.length,
    propagationKindCount: COCKPIT_RUNTIME_PROPAGATION_KINDS.length,
    matrixCoverage: COCKPIT_RUNTIME_PROPAGATION_MATRIX.length,
    guaranteeCount: COCKPIT_SHELL_RUNTIME_BINDING_GUARANTEES.length,
    invariantCount: COCKPIT_SHELL_RUNTIME_BINDING_GUARANTEES.length,
    foundationOk: foundation.ok,
    frozen: immutabilityOk,
    stageIsPrimary,
    workspaceDialIsControl,
    advisorInsightDistinct,
    propagationCompatible: capabilityCompatibilityOk && matrixOk,
    frameworkIndependent,
  });
}

export function verifyCockpitShellRuntimeBinding():
  CockpitShellRuntimeBindingValidation {
  return validateCockpitShellRuntimeBinding();
}

// ─── Public catalogs / module bag ───────────────────────────────────────────

export const cockpitShellRuntimeBindingApiNames = Object.freeze([
  "getCockpitShellRuntimeBindingIdentity",
  "getCockpitRuntimePropagationKinds",
  "isCockpitRuntimePropagationKind",
  "doesCockpitSurfaceReceivePropagation",
  "getCockpitSurfacePropagationKinds",
  "resolveCockpitSurfaceRuntimeState",
  "resolveCockpitSurfaceRuntimeContext",
  "resolveCockpitShellRuntimeBinding",
  "validateCockpitShellRuntimeBinding",
  "verifyCockpitShellRuntimeBinding",
] as const);

export const COCKPIT_SHELL_RUNTIME_BINDING_PUBLIC_TYPE_NAMES = Object.freeze([
  "CockpitRuntimePropagationKind",
  "CockpitShellSurfaceRuntimeState",
  "CockpitShellRuntimeBindingState",
  "CockpitSurfaceRuntimeContext",
  "CockpitShellRuntimeSnapshot",
  "CockpitShellRuntimeBindingGuarantee",
  "CockpitShellRuntimeBindingValidation",
] as const);

export const cockpitShellRuntimeBinding = Object.freeze({
  phase: "ShellRuntimeBinding" as const,
  name: "CockpitShellRuntimeBinding" as const,
  identity: cockpitShellRuntimeBindingIdentity,
  version: cockpitShellRuntimeBindingVersion,
  namespace: cockpitShellRuntimeBindingNamespace,
  layer: cockpitShellRuntimeBindingLayer,
  stage: cockpitShellRuntimeBindingStage,
  architecturalRole: cockpitShellRuntimeBindingArchitecturalRole,
  role: "ShellRuntimeBinding" as const,
  status: cockpitShellRuntimeBindingStability,
  upstreamDependency: cockpitShellRuntimeBindingDependencyIdentity,
  dependencyPath: cockpitShellRuntimeBindingDependencyPath,
  deterministic: cockpitShellRuntimeBindingDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  browserIndependent: true as const,
  principle: COCKPIT_SHELL_RUNTIME_BINDING_PRINCIPLE,
  boundary: COCKPIT_SHELL_RUNTIME_BINDING_BOUNDARY,
  propagationKinds: COCKPIT_RUNTIME_PROPAGATION_KINDS,
  propagationCapabilityMap: COCKPIT_RUNTIME_PROPAGATION_CAPABILITY_MAP,
  propagationMatrix: COCKPIT_RUNTIME_PROPAGATION_MATRIX,
  surfaces: EXECUTIVE_COCKPIT_SURFACES,
  guarantees: COCKPIT_SHELL_RUNTIME_BINDING_GUARANTEES,
  forbiddenResponsibilities:
    COCKPIT_SHELL_RUNTIME_BINDING_FORBIDDEN_RESPONSIBILITIES,
  publicApiSurface: cockpitShellRuntimeBindingApiNames,
  publicTypes: COCKPIT_SHELL_RUNTIME_BINDING_PUBLIC_TYPE_NAMES,
  nexCi1Boundary: "NEX-CI:1-foundation-only" as const,
  architecturalStatus:
    "Shell Runtime Binding Complete · Deterministic · Immutable · Framework-Independent · ReadyForStageIntegration" as const,
});

/**
 * Approved NEX-CI:1 consumer types re-exported for immediate downstream
 * NEX-CI phases (e.g. NEX-CI:3) so they can preserve the dependency chain
 * without importing the foundation module directly.
 */
export {
  EXECUTIVE_COCKPIT_PRESENTATION_STATES,
  EXECUTIVE_COCKPIT_SUBJECT_KINDS,
  EXECUTIVE_COCKPIT_SURFACES,
  createExecutiveCockpitIntegrationSnapshot,
  executiveCockpitIntegrationFoundationIdentity,
  executiveCockpitIntegrationFoundationVersion,
  isExecutiveCockpitIntegrationStatus,
  isExecutiveCockpitPresentationState,
  isExecutiveCockpitSubjectKind,
  isExecutiveCockpitSurface,
  verifyExecutiveCockpitIntegrationFoundation,
} from "@/app/lib/nex-ci/executiveCockpitIntegrationFoundation";

export type {
  ExecutiveCockpitIntegrationStatus,
  ExecutiveCockpitPresentationState,
  ExecutiveCockpitSubjectKind,
  ExecutiveCockpitSubjectReference,
  ExecutiveCockpitSurface,
  ExecutiveCockpitIntegrationSnapshot,
} from "@/app/lib/nex-ci/executiveCockpitIntegrationFoundation";
