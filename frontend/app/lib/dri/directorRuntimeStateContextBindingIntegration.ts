/** DRI-2:4 — deterministic, non-owning access boundary to the DRI-2:3 Engine. */

import {
  createRuntimeStateContextBindingRequest,
  directorRuntimeStateContextBindingEngineIdentity,
  executeRuntimeStateContextBindingEngine,
  isBoundRuntimeStateContextBindingResult,
  normalizeRuntimeStateContextBindingEngineInput,
  type RuntimeStateContextBindingEngineInput,
  type RuntimeStateContextBindingEngineOutput,
} from "@/app/lib/dri/directorRuntimeStateContextBindingEngine";

export {
  createRuntimeStateContextBindingRequest,
  executeRuntimeStateContextBindingEngine,
  isBoundRuntimeStateContextBindingResult,
};
export type {
  BoundRuntimeContext, RuntimeContextReference, RuntimeStateContextBindingEngineInput,
  RuntimeStateContextBindingEngineOutput, RuntimeStateContextBindingInspection,
  RuntimeStateContextBindingRequest, RuntimeStateContextBindingResult,
  RuntimeStateContextBindingScope, RuntimeStateContextBindingStatus, RuntimeStateReference,
} from "@/app/lib/dri/directorRuntimeStateContextBindingEngine";

export const directorRuntimeStateContextBindingIntegrationIdentity =
  "DRI-2:4/DirectorRuntimeStateContextBindingIntegration" as const;
export const directorRuntimeStateContextBindingIntegrationVersion = "2.4.0" as const;
export const directorRuntimeStateContextBindingIntegrationNamespace =
  "nexora.dri.runtime.state-context-binding.integration" as const;
export const directorRuntimeStateContextBindingIntegrationUpstream =
  directorRuntimeStateContextBindingEngineIdentity;

export const RUNTIME_STATE_CONTEXT_BINDING_CONSUMER_ROLES = Object.freeze([
  "runtime", "director", "inspection",
] as const);
export type RuntimeStateContextBindingConsumerRole =
  (typeof RUNTIME_STATE_CONTEXT_BINDING_CONSUMER_ROLES)[number];

export const RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_DIRECTIONS = Object.freeze([
  "runtime-to-director", "director-to-runtime", "inspection-only",
] as const);
export type RuntimeStateContextBindingIntegrationDirection =
  (typeof RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_DIRECTIONS)[number];

export const RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_STATUSES = Object.freeze([
  "accepted", "completed", "rejected",
] as const);
export type RuntimeStateContextBindingIntegrationStatus =
  (typeof RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_STATUSES)[number];

export const RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_REJECTION_REASON_IDS = Object.freeze([
  "invalid-consumer-role", "invalid-integration-direction", "role-direction-mismatch",
  "missing-engine-input", "invalid-integration-request",
] as const);
export type RuntimeStateContextBindingIntegrationRejectionReasonId =
  (typeof RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_REJECTION_REASON_IDS)[number];

export const RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_PHASES = Object.freeze([
  "request-accepted", "envelope-validated", "engine-delegated", "outcome-created",
] as const);
export type RuntimeStateContextBindingIntegrationPhase =
  (typeof RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_PHASES)[number];

export interface RuntimeStateContextBindingIntegrationRequest {
  readonly consumerRole: RuntimeStateContextBindingConsumerRole;
  readonly direction: RuntimeStateContextBindingIntegrationDirection;
  readonly engineInput: RuntimeStateContextBindingEngineInput;
}

export interface RuntimeStateContextBindingIntegrationRejectionReason {
  readonly id: RuntimeStateContextBindingIntegrationRejectionReasonId;
}

export interface CompletedRuntimeStateContextBindingIntegrationOutcome {
  readonly status: "completed";
  readonly consumerRole: RuntimeStateContextBindingConsumerRole;
  readonly direction: RuntimeStateContextBindingIntegrationDirection;
  readonly engineOutput: RuntimeStateContextBindingEngineOutput;
  readonly bindingResult: RuntimeStateContextBindingEngineOutput["result"];
  readonly inspection: RuntimeStateContextBindingEngineOutput["inspection"];
  readonly rejectionReasons: readonly [];
  readonly phases: typeof RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_PHASES;
}

export interface RejectedRuntimeStateContextBindingIntegrationOutcome {
  readonly status: "rejected";
  readonly consumerRole: string | null;
  readonly direction: string | null;
  readonly rejectionReasons: readonly RuntimeStateContextBindingIntegrationRejectionReason[];
  readonly phases: readonly ["request-accepted", "envelope-validated"];
}

