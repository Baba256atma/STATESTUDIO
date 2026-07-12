import { TaskIntelligenceContracts, TaskIntelligencePublicApis } from "./taskIntelligenceContracts.ts";
import { TaskIntelligenceIdentity } from "./taskIntelligenceIdentity.ts";
import { buildTaskIntelligenceManifest } from "./taskIntelligenceManifest.ts";
import { TaskIntelligenceRegistry } from "./taskIntelligenceRegistry.ts";

const buildChecks = () =>
  Object.freeze([
    Object.freeze({
      id: "task-intelligence-identity-exists",
      name: "Identity Exists",
      status: TaskIntelligenceIdentity.platformId === "OPS-2:1" ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "task-intelligence-registry-exists",
      name: "Registry Exists",
      status: TaskIntelligenceRegistry.registeredPhases.length === 1 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "task-intelligence-contracts-exist",
      name: "Contracts Exist",
      status: TaskIntelligenceContracts.all.length === 7 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "task-intelligence-manifest-builds",
      name: "Manifest Builds",
      status: buildTaskIntelligenceManifest().compatibilityVersion === "1.0.0" ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "task-intelligence-metadata-immutable",
      name: "Metadata Immutable",
      status:
        Object.isFrozen(TaskIntelligenceIdentity) &&
        Object.isFrozen(TaskIntelligenceRegistry) &&
        Object.isFrozen(TaskIntelligenceContracts) &&
        Object.isFrozen(buildTaskIntelligenceManifest())
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "task-intelligence-public-api-exported",
      name: "Public API Exported",
      status: TaskIntelligencePublicApis.length === 3 ? "PASS" : "FAIL",
    }),
  ] as const);

export const validateTaskIntelligenceFoundation = () => {
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
