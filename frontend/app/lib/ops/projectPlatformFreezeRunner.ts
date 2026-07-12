import { getProjectPlatformCertificationStatus } from "./projectPlatformCertificationIndex.ts";
import {
  ExecutiveProjectExecutionPlatformPublicRegistry,
} from "./projectPlatformIndex.ts";
import { buildProjectPlatformFreezeManifest } from "./projectPlatformFreezeManifest.ts";
import {
  ProjectPlatformFreezeCompatibility,
  ProjectPlatformTaskCompatibility,
  ProjectPlatformWorkflowCompatibility,
} from "./projectPlatformFreezeCompatibility.ts";
import {
  ProjectPlatformFreezeRegistry,
} from "./projectPlatformFreezeRegistry.ts";
import {
  ProjectPlatformRegressionMetadata,
} from "./projectPlatformRegression.ts";
import type {
  ProjectPlatformFreezeEntry,
  ProjectPlatformFreezeResult,
} from "./projectPlatformFreezeTypes.ts";

const buildFreezeChecks = () =>
  Object.freeze([
    Object.freeze({
      id: "project-freeze-certification-status",
      name: "Certification Status PASS",
      description: "Validates certification dependency is PASS.",
      category: "Certification",
      status: getProjectPlatformCertificationStatus() === "PASS" ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ProjectPlatformFreezeEntry),
    Object.freeze({
      id: "project-freeze-prior-phases-represented",
      name: "All Prior Phases Represented",
      description: "Validates freeze registry contains OPS-4:1 through OPS-4:7.",
      category: "Manifest",
      status: ProjectPlatformFreezeRegistry.length === 7 ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ProjectPlatformFreezeEntry),
    Object.freeze({
      id: "project-freeze-regression-entries-exist",
      name: "Regression Entries Exist",
      description: "Validates regression metadata coverage exists for all freeze scopes.",
      category: "Regression",
      status: ProjectPlatformRegressionMetadata.length === 10 ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ProjectPlatformFreezeEntry),
    Object.freeze({
      id: "project-freeze-project-compatibility-exists",
      name: "Project Compatibility Metadata Exists",
      description: "Validates project freeze compatibility metadata exists.",
      category: "Compatibility",
      status: ProjectPlatformFreezeCompatibility.length === 3 ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ProjectPlatformFreezeEntry),
    Object.freeze({
      id: "project-freeze-task-compatibility-exists",
      name: "OPS-2 Task Compatibility Metadata Exists",
      description: "Validates OPS-2 task compatibility freeze metadata exists.",
      category: "Compatibility",
      status: ProjectPlatformTaskCompatibility.length === 2 ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ProjectPlatformFreezeEntry),
    Object.freeze({
      id: "project-freeze-workflow-compatibility-exists",
      name: "OPS-3 Workflow Compatibility Metadata Exists",
      description: "Validates OPS-3 workflow compatibility freeze metadata exists.",
      category: "Compatibility",
      status: ProjectPlatformWorkflowCompatibility.length === 2 ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ProjectPlatformFreezeEntry),
    Object.freeze({
      id: "project-freeze-public-api-status",
      name: "Public API Status Frozen",
      description: "Validates public API freeze status is frozen.",
      category: "PublicApi",
      status:
        ExecutiveProjectExecutionPlatformPublicRegistry.publicApiStatus === "Stable" &&
        buildProjectPlatformFreezeManifest().publicApiFreezeStatus === "Frozen"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ProjectPlatformFreezeEntry),
    Object.freeze({
      id: "project-freeze-manifest-builds",
      name: "Freeze Manifest Builds",
      description: "Validates deterministic freeze manifest generation.",
      category: "Manifest",
      status: Object.isFrozen(buildProjectPlatformFreezeManifest()) ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ProjectPlatformFreezeEntry),
    Object.freeze({
      id: "project-freeze-exports-immutable",
      name: "Exports Immutable",
      description: "Validates immutable freeze exports.",
      category: "Immutability",
      status:
        Object.isFrozen(buildProjectPlatformFreezeManifest()) &&
        Object.isFrozen(ProjectPlatformFreezeRegistry) &&
        Object.isFrozen(ProjectPlatformRegressionMetadata)
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ProjectPlatformFreezeEntry),
    Object.freeze({
      id: "project-freeze-output-deterministic",
      name: "Output Deterministic",
      description: "Validates deterministic freeze output.",
      category: "Determinism",
      status:
        JSON.stringify(buildProjectPlatformFreezeManifest()) ===
        JSON.stringify(buildProjectPlatformFreezeManifest())
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ProjectPlatformFreezeEntry),
  ] as const);

export const runProjectPlatformFreeze = () => {
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
  } as const satisfies ProjectPlatformFreezeResult);
};

export const getProjectPlatformFreezeSummary = () =>
  Object.freeze({
    totalChecks: runProjectPlatformFreeze().totalChecks,
    passed: runProjectPlatformFreeze().passed,
    failed: runProjectPlatformFreeze().failed,
    overallFreezeStatus: runProjectPlatformFreeze().overallFreezeStatus,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);

export const getProjectPlatformFreezeStatus = () =>
  runProjectPlatformFreeze().overallFreezeStatus;

