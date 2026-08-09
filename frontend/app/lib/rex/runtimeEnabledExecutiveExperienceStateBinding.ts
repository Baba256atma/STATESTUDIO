/**
 * REX-1:3 — Runtime Context & State Binding.
 *
 * Converts approved REX-1:2 Executive Runtime Contracts into deterministic,
 * immutable Executive Experience context/state structures.
 *
 * Canonical flow:
 *   EX-DRI → REX-1:1 Foundation → REX-1:2 Contracts → REX-1:3 Binding
 *
 * Binding only — no UI, Stage rendering, Advisor reasoning, interaction
 * execution, Three.js, persistence, networking, or business calculations.
 */

import {
  createExecutiveRuntimeAttentionContract,
  createExecutiveRuntimeAuthorityContract,
  createExecutiveRuntimeFocusContract,
  createExecutiveRuntimeInteractionContext,
  createExecutiveRuntimePresentationContract,
  createExecutiveRuntimeReadinessContract,
  createExecutiveRuntimeSubjectReference,
  createExecutiveRuntimeSurfaceReference,
  isExecutiveRuntimeSubjectReference,
  isExecutiveRuntimeSurfaceReference,
  runtimeEnabledExecutiveExperienceContractsIdentity,
  runtimeEnabledExecutiveExperienceContractsVersion,
  verifyExecutiveRuntimeAttentionContract,
  verifyExecutiveRuntimeAuthorityContract,
  verifyExecutiveRuntimeFocusContract,
  verifyExecutiveRuntimePresentationContract,
  verifyExecutiveRuntimeReadinessContract,
  type ExecutiveRuntimeAttentionContract,
  type ExecutiveRuntimeAuthorityContract,
  type ExecutiveRuntimeExperienceContract,
  type ExecutiveRuntimeFocusContract,
  type ExecutiveRuntimeInteractionContext,
  type ExecutiveRuntimePresentationContract,
  type ExecutiveRuntimeReadinessContract,
  type ExecutiveRuntimeSubjectReference,
  type ExecutiveRuntimeSurfaceContract,
  type ExecutiveRuntimeSurfaceReference,
} from "@/app/lib/rex/runtimeEnabledExecutiveExperienceContracts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeEnabledExecutiveExperienceStateBindingIdentity =
  "REX-1:3/RuntimeContextStateBinding" as const;

export const runtimeEnabledExecutiveExperienceStateBindingVersion =
  "1.3.0" as const;

export const runtimeEnabledExecutiveExperienceStateBindingNamespace =
  "nexora.rex.runtime-enabled-executive-experience.state-binding" as const;

export const runtimeEnabledExecutiveExperienceStateBindingLayer =
  "REX" as const;

export const runtimeEnabledExecutiveExperienceStateBindingPhase =
  "REX-1" as const;

export const runtimeEnabledExecutiveExperienceStateBindingStage =
  "RuntimeContextStateBinding" as const;

export const runtimeEnabledExecutiveExperienceStateBindingArchitecturalRole =
  "ExecutiveRuntimeContextStateBindingBoundary" as const;

export const runtimeEnabledExecutiveExperienceStateBindingDependencyIdentity =
  runtimeEnabledExecutiveExperienceContractsIdentity;

export const runtimeEnabledExecutiveExperienceStateBindingDependencyPath =
  "@/app/lib/rex/runtimeEnabledExecutiveExperienceContracts" as const;

export const runtimeEnabledExecutiveExperienceStateBindingStability =
  "BindingReady" as const;

export const runtimeEnabledExecutiveExperienceStateBindingDeterministic =
  true as const;

export const runtimeEnabledExecutiveExperienceStateBindingSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeEnabledExecutiveExperienceStateBindingMutationPolicy =
  "immutable" as const;

export const runtimeEnabledExecutiveExperienceStateBindingCanonicalIdentity =
  Object.freeze({
    identity: runtimeEnabledExecutiveExperienceStateBindingIdentity,
    version: runtimeEnabledExecutiveExperienceStateBindingVersion,
    namespace: runtimeEnabledExecutiveExperienceStateBindingNamespace,
    layer: runtimeEnabledExecutiveExperienceStateBindingLayer,
    phase: runtimeEnabledExecutiveExperienceStateBindingPhase,
    stage: runtimeEnabledExecutiveExperienceStateBindingStage,
    architecturalRole:
      runtimeEnabledExecutiveExperienceStateBindingArchitecturalRole,
    dependencyIdentity:
      runtimeEnabledExecutiveExperienceStateBindingDependencyIdentity,
    dependencyPath:
      runtimeEnabledExecutiveExperienceStateBindingDependencyPath,
    stabilityStatus:
      runtimeEnabledExecutiveExperienceStateBindingStability,
    deterministicStatus:
      runtimeEnabledExecutiveExperienceStateBindingDeterministic,
    sideEffectPolicy:
      runtimeEnabledExecutiveExperienceStateBindingSideEffectPolicy,
    mutationPolicy:
      runtimeEnabledExecutiveExperienceStateBindingMutationPolicy,
  });

export const EXECUTIVE_RUNTIME_STATE_BINDING_PRINCIPLE =
  "Executive Runtime Contracts → Bound Executive Runtime Context/State. Binding preserves; it does not decide." as const;

export const EXECUTIVE_RUNTIME_STATE_BINDING_BOUNDARY = Object.freeze({
  rexAuthority: "Runtime-enabled-Executive-Experience" as const,
  bindingAuthority: "REX-1:3" as const,
  architecturalRole:
    "ExecutiveRuntimeContextStateBindingBoundary" as const,
  soleImmediateDependency: "REX-1:2/ExecutiveRuntimeContracts" as const,
  consumesContractsOnly: true as const,
  importsFoundationDirectly: false as const,
  importsExDriDirectly: false as const,
  importsDriDirectly: false as const,
  importsNolDirectly: false as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  calculatesFocus: false as const,
  calculatesAttention: false as const,
  resolvesPresentation: false as const,
  executesInteraction: false as const,
  inventsSubjectIds: false as const,
  infersSurfaceActivation: false as const,
  fabricatesReadiness: false as const,
  rewritesRuntimeAuthority: false as const,
});

// ─── Canonical surface order (mirrors REX foundation via contracts vocabulary)
//
// Sparse binding rule:
//   Bind only surfaces explicitly present in the binding input.
//   Order the resulting collection by this canonical order.
//   Do not invent placeholder surface states for absent surfaces.
//   Do not reorder by activity or filter inactive surfaces that are present.

export const EXECUTIVE_RUNTIME_BOUND_SURFACE_ORDER = Object.freeze([
  "experience",
  "stage",
  "advisor",
  "insight",
  "timeline",
  "explorer",
] as const);

export type ExecutiveRuntimeBoundSurfaceName =
  (typeof EXECUTIVE_RUNTIME_BOUND_SURFACE_ORDER)[number];

export type ExecutiveRuntimeBoundRuntimeState =
  ExecutiveRuntimeSurfaceReference["runtimeState"];

export type ExecutiveRuntimeBoundActivationState =
  ExecutiveRuntimeSurfaceReference["activationState"];

export type ExecutiveRuntimeBoundPresentationState =
  ExecutiveRuntimePresentationContract["presentationState"];

// ─── Status / issues ────────────────────────────────────────────────────────

export const EXECUTIVE_RUNTIME_BINDING_STATUSES = Object.freeze([
  "bound",
  "partial",
  "unavailable",
  "invalid",
] as const);

