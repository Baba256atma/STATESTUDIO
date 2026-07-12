import { getAutomationValidationSummary } from "./automationValidationIndex.ts";
import { buildAutomationManifest } from "./automationManifest.ts";

const buildChecks = () => {
  const manifest = buildAutomationManifest();

  return Object.freeze([
    Object.freeze({
      id: "automation-manifest-phases-represented",
      name: "All OPS-8 Phases Represented",
      status:
        manifest.consumedPhases.length === 4 &&
        manifest.consumedPhases.includes("OPS-8:1") &&
        manifest.consumedPhases.includes("OPS-8:2") &&
        manifest.consumedPhases.includes("OPS-8:3") &&
        manifest.consumedPhases.includes("OPS-8:4")
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "automation-manifest-public-surface-complete",
      name: "Public Surface Complete",
      status: manifest.publicApiSurface.length >= 27 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "automation-manifest-dependency-map-complete",
      name: "Dependency Map Complete",
      status:
        manifest.dependencyMap.length === manifest.dependencyMapMetadata.dependencyCount &&
        manifest.dependencyMap.filter((entry) => entry.sourcePhaseId === "OPS-8")
          .length === 6
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "automation-manifest-compatibility-represented",
      name: "Compatibility Represented",
      status:
        manifest.compatibilitySummary.compatibilityStatus === "PASS"
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "automation-manifest-validation-pass",
      name: "Validation Status PASS",
      status: getAutomationValidationSummary().status === "PASS" ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "automation-manifest-immutable",
      name: "Manifest Immutable",
      status: Object.isFrozen(manifest) ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "automation-manifest-deterministic",
      name: "Manifest Deterministic",
      status:
        JSON.stringify(buildAutomationManifest()) ===
        JSON.stringify(buildAutomationManifest())
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "automation-manifest-metadata-only",
      name: "Metadata-only Compliance",
      status: manifest.metadataOnly ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "automation-manifest-public-api-integrity",
      name: "Public API Integrity",
      status:
        manifest.publicApiSurfaceMetadata.exportCount ===
        manifest.publicApiSurface.length
          ? "PASS"
          : "FAIL",
    }),
  ] as const);
};

export const validateAutomationManifest = () => {
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
