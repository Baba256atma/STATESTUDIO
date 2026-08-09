/**
 * EX-DRI-5 — Executive Experience ↔ Director Runtime Scene & Presentation Binding.
 *
 * Pure DRI → EX visual-state binding layer that converts Director Runtime
 * scene / focus / attention / presentation directions into renderer-independent
 * Executive Experience projections.
 *
 * DRI decides the executive visual meaning.
 * EX-DRI-5 translates that meaning into semantic projection.
 * EX renderer decides how the projection looks.
 *
 * No React / Three.js / camera / animation / color policy.
 */

import {
  EXECUTIVE_INTERACTION_BINDING_ATTENTION_LEVELS,
  EXECUTIVE_INTERACTION_BINDING_FOCUS_ROLES,
  EXECUTIVE_INTERACTION_BINDING_PRESENTATION_STATES,
  EXECUTIVE_INTERACTION_BINDING_SURFACES,
  bindExecutiveExperienceCompositeState,
  bindExecutiveExperienceStateToDirectorRuntimeContext,
  bindExecutiveInteractionToDirectorRuntimeRequest,
  createExecutiveDirectorRuntimeCorrelation,
  createExecutiveDirectorRuntimeContextContract,
  createExecutiveDirectorRuntimeRequest,
  createExecutiveDirectorRuntimeResponse,
  createExecutiveDirectorRuntimeSubjectContract,
  createExecutiveRuntimeDirectionContract,
  executiveExperienceDirectorRuntimeInteractionBindingIdentity,
  isExecutiveAttentionDirectionContract,
  isExecutiveCoordinationDirectionContract,
  isExecutiveDirectorRuntimeContextContract,
  isExecutiveDirectorRuntimeCorrelation,
  isExecutiveDirectorRuntimeRequestContract,
  isExecutiveDirectorRuntimeResponseContract,
  isExecutiveDirectorRuntimeSubjectContract,
  isExecutiveExperienceCompositeStateSnapshot,
  isExecutiveFocusDirectionContract,
  isExecutiveGuidanceDirectionContract,
  isExecutiveInteractionBindingInput,
  isExecutivePresentationDirectionContract,
  isExecutiveRuntimeDirectionContract,
  isExecutiveSceneDirectionContract,
  normalizeExecutiveExperienceCompositeState,
  type ExecutiveAttentionDirectionLevel,
  type ExecutiveCoordinationDirectionContract,
  type ExecutiveDirectorRuntimeContextContract,
  type ExecutiveDirectorRuntimeCorrelation,
  type ExecutiveDirectorRuntimeInteractionContract,
  type ExecutiveDirectorRuntimeRequestContract,
  type ExecutiveDirectorRuntimeResponseContract,
  type ExecutiveDirectorRuntimeResponseStatus,
  type ExecutiveDirectorRuntimeSubjectContract,
  type ExecutiveExperienceCompositeStateSnapshot,
  type ExecutiveExperienceContextBindingResult,
  type ExecutiveExperienceSurface,
  type ExecutiveFocusDirectionRole,
  type ExecutiveGuidanceDirectionContract,
  type ExecutiveInteractionBindingInput,
  type ExecutiveInteractionBindingResult,
  type ExecutiveInteractionKind,
  type ExecutivePresentationState,
  type ExecutiveRuntimeDirectionContract,
} from "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeInteractionBinding";

/**
 * Additive re-export surface for EX-DRI-6 Advisor & Insight Binding /
 * EX-DRI-7 Integration Platform (via EX-DRI-6).
 * Preserves EX-DRI-5 as the sole immediate dependency boundary.
 */
export type {
  ExecutiveCoordinationDirectionContract,
  ExecutiveDirectorRuntimeContextContract,
  ExecutiveDirectorRuntimeCorrelation,
  ExecutiveDirectorRuntimeInteractionContract,
  ExecutiveDirectorRuntimeRequestContract,
  ExecutiveDirectorRuntimeResponseContract,
  ExecutiveDirectorRuntimeResponseStatus,
  ExecutiveDirectorRuntimeSubjectContract,
  ExecutiveExperienceCompositeStateSnapshot,
  ExecutiveExperienceContextBindingResult,
  ExecutiveGuidanceDirectionContract,
  ExecutiveInteractionBindingInput,
  ExecutiveInteractionBindingResult,
  ExecutiveInteractionKind,
  ExecutiveRuntimeDirectionContract,
};

export {
  bindExecutiveExperienceCompositeState,
  bindExecutiveExperienceStateToDirectorRuntimeContext,
  bindExecutiveInteractionToDirectorRuntimeRequest,
  createExecutiveDirectorRuntimeCorrelation,
  createExecutiveDirectorRuntimeContextContract,
  createExecutiveDirectorRuntimeRequest,
  createExecutiveDirectorRuntimeResponse,
  createExecutiveDirectorRuntimeSubjectContract,
  createExecutiveRuntimeDirectionContract,
  isExecutiveCoordinationDirectionContract,
  isExecutiveDirectorRuntimeContextContract,
  isExecutiveDirectorRuntimeCorrelation,
  isExecutiveDirectorRuntimeRequestContract,
  isExecutiveDirectorRuntimeResponseContract,
  isExecutiveDirectorRuntimeSubjectContract,
  isExecutiveExperienceCompositeStateSnapshot,
  isExecutiveGuidanceDirectionContract,
  isExecutiveInteractionBindingInput,
  isExecutiveRuntimeDirectionContract,
  normalizeExecutiveExperienceCompositeState,
};

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveExperienceDirectorRuntimeScenePresentationBindingIdentity =
  "EX-DRI-5/ExecutiveExperienceDirectorRuntimeScenePresentationBinding" as const;

export const executiveExperienceDirectorRuntimeScenePresentationBindingVersion =
  "1.5.0" as const;

export const executiveExperienceDirectorRuntimeScenePresentationBindingNamespace =
  "nexora.ex.dri.integration.scene-presentation-binding" as const;

export const executiveExperienceDirectorRuntimeScenePresentationBindingArchitecturalRole =
  "ExecutiveExperienceDirectorRuntimeScenePresentationBinding" as const;

export const executiveExperienceDirectorRuntimeScenePresentationBindingDependencyIdentity =
  executiveExperienceDirectorRuntimeInteractionBindingIdentity;

export const executiveExperienceDirectorRuntimeScenePresentationBindingDependencyPath =
  "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeInteractionBinding" as const;

export const executiveExperienceDirectorRuntimeScenePresentationBindingDirection =
  "dri-direction-to-ex-scene-presentation-projection" as const;

export const executiveExperienceDirectorRuntimeScenePresentationBindingDeterministic =
  true as const;

export const executiveExperienceDirectorRuntimeScenePresentationBindingStateless =
  true as const;

export const executiveExperienceDirectorRuntimeScenePresentationBindingRendererIndependent =
  true as const;

export const executiveExperienceDirectorRuntimeScenePresentationBindingMutationPolicy =
  "immutable" as const;

export const executiveExperienceDirectorRuntimeScenePresentationBindingSideEffectPolicy =
  "side-effect-free" as const;

export const executiveExperienceDirectorRuntimeScenePresentationBindingCanonicalIdentity =
  Object.freeze({
    identity:
      executiveExperienceDirectorRuntimeScenePresentationBindingIdentity,
    version:
      executiveExperienceDirectorRuntimeScenePresentationBindingVersion,
    namespace:
      executiveExperienceDirectorRuntimeScenePresentationBindingNamespace,
    architecturalRole:
      executiveExperienceDirectorRuntimeScenePresentationBindingArchitecturalRole,
    dependencyIdentity:
      executiveExperienceDirectorRuntimeScenePresentationBindingDependencyIdentity,
    bindingDirection:
      executiveExperienceDirectorRuntimeScenePresentationBindingDirection,
    deterministicStatus:
      executiveExperienceDirectorRuntimeScenePresentationBindingDeterministic,
    statelessStatus:
      executiveExperienceDirectorRuntimeScenePresentationBindingStateless,
    rendererIndependenceStatus:
      executiveExperienceDirectorRuntimeScenePresentationBindingRendererIndependent,
    mutationPolicy:
      executiveExperienceDirectorRuntimeScenePresentationBindingMutationPolicy,
    sideEffectPolicy:
      executiveExperienceDirectorRuntimeScenePresentationBindingSideEffectPolicy,
  });

export const EXECUTIVE_SCENE_PRESENTATION_BINDING_PRINCIPLE =
  "DRI decides the meaning and desired executive presentation. EX-DRI-5 translates that runtime direction into a stable Executive Experience projection. The EX renderer decides how to visually realize the projection." as const;

// ─── Vocabulary ─────────────────────────────────────────────────────────────

export const EXECUTIVE_SCENE_PRESENTATION_BINDING_SURFACES =
  EXECUTIVE_INTERACTION_BINDING_SURFACES;

export type { ExecutiveExperienceSurface };

export const EXECUTIVE_SCENE_PRESENTATION_BINDING_PRESENTATION_STATES =
  EXECUTIVE_INTERACTION_BINDING_PRESENTATION_STATES;

export type { ExecutivePresentationState };

