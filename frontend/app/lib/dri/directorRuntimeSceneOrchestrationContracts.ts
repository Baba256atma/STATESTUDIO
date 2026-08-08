/** DRI-3:2 — formal immutable contracts for semantic Scene orchestration. */

import {
  createDirectorSceneAttention,
  createDirectorSceneFocus,
  createDirectorSceneOrchestrationOperation,
  createDirectorSceneOrchestrationPlan,
  createDirectorScenePath,
  createDirectorSceneRelationshipRef,
  createDirectorSceneSubjectRef,
  createEmptyDirectorSceneOrchestrationPlan,
  directorRuntimeSceneOrchestrationFoundationIdentity,
  type DirectorSceneAttention,
  type DirectorSceneFocus,
  type DirectorSceneOrchestrationContext,
  type DirectorSceneOrchestrationOperation,
  type DirectorSceneOrchestrationPlan,
  type DirectorScenePath,
  type DirectorSceneRelationshipRef,
  type DirectorSceneSubjectRef,
} from "@/app/lib/dri/directorRuntimeSceneOrchestrationFoundation";

export type {
  DirectorSceneAttention, DirectorSceneFocus, DirectorSceneOrchestrationContext,
  DirectorSceneOrchestrationOperation, DirectorSceneOrchestrationOperationKind,
  DirectorSceneOrchestrationPlan, DirectorScenePath,
  DirectorSceneRelationshipRef, DirectorSceneSubjectRef,
} from "@/app/lib/dri/directorRuntimeSceneOrchestrationFoundation";

export const directorRuntimeSceneOrchestrationContractsIdentity =
  "DRI-3:2/DirectorRuntimeSceneOrchestrationContracts" as const;
export const directorRuntimeSceneOrchestrationContractsVersion = "3.2.0" as const;
export const directorRuntimeSceneOrchestrationContractsNamespace =
  "nexora.dri.scene.orchestration.contracts" as const;
export const directorRuntimeSceneOrchestrationContractsUpstream =
  directorRuntimeSceneOrchestrationFoundationIdentity;

export const DIRECTOR_SCENE_ORCHESTRATION_RESULT_STATUSES = Object.freeze([
  "resolved", "partial", "rejected",
] as const);
export type DirectorSceneOrchestrationResultStatus =
  (typeof DIRECTOR_SCENE_ORCHESTRATION_RESULT_STATUSES)[number];

export const DIRECTOR_SCENE_ORCHESTRATION_ISSUE_SEVERITIES = Object.freeze([
  "notice", "warning", "error",
] as const);
export type DirectorSceneOrchestrationIssueSeverity =
  (typeof DIRECTOR_SCENE_ORCHESTRATION_ISSUE_SEVERITIES)[number];

export const DIRECTOR_SCENE_ORCHESTRATION_SCOPES = Object.freeze([
  "scene", "focus", "subject", "relationship", "path",
] as const);
export type DirectorSceneOrchestrationScope =
  (typeof DIRECTOR_SCENE_ORCHESTRATION_SCOPES)[number];

export const DIRECTOR_SCENE_ORCHESTRATION_CAPABILITIES = Object.freeze([
  "focus", "attention", "visibility", "relationship", "path", "preservation",
] as const);
export type DirectorSceneOrchestrationCapability =
  (typeof DIRECTOR_SCENE_ORCHESTRATION_CAPABILITIES)[number];

export interface DirectorSceneOrchestrationRequest {
  readonly requestId: string;
  readonly context: DirectorSceneOrchestrationContext;
  readonly subjects: readonly DirectorSceneSubjectRef[];
  readonly relationships: readonly DirectorSceneRelationshipRef[];
  readonly requestedFocus: DirectorSceneFocus | null;
  readonly requestedAttention: readonly DirectorSceneAttention[];
  readonly requestedPaths: readonly DirectorScenePath[];
  readonly requestedOperations: readonly DirectorSceneOrchestrationOperation[];
}