export type RuntimeStateContextBindingIntegrationOutcome =
  CompletedRuntimeStateContextBindingIntegrationOutcome |
  RejectedRuntimeStateContextBindingIntegrationOutcome;

export interface RuntimeStateContextBindingIntegrationInspection {
  readonly consumerRole: string | null;
  readonly direction: string | null;
  readonly integrationStatus: "completed" | "rejected";
  readonly bindingStatus: RuntimeStateContextBindingEngineOutput["result"]["status"] | null;
  readonly compatibilityState: RuntimeStateContextBindingEngineOutput["compatibility"]["state"] | null;
  readonly bindingId: string | null;
  readonly availableContextDimensions:
    RuntimeStateContextBindingEngineOutput["inspection"]["availableContextDimensions"];
  readonly missingRequiredDimensions:
    RuntimeStateContextBindingEngineOutput["inspection"]["missingRequiredDimensions"];
}

const ROLE_DIRECTIONS = Object.freeze({
  runtime: Object.freeze(["runtime-to-director", "inspection-only"] as const),
  director: Object.freeze(["director-to-runtime", "inspection-only"] as const),
  inspection: Object.freeze(["inspection-only"] as const),
});

export function createRuntimeStateContextBindingIntegrationRequest(
  input: RuntimeStateContextBindingIntegrationRequest,
): RuntimeStateContextBindingIntegrationRequest {
  return Object.freeze({
    consumerRole: input.consumerRole,
    direction: input.direction,
    engineInput: normalizeRuntimeStateContextBindingEngineInput(input.engineInput),
  });
}

function includesValue<const T extends readonly string[]>(values: T, value: unknown):
  value is T[number] {
  return typeof value === "string" && values.includes(value as T[number]);
}

function rejectionReason(id: RuntimeStateContextBindingIntegrationRejectionReasonId) {
  return Object.freeze({ id });
}

export function integrateRuntimeStateContextBinding(
  request: RuntimeStateContextBindingIntegrationRequest | null | undefined,
): RuntimeStateContextBindingIntegrationOutcome {
  if (request === null || request === undefined || typeof request !== "object") {
    return Object.freeze({
      status: "rejected" as const,
      consumerRole: null,
      direction: null,
      rejectionReasons: Object.freeze([rejectionReason("invalid-integration-request")]),
      phases: Object.freeze(["request-accepted", "envelope-validated"] as const),
    });
  }
  const reasons: RuntimeStateContextBindingIntegrationRejectionReason[] = [];
  const roleValid = includesValue(RUNTIME_STATE_CONTEXT_BINDING_CONSUMER_ROLES,
    request.consumerRole);
  const directionValid = includesValue(RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_DIRECTIONS,
    request.direction);
  if (!roleValid) reasons.push(rejectionReason("invalid-consumer-role"));
  if (!directionValid) reasons.push(rejectionReason("invalid-integration-direction"));
  if (!("engineInput" in request) || request.engineInput === null ||
      typeof request.engineInput !== "object") reasons.push(rejectionReason("missing-engine-input"));
  if (roleValid && directionValid &&
      !ROLE_DIRECTIONS[request.consumerRole].includes(request.direction as never))
    reasons.push(rejectionReason("role-direction-mismatch"));
  if (reasons.length > 0) return Object.freeze({
    status: "rejected" as const,
    consumerRole: typeof request.consumerRole === "string" ? request.consumerRole : null,
    direction: typeof request.direction === "string" ? request.direction : null,
    rejectionReasons: Object.freeze(reasons),
    phases: Object.freeze(["request-accepted", "envelope-validated"] as const),
  });

  const normalized = createRuntimeStateContextBindingIntegrationRequest(request);
  const engineOutput = executeRuntimeStateContextBindingEngine(normalized.engineInput);
  return Object.freeze({
    status: "completed" as const,
    consumerRole: normalized.consumerRole,
    direction: normalized.direction,
    engineOutput,
    bindingResult: engineOutput.result,
    inspection: engineOutput.inspection,
    rejectionReasons: Object.freeze([] as const),
    phases: RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_PHASES,
  });
}

export function isCompletedRuntimeStateContextBindingIntegration(
  outcome: RuntimeStateContextBindingIntegrationOutcome,
): outcome is CompletedRuntimeStateContextBindingIntegrationOutcome {
  return outcome.status === "completed";
}

export function isRejectedRuntimeStateContextBindingIntegration(
  outcome: RuntimeStateContextBindingIntegrationOutcome,
): outcome is RejectedRuntimeStateContextBindingIntegrationOutcome {
  return outcome.status === "rejected";
}

