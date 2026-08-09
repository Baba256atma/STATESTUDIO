/**
 * EX-DRI-2 — Executive Experience ↔ Director Runtime Integration Contracts.
 *
 * Defines the canonical, immutable, type-safe contracts crossing the EX ↔ DRI
 * boundary in both directions. Contracts only — no runtime orchestration,
 * React integration, state binding, scene mutation, or UI behavior.
 *
 * Answers:
 *   What is EX legally allowed to tell DRI?
 *   What is DRI legally allowed to tell EX?
 */

import {
  EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_DIRECTIONS,
  EXECUTIVE_EXPERIENCE_SURFACES,
  EXECUTIVE_INTERACTION_KINDS,
  EXECUTIVE_PRESENTATION_STATES,
  EXECUTIVE_RUNTIME_DIRECTION_KINDS,
  executiveExperienceDirectorRuntimeIntegrationFoundationIdentity,
  isExecutiveExperienceMode,
  isExecutiveExperienceSurface,
  isExecutiveInteractionKind,
  isExecutivePresentationState,
  isExecutiveSubjectKind,
  type ExecutiveExperienceMode,
  type ExecutiveExperienceSurface,
  type ExecutiveInteractionKind,
  type ExecutivePresentationState,
  type ExecutiveRuntimeDirectionKind,
  type ExecutiveSubjectKind,
} from "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeIntegrationFoundation";

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveExperienceDirectorRuntimeIntegrationContractsIdentity =
  "EX-DRI-2/ExecutiveExperienceDirectorRuntimeIntegrationContracts" as const;

export const executiveExperienceDirectorRuntimeIntegrationContractsVersion =
  "1.2.0" as const;

export const executiveExperienceDirectorRuntimeIntegrationContractsNamespace =
  "nexora.ex.dri.integration.contracts" as const;

export const executiveExperienceDirectorRuntimeIntegrationContractsArchitecturalRole =
  "ExecutiveExperienceDirectorRuntimeContractBoundary" as const;

export const executiveExperienceDirectorRuntimeIntegrationContractsDependencyIdentity =
  executiveExperienceDirectorRuntimeIntegrationFoundationIdentity;

export const executiveExperienceDirectorRuntimeIntegrationContractsDependencyPath =
  "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeIntegrationFoundation" as const;

export const executiveExperienceDirectorRuntimeIntegrationContractsContractDirectionality =
  "bidirectional-separated" as const;

export const executiveExperienceDirectorRuntimeIntegrationContractsDeterministic =
  true as const;

export const executiveExperienceDirectorRuntimeIntegrationContractsMutationPolicy =
  "immutable" as const;

export const executiveExperienceDirectorRuntimeIntegrationContractsSideEffectPolicy =
  "side-effect-free" as const;

export const executiveExperienceDirectorRuntimeIntegrationContractsCanonicalIdentity =
  Object.freeze({
    identity:
      executiveExperienceDirectorRuntimeIntegrationContractsIdentity,
    version:
      executiveExperienceDirectorRuntimeIntegrationContractsVersion,
    namespace:
      executiveExperienceDirectorRuntimeIntegrationContractsNamespace,
    architecturalRole:
      executiveExperienceDirectorRuntimeIntegrationContractsArchitecturalRole,
    dependencyIdentity:
      executiveExperienceDirectorRuntimeIntegrationContractsDependencyIdentity,
    contractDirectionality:
      executiveExperienceDirectorRuntimeIntegrationContractsContractDirectionality,
    deterministicStatus:
      executiveExperienceDirectorRuntimeIntegrationContractsDeterministic,
    mutationPolicy:
      executiveExperienceDirectorRuntimeIntegrationContractsMutationPolicy,
    sideEffectPolicy:
      executiveExperienceDirectorRuntimeIntegrationContractsSideEffectPolicy,
  });

export const EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_CONTRACTS_PRINCIPLE =
  "EX describes facts, context, and executive intent. DRI interprets those facts. DRI returns runtime direction. EX consumes that direction. EX-DRI defines the legal language between them." as const;

// ─── Contract families ──────────────────────────────────────────────────────

export const EXECUTIVE_DIRECTOR_RUNTIME_CONTRACT_FAMILIES = Object.freeze([
  "context",
  "subject",
  "interaction",
  "request",
  "scene",
  "focus",
  "attention",
  "presentation",
  "guidance",
  "coordination",
  "response",
  "correlation",
] as const);

export type ExecutiveDirectorRuntimeContractFamily =
  (typeof EXECUTIVE_DIRECTOR_RUNTIME_CONTRACT_FAMILIES)[number];

// ─── Request kinds & response statuses ──────────────────────────────────────

export const EXECUTIVE_DIRECTOR_RUNTIME_REQUEST_KINDS = Object.freeze([
  "context",
  "interaction",
  "context-interaction",
] as const);

export type ExecutiveDirectorRuntimeRequestKind =
  (typeof EXECUTIVE_DIRECTOR_RUNTIME_REQUEST_KINDS)[number];

export const EXECUTIVE_DIRECTOR_RUNTIME_RESPONSE_STATUSES = Object.freeze([
  "resolved",
  "partial",
  "rejected",
  "noop",
] as const);

export type ExecutiveDirectorRuntimeResponseStatus =
  (typeof EXECUTIVE_DIRECTOR_RUNTIME_RESPONSE_STATUSES)[number];

/**
 * DRI-compatible focus role vocabulary for optional focus-direction roles.
 * Defined locally so EX-DRI-2 does not bypass the EX-DRI-1 DRI boundary.
 */
export const EXECUTIVE_FOCUS_DIRECTION_ROLES = Object.freeze([
  "focused",
  "supporting",
  "contextual",
  "peripheral",
  "none",
] as const);

export type ExecutiveFocusDirectionRole =
  (typeof EXECUTIVE_FOCUS_DIRECTION_ROLES)[number];

/**
 * DRI-compatible attention level vocabulary for optional attention levels.
 */
export const EXECUTIVE_ATTENTION_DIRECTION_LEVELS = Object.freeze([
  "primary",
  "secondary",
  "context",
  "background",
  "suppressed",
] as const);

export type ExecutiveAttentionDirectionLevel =
  (typeof EXECUTIVE_ATTENTION_DIRECTION_LEVELS)[number];

// ─── Correlation ────────────────────────────────────────────────────────────

/**
 * Traces one runtime cycle without introducing runtime state.
 * EX-DRI receives IDs — it does not generate them.
 */
export interface ExecutiveDirectorRuntimeCorrelation {
  readonly correlationId: string;
  readonly sequence?: number;
  readonly parentCorrelationId?: string;
}

// ─── Subject / context / interaction (EX → DRI building blocks) ─────────────

/**
 * Lightweight subject identity and classification only.
 * Not a NexoraObject payload, React node, or mutable domain entity.
 */
export interface ExecutiveDirectorRuntimeSubjectContract {
  readonly id: string;
  readonly kind: ExecutiveSubjectKind;
  readonly label?: string;
}

/**
 * What is currently true in the Executive Experience?
 * Does not prescribe what DRI should do.
 */
export interface ExecutiveDirectorRuntimeContextContract {
  readonly surface: ExecutiveExperienceSurface;
  readonly mode?: ExecutiveExperienceMode;
  readonly selectedSubject?: ExecutiveDirectorRuntimeSubjectContract;
  readonly focusedSubject?: ExecutiveDirectorRuntimeSubjectContract;
  readonly activeGoalId?: string;
  readonly activePackId?: string;
  readonly activeModelId?: string;
  readonly presentationState?: ExecutivePresentationState;
}