export interface DirectorSceneOrchestrationIssue {
  readonly code: string;
  readonly severity: DirectorSceneOrchestrationIssueSeverity;
  readonly message: string;
  readonly subjectId?: string;
  readonly operationId?: string;
}

export interface DirectorSceneOrchestrationResult {
  readonly requestId: string;
  readonly status: DirectorSceneOrchestrationResultStatus;
  readonly plan: DirectorSceneOrchestrationPlan | null;
  readonly issues: readonly DirectorSceneOrchestrationIssue[];
}

export type ResolveDirectorSceneOrchestration = (
  request: DirectorSceneOrchestrationRequest,
) => DirectorSceneOrchestrationResult;

export interface DirectorSceneOrchestrationResolver {
  readonly resolve: ResolveDirectorSceneOrchestration;
}

export interface DirectorSceneOrchestrationProducerInput {
  readonly requestId: string;
  readonly context: DirectorSceneOrchestrationContext;
  readonly subjects?: readonly DirectorSceneSubjectRef[];
  readonly relationships?: readonly DirectorSceneRelationshipRef[];
}

export interface DirectorSceneOrchestrationProducer {
  readonly produce: (input: DirectorSceneOrchestrationProducerInput) => DirectorSceneOrchestrationRequest;
}

export interface DirectorSceneOrchestrationConsumption {
  readonly planId: string;
  readonly accepted: boolean;
}

export interface DirectorSceneOrchestrationConsumer {
  readonly consume: (plan: DirectorSceneOrchestrationPlan) => DirectorSceneOrchestrationConsumption;
}

export interface DirectorSceneOrchestrationPlanSource {
  readonly requestId: string;
  readonly runtimeContextId: string;
  readonly runtimeStateId?: string;
}

export interface DirectorSceneOrchestrationIntent {
  readonly intentId: string;
  readonly scope: DirectorSceneOrchestrationScope;
  readonly operations: readonly DirectorSceneOrchestrationOperation[];
}

export interface DirectorSceneOrchestrationBatch {
  readonly batchId: string;
  readonly intents: readonly DirectorSceneOrchestrationIntent[];
}

export interface DirectorSceneOrchestrationCapabilities {
  readonly supported: readonly DirectorSceneOrchestrationCapability[];
}

export interface DirectorSceneOrchestrationContractDescriptor {
  readonly id: typeof directorRuntimeSceneOrchestrationContractsIdentity;
  readonly namespace: typeof directorRuntimeSceneOrchestrationContractsNamespace;
  readonly version: typeof directorRuntimeSceneOrchestrationContractsVersion;
  readonly capabilities: DirectorSceneOrchestrationCapabilities;
}

function normalizeContext(context: DirectorSceneOrchestrationContext, requestId: string) {
  return createEmptyDirectorSceneOrchestrationPlan({ planId: requestId, context }).context;
}

export function createDirectorSceneOrchestrationRequest(input: {
  readonly requestId: string;
  readonly context: DirectorSceneOrchestrationContext;
  readonly subjects?: readonly DirectorSceneSubjectRef[];
  readonly relationships?: readonly DirectorSceneRelationshipRef[];
  readonly requestedFocus?: DirectorSceneFocus | null;
  readonly requestedAttention?: readonly DirectorSceneAttention[];
  readonly requestedPaths?: readonly DirectorScenePath[];
  readonly requestedOperations?: readonly DirectorSceneOrchestrationOperation[];
}): DirectorSceneOrchestrationRequest {
  return Object.freeze({ requestId: input.requestId, context: normalizeContext(input.context, input.requestId),
    subjects: Object.freeze((input.subjects ?? []).map(createDirectorSceneSubjectRef)),
    relationships: Object.freeze((input.relationships ?? []).map(createDirectorSceneRelationshipRef)),
    requestedFocus: input.requestedFocus === undefined || input.requestedFocus === null ? null :
      createDirectorSceneFocus(input.requestedFocus),
    requestedAttention: Object.freeze((input.requestedAttention ?? []).map(createDirectorSceneAttention)),
    requestedPaths: Object.freeze((input.requestedPaths ?? []).map(createDirectorScenePath)),
    requestedOperations: Object.freeze((input.requestedOperations ?? [])
      .map(createDirectorSceneOrchestrationOperation)),
  });
}

