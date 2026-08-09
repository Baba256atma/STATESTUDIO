/**
 * EX-DRI-7 — Executive Experience ↔ Director Runtime Integration Platform.
 *
 * Composes EX-DRI-3..6 into one canonical semantic integration platform:
 *
 *   EX state/context → EX interaction → EX→DRI request
 *   DRI response → scene/presentation + advisor/insight → unified projection
 *
 * EX captures. EX-DRI binds. DRI decides. EX-DRI projects. EX renders.
 *
 * No React / Three.js / UI mutation / AI / DRI engine execution.
 */

import {
  EXECUTIVE_SCENE_PRESENTATION_BINDING_PRESENTATION_STATES,
  EXECUTIVE_SCENE_PRESENTATION_BINDING_SURFACES,
  areExecutiveAdvisorInsightProjectionsEqual,
  areExecutiveScenePresentationProjectionsEqual,
  bindDirectorRuntimeDirectionsToExecutiveAdvisorInsight,
  bindDirectorRuntimeDirectionsToExecutiveScenePresentation,
  bindExecutiveExperienceCompositeState,
  bindExecutiveInteractionToDirectorRuntimeRequest,
  createExecutiveAdvisorInsightProjection,
  createExecutiveDirectorRuntimeCorrelation,
  createExecutiveDirectorRuntimeRequest,
  createExecutiveDirectorRuntimeResponse,
  createExecutiveDirectorRuntimeSubjectContract,
  createExecutiveRuntimeDirectionContract,
  diffExecutiveAdvisorInsightProjection,
  diffExecutiveScenePresentationProjection,
  executiveExperienceDirectorRuntimeAdvisorInsightBindingIdentity,
  isExecutiveAdvisorInsightBindingResult,
  isExecutiveAdvisorInsightProjection,
  isExecutiveDirectorRuntimeCorrelation,
  isExecutiveDirectorRuntimeRequestContract,
  isExecutiveDirectorRuntimeResponseContract,
  isExecutiveDirectorRuntimeSubjectContract,
  isExecutiveExperienceCompositeStateSnapshot,
  isExecutiveRuntimeDirectionContract,
  isExecutiveScenePresentationBindingResult,
  isExecutiveScenePresentationProjection,
  normalizeExecutiveExperienceCompositeState,
  type ExecutiveAdvisorInsightBindingResult,
  type ExecutiveAdvisorInsightProjection,
  type ExecutiveDirectorRuntimeCorrelation,
  type ExecutiveDirectorRuntimeRequestContract,
  type ExecutiveDirectorRuntimeResponseContract,
  type ExecutiveDirectorRuntimeSubjectContract,
  type ExecutiveExperienceCompositeStateSnapshot,
  type ExecutiveExperienceContextBindingResult,
  type ExecutiveExperienceSurface,
  type ExecutiveInteractionKind,
  type ExecutivePresentationState,
  type ExecutiveRuntimeDirectionContract,
  type ExecutiveScenePresentationBindingResult,
  type ExecutiveScenePresentationProjection,
} from "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeAdvisorInsightBinding";

/**
 * Additive re-export surface for EX-DRI-8 Certification & Freeze.
 * Preserves EX-DRI-7 as the sole immediate dependency boundary.
 */
export type {
  ExecutiveDirectorRuntimeCorrelation,
  ExecutiveDirectorRuntimeRequestContract,
  ExecutiveDirectorRuntimeResponseContract,
  ExecutiveDirectorRuntimeSubjectContract,
  ExecutiveExperienceCompositeStateSnapshot,
  ExecutiveRuntimeDirectionContract,
};

export {
  createExecutiveDirectorRuntimeCorrelation,
  createExecutiveDirectorRuntimeRequest,
  createExecutiveDirectorRuntimeResponse,
  createExecutiveDirectorRuntimeSubjectContract,
  createExecutiveRuntimeDirectionContract,
};

/**
 * Canonical EX-DRI identity chain (string literals — no live lower-layer imports).
 */
export const EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_IDENTITY_CHAIN =
  Object.freeze([
    "EX-DRI-1/ExecutiveExperienceDirectorRuntimeIntegrationFoundation",
    "EX-DRI-2/ExecutiveExperienceDirectorRuntimeIntegrationContracts",
    "EX-DRI-3/ExecutiveExperienceDirectorRuntimeContextStateBinding",
    "EX-DRI-4/ExecutiveExperienceDirectorRuntimeInteractionBinding",
    "EX-DRI-5/ExecutiveExperienceDirectorRuntimeScenePresentationBinding",
    "EX-DRI-6/ExecutiveExperienceDirectorRuntimeAdvisorInsightBinding",
    "EX-DRI-7/ExecutiveExperienceDirectorRuntimeIntegrationPlatform",
  ] as const);

export const EXECUTIVE_DIRECTOR_RUNTIME_INTEGRATION_DEPENDENCY_CHAIN =
  Object.freeze([
    Object.freeze({
      from: "EX-DRI-2/ExecutiveExperienceDirectorRuntimeIntegrationContracts",
      to: "EX-DRI-1/ExecutiveExperienceDirectorRuntimeIntegrationFoundation",
    }),
    Object.freeze({
      from: "EX-DRI-3/ExecutiveExperienceDirectorRuntimeContextStateBinding",
      to: "EX-DRI-2/ExecutiveExperienceDirectorRuntimeIntegrationContracts",
    }),
    Object.freeze({
      from: "EX-DRI-4/ExecutiveExperienceDirectorRuntimeInteractionBinding",
      to: "EX-DRI-3/ExecutiveExperienceDirectorRuntimeContextStateBinding",
    }),
    Object.freeze({
      from: "EX-DRI-5/ExecutiveExperienceDirectorRuntimeScenePresentationBinding",
      to: "EX-DRI-4/ExecutiveExperienceDirectorRuntimeInteractionBinding",
    }),
    Object.freeze({
      from: "EX-DRI-6/ExecutiveExperienceDirectorRuntimeAdvisorInsightBinding",
      to: "EX-DRI-5/ExecutiveExperienceDirectorRuntimeScenePresentationBinding",
    }),
    Object.freeze({
      from: "EX-DRI-7/ExecutiveExperienceDirectorRuntimeIntegrationPlatform",
      to: "EX-DRI-6/ExecutiveExperienceDirectorRuntimeAdvisorInsightBinding",
    }),
  ] as const);

export const EXECUTIVE_DIRECTOR_RUNTIME_DRI_CONSUMER_ENTRY =
  "@/app/lib/dri/directorRuntimeConsumerIntegrationPublicIndex" as const;

// ─── Identity ───────────────────────────────────────────────────────────────

export const executiveExperienceDirectorRuntimeIntegrationPlatformIdentity =
  "EX-DRI-7/ExecutiveExperienceDirectorRuntimeIntegrationPlatform" as const;

export const executiveExperienceDirectorRuntimeIntegrationPlatformVersion =
  "1.7.0" as const;

export const executiveExperienceDirectorRuntimeIntegrationPlatformNamespace =
  "nexora.ex.dri.integration.platform" as const;

export const executiveExperienceDirectorRuntimeIntegrationPlatformArchitecturalRole =
  "ExecutiveExperienceDirectorRuntimeIntegrationPlatform" as const;

export const executiveExperienceDirectorRuntimeIntegrationPlatformDependencyIdentity =
  executiveExperienceDirectorRuntimeAdvisorInsightBindingIdentity;

export const executiveExperienceDirectorRuntimeIntegrationPlatformDependencyPath =
  "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeAdvisorInsightBinding" as const;

export const executiveExperienceDirectorRuntimeIntegrationPlatformDirection =
  "ex-dri-bidirectional-integration-platform" as const;

export const executiveExperienceDirectorRuntimeIntegrationPlatformDeterministic =
  true as const;

export const executiveExperienceDirectorRuntimeIntegrationPlatformStateless =
  true as const;

export const executiveExperienceDirectorRuntimeIntegrationPlatformOrchestrationPolicy =
  "compose-request-preparation-and-response-processing" as const;

export const executiveExperienceDirectorRuntimeIntegrationPlatformRendererIndependent =
  true as const;

export const executiveExperienceDirectorRuntimeIntegrationPlatformFrameworkIndependent =
  true as const;

export const executiveExperienceDirectorRuntimeIntegrationPlatformMutationPolicy =
  "immutable" as const;

export const executiveExperienceDirectorRuntimeIntegrationPlatformSideEffectPolicy =
  "side-effect-free" as const;