/**
 * What did the executive user do?
 * Semantic interaction only — no UI instructions.
 */
export interface ExecutiveDirectorRuntimeInteractionContract {
  readonly interactionId: string;
  readonly kind: ExecutiveInteractionKind;
  readonly surface: ExecutiveExperienceSurface;
  readonly subject?: ExecutiveDirectorRuntimeSubjectContract;
}

// ─── EX → DRI request (discriminated by kind) ───────────────────────────────

interface ExecutiveDirectorRuntimeRequestBase {
  readonly direction: "ex-to-dri";
  readonly correlation: ExecutiveDirectorRuntimeCorrelation;
  readonly context: ExecutiveDirectorRuntimeContextContract;
}

export interface ExecutiveDirectorRuntimeContextRequestContract
  extends ExecutiveDirectorRuntimeRequestBase {
  readonly kind: "context";
  readonly interaction?: undefined;
}

export interface ExecutiveDirectorRuntimeInteractionRequestContract
  extends ExecutiveDirectorRuntimeRequestBase {
  readonly kind: "interaction";
  readonly interaction: ExecutiveDirectorRuntimeInteractionContract;
}

export interface ExecutiveDirectorRuntimeContextInteractionRequestContract
  extends ExecutiveDirectorRuntimeRequestBase {
  readonly kind: "context-interaction";
  readonly interaction: ExecutiveDirectorRuntimeInteractionContract;
}

/**
 * Canonical EX → DRI request envelope.
 * Discriminated by kind so invalid field combinations are not representable.
 */
export type ExecutiveDirectorRuntimeRequestContract =
  | ExecutiveDirectorRuntimeContextRequestContract
  | ExecutiveDirectorRuntimeInteractionRequestContract
  | ExecutiveDirectorRuntimeContextInteractionRequestContract;

// ─── DRI → EX runtime direction contracts ───────────────────────────────────

export interface ExecutiveSceneDirectionContract {
  readonly kind: "scene";
  readonly surface: ExecutiveExperienceSurface;
  readonly primarySubject?: ExecutiveDirectorRuntimeSubjectContract;
  readonly relatedSubjects: ReadonlyArray<ExecutiveDirectorRuntimeSubjectContract>;
}

export interface ExecutiveFocusDirectionContract {
  readonly kind: "focus";
  readonly subject?: ExecutiveDirectorRuntimeSubjectContract;
  readonly surface: ExecutiveExperienceSurface;
  readonly role?: ExecutiveFocusDirectionRole;
}

export interface ExecutiveAttentionDirectionContract {
  readonly kind: "attention";
  readonly subject: ExecutiveDirectorRuntimeSubjectContract;
  readonly surface: ExecutiveExperienceSurface;
  readonly level?: ExecutiveAttentionDirectionLevel;
  readonly reason?: string;
}

export interface ExecutivePresentationDirectionContract {
  readonly kind: "presentation";
  readonly subject: ExecutiveDirectorRuntimeSubjectContract;
  readonly surface: ExecutiveExperienceSurface;
  readonly state: ExecutivePresentationState;
}

export interface ExecutiveGuidanceDirectionContract {
  readonly kind: "guidance";
  readonly surface: ExecutiveExperienceSurface;
  readonly subject?: ExecutiveDirectorRuntimeSubjectContract;
  readonly guidanceRole?: string;
  readonly messageKey?: string;
}

export interface ExecutiveInteractionDirectionContract {
  readonly kind: "interaction";
  readonly surface: ExecutiveExperienceSurface;
  readonly subject?: ExecutiveDirectorRuntimeSubjectContract;
  readonly interaction: ExecutiveInteractionKind;
}

export interface ExecutiveCoordinationDirectionContract {
  readonly kind: "coordination";
  readonly sourceSurface: ExecutiveExperienceSurface;
  readonly targetSurfaces: ReadonlyArray<ExecutiveExperienceSurface>;
  readonly subject?: ExecutiveDirectorRuntimeSubjectContract;
}

/**
 * Canonical DRI → EX runtime direction union.
 * `kind` is the exhaustive discriminant — no string fallback.
 */
export type ExecutiveRuntimeDirectionContract =
  | ExecutiveSceneDirectionContract
  | ExecutiveFocusDirectionContract
  | ExecutiveAttentionDirectionContract
  | ExecutivePresentationDirectionContract
  | ExecutiveGuidanceDirectionContract
  | ExecutiveInteractionDirectionContract
  | ExecutiveCoordinationDirectionContract;

// ─── DRI → EX response ──────────────────────────────────────────────────────

export interface ExecutiveDirectorRuntimeResponseContract {
  readonly direction: "dri-to-ex";
  readonly correlation: ExecutiveDirectorRuntimeCorrelation;
  readonly status: ExecutiveDirectorRuntimeResponseStatus;
  readonly directions: ReadonlyArray<ExecutiveRuntimeDirectionContract>;
}

/**
 * Canonical boundary envelope — either EX → DRI or DRI → EX.
 * Narrow safely via the `direction` discriminant.
 */
export type ExecutiveDirectorRuntimeBoundaryContract =
  | ExecutiveDirectorRuntimeRequestContract
  | ExecutiveDirectorRuntimeResponseContract;

// ─── Boundary guarantees ────────────────────────────────────────────────────

export const EXECUTIVE_DIRECTOR_RUNTIME_CONTRACT_BOUNDARY_GUARANTEES =
  Object.freeze([
    Object.freeze({
      id: "directions-explicitly-separated",
      order: 1,
      statement: "EX → DRI and DRI → EX are explicitly separated.",
    }),
    Object.freeze({
      id: "top-level-contracts-declare-direction",
      order: 2,
      statement: "All top-level contracts declare direction.",
    }),
    Object.freeze({
      id: "plain-immutable-data",
      order: 3,
      statement: "Contracts are plain immutable data.",
    }),
    Object.freeze({
      id: "no-react-objects",
      order: 4,
      statement: "Contracts contain no React objects.",
    }),
    Object.freeze({
      id: "no-dom-references",
      order: 5,
      statement: "Contracts contain no DOM references.",
    }),
    Object.freeze({
      id: "no-threejs-objects",
      order: 6,
      statement: "Contracts contain no Three.js objects.",
    }),
    Object.freeze({
      id: "no-callbacks",
      order: 7,
      statement: "Contracts contain no callbacks.",
    }),
    Object.freeze({
      id: "no-mutable-application-state",
      order: 8,
      statement: "Contracts contain no mutable application state.",
    }),
    Object.freeze({
      id: "ex-does-not-prescribe-director-behavior",
      order: 9,
      statement: "EX does not prescribe Director behavior.",
    }),
    Object.freeze({
      id: "dri-direction-renderer-independent",
      order: 10,
      statement: "DRI direction remains renderer-independent.",
    }),
    Object.freeze({
      id: "runtime-directions-canonical-discriminants",
      order: 11,
      statement: "Runtime directions use canonical discriminants.",
    }),
    Object.freeze({
      id: "surface-coordination-semantic",
      order: 12,
      statement: "Surface coordination remains semantic.",
    }),
    Object.freeze({
      id: "presentation-states-canonical",
      order: 13,
      statement: "Presentation states remain minimum/report/operation.",
    }),
    Object.freeze({
      id: "nexora-object-referenced-not-duplicated",
      order: 14,
      statement: "NexoraObject is referenced, not duplicated.",
    }),
    Object.freeze({
      id: "kpi-koi-calculations-outside",
      order: 15,
      statement: "KPI/KOI calculations remain outside EX-DRI.",
    }),
    Object.freeze({
      id: "contract-validation-deterministic",
      order: 16,
      statement: "Contract validation is deterministic.",
    }),
    Object.freeze({
      id: "contract-construction-side-effect-free",
      order: 17,
      statement: "Contract construction is side-effect free.",
    }),
    Object.freeze({
      id: "no-runtime-engine-in-ex-dri-2",
      order: 18,
      statement: "No runtime engine exists in EX-DRI-2.",
    }),
  ] as const);

