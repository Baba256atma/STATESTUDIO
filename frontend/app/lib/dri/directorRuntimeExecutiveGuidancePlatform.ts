/**
 * DRI-7:6 — Director Runtime Executive Guidance Platform.
 *
 * Canonical runtime surface orchestrating Resolution → Composition → Delivery
 * through the DRI-7:5 re-export chain. No new guidance semantics, rendering,
 * Advisor behavior, actions, adapters, or side effects.
 *
 * Principle: Foundation defines vocabulary. Contracts define transport.
 * Resolution decides survival. Composition defines hierarchy. Delivery
 * produces a consumer-ready package. Platform provides the canonical runtime
 * capability for executing and verifying that semantic pipeline.
 */

import {
  composeDirectorExecutiveGuidance,
  deliverDirectorExecutiveGuidance,
  directorRuntimeExecutiveGuidanceDeliveryIdentity,
  resolveDirectorExecutiveGuidance,
  type DirectorRuntimeExecutiveGuidanceComposition,
  type DirectorRuntimeExecutiveGuidanceCompositionPath,
  type DirectorRuntimeExecutiveGuidanceCompositionRelationship,
  type DirectorRuntimeExecutiveGuidanceDeliveryContext,
  type DirectorRuntimeExecutiveGuidanceDeliveryPackage,
  type DirectorRuntimeExecutiveGuidanceDeliveryStatus,
  type DirectorRuntimeExecutiveGuidanceResolution,
  type DirectorRuntimeExecutiveGuidanceResolutionInput,
  type DirectorRuntimeExecutiveGuidanceSemanticDeliveryPolicy,
} from "@/app/lib/dri/directorRuntimeExecutiveGuidanceDelivery";

export type {
  DirectorRuntimeExecutiveGuidanceComposition,
  DirectorRuntimeExecutiveGuidanceCompositionPath,
  DirectorRuntimeExecutiveGuidanceCompositionRelationship,
  DirectorRuntimeExecutiveGuidanceDeliveryContext,
  DirectorRuntimeExecutiveGuidanceDeliveryPackage,
  DirectorRuntimeExecutiveGuidanceDeliveryStatus,
  DirectorRuntimeExecutiveGuidanceResolution,
  DirectorRuntimeExecutiveGuidanceResolutionInput,
  DirectorRuntimeExecutiveGuidanceSemanticDeliveryPolicy,
};

export {
  composeDirectorExecutiveGuidance,
  createDirectorRuntimeExecutiveGuidanceResolutionContext,
  createDirectorRuntimeExecutiveGuidanceResolutionInput,
  deliverDirectorExecutiveGuidance,
  resolveDirectorExecutiveGuidance,
} from "@/app/lib/dri/directorRuntimeExecutiveGuidanceDelivery";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeExecutiveGuidancePlatformIdentity =
  "DRI-7:6/DirectorRuntimeExecutiveGuidancePlatform" as const;
export const directorRuntimeExecutiveGuidancePlatformVersion =
  "7.6.0" as const;
export const directorRuntimeExecutiveGuidancePlatformNamespace =
  "nexora.dri.executive-guidance.platform" as const;
export const directorRuntimeExecutiveGuidancePlatformUpstream =
  directorRuntimeExecutiveGuidanceDeliveryIdentity;

export const directorRuntimeExecutiveGuidancePlatformCanonicalIdentity =
  Object.freeze({
    identity: directorRuntimeExecutiveGuidancePlatformIdentity,
    version: directorRuntimeExecutiveGuidancePlatformVersion,
    namespace: directorRuntimeExecutiveGuidancePlatformNamespace,
    upstream: directorRuntimeExecutiveGuidancePlatformUpstream,
  });

// ─── Principle / boundary ───────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_PRINCIPLE =
  "Foundation defines vocabulary. Contracts define transport. Resolution decides survival. Composition defines hierarchy. Delivery produces a consumer-ready package. Platform provides the canonical runtime capability for executing and verifying that semantic pipeline." as const;

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_BOUNDARY =
  Object.freeze({
    deliveryAuthority: "DRI-7:5" as const,
    platformAuthority: "DRI-7:6" as const,
    adapterAuthority: "DRI-7:7" as const,
    orchestratesOnly: true as const,
    doesNotReresolve: true as const,
    doesNotRecompose: true as const,
    doesNotRedeliverPolicy: true as const,
    doesNotCreateGuidance: true as const,
    doesNotCertifyAdapters: true as const,
    consumesDeliverySurfaceOnly: true as const,
  });

// ─── Vocabularies ───────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_STATUSES =
  Object.freeze([
    "ready",
    "completed",
    "held",
    "deferred",
    "blocked",
    "failed",
  ] as const);
export type DirectorRuntimeExecutiveGuidancePlatformStatus =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_STATUSES)[number];

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_STAGES =
  Object.freeze(["resolution", "composition", "delivery"] as const);
