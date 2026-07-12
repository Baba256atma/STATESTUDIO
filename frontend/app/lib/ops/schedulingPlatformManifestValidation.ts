import { getSchedulingValidationStatus } from "./schedulingValidationIndex.ts";
import { buildSchedulingPlatformManifest } from "./schedulingPlatformManifest.ts";

const buildChecks = () => {
  const manifest = buildSchedulingPlatformManifest();

  return Object.freeze([
    Object.freeze({
      id: "scheduling-manifest-phases-represented",
      name: "All Prior OPS-6 Phases Represented",
      status:
        manifest.consumedPhases.length === 4 &&
        manifest.consumedPhases.includes("OPS-6:1") &&
        manifest.consumedPhases.includes("OPS-6:2") &&
        manifest.consumedPhases.includes("OPS-6:3") &&
        manifest.consumedPhases.includes("OPS-6:4")
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-manifest-public-apis-represented",
      name: "Public APIs Represented",
      status: manifest.publicApiSurface.length >= 13 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-manifest-dependencies-consistent",
      name: "Dependencies Consistent",
      status:
        manifest.dependencyMap.length ===
        manifest.dependencyMapMetadata.dependencyCount
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-manifest-task-compatibility-represented",
      name: "Task Compatibility Represented",
      status:
        manifest.taskCompatibilitySummary.compatibilityStatus === "PASS"
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-manifest-workflow-compatibility-represented",
      name: "Workflow Compatibility Represented",
      status:
        manifest.workflowCompatibilitySummary.compatibilityStatus === "PASS"
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-manifest-project-compatibility-represented",
      name: "Project Compatibility Represented",
      status:
        manifest.projectCompatibilitySummary.compatibilityStatus === "PASS"
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-manifest-resource-compatibility-represented",
      name: "Resource Compatibility Represented",
      status:
        manifest.resourceCompatibilitySummary.compatibilityStatus === "PASS"
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-manifest-validation-pass",
      name: "Validation Status PASS",
      status: getSchedulingValidationStatus() === "PASS" ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-manifest-immutable",
      name: "Manifest Immutable",
      status: Object.isFrozen(manifest) ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "scheduling-manifest-deterministic",
      name: "Manifest Deterministic",
      status:
        JSON.stringify(buildSchedulingPlatformManifest()) ===
        JSON.stringify(buildSchedulingPlatformManifest())
          ? "PASS"
          : "FAIL",
    }),
  ] as const);
};

export const validateSchedulingPlatformManifest = () => {
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
