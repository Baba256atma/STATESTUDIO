/**
 * DRI-4:2 — Director Runtime Interaction Contracts.
 *
 * Formal immutable contracts through which DRI-4:1 interaction observations
 * enter the Interaction Orchestration pipeline.
 *
 * Interaction Contract ≠ Director Intent.
 * Structural eligibility only — no intent resolution, focus/selection,
 * reaction planning, scene mutation, or execution.
 */

import {
  createDirectorInteractionObservation,
  createDirectorInteractionTarget,
  directorRuntimeInteractionOrchestrationFoundationIdentity,
  isDirectorInteractionKind,
  isDirectorInteractionQualifier,
  isDirectorInteractionSequence,
  isDirectorInteractionSource,
  isDirectorInteractionTargetKind,
  type CreateDirectorInteractionObservationInput,
  type DirectorInteractionObservation,
} from "@/app/lib/dri/directorRuntimeInteractionOrchestrationFoundation";

export type {
  DirectorInteractionKind,
  DirectorInteractionObservation,
  DirectorInteractionQualifier,
  DirectorInteractionScope,
  DirectorInteractionSource,
  DirectorInteractionTarget,
  DirectorInteractionTargetKind,
} from "@/app/lib/dri/directorRuntimeInteractionOrchestrationFoundation";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeInteractionContractsIdentity =
  "DRI-4:2/DirectorRuntimeInteractionContracts" as const;
export const directorRuntimeInteractionContractsVersion = "4.2.0" as const;
export const directorRuntimeInteractionContractsNamespace =
  "nexora.dri.interaction.orchestration.contracts" as const;
export const directorRuntimeInteractionContractsUpstream =
  directorRuntimeInteractionOrchestrationFoundationIdentity;

/** Dedicated interaction-contract version used for compatibility checks. */
export const DIRECTOR_RUNTIME_INTERACTION_CONTRACT_VERSION =
  directorRuntimeInteractionContractsVersion;

export const DIRECTOR_RUNTIME_INTERACTION_SUPPORTED_CONTRACT_VERSIONS = Object.freeze([
  DIRECTOR_RUNTIME_INTERACTION_CONTRACT_VERSION,
] as const);
export type DirectorRuntimeInteractionContractVersion =
  (typeof DIRECTOR_RUNTIME_INTERACTION_SUPPORTED_CONTRACT_VERSIONS)[number];

// ─── Disposition & rejection vocabularies ───────────────────────────────────

export const DIRECTOR_RUNTIME_INTERACTION_CONTRACT_DISPOSITIONS = Object.freeze([
  "accepted",
  "rejected",
] as const);
export type DirectorRuntimeInteractionContractDisposition =
  (typeof DIRECTOR_RUNTIME_INTERACTION_CONTRACT_DISPOSITIONS)[number];

export const DIRECTOR_RUNTIME_INTERACTION_REJECTION_REASONS = Object.freeze([
  "invalid-request",
  "invalid-observation",
  "invalid-context",
  "invalid-target",
  "invalid-sequence",
  "unsupported-version",
  "contract-incompatible",
] as const);
export type DirectorRuntimeInteractionRejectionReason =
  (typeof DIRECTOR_RUNTIME_INTERACTION_REJECTION_REASONS)[number];

// ─── Context contract ───────────────────────────────────────────────────────

export interface DirectorRuntimeInteractionContext {
  readonly sceneId?: string;
  readonly workspaceId?: string;
  readonly modeId?: string;
  readonly lensId?: string;
  readonly activeObjectId?: string;
  readonly activePackId?: string;
  readonly runtimeContextId?: string;
}

export interface CreateDirectorRuntimeInteractionContextInput {
  readonly sceneId?: string;
  readonly workspaceId?: string;
  readonly modeId?: string;
  readonly lensId?: string;
  readonly activeObjectId?: string;
  readonly activePackId?: string;
  readonly runtimeContextId?: string;
}

const CONTEXT_KEYS = Object.freeze([
  "sceneId",
  "workspaceId",
  "modeId",
  "lensId",
  "activeObjectId",
  "activePackId",
  "runtimeContextId",
] as const);

// ─── Request / result / envelope contracts ──────────────────────────────────

export interface DirectorRuntimeInteractionRequest {
  readonly requestId: string;
  readonly observation: DirectorInteractionObservation;
  readonly context: DirectorRuntimeInteractionContext;
  readonly contractVersion: DirectorRuntimeInteractionContractVersion;
}

