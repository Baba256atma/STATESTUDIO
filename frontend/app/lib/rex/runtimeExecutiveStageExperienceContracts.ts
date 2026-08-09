/**
 * REX-2:2 — Runtime Executive Stage Experience Contracts.
 *
 * Formal contracts for describing and requesting Executive Stage state.
 * Declarative only — no orchestration, resolution, transitions, or rendering.
 *
 * Canonical flow:
 *   REX-2:1 Foundation → REX-2:2 Contracts → later REX-2 runtime behavior
 *
 * REX-2:1 answers: What exists on a runtime Executive Stage?
 * REX-2:2 answers: What are the legal contracts for describing/requesting Stage state?
 */

import {
  RUNTIME_EXECUTIVE_STAGE_ATTENTION_LEVELS,
  RUNTIME_EXECUTIVE_STAGE_CONNECTION_DIRECTIONS,
  RUNTIME_EXECUTIVE_STAGE_CONNECTION_KINDS,
  RUNTIME_EXECUTIVE_STAGE_CONNECTION_STATES,
  RUNTIME_EXECUTIVE_STAGE_FOCUS_ROLES,
  RUNTIME_EXECUTIVE_STAGE_PRESENTATION_STATES,
  RUNTIME_EXECUTIVE_STAGE_SCENE_STATES,
  RUNTIME_EXECUTIVE_STAGE_SELECTION_STATES,
  RUNTIME_EXECUTIVE_STAGE_SUBJECT_KINDS,
  RUNTIME_EXECUTIVE_STAGE_VISIBILITY_STATES,
  isRuntimeExecutiveStageAttentionLevel,
  isRuntimeExecutiveStageConnectionDirection,
  isRuntimeExecutiveStageConnectionKind,
  isRuntimeExecutiveStageFocusRole,
  isRuntimeExecutiveStagePresentationState,
  isRuntimeExecutiveStageSceneState,
  isRuntimeExecutiveStageSelectionState,
  isRuntimeExecutiveStageSubjectKind,
  isRuntimeExecutiveStageVisibility,
  runtimeExecutiveStageExperienceFoundationIdentity,
  runtimeExecutiveStageExperienceFoundationVersion,
  validateRuntimeExecutiveStageScene,
  type RuntimeExecutiveStageAttentionLevel,
  type RuntimeExecutiveStageConnection,
  type RuntimeExecutiveStageConnectionDirection,
  type RuntimeExecutiveStageConnectionKind,
  type RuntimeExecutiveStageConnectionState,
  type RuntimeExecutiveStageContext,
  type RuntimeExecutiveStageFocusRole,
  type RuntimeExecutiveStagePresentationState,
  type RuntimeExecutiveStageScene,
  type RuntimeExecutiveStageSceneState,
  type RuntimeExecutiveStageSelectionState,
  type RuntimeExecutiveStageSnapshot,
  type RuntimeExecutiveStageSubject,
  type RuntimeExecutiveStageSubjectKind,
  type RuntimeExecutiveStageVisibility,
} from "@/app/lib/rex/runtimeExecutiveStageExperienceFoundation";

// ─── Identity ───────────────────────────────────────────────────────────────

export const runtimeExecutiveStageExperienceContractsIdentity =
  "REX-2:2/RuntimeExecutiveStageExperienceContracts" as const;

export const runtimeExecutiveStageExperienceContractsVersion =
  "2.2.0" as const;

export const runtimeExecutiveStageExperienceContractsNamespace =
  "nexora.rex.stage.contracts" as const;

export const runtimeExecutiveStageExperienceContractsLayer =
  "RuntimeExecutiveExperience" as const;

export const runtimeExecutiveStageExperienceContractsDomain =
  "ExecutiveStage" as const;

export const runtimeExecutiveStageExperienceContractsPhase =
  "Contracts" as const;

export const runtimeExecutiveStageExperienceContractsArchitecturalRole =
  "RuntimeExecutiveStageExperienceContractsBoundary" as const;

export const runtimeExecutiveStageExperienceContractsDependencyIdentity =
  runtimeExecutiveStageExperienceFoundationIdentity;

export const runtimeExecutiveStageExperienceContractsDependencyPath =
  "@/app/lib/rex/runtimeExecutiveStageExperienceFoundation" as const;

export const runtimeExecutiveStageExperienceContractsStability =
  "ContractsReady" as const;

export const runtimeExecutiveStageExperienceContractsDeterministic =
  true as const;

export const runtimeExecutiveStageExperienceContractsSideEffectPolicy =
  "side-effect-free" as const;

export const runtimeExecutiveStageExperienceContractsMutationPolicy =
  "immutable" as const;

export const runtimeExecutiveStageExperienceContractsCanonicalIdentity =
  Object.freeze({
    identity: runtimeExecutiveStageExperienceContractsIdentity,
    version: runtimeExecutiveStageExperienceContractsVersion,
    namespace: runtimeExecutiveStageExperienceContractsNamespace,
    layer: runtimeExecutiveStageExperienceContractsLayer,
    domain: runtimeExecutiveStageExperienceContractsDomain,
    phase: runtimeExecutiveStageExperienceContractsPhase,
    architecturalRole:
      runtimeExecutiveStageExperienceContractsArchitecturalRole,
    dependencyIdentity:
      runtimeExecutiveStageExperienceContractsDependencyIdentity,
    dependencyPath: runtimeExecutiveStageExperienceContractsDependencyPath,
    upstreamVersion: runtimeExecutiveStageExperienceFoundationVersion,
    stabilityStatus: runtimeExecutiveStageExperienceContractsStability,
    deterministicStatus:
      runtimeExecutiveStageExperienceContractsDeterministic,
    sideEffectPolicy:
      runtimeExecutiveStageExperienceContractsSideEffectPolicy,
    mutationPolicy: runtimeExecutiveStageExperienceContractsMutationPolicy,
  });

export const RUNTIME_EXECUTIVE_STAGE_CONTRACTS_PRINCIPLE =
  "Contracts define legal runtime boundaries for describing and requesting Stage state. They do not decide Stage behavior and do not render." as const;

export const RUNTIME_EXECUTIVE_STAGE_CONTRACTS_BOUNDARY = Object.freeze({
  rexAuthority: "Runtime-enabled-Executive-Experience" as const,
  contractsAuthority: "REX-2:2" as const,
  architecturalRole:
    "RuntimeExecutiveStageExperienceContractsBoundary" as const,
  soleImmediateDependency:
    "REX-2:1/RuntimeExecutiveStageExperienceFoundation" as const,
  consumesFoundationOnly: true as const,
  importsRex1Directly: false as const,
  importsExDriDirectly: false as const,
  importsDriDirectly: false as const,
  importsNolDirectly: false as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  mutatesStageState: false as const,
  executesSceneChanges: false as const,
  resolvesFocus: false as const,
  resolvesPresentation: false as const,
  calculatesAttention: false as const,
  introducesOrchestration: false as const,
});

// ─── Reused Foundation vocabularies (exact references — not forked) ─────────

export const RUNTIME_EXECUTIVE_STAGE_CONTRACT_PRESENTATION_STATES =
  RUNTIME_EXECUTIVE_STAGE_PRESENTATION_STATES;
export const RUNTIME_EXECUTIVE_STAGE_CONTRACT_VISIBILITY_STATES =
  RUNTIME_EXECUTIVE_STAGE_VISIBILITY_STATES;
export const RUNTIME_EXECUTIVE_STAGE_CONTRACT_SELECTION_STATES =
  RUNTIME_EXECUTIVE_STAGE_SELECTION_STATES;
export const RUNTIME_EXECUTIVE_STAGE_CONTRACT_FOCUS_ROLES =
  RUNTIME_EXECUTIVE_STAGE_FOCUS_ROLES;
export const RUNTIME_EXECUTIVE_STAGE_CONTRACT_ATTENTION_LEVELS =
  RUNTIME_EXECUTIVE_STAGE_ATTENTION_LEVELS;
export const RUNTIME_EXECUTIVE_STAGE_CONTRACT_CONNECTION_KINDS =
  RUNTIME_EXECUTIVE_STAGE_CONNECTION_KINDS;
export const RUNTIME_EXECUTIVE_STAGE_CONTRACT_CONNECTION_DIRECTIONS =
  RUNTIME_EXECUTIVE_STAGE_CONNECTION_DIRECTIONS;
export const RUNTIME_EXECUTIVE_STAGE_CONTRACT_CONNECTION_STATES =
  RUNTIME_EXECUTIVE_STAGE_CONNECTION_STATES;
