import { ResourceIntelligenceIdentity } from "./resourceIntelligenceIndex.ts";
import {
  buildResourcePlatformManifest,
} from "./resourcePlatformManifestIndex.ts";
import {
  ExecutiveResourceIntelligencePlatformPublicRegistry,
  ExecutiveResourceIntelligencePlatformReleaseSummary,
} from "./resourcePlatformIndex.ts";
import {
  ResourcePlatformCertificationRegistry,
  ResourcePlatformCertificationRegistryMetadata,
} from "./resourcePlatformCertificationRegistry.ts";
import {
  ResourcePlatformCompatibility,
  ResourcePlatformCompatibilityMetadata,
} from "./resourcePlatformCompatibility.ts";
import type { ResourcePlatformCertificationManifest } from "./resourcePlatformCertificationTypes.ts";

export const buildResourcePlatformCertificationManifest = () =>
  Object.freeze({
    platformIdentity: Object.freeze({
      platformId: ResourceIntelligenceIdentity.platformId,
      platformName: ResourceIntelligenceIdentity.platformName,
      platformVersion: ResourceIntelligenceIdentity.platformVersion,
    }),
    certifiedPhases: Object.freeze([
      "OPS-5:1",
      "OPS-5:2",
      "OPS-5:3",
      "OPS-5:4",
      "OPS-5:5",
      "OPS-5:6",
    ]),
    certificationRegistry: ResourcePlatformCertificationRegistry,
    certificationRegistryMetadata: ResourcePlatformCertificationRegistryMetadata,
    compatibilityMatrix: ResourcePlatformCompatibility,
    compatibilityMetadata: ResourcePlatformCompatibilityMetadata,
    publicApiStatus: ExecutiveResourceIntelligencePlatformPublicRegistry.publicApiStatus,
    validationSummary: Object.freeze({
      validationStatus: ExecutiveResourceIntelligencePlatformReleaseSummary.validationStatus,
      manifestStatus: ExecutiveResourceIntelligencePlatformReleaseSummary.manifestStatus,
      releaseReadiness: ExecutiveResourceIntelligencePlatformReleaseSummary.releaseReadiness,
      metadataOnly: true,
      immutable: true,
    }),
    manifestSummary: Object.freeze({
      phaseCount: buildResourcePlatformManifest().phaseRegistry.length,
      dependencyCount: buildResourcePlatformManifest().dependencyMap.length,
      publicApiCount: ExecutiveResourceIntelligencePlatformPublicRegistry.totalExportCount,
      metadataOnly: true,
      immutable: true,
    }),
    certificationStatus:
      ExecutiveResourceIntelligencePlatformReleaseSummary.validationStatus === "PASS" &&
      ExecutiveResourceIntelligencePlatformReleaseSummary.manifestStatus === "PASS" &&
      ExecutiveResourceIntelligencePlatformReleaseSummary.taskCompatibilityStatus === "PASS" &&
      ExecutiveResourceIntelligencePlatformReleaseSummary.workflowCompatibilityStatus === "PASS" &&
      ExecutiveResourceIntelligencePlatformReleaseSummary.projectCompatibilityStatus === "PASS"
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const satisfies ResourcePlatformCertificationManifest);
