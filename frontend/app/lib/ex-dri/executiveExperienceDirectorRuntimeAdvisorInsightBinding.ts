/**
 * EX-DRI-6 — Executive Experience ↔ Director Runtime Advisor & Insight Binding.
 *
 * Pure DRI → EX Advisor & Insight binding layer that converts Director Runtime
 * guidance and coordination directions into renderer-independent Executive
 * Experience projections for the Advisor and Insight surfaces.
 *
 * DRI decides what guidance or insight context matters.
 * EX-DRI-6 translates that runtime direction into semantic Advisor/Insight projections.
 * The Executive Experience renderer/content layer decides how those projections are displayed.
 *
 * No AI / natural-language generation / UI mutation / KPI-KOI calculation.
 */

import {
  EXECUTIVE_SCENE_PRESENTATION_BINDING_PRESENTATION_STATES,
  EXECUTIVE_SCENE_PRESENTATION_BINDING_SURFACES,
  areExecutiveScenePresentationProjectionsEqual,
  bindDirectorRuntimeDirectionsToExecutiveScenePresentation,
  bindDirectorRuntimeResponseToExecutiveScenePresentation,
  bindExecutiveExperienceCompositeState,
  bindExecutiveInteractionToDirectorRuntimeRequest,
  createExecutiveDirectorRuntimeCorrelation,
  createExecutiveDirectorRuntimeRequest,
  createExecutiveDirectorRuntimeResponse,
  createExecutiveDirectorRuntimeSubjectContract,
  createExecutiveRuntimeDirectionContract,
  diffExecutiveScenePresentationProjection,
  executiveExperienceDirectorRuntimeScenePresentationBindingIdentity,
  isExecutiveCoordinationDirectionContract,
  isExecutiveDirectorRuntimeCorrelation,
  isExecutiveDirectorRuntimeRequestContract,
  isExecutiveDirectorRuntimeResponseContract,
  isExecutiveDirectorRuntimeSubjectContract,
  isExecutiveExperienceCompositeStateSnapshot,
  isExecutiveGuidanceDirectionContract,
  isExecutiveRuntimeDirectionContract,
  isExecutiveScenePresentationBindingResult,
  isExecutiveScenePresentationProjection,
  normalizeExecutiveExperienceCompositeState,
  type ExecutiveDirectorRuntimeCorrelation,
  type ExecutiveDirectorRuntimeRequestContract,
  type ExecutiveDirectorRuntimeResponseContract,
  type ExecutiveDirectorRuntimeSubjectContract,
  type ExecutiveExperienceCompositeStateSnapshot,
  type ExecutiveExperienceContextBindingResult,
  type ExecutiveExperienceSurface,
  type ExecutiveInteractionBindingInput,
  type ExecutiveInteractionBindingResult,
  type ExecutiveInteractionKind,
  type ExecutivePresentationState,
  type ExecutiveRuntimeDirectionContract,
  type ExecutiveScenePresentationBindingResult,
  type ExecutiveScenePresentationDiff,
  type ExecutiveScenePresentationProjection,
} from "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeScenePresentationBinding";

/**
 * Additive re-export surface for EX-DRI-7 Integration Platform.
 * Preserves EX-DRI-6 as the sole immediate dependency boundary.
 */
export type {
  ExecutiveDirectorRuntimeCorrelation,
  ExecutiveDirectorRuntimeRequestContract,
  ExecutiveDirectorRuntimeResponseContract,
  ExecutiveDirectorRuntimeSubjectContract,
  ExecutiveExperienceCompositeStateSnapshot,
  ExecutiveExperienceContextBindingResult,
  ExecutiveInteractionBindingInput,
  ExecutiveInteractionBindingResult,
  ExecutiveInteractionKind,
  ExecutivePresentationState,
  ExecutiveRuntimeDirectionContract,
  ExecutiveScenePresentationBindingResult,
  ExecutiveScenePresentationDiff,
  ExecutiveScenePresentationProjection,
};

export {
  EXECUTIVE_SCENE_PRESENTATION_BINDING_PRESENTATION_STATES,
  EXECUTIVE_SCENE_PRESENTATION_BINDING_SURFACES,
  areExecutiveScenePresentationProjectionsEqual,
  bindDirectorRuntimeDirectionsToExecutiveScenePresentation,
  bindDirectorRuntimeResponseToExecutiveScenePresentation,
  bindExecutiveExperienceCompositeState,
  bindExecutiveInteractionToDirectorRuntimeRequest,
  createExecutiveDirectorRuntimeCorrelation,
  createExecutiveDirectorRuntimeRequest,
  createExecutiveDirectorRuntimeResponse,
  createExecutiveDirectorRuntimeSubjectContract,
  createExecutiveRuntimeDirectionContract,
  diffExecutiveScenePresentationProjection,
  isExecutiveDirectorRuntimeCorrelation,
  isExecutiveDirectorRuntimeRequestContract,
  isExecutiveDirectorRuntimeResponseContract,
  isExecutiveDirectorRuntimeSubjectContract,
  isExecutiveExperienceCompositeStateSnapshot,
  isExecutiveRuntimeDirectionContract,
  isExecutiveScenePresentationBindingResult,
  isExecutiveScenePresentationProjection,
  normalizeExecutiveExperienceCompositeState,
};

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveExperienceDirectorRuntimeAdvisorInsightBindingIdentity =
  "EX-DRI-6/ExecutiveExperienceDirectorRuntimeAdvisorInsightBinding" as const;

export const executiveExperienceDirectorRuntimeAdvisorInsightBindingVersion =
  "1.6.0" as const;

export const executiveExperienceDirectorRuntimeAdvisorInsightBindingNamespace =
  "nexora.ex.dri.integration.advisor-insight-binding" as const;

export const executiveExperienceDirectorRuntimeAdvisorInsightBindingArchitecturalRole =
  "ExecutiveExperienceDirectorRuntimeAdvisorInsightBinding" as const;

export const executiveExperienceDirectorRuntimeAdvisorInsightBindingDependencyIdentity =
  executiveExperienceDirectorRuntimeScenePresentationBindingIdentity;

export const executiveExperienceDirectorRuntimeAdvisorInsightBindingDependencyPath =
  "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeScenePresentationBinding" as const;

export const executiveExperienceDirectorRuntimeAdvisorInsightBindingDirection =
  "dri-direction-to-ex-advisor-insight-projection" as const;

export const executiveExperienceDirectorRuntimeAdvisorInsightBindingDeterministic =
  true as const;

export const executiveExperienceDirectorRuntimeAdvisorInsightBindingStateless =
  true as const;

export const executiveExperienceDirectorRuntimeAdvisorInsightBindingRendererIndependent =
  true as const;

export const executiveExperienceDirectorRuntimeAdvisorInsightBindingContentGenerationPolicy =
  "no-content-generation" as const;

export const executiveExperienceDirectorRuntimeAdvisorInsightBindingMutationPolicy =
  "immutable" as const;

export const executiveExperienceDirectorRuntimeAdvisorInsightBindingSideEffectPolicy =
  "side-effect-free" as const;

export const executiveExperienceDirectorRuntimeAdvisorInsightBindingCanonicalIdentity =
  Object.freeze({
    identity:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingIdentity,
    version:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingVersion,
    namespace:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingNamespace,
    architecturalRole:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingArchitecturalRole,
    dependencyIdentity:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingDependencyIdentity,
    bindingDirection:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingDirection,
    deterministicStatus:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingDeterministic,
    statelessStatus:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingStateless,
    rendererIndependenceStatus:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingRendererIndependent,
    contentGenerationPolicy:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingContentGenerationPolicy,
    mutationPolicy:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingMutationPolicy,
    sideEffectPolicy:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingSideEffectPolicy,
  });

export const EXECUTIVE_ADVISOR_INSIGHT_BINDING_PRINCIPLE =
  "DRI decides what guidance or insight context matters. EX-DRI-6 translates that runtime direction into semantic Advisor/Insight projections. The Executive Experience renderer/content layer decides how those projections are displayed." as const;

// ─── Vocabulary ─────────────────────────────────────────────────────────────

export const EXECUTIVE_ADVISOR_INSIGHT_BINDING_SURFACES =
  Object.freeze([
    "stage",
    "advisor",
    "insight",
    "live-lens",
    "timeline",
    "explorer",
  ] as const);

export type { ExecutiveExperienceSurface };

export const EXECUTIVE_ADVISOR_INSIGHT_TARGET_SURFACES = Object.freeze([
  "advisor",
  "insight",
] as const);

export type ExecutiveAdvisorInsightTargetSurface =
  (typeof EXECUTIVE_ADVISOR_INSIGHT_TARGET_SURFACES)[number];

export const EXECUTIVE_ADVISOR_INSIGHT_SUPPORTED_DIRECTION_KINDS =
  Object.freeze(["guidance", "coordination"] as const);

export type ExecutiveAdvisorInsightSupportedDirectionKind =
  (typeof EXECUTIVE_ADVISOR_INSIGHT_SUPPORTED_DIRECTION_KINDS)[number];

export const EXECUTIVE_ADVISOR_INSIGHT_DEFERRED_TO_EX_DRI_5_DIRECTION_KINDS =
  Object.freeze([
    "scene",
    "focus",
    "attention",
    "presentation",
  ] as const);

export const EXECUTIVE_ADVISOR_INSIGHT_DEFERRED_DIRECTION_KINDS =
  Object.freeze([
    "scene",
    "focus",
    "attention",
    "presentation",
    "interaction",
  ] as const);

export type ExecutiveAdvisorInsightDeferredDirectionKind =
  (typeof EXECUTIVE_ADVISOR_INSIGHT_DEFERRED_DIRECTION_KINDS)[number];