export type ExecutiveRuntimeBindingStatus =
  (typeof EXECUTIVE_RUNTIME_BINDING_STATUSES)[number];

export const EXECUTIVE_RUNTIME_BINDING_ISSUE_CODES = Object.freeze([
  "missing-runtime-context",
  "missing-runtime-authority",
  "missing-surface-state",
  "invalid-active-surface",
  "invalid-active-subject",
  "inconsistent-readiness",
  "presentation-unavailable",
  "invalid-focus",
  "invalid-attention",
  "invalid-presentation",
  "invalid-interaction-context",
  "invalid-surface-contract",
  "duplicate-surface",
] as const);

export type ExecutiveRuntimeBindingIssueCode =
  (typeof EXECUTIVE_RUNTIME_BINDING_ISSUE_CODES)[number];

export interface ExecutiveRuntimeBindingIssue {
  readonly code: ExecutiveRuntimeBindingIssueCode;
  readonly message: string;
  readonly path?: string;
}

// ─── Binding input ──────────────────────────────────────────────────────────

/**
 * Minimum approved REX-1:2 information required to produce bound state.
 * Top-level fields override matching fields from experienceContract when both
 * are provided. No React/component objects.
 */
export interface ExecutiveRuntimeStateBindingInput {
  readonly experienceContract?: ExecutiveRuntimeExperienceContract;
  readonly surfaceContracts?: ReadonlyArray<ExecutiveRuntimeSurfaceContract>;
  readonly activeSubject?: ExecutiveRuntimeSubjectReference;
  readonly activeSurface?: ExecutiveRuntimeSurfaceReference;
  readonly focus?: ExecutiveRuntimeFocusContract;
  readonly attention?: ExecutiveRuntimeAttentionContract;
  readonly presentation?: ExecutiveRuntimePresentationContract;
  readonly interactionContext?: ExecutiveRuntimeInteractionContext;
  readonly readiness?: ExecutiveRuntimeReadinessContract;
  readonly authority?: ExecutiveRuntimeAuthorityContract;
  readonly experienceId?: string;
  readonly runtimeState?: ExecutiveRuntimeBoundRuntimeState;
  readonly activationState?: ExecutiveRuntimeBoundActivationState;
  readonly snapshotId?: string;
  readonly contractVersion?: string;
}

// ─── Bound contracts ────────────────────────────────────────────────────────

export interface BoundExecutiveRuntimeContext {
  readonly experienceId: string;
  readonly activeSubject?: ExecutiveRuntimeSubjectReference;
  readonly activeSurface?: ExecutiveRuntimeSurfaceReference;
  readonly runtimeState: ExecutiveRuntimeBoundRuntimeState;
  readonly activationState: ExecutiveRuntimeBoundActivationState;
  readonly readiness: ExecutiveRuntimeReadinessContract;
  readonly authority: ExecutiveRuntimeAuthorityContract;
  readonly contractVersion: typeof runtimeEnabledExecutiveExperienceContractsVersion;
  readonly bindingIdentity: typeof runtimeEnabledExecutiveExperienceStateBindingIdentity;
  readonly bindingVersion: typeof runtimeEnabledExecutiveExperienceStateBindingVersion;
  readonly runtimeSource: ExecutiveRuntimeAuthorityContract["runtimeSource"];
}

export interface BoundExecutiveRuntimeSurfaceState {
  readonly surface: ExecutiveRuntimeBoundSurfaceName;
  readonly surfaceReference: ExecutiveRuntimeSurfaceReference;
  readonly activeSubject?: ExecutiveRuntimeSubjectReference;
  readonly focus?: ExecutiveRuntimeFocusContract;
  readonly attention?: ExecutiveRuntimeAttentionContract;
  readonly presentation?: ExecutiveRuntimePresentationContract;
  readonly interactionContext?: ExecutiveRuntimeInteractionContext;
  readonly readiness: ExecutiveRuntimeBoundRuntimeState;
  readonly activation: ExecutiveRuntimeBoundActivationState;
  readonly availability: ExecutiveRuntimeBoundRuntimeState;
}

export interface BoundExecutiveRuntimeExperienceState {
  readonly context: BoundExecutiveRuntimeContext;
  readonly activeSubject?: ExecutiveRuntimeSubjectReference;
  readonly activeSurface?: ExecutiveRuntimeSurfaceReference;
  readonly surfaceStates: ReadonlyArray<BoundExecutiveRuntimeSurfaceState>;
  readonly focus?: ExecutiveRuntimeFocusContract;
  readonly attention?: ExecutiveRuntimeAttentionContract;
  readonly presentation?: ExecutiveRuntimePresentationContract;
  readonly interactionContext?: ExecutiveRuntimeInteractionContext;
  readonly readiness: ExecutiveRuntimeReadinessContract;
  readonly authority: ExecutiveRuntimeAuthorityContract;
  readonly contractIdentity: typeof runtimeEnabledExecutiveExperienceContractsIdentity;
  readonly contractVersion: typeof runtimeEnabledExecutiveExperienceContractsVersion;
  readonly bindingIdentity: typeof runtimeEnabledExecutiveExperienceStateBindingIdentity;
  readonly bindingVersion: typeof runtimeEnabledExecutiveExperienceStateBindingVersion;
}

export interface ExecutiveRuntimeBoundSnapshot {
  readonly snapshotId: string;
  readonly context: BoundExecutiveRuntimeContext;
  readonly surfaceStates: ReadonlyArray<BoundExecutiveRuntimeSurfaceState>;
  readonly activeSubject?: ExecutiveRuntimeSubjectReference;
  readonly activeSurface?: ExecutiveRuntimeSurfaceReference;
  readonly focus?: ExecutiveRuntimeFocusContract;
  readonly attention?: ExecutiveRuntimeAttentionContract;
  readonly presentation?: ExecutiveRuntimePresentationContract;
  readonly readiness: ExecutiveRuntimeReadinessContract;
  readonly authority: ExecutiveRuntimeAuthorityContract;
  readonly sourceVersion: ExecutiveRuntimeAuthorityContract["sourceVersion"];
  readonly bindingIdentity: typeof runtimeEnabledExecutiveExperienceStateBindingIdentity;
  readonly bindingVersion: typeof runtimeEnabledExecutiveExperienceStateBindingVersion;
  readonly timestampIso?: string;
}

export interface ExecutiveRuntimeBindingResult {
  readonly status: ExecutiveRuntimeBindingStatus;
  readonly boundState?: BoundExecutiveRuntimeExperienceState;
  readonly issues: ReadonlyArray<ExecutiveRuntimeBindingIssue>;
  readonly sourceIdentity: typeof runtimeEnabledExecutiveExperienceStateBindingIdentity;
  readonly sourceVersion: typeof runtimeEnabledExecutiveExperienceStateBindingVersion;
  readonly contractIdentity: typeof runtimeEnabledExecutiveExperienceContractsIdentity;
  readonly contractVersion: typeof runtimeEnabledExecutiveExperienceContractsVersion;
}

// ─── Guarantees ─────────────────────────────────────────────────────────────

