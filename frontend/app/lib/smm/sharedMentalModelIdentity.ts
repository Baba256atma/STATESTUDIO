/**
 * SMM-3 — Shared Mental Model identity builders.
 */

import { SMM_IDENTITY_CONTRACT_VERSION } from "./sharedMentalModelIdentityContracts.ts";
import type {
  SharedMentalModelIdentityInput,
  SharedMentalModelIdentityRecord,
} from "./sharedMentalModelIdentityTypes.ts";

export function buildSharedMentalModelIdentityRecord(
  input: SharedMentalModelIdentityInput,
  timestamp: string
): SharedMentalModelIdentityRecord {
  return Object.freeze({
    modelId: input.modelId,
    modelVersion: input.modelVersion,
    parentReferenceId: input.parentReferenceId ?? null,
    originMetadata: Object.freeze({ ...(input.originMetadata ?? {}), contractVersion: SMM_IDENTITY_CONTRACT_VERSION }),
    workspaceReferenceId: input.workspaceReferenceId,
    organizationReferenceId: input.organizationReferenceId,
    executiveReferenceId: input.executiveReferenceId ?? null,
    snapshotReferenceId: input.snapshotReferenceId,
    createdAt: timestamp,
    extensionMetadata: Object.freeze(input.extensionMetadata ?? {}),
    readOnly: true as const,
  });
}

export function isSharedMentalModelIdentityImmutable(record: SharedMentalModelIdentityRecord): boolean {
  return Object.isFrozen(record);
}

export function createStableModelId(prefix: string, seed: string): string {
  return `smm-model-${prefix}-${seed}`;
}

export function createStableReferenceId(referenceType: string, seed: string): string {
  return `smm-ref-${referenceType}-${seed}`;
}

export function createStableSnapshotId(modelId: string, version: string): string {
  return `smm-snapshot-${modelId}-${version}`;
}

export function createStableVersionId(modelId: string, versionLabel: string): string {
  return `smm-version-${modelId}-${versionLabel}`;
}
