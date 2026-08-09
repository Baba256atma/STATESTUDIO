/**
 * REX-1:2 — Executive Runtime Contracts.
 *
 * Formal readonly contract layer on top of REX-1:1 foundation.
 * Describes what runtime-enabled Executive Experience data looks like.
 * Does not decide what should happen.
 *
 * Canonical flow:
 *   NOL → DRI → EX-DRI → REX-1:1 Foundation → REX-1:2 Contracts → later REX bindings
 *
 * Contracts only — no Stage/Advisor/Insight/Timeline/Explorer binding,
 * React hooks, stores, rendering, Three.js, AI, persistence, or networking.
 */

import {
  RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE,
  RUNTIME_EXECUTIVE_PRESENTATION_STATES,
  isRuntimeExecutiveExperienceActivationState,
  isRuntimeExecutiveExperienceState,
  isRuntimeExecutiveExperienceSubjectKind,
  isRuntimeExecutiveExperienceSurface,
  isRuntimeExecutivePresentationState,
  runtimeEnabledExecutiveExperienceFoundationIdentity,
  runtimeEnabledExecutiveExperienceFoundationVersion,
  type RuntimeExecutiveExperienceActivationState,
  type RuntimeExecutiveExperienceContext,
  type RuntimeExecutiveExperienceRuntimeSource,
  type RuntimeExecutiveExperienceSnapshot,
  type RuntimeExecutiveExperienceState,
  type RuntimeExecutiveExperienceSubjectKind,
  type RuntimeExecutiveExperienceSurface,
  type RuntimeExecutivePresentationState,
} from "@/app/lib/rex/runtimeEnabledExecutiveExperienceFoundation";

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeEnabledExecutiveExperienceContractsIdentity =
  "REX-1:2/ExecutiveRuntimeContracts" as const;

export const runtimeEnabledExecutiveExperienceContractsVersion =
  "1.2.0" as const;

export const runtimeEnabledExecutiveExperienceContractsNamespace =
  "nexora.rex.runtime-enabled-executive-experience.contracts" as const;

export const runtimeEnabledExecutiveExperienceContractsLayer =
  "REX" as const;

export const runtimeEnabledExecutiveExperienceContractsPhase =
  "REX-1" as const;

export const runtimeEnabledExecutiveExperienceContractsStage =
  "Contracts" as const;

export const runtimeEnabledExecutiveExperienceContractsArchitecturalRole =
  "ExecutiveRuntimeContractBoundary" as const;

export const runtimeEnabledExecutiveExperienceContractsDependencyIdentity =
  runtimeEnabledExecutiveExperienceFoundationIdentity;

export const runtimeEnabledExecutiveExperienceContractsDependencyPath =
  "@/app/lib/rex/runtimeEnabledExecutiveExperienceFoundation" as const;

export const runtimeEnabledExecutiveExperienceContractsStability =
  "ContractsReady" as const;

export const runtimeEnabledExecutiveExperienceContractsDeterministic =
  true as const;

export const runtimeEnabledExecutiveExperienceContractsSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeEnabledExecutiveExperienceContractsMutationPolicy =
  "immutable" as const;

export const runtimeEnabledExecutiveExperienceContractsCanonicalIdentity =
  Object.freeze({
    identity: runtimeEnabledExecutiveExperienceContractsIdentity,
    version: runtimeEnabledExecutiveExperienceContractsVersion,
    namespace: runtimeEnabledExecutiveExperienceContractsNamespace,
    layer: runtimeEnabledExecutiveExperienceContractsLayer,
    phase: runtimeEnabledExecutiveExperienceContractsPhase,
    stage: runtimeEnabledExecutiveExperienceContractsStage,
    architecturalRole:
      runtimeEnabledExecutiveExperienceContractsArchitecturalRole,
    dependencyIdentity:
      runtimeEnabledExecutiveExperienceContractsDependencyIdentity,
    dependencyPath:
      runtimeEnabledExecutiveExperienceContractsDependencyPath,
    stabilityStatus:
      runtimeEnabledExecutiveExperienceContractsStability,
    deterministicStatus:
      runtimeEnabledExecutiveExperienceContractsDeterministic,
    sideEffectPolicy:
      runtimeEnabledExecutiveExperienceContractsSideEffectPolicy,
    mutationPolicy:
      runtimeEnabledExecutiveExperienceContractsMutationPolicy,
  });

export const EXECUTIVE_RUNTIME_CONTRACTS_PRINCIPLE =
  "REX-1:2 describes what runtime-enabled Executive Experience data looks like. It does not decide what should happen." as const;

export const EXECUTIVE_RUNTIME_CONTRACTS_BOUNDARY = Object.freeze({
  rexAuthority: "Runtime-enabled-Executive-Experience" as const,
  contractAuthority: "REX-1:2" as const,
  architecturalRole: "ExecutiveRuntimeContractBoundary" as const,
  soleImmediateDependency:
    "REX-1:1/RuntimeEnabledExecutiveExperienceFoundation" as const,
  consumesFoundationOnly: true as const,
  importsExDriDirectly: false as const,
  importsDriDirectly: false as const,
  importsNolDirectly: false as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  containsRenderingBehavior: false as const,
  containsAiReasoning: false as const,
  containsBusinessCalculations: false as const,
  containsPersistenceLogic: false as const,
  containsNetworkLogic: false as const,
  calculatesFocus: false as const,
  calculatesAttention: false as const,
  resolvesPresentation: false as const,
  executesInteraction: false as const,
});

/**
 * EX-DRI public-index version already represented by REX-1:1 snapshot contracts.
 * REX-1:2 does not import EX-DRI; it preserves this established authority version.
 */
export const EXECUTIVE_RUNTIME_AUTHORITY_SOURCE_VERSION =
  "1.9.0" as const;

export const EXECUTIVE_RUNTIME_AUTHORITY_KINDS = Object.freeze([
  "certified-runtime-context",
] as const);

export type ExecutiveRuntimeAuthorityKind =
  (typeof EXECUTIVE_RUNTIME_AUTHORITY_KINDS)[number];

// ─── Representation vocabularies (optional / generic — not algorithms) ──────

/**
 * Focus relationship roles for carrying upstream-determined focus.
 * Representation only — REX does not calculate focus.
 */
export const EXECUTIVE_RUNTIME_FOCUS_RELATIONSHIPS = Object.freeze([
  "primary",
  "secondary",
] as const);

export type ExecutiveRuntimeFocusRelationship =
  (typeof EXECUTIVE_RUNTIME_FOCUS_RELATIONSHIPS)[number];

/**
 * Generic focus scope labels for optional metadata.
 */
export const EXECUTIVE_RUNTIME_FOCUS_SCOPES = Object.freeze([
  "experience",
  "surface",
  "subject",
] as const);

export type ExecutiveRuntimeFocusScope =
  (typeof EXECUTIVE_RUNTIME_FOCUS_SCOPES)[number];

/**
 * Compatible attention-level labels for carrying upstream attention.
 * Representation only — REX does not calculate attention.
 */
export const EXECUTIVE_RUNTIME_ATTENTION_LEVELS = Object.freeze([
  "primary",
  "secondary",
  "context",
  "background",
  "suppressed",
] as const);

export type ExecutiveRuntimeAttentionLevel =
  (typeof EXECUTIVE_RUNTIME_ATTENTION_LEVELS)[number];

export const EXECUTIVE_RUNTIME_ATTENTION_SCOPES = Object.freeze([
  "experience",
  "surface",
  "subject",
] as const);

export type ExecutiveRuntimeAttentionScope =
  (typeof EXECUTIVE_RUNTIME_ATTENTION_SCOPES)[number];

export const EXECUTIVE_RUNTIME_ATTENTION_PERSISTENCE_VALUES = Object.freeze([
  "transient",
  "sticky",
  "session",
] as const);

export type ExecutiveRuntimeAttentionPersistence =
  (typeof EXECUTIVE_RUNTIME_ATTENTION_PERSISTENCE_VALUES)[number];