export const EXECUTIVE_SCENE_PRESENTATION_BINDING_FOCUS_ROLES =
  EXECUTIVE_INTERACTION_BINDING_FOCUS_ROLES;

export type { ExecutiveFocusDirectionRole };

export const EXECUTIVE_SCENE_PRESENTATION_BINDING_ATTENTION_LEVELS =
  EXECUTIVE_INTERACTION_BINDING_ATTENTION_LEVELS;

export type { ExecutiveAttentionDirectionLevel };

export const EXECUTIVE_SCENE_PRESENTATION_SUPPORTED_DIRECTION_KINDS =
  Object.freeze([
    "scene",
    "focus",
    "attention",
    "presentation",
  ] as const);

export type ExecutiveScenePresentationSupportedDirectionKind =
  (typeof EXECUTIVE_SCENE_PRESENTATION_SUPPORTED_DIRECTION_KINDS)[number];

export const EXECUTIVE_SCENE_PRESENTATION_DEFERRED_DIRECTION_KINDS =
  Object.freeze([
    "guidance",
    "interaction",
    "coordination",
  ] as const);

export type ExecutiveScenePresentationDeferredDirectionKind =
  (typeof EXECUTIVE_SCENE_PRESENTATION_DEFERRED_DIRECTION_KINDS)[number];

export const EXECUTIVE_SCENE_PRESENTATION_DIRECTION_SUPPORT_VALUES =
  Object.freeze([
    "supported",
    "deferred",
    "unsupported",
  ] as const);

export type ExecutiveScenePresentationDirectionSupport =
  (typeof EXECUTIVE_SCENE_PRESENTATION_DIRECTION_SUPPORT_VALUES)[number];

export const EXECUTIVE_SCENE_SUBJECT_ROLES = Object.freeze([
  "primary",
  "related",
  "contextual",
] as const);

export type ExecutiveSceneSubjectRole =
  (typeof EXECUTIVE_SCENE_SUBJECT_ROLES)[number];

export const EXECUTIVE_SCENE_PRESENTATION_BINDING_STATUSES = Object.freeze([
  "bound",
  "partial",
  "rejected",
  "noop",
] as const);

export type ExecutiveScenePresentationBindingStatus =
  (typeof EXECUTIVE_SCENE_PRESENTATION_BINDING_STATUSES)[number];

export const EXECUTIVE_SCENE_PRESENTATION_CHANGE_KINDS = Object.freeze([
  "scene",
  "focus",
  "attention",
  "presentation",
] as const);

export type ExecutiveScenePresentationChangeKind =
  (typeof EXECUTIVE_SCENE_PRESENTATION_CHANGE_KINDS)[number];

export const EXECUTIVE_SCENE_PRESENTATION_BINDING_ISSUE_CODES = Object.freeze([
  "INVALID_RUNTIME_DIRECTION",
  "INVALID_SCENE_DIRECTION",
  "INVALID_FOCUS_DIRECTION",
  "INVALID_ATTENTION_DIRECTION",
  "INVALID_PRESENTATION_DIRECTION",
  "INVALID_SURFACE",
  "INVALID_SUBJECT",
  "SUBJECT_IDENTITY_CONFLICT",
  "DUPLICATE_SCENE_SUBJECT",
  "CONFLICTING_PRIMARY_SUBJECT",
  "CONFLICTING_FOCUS_DIRECTION",
  "CONFLICTING_PRESENTATION_STATE",
  "INVALID_PRESENTATION_STATE",
  "INVALID_RUNTIME_RESPONSE",
  "UNSUPPORTED_DIRECTION",
] as const);

export type ExecutiveScenePresentationBindingIssueCode =
  (typeof EXECUTIVE_SCENE_PRESENTATION_BINDING_ISSUE_CODES)[number];

// ─── Projection contracts ───────────────────────────────────────────────────

export interface ExecutiveSceneSubjectProjection {
  readonly subject: ExecutiveDirectorRuntimeSubjectContract;
  readonly role: ExecutiveSceneSubjectRole;
}

export interface ExecutiveSceneProjection {
  readonly surface: ExecutiveExperienceSurface;
  readonly primarySubject?: ExecutiveDirectorRuntimeSubjectContract;
  readonly relatedSubjects: ReadonlyArray<ExecutiveDirectorRuntimeSubjectContract>;
  readonly subjects: ReadonlyArray<ExecutiveSceneSubjectProjection>;
}

export interface ExecutiveFocusProjection {
  readonly surface: ExecutiveExperienceSurface;
  readonly subject?: ExecutiveDirectorRuntimeSubjectContract;
  readonly role?: ExecutiveFocusDirectionRole;
}

export interface ExecutiveAttentionProjection {
  readonly surface: ExecutiveExperienceSurface;
  readonly subject: ExecutiveDirectorRuntimeSubjectContract;
  readonly level?: ExecutiveAttentionDirectionLevel;
  readonly reason?: string;
}

export interface ExecutivePresentationProjection {
  readonly surface: ExecutiveExperienceSurface;
  readonly subject: ExecutiveDirectorRuntimeSubjectContract;
  readonly state: ExecutivePresentationState;
}

export interface ExecutiveScenePresentationProjection {
  readonly scene?: ExecutiveSceneProjection;
  readonly focus: ReadonlyArray<ExecutiveFocusProjection>;
  readonly attention: ReadonlyArray<ExecutiveAttentionProjection>;
  readonly presentation: ReadonlyArray<ExecutivePresentationProjection>;
}

export interface ExecutiveScenePresentationBindingIssue {
  readonly code: ExecutiveScenePresentationBindingIssueCode;
  readonly path?: string;
  readonly message: string;
}

export interface ExecutiveScenePresentationBindingResult {
  readonly status: ExecutiveScenePresentationBindingStatus;
  readonly projection?: ExecutiveScenePresentationProjection;
  readonly issues: ReadonlyArray<ExecutiveScenePresentationBindingIssue>;
  readonly deferredDirections: ReadonlyArray<ExecutiveRuntimeDirectionContract>;
}

export interface ExecutiveScenePresentationDiff {
  readonly changed: boolean;
  readonly changes: ReadonlyArray<ExecutiveScenePresentationChangeKind>;
}

export interface ExecutivePresentationProjectionMap {
  readonly entries: ReadonlyArray<ExecutivePresentationProjection>;
}

// ─── Guarantees ─────────────────────────────────────────────────────────────

export const EXECUTIVE_SCENE_PRESENTATION_BINDING_GUARANTEES = Object.freeze([
  Object.freeze({ id: "dri-authoritative-scene", order: 1, statement: "DRI remains authoritative for scene direction." }),
  Object.freeze({ id: "dri-authoritative-focus", order: 2, statement: "DRI remains authoritative for focus." }),
  Object.freeze({ id: "dri-authoritative-attention", order: 3, statement: "DRI remains authoritative for attention." }),
  Object.freeze({ id: "dri-authoritative-presentation", order: 4, statement: "DRI remains authoritative for presentation state." }),
  Object.freeze({ id: "ex-dri-5-binding-only", order: 5, statement: "EX-DRI-5 performs binding only." }),
  Object.freeze({ id: "scene-renderer-independent", order: 6, statement: "Scene projection is renderer-independent." }),
  Object.freeze({ id: "focus-renderer-independent", order: 7, statement: "Focus projection is renderer-independent." }),
  Object.freeze({ id: "attention-renderer-independent", order: 8, statement: "Attention projection is renderer-independent." }),
  Object.freeze({ id: "presentation-renderer-independent", order: 9, statement: "Presentation projection is renderer-independent." }),
  Object.freeze({ id: "presentation-states-canonical", order: 10, statement: "Presentation states remain minimum/report/operation." }),
  Object.freeze({ id: "subject-identity-preserved", order: 11, statement: "Subject identity is preserved." }),
  Object.freeze({ id: "selection-focus-distinct", order: 12, statement: "Selection and focus remain distinct." }),
  Object.freeze({ id: "no-camera-behavior", order: 13, statement: "No camera behavior is encoded." }),
  Object.freeze({ id: "no-threejs-objects", order: 14, statement: "No Three.js object crosses the boundary." }),
  Object.freeze({ id: "no-react-objects", order: 15, statement: "No React object crosses the boundary." }),
  Object.freeze({ id: "no-dom-objects", order: 16, statement: "No DOM object crosses the boundary." }),
  Object.freeze({ id: "no-animation-policy", order: 17, statement: "No animation policy is encoded." }),
  Object.freeze({ id: "no-color-policy", order: 18, statement: "No color policy is encoded." }),
  Object.freeze({ id: "no-kpi-calculation", order: 19, statement: "No KPI calculation occurs." }),
  Object.freeze({ id: "no-koi-calculation", order: 20, statement: "No KOI calculation occurs." }),
  Object.freeze({ id: "inputs-never-mutated", order: 21, statement: "Input contracts are never mutated." }),
  Object.freeze({ id: "projection-output-immutable", order: 22, statement: "Projection output is immutable." }),
  Object.freeze({ id: "binding-deterministic", order: 23, statement: "Binding is deterministic." }),
  Object.freeze({ id: "binding-stateless", order: 24, statement: "Binding is stateless." }),
  Object.freeze({ id: "deferred-directions-explicit", order: 25, statement: "Deferred directions are explicit." }),
  Object.freeze({ id: "runtime-response-status-preserved", order: 26, statement: "Runtime response status is preserved." }),
  Object.freeze({ id: "conflicts-explicit", order: 27, statement: "Conflicts are explicit, not silently resolved." }),
  Object.freeze({ id: "multi-surface-supported", order: 28, statement: "Multi-surface semantics are supported." }),
  Object.freeze({ id: "renderer-application-outside", order: 29, statement: "Renderer application occurs outside EX-DRI-5." }),
  Object.freeze({ id: "no-runtime-engine", order: 30, statement: "EX-DRI-5 contains no runtime engine." }),
] as const);

