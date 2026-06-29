/**
 * APP-10:9 — Cross-Scenario Learning Platform Freeze runner.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { certifyCrossScenarioLearningPlatform } from "./crossScenarioLearningPlatformCertification.ts";
import { buildCrossScenarioLearningPlatformFreezeManifest } from "./crossScenarioLearningPlatformFreezeManifest.ts";
import type { CrossScenarioLearningPlatformFreezeManifest } from "./crossScenarioLearningPlatformFreezeManifest.ts";
import {
  CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_CONTRACT_VERSION,
  CROSS_SCENARIO_LEARNING_PLATFORM_RELEASE_TAG,
  registerCrossScenarioLearningPlatformFreezeManifest,
  resetCrossScenarioLearningPlatformFreezeRegistryForTests,
} from "./crossScenarioLearningPlatformFreezeRegistry.ts";
import { validateCrossScenarioLearningPlatformFreeze } from "./crossScenarioLearningPlatformFreezeValidation.ts";
import type {
  CrossScenarioLearningPlatformFreezeCertificationDependency,
  CrossScenarioLearningPlatformFreezeCheck,
  CrossScenarioLearningPlatformFreezeRunResult,
} from "./crossScenarioLearningPlatformFreezeTypes.ts";

const FREEZE_CHECK_IDS = Object.freeze([
  "A_certification_pass",
  "B_ready_for_freeze",
  "C_manifest_valid",
  "D_release_identity_valid",
  "E_phases_registered",
  "F_public_apis_registered",
  "G_consumers_registered",
  "H_compatibility_matrix_valid",
  "I_extension_policy_valid",
  "J_forbidden_changes_listed",
  "K_release_flags_valid",
  "L_ready_for_release",
  "M_no_new_runtime_behavior",
  "N_no_ui_logic",
  "O_no_dashboard_logic",
  "P_no_assistant_logic",
  "Q_no_persistence_logic",
  "R_no_ml_logic",
  "T_no_prior_platform_coupling",
  "U_prior_platforms_untouched",
] as const);

let lastFreezeResult: CrossScenarioLearningPlatformFreezeRunResult | null = null;

function check(id: string, title: string, passed: boolean, evidence: string): CrossScenarioLearningPlatformFreezeCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readModule(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function verifyFreezeModuleClean(pattern: RegExp, label: string): CrossScenarioLearningPlatformFreezeCheck {
  const sources = [
    readModule("app/lib/cross-scenario-learning/crossScenarioLearningPlatformFreeze.ts"),
    readModule("app/lib/cross-scenario-learning/crossScenarioLearningPlatformFreezeCompatibility.ts"),
    readModule("app/lib/cross-scenario-learning/crossScenarioLearningPlatformFreezeTypes.ts"),
  ].join("\n");
  const passed = !pattern.test(sources);
  return check(`no_${label}`, `No ${label} logic`, passed, passed ? "freeze modules clean" : `${label} pattern detected`);
}

function toCertificationDependency(
  certification: ReturnType<typeof certifyCrossScenarioLearningPlatform>
): CrossScenarioLearningPlatformFreezeCertificationDependency {
  return Object.freeze({
    certified: certification.certified,
    readyForFreeze: certification.readyForFreeze,
    report: certification.report,
    readOnly: true as const,
  });
}

function buildFreezeChecks(
  certification: CrossScenarioLearningPlatformFreezeCertificationDependency,
  manifest: CrossScenarioLearningPlatformFreezeManifest | null,
  validation: ReturnType<typeof validateCrossScenarioLearningPlatformFreeze>
): readonly CrossScenarioLearningPlatformFreezeCheck[] {
  return Object.freeze([
    check(
      "A_certification_pass",
      "APP-10:8 certification PASS",
      certification.certified === true && certification.report.certified === true,
      certification.certified ? "PASS" : "FAIL"
    ),
    check(
      "B_ready_for_freeze",
      "readyForFreeze true",
      certification.readyForFreeze === true,
      String(certification.readyForFreeze)
    ),
    check(
      "C_manifest_valid",
      "Freeze manifest valid",
      validation.manifestPass === true,
      validation.checks.find((entry) => entry.id === "manifest_valid")?.evidence ?? "invalid"
    ),
    check(
      "D_release_identity_valid",
      "Release identity valid",
      manifest?.appId === "APP-10" && manifest?.releaseVersion === "APP-10",
      manifest?.releaseVersion ?? "missing"
    ),
    check(
      "E_phases_registered",
      "Certified phases registered",
      validation.registryPass === true && (manifest?.certifiedPhases.length ?? 0) === 9,
      String(manifest?.certifiedPhases.length ?? 0)
    ),
    check(
      "F_public_apis_registered",
      "Public APIs registered",
      (manifest?.publicApis.length ?? 0) >= 30,
      String(manifest?.publicApis.length ?? 0)
    ),
    check(
      "G_consumers_registered",
      "Consumers registered",
      (manifest?.consumers.length ?? 0) === 4,
      String(manifest?.consumers.length ?? 0)
    ),
    check(
      "H_compatibility_matrix_valid",
      "Compatibility matrix valid",
      validation.compatibilityPass === true,
      manifest?.compatibilityMatrix.compatibilityVersion ?? "missing"
    ),
    check(
      "I_extension_policy_valid",
      "Extension policy valid",
      manifest?.extensionPolicy.facadeRequired === true &&
        manifest?.extensionPolicy.layCompatibilityRequired === true &&
        (manifest?.allowedFutureExtensions.length ?? 0) >= 10,
      String(manifest?.allowedFutureExtensions.length ?? 0)
    ),
    check(
      "J_forbidden_changes_listed",
      "Forbidden changes listed",
      (manifest?.forbiddenChanges.length ?? 0) >= 10,
      String(manifest?.forbiddenChanges.length ?? 0)
    ),
    check(
      "K_release_flags_valid",
      "Release flags valid",
      manifest?.releaseStatus.certified === true &&
        manifest?.releaseStatus.frozen === true &&
        manifest?.releaseStatus.released === true,
      "certified/frozen/released"
    ),
    check(
      "L_ready_for_release",
      "readyForRelease true",
      manifest?.readyForRelease === true,
      String(manifest?.readyForRelease ?? false)
    ),
    validation.checks.find((entry) => entry.id === "no_new_runtime_behavior") ??
      check("M_no_new_runtime_behavior", "No new runtime behavior", false, "missing check"),
    verifyFreezeModuleClean(/React\.|useState|\.tsx/, "ui"),
    verifyFreezeModuleClean(/export\s+(function|const)\s+\w*Dashboard\w*\s*=|class\s+\w*DashboardAdapter/, "dashboard"),
    verifyFreezeModuleClean(/export\s+(function|const)\s+\w*Assistant\w*\s*=|class\s+\w*AssistantAdapter/, "assistant"),
    verifyFreezeModuleClean(/localStorage|indexedDB|await\s+fetch\s*\(/, "persistence"),
    verifyFreezeModuleClean(/export\s+(function|const)\s+\w*(MachineLearning|VectorSearch|Embedding|NeuralNetwork)\w*\s*=/, "ml"),
    verifyFreezeModuleClean(/recommendationGenerator\s*\(|generateRecommendation\s*\(/, "recommendation_generation"),
    check(
      "T_no_prior_platform_coupling",
      "No prior platform internal coupling in freeze modules",
      !/from\s+["'].*(?:scenario-timeline|decision-timeline|business-timeline|decision-journal|confidence-evolution)\//.test(
        readModule("app/lib/cross-scenario-learning/crossScenarioLearningPlatformFreeze.ts")
      ),
      "freeze entry clean"
    ),
    validation.checks.find((entry) => entry.id === "prior_platforms_untouched") ??
      check("U_prior_platforms_untouched", "Prior platforms untouched", false, "missing check"),
  ]);
}

export function runCrossScenarioLearningPlatformFreeze(
  timestamp: string = "2026-01-01T00:00:00.000Z"
): CrossScenarioLearningPlatformFreezeRunResult {
  const certification = toCertificationDependency(certifyCrossScenarioLearningPlatform(timestamp));

  if (!certification.readyForFreeze || !certification.certified) {
    const validation = validateCrossScenarioLearningPlatformFreeze(certification, null);
    const checks = buildFreezeChecks(certification, null, validation);
    const passedCount = checks.filter((entry) => entry.passed).length;
    const result = Object.freeze({
      freezeVersion: CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_CONTRACT_VERSION,
      certified: false,
      frozen: false,
      released: false,
      readyForRelease: false,
      status: "FAIL" as const,
      summary: "Platform freeze rejected: APP-10:8 certification is not ready for freeze.",
      releaseTag: CROSS_SCENARIO_LEARNING_PLATFORM_RELEASE_TAG,
      manifest: null,
      certification,
      validation,
      checks,
      score: checks.length === 0 ? 0 : Math.round((passedCount / checks.length) * 100),
      readOnly: true as const,
    });
    lastFreezeResult = result;
    return result;
  }

  const manifest = buildCrossScenarioLearningPlatformFreezeManifest(certification, timestamp);
  registerCrossScenarioLearningPlatformFreezeManifest(manifest);
  const validation = validateCrossScenarioLearningPlatformFreeze(certification, manifest);
  const checks = buildFreezeChecks(certification, manifest, validation);
  const success = validation.valid && checks.every((entry) => entry.passed);
  const passedCount = checks.filter((entry) => entry.passed).length;

  const result = Object.freeze({
    freezeVersion: CROSS_SCENARIO_LEARNING_PLATFORM_FREEZE_CONTRACT_VERSION,
    certified: success,
    frozen: success,
    released: success,
    readyForRelease: success,
    status: success ? ("PASS" as const) : ("FAIL" as const),
    summary: success
      ? "APP-10 Cross-Scenario Learning Platform CERTIFIED, FROZEN, and RELEASED."
      : `APP-10:9 Platform freeze FAILED (${checks.filter((entry) => !entry.passed).length} gate(s)).`,
    releaseTag: CROSS_SCENARIO_LEARNING_PLATFORM_RELEASE_TAG,
    manifest,
    certification,
    validation,
    checks,
    score: checks.length === 0 ? 0 : Math.round((passedCount / checks.length) * 100),
    readOnly: true as const,
  });

  lastFreezeResult = result;
  return result;
}

export function getCrossScenarioLearningPlatformFreezeReport(): CrossScenarioLearningPlatformFreezeRunResult | null {
  return lastFreezeResult;
}

export function resetCrossScenarioLearningPlatformFreezeForTests(): void {
  lastFreezeResult = null;
  resetCrossScenarioLearningPlatformFreezeRegistryForTests();
}

export const CrossScenarioLearningPlatformFreezeRunner = Object.freeze({
  runCrossScenarioLearningPlatformFreeze,
  getCrossScenarioLearningPlatformFreezeReport,
  resetCrossScenarioLearningPlatformFreezeForTests,
});