export const EXECUTIVE_ADVISOR_INSIGHT_DIRECTION_SUPPORT_VALUES =
  Object.freeze(["supported", "deferred", "unsupported"] as const);

export type ExecutiveAdvisorInsightDirectionSupport =
  (typeof EXECUTIVE_ADVISOR_INSIGHT_DIRECTION_SUPPORT_VALUES)[number];

export const EXECUTIVE_ADVISOR_GUIDANCE_ROLES = Object.freeze([
  "orient",
  "explain",
  "recommend",
  "warn",
  "clarify",
  "next-action",
] as const);

export type ExecutiveAdvisorGuidanceRole =
  (typeof EXECUTIVE_ADVISOR_GUIDANCE_ROLES)[number];

export const EXECUTIVE_INSIGHT_ROLES = Object.freeze([
  "evidence",
  "metric",
  "relationship",
  "impact",
  "comparison",
  "context",
] as const);

export type ExecutiveInsightRole = (typeof EXECUTIVE_INSIGHT_ROLES)[number];

export const EXECUTIVE_ADVISOR_INSIGHT_BINDING_STATUSES = Object.freeze([
  "bound",
  "partial",
  "rejected",
  "noop",
] as const);

export type ExecutiveAdvisorInsightBindingStatus =
  (typeof EXECUTIVE_ADVISOR_INSIGHT_BINDING_STATUSES)[number];

export const EXECUTIVE_ADVISOR_INSIGHT_CHANGE_KINDS = Object.freeze([
  "advisor-guidance",
  "advisor-coordination",
  "insight-content",
  "insight-coordination",
] as const);

export type ExecutiveAdvisorInsightChangeKind =
  (typeof EXECUTIVE_ADVISOR_INSIGHT_CHANGE_KINDS)[number];

export const EXECUTIVE_ADVISOR_INSIGHT_BINDING_ISSUE_CODES = Object.freeze([
  "INVALID_GUIDANCE_DIRECTION",
  "INVALID_COORDINATION_DIRECTION",
  "INVALID_ADVISOR_TARGET",
  "INVALID_INSIGHT_TARGET",
  "INVALID_SUBJECT",
  "SUBJECT_IDENTITY_CONFLICT",
  "DUPLICATE_GUIDANCE_DIRECTION",
  "CONFLICTING_GUIDANCE_ROLE",
  "INVALID_MESSAGE_KEY",
  "INVALID_INSIGHT_KEY",
  "INVALID_RUNTIME_RESPONSE",
  "UNSUPPORTED_DIRECTION",
  "INVALID_COORDINATION_TARGET",
  "DUPLICATE_COORDINATION_TARGET",
] as const);

export type ExecutiveAdvisorInsightBindingIssueCode =
  (typeof EXECUTIVE_ADVISOR_INSIGHT_BINDING_ISSUE_CODES)[number];

// ─── Projection contracts ───────────────────────────────────────────────────

export interface ExecutiveAdvisorProjection {
  readonly surface: "advisor";
  readonly subject?: ExecutiveDirectorRuntimeSubjectContract;
  readonly guidanceRole?: ExecutiveAdvisorGuidanceRole;
  readonly messageKey?: string;
  readonly sourceSurface?: ExecutiveExperienceSurface;
}

export interface ExecutiveInsightProjection {
  readonly surface: "insight";
  readonly subject?: ExecutiveDirectorRuntimeSubjectContract;
  readonly insightRole?: ExecutiveInsightRole;
  readonly insightKey?: string;
  readonly sourceSurface?: ExecutiveExperienceSurface;
}

export interface ExecutiveAdvisorCoordinationProjection {
  readonly surface: "advisor";
  readonly sourceSurface: ExecutiveExperienceSurface;
  readonly subject?: ExecutiveDirectorRuntimeSubjectContract;
}

export interface ExecutiveInsightCoordinationProjection {
  readonly surface: "insight";
  readonly sourceSurface: ExecutiveExperienceSurface;
  readonly subject?: ExecutiveDirectorRuntimeSubjectContract;
}

export interface ExecutiveAdvisorCompositeProjection {
  readonly guidance: ReadonlyArray<ExecutiveAdvisorProjection>;
  readonly coordination: ReadonlyArray<ExecutiveAdvisorCoordinationProjection>;
}

export interface ExecutiveInsightCompositeProjection {
  readonly insights: ReadonlyArray<ExecutiveInsightProjection>;
  readonly coordination: ReadonlyArray<ExecutiveInsightCoordinationProjection>;
}

export interface ExecutiveAdvisorInsightProjection {
  readonly advisor: ExecutiveAdvisorCompositeProjection;
  readonly insight: ExecutiveInsightCompositeProjection;
}

export interface ExecutiveAdvisorInsightBindingIssue {
  readonly code: ExecutiveAdvisorInsightBindingIssueCode;
  readonly path?: string;
  readonly message: string;
}

export interface ExecutiveAdvisorInsightBindingResult {
  readonly status: ExecutiveAdvisorInsightBindingStatus;
  readonly projection?: ExecutiveAdvisorInsightProjection;
  readonly issues: ReadonlyArray<ExecutiveAdvisorInsightBindingIssue>;
  readonly deferredDirections: ReadonlyArray<ExecutiveRuntimeDirectionContract>;
}

export interface ExecutiveAdvisorInsightDiff {
  readonly changed: boolean;
  readonly changes: ReadonlyArray<ExecutiveAdvisorInsightChangeKind>;
}

export interface ExecutiveAdvisorInsightCoordinationTargets {
  readonly ownedTargets: ReadonlyArray<ExecutiveAdvisorInsightTargetSurface>;
  readonly deferredTargets: ReadonlyArray<ExecutiveExperienceSurface>;
}

// ─── Guarantees ─────────────────────────────────────────────────────────────

export const EXECUTIVE_ADVISOR_INSIGHT_BINDING_GUARANTEES = Object.freeze([
  Object.freeze({ id: "dri-authoritative-guidance", order: 1, statement: "DRI remains authoritative for guidance direction." }),
  Object.freeze({ id: "dri-authoritative-coordination", order: 2, statement: "DRI remains authoritative for cross-surface coordination." }),
  Object.freeze({ id: "ex-dri-6-binding-only", order: 3, statement: "EX-DRI-6 only binds semantic output." }),
  Object.freeze({ id: "advisor-renderer-independent", order: 4, statement: "Advisor projection is renderer-independent." }),
  Object.freeze({ id: "insight-renderer-independent", order: 5, statement: "Insight projection is renderer-independent." }),
  Object.freeze({ id: "no-natural-language-advice", order: 6, statement: "No natural-language advice is generated." }),
  Object.freeze({ id: "no-ai-model-called", order: 7, statement: "No AI model is called." }),
  Object.freeze({ id: "no-prompt-constructed", order: 8, statement: "No prompt is constructed." }),
  Object.freeze({ id: "no-react-objects", order: 9, statement: "No React object crosses the boundary." }),
  Object.freeze({ id: "no-dom-objects", order: 10, statement: "No DOM object crosses the boundary." }),
  Object.freeze({ id: "no-threejs-objects", order: 11, statement: "No Three.js object crosses the boundary." }),
  Object.freeze({ id: "no-ui-mutation", order: 12, statement: "No UI mutation occurs." }),
  Object.freeze({ id: "no-panel-state", order: 13, statement: "No panel state is changed." }),
  Object.freeze({ id: "no-chart-rendered", order: 14, statement: "No chart is rendered." }),
  Object.freeze({ id: "no-kpi-calculation", order: 15, statement: "No KPI is calculated." }),
  Object.freeze({ id: "no-koi-calculation", order: 16, statement: "No KOI is calculated." }),
  Object.freeze({ id: "subject-identity-preserved", order: 17, statement: "Subject identity is preserved." }),
  Object.freeze({ id: "advisor-insight-distinct-subjects", order: 18, statement: "Advisor and Insight may use distinct subjects." }),
  Object.freeze({ id: "multiple-guidance-allowed", order: 19, statement: "Multiple guidance directions may coexist." }),
  Object.freeze({ id: "direction-ordering-preserved", order: 20, statement: "Direction ordering is preserved." }),
  Object.freeze({ id: "deferred-directions-explicit", order: 21, statement: "Deferred directions are explicit." }),
  Object.freeze({ id: "unsupported-directions-explicit", order: 22, statement: "Unsupported directions are explicit." }),
  Object.freeze({ id: "binding-deterministic", order: 23, statement: "Binding is deterministic." }),
  Object.freeze({ id: "binding-stateless", order: 24, statement: "Binding is stateless." }),
  Object.freeze({ id: "inputs-never-mutated", order: 25, statement: "Inputs are never mutated." }),
  Object.freeze({ id: "outputs-immutable", order: 26, statement: "Outputs are immutable." }),
  Object.freeze({ id: "runtime-response-status-preserved", order: 27, statement: "Runtime response status is preserved." }),
  Object.freeze({ id: "keys-remain-semantic", order: 28, statement: "Message/insight keys remain semantic." }),
  Object.freeze({ id: "content-generation-outside", order: 29, statement: "Content generation occurs outside EX-DRI-6." }),
  Object.freeze({ id: "no-reasoning-engine", order: 30, statement: "EX-DRI-6 contains no reasoning engine." }),
] as const);

export type ExecutiveAdvisorInsightBindingGuarantee =
  (typeof EXECUTIVE_ADVISOR_INSIGHT_BINDING_GUARANTEES)[number];

// ─── Internal helpers ───────────────────────────────────────────────────────

type PlainObject = Record<string, unknown>;

