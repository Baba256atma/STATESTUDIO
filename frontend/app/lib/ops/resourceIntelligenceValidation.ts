import { ExecutiveTaskIntelligencePublicIndexId } from "./executiveTaskIntelligencePublicIndex.ts";
import { ExecutiveWorkflowIntelligencePublicIndexId } from "./executiveWorkflowIntelligencePublicIndex.ts";
import { ExecutiveProjectExecutionPublicIndexId } from "./executiveProjectExecutionPublicIndex.ts";
import {
  ResourceIntelligenceContracts,
  ResourceIntelligencePublicApis,
} from "./resourceIntelligenceContracts.ts";
import { ResourceIntelligenceIdentity } from "./resourceIntelligenceIdentity.ts";
import { buildResourceIntelligenceManifest } from "./resourceIntelligenceManifest.ts";
import { ResourceIntelligenceRegistry } from "./resourceIntelligenceRegistry.ts";

const buildChecks = () =>
  Object.freeze([
    Object.freeze({
      id: "resource-intelligence-identity-exists",
      name: "Identity Exists",
      status:
        ResourceIntelligenceIdentity.platformId === "OPS-5:1" ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "resource-intelligence-registry-exists",
      name: "Registry Exists",
      status:
        ResourceIntelligenceRegistry.registeredPhases.length === 1 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "resource-intelligence-contracts-exist",
      name: "Contracts Exist",
      status: ResourceIntelligenceContracts.all.length === 12 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "resource-intelligence-manifest-builds",
      name: "Manifest Builds",
      status:
        buildResourceIntelligenceManifest().compatibilityVersion === "1.0.0"
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "resource-intelligence-metadata-immutable",
      name: "Metadata Immutable",
      status:
        Object.isFrozen(ResourceIntelligenceIdentity) &&
        Object.isFrozen(ResourceIntelligenceRegistry) &&
        Object.isFrozen(ResourceIntelligenceContracts) &&
        Object.isFrozen(buildResourceIntelligenceManifest())
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "resource-intelligence-public-api-exported",
      name: "Public API Exported",
      status: ResourceIntelligencePublicApis.length === 3 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "resource-intelligence-ops-2-dependency-exists",
      name: "OPS-2 Public Dependency Exists",
      status:
        buildResourceIntelligenceManifest().dependencies.some(
          (dependency) => dependency.dependencyPhase === ExecutiveTaskIntelligencePublicIndexId,
        )
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "resource-intelligence-ops-3-dependency-exists",
      name: "OPS-3 Public Dependency Exists",
      status:
        buildResourceIntelligenceManifest().dependencies.some(
          (dependency) =>
            dependency.dependencyPhase === ExecutiveWorkflowIntelligencePublicIndexId,
        )
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "resource-intelligence-ops-4-dependency-exists",
      name: "OPS-4 Public Dependency Exists",
      status:
        buildResourceIntelligenceManifest().dependencies.some(
          (dependency) =>
            dependency.dependencyPhase === ExecutiveProjectExecutionPublicIndexId,
        )
          ? "PASS"
          : "FAIL",
    }),
  ] as const);

export const validateResourceIntelligenceFoundation = () => {
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
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
};

