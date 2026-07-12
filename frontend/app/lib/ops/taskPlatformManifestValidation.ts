import { getTaskValidationStatus } from "./taskValidationIndex.ts";
import { buildTaskPlatformManifest } from "./taskPlatformManifest.ts";

const buildChecks = () => {
  const manifest = buildTaskPlatformManifest();

  return Object.freeze([
    Object.freeze({
      id: "task-manifest-phases-represented",
      name: "All Prior Phases Represented",
      status:
        manifest.consumedPhases.length === 4 &&
        manifest.consumedPhases.includes("OPS-2:1") &&
        manifest.consumedPhases.includes("OPS-2:2") &&
        manifest.consumedPhases.includes("OPS-2:3") &&
        manifest.consumedPhases.includes("OPS-2:4")
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "task-manifest-public-apis-represented",
      name: "Public APIs Represented",
      status: manifest.publicApiSurface.length >= 13 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "task-manifest-dependencies-consistent",
      name: "Dependencies Consistent",
      status:
        manifest.dependencyMap.length ===
        manifest.dependencyMapMetadata.dependencyCount
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "task-manifest-validation-pass",
      name: "Validation Status PASS",
      status: getTaskValidationStatus() === "PASS" ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "task-manifest-immutable",
      name: "Manifest Immutable",
      status: Object.isFrozen(manifest) ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "task-manifest-deterministic",
      name: "Manifest Deterministic",
      status:
        JSON.stringify(buildTaskPlatformManifest()) ===
        JSON.stringify(buildTaskPlatformManifest())
          ? "PASS"
          : "FAIL",
    }),
  ] as const);
};

export const validateTaskPlatformManifest = () => {
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