export const RUNTIME_EXECUTIVE_STAGE_CONTRACT_SCENE_STATES =
  RUNTIME_EXECUTIVE_STAGE_SCENE_STATES;
export const RUNTIME_EXECUTIVE_STAGE_CONTRACT_SUBJECT_KINDS =
  RUNTIME_EXECUTIVE_STAGE_SUBJECT_KINDS;

// ─── Contract families / kinds / sources / results ──────────────────────────

export const RUNTIME_EXECUTIVE_STAGE_CONTRACT_FAMILIES = Object.freeze([
  "StageSubject",
  "StageScene",
  "Selection",
  "Focus",
  "Presentation",
  "Visibility",
  "Attention",
  "Connection",
  "SceneChange",
  "StageContext",
  "StageSnapshot",
  "StageInspection",
] as const);

export type RuntimeExecutiveStageContractFamily =
  (typeof RUNTIME_EXECUTIVE_STAGE_CONTRACT_FAMILIES)[number];

export const RUNTIME_EXECUTIVE_STAGE_CONTRACT_KINDS = Object.freeze([
  "subject",
  "scene",
  "selection",
  "focus",
  "presentation",
  "visibility",
  "attention",
  "connection",
  "scene-change",
  "scene-change-set",
  "context",
  "snapshot",
  "inspection",
] as const);

export type RuntimeExecutiveStageContractKind =
  (typeof RUNTIME_EXECUTIVE_STAGE_CONTRACT_KINDS)[number];

export const RUNTIME_EXECUTIVE_STAGE_CONTRACT_SOURCES = Object.freeze([
  "executive",
  "director",
  "advisor",
  "runtime",
  "system",
] as const);

export type RuntimeExecutiveStageContractSource =
  (typeof RUNTIME_EXECUTIVE_STAGE_CONTRACT_SOURCES)[number];

export const RUNTIME_EXECUTIVE_STAGE_CONTRACT_RESULT_STATUSES = Object.freeze([
  "accepted",
  "rejected",
  "invalid",
] as const);

export type RuntimeExecutiveStageContractResultStatus =
  (typeof RUNTIME_EXECUTIVE_STAGE_CONTRACT_RESULT_STATUSES)[number];

export const RUNTIME_EXECUTIVE_STAGE_SCENE_CHANGE_KINDS = Object.freeze([
  "subject-added",
  "subject-removed",
  "subject-updated",
  "selection-changed",
  "focus-changed",
  "presentation-changed",
  "visibility-changed",
  "attention-changed",
  "connection-added",
  "connection-removed",
  "connection-updated",
  "context-changed",
  "scene-replaced",
] as const);

export type RuntimeExecutiveStageSceneChangeKind =
  (typeof RUNTIME_EXECUTIVE_STAGE_SCENE_CHANGE_KINDS)[number];

export const RUNTIME_EXECUTIVE_STAGE_INSPECTION_KINDS = Object.freeze([
  "get-subject",
  "inspect-selected-subject",
  "inspect-primary-focus",
  "inspect-presentation-state",
  "inspect-visibility",
  "inspect-attention",
  "inspect-connections",
  "inspect-related-subjects",
  "inspect-scene-state",
] as const);

export type RuntimeExecutiveStageInspectionKind =
  (typeof RUNTIME_EXECUTIVE_STAGE_INSPECTION_KINDS)[number];

export const RUNTIME_EXECUTIVE_STAGE_CONTRACT_REASON_KINDS = Object.freeze([
  "executive-intent",
  "director-direction",
  "advisor-guidance",
  "runtime-policy",
  "system-consistency",
  "unspecified",
] as const);

export type RuntimeExecutiveStageContractReasonKind =
  (typeof RUNTIME_EXECUTIVE_STAGE_CONTRACT_REASON_KINDS)[number];

// ─── Shared contract structures ─────────────────────────────────────────────

export interface RuntimeExecutiveStageContractReason {
  readonly kind: RuntimeExecutiveStageContractReasonKind;
  readonly subjectId?: string;
  readonly detail?: string;
}

export interface RuntimeExecutiveStageContractRequest {
  readonly requestId: string;
  readonly contractKind: RuntimeExecutiveStageContractKind;
  readonly sceneId?: string;
  readonly expectedSceneRevision?: string;
  readonly source: RuntimeExecutiveStageContractSource;
  readonly reason?: RuntimeExecutiveStageContractReason;
}

export interface RuntimeExecutiveStageContractResult<T = unknown> {
  readonly status: RuntimeExecutiveStageContractResultStatus;
  readonly requestId?: string;
  readonly contractKind: RuntimeExecutiveStageContractKind;
  readonly code?: string;
  readonly detail?: string;
  readonly data?: T;
}

// ─── Domain contracts ───────────────────────────────────────────────────────

export interface RuntimeExecutiveStageSubjectContract {
  readonly contractKind: "subject";
  readonly subject: RuntimeExecutiveStageSubject;
  readonly sceneId?: string;
  readonly sceneRevision?: string;
  readonly source: RuntimeExecutiveStageContractSource;
  readonly reason?: RuntimeExecutiveStageContractReason;
  readonly requestId?: string;
}

export interface RuntimeExecutiveStageSceneContract {
  readonly contractKind: "scene";
  readonly scene: RuntimeExecutiveStageScene;
  readonly source: RuntimeExecutiveStageContractSource;
  readonly reason?: RuntimeExecutiveStageContractReason;
  readonly requestId?: string;
}

export interface RuntimeExecutiveStageSelectionContract {
  readonly contractKind: "selection";
  readonly subjectId: string;
  readonly selection: RuntimeExecutiveStageSelectionState;
  readonly sceneId?: string;
  readonly sceneRevision?: string;
  readonly source: RuntimeExecutiveStageContractSource;
  readonly reason?: RuntimeExecutiveStageContractReason;
  readonly requestId?: string;
}

export interface RuntimeExecutiveStageFocusContract {
  readonly contractKind: "focus";
  readonly subjectId: string;
  readonly focusRole: RuntimeExecutiveStageFocusRole;
  readonly relatedPrimaryFocusSubjectId?: string;
  readonly sceneId?: string;
  readonly sceneRevision?: string;
  readonly source: RuntimeExecutiveStageContractSource;
  readonly reason?: RuntimeExecutiveStageContractReason;
  readonly requestId?: string;
}

export interface RuntimeExecutiveStagePresentationContract {
  readonly contractKind: "presentation";
  readonly subjectId: string;
  readonly presentationState: RuntimeExecutiveStagePresentationState;
  readonly sceneId?: string;
  readonly sceneRevision?: string;
  readonly source: RuntimeExecutiveStageContractSource;
  readonly reason?: RuntimeExecutiveStageContractReason;
  readonly requestId?: string;
}

export interface RuntimeExecutiveStageVisibilityContract {
  readonly contractKind: "visibility";
  readonly subjectId: string;
  readonly visibility: RuntimeExecutiveStageVisibility;
  readonly sceneId?: string;
  readonly sceneRevision?: string;
  readonly source: RuntimeExecutiveStageContractSource;
  readonly reason?: RuntimeExecutiveStageContractReason;
  readonly requestId?: string;
}

export interface RuntimeExecutiveStageAttentionContract {
  readonly contractKind: "attention";
  readonly subjectId: string;
  readonly attention: RuntimeExecutiveStageAttentionLevel;
  readonly sceneId?: string;
  readonly sceneRevision?: string;
  readonly persistence?: string;
  readonly scope?: string;
  readonly source: RuntimeExecutiveStageContractSource;
  readonly reason?: RuntimeExecutiveStageContractReason;
  readonly requestId?: string;
}

export interface RuntimeExecutiveStageConnectionContract {
  readonly contractKind: "connection";
  readonly connection: RuntimeExecutiveStageConnection;
  readonly sceneId?: string;
  readonly sceneRevision?: string;
  readonly source: RuntimeExecutiveStageContractSource;
  readonly reason?: RuntimeExecutiveStageContractReason;
  readonly requestId?: string;
}

export interface RuntimeExecutiveStageSceneChangeContract {
  readonly contractKind: "scene-change";
  readonly changeId: string;
  readonly changeKind: RuntimeExecutiveStageSceneChangeKind;
  readonly subjectId?: string;
  readonly connectionId?: string;
  readonly sceneId?: string;
  readonly sceneRevision?: string;
  readonly source: RuntimeExecutiveStageContractSource;
  readonly reason?: RuntimeExecutiveStageContractReason;
  readonly requestId?: string;
  readonly detail?: string;
}

