/**
 * SMM-3 — Deterministic reference resolution.
 */

import type {
  SharedMentalModelIdentityRegistryBundle,
  SharedMentalModelReferenceRecord,
  SharedMentalModelReferenceResolution,
} from "./sharedMentalModelIdentityTypes.ts";

export function resolveSharedMentalModelReference(
  referenceId: string,
  registry: SharedMentalModelIdentityRegistryBundle
): SharedMentalModelReferenceResolution {
  if (!referenceId.trim()) {
    return Object.freeze({
      success: false,
      reason: "Reference ID is required.",
      reference: null,
      readOnly: true as const,
    });
  }
  const reference = registry.referenceRegistry.find((entry) => entry.referenceId === referenceId) ?? null;
  if (!reference) {
    return Object.freeze({
      success: false,
      reason: "Reference not found in registry.",
      reference: null,
      readOnly: true as const,
    });
  }
  return Object.freeze({
    success: true,
    reason: "Reference resolved.",
    reference,
    readOnly: true as const,
  });
}

export function resolveSharedMentalModelVersion(
  modelId: string,
  versionLabel: string,
  registry: SharedMentalModelIdentityRegistryBundle
): SharedMentalModelReferenceResolution {
  const version = registry.versionRegistry.find(
    (entry) => entry.modelId === modelId && entry.versionLabel === versionLabel
  );
  if (!version) {
    return Object.freeze({
      success: false,
      reason: "Version not found in registry.",
      reference: null,
      readOnly: true as const,
    });
  }
  const reference = registry.referenceRegistry.find(
    (entry) => entry.referenceType === "version" && entry.targetId === version.versionId
  ) ?? null;
  if (!reference) {
    return Object.freeze({
      success: false,
      reason: "Version reference not found.",
      reference: null,
      readOnly: true as const,
    });
  }
  return Object.freeze({
    success: true,
    reason: "Version resolved.",
    reference,
    readOnly: true as const,
  });
}

export function lookupReferencesForModel(
  modelId: string,
  registry: SharedMentalModelIdentityRegistryBundle
): readonly SharedMentalModelReferenceRecord[] {
  return Object.freeze(registry.referenceRegistry.filter((entry) => entry.modelId === modelId));
}
