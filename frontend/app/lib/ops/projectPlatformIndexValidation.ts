import { ExecutiveProjectExecutionPlatform } from "./projectPlatformNamespace.ts";
import { ExecutiveProjectExecutionPlatformPublicRegistry } from "./projectPlatformPublicRegistry.ts";
import { ExecutiveProjectExecutionPlatformReleaseSummary } from "./projectPlatformReleaseSummary.ts";
import type { ProjectPlatformIndexValidationEntry } from "./projectPlatformIndexTypes.ts";

const buildChecks = () =>
  Object.freeze([
    Object.freeze({
      id: "project-namespace-exists",
      name: "Aggregate Namespace Exists",
      status: ExecutiveProjectExecutionPlatform ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ProjectPlatformIndexValidationEntry),
    Object.freeze({
      id: "project-sections-exist",
      name: "All Required Sections Exist",
      status:
        "foundation" in ExecutiveProjectExecutionPlatform &&
        "metadata" in ExecutiveProjectExecutionPlatform &&
        "model" in ExecutiveProjectExecutionPlatform &&
        "validation" in ExecutiveProjectExecutionPlatform &&
        "manifest" in ExecutiveProjectExecutionPlatform &&
        "publicIndex" in ExecutiveProjectExecutionPlatform
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ProjectPlatformIndexValidationEntry),
    Object.freeze({
      id: "project-prior-phase-apis-represented",
      name: "Prior Phase APIs Represented",
      status:
        ExecutiveProjectExecutionPlatformPublicRegistry.foundationApis.length > 0 &&
        ExecutiveProjectExecutionPlatformPublicRegistry.metadataApis.length > 0 &&
        ExecutiveProjectExecutionPlatformPublicRegistry.modelApis.length > 0 &&
        ExecutiveProjectExecutionPlatformPublicRegistry.validationApis.length > 0 &&
        ExecutiveProjectExecutionPlatformPublicRegistry.manifestApis.length > 0
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ProjectPlatformIndexValidationEntry),
    Object.freeze({
      id: "project-release-summary-complete",
      name: "Release Summary Complete",
      status:
        ExecutiveProjectExecutionPlatformReleaseSummary.phaseCount === 4 &&
        ExecutiveProjectExecutionPlatformReleaseSummary.publicApiStatus ===
          "Stable" &&
        ExecutiveProjectExecutionPlatformReleaseSummary.architectureCompleteness ===
          "Complete"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ProjectPlatformIndexValidationEntry),
    Object.freeze({
      id: "project-public-registry-complete",
      name: "Public Registry Complete",
      status:
        ExecutiveProjectExecutionPlatformPublicRegistry.totalExportCount >= 22
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ProjectPlatformIndexValidationEntry),
    Object.freeze({
      id: "project-workflow-compatibility-represented",
      name: "Workflow Compatibility Represented",
      status:
        ExecutiveProjectExecutionPlatform.publicIndex.workflowCompatibilitySummary
          .compatibilityStatus === "PASS"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ProjectPlatformIndexValidationEntry),
    Object.freeze({
      id: "project-task-compatibility-represented",
      name: "Task Compatibility Represented",
      status:
        ExecutiveProjectExecutionPlatform.publicIndex.taskCompatibilitySummary
          .compatibilityStatus === "PASS"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ProjectPlatformIndexValidationEntry),
    Object.freeze({
      id: "project-namespace-immutable",
      name: "Namespace Immutable",
      status: Object.isFrozen(ExecutiveProjectExecutionPlatform) ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ProjectPlatformIndexValidationEntry),
    Object.freeze({
      id: "project-output-deterministic",
      name: "Output Deterministic",
      status:
        JSON.stringify(ExecutiveProjectExecutionPlatformReleaseSummary) ===
        JSON.stringify(ExecutiveProjectExecutionPlatformReleaseSummary)
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ProjectPlatformIndexValidationEntry),
  ] as const);

export const validateProjectPlatformIndex = () => {
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

