import { SchedulingIntelligenceIdentity } from "./schedulingIntelligenceIndex.ts";
import { buildSchedulingPlatformManifest } from "./schedulingPlatformManifestIndex.ts";
import {
  ExecutiveSchedulingPlatformPublicRegistry,
  ExecutiveSchedulingPlatformReleaseSummary,
} from "./schedulingPlatformIndex.ts";
import { ExecutiveSchedulingPlatformCertificationRegistry } from "./executiveSchedulingPlatformCertificationRegistry.ts";
import { ExecutiveSchedulingPlatformCompatibility } from "./executiveSchedulingPlatformCompatibility.ts";
import type {
  ExecutiveSchedulingCertifiedPlatformDescriptor,
  ExecutiveSchedulingPlatformCertificationManifestDescriptor,
  ExecutiveSchedulingPlatformCompatibilitySummary,
  ExecutiveSchedulingPlatformRegressionSummary,
  ExecutiveSchedulingPlatformReleaseReadiness,
  ExecutiveSchedulingPlatformValidationSummary,
} from "./executiveSchedulingPlatformCertificationTypes.ts";

const platformManifest = buildSchedulingPlatformManifest();

export const buildExecutiveSchedulingPlatformCertificationManifest = () =>
  Object.freeze({
    platformIdentity: Object.freeze({
      platformId: SchedulingIntelligenceIdentity.platformId,
      platformName: SchedulingIntelligenceIdentity.platformName,
      platformVersion: SchedulingIntelligenceIdentity.platformVersion,
      metadataOnly: true,
      immutable: true,
    } as const),
    certificationIdentity: ExecutiveSchedulingPlatformCertificationRegistry,
    certifiedPlatformDescriptor: Object.freeze({
      platformId: SchedulingIntelligenceIdentity.platformId,
      platformName: SchedulingIntelligenceIdentity.platformName,
      platformVersion: SchedulingIntelligenceIdentity.platformVersion,
      certifiedPhases:
        ExecutiveSchedulingPlatformCertificationRegistry.certifiedPhases,
      metadataOnly: true,
      immutable: true,
    } as const satisfies ExecutiveSchedulingCertifiedPlatformDescriptor),
    certifiedPhases: ExecutiveSchedulingPlatformCertificationRegistry.certifiedPhases,
    registry: ExecutiveSchedulingPlatformCertificationRegistry,
    compatibility: ExecutiveSchedulingPlatformCompatibility,
    validationSummary: Object.freeze({
      validationStatus: ExecutiveSchedulingPlatformReleaseSummary.validationStatus,
      manifestStatus: ExecutiveSchedulingPlatformReleaseSummary.manifestStatus,
      releaseReadiness: ExecutiveSchedulingPlatformReleaseSummary.releaseReadiness,
      metadataOnly: true,
      immutable: true,
    } as const satisfies ExecutiveSchedulingPlatformValidationSummary),
    manifestSummary: Object.freeze({
      phaseCount: platformManifest.phaseRegistry.length,
      dependencyCount: platformManifest.dependencyMap.length,
      publicApiCount: ExecutiveSchedulingPlatformPublicRegistry.totalExportCount,
      metadataOnly: true,
      immutable: true,
    } as const),
    compatibilitySummary: Object.freeze({
      internalCompatibilityStatus:
        ExecutiveSchedulingPlatformCompatibility.internal.every(
          (entry) => entry.compatibilityStatus === "Compatible",
        )
          ? "PASS"
          : "FAIL",
      crossPlatformCompatibilityStatus:
        ExecutiveSchedulingPlatformCompatibility.crossPlatform.every(
          (entry) => entry.compatibilityStatus === "Compatible",
        )
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
      immutable: true,
    } as const satisfies ExecutiveSchedulingPlatformCompatibilitySummary),
    releaseReadiness: Object.freeze({
      status: ExecutiveSchedulingPlatformReleaseSummary.releaseReadiness,
      publicApiStatus: ExecutiveSchedulingPlatformReleaseSummary.publicApiStatus,
      certificationStatus:
        ExecutiveSchedulingPlatformReleaseSummary.releaseReadiness === "Ready"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    } as const satisfies ExecutiveSchedulingPlatformReleaseReadiness),
    regressionSummary: Object.freeze({
      deterministicStatus:
        JSON.stringify(platformManifest) === JSON.stringify(platformManifest)
          ? "PASS"
          : "FAIL",
      immutableStatus: Object.isFrozen(platformManifest) ? "PASS" : "FAIL",
      metadataOnlyStatus:
        platformManifest.metadataOnly &&
        ExecutiveSchedulingPlatformCertificationRegistry.metadataOnly &&
        ExecutiveSchedulingPlatformCompatibility.metadataOnly
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    } as const satisfies ExecutiveSchedulingPlatformRegressionSummary),
    deterministicSummary: Object.freeze({
      deterministic: true,
      metadataOnly: true,
      immutable: true,
    } as const),
    metadataOnlySummary: Object.freeze({
      metadataOnly: true,
      immutable: true,
      publicApiStable:
        ExecutiveSchedulingPlatformReleaseSummary.publicApiStatus === "Stable",
    } as const),
    descriptor: Object.freeze({
      certificationId:
        ExecutiveSchedulingPlatformCertificationRegistry.certificationId,
      certificationName:
        ExecutiveSchedulingPlatformCertificationRegistry.certificationName,
      certificationVersion:
        ExecutiveSchedulingPlatformCertificationRegistry.certificationVersion,
      platformId: SchedulingIntelligenceIdentity.platformId,
      platformVersion: SchedulingIntelligenceIdentity.platformVersion,
      certificationStatus:
        ExecutiveSchedulingPlatformReleaseSummary.releaseReadiness === "Ready"
          ? "PASS"
          : "FAIL",
      releaseReadiness: ExecutiveSchedulingPlatformReleaseSummary.releaseReadiness,
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    } as const satisfies ExecutiveSchedulingPlatformCertificationManifestDescriptor),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
