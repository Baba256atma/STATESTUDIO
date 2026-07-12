import { getExecutionMonitoringValidationSummary } from "./executionMonitoringValidationIndex.ts";
import { validateExecutionMonitoringManifest } from "./executionMonitoringManifestIndex.ts";
import { ExecutiveExecutionMonitoringPlatformIdentity, ExecutiveExecutionMonitoringPlatformRelease } from "./executiveExecutionMonitoringPlatformIndex.ts";
import { buildExecutiveExecutionMonitoringPlatformCertificationManifest, getExecutiveExecutionMonitoringCertificationSummary } from "./executiveExecutionMonitoringPlatformCertificationIndex.ts";
import { ExecutiveExecutionMonitoringPlatformFreezeCompatibility } from "./executiveExecutionMonitoringPlatformFreezeCompatibility.ts";
import { ExecutiveExecutionMonitoringPlatformCertifiedPhaseRegistry, ExecutiveExecutionMonitoringPlatformFreezeRegistry } from "./executiveExecutionMonitoringPlatformFreezeRegistry.ts";
import { ExecutiveExecutionMonitoringPlatformRegressionMetadata, ExecutiveExecutionMonitoringPlatformRegressionSummary } from "./executiveExecutionMonitoringPlatformFreezeValidation.ts";
import type { ExecutiveExecutionMonitoringFreezeManifest } from "./executiveExecutionMonitoringPlatformFreezeTypes.ts";

export const buildExecutiveExecutionMonitoringPlatformFreezeManifest = () => {
  const certification = buildExecutiveExecutionMonitoringPlatformCertificationManifest();
  return Object.freeze({
    platformIdentity: ExecutiveExecutionMonitoringPlatformIdentity,
    freezeIdentity: ExecutiveExecutionMonitoringPlatformFreezeRegistry,
    certificationReference: Object.freeze({ certificationStatus: certification.descriptor.certificationStatus,
      totalChecks: getExecutiveExecutionMonitoringCertificationSummary().totalChecks,
      metadataOnly: true, immutable: true, deterministic: true }),
    freezeRegistry: ExecutiveExecutionMonitoringPlatformFreezeRegistry,
    certifiedPhaseRegistry: ExecutiveExecutionMonitoringPlatformCertifiedPhaseRegistry,
    compatibilityMetadata: ExecutiveExecutionMonitoringPlatformFreezeCompatibility,
    validationSummary: Object.freeze({ validationStatus: getExecutionMonitoringValidationSummary().status,
      manifestStatus: validateExecutionMonitoringManifest().status,
      certificationStatus: certification.descriptor.certificationStatus,
      metadataOnly: true, immutable: true }),
    releaseSummary: Object.freeze({ releaseReadiness: ExecutiveExecutionMonitoringPlatformRelease.releaseReadiness,
      publicApiStatus: ExecutiveExecutionMonitoringPlatformRelease.publicApiStatus,
      architectureCompleteness: ExecutiveExecutionMonitoringPlatformRelease.architectureCompleteness,
      certificationStatus: certification.descriptor.certificationStatus,
      metadataOnly: true, immutable: true }),
    extensionPolicy: Object.freeze({ status: "Locked", publicApiOnly: true, metadataOnly: true }),
    regressionSummary: ExecutiveExecutionMonitoringPlatformRegressionSummary,
    regressionMetadata: ExecutiveExecutionMonitoringPlatformRegressionMetadata,
    publicApiFreezeStatus: "Frozen", releaseReadinessState: "Ready",
    deterministicSummary: Object.freeze({ deterministic: true, metadataOnly: true, immutable: true }),
    metadataOnlySummary: Object.freeze({ metadataOnly: true, immutable: true, publicApiStable: true }),
    metadataOnly: true, immutable: true, deterministic: true,
  } as const satisfies ExecutiveExecutionMonitoringFreezeManifest);
};