export const EXECUTIVE_RUNTIME_STATE_BINDING_GUARANTEES = Object.freeze([
  Object.freeze({
    id: "depends-only-on-rex-1-2",
    order: 1,
    statement: "REX-1:3 depends only on REX-1:2.",
  }),
  Object.freeze({
    id: "framework-neutral-binding",
    order: 2,
    statement: "Binding is framework-neutral.",
  }),
  Object.freeze({
    id: "deterministic-binding-functions",
    order: 3,
    statement: "Binding functions are deterministic.",
  }),
  Object.freeze({
    id: "no-caller-input-mutation",
    order: 4,
    statement: "Caller-owned inputs are never mutated.",
  }),
  Object.freeze({
    id: "runtime-authority-preserved",
    order: 5,
    statement: "Runtime authority is preserved.",
  }),
  Object.freeze({
    id: "focus-bound-not-calculated",
    order: 6,
    statement: "Focus is bound, not calculated.",
  }),
  Object.freeze({
    id: "attention-bound-not-calculated",
    order: 7,
    statement: "Attention is bound, not calculated.",
  }),
  Object.freeze({
    id: "presentation-bound-not-resolved",
    order: 8,
    statement: "Presentation is bound, not resolved.",
  }),
  Object.freeze({
    id: "readiness-preserved-not-fabricated",
    order: 9,
    statement: "Readiness is preserved, not fabricated.",
  }),
  Object.freeze({
    id: "subject-ids-never-invented",
    order: 10,
    statement: "Subject IDs are never invented.",
  }),
  Object.freeze({
    id: "surface-activation-never-inferred",
    order: 11,
    statement: "Surface activation is never inferred.",
  }),
  Object.freeze({
    id: "interaction-context-never-executed",
    order: 12,
    statement: "Interaction context is never executed.",
  }),
  Object.freeze({
    id: "no-ui-rendering-behavior",
    order: 13,
    statement: "No UI rendering behavior is introduced.",
  }),
  Object.freeze({
    id: "no-react-dependency",
    order: 14,
    statement: "No React dependency is introduced.",
  }),
  Object.freeze({
    id: "no-threejs-dependency",
    order: 15,
    statement: "No Three.js dependency is introduced.",
  }),
  Object.freeze({
    id: "no-ai-reasoning",
    order: 16,
    statement: "No AI reasoning is introduced.",
  }),
  Object.freeze({
    id: "no-kpi-calculation",
    order: 17,
    statement: "No KPI calculation is introduced.",
  }),
  Object.freeze({
    id: "no-koi-calculation",
    order: 18,
    statement: "No KOI calculation is introduced.",
  }),
  Object.freeze({
    id: "no-persistence",
    order: 19,
    statement: "No persistence is introduced.",
  }),
  Object.freeze({
    id: "no-networking",
    order: 20,
    statement: "No networking is introduced.",
  }),
  Object.freeze({
    id: "no-global-store",
    order: 21,
    statement: "No global store is introduced.",
  }),
  Object.freeze({
    id: "no-event-bus",
    order: 22,
    statement: "No event bus is introduced.",
  }),
  Object.freeze({
    id: "canonical-surface-order-preserved",
    order: 23,
    statement: "Canonical surface order is preserved.",
  }),
  Object.freeze({
    id: "presentation-states-unchanged",
    order: 24,
    statement: "Canonical presentation states remain unchanged.",
  }),
  Object.freeze({
    id: "partial-data-handled-deterministically",
    order: 25,
    statement: "Partial runtime data is handled deterministically.",
  }),
] as const);

export type ExecutiveRuntimeStateBindingGuarantee =
  (typeof EXECUTIVE_RUNTIME_STATE_BINDING_GUARANTEES)[number];

export const EXECUTIVE_RUNTIME_STATE_BINDING_FORBIDDEN_RESPONSIBILITIES =
  Object.freeze([
    "Executive Stage binding",
    "scene graph binding",
    "React integration",
    "Three.js adapters",
    "Advisor runtime behavior",
    "Insight runtime behavior",
    "Timeline runtime behavior",
    "Explorer runtime behavior",
    "user interaction orchestration",
    "adaptive presentation decisions",
    "focus calculation",
    "attention calculation",
    "KPI calculation",
    "KOI calculation",
    "AI reasoning",
    "persistence",
    "networking",
    "global store",
    "event bus",
  ] as const);

export const EXECUTIVE_RUNTIME_STATE_BINDING_REGISTRY_SECTIONS = Object.freeze([
  "Identity",
  "Dependency",
  "Input",
  "ContextBinding",
  "SubjectBinding",
  "SurfaceBinding",
  "FocusBinding",
  "AttentionBinding",
  "PresentationBinding",
  "ReadinessBinding",
  "AuthorityBinding",
  "InteractionBinding",
  "Snapshot",
  "Status",
  "Issues",
  "Validation",
  "Guarantees",
] as const);

// ─── Helpers ────────────────────────────────────────────────────────────────

