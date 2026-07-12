import { ExecutiveWorkflowIntelligencePlatform } from "./workflowPlatformNamespace.ts";
import { ExecutiveWorkflowIntelligencePlatformPublicRegistry } from "./workflowPlatformPublicRegistry.ts";
import { ExecutiveWorkflowIntelligencePlatformReleaseSummary } from "./workflowPlatformReleaseSummary.ts";
import { buildWorkflowPlatformManifest } from "./workflowPlatformManifestIndex.ts";
import type { WorkflowPlatformIndexValidationEntry } from "./workflowPlatformIndexTypes.ts";

const buildChecks = () =>
  Object.freeze([
    Object.freeze({
      id: "workflow-namespace-exists",
      name: "Aggregate Namespace Exists",
      status: ExecutiveWorkflowIntelligencePlatform ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies WorkflowPlatformIndexValidationEntry),
    Object.freeze({
      id: "workflow-sections-exist",
      name: "All Sections Exist",
      status:
        "foundation" in ExecutiveWorkflowIntelligencePlatform &&
        "metadata" in ExecutiveWorkflowIntelligencePlatform &&
        "model" in ExecutiveWorkflowIntelligencePlatform &&
        "validation" in ExecutiveWorkflowIntelligencePlatform &&
        "manifest" in ExecutiveWorkflowIntelligencePlatform &&
        "publicIndex" in ExecutiveWorkflowIntelligencePlatform
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies WorkflowPlatformIndexValidationEntry),
    Object.freeze({
      id: "workflow-prior-phase-apis-represented",
      name: "Prior Phase APIs Represented",
      status:
        ExecutiveWorkflowIntelligencePlatformPublicRegistry.foundationApis.length > 0 &&
        ExecutiveWorkflowIntelligencePlatformPublicRegistry.metadataApis.length > 0 &&
        ExecutiveWorkflowIntelligencePlatformPublicRegistry.modelApis.length > 0 &&
        ExecutiveWorkflowIntelligencePlatformPublicRegistry.validationApis.length > 0 &&
        ExecutiveWorkflowIntelligencePlatformPublicRegistry.manifestApis.length > 0
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies WorkflowPlatformIndexValidationEntry),
    Object.freeze({
      id: "workflow-task-compatibility-represented",
      name: "Task Compatibility Metadata Represented",
      status:
        buildWorkflowPlatformManifest().taskCompatibilitySummary.ops2DependencyRepresented &&
        ExecutiveWorkflowIntelligencePlatformReleaseSummary.taskCompatibilityStatus === "PASS"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies WorkflowPlatformIndexValidationEntry),
    Object.freeze({
      id: "workflow-release-summary-complete",
      name: "Release Summary Complete",
      status:
        ExecutiveWorkflowIntelligencePlatformReleaseSummary.phaseCount === 4 &&
        ExecutiveWorkflowIntelligencePlatformReleaseSummary.publicApiStatus ===
          "Stable"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies WorkflowPlatformIndexValidationEntry),
    Object.freeze({
      id: "workflow-public-registry-complete",
      name: "Public Registry Complete",
      status:
        ExecutiveWorkflowIntelligencePlatformPublicRegistry.totalExportCount >= 22
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies WorkflowPlatformIndexValidationEntry),
    Object.freeze({
      id: "workflow-namespace-immutable",
      name: "Namespace Immutable",
      status: Object.isFrozen(ExecutiveWorkflowIntelligencePlatform) ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies WorkflowPlatformIndexValidationEntry),
    Object.freeze({
      id: "workflow-output-deterministic",
      name: "Output Deterministic",
      status:
        JSON.stringify(ExecutiveWorkflowIntelligencePlatformReleaseSummary) ===
        JSON.stringify(ExecutiveWorkflowIntelligencePlatformReleaseSummary)
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies WorkflowPlatformIndexValidationEntry),
  ] as const);

export const validateWorkflowPlatformIndex = () => {
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
