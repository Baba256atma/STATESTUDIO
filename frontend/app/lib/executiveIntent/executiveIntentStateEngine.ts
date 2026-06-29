/**
 * APP-3:2 — Executive Intent State Engine.
 * Read-only deterministic intent state resolution — consumes APP-3:1 contract only.
 */

import { EXECUTIVE_INTENT_CONTRACT_VERSION } from "./executiveIntentConstants.ts";
import {
  createExecutiveIntentDiagnostic,
  type ExecutiveIntentDiagnostic,
} from "./executiveIntentDiagnostics.ts";
import { resolveLifecycleTransition } from "./executiveIntentLifecycleMatrix.ts";
import type { ExecutiveIntent } from "./executiveIntentTypes.ts";
import {
  hasDuplicateIds,
  isIntentRelationType,
  validateExecutiveIntentShape,
  validateIntentMetadataShape,
} from "./executiveIntentValidation.ts";
import { resolveExecutiveIntentExample } from "./executiveIntentContract.ts";
import {
  createExecutiveIntentState,
  createIntentResolutionResult,
  createIntentStateSummary,
  EXECUTIVE_INTENT_STATE_ENGINE_VERSION,
  type ExecutiveIntentState,
  type ExecutiveIntentStateCategory,
  type ExecutiveIntentStateResolveRequest,
  type IntentExecutionState,
  type IntentFreshness,
  type IntentReadiness,
  type IntentResolutionResult,
  type IntentStateEvaluationContext,
  type IntentStateSummary,
  type IntentStructuralHealth,
} from "./executiveIntentStateTypes.ts";

export const EXECUTIVE_INTENT_STATE_ENGINE_OWNER = "executive-intent-state-engine" as const;

export const EXECUTIVE_INTENT_STATE_ENGINE_TAGS = Object.freeze([
  "[APP3_2]",
  "[INTENT_STATE_ENGINE]",
  "[READ_ONLY_ENGINE]",
  "[LIFECYCLE_VALIDATION]",
  "[DIAGNOSTICS_READY]",
  "[ARCHITECTURE_SAFE]",
  "[BACKWARD_COMPATIBLE]",
] as const);

export const EXECUTIVE_INTENT_STATE_ENGINE_RULES = Object.freeze({
  deterministic: true,
  repeatable: true,
  stateless: true,
  threadSafe: true,
  pure: true,
  noSideEffects: true,
  noGlobalCache: true,
  noMutation: true,
  workspaceIsolated: true,
  readOnly: true,
} as const);

const FRESHNESS_FRESH_MS = 86_400_000;
const FRESHNESS_RECENT_MS = 604_800_000;
const FRESHNESS_AGING_MS = 2_592_000_000;
const FRESHNESS_STALE_MS = 7_776_000_000;

function pushDiagnostic(
  diagnostics: ExecutiveIntentDiagnostic[],
  code: Parameters<typeof createExecutiveIntentDiagnostic>[0],
  message: string,
  timestamp: string,
  options: Parameters<typeof createExecutiveIntentDiagnostic>[3] = Object.freeze({})
): void {
  diagnostics.push(createExecutiveIntentDiagnostic(code, message, timestamp, options));
}

