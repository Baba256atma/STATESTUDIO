import { ExecutiveExecutionMonitoringFoundation, ExecutionMonitoringRegistry } from "./executionMonitoringIndex.ts";
import { ExecutiveExecutionMonitoringRegistry } from "./executionMonitoringRegistryIndex.ts";
import { ExecutiveExecutionMonitoringModel } from "./executionMonitoringModelIndex.ts";
import { getExecutionMonitoringValidationSummary } from "./executionMonitoringValidationIndex.ts";
import { buildExecutionMonitoringManifest } from "./executionMonitoringManifestIndex.ts";
import { ExecutiveExecutionMonitoringPlatform, ExecutiveExecutionMonitoringPlatformRelease } from "./executiveExecutionMonitoringPlatformIndex.ts";
import { ExecutiveExecutionMonitoringPlatformCertificationRegistry, certifyExecutiveExecutionMonitoringPlatform } from "./executiveExecutionMonitoringPlatformCertificationIndex.ts";
import { ExecutiveExecutionMonitoringPlatformFreezeCompatibility } from "./executiveExecutionMonitoringPlatformFreezeCompatibility.ts";
import { buildExecutiveExecutionMonitoringPlatformFreezeManifest } from "./executiveExecutionMonitoringPlatformFreezeManifest.ts";
import { ExecutiveExecutionMonitoringPlatformCertifiedPhaseRegistry, ExecutiveExecutionMonitoringPlatformFreezeRegistry } from "./executiveExecutionMonitoringPlatformFreezeRegistry.ts";
import { ExecutiveExecutionMonitoringPlatformRegressionMetadata, validateExecutiveExecutionMonitoringPlatformFreeze } from "./executiveExecutionMonitoringPlatformFreezeValidation.ts";
import type { ExecutiveExecutionMonitoringFreezeCategory, ExecutiveExecutionMonitoringFreezeEntry, ExecutiveExecutionMonitoringFreezeResult, ExecutiveExecutionMonitoringFreezeStatus, ExecutiveExecutionMonitoringFreezeSummary } from "./executiveExecutionMonitoringPlatformFreezeTypes.ts";

const entry = (id: string, name: string, category: ExecutiveExecutionMonitoringFreezeCategory, pass: boolean) => Object.freeze({
  id, name, description: `Verifies ${name.toLowerCase()} for the frozen execution monitoring architecture.`, category,
  status: (pass ? "PASS" : "FAIL") as ExecutiveExecutionMonitoringFreezeStatus, metadataOnly: true,
} as const satisfies ExecutiveExecutionMonitoringFreezeEntry);

