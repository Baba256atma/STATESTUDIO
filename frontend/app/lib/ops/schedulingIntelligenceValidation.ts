import { ExecutiveTaskIntelligencePublicIndexId } from "./executiveTaskIntelligencePublicIndex.ts";
import { ExecutiveWorkflowIntelligencePublicIndexId } from "./executiveWorkflowIntelligencePublicIndex.ts";
import { ExecutiveProjectExecutionPublicIndexId } from "./executiveProjectExecutionPublicIndex.ts";
import { ExecutiveResourceIntelligencePublicIndexId } from "./executiveResourceIntelligencePublicIndex.ts";
import {
  SchedulingIntelligenceContracts,
  SchedulingIntelligencePublicApis,
} from "./schedulingIntelligenceContracts.ts";
import { SchedulingIntelligenceIdentity } from "./schedulingIntelligenceIdentity.ts";
import { buildSchedulingIntelligenceManifest } from "./schedulingIntelligenceManifest.ts";
import { SchedulingIntelligenceRegistry } from "./schedulingIntelligenceRegistry.ts";

const buildChecks = () =>
  Object.freeze([
    Object.freeze({
      id: "scheduling-intelligence-identity-exists",
      name: "Identity Exists",
      status:
        SchedulingIntelligenceIdentity.platformId === "OPS-6:1" ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-intelligence-registry-exists",
      name: "Registry Exists",
      status:
        SchedulingIntelligenceRegistry.registeredPhases.length === 1 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-intelligence-contracts-exist",
      name: "Contracts Exist",
      status: SchedulingIntelligenceContracts.all.length === 8 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-intelligence-manifest-builds",
      name: "Manifest Builds",
      status:
        buildSchedulingIntelligenceManifest().compatibilityVersion === "1.0.0"
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-intelligence-metadata-immutable",
      name: "Metadata Immutable",
      status:
        Object.isFrozen(SchedulingIntelligenceIdentity) &&
        Object.isFrozen(SchedulingIntelligenceRegistry) &&
        Object.isFrozen(SchedulingIntelligenceContracts) &&
        Object.isFrozen(buildSchedulingIntelligenceManifest())
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-intelligence-public-api-exported",
      name: "Public API Exported",
      status: SchedulingIntelligencePublicApis.length === 3 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-intelligence-ops-2-dependency-exists",
      name: "OPS-2 Public Dependency Exists",
      status:
        buildSchedulingIntelligenceManifest().dependencies.some(
          (dependency) => dependency.dependencyPhase === ExecutiveTaskIntelligencePublicIndexId,
        )
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-intelligence-ops-3-dependency-exists",
      name: "OPS-3 Public Dependency Exists",
      status:
        buildSchedulingIntelligenceManifest().dependencies.some(
          (dependency) =>
            dependency.dependencyPhase === ExecutiveWorkflowIntelligencePublicIndexId,
        )
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-intelligence-ops-4-dependency-exists",
      name: "OPS-4 Public Dependency Exists",
      status:
        buildSchedulingIntelligenceManifest().dependencies.some(
          (dependency) =>
            dependency.dependencyPhase === ExecutiveProjectExecutionPublicIndexId,
        )
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-intelligence-ops-5-dependency-exists",
      name: "OPS-5 Public Dependency Exists",
      status:
        buildSchedulingIntelligenceManifest().dependencies.some(
          (dependency) =>
            dependency.dependencyPhase === ExecutiveResourceIntelligencePublicIndexId,
        )
          ? "PASS"
          : "FAIL",
    }),
  ] as const);

export const validateSchedulingIntelligenceFoundation = () => {
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