export const executiveExperienceDirectorRuntimeIntegrationPlatformCanonicalIdentity =
  Object.freeze({
    identity:
      executiveExperienceDirectorRuntimeIntegrationPlatformIdentity,
    version:
      executiveExperienceDirectorRuntimeIntegrationPlatformVersion,
    namespace:
      executiveExperienceDirectorRuntimeIntegrationPlatformNamespace,
    architecturalRole:
      executiveExperienceDirectorRuntimeIntegrationPlatformArchitecturalRole,
    dependencyIdentity:
      executiveExperienceDirectorRuntimeIntegrationPlatformDependencyIdentity,
    integrationDirection:
      executiveExperienceDirectorRuntimeIntegrationPlatformDirection,
    deterministicStatus:
      executiveExperienceDirectorRuntimeIntegrationPlatformDeterministic,
    statelessStatus:
      executiveExperienceDirectorRuntimeIntegrationPlatformStateless,
    orchestrationPolicy:
      executiveExperienceDirectorRuntimeIntegrationPlatformOrchestrationPolicy,
    rendererIndependence:
      executiveExperienceDirectorRuntimeIntegrationPlatformRendererIndependent,
    frameworkIndependence:
      executiveExperienceDirectorRuntimeIntegrationPlatformFrameworkIndependent,
    mutationPolicy:
      executiveExperienceDirectorRuntimeIntegrationPlatformMutationPolicy,
    sideEffectPolicy:
      executiveExperienceDirectorRuntimeIntegrationPlatformSideEffectPolicy,
  });

export const EXECUTIVE_INTEGRATION_PLATFORM_PRINCIPLE =
  "EX captures state and interaction. EX-DRI normalizes and binds. DRI interprets and decides. EX-DRI projects the resolved meaning. EX application / renderer applies and displays." as const;

// ─── Vocabulary ─────────────────────────────────────────────────────────────

export const EXECUTIVE_INTEGRATION_PLATFORM_SURFACES =
  EXECUTIVE_SCENE_PRESENTATION_BINDING_SURFACES;

export type { ExecutiveExperienceSurface };

export const EXECUTIVE_INTEGRATION_PLATFORM_PRESENTATION_STATES =
  EXECUTIVE_SCENE_PRESENTATION_BINDING_PRESENTATION_STATES;

export type { ExecutivePresentationState };

export const EXECUTIVE_INTEGRATION_PLATFORM_DIRECTION_OWNERS = Object.freeze({
  scene: "EX-DRI-5",
  focus: "EX-DRI-5",
  attention: "EX-DRI-5",
  presentation: "EX-DRI-5",
  guidance: "EX-DRI-6",
  coordination: "EX-DRI-6",
  interaction: "deferred",
} as const);

export type ExecutiveIntegrationPlatformDirectionKind =
  keyof typeof EXECUTIVE_INTEGRATION_PLATFORM_DIRECTION_OWNERS;

export type ExecutiveIntegrationPlatformDirectionOwner =
  (typeof EXECUTIVE_INTEGRATION_PLATFORM_DIRECTION_OWNERS)[ExecutiveIntegrationPlatformDirectionKind];

export const EXECUTIVE_INTEGRATION_PLATFORM_DIRECTION_KINDS = Object.freeze([
  "scene",
  "focus",
  "attention",
  "presentation",
  "guidance",
  "coordination",
  "interaction",
] as const);

export const EXECUTIVE_INTEGRATION_PLATFORM_PREPARATION_STATUSES =
  Object.freeze(["prepared", "noop", "rejected"] as const);

export type ExecutiveDirectorRuntimePreparationStatus =
  (typeof EXECUTIVE_INTEGRATION_PLATFORM_PREPARATION_STATUSES)[number];

export const EXECUTIVE_INTEGRATION_PLATFORM_RESPONSE_STATUSES = Object.freeze([
  "resolved",
  "partial",
  "rejected",
  "noop",
] as const);

export type ExecutiveDirectorRuntimePlatformResponseStatus =
  (typeof EXECUTIVE_INTEGRATION_PLATFORM_RESPONSE_STATUSES)[number];

export const EXECUTIVE_INTEGRATION_PLATFORM_ISSUE_SOURCES = Object.freeze([
  "context-binding",
  "interaction-binding",
  "scene-presentation-binding",
  "advisor-insight-binding",
  "platform",
] as const);

export type ExecutiveDirectorRuntimePlatformIssueSource =
  (typeof EXECUTIVE_INTEGRATION_PLATFORM_ISSUE_SOURCES)[number];

export const EXECUTIVE_INTEGRATION_PLATFORM_ISSUE_CODES = Object.freeze([
  "INVALID_PLATFORM_INPUT",
  "CONTEXT_BINDING_FAILED",
  "INTERACTION_BINDING_FAILED",
  "INVALID_RUNTIME_RESPONSE",
  "CORRELATION_MISMATCH",
  "VISUAL_BINDING_FAILED",
  "ADVISOR_INSIGHT_BINDING_FAILED",
  "PARTIAL_PROJECTION",
  "UNSUPPORTED_DIRECTION",
  "INVALID_UNIFIED_PROJECTION",
] as const);

export type ExecutiveDirectorRuntimePlatformIssueCode =
  (typeof EXECUTIVE_INTEGRATION_PLATFORM_ISSUE_CODES)[number];

export const EXECUTIVE_INTEGRATION_PLATFORM_CHANGE_KINDS = Object.freeze([
  "visual",
  "advisor",
  "insight",
  "coordination",
] as const);

export type ExecutiveDirectorRuntimeUnifiedProjectionChangeKind =
  (typeof EXECUTIVE_INTEGRATION_PLATFORM_CHANGE_KINDS)[number];

export const EXECUTIVE_INTEGRATION_PLATFORM_COMPATIBILITY = Object.freeze([
  Object.freeze({
    from: "EX State",
    to: "EX-DRI-3",
    relation: "context-binding",
  }),
  Object.freeze({
    from: "EX Interaction",
    to: "EX-DRI-4",
    relation: "interaction-binding",
  }),
  Object.freeze({
    from: "DRI Visual Directions",
    to: "EX-DRI-5",
    relation: "scene-presentation-binding",
  }),
  Object.freeze({
    from: "DRI Guidance/Coordination",
    to: "EX-DRI-6",
    relation: "advisor-insight-binding",
  }),
  Object.freeze({
    from: "Unified Cycle",
    to: "EX-DRI-7",
    relation: "integration-platform",
  }),
] as const);

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface ExecutiveDirectorRuntimePlatformInteractionInput {
  readonly interactionId: string;
  readonly kind: ExecutiveInteractionKind;
  readonly surface: ExecutiveExperienceSurface;
  readonly subject?: ExecutiveDirectorRuntimeSubjectContract;
}

export interface ExecutiveDirectorRuntimePlatformInput {
  readonly state: ExecutiveExperienceCompositeStateSnapshot;
  readonly correlation: ExecutiveDirectorRuntimeCorrelation;
  readonly interaction?: ExecutiveDirectorRuntimePlatformInteractionInput;
}

export interface ExecutiveDirectorRuntimePlatformIssue {
  readonly code: ExecutiveDirectorRuntimePlatformIssueCode;
  readonly source: ExecutiveDirectorRuntimePlatformIssueSource;
  readonly upstreamCode?: string;
  readonly path?: string;
  readonly message?: string;
}

export interface ExecutiveDirectorRuntimePreparedRequest {
  readonly status: ExecutiveDirectorRuntimePreparationStatus;
  readonly contextBinding?: ExecutiveExperienceContextBindingResult;
  readonly request?: ExecutiveDirectorRuntimeRequestContract;
  readonly issues: ReadonlyArray<ExecutiveDirectorRuntimePlatformIssue>;
}

export interface ExecutiveDirectorRuntimeUnifiedProjection {
  readonly visual: ExecutiveScenePresentationProjection;
  readonly advisorInsight: ExecutiveAdvisorInsightProjection;
}

export interface ExecutiveDirectorRuntimePlatformResponseResult {
  readonly status: ExecutiveDirectorRuntimePlatformResponseStatus;
  readonly projection?: ExecutiveDirectorRuntimeUnifiedProjection;
  readonly visualResult: ExecutiveScenePresentationBindingResult;
  readonly advisorInsightResult: ExecutiveAdvisorInsightBindingResult;
  readonly issues: ReadonlyArray<ExecutiveDirectorRuntimePlatformIssue>;
}

export interface ExecutiveDirectorRuntimeCycleCorrelation {
  readonly request: ExecutiveDirectorRuntimeCorrelation;
  readonly response?: ExecutiveDirectorRuntimeCorrelation;
}