export const EXECUTIVE_RUNTIME_VISIBILITY_VALUES = Object.freeze([
  "visible",
  "hidden",
  "dimmed",
] as const);

export type ExecutiveRuntimeVisibility =
  (typeof EXECUTIVE_RUNTIME_VISIBILITY_VALUES)[number];

export const EXECUTIVE_RUNTIME_EMPHASIS_VALUES = Object.freeze([
  "none",
  "low",
  "medium",
  "high",
] as const);

export type ExecutiveRuntimeEmphasis =
  (typeof EXECUTIVE_RUNTIME_EMPHASIS_VALUES)[number];

// ─── Contract families ──────────────────────────────────────────────────────

export const EXECUTIVE_RUNTIME_CONTRACT_FAMILIES = Object.freeze([
  "SubjectReference",
  "SurfaceReference",
  "Focus",
  "Attention",
  "Presentation",
  "InteractionContext",
  "Surface",
  "Experience",
  "Stage",
  "Advisor",
  "Insight",
  "Timeline",
  "Explorer",
  "Readiness",
  "RuntimeAuthority",
] as const);

export type ExecutiveRuntimeContractFamily =
  (typeof EXECUTIVE_RUNTIME_CONTRACT_FAMILIES)[number];

// ─── Plain-data contracts ───────────────────────────────────────────────────

/**
 * Identifies an Executive Experience subject without owning the source object.
 */
export interface ExecutiveRuntimeSubjectReference {
  readonly kind: RuntimeExecutiveExperienceSubjectKind;
  readonly id: string;
  readonly label?: string;
  readonly parentId?: string;
  readonly sourceVersion?: string;
}

/**
 * Identifies an Executive Experience surface destination — not a React component.
 */
export interface ExecutiveRuntimeSurfaceReference {
  readonly surface: RuntimeExecutiveExperienceSurface;
  readonly surfaceId: string;
  readonly runtimeState: RuntimeExecutiveExperienceState;
  readonly activationState: RuntimeExecutiveExperienceActivationState;
}

/**
 * Carries focus information already determined upstream.
 * REX does not calculate focus.
 */
export interface ExecutiveRuntimeFocusContract {
  readonly focusedSubject: ExecutiveRuntimeSubjectReference;
  readonly relationship?: ExecutiveRuntimeFocusRelationship;
  readonly secondarySubject?: ExecutiveRuntimeSubjectReference;
  readonly reason?: string;
  readonly scope?: ExecutiveRuntimeFocusScope;
  readonly surface?: RuntimeExecutiveExperienceSurface;
  readonly runtimeSource: RuntimeExecutiveExperienceRuntimeSource;
}

/**
 * Carries attention information already determined upstream.
 * REX does not calculate attention.
 */
export interface ExecutiveRuntimeAttentionContract {
  readonly subject: ExecutiveRuntimeSubjectReference;
  readonly level?: ExecutiveRuntimeAttentionLevel;
  readonly reason?: string;
  readonly scope?: ExecutiveRuntimeAttentionScope;
  readonly persistence?: ExecutiveRuntimeAttentionPersistence;
  readonly surface?: RuntimeExecutiveExperienceSurface;
  readonly runtimeSource: RuntimeExecutiveExperienceRuntimeSource;
}

/**
 * Represents a presentation relationship. Does not resolve presentation.
 * Canonical states remain minimum / report / operation.
 */
export interface ExecutiveRuntimePresentationContract {
  readonly subject: ExecutiveRuntimeSubjectReference;
  readonly targetSurface: RuntimeExecutiveExperienceSurface;
  readonly presentationState: RuntimeExecutivePresentationState;
  readonly visibility?: ExecutiveRuntimeVisibility;
  readonly emphasis?: ExecutiveRuntimeEmphasis;
  readonly priority?: number;
  readonly runtimeSource: RuntimeExecutiveExperienceRuntimeSource;
}

/**
 * Runtime context surrounding an executive interaction.
 * No event handlers or command execution.
 */
export interface ExecutiveRuntimeInteractionContext {
  readonly interactionId: string;
  readonly sourceSurface: RuntimeExecutiveExperienceSurface;
  readonly targetSubject?: ExecutiveRuntimeSubjectReference;
  readonly interactionKind?: string;
  readonly contextId?: string;
  readonly snapshotId?: string;
  readonly runtimeSource: RuntimeExecutiveExperienceRuntimeSource;
}

/**
 * Full runtime-facing state of a single Executive Experience surface.
 * No rendering information or component props.
 */
export interface ExecutiveRuntimeSurfaceContract {
  readonly surface: ExecutiveRuntimeSurfaceReference;
  readonly currentSubject?: ExecutiveRuntimeSubjectReference;
  readonly focus?: ExecutiveRuntimeFocusContract;
  readonly attention?: ExecutiveRuntimeAttentionContract;
  readonly presentation?: ExecutiveRuntimePresentationContract;
  readonly activation: RuntimeExecutiveExperienceActivationState;
  readonly readiness: RuntimeExecutiveExperienceState;
  readonly interactionContext?: ExecutiveRuntimeInteractionContext;
}

/**
 * Explicit deterministic readiness flags. Not computed from external systems here.
 */
export interface ExecutiveRuntimeReadinessContract {
  readonly runtimeAvailable: boolean;
  readonly contextAvailable: boolean;
  readonly surfaceReady: boolean;
  readonly subjectReady: boolean;
  readonly presentationReady: boolean;
  readonly interactionReady: boolean;
  readonly overallReady: boolean;
}

/**
 * Preserves architectural authority: EX-DRI → REX.
 * REX represents runtime authority but does not replace it.
 */
export interface ExecutiveRuntimeAuthorityContract {
  readonly sourceLayer: "EX-DRI";
  readonly sourceIdentity: typeof RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE.authorityIdentity;
  readonly sourceVersion: typeof EXECUTIVE_RUNTIME_AUTHORITY_SOURCE_VERSION;
  readonly authorityKind: ExecutiveRuntimeAuthorityKind;
  readonly consumedByLayer: "REX";
  readonly relationship: "EX-DRI → REX";
  readonly runtimeSource: RuntimeExecutiveExperienceRuntimeSource;
}

/**
 * Top-level readonly contract for a runtime-enabled Executive Experience.
 */
export interface ExecutiveRuntimeExperienceContract {
  readonly experienceContext: RuntimeExecutiveExperienceContext;
  readonly currentSnapshot: RuntimeExecutiveExperienceSnapshot;
  readonly activeSubject?: ExecutiveRuntimeSubjectReference;
  readonly activeSurface?: ExecutiveRuntimeSurfaceReference;
  readonly surfaceContracts: ReadonlyArray<ExecutiveRuntimeSurfaceContract>;
  readonly focus?: ExecutiveRuntimeFocusContract;
  readonly attention?: ExecutiveRuntimeAttentionContract;
  readonly presentation?: ExecutiveRuntimePresentationContract;
  readonly readiness: ExecutiveRuntimeReadinessContract;
  readonly authority: ExecutiveRuntimeAuthorityContract;
  readonly contractIdentity: typeof runtimeEnabledExecutiveExperienceContractsIdentity;
  readonly contractVersion: typeof runtimeEnabledExecutiveExperienceContractsVersion;
}

/**
 * Narrow experience-facing Stage contract.
 * No scene composition, Three.js objects, or renderer details.
 */
export interface ExecutiveRuntimeStageContract {
  readonly surface: "stage";
  readonly availability: RuntimeExecutiveExperienceState;
  readonly activation: RuntimeExecutiveExperienceActivationState;
  readonly activeSubject?: ExecutiveRuntimeSubjectReference;
  readonly focusedSubject?: ExecutiveRuntimeSubjectReference;
  readonly subjectReferences?: ReadonlyArray<ExecutiveRuntimeSubjectReference>;
  readonly presentation?: ExecutiveRuntimePresentationContract;
  readonly focus?: ExecutiveRuntimeFocusContract;
  readonly attention?: ExecutiveRuntimeAttentionContract;
  readonly readiness: RuntimeExecutiveExperienceState;
  readonly runtimeSource: RuntimeExecutiveExperienceRuntimeSource;
}

