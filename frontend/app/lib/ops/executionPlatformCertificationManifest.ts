import { ExecutionPlatformIdentity } from "./executionIndex.ts";
import {
  buildExecutionPlatformManifest,
} from "./executionPlatformManifestIndex.ts";
import {
  ExecutiveOperationsPlatformPublicRegistry,
  ExecutiveOperationsPlatformReleaseSummary,
} from "./executionPlatformIndex.ts";
import {
  ExecutionPlatformCertificationRegistry,
  ExecutionPlatformCertificationRegistryMetadata,
} from "./executionPlatformCertificationRegistry.ts";
import {
  ExecutionPlatformCompatibility,
  ExecutionPlatformCompatibilityMetadata,
} from "./executionPlatformCompatibility.ts";
import type { ExecutionPlatformCertificationManifest } from "./executionPlatformCertificationTypes.ts";

export const buildExecutionPlatformCertificationManifest = () =>
  Object.freeze({
    platformIdentity: Object.freeze({
      platformId: ExecutionPlatformIdentity.platformId,
      platformName: ExecutionPlatformIdentity.platformName,
      platformVersion: ExecutionPlatformIdentity.platformVersion,
    }),
    certifiedPhases: Object.freeze([
      "OPS-1:1",
      "OPS-1:2",
      "OPS-1:3",
      "OPS-1:4",
      "OPS-1:5",
      "OPS-1:6",
    ]),
    certificationRegistry: ExecutionPlatformCertificationRegistry,
    certificationRegistryMetadata: ExecutionPlatformCertificationRegistryMetadata,
    compatibilityMatrix: ExecutionPlatformCompatibility,
    compatibilityMetadata: ExecutionPlatformCompatibilityMetadata,
    publicApiStatus: ExecutiveOperationsPlatformPublicRegistry.publicApiStatus,
    validationSummary: Object.freeze({
      validationStatus: ExecutiveOperationsPlatformReleaseSummary.validationStatus,
      manifestStatus: ExecutiveOperationsPlatformReleaseSummary.manifestStatus,
      releaseReadiness: ExecutiveOperationsPlatformReleaseSummary.releaseReadiness,
      metadataOnly: true,
      immutable: true,
    }),
    manifestSummary: Object.freeze({
      phaseCount: buildExecutionPlatformManifest().phaseRegistry.length,
      dependencyCount: buildExecutionPlatformManifest().dependencyMap.length,
      publicApiCount: ExecutiveOperationsPlatformPublicRegistry.totalExportCount,
      metadataOnly: true,
      immutable: true,
    }),
    certificationStatus:
      ExecutiveOperationsPlatformReleaseSummary.validationStatus === "PASS"
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const satisfies ExecutionPlatformCertificationManifest);
