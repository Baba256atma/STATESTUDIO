import { getWorkflowValidationStatus } from "./workflowValidationIndex.ts";
import { buildWorkflowPlatformManifest } from "./workflowPlatformManifest.ts";

const buildChecks = () => {
  const manifest = buildWorkflowPlatformManifest();

  return Object.freeze([
    Object.freeze({
      id: "workflow-manifest-phases-represented",
      name: "All Prior OPS-3 Phases Represented",
      status:
        manifest.consumedPhases.length === 4 &&
        manifest.consumedPhases.includes("OPS-3:1") &&
        manifest.consumedPhases.includes("OPS-3:2") &&
        manifest.consumedPhases.includes("OPS-3:3") &&
        manifest.consumedPhases.includes("OPS-3:4")
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "workflow-manifest-public-apis-represented",
      name: "Public APIs Represented",
      status: manifest.publicApiSurface.length >= 13 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "workflow-manifest-dependencies-consistent",
      name: "Dependencies Consistent",
      status:
        manifest.dependencyMap.length ===
        manifest.dependencyMapMetadata.dependencyCount
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "workflow-manifest-ops2-task-dependency-represented",
      name: "OPS-2 Task Dependency Represented",
      status: manifest.taskCompatibilitySummary.ops2DependencyRepresented ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "workflow-manifest-validation-pass",
      name: "Validation Status PASS",
      status: getWorkflowValidationStatus() === "PASS" ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "workflow-manifest-immutable",
      name: "Manifest Immutable",
      status: Object.isFrozen(manifest) ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "workflow-manifest-deterministic",
      name: "Manifest Deterministic",
      status:
        JSON.stringify(buildWorkflowPlatformManifest()) ===
        JSON.stringify(buildWorkflowPlatformManifest())
          ? "PASS"
          : "FAIL",
    }),
  ] as const);
};

export const validateWorkflowPlatformManifest = () => {
  const checks = buildChecks();
  const passedChecks = checks.filter((check) => check.status === "PASS").length;
  const failedChecks = checks.length - passedChecks;

  return Object.freeze({
    checks,
    totalChecks: checks.length,
    passedChecks,
    failedChecks,
    status: failedChecks === 0 ? "PASS" : "FAIL",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
};
