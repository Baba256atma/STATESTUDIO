import { ExecutiveEngineFoundationValidation } from "./engineFoundationValidation.ts";
import { ExecutiveEngineModelValidation } from "./engineModelValidation.ts";
import { ExecutiveEngineAntiDuplicationValidation, ExecutiveEngineDependencyValidation, ExecutiveEngineOwnershipValidation } from "./engineOwnershipValidation.ts";
import { ExecutiveEngineRegistryValidation } from "./engineRegistryValidation.ts";
import { ExecutiveEngineImmutabilityValidation, ExecutiveEnginePublicApiValidation, getExecutiveEngineValidationSummary } from "./engineValidationRunner.ts";
import type { ExecutiveEngineValidationManifestDescriptor } from "./engineValidationTypes.ts";

const validationDomains = Object.freeze([ExecutiveEngineFoundationValidation, ExecutiveEngineRegistryValidation, ExecutiveEngineModelValidation, ExecutiveEngineOwnershipValidation, ExecutiveEngineDependencyValidation, ExecutiveEngineAntiDuplicationValidation, ExecutiveEngineImmutabilityValidation, ExecutiveEnginePublicApiValidation] as const);
export const ExecutiveEngineValidationManifest = Object.freeze({
  phaseId: "ENG-1:4", version: "1.0.0", validationDomains,
  validationCounts: Object.freeze({ domainCount: validationDomains.length,
    totalChecks: getExecutiveEngineValidationSummary().totalChecks,
    passedChecks: getExecutiveEngineValidationSummary().passedChecks,
    failedChecks: getExecutiveEngineValidationSummary().failedChecks }),
  dependencyCompliance: ExecutiveEngineDependencyValidation.status,
  ownershipCompliance: ExecutiveEngineOwnershipValidation.status,
  antiDuplicationCompliance: ExecutiveEngineAntiDuplicationValidation.status,
  immutabilityCompliance: ExecutiveEngineImmutabilityValidation.status,
  publicApiCompliance: ExecutiveEnginePublicApiValidation.status,
  releaseReadinessMetadata: Object.freeze({ status: getExecutiveEngineValidationSummary().releaseReadiness,
    validationStatus: getExecutiveEngineValidationSummary().status,
    nextPhase: "ENG-1:5 — Executive Engine Manifest" }),
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveEngineValidationManifestDescriptor);

export const getExecutiveEngineValidationManifest = () => ExecutiveEngineValidationManifest;