export type ExecutiveDirectorRuntimeContractBoundaryGuarantee =
  (typeof EXECUTIVE_DIRECTOR_RUNTIME_CONTRACT_BOUNDARY_GUARANTEES)[number];

export const EXECUTIVE_DIRECTOR_RUNTIME_CONTRACT_FORBIDDEN_RESPONSIBILITIES =
  Object.freeze([
    "React components",
    "React hooks",
    "React context",
    "Zustand",
    "Redux",
    "Next.js routing",
    "DOM operations",
    "Three.js operations",
    "camera control",
    "animations",
    "scene rendering",
    "object rendering",
    "runtime orchestration",
    "runtime resolution",
    "focus calculation",
    "attention calculation",
    "presentation calculation",
    "guidance generation",
    "AI inference",
    "Advisor reasoning",
    "Insight reasoning",
    "KPI calculation",
    "KOI calculation",
    "scenario simulation",
    "decision logic",
    "execution workflow",
    "timeline mutation",
    "journal mutation",
    "network access",
    "database access",
    "async orchestration",
  ] as const);

// ─── Internal guards ────────────────────────────────────────────────────────

type PlainObject = Record<string, unknown>;

function isPlainObject(value: unknown): value is PlainObject {
  if (value === null || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function hasOpaqueId(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isOptionalOpaqueId(value: unknown): boolean {
  return value === undefined || hasOpaqueId(value);
}

function isNonNegativeInteger(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 0 &&
    Number.isFinite(value)
  );
}

function isExecutiveFocusDirectionRole(
  value: unknown,
): value is ExecutiveFocusDirectionRole {
  return (EXECUTIVE_FOCUS_DIRECTION_ROLES as readonly unknown[]).includes(
    value,
  );
}

function isExecutiveAttentionDirectionLevel(
  value: unknown,
): value is ExecutiveAttentionDirectionLevel {
  return (EXECUTIVE_ATTENTION_DIRECTION_LEVELS as readonly unknown[]).includes(
    value,
  );
}

function isExecutiveDirectorRuntimeRequestKind(
  value: unknown,
): value is ExecutiveDirectorRuntimeRequestKind {
  return (EXECUTIVE_DIRECTOR_RUNTIME_REQUEST_KINDS as readonly unknown[]).includes(
    value,
  );
}

function isExecutiveDirectorRuntimeResponseStatus(
  value: unknown,
): value is ExecutiveDirectorRuntimeResponseStatus {
  return (
    EXECUTIVE_DIRECTOR_RUNTIME_RESPONSE_STATUSES as readonly unknown[]
  ).includes(value);
}

function responseStatusMatchesDirections(
  status: ExecutiveDirectorRuntimeResponseStatus,
  directionCount: number,
): boolean {
  if (status === "noop" || status === "rejected") {
    return directionCount === 0;
  }
  // resolved / partial require at least one applicable direction
  return directionCount >= 1;
}

// ─── Validators ─────────────────────────────────────────────────────────────

export function isExecutiveDirectorRuntimeCorrelation(
  value: unknown,
): value is ExecutiveDirectorRuntimeCorrelation {
  if (!isPlainObject(value)) return false;
  if (!hasOpaqueId(value.correlationId)) return false;
  if (
    value.sequence !== undefined &&
    !isNonNegativeInteger(value.sequence)
  ) {
    return false;
  }
  if (
    value.parentCorrelationId !== undefined &&
    !hasOpaqueId(value.parentCorrelationId)
  ) {
    return false;
  }
  if (
    value.parentCorrelationId !== undefined &&
    value.parentCorrelationId === value.correlationId
  ) {
    return false;
  }
  const keys = Object.keys(value);
  for (const key of keys) {
    if (
      key !== "correlationId" &&
      key !== "sequence" &&
      key !== "parentCorrelationId"
    ) {
      return false;
    }
  }
  return true;
}

export function isExecutiveDirectorRuntimeSubjectContract(
  value: unknown,
): value is ExecutiveDirectorRuntimeSubjectContract {
  if (!isPlainObject(value)) return false;
  if (!hasOpaqueId(value.id)) return false;
  if (!isExecutiveSubjectKind(value.kind)) return false;
  if (value.label !== undefined && typeof value.label !== "string") {
    return false;
  }
  const keys = Object.keys(value);
  for (const key of keys) {
    if (key !== "id" && key !== "kind" && key !== "label") return false;
  }
  return true;
}

export function isExecutiveDirectorRuntimeContextContract(
  value: unknown,
): value is ExecutiveDirectorRuntimeContextContract {
  if (!isPlainObject(value)) return false;
  if (!isExecutiveExperienceSurface(value.surface)) return false;
  if (
    value.mode !== undefined &&
    !isExecutiveExperienceMode(value.mode)
  ) {
    return false;
  }
  if (
    value.selectedSubject !== undefined &&
    !isExecutiveDirectorRuntimeSubjectContract(value.selectedSubject)
  ) {
    return false;
  }
  if (
    value.focusedSubject !== undefined &&
    !isExecutiveDirectorRuntimeSubjectContract(value.focusedSubject)
  ) {
    return false;
  }
  if (!isOptionalOpaqueId(value.activeGoalId)) return false;
  if (!isOptionalOpaqueId(value.activePackId)) return false;
  if (!isOptionalOpaqueId(value.activeModelId)) return false;
  if (
    value.presentationState !== undefined &&
    !isExecutivePresentationState(value.presentationState)
  ) {
    return false;
  }
  return true;
}

export function isExecutiveDirectorRuntimeInteractionContract(
  value: unknown,
): value is ExecutiveDirectorRuntimeInteractionContract {
  if (!isPlainObject(value)) return false;
  if (!hasOpaqueId(value.interactionId)) return false;
  if (!isExecutiveInteractionKind(value.kind)) return false;
  if (!isExecutiveExperienceSurface(value.surface)) return false;
  if (
    value.subject !== undefined &&
    !isExecutiveDirectorRuntimeSubjectContract(value.subject)
  ) {
    return false;
  }
  return true;
}

export function isExecutiveSceneDirectionContract(
  value: unknown,
): value is ExecutiveSceneDirectionContract {
  if (!isPlainObject(value)) return false;
  if (value.kind !== "scene") return false;
  if (!isExecutiveExperienceSurface(value.surface)) return false;
  if (
    value.primarySubject !== undefined &&
    !isExecutiveDirectorRuntimeSubjectContract(value.primarySubject)
  ) {
    return false;
  }
  if (!Array.isArray(value.relatedSubjects)) return false;
  return value.relatedSubjects.every((subject) =>
    isExecutiveDirectorRuntimeSubjectContract(subject),
  );
}

export function isExecutiveFocusDirectionContract(
  value: unknown,
): value is ExecutiveFocusDirectionContract {
  if (!isPlainObject(value)) return false;
  if (value.kind !== "focus") return false;
  if (!isExecutiveExperienceSurface(value.surface)) return false;
  if (
    value.subject !== undefined &&
    !isExecutiveDirectorRuntimeSubjectContract(value.subject)
  ) {
    return false;
  }
  if (
    value.role !== undefined &&
    !isExecutiveFocusDirectionRole(value.role)
  ) {
    return false;
  }
  return true;
}

export function isExecutiveAttentionDirectionContract(
  value: unknown,
): value is ExecutiveAttentionDirectionContract {
  if (!isPlainObject(value)) return false;
  if (value.kind !== "attention") return false;
  if (!isExecutiveDirectorRuntimeSubjectContract(value.subject)) return false;
  if (!isExecutiveExperienceSurface(value.surface)) return false;
  if (
    value.level !== undefined &&
    !isExecutiveAttentionDirectionLevel(value.level)
  ) {
    return false;
  }
  if (value.reason !== undefined && typeof value.reason !== "string") {
    return false;
  }
  return true;
}

export function isExecutivePresentationDirectionContract(
  value: unknown,
): value is ExecutivePresentationDirectionContract {
  if (!isPlainObject(value)) return false;
  if (value.kind !== "presentation") return false;
  if (!isExecutiveDirectorRuntimeSubjectContract(value.subject)) return false;
  if (!isExecutiveExperienceSurface(value.surface)) return false;
  if (!isExecutivePresentationState(value.state)) return false;
  return true;
}

export function isExecutiveGuidanceDirectionContract(
  value: unknown,
): value is ExecutiveGuidanceDirectionContract {
  if (!isPlainObject(value)) return false;
  if (value.kind !== "guidance") return false;
  if (!isExecutiveExperienceSurface(value.surface)) return false;
  if (
    value.subject !== undefined &&
    !isExecutiveDirectorRuntimeSubjectContract(value.subject)
  ) {
    return false;
  }
  if (
    value.guidanceRole !== undefined &&
    typeof value.guidanceRole !== "string"
  ) {
    return false;
  }
  if (
    value.messageKey !== undefined &&
    typeof value.messageKey !== "string"
  ) {
    return false;
  }
  return true;
}

export function isExecutiveInteractionDirectionContract(
  value: unknown,
): value is ExecutiveInteractionDirectionContract {
  if (!isPlainObject(value)) return false;
  if (value.kind !== "interaction") return false;
  if (!isExecutiveExperienceSurface(value.surface)) return false;
  if (
    value.subject !== undefined &&
    !isExecutiveDirectorRuntimeSubjectContract(value.subject)
  ) {
    return false;
  }
  if (!isExecutiveInteractionKind(value.interaction)) return false;
  return true;
}

export function isExecutiveCoordinationDirectionContract(
  value: unknown,
): value is ExecutiveCoordinationDirectionContract {
  if (!isPlainObject(value)) return false;
  if (value.kind !== "coordination") return false;
  if (!isExecutiveExperienceSurface(value.sourceSurface)) return false;
  if (!Array.isArray(value.targetSurfaces)) return false;
  if (
    !value.targetSurfaces.every((surface) =>
      isExecutiveExperienceSurface(surface),
    )
  ) {
    return false;
  }
  if (
    value.subject !== undefined &&
    !isExecutiveDirectorRuntimeSubjectContract(value.subject)
  ) {
    return false;
  }
  return true;
}

export function isExecutiveRuntimeDirectionContract(
  value: unknown,
): value is ExecutiveRuntimeDirectionContract {
  if (!isPlainObject(value)) return false;
  switch (value.kind) {
    case "scene":
      return isExecutiveSceneDirectionContract(value);
    case "focus":
      return isExecutiveFocusDirectionContract(value);
    case "attention":
      return isExecutiveAttentionDirectionContract(value);
    case "presentation":
      return isExecutivePresentationDirectionContract(value);
    case "guidance":
      return isExecutiveGuidanceDirectionContract(value);
    case "interaction":
      return isExecutiveInteractionDirectionContract(value);
    case "coordination":
      return isExecutiveCoordinationDirectionContract(value);
    default:
      return false;
  }
}

export function isExecutiveDirectorRuntimeRequestContract(
  value: unknown,
): value is ExecutiveDirectorRuntimeRequestContract {
  if (!isPlainObject(value)) return false;
  if (value.direction !== "ex-to-dri") return false;
  if (!isExecutiveDirectorRuntimeRequestKind(value.kind)) return false;
  if (!isExecutiveDirectorRuntimeCorrelation(value.correlation)) return false;
  if (!isExecutiveDirectorRuntimeContextContract(value.context)) return false;

  if (value.kind === "context") {
    return value.interaction === undefined;
  }

  if (
    value.kind === "interaction" ||
    value.kind === "context-interaction"
  ) {
    return isExecutiveDirectorRuntimeInteractionContract(value.interaction);
  }

  return false;
}

export function isExecutiveDirectorRuntimeResponseContract(
  value: unknown,
): value is ExecutiveDirectorRuntimeResponseContract {
  if (!isPlainObject(value)) return false;
  if (value.direction !== "dri-to-ex") return false;
  if (!isExecutiveDirectorRuntimeCorrelation(value.correlation)) return false;
  if (!isExecutiveDirectorRuntimeResponseStatus(value.status)) return false;
  if (!Array.isArray(value.directions)) return false;
  if (
    !value.directions.every((direction) =>
      isExecutiveRuntimeDirectionContract(direction),
    )
  ) {
    return false;
  }
  return responseStatusMatchesDirections(
    value.status,
    value.directions.length,
  );
}

export function isExecutiveDirectorRuntimeBoundaryContract(
  value: unknown,
): value is ExecutiveDirectorRuntimeBoundaryContract {
  if (!isPlainObject(value)) return false;
  if (value.direction === "ex-to-dri") {
    return isExecutiveDirectorRuntimeRequestContract(value);
  }
  if (value.direction === "dri-to-ex") {
    return isExecutiveDirectorRuntimeResponseContract(value);
  }
  return false;
}

export function isExecutiveDirectorRuntimeContractFamily(
  value: unknown,
): value is ExecutiveDirectorRuntimeContractFamily {
  return (
    EXECUTIVE_DIRECTOR_RUNTIME_CONTRACT_FAMILIES as readonly unknown[]
  ).includes(value);
}

// ─── Construction helpers ───────────────────────────────────────────────────

function freezeSubject(
  subject: ExecutiveDirectorRuntimeSubjectContract,
): ExecutiveDirectorRuntimeSubjectContract {
  return Object.freeze(
    subject.label !== undefined
      ? { id: subject.id, kind: subject.kind, label: subject.label }
      : { id: subject.id, kind: subject.kind },
  );
}

function freezeCorrelation(
  correlation: ExecutiveDirectorRuntimeCorrelation,
): ExecutiveDirectorRuntimeCorrelation {
  return Object.freeze({
    correlationId: correlation.correlationId,
    ...(correlation.sequence !== undefined
      ? { sequence: correlation.sequence }
      : {}),
    ...(correlation.parentCorrelationId !== undefined
      ? { parentCorrelationId: correlation.parentCorrelationId }
      : {}),
  });
}

function freezeContext(
  context: ExecutiveDirectorRuntimeContextContract,
): ExecutiveDirectorRuntimeContextContract {
  return Object.freeze({
    surface: context.surface,
    ...(context.mode !== undefined ? { mode: context.mode } : {}),
    ...(context.selectedSubject !== undefined
      ? { selectedSubject: freezeSubject(context.selectedSubject) }
      : {}),
    ...(context.focusedSubject !== undefined
      ? { focusedSubject: freezeSubject(context.focusedSubject) }
      : {}),
    ...(context.activeGoalId !== undefined
      ? { activeGoalId: context.activeGoalId }
      : {}),
    ...(context.activePackId !== undefined
      ? { activePackId: context.activePackId }
      : {}),
    ...(context.activeModelId !== undefined
      ? { activeModelId: context.activeModelId }
      : {}),
    ...(context.presentationState !== undefined
      ? { presentationState: context.presentationState }
      : {}),
  });
}

function freezeInteraction(
  interaction: ExecutiveDirectorRuntimeInteractionContract,
): ExecutiveDirectorRuntimeInteractionContract {
  return Object.freeze({
    interactionId: interaction.interactionId,
    kind: interaction.kind,
    surface: interaction.surface,
    ...(interaction.subject !== undefined
      ? { subject: freezeSubject(interaction.subject) }
      : {}),
  });
}

function freezeRuntimeDirection(
  direction: ExecutiveRuntimeDirectionContract,
): ExecutiveRuntimeDirectionContract {
  switch (direction.kind) {
    case "scene":
      return Object.freeze({
        kind: "scene" as const,
        surface: direction.surface,
        ...(direction.primarySubject !== undefined
          ? { primarySubject: freezeSubject(direction.primarySubject) }
          : {}),
        relatedSubjects: Object.freeze(
          direction.relatedSubjects.map((subject) => freezeSubject(subject)),
        ),
      });
    case "focus":
      return Object.freeze({
        kind: "focus" as const,
        surface: direction.surface,
        ...(direction.subject !== undefined
          ? { subject: freezeSubject(direction.subject) }
          : {}),
        ...(direction.role !== undefined ? { role: direction.role } : {}),
      });
    case "attention":
      return Object.freeze({
        kind: "attention" as const,
        subject: freezeSubject(direction.subject),
        surface: direction.surface,
        ...(direction.level !== undefined ? { level: direction.level } : {}),
        ...(direction.reason !== undefined
          ? { reason: direction.reason }
          : {}),
      });
    case "presentation":
      return Object.freeze({
        kind: "presentation" as const,
        subject: freezeSubject(direction.subject),
        surface: direction.surface,
        state: direction.state,
      });
    case "guidance":
      return Object.freeze({
        kind: "guidance" as const,
        surface: direction.surface,
        ...(direction.subject !== undefined
          ? { subject: freezeSubject(direction.subject) }
          : {}),
        ...(direction.guidanceRole !== undefined
          ? { guidanceRole: direction.guidanceRole }
          : {}),
        ...(direction.messageKey !== undefined
          ? { messageKey: direction.messageKey }
          : {}),
      });
    case "interaction":
      return Object.freeze({
        kind: "interaction" as const,
        surface: direction.surface,
        interaction: direction.interaction,
        ...(direction.subject !== undefined
          ? { subject: freezeSubject(direction.subject) }
          : {}),
      });
    case "coordination":
      return Object.freeze({
        kind: "coordination" as const,
        sourceSurface: direction.sourceSurface,
        targetSurfaces: Object.freeze([...direction.targetSurfaces]),
        ...(direction.subject !== undefined
          ? { subject: freezeSubject(direction.subject) }
          : {}),
      });
    default: {
      const _exhaustive: never = direction;
      return _exhaustive;
    }
  }
}

export function createExecutiveDirectorRuntimeCorrelation(
  input: ExecutiveDirectorRuntimeCorrelation,
): ExecutiveDirectorRuntimeCorrelation {
  if (!isExecutiveDirectorRuntimeCorrelation(input)) {
    throw new TypeError(
      "correlation must be a valid ExecutiveDirectorRuntimeCorrelation",
    );
  }
  return freezeCorrelation(input);
}

export function createExecutiveDirectorRuntimeSubjectContract(
  input: ExecutiveDirectorRuntimeSubjectContract,
): ExecutiveDirectorRuntimeSubjectContract {
  if (!isExecutiveDirectorRuntimeSubjectContract(input)) {
    throw new TypeError(
      "subject must be a valid ExecutiveDirectorRuntimeSubjectContract",
    );
  }
  return freezeSubject(input);
}

export function createExecutiveDirectorRuntimeContextContract(
  input: ExecutiveDirectorRuntimeContextContract,
): ExecutiveDirectorRuntimeContextContract {
  if (!isExecutiveDirectorRuntimeContextContract(input)) {
    throw new TypeError(
      "context must be a valid ExecutiveDirectorRuntimeContextContract",
    );
  }
  return freezeContext(input);
}

export function createExecutiveDirectorRuntimeInteractionContract(
  input: ExecutiveDirectorRuntimeInteractionContract,
): ExecutiveDirectorRuntimeInteractionContract {
  if (!isExecutiveDirectorRuntimeInteractionContract(input)) {
    throw new TypeError(
      "interaction must be a valid ExecutiveDirectorRuntimeInteractionContract",
    );
  }
  return freezeInteraction(input);
}

export function createExecutiveDirectorRuntimeRequest(
  input: ExecutiveDirectorRuntimeRequestContract,
): ExecutiveDirectorRuntimeRequestContract {
  if (!isExecutiveDirectorRuntimeRequestContract(input)) {
    throw new TypeError(
      "request must be a valid ExecutiveDirectorRuntimeRequestContract",
    );
  }
  const correlation = freezeCorrelation(input.correlation);
  const context = freezeContext(input.context);
  if (input.kind === "context") {
    return Object.freeze({
      direction: "ex-to-dri" as const,
      kind: "context" as const,
      correlation,
      context,
    });
  }
  return Object.freeze({
    direction: "ex-to-dri" as const,
    kind: input.kind,
    correlation,
    context,
    interaction: freezeInteraction(input.interaction),
  });
}

export function createExecutiveRuntimeDirectionContract(
  input: ExecutiveRuntimeDirectionContract,
): ExecutiveRuntimeDirectionContract {
  if (!isExecutiveRuntimeDirectionContract(input)) {
    throw new TypeError(
      "direction must be a valid ExecutiveRuntimeDirectionContract",
    );
  }
  return freezeRuntimeDirection(input);
}

export function createExecutiveDirectorRuntimeResponse(
  input: ExecutiveDirectorRuntimeResponseContract,
): ExecutiveDirectorRuntimeResponseContract {
  if (!isExecutiveDirectorRuntimeResponseContract(input)) {
    throw new TypeError(
      "response must be a valid ExecutiveDirectorRuntimeResponseContract",
    );
  }
  return Object.freeze({
    direction: "dri-to-ex" as const,
    correlation: freezeCorrelation(input.correlation),
    status: input.status,
    directions: Object.freeze(
      input.directions.map((direction) => freezeRuntimeDirection(direction)),
    ),
  });
}

// ─── List helpers ───────────────────────────────────────────────────────────

export function listExecutiveDirectorRuntimeContractFamilies(): ReadonlyArray<
  ExecutiveDirectorRuntimeContractFamily
> {
  return EXECUTIVE_DIRECTOR_RUNTIME_CONTRACT_FAMILIES;
}

export function listExecutiveDirectorRuntimeRequestKinds(): ReadonlyArray<
  ExecutiveDirectorRuntimeRequestKind
> {
  return EXECUTIVE_DIRECTOR_RUNTIME_REQUEST_KINDS;
}

export function listExecutiveDirectorRuntimeResponseStatuses(): ReadonlyArray<
  ExecutiveDirectorRuntimeResponseStatus
> {
  return EXECUTIVE_DIRECTOR_RUNTIME_RESPONSE_STATUSES;
}

export function listExecutiveRuntimeDirectionKinds(): ReadonlyArray<
  ExecutiveRuntimeDirectionKind
> {
  return EXECUTIVE_RUNTIME_DIRECTION_KINDS;
}

export function getExecutiveExperienceDirectorRuntimeIntegrationContractsIdentity():
  typeof executiveExperienceDirectorRuntimeIntegrationContractsCanonicalIdentity {
  return executiveExperienceDirectorRuntimeIntegrationContractsCanonicalIdentity;
}

// ─── Catalogs / registry ────────────────────────────────────────────────────

export const EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_CONTRACT_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "ExecutiveDirectorRuntimeContractFamily",
    "ExecutiveDirectorRuntimeRequestKind",
    "ExecutiveDirectorRuntimeResponseStatus",
    "ExecutiveFocusDirectionRole",
    "ExecutiveAttentionDirectionLevel",
    "ExecutiveDirectorRuntimeCorrelation",
    "ExecutiveDirectorRuntimeSubjectContract",
    "ExecutiveDirectorRuntimeContextContract",
    "ExecutiveDirectorRuntimeInteractionContract",
    "ExecutiveDirectorRuntimeContextRequestContract",
    "ExecutiveDirectorRuntimeInteractionRequestContract",
    "ExecutiveDirectorRuntimeContextInteractionRequestContract",
    "ExecutiveDirectorRuntimeRequestContract",
    "ExecutiveSceneDirectionContract",
    "ExecutiveFocusDirectionContract",
    "ExecutiveAttentionDirectionContract",
    "ExecutivePresentationDirectionContract",
    "ExecutiveGuidanceDirectionContract",
    "ExecutiveInteractionDirectionContract",
    "ExecutiveCoordinationDirectionContract",
    "ExecutiveRuntimeDirectionContract",
    "ExecutiveDirectorRuntimeResponseContract",
    "ExecutiveDirectorRuntimeBoundaryContract",
    "ExecutiveDirectorRuntimeContractBoundaryGuarantee",
    "ExecutiveExperienceDirectorRuntimeIntegrationContractsVerification",
  ] as const);

