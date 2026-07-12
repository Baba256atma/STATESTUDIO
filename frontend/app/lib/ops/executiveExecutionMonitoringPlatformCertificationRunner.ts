import { ExecutiveExecutionMonitoringFoundation } from "./executionMonitoringIndex.ts";
import { ExecutiveExecutionMonitoringRegistry } from "./executionMonitoringRegistryIndex.ts";
import { ExecutiveExecutionMonitoringModel } from "./executionMonitoringModelIndex.ts";
import { getExecutionMonitoringValidationSummary } from "./executionMonitoringValidationIndex.ts";
import { buildExecutionMonitoringManifest, validateExecutionMonitoringManifest } from "./executionMonitoringManifestIndex.ts";
import { ExecutiveExecutionMonitoringPlatform, ExecutiveExecutionMonitoringPlatformMetadata } from "./executiveExecutionMonitoringPlatformIndex.ts";
import { buildExecutiveExecutionMonitoringPlatformCertificationManifest } from "./executiveExecutionMonitoringPlatformCertificationManifest.ts";
import { ExecutiveExecutionMonitoringPlatformCertificationRegistry } from "./executiveExecutionMonitoringPlatformCertificationRegistry.ts";
import { ExecutiveExecutionMonitoringPlatformCompatibility } from "./executiveExecutionMonitoringPlatformCompatibility.ts";
import type { ExecutiveExecutionMonitoringCertificationResult, ExecutiveExecutionMonitoringCertificationStatus } from "./executiveExecutionMonitoringPlatformCertificationTypes.ts";

const check = (id: string, name: string, category: ExecutiveExecutionMonitoringCertificationResult["checks"][number]["category"], pass: boolean) => Object.freeze({
  id, name, category, status: (pass ? "PASS" : "FAIL") as ExecutiveExecutionMonitoringCertificationStatus, metadataOnly: true,
});

const buildChecks = () => {
  const certificationManifest = buildExecutiveExecutionMonitoringPlatformCertificationManifest();
  const platformManifest = buildExecutionMonitoringManifest();
  return Object.freeze([
    check("ops-9-7-foundation-available", "Foundation Available", "Foundation", Boolean(ExecutiveExecutionMonitoringFoundation)),
    check("ops-9-7-registry-available", "Registry Available", "Registry", ExecutiveExecutionMonitoringRegistry.targets.length > 0),
    check("ops-9-7-model-available", "Model Available", "Model", ExecutiveExecutionMonitoringModel.targets.length > 0),
    check("ops-9-7-validation-available", "Validation Available", "Validation", getExecutionMonitoringValidationSummary().status === "PASS"),
    check("ops-9-7-manifest-available", "Manifest Available", "Manifest", validateExecutionMonitoringManifest().status === "PASS"),
    check("ops-9-7-platform-available", "Platform Available", "Platform", Boolean(ExecutiveExecutionMonitoringPlatform)),
    check("ops-9-7-namespace-integrity", "Namespace Integrity", "Namespace", ["foundation", "registry", "model", "validation", "manifest", "metadata"].every((key) => key in ExecutiveExecutionMonitoringPlatform)),
    check("ops-9-7-metadata-integrity", "Metadata Integrity", "Metadata", ExecutiveExecutionMonitoringPlatformMetadata.metadataOnly && certificationManifest.metadataOnly && platformManifest.metadataOnly),
    check("ops-9-7-registry-integrity", "Registry Integrity", "Registry", ExecutiveExecutionMonitoringPlatformCertificationRegistry.certifiedPhases.length === 6),
    check("ops-9-7-compatibility-integrity", "Compatibility Integrity", "Compatibility", ExecutiveExecutionMonitoringPlatformCompatibility.internal.length === 6 && ExecutiveExecutionMonitoringPlatformCompatibility.crossPlatform.length === 7),
    check("ops-9-7-public-api-completeness", "Public API Completeness", "PublicApi", platformManifest.publicApiSurface.length >= 29),
    check("ops-9-7-deterministic-output", "Deterministic Output", "Determinism", JSON.stringify(buildExecutiveExecutionMonitoringPlatformCertificationManifest()) === JSON.stringify(buildExecutiveExecutionMonitoringPlatformCertificationManifest())),
    check("ops-9-7-immutable-structures", "Immutable Structures", "Immutability", Object.isFrozen(ExecutiveExecutionMonitoringPlatform) && Object.isFrozen(certificationManifest) && Object.isFrozen(ExecutiveExecutionMonitoringPlatformCertificationRegistry)),
    check("ops-9-7-metadata-only-compliance", "Metadata-only Compliance", "Compliance", ExecutiveExecutionMonitoringPlatform.metadataOnly && certificationManifest.metadataOnly && platformManifest.metadataOnly),
    check("ops-9-7-release-readiness", "Release Readiness", "ReleaseReadiness", certificationManifest.releaseReadiness.status === "Ready"),
  ] as const);
};

export const runExecutiveExecutionMonitoringPlatformCertification = () => {
  const checks = buildChecks();
  const passedChecks = checks.filter((item) => item.status === "PASS").length;
  const failedChecks = checks.length - passedChecks;
  return Object.freeze({ totalChecks: checks.length, passedChecks, failedChecks,
    status: (failedChecks === 0 ? "PASS" : "FAIL") as ExecutiveExecutionMonitoringCertificationStatus,
    checks, metadataOnly: true, immutable: true, deterministic: true,
  } as const satisfies ExecutiveExecutionMonitoringCertificationResult);
};