function issue(
  code: ExecutiveRuntimeBindingIssueCode,
  message: string,
  path?: string,
): ExecutiveRuntimeBindingIssue {
  return Object.freeze({
    code,
    message,
    ...(path !== undefined ? { path } : {}),
  });
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isBoundSurfaceName(
  value: unknown,
): value is ExecutiveRuntimeBoundSurfaceName {
  return (
    EXECUTIVE_RUNTIME_BOUND_SURFACE_ORDER as readonly unknown[]
  ).includes(value);
}

function surfaceOrderIndex(surface: string): number {
  const index = (
    EXECUTIVE_RUNTIME_BOUND_SURFACE_ORDER as readonly string[]
  ).indexOf(surface);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

function resolveBindingInput(input: ExecutiveRuntimeStateBindingInput): {
  readonly experienceId?: string;
  readonly runtimeState?: ExecutiveRuntimeBoundRuntimeState;
  readonly activationState?: ExecutiveRuntimeBoundActivationState;
  readonly activeSubject?: ExecutiveRuntimeSubjectReference;
  readonly activeSurface?: ExecutiveRuntimeSurfaceReference;
  readonly surfaceContracts: ReadonlyArray<ExecutiveRuntimeSurfaceContract>;
  readonly focus?: ExecutiveRuntimeFocusContract;
  readonly attention?: ExecutiveRuntimeAttentionContract;
  readonly presentation?: ExecutiveRuntimePresentationContract;
  readonly interactionContext?: ExecutiveRuntimeInteractionContext;
  readonly readiness?: ExecutiveRuntimeReadinessContract;
  readonly authority?: ExecutiveRuntimeAuthorityContract;
  readonly snapshotId?: string;
  readonly contractVersion?: string;
} {
  const experience = input.experienceContract;
  return {
    experienceId:
      input.experienceId ?? experience?.experienceContext.experienceId,
    runtimeState:
      input.runtimeState ?? experience?.experienceContext.runtimeState,
    activationState:
      input.activationState ?? experience?.experienceContext.activationState,
    activeSubject: input.activeSubject ?? experience?.activeSubject,
    activeSurface: input.activeSurface ?? experience?.activeSurface,
    surfaceContracts:
      input.surfaceContracts ?? experience?.surfaceContracts ?? [],
    focus: input.focus ?? experience?.focus,
    attention: input.attention ?? experience?.attention,
    presentation: input.presentation ?? experience?.presentation,
    interactionContext:
      input.interactionContext ??
      experience?.surfaceContracts.find(
        (surface) => surface.interactionContext !== undefined,
      )?.interactionContext,
    readiness: input.readiness ?? experience?.readiness,
    authority: input.authority ?? experience?.authority,
    snapshotId: input.snapshotId ?? experience?.currentSnapshot.snapshotId,
    contractVersion: input.contractVersion ?? experience?.contractVersion,
  };
}

// ─── Validation ─────────────────────────────────────────────────────────────

export function validateExecutiveRuntimeStateBindingInput(
  input: unknown,
): ReadonlyArray<ExecutiveRuntimeBindingIssue> {
  if (!isPlainObject(input)) {
    return Object.freeze([
      issue(
        "missing-runtime-context",
        "binding input must be a plain object",
        "input",
      ),
    ]);
  }

  const issues: ExecutiveRuntimeBindingIssue[] = [];
  const resolved = resolveBindingInput(
    input as ExecutiveRuntimeStateBindingInput,
  );

  if (resolved.authority === undefined) {
    issues.push(
      issue(
        "missing-runtime-authority",
        "runtime authority is required for binding",
        "authority",
      ),
    );
  } else if (!verifyExecutiveRuntimeAuthorityContract(resolved.authority)) {
    issues.push(
      issue(
        "missing-runtime-authority",
        "runtime authority must preserve EX-DRI → REX",
        "authority",
      ),
    );
  }

  if (
    resolved.activeSubject !== undefined &&
    !isExecutiveRuntimeSubjectReference(resolved.activeSubject)
  ) {
    issues.push(
      issue(
        "invalid-active-subject",
        "active subject is structurally invalid",
        "activeSubject",
      ),
    );
  }

  if (
    resolved.activeSurface !== undefined &&
    (!isExecutiveRuntimeSurfaceReference(resolved.activeSurface) ||
      !isBoundSurfaceName(resolved.activeSurface.surface))
  ) {
    issues.push(
      issue(
        "invalid-active-surface",
        "active surface is structurally invalid or non-canonical",
        "activeSurface",
      ),
    );
  }

  if (
    resolved.readiness !== undefined &&
    !verifyExecutiveRuntimeReadinessContract(resolved.readiness)
  ) {
    issues.push(
      issue(
        "inconsistent-readiness",
        "readiness contract fields must be booleans",
        "readiness",
      ),
    );
  }

  if (
    resolved.focus !== undefined &&
    !verifyExecutiveRuntimeFocusContract(resolved.focus)
  ) {
    issues.push(
      issue("invalid-focus", "focus contract is structurally invalid", "focus"),
    );
  }

  if (
    resolved.attention !== undefined &&
    !verifyExecutiveRuntimeAttentionContract(resolved.attention)
  ) {
    issues.push(
      issue(
        "invalid-attention",
        "attention contract is structurally invalid",
        "attention",
      ),
    );
  }

  if (
    resolved.presentation !== undefined &&
    !verifyExecutiveRuntimePresentationContract(resolved.presentation)
  ) {
    issues.push(
      issue(
        "invalid-presentation",
        "presentation contract is structurally invalid",
        "presentation",
      ),
    );
  }

  const seen = new Set<string>();
  resolved.surfaceContracts.forEach((surfaceContract, index) => {
    if (!isPlainObject(surfaceContract)) {
      issues.push(
        issue(
          "invalid-surface-contract",
          "surface contract must be a plain object",
          `surfaceContracts[${index}]`,
        ),
      );
      return;
    }
    if (
      !isExecutiveRuntimeSurfaceReference(surfaceContract.surface) ||
      !isBoundSurfaceName(surfaceContract.surface.surface)
    ) {
      issues.push(
        issue(
          "invalid-surface-contract",
          "surface reference is invalid or non-canonical",
          `surfaceContracts[${index}].surface`,
        ),
      );
      return;
    }
    const key = surfaceContract.surface.surface;
    if (seen.has(key)) {
      issues.push(
        issue(
          "duplicate-surface",
          `duplicate surface binding for ${key}`,
          `surfaceContracts[${index}].surface`,
        ),
      );
    }
    seen.add(key);
  });

  return Object.freeze(issues);
}

export function validateBoundExecutiveRuntimeContext(
  value: unknown,
): value is BoundExecutiveRuntimeContext {
  if (!isPlainObject(value)) return false;
  return (
    typeof value.experienceId === "string" &&
    value.experienceId.length > 0 &&
    typeof value.runtimeState === "string" &&
    typeof value.activationState === "string" &&
    verifyExecutiveRuntimeReadinessContract(value.readiness) &&
    verifyExecutiveRuntimeAuthorityContract(value.authority) &&
    value.contractVersion ===
      runtimeEnabledExecutiveExperienceContractsVersion &&
    value.bindingIdentity ===
      runtimeEnabledExecutiveExperienceStateBindingIdentity &&
    value.bindingVersion ===
      runtimeEnabledExecutiveExperienceStateBindingVersion
  );
}

export function validateBoundExecutiveRuntimeExperienceState(
  value: unknown,
): value is BoundExecutiveRuntimeExperienceState {
  if (!isPlainObject(value)) return false;
  if (!validateBoundExecutiveRuntimeContext(value.context)) return false;
  if (!Array.isArray(value.surfaceStates)) return false;
  return (
    verifyExecutiveRuntimeReadinessContract(value.readiness) &&
    verifyExecutiveRuntimeAuthorityContract(value.authority) &&
    value.contractIdentity ===
      runtimeEnabledExecutiveExperienceContractsIdentity &&
    value.contractVersion ===
      runtimeEnabledExecutiveExperienceContractsVersion &&
    value.bindingIdentity ===
      runtimeEnabledExecutiveExperienceStateBindingIdentity &&
    value.bindingVersion ===
      runtimeEnabledExecutiveExperienceStateBindingVersion
  );
}

// ─── Binding helpers ────────────────────────────────────────────────────────

export function bindExecutiveRuntimeActiveSubject(
  subject: ExecutiveRuntimeSubjectReference | undefined,
): ExecutiveRuntimeSubjectReference | undefined {
  if (subject === undefined) return undefined;
  if (!isExecutiveRuntimeSubjectReference(subject)) {
    throw new TypeError("active subject is structurally invalid");
  }
  return createExecutiveRuntimeSubjectReference(subject);
}

export function bindExecutiveRuntimeActiveSurface(
  surface: ExecutiveRuntimeSurfaceReference | undefined,
): ExecutiveRuntimeSurfaceReference | undefined {
  if (surface === undefined) return undefined;
  if (
    !isExecutiveRuntimeSurfaceReference(surface) ||
    !isBoundSurfaceName(surface.surface)
  ) {
    throw new TypeError(
      "active surface is structurally invalid or non-canonical",
    );
  }
  return createExecutiveRuntimeSurfaceReference(surface);
}

export function bindExecutiveRuntimeFocus(
  focus: ExecutiveRuntimeFocusContract | undefined,
): ExecutiveRuntimeFocusContract | undefined {
  if (focus === undefined) return undefined;
  if (!verifyExecutiveRuntimeFocusContract(focus)) {
    throw new TypeError("focus contract is structurally invalid");
  }
  return createExecutiveRuntimeFocusContract(focus);
}

export function bindExecutiveRuntimeAttention(
  attention: ExecutiveRuntimeAttentionContract | undefined,
): ExecutiveRuntimeAttentionContract | undefined {
  if (attention === undefined) return undefined;
  if (!verifyExecutiveRuntimeAttentionContract(attention)) {
    throw new TypeError("attention contract is structurally invalid");
  }
  return createExecutiveRuntimeAttentionContract(attention);
}

export function bindExecutiveRuntimePresentation(
  presentation: ExecutiveRuntimePresentationContract | undefined,
): ExecutiveRuntimePresentationContract | undefined {
  if (presentation === undefined) return undefined;
  if (!verifyExecutiveRuntimePresentationContract(presentation)) {
    throw new TypeError("presentation contract is structurally invalid");
  }
  return createExecutiveRuntimePresentationContract(presentation);
}

export function bindExecutiveRuntimeReadiness(
  readiness: ExecutiveRuntimeReadinessContract | undefined,
): ExecutiveRuntimeReadinessContract | undefined {
  if (readiness === undefined) return undefined;
  if (!verifyExecutiveRuntimeReadinessContract(readiness)) {
    throw new TypeError("readiness contract is structurally invalid");
  }
  return createExecutiveRuntimeReadinessContract(readiness);
}

export function bindExecutiveRuntimeAuthority(
  authority: ExecutiveRuntimeAuthorityContract | undefined,
): ExecutiveRuntimeAuthorityContract | undefined {
  if (authority === undefined) return undefined;
  if (!verifyExecutiveRuntimeAuthorityContract(authority)) {
    throw new TypeError(
      "runtime authority must preserve EX-DRI → REX and must not be rewritten",
    );
  }
  return createExecutiveRuntimeAuthorityContract(authority);
}

export function bindExecutiveRuntimeInteractionContext(
  interactionContext: ExecutiveRuntimeInteractionContext | undefined,
): ExecutiveRuntimeInteractionContext | undefined {
  if (interactionContext === undefined) return undefined;
  if (
    typeof interactionContext.interactionId !== "string" ||
    interactionContext.interactionId.length === 0
  ) {
    throw new TypeError("interaction context is structurally invalid");
  }
  return createExecutiveRuntimeInteractionContext(interactionContext);
}

export function bindExecutiveRuntimeSurfaceState(
  surfaceContract: ExecutiveRuntimeSurfaceContract,
): BoundExecutiveRuntimeSurfaceState {
  if (
    !isExecutiveRuntimeSurfaceReference(surfaceContract.surface) ||
    !isBoundSurfaceName(surfaceContract.surface.surface)
  ) {
    throw new TypeError(
      "surface contract surface is invalid or non-canonical",
    );
  }

  const surfaceReference = createExecutiveRuntimeSurfaceReference(
    surfaceContract.surface,
  );

  return Object.freeze({
    surface: surfaceReference.surface as ExecutiveRuntimeBoundSurfaceName,
    surfaceReference,
    readiness: surfaceContract.readiness,
    activation: surfaceContract.activation,
    availability: surfaceReference.runtimeState,
    ...(surfaceContract.currentSubject !== undefined
      ? {
          activeSubject: bindExecutiveRuntimeActiveSubject(
            surfaceContract.currentSubject,
          ),
        }
      : {}),
    ...(surfaceContract.focus !== undefined
      ? { focus: bindExecutiveRuntimeFocus(surfaceContract.focus) }
      : {}),
    ...(surfaceContract.attention !== undefined
      ? { attention: bindExecutiveRuntimeAttention(surfaceContract.attention) }
      : {}),
    ...(surfaceContract.presentation !== undefined
      ? {
          presentation: bindExecutiveRuntimePresentation(
            surfaceContract.presentation,
          ),
        }
      : {}),
    ...(surfaceContract.interactionContext !== undefined
      ? {
          interactionContext: bindExecutiveRuntimeInteractionContext(
            surfaceContract.interactionContext,
          ),
        }
      : {}),
  });
}

/**
 * Sparse surface collection binding:
 * only explicitly provided surface contracts are bound; ordered by
 * EXECUTIVE_RUNTIME_BOUND_SURFACE_ORDER. Absent canonical surfaces are omitted.
 */
export function bindExecutiveRuntimeSurfaceStates(
  surfaceContracts: ReadonlyArray<ExecutiveRuntimeSurfaceContract>,
): ReadonlyArray<BoundExecutiveRuntimeSurfaceState> {
  const bound = surfaceContracts.map((surfaceContract) =>
    bindExecutiveRuntimeSurfaceState(surfaceContract),
  );
  const ordered = [...bound].sort(
    (left, right) =>
      surfaceOrderIndex(left.surface) - surfaceOrderIndex(right.surface),
  );
  return Object.freeze(ordered);
}

export function bindExecutiveRuntimeContext(
  input: ExecutiveRuntimeStateBindingInput,
): BoundExecutiveRuntimeContext {
  const resolved = resolveBindingInput(input);
  const authority = bindExecutiveRuntimeAuthority(resolved.authority);
  if (authority === undefined) {
    throw new TypeError("runtime authority is required for context binding");
  }
  const readiness = bindExecutiveRuntimeReadiness(resolved.readiness);
  if (readiness === undefined) {
    throw new TypeError("readiness is required for context binding");
  }
  if (
    typeof resolved.experienceId !== "string" ||
    resolved.experienceId.length === 0
  ) {
    throw new TypeError("experienceId is required for context binding");
  }
  if (resolved.runtimeState === undefined) {
    throw new TypeError("runtimeState is required for context binding");
  }
  if (resolved.activationState === undefined) {
    throw new TypeError("activationState is required for context binding");
  }

  return Object.freeze({
    experienceId: resolved.experienceId,
    runtimeState: resolved.runtimeState,
    activationState: resolved.activationState,
    readiness,
    authority,
    contractVersion: runtimeEnabledExecutiveExperienceContractsVersion,
    bindingIdentity: runtimeEnabledExecutiveExperienceStateBindingIdentity,
    bindingVersion: runtimeEnabledExecutiveExperienceStateBindingVersion,
    runtimeSource: authority.runtimeSource,
    ...(resolved.activeSubject !== undefined
      ? {
          activeSubject: bindExecutiveRuntimeActiveSubject(
            resolved.activeSubject,
          ),
        }
      : {}),
    ...(resolved.activeSurface !== undefined
      ? {
          activeSurface: bindExecutiveRuntimeActiveSurface(
            resolved.activeSurface,
          ),
        }
      : {}),
  });
}

function deriveBindingStatus(args: {
  readonly issues: ReadonlyArray<ExecutiveRuntimeBindingIssue>;
  readonly readiness?: ExecutiveRuntimeReadinessContract;
  readonly runtimeState?: ExecutiveRuntimeBoundRuntimeState;
  readonly hasContext: boolean;
  readonly partialAbsences: boolean;
}): ExecutiveRuntimeBindingStatus {
  const hasInvalid = args.issues.some((entry) =>
    (
      [
        "invalid-active-surface",
        "invalid-active-subject",
        "invalid-focus",
        "invalid-attention",
        "invalid-presentation",
        "invalid-interaction-context",
        "invalid-surface-contract",
        "duplicate-surface",
        "inconsistent-readiness",
        "missing-runtime-authority",
      ] as readonly ExecutiveRuntimeBindingIssueCode[]
    ).includes(entry.code),
  );
  if (hasInvalid) return "invalid";

  if (
    !args.hasContext ||
    args.runtimeState === "unavailable" ||
    args.readiness?.runtimeAvailable === false
  ) {
    return "unavailable";
  }

  if (args.partialAbsences || args.readiness?.overallReady === false) {
    return "partial";
  }

  return "bound";
}

export function bindExecutiveRuntimeExperienceState(
  input: ExecutiveRuntimeStateBindingInput,
): ExecutiveRuntimeBindingResult {
  const validationIssues = validateExecutiveRuntimeStateBindingInput(input);
  const resolved = resolveBindingInput(input);

  const hardInvalid = validationIssues.some((entry) =>
    (
      [
        "invalid-active-surface",
        "invalid-active-subject",
        "invalid-focus",
        "invalid-attention",
        "invalid-presentation",
        "invalid-surface-contract",
        "duplicate-surface",
        "inconsistent-readiness",
        "missing-runtime-authority",
      ] as readonly ExecutiveRuntimeBindingIssueCode[]
    ).includes(entry.code),
  );

  if (hardInvalid) {
    return Object.freeze({
      status: "invalid" as const,
      issues: validationIssues,
      sourceIdentity: runtimeEnabledExecutiveExperienceStateBindingIdentity,
      sourceVersion: runtimeEnabledExecutiveExperienceStateBindingVersion,
      contractIdentity: runtimeEnabledExecutiveExperienceContractsIdentity,
      contractVersion: runtimeEnabledExecutiveExperienceContractsVersion,
    });
  }

  const issues: ExecutiveRuntimeBindingIssue[] = [...validationIssues];

  if (
    typeof resolved.experienceId !== "string" ||
    resolved.experienceId.length === 0 ||
    resolved.runtimeState === undefined ||
    resolved.activationState === undefined ||
    resolved.readiness === undefined
  ) {
    issues.push(
      issue(
        "missing-runtime-context",
        "experience identity, runtime state, activation, and readiness are required",
        "experienceContext",
      ),
    );
    return Object.freeze({
      status: "unavailable" as const,
      issues: Object.freeze(issues),
      sourceIdentity: runtimeEnabledExecutiveExperienceStateBindingIdentity,
      sourceVersion: runtimeEnabledExecutiveExperienceStateBindingVersion,
      contractIdentity: runtimeEnabledExecutiveExperienceContractsIdentity,
      contractVersion: runtimeEnabledExecutiveExperienceContractsVersion,
    });
  }

  if (resolved.surfaceContracts.length === 0) {
    issues.push(
      issue(
        "missing-surface-state",
        "no surface contracts were provided for binding",
        "surfaceContracts",
      ),
    );
  }

  if (resolved.presentation === undefined) {
    issues.push(
      issue(
        "presentation-unavailable",
        "presentation contract was not provided",
        "presentation",
      ),
    );
  }

  const authority = bindExecutiveRuntimeAuthority(resolved.authority)!;
  const readiness = bindExecutiveRuntimeReadiness(resolved.readiness)!;
  const activeSubject = bindExecutiveRuntimeActiveSubject(
    resolved.activeSubject,
  );
  const activeSurface = bindExecutiveRuntimeActiveSurface(
    resolved.activeSurface,
  );
  const focus = bindExecutiveRuntimeFocus(resolved.focus);
  const attention = bindExecutiveRuntimeAttention(resolved.attention);
  const presentation = bindExecutiveRuntimePresentation(resolved.presentation);
  const interactionContext = bindExecutiveRuntimeInteractionContext(
    resolved.interactionContext,
  );
  const surfaceStates = bindExecutiveRuntimeSurfaceStates(
    resolved.surfaceContracts,
  );

  const context = Object.freeze({
    experienceId: resolved.experienceId,
    runtimeState: resolved.runtimeState,
    activationState: resolved.activationState,
    readiness,
    authority,
    contractVersion: runtimeEnabledExecutiveExperienceContractsVersion,
    bindingIdentity: runtimeEnabledExecutiveExperienceStateBindingIdentity,
    bindingVersion: runtimeEnabledExecutiveExperienceStateBindingVersion,
    runtimeSource: authority.runtimeSource,
    ...(activeSubject !== undefined ? { activeSubject } : {}),
    ...(activeSurface !== undefined ? { activeSurface } : {}),
  });

  const boundState: BoundExecutiveRuntimeExperienceState = Object.freeze({
    context,
    surfaceStates,
    readiness,
    authority,
    contractIdentity: runtimeEnabledExecutiveExperienceContractsIdentity,
    contractVersion: runtimeEnabledExecutiveExperienceContractsVersion,
    bindingIdentity: runtimeEnabledExecutiveExperienceStateBindingIdentity,
    bindingVersion: runtimeEnabledExecutiveExperienceStateBindingVersion,
    ...(activeSubject !== undefined ? { activeSubject } : {}),
    ...(activeSurface !== undefined ? { activeSurface } : {}),
    ...(focus !== undefined ? { focus } : {}),
    ...(attention !== undefined ? { attention } : {}),
    ...(presentation !== undefined ? { presentation } : {}),
    ...(interactionContext !== undefined ? { interactionContext } : {}),
  });

  const partialAbsences =
    activeSubject === undefined ||
    activeSurface === undefined ||
    focus === undefined ||
    attention === undefined ||
    presentation === undefined ||
    interactionContext === undefined ||
    surfaceStates.length === 0;

  const status = deriveBindingStatus({
    issues,
    readiness,
    runtimeState: resolved.runtimeState,
    hasContext: true,
    partialAbsences,
  });

  return Object.freeze({
    status,
    boundState,
    issues: Object.freeze(issues),
    sourceIdentity: runtimeEnabledExecutiveExperienceStateBindingIdentity,
    sourceVersion: runtimeEnabledExecutiveExperienceStateBindingVersion,
    contractIdentity: runtimeEnabledExecutiveExperienceContractsIdentity,
    contractVersion: runtimeEnabledExecutiveExperienceContractsVersion,
  });
}

export function createExecutiveRuntimeBoundSnapshot(input: {
  readonly snapshotId: string;
  readonly boundState: BoundExecutiveRuntimeExperienceState;
  readonly timestampIso?: string;
}): ExecutiveRuntimeBoundSnapshot {
  if (
    typeof input.snapshotId !== "string" ||
    input.snapshotId.length === 0
  ) {
    throw new TypeError("snapshotId must be a non-empty opaque identifier");
  }
  if (!validateBoundExecutiveRuntimeExperienceState(input.boundState)) {
    throw new TypeError("boundState must be a valid bound experience state");
  }

  return Object.freeze({
    snapshotId: input.snapshotId,
    context: input.boundState.context,
    surfaceStates: input.boundState.surfaceStates,
    readiness: input.boundState.readiness,
    authority: input.boundState.authority,
    sourceVersion: input.boundState.authority.sourceVersion,
    bindingIdentity: runtimeEnabledExecutiveExperienceStateBindingIdentity,
    bindingVersion: runtimeEnabledExecutiveExperienceStateBindingVersion,
    ...(input.boundState.activeSubject !== undefined
      ? { activeSubject: input.boundState.activeSubject }
      : {}),
    ...(input.boundState.activeSurface !== undefined
      ? { activeSurface: input.boundState.activeSurface }
      : {}),
    ...(input.boundState.focus !== undefined
      ? { focus: input.boundState.focus }
      : {}),
    ...(input.boundState.attention !== undefined
      ? { attention: input.boundState.attention }
      : {}),
    ...(input.boundState.presentation !== undefined
      ? { presentation: input.boundState.presentation }
      : {}),
    ...(input.timestampIso !== undefined
      ? { timestampIso: input.timestampIso }
      : {}),
  });
}

export function getRuntimeEnabledExecutiveExperienceStateBindingIdentity():
  typeof runtimeEnabledExecutiveExperienceStateBindingCanonicalIdentity {
  return runtimeEnabledExecutiveExperienceStateBindingCanonicalIdentity;
}

export function isExecutiveRuntimeBindingStatus(
  value: unknown,
): value is ExecutiveRuntimeBindingStatus {
  return (
    EXECUTIVE_RUNTIME_BINDING_STATUSES as readonly unknown[]
  ).includes(value);
}

export function isExecutiveRuntimeBindingIssueCode(
  value: unknown,
): value is ExecutiveRuntimeBindingIssueCode {
  return (
    EXECUTIVE_RUNTIME_BINDING_ISSUE_CODES as readonly unknown[]
  ).includes(value);
}

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeEnabledExecutiveExperienceStateBindingApiNames =
  Object.freeze([
    "getRuntimeEnabledExecutiveExperienceStateBindingIdentity",
    "validateExecutiveRuntimeStateBindingInput",
    "validateBoundExecutiveRuntimeContext",
    "validateBoundExecutiveRuntimeExperienceState",
    "bindExecutiveRuntimeActiveSubject",
    "bindExecutiveRuntimeActiveSurface",
    "bindExecutiveRuntimeFocus",
    "bindExecutiveRuntimeAttention",
    "bindExecutiveRuntimePresentation",
    "bindExecutiveRuntimeReadiness",
    "bindExecutiveRuntimeAuthority",
    "bindExecutiveRuntimeInteractionContext",
    "bindExecutiveRuntimeContext",
    "bindExecutiveRuntimeSurfaceState",
    "bindExecutiveRuntimeSurfaceStates",
    "bindExecutiveRuntimeExperienceState",
    "createExecutiveRuntimeBoundSnapshot",
    "isExecutiveRuntimeBindingStatus",
    "isExecutiveRuntimeBindingIssueCode",
    "verifyRuntimeContextStateBinding",
  ] as const);

export const runtimeEnabledExecutiveExperienceStateBindingRegistry =
  Object.freeze({
    identity: runtimeEnabledExecutiveExperienceStateBindingIdentity,
    version: runtimeEnabledExecutiveExperienceStateBindingVersion,
    namespace: runtimeEnabledExecutiveExperienceStateBindingNamespace,
    layer: runtimeEnabledExecutiveExperienceStateBindingLayer,
    phase: runtimeEnabledExecutiveExperienceStateBindingPhase,
    stage: runtimeEnabledExecutiveExperienceStateBindingStage,
    dependencyIdentity:
      runtimeEnabledExecutiveExperienceStateBindingDependencyIdentity,
    dependencyPath:
      runtimeEnabledExecutiveExperienceStateBindingDependencyPath,
    sections: EXECUTIVE_RUNTIME_STATE_BINDING_REGISTRY_SECTIONS,
    sectionCount: EXECUTIVE_RUNTIME_STATE_BINDING_REGISTRY_SECTIONS.length,
    surfaceOrder: EXECUTIVE_RUNTIME_BOUND_SURFACE_ORDER,
    surfaceOrderCount: EXECUTIVE_RUNTIME_BOUND_SURFACE_ORDER.length,
    statuses: EXECUTIVE_RUNTIME_BINDING_STATUSES,
    statusCount: EXECUTIVE_RUNTIME_BINDING_STATUSES.length,
    issueCodes: EXECUTIVE_RUNTIME_BINDING_ISSUE_CODES,
    issueCodeCount: EXECUTIVE_RUNTIME_BINDING_ISSUE_CODES.length,
    guarantees: EXECUTIVE_RUNTIME_STATE_BINDING_GUARANTEES,
    guaranteeCount: EXECUTIVE_RUNTIME_STATE_BINDING_GUARANTEES.length,
    publicApis: runtimeEnabledExecutiveExperienceStateBindingApiNames,
    publicApiCount:
      runtimeEnabledExecutiveExperienceStateBindingApiNames.length,
    sparseSurfaceBinding: true as const,
  });

export const runtimeEnabledExecutiveExperienceStateBinding = Object.freeze({
  phase: "REX-1" as const,
  name: "RuntimeContextStateBinding" as const,
  identity: runtimeEnabledExecutiveExperienceStateBindingIdentity,
  version: runtimeEnabledExecutiveExperienceStateBindingVersion,
  namespace: runtimeEnabledExecutiveExperienceStateBindingNamespace,
  layer: runtimeEnabledExecutiveExperienceStateBindingLayer,
  stage: runtimeEnabledExecutiveExperienceStateBindingStage,
  architecturalRole:
    runtimeEnabledExecutiveExperienceStateBindingArchitecturalRole,
  role: "RuntimeContextStateBinding" as const,
  status: runtimeEnabledExecutiveExperienceStateBindingStability,
  upstreamDependency:
    runtimeEnabledExecutiveExperienceStateBindingDependencyIdentity,
  dependencyPath:
    runtimeEnabledExecutiveExperienceStateBindingDependencyPath,
  deterministic:
    runtimeEnabledExecutiveExperienceStateBindingDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  browserIndependent: true as const,
  binding: true as const,
  principle: EXECUTIVE_RUNTIME_STATE_BINDING_PRINCIPLE,
  boundary: EXECUTIVE_RUNTIME_STATE_BINDING_BOUNDARY,
  surfaceOrder: EXECUTIVE_RUNTIME_BOUND_SURFACE_ORDER,
  statuses: EXECUTIVE_RUNTIME_BINDING_STATUSES,
  issueCodes: EXECUTIVE_RUNTIME_BINDING_ISSUE_CODES,
  guarantees: EXECUTIVE_RUNTIME_STATE_BINDING_GUARANTEES,
  forbiddenResponsibilities:
    EXECUTIVE_RUNTIME_STATE_BINDING_FORBIDDEN_RESPONSIBILITIES,
  publicApiSurface: runtimeEnabledExecutiveExperienceStateBindingApiNames,
  registry: runtimeEnabledExecutiveExperienceStateBindingRegistry,
  contractsBoundary: "REX-1:2-contracts-only" as const,
  architecturalStatus:
    "Binding Complete · Deterministic · Immutable · Framework-Independent · ReadyForExecutiveSceneBinding" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface RuntimeContextStateBindingVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeEnabledExecutiveExperienceStateBindingIdentity;
  readonly version: typeof runtimeEnabledExecutiveExperienceStateBindingVersion;
  readonly namespace: typeof runtimeEnabledExecutiveExperienceStateBindingNamespace;
  readonly layer: typeof runtimeEnabledExecutiveExperienceStateBindingLayer;
  readonly phase: typeof runtimeEnabledExecutiveExperienceStateBindingPhase;
  readonly stage: typeof runtimeEnabledExecutiveExperienceStateBindingStage;
  readonly architecturalRole: typeof runtimeEnabledExecutiveExperienceStateBindingArchitecturalRole;
  readonly dependencyIdentity: typeof runtimeEnabledExecutiveExperienceStateBindingDependencyIdentity;
  readonly surfaceOrderCount: number;
  readonly statusCount: number;
  readonly issueCodeCount: number;
  readonly guaranteeCount: number;
  readonly registrySectionCount: number;
  readonly publicApiCount: number;
  readonly frozen: boolean;
  readonly contractsBoundaryIntact: boolean;
  readonly frameworkIndependent: boolean;
  readonly guaranteesPresent: boolean;
  readonly sparseSurfaceBinding: boolean;
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

export function verifyRuntimeContextStateBinding():
  RuntimeContextStateBindingVerification {
  const binding = runtimeEnabledExecutiveExperienceStateBinding;
  const registry = runtimeEnabledExecutiveExperienceStateBindingRegistry;

  const identityOk =
    binding.identity === "REX-1:3/RuntimeContextStateBinding" &&
    binding.version === "1.3.0" &&
    binding.namespace ===
      "nexora.rex.runtime-enabled-executive-experience.state-binding" &&
    binding.layer === "REX" &&
    binding.phase === "REX-1" &&
    binding.stage === "RuntimeContextStateBinding" &&
    binding.architecturalRole ===
      "ExecutiveRuntimeContextStateBindingBoundary" &&
    binding.upstreamDependency === "REX-1:2/ExecutiveRuntimeContracts" &&
    binding.upstreamDependency ===
      runtimeEnabledExecutiveExperienceContractsIdentity &&
    binding.contractsBoundary === "REX-1:2-contracts-only";

  const dependencyOk =
    binding.dependencyPath ===
      "@/app/lib/rex/runtimeEnabledExecutiveExperienceContracts" &&
    EXECUTIVE_RUNTIME_STATE_BINDING_BOUNDARY.consumesContractsOnly === true &&
    EXECUTIVE_RUNTIME_STATE_BINDING_BOUNDARY.importsFoundationDirectly ===
      false &&
    EXECUTIVE_RUNTIME_STATE_BINDING_BOUNDARY.importsExDriDirectly === false;

  const orderingOk =
    exactOrder(EXECUTIVE_RUNTIME_BOUND_SURFACE_ORDER, [
      "experience",
      "stage",
      "advisor",
      "insight",
      "timeline",
      "explorer",
    ]) &&
    exactOrder(EXECUTIVE_RUNTIME_BINDING_STATUSES, [
      "bound",
      "partial",
      "unavailable",
      "invalid",
    ]) &&
    exactOrder(
      [...EXECUTIVE_RUNTIME_STATE_BINDING_REGISTRY_SECTIONS],
      [
        "Identity",
        "Dependency",
        "Input",
        "ContextBinding",
        "SubjectBinding",
        "SurfaceBinding",
        "FocusBinding",
        "AttentionBinding",
        "PresentationBinding",
        "ReadinessBinding",
        "AuthorityBinding",
        "InteractionBinding",
        "Snapshot",
        "Status",
        "Issues",
        "Validation",
        "Guarantees",
      ],
    );

  const guaranteesPresent =
    EXECUTIVE_RUNTIME_STATE_BINDING_GUARANTEES.length === 25 &&
    exactOrder(
      EXECUTIVE_RUNTIME_STATE_BINDING_GUARANTEES.map((entry) => entry.id),
      [
        "depends-only-on-rex-1-2",
        "framework-neutral-binding",
        "deterministic-binding-functions",
        "no-caller-input-mutation",
        "runtime-authority-preserved",
        "focus-bound-not-calculated",
        "attention-bound-not-calculated",
        "presentation-bound-not-resolved",
        "readiness-preserved-not-fabricated",
        "subject-ids-never-invented",
        "surface-activation-never-inferred",
        "interaction-context-never-executed",
        "no-ui-rendering-behavior",
        "no-react-dependency",
        "no-threejs-dependency",
        "no-ai-reasoning",
        "no-kpi-calculation",
        "no-koi-calculation",
        "no-persistence",
        "no-networking",
        "no-global-store",
        "no-event-bus",
        "canonical-surface-order-preserved",
        "presentation-states-unchanged",
        "partial-data-handled-deterministically",
      ],
    ) &&
    EXECUTIVE_RUNTIME_STATE_BINDING_GUARANTEES.every(
      (entry, index) => entry.order === index + 1,
    );

  const uniquenessOk =
    unique([...EXECUTIVE_RUNTIME_BOUND_SURFACE_ORDER]) &&
    unique([...EXECUTIVE_RUNTIME_BINDING_STATUSES]) &&
    unique([...EXECUTIVE_RUNTIME_BINDING_ISSUE_CODES]) &&
    unique(EXECUTIVE_RUNTIME_STATE_BINDING_GUARANTEES.map((entry) => entry.id));

  const immutabilityOk =
    Object.isFrozen(binding) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(
      runtimeEnabledExecutiveExperienceStateBindingCanonicalIdentity,
    ) &&
    Object.isFrozen(EXECUTIVE_RUNTIME_BOUND_SURFACE_ORDER) &&
    Object.isFrozen(EXECUTIVE_RUNTIME_BINDING_STATUSES) &&
    Object.isFrozen(EXECUTIVE_RUNTIME_BINDING_ISSUE_CODES) &&
    Object.isFrozen(EXECUTIVE_RUNTIME_STATE_BINDING_GUARANTEES) &&
    Object.isFrozen(EXECUTIVE_RUNTIME_STATE_BINDING_BOUNDARY) &&
    Object.isFrozen(EXECUTIVE_RUNTIME_STATE_BINDING_REGISTRY_SECTIONS);

  const contractsBoundaryIntact =
    binding.boundary.soleImmediateDependency ===
      "REX-1:2/ExecutiveRuntimeContracts" &&
    binding.boundary.consumesContractsOnly === true &&
    binding.boundary.rewritesRuntimeAuthority === false;

  const frameworkIndependent =
    binding.frameworkIndependent === true &&
    binding.rendererIndependent === true &&
    binding.boundary.frameworkIndependent === true;

  const ok =
    identityOk &&
    dependencyOk &&
    orderingOk &&
    guaranteesPresent &&
    uniquenessOk &&
    immutabilityOk &&
    contractsBoundaryIntact &&
    frameworkIndependent &&
    registry.sparseSurfaceBinding === true &&
    binding.principle === EXECUTIVE_RUNTIME_STATE_BINDING_PRINCIPLE;

  return Object.freeze({
    ok,
    identity: runtimeEnabledExecutiveExperienceStateBindingIdentity,
    version: runtimeEnabledExecutiveExperienceStateBindingVersion,
    namespace: runtimeEnabledExecutiveExperienceStateBindingNamespace,
    layer: runtimeEnabledExecutiveExperienceStateBindingLayer,
    phase: runtimeEnabledExecutiveExperienceStateBindingPhase,
    stage: runtimeEnabledExecutiveExperienceStateBindingStage,
    architecturalRole:
      runtimeEnabledExecutiveExperienceStateBindingArchitecturalRole,
    dependencyIdentity:
      runtimeEnabledExecutiveExperienceStateBindingDependencyIdentity,
    surfaceOrderCount: EXECUTIVE_RUNTIME_BOUND_SURFACE_ORDER.length,
    statusCount: EXECUTIVE_RUNTIME_BINDING_STATUSES.length,
    issueCodeCount: EXECUTIVE_RUNTIME_BINDING_ISSUE_CODES.length,
    guaranteeCount: EXECUTIVE_RUNTIME_STATE_BINDING_GUARANTEES.length,
    registrySectionCount:
      EXECUTIVE_RUNTIME_STATE_BINDING_REGISTRY_SECTIONS.length,
    publicApiCount:
      runtimeEnabledExecutiveExperienceStateBindingApiNames.length,
    frozen: immutabilityOk,
    contractsBoundaryIntact,
    frameworkIndependent,
    guaranteesPresent,
    sparseSurfaceBinding: registry.sparseSurfaceBinding,
  });
}
