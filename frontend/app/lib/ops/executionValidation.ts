import { ExecutionContracts } from "./executionContracts.ts";
import { ExecutionPlatformIdentity } from "./executionIdentity.ts";
import { buildExecutionManifest, ExecutionPublicApis } from "./executionManifest.ts";
import { ExecutionRegistry } from "./executionRegistry.ts";

const buildChecks = () =>
  Object.freeze([
    Object.freeze({
      id: "identity-exists",
      name: "Identity Exists",
      status: ExecutionPlatformIdentity.platformId === "OPS-1:1" ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "registry-exists",
      name: "Registry Exists",
      status: ExecutionRegistry.registeredPhases.length === 1 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "contracts-exist",
      name: "Contracts Exist",
      status: ExecutionContracts.all.length === 7 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "manifest-builds",
      name: "Manifest Builds",
      status: buildExecutionManifest().compatibilityVersion === "1.0.0" ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "public-apis-exported",
      name: "Public APIs Exported",
      status: ExecutionPublicApis.length === 3 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "metadata-immutable",
      name: "Metadata Immutable",
      status:
        Object.isFrozen(ExecutionPlatformIdentity) &&
        Object.isFrozen(ExecutionRegistry) &&
        Object.isFrozen(ExecutionContracts) &&
        Object.isFrozen(buildExecutionManifest())
          ? "PASS"
          : "FAIL",
    }),
  ] as const);

export const validateExecutionFoundation = () => {
  const checks = buildChecks();
  const passed = checks.filter((check) => check.status === "PASS").length;
  const failed = checks.length - passed;

  return Object.freeze({
    checks,
    summary: Object.freeze({
      total: checks.length,
      passed,
      failed,
      status: failed === 0 ? "PASS" : "FAIL",
      deterministic: true,
      metadataOnly: true,
    }),
    metadataOnly: true,
    immutable: true,
  } as const);
};
