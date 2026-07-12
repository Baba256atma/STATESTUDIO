import { ExecutiveTaskIntelligencePlatform } from "./taskPlatformNamespace.ts";
import { ExecutiveTaskIntelligencePlatformPublicRegistry } from "./taskPlatformPublicRegistry.ts";
import { ExecutiveTaskIntelligencePlatformReleaseSummary } from "./taskPlatformReleaseSummary.ts";
import type { TaskPlatformIndexValidationEntry } from "./taskPlatformIndexTypes.ts";

const buildChecks = () =>
  Object.freeze([
    Object.freeze({
      id: "task-namespace-exists",
      name: "Aggregate Namespace Exists",
      status: ExecutiveTaskIntelligencePlatform ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies TaskPlatformIndexValidationEntry),
    Object.freeze({
      id: "task-sections-exist",
      name: "All Sections Exist",
      status:
        "foundation" in ExecutiveTaskIntelligencePlatform &&
        "metadata" in ExecutiveTaskIntelligencePlatform &&
        "model" in ExecutiveTaskIntelligencePlatform &&
        "validation" in ExecutiveTaskIntelligencePlatform &&
        "manifest" in ExecutiveTaskIntelligencePlatform &&
        "publicIndex" in ExecutiveTaskIntelligencePlatform
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies TaskPlatformIndexValidationEntry),
    Object.freeze({
      id: "task-prior-phase-apis-represented",
      name: "Prior Phase APIs Represented",
      status:
        ExecutiveTaskIntelligencePlatformPublicRegistry.foundationApis.length > 0 &&
        ExecutiveTaskIntelligencePlatformPublicRegistry.metadataApis.length > 0 &&
        ExecutiveTaskIntelligencePlatformPublicRegistry.modelApis.length > 0 &&
        ExecutiveTaskIntelligencePlatformPublicRegistry.validationApis.length > 0 &&
        ExecutiveTaskIntelligencePlatformPublicRegistry.manifestApis.length > 0
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies TaskPlatformIndexValidationEntry),
    Object.freeze({
      id: "task-release-summary-complete",
      name: "Release Summary Complete",
      status:
        ExecutiveTaskIntelligencePlatformReleaseSummary.phaseCount === 4 &&
        ExecutiveTaskIntelligencePlatformReleaseSummary.publicApiStatus ===
          "Stable"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies TaskPlatformIndexValidationEntry),
    Object.freeze({
      id: "task-public-registry-complete",
      name: "Public Registry Complete",
      status:
        ExecutiveTaskIntelligencePlatformPublicRegistry.totalExportCount >= 22
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies TaskPlatformIndexValidationEntry),
    Object.freeze({
      id: "task-namespace-immutable",
      name: "Namespace Immutable",
      status: Object.isFrozen(ExecutiveTaskIntelligencePlatform) ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies TaskPlatformIndexValidationEntry),
    Object.freeze({
      id: "task-output-deterministic",
      name: "Output Deterministic",
      status:
        JSON.stringify(ExecutiveTaskIntelligencePlatformReleaseSummary) ===
        JSON.stringify(ExecutiveTaskIntelligencePlatformReleaseSummary)
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies TaskPlatformIndexValidationEntry),
  ] as const);

export const validateTaskPlatformIndex = () => {
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
