/**
 * SMM-8 — Platform certification validation.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { getSharedMentalModelPlatformCompatibilityMatrix } from "./sharedMentalModelPlatformCompatibility.ts";
import {
  getSharedMentalModelCertifiedPhaseRegistrations,
  getSharedMentalModelPlatformRegistry,
  SMM_CERTIFIED_MVP_PHASE_KEYS,
  SMM_EXTENSION_POLICY,
  SMM_PLATFORM_FREEZE_PRINCIPLES,
} from "./sharedMentalModelPlatformFreezeRegistry.ts";
import type {
  SharedMentalModelPlatformCertificationCheck,
  SharedMentalModelPlatformCertificationResult,
} from "./sharedMentalModelPlatformFreezeTypes.ts";
import { buildSharedMentalModelPlatformManifest, validateSharedMentalModelPlatformManifest } from "./sharedMentalModelPlatformManifest.ts";
import { runSharedMentalModelPlatformRegression } from "./sharedMentalModelPlatformRegression.ts";

const SMM_LIBRARY_DIR = dirname(fileURLToPath(import.meta.url));

function check(id: string, title: string, passed: boolean, evidence: string): SharedMentalModelPlatformCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function verifyPlatformIdentity(): SharedMentalModelPlatformCertificationCheck {
  const registry = getSharedMentalModelPlatformRegistry();
  return check(
    "platform_identity",
    "Platform identity is registered",
    registry.platformId === "smm-platform" && registry.platformName.length > 0,
    `${registry.platformId}:${registry.platformName}`
  );
}

function verifyRequiredPhasesExist(): SharedMentalModelPlatformCertificationCheck {
  const phases = getSharedMentalModelCertifiedPhaseRegistrations();
  return check(
    "required_phases_exist",
    "All required MVP phases are registered",
    phases.length === SMM_CERTIFIED_MVP_PHASE_KEYS.length,
    `${phases.length}/${SMM_CERTIFIED_MVP_PHASE_KEYS.length} phases`
  );
}

function verifyRegistryIntegrity(): SharedMentalModelPlatformCertificationCheck {
  const registry = getSharedMentalModelPlatformRegistry();
  return check(
    "registry_integrity",
    "Platform registry integrity",
    registry.phaseCount === 7 && registry.publicApis.length > 0 && registry.extensionPoints.length > 0,
    `phases=${registry.phaseCount}, apis=${registry.publicApis.length}, extensions=${registry.extensionPoints.length}`
  );
}

function verifyCompatibilityMatrix(): SharedMentalModelPlatformCertificationCheck {
  const matrix = getSharedMentalModelPlatformCompatibilityMatrix();
  return check(
    "compatibility_matrix",
    "Compatibility matrix is valid",
    matrix.validationResult === "valid" && matrix.entryCount > 0,
    `${matrix.entryCount} entries`
  );
}

function verifyManifestIntegrity(timestamp: string): SharedMentalModelPlatformCertificationCheck {
  const manifest = buildSharedMentalModelPlatformManifest(timestamp, "certified");
  return check(
    "manifest_integrity",
    "Platform manifest integrity",
    validateSharedMentalModelPlatformManifest(manifest) && manifest.certifiedPhases.length === 7,
    manifest.manifestId
  );
}

function verifyExtensionPolicyCompleteness(): SharedMentalModelPlatformCertificationCheck {
  return check(
    "extension_policy_completeness",
    "Extension policy is complete",
    SMM_EXTENSION_POLICY.length >= 5,
    `${SMM_EXTENSION_POLICY.length} policy rules`
  );
}

function verifyReleaseMetadataCompleteness(): SharedMentalModelPlatformCertificationCheck {
  const registry = getSharedMentalModelPlatformRegistry();
  return check(
    "release_metadata_completeness",
    "Release metadata is complete",
    registry.releaseVersion.length > 0 && registry.freezeVersion.length > 0 && registry.releaseStage.length > 0,
    `${registry.releaseVersion}:${registry.freezeVersion}`
  );
}

function verifyBoundaryCompliance(): SharedMentalModelPlatformCertificationCheck {
  const freezeFiles = [
    "sharedMentalModelPlatformFreezeRegistry.ts",
    "sharedMentalModelPlatformRegression.ts",
    "sharedMentalModelPlatformCertification.ts",
  ];
  const violations: string[] = [];
  for (const phase of getSharedMentalModelCertifiedPhaseRegistrations()) {
    for (const file of phase.requiredFiles) {
      if (freezeFiles.includes(file)) {
        continue;
      }
      const path = join(SMM_LIBRARY_DIR, file);
      try {
        const source = readFileSync(path, "utf8");
        if (source.includes("fetch(")) {
          violations.push(file);
        }
      } catch {
        violations.push(file);
      }
    }
  }
  return check(
    "boundary_compliance",
    "Certified MVP phases avoid provider fetch calls",
    violations.length === 0,
    violations.length === 0 ? "No fetch() in MVP contracts/exports" : violations.slice(0, 3).join(", ")
  );
}

function verifyArchitectureIntegrity(): SharedMentalModelPlatformCertificationCheck {
  const matrix = getSharedMentalModelPlatformCompatibilityMatrix();
  const mvpChain = matrix.entries.filter(
    (entry) => entry.relationship === "additive_mvp_dependency" && !entry.compatible
  );
  return check(
    "architecture_integrity",
    "MVP phase chain remains architecturally intact",
    mvpChain.length === 0,
    `${SMM_CERTIFIED_MVP_PHASE_KEYS.length} phases chained`
  );
}

function verifyFreezePrinciples(): SharedMentalModelPlatformCertificationCheck {
  return check(
    "freeze_principles",
    "Platform freeze principles are declared",
    SMM_PLATFORM_FREEZE_PRINCIPLES.includes("never_modifies_certified_phases"),
    "freeze principles verified"
  );
}

export function runSharedMentalModelPlatformCertification(
  timestamp: string = "2026-01-01T00:00:00.000Z"
): SharedMentalModelPlatformCertificationResult {
  const regression = runSharedMentalModelPlatformRegression(timestamp);
  const checks: SharedMentalModelPlatformCertificationCheck[] = [
    verifyPlatformIdentity(),
    verifyRequiredPhasesExist(),
    verifyRegistryIntegrity(),
    verifyCompatibilityMatrix(),
    verifyManifestIntegrity(timestamp),
    verifyExtensionPolicyCompleteness(),
    verifyReleaseMetadataCompleteness(),
    verifyBoundaryCompliance(),
    verifyArchitectureIntegrity(),
    verifyFreezePrinciples(),
    check(
      "regression_success",
      "Regression suite passed",
      regression.success,
      regression.summary
    ),
  ];
  const passed = checks.filter((entry) => entry.passed).length;
  const success = passed === checks.length;
  return Object.freeze({
    success,
    certificationStatus: success ? ("certified" as const) : ("failed" as const),
    checksPassed: passed,
    checksTotal: checks.length,
    summary: success
      ? "The Shared Mental Model Platform is Certified, Frozen, and Released."
      : `${passed}/${checks.length} certification checks passed.`,
    checks: Object.freeze(checks),
    regression,
    timestamp,
    readOnly: true as const,
  });
}
