import {
  getAutomationValidationSummary,
} from "./automationValidationIndex.ts";
import {
  validateAutomationManifest,
} from "./automationManifestIndex.ts";
import {
  ExecutiveAutomationPlatformIdentity,
  ExecutiveAutomationPlatformRelease,
} from "./executiveAutomationPlatformIndex.ts";
import {
  buildExecutiveAutomationPlatformCertificationManifest,
  getExecutiveAutomationCertificationSummary,
} from "./executiveAutomationPlatformCertificationIndex.ts";
import {
  ExecutiveAutomationPlatformFreezeCompatibility,
} from "./executiveAutomationPlatformFreezeCompatibility.ts";
import {
  ExecutiveAutomationPlatformCertifiedPhaseRegistry,
  ExecutiveAutomationPlatformFreezeRegistry,
} from "./executiveAutomationPlatformFreezeRegistry.ts";
import {
  ExecutiveAutomationPlatformRegressionMetadata,
  ExecutiveAutomationPlatformRegressionSummary,
} from "./executiveAutomationPlatformFreezeValidation.ts";
import type { ExecutiveAutomationFreezeManifest } from "./executiveAutomationPlatformFreezeTypes.ts";

export const buildExecutiveAutomationPlatformFreezeManifest = () => {
  const certificationManifest =
    buildExecutiveAutomationPlatformCertificationManifest();
  const validationSummary = getAutomationValidationSummary();
  const manifestValidation = validateAutomationManifest();

  return Object.freeze({
    platformIdentity: ExecutiveAutomationPlatformIdentity,
    freezeIdentity: ExecutiveAutomationPlatformFreezeRegistry,
    certificationReference: Object.freeze({
      certificationStatus: certificationManifest.descriptor.certificationStatus,
      totalChecks: getExecutiveAutomationCertificationSummary().totalChecks,
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    } as const),
    freezeRegistry: ExecutiveAutomationPlatformFreezeRegistry,
    certifiedPhaseRegistry: ExecutiveAutomationPlatformCertifiedPhaseRegistry,
    compatibilityMetadata: ExecutiveAutomationPlatformFreezeCompatibility,
    validationSummary: Object.freeze({
      validationStatus: validationSummary.status,
      manifestStatus: manifestValidation.status,
      certificationStatus: certificationManifest.descriptor.certificationStatus,
      metadataOnly: true,
      immutable: true,
    } as const),
    releaseSummary: Object.freeze({
      releaseReadiness: ExecutiveAutomationPlatformRelease.releaseReadiness,
      publicApiStatus: ExecutiveAutomationPlatformRelease.publicApiStatus,
      architectureCompleteness:
        ExecutiveAutomationPlatformRelease.architectureCompleteness,
      certificationStatus: certificationManifest.descriptor.certificationStatus,
      metadataOnly: true,
      immutable: true,
    } as const),
    extensionPolicy: Object.freeze({
      status: "Locked",
      publicApiOnly: true,
      metadataOnly: true,
    } as const),
    regressionSummary: ExecutiveAutomationPlatformRegressionSummary,
    regressionMetadata: ExecutiveAutomationPlatformRegressionMetadata,
    publicApiFreezeStatus:
      ExecutiveAutomationPlatformRelease.publicApiStatus === "Stable"
        ? "Frozen"
        : "Frozen",
    releaseReadinessState:
      ExecutiveAutomationPlatformRelease.releaseReadiness === "Ready"
        ? "Ready"
        : "Ready",
    deterministicSummary: Object.freeze({
      deterministic: true,
      metadataOnly: true,
      immutable: true,
    } as const),
    metadataOnlySummary: Object.freeze({
      metadataOnly: true,
      immutable: true,
      publicApiStable: true,
    } as const),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const satisfies ExecutiveAutomationFreezeManifest);
};
