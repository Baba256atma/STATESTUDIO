import { getTaskPlatformCertificationStatus } from "./taskPlatformCertificationIndex.ts";
import {
  ExecutiveTaskIntelligencePlatformPublicRegistry,
} from "./taskPlatformIndex.ts";
import { buildTaskPlatformFreezeManifest } from "./taskPlatformFreezeManifest.ts";
import {
  TaskPlatformFreezeCompatibility,
} from "./taskPlatformFreezeCompatibility.ts";
import {
  TaskPlatformFreezeRegistry,
} from "./taskPlatformFreezeRegistry.ts";
import {
  TaskPlatformRegressionMetadata,
} from "./taskPlatformRegression.ts";
import type {
  TaskPlatformFreezeEntry,
  TaskPlatformFreezeResult,
} from "./taskPlatformFreezeTypes.ts";

const buildFreezeChecks = () =>
  Object.freeze([
    Object.freeze({
      id: "task-freeze-certification-status",
      name: "Certification Status PASS",
      description: "Validates certification dependency is PASS.",
      category: "Certification",
      status: getTaskPlatformCertificationStatus() === "PASS" ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies TaskPlatformFreezeEntry),
    Object.freeze({
      id: "task-freeze-prior-phases-represented",
      name: "All Prior Phases Represented",
      description: "Validates freeze registry contains OPS-2:1 through OPS-2:7.",
      category: "Manifest",
      status: TaskPlatformFreezeRegistry.length === 7 ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies TaskPlatformFreezeEntry),
    Object.freeze({
      id: "task-freeze-regression-entries-exist",
      name: "Regression Entries Exist",
      description: "Validates regression metadata coverage exists for all freeze scopes.",
      category: "Regression",
      status: TaskPlatformRegressionMetadata.length === 8 ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies TaskPlatformFreezeEntry),
    Object.freeze({
      id: "task-freeze-compatibility-exists",
      name: "Compatibility Metadata Exists",
      description: "Validates freeze compatibility metadata exists.",
      category: "Compatibility",
      status: TaskPlatformFreezeCompatibility.length === 6 ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies TaskPlatformFreezeEntry),
    Object.freeze({
      id: "task-freeze-public-api-status",
      name: "Public API Status Frozen",
      description: "Validates public API freeze status is frozen.",
      category: "PublicApi",
      status:
        ExecutiveTaskIntelligencePlatformPublicRegistry.publicApiStatus === "Stable"
        && buildTaskPlatformFreezeManifest().publicApiFreezeStatus === "Frozen"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies TaskPlatformFreezeEntry),
    Object.freeze({
      id: "task-freeze-manifest-builds",
      name: "Freeze Manifest Builds",
      description: "Validates deterministic freeze manifest generation.",
      category: "Manifest",
      status: Object.isFrozen(buildTaskPlatformFreezeManifest()) ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies TaskPlatformFreezeEntry),
    Object.freeze({
      id: "task-freeze-exports-immutable",
      name: "Exports Immutable",
      description: "Validates immutable freeze exports.",
      category: "Immutability",
      status:
        Object.isFrozen(buildTaskPlatformFreezeManifest()) &&
        Object.isFrozen(TaskPlatformFreezeRegistry) &&
        Object.isFrozen(TaskPlatformRegressionMetadata)
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies TaskPlatformFreezeEntry),
    Object.freeze({
      id: "task-freeze-output-deterministic",
      name: "Output Deterministic",
      description: "Validates deterministic freeze output.",
      category: "Determinism",
      status:
        JSON.stringify(buildTaskPlatformFreezeManifest()) ===
        JSON.stringify(buildTaskPlatformFreezeManifest())
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies TaskPlatformFreezeEntry),
  ] as const);

export const runTaskPlatformFreeze = () => {
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
  } as const satisfies TaskPlatformFreezeResult);
};

export const getTaskPlatformFreezeSummary = () =>
  Object.freeze({
    totalChecks: runTaskPlatformFreeze().totalChecks,
    passed: runTaskPlatformFreeze().passed,
    failed: runTaskPlatformFreeze().failed,
    overallFreezeStatus: runTaskPlatformFreeze().overallFreezeStatus,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);

export const getTaskPlatformFreezeStatus = () =>
  runTaskPlatformFreeze().overallFreezeStatus;
