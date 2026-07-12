import {
  ExecutiveOperationsPlatform,
  ExecutiveOperationsPlatformPublicRegistry,
  validateExecutionPlatformIndex,
} from "./executionPlatformIndex.ts";
import {
  buildExecutionPlatformManifest,
  validateExecutionPlatformManifest,
} from "./executionPlatformManifestIndex.ts";
import {
  buildExecutionPlatformCertificationManifest,
} from "./executionPlatformCertificationManifest.ts";
import {
  ExecutionPlatformCertificationRegistry,
} from "./executionPlatformCertificationRegistry.ts";
import {
  ExecutionPlatformCompatibility,
} from "./executionPlatformCompatibility.ts";
import type {
  ExecutionPlatformCertificationEntry,
  ExecutionPlatformCertificationResult,
  ExecutionPlatformCertificationSummary,
} from "./executionPlatformCertificationTypes.ts";

const buildCertificationChecks = () =>
  Object.freeze([
    Object.freeze({
      certificationId: "cert-check-phases-exist",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "All OPS-1 phases exist",
      certificationStatus:
        buildExecutionPlatformCertificationManifest().certifiedPhases.length === 6
          ? "PASS"
          : "FAIL",
      category: "PlatformIndex",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies ExecutionPlatformCertificationEntry),
    Object.freeze({
      certificationId: "cert-check-public-apis-exist",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "All public APIs exist",
      certificationStatus:
        ExecutiveOperationsPlatformPublicRegistry.totalExportCount >= 22
          ? "PASS"
          : "FAIL",
      category: "PlatformIndex",
      level: "PublicApi",
      metadataOnly: true,
    } as const satisfies ExecutionPlatformCertificationEntry),
    Object.freeze({
      certificationId: "cert-check-platform-manifest-valid",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "Platform manifest is valid",
      certificationStatus:
        validateExecutionPlatformManifest().status === "PASS" ? "PASS" : "FAIL",
      category: "Manifest",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies ExecutionPlatformCertificationEntry),
    Object.freeze({
      certificationId: "cert-check-validation-pass",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "Validation status is PASS",
      certificationStatus:
        buildExecutionPlatformCertificationManifest().validationSummary.validationStatus ===
        "PASS"
          ? "PASS"
          : "FAIL",
      category: "Validation",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies ExecutionPlatformCertificationEntry),
    Object.freeze({
      certificationId: "cert-check-aggregate-namespace",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "Aggregate namespace exists",
      certificationStatus:
        validateExecutionPlatformIndex().status === "PASS" &&
        Object.isFrozen(ExecutiveOperationsPlatform)
          ? "PASS"
          : "FAIL",
      category: "PlatformIndex",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies ExecutionPlatformCertificationEntry),
    Object.freeze({
      certificationId: "cert-check-compatibility-exists",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "Compatibility metadata exists",
      certificationStatus:
        ExecutionPlatformCompatibility.length === 6 ? "PASS" : "FAIL",
      category: "Compatibility",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies ExecutionPlatformCertificationEntry),
    Object.freeze({
      certificationId: "cert-check-immutable-exports",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "Immutable exports",
      certificationStatus:
        Object.isFrozen(buildExecutionPlatformManifest()) &&
        Object.isFrozen(buildExecutionPlatformCertificationManifest()) &&
        Object.isFrozen(ExecutionPlatformCertificationRegistry)
          ? "PASS"
          : "FAIL",
      category: "Immutability",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies ExecutionPlatformCertificationEntry),
    Object.freeze({
      certificationId: "cert-check-deterministic-output",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "Deterministic outputs",
      certificationStatus:
        JSON.stringify(buildExecutionPlatformCertificationManifest()) ===
        JSON.stringify(buildExecutionPlatformCertificationManifest())
          ? "PASS"
          : "FAIL",
      category: "Determinism",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies ExecutionPlatformCertificationEntry),
  ] as const);

export const runExecutionPlatformCertification = () => {
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
  } as const satisfies ExecutionPlatformCertificationResult);
};

export const getExecutionPlatformCertificationSummary = () =>
  Object.freeze({
    totalChecks: runExecutionPlatformCertification().totalChecks,
    passed: runExecutionPlatformCertification().passed,
    failed: runExecutionPlatformCertification().failed,
    overallStatus: runExecutionPlatformCertification().overallStatus,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const satisfies ExecutionPlatformCertificationSummary);

export const getExecutionPlatformCertificationStatus = () =>
  runExecutionPlatformCertification().overallStatus;
