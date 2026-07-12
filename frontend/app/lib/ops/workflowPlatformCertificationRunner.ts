import {
  ExecutiveWorkflowIntelligencePlatform,
  ExecutiveWorkflowIntelligencePlatformPublicRegistry,
  validateWorkflowPlatformIndex,
} from "./workflowPlatformIndex.ts";
import {
  buildWorkflowPlatformManifest,
  validateWorkflowPlatformManifest,
} from "./workflowPlatformManifestIndex.ts";
import {
  buildWorkflowPlatformCertificationManifest,
} from "./workflowPlatformCertificationManifest.ts";
import {
  WorkflowPlatformCertificationRegistry,
} from "./workflowPlatformCertificationRegistry.ts";
import {
  WorkflowPlatformCompatibility,
} from "./workflowPlatformCompatibility.ts";
import type {
  WorkflowPlatformCertificationEntry,
  WorkflowPlatformCertificationResult,
  WorkflowPlatformCertificationSummary,
} from "./workflowPlatformCertificationTypes.ts";

const buildCertificationChecks = () =>
  Object.freeze([
    Object.freeze({
      certificationId: "workflow-cert-check-phases-exist",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "All OPS-3 phases exist",
      certificationStatus:
        buildWorkflowPlatformCertificationManifest().certifiedPhases.length === 6
          ? "PASS"
          : "FAIL",
      category: "PlatformIndex",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies WorkflowPlatformCertificationEntry),
    Object.freeze({
      certificationId: "workflow-cert-check-public-apis-exist",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "All public APIs exist",
      certificationStatus:
        ExecutiveWorkflowIntelligencePlatformPublicRegistry.totalExportCount >= 22
          ? "PASS"
          : "FAIL",
      category: "PlatformIndex",
      level: "PublicApi",
      metadataOnly: true,
    } as const satisfies WorkflowPlatformCertificationEntry),
    Object.freeze({
      certificationId: "workflow-cert-check-platform-manifest-valid",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "Workflow platform manifest is valid",
      certificationStatus:
        validateWorkflowPlatformManifest().status === "PASS" ? "PASS" : "FAIL",
      category: "Manifest",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies WorkflowPlatformCertificationEntry),
    Object.freeze({
      certificationId: "workflow-cert-check-validation-pass",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "Workflow validation status is PASS",
      certificationStatus:
        buildWorkflowPlatformCertificationManifest().validationSummary.validationStatus
        === "PASS"
          ? "PASS"
          : "FAIL",
      category: "Validation",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies WorkflowPlatformCertificationEntry),
    Object.freeze({
      certificationId: "workflow-cert-check-aggregate-namespace",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "Aggregate namespace exists",
      certificationStatus:
        validateWorkflowPlatformIndex().status === "PASS" &&
        Object.isFrozen(ExecutiveWorkflowIntelligencePlatform)
          ? "PASS"
          : "FAIL",
      category: "PlatformIndex",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies WorkflowPlatformCertificationEntry),
    Object.freeze({
      certificationId: "workflow-cert-check-ops2-task-compatibility",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "OPS-2 task compatibility exists",
      certificationStatus:
        buildWorkflowPlatformManifest().taskCompatibilitySummary.ops2DependencyRepresented &&
        buildWorkflowPlatformCertificationManifest().manifestSummary.taskCompatibilityStatus
          === "PASS"
          ? "PASS"
          : "FAIL",
      category: "TaskCompatibility",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies WorkflowPlatformCertificationEntry),
    Object.freeze({
      certificationId: "workflow-cert-check-compatibility-exists",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "Compatibility metadata exists",
      certificationStatus:
        WorkflowPlatformCompatibility.length === 6 ? "PASS" : "FAIL",
      category: "Compatibility",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies WorkflowPlatformCertificationEntry),
    Object.freeze({
      certificationId: "workflow-cert-check-immutable-exports",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "Immutable exports",
      certificationStatus:
        Object.isFrozen(buildWorkflowPlatformManifest()) &&
        Object.isFrozen(buildWorkflowPlatformCertificationManifest()) &&
        Object.isFrozen(WorkflowPlatformCertificationRegistry)
          ? "PASS"
          : "FAIL",
      category: "Immutability",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies WorkflowPlatformCertificationEntry),
    Object.freeze({
      certificationId: "workflow-cert-check-deterministic-output",
      certificationVersion: "1.0.0",
      certificationDateMetadata: "logical-2026-07-07",
      certificationScope: "Deterministic outputs",
      certificationStatus:
        JSON.stringify(buildWorkflowPlatformCertificationManifest()) ===
        JSON.stringify(buildWorkflowPlatformCertificationManifest())
          ? "PASS"
          : "FAIL",
      category: "Determinism",
      level: "Platform",
      metadataOnly: true,
    } as const satisfies WorkflowPlatformCertificationEntry),
  ] as const);

export const runWorkflowPlatformCertification = () => {
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
  } as const satisfies WorkflowPlatformCertificationResult);
};

export const getWorkflowPlatformCertificationSummary = () =>
  Object.freeze({
    totalChecks: runWorkflowPlatformCertification().totalChecks,
    passed: runWorkflowPlatformCertification().passed,
    failed: runWorkflowPlatformCertification().failed,
    overallStatus: runWorkflowPlatformCertification().overallStatus,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const satisfies WorkflowPlatformCertificationSummary);

export const getWorkflowPlatformCertificationStatus = () =>
  runWorkflowPlatformCertification().overallStatus;
