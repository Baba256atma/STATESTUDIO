import { getDependencyValidationSummary } from "./dependencyValidationIndex.ts";
import { buildDependencyManifest } from "./dependencyManifest.ts";

const buildChecks = () => {
  const manifest = buildDependencyManifest();

  return Object.freeze([
    Object.freeze({
      id: "dependency-manifest-phases-represented",
      name: "All OPS-7 Phases Represented",
      status:
        manifest.consumedPhases.length === 4 &&
        manifest.consumedPhases.includes("OPS-7:1") &&
        manifest.consumedPhases.includes("OPS-7:2") &&
        manifest.consumedPhases.includes("OPS-7:3") &&
        manifest.consumedPhases.includes("OPS-7:4")
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "dependency-manifest-public-surface-complete",
      name: "Public Surface Complete",
      status: manifest.publicApiSurface.length >= 16 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "dependency-manifest-dependency-map-complete",
      name: "Dependency Map Complete",
      status:
        manifest.dependencyMap.length ===
          manifest.dependencyMapMetadata.dependencyCount &&
        manifest.dependencyMap.filter((entry) => entry.sourcePhaseId === "OPS-7")
          .length === 5
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "dependency-manifest-compatibility-represented",
      name: "Compatibility Represented",
      status:
        manifest.compatibilitySummary.compatibilityStatus === "PASS"
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "dependency-manifest-validation-pass",
      name: "Validation Status PASS",
      status: getDependencyValidationSummary().status === "PASS" ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "dependency-manifest-immutable",
      name: "Manifest Immutable",
      status: Object.isFrozen(manifest) ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "dependency-manifest-deterministic",
      name: "Manifest Deterministic",
      status:
        JSON.stringify(buildDependencyManifest()) ===
        JSON.stringify(buildDependencyManifest())
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "dependency-manifest-metadata-only",
      name: "Metadata-only Compliance",
      status: manifest.metadataOnly ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "dependency-manifest-public-api-integrity",
      name: "Public API Integrity",
      status:
        manifest.publicApiSurfaceMetadata.exportCount ===
        manifest.publicApiSurface.length
          ? "PASS"
          : "FAIL",
    }),
  ] as const);
};

export const validateDependencyManifest = () => {
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
