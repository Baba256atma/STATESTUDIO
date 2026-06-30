/**
 * ASS-9 — Platform certification validation.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { getExecutiveAssistantPlatformCompatibilityMatrix } from "./executiveAssistantPlatformCompatibility.ts";
import {
  ASS_CERTIFIED_MVP_PHASE_KEYS,
  ASS_EXTENSION_POLICY,
  ASS_PLATFORM_FREEZE_PRINCIPLES,
  ASS_PLATFORM_RELEASE_DECLARATION,
  getExecutiveAssistantCertifiedPhaseRegistrations,
  getExecutiveAssistantPlatformRegistry,
} from "./executiveAssistantPlatformFreezeRegistry.ts";
import type {
  ExecutiveAssistantPlatformCertificationCheck,
  ExecutiveAssistantPlatformCertificationResult,
} from "./executiveAssistantPlatformFreezeTypes.ts";
import {
  buildExecutiveAssistantPlatformManifest,
  validateExecutiveAssistantPlatformManifest,
} from "./executiveAssistantPlatformFreezeManifest.ts";
import { runExecutiveAssistantPlatformRegression } from "./executiveAssistantPlatformRegression.ts";

const ASS_LIBRARY_DIR = dirname(fileURLToPath(import.meta.url));

function check(id: string, title: string, passed: boolean, evidence: string): ExecutiveAssistantPlatformCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function verifyPlatformIdentity(): ExecutiveAssistantPlatformCertificationCheck {
  const registry = getExecutiveAssistantPlatformRegistry();
  return check(
    "platform_identity",
    "Platform identity is registered",
    registry.platformId === "executive-assistant-platform" && registry.platformName.length > 0,
    `${registry.platformId}:${registry.platformName}`
  );
}

function verifyRequiredPhasesExist(): ExecutiveAssistantPlatformCertificationCheck {
  const phases = getExecutiveAssistantCertifiedPhaseRegistrations();
  return check(
    "required_phases_exist",
    "All required MVP phases are registered",
    phases.length === ASS_CERTIFIED_MVP_PHASE_KEYS.length,
    `${phases.length}/${ASS_CERTIFIED_MVP_PHASE_KEYS.length} phases`
  );
}

function verifyRegistryIntegrity(): ExecutiveAssistantPlatformCertificationCheck {
  const registry = getExecutiveAssistantPlatformRegistry();
  return check(
    "registry_integrity",
    "Platform registry integrity",
    registry.phaseCount === 8 && registry.publicApis.length > 0 && registry.extensionPoints.length > 0,
    `phases=${registry.phaseCount}, apis=${registry.publicApis.length}, extensions=${registry.extensionPoints.length}`
  );
}

function verifyCompatibilityMatrix(): ExecutiveAssistantPlatformCertificationCheck {
  const matrix = getExecutiveAssistantPlatformCompatibilityMatrix();
  return check(
    "compatibility_matrix",
    "Compatibility matrix is valid",
    matrix.validationResult === "valid" && matrix.entryCount > 0,
    `${matrix.entryCount} entries`
  );
}

function verifyManifestIntegrity(timestamp: string): ExecutiveAssistantPlatformCertificationCheck {
  const manifest = buildExecutiveAssistantPlatformManifest(timestamp, "certified");
  return check(
    "manifest_integrity",
    "Platform manifest integrity",
    validateExecutiveAssistantPlatformManifest(manifest) && manifest.certifiedPhases.length === 8,
    manifest.manifestId
  );
}

function verifyExtensionPolicyCompleteness(): ExecutiveAssistantPlatformCertificationCheck {
  return check(
    "extension_policy_completeness",
    "Extension policy is complete",
    ASS_EXTENSION_POLICY.length >= 5,
    `${ASS_EXTENSION_POLICY.length} policy rules`
  );
}

function verifyReleaseMetadataCompleteness(): ExecutiveAssistantPlatformCertificationCheck {
  const registry = getExecutiveAssistantPlatformRegistry();
  return check(
    "release_metadata_completeness",
    "Release metadata is complete",
    registry.releaseVersion.length > 0 && registry.freezeVersion.length > 0 && registry.releaseStage.length > 0,
    `${registry.releaseVersion}:${registry.freezeVersion}`
  );
}

function verifyBoundaryCompliance(): ExecutiveAssistantPlatformCertificationCheck {
  const freezeFiles = [
    "executiveAssistantPlatformFreezeRegistry.ts",
    "executiveAssistantPlatformRegression.ts",
    "executiveAssistantPlatformCertification.ts",
  ];
  const violations: string[] = [];
  for (const phase of getExecutiveAssistantCertifiedPhaseRegistrations()) {
    for (const file of phase.requiredFiles) {
      if (freezeFiles.includes(file)) {
        continue;
      }
      const path = join(ASS_LIBRARY_DIR, file);
      try {
        const source = readFileSync(path, "utf8");
        if (/\bfetch\s*\(/.test(source)) {
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

function verifyArchitectureIntegrity(): ExecutiveAssistantPlatformCertificationCheck {
  const matrix = getExecutiveAssistantPlatformCompatibilityMatrix();
  const broken = matrix.entries.filter(
    (entry) => entry.relationship === "additive_mvp_dependency" && !entry.compatible
  );
  return check(
    "architecture_integrity",
    "MVP phase chain remains architecturally intact",
    broken.length === 0,
    `${ASS_CERTIFIED_MVP_PHASE_KEYS.length} phases chained`
  );
}

function verifyFreezePrinciples(): ExecutiveAssistantPlatformCertificationCheck {
  return check(
    "freeze_principles",
    "Platform freeze principles are declared",
    ASS_PLATFORM_FREEZE_PRINCIPLES.includes("never_modifies_certified_phases"),
    "freeze principles verified"
  );
}

function verifyOfficialPublication(timestamp: string): ExecutiveAssistantPlatformCertificationCheck {
  const manifest = buildExecutiveAssistantPlatformManifest(timestamp, "certified");
  return check(
    "official_publication",
    "Official platform publication is declared",
    manifest.officialPublication === ASS_PLATFORM_RELEASE_DECLARATION,
    manifest.officialPublication
  );
}

function verifyPlatformReadyForFutureRuntime(): ExecutiveAssistantPlatformCertificationCheck {
  return check(
    "platform_ready_for_runtime",
    "Platform contracts are ready for future runtime consumption",
    ASS_EXTENSION_POLICY.includes("runtime_engines_consume_frozen_contracts_only"),
    "runtime consumption policy verified"
  );
}

export function runExecutiveAssistantPlatformCertification(
  timestamp: string = "2026-01-01T00:00:00.000Z"
): ExecutiveAssistantPlatformCertificationResult {
  const regression = runExecutiveAssistantPlatformRegression(timestamp);
  const checks: ExecutiveAssistantPlatformCertificationCheck[] = [
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
    verifyOfficialPublication(timestamp),
    verifyPlatformReadyForFutureRuntime(),
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
    summary: success ? ASS_PLATFORM_RELEASE_DECLARATION : `${passed}/${checks.length} certification checks passed.`,
    checks: Object.freeze(checks),
    regression,
    timestamp,
    readOnly: true as const,
  });
}
