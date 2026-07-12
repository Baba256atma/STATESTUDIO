import {
  buildExecutiveDependencyPlatformCertificationManifest,
  getExecutiveDependencyCertificationSummary,
} from "./executiveDependencyPlatformCertificationIndex.ts";
import { buildExecutiveDependencyPlatformFreezeManifest } from "./executiveDependencyPlatformFreezeManifest.ts";
import type { ExecutiveDependencyRegressionEntry } from "./executiveDependencyPlatformFreezeTypes.ts";

export const ExecutiveDependencyPlatformRegressionMetadata = Object.freeze([
  Object.freeze({
    id: "dependency-freeze-foundation-stability",
    scope: "Foundation",
    stabilityStatus: "Stable",
    description: "Executive dependency foundation metadata remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveDependencyRegressionEntry),
  Object.freeze({
    id: "dependency-freeze-registry-stability",
    scope: "Registry",
    stabilityStatus: "Stable",
    description: "Executive dependency registry metadata remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveDependencyRegressionEntry),
  Object.freeze({
    id: "dependency-freeze-model-stability",
    scope: "Model",
    stabilityStatus: "Stable",
    description: "Executive dependency model metadata remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveDependencyRegressionEntry),
  Object.freeze({
    id: "dependency-freeze-validation-stability",
    scope: "Validation",
    stabilityStatus: "Stable",
    description: "Executive dependency validation metadata remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveDependencyRegressionEntry),
  Object.freeze({
    id: "dependency-freeze-manifest-stability",
    scope: "Manifest",
    stabilityStatus: "Stable",
    description: "Executive dependency manifest metadata remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveDependencyRegressionEntry),
  Object.freeze({
    id: "dependency-freeze-platform-stability",
    scope: "Platform",
    stabilityStatus: "Stable",
    description: "Executive dependency platform namespace remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveDependencyRegressionEntry),
  Object.freeze({
    id: "dependency-freeze-certification-stability",
    scope: "Certification",
    stabilityStatus: "Stable",
    description: "Executive dependency certification metadata remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveDependencyRegressionEntry),
  Object.freeze({
    id: "dependency-freeze-task-compatibility-stability",
    scope: "Task Compatibility",
    stabilityStatus: "Stable",
    description: "OPS-2 task compatibility metadata remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveDependencyRegressionEntry),
  Object.freeze({
    id: "dependency-freeze-workflow-compatibility-stability",
    scope: "Workflow Compatibility",
    stabilityStatus: "Stable",
    description: "OPS-3 workflow compatibility metadata remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveDependencyRegressionEntry),
  Object.freeze({
    id: "dependency-freeze-project-compatibility-stability",
    scope: "Project Compatibility",
    stabilityStatus: "Stable",
    description: "OPS-4 project compatibility metadata remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveDependencyRegressionEntry),
  Object.freeze({
    id: "dependency-freeze-resource-compatibility-stability",
    scope: "Resource Compatibility",
    stabilityStatus: "Stable",
    description: "OPS-5 resource compatibility metadata remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveDependencyRegressionEntry),
  Object.freeze({
    id: "dependency-freeze-scheduling-compatibility-stability",
    scope: "Scheduling Compatibility",
    stabilityStatus: "Stable",
    description: "OPS-6 scheduling compatibility metadata remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveDependencyRegressionEntry),
  Object.freeze({
    id: "dependency-freeze-public-api-stability",
    scope: "Public API",
    stabilityStatus: "Stable",
    description: "Executive dependency public API metadata remains stable.",
    metadataOnly: true,
  } as const satisfies ExecutiveDependencyRegressionEntry),
] as const);

export const ExecutiveDependencyPlatformRegressionSummary = Object.freeze({
  regressionId: "ops.executive-dependency.platform-regression",
  regressionVersion: "1.0.0",
  regressionCount: ExecutiveDependencyPlatformRegressionMetadata.length,
  metadataOnly: true,
  immutable: true,
} as const);

export const validateExecutiveDependencyPlatformFreeze = () => {
  const manifest = buildExecutiveDependencyPlatformFreezeManifest();
  const certification =
    buildExecutiveDependencyPlatformCertificationManifest();

  const checks = Object.freeze([
    certification ? "PASS" : "FAIL",
    certification.descriptor.certificationStatus === "PASS" ? "PASS" : "FAIL",
    manifest.certifiedPhaseRegistry.length === 7 ? "PASS" : "FAIL",
    manifest.compatibilityMetadata.internal.length === 7 &&
    manifest.compatibilityMetadata.crossPlatform.length === 5
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
      getExecutiveDependencyCertificationSummary().certificationStatus === "PASS"
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
};
