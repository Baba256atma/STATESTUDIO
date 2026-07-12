import { buildExecutionMonitoringManifest } from "./executionMonitoringManifestIndex.ts";
import { ExecutiveExecutionMonitoringPlatformMetadata, ExecutiveExecutionMonitoringPlatformRelease } from "./executiveExecutionMonitoringPlatformIndex.ts";
import { ExecutiveExecutionMonitoringPlatformCertificationRegistry } from "./executiveExecutionMonitoringPlatformCertificationRegistry.ts";
import { ExecutiveExecutionMonitoringPlatformCompatibility } from "./executiveExecutionMonitoringPlatformCompatibility.ts";
import type { ExecutiveExecutionMonitoringCertificationDescriptor, ExecutiveExecutionMonitoringCompatibilitySummary, ExecutiveExecutionMonitoringReleaseReadiness } from "./executiveExecutionMonitoringPlatformCertificationTypes.ts";

export const buildExecutiveExecutionMonitoringPlatformCertificationManifest = () => {
  const platformManifest = buildExecutionMonitoringManifest();
  const release = ExecutiveExecutionMonitoringPlatformRelease;
  return Object.freeze({
    platformIdentity: Object.freeze({
      platformId: ExecutiveExecutionMonitoringPlatformMetadata.platformIdentity.platformId,
      platformName: ExecutiveExecutionMonitoringPlatformMetadata.platformIdentity.platformName,
      platformVersion: ExecutiveExecutionMonitoringPlatformMetadata.platformIdentity.platformVersion,
      metadataOnly: true, immutable: true,
    }),
    certificationIdentity: ExecutiveExecutionMonitoringPlatformCertificationRegistry,
    certifiedPhases: ExecutiveExecutionMonitoringPlatformCertificationRegistry.certifiedPhases,
    certificationRegistry: ExecutiveExecutionMonitoringPlatformCertificationRegistry,
    compatibilityMetadata: ExecutiveExecutionMonitoringPlatformCompatibility,
    validationSummary: Object.freeze({ validationStatus: ExecutiveExecutionMonitoringPlatformMetadata.validationSummary.status,
      manifestStatus: release.manifestStatus, releaseReadiness: release.releaseReadiness,
      metadataOnly: true, immutable: true,
    }),
    manifestSummary: Object.freeze({ phaseCount: platformManifest.phaseRegistry.length,
      dependencyCount: platformManifest.dependencyMap.length,
      publicApiCount: platformManifest.publicApiSurface.length,
      metadataOnly: true, immutable: true,
    }),
    compatibilitySummary: Object.freeze({
      internalCompatibilityStatus: ExecutiveExecutionMonitoringPlatformCompatibility.internal.every((entry) => entry.compatibilityStatus === "Compatible") ? "PASS" : "FAIL",
      crossPlatformCompatibilityStatus: ExecutiveExecutionMonitoringPlatformCompatibility.crossPlatform.every((entry) => entry.compatibilityStatus === "Compatible") ? "PASS" : "FAIL",
      metadataOnly: true, immutable: true,
    } as const satisfies ExecutiveExecutionMonitoringCompatibilitySummary),
    releaseReadiness: Object.freeze({
      status: release.releaseReadiness,
      publicApiStatus: release.publicApiStatus,
      certificationStatus: release.releaseReadiness === "Ready" ? "PASS" : "FAIL",
      metadataOnly: true, immutable: true, deterministic: true,
    } as const satisfies ExecutiveExecutionMonitoringReleaseReadiness),
    deterministicSummary: Object.freeze({ deterministic: true, metadataOnly: true, immutable: true }),
    metadataOnlySummary: Object.freeze({ metadataOnly: true, immutable: true, publicApiStable: true }),
    descriptor: Object.freeze({
      certificationId: ExecutiveExecutionMonitoringPlatformCertificationRegistry.certificationId,
      certificationName: ExecutiveExecutionMonitoringPlatformCertificationRegistry.certificationName,
      certificationVersion: ExecutiveExecutionMonitoringPlatformCertificationRegistry.certificationVersion,
      platformId: ExecutiveExecutionMonitoringPlatformMetadata.platformIdentity.platformId,
      platformVersion: ExecutiveExecutionMonitoringPlatformMetadata.platformIdentity.platformVersion,
      certificationStatus: release.releaseReadiness === "Ready" ? "PASS" : "FAIL",
      releaseReadiness: release.releaseReadiness,
      metadataOnly: true, immutable: true, deterministic: true,
    } as const satisfies ExecutiveExecutionMonitoringCertificationDescriptor),
    metadataOnly: true, immutable: true, deterministic: true,
  } as const);
};
