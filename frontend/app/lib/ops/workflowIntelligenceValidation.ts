import { ExecutiveTaskIntelligencePublicIndexId } from "./executiveTaskIntelligencePublicIndex.ts";
import {
  WorkflowIntelligenceContracts,
  WorkflowIntelligencePublicApis,
} from "./workflowIntelligenceContracts.ts";
import { WorkflowIntelligenceIdentity } from "./workflowIntelligenceIdentity.ts";
import { buildWorkflowIntelligenceManifest } from "./workflowIntelligenceManifest.ts";
import { WorkflowIntelligenceRegistry } from "./workflowIntelligenceRegistry.ts";

const buildChecks = () =>
  Object.freeze([
    Object.freeze({
      id: "workflow-intelligence-identity-exists",
      name: "Identity Exists",
      status:
        WorkflowIntelligenceIdentity.platformId === "OPS-3:1" ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "workflow-intelligence-registry-exists",
      name: "Registry Exists",
      status:
        WorkflowIntelligenceRegistry.registeredPhases.length === 1 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "workflow-intelligence-contracts-exist",
      name: "Contracts Exist",
      status: WorkflowIntelligenceContracts.all.length === 7 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "workflow-intelligence-manifest-builds",
      name: "Manifest Builds",
      status:
        buildWorkflowIntelligenceManifest().compatibilityVersion === "1.0.0"
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "workflow-intelligence-metadata-immutable",
      name: "Metadata Immutable",
      status:
        Object.isFrozen(WorkflowIntelligenceIdentity) &&
        Object.isFrozen(WorkflowIntelligenceRegistry) &&
        Object.isFrozen(WorkflowIntelligenceContracts) &&
        Object.isFrozen(buildWorkflowIntelligenceManifest())
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "workflow-intelligence-public-api-exported",
      name: "Public API Exported",
      status: WorkflowIntelligencePublicApis.length === 3 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "workflow-intelligence-ops-2-dependency-exists",
      name: "OPS-2 Public Dependency Exists",
      status:
        buildWorkflowIntelligenceManifest().dependencies.some(
          (dependency) => dependency.dependencyPhase === ExecutiveTaskIntelligencePublicIndexId,
        )
          ? "PASS"
          : "FAIL",
    }),
  ] as const);

export const validateWorkflowIntelligenceFoundation = () => {
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
