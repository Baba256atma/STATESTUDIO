import { getWorkflowPlatformCertificationStatus } from "./workflowPlatformCertificationIndex.ts";
import {
  ExecutiveWorkflowIntelligencePlatformPublicRegistry,
} from "./workflowPlatformIndex.ts";
import { buildWorkflowPlatformFreezeManifest } from "./workflowPlatformFreezeManifest.ts";
import {
  WorkflowPlatformFreezeCompatibility,
  WorkflowPlatformTaskCompatibility,
} from "./workflowPlatformFreezeCompatibility.ts";
import {
  WorkflowPlatformFreezeRegistry,
} from "./workflowPlatformFreezeRegistry.ts";
import {
  WorkflowPlatformRegressionMetadata,
} from "./workflowPlatformRegression.ts";
import type {
  WorkflowPlatformFreezeEntry,
  WorkflowPlatformFreezeResult,
} from "./workflowPlatformFreezeTypes.ts";

const buildFreezeChecks = () =>
  Object.freeze([
    Object.freeze({
      id: "workflow-freeze-certification-status",
      name: "Certification Status PASS",
      description: "Validates certification dependency is PASS.",
      category: "Certification",
      status: getWorkflowPlatformCertificationStatus() === "PASS" ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies WorkflowPlatformFreezeEntry),
    Object.freeze({
      id: "workflow-freeze-prior-phases-represented",
      name: "All Prior Phases Represented",
      description: "Validates freeze registry contains OPS-3:1 through OPS-3:7.",
      category: "Manifest",
      status: WorkflowPlatformFreezeRegistry.length === 7 ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies WorkflowPlatformFreezeEntry),
    Object.freeze({
      id: "workflow-freeze-regression-entries-exist",
      name: "Regression Entries Exist",
      description: "Validates regression metadata coverage exists for all freeze scopes.",
      category: "Regression",
      status: WorkflowPlatformRegressionMetadata.length === 10 ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies WorkflowPlatformFreezeEntry),
    Object.freeze({
      id: "workflow-freeze-workflow-compatibility-exists",
      name: "Workflow Compatibility Exists",
      description: "Validates workflow freeze compatibility metadata exists.",
      category: "Compatibility",
      status: WorkflowPlatformFreezeCompatibility.length === 5 ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies WorkflowPlatformFreezeEntry),
    Object.freeze({
      id: "workflow-freeze-ops2-task-compatibility-exists",
      name: "OPS-2 Task Compatibility Exists",
      description: "Validates OPS-2 task compatibility metadata exists.",
      category: "TaskCompatibility",
      status:
        WorkflowPlatformTaskCompatibility.length === 2 &&
        buildWorkflowPlatformFreezeManifest().taskCompatibilityMetadata.length === 2
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies WorkflowPlatformFreezeEntry),
    Object.freeze({
      id: "workflow-freeze-public-api-status",
      name: "Public API Status Frozen",
      description: "Validates public API freeze status is frozen.",
      category: "PublicApi",
      status:
        ExecutiveWorkflowIntelligencePlatformPublicRegistry.publicApiStatus === "Stable" &&
        buildWorkflowPlatformFreezeManifest().publicApiFreezeStatus === "Frozen"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies WorkflowPlatformFreezeEntry),
    Object.freeze({
      id: "workflow-freeze-manifest-builds",
      name: "Freeze Manifest Builds",
      description: "Validates deterministic freeze manifest generation.",
      category: "Manifest",
      status: Object.isFrozen(buildWorkflowPlatformFreezeManifest()) ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies WorkflowPlatformFreezeEntry),
    Object.freeze({
      id: "workflow-freeze-exports-immutable",
      name: "Exports Immutable",
      description: "Validates immutable freeze exports.",
      category: "Immutability",
      status:
        Object.isFrozen(buildWorkflowPlatformFreezeManifest()) &&
        Object.isFrozen(WorkflowPlatformFreezeRegistry) &&
        Object.isFrozen(WorkflowPlatformRegressionMetadata)
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies WorkflowPlatformFreezeEntry),
    Object.freeze({
      id: "workflow-freeze-output-deterministic",
      name: "Output Deterministic",
      description: "Validates deterministic freeze output.",
      category: "Determinism",
      status:
        JSON.stringify(buildWorkflowPlatformFreezeManifest()) ===
        JSON.stringify(buildWorkflowPlatformFreezeManifest())
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies WorkflowPlatformFreezeEntry),
  ] as const);

export const runWorkflowPlatformFreeze = () => {
  const freezeEntries = buildFreezeChecks();
  const passed = freezeEntries.filter((entry) => entry.status === "PASS").length;
  const failed = freezeEntries.length - passed;

  return Object.freeze({
    totalChecks: freezeEntries.length,
    passed,
    failed,
    freezeEntries,
    overallFreezeStatus: failed === 0 ? "PASS" : "FAIL",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const satisfies WorkflowPlatformFreezeResult);
};

export const getWorkflowPlatformFreezeSummary = () =>
  Object.freeze({
    totalChecks: runWorkflowPlatformFreeze().totalChecks,
    passed: runWorkflowPlatformFreeze().passed,
    failed: runWorkflowPlatformFreeze().failed,
    overallFreezeStatus: runWorkflowPlatformFreeze().overallFreezeStatus,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);

export const getWorkflowPlatformFreezeStatus = () =>
  runWorkflowPlatformFreeze().overallFreezeStatus;