/**
 * Advisor experience contract — no AI completion, prompts, LLMs, or agents.
 */
export interface ExecutiveRuntimeAdvisorContract {
  readonly surface: "advisor";
  readonly activeSubject?: ExecutiveRuntimeSubjectReference;
  readonly contextId?: string;
  readonly snapshotId?: string;
  readonly focus?: ExecutiveRuntimeFocusContract;
  readonly attention?: ExecutiveRuntimeAttentionContract;
  readonly availability: RuntimeExecutiveExperienceState;
  readonly readiness: RuntimeExecutiveExperienceState;
  readonly activation: RuntimeExecutiveExperienceActivationState;
  readonly relatedSurfaceState?: ExecutiveRuntimeSurfaceReference;
  readonly runtimeSource: RuntimeExecutiveExperienceRuntimeSource;
}

/**
 * Generic metric reference — no KPI/KOI calculation.
 */
export interface ExecutiveRuntimeMetricReference {
  readonly metricId: string;
  readonly metricKind?: string;
  readonly label?: string;
}

/**
 * Insight experience contract — no KPI/KOI calculation.
 */
export interface ExecutiveRuntimeInsightContract {
  readonly surface: "insight";
  readonly activeSubject?: ExecutiveRuntimeSubjectReference;
  readonly contextId?: string;
  readonly snapshotId?: string;
  readonly relatedMetrics?: ReadonlyArray<ExecutiveRuntimeMetricReference>;
  readonly presentationState?: RuntimeExecutivePresentationState;
  readonly readiness: RuntimeExecutiveExperienceState;
  readonly activation: RuntimeExecutiveExperienceActivationState;
  readonly runtimeSource: RuntimeExecutiveExperienceRuntimeSource;
}

/**
 * Timeline experience contract — no replay or persistence.
 */
export interface ExecutiveRuntimeTimelineContract {
  readonly surface: "timeline";
  readonly contextId?: string;
  readonly selectedPositionId?: string;
  readonly selectedReferenceId?: string;
  readonly associatedSubject?: ExecutiveRuntimeSubjectReference;
  readonly associatedPackId?: string;
  readonly temporalContextId?: string;
  readonly readiness: RuntimeExecutiveExperienceState;
  readonly activation: RuntimeExecutiveExperienceActivationState;
  readonly runtimeSource: RuntimeExecutiveExperienceRuntimeSource;
}

/**
 * Explorer experience contract — no data fetching or drawer/UI logic.
 */
export interface ExecutiveRuntimeExplorerContract {
  readonly surface: "explorer";
  readonly contextId?: string;
  readonly collectionKind?: RuntimeExecutiveExperienceSubjectKind;
  readonly selectedSubject?: ExecutiveRuntimeSubjectReference;
  readonly readiness: RuntimeExecutiveExperienceState;
  readonly activation: RuntimeExecutiveExperienceActivationState;
  readonly relatedSurfaceIds?: ReadonlyArray<string>;
  readonly runtimeSource: RuntimeExecutiveExperienceRuntimeSource;
}

// ─── Guarantees ─────────────────────────────────────────────────────────────

export const EXECUTIVE_RUNTIME_CONTRACT_GUARANTEES = Object.freeze([
  Object.freeze({
    id: "depends-only-on-rex-1-1",
    order: 1,
    statement: "REX-1:2 depends only on REX-1:1.",
  }),
  Object.freeze({
    id: "framework-neutral-contracts",
    order: 2,
    statement: "Contracts remain framework-neutral.",
  }),
  Object.freeze({
    id: "no-rendering-behavior",
    order: 3,
    statement: "Contracts contain no rendering behavior.",
  }),
  Object.freeze({
    id: "no-ai-reasoning",
    order: 4,
    statement: "Contracts contain no AI reasoning.",
  }),
  Object.freeze({
    id: "no-business-calculations",
    order: 5,
    statement: "Contracts contain no business calculations.",
  }),
  Object.freeze({
    id: "no-persistence-logic",
    order: 6,
    statement: "Contracts contain no persistence logic.",
  }),
  Object.freeze({
    id: "no-network-logic",
    order: 7,
    statement: "Contracts contain no network logic.",
  }),
  Object.freeze({
    id: "no-mutable-collections",
    order: 8,
    statement: "Contracts contain no mutable collections.",
  }),
  Object.freeze({
    id: "focus-represented-not-calculated",
    order: 9,
    statement: "Focus is represented but not calculated.",
  }),
  Object.freeze({
    id: "attention-represented-not-calculated",
    order: 10,
    statement: "Attention is represented but not calculated.",
  }),
  Object.freeze({
    id: "presentation-represented-not-resolved",
    order: 11,
    statement: "Presentation is represented but not resolved.",
  }),
  Object.freeze({
    id: "interaction-represented-not-executed",
    order: 12,
    statement: "Interaction context is represented but not executed.",
  }),
  Object.freeze({
    id: "stage-no-threejs-objects",
    order: 13,
    statement: "Stage contracts expose no Three.js implementation objects.",
  }),
  Object.freeze({
    id: "advisor-no-model-provider",
    order: 14,
    statement: "Advisor contracts expose no model-provider logic.",
  }),
  Object.freeze({
    id: "insight-no-kpi-koi-calculation",
    order: 15,
    statement: "Insight contracts do not calculate KPI/KOI.",
  }),
  Object.freeze({
    id: "timeline-no-replay",
    order: 16,
    statement: "Timeline contracts do not implement replay.",
  }),
  Object.freeze({
    id: "explorer-no-fetch",
    order: 17,
    statement: "Explorer contracts do not fetch collections.",
  }),
  Object.freeze({
    id: "runtime-authority-ex-dri-originated",
    order: 18,
    statement: "Runtime authority remains EX-DRI-originated.",
  }),
  Object.freeze({
    id: "presentation-states-unchanged",
    order: 19,
    statement: "Existing presentation states remain unchanged.",
  }),
  Object.freeze({
    id: "surfaces-independently-addressable",
    order: 20,
    statement:
      "Existing Executive Experience surfaces remain independently addressable.",
  }),
] as const);

export type ExecutiveRuntimeContractGuarantee =
  (typeof EXECUTIVE_RUNTIME_CONTRACT_GUARANTEES)[number];

export const EXECUTIVE_RUNTIME_CONTRACT_FORBIDDEN_RESPONSIBILITIES =
  Object.freeze([
    "Stage behavior",
    "Advisor behavior",
    "Insight behavior",
    "Timeline behavior",
    "Explorer behavior",
    "React hooks",
    "runtime stores",
    "scene rendering",
    "Three.js integration",
    "business workflows",
    "AI reasoning",
    "LLM prompts",
    "model-provider logic",
    "KPI calculation",
    "KOI calculation",
    "focus calculation",
    "attention calculation",
    "presentation resolution",
    "interaction execution",
    "timeline replay",
    "collection fetching",
    "persistence",
    "networking",
  ] as const);

// ─── Validation helpers ─────────────────────────────────────────────────────

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

export function isExecutiveRuntimeContractFamily(
  value: unknown,
): value is ExecutiveRuntimeContractFamily {
  return (
    EXECUTIVE_RUNTIME_CONTRACT_FAMILIES as readonly unknown[]
  ).includes(value);
}

export function isExecutiveRuntimeFocusRelationship(
  value: unknown,
): value is ExecutiveRuntimeFocusRelationship {
  return (
    EXECUTIVE_RUNTIME_FOCUS_RELATIONSHIPS as readonly unknown[]
  ).includes(value);
}

export function isExecutiveRuntimeAttentionLevel(
  value: unknown,
): value is ExecutiveRuntimeAttentionLevel {
  return (
    EXECUTIVE_RUNTIME_ATTENTION_LEVELS as readonly unknown[]
  ).includes(value);
}