export const executiveExperienceDirectorRuntimeIntegrationContractsValidatorNames =
  Object.freeze([
    "isExecutiveDirectorRuntimeCorrelation",
    "isExecutiveDirectorRuntimeSubjectContract",
    "isExecutiveDirectorRuntimeContextContract",
    "isExecutiveDirectorRuntimeInteractionContract",
    "isExecutiveDirectorRuntimeRequestContract",
    "isExecutiveRuntimeDirectionContract",
    "isExecutiveDirectorRuntimeResponseContract",
    "isExecutiveDirectorRuntimeBoundaryContract",
    "isExecutiveSceneDirectionContract",
    "isExecutiveFocusDirectionContract",
    "isExecutiveAttentionDirectionContract",
    "isExecutivePresentationDirectionContract",
    "isExecutiveGuidanceDirectionContract",
    "isExecutiveInteractionDirectionContract",
    "isExecutiveCoordinationDirectionContract",
    "isExecutiveDirectorRuntimeContractFamily",
  ] as const);

export const executiveExperienceDirectorRuntimeIntegrationContractsConstructionHelperNames =
  Object.freeze([
    "createExecutiveDirectorRuntimeCorrelation",
    "createExecutiveDirectorRuntimeSubjectContract",
    "createExecutiveDirectorRuntimeContextContract",
    "createExecutiveDirectorRuntimeInteractionContract",
    "createExecutiveDirectorRuntimeRequest",
    "createExecutiveRuntimeDirectionContract",
    "createExecutiveDirectorRuntimeResponse",
  ] as const);

