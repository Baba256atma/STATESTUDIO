import { getProjectValidationStatus } from "./projectValidationIndex.ts";
import { buildProjectPlatformManifest } from "./projectPlatformManifest.ts";

const buildChecks = () => {
  const manifest = buildProjectPlatformManifest();

  return Object.freeze([
    Object.freeze({
      id: "project-manifest-phases-represented",
      name: "All Prior OPS-4 Phases Represented",
      status:
        manifest.consumedPhases.length === 4 &&
        manifest.consumedPhases.includes("OPS-4:1") &&
        manifest.consumedPhases.includes("OPS-4:2") &&
        manifest.consumedPhases.includes("OPS-4:3") &&
        manifest.consumedPhases.includes("OPS-4:4")
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "project-manifest-public-apis-represented",
      name: "Public APIs Represented",
      status: manifest.publicApiSurface.length >= 13 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "project-manifest-dependencies-consistent",
      name: "Dependencies Consistent",
      status:
        manifest.dependencyMap.length ===
        manifest.dependencyMapMetadata.dependencyCount
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "project-manifest-workflow-compatibility-represented",
      name: "Workflow Compatibility Represented",
      status:
        manifest.workflowCompatibilitySummary.compatibilityStatus === "PASS"
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "project-manifest-task-compatibility-represented",
      name: "Task Compatibility Represented",
      status:
        manifest.taskCompatibilitySummary.compatibilityStatus === "PASS"
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "project-manifest-validation-pass",
      name: "Validation Status PASS",
      status: getProjectValidationStatus() === "PASS" ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "project-manifest-immutable",
      name: "Manifest Immutable",
      status: Object.isFrozen(manifest) ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "project-manifest-deterministic",
      name: "Manifest Deterministic",
      status:
        JSON.stringify(buildProjectPlatformManifest()) ===
        JSON.stringify(buildProjectPlatformManifest())
          ? "PASS"
          : "FAIL",
    }),
  ] as const);
};

export const validateProjectPlatformManifest = () => {
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

