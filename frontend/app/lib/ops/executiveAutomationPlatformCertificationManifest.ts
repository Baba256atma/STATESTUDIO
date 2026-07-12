import { buildAutomationManifest } from "./automationManifestIndex.ts";
import {
  ExecutiveAutomationPlatformMetadata,
  ExecutiveAutomationPlatformRelease,
} from "./executiveAutomationPlatformIndex.ts";
import { ExecutiveAutomationPlatformCertificationRegistry } from "./executiveAutomationPlatformCertificationRegistry.ts";
import { ExecutiveAutomationPlatformCompatibility } from "./executiveAutomationPlatformCompatibility.ts";
import type {
  ExecutiveAutomationCertificationDescriptor,
  ExecutiveAutomationCompatibilitySummary,
  ExecutiveAutomationReleaseReadiness,
} from "./executiveAutomationPlatformCertificationTypes.ts";

const platformManifest = buildAutomationManifest();

export const buildExecutiveAutomationPlatformCertificationManifest = () =>
  Object.freeze({
    platformIdentity: Object.freeze({
      platformId: ExecutiveAutomationPlatformMetadata.platformIdentity.platformId,
      platformName: ExecutiveAutomationPlatformMetadata.platformIdentity.platformName,
      platformVersion:
        ExecutiveAutomationPlatformMetadata.platformIdentity.platformVersion,
      metadataOnly: true,
      immutable: true,
    } as const),
    certificationIdentity: ExecutiveAutomationPlatformCertificationRegistry,
    certifiedPhases:
      ExecutiveAutomationPlatformCertificationRegistry.certifiedPhases,
    certificationRegistry: ExecutiveAutomationPlatformCertificationRegistry,
    compatibilityMetadata: ExecutiveAutomationPlatformCompatibility,
    validationSummary: Object.freeze({
      validationStatus: ExecutiveAutomationPlatformMetadata.validationSummary.status,
      manifestStatus: ExecutiveAutomationPlatformRelease.manifestStatus,
      releaseReadiness: ExecutiveAutomationPlatformRelease.releaseReadiness,
      metadataOnly: true,
      immutable: true,
    } as const),
    manifestSummary: Object.freeze({
      phaseCount: platformManifest.phaseRegistry.length,
      dependencyCount: platformManifest.dependencyMap.length,
      publicApiCount: platformManifest.publicApiSurface.length,
      metadataOnly: true,
      immutable: true,
    } as const),
    compatibilitySummary: Object.freeze({
      internalCompatibilityStatus:
        ExecutiveAutomationPlatformCompatibility.internal.every(
          (entry) => entry.compatibilityStatus === "Compatible",
        )
          ? "PASS"
          : "FAIL",
      crossPlatformCompatibilityStatus:
        ExecutiveAutomationPlatformCompatibility.crossPlatform.every(
          (entry) => entry.compatibilityStatus === "Compatible",
        )
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
      immutable: true,
    } as const satisfies ExecutiveAutomationCompatibilitySummary),
    releaseReadiness: Object.freeze({
      status: ExecutiveAutomationPlatformRelease.releaseReadiness,
      publicApiStatus: ExecutiveAutomationPlatformRelease.publicApiStatus,
      certificationStatus:
        ExecutiveAutomationPlatformRelease.releaseReadiness === "Ready"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    } as const satisfies ExecutiveAutomationReleaseReadiness),
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
    descriptor: Object.freeze({
      certificationId:
        ExecutiveAutomationPlatformCertificationRegistry.certificationId,
      certificationName:
        ExecutiveAutomationPlatformCertificationRegistry.certificationName,
      certificationVersion:
        ExecutiveAutomationPlatformCertificationRegistry.certificationVersion,
      platformId: ExecutiveAutomationPlatformMetadata.platformIdentity.platformId,
      platformVersion:
        ExecutiveAutomationPlatformMetadata.platformIdentity.platformVersion,
      certificationStatus:
        ExecutiveAutomationPlatformRelease.releaseReadiness === "Ready"
          ? "PASS"
          : "FAIL",
      releaseReadiness: ExecutiveAutomationPlatformRelease.releaseReadiness,
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    } as const satisfies ExecutiveAutomationCertificationDescriptor),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