export const executiveExperienceDirectorRuntimeIntegrationContractsApiNames =
  Object.freeze([
    "getExecutiveExperienceDirectorRuntimeIntegrationContractsIdentity",
    "listExecutiveDirectorRuntimeContractFamilies",
    "listExecutiveDirectorRuntimeRequestKinds",
    "listExecutiveDirectorRuntimeResponseStatuses",
    "listExecutiveRuntimeDirectionKinds",
    ...executiveExperienceDirectorRuntimeIntegrationContractsValidatorNames,
    ...executiveExperienceDirectorRuntimeIntegrationContractsConstructionHelperNames,
    "verifyExecutiveExperienceDirectorRuntimeIntegrationContracts",
  ] as const);

export const EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_CONTRACT_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "ContractFamilies",
    "RequestContracts",
    "ResponseContracts",
    "RuntimeDirections",
    "Validation",
    "Compatibility",
    "BoundaryRules",
  ] as const);

export const executiveExperienceDirectorRuntimeIntegrationContractsRegistry =
  Object.freeze({
    identity:
      executiveExperienceDirectorRuntimeIntegrationContractsIdentity,
    version:
      executiveExperienceDirectorRuntimeIntegrationContractsVersion,
    namespace:
      executiveExperienceDirectorRuntimeIntegrationContractsNamespace,
    architecturalRole:
      executiveExperienceDirectorRuntimeIntegrationContractsArchitecturalRole,
    dependencyIdentity:
      executiveExperienceDirectorRuntimeIntegrationContractsDependencyIdentity,
    dependencyPath:
      executiveExperienceDirectorRuntimeIntegrationContractsDependencyPath,
    principle: EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_CONTRACTS_PRINCIPLE,
    contractFamilies: EXECUTIVE_DIRECTOR_RUNTIME_CONTRACT_FAMILIES,
    contractFamilyCount: EXECUTIVE_DIRECTOR_RUNTIME_CONTRACT_FAMILIES.length,
    requestKinds: EXECUTIVE_DIRECTOR_RUNTIME_REQUEST_KINDS,
    requestKindCount: EXECUTIVE_DIRECTOR_RUNTIME_REQUEST_KINDS.length,
    responseStatuses: EXECUTIVE_DIRECTOR_RUNTIME_RESPONSE_STATUSES,
    responseStatusCount: EXECUTIVE_DIRECTOR_RUNTIME_RESPONSE_STATUSES.length,
    runtimeDirectionKinds: EXECUTIVE_RUNTIME_DIRECTION_KINDS,
    runtimeDirectionKindCount: EXECUTIVE_RUNTIME_DIRECTION_KINDS.length,
    integrationDirections:
      EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_DIRECTIONS,
    integrationDirectionCount:
      EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_DIRECTIONS.length,
    surfaces: EXECUTIVE_EXPERIENCE_SURFACES,
    surfaceCount: EXECUTIVE_EXPERIENCE_SURFACES.length,
    presentationStates: EXECUTIVE_PRESENTATION_STATES,
    presentationStateCount: EXECUTIVE_PRESENTATION_STATES.length,
    interactionKinds: EXECUTIVE_INTERACTION_KINDS,
    interactionKindCount: EXECUTIVE_INTERACTION_KINDS.length,
    focusDirectionRoles: EXECUTIVE_FOCUS_DIRECTION_ROLES,
    focusDirectionRoleCount: EXECUTIVE_FOCUS_DIRECTION_ROLES.length,
    attentionDirectionLevels: EXECUTIVE_ATTENTION_DIRECTION_LEVELS,
    attentionDirectionLevelCount: EXECUTIVE_ATTENTION_DIRECTION_LEVELS.length,
    boundaryGuarantees:
      EXECUTIVE_DIRECTOR_RUNTIME_CONTRACT_BOUNDARY_GUARANTEES,
    boundaryGuaranteeCount:
      EXECUTIVE_DIRECTOR_RUNTIME_CONTRACT_BOUNDARY_GUARANTEES.length,
    forbiddenResponsibilities:
      EXECUTIVE_DIRECTOR_RUNTIME_CONTRACT_FORBIDDEN_RESPONSIBILITIES,
    forbiddenResponsibilityCount:
      EXECUTIVE_DIRECTOR_RUNTIME_CONTRACT_FORBIDDEN_RESPONSIBILITIES.length,
    validators:
      executiveExperienceDirectorRuntimeIntegrationContractsValidatorNames,
    validatorCount:
      executiveExperienceDirectorRuntimeIntegrationContractsValidatorNames
        .length,
    constructionHelpers:
      executiveExperienceDirectorRuntimeIntegrationContractsConstructionHelperNames,
    constructionHelperCount:
      executiveExperienceDirectorRuntimeIntegrationContractsConstructionHelperNames
        .length,
    registrySections:
      EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_CONTRACT_REGISTRY_SECTIONS,
    registrySectionCount:
      EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_CONTRACT_REGISTRY_SECTIONS.length,
    publicTypes:
      EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_CONTRACT_PUBLIC_TYPE_NAMES,
    publicTypeCount:
      EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_CONTRACT_PUBLIC_TYPE_NAMES.length,
    publicApis:
      executiveExperienceDirectorRuntimeIntegrationContractsApiNames,
    publicApiCount:
      executiveExperienceDirectorRuntimeIntegrationContractsApiNames.length,
  });