function isPlainObject(value: unknown): value is PlainObject {
  if (value === null || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function isSurface(value: unknown): value is ExecutiveExperienceSurface {
  return (EXECUTIVE_ADVISOR_INSIGHT_BINDING_SURFACES as readonly unknown[]).includes(
    value,
  );
}

function isAdvisorGuidanceRole(
  value: unknown,
): value is ExecutiveAdvisorGuidanceRole {
  return (EXECUTIVE_ADVISOR_GUIDANCE_ROLES as readonly unknown[]).includes(value);
}

function isInsightRole(value: unknown): value is ExecutiveInsightRole {
  return (EXECUTIVE_INSIGHT_ROLES as readonly unknown[]).includes(value);
}

function isSemanticKey(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
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

function issue(
  code: ExecutiveAdvisorInsightBindingIssueCode,
  message: string,
  path?: string,
): ExecutiveAdvisorInsightBindingIssue {
  return Object.freeze({
    code,
    message,
    ...(path !== undefined ? { path } : {}),
  });
}

function trackSubjectIdentity(
  registry: Map<string, ExecutiveDirectorRuntimeSubjectContract>,
  subject: ExecutiveDirectorRuntimeSubjectContract | undefined,
  issues: ExecutiveAdvisorInsightBindingIssue[],
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
    registry.set(subject.id, subject);
  }
}

function advisorGuidanceIdentity(projection: ExecutiveAdvisorProjection): string {
  return [
    projection.surface,
    projection.subject?.id ?? "",
    projection.subject?.kind ?? "",
    projection.guidanceRole ?? "",
    projection.messageKey ?? "",
    projection.sourceSurface ?? "",
  ].join("|");
}

function insightIdentity(projection: ExecutiveInsightProjection): string {
  return [
    projection.surface,
    projection.subject?.id ?? "",
    projection.subject?.kind ?? "",
    projection.insightRole ?? "",
    projection.insightKey ?? "",
    projection.sourceSurface ?? "",
  ].join("|");
}

function advisorCoordinationIdentity(
  projection: ExecutiveAdvisorCoordinationProjection,
): string {
  return [
    projection.surface,
    projection.sourceSurface,
    projection.subject?.id ?? "",
    projection.subject?.kind ?? "",
  ].join("|");
}

function insightCoordinationIdentity(
  projection: ExecutiveInsightCoordinationProjection,
): string {
  return [
    projection.surface,
    projection.sourceSurface,
    projection.subject?.id ?? "",
    projection.subject?.kind ?? "",
  ].join("|");
}

// ─── Direction support ──────────────────────────────────────────────────────

export function getAdvisorInsightDirectionSupport(
  kind: unknown,
): ExecutiveAdvisorInsightDirectionSupport {
  if (
    (EXECUTIVE_ADVISOR_INSIGHT_SUPPORTED_DIRECTION_KINDS as readonly unknown[]).includes(
      kind,
    )
  ) {
    return "supported";
  }
  if (
    (EXECUTIVE_ADVISOR_INSIGHT_DEFERRED_DIRECTION_KINDS as readonly unknown[]).includes(
      kind,
    )
  ) {
    return "deferred";
  }
  return "unsupported";
}

export function isAdvisorInsightDirectionSupported(kind: unknown): boolean {
  return getAdvisorInsightDirectionSupport(kind) === "supported";
}

export function getAdvisorInsightCoordinationTargets(
  direction: unknown,
): ExecutiveAdvisorInsightCoordinationTargets {
  if (!isExecutiveCoordinationDirectionContract(direction)) {
    throw new TypeError("INVALID_COORDINATION_DIRECTION");
  }

  const owned: ExecutiveAdvisorInsightTargetSurface[] = [];
  const deferred: ExecutiveExperienceSurface[] = [];
  const seenOwned = new Set<ExecutiveAdvisorInsightTargetSurface>();
  const seenDeferred = new Set<ExecutiveExperienceSurface>();

  for (const target of direction.targetSurfaces) {
    if (target === "advisor" || target === "insight") {
      if (!seenOwned.has(target)) {
        seenOwned.add(target);
        owned.push(target);
      }
    } else if (!seenDeferred.has(target)) {
      seenDeferred.add(target);
      deferred.push(target);
    }
  }

  return Object.freeze({
    ownedTargets: Object.freeze(owned),
    deferredTargets: Object.freeze(deferred),
  });
}

// ─── Construction ───────────────────────────────────────────────────────────

export function createExecutiveAdvisorProjection(input: {
  readonly subject?: ExecutiveDirectorRuntimeSubjectContract;
  readonly guidanceRole?: ExecutiveAdvisorGuidanceRole;
  readonly messageKey?: string;
  readonly sourceSurface?: ExecutiveExperienceSurface;
}): ExecutiveAdvisorProjection {
  if (
    input.guidanceRole !== undefined &&
    !isAdvisorGuidanceRole(input.guidanceRole)
  ) {
    throw new TypeError("INVALID_GUIDANCE_DIRECTION");
  }
  if (input.messageKey !== undefined && !isSemanticKey(input.messageKey)) {
    throw new TypeError("INVALID_MESSAGE_KEY");
  }
  if (
    input.subject !== undefined &&
    !isExecutiveDirectorRuntimeSubjectContract(input.subject)
  ) {
    throw new TypeError("INVALID_SUBJECT");
  }
  if (
    input.sourceSurface !== undefined &&
    !isSurface(input.sourceSurface)
  ) {
    throw new TypeError("INVALID_ADVISOR_TARGET");
  }

  return Object.freeze({
    surface: "advisor" as const,
    ...(input.subject !== undefined
      ? { subject: freezeSubject(input.subject) }
      : {}),
    ...(input.guidanceRole !== undefined
      ? { guidanceRole: input.guidanceRole }
      : {}),
    ...(input.messageKey !== undefined ? { messageKey: input.messageKey } : {}),
    ...(input.sourceSurface !== undefined
      ? { sourceSurface: input.sourceSurface }
      : {}),
  });
}

export function createExecutiveInsightProjection(input: {
  readonly subject?: ExecutiveDirectorRuntimeSubjectContract;
  readonly insightRole?: ExecutiveInsightRole;
  readonly insightKey?: string;
  readonly sourceSurface?: ExecutiveExperienceSurface;
}): ExecutiveInsightProjection {
  if (input.insightRole !== undefined && !isInsightRole(input.insightRole)) {
    throw new TypeError("INVALID_GUIDANCE_DIRECTION");
  }
  if (input.insightKey !== undefined && !isSemanticKey(input.insightKey)) {
    throw new TypeError("INVALID_INSIGHT_KEY");
  }
  if (
    input.subject !== undefined &&
    !isExecutiveDirectorRuntimeSubjectContract(input.subject)
  ) {
    throw new TypeError("INVALID_SUBJECT");
  }
  if (
    input.sourceSurface !== undefined &&
    !isSurface(input.sourceSurface)
  ) {
    throw new TypeError("INVALID_INSIGHT_TARGET");
  }

  return Object.freeze({
    surface: "insight" as const,
    ...(input.subject !== undefined
      ? { subject: freezeSubject(input.subject) }
      : {}),
    ...(input.insightRole !== undefined
      ? { insightRole: input.insightRole }
      : {}),
    ...(input.insightKey !== undefined ? { insightKey: input.insightKey } : {}),
    ...(input.sourceSurface !== undefined
      ? { sourceSurface: input.sourceSurface }
      : {}),
  });
}

export function createExecutiveAdvisorCoordinationProjection(input: {
  readonly sourceSurface: ExecutiveExperienceSurface;
  readonly subject?: ExecutiveDirectorRuntimeSubjectContract;
}): ExecutiveAdvisorCoordinationProjection {
  if (!isSurface(input.sourceSurface)) {
    throw new TypeError("INVALID_COORDINATION_DIRECTION");
  }
  if (
    input.subject !== undefined &&
    !isExecutiveDirectorRuntimeSubjectContract(input.subject)
  ) {
    throw new TypeError("INVALID_SUBJECT");
  }
  return Object.freeze({
    surface: "advisor" as const,
    sourceSurface: input.sourceSurface,
    ...(input.subject !== undefined
      ? { subject: freezeSubject(input.subject) }
      : {}),
  });
}

export function createExecutiveInsightCoordinationProjection(input: {
  readonly sourceSurface: ExecutiveExperienceSurface;
  readonly subject?: ExecutiveDirectorRuntimeSubjectContract;
}): ExecutiveInsightCoordinationProjection {
  if (!isSurface(input.sourceSurface)) {
    throw new TypeError("INVALID_COORDINATION_DIRECTION");
  }
  if (
    input.subject !== undefined &&
    !isExecutiveDirectorRuntimeSubjectContract(input.subject)
  ) {
    throw new TypeError("INVALID_SUBJECT");
  }
  return Object.freeze({
    surface: "insight" as const,
    sourceSurface: input.sourceSurface,
    ...(input.subject !== undefined
      ? { subject: freezeSubject(input.subject) }
      : {}),
  });
}

export function createExecutiveAdvisorCompositeProjection(input: {
  readonly guidance?: ReadonlyArray<ExecutiveAdvisorProjection>;
  readonly coordination?: ReadonlyArray<ExecutiveAdvisorCoordinationProjection>;
}): ExecutiveAdvisorCompositeProjection {
  return Object.freeze({
    guidance: Object.freeze([...(input.guidance ?? [])]),
    coordination: Object.freeze([...(input.coordination ?? [])]),
  });
}

export function createExecutiveInsightCompositeProjection(input: {
  readonly insights?: ReadonlyArray<ExecutiveInsightProjection>;
  readonly coordination?: ReadonlyArray<ExecutiveInsightCoordinationProjection>;
}): ExecutiveInsightCompositeProjection {
  return Object.freeze({
    insights: Object.freeze([...(input.insights ?? [])]),
    coordination: Object.freeze([...(input.coordination ?? [])]),
  });
}

export function createExecutiveAdvisorInsightProjection(input: {
  readonly advisor?: ExecutiveAdvisorCompositeProjection;
  readonly insight?: ExecutiveInsightCompositeProjection;
}): ExecutiveAdvisorInsightProjection {
  return Object.freeze({
    advisor:
      input.advisor ??
      createExecutiveAdvisorCompositeProjection({}),
    insight:
      input.insight ??
      createExecutiveInsightCompositeProjection({}),
  });
}

function emptyProjection(): ExecutiveAdvisorInsightProjection {
  return createExecutiveAdvisorInsightProjection({});
}

// ─── Validators ─────────────────────────────────────────────────────────────

export function isExecutiveAdvisorProjection(
  value: unknown,
): value is ExecutiveAdvisorProjection {
  if (!isPlainObject(value)) return false;
  if (value.surface !== "advisor") return false;
  if (
    value.subject !== undefined &&
    !isExecutiveDirectorRuntimeSubjectContract(value.subject)
  ) {
    return false;
  }
  if (
    value.guidanceRole !== undefined &&
    !isAdvisorGuidanceRole(value.guidanceRole)
  ) {
    return false;
  }
  if (value.messageKey !== undefined && !isSemanticKey(value.messageKey)) {
    return false;
  }
  if (
    value.sourceSurface !== undefined &&
    !isSurface(value.sourceSurface)
  ) {
    return false;
  }
  return true;
}

export function isExecutiveInsightProjection(
  value: unknown,
): value is ExecutiveInsightProjection {
  if (!isPlainObject(value)) return false;
  if (value.surface !== "insight") return false;
  if (
    value.subject !== undefined &&
    !isExecutiveDirectorRuntimeSubjectContract(value.subject)
  ) {
    return false;
  }
  if (value.insightRole !== undefined && !isInsightRole(value.insightRole)) {
    return false;
  }
  if (value.insightKey !== undefined && !isSemanticKey(value.insightKey)) {
    return false;
  }
  if (
    value.sourceSurface !== undefined &&
    !isSurface(value.sourceSurface)
  ) {
    return false;
  }
  return true;
}

export function isExecutiveAdvisorCoordinationProjection(
  value: unknown,
): value is ExecutiveAdvisorCoordinationProjection {
  if (!isPlainObject(value)) return false;
  if (value.surface !== "advisor") return false;
  if (!isSurface(value.sourceSurface)) return false;
  if (
    value.subject !== undefined &&
    !isExecutiveDirectorRuntimeSubjectContract(value.subject)
  ) {
    return false;
  }
  return true;
}

export function isExecutiveInsightCoordinationProjection(
  value: unknown,
): value is ExecutiveInsightCoordinationProjection {
  if (!isPlainObject(value)) return false;
  if (value.surface !== "insight") return false;
  if (!isSurface(value.sourceSurface)) return false;
  if (
    value.subject !== undefined &&
    !isExecutiveDirectorRuntimeSubjectContract(value.subject)
  ) {
    return false;
  }
  return true;
}

export function isExecutiveAdvisorCompositeProjection(
  value: unknown,
): value is ExecutiveAdvisorCompositeProjection {
  if (!isPlainObject(value)) return false;
  if (!Array.isArray(value.guidance)) return false;
  if (!Array.isArray(value.coordination)) return false;
  return (
    value.guidance.every(isExecutiveAdvisorProjection) &&
    value.coordination.every(isExecutiveAdvisorCoordinationProjection)
  );
}

export function isExecutiveInsightCompositeProjection(
  value: unknown,
): value is ExecutiveInsightCompositeProjection {
  if (!isPlainObject(value)) return false;
  if (!Array.isArray(value.insights)) return false;
  if (!Array.isArray(value.coordination)) return false;
  return (
    value.insights.every(isExecutiveInsightProjection) &&
    value.coordination.every(isExecutiveInsightCoordinationProjection)
  );
}

export function isExecutiveAdvisorInsightProjection(
  value: unknown,
): value is ExecutiveAdvisorInsightProjection {
  if (!isPlainObject(value)) return false;
  return (
    isExecutiveAdvisorCompositeProjection(value.advisor) &&
    isExecutiveInsightCompositeProjection(value.insight)
  );
}

export function isExecutiveAdvisorInsightBindingResult(
  value: unknown,
): value is ExecutiveAdvisorInsightBindingResult {
  if (!isPlainObject(value)) return false;
  if (
    !(EXECUTIVE_ADVISOR_INSIGHT_BINDING_STATUSES as readonly unknown[]).includes(
      value.status,
    )
  ) {
    return false;
  }
  if (!Array.isArray(value.issues)) return false;
  if (!Array.isArray(value.deferredDirections)) return false;
  if (
    value.projection !== undefined &&
    !isExecutiveAdvisorInsightProjection(value.projection)
  ) {
    return false;
  }
  if (
    !value.deferredDirections.every(isExecutiveRuntimeDirectionContract)
  ) {
    return false;
  }
  return value.issues.every((entry) => {
    if (!isPlainObject(entry)) return false;
    return (
      (EXECUTIVE_ADVISOR_INSIGHT_BINDING_ISSUE_CODES as readonly unknown[]).includes(
        entry.code,
      ) &&
      typeof entry.message === "string" &&
      (entry.path === undefined || typeof entry.path === "string")
    );
  });
}

// ─── Binding helpers ────────────────────────────────────────────────────────

export function bindDirectorRuntimeGuidanceToExecutiveAdvisor(
  direction: unknown,
): ExecutiveAdvisorProjection {
  if (!isExecutiveGuidanceDirectionContract(direction)) {
    throw new TypeError("INVALID_GUIDANCE_DIRECTION");
  }
  if (direction.surface !== "advisor") {
    throw new TypeError("INVALID_ADVISOR_TARGET");
  }
  if (
    direction.guidanceRole !== undefined &&
    !isAdvisorGuidanceRole(direction.guidanceRole)
  ) {
    throw new TypeError("INVALID_GUIDANCE_DIRECTION");
  }
  if (
    direction.messageKey !== undefined &&
    !isSemanticKey(direction.messageKey)
  ) {
    throw new TypeError("INVALID_MESSAGE_KEY");
  }

  return createExecutiveAdvisorProjection({
    ...(direction.subject !== undefined ? { subject: direction.subject } : {}),
    ...(direction.guidanceRole !== undefined
      ? { guidanceRole: direction.guidanceRole }
      : {}),
    ...(direction.messageKey !== undefined
      ? { messageKey: direction.messageKey }
      : {}),
  });
}

export function bindDirectorRuntimeGuidanceToExecutiveInsight(
  direction: unknown,
): ExecutiveInsightProjection {
  if (!isExecutiveGuidanceDirectionContract(direction)) {
    throw new TypeError("INVALID_GUIDANCE_DIRECTION");
  }
  if (direction.surface !== "insight") {
    throw new TypeError("INVALID_INSIGHT_TARGET");
  }
  if (
    direction.guidanceRole !== undefined &&
    !isInsightRole(direction.guidanceRole)
  ) {
    throw new TypeError("INVALID_GUIDANCE_DIRECTION");
  }
  if (
    direction.messageKey !== undefined &&
    !isSemanticKey(direction.messageKey)
  ) {
    throw new TypeError("INVALID_INSIGHT_KEY");
  }

  return createExecutiveInsightProjection({
    ...(direction.subject !== undefined ? { subject: direction.subject } : {}),
    ...(direction.guidanceRole !== undefined
      ? { insightRole: direction.guidanceRole }
      : {}),
    ...(direction.messageKey !== undefined
      ? { insightKey: direction.messageKey }
      : {}),
  });
}

// ─── Equality ───────────────────────────────────────────────────────────────

export function areExecutiveAdvisorProjectionsEqual(
  left: ExecutiveAdvisorProjection,
  right: ExecutiveAdvisorProjection,
): boolean {
  return (
    left.surface === right.surface &&
    subjectsEqual(left.subject, right.subject) &&
    (left.guidanceRole ?? undefined) === (right.guidanceRole ?? undefined) &&
    (left.messageKey ?? undefined) === (right.messageKey ?? undefined) &&
    (left.sourceSurface ?? undefined) === (right.sourceSurface ?? undefined)
  );
}

export function areExecutiveInsightProjectionsEqual(
  left: ExecutiveInsightProjection,
  right: ExecutiveInsightProjection,
): boolean {
  return (
    left.surface === right.surface &&
    subjectsEqual(left.subject, right.subject) &&
    (left.insightRole ?? undefined) === (right.insightRole ?? undefined) &&
    (left.insightKey ?? undefined) === (right.insightKey ?? undefined) &&
    (left.sourceSurface ?? undefined) === (right.sourceSurface ?? undefined)
  );
}

function areAdvisorCoordinationEqual(
  left: ExecutiveAdvisorCoordinationProjection,
  right: ExecutiveAdvisorCoordinationProjection,
): boolean {
  return (
    left.surface === right.surface &&
    left.sourceSurface === right.sourceSurface &&
    subjectsEqual(left.subject, right.subject)
  );
}

function areInsightCoordinationEqual(
  left: ExecutiveInsightCoordinationProjection,
  right: ExecutiveInsightCoordinationProjection,
): boolean {
  return (
    left.surface === right.surface &&
    left.sourceSurface === right.sourceSurface &&
    subjectsEqual(left.subject, right.subject)
  );
}

function areAdvisorCompositesEqual(
  left: ExecutiveAdvisorCompositeProjection,
  right: ExecutiveAdvisorCompositeProjection,
): boolean {
  if (
    left.guidance.length !== right.guidance.length ||
    left.coordination.length !== right.coordination.length
  ) {
    return false;
  }
  return (
    left.guidance.every((entry, index) =>
      areExecutiveAdvisorProjectionsEqual(entry, right.guidance[index]!),
    ) &&
    left.coordination.every((entry, index) =>
      areAdvisorCoordinationEqual(entry, right.coordination[index]!),
    )
  );
}

function areInsightCompositesEqual(
  left: ExecutiveInsightCompositeProjection,
  right: ExecutiveInsightCompositeProjection,
): boolean {
  if (
    left.insights.length !== right.insights.length ||
    left.coordination.length !== right.coordination.length
  ) {
    return false;
  }
  return (
    left.insights.every((entry, index) =>
      areExecutiveInsightProjectionsEqual(entry, right.insights[index]!),
    ) &&
    left.coordination.every((entry, index) =>
      areInsightCoordinationEqual(entry, right.coordination[index]!),
    )
  );
}

export function areExecutiveAdvisorInsightProjectionsEqual(
  left: ExecutiveAdvisorInsightProjection,
  right: ExecutiveAdvisorInsightProjection,
): boolean {
  return (
    areAdvisorCompositesEqual(left.advisor, right.advisor) &&
    areInsightCompositesEqual(left.insight, right.insight)
  );
}

// ─── Diffing ────────────────────────────────────────────────────────────────

export function diffExecutiveAdvisorProjection(
  previous: ExecutiveAdvisorCompositeProjection,
  next: ExecutiveAdvisorCompositeProjection,
): ExecutiveAdvisorInsightDiff {
  const changes: ExecutiveAdvisorInsightChangeKind[] = [];
  if (
    previous.guidance.length !== next.guidance.length ||
    !previous.guidance.every((entry, index) =>
      areExecutiveAdvisorProjectionsEqual(entry, next.guidance[index]!),
    )
  ) {
    changes.push("advisor-guidance");
  }
  if (
    previous.coordination.length !== next.coordination.length ||
    !previous.coordination.every((entry, index) =>
      areAdvisorCoordinationEqual(entry, next.coordination[index]!),
    )
  ) {
    changes.push("advisor-coordination");
  }
  const ordered = EXECUTIVE_ADVISOR_INSIGHT_CHANGE_KINDS.filter((kind) =>
    changes.includes(kind),
  );
  return Object.freeze({
    changed: ordered.length > 0,
    changes: Object.freeze(ordered),
  });
}

export function diffExecutiveInsightProjection(
  previous: ExecutiveInsightCompositeProjection,
  next: ExecutiveInsightCompositeProjection,
): ExecutiveAdvisorInsightDiff {
  const changes: ExecutiveAdvisorInsightChangeKind[] = [];
  if (
    previous.insights.length !== next.insights.length ||
    !previous.insights.every((entry, index) =>
      areExecutiveInsightProjectionsEqual(entry, next.insights[index]!),
    )
  ) {
    changes.push("insight-content");
  }
  if (
    previous.coordination.length !== next.coordination.length ||
    !previous.coordination.every((entry, index) =>
      areInsightCoordinationEqual(entry, next.coordination[index]!),
    )
  ) {
    changes.push("insight-coordination");
  }
  const ordered = EXECUTIVE_ADVISOR_INSIGHT_CHANGE_KINDS.filter((kind) =>
    changes.includes(kind),
  );
  return Object.freeze({
    changed: ordered.length > 0,
    changes: Object.freeze(ordered),
  });
}

export function diffExecutiveAdvisorInsightProjection(
  previous: ExecutiveAdvisorInsightProjection,
  next: ExecutiveAdvisorInsightProjection,
): ExecutiveAdvisorInsightDiff {
  const advisorDiff = diffExecutiveAdvisorProjection(
    previous.advisor,
    next.advisor,
  );
  const insightDiff = diffExecutiveInsightProjection(
    previous.insight,
    next.insight,
  );
  const merged = new Set<ExecutiveAdvisorInsightChangeKind>([
    ...advisorDiff.changes,
    ...insightDiff.changes,
  ]);
  const ordered = EXECUTIVE_ADVISOR_INSIGHT_CHANGE_KINDS.filter((kind) =>
    merged.has(kind),
  );
  return Object.freeze({
    changed: ordered.length > 0,
    changes: Object.freeze(ordered),
  });
}

// ─── Normalization ──────────────────────────────────────────────────────────

export function normalizeExecutiveAdvisorInsightProjection(
  projection: ExecutiveAdvisorInsightProjection,
): ExecutiveAdvisorInsightProjection {
  if (!isExecutiveAdvisorInsightProjection(projection)) {
    throw new TypeError("INVALID_GUIDANCE_DIRECTION");
  }

  const advisorGuidance: ExecutiveAdvisorProjection[] = [];
  const advisorSeen = new Set<string>();
  for (const entry of projection.advisor.guidance) {
    const key = advisorGuidanceIdentity(entry);
    if (advisorSeen.has(key)) continue;
    advisorSeen.add(key);
    advisorGuidance.push(entry);
  }

  const advisorCoordination: ExecutiveAdvisorCoordinationProjection[] = [];
  const advisorCoordSeen = new Set<string>();
  for (const entry of projection.advisor.coordination) {
    const key = advisorCoordinationIdentity(entry);
    if (advisorCoordSeen.has(key)) continue;
    advisorCoordSeen.add(key);
    advisorCoordination.push(entry);
  }

  const insights: ExecutiveInsightProjection[] = [];
  const insightSeen = new Set<string>();
  for (const entry of projection.insight.insights) {
    const key = insightIdentity(entry);
    if (insightSeen.has(key)) continue;
    insightSeen.add(key);
    insights.push(entry);
  }

  const insightCoordination: ExecutiveInsightCoordinationProjection[] = [];
  const insightCoordSeen = new Set<string>();
  for (const entry of projection.insight.coordination) {
    const key = insightCoordinationIdentity(entry);
    if (insightCoordSeen.has(key)) continue;
    insightCoordSeen.add(key);
    insightCoordination.push(entry);
  }

  return createExecutiveAdvisorInsightProjection({
    advisor: createExecutiveAdvisorCompositeProjection({
      guidance: advisorGuidance,
      coordination: advisorCoordination,
    }),
    insight: createExecutiveInsightCompositeProjection({
      insights,
      coordination: insightCoordination,
    }),
  });
}

// ─── Composite binding ──────────────────────────────────────────────────────

export function bindDirectorRuntimeDirectionsToExecutiveAdvisorInsight(
  directions: ReadonlyArray<unknown>,
): ExecutiveAdvisorInsightBindingResult {
  if (!Array.isArray(directions)) {
    return Object.freeze({
      status: "rejected" as const,
      issues: Object.freeze([
        issue("INVALID_GUIDANCE_DIRECTION", "directions must be an array"),
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

  const issues: ExecutiveAdvisorInsightBindingIssue[] = [];
  const deferred: ExecutiveRuntimeDirectionContract[] = [];
  const identityRegistry = new Map<string, ExecutiveDirectorRuntimeSubjectContract>();

  const advisorGuidance: ExecutiveAdvisorProjection[] = [];
  const advisorCoordination: ExecutiveAdvisorCoordinationProjection[] = [];
  const insights: ExecutiveInsightProjection[] = [];
  const insightCoordination: ExecutiveInsightCoordinationProjection[] = [];

  const advisorGuidanceSeen = new Map<string, ExecutiveAdvisorProjection>();
  const insightSeen = new Map<string, ExecutiveInsightProjection>();
  const advisorCoordSeen = new Set<string>();
  const insightCoordSeen = new Set<string>();

  let supportedCount = 0;
  let hasDeferredOwnedTargets = false;

  for (let index = 0; index < directions.length; index += 1) {
    const direction = directions[index];
    const path = `directions[${index}]`;

    if (!isExecutiveRuntimeDirectionContract(direction)) {
      issues.push(
        issue(
          "INVALID_GUIDANCE_DIRECTION",
          "direction must be a valid runtime direction",
          path,
        ),
      );
      continue;
    }

    const support = getAdvisorInsightDirectionSupport(direction.kind);
    if (support === "deferred") {
      deferred.push(direction);
      continue;
    }
    if (support === "unsupported") {
      issues.push(
        issue(
          "UNSUPPORTED_DIRECTION",
          `direction kind ${direction.kind} is unsupported`,
          path,
        ),
      );
      continue;
    }

    supportedCount += 1;

    switch (direction.kind) {
      case "guidance": {
        if (!isExecutiveGuidanceDirectionContract(direction)) {
          issues.push(
            issue("INVALID_GUIDANCE_DIRECTION", "invalid guidance direction", path),
          );
          break;
        }

        if (direction.surface === "advisor") {
          try {
            const projected =
              bindDirectorRuntimeGuidanceToExecutiveAdvisor(direction);
            trackSubjectIdentity(
              identityRegistry,
              projected.subject,
              issues,
              `${path}.subject`,
            );

            const identity = advisorGuidanceIdentity(projected);
            const existing = advisorGuidanceSeen.get(identity);
            if (existing !== undefined) {
              issues.push(
                issue(
                  "DUPLICATE_GUIDANCE_DIRECTION",
                  "exact duplicate advisor guidance direction",
                  path,
                ),
              );
              break;
            }

            const conflictKey = [
              projected.surface,
              projected.subject?.id ?? "",
              projected.messageKey ?? "",
            ].join("|");
            const conflicting = advisorGuidance.find(
              (entry) =>
                [
                  entry.surface,
                  entry.subject?.id ?? "",
                  entry.messageKey ?? "",
                ].join("|") === conflictKey &&
                (entry.guidanceRole ?? undefined) !==
                  (projected.guidanceRole ?? undefined) &&
                projected.messageKey !== undefined,
            );
            if (conflicting !== undefined) {
              issues.push(
                issue(
                  "CONFLICTING_GUIDANCE_ROLE",
                  "conflicting advisor guidance roles for same semantic identity",
                  path,
                ),
              );
              break;
            }

            advisorGuidanceSeen.set(identity, projected);
            advisorGuidance.push(projected);
          } catch (error) {
            const message = String((error as Error).message);
            const code: ExecutiveAdvisorInsightBindingIssueCode =
              message === "INVALID_ADVISOR_TARGET"
                ? "INVALID_ADVISOR_TARGET"
                : message === "INVALID_MESSAGE_KEY"
                  ? "INVALID_MESSAGE_KEY"
                  : message === "INVALID_SUBJECT"
                    ? "INVALID_SUBJECT"
                    : "INVALID_GUIDANCE_DIRECTION";
            issues.push(issue(code, message, path));
          }
          break;
        }

        if (direction.surface === "insight") {
          try {
            const projected =
              bindDirectorRuntimeGuidanceToExecutiveInsight(direction);
            trackSubjectIdentity(
              identityRegistry,
              projected.subject,
              issues,
              `${path}.subject`,
            );

            const identity = insightIdentity(projected);
            if (insightSeen.has(identity)) {
              issues.push(
                issue(
                  "DUPLICATE_GUIDANCE_DIRECTION",
                  "exact duplicate insight guidance direction",
                  path,
                ),
              );
              break;
            }

            const conflictKey = [
              projected.surface,
              projected.subject?.id ?? "",
              projected.insightKey ?? "",
            ].join("|");
            const conflicting = insights.find(
              (entry) =>
                [
                  entry.surface,
                  entry.subject?.id ?? "",
                  entry.insightKey ?? "",
                ].join("|") === conflictKey &&
                (entry.insightRole ?? undefined) !==
                  (projected.insightRole ?? undefined) &&
                projected.insightKey !== undefined,
            );
            if (conflicting !== undefined) {
              issues.push(
                issue(
                  "CONFLICTING_GUIDANCE_ROLE",
                  "conflicting insight guidance roles for same semantic identity",
                  path,
                ),
              );
              break;
            }

            insightSeen.set(identity, projected);
            insights.push(projected);
          } catch (error) {
            const message = String((error as Error).message);
            const code: ExecutiveAdvisorInsightBindingIssueCode =
              message === "INVALID_INSIGHT_TARGET"
                ? "INVALID_INSIGHT_TARGET"
                : message === "INVALID_INSIGHT_KEY"
                  ? "INVALID_INSIGHT_KEY"
                  : message === "INVALID_SUBJECT"
                    ? "INVALID_SUBJECT"
                    : "INVALID_GUIDANCE_DIRECTION";
            issues.push(issue(code, message, path));
          }
          break;
        }

        issues.push(
          issue(
            direction.surface === "stage" ||
              direction.surface === "live-lens" ||
              direction.surface === "timeline" ||
              direction.surface === "explorer"
              ? "INVALID_ADVISOR_TARGET"
              : "INVALID_INSIGHT_TARGET",
            `guidance surface ${direction.surface} is not an Advisor/Insight target`,
            path,
          ),
        );
        break;
      }

      case "coordination": {
        if (!isExecutiveCoordinationDirectionContract(direction)) {
          issues.push(
            issue(
              "INVALID_COORDINATION_DIRECTION",
              "invalid coordination direction",
              path,
            ),
          );
          break;
        }

        const seenTargets = new Set<ExecutiveExperienceSurface>();
        for (const [targetIndex, target] of direction.targetSurfaces.entries()) {
          if (!isSurface(target)) {
            issues.push(
              issue(
                "INVALID_COORDINATION_TARGET",
                "coordination target must be a canonical surface",
                `${path}.targetSurfaces[${targetIndex}]`,
              ),
            );
            continue;
          }
          if (seenTargets.has(target)) {
            issues.push(
              issue(
                "DUPLICATE_COORDINATION_TARGET",
                `duplicate coordination target ${target}`,
                `${path}.targetSurfaces[${targetIndex}]`,
              ),
            );
            continue;
          }
          seenTargets.add(target);
        }

        let targets: ExecutiveAdvisorInsightCoordinationTargets;
        try {
          targets = getAdvisorInsightCoordinationTargets(direction);
        } catch (error) {
          issues.push(
            issue(
              "INVALID_COORDINATION_DIRECTION",
              String((error as Error).message),
              path,
            ),
          );
          break;
        }

        if (targets.ownedTargets.length === 0) {
          issues.push(
            issue(
              "INVALID_COORDINATION_TARGET",
              "coordination direction has no Advisor/Insight owned targets",
              path,
            ),
          );
          break;
        }

        if (targets.deferredTargets.length > 0) {
          hasDeferredOwnedTargets = true;
          deferred.push(
            Object.freeze({
              kind: "coordination" as const,
              sourceSurface: direction.sourceSurface,
              targetSurfaces: Object.freeze([...targets.deferredTargets]),
              ...(direction.subject !== undefined
                ? { subject: freezeSubject(direction.subject) }
                : {}),
            }),
          );
        }

        trackSubjectIdentity(
          identityRegistry,
          direction.subject,
          issues,
          `${path}.subject`,
        );

        for (const target of targets.ownedTargets) {
          if (target === "advisor") {
            const projected = createExecutiveAdvisorCoordinationProjection({
              sourceSurface: direction.sourceSurface,
              ...(direction.subject !== undefined
                ? { subject: direction.subject }
                : {}),
            });
            const identity = advisorCoordinationIdentity(projected);
            if (!advisorCoordSeen.has(identity)) {
              advisorCoordSeen.add(identity);
              advisorCoordination.push(projected);
            }
          } else {
            const projected = createExecutiveInsightCoordinationProjection({
              sourceSurface: direction.sourceSurface,
              ...(direction.subject !== undefined
                ? { subject: direction.subject }
                : {}),
            });
            const identity = insightCoordinationIdentity(projected);
            if (!insightCoordSeen.has(identity)) {
              insightCoordSeen.add(identity);
              insightCoordination.push(projected);
            }
          }
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

  const projection = normalizeExecutiveAdvisorInsightProjection(
    createExecutiveAdvisorInsightProjection({
      advisor: createExecutiveAdvisorCompositeProjection({
        guidance: advisorGuidance,
        coordination: advisorCoordination,
      }),
      insight: createExecutiveInsightCompositeProjection({
        insights,
        coordination: insightCoordination,
      }),
    }),
  );

  const partial =
    deferred.length > 0 || hasDeferredOwnedTargets;

  return Object.freeze({
    status: partial ? ("partial" as const) : ("bound" as const),
    projection,
    issues: Object.freeze([]),
    deferredDirections: Object.freeze(deferred),
  });
}

export function bindDirectorRuntimeResponseToExecutiveAdvisorInsight(
  response: unknown,
): ExecutiveAdvisorInsightBindingResult {
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
        issue(
          "INVALID_RUNTIME_RESPONSE",
          "response.direction must be dri-to-ex",
        ),
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

  const bound = bindDirectorRuntimeDirectionsToExecutiveAdvisorInsight(
    response.directions,
  );

  if (bound.status === "rejected") {
    return bound;
  }

  if (response.status === "partial") {
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

export const EXECUTIVE_ADVISOR_INSIGHT_BINDING_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "ExecutiveAdvisorInsightDirectionSupport",
    "ExecutiveAdvisorGuidanceRole",
    "ExecutiveInsightRole",
    "ExecutiveAdvisorProjection",
    "ExecutiveInsightProjection",
    "ExecutiveAdvisorCoordinationProjection",
    "ExecutiveInsightCoordinationProjection",
    "ExecutiveAdvisorCompositeProjection",
    "ExecutiveInsightCompositeProjection",
    "ExecutiveAdvisorInsightProjection",
    "ExecutiveAdvisorInsightBindingStatus",
    "ExecutiveAdvisorInsightBindingIssueCode",
    "ExecutiveAdvisorInsightBindingIssue",
    "ExecutiveAdvisorInsightBindingResult",
    "ExecutiveAdvisorInsightChangeKind",
    "ExecutiveAdvisorInsightDiff",
    "ExecutiveAdvisorInsightCoordinationTargets",
    "ExecutiveAdvisorInsightBindingGuarantee",
    "ExecutiveExperienceDirectorRuntimeAdvisorInsightBindingVerification",
  ] as const);

export const executiveExperienceDirectorRuntimeAdvisorInsightBindingValidatorNames =
  Object.freeze([
    "isExecutiveAdvisorProjection",
    "isExecutiveInsightProjection",
    "isExecutiveAdvisorCoordinationProjection",
    "isExecutiveInsightCoordinationProjection",
    "isExecutiveAdvisorCompositeProjection",
    "isExecutiveInsightCompositeProjection",
    "isExecutiveAdvisorInsightProjection",
    "isExecutiveAdvisorInsightBindingResult",
    "isAdvisorInsightDirectionSupported",
    "getAdvisorInsightDirectionSupport",
  ] as const);

export const executiveExperienceDirectorRuntimeAdvisorInsightBindingApiNames =
  Object.freeze([
    "bindDirectorRuntimeGuidanceToExecutiveAdvisor",
    "bindDirectorRuntimeGuidanceToExecutiveInsight",
    "bindDirectorRuntimeDirectionsToExecutiveAdvisorInsight",
    "bindDirectorRuntimeResponseToExecutiveAdvisorInsight",
    "getAdvisorInsightCoordinationTargets",
    "normalizeExecutiveAdvisorInsightProjection",
    "createExecutiveAdvisorProjection",
    "createExecutiveInsightProjection",
    "createExecutiveAdvisorCoordinationProjection",
    "createExecutiveInsightCoordinationProjection",
    "createExecutiveAdvisorCompositeProjection",
    "createExecutiveInsightCompositeProjection",
    "createExecutiveAdvisorInsightProjection",
    "diffExecutiveAdvisorProjection",
    "diffExecutiveInsightProjection",
    "diffExecutiveAdvisorInsightProjection",
    "areExecutiveAdvisorProjectionsEqual",
    "areExecutiveInsightProjectionsEqual",
    "areExecutiveAdvisorInsightProjectionsEqual",
    ...executiveExperienceDirectorRuntimeAdvisorInsightBindingValidatorNames,
    "getExecutiveExperienceDirectorRuntimeAdvisorInsightBindingIdentity",
    "verifyExecutiveExperienceDirectorRuntimeAdvisorInsightBinding",
  ] as const);

export const EXECUTIVE_ADVISOR_INSIGHT_BINDING_REGISTRY_SECTIONS =
  Object.freeze([
    "Identity",
    "SupportedDirections",
    "Advisor",
    "Insight",
    "Guidance",
    "Coordination",
    "CompositeBinding",
    "Diffing",
    "Validation",
    "IssueCodes",
    "Guarantees",
    "Compatibility",
  ] as const);

export function getExecutiveExperienceDirectorRuntimeAdvisorInsightBindingIdentity():
  typeof executiveExperienceDirectorRuntimeAdvisorInsightBindingCanonicalIdentity {
  return executiveExperienceDirectorRuntimeAdvisorInsightBindingCanonicalIdentity;
}

export const executiveExperienceDirectorRuntimeAdvisorInsightBindingRegistry =
  Object.freeze({
    identity:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingIdentity,
    version:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingVersion,
    namespace:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingNamespace,
    architecturalRole:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingArchitecturalRole,
    dependencyIdentity:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingDependencyIdentity,
    dependencyPath:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingDependencyPath,
    principle: EXECUTIVE_ADVISOR_INSIGHT_BINDING_PRINCIPLE,
    supportedDirectionKinds:
      EXECUTIVE_ADVISOR_INSIGHT_SUPPORTED_DIRECTION_KINDS,
    supportedDirectionKindCount:
      EXECUTIVE_ADVISOR_INSIGHT_SUPPORTED_DIRECTION_KINDS.length,
    deferredDirectionKinds:
      EXECUTIVE_ADVISOR_INSIGHT_DEFERRED_DIRECTION_KINDS,
    deferredDirectionKindCount:
      EXECUTIVE_ADVISOR_INSIGHT_DEFERRED_DIRECTION_KINDS.length,
    deferredToExDri5DirectionKinds:
      EXECUTIVE_ADVISOR_INSIGHT_DEFERRED_TO_EX_DRI_5_DIRECTION_KINDS,
    targetSurfaces: EXECUTIVE_ADVISOR_INSIGHT_TARGET_SURFACES,
    targetSurfaceCount: EXECUTIVE_ADVISOR_INSIGHT_TARGET_SURFACES.length,
    advisorGuidanceRoles: EXECUTIVE_ADVISOR_GUIDANCE_ROLES,
    advisorGuidanceRoleCount: EXECUTIVE_ADVISOR_GUIDANCE_ROLES.length,
    insightRoles: EXECUTIVE_INSIGHT_ROLES,
    insightRoleCount: EXECUTIVE_INSIGHT_ROLES.length,
    changeKinds: EXECUTIVE_ADVISOR_INSIGHT_CHANGE_KINDS,
    changeKindCount: EXECUTIVE_ADVISOR_INSIGHT_CHANGE_KINDS.length,
    statuses: EXECUTIVE_ADVISOR_INSIGHT_BINDING_STATUSES,
    statusCount: EXECUTIVE_ADVISOR_INSIGHT_BINDING_STATUSES.length,
    issueCodes: EXECUTIVE_ADVISOR_INSIGHT_BINDING_ISSUE_CODES,
    issueCodeCount: EXECUTIVE_ADVISOR_INSIGHT_BINDING_ISSUE_CODES.length,
    guarantees: EXECUTIVE_ADVISOR_INSIGHT_BINDING_GUARANTEES,
    guaranteeCount: EXECUTIVE_ADVISOR_INSIGHT_BINDING_GUARANTEES.length,
    validators:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingValidatorNames,
    validatorCount:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingValidatorNames
        .length,
    registrySections: EXECUTIVE_ADVISOR_INSIGHT_BINDING_REGISTRY_SECTIONS,
    registrySectionCount:
      EXECUTIVE_ADVISOR_INSIGHT_BINDING_REGISTRY_SECTIONS.length,
    publicTypes: EXECUTIVE_ADVISOR_INSIGHT_BINDING_PUBLIC_TYPE_NAMES,
    publicTypeCount: EXECUTIVE_ADVISOR_INSIGHT_BINDING_PUBLIC_TYPE_NAMES.length,
    publicApis:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingApiNames,
    publicApiCount:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingApiNames.length,
  });

export const executiveExperienceDirectorRuntimeAdvisorInsightBinding =
  Object.freeze({
    phase: "EX-DRI-6" as const,
    name: "ExecutiveExperienceDirectorRuntimeAdvisorInsightBinding" as const,
    identity:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingIdentity,
    version:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingVersion,
    namespace:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingNamespace,
    architecturalRole:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingArchitecturalRole,
    role: "AdvisorInsightBinding" as const,
    stage: "AdvisorInsightBinding" as const,
    status: "AdvisorInsightBindingReady" as const,
    upstreamDependency:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingDependencyIdentity,
    dependencyPath:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingDependencyPath,
    bindingDirection:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingDirection,
    deterministic:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingDeterministic,
    stateless:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingStateless,
    rendererIndependent:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingRendererIndependent,
    contentGenerationPolicy:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingContentGenerationPolicy,
    immutable: true as const,
    sideEffectFree: true as const,
    frameworkIndependent: true as const,
    threeJsIndependent: true as const,
    reactIndependent: true as const,
    aiIndependent: true as const,
    browserIndependent: true as const,
    principle: EXECUTIVE_ADVISOR_INSIGHT_BINDING_PRINCIPLE,
    supportedDirectionKinds:
      EXECUTIVE_ADVISOR_INSIGHT_SUPPORTED_DIRECTION_KINDS,
    deferredDirectionKinds:
      EXECUTIVE_ADVISOR_INSIGHT_DEFERRED_DIRECTION_KINDS,
    advisorGuidanceRoles: EXECUTIVE_ADVISOR_GUIDANCE_ROLES,
    insightRoles: EXECUTIVE_INSIGHT_ROLES,
    targetSurfaces: EXECUTIVE_ADVISOR_INSIGHT_TARGET_SURFACES,
    guarantees: EXECUTIVE_ADVISOR_INSIGHT_BINDING_GUARANTEES,
    publicApiSurface:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingApiNames,
    publicTypes: EXECUTIVE_ADVISOR_INSIGHT_BINDING_PUBLIC_TYPE_NAMES,
    registry:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingRegistry,
    scenePresentationBindingBoundary:
      "EX-DRI-5-scene-presentation-binding-only" as const,
    architecturalStatus:
      "AdvisorInsightBinding Complete · Deterministic · Stateless · AI-Independent · Renderer-Independent · ReadyForExDriIntegrationPlatform" as const,
  });

// ─── Verification ───────────────────────────────────────────────────────────

export interface ExecutiveExperienceDirectorRuntimeAdvisorInsightBindingVerification {
  readonly ok: boolean;
  readonly identity: typeof executiveExperienceDirectorRuntimeAdvisorInsightBindingIdentity;
  readonly version: typeof executiveExperienceDirectorRuntimeAdvisorInsightBindingVersion;
  readonly namespace: typeof executiveExperienceDirectorRuntimeAdvisorInsightBindingNamespace;
  readonly architecturalRole: typeof executiveExperienceDirectorRuntimeAdvisorInsightBindingArchitecturalRole;
  readonly dependencyIdentity: typeof executiveExperienceDirectorRuntimeAdvisorInsightBindingDependencyIdentity;
  readonly supportedDirectionKindCount: number;
  readonly deferredDirectionKindCount: number;
  readonly advisorGuidanceRoleCount: number;
  readonly insightRoleCount: number;
  readonly targetSurfaceCount: number;
  readonly changeKindCount: number;
  readonly issueCodeCount: number;
  readonly guaranteeCount: number;
  readonly validatorCount: number;
  readonly registrySectionCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly frozen: boolean;
  readonly scenePresentationBindingBoundaryIntact: boolean;
  readonly frameworkIndependent: boolean;
  readonly aiIndependent: boolean;
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

export function verifyExecutiveExperienceDirectorRuntimeAdvisorInsightBinding():
  ExecutiveExperienceDirectorRuntimeAdvisorInsightBindingVerification {
  const layer = executiveExperienceDirectorRuntimeAdvisorInsightBinding;
  const registry =
    executiveExperienceDirectorRuntimeAdvisorInsightBindingRegistry;

  const identityOk =
    layer.identity ===
      "EX-DRI-6/ExecutiveExperienceDirectorRuntimeAdvisorInsightBinding" &&
    layer.version === "1.6.0" &&
    layer.namespace ===
      "nexora.ex.dri.integration.advisor-insight-binding" &&
    layer.architecturalRole ===
      "ExecutiveExperienceDirectorRuntimeAdvisorInsightBinding" &&
    layer.status === "AdvisorInsightBindingReady" &&
    layer.upstreamDependency ===
      "EX-DRI-5/ExecutiveExperienceDirectorRuntimeScenePresentationBinding" &&
    layer.upstreamDependency ===
      executiveExperienceDirectorRuntimeScenePresentationBindingIdentity &&
    registry.dependencyIdentity === layer.upstreamDependency &&
    layer.scenePresentationBindingBoundary ===
      "EX-DRI-5-scene-presentation-binding-only";

  const dependencyOk =
    layer.dependencyPath ===
      "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeScenePresentationBinding";

  const supportedOk = exactOrder(
    EXECUTIVE_ADVISOR_INSIGHT_SUPPORTED_DIRECTION_KINDS,
    ["guidance", "coordination"],
  );
  const deferredOk = exactOrder(
    EXECUTIVE_ADVISOR_INSIGHT_DEFERRED_DIRECTION_KINDS,
    ["scene", "focus", "attention", "presentation", "interaction"],
  );
  const deferredToExDri5Ok = exactOrder(
    EXECUTIVE_ADVISOR_INSIGHT_DEFERRED_TO_EX_DRI_5_DIRECTION_KINDS,
    ["scene", "focus", "attention", "presentation"],
  );
  const advisorRolesOk = exactOrder(EXECUTIVE_ADVISOR_GUIDANCE_ROLES, [
    "orient",
    "explain",
    "recommend",
    "warn",
    "clarify",
    "next-action",
  ]);
  const insightRolesOk = exactOrder(EXECUTIVE_INSIGHT_ROLES, [
    "evidence",
    "metric",
    "relationship",
    "impact",
    "comparison",
    "context",
  ]);
  const targetsOk = exactOrder(EXECUTIVE_ADVISOR_INSIGHT_TARGET_SURFACES, [
    "advisor",
    "insight",
  ]);
  const changeKindsOk = exactOrder(EXECUTIVE_ADVISOR_INSIGHT_CHANGE_KINDS, [
    "advisor-guidance",
    "advisor-coordination",
    "insight-content",
    "insight-coordination",
  ]);
  const issueCodesOk =
    exactOrder(EXECUTIVE_ADVISOR_INSIGHT_BINDING_ISSUE_CODES, [
      "INVALID_GUIDANCE_DIRECTION",
      "INVALID_COORDINATION_DIRECTION",
      "INVALID_ADVISOR_TARGET",
      "INVALID_INSIGHT_TARGET",
      "INVALID_SUBJECT",
      "SUBJECT_IDENTITY_CONFLICT",
      "DUPLICATE_GUIDANCE_DIRECTION",
      "CONFLICTING_GUIDANCE_ROLE",
      "INVALID_MESSAGE_KEY",
      "INVALID_INSIGHT_KEY",
      "INVALID_RUNTIME_RESPONSE",
      "UNSUPPORTED_DIRECTION",
      "INVALID_COORDINATION_TARGET",
      "DUPLICATE_COORDINATION_TARGET",
    ]) && unique([...EXECUTIVE_ADVISOR_INSIGHT_BINDING_ISSUE_CODES]);

  const guaranteesOk =
    EXECUTIVE_ADVISOR_INSIGHT_BINDING_GUARANTEES.length === 30 &&
    unique(
      EXECUTIVE_ADVISOR_INSIGHT_BINDING_GUARANTEES.map((entry) => entry.id),
    ) &&
    EXECUTIVE_ADVISOR_INSIGHT_BINDING_GUARANTEES.every(
      (entry, index) => entry.order === index + 1,
    );

  const directionSupportConsistent =
    getAdvisorInsightDirectionSupport("guidance") === "supported" &&
    getAdvisorInsightDirectionSupport("coordination") === "supported" &&
    getAdvisorInsightDirectionSupport("scene") === "deferred" &&
    getAdvisorInsightDirectionSupport("focus") === "deferred" &&
    getAdvisorInsightDirectionSupport("attention") === "deferred" &&
    getAdvisorInsightDirectionSupport("presentation") === "deferred" &&
    getAdvisorInsightDirectionSupport("interaction") === "deferred" &&
    getAdvisorInsightDirectionSupport("unknown") === "unsupported";

  const registryIntegrityOk =
    registry.supportedDirectionKindCount ===
      EXECUTIVE_ADVISOR_INSIGHT_SUPPORTED_DIRECTION_KINDS.length &&
    registry.deferredDirectionKindCount ===
      EXECUTIVE_ADVISOR_INSIGHT_DEFERRED_DIRECTION_KINDS.length &&
    registry.advisorGuidanceRoleCount ===
      EXECUTIVE_ADVISOR_GUIDANCE_ROLES.length &&
    registry.insightRoleCount === EXECUTIVE_INSIGHT_ROLES.length &&
    registry.targetSurfaceCount ===
      EXECUTIVE_ADVISOR_INSIGHT_TARGET_SURFACES.length &&
    registry.changeKindCount ===
      EXECUTIVE_ADVISOR_INSIGHT_CHANGE_KINDS.length &&
    registry.issueCodeCount ===
      EXECUTIVE_ADVISOR_INSIGHT_BINDING_ISSUE_CODES.length &&
    registry.guaranteeCount ===
      EXECUTIVE_ADVISOR_INSIGHT_BINDING_GUARANTEES.length &&
    registry.validatorCount ===
      executiveExperienceDirectorRuntimeAdvisorInsightBindingValidatorNames
        .length &&
    registry.registrySectionCount ===
      EXECUTIVE_ADVISOR_INSIGHT_BINDING_REGISTRY_SECTIONS.length &&
    registry.publicTypeCount ===
      EXECUTIVE_ADVISOR_INSIGHT_BINDING_PUBLIC_TYPE_NAMES.length &&
    registry.publicApiCount ===
      executiveExperienceDirectorRuntimeAdvisorInsightBindingApiNames.length &&
    exactOrder(
      [...EXECUTIVE_ADVISOR_INSIGHT_BINDING_REGISTRY_SECTIONS],
      [
        "Identity",
        "SupportedDirections",
        "Advisor",
        "Insight",
        "Guidance",
        "Coordination",
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
      executiveExperienceDirectorRuntimeAdvisorInsightBindingCanonicalIdentity,
    ) &&
    Object.isFrozen(EXECUTIVE_ADVISOR_INSIGHT_SUPPORTED_DIRECTION_KINDS) &&
    Object.isFrozen(EXECUTIVE_ADVISOR_INSIGHT_DEFERRED_DIRECTION_KINDS) &&
    Object.isFrozen(EXECUTIVE_ADVISOR_GUIDANCE_ROLES) &&
    Object.isFrozen(EXECUTIVE_INSIGHT_ROLES) &&
    Object.isFrozen(EXECUTIVE_ADVISOR_INSIGHT_CHANGE_KINDS) &&
    Object.isFrozen(EXECUTIVE_ADVISOR_INSIGHT_BINDING_ISSUE_CODES) &&
    Object.isFrozen(EXECUTIVE_ADVISOR_INSIGHT_BINDING_GUARANTEES) &&
    Object.isFrozen(EXECUTIVE_ADVISOR_INSIGHT_BINDING_REGISTRY_SECTIONS);

  const scenePresentationBindingBoundaryIntact =
    layer.upstreamDependency ===
      "EX-DRI-5/ExecutiveExperienceDirectorRuntimeScenePresentationBinding" &&
    layer.scenePresentationBindingBoundary ===
      "EX-DRI-5-scene-presentation-binding-only";

  const frameworkIndependent =
    layer.frameworkIndependent === true &&
    layer.rendererIndependent === true &&
    layer.threeJsIndependent === true &&
    layer.reactIndependent === true &&
    layer.stateless === true;

  const aiIndependent =
    layer.aiIndependent === true &&
    layer.contentGenerationPolicy === "no-content-generation";

  const ok =
    identityOk &&
    dependencyOk &&
    supportedOk &&
    deferredOk &&
    deferredToExDri5Ok &&
    advisorRolesOk &&
    insightRolesOk &&
    targetsOk &&
    changeKindsOk &&
    issueCodesOk &&
    guaranteesOk &&
    directionSupportConsistent &&
    registryIntegrityOk &&
    immutabilityOk &&
    scenePresentationBindingBoundaryIntact &&
    frameworkIndependent &&
    aiIndependent &&
    layer.principle === EXECUTIVE_ADVISOR_INSIGHT_BINDING_PRINCIPLE;

  return Object.freeze({
    ok,
    identity:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingIdentity,
    version:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingVersion,
    namespace:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingNamespace,
    architecturalRole:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingArchitecturalRole,
    dependencyIdentity:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingDependencyIdentity,
    supportedDirectionKindCount:
      EXECUTIVE_ADVISOR_INSIGHT_SUPPORTED_DIRECTION_KINDS.length,
    deferredDirectionKindCount:
      EXECUTIVE_ADVISOR_INSIGHT_DEFERRED_DIRECTION_KINDS.length,
    advisorGuidanceRoleCount: EXECUTIVE_ADVISOR_GUIDANCE_ROLES.length,
    insightRoleCount: EXECUTIVE_INSIGHT_ROLES.length,
    targetSurfaceCount: EXECUTIVE_ADVISOR_INSIGHT_TARGET_SURFACES.length,
    changeKindCount: EXECUTIVE_ADVISOR_INSIGHT_CHANGE_KINDS.length,
    issueCodeCount: EXECUTIVE_ADVISOR_INSIGHT_BINDING_ISSUE_CODES.length,
    guaranteeCount: EXECUTIVE_ADVISOR_INSIGHT_BINDING_GUARANTEES.length,
    validatorCount:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingValidatorNames
        .length,
    registrySectionCount:
      EXECUTIVE_ADVISOR_INSIGHT_BINDING_REGISTRY_SECTIONS.length,
    publicTypeCount: EXECUTIVE_ADVISOR_INSIGHT_BINDING_PUBLIC_TYPE_NAMES.length,
    publicApiCount:
      executiveExperienceDirectorRuntimeAdvisorInsightBindingApiNames.length,
    frozen: immutabilityOk,
    scenePresentationBindingBoundaryIntact,
    frameworkIndependent,
    aiIndependent,
    directionSupportConsistent,
  });
}
