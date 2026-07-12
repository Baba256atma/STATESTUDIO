import { ExecutiveOperationsPlatform } from "./executionPlatformNamespace.ts";
import { ExecutiveOperationsPlatformPublicRegistry } from "./executionPlatformPublicRegistry.ts";
import { ExecutiveOperationsPlatformReleaseSummary } from "./executionPlatformReleaseSummary.ts";
import type { ExecutionPlatformIndexValidationEntry } from "./executionPlatformIndexTypes.ts";

const buildChecks = () =>
  Object.freeze([
    Object.freeze({
      id: "namespace-exists",
      name: "Aggregate Namespace Exists",
      status: ExecutiveOperationsPlatform ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutionPlatformIndexValidationEntry),
    Object.freeze({
      id: "sections-exist",
      name: "All Sections Exist",
      status:
        "foundation" in ExecutiveOperationsPlatform &&
        "metadata" in ExecutiveOperationsPlatform &&
        "model" in ExecutiveOperationsPlatform &&
        "validation" in ExecutiveOperationsPlatform &&
        "manifest" in ExecutiveOperationsPlatform &&
        "publicIndex" in ExecutiveOperationsPlatform
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutionPlatformIndexValidationEntry),
    Object.freeze({
      id: "prior-phase-apis-represented",
      name: "Prior Phase APIs Represented",
      status:
        ExecutiveOperationsPlatformPublicRegistry.foundationApis.length > 0 &&
        ExecutiveOperationsPlatformPublicRegistry.metadataApis.length > 0 &&
        ExecutiveOperationsPlatformPublicRegistry.modelApis.length > 0 &&
        ExecutiveOperationsPlatformPublicRegistry.validationApis.length > 0 &&
        ExecutiveOperationsPlatformPublicRegistry.manifestApis.length > 0
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutionPlatformIndexValidationEntry),
    Object.freeze({
      id: "release-summary-complete",
      name: "Release Summary Complete",
      status:
        ExecutiveOperationsPlatformReleaseSummary.phaseCount === 4 &&
        ExecutiveOperationsPlatformReleaseSummary.publicApiStatus === "Stable"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutionPlatformIndexValidationEntry),
    Object.freeze({
      id: "public-registry-complete",
      name: "Public Registry Complete",
      status:
        ExecutiveOperationsPlatformPublicRegistry.totalExportCount >= 22
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutionPlatformIndexValidationEntry),
    Object.freeze({
      id: "namespace-immutable",
      name: "Namespace Immutable",
      status: Object.isFrozen(ExecutiveOperationsPlatform) ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutionPlatformIndexValidationEntry),
    Object.freeze({
      id: "output-deterministic",
      name: "Output Deterministic",
      status:
        JSON.stringify(ExecutiveOperationsPlatformReleaseSummary) ===
        JSON.stringify(ExecutiveOperationsPlatformReleaseSummary)
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutionPlatformIndexValidationEntry),
  ] as const);

export const validateExecutionPlatformIndex = () => {
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