export const executiveExperienceDirectorRuntimeIntegrationContracts =
  Object.freeze({
    phase: "EX-DRI-2" as const,
    name: "ExecutiveExperienceDirectorRuntimeIntegrationContracts" as const,
    identity:
      executiveExperienceDirectorRuntimeIntegrationContractsIdentity,
    version:
      executiveExperienceDirectorRuntimeIntegrationContractsVersion,
    namespace:
      executiveExperienceDirectorRuntimeIntegrationContractsNamespace,
    architecturalRole:
      executiveExperienceDirectorRuntimeIntegrationContractsArchitecturalRole,
    role: "Contracts" as const,
    stage: "Contracts" as const,
    status: "ContractsReady" as const,
    upstreamDependency:
      executiveExperienceDirectorRuntimeIntegrationContractsDependencyIdentity,
    dependencyPath:
      executiveExperienceDirectorRuntimeIntegrationContractsDependencyPath,
    contractDirectionality:
      executiveExperienceDirectorRuntimeIntegrationContractsContractDirectionality,
    deterministic:
      executiveExperienceDirectorRuntimeIntegrationContractsDeterministic,
    immutable: true as const,
    sideEffectFree: true as const,
    frameworkIndependent: true as const,
    rendererIndependent: true as const,
    browserIndependent: true as const,
    principle: EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_CONTRACTS_PRINCIPLE,
    contractFamilies: EXECUTIVE_DIRECTOR_RUNTIME_CONTRACT_FAMILIES,
    requestKinds: EXECUTIVE_DIRECTOR_RUNTIME_REQUEST_KINDS,
    responseStatuses: EXECUTIVE_DIRECTOR_RUNTIME_RESPONSE_STATUSES,
    runtimeDirectionKinds: EXECUTIVE_RUNTIME_DIRECTION_KINDS,
    integrationDirections:
      EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_DIRECTIONS,
    surfaces: EXECUTIVE_EXPERIENCE_SURFACES,
    presentationStates: EXECUTIVE_PRESENTATION_STATES,
    boundaryGuarantees:
      EXECUTIVE_DIRECTOR_RUNTIME_CONTRACT_BOUNDARY_GUARANTEES,
    forbiddenResponsibilities:
      EXECUTIVE_DIRECTOR_RUNTIME_CONTRACT_FORBIDDEN_RESPONSIBILITIES,
    publicApiSurface:
      executiveExperienceDirectorRuntimeIntegrationContractsApiNames,
    publicTypes:
      EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_CONTRACT_PUBLIC_TYPE_NAMES,
    registry:
      executiveExperienceDirectorRuntimeIntegrationContractsRegistry,
    foundationBoundary: "EX-DRI-1-foundation-only" as const,
    architecturalStatus:
      "Contracts Complete · Deterministic · Immutable · Framework-Independent · ReadyForExDriContextStateBinding" as const,
  });

