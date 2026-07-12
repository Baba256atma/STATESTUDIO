import { buildExecutiveExecutionMonitoringPlatformCertificationManifest, getExecutiveExecutionMonitoringCertificationSummary } from "./executiveExecutionMonitoringPlatformCertificationIndex.ts";
import { buildExecutiveExecutionMonitoringPlatformFreezeManifest } from "./executiveExecutionMonitoringPlatformFreezeManifest.ts";
import type { ExecutiveExecutionMonitoringRegressionEntry } from "./executiveExecutionMonitoringPlatformFreezeTypes.ts";

const scopes = ["Foundation", "Registry", "Model", "Validation", "Manifest", "Platform", "Certification", "Task Compatibility", "Workflow Compatibility", "Project Compatibility", "Resource Compatibility", "Scheduling Compatibility", "Dependency Compatibility", "Automation Compatibility", "Public API"] as const;
export const ExecutiveExecutionMonitoringPlatformRegressionMetadata = Object.freeze(scopes.map((scope) => Object.freeze({
  id: `execution-monitoring-freeze-${scope.toLowerCase().replace(/ /g, "-")}-stability`, scope,
  stabilityStatus: "Stable", description: `${scope} metadata remains stable for the frozen monitoring platform.`, metadataOnly: true,
} as const satisfies ExecutiveExecutionMonitoringRegressionEntry)));
export const ExecutiveExecutionMonitoringPlatformRegressionSummary = Object.freeze({
  regressionId: "ops.executive-execution-monitoring.platform-regression", regressionVersion: "1.0.0",
  regressionCount: ExecutiveExecutionMonitoringPlatformRegressionMetadata.length,
  metadataOnly: true, immutable: true,
} as const);

export const validateExecutiveExecutionMonitoringPlatformFreeze = () => {
  const manifest = buildExecutiveExecutionMonitoringPlatformFreezeManifest();
  const certification = buildExecutiveExecutionMonitoringPlatformCertificationManifest();
  const checks = Object.freeze([
    Boolean(certification), certification.descriptor.certificationStatus === "PASS",
    manifest.certifiedPhaseRegistry.length === 7,
    manifest.compatibilityMetadata.internal.length === 7 && manifest.compatibilityMetadata.crossPlatform.length === 7,
    manifest.freezeIdentity.freezeStatus === "Frozen",
    JSON.stringify(manifest) === JSON.stringify(buildExecutiveExecutionMonitoringPlatformFreezeManifest()),
    Object.isFrozen(manifest), manifest.metadataOnly, manifest.releaseReadinessState === "Ready",
  ]);
  const passedChecks = checks.filter(Boolean).length;
  return Object.freeze({ totalChecks: checks.length, passedChecks, failedChecks: checks.length - passedChecks,
    status: checks.every(Boolean) && getExecutiveExecutionMonitoringCertificationSummary().certificationStatus === "PASS" ? "PASS" : "FAIL",
    metadataOnly: true, immutable: true, deterministic: true,
  } as const);
};
