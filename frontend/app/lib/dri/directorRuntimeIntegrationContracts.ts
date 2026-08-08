/**
 * DRI-1:2 — Director Runtime Integration Contracts
 *
 * Immutable communication contracts for data crossing from authoritative
 * Runtime state through DRI toward abstract NOL/Director representation.
 */

import {
  createDirectorRuntimeIntegrationBindingDescriptor as createFoundationBindingDescriptor,
  createDirectorRuntimeIntegrationSourceReference as createFoundationSourceReference,
  createDirectorRuntimeIntegrationTargetReference as createFoundationTargetReference,
  directorRuntimeIntegrationAuthority,
  directorRuntimeIntegrationDirection,
  directorRuntimeIntegrationFoundationIdentity,
  isDirectorRuntimeIntegrationSourceKind,
  isDirectorRuntimeIntegrationState,
  isDirectorRuntimeIntegrationTargetKind,
  type DirectorRuntimeIntegrationSourceReference,
  type DirectorRuntimeIntegrationState,
  type DirectorRuntimeIntegrationTargetReference,
} from "./directorRuntimeIntegrationFoundation.ts";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeIntegrationContractsIdentity =
  "DRI-1:2/DirectorRuntimeIntegrationContracts" as const;
export const directorRuntimeIntegrationContractsVersion = "1.2.0" as const;
export const directorRuntimeIntegrationContractsNamespace =
  "nexora.dri.runtime.integration.contracts" as const;
export const directorRuntimeIntegrationContractsUpstream =
  directorRuntimeIntegrationFoundationIdentity;

export const directorRuntimeIntegrationContractsMetadata = Object.freeze({
  identity: directorRuntimeIntegrationContractsIdentity,
  version: directorRuntimeIntegrationContractsVersion,
  namespace: directorRuntimeIntegrationContractsNamespace,
  layer: "DRI" as const,
  phase: "DRI-1" as const,
  stage: "Contracts" as const,
  status: "ContractsReady" as const,
  upstream: directorRuntimeIntegrationContractsUpstream,
  direction: directorRuntimeIntegrationDirection,
  authority: directorRuntimeIntegrationAuthority,
});

// ─── Public contracts ──────────────────────────────────────────────────────

export type DirectorRuntimeIntegrationValue =
  | null
  | boolean
  | number
  | string
  | readonly DirectorRuntimeIntegrationValue[]
  | { readonly [key: string]: DirectorRuntimeIntegrationValue };

export type DirectorRuntimeIntegrationPayload = Readonly<
  Record<string, DirectorRuntimeIntegrationValue>
>;

export type DirectorRuntimeSourceContract =
  DirectorRuntimeIntegrationSourceReference;

export interface DirectorRuntimeSnapshotContract {
  readonly source: DirectorRuntimeSourceContract;
  readonly revision: string | number;
  readonly payload: DirectorRuntimeIntegrationPayload;
}

export type DirectorRuntimeTargetContract =
  DirectorRuntimeIntegrationTargetReference;

export interface DirectorRuntimeIntegrationMappingContract {
  readonly mappingId: string;
  readonly source: DirectorRuntimeSourceContract;
  readonly target: DirectorRuntimeTargetContract;
}

export interface DirectorRuntimeIntegrationBindingContract {
  readonly bindingId: string;
  readonly mapping: DirectorRuntimeIntegrationMappingContract;
  readonly state: DirectorRuntimeIntegrationState;
  readonly direction: typeof directorRuntimeIntegrationDirection;
}

export interface DirectorRuntimeIntegrationBatchContract {
  readonly batchId: string;
  readonly runtimeRevision: string | number;
  readonly bindings: readonly DirectorRuntimeIntegrationBindingContract[];
}

export const DIRECTOR_RUNTIME_INTEGRATION_RESULT_STATUSES = Object.freeze([
  "accepted",
  "rejected",
  "blocked",
] as const);

export type DirectorRuntimeIntegrationResultStatus =
  (typeof DIRECTOR_RUNTIME_INTEGRATION_RESULT_STATUSES)[number];

export interface DirectorRuntimeIntegrationResultContract {
  readonly bindingId: string;
  readonly status: DirectorRuntimeIntegrationResultStatus;
}

export interface DirectorRuntimeIntegrationErrorContract {
  readonly code: string;
  readonly message: string;
  readonly sourceId?: string;
  readonly targetId?: string;
  readonly bindingId?: string;
}

type PlainObject = Record<string, unknown>;