function parseTimestamp(value: string): number | null {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function hasBlockingRelation(intent: ExecutiveIntent): boolean {
  return intent.relations.some((relation) => relation.relationType === "blocks");
}

function hasBlockingDependency(intent: ExecutiveIntent): boolean {
  return intent.metadata.dependencies.some(
    (dependency) => dependency.relationType === "blocks"
  );
}

function isStatusLifecycleConsistent(intent: ExecutiveIntent): boolean {
  const { status, lifecycle } = intent.metadata;
  if (status === "archived") return lifecycle === "archived";
  if (status === "completed") return lifecycle === "completed" || lifecycle === "archived";
  if (status === "draft") return lifecycle === "created" || lifecycle === "validated";
  if (status === "active") {
    return lifecycle === "approved" || lifecycle === "activated" || lifecycle === "updated";
  }
  if (status === "paused") {
    return lifecycle === "activated" || lifecycle === "updated" || lifecycle === "approved";
  }
  if (status === "cancelled") {
    return lifecycle === "completed" || lifecycle === "archived" || lifecycle === "updated";
  }
  return true;
}

export function resolveIntentStructuralHealth(
  intent: ExecutiveIntent | null,
  diagnostics: readonly ExecutiveIntentDiagnostic[]
): IntentStructuralHealth {
  if (!intent) return "unknown";
  if (intent.readOnly !== true || intent.metadata.readOnly !== true) return "corrupted";
  if (intent.contractVersion !== EXECUTIVE_INTENT_CONTRACT_VERSION) return "invalid";
  if (!validateExecutiveIntentShape(intent).valid) return "invalid";
  if (!validateIntentMetadataShape(intent.metadata).valid) return "invalid";
  if (diagnostics.some((entry) => entry.blocking && entry.severity === "error")) return "invalid";
  if (diagnostics.some((entry) => entry.severity === "warning")) return "warning";
  return "healthy";
}

export function resolveIntentFreshness(
  intent: ExecutiveIntent | null,
  evaluatedAt: string
): IntentFreshness {
  if (!intent) return "unknown";
  const evaluatedMs = parseTimestamp(evaluatedAt);
  const updatedMs = parseTimestamp(intent.metadata.updatedAt);
  if (evaluatedMs === null || updatedMs === null) return "unknown";
  const ageMs = Math.max(0, evaluatedMs - updatedMs);
  if (ageMs <= FRESHNESS_FRESH_MS) return "fresh";
  if (ageMs <= FRESHNESS_RECENT_MS) return "recent";
  if (ageMs <= FRESHNESS_AGING_MS) return "aging";
  if (ageMs <= FRESHNESS_STALE_MS) return "stale";
  return "expired";
}

export function resolveIntentDiagnostics(
  request: ExecutiveIntentStateResolveRequest
): readonly ExecutiveIntentDiagnostic[] {
  return evaluateExecutiveIntentStateContext(request).diagnostics;
}

function resolveExecutionState(
  intent: ExecutiveIntent | null,
  readiness: IntentReadiness,
  structuralHealth: IntentStructuralHealth
): IntentExecutionState {
  if (!intent) return "unknown";
  if (readiness === "archived" || readiness === "completed") return "terminal";
  if (readiness === "blocked") return "paused";
  if (structuralHealth === "invalid" || structuralHealth === "corrupted") {
    return "awaiting_validation";
  }
  if (intent.metadata.lifecycle === "created" || intent.metadata.lifecycle === "validated") {
    return "awaiting_validation";
  }
  if (intent.metadata.lifecycle === "approved") return "awaiting_activation";
  if (intent.metadata.status === "paused") return "paused";
  if (readiness === "ready") return "active";
  return "idle";
}

function resolveReadiness(
  intent: ExecutiveIntent | null,
  structuralHealth: IntentStructuralHealth,
  diagnostics: readonly ExecutiveIntentDiagnostic[],
  workspaceIsolated: boolean
): IntentReadiness {
  if (!intent) return "not_ready";
  if (!workspaceIsolated) return "blocked";
  if (intent.metadata.status === "archived" || intent.metadata.lifecycle === "archived") {
    return "archived";
  }
  if (intent.metadata.status === "completed" || intent.metadata.lifecycle === "completed") {
    return "completed";
  }
  if (
    diagnostics.some((entry) => entry.blocking) ||
    structuralHealth === "invalid" ||
    structuralHealth === "corrupted"
  ) {
    return "blocked";
  }
  if (intent.metadata.status === "paused") return "waiting";
  if (
    intent.metadata.status === "active" &&
    (intent.metadata.lifecycle === "activated" || intent.metadata.lifecycle === "updated") &&
    structuralHealth === "healthy"
  ) {
    return "ready";
  }
  if (intent.metadata.status === "draft" || intent.metadata.lifecycle === "created") {
    return "not_ready";
  }
  return "waiting";
}

function resolveStateCategory(
  intent: ExecutiveIntent | null,
  readiness: IntentReadiness,
  structuralHealth: IntentStructuralHealth
): ExecutiveIntentStateCategory {
  if (!intent) return "unknown";
  if (structuralHealth === "invalid" || structuralHealth === "corrupted") return "invalid";
  if (readiness === "archived") return "archived";
  if (readiness === "completed") return "completed";
  if (readiness === "blocked") return "blocked";
  if (intent.metadata.status === "paused") return "paused";
  if (intent.metadata.status === "draft") return "draft";
  if (readiness === "ready") return "ready";
  if (structuralHealth === "healthy" || structuralHealth === "warning") return "valid";
  return "unknown";
}

export function resolveIntentReadiness(
  request: ExecutiveIntentStateResolveRequest
): IntentReadiness {
  const context = evaluateExecutiveIntentStateContext(request);
  return context.readiness;
}

export function isIntentReady(request: ExecutiveIntentStateResolveRequest): boolean {
  return resolveIntentReadiness(request) === "ready";
}

export function isIntentBlocked(request: ExecutiveIntentStateResolveRequest): boolean {
  const readiness = resolveIntentReadiness(request);
  return readiness === "blocked";
}

export function isIntentArchived(request: ExecutiveIntentStateResolveRequest): boolean {
  const readiness = resolveIntentReadiness(request);
  return readiness === "archived";
}

export function isIntentActionable(request: ExecutiveIntentStateResolveRequest): boolean {
  const context = evaluateExecutiveIntentStateContext(request);
  return (
    context.flags.isActionable &&
    context.readiness === "ready" &&
    context.structuralHealth === "healthy" &&
    context.freshness !== "stale" &&
    context.freshness !== "expired"
  );
}

export function evaluateExecutiveIntentStateContext(
  request: ExecutiveIntentStateResolveRequest
): IntentStateEvaluationContext {
  const diagnostics: ExecutiveIntentDiagnostic[] = [];
  const { intent, workspaceId, evaluatedAt } = request;
  let workspaceIsolated = true;
  let lifecycleValidation = request.proposedLifecycleTransition
    ? resolveLifecycleTransition(
        request.proposedLifecycleTransition.from,
        request.proposedLifecycleTransition.to
      )
    : null;

  if (!intent) {
    pushDiagnostic(
      diagnostics,
      "intent_missing",
      "Executive Intent is unavailable.",
      evaluatedAt,
      Object.freeze({
        explanation: "State engine requires a read-only ExecutiveIntent input.",
        recommendedNextState: "unknown",
        blocking: true,
        metadata: Object.freeze({ intentId: request.intentId, workspaceId }),
      })
    );
    const flags = Object.freeze({
      isReady: false,
      isBlocked: true,
      isArchived: false,
      isActionable: false,
      isStale: false,
      isStructurallyValid: false,
      isDownstreamReady: false,
      workspaceIsolated: false,
    });
    return Object.freeze({
      request,
      diagnostics: Object.freeze(diagnostics),
      structuralHealth: "unknown",
      freshness: "unknown",
      readiness: "not_ready",
      executionState: "unknown",
      stateCategory: "unknown",
      flags,
      lifecycleValidation,
    });
  }

  if (intent.readOnly !== true || intent.metadata.readOnly !== true) {
    pushDiagnostic(
      diagnostics,
      "intent_read_only_violation",
      "Executive Intent must remain read-only.",
      evaluatedAt,
      Object.freeze({ blocking: true })
    );
  }

  if (intent.contractVersion !== EXECUTIVE_INTENT_CONTRACT_VERSION) {
    pushDiagnostic(
      diagnostics,
      "intent_unsupported_version",
      `Unsupported contract version "${intent.contractVersion}".`,
      evaluatedAt,
      Object.freeze({
        blocking: true,
        metadata: Object.freeze({ expected: EXECUTIVE_INTENT_CONTRACT_VERSION }),
      })
    );
  }

  if (intent.intentId !== request.intentId) {
    pushDiagnostic(
      diagnostics,
      "intent_invalid_metadata",
      "Request intentId does not match ExecutiveIntent.intentId.",
      evaluatedAt,
      Object.freeze({ blocking: true })
    );
  }

  if (intent.workspaceId !== workspaceId || intent.metadata.workspaceId !== workspaceId) {
    workspaceIsolated = false;
    pushDiagnostic(
      diagnostics,
      "intent_workspace_mismatch",
      "Workspace isolation violation detected.",
      evaluatedAt,
      Object.freeze({
        blocking: true,
        metadata: Object.freeze({
          requestWorkspaceId: workspaceId,
          intentWorkspaceId: intent.workspaceId,
        }),
      })
    );
  }

  const metadataValidation = validateIntentMetadataShape(intent.metadata);
  if (!metadataValidation.valid) {
    pushDiagnostic(
      diagnostics,
      "intent_invalid_metadata",
      "Executive Intent metadata failed structural validation.",
      evaluatedAt,
      Object.freeze({
        blocking: true,
        metadata: Object.freeze({ issueCount: metadataValidation.issues.length }),
      })
    );
  }

  const intentValidation = validateExecutiveIntentShape(intent);
  if (!intentValidation.valid) {
    pushDiagnostic(
      diagnostics,
      "intent_invalid_metadata",
      "Executive Intent failed structural validation.",
      evaluatedAt,
      Object.freeze({
        blocking: true,
        metadata: Object.freeze({ issueCount: intentValidation.issues.length }),
      })
    );
  }

  if (
    intent.metadata.dependencies.length > 0 &&
    hasDuplicateIds(intent.metadata.dependencies.map((entry) => entry.dependencyId))
  ) {
    pushDiagnostic(
      diagnostics,
      "intent_duplicate_dependency",
      "Duplicate dependency identifiers detected.",
      evaluatedAt,
      Object.freeze({ blocking: true })
    );
  }

  for (const relation of intent.relations) {
    if (!isIntentRelationType(relation.relationType)) {
      pushDiagnostic(
        diagnostics,
        "intent_invalid_relation",
        `Invalid relation type "${relation.relationType}".`,
        evaluatedAt,
        Object.freeze({ blocking: true, metadata: Object.freeze({ relationId: relation.relationId }) })
      );
    }
  }

  if (hasBlockingRelation(intent) || hasBlockingDependency(intent)) {
    pushDiagnostic(
      diagnostics,
      "intent_blocked",
      "Intent has blocking relations or dependencies.",
      evaluatedAt,
      Object.freeze({
        blocking: true,
        recommendedNextState: "blocked",
      })
    );
  }

  if (intent.metadata.status === "archived" || intent.metadata.lifecycle === "archived") {
    pushDiagnostic(
      diagnostics,
      "intent_archived",
      "Intent is archived.",
      evaluatedAt,
      Object.freeze({ recommendedNextState: "archived" })
    );
  }

  if (!isStatusLifecycleConsistent(intent)) {
    pushDiagnostic(
      diagnostics,
      "intent_status_lifecycle_mismatch",
      "Intent status and lifecycle stage are inconsistent.",
      evaluatedAt,
      Object.freeze({
        metadata: Object.freeze({
          status: intent.metadata.status,
          lifecycle: intent.metadata.lifecycle,
        }),
      })
    );
  }

  if (
    intent.metadata.title.trim().length === 0 ||
    intent.metadata.summary.trim().length === 0
  ) {
    pushDiagnostic(
      diagnostics,
      "intent_incomplete",
      "Intent title or summary is incomplete.",
      evaluatedAt,
      Object.freeze({ recommendedNextState: "valid" })
    );
  }

  const freshness = resolveIntentFreshness(intent, evaluatedAt);
  if (freshness === "stale" || freshness === "expired") {
    pushDiagnostic(
      diagnostics,
      "intent_stale",
      `Intent freshness is ${freshness}.`,
      evaluatedAt,
      Object.freeze({
        recommendedNextState: "valid",
        metadata: Object.freeze({ freshness }),
      })
    );
  }

  if (lifecycleValidation && !lifecycleValidation.allowed) {
    pushDiagnostic(
      diagnostics,
      "intent_illegal_lifecycle_transition",
      lifecycleValidation.reason,
      evaluatedAt,
      Object.freeze({
        blocking: true,
        metadata: Object.freeze({
          from: lifecycleValidation.from,
          to: lifecycleValidation.to,
        }),
      })
    );
  }

  if (
    diagnostics.length === 0 ||
    diagnostics.every((entry) => entry.code === "intent_ok" || entry.severity === "info")
  ) {
    pushDiagnostic(
      diagnostics,
      "intent_ok",
      "Executive Intent state resolved successfully.",
      evaluatedAt,
      Object.freeze({ recommendedNextState: "ready" })
    );
  }

  const structuralHealth = resolveIntentStructuralHealth(intent, diagnostics);
  const readiness = resolveReadiness(intent, structuralHealth, diagnostics, workspaceIsolated);
  const executionState = resolveExecutionState(intent, readiness, structuralHealth);
  const stateCategory = resolveStateCategory(intent, readiness, structuralHealth);

  const flags = Object.freeze({
    isReady: readiness === "ready",
    isBlocked: readiness === "blocked",
    isArchived: readiness === "archived",
    isActionable:
      readiness === "ready" &&
      structuralHealth === "healthy" &&
      workspaceIsolated &&
      intent.metadata.status === "active" &&
      !diagnostics.some((entry) => entry.blocking),
    isStale: freshness === "stale" || freshness === "expired",
    isStructurallyValid: structuralHealth === "healthy" || structuralHealth === "warning",
    isDownstreamReady:
      workspaceIsolated &&
      structuralHealth !== "invalid" &&
      structuralHealth !== "corrupted" &&
      structuralHealth !== "unknown",
    workspaceIsolated,
  });

  return Object.freeze({
    request,
    diagnostics: Object.freeze(diagnostics),
    structuralHealth,
    freshness,
    readiness,
    executionState,
    stateCategory,
    flags,
    lifecycleValidation,
  });
}

export function resolveIntentStateSummary(
  request: ExecutiveIntentStateResolveRequest
): IntentStateSummary {
  const context = evaluateExecutiveIntentStateContext(request);
  const blockingDiagnosticCount = context.diagnostics.filter((entry) => entry.blocking).length;
  const headline =
    context.request.intent?.metadata.title ??
    `Intent ${request.intentId} state unavailable`;

  return createIntentStateSummary({
    intentId: request.intentId,
    workspaceId: request.workspaceId,
    headline,
    stateCategory: context.stateCategory,
    readiness: context.readiness,
    structuralHealth: context.structuralHealth,
    freshness: context.freshness,
    executionState: context.executionState,
    diagnosticCount: context.diagnostics.length,
    blockingDiagnosticCount,
  });
}

export function resolveExecutiveIntentState(
  request: ExecutiveIntentStateResolveRequest
): ExecutiveIntentState {
  const context = evaluateExecutiveIntentStateContext(request);
  return createExecutiveIntentState({
    intentId: request.intentId,
    workspaceId: request.workspaceId,
    stateCategory: context.stateCategory,
    readiness: context.readiness,
    structuralHealth: context.structuralHealth,
    freshness: context.freshness,
    executionState: context.executionState,
    flags: context.flags,
  });
}

export function resolveExecutiveIntentStateResult(
  request: ExecutiveIntentStateResolveRequest
): IntentResolutionResult {
  const context = evaluateExecutiveIntentStateContext(request);
  const state = createExecutiveIntentState({
    intentId: request.intentId,
    workspaceId: request.workspaceId,
    stateCategory: context.stateCategory,
    readiness: context.readiness,
    structuralHealth: context.structuralHealth,
    freshness: context.freshness,
    executionState: context.executionState,
    flags: context.flags,
  });
  const summary = createIntentStateSummary({
    intentId: request.intentId,
    workspaceId: request.workspaceId,
    headline: request.intent?.metadata.title ?? `Intent ${request.intentId} state unavailable`,
    stateCategory: context.stateCategory,
    readiness: context.readiness,
    structuralHealth: context.structuralHealth,
    freshness: context.freshness,
    executionState: context.executionState,
    diagnosticCount: context.diagnostics.length,
    blockingDiagnosticCount: context.diagnostics.filter((entry) => entry.blocking).length,
  });

  return createIntentResolutionResult({
    intentId: request.intentId,
    workspaceId: request.workspaceId,
    state,
    readiness: context.readiness,
    structuralHealth: context.structuralHealth,
    freshness: context.freshness,
    executionState: context.executionState,
    lifecycleValidation: context.lifecycleValidation,
    diagnostics: context.diagnostics,
    summary,
    timestamp: request.evaluatedAt,
    contractVersion: EXECUTIVE_INTENT_CONTRACT_VERSION,
  });
}

export function resolveExecutiveIntentStateProbeExample(
  evaluatedAt: string = new Date(0).toISOString()
): IntentResolutionResult {
  const intent = resolveExecutiveIntentExample(evaluatedAt);
  return resolveExecutiveIntentStateResult(
    Object.freeze({
      intent,
      intentId: intent.intentId,
      workspaceId: intent.workspaceId,
      evaluatedAt,
      proposedLifecycleTransition: null,
    })
  );
}

export function getExecutiveIntentStateEngineVersionMetadata(): Readonly<{
  engineVersion: typeof EXECUTIVE_INTENT_STATE_ENGINE_VERSION;
  contractVersion: typeof EXECUTIVE_INTENT_CONTRACT_VERSION;
  owner: typeof EXECUTIVE_INTENT_STATE_ENGINE_OWNER;
}> {
  return Object.freeze({
    engineVersion: EXECUTIVE_INTENT_STATE_ENGINE_VERSION,
    contractVersion: EXECUTIVE_INTENT_CONTRACT_VERSION,
    owner: EXECUTIVE_INTENT_STATE_ENGINE_OWNER,
  });
}

export { resolveLifecycleTransition } from "./executiveIntentLifecycleMatrix.ts";

export const ExecutiveIntentStateEngine = Object.freeze({
  resolveExecutiveIntentState,
  resolveExecutiveIntentStateResult,
  resolveIntentReadiness,
  resolveIntentStructuralHealth,
  resolveIntentFreshness,
  resolveIntentDiagnostics,
  resolveLifecycleTransition,
  resolveIntentStateSummary,
  isIntentReady,
  isIntentBlocked,
  isIntentArchived,
  isIntentActionable,
  resolveExecutiveIntentStateProbeExample,
  getExecutiveIntentStateEngineVersionMetadata,
  version: EXECUTIVE_INTENT_STATE_ENGINE_VERSION,
  rules: EXECUTIVE_INTENT_STATE_ENGINE_RULES,
});

export type {
  ExecutiveIntentState,
  ExecutiveIntentStateResolveRequest,
  IntentResolutionResult,
  IntentStateSummary,
};
