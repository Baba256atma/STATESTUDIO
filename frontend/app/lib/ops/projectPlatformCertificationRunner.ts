import {
  ExecutiveProjectExecutionPlatform,
  ExecutiveProjectExecutionPlatformPublicRegistry,
  validateProjectPlatformIndex,
} from "./projectPlatformIndex.ts";
import {
  buildProjectPlatformManifest,
  validateProjectPlatformManifest,
} from "./projectPlatformManifestIndex.ts";
import {
  buildProjectPlatformCertificationManifest,
} from "./projectPlatformCertificationManifest.ts";
import {
  ProjectPlatformCertificationRegistry,
} from "./projectPlatformCertificationRegistry.ts";
import {
  ProjectPlatformCompatibility,
} from "./projectPlatformCompatibility.ts";
import type {
  ProjectPlatformCertificationEntry,
  ProjectPlatformCertificationResult,
  ProjectPlatformCertificationSummary,
} from "./projectPlatformCertificationTypes.ts";

const buildCertificationChecks = () =>
  Object.freeze([
    Object.freeze({
      certificationId: "project-cert-check-phases-exist",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "All OPS-4 phases exist",
      certificationStatus:
        buildProjectPlatformCertificationManifest().certifiedPhases.length === 6
          ? "PASS"
          : "FAIL",
      category: "PlatformIndex",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies ProjectPlatformCertificationEntry),
    Object.freeze({
      certificationId: "project-cert-check-public-apis-exist",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "All public APIs exist",
      certificationStatus:
        ExecutiveProjectExecutionPlatformPublicRegistry.totalExportCount >= 22
          ? "PASS"
          : "FAIL",
      category: "PlatformIndex",
      level: "PublicApi",
      metadataOnly: true,
    } as const satisfies ProjectPlatformCertificationEntry),
    Object.freeze({
      certificationId: "project-cert-check-platform-manifest-valid",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "Project platform manifest is valid",
      certificationStatus:
        validateProjectPlatformManifest().status === "PASS" ? "PASS" : "FAIL",
      category: "Manifest",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies ProjectPlatformCertificationEntry),
    Object.freeze({
      certificationId: "project-cert-check-validation-pass",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "Project validation status is PASS",
      certificationStatus:
        buildProjectPlatformCertificationManifest().validationSummary.validationStatus === "PASS"
          ? "PASS"
          : "FAIL",
      category: "Validation",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies ProjectPlatformCertificationEntry),
    Object.freeze({
      certificationId: "project-cert-check-aggregate-namespace",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "Aggregate namespace exists",
      certificationStatus:
        validateProjectPlatformIndex().status === "PASS" &&
        Object.isFrozen(ExecutiveProjectExecutionPlatform)
          ? "PASS"
          : "FAIL",
      category: "PlatformIndex",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies ProjectPlatformCertificationEntry),
    Object.freeze({
      certificationId: "project-cert-check-task-compatibility-exists",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "OPS-2 task compatibility exists",
      certificationStatus:
        buildProjectPlatformManifest().taskCompatibilitySummary.compatibilityStatus === "PASS"
          ? "PASS"
          : "FAIL",
      category: "Compatibility",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies ProjectPlatformCertificationEntry),
    Object.freeze({
      certificationId: "project-cert-check-workflow-compatibility-exists",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "OPS-3 workflow compatibility exists",
      certificationStatus:
        buildProjectPlatformManifest().workflowCompatibilitySummary.compatibilityStatus === "PASS"
          ? "PASS"
          : "FAIL",
      category: "Compatibility",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies ProjectPlatformCertificationEntry),
    Object.freeze({
      certificationId: "project-cert-check-compatibility-metadata-exists",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "Compatibility metadata exists",
      certificationStatus:
        ProjectPlatformCompatibility.length === 6 ? "PASS" : "FAIL",
      category: "Compatibility",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies ProjectPlatformCertificationEntry),
    Object.freeze({
      certificationId: "project-cert-check-immutable-exports",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "Immutable exports",
      certificationStatus:
        Object.isFrozen(buildProjectPlatformManifest()) &&
        Object.isFrozen(buildProjectPlatformCertificationManifest()) &&
        Object.isFrozen(ProjectPlatformCertificationRegistry)
          ? "PASS"
          : "FAIL",
      category: "Immutability",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies ProjectPlatformCertificationEntry),
    Object.freeze({
      certificationId: "project-cert-check-deterministic-output",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "Deterministic outputs",
      certificationStatus:
        JSON.stringify(buildProjectPlatformCertificationManifest()) ===
        JSON.stringify(buildProjectPlatformCertificationManifest())
          ? "PASS"
          : "FAIL",
      category: "Determinism",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies ProjectPlatformCertificationEntry),
  ] as const);

export const runProjectPlatformCertification = () => {
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
  } as const satisfies ProjectPlatformCertificationResult);
};

export const getProjectPlatformCertificationSummary = () =>
  Object.freeze({
    totalChecks: runProjectPlatformCertification().totalChecks,
    passed: runProjectPlatformCertification().passed,
    failed: runProjectPlatformCertification().failed,
    overallStatus: runProjectPlatformCertification().overallStatus,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const satisfies ProjectPlatformCertificationSummary);

export const getProjectPlatformCertificationStatus = () =>
  runProjectPlatformCertification().overallStatus;