export function createDirectorSceneOrchestrationIntent(
  input: DirectorSceneOrchestrationIntent,
): DirectorSceneOrchestrationIntent {
  return Object.freeze({ intentId: input.intentId, scope: input.scope,
    operations: Object.freeze(input.operations.map(createDirectorSceneOrchestrationOperation)) });
}

export function createDirectorSceneOrchestrationBatch(
  input: DirectorSceneOrchestrationBatch,
): DirectorSceneOrchestrationBatch {
  return Object.freeze({ batchId: input.batchId,
    intents: Object.freeze(input.intents.map(createDirectorSceneOrchestrationIntent)) });
}

export function createDirectorSceneOrchestrationIssue(
  input: DirectorSceneOrchestrationIssue,
): DirectorSceneOrchestrationIssue {
  return Object.freeze({ ...input });
}

export function createDirectorSceneOrchestrationPlanSource(
  input: DirectorSceneOrchestrationPlanSource,
): DirectorSceneOrchestrationPlanSource {
  return Object.freeze({ ...input });
}

export function createDirectorSceneOrchestrationResult(input: {
  readonly requestId: string;
  readonly status: DirectorSceneOrchestrationResultStatus;
  readonly plan?: DirectorSceneOrchestrationPlan | null;
  readonly issues?: readonly DirectorSceneOrchestrationIssue[];
}): DirectorSceneOrchestrationResult {
  const issues = (input.issues ?? []).map(createDirectorSceneOrchestrationIssue);
  if (input.status === "resolved" && input.plan == null) {
    issues.push(createDirectorSceneOrchestrationIssue({ code: "missing-resolved-plan", severity: "error",
      message: "A resolved orchestration result requires a plan." }));
    return Object.freeze({ requestId: input.requestId, status: "rejected" as const, plan: null,
      issues: Object.freeze(issues) });
  }
  const plan = input.status === "rejected" || input.plan == null ? null :
    createDirectorSceneOrchestrationPlan(input.plan);
  return Object.freeze({ requestId: input.requestId, status: input.status, plan,
    issues: Object.freeze(issues) });
}

export function isDirectorSceneOrchestrationRequest(
  value: unknown,
): value is DirectorSceneOrchestrationRequest {
  if (value === null || typeof value !== "object") return false;
  const candidate = value as Partial<DirectorSceneOrchestrationRequest>;
  return typeof candidate.requestId === "string" && candidate.context !== null &&
    typeof candidate.context === "object" && Array.isArray(candidate.subjects) &&
    Array.isArray(candidate.relationships) && Array.isArray(candidate.requestedAttention) &&
    Array.isArray(candidate.requestedPaths) && Array.isArray(candidate.requestedOperations);
}

export function isDirectorSceneOrchestrationResult(
  value: unknown,
): value is DirectorSceneOrchestrationResult {
  if (value === null || typeof value !== "object") return false;
  const candidate = value as Partial<DirectorSceneOrchestrationResult>;
  return typeof candidate.requestId === "string" &&
    DIRECTOR_SCENE_ORCHESTRATION_RESULT_STATUSES.includes(candidate.status as never) &&
    Array.isArray(candidate.issues) &&
    (candidate.status === "rejected" ? candidate.plan === null :
      candidate.status === "resolved" ? candidate.plan !== null && typeof candidate.plan === "object" : true);
}

export function isDirectorSceneOrchestrationIntent(
  value: unknown,
): value is DirectorSceneOrchestrationIntent {
  if (value === null || typeof value !== "object") return false;
  const candidate = value as Partial<DirectorSceneOrchestrationIntent>;
  return typeof candidate.intentId === "string" &&
    DIRECTOR_SCENE_ORCHESTRATION_SCOPES.includes(candidate.scope as never) &&
    Array.isArray(candidate.operations);
}

