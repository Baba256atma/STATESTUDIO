/**
 * LLM-12 — Platform certification validation.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { getLlmPlatformCompatibilityMatrix } from "./llmPlatformCompatibility.ts";
import {
  getLlmCertifiedPhaseRegistrations,
  getLlmPlatformRegistry,
  LLM_CERTIFIED_MVP_PHASE_KEYS,
  LLM_PLATFORM_FREEZE_PRINCIPLES,
} from "./llmPlatformFreezeRegistry.ts";
import type { LlmPlatformCertificationCheck, LlmPlatformCertificationResult } from "./llmPlatformFreezeTypes.ts";
import { runLlmPlatformRegression } from "./llmPlatformRegression.ts";
import { buildLlmPlatformFreezeManifest } from "./llmPlatformFreezeManifest.ts";

const LLM_LIBRARY_DIR = dirname(fileURLToPath(import.meta.url));

function check(id: string, title: string, passed: boolean, evidence: string): LlmPlatformCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function verifyRequiredPhasesExist(): LlmPlatformCertificationCheck {
  const phases = getLlmCertifiedPhaseRegistrations();
  return check(
    "required_phases_exist",
    "All required MVP phases are registered",
    phases.length === LLM_CERTIFIED_MVP_PHASE_KEYS.length,
    `${phases.length}/${LLM_CERTIFIED_MVP_PHASE_KEYS.length} phases`
  );
}

function verifyRegistryIntegrity(): LlmPlatformCertificationCheck {
  const registry = getLlmPlatformRegistry();
  return check(
    "registry_integrity",
    "Platform registry integrity",
    registry.phaseCount === 11 && registry.publicApis.length > 0 && registry.extensionPoints.length > 0,
    `phases=${registry.phaseCount}, apis=${registry.publicApis.length}, extensions=${registry.extensionPoints.length}`
  );
}

function verifyCompatibilityMatrix(): LlmPlatformCertificationCheck {
  const matrix = getLlmPlatformCompatibilityMatrix();
  return check(
    "compatibility_matrix",
    "Compatibility matrix is valid",
    matrix.validationResult === "valid" && matrix.entryCount > 0,
    `${matrix.entryCount} entries`
  );
}

function verifyManifestIntegrity(timestamp: string): LlmPlatformCertificationCheck {
  const manifest = buildLlmPlatformFreezeManifest(timestamp, "certified");
  return check(
    "manifest_integrity",
    "Freeze manifest integrity",
    manifest.certifiedPhases.length === 11 && manifest.certificationStatus === "certified",
    manifest.manifestId
  );
}

function verifyBoundaryCompliance(): LlmPlatformCertificationCheck {
  const freezeFiles = [
    "llmPlatformFreezeRegistry.ts",
    "llmPlatformRegression.ts",
    "llmPlatformCertification.ts",
  ];
  const violations: string[] = [];
  for (const phase of getLlmCertifiedPhaseRegistrations()) {
    for (const file of phase.requiredFiles) {
      if (freezeFiles.includes(file)) {
        continue;
      }
      const path = join(LLM_LIBRARY_DIR, file);
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

function verifyProviderIndependence(): LlmPlatformCertificationCheck {
  return check(
    "provider_independence",
    "Platform principles declare provider independence",
    LLM_PLATFORM_FREEZE_PRINCIPLES.includes("consumes_llm_1_through_llm_11_only"),
    "freeze principles verified"
  );
}

function verifyArchitectureIntegrity(): LlmPlatformCertificationCheck {
  const matrix = getLlmPlatformCompatibilityMatrix();
  const mvpChain = matrix.entries.filter(
    (entry) => entry.relationship === "additive_mvp_dependency" && !entry.compatible
  );
  return check(
    "architecture_integrity",
    "MVP phase chain remains architecturally intact",
    mvpChain.length === 0,
    `${LLM_CERTIFIED_MVP_PHASE_KEYS.length} phases chained`
  );
}

function verifyDeterministicContracts(): LlmPlatformCertificationCheck {
  const phases = getLlmCertifiedPhaseRegistrations();
  const hasPrinciples = phases.every((phase) => phase.publicApis.length > 0 && phase.title.length > 0);
  return check(
    "deterministic_contracts",
    "Deterministic contract metadata is complete",
    hasPrinciples,
    "phase metadata complete"
  );
}

export function runLlmPlatformCertification(
  timestamp: string = "2026-01-01T00:00:00.000Z"
): LlmPlatformCertificationResult {
  const regression = runLlmPlatformRegression(timestamp);
  const checks: LlmPlatformCertificationCheck[] = [
    verifyRequiredPhasesExist(),
    verifyRegistryIntegrity(),
    verifyCompatibilityMatrix(),
    verifyManifestIntegrity(timestamp),
    verifyBoundaryCompliance(),
    verifyProviderIndependence(),
    verifyArchitectureIntegrity(),
    verifyDeterministicContracts(),
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
      ? "Nexora LLM Platform certified, frozen, and released."
      : `${passed}/${checks.length} certification checks passed.`,
    checks: Object.freeze(checks),
    regression,
    timestamp,
    readOnly: true as const,
  });
}