export type DirectorRuntimeExecutiveGuidancePlatformStage =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_STAGES)[number];

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_STAGE_STATUSES =
  Object.freeze([
    "not-started",
    "completed",
    "skipped",
    "blocked",
    "failed",
  ] as const);
export type DirectorRuntimeExecutiveGuidancePlatformStageStatus =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_STAGE_STATUSES)[number];

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_EXECUTION_ORDER =
  DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_STAGES;

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_READINESS_VALUES =
  Object.freeze([
    "ready-for-consumer",
    "not-ready-for-consumer",
  ] as const);
export type DirectorRuntimeExecutiveGuidancePlatformReadiness =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_READINESS_VALUES)[number];

// ─── Rules ──────────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_RULE_ORDER =
  Object.freeze([
    "input-integrity",
    "resolution-stage",
    "composition-stage",
    "delivery-stage",
    "stage-order",
    "stage-short-circuit",
    "outcome-mapping",
    "traceability",
    "consumer-readiness",
  ] as const);
export type DirectorRuntimeExecutiveGuidancePlatformRuleName =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_RULE_ORDER)[number];

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_RULE_IDS =
  Object.freeze([
    "dri7.platform.input-integrity",
    "dri7.platform.resolution-stage",
    "dri7.platform.composition-stage",
    "dri7.platform.delivery-stage",
    "dri7.platform.stage-order",
    "dri7.platform.stage-short-circuit",
    "dri7.platform.outcome-mapping",
    "dri7.platform.traceability",
    "dri7.platform.consumer-readiness",
  ] as const);
export type DirectorRuntimeExecutiveGuidancePlatformRuleId =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_RULE_IDS)[number];

// ─── Capability ─────────────────────────────────────────────────────────────

export interface DirectorRuntimeExecutiveGuidancePlatformCapability {
  readonly supportsResolution: true;
  readonly supportsComposition: true;
  readonly supportsDelivery: true;
  readonly rendererIndependent: true;
  readonly advisorIndependent: true;
  readonly actionIndependent: true;
  readonly sideEffectFree: true;
  readonly adapterIndependent: true;
  readonly synchronous: true;
}

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_CAPABILITY =
  Object.freeze({
    supportsResolution: true,
    supportsComposition: true,
    supportsDelivery: true,
    rendererIndependent: true,
    advisorIndependent: true,
    actionIndependent: true,
    sideEffectFree: true,
    adapterIndependent: true,
    synchronous: true,
  }) satisfies DirectorRuntimeExecutiveGuidancePlatformCapability;

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface DirectorRuntimeExecutiveGuidancePlatformCompositionContext {
  readonly compositionId: string;
  readonly relationships: readonly DirectorRuntimeExecutiveGuidanceCompositionRelationship[];
  readonly paths: readonly DirectorRuntimeExecutiveGuidanceCompositionPath[];
}

export interface DirectorRuntimeExecutiveGuidancePlatformInput {
  readonly platformRunId: string;
  readonly deliveryId: string;
  readonly resolutionInput: DirectorRuntimeExecutiveGuidanceResolutionInput;
  readonly compositionContext: DirectorRuntimeExecutiveGuidancePlatformCompositionContext;
  readonly deliveryPolicy: DirectorRuntimeExecutiveGuidanceSemanticDeliveryPolicy;
  readonly deliveryContext: DirectorRuntimeExecutiveGuidanceDeliveryContext;
}

export interface DirectorRuntimeExecutiveGuidancePlatformStageTrace {
  readonly stage: DirectorRuntimeExecutiveGuidancePlatformStage;
  readonly status: DirectorRuntimeExecutiveGuidancePlatformStageStatus;
  readonly inputIdentity: string | null;
  readonly outputIdentity: string | null;
  readonly reasons: readonly string[];
}

export interface DirectorRuntimeExecutiveGuidancePlatformIssue {
  readonly code: string;
  readonly stage: DirectorRuntimeExecutiveGuidancePlatformStage | "platform";
  readonly message: string;
}

export interface DirectorRuntimeExecutiveGuidancePlatformSummary {
  readonly completedStageCount: number;
  readonly blockedStageCount: number;
  readonly failedStageCount: number;
  readonly skippedStageCount: number;
  readonly resolutionAvailable: boolean;
  readonly compositionAvailable: boolean;
  readonly deliveryAvailable: boolean;
  readonly deliveryStatus: DirectorRuntimeExecutiveGuidanceDeliveryStatus | null;
  readonly consumerReady: boolean;
  readonly readiness: DirectorRuntimeExecutiveGuidancePlatformReadiness;
}