export interface RuntimeExecutiveStageSceneChangeSet {
  readonly contractKind: "scene-change-set";
  readonly changeSetId: string;
  readonly sourceSceneRevision: string;
  readonly targetSceneRevision?: string;
  readonly changes: ReadonlyArray<RuntimeExecutiveStageSceneChangeContract>;
  readonly sceneId?: string;
  readonly source: RuntimeExecutiveStageContractSource;
  readonly reason?: RuntimeExecutiveStageContractReason;
  readonly requestId?: string;
}

export interface RuntimeExecutiveStageContextContract {
  readonly contractKind: "context";
  readonly context: RuntimeExecutiveStageContext;
  readonly sceneId?: string;
  readonly sceneRevision?: string;
  readonly source: RuntimeExecutiveStageContractSource;
  readonly reason?: RuntimeExecutiveStageContractReason;
  readonly requestId?: string;
}

export interface RuntimeExecutiveStageSnapshotContract {
  readonly contractKind: "snapshot";
  readonly snapshot: RuntimeExecutiveStageSnapshot;
  readonly source: RuntimeExecutiveStageContractSource;
  readonly reason?: RuntimeExecutiveStageContractReason;
  readonly requestId?: string;
}

export interface RuntimeExecutiveStageInspectionContract {
  readonly contractKind: "inspection";
  readonly inspectionKind: RuntimeExecutiveStageInspectionKind;
  readonly subjectId?: string;
  readonly sceneId?: string;
  readonly sceneRevision?: string;
  readonly source: RuntimeExecutiveStageContractSource;
  readonly reason?: RuntimeExecutiveStageContractReason;
  readonly requestId?: string;
}

export interface RuntimeExecutiveStageInspectionResult {
  readonly status: RuntimeExecutiveStageContractResultStatus;
  readonly inspectionKind: RuntimeExecutiveStageInspectionKind;
  readonly requestId?: string;
  readonly subject?: RuntimeExecutiveStageSubject;
  readonly subjects?: ReadonlyArray<RuntimeExecutiveStageSubject>;
  readonly connections?: ReadonlyArray<RuntimeExecutiveStageConnection>;
  readonly presentationState?: RuntimeExecutiveStagePresentationState;
  readonly visibility?: RuntimeExecutiveStageVisibility;
  readonly attention?: RuntimeExecutiveStageAttentionLevel;
  readonly sceneState?: RuntimeExecutiveStageSceneState;
  readonly sceneId?: string;
  readonly sceneRevision?: string;
  readonly code?: string;
  readonly detail?: string;
}

export type RuntimeExecutiveStageExperienceContract =
  | RuntimeExecutiveStageSubjectContract
  | RuntimeExecutiveStageSceneContract
  | RuntimeExecutiveStageSelectionContract
  | RuntimeExecutiveStageFocusContract
  | RuntimeExecutiveStagePresentationContract
  | RuntimeExecutiveStageVisibilityContract
  | RuntimeExecutiveStageAttentionContract
  | RuntimeExecutiveStageConnectionContract
  | RuntimeExecutiveStageSceneChangeContract
  | RuntimeExecutiveStageSceneChangeSet
  | RuntimeExecutiveStageContextContract
  | RuntimeExecutiveStageSnapshotContract
  | RuntimeExecutiveStageInspectionContract;

// ─── Invariants ─────────────────────────────────────────────────────────────

export const RUNTIME_EXECUTIVE_STAGE_CONTRACTS_INVARIANTS = Object.freeze([
  Object.freeze({
    id: "depends-only-on-rex-2-1",
    order: 1,
    statement: "REX-2:2 depends only on REX-2:1.",
  }),
  Object.freeze({
    id: "foundation-types-reused",
    order: 2,
    statement: "Foundation canonical types are reused.",
  }),
  Object.freeze({
    id: "renderer-neutral-contracts",
    order: 3,
    statement: "Contracts are renderer-neutral.",
  }),
  Object.freeze({
    id: "immutable-contracts",
    order: 4,
    statement: "Contracts are immutable.",
  }),
  Object.freeze({
    id: "selection-focus-independent",
    order: 5,
    statement: "Selection and focus remain independent.",
  }),
  Object.freeze({
    id: "presentation-visibility-independent",
    order: 6,
    statement: "Presentation and visibility remain independent.",
  }),
  Object.freeze({
    id: "attention-styling-independent",
    order: 7,
    statement: "Attention and visual styling remain independent.",
  }),
  Object.freeze({
    id: "connection-graphics-independent",
    order: 8,
    statement: "Connection semantics and connection graphics remain independent.",
  }),
  Object.freeze({
    id: "stable-subject-identifiers",
    order: 9,
    statement: "Scene subject identifiers are stable.",
  }),
  Object.freeze({
    id: "connection-endpoints-reference-subjects",
    order: 10,
    statement: "Connection endpoints reference Stage subjects.",
  }),
  Object.freeze({
    id: "deterministic-subject-order",
    order: 11,
    statement: "Subject order is deterministic.",
  }),
  Object.freeze({
    id: "deterministic-connection-order",
    order: 12,
    statement: "Connection order is deterministic.",
  }),
  Object.freeze({
    id: "deterministic-changeset-order",
    order: 13,
    statement: "Change-set order is deterministic.",
  }),
  Object.freeze({
    id: "explicit-scene-revisions",
    order: 14,
    statement: "Scene revisions are explicit.",
  }),
  Object.freeze({
    id: "contracts-never-mutate-stage",
    order: 15,
    statement: "Contracts never mutate Stage state.",
  }),
  Object.freeze({
    id: "scene-change-describes-not-executes",
    order: 16,
    statement: "Scene-change contracts describe changes but do not execute them.",
  }),
  Object.freeze({
    id: "focus-describes-not-resolves",
    order: 17,
    statement: "Focus contracts describe focus but do not resolve it.",
  }),
  Object.freeze({
    id: "presentation-describes-not-resolves",
    order: 18,
    statement: "Presentation contracts describe state but do not resolve it.",
  }),
  Object.freeze({
    id: "attention-describes-not-calculates",
    order: 19,
    statement: "Attention contracts describe attention but do not calculate it.",
  }),
  Object.freeze({
    id: "no-react-dependency",
    order: 20,
    statement: "No React dependency exists.",
  }),
  Object.freeze({
    id: "no-threejs-dependency",
    order: 21,
    statement: "No Three.js dependency exists.",
  }),
  Object.freeze({
    id: "no-dom-browser-dependency",
    order: 22,
    statement: "No browser/DOM dependency exists.",
  }),
  Object.freeze({
    id: "no-direct-dri-dependency",
    order: 23,
    statement: "No direct DRI dependency exists.",
  }),
  Object.freeze({
    id: "no-direct-nol-dependency",
    order: 24,
    statement: "No direct NOL dependency exists.",
  }),
  Object.freeze({
    id: "no-direct-ex-dri-dependency",
    order: 25,
    statement: "No direct EX-DRI dependency exists.",
  }),
  Object.freeze({
    id: "no-direct-rex-1-dependency",
    order: 26,
    statement: "No direct REX-1 dependency exists.",
  }),
  Object.freeze({
    id: "no-generic-metadata-bag",
    order: 27,
    statement:
      "No generic metadata bag replaces explicit core Stage semantics.",
  }),
  Object.freeze({
    id: "deterministic-side-effect-free-apis",
    order: 28,
    statement: "Contract APIs are deterministic and side-effect free.",
  }),
] as const);

export type RuntimeExecutiveStageContractsInvariant =
  (typeof RUNTIME_EXECUTIVE_STAGE_CONTRACTS_INVARIANTS)[number];

export const RUNTIME_EXECUTIVE_STAGE_CONTRACTS_FORBIDDEN_RESPONSIBILITIES =
  Object.freeze([
    "Stage orchestration",
    "focus resolution",
    "selection behavior",
    "scene transitions",
    "presentation resolution",
    "attention calculation",
    "rendering",
    "React",
    "Three.js",
    "Director logic",
    "adapters",
    "execute",
    "apply",
    "resolve",
    "orchestrate",
    "transition",
    "render",
    "animate",
  ] as const);

export const RUNTIME_EXECUTIVE_STAGE_CONTRACTS_PUBLIC_TYPE_NAMES = Object.freeze([
  "RuntimeExecutiveStageSubjectContract",
  "RuntimeExecutiveStageSceneContract",
  "RuntimeExecutiveStageSelectionContract",
  "RuntimeExecutiveStageFocusContract",
  "RuntimeExecutiveStagePresentationContract",
  "RuntimeExecutiveStageVisibilityContract",
  "RuntimeExecutiveStageAttentionContract",
  "RuntimeExecutiveStageConnectionContract",
  "RuntimeExecutiveStageSceneChangeContract",
  "RuntimeExecutiveStageSceneChangeSet",
  "RuntimeExecutiveStageContextContract",
  "RuntimeExecutiveStageSnapshotContract",
  "RuntimeExecutiveStageInspectionContract",
  "RuntimeExecutiveStageInspectionResult",
  "RuntimeExecutiveStageContractRequest",
  "RuntimeExecutiveStageContractResult",
  "RuntimeExecutiveStageContractSource",
  "RuntimeExecutiveStageContractReason",
  "RuntimeExecutiveStageExperienceContract",
] as const);