const buildFreezeChecks = () => {
  const freezeManifest = buildExecutiveExecutionMonitoringPlatformFreezeManifest();
  return Object.freeze([
    entry("monitoring-freeze-foundation", "Foundation Available", "Foundation", Boolean(ExecutiveExecutionMonitoringFoundation)),
    entry("monitoring-freeze-registry", "Registry Complete", "Registry", ExecutionMonitoringRegistry.platformId === "OPS-9:1" && ExecutiveExecutionMonitoringRegistry.targets.length > 0),
    entry("monitoring-freeze-model", "Model Complete", "Model", ExecutiveExecutionMonitoringModel.targets.length > 0),
    entry("monitoring-freeze-validation", "Validation Complete", "Validation", getExecutionMonitoringValidationSummary().status === "PASS"),
    entry("monitoring-freeze-manifest", "Manifest Complete", "Manifest", buildExecutionMonitoringManifest().releaseReadinessMetadata.readinessState === "Ready"),
    entry("monitoring-freeze-platform", "Platform Complete", "Platform", ["foundation", "registry", "model", "validation", "manifest", "metadata"].every((key) => key in ExecutiveExecutionMonitoringPlatform)),
    entry("monitoring-freeze-certification", "Certification PASS", "Certification", certifyExecutiveExecutionMonitoringPlatform() === "PASS" && ExecutiveExecutionMonitoringPlatformCertificationRegistry.certificationStatus === "PASS"),
    entry("monitoring-freeze-registry-valid", "Freeze Registry Valid", "Registry", ExecutiveExecutionMonitoringPlatformFreezeRegistry.freezeStatus === "Frozen" && ExecutiveExecutionMonitoringPlatformCertifiedPhaseRegistry.length === 7),
    entry("monitoring-freeze-compatibility", "Freeze Compatibility Valid", "Compatibility", ExecutiveExecutionMonitoringPlatformFreezeCompatibility.internal.length === 7 && ExecutiveExecutionMonitoringPlatformFreezeCompatibility.crossPlatform.length === 7),
    entry("monitoring-freeze-manifest-valid", "Freeze Manifest Valid", "Manifest", Object.isFrozen(freezeManifest)),
    entry("monitoring-freeze-validation-pass", "Validation PASS", "Validation", validateExecutiveExecutionMonitoringPlatformFreeze().status === "PASS"),
    entry("monitoring-freeze-public-api", "Public API Integrity", "PublicApi", ExecutiveExecutionMonitoringPlatformRelease.publicApiStatus === "Stable" && freezeManifest.publicApiFreezeStatus === "Frozen"),
    entry("monitoring-freeze-determinism", "Deterministic Outputs", "Determinism", JSON.stringify(freezeManifest) === JSON.stringify(buildExecutiveExecutionMonitoringPlatformFreezeManifest())),
    entry("monitoring-freeze-immutability", "Immutable Structures", "Immutability", Object.isFrozen(freezeManifest) && Object.isFrozen(ExecutiveExecutionMonitoringPlatformFreezeRegistry) && Object.isFrozen(ExecutiveExecutionMonitoringPlatformRegressionMetadata)),
    entry("monitoring-freeze-compliance", "Metadata-only Compliance", "Compliance", freezeManifest.metadataOnly),
    entry("monitoring-freeze-extension", "Extension Policy Present", "ExtensionPolicy", freezeManifest.extensionPolicy.status === "Locked"),
    entry("monitoring-freeze-regression", "Regression Summary Present", "Regression", ExecutiveExecutionMonitoringPlatformRegressionMetadata.length === 15),
    entry("monitoring-freeze-readiness", "Release Readiness PASS", "ReleaseReadiness", freezeManifest.releaseReadinessState === "Ready"),
    entry("monitoring-freeze-status", "Freeze Status PASS", "Freeze", freezeManifest.freezeIdentity.freezeStatus === "Frozen"),
  ] as const);
};

export const runExecutiveExecutionMonitoringPlatformFreeze = () => {
  const freezeEntries = buildFreezeChecks();
  const passed = freezeEntries.filter((item) => item.status === "PASS").length;
  const failed = freezeEntries.length - passed;
  return Object.freeze({ totalChecks: freezeEntries.length, passed, failed, freezeEntries,
    overallFreezeStatus: (failed === 0 ? "PASS" : "FAIL") as ExecutiveExecutionMonitoringFreezeStatus,
    metadataOnly: true, immutable: true, deterministic: true,
  } as const satisfies ExecutiveExecutionMonitoringFreezeResult);
};
export const getExecutiveExecutionMonitoringPlatformFreezeSummary = () => {
  const result = runExecutiveExecutionMonitoringPlatformFreeze();
  return Object.freeze({ totalChecks: result.totalChecks, passed: result.passed, failed: result.failed,
    overallFreezeStatus: result.overallFreezeStatus, metadataOnly: true, immutable: true, deterministic: true,
  } as const satisfies ExecutiveExecutionMonitoringFreezeSummary);
};
export const getExecutiveExecutionMonitoringPlatformFreezeStatus = () => runExecutiveExecutionMonitoringPlatformFreeze().overallFreezeStatus;