export type ExecutiveScenePresentationBindingGuarantee =
  (typeof EXECUTIVE_SCENE_PRESENTATION_BINDING_GUARANTEES)[number];

// ─── Internal helpers ───────────────────────────────────────────────────────

type PlainObject = Record<string, unknown>;

function isPlainObject(value: unknown): value is PlainObject {
  if (value === null || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function isSurface(value: unknown): value is ExecutiveExperienceSurface {
  return (EXECUTIVE_SCENE_PRESENTATION_BINDING_SURFACES as readonly unknown[]).includes(value);
}

function isPresentationState(value: unknown): value is ExecutivePresentationState {
  return (EXECUTIVE_SCENE_PRESENTATION_BINDING_PRESENTATION_STATES as readonly unknown[]).includes(value);
}

function isFocusRole(value: unknown): value is ExecutiveFocusDirectionRole {
  return (EXECUTIVE_SCENE_PRESENTATION_BINDING_FOCUS_ROLES as readonly unknown[]).includes(value);
}

function isAttentionLevel(value: unknown): value is ExecutiveAttentionDirectionLevel {
  return (EXECUTIVE_SCENE_PRESENTATION_BINDING_ATTENTION_LEVELS as readonly unknown[]).includes(value);
}

function freezeSubject(
  subject: ExecutiveDirectorRuntimeSubjectContract,
): ExecutiveDirectorRuntimeSubjectContract {
  return createExecutiveDirectorRuntimeSubjectContract(subject);
}

function subjectsEqual(
  left: ExecutiveDirectorRuntimeSubjectContract | undefined,
  right: ExecutiveDirectorRuntimeSubjectContract | undefined,
): boolean {
  if (left === undefined && right === undefined) return true;
  if (left === undefined || right === undefined) return false;
  return (
    left.id === right.id &&
    left.kind === right.kind &&
    (left.label ?? undefined) === (right.label ?? undefined)
  );
}

function subjectKey(subject: ExecutiveDirectorRuntimeSubjectContract): string {
  return `${subject.id}::${subject.kind}`;
}

function issue(
  code: ExecutiveScenePresentationBindingIssueCode,
  message: string,
  path?: string,
): ExecutiveScenePresentationBindingIssue {
  return Object.freeze(
    path !== undefined ? { code, message, path } : { code, message },
  );
}

function trackSubjectIdentity(
  registry: Map<string, ExecutiveDirectorRuntimeSubjectContract>,
  subject: ExecutiveDirectorRuntimeSubjectContract | undefined,
  issues: ExecutiveScenePresentationBindingIssue[],
  path: string,
): void {
  if (subject === undefined) return;
  if (!isExecutiveDirectorRuntimeSubjectContract(subject)) {
    issues.push(issue("INVALID_SUBJECT", "subject must be a valid subject contract", path));
    return;
  }
  const existing = registry.get(subject.id);
  if (existing !== undefined && existing.kind !== subject.kind) {
    issues.push(
      issue(
        "SUBJECT_IDENTITY_CONFLICT",
        `subject id ${subject.id} has conflicting kinds ${existing.kind} and ${subject.kind}`,
        path,
      ),
    );
    return;
  }
  if (existing === undefined) {
    registry.set(subject.id, freezeSubject(subject));
  }
}

// ─── Direction support ──────────────────────────────────────────────────────

export function getScenePresentationDirectionSupport(
  kind: unknown,
): ExecutiveScenePresentationDirectionSupport {
  if (
    (EXECUTIVE_SCENE_PRESENTATION_SUPPORTED_DIRECTION_KINDS as readonly unknown[]).includes(
      kind,
    )
  ) {
    return "supported";
  }
  if (
    (EXECUTIVE_SCENE_PRESENTATION_DEFERRED_DIRECTION_KINDS as readonly unknown[]).includes(
      kind,
    )
  ) {
    return "deferred";
  }
  return "unsupported";
}

export function isScenePresentationDirectionSupported(kind: unknown): boolean {
  return getScenePresentationDirectionSupport(kind) === "supported";
}

// ─── Construction helpers ───────────────────────────────────────────────────

export function createExecutiveSceneSubjectProjection(
  input: ExecutiveSceneSubjectProjection,
): ExecutiveSceneSubjectProjection {
  if (!isExecutiveDirectorRuntimeSubjectContract(input.subject)) {
    throw new TypeError("subject must be valid");
  }
  if (!(EXECUTIVE_SCENE_SUBJECT_ROLES as readonly unknown[]).includes(input.role)) {
    throw new TypeError("role must be a canonical scene subject role");
  }
  return Object.freeze({
    subject: freezeSubject(input.subject),
    role: input.role,
  });
}

export function createExecutiveSceneProjection(
  input: Omit<ExecutiveSceneProjection, "subjects"> & {
    readonly subjects?: ReadonlyArray<ExecutiveSceneSubjectProjection>;
  },
): ExecutiveSceneProjection {
  return normalizeExecutiveSceneProjection({
    surface: input.surface,
    ...(input.primarySubject !== undefined
      ? { primarySubject: input.primarySubject }
      : {}),
    relatedSubjects: input.relatedSubjects,
    subjects: input.subjects ?? Object.freeze([]),
  });
}

export function createExecutiveFocusProjection(
  input: ExecutiveFocusProjection,
): ExecutiveFocusProjection {
  if (!isSurface(input.surface)) {
    throw new TypeError("surface must be canonical");
  }
  if (
    input.subject !== undefined &&
    !isExecutiveDirectorRuntimeSubjectContract(input.subject)
  ) {
    throw new TypeError("subject must be valid");
  }
  if (input.role !== undefined && !isFocusRole(input.role)) {
    throw new TypeError("role must be a canonical focus role");
  }
  return Object.freeze({
    surface: input.surface,
    ...(input.subject !== undefined ? { subject: freezeSubject(input.subject) } : {}),
    ...(input.role !== undefined ? { role: input.role } : {}),
  });
}

export function createExecutiveAttentionProjection(
  input: ExecutiveAttentionProjection,
): ExecutiveAttentionProjection {
  if (!isSurface(input.surface)) {
    throw new TypeError("surface must be canonical");
  }
  if (!isExecutiveDirectorRuntimeSubjectContract(input.subject)) {
    throw new TypeError("subject must be valid");
  }
  if (input.level !== undefined && !isAttentionLevel(input.level)) {
    throw new TypeError("level must be a canonical attention level");
  }
  if (input.reason !== undefined && typeof input.reason !== "string") {
    throw new TypeError("reason must be a string");
  }
  return Object.freeze({
    surface: input.surface,
    subject: freezeSubject(input.subject),
    ...(input.level !== undefined ? { level: input.level } : {}),
    ...(input.reason !== undefined ? { reason: input.reason } : {}),
  });
}

export function createExecutivePresentationProjection(
  input: ExecutivePresentationProjection,
): ExecutivePresentationProjection {
  if (!isSurface(input.surface)) {
    throw new TypeError("surface must be canonical");
  }
  if (!isExecutiveDirectorRuntimeSubjectContract(input.subject)) {
    throw new TypeError("subject must be valid");
  }
  if (!isPresentationState(input.state)) {
    throw new TypeError("state must be minimum|report|operation");
  }
  return Object.freeze({
    surface: input.surface,
    subject: freezeSubject(input.subject),
    state: input.state,
  });
}

export function createExecutivePresentationProjectionMap(
  projections: ReadonlyArray<ExecutivePresentationProjection>,
): ExecutivePresentationProjectionMap {
  const seen = new Map<string, ExecutivePresentationState>();
  const entries: ExecutivePresentationProjection[] = [];
  for (const projection of projections) {
    const frozen = createExecutivePresentationProjection(projection);
    const key = frozen.subject.id;
    const existing = seen.get(key);
    if (existing !== undefined && existing !== frozen.state) {
      throw new TypeError("CONFLICTING_PRESENTATION_STATE");
    }
    if (existing === undefined) {
      seen.set(key, frozen.state);
      entries.push(frozen);
    }
  }
  return Object.freeze({ entries: Object.freeze(entries) });
}

// ─── Scene normalization / binding ──────────────────────────────────────────

export function normalizeExecutiveSceneProjection(
  input: ExecutiveSceneProjection,
): ExecutiveSceneProjection {
  if (!isSurface(input.surface)) {
    throw new TypeError("INVALID_SURFACE");
  }
  if (
    input.primarySubject !== undefined &&
    !isExecutiveDirectorRuntimeSubjectContract(input.primarySubject)
  ) {
    throw new TypeError("INVALID_SUBJECT");
  }
  if (!Array.isArray(input.relatedSubjects)) {
    throw new TypeError("INVALID_SCENE_DIRECTION");
  }

  const seen = new Set<string>();
  const related: ExecutiveDirectorRuntimeSubjectContract[] = [];
  for (const subject of input.relatedSubjects) {
    if (!isExecutiveDirectorRuntimeSubjectContract(subject)) {
      throw new TypeError("INVALID_SUBJECT");
    }
    const key = subjectKey(subject);
    if (seen.has(key)) continue;
    if (
      input.primarySubject !== undefined &&
      subject.id === input.primarySubject.id &&
      subject.kind === input.primarySubject.kind
    ) {
      throw new TypeError("DUPLICATE_SCENE_SUBJECT");
    }
    seen.add(key);
    related.push(freezeSubject(subject));
  }

  const primary =
    input.primarySubject !== undefined
      ? freezeSubject(input.primarySubject)
      : undefined;

  const subjects: ExecutiveSceneSubjectProjection[] = [];
  if (primary !== undefined) {
    subjects.push(
      Object.freeze({ subject: primary, role: "primary" as const }),
    );
  }
  for (const subject of related) {
    subjects.push(
      Object.freeze({ subject, role: "related" as const }),
    );
  }

  return Object.freeze({
    surface: input.surface,
    ...(primary !== undefined ? { primarySubject: primary } : {}),
    relatedSubjects: Object.freeze(related),
    subjects: Object.freeze(subjects),
  });
}

export function bindDirectorRuntimeSceneDirection(
  direction: unknown,
): ExecutiveSceneProjection {
  if (!isExecutiveSceneDirectionContract(direction)) {
    throw new TypeError("INVALID_SCENE_DIRECTION");
  }
  return normalizeExecutiveSceneProjection({
    surface: direction.surface,
    ...(direction.primarySubject !== undefined
      ? { primarySubject: direction.primarySubject }
      : {}),
    relatedSubjects: direction.relatedSubjects,
    subjects: Object.freeze([]),
  });
}

export function bindDirectorRuntimeFocusDirection(
  direction: unknown,
): ExecutiveFocusProjection {
  if (!isExecutiveFocusDirectionContract(direction)) {
    throw new TypeError("INVALID_FOCUS_DIRECTION");
  }
  return createExecutiveFocusProjection({
    surface: direction.surface,
    ...(direction.subject !== undefined ? { subject: direction.subject } : {}),
    ...(direction.role !== undefined ? { role: direction.role } : {}),
  });
}

export function bindDirectorRuntimeAttentionDirection(
  direction: unknown,
): ExecutiveAttentionProjection {
  if (!isExecutiveAttentionDirectionContract(direction)) {
    throw new TypeError("INVALID_ATTENTION_DIRECTION");
  }
  return createExecutiveAttentionProjection({
    surface: direction.surface,
    subject: direction.subject,
    ...(direction.level !== undefined ? { level: direction.level } : {}),
    ...(direction.reason !== undefined ? { reason: direction.reason } : {}),
  });
}

export function bindDirectorRuntimePresentationDirection(
  direction: unknown,
): ExecutivePresentationProjection {
  if (!isExecutivePresentationDirectionContract(direction)) {
    throw new TypeError("INVALID_PRESENTATION_DIRECTION");
  }
  return createExecutivePresentationProjection({
    surface: direction.surface,
    subject: direction.subject,
    state: direction.state,
  });
}

// ─── Validators ─────────────────────────────────────────────────────────────

export function isExecutiveSceneSubjectProjection(
  value: unknown,
): value is ExecutiveSceneSubjectProjection {
  return (
    isPlainObject(value) &&
    isExecutiveDirectorRuntimeSubjectContract(value.subject) &&
    (EXECUTIVE_SCENE_SUBJECT_ROLES as readonly unknown[]).includes(value.role)
  );
}

export function isExecutiveSceneProjection(
  value: unknown,
): value is ExecutiveSceneProjection {
  if (!isPlainObject(value)) return false;
  if (!isSurface(value.surface)) return false;
  if (
    value.primarySubject !== undefined &&
    !isExecutiveDirectorRuntimeSubjectContract(value.primarySubject)
  ) {
    return false;
  }
  if (!Array.isArray(value.relatedSubjects)) return false;
  if (
    !value.relatedSubjects.every((subject) =>
      isExecutiveDirectorRuntimeSubjectContract(subject),
    )
  ) {
    return false;
  }
  if (!Array.isArray(value.subjects)) return false;
  return value.subjects.every((entry) => isExecutiveSceneSubjectProjection(entry));
}

export function isExecutiveFocusProjection(
  value: unknown,
): value is ExecutiveFocusProjection {
  if (!isPlainObject(value)) return false;
  if (!isSurface(value.surface)) return false;
  if (
    value.subject !== undefined &&
    !isExecutiveDirectorRuntimeSubjectContract(value.subject)
  ) {
    return false;
  }
  if (value.role !== undefined && !isFocusRole(value.role)) return false;
  return true;
}

export function isExecutiveAttentionProjection(
  value: unknown,
): value is ExecutiveAttentionProjection {
  if (!isPlainObject(value)) return false;
  if (!isSurface(value.surface)) return false;
  if (!isExecutiveDirectorRuntimeSubjectContract(value.subject)) return false;
  if (value.level !== undefined && !isAttentionLevel(value.level)) return false;
  if (value.reason !== undefined && typeof value.reason !== "string") return false;
  return true;
}

export function isExecutivePresentationProjection(
  value: unknown,
): value is ExecutivePresentationProjection {
  return (
    isPlainObject(value) &&
    isSurface(value.surface) &&
    isExecutiveDirectorRuntimeSubjectContract(value.subject) &&
    isPresentationState(value.state)
  );
}

export function isExecutiveScenePresentationProjection(
  value: unknown,
): value is ExecutiveScenePresentationProjection {
  if (!isPlainObject(value)) return false;
  if (value.scene !== undefined && !isExecutiveSceneProjection(value.scene)) {
    return false;
  }
  if (!Array.isArray(value.focus)) return false;
  if (!Array.isArray(value.attention)) return false;
  if (!Array.isArray(value.presentation)) return false;
  return (
    value.focus.every((entry) => isExecutiveFocusProjection(entry)) &&
    value.attention.every((entry) => isExecutiveAttentionProjection(entry)) &&
    value.presentation.every((entry) => isExecutivePresentationProjection(entry))
  );
}

export function isExecutiveScenePresentationBindingResult(
  value: unknown,
): value is ExecutiveScenePresentationBindingResult {
  if (!isPlainObject(value)) return false;
  if (
    !(EXECUTIVE_SCENE_PRESENTATION_BINDING_STATUSES as readonly unknown[]).includes(
      value.status,
    )
  ) {
    return false;
  }
  if (!Array.isArray(value.issues)) return false;
  if (!Array.isArray(value.deferredDirections)) return false;
  if (
    value.projection !== undefined &&
    !isExecutiveScenePresentationProjection(value.projection)
  ) {
    return false;
  }
  if (value.status === "noop" || value.status === "rejected") {
    return value.projection === undefined;
  }
  return value.projection !== undefined;
}

// ─── Diff / equality ────────────────────────────────────────────────────────

export function areExecutiveSceneProjectionsEqual(
  left: ExecutiveSceneProjection,
  right: ExecutiveSceneProjection,
): boolean {
  if (!isExecutiveSceneProjection(left) || !isExecutiveSceneProjection(right)) {
    return false;
  }
  if (left.surface !== right.surface) return false;
  if (!subjectsEqual(left.primarySubject, right.primarySubject)) return false;
  if (left.relatedSubjects.length !== right.relatedSubjects.length) return false;
  return left.relatedSubjects.every((subject, index) =>
    subjectsEqual(subject, right.relatedSubjects[index]),
  );
}

export function areExecutivePresentationProjectionsEqual(
  left: ExecutivePresentationProjection,
  right: ExecutivePresentationProjection,
): boolean {
  return (
    left.surface === right.surface &&
    left.state === right.state &&
    subjectsEqual(left.subject, right.subject)
  );
}

export function areExecutiveFocusProjectionsEqual(
  left: ExecutiveFocusProjection,
  right: ExecutiveFocusProjection,
): boolean {
  return (
    left.surface === right.surface &&
    (left.role ?? undefined) === (right.role ?? undefined) &&
    subjectsEqual(left.subject, right.subject)
  );
}

export function areExecutiveAttentionProjectionsEqual(
  left: ExecutiveAttentionProjection,
  right: ExecutiveAttentionProjection,
): boolean {
  return (
    left.surface === right.surface &&
    (left.level ?? undefined) === (right.level ?? undefined) &&
    (left.reason ?? undefined) === (right.reason ?? undefined) &&
    subjectsEqual(left.subject, right.subject)
  );
}

export function areExecutiveScenePresentationProjectionsEqual(
  left: ExecutiveScenePresentationProjection,
  right: ExecutiveScenePresentationProjection,
): boolean {
  if ((left.scene === undefined) !== (right.scene === undefined)) return false;
  if (
    left.scene !== undefined &&
    right.scene !== undefined &&
    !areExecutiveSceneProjectionsEqual(left.scene, right.scene)
  ) {
    return false;
  }
  if (left.focus.length !== right.focus.length) return false;
  if (left.attention.length !== right.attention.length) return false;
  if (left.presentation.length !== right.presentation.length) return false;
  return (
    left.focus.every((entry, index) =>
      areExecutiveFocusProjectionsEqual(entry, right.focus[index]!),
    ) &&
    left.attention.every((entry, index) =>
      areExecutiveAttentionProjectionsEqual(entry, right.attention[index]!),
    ) &&
    left.presentation.every((entry, index) =>
      areExecutivePresentationProjectionsEqual(entry, right.presentation[index]!),
    )
  );
}

export function diffExecutiveSceneProjection(
  previous: ExecutiveSceneProjection,
  next: ExecutiveSceneProjection,
): ExecutiveScenePresentationDiff {
  const changed = !areExecutiveSceneProjectionsEqual(previous, next);
  return Object.freeze({
    changed,
    changes: Object.freeze(changed ? (["scene"] as const) : []),
  });
}

export function diffExecutiveFocusProjections(
  previous: ReadonlyArray<ExecutiveFocusProjection>,
  next: ReadonlyArray<ExecutiveFocusProjection>,
): ExecutiveScenePresentationDiff {
  const equal =
    previous.length === next.length &&
    previous.every((entry, index) =>
      areExecutiveFocusProjectionsEqual(entry, next[index]!),
    );
  return Object.freeze({
    changed: !equal,
    changes: Object.freeze(!equal ? (["focus"] as const) : []),
  });
}

export function diffExecutiveAttentionProjections(
  previous: ReadonlyArray<ExecutiveAttentionProjection>,
  next: ReadonlyArray<ExecutiveAttentionProjection>,
): ExecutiveScenePresentationDiff {
  const equal =
    previous.length === next.length &&
    previous.every((entry, index) =>
      areExecutiveAttentionProjectionsEqual(entry, next[index]!),
    );
  return Object.freeze({
    changed: !equal,
    changes: Object.freeze(!equal ? (["attention"] as const) : []),
  });
}

export function diffExecutivePresentationProjections(
  previous: ReadonlyArray<ExecutivePresentationProjection>,
  next: ReadonlyArray<ExecutivePresentationProjection>,
): ExecutiveScenePresentationDiff {
  const equal =
    previous.length === next.length &&
    previous.every((entry, index) =>
      areExecutivePresentationProjectionsEqual(entry, next[index]!),
    );
  return Object.freeze({
    changed: !equal,
    changes: Object.freeze(!equal ? (["presentation"] as const) : []),
  });
}

export function diffExecutiveScenePresentationProjection(
  previous: ExecutiveScenePresentationProjection,
  next: ExecutiveScenePresentationProjection,
): ExecutiveScenePresentationDiff {
  const changes: ExecutiveScenePresentationChangeKind[] = [];
  const prevScene = previous.scene;
  const nextScene = next.scene;
  if ((prevScene === undefined) !== (nextScene === undefined)) {
    changes.push("scene");
  } else if (
    prevScene !== undefined &&
    nextScene !== undefined &&
    !areExecutiveSceneProjectionsEqual(prevScene, nextScene)
  ) {
    changes.push("scene");
  }
  if (diffExecutiveFocusProjections(previous.focus, next.focus).changed) {
    changes.push("focus");
  }
  if (
    diffExecutiveAttentionProjections(previous.attention, next.attention).changed
  ) {
    changes.push("attention");
  }
  if (
    diffExecutivePresentationProjections(
      previous.presentation,
      next.presentation,
    ).changed
  ) {
    changes.push("presentation");
  }
  const ordered = EXECUTIVE_SCENE_PRESENTATION_CHANGE_KINDS.filter((kind) =>
    changes.includes(kind),
  );
  return Object.freeze({
    changed: ordered.length > 0,
    changes: Object.freeze(ordered),
  });
}

// ─── Composite binding ──────────────────────────────────────────────────────

function emptyProjection(): ExecutiveScenePresentationProjection {
  return Object.freeze({
    focus: Object.freeze([]),
    attention: Object.freeze([]),
    presentation: Object.freeze([]),
  });
}

export function bindDirectorRuntimeDirectionsToExecutiveScenePresentation(
  directions: ReadonlyArray<unknown>,
): ExecutiveScenePresentationBindingResult {
  if (!Array.isArray(directions)) {
    return Object.freeze({
      status: "rejected" as const,
      issues: Object.freeze([
        issue("INVALID_RUNTIME_DIRECTION", "directions must be an array"),
      ]),
      deferredDirections: Object.freeze([]),
    });
  }

  if (directions.length === 0) {
    return Object.freeze({
      status: "noop" as const,
      issues: Object.freeze([]),
      deferredDirections: Object.freeze([]),
    });
  }

  const issues: ExecutiveScenePresentationBindingIssue[] = [];
  const deferred: ExecutiveRuntimeDirectionContract[] = [];
  const identityRegistry = new Map<string, ExecutiveDirectorRuntimeSubjectContract>();

  let scene: ExecutiveSceneProjection | undefined;
  const focus: ExecutiveFocusProjection[] = [];
  const attention: ExecutiveAttentionProjection[] = [];
  const presentation: ExecutivePresentationProjection[] = [];
  const focusBySurface = new Map<string, ExecutiveFocusProjection>();
  const presentationBySubject = new Map<string, ExecutivePresentationProjection>();

  let supportedCount = 0;

  for (let index = 0; index < directions.length; index += 1) {
    const direction = directions[index];
    const path = `directions[${index}]`;

    if (!isExecutiveRuntimeDirectionContract(direction)) {
      issues.push(
        issue("INVALID_RUNTIME_DIRECTION", "direction must be a valid runtime direction", path),
      );
      continue;
    }

    const support = getScenePresentationDirectionSupport(direction.kind);
    if (support === "deferred") {
      deferred.push(direction);
      continue;
    }
    if (support === "unsupported") {
      issues.push(
        issue("UNSUPPORTED_DIRECTION", `direction kind ${direction.kind} is unsupported`, path),
      );
      continue;
    }

    supportedCount += 1;

    switch (direction.kind) {
      case "scene": {
        if (!isExecutiveSceneDirectionContract(direction)) {
          issues.push(issue("INVALID_SCENE_DIRECTION", "invalid scene direction", path));
          break;
        }
        if (scene !== undefined) {
          issues.push(
            issue(
              "CONFLICTING_PRIMARY_SUBJECT",
              "multiple scene directions in one binding cycle",
              path,
            ),
          );
          break;
        }
        try {
          const projected = bindDirectorRuntimeSceneDirection(direction);
          trackSubjectIdentity(
            identityRegistry,
            projected.primarySubject,
            issues,
            `${path}.primarySubject`,
          );
          for (const [relatedIndex, subject] of projected.relatedSubjects.entries()) {
            trackSubjectIdentity(
              identityRegistry,
              subject,
              issues,
              `${path}.relatedSubjects[${relatedIndex}]`,
            );
          }
          scene = projected;
        } catch (error) {
          const code =
            error instanceof TypeError && error.message === "DUPLICATE_SCENE_SUBJECT"
              ? "DUPLICATE_SCENE_SUBJECT"
              : "INVALID_SCENE_DIRECTION";
          issues.push(issue(code, String((error as Error).message), path));
        }
        break;
      }
      case "focus": {
        if (!isExecutiveFocusDirectionContract(direction)) {
          issues.push(issue("INVALID_FOCUS_DIRECTION", "invalid focus direction", path));
          break;
        }
        try {
          const projected = bindDirectorRuntimeFocusDirection(direction);
          trackSubjectIdentity(
            identityRegistry,
            projected.subject,
            issues,
            `${path}.subject`,
          );
          const existing = focusBySurface.get(projected.surface);
          if (existing !== undefined) {
            const same =
              subjectsEqual(existing.subject, projected.subject) &&
              (existing.role ?? undefined) === (projected.role ?? undefined);
            if (!same) {
              issues.push(
                issue(
                  "CONFLICTING_FOCUS_DIRECTION",
                  `conflicting focus directions for surface ${projected.surface}`,
                  path,
                ),
              );
              break;
            }
          } else {
            focusBySurface.set(projected.surface, projected);
            focus.push(projected);
          }
        } catch (error) {
          issues.push(
            issue("INVALID_FOCUS_DIRECTION", String((error as Error).message), path),
          );
        }
        break;
      }
      case "attention": {
        if (!isExecutiveAttentionDirectionContract(direction)) {
          issues.push(
            issue("INVALID_ATTENTION_DIRECTION", "invalid attention direction", path),
          );
          break;
        }
        try {
          const projected = bindDirectorRuntimeAttentionDirection(direction);
          trackSubjectIdentity(
            identityRegistry,
            projected.subject,
            issues,
            `${path}.subject`,
          );
          attention.push(projected);
        } catch (error) {
          issues.push(
            issue(
              "INVALID_ATTENTION_DIRECTION",
              String((error as Error).message),
              path,
            ),
          );
        }
        break;
      }
      case "presentation": {
        if (!isExecutivePresentationDirectionContract(direction)) {
          issues.push(
            issue(
              "INVALID_PRESENTATION_DIRECTION",
              "invalid presentation direction",
              path,
            ),
          );
          break;
        }
        try {
          const projected = bindDirectorRuntimePresentationDirection(direction);
          trackSubjectIdentity(
            identityRegistry,
            projected.subject,
            issues,
            `${path}.subject`,
          );
          const existing = presentationBySubject.get(projected.subject.id);
          if (existing !== undefined && existing.state !== projected.state) {
            issues.push(
              issue(
                "CONFLICTING_PRESENTATION_STATE",
                `conflicting presentation states for subject ${projected.subject.id}`,
                path,
              ),
            );
            break;
          }
          if (existing === undefined) {
            presentationBySubject.set(projected.subject.id, projected);
            presentation.push(projected);
          }
        } catch (error) {
          const code =
            error instanceof TypeError &&
            String(error.message).includes("minimum|report|operation")
              ? "INVALID_PRESENTATION_STATE"
              : "INVALID_PRESENTATION_DIRECTION";
          issues.push(issue(code, String((error as Error).message), path));
        }
        break;
      }
      default:
        issues.push(
          issue("UNSUPPORTED_DIRECTION", "direction kind not handled", path),
        );
    }
  }

  if (issues.length > 0) {
    return Object.freeze({
      status: "rejected" as const,
      issues: Object.freeze(issues),
      deferredDirections: Object.freeze(deferred),
    });
  }

  if (supportedCount === 0 && deferred.length > 0) {
    return Object.freeze({
      status: "partial" as const,
      projection: emptyProjection(),
      issues: Object.freeze([]),
      deferredDirections: Object.freeze(deferred),
    });
  }

  if (supportedCount === 0) {
    return Object.freeze({
      status: "noop" as const,
      issues: Object.freeze([]),
      deferredDirections: Object.freeze(deferred),
    });
  }

  const projection = Object.freeze({
    ...(scene !== undefined ? { scene } : {}),
    focus: Object.freeze(focus),
    attention: Object.freeze(attention),
    presentation: Object.freeze(presentation),
  });

  return Object.freeze({
    status: deferred.length > 0 ? ("partial" as const) : ("bound" as const),
    projection,
    issues: Object.freeze([]),
    deferredDirections: Object.freeze(deferred),
  });
}

export function bindDirectorRuntimeResponseToExecutiveScenePresentation(
  response: unknown,
): ExecutiveScenePresentationBindingResult {
  if (!isExecutiveDirectorRuntimeResponseContract(response)) {
    return Object.freeze({
      status: "rejected" as const,
      issues: Object.freeze([
        issue(
          "INVALID_RUNTIME_RESPONSE",
          "response must be a valid dri-to-ex response contract",
        ),
      ]),
      deferredDirections: Object.freeze([]),
    });
  }

  if (response.direction !== "dri-to-ex") {
    return Object.freeze({
      status: "rejected" as const,
      issues: Object.freeze([
        issue("INVALID_RUNTIME_RESPONSE", "response.direction must be dri-to-ex"),
      ]),
      deferredDirections: Object.freeze([]),
    });
  }

  if (response.status === "rejected") {
    return Object.freeze({
      status: "rejected" as const,
      issues: Object.freeze([
        issue(
          "INVALID_RUNTIME_RESPONSE",
          "upstream runtime response status is rejected",
        ),
      ]),
      deferredDirections: Object.freeze([]),
    });
  }

  if (response.status === "noop") {
    return Object.freeze({
      status: "noop" as const,
      issues: Object.freeze([]),
      deferredDirections: Object.freeze([]),
    });
  }

  const bound = bindDirectorRuntimeDirectionsToExecutiveScenePresentation(
    response.directions,
  );

  if (bound.status === "rejected") {
    return bound;
  }

  if (response.status === "partial") {
    // Preserve upstream partial semantics; never promote to resolved/bound.
    if (bound.status === "noop") {
      return Object.freeze({
        status: "partial" as const,
        projection: emptyProjection(),
        issues: Object.freeze([]),
        deferredDirections: bound.deferredDirections,
      });
    }
    return Object.freeze({
      status: "partial" as const,
      projection: bound.projection,
      issues: bound.issues,
      deferredDirections: bound.deferredDirections,
    });
  }

  return bound;
}

// ─── Catalogs / registry ────────────────────────────────────────────────────

export const EXECUTIVE_SCENE_PRESENTATION_BINDING_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "ExecutiveScenePresentationDirectionSupport",
    "ExecutiveSceneSubjectRole",
    "ExecutiveSceneSubjectProjection",
    "ExecutiveSceneProjection",
    "ExecutiveFocusProjection",
    "ExecutiveAttentionProjection",
    "ExecutivePresentationProjection",
    "ExecutiveScenePresentationProjection",
    "ExecutiveScenePresentationBindingStatus",
    "ExecutiveScenePresentationBindingIssueCode",
    "ExecutiveScenePresentationBindingIssue",
    "ExecutiveScenePresentationBindingResult",
    "ExecutiveScenePresentationChangeKind",
    "ExecutiveScenePresentationDiff",
    "ExecutivePresentationProjectionMap",
    "ExecutiveScenePresentationBindingGuarantee",
    "ExecutiveExperienceDirectorRuntimeScenePresentationBindingVerification",
  ] as const);

