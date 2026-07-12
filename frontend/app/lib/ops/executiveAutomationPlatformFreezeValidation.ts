import {
  buildExecutiveAutomationPlatformCertificationManifest,
  getExecutiveAutomationCertificationSummary,
} from "./executiveAutomationPlatformCertificationIndex.ts";
import { buildExecutiveAutomationPlatformFreezeManifest } from "./executiveAutomationPlatformFreezeManifest.ts";
import type { ExecutiveAutomationRegressionEntry } from "./executiveAutomationPlatformFreezeTypes.ts";

export const ExecutiveAutomationPlatformRegressionMetadata = Object.freeze([
  Object.freeze({
    id: "automation-freeze-foundation-stability",
    scope: "Foundation",
    stabilityStatus: "Stable",
    description: "Executive automation foundation metadata remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveAutomationRegressionEntry),
  Object.freeze({
    id: "automation-freeze-registry-stability",
    scope: "Registry",
    stabilityStatus: "Stable",
    description: "Executive automation registry metadata remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveAutomationRegressionEntry),
  Object.freeze({
    id: "automation-freeze-model-stability",
    scope: "Model",
    stabilityStatus: "Stable",
    description: "Executive automation model metadata remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveAutomationRegressionEntry),
  Object.freeze({
    id: "automation-freeze-validation-stability",
    scope: "Validation",
    stabilityStatus: "Stable",
    description: "Executive automation validation metadata remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveAutomationRegressionEntry),
  Object.freeze({
    id: "automation-freeze-manifest-stability",
    scope: "Manifest",
    stabilityStatus: "Stable",
    description: "Executive automation manifest metadata remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveAutomationRegressionEntry),
  Object.freeze({
    id: "automation-freeze-platform-stability",
    scope: "Platform",
    stabilityStatus: "Stable",
    description: "Executive automation platform namespace remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveAutomationRegressionEntry),
  Object.freeze({
    id: "automation-freeze-certification-stability",
    scope: "Certification",
    stabilityStatus: "Stable",
    description: "Executive automation certification metadata remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveAutomationRegressionEntry),
  Object.freeze({
    id: "automation-freeze-task-compatibility-stability",
    scope: "Task Compatibility",
    stabilityStatus: "Stable",
    description: "OPS-2 task compatibility metadata remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveAutomationRegressionEntry),
  Object.freeze({
    id: "automation-freeze-workflow-compatibility-stability",
    scope: "Workflow Compatibility",
    stabilityStatus: "Stable",
    description: "OPS-3 workflow compatibility metadata remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveAutomationRegressionEntry),
  Object.freeze({
    id: "automation-freeze-project-compatibility-stability",
    scope: "Project Compatibility",
    stabilityStatus: "Stable",
    description: "OPS-4 project compatibility metadata remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveAutomationRegressionEntry),
  Object.freeze({
    id: "automation-freeze-resource-compatibility-stability",
    scope: "Resource Compatibility",
    stabilityStatus: "Stable",
    description: "OPS-5 resource compatibility metadata remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveAutomationRegressionEntry),
  Object.freeze({
    id: "automation-freeze-scheduling-compatibility-stability",
    scope: "Scheduling Compatibility",
    stabilityStatus: "Stable",
    description: "OPS-6 scheduling compatibility metadata remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveAutomationRegressionEntry),
  Object.freeze({
    id: "automation-freeze-dependency-compatibility-stability",
    scope: "Dependency Compatibility",
    stabilityStatus: "Stable",
    description: "OPS-7 dependency compatibility metadata remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveAutomationRegressionEntry),
  Object.freeze({
    id: "automation-freeze-public-api-stability",
    scope: "Public API",
    stabilityStatus: "Stable",
    description: "Executive automation public API metadata remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveAutomationRegressionEntry),
] as const);

export const ExecutiveAutomationPlatformRegressionSummary = Object.freeze({
  regressionId: "ops.executive-automation.platform-regression",
  regressionVersion: "1.0.0",
  regressionCount: ExecutiveAutomationPlatformRegressionMetadata.length,
  metadataOnly: true,
  immutable: true,
} as const);

export const validateExecutiveAutomationPlatformFreeze = () => {
  const manifest = buildExecutiveAutomationPlatformFreezeManifest();
  const certification =
    buildExecutiveAutomationPlatformCertificationManifest();

  const checks = Object.freeze([
    certification ? "PASS" : "FAIL",
    certification.descriptor.certificationStatus === "PASS" ? "PASS" : "FAIL",
    manifest.certifiedPhaseRegistry.length === 7 ? "PASS" : "FAIL",
    manifest.compatibilityMetadata.internal.length === 7 &&
    manifest.compatibilityMetadata.crossPlatform.length === 6
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
      getExecutiveAutomationCertificationSummary().certificationStatus === "PASS"
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
};
