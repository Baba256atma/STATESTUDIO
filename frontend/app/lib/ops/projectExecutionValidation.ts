import { ExecutiveTaskIntelligencePublicIndexId } from "./executiveTaskIntelligencePublicIndex.ts";
import { ExecutiveWorkflowIntelligencePublicIndexId } from "./executiveWorkflowIntelligencePublicIndex.ts";
import {
  ProjectExecutionContracts,
  ProjectExecutionPublicApis,
} from "./projectExecutionContracts.ts";
import { ProjectExecutionIdentity } from "./projectExecutionIdentity.ts";
import { buildProjectExecutionManifest } from "./projectExecutionManifest.ts";
import { ProjectExecutionRegistry } from "./projectExecutionRegistry.ts";

const buildChecks = () =>
  Object.freeze([
    Object.freeze({
      id: "project-execution-identity-exists",
      name: "Identity Exists",
      status:
        ProjectExecutionIdentity.platformId === "OPS-4:1" ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "project-execution-registry-exists",
      name: "Registry Exists",
      status:
        ProjectExecutionRegistry.registeredPhases.length === 1 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "project-execution-contracts-exist",
      name: "Contracts Exist",
      status: ProjectExecutionContracts.all.length === 7 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "project-execution-manifest-builds",
      name: "Manifest Builds",
      status:
        buildProjectExecutionManifest().compatibilityVersion === "1.0.0"
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "project-execution-metadata-immutable",
      name: "Metadata Immutable",
      status:
        Object.isFrozen(ProjectExecutionIdentity) &&
        Object.isFrozen(ProjectExecutionRegistry) &&
        Object.isFrozen(ProjectExecutionContracts) &&
        Object.isFrozen(buildProjectExecutionManifest())
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "project-execution-public-api-exported",
      name: "Public API Exported",
      status: ProjectExecutionPublicApis.length === 3 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "project-execution-ops-2-dependency-exists",
      name: "OPS-2 Public Dependency Exists",
      status:
        buildProjectExecutionManifest().dependencies.some(
          (dependency) => dependency.dependencyPhase === ExecutiveTaskIntelligencePublicIndexId,
        )
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "project-execution-ops-3-dependency-exists",
      name: "OPS-3 Public Dependency Exists",
      status:
        buildProjectExecutionManifest().dependencies.some(
          (dependency) =>
            dependency.dependencyPhase === ExecutiveWorkflowIntelligencePublicIndexId,
        )
          ? "PASS"
          : "FAIL",
    }),
  ] as const);

export const validateProjectExecutionFoundation = () => {
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