export const executiveExperienceDirectorRuntimeScenePresentationBindingValidatorNames =
  Object.freeze([
    "isExecutiveSceneProjection",
    "isExecutiveSceneSubjectProjection",
    "isExecutiveFocusProjection",
    "isExecutiveAttentionProjection",
    "isExecutivePresentationProjection",
    "isExecutiveScenePresentationProjection",
    "isExecutiveScenePresentationBindingResult",
    "isScenePresentationDirectionSupported",
    "getScenePresentationDirectionSupport",
  ] as const);

export const executiveExperienceDirectorRuntimeScenePresentationBindingApiNames =
  Object.freeze([
    "bindDirectorRuntimeSceneDirection",
    "bindDirectorRuntimeFocusDirection",
    "bindDirectorRuntimeAttentionDirection",
    "bindDirectorRuntimePresentationDirection",
    "bindDirectorRuntimeDirectionsToExecutiveScenePresentation",
    "bindDirectorRuntimeResponseToExecutiveScenePresentation",
    "normalizeExecutiveSceneProjection",
    "createExecutiveSceneProjection",
    "createExecutiveSceneSubjectProjection",
    "createExecutiveFocusProjection",
    "createExecutiveAttentionProjection",
    "createExecutivePresentationProjection",
    "createExecutivePresentationProjectionMap",
    "diffExecutiveSceneProjection",
    "diffExecutiveFocusProjections",
    "diffExecutiveAttentionProjections",
    "diffExecutivePresentationProjections",
    "diffExecutiveScenePresentationProjection",
    "areExecutiveSceneProjectionsEqual",
    "areExecutiveFocusProjectionsEqual",
    "areExecutiveAttentionProjectionsEqual",
    "areExecutivePresentationProjectionsEqual",
    "areExecutiveScenePresentationProjectionsEqual",
    ...executiveExperienceDirectorRuntimeScenePresentationBindingValidatorNames,
    "getExecutiveExperienceDirectorRuntimeScenePresentationBindingIdentity",
    "verifyExecutiveExperienceDirectorRuntimeScenePresentationBinding",
  ] as const);