export function inspectRuntimeStateContextBindingIntegrationOutcome(
  outcome: RuntimeStateContextBindingIntegrationOutcome,
): RuntimeStateContextBindingIntegrationInspection {
  if (isCompletedRuntimeStateContextBindingIntegration(outcome)) return Object.freeze({
    consumerRole: outcome.consumerRole,
    direction: outcome.direction,
    integrationStatus: outcome.status,
    bindingStatus: outcome.bindingResult.status,
    compatibilityState: outcome.engineOutput.compatibility.state,
    bindingId: outcome.inspection.bindingId,
    availableContextDimensions: outcome.inspection.availableContextDimensions,
    missingRequiredDimensions: outcome.inspection.missingRequiredDimensions,
  });
  return Object.freeze({
    consumerRole: outcome.consumerRole,
    direction: outcome.direction,
    integrationStatus: outcome.status,
    bindingStatus: null,
    compatibilityState: null,
    bindingId: null,
    availableContextDimensions: Object.freeze([]),
    missingRequiredDimensions: Object.freeze([]),
  });
}

export const runtimeStateContextBindingIntegrationContractNames = Object.freeze([
  "RuntimeStateContextBindingIntegrationRequest",
  "RuntimeStateContextBindingIntegrationRejectionReason",
  "RuntimeStateContextBindingIntegrationOutcome",
  "CompletedRuntimeStateContextBindingIntegrationOutcome",
  "RejectedRuntimeStateContextBindingIntegrationOutcome",
  "RuntimeStateContextBindingIntegrationInspection",
] as const);
export const runtimeStateContextBindingIntegrationApiNames = Object.freeze([
  "createRuntimeStateContextBindingIntegrationRequest",
  "integrateRuntimeStateContextBinding",
  "inspectRuntimeStateContextBindingIntegrationOutcome",
] as const);
export const runtimeStateContextBindingIntegrationPredicateNames = Object.freeze([
  "isCompletedRuntimeStateContextBindingIntegration",
  "isRejectedRuntimeStateContextBindingIntegration",
] as const);
export const runtimeStateContextBindingIntegrationPublicApiSurface = Object.freeze([
  ...runtimeStateContextBindingIntegrationApiNames,
  ...runtimeStateContextBindingIntegrationPredicateNames,
] as const);

export const runtimeStateContextBindingIntegrationRegistry = Object.freeze({
  contractTypes: runtimeStateContextBindingIntegrationContractNames,
  contractTypeCount: runtimeStateContextBindingIntegrationContractNames.length,
  consumerRoles: RUNTIME_STATE_CONTEXT_BINDING_CONSUMER_ROLES,
  consumerRoleCount: RUNTIME_STATE_CONTEXT_BINDING_CONSUMER_ROLES.length,
  directions: RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_DIRECTIONS,
  directionCount: RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_DIRECTIONS.length,
  statuses: RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_STATUSES,
  statusCount: RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_STATUSES.length,
  rejectionReasons: RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_REJECTION_REASON_IDS,
  rejectionReasonCount: RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_REJECTION_REASON_IDS.length,
  integrationPhases: RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_PHASES,
  integrationPhaseCount: RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_PHASES.length,
  functionalApis: runtimeStateContextBindingIntegrationApiNames,
  functionalApiCount: runtimeStateContextBindingIntegrationApiNames.length,
  predicates: runtimeStateContextBindingIntegrationPredicateNames,
  predicateCount: runtimeStateContextBindingIntegrationPredicateNames.length,
  publicApiSurface: runtimeStateContextBindingIntegrationPublicApiSurface,
  publicApiCount: runtimeStateContextBindingIntegrationPublicApiSurface.length,
});

export const directorRuntimeStateContextBindingIntegration = Object.freeze({
  identity: directorRuntimeStateContextBindingIntegrationIdentity,
  version: directorRuntimeStateContextBindingIntegrationVersion,
  namespace: directorRuntimeStateContextBindingIntegrationNamespace,
  layer: "DRI" as const,
  capability: "RuntimeStateContextBinding" as const,
  stage: "Integration" as const,
  immediateDependency: directorRuntimeStateContextBindingIntegrationUpstream,
  consumerRoles: RUNTIME_STATE_CONTEXT_BINDING_CONSUMER_ROLES,
  directions: RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_DIRECTIONS,
  integrationStatuses: RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_STATUSES,
  rejectionReasons: RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_REJECTION_REASON_IDS,
  integrationPhases: RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_PHASES,
  characteristics: Object.freeze([
    "deterministic", "stateless", "synchronous", "immutable", "side-effect-free",
    "engine-delegating", "plain-data", "non-owning",
  ] as const),
  publicApiSurface: runtimeStateContextBindingIntegrationPublicApiSurface,
  registry: runtimeStateContextBindingIntegrationRegistry,
});
