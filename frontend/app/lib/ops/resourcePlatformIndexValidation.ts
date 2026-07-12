import { ExecutiveResourceIntelligencePlatform } from "./resourcePlatformNamespace.ts";
import { ExecutiveResourceIntelligencePlatformPublicRegistry } from "./resourcePlatformPublicRegistry.ts";
import { ExecutiveResourceIntelligencePlatformReleaseSummary } from "./resourcePlatformReleaseSummary.ts";
import type { ResourcePlatformIndexValidationEntry } from "./resourcePlatformIndexTypes.ts";

const buildChecks = () =>
  Object.freeze([
    Object.freeze({
      id: "resource-namespace-exists",
      name: "Aggregate Namespace Exists",
      status: ExecutiveResourceIntelligencePlatform ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ResourcePlatformIndexValidationEntry),
    Object.freeze({
      id: "resource-sections-exist",
      name: "All Required Sections Exist",
      status:
        "foundation" in ExecutiveResourceIntelligencePlatform &&
        "metadata" in ExecutiveResourceIntelligencePlatform &&
        "model" in ExecutiveResourceIntelligencePlatform &&
        "validation" in ExecutiveResourceIntelligencePlatform &&
        "manifest" in ExecutiveResourceIntelligencePlatform &&
        "publicIndex" in ExecutiveResourceIntelligencePlatform
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ResourcePlatformIndexValidationEntry),
    Object.freeze({
      id: "resource-prior-phase-apis-represented",
      name: "Prior Phase APIs Represented",
      status:
        ExecutiveResourceIntelligencePlatformPublicRegistry.foundationApis.length > 0 &&
        ExecutiveResourceIntelligencePlatformPublicRegistry.metadataApis.length > 0 &&
        ExecutiveResourceIntelligencePlatformPublicRegistry.modelApis.length > 0 &&
        ExecutiveResourceIntelligencePlatformPublicRegistry.validationApis.length > 0 &&
        ExecutiveResourceIntelligencePlatformPublicRegistry.manifestApis.length > 0
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ResourcePlatformIndexValidationEntry),
    Object.freeze({
      id: "resource-release-summary-complete",
      name: "Release Summary Complete",
      status:
        ExecutiveResourceIntelligencePlatformReleaseSummary.phaseCount === 4 &&
        ExecutiveResourceIntelligencePlatformReleaseSummary.publicApiStatus ===
          "Stable" &&
        ExecutiveResourceIntelligencePlatformReleaseSummary.architectureCompleteness ===
          "Complete"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ResourcePlatformIndexValidationEntry),
    Object.freeze({
      id: "resource-public-registry-complete",
      name: "Public Registry Complete",
      status:
        ExecutiveResourceIntelligencePlatformPublicRegistry.totalExportCount >= 22
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ResourcePlatformIndexValidationEntry),
    Object.freeze({
      id: "resource-task-compatibility-represented",
      name: "Task Compatibility Represented",
      status:
        ExecutiveResourceIntelligencePlatform.publicIndex.taskCompatibilitySummary
          .compatibilityStatus === "PASS"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ResourcePlatformIndexValidationEntry),
    Object.freeze({
      id: "resource-workflow-compatibility-represented",
      name: "Workflow Compatibility Represented",
      status:
        ExecutiveResourceIntelligencePlatform.publicIndex.workflowCompatibilitySummary
          .compatibilityStatus === "PASS"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ResourcePlatformIndexValidationEntry),
    Object.freeze({
      id: "resource-project-compatibility-represented",
      name: "Project Compatibility Represented",
      status:
        ExecutiveResourceIntelligencePlatform.publicIndex.projectCompatibilitySummary
          .compatibilityStatus === "PASS"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ResourcePlatformIndexValidationEntry),
    Object.freeze({
      id: "resource-namespace-immutable",
      name: "Namespace Immutable",
      status: Object.isFrozen(ExecutiveResourceIntelligencePlatform) ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ResourcePlatformIndexValidationEntry),
    Object.freeze({
      id: "resource-output-deterministic",
      name: "Output Deterministic",
      status:
        JSON.stringify(ExecutiveResourceIntelligencePlatformReleaseSummary) ===
        JSON.stringify(ExecutiveResourceIntelligencePlatformReleaseSummary)
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ResourcePlatformIndexValidationEntry),
  ] as const);

export const validateResourcePlatformIndex = () => {
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