export const directorSceneOrchestrationCapabilities = Object.freeze({
  supported: DIRECTOR_SCENE_ORCHESTRATION_CAPABILITIES,
}) satisfies DirectorSceneOrchestrationCapabilities;

export const directorRuntimeSceneOrchestrationContractDescriptor = Object.freeze({
  id: directorRuntimeSceneOrchestrationContractsIdentity,
  namespace: directorRuntimeSceneOrchestrationContractsNamespace,
  version: directorRuntimeSceneOrchestrationContractsVersion,
  capabilities: directorSceneOrchestrationCapabilities,
}) satisfies DirectorSceneOrchestrationContractDescriptor;

export const directorRuntimeSceneOrchestrationContractConcepts = Object.freeze([
  "Orchestration Request", "Orchestration Result", "Result Status", "Issue", "Issue Severity",
  "Resolver", "Producer", "Consumer", "Scope", "Intent", "Batch", "Capability",
  "Capability Descriptor", "Plan Source", "Contract Descriptor",
] as const);
export const directorRuntimeSceneOrchestrationContractApiNames = Object.freeze([
  "createDirectorSceneOrchestrationRequest", "createDirectorSceneOrchestrationIntent",
  "createDirectorSceneOrchestrationBatch", "createDirectorSceneOrchestrationIssue",
  "createDirectorSceneOrchestrationPlanSource", "createDirectorSceneOrchestrationResult",
  "isDirectorSceneOrchestrationRequest", "isDirectorSceneOrchestrationResult",
  "isDirectorSceneOrchestrationIntent",
] as const);

export const directorRuntimeSceneOrchestrationContractsRegistry = Object.freeze({
  concepts: directorRuntimeSceneOrchestrationContractConcepts,
  conceptCount: directorRuntimeSceneOrchestrationContractConcepts.length,
  resultStatuses: DIRECTOR_SCENE_ORCHESTRATION_RESULT_STATUSES,
  resultStatusCount: DIRECTOR_SCENE_ORCHESTRATION_RESULT_STATUSES.length,
  issueSeverities: DIRECTOR_SCENE_ORCHESTRATION_ISSUE_SEVERITIES,
  issueSeverityCount: DIRECTOR_SCENE_ORCHESTRATION_ISSUE_SEVERITIES.length,
  scopes: DIRECTOR_SCENE_ORCHESTRATION_SCOPES,
  scopeCount: DIRECTOR_SCENE_ORCHESTRATION_SCOPES.length,
  capabilities: DIRECTOR_SCENE_ORCHESTRATION_CAPABILITIES,
  capabilityCount: DIRECTOR_SCENE_ORCHESTRATION_CAPABILITIES.length,
  publicApis: directorRuntimeSceneOrchestrationContractApiNames,
  publicApiCount: directorRuntimeSceneOrchestrationContractApiNames.length,
});

export const directorRuntimeSceneOrchestrationContracts = Object.freeze({
  identity: directorRuntimeSceneOrchestrationContractsIdentity,
  namespace: directorRuntimeSceneOrchestrationContractsNamespace,
  version: directorRuntimeSceneOrchestrationContractsVersion,
  layer: "DRI" as const, capability: "DirectorRuntimeSceneOrchestration" as const,
  stage: "Contracts" as const, immediateDependency: directorRuntimeSceneOrchestrationContractsUpstream,
  resultStatuses: DIRECTOR_SCENE_ORCHESTRATION_RESULT_STATUSES,
  issueSeverities: DIRECTOR_SCENE_ORCHESTRATION_ISSUE_SEVERITIES,
  scopes: DIRECTOR_SCENE_ORCHESTRATION_SCOPES,
  capabilities: directorSceneOrchestrationCapabilities,
  contractDescriptor: directorRuntimeSceneOrchestrationContractDescriptor,
  publicApiSurface: directorRuntimeSceneOrchestrationContractApiNames,
  registry: directorRuntimeSceneOrchestrationContractsRegistry,
});
