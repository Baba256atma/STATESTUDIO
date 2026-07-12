import { getResourceValidationStatus } from "./resourceValidationIndex.ts";
import { buildResourcePlatformManifest } from "./resourcePlatformManifest.ts";

const buildChecks = () => {
  const manifest = buildResourcePlatformManifest();

  return Object.freeze([
    Object.freeze({
      id: "resource-manifest-phases-represented",
      name: "All Prior OPS-5 Phases Represented",
      status:
        manifest.consumedPhases.length === 4 &&
        manifest.consumedPhases.includes("OPS-5:1") &&
        manifest.consumedPhases.includes("OPS-5:2") &&
        manifest.consumedPhases.includes("OPS-5:3") &&
        manifest.consumedPhases.includes("OPS-5:4")
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "resource-manifest-public-apis-represented",
      name: "Public APIs Represented",
      status: manifest.publicApiSurface.length >= 13 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "resource-manifest-dependencies-consistent",
      name: "Dependencies Consistent",
      status:
        manifest.dependencyMap.length ===
        manifest.dependencyMapMetadata.dependencyCount
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "resource-manifest-task-compatibility-represented",
      name: "Task Compatibility Represented",
      status:
        manifest.taskCompatibilitySummary.compatibilityStatus === "PASS"
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "resource-manifest-workflow-compatibility-represented",
      name: "Workflow Compatibility Represented",
      status:
        manifest.workflowCompatibilitySummary.compatibilityStatus === "PASS"
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "resource-manifest-project-compatibility-represented",
      name: "Project Compatibility Represented",
      status:
        manifest.projectCompatibilitySummary.compatibilityStatus === "PASS"
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "resource-manifest-validation-pass",
      name: "Validation Status PASS",
      status: getResourceValidationStatus() === "PASS" ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "resource-manifest-immutable",
      name: "Manifest Immutable",
      status: Object.isFrozen(manifest) ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "resource-manifest-deterministic",
      name: "Manifest Deterministic",
      status:
        JSON.stringify(buildResourcePlatformManifest()) ===
        JSON.stringify(buildResourcePlatformManifest())
          ? "PASS"
          : "FAIL",
    }),
  ] as const);
};

export const validateResourcePlatformManifest = () => {
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