export const EXECUTIVE_SCENE_PRESENTATION_BINDING_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "SupportedDirections",
    "Scene",
    "Focus",
    "Attention",
    "Presentation",
    "CompositeBinding",
    "Diffing",
    "Validation",
    "IssueCodes",
    "Guarantees",
    "Compatibility",
  ] as const);

export function getExecutiveExperienceDirectorRuntimeScenePresentationBindingIdentity():
  typeof executiveExperienceDirectorRuntimeScenePresentationBindingCanonicalIdentity {
  return executiveExperienceDirectorRuntimeScenePresentationBindingCanonicalIdentity;
}

export const executiveExperienceDirectorRuntimeScenePresentationBindingRegistry =
  Object.freeze({
    identity:
      executiveExperienceDirectorRuntimeScenePresentationBindingIdentity,
    version:
      executiveExperienceDirectorRuntimeScenePresentationBindingVersion,
    namespace:
      executiveExperienceDirectorRuntimeScenePresentationBindingNamespace,
    architecturalRole:
      executiveExperienceDirectorRuntimeScenePresentationBindingArchitecturalRole,
    dependencyIdentity:
      executiveExperienceDirectorRuntimeScenePresentationBindingDependencyIdentity,
    dependencyPath:
      executiveExperienceDirectorRuntimeScenePresentationBindingDependencyPath,
    principle: EXECUTIVE_SCENE_PRESENTATION_BINDING_PRINCIPLE,
    supportedDirectionKinds:
      EXECUTIVE_SCENE_PRESENTATION_SUPPORTED_DIRECTION_KINDS,
    supportedDirectionKindCount:
      EXECUTIVE_SCENE_PRESENTATION_SUPPORTED_DIRECTION_KINDS.length,
    deferredDirectionKinds:
      EXECUTIVE_SCENE_PRESENTATION_DEFERRED_DIRECTION_KINDS,
    deferredDirectionKindCount:
      EXECUTIVE_SCENE_PRESENTATION_DEFERRED_DIRECTION_KINDS.length,
    surfaces: EXECUTIVE_SCENE_PRESENTATION_BINDING_SURFACES,
    surfaceCount: EXECUTIVE_SCENE_PRESENTATION_BINDING_SURFACES.length,
    presentationStates:
      EXECUTIVE_SCENE_PRESENTATION_BINDING_PRESENTATION_STATES,
    presentationStateCount:
      EXECUTIVE_SCENE_PRESENTATION_BINDING_PRESENTATION_STATES.length,
    sceneSubjectRoles: EXECUTIVE_SCENE_SUBJECT_ROLES,
    sceneSubjectRoleCount: EXECUTIVE_SCENE_SUBJECT_ROLES.length,
    changeKinds: EXECUTIVE_SCENE_PRESENTATION_CHANGE_KINDS,
    changeKindCount: EXECUTIVE_SCENE_PRESENTATION_CHANGE_KINDS.length,
    statuses: EXECUTIVE_SCENE_PRESENTATION_BINDING_STATUSES,
    statusCount: EXECUTIVE_SCENE_PRESENTATION_BINDING_STATUSES.length,
    issueCodes: EXECUTIVE_SCENE_PRESENTATION_BINDING_ISSUE_CODES,
    issueCodeCount: EXECUTIVE_SCENE_PRESENTATION_BINDING_ISSUE_CODES.length,
    guarantees: EXECUTIVE_SCENE_PRESENTATION_BINDING_GUARANTEES,
    guaranteeCount: EXECUTIVE_SCENE_PRESENTATION_BINDING_GUARANTEES.length,
    validators:
      executiveExperienceDirectorRuntimeScenePresentationBindingValidatorNames,
    validatorCount:
      executiveExperienceDirectorRuntimeScenePresentationBindingValidatorNames
        .length,
    registrySections: EXECUTIVE_SCENE_PRESENTATION_BINDING_REGISTRY_SECTIONS,
    registrySectionCount:
      EXECUTIVE_SCENE_PRESENTATION_BINDING_REGISTRY_SECTIONS.length,
    publicTypes: EXECUTIVE_SCENE_PRESENTATION_BINDING_PUBLIC_TYPE_NAMES,
    publicTypeCount:
      EXECUTIVE_SCENE_PRESENTATION_BINDING_PUBLIC_TYPE_NAMES.length,
    publicApis:
      executiveExperienceDirectorRuntimeScenePresentationBindingApiNames,
    publicApiCount:
      executiveExperienceDirectorRuntimeScenePresentationBindingApiNames.length,
  });