export interface ExecutiveDirectorRuntimeIntegrationCycle {
  readonly preparedRequest: ExecutiveDirectorRuntimePreparedRequest;
  readonly runtimeResponse?: ExecutiveDirectorRuntimeResponseContract;
  readonly processedResponse?: ExecutiveDirectorRuntimePlatformResponseResult;
}

export interface ExecutiveDirectorRuntimeUnifiedProjectionDiff {
  readonly changed: boolean;
  readonly changes: ReadonlyArray<ExecutiveDirectorRuntimeUnifiedProjectionChangeKind>;
}

export interface ExecutiveDirectorRuntimeIntegrationCycleDiff {
  readonly changed: boolean;
  readonly requestChanged: boolean;
  readonly responseChanged: boolean;
  readonly projectionChanged: boolean;
  readonly changes: ReadonlyArray<ExecutiveDirectorRuntimeUnifiedProjectionChangeKind>;
}

// ─── Guarantees ─────────────────────────────────────────────────────────────

export const EXECUTIVE_INTEGRATION_PLATFORM_GUARANTEES = Object.freeze([
  Object.freeze({ id: "ex-state-never-reaches-dri-directly", order: 1, statement: "EX application state never reaches DRI directly." }),
  Object.freeze({ id: "context-through-ex-dri-3", order: 2, statement: "Semantic context is produced through EX-DRI-3." }),
  Object.freeze({ id: "interaction-through-ex-dri-4", order: 3, statement: "Semantic interactions are produced through EX-DRI-4." }),
  Object.freeze({ id: "visual-through-ex-dri-5", order: 4, statement: "Visual directions are processed through EX-DRI-5." }),
  Object.freeze({ id: "advisor-insight-through-ex-dri-6", order: 5, statement: "Advisor/Insight directions are processed through EX-DRI-6." }),
  Object.freeze({ id: "platform-composes-not-duplicates", order: 6, statement: "EX-DRI-7 composes rather than duplicates lower-layer behavior." }),
  Object.freeze({ id: "dri-authoritative-runtime", order: 7, statement: "DRI remains authoritative for runtime interpretation." }),
  Object.freeze({ id: "ex-authoritative-rendering", order: 8, statement: "EX remains authoritative for final rendering." }),
  Object.freeze({ id: "preparation-does-not-execute-dri", order: 9, statement: "Platform preparation does not execute DRI." }),
  Object.freeze({ id: "response-does-not-mutate-ex", order: 10, statement: "Platform response processing does not mutate EX." }),
  Object.freeze({ id: "correlation-preserved", order: 11, statement: "Correlation is preserved." }),
  Object.freeze({ id: "subject-identity-preserved", order: 12, statement: "Subject identity is preserved." }),
  Object.freeze({ id: "selection-focus-distinct", order: 13, statement: "Selection and focus remain distinct." }),
  Object.freeze({ id: "presentation-states-canonical", order: 14, statement: "Presentation states remain minimum/report/operation." }),
  Object.freeze({ id: "six-surfaces-canonical", order: 15, statement: "All six Executive surfaces remain canonical." }),
  Object.freeze({ id: "unsupported-directions-explicit", order: 16, statement: "Unsupported directions are explicit." }),
  Object.freeze({ id: "deferred-directions-explicit", order: 17, statement: "Deferred directions are explicit." }),
  Object.freeze({ id: "runtime-response-status-preserved", order: 18, statement: "Runtime response status is preserved." }),
  Object.freeze({ id: "partial-remains-partial", order: 19, statement: "Partial responses remain partial." }),
  Object.freeze({ id: "rejected-no-fabrication", order: 20, statement: "Rejected responses do not fabricate projections." }),
  Object.freeze({ id: "noop-no-fabrication", order: 21, statement: "Noop responses do not fabricate changes." }),
  Object.freeze({ id: "no-ai-inference", order: 22, statement: "No AI inference occurs." }),
  Object.freeze({ id: "no-natural-language-guidance", order: 23, statement: "No natural-language guidance generation occurs." }),
  Object.freeze({ id: "no-kpi-calculation", order: 24, statement: "No KPI calculation occurs." }),
  Object.freeze({ id: "no-koi-calculation", order: 25, statement: "No KOI calculation occurs." }),
  Object.freeze({ id: "no-react-objects", order: 26, statement: "No React objects cross the platform." }),
  Object.freeze({ id: "no-threejs-objects", order: 27, statement: "No Three.js objects cross the platform." }),
  Object.freeze({ id: "no-dom-objects", order: 28, statement: "No DOM objects cross the platform." }),
  Object.freeze({ id: "no-renderer-logic", order: 29, statement: "No renderer logic exists in the platform." }),
  Object.freeze({ id: "no-ui-store", order: 30, statement: "No UI store exists in the platform." }),
  Object.freeze({ id: "inputs-never-mutated", order: 31, statement: "Inputs are never mutated." }),
  Object.freeze({ id: "outputs-immutable", order: 32, statement: "Outputs are immutable." }),
  Object.freeze({ id: "platform-deterministic", order: 33, statement: "Platform functions are deterministic." }),
  Object.freeze({ id: "platform-stateless", order: 34, statement: "Platform functions are stateless." }),
  Object.freeze({ id: "platform-framework-independent", order: 35, statement: "Platform behavior is framework-independent." }),
  Object.freeze({ id: "no-dri-engine", order: 36, statement: "EX-DRI-7 contains no Director Runtime engine." }),
] as const);

export type ExecutiveIntegrationPlatformGuarantee =
  (typeof EXECUTIVE_INTEGRATION_PLATFORM_GUARANTEES)[number];

export const EXECUTIVE_INTEGRATION_PLATFORM_CONSUMER_INFORMATION =
  Object.freeze({
    consumerRole: "ExecutiveDirectorRuntimeIntegrationPlatform" as const,
    intendedConsumer:
      "future Executive application adapters" as const,
    publicEntryPhase: "EX-DRI-9" as const,
    freezePhase: "EX-DRI-8" as const,
    note: "EX-DRI-7 is the semantic integration platform but not yet the final public consumer entry." as const,
  });

// ─── Internal helpers ───────────────────────────────────────────────────────

type PlainObject = Record<string, unknown>;