export interface CreateDirectorRuntimeInteractionRequestInput {
  readonly requestId: string;
  readonly observation: CreateDirectorInteractionObservationInput | DirectorInteractionObservation;
  readonly context?: CreateDirectorRuntimeInteractionContextInput;
  readonly contractVersion?: string;
}

export interface AcceptedDirectorRuntimeInteractionContract {
  readonly disposition: "accepted";
  readonly request: DirectorRuntimeInteractionRequest;
  readonly contractIdentity: typeof directorRuntimeInteractionContractsIdentity;
  readonly contractVersion: DirectorRuntimeInteractionContractVersion;
}

export interface RejectedDirectorRuntimeInteractionContract {
  readonly disposition: "rejected";
  readonly reason: DirectorRuntimeInteractionRejectionReason;
  readonly request: DirectorRuntimeInteractionRequest | null;
  readonly contractIdentity: typeof directorRuntimeInteractionContractsIdentity;
  readonly contractVersion: DirectorRuntimeInteractionContractVersion;
}

export type DirectorRuntimeInteractionContractResult =
  | AcceptedDirectorRuntimeInteractionContract
  | RejectedDirectorRuntimeInteractionContract;

export interface DirectorRuntimeInteractionContractEnvelope {
  readonly contractIdentity: typeof directorRuntimeInteractionContractsIdentity;
  readonly contractVersion: DirectorRuntimeInteractionContractVersion;
  readonly request: DirectorRuntimeInteractionRequest | null;
  readonly result: DirectorRuntimeInteractionContractResult;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function isSupportedContractVersion(
  value: unknown,
): value is DirectorRuntimeInteractionContractVersion {
  return (DIRECTOR_RUNTIME_INTERACTION_SUPPORTED_CONTRACT_VERSIONS as readonly unknown[])
    .includes(value);
}

function isRejectionReason(
  value: unknown,
): value is DirectorRuntimeInteractionRejectionReason {
  return (DIRECTOR_RUNTIME_INTERACTION_REJECTION_REASONS as readonly unknown[]).includes(value);
}

function optionalContextId(value: unknown, field: string): string | undefined {
  if (value === undefined) return undefined;
  if (!isNonEmptyString(value)) {
    throw new TypeError(`${field} must be a non-empty opaque identifier when supplied`);
  }
  return value;
}

function validateContextShape(
  value: unknown,
): DirectorRuntimeInteractionRejectionReason | null {
  if (value === undefined) return null;
  if (!isPlainObject(value)) return "invalid-context";
  for (const key of CONTEXT_KEYS) {
    const field = value[key];
    if (field !== undefined && !isNonEmptyString(field)) return "invalid-context";
  }
  for (const key of Object.keys(value)) {
    if (!(CONTEXT_KEYS as readonly string[]).includes(key)) return "invalid-context";
  }
  return null;
}

function validateTargetShape(
  value: unknown,
): DirectorRuntimeInteractionRejectionReason | null {
  if (!isPlainObject(value)) return "invalid-target";
  if (!isDirectorInteractionTargetKind(value.kind)) return "invalid-target";
  try {
    createDirectorInteractionTarget({
      kind: value.kind,
      id: typeof value.id === "string" ? value.id : "",
      ...(value.parentId === undefined ? {} : { parentId: value.parentId as string }),
      ...(value.scope === undefined ? {} : { scope: value.scope as never }),
    });
    return null;
  } catch {
    return "invalid-target";
  }
}

function validateObservationShape(
  value: unknown,
): DirectorRuntimeInteractionRejectionReason | null {
  if (!isPlainObject(value)) return "invalid-observation";
  if (!isNonEmptyString(value.interactionId)) return "invalid-observation";
  if (!isDirectorInteractionKind(value.kind)) return "invalid-observation";
  if (!isDirectorInteractionSource(value.source)) return "invalid-observation";
  if (!isPlainObject(value.target)) return "invalid-observation";

  const targetReason = validateTargetShape(value.target);
  if (targetReason !== null) return targetReason;

  if (!isDirectorInteractionSequence(value.sequence)) return "invalid-sequence";

  if (value.contextRef !== undefined && !isNonEmptyString(value.contextRef)) {
    return "invalid-observation";
  }
  if (value.orderKey !== undefined) {
    const orderKey = value.orderKey;
    const validOrderKey =
      (typeof orderKey === "string" && isNonEmptyString(orderKey)) ||
      (typeof orderKey === "number" && Number.isFinite(orderKey));
    if (!validOrderKey) return "invalid-observation";
  }
  if (value.qualifiers !== undefined) {
    if (!Array.isArray(value.qualifiers)) return "invalid-observation";
    if (!value.qualifiers.every((item) => isDirectorInteractionQualifier(item))) {
      return "invalid-observation";
    }
  }

  try {
    createDirectorInteractionObservation(
      value as CreateDirectorInteractionObservationInput,
    );
    return null;
  } catch {
    return "invalid-observation";
  }
}

// ─── Construction ───────────────────────────────────────────────────────────

export function createDirectorRuntimeInteractionContext(
  input: CreateDirectorRuntimeInteractionContextInput = {},
): DirectorRuntimeInteractionContext {
  const sceneId = optionalContextId(input.sceneId, "sceneId");
  const workspaceId = optionalContextId(input.workspaceId, "workspaceId");
  const modeId = optionalContextId(input.modeId, "modeId");
  const lensId = optionalContextId(input.lensId, "lensId");
  const activeObjectId = optionalContextId(input.activeObjectId, "activeObjectId");
  const activePackId = optionalContextId(input.activePackId, "activePackId");
  const runtimeContextId = optionalContextId(input.runtimeContextId, "runtimeContextId");
  return Object.freeze({
    ...(sceneId === undefined ? {} : { sceneId }),
    ...(workspaceId === undefined ? {} : { workspaceId }),
    ...(modeId === undefined ? {} : { modeId }),
    ...(lensId === undefined ? {} : { lensId }),
    ...(activeObjectId === undefined ? {} : { activeObjectId }),
    ...(activePackId === undefined ? {} : { activePackId }),
    ...(runtimeContextId === undefined ? {} : { runtimeContextId }),
  });
}

export function createDirectorRuntimeInteractionRequest(
  input: CreateDirectorRuntimeInteractionRequestInput,
): DirectorRuntimeInteractionRequest {
  if (!isNonEmptyString(input.requestId)) {
    throw new TypeError("requestId must be a non-empty opaque identifier");
  }
  const contractVersion = input.contractVersion ?? DIRECTOR_RUNTIME_INTERACTION_CONTRACT_VERSION;
  if (!isSupportedContractVersion(contractVersion)) {
    throw new TypeError("contractVersion must be a supported interaction contract version");
  }
  const observation = createDirectorInteractionObservation(input.observation);
  const context = createDirectorRuntimeInteractionContext(input.context ?? {});
  return Object.freeze({
    requestId: input.requestId,
    observation,
    context,
    contractVersion,
  });
}

export function rejectDirectorRuntimeInteractionContract(input: {
  readonly reason: DirectorRuntimeInteractionRejectionReason;
  readonly request?: DirectorRuntimeInteractionRequest | null;
}): RejectedDirectorRuntimeInteractionContract {
  if (!isRejectionReason(input.reason)) {
    throw new TypeError("reason must be a known interaction rejection reason");
  }
  return Object.freeze({
    disposition: "rejected" as const,
    reason: input.reason,
    request: input.request ?? null,
    contractIdentity: directorRuntimeInteractionContractsIdentity,
    contractVersion: DIRECTOR_RUNTIME_INTERACTION_CONTRACT_VERSION,
  });
}

export function evaluateDirectorRuntimeInteractionContract(
  input: CreateDirectorRuntimeInteractionRequestInput | DirectorRuntimeInteractionRequest,
): DirectorRuntimeInteractionContractResult {
  if (!isPlainObject(input)) {
    return rejectDirectorRuntimeInteractionContract({ reason: "invalid-request" });
  }

  if (!isNonEmptyString(input.requestId)) {
    return rejectDirectorRuntimeInteractionContract({ reason: "invalid-request" });
  }

  const contractVersion = "contractVersion" in input && input.contractVersion !== undefined
    ? input.contractVersion
    : DIRECTOR_RUNTIME_INTERACTION_CONTRACT_VERSION;
  if (!isSupportedContractVersion(contractVersion)) {
    return rejectDirectorRuntimeInteractionContract({ reason: "unsupported-version" });
  }

  const contextInput = "context" in input ? input.context : undefined;
  const contextReason = validateContextShape(contextInput ?? {});
  if (contextReason !== null) {
    return rejectDirectorRuntimeInteractionContract({ reason: contextReason });
  }

  if (!("observation" in input) || input.observation === undefined) {
    return rejectDirectorRuntimeInteractionContract({ reason: "invalid-observation" });
  }

  const observationReason = validateObservationShape(input.observation);
  if (observationReason !== null) {
    return rejectDirectorRuntimeInteractionContract({ reason: observationReason });
  }

  try {
    const request = createDirectorRuntimeInteractionRequest({
      requestId: input.requestId,
      observation: input.observation as CreateDirectorInteractionObservationInput,
      context: (contextInput ?? {}) as CreateDirectorRuntimeInteractionContextInput,
      contractVersion,
    });
    return Object.freeze({
      disposition: "accepted" as const,
      request,
      contractIdentity: directorRuntimeInteractionContractsIdentity,
      contractVersion: DIRECTOR_RUNTIME_INTERACTION_CONTRACT_VERSION,
    });
  } catch {
    return rejectDirectorRuntimeInteractionContract({ reason: "contract-incompatible" });
  }
}

export function acceptDirectorRuntimeInteractionContract(
  request: DirectorRuntimeInteractionRequest,
): AcceptedDirectorRuntimeInteractionContract {
  const result = evaluateDirectorRuntimeInteractionContract(request);
  if (result.disposition !== "accepted") {
    throw new TypeError(
      `interaction contract cannot be accepted (${result.reason})`,
    );
  }
  return result;
}

export function createDirectorRuntimeInteractionContractEnvelope(
  result: DirectorRuntimeInteractionContractResult,
): DirectorRuntimeInteractionContractEnvelope {
  if (!isAcceptedDirectorRuntimeInteractionContract(result) &&
      !isRejectedDirectorRuntimeInteractionContract(result)) {
    throw new TypeError("result must be an interaction contract result");
  }
  return Object.freeze({
    contractIdentity: directorRuntimeInteractionContractsIdentity,
    contractVersion: DIRECTOR_RUNTIME_INTERACTION_CONTRACT_VERSION,
    request: result.request,
    result,
  });
}

// ─── Guards ─────────────────────────────────────────────────────────────────

export function isDirectorRuntimeInteractionRequest(
  value: unknown,
): value is DirectorRuntimeInteractionRequest {
  if (!isPlainObject(value)) return false;
  if (!isNonEmptyString(value.requestId)) return false;
  if (!isSupportedContractVersion(value.contractVersion)) return false;
  if (validateContextShape(value.context) !== null) return false;
  return validateObservationShape(value.observation) === null;
}

export function isAcceptedDirectorRuntimeInteractionContract(
  value: unknown,
): value is AcceptedDirectorRuntimeInteractionContract {
  if (!isPlainObject(value)) return false;
  return value.disposition === "accepted" &&
    value.contractIdentity === directorRuntimeInteractionContractsIdentity &&
    isSupportedContractVersion(value.contractVersion) &&
    isDirectorRuntimeInteractionRequest(value.request);
}

export function isRejectedDirectorRuntimeInteractionContract(
  value: unknown,
): value is RejectedDirectorRuntimeInteractionContract {
  if (!isPlainObject(value)) return false;
  return value.disposition === "rejected" &&
    isRejectionReason(value.reason) &&
    value.contractIdentity === directorRuntimeInteractionContractsIdentity &&
    isSupportedContractVersion(value.contractVersion) &&
    (value.request === null || isDirectorRuntimeInteractionRequest(value.request));
}

// ─── Registry ───────────────────────────────────────────────────────────────

export const directorRuntimeInteractionContractTypeNames = Object.freeze([
  "DirectorRuntimeInteractionContext",
  "DirectorRuntimeInteractionRequest",
  "AcceptedDirectorRuntimeInteractionContract",
  "RejectedDirectorRuntimeInteractionContract",
  "DirectorRuntimeInteractionContractResult",
  "DirectorRuntimeInteractionContractEnvelope",
] as const);

export const directorRuntimeInteractionContractApiNames = Object.freeze([
  "createDirectorRuntimeInteractionContext",
  "createDirectorRuntimeInteractionRequest",
  "evaluateDirectorRuntimeInteractionContract",
  "acceptDirectorRuntimeInteractionContract",
  "rejectDirectorRuntimeInteractionContract",
  "createDirectorRuntimeInteractionContractEnvelope",
  "isDirectorRuntimeInteractionRequest",
  "isAcceptedDirectorRuntimeInteractionContract",
  "isRejectedDirectorRuntimeInteractionContract",
  "verifyDirectorRuntimeInteractionContracts",
] as const);

export const directorRuntimeInteractionContractsRegistry = Object.freeze({
  dispositions: DIRECTOR_RUNTIME_INTERACTION_CONTRACT_DISPOSITIONS,
  dispositionCount: DIRECTOR_RUNTIME_INTERACTION_CONTRACT_DISPOSITIONS.length,
  rejectionReasons: DIRECTOR_RUNTIME_INTERACTION_REJECTION_REASONS,
  rejectionReasonCount: DIRECTOR_RUNTIME_INTERACTION_REJECTION_REASONS.length,
  supportedContractVersions: DIRECTOR_RUNTIME_INTERACTION_SUPPORTED_CONTRACT_VERSIONS,
  supportedContractVersionCount:
    DIRECTOR_RUNTIME_INTERACTION_SUPPORTED_CONTRACT_VERSIONS.length,
  contractTypes: directorRuntimeInteractionContractTypeNames,
  contractTypeCount: directorRuntimeInteractionContractTypeNames.length,
  publicApis: directorRuntimeInteractionContractApiNames,
  publicApiCount: directorRuntimeInteractionContractApiNames.length,
  immediateDependency: directorRuntimeInteractionContractsUpstream,
});

export const directorRuntimeInteractionContracts = Object.freeze({
  phase: "DRI-4:2" as const,
  name: "DirectorRuntimeInteractionContracts" as const,
  identity: directorRuntimeInteractionContractsIdentity,
  namespace: directorRuntimeInteractionContractsNamespace,
  version: directorRuntimeInteractionContractsVersion,
  layer: "DirectorRuntimeInteractionOrchestration" as const,
  stage: "Contracts" as const,
  status: "ContractsReady" as const,
  immediateDependency: directorRuntimeInteractionContractsUpstream,
  contractVersion: DIRECTOR_RUNTIME_INTERACTION_CONTRACT_VERSION,
  dispositions: DIRECTOR_RUNTIME_INTERACTION_CONTRACT_DISPOSITIONS,
  rejectionReasons: DIRECTOR_RUNTIME_INTERACTION_REJECTION_REASONS,
  philosophy: "interaction-contract-is-not-director-intent" as const,
  publicApiSurface: directorRuntimeInteractionContractApiNames,
  registry: directorRuntimeInteractionContractsRegistry,
});

export function verifyDirectorRuntimeInteractionContracts(): boolean {
  const contracts = directorRuntimeInteractionContracts;
  const registry = directorRuntimeInteractionContractsRegistry;
  return (
    contracts.identity === "DRI-4:2/DirectorRuntimeInteractionContracts" &&
    contracts.version === "4.2.0" &&
    contracts.namespace === "nexora.dri.interaction.orchestration.contracts" &&
    contracts.layer === "DirectorRuntimeInteractionOrchestration" &&
    contracts.stage === "Contracts" &&
    contracts.immediateDependency ===
      "DRI-4:1/DirectorRuntimeInteractionOrchestrationFoundation" &&
    contracts.immediateDependency ===
      directorRuntimeInteractionOrchestrationFoundationIdentity &&
    contracts.contractVersion === "4.2.0" &&
    registry.dispositionCount ===
      DIRECTOR_RUNTIME_INTERACTION_CONTRACT_DISPOSITIONS.length &&
    registry.rejectionReasonCount ===
      DIRECTOR_RUNTIME_INTERACTION_REJECTION_REASONS.length &&
    registry.supportedContractVersionCount ===
      DIRECTOR_RUNTIME_INTERACTION_SUPPORTED_CONTRACT_VERSIONS.length &&
    registry.contractTypeCount === directorRuntimeInteractionContractTypeNames.length &&
    registry.publicApiCount === directorRuntimeInteractionContractApiNames.length &&
    new Set(DIRECTOR_RUNTIME_INTERACTION_CONTRACT_DISPOSITIONS).size ===
      DIRECTOR_RUNTIME_INTERACTION_CONTRACT_DISPOSITIONS.length &&
    new Set(DIRECTOR_RUNTIME_INTERACTION_REJECTION_REASONS).size ===
      DIRECTOR_RUNTIME_INTERACTION_REJECTION_REASONS.length &&
    Object.isFrozen(contracts) &&
    Object.isFrozen(registry)
  );
}
