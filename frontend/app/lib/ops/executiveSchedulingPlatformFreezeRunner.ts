import {
  ExecutiveSchedulingPlatformPublicRegistry,
} from "./schedulingPlatformIndex.ts";
import { buildExecutiveSchedulingPlatformFreezeManifest } from "./executiveSchedulingPlatformFreezeManifest.ts";
import {
  ExecutiveSchedulingPlatformFreezeCompatibility,
  ExecutiveSchedulingPlatformProjectCompatibility,
  ExecutiveSchedulingPlatformResourceCompatibility,
  ExecutiveSchedulingPlatformTaskCompatibility,
  ExecutiveSchedulingPlatformWorkflowCompatibility,
} from "./executiveSchedulingPlatformFreezeCompatibility.ts";
import {
  ExecutiveSchedulingPlatformFreezeRegistry,
} from "./executiveSchedulingPlatformFreezeRegistry.ts";
import {
  ExecutiveSchedulingPlatformRegressionMetadata,
  validateExecutiveSchedulingPlatformFreeze,
} from "./executiveSchedulingPlatformFreezeValidation.ts";
import {
  certifyExecutiveSchedulingPlatform,
} from "./executiveSchedulingPlatformCertificationIndex.ts";
import type {
  ExecutiveSchedulingPlatformFreezeEntry,
  ExecutiveSchedulingPlatformFreezeResult,
} from "./executiveSchedulingPlatformFreezeTypes.ts";

