import { DirectorPlatform } from "./directorPlatform.ts";
import { DirectorCertificationCompatibility } from "./directorCertificationCompatibility.ts";
import { DirectorCertificationCriteria } from "./directorCertificationCriteria.ts";
import { DirectorCertificationGates } from "./directorCertificationGates.ts";

export const DirectorCertificationMetadata = Object.freeze({
  certificationId: "DIRECTOR-1:7/DirectorCertification",
  certificationName: "Director Certification",
  certificationVersion: "1.0.0",
  certificationNamespace: "nexora.director.certification",
  layer: "Director",
  certificationStatus: "Certified",
  readiness: "ReadyForFreeze",
  criteriaCount: DirectorCertificationCriteria.length,
  gateCount: DirectorCertificationGates.length,
  compatibilityCount: DirectorCertificationCompatibility.length,
  compatibilitySummary: DirectorCertificationCompatibility,
  readinessSummary: DirectorPlatform.metadata.readiness,
  certifiedInventory: DirectorPlatform.metadata.inventoryTotals,
  architectureChain: DirectorPlatform.metadata.architectureChain,
  dependency: Object.freeze({
    platformOnly: true,
    platformReference: DirectorPlatform.metadata.identity.platformId,
    directPreviousPhaseModule: "directorPlatform.ts",
    directFoundationImport: false,
    directRegistryImport: false,
    directModelImport: false,
    directValidationImport: false,
    directManifestImport: false,
    importsFutureDirectorPhases: false,
    importsEve: false,
  }),
  canonicalInventoryRuleCompliant: DirectorPlatform.composition.aggregateInventory.derivedFromManifest,
  countsDerivedFromCanonicalCollections: true,
  certificationEngine: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