export interface DirectorRuntimeExecutiveGuidancePlatformResult {
  readonly platformRunId: string;
  readonly status: DirectorRuntimeExecutiveGuidancePlatformStatus;
  readonly readiness: DirectorRuntimeExecutiveGuidancePlatformReadiness;
  readonly resolution: DirectorRuntimeExecutiveGuidanceResolution | null;
  readonly composition: DirectorRuntimeExecutiveGuidanceComposition | null;
  readonly delivery: DirectorRuntimeExecutiveGuidanceDeliveryPackage | null;
  readonly stageTrace: readonly DirectorRuntimeExecutiveGuidancePlatformStageTrace[];
  readonly issues: readonly DirectorRuntimeExecutiveGuidancePlatformIssue[];
  readonly summary: DirectorRuntimeExecutiveGuidancePlatformSummary;
}

// ─── Guards / helpers ───────────────────────────────────────────────────────

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isDirectorRuntimeExecutiveGuidancePlatformStatus(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidancePlatformStatus {
  return (
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_STATUSES as readonly unknown[]
  ).includes(value);
}

export function isDirectorRuntimeExecutiveGuidancePlatformStage(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidancePlatformStage {
  return (
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_STAGES as readonly unknown[]
  ).includes(value);
}

export function isDirectorRuntimeExecutiveGuidancePlatformStageStatus(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidancePlatformStageStatus {
  return (
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_STAGE_STATUSES as readonly unknown[]
  ).includes(value);
}

export function createDirectorExecutiveGuidancePlatformStageTrace(input: {
  readonly stage: DirectorRuntimeExecutiveGuidancePlatformStage;
  readonly status: DirectorRuntimeExecutiveGuidancePlatformStageStatus;
  readonly inputIdentity: string | null;
  readonly outputIdentity: string | null;
  readonly reasons?: readonly string[];
}): DirectorRuntimeExecutiveGuidancePlatformStageTrace {
  return Object.freeze({
    stage: input.stage,
    status: input.status,
    inputIdentity: input.inputIdentity,
    outputIdentity: input.outputIdentity,
    reasons: Object.freeze([...(input.reasons ?? [])]),
  });
}

export function createDirectorExecutiveGuidancePlatformIssue(input: {
  readonly code: string;
  readonly stage: DirectorRuntimeExecutiveGuidancePlatformStage | "platform";
  readonly message: string;
}): DirectorRuntimeExecutiveGuidancePlatformIssue {
  return Object.freeze({
    code: input.code,
    stage: input.stage,
    message: input.message,
  });
}

export function createDirectorExecutiveGuidancePlatformInput(
  input: DirectorRuntimeExecutiveGuidancePlatformInput,
): DirectorRuntimeExecutiveGuidancePlatformInput {
  return Object.freeze({
    platformRunId: input.platformRunId,
    deliveryId: input.deliveryId,
    resolutionInput: input.resolutionInput,
    compositionContext: Object.freeze({
      compositionId: input.compositionContext.compositionId,
      relationships: Object.freeze([
        ...input.compositionContext.relationships,
      ]),
      paths: Object.freeze([...input.compositionContext.paths]),
    }),
    deliveryPolicy: Object.freeze({ ...input.deliveryPolicy }),
    deliveryContext: Object.freeze({ ...input.deliveryContext }),
  });
}

function validatePlatformInput(
  input: unknown,
): readonly DirectorRuntimeExecutiveGuidancePlatformIssue[] {
  if (!isPlainObject(input)) {
    return Object.freeze([
      createDirectorExecutiveGuidancePlatformIssue({
        code: "invalid-platform-input",
        stage: "platform",
        message: "platform input must be a plain object",
      }),
    ]);
  }
  const issues: DirectorRuntimeExecutiveGuidancePlatformIssue[] = [];
  if (typeof input.platformRunId !== "string" || input.platformRunId.length === 0) {
    issues[issues.length] = createDirectorExecutiveGuidancePlatformIssue({
      code: "invalid-platform-run-id",
      stage: "platform",
      message: "platformRunId must be a non-empty string",
    });
  }
  if (typeof input.deliveryId !== "string" || input.deliveryId.length === 0) {
    issues[issues.length] = createDirectorExecutiveGuidancePlatformIssue({
      code: "invalid-delivery-id",
      stage: "platform",
      message: "deliveryId must be a non-empty string",
    });
  }
  if (!isPlainObject(input.resolutionInput)) {
    issues[issues.length] = createDirectorExecutiveGuidancePlatformIssue({
      code: "invalid-resolution-input",
      stage: "resolution",
      message: "resolutionInput must be a plain object",
    });
  } else {
    if (
      typeof input.resolutionInput.resolutionId !== "string" ||
      input.resolutionInput.resolutionId.length === 0
    ) {
      issues[issues.length] = createDirectorExecutiveGuidancePlatformIssue({
        code: "invalid-resolution-id",
        stage: "resolution",
        message: "resolutionInput.resolutionId must be a non-empty string",
      });
    }
    if (!isPlainObject(input.resolutionInput.envelope)) {
      issues[issues.length] = createDirectorExecutiveGuidancePlatformIssue({
        code: "invalid-resolution-envelope",
        stage: "resolution",
        message: "resolutionInput.envelope must be a plain object",
      });
    }
    if (!isPlainObject(input.resolutionInput.context)) {
      issues[issues.length] = createDirectorExecutiveGuidancePlatformIssue({
        code: "invalid-resolution-context",
        stage: "resolution",
        message: "resolutionInput.context must be a plain object",
      });
    }
  }
  if (!isPlainObject(input.compositionContext)) {
    issues[issues.length] = createDirectorExecutiveGuidancePlatformIssue({
      code: "invalid-composition-context",
      stage: "composition",
      message: "compositionContext must be a plain object",
    });
  } else {
    if (
      typeof input.compositionContext.compositionId !== "string" ||
      input.compositionContext.compositionId.length === 0
    ) {
      issues[issues.length] = createDirectorExecutiveGuidancePlatformIssue({
        code: "invalid-composition-id",
        stage: "composition",
        message: "compositionContext.compositionId must be a non-empty string",
      });
    }
    if (!Array.isArray(input.compositionContext.relationships)) {
      issues[issues.length] = createDirectorExecutiveGuidancePlatformIssue({
        code: "invalid-composition-relationships",
        stage: "composition",
        message: "compositionContext.relationships must be an array",
      });
    }
    if (!Array.isArray(input.compositionContext.paths)) {
      issues[issues.length] = createDirectorExecutiveGuidancePlatformIssue({
        code: "invalid-composition-paths",
        stage: "composition",
        message: "compositionContext.paths must be an array",
      });
    }
  }
  if (!isPlainObject(input.deliveryPolicy)) {
    issues[issues.length] = createDirectorExecutiveGuidancePlatformIssue({
      code: "invalid-delivery-policy",
      stage: "delivery",
      message: "deliveryPolicy must be a plain object",
    });
  }
  if (!isPlainObject(input.deliveryContext)) {
    issues[issues.length] = createDirectorExecutiveGuidancePlatformIssue({
      code: "invalid-delivery-context",
      stage: "delivery",
      message: "deliveryContext must be a plain object",
    });
  }
  return Object.freeze(issues);
}

function isStructuralResolution(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidanceResolution {
  return (
    isPlainObject(value) &&
    typeof value.resolutionId === "string" &&
    value.resolutionId.length > 0 &&
    typeof value.requestId === "string" &&
    Array.isArray(value.entries) &&
    Array.isArray(value.selectedCandidateIds) &&
    isPlainObject(value.summary)
  );
}

function isStructuralComposition(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidanceComposition {
  return (
    isPlainObject(value) &&
    typeof value.compositionId === "string" &&
    value.compositionId.length > 0 &&
    typeof value.requestId === "string" &&
    Array.isArray(value.supporting) &&
    Array.isArray(value.contextual) &&
    Array.isArray(value.background) &&
    Array.isArray(value.traces) &&
    isPlainObject(value.summary)
  );
}

function isStructuralDelivery(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidanceDeliveryPackage {
  return (
    isPlainObject(value) &&
    typeof value.deliveryId === "string" &&
    typeof value.compositionId === "string" &&
    typeof value.status === "string" &&
    Array.isArray(value.reasons) &&
    isPlainObject(value.summary) &&
    typeof value.readiness === "string"
  );
}

export function resolveDirectorExecutiveGuidancePlatformStatus(input: {
  readonly deliveryStatus: DirectorRuntimeExecutiveGuidanceDeliveryStatus | null;
  readonly failed: boolean;
}): DirectorRuntimeExecutiveGuidancePlatformStatus {
  if (input.failed) return "failed";
  if (input.deliveryStatus === "ready") return "completed";
  if (input.deliveryStatus === "held") return "held";
  if (input.deliveryStatus === "deferred") return "deferred";
  if (input.deliveryStatus === "blocked") return "blocked";
  return "failed";
}

export function summarizeDirectorExecutiveGuidancePlatform(input: {
  readonly stageTrace: readonly DirectorRuntimeExecutiveGuidancePlatformStageTrace[];
  readonly resolution: DirectorRuntimeExecutiveGuidanceResolution | null;
  readonly composition: DirectorRuntimeExecutiveGuidanceComposition | null;
  readonly delivery: DirectorRuntimeExecutiveGuidanceDeliveryPackage | null;
}): DirectorRuntimeExecutiveGuidancePlatformSummary {
  let completedStageCount = 0;
  let blockedStageCount = 0;
  let failedStageCount = 0;
  let skippedStageCount = 0;
  for (const entry of input.stageTrace) {
    if (entry.status === "completed") completedStageCount += 1;
    else if (entry.status === "blocked") blockedStageCount += 1;
    else if (entry.status === "failed") failedStageCount += 1;
    else if (entry.status === "skipped") skippedStageCount += 1;
  }
  const deliveryStatus = input.delivery?.status ?? null;
  const consumerReady =
    input.delivery !== null &&
    input.delivery.readiness === "ready-for-consumer" &&
    input.delivery.status === "ready";
  return Object.freeze({
    completedStageCount,
    blockedStageCount,
    failedStageCount,
    skippedStageCount,
    resolutionAvailable: input.resolution !== null,
    compositionAvailable: input.composition !== null,
    deliveryAvailable: input.delivery !== null,
    deliveryStatus,
    consumerReady,
    readiness: consumerReady
      ? ("ready-for-consumer" as const)
      : ("not-ready-for-consumer" as const),
  });
}

export function isDirectorExecutiveGuidancePlatformInput(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidancePlatformInput {
  return validatePlatformInput(value).length === 0;
}

export function isDirectorExecutiveGuidancePlatformResult(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidancePlatformResult {
  if (!isPlainObject(value)) return false;
  return (
    typeof value.platformRunId === "string" &&
    isDirectorRuntimeExecutiveGuidancePlatformStatus(value.status) &&
    Array.isArray(value.stageTrace) &&
    Array.isArray(value.issues) &&
    isPlainObject(value.summary)
  );
}

function freezeResult(
  result: DirectorRuntimeExecutiveGuidancePlatformResult,
): DirectorRuntimeExecutiveGuidancePlatformResult {
  return Object.freeze({
    platformRunId: result.platformRunId,
    status: result.status,
    readiness: result.readiness,
    resolution: result.resolution,
    composition: result.composition,
    delivery: result.delivery,
    stageTrace: Object.freeze([...result.stageTrace]),
    issues: Object.freeze([...result.issues]),
    summary: Object.freeze({ ...result.summary }),
  });
}

function skippedTrace(
  stage: DirectorRuntimeExecutiveGuidancePlatformStage,
  reasons: readonly string[],
): DirectorRuntimeExecutiveGuidancePlatformStageTrace {
  return createDirectorExecutiveGuidancePlatformStageTrace({
    stage,
    status: "skipped",
    inputIdentity: null,
    outputIdentity: null,
    reasons,
  });
}

// ─── Main platform execution ────────────────────────────────────────────────

export function runDirectorExecutiveGuidancePlatform(
  input: DirectorRuntimeExecutiveGuidancePlatformInput,
): DirectorRuntimeExecutiveGuidancePlatformResult {
  const inputIssues = validatePlatformInput(input);
  if (inputIssues.length > 0) {
    const stageTrace = Object.freeze([
      createDirectorExecutiveGuidancePlatformStageTrace({
        stage: "resolution",
        status: "failed",
        inputIdentity: null,
        outputIdentity: null,
        reasons: Object.freeze(["invalid-platform-input"]),
      }),
      skippedTrace("composition", Object.freeze(["short-circuit-after-resolution-failure"])),
      skippedTrace("delivery", Object.freeze(["short-circuit-after-resolution-failure"])),
    ]);
    const summary = summarizeDirectorExecutiveGuidancePlatform({
      stageTrace,
      resolution: null,
      composition: null,
      delivery: null,
    });
    return freezeResult({
      platformRunId:
        isPlainObject(input) && typeof input.platformRunId === "string"
          ? input.platformRunId
          : "platform-run.invalid",
      status: "failed",
      readiness: "not-ready-for-consumer",
      resolution: null,
      composition: null,
      delivery: null,
      stageTrace,
      issues: inputIssues,
      summary,
    });
  }

  const issues: DirectorRuntimeExecutiveGuidancePlatformIssue[] = [];

  // Stage 1 — Resolution (DRI-7:3 via DRI-7:5 surface)
  const resolutionInputIdentity = input.resolutionInput.resolutionId;
  let resolution: DirectorRuntimeExecutiveGuidanceResolution | null = null;
  try {
    resolution = resolveDirectorExecutiveGuidance(input.resolutionInput);
  } catch {
    resolution = null;
  }
  if (!isStructuralResolution(resolution)) {
    const stageTrace = Object.freeze([
      createDirectorExecutiveGuidancePlatformStageTrace({
        stage: "resolution",
        status: "failed",
        inputIdentity: resolutionInputIdentity,
        outputIdentity: null,
        reasons: Object.freeze(["resolution-structural-failure"]),
      }),
      skippedTrace("composition", Object.freeze(["short-circuit-after-resolution-failure"])),
      skippedTrace("delivery", Object.freeze(["short-circuit-after-resolution-failure"])),
    ]);
    const issue = createDirectorExecutiveGuidancePlatformIssue({
      code: "resolution-structural-failure",
      stage: "resolution",
      message: "resolution stage produced an invalid structural result",
    });
    const summary = summarizeDirectorExecutiveGuidancePlatform({
      stageTrace,
      resolution: null,
      composition: null,
      delivery: null,
    });
    return freezeResult({
      platformRunId: input.platformRunId,
      status: "failed",
      readiness: "not-ready-for-consumer",
      resolution: null,
      composition: null,
      delivery: null,
      stageTrace,
      issues: Object.freeze([issue]),
      summary,
    });
  }
  const resolutionTrace = createDirectorExecutiveGuidancePlatformStageTrace({
    stage: "resolution",
    status: "completed",
    inputIdentity: resolutionInputIdentity,
    outputIdentity: resolution.resolutionId,
    reasons: Object.freeze(["resolution-completed"]),
  });

  // Stage 2 — Composition (DRI-7:4 via DRI-7:5 surface)
  let composition: DirectorRuntimeExecutiveGuidanceComposition | null = null;
  try {
    composition = composeDirectorExecutiveGuidance({
      compositionId: input.compositionContext.compositionId,
      resolution,
      relationships: input.compositionContext.relationships,
      paths: input.compositionContext.paths,
    });
  } catch {
    composition = null;
  }
  if (
    !isStructuralComposition(composition) ||
    composition.compositionId !== input.compositionContext.compositionId
  ) {
    const stageTrace = Object.freeze([
      resolutionTrace,
      createDirectorExecutiveGuidancePlatformStageTrace({
        stage: "composition",
        status: "failed",
        inputIdentity: resolution.resolutionId,
        outputIdentity: null,
        reasons: Object.freeze(["composition-structural-failure"]),
      }),
      skippedTrace("delivery", Object.freeze(["short-circuit-after-composition-failure"])),
    ]);
    const issue = createDirectorExecutiveGuidancePlatformIssue({
      code: "composition-structural-failure",
      stage: "composition",
      message: "composition stage produced an invalid structural result",
    });
    const summary = summarizeDirectorExecutiveGuidancePlatform({
      stageTrace,
      resolution,
      composition: null,
      delivery: null,
    });
    return freezeResult({
      platformRunId: input.platformRunId,
      status: "failed",
      readiness: "not-ready-for-consumer",
      resolution,
      composition: null,
      delivery: null,
      stageTrace,
      issues: Object.freeze([issue, ...issues]),
      summary,
    });
  }
  const compositionTrace = createDirectorExecutiveGuidancePlatformStageTrace({
    stage: "composition",
    status: "completed",
    inputIdentity: resolution.resolutionId,
    outputIdentity: composition.compositionId,
    reasons: Object.freeze(["composition-completed"]),
  });

  // Stage 3 — Delivery (DRI-7:5)
  let delivery: DirectorRuntimeExecutiveGuidanceDeliveryPackage | null = null;
  try {
    delivery = deliverDirectorExecutiveGuidance({
      deliveryId: input.deliveryId,
      composition,
      policy: input.deliveryPolicy,
      context: input.deliveryContext,
    });
  } catch {
    delivery = null;
  }
  if (!isStructuralDelivery(delivery)) {
    const stageTrace = Object.freeze([
      resolutionTrace,
      compositionTrace,
      createDirectorExecutiveGuidancePlatformStageTrace({
        stage: "delivery",
        status: "failed",
        inputIdentity: composition.compositionId,
        outputIdentity: null,
        reasons: Object.freeze(["delivery-structural-failure"]),
      }),
    ]);
    const issue = createDirectorExecutiveGuidancePlatformIssue({
      code: "delivery-structural-failure",
      stage: "delivery",
      message: "delivery stage produced an invalid structural result",
    });
    const summary = summarizeDirectorExecutiveGuidancePlatform({
      stageTrace,
      resolution,
      composition,
      delivery: null,
    });
    return freezeResult({
      platformRunId: input.platformRunId,
      status: "failed",
      readiness: "not-ready-for-consumer",
      resolution,
      composition,
      delivery: null,
      stageTrace,
      issues: Object.freeze([issue, ...issues]),
      summary,
    });
  }

  const deliveryTrace = createDirectorExecutiveGuidancePlatformStageTrace({
    stage: "delivery",
    status: "completed",
    inputIdentity: composition.compositionId,
    outputIdentity: delivery.deliveryId,
    reasons: Object.freeze([`delivery-status:${delivery.status}`]),
  });
  const stageTrace = Object.freeze([
    resolutionTrace,
    compositionTrace,
    deliveryTrace,
  ]);
  const status = resolveDirectorExecutiveGuidancePlatformStatus({
    deliveryStatus: delivery.status,
    failed: false,
  });
  const summary = summarizeDirectorExecutiveGuidancePlatform({
    stageTrace,
    resolution,
    composition,
    delivery,
  });

  return freezeResult({
    platformRunId: input.platformRunId,
    status,
    readiness: summary.readiness,
    resolution,
    composition,
    delivery,
    stageTrace,
    issues: Object.freeze(issues),
    summary,
  });
}

// ─── Invariants / registry ──────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_INVARIANTS =
  Object.freeze([
    "exact-execution-order",
    "resolution-precedes-composition",
    "composition-precedes-delivery",
    "no-downstream-without-upstream",
    "no-delivery-without-composition",
    "no-composition-without-resolution",
    "no-semantic-rewriting",
    "no-stage-identity-replacement",
    "no-hidden-stage-execution",
    "no-side-effects",
    "held-deferred-blocked-are-not-failures",
    "consumer-readiness-from-delivery",
    "sole-dependency-delivery",
    "renderer-independent",
    "advisor-independent",
    "action-independent",
    "adapter-independent",
  ] as const);

export type DirectorRuntimeExecutiveGuidancePlatformInvariant =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_INVARIANTS)[number];

export const directorRuntimeExecutiveGuidancePlatformApiNames = Object.freeze([
  "isDirectorRuntimeExecutiveGuidancePlatformStatus",
  "isDirectorRuntimeExecutiveGuidancePlatformStage",
  "isDirectorRuntimeExecutiveGuidancePlatformStageStatus",
  "isDirectorExecutiveGuidancePlatformInput",
  "isDirectorExecutiveGuidancePlatformResult",
  "createDirectorExecutiveGuidancePlatformInput",
  "createDirectorExecutiveGuidancePlatformStageTrace",
  "createDirectorExecutiveGuidancePlatformIssue",
  "resolveDirectorExecutiveGuidancePlatformStatus",
  "summarizeDirectorExecutiveGuidancePlatform",
  "runDirectorExecutiveGuidancePlatform",
  "verifyDirectorRuntimeExecutiveGuidancePlatform",
] as const);

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "DirectorRuntimeExecutiveGuidancePlatformStatus",
    "DirectorRuntimeExecutiveGuidancePlatformStage",
    "DirectorRuntimeExecutiveGuidancePlatformStageStatus",
    "DirectorRuntimeExecutiveGuidancePlatformReadiness",
    "DirectorRuntimeExecutiveGuidancePlatformRuleName",
    "DirectorRuntimeExecutiveGuidancePlatformRuleId",
    "DirectorRuntimeExecutiveGuidancePlatformCapability",
    "DirectorRuntimeExecutiveGuidancePlatformCompositionContext",
    "DirectorRuntimeExecutiveGuidancePlatformInput",
    "DirectorRuntimeExecutiveGuidancePlatformStageTrace",
    "DirectorRuntimeExecutiveGuidancePlatformIssue",
    "DirectorRuntimeExecutiveGuidancePlatformSummary",
    "DirectorRuntimeExecutiveGuidancePlatformResult",
    "DirectorRuntimeExecutiveGuidancePlatformInvariant",
    "DirectorRuntimeExecutiveGuidancePlatformVerification",
  ] as const);

export const directorRuntimeExecutiveGuidancePlatformRegistry = Object.freeze({
  identity: directorRuntimeExecutiveGuidancePlatformIdentity,
  version: directorRuntimeExecutiveGuidancePlatformVersion,
  namespace: directorRuntimeExecutiveGuidancePlatformNamespace,
  dependency: directorRuntimeExecutiveGuidancePlatformUpstream,
  principle: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_PRINCIPLE,
  boundary: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_BOUNDARY,
  statuses: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_STATUSES,
  statusCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_STATUSES.length,
  stages: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_STAGES,
  stageCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_STAGES.length,
  stageStatuses: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_STAGE_STATUSES,
  stageStatusCount:
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_STAGE_STATUSES.length,
  executionOrder: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_EXECUTION_ORDER,
  readinessValues: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_READINESS_VALUES,
  readinessCount:
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_READINESS_VALUES.length,
  ruleOrder: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_RULE_ORDER,
  ruleIds: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_RULE_IDS,
  ruleCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_RULE_ORDER.length,
  capability: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_CAPABILITY,
  invariants: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_INVARIANTS,
  invariantCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_INVARIANTS.length,
  publicTypes: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_PUBLIC_TYPE_NAMES,
  publicTypeCount:
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_PUBLIC_TYPE_NAMES.length,
  publicApis: directorRuntimeExecutiveGuidancePlatformApiNames,
  publicApiCount: directorRuntimeExecutiveGuidancePlatformApiNames.length,
  registrySectionCount: 5 as const,
});

export const directorRuntimeExecutiveGuidancePlatform = Object.freeze({
  phase: "DRI-7:6" as const,
  name: "DirectorRuntimeExecutiveGuidancePlatform" as const,
  identity: directorRuntimeExecutiveGuidancePlatformIdentity,
  namespace: directorRuntimeExecutiveGuidancePlatformNamespace,
  version: directorRuntimeExecutiveGuidancePlatformVersion,
  layer: "Director Runtime Integration" as const,
  domain: "ExecutiveGuidanceAttentionDelivery" as const,
  role: "Platform" as const,
  stage: "Platform" as const,
  status: "PlatformReady" as const,
  upstreamDependency: directorRuntimeExecutiveGuidancePlatformUpstream,
  deterministic: true as const,
  platform: true as const,
  sideEffectFree: true as const,
  rendererIndependent: true as const,
  advisorIndependent: true as const,
  actionIndependent: true as const,
  adapterIndependent: true as const,
  synchronous: true as const,
  capability: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_CAPABILITY,
  registry: directorRuntimeExecutiveGuidancePlatformRegistry,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface DirectorRuntimeExecutiveGuidancePlatformVerification {
  readonly ok: boolean;
  readonly identity: typeof directorRuntimeExecutiveGuidancePlatformIdentity;
  readonly version: typeof directorRuntimeExecutiveGuidancePlatformVersion;
  readonly namespace: typeof directorRuntimeExecutiveGuidancePlatformNamespace;
  readonly upstream: typeof directorRuntimeExecutiveGuidancePlatformUpstream;
  readonly statusCount: number;
  readonly stageCount: number;
  readonly stageStatusCount: number;
  readonly ruleCount: number;
  readonly executionOrder: readonly DirectorRuntimeExecutiveGuidancePlatformStage[];
  readonly capability: DirectorRuntimeExecutiveGuidancePlatformCapability;
  readonly checks: readonly string[];
}

export function verifyDirectorRuntimeExecutiveGuidancePlatform():
  DirectorRuntimeExecutiveGuidancePlatformVerification {
  const checks: string[] = [];
  const record = (name: string, pass: boolean): void => {
    if (pass) checks[checks.length] = name;
  };

  record(
    "identity",
    directorRuntimeExecutiveGuidancePlatformIdentity ===
      "DRI-7:6/DirectorRuntimeExecutiveGuidancePlatform",
  );
  record(
    "version",
    directorRuntimeExecutiveGuidancePlatformVersion === "7.6.0",
  );
  record(
    "namespace",
    directorRuntimeExecutiveGuidancePlatformNamespace ===
      "nexora.dri.executive-guidance.platform",
  );
  record(
    "sole-dependency",
    directorRuntimeExecutiveGuidancePlatformUpstream ===
      "DRI-7:5/DirectorRuntimeExecutiveGuidanceDelivery",
  );
  record(
    "status-vocabulary",
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_STATUSES.length === 6,
  );
  record(
    "stage-vocabulary",
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_STAGES.length === 3,
  );
  record(
    "stage-status-vocabulary",
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_STAGE_STATUSES.length === 5,
  );
  record(
    "execution-order",
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_EXECUTION_ORDER[0] ===
      "resolution" &&
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_EXECUTION_ORDER[1] ===
        "composition" &&
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_EXECUTION_ORDER[2] ===
        "delivery",
  );
  record(
    "rule-registry",
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_RULE_IDS.length === 9 &&
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_RULE_ORDER.length === 9,
  );
  record(
    "capability",
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_CAPABILITY.supportsResolution &&
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_CAPABILITY.supportsComposition &&
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_CAPABILITY.supportsDelivery &&
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_CAPABILITY.rendererIndependent &&
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_CAPABILITY.advisorIndependent &&
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_CAPABILITY.actionIndependent &&
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_CAPABILITY.sideEffectFree &&
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_CAPABILITY.adapterIndependent,
  );
  record(
    "outcome-mapping-ready",
    resolveDirectorExecutiveGuidancePlatformStatus({
      deliveryStatus: "ready",
      failed: false,
    }) === "completed",
  );
  record(
    "outcome-mapping-held",
    resolveDirectorExecutiveGuidancePlatformStatus({
      deliveryStatus: "held",
      failed: false,
    }) === "held",
  );
  record(
    "outcome-mapping-deferred",
    resolveDirectorExecutiveGuidancePlatformStatus({
      deliveryStatus: "deferred",
      failed: false,
    }) === "deferred",
  );
  record(
    "outcome-mapping-blocked",
    resolveDirectorExecutiveGuidancePlatformStatus({
      deliveryStatus: "blocked",
      failed: false,
    }) === "blocked",
  );
  record(
    "outcome-mapping-failed",
    resolveDirectorExecutiveGuidancePlatformStatus({
      deliveryStatus: null,
      failed: true,
    }) === "failed",
  );
  record(
    "registry-frozen",
    Object.isFrozen(directorRuntimeExecutiveGuidancePlatformRegistry),
  );
  record(
    "platform-frozen",
    Object.isFrozen(directorRuntimeExecutiveGuidancePlatform),
  );

  const ok =
    checks.length === 17 &&
    checks.includes("identity") &&
    checks.includes("version") &&
    checks.includes("namespace") &&
    checks.includes("sole-dependency");

  return Object.freeze({
    ok,
    identity: directorRuntimeExecutiveGuidancePlatformIdentity,
    version: directorRuntimeExecutiveGuidancePlatformVersion,
    namespace: directorRuntimeExecutiveGuidancePlatformNamespace,
    upstream: directorRuntimeExecutiveGuidancePlatformUpstream,
    statusCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_STATUSES.length,
    stageCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_STAGES.length,
    stageStatusCount:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_STAGE_STATUSES.length,
    ruleCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_RULE_ORDER.length,
    executionOrder: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_EXECUTION_ORDER,
    capability: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PLATFORM_CAPABILITY,
    checks: Object.freeze([...checks]),
  });
}