function isPlainObject(value: unknown): value is PlainObject {
  if (value === null || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function isOpaqueRevision(value: unknown): value is string | number {
  return (
    (typeof value === "string" && value.length > 0) ||
    (typeof value === "number" && Number.isFinite(value))
  );
}

function hasOpaqueId(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function cloneIntegrationValue(
  value: DirectorRuntimeIntegrationValue,
): DirectorRuntimeIntegrationValue {
  if (Array.isArray(value)) {
    return Object.freeze(value.map((item) => cloneIntegrationValue(item)));
  }
  if (value !== null && typeof value === "object") {
    return Object.freeze(
      Object.fromEntries(
        Object.entries(value).map(([key, item]) => [
          key,
          cloneIntegrationValue(item),
        ]),
      ),
    );
  }
  return value;
}

function requirePayload(value: unknown): asserts value is DirectorRuntimeIntegrationPayload {
  if (!isPlainObject(value) || !isDirectorRuntimeIntegrationValue(value)) {
    throw new TypeError("payload must contain only deterministic plain values");
  }
}

// ─── Lightweight guards ────────────────────────────────────────────────────

export function isDirectorRuntimeIntegrationValue(
  value: unknown,
): value is DirectorRuntimeIntegrationValue {
  if (
    value === null ||
    typeof value === "boolean" ||
    typeof value === "string"
  ) return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (Array.isArray(value)) {
    return value.every((item) => isDirectorRuntimeIntegrationValue(item));
  }
  return (
    isPlainObject(value) &&
    Object.values(value).every((item) =>
      isDirectorRuntimeIntegrationValue(item),
    )
  );
}

export function isDirectorRuntimeSourceContract(
  value: unknown,
): value is DirectorRuntimeSourceContract {
  return (
    isPlainObject(value) &&
    isDirectorRuntimeIntegrationSourceKind(value.sourceKind) &&
    hasOpaqueId(value.sourceId) &&
    isOpaqueRevision(value.runtimeRevision)
  );
}

export function isDirectorRuntimeTargetContract(
  value: unknown,
): value is DirectorRuntimeTargetContract {
  return (
    isPlainObject(value) &&
    isDirectorRuntimeIntegrationTargetKind(value.targetKind) &&
    hasOpaqueId(value.targetId)
  );
}

export function isDirectorRuntimeIntegrationMappingContract(
  value: unknown,
): value is DirectorRuntimeIntegrationMappingContract {
  return (
    isPlainObject(value) &&
    hasOpaqueId(value.mappingId) &&
    isDirectorRuntimeSourceContract(value.source) &&
    isDirectorRuntimeTargetContract(value.target)
  );
}

export function isDirectorRuntimeIntegrationBindingContract(
  value: unknown,
): value is DirectorRuntimeIntegrationBindingContract {
  return (
    isPlainObject(value) &&
    hasOpaqueId(value.bindingId) &&
    isDirectorRuntimeIntegrationMappingContract(value.mapping) &&
    isDirectorRuntimeIntegrationState(value.state) &&
    value.direction === directorRuntimeIntegrationDirection
  );
}

export function isDirectorRuntimeIntegrationBatchContract(
  value: unknown,
): value is DirectorRuntimeIntegrationBatchContract {
  return (
    isPlainObject(value) &&
    hasOpaqueId(value.batchId) &&
    isOpaqueRevision(value.runtimeRevision) &&
    Array.isArray(value.bindings) &&
    value.bindings.every((binding) =>
      isDirectorRuntimeIntegrationBindingContract(binding),
    )
  );
}

export function isDirectorRuntimeIntegrationResultStatus(
  value: unknown,
): value is DirectorRuntimeIntegrationResultStatus {
  return (DIRECTOR_RUNTIME_INTEGRATION_RESULT_STATUSES as readonly unknown[])
    .includes(value);
}

export function isDirectorRuntimeIntegrationErrorContract(
  value: unknown,
): value is DirectorRuntimeIntegrationErrorContract {
  return (
    isPlainObject(value) &&
    hasOpaqueId(value.code) &&
    typeof value.message === "string" &&
    (value.sourceId === undefined || typeof value.sourceId === "string") &&
    (value.targetId === undefined || typeof value.targetId === "string") &&
    (value.bindingId === undefined || typeof value.bindingId === "string")
  );
}

// ─── Deterministic creators ────────────────────────────────────────────────

export function createDirectorRuntimeSourceContract(
  input: DirectorRuntimeSourceContract,
): DirectorRuntimeSourceContract {
  return createFoundationSourceReference(input);
}

export function createDirectorRuntimeSnapshotContract(
  input: DirectorRuntimeSnapshotContract,
): DirectorRuntimeSnapshotContract {
  if (!isOpaqueRevision(input.revision)) {
    throw new TypeError("revision must be a non-empty opaque revision");
  }
  requirePayload(input.payload);
  return Object.freeze({
    source: createDirectorRuntimeSourceContract(input.source),
    revision: input.revision,
    payload: cloneIntegrationValue(input.payload) as DirectorRuntimeIntegrationPayload,
  });
}

export function createDirectorRuntimeTargetContract(
  input: DirectorRuntimeTargetContract,
): DirectorRuntimeTargetContract {
  return createFoundationTargetReference(input);
}

export function createDirectorRuntimeIntegrationMappingContract(
  input: DirectorRuntimeIntegrationMappingContract,
): DirectorRuntimeIntegrationMappingContract {
  if (!hasOpaqueId(input.mappingId)) {
    throw new TypeError("mappingId must be a non-empty opaque identifier");
  }
  return Object.freeze({
    mappingId: input.mappingId,
    source: createDirectorRuntimeSourceContract(input.source),
    target: createDirectorRuntimeTargetContract(input.target),
  });
}

export function createDirectorRuntimeIntegrationBindingContract(
  input: DirectorRuntimeIntegrationBindingContract,
): DirectorRuntimeIntegrationBindingContract {
  if (input.direction !== directorRuntimeIntegrationDirection) {
    throw new TypeError("integration direction must be runtime-to-director");
  }
  const mapping = createDirectorRuntimeIntegrationMappingContract(input.mapping);
  const descriptor = createFoundationBindingDescriptor({
    bindingId: input.bindingId,
    source: mapping.source,
    target: mapping.target,
    state: input.state,
  });
  return Object.freeze({
    bindingId: descriptor.bindingId,
    mapping: Object.freeze({
      mappingId: mapping.mappingId,
      source: descriptor.source,
      target: descriptor.target,
    }),
    state: descriptor.state,
    direction: directorRuntimeIntegrationDirection,
  });
}

export function createDirectorRuntimeIntegrationBatchContract(
  input: DirectorRuntimeIntegrationBatchContract,
): DirectorRuntimeIntegrationBatchContract {
  if (!hasOpaqueId(input.batchId)) {
    throw new TypeError("batchId must be a non-empty opaque identifier");
  }
  if (!isOpaqueRevision(input.runtimeRevision)) {
    throw new TypeError("runtimeRevision must be a non-empty opaque revision");
  }
  return Object.freeze({
    batchId: input.batchId,
    runtimeRevision: input.runtimeRevision,
    bindings: Object.freeze(
      input.bindings.map((binding) =>
        createDirectorRuntimeIntegrationBindingContract(binding),
      ),
    ),
  });
}

export function createDirectorRuntimeIntegrationResultContract(
  input: DirectorRuntimeIntegrationResultContract,
): DirectorRuntimeIntegrationResultContract {
  if (!hasOpaqueId(input.bindingId)) {
    throw new TypeError("bindingId must be a non-empty opaque identifier");
  }
  if (!isDirectorRuntimeIntegrationResultStatus(input.status)) {
    throw new TypeError("status must be a known integration result status");
  }
  return Object.freeze({ bindingId: input.bindingId, status: input.status });
}

export function createDirectorRuntimeIntegrationErrorContract(
  input: DirectorRuntimeIntegrationErrorContract,
): DirectorRuntimeIntegrationErrorContract {
  if (!isDirectorRuntimeIntegrationErrorContract(input)) {
    throw new TypeError("integration error must be deterministic plain data");
  }
  return Object.freeze({
    code: input.code,
    message: input.message,
    ...(input.sourceId !== undefined ? { sourceId: input.sourceId } : {}),
    ...(input.targetId !== undefined ? { targetId: input.targetId } : {}),
    ...(input.bindingId !== undefined ? { bindingId: input.bindingId } : {}),
  });
}

// ─── Contract registry ─────────────────────────────────────────────────────

export interface DirectorRuntimeIntegrationContractRegistryEntry {
  readonly order: number;
  readonly family: string;
}

export const directorRuntimeIntegrationContractRegistry = Object.freeze([
  Object.freeze({ order: 1, family: "Runtime Source" }),
  Object.freeze({ order: 2, family: "Runtime Snapshot" }),
  Object.freeze({ order: 3, family: "Integration Payload" }),
  Object.freeze({ order: 4, family: "Director Target" }),
  Object.freeze({ order: 5, family: "Integration Mapping" }),
  Object.freeze({ order: 6, family: "Integration Binding" }),
  Object.freeze({ order: 7, family: "Integration Batch" }),
  Object.freeze({ order: 8, family: "Integration Result" }),
  Object.freeze({ order: 9, family: "Integration Error" }),
  Object.freeze({ order: 10, family: "Authority" }),
] as const satisfies readonly DirectorRuntimeIntegrationContractRegistryEntry[]);

export const directorRuntimeIntegrationContractRegistryCount =
  directorRuntimeIntegrationContractRegistry.length;

export function getDirectorRuntimeIntegrationContractRegistry():
  readonly DirectorRuntimeIntegrationContractRegistryEntry[] {
  return directorRuntimeIntegrationContractRegistry;
}

export function verifyDirectorRuntimeIntegrationContracts(): boolean {
  return (
    directorRuntimeIntegrationContractsMetadata.identity ===
      "DRI-1:2/DirectorRuntimeIntegrationContracts" &&
    directorRuntimeIntegrationContractsMetadata.upstream ===
      directorRuntimeIntegrationFoundationIdentity &&
    directorRuntimeIntegrationContractsMetadata.direction ===
      "runtime-to-director" &&
    directorRuntimeIntegrationContractsMetadata.authority ===
      directorRuntimeIntegrationAuthority &&
    directorRuntimeIntegrationContractRegistryCount ===
      directorRuntimeIntegrationContractRegistry.length
  );
}