export const RUNTIME_EXECUTIVE_STAGE_CONTRACTS_REGISTRY_SECTIONS = Object.freeze([
  "Identity",
  "Dependency",
  "ContractFamilies",
  "ContractKinds",
  "Sources",
  "Results",
  "SceneChangeKinds",
  "InspectionKinds",
  "Invariants",
  "APIs",
  "Validation",
] as const);

// ─── Helpers ────────────────────────────────────────────────────────────────

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
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

function freezeReason(
  reason: RuntimeExecutiveStageContractReason | undefined,
): RuntimeExecutiveStageContractReason | undefined {
  if (reason === undefined) return undefined;
  return Object.freeze({
    kind: reason.kind,
    ...(reason.subjectId !== undefined ? { subjectId: reason.subjectId } : {}),
    ...(reason.detail !== undefined ? { detail: reason.detail } : {}),
  });
}

function requireSource(
  source: RuntimeExecutiveStageContractSource,
): RuntimeExecutiveStageContractSource {
  if (
    !(
      RUNTIME_EXECUTIVE_STAGE_CONTRACT_SOURCES as readonly string[]
    ).includes(source)
  ) {
    throw new TypeError("source must be a known Stage contract source");
  }
  return source;
}

// ─── Predicates ─────────────────────────────────────────────────────────────

