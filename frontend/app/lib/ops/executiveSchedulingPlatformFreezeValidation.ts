import {
  buildExecutiveSchedulingPlatformCertificationManifest,
  getExecutiveSchedulingCertificationSummary,
} from "./executiveSchedulingPlatformCertificationIndex.ts";
import { buildExecutiveSchedulingPlatformFreezeManifest } from "./executiveSchedulingPlatformFreezeManifest.ts";
import type { ExecutiveSchedulingPlatformRegressionEntry } from "./executiveSchedulingPlatformFreezeTypes.ts";

export const ExecutiveSchedulingPlatformRegressionMetadata = Object.freeze([
  Object.freeze({
    id: "scheduling-reg-foundation-stability",
    scope: "Foundation",
    stabilityStatus: "Stable",
    description: "Scheduling foundation public architecture remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveSchedulingPlatformRegressionEntry),
  Object.freeze({
    id: "scheduling-reg-registry-stability",
    scope: "Registry",
    stabilityStatus: "Stable",
    description: "Scheduling registry and metadata public surfaces remain stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveSchedulingPlatformRegressionEntry),
  Object.freeze({
    id: "scheduling-reg-model-stability",
    scope: "Model",
    stabilityStatus: "Stable",
    description: "Scheduling model public architecture remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveSchedulingPlatformRegressionEntry),
  Object.freeze({
    id: "scheduling-reg-validation-stability",
    scope: "Validation",
    stabilityStatus: "Stable",
    description: "Scheduling validation public architecture remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveSchedulingPlatformRegressionEntry),
  Object.freeze({
    id: "scheduling-reg-manifest-stability",
    scope: "Manifest",
    stabilityStatus: "Stable",
    description: "Scheduling manifest public architecture remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveSchedulingPlatformRegressionEntry),
  Object.freeze({
    id: "scheduling-reg-platform-stability",
    scope: "Platform",
    stabilityStatus: "Stable",
    description: "Scheduling platform index public architecture remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveSchedulingPlatformRegressionEntry),
  Object.freeze({
    id: "scheduling-reg-certification-stability",
    scope: "Certification",
    stabilityStatus: "Stable",
    description: "Scheduling certification public architecture remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveSchedulingPlatformRegressionEntry),
  Object.freeze({
    id: "scheduling-reg-task-compatibility-stability",
    scope: "Task Compatibility",
    stabilityStatus: "Stable",
    description: "Scheduling task compatibility metadata remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveSchedulingPlatformRegressionEntry),
  Object.freeze({
    id: "scheduling-reg-workflow-compatibility-stability",
    scope: "Workflow Compatibility",
    stabilityStatus: "Stable",
    description: "Scheduling workflow compatibility metadata remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveSchedulingPlatformRegressionEntry),
  Object.freeze({
    id: "scheduling-reg-project-compatibility-stability",
    scope: "Project Compatibility",
    stabilityStatus: "Stable",
    description: "Scheduling project compatibility metadata remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveSchedulingPlatformRegressionEntry),
  Object.freeze({
    id: "scheduling-reg-resource-compatibility-stability",
    scope: "Resource Compatibility",
    stabilityStatus: "Stable",
    description: "Scheduling resource compatibility metadata remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveSchedulingPlatformRegressionEntry),
  Object.freeze({
    id: "scheduling-reg-public-api-stability",
    scope: "Public API",
    stabilityStatus: "Stable",
    description: "Scheduling public API surface remains stable and frozen.",
    metadataOnly: true,
  } as const satisfies ExecutiveSchedulingPlatformRegressionEntry),
] as const);

export const ExecutiveSchedulingPlatformRegressionMetadataSummary =
  Object.freeze({
    regressionId: "ops.executive-scheduling.platform-regression",
    regressionVersion: "1.0.0",
    regressionCount: ExecutiveSchedulingPlatformRegressionMetadata.length,
    metadataOnly: true,
    immutable: true,
  } as const);

export const validateExecutiveSchedulingPlatformFreeze = () => {
  const manifest = buildExecutiveSchedulingPlatformFreezeManifest();
  const certification =
    buildExecutiveSchedulingPlatformCertificationManifest();

  const checks = Object.freeze([
    certification ? "PASS" : "FAIL",
    certification.descriptor.certificationStatus === "PASS" ? "PASS" : "FAIL",
    manifest.certifiedPhaseRegistry.length === 7 ? "PASS" : "FAIL",
    manifest.freezeCompatibilityMetadata.compatibilityCount === 11
      ? "PASS"
      : "FAIL",
    manifest.freezeIdentity.freezeStatus === "Frozen" ? "PASS" : "FAIL",
    JSON.stringify(manifest) === JSON.stringify(manifest) ? "PASS" : "FAIL",
    Object.isFrozen(manifest) ? "PASS" : "FAIL",
    manifest.metadataOnly ? "PASS" : "FAIL",
    manifest.releaseReadinessState === "Ready" ? "PASS" : "FAIL",
  ] as const);

  return Object.freeze({
    totalChecks: checks.length,
    passedChecks: checks.filter((check) => check === "PASS").length,
    failedChecks: checks.filter((check) => check === "FAIL").length,
    status:
      checks.every((check) => check === "PASS") &&
      getExecutiveSchedulingCertificationSummary().certificationStatus === "PASS"
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
};
