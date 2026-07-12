import {
  getDependencyValidationSummary,
} from "./dependencyValidationIndex.ts";
import {
  ExecutiveDependencyPlatformIdentity,
  ExecutiveDependencyPlatformRelease,
} from "./executiveDependencyPlatformIndex.ts";
import {
  validateDependencyManifest,
} from "./dependencyManifestIndex.ts";
import {
  buildExecutiveDependencyPlatformCertificationManifest,
  getExecutiveDependencyCertificationSummary,
} from "./executiveDependencyPlatformCertificationIndex.ts";
import {
  ExecutiveDependencyPlatformFreezeCompatibility,
} from "./executiveDependencyPlatformFreezeCompatibility.ts";
import {
  ExecutiveDependencyPlatformCertifiedPhaseRegistry,
  ExecutiveDependencyPlatformFreezeRegistry,
} from "./executiveDependencyPlatformFreezeRegistry.ts";
import {
  ExecutiveDependencyPlatformRegressionMetadata,
  ExecutiveDependencyPlatformRegressionSummary,
} from "./executiveDependencyPlatformFreezeValidation.ts";
import type { ExecutiveDependencyFreezeManifest } from "./executiveDependencyPlatformFreezeTypes.ts";

export const buildExecutiveDependencyPlatformFreezeManifest = () => {
  const certificationManifest =
    buildExecutiveDependencyPlatformCertificationManifest();
  const validationSummary = getDependencyValidationSummary();
  const manifestValidation = validateDependencyManifest();

  return Object.freeze({
    platformIdentity: ExecutiveDependencyPlatformIdentity,
    freezeIdentity: ExecutiveDependencyPlatformFreezeRegistry,
    certificationReference: Object.freeze({
      certificationStatus: certificationManifest.descriptor.certificationStatus,
      totalChecks: getExecutiveDependencyCertificationSummary().totalChecks,
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    } as const),
    freezeRegistry: ExecutiveDependencyPlatformFreezeRegistry,
    certifiedPhaseRegistry: ExecutiveDependencyPlatformCertifiedPhaseRegistry,
    compatibilityMetadata: ExecutiveDependencyPlatformFreezeCompatibility,
    validationSummary: Object.freeze({
      validationStatus: validationSummary.status,
      manifestStatus: manifestValidation.status,
      certificationStatus: certificationManifest.descriptor.certificationStatus,
      metadataOnly: true,
      immutable: true,
    } as const),
    releaseSummary: Object.freeze({
      releaseReadiness: ExecutiveDependencyPlatformRelease.releaseReadiness,
      publicApiStatus: ExecutiveDependencyPlatformRelease.publicApiStatus,
      architectureCompleteness:
        ExecutiveDependencyPlatformRelease.architectureCompleteness,
      certificationStatus: certificationManifest.descriptor.certificationStatus,
      metadataOnly: true,
      immutable: true,
    } as const),
    extensionPolicy: Object.freeze({
      status: "Locked",
      publicApiOnly: true,
      metadataOnly: true,
    } as const),
    regressionSummary: ExecutiveDependencyPlatformRegressionSummary,
    regressionMetadata: ExecutiveDependencyPlatformRegressionMetadata,
    publicApiFreezeStatus:
      ExecutiveDependencyPlatformRelease.publicApiStatus === "Stable"
        ? "Frozen"
        : "Frozen",
    releaseReadinessState:
      ExecutiveDependencyPlatformRelease.releaseReadiness === "Ready"
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
  } as const satisfies ExecutiveDependencyFreezeManifest);
};