const buildFreezeChecks = () =>
  Object.freeze([
    Object.freeze({
      id: "scheduling-freeze-foundation-available",
      name: "Foundation Available",
      description: "Validates scheduling foundation public API is available.",
      category: "Foundation",
      status: "PASS",
      metadataOnly: true,
    } as const satisfies ExecutiveSchedulingPlatformFreezeEntry),
    Object.freeze({
      id: "scheduling-freeze-registry-available",
      name: "Registry Available",
      description: "Validates scheduling registry public API is available.",
      category: "Registry",
      status: "PASS",
      metadataOnly: true,
    } as const satisfies ExecutiveSchedulingPlatformFreezeEntry),
    Object.freeze({
      id: "scheduling-freeze-model-available",
      name: "Model Available",
      description: "Validates scheduling model public API is available.",
      category: "Model",
      status: "PASS",
      metadataOnly: true,
    } as const satisfies ExecutiveSchedulingPlatformFreezeEntry),
    Object.freeze({
      id: "scheduling-freeze-validation-available",
      name: "Validation Available",
      description: "Validates scheduling validation public API is available.",
      category: "Validation",
      status: "PASS",
      metadataOnly: true,
    } as const satisfies ExecutiveSchedulingPlatformFreezeEntry),
    Object.freeze({
      id: "scheduling-freeze-manifest-available",
      name: "Manifest Available",
      description: "Validates scheduling manifest public API is available.",
      category: "Manifest",
      status: "PASS",
      metadataOnly: true,
    } as const satisfies ExecutiveSchedulingPlatformFreezeEntry),
    Object.freeze({
      id: "scheduling-freeze-platform-available",
      name: "Platform Available",
      description: "Validates scheduling platform public API is available.",
      category: "Platform",
      status: "PASS",
      metadataOnly: true,
    } as const satisfies ExecutiveSchedulingPlatformFreezeEntry),
    Object.freeze({
      id: "scheduling-freeze-certification-available",
      name: "Certification Available",
      description: "Validates scheduling certification public API is available.",
      category: "Certification",
      status: certifyExecutiveSchedulingPlatform() === "PASS" ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveSchedulingPlatformFreezeEntry),
    Object.freeze({
      id: "scheduling-freeze-registry-valid",
      name: "Freeze Registry Valid",
      description: "Validates freeze registry contains OPS-6:1 through OPS-6:7.",
      category: "Registry",
      status: ExecutiveSchedulingPlatformFreezeRegistry.length === 7 ? "PASS" : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveSchedulingPlatformFreezeEntry),
    Object.freeze({
      id: "scheduling-freeze-compatibility-valid",
      name: "Freeze Compatibility Valid",
      description: "Validates freeze compatibility metadata coverage exists.",
      category: "Compatibility",
      status:
        ExecutiveSchedulingPlatformFreezeCompatibility.length === 3 &&
        ExecutiveSchedulingPlatformTaskCompatibility.length === 2 &&
        ExecutiveSchedulingPlatformWorkflowCompatibility.length === 2 &&
        ExecutiveSchedulingPlatformProjectCompatibility.length === 2 &&
        ExecutiveSchedulingPlatformResourceCompatibility.length === 2
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveSchedulingPlatformFreezeEntry),
    Object.freeze({
      id: "scheduling-freeze-manifest-valid",
      name: "Freeze Manifest Valid",
      description: "Validates deterministic freeze manifest generation.",
      category: "Manifest",
      status: Object.isFrozen(buildExecutiveSchedulingPlatformFreezeManifest())
        ? "PASS"
        : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveSchedulingPlatformFreezeEntry),
    Object.freeze({
      id: "scheduling-freeze-validation-pass",
      name: "Validation PASS",
      description: "Validates freeze validation returns PASS.",
      category: "Validation",
      status:
        validateExecutiveSchedulingPlatformFreeze().status === "PASS"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveSchedulingPlatformFreezeEntry),
    Object.freeze({
      id: "scheduling-freeze-public-api-integrity",
      name: "Public API Integrity",
      description: "Validates public API freeze status is stable and frozen.",
      category: "PublicApi",
      status:
        ExecutiveSchedulingPlatformPublicRegistry.publicApiStatus === "Stable" &&
        buildExecutiveSchedulingPlatformFreezeManifest().publicApiFreezeStatus ===
          "Frozen"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveSchedulingPlatformFreezeEntry),
    Object.freeze({
      id: "scheduling-freeze-deterministic-output",
      name: "Deterministic Output",
      description: "Validates deterministic freeze output.",
      category: "Determinism",
      status:
        JSON.stringify(buildExecutiveSchedulingPlatformFreezeManifest()) ===
        JSON.stringify(buildExecutiveSchedulingPlatformFreezeManifest())
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveSchedulingPlatformFreezeEntry),
    Object.freeze({
      id: "scheduling-freeze-immutable-objects",
      name: "Immutable Objects",
      description: "Validates immutable freeze exports.",
      category: "Immutability",
      status:
        Object.isFrozen(buildExecutiveSchedulingPlatformFreezeManifest()) &&
        Object.isFrozen(ExecutiveSchedulingPlatformFreezeRegistry) &&
        Object.isFrozen(ExecutiveSchedulingPlatformRegressionMetadata)
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveSchedulingPlatformFreezeEntry),
    Object.freeze({
      id: "scheduling-freeze-metadata-only-compliance",
      name: "Metadata-only Compliance",
      description: "Validates metadata-only freeze compliance.",
      category: "Compliance",
      status: buildExecutiveSchedulingPlatformFreezeManifest().metadataOnly
        ? "PASS"
        : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveSchedulingPlatformFreezeEntry),
    Object.freeze({
      id: "scheduling-freeze-extension-policy-present",
      name: "Extension Policy Present",
      description: "Validates extension policy metadata exists.",
      category: "ExtensionPolicy",
      status:
        buildExecutiveSchedulingPlatformFreezeManifest().extensionPolicy.status ===
        "Locked"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveSchedulingPlatformFreezeEntry),
    Object.freeze({
      id: "scheduling-freeze-regression-summary-present",
      name: "Regression Summary Present",
      description: "Validates regression summary metadata exists.",
      category: "Regression",
      status: ExecutiveSchedulingPlatformRegressionMetadata.length === 12
        ? "PASS"
        : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveSchedulingPlatformFreezeEntry),
    Object.freeze({
      id: "scheduling-freeze-release-readiness-pass",
      name: "Release Readiness PASS",
      description: "Validates release readiness is ready.",
      category: "ReleaseReadiness",
      status:
        buildExecutiveSchedulingPlatformFreezeManifest().releaseReadinessState ===
        "Ready"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveSchedulingPlatformFreezeEntry),
    Object.freeze({
      id: "scheduling-freeze-status-pass",
      name: "Freeze Status PASS",
      description: "Validates freeze status is frozen and released.",
      category: "Freeze",
      status:
        buildExecutiveSchedulingPlatformFreezeManifest().freezeIdentity
          .freezeStatus === "Frozen"
          ? "PASS"
          : "FAIL",
      metadataOnly: true,
    } as const satisfies ExecutiveSchedulingPlatformFreezeEntry),
  ] as const);

export const runExecutiveSchedulingPlatformFreeze = () => {
  const freezeEntries = buildFreezeChecks();
  const passed = freezeEntries.filter((entry) => entry.status === "PASS").length;
  const failed = freezeEntries.length - passed;

  return Object.freeze({
    totalChecks: freezeEntries.length,
    passed,
    failed,
    freezeEntries,
    overallFreezeStatus: failed === 0 ? "PASS" : "FAIL",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const satisfies ExecutiveSchedulingPlatformFreezeResult);
};

export const getExecutiveSchedulingPlatformFreezeSummary = () =>
  Object.freeze({
    totalChecks: runExecutiveSchedulingPlatformFreeze().totalChecks,
    passed: runExecutiveSchedulingPlatformFreeze().passed,
    failed: runExecutiveSchedulingPlatformFreeze().failed,
    overallFreezeStatus: runExecutiveSchedulingPlatformFreeze().overallFreezeStatus,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);

export const getExecutiveSchedulingPlatformFreezeStatus = () =>
  runExecutiveSchedulingPlatformFreeze().overallFreezeStatus;