export function isRuntimeExecutiveStageContractFamily(
  value: unknown,
): value is RuntimeExecutiveStageContractFamily {
  return (
    RUNTIME_EXECUTIVE_STAGE_CONTRACT_FAMILIES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveStageContractKind(
  value: unknown,
): value is RuntimeExecutiveStageContractKind {
  return (
    RUNTIME_EXECUTIVE_STAGE_CONTRACT_KINDS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveStageContractSource(
  value: unknown,
): value is RuntimeExecutiveStageContractSource {
  return (
    RUNTIME_EXECUTIVE_STAGE_CONTRACT_SOURCES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveStageContractResultStatus(
  value: unknown,
): value is RuntimeExecutiveStageContractResultStatus {
  return (
    RUNTIME_EXECUTIVE_STAGE_CONTRACT_RESULT_STATUSES as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveStageSceneChangeKind(
  value: unknown,
): value is RuntimeExecutiveStageSceneChangeKind {
  return (
    RUNTIME_EXECUTIVE_STAGE_SCENE_CHANGE_KINDS as readonly unknown[]
  ).includes(value);
}

export function isRuntimeExecutiveStageInspectionKind(
  value: unknown,
): value is RuntimeExecutiveStageInspectionKind {
  return (
    RUNTIME_EXECUTIVE_STAGE_INSPECTION_KINDS as readonly unknown[]
  ).includes(value);
}

// ─── Create APIs (declarative only) ─────────────────────────────────────────

export function createRuntimeExecutiveStageContractReason(input: {
  readonly kind: RuntimeExecutiveStageContractReasonKind;
  readonly subjectId?: string;
  readonly detail?: string;
}): RuntimeExecutiveStageContractReason {
  if (
    !(
      RUNTIME_EXECUTIVE_STAGE_CONTRACT_REASON_KINDS as readonly string[]
    ).includes(input.kind)
  ) {
    throw new TypeError("reason kind is invalid");
  }
  return Object.freeze({
    kind: input.kind,
    ...(input.subjectId !== undefined ? { subjectId: input.subjectId } : {}),
    ...(input.detail !== undefined ? { detail: input.detail } : {}),
  });
}

export function createRuntimeExecutiveStageContractRequest(input: {
  readonly requestId: string;
  readonly contractKind: RuntimeExecutiveStageContractKind;
  readonly source: RuntimeExecutiveStageContractSource;
  readonly sceneId?: string;
  readonly expectedSceneRevision?: string;
  readonly reason?: RuntimeExecutiveStageContractReason;
}): RuntimeExecutiveStageContractRequest {
  if (!isNonEmptyString(input.requestId)) {
    throw new TypeError("requestId must be a non-empty string");
  }
  if (!isRuntimeExecutiveStageContractKind(input.contractKind)) {
    throw new TypeError("contractKind is invalid");
  }
  return Object.freeze({
    requestId: input.requestId,
    contractKind: input.contractKind,
    source: requireSource(input.source),
    ...(input.sceneId !== undefined ? { sceneId: input.sceneId } : {}),
    ...(input.expectedSceneRevision !== undefined
      ? { expectedSceneRevision: input.expectedSceneRevision }
      : {}),
    ...(input.reason !== undefined
      ? { reason: freezeReason(input.reason) }
      : {}),
  });
}

export function createRuntimeExecutiveStageContractResult<T>(input: {
  readonly status: RuntimeExecutiveStageContractResultStatus;
  readonly contractKind: RuntimeExecutiveStageContractKind;
  readonly requestId?: string;
  readonly code?: string;
  readonly detail?: string;
  readonly data?: T;
}): RuntimeExecutiveStageContractResult<T> {
  if (!isRuntimeExecutiveStageContractResultStatus(input.status)) {
    throw new TypeError("status must be accepted, rejected, or invalid");
  }
  if (!isRuntimeExecutiveStageContractKind(input.contractKind)) {
    throw new TypeError("contractKind is invalid");
  }
  return Object.freeze({
    status: input.status,
    contractKind: input.contractKind,
    ...(input.requestId !== undefined ? { requestId: input.requestId } : {}),
    ...(input.code !== undefined ? { code: input.code } : {}),
    ...(input.detail !== undefined ? { detail: input.detail } : {}),
    ...(input.data !== undefined ? { data: input.data } : {}),
  });
}

export function createRuntimeExecutiveStageSubjectContract(input: {
  readonly subject: RuntimeExecutiveStageSubject;
  readonly source: RuntimeExecutiveStageContractSource;
  readonly sceneId?: string;
  readonly sceneRevision?: string;
  readonly reason?: RuntimeExecutiveStageContractReason;
  readonly requestId?: string;
}): RuntimeExecutiveStageSubjectContract {
  if (!isNonEmptyString(input.subject.subjectId)) {
    throw new TypeError("subject.subjectId is required");
  }
  if (!isRuntimeExecutiveStageSubjectKind(input.subject.kind)) {
    throw new TypeError("subject.kind is not a Foundation subject kind");
  }
  if (!isRuntimeExecutiveStagePresentationState(input.subject.presentationState)) {
    throw new TypeError("subject.presentationState is invalid");
  }
  if (!isRuntimeExecutiveStageVisibility(input.subject.visibility)) {
    throw new TypeError("subject.visibility is invalid");
  }
  if (!isRuntimeExecutiveStageSelectionState(input.subject.selection)) {
    throw new TypeError("subject.selection is invalid");
  }
  if (!isRuntimeExecutiveStageFocusRole(input.subject.focusRole)) {
    throw new TypeError("subject.focusRole is invalid");
  }
  if (!isRuntimeExecutiveStageAttentionLevel(input.subject.attention)) {
    throw new TypeError("subject.attention is invalid");
  }

  return Object.freeze({
    contractKind: "subject" as const,
    subject: input.subject,
    source: requireSource(input.source),
    ...(input.sceneId !== undefined ? { sceneId: input.sceneId } : {}),
    ...(input.sceneRevision !== undefined
      ? { sceneRevision: input.sceneRevision }
      : {}),
    ...(input.reason !== undefined
      ? { reason: freezeReason(input.reason) }
      : {}),
    ...(input.requestId !== undefined ? { requestId: input.requestId } : {}),
  });
}

export function createRuntimeExecutiveStageSceneContract(input: {
  readonly scene: RuntimeExecutiveStageScene;
  readonly source: RuntimeExecutiveStageContractSource;
  readonly reason?: RuntimeExecutiveStageContractReason;
  readonly requestId?: string;
}): RuntimeExecutiveStageSceneContract {
  if (!validateRuntimeExecutiveStageScene(input.scene)) {
    throw new TypeError("scene fails Foundation structural validation");
  }
  if (!isNonEmptyString(input.scene.revision)) {
    throw new TypeError("scene.revision must be explicit");
  }

  return Object.freeze({
    contractKind: "scene" as const,
    scene: input.scene,
    source: requireSource(input.source),
    ...(input.reason !== undefined
      ? { reason: freezeReason(input.reason) }
      : {}),
    ...(input.requestId !== undefined ? { requestId: input.requestId } : {}),
  });
}

export function createRuntimeExecutiveStageSelectionContract(input: {
  readonly subjectId: string;
  readonly selection: RuntimeExecutiveStageSelectionState;
  readonly source: RuntimeExecutiveStageContractSource;
  readonly sceneId?: string;
  readonly sceneRevision?: string;
  readonly reason?: RuntimeExecutiveStageContractReason;
  readonly requestId?: string;
}): RuntimeExecutiveStageSelectionContract {
  if (!isNonEmptyString(input.subjectId)) {
    throw new TypeError("subjectId is required");
  }
  if (!isRuntimeExecutiveStageSelectionState(input.selection)) {
    throw new TypeError("selection must be unselected or selected");
  }

  return Object.freeze({
    contractKind: "selection" as const,
    subjectId: input.subjectId,
    selection: input.selection,
    source: requireSource(input.source),
    ...(input.sceneId !== undefined ? { sceneId: input.sceneId } : {}),
    ...(input.sceneRevision !== undefined
      ? { sceneRevision: input.sceneRevision }
      : {}),
    ...(input.reason !== undefined
      ? { reason: freezeReason(input.reason) }
      : {}),
    ...(input.requestId !== undefined ? { requestId: input.requestId } : {}),
  });
}

export function createRuntimeExecutiveStageFocusContract(input: {
  readonly subjectId: string;
  readonly focusRole: RuntimeExecutiveStageFocusRole;
  readonly source: RuntimeExecutiveStageContractSource;
  readonly relatedPrimaryFocusSubjectId?: string;
  readonly sceneId?: string;
  readonly sceneRevision?: string;
  readonly reason?: RuntimeExecutiveStageContractReason;
  readonly requestId?: string;
}): RuntimeExecutiveStageFocusContract {
  if (!isNonEmptyString(input.subjectId)) {
    throw new TypeError("subjectId is required");
  }
  if (!isRuntimeExecutiveStageFocusRole(input.focusRole)) {
    throw new TypeError("focusRole must be a Foundation focus role");
  }

  return Object.freeze({
    contractKind: "focus" as const,
    subjectId: input.subjectId,
    focusRole: input.focusRole,
    source: requireSource(input.source),
    ...(input.relatedPrimaryFocusSubjectId !== undefined
      ? { relatedPrimaryFocusSubjectId: input.relatedPrimaryFocusSubjectId }
      : {}),
    ...(input.sceneId !== undefined ? { sceneId: input.sceneId } : {}),
    ...(input.sceneRevision !== undefined
      ? { sceneRevision: input.sceneRevision }
      : {}),
    ...(input.reason !== undefined
      ? { reason: freezeReason(input.reason) }
      : {}),
    ...(input.requestId !== undefined ? { requestId: input.requestId } : {}),
  });
}

export function createRuntimeExecutiveStagePresentationContract(input: {
  readonly subjectId: string;
  readonly presentationState: RuntimeExecutiveStagePresentationState;
  readonly source: RuntimeExecutiveStageContractSource;
  readonly sceneId?: string;
  readonly sceneRevision?: string;
  readonly reason?: RuntimeExecutiveStageContractReason;
  readonly requestId?: string;
}): RuntimeExecutiveStagePresentationContract {
  if (!isNonEmptyString(input.subjectId)) {
    throw new TypeError("subjectId is required");
  }
  if (!isRuntimeExecutiveStagePresentationState(input.presentationState)) {
    throw new TypeError("presentationState must be minimum, report, or operation");
  }

  return Object.freeze({
    contractKind: "presentation" as const,
    subjectId: input.subjectId,
    presentationState: input.presentationState,
    source: requireSource(input.source),
    ...(input.sceneId !== undefined ? { sceneId: input.sceneId } : {}),
    ...(input.sceneRevision !== undefined
      ? { sceneRevision: input.sceneRevision }
      : {}),
    ...(input.reason !== undefined
      ? { reason: freezeReason(input.reason) }
      : {}),
    ...(input.requestId !== undefined ? { requestId: input.requestId } : {}),
  });
}

export function createRuntimeExecutiveStageVisibilityContract(input: {
  readonly subjectId: string;
  readonly visibility: RuntimeExecutiveStageVisibility;
  readonly source: RuntimeExecutiveStageContractSource;
  readonly sceneId?: string;
  readonly sceneRevision?: string;
  readonly reason?: RuntimeExecutiveStageContractReason;
  readonly requestId?: string;
}): RuntimeExecutiveStageVisibilityContract {
  if (!isNonEmptyString(input.subjectId)) {
    throw new TypeError("subjectId is required");
  }
  if (!isRuntimeExecutiveStageVisibility(input.visibility)) {
    throw new TypeError("visibility must be visible, hidden, or collapsed");
  }

  return Object.freeze({
    contractKind: "visibility" as const,
    subjectId: input.subjectId,
    visibility: input.visibility,
    source: requireSource(input.source),
    ...(input.sceneId !== undefined ? { sceneId: input.sceneId } : {}),
    ...(input.sceneRevision !== undefined
      ? { sceneRevision: input.sceneRevision }
      : {}),
    ...(input.reason !== undefined
      ? { reason: freezeReason(input.reason) }
      : {}),
    ...(input.requestId !== undefined ? { requestId: input.requestId } : {}),
  });
}

export function createRuntimeExecutiveStageAttentionContract(input: {
  readonly subjectId: string;
  readonly attention: RuntimeExecutiveStageAttentionLevel;
  readonly source: RuntimeExecutiveStageContractSource;
  readonly sceneId?: string;
  readonly sceneRevision?: string;
  readonly persistence?: string;
  readonly scope?: string;
  readonly reason?: RuntimeExecutiveStageContractReason;
  readonly requestId?: string;
}): RuntimeExecutiveStageAttentionContract {
  if (!isNonEmptyString(input.subjectId)) {
    throw new TypeError("subjectId is required");
  }
  if (!isRuntimeExecutiveStageAttentionLevel(input.attention)) {
    throw new TypeError("attention must be a Foundation attention level");
  }

  return Object.freeze({
    contractKind: "attention" as const,
    subjectId: input.subjectId,
    attention: input.attention,
    source: requireSource(input.source),
    ...(input.sceneId !== undefined ? { sceneId: input.sceneId } : {}),
    ...(input.sceneRevision !== undefined
      ? { sceneRevision: input.sceneRevision }
      : {}),
    ...(input.persistence !== undefined
      ? { persistence: input.persistence }
      : {}),
    ...(input.scope !== undefined ? { scope: input.scope } : {}),
    ...(input.reason !== undefined
      ? { reason: freezeReason(input.reason) }
      : {}),
    ...(input.requestId !== undefined ? { requestId: input.requestId } : {}),
  });
}

export function createRuntimeExecutiveStageConnectionContract(input: {
  readonly connection: RuntimeExecutiveStageConnection;
  readonly source: RuntimeExecutiveStageContractSource;
  readonly sceneId?: string;
  readonly sceneRevision?: string;
  readonly knownSubjectIds?: ReadonlyArray<string>;
  readonly reason?: RuntimeExecutiveStageContractReason;
  readonly requestId?: string;
}): RuntimeExecutiveStageConnectionContract {
  const connection = input.connection;
  if (!isNonEmptyString(connection.connectionId)) {
    throw new TypeError("connection.connectionId is required");
  }
  if (
    !isNonEmptyString(connection.sourceSubjectId) ||
    !isNonEmptyString(connection.targetSubjectId)
  ) {
    throw new TypeError("connection endpoints are required");
  }
  if (!isRuntimeExecutiveStageConnectionKind(connection.kind)) {
    throw new TypeError("connection.kind must match Foundation connection kinds");
  }
  if (!isRuntimeExecutiveStageConnectionDirection(connection.direction)) {
    throw new TypeError("connection.direction is invalid");
  }
  if (
    !(
      RUNTIME_EXECUTIVE_STAGE_CONNECTION_STATES as readonly string[]
    ).includes(connection.state)
  ) {
    throw new TypeError("connection.state is invalid");
  }
  if (
    input.knownSubjectIds !== undefined &&
    (!input.knownSubjectIds.includes(connection.sourceSubjectId) ||
      !input.knownSubjectIds.includes(connection.targetSubjectId))
  ) {
    throw new TypeError(
      "connection endpoints must reference known Stage subjects when provided",
    );
  }

  return Object.freeze({
    contractKind: "connection" as const,
    connection,
    source: requireSource(input.source),
    ...(input.sceneId !== undefined ? { sceneId: input.sceneId } : {}),
    ...(input.sceneRevision !== undefined
      ? { sceneRevision: input.sceneRevision }
      : {}),
    ...(input.reason !== undefined
      ? { reason: freezeReason(input.reason) }
      : {}),
    ...(input.requestId !== undefined ? { requestId: input.requestId } : {}),
  });
}

export function createRuntimeExecutiveStageSceneChangeContract(input: {
  readonly changeId: string;
  readonly changeKind: RuntimeExecutiveStageSceneChangeKind;
  readonly source: RuntimeExecutiveStageContractSource;
  readonly subjectId?: string;
  readonly connectionId?: string;
  readonly sceneId?: string;
  readonly sceneRevision?: string;
  readonly reason?: RuntimeExecutiveStageContractReason;
  readonly requestId?: string;
  readonly detail?: string;
}): RuntimeExecutiveStageSceneChangeContract {
  if (!isNonEmptyString(input.changeId)) {
    throw new TypeError("changeId is required");
  }
  if (!isRuntimeExecutiveStageSceneChangeKind(input.changeKind)) {
    throw new TypeError("changeKind is invalid");
  }

  return Object.freeze({
    contractKind: "scene-change" as const,
    changeId: input.changeId,
    changeKind: input.changeKind,
    source: requireSource(input.source),
    ...(input.subjectId !== undefined ? { subjectId: input.subjectId } : {}),
    ...(input.connectionId !== undefined
      ? { connectionId: input.connectionId }
      : {}),
    ...(input.sceneId !== undefined ? { sceneId: input.sceneId } : {}),
    ...(input.sceneRevision !== undefined
      ? { sceneRevision: input.sceneRevision }
      : {}),
    ...(input.reason !== undefined
      ? { reason: freezeReason(input.reason) }
      : {}),
    ...(input.requestId !== undefined ? { requestId: input.requestId } : {}),
    ...(input.detail !== undefined ? { detail: input.detail } : {}),
  });
}

export function createRuntimeExecutiveStageSceneChangeSet(input: {
  readonly changeSetId: string;
  readonly sourceSceneRevision: string;
  readonly changes: ReadonlyArray<RuntimeExecutiveStageSceneChangeContract>;
  readonly source: RuntimeExecutiveStageContractSource;
  readonly targetSceneRevision?: string;
  readonly sceneId?: string;
  readonly reason?: RuntimeExecutiveStageContractReason;
  readonly requestId?: string;
}): RuntimeExecutiveStageSceneChangeSet {
  if (!isNonEmptyString(input.changeSetId)) {
    throw new TypeError("changeSetId is required");
  }
  if (!isNonEmptyString(input.sourceSceneRevision)) {
    throw new TypeError("sourceSceneRevision must be explicit");
  }
  if (!Array.isArray(input.changes)) {
    throw new TypeError("changes must be an ordered array");
  }

  return Object.freeze({
    contractKind: "scene-change-set" as const,
    changeSetId: input.changeSetId,
    sourceSceneRevision: input.sourceSceneRevision,
    changes: Object.freeze([...input.changes]),
    source: requireSource(input.source),
    ...(input.targetSceneRevision !== undefined
      ? { targetSceneRevision: input.targetSceneRevision }
      : {}),
    ...(input.sceneId !== undefined ? { sceneId: input.sceneId } : {}),
    ...(input.reason !== undefined
      ? { reason: freezeReason(input.reason) }
      : {}),
    ...(input.requestId !== undefined ? { requestId: input.requestId } : {}),
  });
}

export function createRuntimeExecutiveStageContextContract(input: {
  readonly context: RuntimeExecutiveStageContext;
  readonly source: RuntimeExecutiveStageContractSource;
  readonly sceneId?: string;
  readonly sceneRevision?: string;
  readonly reason?: RuntimeExecutiveStageContractReason;
  readonly requestId?: string;
}): RuntimeExecutiveStageContextContract {
  if (!isNonEmptyString(input.context.contextId)) {
    throw new TypeError("context.contextId is required");
  }
  if (
    input.context.presentationState !== undefined &&
    !isRuntimeExecutiveStagePresentationState(input.context.presentationState)
  ) {
    throw new TypeError("context.presentationState is invalid");
  }

  return Object.freeze({
    contractKind: "context" as const,
    context: input.context,
    source: requireSource(input.source),
    ...(input.sceneId !== undefined ? { sceneId: input.sceneId } : {}),
    ...(input.sceneRevision !== undefined
      ? { sceneRevision: input.sceneRevision }
      : {}),
    ...(input.reason !== undefined
      ? { reason: freezeReason(input.reason) }
      : {}),
    ...(input.requestId !== undefined ? { requestId: input.requestId } : {}),
  });
}

export function createRuntimeExecutiveStageSnapshotContract(input: {
  readonly snapshot: RuntimeExecutiveStageSnapshot;
  readonly source: RuntimeExecutiveStageContractSource;
  readonly reason?: RuntimeExecutiveStageContractReason;
  readonly requestId?: string;
}): RuntimeExecutiveStageSnapshotContract {
  if (!isNonEmptyString(input.snapshot.snapshotId)) {
    throw new TypeError("snapshot.snapshotId is required");
  }
  if (!validateRuntimeExecutiveStageScene(input.snapshot.scene)) {
    throw new TypeError("snapshot.scene is structurally invalid");
  }
  if (!isNonEmptyString(input.snapshot.observedRevision)) {
    throw new TypeError("snapshot.observedRevision must be explicit");
  }

  return Object.freeze({
    contractKind: "snapshot" as const,
    snapshot: input.snapshot,
    source: requireSource(input.source),
    ...(input.reason !== undefined
      ? { reason: freezeReason(input.reason) }
      : {}),
    ...(input.requestId !== undefined ? { requestId: input.requestId } : {}),
  });
}

export function createRuntimeExecutiveStageInspectionContract(input: {
  readonly inspectionKind: RuntimeExecutiveStageInspectionKind;
  readonly source: RuntimeExecutiveStageContractSource;
  readonly subjectId?: string;
  readonly sceneId?: string;
  readonly sceneRevision?: string;
  readonly reason?: RuntimeExecutiveStageContractReason;
  readonly requestId?: string;
}): RuntimeExecutiveStageInspectionContract {
  if (!isRuntimeExecutiveStageInspectionKind(input.inspectionKind)) {
    throw new TypeError("inspectionKind is invalid");
  }

  return Object.freeze({
    contractKind: "inspection" as const,
    inspectionKind: input.inspectionKind,
    source: requireSource(input.source),
    ...(input.subjectId !== undefined ? { subjectId: input.subjectId } : {}),
    ...(input.sceneId !== undefined ? { sceneId: input.sceneId } : {}),
    ...(input.sceneRevision !== undefined
      ? { sceneRevision: input.sceneRevision }
      : {}),
    ...(input.reason !== undefined
      ? { reason: freezeReason(input.reason) }
      : {}),
    ...(input.requestId !== undefined ? { requestId: input.requestId } : {}),
  });
}

// ─── Inspection / structural helpers ────────────────────────────────────────

export function getRuntimeExecutiveStageContractKind(
  contract: RuntimeExecutiveStageExperienceContract,
): RuntimeExecutiveStageContractKind {
  return contract.contractKind;
}

export function getRuntimeExecutiveStageContractSource(
  contract: RuntimeExecutiveStageExperienceContract,
): RuntimeExecutiveStageContractSource {
  return contract.source;
}

export function runtimeExecutiveStageContractTargetsSubject(
  contract: RuntimeExecutiveStageExperienceContract,
  subjectId: string,
): boolean {
  switch (contract.contractKind) {
    case "subject":
      return contract.subject.subjectId === subjectId;
    case "selection":
    case "focus":
    case "presentation":
    case "visibility":
    case "attention":
    case "inspection":
    case "scene-change":
      return contract.subjectId === subjectId;
    case "connection":
      return (
        contract.connection.sourceSubjectId === subjectId ||
        contract.connection.targetSubjectId === subjectId
      );
    case "scene-change-set":
      return contract.changes.some(
        (change) => change.subjectId === subjectId,
      );
    default:
      return false;
  }
}

export function getRuntimeExecutiveStageSceneChangeSetOrderedChanges(
  changeSet: RuntimeExecutiveStageSceneChangeSet,
): ReadonlyArray<RuntimeExecutiveStageSceneChangeContract> {
  return changeSet.changes;
}

/**
 * Lightweight structural verification only — not a full Stage validation engine.
 */
export function verifyRuntimeExecutiveStageContractStructure(
  contract: RuntimeExecutiveStageExperienceContract,
): RuntimeExecutiveStageContractResult {
  if (!isPlainObject(contract) || !("contractKind" in contract)) {
    return createRuntimeExecutiveStageContractResult({
      status: "invalid",
      contractKind: "inspection",
      code: "missing-contract-kind",
      detail: "contractKind is required",
    });
  }
  if (!isRuntimeExecutiveStageContractKind(contract.contractKind)) {
    return createRuntimeExecutiveStageContractResult({
      status: "invalid",
      contractKind: "inspection",
      code: "invalid-contract-kind",
    });
  }
  if (!isRuntimeExecutiveStageContractSource(contract.source)) {
    return createRuntimeExecutiveStageContractResult({
      status: "invalid",
      contractKind: contract.contractKind,
      code: "invalid-source",
    });
  }

  if (contract.contractKind === "scene-change-set") {
    if (!isNonEmptyString(contract.sourceSceneRevision)) {
      return createRuntimeExecutiveStageContractResult({
        status: "invalid",
        contractKind: "scene-change-set",
        code: "missing-source-revision",
      });
    }
    if (!Array.isArray(contract.changes)) {
      return createRuntimeExecutiveStageContractResult({
        status: "invalid",
        contractKind: "scene-change-set",
        code: "invalid-changes",
      });
    }
  }

  if (contract.contractKind === "connection") {
    if (
      !isNonEmptyString(contract.connection.sourceSubjectId) ||
      !isNonEmptyString(contract.connection.targetSubjectId)
    ) {
      return createRuntimeExecutiveStageContractResult({
        status: "invalid",
        contractKind: "connection",
        code: "invalid-endpoints",
      });
    }
  }

  return createRuntimeExecutiveStageContractResult({
    status: "accepted",
    contractKind: contract.contractKind,
    code: "structurally-valid",
  });
}

export function getRuntimeExecutiveStageExperienceContractsIdentity():
  typeof runtimeExecutiveStageExperienceContractsCanonicalIdentity {
  return runtimeExecutiveStageExperienceContractsCanonicalIdentity;
}

// ─── Registry / module ──────────────────────────────────────────────────────

export const runtimeExecutiveStageExperienceContractsApiNames = Object.freeze([
  "createRuntimeExecutiveStageContractReason",
  "createRuntimeExecutiveStageContractRequest",
  "createRuntimeExecutiveStageContractResult",
  "createRuntimeExecutiveStageSubjectContract",
  "createRuntimeExecutiveStageSceneContract",
  "createRuntimeExecutiveStageSelectionContract",
  "createRuntimeExecutiveStageFocusContract",
  "createRuntimeExecutiveStagePresentationContract",
  "createRuntimeExecutiveStageVisibilityContract",
  "createRuntimeExecutiveStageAttentionContract",
  "createRuntimeExecutiveStageConnectionContract",
  "createRuntimeExecutiveStageSceneChangeContract",
  "createRuntimeExecutiveStageSceneChangeSet",
  "createRuntimeExecutiveStageContextContract",
  "createRuntimeExecutiveStageSnapshotContract",
  "createRuntimeExecutiveStageInspectionContract",
  "getRuntimeExecutiveStageContractKind",
  "getRuntimeExecutiveStageContractSource",
  "runtimeExecutiveStageContractTargetsSubject",
  "getRuntimeExecutiveStageSceneChangeSetOrderedChanges",
  "verifyRuntimeExecutiveStageContractStructure",
  "isRuntimeExecutiveStageContractFamily",
  "isRuntimeExecutiveStageContractKind",
  "isRuntimeExecutiveStageContractSource",
  "isRuntimeExecutiveStageContractResultStatus",
  "isRuntimeExecutiveStageSceneChangeKind",
  "isRuntimeExecutiveStageInspectionKind",
  "verifyRuntimeExecutiveStageExperienceContracts",
  "getRuntimeExecutiveStageExperienceContractsIdentity",
] as const);

export const RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CONTRACTS_REGISTRY =
  Object.freeze({
    identity: runtimeExecutiveStageExperienceContractsIdentity,
    version: runtimeExecutiveStageExperienceContractsVersion,
    namespace: runtimeExecutiveStageExperienceContractsNamespace,
    layer: runtimeExecutiveStageExperienceContractsLayer,
    domain: runtimeExecutiveStageExperienceContractsDomain,
    phase: runtimeExecutiveStageExperienceContractsPhase,
    immediateDependency:
      runtimeExecutiveStageExperienceContractsDependencyIdentity,
    dependencyPath: runtimeExecutiveStageExperienceContractsDependencyPath,
    sections: RUNTIME_EXECUTIVE_STAGE_CONTRACTS_REGISTRY_SECTIONS,
    sectionCount: RUNTIME_EXECUTIVE_STAGE_CONTRACTS_REGISTRY_SECTIONS.length,
    contractFamilies: RUNTIME_EXECUTIVE_STAGE_CONTRACT_FAMILIES,
    contractFamilyCount: RUNTIME_EXECUTIVE_STAGE_CONTRACT_FAMILIES.length,
    contractKinds: RUNTIME_EXECUTIVE_STAGE_CONTRACT_KINDS,
    contractKindCount: RUNTIME_EXECUTIVE_STAGE_CONTRACT_KINDS.length,
    publicTypeNames: RUNTIME_EXECUTIVE_STAGE_CONTRACTS_PUBLIC_TYPE_NAMES,
    publicTypeCount: RUNTIME_EXECUTIVE_STAGE_CONTRACTS_PUBLIC_TYPE_NAMES.length,
    publicApis: runtimeExecutiveStageExperienceContractsApiNames,
    publicApiCount: runtimeExecutiveStageExperienceContractsApiNames.length,
    invariants: RUNTIME_EXECUTIVE_STAGE_CONTRACTS_INVARIANTS,
    invariantCount: RUNTIME_EXECUTIVE_STAGE_CONTRACTS_INVARIANTS.length,
    sceneChangeKinds: RUNTIME_EXECUTIVE_STAGE_SCENE_CHANGE_KINDS,
    sceneChangeKindCount: RUNTIME_EXECUTIVE_STAGE_SCENE_CHANGE_KINDS.length,
    sourceKinds: RUNTIME_EXECUTIVE_STAGE_CONTRACT_SOURCES,
    sourceKindCount: RUNTIME_EXECUTIVE_STAGE_CONTRACT_SOURCES.length,
    resultStatuses: RUNTIME_EXECUTIVE_STAGE_CONTRACT_RESULT_STATUSES,
    resultStatusCount: RUNTIME_EXECUTIVE_STAGE_CONTRACT_RESULT_STATUSES.length,
    inspectionKinds: RUNTIME_EXECUTIVE_STAGE_INSPECTION_KINDS,
    inspectionKindCount: RUNTIME_EXECUTIVE_STAGE_INSPECTION_KINDS.length,
  });

export const runtimeExecutiveStageExperienceContracts = Object.freeze({
  phase: "Contracts" as const,
  name: "RuntimeExecutiveStageExperienceContracts" as const,
  identity: runtimeExecutiveStageExperienceContractsIdentity,
  version: runtimeExecutiveStageExperienceContractsVersion,
  namespace: runtimeExecutiveStageExperienceContractsNamespace,
  layer: runtimeExecutiveStageExperienceContractsLayer,
  domain: runtimeExecutiveStageExperienceContractsDomain,
  architecturalRole:
    runtimeExecutiveStageExperienceContractsArchitecturalRole,
  role: "Contracts" as const,
  status: runtimeExecutiveStageExperienceContractsStability,
  upstreamDependency:
    runtimeExecutiveStageExperienceContractsDependencyIdentity,
  dependencyPath: runtimeExecutiveStageExperienceContractsDependencyPath,
  deterministic: runtimeExecutiveStageExperienceContractsDeterministic,
  immutable: true as const,
  sideEffectFree: true as const,
  frameworkIndependent: true as const,
  rendererIndependent: true as const,
  browserIndependent: true as const,
  principle: RUNTIME_EXECUTIVE_STAGE_CONTRACTS_PRINCIPLE,
  boundary: RUNTIME_EXECUTIVE_STAGE_CONTRACTS_BOUNDARY,
  contractFamilies: RUNTIME_EXECUTIVE_STAGE_CONTRACT_FAMILIES,
  contractKinds: RUNTIME_EXECUTIVE_STAGE_CONTRACT_KINDS,
  sceneChangeKinds: RUNTIME_EXECUTIVE_STAGE_SCENE_CHANGE_KINDS,
  sources: RUNTIME_EXECUTIVE_STAGE_CONTRACT_SOURCES,
  resultStatuses: RUNTIME_EXECUTIVE_STAGE_CONTRACT_RESULT_STATUSES,
  invariants: RUNTIME_EXECUTIVE_STAGE_CONTRACTS_INVARIANTS,
  forbiddenResponsibilities:
    RUNTIME_EXECUTIVE_STAGE_CONTRACTS_FORBIDDEN_RESPONSIBILITIES,
  publicTypeNames: RUNTIME_EXECUTIVE_STAGE_CONTRACTS_PUBLIC_TYPE_NAMES,
  publicApiSurface: runtimeExecutiveStageExperienceContractsApiNames,
  registry: RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CONTRACTS_REGISTRY,
  foundationBoundary: "REX-2:1-foundation-only" as const,
  architecturalStatus:
    "REX-2:2 Runtime Executive Stage Experience Contracts Complete — Ready for REX-2:3 Runtime Executive Stage Model" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface RuntimeExecutiveStageExperienceContractsVerification {
  readonly ok: boolean;
  readonly identity: typeof runtimeExecutiveStageExperienceContractsIdentity;
  readonly version: typeof runtimeExecutiveStageExperienceContractsVersion;
  readonly namespace: typeof runtimeExecutiveStageExperienceContractsNamespace;
  readonly dependencyIdentity: typeof runtimeExecutiveStageExperienceContractsDependencyIdentity;
  readonly contractFamilyCount: number;
  readonly contractKindCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly invariantCount: number;
  readonly sceneChangeKindCount: number;
  readonly frozen: boolean;
  readonly foundationBoundaryIntact: boolean;
  readonly reusesFoundationVocabularies: boolean;
  readonly rendererIndependent: boolean;
  readonly declarativeOnly: boolean;
}

export function verifyRuntimeExecutiveStageExperienceContracts():
  RuntimeExecutiveStageExperienceContractsVerification {
  const module = runtimeExecutiveStageExperienceContracts;
  const registry = RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CONTRACTS_REGISTRY;

  const identityOk =
    module.identity === "REX-2:2/RuntimeExecutiveStageExperienceContracts" &&
    module.version === "2.2.0" &&
    module.namespace === "nexora.rex.stage.contracts" &&
    module.layer === "RuntimeExecutiveExperience" &&
    module.domain === "ExecutiveStage" &&
    module.phase === "Contracts" &&
    module.upstreamDependency ===
      "REX-2:1/RuntimeExecutiveStageExperienceFoundation" &&
    module.upstreamDependency ===
      runtimeExecutiveStageExperienceFoundationIdentity &&
    module.dependencyPath ===
      "@/app/lib/rex/runtimeExecutiveStageExperienceFoundation" &&
    module.foundationBoundary === "REX-2:1-foundation-only";

  const familiesOk = exactOrder(
    [...RUNTIME_EXECUTIVE_STAGE_CONTRACT_FAMILIES],
    [
      "StageSubject",
      "StageScene",
      "Selection",
      "Focus",
      "Presentation",
      "Visibility",
      "Attention",
      "Connection",
      "SceneChange",
      "StageContext",
      "StageSnapshot",
      "StageInspection",
    ],
  );

  const reusesFoundationVocabularies =
    RUNTIME_EXECUTIVE_STAGE_CONTRACT_PRESENTATION_STATES ===
      RUNTIME_EXECUTIVE_STAGE_PRESENTATION_STATES &&
    RUNTIME_EXECUTIVE_STAGE_CONTRACT_CONNECTION_KINDS ===
      RUNTIME_EXECUTIVE_STAGE_CONNECTION_KINDS &&
    RUNTIME_EXECUTIVE_STAGE_CONTRACT_FOCUS_ROLES ===
      RUNTIME_EXECUTIVE_STAGE_FOCUS_ROLES &&
    RUNTIME_EXECUTIVE_STAGE_CONTRACT_VISIBILITY_STATES ===
      RUNTIME_EXECUTIVE_STAGE_VISIBILITY_STATES &&
    RUNTIME_EXECUTIVE_STAGE_CONTRACT_ATTENTION_LEVELS ===
      RUNTIME_EXECUTIVE_STAGE_ATTENTION_LEVELS;

  const invariantsOk =
    RUNTIME_EXECUTIVE_STAGE_CONTRACTS_INVARIANTS.length === 28 &&
    RUNTIME_EXECUTIVE_STAGE_CONTRACTS_INVARIANTS.every(
      (entry, index) => entry.order === index + 1,
    ) &&
    unique(
      RUNTIME_EXECUTIVE_STAGE_CONTRACTS_INVARIANTS.map((entry) => entry.id),
    );

  const frozen =
    Object.isFrozen(module) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(runtimeExecutiveStageExperienceContractsCanonicalIdentity) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_CONTRACT_FAMILIES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_CONTRACT_KINDS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_SCENE_CHANGE_KINDS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_CONTRACT_SOURCES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_CONTRACT_RESULT_STATUSES) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_CONTRACTS_INVARIANTS) &&
    Object.isFrozen(RUNTIME_EXECUTIVE_STAGE_CONTRACTS_BOUNDARY);

  const foundationBoundaryIntact =
    module.boundary.soleImmediateDependency ===
      "REX-2:1/RuntimeExecutiveStageExperienceFoundation" &&
    module.boundary.consumesFoundationOnly === true &&
    module.boundary.importsRex1Directly === false &&
    module.boundary.importsExDriDirectly === false &&
    module.boundary.importsDriDirectly === false &&
    module.boundary.importsNolDirectly === false;

  const declarativeOnly =
    module.boundary.mutatesStageState === false &&
    module.boundary.executesSceneChanges === false &&
    module.boundary.resolvesFocus === false &&
    module.boundary.resolvesPresentation === false &&
    module.boundary.calculatesAttention === false &&
    module.boundary.introducesOrchestration === false &&
    !runtimeExecutiveStageExperienceContractsApiNames.some((name) =>
      /^(execute|apply|resolve|orchestrate|transition|render|animate)/i.test(
        name,
      ),
    );

  const countsOk =
    registry.contractFamilyCount ===
      RUNTIME_EXECUTIVE_STAGE_CONTRACT_FAMILIES.length &&
    registry.contractKindCount ===
      RUNTIME_EXECUTIVE_STAGE_CONTRACT_KINDS.length &&
    registry.publicTypeCount ===
      RUNTIME_EXECUTIVE_STAGE_CONTRACTS_PUBLIC_TYPE_NAMES.length &&
    registry.publicApiCount ===
      runtimeExecutiveStageExperienceContractsApiNames.length &&
    registry.invariantCount ===
      RUNTIME_EXECUTIVE_STAGE_CONTRACTS_INVARIANTS.length &&
    registry.sceneChangeKindCount ===
      RUNTIME_EXECUTIVE_STAGE_SCENE_CHANGE_KINDS.length;

  const ok =
    identityOk &&
    familiesOk &&
    reusesFoundationVocabularies &&
    invariantsOk &&
    frozen &&
    foundationBoundaryIntact &&
    declarativeOnly &&
    countsOk &&
    module.rendererIndependent === true &&
    module.principle === RUNTIME_EXECUTIVE_STAGE_CONTRACTS_PRINCIPLE;

  return Object.freeze({
    ok,
    identity: runtimeExecutiveStageExperienceContractsIdentity,
    version: runtimeExecutiveStageExperienceContractsVersion,
    namespace: runtimeExecutiveStageExperienceContractsNamespace,
    dependencyIdentity:
      runtimeExecutiveStageExperienceContractsDependencyIdentity,
    contractFamilyCount: RUNTIME_EXECUTIVE_STAGE_CONTRACT_FAMILIES.length,
    contractKindCount: RUNTIME_EXECUTIVE_STAGE_CONTRACT_KINDS.length,
    publicTypeCount: RUNTIME_EXECUTIVE_STAGE_CONTRACTS_PUBLIC_TYPE_NAMES.length,
    publicApiCount: runtimeExecutiveStageExperienceContractsApiNames.length,
    invariantCount: RUNTIME_EXECUTIVE_STAGE_CONTRACTS_INVARIANTS.length,
    sceneChangeKindCount: RUNTIME_EXECUTIVE_STAGE_SCENE_CHANGE_KINDS.length,
    frozen,
    foundationBoundaryIntact,
    reusesFoundationVocabularies,
    rendererIndependent: module.rendererIndependent === true,
    declarativeOnly,
  });
}
