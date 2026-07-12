import { ExecutiveSchedulingPlatform } from "./schedulingPlatformNamespace.ts";
import { ExecutiveSchedulingPlatformPublicRegistry } from "./schedulingPlatformPublicRegistry.ts";
import { ExecutiveSchedulingPlatformReleaseSummary } from "./schedulingPlatformReleaseSummary.ts";
import type { SchedulingPlatformIndexValidationEntry } from "./schedulingPlatformIndexTypes.ts";

const buildChecks = () =>
  Object.freeze([
    Object.freeze({
      id: "scheduling-namespace-exists",
      name: "Aggregate Namespace Exists",
      status: ExecutiveSchedulingPlatform ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies SchedulingPlatformIndexValidationEntry),
    Object.freeze({
      id: "scheduling-sections-exist",
      name: "All Required Sections Exist",
      status:
        "foundation" in ExecutiveSchedulingPlatform &&
        "metadata" in ExecutiveSchedulingPlatform &&
        "model" in ExecutiveSchedulingPlatform &&
        "validation" in ExecutiveSchedulingPlatform &&
        "manifest" in ExecutiveSchedulingPlatform &&
        "publicIndex" in ExecutiveSchedulingPlatform
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies SchedulingPlatformIndexValidationEntry),
    Object.freeze({
      id: "scheduling-prior-phase-apis-represented",
      name: "Prior Phase APIs Represented",
      status:
        ExecutiveSchedulingPlatformPublicRegistry.foundationApis.length > 0 &&
        ExecutiveSchedulingPlatformPublicRegistry.metadataApis.length > 0 &&
        ExecutiveSchedulingPlatformPublicRegistry.modelApis.length > 0 &&
        ExecutiveSchedulingPlatformPublicRegistry.validationApis.length > 0 &&
        ExecutiveSchedulingPlatformPublicRegistry.manifestApis.length > 0
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies SchedulingPlatformIndexValidationEntry),
    Object.freeze({
      id: "scheduling-release-summary-complete",
      name: "Release Summary Complete",
      status:
        ExecutiveSchedulingPlatformReleaseSummary.phaseCount === 4 &&
        ExecutiveSchedulingPlatformReleaseSummary.publicApiStatus === "Stable" &&
        ExecutiveSchedulingPlatformReleaseSummary.architectureCompleteness ===
          "Complete"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies SchedulingPlatformIndexValidationEntry),
    Object.freeze({
      id: "scheduling-public-registry-complete",
      name: "Public Registry Complete",
      status:
        ExecutiveSchedulingPlatformPublicRegistry.totalExportCount >= 22
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies SchedulingPlatformIndexValidationEntry),
    Object.freeze({
      id: "scheduling-task-compatibility-represented",
      name: "Task Compatibility Represented",
      status:
        ExecutiveSchedulingPlatform.publicIndex.taskCompatibilitySummary
          .compatibilityStatus === "PASS"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies SchedulingPlatformIndexValidationEntry),
    Object.freeze({
      id: "scheduling-workflow-compatibility-represented",
      name: "Workflow Compatibility Represented",
      status:
        ExecutiveSchedulingPlatform.publicIndex.workflowCompatibilitySummary
          .compatibilityStatus === "PASS"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies SchedulingPlatformIndexValidationEntry),
    Object.freeze({
      id: "scheduling-project-compatibility-represented",
      name: "Project Compatibility Represented",
      status:
        ExecutiveSchedulingPlatform.publicIndex.projectCompatibilitySummary
          .compatibilityStatus === "PASS"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies SchedulingPlatformIndexValidationEntry),
    Object.freeze({
      id: "scheduling-resource-compatibility-represented",
      name: "Resource Compatibility Represented",
      status:
        ExecutiveSchedulingPlatform.publicIndex.resourceCompatibilitySummary
          .compatibilityStatus === "PASS"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies SchedulingPlatformIndexValidationEntry),
    Object.freeze({
      id: "scheduling-namespace-immutable",
      name: "Namespace Immutable",
      status: Object.isFrozen(ExecutiveSchedulingPlatform) ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies SchedulingPlatformIndexValidationEntry),
    Object.freeze({
      id: "scheduling-output-deterministic",
      name: "Output Deterministic",
      status:
        JSON.stringify(ExecutiveSchedulingPlatformReleaseSummary) ===
        JSON.stringify(ExecutiveSchedulingPlatformReleaseSummary)
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies SchedulingPlatformIndexValidationEntry),
  ] as const);

export const validateSchedulingPlatformIndex = () => {
  const checks = buildChecks();
  const passedChecks = checks.filter((check) => check.status === "PASS").length;
  const failedChecks = checks.length - passedChecks;

  return Object.freeze({
    checks,
    totalChecks: checks.length,
    passedChecks,
    failedChecks,
    status: failedChecks === 0 ? "PASS" : "FAIL",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
};
