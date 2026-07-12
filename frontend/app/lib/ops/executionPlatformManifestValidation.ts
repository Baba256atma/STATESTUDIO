import { getExecutionValidationStatus } from "./executionValidationIndex.ts";
import { buildExecutionPlatformManifest } from "./executionPlatformManifest.ts";

const buildChecks = () => {
  const manifest = buildExecutionPlatformManifest();

  return Object.freeze([
    Object.freeze({
      id: "manifest-phases-represented",
      name: "All Prior Phases Represented",
      status:
        manifest.consumedPhases.length === 4 &&
        manifest.consumedPhases.includes("OPS-1:1") &&
        manifest.consumedPhases.includes("OPS-1:2") &&
        manifest.consumedPhases.includes("OPS-1:3") &&
        manifest.consumedPhases.includes("OPS-1:4")
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "manifest-public-apis-represented",
      name: "Public APIs Represented",
      status: manifest.publicApiSurface.length >= 13 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "manifest-dependencies-consistent",
      name: "Dependencies Consistent",
      status:
        manifest.dependencyMap.length ===
        manifest.dependencyMapMetadata.dependencyCount
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "manifest-validation-pass",
      name: "Validation Status PASS",
      status: getExecutionValidationStatus() === "PASS" ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "manifest-immutable",
      name: "Manifest Immutable",
      status: Object.isFrozen(manifest) ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "manifest-deterministic",
      name: "Manifest Deterministic",
      status:
        JSON.stringify(buildExecutionPlatformManifest()) ===
        JSON.stringify(buildExecutionPlatformManifest())
          ? "PASS"
          : "FAIL",
    }),
  ] as const);
};

export const validateExecutionPlatformManifest = () => {
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
