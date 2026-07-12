import {
  ExecutiveResourceIntelligencePlatform,
  ExecutiveResourceIntelligencePlatformPublicRegistry,
  validateResourcePlatformIndex,
} from "./resourcePlatformIndex.ts";
import {
  buildResourcePlatformManifest,
  validateResourcePlatformManifest,
} from "./resourcePlatformManifestIndex.ts";
import {
  buildResourcePlatformCertificationManifest,
} from "./resourcePlatformCertificationManifest.ts";
import {
  ResourcePlatformCertificationRegistry,
} from "./resourcePlatformCertificationRegistry.ts";
import {
  ResourcePlatformCompatibility,
} from "./resourcePlatformCompatibility.ts";
import type {
  ResourcePlatformCertificationEntry,
  ResourcePlatformCertificationResult,
  ResourcePlatformCertificationSummary,
} from "./resourcePlatformCertificationTypes.ts";

const buildCertificationChecks = () =>
  Object.freeze([
    Object.freeze({
      certificationId: "resource-cert-check-phases-exist",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "All OPS-5 phases exist",
      certificationStatus:
        buildResourcePlatformCertificationManifest().certifiedPhases.length === 6
          ? "PASS"
          : "FAIL",
      category: "PlatformIndex",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies ResourcePlatformCertificationEntry),
    Object.freeze({
      certificationId: "resource-cert-check-public-apis-exist",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "All public APIs exist",
      certificationStatus:
        ExecutiveResourceIntelligencePlatformPublicRegistry.totalExportCount >= 22
          ? "PASS"
          : "FAIL",
      category: "PlatformIndex",
      level: "PublicApi",
      metadataOnly: true,
    } as const satisfies ResourcePlatformCertificationEntry),
    Object.freeze({
      certificationId: "resource-cert-check-platform-manifest-valid",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "Resource platform manifest is valid",
      certificationStatus:
        validateResourcePlatformManifest().status === "PASS" ? "PASS" : "FAIL",
      category: "Manifest",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies ResourcePlatformCertificationEntry),
    Object.freeze({
      certificationId: "resource-cert-check-validation-pass",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "Resource validation status is PASS",
      certificationStatus:
        buildResourcePlatformCertificationManifest().validationSummary.validationStatus === "PASS"
          ? "PASS"
          : "FAIL",
      category: "Validation",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies ResourcePlatformCertificationEntry),
    Object.freeze({
      certificationId: "resource-cert-check-aggregate-namespace",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "Aggregate namespace exists",
      certificationStatus:
        validateResourcePlatformIndex().status === "PASS" &&
        Object.isFrozen(ExecutiveResourceIntelligencePlatform)
          ? "PASS"
          : "FAIL",
      category: "PlatformIndex",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies ResourcePlatformCertificationEntry),
    Object.freeze({
      certificationId: "resource-cert-check-task-compatibility-exists",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "OPS-2 task compatibility exists",
      certificationStatus:
        buildResourcePlatformManifest().taskCompatibilitySummary.compatibilityStatus === "PASS"
          ? "PASS"
          : "FAIL",
      category: "Compatibility",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies ResourcePlatformCertificationEntry),
    Object.freeze({
      certificationId: "resource-cert-check-workflow-compatibility-exists",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "OPS-3 workflow compatibility exists",
      certificationStatus:
        buildResourcePlatformManifest().workflowCompatibilitySummary.compatibilityStatus === "PASS"
          ? "PASS"
          : "FAIL",
      category: "Compatibility",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies ResourcePlatformCertificationEntry),
    Object.freeze({
      certificationId: "resource-cert-check-project-compatibility-exists",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "OPS-4 project compatibility exists",
      certificationStatus:
        buildResourcePlatformManifest().projectCompatibilitySummary.compatibilityStatus === "PASS"
          ? "PASS"
          : "FAIL",
      category: "Compatibility",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies ResourcePlatformCertificationEntry),
    Object.freeze({
      certificationId: "resource-cert-check-compatibility-metadata-exists",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "Compatibility metadata exists",
      certificationStatus:
        ResourcePlatformCompatibility.length === 6 ? "PASS" : "FAIL",
      category: "Compatibility",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies ResourcePlatformCertificationEntry),
    Object.freeze({
      certificationId: "resource-cert-check-immutable-exports",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "Immutable exports",
      certificationStatus:
        Object.isFrozen(buildResourcePlatformManifest()) &&
        Object.isFrozen(buildResourcePlatformCertificationManifest()) &&
        Object.isFrozen(ResourcePlatformCertificationRegistry)
          ? "PASS"
          : "FAIL",
      category: "Immutability",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies ResourcePlatformCertificationEntry),
    Object.freeze({
      certificationId: "resource-cert-check-deterministic-output",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "Deterministic outputs",
      certificationStatus:
        JSON.stringify(buildResourcePlatformCertificationManifest()) ===
        JSON.stringify(buildResourcePlatformCertificationManifest())
          ? "PASS"
          : "FAIL",
      category: "Determinism",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies ResourcePlatformCertificationEntry),
  ] as const);

export const runResourcePlatformCertification = () => {
  const certificationEntries = buildCertificationChecks();
  const passed = certificationEntries.filter(
    (entry) => entry.certificationStatus === "PASS",
  ).length;
  const failed = certificationEntries.length - passed;

  return Object.freeze({
    totalChecks: certificationEntries.length,
    passed,
    failed,
    certificationEntries,
    overallStatus: failed === 0 ? "PASS" : "FAIL",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const satisfies ResourcePlatformCertificationResult);
};

export const getResourcePlatformCertificationSummary = () =>
  Object.freeze({
    totalChecks: runResourcePlatformCertification().totalChecks,
    passed: runResourcePlatformCertification().passed,
    failed: runResourcePlatformCertification().failed,
    overallStatus: runResourcePlatformCertification().overallStatus,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const satisfies ResourcePlatformCertificationSummary);

export const getResourcePlatformCertificationStatus = () =>
  runResourcePlatformCertification().overallStatus;
