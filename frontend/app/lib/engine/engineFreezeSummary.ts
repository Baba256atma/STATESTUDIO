import { ExecutiveEnginePhaseRegistry, ExecutiveEngineReleaseReadiness } from "./engineManifestIndex.ts";
import { ExecutiveEngineValidationManifest, getExecutiveEngineValidationSummary } from "./engineValidationIndex.ts";
import { ExecutiveEngineCertificationSummary } from "./engineCertificationIndex.ts";
import { ExecutiveEngineCompatibilityMatrix } from "./engineCompatibilityMatrix.ts";
import { ExecutiveEngineExtensionPolicy } from "./engineExtensionPolicy.ts";
import { ExecutiveEngineFreezeRegistry } from "./engineFreezeRegistry.ts";
import type { ExecutiveEngineFreezeSummaryDescriptor } from "./engineFreezeTypes.ts";

export const ExecutiveEngineRegressionSummary = Object.freeze({
  artifactId: "ENG-REGRESSION-001",
  completedPhases: ExecutiveEnginePhaseRegistry.length,
  certificationStatus: ExecutiveEngineCertificationSummary.certificationStatus,
  validationStatus: getExecutiveEngineValidationSummary().status,
  ownershipCompliance: ExecutiveEngineValidationManifest.ownershipCompliance,
  dependencyCompliance: ExecutiveEngineValidationManifest.dependencyCompliance,
  antiDuplicationCompliance: ExecutiveEngineValidationManifest.antiDuplicationCompliance,
  publicApiStability: ExecutiveEngineReleaseReadiness.publicApiStable ? "Stable" : "Unstable",
  metadataOnlyCompliance: true, executionMode: "DescriptiveOnly",
  metadataOnly: true, immutable: true, deterministic: true,
} as const);

export const ExecutiveEngineFreezeSummary = Object.freeze({
  artifactId: "ENG-FREEZE-SUMMARY-001",
  freezeStatus: ExecutiveEngineFreezeRegistry.freezeStatus,
  readiness: ExecutiveEngineFreezeRegistry.freezeStatus === "Frozen" ? "ReadyForPublicIndex" : "Blocked",
  frozenPhaseCount: ExecutiveEngineFreezeRegistry.frozenPhases.length,
  frozenPublicApiCount: ExecutiveEngineFreezeRegistry.frozenPublicApis.length,
  frozenSectionCount: ExecutiveEngineFreezeRegistry.frozenArchitecturalSections.length,
  compatibilityCount: ExecutiveEngineCompatibilityMatrix.length,
  extensionPointCount: ExecutiveEngineExtensionPolicy.futureExtensionPoints.length,
  certificationStatus: ExecutiveEngineCertificationSummary.certificationStatus,
  validationStatus: getExecutiveEngineValidationSummary().status,
  nextPhase: "ENG-1:9 — Executive Engine Public Index",
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveEngineFreezeSummaryDescriptor);

export const getExecutiveEngineFreezeSummary = () => ExecutiveEngineFreezeSummary;
