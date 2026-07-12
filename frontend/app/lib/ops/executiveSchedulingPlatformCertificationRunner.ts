import {
  ExecutiveSchedulingPlatform,
  ExecutiveSchedulingPlatformPublicRegistry,
  ExecutiveSchedulingPlatformReleaseSummary,
  validateSchedulingPlatformIndex,
} from "./schedulingPlatformIndex.ts";
import {
  buildSchedulingPlatformManifest,
  validateSchedulingPlatformManifest,
} from "./schedulingPlatformManifestIndex.ts";
import {
  SchedulingCapabilityRegistry,
  SchedulingPlatformMetadata,
} from "./schedulingMetadataIndex.ts";
import { ScheduleIdentityModel } from "./schedulingModelIndex.ts";
import { ExecutiveSchedulingIntelligenceFoundation } from "./schedulingIntelligenceIndex.ts";
import { getSchedulingValidationSummary } from "./schedulingValidationIndex.ts";
import { buildExecutiveSchedulingPlatformCertificationManifest } from "./executiveSchedulingPlatformCertificationManifest.ts";
import { ExecutiveSchedulingPlatformCertificationRegistry } from "./executiveSchedulingPlatformCertificationRegistry.ts";
import { ExecutiveSchedulingPlatformCompatibility } from "./executiveSchedulingPlatformCompatibility.ts";
import type {
  ExecutiveSchedulingPlatformCertificationEntry,
  ExecutiveSchedulingPlatformCertificationResult,
} from "./executiveSchedulingPlatformCertificationTypes.ts";

const buildChecks = () => {
  const certificationManifest =
    buildExecutiveSchedulingPlatformCertificationManifest();
  const platformManifest = buildSchedulingPlatformManifest();

  return Object.freeze([
    Object.freeze({
      id: "ops-6-7-foundation-available",
      name: "Foundation Available",
      category: "Foundation",
      status: ExecutiveSchedulingIntelligenceFoundation ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveSchedulingPlatformCertificationEntry),
    Object.freeze({
      id: "ops-6-7-registry-available",
      name: "Registry Available",
      category: "Registry",
      status: SchedulingCapabilityRegistry.length > 0 ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveSchedulingPlatformCertificationEntry),
    Object.freeze({
      id: "ops-6-7-model-available",
      name: "Model Available",
      category: "Model",
      status:
        ScheduleIdentityModel.supportedCategories.length > 0 ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveSchedulingPlatformCertificationEntry),
    Object.freeze({
      id: "ops-6-7-validation-available",
      name: "Validation Available",
      category: "Validation",
      status: getSchedulingValidationSummary().status === "PASS" ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveSchedulingPlatformCertificationEntry),
    Object.freeze({
      id: "ops-6-7-manifest-available",
      name: "Manifest Available",
      category: "Manifest",
      status: validateSchedulingPlatformManifest().status === "PASS" ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveSchedulingPlatformCertificationEntry),
    Object.freeze({
      id: "ops-6-7-platform-available",
      name: "Platform Available",
      category: "Platform",
      status: validateSchedulingPlatformIndex().status === "PASS" ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveSchedulingPlatformCertificationEntry),
    Object.freeze({
      id: "ops-6-7-namespace-integrity",
      name: "Namespace Integrity",
      category: "Namespace",
      status:
        "foundation" in ExecutiveSchedulingPlatform &&
        "metadata" in ExecutiveSchedulingPlatform &&
        "model" in ExecutiveSchedulingPlatform &&
        "validation" in ExecutiveSchedulingPlatform &&
        "manifest" in ExecutiveSchedulingPlatform &&
        "publicIndex" in ExecutiveSchedulingPlatform
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveSchedulingPlatformCertificationEntry),
    Object.freeze({
      id: "ops-6-7-metadata-integrity",
      name: "Metadata Integrity",
      category: "Metadata",
      status:
        SchedulingPlatformMetadata.metadataOnly &&
        certificationManifest.metadataOnly &&
        platformManifest.metadataOnly
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveSchedulingPlatformCertificationEntry),
    Object.freeze({
      id: "ops-6-7-registry-integrity",
      name: "Registry Integrity",
      category: "Registry",
      status:
        ExecutiveSchedulingPlatformCertificationRegistry.certifiedPhases.length === 6
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveSchedulingPlatformCertificationEntry),
    Object.freeze({
      id: "ops-6-7-public-api-completeness",
      name: "Public API Completeness",
      category: "PublicApi",
      status:
        ExecutiveSchedulingPlatformPublicRegistry.totalExportCount >= 22
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveSchedulingPlatformCertificationEntry),
    Object.freeze({
      id: "ops-6-7-compatibility-integrity",
      name: "Compatibility Integrity",
      category: "Compatibility",
      status:
        ExecutiveSchedulingPlatformCompatibility.internal.length === 6 &&
        ExecutiveSchedulingPlatformCompatibility.crossPlatform.length === 4
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveSchedulingPlatformCertificationEntry),
    Object.freeze({
      id: "ops-6-7-deterministic-output",
      name: "Deterministic Output",
      category: "Determinism",
      status:
        JSON.stringify(buildExecutiveSchedulingPlatformCertificationManifest()) ===
        JSON.stringify(buildExecutiveSchedulingPlatformCertificationManifest())
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveSchedulingPlatformCertificationEntry),
    Object.freeze({
      id: "ops-6-7-immutable-objects",
      name: "Immutable Objects",
      category: "Immutability",
      status:
        Object.isFrozen(ExecutiveSchedulingPlatform) &&
        Object.isFrozen(certificationManifest) &&
        Object.isFrozen(ExecutiveSchedulingPlatformCertificationRegistry)
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveSchedulingPlatformCertificationEntry),
    Object.freeze({
      id: "ops-6-7-metadata-only-compliance",
      name: "Metadata-only Compliance",
      category: "Compliance",
      status:
        ExecutiveSchedulingPlatform.metadataOnly &&
        certificationManifest.metadataOnly &&
        platformManifest.metadataOnly
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveSchedulingPlatformCertificationEntry),
    Object.freeze({
      id: "ops-6-7-release-readiness",
      name: "Release Readiness",
      category: "ReleaseReadiness",
      status:
        ExecutiveSchedulingPlatformReleaseSummary.releaseReadiness === "Ready"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveSchedulingPlatformCertificationEntry),
  ] as const);
};

export const runExecutiveSchedulingPlatformCertification = () => {
  const checks = buildChecks();
  const passedChecks = checks.filter((check) => check.status === "PASS").length;
  const failedChecks = checks.length - passedChecks;

  return Object.freeze({
    totalChecks: checks.length,
    passedChecks,
    failedChecks,
    status: failedChecks === 0 ? "PASS" : "FAIL",
    checks,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const satisfies ExecutiveSchedulingPlatformCertificationResult);
};