// ─── Verification ───────────────────────────────────────────────────────────

export interface ExecutiveExperienceDirectorRuntimeIntegrationContractsVerification {
  readonly ok: boolean;
  readonly identity: typeof executiveExperienceDirectorRuntimeIntegrationContractsIdentity;
  readonly version: typeof executiveExperienceDirectorRuntimeIntegrationContractsVersion;
  readonly namespace: typeof executiveExperienceDirectorRuntimeIntegrationContractsNamespace;
  readonly architecturalRole: typeof executiveExperienceDirectorRuntimeIntegrationContractsArchitecturalRole;
  readonly dependencyIdentity: typeof executiveExperienceDirectorRuntimeIntegrationContractsDependencyIdentity;
  readonly contractFamilyCount: number;
  readonly requestKindCount: number;
  readonly responseStatusCount: number;
  readonly runtimeDirectionKindCount: number;
  readonly boundaryGuaranteeCount: number;
  readonly validatorCount: number;
  readonly constructionHelperCount: number;
  readonly registrySectionCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly frozen: boolean;
  readonly foundationBoundaryIntact: boolean;
  readonly frameworkIndependent: boolean;
  readonly directionIntegrity: boolean;
  readonly presentationStatesCompatible: boolean;
  readonly surfacesCompatible: boolean;
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

export function verifyExecutiveExperienceDirectorRuntimeIntegrationContracts():
  ExecutiveExperienceDirectorRuntimeIntegrationContractsVerification {
  const contracts =
    executiveExperienceDirectorRuntimeIntegrationContracts;
  const registry =
    executiveExperienceDirectorRuntimeIntegrationContractsRegistry;

  const identityOk =
    contracts.identity ===
      "EX-DRI-2/ExecutiveExperienceDirectorRuntimeIntegrationContracts" &&
    contracts.version === "1.2.0" &&
    contracts.namespace === "nexora.ex.dri.integration.contracts" &&
    contracts.architecturalRole ===
      "ExecutiveExperienceDirectorRuntimeContractBoundary" &&
    contracts.role === "Contracts" &&
    contracts.status === "ContractsReady" &&
    contracts.upstreamDependency ===
      "EX-DRI-1/ExecutiveExperienceDirectorRuntimeIntegrationFoundation" &&
    contracts.upstreamDependency ===
      executiveExperienceDirectorRuntimeIntegrationFoundationIdentity &&
    registry.dependencyIdentity === contracts.upstreamDependency &&
    contracts.foundationBoundary === "EX-DRI-1-foundation-only";

  const dependencyOk =
    contracts.dependencyPath ===
      "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeIntegrationFoundation";

  const familyOk =
    exactOrder(EXECUTIVE_DIRECTOR_RUNTIME_CONTRACT_FAMILIES, [
      "context",
      "subject",
      "interaction",
      "request",
      "scene",
      "focus",
      "attention",
      "presentation",
      "guidance",
      "coordination",
      "response",
      "correlation",
    ]) && unique([...EXECUTIVE_DIRECTOR_RUNTIME_CONTRACT_FAMILIES]);

  const directionIntegrity =
    exactOrder(EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_DIRECTIONS, [
      "ex-to-dri",
      "dri-to-ex",
    ]) &&
    contracts.contractDirectionality === "bidirectional-separated";

  const requestKindOk = exactOrder(EXECUTIVE_DIRECTOR_RUNTIME_REQUEST_KINDS, [
    "context",
    "interaction",
    "context-interaction",
  ]);

  const responseStatusOk = exactOrder(
    EXECUTIVE_DIRECTOR_RUNTIME_RESPONSE_STATUSES,
    ["resolved", "partial", "rejected", "noop"],
  );

  const runtimeDirectionOk = exactOrder(EXECUTIVE_RUNTIME_DIRECTION_KINDS, [
    "scene",
    "focus",
    "attention",
    "presentation",
    "guidance",
    "interaction",
    "coordination",
  ]);

  const presentationStatesCompatible = exactOrder(
    EXECUTIVE_PRESENTATION_STATES,
    ["minimum", "report", "operation"],
  );

  const surfacesCompatible = exactOrder(EXECUTIVE_EXPERIENCE_SURFACES, [
    "stage",
    "advisor",
    "insight",
    "live-lens",
    "timeline",
    "explorer",
  ]);

  const boundaryOk =
    EXECUTIVE_DIRECTOR_RUNTIME_CONTRACT_BOUNDARY_GUARANTEES.length === 18 &&
    unique(
      EXECUTIVE_DIRECTOR_RUNTIME_CONTRACT_BOUNDARY_GUARANTEES.map(
        (entry) => entry.id,
      ),
    ) &&
    EXECUTIVE_DIRECTOR_RUNTIME_CONTRACT_BOUNDARY_GUARANTEES.every(
      (entry, index) => entry.order === index + 1,
    );

  const registryIntegrityOk =
    registry.contractFamilyCount ===
      EXECUTIVE_DIRECTOR_RUNTIME_CONTRACT_FAMILIES.length &&
    registry.requestKindCount ===
      EXECUTIVE_DIRECTOR_RUNTIME_REQUEST_KINDS.length &&
    registry.responseStatusCount ===
      EXECUTIVE_DIRECTOR_RUNTIME_RESPONSE_STATUSES.length &&
    registry.runtimeDirectionKindCount ===
      EXECUTIVE_RUNTIME_DIRECTION_KINDS.length &&
    registry.boundaryGuaranteeCount ===
      EXECUTIVE_DIRECTOR_RUNTIME_CONTRACT_BOUNDARY_GUARANTEES.length &&
    registry.validatorCount ===
      executiveExperienceDirectorRuntimeIntegrationContractsValidatorNames
        .length &&
    registry.constructionHelperCount ===
      executiveExperienceDirectorRuntimeIntegrationContractsConstructionHelperNames
        .length &&
    registry.registrySectionCount ===
      EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_CONTRACT_REGISTRY_SECTIONS
        .length &&
    registry.publicTypeCount ===
      EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_CONTRACT_PUBLIC_TYPE_NAMES
        .length &&
    registry.publicApiCount ===
      executiveExperienceDirectorRuntimeIntegrationContractsApiNames.length &&
    exactOrder(
      [
        ...EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_CONTRACT_REGISTRY_SECTIONS,
      ],
      [
        "Identity",
        "ContractFamilies",
        "RequestContracts",
        "ResponseContracts",
        "RuntimeDirections",
        "Validation",
        "Compatibility",
        "BoundaryRules",
      ],
    ) &&
    unique([
      ...executiveExperienceDirectorRuntimeIntegrationContractsValidatorNames,
    ]);

  const immutabilityOk =
    Object.isFrozen(contracts) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(
      executiveExperienceDirectorRuntimeIntegrationContractsCanonicalIdentity,
    ) &&
    Object.isFrozen(EXECUTIVE_DIRECTOR_RUNTIME_CONTRACT_FAMILIES) &&
    Object.isFrozen(EXECUTIVE_DIRECTOR_RUNTIME_REQUEST_KINDS) &&
    Object.isFrozen(EXECUTIVE_DIRECTOR_RUNTIME_RESPONSE_STATUSES) &&
    Object.isFrozen(EXECUTIVE_FOCUS_DIRECTION_ROLES) &&
    Object.isFrozen(EXECUTIVE_ATTENTION_DIRECTION_LEVELS) &&
    Object.isFrozen(
      EXECUTIVE_DIRECTOR_RUNTIME_CONTRACT_BOUNDARY_GUARANTEES,
    ) &&
    Object.isFrozen(
      EXECUTIVE_DIRECTOR_RUNTIME_CONTRACT_FORBIDDEN_RESPONSIBILITIES,
    ) &&
    Object.isFrozen(
      EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_CONTRACT_REGISTRY_SECTIONS,
    );

  const foundationBoundaryIntact =
    contracts.upstreamDependency ===
      "EX-DRI-1/ExecutiveExperienceDirectorRuntimeIntegrationFoundation" &&
    contracts.foundationBoundary === "EX-DRI-1-foundation-only";

  const frameworkIndependent =
    contracts.frameworkIndependent === true &&
    contracts.rendererIndependent === true &&
    contracts.browserIndependent === true;

  const ok =
    identityOk &&
    dependencyOk &&
    familyOk &&
    directionIntegrity &&
    requestKindOk &&
    responseStatusOk &&
    runtimeDirectionOk &&
    presentationStatesCompatible &&
    surfacesCompatible &&
    boundaryOk &&
    registryIntegrityOk &&
    immutabilityOk &&
    foundationBoundaryIntact &&
    frameworkIndependent &&
    contracts.principle ===
      EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_CONTRACTS_PRINCIPLE;

  return Object.freeze({
    ok,
    identity:
      executiveExperienceDirectorRuntimeIntegrationContractsIdentity,
    version:
      executiveExperienceDirectorRuntimeIntegrationContractsVersion,
    namespace:
      executiveExperienceDirectorRuntimeIntegrationContractsNamespace,
    architecturalRole:
      executiveExperienceDirectorRuntimeIntegrationContractsArchitecturalRole,
    dependencyIdentity:
      executiveExperienceDirectorRuntimeIntegrationContractsDependencyIdentity,
    contractFamilyCount: EXECUTIVE_DIRECTOR_RUNTIME_CONTRACT_FAMILIES.length,
    requestKindCount: EXECUTIVE_DIRECTOR_RUNTIME_REQUEST_KINDS.length,
    responseStatusCount: EXECUTIVE_DIRECTOR_RUNTIME_RESPONSE_STATUSES.length,
    runtimeDirectionKindCount: EXECUTIVE_RUNTIME_DIRECTION_KINDS.length,
    boundaryGuaranteeCount:
      EXECUTIVE_DIRECTOR_RUNTIME_CONTRACT_BOUNDARY_GUARANTEES.length,
    validatorCount:
      executiveExperienceDirectorRuntimeIntegrationContractsValidatorNames
        .length,
    constructionHelperCount:
      executiveExperienceDirectorRuntimeIntegrationContractsConstructionHelperNames
        .length,
    registrySectionCount:
      EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_CONTRACT_REGISTRY_SECTIONS
        .length,
    publicTypeCount:
      EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_CONTRACT_PUBLIC_TYPE_NAMES
        .length,
    publicApiCount:
      executiveExperienceDirectorRuntimeIntegrationContractsApiNames.length,
    frozen: immutabilityOk,
    foundationBoundaryIntact,
    frameworkIndependent,
    directionIntegrity,
    presentationStatesCompatible,
    surfacesCompatible,
  });
}