export function isExecutiveRuntimeSubjectReference(
  value: unknown,
): value is ExecutiveRuntimeSubjectReference {
  if (value === null || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  if (!isRuntimeExecutiveExperienceSubjectKind(candidate.kind)) return false;
  if (!isNonEmptyString(candidate.id)) return false;
  if (candidate.label !== undefined && typeof candidate.label !== "string") {
    return false;
  }
  if (
    candidate.parentId !== undefined &&
    typeof candidate.parentId !== "string"
  ) {
    return false;
  }
  if (
    candidate.sourceVersion !== undefined &&
    typeof candidate.sourceVersion !== "string"
  ) {
    return false;
  }
  return true;
}

export function isExecutiveRuntimeSurfaceReference(
  value: unknown,
): value is ExecutiveRuntimeSurfaceReference {
  if (value === null || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    isRuntimeExecutiveExperienceSurface(candidate.surface) &&
    isNonEmptyString(candidate.surfaceId) &&
    isRuntimeExecutiveExperienceState(candidate.runtimeState) &&
    isRuntimeExecutiveExperienceActivationState(candidate.activationState)
  );
}

export function verifyExecutiveRuntimeAuthorityContract(
  value: unknown,
): value is ExecutiveRuntimeAuthorityContract {
  if (value === null || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    candidate.sourceLayer === "EX-DRI" &&
    candidate.sourceIdentity ===
      RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE.authorityIdentity &&
    candidate.sourceVersion === EXECUTIVE_RUNTIME_AUTHORITY_SOURCE_VERSION &&
    candidate.authorityKind === "certified-runtime-context" &&
    candidate.consumedByLayer === "REX" &&
    candidate.relationship === "EX-DRI → REX" &&
    candidate.runtimeSource === RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE
  );
}

export function verifyExecutiveRuntimeReadinessContract(
  value: unknown,
): value is ExecutiveRuntimeReadinessContract {
  if (value === null || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    isBoolean(candidate.runtimeAvailable) &&
    isBoolean(candidate.contextAvailable) &&
    isBoolean(candidate.surfaceReady) &&
    isBoolean(candidate.subjectReady) &&
    isBoolean(candidate.presentationReady) &&
    isBoolean(candidate.interactionReady) &&
    isBoolean(candidate.overallReady)
  );
}

export function verifyExecutiveRuntimeFocusContract(
  value: unknown,
): value is ExecutiveRuntimeFocusContract {
  if (value === null || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  if (!isExecutiveRuntimeSubjectReference(candidate.focusedSubject)) {
    return false;
  }
  if (
    candidate.relationship !== undefined &&
    !isExecutiveRuntimeFocusRelationship(candidate.relationship)
  ) {
    return false;
  }
  if (
    candidate.secondarySubject !== undefined &&
    !isExecutiveRuntimeSubjectReference(candidate.secondarySubject)
  ) {
    return false;
  }
  if (
    candidate.surface !== undefined &&
    !isRuntimeExecutiveExperienceSurface(candidate.surface)
  ) {
    return false;
  }
  return candidate.runtimeSource === RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE;
}

export function verifyExecutiveRuntimeAttentionContract(
  value: unknown,
): value is ExecutiveRuntimeAttentionContract {
  if (value === null || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  if (!isExecutiveRuntimeSubjectReference(candidate.subject)) return false;
  if (
    candidate.level !== undefined &&
    !isExecutiveRuntimeAttentionLevel(candidate.level)
  ) {
    return false;
  }
  return candidate.runtimeSource === RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE;
}

export function verifyExecutiveRuntimePresentationContract(
  value: unknown,
): value is ExecutiveRuntimePresentationContract {
  if (value === null || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    isExecutiveRuntimeSubjectReference(candidate.subject) &&
    isRuntimeExecutiveExperienceSurface(candidate.targetSurface) &&
    isRuntimeExecutivePresentationState(candidate.presentationState) &&
    candidate.runtimeSource === RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE
  );
}

export function verifyExecutiveRuntimeExperienceContract(
  value: unknown,
): value is ExecutiveRuntimeExperienceContract {
  if (value === null || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  if (
    candidate.experienceContext === null ||
    typeof candidate.experienceContext !== "object"
  ) {
    return false;
  }
  if (
    candidate.currentSnapshot === null ||
    typeof candidate.currentSnapshot !== "object"
  ) {
    return false;
  }
  if (!Array.isArray(candidate.surfaceContracts)) return false;
  if (!verifyExecutiveRuntimeReadinessContract(candidate.readiness)) {
    return false;
  }
  if (!verifyExecutiveRuntimeAuthorityContract(candidate.authority)) {
    return false;
  }
  return (
    candidate.contractIdentity ===
      runtimeEnabledExecutiveExperienceContractsIdentity &&
    candidate.contractVersion ===
      runtimeEnabledExecutiveExperienceContractsVersion
  );
}

// ─── Immutable constructors ─────────────────────────────────────────────────

function requireOpaqueId(value: string, field: string): void {
  if (!isNonEmptyString(value)) {
    throw new TypeError(`${field} must be a non-empty opaque identifier`);
  }
}

export function createExecutiveRuntimeSubjectReference(
  input: ExecutiveRuntimeSubjectReference,
): ExecutiveRuntimeSubjectReference {
  requireOpaqueId(input.id, "id");
  if (!isRuntimeExecutiveExperienceSubjectKind(input.kind)) {
    throw new TypeError("kind must be a known runtime executive subject kind");
  }
  return Object.freeze({
    kind: input.kind,
    id: input.id,
    ...(input.label !== undefined ? { label: input.label } : {}),
    ...(input.parentId !== undefined ? { parentId: input.parentId } : {}),
    ...(input.sourceVersion !== undefined
      ? { sourceVersion: input.sourceVersion }
      : {}),
  });
}

export function createExecutiveRuntimeSurfaceReference(
  input: ExecutiveRuntimeSurfaceReference,
): ExecutiveRuntimeSurfaceReference {
  requireOpaqueId(input.surfaceId, "surfaceId");
  if (!isRuntimeExecutiveExperienceSurface(input.surface)) {
    throw new TypeError("surface must be a known runtime executive surface");
  }
  if (!isRuntimeExecutiveExperienceState(input.runtimeState)) {
    throw new TypeError("runtimeState must be a known runtime experience state");
  }
  if (!isRuntimeExecutiveExperienceActivationState(input.activationState)) {
    throw new TypeError(
      "activationState must be a known runtime experience activation state",
    );
  }
  return Object.freeze({
    surface: input.surface,
    surfaceId: input.surfaceId,
    runtimeState: input.runtimeState,
    activationState: input.activationState,
  });
}

export function createExecutiveRuntimeAuthorityContract(
  input?: Partial<ExecutiveRuntimeAuthorityContract>,
): ExecutiveRuntimeAuthorityContract {
  const contract: ExecutiveRuntimeAuthorityContract = {
    sourceLayer: "EX-DRI",
    sourceIdentity:
      RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE.authorityIdentity,
    sourceVersion: EXECUTIVE_RUNTIME_AUTHORITY_SOURCE_VERSION,
    authorityKind: "certified-runtime-context",
    consumedByLayer: "REX",
    relationship: "EX-DRI → REX",
    runtimeSource: RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE,
    ...input,
  };
  if (!verifyExecutiveRuntimeAuthorityContract(contract)) {
    throw new TypeError(
      "authority contract must preserve EX-DRI → REX runtime authority",
    );
  }
  return Object.freeze(contract);
}

export function createExecutiveRuntimeReadinessContract(
  input: ExecutiveRuntimeReadinessContract,
): ExecutiveRuntimeReadinessContract {
  if (!verifyExecutiveRuntimeReadinessContract(input)) {
    throw new TypeError("readiness contract fields must be booleans");
  }
  return Object.freeze({ ...input });
}

export function createExecutiveRuntimeFocusContract(
  input: ExecutiveRuntimeFocusContract,
): ExecutiveRuntimeFocusContract {
  const focusedSubject = createExecutiveRuntimeSubjectReference(
    input.focusedSubject,
  );
  if (
    input.relationship !== undefined &&
    !isExecutiveRuntimeFocusRelationship(input.relationship)
  ) {
    throw new TypeError("relationship must be a known focus relationship");
  }
  if (input.runtimeSource !== RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE) {
    throw new TypeError("runtimeSource must be the canonical EX-DRI → REX source");
  }
  return Object.freeze({
    focusedSubject,
    runtimeSource: RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE,
    ...(input.relationship !== undefined
      ? { relationship: input.relationship }
      : {}),
    ...(input.secondarySubject !== undefined
      ? {
          secondarySubject: createExecutiveRuntimeSubjectReference(
            input.secondarySubject,
          ),
        }
      : {}),
    ...(input.reason !== undefined ? { reason: input.reason } : {}),
    ...(input.scope !== undefined ? { scope: input.scope } : {}),
    ...(input.surface !== undefined ? { surface: input.surface } : {}),
  });
}

export function createExecutiveRuntimeAttentionContract(
  input: ExecutiveRuntimeAttentionContract,
): ExecutiveRuntimeAttentionContract {
  if (input.runtimeSource !== RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE) {
    throw new TypeError("runtimeSource must be the canonical EX-DRI → REX source");
  }
  if (
    input.level !== undefined &&
    !isExecutiveRuntimeAttentionLevel(input.level)
  ) {
    throw new TypeError("level must be a known attention level");
  }
  return Object.freeze({
    subject: createExecutiveRuntimeSubjectReference(input.subject),
    runtimeSource: RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE,
    ...(input.level !== undefined ? { level: input.level } : {}),
    ...(input.reason !== undefined ? { reason: input.reason } : {}),
    ...(input.scope !== undefined ? { scope: input.scope } : {}),
    ...(input.persistence !== undefined
      ? { persistence: input.persistence }
      : {}),
    ...(input.surface !== undefined ? { surface: input.surface } : {}),
  });
}

export function createExecutiveRuntimePresentationContract(
  input: ExecutiveRuntimePresentationContract,
): ExecutiveRuntimePresentationContract {
  if (!isRuntimeExecutivePresentationState(input.presentationState)) {
    throw new TypeError(
      "presentationState must be minimum, report, or operation",
    );
  }
  if (!isRuntimeExecutiveExperienceSurface(input.targetSurface)) {
    throw new TypeError("targetSurface must be a known surface");
  }
  if (input.runtimeSource !== RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE) {
    throw new TypeError("runtimeSource must be the canonical EX-DRI → REX source");
  }
  return Object.freeze({
    subject: createExecutiveRuntimeSubjectReference(input.subject),
    targetSurface: input.targetSurface,
    presentationState: input.presentationState,
    runtimeSource: RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE,
    ...(input.visibility !== undefined ? { visibility: input.visibility } : {}),
    ...(input.emphasis !== undefined ? { emphasis: input.emphasis } : {}),
    ...(input.priority !== undefined ? { priority: input.priority } : {}),
  });
}

export function createExecutiveRuntimeInteractionContext(
  input: ExecutiveRuntimeInteractionContext,
): ExecutiveRuntimeInteractionContext {
  requireOpaqueId(input.interactionId, "interactionId");
  if (!isRuntimeExecutiveExperienceSurface(input.sourceSurface)) {
    throw new TypeError("sourceSurface must be a known surface");
  }
  if (input.runtimeSource !== RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE) {
    throw new TypeError("runtimeSource must be the canonical EX-DRI → REX source");
  }
  return Object.freeze({
    interactionId: input.interactionId,
    sourceSurface: input.sourceSurface,
    runtimeSource: RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE,
    ...(input.targetSubject !== undefined
      ? {
          targetSubject: createExecutiveRuntimeSubjectReference(
            input.targetSubject,
          ),
        }
      : {}),
    ...(input.interactionKind !== undefined
      ? { interactionKind: input.interactionKind }
      : {}),
    ...(input.contextId !== undefined ? { contextId: input.contextId } : {}),
    ...(input.snapshotId !== undefined ? { snapshotId: input.snapshotId } : {}),
  });
}

export function createExecutiveRuntimeSurfaceContract(
  input: ExecutiveRuntimeSurfaceContract,
): ExecutiveRuntimeSurfaceContract {
  if (!isRuntimeExecutiveExperienceActivationState(input.activation)) {
    throw new TypeError("activation must be a known activation state");
  }
  if (!isRuntimeExecutiveExperienceState(input.readiness)) {
    throw new TypeError("readiness must be a known runtime experience state");
  }
  return Object.freeze({
    surface: createExecutiveRuntimeSurfaceReference(input.surface),
    activation: input.activation,
    readiness: input.readiness,
    ...(input.currentSubject !== undefined
      ? {
          currentSubject: createExecutiveRuntimeSubjectReference(
            input.currentSubject,
          ),
        }
      : {}),
    ...(input.focus !== undefined
      ? { focus: createExecutiveRuntimeFocusContract(input.focus) }
      : {}),
    ...(input.attention !== undefined
      ? { attention: createExecutiveRuntimeAttentionContract(input.attention) }
      : {}),
    ...(input.presentation !== undefined
      ? {
          presentation: createExecutiveRuntimePresentationContract(
            input.presentation,
          ),
        }
      : {}),
    ...(input.interactionContext !== undefined
      ? {
          interactionContext: createExecutiveRuntimeInteractionContext(
            input.interactionContext,
          ),
        }
      : {}),
  });
}

export function createExecutiveRuntimeStageContract(
  input: ExecutiveRuntimeStageContract,
): ExecutiveRuntimeStageContract {
  if (input.surface !== "stage") {
    throw new TypeError('Stage contract surface must be "stage"');
  }
  if (input.runtimeSource !== RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE) {
    throw new TypeError("runtimeSource must be the canonical EX-DRI → REX source");
  }
  return Object.freeze({
    surface: "stage" as const,
    availability: input.availability,
    activation: input.activation,
    readiness: input.readiness,
    runtimeSource: RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE,
    ...(input.activeSubject !== undefined
      ? {
          activeSubject: createExecutiveRuntimeSubjectReference(
            input.activeSubject,
          ),
        }
      : {}),
    ...(input.focusedSubject !== undefined
      ? {
          focusedSubject: createExecutiveRuntimeSubjectReference(
            input.focusedSubject,
          ),
        }
      : {}),
    ...(input.subjectReferences !== undefined
      ? {
          subjectReferences: Object.freeze(
            input.subjectReferences.map((subject) =>
              createExecutiveRuntimeSubjectReference(subject),
            ),
          ),
        }
      : {}),
    ...(input.presentation !== undefined
      ? {
          presentation: createExecutiveRuntimePresentationContract(
            input.presentation,
          ),
        }
      : {}),
    ...(input.focus !== undefined
      ? { focus: createExecutiveRuntimeFocusContract(input.focus) }
      : {}),
    ...(input.attention !== undefined
      ? { attention: createExecutiveRuntimeAttentionContract(input.attention) }
      : {}),
  });
}

export function createExecutiveRuntimeAdvisorContract(
  input: ExecutiveRuntimeAdvisorContract,
): ExecutiveRuntimeAdvisorContract {
  if (input.surface !== "advisor") {
    throw new TypeError('Advisor contract surface must be "advisor"');
  }
  if (input.runtimeSource !== RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE) {
    throw new TypeError("runtimeSource must be the canonical EX-DRI → REX source");
  }
  return Object.freeze({
    surface: "advisor" as const,
    availability: input.availability,
    readiness: input.readiness,
    activation: input.activation,
    runtimeSource: RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE,
    ...(input.activeSubject !== undefined
      ? {
          activeSubject: createExecutiveRuntimeSubjectReference(
            input.activeSubject,
          ),
        }
      : {}),
    ...(input.contextId !== undefined ? { contextId: input.contextId } : {}),
    ...(input.snapshotId !== undefined ? { snapshotId: input.snapshotId } : {}),
    ...(input.focus !== undefined
      ? { focus: createExecutiveRuntimeFocusContract(input.focus) }
      : {}),
    ...(input.attention !== undefined
      ? { attention: createExecutiveRuntimeAttentionContract(input.attention) }
      : {}),
    ...(input.relatedSurfaceState !== undefined
      ? {
          relatedSurfaceState: createExecutiveRuntimeSurfaceReference(
            input.relatedSurfaceState,
          ),
        }
      : {}),
  });
}

export function createExecutiveRuntimeInsightContract(
  input: ExecutiveRuntimeInsightContract,
): ExecutiveRuntimeInsightContract {
  if (input.surface !== "insight") {
    throw new TypeError('Insight contract surface must be "insight"');
  }
  if (input.runtimeSource !== RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE) {
    throw new TypeError("runtimeSource must be the canonical EX-DRI → REX source");
  }
  if (
    input.presentationState !== undefined &&
    !isRuntimeExecutivePresentationState(input.presentationState)
  ) {
    throw new TypeError(
      "presentationState must be minimum, report, or operation",
    );
  }
  return Object.freeze({
    surface: "insight" as const,
    readiness: input.readiness,
    activation: input.activation,
    runtimeSource: RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE,
    ...(input.activeSubject !== undefined
      ? {
          activeSubject: createExecutiveRuntimeSubjectReference(
            input.activeSubject,
          ),
        }
      : {}),
    ...(input.contextId !== undefined ? { contextId: input.contextId } : {}),
    ...(input.snapshotId !== undefined ? { snapshotId: input.snapshotId } : {}),
    ...(input.relatedMetrics !== undefined
      ? {
          relatedMetrics: Object.freeze(
            input.relatedMetrics.map((metric) =>
              Object.freeze({
                metricId: metric.metricId,
                ...(metric.metricKind !== undefined
                  ? { metricKind: metric.metricKind }
                  : {}),
                ...(metric.label !== undefined ? { label: metric.label } : {}),
              }),
            ),
          ),
        }
      : {}),
    ...(input.presentationState !== undefined
      ? { presentationState: input.presentationState }
      : {}),
  });
}

export function createExecutiveRuntimeTimelineContract(
  input: ExecutiveRuntimeTimelineContract,
): ExecutiveRuntimeTimelineContract {
  if (input.surface !== "timeline") {
    throw new TypeError('Timeline contract surface must be "timeline"');
  }
  if (input.runtimeSource !== RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE) {
    throw new TypeError("runtimeSource must be the canonical EX-DRI → REX source");
  }
  return Object.freeze({
    surface: "timeline" as const,
    readiness: input.readiness,
    activation: input.activation,
    runtimeSource: RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE,
    ...(input.contextId !== undefined ? { contextId: input.contextId } : {}),
    ...(input.selectedPositionId !== undefined
      ? { selectedPositionId: input.selectedPositionId }
      : {}),
    ...(input.selectedReferenceId !== undefined
      ? { selectedReferenceId: input.selectedReferenceId }
      : {}),
    ...(input.associatedSubject !== undefined
      ? {
          associatedSubject: createExecutiveRuntimeSubjectReference(
            input.associatedSubject,
          ),
        }
      : {}),
    ...(input.associatedPackId !== undefined
      ? { associatedPackId: input.associatedPackId }
      : {}),
    ...(input.temporalContextId !== undefined
      ? { temporalContextId: input.temporalContextId }
      : {}),
  });
}

export function createExecutiveRuntimeExplorerContract(
  input: ExecutiveRuntimeExplorerContract,
): ExecutiveRuntimeExplorerContract {
  if (input.surface !== "explorer") {
    throw new TypeError('Explorer contract surface must be "explorer"');
  }
  if (input.runtimeSource !== RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE) {
    throw new TypeError("runtimeSource must be the canonical EX-DRI → REX source");
  }
  if (
    input.collectionKind !== undefined &&
    !isRuntimeExecutiveExperienceSubjectKind(input.collectionKind)
  ) {
    throw new TypeError("collectionKind must be a known subject kind");
  }
  return Object.freeze({
    surface: "explorer" as const,
    readiness: input.readiness,
    activation: input.activation,
    runtimeSource: RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE,
    ...(input.contextId !== undefined ? { contextId: input.contextId } : {}),
    ...(input.collectionKind !== undefined
      ? { collectionKind: input.collectionKind }
      : {}),
    ...(input.selectedSubject !== undefined
      ? {
          selectedSubject: createExecutiveRuntimeSubjectReference(
            input.selectedSubject,
          ),
        }
      : {}),
    ...(input.relatedSurfaceIds !== undefined
      ? { relatedSurfaceIds: Object.freeze([...input.relatedSurfaceIds]) }
      : {}),
  });
}

export function createExecutiveRuntimeExperienceContract(
  input: ExecutiveRuntimeExperienceContract,
): ExecutiveRuntimeExperienceContract {
  if (
    input.contractIdentity !==
      runtimeEnabledExecutiveExperienceContractsIdentity ||
    input.contractVersion !==
      runtimeEnabledExecutiveExperienceContractsVersion
  ) {
    throw new TypeError("contract identity/version metadata is invalid");
  }
  const readiness = createExecutiveRuntimeReadinessContract(input.readiness);
  const authority = createExecutiveRuntimeAuthorityContract(input.authority);
  return Object.freeze({
    experienceContext: Object.freeze({ ...input.experienceContext }),
    currentSnapshot: Object.freeze({
      ...input.currentSnapshot,
      context: Object.freeze({ ...input.currentSnapshot.context }),
      surfaceStates: Object.freeze(
        input.currentSnapshot.surfaceStates.map((state) =>
          Object.freeze({ ...state }),
        ),
      ),
    }),
    surfaceContracts: Object.freeze(
      input.surfaceContracts.map((contract) =>
        createExecutiveRuntimeSurfaceContract(contract),
      ),
    ),
    readiness,
    authority,
    contractIdentity: runtimeEnabledExecutiveExperienceContractsIdentity,
    contractVersion: runtimeEnabledExecutiveExperienceContractsVersion,
    ...(input.activeSubject !== undefined
      ? {
          activeSubject: createExecutiveRuntimeSubjectReference(
            input.activeSubject,
          ),
        }
      : {}),
    ...(input.activeSurface !== undefined
      ? {
          activeSurface: createExecutiveRuntimeSurfaceReference(
            input.activeSurface,
          ),
        }
      : {}),
    ...(input.focus !== undefined
      ? { focus: createExecutiveRuntimeFocusContract(input.focus) }
      : {}),
    ...(input.attention !== undefined
      ? { attention: createExecutiveRuntimeAttentionContract(input.attention) }
      : {}),
    ...(input.presentation !== undefined
      ? {
          presentation: createExecutiveRuntimePresentationContract(
            input.presentation,
          ),
        }
      : {}),
  });
}

export function getRuntimeEnabledExecutiveExperienceContractsIdentity():
  typeof runtimeEnabledExecutiveExperienceContractsCanonicalIdentity {
  return runtimeEnabledExecutiveExperienceContractsCanonicalIdentity;
}

export function listExecutiveRuntimeContractFamilies(): ReadonlyArray<
  ExecutiveRuntimeContractFamily
> {
  return EXECUTIVE_RUNTIME_CONTRACT_FAMILIES;
}

// ─── Registry ───────────────────────────────────────────────────────────────

export const EXECUTIVE_RUNTIME_CONTRACT_PUBLIC_TYPE_NAMES = Object.freeze([
  "ExecutiveRuntimeSubjectReference",
  "ExecutiveRuntimeSurfaceReference",
  "ExecutiveRuntimeFocusContract",
  "ExecutiveRuntimeAttentionContract",
  "ExecutiveRuntimePresentationContract",
  "ExecutiveRuntimeInteractionContext",
  "ExecutiveRuntimeSurfaceContract",
  "ExecutiveRuntimeExperienceContract",
  "ExecutiveRuntimeStageContract",
  "ExecutiveRuntimeAdvisorContract",
  "ExecutiveRuntimeInsightContract",
  "ExecutiveRuntimeTimelineContract",
  "ExecutiveRuntimeExplorerContract",
  "ExecutiveRuntimeReadinessContract",
  "ExecutiveRuntimeAuthorityContract",
  "ExecutiveRuntimeMetricReference",
  "ExecutiveRuntimeContractFamily",
  "ExecutiveRuntimeContractsVerification",
] as const);

export const runtimeEnabledExecutiveExperienceContractsApiNames =
  Object.freeze([
    "getRuntimeEnabledExecutiveExperienceContractsIdentity",
    "listExecutiveRuntimeContractFamilies",
    "isExecutiveRuntimeContractFamily",
    "isExecutiveRuntimeSubjectReference",
    "isExecutiveRuntimeSurfaceReference",
    "verifyExecutiveRuntimeAuthorityContract",
    "verifyExecutiveRuntimeReadinessContract",
    "verifyExecutiveRuntimeFocusContract",
    "verifyExecutiveRuntimeAttentionContract",
    "verifyExecutiveRuntimePresentationContract",
    "verifyExecutiveRuntimeExperienceContract",
    "createExecutiveRuntimeSubjectReference",
    "createExecutiveRuntimeSurfaceReference",
    "createExecutiveRuntimeAuthorityContract",
    "createExecutiveRuntimeReadinessContract",
    "createExecutiveRuntimeFocusContract",
    "createExecutiveRuntimeAttentionContract",
    "createExecutiveRuntimePresentationContract",
    "createExecutiveRuntimeInteractionContext",
    "createExecutiveRuntimeSurfaceContract",
    "createExecutiveRuntimeStageContract",
    "createExecutiveRuntimeAdvisorContract",
    "createExecutiveRuntimeInsightContract",
    "createExecutiveRuntimeTimelineContract",
    "createExecutiveRuntimeExplorerContract",
    "createExecutiveRuntimeExperienceContract",
    "verifyExecutiveRuntimeContracts",
  ] as const);

export const runtimeEnabledExecutiveExperienceContractsRegistry =
  Object.freeze({
    identity: runtimeEnabledExecutiveExperienceContractsIdentity,
    version: runtimeEnabledExecutiveExperienceContractsVersion,
    namespace: runtimeEnabledExecutiveExperienceContractsNamespace,
    layer: runtimeEnabledExecutiveExperienceContractsLayer,
    phase: runtimeEnabledExecutiveExperienceContractsPhase,
    stage: runtimeEnabledExecutiveExperienceContractsStage,
    dependencyIdentity:
      runtimeEnabledExecutiveExperienceContractsDependencyIdentity,
    dependencyPath:
      runtimeEnabledExecutiveExperienceContractsDependencyPath,
    foundationIdentity:
      runtimeEnabledExecutiveExperienceFoundationIdentity,
    foundationVersion:
      runtimeEnabledExecutiveExperienceFoundationVersion,
    families: EXECUTIVE_RUNTIME_CONTRACT_FAMILIES,
    familyCount: EXECUTIVE_RUNTIME_CONTRACT_FAMILIES.length,
    guarantees: EXECUTIVE_RUNTIME_CONTRACT_GUARANTEES,
    guaranteeCount: EXECUTIVE_RUNTIME_CONTRACT_GUARANTEES.length,
    presentationStates: RUNTIME_EXECUTIVE_PRESENTATION_STATES,
    presentationStateCount: RUNTIME_EXECUTIVE_PRESENTATION_STATES.length,
    focusRelationships: EXECUTIVE_RUNTIME_FOCUS_RELATIONSHIPS,
    attentionLevels: EXECUTIVE_RUNTIME_ATTENTION_LEVELS,
    authoritySourceVersion: EXECUTIVE_RUNTIME_AUTHORITY_SOURCE_VERSION,
    runtimeSource: RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE,
    publicTypes: EXECUTIVE_RUNTIME_CONTRACT_PUBLIC_TYPE_NAMES,
    publicTypeCount: EXECUTIVE_RUNTIME_CONTRACT_PUBLIC_TYPE_NAMES.length,
    publicApis: runtimeEnabledExecutiveExperienceContractsApiNames,
    publicApiCount: runtimeEnabledExecutiveExperienceContractsApiNames.length,
  });

export const runtimeEnabledExecutiveExperienceContracts = Object.freeze({
  phase: "REX-1" as const,
  name: "ExecutiveRuntimeContracts" as const,
  identity: runtimeEnabledExecutiveExperienceContractsIdentity,
  version: runtimeEnabledExecutiveExperienceContractsVersion,
  namespace: runtimeEnabledExecutiveExperienceContractsNamespace,
  layer: runtimeEnabledExecutiveExperienceContractsLayer,
  stage: runtimeEnabledExecutiveExperienceContractsStage,
  architecturalRole:
    runtimeEnabledExecutiveExperienceContractsArchitecturalRole,
  role: "Contracts" as const,
  status: runtimeEnabledExecutiveExperienceContractsStability,
  upstreamDependency:
    runtimeEnabledExecutiveExperienceContractsDependencyIdentity,
  dependencyPath:
    runtimeEnabledExecutiveExperienceContractsDependencyPath,
  deterministic:
    runtimeEnabledExecutiveExperienceContractsDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  browserIndependent: true as const,
  contracts: true as const,
  principle: EXECUTIVE_RUNTIME_CONTRACTS_PRINCIPLE,
  boundary: EXECUTIVE_RUNTIME_CONTRACTS_BOUNDARY,
  families: EXECUTIVE_RUNTIME_CONTRACT_FAMILIES,
  guarantees: EXECUTIVE_RUNTIME_CONTRACT_GUARANTEES,
  forbiddenResponsibilities:
    EXECUTIVE_RUNTIME_CONTRACT_FORBIDDEN_RESPONSIBILITIES,
  presentationStates: RUNTIME_EXECUTIVE_PRESENTATION_STATES,
  runtimeSource: RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE,
  publicApiSurface: runtimeEnabledExecutiveExperienceContractsApiNames,
  publicTypes: EXECUTIVE_RUNTIME_CONTRACT_PUBLIC_TYPE_NAMES,
  registry: runtimeEnabledExecutiveExperienceContractsRegistry,
  foundationBoundary: "REX-1:1-foundation-only" as const,
  architecturalStatus:
    "Contracts Complete · Deterministic · Immutable · Framework-Independent · ReadyForRuntimeContextBinding" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface ExecutiveRuntimeContractsVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeEnabledExecutiveExperienceContractsIdentity;
  readonly version: typeof runtimeEnabledExecutiveExperienceContractsVersion;
  readonly namespace: typeof runtimeEnabledExecutiveExperienceContractsNamespace;
  readonly layer: typeof runtimeEnabledExecutiveExperienceContractsLayer;
  readonly phase: typeof runtimeEnabledExecutiveExperienceContractsPhase;
  readonly stage: typeof runtimeEnabledExecutiveExperienceContractsStage;
  readonly architecturalRole: typeof runtimeEnabledExecutiveExperienceContractsArchitecturalRole;
  readonly dependencyIdentity: typeof runtimeEnabledExecutiveExperienceContractsDependencyIdentity;
  readonly familyCount: number;
  readonly guaranteeCount: number;
  readonly presentationStateCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly frozen: boolean;
  readonly foundationBoundaryIntact: boolean;
  readonly frameworkIndependent: boolean;
  readonly presentationStatesValid: boolean;
  readonly guaranteesPresent: boolean;
  readonly authorityDirectionValid: boolean;
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

export function verifyExecutiveRuntimeContracts():
  ExecutiveRuntimeContractsVerification {
  const contracts = runtimeEnabledExecutiveExperienceContracts;
  const registry = runtimeEnabledExecutiveExperienceContractsRegistry;

  const identityOk =
    contracts.identity === "REX-1:2/ExecutiveRuntimeContracts" &&
    contracts.version === "1.2.0" &&
    contracts.namespace ===
      "nexora.rex.runtime-enabled-executive-experience.contracts" &&
    contracts.layer === "REX" &&
    contracts.phase === "REX-1" &&
    contracts.stage === "Contracts" &&
    contracts.architecturalRole === "ExecutiveRuntimeContractBoundary" &&
    contracts.role === "Contracts" &&
    contracts.status === "ContractsReady" &&
    contracts.upstreamDependency ===
      "REX-1:1/RuntimeEnabledExecutiveExperienceFoundation" &&
    contracts.upstreamDependency ===
      runtimeEnabledExecutiveExperienceFoundationIdentity &&
    registry.dependencyIdentity === contracts.upstreamDependency &&
    contracts.foundationBoundary === "REX-1:1-foundation-only";

  const dependencyOk =
    contracts.dependencyPath ===
      "@/app/lib/rex/runtimeEnabledExecutiveExperienceFoundation" &&
    EXECUTIVE_RUNTIME_CONTRACTS_BOUNDARY.consumesFoundationOnly === true &&
    EXECUTIVE_RUNTIME_CONTRACTS_BOUNDARY.soleImmediateDependency ===
      "REX-1:1/RuntimeEnabledExecutiveExperienceFoundation" &&
    EXECUTIVE_RUNTIME_CONTRACTS_BOUNDARY.importsExDriDirectly === false &&
    EXECUTIVE_RUNTIME_CONTRACTS_BOUNDARY.importsDriDirectly === false &&
    EXECUTIVE_RUNTIME_CONTRACTS_BOUNDARY.importsNolDirectly === false;

  const familiesOk = exactOrder(EXECUTIVE_RUNTIME_CONTRACT_FAMILIES, [
    "SubjectReference",
    "SurfaceReference",
    "Focus",
    "Attention",
    "Presentation",
    "InteractionContext",
    "Surface",
    "Experience",
    "Stage",
    "Advisor",
    "Insight",
    "Timeline",
    "Explorer",
    "Readiness",
    "RuntimeAuthority",
  ]);

  const presentationStatesValid = exactOrder(
    RUNTIME_EXECUTIVE_PRESENTATION_STATES,
    ["minimum", "report", "operation"],
  );

  const guaranteesPresent =
    EXECUTIVE_RUNTIME_CONTRACT_GUARANTEES.length === 20 &&
    exactOrder(
      EXECUTIVE_RUNTIME_CONTRACT_GUARANTEES.map((entry) => entry.id),
      [
        "depends-only-on-rex-1-1",
        "framework-neutral-contracts",
        "no-rendering-behavior",
        "no-ai-reasoning",
        "no-business-calculations",
        "no-persistence-logic",
        "no-network-logic",
        "no-mutable-collections",
        "focus-represented-not-calculated",
        "attention-represented-not-calculated",
        "presentation-represented-not-resolved",
        "interaction-represented-not-executed",
        "stage-no-threejs-objects",
        "advisor-no-model-provider",
        "insight-no-kpi-koi-calculation",
        "timeline-no-replay",
        "explorer-no-fetch",
        "runtime-authority-ex-dri-originated",
        "presentation-states-unchanged",
        "surfaces-independently-addressable",
      ],
    ) &&
    EXECUTIVE_RUNTIME_CONTRACT_GUARANTEES.every(
      (entry, index) => entry.order === index + 1,
    );

  const authorityDirectionValid =
    RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE.relationship ===
      "EX-DRI → REX" &&
    EXECUTIVE_RUNTIME_AUTHORITY_SOURCE_VERSION === "1.9.0" &&
    verifyExecutiveRuntimeAuthorityContract(
      createExecutiveRuntimeAuthorityContract(),
    );

  const uniquenessOk =
    unique([...EXECUTIVE_RUNTIME_CONTRACT_FAMILIES]) &&
    unique(EXECUTIVE_RUNTIME_CONTRACT_GUARANTEES.map((entry) => entry.id)) &&
    unique([...RUNTIME_EXECUTIVE_PRESENTATION_STATES]);

  const registryIntegrityOk =
    registry.familyCount === EXECUTIVE_RUNTIME_CONTRACT_FAMILIES.length &&
    registry.guaranteeCount === EXECUTIVE_RUNTIME_CONTRACT_GUARANTEES.length &&
    registry.presentationStateCount ===
      RUNTIME_EXECUTIVE_PRESENTATION_STATES.length &&
    registry.publicTypeCount ===
      EXECUTIVE_RUNTIME_CONTRACT_PUBLIC_TYPE_NAMES.length &&
    registry.publicApiCount ===
      runtimeEnabledExecutiveExperienceContractsApiNames.length;

  const immutabilityOk =
    Object.isFrozen(contracts) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(
      runtimeEnabledExecutiveExperienceContractsCanonicalIdentity,
    ) &&
    Object.isFrozen(EXECUTIVE_RUNTIME_CONTRACT_FAMILIES) &&
    Object.isFrozen(EXECUTIVE_RUNTIME_CONTRACT_GUARANTEES) &&
    Object.isFrozen(EXECUTIVE_RUNTIME_CONTRACTS_BOUNDARY) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_PRESENTATION_STATES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_EXPERIENCE_RUNTIME_SOURCE);

  const foundationBoundaryIntact =
    contracts.upstreamDependency ===
      "REX-1:1/RuntimeEnabledExecutiveExperienceFoundation" &&
    contracts.boundary.soleImmediateDependency ===
      "REX-1:1/RuntimeEnabledExecutiveExperienceFoundation" &&
    contracts.boundary.consumesFoundationOnly === true;

  const frameworkIndependent =
    contracts.frameworkIndependent === true &&
    contracts.rendererIndependent === true &&
    contracts.browserIndependent === true &&
    contracts.boundary.frameworkIndependent === true;

  const ok =
    identityOk &&
    dependencyOk &&
    familiesOk &&
    presentationStatesValid &&
    guaranteesPresent &&
    authorityDirectionValid &&
    uniquenessOk &&
    registryIntegrityOk &&
    immutabilityOk &&
    foundationBoundaryIntact &&
    frameworkIndependent &&
    contracts.principle === EXECUTIVE_RUNTIME_CONTRACTS_PRINCIPLE;

  return Object.freeze({
    ok,
    identity: runtimeEnabledExecutiveExperienceContractsIdentity,
    version: runtimeEnabledExecutiveExperienceContractsVersion,
    namespace: runtimeEnabledExecutiveExperienceContractsNamespace,
    layer: runtimeEnabledExecutiveExperienceContractsLayer,
    phase: runtimeEnabledExecutiveExperienceContractsPhase,
    stage: runtimeEnabledExecutiveExperienceContractsStage,
    architecturalRole:
      runtimeEnabledExecutiveExperienceContractsArchitecturalRole,
    dependencyIdentity:
      runtimeEnabledExecutiveExperienceContractsDependencyIdentity,
    familyCount: EXECUTIVE_RUNTIME_CONTRACT_FAMILIES.length,
    guaranteeCount: EXECUTIVE_RUNTIME_CONTRACT_GUARANTEES.length,
    presentationStateCount: RUNTIME_EXECUTIVE_PRESENTATION_STATES.length,
    publicTypeCount: EXECUTIVE_RUNTIME_CONTRACT_PUBLIC_TYPE_NAMES.length,
    publicApiCount:
      runtimeEnabledExecutiveExperienceContractsApiNames.length,
    frozen: immutabilityOk,
    foundationBoundaryIntact,
    frameworkIndependent,
    presentationStatesValid,
    guaranteesPresent,
    authorityDirectionValid,
  });
}
