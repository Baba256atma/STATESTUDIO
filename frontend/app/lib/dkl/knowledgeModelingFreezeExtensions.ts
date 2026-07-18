/**
 * DKL-4:8 — Knowledge Modeling Freeze Extensions.
 *
 * Controlled extension locks for future additive changes.
 * Mutable registration and breaking changes are forbidden.
 *
 * Ownership: owned exclusively by DKL-4:8.
 */

import type { FreezeExtensionLockEntry } from "./knowledgeModelingFreezeTypes.ts";

const OWNER = "DKL-4 Knowledge Modeling Freeze";

const ext = (
  extensionLockId: string,
  name: string,
  protectedSurface: string,
  ownedBy: string,
): FreezeExtensionLockEntry =>
  Object.freeze({
    extensionLockId,
    name,
    protectedSurface,
    ownedBy,
    allowedChange: "Additive" as const,
    requiresVersioning: true as const,
    requiresBackwardCompatibility: true as const,
    requiresRevalidation: true as const,
    requiresRecertification: true as const,
    requiresRefreeze: true as const,
    mutableRegistrationForbidden: true as const,
    silentReplacementForbidden: true as const,
    idReuseForbidden: true as const,
    nameReuseForbidden: true as const,
    removalForbidden: true as const,
    reorderForbidden: true as const,
  });

const ENTRIES: readonly FreezeExtensionLockEntry[] = Object.freeze([
  ext(
    "EXT-LOCK-MODEL-DESCRIPTORS",
    "Knowledge Model descriptors",
    "Canonical model descriptor catalog",
    "DKL-4:3",
  ),
  ext(
    "EXT-LOCK-BO-CATEGORIES",
    "Business Object categories",
    "Business Object category registry",
    "DKL-4:2",
  ),
  ext(
    "EXT-LOCK-REL-CATEGORIES",
    "Relationship categories",
    "Relationship category registry",
    "DKL-4:2",
  ),
  ext(
    "EXT-LOCK-SEMANTIC",
    "Semantic structure descriptors",
    "Semantic structure model descriptors",
    "DKL-4:3",
  ),
  ext(
    "EXT-LOCK-VALIDATION",
    "Validation rules",
    "Validation rule catalog",
    "DKL-4:4",
  ),
  ext(
    "EXT-LOCK-COMPAT",
    "Compatibility declarations",
    "Compatibility declaration catalog",
    "DKL-4:1",
  ),
  ext(
    "EXT-LOCK-MANIFEST",
    "Manifest inventories",
    "Manifest inventory categories",
    "DKL-4:5",
  ),
  ext(
    "EXT-LOCK-PUBLIC-API",
    "Public API metadata",
    "Public API surface metadata",
    "DKL-4:6",
  ),
]);

const FORBIDDEN = Object.freeze([
  "Mutable runtime registration",
  "Silent replacement",
  "Reusing existing IDs",
  "Reusing existing names with different meaning",
  "Removing frozen entries",
  "Reordering frozen canonical catalogs",
  "Weakening ownership boundaries",
  "Adding runtime behavior",
  "Bypassing validation or certification",
  "Direct internal imports from consumers",
]);

/** Canonical immutable Freeze extension locks. */
export const KnowledgeModelingFreezeExtensions = Object.freeze({
  extensionId: "DKL-4:8/FreezeExtensions",
  sourcePhase: "DKL-4:8" as const,
  owner: OWNER,
  entries: ENTRIES,
  entryCount: ENTRIES.length,
  forbidden: FORBIDDEN,
  additiveOnly: true,
  breakingChangeForbidden: true,
  mutableRegistrationForbidden: true,
  requiresRevalidationRecertificationRefreeze: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
