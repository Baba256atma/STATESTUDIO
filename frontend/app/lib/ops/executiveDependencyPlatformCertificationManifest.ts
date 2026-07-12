import { buildDependencyManifest } from "./dependencyManifestIndex.ts";
import {
  ExecutiveDependencyPlatformMetadata,
  ExecutiveDependencyPlatformRelease,
} from "./executiveDependencyPlatformIndex.ts";
import { ExecutiveDependencyPlatformCertificationRegistry } from "./executiveDependencyPlatformCertificationRegistry.ts";
import { ExecutiveDependencyPlatformCompatibility } from "./executiveDependencyPlatformCompatibility.ts";
import type {
  ExecutiveDependencyCertificationDescriptor,
  ExecutiveDependencyCompatibilitySummary,
  ExecutiveDependencyReleaseReadiness,
} from "./executiveDependencyPlatformCertificationTypes.ts";

const platformManifest = buildDependencyManifest();

export const buildExecutiveDependencyPlatformCertificationManifest = () =>
  Object.freeze({
    platformIdentity: Object.freeze({
      platformId: ExecutiveDependencyPlatformMetadata.platformIdentity.platformId,
      platformName: ExecutiveDependencyPlatformMetadata.platformIdentity.platformName,
      platformVersion:
        ExecutiveDependencyPlatformMetadata.platformIdentity.platformVersion,
      metadataOnly: true,
      immutable: true,
    } as const),
    certificationIdentity: ExecutiveDependencyPlatformCertificationRegistry,
    certifiedPhases:
      ExecutiveDependencyPlatformCertificationRegistry.certifiedPhases,
    certificationRegistry: ExecutiveDependencyPlatformCertificationRegistry,
    compatibilityMetadata: ExecutiveDependencyPlatformCompatibility,
    validationSummary: Object.freeze({
      validationStatus: ExecutiveDependencyPlatformMetadata.validationSummary.status,
      manifestStatus: ExecutiveDependencyPlatformRelease.manifestStatus,
      releaseReadiness: ExecutiveDependencyPlatformRelease.releaseReadiness,
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
        ExecutiveDependencyPlatformCompatibility.internal.every(
          (entry) => entry.compatibilityStatus === "Compatible",
        )
          ? "PASS"
          : "FAIL",
      crossPlatformCompatibilityStatus:
        ExecutiveDependencyPlatformCompatibility.crossPlatform.every(
          (entry) => entry.compatibilityStatus === "Compatible",
        )
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
      immutable: true,
    } as const satisfies ExecutiveDependencyCompatibilitySummary),
    releaseReadiness: Object.freeze({
      status: ExecutiveDependencyPlatformRelease.releaseReadiness,
      publicApiStatus: ExecutiveDependencyPlatformRelease.publicApiStatus,
      certificationStatus:
        ExecutiveDependencyPlatformRelease.releaseReadiness === "Ready"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    } as const satisfies ExecutiveDependencyReleaseReadiness),
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
        ExecutiveDependencyPlatformCertificationRegistry.certificationId,
      certificationName:
        ExecutiveDependencyPlatformCertificationRegistry.certificationName,
      certificationVersion:
        ExecutiveDependencyPlatformCertificationRegistry.certificationVersion,
      platformId: ExecutiveDependencyPlatformMetadata.platformIdentity.platformId,
      platformVersion:
        ExecutiveDependencyPlatformMetadata.platformIdentity.platformVersion,
      certificationStatus:
        ExecutiveDependencyPlatformRelease.releaseReadiness === "Ready"
          ? "PASS"
          : "FAIL",
      releaseReadiness: ExecutiveDependencyPlatformRelease.releaseReadiness,
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    } as const satisfies ExecutiveDependencyCertificationDescriptor),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
