import { getExecutionMonitoringValidationSummary } from "./executionMonitoringValidationIndex.ts";
import { buildExecutionMonitoringManifest } from "./executionMonitoringManifest.ts";

const checks = () => {
  const manifest = buildExecutionMonitoringManifest();
  const phaseIds = manifest.consumedPhases;
  return Object.freeze([
    Object.freeze({ id: "execution-monitoring-manifest-phase-registry", name: "Phase Registry Completeness", status: phaseIds.length === 4 && ["OPS-9:1", "OPS-9:2", "OPS-9:3", "OPS-9:4"].every((id) => phaseIds.includes(id as typeof phaseIds[number])) ? "PASS" : "FAIL" }),
    Object.freeze({ id: "execution-monitoring-manifest-dependencies", name: "Dependency Map Completeness", status: manifest.compatibilitySummary.internalDependencyCount === 7 && manifest.compatibilitySummary.crossPlatformCompatibilityCount === 7 ? "PASS" : "FAIL" }),
    Object.freeze({ id: "execution-monitoring-manifest-public-surface", name: "Public Surface Completeness", status: ["OPS-9:1", "OPS-9:2", "OPS-9:3", "OPS-9:4"].every((id) => manifest.publicApiSurface.some((item) => item.phaseId === id)) ? "PASS" : "FAIL" }),
    Object.freeze({ id: "execution-monitoring-manifest-complete", name: "Manifest Completeness", status: manifest.summary.phaseCount === 4 && manifest.modelSummary.policyModelCount > 0 ? "PASS" : "FAIL" }),
    Object.freeze({ id: "execution-monitoring-manifest-metadata", name: "Metadata Completeness", status: manifest.phaseRegistry.every((phase) => phase.metadata.metadataOnly) ? "PASS" : "FAIL" }),
    Object.freeze({ id: "execution-monitoring-manifest-deterministic", name: "Deterministic Outputs", status: JSON.stringify(buildExecutionMonitoringManifest()) === JSON.stringify(buildExecutionMonitoringManifest()) ? "PASS" : "FAIL" }),
    Object.freeze({ id: "execution-monitoring-manifest-immutable", name: "Immutable Structures", status: Object.isFrozen(manifest) && Object.isFrozen(manifest.phaseRegistry) && Object.isFrozen(manifest.dependencyMap) && Object.isFrozen(manifest.publicApiSurface) ? "PASS" : "FAIL" }),
    Object.freeze({ id: "execution-monitoring-manifest-metadata-only", name: "Metadata-only Compliance", status: manifest.metadataOnly && manifest.metadataOnlySummary.metadataOnly ? "PASS" : "FAIL" }),
    Object.freeze({ id: "execution-monitoring-manifest-public-api", name: "Public API Integrity", status: manifest.publicApiSurfaceMetadata.exportCount === manifest.publicApiSurface.length && getExecutionMonitoringValidationSummary().status === "PASS" ? "PASS" : "FAIL" }),
  ] as const);
};

export const validateExecutionMonitoringManifest = () => {
  const validationChecks = checks();
  const passedChecks = validationChecks.filter((check) => check.status === "PASS").length;
  const failedChecks = validationChecks.length - passedChecks;
  return Object.freeze({ checks: validationChecks, totalChecks: validationChecks.length, passedChecks, failedChecks,
    status: failedChecks === 0 ? "PASS" : "FAIL", metadataOnly: true, immutable: true, deterministic: true,
  } as const);
};