export const executiveExperienceDirectorRuntimeScenePresentationBinding =
  Object.freeze({
    phase: "EX-DRI-5" as const,
    name: "ExecutiveExperienceDirectorRuntimeScenePresentationBinding" as const,
    identity:
      executiveExperienceDirectorRuntimeScenePresentationBindingIdentity,
    version:
      executiveExperienceDirectorRuntimeScenePresentationBindingVersion,
    namespace:
      executiveExperienceDirectorRuntimeScenePresentationBindingNamespace,
    architecturalRole:
      executiveExperienceDirectorRuntimeScenePresentationBindingArchitecturalRole,
    role: "ScenePresentationBinding" as const,
    stage: "ScenePresentationBinding" as const,
    status: "ScenePresentationBindingReady" as const,
    upstreamDependency:
      executiveExperienceDirectorRuntimeScenePresentationBindingDependencyIdentity,
    dependencyPath:
      executiveExperienceDirectorRuntimeScenePresentationBindingDependencyPath,
    bindingDirection:
      executiveExperienceDirectorRuntimeScenePresentationBindingDirection,
    deterministic:
      executiveExperienceDirectorRuntimeScenePresentationBindingDeterministic,
    stateless:
      executiveExperienceDirectorRuntimeScenePresentationBindingStateless,
    rendererIndependent:
      executiveExperienceDirectorRuntimeScenePresentationBindingRendererIndependent,
    immutable: true as const,
    sideEffectFree: true as const,
    frameworkIndependent: true as const,
    threeJsIndependent: true as const,
    reactIndependent: true as const,
    browserIndependent: true as const,
    principle: EXECUTIVE_SCENE_PRESENTATION_BINDING_PRINCIPLE,
    supportedDirectionKinds:
      EXECUTIVE_SCENE_PRESENTATION_SUPPORTED_DIRECTION_KINDS,
    deferredDirectionKinds:
      EXECUTIVE_SCENE_PRESENTATION_DEFERRED_DIRECTION_KINDS,
    presentationStates:
      EXECUTIVE_SCENE_PRESENTATION_BINDING_PRESENTATION_STATES,
    surfaces: EXECUTIVE_SCENE_PRESENTATION_BINDING_SURFACES,
    guarantees: EXECUTIVE_SCENE_PRESENTATION_BINDING_GUARANTEES,
    publicApiSurface:
      executiveExperienceDirectorRuntimeScenePresentationBindingApiNames,
    publicTypes: EXECUTIVE_SCENE_PRESENTATION_BINDING_PUBLIC_TYPE_NAMES,
    registry:
      executiveExperienceDirectorRuntimeScenePresentationBindingRegistry,
    interactionBindingBoundary: "EX-DRI-4-interaction-binding-only" as const,
    architecturalStatus:
      "ScenePresentationBinding Complete · Deterministic · Stateless · Renderer-Independent · ReadyForExDriAdvisorInsightBinding" as const,
  });

