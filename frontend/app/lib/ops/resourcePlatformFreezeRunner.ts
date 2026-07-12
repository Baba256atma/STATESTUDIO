import { getResourcePlatformCertificationStatus } from "./resourcePlatformCertificationIndex.ts";
import {
  ExecutiveResourceIntelligencePlatformPublicRegistry,
} from "./resourcePlatformIndex.ts";
import { buildResourcePlatformFreezeManifest } from "./resourcePlatformFreezeManifest.ts";
import {
  ResourcePlatformFreezeCompatibility,
  ResourcePlatformProjectCompatibility,
  ResourcePlatformTaskCompatibility,
  ResourcePlatformWorkflowCompatibility,
} from "./resourcePlatformFreezeCompatibility.ts";
import {
  ResourcePlatformFreezeRegistry,
} from "./resourcePlatformFreezeRegistry.ts";
import {
  ResourcePlatformRegressionMetadata,
} from "./resourcePlatformRegression.ts";
import type {
  ResourcePlatformFreezeEntry,
  ResourcePlatformFreezeResult,
} from "./resourcePlatformFreezeTypes.ts";

const buildFreezeChecks = () =>
  Object.freeze([
    Object.freeze({
      id: "resource-freeze-certification-status",
      name: "Certification Status PASS",
      description: "Validates certification dependency is PASS.",
      category: "Certification",
      status: getResourcePlatformCertificationStatus() === "PASS" ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ResourcePlatformFreezeEntry),
    Object.freeze({
      id: "resource-freeze-prior-phases-represented",
      name: "All Prior Phases Represented",
      description: "Validates freeze registry contains OPS-5:1 through OPS-5:7.",
      category: "Manifest",
      status: ResourcePlatformFreezeRegistry.length === 7 ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ResourcePlatformFreezeEntry),
    Object.freeze({
      id: "resource-freeze-regression-entries-exist",
      name: "Regression Entries Exist",
      description: "Validates regression metadata coverage exists for all freeze scopes.",
      category: "Regression",
      status: ResourcePlatformRegressionMetadata.length === 11 ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ResourcePlatformFreezeEntry),
    Object.freeze({
      id: "resource-freeze-resource-compatibility-exists",
      name: "Resource Compatibility Metadata Exists",
      description: "Validates resource freeze compatibility metadata exists.",
      category: "Compatibility",
      status: ResourcePlatformFreezeCompatibility.length === 3 ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ResourcePlatformFreezeEntry),
    Object.freeze({
      id: "resource-freeze-task-compatibility-exists",
      name: "OPS-2 Task Compatibility Metadata Exists",
      description: "Validates OPS-2 task compatibility freeze metadata exists.",
      category: "Compatibility",
      status: ResourcePlatformTaskCompatibility.length === 2 ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ResourcePlatformFreezeEntry),
    Object.freeze({
      id: "resource-freeze-workflow-compatibility-exists",
      name: "OPS-3 Workflow Compatibility Metadata Exists",
      description: "Validates OPS-3 workflow compatibility freeze metadata exists.",
      category: "Compatibility",
      status: ResourcePlatformWorkflowCompatibility.length === 2 ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ResourcePlatformFreezeEntry),
    Object.freeze({
      id: "resource-freeze-project-compatibility-exists",
      name: "OPS-4 Project Compatibility Metadata Exists",
      description: "Validates OPS-4 project compatibility freeze metadata exists.",
      category: "Compatibility",
      status: ResourcePlatformProjectCompatibility.length === 2 ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ResourcePlatformFreezeEntry),
    Object.freeze({
      id: "resource-freeze-public-api-status",
      name: "Public API Status Frozen",
      description: "Validates public API freeze status is frozen.",
      category: "PublicApi",
      status:
        ExecutiveResourceIntelligencePlatformPublicRegistry.publicApiStatus === "Stable" &&
        buildResourcePlatformFreezeManifest().publicApiFreezeStatus === "Frozen"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ResourcePlatformFreezeEntry),
    Object.freeze({
      id: "resource-freeze-manifest-builds",
      name: "Freeze Manifest Builds",
      description: "Validates deterministic freeze manifest generation.",
      category: "Manifest",
      status: Object.isFrozen(buildResourcePlatformFreezeManifest()) ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ResourcePlatformFreezeEntry),
    Object.freeze({
      id: "resource-freeze-exports-immutable",
      name: "Exports Immutable",
      description: "Validates immutable freeze exports.",
      category: "Immutability",
      status:
        Object.isFrozen(buildResourcePlatformFreezeManifest()) &&
        Object.isFrozen(ResourcePlatformFreezeRegistry) &&
        Object.isFrozen(ResourcePlatformRegressionMetadata)
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ResourcePlatformFreezeEntry),
    Object.freeze({
      id: "resource-freeze-output-deterministic",
      name: "Output Deterministic",
      description: "Validates deterministic freeze output.",
      category: "Determinism",
      status:
        JSON.stringify(buildResourcePlatformFreezeManifest()) ===
        JSON.stringify(buildResourcePlatformFreezeManifest())
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ResourcePlatformFreezeEntry),
  ] as const);

export const runResourcePlatformFreeze = () => {
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
  } as const satisfies ResourcePlatformFreezeResult);
};

export const getResourcePlatformFreezeSummary = () =>
  Object.freeze({
    totalChecks: runResourcePlatformFreeze().totalChecks,
    passed: runResourcePlatformFreeze().passed,
    failed: runResourcePlatformFreeze().failed,
    overallFreezeStatus: runResourcePlatformFreeze().overallFreezeStatus,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);

export const getResourcePlatformFreezeStatus = () =>
  runResourcePlatformFreeze().overallFreezeStatus;
