/**
 * DKL-5:8 — Knowledge Validation Freeze Extensions.
 *
 * Controlled extension locks for future additive changes.
 * Mutable registration and breaking changes are forbidden.
 *
 * Ownership: owned exclusively by DKL-5:8.
 */

import type { FreezeExtensionLockEntry } from "./knowledgeValidationFreezeTypes.ts";

const ext = (
  extensionLockId: string,
  subject: string,
  protectedSurface: string,
  ownedBy: string,
): FreezeExtensionLockEntry =>
  Object.freeze({
    extensionLockId,
    subject,
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
    weakeningEvidenceForbidden: true as const,
    weakeningPartialUsabilityForbidden: true as const,
    weakeningOwnershipForbidden: true as const,
    numericScoringForbidden: true as const,
    trustCalculationForbidden: true as const,
    cleansingRemediationForbidden: true as const,
    runtimeValidationForbidden: true as const,
    aiInferenceForbidden: true as const,
  });

const ENTRIES: readonly FreezeExtensionLockEntry[] = Object.freeze([
  ext("EXT-LOCK-TARGETS", "Validation targets", "Validation target catalog", "DKL-5:1"),
  ext("EXT-LOCK-DIMENSIONS", "Validation dimensions", "Validation dimension catalog", "DKL-5:1"),
  ext("EXT-LOCK-SIGNALS", "Quality signals", "Quality-signal catalog", "DKL-5:1"),
  ext("EXT-LOCK-STATUSES", "Validation statuses and outcomes", "Status and outcome catalogs", "DKL-5:1"),
  ext("EXT-LOCK-SEVERITIES", "Severity levels", "Severity catalog", "DKL-5:1"),
  ext("EXT-LOCK-EVIDENCE", "Evidence types", "Evidence type registry", "DKL-5:2"),
  ext("EXT-LOCK-FINDINGS", "Finding categories", "Finding category registry", "DKL-5:2"),
  ext("EXT-LOCK-ISSUES", "Issue categories", "Issue category registry", "DKL-5:2"),
  ext("EXT-LOCK-CONFLICTS", "Conflict types", "Conflict type registry", "DKL-5:2"),
  ext("EXT-LOCK-AMBIGUITY", "Ambiguity types", "Ambiguity type registry", "DKL-5:2"),
  ext("EXT-LOCK-LIMITATIONS", "Limitation types", "Limitation type registry", "DKL-5:2"),
  ext("EXT-LOCK-TRUST", "Trust levels", "Trust-level registry", "DKL-5:2"),
  ext("EXT-LOCK-MODELS", "Model descriptors", "Canonical model descriptor catalog", "DKL-5:3"),
  ext("EXT-LOCK-RULES", "Validation rules", "Validation rule catalog", "DKL-5:4"),
  ext("EXT-LOCK-CONSUMER", "Consumer-readiness states", "Consumer suitability catalog", "DKL-5:3"),
  ext("EXT-LOCK-EXECUTIVE", "Executive-usability capabilities", "Executive usability catalog", "DKL-5:3"),
  ext("EXT-LOCK-COMPAT", "Compatibility declarations", "Compatibility declaration catalog", "DKL-5:1"),
  ext("EXT-LOCK-MANIFEST", "Manifest inventory categories", "Manifest inventory categories", "DKL-5:5"),
  ext("EXT-LOCK-PUBLIC-API", "Public API metadata", "Public API surface metadata", "DKL-5:6"),
]);

/** Canonical immutable Freeze extension locks. */
export const KnowledgeValidationFreezeExtensions = Object.freeze({
  extensionId: "DKL-5:8/FreezeExtensions",
  sourcePhase: "DKL-5:8" as const,
  owner: "DKL-5 Knowledge Validation Freeze",
  entries: ENTRIES,
  entryCount: ENTRIES.length,
  subjects: Object.freeze(ENTRIES.map((entry) => entry.subject)),
  policy: Object.freeze({
    additiveOnly: true,
    explicitlyVersioned: true,
    backwardCompatible: true,
    ownedByOriginatingPhase: true,
    registeredThroughCorrectRegistry: true,
    revalidatedBeforeRelease: true,
    recertifiedBeforeRelease: true,
    refrozenBeforePublicIndexRelease: true,
    mutableRuntimeRegistrationForbidden: true,
    silentReplacementForbidden: true,
    idReuseForbidden: true,
    nameReuseWithChangedMeaningForbidden: true,
    removalOfFrozenEntriesForbidden: true,
    reorderingCanonicalCatalogsForbidden: true,
    weakeningEvidenceRequirementsForbidden: true,
    weakeningPartialUsabilityForbidden: true,
    weakeningOwnershipBoundariesForbidden: true,
    numericScoringForbidden: true,
    automaticTrustCalculationForbidden: true,
    cleansingOrRemediationForbidden: true,
    runtimeOrganizationalValidationForbidden: true,
    aiOrSemanticInferenceForbidden: true,
    bypassingValidationOrCertificationForbidden: true,
    directInternalImportsByConsumersForbidden: true,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