// ─── Verification ───────────────────────────────────────────────────────────

export interface ExecutiveExperienceDirectorRuntimeScenePresentationBindingVerification {
  readonly ok: boolean;
  readonly identity: typeof executiveExperienceDirectorRuntimeScenePresentationBindingIdentity;
  readonly version: typeof executiveExperienceDirectorRuntimeScenePresentationBindingVersion;
  readonly namespace: typeof executiveExperienceDirectorRuntimeScenePresentationBindingNamespace;
  readonly architecturalRole: typeof executiveExperienceDirectorRuntimeScenePresentationBindingArchitecturalRole;
  readonly dependencyIdentity: typeof executiveExperienceDirectorRuntimeScenePresentationBindingDependencyIdentity;
  readonly supportedDirectionKindCount: number;
  readonly deferredDirectionKindCount: number;
  readonly surfaceCount: number;
  readonly presentationStateCount: number;
  readonly sceneSubjectRoleCount: number;
  readonly changeKindCount: number;
  readonly issueCodeCount: number;
  readonly guaranteeCount: number;
  readonly validatorCount: number;
  readonly registrySectionCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly frozen: boolean;
  readonly interactionBindingBoundaryIntact: boolean;
  readonly frameworkIndependent: boolean;
  readonly presentationStatesCompatible: boolean;
  readonly directionSupportConsistent: boolean;
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

export function verifyExecutiveExperienceDirectorRuntimeScenePresentationBinding():
  ExecutiveExperienceDirectorRuntimeScenePresentationBindingVerification {
  const layer = executiveExperienceDirectorRuntimeScenePresentationBinding;
  const registry =
    executiveExperienceDirectorRuntimeScenePresentationBindingRegistry;

  const identityOk =
    layer.identity ===
      "EX-DRI-5/ExecutiveExperienceDirectorRuntimeScenePresentationBinding" &&
    layer.version === "1.5.0" &&
    layer.namespace ===
      "nexora.ex.dri.integration.scene-presentation-binding" &&
    layer.architecturalRole ===
      "ExecutiveExperienceDirectorRuntimeScenePresentationBinding" &&
    layer.status === "ScenePresentationBindingReady" &&
    layer.upstreamDependency ===
      "EX-DRI-4/ExecutiveExperienceDirectorRuntimeInteractionBinding" &&
    layer.upstreamDependency ===
      executiveExperienceDirectorRuntimeInteractionBindingIdentity &&
    registry.dependencyIdentity === layer.upstreamDependency &&
    layer.interactionBindingBoundary === "EX-DRI-4-interaction-binding-only";

  const dependencyOk =
    layer.dependencyPath ===
      "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeInteractionBinding";

  const supportedOk = exactOrder(
    EXECUTIVE_SCENE_PRESENTATION_SUPPORTED_DIRECTION_KINDS,
    ["scene", "focus", "attention", "presentation"],
  );
  const deferredOk = exactOrder(
    EXECUTIVE_SCENE_PRESENTATION_DEFERRED_DIRECTION_KINDS,
    ["guidance", "interaction", "coordination"],
  );
  const presentationStatesCompatible = exactOrder(
    EXECUTIVE_SCENE_PRESENTATION_BINDING_PRESENTATION_STATES,
    ["minimum", "report", "operation"],
  );
  const surfacesOk = exactOrder(
    EXECUTIVE_SCENE_PRESENTATION_BINDING_SURFACES,
    ["stage", "advisor", "insight", "live-lens", "timeline", "explorer"],
  );
  const rolesOk = exactOrder(EXECUTIVE_SCENE_SUBJECT_ROLES, [
    "primary",
    "related",
    "contextual",
  ]);
  const changeKindsOk = exactOrder(EXECUTIVE_SCENE_PRESENTATION_CHANGE_KINDS, [
    "scene",
    "focus",
    "attention",
    "presentation",
  ]);
  const issueCodesOk =
    exactOrder(EXECUTIVE_SCENE_PRESENTATION_BINDING_ISSUE_CODES, [
      "INVALID_RUNTIME_DIRECTION",
      "INVALID_SCENE_DIRECTION",
      "INVALID_FOCUS_DIRECTION",
      "INVALID_ATTENTION_DIRECTION",
      "INVALID_PRESENTATION_DIRECTION",
      "INVALID_SURFACE",
      "INVALID_SUBJECT",
      "SUBJECT_IDENTITY_CONFLICT",
      "DUPLICATE_SCENE_SUBJECT",
      "CONFLICTING_PRIMARY_SUBJECT",
      "CONFLICTING_FOCUS_DIRECTION",
      "CONFLICTING_PRESENTATION_STATE",
      "INVALID_PRESENTATION_STATE",
      "INVALID_RUNTIME_RESPONSE",
      "UNSUPPORTED_DIRECTION",
    ]) && unique([...EXECUTIVE_SCENE_PRESENTATION_BINDING_ISSUE_CODES]);

  const guaranteesOk =
    EXECUTIVE_SCENE_PRESENTATION_BINDING_GUARANTEES.length === 30 &&
    unique(
      EXECUTIVE_SCENE_PRESENTATION_BINDING_GUARANTEES.map((entry) => entry.id),
    ) &&
    EXECUTIVE_SCENE_PRESENTATION_BINDING_GUARANTEES.every(
      (entry, index) => entry.order === index + 1,
    );

  const directionSupportConsistent =
    getScenePresentationDirectionSupport("scene") === "supported" &&
    getScenePresentationDirectionSupport("focus") === "supported" &&
    getScenePresentationDirectionSupport("attention") === "supported" &&
    getScenePresentationDirectionSupport("presentation") === "supported" &&
    getScenePresentationDirectionSupport("guidance") === "deferred" &&
    getScenePresentationDirectionSupport("interaction") === "deferred" &&
    getScenePresentationDirectionSupport("coordination") === "deferred" &&
    getScenePresentationDirectionSupport("unknown") === "unsupported";

  const registryIntegrityOk =
    registry.supportedDirectionKindCount ===
      EXECUTIVE_SCENE_PRESENTATION_SUPPORTED_DIRECTION_KINDS.length &&
    registry.deferredDirectionKindCount ===
      EXECUTIVE_SCENE_PRESENTATION_DEFERRED_DIRECTION_KINDS.length &&
    registry.surfaceCount ===
      EXECUTIVE_SCENE_PRESENTATION_BINDING_SURFACES.length &&
    registry.presentationStateCount ===
      EXECUTIVE_SCENE_PRESENTATION_BINDING_PRESENTATION_STATES.length &&
    registry.sceneSubjectRoleCount === EXECUTIVE_SCENE_SUBJECT_ROLES.length &&
    registry.changeKindCount ===
      EXECUTIVE_SCENE_PRESENTATION_CHANGE_KINDS.length &&
    registry.issueCodeCount ===
      EXECUTIVE_SCENE_PRESENTATION_BINDING_ISSUE_CODES.length &&
    registry.guaranteeCount ===
      EXECUTIVE_SCENE_PRESENTATION_BINDING_GUARANTEES.length &&
    registry.validatorCount ===
      executiveExperienceDirectorRuntimeScenePresentationBindingValidatorNames
        .length &&
    registry.registrySectionCount ===
      EXECUTIVE_SCENE_PRESENTATION_BINDING_REGISTRY_SECTIONS.length &&
    registry.publicTypeCount ===
      EXECUTIVE_SCENE_PRESENTATION_BINDING_PUBLIC_TYPE_NAMES.length &&
    registry.publicApiCount ===
      executiveExperienceDirectorRuntimeScenePresentationBindingApiNames
        .length &&
    exactOrder(
      [...EXECUTIVE_SCENE_PRESENTATION_BINDING_REGISTRY_SECTIONS],
      [
        "Identity",
        "SupportedDirections",
        "Scene",
        "Focus",
        "Attention",
        "Presentation",
        "CompositeBinding",
        "Diffing",
        "Validation",
        "IssueCodes",
        "Guarantees",
        "Compatibility",
      ],
    );

  const immutabilityOk =
    Object.isFrozen(layer) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(
      executiveExperienceDirectorRuntimeScenePresentationBindingCanonicalIdentity,
    ) &&
    Object.isFrozen(EXECUTIVE_SCENE_PRESENTATION_SUPPORTED_DIRECTION_KINDS) &&
    Object.isFrozen(EXECUTIVE_SCENE_PRESENTATION_DEFERRED_DIRECTION_KINDS) &&
    Object.isFrozen(EXECUTIVE_SCENE_SUBJECT_ROLES) &&
    Object.isFrozen(EXECUTIVE_SCENE_PRESENTATION_CHANGE_KINDS) &&
    Object.isFrozen(EXECUTIVE_SCENE_PRESENTATION_BINDING_ISSUE_CODES) &&
    Object.isFrozen(EXECUTIVE_SCENE_PRESENTATION_BINDING_GUARANTEES) &&
    Object.isFrozen(EXECUTIVE_SCENE_PRESENTATION_BINDING_REGISTRY_SECTIONS);

  const interactionBindingBoundaryIntact =
    layer.upstreamDependency ===
      "EX-DRI-4/ExecutiveExperienceDirectorRuntimeInteractionBinding" &&
    layer.interactionBindingBoundary === "EX-DRI-4-interaction-binding-only";

  const frameworkIndependent =
    layer.frameworkIndependent === true &&
    layer.rendererIndependent === true &&
    layer.threeJsIndependent === true &&
    layer.reactIndependent === true &&
    layer.stateless === true;

  const ok =
    identityOk &&
    dependencyOk &&
    supportedOk &&
    deferredOk &&
    presentationStatesCompatible &&
    surfacesOk &&
    rolesOk &&
    changeKindsOk &&
    issueCodesOk &&
    guaranteesOk &&
    directionSupportConsistent &&
    registryIntegrityOk &&
    immutabilityOk &&
    interactionBindingBoundaryIntact &&
    frameworkIndependent &&
    layer.principle === EXECUTIVE_SCENE_PRESENTATION_BINDING_PRINCIPLE;

  return Object.freeze({
    ok,
    identity:
      executiveExperienceDirectorRuntimeScenePresentationBindingIdentity,
    version:
      executiveExperienceDirectorRuntimeScenePresentationBindingVersion,
    namespace:
      executiveExperienceDirectorRuntimeScenePresentationBindingNamespace,
    architecturalRole:
      executiveExperienceDirectorRuntimeScenePresentationBindingArchitecturalRole,
    dependencyIdentity:
      executiveExperienceDirectorRuntimeScenePresentationBindingDependencyIdentity,
    supportedDirectionKindCount:
      EXECUTIVE_SCENE_PRESENTATION_SUPPORTED_DIRECTION_KINDS.length,
    deferredDirectionKindCount:
      EXECUTIVE_SCENE_PRESENTATION_DEFERRED_DIRECTION_KINDS.length,
    surfaceCount: EXECUTIVE_SCENE_PRESENTATION_BINDING_SURFACES.length,
    presentationStateCount:
      EXECUTIVE_SCENE_PRESENTATION_BINDING_PRESENTATION_STATES.length,
    sceneSubjectRoleCount: EXECUTIVE_SCENE_SUBJECT_ROLES.length,
    changeKindCount: EXECUTIVE_SCENE_PRESENTATION_CHANGE_KINDS.length,
    issueCodeCount: EXECUTIVE_SCENE_PRESENTATION_BINDING_ISSUE_CODES.length,
    guaranteeCount: EXECUTIVE_SCENE_PRESENTATION_BINDING_GUARANTEES.length,
    validatorCount:
      executiveExperienceDirectorRuntimeScenePresentationBindingValidatorNames
        .length,
    registrySectionCount:
      EXECUTIVE_SCENE_PRESENTATION_BINDING_REGISTRY_SECTIONS.length,
    publicTypeCount:
      EXECUTIVE_SCENE_PRESENTATION_BINDING_PUBLIC_TYPE_NAMES.length,
    publicApiCount:
      executiveExperienceDirectorRuntimeScenePresentationBindingApiNames.length,
    frozen: immutabilityOk,
    interactionBindingBoundaryIntact,
    frameworkIndependent,
    presentationStatesCompatible,
    directionSupportConsistent,
  });
}
