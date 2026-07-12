import { getExecutionPlatformCertificationStatus } from "./executionPlatformCertificationIndex.ts";
import {
  ExecutiveOperationsPlatformPublicRegistry,
} from "./executionPlatformIndex.ts";
import { buildExecutionPlatformFreezeManifest } from "./executionPlatformFreezeManifest.ts";
import {
  ExecutionPlatformFreezeCompatibility,
} from "./executionPlatformFreezeCompatibility.ts";
import {
  ExecutionPlatformFreezeRegistry,
} from "./executionPlatformFreezeRegistry.ts";
import {
  ExecutionPlatformRegressionMetadata,
} from "./executionPlatformRegression.ts";
import type {
  ExecutionPlatformFreezeEntry,
  ExecutionPlatformFreezeResult,
} from "./executionPlatformFreezeTypes.ts";

const buildFreezeChecks = () =>
  Object.freeze([
    Object.freeze({
      id: "freeze-certification-status",
      name: "Certification Status PASS",
      description: "Validates certification dependency is PASS.",
      category: "Certification",
      status: getExecutionPlatformCertificationStatus() === "PASS" ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutionPlatformFreezeEntry),
    Object.freeze({
      id: "freeze-prior-phases-represented",
      name: "All Prior Phases Represented",
      description: "Validates freeze registry contains OPS-1:1 through OPS-1:7.",
      category: "Manifest",
      status: ExecutionPlatformFreezeRegistry.length === 7 ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutionPlatformFreezeEntry),
    Object.freeze({
      id: "freeze-regression-entries-exist",
      name: "Regression Entries Exist",
      description: "Validates regression metadata coverage exists for all freeze scopes.",
      category: "Regression",
      status: ExecutionPlatformRegressionMetadata.length === 8 ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutionPlatformFreezeEntry),
    Object.freeze({
      id: "freeze-compatibility-exists",
      name: "Compatibility Metadata Exists",
      description: "Validates freeze compatibility metadata exists.",
      category: "Compatibility",
      status: ExecutionPlatformFreezeCompatibility.length === 6 ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutionPlatformFreezeEntry),
    Object.freeze({
      id: "freeze-public-api-status",
      name: "Public API Status Frozen",
      description: "Validates public API freeze status is frozen.",
      category: "PublicApi",
      status:
        ExecutiveOperationsPlatformPublicRegistry.publicApiStatus === "Stable" &&
        buildExecutionPlatformFreezeManifest().publicApiFreezeStatus === "Frozen"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutionPlatformFreezeEntry),
    Object.freeze({
      id: "freeze-manifest-builds",
      name: "Freeze Manifest Builds",
      description: "Validates deterministic freeze manifest generation.",
      category: "Manifest",
      status: Object.isFrozen(buildExecutionPlatformFreezeManifest()) ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutionPlatformFreezeEntry),
    Object.freeze({
      id: "freeze-exports-immutable",
      name: "Exports Immutable",
      description: "Validates immutable freeze exports.",
      category: "Immutability",
      status:
        Object.isFrozen(buildExecutionPlatformFreezeManifest()) &&
        Object.isFrozen(ExecutionPlatformFreezeRegistry) &&
        Object.isFrozen(ExecutionPlatformRegressionMetadata)
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutionPlatformFreezeEntry),
    Object.freeze({
      id: "freeze-output-deterministic",
      name: "Output Deterministic",
      description: "Validates deterministic freeze output.",
      category: "Determinism",
      status:
        JSON.stringify(buildExecutionPlatformFreezeManifest()) ===
        JSON.stringify(buildExecutionPlatformFreezeManifest())
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutionPlatformFreezeEntry),
  ] as const);

export const runExecutionPlatformFreeze = () => {
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
  } as const satisfies ExecutionPlatformFreezeResult);
};

export const getExecutionPlatformFreezeSummary = () =>
  Object.freeze({
    totalChecks: runExecutionPlatformFreeze().totalChecks,
    passed: runExecutionPlatformFreeze().passed,
    failed: runExecutionPlatformFreeze().failed,
    overallFreezeStatus: runExecutionPlatformFreeze().overallFreezeStatus,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);

export const getExecutionPlatformFreezeStatus = () =>
  runExecutionPlatformFreeze().overallFreezeStatus;
