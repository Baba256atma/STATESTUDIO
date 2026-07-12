import {
  ExecutiveTaskIntelligencePlatform,
  ExecutiveTaskIntelligencePlatformPublicRegistry,
  validateTaskPlatformIndex,
} from "./taskPlatformIndex.ts";
import {
  buildTaskPlatformManifest,
  validateTaskPlatformManifest,
} from "./taskPlatformManifestIndex.ts";
import {
  buildTaskPlatformCertificationManifest,
} from "./taskPlatformCertificationManifest.ts";
import {
  TaskPlatformCertificationRegistry,
} from "./taskPlatformCertificationRegistry.ts";
import {
  TaskPlatformCompatibility,
} from "./taskPlatformCompatibility.ts";
import type {
  TaskPlatformCertificationEntry,
  TaskPlatformCertificationResult,
  TaskPlatformCertificationSummary,
} from "./taskPlatformCertificationTypes.ts";

const buildCertificationChecks = () =>
  Object.freeze([
    Object.freeze({
      certificationId: "task-cert-check-phases-exist",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "All OPS-2 phases exist",
      certificationStatus:
        buildTaskPlatformCertificationManifest().certifiedPhases.length === 6
          ? "PASS"
          : "FAIL",
      category: "PlatformIndex",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies TaskPlatformCertificationEntry),
    Object.freeze({
      certificationId: "task-cert-check-public-apis-exist",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "All public APIs exist",
      certificationStatus:
        ExecutiveTaskIntelligencePlatformPublicRegistry.totalExportCount >= 22
          ? "PASS"
          : "FAIL",
      category: "PlatformIndex",
      level: "PublicApi",
      metadataOnly: true,
    } as const satisfies TaskPlatformCertificationEntry),
    Object.freeze({
      certificationId: "task-cert-check-platform-manifest-valid",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "Task platform manifest is valid",
      certificationStatus:
        validateTaskPlatformManifest().status === "PASS" ? "PASS" : "FAIL",
      category: "Manifest",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies TaskPlatformCertificationEntry),
    Object.freeze({
      certificationId: "task-cert-check-validation-pass",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "Task validation status is PASS",
      certificationStatus:
        buildTaskPlatformCertificationManifest().validationSummary.validationStatus
        === "PASS"
          ? "PASS"
          : "FAIL",
      category: "Validation",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies TaskPlatformCertificationEntry),
    Object.freeze({
      certificationId: "task-cert-check-aggregate-namespace",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "Aggregate namespace exists",
      certificationStatus:
        validateTaskPlatformIndex().status === "PASS"
        && Object.isFrozen(ExecutiveTaskIntelligencePlatform)
          ? "PASS"
          : "FAIL",
      category: "PlatformIndex",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies TaskPlatformCertificationEntry),
    Object.freeze({
      certificationId: "task-cert-check-compatibility-exists",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "Compatibility metadata exists",
      certificationStatus:
        TaskPlatformCompatibility.length === 6 ? "PASS" : "FAIL",
      category: "Compatibility",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies TaskPlatformCertificationEntry),
    Object.freeze({
      certificationId: "task-cert-check-immutable-exports",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "Immutable exports",
      certificationStatus:
        Object.isFrozen(buildTaskPlatformManifest()) &&
        Object.isFrozen(buildTaskPlatformCertificationManifest()) &&
        Object.isFrozen(TaskPlatformCertificationRegistry)
          ? "PASS"
          : "FAIL",
      category: "Immutability",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies TaskPlatformCertificationEntry),
    Object.freeze({
      certificationId: "task-cert-check-deterministic-output",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "Deterministic outputs",
      certificationStatus:
        JSON.stringify(buildTaskPlatformCertificationManifest()) ===
        JSON.stringify(buildTaskPlatformCertificationManifest())
          ? "PASS"
          : "FAIL",
      category: "Determinism",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies TaskPlatformCertificationEntry),
  ] as const);

export const runTaskPlatformCertification = () => {
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
  } as const satisfies TaskPlatformCertificationResult);
};

export const getTaskPlatformCertificationSummary = () =>
  Object.freeze({
    totalChecks: runTaskPlatformCertification().totalChecks,
    passed: runTaskPlatformCertification().passed,
    failed: runTaskPlatformCertification().failed,
    overallStatus: runTaskPlatformCertification().overallStatus,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const satisfies TaskPlatformCertificationSummary);

export const getTaskPlatformCertificationStatus = () =>
  runTaskPlatformCertification().overallStatus;