function isPlainObject(value: unknown): value is PlainObject {
  if (value === null || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function issue(
  code: ExecutiveDirectorRuntimePlatformIssueCode,
  source: ExecutiveDirectorRuntimePlatformIssueSource,
  options: {
    readonly upstreamCode?: string;
    readonly path?: string;
    readonly message?: string;
  } = {},
): ExecutiveDirectorRuntimePlatformIssue {
  return Object.freeze({
    code,
    source,
    ...(options.upstreamCode !== undefined
      ? { upstreamCode: options.upstreamCode }
      : {}),
    ...(options.path !== undefined ? { path: options.path } : {}),
    ...(options.message !== undefined ? { message: options.message } : {}),
  });
}

function emptyVisualProjection(): ExecutiveScenePresentationProjection {
  return Object.freeze({
    focus: Object.freeze([]),
    attention: Object.freeze([]),
    presentation: Object.freeze([]),
  });
}

function emptyAdvisorInsightProjection(): ExecutiveAdvisorInsightProjection {
  return createExecutiveAdvisorInsightProjection({});
}

function emptyVisualResult(
  status: ExecutiveScenePresentationBindingResult["status"] = "noop",
): ExecutiveScenePresentationBindingResult {
  return Object.freeze({
    status,
    ...(status === "noop" || status === "rejected"
      ? {}
      : { projection: emptyVisualProjection() }),
    issues: Object.freeze([]),
    deferredDirections: Object.freeze([]),
  });
}

function emptyAdvisorInsightResult(
  status: ExecutiveAdvisorInsightBindingResult["status"] = "noop",
): ExecutiveAdvisorInsightBindingResult {
  return Object.freeze({
    status,
    ...(status === "noop" || status === "rejected"
      ? {}
      : { projection: emptyAdvisorInsightProjection() }),
    issues: Object.freeze([]),
    deferredDirections: Object.freeze([]),
  });
}

function isInteractionKind(value: unknown): value is ExecutiveInteractionKind {
  return (
    typeof value === "string" &&
    [
      "select",
      "focus",
      "activate",
      "open",
      "close",
      "expand",
      "collapse",
      "dismiss",
      "hover",
      "navigate",
      "inspect",
    ].includes(value)
  );
}

function isSurface(value: unknown): value is ExecutiveExperienceSurface {
  return (EXECUTIVE_INTEGRATION_PLATFORM_SURFACES as readonly unknown[]).includes(
    value,
  );
}

function mapContextIssues(
  contextBinding: ExecutiveExperienceContextBindingResult,
): ExecutiveDirectorRuntimePlatformIssue[] {
  return contextBinding.issues.map((entry) =>
    issue("CONTEXT_BINDING_FAILED", "context-binding", {
      upstreamCode: entry.code,
      path: entry.path,
      message: entry.message,
    }),
  );
}

// ─── Direction routing ──────────────────────────────────────────────────────

export function getExecutiveIntegrationPlatformDirectionOwner(
  kind: unknown,
): ExecutiveIntegrationPlatformDirectionOwner | "unsupported" {
  if (
    typeof kind === "string" &&
    Object.prototype.hasOwnProperty.call(
      EXECUTIVE_INTEGRATION_PLATFORM_DIRECTION_OWNERS,
      kind,
    )
  ) {
    return EXECUTIVE_INTEGRATION_PLATFORM_DIRECTION_OWNERS[
      kind as ExecutiveIntegrationPlatformDirectionKind
    ];
  }
  return "unsupported";
}

// ─── Correlation ────────────────────────────────────────────────────────────

export function validateExecutiveDirectorRuntimeCycleCorrelation(
  cycle: ExecutiveDirectorRuntimeCycleCorrelation,
): ReadonlyArray<ExecutiveDirectorRuntimePlatformIssue> {
  if (!isPlainObject(cycle as unknown)) {
    return Object.freeze([
      issue("INVALID_PLATFORM_INPUT", "platform", {
        message: "cycle correlation must be a plain object",
      }),
    ]);
  }
  if (!isExecutiveDirectorRuntimeCorrelation(cycle.request)) {
    return Object.freeze([
      issue("INVALID_PLATFORM_INPUT", "platform", {
        path: "request",
        message: "request correlation is invalid",
      }),
    ]);
  }
  if (cycle.response === undefined) {
    return Object.freeze([]);
  }
  if (!isExecutiveDirectorRuntimeCorrelation(cycle.response)) {
    return Object.freeze([
      issue("INVALID_RUNTIME_RESPONSE", "platform", {
        path: "response",
        message: "response correlation is invalid",
      }),
    ]);
  }
  if (cycle.request.correlationId !== cycle.response.correlationId) {
    return Object.freeze([
      issue("CORRELATION_MISMATCH", "platform", {
        message: `request correlation ${cycle.request.correlationId} does not match response correlation ${cycle.response.correlationId}`,
      }),
    ]);
  }
  return Object.freeze([]);
}

// ─── Validators ─────────────────────────────────────────────────────────────

export function isExecutiveDirectorRuntimePlatformInteractionInput(
  value: unknown,
): value is ExecutiveDirectorRuntimePlatformInteractionInput {
  if (!isPlainObject(value)) return false;
  if (typeof value.interactionId !== "string" || value.interactionId.length === 0) {
    return false;
  }
  if (!isInteractionKind(value.kind)) return false;
  if (!isSurface(value.surface)) return false;
  if (
    value.subject !== undefined &&
    !isExecutiveDirectorRuntimeSubjectContract(value.subject)
  ) {
    return false;
  }
  return true;
}

export function isExecutiveDirectorRuntimePlatformInput(
  value: unknown,
): value is ExecutiveDirectorRuntimePlatformInput {
  if (!isPlainObject(value)) return false;
  if (!isExecutiveExperienceCompositeStateSnapshot(value.state)) return false;
  if (!isExecutiveDirectorRuntimeCorrelation(value.correlation)) return false;
  if (
    value.interaction !== undefined &&
    !isExecutiveDirectorRuntimePlatformInteractionInput(value.interaction)
  ) {
    return false;
  }
  return true;
}

export function isExecutiveDirectorRuntimePreparedRequest(
  value: unknown,
): value is ExecutiveDirectorRuntimePreparedRequest {
  if (!isPlainObject(value)) return false;
  if (
    !(EXECUTIVE_INTEGRATION_PLATFORM_PREPARATION_STATUSES as readonly unknown[]).includes(
      value.status,
    )
  ) {
    return false;
  }
  if (!Array.isArray(value.issues)) return false;
  if (
    value.request !== undefined &&
    !isExecutiveDirectorRuntimeRequestContract(value.request)
  ) {
    return false;
  }
  return true;
}

export function isExecutiveDirectorRuntimeUnifiedProjection(
  value: unknown,
): value is ExecutiveDirectorRuntimeUnifiedProjection {
  if (!isPlainObject(value)) return false;
  return (
    isExecutiveScenePresentationProjection(value.visual) &&
    isExecutiveAdvisorInsightProjection(value.advisorInsight)
  );
}

export function isExecutiveDirectorRuntimePlatformResponseResult(
  value: unknown,
): value is ExecutiveDirectorRuntimePlatformResponseResult {
  if (!isPlainObject(value)) return false;
  if (
    !(EXECUTIVE_INTEGRATION_PLATFORM_RESPONSE_STATUSES as readonly unknown[]).includes(
      value.status,
    )
  ) {
    return false;
  }
  if (!Array.isArray(value.issues)) return false;
  if (!isExecutiveScenePresentationBindingResult(value.visualResult)) {
    return false;
  }
  if (!isExecutiveAdvisorInsightBindingResult(value.advisorInsightResult)) {
    return false;
  }
  if (
    value.projection !== undefined &&
    !isExecutiveDirectorRuntimeUnifiedProjection(value.projection)
  ) {
    return false;
  }
  return true;
}

export function isExecutiveDirectorRuntimeIntegrationCycle(
  value: unknown,
): value is ExecutiveDirectorRuntimeIntegrationCycle {
  if (!isPlainObject(value)) return false;
  if (!isExecutiveDirectorRuntimePreparedRequest(value.preparedRequest)) {
    return false;
  }
  if (
    value.runtimeResponse !== undefined &&
    !isExecutiveDirectorRuntimeResponseContract(value.runtimeResponse)
  ) {
    return false;
  }
  if (
    value.processedResponse !== undefined &&
    !isExecutiveDirectorRuntimePlatformResponseResult(value.processedResponse)
  ) {
    return false;
  }
  return true;
}

// ─── Normalization ──────────────────────────────────────────────────────────

export function normalizeExecutiveDirectorRuntimePlatformInput(
  input: ExecutiveDirectorRuntimePlatformInput,
): ExecutiveDirectorRuntimePlatformInput {
  if (!isExecutiveDirectorRuntimePlatformInput(input)) {
    throw new TypeError("INVALID_PLATFORM_INPUT");
  }
  const state = normalizeExecutiveExperienceCompositeState(input.state);
  const correlation = createExecutiveDirectorRuntimeCorrelation(
    input.correlation,
  );
  return Object.freeze({
    state,
    correlation,
    ...(input.interaction !== undefined
      ? {
          interaction: Object.freeze({
            interactionId: input.interaction.interactionId,
            kind: input.interaction.kind,
            surface: input.interaction.surface,
            ...(input.interaction.subject !== undefined
              ? {
                  subject: createExecutiveDirectorRuntimeSubjectContract(
                    input.interaction.subject,
                  ),
                }
              : {}),
          }),
        }
      : {}),
  });
}

export function normalizeExecutiveDirectorRuntimeUnifiedProjection(
  projection: ExecutiveDirectorRuntimeUnifiedProjection,
): ExecutiveDirectorRuntimeUnifiedProjection {
  if (!isExecutiveDirectorRuntimeUnifiedProjection(projection)) {
    throw new TypeError("INVALID_UNIFIED_PROJECTION");
  }
  return Object.freeze({
    visual: projection.visual,
    advisorInsight: projection.advisorInsight,
  });
}

// ─── Request preparation ────────────────────────────────────────────────────

export function prepareExecutiveDirectorRuntimeRequest(
  input: unknown,
): ExecutiveDirectorRuntimePreparedRequest {
  if (!isExecutiveDirectorRuntimePlatformInput(input)) {
    return Object.freeze({
      status: "rejected" as const,
      issues: Object.freeze([
        issue("INVALID_PLATFORM_INPUT", "platform", {
          message: "platform input must be a valid ExecutiveDirectorRuntimePlatformInput",
        }),
      ]),
    });
  }

  const normalized = normalizeExecutiveDirectorRuntimePlatformInput(input);
  const contextBinding = bindExecutiveExperienceCompositeState(normalized.state);

  if (!contextBinding.valid || contextBinding.activeContext === undefined) {
    return Object.freeze({
      status: "rejected" as const,
      contextBinding,
      issues: Object.freeze(mapContextIssues(contextBinding)),
    });
  }

  const correlation = createExecutiveDirectorRuntimeCorrelation(
    normalized.correlation,
  );

  if (normalized.interaction === undefined) {
    const request = createExecutiveDirectorRuntimeRequest({
      direction: "ex-to-dri",
      kind: "context",
      correlation,
      context: contextBinding.activeContext,
    });
    return Object.freeze({
      status: "prepared" as const,
      contextBinding,
      request,
      issues: Object.freeze([]),
    });
  }

  const interactionBinding = bindExecutiveInteractionToDirectorRuntimeRequest({
    interactionId: normalized.interaction.interactionId,
    kind: normalized.interaction.kind,
    surface: normalized.interaction.surface,
    ...(normalized.interaction.subject !== undefined
      ? { subject: normalized.interaction.subject }
      : {}),
    context: contextBinding.activeContext,
    correlation,
  });

  if (interactionBinding.status === "rejected") {
    return Object.freeze({
      status: "rejected" as const,
      contextBinding,
      issues: Object.freeze(
        interactionBinding.issues.map((entry) =>
          issue("INTERACTION_BINDING_FAILED", "interaction-binding", {
            upstreamCode: entry.code,
            path: entry.path,
            message: entry.message,
          }),
        ),
      ),
    });
  }

  if (interactionBinding.status === "noop") {
    return Object.freeze({
      status: "noop" as const,
      contextBinding,
      issues: Object.freeze([]),
    });
  }

  return Object.freeze({
    status: "prepared" as const,
    contextBinding,
    request: interactionBinding.request,
    issues: Object.freeze([]),
  });
}

// ─── Response processing ────────────────────────────────────────────────────

export function processDirectorRuntimeResponseForExecutiveExperience(
  response: unknown,
  options: {
    readonly requestCorrelation?: ExecutiveDirectorRuntimeCorrelation;
  } = {},
): ExecutiveDirectorRuntimePlatformResponseResult {
  if (!isExecutiveDirectorRuntimeResponseContract(response)) {
    return Object.freeze({
      status: "rejected" as const,
      visualResult: emptyVisualResult("rejected"),
      advisorInsightResult: emptyAdvisorInsightResult("rejected"),
      issues: Object.freeze([
        issue("INVALID_RUNTIME_RESPONSE", "platform", {
          message: "response must be a valid dri-to-ex response contract",
        }),
      ]),
    });
  }

  if (response.direction !== "dri-to-ex") {
    return Object.freeze({
      status: "rejected" as const,
      visualResult: emptyVisualResult("rejected"),
      advisorInsightResult: emptyAdvisorInsightResult("rejected"),
      issues: Object.freeze([
        issue("INVALID_RUNTIME_RESPONSE", "platform", {
          message: "response.direction must be dri-to-ex",
        }),
      ]),
    });
  }

  const issues: ExecutiveDirectorRuntimePlatformIssue[] = [];

  if (options.requestCorrelation !== undefined) {
    issues.push(
      ...validateExecutiveDirectorRuntimeCycleCorrelation({
        request: options.requestCorrelation,
        response: response.correlation,
      }),
    );
  }

  if (response.status === "rejected") {
    return Object.freeze({
      status: "rejected" as const,
      visualResult: emptyVisualResult("rejected"),
      advisorInsightResult: emptyAdvisorInsightResult("rejected"),
      issues: Object.freeze([
        ...issues,
        issue("INVALID_RUNTIME_RESPONSE", "platform", {
          message: "upstream runtime response status is rejected",
        }),
      ]),
    });
  }

  if (response.status === "noop") {
    return Object.freeze({
      status: "noop" as const,
      visualResult: emptyVisualResult("noop"),
      advisorInsightResult: emptyAdvisorInsightResult("noop"),
      issues: Object.freeze(issues),
    });
  }

  // Canonical direction routing: partition before lower-layer binding so each
  // layer only receives its owned directions (no cross-layer deferred noise).
  const visualDirections: ExecutiveRuntimeDirectionContract[] = [];
  const advisorInsightDirections: ExecutiveRuntimeDirectionContract[] = [];
  const deferredDirections: ExecutiveRuntimeDirectionContract[] = [];

  for (const direction of response.directions) {
    if (!isExecutiveRuntimeDirectionContract(direction)) {
      issues.push(
        issue("UNSUPPORTED_DIRECTION", "platform", {
          message: "direction must be a valid runtime direction contract",
        }),
      );
      continue;
    }
    const owner = getExecutiveIntegrationPlatformDirectionOwner(direction.kind);
    if (owner === "EX-DRI-5") {
      visualDirections.push(direction);
    } else if (owner === "EX-DRI-6") {
      advisorInsightDirections.push(direction);
    } else if (owner === "deferred") {
      deferredDirections.push(direction);
    } else {
      issues.push(
        issue("UNSUPPORTED_DIRECTION", "platform", {
          message: `direction kind ${direction.kind} is unsupported`,
        }),
      );
    }
  }

  const visualResult =
    visualDirections.length === 0
      ? emptyVisualResult("noop")
      : bindDirectorRuntimeDirectionsToExecutiveScenePresentation(
          visualDirections,
        );
  const advisorInsightResult =
    advisorInsightDirections.length === 0
      ? emptyAdvisorInsightResult("noop")
      : bindDirectorRuntimeDirectionsToExecutiveAdvisorInsight(
          advisorInsightDirections,
        );

  if (visualResult.status === "rejected") {
    for (const entry of visualResult.issues) {
      issues.push(
        issue("VISUAL_BINDING_FAILED", "scene-presentation-binding", {
          upstreamCode: entry.code,
          path: entry.path,
          message: entry.message,
        }),
      );
    }
  }

  if (advisorInsightResult.status === "rejected") {
    for (const entry of advisorInsightResult.issues) {
      issues.push(
        issue("ADVISOR_INSIGHT_BINDING_FAILED", "advisor-insight-binding", {
          upstreamCode: entry.code,
          path: entry.path,
          message: entry.message,
        }),
      );
    }
  }

  if (
    visualResult.status === "rejected" ||
    advisorInsightResult.status === "rejected" ||
    issues.some(
      (entry) =>
        entry.code === "CORRELATION_MISMATCH" ||
        entry.code === "UNSUPPORTED_DIRECTION",
    )
  ) {
    return Object.freeze({
      status: "rejected" as const,
      visualResult,
      advisorInsightResult,
      issues: Object.freeze(issues),
    });
  }

  const hasOwnedProjection =
    visualResult.status === "bound" ||
    visualResult.status === "partial" ||
    advisorInsightResult.status === "bound" ||
    advisorInsightResult.status === "partial";

  if (!hasOwnedProjection && deferredDirections.length === 0) {
    return Object.freeze({
      status: response.status === "partial" ? ("partial" as const) : ("noop" as const),
      visualResult,
      advisorInsightResult,
      issues: Object.freeze(issues),
    });
  }

  const visual = visualResult.projection ?? emptyVisualProjection();
  const advisorInsight =
    advisorInsightResult.projection ?? emptyAdvisorInsightProjection();

  const projection = normalizeExecutiveDirectorRuntimeUnifiedProjection({
    visual,
    advisorInsight,
  });

  const bindingPartial =
    visualResult.status === "partial" ||
    advisorInsightResult.status === "partial";
  const responsePartial = response.status === "partial";
  const hasDeferred = deferredDirections.length > 0;

  if (bindingPartial || responsePartial || hasDeferred) {
    if (hasDeferred || bindingPartial) {
      issues.push(
        issue("PARTIAL_PROJECTION", "platform", {
          message:
            "platform projection is partial due to deferred or partially bound directions",
        }),
      );
    }
    const visualResultWithDeferred: ExecutiveScenePresentationBindingResult =
      Object.freeze({
        status: visualResult.status,
        ...(visualResult.projection !== undefined
          ? { projection: visualResult.projection }
          : {}),
        issues: visualResult.issues,
        deferredDirections: Object.freeze([
          ...visualResult.deferredDirections,
          ...deferredDirections,
        ]),
      });

    return Object.freeze({
      status: "partial" as const,
      projection,
      visualResult: visualResultWithDeferred,
      advisorInsightResult,
      issues: Object.freeze(issues),
    });
  }

  return Object.freeze({
    status: "resolved" as const,
    projection,
    visualResult,
    advisorInsightResult,
    issues: Object.freeze(issues),
  });
}

// ─── Cycle helpers ──────────────────────────────────────────────────────────

export function createExecutiveDirectorRuntimeIntegrationCycle(input: {
  readonly preparedRequest: ExecutiveDirectorRuntimePreparedRequest;
  readonly runtimeResponse?: ExecutiveDirectorRuntimeResponseContract;
  readonly processedResponse?: ExecutiveDirectorRuntimePlatformResponseResult;
}): ExecutiveDirectorRuntimeIntegrationCycle {
  return Object.freeze({
    preparedRequest: input.preparedRequest,
    ...(input.runtimeResponse !== undefined
      ? { runtimeResponse: input.runtimeResponse }
      : {}),
    ...(input.processedResponse !== undefined
      ? { processedResponse: input.processedResponse }
      : {}),
  });
}

// ─── Diff / equality ────────────────────────────────────────────────────────

export function areExecutiveDirectorRuntimeUnifiedProjectionsEqual(
  left: ExecutiveDirectorRuntimeUnifiedProjection,
  right: ExecutiveDirectorRuntimeUnifiedProjection,
): boolean {
  return (
    areExecutiveScenePresentationProjectionsEqual(left.visual, right.visual) &&
    areExecutiveAdvisorInsightProjectionsEqual(
      left.advisorInsight,
      right.advisorInsight,
    )
  );
}

export function diffExecutiveDirectorRuntimeUnifiedProjection(
  previous: ExecutiveDirectorRuntimeUnifiedProjection,
  next: ExecutiveDirectorRuntimeUnifiedProjection,
): ExecutiveDirectorRuntimeUnifiedProjectionDiff {
  const changes: ExecutiveDirectorRuntimeUnifiedProjectionChangeKind[] = [];

  const visualDiff = diffExecutiveScenePresentationProjection(
    previous.visual,
    next.visual,
  );
  if (visualDiff.changed) {
    changes.push("visual");
  }

  const advisorInsightDiff = diffExecutiveAdvisorInsightProjection(
    previous.advisorInsight,
    next.advisorInsight,
  );
  if (advisorInsightDiff.changes.includes("advisor-guidance")) {
    changes.push("advisor");
  }
  if (advisorInsightDiff.changes.includes("insight-content")) {
    changes.push("insight");
  }
  if (
    advisorInsightDiff.changes.includes("advisor-coordination") ||
    advisorInsightDiff.changes.includes("insight-coordination")
  ) {
    changes.push("coordination");
  }

  const ordered = EXECUTIVE_INTEGRATION_PLATFORM_CHANGE_KINDS.filter((kind) =>
    changes.includes(kind),
  );

  return Object.freeze({
    changed: ordered.length > 0,
    changes: Object.freeze(ordered),
  });
}

export function diffExecutiveDirectorRuntimeIntegrationCycle(
  previous: ExecutiveDirectorRuntimeIntegrationCycle,
  next: ExecutiveDirectorRuntimeIntegrationCycle,
): ExecutiveDirectorRuntimeIntegrationCycleDiff {
  const previousRequest = previous.preparedRequest.request;
  const nextRequest = next.preparedRequest.request;
  const requestChanged =
    (previousRequest === undefined) !== (nextRequest === undefined) ||
    (previousRequest !== undefined &&
      nextRequest !== undefined &&
      JSON.stringify(previousRequest) !== JSON.stringify(nextRequest));

  const previousResponse = previous.runtimeResponse;
  const nextResponse = next.runtimeResponse;
  const responseChanged =
    (previousResponse === undefined) !== (nextResponse === undefined) ||
    (previousResponse !== undefined &&
      nextResponse !== undefined &&
      JSON.stringify(previousResponse) !== JSON.stringify(nextResponse));

  const previousProjection = previous.processedResponse?.projection;
  const nextProjection = next.processedResponse?.projection;
  let projectionChanged = false;
  let changes: ReadonlyArray<ExecutiveDirectorRuntimeUnifiedProjectionChangeKind> =
    Object.freeze([]);

  if ((previousProjection === undefined) !== (nextProjection === undefined)) {
    projectionChanged = true;
    changes = EXECUTIVE_INTEGRATION_PLATFORM_CHANGE_KINDS;
  } else if (
    previousProjection !== undefined &&
    nextProjection !== undefined
  ) {
    const diff = diffExecutiveDirectorRuntimeUnifiedProjection(
      previousProjection,
      nextProjection,
    );
    projectionChanged = diff.changed;
    changes = diff.changes;
  }

  return Object.freeze({
    changed: requestChanged || responseChanged || projectionChanged,
    requestChanged,
    responseChanged,
    projectionChanged,
    changes,
  });
}

// ─── Catalogs / registry ────────────────────────────────────────────────────

export const EXECUTIVE_INTEGRATION_PLATFORM_PUBLIC_TYPE_NAMES = Object.freeze([
  "ExecutiveDirectorRuntimePlatformInput",
  "ExecutiveDirectorRuntimePlatformInteractionInput",
  "ExecutiveDirectorRuntimePreparedRequest",
  "ExecutiveDirectorRuntimeUnifiedProjection",
  "ExecutiveDirectorRuntimePlatformResponseResult",
  "ExecutiveDirectorRuntimeCycleCorrelation",
  "ExecutiveDirectorRuntimeIntegrationCycle",
  "ExecutiveDirectorRuntimePlatformIssue",
  "ExecutiveDirectorRuntimePlatformIssueCode",
  "ExecutiveDirectorRuntimePlatformIssueSource",
  "ExecutiveDirectorRuntimePreparationStatus",
  "ExecutiveDirectorRuntimePlatformResponseStatus",
  "ExecutiveDirectorRuntimeUnifiedProjectionDiff",
  "ExecutiveDirectorRuntimeIntegrationCycleDiff",
  "ExecutiveExperienceDirectorRuntimeIntegrationPlatformVerification",
] as const);

export const executiveExperienceDirectorRuntimeIntegrationPlatformValidatorNames =
  Object.freeze([
    "isExecutiveDirectorRuntimePlatformInput",
    "isExecutiveDirectorRuntimePlatformInteractionInput",
    "isExecutiveDirectorRuntimePreparedRequest",
    "isExecutiveDirectorRuntimeUnifiedProjection",
    "isExecutiveDirectorRuntimePlatformResponseResult",
    "isExecutiveDirectorRuntimeIntegrationCycle",
    "getExecutiveIntegrationPlatformDirectionOwner",
  ] as const);

export const executiveExperienceDirectorRuntimeIntegrationPlatformApiNames =
  Object.freeze([
    "prepareExecutiveDirectorRuntimeRequest",
    "processDirectorRuntimeResponseForExecutiveExperience",
    "createExecutiveDirectorRuntimeIntegrationCycle",
    "validateExecutiveDirectorRuntimeCycleCorrelation",
    "normalizeExecutiveDirectorRuntimePlatformInput",
    "normalizeExecutiveDirectorRuntimeUnifiedProjection",
    "diffExecutiveDirectorRuntimeUnifiedProjection",
    "diffExecutiveDirectorRuntimeIntegrationCycle",
    "areExecutiveDirectorRuntimeUnifiedProjectionsEqual",
    ...executiveExperienceDirectorRuntimeIntegrationPlatformValidatorNames,
    "getExecutiveExperienceDirectorRuntimeIntegrationPlatformIdentity",
    "verifyExecutiveExperienceDirectorRuntimeIntegrationPlatform",
  ] as const);

export const EXECUTIVE_INTEGRATION_PLATFORM_REGISTRY_SECTIONS = Object.freeze([
  "Identity",
  "RequestPreparation",
  "ResponseProcessing",
  "DirectionRouting",
  "Correlation",
  "UnifiedProjection",
  "Diffing",
  "Validation",
  "IssueCodes",
  "Compatibility",
  "Guarantees",
  "ConsumerInformation",
] as const);

export function getExecutiveExperienceDirectorRuntimeIntegrationPlatformIdentity():
  typeof executiveExperienceDirectorRuntimeIntegrationPlatformCanonicalIdentity {
  return executiveExperienceDirectorRuntimeIntegrationPlatformCanonicalIdentity;
}

export const executiveExperienceDirectorRuntimeIntegrationPlatformRegistry =
  Object.freeze({
    identity:
      executiveExperienceDirectorRuntimeIntegrationPlatformIdentity,
    version:
      executiveExperienceDirectorRuntimeIntegrationPlatformVersion,
    namespace:
      executiveExperienceDirectorRuntimeIntegrationPlatformNamespace,
    architecturalRole:
      executiveExperienceDirectorRuntimeIntegrationPlatformArchitecturalRole,
    dependencyIdentity:
      executiveExperienceDirectorRuntimeIntegrationPlatformDependencyIdentity,
    dependencyPath:
      executiveExperienceDirectorRuntimeIntegrationPlatformDependencyPath,
    principle: EXECUTIVE_INTEGRATION_PLATFORM_PRINCIPLE,
    surfaces: EXECUTIVE_INTEGRATION_PLATFORM_SURFACES,
    surfaceCount: EXECUTIVE_INTEGRATION_PLATFORM_SURFACES.length,
    presentationStates: EXECUTIVE_INTEGRATION_PLATFORM_PRESENTATION_STATES,
    presentationStateCount:
      EXECUTIVE_INTEGRATION_PLATFORM_PRESENTATION_STATES.length,
    directionOwners: EXECUTIVE_INTEGRATION_PLATFORM_DIRECTION_OWNERS,
    directionKindCount: EXECUTIVE_INTEGRATION_PLATFORM_DIRECTION_KINDS.length,
    preparationStatuses: EXECUTIVE_INTEGRATION_PLATFORM_PREPARATION_STATUSES,
    preparationStatusCount:
      EXECUTIVE_INTEGRATION_PLATFORM_PREPARATION_STATUSES.length,
    responseStatuses: EXECUTIVE_INTEGRATION_PLATFORM_RESPONSE_STATUSES,
    responseStatusCount:
      EXECUTIVE_INTEGRATION_PLATFORM_RESPONSE_STATUSES.length,
    issueSources: EXECUTIVE_INTEGRATION_PLATFORM_ISSUE_SOURCES,
    issueSourceCount: EXECUTIVE_INTEGRATION_PLATFORM_ISSUE_SOURCES.length,
    issueCodes: EXECUTIVE_INTEGRATION_PLATFORM_ISSUE_CODES,
    issueCodeCount: EXECUTIVE_INTEGRATION_PLATFORM_ISSUE_CODES.length,
    changeKinds: EXECUTIVE_INTEGRATION_PLATFORM_CHANGE_KINDS,
    changeKindCount: EXECUTIVE_INTEGRATION_PLATFORM_CHANGE_KINDS.length,
    compatibility: EXECUTIVE_INTEGRATION_PLATFORM_COMPATIBILITY,
    compatibilityCount: EXECUTIVE_INTEGRATION_PLATFORM_COMPATIBILITY.length,
    guarantees: EXECUTIVE_INTEGRATION_PLATFORM_GUARANTEES,
    guaranteeCount: EXECUTIVE_INTEGRATION_PLATFORM_GUARANTEES.length,
    consumerInformation:
      EXECUTIVE_INTEGRATION_PLATFORM_CONSUMER_INFORMATION,
    validators:
      executiveExperienceDirectorRuntimeIntegrationPlatformValidatorNames,
    validatorCount:
      executiveExperienceDirectorRuntimeIntegrationPlatformValidatorNames
        .length,
    registrySections: EXECUTIVE_INTEGRATION_PLATFORM_REGISTRY_SECTIONS,
    registrySectionCount:
      EXECUTIVE_INTEGRATION_PLATFORM_REGISTRY_SECTIONS.length,
    publicTypes: EXECUTIVE_INTEGRATION_PLATFORM_PUBLIC_TYPE_NAMES,
    publicTypeCount: EXECUTIVE_INTEGRATION_PLATFORM_PUBLIC_TYPE_NAMES.length,
    publicApis:
      executiveExperienceDirectorRuntimeIntegrationPlatformApiNames,
    publicApiCount:
      executiveExperienceDirectorRuntimeIntegrationPlatformApiNames.length,
  });

export const executiveExperienceDirectorRuntimeIntegrationPlatform =
  Object.freeze({
    phase: "EX-DRI-7" as const,
    name: "ExecutiveExperienceDirectorRuntimeIntegrationPlatform" as const,
    identity:
      executiveExperienceDirectorRuntimeIntegrationPlatformIdentity,
    version:
      executiveExperienceDirectorRuntimeIntegrationPlatformVersion,
    namespace:
      executiveExperienceDirectorRuntimeIntegrationPlatformNamespace,
    architecturalRole:
      executiveExperienceDirectorRuntimeIntegrationPlatformArchitecturalRole,
    role: "IntegrationPlatform" as const,
    stage: "IntegrationPlatform" as const,
    status: "IntegrationPlatformReady" as const,
    upstreamDependency:
      executiveExperienceDirectorRuntimeIntegrationPlatformDependencyIdentity,
    dependencyPath:
      executiveExperienceDirectorRuntimeIntegrationPlatformDependencyPath,
    integrationDirection:
      executiveExperienceDirectorRuntimeIntegrationPlatformDirection,
    deterministic:
      executiveExperienceDirectorRuntimeIntegrationPlatformDeterministic,
    stateless:
      executiveExperienceDirectorRuntimeIntegrationPlatformStateless,
    orchestrationPolicy:
      executiveExperienceDirectorRuntimeIntegrationPlatformOrchestrationPolicy,
    rendererIndependent:
      executiveExperienceDirectorRuntimeIntegrationPlatformRendererIndependent,
    frameworkIndependent:
      executiveExperienceDirectorRuntimeIntegrationPlatformFrameworkIndependent,
    immutable: true as const,
    sideEffectFree: true as const,
    threeJsIndependent: true as const,
    reactIndependent: true as const,
    aiIndependent: true as const,
    browserIndependent: true as const,
    principle: EXECUTIVE_INTEGRATION_PLATFORM_PRINCIPLE,
    directionOwners: EXECUTIVE_INTEGRATION_PLATFORM_DIRECTION_OWNERS,
    surfaces: EXECUTIVE_INTEGRATION_PLATFORM_SURFACES,
    presentationStates: EXECUTIVE_INTEGRATION_PLATFORM_PRESENTATION_STATES,
    guarantees: EXECUTIVE_INTEGRATION_PLATFORM_GUARANTEES,
    compatibility: EXECUTIVE_INTEGRATION_PLATFORM_COMPATIBILITY,
    consumerInformation:
      EXECUTIVE_INTEGRATION_PLATFORM_CONSUMER_INFORMATION,
    publicApiSurface:
      executiveExperienceDirectorRuntimeIntegrationPlatformApiNames,
    publicTypes: EXECUTIVE_INTEGRATION_PLATFORM_PUBLIC_TYPE_NAMES,
    registry:
      executiveExperienceDirectorRuntimeIntegrationPlatformRegistry,
    advisorInsightBindingBoundary:
      "EX-DRI-6-advisor-insight-binding-only" as const,
    architecturalStatus:
      "IntegrationPlatform Complete · Deterministic · Stateless · Framework-Independent · ReadyForExDriIntegrationPlatformFreeze" as const,
  });

// ─── Verification ───────────────────────────────────────────────────────────

export interface ExecutiveExperienceDirectorRuntimeIntegrationPlatformVerification {
  readonly ok: boolean;
  readonly identity: typeof executiveExperienceDirectorRuntimeIntegrationPlatformIdentity;
  readonly version: typeof executiveExperienceDirectorRuntimeIntegrationPlatformVersion;
  readonly namespace: typeof executiveExperienceDirectorRuntimeIntegrationPlatformNamespace;
  readonly architecturalRole: typeof executiveExperienceDirectorRuntimeIntegrationPlatformArchitecturalRole;
  readonly dependencyIdentity: typeof executiveExperienceDirectorRuntimeIntegrationPlatformDependencyIdentity;
  readonly directionKindCount: number;
  readonly surfaceCount: number;
  readonly presentationStateCount: number;
  readonly preparationStatusCount: number;
  readonly responseStatusCount: number;
  readonly issueSourceCount: number;
  readonly issueCodeCount: number;
  readonly guaranteeCount: number;
  readonly registrySectionCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly frozen: boolean;
  readonly advisorInsightBindingBoundaryIntact: boolean;
  readonly frameworkIndependent: boolean;
  readonly directionRoutingComplete: boolean;
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

export function verifyExecutiveExperienceDirectorRuntimeIntegrationPlatform():
  ExecutiveExperienceDirectorRuntimeIntegrationPlatformVerification {
  const layer = executiveExperienceDirectorRuntimeIntegrationPlatform;
  const registry =
    executiveExperienceDirectorRuntimeIntegrationPlatformRegistry;

  const identityOk =
    layer.identity ===
      "EX-DRI-7/ExecutiveExperienceDirectorRuntimeIntegrationPlatform" &&
    layer.version === "1.7.0" &&
    layer.namespace === "nexora.ex.dri.integration.platform" &&
    layer.architecturalRole ===
      "ExecutiveExperienceDirectorRuntimeIntegrationPlatform" &&
    layer.status === "IntegrationPlatformReady" &&
    layer.upstreamDependency ===
      "EX-DRI-6/ExecutiveExperienceDirectorRuntimeAdvisorInsightBinding" &&
    layer.upstreamDependency ===
      executiveExperienceDirectorRuntimeAdvisorInsightBindingIdentity &&
    layer.advisorInsightBindingBoundary ===
      "EX-DRI-6-advisor-insight-binding-only";

  const dependencyOk =
    layer.dependencyPath ===
      "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeAdvisorInsightBinding";

  const directionRoutingComplete =
    exactOrder(EXECUTIVE_INTEGRATION_PLATFORM_DIRECTION_KINDS, [
      "scene",
      "focus",
      "attention",
      "presentation",
      "guidance",
      "coordination",
      "interaction",
    ]) &&
    getExecutiveIntegrationPlatformDirectionOwner("scene") === "EX-DRI-5" &&
    getExecutiveIntegrationPlatformDirectionOwner("focus") === "EX-DRI-5" &&
    getExecutiveIntegrationPlatformDirectionOwner("attention") === "EX-DRI-5" &&
    getExecutiveIntegrationPlatformDirectionOwner("presentation") ===
      "EX-DRI-5" &&
    getExecutiveIntegrationPlatformDirectionOwner("guidance") === "EX-DRI-6" &&
    getExecutiveIntegrationPlatformDirectionOwner("coordination") ===
      "EX-DRI-6" &&
    getExecutiveIntegrationPlatformDirectionOwner("interaction") ===
      "deferred" &&
    getExecutiveIntegrationPlatformDirectionOwner("unknown") === "unsupported";

  const surfacesOk = exactOrder(EXECUTIVE_INTEGRATION_PLATFORM_SURFACES, [
    "stage",
    "advisor",
    "insight",
    "live-lens",
    "timeline",
    "explorer",
  ]);

  const presentationOk = exactOrder(
    EXECUTIVE_INTEGRATION_PLATFORM_PRESENTATION_STATES,
    ["minimum", "report", "operation"],
  );

  const statusesOk =
    exactOrder(EXECUTIVE_INTEGRATION_PLATFORM_PREPARATION_STATUSES, [
      "prepared",
      "noop",
      "rejected",
    ]) &&
    exactOrder(EXECUTIVE_INTEGRATION_PLATFORM_RESPONSE_STATUSES, [
      "resolved",
      "partial",
      "rejected",
      "noop",
    ]);

  const issueSourcesOk =
    exactOrder(EXECUTIVE_INTEGRATION_PLATFORM_ISSUE_SOURCES, [
      "context-binding",
      "interaction-binding",
      "scene-presentation-binding",
      "advisor-insight-binding",
      "platform",
    ]) && unique([...EXECUTIVE_INTEGRATION_PLATFORM_ISSUE_SOURCES]);

  const issueCodesOk =
    exactOrder(EXECUTIVE_INTEGRATION_PLATFORM_ISSUE_CODES, [
      "INVALID_PLATFORM_INPUT",
      "CONTEXT_BINDING_FAILED",
      "INTERACTION_BINDING_FAILED",
      "INVALID_RUNTIME_RESPONSE",
      "CORRELATION_MISMATCH",
      "VISUAL_BINDING_FAILED",
      "ADVISOR_INSIGHT_BINDING_FAILED",
      "PARTIAL_PROJECTION",
      "UNSUPPORTED_DIRECTION",
      "INVALID_UNIFIED_PROJECTION",
    ]) && unique([...EXECUTIVE_INTEGRATION_PLATFORM_ISSUE_CODES]);

  const guaranteesOk =
    EXECUTIVE_INTEGRATION_PLATFORM_GUARANTEES.length === 36 &&
    unique(
      EXECUTIVE_INTEGRATION_PLATFORM_GUARANTEES.map((entry) => entry.id),
    ) &&
    EXECUTIVE_INTEGRATION_PLATFORM_GUARANTEES.every(
      (entry, index) => entry.order === index + 1,
    );

  const registryIntegrityOk =
    registry.directionKindCount ===
      EXECUTIVE_INTEGRATION_PLATFORM_DIRECTION_KINDS.length &&
    registry.surfaceCount ===
      EXECUTIVE_INTEGRATION_PLATFORM_SURFACES.length &&
    registry.presentationStateCount ===
      EXECUTIVE_INTEGRATION_PLATFORM_PRESENTATION_STATES.length &&
    registry.issueSourceCount ===
      EXECUTIVE_INTEGRATION_PLATFORM_ISSUE_SOURCES.length &&
    registry.issueCodeCount ===
      EXECUTIVE_INTEGRATION_PLATFORM_ISSUE_CODES.length &&
    registry.guaranteeCount ===
      EXECUTIVE_INTEGRATION_PLATFORM_GUARANTEES.length &&
    registry.registrySectionCount ===
      EXECUTIVE_INTEGRATION_PLATFORM_REGISTRY_SECTIONS.length &&
    exactOrder(
      [...EXECUTIVE_INTEGRATION_PLATFORM_REGISTRY_SECTIONS],
      [
        "Identity",
        "RequestPreparation",
        "ResponseProcessing",
        "DirectionRouting",
        "Correlation",
        "UnifiedProjection",
        "Diffing",
        "Validation",
        "IssueCodes",
        "Compatibility",
        "Guarantees",
        "ConsumerInformation",
      ],
    );

  const immutabilityOk =
    Object.isFrozen(layer) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(
      executiveExperienceDirectorRuntimeIntegrationPlatformCanonicalIdentity,
    ) &&
    Object.isFrozen(EXECUTIVE_INTEGRATION_PLATFORM_DIRECTION_OWNERS) &&
    Object.isFrozen(EXECUTIVE_INTEGRATION_PLATFORM_ISSUE_CODES) &&
    Object.isFrozen(EXECUTIVE_INTEGRATION_PLATFORM_GUARANTEES) &&
    Object.isFrozen(EXECUTIVE_INTEGRATION_PLATFORM_REGISTRY_SECTIONS);

  const advisorInsightBindingBoundaryIntact =
    layer.upstreamDependency ===
      "EX-DRI-6/ExecutiveExperienceDirectorRuntimeAdvisorInsightBinding" &&
    layer.advisorInsightBindingBoundary ===
      "EX-DRI-6-advisor-insight-binding-only";

  const frameworkIndependent =
    layer.frameworkIndependent === true &&
    layer.rendererIndependent === true &&
    layer.reactIndependent === true &&
    layer.threeJsIndependent === true &&
    layer.aiIndependent === true &&
    layer.stateless === true;

  const ok =
    identityOk &&
    dependencyOk &&
    directionRoutingComplete &&
    surfacesOk &&
    presentationOk &&
    statusesOk &&
    issueSourcesOk &&
    issueCodesOk &&
    guaranteesOk &&
    registryIntegrityOk &&
    immutabilityOk &&
    advisorInsightBindingBoundaryIntact &&
    frameworkIndependent &&
    layer.principle === EXECUTIVE_INTEGRATION_PLATFORM_PRINCIPLE;

  return Object.freeze({
    ok,
    identity:
      executiveExperienceDirectorRuntimeIntegrationPlatformIdentity,
    version:
      executiveExperienceDirectorRuntimeIntegrationPlatformVersion,
    namespace:
      executiveExperienceDirectorRuntimeIntegrationPlatformNamespace,
    architecturalRole:
      executiveExperienceDirectorRuntimeIntegrationPlatformArchitecturalRole,
    dependencyIdentity:
      executiveExperienceDirectorRuntimeIntegrationPlatformDependencyIdentity,
    directionKindCount: EXECUTIVE_INTEGRATION_PLATFORM_DIRECTION_KINDS.length,
    surfaceCount: EXECUTIVE_INTEGRATION_PLATFORM_SURFACES.length,
    presentationStateCount:
      EXECUTIVE_INTEGRATION_PLATFORM_PRESENTATION_STATES.length,
    preparationStatusCount:
      EXECUTIVE_INTEGRATION_PLATFORM_PREPARATION_STATUSES.length,
    responseStatusCount:
      EXECUTIVE_INTEGRATION_PLATFORM_RESPONSE_STATUSES.length,
    issueSourceCount: EXECUTIVE_INTEGRATION_PLATFORM_ISSUE_SOURCES.length,
    issueCodeCount: EXECUTIVE_INTEGRATION_PLATFORM_ISSUE_CODES.length,
    guaranteeCount: EXECUTIVE_INTEGRATION_PLATFORM_GUARANTEES.length,
    registrySectionCount:
      EXECUTIVE_INTEGRATION_PLATFORM_REGISTRY_SECTIONS.length,
    publicTypeCount: EXECUTIVE_INTEGRATION_PLATFORM_PUBLIC_TYPE_NAMES.length,
    publicApiCount:
      executiveExperienceDirectorRuntimeIntegrationPlatformApiNames.length,
    frozen: immutabilityOk,
    advisorInsightBindingBoundaryIntact,
    frameworkIndependent,
    directionRoutingComplete,
  });
}
